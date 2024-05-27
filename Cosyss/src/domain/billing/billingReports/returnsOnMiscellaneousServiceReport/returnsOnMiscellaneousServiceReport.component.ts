import { ActivatedRoute, Router } from "@angular/router";
import { BillingReportsService } from "../billingReports.service";
import { NgcFormControl, NgcReportComponent } from "ngc-framework";
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
  NgcDropDownComponent,
  NgcInputComponent,
  PageConfiguration
} from "ngc-framework";


@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
@Component({
  selector: "app-returnsOnMiscellaneousServiceReport",
  templateUrl: "./returnsOnMiscellaneousServiceReport.component.html",
  styleUrls: ["./returnsOnMiscellaneousServiceReport.component.css"]
})
export class ReturnsOnMiscellaneousServiceReportComponent extends NgcPage {
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  @ViewChild("reportWindow1")
  reportWindow1: NgcReportComponent;
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

  reportParameters: any = new Object();
  today: any;

  private returnsOnMiscellaneousServiceReportForm: NgcFormGroup = new NgcFormGroup(
    {
      dateFrom: new NgcFormControl("", Validators.required),
      dateTo: new NgcFormControl("", Validators.required),
      //timeFrom: new NgcFormControl("", Validators.required),
      //timeTo: new NgcFormControl("", Validators.required),
      //airline: new NgcFormControl(),
      chargeGroup: new NgcFormControl(),
      chargeCode: new NgcFormControl(),
      terminalcode: new NgcFormControl(),
      process: new NgcFormControl("", Validators.required),
      domIntl: new NgcFormControl() 
    }
  );

  ngOnInit() { 
    this.today =  new Date();
  }

  clear(event): void {
    this.returnsOnMiscellaneousServiceReportForm.reset();
    this.resetFormMessages();
  }

  onBack(event) {
    this.navigateBack(
      this.returnsOnMiscellaneousServiceReportForm.getRawValue()
    );
  }

  onGenerateReport(type) {
    this.returnsOnMiscellaneousServiceReportForm.validate();
      // const today = new Date();
    //   if (this.returnsOnMiscellaneousServiceReportForm.invalid) {
    //    return;
    //  } else {
    //     if (
    //       NgcUtility.dateDifference(
    //         this.returnsOnMiscellaneousServiceReportForm.get("dateFrom").value,
    //         this.returnsOnMiscellaneousServiceReportForm.get("dateTo").value
    //       ) <= 0
    //     ) {
    //       this.returnsOnMiscellaneousServiceReportForm.validate();
    //     } else {
    //       this.showFormControlErrorMessage(
    //         <NgcFormControl>(
    //           this.returnsOnMiscellaneousServiceReportForm.get("dateFrom")
    //         ),
    //         "From Date cannot be more than To Date"
    //       );
    //     }
    //   }
    this.ReturnsOnMiscellaneousServiceReport(type);
  }

  ReturnsOnMiscellaneousServiceReport(type) {
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_DomesticInternationalHandling)) {
      this.reportParameters.isDomIntEnable = true;
    }
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_House_Enable)) {
      this.reportParameters.isHawbEnable = true;
    }
    this.reportParameters.tenantDateFrom = NgcUtility.getDateAsString(this.returnsOnMiscellaneousServiceReportForm.get('dateFrom').value) + " 00:00:00";
    this.reportParameters.dateFrom = this.returnsOnMiscellaneousServiceReportForm.get('dateFrom').value;
    //  this.reportParameters.dateTo = NgcUtility.getDateAsString(this.returnsOnMiscellaneousServiceReportForm.get('dateTo').value) + " 23:59:59";
    //this.reportParameters.airline = this.returnsOnMiscellaneousServiceReportForm.get('airline').value;
    this.reportParameters.chargeGroup = this.returnsOnMiscellaneousServiceReportForm.get(
      "chargeGroup"
    ).value;
    this.reportParameters.chargeCode = this.returnsOnMiscellaneousServiceReportForm.get(
      "chargeCode"
    ).value;
    this.reportParameters.terminalcode = this.returnsOnMiscellaneousServiceReportForm.get(
      "terminalcode"
    ).value;
    //this.reportParameters.counter = this.returnsOnMiscellaneousServiceReportForm.get('counter').value;
    this.reportParameters.process = this.returnsOnMiscellaneousServiceReportForm.get(
      "process"
    ).value;
    
    this.reportParameters.domIntl = this.returnsOnMiscellaneousServiceReportForm.get('domIntl').value;
    
    this.reportParameters.reportTitle = NgcUtility.translateMessage('billing.return.of.mis.hyphen', null);
    if (this.reportParameters.process === 'E') {
    this.reportParameters.reportTitle = this.reportParameters.reportTitle + NgcUtility.translateMessage('export.export', null);
    }  else if (this.reportParameters.process === 'I') {
  this.reportParameters.reportTitle = this.reportParameters.reportTitle + NgcUtility.translateMessage('warehouse.import', null);
    } else {
    this.reportParameters.reportTitle = this.reportParameters.reportTitle + NgcUtility.translateMessage('billing.other', null);
}
    console.log(JSON.stringify(this.reportParameters))
    if (type == 'excel') {
      this.reportWindow1.downloadReport();
    } else if (type == 'pdf') {
      this.reportWindow.open();
    }
  }
}
