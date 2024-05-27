import { Router, ActivatedRoute } from '@angular/router';
import { CollectPaymentService } from '../collectPayment.service';
import { NgcFormControl } from 'ngc-framework';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration
} from 'ngc-framework';
import { request } from 'http';
import { ApplicationFeatures } from '../../../common/applicationfeatures';

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

@Component({
  selector: 'app-payCharges',
  templateUrl: './payCharges.component.html',
  styleUrls: ['./payCharges.component.scss']
})
export class PayChargesComponent extends NgcPage {
  waivedStatusApproved: boolean = false;
  pdAccountChangesForm: any;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private collectPaymentService: CollectPaymentService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  private payChargesForm: NgcFormGroup = new NgcFormGroup({

    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    awbPiece: new NgcFormControl(),
    awbWeight: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    chargeableWeight: new NgcFormControl(),
    shc: new NgcFormControl(),
    shp: new NgcFormControl(),
    agent: new NgcFormControl(),
    payee: new NgcFormControl(),
    payeeName: new NgcFormControl(),
    pdAccount: new NgcFormControl(),
    pdBalance: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    chargeableweight: new NgcFormControl(),
    counter: new NgcFormControl(),
    receivedFrom: new NgcFormControl(),
    icPassNumber: new NgcFormControl(),
    whsTerminalId: new NgcFormControl(),
    chargeAdvice: new NgcFormArray([]),
    paymentDetails: new NgcFormArray([
      new NgcFormGroup({
        mode: new NgcFormControl(''),
        date: new NgcFormControl(''),
        issuingBank: new NgcFormControl(''),
        transactionNumber: new NgcFormControl(''),
        tenderedAmount: new NgcFormControl(''),
        paymentStatus: new NgcFormControl('Processed'),
        paymentRemarks: new NgcFormControl(''),
      })
    ]),
    shipmentInformation: new NgcFormGroup({
      shipmentType: new NgcFormControl(),
      cavFob: new NgcFormControl(),
      duty: new NgcFormControl(),
      shipment: new NgcFormControl(),
      awbNumber: new NgcFormControl(),
      origin: new NgcFormControl(),
      destination: new NgcFormControl(),
      pieces: new NgcFormControl(),
      weight: new NgcFormControl(),
      chargeableWeight: new NgcFormControl(),
      shpcne: new NgcFormControl(),
      shc: new NgcFormControl(),
      agent: new NgcFormControl(),
      payee: new NgcFormControl(),
      payeeName: new NgcFormControl(),
      pdAccount: new NgcFormControl(),
      pdBalance: new NgcFormControl(),
      houseMaster: new NgcFormControl(),
      domIntl: new NgcFormControl(),
      handlingArea: new NgcFormControl(),
      exportImportFlag: new NgcFormControl()
    }),
    houseInformation: new NgcFormGroup({
      duty: new NgcFormControl(),
      hawbNumber: new NgcFormControl(),
      pieces: new NgcFormControl(),
      weight: new NgcFormControl(),
      chargeableWeight: new NgcFormControl(),
      shc: new NgcFormControl(),
      shpcne: new NgcFormControl(),
      agent: new NgcFormControl(),
      payee: new NgcFormControl(),
      pdAccount: new NgcFormControl(),
      pdBalance: new NgcFormControl()
    }),
  });

  // private pdAccountChangesForm: NgcFormGroup = new NgcFormGroup({
  //   payee: new NgcFormControl(),
  //   shpcne: new NgcFormControl(),
  //   payeeName: new NgcFormControl(),
  //   pdAccount: new NgcFormControl(),
  //   pdBalance: new NgcFormControl(),
  // })

  customer: any;

  @ViewChild('selectionWindow') selectWindow: NgcWindowComponent;
  @ViewChild('pdchangesAccount') pdchangesAccount: NgcWindowComponent;
  totalAmountTotal: any = 0;
  taxAmountTotal: any = 0;
  data: any;
  waiveTotal: any = 0;
  amountTotal: any = 0;
  paidTotal: any = 0;
  totalAmount: any = 0;
  totalAmt: any = 0;
  addFlag: any = true;
  waiverPendingFlag: boolean = false;

