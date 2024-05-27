import { Component, NgZone, ElementRef, ViewContainerRef, ViewChild, Input } from '@angular/core';
import { NgcPage, PageConfiguration, ReactiveModel, NgcFormGroup, NgcUtility } from 'ngc-framework';
import {
    AcceptanceInfoModel, ExportAwbDocumentModel, ExportAwbDocumentSearchModel,
    IVRSNotificationContactInfo, ShipmentMasterCustomerAddressInfoModel, ShipmentMasterCustomerContactInfoModel,
    ShipmentMasterCustomerInfoModel, ShipmentMasterRoutingInfoModel, ShipmentMasterSHCModel, ShipmentExecModel,
    ShipmentRemarksModel
} from '../.././export.sharedmodel';
import { ExportService } from '../../export.service';
import { CargoProcessingEngineService } from '../../../warehouse/cargoprocessingengine/cargoprocessingengine.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';

@Component({
    selector: 'ngc-exportAwbDocument',
    templateUrl: './exportAwbDocument.component.html',
    styleUrls: ['./exportAwbDocument.component.scss']
})
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    autoBackNavigation: true,
    restorePageOnBack: true
})
export class ExportAwbDocumentComponent extends NgcPage {

    @ReactiveModel(ExportAwbDocumentSearchModel)
    public exportAwbDocForm: NgcFormGroup;

    @ReactiveModel(ExportAwbDocumentModel)
    public exportAwbDocSaveForm: NgcFormGroup;

