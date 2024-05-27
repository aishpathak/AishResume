import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, DateTimeKey, NgcReportComponent, NgcFormArray, NgcWindowComponent, PageConfiguration } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { TracingService } from '../tracing.service';
import { SearchTracingRecord } from '../tracing.shared'
import { ActivatedRoute, Router } from '@angular/router';
import { TracingListReqObj, TracingListResponseObj } from '../tracing.shared';


@Component({
  selector: 'app-generate-tracing-report',
  templateUrl: './generate-tracing-report.component.html',
  styleUrls: ['./generate-tracing-report.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class GenerateTracingReportComponent extends NgcPage implements OnInit {
  @ViewChild('windowData') windowData: NgcWindowComponent;
  resp: any;
  carrierGroupCodeParam: any;
  importStaff: boolean = false;
  exportStaff: boolean = false;
  locationInformationData: any;
  carrier: any;
  request: any;
  searchFlag: any = false;
  locationArray: any;
  reportParameters: any;
  private form: NgcFormGroup = new NgcFormGroup({
    carrierGroupCode: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    fromDate: new NgcFormControl(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 7, DateTimeKey.DAYS)),
    toDate: new NgcFormControl(NgcUtility.getCurrentDateOnly()),
    justifiable: new NgcFormControl(),
    justifiableCaseFlag: new NgcFormControl('Both'),
    tracingLocationList: new NgcFormArray([]),
  });
  carrierCode: any;

  @ViewChild('reportWindow') reportWindow: NgcReportComponent; s
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private tracingService: TracingService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }

  onCarierGroup(event) {
    this.carrier = event.desc;
    this.carrierGroupCodeParam = this.createSourceParameter(this.form.get('carrierGroupCode').value);

  }

  exportToExcel() {
    this.reportParameters = new Object();
    if (this.form.get('carrierCode').value) {
      this.reportParameters.carrierCode = this.form.get('carrierCode').value;
    }
    else {
      this.reportParameters.carrierCode = null;
    }
    this.reportParameters.carrierGroupCode = this.carrier;

    if (this.form.get('fromDate').value && !this.form.get('toDate').value) {
      this.reportParameters.onlyFromDate = this.form.get('fromDate').value;
    } else {
      this.reportParameters.onlyFromDate = null;
    }
    if (!this.form.get('fromDate').value && this.form.get('toDate').value) {
      this.reportParameters.onlyToDate = this.request.toDate = this.form.get('toDate').value;
    } else {
      this.reportParameters.onlyToDate = null;
    }
    if (this.form.get('fromDate').value && this.form.get('toDate').value) {
      this.reportParameters.fromDate = this.form.get('fromDate').value;
      this.reportParameters.toDate = this.request.toDate = this.form.get('toDate').value;
    } else {
      this.reportParameters.fromDate = null;
      this.reportParameters.toDate = null;
    }
    if (this.form.get('justifiableCaseFlag').value != 'Both') {
      this.reportParameters.bothCondition = 1;
      if (this.form.get('justifiableCaseFlag').value == 'Yes') {
        this.reportParameters.justifiable = 1;
      }
      else {
        this.reportParameters.justifiable = 0;
      }
    }
    else {
      this.reportParameters.bothCondition = 0;
      this.reportParameters.justifiable = 1;
    }
    this.reportWindow.reportParameters = this.reportParameters;
    this.reportWindow.downloadReport();

  }
  onSearch() {
    this.request = new TracingListReqObj();
    this.request.carrierGroupCode = this.carrier;
    this.request.carrierCode = this.form.getRawValue().carrierCode;
    this.request.fromDate = this.form.get('fromDate').value;
    this.request.toDate = this.form.get('toDate').value;
    this.request.justifiableCaseFlag = this.form.get('justifiableCaseFlag').value;
    (this.form.get('tracingLocationList') as NgcFormArray).resetValue([]);
    this.tracingService.searchData(this.request).subscribe(data => {
      this.resp = data;
      this.refreshFormMessages(data);
      if (!this.resp.data.length) {
        this.showInfoStatus("tracing.no.record.found");
      }

      if (!this.resp) {
        if (this.resp.justifiableCaseFlag == 'Yes') {
          this.form.get('justifiableCaseFlag').patchValue('Yes')
        }
        else {
          this.form.get('justifiableCaseFlag').patchValue('No')
        }
      } else {
        this.refreshFormMessages(data);
      }
      this.resp.data = this.resp.data.map(obj => {
        if (obj.irregularityPieces != null && obj.totalPieces != null) {
          obj.irregularityPiecesToShow = obj.irregularityPieces + '/' + obj.totalPieces;
        }
        if (obj.irregularityWeight != null && obj.totalWeight != null) {
          obj.irregularityWeightToShow = obj.irregularityWeight + '/' + obj.totalWeight;
        }
        return obj;
      });


      this.form.get('tracingLocationList').patchValue(this.resp.data);
      this.searchFlag = true;
    }, error => { this.showErrorStatus('Error: '); });

  }

  onLocation(index) {
    this.locationArray = new Array();
    this.locationArray = this.resp.data[index].tracingLocation;
    this.locationInformationData = 'Location Information-' + '  ' + this.resp.data[index].shipmentNumber;

    this.windowData.open();
  }
  getCarrierCodeByCarrierGroup(event) {
    this.carrierCode = event;
  }

  onSave() {
    let res = [];
    let request = this.form.getRawValue();
    let updateObj = new TracingListResponseObj();

    request.tracingLocationList.forEach(ele => {
      if (ele['justifiableCaseFlag'] == 'Yes') {
        ele['justifiableCaseFlag'] = true;
      } else if (ele['justifiableCaseFlag'] == 'No') {
        ele['justifiableCaseFlag'] = false;
      }
      updateObj = ele;
      res.push(updateObj);
    });

    this.tracingService.updateData(res).subscribe(data => {
      this.resp = data;
      this.refreshFormMessages(data);
      if (data.data) {
        this.showSuccessStatus("tracing.data.saved");
        this.onSearch();

      }

    })
  }
  public onBack(event) {
    this.navigateBack(this.form.getRawValue());
  }


}
