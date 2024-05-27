import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {
  NotificationMessage, StatusMessage, MessageType, DropDownListRequest, BaseResponse,
  NgcTabsComponent, CellsRendererStyle, NgcPage, NgcFormGroup, NgcWindowComponent,
  NgcFormArray, NgcFormControl, NgcDropDownComponent, NgcUtility, NgcButtonComponent,
  NgcDataTableComponent, PageConfiguration
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportService } from './../../export.service';
import { AwbReservationSearch, AwbReservation } from './../../export.sharedmodel';
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
@Component({
  selector: 'app-awb-reservation',
  templateUrl: './awb-reservation.component.html',
  styleUrls: ['./awb-reservation.component.scss']
})
export class AwbReservationComponent extends NgcPage {

  nextAwbResponse: any;
  saveResponse: any;
  searchResponse: any;
  searchFlg: boolean = false;
  carrierCodeSourceParameter: any;
  private awbSourceParameter: any;
  terminalSourceParameter: any;
  searchRequest: AwbReservationSearch = new AwbReservationSearch();
  private awbReservationGroup: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    stockId: new NgcFormControl(),
    svc: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    shipperId: new NgcFormControl(),
    shipperName: new NgcFormControl(),
    destination: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    terminalId: new NgcFormControl(),
    core: new NgcFormControl(),
    origin: new NgcFormControl(NgcUtility.getTenantConfiguration().airportCode),
    awbStockDetailsId: new NgcFormControl(),
    terminalDescription: new NgcFormControl(),
    coreDescription: new NgcFormControl(),
    stockDescription: new NgcFormControl(),
    shipperCode: new NgcFormControl()
  });
  private searchReservedFormGroup: NgcFormGroup = new NgcFormGroup({
    terminalId: new NgcFormControl(),
    destination: new NgcFormControl(),
    core: new NgcFormControl(),
    bookedList: new NgcFormArray([
      new NgcFormGroup({
        awbNumber: new NgcFormControl(),
        status: new NgcFormControl(),
        destination: new NgcFormControl(),
        flight: new NgcFormControl(),
        std: new NgcFormControl(),
        segment: new NgcFormControl(),
        shipperName: new NgcFormControl(),
        staff: new NgcFormControl(),
        reservationDate: new NgcFormControl(),
        selectFlg: new NgcFormControl()
      })
    ])
  })
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private exportService: ExportService) {
    super(appZone, appElement, appContainerElement);
  }


  ngOnInit() {
  }


  onShipperCodeSelection(event) {
    this.awbReservationGroup.get('shipperName').setValue(event.desc);
    this.awbReservationGroup.get('shipperId').setValue(event.parameter1);
    this.awbReservationGroup.get('shipperCode').setValue(event.code);
  }
  onSelectStockId(event) {
    this.findNextAwbNumber();
    this.awbReservationGroup.get('stockDescription').setValue(event.desc);
  }
  onCarrierCodeSelect($event) {
    this.awbReservationGroup.get('carrierCode').value;
    this.carrierCodeSourceParameter = this.createSourceParameter(this.awbReservationGroup.get('carrierCode').value);
    this.terminalSourceParameter = this.createSourceParameter(this.awbReservationGroup.get('carrierCode').value);

  }
  findNextAwbNumber() {
    this.awbReservationGroup.get('carrierCode').value;
    this.awbReservationGroup.get('stockId').value;
    this.exportService.getNextAwbNumberForReservation(this.awbReservationGroup.getRawValue()).subscribe((response) => {
      if (!this.showResponseErrorMessages(response)) {
        this.nextAwbResponse = response.data;
        if (this.nextAwbResponse) {
          if (this.nextAwbResponse.nextAWBNumber != null) {
            //this.awbReservationGroup.get('awbNumber').setValue(this.nextAwbResponse.awbPrefix + this.nextAwbResponse.nextAWBNumber);
            this.awbReservationGroup.get('awbNumber').setValue(this.nextAwbResponse.nextAWBNumber);
            this.awbReservationGroup.get('awbStockDetailsId').setValue(this.nextAwbResponse.awbStockDetailsId);
          }
          else {
            this.showErrorMessage("export.no.more.awbs.in.stock.inform.accounts");
          }
        }
        else {
          this.showErrorMessage("export.no.more.awbs.in.stock.inform.accounts");
        }


      }
    }, error => {
      this.showErrorStatus(error);
    });

  }
  onSave() {
    const request = this.awbReservationGroup.getRawValue();
    if (request.awbNumber == null) {
      this.showErrorMessage("export.fill.carrier.code.and.stockid");
    }
    if (request.terminalId == null &&
      request.destination == null &&
      request.core == null && request.shipperName == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('destination'), "g.required");
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('terminalId'), "g.required");
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('core'), "g.required");
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('shipperName'), "g.required");

    }
    else if (request.terminalId == null &&
      request.destination == null && request.shipperName == null &&
      request.core != null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('terminalId'), "g.required");
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('destination'), "g.required");
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('shipperName'), "g.required");
    }
    else if (request.terminalId != null &&
      request.destination == null &&
      request.core == null && request.shipperName == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('core'), "g.required");
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('destination'), "g.required");
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('shipperName'), "g.required");

    }
    else if (request.terminalId == null &&
      request.destination != null &&
      request.core == null && request.shipperName == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('core'), "g.required");
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('terminalId'), "g.required");
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('shipperName'), "g.required");
    }
    else if (request.terminalId == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('terminalId'), "g.required");

    }
    else if (request.destination == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('destination'), "g.required");
    }
    else if (request.core == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('core'), "g.required");
    }
    else if (request.shipperName == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.awbReservationGroup.get('shipperName'), "g.required");
    }
    else {
      this.exportService.saveAwbReservation(request).subscribe((response) => {
        console.log("res after save", response.data);
        if (!this.showResponseErrorMessages(response)) {
          this.saveResponse = response.data.flagCRUD = "R";
          console.log("res after change flag crud", this.saveResponse);
          if (this.saveResponse != null) {
            this.showSuccessStatus("g.operation.successful");
          }
        }
      }, error => {
        this.showErrorStatus(error);
      });
    }


  }
  onSearchAwbReservationDetails() {
    const request = this.searchReservedFormGroup.getRawValue();
    this.searchRequest.terminalId = request.terminalId;
    this.searchRequest.core = request.core;
    this.searchRequest.destination = request.destination;
    if (this.searchRequest.terminalId == null &&
      this.searchRequest.destination == null &&
      this.searchRequest.core == null) {
      // this.showFormControlErrorMessage(<NgcFormControl>this.searchReservedFormGroup.get('destination'), "g.required");
      this.showFormControlErrorMessage(<NgcFormControl>this.searchReservedFormGroup.get('terminalId'), "g.required");
      this.showFormControlErrorMessage(<NgcFormControl>this.searchReservedFormGroup.get('core'), "g.required");

    }
    else if (this.searchRequest.terminalId == null &&
      // this.searchRequest.destination == null &&
      this.searchRequest.core != null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.searchReservedFormGroup.get('terminalId'), "g.required");
      // this.showFormControlErrorMessage(<NgcFormControl>this.searchReservedFormGroup.get('destination'), "g.required");

    }
    else if (this.searchRequest.terminalId != null &&
      // this.searchRequest.destination == null &&
      this.searchRequest.core == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.searchReservedFormGroup.get('core'), "g.required");
      // this.showFormControlErrorMessage(<NgcFormControl>this.searchReservedFormGroup.get('destination'), "g.required");

    }
    else if (this.searchRequest.terminalId == null &&
      //this.searchRequest.destination != null &&
      this.searchRequest.core == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.searchReservedFormGroup.get('core'), "g.required");
      this.showFormControlErrorMessage(<NgcFormControl>this.searchReservedFormGroup.get('terminalId'), "g.required");

    }
    else if (this.searchRequest.terminalId == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.searchReservedFormGroup.get('terminalId'), "g.required");

    }
    // else if (this.searchRequest.destination == null) {
    //   this.showFormControlErrorMessage(<NgcFormControl>this.searchReservedFormGroup.get('destination'), "g.required");
    // }
    else if (this.searchRequest.core == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.searchReservedFormGroup.get('core'), "g.required");
    }
    else {
      this.searchFlg = true;
      const request = this.searchReservedFormGroup.getRawValue();
      this.exportService.fetchAwbReservationDetails(this.searchRequest).subscribe((response) => {
        if (!this.showResponseErrorMessages(response, null, 'searchReservedFormGroup')) {
          this.searchResponse = response.data;
          if (this.searchResponse != null) {
            console.log(this.searchResponse);
            this.searchReservedFormGroup.get(['bookedList']).patchValue(this.searchResponse);
            console.log("after patching ", this.searchReservedFormGroup.get(['bookedList']).value);
          }
        }
      }, error => {
        this.showErrorStatus(error);
      });
    }

  }
  onBooking() {
    if (this.searchReservedFormGroup.get(['bookedList']).value.filter((element) => element.selectFlg == true).length > 1 || this.searchReservedFormGroup.get(['bookedList']).value.filter((element) => element.selectFlg == true).length == 0) {
      this.showErrorMessage("export.select.atmost.one.shipment");
    }
    else {
      let shipmentObject = this.searchReservedFormGroup.get(['bookedList']).value.find((element) => element.selectFlg == true);
      let flightBookingList = [];
      flightBookingList[0] = {};
      if (shipmentObject.flightKey != null || shipmentObject.flightKey != undefined) {
        flightBookingList[0].flightKey = shipmentObject.flightKey;
        flightBookingList[0].flightDate = shipmentObject.flightDate;
      }
      else {
        flightBookingList[0].flightKey = null;
      }
      let navigateObj = {
        shipmentNumber: shipmentObject.awbNumber,
        origin: NgcUtility.getTenantConfiguration().airportCode,
        destination: shipmentObject.destination,
        flightBookingList: flightBookingList,
        isAwbReservation: true
      }
      this.navigateTo(this.router, 'export/booksingleshipment', navigateObj);
    }
  }

  onNawb() {
    if (this.searchReservedFormGroup.get(['bookedList']).value.filter((element) => element.selectFlg == true).length > 1 || this.searchReservedFormGroup.get(['bookedList']).value.filter((element) => element.selectFlg == true).length == 0) {
      this.showErrorMessage("export.select.atmost.one.shipment");
    }
    else {
      let shipmentObject = this.searchReservedFormGroup.get(['bookedList']).value.find((element) => element.selectFlg == true);
      let shipperInfo = {
        customerName: shipmentObject.shipperName
      }
      let routingList = [];
      routingList[0] = {};
      routingList[0].to = shipmentObject.segment;
      let flightBookingList = [];
      flightBookingList[0] = {};
      if (shipmentObject.flightKey != null || shipmentObject.flightKey != undefined) {
        flightBookingList[0].carrierCode = shipmentObject.flightKey.substring(0, 2);
        flightBookingList[0].flightNumber = shipmentObject.flightKey.substring(2, shipmentObject.flightKey.length);
        routingList[0].carrierCode = shipmentObject.flightKey.substring(0, 2);
      }
      else {
        flightBookingList[0].carrierCode = null;
        flightBookingList[0].flightNumber = null;
      }

      flightBookingList[0].flightDate = shipmentObject.flightDate;

      let navigateObj = {
        awbNumber: shipmentObject.awbNumber,
        origin: NgcUtility.getTenantConfiguration().airportCode,
        destination: shipmentObject.destination,
        shipperInfo: shipperInfo,
        flightBookingList: flightBookingList,
        routingList: routingList,
        isAwbReservation: true
      }



      this.navigateTo(this.router, 'export/maintainnawb', navigateObj);
    }
  }

  onTerminalSelect(event) {
    this.awbSourceParameter = this.createSourceParameter(event.code, null);
    this.awbReservationGroup.get('terminalDescription').setValue(event.desc);
  }

  onSelectCore(event) {
    this.awbReservationGroup.get('coreDescription').setValue(event.desc);
  }

}



