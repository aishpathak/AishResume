import { Component, ViewContainerRef } from '@angular/core';
import { NgcFormGroup, NgcPage, NgcFormControl, NgcFormArray, NgcUtility, NgcReportComponent, PageConfiguration, NgcWindowComponent } from 'ngc-framework';
import { CounterClosureVerificationForSearch } from '../billing.sharedmodel';
import { NgZone } from '@angular/core';
import { ElementRef } from '@angular/core';
import { BillingService } from '../billing.service';
import { Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchShipmentLocation } from '../../awbManagement/awbManagement.shared';
import { AwbManagementService } from '../../awbManagement/awbManagement.service';
import { ApplicationEntities } from '../../common/applicationentities';

@Component({
  selector: 'app-counterclosure-verification',
  templateUrl: './counterclosure-verification.component.html',
  styleUrls: ['./counterclosure-verification.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class CounterclosureVerificationComponent extends NgcPage {

  @ViewChild('viewWindow')
  private viewWindow: NgcWindowComponent;

  isVerifiedSelected: boolean = false;
  hideTransctionDate: boolean;
  btnVerifiedReportDisable: boolean = true;
  btnVerifiedReportexcelDisable: boolean = true;

  isReportEnabled: boolean = false;
  transactionReferenceNumber: any;
  transactionReferenceDate: any;
  issuingBank: any;
  paymentMode: any;
  paymentId: any;
  AWBNumber: any = null;

  counterNumber: String;
  searchCounterClosureVerificationRequest: CounterClosureVerificationForSearch = new CounterClosureVerificationForSearch();
  saveCounterClosureVerificationRequest: any;
  public counterClosureVerificationForm: NgcFormGroup = new NgcFormGroup({
    counterClosureVerificationForSearch: new NgcFormGroup(
      {
        customerID: new NgcFormControl(),
        chargeCodeID: new NgcFormControl(),
        awbNumber: new NgcFormControl(),
        serviceNumber: new NgcFormControl(),
        transactionDateFrom: new NgcFormControl(),
        transactionDateTo: new NgcFormControl(),
        counterNumber: new NgcFormControl(null),
        reportRef: new NgcFormControl(),
        status: new NgcFormControl(),
        statusDateFrom: new NgcFormControl(),
        statusDateTo: new NgcFormControl(),
        modeOfPayment: new NgcFormControl(),
        transactionOrChequeNumber: new NgcFormControl(),
        collectionStatus: new NgcFormControl(null, Validators.required),
        collectionUser: new NgcFormControl(null),
        cash: new NgcFormControl(null),
        mco: new NgcFormControl(null),
        cheque: new NgcFormControl(),
        cashCard: new NgcFormControl(null),
        creditCard: new NgcFormControl(null),
        mcoPartial: new NgcFormControl(),
        nets: new NgcFormControl(),
        verifyAll: new NgcFormControl(1),
        a: new NgcFormControl(),
        verifiedBy: new NgcFormControl(),
        verifiedFrom: new NgcFormControl(),
        verifiedTo: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        domIntl: new NgcFormControl(),
        truckNumber: new NgcFormControl(),
        uldNumber: new NgcFormControl()
      }
    ),
    BillingPayment: new NgcFormArray([]),
    updatePaymentDetails: new NgcFormGroup({
      transactionReferenceNumber: new NgcFormControl(),
      transactionReferenceDate: new NgcFormControl(),
      issuingBank: new NgcFormControl(),
      paymentMode: new NgcFormControl(),
      paymentId: new NgcFormControl(),
    })
  });
  customerId: number;
  isCollectedRecordExist: boolean = false;
  isVerifiedRequired: boolean = false;
  isVerifyAll: boolean = false;
  constructor(appZone: NgZone, appElement: ElementRef, private router: Router, private activatedRoute: ActivatedRoute,
    appContainerElement: ViewContainerRef, private billingService: BillingService, private awbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }
  isCounterClosureVerification: boolean = false;
  responseArray: any;
  reportParam: any;
  @ViewChild('reportWindow') private reportWindow: NgcReportComponent;
  @ViewChild("reportWindowVerifiedShiftClosure") reportWindowVerifiedShiftClosure: NgcReportComponent;
  @ViewChild("reportWindowVerifiedShiftClosureexcel") reportWindowVerifiedShiftClosureexcel: NgcReportComponent;
  @ViewChild("counterBankingSlipsWindow") counterBankingSlipsWindow: NgcReportComponent;
  VerifiedReportParam: any = new Object();
  CounterBankingSlipsParam: any = new Object();

  ngOnInit() {
    //this.changeCollectionStatus();
    NgcUtility.trackCheckUnCheckAll(this.counterClosureVerificationForm.get(['counterClosureVerificationForSearch', 'verifyAll']) as NgcFormControl,
      this.counterClosureVerificationForm.get(['BillingPayment']) as NgcFormArray, "verified");
  }

  ngAfterViewInit() {
    this.hideTransctionDate = true;
  }

  /**
   * This method performs 
   * search operation 
   * and fetch counter closure verification
   * data
   */
  searchCounterClosureVerification() {
    this.resetFormMessages();
    const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.counterClosureVerificationForm.get('counterClosureVerificationForSearch'));
    // Validate
    searchFormGroup.validate();
    // If Invalid, Don't Process
    if (this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').invalid) {
      return;
    }
    (<NgcFormArray>this.counterClosureVerificationForm.controls['BillingPayment']).resetValue([]);
    this.searchCounterClosureVerificationRequest = (this.counterClosureVerificationForm.get('counterClosureVerificationForSearch') as NgcFormGroup).getRawValue()
    if (this.customerId > 0) {
      this.searchCounterClosureVerificationRequest.customerID = this.customerId;
    }
    if (this.counterNumber != null) {
      this.searchCounterClosureVerificationRequest.counterNumber = this.counterNumber;
    }
    this.billingService.searchCounterClosureVerification(this.searchCounterClosureVerificationRequest).subscribe((response) => {
      this.responseArray = response.data;
      /**  checks for any error messages from response object */
      if (this.showResponseErrorMessages(response, null, "counterClosureVerificationForSearch")) {
        this.isCounterClosureVerification = false;
      }
      else {
        if (response.data != null && this.responseArray.length > 0) {
          // let responseArray = response.data
          this.counterClosureVerificationForm.get(['counterClosureVerificationForSearch', 'cash']).setValue(this.responseArray[0].cash)
          this.counterClosureVerificationForm.get(['counterClosureVerificationForSearch', 'mco']).setValue(this.responseArray[0].mco)
          this.counterClosureVerificationForm.get(['counterClosureVerificationForSearch', 'cheque']).setValue(this.responseArray[0].cheque)
          this.counterClosureVerificationForm.get(['counterClosureVerificationForSearch', 'cashCard']).setValue(this.responseArray[0].cashCard)
          this.counterClosureVerificationForm.get(['counterClosureVerificationForSearch', 'mcoPartial']).setValue(this.responseArray[0].mcoPartial)
          this.counterClosureVerificationForm.get(['counterClosureVerificationForSearch', 'creditCard']).setValue(this.responseArray[0].creditCard)
          this.counterClosureVerificationForm.get(['counterClosureVerificationForSearch', 'nets']).setValue(this.responseArray[0].nets)
          this.isCounterClosureVerification = true;
          this.enableVerifyAll(this.responseArray);
          this.counterClosureVerificationForm.get(['BillingPayment']).patchValue(this.responseArray);
          this.disableVerified();
        }
        else {
          this.isCounterClosureVerification = false;
          this.showInfoStatus("billing.info.norecords")
        }
      }

    },
      (error) => {
        this.isCounterClosureVerification = false;
        this.showErrorStatus(error);
      })
  }
  /**
   * This Method
   * updates counter closure verification
   * data
   */


  updateCounterClosureVerification() {
    this.saveCounterClosureVerificationRequest = (this.counterClosureVerificationForm.get(['BillingPayment']) as NgcFormArray).getRawValue();
    let loopRequired: boolean = true;
    this.saveCounterClosureVerificationRequest.forEach(
      (element) => {
        if (loopRequired) {
          if (element.verified) {
            this.isVerifiedRequired = true;
            loopRequired = false;
          }
          else {
            this.isVerifiedRequired = false;
            loopRequired = true;
          }
        }
      }
    )
    if (this.isVerifiedRequired) {
      this.billingService.saveCounterClosureVerification(this.saveCounterClosureVerificationRequest).subscribe(
        (response) => {
          if (this.showResponseErrorMessages(response, null)) {
          }
          if (response.data != null) {
            this.searchCounterClosureVerification();
            this.showSuccessStatus("billing.sucess.data")
          }
        },
        (error) => {
          this.showErrorStatus(error)
        }
      )
    }
    else {
      this.showErrorStatus("billing.error.one");
    }

  }
  /**
   * methods get cutomer id
   * from lov selection of customer
   * @param event 
   */
  getCustomerId(event) {
    if (event.code != null && event.desc != "")
      this.customerId = event.param1;
    else {
      this.customerId = null
    }
  }
  /**
   * On Selection
   * of counter description
   * will be assigned
   * @param item 
   */
  onCounterSelect(item) {
    this.counterNumber = item.desc;
  }
  /**
   * Change Collection 
   * status based on 
   * verification of the report
   */
  changeCollectionStatus() {
    (this.counterClosureVerificationForm.get(['BillingPayment']).valueChanges.subscribe(() => {
      (this.counterClosureVerificationForm.get(['BillingPayment']) as NgcFormArray).controls.forEach(
        (group: NgcFormGroup) => {
          if (group.get('verified').value != null && group.get('verified').value) {
            group.get('collectionStatus').setValue('Verified', {
              emitEvent: false,
              onlySelf: true
            });
          }
          else {
            if (group.get('reportRef').value != null) {
              group.get('collectionStatus').setValue('Reported', {
                emitEvent: false,
                onlySelf: true
              })
            }
            else {
              group.get('collectionStatus').setValue('Collected', {
                emitEvent: false,
                onlySelf: true
              })
            }
          }
        })
    })
    )
  }
  /**
   * Change collection stautus
   * based on verification value
   */
  changeCollectionStatusAfterResponse() {
    this.responseArray.forEach(
      (element) => {
        if (element.collectionStatus != null && element.collectionStatus == 'Verified') {
          element.verified = true;
        }
        else {
          element.verified = false;
        }
      }
    )
  }

  /**
  * This method
  * updates counter closure 
  * verification and generate report
  * for the same
  */
  updateCounterClosureVerificationForReport() {
    this.saveCounterClosureVerificationRequest = (this.counterClosureVerificationForm.get(['BillingPayment']) as NgcFormArray).getRawValue()
    this.saveCounterClosureVerificationRequest.forEach(
      (element) => {
        if (element.collectionStatus == "Collected") {
          this.isCollectedRecordExist = true;
        }
        else {
          this.isCollectedRecordExist = false;
        }
      }
    )
    if (this.isCollectedRecordExist) {
      this.billingService.updateCounterClosureVerificationForReport(this.saveCounterClosureVerificationRequest).subscribe(
        (response) => {
          if (this.showResponseErrorMessages(response, null)) {
          }
          if (response.data != null) {
            //Assigning required parameters for report generation
            setTimeout(() => {
              this.generateReport(response.data);
              this.searchCounterClosureVerification();
              this.showSuccessStatus("billing.sucess.data");
            }, 1500);
          }
        },
        (error) => {
          this.showErrorStatus(error)
        }
      )
    }
    else {
      this.showErrorStatus("billing.error.transaction.status");
    }

  }
  /**
   * disable void
   * check box based on payment status
   */
  disableVerified() {
    (this.counterClosureVerificationForm.get(["BillingPayment"]) as NgcFormArray).controls.forEach((formGroup: NgcFormGroup) => {
      let status = formGroup.get('collectionStatus').value;
      let reportRef = formGroup.get('reportRef').value
      if (status === "Verified" && reportRef != null) {
        formGroup.get(["verified"]).disable({
          onlySelf: true,
          emitEvent: true
        });
      }
    });
  }

  /**
 * Generate Reports for 
 * which collections has been
 * reported
 */
  generateReport(response: any) {
    this.reportParam = new Object();
    if (response >= 0) {
      this.reportParam.ReportNumber = this.counterClosureVerificationForm.get(['BillingPayment', response, 'reportRef']).value;
      this.reportParam.Counter = this.counterClosureVerificationForm.get(['BillingPayment', response, 'counterNumber']).value
    }
    else {
      this.reportParam.ReportNumber = response[0].reportRef;
      this.reportParam.Counter = response[0].counterNumber
    }
    this.reportWindow.open();
  }
  verifiedShiftClosureReport() {
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_DomesticInternationalHandling)) {
      this.VerifiedReportParam.isDomIntEnable = true;
    }
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_House_Enable)) {
      this.VerifiedReportParam.isHawbEnable = true;
    }
    this.VerifiedReportParam.collectionStatus = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('collectionStatus').value;
    this.VerifiedReportParam.verifiedBy = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedBy').value;
    this.VerifiedReportParam.fromDate = NgcUtility.getDateTimeAsStringByFormat(this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedFrom').value, 'MM/DD/YYYY HH:mm');
    this.VerifiedReportParam.toDate = NgcUtility.getDateTimeAsStringByFormat(this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedTo').value, 'MM/DD/YYYY HH:mm');
    this.VerifiedReportParam.displayToDate = NgcUtility.getDateTimeAsStringByFormat(this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedTo').value, 'DD/MM/YYYY HH:mm');
    this.VerifiedReportParam.displayFromDate = NgcUtility.getDateTimeAsStringByFormat(this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedFrom').value, 'DD/MM/YYYY HH:mm');
    this.VerifiedReportParam.counterNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('counterNumber').value;
    this.VerifiedReportParam.paymentMode = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('modeOfPayment').value;
    this.VerifiedReportParam.collectionUser = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('collectionUser').value;
    this.VerifiedReportParam.awbNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('awbNumber').value;
    this.VerifiedReportParam.serviceNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('serviceNumber').value;
    this.VerifiedReportParam.hawbNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('hawbNumber').value;
    this.VerifiedReportParam.reportRef = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('reportRef').value;
    this.VerifiedReportParam.transactionOrChequeNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('transactionOrChequeNumber').value;
    this.VerifiedReportParam.domIntlFlag = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('domIntl').value;

    if (this.customerId > 0) {
      this.VerifiedReportParam.customerID = this.customerId + "";
    }

    //console.log(this.VerifiedReportParam);
    this.reportWindowVerifiedShiftClosure.open();

  }
  counterBankingSlipsReport() {

    this.CounterBankingSlipsParam.VerifiedBy = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedBy').value;
    this.CounterBankingSlipsParam.transactionFrom = NgcUtility.getDateTimeAsStringByFormat(this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedFrom').value, 'YYYY-MM-DD HH:mm');
    this.CounterBankingSlipsParam.transactionDateTo = NgcUtility.getDateTimeAsStringByFormat(this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedTo').value, 'YYYY-MM-DD HH:mm');
    this.CounterBankingSlipsParam.displayTransDate = NgcUtility.getDateTimeAsStringByFormat(new Date(), 'DD-MMM-YYYY');
    this.CounterBankingSlipsParam.PaymentMode = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('modeOfPayment').value;
    this.CounterBankingSlipsParam.collectionUser = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('collectionUser').value;
    this.CounterBankingSlipsParam.awbNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('awbNumber').value;
    this.CounterBankingSlipsParam.serviceNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('serviceNumber').value;
    //this.CounterBankingSlipsParam.customerID = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('customerID').value;
    this.CounterBankingSlipsParam.reportRef = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('reportRef').value;
    this.CounterBankingSlipsParam.transactionOrChequeNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('transactionOrChequeNumber').value;
    this.CounterBankingSlipsParam.hawbNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('hawbNumber').value;
    if (this.customerId > 0) {
      this.VerifiedReportParam.customerID = this.customerId;
    }
    //console.log(this.CounterBankingSlipsParam);
    this.counterBankingSlipsWindow.open();

  }




  enableVerifyAll(responseObj: any) {
    responseObj.forEach(
      (element) => {
        if ((!element.verified) && element.collectionStatus == "Reported") {
          this.isVerifyAll = true;
        }
        else {
          this.isVerifyAll = false;
        }
      }
    )
  }

  makeValueRequired(item) {
    const formGroup: NgcFormGroup = this.counterClosureVerificationForm.get("counterClosureVerificationForSearch") as NgcFormGroup;
    this.isReportEnabled = false;
    this.hideTransctionDate = false;
    this.isVerifiedSelected = false;
    if (item.code === 'Collected') {
      //patching the first row of uld number list
      formGroup.get("verifiedTo").clearValidators();
      formGroup.get("verifiedBy").clearValidators();
      formGroup.get("verifiedFrom").clearValidators();
      this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedFrom').patchValue(null);
      this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedTo').patchValue(null);
      this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedBy').patchValue(null);
      formGroup.get("counterNumber").setValidators(Validators.required);
      this.isReportEnabled = true;
      this.hideTransctionDate = true;
    }
    else if (item.code === 'Verified') {
      this.isVerifiedSelected = true;
      formGroup.get("counterNumber").clearValidators();
      formGroup.get("verifiedTo").setValidators(Validators.required);
      formGroup.get("verifiedBy");
      formGroup.get("verifiedFrom").setValidators(Validators.required);
      this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('transactionDateTo').patchValue(null);
      this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('transactionDateFrom').patchValue(null);
    }
    else {
      formGroup.get("verifiedTo").clearValidators();
      formGroup.get("verifiedBy").clearValidators();
      formGroup.get("verifiedFrom").clearValidators();
      this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedFrom').patchValue(null);
      this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedTo').patchValue(null);
      this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedBy').patchValue(null);
      formGroup.get("counterNumber").clearValidators();
      this.hideTransctionDate = true;
    }
  }

  btnVerifiedReport() {
    this.VerifiedReportParam.collectionStatus = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('collectionStatus').value;
    this.VerifiedReportParam.verifiedBy = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedBy').value;
    this.VerifiedReportParam.fromDate = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedFrom').value;
    this.VerifiedReportParam.toDate = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedTo').value;
    if (this.VerifiedReportParam.fromDate && this.VerifiedReportParam.toDate) {
      this.btnVerifiedReportDisable = false;
      this.btnVerifiedReportexcelDisable = false;
    }
    else {
      this.btnVerifiedReportDisable = true;
      this.btnVerifiedReportexcelDisable = true;
    }

  }


  verifiedShiftClosureReportexcel() {
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_DomesticInternationalHandling)) {
      this.VerifiedReportParam.isDomIntEnable = true;
    }
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_House_Enable)) {
      this.VerifiedReportParam.isHawbEnable = true;
    }
    this.VerifiedReportParam.collectionStatus = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('collectionStatus').value;
    this.VerifiedReportParam.verifiedBy = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedBy').value;
    this.VerifiedReportParam.fromDate = NgcUtility.getDateTimeAsStringByFormat(this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedFrom').value, 'MM/DD/YYYY HH:mm');
    this.VerifiedReportParam.toDate = NgcUtility.getDateTimeAsStringByFormat(this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedTo').value, 'MM/DD/YYYY HH:mm');
    this.VerifiedReportParam.displayToDate = NgcUtility.getDateTimeAsStringByFormat(this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedTo').value, 'DD/MM/YYYY HH:mm');
    this.VerifiedReportParam.displayFromDate = NgcUtility.getDateTimeAsStringByFormat(this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('verifiedFrom').value, 'DD/MM/YYYY HH:mm');
    this.VerifiedReportParam.counterNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('counterNumber').value;
    this.VerifiedReportParam.paymentMode = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('modeOfPayment').value;
    this.VerifiedReportParam.collectionUser = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('collectionUser').value;
    this.VerifiedReportParam.awbNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('awbNumber').value;
    this.VerifiedReportParam.serviceNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('serviceNumber').value;
    this.VerifiedReportParam.customerID = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('customerID').value;
    this.VerifiedReportParam.reportRef = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('reportRef').value;
    this.VerifiedReportParam.transactionOrChequeNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('transactionOrChequeNumber').value;
    this.VerifiedReportParam.hawbNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('hawbNumber').value;
    this.VerifiedReportParam.domIntlFlag = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('domIntl').value;
    this.reportWindowVerifiedShiftClosureexcel.downloadReport();

  }

  changePaymentDetails(index) {
    let x = this.counterClosureVerificationForm.get(['BillingPayment', index]).value;
    this.counterClosureVerificationForm.get('updatePaymentDetails').patchValue(x);
    this.viewWindow.open();
  }

  updatePaymentDetails() {
    let saveData: any = new Object();
    saveData = this.counterClosureVerificationForm.get('updatePaymentDetails').value;
    this.billingService.updateCounterPaymentDetails(saveData).subscribe(value => {
      if (!this.showResponseErrorMessages(value)) {
        if (value.data) {
          this.viewWindow.close();
          this.searchCounterClosureVerification();
        }
        this.counterClosureVerificationForm.get('updatePaymentDetails').patchValue(null);
      }
    }, err => {
      this.showErrorMessage('g.server.down');
    })
  }

  backToHome(event) {
    this.router.navigate(['']);
  }

  onAWBChange(event) {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      let search: SearchShipmentLocation = new SearchShipmentLocation();
      search.shipmentNumber = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('awbNumber').value;
      search.shipment = this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('awbNumber').value;
      this.billingService.checkHandledByOrAccpByHouse(search).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          if (data) {
            this.AWBNumber = this.createSourceParameter(this.counterClosureVerificationForm.get('counterClosureVerificationForSearch').get('awbNumber').value);
          }
        }
      });
    }
  }

}
