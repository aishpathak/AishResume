import { ApplicationEntities } from './../../common/applicationentities';
import { ViewChild } from '@angular/core';

// Angular
import { Component, NgZone, ElementRef, ViewContainerRef, OnInit, AfterViewInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// Application
import {
    NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcFormControl, NotificationMessage, StatusMessage, NgcReportComponent,
    DropDownListRequest, MessageType, NgcCheckBoxComponent, NgcUtility, PageConfiguration, DateTimeKey, ReportFormat
} from 'ngc-framework';
// Services
import { FlightService } from '../../flight/flight.service';
import { DisplayOperativeRequest, DisplayOperativeResponse } from '../flight.sharedmodel';


@Component({
    selector: 'ngc-displayoperativeflight',
    templateUrl: './displayoperativeflight.component.html',
    styleUrls: ['./displayoperativeflight.component.scss']
})
/**
  * Displaying the operative flight on   carrierCode,fromDate,toDate ,fromSector,toSector,
  *
  * @param insertData
  * @param index
*/
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    autoBackNavigation: true,
    restorePageOnBack: true
})

export class DisplayOperativeFlightComponent extends NgcPage implements OnInit {

    resp: any;
    expandorcollapse: any = true;
    isDisplayOptflag: boolean;
    toMin: Date;
    toMax: Date;
    testedData: string;
    importBay: boolean;
    exportBay: boolean;
    @ViewChild('reportWindow') reportWindow: NgcReportComponent;
    @ViewChild('dailyreportWindow') dailyreportWindow: NgcReportComponent;
    reportParameters: any;
    dataDisplay: any = false;
    @ViewChild('carrierCode') carrierCode: HTMLElement;

