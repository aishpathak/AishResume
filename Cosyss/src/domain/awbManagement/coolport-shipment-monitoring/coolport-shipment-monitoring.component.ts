import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { AwbManagementService } from '../awbManagement.service';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcInputComponent,
  NgcUtility, NgcWindowComponent, NgcContainerComponent, PageConfiguration, BaseBO, CellsRendererStyle, NgcReportComponent
} from 'ngc-framework';
import { CellsStyleClass } from '../../../shared/shared.data';
import { Validator, Validators } from '@angular/forms';
import { NgcFormControl } from 'ngc-framework';
import { StatusMessage } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { CoolportShipmetSearch } from '../awbManagement.shared';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-coolport-shipment-monitoring',
  templateUrl: './coolport-shipment-monitoring.component.html',
  styleUrls: ['./coolport-shipment-monitoring.component.scss'],
  providers: [AwbManagementService]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class CoolportShipmentMonitoringComponent extends NgcPage implements OnInit {
  response: any;
  autoRefresh: Subscription;
  private helpViewVisible: boolean = false;
  awbNumber: string;
  coolportShipmentDetailsResponse: any;
  @ViewChild("temparaturePopup") private temparaturePopup: NgcWindowComponent;
  private coolportShipmentSearch: NgcFormGroup = new NgcFormGroup({
    by: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    dateTimeFrom: new NgcFormControl(),
    dateTimeTo: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    temperatureval: new NgcFormControl,
    auto: new NgcFormControl(false),


  });

  reportParameters: any;
  private coolportShipmentsResponse: NgcFormGroup = new NgcFormGroup({
    displayflag: new NgcFormControl,
    temperature: new NgcFormControl,
    coolportShipmentDetails: new NgcFormArray([
    ])
  })
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private AwbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }

  public groupsRenderer = (value: string | number, rowData: any, level: any): string => {
    if (rowData.data.advice) {
      return '&nbsp;Planning Advice:  ' + rowData.data.advice;
    }
    else {
      return '&nbsp;';
    }
  }
  onSearch() {
    this.coolportShipmentsResponse.controls.coolportShipmentDetails.reset();
    this.coolportShipmentSearch.get('temperatureval').reset();
    let coolportshipmentsearch: CoolportShipmetSearch = new CoolportShipmetSearch();
    coolportshipmentsearch.carrierGroup = this.coolportShipmentSearch.get('carrierGroup').value;
    coolportshipmentsearch.dateTimeFrom = this.coolportShipmentSearch.get('dateTimeFrom').value;
    coolportshipmentsearch.dateTimeTo = this.coolportShipmentSearch.get('dateTimeTo').value;
    coolportshipmentsearch.carrierCode = this.coolportShipmentSearch.get('carrierCode').value;
    coolportshipmentsearch.by = this.coolportShipmentSearch.get('by').value;
    this.AwbManagementService.fetchCoolportShipmentInfo(coolportshipmentsearch).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.data) {
        let coolCodedata = data.data.map(i => {
          return i.coolportMonitoringDetailData[0]
        })
        console.log(coolCodedata);
        this.coolportShipmentDetailsResponse = coolCodedata;
        this.coolportShipmentsResponse.get('coolportShipmentDetails').patchValue(coolCodedata);
      }
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.helpViewVisible = false;
  }

  onAutoRefresh(event) {
    if (this.autoRefresh) {
      this.autoRefresh.unsubscribe();
      this.autoRefresh = null;
    }
    if (event === true) {
      this.autoRefresh = this.getTimer(this.response).subscribe(data => {
        this.onSearch();
      });
    }
  }

  oncoolportserviceReport() {
    this.reportParameters = new Object();
    if (this.coolportShipmentSearch.get('by').value === 'import') {
      this.reportParameters.datefrom = this.coolportShipmentSearch.get('dateTimeFrom').value;
      this.reportParameters.dateto = this.coolportShipmentSearch.get('dateTimeTo').value;
      if (this.coolportShipmentSearch.get('carrierGroup').value != null) {
        this.reportParameters.carriergroup = this.coolportShipmentSearch.get('carrierGroup').value;
        this.reportParameters.carriergroupflag = '1'
      }
      else { this.reportParameters.carriergroupflag = '0' }
      if (this.coolportShipmentSearch.get('carrierCode').value != null) {
        this.reportParameters.carriercode = this.coolportShipmentSearch.get('carrierCode').value;
        this.reportParameters.carriercodeflag = '1'
      }
      else { this.reportParameters.carriercodeflag = '0' }
      this.reportParameters.tenantID = NgcUtility.getTenantConfiguration().airportCode;
      this.reportWindow1.reportParameters = this.reportParameters;
      this.reportWindow1.downloadReport();
    }
    if (this.coolportShipmentSearch.get('by').value === 'export') {
      this.reportParameters.fromdate = this.coolportShipmentSearch.get('dateTimeFrom').value;
      this.reportParameters.todate = this.coolportShipmentSearch.get('dateTimeTo').value;
      this.reportParameters.tenantID = NgcUtility.getTenantConfiguration().airportCode;
      if (this.coolportShipmentSearch.get('carrierGroup').value != null) {
        this.reportParameters.carriergroup = this.coolportShipmentSearch.get('carrierGroup').value;
        this.reportParameters.carriergroupflag = '1'
      }
      else { this.reportParameters.carriergroupflag = '0' }
      if (this.coolportShipmentSearch.get('carrierCode').value != null) {
        this.reportParameters.carrier = this.coolportShipmentSearch.get('carrierCode').value;
        this.reportParameters.carrierflag = '1'
      }
      else { this.reportParameters.carrierflag = '0' }
      this.reportWindow2.reportParameters = this.reportParameters;
      this.reportWindow2.downloadReport();
    }
  }

  onLinkClick(data: any) {
  }
  updateTemparature() {
    let searchData = (<NgcFormArray>this.coolportShipmentsResponse.get(['coolportShipmentDetails'])).getRawValue();
    let coolportshipmentsearchList = [];
    for (const eachRow of searchData) {
      if (eachRow.select) {
        coolportshipmentsearchList.push(eachRow);
      }
    }
    this.AwbManagementService.updateTemparatureShipmentInfo(coolportshipmentsearchList).subscribe(data => {
      if (data.data) {
        this.onSearch();
      }
    });
  }

  onChange(event) {
    let responseData = (<NgcFormArray>this.coolportShipmentsResponse.get(['coolportShipmentDetails'])).getRawValue();
    for (const eachRow of responseData) {
      if (eachRow.select) {
        eachRow.temparature = event.desc;
      }
    }
    this.coolportShipmentsResponse.get(['coolportShipmentDetails']).patchValue(responseData);
  }

  onChangeBy(event) {
    (<NgcFormArray>this.coolportShipmentsResponse.get("coolportShipmentDetails")).patchValue([]);
  }
}
