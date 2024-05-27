import { ActivatedRoute, Router } from "@angular/router";
import { BillingReportsService } from "../billingReports.service";
import { NgcFormControl, NgcReportComponent } from "ngc-framework";
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
  selector: "app-uldAccounting",
  templateUrl: "./uldAccounting.component.html",
  styleUrls: ["./uldAccounting.component.scss"]
})
export class UldAccountingComponent extends NgcPage {
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

  private uldAccountingform: NgcFormGroup = new NgcFormGroup({
    dateFrom: new NgcFormControl("", Validators.required),
    dateTo: new NgcFormControl("", Validators.required),
    carriercode: new NgcFormControl()
  });

  generateuldreport() {
    let a: any;
    let b: any;
    let days: any;
    this.reportParameters = new Object();
    if (this.uldAccountingform.controls["dateFrom"].value && this.uldAccountingform.controls["dateTo"].value) {
      a = Math.abs(this.uldAccountingform.controls["dateFrom"].value.getTime() - this.uldAccountingform.controls["dateTo"].value.getTime());
      b = Math.ceil(a / (1000 * 3600 * 24));
      if (b > 62) {
        this.showErrorMessage('Billing.err.month');
      }
      else {
        this.reportParameters.tenantFromdate = NgcUtility.getDateAsString(
          this.uldAccountingform.controls["dateFrom"].value
        );
        this.reportParameters.tenantTodate = NgcUtility.getDateAsString(
          this.uldAccountingform.controls["dateTo"].value
        );
        this.reportParameters.fromdate = 
          this.uldAccountingform.controls["dateFrom"].value;
        
        this.reportParameters.todate = 
          this.uldAccountingform.controls["dateTo"].value;
        
        
        if (this.uldAccountingform.controls["carriercode"].value) {
          this.reportParameters.carriercode = this.uldAccountingform.controls["carriercode"].value;
          this.reportParameters.carrierflag = "1"
        }
        else {
          this.reportParameters.carrierflag = "0"
        }
        this.reportParameters.loginuser = this.getUserProfile().userShortName;
        this.reportWindow.open();
      }
    }
  }

  ngOnInit() { }
  backToHome(event) {
    this.router.navigate(['']);
  }
}
