import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { TruckdockMonitoringRequest } from '../../export.sharedmodel';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, NgcButtonComponent, NgcUtility, PageConfiguration, UserProfile, DateTimeKey } from 'ngc-framework';
import { AcceptanceService } from '../acceptance.service';
@Component({
  selector: 'ngc-truckdock-acceptance-monitoring',
  templateUrl: './truckdock-acceptance-monitoring.component.html',
  styleUrls: ['./truckdock-acceptance-monitoring.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class TruckdockAcceptanceMonitoringComponent extends NgcPage {
  @ViewChild('searchbutton') searchbutton: NgcButtonComponent;
  data: any;
  private truckdockAcceptanceMonitoringForm: NgcFormGroup = null;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private acceptanceService: AcceptanceService) {
    super(appZone, appElement, appContainerElement);
  }
  onSearch() {
    let request: TruckdockMonitoringRequest = new TruckdockMonitoringRequest();
    request = this.truckdockAcceptanceMonitoringForm.getRawValue();
    for (var key in request) {
      if (request.hasOwnProperty(key)) {
        var val = request[key];
        if (val === '') {
          request[key] = null;
        }
      }
    }
    this.searchbutton.disabled = true;
    this.acceptanceService.getTruckdockMonitoringData(request).subscribe(data => {
      this.data = null;
      this.refreshFormMessages(data);
      if (!data.messageList && data.data) {
        if (data.data.monitoringList.length) {
          this.data = data.data;
          this.truckdockAcceptanceMonitoringForm.get('monitoringList').patchValue(this.data.monitoringList);
        } else {
          this.showInfoStatus('NO_RECORDS_EXIST');
        }
      }
      this.searchbutton.disabled = false;
    }, error => {
      this.searchbutton.disabled = false;
    });
  }
  cellsRenderer(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }
  ngOnInit() {
    this.initialise();
  }
  initialise() {
    this.data = null;
    this.truckdockAcceptanceMonitoringForm = new NgcFormGroup({
      datetimeFrom: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), 1, DateTimeKey.MINUTES)),
      datetimeTo: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),
      terminalPoint: new NgcFormControl(this.getUserProfile().terminalId),
      shipmentNumber: new NgcFormControl(),
      carrier: new NgcFormControl(),
      destination: new NgcFormControl(),
      status: new NgcFormControl(),
      shc: new NgcFormControl(),
      serviceNumber: new NgcFormControl(),
      monitoringList: new NgcFormArray([])
    });
    this.subscribeValidateSearch();
  }
  subscribeValidateSearch() {
    this.truckdockAcceptanceMonitoringForm.valueChanges.subscribe(data => {
      this.resetFormMessages();
      this.showResponseErrorMessages(data);
    });
  }
}
