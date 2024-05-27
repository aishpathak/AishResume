import { ActivatedRoute, Router } from '@angular/router';
import { BillingReportsService } from '../billingReports.service';
import { NgcFormControl } from 'ngc-framework';
import { ApplicationEntities } from '../../../common/applicationentities';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcReportComponent,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration
} from 'ngc-framework';

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

@Component({
  selector: 'app-shortCollectionReport',
  templateUrl: './shortCollectionReport.component.html',
  styleUrls: ['./shortCollectionReport.component.css']
})
export class ShortCollectionReportComponent extends NgcPage {

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private billingReportsService: BillingReportsService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  @ViewChild('reportWindow')
  private reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1')
  private reportWindow1: NgcReportComponent;

  private shortCollectionReportForm: NgcFormGroup = new NgcFormGroup({
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    customer: new NgcFormControl(),
    delivered: new NgcFormControl(),
    shipped: new NgcFormControl(),
    domIntl: new NgcFormControl()
  });

  reportParam: any = new Object();

  ngOnInit() {
    super.ngOnInit();
  }

  onGenerateReport(type) {
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_DomesticInternationalHandling)) {
      this.reportParam.isDomIntEnable = true;
    }
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_House_Enable)) {
      this.reportParam.isHawbEnable = true;
    }
    
    if (NgcUtility.dateDifference(this.shortCollectionReportForm.get('fromDate').value,
      this.shortCollectionReportForm.get('toDate').value) <= 0) {
      this.shortCollectionReportForm.validate();
      if (this.shortCollectionReportForm.valid) {
        let formValue = this.shortCollectionReportForm.getRawValue();
        if (formValue.delivered) {
          this.reportParam.impExpFlag = 'IMP';
        } else if (formValue.shipped) {
          this.reportParam.impExpFlag = 'EXP';
        } else {
          this.reportParam.impExpFlag = 'ALL';
        }
        this.reportParam.fromDate = NgcUtility.getDateTimeAsString(this.shortCollectionReportForm.get('fromDate').value);
        this.reportParam.toDate = NgcUtility.getDateTimeAsString(this.shortCollectionReportForm.get('toDate').value);
        this.reportParam.tenantfromDate = this.shortCollectionReportForm.get('fromDate').value;
        this.reportParam.tenanttoDate = this.shortCollectionReportForm.get('toDate').value;
        this.reportParam.custId = this.shortCollectionReportForm.get('customer').value;
        this.reportParam.domIntl = this.shortCollectionReportForm.get('domIntl').value;
        
        //alert(JSON.stringify(this.reportParam));

        if (type == 'excel') {
          this.reportWindow1.downloadReport();
        } else if (type == 'pdf') {
          this.reportWindow.open();
        }
      }
    } else {
      this.showFormControlErrorMessage(<NgcFormControl>this.shortCollectionReportForm.get('fromDate'),
        'billing.error.maxdate');
    }
  }

  backToHome(event) {
    this.router.navigate(['']);
  }
}
