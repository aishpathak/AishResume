import {
  BaseService, RestService, BaseRequest, BaseResponse, BaseResponseData,
  NgcLOVComponent, Model, IsArrayOf, Min, Max, MinLength, NotBlank
} from 'ngc-framework';

import { Time } from '@angular/common/src/i18n/locale_data_api';



export class CurdOperations {
  public static operAdd = 'ADD';
  public static operUpd = 'UPD';
  public static operDel = 'DEL';
}

export class IrregularitySummary extends BaseRequest {
  newSequence: number;
  shipmentId: string;
  shipmentType: string;
  shipmentNumber: string;
  origin: string;
  destination: string;
  pieces: string;
  weight: string;
  natureOfGoods: string;
  specialHandlingCodes: string[];
  irregularityDetails: Array<IrregularityDetail>;
  irregularityDetailsHAWB: Array<IrregularityDetail>;
  shipmentHouseInfo: shipmentHouseInfo = new shipmentHouseInfo();
  specialHandlingCodeHAWB: string;
}

export class shipmentHouseInfo extends BaseRequest {
  hwbNumber: string;
  hwbOrigin: string;
  hwbDestination: string;
  hwbPieces: string;
  hwbWeight: string;
  hwbNatureOfGoods: string;
  hwbSHC: Array<String>;
}
export class emailInfo extends BaseRequest {
  customerCode: any;
}

export class IrregularityDetail extends BaseRequest {
  sequenceNumber: string;
  shipmentNumber: string;
  irregularityType: string;
  pieces: string;
  weight: string;
  flightKey: string;
  flightDate: string;
  remark: string;
  fdlSentFlag: boolean;
  source: string;
  destination: string;
  flagInsert: string;
  flagUpdate: string;
  additionalBulkWeight: string;
  additionalBupWeight: string;
  additionalActionRemarks: string;
  shipmentIrregularityId: string;
  bdPieceWeight: string;
  amPieceWeight: string;
}

export class SearchIrregularityRequest extends BaseRequest {
  selectShipmentType: string;
  shipmentNumber: string;
}

export class MaintainRemarkCommon extends BaseRequest {
  shipmentRemarkId: number;
  shipmentNumber: any = null;
  remarkType: string;
  remarks: string;
  flightKey: string;
  flightDate: Date;
  shipmentId: number;
  flightId: number;
  shipmentRemarks: string;
  createdOn: Date;
}

export class MaintainRemarkRequest extends BaseRequest {
  shipmentNumber: string;
  flightKey: string;
  flightDate: Date;
  handledbyHouse: boolean;
}

export class MaintainRemarkResponse extends BaseRequest {
  shipmentId: number;
  shipmentNumber: string;
  flightKey: string;
  flightDate: string;
  flightId: number;
  flightSource: string;
  flightDestination: string;
  noFlightRemarks: any;
  flightBasedRemarks: any;
}

export class MaintainRemarkDeleteRequest extends BaseRequest {
  remarkIdList: any[] = [];
  //shipmentNumber: string;
}

export class MaintainRemarkDeleteResponse extends BaseRequest { }

export class MarkShipmentForReuse extends BaseRequest {
  shipmentId: number;
  awbPrefix: string;
  awbSuffix: string;
  awbshipmentNumber: string;
  awbResponseNumber: string;
  origin: string;
  remarks: string;
  searchShipmentNumberForReuse: Array<SearchShipmentNumberForReuse>;
}

export class SearchShipmentNumberForReuse extends BaseRequest {
  shipmentId: number;
  shipmentNumber: string;
  source: string;
  approvedBy: string;
  createdDateAndTime: string;
  remarks: string;
}

export class AddShipmentNumberForReuse extends BaseRequest {
  awbPrefix: string;
  awbSuffix: string;
  shipmentNumber: string;
  origin: string;
  remarks: string;
}

export class SearchAWB extends BaseRequest {
  shipmentNumber: number;
  flightId: string;
  flightKey: string;
  flightKeyDate: string;
  flightDate: string;
  hawbNumber: string;
  handledbyHouse: boolean;
}

export class SearchShipmentLocation extends BaseRequest {
  shipmentType: string;
  shipmentNumber: string;
  shipmentId: Number;
  shipmentIdfreight: Number;
  loggedInUser: string;
  appFeatures: any;
  shipment: string;
}

export class ShipmentMaster extends BaseRequest {
  shipmentNumber: number;
  shipmentDate: string;
  shipmentId: number;
  origin: string;
  shipmentTypeflag: string;
  destination: string;
  pieces: string;
  weight: DoubleRange;
  natureOfGoods: string;
  specialHandlingCode: string;
  shcList: Array<string>;
  hold: boolean;
  reasonForHold: string;
  partShipment: boolean;
  lastUpdatedTime: any;
  shipmentOnHoldDetails: Array<ShipmentInventory>;
  freightOutArray: Array<FreightOut>;
  arrivalFltlist: Array<ArrivalFlightInfo>;
  bookingDetails: Array<SingleShipmentBooking>;
  bookingPieces: string;
  bookingWeight: DoubleRange;
  partSuffix: String;
  partSuffixList: Array<String>
}
export class SingleShipmentBooking extends BaseRequest {
  origin: String;
  destination: String;
  pieces: Number;
  grossWeight: DoubleRange;
  partWeight: Number;
  partPieces: Number;
  flightId: Number;
  partSuffix: String;
  flightKey: String;
  flightOriginDate: String;
  flightBoardPoint: String;
  flightOffPoint: String;

  breakDownPieces: Number;
  breakDownWeight: DoubleRange;
  documentReceivedFlag: String;
  photoCopyAwbFlag: String;
  dateATA: String;
  manifestPiece: Number;
  manifestWeight: DoubleRange;

  invPiece: Number;
  invWeight: DoubleRange;
}
export class ShipmentInventory extends BaseRequest {
  shipmentLocation: string;
  piecesInv: Number;
  weightInv: string;
  warehouseLocation: string;
  flightId: string;
  flightKey: string;
  flightKeyDate: string;
  specialHandlingCodeInv: string;
  shcListInv: Array<ShipmentInventoryShcModel>;
  hold: boolean;
  modifiedBy: string;
  modifiedOn: string;
  remarks: string;
  holdSelected: boolean;
  shipmentId: number;
  reasonForHold: string;
  handlingArea: string;
  selectAll: boolean;
  selected: boolean;
  unableToLocate: Number;
  deliveryRequestOrderNo: string;
  deliveryOrderNo: string;
  shipmentNumber: number;
  shipmentDate: string;
  partSuffix: String;
}

