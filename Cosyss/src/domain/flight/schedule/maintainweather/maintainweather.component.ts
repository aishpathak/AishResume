import { request } from 'http';
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
import { MaintainWeatherRequest } from './../../flight.sharedmodel';
import { Validators } from '@angular/forms';
import { FlightService } from './../../flight.service';
import { Environment } from '../../../../environments/environment';
import { getLocaleDateTimeFormat } from '@angular/common';


@Component({
  selector: 'app-maintainweather',
  templateUrl: './maintainweather.component.html',
  styleUrls: ['./maintainweather.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class MaintainweatherComponent extends NgcPage implements OnInit {
  @ViewChild('reportwindow') reportwindow: NgcReportComponent;
  @ViewChild("ReportExcel") ReportExcel: NgcReportComponent;
  searchFlag: boolean = false;
  weather: string = '';
  reportParameters: any;

  constructor(appZone: NgZone,
    private flightService: FlightService, ppZone: NgZone,
    appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  flightListData: any[];
  private maintainWeatherForm: NgcFormGroup = new NgcFormGroup({
    flightType: new NgcFormControl("All"),
    carrier: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    weather: new NgcFormControl(),
    flightList: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        sNo: new NgcFormControl(),
        flightId: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        scheduledDate: new NgcFormControl(),
        flightLeg: new NgcFormControl(),
        dateSta: new NgcFormControl(),
        dateEta: new NgcFormControl(),
        dateStd: new NgcFormControl(),
        dateEtd: new NgcFormControl(),
        weather: new NgcFormControl(),
        editWeather: new NgcFormControl(),
        flightBoardPoint: new NgcFormControl(),
        flightOffPoint: new NgcFormControl()
      })
    ])
  });

  ngOnInit() {
    this.maintainWeatherForm.get('fromDate').setValue(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.MINUTES));
    this.maintainWeatherForm.get('toDate').setValue(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 1439, DateTimeKey.MINUTES));
  }
  onSearch() {
    let validFrom = new Date();
    let validTo = new Date();
    validFrom = this.maintainWeatherForm.get('fromDate').value;
    validTo = this.maintainWeatherForm.get('toDate').value;
    if (validFrom > validTo) {
      this.showWarningStatus('export.from.date.cannot.more.than.to.date');
      this.searchFlag = false;
      return;
    }
    let request = new MaintainWeatherRequest();
    request = this.maintainWeatherForm.getRawValue();
    if (request.flightType == null || request.flightType == '' || request.fromDate == null || request.toDate == null) {
      this.showErrorMessage('g.enter.mandatory.m');
      this.searchFlag = false;
    } else {
      this.flightService.getFlightDetailsForWeather(request).subscribe(result => {
         this.refreshFormMessages(result);
          this.flightListData = result.data;
          if (this.flightListData && this.flightListData.length > 0) {
            this.searchFlag = true;
            let sNo = 1;
            for (const eachRow of this.flightListData) {
              eachRow['select'] = 'false';
              eachRow['sNo'] = sNo++;
            }
            this.maintainWeatherForm.controls['flightList'].patchValue(this.flightListData);
          }
         else{
          this.searchFlag = false;
        }
      })
    } 
    
  }
  onClear() {
    this.maintainWeatherForm.reset();
    this.searchFlag = false;
  }

  onSave(event) {
    let selectRecord = [];
    let maintainWeatherDetails = [];
    let maintainWeatherDetailsInfo = (<NgcFormArray>this.maintainWeatherForm.controls['flightList']).getRawValue();
    this.weather = this.maintainWeatherForm.get('weather').value;
    maintainWeatherDetailsInfo.forEach(record => {
      if (record['select'] === true) {
        if (this.weather != null) {
          record['weather'] = this.weather;
        }
        record['scheduledDate'] = null;
        selectRecord.push(record);
      }
    })
    if (selectRecord.length == 0) {
      this.showErrorStatus('export.select.atleast.one.record');
      return;
    } else {
      this.flightService.updateWeatherCondition(selectRecord).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus("g.completed.successfully");
          this.onSearch()
        }
      })
    }

  }
  onPrint(type) {
    if (this.searchFlag) {
      this.reportParameters = new Object();

      this.reportParameters.flightType = this.maintainWeatherForm.get('flightType').value;
      this.reportParameters.carrier = this.maintainWeatherForm.get('carrier').value;
      this.reportParameters.flightNumber = this.maintainWeatherForm.get('flightNumber').value;
      this.reportParameters.fromDate = this.maintainWeatherForm.get('fromDate').value;
      this.reportParameters.toDate = this.maintainWeatherForm.get('toDate').value;
      this.reportParameters.weather = this.maintainWeatherForm.get('weather').value;

      if (type == ReportFormat.XLS) {
        this.ReportExcel.format = ReportFormat.XLS;
        this.ReportExcel.downloadReport();
      } else {
        this.reportwindow.format = ReportFormat.PDF;
        this.reportwindow.open();
      }
    }

  }

}
