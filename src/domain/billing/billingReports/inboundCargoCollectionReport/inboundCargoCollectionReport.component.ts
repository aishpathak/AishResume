import { ActivatedRoute, Router } from '@angular/router';
import { BillingReportsService } from '../billingReports.service';
import { NgcFormControl, NgcReportComponent } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { ApplicationEntities } from '../../../common/applicationentities';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration
} from 'ngc-framework';

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

@Component({
  selector: 'app-inboundCargoCollectionReport',
  templateUrl: './inboundCargoCollectionReport.component.html',
  styleUrls: ['./inboundCargoCollectionReport.component.css']
})
export class InboundCargoCollectionReportComponent extends NgcPage {

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private billingReportsService: BillingReportsService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  reportParameters: any = new Object();
  today: any;
  private inboundCargoCollectionReportForm: NgcFormGroup = new NgcFormGroup({
    dateFrom: new NgcFormControl(null, Validators.required),
    dateTo: new NgcFormControl('', Validators.required),
    //timeFrom: new NgcFormControl('', Validators.required),
    //timeTo: new NgcFormControl('', Validators.required),
    customercode: new NgcFormControl(),
    terminalpoint: new NgcFormControl(),
    carrier: new NgcFormControl(),
    domIntl: new NgcFormControl()
  });

  ngOnInit() {
    this.today = new Date();
  }

  clear(event): void {
    this.inboundCargoCollectionReportForm.reset();
    this.resetFormMessages();
  }

  onBack(event) {
    this.navigateBack(this.inboundCargoCollectionReportForm.getRawValue());
  }

  onGenerateReport(type) {

    if (!this.inboundCargoCollectionReportForm.get('dateFrom').value) {
      this.showErrorMessage("billing.error.verified.mandatory");
    }

    else {
      this.InboundCargoCollectionReport(type);
      this.refreshFormMessages(type);
    }
  }

  InboundCargoCollectionReport(type) {
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_DomesticInternationalHandling)) {
      this.reportParameters.isDomIntEnable = true;
    }
    this.reportParameters.dateFrom = this.inboundCargoCollectionReportForm.get('dateFrom').value;
    // this.reportParameters.dateTo = NgcUtility.getDateTimeAsString(this.inboundCargoCollectionReportForm.get('dateTo').value);
    this.reportParameters.customercode = this.inboundCargoCollectionReportForm.get('customercode').value;
    this.reportParameters.terminalpoint = this.inboundCargoCollectionReportForm.get('terminalpoint').value;
    this.reportParameters.carrier = this.inboundCargoCollectionReportForm.get('carrier').value;
    this.reportParameters.domIntl = this.inboundCargoCollectionReportForm.get('domIntl').value;
    
    if (type == 'excel') {
      this.reportWindow1.downloadReport();
    } else if (type == 'pdf') {
      this.reportWindow.open();
    }
  }


}
