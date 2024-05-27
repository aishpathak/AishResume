import { NgcUtility } from 'ngc-framework';
import { BaseRequest, BaseResponseData, BaseBO, Model, NotBlank, IsArrayOf, Min, ReactiveModel } from 'ngc-framework';

export class SearchChargeCode extends BaseRequest {
  chargeCodeName: any;
  chargeCodeDescription: any;
}

export class ChargeCode extends BaseRequest {
  chargeCodeName: any;
  chargeCodeDescription: any;
}

export class Charge extends BaseRequest {
  chargeCode: any;
  chargeCodeDesc: any;
  codeName: any;
  flagCRUD: any;
}

export class ChargeFactor extends BaseRequest {
  chargeCodeName: any;
  chargeCodeDescription: any;
  chargeFactorName1: any;
  chargeFactorName2: any;
  chargeFactorName3: any;
  chargeFactorName4: any;
  chargeParameters: any;
}

export class ChargeParameter extends BaseRequest {
  chargeFactorValue1: any;
  chargeFactorValue2: any;
  chargeFactorValue3: any;
  chargeFactorValue4: any;
  matchOrder: any;
}



export class ChargeModel extends BaseRequest {
  chargeModelId: any;
  chargeModelFactorId: any;
  chargeModelInfo: any;
  effectiveDate: any;
  endDate: any;
  chargeFactor1Value: any;
  chargeFactor2Value: any;
  chargeFactor3Value: any;
  chargeFactor4Value: any;
  effectiveDateParameter: any;
  duration: any;
  exempt: any;
  bufferHours: any;
  quantityAttribute1: any;
  quantityAttribute2: any;
  rateType: any;
  rateDeterminant: any;
  chargeApplicant1: any;
  chargeRates: any;
  minAmount: any;
  maxAmount: any;
}

export class chargeModelInfo extends BaseRequest {
  serial: any;
  startDate: any;
  endDate: any;
  status: any;
  chargeModelId: any;
}

export class BillingServiceMasterRequest extends BaseRequest {
  serviceCode: string;
  name: string;
  associatedTo: string;
  optionLov: any;
}

export class BillingServiceMasterResponse extends BaseRequest {
  resultantArray: ({});
}

export class CreateServiceRequest extends BaseRequest {
  select: Boolean = false;
  serviceName: string;
  serviceCode: string;
  uom: string;
  associatedTo: string;
  handlingArea: string;
  customerId: number;
  alreadyCompleted: Boolean;
  requestedOn: Date;
  requestedBy: string;
  requestedQuantity: number;
  quantityOf: string;
  status: string;
  requestorContactNumber: string;
  documentReferenceId: number;
  notificationEmailId1: string;
  notificationEmailId2: string;
  notificationEmailId3: string;
  serviceRequestShipmentInfo: any;
  optionName: string;
  optionValue: string;
  mailAddressList: any;
  durationBased: Boolean;
  estimatedCharges: any;
  shipmentNumber: string;
  flightDate: any;
  flightKey: string;
  flightId: number = null;
  shipmentDate: Date = null;
  containerNumber: string = null;
  additionalRemarks: string = null;
  hawbNumber: string = null;
  serviceCategory: any;
}


export class ServiceRequestShipmentInfo extends BaseRequest {
  shipmentNumber: string = null;
  flightId: number = null;
  shipmentDate: Date = null;
  containerNumber: string = null;
  requestedQuantity: number = null;
  additionalRemarks: string = null;
  truckNumber: string = null;
}


export class BillingCreateServiceSetupRequest extends BaseRequest {
  serviceCode: string;
  name: string;
  associatedTo: string;
  adhocService: boolean;
  chargeCodeId: number;
  duration: boolean = false;
  quantityOf: string;
  uom: string;
  attachToCargo: boolean;
  handlingArea: string;
  leadTime: number;
  slaFor: number;
  allowForAgent: boolean;
  paidService: boolean;
  upfrontPayment: boolean;
  termsAndCondition: string;
  optionLov: any;
  quantity: boolean = false;
  option: boolean = false;
  serviceProviderCustomerType: any;
  defaultQuantity: number;
  quantityModifiable: boolean = false;
}
@Model(CustomerBillingAddress)
export class CustomerBillingAddress extends BaseRequest {
  @NotBlank()
  streetAddress: string = null;
  @NotBlank()
  //cityCode: string = 'SIN';
  cityCode: string = null;
  @NotBlank()
  countryCode: string = 'SG';
  @NotBlank()
  place: string = null;
  @NotBlank()
  postalCode: string = null;
  stateCode: string = null;
  customerId: number = null;
  countryName: string = null;
  specialTaxApplicabilityType: string = null;
}

@Model(CustomerBillingCycle)
export class CustomerBillingCycle extends BaseRequest {
  billingCycleId: number = null;
  customerInfoId: number = null;
  cycleCount: number = null;
  billGenerationDay: number = null;
  postingDay: number = null;
  postingType: string = null;
}

