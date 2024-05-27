import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../billing.service';
import { CollectPaymentService } from '../collectPayment/collectPayment.service'
import { NgcFormControl } from 'ngc-framework';
import { SearchChargeCode, ChargeParameter, ChargeFactor } from '../billing.sharedmodel';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcReportComponent,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, PageConfiguration
} from 'ngc-framework';

@Component({
  selector: 'app-groupPayment',
  templateUrl: './groupPayment.component.html',
  styleUrls: ['./groupPayment.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class GroupPaymentComponent extends NgcPage {

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private billingService: BillingService,
    private collectPaymentService: CollectPaymentService, private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  @ViewChild('enquiryWindow') enquiryWindow: NgcWindowComponent;
  @ViewChild('reportWindow') private reportWindow: NgcReportComponent;

  private groupPaymentForm: NgcFormGroup = new NgcFormGroup({
    customer: new NgcFormControl(),
    shipmentNum: new NgcFormControl(),
    serviceNum: new NgcFormControl(),
    counter: new NgcFormControl(),
    whsTerminalId: new NgcFormControl(),
    shipmentId: new NgcFormControl(),
    receivedFrom: new NgcFormControl(),
    icPassNumber: new NgcFormControl(),
    serviceId: new NgcFormControl(),
    groupAdvice: new NgcFormArray([]),
    paymentDetails: new NgcFormArray([
      new NgcFormGroup({
        mode: new NgcFormControl(),
        issuingBank: new NgcFormControl(''),
        transactionNumber: new NgcFormControl(''),
        date: new NgcFormControl(),
        tenderedAmount: new NgcFormControl(''),
        paymentStatus: new NgcFormControl('Processed'),
        paymentRemarks: new NgcFormControl(),
      })
    ])
  });
  totalAmount: any = 0;
  totalAmt: any = 0;
  paymentAmount: any = 0;
  response: any = new Object();
  chargeWindowData: any;
  billTotal: any = 0;
  collectTotal: any = 0;
  reportParam: any;
  private customerIdForDrop: any;
  private customerId: any;

  ngOnInit() {
    super.ngOnInit();
    let navigateData = this.getNavigateData(this.activatedRoute);
    if (navigateData) {
      if (navigateData.shipment) {
        this.groupPaymentForm.get('shipmentNum').patchValue(navigateData.shipment);
        this.getInfo();
      } else if (navigateData.service) {
        this.groupPaymentForm.get('serviceNum').patchValue(navigateData.service);
        this.getInfo();
      }
    }
    let adviceValue = this.groupPaymentForm.getRawValue().groupAdvice;
    for (let i = 0; i < adviceValue.length; i++) {
      this.groupPaymentForm.get(['groupAdvice', i, 'received']).valueChanges
        .subscribe(a => {
          let total: any = 0;
          let value = this.groupPaymentForm.get(['groupAdvice', i, 'collectAmount']).value -
            this.groupPaymentForm.get(['groupAdvice', i, 'receivedAmount']).value - a;
          this.groupPaymentForm.get(['groupAdvice', i, 'balanceAmount']).patchValue(value);
          this.groupPaymentForm.getRawValue().groupAdvice.forEach(a => {
            if (a.flagCRUD != 'D') {
              total += a.received;
            }
          })
          this.totalAmount = total;
        })
    }

    let payValue = this.groupPaymentForm.getRawValue().paymentDetails;
    for (let i = 0; i < payValue.length; i++) {
      this.groupPaymentForm.get(['paymentDetails', i, 'paymentStatus']).valueChanges
        .subscribe(a => {
          let total: any = 0;
          this.resetFormMessages();
          this.groupPaymentForm.getRawValue().paymentDetails.forEach(a => {
            if (a.flagCRUD != 'D' && a.paymentStatus == 'Processed') {
              total += a['tenderedAmount'];
            }
          })
          this.totalAmt = total;
          this.paymentAmount = total;
          this.groupPaymentForm.get('paymentTotalAmount').patchValue(total);
        })
      this.groupPaymentForm.get(['paymentDetails', i, 'tenderedAmount']).valueChanges
        .subscribe(a => {
          let total: any = 0;
          this.resetFormMessages();
          this.groupPaymentForm.getRawValue().paymentDetails.forEach(a => {
            if (a.flagCRUD != 'D' && a.paymentStatus == 'Processed') {
              total += a['tenderedAmount'];
            }
          })
          this.totalAmt = total;
          this.paymentAmount = total;
          this.groupPaymentForm.get('paymentTotalAmount').patchValue(total);
        })
    }

    this.groupPaymentForm.get('shipmentNum').valueChanges
      .subscribe(a => {
        if (a) {
          this.getInfo();
        }
      })

    this.groupPaymentForm.get('serviceNum').valueChanges
      .subscribe(a => {
        if (a) {
          this.getInfo();
        }
      })
    this.groupPaymentForm.get('icPassNumber').valueChanges.subscribe(newValue => {
      if (newValue) {
        let reqObj: any = new Object();
        reqObj.customerId = this.groupPaymentForm.get('customerId').value;
        reqObj.icPassNumber = this.groupPaymentForm.get('icPassNumber').value;
        this.collectPaymentService.getAuthorizedPersonnelInfo(reqObj).subscribe(response => {
          if (!this.showResponseErrorMessages(response)) {
            this.groupPaymentForm.get('receivedFrom').patchValue(response.data);
          }
        })
      }
    })
  }

  getInfo() {
    let req = this.groupPaymentForm.getRawValue();
    if (!req.shipmentNum) {
      req.shipmentNumber = null;
    } else {
      req.shipmentNumber = req.shipmentNum;
    }
    if (!req.serviceNum) {
      req.serviceNumber = null;
    } else {
      req.serviceNumber = req.serviceNum;
    }
    this.billingService.getGroupInfo(req).subscribe(a => {
      if (!this.showResponseErrorMessages(a)) {
        this.response = a.data;
        this.totalAmount = 0;
        a.data.groupAdvice.forEach(b => {
          b.received = b.collectAmount - b.receivedAmount;
          b.balanceAmount = b.collectAmount - b.receivedAmount - b.received;
          this.totalAmount += b.received;
        })
        this.groupPaymentForm.patchValue(a.data);
        this.groupPaymentForm.get('shipmentNum').setValue(null);
        this.groupPaymentForm.get('serviceNum').setValue(null);
        this.groupPaymentForm.get(['paymentDetails', 0, 'tenderedAmount']).patchValue(this.totalAmount);

        let adviceValue = this.groupPaymentForm.getRawValue().groupAdvice;
        for (let i = 0; i < adviceValue.length; i++) {
          this.groupPaymentForm.get(['groupAdvice', i, 'received']).valueChanges
            .subscribe(a => {
              let total: any = 0;
              let value = this.groupPaymentForm.get(['groupAdvice', i, 'collectAmount']).value -
                this.groupPaymentForm.get(['groupAdvice', i, 'receivedAmount']).value - a;
              this.groupPaymentForm.get(['groupAdvice', i, 'balanceAmount']).patchValue(value);
              this.groupPaymentForm.getRawValue().groupAdvice.forEach(a => {
                if (a.flagCRUD != 'D') {
                  total += a.received;
                }
              })
              this.totalAmount = total;
              this.groupPaymentForm.get(['paymentDetails', 0, 'tenderedAmount']).patchValue(this.totalAmount);
            })
        }
        this.calcPayment();
        this.focusToFirstInput();
      } else {
        this.groupPaymentForm.get('shipmentNum').setValue(null);
        this.groupPaymentForm.get('serviceNum').setValue(null);
        this.focusToFirstInput();
      }
    }, error => {
      this.showErrorMessage(error);
      this.focusToFirstInput();
    });
  }

  calcPayment() {
    let adviceeValue = this.groupPaymentForm.getRawValue().paymentDetails;
    for (let i = 0; i < adviceeValue.length; i++) {
      this.groupPaymentForm.get(['paymentDetails', i, 'paymentStatus']).valueChanges
        .subscribe(a => {
          let total: any = 0;
          this.resetFormMessages();
          this.groupPaymentForm.getRawValue().paymentDetails.forEach(a => {
            if (a.flagCRUD != 'D' && a.paymentStatus == 'Processed') {
              total += a['tenderedAmount'];
            }
          })
          this.totalAmt = total;
          this.paymentAmount = total;
          this.groupPaymentForm.get('paymentTotalAmount').patchValue(total);
        })
      this.groupPaymentForm.get(['paymentDetails', i, 'tenderedAmount']).valueChanges
        .subscribe(a => {
          let total: any = 0;
          this.resetFormMessages();
          this.groupPaymentForm.getRawValue().paymentDetails.forEach(a => {
            if (a.flagCRUD != 'D' && a.paymentStatus == 'Processed') {
              total += a['tenderedAmount'];
            }
          })
          this.totalAmt = total;
          this.paymentAmount = total;
          this.groupPaymentForm.get('paymentTotalAmount').patchValue(total);
        })
    }
  }

  onCounterSelect(item) {
    this.groupPaymentForm.get('whsTerminalId').patchValue(item.numericCode);
    this.groupPaymentForm.get('counter').patchValue(item.desc);
  }

  onSave() {
    let req = this.groupPaymentForm.getRawValue();
    req.totalAmount = this.totalAmount;
    req.paymentTotalAmount = this.paymentAmount;
    req.customerId = req.chargesOnShipment[0].customerId;
    this.billingService.makeGroupPayment(req).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.groupPaymentForm.reset();
        this.response.groupAdvice = null;
        this.showSuccessStatus('billing.sucess.payment');
        this.reportParam = new Object();
        let receiptId = data.data.receiptId;
        this.reportParam.PaymentReceiptId = receiptId;
        this.reportParam.ShipmentId = 0;
        this.reportParam.ServiceRequestId = 0;
        this.reportParam.ReferenceType = '';
        this.reportParam.ReferenceId = 0;
        this.reportParam.ShowPaymentRecepit = 'true';
        this.groupPaymentForm.get('groupAdvice').patchValue(new Array());
        this.groupPaymentForm.get('chargesOnShipment').patchValue(new Array());
        this.reportWindow.open();
      }
    }, error => {
      this.showErrorMessage(error);
    })
  }

  onNavigateLinkClick(item, index) {
    this.chargeWindowData = this.groupPaymentForm.getRawValue().chargesOnShipment[index].chargeEntry;
    this.billTotal = 0;
    this.collectTotal = 0;
    this.chargeWindowData.forEach(totals => {
      this.billTotal += totals.toBill;
      this.collectTotal += totals.toCollect;
    })
    this.enquiryWindow.open();
  }

  onDeleteLinkClick(item, index) {
    this.totalAmount -= this.groupPaymentForm.get(['groupAdvice', index, 'received']).value;
    (<NgcFormArray>this.groupPaymentForm.get('groupAdvice')).removeAt(index);
    (<NgcFormArray>this.groupPaymentForm.get('chargesOnShipment')).removeAt(index);
  }

  addPayDetails() {
    (<NgcFormArray>this.groupPaymentForm.get('paymentDetails')).addValue([
      {
        mode: null,
        issuingBank: '',
        transactionNumber: '',
        date: null,
        tenderedAmount: '',
        paymentStatus: 'Processed',
        paymentRemarks: ''
      }
    ])
    this.calcPayment();
  }

  /**
*
*called when custumer code selected
* @param {any} event
* @memberof 
*/
  onClickCustomer(event) {
    this.customerIdForDrop = event.code;
    this.customerId = this.createSourceParameter(
      event.code
    );
  }

  /**
    *
    *called when custumer code selected
    * @param {any} event
    * @memberof 
    */
  onClickService(event) {
    if (this.customerIdForDrop == null) {
      this.showFormErrorMessages("billing.error.select.customer");
    }
  }

  backToHome(event) {
    this.router.navigate(['']);
  }

  onPayDelete(item, index) {
    let paymentRecord: any = this.groupPaymentForm.getRawValue().paymentDetails[index];
    if (!paymentRecord.tenderedAmount) {
      paymentRecord.tenderedAmount = 0;
    }
    if (paymentRecord.paymentStatus == 'Processed') {
      let tendered: any = parseFloat(paymentRecord.tenderedAmount);
      this.totalAmt = this.totalAmt - tendered;
      this.totalAmt = this.totalAmt;
      this.paymentAmount = this.totalAmt;
    }
    (<NgcFormArray>this.groupPaymentForm.get('paymentDetails')).deleteValueAt(index);
  }
}