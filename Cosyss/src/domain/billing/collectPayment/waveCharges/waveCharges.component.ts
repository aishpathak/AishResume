import { Router, ActivatedRoute } from '@angular/router';
import { CollectPaymentService } from '../collectPayment.service';
import { NgcFormControl } from 'ngc-framework';
import { Validators } from '@angular/forms';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration
} from 'ngc-framework';
import { ApplicationFeatures } from '../../../common/applicationfeatures';

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

@Component({
  selector: 'app-waveCharges',
  templateUrl: './waveCharges.component.html',
  styleUrls: ['./waveCharges.component.scss']
})
export class WaveChargesComponent extends NgcPage {

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private collectPaymentService: CollectPaymentService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  private waiveChargesForm: NgcFormGroup = new NgcFormGroup({
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    awbPiece: new NgcFormControl(),
    awbWeight: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    chargeablewgt: new NgcFormControl(),
    shp: new NgcFormControl(),
    agent: new NgcFormControl(),
    payee: new NgcFormControl(),
    payeeName: new NgcFormControl(),
    pdaccount: new NgcFormControl(),
    pdbalance: new NgcFormControl(),
    payeeInformation: new NgcFormGroup({
      payeeCustomerType: new NgcFormControl(),
      payeeCustomerName: new NgcFormControl(),
      paymentAccountNumber: new NgcFormControl(),
      paymentAccountBalance: new NgcFormControl()
    }),
    sbnumber: new NgcFormControl(),
    chargeableweight: new NgcFormControl(),
    customerName: new NgcFormControl(),
    service: new NgcFormControl(),
    shipment: new NgcFormControl(),
    shc: new NgcFormControl(),
    handlingArea: new NgcFormControl(),
    exportImportFlag: new NgcFormControl(),
    approver: new NgcFormControl(),
    waiveReason: new NgcFormControl(),
    approverEmail: new NgcFormControl(),
    waivedTotal: new NgcFormControl(),
    chargeAdvice: new NgcFormArray([]),
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
      chargeableWgt: new NgcFormControl(),
      shpcne: new NgcFormControl(),
      agent: new NgcFormControl(),
      payee: new NgcFormControl(),
      payeeName: new NgcFormControl(),
      pdAccount: new NgcFormControl(),
      pdBalance: new NgcFormControl(),
      sbNumber: new NgcFormControl(),
      chargeableWeight: new NgcFormControl(),
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
      payeeName: new NgcFormControl(),
      pdAccount: new NgcFormControl(),
      pdBalance: new NgcFormControl()
    }),
  });

  navigateData: any;
  actualAmount: any;
  waivedAmount: any;
  approverParam: any;
  totalPaid: any = 0;
  totalTax: any = 0;

  ngOnInit() {
    super.ngOnInit();
    this.navigateData = this.getNavigateData(this.activatedRoute);
    this.navigateData.shipmentInformation.payeeName = this.navigateData.payeeName;
    if (this.navigateData.houseInformation && this.navigateData.shipmentHouseId) {
      this.navigateData.houseInformation.payeeName = this.navigateData.payeeName;
    }
    this.waiveChargesForm.patchValue(this.navigateData);
    this.actualAmount = 0;
    this.waivedAmount = 0;
    let index = 0;
    this.navigateData.chargeAdvice.forEach(a => {
      if (a['duration']) {
        this.waiveChargesForm.get(['chargeAdvice', index, 'waivedUpdatedDuration']).enable();
      } else {
        this.waiveChargesForm.get(['chargeAdvice', index, 'waivedUpdatedDuration']).disable();
      }
      if (a['quantity']) {
        this.waiveChargesForm.get(['chargeAdvice', index, 'waivedUpdatedQuantity']).enable();
      } else {
        this.waiveChargesForm.get(['chargeAdvice', index, 'waivedUpdatedQuantity']).disable();
      }
      if (a['chargeAmount']) {
        this.actualAmount += a['chargeAmount'];
      }
      if (!NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_WaiverApproveOrReject) && a['paid']) {
        this.totalPaid += a['paid'];
      }
      if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_WaiverApproveOrReject) && a['paidGrossAmount']) {
        this.totalPaid += a['paidGrossAmount'];
        this.totalTax += a['paidTaxAmount'];
      }
      if (a['waivedAmount']) {
        this.actualAmount -= a['waivedAmount'];
        this.actualAmount = parseFloat(this.actualAmount);
        this.waivedAmount += a['waivedAmount'];
      }

      index++;
    })
    this.approverParam = this.createSourceParameter(this.waivedAmount);
    if (this.waiveChargesForm.get('chargeAdvice').value.length) {
      for (let i = 0; i < this.waiveChargesForm.get('chargeAdvice').value.length; i++) {
        this.waiveChargesForm.get(['chargeAdvice', i, 'waivedAmount']).valueChanges.subscribe(a => {
          if (Number((this.actualAmount - this.totalPaid + this.navigateData.chargeAdvice[i].waivedAmount - parseFloat(a)).toFixed(NgcUtility.getApplicationCurrencyDecimals())) >= 0) {
            this.waivedAmount = parseFloat((this.waivedAmount - this.navigateData.chargeAdvice[i].waivedAmount + parseFloat(a)).toFixed(NgcUtility.getApplicationCurrencyDecimals()));
            this.actualAmount = parseFloat((this.actualAmount + this.navigateData.chargeAdvice[i].waivedAmount - parseFloat(a)).toFixed(NgcUtility.getApplicationCurrencyDecimals()));
            this.actualAmount = parseFloat(this.actualAmount);
            this.navigateData.chargeAdvice[i].waivedAmount = parseFloat(a);
            this.approverParam = this.createSourceParameter(this.waivedAmount);
          }
        })
      }
    }
  }

  onCalculate(index) {
    let waiveAmount = this.waiveChargesForm.get(['chargeAdvice', index, 'waivedAmount']).value;
    let waiveRequest: any = this.waiveChargesForm.getRawValue().chargeAdvice[index];
    // HANGING CHARGE AMOUNT FOR CALCULAION WITHOUT TAXES
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_WaiverApproveOrReject)) {
      waiveRequest.amount = waiveRequest.chargeAmount;
    }
    waiveRequest.index = index;
    if (!waiveAmount) {
      waiveAmount = 0;
    }

    this.collectPaymentService.calculateWaiver(waiveRequest).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        waiveAmount = data.data.waivedAmount;
      }

      this.waiveChargesForm.get(['chargeAdvice', index, 'waivedAmount']).patchValue(waiveAmount);
    });
  }

  onSave(waiveFlag) {
    let data = this.waiveChargesForm.getRawValue();
    let amtFlag = false;
    let qtyFlag = false;
    let durFlag = false;
    let perFlag = false;
    data.waivedTotal = this.waivedAmount;
    data.chargeAdvice.forEach(a => {
      if (a['chargeAmount']) {
        a['amountToPay'] = a['chargeAmount'];
        // a['amount'] = a['chargeAmount'];

      }
      if (a['waivedAmount']) {
        a['amountToPay'] = a['amountToPay'] - a['waivedAmount'] - a['paid'];
        // a['amount'] = a['amountToPay'] - a['waivedAmount'] - a['paid'];

      }
      if (a['chargeAmount'] < a['waivedAmount']) {
        amtFlag = true;
      }
      if (a['quantity'] < a['waivedUpdatedQuantity']) {
        qtyFlag = true;
      }
      if (a['duration'] < a['waivedUpdatedDuration']) {
        durFlag = true;
      }
      if (a['waivedPercentage'] > 100) {
        perFlag = true;
      }
    });
    if (this.waivedAmount > 0) {
      data.userId = this.getUserProfile().userLoginCode;
      data.customerName = this.navigateData.customerInfo[0].customerName;
      data.userName = this.getUserProfile().userShortName;
      if (waiveFlag) {
        this.collectPaymentService.saveWaivedCharges(data).subscribe(response => {
          if (!this.showResponseErrorMessages(response)) {
            this.showSuccessStatus('billing.sucess.waiver');
            if (this.waivedAmount == data.collectSum) {
              let poData: any = new Object();
              if (this.navigateData.poFlag) {
                poData.paymentSuccessfulFlag = true;
                poData.shipmentNumber = this.navigateData.shipment;
                poData.chargeCode = this.navigateData.poChargeCode;
                poData.data = this.navigateData.data;
                this.navigateTo(this.router, '/import/issuepo', poData);
              } else if (this.navigateData.returnRejectFlag) {
                poData.paymentSuccessfulFlag = true;
                poData.shipmentNumber = this.navigateData.shipment;
                poData.data = this.navigateData.data;
                this.navigateTo(this.router, '/export/acceptance/rejectshipment', poData);
              } else {
                this.navigateTo(this.router, '/billing/collectPayment/enquireCharges', this.navigateData);
              }
            } else {
              this.navigateBack(this.navigateData);
            }
          }
        }, error => {
          this.showErrorMessage(error);
        });
      } else {
        data.poFlag = this.navigateData.poFlag;
        data.returnRejectFlag = this.navigateData.returnRejectFlag;
        data.poNumber = this.navigateData.poNumber;
        data.poChargeCode = this.navigateData.poChargeCode;
        data.data = this.navigateData.data;
        this.collectPaymentService.checkValidWaiverCharges(data).subscribe(dat => {
          if (!this.showResponseErrorMessages(dat)) {
            this.navigateTo(this.router, '/billing/collectPayment/payCharges', data);
          }
        }, error => {
          this.showErrorMessage(error);
        });
      }
    } else {
      this.showErrorMessage('billing.total.error');
    }
  }

  onWaive() {
    this.onSave(true);
  }

  onWaiveAndPay() {
    this.onSave(false);
  }

  onSelect(item) {
    this.waiveChargesForm.get('approverEmail').patchValue(item.parameter2);

  }

  onCancel() {
    this.navigateTo(this.router, '/billing/collectPayment/enquireCharges', this.navigateData);
  }
}
