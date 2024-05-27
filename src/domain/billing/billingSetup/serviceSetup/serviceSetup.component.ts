import {
  NgcUtility, NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcDropDownComponent, NgcButtonComponent,
  NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest, BaseResponse, PageConfiguration
} from "ngc-framework";

import {
  Component, NgZone, ElementRef, OnInit,
  OnDestroy, ViewContainerRef, ViewChild
} from "@angular/core";
import { Validators } from '@angular/forms';
import { NgcFormControl } from "ngc-framework";
import { ActivatedRoute, Router } from "@angular/router";
import { BillingService } from '../../billing.service';
import { BillingServiceMasterRequest } from '../../billing.sharedmodel';
import { BillingCreateServiceSetupRequest } from '../../billing.sharedmodel';
import { ApplicationEntities } from "../../../common/applicationentities";

@Component({
  selector: 'app-serviceSetup',
  templateUrl: './serviceSetup.component.html',
  styleUrls: ['./serviceSetup.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ServiceSetupComponent extends NgcPage {
  private isEdit: boolean = false;
  private show: boolean = true;
  showValidFlightCheck: boolean = false;
  hasReadPermission: boolean = false;
  resp: any;
  private forwardedData: any = null;
  // namePattern = "^[a-zA-Z ]*$";
  private serviceSetupForm: NgcFormGroup = new NgcFormGroup({
    adhocService: new NgcFormControl(true),
    serviceCode: new NgcFormControl(),
    serviceCategory: new NgcFormControl(),
    name: new NgcFormControl(),
    associatedTo: new NgcFormControl(),
    duration: new NgcFormControl(),
    durationOf: new NgcFormControl(),
    durationUom: new NgcFormControl(),
    absoluteDuration: new NgcFormControl(true),
    quantity: new NgcFormControl(),
    quantityOf: new NgcFormControl(),
    uom: new NgcFormControl(),
    attachedToCargo: new NgcFormControl(),
    attachedvalidFlight: new NgcFormControl(),
    handlingArea: new NgcFormControl(),
    leadTime: new NgcFormControl('', [Validators.maxLength(2)]),
    slaFor: new NgcFormControl('', [Validators.maxLength(2)]),
    allowForAgent: new NgcFormControl(),
    paidService: new NgcFormControl(false),
    upfrontPayment: new NgcFormControl(),
    chargeCodeId: new NgcFormControl(),
    termsAndCondition: new NgcFormControl(),
    option: new NgcFormControl(),
    optionName: new NgcFormControl(),
    optionLov: new NgcFormControl(),
    serviceAutoComplete: new NgcFormControl(),
    serviceProviderCustomerType: new NgcFormControl(),
    defaultQuantity: new NgcFormControl(),
    quantityModifiable: new NgcFormControl()
  });
  showServiceAutoComplete: boolean;
  columnSize: any = 2;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private billingService: BillingService, private route: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Billing_TruckNumber)) {
      this.columnSize = 1.5;
    }
    this.forwardedData = this.getNavigateData(this.route);
    this.serviceSetupForm.get('leadTime').setValidators([Validators.required]);
    this.serviceSetupForm.get('slaFor').setValidators([Validators.required]);
    this.serviceSetupForm.get('adhocService').valueChanges.subscribe(newValue => {
      this.show = newValue;
      if (!this.show) {
        this.serviceSetupForm.get('slaFor').setValidators([]);
        this.serviceSetupForm.get('leadTime').setValidators([]);
      } else {

        this.serviceSetupForm.get('leadTime').setValidators([Validators.required]);
        this.serviceSetupForm.get('slaFor').setValidators([Validators.required]);
      }
    });
  }

  /**
   * After View Init
   */
  ngAfterViewInit() {
    super.ngAfterViewInit();
    // checking if the fetched data is not null
    if (this.forwardedData != null) {
      this.setFetchedData(this.forwardedData.editSearchData);
    } else {
      this.serviceSetupForm.reset();
      this.serviceSetupForm.get('adhocService').patchValue(true);
      this.serviceSetupForm.get('absoluteDuration').patchValue(true);
    }
    this.enableOnPaidServiceChange();
    //
    this.serviceSetupForm.get('paidService').valueChanges.subscribe(
      (newValue) => {
        this.enableOnPaidServiceChange();
      });

    this.hasReadPermission = NgcUtility.hasReadPermission('MAINTAIN_SERVICE_MASTER');
  }

  /**
     * Called for disabling and enabling fields depending on paidService
     */
  private enableOnPaidServiceChange() {
    let paidService: boolean = this.serviceSetupForm.get('paidService').value;

    if (!paidService) {
      this.serviceSetupForm.get('upfrontPayment').disable();
      this.serviceSetupForm.get('upfrontPayment').setValue(false);
      this.serviceSetupForm.get('chargeCodeId').disable();
      this.serviceSetupForm.get('chargeCodeId').setValidators([]);
    } else {
      this.serviceSetupForm.get('upfrontPayment').enable();
      this.serviceSetupForm.get('chargeCodeId').enable();
      this.serviceSetupForm.get('chargeCodeId').setValidators([Validators.required]);
    }
  }

  onChangeServiceCategory(data: any) {
    console.log(data);
    if (data != null && data != '') {
      this.showValidFlightCheck = true;

    } else {
      this.showValidFlightCheck = false;
    }
    if (data == 'efacilitation' || data == 'Efacilitation') {
      this.showServiceAutoComplete = true
    } else {
      this.showServiceAutoComplete = false
    }
  }

  /**
   * Called when the data is forwarded from maintainSereviceMaster screen
   * This patches the forwarded data with serviceSetup.
   * @param forwardedData
   * @returns void
   */
  private setFetchedData(forwardedData: any): void {
    this.isEdit = true;
    let fetchRecord: BillingServiceMasterRequest = forwardedData;
    //
    this.billingService.getServiceSetupRecord(fetchRecord).subscribe(response => {
      if (response.success) {
        if (response.data && response.data.optionLov) {
          //Conversion of Option Value comma separated String to a list for displaying as tag input
          response.data.optionLov = response.data.optionLov.split(",");
        }
        this.resp = response.data;
        /* for backward compatibility if serviceProviderCustomerType is null
        then consider it as GHA */
        if (NgcUtility.isBlank(this.resp.serviceProviderCustomerType)) {
          this.resp.serviceProviderCustomerType = 'GHA'
        }
        this.serviceSetupForm.patchValue(this.resp);

        this.enableOnPaidServiceChange();
      } else {
        this.refreshFormMessages(response.data);
      }
    });

  }
  /**
   * back To previous page
   * @param {any} $event
   * @memberof 
   */
  onCancel($event) {
    this.navigateTo(this.router, '/billing/billingSetup/maintainServiceMaster', this.forwardedData ? this.forwardedData : {});
  }

  /**
     * Called when data has to be updated or inserted
     * 
     */
  public onSave() {
    // Validate
    this.serviceSetupForm.validate();
    // If Invalid, Don't Process
    if (this.serviceSetupForm.invalid) {
      return;
    }

    if (this.serviceSetupForm.get('quantityOf').invalid) {
      this.showErrorStatus('billing.name.mistmatch');
      return;
    }
    if (!this.serviceSetupForm.get('duration').value) {
      this.serviceSetupForm.get('durationOf').setValue(null);
      this.serviceSetupForm.get('durationUom').setValue(null);
      this.serviceSetupForm.get('absoluteDuration').setValue(false);
    }
    if (!this.serviceSetupForm.get('quantity').value) {
      this.serviceSetupForm.get('quantityOf').setValue(null);
      this.serviceSetupForm.get('uom').setValue(null);
      this.serviceSetupForm.get('defaultQuantity').setValue(null);
      this.serviceSetupForm.get('quantityModifiable').setValue(null);
    }
    if (!this.serviceSetupForm.get('option').value) {
      this.serviceSetupForm.get('optionName').setValue(null);
      this.serviceSetupForm.get('optionLov').setValue(null);
    }
    if (this.isEdit) {
      let update: BillingCreateServiceSetupRequest = this.serviceSetupForm.getRawValue();
      //Conversion of Option Value list to comma separated String
      if (update.optionLov && update.optionLov.length) {
        update.optionLov = update.optionLov.join(",");
      }
      this.billingService.updateServiceMaster(update).subscribe(response => {
        if (response.success && !response.messageList) {
          this.resp = response.data;
          this.setFetchedData(this.resp);
          this.showSuccessStatus("billing.sucess.service.updated");
        } else {
          if (response.messageList && response.messageList.length > 0) {
            this.refreshFormMessages(response);
          } else {
            this.refreshFormMessages(response.data);
          }
        }
      });
    } else {
      let save: BillingCreateServiceSetupRequest = this.serviceSetupForm.getRawValue();
      //Conversion of Option Value list to comma separated String
      if (save.optionLov && save.optionLov.length) {
        save.optionLov = save.optionLov.join(",");
      }
      this.billingService.saveServiceMaster(save).subscribe(response => {
        if (response.success && !response.messageList) {
          this.resp = response.data;
          this.setFetchedData(this.resp);
          this.showSuccessStatus("billing.sucess.servicecreated");
        } else {
          if (response.messageList && response.messageList.length > 0) {
            this.refreshFormMessages(response);
          } else {
            this.refreshFormMessages(response.data);
          }
        }
      });
    }
  }
}
