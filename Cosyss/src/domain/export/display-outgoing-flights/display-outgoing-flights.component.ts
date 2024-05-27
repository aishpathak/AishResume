import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration } from 'ngc-framework';
import { Router } from '@angular/router';
@Component({
  selector: 'app-display-outgoing-flights',
  templateUrl: './display-outgoing-flights.component.html',
  styleUrls: ['./display-outgoing-flights.component.scss']
})
/**
* Display Outgoing Flights to enable the user to list all outbound flights that are handled at a specific Terminal.
*/
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class DisplayOutgoingFlightsComponent extends NgcPage {
  private form: NgcFormGroup = new NgcFormGroup({
    terminal: new NgcFormControl(),
    dateFrom: new NgcFormControl(),
    timeFrom: new NgcFormControl(),
    dateTo: new NgcFormControl(),
    timeTo: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    carrier: new NgcFormControl(),
    flight: new NgcFormControl(),
    flightType: new NgcFormControl(),
    offPoint: new NgcFormControl(),
    outgoingFlights: new NgcFormArray([
      new NgcFormGroup(
        {
          select: new NgcFormControl(),
          sno: new NgcFormControl(),
          terminal: new NgcFormControl(),
          flight: new NgcFormControl(),
          std: new NgcFormControl(),
          etd: new NgcFormControl(),
          atd: new NgcFormControl(),
          aircraft: new NgcFormControl(),
          ac: new NgcFormControl(),
          bay: new NgcFormControl(),
          routing: new NgcFormControl(),
          dls: new NgcFormControl(),
          dlsprecision: new NgcFormControl(),
          flightcloseprecision: new NgcFormControl(),
          man: new NgcFormControl(),
          dep: new NgcFormControl(),
          ofld: new NgcFormControl(),
          rmk: new NgcFormControl(),
        }
      )
    ])
  });
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }
  /**
  * On Destroy
  */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
  offloadUldAwb() {

   }

  displayUldAssignment() {

   }

  workingList() {

   }

  displayDls() {

   }

  displayManifest() {

   }

  flightComplete() {

   }
}
