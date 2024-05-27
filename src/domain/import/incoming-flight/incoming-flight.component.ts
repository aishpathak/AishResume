import { ApplicationEntities } from './../../common/applicationentities';
import { Component, NgZone, ElementRef, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
// NGC framework imports
import {
    NgcUtility, DateTimeKey,
    NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcButtonComponent,
    NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest,
    BaseResponse, PageConfiguration, NgcFormControl, BaseRequest, CellsRendererStyle, ErrorMessage, NgcReportComponent, ReportFormat
} from 'ngc-framework';
import { CellsStyleClass } from '../../../shared/shared.data';
import { ImportService } from '../import.service';
import { FlightsResponse, FlightRequest, Flight, IncomingFlightDateRange } from '../import.sharedmodel';
import { IncomingFlightDateRangeData } from '../../../shared/shared.data';

@Component({
    selector: 'app-incoming-flight',
    templateUrl: './incoming-flight.component.html',
    styleUrls: ['./incoming-flight.component.scss']
})
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    restorePageOnBack: false,
    noAutoFocus: true
})
export class IncomingFlightComponent extends NgcPage implements OnInit {
    @ViewChild('iWindow') iWindow: NgcWindowComponent;
    @ViewChild("myFlight") private myFlight: NgcWindowComponent;
    @ViewChild('reportWindow') reportWindow: NgcReportComponent;
    @ViewChild('reportEnquire') reportEnquire: NgcReportComponent;
    @ViewChild("ArrivalManifestButton") ArrivalManifestButton: NgcButtonComponent;
    @ViewChild("EOrderImportuldHandling") EOrderImportuldHandling: NgcButtonComponent;

    @ViewChild('attachTelexPopUp') attachTelexPopUp: NgcWindowComponent;

    selectedGroupCode: string[] = [];

