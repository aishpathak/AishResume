import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcContainerComponent, ReactiveModel
  , NgcReportComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehouseService } from '../warehouse.service';

@Component({
  selector: 'app-print-accessory-usage',
  templateUrl: './print-accessory-usage.component.html',
  styleUrls: ['./print-accessory-usage.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
  // restorePageOnBack: true
})
export class PrintAccessoryUsageComponent extends NgcPage implements OnInit  {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  reportParameters: any = new Object();
  currentDate = new Date();
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private warehouseService: WarehouseService) {
    super(appZone, appElement, appContainerElement);
  }

  private printAccessoryForm: NgcFormGroup = new NgcFormGroup({
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    carrier: new NgcFormControl(),
    accessory: new NgcFormControl(),
    byFlight: new NgcFormControl(true),
    byEir: new NgcFormControl(false),
    bySummary: new NgcFormControl(false),

  })
  ngOnInit() {
    super.ngOnInit();
  
  }
  /**
   * Used for generating report
   *
   * @returns
   */
  onreportcreation() {
    let accessoryData = this.printAccessoryForm.getRawValue();
    let accessoryArray = this.printAccessoryForm.get('accessory').value;
    if (!this.printAccessoryForm.get('fromDate').value || !this.printAccessoryForm.get('toDate').value || !this.printAccessoryForm.get('accessory').value || accessoryArray.length==0 || !this.printAccessoryForm.get('carrier').value ) {
      return this.showErrorMessage('g.fill.all.details');
    }

    if (this.printAccessoryForm.get('fromDate').value > this.printAccessoryForm.get('toDate').value ) {
      return this.showErrorMessage("tracing.date.from.greater.to");
    }

    this.resetFormMessages();
   //setting report parameters
    this.reportParameters = new Object();
    this.reportParameters.fromDate = accessoryData.fromDate
    this.reportParameters.toDate = accessoryData.toDate
    this.reportParameters.carrierCode = accessoryData.carrier;
    this.reportParameters.accessory = accessoryData.accessory.toString();
    this.reportParameters.tenantAirportCode = NgcUtility.getTenantConfiguration().airportCode;
    console.log(this.reportParameters);
    //if radiobutton byFlight is selected
    if (this.printAccessoryForm.get('byFlight').value){
      this.reportWindow.open();
    }
    
  }


}