export class ShipmentInventoryShcModel extends BaseRequest {
  shcInv: string;
}

export class ShipmentInventoryHouse extends BaseRequest {
  houseWayBillId: Number;
  shipmentId: Number;
  shipmentInventoryId: Number;
  houseNumber: string;
  hawbBDPcs: Number;
  hawbBDWt: Number;
  hawbRemarks: string;
  inventoryPieces: Number;
  inventoryWeight: Number;
}

export class FreightOut extends BaseRequest {
  sno: Number;
  freightOut: string;
  flightKeyDate: string;
  piecesFreightOut: Number;
  weightFreightOut: string;
}

export class ArrivalFlightInfo extends BaseRequest {
  flight_ID: Number;
  flightKey: string;
  flightDate: string;
  arrivalShipmentShcs: Array<string>;
}

export class HouseSearch extends BaseRequest {
  awbNumber: number;
  hawbNumber: number;

}
export class MasterAirWayBillModel extends BaseRequest {

  awbNumber: number;
  hawbNumber: number;
  origin: any = null;
  destination: any = null;
  pieces: number;
  weight: DoubleRange;
  weightCode: any = null;
  natureOfGoods: any = null
  totalHWB: number;
  totalPieces: number;
  totalweightd: DoubleRange;
  maintainHouseDetailsList: any;
  houseModel: HouseModel;
}

export class MasterAirWayBillModelEdit extends BaseRequest {

  awbNumber: number;
  hawbNumber: number;
  origin: any = null;
  destination: any = null;
  pieces: number;
  weight: DoubleRange;
  weightCode: any = null;
  natureOfGoods: any = null;
  totalHWB: number;
  totalPieces: number;
  totalweightd: DoubleRange;
  maintainHouseDetailsList: Array<HouseModel> = new Array<HouseModel>();
  houseModel: HouseModel;
}

export class HouseModel extends BaseRequest {
  // shc: string = null;
  awbNumber: any;
  hawbNumber: any = null;
  houseId: number = null;
  origin: any = null;
  destination: any = null;
  pieces: number = null;
  weight: DoubleRange = null;
  natureOfGoods: any = null;
  specialHandlingCode: any = null;
  slac: any = null;
  shcList: any = null;
  shipperName: any = null;
  consigneeName: any = null;
  flagCRUD: string;
  shipper: HouseCustomerModel = new HouseCustomerModel();
  consignee: HouseCustomerModel = new HouseCustomerModel();
  otherChargeDeclarations: HouseOtherChargeDeclarationModel = new HouseOtherChargeDeclarationModel();
  shc: Array<HouseSpecialHandlingCodeModel> = new Array<HouseSpecialHandlingCodeModel>();
  description: Array<HouseDescriptionOfGoodsModel> = new Array<HouseDescriptionOfGoodsModel>();
  tariffs: Array<HouseHarmonisedTariffScheduleModel> = new Array<HouseHarmonisedTariffScheduleModel>();
  oci: Array<HouseOtherCustomsInformationModel> = new Array<HouseOtherCustomsInformationModel>();
  weightUnitCode: number = null;
  chargeableWeight: number = null;
  houseDimension: HousewayDimentionForm = new HousewayDimentionForm();
}
export class HouseCustomerAddressModel extends BaseRequest {
  HouseCustomerAddressModeldd: number;
  id: number;
  streetAddress: any = null;
  city: any = null;
  country: any = null;
  place: any = null;
  state: any = null;
  postal: any = null;
  contacts: Array<HouseCustomerContactsModel> = new Array<HouseCustomerContactsModel>();
}

export class HouseCustomerModel extends BaseRequest {
  houseId: number;
  id: number;
  code: any = null;
  address: HouseCustomerAddressModel = new HouseCustomerAddressModel();
  appointedAgent: any = null;
  appointedAgentCode: number = null;
  name: any = null;
}

export class HouseSpecialHandlingCodeModel extends BaseRequest {
  houseId: number;
  id: number;
  code: any = null;
}

export class Shc extends BaseRequest {
  houseId: number;
  id: number;
  code: string = null;

}
export class DescriptionOfGoods extends BaseRequest {
  houseId: number;
  id: number;
  content: string = null;
}
export class Tariffs extends BaseRequest {
  houseId: number;
  id: number;
  code: string = null;
}
export class Oci extends BaseRequest {
  houseId: number;
  id: number;
  isoCountryCode: string = null;
  country: string = null;
  identifier: string = null;
  csrcIdentifier: string = null;
  scsrcInformation: string = null;
}

export class HouseOtherCustomsInformationModel extends BaseRequest {
  houseId: number;
  id: number;
  country: any = null;
  identifier: any = null;
  csrcIdentifier: any = null;
  scsrcInformation: any = null;
}

export class HouseOtherChargeDeclarationModel extends BaseRequest {
  houseId: number;
  id: number;
  currencyCode: any = null;
  declaredCharge: any = null;
  pcIndicator: any = null;
  otherCharge: any = null;
  carriageValue: any = null;
  insuranceValue: any = null;
  customValue: any = null;
}

export class ChargeDeclarations extends BaseRequest {
  houseId: number;
  id: number;
  isoCurrencyCode: number = null;
  currencyCode: String = null;
  chargeCode: String = null;
  prepaidCollectChargeDeclarationsPCIndicatorWeightValuation: String = null;
  prepaidCollectChargeDeclarationsPCIndicatorOtherCharges: String = null;
  pcIndicator: String = null;
  valueForCarriageDeclaration: String = null;
  carriageValue: String = null;
  noValueForCarriageDeclaration: String = null;
  valueOfCustomsDeclaration: String = null;
  customValue: String = null;
  noValueOfCustomsDeclaration: String = null;
  valueOfInsuranceDelcaration: String = null;
  insuranceValue: String = null;
  noValueOfInsuranceDeclaration: String = null;
  otherCharge: String = null;
}

export class OtherChargeDeclarations extends BaseRequest {
  houseId: number;
  id: number;
  currencyCode: String = null;
  pcIndicator: String = null;
  carriageValue: String = null;
  customValue: String = null;
  insuranceValue: String = null;
  otherCharge: String = null;
}

