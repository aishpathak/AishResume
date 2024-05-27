import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,   NgcWindowComponent, PageConfiguration } from 'ngc-framework';

@Component({
  selector: 'ngc-displayspecialshipment',
  templateUrl: './displayspecialshipment.component.html',
  styleUrls: ['./displayspecialshipment.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class DisplaySpecialShipmentComponent extends NgcPage {
dataDisplay: boolean = true;
shipmentList: any = [ 'All', 'Export', 'Import', 'Transit'];
   constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef) {
        super(appZone, appElement, appContainerElement);
    }

   private specialShipmentForm: NgcFormGroup = new NgcFormGroup({
        terminal: new NgcFormControl(),
        dateFrom: new NgcFormControl(),
        dateTo: new NgcFormControl(),
        carrier: new NgcFormControl(),
        flight: new NgcFormControl(),
        shipmentType: new NgcFormControl(),
        excludeRAC: new NgcFormControl(false),
        specialHandlingCode: new NgcFormControl(),
        specialShipmentList: new NgcFormArray([
        ])
  });

  ngOnInit() {
  }

}
