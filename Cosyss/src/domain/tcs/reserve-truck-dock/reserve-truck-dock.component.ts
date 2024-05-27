import { Component, ElementRef, Input, NgZone, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormControl, NgcWindowComponent, NgcFormArray
  , PageConfiguration
} from 'ngc-framework';
import { TcsService } from '../tcs.service';

@Component({
  selector: 'app-reserve-truck-dock',
  templateUrl: './reserve-truck-dock.component.html',
  styleUrls: ['./reserve-truck-dock.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class ReserveTruckDockComponent extends NgcPage {
  @ViewChild('createUpdateWindow') createUpdateWindow: NgcWindowComponent;
  @Input('truckDockMonitoringData') truckDockMonitoringData;
  windowType: string;
  reserveTruckObject: any;
  showData: boolean = false;
  showWindow: boolean = false;
  private reserveTruckDockSearchForm: NgcFormGroup = new NgcFormGroup({
    truckDockNo: new NgcFormControl(),
    resourceId: new NgcFormControl(),
    vehicleNo: new NgcFormControl(),
    reservedFromDateTime: new NgcFormControl(),
    reservedTillDateTime: new NgcFormControl(),
    reason: new NgcFormControl(),
  });
  public reserveTruckDock: NgcFormGroup = new NgcFormGroup({
    reserveTruckDockList: new NgcFormArray([])
  });

  /**
   * Initialize
   *
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private tcsService: TcsService) {
    //
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
  }
  /**
    * Create
    * 
    * @param data Window Ref
    */
  onCreateWindow(data: any) {
    if (data == 'create') {
      this.showWindow = true;
      this.reserveTruckObject = null;
      this.reserveTruckObject = {
        flag: 'C'
      }
      this.createUpdateWindow.open();
    } else if (data.column == 'edit') {
      this.showWindow = true;
      this.reserveTruckObject = data.record;
      this.reserveTruckObject.flag = 'U'
      this.createUpdateWindow.open();
    } else if (data.column == 'delete') {
      this.showWindow = false;
      this.reserveTruckObject = data.record;
      this.reserveTruckObject.flag = 'D';
      this.showConfirmMessage("Do you want to delete the record?").then(fulfilled => {
        this.tcsService.deleteReserveTruckDock(data.record).subscribe(data => {
          if (!this.showResponseErrorMessages(data)) {
            this.showSuccessStatus("g.operation.successful");
            // Search Again
            this.onSearch();
          }
        });
      }).catch(reason => { });;

    }
  }
  onSearch() {
    this.showData = false;
    this.reserveTruckDockSearchForm.validate();
    if (this.reserveTruckDockSearchForm.invalid) {
      return;
    }
    const request = this.reserveTruckDockSearchForm.getRawValue();
    this.tcsService.searchReserveTruckDock(request).subscribe((response) => {
      this.showData = true;
      if (response.data && response.data.length > 0) {
        this.showData = true;
        (<NgcFormArray>this.reserveTruckDock.get(['reserveTruckDockList'])).patchValue(response.data);
      } else {
        this.refreshFormMessages(response);
      }
    }, error => {
      this.showErrorStatus('Error:' + error);
    });
  }
  reserveTruckResponse(type) {
    this.showWindow = false;
    this.createUpdateWindow.close();
  }
  /**
* LifeCycle Hook
* search the house info if the parentData value is changed 
* 
* @param changes 
*/
  ngOnChanges(changes: SimpleChanges) {
    if (changes.truckDockMonitoringData.currentValue) {
      this.reserveTruckDockSearchForm.get('truckDockNo').patchValue(changes.truckDockMonitoringData.currentValue.dockNumber);
      this.reserveTruckDockSearchForm.get('vehicleNo').patchValue(changes.truckDockMonitoringData.currentValue.truckNumber);
    }
  }
}