export class HouseHarmonisedTariffScheduleModel extends BaseRequest {
  houseId: number;
  id: number;
  code: any = null;
}

export class HouseClearanceInfoModel extends BaseRequest {
  houseId: number;
  id: number;
  number: any = null;
  type: string = null;
}

export class HouseDescriptionOfGoodsModel extends BaseRequest {
  houseId: number;
  id: number;
  content: any = null;
}

export class HouseCustomerContactsModel extends BaseRequest {
  houseCustomerAddressId: number;
  id: number;
  type: any = null;
  detail: any = null;
}


//awb
export class AWBDocumentModel extends BaseRequest {
  originOfficeExchange: String;
  shipmentType: String;
  mailCategory: String;
  mailSubCategory: String;
  destinationOfficeExchange: String;
  dispatchYear: number;
  svc: boolean;
  partShipment: boolean;
  registered: boolean;
  manuallyCreated: boolean;

  documentReceivedOn: String;
  isIATA: boolean;
  documentPouchReceivedOn: String;
  consignee: ShipmentMasterCustomerInfo;
  shipper: ShipmentMasterCustomerInfo;
  otherChargeInfo: ShipmentOtherChargeInfo;
  handlingArea: ShipmentMasterHandlingArea;
  routing: Array<ShipmentMasterRoutingInfo>;
  shcs: Array<ShipmentMasterShc>;
  shcHandlingGroup: Array<ShipmentMasterShcHandlingGroup>;
  ssrRemarksList: Array<ShipmentRemarksModel>;
  osiRemarksList: Array<ShipmentRemarksModel>;
  localAuthority: ShipmentMasterLocalAuthorityInfo;


  shipmentId: number;
  shipmentNumber: String;
  shipmentdate: String;
  origin: String;
  destination: String;
  shipmentDescriptionCode: String;
  piece: number;
  weightUnitCode: String;
  weight: number;
  volumeunitCode: String;
  volumeAmount: number;
  densityIndicato: String;
  densityGroupCode: number;
  totalPieces: number;
  natureOfGoodsDescription: String;
  movementPriorityCode: String;
  //customsOriginCode: String;
  customsReference: String;
  photoCopy: boolean;
  barcodePrintedFlag: number;
  carrierCode: String;
  shcCode: String;
  carrierDestination: String;

}

export class ShipmentMasterCustomerInfo extends BaseRequest {

  id: number;
  shipmentId: number;
  customerType: String;
  customerCode: String;
  customerName: String;
  contactEmail: String;
  notifyPartyCode: String;
  notifyPartyName: String;
  accountNumber: number;
  appointedAgent: number;
  overseasCustomer: boolean;
  address: ShipmentMasterCustomerAddressInfo;

}

export class ShipmentMasterCustomerAddressInfo extends BaseRequest {
  id: number;
  shipmentCustomerInfoId: number;
  streetAddress: String;
  place: String;
  postal: String;
  stateCode: String;
  countryCode: String;
  contacts: ShipmentMasterCustomerContactInfo;
  // contact1: ShipmentMasterCustomerContactInfo;
  // contact2: ShipmentMasterCustomerContactInfo;

}

export class ShipmentMasterCustomerContactInfo extends BaseRequest {

  id: number;
  shipmentAddressInfoId: number;
  contactTypeCode: String;
  contactTypeDetail; String;
}

export class ShipmentOtherChargeInfo extends BaseRequest {
  shipmentId: number;
  shipmentOtherChargesId: number;
  customsOrigin: String;
  chargeCode: String;
  currency: String;
  collectBankEndorsementClearanceLetter: boolean;
  dueFromAirline: number;
  dueFromAgent: number;

}

export class ShipmentMasterHandlingArea extends BaseRequest {
  shipmentId: number;
  shipmentMasterHandlAreaId: number;
  handledBy: String;

}


export class ShipmentMasterRoutingInfo extends BaseRequest {
  shipmentId: number;
  shipmentMasterRoutingId: number;
  fromPoint: String;
  carrier: String;


}

export class ShipmentMasterShc extends BaseRequest {
  id: number;
  shipmentId: number;
  specialHandlingCode: String;

}


export class ShipmentMasterShcHandlingGroup extends BaseRequest {

  id: number;
  shipmentId: number;
  handlingGroupId: number;
}


export class ShipmentRemarksModel extends BaseRequest {

  shipmentRemarkId: number;
  shipmentNumber: String;
  shipmentDate: String;
  shipmentID: number;
  remarkType: String;
  flightID: number;
  shipmentRemark: String;

}

export class ShipmentMasterLocalAuthorityInfo extends BaseRequest {

  id: number;
  shipmentId: number;
  type: String;
  details: Array<ShipmentMasterLocalAuthorityDetails>;

}

export class ShipmentMasterLocalAuthorityDetails extends BaseRequest {

  id: number;
  transactionSequenceNo: number;
  shipmentMasterLocalAuthInfoId: number;
  customerAppAgentId: number;
  referenceNumber: String;
  license: String;
  remarks: String;


}

export class FetchAWBRequest extends BaseRequest {
  shipmentNumber: String;
  nonIATA: boolean;
  svc: boolean;
  shipmentdate: String;

}


export class CreateCN46 extends BaseRequest {
  observations: string;
  adminOfOriginOfMails: string;
  airportOfLoading: string;
  airportOfOffLoading: string;
  destinationOffice: string;
  flightId: number;
  segmentId: number;
  airmailManifestId: number;
  trolleyNumber: string;
  flightKey: string;
  flightDate: string;
  bulkFlag: boolean;
  outgoingFlightKey: string;
  outgoingFlightDate: any;
  cn46Details: Array<CN46Details>;
}

export class CN46Details extends BaseRequest {
  mailNumber: string;
  uldNumber: string;
  weight: string;
  originOfficeExchange: string;
  destinationOfficeExchange: string;
  airportOfTranshipment: string;
  airportOfOffloading: string;
  dateOfDispactch: string;
  letterPost: number;
  cp: number;
  otherItems: number;
  remarks: string;
}

export class ShipmentInfoReqModel extends BaseRequest {
  shipmentNumber: string;
  shipmentDate: Date;
  shipmentType: string;
  printerName: string;
  userLoginCode: string;
  hwbNumber: string;
  shipmentHouseId: string;
}

