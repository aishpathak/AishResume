import {
  NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcDropDownComponent, NgcButtonComponent,
  NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest, BaseResponse, PageConfiguration, UserProfile,
  NgcUtility, DateTimeKey, ReactiveModel, NgcFileUploadComponent, NgcReportComponent, NgcFileDownloadComponent
} from "ngc-framework";



import {
  Component, NgZone, ElementRef, OnInit,
  OnDestroy, ViewContainerRef, ViewChild
} from "@angular/core";

import { NgcFormControl } from "ngc-framework";
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { BillingService } from '../billing.service';
import { AirlineTonnageReport } from '../billing.sharedmodel';
//import { UploadDocumentModel, FileUploadModel, FileUploadDocumentModel, UploadDocumentAWBValidationModel } from '../../common/common.sharedmodel';


@Component({
  selector: 'app-airlineTonnageReport',
  templateUrl: './airlineTonnageReport.component.html',
  styleUrls: ['./airlineTonnageReport.component.css']
})



@PageConfiguration({
  //functionId: "BILLING_SERVICE_REQUEST",
  trackInit: true,
  callNgOnInitOnClear: true
})
export class AirlineTonnageReportComponent extends NgcPage {
  [x: string]: any;
  months: any;
  resp: any;
  //entityKey: any;
  record: any;
  showTable: boolean = false;

  @ViewChild('viewWindow') selectWindow: NgcWindowComponent;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  @ViewChild('reportWindow3') reportWindow3: NgcReportComponent;
  @ViewChild('reportWindow4') reportWindow4: NgcReportComponent;
  @ViewChild('reportWindow5') reportWindow5: NgcReportComponent;
  @ViewChild('reportWindow6') reportWindow6: NgcReportComponent;
  @ViewChild('reportWindow7') reportWindow7: NgcReportComponent;
  @ViewChild('reportWindow8') reportWindow8: NgcReportComponent;
  @ViewChild('reportWindow9') reportWindow9: NgcReportComponent;
  @ViewChild('reportWindow10') reportWindow10: NgcReportComponent;
  @ViewChild('reportWindow11') reportWindow11: NgcReportComponent;
  @ViewChild('uploadReportFormWindow') uploadReportFormWindow: NgcWindowComponent;



  reportParameters: any = new Object();

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private billingService: BillingService, private router: Router,
    private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  private tonnageReportForm: NgcFormGroup = new NgcFormGroup({

    //uploadedDocId: new NgcFormControl(Math.random() * 100000000000000),
    uploadedDocId: new NgcFormControl(),
    searchOp: new NgcFormGroup({
      month: new NgcFormControl(''),
      year: new NgcFormControl('', Validators.required),
      carrierCode: new NgcFormControl('', Validators.required),

    }),
    resultList: new NgcFormArray([])
  });

  private viewForm: NgcFormGroup = new NgcFormGroup({
    reportName: new NgcFormControl(),
    reportOutputId: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    //uploadedDocId: new NgcFormControl(Math.random() * 100000000000000),
    uploadedDocId: new NgcFormControl(),
    entityKey: new NgcFormControl(),
    entityType: new NgcFormControl(),
    entityDate: new NgcFormControl()
  });

  private uploadReportForm: NgcFormGroup = new NgcFormGroup({
    reportName: new NgcFormControl(),
    reportOutputId: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    uploadedDocId: new NgcFormControl(),
    entityKey: new NgcFormControl(),
    entityType: new NgcFormControl(),
    entityDate: new NgcFormControl(),
    year: new NgcFormControl(),
    month: new NgcFormControl(),
    entityKeyForNewUpload: new NgcFormControl(),
    entityDateForNewUpload: new NgcFormControl()
  });

  ngOnInit() {

  }



