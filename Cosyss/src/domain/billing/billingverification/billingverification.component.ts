import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcFormControl, NgcFormArray, PageConfiguration, NgcPage, NgcFormGroup,
  TrackProgress, NgcUtility, DateTimeKey, NgcReportComponent
} from 'ngc-framework';
import { Validators } from '@angular/forms';
import { BillingService } from '../billing.service';
import { BillingVerificationForSearch, BillingVerification } from '../billing.sharedmodel';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-billingverification',
  templateUrl: './billingverification.component.html',
  styleUrls: ['./billingverification.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class BillingverificationComponent extends NgcPage implements OnInit {

  responseDataArray: any;
  customerId: number;
  chargeCodeId: number;
  isLinkEnabled: boolean = true;
  billingVerficationResponse: any
  searchBillingVerificationRequest: BillingVerificationForSearch = new BillingVerificationForSearch();
  saveBillingVerificationRequest: any;
  isBillingVerification: boolean = false;
  chargeFactorId: number;
  handlingArea: any;
  showStatusDates: boolean = false;
  constructor(appZone: NgZone, appElement: ElementRef, private router: Router, private activatedRoute: ActivatedRoute,
    appContainerElement: ViewContainerRef, private billingService: BillingService) {
    super(appZone, appElement, appContainerElement);
  }

  @ViewChild('reportWindow')
  private reportWindow: NgcReportComponent;

  ngOnInit() {
    //this.enableOrDisable();
  }
  public billingVerificationForm: NgcFormGroup = new NgcFormGroup({
    searchBillingVerificationForm: new NgcFormGroup(
      {
        customerName: new NgcFormControl(),
        chargeCode: new NgcFormControl(),
        awbOrServiceNumber: new NgcFormControl(),
        transactionDateFrom: new NgcFormControl(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 1, DateTimeKey.DAYS), Validators.required),
        transactionDateTo: new NgcFormControl(
          NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 1, DateTimeKey.DAYS), (23 * 60) + 59,
            DateTimeKey.MINUTES), Validators.required),
        verified: new NgcFormControl('Not Verified'),
        status: new NgcFormControl(),
        statusDateFrom: new NgcFormControl(),
        statusDateTo: new NgcFormControl(),
        handlingArea: new NgcFormControl()
      }
    ),
    billingverification: new NgcFormArray([])
  });

  reportParam: any = new Object();

  onAwbInput() {
    let newValue: any = this.billingVerificationForm.get('searchBillingVerificationForm').get('awbOrServiceNumber').value;
    if (newValue) {
      this.billingVerificationForm.get('searchBillingVerificationForm').get('transactionDateFrom').clearValidators();
      this.billingVerificationForm.get('searchBillingVerificationForm').get('transactionDateTo').clearValidators();
    } else {
      this.billingVerificationForm.get('searchBillingVerificationForm').get('transactionDateFrom').setValidators(Validators.required);
      this.billingVerificationForm.get('searchBillingVerificationForm').get('transactionDateTo').setValidators(Validators.required);
    }
  }

  onStatusChange() {
    let newValue: any = this.billingVerificationForm.get('searchBillingVerificationForm').get('status').value;
    if (newValue && newValue != 'Pending') {
      this.billingVerificationForm.get('searchBillingVerificationForm').get('transactionDateFrom').clearValidators();
      this.billingVerificationForm.get('searchBillingVerificationForm').get('transactionDateTo').clearValidators();
      this.billingVerificationForm.get('searchBillingVerificationForm').get('statusDateFrom').setValidators(Validators.required);
      this.billingVerificationForm.get('searchBillingVerificationForm').get('statusDateTo').setValidators(Validators.required);
      this.showStatusDates = true;
    } else {
      this.billingVerificationForm.get('searchBillingVerificationForm').get('transactionDateFrom').setValidators(Validators.required);
      this.billingVerificationForm.get('searchBillingVerificationForm').get('transactionDateTo').setValidators(Validators.required);
      this.billingVerificationForm.get('searchBillingVerificationForm').get('statusDateFrom').reset();
      this.billingVerificationForm.get('searchBillingVerificationForm').get('statusDateTo').reset();
      this.billingVerificationForm.get('searchBillingVerificationForm').get('statusDateFrom').clearValidators();
      this.billingVerificationForm.get('searchBillingVerificationForm').get('statusDateTo').clearValidators();
      this.showStatusDates = false;
    }
  }

  /** 
   * This method will 
   * fetch all information
   * related to billingVerification
  */
  searchBillingVerification() {
    this.resetFormMessages();
    const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.billingVerificationForm.get('searchBillingVerificationForm'));
    // Validate

    searchFormGroup.validate();
    // If Invalid, Don't Process
    if (this.billingVerificationForm.get('searchBillingVerificationForm').invalid) {
      return;
    }
    (<NgcFormArray>this.billingVerificationForm.controls['billingverification']).resetValue([]);
    this.searchBillingVerificationRequest = (this.billingVerificationForm.get('searchBillingVerificationForm') as NgcFormGroup).getRawValue()
    if (this.chargeCodeId > 0) {
      this.searchBillingVerificationRequest.chargeCode = this.chargeCodeId;
    }
    if (this.chargeFactorId) {
      this.searchBillingVerificationRequest.chargeFactorId = this.chargeFactorId;
    }
    if (this.customerId > 0) {
      this.searchBillingVerificationRequest.customerCode = this.customerId;
    }
    this.billingService.searchBillingVerification(this.searchBillingVerificationRequest).subscribe(
      (response) => {
        this.responseDataArray = response.data;
        this.showResponseErrorMessages(response);
        if (response.data == null) {
          this.isBillingVerification = false;
          // this.refreshFormMessages(response);
        }
        else {
          if (this.responseDataArray.length > 0) {
            this.isBillingVerification = true;
            this.billingVerficationResponse = response.data;
            this.modifyResponseDate();
            this.patchValue(response);
            this.enableOrDisable();
          }
          else {
            this.isBillingVerification = false;
            this.showInfoStatus("billing.error.no.records.found")
          }
        }

      }, (error) => {
        this.isBillingVerification = false;
        this.showErrorStatus(error);
      }
    )
  }
  /** 
   * This method will
   * save information related to
   * billing verification
  */
  saveBillingVerfication() {
    this.resetFormMessages();
    this.saveBillingVerificationRequest = (this.billingVerificationForm.get(["billingverification"]) as NgcFormArray).getRawValue();
    if (this.saveBillingVerificationRequest != null && this.saveBillingVerificationRequest.length > 0) {
      this.saveBillingVerificationRequest[0].loggedInUser = this.getUserProfile().userLoginCode // to be removed later once we get loggedin user with the request
    }
    // if (this.saveBillingVerificationRequest.voidStatus == true) {
    //   this.saveBillingVerificationRequest.verificationStatus = true;
    // }
    this.saveBillingVerificationRequest.forEach(element => {
      if (element.voidStatus == true) {
        element.verificationStatus = true;
      }
    });
    this.billingService.saveBillingVerification(this.saveBillingVerificationRequest).subscribe(
      (respone) => {
        if (respone.data) {
          this.isBillingVerification = true;
          this.searchBillingVerification();
          this.showSuccessStatus("g.data.update.successful");
        }
      },
      (error) => {
        this.showErrorStatus(error);
      }
    )
  }
  /**
   * This method
   * will clear 
   * entire form data
   */
  onClear() {
    this.reloadPage();
  }

  onHandlingAreaSelect(item) {
    this.handlingArea = item.desc;
  }
  /**
   * This method
   * sets the void staus 
   * as true
   * based on payment status
   */
  modifyResponseDate() {
    this.billingVerficationResponse.forEach(element => {
      if (element.paymentStatus === "Void") {
        element.voidStatus = true;
      }
    });
  }

  /**
   * This method
   * will enable input box
   * on click of hyper link
   * @param index 
   */
  onClickOfLink(index: number) {
    const formGroup: NgcFormGroup = this.billingVerificationForm.get(['billingverification', index]) as NgcFormGroup;
    if (formGroup) {
      formGroup.get('flagUpdate').setValue('Y');
    }
  }

  /**
   * methods get cutomer id
   * from lov selection of customer
   * @param event 
   */
  getCustomerId(event) {
    this.customerId = event.param1;
  }
  /**methods get charge code
   * id from
   * lov selection
   */
  getChargeCodeId(event) {
    this.chargeCodeId = event.param1;
    this.chargeFactorId = event.param5;
  }
  /**
   * Attach events to 
   * enable or disable 
   * void status and verification check box alternatively
   */
  enableOrDisable() {
    let currIndex: number;
    (this.billingVerificationForm.get(["billingverification"]) as NgcFormArray).controls.forEach((formGroup: NgcFormGroup, index: number) => {
      if (formGroup.get('voidStatus').value) {
        //if verification status is true... Set verification status as false (we dont want both ticked)
        formGroup.get(["verificationStatus"]).setValue(false);
      }



      formGroup.get('voidStatus').
        valueChanges.subscribe((value: any) => {
          if (value) {
            formGroup.get(["verificationStatus"]).setValue(false);
            console.log(formGroup.get(["verificationStatus"]).value + " <-- verification status before ")

          }

        });

      formGroup.get('verificationStatus').
        valueChanges.subscribe((value: any) => {
          //  currIndex = index;
          if (value) {
            formGroup.get(["voidStatus"]).setValue(false);
          }


        });
    });
  }

  /**
   * disable void
   * check box based on payment status
   */
  disableVoid() {
    (this.billingVerificationForm.get(["billingverification"]) as NgcFormArray).controls.forEach((formGroup: NgcFormGroup, index: number) => {
      let status = formGroup.get('paymentStatus').value;
      if (status === "Pending" || status === "Posted" || status === "Invoiced") {
        formGroup.get(["voidStatus"]).disable({
          onlySelf: true,
          emitEvent: true
        });
      }
    });
  }


  onGenerateReport() {

    this.searchBillingVerificationRequest = (this.billingVerificationForm.get('searchBillingVerificationForm') as NgcFormGroup).getRawValue()


    let formValue = this.searchBillingVerificationRequest;

    if (formValue.transactionDateTo < formValue.transactionDateFrom) {
      this.showErrorStatus('billing.error.transaction');
    } else {
      this.reportParam.transactionDateFrom = formValue.transactionDateFrom;
      this.reportParam.transactionDateTo = formValue.transactionDateTo;


      if (this.chargeCodeId) {
        this.reportParam.chargeCode = this.chargeCodeId;
      } else {
        this.reportParam.chargeCode = null;
      }
      if (this.chargeFactorId) {
        this.reportParam.chargeFactorId = this.chargeFactorId;
      } else {
        this.reportParam.chargeFactorId = null;
      }
      if (this.customerId) {
        this.reportParam.customerCode = this.customerId;
      } else {
        this.reportParam.customerCode = null;
      }
      this.reportParam.awbOrServiceNumber = formValue.awbOrServiceNumber;
      this.reportParam.status = formValue.status;
      this.reportParam.statusDateFrom = formValue.statusDateFrom;
      this.reportParam.statusDateTo = formValue.statusDateTo;
      //this.reportParam.VerficationStatus = formValue.verified == 'Verified' ? '1' : '0';
      if (formValue.verified != null) {
        this.reportParam.verificationStatus = formValue.verified == 'Not Verified' ? '0' : '1';
      } else {
        this.reportParam.verificationStatus = null;
      }
      if (this.handlingArea) {
        this.reportParam.handlingArea = this.handlingArea;
      }
      else {
        this.reportParam.handlingArea = null;
      }
      // alert(JSON.stringify(this.reportParam))
      this.reportWindow.downloadReport();
    }
  }

  navigateToShipment(index: number) {
    const formGroup: NgcFormGroup = this.billingVerificationForm.get(['billingverification', index]) as NgcFormGroup;
    if (formGroup) {
      this.navigateToWindow('/awbmgmt/shipmentinfo', formGroup.get('awbOrServiceNumber').value);
    }
  }
  @TrackProgress()
  patchValue(response) {
    this.billingVerificationForm.get('billingverification').patchValue(response.data);
  }
  backToHome(event) {
    this.router.navigate(['']);
  }
}