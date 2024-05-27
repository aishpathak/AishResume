import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, PageConfiguration, NgcUtility, NgcEditTableComponent, NgcReportComponent
} from 'ngc-framework';
import { AcceptanceMonitoringByHouseRequestModel } from '../../export.sharedmodel';
import { request } from 'http';
import { log } from 'util';
import { Shipment, HouseInformationModel } from './../../export.sharedmodel';
import { Router, ActivatedRoute } from '@angular/router';

import { FormsModule, Validators } from '@angular/forms';
import { AcceptanceService } from '../acceptance.service';
import { Console } from 'console';
import { e } from '@angular/core/src/render3';
@Component({
  selector: 'app-acceptance-monitoring-by-house',
  templateUrl: './acceptance-monitoring-by-house.component.html',
  styleUrls: ['./acceptance-monitoring-by-house.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})

export class AcceptanceMonitoringByHouseComponent extends NgcPage {
  @ViewChild('acceptanceMonitoringByHouseComponentTable')
  private acceptanceMonitoringByHouseComponentTable: NgcEditTableComponent;
  reportParameters: any = new Object();

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  private acceptanceMonitoringByHouse: NgcFormGroup = new NgcFormGroup({
    dateTimeFrom: new NgcFormControl(),
    dateTimeTo: new NgcFormControl(),
    domesticFlightFlag: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    customerCode: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    acceptanceMonitoringAwbListInfo: new NgcFormArray([


    ]),
    acceptanceMonitoringByHouseList: new NgcFormArray([
    ])


  });
  displayFlag: boolean;
  transferData: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router
    , private _acceptanceService: AcceptanceService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }


  ngOnInit() {

    this.transferData = this.getNavigateData(this.activatedRoute);
    if (this.transferData != null && this.transferData !== undefined) {
      this.acceptanceMonitoringByHouse.get('dateTimeFrom').setValue(
        (this.transferData['dateTimeFrom'] == null) ? '' : this.transferData['dateTimeFrom']
      );

      this.acceptanceMonitoringByHouse.get('dateTimeTo').setValue(
        (this.transferData['dateTimeTo'] == null) ? '' : this.transferData['dateTimeTo']
      );

      this.acceptanceMonitoringByHouse.get('domesticFlightFlag').setValue(
        (this.transferData['domesticFlightFlag'] == null) ? '' : this.transferData['domesticFlightFlag']
      );

      this.acceptanceMonitoringByHouse.get('shipmentNumber').setValue(
        (this.transferData['shipmentNumber'] == null) ? '' : this.transferData['shipmentNumber']
      );

      this.acceptanceMonitoringByHouse.get('customerCode').setValue(
        (this.transferData['customerCode'] == null) ? '' : this.transferData['customerCode']
      );

      this.acceptanceMonitoringByHouse.get('carrierCode').setValue(
        (this.transferData['carrierCode'] == null) ? '' : this.transferData['carrierCode']
      );

      this.onSearch();
    }
    this.displayFlag = false;
  }


  validateSearch() {
    let req: AcceptanceMonitoringByHouseRequestModel = this.acceptanceMonitoringByHouse.getRawValue();
  }

  onSearch() {
    this.resetFormMessages();

    let req = new AcceptanceMonitoringByHouseRequestModel();
    req = this.acceptanceMonitoringByHouse.getRawValue();
    if (req.dateTimeFrom == null && req.dateTimeTo == null && req.domesticFlightFlag == null
      && req.shipmentNumber == null && req.customerCode == null && req.carrierCode == null) {
      this.showErrorMessage("export.accpt.searchcriteria");
      return false;
    }
    if ((req.domesticFlightFlag !== null && req.domesticFlightFlag.length > 0)
      && (req.dateTimeFrom == null || req.dateTimeTo == null)) {
      this.showErrorMessage("export.accpt.datevalidation");
      return false;
    }
    if ((req.dateTimeFrom == null && req.dateTimeTo != null)) {
      this.showErrorMessage("export.accpt.fromdatevalidation");
      return false;
    }
    if ((req.dateTimeFrom != null && req.dateTimeTo == null)) {
      this.showErrorMessage("export.accpt.todatevalidation");
      return false;
    }
    if ((req.dateTimeFrom > req.dateTimeTo)) {
      this.showErrorMessage("export.accpt.daterangevalidation");
      return false;
    }
    this._acceptanceService.searchForAcceptanceHouseMonitoring(req).subscribe((data, index) => {
      this.displayFlag = true;
      if (data.data == null) {
        this.displayFlag = false;
        this.showErrorMessage("export.accpt.norecord");
        return;
      }
      else if (data.data.length == 0) {
        this.displayFlag = false;
        this.showErrorMessage("export.accpt.norecord");
        return;
      }
      else {
        this.acceptanceMonitoringByHouse.get('acceptanceMonitoringAwbListInfo').patchValue(data.data);
        this.async(() => {
          this.openRowForInternational();
        });
      }
    }

    )


  }
  openRowForInternational() {

    this.acceptanceMonitoringByHouse.getList(['acceptanceMonitoringAwbListInfo']).forEach((element: any, index) => {
      if (element.controls.domesticFlightFlag.value == "INT" && element.getList(['acceptanceMonitoringByHouseList']).length != 0) {
        this.acceptanceMonitoringByHouseComponentTable.showRow(0, index);
      }
    });

  }



  OnRedirectToExportAwbDocument(index) {

    var dataToSend = {
      shipmentNumberData: this.acceptanceMonitoringByHouse.get(['acceptanceMonitoringAwbListInfo', index]).get('awbNumber').value,
      shipmentTypeData: this.acceptanceMonitoringByHouse.get(['acceptanceMonitoringAwbListInfo', index]).get('shipmentType').value
    }
    this.navigateTo(this.router, 'export/acceptance/exportawbdocument', dataToSend);
  }



  OnRedirectToAcceptanceWeighing(index) {


    if (this.acceptanceMonitoringByHouse.get(['acceptanceMonitoringAwbListInfo', index]).get('domesticFlightFlag').value == 'INT') {
      var dataToSend = {
        acceptanceType: "INT",
        shipmentNumber: this.acceptanceMonitoringByHouse.get(['acceptanceMonitoringAwbListInfo', index]).get('awbNumber').value
      }
      this.navigateTo(this.router, 'export/acceptance/acceptancesummarybyhouse', dataToSend);
    }
    else {
      var dataToSendToAcceptanceWeighing = {
        acceptanceType: "DOM",
        shipmentNumber: this.acceptanceMonitoringByHouse.get(['acceptanceMonitoringAwbListInfo', index]).get('awbNumber').value,
        shipmentType: this.acceptanceMonitoringByHouse.get(['acceptanceMonitoringAwbListInfo', index]).get('shipmentType').value

      }
      this.navigateTo(this.router, 'export/acceptance/acceptanceweighing', dataToSendToAcceptanceWeighing);

    }




  }

  noClickShipmentNumber(index) {

    var dataToSend = {
      shipmentNumber: this.acceptanceMonitoringByHouse.get(['acceptanceMonitoringAwbListInfo', index]).get('awbNumber').value,
      shipmentType: this.acceptanceMonitoringByHouse.get(['acceptanceMonitoringAwbListInfo', index]).get('shipmentType').value
    }

    this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', dataToSend);
  }

  onGenerateReportCustomerXLSReport(event) {
    this.resetFormMessages();

    let req = new AcceptanceMonitoringByHouseRequestModel();
    req = this.acceptanceMonitoringByHouse.getRawValue();
    if (req.dateTimeFrom == null && req.dateTimeTo == null && req.domesticFlightFlag == null
      && req.shipmentNumber == null && req.customerCode == null && req.carrierCode == null) {
      this.showErrorMessage("export.accpt.searchcriteria");
      return false;
    }
    if ((req.domesticFlightFlag !== null && req.domesticFlightFlag.length > 0)
      && (req.dateTimeFrom == null || req.dateTimeTo == null)) {
      this.showErrorMessage("export.accpt.datevalidation");
      return false;
    }
    if ((req.dateTimeFrom == null && req.dateTimeTo != null)) {
      this.showErrorMessage("export.accpt.fromdatevalidation");
      return false;
    }
    if ((req.dateTimeFrom != null && req.dateTimeTo == null)) {
      this.showErrorMessage("export.accpt.todatevalidation");
      return false;
    }
    if ((req.dateTimeFrom > req.dateTimeTo)) {
      this.showErrorMessage("export.accpt.daterangevalidation");
      return false;
    }
    this.reportParameters.dateTimeFrom = this.acceptanceMonitoringByHouse.get('dateTimeFrom').value;
    this.reportParameters.dateTimeTo = this.acceptanceMonitoringByHouse.get('dateTimeTo').value;
    this.reportParameters.shipmentNumber = this.acceptanceMonitoringByHouse.get('shipmentNumber').value;
    this.reportParameters.customerCode = this.acceptanceMonitoringByHouse.get('customerCode').value;
    this.reportParameters.domesticFlightFlag = this.acceptanceMonitoringByHouse.get('domesticFlightFlag').value;
    this.reportParameters.carrierCode = this.acceptanceMonitoringByHouse.get('carrierCode').value;

    this.reportWindow.downloadReport();
  }
}
