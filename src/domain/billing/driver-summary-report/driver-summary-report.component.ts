import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormControl, ReactiveModel, NgcDropDownComponent, NgcReportComponent, NgcDropDownListComponent, NgcFormArray } from 'ngc-framework';
import { BillingService } from '../billing.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-driver-summary-report',
  templateUrl: './driver-summary-report.component.html',
  styleUrls: ['./driver-summary-report.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class DriverSummaryReportComponent extends NgcPage {

  reportParameters: any = new Object();
  searchFlag: boolean = false;

  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @ViewChild("reportWindowExcel") reportWindowExcel: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private billingService: BillingService, private activatedRoute: ActivatedRoute, private route: ActivatedRoute,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {

  }

  private form: NgcFormGroup = new NgcFormGroup({
    driverCode: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    driverDetail: new NgcFormArray([])
  })

  onSearch() {
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    const req = this.form.getRawValue();
    this.billingService.getDriverDetail(req).subscribe(data => {
      if (data.data) {
        this.searchFlag = true;
        this.refreshFormMessages(data);
        this.form.get('driverDetail').patchValue(data.data);
      }
      else {
        this.searchFlag = false;
        this.showErrorMessage("billing.error.no.records.found");
      }
    })
  }

  onPrint() {
    this.form.validate();
    if (this.form.invalid) {
      return;
    }

    if (this.searchFlag) {
      if (this.form.get('driverCode').value) {
        this.reportParameters.driverCode = this.form.get('driverCode').value;
        this.reportParameters.drvrFlg = '1';
      }
      else {
        this.reportParameters.driverCode = null;
        this.reportParameters.drvrFlg = '0';
      }
      if (this.form.get('awbNumber').value) {
        this.reportParameters.awbNumber = this.form.get('awbNumber').value;
      } else {
        this.reportParameters.awbNumber = null;
      }
      this.reportParameters.fromDate = this.form.get('fromDate').value;
      this.reportParameters.toDate = this.form.get('toDate').value;

      this.reportParameters.printBy = this.getUserProfile().userShortName;
    }
    else {
      this.reportParameters.driverCode = null;
      this.reportParameters.drvrFlg = '0';
      this.reportParameters.awbNumber = null;
      this.reportParameters.fromDate = null;
      this.reportParameters.toDate = null;
      this.reportParameters.printBy = this.getUserProfile().userShortName;

    }
    this.reportWindow.open();
  }

  onExportToExcel() {
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    if (this.form.get('driverCode').value) {
      this.reportParameters.driverCode = this.form.get('driverCode').value;
      this.reportParameters.drvrFlg = '1';
    }
    else {
      this.reportParameters.driverCode = null;
      this.reportParameters.drvrFlg = '0';
    }
    if (this.form.get('awbNumber').value) {
      this.reportParameters.awbNumber = this.form.get('awbNumber').value;
    } else {
      this.reportParameters.awbNumber = null;
    }
    this.reportParameters.fromDate = this.form.get('fromDate').value;
    this.reportParameters.toDate = this.form.get('toDate').value;
    this.reportParameters.printBy = this.getUserProfile().userShortName;
    this.reportWindowExcel.reportParameters = this.reportParameters;
    this.reportWindowExcel.downloadReport();
  }

}
