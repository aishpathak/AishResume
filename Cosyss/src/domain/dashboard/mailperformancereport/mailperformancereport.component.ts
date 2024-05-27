import {
  Component,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild,
  OnInit
} from '@angular/core';
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcUtility,
  NgcButtonComponent, PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-mailperformancereport',
  templateUrl: './mailperformancereport.component.html',
  styleUrls: ['./mailperformancereport.component.scss']
})
export class MailperformancereportComponent extends NgcPage implements OnInit {
  reportParameters: any;
  constructor(appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private service: DashboardService,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;

  public mailPerformanceReportform: NgcFormGroup = new NgcFormGroup({
    fromDate: new NgcFormControl(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),

  });

  getPerofrmancereport() {
    let date1 = this.mailPerformanceReportform.get('fromDate').value;
    this.reportParameters = new Object();
    this.reportParameters.fromDate = NgcUtility.getDateAsString(date1);

    this.reportWindow.reportParameters = this.reportParameters;

    this.reportWindow.downloadReport();

  }
  onCancel(event) {
    this.mailPerformanceReportform.reset();
    this.navigateHome();
  }


}
