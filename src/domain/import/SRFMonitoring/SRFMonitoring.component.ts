import { Component, OnInit, ElementRef, NgZone, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ImportService } from '../import.service';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, PageConfiguration, NgcUtility, NgcFileUploadComponent, NgcReportComponent, ReactiveModel, DateTimeKey, NgcWindowComponent } from "ngc-framework";


@Component({
  selector: 'app-SRFMonitoring',
  templateUrl: './SRFMonitoring.component.html',
  styleUrls: ['./SRFMonitoring.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})


export class SRFMonitoringComponent extends NgcPage {

  showTable: any;
  shipmentArray: any;
  request: any;
  patchDataValue: { srfNumber: any, shipmentNumber: any, deliveryRequestOrderNo: any; };
  selectedData: any;


  public SRFMonitoringForm: NgcFormGroup = new NgcFormGroup({
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),
    customerShortName: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    srfNumber: new NgcFormControl(),
    status: new NgcFormControl(),
    shipmentArray: new NgcFormArray([

    ]),

  })
  shipmentNumber: string;
  srfNumber: string;
  constructor(appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }


  ngOnInit() {
    var transferData = this.getNavigateData(this.activatedRoute);
    console.log("data", transferData);
    if (transferData != null) {

      this.SRFMonitoringForm.get('fromDate').patchValue(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 7, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES));
      this.SRFMonitoringForm.get('toDate').patchValue(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES));
      this.SRFMonitoringForm.get('srfNumber').patchValue(transferData.srfNumber);
      this.SRFMonitoringForm.get('shipmentNumber').patchValue(transferData.shipmentNumber);
      this.onSearch();
    }

  }

  onSearch() {
    this.showTable = false;
    this.resetFormMessages();
    if (this.SRFMonitoringForm.invalid) {
      return;
    }
    if (this.SRFMonitoringForm.get('fromDate').value == "" || this.SRFMonitoringForm.get('fromDate').value == null
      || this.SRFMonitoringForm.get('toDate').value == "" || this.SRFMonitoringForm.get('toDate').value == null) {
      this.showErrorMessage('enter.fromDate.ToDate');
      return;
    }

    let request = this.SRFMonitoringForm.getRawValue();
    this.importService.getSrfMonitoring(request).subscribe(response => {

      if (this.showResponseErrorMessages(response)) {
        this.showTable = false
        return;
      }
      const resp = response.data;
      if (!this.showResponseErrorMessages(response)) {
        if (resp == null) {
          this.showErrorStatus("no.record.found")
          this.showTable = false
        }
        this.SRFMonitoringForm.get('shipmentArray').patchValue(resp);
        this.showTable = true;
      }

    });
  }

  onCheckBoxClick(event) {
    this.selectedData = event.record;
  }

  navigateToCaptureTimeStamp() {
    let flag = this.validateSelectedRecords();
    if (flag) {
      this.patchData();
      this.navigateTo(this.router, 'import/captureTimeStamp', this.patchDataValue);
    }

  }

  navigateToPostUnpostSrf() {
    let flag = this.validateSelectedRecords();
    if (flag) {
      this.patchData();
      this.navigateTo(this.router, 'import/PostUnpostSRF', this.patchDataValue);
    }

  }
  navigateToShipmentInformation() {
    let flag = this.validateSelectedRecords();
    if (flag) {
      this.patchData();
      this.navigateTo(this.router, 'awbmgmt/shipmentinfo', this.patchDataValue);
    }

  }


  patchData() {
    this.patchDataValue = {
      srfNumber: this.selectedData.srfNumber,
      shipmentNumber: this.selectedData.shipmentNumber,
      deliveryRequestOrderNo: this.selectedData.srfNumber
    }
  }

  validateSelectedRecords() {
    let formData = this.SRFMonitoringForm.getRawValue();
    let count = 0;
    formData.shipmentArray.forEach(element => {
      if (element.selectCheck) {
        count++;
      }
    });
    if (count > 1) {
      this.showErrorMessage('select.one.record');
      return false;
    }
    return true;
  }

}
