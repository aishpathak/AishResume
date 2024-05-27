import {
  NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcDropDownComponent, NgcButtonComponent,
  NgcReportComponent, NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest, BaseResponse, PageConfiguration
} from "ngc-framework";
import { BuildupService } from '../../export/buildup/buildup.service';
import {
  Component, NgZone, ElementRef, OnInit,
  OnDestroy, ViewContainerRef, ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgcFormControl, NgcUtility, DateTimeKey } from "ngc-framework";
import { Validators } from '@angular/forms';
import { BillingService } from '../billing.service';
import { SapInvoiceCreditNote } from '../billing.sharedmodel';
import { SapInvCreditNoteListForAmount } from '../billing.sharedmodel';

@Component({
  selector: 'app-sapInvoiceCreditNote',
  templateUrl: './sapInvoiceCreditNote.component.html',
  styleUrls: ['./sapInvoiceCreditNote.component.css']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class SapInvoiceCreditNoteComponent extends NgcPage {

  resp: any;
  reportParam: any;
  selectedCustomer: any;
  reportFormat: any;
  InvoiceNo: any;
  CustId: any;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private billingService: BillingService, private router: Router,
    private activated: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  private sapInvoiceForm: NgcFormGroup = new NgcFormGroup({
    searchOptions: new NgcFormGroup({
      finSysInvoiceNumber: new NgcFormControl(),
      dateTimeFrom: new NgcFormControl(),
      dateTimeTo: new NgcFormControl(),
      customerId: new NgcFormControl(),
      esupportDocEmailSent: new NgcFormControl(),
    }),
    reportType: new NgcFormControl(),
    resultList: new NgcFormArray([])
  });


  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('invoiceReportWindow') invoiceReportWindow: NgcReportComponent;

  ngOnInit() {
  }

  getCustomerId(item) {
    this.selectedCustomer = item.param1;
  }

  searchInvoice(value: number) {
    if (value == 0) {
      // this.selectedCustomer = '';
      const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.sapInvoiceForm.get('searchOptions'));
      // Validate
      searchFormGroup.validate();
      // if invalid
      if (this.sapInvoiceForm.get(['searchOptions']).invalid) {
        this.showErrorMessage("", "billing.error.mandatory.fields");
        return;
      }

      if (!this.sapInvoiceForm.get('searchOptions').get('finSysInvoiceNumber').value &&
        !(this.sapInvoiceForm.get('searchOptions').get('dateTimeFrom').value && this.sapInvoiceForm.get('searchOptions').get('dateTimeTo').value) &&
        !this.sapInvoiceForm.get('searchOptions').get('customerId').value) {
        this.showErrorMessage("", "billing.error.customer");
        return;
      }


      (this.sapInvoiceForm.get('resultList') as NgcFormArray).resetValue([]);
      let search: SapInvoiceCreditNote = (this.sapInvoiceForm.get("searchOptions") as NgcFormGroup).getRawValue();
      // this.selectedCustomer = search.customerId;
      if (search.esupportDocEmailSent == "ALL") {
        search.esupportDocEmailSent = 1 + "";
      } else if (search.esupportDocEmailSent == "DOC Sent") {
        search.esupportDocEmailSent = 2 + "";
      } else if (search.esupportDocEmailSent == "Doc Not Sent") {
        search.esupportDocEmailSent = 3 + "";
      }
      this.billingService.fetchSapInvoice(search).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.resp = response.data;
          if (!this.resp.length) {
            this.showErrorStatus('billing.error.no.records.found');
          }
          (<NgcFormArray>this.sapInvoiceForm.get('resultList')).patchValue(this.resp);
        }
      }, error => {
        this.showErrorMessage(error);
      });
    }
  }

  sendAndUpdate(sitem, index) {
    let update: SapInvCreditNoteListForAmount = new SapInvCreditNoteListForAmount();
    update.finSysInvoiceNumber = sitem.value.finSysInvoiceNumber;
    update.customerId = sitem.value.customerId;
    this.billingService.updateSapInvoice(update).subscribe(response => {
      if (response.success) {
        this.resp = response.data;
        this.searchInvoice(0);
        this.showSuccessStatus("billing.sucess.mail");
      }
    }, error => {
      this.showErrorMessage(error);
    });
  }
  onSave() {
    let update = (this.sapInvoiceForm.get(["resultList"]) as NgcFormArray).getRawValue();
    console.log(update);
    this.billingService.updateIsVoid(update).subscribe(response => {
      if (response.success) {
        this.resp = response.data;
        this.searchInvoice(0);
        this.showSuccessStatus("billing.sucess.data");
      }
    }, error => {
      this.showErrorMessage(error);
    });
  }

  sendMail() {
    let update: SapInvCreditNoteListForAmount = new SapInvCreditNoteListForAmount();
    update.finSysInvoiceNumber = null;
    this.billingService.updateSapInvoice(update).subscribe(response => {
      if (response.success) {
        this.resp = response.data;
        this.searchInvoice(1);
        this.showSuccessStatus("billing.sucess.mail");
      }
    }, error => {
      this.showErrorMessage(error);
    });
  }

  downloadInvoice(item, index, sindex) {

    this.reportFormat = this.sapInvoiceForm.get(['resultList', index, 'sapInvCreditNoteList', sindex, 'reportType']).value;
    //this.InvoiceNo = this.sapInvoiceForm.get('searchOptions').get('finSysInvoiceNumber').value;
    //this.CustId = this.sapInvoiceForm.get('searchOptions').get('customerId').value;
    this.InvoiceNo = this.sapInvoiceForm.get(['resultList', index, 'sapInvCreditNoteList', sindex, 'finSysInvoiceNumber']).value;
    this.CustId = this.sapInvoiceForm.get(['resultList', index, 'sapInvCreditNoteList', sindex, 'customerId']).value;
    let parameters: any = {};
    parameters.InvoiceNo = this.InvoiceNo;
    parameters.CustId = this.CustId;
    this.invoiceReportWindow.reportParameters = parameters;
    this.invoiceReportWindow.downloadReport();
  }

  downloadSupportingDoc(item, index, sindex) {
    this.reportFormat = this.sapInvoiceForm.get(['resultList', index, 'sapInvCreditNoteList', sindex, 'reportType']).value;
    //this.InvoiceNo = this.sapInvoiceForm.get('searchOptions').get('finSysInvoiceNumber').value;
    //this.CustId = this.sapInvoiceForm.get('searchOptions').get('customerId').value;
    this.InvoiceNo = this.sapInvoiceForm.get(['resultList', index, 'sapInvCreditNoteList', sindex, 'finSysInvoiceNumber']).value;
    this.CustId = this.sapInvoiceForm.get(['resultList', index, 'sapInvCreditNoteList', sindex, 'customerId']).value;
    let parameters: any = {};
    parameters.InvoiceNo = this.InvoiceNo;
    parameters.CustId = this.CustId;
    this.reportWindow.reportParameters = parameters;
    this.reportWindow.downloadReport();
  }

  backToHome(event) {
    this.router.navigate(['']);
  }
}
