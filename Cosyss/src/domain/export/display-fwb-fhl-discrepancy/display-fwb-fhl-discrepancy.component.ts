import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration } from 'ngc-framework';
import { Router } from '@angular/router';
@Component({
  selector: 'ngc-display-fwb-fhl-discrepancy',
  templateUrl: './display-fwb-fhl-discrepancy.component.html',
  styleUrls: ['./display-fwb-fhl-discrepancy.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class DisplayFwbFhlDiscrepancyComponent extends NgcPage {
  private form: NgcFormGroup = new NgcFormGroup({
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    date: new NgcFormControl(),
    eawb: new NgcFormControl(),
    flight: new NgcFormControl(),
    consol: new NgcFormControl(),
    status: new NgcFormControl(),
    selectSegment: new NgcFormControl(),
    shipmentStatus: new NgcFormControl(),
    manifestControl: new NgcFormControl(),
    singleprocessprint: new NgcFormControl(),
    placeweightdiscrepancy: new NgcFormControl(),
    outgoingFlights: new NgcFormArray([])
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
}