  /**
           * On Search of Function
           *
           * @param event Event
           */
  private searchRecords() {
    const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.tonnageReportForm.get('searchOp'));
    // Validate
    searchFormGroup.validate();
    // if invalid
    if (this.tonnageReportForm.get(['searchOp']).invalid) {
      this.showErrorMessage("", "billing.error.mandatory.fields");
      return;
    }
    let search: AirlineTonnageReport = (this.tonnageReportForm.get("searchOp") as NgcFormGroup).getRawValue();
    (this.tonnageReportForm.get('resultList') as NgcFormArray).resetValue([]);
    this.billingService.getReportsList(search).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.resetFormMessages();
        this.resp = new Array();
        this.resp = response.data;
        this.showTable = true;
        (<NgcFormArray>this.tonnageReportForm.get('resultList')).patchValue(this.resp);
      } else {
        this.refreshFormMessages(response);
      }
    });
  }

  activeStatus(event, index) {
    let update: AirlineTonnageReport = this.tonnageReportForm.get(['resultList', index]).value;
    update.status = 'publish';
    this.billingService.updateStatus(update).subscribe(response => {
      if (response.success) {
        this.resp = response.data;
        this.searchRecords();
      }
    }, error => {
      this.showErrorMessage(error);
    });

  }

  updateVoidStatus(event, index) {
    let update: AirlineTonnageReport = this.tonnageReportForm.get(['resultList', index]).value;
    update.status = 'void';

    this.billingService.updateStatus(update).subscribe(response => {
      if (response.success) {
        this.resp = response.data;
        this.searchRecords();
      }
    }, error => {
      this.showErrorMessage(error);
    });
  }

  updatePublishStatus(event, index) {
    let update: AirlineTonnageReport = this.tonnageReportForm.get(['resultList', index]).value;
    update.status = 'publish';
    this.billingService.updateStatus(update).subscribe(response => {
      if (response.success) {
        this.resp = response.data;
        this.searchRecords();
      }
    }, error => {
      this.showErrorMessage(error);
    });
  }

  // getUploadData(event, index) {
  //   this.uploadedDocIdValue = event[0].uploadDocId;
  // }


  uploadFunc(item, index) {

    let fetch: AirlineTonnageReport = this.tonnageReportForm.get(['resultList', index]).value;
    //this.entityKey = fetch.carrierCode;

    this.billingService.fetchRecord(fetch).subscribe(response => {
      if (response.success) {
        this.resp = response.data;
      }
      this.viewForm.patchValue(this.resp);

    }, error => {
      this.showErrorMessage(error);
    });


    this.selectWindow.open();
    //this.onSave(item);

  }


  public getReferenceId(): string {
    //return String(this.tonnageReportForm.get('uploadedDocId').value);
    //console.log(String(Math.trunc(this.tonnageReportForm.get('uploadedDocId').value)));
    return String(this.tonnageReportForm.controls.uploadedDocId);
    //return (String(Math.trunc(this.tonnageReportForm.get('uploadedDocId').value)));

  }

  onSave(event) {

    let req = new AirlineTonnageReport();
    req.uploadedDocId = this.viewForm.get('uploadedDocId').value;
    req.reportOutputId = this.viewForm.get('reportOutputId').value;
    req.entityType = this.viewForm.get('entityType').value;
    req.entityKey = this.viewForm.get('entityKey').value;
    req.entityDate = this.viewForm.get('entityDate').value;
    console.log(req);
    this.billingService.updateId(req).subscribe(response => {
      if (response.success) {
        this.resp = response.data;
        this.showSuccessStatus('billing.success.uploaded.successfully')
      }
    }, error => {
      this.showErrorMessage(error);
    });
  }

  onGenerateReport() {
    this.resetFormMessages();
    this.tonnageReportForm.validate();
    if (this.tonnageReportForm.invalid) {
      return;
    }
    this.onreportcreation();
  }


  onreportcreation() {
    //if (this.tonnageReportForm.get('reportType').value === 'GHA I/E') {
    var m = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    let parms = this.tonnageReportForm.get(['searchOp']).value;
    this.reportParameters = new Object();
    this.reportParameters.Month = m[parseInt(parms.month) - 1];
    this.reportParameters.Year = parms.year;
    this.reportParameters.Carrier = parms.carrierCode;
    console.log(this.reportParameters);
    this.reportWindow.downloadReport();
    this.reportWindow1.downloadReport();
    this.reportWindow2.downloadReport();
    this.reportWindow3.downloadReport();
    this.reportWindow4.downloadReport();
    this.reportWindow5.downloadReport();
    this.reportWindow10.downloadReport();
    this.reportWindow11.downloadReport();
    this.ontonnagerereportcreation();

    //
  }

  public ontonnagerereportcreation() {
    var m = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    let parms = this.tonnageReportForm.get(['searchOp']).value;
    this.reportParameters = new Object();
    this.reportParameters.month = m[parseInt(parms.month) - 1];
    this.reportParameters.year = parms.year;
    this.reportParameters.carrier = parms.carrierCode;
    this.reportParameters.tenantID = NgcUtility.getTenantConfiguration().airportCode;
    this.reportWindow6.downloadReport();
    this.reportWindow7.downloadReport();
    this.reportWindow8.downloadReport();
    this.reportWindow9.downloadReport();


  }
  backToHome(event) {
    this.router.navigate(['']);
  }

  openPopup() {
    // this.uploadReportForm.reset();
    let parms = this.tonnageReportForm.get(['searchOp']).value;
    if (parms.year && parms.carrierCode) {
      this.uploadReportForm.get('year').patchValue(parms.year);
      this.uploadReportForm.get('month').patchValue(parms.month);
      this.uploadReportForm.get('carrierCode').patchValue(parms.carrierCode);
    }
    this.uploadReportFormWindow.open();
  }

  onCarrierCode(event) {
    let req = new AirlineTonnageReport();
    req.carrierCode = this.uploadReportForm.get('carrierCode').value;
    req.entityType = this.uploadReportForm.get('carrierCode').value;
    req.year = this.uploadReportForm.get('year').value;
    req.month = this.uploadReportForm.get('month').value;
    this.billingService.fetchEntityForNewUpload(req).subscribe(response => {
      if (response.success) {
        this.uploadReportForm.get('entityKeyForNewUpload').patchValue(response.data.entityKeyForNewUpload);
        this.uploadReportForm.get('entityDateForNewUpload').patchValue(response.data.entityDateForNewUpload);
        this.uploadReportForm.get('entityType').patchValue(this.uploadReportForm.get('carrierCode').value);
        this.uploadReportForm.get('entityDate').patchValue(response.data.entityDate);
      }
    }, error => {
      this.showErrorMessage(error);
    });

  }

  onSaveTonnageDoc() {
    let req = new AirlineTonnageReport();
    req.entityType = this.uploadReportForm.get('carrierCode').value;
    req.status = 'Pending';
    req.carrierCode = this.uploadReportForm.get('carrierCode').value;
    req.entityKey = this.uploadReportForm.get('entityKeyForNewUpload').value;
    req.entityDateForNewUpload = this.uploadReportForm.get('entityDateForNewUpload').value;
    req.templateId = this.uploadReportForm.get('reportName').value;
    this.billingService.saveTonnageDoc(req).subscribe(response => {
      if (response.success) {
        this.resp = response.data;
        this.uploadReportForm.get('entityKeyForNewUpload').patchValue(null);
        this.uploadReportForm.get('entityDate').patchValue(null);
        this.uploadReportForm.get('entityKey').patchValue(null);
        this.showSuccessStatus('billing.success.uploaded.successfully')
      }
    }, error => {
      this.showErrorMessage(error);
    });
  }
}
