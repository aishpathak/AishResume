/**
 * Charge API Calculator (Standalone)
 *
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../billing.service';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import { Validators } from '@angular/forms';
// Core
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, PageConfiguration, BaseRequest,
  ReactiveModel, Model, IsArrayOf, Disabled, NotBlank, DateTimeKey, NgcFormControl, RestService,
  BaseResponse
} from 'ngc-framework';
import { Environment, BILL_ENV } from '../../../environments/environment';
import {
  BillingChargeFact, BillingChargeDurationFact, BillingChargeQuantityFact, BillingChargeFacts,
  BillingChargeCalculator, BillingChargeFactor, BillingChargeDuation, BillingChargeQuantity,
  BillingChargeRequest, BillingChargeResponses
} from './chargecalculator.model';

/**
 * Charge API Calculator
 */
@Component({
  selector: 'billing-charge-calculator',
  templateUrl: './chargecalculator.component.html'
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ChargeCalculatorComponent extends NgcPage {
  //
  @ReactiveModel(BillingChargeCalculator)
  private chargeModelForm: NgcFormGroup = null;
  //
  private eventSourceId: any;
  private shipmentServiceList: string[] = ["Shipment", "Service"];

  /**
   * Initialize
   *
   * @param appZone Zone
   * @param appElement Element Ref
   * @param appContainerElement Container Ref
   */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private restService: RestService) {
    super(appZone, appElement, appContainerElement);
  }

  /**
   * On Initialization
   */
  public ngOnInit() {
    super.ngOnInit();
    // Initialize
    this.initialize();
  }

  /**
   * Initialize
   */
  private initialize() {
    this.onAddFactors();
    //
    this.trackModelChange();
  }

  /**
   * Track Model Change
   */
  private trackModelChange() {
    this.chargeModelForm.valueChanges.subscribe(() => {
      this.onModelChange();
    });
  }

  /**
   * On Model Change
   */
  private onModelChange() {
    this.checkDuplicateFactor();
    this.checkDuplicateDuration();
    this.checkDuplicateQuantity();
  }

  /**
   * Check for Duplicate Factor
   */
  private checkDuplicateFactor() {
    const factors: NgcFormArray = this.chargeModelForm.get('factors') as NgcFormArray;
    const dupMap: any = {};
    //
    if (factors) {
      factors.controls.forEach((factor: NgcFormGroup) => {
        const factorType: NgcFormControl = factor.get('factorType') as NgcFormControl;
        const factorValue: NgcFormControl = factor.get('factor') as NgcFormControl;
        //
        if (!factorType || !factorType.value) {
          return;
        }
        //
        if (dupMap[factorType.value]) {
          this.showFormControlErrorMessage(factorType, 'duplicate');
        }
        dupMap[factorType.value] = true;
        //
        if (factorType.value) {
          factorValue.setValidators([Validators.required]);
        } else {
          factorValue.clearValidators();
        }
      });
    }
  }

  /**
   * Check for Duplicate Duration
   */
  private checkDuplicateDuration() {
    const durations: NgcFormArray = this.chargeModelForm.get('durations') as NgcFormArray;
    const dupMap: any = {};
    //
    if (durations) {
      durations.controls.forEach((duration: NgcFormGroup) => {
        const durationType: NgcFormControl = duration.get('durationType') as NgcFormControl;
        const durationValue: NgcFormControl = duration.get('duration') as NgcFormControl;
        //
        if (!durationType || !durationType.value) {
          return;
        }
        //
        if (dupMap[durationType.value]) {
          this.showFormControlErrorMessage(durationType, 'duplicate');
        }
        dupMap[durationType.value] = true;
        //
        if (durationType.value) {
          durationValue.setValidators([Validators.required]);
        } else {
          durationValue.clearValidators();
        }
      });
    }
  }

  /**
   * Check for Duplicate Quantity
   */
  private checkDuplicateQuantity() {
    const quantities: NgcFormArray = this.chargeModelForm.get('quantities') as NgcFormArray;
    const dupMap: any = {};
    //
    if (quantities) {
      quantities.controls.forEach((quantity: NgcFormGroup) => {
        const quantityType: NgcFormControl = quantity.get('quantityType') as NgcFormControl;
        const quantityValue: NgcFormControl = quantity.get('quantity') as NgcFormControl;
        //
        if (!quantityType || !quantityType.value) {
          return;
        }
        //
        if (dupMap[quantityType.value]) {
          this.showFormControlErrorMessage(quantityType, 'duplicate');
        }
        dupMap[quantityType.value] = true;
        //
        if (quantityType.value) {
          quantityValue.setValidators([Validators.required]);
        } else {
          quantityValue.clearValidators();
        }
      });
    }
  }

  /**
   * On Process Change
   */
  private onProcessChange(newValue: string) {
    switch (newValue) {
      case 'Q':
        this.eventSourceId = 'Billing$Event.Process.EquipmentEvents';
        break;
      case 'E':
        this.eventSourceId = 'Billing$Event.Process.ExportEvents';
        break;
      case 'I':
        this.eventSourceId = 'Billing$Event.Process.ImportEvents';
        break;
      default:
        this.eventSourceId = null;
        break;
    }
  }

  /**
   * On Add Factors
   */
  private onAddFactors() {
    const factorArray: NgcFormArray = this.chargeModelForm.get('factors') as NgcFormArray;
    //
    if (factorArray.length >= 7) {
      return;
    }
    //
    factorArray.add([new BillingChargeFactor()], BillingChargeFactor);
    // Only for First
    if (factorArray.controls.length == 1) {
      factorArray.get([0, 'factorType']).setValidators([Validators.required]);
      factorArray.get([0, 'factor']).setValidators([Validators.required]);
    }
  }

  /**
   * On Add Durations
   */
  private onAddDurations() {
    const durationArray: NgcFormArray = this.chargeModelForm.get('durations') as NgcFormArray;
    //
    if (durationArray.length >= 13) {
      return;
    }
    //
    durationArray.add([new BillingChargeDuation()], BillingChargeDuation);
    // Only for First
    if (durationArray.controls.length == 1) {
      durationArray.get([0, 'durationType']).setValidators([Validators.required]);
      durationArray.get([0, 'duration']).setValidators([Validators.required]);
    }
  }

  /**
   * On Add Quantities
   */
  private onAddQuantities() {
    const quantityArray: NgcFormArray = this.chargeModelForm.get('quantities') as NgcFormArray;
    //
    if (quantityArray.length >= 6) {
      return;
    }
    //
    quantityArray.add([new BillingChargeQuantity()], BillingChargeQuantity);
    // Only for First
    if (quantityArray.controls.length == 1) {
      quantityArray.get([0, 'quantityType']).setValidators([Validators.required]);
      quantityArray.get([0, 'quantity']).setValidators([Validators.required]);
    }
  }

  /**
   * Update Factor to Request
   */
  private updateFactorToRequest(request: BillingChargeFacts) {
    const factors: NgcFormArray = this.chargeModelForm.get('factors') as NgcFormArray;
    const dupMap: any = {};
    //
    if (factors) {
      factors.controls.forEach((factor: NgcFormGroup) => {
        const factorType: NgcFormControl = factor.get('factorType') as NgcFormControl;
        const factorValue: NgcFormControl = factor.get('factor') as NgcFormControl;
        //
        if (!factorType || !factorType.value) {
          return;
        }
        //
        if (dupMap[factorType.value]) {
          return;
        }
        dupMap[factorType.value] = true;
        //
        switch (factorType.value) {
          case 'AGT':
            request.factor.customerId = factorValue.value;
            break;
          case 'CARG':
            request.factor.carrierGroupCode = factorValue.value;
            break;
          case 'CARR':
            request.factor.carrierCode = factorValue.value;
            break;
          case 'CSTYP':
            request.factor.customsCustomerType = factorValue.value;
            break;
          case 'FLTYP':
            request.factor.flightType = factorValue.value;
            break;
          case 'PROCESS':
            request.factor.process = factorValue.value;
            break;
          case 'SHCG':
            request.factor.shcGroupCode = factorValue.value;
            break;
        }
      });
    }
  }

  /**
   * Update Duration to Request
   */
  private updateDurationToRequest(request: BillingChargeFacts) {
    const durations: NgcFormArray = this.chargeModelForm.get('durations') as NgcFormArray;
    const dupMap: any = {};
    //
    if (durations) {
      durations.controls.forEach((duration: NgcFormGroup) => {
        const durationType: NgcFormControl = duration.get('durationType') as NgcFormControl;
        const durationValue: NgcFormControl = duration.get('duration') as NgcFormControl;
        //
        if (!durationType || !durationType.value) {
          return;
        }
        //
        if (dupMap[durationType.value]) {
          return;
        }
        dupMap[durationType.value] = true;
        //
        switch (durationType.value) {
          case 'ACCDT':
            request.duration.acceptanceTime = durationValue.value;
            break;
          case 'BDNDT':
            request.duration.breakdownTime = durationValue.value;
            break;
          case 'CHKDT':
            request.duration.checkoutTime = durationValue.value;
            break;
          case 'DLVDT':
            request.duration.deliveryTime = durationValue.value;
            break;
          case 'DOCDT':
            request.duration.firstAWBDocumentArrivalTime = durationValue.value;
            break;
          case 'DPTDT':
            request.duration.flightDepartureTime = durationValue.value;
            break;
          case 'EQRDT':
            request.duration.equipmentReleaseTime = durationValue.value;
            break;
          case 'ERTDT':
            request.duration.equipmentReturnTime = durationValue.value;
            break;
          case 'FBDDT':
            request.duration.firstBreakdownTime = durationValue.value;
            break;
          case 'FFADT':
            request.duration.firstFlightArrivalTime = durationValue.value;
            break;
          case 'FFBDT':
            request.duration.firstFlightBookingTime = durationValue.value;
            break;
          case 'OFFDT':
            request.duration.offloadTime = durationValue.value;
            break;
          case 'PKODT':
            request.duration.pickOrderTime = durationValue.value;
            break;
        }
      });
    }
  }

  /**
   * Update Quantity to Request
   */
  private updateQuantityToRequest(request: BillingChargeFacts) {
    const quantities: NgcFormArray = this.chargeModelForm.get('quantities') as NgcFormArray;
    const dupMap: any = {};
    //
    if (quantities) {
      quantities.controls.forEach((quantity: NgcFormGroup) => {
        const quantityType: NgcFormControl = quantity.get('quantityType') as NgcFormControl;
        const quantityValue: NgcFormControl = quantity.get('quantity') as NgcFormControl;
        //
        if (!quantityType || !quantityType.value) {
          return;
        }
        //
        if (dupMap[quantityType.value]) {
          return;
        }
        dupMap[quantityType.value] = true;
        //
        switch (quantityType.value) {
          case 'HOUR':
            request.quantity.chargeHours = quantityValue.value;
            break;
          case 'DAY':
            request.quantity.chargeDays = quantityValue.value;
            break;
          case 'DGW':
            request.quantity.dangerousGoodsWeight = quantityValue.value;
            break;
          case 'PCS':
            request.quantity.pieces = quantityValue.value;
            break;
          case 'QTY':
            request.quantity.quantity = quantityValue.value;
            break;
          case 'WGT':
            request.quantity.weight = quantityValue.value;
            break;
        }
      });
    }
  }

  /**
   * On Calculate
   */
  private onCalculate(): void {
    this.chargeModelForm.validate();
    //
    if (this.chargeModelForm.invalid) {
      return;
    }
    const request: BillingChargeRequest = new BillingChargeRequest();
    // Set Values
    request.processType = this.chargeModelForm.get('processType').value;
    request.eventType = this.chargeModelForm.get('eventType').value;
    request.shipmentId = this.chargeModelForm.get('shipmentId').value;
    request.serviceId = this.chargeModelForm.get('serviceId').value;
    // Update Details
    this.updateFactorToRequest(request);
    this.updateDurationToRequest(request);
    this.updateQuantityToRequest(request);
    // Post
    this.restService.post(BILL_ENV.serviceBaseURL + "billing/api/chargeadvise/test", request).subscribe((response) => {
      const chargeResponse: BaseResponse<BillingChargeResponses> = response as BaseResponse<BillingChargeResponses>;
      console.log(chargeResponse);
      // If Response
      if (chargeResponse.data) {
        this.chargeModelForm.get('responses').patchValue(chargeResponse.data);
      }
    });
  }
}