  ngOnInit() {
    super.ngOnInit();
    this.data = this.getNavigateData(this.activatedRoute);
    this.data.chargeAdvice.forEach(a => {
      if (a.waivedStatus == 'APPROVED') {
        this.waivedStatusApproved = true;
      }
      this.waiveTotal = this.waiveTotal + a.waivedAmount;
      a.amountToPay = parseFloat(a.amountToPay);
      this.amountTotal = this.amountTotal + a.amountToPay;
      this.paidTotal = this.paidTotal + a.paid;
      this.totalAmountTotal = this.totalAmountTotal + a.amount;
      this.taxAmountTotal = this.taxAmountTotal + a.taxAmount;
    })
    this.customer = this.createSourceParameter(this.data.customerInfo[0].customerId);
    this.totalAmount = this.amountTotal;
    this.totalAmount = parseFloat(this.totalAmount);
    // this.payChargesForm.get(['paymentDetails', 0, 'tenderedAmount']).patchValue(this.totalAmount);
    this.totalAmt = this.totalAmount;
    this.data.paymentDetails[0].tenderedAmount = this.totalAmount;
    this.payChargesForm.patchValue(this.data);

    let arrayValue = this.payChargesForm.getRawValue().paymentDetails;
    for (let i = 0; i < arrayValue.length; i++) {
      this.payChargesForm.get(['paymentDetails', i, 'paymentStatus']).valueChanges.subscribe(a => {
        arrayValue = this.payChargesForm.getRawValue().paymentDetails;
        this.totalAmt = 0;
        arrayValue.forEach(b => {
          if (!b.tenderedAmount) {
            b.tenderedAmount = 0;
          }
          if (b.paymentStatus == 'Processed') {
            this.totalAmt = this.totalAmt + b.tenderedAmount;
          }
        });
        this.totalAmt = this.totalAmt;
        this.resetFormMessages();
        if (this.totalAmt > this.totalAmount) {
          this.showErrorStatus('billing.error.payment');
          this.addFlag = false;
        } else {
          this.addFlag = true;
        }
      })
      this.payChargesForm.get(['paymentDetails', i, 'tenderedAmount']).valueChanges.subscribe(a => {
        arrayValue = this.payChargesForm.getRawValue().paymentDetails;
        this.totalAmt = 0;
        arrayValue.forEach(b => {
          if (!b.tenderedAmount) {
            b.tenderedAmount = 0;
          }
          if (b.paymentStatus == 'Processed') {
            this.totalAmt = this.totalAmt + b.tenderedAmount;
          }
        });
        this.totalAmt = this.totalAmt;
        this.resetFormMessages();
        if (this.totalAmt > this.totalAmount) {
          this.showErrorStatus('billing.error.payment');
          this.addFlag = false;
        } else {
          this.addFlag = true;
        }
      })
    }
    this.data.downloadReport = false;
    this.payChargesForm.get('icPassNumber').valueChanges.subscribe(newValue => {
      if (newValue) {
        let reqObj: any = new Object();
        reqObj.customerId = this.payChargesForm.get(['chargeAdvice', 0, 'customerId']).value;
        reqObj.icPassNumber = this.payChargesForm.get('icPassNumber').value;
        this.collectPaymentService.getAuthorizedPersonnelInfo(reqObj).subscribe(response => {
          if (!this.showResponseErrorMessages(response)) {
            this.payChargesForm.get('receivedFrom').patchValue(response.data);
          }
        })
      }
    })
  }

  onAdd() {
    this.addRow();
  }

  addRow() {
    (<NgcFormArray>this.payChargesForm.get('paymentDetails')).addValue([
      {
        mode: '',
        issuingBank: '',
        transactionNumber: '',
        date: '',
        tenderedAmount: '',
        paymentStatus: 'Processed',
        paymentRemarks: '',
      }
    ])
    let arrayValue = this.payChargesForm.getRawValue().paymentDetails;
    for (let i = 0; i < arrayValue.length; i++) {
      this.payChargesForm.get(['paymentDetails', i, 'paymentStatus']).valueChanges.subscribe(a => {
        arrayValue = this.payChargesForm.getRawValue().paymentDetails;
        this.totalAmt = 0;
        arrayValue.forEach(b => {
          if (!b.tenderedAmount) {
            b.tenderedAmount = 0;
          }
          if (b.paymentStatus == 'Processed') {
            this.totalAmt = this.totalAmt + b.tenderedAmount;
          }
        });
        this.totalAmt = this.totalAmt;
        this.resetFormMessages();
        if (this.totalAmt > this.totalAmount) {
          this.showErrorStatus('billing.error.payment');
          this.addFlag = false;
        } else {
          this.addFlag = true;
        }
      })
      this.payChargesForm.get(['paymentDetails', i, 'tenderedAmount']).valueChanges.subscribe(a => {
        arrayValue = this.payChargesForm.getRawValue().paymentDetails;
        this.totalAmt = 0;
        arrayValue.forEach(b => {
          if (!b.tenderedAmount) {
            b.tenderedAmount = 0;
          }
          if (b.paymentStatus == 'Processed') {
            this.totalAmt = this.totalAmt + b.tenderedAmount;
          }
        });
        this.totalAmt = this.totalAmt;
        this.resetFormMessages();
        if (this.totalAmt > this.totalAmount) {
          this.showErrorStatus('billing.error.payment');
          this.addFlag = false;
        }
      });
    }
  }

