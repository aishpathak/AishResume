import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcContainerComponent, ReactiveModel
  , NgcReportComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomACESService } from '../customs.service';

@Component({
  selector: 'app-fax-hash-total',
  templateUrl: './fax-hash-total.component.html',
  styleUrls: ['./fax-hash-total.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class FaxHashTotalComponent extends NgcPage implements OnInit {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  resp: any;
  showTable: boolean;
  reportParameters: any = new Object();
  itfsFlag: boolean;
  onSearchFlag: boolean;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private customsService: CustomACESService) {
    super(appZone, appElement, appContainerElement);
  }


  private hashForm: NgcFormGroup = new NgcFormGroup({
    flightDate: new NgcFormControl(),
    flightNo: new NgcFormControl(),
    submissionVersion: new NgcFormControl(),
    customsFlightNumber: new NgcFormControl(),
    customsFlightDate: new NgcFormControl(),
    ata: new NgcFormControl(),
    std: new NgcFormControl(),
    byINT: new NgcFormControl(),
    byAMD: new NgcFormControl(),
    byLBS: new NgcFormControl(),
    submissionType: new NgcFormControl()
  })


  ngOnInit() {
  }

  /**
   * Retreive data for a particular flightkey and flightdate
   *
   */
  onSearch() {
    let request = this.hashForm.getRawValue();
    if (request.flightDate == null || request.flightDate == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.hashForm.get('flightDate'), "Mandatory");
    }
    if (request.flightNo == null || request.flightNo == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.hashForm.get('flightNo'), "Mandatory");
    }
    //disabling input fields
    this.onSearchFlag = true;
    this.customsService.searchFaxHashData(request).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data.data;

      if (!this.showResponseErrorMessages(data)) {
        if (this.resp != null) {
          this.hashForm.patchValue(this.resp);
          this.showTable = true;
          console.log(this.hashForm.get('customsFlightNumber').value);
          //checking for ITFS flight
          if (this.hashForm.get('customsFlightNumber').value != null) {
            this.itfsFlag = true;
          }
          else {
            this.itfsFlag = false;
          }
        }
        else {
          this.showTable = false;
        }
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  //Used for Selecting Submission type
  selectSubmissionType() {

    if (this.hashForm.get('byINT').value) {
      this.hashForm.get('submissionType').setValue('INT')
    }
    else
      if (this.hashForm.get('byAMD').value) {
        this.hashForm.get('submissionType').setValue('AMD')
      }
      else
        if (this.hashForm.get('byLBS').value) {
          this.hashForm.get('submissionType').setValue('LBS')
        }
        else {
          this.hashForm.get('submissionType').setValue(null)
          this.hashForm.get('submissionVersion').setValue(null)
        }
  }

  //Used for sending HST message for a particular version and submission type
  onSendHashTotal() {
    this.resetFormMessages();
    let paperManifestData = this.hashForm.getRawValue();
    if (paperManifestData.submissionType == null || paperManifestData.submissionType == '') {
      return this.showErrorMessage("hash.submission.type.mandatory");
    }
    if (paperManifestData.submissionVersion == null || paperManifestData.submissionVersion == '') {
      return this.showErrorMessage("hash.version.mandatory");
    }
    let response = paperManifestData;
    // this.customsService.sendHashTotal(response);
    this.showSuccessStatus("g.completed.successfully");

  }

  onreportcreation() {
    let paperManifestData = this.hashForm.getRawValue();
    //setting report parameters
    this.reportParameters = new Object();
    this.reportParameters.flightKey = paperManifestData.flightNo
    this.reportParameters.flightDate = paperManifestData.flightDate
    this.reportParameters.SubmissionType = paperManifestData.submissionType
    this.reportParameters.Version = paperManifestData.submissionVersion
    this.reportParameters.tenant = NgcUtility.getTenantConfiguration().airportCode;
    this.reportParameters.tenantId = NgcUtility.getTenantConfiguration().tenantId;
  }

  //Used for generating shipment level report
  onViewSubmissionChecklist() {
    this.resetFormMessages();
    let paperManifestData = this.hashForm.getRawValue();
    if (paperManifestData.submissionType == null || paperManifestData.submissionType == '') {
      return this.showErrorMessage("hash.submission.type.mandatory");
    }
    if (paperManifestData.submissionVersion == null || paperManifestData.submissionVersion == '') {
      return this.showErrorMessage("hash.version.mandatory");
    }
    this.onreportcreation();
    this.reportWindow.open();
  }
  //Used for generating ITFS Flight report
  onView() {
    this.resetFormMessages();
    let paperManifestData = this.hashForm.getRawValue();
    if (paperManifestData.submissionType == null || paperManifestData.submissionType == '') {
      return this.showErrorMessage("hash.submission.type.mandatory");
    }
    if (paperManifestData.submissionVersion == null || paperManifestData.submissionVersion == '') {
      return this.showErrorMessage("hash.version.mandatory");
    }

    this.onreportcreation();
    this.reportWindow1.open();
  }

  //Used for generating flight level report
  onPrint() {
    this.resetFormMessages();
    let paperManifestData = this.hashForm.getRawValue();
    if (paperManifestData.submissionType == null || paperManifestData.submissionType == '') {
      return this.showErrorMessage("hash.submission.type.mandatory");
    }
    if (paperManifestData.submissionVersion == null || paperManifestData.submissionVersion == '') {
      return this.showErrorMessage("hash.version.mandatory");
    }
    this.onreportcreation();
    this.reportWindow2.open();
  }


}
