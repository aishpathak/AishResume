import { NgcReportComponent, ReportFormat } from 'ngc-framework';
import { forEach } from '@angular/router/src/utils/collection';
import { Validators } from '@angular/forms';
import { element, error } from 'protractor';
import { filter } from 'rxjs/operators';
import { ApplicationFeatures } from './../../../common/applicationfeatures';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';

import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcUtility, NgcWindowComponent, PageConfiguration } from 'ngc-framework';

import { AcceptanceService } from '../acceptance.service';

import { AddToScreeningFlight, AddToScreeningShipment } from '../../export.sharedmodel';


@Component({
  selector: 'app-shipment-to-be-screened',
  templateUrl: './shipment-to-be-screened.component.html',
  styleUrls: ['./shipment-to-be-screened.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ShipmentToBeScreenedComponent extends NgcPage {
  @ViewChild("reportWindow1")
  reportWindow1: NgcReportComponent;
  reportParameters: any;
  data: any;
  screeningReasons = ['ACAS', 'RCAR', 'AED', 'Airline Request', 'TS', 'eCSD'];
  tenantSpecific: boolean = false;
  kcCAOTarget;
  kcPAXTarget;
  transCAOTarget;
  transPAXTarget;
  private shipmentsToBeScreenedForm: NgcFormGroup = null;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private acceptanceService: AcceptanceService) {
    super(appZone, appElement, appContainerElement);
  }

  onAddToScreening(type) {
    const addToScreening: AddToScreeningShipment = new AddToScreeningShipment();
    if (type === 'awb') {
      addToScreening.shipmentNumber = this.shipmentsToBeScreenedForm.get('shipmentNumber').value;
      addToScreening.screeningReason = this.shipmentsToBeScreenedForm.get('reason').value;
    } else {
      let selected = (<NgcFormArray>this.shipmentsToBeScreenedForm.get([type + 'ScreeningList'])).
        getRawValue().find((element) => element.select == true);
      addToScreening.shipmentNumber = selected.shipmentNumber;
      addToScreening.screeningReason = (type === 'transhipment') ? 'TS' : 'RCAR';
    }
    this.acceptanceService.addShipmentToScreening(addToScreening).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.messageList == null || data.messageList.length == 0) {
        this.showSuccessStatus("g.operation.successful");
        if (type !== 'awb') {
          (<NgcFormArray>this.shipmentsToBeScreenedForm.controls['transhipmentScreeningList']).resetValue([]);
          this.onSearch(type);
        }

        //refresh screening targets
        this.getScreeningTarget();
      }
    }, error => {
      this.showErrorStatus(error);
    });

  }

  onAddToScreeningULDAWB = type => {
    this.shipmentsToBeScreenedForm.validate();
    if (this.shipmentsToBeScreenedForm.invalid) {
      return;
    }
    let addToScreening: AddToScreeningShipment[] = [];
    addToScreening = (<NgcFormArray>this.shipmentsToBeScreenedForm.get([type + 'ScreeningList'])).value.filter(element => element.select == true);
    if (addToScreening.length < 1) {
      this.showErrorMessage("edi.select.atleast.one.checkbox");
    } else {
      addToScreening.forEach(element => {
        element.screeningReason = this.shipmentsToBeScreenedForm.get('reason').value,
          element.uldNumber = this.shipmentsToBeScreenedForm.get('uldNumber').value;
        element.screeningChargeCustomer = this.shipmentsToBeScreenedForm.get('screeningChargeCustomer').value;
      });
      let errorflag: boolean = false;
      this.acceptanceService.addShipmentsToScreening(addToScreening).subscribe(data => {
        if (data.messageList != null && data.messageList.length > 0) {
          this.refreshFormMessages(data);
          errorflag = true;
        }
        let response = data.data.filter(awb => awb.messageList != null && awb.messageList.length > 0);

        if (!NgcUtility.isBlank(response) && response.length > 0) {
          this.shipmentsToBeScreenedForm.get([type + 'ScreeningList']).value.forEach((element, index) => {
            if (element.shipmentNumber == response[0].shipmentNumber && element.shipmentLocation == response[0].shipmentLocation) {
              this.showFormControlErrorMessage(<NgcFormControl>this.shipmentsToBeScreenedForm.get([type + 'ScreeningList', index, 'screeningReqPieces']),
                "exp.accpt.remaining.screening.pieces", null, [response[0].messageList[0].code]);
              errorflag = true;
            }
          }

          )
        }



        if (!errorflag) {
          this.showSuccessStatus("g.operation.successful");
          this.onSearchULDAWB(type);
          //refresh screening targets
          this.getScreeningTarget();
        }
      }, error => {
        this.showErrorStatus(error);
      });

    }


  }

  onSelectShipment = (type, shipment) => {
    if (this.shipmentsToBeScreenedForm.get([type + 'ScreeningList', shipment, 'select']).value) {
      (<NgcFormControl>this.shipmentsToBeScreenedForm.get([type + 'ScreeningList', shipment, 'screeningReqPieces'])).setValidators([Validators.required]);
    } else {
      (<NgcFormControl>this.shipmentsToBeScreenedForm.get([type + 'ScreeningList', shipment, 'screeningReqPieces'])).setValidators(null);
    }
  }

  onSearch(type) {
    const flight: AddToScreeningFlight = new AddToScreeningFlight();
    if (type === 'transhipment') {
      flight.type = type;
      flight.flightKey = this.shipmentsToBeScreenedForm.get('flightKey').value;
      flight.flightDate = this.shipmentsToBeScreenedForm.get('flightDate').value;
    }
    if (type === 'kc') {
      flight.type = type;
      if (this.shipmentsToBeScreenedForm.get('flightTypePAX').value) {
        flight.flightType = 'P';
      }
      if (this.shipmentsToBeScreenedForm.get('flightTypeCAO').value) {
        flight.flightType = 'C';
      }
    }
    this.acceptanceService.fetchAddToScreening(flight).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.messageList == null || data.messageList.length == 0) {
        this.data = data.data;
        this.data.forEach(function (obj) { obj.select = false; });
        this.shipmentsToBeScreenedForm.get(type + 'ScreeningList').patchValue(this.data);
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }
  onPrintBUPList = () => {
    this.shipmentsToBeScreenedForm.validate();
    if (this.shipmentsToBeScreenedForm.invalid) {
      this.showErrorMessage('g.enter.mandatory.m');
      return;
    }
    this.reportParameters = new Object();
    this.reportParameters.uldNumber = this.shipmentsToBeScreenedForm.get('uldNumber').value;
    this.reportParameters.screeningReason = this.shipmentsToBeScreenedForm.get('reason').value;
    this.reportParameters.chargeTo = this.shipmentsToBeScreenedForm.get('screeningChargeCustomer').value;
    this.reportWindow1.format = ReportFormat.PDF;
    this.reportWindow1.open();
  }


  onSearchULDAWB = type => {

    this.shipmentsToBeScreenedForm.get('reason').setValidators([Validators.required]);
    this.shipmentsToBeScreenedForm.get('screeningChargeCustomer').setValidators([Validators.required]);
    let request = null;
    if (type == 'uld') {
      request = {
        'uldNumber': this.shipmentsToBeScreenedForm.get('uldNumber').value,
        'type': type
      };
    } else {
      request = {
        'shipmentNumber': this.shipmentsToBeScreenedForm.get('shipmentNumber').value,
        'type': type
      }
    }

    this.acceptanceService.fetchAddToScreening(request).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.messageList == null || data.messageList.length == 0) {
        this.shipmentsToBeScreenedForm.get('reason').reset();
        this.shipmentsToBeScreenedForm.get('screeningChargeCustomer').reset();
        this.data = data.data;
        this.data.forEach(function (obj) { obj.select = false; });
        this.shipmentsToBeScreenedForm.get(type + 'ScreeningList').patchValue(this.data);
        this.shipmentsToBeScreenedForm.get(type + 'ScreeningList').setValidators(null);
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }
  ngOnInit() {
    this.initialise();
    this.getScreeningTarget();
    this.tenantSpecific = NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_AddToScreening_ByUld);
  }

  initialise() {
    this.shipmentsToBeScreenedForm = new NgcFormGroup({
      shipmentNumber: new NgcFormControl(),
      reason: new NgcFormControl(),
      flightKey: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      flightTypePAX: new NgcFormControl(),
      flightTypeCAO: new NgcFormControl(),
      uldNumber: new NgcFormControl(),
      screeningChargeCustomer: new NgcFormControl(),
      transhipmentScreeningList: new NgcFormArray([]),
      awbScreeningList: new NgcFormArray([]),
      kcScreeningList: new NgcFormArray([]),
      uldScreeningList: new NgcFormArray([])
    });
  }
  getScreeningTarget() {
    this.acceptanceService.getScreeningTarget().subscribe(data => {
      this.refreshFormMessages(data);
      if (data.messageList == null || data.messageList.length == 0) {
        this.kcCAOTarget = data.data.kcCAOTarget;
        this.kcPAXTarget = data.data.kcPAXTarget;
        this.transCAOTarget = data.data.transCAOTarget;
        this.transPAXTarget = data.data.transPAXTarget;
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  onCancel(event) {
    this.navigateHome();
  }

  onScrReqPcsUpdate = (type, event, index) => {
    const actualPieces = this.shipmentsToBeScreenedForm.get([type + 'ScreeningList', index, 'piece']).value;
    const actualWeight = this.shipmentsToBeScreenedForm.get([type + 'ScreeningList', index, 'weight']).value;
    let locationWeight = (event / actualPieces) * actualWeight;
    this.shipmentsToBeScreenedForm.get([type + 'ScreeningList', index, 'screeningReqWeight']).patchValue(locationWeight);
  }
}