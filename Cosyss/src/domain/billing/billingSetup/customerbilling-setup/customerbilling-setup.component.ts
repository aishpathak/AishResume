import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormControl, ReactiveModel, NgcDropDownComponent, NgcDropDownListComponent, NgcUtility, NgcWindowComponent } from 'ngc-framework';
import { BuildupService } from '../../../export/buildup/buildup.service';
import { NgcFormArray, DateTimeKey } from 'ngc-framework';
import { CustomerBillingInfoForSearch, CustomerBillingSetupInfo, CountryModel, CustomerPaymentAccount, TopupPaymentAccount } from '../../billing.sharedmodel';
import { BillingService } from '../../billing.service';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApplicationFeatures } from '../../../common/applicationfeatures';
import { count } from 'console';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { CustomerInfo } from '../../../import/import.shared';

@Component({
  selector: 'app-customerbilling-setup',
  templateUrl: './customerbilling-setup.component.html',
  styleUrls: ['./customerbilling-setup.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  // autoBackNavigation: true
})
export class CustomerbillingSetupComponent extends NgcPage {

  checkForEmail: number = 0;
  customerBillingInfoForSearch = new CustomerBillingInfoForSearch();
  customerBillingInfoForSave = new CustomerBillingSetupInfo();
  paymentList: any = new Array();
  showPaymentMode: boolean = false;
  showNumericInputForCheque: boolean = false;
  showRequired: boolean = false;
  event = new CountryModel();
  isCredit: boolean = false;
  displayPaymentAccount: boolean = NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_CustomerPaymentAccount);
  isCustomer: boolean = false;
  isEmailEntered = true;
  isDuplicateEmail: boolean = false;
  request: any;
  filteredRequest: any;
  isMinDate: any;
  minNextApDate: any;
  isBlackListed: boolean = true;
  isFocusedOnSearch: boolean = true;
  paymentOption: any = ['CASH CARD', 'CHEQUE', 'CREDIT CARD', 'MCO', 'MCO PARTIAL', 'NETS'];
  sdCycles: any = new Array();
  apCycles: any = new Array();
  sdCycleSelected: any = 1;
  apCycleSelected: any = 1;
  removedApCycleList: any = [];
  removedSdCycleList: any = [];


  @ViewChild("focusPaymentType")
  private focusPaymentType: NgcDropDownListComponent;
  @ViewChild("sdCycleDropdown")
  private sdCycleDropdown: NgcDropDownListComponent;
  @ViewChild("apCycleDropdown")
  private apCycleDropdown: NgcDropDownListComponent;
  @ViewChild('addPaymentAccountWindow') addPaymentAccountWindow: NgcWindowComponent;
  showPaymentAccountNumber: boolean = true;
  @ViewChild('topupPaymentAccountWindow') topupPaymentAccountWindow: NgcWindowComponent;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private billingService: BillingService, private activatedRoute: ActivatedRoute, private route: ActivatedRoute,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }
  @ReactiveModel(CustomerBillingSetupInfo)
  public customerBillingSetupForm: NgcFormGroup;

  @ReactiveModel(CustomerPaymentAccount)
  public customerPaymentAccountForm: NgcFormGroup;

  @ReactiveModel(TopupPaymentAccount)
  public topupPaymentAccountForm: NgcFormGroup;
  ngOnInit() {
    this.onAddRowNotification();
    this.updateForPaymentMode();
    this.blackListServicesEnableOrDisable();

    this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'cityCode']).setValue(NgcUtility.getTenantConfiguration().cityCode);
    const forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {

      this.customerBillingSetupForm.get(['searchCustomerBillingInfo', 'customerName']).patchValue(forwardedData.companyName);
      this.customerBillingSetupForm.get(['searchCustomerBillingInfo', 'customerCode']).patchValue(forwardedData.companyCode);
      if (forwardedData.salesTaxNumber != null) {
        this.customerBillingSetupForm.get(['searchCustomerBillingInfo', 'salesTaxNumber']).patchValue(forwardedData.salesTaxNumber);
      }
      if (forwardedData.salesTaxApplicability != null) {
        this.customerBillingSetupForm.get(['searchCustomerBillingInfo', 'salesTaxApplicability']).patchValue(forwardedData.salesTaxApplicability);
      }
      if (forwardedData.paymentAccountList != undefined) {
        if (forwardedData.paymentAccountList.length === 0) {
          this.customerBillingSetupForm.get('customerBillingInfo').get('paymentAccountList').patchValue('');

        }
        else {
          this.customerBillingSetupForm.get('customerBillingInfo').get('paymentAccountList').patchValue(forwardedData.paymentAccountList)

        }
      }

      this.customerBillingInfoForSearch = new CustomerBillingInfoForSearch();
      this.customerBillingInfoForSearch.customerId = forwardedData.customerId;
      this.searchCustomerBillingSetupInfo();

    }
    this.customerBillingSetupForm.get('customerBillingInfo').get('sdBillingCycle').valueChanges.subscribe(value => {
      if (value) {
        let billGenValue: any = this.customerBillingSetupForm.get('customerBillingInfo').get(['sdCycleList', this.sdCycleSelected - 1, 'billGenerationDay']);
        let postValue: any = this.customerBillingSetupForm.get('customerBillingInfo').get(['sdCycleList', this.sdCycleSelected - 1, 'postingDay']);
        (<NgcFormControl>billGenValue).validate();
        (<NgcFormControl>postValue).validate();
        if (billGenValue.invalid || postValue.invalid || !billGenValue.value || !postValue.value) {
          if (value != this.sdCycleSelected)
            this.customerBillingSetupForm.get('customerBillingInfo').get('sdBillingCycle').setValue(this.sdCycleSelected, { onlySelf: true, emitEvent: false });
        } else {
          this.sdCycleSelected = value;
          this.customerBillingSetupForm.get('customerBillingInfo').get(['sdCycleList', value - 1, 'billGenerationDay']).setValidators(Validators.required);
          this.customerBillingSetupForm.get('customerBillingInfo').get(['sdCycleList', value - 1, 'postingDay']).setValidators(Validators.required);
        }
      }
    })

    this.customerBillingSetupForm.get('customerBillingInfo').get('apBillingCycle').valueChanges.subscribe(value => {
      if (value) {
        let billGenValue: any = this.customerBillingSetupForm.get('customerBillingInfo').get(['apCycleList', this.apCycleSelected - 1, 'billGenerationDay']);
        let postValue: any = this.customerBillingSetupForm.get('customerBillingInfo').get(['apCycleList', this.apCycleSelected - 1, 'postingDay']);
        (<NgcFormControl>billGenValue).validate();
        (<NgcFormControl>postValue).validate();
        if (billGenValue.invalid || postValue.invalid || !billGenValue.value || !postValue.value) {
          if (value != this.apCycleSelected)
            this.customerBillingSetupForm.get('customerBillingInfo').get('apBillingCycle').setValue(this.apCycleSelected, { onlySelf: true, emitEvent: false });
        } else {
          this.apCycleSelected = value;
          this.customerBillingSetupForm.get('customerBillingInfo').get(['apCycleList', value - 1, 'billGenerationDay']).setValidators(Validators.required);
          this.customerBillingSetupForm.get('customerBillingInfo').get(['apCycleList', value - 1, 'postingDay']).setValidators(Validators.required);
        }
      }
    })
  }


  getCustomerId(event) {
    this.customerBillingInfoForSearch = new CustomerBillingInfoForSearch();
    this.customerBillingInfoForSearch.customerId = event.param1;
    this.customerBillingSetupForm.get(['searchCustomerBillingInfo', 'customerCode']).setValue(event.code);

  }

  getCustomerIdByCode(event) {
    this.customerBillingInfoForSearch = new CustomerBillingInfoForSearch();
    this.customerBillingInfoForSearch.customerId = event.param1;
    this.customerBillingSetupForm.get(['searchCustomerBillingInfo', 'customerName']).setValue(event.desc);

  }

  /**search method that fecthes 
   * customer 
   * billing info */
  searchCustomerBillingSetupInfo() {
    this.sdCycles = new Array();
    this.apCycles = new Array();
    (<NgcFormArray>this.customerBillingSetupForm.controls['customerBillingNotification']).resetValue([]);
    (<NgcFormArray>this.customerBillingSetupForm.controls['customerExceptionConfigurations']).resetValue([]);
    this.resetFormMessages();
    const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.customerBillingSetupForm.get('searchCustomerBillingInfo'));
    // Validate
    searchFormGroup.validate();
    // If Invalid, Don't Process
    if (this.customerBillingSetupForm.get('searchCustomerBillingInfo').invalid) {
      return;
    }
    let paymentOption: Array<any> = new Array<any>();
    this.billingService.searchCustomerBillingSetup(this.customerBillingInfoForSearch).subscribe(
      response => {
        if (response.data != null) {
          if (response.data.customerBillingNotification == null) {
            (<NgcFormArray>this.customerBillingSetupForm.controls['customerBillingNotification']).reset();
          }
          if (response.data.customerBillingInfo == null) {
            this.showErrorStatus('billing.error.customername');
            this.isCustomer = false;
          }
          else {
            this.removedSdCycleList = [];
            this.removedApCycleList = [];
            this.isCustomer = true;
            //
            if (response.data.customerBillingInfo != null) {
              if (response.data.customerBillingInfo.nextBillingDate == null) {
              }
              else {
              }
              if (response.data.customerBillingInfo.apNextBillingDate == null) {
                this.minNextApDate = new Date();
                this.minNextApDate.setDate(this.minNextApDate.getDate());
              }
              else {
                this.minNextApDate = new Date();
              }
              if (response.data.customerBillingInfo.paymentType == 'Collect') {
                this.isCredit = true;
              } else {
                this.isCredit = false;
              }
            }
            this.customerBillingSetupForm.patchValue(response.data);
            response.data.customerBillingInfo.sdCycleList.forEach(value => {
              this.sdCycles.push(value.cycleCount.toString());
            });
            response.data.customerBillingInfo.apCycleList.forEach(value => {
              this.apCycles.push(value.cycleCount.toString());
            });
            response.data.customerExceptionConfigurations.forEach((value, index) => {
              if (value.changedPaymentType == 'BBAB' || value.changedPaymentType == 'BBAC') {
                this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'carrierCode']).setValidators(Validators.required);
              } else {
                this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'carrierCode']).clearValidators();
              }
            });
            this.updateForPaymentMode();
            if (response.data.customerBillingPaymentOptions != null) {
              response.data.customerBillingPaymentOptions.forEach(
                payment => {
                  paymentOption.push(payment.type)
                }
              );
            }
            this.customerBillingSetupForm.get(['customerBillingInfo', 'paymentOptions']).patchValue(paymentOption);
            if (!response.data.customerBillingNotification || response.data.customerBillingNotification.length == 0) {
              this.onAddRowNotification();
            }
            // if (!response.data.customerExceptionConfigurations || response.data.customerExceptionConfigurations.length == 0) {
            //   this.addCustomerExceptionConfiguration();
            // }
          }
          if (this.sdCycles.length) {
            this.sdCycleSelected = '1';
            this.customerBillingSetupForm.get('customerBillingInfo').get('sdBillingCycle').patchValue(this.sdCycleSelected);
          }
          if (this.apCycles.length) {
            this.apCycleSelected = '1';
            this.customerBillingSetupForm.get('customerBillingInfo').get('apBillingCycle').patchValue(this.apCycleSelected);
          }
          if (this.sdCycleDropdown) {
            this.sdCycleDropdown.source = this.sdCycles;
          }
          if (this.apCycleDropdown) {
            this.apCycleDropdown.source = this.apCycles;
          }
        }
        this.isFocusedOnSearch = false;
      },
      error => {
        this.showErrorStatus(error);
      }
    )
    this.makerequired();
  }
  /**
   * Add's an empty 
   * record for email array
   */
  onAddRowNotification() {
    (<NgcFormArray>this.customerBillingSetupForm.get(["customerBillingNotification"])).addValue([
      {
        email: "",
        startDate: "",
        endDate: ""
      }
    ]);
    this.isMinDate = new Date();
    this.isMinDate.setDate(this.isMinDate.getDate());
  }
  /**
   * save method that
   * saves customer setup billing information
   */
  onSave() {
    const saveFormGroup: NgcFormGroup = (<NgcFormGroup>this.customerBillingSetupForm);
    this.request = this.customerBillingSetupForm.getRawValue();
    //this.resetFormMessages();
    //Validate
    saveFormGroup.validate();
    //If Invalid, Don't Process
    // if (this.customerBillingSetupForm.invalid) {
    //   return;
    // }
    // else {
    this.removeEmptyRecords();
    this.request = this.customerBillingSetupForm.getRawValue();
    this.refreshSDCycleDropdown();
    this.refreshAPCycleDropdown();
    let errorFlag: boolean = false;
    if (this.request.customerBillingInfo.nextBillingDate > this.request.customerBillingInfo.nextSDPostingDate) {
      this.showFormControlErrorMessage(<NgcFormControl>this.customerBillingSetupForm.get('customerBillingInfo').get('nextBillingDate'), 'billing.date.should.be.before.posting.date');
      errorFlag = true;
    }
    if (this.request.customerBillingInfo.apNextBillingDate > this.request.customerBillingInfo.nextAPPostingDate) {
      this.showFormControlErrorMessage(<NgcFormControl>this.customerBillingSetupForm.get('customerBillingInfo').get('apNextBillingDate'), 'billing.date.should.be.before.posting.date');
      errorFlag = true;
    }
    if (errorFlag) {
      return;
    }
    if (this.removedSdCycleList && this.removedSdCycleList.length > 0) {
      this.removedSdCycleList.forEach(element => {
        element.flagCRUD = 'D';
        this.request.customerBillingInfo.sdCycleList.push(element);
      });
    }
    if (this.removedApCycleList && this.removedApCycleList.length > 0) {
      this.removedApCycleList.forEach(element => {
        element.flagCRUD = 'D';
        this.request.customerBillingInfo.apCycleList.push(element);
      });
    }
    this.billingService.saveCustomerBillingSetup(this.request).subscribe(
      response => {
        /**  checks for any error messages from response object */
        if (this.showResponseErrorMessages(response, null)) {
        }
        else if (response.messageList! = null && response.messageList[0].code == "billing.salestaxnumberexists") {
          return this.showErrorStatus(NgcUtility.translateMessage("billing.salestaxnumberexists", [response.messageList[0].referenceId, response.messageList[0].message]));
        }
        else if (response.data != null) {
          this.removedSdCycleList = [];
          this.removedApCycleList = [];
          if (response.data.customerBillingInfo.flagCRUD == "U") {
            this.showSuccessStatus("g.data.update.successful");
            this.searchCustomerBillingSetupInfo();
          }
          else {
            this.showSuccessStatus("billing.sucess.data.creation");
            this.searchCustomerBillingSetupInfo();
          }
        }

      },
      (error) => {
        this.showErrorStatus(error)
      }
    )
    // }
  }

  refreshSDCycleDropdown() {
    let request: any = this.customerBillingSetupForm.getRawValue();
    let sdIndex: any = 1;
    this.sdCycles = new Array();
    request.customerBillingInfo.sdCycleList.forEach(value => {
      if (value.flagCRUD != 'D') {
        value.cycleCount = sdIndex++;
        this.sdCycles.push((this.sdCycles.length + 1).toString());
      }
    })
    if (this.sdCycleDropdown) {
      this.sdCycleDropdown.source = this.sdCycles;
    }
  }

  refreshAPCycleDropdown() {
    let request: any = this.customerBillingSetupForm.getRawValue();
    let apIndex: any = 1;
    this.apCycles = new Array();
    request.customerBillingInfo.apCycleList.forEach(value => {
      if (value.flagCRUD != 'D') {
        value.cycleCount = apIndex++;
        this.apCycles.push((this.apCycles.length + 1).toString());
      }
    })
    if (this.apCycleDropdown) {
      this.apCycleDropdown.source = this.apCycles;
    }
  }

  /**This method
   * Deletes email row 
   */
  onDeleteEmail(index) {
    (this.customerBillingSetupForm.get(["customerBillingNotification", index]) as NgcFormGroup).markAsDeleted();
    this.checkForEmail = this.checkForEmail + 1;
    this.isEmailEntered = true;
  }
  /**
   * This method will enable or disable 
   * some properties in the form based on 
   * payment type
   */
  updateForPaymentMode() {
    let value: any = this.customerBillingSetupForm.controls.customerBillingInfo.get('paymentType').value;

    if (value === "Credit") {
      this.isCredit = false;

      this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'streetAddress']).setValidators(Validators.required);
      this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'place']).setValidators(Validators.required);
      this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'cityCode']).setValidators(Validators.required);
      this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'countryCode']).setValidators(Validators.required);
      this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'postalCode']).setValidators(Validators.required);
    }
    if (value === "Collect") {
      this.isCredit = true;
      this.customerBillingSetupForm.get(['customerBillingInfo', 'sendESupportDocument']).setValue(false);
      this.customerBillingSetupForm.get(['customerBillingInfo', 'paymentOptions']).patchValue(this.paymentOption);
      this.customerBillingSetupForm.get(['customerBillingInfo', 'paymentOptions']).setValidators(Validators.required);
      if (this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'streetAddress']).value == null || this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'streetAddress']).value == "") {
        this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'streetAddress']).setValue(null);
      }
      this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'streetAddress']).setValidators(null);
      if (this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'place']).value == null || this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'place']).value == "") {
        this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'place']).setValue(null);
      }
      this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'place']).setValidators(null);
      if (this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'cityCode']).value == null || this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'cityCode']).value == "") {
        this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'cityCode']).setValue(null);
      }
      this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'cityCode']).setValidators(null);
      if (this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'countryCode']).value == null || this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'countryCode']).value == "") {
        this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'countryCode']).setValue(null);
      }
      this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'countryCode']).setValidators(null);
      if (this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'stateCode']).value == null || this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'stateCode']).value == "") {
        this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'stateCode']).setValue(null);
      }
      this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'stateCode']).setValidators(null);
      if (this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'postalCode']).value == null || this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'postalCode']).value == "") {
        this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'postalCode']).setValue(null);
      }
      this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'postalCode']).setValidators(null);
    }
  }
  /**
   * This field will make 
   * start date as required
   * if email is entered
   */
  makerequired() {
    this.customerBillingSetupForm.get(["customerBillingNotification"]).valueChanges.subscribe((value) => {
      (this.customerBillingSetupForm.get(["customerBillingNotification"]) as NgcFormArray).controls.forEach((formGroup: NgcFormGroup, index: number) => {
        if (formGroup.get('email').value) {
          formGroup.get(["startDate"]).setValidators(Validators.required);
        } else {
          formGroup.get(["startDate"]).clearValidators();
        }
      });
    });
  }
  /**
   * Removes empty
   * record 
   * from notifications array
   */
  removeEmptyRecords() {
    (this.customerBillingSetupForm.get(["customerBillingNotification"]) as NgcFormArray).controls.forEach(
      (element: any, index: any) => {
        if (element.get('startDate').value === null && element.get('email').value === "" || element.get('email').value === null) {
          (this.customerBillingSetupForm.get(["customerBillingNotification", index]) as NgcFormGroup).markAsDeleted();
        }
      })
  }
  /** 
   *Add's an empty record  of
   CustomerExceptionConfiguration array
  */
  addCustomerExceptionConfiguration() {
    (this.customerBillingSetupForm.get(['customerExceptionConfigurations']) as NgcFormArray).addValue([
      {
        chargeCodeDescription: "",
        paymentType: "",
        billingChargeCodeId: 0,
        changedPaymentType: "",
        billByAirline: false,
        carrierCode: null
      }
    ])
    let index = (this.customerBillingSetupForm.get(['customerExceptionConfigurations']) as NgcFormArray).length - 1;
    this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'chargeCodeDescription']).setValidators(Validators.required);
  }
  /**
   *Assigns payment type
    based on charge code
   * @param event 
   * @param index 
   */
  assignPaymentType(event, index) {
    if (this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'flagCRUD']).value === 'C') {
      this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'paymentType']).setValue(event.param2);
      this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'billingChargeCodeId']).setValue(event.param1)
      if (event.param2 === 'BIL') {
        this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'changedPaymentType']).setValue('COL');
      }
      if (event.param2 === 'CWE') {
        this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'changedPaymentType']).setValue('BIL');
      }
      if (event.param2 === 'COL') {
        this.showFormControlErrorMessage((this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'chargeCodeDescription']) as NgcFormControl), 'BILL_CUSTOMER_EXCEPTION_CONFIGURATION');
        this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'changedPaymentType']).setValue(null);
      }
      if (event.param2 == null || event.param2 == "") {
        this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'changedPaymentType']).setValue(null);
      }
    }
    if (event.param3 === '1') {
      this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'billByAirline']).patchValue(1);
    }
  }
  /**
   * soft delete
   * of CustomerExceptionConfiguration
   * records
   * @param index 
   */
  deleteCustomerExceptionConfiguration(index) {
    (this.customerBillingSetupForm.get(['customerExceptionConfigurations', index]) as NgcFormGroup).markAsDeleted();
  }

  /**
   * on select of
   * city country will be 
   * auto populated
   */
  onSelectCity(event) {
    this.customerBillingSetupForm.get(['customerBillingInfo', 'customerBillingAddress', 'countryCode']).setValue(event.parameter1);
  }

  /** 
   * Enables or disable 
   * accept and deliver cargo services
  */
  blackListServicesEnableOrDisable() {
    this.customerBillingSetupForm.get(['customerBillingInfo', 'blackListed']).valueChanges.subscribe((value) => {
      if (value) {
        this.isBlackListed = false;
      }
      else {
        this.customerBillingSetupForm.get(['customerBillingInfo', 'acceptCargo']).setValue(null);
        this.customerBillingSetupForm.get(['customerBillingInfo', 'deliverCargo']).setValue(null);
        this.isBlackListed = true;
      }
    })
  }

  protected afterFocus() {
    if (this.focusPaymentType && !this.isFocusedOnSearch) {
      setTimeout(() => {
        this.focusPaymentType.focus();
      }, 0);
      this.isFocusedOnSearch = true;
    }
  }

  selectNoCollect(item, index) {
    let value: any = this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'changedPaymentType']).value;
    if (value == 'BBAB' || value == 'BBAC') {
      this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'carrierCode']).setValidators(Validators.required);
    } else {
      this.customerBillingSetupForm.get(['customerExceptionConfigurations', index, 'carrierCode']).clearValidators();
    }
  }

  onAddSDCycle() {
    let formControl: any = this.customerBillingSetupForm.get('customerBillingInfo').get(['sdCycleList', this.sdCycles.length - 1]);
    if (formControl)
      formControl.validate();
    if ((formControl && formControl.valid) || !formControl) {
      (<NgcFormArray>this.customerBillingSetupForm.get('customerBillingInfo').get('sdCycleList')).addValue([
        {
          customerInfoId: this.customerBillingSetupForm.get('customerBillingInfo').get('customerInfoId').value,
          cycleCount: this.sdCycles.length + 1,
          billGenerationDay: null,
          postingDay: null,
          postingType: 'SD'
        }
      ])
      this.refreshSDCycleDropdown();
      this.customerBillingSetupForm.get('customerBillingInfo').get('sdBillingCycle').patchValue(this.sdCycles.length);
      this.customerBillingSetupForm.get('customerBillingInfo').get(['sdCycleList', this.sdCycles.length - 1, 'billGenerationDay']).setValidators(Validators.required);
      this.customerBillingSetupForm.get('customerBillingInfo').get(['sdCycleList', this.sdCycles.length - 1, 'postingDay']).setValidators(Validators.required);
    }
  }

  onDeleteSDCycle() {
    let deleteIndex: any = this.customerBillingSetupForm.get('customerBillingInfo').get('sdBillingCycle').value - 1;
    let sd: any = this.customerBillingSetupForm.get('customerBillingInfo').get('sdBillingCycle').value;
    this.showSuccessStatus('SD Cycle' + " " + sd + " " + "is deleted");
    this.removedSdCycleList.push(this.customerBillingSetupForm.getRawValue().customerBillingInfo.sdCycleList[deleteIndex]);

    (<NgcFormArray>this.customerBillingSetupForm.get('customerBillingInfo').get(['sdCycleList'])).removeAt(deleteIndex);
    this.refreshSDCycleDropdown();
    if (deleteIndex > 0)
      this.customerBillingSetupForm.get('customerBillingInfo').get('sdBillingCycle').patchValue(this.sdCycles[deleteIndex - 1]);
    else {
      this.customerBillingSetupForm.get('customerBillingInfo').get('sdBillingCycle').patchValue(this.sdCycles[deleteIndex]);
    }


    let cycleInfo: any = (<NgcFormArray>this.customerBillingSetupForm.get('customerBillingInfo').get('sdCycleList')).length;

    for (let i = 1; i <= cycleInfo; i++) {
      this.customerBillingSetupForm.get(['customerBillingInfo', 'sdCycleList', i - 1, 'cycleCount']).patchValue(i);
    }
  }

  onAddAPCycle() {
    let formControl: any = this.customerBillingSetupForm.get('customerBillingInfo').get(['apCycleList', this.apCycles.length - 1]);
    if (formControl)
      formControl.validate();
    if ((formControl && formControl.valid) || !formControl) {
      (<NgcFormArray>this.customerBillingSetupForm.get('customerBillingInfo').get('apCycleList')).addValue([
        {
          customerInfoId: this.customerBillingSetupForm.get('customerBillingInfo').get('customerInfoId').value,
          cycleCount: this.apCycles.length + 1,
          billGenerationDay: null,
          postingDay: null,
          postingType: 'AP'
        }
      ])
      this.refreshAPCycleDropdown();
      this.customerBillingSetupForm.get('customerBillingInfo').get('apBillingCycle').patchValue(this.apCycles.length);
      this.customerBillingSetupForm.get('customerBillingInfo').get(['apCycleList', this.apCycles.length - 1, 'billGenerationDay']).setValidators(Validators.required);
      this.customerBillingSetupForm.get('customerBillingInfo').get(['apCycleList', this.apCycles.length - 1, 'postingDay']).setValidators(Validators.required);
    }
  }

  onDeleteAPCycle() {
    let deleteIndex: any = this.customerBillingSetupForm.get('customerBillingInfo').get('apBillingCycle').value - 1;
    let ap: any = this.customerBillingSetupForm.get('customerBillingInfo').get('apBillingCycle').value;
    this.showSuccessStatus('AP Cycle' + " " + ap + " " + "is deleted");
    this.removedApCycleList.push(this.customerBillingSetupForm.getRawValue().customerBillingInfo.apCycleList[deleteIndex]);

    (<NgcFormArray>this.customerBillingSetupForm.get('customerBillingInfo').get(['apCycleList'])).removeAt(deleteIndex);
    this.refreshAPCycleDropdown();
    if (deleteIndex > 0)
      this.customerBillingSetupForm.get('customerBillingInfo').get('apBillingCycle').patchValue(this.apCycles[deleteIndex - 1]);
    else {
      this.customerBillingSetupForm.get('customerBillingInfo').get('apBillingCycle').patchValue(this.apCycles[deleteIndex]);
    }


    let cycleInfo: any = (<NgcFormArray>this.customerBillingSetupForm.get('customerBillingInfo').get('apCycleList')).length;

    for (let i = 1; i <= cycleInfo; i++) {
      this.customerBillingSetupForm.get(['customerBillingInfo', 'apCycleList', i - 1, 'cycleCount']).patchValue(i);
    }
  }

  onOpenNewPaymentAccountWindow(index) {
    this.customerPaymentAccountForm.reset();
    this.showPaymentAccountNumber = true;
    if (index != undefined) {
      this.customerPaymentAccountForm.patchValue(((<NgcFormArray>this.customerBillingSetupForm.get('customerBillingInfo').get('paymentAccountList')).getRawValue())[index]);
      this.showPaymentAccountNumber = false;
    }
    this.addPaymentAccountWindow.open();
  }

  onSavePaymentAccount(event) {
    this.customerPaymentAccountForm.validate();
    if (!this.customerPaymentAccountForm.valid) {
      return;
    }
    else {
      let request: CustomerPaymentAccount = this.customerPaymentAccountForm.getRawValue();
      request.customerId = this.customerBillingSetupForm.get('customerBillingInfo').get('customerMasterId').value;
      request.customerInfoId = this.customerBillingSetupForm.get('customerBillingInfo').get('customerInfoId').value;

      this.billingService.saveCustomerPaymentAccount(request).subscribe(response => {
        this.resetFormMessages();
        if (response !== null) {
          if (!this.showResponseErrorMessages(response)) {
            this.customerBillingSetupForm.get('customerBillingInfo').get('paymentAccountList').patchValue(response.data);
            this.addPaymentAccountWindow.close();
            this.showSuccessStatus('g.completed.successfully');
            this.customerPaymentAccountForm.reset();
          }
        }
      })

    }
  }

  onDeletePaymentAccount(index) {
    this.showConfirmMessage('billing.customerpaymentaccount.deleteconfirm').then(fulfilled => {
      let request: CustomerPaymentAccount = (((<NgcFormArray>this.customerBillingSetupForm.get('customerBillingInfo').get("paymentAccountList")).getRawValue())[index]);
      request.customerId = this.customerBillingSetupForm.get('customerBillingInfo').get('customerMasterId').value;
      request.customerInfoId = this.customerBillingSetupForm.get('customerBillingInfo').get('customerInfoId').value;
      this.billingService.deleteCustomerPaymentAccount(request).subscribe(response => {
        this.resetFormMessages();
        if (response !== null) {
          if (!this.showResponseErrorMessages(response)) {
            this.customerBillingSetupForm.get('customerBillingInfo').get('paymentAccountList').patchValue(response.data);
            this.showSuccessStatus('g.completed.successfully');
          }
        }
      })
    }).catch(reason => {
    });
  }

  onOpenTopupPaymentAccountWindow(index) {
    const customerPaymentAccount: CustomerPaymentAccount = ((<NgcFormArray>this.customerBillingSetupForm.get('customerBillingInfo').get('paymentAccountList')).getRawValue())[index];
    this.topupPaymentAccountForm.reset();
    this.topupPaymentAccountForm.get('dateOrTime').patchValue(NgcUtility.addDate(new Date(), 0, DateTimeKey.HOURS));
    this.showPaymentMode = false;
    this.showRequired = false;
    this.topupPaymentAccountForm.get('referenceNumber').setValidators([Validators.maxLength(100)]);
    this.topupPaymentAccountForm.get('chequeDate').clearValidators();
    this.topupPaymentAccountForm.get('bankName').clearValidators();
    this.topupPaymentAccountForm.get('paymentMode').clearValidators();

    this.topupPaymentAccountForm.updateValueAndValidity();

    this.topupPaymentAccountForm.get('paymentAccountId').setValue(customerPaymentAccount.paymentAccountId);
    this.topupPaymentAccountForm.get('customerId').setValue(this.customerBillingSetupForm.get('customerBillingInfo').get('customerMasterId').value);
    this.topupPaymentAccountForm.get('customerInfoId').setValue(this.customerBillingSetupForm.get('customerBillingInfo').get('customerInfoId').value);
    this.topupPaymentAccountForm.get('paymentAccountNumber').setValue(customerPaymentAccount.paymentAccountNumber);
    this.topupPaymentAccountForm.get('paymentAccountBalance').setValue(customerPaymentAccount.paymentAccountBalance);
    this.topupPaymentAccountForm.get('chargeCategoriesDesc').setValue(customerPaymentAccount.chargeCategoriesDesc);
    this.topupPaymentAccountWindow.open();
  }

  onSaveTopupPaymentAccount(event) {
    this.topupPaymentAccountForm.validate();
    if (!this.topupPaymentAccountForm.valid) {
      return;
    }
    else {
      const request: TopupPaymentAccount = this.topupPaymentAccountForm.getRawValue();
      this.billingService.topupPaymentAccount(request).subscribe(response => {
        this.resetFormMessages();
        if (response !== null) {
          if (!this.showResponseErrorMessages(response)) {
            this.customerBillingSetupForm.get('customerBillingInfo').get('paymentAccountList').patchValue(response.data);
            this.topupPaymentAccountWindow.close();
            this.showSuccessStatus('g.completed.successfully');
            this.topupPaymentAccountForm.reset();

          }
        }
      })

    }
  }

  backToHome(event) {
    this.navigateBack((<NgcFormGroup>this.customerBillingSetupForm.get('customerBillingInfo')).getRawValue());
  }

  onSelectCDType = event => {
    if (this.topupPaymentAccountForm.get('creditOrDebitType').value == 'TopUp') {
      this.topupPaymentAccountForm.get('paymentMode').setValidators([Validators.required]);
      this.topupPaymentAccountForm.get('referenceNumber').setValidators([Validators.maxLength(100)]);
      this.topupPaymentAccountForm.get('chequeDate').clearValidators();
      this.topupPaymentAccountForm.get('bankName').clearValidators();
      this.clearValues();
      this.showPaymentMode = true;
      this.showRequired = false;
    }
    else {
      this.topupPaymentAccountForm.get('paymentMode').clearValidators();
      this.topupPaymentAccountForm.get('paymentMode').setValue(null);
      this.topupPaymentAccountForm.get('referenceNumber').setValidators([Validators.maxLength(100)]);
      this.topupPaymentAccountForm.get('chequeDate').clearValidators();
      this.topupPaymentAccountForm.get('bankName').clearValidators();
      this.clearValues();
      this.showPaymentMode = false;
    }

  }

  onSelectPM = event => {
    if (this.topupPaymentAccountForm.get('paymentMode').value == 'CHQ_DD') {
      this.showRequired = true;
      this.topupPaymentAccountForm.get('referenceNumber').setValidators([Validators.maxLength(100)]);
      this.topupPaymentAccountForm.get('chequeDate').setValidators([Validators.required]);
      this.topupPaymentAccountForm.get('bankName').setValidators([Validators.required]);
      this.clearValues();
      this.showNumericInputForCheque = true;
    } else {
      this.topupPaymentAccountForm.get('referenceNumber').setValidators([Validators.maxLength(100)]);
      this.topupPaymentAccountForm.get('chequeDate').clearValidators();
      this.topupPaymentAccountForm.get('bankName').clearValidators();
      this.clearValues();
      this.showRequired = false;
      this.showNumericInputForCheque = false;
    }
  }

  clearValues() {
    this.topupPaymentAccountForm.get('referenceNumber').setValue(null);
    this.topupPaymentAccountForm.get('bankName').setValue(null);
    this.topupPaymentAccountForm.get('chequeDate').setValue(null);
    this.topupPaymentAccountForm.get('amount').setValue(null);
    this.topupPaymentAccountForm.get('remarks').setValue(null);
  }
}