    checkTenant: boolean = false;
    response: any;
    showData: boolean;
    currentDate = new Date();
    defaultFromDate = new Date();
    defaultToDate = new Date();
    timeDiffrence: number;
    fieldNumber: any;
    carrierGroupCodeParam: any;
    fromDate: any;
    toDate: any;
    carrier: boolean = true;
    reportParameters: any;
    domesticFlag: any;
    private carrierFlg: boolean = false;
    aircrafttypeColumn: any = 0;
    dateColumn: any = 4;
    terminalColumn: any = 3;
    carrierColumn: any = 2;
    bubdofficeColumn: any = 0;
    isSpecificTenant: boolean = false;
    request: IncomingFlightDateRange = new IncomingFlightDateRange();
    private form: NgcFormGroup = new NgcFormGroup({
        search: new NgcFormGroup({
            terminalPoint: new NgcFormControl(),
            fromDate: new NgcFormControl(new Date(), Validators.required),
            toDate: new NgcFormControl(),
            fromTime: new NgcFormControl(),
            toTime: new NgcFormControl(),
            carrierGp: new NgcFormControl(),
            carrierCode: new NgcFormControl(),
            flightKey: new NgcFormControl(),
            domesticFlightFlag: new NgcFormControl(),
            arrDepStatus: new NgcFormControl(),
            warehouseLevel: new NgcFormControl(),
            buBdOffice: new NgcFormControl(),
            flightType: new NgcFormControl(),
            rho: new NgcFormControl()
        }
        ),
        attachTelex: new NgcFormGroup({
            flight: new NgcFormControl(),
            flightDate: new NgcFormControl(),
            telexMessage: new NgcFormArray([])
        }),

        resultList: new NgcFormArray([]),
        myflightList: new NgcFormArray([])
    });
    constructor(
        appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private importService: ImportService, private router: Router, private activatedRoute: ActivatedRoute) {
        super(appZone, appElement, appContainerElement);
    }
    ngOnInit() {
        super.ngOnInit();
        this.updateColumnLengthsDynamically();
        this.isSpecificTenant = (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_AircraftType) ? true : false);
        console.log(this.request);
        this.showData = false;
        this.timeDiffrence = 4;
        var transferData = this.getNavigateData(this.activatedRoute)
        this.form.get(['search', 'terminalPoint']).patchValue(this.getUserProfile().terminalId);
        if (transferData != null) {

            this.searchIncomingFlights();
        }
    }

    public onEditClick(index) {
        let data = {
            carrierCode: this.form.get(['resultList', index, 'flight']).value.substring(0, 2),
            flightNo: this.form.get(['resultList', index, 'flight']).value.substring(2, 6),
            flightdateforflight: NgcUtility.getDateOnly(this.form.get(['resultList', index, 'sta']).value)
        }
        this.navigateTo(this.router, "/flight/maintenanceoperativeflight", data);
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();

        if (this.form.get(['search', 'fromDate']).value && this.form.get(['search', 'toDate']).value) {
            this.searchIncomingFlights();
        }
        else {
            this.getConfigurationTime();
        }
        this.resetFormMessages();
    }
    openAttachTelexPopUp() {
        let selectedElement: any;
        let count = 0;
        let items = (<NgcFormArray>this.form.get('resultList').value);
        for (let i = 0; i < items.length; i++) {
            if (items[i].selectItem) {
                selectedElement = items[i];
                count++;
                break;
            }
        }
        if (count == 1) {
            let reqdata: FlightRequest = new FlightRequest();
            reqdata.flightKey = selectedElement.flight;
            reqdata.fromDate = selectedElement.flightDate;
            reqdata.toDate = selectedElement.flightDate;
            this.importService.getIncomingFlightsTelexMessage(reqdata).subscribe(res => {

                this.form.get("attachTelex.flight").setValue(selectedElement.flight);
                this.form.get("attachTelex.flightDate").setValue(selectedElement.flightDate);
                let telexMessage = [];
                res.data.forEach(element => {
                    let telexMessageObj: any = {
                        message: element,
                        sNo: count
                    };
                    count++;
                    telexMessage.push(telexMessageObj);
                });
                this.form.get("attachTelex.telexMessage").patchValue(telexMessage);
                this.attachTelexPopUp.open();
            }, error => {
                this.showData = false;
            });
        }
    }

    getCarrierCodeByCarrierGroup(event) {
        this.carrierFlg = false;
        this.form.get(['search', 'carrierCode']).reset();
        this.selectedGroupCode = [];
        if (event !== null && !event.desc != null) {
            this.selectedGroupCode.push(event['desc']);
            this.carrierFlg = true;
        }
        this.carrierGroupCodeParam = this.createSourceParameter(this.form.get(['search', 'carrierGp']).value[0]);
    }


    private getConfigurationTime() {
        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_AircraftType)) {
            this.form.get(['search', 'fromDate']).patchValue(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.MINUTES));
            this.form.get(['search', 'toDate']).patchValue(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 1439, DateTimeKey.MINUTES));
        }
        else {
            this.importService.getIncomingFlightsConfigurationTimings(this.request).subscribe(res => {
                this.defaultFromDate.setHours(this.currentDate.getHours() - res.data.fromDate)
                this.defaultToDate.setHours(this.currentDate.getHours() + res.data.toDate);
                this.form.get(['search', 'fromDate']).setValue(this.defaultFromDate);
                this.form.get(['search', 'toDate']).setValue(this.defaultToDate);
            }, error => {
                this.showData = false;
            });
        }
    }

    private searchIncomingFlights() {
        const request: FlightRequest = new FlightRequest();
        const dataForm = this.form.get('search');
        let validFrom = new Date();
        let validTo = new Date();
        validFrom = dataForm.get('fromDate').value;
        validTo = dataForm.get('toDate').value;
        if (dataForm.get('domesticFlightFlag').value != null) {
            if (dataForm.get('domesticFlightFlag').value == 'International') {
                this.domesticFlag = 0;
            }
            else if (dataForm.get('domesticFlightFlag').value == 'Domestic') {
                this.domesticFlag = 1;
            }
        }
        else {
            this.domesticFlag = null;
        }
        if (validTo === null) {
            this.showWarningStatus('import.warn108');
            return;
        }
        if (validFrom > validTo) {
            this.showWarningStatus('import.warn109');
            return;
        }

        request.carrierGroup = [];
        //request.carrierGroup = dataForm.get('carrierGp').value;
        if (this.selectedGroupCode !== null && this.selectedGroupCode.length > 0) {
            this.selectedGroupCode.forEach(record => {
                request.carrierGroup.push(record);
            });
        } else {
            request.carrierGroup = [];
        }
        request.carrierCode = dataForm.get('carrierCode').value;
        request.fromDate = dataForm.get('fromDate').value;
        request.toDate = dataForm.get('toDate').value;
        request.terminalPoint = dataForm.get('terminalPoint').value;
        request.flightKey = dataForm.get('flightKey').value;
        request.domesticFlightFlag = this.domesticFlag;
        request.flightType = dataForm.get('flightType').value;
        request.buBdOffice = dataForm.get('buBdOffice').value;
        request.rho = dataForm.get('rho').value;
        request.warehouseLevel = dataForm.get('warehouseLevel').value;
        request.arrDepStatus = dataForm.get('arrDepStatus').value;
        this.resetFormMessages();
        this.importService.getIncomingFlights(request).subscribe(data => {
            this.response = data;
            if (!this.showResponseErrorMessages(data)) {
                this.showData = true;
                // tslint:disable-next-line:prefer-const
                let ft = this.response.data;
                console.log(ft);
                ft.forEach(element => {
                    element.staDate = element.sta;
                    if (element.eta != null) {

                        element.pinned = false;
                        let diff = NgcUtility.dateDifference(element.eta, element.staDate) / 3600000;
                        if (diff >= 6) {
                            element.pinned = true;
                        }
                        NgcUtility.getDateAsString(element.eta) === NgcUtility.getDateAsString(element.staDate) ? element.dc = false : element.dc = true;
                        NgcUtility.getDateAsString(element.ata) === NgcUtility.getDateAsString(element.staDate) ? element.dcA = false : element.dcA = true;
                    }
                    else {
                        element.pinned = false;
                    }
                    // console.log(element);
                });

                let flightList = new Array<any>();
                let sdate = new Date();
                let count = 1;
                for (let i = 0; i < ft.length; i++) {

                    let subList = new Array<any>();
                    for (let j = i + 1; j < ft.length; j++) {
                        console.log(ft[i].igm);
                        if (ft[i].flightId === ft[j].flightId && ft[j].flight !== '') {
                            ft[j].flight = '';
                            ft[j].sta = '';
                            ft[j].eta = '';
                            ft[j].ata = '';
                            ft[j].ata = '';
                            ft[j].tenantId = '';
                            ft[j].throughTransit = '';
                            ft[j].shortTransit = '';
                            ft[j].rampcheck = '';
                            ft[j].documentVerification = '';
                            ft[j].breakdown = '';
                            ft[j].aircraft = '';
                            ft[j].customsImportFlightNumber = '';
                            ft[j].customsImportFlightDate = '';
                            ft[j].warehouseLevel = '';
                            ft[j].buBdOffice = '';
                            ft[j].gate = '';
                            ft[j].staffIDAndDate = '';
                            ft[j].remark = '';
                            ft[j].rho = '';
                            ft[j].arrDepStatus = '';
                            // ft[j].status = '';
                            // ft[j].staDate = ft[j].sta;
                            subList.push(ft[j]);
                        }
                    }
                    if (ft[i].flight) {
                        ft[i].selectItem = false;
                        ft[i].showStatus = true;
                        ft[i].sno = count++;
                        flightList.push(Object.assign({}, ft[i]));
                        flightList[flightList.length - 1].legs = subList;
                    }
                }
                console.log(flightList);
                this.form.get('resultList').patchValue(flightList);
                console.log(this.form.get('resultList').value);
            } else {
                // this.showErrorStatus(this.response.messageList[0].message);
                this.showData = false;
            }
        }, error => {
            // this.showErrorStatus('Error:' + error);
            this.showData = false;
        });
    }

    public cellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
        let date = new Date();
        let strCon: string;
        let shcs: any;
        if (rowData.status) {

            if (rowData[column]) {
                date = rowData[column];
                strCon = date.toTimeString().slice(0, 5);
            } else {
                strCon = '';
            }
            // tslint:disable-next-line:max-line-length
            shcs = '<span style="color:' + this.chooseColor(rowData.status) + ';font-weight:bold;font-size:16x;">' + strCon + '</span>';
        } else {
            if (rowData[column]) {
                date = rowData[column];
                strCon = date.toTimeString().slice(0, 5);
            } else {
                strCon = '';
            }
            shcs = strCon;
        }
        return shcs;
    }

    public cellsRendererETA = (row: number, column: string, value: any, rowData: any): string => {
        let date = new Date();
        let date1 = new Date();
        let strCon: string;
        let eta: any;

        if (rowData.status) {
            if (rowData[column]) {
                date = rowData[column];
                date1 = rowData.sta;
                if (date.getDay() == date1.getDay()) {
                    strCon = date.toTimeString().slice(0, 5);
                }
                else {
                    strCon = date.toTimeString().slice(0, 5);
                }

            } else {
                strCon = '';
            }
            // tslint:disable-next-line:max-line-length
            eta = '<span style="color:' + this.chooseColor(rowData.status) + ';font-weight:bold;font-size:16x;">' + strCon + '</span>';
        } else {
            if (rowData[column]) {
                date = rowData[column];
                date1 = rowData.sta;
                if (date.getDay() == date1.getDay()) {
                    strCon = date.toTimeString().slice(0, 5);
                }
                else {
                    strCon = date.toTimeString().slice(0, 5);
                }
            } else {
                strCon = '';
            }

            eta = strCon;
        }
        console.log(eta);
        return eta;
    }

    public dateCellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
        let date = new Date();
        let strCon: string;
        let shcs: any;
        if (rowData.status) {

            if (rowData[column]) {
                date = rowData[column];
                strCon = date.toDateString().slice(8, 10) + date.toDateString().slice(4, 7) + date.toDateString().slice(11, 15);
            } else {
                strCon = '';
            }
            // tslint:disable-next-line:max-line-length
            shcs = '<span style="color:' + this.chooseColor(rowData.status) + ';font-weight:bold;font-size:16x;">' + strCon + '</span>';
        } else {
            if (rowData[column]) {
                date = rowData[column];
                strCon = date.toDateString().slice(8, 10) + date.toDateString().slice(4, 7) + date.toDateString().slice(11, 15);
            } else {
                strCon = '';
            }
            shcs = strCon;
        }
        return shcs;
    }

    public cellsRenderer1 = (row: number, column: string, value: any, rowData: any): string => {
        let shcs: any;
        if (rowData[column]) {
            if (rowData.status) {
                // tslint:disable-next-line:max-line-length
                shcs = '<span style="color:' + this.chooseColor(rowData.status) + ';font-weight:bold;font-size:16x;">' + rowData[column] + '</span>';
            } else {
                shcs = rowData[column];
            }
        } else {
            shcs = '';
        }
        return shcs;
    }

    public statusCellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
        let shcs: any;
        if (rowData[column]) {
            if (rowData.status) {
                // tslint:disable-next-line:max-line-length
                shcs = '<span style="color:' + this.chooseColor(rowData.status) + ';font-weight:bold;font-size:16x;">' + this.statusDictionary(rowData.status) + '</span>';
            } else {
                shcs = rowData[column];
            }
        } else {
            shcs = '';
        }
        return shcs;
    }

    public chooseColor(status) {
        let color: string;
        status === 'CAN' ? color = '#999' : (status === 'DEL' ? color = 'red' : color = 'green');
        return color;
    }

    public statusDictionary(status) {
        let name: string;
        status === 'CAN' ? name = 'CANCELED' : (status === 'DEL' ? name = 'DELAYED' : name = 'RESTORED');
        return name;
    }
    // TODO: Remove inline css once framework updated
    public throughTransitCellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
        let shcs: any;
        if (rowData.throughTransit === 'Y') {
            // tslint:disable-next-line:max-line-length
            shcs = '<span style="color:#fff;background:green; border-radius: 30px; padding:6px;font-weight:bold;font-size:16x;">&nbsp;Y&nbsp;</i></span>';
        } else if (rowData.throughTransit === 'N') {
            // tslint:disable-next-line:max-line-length
            shcs = '<span style="color:#fff;background:red; border-radius: 30px; padding:6px;font-weight:bold;font-size:16x;">&nbsp;N&nbsp;</i></span>';
        } else {
            shcs = '';
            // tslint:disable-next-line:max-line-length
            shcs = '<span style="color:#fff;background:red; border-radius: 30px; padding:6px;font-weight:bold;font-size:16x;">&nbsp;N&nbsp;</i></span>';
        }
        return shcs;
    }
    public ffmCellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
        let data: any;
        // if (rowData.ffmStatus === 'Y') {
        //     shcs = `<a href="javascript:void(0)" data-type="link" data-row="${row}" data-column="${column}"> Y </a>`;
        // } else {
        //     shcs = `<a href="javascript:void(0)" data-type="link" data-row="${row}" data-column="${column}"> Y </a>`;
        // }
        data = '&nbsp;';
        return data;
    }
    // TODO Popup in progress
    public onLinkClick(event) {
        this.iWindow.open();
    }

    private myFlights(event) {
        this.form.get('myflightList').reset();
        const requestdata: IncomingFlightDateRange = new IncomingFlightDateRange();
        this.resetFormMessages();
        this.importService.getMyFlights(requestdata).subscribe(res => {
            if (!this.showResponseErrorMessages(res)) {
                console.log(res.data);
                if (res.data) {
                    this.form.get('myflightList').patchValue(res.data);
                    this.myFlight.open();
                } else {
                    this.showInfoStatus('import.info118')
                }
            }
        }, error => {
            // this.showErrorStatus('Error:' + error);
            this.showData = false;
        });

    }

    showChildTable(event, index) {
        if ((<NgcFormControl>this.form.get(['resultList', index, 'showStatus'])).value) {
            (<NgcFormControl>this.form.get(['resultList', index, 'showStatus'])).setValue(false);
        }
        else {
            (<NgcFormControl>this.form.get(['resultList', index, 'showStatus'])).setValue(true);
        }
        // (<NgcFormControl>this.form.get(['resultList', index, 'showStatus'])).setValue(false);
        // item.controls.showStatus.value
        //  (<NgcFormControl>this.form.get(['resultList', index, 'showStatus'])).value ? (<NgcFormControl>this.form.get(['resultList', index, 'showStatus'])).setValue(false) : (<NgcFormControl>this.form.get(['resultList', index, 'showStatus'])).setValue(true);
        // this.fieldNumber == index ? this.fieldNumber = -1 : this.fieldNumber = index;
        // this.fieldNumber = index;
    }
    colapseAll() {

    }
    tableAction(action) {
        let items = (<NgcFormArray>this.form.get('resultList').value).length;
        for (let i = 0; i < items; i++) {
            (<NgcFormControl>this.form.get(['resultList', i, 'showStatus'])).setValue(action);
        }
    }
    backToHome(event) {
        this.router.navigate(['']);
    }
    goToArrivalmanifest() {
        let items = (<NgcFormArray>this.form.get('resultList').value);
        let selectedFlightKey;
        let selectedFlightDate;
        for (let i = 0; i < items.length; i++) {
            if (items[i].selectItem) {
                selectedFlightKey = items[i].flight;
                selectedFlightDate = NgcUtility.getDateOnly(items[i].staDate);
            }
        }
        if (selectedFlightKey) {
            let shipmentData = {
                flightNumber: selectedFlightKey,
                flightDate: selectedFlightDate
            };
            //this.router.navigate(['import', 'createarrival',shipmentData]);
            let url = "/import/arrivalmanifest";
            this.navigateTo(this.router, url, shipmentData);
        }
        else {
            this.showErrorMessage('select.flight.to.navigate');
            // this.router.navigate(['import', 'arrivalmanifest']);
        }
    }
    documentVerification() {
        let items = (<NgcFormArray>this.form.get('resultList').value);
        let selectedFlightKey;
        let selectedFlightDate;
        for (let i = 0; i < items.length; i++) {
            if (items[i].selectItem) {
                selectedFlightKey = items[i].flight;
                selectedFlightDate = NgcUtility.getDateOnly(items[i].staDate);
            }
        }
        if (selectedFlightKey) {
            let shipmentData = {
                flightNumber: selectedFlightKey,
                flightDate: selectedFlightDate
            };
            //this.router.navigate(['import', 'createarrival',shipmentData]);
            let url = "/import/documentverification";
            this.navigateTo(this.router, url, shipmentData);
        }
        else {
            this.showErrorMessage('select.flight.to.navigate');
            // this.router.navigate(['import', 'breakdownworkinglist']);
        }
    }
    goToWorkingList() {
        let items = (<NgcFormArray>this.form.get('resultList').value);
        let selectedFlightKey;
        let selectedFlightDate;
        for (let i = 0; i < items.length; i++) {
            if (items[i].selectItem) {
                selectedFlightKey = items[i].flight;
                selectedFlightDate = NgcUtility.getDateOnly(items[i].staDate);
            }
        }
        if (selectedFlightKey) {
            let shipmentData = {
                flightNumber: selectedFlightKey,
                flightDate: selectedFlightDate
            };
            //this.router.navigate(['import', 'createarrival',shipmentData]);
            let url = "/import/breakdownworkinglist";
            this.navigateTo(this.router, url, shipmentData);
        }
        else {
            this.showErrorMessage('select.flight.to.navigate');
            // this.router.navigate(['import', 'breakdownworkinglist']);
        }
    }
    goToOutgoingFlights() {
        let items = (<NgcFormArray>this.form.get('resultList').value);
        let selectedFlightKey;
        let selectedFlightDate;
        for (let i = 0; i < items.length; i++) {
            if (items[i].selectItem) {
                selectedFlightKey = items[i].flight;
                selectedFlightKey = selectedFlightKey ? String(selectedFlightKey).substr(2) : "";
                selectedFlightDate = NgcUtility.getDateOnly(items[i].staDate);
            }
        }
        if (selectedFlightKey) {


            let shipmentData = {
                requestTerminal: this.form.get(['search', 'terminalPoint']) ? this.form.get(['search', 'terminalPoint']).value : null,
                requestFlight: selectedFlightKey,
                flightDate: selectedFlightDate,
                carrierGroup: this.form.get(['search', 'carrierGp']) ? this.form.get(['search', 'carrierGp']).value : null,
                carrierCode: this.form.get(['search', 'carrierCode']) ? this.form.get(['search', 'carrierCode']).value : null,
                dateTimeTo: NgcUtility.addDate(selectedFlightDate, 24, DateTimeKey.HOURS),
                dateTimeFrom: NgcUtility.addDate(selectedFlightDate, -6, DateTimeKey.HOURS)
            };
            let url = "/export/buildup/outgoingFlights";
            this.navigateTo(this.router, url, shipmentData);
        }
        else {
            this.showErrorMessage('select.flight.to.navigate');
        }
    }

    goToShortTransit() {
        let items = (<NgcFormArray>this.form.get('resultList').value);
        let selectedFlightKey;
        let selectedFlightDate;
        for (let i = 0; i < items.length; i++) {
            if (items[i].selectItem) {
                selectedFlightKey = items[i].flight;
                selectedFlightDate = NgcUtility.getDateOnly(items[i].staDate);
            }
        }
        if (selectedFlightKey) {
            let shipmentData = {
                by: 'inbound',
                flightNumber: selectedFlightKey,
                flightDate: selectedFlightDate,
                dateTimeTo: NgcUtility.addDate(selectedFlightDate, 24, DateTimeKey.HOURS),
                dateTimeFrom: NgcUtility.addDate(selectedFlightDate, -6, DateTimeKey.HOURS)
            };
            let url = "/export/transhipment/short-transit-display";
            this.navigateTo(this.router, url, shipmentData);
        }
        else {
            this.showErrorMessage('select.flight.to.navigate');
        }
    }
    onFFM($event, $index) {
        console.log("Event----" + event);
        let items = (<NgcFormArray>this.form.get('resultList').value);
        let selectedFlightKey;
        let selectedFlightDate;
        for (let i = 0; i < items.length; i++) {
            if (i === $index) {
                selectedFlightKey = items[i].flight;
                selectedFlightDate = items[i].staDate;
            }
        }
        if (selectedFlightKey) {
            let shipmentData = {
                flightNumber: selectedFlightKey,
                flightDate: selectedFlightDate
            };
            //this.router.navigate(['import', 'createarrival',shipmentData]);
            let url = "/import/displayffm";
            this.navigateTo(this.router, url, shipmentData);
        }

    }


    printReport(type) {

        const request: FlightRequest = new FlightRequest();
        request.carrierGroup = [];
        if (this.selectedGroupCode !== null && this.selectedGroupCode.length > 0) {
            this.selectedGroupCode.forEach(record => {
                request.carrierGroup.push(record);
            });
        } else {
            request.carrierGroup = [];
        }

        console.log(request.carrierGroup.join('-'));

        this.reportParameters = new Object();
        this.reportParameters.fromdate = this.form.get('search.fromDate').value;
        this.reportParameters.todate = this.form.get('search.toDate').value;
        this.reportParameters.domesticFlightFlag = this.domesticFlag;
        this.reportParameters.customsImportFlightNumberFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_CustomsImportFlightNumber);
        this.reportParameters.customImportFlightNumberLabel = NgcUtility.getEntityAttribute(ApplicationEntities.Flight_CustomsImportFlightNumber).displayName;
        this.reportParameters.offpoint = NgcUtility.getTenantConfiguration().airportCode;
        if (this.form.get('search.carrierCode').value != null) {
            this.reportParameters.carriercode = this.form.get('search.carrierCode').value;

            this.reportParameters.carrierflag = '1';
        } else {
            this.reportParameters.carrierflag = '0';
        }
        if (this.form.get('search.carrierGp').value != null) {
            this.reportParameters.carriergroup = request.carrierGroup.join(',');
            this.reportParameters.carriergroupflag = '1';
        } else {
            this.reportParameters.carriergroupflag = '0';
        }
        if (this.form.get('search.flightKey').value != null) {
            this.reportParameters.flightnumber = this.form.get('search.flightKey').value;
            this.reportParameters.flightflag = '1';
        } else {
            this.reportParameters.flightflag = '0';
        }
        if (this.form.get('search.terminalPoint').value != null) {
            this.reportParameters.terminalpoint = this.form.get('search.terminalPoint').value;
            this.reportParameters.terminalflag = '1';
        } else {
            this.reportParameters.terminalflag = '0';
        }
        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_AircraftType)) {
            this.reportParameters.isTenantSpecificReport = true;
        }
        this.reportParameters.warehouseLevel = this.form.get('search.warehouseLevel').value;
        this.reportParameters.arrDepStatus = this.form.get('search.arrDepStatus').value;
        this.reportParameters.buBdOffice = this.form.get('search.buBdOffice').value;
        this.reportParameters.aircraftType = this.form.get('search.flightType').value;
        this.reportParameters.rho = this.form.get('search.rho').value;
        this.reportParameters.loginuser = this.getUserProfile().userShortName;

        if (type == ReportFormat.XLS) {
            this.reportWindow.format = ReportFormat.XLS;
            this.reportWindow.downloadReport();
        } else {
            this.reportWindow.format = ReportFormat.PDF;
            this.reportWindow.open();
        }
    }

    onChange(event) {
        console.log(event);
        if (event == 'AFT5' || event == 'T5') {
            this.showConfirmMessage('selected.export.terminal').then(reason => {
            }).catch(reason => {
                let formData = <NgcFormArray>this.form.controls['resultList'].value;
            });
        }


    }

    setFocusCheckBox() {
        this.ArrivalManifestButton.focus();
        this.EOrderImportuldHandling.focus();
    }

    onHistory(event, index) {
        let items = (<NgcFormArray>this.form.get('resultList').value);
        const req = {
            flightKey: items[index].flight,
            flightDate: NgcUtility.getDateTimeAsStringByFormat(items[index].flightDate, 'YYYY-MM-DD')
        }
        let url = "/audit/audittrailbyflight";
        this.navigateTo(this.router, url, req);
    }
    onprintEnquireReport(type) {

        this.reportParameters = new Object();
        this.reportParameters.fromdate = NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.MINUTES);
        this.reportParameters.todate = NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 1439, DateTimeKey.MINUTES);
        this.reportParameters.carrier = this.form.get('search.carrierCode').value;
        this.reportParameters.arrDepStatus = this.form.get('search.arrDepStatus').value;
        this.reportParameters.aircraftType = this.form.get('search.flightType').value;

        if (type == ReportFormat.XLS) {
            this.reportEnquire.format = ReportFormat.XLS;
            this.reportEnquire.downloadReport();
        } else {
            this.reportEnquire.format = ReportFormat.PDF;
            this.reportEnquire.open();
        }
    }
    getHeight() {
        return (document.body.clientHeight - 390) + 'px';
    }

    getWidth() {
        return (document.body.clientWidth - 50) + 'px';
    }
    updateColumnLengthsDynamically() {

        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_AircraftType)) {
            this.aircrafttypeColumn = 2.5;
            this.terminalColumn = 2;
            this.carrierColumn = 1.5;
            this.dateColumn = 3;
            this.bubdofficeColumn = 3;
        }
    }
    createEorder() {
        let items = (<NgcFormArray>this.form.get('resultList').value);
        let selectedFlightKey;
        let selectedFlightDate;
        let selectedProcess;
        for (let i = 0; i < items.length; i++) {
            if (items[i].selectItem) {
                selectedFlightKey = items[i].flight;
                selectedFlightDate = NgcUtility.getDateOnly(items[i].staDate);
                selectedProcess = 'Import ULD Handling';
            }
        }
        if (selectedFlightKey) {
            let shipmentData = {
                flightNumber: selectedFlightKey,
                flightDate: selectedFlightDate,
                processType: selectedProcess
            };
            let url = "/import/eorder/createEOrder";
            this.navigateTo(this.router, url, shipmentData);
        }
        else {
            this.showErrorMessage('select.flight.to.navigate');
        }
    }
}
