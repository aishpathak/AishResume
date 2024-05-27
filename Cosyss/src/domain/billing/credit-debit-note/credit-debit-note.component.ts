import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcReportComponent, NgcUtility, ReportFormat } from 'ngc-framework';
import { AwbManagementService } from '../../awbManagement/awbManagement.service';
import { SearchShipmentLocation } from '../../awbManagement/awbManagement.shared';
import { ApplicationEntities } from '../../common/applicationentities';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-credit-debit-note',
  templateUrl: './credit-debit-note.component.html',
  styleUrls: ['./credit-debit-note.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class CreditDebitNoteComponent extends NgcPage implements OnInit {
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  reportParameters: any;
  AWBNumber: {};
  customer: any;
  invoiceDropdownParams: any;
  makeCustomerLovEditable: boolean;
  customerLovEditable: boolean = true;
  payeeDetail: any;
  customerIdForReference: any;
  defaultPayeeName: any;
  taxComp1Rate = null;
  taxComp1Code = null;
  taxComp2Rate = null;
  taxComp2Code = null;
  taxComp3Rate = null;
  taxComp3Code = null;
  constructor(appZone: NgZone,
    private billingService: BillingService, private awbManagementService: AwbManagementService, ppZone: NgZone,
    appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    this.form.get('searchCreditDebitNoteData').patchValue(this.forwardedData);
    this.onSearch();
    this.fractionScale = NgcUtility.getApplicationInternationalCurrencyDecimals();
  }
  searchFlag: boolean = false;
  fractionScale: number;
  CreditDebitAmountSectionFlag: boolean = false;
  forwardedData: any;
  readOnly: boolean = false;
  displayPDAccountDropdown: boolean = false;
  openreport: boolean = false;
  private form: NgcFormGroup = new NgcFormGroup({
    searchCreditDebitNoteData: new NgcFormGroup({
      noteType: new NgcFormControl(),
      receiptNumber: new NgcFormControl(),
      awbNumber: new NgcFormControl(),
      hawbNumber: new NgcFormControl(),
      receiptNumberDropdown: new NgcFormControl(),
      creditDebitNoteNumber: new NgcFormControl(),
      readOnly: new NgcFormControl()
    }),
    chargeInformation: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        paymentReceiptId: new NgcFormControl(),
        receiptNumber: new NgcFormControl(),
        chargeEntryBillPaidId: new NgcFormControl(),
        serviceType: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        grossAmount: new NgcFormControl(),
        taxAmount: new NgcFormControl(),
        taxComp1: new NgcFormControl(),
        taxComp1Rate: new NgcFormControl(),
        taxComp1Code: new NgcFormControl(),
        taxComp2: new NgcFormControl(),
        taxComp2Rate: new NgcFormControl(),
        taxComp2Code: new NgcFormControl(),
        taxComp3: new NgcFormControl(),
        taxComp3Rate: new NgcFormControl(),
        taxComp3Code: new NgcFormControl(),
        totalAmount: new NgcFormControl(),
        billPaidAmount: new NgcFormControl(),
        creditOrDebitAmount: new NgcFormControl(),
        crdbtaxComp1: new NgcFormControl(),
        crdbtaxComp2: new NgcFormControl(),
        crdbtaxComp3: new NgcFormControl(),
        crdbtaxAmount: new NgcFormControl(),
        transactionAmount: new NgcFormControl(),
        showCreditDebitAmountField: new NgcFormControl(),
        creditDebitNoteReceiptId: new NgcFormControl(),
        ShipmentHouseId: new NgcFormControl(),
        ShipmentServiceReferenceId: new NgcFormControl(),
        customerType: new NgcFormControl(),
        chargeCodeId: new NgcFormControl(),
        documentAmount: new NgcFormControl()
      })
    ]),
    chargesPayment: new NgcFormArray([
      new NgcFormGroup({
        customerId: new NgcFormControl(),
        payeeCode: new NgcFormControl(),
        payeeName: new NgcFormControl(),
        mode: new NgcFormControl(),
        pdAccountNumber: new NgcFormControl(),
        pdBalance: new NgcFormControl(),
        issuingBank: new NgcFormControl(),
        transactionNumber: new NgcFormControl(),
        transactionDate: new NgcFormControl(),
        paymentAmount: new NgcFormControl(),
        paymentRemark: new NgcFormControl()
      })
    ]),
    creditDebitAmountReason: new NgcFormArray([
      new NgcFormGroup({
        documentAmount: new NgcFormControl(),
        taxComp1: new NgcFormControl(),
        taxComp2: new NgcFormControl(),
        taxComp3: new NgcFormControl(),
        totalGrossAmount: new NgcFormControl(),
        documentRemark: new NgcFormControl(),
        roundOffDelta: new NgcFormControl(),
        totaltax: new NgcFormControl(),
        amountToBeCollect: new NgcFormControl()
      })
    ]),
    paymentDetails: new NgcFormArray([
      new NgcFormGroup({
        customerData: new NgcFormControl(),
        payeeName: new NgcFormControl(),
        mode: new NgcFormControl(),
        pdNumber: new NgcFormControl(),
        pdBalance: new NgcFormControl(),
        issuingBank: new NgcFormControl(),
        date: new NgcFormControl(),
        tenderedAmount: new NgcFormControl(),
        paymentRemarks: new NgcFormControl()
      })
    ]),
    receiptNumber: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    noteType: new NgcFormControl(),
    creditDebitNoteNumber: new NgcFormControl(),
    documentAmount: new NgcFormControl(),
    totaltax: new NgcFormControl(),
    totalGrossAmount: new NgcFormControl(),
    documentRemark: new NgcFormControl(),
    customerId: new NgcFormControl(),
    taxComp1: new NgcFormControl(),
    taxComp2: new NgcFormControl(),
    taxComp3: new NgcFormControl(),
    roundOffDelta: new NgcFormControl(),
    sendToIRN: new NgcFormControl()
  });

  onAWBChange(event) {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      let search: SearchShipmentLocation = new SearchShipmentLocation();
      search.shipmentNumber = this.form.get('searchCreditDebitNoteData').get('awbNumber').value;
      search.shipment = this.form.get('searchCreditDebitNoteData').get('awbNumber').value;
      this.billingService.checkHandledByOrAccpByHouse(search).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          if (data) {
            this.AWBNumber = this.createSourceParameter(this.form.get('searchCreditDebitNoteData').get('awbNumber').value);
          }
        }
      });
    }
    this.fetchInvoiceNumber();
  }

  fetchInvoiceNumber() {
    if (!NgcUtility.isBlank(this.form.get(['searchCreditDebitNoteData', 'awbNumber']).value)) {
      this.invoiceDropdownParams = this.createSourceParameter(this.form.get(['searchCreditDebitNoteData', 'awbNumber']).value, this.form.get(['searchCreditDebitNoteData', 'hawbNumber']).value);
      this.retrieveDropDownListRecords("INVOICE_BY_AWB_HAWB", 'query', this.invoiceDropdownParams).subscribe(response => {
        this.form.get(['searchCreditDebitNoteData', 'receiptNumberDropdown']).patchValue(response[0].code);
      }, error => {
      });
    }
  }

  onSearch() {
    var search = this.form.getRawValue().searchCreditDebitNoteData;
    if (NgcUtility.isBlank(search.receiptNumber) && !NgcUtility.isBlank(search.receiptNumberDropdown)) {
      search.receiptNumber = search.receiptNumberDropdown;
    }
    if (NgcUtility.isBlank(search.receiptNumber)) {
      this.showErrorMessage("billing.receipt.number.required");
      return;
    } else {
      search.readOnly = (search.receiptNumber.substr(0, 2) == 'PR' ? false : true);
      this.readOnly = search.readOnly;
      this.billingService.searchCreditDebitNoteData(search).subscribe(result => {
        if (!this.showResponseErrorMessages(result)) {
          this.searchFlag = true;
          for (const eachrow of result.data.chargeInformation) {
            eachrow['select'] = false;
          }
          this.readOnly = result.data.readOnly;
          this.form.patchValue(result.data);
          this.payeeDetail = this.form.get(['chargesPayment', 0, 'payeeCode']).value;
          this.defaultPayeeName = this.form.get(['chargesPayment', 0, 'payeeName']).value;
          this.customerIdForReference = this.form.get(['chargesPayment', 0, 'customerId']).value;
          this.customer = this.createSourceParameter(this.form.get(['chargesPayment', 0, 'customerId']).value, Math.random().toString());
          this.form.get(['paymentDetails', 0, 'customerData']).patchValue(this.payeeDetail);
          this.form.get(['paymentDetails', 0, 'payeeName']).patchValue(this.defaultPayeeName);
          this.form.get(['paymentDetails', 0, 'date']).patchValue(NgcUtility.getCurrentDateOnly());



          if (this.readOnly) {
            this.form.get(['searchCreditDebitNoteData', 'creditDebitNoteNumber']).patchValue(result.data.creditDebitNoteNumber);
            this.form.get(['searchCreditDebitNoteData', 'noteType']).patchValue(result.data.noteType);


            (<NgcFormArray>this.form.get('creditDebitAmountReason')).markAsDeletedAt(0);
            (<NgcFormArray>this.form.controls['creditDebitAmountReason']).addValue([
              {
                documentAmount: result.data.documentAmount,
                taxComp1: result.data.taxComp1,
                taxComp2: result.data.taxComp2,
                taxComp3: result.data.taxComp3,
                totalGrossAmount: result.data.totalGrossAmount,
                documentRemark: result.data.documentRemark
              }
            ]);

            this.CreditDebitAmountSectionFlag = true;

            this.form.get('searchCreditDebitNoteData').disable();
          }
          if (this.openreport) {
            this.reportParameters = new Object();
            this.reportParameters.creditDebitnoteScreen = true;
            this.reportParameters.documentNumber = result.data.creditDebitNoteNumber;
            this.reportParameters.paymentReceiptId = this.form.get(['chargeInformation', 0, 'creditDebitNoteReceiptId']).value;
            this.reportParameters.ShipmentId = this.form.get(['chargeInformation', 0, 'shipmentServiceReferenceId']).value;
            this.reportParameters.HouseId = this.form.get(['chargeInformation', 0, 'shipmentHouseId']).value;
            this.reportParameters.customerType = this.form.get(['chargeInformation', 0, 'customerType']).value;
            this.reportParameters.invoiceNumber = this.form.get(['chargeInformation', 0, 'receiptNumber']).value;
            this.reportWindow.format = ReportFormat.PDF;
            this.reportWindow.open();
          }
        }
      });
    }
  }

  onEnterCreditDebitAmount(index) {
    const chargeInformation = (<NgcFormArray>this.form.get('chargeInformation')).value;
    var creditOrDebitTotalAmount = 0;
    var totalTaxComp1Amount = 0;
    var totalTaxComp2Amount = 0;
    var totalTaxComp3Amount = 0;
    var totalTransactionAmount = 0;

    if (chargeInformation.length > 0) {

      for (let i = 0; i < chargeInformation.length; i++) {
        const element = chargeInformation[i];


        if (!NgcUtility.isBlank(element.creditOrDebitAmount)) {
          var taxComp1Amount = 0;
          var taxComp2Amount = 0;
          var taxComp3Amount = 0;
          creditOrDebitTotalAmount += element.creditOrDebitAmount;
          var totalTaxRate = element.taxComp1Rate + element.taxComp2Rate + element.taxComp3Rate + 100.00;
          var transactionAmount = Number(((element.creditOrDebitAmount * 100) / totalTaxRate).toFixed(this.fractionScale));
          if (!NgcUtility.isBlank(element.taxComp1Rate)) {
            taxComp1Amount = Number(((element.taxComp1Rate / 100.00) * transactionAmount).toFixed(this.fractionScale));
            if (i == index) {
              this.form.get(['chargeInformation', index, 'crdbtaxComp1']).patchValue(taxComp1Amount);
            }
            totalTaxComp1Amount += taxComp1Amount;
          }
          if (!NgcUtility.isBlank(element.taxComp2Rate)) {
            taxComp2Amount = Number(((element.taxComp2Rate / 100.00) * transactionAmount).toFixed(this.fractionScale));
            if (i == index) {
              this.form.get(['chargeInformation', index, 'crdbtaxComp2']).patchValue(taxComp2Amount);
            }
            totalTaxComp2Amount += taxComp2Amount;
          }
          if (!NgcUtility.isBlank(element.taxComp3Rate)) {
            taxComp3Amount = Number(((element.taxComp3Rate / 100.00) * transactionAmount).toFixed(this.fractionScale));
            if (i == index) {
              this.form.get(['chargeInformation', index, 'crdbtaxComp3']).patchValue(taxComp3Amount);
            }
            totalTaxComp3Amount += taxComp3Amount;
          }
          if (i == index) {
            this.form.get(['chargeInformation', index, 'transactionAmount']).patchValue(transactionAmount);
            this.form.get(['chargeInformation', index, 'crdbtaxAmount']).patchValue(taxComp1Amount + taxComp2Amount + taxComp3Amount);
          }
          totalTransactionAmount += transactionAmount;
        }
      }

      var roundOffCreditOrDebitTotalAmountValue = Math.round(creditOrDebitTotalAmount)
      var roundOffValue = roundOffCreditOrDebitTotalAmountValue - creditOrDebitTotalAmount;
      this.form.get(['creditDebitAmountReason', 0, 'documentAmount']).patchValue(roundOffCreditOrDebitTotalAmountValue);
      this.form.get(['creditDebitAmountReason', 0, 'taxComp1']).patchValue(totalTaxComp1Amount);
      this.form.get(['creditDebitAmountReason', 0, 'taxComp2']).patchValue(totalTaxComp2Amount);
      this.form.get(['creditDebitAmountReason', 0, 'taxComp3']).patchValue(totalTaxComp3Amount);
      this.form.get(['creditDebitAmountReason', 0, 'totalGrossAmount']).patchValue(totalTransactionAmount);
      this.form.get(['creditDebitAmountReason', 0, 'roundOffDelta']).patchValue(roundOffValue);
      this.form.get(['creditDebitAmountReason', 0, 'totaltax']).patchValue(totalTaxComp1Amount + totalTaxComp2Amount + totalTaxComp3Amount);
      this.form.get(['paymentDetails', 0, 'tenderedAmount']).patchValue(roundOffCreditOrDebitTotalAmountValue);
      this.form.get(['creditDebitAmountReason', 0, 'amountToBeCollect']).patchValue(creditOrDebitTotalAmount);

    }
  }

  disableDropDown(event) {

    if (event) {
      this.form.get(['searchCreditDebitNoteData', 'awbNumber']).disable();
      this.form.get(['searchCreditDebitNoteData', 'hawbNumber']).disable();
      this.form.get(['searchCreditDebitNoteData', 'receiptNumberDropdown']).disable();
    } else {
      this.form.get(['searchCreditDebitNoteData', 'awbNumber']).enable();
      this.form.get(['searchCreditDebitNoteData', 'hawbNumber']).enable();
      this.form.get(['searchCreditDebitNoteData', 'receiptNumberDropdown']).enable();
    }
  }

  selectDropdown(event) {
    this.form.get('sendToIRN').patchValue(event.booleanParameter1);
  }

  onSelectMode(event, index) {
    if (event.code === 'PDACCOUNT') {
      if (NgcUtility.isBlank(this.form.get(['chargesPayment', 0, 'pdAccountNumber']).value)) {
        this.displayPDAccountDropdown = true;
      } else {
        this.form.get(['paymentDetails', index, 'pdNumber'])
          .patchValue(this.form.get(['chargesPayment', 0, 'pdAccountNumber']).value);
        this.form.get(['paymentDetails', index, 'pdBalance'])
          .patchValue(this.form.get(['chargesPayment', 0, 'pdBalance']).value);
      }
    }
  }

  onSave() {
    let returnBlock: boolean = false;
    this.form.validate();
    if (this.form.invalid === true) {
      this.showErrorMessage("billing.error.mandatory.fields");
      return;
    }

    const paymentDetail = this.form.get(['paymentDetails', 0]).value;

    if (NgcUtility.isBlank(paymentDetail.tenderedAmount)) {
      this.showErrorMessage("billing.credit.debit.amount.required");
      return;
    }

    if (paymentDetail.mode == 'PDACCOUNT' && NgcUtility.isBlank(paymentDetail.pdNumber)) {
      this.showErrorMessage("billing.select.PDAccount");
      return;
    }

    if (paymentDetail.mode == 'PDACCOUNT' && (paymentDetail.pdBalance < paymentDetail.tenderAmount)) {
      this.showErrorMessage("billing.pdAccountLowBalance");
      return;
    }
    this.resetFormMessages();
    var payCreditDebitNote = this.form.getRawValue();
    var creditDebitAmountReason = this.form.get(['creditDebitAmountReason', 0]).value;
    payCreditDebitNote.documentAmount = creditDebitAmountReason.documentAmount;
    payCreditDebitNote.taxComp1 = creditDebitAmountReason.taxComp1;
    payCreditDebitNote.taxComp2 = creditDebitAmountReason.taxComp2;
    payCreditDebitNote.taxComp3 = creditDebitAmountReason.taxComp3;
    payCreditDebitNote.documentRemark = creditDebitAmountReason.documentRemark;
    payCreditDebitNote.totalGrossAmount = creditDebitAmountReason.totalGrossAmount;
    payCreditDebitNote.roundOffDelta = creditDebitAmountReason.roundOffDelta;
    payCreditDebitNote.totaltax = creditDebitAmountReason.totaltax;
    payCreditDebitNote.amountToBeCollect = creditDebitAmountReason.amountToBeCollect;
    if (NgcUtility.isBlank(payCreditDebitNote.searchCreditDebitNoteData.receiptNumber)) {
      payCreditDebitNote.receiptNumber = payCreditDebitNote.searchCreditDebitNoteData.receiptNumberDropdown;
    } else {
      payCreditDebitNote.receiptNumber = payCreditDebitNote.searchCreditDebitNoteData.receiptNumber;

    }
    payCreditDebitNote.noteType = payCreditDebitNote.searchCreditDebitNoteData.noteType;
    payCreditDebitNote.customerId = this.customerIdForReference;

    payCreditDebitNote.chargeInformation = payCreditDebitNote.chargeInformation.filter(element => element.select == true);

    if (NgcUtility.isBlank(payCreditDebitNote.noteType)) {
      this.showErrorMessage("billing.note.type.required");
      return;
    }

    if (NgcUtility.isBlank(payCreditDebitNote.documentRemark)) {
      this.showErrorMessage("billing.credit.debit.amount.reason.required");
      return;
    }

    payCreditDebitNote.chargeInformation.forEach(element => {
      if (payCreditDebitNote.noteType == 'CREDIT NOTE' && element.billPaidAmount < element.creditOrDebitAmount) {
        this.showErrorMessage("billing.creditnote.cannot.be.greater.than.paid.amount");
        returnBlock = true;
        return;
      }
    });

    if (returnBlock) {
      return;
    }

    this.billingService.payCreditDebitNote(payCreditDebitNote).subscribe(result => {
      if (!this.showResponseErrorMessages(result) && !NgcUtility.isBlank(result.data)) {
        this.showSuccessStatus("g.operation.successful")
        this.form.get(['searchCreditDebitNoteData', 'receiptNumber']).patchValue(result.data.creditDebitNoteNumber);
        this.openreport = true;
        this.onSearch()
      }
    });
  }
  showCreditDebitAmountSection(index) {
    var chargeInfoList = this.form.get('chargeInformation').value.filter(element => element.select == true);
    if (chargeInfoList.length > 0) {
      this.CreditDebitAmountSectionFlag = true;
    } else {
      this.CreditDebitAmountSectionFlag = false;
    }
    if (!this.form.get(['chargeInformation', index, 'select']).value) {
      this.form.get(['chargeInformation', index, 'creditOrDebitAmount']).setValue(0);
      this.onEnterCreditDebitAmount(index);
    }

  }

  onSelectPDAccount(event, index) {
    this.form.get(['paymentDetails', index, 'pdBalance']).patchValue(event.param1);
  }

  changeLOVReadOnly(value) {
    console.log(value);
    if (value.desc == "Debit") {
      this.customerLovEditable = false;
    } else {
      this.customerLovEditable = true;

    }
  }

  changeCustomer(value) {
    this.customer = this.createSourceParameter(value.param1, Math.random().toString());
    this.customerIdForReference = value.param1;
    if (this.form.get(['paymentDetails', 0, 'payeeName']).value != value.desc) {

      // this.billingService.fetchCustomerTaxApplicability(this.customerIdForReference).subscribe(data => {
      //   if (!this.showResponseErrorMessages(data)) {
      //     this.taxComp1Rate = null;
      //     this.taxComp1Code = null;
      //     this.taxComp2Rate = null;
      //     this.taxComp2Code = null;
      //     this.taxComp3Rate = null;
      //     this.taxComp3Code = null;

      //     for (let index = 0; index < data.data.length; index++) {
      //       if (data.data[index].sequenceNo == 1) {
      //         this.taxComp1Code = data.data[index].salestaxType;
      //         this.taxComp1Rate = data.data[index].salesTaxPercentage;
      //       }
      //       if (data.data[index].sequenceNo == 2) {
      //         this.taxComp2Code = data.data[index].salestaxType;
      //         this.taxComp2Rate = data.data[index].salesTaxPercentage;
      //       }
      //       if (data.data[index].sequenceNo == 3) {
      //         this.taxComp3Code = data.data[index].salestaxType;
      //         this.taxComp3Rate = data.data[index].salesTaxPercentage;
      //       }

      //     }

      //     for (let index = 0; index < (<NgcFormArray>this.form.get(['chargeInformation'])).length; index++) {
      //       this.form.get(['chargeInformation', index, 'taxComp1Code']).setValue(this.taxComp1Code);
      //       this.form.get(['chargeInformation', index, 'taxComp2Code']).setValue(this.taxComp2Code);
      //       this.form.get(['chargeInformation', index, 'taxComp3Code']).setValue(this.taxComp3Code);
      //       this.form.get(['chargeInformation', index, 'taxComp1Rate']).setValue(this.taxComp1Rate);
      //       this.form.get(['chargeInformation', index, 'taxComp2Rate']).setValue(this.taxComp2Rate);
      //       this.form.get(['chargeInformation', index, 'taxComp3Rate']).setValue(this.taxComp3Rate);
      //       this.form.get(['chargeInformation', index, 'crdbtaxComp1']).patchValue(null);
      //       this.form.get(['chargeInformation', index, 'crdbtaxComp2']).patchValue(null);
      //       this.form.get(['chargeInformation', index, 'crdbtaxComp3']).patchValue(null);
      //     }

      //     console.log(this.form.get(['chargeInformation']).value);
      //     this.form.get(['chargeInformation']).value.forEach((charge, index) => {
      //       if (charge.select && charge.creditOrDebitAmount != null) {
      //         this.onEnterCreditDebitAmount(index);
      //       }
      //     });

      //   }
      // }, error => {

      // })

    }
    if (value.param2 != '') {
      this.form.get(['paymentDetails', 0, 'pdNumber'])
        .patchValue(value.param2);
      this.form.get(['paymentDetails', 0, 'pdBalance'])
        .patchValue(value.param3);
      this.form.get(['paymentDetails', 0, 'payeeName'])
        .patchValue(value.desc);
    }
  }

}

