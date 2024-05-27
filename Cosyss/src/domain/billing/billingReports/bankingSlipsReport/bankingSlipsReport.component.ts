import { ActivatedRoute, Router } from '@angular/router';
import { BillingReportsService } from '../billingReports.service';
import { NgcFormControl } from 'ngc-framework';
import { Validators } from '@angular/forms';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcReportComponent,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration
} from 'ngc-framework';

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

@Component({
  selector: 'app-bankingSlipsReport',
  templateUrl: './bankingSlipsReport.component.html',
  styleUrls: ['./bankingSlipsReport.component.css']
})
export class BankingSlipsReportComponent extends NgcPage {

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private billingReportsService: BillingReportsService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  @ViewChild('reportWindow')
  private reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1')
  private reportWindow1: NgcReportComponent;

  private bankingSlipsReportForm: NgcFormGroup = new NgcFormGroup({
    // fromDate: new NgcFormControl('', Validators.required),
    // toDate: new NgcFormControl('', Validators.required),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    transactionDate: new NgcFormControl('', Validators.required),
    paymentMode: new NgcFormControl(),
  });

  reportParam: any = new Object();

  ngOnInit() {
    super.ngOnInit();
  }

  onGenerateReport(type) {
    if (NgcUtility.getDateOnly(this.bankingSlipsReportForm.get('transactionDate').value) != NgcUtility.getDateOnly(new Date())
      || NgcUtility.getDateOnly(this.bankingSlipsReportForm.get('transactionDate').value) < NgcUtility.getDateOnly(new Date())) {
      this.bankingSlipsReportForm.validate();
      if (this.bankingSlipsReportForm.valid) {
        let formValue = this.bankingSlipsReportForm.getRawValue();
        // if (formValue.paymentMode) {
        //   this.reportParam.payFlag = '1';
        //   this.reportParam.paymentMode = formValue.paymentMode;
        // } else {
        //   this.reportParam.payFlag = '0';
        //   this.reportParam.paymentMode = '';
        // }
        // this.reportParam.fromDate = NgcUtility.getDateTimeAsString(this.bankingSlipsReportForm.get('transactionDate').value);
        // this.reportParam.toDate = NgcUtility.getDateTimeAsString(this.bankingSlipsReportForm.get('transactionDate').value);
        this.reportParam.paymentType = formValue.paymentMode;
        this.reportParam.transactionDate = formValue.transactionDate;
        this.reportParam.displayTransDate = NgcUtility.getDateAsString(formValue.transactionDate);
        // alert(JSON.stringify(this.reportParam))
        if (type == 'excel') {
          this.reportWindow1.downloadReport();
        } else if (type == 'pdf') {
          this.reportWindow.open();
        }
      }
    } else {
      this.showFormControlErrorMessage(<NgcFormControl>this.bankingSlipsReportForm.get('fromDate'),
        'billing.error.maxdate');
    }
  }
}
