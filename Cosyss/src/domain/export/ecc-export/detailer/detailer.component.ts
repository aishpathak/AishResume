import { Component, NgZone, ElementRef, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { EccService } from '../ecc.service';
import { FlightSearchQuery, ShipmentData, Advice } from '../ecc.sharedmodel';
import {
    NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcDropDownComponent, NgcButtonComponent,
    NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest,
    BaseResponse, NgcFormControl, BaseRequest, CellsRendererStyle, NgcReportComponent
} from 'ngc-framework';

@Component({
    selector: 'app-detailer',
    templateUrl: './detailer.component.html',
    styleUrls: ['./detailer.component.scss']
})
export class DetailerComponent extends NgcPage {
    @ViewChild('addAwbWindow') addAwbWindow: NgcWindowComponent;
    @ViewChild('addPlanningwindow') addPlanningwindow: NgcWindowComponent;
    @ViewChild('awbDetailsWindow') awbDetailsWindow: NgcWindowComponent;
    @ViewChild("reportWindow") reportWindow: NgcReportComponent;
    @ViewChild("dateReportWindow") dateReportWindow: NgcReportComponent;
    @ViewChild("keyReportWindow") keyReportWindow: NgcReportComponent;

    response: any;
    showTable = false;
    reportParameters: any;
    searchData: any;

    private form = new NgcFormGroup({

        search: new NgcFormGroup({
            flightDate: new NgcFormControl(),
            fromDate: new NgcFormControl(),
            toDate: new NgcFormControl(),
            flightKey: new NgcFormControl(),
            expressService: new NgcFormControl()
        }),

        advice: new NgcFormGroup({
            flightOriginDate: new NgcFormControl('', Validators.required),
            plannedShiftStartTime: new NgcFormControl(),
            plannedShiftEndTime: new NgcFormControl(),
            plannedDate: new NgcFormControl(),
            flightKey: new NgcFormControl('', Validators.required),
            offPoint: new NgcFormControl(),
            advice: new NgcFormControl('', Validators.required)
        }),

        shipment: new NgcFormGroup({
            shipmentNumber: new NgcFormControl('', Validators.required),
            shipmentDate: new NgcFormControl(),
            documentPieces: new NgcFormControl(),
            documentWeight: new NgcFormControl(),
            outgoingFlightNumber: new NgcFormControl('', Validators.required),
            dateSTD: new NgcFormControl('', Validators.required),
            flightOffPoint: new NgcFormControl(),
            parkingBayDepAircraft: new NgcFormControl(),
            customerCode: new NgcFormControl('', Validators.required),
            specialHandlingCode: new NgcFormControl(),
            uldNumber: new NgcFormControl(),
            acceptedPieces: new NgcFormControl(),
            acceptedWeight: new NgcFormControl(),
            shcHandlingGroupCode: new NgcFormControl(),
            expressService: new NgcFormControl(),
            labelPrintedBy: new NgcFormControl(),
            labelPrintedAt: new NgcFormControl(),
            shipmentStatus: new NgcFormControl(),
            noShowFlag: new NgcFormControl(),
            noShowMarkedBy: new NgcFormControl(),
            noShowMarkedAt: new NgcFormControl(),
            planningAdviceId: new NgcFormControl()
        }),

        resultList: new NgcFormArray([])
    });

    private addPlanningForm = new NgcFormGroup({
        flight: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        off: new NgcFormControl(),
        planningAdvice: new NgcFormControl()
    });

    private addAwbForm = new NgcFormGroup({
        weight: new NgcFormControl(),
        pieces: new NgcFormControl(),
        bay: new NgcFormControl(),
        units: new NgcFormControl(),
        shc: new NgcFormControl(),
        awbNo: new NgcFormControl(),
        addAwbList: new NgcFormArray([
        ]),
    });

    private awbDetailsForm = new NgcFormGroup({
        AwbDetailsList: new NgcFormArray([])
    });

    constructor(
        appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private eccService: EccService, private router: Router, private activatedRoute: ActivatedRoute) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        // Must Call  
        this.searchData = this.getNavigateData(this.activatedRoute);
        this.form.get("search").get("fromDate").patchValue(this.searchData.fromDate);
        this.form.get("search").get("toDate").patchValue(this.searchData.toDate);
        this.form.get("search").get("flightDate").patchValue(this.searchData.flightDate);
        this.form.get("search").get("flightKey").patchValue(this.searchData.flightKey);
        this.form.get("search").get("expressService").patchValue(this.searchData.expressService);
        this.onSearch();
        super.ngOnInit();
    }

    searchValidation(): boolean {
        let reruiredField = this.form.get('search').value;
        return (reruiredField.fromDate && reruiredField.toDate) || (reruiredField.flightKey && reruiredField.flightDate) ? true : false;
    }

    private onSearch() {
        if (!this.searchValidation()) {
            this.showErrorMessage('export.fill.date.range.or.flight.details');
            return;
        }
        let request: FlightSearchQuery = new FlightSearchQuery();
        request = this.form.get('search').value;
        this.eccService.getDetailerWorksheet(request).subscribe(data => {
            this.response = data;
            this.refreshFormMessages(data);
            if (this.response.data != null) {
                (<NgcFormArray>this.form.get('resultList')).resetValue([]);
                this.form.get('resultList').patchValue(this.response.data);
                this.showTable = true;
            } else {
                this.showTable = false;
                // this.showErrorStatus(this.response.messageList[0].message);
            }
        }, error => {
            this.showTable = false;
            // this.showErrorStatus('Error:' + error);
        });
    }

    backToPlanning(event) {
        this.navigateBack(this.searchData);
    }

    onClear(event) {
        this.form.get('search').reset();
        this.showTable = false;
    }

    flightReport(event) {
        if (!this.searchValidation()) {
            this.showErrorMessage('export.fill.date.range.or.flight.details');
            return;
        }

        let requiredField = this.form.get('search').value;

        this.reportParameters = new Object();
        console.log(this.form.get('search').get('flightKey').value)
        //to set Key Parameter
        if ((requiredField.fromDate && requiredField.toDate) && (requiredField.flightKey && requiredField.flightDate)) {
            this.reportParameters.flightKey = this.form.get('search').get('flightKey').value;
            this.reportParameters.flightDate = this.form.get('search').get('flightDate').value;
            this.reportParameters.fromDate = this.form.get('search').get('fromDate').value;
            this.reportParameters.toDate = this.form.get('search').get('toDate').value;
            this.reportWindow.open();
        }
        else if ((requiredField.fromDate && requiredField.toDate)) {
            this.reportParameters.from = this.form.get('search').get('fromDate').value;
            this.reportParameters.to = this.form.get('search').get('toDate').value;
            this.dateReportWindow.open();
        }
        else if (requiredField.flightKey && requiredField.flightDate) {
            this.reportParameters.fkey = this.form.get('search').get('flightKey').value;
            this.reportParameters.fdate = this.form.get('search').get('flightDate').value;
            this.keyReportWindow.open();
        }
        console.log(this.reportParameters);
    }
}
