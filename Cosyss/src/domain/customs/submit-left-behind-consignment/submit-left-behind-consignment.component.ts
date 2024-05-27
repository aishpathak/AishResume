import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcContainerComponent, ReactiveModel
  , NgcReportComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomACESService } from './../customs.service';


@Component({
  selector: 'app-submit-left-behind-consignment',
  templateUrl: './submit-left-behind-consignment.component.html',
  styleUrls: ['./submit-left-behind-consignment.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
  // restorePageOnBack: true
})
export class SubmitLeftBehindConsignmentComponent extends NgcPage implements OnInit {
  shipmentLists: any;
  resp: any;
  showTable: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private route: ActivatedRoute, private customsService: CustomACESService) {
    super(appZone, appElement, appContainerElement);
  }
  private customsForm: NgcFormGroup = new NgcFormGroup({
    flightDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    flightList: new NgcFormArray([
      new NgcFormGroup({
        flightDate: new NgcFormControl(),
        shipmentList: new NgcFormArray([
        ])
      })
    ])
  })

  ngOnInit() {
    super.ngOnInit();
    const transferData = this.getNavigateData(this.activatedRoute);
    try {
      if (transferData !== null && transferData !== undefined) {
        this.onSearchAuto(transferData);
      }
    }
    catch (e) { }
  }
  /**
    * Setting flight date when navigating back
    *
    * @param transferData
    */
  onSearchAuto(transferData) {
    this.customsForm.get('flightDate').setValue(transferData.flightDate);
    this.onSearch();
  }

  /**
    * Retreive all Flights related data for a particular date
    *
    */
  onSearch() {
    let request = this.customsForm.getRawValue();
    if (request.flightDate == null || request.flightDate == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.customsForm.get('flightDate'), "Mandatory");
    }
    this.customsService.searchCustomFlights(request).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data.data;
      if (!this.showResponseErrorMessages(data)) {
        if (this.resp != null) {
          this.customsForm.patchValue(this.resp);
          this.showTable = true;
        }
      }
      else {
        this.showTable = false;
      }
    }, error => {
      this.showErrorStatus(error);
    })
  }

  /**
   * Returns row value for serial number
   *
   * @returns
   */
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  /**
    * Used for navigation to Submit left behind shipment screen 
    * on the basis of flight id
    * 
    *@param index
    */
  openSubmitShipment(index: any) {
    var dataToSend = {
      flightId: this.customsForm.get(['flightList', index, 'flightId']).value,
    }
    this.navigateTo(this.router, '/customs/shipmentconsignment', dataToSend);
  }

}
