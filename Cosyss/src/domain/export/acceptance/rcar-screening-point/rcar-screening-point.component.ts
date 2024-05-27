import { isNull } from 'util';
import { Validators } from '@angular/forms';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';

import {
    NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl
    , NgcUtility, NgcWindowComponent, NgcDropDownComponent, PageConfiguration, NgcReportComponent
} from 'ngc-framework';

import { ScreeningPointRequest, ScreeningPointShipment } from '../../export.sharedmodel'

import { AcceptanceService } from '../acceptance.service';
import { ApplicationFeatures } from '../../../common/applicationfeatures';
import { MAX_LENGTH_VALIDATOR } from '@angular/forms/src/directives/validators';

@Component({
    selector: 'ngc-rcar-screening-point',
    templateUrl: './rcar-screening-point.component.html',
    styleUrls: ['./rcar-screening-point.component.scss']
})
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true
})
export class RcarScreeningPointComponent extends NgcPage {
    @ViewChild('updateWindow') updateWindow: NgcWindowComponent;
    @ViewChild('dropdown') dropdown: NgcDropDownComponent;
    private rcarScreeningPointForm: NgcFormGroup = null;
    private screeningReasons;
    private status;
    reportParameters: any = new Object();
    @ViewChild('report') report: NgcReportComponent;
    @ViewChild('report1') report1: NgcReportComponent;
    @ViewChild('report2') report2: NgcReportComponent;
    data: any;
    reasonSourceId: string;
    failureReasons: any;
    screeningFailureReasons: any;
    screeningSCFailureReasons: any;
    multipleShipmentScreeningFlag: boolean = false;
    uldSearch: boolean = false;
    successReason: any;
    disableSaveButton: boolean;
    isAEDScreening: boolean;
    showDataOfListFlag: boolean;
    updateWindowShowHide: boolean = false;
    updateMethodFlag: boolean = false;
    addScreeningFlag: boolean = false;
    saveFlag: boolean = false;
    tenantSpecific: any;
    windowHeight: number = 600;
    windowWidth: number = 1500;
    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
        private acceptanceService: AcceptanceService) {
        super(appZone, appElement, appContainerElement);
    }
    onSearch() {
        this.resetFormMessages();
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_Screening_ScreeningReason_SIN)) {
            this.updateWindowShowHide = false;
        }
        this.showDataOfListFlag = false;
        let request: ScreeningPointRequest = new ScreeningPointRequest();

        request = this.rcarScreeningPointForm.getRawValue();
        if (
            !request.carrier &&
            !request.flightKey &&
            !request.flightDate &&
            !request.tenderedDateTo &&
            (!request.shipmentNumbers ||
                request.shipmentNumbers.length == 0) &&
            (!request.screeningReason
                || request.screeningReason.length == 0) &&
            !request.tenderedDateFrom &&
            !request.acceptanceTerminal &&
            !request.uldNumber) {
            this.showErrorMessage("export.provide.atleast.one.search.criteria");
            return;
        }
        let a: any;
        let b: any;
        let c: any;
        if (request.tenderedDateFrom && request.tenderedDateTo) {
            a = Math.abs(request.tenderedDateTo.getTime() - request.tenderedDateFrom.getTime());
            b = Math.ceil(a / (1000 * 3600 * 24));
            c = request.tenderedDateTo.getTime() - request.tenderedDateFrom.getTime();
            if (b > 30) {
                this.showFormControlErrorMessage(<NgcFormControl>this.rcarScreeningPointForm.get('tenderedDateFrom'), 'export.date.range.too.high');
                this.showFormControlErrorMessage(<NgcFormControl>this.rcarScreeningPointForm.get('tenderedDateTo'), 'export.date.range.too.high');
                return;
            } else if (c < 0) {
                this.showFormControlErrorMessage(<NgcFormControl>this.rcarScreeningPointForm.get('tenderedDateFrom'), 'export.from.date.cannot.greater.to.date');
                return;
            }
        }
        request.showScreenedShipmentsIndicator === true ? this.disableSaveButton = true : this.disableSaveButton = false;
        this.acceptanceService.fetchToBeScreenedShipments(request).subscribe(response => {
            this.showFormErrorMessages(response);
            // data.data.screeningList = data.data.screeningList === null ? [] : data.data.screeningList;
            this.data = response.data;
            if (response.messageList) {
                this.showDataOfListFlag = false;
                this.data = null;
            }
            request.showScreenedShipmentsIndicator === true ? this.disableSaveButton = true : this.disableSaveButton = false;
            this.rcarScreeningPointForm.patchValue(response.data);
            if (response.data !== null) {
                this.showDataOfListFlag = true;
            }
        }, error => {
            this.showErrorStatus(error);
        });
    }
    onDetain() {
        let request: ScreeningPointRequest = new ScreeningPointRequest();
        request = this.rcarScreeningPointForm.getRawValue();
        request.screeningList = request.screeningList.filter((element) => element.select == true);

        if (request.screeningList && request.screeningList.length <= 0) {
            this.showErrorMessage("expaccpt.select.least.one.record");
            return;
        }

        this.acceptanceService.detainShipments(request).subscribe(data => {
            this.showFormErrorMessages(data);
            if (data.messageList == null || data.messageList.length == 0) {
                this.showSuccessStatus('g.completed.successfully');
                this.onSearch();
            }
        });
    }
    public onLinkClick(index) {
        this.rcarScreeningPointForm.get('updateForm').patchValue(this.data.screeningList[index]);
        const datetime = new Date().toString();
        this.rcarScreeningPointForm.get('updateForm').get('screeningStartDate').setValue(NgcUtility.getDateTime(datetime));
        if (!this.data.screeningList[index].clearedForUplift) {
            if (this.data.screeningList[index].screeningReasons.includes("AED")) {
                this.failureReasons = 'EXPORT$SC_FALREA';
                this.isAEDScreening = true;
            } else {
                this.failureReasons = 'EXPORT$SCR_FALREA'
                this.isAEDScreening = false;
            }
        } else {
            this.failureReasons = 'EXPORT$SCR_SUC';
            this.rcarScreeningPointForm.get('updateForm').get('screeningRemarks').setValidators([]);
            this.rcarScreeningPointForm.get('updateForm').get('screeningRemarks').reset();
            this.rcarScreeningPointForm.get('updateForm').get('screenedPieces').setValidators([]);
            this.rcarScreeningPointForm.get('updateForm').get('screenedWeight').setValidators([]);
        }
        this.updateWindowShowHide = true;
        this.updateMethodFlag = NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_Screening_ScreeningReason_SIN);
        this.addScreeningFlag = NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_Screening_ScreeningResult_AddMoreScreenings);
        this.multipleShipmentScreeningFlag = NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_AddToScreening_ByUld);
        if (this.multipleShipmentScreeningFlag) {
            this.rcarScreeningPointForm.get('updateForm').get('screeningRemarks').setValidators([Validators.required]);
        }
        this.updateWindow.open();
    }

    /** ON CLOSE WINDOW THE VALUES WILL BE REFRESHED */
    destroyWindow() {
        this.updateWindowShowHide = false;
        this.uldSearch = false;
        this.multipleShipmentScreeningFlag = false;
        (<NgcFormControl>this.rcarScreeningPointForm.get(['updateForm', 'uldNumber'])).setValidators(null);
    }

    /** This method is used for uld pop up search in AAT */
    onULDSearch = () => {
        this.uldSearch = true;
        this.updateWindow.open();
        this.multipleShipmentScreeningFlag = NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_AddToScreening_ByMultipleAwb);
        this.rcarScreeningPointForm.get('updateForm').patchValue({
            'uldNumber': '',
            'methodList': [],
            'screeningRemarks': '',
        });
        (<NgcFormControl>this.rcarScreeningPointForm.get(['updateForm', 'uldNumber'])).setValidators([Validators.required]);
    }
    onULDTypeSearch = () => {
        (<NgcFormControl>this.rcarScreeningPointForm.get(['updateForm', 'uldNumber'])).validate();
        if ((<NgcFormControl>this.rcarScreeningPointForm.get(['updateForm', 'uldNumber'])).invalid) {
            return;
        }
        this.updateWindowShowHide = true;
        let request = {
            'uldNumber': this.rcarScreeningPointForm.get(['updateForm', 'uldNumber']).value
        }
        this.acceptanceService.fetchToBeScreenedShipments(request).subscribe(response => {
            if (!this.showFormErrorMessages(response)) {
                this.rcarScreeningPointForm.get(['updateForm']).patchValue(response.data.screeningList[0]);
                (<NgcFormControl>this.rcarScreeningPointForm.get(['updateForm', 'screeningRemarks'])).setValidators([Validators.required]);

            }
        });
    }

    /** ON SCREENING PIECES UPDATE IT WILL AUTOMATICALLY PATCH SCREENING WEIGHT */
    onScreenedPiecesUpdate = (index, item, event) => {
        const actualPieces = item.value.screeningReqPieces;
        const actualWeight = item.value.screeningReqWeight;
        let locationWeight = (event / actualPieces) * actualWeight;
        this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'screenedWeight']).patchValue(locationWeight);
    }

    /** ON SAVING OR UPDATE THE DATA FROM POPUP */
    onScreeningSave = () => {
        (<NgcFormGroup>this.rcarScreeningPointForm.get('updateForm')).validate();
        if ((<NgcFormGroup>this.rcarScreeningPointForm.get('updateForm')).invalid) {
            return;
        }
        const datetime = new Date().toString();
        this.rcarScreeningPointForm.get('updateForm').get('screeningEndDate').setValue(NgcUtility.getDateTime(datetime));
        let request = this.rcarScreeningPointForm.getRawValue().updateForm;
        if (request.screeningRemarks) {
            let Length2 = request.screeningRemarks.length;
            if (Length2 > 65) {
                this.showErrorStatus("export.remarks.length.upto.65");
                return;
            }
        }
        this.acceptanceService.updateScreenedShipment(request).subscribe(data => {
            if (data.messageList) {
                data.messageList.forEach((message) => {
                    if (message.referenceId) {
                        message.referenceId = 'updateForm.' + message.referenceId;
                    }
                });
            }
            this.showFormErrorMessages(data);
            if (data.messageList == null || data.messageList.length == 0) {
                this.rcarScreeningPointForm.get('updateForm').patchValue(data.data);
                this.rcarScreeningPointForm.get('updateForm').get('screeningRemarks').setValue(null);
                this.showSuccessStatus('g.completed.successfully');
                if (data.data.methodList.length == 0) {
                    this.updateWindow.close();
                    this.destroyWindow();
                }
                this.onSearch();
                this.saveFlag = true;
            }
        }, error => {
            this.showErrorStatus(error);
        });
    }

    onUpdateScreenedShipment() {
        let request: ScreeningPointShipment = new ScreeningPointShipment();
        const datetime = new Date().toString();
        this.rcarScreeningPointForm.get('updateForm').get('screeningEndDate').setValue(NgcUtility.getDateTime(datetime));

        request = this.rcarScreeningPointForm.getRawValue().updateForm;
        if (this.isAEDScreening == true) {
            if (request.screeningRemarks == null || request.screeningRemarks == '') {
                this.showErrorStatus("export.provide.remarks");
                return;
            }
            let Length1 = request.screeningRemarks.length;
            if (Length1 > 500) {
                this.showErrorStatus("export.remarks.length.upto.500");
                return;
            }
        } else {
            if (request.screeningRemarks) {
                let Length2 = request.screeningRemarks.length;
                if (Length2 > 65) {
                    this.showErrorStatus("export.remarks.length.upto.65");
                    return;
                }
            }
        }

        this.acceptanceService.updateScreenedShipment(request).subscribe(data => {
            if (data.messageList) {
                data.messageList.forEach((message) => {
                    if (message.referenceId) {
                        message.referenceId = 'updateForm.' + message.referenceId;
                    }
                });
            }
            this.showFormErrorMessages(data);
            if (data.messageList == null || data.messageList.length == 0) {
                if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_Screening_ScreeningReason_SIN)) {
                    this.updateWindowShowHide = false;
                    this.updateWindow.close();
                }
                this.showSuccessStatus('g.completed.successfully');
                this.onSearch();
                this.saveFlag = true;
            }
        }, error => {
            this.showErrorStatus(error);
        });
    }
    ngOnInit() {
        this.initialise();
        // this.subscribeForFailureReasons();
        this.tenantSpecific = NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_AddToScreening_ByUld);
        this.windowHeight = NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_AddToScreening_ByUld) ? 900 : this.windowHeight;
        this.windowWidth = NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_AddToScreening_ByUld) ? 2000 : this.windowWidth;
    }
    initialise() {
        this.successReason = [{ 'code': 'SUCCESS', 'desc': 'Screened Successfully' }];
        this.screeningReasons = ['ACAS', 'RCAR', 'AED', 'Airline Request', 'TS', 'eCSD'];
        this.status = ['PASS', 'FAIL'];
        this.rcarScreeningPointForm = new NgcFormGroup({
            flightKey: new NgcFormControl(),
            flightDate: new NgcFormControl(),
            tenderedDateFrom: new NgcFormControl(),
            tenderedDateTo: new NgcFormControl(),
            carrier: new NgcFormControl(),
            acceptanceTerminal: new NgcFormControl(),
            screeningReason: new NgcFormControl(),
            transferType: new NgcFormControl(),
            screeningList: new NgcFormArray([]),
            shipmentNumbers: new NgcFormControl(null),
            uldNumber: new NgcFormControl(),
            scrStatus: new NgcFormControl(),
            showScreenedShipmentsIndicator: new NgcFormControl(),
            updateForm: new NgcFormGroup({
                shipmentNumber: new NgcFormControl(),
                pieces: new NgcFormControl(),
                weight: new NgcFormControl(),
                agentCode: new NgcFormControl(),
                registeredPieces: new NgcFormControl(),
                shipmentType: new NgcFormControl(),
                agentName: new NgcFormControl(),
                rcaNumber: new NgcFormControl(),
                screeningStartDate: new NgcFormControl(),
                scRemarks: new NgcFormControl(),
                screeningEndDate: new NgcFormControl(),
                screeningComplete: new NgcFormControl(),
                rcarType: new NgcFormControl(),
                completionStatus: new NgcFormControl(),
                origin: new NgcFormControl(),
                destination: new NgcFormControl(),
                totalScreenedPieces: new NgcFormControl(),
                totalScreenedWeight: new NgcFormControl(),
                totalPassPieces: new NgcFormControl(),
                totalFailPieces: new NgcFormControl(),
                methodList: new NgcFormArray([
                    new NgcFormGroup({
                        shipmentNumber: new NgcFormControl(),
                        pieces: new NgcFormControl(),
                        weight: new NgcFormControl(),
                        agentCode: new NgcFormControl(),
                        registeredPieces: new NgcFormControl(),
                        screenedPieces: new NgcFormControl(),
                        screenedWeight: new NgcFormControl(),
                        stickerNumberFrom: new NgcFormControl(),
                        stickerNumberTo: new NgcFormControl(),
                        clearedForUplift: new NgcFormControl(),
                        screenedMethod: new NgcFormControl(),
                        shipmentBuildType: new NgcFormControl(),
                        screeningRemarks: new NgcFormControl('', [Validators.maxLength(500)]),
                        reasonForRejection: new NgcFormControl(),
                        passFailStatus: new NgcFormControl(),
                        screeningRemarksForMethod: new NgcFormControl(),

                    })
                ]),
            }),

        });
        // this.getUserProfile.te

    }

    public afterUserProfileLoad() {
        //let terminalId = this.getUserProfile().terminalId;
        //this.rcarScreeningPointForm.get('acceptanceTerminal').setValue(terminalId);
    }

    // comparePiecesWithScreenedPieces(event) {
    //     const actualPieces = this.rcarScreeningPointForm.get('updateForm').get('pieces').value;
    //     if (actualPieces === event) {
    //         const actualWeight = this.rcarScreeningPointForm.get('updateForm').get('weight').value;
    //         this.rcarScreeningPointForm.get('updateForm').get('screenedWeight').setValue(actualWeight);
    //         (<NgcFormControl>this.rcarScreeningPointForm.get(["updateForm", "methodList", 0, "screenedWeight"])).setValue(actualWeight);
    //     }
    // }

    comparePiecesWithScreenedPieces(event, indexValue, item) {
        const actualPieces = this.rcarScreeningPointForm.get('updateForm').get('pieces').value;
        const actualWeight = this.rcarScreeningPointForm.get('updateForm').get('weight').value;
        if (actualPieces === event) {
            this.rcarScreeningPointForm.get('updateForm').get('screenedWeight').setValue(actualWeight);
            (<NgcFormControl>this.rcarScreeningPointForm.get(["updateForm", "methodList", 0, "screenedWeight"])).setValue(actualWeight);
        } else {
            let locationArray: any = (<NgcFormArray>this.rcarScreeningPointForm.get(['updateForm', 'methodList'])).getRawValue();
            let utilisedPieces = 0;
            let utilisedWeight = 0;
            let locationWeight = 0;
            let remainingPieces = item.value.pieces;
            let remainingWeight = item.value.weight;
            if (locationArray.length == 1) {

                locationWeight = (event / actualPieces) * actualWeight;
                (<NgcFormControl>this.rcarScreeningPointForm.get(["updateForm", "methodList", indexValue, "screenedWeight"])).setValue(Number(NgcUtility.getDisplayWeight(locationWeight)))
            } else {
                let count = 0;
                for (const locationRow of locationArray) {
                    if (count !== indexValue) {
                        utilisedWeight = utilisedWeight + locationRow.screenedWeight;
                        remainingPieces = remainingPieces - locationRow.screenedPieces;
                        remainingWeight = remainingWeight - locationRow.screenedWeight;
                    }
                    utilisedPieces = utilisedPieces + locationRow.screenedPieces;
                    count++;
                }

                locationWeight = (event / remainingPieces) * remainingWeight;
                (<NgcFormControl>this.rcarScreeningPointForm.get(["updateForm", "methodList", indexValue, "screenedWeight"])).setValue(Number(NgcUtility.getDisplayWeight(locationWeight)))
            }
        }
    }

    onExportToExcel() {
        let request: ScreeningPointRequest = new ScreeningPointRequest();
        request = this.rcarScreeningPointForm.getRawValue();
        this.reportParameters = new Object();
        this.reportParameters.screeningCompleted = (this.rcarScreeningPointForm.get('showScreenedShipmentsIndicator').value ? '1' : '0');
        this.reportParameters.awb = this.rcarScreeningPointForm.get('shipmentNumbers').value;
        this.reportParameters.flightKey = this.rcarScreeningPointForm.get('flightKey').value;
        this.reportParameters.flightDate = this.rcarScreeningPointForm.get('flightDate').value;
        this.reportParameters.fromDate = this.rcarScreeningPointForm.get('tenderedDateFrom').value;
        this.reportParameters.toDate = this.rcarScreeningPointForm.get('tenderedDateTo').value;
        this.reportParameters.carrier = this.rcarScreeningPointForm.get('carrier').value;
        this.reportParameters.terminals = this.rcarScreeningPointForm.get('acceptanceTerminal').value;
        this.reportParameters.screeningType = this.rcarScreeningPointForm.get('screeningReason').value;
        this.reportParameters.tenantId = NgcUtility.getTenantConfiguration().airportCode;
        let shipmentNumber = '';
        if (this.reportParameters.awb != null) {
            this.reportParameters.awb.forEach(obj => {
                shipmentNumber += obj + ',';
            })
        }

        let screenReasons = '';
        if (this.reportParameters.screeningType != null) {
            this.reportParameters.screeningType.forEach(obj => {
                screenReasons += obj + ',';
            })
        }
        this.reportParameters.screeningType = ((screenReasons != null || screenReasons != '') ? screenReasons.substring(0, screenReasons.length - 1) : null);
        this.reportParameters.awb = ((shipmentNumber != null || shipmentNumber != '') ? shipmentNumber.substring(0, shipmentNumber.length - 1) : null);

        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_Screening_ScreeningResult_AddMoreScreenings)) {
            this.report1.downloadReport();
        }
        /** THIS REPORT SPECIFIC TO AAT */
        else if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_AddToScreening_ByUld)) {
            this.reportParameters.uldNumber = this.rcarScreeningPointForm.get('uldNumber').value;
            this.reportParameters.screeningCompleted = this.rcarScreeningPointForm.get('scrStatus').value ?
                this.rcarScreeningPointForm.get('scrStatus').value == 'Completed' ? '1'
                    : '0' : null;
            this.report2.downloadReport();
        }
        else {
            this.report.downloadReport();
        }
    }

    onCloseUpdateWindow() {
        this.updateWindowShowHide = false;
        this.updateWindow.close();
    }

    onCancel(event) {
        this.navigateHome();
    }

    /** ON ADD ROW AAT AND AISATS  */
    onAddrow(index) {

        const noOfRows = (<NgcFormArray>this.rcarScreeningPointForm.get('updateForm').get('methodList')).length;
        const lastRow = noOfRows ? (<NgcFormArray>this.rcarScreeningPointForm.get('updateForm')).controls[noOfRows - 1] : null;
        let element = this.rcarScreeningPointForm.get('updateForm').value;
        (<NgcFormArray>this.rcarScreeningPointForm.get('updateForm').get('methodList')).addValue([
            {

                shipmentNumber: isNull(index) ? element.shipmentNumber
                    : this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'shipmentNumber']).value,
                agentName: isNull(index) ? element.agentName
                    : this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'agentName']).value,
                rcarType: isNull(index) ? element.rcarType
                    : this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'rcarType']).value,
                rcarReg: isNull(index) ? element.rcarReg
                    : this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'rcarReg']).value,
                pieces: isNull(index) ? element.pieces
                    : this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'pieces']).value,
                weight: isNull(index) ? element.weight
                    : this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'weight']).value,
                agentCode: isNull(index) ? element.agentCode
                    : this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'agentCode']).value,
                shipmentOriDes: isNull(index) ? element.shipmentOriDes
                    : this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'shipmentOriDes']).value,
                shipmentPcsWt: isNull(index) ? element.shipmentPcsWt
                    : this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'shipmentPcsWt']).value,
                assnPcsWt: null,
                screeningReqPieces: null,
                screeningReqWeight: null,
                screenedPieces: "",
                screenedWeight: "",
                stickerNumberFrom: "",
                stickerNumberTo: "",
                clearedForUplift: "",
                passFailStatus: "",
                screenedMethod: "",
                shipmentBuildType: "",
                screeningReason: "",
                screeningRemarks: "",
                screeningFlightId: null,
                uldNumber: isNull(index) ? element.uldNumber
                    : this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'uldNumber']).value,
                shipmentId: isNull(index) ? element.shipmentId :
                    this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'shipmentId']).value,
                screeningChargeCustomer: element.screeningChargeCustomer

            }
        ]);
        console.log(this.rcarScreeningPointForm.get('updateForm').get('methodList').value)
    }
    onDeleteMethodList = index => {
        if (this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'screeningFlightId']).value == null) {
            (<NgcFormArray>this.rcarScreeningPointForm.get(['updateForm', 'methodList'])).removeAt(index);
        } else {
            (<NgcFormArray>this.rcarScreeningPointForm.get(['updateForm', 'methodList'])).markAsDeletedAt(index);
        }

    }
    /** CREATE A BACKEND CALL TO FETCH THE AVAILABLE PIECES AND WEIGHT AND THEN CALCULATE THE REMAINING PICES AND WEIGHT */
    onAddSelectReason = (index, event) => {

        let request = {
            'shipmentId': this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'shipmentId']).value,
            'uldNumber': this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'uldNumber']).value,
        }

        let remainingPieces = 0;
        let remainingweight = 0;
        let shipmentNumber = this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'shipmentNumber']).value
        this.acceptanceService.availablePiecesForScreening(request).subscribe(data => {
            if (!this.showFormErrorMessages(data)) {

                remainingPieces = data.data.piece;
                remainingweight = data.data.weight;
                (<NgcFormArray>this.rcarScreeningPointForm.get(['updateForm', 'methodList'])).value.forEach((element, ind) => {
                    if (element.screeningReason == event.code && ind != index && element.shipmentNumber == shipmentNumber) {
                        remainingPieces = remainingPieces - element.screeningReqPieces;
                        remainingweight = remainingweight - element.screeningReqWeight;
                    }
                });
                if (remainingPieces > 0 && remainingweight > 0) {
                    this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'screeningReqPieces']).setValue(remainingPieces);
                    this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'screeningReqWeight']).setValue(remainingweight);
                    this.rcarScreeningPointForm.get(['updateForm', 'methodList', index, 'assnPcsWt']).setValue(remainingPieces + '/' + remainingweight);
                } else {
                    (<NgcFormArray>this.rcarScreeningPointForm.get(['updateForm', 'methodList'])).removeAt(index);
                }
            }
        })
    }
    /** ON COMPLETE SCREENING THIS METHOD IS CALLED */
    onCompleteScreening() {

        let request: ScreeningPointShipment = new ScreeningPointShipment();
        const datetime = new Date().toString();
        this.rcarScreeningPointForm.get('updateForm').get('screeningEndDate').setValue(NgcUtility.getDateTime(datetime));

        if (this.rcarScreeningPointForm.get('updateForm').get('screeningRemarks').value == null) {
            this.showErrorMessage("enter.screening.result.remarks");
            return;
        }


        if (this.rcarScreeningPointForm.get('updateForm').get('screeningComplete').value == null) {
            this.showErrorMessage("select.screening.result");
            return;
        }

        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_Screening_ScreeningResult_AddMoreScreenings)) {
            if (this.saveFlag == false) {
                this.showErrorMessage('exp.save.bfr.cmplt.scr')
            }
            if (this.saveFlag == true) {
                request = this.rcarScreeningPointForm.getRawValue().updateForm;
                this.acceptanceService.updateScreeningComplete(request).subscribe(data => {
                    if (data.messageList) {
                        data.messageList.forEach((message) => {
                            if (message.referenceId) {
                                message.referenceId = 'updateForm.' + message.referenceId;
                            }
                        });
                    }
                    this.showFormErrorMessages(data);
                    if (data.messageList == null || data.messageList.length == 0) {
                        this.showSuccessStatus('g.completed.successfully');
                        this.onSearch();
                    }
                }, error => {
                    this.showErrorStatus(error);
                });
                this.saveFlag = false;
            }
        }
        else {
            this.showConfirmMessage('save.before.complete.screening').then(fulfilled => {
                request = this.rcarScreeningPointForm.getRawValue().updateForm;
                this.acceptanceService.updateScreeningComplete(request).subscribe(data => {
                    if (data.messageList) {
                        data.messageList.forEach((message) => {
                            if (message.referenceId) {
                                message.referenceId = 'updateForm.' + message.referenceId;
                            }
                        });
                    }
                    this.showFormErrorMessages(data);
                    if (data.messageList == null || data.messageList.length == 0) {
                        // this.updateWindowShowHide = false;
                        //this.updateWindow.close();
                        this.showSuccessStatus('g.completed.successfully');
                        this.onSearch();
                    }
                }, error => {
                    this.showErrorStatus(error);
                });
            })
        };

    }
    onUpdateFormDelete(event, index: any): void {

        (<NgcFormArray>this.rcarScreeningPointForm.get('updateForm').get('methodList')).markAsDeletedAt(event);

    }

}