export class ShipmentInformation extends BaseRequest {
  shipmentNumber: string;
  shipmentDate: Date;
  dimensionList: any;
}

export class AwbPrintRequestList extends BaseRequest {
  printerName: String;
  awbNumber: String;
  flightOffPoint: String;
  destination: String;
  carrierCode: String;
  shipmentId: String;
}

export class ShipmentSearch extends BaseRequest {
  shipmentNumber: string;
  hawbNumber: string;
}

export class CoolportShipmetSearch extends BaseRequest {
  by: string;
  carrierGroup: string;
  carrierCode: string;
  dateTimeFrom: string;
  dateTimeTo: string;
  awbNumber: string;
  temparature: string;
}

export class ULDTemperatureEntrySearch extends BaseRequest {
  uldKey: string;
  dateFrom: Date;
  dateTo: Date;
  uldTemperatureLogId: number;
}

export class ULDTempEntrySave extends BaseRequest {
  addUldTemperature: Array<ULDTemperatureLogEntry>
}

export class ULDTemperatureLogEntry extends BaseRequest {
  uldKey: string;
  temperatureType: string;
  temperatureTypeValue: string;
  uldEvent: string;
  temperature: string;
  temperatureCaptureDt: Date;
  remarks: string;
  uldTemperatureLogId: any;
}

export class ShipmentTemperatureRange extends BaseRequest {
  SVC: boolean;
  shipmentNumber: string;
  shipmentId: string;
  temperatureRange: string;
  Origin: string;
  Destination: string;
  pieces: number;
  weight: DoubleRange;
  chargeCode: string;
  temperatureLogEntryData: Array<TemperatureLogEntry>
}

export class TemperatureLogEntryArray extends BaseRequest {
  TemperatureLogEntryElements: Array<TemperatureLogEntry>
}
export class TemperatureLogEntry extends BaseRequest {
  flagSave: any;
  shipmentId: number;
  shipmentNumber: string;
  temperature: any;
  capturedOn: any;
  activity: String;
  shipmentDescription: String;
  locationCode: String;
  hawbNumber: String;
}

export class date extends BaseRequest {

}

export class SearchInactiveCargo extends BaseRequest {
  shipmentData: Array<ShipmentData> = [];
  carrierCode: string;
  carrierGp: number;
  shcode: string;
  creationdays: number;
  remarks: string;
  remarkType: string;
  flightkey: string;
  flightDate: string;
  shipmentNumber: string;
  hawbNumber: string;
  deliveryOrderNo: string;
  trmNumber: string;
  trmDate: string;
  shipmentType: String;
  type: string;
  agent: string;
  awbPieces: number;
  awbWeight: number;
  inventoryId: Array<any> = [];
  localAuthorityDetail: Array<any> = [];
  isHandledByHouse: boolean;
}

export class ShipmentData extends BaseRequest {
  shipmentId: number
  origin: string;
  destination: string;
  awbNumber: string;
  pieces: number;
  weight: number;
  agent: string;
  shipmentType: string;
  shipmentDate: Date;
  natureOfGoodsDescription: string;
  totalPieces: number;
  totalWeight: number;
}

export class MailbagOverviewReqModel extends BaseRequest {
  searchMode: string;
  uldtrolley: string;
  dispatchNumber: number;
  dispatchSeries: string;
  origin: string;
  destination: string;
  fromDate: Date;
  toDate: Date
  xrayresult: string;
  mailbagNumber: String;
}

export class ChangeAWB extends BaseRequest {
  shipmentNumber: number;
  newShipmentNumber: number;
  reasonOfChangeAwb: number;
}

export class ChangeHAWB extends BaseRequest {
  shipmentNumber: number;
  hawbNumber: any;
  newHawbNumber: any;
  reasonOfChangeHawb: number;
}


/**
 * 
 *    Terminal to terminal Handover
 * 
/**
 * 
 * 
 * @export
 * @class TerminalPoint
 * @extends {BaseRequest}
 */
export class TerminalPoint extends BaseRequest {

  public toTrml: String;
  public fromTrml: String;
  public terminalPointDetails: TerminalPointDetails;
}

export class TerminalPointDetails extends BaseRequest {


  public purpose: String;
  public shpNumber: String;
  public loadingDetails: String;
  public shipmentId: number;
  public uldId: number;
  public receipentDetails: ReceipentDetails;
  public subscriberDetails: SubscriberDetails;
  public handoverTerminalShp: HandoverTerminalShp;
  public handoverTerminalShpList: Array<HandoverTerminalShp>;
}

export class HandoverTerminalShp extends BaseRequest {

  public origin: String;
  public shpNumber: String;
  public destination: String;
  public loadingDetails: String;
  public piecesweight: String;
  public originDestination: String;
  public pieces: number;
  public weight: number;
  public shipmentId: number;
  public uldId: number;
  public flight: Flight;
}

export class Flight extends BaseRequest {

  public number: String;
  public destination: String;
  public dateSTD: Date;
  public onwardBookingDetails: String;
  // public time: Time;
}

export class ReceipentDetails extends BaseRequest {

  public receivedBy: String;
  public receiverSignature: String;
  public receivedTime: Time;
  public receivedDate: Date;
}

export class SubscriberDetails extends BaseRequest {

  public handedOverBy: String;
  public handedOverOn: Date;
  public handedTime: Time;
}

export class SearchGroup extends BaseRequest {

  public terminalPoint: TerminalPoint;
  //  public terminalPointDetails: TerminalPointDetails;
  //  public subscriberDetails: SubscriberDetails;
  //  public receipent: ReceipentDetails;
  public terminalPointList: Array<TerminalPoint>;
}
//Hold Notify Group Changes starts
export class holdNotifyShipmentRequest extends BaseRequest {
  terminal: string;
  holdNotifyGroup: string;
  from: string;
  to: string;
  utl: boolean;
  acknowledge: string;
}
export class UnHoldRequest extends BaseRequest {
  shipmentNumber: any;
  unHoldRemarks: any;
}
export class UpdateHoldNotifyGroup extends BaseRequest {
  holdNotifyGroup: string;
  shipmentNumber: any;
}
export class UpdateAck extends BaseRequest {
  shipmentInventoryId: Array<number>;
}
//Hold Notify Group Changes ends

