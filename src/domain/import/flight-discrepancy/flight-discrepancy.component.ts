import { Component, OnInit, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import {
  NgcFormControl, NgcFormGroup, NgcFormArray, NgcPage,
  NgcWindowComponent, CellsRendererStyle, NgcReportComponent, NgcButtonComponent, NgcUtility, PageConfiguration, NgcPrinterComponent
} from 'ngc-framework';
import { ImportService } from '../import.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlightDiscrepancyRequest } from '../import.sharedmodel';

@Component({
  selector: 'app-flight-discrepancy',
  templateUrl: './flight-discrepancy.component.html',
  styleUrls: ['./flight-discrepancy.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})

export class FlightDiscrepancyComponent extends NgcPage implements OnInit {
  searchflag: boolean = false;
  response: any;
  displayData: boolean;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private form: NgcFormGroup = new NgcFormGroup({
    flightNumber: new NgcFormControl(),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    flightType: new NgcFormControl(),
    searchFlightDiscrepancyList: new NgcFormArray([]),
  })

  ngOnInit() {
  }

  onLinkClick(event) {
    var dataToSend = {
      flight: event.record.flightNumber,
      flightDate: event.record.arrivalDate
    }

    this.navigateTo(this.router, 'import/flightdiscrepancylist', dataToSend);
  }


  onSearch() {
    this.displayData = false;
    this.form.validate();
    if (this.form.get('fromDate').value == undefined || this.form.get('fromDate').value == "" || this.form.get('fromDate').value == null
      || this.form.get('toDate').value == undefined || this.form.get('toDate').value == "" || this.form.get('toDate').value == null) {
      this.showErrorMessage('enter.fromDate.ToDate');
      return;
    }


    if (this.form.get('toDate').value < this.form.get('fromDate').value) {
      this.showErrorMessage('fromDate.cannot.toDate');
      return;
    }



    const request: FlightDiscrepancyRequest = new FlightDiscrepancyRequest();
    const rawData = this.form.getRawValue();
    request.fromDate = this.form.get("fromDate").value;
    request.toDate = this.form.get("toDate").value;
    request.flightNumber = this.form.get("flightNumber").value;
    request.carrierCode = this.form.get("carrierCode").value;

    request.flightType = this.form.get("flightType").value;

    console.log(rawData);
    this.resetFormMessages();
    this.importService.getFlightDiscrepancy(request).subscribe(
      data => {
        if (data.data == null) {
          this.form.get("searchFlightDiscrepancyList").patchValue({});
          this.showErrorMessage(data.messageList[0].code);
        }

        else
          if (!this.showResponseErrorMessages(data)) {
            this.response = data.data;
            this.displayData = true;
            this.form.get("searchFlightDiscrepancyList").patchValue(this.response);
            console.log(this.form.get("searchFlightDiscrepancyList").value);
            //this.form.patchValue(this.response);
          }

      })



  };
}
