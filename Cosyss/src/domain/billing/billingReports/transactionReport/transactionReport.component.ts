import { ActivatedRoute, Router } from "@angular/router";
import { BillingReportsService } from "../billingReports.service";
import { NgcFormControl, NgcReportComponent, ReportFormat } from "ngc-framework";
import { Validators } from "@angular/forms";
import { ApplicationEntities } from '../../../common/applicationentities';
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
  selector: "app-transactionReport",
  templateUrl: "./transactionReport.component.html",
  styleUrls: ["./transactionReport.component.css"]
})
export class TransactionReportComponent extends NgcPage {
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
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
  private transactionReportForm: NgcFormGroup = new NgcFormGroup({
    dateFrom: new NgcFormControl("", Validators.required),
    dateTo: new NgcFormControl("", Validators.required),
    timeFrom: new NgcFormControl(),
    timeTo: new NgcFormControl(),
    customerCode: new NgcFormControl(),
    airline: new NgcFormControl(),
    chargeGroup: new NgcFormControl(),
    chargeCode: new NgcFormControl(),
    terminalcode: new NgcFormControl(),
    counter: new NgcFormControl(),
    process: new NgcFormControl(),
    domIntl: new NgcFormControl()
  });

  ngOnInit() { }

  clear(event): void {
    this.transactionReportForm.reset();
    this.resetFormMessages();
  }

  onBack(event) {
    this.navigateBack(this.transactionReportForm.getRawValue());
  }

  onGenerateReport(type) {
    this.transactionReportForm.validate();
    if (this.transactionReportForm.invalid) {
      return;
    } else {
      if (
        NgcUtility.dateDifference(
          this.transactionReportForm.get("dateFrom").value,
          this.transactionReportForm.get("dateTo").value
        ) <= 0
      ) {
        this.transactionReportForm.validate();
      } else {
        this.showFormControlErrorMessage(
          <NgcFormControl>this.transactionReportForm.get("dateFrom"),
          "billing.error.maxdate"
        );
        return;
      }
    }
    this.onTransactionReportgenerateReport(type);
  }
  onTransactionReportgenerateReport(type) {
    const reportParameters: any = {};
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_DomesticInternationalHandling)) {
      reportParameters.isDomIntEnable = true;
    }
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_House_Enable)) {
      reportParameters.isHawbEnable = true;
    }
    reportParameters.dateFrom = NgcUtility.getDateTimeAsString(this.transactionReportForm.get('dateFrom').value);
    reportParameters.dateTo = NgcUtility.getDateTimeAsString(this.transactionReportForm.get('dateTo').value);
    reportParameters.customerCode = this.transactionReportForm.get(
      "customerCode"
    ).value;
    reportParameters.airline = this.transactionReportForm.get(
      "airline"
    ).value;
    reportParameters.chargeCode = this.transactionReportForm.get(
      "chargeCode"
    ).value;
    reportParameters.terminalcode = this.transactionReportForm.get(
      "terminalcode"
    ).value;
    reportParameters.counter = this.transactionReportForm.get(
      "counter"
    ).value;
    reportParameters.process = this.transactionReportForm.get(
      "process"
    ).value;
    reportParameters.domIntl = this.transactionReportForm.get('domIntl').value;
    
    this.reportWindow.reportParameters = reportParameters;
    if (type == ReportFormat.XLS) {
      this.reportWindow.format = ReportFormat.XLS;
      this.reportWindow.downloadReport();
    } else {
      this.reportWindow.format = ReportFormat.PDF;
      this.reportWindow.open();
    }
  }

  backToHome(event) {
    this.router.navigate(['']);
  }
}
