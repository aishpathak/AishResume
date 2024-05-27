
import { NgcPage, NgcFormArray, NgcFormGroup, NgcFormControl, NgcReportComponent, ReportFormat, NgcWindowComponent, NgcUtility, PageConfiguration, DateTimeKey } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { BillingService } from '../../billing.service';
@Component({
  selector: 'app-pd-account-ledger',
  templateUrl: './pd-account-ledger.component.html',
  styleUrls: ['./pd-account-ledger.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class PdAccountLedgerComponent extends NgcPage implements OnInit {

  @ViewChild("reportWindow1")
  reportWindow1: NgcReportComponent;
  reportParameters: any;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private billingService: BillingService) {
    super(appZone, appElement, appContainerElement);
  }
  resultFlag: boolean = false;
  pdAccountTransactionList: any = [];
  customerId: any;
  customerShortName: any;
  pdAccountParams: any;
  private pdAccountTransactionListForm = new NgcFormGroup({
    agentId: new NgcFormControl(),
    agentCode: new NgcFormControl(),
    agentName: new NgcFormControl(),
    paymentAccountNumber: new NgcFormControl(),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    transactionType: new NgcFormControl(),
    pdAccountTransactionList: new NgcFormArray([
      new NgcFormGroup({
        sNo: new NgcFormControl(),
        documentType: new NgcFormControl(),
        documentName: new NgcFormControl(),
        customerCode: new NgcFormControl(),
        transactionDate: new NgcFormControl(),
        paymentAccountNumber: new NgcFormControl(),
        transactiontype: new NgcFormControl(),
        remarks: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        houseNumber: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        openingBalance: new NgcFormControl(),
        cdAmountWithOutTax: new NgcFormControl(),
        taxComp1: new NgcFormControl(),
        taxComp2: new NgcFormControl(),
        taxComp3: new NgcFormControl(),
        cdAmountWithTax: new NgcFormControl(),
        closingBalance: new NgcFormControl()
      })
    ])

  })

  ngOnInit() {
    this.pdAccountTransactionListForm.get('toDate').setValue(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES));
  }
  onSearch() {
    this.pdAccountTransactionListForm.validate();
    if (this.pdAccountTransactionListForm.invalid) {
      this.showErrorMessage('g.enter.mandatory.m');
      return;
    }
    var requestObj = this.pdAccountTransactionListForm.getRawValue();
    this.resetFormMessages();
    this.resultFlag = false;
    requestObj.agentName = requestObj.agentId;
    this.billingService.getPDAccountTransactions(requestObj).subscribe(data => {
      this.refreshFormMessages(data);
      this.pdAccountTransactionList = data.data;
      if (this.pdAccountTransactionList && this.pdAccountTransactionList.length > 0) {
        if (data.data.length > 9999) {
          this.showInfoStatus('billing.pd.records.more.than');
        }
        this.resultFlag = true;
        var sNo = 1;
        for (const eachRow of this.pdAccountTransactionList) {
          eachRow['sNo'] = sNo;
          sNo++;
        }
        this.pdAccountTransactionListForm.get('pdAccountTransactionList').patchValue(this.pdAccountTransactionList);
      }
    }, error => {
      this.showErrorMessage('Error:' + error);
    })
  }

  onPrint = type => {
    this.pdAccountTransactionListForm.validate();
    if (this.pdAccountTransactionListForm.invalid) {
      this.showErrorMessage('g.enter.mandatory.m');
      return;
    }
    this.reportParameters = new Object();
    this.reportParameters.agentName = this.pdAccountTransactionListForm.get('agentId').value;
    this.reportParameters.paymentAccountNumber = this.pdAccountTransactionListForm.get('paymentAccountNumber').value;
    this.reportParameters.fromDate = this.pdAccountTransactionListForm.get('fromDate').value;
    this.reportParameters.toDate = this.pdAccountTransactionListForm.get('toDate').value;
    this.reportParameters.transactionType = this.pdAccountTransactionListForm.get('transactionType').value;
    if (type == 'xls') {
      this.reportWindow1.format = ReportFormat.XLS;
      this.reportWindow1.downloadReport();
    }
    else {
      this.reportWindow1.format = ReportFormat.PDF;
      this.reportWindow1.open();
    }

  }
  onSelectAgent = agentId => {
    this.customerId = agentId;
    // this.customerShortName = event.
    this.pdAccountParams = {
      parameter1: this.customerId,
      parameter2: Math.random()
    }
    this.retrieveDropDownListRecords("PD_ACCOUNT_BY_AGENT", 'query', this.pdAccountParams).subscribe(response => {
      if (response.length > 0) {
        this.pdAccountTransactionListForm.get('paymentAccountNumber').setValue(response[0].code);
      }
    },
      error => {
      })
  }
  onClear = event => {
    this.resetFormMessages();
    this.pdAccountTransactionListForm.reset();
    this.resultFlag = false;
  }
  onCancel = event => {
    this.resetFormMessages();
    this.pdAccountTransactionList = [];
    this.resultFlag = false;
    this.navigateBack({});
  }
  getCustomerId(event) {
    this.pdAccountTransactionListForm.get('agentId').setValue(event.param1);
    this.pdAccountTransactionListForm.get('agentCode').setValue(event.code);
    this.pdAccountTransactionListForm.get('paymentAccountNumber').setValue(null);
    this.onSelectAgent(event.param1);

  }

  getCustomerIdByCode(event) {
    this.pdAccountTransactionListForm.get('agentId').setValue(event.param1);
    this.pdAccountTransactionListForm.get('agentName').setValue(event.desc);
    this.pdAccountTransactionListForm.get('paymentAccountNumber').setValue(null);
    this.onSelectAgent(event.param1);
  }
}


