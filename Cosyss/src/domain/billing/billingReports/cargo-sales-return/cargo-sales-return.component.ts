import { ActivatedRoute, Router } from '@angular/router';
import { BillingReportsService } from '../billingReports.service';
import { NgcFormControl, NgcUtility, NgcPage } from 'ngc-framework';
import { Validators } from '@angular/forms';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import {
  NgcFormGroup, NgcReportComponent,
  PageConfiguration
} from 'ngc-framework'

@Component({
  selector: 'app-cargo-sales-return',
  templateUrl: './cargo-sales-return.component.html',
  styleUrls: ['./cargo-sales-return.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class CargoSalesReturnComponent extends NgcPage {

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  @ViewChild('reportWindow')
  private reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1')
  private reportWindow1: NgcReportComponent;

  reportParam: any = new Object();

  private cargoSalesReturnReportForm: NgcFormGroup = new NgcFormGroup({
    transactionDate: new NgcFormControl('', Validators.required),
    carrier: new NgcFormControl(),
  });

  onGenerateReport(type) {
    if (NgcUtility.getDateOnly(this.cargoSalesReturnReportForm.get('transactionDate').value) != NgcUtility.getDateOnly(new Date())
      || NgcUtility.getDateOnly(this.cargoSalesReturnReportForm.get('transactionDate').value) < NgcUtility.getDateOnly(new Date())) {
      this.cargoSalesReturnReportForm.validate();
      if (this.cargoSalesReturnReportForm.valid) {
        let formValue = this.cargoSalesReturnReportForm.getRawValue();
        this.reportParam.carrier = formValue.carrier;
        this.reportParam.transDate = formValue.transactionDate;
        this.reportParam.displayTransDate = NgcUtility.getDateAsString(formValue.transactionDate);
        this.reportParam.userid = this.getUserProfile().userLoginCode;
        // alert(JSON.stringify(this.reportParam))
        if (type == 'excel') {
          this.reportWindow1.downloadReport();
        } else if (type == 'pdf') {
          this.reportWindow.open();
        }
      }
    } else {
      this.showFormControlErrorMessage(<NgcFormControl>this.cargoSalesReturnReportForm.get('fromDate'),
        'billing.error.maxdate');
    }
  }

}