export class AwbRoutingReqModel extends BaseRequest {
  flagCRUD: 'R';
  shipmentNumber: String;
  carrier: String;
  flightNumber: String;
  shipmentOrigin: String;
  shipmentDestination: String;
  incomingFlightId: String;
  shipmentDate: String;
  flightDate: String;
  flightBoardPoint: string;
  flightOffPoint: String;
  flightType: string;

}
/**
 *     END
 */





export class LOVRequest {
  parameter1: string;
  authorizationId: string;
  sourceId: string;
}

/* 
* REACTIVE FORM MADE FOR AWB DOCUMENT
*/

@Model(Details)
export class Details extends BaseRequest {
  license: string = null;
  remarks: string = null;
  shipmentId: number = null;
  referenceNumber: string = null;
  deliveryOrderNo: string = null;
  tsRedocFlightKey: string = null;
  tsRedocFlightDate: string = null;
  customerAppAgentId: string = null;
  appointedAgentName: string = null;
  transactionSequenceNo: string = null;
  shipmentMasterLocalAuthInfoId: number = null;
  shipmentMasterLocalAuthInfoDtlsId: number = null;
}

@Model(LocalAuthority)
export class LocalAuthority extends BaseRequest {
  type: string = null;
  shipmentId: number = null;
  shipmentMasterLocalAuthInfoId: number = null;
  @IsArrayOf(Details)
  details: Array<Details> = new Array<Details>();
}

@Model(SsrRemarksList)
export class SsrRemarksList extends BaseRequest {

}

@Model(Shcs)
export class Shcs extends BaseRequest {

}

@Model(Routing)
export class Routing extends BaseRequest {

}

@Model(OsiRemarksList)
export class OsiRemarksList extends BaseRequest {

}

@Model(GeneralRemarks)
export class GeneralRemarks extends BaseRequest {

}

@Model(AwbManagementformSearch)
export class AwbManagementformSearch extends BaseRequest {
  nonIATA: boolean = false;
  shipmentType: string = null;
  shipmentNumber: string = null;
}

@Model(FwbContacts)
export class FwbContacts extends BaseRequest {
  customerType: string = null;
  contactTypeCode: string = null;
  contactTypeDetail: string = null;
}

@Model(GrossWeightDetails)
export class GrossWeightDetails extends BaseRequest {
  weightCode: String = null;
  weight: number = null;
}
@Model(AwbManagementform)
export class AwbManagementform extends BaseRequest {
  fwb: string = null;
  fhl: string = null;
  eawb: string = null;
  svc: boolean = false;
  origin: string = null;
  @Min(1)
  pieces: number = null;
  weight: number = null;
  weightCode: String = null;
  chargeableWeight: number = null;
  shcCode: string = null;
  minccFee: number = null;
  flightId: string = null;
  departedOn: Date = null;
  original: boolean = false;
  photoCopy: boolean = false;
  console: boolean = false;
  flightKey: string = null;
  oldWeight: number = null;
  oldPieces: number = null;
  nonIATA: boolean = false;
  isExport: boolean = false;
  caseNumber: string = null;
  chargeCode: string = null;
  shipmentId: number = null;
  documentDate: Date = null;
  flightType: string = null;
  flightDate: string = null;
  rcarStatus: string = null;
  shipmentdate: Date = null;
  checkList: boolean = false;
  destination: string = null;
  totalPieces: number = null;
  carrierCode: string = null;
  documentType: string = null;
  handlingArea: string = null;
  registered: boolean = false;
  volumeAmount: string = null;
  dispatchYear: string = null;
  actualPieces: number = null;
  actualWeight: number = null;
  shipmentType: string = 'AWB';
  customsOrigin: string = null;
  docRecieved: boolean = false;
  firstOffPoint: string = null;
  @MinLength(11)
  shipmentNumber: string = null;
  awbNumber: string = null;
  partShipment: boolean = false;
  ovcdReasonCode: string = null;
  weightUnitCode: string = null;
  flightOffPoint: string = null;
  volumeunitCode: string = null;
  acceptanceType: string = null;
  pouchRecieved: boolean = false;
  couToCommercial: boolean = false;
  couToCommercialDate: string = null;
  ccFeeprecentage: number = null;
  shcHandlingGroup: string = null;
  densityGroupCode: string = null;
  densityIndicator: string = null;
  flightBoardPoint: string = null;
  customsReference: string = null;
  manuallyCreated: boolean = false;
  customsOriginCode: string = null;
  firstBookedFlight: string = null;
  carrierDestination: string = null;
  irregularityPieces: number = null;
  irregularityWeight: number = null;
  documentReceivedOn: string = null;
  shipmentDelivered: boolean = false;
  photoCopyReceivedOn: string = null;
  movementPriorityCode: string = null;
  shipmentDescriptionCode: string = null;
  handledByDOMINT: string = null;
  handledByMasterHouse: string = null;
  handledByHouse: string = null;
  hold: boolean = null;
  holdRemarks: string = null;
  holdReason: string = null;
  loadingPoint: string = null;
  bankName: string = null;
  disburseFee: number = null;
  totalLoosePieces: number = 0;
  totalPrepackWeight: number = 0.0;
  totalLooseWeight: number = 0.0;
  totalPrepackPieces: number = 0;

  awbloosePieces: number = 0;
  awblooseWeight: number = 0.0;
  awbprepackPieces: number = 0;
  awbprepackWeight: number = 0.0;

  holdUserGroupToNotify: string = null;
  ccCode: string = null;
  documentPouchReceivedOn: string = null;
  directShipperCustomerId: number = null;
  natureOfGoodsDescription: string = null;
  natureOfGoods: string = null;
  slac: string = null;
  directConsigneeCustomerId: number = null;
  isLastUpdatedDateTimeExist: boolean = false;
  distinguishRemarks: string = null;

