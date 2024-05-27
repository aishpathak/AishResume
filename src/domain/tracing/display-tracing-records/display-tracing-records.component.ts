import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcReportComponent, NgcPage, NgcUtility, NgcFormArray, NgcWindowComponent, PageConfiguration, NgcFileUploadComponent } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { TracingService } from '../tracing.service';
import { SearchTracingRecord } from '../tracing.shared'
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-display-tracing-records',
  templateUrl: './display-tracing-records.component.html',
  styleUrls: ['./display-tracing-records.component.scss']
})

@PageConfiguration({
  trackInit: true,
  //callNgOnInitOnClear: true,
  //autoBackNavigation: true
})
export class DisplayTracingRecordsComponent extends NgcPage {

  isTableFlag: boolean = false;
  tracingSearchList: any = [];
  carrierGroupCodeParam: any;
  indicatorType: any;
  airportCode: any;
  firstTimeLogin: any = "Yes";
  screenfiles = [];
  mailattachmentRef: any;

  @ViewChild('docTagPopUp') docTagPopUp: NgcWindowComponent;
  @ViewChild('showPopUpfiles') showPopUpfiles: NgcFileUploadComponent;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  userShortName: any;
  reportParameters: any = new Object();;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private tracingService: TracingService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  private displayTracingForm: NgcFormGroup = new NgcFormGroup({
    searchFormGroup: new NgcFormGroup({
      shipment: new NgcFormControl(),
      airportGroupCode: new NgcFormControl(),
      importExportIndicator: new NgcFormControl(),
      carrierGroupCode: new NgcFormControl(),
      carrierCode: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(),
      fromDate: new NgcFormControl(),
      toDate: new NgcFormControl(),
      irregularityTypeCode: new NgcFormControl(),
      irregularity: new NgcFormControl(),
      caseStatus: new NgcFormControl(),
      tracingCreatedfor: new NgcFormControl(),
      flightKey: new NgcFormControl(),
      caseNumber: new NgcFormControl(),
      reasonforClosing: new NgcFormControl(),
      claimed: new NgcFormControl(),
      notclaimed: new NgcFormControl(),
      stages: new NgcFormControl(),
      irpStatus: new NgcFormControl(),
    }),
    displayTracingListForm: new NgcFormGroup({
      tracingList: new NgcFormArray([
      ]),
      pcsDetails: new NgcFormControl(),
      wgtDetails: new NgcFormControl(),
      Details: new NgcFormControl(),
    })
  });

  ngOnInit() {

    super.ngOnInit();
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {
      this.firstTimeLogin = "No"
      this.displayTracingForm.get(['searchFormGroup']).patchValue(forwardedData.recordData);
      this.onSearch();
    } else {
      this.firstTimeLogin = "Yes"
      this.indicatorType = this.createSourceParameter("B");
      this.onSearch();
    }


  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

  }

