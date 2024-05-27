// import { request } from 'http';
import { ActivatedRoute, Router } from '@angular/router';
import { CargoProcessingEngineService } from './../cargoprocessingengine.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, PageConfiguration, CreateFormByModel
} from 'ngc-framework';

@Component({
  selector: 'app-execution-shipment-info',
  templateUrl: './execution-shipment-info.component.html',
  styleUrls: ['./execution-shipment-info.component.css']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ExecutionShipmentInfoComponent extends NgcPage {
  warnArray: any;
  resp: any;

  private form: NgcFormGroup = new NgcFormGroup({
    actionType: new NgcFormControl(),
    processAreaId: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    shipmentWarnDetails: new NgcFormArray([]),
    shipmentInfoDetails: new NgcFormArray([]),
    shipmentErrorDetails: new NgcFormArray([])
  });

  /**
  * Initialize
  *
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private _cargoEngineProcessService: CargoProcessingEngineService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }

  onSearch() {
    const request = this.form.getRawValue();
    const searchRequest = {
      shipmentNumber: request.shipmentNumber,
      processAreaId: request.processAreaId,
      actionType: request.actionType,
    }
    this._cargoEngineProcessService.onSearchExectionShipmentInfo(searchRequest).subscribe(response => {
      this.resp = response.data;
      for (const eachRowWarn of this.resp.shipmentWarnDetails) {
        if (eachRowWarn.acknowledge) {
          eachRowWarn.showIcon = true;
        } else {
          eachRowWarn.showIcon = false;
        }
      }
      for (const eachRowInfo of this.resp.shipmentInfoDetails) {
        if (eachRowInfo.acknowledge) {
          eachRowInfo.showIcon = true;
        } else {
          eachRowInfo.showIcon = false;
        }
      }
      for (const eachRowInfo of this.resp.shipmentErrorDetails) {
        if (eachRowInfo.acknowledge) {
          eachRowInfo.showIcon = true;
        } else {
          eachRowInfo.showIcon = false;
        }
      }
      this.form.patchValue(this.resp);
    });
  }

  onCloseFailureData() {
    this.showConfirmMessage('warehouse.warning.bypass.thefailure').then(fulfilled => {
      const closeFailureRequest = this.form.getRawValue();
      const shipmentWarnDetails = [];
      const shipmentInfoDetails = [];
      for (const eachRow of closeFailureRequest.shipmentWarnDetails) {
        if (eachRow.acknowledge) {
          shipmentWarnDetails.push(eachRow);
        }
      }
      for (const eachRow of closeFailureRequest.shipmentInfoDetails) {
        if (eachRow.acknowledge) {
          shipmentInfoDetails.push(eachRow);
        }
      }
      closeFailureRequest.shipmentWarnDetails = shipmentWarnDetails;
      closeFailureRequest.shipmentInfoDetails = shipmentInfoDetails;
      this._cargoEngineProcessService.oncloseFailure(closeFailureRequest).subscribe(response => {
        this.resp = response.data;
        this.onSearch();
      });
    });
  }

  onClear(event) {
    this.form.reset();
  }

  onCancel(event) {
    this.navigateHome();
  }
}