  public chargeDeclarations: ChargeDeclarations = new ChargeDeclarations();
  public otherChargeDeclarations: OtherChargeDeclarations = new OtherChargeDeclarations();
  public goodsDescription: GoodsDescription = new GoodsDescription();
  public grossWeightDetails: GrossWeightDetails = new GrossWeightDetails();
  public otherChargeInfo: OtherChargeInfo = new OtherChargeInfo();
  public shipper: Shipper = new Shipper();
  public consignee: Consignee = new Consignee();
  public notify: Notify = new Notify();
  public alsoNotify: AlsoNotify = new AlsoNotify();
  public shipmentAdditionalInformation: ShipmentAdditionalInformation = new ShipmentAdditionalInformation();
  @IsArrayOf(LocalAuthority)
  localAuthority: Array<LocalAuthority> = new Array<LocalAuthority>();
  @IsArrayOf(Shcs)
  shcs: Array<Shcs> = new Array<Shcs>();
  @IsArrayOf(Routing)
  routing: Array<Routing> = new Array<Routing>();
  @IsArrayOf(SsrRemarksList)
  ssrRemarksList: Array<SsrRemarksList> = new Array<SsrRemarksList>();
  @IsArrayOf(OsiRemarksList)
  osiRemarksList: Array<OsiRemarksList> = new Array<OsiRemarksList>();
  @IsArrayOf(GeneralRemarks)
  generalRemarks: Array<GeneralRemarks> = new Array<GeneralRemarks>();
  shipmentMasterFlightTonnageInfo: Array<ShipmentMasterFlightTonnageInfo> = new Array<ShipmentMasterFlightTonnageInfo>();
  @IsArrayOf(HouseClearanceInfoModel)
  license: Array<HouseClearanceInfoModel> = new Array<HouseClearanceInfoModel>();
  @IsArrayOf(HouseClearanceInfoModel)
  permit: Array<HouseClearanceInfoModel> = new Array<HouseClearanceInfoModel>();
  @IsArrayOf(DescriptionOfGoods)
  descriptionOfGoods: Array<DescriptionOfGoods> = new Array<DescriptionOfGoods>();
  @IsArrayOf(Tariffs)
  tariffs: Array<Tariffs> = new Array<Tariffs>();
  @IsArrayOf(Shc)
  shc: Array<Shc> = new Array<Shc>();
  @IsArrayOf(Oci)
  oci: Array<Oci> = new Array<Oci>();
}

@Model(ShipmentMasterFlightTonnageInfo)
export class ShipmentMasterFlightTonnageInfo extends BaseRequest {
  @MinLength(11)
  shipmentNumber: string = null;
  shipmentdate: Date = null;
  shipmentMasterFlightTonnageInfoId: number = null;
  flightKey: string = null;
  flightDate: string = null;
  loosePieces: number = null;
  looseWeight: number = null;
  prepackPieces: number = null;
  prepackWeight: number = null;
  deleted: boolean = false;
}
@Model(ShipmentAdditionalInformation)
export class ShipmentAdditionalInformation extends BaseRequest {
  shipmentAdditionalInformationId: number = null;
  shipmentId: number = null;
  protectedN: boolean = false;
  tarmacTransfer: boolean = false;
  interfaceTransfer: boolean = false;
  dgonHold: boolean = false;
  itfs: boolean = false;
  muwpermissionType: string = null;
  ril: String = null;
  remarks: string = null;
}

@Model(OtherChargeInfo)
export class OtherChargeInfo extends BaseRequest {
  tax: number = null;
  ccFee: number = null;
  total: number = null;
  currency: string = null;
  shipmentId: number = null;
  chargeCode: string = null;
  dueFromAgent: number = null;
  exchangeRate: number = null;
  customsOrigin: string = null;
  dueFromAirline: number = null;
  freightCharges: number = null;
  valuationCharges: number = null;
  shipmentOtherChargesId: number = null;
  totalCollectChargesChargeAmount: number = null;
  destinationCurrencyChargeAmount: number = null;
  collectBankEndorsementClearanceLetter: boolean = false;
  bankName: string = null;
  disburseFee: number = null;
}

@Model(CustomerContactInfo)
export class CustomerContactInfo extends BaseRequest {
  contactIdentifier: string = null;
  contactDetail: string = null;
}


@Model(CustomerAddressInfo)
export class CustomerAddressInfo extends BaseRequest {
  @Max(17)
  customerPlace: string = null;
  @Max(10)
  postalCode: string = null;
  stateCode: string = null;
  countryCode: string = null;
  @Max(70)
  @IsArrayOf(CustomerContactInfo)
  customerContactInfo: Array<CustomerContactInfo> = new Array<CustomerContactInfo>();

  city: string = null;

  state: string = null;

  houseId: number = null;
  country: string = null;
  cityCode: string = null;
  appointedAgentCode: string = null;


}


@Model(Shipper)
export class Shipper extends BaseRequest {
  customerId: number = null;
  contactEmail: string = null;
  customerCode: string = null;
  customerName: string = null;
  conacatName: string = null;
  conacatAddress: string = null;
  @Max(10)
  accountNumber: string = null;
  appointedAgent: string = null;
  appointedAgentId: string = null;
  isDirectCustomer: Boolean = false;
  appointedAgentCode: string = null;
  public address: Address = new Address();
  public customerAddressInfo: CustomerAddressInfo = new CustomerAddressInfo();


  id: number = null;
  name: string = null;
  code: string = null;
  houseId: number = null;

  overseasCustomer: boolean = false;
  authorizedPersonnel: string = null;
  authorizationRemarks: string = null;


}

@Model(Consignee)
export class Consignee extends BaseRequest {
  customerId: number = null;
  contactEmail: string = null;
  customerCode: string = null;
  customerName: string = null;
  conacatName: string = null;
  conacatAddress: string = null;
  @Max(10)
  accountNumber: string = null;
  appointedAgent: string = null;
  appointedAgentId: string = null;
  appointedAgentCode: string = null;
  overseasCustomer: boolean = false;
  authorizedPersonnel: string = null;
  authorizationRemarks: string = null;
  public address: Address = new Address();
  public customerAddressInfo: CustomerAddressInfo = new CustomerAddressInfo();
  fwbContactInfo: Array<FwbContacts> = new Array<FwbContacts>();
  ivrsContactInfo: Array<FwbContacts> = new Array<FwbContacts>();



  id: number = null;
  name: string = null;
  code: string = null;
  houseId: number = null;

  customRegistrationId: string = null;
  oldCode: any = null;


}

@Model(Notify)
export class Notify extends BaseRequest {
  customerId: number = null;
  contactEmail: string = null;
  customerCode: string = null;
  customerName: string = null;
  conacatName: string = null;
  conacatAddress: string = null;
  @Max(10)
  accountNumber: string = null;
  appointedAgent: string = null;
  appointedAgentId: string = null;
  appointedAgentCode: string = null;
  overseasCustomer: boolean = false;
  authorizedPersonnel: string = null;
  authorizationRemarks: string = null;
  public address: Address = new Address();
  public customerAddressInfo: CustomerAddressInfo = new CustomerAddressInfo();
  fwbContactInfo: Array<FwbContacts> = new Array<FwbContacts>();
  ivrsContactInfo: Array<FwbContacts> = new Array<FwbContacts>();
  id: number = null;
  name: string = null;
  code: string = null;
  houseId: number = null;
  customRegistrationId: string = null;
  oldCode: any = null;
}