    shipmentTypeValue: any = 'AWB';
    @ViewChild("shipmentType") shipmentType: any = 'AWB';
    @Input('shipmentNumberData') shipmentNumberData: string;
    @Input('shipmentTypeData') shipmentTypeData: string;
    displayFlag: boolean = false;
    forwardedData: any;
    actionlistindicator: string;
    shipperCustomerCode: any;
    consigneeCustomerCode: any;
    showHideChild = [];
    shipperConsigneeRecord: ShipmentMasterCustomerInfoModel = new ShipmentMasterCustomerInfoModel();

    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
        private exportAwbService: ExportService, private _cargoEngineProcessService: CargoProcessingEngineService,
        private router: Router, private activatedRoute: ActivatedRoute
    ) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        this.shipmentType = 'AWB';
        this.forwardedData = this.getNavigateData(this.activatedRoute);
        if (this.forwardedData) {
            this.forwardedData.shipmentNumber = this.forwardedData.shipmentNumberData;
            this.exportAwbDocForm.get('shipmentNumber').patchValue(this.forwardedData.shipmentNumberData);
            if (this.forwardedData.shipmentTypeData) {
                this.shipmentType = this.forwardedData.shipmentTypeData;
            } else {
                this.shipmentType = "AWB"
            }
            this.onSearch();
        }
    }

    onSearch() {
        this.search();
        this.onAwbNumberChange();
    }

    search() {
        const searchRequest = this.exportAwbDocForm.getRawValue();
        this.exportAwbDocForm.validate();
        if (!this.exportAwbDocForm.valid) {
            this.showErrorStatus('g.shipment.number.mandatory');
            return;
        }
        this.displayFlag = false;
        this.exportAwbService.getExportAwbDocumentResponse(searchRequest).subscribe(response => {
            this.resetFormMessages();
            if (response !== null) {
                if (this.showResponseErrorMessages(response)) {
                    return;
                }
            }
            this.exportAwbDocSaveForm.reset();
            this.displayFlag = true;
            this.exportAwbDocSaveForm.patchValue(response.data);
        })
    }

    onSelectShipperName(event) {
        if (event.code) {
            this.exportAwbDocSaveForm.get(['shipper']).setValidators([]);
            if (this.shipperConsigneeRecord.customerCode == event.code) {
                return;
            }
            else {
                let request: ShipmentMasterCustomerInfoModel = new ShipmentMasterCustomerInfoModel();
                request.customerCode = event.code;
                if (request.customerCode) {
                    this.shipperConsigneeRecord = request;
                    this.exportAwbService.getEmailInfo(request).subscribe(data => {
                        if (data.data) {
                            this.exportAwbDocSaveForm.get(['shipper', 'customerCode']).patchValue(event.code);
                            this.exportAwbDocSaveForm.get(['shipper', 'address', 'place']).patchValue(data.data.place);
                            this.exportAwbDocSaveForm.get(['shipper', 'address', 'postal']).patchValue(data.data.postal);
                            this.exportAwbDocSaveForm.get(['shipper', 'address', 'streetAddress']).patchValue(data.data.streetAddress);
                            this.exportAwbDocSaveForm.get(['shipper', 'address', 'stateCode']).patchValue(data.data.stateCode);
                            this.exportAwbDocSaveForm.get(['shipper', 'address', 'countryCode']).patchValue(data.data.countryCode);
                            this.exportAwbDocSaveForm.get(['shipper', 'customerName']).patchValue(event.desc);
                        }
                    });
                }
            }
        }
        else {
            this.patchShipperNull();
        }
    }

    patchShipperNull() {
        this.exportAwbDocSaveForm.get(['shipper', 'address', 'place']).patchValue(null);
        this.exportAwbDocSaveForm.get(['shipper', 'address', 'postal']).patchValue(null);
        this.exportAwbDocSaveForm.get(['shipper', 'address', 'streetAddress']).patchValue(null);
        this.exportAwbDocSaveForm.get(['shipper', 'address', 'stateCode']).patchValue(null);
        this.exportAwbDocSaveForm.get(['shipper', 'address', 'countryCode']).patchValue(null);
        this.exportAwbDocSaveForm.get(['shipper', 'customerName']).patchValue(null);
        this.exportAwbDocSaveForm.get(['shipper', 'customerCode']).patchValue(null);
        this.exportAwbDocSaveForm.get(['shipper', 'address', 'contactInformation']).patchValue({
            contactTypeCode: null,
            contactTypeDetail: null
        });
    }
    onSelectConsigneeName(event) {
        if (event && event.code) {
            this.exportAwbDocSaveForm.get(['consignee']).setValidators([]);
            if (this.shipperConsigneeRecord.customerCode == event.code) {
                return;
            }
            else {
                let request: ShipmentMasterCustomerInfoModel = new ShipmentMasterCustomerInfoModel();
                request.customerCode = event.code;
                if (request.customerCode) {
                    this.shipperConsigneeRecord = request;
                    this.exportAwbService.getEmailInfo(request).subscribe(data => {
                        if (data.data) {
                            this.exportAwbDocSaveForm.get(['consignee', 'customerCode']).patchValue(event.code);
                            this.exportAwbDocSaveForm.get(['consignee', 'address', 'place']).patchValue(data.data.place);
                            this.exportAwbDocSaveForm.get(['consignee', 'address', 'postal']).patchValue(data.data.postal);
                            this.exportAwbDocSaveForm.get(['consignee', 'address', 'streetAddress']).patchValue(data.data.streetAddress);
                            this.exportAwbDocSaveForm.get(['consignee', 'address', 'stateCode']).patchValue(data.data.stateCode);
                            this.exportAwbDocSaveForm.get(['consignee', 'address', 'countryCode']).patchValue(data.data.countryCode);
                            this.exportAwbDocSaveForm.get(['consignee', 'customerName']).patchValue(event.desc);
                        }
                    });
                }
            }
        } else {
            this.patchConsigneeNull();
        }
    }

    patchConsigneeNull() {
        this.exportAwbDocSaveForm.get(['consignee', 'customerCode']).patchValue(null);
        this.exportAwbDocSaveForm.get(['consignee', 'address', 'place']).patchValue(null);
        this.exportAwbDocSaveForm.get(['consignee', 'address', 'postal']).patchValue(null);
        this.exportAwbDocSaveForm.get(['consignee', 'address', 'streetAddress']).patchValue(null);
        this.exportAwbDocSaveForm.get(['consignee', 'address', 'stateCode']).patchValue(null);
        this.exportAwbDocSaveForm.get(['consignee', 'address', 'countryCode']).patchValue(null);
        this.exportAwbDocSaveForm.get(['consignee', 'customerName']).patchValue(null);
        this.exportAwbDocSaveForm.get(['consignee', 'address', 'contactInformation']).patchValue({
            contactTypeCode: null,
            contactTypeDetail: null
        });
    }

    onAwbNumberChange() {
        this.displayFlag = false;
    }

    selectShipmentType(event) {
        this.exportAwbDocForm.get('shipmentType').patchValue(event.shipmentType);
    }

    shipperMandatoryDetails() {
        if (!this.exportAwbDocSaveForm.get(['shipper', 'address', 'place']).value || !this.exportAwbDocSaveForm.get(['shipper', 'address', 'streetAddress']).value ||
            !this.exportAwbDocSaveForm.get(['shipper', 'customerName']).value || !this.exportAwbDocSaveForm.get(['shipper', 'address', 'countryCode']).value) {
            return true;
        }
    }
    consigneeMandatoryDetails() {
        if (!this.exportAwbDocSaveForm.get(['consignee', 'address', 'place']).value || !this.exportAwbDocSaveForm.get(['consignee', 'address', 'streetAddress']).value ||
            !this.exportAwbDocSaveForm.get(['consignee', 'customerName']).value || !this.exportAwbDocSaveForm.get(['consignee', 'address', 'countryCode']).value) {
            return true;
        }
    }
    routingMandatoryDetails() {
        if (!this.exportAwbDocSaveForm.get(['routing', 0, 'carrier']).value) {
            return true;
        }
    }

    validateSave() {
        if (this.shipperMandatoryDetails() && this.routingMandatoryDetails()) {
            this.showErrorMessage('expaccpt.fill.all.mandatory.details');
        }
        else if (this.shipperMandatoryDetails() || this.consigneeMandatoryDetails()) {
            this.showErrorMessage('Shipper/Consignee Information is mandatory');
        }
        else if (this.routingMandatoryDetails()) {
            this.showErrorMessage('Routing Information is mandatory')
        }
        return;
    }

    onSave() {
        const saveRequest: ExportAwbDocumentModel = this.exportAwbDocSaveForm.getRawValue();
        this.exportAwbDocSaveForm.validate();
        if (!this.exportAwbDocSaveForm.valid) {
            this.validateSave();
        }
        else {
            this.exportAwbService.saveExportAwbDocumentResponse(saveRequest)
                .subscribe(response => {
                    this.resetFormMessages();
                    if (response !== null) {
                        if (!this.showResponseErrorMessages(response)) {
                            this.showSuccessStatus('g.completed.successfully');
                            this.exportAwbDocSaveForm.patchValue(response.data);
                        }
                    }
                })
        }
    }
    onDocumentComplete() {
        let request: ExportAwbDocumentModel = this.exportAwbDocSaveForm.getRawValue();
        this.exportAwbDocSaveForm.validate();
        if (!this.exportAwbDocSaveForm.valid) {
            this.validateSave();
        }
        else {
            this.exportAwbService.getDocumentCompleteResponse(request).subscribe(response => {
                this.resetFormMessages();
                if (response !== null) {
                    if (!this.showResponseErrorMessages(response)) {
                        this.exportAwbDocSaveForm.patchValue(response.data);
                        if (response.data.lodgeInAlertType == 'E') {
                            this.showErrorMessage(response.data.lodgeInMsg, null, [response.data.lodgeInPlaceHolder]);
                        } else if (response.data.lodgeInAlertType == 'C') {
                            this.showConfirmMessage(NgcUtility.translateMessage(response.data.lodgeInMsg, [response.data.lodgeInPlaceHolder])).then(fulfilled => {
                                this.exportAwbDocSaveForm.get('lodgeInRequest').setValue(true);
                                this.onDocumentComplete();
                            }).catch(reason => {

                            });
                        }
                        else if (response.data.acknowledgeIndicatorCPE) {
                            this.showErrorStatus('export.acknowledge.and.close.all.actions');
                            this.actionlistindicator = "error";
                        }
                        else if (this.exportAwbDocSaveForm.get('paymentStatus').value === 'CHARGE_PENDING') {
                            if (this.exportAwbDocSaveForm.get('handledByDOMINT').value === 'INT') {
                                this.showErrorMessage('exp.accpt.charges.pending', null, [this.exportAwbDocSaveForm.get('billingErrorPlaceholder').value]); //Charges pending for {0}
                            } else if (this.exportAwbDocSaveForm.get('handledByDOMINT').value === 'DOM') {
                                this.showErrorMessage('exp.accpt.documentcomplete.warining'); //Please pay the charges to continue with Document Complete
                            }
                        } else {
                            this.showSuccessStatus('g.completed.successfully');
                            this.exportAwbService.updateChargesOnDocumentComplete(request).subscribe();
                        }
                    }
                }
            });
        }
    }

    onDocumentReOpen() {
        let request: ExportAwbDocumentModel = this.exportAwbDocSaveForm.getRawValue();
        this.exportAwbDocSaveForm.validate();
        if (!this.exportAwbDocSaveForm.valid) {
            this.validateSave();
        }
        else {
            this.exportAwbService.getDocumentReOpenResponse(request).subscribe(data => {
                this.resetFormMessages();
                let response = data;
                if (response != null) {
                    if (!this.showResponseErrorMessages(response)) {
                        this.exportAwbDocSaveForm.patchValue(response.data);
                        this.showSuccessStatus('g.completed.successfully');
                        this.exportAwbService.updateChargesOnDocumentComplete(request).subscribe();
                    }
                }
            })
        }
    }

    onshowHideChild(index) {
        this.showHideChild[index] = !this.showHideChild[index];
    }

    openShipmentInfo() {
        var dataToSend = {
            shipmentType: this.exportAwbDocForm.get('shipmentType').value,
            shipmentNumber: this.exportAwbDocForm.get(['shipmentNumber']).value
        }
        this.navigateTo(this.router, 'awbmgmt/shipmentinfo', dataToSend)

    }
    openCollectCharge() {
        var dataToSend =
        {
            shipmentType: this.exportAwbDocForm.get('shipmentType').value,
            shipment: this.exportAwbDocForm.get(['shipmentNumber']).value,
        }
        this.navigateTo(this.router, 'billing/collectPayment/enquireCharges', dataToSend)

    }
    openDGDeclaration() {
        let shipmentObj: any = new Object();

        shipmentObj.shipmentType = this.exportAwbDocForm.get('shipmentType').value;

        shipmentObj.shipmentNumber = this.exportAwbDocForm.get('shipmentNumber').value;

        this.navigateTo(this.router, 'export/dangerousgoods/dgdradioactive', shipmentObj);
    }
    openScreening() {
        var dataToSend = {
            shipmentType: this.exportAwbDocForm.get('shipmentType').value,
            shipmentNumber: this.exportAwbDocForm.get(['shipmentNumber']).value,
        }
        this.navigateTo(this.router, 'export/acceptance/rcarscreeningpoint', dataToSend)

    }
    openCheckList() {
        var dataToSend = {
            shipmentType: this.exportAwbDocForm.get('shipmentType').value,
            shipmentNumber: this.exportAwbDocForm.get(['shipmentNumber']).value,
        }
        this.navigateTo(this.router, 'export/checklist/setupcheckliststatus', dataToSend)

    }

    onCloseFailureData() {

        const closeFailureRequest: ShipmentExecModel = new ShipmentExecModel();
        const requestData = this.exportAwbDocSaveForm.get('ruleShipmentExecutionDetails').value;
        const shipmentWarnDetails = [];
        const shipmentInfoDetails = [];
        for (const eachRow of requestData.execWarnList) {
            if (eachRow.acknowledge && !eachRow.issueClosedOn) {
                eachRow.recordId = eachRow.failureId;
                shipmentWarnDetails.push(eachRow);
            }
        }
        for (const eachRow of requestData.execInfoList) {
            if (eachRow.acknowledge && !eachRow.issueClosedOn) {
                eachRow.recordId = eachRow.failureId;
                shipmentInfoDetails.push(eachRow);
            }
        }
        closeFailureRequest.shipmentWarnDetails = shipmentWarnDetails;
        closeFailureRequest.shipmentInfoDetails = shipmentInfoDetails;
        this._cargoEngineProcessService.oncloseFailure(closeFailureRequest).subscribe(response => {
            if (!this.showResponseErrorMessages(response)) {
                this.fetchRuleExecutionList();
            };
        });
    }

    fetchRuleExecutionList() {
        let cargo = this.exportAwbDocSaveForm.getRawValue();
        //Research the data
        this.exportAwbService.fetchRuleShipmentExecutionListExportAwbDocument(cargo).subscribe(response => {
            let ruleShipmentExecutionDetails: any;
            ruleShipmentExecutionDetails = response.data.ruleShipmentExecutionDetails;
            this.exportAwbDocSaveForm.get('ruleShipmentExecutionDetails').patchValue(response.data.ruleShipmentExecutionDetails);
            if (response.data.acknowledgeIndicatorCPE) {
                this.actionlistindicator = "error"
            } else {
                this.actionlistindicator = "";
            }
        });
    }

    onByPassLodgeInCheck(event) {
        if (event) {
            this.exportAwbDocSaveForm.get('byPassLodgeInRemarks').setValidators([Validators.required]);
        } else {
            this.exportAwbDocSaveForm.get('byPassLodgeInRemarks').setValue(null);
            this.exportAwbDocSaveForm.get('byPassLodgeInRemarks').clearValidators();
        }
    }

    // On Destroy

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
