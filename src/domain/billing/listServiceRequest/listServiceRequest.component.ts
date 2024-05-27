import {
    NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcDropDownComponent, NgcButtonComponent,
    NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest, BaseResponse, PageConfiguration
} from "ngc-framework";
import { BuildupService } from '../../export/buildup/buildup.service';
import {
    Component, NgZone, ElementRef, OnInit,
    OnDestroy, ViewContainerRef, ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgcFormControl, NgcUtility, DateTimeKey } from "ngc-framework";
import { Validators } from '@angular/forms';
import { BillingService } from '../billing.service';
import { ListServiceRequest } from '../billing.sharedmodel';
import { AwbManagementService } from "../../awbManagement/awbManagement.service";
import { ApplicationEntities } from "../../common/applicationentities";
import { ApplicationFeatures } from '../../common/applicationfeatures';
import { isNull } from "util";

@Component({
    selector: 'app-listServiceRequest',
    templateUrl: './listServiceRequest.component.html',
    styleUrls: ['./listServiceRequest.component.scss']
})
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    autoBackNavigation: true
})
export class ListServiceRequestComponent extends NgcPage {

    resp: any;
    record: any;
    isAWB: boolean = true;
    isGeneric = false;
    isTruck = false;
    isULD = false;
    truckNumberColumn = 2;
    showTruckInput: boolean = false;
    showAWBInput: boolean = false;
    showULDInput: boolean = false;