@Model(AlsoNotify)
export class AlsoNotify extends BaseRequest {
  customerId: number = null;
  contactEmail: string = null;
  customerCode: string = null;
  customerName: string = null;
  @Max(10)
  accountNumber: string = null;
  appointedAgentId: string = null;
  appointedAgentCode: string = null;
  public address: Address = new Address();
  public customerAddressInfo: CustomerAddressInfo = new CustomerAddressInfo();
}

@Model(Contacts)
export class Contacts extends BaseRequest {
  contactTypeCode: string = null;
  contactTypeDetail: string = null;
  type: string = null;
  detail: string = null;
}

@Model(Address)
export class Address extends BaseRequest {
  @Max(17)
  place: string = null;
  @Max(10)
  postal: string = null;
  stateCode: string = null;
  countryCode: string = null;
  @Max(70)
  streetAddress: string = null;
  @IsArrayOf(Contacts)
  contacts: Array<Contacts> = new Array<Contacts>();

  city: string = null;

  state: string = null;

  houseId: number = null;
  country: string = null;
  cityCode: string = null;
  appointedAgentCode: string = null;


}

@Model(AppointedAgentForm)
export class AppointedAgentForm extends BaseRequest {
  code: string = null;
  name: string = null;
  place: string = null;
  postal: string = null;
  stateCode: string = null;
  countryCode: string = null;
  contactType: string = null;
  streetAddress: string = null;
  accountNumber: string = null;
  contactTypeDetails: string = null;
  authorizationRemarks: string = null;
}


@Model()
export class FileUploadModel extends BaseRequest {
  uploadDocId: any = null;
  referenceId: any = null;
  agentePouchUploadedDocumentsId: any = null;
  sequenceNo: number = null;
  documentName: string = null;
  documentDescription: string = null;
  documentSize: number = null;
  documentType: string = null;
  documentFormat: string = null;
  documentTime: Date = null;
  documentTypeDescription: string = null;
  document: any = null;
  entityType: any = null;
  entityKey: any = null;
  entityDate: any = null;
  associatedTo: any = null;
  stage: any = null;
  remarks: string = null;
  userCode: string = null;
  userName: string = null;
  completed: boolean = false;
}

@Model()
export class FileUploadDocumentModel extends BaseRequest {
  agentePouchUploadedDocumentTypeInfoId: number = null;
  select: boolean = false;
  shipmentNumber: string = null;
  documentType: string = null;
  documentTypeDescription: string = null;
  description: string = null;
  completed: boolean = false;
  documentSentTo: Array<String> = null;
  @IsArrayOf(FileUploadModel)
  fileList: Array<FileUploadModel> = new Array<FileUploadModel>();
}

export class DeleteHouseWayBillSearchModel extends BaseRequest {
  shipmentNumber: string;
  shipmentType: string;
  hawbNumber: string;
  remarks: string;
  appFeatures: any;
  shipmentId: any;
}

Model()
export class UploadDocumentModel {
  @IsArrayOf(FileUploadDocumentModel)
  public fileDocuments: Array<FileUploadDocumentModel> = new Array<FileUploadDocumentModel>();
}

@Model(HouseWayBillMasterform)
export class HouseWayBillMasterform extends BaseRequest {
  origin: string = null;
  pieces: number = null;
  weight: number = null;
  totalHWB: number = null;
  awbNumber: string = null;
  destination: string = null;
  totalPieces: number = null;
  totalWeight: number = null;
  carrierCode: string = null;
  weightUnitCode: number = null;
  appointedAgentCode: string = null;
  totalChargeableWeight: number = null;
  intDom: string = null;
  terminal: string = null;
  handledByHouse: string = null;
  houseModel: HouseModel = new HouseModel();
  chargeableWeight: number = null;
  shc: string = null;
}

@Model(SHC)
export class SHC extends BaseRequest {
  code: string = null;
  houseId: number = null;
}

@Model(GoodsDescription)
export class GoodsDescription extends BaseRequest {
  natureAndQuantityofGoods: string = null;
}

@Model(MaintainHouseDetailsList)
export class MaintainHouseDetailsList extends BaseRequest {
  origin: string = null;
  pieces: number = null;
  weight: number = null;
  check: boolean = false;
  poFlag: boolean = false;
  doFlag: boolean = false;
  hawbNumber: number = null;
  destination: string = null;
  masterAwbId: number = null;
  natureOfGoods: string = null;
  chargeableWeight: number = null;
  awbChargeableWeight: number = null;
  @IsArrayOf(SHC)
  shc: Array<SHC> = new Array<SHC>();
  houseDimension: HousewayDimentionForm = new HousewayDimentionForm();
  weightUnitCode: string = null;
  houseId: number = null;
  appointedAgentHouse: string = null;
  locationPieces: number = null;
}

//New HAWB LIST


@Model(HouseWayBillListform)
export class HouseWayBillListform extends BaseRequest {
  origin: string = null;
  pieces: number = null;
  weight: number = null;
  poFlag: boolean = false;
  doFlag: boolean = false;
  totalHWB: number = null;
  deliveredOn: date = null;
  awbNumber: string = null;
  destination: string = null;
  totalPieces: number = null;
  totalWeight: number = null;
  carrierCode: string = null;
  weightUnitCode: number = null;
  appointedAgentCode: string = null;
  totalChargeableWeight: number = null;
  public shipper: Shipper = new Shipper();
  public consignee: Consignee = new Consignee();
  @IsArrayOf(MaintainHouseDetailsList)
  maintainHouseDetailsList: Array<MaintainHouseDetailsList> = new Array<MaintainHouseDetailsList>();
  intDom: string = null;
  terminal: string = null;
  handledByHouse: string = null;
  chargeableWeight: number = null;
  sumofPieces: number = null;
  sumofWeight: number = null;
  sumofChgWeight: number = null;
  hawbCount: number = null;
}


