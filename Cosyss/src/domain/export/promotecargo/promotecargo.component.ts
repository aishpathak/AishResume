import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, NgcButtonComponent, NgcUtility, PageConfiguration, NgcReportComponent } from 'ngc-framework';

import { ExportService } from './../export.service';

@Component({
  selector: 'app-promotecargo',
  templateUrl: './promotecargo.component.html',
  styleUrls: ['./promotecargo.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  focusToBlank: true,
  focusToMandatory: true
})
export class PromotecargoComponent extends NgcPage {
  response: any;
  showAllControls: boolean = false;
  showPromoteButton: boolean = false;
  forwardedData: any;
  bookingByFlight: boolean;
  bookingByInventory: boolean;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private service: ExportService
    , private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }


  form: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    totalPieces: new NgcFormControl(),
    totalWeight: new NgcFormControl(),
    promoteCargoFlightList: new NgcFormArray([]),
    promoteCargoInventoryList: new NgcFormArray([])
  });

  ngOnInit() {
    const transferData = this.getNavigateData(this.activatedRoute);
    this.forwardedData = transferData;
  }

  onSearch() {
    this.showPromoteButton = false;
    //let shipmentNumber = this.form.get('shipmentNumber').value;
    let request = new Object();
    request = {
      shipmentNumber: this.form.get('shipmentNumber').value
    }
    this.form.get('promoteCargoFlightList').reset();
    this.form.get('promoteCargoInventoryList').reset();
    this.service.promoteCargoSearch(request).subscribe(data => {
      if (data.data) {
        this.resetFormMessages();
        this.showAllControls = true;
        this.response = data.data;
        if (this.response.promoteCargoFlightList) {
          this.response.promoteCargoFlightList.forEach(element => {
            if (element.dateSTD) {
              element.dateSTD = element.dateSTD.substring(0, 10);
            }
            if (element.stdTime) {
              element.stdTime = element.stdTime.substring(0, 5);
            }
            element.totalLoadedPieces = 0;
            element.totalLoadedWeight = 0;
            element.loadedInfo.forEach(element1 => {
              element.totalLoadedPieces = element.totalLoadedPieces + element1.loadedPieces;
              element.totalLoadedWeight = element.totalLoadedWeight + element1.loadedWeight;
              if (!element.allAssignedUldTrolleyNumber) {
                element.allAssignedUldTrolleyNumber = element1.assignedUldTrolleyNumber;
              } else {
                element.allAssignedUldTrolleyNumber = element.allAssignedUldTrolleyNumber + ' ' + element1.assignedUldTrolleyNumber;
              }
            });
          });
        }
        this.form.patchValue(data.data);
      } else {
        this.refreshFormMessages(data);
        this.showAllControls = false;
      }

    })
  }

  checkToPromote(item, selectedTab) {
    if (item.value.selectToPromote) {
      this.showPromoteButton = true;
      if (selectedTab === 'flight') {
        this.bookingByFlight = true;
        this.bookingByInventory = false;
      }
      if (selectedTab === 'inventory') {
        this.bookingByFlight = false;
        this.bookingByInventory = true;
      }
    } else {
      this.showPromoteButton = false;
      this.bookingByFlight = false;
      this.bookingByInventory = false;
    }

  }

  onPromote() {
    if (this.bookingByInventory) {
      if (this.response.promoteCargoFlightList && this.response.promoteCargoFlightList.length > 1) {
        this.showErrorStatus('export.shipment.booked.in.multiple.flights.validation');
        return;
      }
      if (this.response.promoteCargoInventoryList && this.response.promoteCargoInventoryList.length > 0
        && (!this.response.promoteCargoInventoryList[0].shipmentLocation && !this.response.promoteCargoInventoryList[0].wareHouseLocation)) {
        this.showErrorStatus('export.no.inventory.to.promote');
        return;
      }
    }
    let selectedShipmentsToPromote = this.form.getRawValue().promoteCargoFlightList;

    let selectedInventoriesToPromote = this.form.getRawValue().promoteCargoInventoryList;

    let request: any;
    request = {
      shipmentNumber: this.form.get('shipmentNumber').value,
      flightKey: this.forwardedData.flightKey,
      flightDate: this.forwardedData.dateSTD,
      flightId: this.forwardedData.flightId,
      segmentId: this.forwardedData.segmentId,
      flightOffPoint: this.forwardedData.flightOffPoint,
      flightBoardPoint: this.forwardedData.flightBoardPoint,
      bookingByInventory: this.bookingByInventory,
      bookingByFlight: this.bookingByFlight,
      shipmentListToPromote: selectedShipmentsToPromote,
      inventoryListToPromote: selectedInventoriesToPromote
    }

    this.service.promoteCargo(request).subscribe(data => {
      if (data.data) {
        this.onSearch();
        this.showSuccessStatus('g.operation.successful');
      } else {
        this.refreshFormMessages(data);
      }
    })
  }

  onCancel(item) {
    this.navigateTo(this.router, '/export/exportworkinglist', this.forwardedData);
  }

}
