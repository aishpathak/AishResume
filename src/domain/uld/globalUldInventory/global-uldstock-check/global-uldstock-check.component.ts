import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import {
  NgcFormControl,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  NgcTabsComponent,
  CellsRendererStyle,
  NgcPage,
  NgcFormGroup,
  NgcWindowComponent,
  NgcFormArray
  , ReportFormat, NgcDropDownComponent, NgcUtility, NgcButtonComponent, NgcDataTableComponent, PageConfiguration, DateTimeKey, NgcReportComponent
} from 'ngc-framework';
import { UldService } from '../../uld.service';
import { GlobalUldStockCheckRequest } from '../../uld.shared';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-global-uldstock-check',
  templateUrl: './global-uldstock-check.component.html',
  styleUrls: ['./global-uldstock-check.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class GlobalULDStockCheckComponent extends NgcPage implements OnInit {
  @ViewChild('reportwindow') reportwindow: NgcReportComponent;
  @ViewChild("ReportExcel") ReportExcel: NgcReportComponent;
  searchFlag: boolean = false;
  weather: string = '';
  reportParameters: any;
  responseData: any;
  disabledFlag: boolean = true;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private router: Router,
    private uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }
  globalUldStockCheckListData: any[];
  private searchForm: NgcFormGroup = new NgcFormGroup({
    uldGroupId: new NgcFormControl(),
    carrier: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    carrierGroupDesc: new NgcFormControl(),
    airportCode: new NgcFormControl(),
    uldType: new NgcFormControl(),
    totalUldCount: new NgcFormControl(),
    uldGroup: new NgcFormControl(),
  });
  private globalUldStockCheckForm: NgcFormGroup = new NgcFormGroup({
    UldStockList: new NgcFormArray([
      new NgcFormGroup({
        carrier: new NgcFormControl(),
        airportCode: new NgcFormControl(),
        uldType: new NgcFormControl(),
        minimumAllow: new NgcFormControl(),
        maximumAllow: new NgcFormControl(),
        totalUldCount: new NgcFormControl(),
        uldGroup: new NgcFormControl(),
        stdLimit: new NgcFormControl()
      })
    ])
  });

  ngOnInit() {
  }

  onSearch() {
    this.resetFormMessages();
    this.searchFlag = false;
    let request = new GlobalUldStockCheckRequest();
    request = this.searchForm.getRawValue();
    this.uldService.getGlobalUldStockCheckRequest(request).subscribe(result => {
      this.globalUldStockCheckForm.reset();
      this.refreshFormMessages(result);
      if (result.data != null) {
        this.disabledFlag = false;
        this.searchFlag = true;
        this.responseData = result.data;
        this.globalUldStockCheckForm.get(['UldStockList']).patchValue(this.responseData);
      }
      if (result.data == null || result.data == '') {
        this.disabledFlag = true;
        this.showErrorMessage('no.record');
      }
    });
  }

  onClear() {
    this.globalUldStockCheckForm.reset();
    this.searchForm.reset();
    this.searchFlag = false;
  }

  onExport() {
    if (this.searchFlag) {
      this.reportParameters = new Object();
      this.reportParameters.carrier = this.searchForm.get('carrier').value;
      this.reportParameters.airportCode = this.searchForm.get('airportCode').value;
      this.reportParameters.uldType = this.searchForm.get('uldType').value;
      this.reportParameters.totalUldCount = this.searchForm.get('totalUldCount').value;
      this.reportParameters.uldGroupId = this.searchForm.get('uldGroupId').value;
      this.ReportExcel.format = ReportFormat.XLS;
      this.ReportExcel.downloadReport();
    }

  }
  /* this is used to fetch UldType based on UldGroup we select*/
  onSelectUldGroup(event) {
    if (event && event.code) {
      this.searchForm.get('uldGroupId').setValue(event.param1);
    } else {
      this.searchForm.get('uldGroupId').setValue(null);
    }
  }

  onClickCarrierGroup(event) {
    this.searchForm.get('carrierGroup').patchValue(event.code);
    this.searchForm.get('carrier').patchValue(null);
    this.searchFlag = false;
  }
  onClickCarrierCode() {
    this.searchForm.get('carrierGroup').patchValue(null);
    this.searchForm.get('carrierGroupDesc').patchValue(null);
    this.searchFlag = false;
  }
}
