import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, NgModule, ViewChild, Input } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration, NgcReportComponent } from 'ngc-framework';
import { ExportService } from '../export.service';
@Component({
  selector: 'app-auto-kc-target-monitoring',
  templateUrl: './auto-kc-target-monitoring.component.html',
  styleUrls: ['./auto-kc-target-monitoring.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class AutoKcTargetMonitoringComponent extends NgcPage {

  isTableFlag: boolean = false;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  reportParameters: any;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private route: ActivatedRoute, private router: Router, private exportService: ExportService) {
    super(appZone, appElement, appContainerElement);
  }

  public monitoringform: NgcFormGroup = new NgcFormGroup({
    year: new NgcFormControl(),
    month: new NgcFormControl(),
    terminalCode: new NgcFormControl(),

    autoKCMonitoringList: new NgcFormArray([

    ]),
  });
  ngOnInit() {
    super.ngOnInit();

  }

  fetchAutoKCMonitoringList() {
    let request = this.monitoringform.getRawValue();
    this.exportService.fetchAutoKCMonitoringList(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        if (response.data) {
          this.isTableFlag = true;
          this.monitoringform.get('autoKCMonitoringList').patchValue(response.data);
        }
      } else {
        this.isTableFlag = false;
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  downloadReport() {
    let parms = this.monitoringform.getRawValue();


    const reportParameters: any = {};
    reportParameters.year = parms.year.toString();
    if (parms.month == 1) {
      reportParameters.month = "Jan";
    } if (parms.month == 2) {
      reportParameters.month = "Feb";
    }
    if (parms.month == 3) {
      reportParameters.month = "Mar";
    }
    if (parms.month == 4) {
      reportParameters.month = "Apr";
    } if (parms.month == 5) {
      reportParameters.month = "May";
    }
    if (parms.month == 6) {
      reportParameters.month = "Jun";
    }
    if (parms.month == 7) {
      reportParameters.month = "Jul";
    } if (parms.month == 8) {
      reportParameters.month = "Aug";
    }
    if (parms.month == 9) {
      reportParameters.month = "Sep";
    }
    if (parms.month == 10) {
      reportParameters.month = "Oct";
    } if (parms.month == 11) {
      reportParameters.month = "Nov";
    }
    if (parms.month == 12) {
      reportParameters.month = "Dec";
    }
    if (parms.month == "" || parms.month == null) {
      reportParameters.month = null;
    }
    reportParameters.terminalCode = parms.terminalCode;
    this.reportParameters = reportParameters;
    this.reportWindow.downloadReport();

  }


  onPrint() {
    let parms = this.monitoringform.getRawValue();

    const reportParameters: any = {};
    reportParameters.year = parms.year.toString();
    if (parms.month == 1) {
      reportParameters.month = "Jan";
    } if (parms.month == 2) {
      reportParameters.month = "Feb";
    }
    if (parms.month == 3) {
      reportParameters.month = "Mar";
    }
    if (parms.month == 4) {
      reportParameters.month = "Apr";
    } if (parms.month == 5) {
      reportParameters.month = "May";
    }
    if (parms.month == 6) {
      reportParameters.month = "Jun";
    }
    if (parms.month == 7) {
      reportParameters.month = "Jul";
    } if (parms.month == 8) {
      reportParameters.month = "Aug";
    }
    if (parms.month == 9) {
      reportParameters.month = "Sep";
    }
    if (parms.month == 10) {
      reportParameters.month = "Oct";
    } if (parms.month == 11) {
      reportParameters.month = "Nov";
    }
    if (parms.month == 12) {
      reportParameters.month = "Dec";
    }
    if (parms.month == "" || parms.month == null) {
      reportParameters.month = null;
    }

    reportParameters.terminalCode = parms.terminalCode;
    this.reportParameters = reportParameters;
    this.reportWindow1.open();

  }

}
