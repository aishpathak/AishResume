import { forEach } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';
import { BillingService } from './../billing.service';
import { NgcPage, NgcFormArray, NgcFormGroup, NgcFormControl, NgcReportComponent, ReportFormat, NgcWindowComponent, DateTimeKey, NgcUtility } from 'ngc-framework';
import { AwbManagementService } from './../../awbManagement/awbManagement.service';
import { Validators } from '@angular/forms';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { ApplicationEntities } from '../../common/applicationentities';

@Component({
  selector: 'app-list-of-invoices',
  templateUrl: './list-of-invoices.component.html',
  styleUrls: ['./list-of-invoices.component.scss']
})
export class ListOfInvoicesComponent extends NgcPage implements OnInit {
  @ViewChild("reportWindow1") reportWindow1: NgcReportComponent;
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  // @ViewChild("collectPaymentPopUpWindow")
  // popUpWindow: NgcWindowComponent
  resultFlag: boolean = false;
  handledbyHouse: any = [];
  handledbyHouseFlag: boolean = false;
  displayHouseDetail: boolean = false;
  invoicesList: any = [];
  invoicesObject: any = {};
  reportParam: any = new Object();
  reportParameters: any = new Object();
  transferData: any;
  private invoicesListForm = new NgcFormGroup({
    fetchInvoiceData: new NgcFormGroup({
      fromDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 30, DateTimeKey.DAYS),
        0, DateTimeKey.MINUTES), Validators.required),
      toDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59,
        DateTimeKey.MINUTES), Validators.required),
      customerName: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(),
      houseNumber: new NgcFormControl(),
      irnReceived: new NgcFormControl(),
      salesTaxSysPostingStatus: new NgcFormControl(),
      receiptNumber: new NgcFormControl()
    }),
    invoicesList: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        receiptNumber: new NgcFormControl(),
        receiptDate: new NgcFormControl(),
        counterNumber: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        houseNumber: new NgcFormControl(),
        consigneeCode: new NgcFormControl(),
        agentcode: new NgcFormControl(),
        payee: new NgcFormControl(),
        payeeCode: new NgcFormControl(),
        payeeName: new NgcFormControl(),
        pureAgent: new NgcFormControl(),
        paymentMode: new NgcFormControl(),
        paymentAccountNumber: new NgcFormControl(),
        paymentAmount: new NgcFormControl(),
        collectedBy: new NgcFormControl(),
        salesTaxSysPostingRefNo: new NgcFormControl(),
        salesTaxSysPostingStatus: new NgcFormControl(),
        salesTaxNumber: new NgcFormControl(),
        creditDebitNumber: new NgcFormArray([]),
        receiptId: new NgcFormControl(),
        documentAmount: new NgcFormControl(),
        irnstatus: new NgcFormControl(),
        ackNumber: new NgcFormControl(),
        ackDate: new NgcFormControl(),
        salesTaxSysPostingErrorDesc: new NgcFormControl()
      })
    ])
  })
  event: any;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private billingService: BillingService, private router: Router, private awbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }
  getListOfInvoices() {
    this.invoicesListForm.get(['fetchInvoiceData', 'fromDate']).updateValueAndValidity();
    this.invoicesListForm.get(['fetchInvoiceData', 'toDate']).updateValueAndValidity();

    if (this.invoicesListForm.invalid) {
      this.showErrorMessage('g.enter.mandatory.m');
      return;
    }

    var requestObj = this.invoicesListForm.getRawValue().fetchInvoiceData;

    if (NgcUtility.isBlank(requestObj.fromDate) &&
      NgcUtility.isBlank(requestObj.toDate) &&
      NgcUtility.isBlank(requestObj.customerName) &&
      NgcUtility.isBlank(requestObj.shipmentNumber) &&
      NgcUtility.isBlank(requestObj.houseNumber) &&
      NgcUtility.isBlank(requestObj.receiptNumber) &&
      NgcUtility.isBlank(requestObj.irnReceived)) {
      this.showErrorMessage('selectAtleastOneRecord');
      return;
    }
    this.resetFormMessages();
    this.resultFlag = false;
    this.billingService.getInvoicesList(requestObj).subscribe(data => {
      this.refreshFormMessages(data);
      this.invoicesList = data.data;
      if (this.invoicesList && this.invoicesList.length > 0) {
        if (data.data.length > 9999) {
          this.showInfoStatus('billing.invoices.records.more.than');
        }
        this.resultFlag = true;
        for (const eachRow of this.invoicesList) {
          eachRow['select'] = false;
        }
        this.invoicesListForm.get('invoicesList').patchValue(this.invoicesList);
      }
    }, error => {
      this.showErrorMessage('g.error' + error);
    })
  }

  onSendIRN = event => {
    if (this.invoicesListForm.get('invoicesList').value.filter(element => element.select == true).length == 0) {
      this.showErrorMessage('selectAtleastOneRecord');
    } else {
      var sendToIRNList = this.invoicesListForm.get('invoicesList').value
        .filter(element => element.select == true
          //&& element.salesTaxSysPostingRefNo == null
          //&& element.salesTaxSysPostingStatus != 'Pending'
          && element.salesTaxSysPostingStatus != 'Posted');
      if (sendToIRNList.length == 0) {
        this.showErrorMessage('CN46_03');
      } else {
        this.billingService.sendInvoiceToIRN(sendToIRNList).subscribe(data => {
          if (!this.showResponseErrorMessages(data)) {
            this.showSuccessStatus('g.completed.successfully');
            this.getListOfInvoices();
          }
        }, error => {

        });
      }
    }

  }
  onPrint = type => {
    var requestObj = this.invoicesListForm.getRawValue().fetchInvoiceData;

    if (requestObj.fromDate) {
      this.reportParam.dateFrom = NgcUtility.getDateTimeAsString(requestObj.fromDate);
    }
    if (requestObj.toDate) {
      this.reportParam.dateTo = NgcUtility.getDateTimeAsString(requestObj.toDate);
    }

    this.reportParam.PaymentReceiptId = requestObj.receiptId;
    this.reportParam.customerName = requestObj.customerName;
    this.reportParam.shipmentNumber = requestObj.shipmentNumber;
    this.reportParam.Number = requestObj.houseNumber;
    this.reportParam.irnReceived = requestObj.irnReceived;
    this.reportParam.salesTaxSysPostingStatus = requestObj.salesTaxSysPostingStatus;

    this.reportWindow1.reportParameters = this.reportParam;
    if (type == 'xls') {
      this.reportWindow1.format = ReportFormat.XLS;
      this.reportWindow1.downloadReport();
    }
  }
  onReprintInvoice() {
    if (this.invoicesListForm.get('invoicesList').value.filter(element => element.select == true).length > 1) {
      this.showErrorMessage("export.select.only.one.record");
    }
    if (this.invoicesListForm.get('invoicesList').value.filter(element => element.select == true).length == 0) {
      this.showErrorMessage('selectAtleastOneRecord');
    }
    if (this.invoicesListForm.get('invoicesList').value.filter(element => element.select == true).length == 1) {
      this.invoicesListForm.get('invoicesList').value.forEach(element => {
        if (element.select == true) {
          this.reportParam.PaymentReceiptId = element.receiptId;
          this.reportParam.receiptNumber = element.receiptNumber;
          this.reportParam.shipmentNumber = element.shipmentNumber;
          this.reportParam.Number = element.houseNumber;
          this.reportParam.ShipmentId = element.shipmentId;
          this.reportParam.ReferenceType = element.referenceType;
          this.reportParam.ReferenceId = element.shipmentServiceReferenceId;
          this.reportParam.shipmentHouseId = element.shipmentHouseId;
          this.reportParam.customerType = element.customerType;
          this.reportParam.Screen = "List_Of_Invoice";
          this.reportParam.pureAgent = element.pureAgent;
          this.reportParam.loginuser = this.getUserProfile().userShortName;
          this.reportWindow.reportParameters = this.reportParam;
          this.reportWindow.format = ReportFormat.PDF;
          this.reportWindow.open();
        }
      });
    }


  }
  onCreditDebitNoteList = event => {
    this.transferData = {
      fromDate: this.invoicesListForm.get(['invoicesList']).value.receiptNumber,
      toDate: this.invoicesListForm.get(['invoicesList']).value.receiptNumber
    }
    this.navigateTo(this.router, 'billing/listOfCreditDebitNote', this.transferData);
  }
  onLinkClick = event => {
    this.transferData = {
      shipment: event.record.shipmentNumber,
      hawbNumber: event.record.houseNumber,
      shipmentHouseId: event.record.shipmentHouseId
    }
    this.navigateTo(this.router, 'billing/collectPayment/enquireCharges', this.transferData);
  }

  irnInformation = event => {
    if (this.invoicesListForm.get(['fetchInvoiceData', 'irnReceived']).value == 'Y') {
      (<NgcFormControl>this.invoicesListForm.get(['fetchInvoiceData', 'fromDate'])).setValidators([Validators.required]);
      (<NgcFormControl>this.invoicesListForm.get(['fetchInvoiceData', 'toDate'])).setValidators([Validators.required]);
      (<NgcFormControl>this.invoicesListForm.get(['fetchInvoiceData', 'salesTaxSysPostingStatus'])).reset();
    } else {
      (<NgcFormControl>this.invoicesListForm.get(['fetchInvoiceData', 'fromDate'])).setValidators(null);
      (<NgcFormControl>this.invoicesListForm.get(['fetchInvoiceData', 'toDate'])).setValidators(null);
    }
  }

  checkHAWB(event, index) {
    let search = {
      shipmentNumber: this.invoicesListForm.get(['fetchInvoiceData', 'shipmentNumber']).value,
      shipment: this.invoicesListForm.get(['fetchInvoiceData', 'shipmentNumber']).value,
      shipmentType: 'AWB',
      appFeatures: null,
    }
    this.billingService.checkHandledByOrAccpByHouse(search).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data) {
          this.displayHouseDetail = true;
          this.handledbyHouse[index] = true;
        } else {
          this.handledbyHouse[index] = false;
        }
      }
    })
  }

  onClear(event) {
    this.resetFormMessages();
    this.invoicesListForm.reset();
  }
  onCancel(event) {
    this.resetFormMessages();
    this.invoicesList = [];
    this.resultFlag = false;
    this.navigateBack({});
  }

  onCreditDebitNote(group, index) {

    this.transferData = {
      receiptNumber: this.invoicesListForm.get(['invoicesList', group, 'creditDebitNumber']).value[index]
    }
    this.navigateTo(this.router, 'billing/creditDebitNote', this.transferData);
  }

  onTabOutCheckHandledBy(event) {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      let search = {
        shipmentNumber: this.invoicesListForm.get(['fetchInvoiceData', 'shipmentNumber']).value,
        shipment: this.invoicesListForm.get(['fetchInvoiceData', 'shipmentNumber']).value,
        shipmentType: 'AWB',
        appFeatures: null
      }
      if (event != null) {
        (<NgcFormControl>this.invoicesListForm.get(['fetchInvoiceData', 'fromDate'])).setValidators(null);
        (<NgcFormControl>this.invoicesListForm.get(['fetchInvoiceData', 'toDate'])).setValidators(null);
        this.invoicesListForm.get(['fetchInvoiceData', 'fromDate']).reset();
        this.invoicesListForm.get(['fetchInvoiceData', 'toDate']).reset();
      }
      this.billingService.checkHandledByOrAccpByHouse(search).subscribe(data => {
        this.handledbyHouseFlag = false;
        if (!this.showResponseErrorMessages(data)) {
          if (data) {
            this.handledbyHouseFlag = true;
            this.async(() => {
              try {
                (this.invoicesListForm.get('houseNumber') as NgcFormControl).focus();
              } catch (e) { }
            });
          }
        }
      })
    }
  }

  onTabOutinvoiceNumber(event) {
    console.log(event);
    if (event != null) {
      (<NgcFormControl>this.invoicesListForm.get(['fetchInvoiceData', 'fromDate'])).setValidators(null);
      (<NgcFormControl>this.invoicesListForm.get(['fetchInvoiceData', 'toDate'])).setValidators(null);
      this.invoicesListForm.get(['fetchInvoiceData', 'fromDate']).reset();
      this.invoicesListForm.get(['fetchInvoiceData', 'toDate']).reset();
    }
  }


}