@Model(CustomerBillingInfo)
export class CustomerBillingInfo extends BaseRequest {
  customerId: number = null;
  customerInfoId: number = null;
  @NotBlank()
  paymentType: string = null;
  billingFrequency: string = null;
  financeSystemIdentificationNumber: string = null;
  nextBillingDate: Date = null;
  sdBillingCycle: any = null;
  apBillingCycle: any = null;
  apVendorCode: String = null
  apFrequency: String = null;
  apNextBillingDate: Date = null;
  apBillRunOne: number = null;
  apBillRunTwo: number = null;
  billRunDayOne: number = null;
  billRunDayTwo: number = null;
  @Min(0)
  billingBuffer: number = null;
  billedByGHA: Boolean = false;
  billedByAirline: Boolean = false;
  sendESupportDocument: Boolean = false;
  blackListed: Boolean = false;
  acceptCargo: Boolean = false;
  deliverCargo: Boolean = false;
  @Min(0)
  pendingAmount: number = null;
  adviceToStaff: string = null;
  customerName: string = null;
  customerCode: string = null;
  @NotBlank()
  paymentOptions: string = null;
  public customerBillingAddress: CustomerBillingAddress = new CustomerBillingAddress();
  @IsArrayOf(CustomerBillingCycle)
  apCycleList: Array<CustomerBillingCycle> = new Array<CustomerBillingCycle>();
  @IsArrayOf(CustomerBillingCycle)
  sdCycleList: Array<CustomerBillingCycle> = new Array<CustomerBillingCycle>();
}

@Model(CustomerBillingNotification)
export class CustomerBillingNotification extends BaseRequest {
  billingCustomerId: number = null;
  email: string = null;
  customerNotificationId: number = null;
  startDate: Date = null;
  endDate: Date = null;

}
@Model(CustomerBillingPaymentOptions)
export class CustomerBillingPaymentOptions extends BaseRequest {
  billingCustomerInfoId: number = null;
  type: string = null;
  customerPaymentId: number = null;
}
@Model(CustomerBillingSetupInfo)
export class CustomerBillingSetupInfo extends BaseRequest {
  public searchCustomerBillingInfo: CustomerBillingInfoForSearch = new CustomerBillingInfoForSearch();
  @IsArrayOf(CustomerBillingNotification)
  customerExceptionConfigurations: Array<CustomerExceptionConfiguration> = new Array<CustomerExceptionConfiguration>();
  public customerBillingInfo: CustomerBillingInfo = new CustomerBillingInfo();
  @IsArrayOf(CustomerBillingNotification)
  public customerBillingNotification: Array<CustomerBillingNotification> = new Array<CustomerBillingNotification>();
  @IsArrayOf(CustomerBillingPaymentOptions)
  public customerBillingPaymentOptions: Array<CustomerBillingPaymentOptions> = new Array<CustomerBillingPaymentOptions>();
}
@Model(CustomerBillingInfoForSearch)
export class CustomerBillingInfoForSearch extends BaseRequest {
  customerId: number = null;
  @NotBlank()
  customerName: string = null;

  customerCode: string = null;
}



@Model(CustomerExceptionConfiguration)
export class CustomerExceptionConfiguration extends BaseRequest {
  billingCustomerInfoId: number = null;
  billingChargeCodeId: number = null;
  customerExceptionConfigurationId: number = null;
  paymentType: string = null;
  chargeCodeDescription: string = null;
  changedPaymentType: string = null;
  chargeCodeBillByAirline: any = null;
  billByAirline: any = null;
  carrierCode: any = null;
}

export class CountryModel {
  code: String = null;
  desc: String = null;
}


@Model(CustomerPaymentAccount)
export class CustomerPaymentAccount extends BaseRequest {
  paymentAccountId: number = null;
  customerId: number = null;
  customerInfoId: number = null;
  paymentAccountNumber: string = null;
  chargeCategories: Array<string> = null;
  chargeCategoriesDesc: string = null;
  paymentAccountBalance: string = null;
  remarks: string = null;
}

@Model(TopupPaymentAccount)
export class TopupPaymentAccount extends BaseRequest {
  paymentAccountId: number = null;
  customerId: number = null;
  customerInfoId: number = null;
  paymentAccountNumber: string = null;
  //chargeCategories: Array<string> = null;
  chargeCategoriesDesc: string = null;
  paymentAccountBalance: string = null;
  creditOrDebitType: string = null;
  referenceNumber: string = null;
  chequeDate: any = null;
  paymentMode: any = null;
  bankName: string = null;
  amount: number = null;
  dateOrTime: any = null;
  invoiceNumber: string = null;
  remarks: string = null;
}