    private listServiceRequestForm: NgcFormGroup = new NgcFormGroup({
        searchOp: new NgcFormGroup({
            hawbNumber: new NgcFormControl(),
            domIntl: new NgcFormControl(),
            requestedFrom: new NgcFormControl(NgcUtility.getCurrentDateOnly(), Validators.required),
            requestedTo: new NgcFormControl(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), (23 * 60) + 59,
                DateTimeKey.MINUTES), Validators.required),
            status: new NgcFormControl(),
            customerId: new NgcFormControl(),
            handlingArea: new NgcFormControl(),
            serviceCode: new NgcFormControl(),
            shipmentNumber: new NgcFormControl(),
            containerNumber: new NgcFormControl(),
            flightId: new NgcFormControl(),
            flightKey: new NgcFormControl(),
            flightDate: new NgcFormControl(),
            remarks: new NgcFormControl(),
            requestedBy: new NgcFormControl(),
            paymentStatus: new NgcFormControl(),
            serviceRequestNo: new NgcFormControl('', [Validators.maxLength(20)]),
            shipmentHouseId: new NgcFormControl(),
            truckNumber: new NgcFormControl()
        }),
        resultList: new NgcFormArray([])
    });

    private viewServiceRequestForm: NgcFormGroup = new NgcFormGroup({
        serviceCode: new NgcFormControl(),
        status: new NgcFormControl(),
        uom: new NgcFormControl(),
        customerId: new NgcFormControl(),
        customerName: new NgcFormControl(),
        requestedOn: new NgcFormControl(),
        requestedBy: new NgcFormControl(),
        associatedTo: new NgcFormControl(),
        requestorContactNumber: new NgcFormControl(),
        quantityOf: new NgcFormControl(),
        requestedQuantity: new NgcFormControl(),
        durationOf: new NgcFormControl(),
        duration: new NgcFormControl(),
        durationUom: new NgcFormControl(),
        remarks: new NgcFormControl(),
        documentReferenceId: new NgcFormControl(),
        notificationEmailId1: new NgcFormControl(),
        notificationEmailId2: new NgcFormControl(),
        notificationEmailId3: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        flightId: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        containerNumber: new NgcFormControl(),
        startedOn: new NgcFormControl(),
        completedOn: new NgcFormControl(),
        rejectReason: new NgcFormControl(),
        rejectReasonCode: new NgcFormControl(),
        validateRequestedOn: new NgcFormControl(),
        additionalRemarks: new NgcFormControl(),
        serviceRequestNo: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        taxAmount: new NgcFormControl(),
        grossAmount: new NgcFormControl(),
        amount: new NgcFormControl(),
        taxCompCode: new NgcFormControl(),
        taxComp1Code: new NgcFormControl(),
        taxComp2Code: new NgcFormControl(),
        taxComp3Code: new NgcFormControl(),
        taxComp1: new NgcFormControl(),
        taxComp2: new NgcFormControl(),
        taxComp3: new NgcFormControl(),
        serviceCategory: new NgcFormControl(),
    });

    @ViewChild('viewWindow') selectWindow: NgcWindowComponent;
    handledbyHouse: boolean = false;

    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private billingService: BillingService, private router: Router,
        private activated: ActivatedRoute, private awbManagementService: AwbManagementService) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Billing_TruckNumber)) {
            this.truckNumberColumn = 1.5
        }
        console.log(this.getUserProfile());
        let user = this.getUserProfile();
        super.ngOnInit();
        let forwardedData = this.getNavigateData(this.activated);
        // checking if the fetched data is not null
        if (forwardedData != null) {
            this.listServiceRequestForm.get('searchOp').patchValue(forwardedData.searchOption);
            // Search Again
            this.searchServices();
        }
        if (forwardedData != null) {
            this.listServiceRequestForm.get(['searchOp', 'shipmentNumber']).patchValue(forwardedData.shipmentNumber);
            // Search Again
            this.searchServices();
        }
        this.searchServices();
    }

    /**
         * On Search of Function
         *
         * @param event Event
         */
    private searchServices() {
        const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.listServiceRequestForm.get('searchOp'));
        // Validate
        searchFormGroup.validate();
        // if invalid
        if (this.listServiceRequestForm.get(['searchOp']).invalid) {
            this.showErrorMessage("", "billing.error.mandatory.fields");
            return;
        }
        let search: ListServiceRequest = (this.listServiceRequestForm.get("searchOp") as NgcFormGroup).getRawValue();
        (this.listServiceRequestForm.get('resultList') as NgcFormArray).resetValue([]);
        this.billingService.getServiceRequestList(search).subscribe(response => {
            if (!this.showResponseErrorMessages(response)) {
                this.resetFormMessages();
                this.resp = new Array();
                this.resp = response.data;
                this.resp.forEach(serviceList => {
                    serviceList.check = false;
                    if (serviceList.slaIndicator == 'closeToSla') {
                        serviceList.slaIndicator = 'Close to SLA'
                    }
                    if (!serviceList.rejectReason) {
                        serviceList.rejectReason = serviceList.rejectReasonCode;
                    }

                    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_SalesTax)) {
                        // serviceList.taxCompCode = this.taxPaymentText(serviceList);
                    }
                });
                (<NgcFormArray>this.listServiceRequestForm.get('resultList')).patchValue(this.resp);
            } else {
                this.refreshFormMessages(response);
            }
        });
    }

    // taxPaymentText(serviceList) {
    //     return '' + (!isNull(serviceList.taxComp1Code) ?
    //         serviceList.taxComp1Code : '') + (!isNull(serviceList.taxComp2Code) ? ' +' +
    //             serviceList.taxComp2Code : '') + (!isNull(serviceList.taxComp3Code) ? ' +' +
    //                 serviceList.taxComp3Code : '');
    // }

    /**
   *
   *This method is called On click  edit link and navigate to popup for edit/delete.
   * @memberof 
   */
    onLinkClick(event) {
        if (event.column === 'EDIT') {
            this.record = new Object();
            this.record.serviceRequestId = event.record.serviceRequestId;
            this.navigate('/billing/editServiceRequest', {
                editSearchData: this.record,
                searchOption: (this.listServiceRequestForm.get('searchOp') as NgcFormGroup).getRawValue()
            });
        }
        if (event.column === 'serviceRequestNo') {
            this.record = new Object();
            this.record.serviceRequestId = event.record.serviceRequestId;
            this.viewServiceRequestForm.reset();
            //
            this.billingService.getServiceRequest(this.record).subscribe(response => {
                if (response.success) {
                    this.resp = response.data;
                    //(<NgcFormArray>this.serviceSetupForm.controls['resultList']).patchValue(this.resp);
                    if (response.data.associatedTo === 'AWB') {
                        this.isAWB = true;
                        this.isGeneric = false;
                        this.isTruck = false;
                        this.isULD = false;
                    } else {
                        this.isAWB = false;
                        this.isGeneric = true;
                        if (response.data.associatedTo == 'TRUCK') {
                            this.isTruck = true;
                            this.isULD = false;
                        }
                        if (response.data.associatedTo == 'ULD') {
                            this.isULD = true;
                            this.isTruck = false;
                        }
                    }
                    this.viewServiceRequestForm.patchValue(this.resp);
                } else {
                    this.refreshFormMessages(response.data);
                }
            });
            this.selectWindow.open();
        }
    }


    /**
       *
       *This method is called On click  create button.
       * @memberof 
       */
    createServiceRequest(event) {
        this.navigate('/billing/createServiceRequest', {});
    }


    /**
     *
     *This method is called On click  start button.
     * @memberof 
     */
    startService(event) {
        let check = this.listServiceRequestForm.getRawValue().resultList.filter(a => a['check']
            && (a['status'] == 'Started' || a['status'] == 'Completed' || a['status'] == 'Rejected') || (a['upfrontPayment'] == 'true' && a['paymentStatus'] == 'Pending'));
        // if status is started/completed/rejected
        if (!check.length) {
            let checked = this.listServiceRequestForm.getRawValue().resultList.filter(a => a['check']
                && a['status'] != 'Started' && a['status'] != 'Completed');
            checked.forEach(elem => {
                elem['status'] = 'Started';
                elem['loggedInUser'] = this.getUserProfile().userShortName;
            });
            if (checked.length) {
                this.billingService.startServiceRequest(checked).subscribe(response => {
                    if (response.success && !response.messageList) {
                        this.resetFormMessages();
                        this.resp = response.data;
                        this.showSuccessStatus("billing.sucess.service.started");
                        this.searchServices();
                    } else {
                        if (response.messageList && response.messageList.length > 0) {
                            this.refreshFormMessages(response);
                        } else {
                            this.refreshFormMessages(response.data);
                        }
                    }
                });
            } else {
                this.showErrorMessage('billing.error.service.start');
            }
        } else {
            this.showErrorMessage('billing.error.already.started');
        }
    }

    /**
   *
   *This method is called On click  complete button.
   * @memberof 
   */

    completeService(event) {
        let check_complete_reject = this.listServiceRequestForm.getRawValue().resultList.filter(a => a['check']
            && (a['status'] == 'Rejected' || a['status'] == 'Completed'));
        // if status is completed/rejected
        if (!check_complete_reject.length) {
            let checked = this.listServiceRequestForm.getRawValue().resultList.filter(a => a['check']);
            checked.forEach(elem => {
                if (elem['status'] == 'Started') {
                    elem['status'] = 'Completed';
                    elem['loggedInUser'] = this.getUserProfile().userShortName;
                } else {
                    elem['status'] = 'updateTime';
                }
            });
            if (checked.length) {
                this.billingService.completeServiceRequest(checked).subscribe(response => {
                    if (response.success && !response.messageList) {
                        this.resetFormMessages();
                        this.resp = response.data;
                        this.showSuccessStatus("billing.sucess.service.completed");
                        this.searchServices();
                    } else {
                        if (response.messageList && response.messageList.length > 0) {
                            this.refreshFormMessages(response);
                        } else {
                            this.refreshFormMessages(response.data);
                        }
                    }
                });
            } else {
                this.showErrorMessage('billing.error.service.completed');
            }
        } else {
            this.showErrorMessage('billing.error.already.started');
        }
    }

    setAWBNumber(object) {
        if (object.code == null) {
            this.showErrorStatus('hawb.invalid');
        }
        else {
            this.resetFormMessages();
            this.listServiceRequestForm.controls.searchOp.get('hawbNumber').setValue(object.code);
            this.listServiceRequestForm.controls.searchOp.get('shipmentHouseId').setValue(object.param2);
        }
    }
    getFlightDetails(event) {
        if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
            let search = {
                shipmentNumber: this.listServiceRequestForm.controls.searchOp.get('shipmentNumber').value,
                shipment: this.listServiceRequestForm.controls.searchOp.get('shipmentNumber').value,
                shipmentType: 'AWB',
                appFeatures: null,
            }
            this.billingService.checkHandledByOrAccpByHouse(search).subscribe(data => {
                if (!this.showResponseErrorMessages(data)) {
                    if (data) {
                        this.handledbyHouse = true;
                    } else {
                        this.handledbyHouse = false;
                    }
                }
            })
        }
    }

    setReferenceCode(event) {
        if (event.code == 'TRUCK') {
            this.showTruckInput = true;
            this.showAWBInput = false;
            this.showULDInput = false;
        } else if (event.code == 'AWB') {
            this.showAWBInput = true;
            this.showTruckInput = false;
            this.showULDInput = false;
        } else if (event.code == 'ULD') {
            this.showULDInput = true;
            this.showTruckInput = false;
            this.showAWBInput = false;
        }

    }
}