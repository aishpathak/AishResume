import { BillingReportsService } from "../billingReports.service";
import { NgcFormControl, NgcReportComponent, CellsRendererStyle } from "ngc-framework";
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
  PageConfiguration,
  NgcUtility
} from "ngc-framework";
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationEntities } from "../../../common/applicationentities";

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

@Component({
  selector: 'app-billingControlReports',
  templateUrl: './billingControlReports.component.html',
  styleUrls: ['./billingControlReports.component.css']
})

export class BillingControlReportsComponent extends NgcPage implements OnInit {
  @ViewChild("reportMCR")
  reportMCR: NgcReportComponent;
  @ViewChild("reportICCRCollect")
  reportICCRCollect: NgcReportComponent;
  @ViewChild("reportICCRCredit")
  reportICCRCredit: NgcReportComponent;
  @ViewChild("reportICCRBillByAirline")
  reportICCRBillByAirline: NgcReportComponent;
  @ViewChild("counterBankingSlipsWindow")
  counterBankingSlipsWindow: NgcReportComponent;
  @ViewChild("cargoSalesReturnReport")
  cargoSalesReturnReport: NgcReportComponent;
  @ViewChild("verifiedShiftClosure")
  verifiedShiftClosure: NgcReportComponent;

  constructor(
    appZone: NgZone,
    appElement: ElementRef, private router: Router, private activatedRoute: ActivatedRoute,
    appContainerElement: ViewContainerRef,
    private billingReportsService: BillingReportsService,
  ) {
    super(appZone, appElement, appContainerElement);
  }
  reportParameters: any = new Object();
  private billingControlReportForm: NgcFormGroup = new NgcFormGroup({
    verifiedDate: new NgcFormControl(),
    dateFrom: new NgcFormControl(),
    dateTo: new NgcFormControl(),
    reportType: new NgcFormControl(),
    airline: new NgcFormControl(),
    reportDetails: new NgcFormArray([])
  });

  showTable: boolean = false;

  public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    cellsStyle.data = row + 1;
    return cellsStyle;
  }

  ngOnInit() { }

  onGenerateReport() {
    let req: any = this.billingControlReportForm.getRawValue();
    this.billingReportsService.generateReport(req).subscribe(res => {
      if (!this.showResponseErrorMessages(res)) {
        this.showSuccessStatus('billing.success.report.generated.successfully');
        this.showTable = false;
      }
    }, err => {
      this.showTable = false;
      this.showErrorMessage('billing.error.system.is.down');
    })
  }

  pad(reportnumber) {
    while (reportnumber.length < 6) {
      reportnumber = "0" + reportnumber;
    }
    return reportnumber;
  }

  onSearch() {
    let req: any = this.billingControlReportForm.getRawValue();
    this.billingReportsService.searchVerifiedReports(req).subscribe(res => {
      if (!this.showResponseErrorMessages(res)) {
        if (res.data.reportDetails.length > 0) {
          for (let i = 0; i < res.data.reportDetails.length; i++) {
            var completeReportNo = "";
            var year = res.data.reportDetails[i].verifiedDate.toString().slice(0, 4);
            if (res.data.reportDetails[i].airline != null) {
              completeReportNo = res.data.reportDetails[i].airline + '-' + year + '-' + this.pad(res.data.reportDetails[i].reportNumber)
            } else {
              completeReportNo = this.pad(res.data.reportDetails[i].reportNumber)
            }
            res.data.reportDetails[i].numericReportNumber = res.data.reportDetails[i].reportNumber;
            res.data.reportDetails[i].reportNumber = completeReportNo;
          }
          this.billingControlReportForm.patchValue(res.data);
          this.showTable = true;
        } else {
          this.showTable = false;
        }
      }
    }, err => {
      this.showTable = false;
      this.showErrorMessage('billing.error.system.is.down');
    })
  }

  onLinkClick(event) {
    const record = event.record;
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_DomesticInternationalHandling)) {
      this.reportParameters.isDomIntEnable = true;
    }
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_House_Enable)) {
      this.reportParameters.isHawbEnable = true;
    }
    if (record.reportType === "MCR") {
      this.reportParameters.reportNumber = record.numericReportNumber;
      this.reportMCR.open();
    } else if (record.reportType === "ICCR Collect") {
      this.reportParameters.reportNumber = record.numericReportNumber;
      this.reportParameters.carrierCode = record.airline;
      this.reportICCRCollect.open();
    } else if (record.reportType === "ICCR Airline Credit") {
      this.reportParameters.reportNumber = record.numericReportNumber;
      this.reportParameters.carrierCode = record.airline;
      this.reportICCRCredit.open();
    } else if (record.reportType === "ICCR Bill By Airline") {
      this.reportParameters.reportNumber = record.numericReportNumber;
      this.reportParameters.carrierCode = record.airline;
      this.reportICCRBillByAirline.open();
    } else if (record.reportType === "Banking Slip") {
      this.reportParameters.reportNumber = record.numericReportNumber;
      this.counterBankingSlipsWindow.open();
    } else if (record.reportType === "Cargo Sales Return") {
      this.reportParameters.reportNumber = record.numericReportNumber;
      this.reportParameters.carrierCode = record.airline;
      this.cargoSalesReturnReport.open();
    } else if (record.reportType === "Verified Shift Closure") {
      this.reportParameters.reportNumber = record.numericReportNumber;
      this.verifiedShiftClosure.open();
    }

  }

  backToHome(event) {
    this.router.navigate(['']);
  }
}

