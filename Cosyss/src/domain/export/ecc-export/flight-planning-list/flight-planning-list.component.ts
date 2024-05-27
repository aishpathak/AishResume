import { Component, NgZone, ElementRef, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { EccService } from '../ecc.service';
import {
    FlightSearchQuery, ShipmentData, Advice, EccExportAwbDetails,
    DeleteShipmentData, ShipmentDataNoFlight
} from '../ecc.sharedmodel';

// NGC framework imports
import {
    NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcDropDownComponent, NgcButtonComponent,
    NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest,
    BaseResponse, NgcFormControl, BaseRequest, CellsRendererStyle, NgcReportComponent, PageConfiguration, NgcUtility, DateTimeKey
} from 'ngc-framework';

@Component({
    selector: 'app-flight-planning-list',
    templateUrl: './flight-planning-list.component.html',
    styleUrls: ['./flight-planning-list.component.scss']
})
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    autoBackNavigation: true,
    restorePageOnBack: true
})
export class FlightPlanningListComponent extends NgcPage {
    @ViewChild('addAwbWindow') addAwbWindow: NgcWindowComponent;
    @ViewChild('addPlanningwindow') addPlanningwindow: NgcWindowComponent;
    @ViewChild('awbDetailsWindow') awbDetailsWindow: NgcWindowComponent;
    // noFlightWindow
    @ViewChild('noFlightWindow') noFlightWindow: NgcWindowComponent;
    //awb details
    @ViewChild('reportWindow') reportWindow: NgcReportComponent;
    @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;

    response: any;
    showTable: boolean;
    invalidShipment: any;
    invalidShipmentFlag = false;
    private offPointList: any[] = [];
    array: any[] = [];
    allSelectedData: any[] = [];
    private showDropDown: boolean = false;
    private showText: boolean = true;
    private show: boolean = false;
    columnName: any;
    record: any;
    combinetheFinalResult: any;
    deleteResp: any;
    private edit: boolean = false;
    reportParameters: any;
    hasReadPermission: boolean = false;

