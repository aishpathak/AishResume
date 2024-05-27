import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormControl, ReactiveModel, NgcDropDownComponent, NgcReportComponent, NgcUtility, NgcDropDownListComponent, DateTimeKey } from 'ngc-framework';
import { BillingService } from '../billing.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EquipmentReleaseInfo } from '../../equipment/equipmentsharedmodel';

@Component({
  selector: 'app-ngc-regular-report',
  templateUrl: './ngc-regular-report.component.html',
  styleUrls: ['./ngc-regular-report.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class NgcRegularReportComponent extends NgcPage {
  public reportWidth: number;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private billingService: BillingService, private activatedRoute: ActivatedRoute, private route: ActivatedRoute,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.resizeReport();
  }

  private form: NgcFormGroup = new NgcFormGroup({
    report: new NgcFormControl(),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    carrier: new NgcFormControl(),
    flight: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    totalRowCount: new NgcFormControl()
  })

  onPrint() {
    const req = this.form.getRawValue();
    if (req.toDate == null && req.report == null && req.fromDate == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.form.get('toDate'), 'g.mandatory');
      this.showFormControlErrorMessage(<NgcFormControl>this.form.get('report'), 'g.mandatory');
      this.showFormControlErrorMessage(<NgcFormControl>this.form.get('fromDate'), 'g.mandatory');
      return;
    }
    else if (req.toDate == null && req.report == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.form.get('report'), 'g.mandatory');
      this.showFormControlErrorMessage(<NgcFormControl>this.form.get('toDate'), 'g.mandatory');
      return;
    }
    else if (req.fromDate == null && req.toDate == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.form.get('fromDate'), 'g.mandatory');
      this.showFormControlErrorMessage(<NgcFormControl>this.form.get('toDate'), 'g.mandatory');
      return;
    }
    else if (req.fromDate == null && req.report == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.form.get('fromDate'), 'g.mandatory');
      this.showFormControlErrorMessage(<NgcFormControl>this.form.get('report'), 'g.mandatory');
      return;
    }
    let a: any;
    let b: any;
    let days: any;
    if (req.fromDate && req.toDate) {
      a = Math.abs(req.toDate.getTime() - req.fromDate.getTime());
      b = Math.ceil(a / (1000 * 3600 * 24));
      if (b > 30) {
        this.showFormControlErrorMessage(<NgcFormControl>this.form.get('fromDate'), 'billing.error.date.range.high');
        this.showFormControlErrorMessage(<NgcFormControl>this.form.get('toDate'), 'billing.error.date.range.high');
        return;
      }
    }

    this.billingService.getReport(req).subscribe(response => {
      if (response.data) {
        this.refreshFormMessages(response);
        let reportData: any = response.data;
        if (req.report == 'Import CASS Report(T)') {
          NgcUtility.saveCSV("Import CASS Report(T)" + NgcUtility.getDateAsString(req.fromDate) + "/" + NgcUtility.getDateAsString(req.toDate) + ".txt", reportData.reportInfo);
        }
        else if (req.report == 'Import CASS Report(E)') {
          NgcUtility.saveCSV("Import CASS Report(E)" + NgcUtility.getDateAsString(req.fromDate) + "/" + NgcUtility.getDateAsString(req.toDate) + ".xls", reportData.reportInfo);
        }
        else if (req.report == 'Airline Tonnage(I)') {
          NgcUtility.saveCSV("AIRLINE TONNAGE(I)" + NgcUtility.getDateAsString(req.fromDate) + "/" + NgcUtility.getDateAsString(req.toDate) + ".xls", reportData.reportInfo);
        }
        else if (req.report == 'Airline Tonnage(E)') {
          NgcUtility.saveCSV("Airline Tonnage(E)" + NgcUtility.getDateAsString(req.fromDate) + "/" + NgcUtility.getDateAsString(req.toDate) + ".xls", reportData.reportInfo);
        }
        else if (req.report == 'Tonnage Report') {
          NgcUtility.saveCSV("TONNAGE REPORT" + NgcUtility.getDateAsString(req.fromDate) + "/" + NgcUtility.getDateAsString(req.toDate) + ".xls", reportData.reportInfo);
        }
        else if (req.report == 'Manifest Report') {
          NgcUtility.saveCSV("MANIFEST REPORT" + NgcUtility.getDateAsString(req.fromDate) + "/" + NgcUtility.getDateAsString(req.toDate) + ".xls", reportData.reportInfo);
        }
        else {
          if ((reportData.reportOutput === 'EXCEL')) {
            NgcUtility.saveCSV(req.report + NgcUtility.getDateAsString(req.fromDate) + "/" + NgcUtility.getDateAsString(req.toDate) + ".xls", reportData.reportInfo);
          } else {
            NgcUtility.saveCSV(req.report + NgcUtility.getDateAsString(req.fromDate) + "/" + NgcUtility.getDateAsString(req.toDate) + ".txt", reportData.reportInfo);
          }
        }
      }
      else {
        this.showErrorMessage("billing.error.no.records.found");
      }

    })

  }

  public onResize(event) {
    this.resizeReport();
  }

  resizeReport() {
    if (window.innerWidth <= 1725 || window.innerWidth >= 1200) {
      this.reportWidth = window.innerWidth * 0.32;
    }
    else this.reportWidth = 600;
  }
}
