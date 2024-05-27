
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ImportService } from './../import.service';
import { BreakDownSummaryModel, DelayStatusSearch, DelayStatusData } from '../import.sharedmodel';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, PageConfiguration, NgcFormControl, ReactiveModel, NgcUtility, DateTimeKey } from 'ngc-framework';
import { Validators } from '@angular/forms';
@Component({
  selector: 'app-delaystatus',
  templateUrl: './delaystatus.component.html',
  styleUrls: ['./delaystatus.component.scss']
})

@PageConfiguration({
  trackInit: true,
  // callNgOnInitOnClear: true,
  autoBackNavigation: true,
  //restorePageOnBack: true

})
export class DelaystatusComponent extends NgcPage {
  forwardedData: any
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private importService: ImportService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.searchForm.get('terminals').setValue('T6');

    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData != null) {
      if (this.forwardedData.flightNumber != null && this.forwardedData.flightNumber != "" && this.forwardedData.flightDate != null && this.forwardedData.flightDate != "") {
        this.searchForm.get('flight').setValue(this.forwardedData.flightNumber);
        this.searchForm.get('date').setValue(this.forwardedData.flightDate);
        this.onSearch();
      }

    }

    if (this.forwardedData == null) {
      const data: any = this.retrievePageState("Delay Status");
      if (data != null) {
        this.searchForm.get('flight').setValue(data.flight);
        this.searchForm.get('date').setValue(data.date);
        this.searchForm.get('carrierGroup').setValue(data.carrierGroup);
        this.searchForm.get('flightClosed').setValue(data.flightClosed);
        this.searchForm.get('fromDate').setValue(data.fromDate);
        this.searchForm.get('toDate').setValue(data.toDate)

        this.onSearch();


      }

    }

  }

  isFlightInformation: boolean = false;
  isflightClosed: boolean = false;
  reOpenflight: boolean = false;

  @ReactiveModel(DelayStatusSearch)
  public searchForm: NgcFormGroup;

  @ReactiveModel(DelayStatusData)
  public DelayData: NgcFormGroup;



  public onSearch(): void {
    let searchRequest: DelayStatusSearch = new DelayStatusSearch();
    searchRequest.flightNumber = this.searchForm.get('flight').value;
    searchRequest.flightDate = this.searchForm.get('date').value;
    searchRequest.carrierGroup = this.searchForm.get('carrierGroup').value;
    searchRequest.flightClosed = this.searchForm.get('flightClosed').value == "true" ? 'YES' : 'NO';
    searchRequest.fromDate = this.searchForm.get('fromDate').value;
    searchRequest.toDate = this.searchForm.get('toDate').value;
    this.importService.fetchDelayStatus(searchRequest).subscribe(data => {
      console.log(data);
      this.refreshFormMessages(data);
      this.isFlightInformation = false;
      if (data.data.length == 0) {
        this.showErrorMessage('no.flight.details.found');
        return;
      }
      if (!this.showResponseErrorMessages(data)) {
        this.isFlightInformation = true;
        this.DelayData.get('delayStatusArray').patchValue(data.data);
        if (data.data[0].flightClosedFlag) {
          this.reOpenflight = true;
          this.isflightClosed = false;
        } else {
          this.isflightClosed = true;
          this.reOpenflight = false;
        }
        console.log(this.DelayData);
      }
    });
  }

  public closeFlight(): void {

    let searchRequest: DelayStatusSearch = new DelayStatusSearch();
    console.log(this.DelayData.get('delayStatusArray'));
    const item = (<NgcFormArray>this.DelayData.get('delayStatusArray')).getRawValue();
    let count = 0;
    for (let index = 0; index < item.length; index++) {
      if (item[index].flagInsert == true) {
        searchRequest.flightId = item[index].flightId;
        searchRequest.flightNumber = item[index].flightNumber;
        searchRequest.flightDate = item[index].flightDate
        searchRequest.flagCRUD = 'C';
        if (item[index].delayInMinutes > 0) {
          if (!item[index].ldApplicable) {
            if (!item[index].ldWaive) {
              this.showErrorMessage('flight.cannot.closed.ld.details');
              return;
            }
          }
        }
        count++;
      }
    }
    if (count == 0) {
      this.showErrorMessage('please.select.record');
      return;
    }
    if (count > 1) {
      this.showErrorMessage('select.only.one.flight');
      return;
    }

    this.importService.closeFlight(searchRequest).subscribe(data => {
      console.log(data);
      this.refreshFormMessages(data);
      if (!data.messageList) {
        this.showSuccessStatus('flight.closed.successfully');
      }
    });
  }

  public reopenFlight(): void {
    let searchRequest: DelayStatusSearch = new DelayStatusSearch();
    console.log(this.DelayData.get('delayStatusArray'));
    const item = (<NgcFormArray>this.DelayData.get('delayStatusArray')).getRawValue();
    let count = 0;
    for (let index = 0; index < item.length; index++) {
      if (item[index].flagInsert == true) {
        searchRequest.flightId = item[index].flightId;
          searchRequest.flightNumber = item[index].flightNumber;
        searchRequest.flightDate = item[index].flightDate
        searchRequest.flagCRUD = 'D';
        count++;
      }
    }
    if (count == 0) {
      this.showErrorMessage('select.any.row');
      return;
    }
    if (count > 1) {
      this.showErrorMessage('select.only.one.flight');
      return;
    }

    this.importService.closeFlight(searchRequest).subscribe(data => {
      console.log(data);
      this.refreshFormMessages(data);
      this.showSuccessStatus('flight.reopened.successfully');
    });
  }


  public loadCreate(): void {
    this.savePageValue();
    const item = (<NgcFormArray>this.DelayData.get('delayStatusArray')).getRawValue();
    let shipmentData = {};
    let count = 0;
    for (let index = 0; index < item.length; index++) {
      if (item[index].flagInsert == true) {
        shipmentData = {
          flightNumber: item[index].flightNumber,
          flightDate: item[index].flightDate,
          screen: 'Delay Status'
        };
        count++;
      }
    }

    if (count == 0) {
      this.showErrorMessage('select.any.row');
      return;
    }
    if (count > 1) {
      this.showErrorMessage('select.only.one.flight');
      return;
    }
    let url = "/import/breakdownsummary";
    this.navigateTo(this.router, url, shipmentData);
  }

  public loadFlightMonitoring(): void {
    const item = (<NgcFormArray>this.DelayData.get('delayStatusArray')).getRawValue();
    let shipmentData = {};
    let count = 0;
    for (let index = 0; index < item.length; index++) {
      if (item[index].flagInsert == true) {
        shipmentData = {
          flightNumber: item[index].flightNumber,
          flightDate: item[index].flightDate
        };
        count++;

      }
    }

    if (count == 0) {
      this.showErrorMessage('select.any.row');
      return;
    }
    if (count > 1) {
      this.showErrorMessage('select.only.one.flight');
      return;
    }
    let url = "/import/inboundFlightMonitoring";
    this.navigateTo(this.router, url, shipmentData);
  }

  public loadPaymentSummary(): void {
    const item = (<NgcFormArray>this.DelayData.get('delayStatusArray')).getRawValue();
    let shipmentData = {};
    let count = 0;
    for (let index = 0; index < item.length; index++) {
      if (item[index].flagInsert == true) {
        shipmentData = {
          flightNumber: item[index].flightNumber,
          flightDate: item[index].flightDate
        };
        count++;
      }
    }

    if (count == 0) {
      this.showErrorMessage('select.any.row');
      return;
    }
    if (count > 1) {
      this.showErrorMessage('select.only.one.flight');
      return;
    }
    let url = "/billing/collectPayment/enquireCharges";
    this.navigateTo(this.router, url, shipmentData);
  }

  onFlightChange() {
    if (<NgcFormControl>this.searchForm.get('flight').value) {
      (<NgcFormControl>this.searchForm.get('date')).setValidators(Validators.required);
    } else {
      (<NgcFormControl>this.searchForm.get('date')).clearValidators();
    }
  }

  onFromDateChange() {
    if (<NgcFormControl>this.searchForm.get('fromDate').value) {
      (<NgcFormControl>this.searchForm.get('fromTo')).setValidators(Validators.required);
    } else {
      (<NgcFormControl>this.searchForm.get('fromTo')).clearValidators();
    }
  }

  onToDateChange() {
    if (<NgcFormControl>this.searchForm.get('toDate').value) {
      (<NgcFormControl>this.searchForm.get('toDate')).setValue(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), (23 * 60) + 59,
        DateTimeKey.MINUTES));
    }




  }
  savePageValue() {
    this.savePageState("Delay Status", this.searchForm.getRawValue());
  }
  onClear() {
    this.resetFormMessages();
    this.searchForm.reset()
    this.searchForm.get('terminals').setValue('T6');
    this.searchForm.get('fromDate').setValue(NgcUtility.getCurrentDateOnly())
    this.searchForm.get('toDate').setValue(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), (23 * 60) + 59,
      DateTimeKey.MINUTES))
    this.searchForm.get('flightClosed').setValue('NO')
    this.isFlightInformation = false;
  }
}
