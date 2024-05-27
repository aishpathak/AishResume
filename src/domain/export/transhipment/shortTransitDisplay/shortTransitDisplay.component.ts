import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, ReactiveModel, PageConfiguration, NgcReportComponent, NgcUtility, DateTimeKey } from 'ngc-framework';
import { TranshipmentHandlingSummaryModel, TranshipmentHandlingSummaryRequest, GetOutgoingTransshipmentFlightsRequest } from '../transhipment.sharedmodel.ts';
import { TranshipmentService } from '../transhipment.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-shortTransitDisplay',
  templateUrl: './shortTransitDisplay.component.html',
  styleUrls: ['./shortTransitDisplay.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class ShortTransitDisplayComponent extends NgcPage implements OnInit {
  @ViewChild('inboundReportWindow') inboundReportWindow: NgcReportComponent;
  @ViewChild('outboundReportWindow') outboundReportWindow: NgcReportComponent;
  reportParameters: any = new Object();
  request: any;
  response: any;
  test = '#f1f1f1';
  requestDataFromNextPage: any = null;
  tableflag: boolean = false;
  @ReactiveModel(TranshipmentHandlingSummaryModel)
  public shortTransitFormGroup: NgcFormGroup;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private transhipmentService: TranshipmentService, private router: Router, private activatedRoute: ActivatedRoute, ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null) {
      if (forwardedData.flightNumber != null && forwardedData.flightNumber != ""
        && forwardedData.flightDate != null && forwardedData.flightDate != "") {
        this.shortTransitFormGroup.get('dateTimeFrom').setValue(forwardedData.dateTimeFrom);
        this.shortTransitFormGroup.get('dateTimeTo').setValue(forwardedData.dateTimeTo);
        this.shortTransitFormGroup.get('by').setValue(forwardedData.by);
        this.shortTransitFormGroup.get('flightKey').setValue(forwardedData.flightNumber);
        this.shortTransitFormGroup.get('flightDate').setValue(forwardedData.flightDate);
        this.getFlightList();
      }
    } else {
      this.shortTransitFormGroup.get('dateTimeTo').patchValue(NgcUtility.addDate(new Date(), 12, DateTimeKey.HOURS));
    }
  }


  getFlightList() {

    const request = new TranshipmentHandlingSummaryRequest();
    request.by = this.shortTransitFormGroup.get('by').value;
    request.dateTimeFrom = this.shortTransitFormGroup.get('dateTimeFrom').value;
    request.dateTimeTo = this.shortTransitFormGroup.get('dateTimeTo').value;
    request.carrier = this.shortTransitFormGroup.get('carrier').value;
    request.flightKey = this.shortTransitFormGroup.get('flightKey').value;
    request.flightDate = this.shortTransitFormGroup.get('flightDate').value;
    request.terminalRequest = this.shortTransitFormGroup.get('terminalRequest').value;
    request.terminal = request.terminalRequest;
    request.outboundCarrier = this.shortTransitFormGroup.get('outboundCarrier').value;
    request.transferType = this.shortTransitFormGroup.get('transferType').value;
    if (request.flightKey != null && request.flightDate == null) {
      this.showErrorMessage("export.input.flight.date");
      return;
    }
    if (request.flightKey == null && request.flightDate != null) {
      this.showErrorMessage("export.input.flight.key.");
      return;
    }

    this.request = request;
    this.transhipmentService.getListOfShortTransitFlights(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        let lisOfShipments = [];
        for (var x in response.data) {
          response.data.hasOwnProperty(x) && lisOfShipments.push(response.data[x])
        }
        if (lisOfShipments.length != 0) {
          this.tableflag = true;
          this.response = response.data;
          this.response.forEach(element => {
            if (element.uldKey == null) {
              element.uldKey = "BULK";
            }
            element.origin = element.origin + '' + element.destination;
          });
          this.shortTransitFormGroup.get('shipmentList').patchValue(response.data);
        } else {
          this.tableflag = false;
          if (this.request.flightKey != null && this.request.flightDate != null) {
            this.showErrorMessage("export.no.flights.specific.input");
          } else {
            this.showErrorMessage("no.record");
          }

        }
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }


  printReport() {
    this.reportParameters.fromDateFlag = '1';

    this.reportParameters.fromDate = NgcUtility.getDateTimeAsString(this.shortTransitFormGroup.controls[
      "dateTimeFrom"
    ].value);
    this.reportParameters.toDate = NgcUtility.getDateTimeAsString(this.shortTransitFormGroup.controls[
      "dateTimeTo"
    ].value);

    if (this.shortTransitFormGroup.get('flightKey').value != null && this.shortTransitFormGroup.get('flightDate').value != null) {
      this.reportParameters.flightKey = this.shortTransitFormGroup.get('flightKey').value;
      this.reportParameters.flightDate = this.shortTransitFormGroup.get('flightDate').value;
      this.reportParameters.flightFlag = '1';
    } else {
      this.reportParameters.flightKey = null;
      this.reportParameters.flightDate = null;
      this.reportParameters.flightFlag = '0';
    }
    if (this.shortTransitFormGroup.get('carrier').value != null) {
      this.reportParameters.carrierCode = this.shortTransitFormGroup.get('carrier').value;
      this.reportParameters.carrierCodeFlag = '1';
    } else {
      this.reportParameters.carrierCode = null;
      this.reportParameters.carrierCodeFlag = '0';
    }
    if (this.shortTransitFormGroup.get('outboundCarrier').value != null) {
      this.reportParameters.onwardCarrier = this.shortTransitFormGroup.get('outboundCarrier').value;
      this.reportParameters.onwardCarrierFlag = '1';
    } else {
      this.reportParameters.onwardCarrier = null;
      this.reportParameters.onwardCarrierFlag = '0';
    }
    if (this.request.terminal != null) {
      this.reportParameters.terminalRequest = this.request.terminal;
      this.reportParameters.terminalFlag = '1';
    } else {
      this.reportParameters.terminalRequest = null;
      this.reportParameters.terminalFlag = '0';
    }
    if (this.request.transferType == null || this.request.transferType.length == 0) {
      this.reportParameters.transferType = null;
      this.reportParameters.transferTypeFlag = '1';
    } else {
      let transferType = '';
      this.request.transferType.forEach(item => {
        transferType += item + ',';
      });
      this.reportParameters.transferTypeFlag = '0';
      this.reportParameters.transferType = transferType.substring(0, transferType.length - 1);
    }

    if (this.request.by.localeCompare('inbound') == 0) {
      this.inboundReportWindow.open();
    }
    else {
      this.outboundReportWindow.open();
    }
  }

  onClear() {
    (<NgcFormArray>this.shortTransitFormGroup.get(['flightList'])).resetValue([]);
    this.shortTransitFormGroup.reset();
  }
  public groupsRenderer(value: string |
    number, rowData: any, level: any): string {
    if (level == 0) {
      let flight = rowData.data.flightKey.slice(0, 26)
        + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        + rowData.data.flightKey.slice(26, 55);
      return (flight).bold();
    } else {
      return (rowData.data.uldKey).bold();
    }

  }

}