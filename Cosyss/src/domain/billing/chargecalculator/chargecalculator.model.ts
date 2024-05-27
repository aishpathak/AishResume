/**
 * Charge API Calculator (Standalone)
 *
 * @copyright SATS Singapore 2017-18
 */
// Core
import {
  BaseRequest, ReactiveModel, Model, IsArrayOf, Disabled, NotBlank, BaseResponse, BaseBO, BaseResponseData
} from 'ngc-framework';

/**
 * Billing Charge Fact
 */
@Model()
export class BillingChargeFact {
  customerId: number = null;
  carrierGroupCode: number = null;
  carrierCode: string = null;
  customsCustomerType: string = null;
  flightType: string = null;
  shcGroupCode: string = null;
  process: string = null;
}

/**
 * Billing Charge Duration Fact
 */
@Model()
export class BillingChargeDurationFact {
  acceptanceTime: Date = null;
  breakdownTime: Date = null;
  checkoutTime: Date = null;
  deliveryTime: Date = null;
  firstAWBDocumentArrivalTime: Date = null;
  flightDepartureTime: Date = null;
  equipmentReleaseTime: Date = null;
  equipmentReturnTime: Date = null;
  firstBreakdownTime: Date = null;
  firstFlightArrivalTime: Date = null;
  firstFlightBookingTime: Date = null;
  offloadTime: Date = null;
  pickOrderTime: Date = null;
}

/**
 * Billing Charge Quantity Fact
 */
@Model()
export class BillingChargeQuantityFact {
  chargeDays: number = null;
  chargeHours: number = null;
  pieces: number = null;
  weight: number = null;
  quantity: number = null;
  dangerousGoodsWeight: number = null;
}

/**
 * Billing Charge Facts
 */
@Model()
export class BillingChargeFacts extends BaseRequest {
  public eventType: string = null;
  public processType: string = null;
  public shipmentId: number = null;
  public serviceId: number = null;
  //
  public factor: BillingChargeFact = new BillingChargeFact();
  public duration: BillingChargeDurationFact = new BillingChargeDurationFact();
  public quantity: BillingChargeQuantityFact = new BillingChargeQuantityFact();
}

/**
 * Billing Charge Request
 */
@Model()
export class BillingChargeRequest extends BillingChargeFacts {
  userCode: string = "CALCULATOR";
  remarks: string = "Testing Charge Calculation";
}

@Model()
export class BillingChargeResponse extends BaseBO {
  public eventType: string = null;
  public processType: string = null;
  public success: boolean = true;
  public remarks: string = null;
  public billingChargeCodeId: number = null;
  public chargeCode: string = null;
  public chargeableDuration: number = null;
  public chargeableQuantity1: number = null;
  public chargeableQuantity2: number = null;
  public chargeAmount: number = null;
}

@Model()
export class BillingChargeResponses extends BaseResponseData {
  public success: boolean = true;
  public remarks: string = null;
  @IsArrayOf(BillingChargeResponse)
  public responseList: Array<BillingChargeResponse> = new Array<BillingChargeResponse>();
}

/**
 * UI
 */

/**
 * Factor
 */
@Model()
export class BillingChargeFactor {
  public factorType: string = null;
  public factor: any = null;
}

/**
 * Duration
 */
@Model()
export class BillingChargeDuation {
  public durationType: string = null;
  public duration: Date = null;
}

/**
 * Quantity
 */
@Model()
export class BillingChargeQuantity {
  public quantityType: string = null;
  public quantity: number = null;
}

@Model()
export class BillingChargeCalculator {
  @NotBlank()
  public processType: string = null;
  @NotBlank()
  public eventType: string = null;
  @NotBlank()
  public shipmentService: string = null;
  public shipmentId: string = null;
  public serviceId: string = null;
  //
  @IsArrayOf(BillingChargeFactor)
  public factors: Array<BillingChargeFactor> = new Array<BillingChargeFactor>();
  @IsArrayOf(BillingChargeDuation)
  public durations: Array<BillingChargeDuation> = new Array<BillingChargeDuation>();
  @IsArrayOf(BillingChargeQuantity)
  public quantities: Array<BillingChargeQuantity> = new Array<BillingChargeQuantity>();
  //
  public responses: BillingChargeResponses = new BillingChargeResponses();
}