  onSearch() {
    this.tracingSearchList = [];

    this.displayTracingForm.get('displayTracingListForm').reset();
    const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.displayTracingForm.get('searchFormGroup'));
    const req: SearchTracingRecord = new SearchTracingRecord();
    req.flagCRUD = 'R';
    req.airportGroupCode = searchFormGroup.get('airportGroupCode').value;
    if (searchFormGroup.get('importExportIndicator').value == null) {
      req.importExportIndicator = "B";
    } else {
      req.importExportIndicator = searchFormGroup.get('importExportIndicator').value;
    }
    req.carrierGroupCode = searchFormGroup.get('carrierGroupCode').value;
    req.carrierCode = searchFormGroup.get('carrierCode').value;
    req.shipmentNumber = searchFormGroup.get('shipmentNumber').value;
    req.fromDate = searchFormGroup.get('fromDate').value;
    req.toDate = searchFormGroup.get('toDate').value;
    req.caseStatus = searchFormGroup.get('caseStatus').value;
    req.irregularity = searchFormGroup.get('irregularity').value;
    req.tracingCreatedfor = searchFormGroup.get('tracingCreatedfor').value;
    req.flightKey = searchFormGroup.get('flightKey').value;
    if (searchFormGroup.get('irregularityTypeCode').value == true) {
      req.irregularityTypeCode = "PART-SHIPMENT";
    }
    req.claimed = searchFormGroup.get('claimed').value;
    req.notclaimed = searchFormGroup.get('notclaimed').value;
    req.irpStatus = searchFormGroup.get('irpStatus').value;
    req.stages = searchFormGroup.get('stages').value;
    req.firstTimeLogin = this.firstTimeLogin;
    this.firstTimeLogin = "No";
    req.reasonforClosing = searchFormGroup.get('reasonforClosing').value;
    this.tracingService.getTracingRecordsToDisplay(req).subscribe(response => {
      if (this.showResponseErrorMessages(response)) {
        this.showResponseErrorMessages(response);
        this.isTableFlag = false;
        return;
      }
      else if (response.data && response.data.length == 0) {
        this.showInfoStatus("tracing.no.record.found");
        this.isTableFlag = false;
        return;
      }

      this.isTableFlag = true;
      this.tracingSearchList = response.data;
      this.displayTracingForm.get(['displayTracingListForm', 'tracingList']).patchValue(this.tracingSearchList);
      this.tracingSearchList.forEach((listItem, index) => {
        var irrPcs = listItem.irregularityPieces;
        var totalPcs = listItem.totalPieces;
        var pcs = irrPcs + " / " + totalPcs;
        this.displayTracingForm.get(['displayTracingListForm', 'tracingList', index, 'irregularityPieces']).patchValue(pcs);
        var irrwgt = NgcUtility.getDisplayWeight(listItem.irregularityWeight);
        var totalwgt = NgcUtility.getDisplayWeight(listItem.totalWeight);
        var wgt = irrwgt + " / " + totalwgt;
        this.displayTracingForm.get(['displayTracingListForm', 'tracingList', index, 'irregularityWeight']).patchValue(wgt);
        if (listItem.importExportIndicator == 'I') {
          this.displayTracingForm.get(['displayTracingListForm', 'tracingList', index, 'importExportIndicator']).patchValue("IMPORT");
        }
        if (listItem.importExportIndicator == 'E') {
          this.displayTracingForm.get(['displayTracingListForm', 'tracingList', index, 'importExportIndicator']).patchValue("EXPORT");
        }
      });
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  onClear() {
    this.isTableFlag = false;
    this.displayTracingForm.reset();
  }

  createNewTrace(event) {
    let createTracedata = {
      "createFlag": "C",
      "recordData": (<NgcFormGroup>this.displayTracingForm.get('searchFormGroup')).getRawValue()
    };
    this.navigateTo(this.router, 'tracing/maintaintracingactivities', createTracedata);
  }

  getDocs() {
    this.docTagPopUp.open();
  }

  onLinkClick(event) {
    console.log(event)
    if (event.column === "Details") {
      let updateTracedata = {
        "createFlag": "U",
        "caseNumber": event.record.caseNumber,
        "caseStatus": event.record.caseStatus,
        "shipmentNumber": event.record.shipmentNumber,
        "houseNumber": event.record.houseNumber,
        "recordData": (<NgcFormGroup>this.displayTracingForm.get('searchFormGroup')).getRawValue()
      };
      this.navigateTo(this.router, 'tracing/maintaintracingactivities', updateTracedata);
    } else {
      // To Fetching all the uploded files of respective files 
      this.screenfiles = this.showPopUpfiles.getFiles();
      this.showPopUpfiles.updateFiles(this.screenfiles);
      this.displayTracingForm.get(['searchFormGroup', 'caseNumber']).patchValue(event.record.caseNumber);
      this.displayTracingForm.get(['searchFormGroup', 'shipment']).patchValue(event.record.caseNumber + event.record.shipmentNumber);
      this.docTagPopUp.open();
    }

  }

  getCarrierCodeByCarrierGroup(item) {
    console.log(item.desc);
    this.carrierGroupCodeParam = this.createSourceParameter(this.displayTracingForm.get(['searchFormGroup', 'carrierGroupCode']).value);
  }

  getCarrierCodeByAirportGroup(event) {
    this.airportCode = this.createSourceParameter(event.parameter3);
    console.log("Ac", this.airportCode);
    this.displayTracingForm.get(['searchFormGroup', 'carrierGroupCode']).patchValue(0);
    this.displayTracingForm.get(['searchFormGroup', 'carrierCode']).patchValue("");
  }


  getAirportGroupByType(event) {
    console.log("ind", this.createSourceParameter(this.displayTracingForm.get(['searchFormGroup', 'importExportIndicator']).value));
    this.indicatorType = this.createSourceParameter(this.displayTracingForm.get(['searchFormGroup', 'importExportIndicator']).value);

  }

  onDisplayTracingReport(event) {

    this.reportParameters.caseStatus = this.displayTracingForm.get('searchFormGroup').get('caseStatus').value;
    this.reportParameters.importExportIndicator = this.displayTracingForm.get('searchFormGroup').get('importExportIndicator').value;
    this.reportParameters.carrierGroupCode = this.displayTracingForm.get('searchFormGroup').get('carrierGroupCode').value;
    this.reportParameters.carrierCode = this.displayTracingForm.get('searchFormGroup').get('carrierCode').value;
    this.reportParameters.shipmentNumber = this.displayTracingForm.get('searchFormGroup').get('shipmentNumber').value;
    this.reportParameters.tracingCreatedFor = this.displayTracingForm.get('searchFormGroup').get('tracingCreatedfor').value;
    this.reportParameters.fromDate = this.displayTracingForm.get('searchFormGroup').get('fromDate').value;
    this.reportParameters.toDate = this.displayTracingForm.get('searchFormGroup').get('toDate').value;
    this.reportParameters.irregularityCode = this.displayTracingForm.get('searchFormGroup').get('irregularity').value;
    this.reportParameters.irregularityTypeCode = this.displayTracingForm.get('searchFormGroup').get('irregularityTypeCode').value;
    this.reportParameters.flightKey = this.displayTracingForm.get('searchFormGroup').get('flightKey').value;
    this.reportParameters.airportGroupCode = this.displayTracingForm.get('searchFormGroup').get('airportGroupCode').value;
    this.reportParameters.reasonforClosing = this.displayTracingForm.get('searchFormGroup').get('reasonforClosing').value;
    this.reportParameters.stages = this.displayTracingForm.get('searchFormGroup').get('stages').value;
    this.reportParameters.irpStatus = this.displayTracingForm.get('searchFormGroup').get('irpStatus').value;
    this.reportParameters.firstTimeLogin = this.firstTimeLogin;
    this.reportParameters.userLoginCode = this.getUserProfile().userLoginCode;
    if (this.reportParameters.caseStatus == null || this.reportParameters.exportImportIndicator == null
      || this.reportParameters.carrierCode == null || this.reportParameters.shipmentNumber == null
      || this.reportParameters.tracingCreatedFor == null || this.reportParameters.fromDate == null ||
      this.reportParameters.toDate == null || this.reportParameters.toDate == null ||
      this.reportParameters.irregularityCode == null || this.reportParameters.flightKey == null
      || this.reportParameters.airportGroupCode == null || this.reportParameters.reasonforClosing == null ||
      this.reportParameters.staging == null || this.reportParameters.irpStatus == null ||
      this.reportParameters.firstTimeLogin == 'No'
    ) {
      this.reportParameters.whereFlag = true;
    }
    else {
      this.reportParameters.whereFlag = false;
    }
    if (this.reportParameters.firstTimeLogin == 'Yes' && (this.reportParameters.carrierGroupCode != null ||
      this.reportParameters.reasonforClosing != null
    )) {
      this.reportParameters.firstTimeYes = true;
    }
    else {
      this.reportParameters.firstTimeYes = false;
    }
    this.reportWindow.downloadReport();

  }


}
