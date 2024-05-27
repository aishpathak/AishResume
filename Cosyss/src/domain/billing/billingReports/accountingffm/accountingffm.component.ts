import { ActivatedRoute, Router } from "@angular/router";
import { BillingReportsService } from "../billingReports.service";
import { NgcFormControl, NgcReportComponent, ReportFormat } from "ngc-framework";
import { Validators } from "@angular/forms";
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcWindowComponent,
  NgcButtonComponent,
  NgcUtility,
  NgcInputComponent,
  PageConfiguration
} from "ngc-framework";

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
@Component({
  selector: "app-accountingffm",
  templateUrl: "./accountingffm.component.html",
  styleUrls: ["./accountingffm.component.scss"]
})
export class AccountingffmComponent extends NgcPage {
  reportParameters: any;
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private billingReportsService: BillingReportsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private ffmchargesform: NgcFormGroup = new NgcFormGroup({
    dateFrom: new NgcFormControl("", Validators.required),
    dateTo: new NgcFormControl("", Validators.required),
    carriercode: new NgcFormControl()
  });

  ngOnInit() { }

  generateffmreport(type) {
    let a: any;
    let b: any;
    let days: any;
    this.reportParameters = new Object();
    if (this.ffmchargesform.controls["dateFrom"].value && this.ffmchargesform.controls["dateTo"].value) {
      a = Math.abs(this.ffmchargesform.controls["dateFrom"].value.getTime() - this.ffmchargesform.controls["dateTo"].value.getTime());
      b = Math.ceil(a / (1000 * 3600 * 24));
      if (b > 62) {
        this.showErrorMessage("Billing.err.month");
      }
      else {
        this.reportParameters.fromdate = this.ffmchargesform.controls[
          "dateFrom"
        ].value;
        this.reportParameters.tenantFromDate = NgcUtility.getDateAsString(this.ffmchargesform.controls[
          "dateFrom"
        ].value);
        this.reportParameters.tenantToDate = NgcUtility.getDateAsString(this.ffmchargesform.controls["dateTo"].value);
        this.reportParameters.todate = this.ffmchargesform.controls["dateTo"].value;
        if (this.ffmchargesform.controls["carriercode"].value) {
          this.reportParameters.CarrierCode = this.ffmchargesform.controls["carriercode"].value;
          this.reportParameters.carrierflag = "1"
        }
        else {
          this.reportParameters.carrierflag = "0";
          this.reportParameters.CarrierCode = null;
        }

        this.reportParameters.Loginuser = this.getUserProfile().userShortName;

        this.reportWindow.reportParameters = this.reportParameters;
        if (type == ReportFormat.XLS) {
          this.reportWindow.format = ReportFormat.XLS;
          this.reportWindow.downloadReport();
        } else if (type == ReportFormat.PDF) {
          this.reportWindow.format = ReportFormat.PDF;
          this.reportWindow.open();
        }
      }
    }


  }

  backToHome(event) {
    this.router.navigate(['']);
  }
}
