import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcFormGroup, NgcFormControl, PageConfiguration, NgcPage, NgcFormArray, NgcWindowComponent, NgcUtility } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AwbManagementService } from '../awbManagement.service';
import { FormArray, AbstractControl } from '@angular/forms';
import { SearchInactiveCargo, ShipmentData } from '../awbManagement.shared';
@Component({
  selector: 'app-inactive-or-old-cargo',
  templateUrl: './inactive-or-old-cargo.component.html',
  styleUrls: ['./inactive-or-old-cargo.component.scss'],
  providers: [AwbManagementService]
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class InactiveOrOldCargoComponent extends NgcPage implements OnInit {
  @ViewChild("remarksPopup") private remarksPopup: NgcWindowComponent;
  carrierGroupCodeParam: any;
  displaySearchContainer: boolean = false;
  displaySearchValues: boolean = false;
  flightDetails: boolean = false;
  deliveryDetials: boolean = false;
  carrier: boolean = true;
  inactiveShipmentData: SearchInactiveCargo = new SearchInactiveCargo();
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router, private awbService: AwbManagementService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);

  }

  ngOnInit() {
    super.ngOnInit();
    this.defaultCreationDays();
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {
      this.inactiveoroldcargolist.get('shipmentNumber').setValue(forwardedData.shipmentNumber);
      this.inactiveOrOldCargoValues();
    }
  }

  private inactiveoroldcargolist: any = new NgcFormGroup({
    carrierGp: new NgcFormControl(""),
    carrierCode: new NgcFormControl(""),
    carrierGpDisplay: new NgcFormControl(""),
    carrierCodeDisplay: new NgcFormControl(""),
    shcode: new NgcFormControl(""),
    shcodeDisplay: new NgcFormControl(""),
    select: new NgcFormControl(""),
    creationdays: new NgcFormControl("", [Validators.maxLength(3)]),
    shipmentNumber: new NgcFormControl(""),
    creationdaysDisplay: new NgcFormControl(""),
    remarks: new NgcFormGroup({
      remarks: new NgcFormControl(),
      remarkType: new NgcFormControl(),
      flightNumber: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      doNumber: new NgcFormControl()
    }),
    resultList: new NgcFormArray(
      [
      ]
    ),
  });

  inactiveOrOldCargoValues() {

    if (this.inactiveoroldcargolist.invalid) {
      this.inactiveoroldcargolist.validate();
      this.showErrorStatus("export.please.fill.details");
      return;
    }
    this.displaySearchValues = true;
    this.displaySearchContainer = false;
    this.inactiveoroldcargolist.get('carrierCodeDisplay').setValue(this.inactiveoroldcargolist.get('carrierCode').value);
    this.inactiveoroldcargolist.get('shcodeDisplay').setValue(this.inactiveoroldcargolist.get('shcode').value);
    this.inactiveoroldcargolist.get('creationdaysDisplay').setValue(this.inactiveoroldcargolist.get('creationdays').value);
    let data = this.inactiveoroldcargolist.getRawValue();
    let inactive: SearchInactiveCargo = new SearchInactiveCargo();
    inactive.carrierCode = data.carrierCode;
    if (data.shcode != null && data.shcode.length > 0) {
      inactive.shcode = data.shcode;
    }
    inactive.creationdays = data.creationdays;
    inactive.carrierGp = data.carrierGp;
    inactive.shipmentNumber = data.shipmentNumber;
    this.awbService.getInactiveOrOldCargoRecords(inactive).subscribe((res) => {
      this.refreshFormMessages(res);
      if (res.data != null && res.data.length > 0) {
        console.log(res.data);
        (<NgcFormArray>this.inactiveoroldcargolist.get('resultList')).patchValue(res.data);

        this.displaySearchContainer = true;
      } else {
        this.showInfoStatus('no.records.m')
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }


  defaultCreationDays() {

    let inactive: SearchInactiveCargo = new SearchInactiveCargo();
    this.awbService.getDefaultCreationDays(inactive).subscribe((res) => {
      this.refreshFormMessages(res);
      this.inactiveoroldcargolist.get('creationdays').setValue(res.data.creationdays);

    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  getCarrierCodeByCarrierGroup(event) {
    this.carrier = false;
    this.inactiveoroldcargolist.get('carrierGpDisplay').setValue(event.desc);
    this.inactiveoroldcargolist.get(['carrierCode']).reset();
    this.inactiveoroldcargolist.get(['carrierCodeDisplay']).reset();
    this.carrierGroupCodeParam = this.createSourceParameter(this.inactiveoroldcargolist.get(['carrierGp']).value);
  }

  freightOutCargo() {
    this.inactiveoroldcargolist.get('remarks.remarks').reset();
    this.inactiveoroldcargolist.get('remarks.flightNumber').reset();
    this.inactiveoroldcargolist.get('remarks.flightDate').reset();
    this.inactiveoroldcargolist.get('remarks.doNumber').reset();
    let shipmentData = [];
    let origin = [];
    let destination = [];
    let transhipment = [];
    let data = (<NgcFormArray>this.inactiveoroldcargolist.get('resultList')).getRawValue();
    console.log(data);
    data.forEach(element => {
      if (element.select == true) {
        let shipment: ShipmentData = new ShipmentData();
        shipment.shipmentId = element.shipmentId;
        shipment.origin = element.origin;
        shipment.destination = element.destination;
        shipment.awbNumber = element.awbNumber;
        shipment.pieces = element.inventaryPices;
        shipment.weight = element.inventoryWaight;
        shipment.shipmentDate = element.shipmentDate;
        shipment.shipmentType = element.shipmentType;
        if (NgcUtility.isTenantCityOrAirport(element.destination)) {
          destination.push(element.destination);
        }
        if (NgcUtility.isTenantCityOrAirport(element.origin)) {
          origin.push(element.origin);
        }
        if (!NgcUtility.isTenantCityOrAirport(element.origin) && !NgcUtility.isTenantCityOrAirport(element.destination)) {
          transhipment.push(element.origin);
        }
        if (element.consignee == null) {
          shipment.agent = 'IXX'
        } else {
          shipment.agent = element.consignee;
        }
        shipmentData.push(shipment);
      }
    });
    if ((origin.length > 0 && destination.length > 0) || (origin.length > 0 && transhipment.length > 0) ||
      (transhipment.length > 0 && destination.length > 0)) {
      this.showErrorMessage('inactiveoldcargo.select');
      return;
    }
    if (origin.length > 0) {
      this.flightDetails = true;
      this.deliveryDetials = false;
    } else if (destination.length > 0) {
      this.flightDetails = false;
      this.deliveryDetials = true;
    } else if (transhipment.length > 0) {
      this.flightDetails = true;
      this.deliveryDetials = true;
    }

    this.inactiveShipmentData.shipmentData = shipmentData;

    if (shipmentData.length > 0) {
      this.remarksPopup.open();
    } else {
      this.showInfoStatus("selectAtleastOneRecord");
    }

  }

  freightOutCargoRemarks() {
    this.remarksPopup.open();
  }

  remarkSave() {
    let first = '';
    let second;
    this.resetFormMessages();
    if (this.inactiveoroldcargolist.get('remarks.remarks').value != null) {
      this.inactiveShipmentData.remarks = this.inactiveoroldcargolist.get('remarks.remarks').value;
      this.inactiveShipmentData.remarkType = this.inactiveoroldcargolist.get('remarks.remarkType').value;
      this.inactiveShipmentData.deliveryOrderNo = this.inactiveoroldcargolist.get('remarks.doNumber').value;
      this.inactiveShipmentData.flightkey = this.inactiveoroldcargolist.get('remarks.flightNumber').value;
      this.inactiveShipmentData.flightDate = this.inactiveoroldcargolist.get('remarks.flightDate').value;
      if (this.deliveryDetials && !this.flightDetails) {
        if (this.inactiveShipmentData.deliveryOrderNo != null) {
          first = this.inactiveShipmentData.deliveryOrderNo.substring(0, 1);
          second = Number(this.inactiveShipmentData.deliveryOrderNo.substring(1, 7));
          if (this.validateDonumber(first, second) || this.inactiveShipmentData.deliveryOrderNo.length < 7) {
            this.showErrorMessage("awb.invalid.do.pattern");
            return;
          }
        } else {
          this.showErrorMessage('awb.enter.do.no')
        }
      }
      if (this.flightDetails && (this.inactiveShipmentData.flightkey == null || this.inactiveShipmentData.flightDate == null)) {
        this.showErrorMessage('export.enter.flight.details');
        return;
      }
      if (this.flightDetails && this.deliveryDetials &&
        (this.inactiveShipmentData.flightkey == null || this.inactiveShipmentData.flightDate == null || this.inactiveShipmentData.deliveryOrderNo == null)) {
        this.showErrorMessage('export.enter.all.mandatory.details');
        return;
      }
      this.awbService.moveToFreightOut(this.inactiveShipmentData).subscribe((res) => {
        this.refreshFormMessages(res);
        if (res.data == "sucess") {
          this.showSuccessStatus('awb.frtout.completed');
          this.inactiveOrOldCargoValues();
          this.remarksPopup.hide();
        }
      },
        error => {
          this.showErrorStatus('Error:' + error);
        });

    } else {
      this.showErrorMessage('export.enter.all.mandatory.details');
    }
  }

  private validateDonumber(first, second) {
    let flag = false;
    let patt1 = new RegExp("^[A-Z]");
    let patt2 = new RegExp("^[0-9]");
    if (!patt1.test(first) || !patt2.test(second)) {
      flag = true;
    }
    return flag;
  }

  onCancel() {
    this.navigateTo(this.router, '**', {});
  }
}