@Model(SearchHouseWayBillListform)
export class SearchHouseWayBillListform extends BaseRequest {
  type: string = 'AWB';
  awbNumber: string = null;
  hawbNumber: string = null;
}

/*
@Model(MaintainHouseDetailsList)
export class MaintainHouseDetailsList extends BaseRequest {
  origin: string = null;
  pieces: number = null;
  weight: number = null;
  check: boolean = false;
  poFlag: boolean = false;
  doFlag: boolean = false;
  hawbNumber: number = null;
  destination: string = null;
  masterAwbId: number = null;
  natureOfGoods: string = null;
  chargeableWeight: number = null;
  @IsArrayOf(SHC)
  shc: Array<SHC> = new Array<SHC>();
  houseDimension: HousewayDimentionForm = new HousewayDimentionForm();
}
*/
@Model(CustomerInformationForm)
export class CustomerInformationForm extends BaseRequest {
  origin: string = null;
  pieces: number = null;
  weight: number = null;
  awbNumber: string = null;
  hawbNumber: string = null;
  destination: string = null;
  public shipper: Shipper = new Shipper();
  public consignee: Consignee = new Consignee();
}

export class SearchShipmentLocationHouse extends BaseRequest {
  shipmentType: string;
  shipmentNumber: string;
  shipmentId: Number;
  shipmentIdfreight: Number;
  hawb: string;
  appFeatures: any;
}

@Model(HousewayDimentionForm)
export class HousewayDimentionForm extends BaseRequest {
  houseDimensionId: number = null;
  weightUnitCode: string = 'K';
  volumeUnitCode: string = 'MC';
  totalShipment: number = null;
  pieces: number = null;
  weight: number = null;
  houseId: number = null;
  totalDimpieces: number = null;
  volumeWeight: number = null;
  volumetricWeight: number = null;
  unitCode: string = 'CMT';
  volume: number = null;
  dimensionList: Array<DimensionList> = new Array<DimensionList>();
  flagDelete: any;
  flagUpdate: any;
}

@Model(DimensionList)
export class DimensionList extends BaseRequest {
  checkBoxFlag = false;
  houseDimensionDtlsId: number = null;
  houseDimensionId: number = null;
  pieces: number = null;
  length: number = null;
  width: number = null;
  height: number = null;
  volume: number = null;
}

/*
@Model(HouseWayBillListform)
export class HouseWayBillListform extends BaseRequest {
  origin: string = null;
  pieces: number = null;
  weight: number = null;
  poFlag: boolean = false;
  doFlag: boolean = false;
  totalHWB: number = null;
  deliveredOn: date = null;
  awbNumber: string = null;
  destination: string = null;
  totalPieces: number = null;
  totalWeight: number = null;
  carrierCode: string = null;
  weightUnitCode: number = null;
  appointedAgentCode: string = null;
  intDom: string = null;
  terminal: string = null;
  handledByHouse: string = null;
  totalChargeableWeight: number = null;
  public shipper: Shipper = new Shipper();
  public consignee: Consignee = new Consignee();
  @IsArrayOf(MaintainHouseDetailsList)
  maintainHouseDetailsList: Array<MaintainHouseDetailsList> = new Array<MaintainHouseDetailsList>();
}
*/

/*
@Model(Shipper)
export class Shipper extends BaseRequest {
  id: number = null;
  name: string = null;
  code: string = null;
  houseId: number = null;
  customerId: number = null;
  contactEmail: string = null;
  customerCode: string = null;
  customerName: string = null;
  accountNumber: string = null;
  appointedAgent: string = null;
  appointedAgentId: string = null;
  isDirectCustomer: Boolean = false;
  appointedAgentCode: string = null;
  overseasCustomer: boolean = false;
  authorizedPersonnel: string = null;
  authorizationRemarks: string = null;
  public address: Address = new Address();
}*/
/*
@Model(Consignee)
export class Consignee extends BaseRequest {
  id: number = null;
  name: string = null;
  code: string = null;
  houseId: number = null;
  customerId: number = null;
  contactEmail: string = null;
  customerCode: string = null;
  customerName: string = null;
  accountNumber: string = null;
  appointedAgent: string = null;
  appointedAgentId: string = null;
  appointedAgentCode: string = null;
  overseasCustomer: boolean = false;
  authorizedPersonnel: string = null;
  authorizationRemarks: string = null;
  customRegistrationId: string = null;
  public address: Address = new Address();
  fwbContactInfo: Array<FwbContacts> = new Array<FwbContacts>();
  ivrsContactInfo: Array<FwbContacts> = new Array<FwbContacts>();

}

@Model(Address)
export class Address extends BaseRequest {
  city: string = null;
  place: string = null;
  state: string = null;
  postal: string = null;
  houseId: number = null;
  country: string = null;
  cityCode: string = null;
  stateCode: string = null;
  countryCode: string = null;
  streetAddress: string = null;
  @IsArrayOf(Contacts)
  contacts: Array<Contacts> = new Array<Contacts>();
}*/

export class Dimention extends BaseRequest {
  dg = null;
  shipmentWeight = null;
  calculatedVolume = null;
  shipmentPcs = null;
  volumetricWeight = null;
  volumetricUnitCode = null;
  dimensionDetails: Array<DimensionDetails> = new Array<DimensionDetails>();
  volumeCode = null;
  unitCode = null;
  weightCode = null;
  volume = null;
  shipmentNumber = null;
  messageid = null;
  manualScanReason = null;
  oldVolumeCode = null;
  manualScanReasonValue = null;
}
export class DimensionDetails {
  pcs = null;
  height = null;
  width = null;
  length = null;
  volume = null;
  unitCode = null;
  volumeCode = null;
}

export class BookingDimnesion {
  houseDimensionDtlsId: number = null;
  checkBoxFlag = false;
  pieces: number = null;
  weight: number = null;
  weightUnit: string = null;
  weightUnitCode: string = null;
  length: number = null;
  width: number = null;
  height: number = null;
  volume: number = null;
  shipmentUnitCode: string = null;
  flagInsert = "Y";
  createdBy = "SYSADMIN";
}

export class SearchFwbDataValidationform extends BaseRequest {
  awbNumber: string;
}

export class ShipmentLocationSearch extends BaseRequest {
  shipmentType: string;
  shipmentNumber: string;
  shipmentId: Number;
  shipmentIdfreight: Number;
  appFeatures: any;
}
export class FhlLogForm extends BaseRequest {
  awb: string;
}