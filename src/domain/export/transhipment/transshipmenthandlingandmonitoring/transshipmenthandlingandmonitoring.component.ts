import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, ReactiveModel, PageConfiguration, NgcReportComponent, NgcUtility, DateTimeKey } from 'ngc-framework';
import { TranshipmentHandlingSummaryModel, TranshipmentHandlingSummaryRequest, GetOutgoingTransshipmentFlightsRequest } from '../transhipment.sharedmodel.ts';
import { TranshipmentService } from '../transhipment.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-transshipmenthandlingandmonitoring',
  templateUrl: './transshipmenthandlingandmonitoring.component.html',
  styleUrls: ['./transshipmenthandlingandmonitoring.component.scss']
})
@PageConfiguration({
  trackInit: true
})
export class TransshipmenthandlingandmonitoringComponent extends NgcPage implements OnInit {
  @ViewChild('inboundReportWindow') inboundReportWindow: NgcReportComponent;
  @ViewChild('outboundReportWindow') outboundReportWindow: NgcReportComponent;
  @ViewChild('shortTransitReportWindow') shortTransitReportWindow: NgcReportComponent;
  reportParameters: any = new Object();
  request: any;
  response: any;
  test = '#f1f1f1';
  requestDataFromNextPage: any = null;

  @ReactiveModel(TranshipmentHandlingSummaryModel)
  public transshipmentHandlingSummaryForm: NgcFormGroup;
  checkRadioButton: any = null;
  dataToNavigateToOutgoingFlight: any = new Array;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private transhipmentService: TranshipmentService, private router: Router, private activatedRoute: ActivatedRoute,) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.initialise();
    this.transshipmentHandlingSummaryForm.get('dateTimeTo').patchValue(NgcUtility.addDate(new Date(), 12, DateTimeKey.HOURS));
  }
  initialise() {
    this.requestDataFromNextPage = this.getNavigateData(this.activatedRoute);
    if (this.requestDataFromNextPage !== null) {
      this.transshipmentHandlingSummaryForm.get('by').patchValue(this.requestDataFromNextPage.by);
      this.transshipmentHandlingSummaryForm.get('dateTimeFrom').patchValue(this.requestDataFromNextPage.dateTimeFrom);
      this.transshipmentHandlingSummaryForm.get('dateTimeTo').patchValue(this.requestDataFromNextPage.dateTimeTo);
      this.transshipmentHandlingSummaryForm.get('flightKey').patchValue(this.requestDataFromNextPage.flightKey);
      this.transshipmentHandlingSummaryForm.get('flightDate').patchValue(this.requestDataFromNextPage.flightDate);
      this.transshipmentHandlingSummaryForm.get('carrier').patchValue(this.requestDataFromNextPage.carrier);
      this.transshipmentHandlingSummaryForm.get('transferType').patchValue(this.requestDataFromNextPage.transferType);
      this.transshipmentHandlingSummaryForm.get('outboundFlightKey').patchValue(this.requestDataFromNextPage.outboundFlightKey);
      this.transshipmentHandlingSummaryForm.get('outboundFlightDate').patchValue(this.requestDataFromNextPage.outboundFlightDate);
      this.getFlightList();
    }
  }

  getFlightList() {
    this.checkRadioButton = null;
    const request = new TranshipmentHandlingSummaryRequest();
    request.by = this.transshipmentHandlingSummaryForm.get('by').value;
    request.dateTimeFrom = this.transshipmentHandlingSummaryForm.get('dateTimeFrom').value;
    request.dateTimeTo = this.transshipmentHandlingSummaryForm.get('dateTimeTo').value;
    request.carrierGroup = this.transshipmentHandlingSummaryForm.get('carrierGroup').value;
    request.carrier = this.transshipmentHandlingSummaryForm.get('carrier').value;
    request.transferType = this.transshipmentHandlingSummaryForm.get('transferType').value;
    request.transferTypeList = this.transshipmentHandlingSummaryForm.get('transferType').value;
    request.shcByPurpose = this.transshipmentHandlingSummaryForm.get('shcByPurpose').value;
    request.flightKey = this.transshipmentHandlingSummaryForm.get('flightKey').value;
    request.flightDate = this.transshipmentHandlingSummaryForm.get('flightDate').value;
    request.tt = this.transshipmentHandlingSummaryForm.get('tt').value;
    request.st = this.transshipmentHandlingSummaryForm.get('st').value;
    request.otherType = this.transshipmentHandlingSummaryForm.get('otherType').value;
    request.outboundFlightKey = this.transshipmentHandlingSummaryForm.get('outboundFlightKey').value;
    request.outboundFlightDate = this.transshipmentHandlingSummaryForm.get('outboundFlightDate').value;
    this.request = request;
    this.transhipmentService.getListOfThroughTransitFlights(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.response = response.data;
        this.transshipmentHandlingSummaryForm.patchValue(response.data);
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }


  printReport() {
    this.reportParameters.fromDateTime = this.transshipmentHandlingSummaryForm.get('dateTimeFrom').value;
    this.reportParameters.toDateTime = this.transshipmentHandlingSummaryForm.get('dateTimeTo').value;
    this.reportParameters.fltNum = this.transshipmentHandlingSummaryForm.get('flightKey').value;
    this.reportParameters.fltDate = this.transshipmentHandlingSummaryForm.get('flightDate').value;
    this.reportParameters.carrierCode = this.transshipmentHandlingSummaryForm.get('carrier').value;
    this.reportParameters.carrierGroup = this.transshipmentHandlingSummaryForm.get('carrierGroup').value;
    this.reportParameters.shcByPurpose = this.transshipmentHandlingSummaryForm.get('shcByPurpose').value;
    this.reportParameters.outboundFlightKey = this.transshipmentHandlingSummaryForm.get('outboundFlightKey').value;
    this.reportParameters.outboundFlightDate = this.transshipmentHandlingSummaryForm.get('outboundFlightDate').value;
    this.reportParameters.tenantId = NgcUtility.getTenantConfiguration().airportCode;
    this.reportParameters.tenantId = NgcUtility.getTenantConfiguration().airportCode;
    if (this.request.transferType == null || this.request.transferType.length == 0) {
      this.reportParameters.transferType = null;
      this.reportParameters.transferType1 = null;
      this.reportParameters.transferType2 = null;
      this.reportParameters.transferType3 = null;
      this.reportParameters.transferType4 = null;
      this.reportParameters.transferType5 = null;
      this.reportParameters.transferType6 = null;
      this.reportParameters.transferType7 = null;
    } else {
      let transferType = '';
      this.request.transferType.forEach(item => {
        transferType += item + ',';
      });

      this.reportParameters.transferType = transferType.substring(0, transferType.length - 1);
      this.reportParameters.transferType1 = this.request.transferType[0] == null ? '1' : "%" + this.request.transferType[0] + "%";
      this.reportParameters.transferType2 = this.request.transferType[1] == null ? '1' : "%" + this.request.transferType[1] + "%";
      this.reportParameters.transferType3 = this.request.transferType[2] == null ? '1' : "%" + this.request.transferType[2] + "%";
      this.reportParameters.transferType4 = this.request.transferType[3] == null ? '1' : "%" + this.request.transferType[3] + "%";
      this.reportParameters.transferType5 = this.request.transferType[4] == null ? '1' : "%" + this.request.transferType[4] + "%";
      this.reportParameters.transferType6 = this.request.transferType[5] == null ? '1' : "%" + this.request.transferType[5] + "%";
      this.reportParameters.transferType7 = this.request.transferType[6] == null ? '1' : "%" + this.request.transferType[6] + "%";
    }
    if (this.request.by.localeCompare('inbound') == 0) {
      this.inboundReportWindow.open();
    }
    else {
      this.outboundReportWindow.open();
    }
  }

  redirectToNextPage(item) {

    let dataToNavigate: any = new Array();

    dataToNavigate['item'] = item.getRawValue().flightId;
    dataToNavigate['by'] = this.transshipmentHandlingSummaryForm.get('by').value;
    dataToNavigate['dateTimeFrom'] = this.transshipmentHandlingSummaryForm.get('dateTimeFrom').value;
    dataToNavigate['dateTimeTo'] = this.transshipmentHandlingSummaryForm.get('dateTimeTo').value;
    dataToNavigate['carrierGroup'] = this.transshipmentHandlingSummaryForm.get('carrierGroup').value;
    dataToNavigate['carrier'] = this.transshipmentHandlingSummaryForm.get('carrier').value;
    dataToNavigate['transferType'] = this.transshipmentHandlingSummaryForm.get('transferType').value;

    dataToNavigate['flightKey'] = this.transshipmentHandlingSummaryForm.get('flightKey').value;
    dataToNavigate['flightDate'] = this.transshipmentHandlingSummaryForm.get('flightDate').value;

    dataToNavigate['outboundFlightKey'] = this.transshipmentHandlingSummaryForm.get('outboundFlightKey').value;
    dataToNavigate['outboundFlightDate'] = this.transshipmentHandlingSummaryForm.get('outboundFlightDate').value;

    if (this.transshipmentHandlingSummaryForm.get('by').value === 'outbound') {
      this.navigateTo(this.router, '/export/transhipment/outbound-transshipment-workinglist', dataToNavigate);
    } else {
      this.navigateTo(this.router, '/export/transhipment/inbound-transshipment-workinglist', dataToNavigate);
    }
  }

  onClear() {
    (<NgcFormArray>this.transshipmentHandlingSummaryForm.get(['flightList'])).resetValue([]);
    this.transshipmentHandlingSummaryForm.reset();
  }

  printST() {
    this.reportParameters.fromDateTime = this.transshipmentHandlingSummaryForm.get('dateTimeFrom').value;
    this.reportParameters.toDateTime = this.transshipmentHandlingSummaryForm.get('dateTimeTo').value;
    this.reportParameters.fltNum = this.transshipmentHandlingSummaryForm.get('flightKey').value;
    this.reportParameters.fltDate = this.transshipmentHandlingSummaryForm.get('flightDate').value;
    this.reportParameters.carrierCode = this.transshipmentHandlingSummaryForm.get('carrier').value;
    this.reportParameters.carrierGroup = this.transshipmentHandlingSummaryForm.get('carrierGroup').value;
    this.reportParameters.shcByPurpose = this.transshipmentHandlingSummaryForm.get('shcByPurpose').value;
    this.reportParameters.outboundFlightKey = this.transshipmentHandlingSummaryForm.get('outboundFlightKey').value;
    this.reportParameters.outboundFlightDate = this.transshipmentHandlingSummaryForm.get('outboundFlightDate').value;
    this.reportParameters.tenantId = NgcUtility.getTenantConfiguration().airportCode;
    this.reportParameters.transferType = 'ST';
    this.reportParameters.transferType1 = null;
    this.reportParameters.transferType2 = null;
    this.reportParameters.transferType3 = null;
    this.reportParameters.transferType4 = null;
    this.reportParameters.transferType5 = null;
    this.reportParameters.transferType6 = null;
    this.reportParameters.transferType7 = null;
    this.shortTransitReportWindow.open();
  }

  convertDate(date) {
    const formateddate = NgcUtility.getDateTimeByFormat(date, 'DD MMM YYYY')
    let dateArray = formateddate.toDateString().split(" ");
    if (dateArray.length > 0) {
      return dateArray[2] + "" + dateArray[1].toUpperCase();
    }
  }
  selectionRow(event) {
    if (this.checkRadioButton != null) {
      this.transshipmentHandlingSummaryForm.get(['flightList', this.checkRadioButton, 'select']).patchValue(false);
    }
    this.checkRadioButton = event;

  }
  onAddOutgoingFlight() {
    let dataToNavigate: any = new Array();
    console.log(this.transshipmentHandlingSummaryForm.get(['flightList']).value)
    var dataToSend = {

      flightKeyForInbound: this.transshipmentHandlingSummaryForm.get(['flightList', this.checkRadioButton, 'flightKey']).value,
      flightDateForInbound: this.transshipmentHandlingSummaryForm.get(['flightList', this.checkRadioButton, 'standardEstimatedDateTime']).value,
      by: this.transshipmentHandlingSummaryForm.get('by').value,
      dateTimeFrom: this.transshipmentHandlingSummaryForm.get('dateTimeFrom').value,
      dateTimeTo: this.transshipmentHandlingSummaryForm.get('dateTimeTo').value,
      carrierGroup: this.transshipmentHandlingSummaryForm.get('carrierGroup').value,
      carrier: this.transshipmentHandlingSummaryForm.get('carrier').value,
      transferType: this.transshipmentHandlingSummaryForm.get('transferType').value,

      flightKey: this.transshipmentHandlingSummaryForm.get('flightKey').value,
      flightDate: this.transshipmentHandlingSummaryForm.get('flightDate').value,

      outboundFlightKey: this.transshipmentHandlingSummaryForm.get('outboundFlightKey').value,
      outboundFlightDate: this.transshipmentHandlingSummaryForm.get('outboundFlightDate').value,
    }
    this.navigateTo(this.router, '/export/transhipment/inbound-flight-transhipment-list', dataToSend);


  }
}