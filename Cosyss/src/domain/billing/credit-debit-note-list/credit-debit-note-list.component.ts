import { element } from 'protractor';
import { PageConfiguration, NgcUtility, DateTimeKey } from 'ngc-framework';
import { BillingService } from './../billing.service';
import { NgcPage } from 'ngc-framework';
import { NgcFormGroup, NgcReportComponent, NgcPrinterComponent } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgcFormArray, ReportFormat } from 'ngc-framework';
import { NgcFormControl } from 'ngc-framework';
import { ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { Component, OnInit, NgZone } from '@angular/core';
import { ApplicationEntities } from '../../common/applicationentities';
@Component({
  selector: 'app-credit-debit-note-list',
  templateUrl: './credit-debit-note-list.component.html',
  styleUrls: ['./credit-debit-note-list.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class CreditDebitNoteListComponent extends NgcPage implements OnInit {
  @ViewChild("reportWindow1")
  reportWindow1: NgcReportComponent;
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  reportParameters: any;
  @ViewChild('printerName')
  printerName: NgcPrinterComponent;
  constructor(appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private router: Router, private billingService: BillingService) {
    super(appZone, appElement, appContainerElement);
  }

  resultFlag: boolean = false;
  handledbyHouseFlag: boolean = false;
  creditDebitList: any = [];
  transferData: any;
  private creditDebitListForm = new NgcFormGroup({
    fromDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 30, DateTimeKey.DAYS),
      0, DateTimeKey.MINUTES), Validators.required),
    toDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59,
      DateTimeKey.MINUTES), Validators.required),
    customerName: new NgcFormControl(),
    printerName: new NgcFormControl(),
    irnReceived: new NgcFormControl(),
    invoiceNumber: new NgcFormControl(),
    documentNumber: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    houseNumber: new NgcFormControl(),
    creditDebitList: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        documentNumber: new NgcFormControl(),
        documentDate: new NgcFormControl(),
        documentAmount: new NgcFormControl(),
        taxComp1: new NgcFormControl(),
        taxComp2: new NgcFormControl(),
        taxComp3: new NgcFormControl(),
        // utgstAmount: new NgcFormControl(),
        transactionAmount: new NgcFormControl(),
        documentRemarks: new NgcFormControl(),
        issuedBy: new NgcFormControl(),
        irnNumber: new NgcFormControl(),
        invoiceNumber: new NgcFormControl(),
        payeeCode: new NgcFormControl(),
        payeeName: new NgcFormControl(),
        paymentAccountNumber: new NgcFormControl(),
        invoiceAmount: new NgcFormControl(),
        ShipmentId: new NgcFormControl(),
        ShipmentHouseId: new NgcFormControl(),
        customerType: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        houseNumber: new NgcFormControl(),
        irnCode: new NgcFormControl(),
        ackNumber: new NgcFormControl(),
        ackDate: new NgcFormControl()
      })
    ])
  })

  ngOnInit() {
  }
  getCreditDebitNoteList() {
    this.creditDebitListForm.validate();
    this.creditDebitListForm.get('fromDate').updateValueAndValidity();
    this.creditDebitListForm.get('toDate').updateValueAndValidity();
    if ((<NgcFormGroup>this.creditDebitListForm).invalid) {
      this.showErrorMessage('g.enter.mandatory.m');
      return;
    }
    var requestObj: any = {};
    this.resultFlag = false;
    requestObj.fromDate = this.creditDebitListForm.get('fromDate').value;
    requestObj.toDate = this.creditDebitListForm.get('toDate').value;
    requestObj.customerName = this.creditDebitListForm.get('customerName').value;
    requestObj.irnReceived = this.creditDebitListForm.get('irnReceived').value;
    requestObj.invoiceNumber = this.creditDebitListForm.get('invoiceNumber').value;
    requestObj.documentNumber = this.creditDebitListForm.get('documentNumber').value;
    requestObj.shipmentNumber = this.creditDebitListForm.get('shipmentNumber').value;
    requestObj.houseNumber = this.creditDebitListForm.get('houseNumber').value;
    this.resetFormMessages();
    this.billingService.getCreditDebitList(requestObj).subscribe(data => {
      this.refreshFormMessages(data);
      this.creditDebitList = data.data;
      if (this.creditDebitList && this.creditDebitList.length > 0) {
        if (data.data.length > 9999) {
          this.showInfoStatus('billing.invoices.records.more.than');
        }
        this.resultFlag = true;

        for (const eachRow of this.creditDebitList) {
          eachRow['select'] = 'false';
        }
        this.creditDebitListForm.get('creditDebitList').patchValue(this.creditDebitList);
      }
    }, error => {
      this.showErrorStatus("Error:" + error);
    })
  }
  onSendIRN = event => {
    if (this.creditDebitListForm.get(['creditDebitList']).value.filter((element) => element.select == true).length == 0) {
      this.showErrorMessage('selectAtleastOneRecord')
    }
    if (this.creditDebitListForm.get(['creditDebitList']).value.filter((element) => element.select == true && element.sendToIRN == false).length > 0) {
      this.showErrorMessage('billing.cheque.bounce.records.cannot.be.posted');
    }
    if (this.creditDebitListForm.get(['creditDebitList']).value.filter(element => element.select == true && element.irnStatus == 'Posted').length > 0) {
      var postedList = this.creditDebitListForm.get(['creditDebitList']).value.filter(element => element.select == true && element.irnStatus == 'Posted' && element.sendToIRN == true);
      for (let eachRow of postedList) {
        let placeHolders: any = [];
        placeHolders[0] = eachRow['documentNumber'];
        this.showInfoStatus(NgcUtility.translateMessage("billing.irn.message.already.received.for", placeHolders));
      }
    }
    // if (this.creditDebitListForm.get(['creditDebitList']).value.filter(element => element.select == true && element.irnNumber == null && element.sendToIRN == true && element.irnStatus == 'Pending').length > 0) {
    //   var pendingList = this.creditDebitListForm.get(['creditDebitList']).value.filter(element => element.select == true && element.irnStatus == 'Pending' && element.irnNumber == null);
    //   for (let eachRow of pendingList) {
    //     let placeHolders: any = [];
    //     placeHolders[0] = eachRow['documentNumber'];
    //     this.showInfoStatus(NgcUtility.translateMessage("billing.irn.message.already.requested.for", placeHolders));
    //   }
    // }

    if (this.creditDebitListForm.get(['creditDebitList']).value.filter(element => element.select == true && element.irnStatus != 'Posted' && element.sendToIRN == true)) {
      var irnList = this.creditDebitListForm.get(['creditDebitList']).value.filter(element => element.select == true && element.sendToIRN == true && element.irnStatus != 'Posted');

      // for (let eachRow of irnList) {
      //  if (eachRow['documentNumber'].substr(0, 2) == 'CN') {
      //     eachRow['irnStatus'] = 'Pending';
      //   } else {
      //     eachRow['irnStatus'] = 'Not Required';
      //   }
      // }

      this.billingService.sendToIRN(irnList).subscribe(data => {
        if (data.data) {
          this.showSuccessStatus('billing.irn.info.request.successful');
          this.getCreditDebitNoteList();
        }
      }, error => {

      })
    }
  }
  onReprintCreditDebit(event) {
    if (this.creditDebitListForm.get(['creditDebitList']).value.filter((element) => element.select == true).length == 0) {
      this.showErrorMessage('selectAtleastOneRecord')
      return;
    }
    if (this.creditDebitListForm.get(['creditDebitList']).value.filter(element => element.select == true).length > 1) {
      this.showErrorMessage('billing.select.only.one.record.for.reprint');
      return;
    }
    var creditDebitList = this.creditDebitListForm.get(['creditDebitList']).value.filter(element => element.select == true)
    this.reportParameters = new Object();
    this.reportParameters.paymentReceiptId = creditDebitList[0].paymentReceiptId;
    this.reportParameters.ShipmentId = creditDebitList[0].shipmentId;
    this.reportParameters.HouseId = creditDebitList[0].shipmentHouseId;
    this.reportParameters.customerType = creditDebitList[0].customerType;
    this.reportParameters.documentNumber = creditDebitList[0].documentNumber;
    this.reportParameters.invoiceNumber = creditDebitList[0].invoiceNumber;
    this.reportParameters.shipmentNumber = creditDebitList[0].shipmentNumber;
    this.reportParameters.houseNumber = creditDebitList[0].houseNumber;
    this.reportWindow1.format = ReportFormat.PDF;
    this.reportWindow1.open();
  }

  onCreditDebitNote = event => {
    if (this.creditDebitListForm.get(['creditDebitList']).value.filter((element) => element.select == true).length == 0) {
      this.showErrorMessage('selectAtleastOneRecord')
      return;
    }
    if (this.creditDebitListForm.get(['creditDebitList']).value.filter(element => element.select == true).length > 1) {
      this.showErrorMessage('export.select.only.one.record');
      return;
    }
    this.transferData = {
      receiptNumber: this.creditDebitListForm.get(['creditDebitList']).value.filter(element => element.select == true)[0].documentNumber
    }
    this.navigateTo(this.router, 'billing/creditDebitNote', this.transferData);
  }
  onPrint = type => {
    if (this.resultFlag) {
      this.reportParameters = new Object();
      this.reportParameters.fromDate = this.creditDebitListForm.get('fromDate').value;
      this.reportParameters.toDate = this.creditDebitListForm.get('toDate').value;
      this.reportParameters.customerName = this.creditDebitListForm.get('customerName').value;
      this.reportParameters.irnReceived = this.creditDebitListForm.get('irnReceived').value;
      this.reportParameters.invoiceNumber = this.creditDebitListForm.get('invoiceNumber').value;
      this.reportParameters.documentNumber = this.creditDebitListForm.get('documentNumber').value;
      this.reportParameters.shipmentNumber = this.creditDebitListForm.get('shipmentNumber').value;
      this.reportParameters.houseNumber = this.creditDebitListForm.get('houseNumber').value;
      if (type == 'xls') {
        this.reportWindow.format = ReportFormat.XLS;
        this.reportWindow.downloadReport();
      }
    }
  }
  onClear = event => {
    this.resetFormMessages();
    this.creditDebitListForm.reset();
  }
  onCancel = event => {
    this.resetFormMessages();
    this.creditDebitList = [];
    this.resultFlag = false;
    this.navigateBack({});

  }
  onLinkCreditDebit(event) {
    var creditDebitList = this.creditDebitListForm.get(['creditDebitList']).value
    this.reportParameters = new Object();
    this.reportParameters.paymentReceiptId = creditDebitList[event.record.NGC_ROW_ID].paymentReceiptId;
    this.reportParameters.ShipmentId = creditDebitList[event.record.NGC_ROW_ID].shipmentId;
    this.reportParameters.HouseId = creditDebitList[event.record.NGC_ROW_ID].shipmentHouseId;
    this.reportParameters.customerType = creditDebitList[event.record.NGC_ROW_ID].customerType;
    this.reportParameters.documentNumber = creditDebitList[event.record.NGC_ROW_ID].documentNumber;
    this.reportParameters.invoiceNumber = creditDebitList[event.record.NGC_ROW_ID].invoiceNumber;
    this.reportWindow1.format = ReportFormat.PDF;
    this.reportWindow1.open();
  }
  irnInformation = event => {
    if (this.creditDebitListForm.get('irnReceived').value == 'Y') {
      (<NgcFormControl>this.creditDebitListForm.get('fromDate')).setValidators([Validators.required]);
      (<NgcFormControl>this.creditDebitListForm.get('toDate')).setValidators([Validators.required]);
    } else {
      (<NgcFormControl>this.creditDebitListForm.get('fromDate')).setValidators(null);
      (<NgcFormControl>this.creditDebitListForm.get('toDate')).setValidators(null);
    }
  }
  onTabOutinvoiceNumber(event) {
    if (event != null) {
      (<NgcFormControl>this.creditDebitListForm.get('fromDate')).setValidators(null);
      (<NgcFormControl>this.creditDebitListForm.get('toDate')).setValidators(null);
      this.creditDebitListForm.get('fromDate').reset();
      this.creditDebitListForm.get('toDate').reset();
    }
  }
  onTabOutCheckHandledBy(event) {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      let search = {
        shipmentNumber: this.creditDebitListForm.get('shipmentNumber').value,
        shipment: this.creditDebitListForm.get('shipmentNumber').value
      }
      if (event != null) {
        (<NgcFormControl>this.creditDebitListForm.get('fromDate')).setValidators(null);
        (<NgcFormControl>this.creditDebitListForm.get('toDate')).setValidators(null);
        this.creditDebitListForm.get('fromDate').reset();
        this.creditDebitListForm.get('toDate').reset();
      }
      this.billingService.checkHandledByOrAccpByHouse(search).subscribe(data => {
        this.handledbyHouseFlag = false;
        if (!this.showResponseErrorMessages(data)) {
          if (data) {
            this.handledbyHouseFlag = true;
            this.async(() => {
              try {
                (this.creditDebitListForm.get('houseNumber') as NgcFormControl).focus();
              } catch (e) { }
            });
          }
        }
      })
    }
  }
}