  onSave() {

    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_WaiverApproveOrReject)) {
      this.checkWaiverStatus();
    }
    if (!this.waiverPendingFlag) {
      let length = this.payChargesForm.get('paymentDetails').value.length;
      if (length) {
        let data = this.payChargesForm.getRawValue();
        let mode = data.paymentDetails[length - 1].mode;
        let bank = data.paymentDetails[length - 1].issuingBank;
        let date = data.paymentDetails[length - 1].date;
        let transaction = data.paymentDetails[length - 1].transactionNumber;
        let amt = data.paymentDetails[length - 1].tenderedAmount;
        if (this.totalAmount < this.totalAmt) {
          this.showErrorStatus('billing.error.totalpayment');
        } else if (this.totalAmount > this.totalAmt) {
          this.showErrorStatus('billing.error.totalpayment');
        } else {
          let payData = this.payChargesForm.getRawValue();
          payData.paymentTotal = this.totalAmount;
          payData.waivedTotal = this.waiveTotal;
          payData.customerId = payData.chargeAdvice[0].customerId;
          this.collectPaymentService.savePayCharges(payData).subscribe(a => {
            if (!this.showResponseErrorMessages(a)) {
              this.showSuccessStatus('billing.sucess.payment');
              this.data.downloadReport = true;
              this.data.receiptId = a.data.receiptId;
              let poData: any = new Object();
              if (this.data.poFlag) {
                poData.shipmentNumber = this.data.shipment;
                poData.chargeCode = this.data.poChargeCode;
                poData.data = this.data.data;
                if (this.data.totalPaymentFlag) {
                  poData.paymentSuccessfulFlag = true;
                  this.navigateTo(this.router, '/import/issuepo', poData);
                } else {
                  poData.paymentSuccessfulFlag = false;
                  this.navigateTo(this.router, '/billing/collectPayment/enquireCharges', this.data);
                }
              } else if (this.data.returnRejectFlag) {
                poData.shipmentNumber = this.data.shipment;
                poData.data = this.data.data;
                if (this.data.totalPaymentFlag) {
                  poData.paymentSuccessfulFlag = true;
                  this.navigateTo(this.router, '/export/acceptance/rejectshipment', poData);
                } else {
                  poData.paymentSuccessfulFlag = false;
                  this.navigateTo(this.router, '/billing/collectPayment/enquireCharges', this.data);
                }
              } else {
                this.navigateTo(this.router, '/billing/collectPayment/enquireCharges', this.data);
              }
            }
          }, error => {
            this.showErrorMessage(error);
          });
        }
      }
    }
  }
  /*  This method used to check if waiver is pending then show error to user for AISATS */
  checkWaiverStatus() {

    let data = this.payChargesForm.getRawValue();
    data.chargeAdvice.forEach(element => {
      if (element.waivedStatus && element.waivedStatus == 'PENDING') {
        this.waiverPendingFlag = true;
      }
    });

    if (this.waiverPendingFlag) {
      this.showErrorStatus('billing.waiver.approval');
    }

  }
  setCounter() {
    this.selectWindow.open();
  }

  setCount() {
    this.payChargesForm.get('counter').patchValue(this.payChargesForm.getRawValue().counter);
    this.selectWindow.close();
  }

  onCounterSelect(item) {
    this.payChargesForm.get('whsTerminalId').patchValue(item.numericCode);
  }

  onCancel() {
    this.navigateBack(this.data);
  }

  onPayDelete(item, index) {
    let paymentRecord: any = this.payChargesForm.getRawValue().paymentDetails[index];
    if (!paymentRecord.tenderedAmount) {
      paymentRecord.tenderedAmount = 0;
    }
    if (paymentRecord.paymentStatus == 'Processed') {
      let tendered: any = parseFloat(paymentRecord.tenderedAmount);
      this.totalAmt = this.totalAmt - tendered;
      this.totalAmt = this.totalAmt
    }
    (<NgcFormArray>this.payChargesForm.get('paymentDetails')).deleteValueAt(index);
  }
}
