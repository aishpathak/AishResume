import { CellsStyleClass } from '../../../../shared/shared.data';
import { NgcFormGroup, NgcFormControl, NgcFormArray, NgcPage, NgcUtility, DateTimeKey, CellsRendererStyle, NgcReportComponent, PageConfiguration, NgcDataTableComponent, NgcWindowComponent } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BuildupService } from '../buildup.service';
import { SearchSpecialCargoShipmentForHO, SpecialCargoHandover } from './../../export.sharedmodel';

@Component({
  selector: 'app-special-cargo-monitoring-list',
  templateUrl: './special-cargo-monitoring-list.component.html',
  styleUrls: ['./special-cargo-monitoring-list.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  dashboard: true
})

export class SpecialCargoMonitoringListComponent extends NgcPage implements OnInit {

  private searchtab: boolean = false;
  @ViewChild('openUploadPhotoPopup') openUploadPhotoPopup: NgcWindowComponent;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private buildupService: BuildupService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public monitoringListForm: NgcFormGroup = new NgcFormGroup({
    shcGroup: new NgcFormControl(),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    requestTerminal: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    byRequestHandOver: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    notocMismatchYesNo: new NgcFormControl(),
    dlsMismatchYesNo: new NgcFormControl(),
    specialCargoMoniteringFlight: new NgcFormArray([
    ])
  });

  public imageViewForm: NgcFormGroup = new NgcFormGroup({
    locationForFileUpload: new NgcFormControl(),
    entityType: new NgcFormControl('ULD'),
    document: new NgcFormControl()
  });

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  reportParameters: any = new Object();

  onSearch() {
    let request = new SearchSpecialCargoShipmentForHO();
    this.resetFormMessages();
    if (!this.monitoringListForm.get('shcGroup').value) {
      this.showErrorMessage("export.select.shc.group");
      return;
    }
    request.shcGroup = this.monitoringListForm.get('shcGroup').value;
    request.flightKey = this.monitoringListForm.get('flightKey').value;
    request.flightDate = this.monitoringListForm.get('flightDate').value;
    request.fromDate = this.monitoringListForm.get('fromDate').value;
    request.toDate = this.monitoringListForm.get('toDate').value;
    request.carrierGroup = this.monitoringListForm.get('carrierGroup').value;
    request.byRequestHandOver = this.monitoringListForm.get('byRequestHandOver').value;
    request.shipmentNumber = this.monitoringListForm.get('shipmentNumber').value;
    request.dlsMismatchYesNo = this.monitoringListForm.get('dlsMismatchYesNo').value;
    request.notocMismatchYesNo = this.monitoringListForm.get('notocMismatchYesNo').value;
    request.requestTerminal = this.monitoringListForm.get('requestTerminal').value;
    request.fromRequest = true;
    // request.source = 'DESKTOP';
    this.buildupService.fetchMonitoringList(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.monitoringListForm.get('specialCargoMoniteringFlight').patchValue(response.data);
        this.searchtab = true;
      } else {
        this.searchtab = false;
      }
    });

  }

  onGenExcel() {
    this.resetFormMessages();
    if (!this.monitoringListForm.get('shcGroup').value) {
      this.showErrorMessage("export.select.shc.group");
      return;
    }
    this.reportParameters.shcGroup = this.monitoringListForm.get('shcGroup').value;
    this.reportParameters.flightKey = this.monitoringListForm.get('flightKey').value;
    this.reportParameters.flightDate = this.monitoringListForm.get('flightDate').value;
    this.reportParameters.fromDate = this.monitoringListForm.get('fromDate').value;
    this.reportParameters.toDate = this.monitoringListForm.get('toDate').value;
    this.reportParameters.carrierGroup = this.monitoringListForm.get('carrierGroup').value;
    this.reportParameters.byRequestHandOver = this.monitoringListForm.get('byRequestHandOver').value;
    this.reportParameters.shipmentNumber = this.monitoringListForm.get('shipmentNumber').value;
    this.reportParameters.dlsMismatchYesNo = this.monitoringListForm.get('dlsMismatchYesNo').value;
    this.reportParameters.notocMismatchYesNo = this.monitoringListForm.get('notocMismatchYesNo').value;
    this.reportParameters.requestTerminal = this.monitoringListForm.get('requestTerminal').value;
    this.reportParameters.fromRequest = true;

    this.reportWindow.fileName = "Special Cargo Monitoring Report.xlsx";
    this.reportWindow.reportParameters = this.reportParameters;
    this.reportWindow.downloadReport();
  }

  getCarrierCodeByCarrierGroup(event) {
    this.monitoringListForm.get('carrierGroup').setValue(event.desc);
  }

  onClickOfLink(docId) {
    // request.source = 'DESKTOP';
    let req = new SpecialCargoHandover();
    req.uploadedDocId = docId;
    this.buildupService.fetchPhotoForDocId(req).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.imageViewForm.get('document').setValue(response.data.document);
        this.openUploadPhotoPopup.open();
      }
    });


  }

}