    private dspform: NgcFormGroup = new NgcFormGroup({

        carrierCode: new NgcFormControl('', Validators.pattern('([0-9A-Za-z]{2,3})')),
        fromDate: new NgcFormControl(),
        toDate: new NgcFormControl(),
        fromSector: new NgcFormControl('', Validators.pattern('([A-Za-z]{2,3})')),
        toSector: new NgcFormControl('', Validators.pattern('([A-Za-z]{2,3})')),
        resultList: new NgcFormArray(
            [
            ]
        )

    });
    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private router: Router
        , private activatedRoute: ActivatedRoute, private flightService: FlightService) {
        super(appZone, appElement, appContainerElement);
    }
    /**
      * On Initialization
    */
    public ngOnInit(): void {
        super.ngOnInit();
        const transferData = this.getNavigateData(this.activatedRoute);
        if (transferData) {
            this.dspform.get('carrierCode').setValue(transferData.record.carrierCode);
            this.dspform.get('fromDate').setValue(transferData.record.dateFrom);
            this.dspform.get('toDate').setValue(transferData.record.dateTo);
            this.dspform.get('fromSector').setValue(transferData.record.boarding);
            this.dspform.get('toSector').setValue(transferData.record.offloading);
            this.dataDisplay = false;
            this.onSearch();
        }
    }

    /**
     * ngAfterViewInit
     * 
     * 
     */
    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.dataDisplay = false;
        this.carrierCode.focus();
        this.dspform.controls['fromDate'].valueChanges.subscribe(data => {
            this.toMin = new Date(this.dspform.get('fromDate').value);
            this.toMax = new Date(this.dspform.get('fromDate').value);
            this.toMin.setDate(this.toMin.getDate() + 0);
            this.toMax.setDate(this.toMax.getDate() + 6);
        });
    }


    /**
    * On search we are displaying the Display operative flight
    *
    * @param event Event
    */
    public onSearch() {
        const request: DisplayOperativeRequest = new DisplayOperativeRequest();
        if (this.dspform.get('carrierCode').value === null || this.dspform.get('carrierCode').value === '') {
            if (this.getUserProfile().userRestrictedAirlines !== null) {
                request.restrictedcarrier = this.getUserProfile().userRestrictedAirlines;
            }
        }
        request.carrierCode = this.dspform.get('carrierCode').value;
        request.fromDate = this.dspform.get('fromDate').value;
        request.toDate = this.dspform.get('toDate').value;
        request.fromSector = this.dspform.get('fromSector').value;
        request.toSector = this.dspform.get('toSector').value;

        if (request.fromSector === '') {
            request.fromSector = null;
        }
        if (request.toSector === '') {
            request.toSector = null;
        }

        if ((request['fromDate'] === '') || (request['fromDate'] === null) || (request['toDate'] === '') || (request['toDate'] === null)
            || (request['fromSector'] === null && NgcUtility.isEntityAttributeRequired(ApplicationEntities.Flight_FromSector))
            || (request['toSector'] === null && NgcUtility.isEntityAttributeRequired(ApplicationEntities.Flight_ToSector))) {
            this.showErrorStatus('flight.mandatory.not.updated');
        }
        else {
            this.flightService.getOperativeFlights(request).subscribe(data => {
                if (!this.showResponseErrorMessages(data)) {
                    this.resp = data;
                    this.refreshFormMessages(data);
                    if (this.resp.data != null) {
                        this.isDisplayOptflag = true;
                        this.resp.data.forEach(enr => {

                            if (enr.flgApn === '1') {
                                enr.flgApn = 'Y';
                            } else {
                                enr.flgApn = 'N';
                            }
                        });
                        this.dataDisplay = true;
                        this.importBay = true;
                        this.exportBay = true;
                        this.updateDataTable();
                    } else {
                        this.dataDisplay = false;
                        this.isDisplayOptflag = false;
                        this.showErrorStatus(this.resp.messageList[0].message);
                    }
                }
            },
                error => {
                    this.showErrorStatus(error);
                });
        }
    }

    printDisplayOperativeFlightReport(type) {
        this.reportParameters = new Object();
        let val: string = this.dspform.get('carrierCode').value;
        if (!val) {
            val = null;
            this.reportParameters.carrier = val;
        }
        else {
            this.reportParameters.carrier = this.dspform.get('carrierCode').value;
        }
        if (this.dspform.get('carrierCode').value === null || this.dspform.get('carrierCode').value === '') {
            if (this.getUserProfile().userRestrictedAirlines !== null) {
                this.reportParameters.restrictedcarrier = this.getUserProfile().userRestrictedAirlines;
            }
        }

        this.reportParameters.fromDate = NgcUtility.getDateAsString(this.dspform.get('fromDate').value);
        this.reportParameters.toDate = NgcUtility.getDateAsString(this.dspform.get('toDate').value); 
        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_AircraftType)){
            this.reportParameters.tenantFromDate = NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.MINUTES);
            this.reportParameters.tenantToDate = NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 1439, DateTimeKey.MINUTES);
        }
        else{
            this.reportParameters.tenantFromDate = this.dspform.get('fromDate').value;
            this.reportParameters.tenantToDate = this.dspform.get('toDate').value;
        }
        this.reportParameters.toSector = this.dspform.get('toSector').value;
        this.reportParameters.fromSector = this.dspform.get('fromSector').value;
        if (this.reportParameters.fromSector === NgcUtility.getTenantConfiguration().airportCode) {
            this.reportParameters.flightType = 'O'
        } else if (this.reportParameters.toSector === NgcUtility.getTenantConfiguration().airportCode) {
            this.reportParameters.flightType = 'I'
        } else {
            this.reportParameters.flightType = 'B'
        }
        this.reportParameters.user = this.getUserProfile().userShortName;
        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_AircraftType)){
            if (type == ReportFormat.XLS) {
                this.dailyreportWindow.format = ReportFormat.XLS;
                this.dailyreportWindow.downloadReport();
            } else {
                this.dailyreportWindow.format = ReportFormat.PDF;
               this.dailyreportWindow.open();
            }
            
        }
        else{
            this.reportWindow.open();
        }
        
    }
    /**
     * Function to bind the data fetched from backend to the array resultList
     *
     */
    updateDataTable() {
        (<NgcFormArray>this.dspform.controls['resultList']).patchValue(this.resp.data);
    }
    expandall() {
        this.expandorcollapse = true;
    } collapseall() {
        this.expandorcollapse = false;
    }
}

