import { Component, OnInit, ViewContainerRef, ElementRef, NgZone } from '@angular/core';
import { NgcUtility, NgcFormGroup, NgcFormControl, NgcFormArray, NgcPage, PageConfiguration } from 'ngc-framework';
import { BillingService } from '../../billing.service';
import { ChargePostConfigurationSearch } from '../../billing.sharedmodel';
import { element } from 'protractor';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-chargeposting-configuration',
  templateUrl: './chargeposting-configuration.component.html',
  styleUrls: ['./chargeposting-configuration.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ChargepostingConfigurationComponent extends NgcPage {

  info: string;
  ChargeCodeData: any;
  length: number;
  saveChargePostingConfigurationRequest: any;
  responseList: any;
  deleteCount: number = 0;
  chargePostingConfigurationForSearch: ChargePostConfigurationSearch = new ChargePostConfigurationSearch();
  subGroupSource: any;
  hasReadPermission: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private billingService: BillingService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.ChargeCodeData = this.getNavigateData(this.activatedRoute);
    this.chargePostingConfigurationForm.patchValue(this.ChargeCodeData.chargeCode);
    this.subGroupSource = this.createSourceParameter(this.ChargeCodeData.chargeCode.billingChargeCodeId);
    this.searchChargePostingConfiguration();
  }

  chargePostingConfigurationForm: NgcFormGroup = new NgcFormGroup({
    chargeCodeName: new NgcFormControl(),
    chargeCodeDescription: new NgcFormControl(),
    ChargePostingConfiguration: new NgcFormArray([])
  }
  );

  /**
   * This method 
   * will perform 
   * get charge posting configuartion data based
   * on charge code id
   */
  searchChargePostingConfiguration() {

    this.hasReadPermission = NgcUtility.hasReadPermission('MAINTAIN_CHARGE_CODE');

    this.resetFormMessages();
    if (this.ChargeCodeData != null && this.ChargeCodeData.chargeCode) {
      this.chargePostingConfigurationForSearch.billingChargeCodeId = this.ChargeCodeData.chargeCode.billingChargeCodeId;
      this.billingService.searchChargePostConfiguration(this.chargePostingConfigurationForSearch).subscribe(
        (response) => {
          this.responseList = response.data;
          this.length = this.responseList.length;
          if (response.data == null) {
            this.refreshFormMessages(response);
          }
          else {
            if (this.responseList.length) {
              this.chargePostingConfigurationForm.get('ChargePostingConfiguration').patchValue(response.data);
            }
            else {
              this.showInfoStatus("billing.charge.posting.configuration.not.exists");
            }
          }
        },
        (error) => {
          this.showErrorStatus(error);
        }
      )
      this.markAsRequired();
    }

  }

  /**
   * Add's an empty 
   * record with default as apportion value as 100
   */
  addRowForNewCombo() {
    (<NgcFormArray>this.chargePostingConfigurationForm.get(['ChargePostingConfiguration'])).addValue([
      {
        handlingArea: "",
        shcHandlingGroup: "",
        finSysChargeCode: "",
        finSysDescription: "",
        salesOrganization: null,
        distributionChannel: null,
        division: null,
        processType: "",
        subGroupId: "",
        apportionPercentage: 100,
        order: ++this.length
      }
    ])
    let indexOfLastRow = (this.chargePostingConfigurationForm.get(['ChargePostingConfiguration']) as NgcFormArray).length - 1;
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', indexOfLastRow, 'finSysChargeCode']).setValidators(Validators.required);
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', indexOfLastRow, 'apportionPercentage']).setValidators(Validators.required);
  }

  /** 
   * This method will
   * delete a record from the 
   * combo
  */
  onDeleteCombo(index) {
    (this.chargePostingConfigurationForm.get(["ChargePostingConfiguration", index]) as NgcFormGroup).markAsDeleted();
    // intiliaze order
    let order: number = 1;
    //
    (this.chargePostingConfigurationForm.get(["ChargePostingConfiguration"]) as NgcFormArray).controls.forEach((formGroup: NgcFormGroup) => {
      if (!formGroup.isSoftDeleted) {
        formGroup.get('order').setValue(order++);
      } else {
        formGroup.get('order').setValue(null);
      }
    });
    // Reintialize length value after deleting records in ui
    this.length = (this.chargePostingConfigurationForm.get(["ChargePostingConfiguration"]) as NgcFormArray).length
  }

  /*
   * This method
   * will save charge posting
   *  configuration data  
   */
  saveChargePostingConfiguration() {
    this.resetFormMessages();
    const saveChargePostConfigurationForm: NgcFormArray = (<NgcFormArray>this.chargePostingConfigurationForm.get(['ChargePostingConfiguration']))
    // if valid process further
    saveChargePostConfigurationForm.validate();
    // if invalid dont process
    if (this.chargePostingConfigurationForm.get(['ChargePostingConfiguration']).invalid) {
      return;
    }

    this.saveChargePostingConfigurationRequest = (this.chargePostingConfigurationForm.get(["ChargePostingConfiguration"]) as NgcFormArray).getRawValue();
    this.removeEmptyRecords();
    this.assignChargeCodeId();
    let req = this.saveChargePostingConfigurationRequest;
    req[0].chargeCodeName = this.chargePostingConfigurationForm.controls.chargeCodeName.value;
    this.billingService.saveChargePostConfiguration(req).subscribe
      ((response) => {
        /**  checks for any error messages from response object */
        if (this.showResponseErrorMessages(response, null, "ChargePostingConfiguration")) {
        }
        else {
          this.showSuccessStatus("g.data.update.successful");
          this.reloadPage();
        }
      },
        (error) => {
          this.showErrorStatus(error);
        }
      )
  }

  /**
   * This method 
   * will reomve empty records
   * from data being posted to 
   * service
   */
  removeEmptyRecords() {
    (this.chargePostingConfigurationForm.get(["ChargePostingConfiguration"]) as NgcFormArray).controls.forEach(
      (element: any, index: number) => {
        if ((element.get('handlingArea').value === "" || element.get('handlingArea').value === null) && (element.get('shcHandlingGroup').value === "" || element.get('shcHandlingGroup').value === null) && (element.get('apportionPercentage').value === "" || element.get('apportionPercentage').value === null) &&
          (element.get('finSysChargeCode').value === "" || element.get('finSysChargeCode').value === null) && (element.get('finSysDescription').value === "" || element.get('finSysDescription').value === null)) {
          (this.chargePostingConfigurationForm.get(["ChargePostingConfiguration", index]) as NgcFormGroup).markAsDeleted();
          this.chargePostingConfigurationForm.get(["ChargePostingConfiguration", index, 'order']).setValue(null);
        }
      })
    this.saveChargePostingConfigurationRequest = (this.chargePostingConfigurationForm.get(["ChargePostingConfiguration"]) as NgcFormArray).getRawValue();
  }
  /**
   * This method
   * assign Material Description 
   * to Material code 
   */
  assignMaterialDescription(event, index) {
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index, 'finSysDescription']).setValue(event.desc);
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index, 'salesOrganization']).setValue(event.param1);
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index, 'distributionChannel']).setValue(event.param2);
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index, 'division']).setValue(event.param3);
  }
  /**
   * This method
   *  will assign charge code
   * id to the request model
   */
  assignChargeCodeId(): any {
    if (this.saveChargePostingConfigurationRequest.length > 0) {
      this.saveChargePostingConfigurationRequest.forEach(
        cpst => {
          if (this.ChargeCodeData != null && this.ChargeCodeData.chargeCode && cpst.flagCRUD != 'T' || cpst.flagCRUD != 'D')
            cpst.billingChargeCodeId = this.ChargeCodeData.chargeCode.billingChargeCodeId;
          if (cpst.handlingArea == '')
            cpst.handlingArea = null;
          if (cpst.shcHandlingGroup == '')
            cpst.shcHandlingGroup = null;
          if (cpst.processType == '')
            cpst.processType = null;
          if (cpst.subGroupId == '')
            cpst.subGroupId = null;
        }
      )
    }
  }
  /**
   * Shifts records to  
   * a step down
   * @param item 
   * @param index 
   */
  onDownClick(item, index) {
    let value1 = this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index]).value;
    let value2 = this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index + 1]).value;
    let order1 = this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index, 'order']).value;
    let order2 = this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index + 1, 'order']).value;
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index + 1]).patchValue(value1);
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index]).patchValue(value2);
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index + 1, 'order']).patchValue(order2);
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index, 'order']).patchValue(order1);
  }
  /**
   * shifts records
   * to a step up
   * @param item 
   * @param index 
   */
  onUpClick(item, index) {
    let value1 = this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index]).value;
    let value2 = this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index - 1]).value;
    let order1 = this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index, 'order']).value;
    let order2 = this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index - 1, 'order']).value;
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index - 1]).patchValue(value1);
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index]).patchValue(value2);
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index - 1, 'order']).patchValue(order2);
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration', index, 'order']).patchValue(order1);
  }
  /**
   * Based on input
   * of handling area or shc group
   * or process type material code,material description will
   * become mandatory
   */
  markAsRequired() {
    this.chargePostingConfigurationForm.get(['ChargePostingConfiguration']).valueChanges.subscribe((value) => {
      (this.chargePostingConfigurationForm.get(['ChargePostingConfiguration']) as NgcFormArray).controls.forEach(
        (formGroup: NgcFormGroup, index: number) => {
          if (formGroup.get('handlingArea').value || formGroup.get('shcHandlingGroup').value || formGroup.get('processType').value) {
            formGroup.get('finSysChargeCode').setValidators(Validators.required);
            formGroup.get('apportionPercentage').setValidators(Validators.required);
          }
          // else {
          //   formGroup.get('finSysChargeCode').clearValidators();
          //   formGroup.get('apportionPercentage').clearValidators();
          // }
        }
      )
    }
    )
  }
  /**
   * This method
   * will navigate back to 
   * mantain charge code
   */
  onCancel() {
    this.ChargeCodeData.flagCRUD = 'U';
    this.ChargeCodeData.chargeCode = this.ChargeCodeData.chargeCode.chargeCodeName;
    this.navigateTo(this.router, '/billing/billingSetup/maintainChargeCode', this.ChargeCodeData);
  }
}