    private form = new NgcFormGroup({

        search: new NgcFormGroup({
            flightDate: new NgcFormControl(),
            fromDate: new NgcFormControl(),
            toDate: new NgcFormControl(),
            flightKey: new NgcFormControl(),
            carrierCode: new NgcFormControl(),
            expressService: new NgcFormControl()
        }),

        advice: new NgcFormGroup({
            flightOriginDate: new NgcFormControl('', Validators.required),
            plannedShiftStartTime: new NgcFormControl(),
            plannedShiftEndTime: new NgcFormControl(),
            plannedDate: new NgcFormControl(),
            flightKey: new NgcFormControl('', Validators.required),
            offPoint: new NgcFormControl('', Validators.required),
            advice: new NgcFormControl('', Validators.required),
            planningAdviceId: new NgcFormControl()
        }),

        shipment: new NgcFormGroup({
            shipmentNumber: new NgcFormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
            documentPieces: new NgcFormControl('', Validators.required),
            documentWeight: new NgcFormControl('', Validators.required),
            outgoingFlightNumber: new NgcFormControl('', [Validators.required, Validators.maxLength(7), Validators.minLength(5)]),
            dateSTD: new NgcFormControl('', Validators.required),
            flightOffPoint: new NgcFormControl(),
            parkingBayDepAircraft: new NgcFormControl(),
            outboundAircraftRegNo: new NgcFormControl(),
            customerCode: new NgcFormControl('', Validators.required),
            specialHandlingCode: new NgcFormControl('', Validators.required),
            uldNumber: new NgcFormControl(),
            checker: new NgcFormControl(),
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
            planningAdviceId: new NgcFormControl(),
            advice: new NgcFormControl(),
            std: new NgcFormControl(),
            shipmentType: new NgcFormControl(),
        }),

        resultList: new NgcFormArray([]),
        resultListNoFlight: new NgcFormArray([])
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
        awbNo: new NgcFormControl(),
        fwbpcs: new NgcFormControl(),
        fwbwgt: new NgcFormControl(),
        rdy: new NgcFormControl(),
        fwb: new NgcFormControl(),
        fwbrq: new NgcFormControl(),
        rcar: new NgcFormControl(),
        svcNo: new NgcFormControl(),
        scind: new NgcFormControl(),
        rfidTag: new NgcFormControl(),
        fwbDisc: new NgcFormControl(),
        manDisc: new NgcFormControl(),
        awbDetailsList: new NgcFormArray([])
    });
    date: Date;
    dateFrom: any;
    dateto: Date;
    toDate: any;
    FromDate: any;
    dateTo: any;
    flightKey: any;
    flightDate: any;
    expressService: any;
    constructor(
        appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private eccService: EccService, private router: Router, private activatedRoute: ActivatedRoute) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        // Must Call
        super.ngOnInit();
        const navigateData = this.getNavigateData(this.activatedRoute);
        if (navigateData && (navigateData.fromDate || navigateData.toDate)) {
            this.form.get("search").get("fromDate").patchValue(navigateData.fromDate);
            this.form.get("search").get("toDate").patchValue(navigateData.toDate);
            this.form.get("search").get("flightKey").patchValue(navigateData.flightKey);
            this.form.get("search").get("flightDate").patchValue(navigateData.flightDate);
            this.form.get("search").get("expressService").patchValue(navigateData.expressService);
            this.onSearch();
        } else {
            this.date = new Date();
            this.dateFrom = NgcUtility.getDateOnly(this.date);
            this.dateto = NgcUtility.addDate(new Date(), 1439, DateTimeKey.MINUTES);

            this.form.get("search").get("fromDate").patchValue(this.dateFrom);
            this.form.get("search").get("toDate").patchValue(NgcUtility.addDate(this.dateFrom, 1439, DateTimeKey.MINUTES));
            this.showTable = false;
            this.form.get('shipment').get('dateSTD').valueChanges.subscribe(data => {
                let requestValues = this.form.get('shipment').value;
                requestValues.shipmentNumber && requestValues.outgoingFlightNumber && this.form.get('shipment').get('dateSTD').value ? this.getShipmentInfo() : null;
            });

            this.form.get('shipment').get('outgoingFlightNumber').valueChanges.subscribe(data => {
                let requestValues = this.form.get('shipment').value;
                requestValues.shipmentNumber && requestValues.outgoingFlightNumber && this.form.get('shipment').get('dateSTD').value ? this.getShipmentInfo() : null;
            });
        }
    }

    displayItems(pieces, weight): string {
        return !(pieces && weight) ? '' : pieces && weight ? pieces + ' / ' + NgcUtility.getDisplayWeight(weight) : pieces ? pieces : NgcUtility.getDisplayWeight(weight);
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
        this.hasReadPermission = NgcUtility.hasReadPermission('ECC_EXPORT_FLIGHT_PLANNER_LIST');
        let request: FlightSearchQuery = new FlightSearchQuery();
        request = this.form.get('search').value;
        this.eccService.getShipments(request).subscribe(data => {
            this.response = data;
            this.refreshFormMessages(data);
            this.form.get('advice').reset();
            if (this.response.data != null) {
                this.response.data.forEach(element => {
                    element.selectBox = false;
                    if (element.noShowFlag) {
                        element.noShowText = element.shipmentNumber + ' [No Show]';
                    }
                    else {
                        element.noShowText = element.shipmentNumber;
                    }

                    element.stdTime = element.dateSTD;
                    element.pcsWgt = this.displayItems(element.documentPieces, element.documentWeight);
                    element.fwbPcsWgt = this.displayItems(element.fwbPieces, element.fwbWeight);
                    element.physicalPcsWgt = this.displayItems(element.acceptedPieces, element.acceptedWeight);
                });
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

    getSelectedValues(type: boolean): any {

        let list = this.form.get('resultList').value;
        let selectedOne: Array<any> = new Array<any>();
        this.invalidShipmentFlag = false;
        list.forEach(element => {
            if (element.selectBox) {
                if (type) {
                    if (element.shipmentId != null) {
                        element.noShowFlag = true;
                        element.noShowMarkedBy = 'DUMMYUSER';
                        element.noShowMarkedAt = new Date();
                    }


                    else {
                        this.createAdviceShipment(element)
                    }

                }
                // else {
                //     // Ststus update
                //     element.shipmentStatus = 'Confirmed';
                // }

                selectedOne.push(element);

            }
        });
        return selectedOne;
    }

    private markAsNoShow() {

        let request: Array<ShipmentData> = new Array<ShipmentData>();

        let list = this.form.get('resultList').value;
        let selectedOne: Array<any> = new Array<any>();
        this.invalidShipmentFlag = false;
        list.forEach(element => {
            if (element.selectBox) {
                this.show = true;
                if (element.outgoingFlightNumber == null) {
                    this.addNoFlightDetails(element);
                }
                else if (element.shipmentId != null && element.outgoingFlightNumber != null) {
                    element.noShowFlag = true;
                    element.noShowMarkedBy = 'DUMMYUSER';
                    element.noShowMarkedAt = new Date();
                    selectedOne.push(element);
                    this.createAdviceShipment(element);
                }
                else if (element.shipmentId == null && element.outgoingFlightNumber != null) {
                    this.createAdviceShipment(element);
                }
            }

        });
        request = selectedOne;


        if (!this.show) {
            this.showErrorMessage('export.select.a.shipment');
            return;
        }

    }

    private updateShipmentStatus(event) {
        let request: Array<ShipmentData> = new Array<ShipmentData>();
        request = this.getSelectedValues(false);
        this.eccService.updateShipmentStatus(request).subscribe(data => {
            this.response = data;
            this.refreshFormMessages(data);
            if (this.response.data != null) {
                this.onSearch();
                // this.form.get('resultList').patchValue(this.response.data);
            } else {
                // this.showErrorStatus(this.response.messageList[0].message);
            }
        }, error => {
            // this.showErrorStatus('Error:' + error);
        });
    }

    private updateAdvice() {
        let request: Advice = new Advice();
        request = this.form.get('advice').value;
        request.offPoint = this.form.get('advice').get('offPoint').value;
        this.eccService.updateAdvice(request).subscribe(data => {
            this.response = data;
            this.refreshFormMessages(data);
            if (this.response.data != null) {
                this.showInfoStatus('export.data.added.successfully');
                this.form.get('advice').reset();
                this.addPlanningwindow.close();
                this.onSearch();
            } else {
                // this.showErrorStatus(this.response.messageList[0].message);
            }
        }, error => {
            // this.showErrorStatus('Error:' + error);
        });
    }

    private updateShipment() {
        this.form.get('shipment').validator;
        if (this.form.get('shipment').invalid) {
            this.showErrorMessage('export.invalid.form.data');
            return;
        }

        let req = this.form.get('shipment').value;


        if (req.flightOffPoint == null) {
            this.showErrorMessage('export.select.offpoint');
            return;
        }


        let request: ShipmentData = new ShipmentData();
        let now = new Date();
        request.documentPieces = req.documentPieces;
        request.documentWeight = req.documentWeight;
        request.shipmentStatus = 'ADV';
        request.shipmentNumber = req.shipmentNumber;
        now = req.std;
        request.flightKey = req.outgoingFlightNumber;
        request.flightOriginDate = now;
        request.specialHandlingCode = req.specialHandlingCode;
        request.shcHandlingGroupCode = req.shcHandlingGroupCode;
        request.customerCode = req.customerCode;
        request.uldNumber = req.uldNumber;
        request.checker = req.checker;
        request.flightOffPoint = req.flightOffPoint

        this.eccService.updateShipment(request).subscribe(data => {
            this.response = data;
            if (this.response.data != null) {
                this.showInfoStatus('export.data.added.successfully');
                this.onSearch();
                this.addAwbWindow.close();
            } else {
                this.refreshMessages(this.response.messageList);
                // this.showErrorStatus(this.response.messageList[0].message);
            }
        }, error => {
            // this.showErrorStatus('Error:' + error);
        });
    }

    public groupsRenderer = (value: string | number, rowData: any, level: any): string => {

        if (rowData.records.length != 0) {
            let returnedValue = '';
            for (var i = 0; i < rowData.records.length; i++) {
                if (rowData.records[i].advice && rowData.records[i].advice != 'No Show' && rowData.records[i].advice != 'No Flight') {

                    returnedValue += '<b>&nbsp;Planning Advice:  ' + rowData.records[i].advice + " " + (rowData.records[i].uldNumber ? rowData.records[i].uldNumber : '') + '</b>';
                    // return '&nbsp;Planning Advice:  ' + rowData.records[i].advice + " " + (rowData.records[i].uldNumber ? "," + rowData.records[i].uldNumber : '');
                }
                // else {
                //     return '';
                // }
                break;
            }
            return returnedValue;
            //  return '';
        }



    }

    addAwbWindows() {
        this.form.get('advice').reset();
        this.form.get('shipment').reset();
        let shift = this.form.get('search').value;
        if (shift.flightKey && shift.flightDate) {
            this.getShipmentInfoFlightDetails();
        }
        this.addAwbWindow.open();
    }

    addplanningWindow() {
        let shift = this.form.get('search').value;
        this.form.get('advice').reset();
        this.form.get('shipment').reset();
        if (this.edit) {
            this.form.get('advice').get('flightKey').enable();
            this.form.get('advice').get('flightOriginDate').enable();
        }
        if (shift.fromDate && shift.toDate) {
            this.form.get('advice').get('plannedShiftStartTime').setValue((<Date>shift.fromDate).toTimeString().slice(0, 8));
            this.form.get('advice').get('plannedShiftEndTime').setValue((<Date>shift.toDate).toTimeString().slice(0, 8));
            this.form.get('advice').get('plannedDate').setValue(shift.fromDate);
            this.edit = false;
            this.addPlanningwindow.open();
        } else {
            this.showInfoStatus('export.add.from.date.to.date.to.update.advice');
        }

    }

    awbDetailsWindows() {
        let request: ShipmentData = new ShipmentData();
        let list = this.form.get('resultList').value;
        let selectedOne: Array<any> = new Array<any>();
        this.invalidShipmentFlag = false;
        list.forEach(element => {
            if (element.selectBox) {
                request.shipmentNumber = element.shipmentNumber;
                request.shipmentDate = element.shipmentDate;
            }
        });
        this.eccService.getAwbDetails(request).subscribe(res => {
            let resObj = res.data;
            this.awbDetailsForm.get('awbDetailsList').patchValue(resObj);
        },
            error => {
            })
        this.awbDetailsWindow.open();
    }

    showShipmentWithoutFlightWindow() {
        let request: FlightSearchQuery = new FlightSearchQuery();
        request = this.form.get('search').value;
        this.eccService.getShipmentsWithoutFlight(request).subscribe(data => {
            this.response = data;
            this.refreshFormMessages(data);
            if (this.response.data != null) {
                this.response.data.forEach(element => {
                    element.selectBox = true;
                    element.carrierCode = element.carrierCode;
                    element.shipmentStatus = 'ADV';
                    element.stdTime = element.dateSTD;
                    element.pcsWgt = this.displayItems(element.documentPieces, element.documentWeight);
                    element.physicalPcsWgt = this.displayItems(element.acceptedPieces, element.acceptedWeight);
                });
                this.form.get('resultListNoFlight').patchValue(this.response.data);
            } else {
                // this.showErrorStatus(this.response.messageList[0].message);
            }
        }, error => {
            // this.showErrorStatus('Error:' + error);
        });
        this.noFlightWindow.open();
    }

    onClickNavigate() {
        this.dateTo = this.form.get("search").get('toDate').value;
        this.dateFrom = this.form.get("search").get('fromDate').value;
        this.flightKey = this.form.get("search").get('flightKey').value;
        this.flightDate = this.form.get("search").get('flightDate').value;
        this.expressService = this.form.get("search").get("expressService").value;
        const record = {
            toDate: this.dateTo,
            fromDate: this.dateFrom,
            flightKey: this.flightKey,
            flightDate: this.flightDate,
            expressService: this.expressService
        }
        this.navigateTo(this.router, '/export/eccexpoutdetailer', record);
    }

    cancelWindow() {
        this.addAwbWindow.close();
        this.addPlanningwindow.close();
        this.form.get('advice').reset();
        this.form.get('shipment').reset();

        // this.awbDetailsWindow.close();
    }
    public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
        let cellsStyle: CellsRendererStyle = new CellsRendererStyle();

        if (rowData.noShowFlag == true) {
            cellsStyle.data = value + " [No Show]";

        } else {

        }
        //
        return cellsStyle;
    };
    /**
     * 
     * getShipmentInfo
     * 
     */

    private getShipmentInfo() {
        //
        let req = this.form.get('shipment').value;
        let requestOffPoint: FlightSearchQuery = new FlightSearchQuery();
        requestOffPoint.flightKey = req.outgoingFlightNumber;;
        requestOffPoint.flightDate = this.form.get('shipment').get('dateSTD').value;
        let offList = new Array();
        this.eccService.getFlightOffPoint(requestOffPoint).subscribe(res => {
            this.response = res;
            if (this.response.data.length > 1) {
                this.showDropDown = true;
                this.showText = false;
                this.response.data.forEach(element => {
                    offList.push({ code: element.flightOffPoint, desc: element.flightOffPoint });
                })
                this.offPointList = offList;
            }
            else if (this.response.data.length == 1) {
                this.showDropDown = false;
                this.showText = true;
                this.form.get('shipment').get('flightOffPoint').setValue(this.response.data[0].flightOffPoint);

            }
            else if (JSON.stringify(this.response.data) === '[]') {
                this.showDropDown = false;
                this.showText = true;
                this.form.get('shipment').get('flightOffPoint').patchValue('');
            }
        },
            error => {
            })
        //
        let shc: any = [];
        let request: ShipmentData = new ShipmentData();
        //   let now = new Date();
        request.shipmentNumber = req.shipmentNumber;
        request.flightKey = req.outgoingFlightNumber;
        request.flightOriginDate = this.form.get('shipment').get('dateSTD').value;
        this.eccService.getShipmentInfo(request).subscribe(data => {
            this.response = data;
            // this.refreshFormMessages(data);
            if (this.response.data != null) {
                let res = this.response.data;
                res.documentPieces ? this.form.get('shipment').get('documentPieces').setValue(res.documentPieces) : this.form.get('shipment').get('documentPieces').setValue(null);
                res.documentWeight ? this.form.get('shipment').get('documentWeight').setValue(res.documentWeight) : this.form.get('shipment').get('documentWeight').setValue(null);
                //res.flightOffPoint ? this.form.get('shipment').get('flightOffPoint').setValue(res.flightOffPoint) : null;
                res.parkingBayDepAircraft ? this.form.get('shipment').get('parkingBayDepAircraft').setValue(res.parkingBayDepAircraft) : this.form.get('shipment').get('parkingBayDepAircraft').setValue(null);
                res.outboundAircraftRegNo ? this.form.get('shipment').get('outboundAircraftRegNo').setValue(res.outboundAircraftRegNo) : this.form.get('shipment').get('outboundAircraftRegNo').setValue(null);
                // res.customerCode ? this.form.get('shipment').get('customerCode').setValue(res.customerCode) : null;
                if (res.specialHandlingCode) {
                    shc = res.specialHandlingCode.split(",");
                    for (let index of shc) {
                        this.form.get('shipment').get('shcHandlingGroupCode').setValue(shc);
                    }
                }
                this.form.get('shipment').get('shipmentStatus').setValue('ADV');
                res.std ? this.form.get('shipment').get('std').setValue(res.std) : this.form.get('shipment').get('std').setValue(null);
                // this.onSearch();
            } else {
                this.form.get('shipment').get('shipmentStatus').setValue('ADV');
                this.form.get('shipment').get('std').setValue(null);
                this.form.get('shipment').get('parkingBayDepAircraft').setValue(null);
                this.form.get('shipment').get('outboundAircraftRegNo').setValue(null);
                this.form.get('shipment').get('flightOffPoint').setValue(null);
                this.form.get('shipment').get('documentPieces').setValue(null);
                this.form.get('shipment').get('documentWeight').setValue(null);
                // this.showErrorStatus(this.response.messageList[0].message);
            }
        }, error => {
            this.form.get('shipment').get('shipmentStatus').setValue('ADV');
            this.form.get('shipment').get('std').setValue(null);
            this.form.get('shipment').get('parkingBayDepAircraft').setValue(null);
            this.form.get('shipment').get('outboundAircraftRegNo').setValue(null);
            this.form.get('shipment').get('flightOffPoint').setValue(null);
            this.form.get('shipment').get('documentPieces').setValue(null);
            this.form.get('shipment').get('documentWeight').setValue(null);
        });
    }
    backToHome(event) {
        this.router.navigate(['']);
    }
    onClear(event) {
        this.form.get('search').reset();
        this.showTable = false;
    }

    createAdviceShipment(element) {
        let request: ShipmentData = new ShipmentData();
        let request1 = this.form.getRawValue();
        request = element;
        let arr: any = [];
        this.eccService.checkAcceptance(request).subscribe(res => {
            if (res.data) {
                let adviceRequest: Advice = new Advice();
                let selectedOne: Array<any> = new Array<any>();
                let shift = this.form.get('search').value;
                //let request: Array<ShipmentData> = new Array<ShipmentData>();

                if (shift.fromDate && shift.toDate) {
                    adviceRequest.plannedShiftStartTime = (<Date>shift.fromDate).toTimeString().slice(0, 8);
                    adviceRequest.plannedShiftEndTime = (<Date>shift.toDate).toTimeString().slice(0, 8);
                    adviceRequest.plannedDate = shift.fromDate;
                }

                let count = 0;
                request1.resultList.forEach(element1 => {
                    if (element1.groupField == element.groupField && element1.shipmentNumber != null) {
                        count++;
                    }
                });
                adviceRequest.shipmentCount = count;
                adviceRequest.advice = 'No Show';
                adviceRequest.flightKey = element.outgoingFlightNumber;
                adviceRequest.flightOriginDate = element.dateSTD;
                adviceRequest.offPoint = element.flightOffPoint;
                adviceRequest.customerCode = element.customerCode;
                adviceRequest.planningAdviceId = element.planningAdviceId;
                //this.invalidShipment = element.shipmentNumber;
                //this.invalidShipmentFlag = true;

                element.advice = 'No Show';
                element.noShowFlag = true;
                element.noShowMarkedBy = 'DUMMYUSER';

                element.noShowMarkedAt = new Date();

                this.eccService.updateAdviceForNoShow(adviceRequest).subscribe(res => {
                    this.refreshFormMessages(res);
                    if (res.data) {
                        let request: ShipmentData = new ShipmentData();
                        request.documentPieces = element.documentPieces;
                        request.documentWeight = element.documentWeight;
                        request.shipmentStatus = 'Confirmed';
                        request.shipmentNumber = element.shipmentNumber;
                        request.shipmentDate = element.shipmentDate;
                        request.flightKey = element.outgoingFlightNumber;
                        request.flightOriginDate = element.dateSTD;
                        request.specialHandlingCode = element.specialHandlingCode.replace("\n\t\t", ",").trim();
                        arr = request.specialHandlingCode.split(" ");

                        request.shcHandlingGroupCode = arr;
                        request.customerCode = element.customerCode;
                        request.uldNumber = element.uldNumber;
                        request.shipmentId = element.shipmentId;
                        request.planningAdviceId = res.data.planningAdviceId;
                        request.advice = 'No Show';
                        request.flightOffPoint = element.flightOffPoint;
                        request.checker = element.checker;

                        this.eccService.updateShipmentForNoShow(request).subscribe(res => {
                            if (res.data) {
                                element.shipmentId = res.data.shipmentId;
                                selectedOne.push(element)
                                this.eccService.markAsNoShow(selectedOne).subscribe(res => {
                                    if (res.messageList != null) {
                                        return this.showErrorStatus(res.messageList[0].message);
                                    }
                                    else if (res.data) {
                                        this.onSearch();
                                    }
                                })
                            }
                            else if (res.messageList != null) {
                                return this.showErrorStatus(res.messageList[0].message);
                            }
                        },
                            error => {
                            })
                    }

                })
            }
            else if (res.messageList != null) {
                return this.showErrorStatus(res.messageList[0].message);
            }
        })


    }


    public onLinkClick(event) {
        this.form.get('shipment').reset();
        if (event.type === 'link') {
            this.columnName = event.column;
            this.record = event.record;
            if (this.columnName === 'DELETE') {
                if (this.record.planningAdviceId == null) {
                    this.showErrorStatus('export.cannot.delete.the.record');
                    return;
                }
                this.showConfirmMessage('export.delete.the.selected.role.confirmation').then(fulfilled => {
                    const deleteAdvice: DeleteShipmentData = new DeleteShipmentData();
                    deleteAdvice.shipmentId = this.record.shipmentId;
                    deleteAdvice.planningAdviceId = this.record.planningAdviceId;
                    deleteAdvice.shimentNumber = this.record.shipmentNumber;
                    deleteAdvice.shipmentNumber = this.record.shipmentNumber;
                    this.eccService.deleteAdvice(deleteAdvice).subscribe(data => {
                        this.deleteResp = data;
                        if (this.deleteResp.success) {
                            (<NgcFormArray>this.form.get('resultList')).deleteValue([{ code: this.record.shipmentId }]);
                            this.showSuccessStatus('g.completed.successfully');
                            this.onSearch();
                        }
                    },
                    );
                }).catch(reason => {
                });
            }
            else if (this.columnName === 'EDIT') {
                if (this.record.planningAdviceId == null) {
                    this.showErrorStatus('export.cannot.edit.the.record');
                    return;
                }
                this.edit = true;
                this.record = event.record;
                if (this.record.shipmentId == null) {
                    this.form.get('advice').get('flightKey').patchValue(this.record.outgoingFlightNumber);
                    this.form.get('advice').get('flightOriginDate').patchValue(this.record.dateSTD);
                    this.form.get('advice').get('offPoint').patchValue(this.record.flightOffPoint);
                    this.form.get('advice').get('advice').patchValue(this.record.advice);
                    this.form.get('advice').get('flightKey').disable();
                    this.form.get('advice').get('flightOriginDate').disable();
                    this.form.get('advice').get('planningAdviceId').patchValue(this.record.planningAdviceId)
                    console.log(this.form.get('advice').value)
                    this.addPlanningwindow.open();
                }
                else {
                    let specialHandlingCode = this.record.specialHandlingCode;
                    let shcs = specialHandlingCode.split(" ");
                    for (let index of shcs) {
                        this.form.get('shipment').get('shcHandlingGroupCode').setValue(shcs);
                    }
                    this.form.get('shipment').get('shipmentNumber').patchValue(this.record.shipmentNumber);
                    this.form.get('shipment').get('outgoingFlightNumber').setValue(this.record.outgoingFlightNumber);
                    this.form.get('shipment').get('dateSTD').setValue(this.record.dateSTD);
                    this.form.get('shipment').get('documentPieces').setValue(this.record.documentPieces);
                    this.form.get('shipment').get('documentWeight').setValue(this.record.documentWeight);
                    this.form.get('shipment').get('specialHandlingCode').setValue(this.record.specialHandlingCode);
                    this.form.get('shipment').get('customerCode').setValue(this.record.customerCode);
                    this.form.get('shipment').get('uldNumber').setValue(this.record.uldNumber);
                    this.form.get('shipment').get('std').setValue(NgcUtility.toDateFromLocalDate(this.record.stdTime));
                    this.form.get('shipment').get('flightOffPoint').setValue(this.record.flightOffPoint);
                    this.form.get('shipment').get('shipmentStatus').setValue(this.record.shipmentStatus);
                    this.form.get('shipment').get('parkingBayDepAircraft').setValue(this.record.parkingBayDepAircraft);
                    this.addAwbWindow.open();
                }
            }
            else if (this.columnName === 'PRINT') {
                this.record = event.record;
                this.reportParameters = new Object();
                this.reportParameters.FlightKey = this.record.outgoingFlightNumber;
                this.reportParameters.OffPoint = this.record.flightOffPoint;
                this.reportParameters.STD = NgcUtility.getTimeAsString(NgcUtility.getDateTime(this.record.stdTime));
                this.reportParameters.FlightDate = NgcUtility.getDateAsString(this.record.dateSTD).toUpperCase();
                var shc = this.record.specialHandlingCode;
                this.array = shc.split(" ");
                this.array.forEach(element => {
                    if (element === 'RAC') {
                        console.log(element);
                        this.allSelectedData.push(element)
                    }
                    else if (element === 'XPS') {
                        this.allSelectedData.push(element)
                    }

                    else if (element === 'COU') {
                        this.allSelectedData.push(element)
                    }
                })
                this.combinetheFinalResult = this.allSelectedData.join();
                if (this.combinetheFinalResult != "") {
                    this.reportParameters.ExpressService = this.combinetheFinalResult;
                }
                else { this.reportParameters.ExpressService = "1" }
                this.reportWindow.reportParameters = this.reportParameters;
                this.reportWindow.open();
                this.allSelectedData = [];
            }
        }
    }

    public editAdvice() {
        let request: Advice = new Advice();
        request = this.form.get('advice').value;
        request.offPoint = this.form.get('advice').get('offPoint').value;
        this.eccService.editAdvice(request).subscribe(data => {
            this.response = data;
            this.refreshFormMessages(data);
            if (this.response.data != null) {
                this.showInfoStatus('g.data.update.successful');
                this.form.get('advice').reset();
                this.addPlanningwindow.close();
                this.onSearch();
            } else {

            }
        }, error => {

        });
    }

    public cellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
        return " ";
    }

    public addNoFlightDetails(element) {

        let request: ShipmentDataNoFlight = new ShipmentDataNoFlight();

        let shift = this.form.get('search').value;

        if (shift.fromDate && shift.toDate) {
            request.plannedShiftStartTime = (<Date>shift.fromDate).toTimeString().slice(0, 8);
            request.plannedShiftEndTime = (<Date>shift.toDate).toTimeString().slice(0, 8);
            request.plannedDate = shift.fromDate;
        }

        request.advice = 'No Flight';
        request.flightKey = element.outgoingFlightNumber;
        request.flightOriginDate = element.dateSTD;
        request.offPoint = element.flightOffPoint;

        request.noShowFlag = true;
        request.noShowMarkedBy = 'DUMMYUSER';
        element.noShowMarkedAt = new Date();
        //
        request.documentPieces = element.documentPieces;
        request.documentWeight = element.documentWeight;
        request.shipmentStatus = 'ADV';
        request.shipmentNumber = element.shipmentNumber;
        request.flightKey = element.outgoingFlightNumber;
        request.flightOriginDate = element.dateSTD;
        request.specialHandlingCode = element.specialHandlingCode.replace("\n\t\t", ",").trim();
        request.customerCode = element.customerCode;
        request.uldNumber = element.uldNumber;
        request.checker = element.checker;
        request.shipmentId = element.shipmentId;
        request.noShowMarkedAt = element.noShowMarkedAt;
        //

        this.eccService.addNoFlightDetails(request).subscribe(res => {
            if (res.data) {
                this.onSearch();
            }
            else if (res.messageList) {
                this.refreshFormMessages(res.messageList);
            }
        })


    }

    public getFlightOffPoint() {
        let request: FlightSearchQuery = new FlightSearchQuery();
        request.flightKey = this.form.get('advice').get('flightKey').value;
        request.flightDate = this.form.get('advice').get('flightOriginDate').value;
        let offList = new Array();
        this.eccService.getFlightOffPoint(request).subscribe(res => {
            if (!this.showResponseErrorMessages(res)) {
                this.response = res;
                if (this.response.data.length > 1) {
                    this.showDropDown = true;
                    this.showText = false;
                    this.response.data.forEach(element => {
                        offList.push({ code: element.flightOffPoint, desc: element.flightOffPoint });
                    })
                    this.form.get('advice').get('offPoint').enable();
                    this.offPointList = offList;
                }
                else if (this.response.data.length == 1) {
                    this.showDropDown = false;
                    this.showText = true;
                    this.form.get('advice').get('offPoint').setValue(this.response.data[0].flightOffPoint);
                    this.form.get('advice').get('offPoint').disable();
                }
                else if (JSON.stringify(this.response.data) === '[]') {
                    this.showDropDown = false;
                    this.showText = true;
                    // this.form.get('advice').get('offPoint').patchValue('');
                    // this.form.get('advice').get('offPoint').disable();
                }
            }
        },
            error => {
                this.showErrorStatus(error);
            })
    }

    public dateChange() {
        if (this.form.get('advice').get('flightKey').value) {
            // let shift = this.form.get('search').value;
            // this.form.get('advice').get('flightOriginDate').patchValue(shift.toDate);
            //   this.form.get('shipment').get('flightOffPoint')
            this.getFlightOffPoint()
        }
    }

    public getShipmentInfoFlightDetails() {
        let req = this.form.get('shipment').value;

        let requestOffPoint: FlightSearchQuery = new FlightSearchQuery();
        requestOffPoint.flightKey = req.outgoingFlightNumber;;
        requestOffPoint.flightDate = this.form.get('shipment').get('dateSTD').value;
        let offList = new Array();
        this.eccService.getFlightOffPoint(requestOffPoint).subscribe(res => {
            this.response = res;
            if (this.response.data.length > 1) {
                this.showDropDown = true;
                this.showText = false;
                this.response.data.forEach(element => {
                    offList.push({ code: element.flightOffPoint, desc: element.flightOffPoint });
                })
                this.offPointList = offList;
            }
            else if (this.response.data.length == 1) {
                this.showDropDown = false;
                this.showText = true;
                this.form.get('shipment').get('flightOffPoint').setValue(this.response.data[0].flightOffPoint);

            }
            else if (JSON.stringify(this.response.data) === '[]') {
                this.showDropDown = false;
                this.showText = true;
                this.form.get('shipment').get('flightOffPoint').patchValue('');
            }
        },
            error => {
            })
        //
        this.eccService.getShipmentInfoDetails(requestOffPoint).subscribe(data => {
            this.response = data;
            // this.refreshFormMessages(data);
            if (this.response.data != null) {
                let res = this.response.data;
                // res.documentPieces ? this.form.get('shipment').get('documentPieces').setValue(res.documentPieces) : null;
                // res.documentWeight ? this.form.get('shipment').get('documentWeight').setValue(res.documentWeight) : null;
                //res.flightOffPoint ? this.form.get('shipment').get('flightOffPoint').setValue(res.flightOffPoint) : null;
                res.parkingBayDepAircraft ? this.form.get('shipment').get('parkingBayDepAircraft').setValue(res.parkingBayDepAircraft) : null;
                // res.customerCode ? this.form.get('shipment').get('customerCode').setValue(res.customerCode) : null;
                res.specialHandlingCode ? this.form.get('shipment').get('specialHandlingCode').setValue(res.specialHandlingCode) : null;
                this.form.get('shipment').get('shipmentStatus').setValue('ADV');
                res.std ? this.form.get('shipment').get('std').setValue(res.std) : null;
                // this.onSearch();
            } else {
                this.form.get('shipment').get('shipmentStatus').setValue('ADV');
                this.form.get('shipment').get('std').setValue(null);
                this.form.get('shipment').get('parkingBayDepAircraft').setValue(null);
                this.form.get('shipment').get('flightOffPoint').setValue(null);
                // this.showErrorStatus(this.response.messageList[0].message);
            }
        }, error => {
            // this.showErrorStatus('Error:' + error);
        });
    }

    getSelectedShipment() {
        let count: number = 0;
        let index: number = 0
        this.form.getRawValue().resultList.forEach((select, ind) => {
            if (select.selectBox) {
                count++;
                index = ind;
            }
        });
        if (count == 1)
            return index;
        else
            return null;
    }

    loadShipment() {
        let fromDate = this.form.get("search").get("fromDate").value;
        let toDate = this.form.get("search").get("toDate").value;
        let flightKey = this.form.get("search").get("flightKey").value;
        let flightDate = this.form.get("search").get("flightDate").value;
        let expressService = this.form.get("search").get("expressService").value;
        let carrierCode = this.form.get("search").get("carrierCode").value;
        var dataToSend = {
            fromDate: fromDate,
            toDate: toDate,
            flightKey: flightKey,
            flightDate: flightDate,
            expressService: expressService,
            carrierCode: carrierCode,
            flightOriginDate: flightDate
        }
        this.navigateTo(this.router, '/export/buildup/revisedloadshipment', dataToSend);
    }

    unloadShipment() {
        let fromDate = this.form.get("search").get("fromDate").value;
        let toDate = this.form.get("search").get("toDate").value;
        let flightKey = this.form.get("search").get("flightKey").value;
        let flightDate = this.form.get("search").get("flightDate").value;
        let expressService = this.form.get("search").get("expressService").value;
        let carrierCode = this.form.get("search").get("carrierCode").value;
        var dataToSend = {
            fromDate: fromDate,
            toDate: toDate,
            flightKey: flightKey,
            flightDate: flightDate,
            expressService: expressService,
            carrierCode: carrierCode
        }
        this.navigateTo(this.router, '/export/buildup/unloadshipmentDesktop', dataToSend);
    }

    manageCargoAcceptance() {
        let fromDate = this.form.get("search").get("fromDate").value;
        let toDate = this.form.get("search").get("toDate").value;
        let flightKey = this.form.get("search").get("flightKey").value;
        let flightDate = this.form.get("search").get("flightDate").value;
        let expressService = this.form.get("search").get("expressService").value;
        let carrierCode = this.form.get("search").get("carrierCode").value;
        let list = this.form.get('resultList').value;
        let counter = 0;
        list.forEach(element => {
            if (list.length > 0) {
                if (element.selectBox) {
                    counter = counter + 1;
                }
            }
        });
        if (counter == 0) {
            this.showErrorMessage('export.select.a.shipment');
            return;
        } else if (counter > 1) {
            this.showErrorMessage('selectOneSM');
            return;
        }
        var dataToSend = {
            fromDate: fromDate,
            toDate: toDate,
            flightKey: flightKey,
            flightDate: flightDate,
            expressService: expressService,
            carrierCode: carrierCode
        }
        this.navigateTo(this.router, '/export/acceptance/managecargoacceptance', dataToSend);
    }

    manageAcceptanceWeighing() {
        let fromDate = this.form.get("search").get("fromDate").value;
        let toDate = this.form.get("search").get("toDate").value;
        let flightKey = this.form.get("search").get("flightKey").value;
        let flightDate = this.form.get("search").get("flightDate").value;
        let expressService = this.form.get("search").get("expressService").value;
        let carrierCode = this.form.get("search").get("carrierCode").value;
        let list = this.form.get('resultList').value;
        let shipmentNumber;
        let shipmentType;
        let counter = 0;
        list.forEach(element => {
            if (list.length > 0) {
                if (element.selectBox) {
                    shipmentNumber = element.shipmentNumber;
                    shipmentType = element.shipmentType;
                    counter = counter + 1;
                }
            }
        });
        if (counter == 0) {
            this.showErrorMessage('export.select.a.shipment');
            return;
        } else if (counter > 1) {
            this.showErrorMessage('selectOneSM');
            return;
        }
        var dataToSend = {
            shipmentNumber: shipmentNumber,
            shipmentType: shipmentType,
            fromDate: fromDate,
            toDate: toDate,
            flightKey: flightKey,
            flightDate: flightDate,
            expressService: expressService,
            carrierCode: carrierCode
        }
        this.navigateTo(this.router, '/export/acceptance/manageacceptanceweighingrevised', dataToSend);
    }

    bookSingleShipment() {
        let fromDate = this.form.get("search").get("fromDate").value;
        let toDate = this.form.get("search").get("toDate").value;
        let flightKey = this.form.get("search").get("flightKey").value;
        let flightDate = this.form.get("search").get("flightDate").value;
        let expressService = this.form.get("search").get("expressService").value;
        let carrierCode = this.form.get("search").get("carrierCode").value;
        let list = this.form.get('resultList').value;
        let shipmentNumber;
        let shipmentType;
        let counter = 0;
        list.forEach(element => {
            if (list.length > 0) {
                if (element.selectBox) {
                    shipmentNumber = element.shipmentNumber;
                    shipmentType = element.shipmentType;
                    counter = counter + 1;
                }
            }
        });
        if (counter == 0) {
            this.showErrorMessage('export.select.a.shipment');
            return;
        } else if (counter > 1) {
            this.showErrorMessage('selectOneSM');
            return;
        }
        var dataToSend = {
            shipmentNumber: shipmentNumber,
            shipmentType: shipmentType,
            fromDate: fromDate,
            toDate: toDate,
            flightKey: flightKey,
            flightDate: flightDate,
            expressService: expressService,
            carrierCode: carrierCode
        }
        this.navigateTo(this.router, '/export/booksingleshipment', dataToSend);
    }

    updateDLS() {
        let fromDate = this.form.get("search").get("fromDate").value;
        let toDate = this.form.get("search").get("toDate").value;
        let flightKey = this.form.get("search").get("flightKey").value;
        let flightDate = this.form.get("search").get("flightDate").value;
        let expressService = this.form.get("search").get("expressService").value;
        let carrierCode = this.form.get("search").get("carrierCode").value;
        var dataToSend = {
            fromDate: fromDate,
            toDate: toDate,
            flightKey: flightKey,
            flightDate: flightDate,
            expressService: expressService,
            carrierCode: carrierCode,
            flightOriginDate: flightDate
        }
        this.navigateTo(this.router, '/export/buildup/update-dls', dataToSend);
    }

    airlineLoadingInstruction() {
        let fromDate = this.form.get("search").get("fromDate").value;
        let toDate = this.form.get("search").get("toDate").value;
        let flightKey = this.form.get("search").get("flightKey").value;
        let flightDate = this.form.get("search").get("flightDate").value;
        let expressService = this.form.get("search").get("expressService").value;
        let carrierCode = this.form.get("search").get("carrierCode").value;
        var dataToSend = {
            fromDate: fromDate,
            toDate: toDate,
            flightKey: flightKey,
            flightDate: flightDate,
            expressService: expressService,
            carrierCode: carrierCode,
            flightOriginDate: flightDate
        }
        this.navigateTo(this.router, '/export/buildup/airlineloadinginstructions', dataToSend);
    }


    reportofeccplanner() {
        this.reportParameters = new Object();
        let request = this.form.get('resultList').value;
        let count = 0;
        let count1 = 0;
        for (let i = 0; i < request.length; i++) {
            if (request[i].selectBox) {
                if (request[i].noShowFlag) {
                    this.reportParameters.noshowFlag = 1;
                    count++;
                }
                else if (!request[i].noShowFlag) {
                    this.reportParameters.noshowFlag = 0;
                    count1++;
                }
            }
        }
        if (count1 >= 1 && count >= 1) {
            this.reportParameters.noshowFlag = null;
        }
        if (this.form.get('search').get('fromDate').value != null) {
            // this.reportParameters.dateflag = '1'
            this.reportParameters.fromdate = this.form.get('search').get('fromDate').value;
            this.reportParameters.Todate = this.form.get('search').get('toDate').value;
        }
        // else {
        //     this.reportParameters.dateflag = '0'
        // }
        if (this.form.get('search').get('flightKey').value != null) {
            // this.reportParameters.flightflag = '1';
            this.reportParameters.flight = this.form.get('search').get('flightKey').value;
        }
        // else {
        //     this.reportParameters.flightflag = '0';
        // }
        if (this.form.get('search').get('flightDate').value != null) {
            // this.reportParameters.dateSTASTDflag = '1';
            this.reportParameters.dateSTASTD = this.form.get('search').get('flightDate').value;
        }
        // else {
        //     this.reportParameters.dateSTASTDflag = '0';
        // }
        if (this.form.get('search').get('carrierCode').value != null) {
            // this.reportParameters.carrierflag = '1';
            this.reportParameters.carrier = this.form.get('search').get('carrierCode').value;

        }
        // else {
        //     this.reportParameters.carrierflag = '0';
        // }
        if (this.form.get('search').get('expressService').value != null) {
            this.reportParameters.expressService = this.form.get('search').get('expressService').value;
            // this.reportParameters.expressServiceflag = '1'
        }
        // else {
        //     this.reportParameters.expressServiceflag = '0'
        // }

        // if (this.form.get('resultList').get('selectBox').value ==  true) {
        //     this.reportParameters.noShowFlag = 1
        // }
        // else if () {
        //     this.reportParameters.noShowFlag = 0
        // }
        // else {
        //     this.reportParameters.noShowFlag = 2

        // }

        this.reportWindow1.open();
    }


    DisplayHistoryOfECC() {
        let fromDate = this.form.get("search").get("fromDate").value;
        let toDate = this.form.get("search").get("toDate").value;
        let flightKey = this.form.get("search").get("flightKey").value;
        let flightDate = this.form.get("search").get("flightDate").value;
        let expressService = this.form.get("search").get("expressService").value;
        let carrierCode = this.form.get("search").get("carrierCode").value;
        let list = this.form.get('resultList').value;
        let shipmentNumber;
        let counter = 0;
        list.forEach(element => {
            if (list.length > 0) {
                if (element.selectBox) {
                    shipmentNumber = element.shipmentNumber;
                    counter = counter + 1;
                }
            }
        });
        if (counter == 0) {
            this.showErrorMessage('export.select.a.shipment');
            return;
        } else if (counter > 1) {
            this.showErrorMessage('selectOneSM');
            return;
        }

        var dataToSend = {
            entityValue: shipmentNumber,
            entityType: 'AWB',
            fromDate: fromDate,
            toDate: toDate,
            flightKey: flightKey,
            flightDate: flightDate,
            expressService: expressService,
            carrierCode: carrierCode
        }
        this.navigateTo(this.router, '/audit/audittrailbyawb', dataToSend);
    }

    onOffPointChange(event) {
        this.form.get('advice').get('flightOffPoint').patchValue(event);
    }

    shipmentInfo() {
        let fromDate = this.form.get("search").get("fromDate").value;
        let toDate = this.form.get("search").get("toDate").value;
        let flightKey = this.form.get("search").get("flightKey").value;
        let flightDate = this.form.get("search").get("flightDate").value;
        let expressService = this.form.get("search").get("expressService").value;
        let carrierCode = this.form.get("search").get("carrierCode").value;
        let list = this.form.get('resultList').value;
        let shipmentNumber;
        let shipmentType;
        let counter = 0;
        list.forEach(element => {
            if (list.length > 0) {
                if (element.selectBox) {
                    shipmentNumber = element.shipmentNumber;
                    shipmentType = element.shipmentType;
                    counter = counter + 1;
                }
            }
        });
        if (counter == 0) {
            this.showErrorMessage('export.select.a.shipment');
            return;
        } else if (counter > 1) {
            this.showErrorMessage('selectOneSM');
            return;
        }
        var dataToSend = {
            shipmentNumber: shipmentNumber,
            shipmentType: shipmentType,
            fromDate: fromDate,
            toDate: toDate,
            flightKey: flightKey,
            flightDate: flightDate,
            expressService: expressService,
            carrierCode: carrierCode
        }
        this.navigateTo(this.router, '/awbmgmt/shipmentinfo', dataToSend);
    }

    maintainFWB() {
        let fromDate = this.form.get("search").get("fromDate").value;
        let toDate = this.form.get("search").get("toDate").value;
        let flightKey = this.form.get("search").get("flightKey").value;
        let flightDate = this.form.get("search").get("flightDate").value;
        let expressService = this.form.get("search").get("expressService").value;
        let carrierCode = this.form.get("search").get("carrierCode").value;
        let list = this.form.get('resultList').value;
        let shipmentNumber;
        let shipmentType;
        let counter = 0;
        list.forEach(element => {
            if (list.length > 0) {
                if (element.selectBox) {
                    shipmentNumber = element.shipmentNumber;
                    shipmentType = element.shipmentType;
                    counter = counter + 1;
                }
            }
        });
        if (counter == 0) {
            this.showErrorMessage('export.select.a.shipment');
            return;
        } else if (counter > 1) {
            this.showErrorMessage('selectOneSM');
            return;
        }
        var dataToSend = {
            awbNumber: shipmentNumber,
            fromDate: fromDate,
            toDate: toDate,
            flightKey: flightKey,
            flightDate: flightDate,
            expressService: expressService,
            carrierCode: carrierCode
        }
        this.navigateTo(this.router, '/import/maintainfwb', dataToSend);
    }

}