export class BillingVerificationForSearch extends BaseRequest {
  customerCode: number;
  chargeCode: number;
  chargeFactorId: number;
  awbOrServiceNumber: string;
  transactionDateFrom: Date;
  transactionDateTo: Date;
  counter: string;
  status: string;
  statusDateFrom: Date;
  statusDateTo: Date;
  verified: string;
  handlingArea: string;
}
export class BillingVerification extends BaseRequest {
  awbNumber: string;
  chargeAdviceDtt: string;
  customerName: string;
  customerCode: number;
  serviceType: string;
  flightNoDt: string;
  originalAmount: number;
  amount: number;
  verified: boolean;
  void: boolean;
  status: string;
}

export class WaiveApprovalListForSearch extends BaseRequest {
  awbOrServiceNumber: string;
  customerId: number;
  wavierRequestFromDate: Date;
  wavierRequestToDate: Date;
  status: string;
}


export class ListServiceRequest extends BaseRequest {
  hawbNumber: string;
  serviceRequestId: number;
  serviceRequestNo: number;
  uom: string;
  handlingArea: string;
  associatedTo: string;
  serviceCode: string;
  customerId: number;
  requestedFrom: Date;
  requestedTo: Date;
  status: string;
  shipmentNumber: string;
  flightId: number;
  containerNumber: string;
  rejectReason: string;
  remarks: string;
  additionalRemarks: string;
  requestedOn: Date;
  requestedBy: string;
  requestorContactNumber: number;
  requestedQuantity: number;
  quantityOf: string;
  startedOn: Date;
  completedOn: Date;
  documentReferenceId: number;
  notificationEmailId1: string;
  notificationEmailId2: string;
  notificationEmailId3: string;
  validateRequestedOn: Boolean;
  paymentStatus: string;
  upfrontPayment: Boolean;
  slaIndicator: string;
  optionName: string;
  optionValue: string;
}

export class EditServiceRequest extends BaseRequest {
  serviceCode: string;
  customerId: number;
  awbNumber: string;
  serviceNumber: string;
  documentReferenceId: number;
  optionName: string;
  optionValue: string;
}
export class ChargePostConfigurationSearch extends BaseRequest {
  billingChargeCodeId: number;
  chargeCodeDescription: string;
}

export class ChargePostConfiguration extends BaseRequest {
  billingChargeCodeId: number;
  chargePostConfigurationId: number;
  handlingArea: string;
  finSysChargeCode: number;
  apportionPercentage: number;
  shcHandlingGroup: string;
  finSysDescription: string;
}

export class BillingPayment extends BaseRequest {
  paymentId: number = null;
  paymentReceiptId: number = null;
  paymentMode: String = null;
  issuingBank: String = null;
  transactionReferenceNumber: String = null;
  transactionReferenceDate: Date = null;
  paymentStatus: String = null;
  paymentAmount: number = null;
  collectionUserCode: String = null;
  collectionStatus: String = null;
  collectionStatusDate: Date = null;
  reportRef: String = null;
  receiptNumber: String = null;
  counterNumber: String = null;
  awbOrServiceRequestNumber: String = null;
  receiptDate: Date;
}

export class CounterClosureVerificationForSearch extends BaseRequest {
  customerID: number = null;
  chargeCodeID: number = null;
  awbNumber: String = null;
  serviceNumber: String = null;
  awbOrServiceNumber: String = null;
  transactionDateFrom: Date = null;
  transactionDateTo: Date = null;
  counterNumber: String = null;
  reportRef: String = null;
  status: String = null;
  statusDateFrom: Date = null;
  statusDateTo: Date = null;
  modeOfPayment: String = null;
  transactionOrChequeNumber: String = null;
  collectionStatus: String = null;
  collectionUser: String = null;
}

export class SapInvoiceCreditNote extends BaseRequest {
  customerId: String;
  customerName: String;
  customerCode: number;
  finSysInvoiceNumber: String;
  dateTimeFrom: Date;
  dateTimeTo: Date;
  esupportDocEmailSent: String;
  sapInvoiceCreditNoteList: any;
}

export class SapInvoiceCreditNoteList extends BaseRequest {
  finSysInvoiceNumber: String;
  creditNoteDate: String;
  SapInvCreditNoteListForAmount: any;

}

export class SapInvCreditNoteListForAmount extends BaseRequest {
  amount: number;
  serviceType: String;
  isVoid: Boolean;
  eSupportDocEmailSent: Boolean;
  billEntryId: any;
  finSysInvoiceNumber: String;
  customerId: String;
}
export class PaymentGateWayRequest extends BaseRequest {
  paymentServiceId: String;
  paymentServicekey: String;
  amount: number;
  billingId: number;
  transactionType: String;
  successurl: String;
  failureUrl: String;
}

export class AirlineTonnageReport extends BaseRequest {
  carrierCode: String;
  reportName: String;
  reportOutputId: number;
  templateId: number;
  reportMode: String;
  status: String;
  statusOperationBy: String;
  reportDate: String;
  reportGenDateTime: String;
  statusDateTime: String;
  uploadedDocId: number;
  month: number;
  year: number;
  entityKey: number;
  entityType: String;
  entityDate: Date;
  entityKeyForNewUpload: String;
  entityDateForNewUpload: String;
}
