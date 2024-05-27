import { AnimateTimings } from "@angular/animations";
import {
  BaseService,
  RestService,
  BaseRequest,
  BaseResponse,
  BaseResponseData,
  Model,
  IsArrayOf
} from "ngc-framework";
import { date } from "../awbManagement/awbManagement.shared";
import { Time } from "@angular/common";
export class SelectedUld {
  uldNumber: string;
  flightKey: string;
}
export class RampCheckInQuery extends BaseRequest {
  flight: string;
  flightNumber: string;
  flightDate: string;
}
export class RampCheckAddUld extends BaseRequest {
  uldlist: Array<string>;
  flightId: string;
  flight: string;
  flightDate: string;
}
export class BulkUpdate extends BaseRequest {
  flightId: string;
  bulk: string;
}
export class RampCheckInFlight extends BaseResponseData {
  flightId: string;
  flight: string;
  flightDate: string;
  origin: string;
  sta: string;
  eta: string;
  ata: string;
  uldReceived: string;
  uldManifested: string;
  bulk: string;
  carrierCode: string;
  checkInStatus: string;
  ulds: Array<RampCheckInUld>;
}
export class RampCheckInUld extends BaseRequest {
  id: string;
  flightId: string;
  flight: string;
  flightDate: string;
  origin: string;
  uldNumber: string;
  impRampCheckInId: string;
  shcs: Array<ShcUld>;
  shc: Array<string>;
  shc1: string;
  shc2: string;
  shc3: string;
  shc4: string;
  shc5: string;
  shc6: string;
  shc7: string;
  shc8: string;
  shc9: string;
  transferType: string;
  contentCode: string;
  usedAsTrolley: string;
  damaged: string;
  empty: string;
  piggyback: string;
  phc: string;
  val: string;
  manual: boolean;
  driverId: string;
  checkedinAt: string;
  checkedinBy: string;
  checkedinArea: string;
  offloadReason: string;
  remarks: string;
  statueCode: string;
  offloadedFlag: string;
  tractorNumber: string;
  handoverDateTime: string;
  carrierCode: string;
  nilCargo: string;
  temperatureType: string;
  temperatureTypeValue: Number;
  uldEvent: string;
  temperatureValue: Number;
  tempRemarks: string
  temperatureCaptureDt: string;
}

export class RampCheckInRequestClass extends BaseRequest {
  driverId: string;
  uldInfoList: any;
}

export class PiggybackUld extends BaseRequest {
  piggybackId: number;
  impRampCheckInId: string;
  uldNumber: string;
  flightId: number;
  origin: string;
  contentCode: string;
  flight: string;
  flightDate: string;
  remarks: string;
}

export class ShcUld extends BaseRequest {
  impRampCheckInId: string;
  shc: string;
}

export class FlightRequest extends BaseRequest {
  terminalPoint: string;
  fromDate: string;
  toDate: string;
  carrierGroup: Array<string>;
  carrierCode: string;
  terminalCode: string;
  flightKey: string;
  domesticFlightFlag: any;
  flightType: any;
  buBdOffice: any;
  rho: any;
  warehouseLevel: any;
  arrDepStatus: any;
}

export class FlightDiscrepancyListRequest extends BaseRequest {
  flightKey: string;
  flightOriginDate: any;
  sendEvent: any;
  flightId: any;
}
export class FlightDiscrepancyListModel extends BaseRequest {
  flightId: any;
  flightKey: any;
  flightOriginDate: any;
  flightDiscrepncyListSentBy: any;
  flightDiscrepncyListSentAt: any;
  FlightDiscrepancyList: Array<FlightDiscrepancyList>;
  sendEvent: any;
}
export class FlightDiscrepancyRequest {
  fromDate: any;
  toDate: any;
  flightNumber: any;
  carrierCode: any;
  flightType: any;
}

export class FlightDiscrepancyList {
  shipmentDate: any;
  segmentId: any;
  shipmentId: any;
  shipmentNumber: any;

  flightId: any;
  manifestPieces: any;
  manifestWeight: any;
  awbPieces: any;
  awbWeight: any;
  breakDownPieces: any;
  breakDownWeight: any;

  shcs: String;
  irregularity: String;
  irregularityTypeDescription: String;
  origin: String;
  destination: String;
  segment: String;
}

export class Flight {
  flightId: number;
  flight: string;
  flightNo: string;
  flightDate: string;
  bay: string;
  flightType: string;
  carrier: string;
  status: string;
  flightSegmentId: number;
  flightSegmentOrder: number;
  boardPoint: string;
  loadingPoint: string;
  sta: string;
  eta: string;
  ata: string;
  aircraft: string;
  registration: string;
  throughTransit: string;
  shortTransit: string;
  rampcheck: string;
  documentVerification: string;
  breakdown: string;
  ffmStatus: string;
  airportCode: string;
  legs: any;
  customsImportFlightNumber: string;
  customsImportFlightDate: Date;
}

export class IncomingFlightDateRange extends BaseRequest {
  toDate: number;
  fromDate: number;
}
export class FlightsResponse extends BaseResponseData {
  public displayOperativeResponse: Array<Flight>;
}
export class FlightDiscrepancyListResponse extends BaseResponseData {
  public displayDiscrepancyListResponse: Array<FlightDiscrepancyList>;
}
export class AgentDeliverySummary extends BaseRequest {
  team: string;
  eo: string;
  date: Date;
  deliveryList: Array<DeliveryShipmentList>;
}

export class DeliveryShipmentList extends BaseRequest {
  id: number;
  deliveryId: number;
  flight: string;
  flightDate: Date;
  awbNumber: string;
  uldNumber: string;
  pieces: string;
  weight: string;
  agent: string;
  shc: string;
  deliveryLocation: Array<string>;
  location: string;
  handOverTo: string;
  handOverDateTime: Date;
  type: any;
}

@Model(UldModel)
export class UldModel extends BaseRequest {
  impArrivalManifestBySegmentId: Number;
  impArrivalManifestUldId: Number;
  uldType: string;
  uldSerialNumber: string;
  uldOwnerCode: string;
  uldNumber: string;
  uldLoadingIndicator: string;
  uldRemarks: string;
  volumeAvailableCode: Number;
  public shipments: Array<ShipmentModel> = new Array<ShipmentModel>();
}

@Model(ShipmentModel)
export class ShipmentModel extends BaseRequest {
  select: boolean;
  impArrivalManifestShipmentInfoId: Number;
  impArrivalManifestUldId: Number;
  awbPrefix: string;
  awbSuffix: string;
  shipmentNumber: string;
  shipmentdate: string;
  origin: string;
  destination: string;
  shipmentDescriptionCode: string;
  flightId: Number;
  segmentId: Number;
  shipmentId: Number;
  piece: Number;
  weightUnitCode: string;
  photoCopy: string;
  barcodePrintedFlag: string;
  weight: Number;
  volumeunitCode: string;
  volumeAmount: Number;
  densityIndicator: string;
  densityGroupCode: Number;
  totalPieces: Number;
  natureOfGoodsDescription: string;
  movementPriorityCode: string;
  customsOriginCode: string;
  carrierCode: string;
  customsReference: string;
  carrierDestination: string;
  loggedInUser: string;
  svc: boolean;
  offloadedFlag: boolean;
  offloadReasonCode: string;
  public movementInfo: Array<ConsignmentMovementData> = new Array<
    ConsignmentMovementData
  >();
  public osi: Array<OtherServicesInformation> = new Array<
    OtherServicesInformation
  >();
  public oci: Array<OciData> = new Array<OciData>();
  public dimensions: Array<DimensionData> = new Array<DimensionData>();
  public shc: Array<ShcData> = new Array<ShcData>();
  public shcs: Array<string> = new Array<string>();
  shcCode: string;
  handledByMasterHouse: string;

}

export class DimensionData extends BaseRequest {
  id: Number;
  shipmentId: Number;
  weightUnitCode: string;
  weight: Number;
  measurementUnitCode: string;
  width: Number;
  height: Number;
  length: Number;
  noOfPieces: Number;
}

export class OciData extends BaseRequest {
  id: Number;
  shipmentId: Number;
  countryCode: string;
  informationIdentifier: string;
  csrciIdentifier: string;
  scsrcInformation: string;
}

export class ConsignmentMovementData extends BaseRequest {
  id: Number;
  shipmentId: Number;
  airportCityCode: string;
  carrierCode: string;
  flightNumber: string;
  departureDate: string;
}

export class OtherServicesInformation extends BaseRequest {
  id: Number;
  shipmentId: Number;
  remarks: string;
}

@Model(SegmentData)
export class SegmentData extends BaseRequest {
  impArrivalManifestByFlightId: Number = 0;
  impArrivalManifestBySegmentId: Number = 0;
  segmentId: Number = 0;
  flightId: Number = 0;
  boardingPoint: string = null;
  offPoint: string = null;
  nilCargo: boolean = false;
  bulkShipmentsCount: Number = 0;
  manifestUldCount: number = 0;
  totalBulkPieces: Number = 0;
  totalBulkWeight: Number = 0;
  @IsArrayOf(UldModel)
  public manifestedUlds: Array<UldModel> = new Array<UldModel>();
  @IsArrayOf(ShipmentModel)
  public bulkShipments: Array<ShipmentModel> = new Array<ShipmentModel>();
}

export class ShcData extends BaseRequest {
  id: Number;
  shipmentId: Number;
  specialHandlingCode: string;
}

export class FFMCountDetails extends BaseRequest {
  segmentReceived: any;
  segmentRejected: any;
}

@Model(ArrivalManifestFlight)
export class ArrivalManifestFlight extends BaseRequest {
  flightId: Number = 0;
  flightNumber: string = null;
  flightDate: string = null;
  aircraftRegCode: string = null;
  sta: string = null;
  eta: string = null;
  ata: string = null;
  segmentId: Number = 0;
  impArrivalManifestByFlightId: Number = 0;
  uldCount: number = 0;
  looseCargo: number = 0;
  cargoInULD: number = 0;
  pieceCount: number = 0;
  weight: number = 0;
  flightStatus: string = null;
  carrierCode: string = null;
  weightUnitCode: string = null;
  segment: string = null;
  nilCargo: boolean = false;
  rejectedShipments: any;
  handlinginSystem: boolean;
  customsClearance: string;
  leftBehindSubmission: string;
  leftBehindSubmissionSentDate: string;
  specialHandlingCode: string;
  public searchArrivalData: ArrivalData = new ArrivalData();
  shipmentNumber: string;
  uldNumber: string;
  @IsArrayOf(SegmentData)
  public segments: Array<SegmentData> = new Array<SegmentData>();
  @IsArrayOf(FFMCountDetails)
  public ffmReceivedDetails: Array<FFMCountDetails> = new Array<FFMCountDetails>();
  @IsArrayOf(FFMCountDetails)
  public ffmRejectedDetails: Array<FFMCountDetails> = new Array<FFMCountDetails>();
}

export class ArrivalManifestData extends ArrivalManifestFlight {
  impArrivalManifestByFlightId: Number;
  flightNumber: string = null;
  flightDate: string = null;
  carrierCode: string = null;
  flightNo: string = null;
  flightType: string = null;
  fligthId: Number = 0;
  public segments: Array<SegmentData> = new Array<SegmentData>();
}
export class DeliverySummary extends BaseRequest {
  terminalDelivery: string;
  level: string;
  awbNumber: string;
  doNumber: string;
  customer: string;
  dateTo: Date;
  dateFrom: Date;
  shipmentNumber: string;
  deliveryList: Array<DeliveryList>;
}
export class DeliveryList extends BaseRequest {
  doNumber: string;
  awbNumber: string;
  awbPieces: string;
  awbWeight: string;
  consignee: string;
  clearingAgent: string;
  pieces: string;
  weight: string;
  svc: boolean;
  issueDateTime: Date;
  chargesPaid: boolean;
  printed: Date;
  cancellationReason: string;
  workOrderSummary: string;
  pdRequestDetails: Date;
  outsideTerminalArea: string;
}

export class DisplayPoSummary extends BaseRequest {
  terminalDisplay: string;
  core: string;
  awbNumber: string;
  poNumber: string;
  poStatus: string;
  dateFrom: Date;
  dateTo: Date;
  agentName: string;
  displayPoList: Array<DisplayPoList>;
}
export class DisplayPoList extends BaseRequest {
  poNumber: string;
  awbNumber: string;
  source: string;
  awbPiecesWeight: string;
  consignee: string;
  clearingAgent: string;
  svc: boolean;
  poPiecesWeight: string;
  poDateTime: Date;
  truckDock: string;
  chargesPaid: boolean;
  poStatus: string;
  cancelledReason: string;
}

export class CaptureImportDocumentSearchRequest extends BaseRequest {
  flightKey: string;
  flightDate: string;
}
export class InboundMailDocument extends BaseRequest {
  flightKey: string;
  flightDate: Date;
  flightId: string;
  public mailBag: any;
  public mailsBags: any;
}

export class CaptureImportDocumentData extends BaseResponseData {
  dispatchNumber: string;
  pieces: Number;
  weight: Number;
  public origin: Array<OfficeExchange> = new Array<OfficeExchange>();
  public destination: Array<OfficeExchange> = new Array<OfficeExchange>();
  category: string;
  subType: string;
  registeredIndicator: Boolean;
  remark: string;
}

export class OfficeExchange extends BaseRequest {
  country: string;
  location: string;
  category: string;
}

export class ImportDocumentRequest extends BaseRequest {
  dispatchNumber: string;
  pieces: Number;
  weight: Number;
  originCountry: string;
  originLocation: string;
  OriginCategory: string;
  destinationCountry: string;
  destinationLocation: string;
  destinationCategory: string;
  Category: string;
  subType: string;
  registeredMail: string;
  remark: string;
}

// export class ShipmentDeliveryRequestModel extends BaseRequest
// {

//  shipmentId:Number;
//  shipmentType:string;
// shipmentNumber:string;
//  shipmentDate:Date;
//  origin:string;
// destination:string;
//  chargeCode:string;
//  svc:string;
//  natureOfGoods:string;
//  shc:string;
//  consigneeCode:string;
//  consigneeName:string;
//  appointedAgent:string;
// notifyParty:string;
//  pieces:any;
//  weight:any;
//   id:any;
//  deliveredPieces:any;
//  deliveredWeight:any;
//  deliveryRequestedPieces:any;
//  paid :boolean;
//  bankEndorsementCollected:boolean
//  blackListed:any;
//  receivingPartyIdentificationNumber:string;
//  receivingPartyName:string;
//   receivingPartyCompanyName:string;
//  authroizedPerson:string;
//  authorizedSignature:string;
//  localAuthority: ShipmentDeliveryRequestLocalAuthorityModel;
//  inventory:Array<ShipmentDeliveryRequestInventoryModel>;

// }
// export class  ShipmentDeliveryRequestLocalAuthorityModel extends BaseRequest
// {
//  id:any;
//  deliveryRequestId:any;
//  type:string;
//   localAuthroityId:any;
//  referenceNumber:string;
//  appointedAgent:string;
//  license:string;
//  remarks:string;
// }
// export class ShipmentDeliveryRequestInventoryModel extends BaseRequest
// {
// 	 shipmentId:number
// 	 shipmentInventoryId:any
// 	 shipmentLocation:string
// 	warehouseLocation:string;
// 	 pieces:any;
// 	weight:any;
//     flight:string;
//    LocalDate:Date
//     onHold:boolean
//  reasonForHold:string;
//  heldBy:string;
//  id:any;
//   deliveryRequestId:any;
//  deliver:boolean;
//  exitOutputLocation:string;
//  truckDock:string;
//  outsideTerminalDeliveryArea:string;
// }
export class AwbRoutingReqModel extends BaseRequest {
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
export class RequestImportMailManifest extends BaseRequest {
  flightKey: string;
  flightDate: Date;
  flightId: string;
  destination: string;
  breakDownUld: string;
  shipments: any;
  segmentId: any;
  inboundShipments: any;
  checkData: boolean;
  segments: any;
  mailFirstTimeBreakDownCompletedBy: boolean;
  mailFirstTimeDocumentVerificationCompletedBy: boolean;
  mailBagInfo: any;
  nextDestination: string;
  shipmentLocation: string;
  flightNumber: string;

}

export class ResponseMailManifest extends BaseResponseData {
  flightId: string;
  destination: string;
  breakDownUld: string;
  shipments: any;
}

export class RequestUpdateLocationMail extends BaseRequest {
  impBreakdownStorageInfoId: number;
  storageLocation: string;
  breakDownLocation: string;
  pieces: number;
  bup: boolean;
  damaged: boolean;
  weight: number;
  uldTrollyNo: string;
}

export class MailBreakdownData extends BaseRequest {
  flightId: string;
  shipmentNumber: string;
  uldNumber: string;
}

export class BreakdownHandlingDataSaveRequest extends BaseRequest {
  shipments: Array<BreakDownHandlingInstructionShipmentModel>;
}

export class BreakDownHandlingInstructionShipmentModel extends BaseRequest {
  breakdownId: String;
  shipmentNumber: string;
  origin: string;
  destination: string;
  totalPieces: string;
  weight: string;
  shcCode: string;
  instruction: string;
  flightId: string;
  shcs: Array<SHCModel>;
  specialHandlingCode: string;
  flightKey: string;
  flightDate: Date;
  house: Array<HouseModel>;
}

export class HouseModel extends BaseRequest {
  houseNumber: string;
  breakdownInstruction: string;
}


export class SHCModel extends BaseRequest {
  specialHandlingCode: string;
  bhShipmentNumber: string;
  shipmentNumber: string;
}

export class BreakDownHandlingRequest extends BaseRequest {
  flightKey: string;
  flightOriginDate: Date;
}

export class MailBreakdownSearchResult extends BaseResponseData {
  flightKey: string;
  flightDate: Date;
  flightId: number;
  uldNumber: string;
  shipmentLocation: string;
  warehouseLocation: string;
  shipments: any;
  staDate: Date;
  carrierCode: string;
}

export class MailBreakdownSearchRequest extends BaseRequest {
  flightKey: string;
  flightDate: Date;
  flightId: number;
  uldNumber: string;
  shipmentLocation: string;
  warehouseLocation: string;
  mailBagShipments: any;
  shipments: any;
  carrierCode: string;
  boardingPoint: string;
  offPoint: string;
  validateContainerDest: boolean;
}

export class MailBreakdown extends BaseResponseData {
  uld: string;
  shipmentId: string;
  pieces: Number;
  weight: Number;
  originOfficeExchange: string;
  destinationOfficeExchange: string;
  mailCategory: string;
  mailSubType: string;
  dispatchYear: Number;
  registered: Boolean;
  remarks: string;
  embargo: string;
  mailBagNumber: string;
  type: string;
}
export class DisplayCpmSerach extends BaseRequest {
  flight: string;
  flightId: Number;
  flightDate: any;
}
export class DisplayCpmModel extends BaseRequest {
  flight: string;
  flightId: number;
  flightDate: any;
  sta: any;
  eta: any;
  ata: any;
  acRegistration: string;
  listDisplayCpmDetails: Array<DisplayCpmDetailsModel>;
}
export class DisplayCpmDetailsModel extends BaseRequest {
  uldNumber: string;
  destination: string;
  weight: any;
  contentCode: string;
  remarks: string;
  loadPosition: string;
  shc: string;
  siRemarks: string;
}

export class BreakDownTracingFlightModel extends BaseResponseData {
  uldNumber: string;
  shipmentNumber: string;
  flightId: Number;
  flightDate: string;
  flightNumber: string;
  flightSegmentId: Number;
}

export class DisplayffmFlight extends BaseRequest {
  flightId: Number;
  flightNumber: string;
  flightDate: string;
  segmentId: Number = 0;
  segmentCopy: Number = 0;
  aircraftRegCode: string;
  typeOfFFM: string;
  sta: string;
  eta: string;
  ata: string;
}

export class DisplayffmFlightData extends DisplayffmFlight {
  impFreightFlightManifestByFlightId: Number;
  public segments: Array<SegmentData> = new Array<SegmentData>();
}

export class AirlineFlightManifest extends BaseRequest {
  flightId: Number;
  flightInfo: Flight;
  public destinationHeader: Array<DestinationHeaderInformation> = new Array<DestinationHeaderInformation>();
}

export class DestinationHeaderInformation extends BaseRequest {
  id: Number;
  referenceId: Number;
  airportCode: string;
  flightId: Number;
  flightSegmentId: Number;
  flightKey: string;
  flightDate: string;
  destinationHeader: DestinationHeader;
}

export class DestinationHeader extends BaseRequest {
  airportCodeOfUnloading: string;
  airportCodeOfLoading: string;
}

export class ShipmentDeliveryEquipmentReleaseModel extends BaseResponseData {
  id: Number;
  deliveryId: Number;
  equipmentNumber: string;
  requestDateTime: any;
  typeOfCollect: string;
}

export class DiscrepancySearchRequest extends BaseRequest {
  flightNumber: string;
  flightDate: string;
  //flightId: number;
  segmentId: number;
  // boardingPoint: string;
}

export class DiscrepancySearchResponse extends BaseResponseData {
  manifestedPages: number;
  segmentArray: any;
  actionTaken: string;
  nature: string;
  flightNumber: string;
  flightDate: string;
  natureOfDiscrepancies: string;
  documentCompletedBy: string;
  breakDownCompletedBy: string;
  rampCheckedInBy: string;
  breakDownCompletedAt: Date;

  documentCompletedAt: Date;
  rampCheckedInDate: Date;
  shipmentNumber: string;
  partShipment: boolean;
  photoCopy: boolean;
  origin: string;
  destination: string;
  piece: number;
  weight: number;
  weightUnitCode: string;
  natureOfGoodsDescription: string;
  irregularityType: string;
  irregularityPieces: number;
  irregularityDescription: string;
  remarks: string;
}
export class DiscrepancyResponse extends BaseResponseData {
  manifestedPages: number;
  actionTaken: string;
  flightNumber: string;
  flightDate: Date;
  flightId: number;
  segmentId: number;
  manual: boolean;
  checkstatus: boolean;
  natureOfDiscrepancies: string;
  nature: string;
  documentCompletedBy: string;
  breakDownCompletedBy: string;
  rampCheckedInBy: string;
  breakDownCompletedAt: Date;
  documentCompletedAt: Date;
  rampCheckedInDate: Date;
  shipmentNumber: string;
  partShipment: boolean;
  origin: string;
  destination: string;
  piece: number;
  weight: number;
  weightUnitCode: string;
  natureOfGoodsDescription: string;
  irregularityType: string;
  irregularityPieces: number;
  irregularityDescription: string;
  remarks: string;
  shipmentDiscrepancy: any;
  physicalDiscrepancy: any;
  otherDiscrepancy: any;
  discrepancyType: any;
  emails: any;
  emailAddress: any;
  damagestatus: string;

}

export class inboundFlightMonitoringSerach extends BaseRequest {
  terminals: Number;
  fromDate: Date;

  fromTo: Date;

  carrierGroup: string;
  acType: string;
  carrier: string;
  flight: string;
  date: any;
}

export class inboundFlightMonitoringModel extends BaseResponseData {
  flight: string;
  date: any;
  lastBoardPoint: string;
  sta: any;
  eta: any;
  ata: any;
  acType: string;
  acRegistration: string;
  tth: any;
  rampStartDateTime: any;
  rampCompleteDateTime: any;
  documentStartDateTime: any;
  documentCompleteDateTime: any;
  breakdownStartDateTime: any;
  breakdownCompleteDateTime: any;
  flightCompleteDateTime: any;
  flightCloseDateTime: any;
}
@Model(BreakDownSummaryTonnageHandledModel)
export class BreakDownSummaryTonnageHandledModel extends BaseRequest {
  cargoType: string = null;
  tonnage: number = 0;
  remark: string = null;
  summaryId: number = 0;
  rowNumber: number = 0;
  addTonnage: string = "";
  addEmail: string = "";
}
@Model(BreakDownSummaryUldModel)
export class BreakDownSummaryUldModel extends BaseRequest {
  contentCode: string = null;
  handlingMode: string = null;
  manifestedWeight: number = 0;
  actualWeight: number = 0;
  differece: number = 0;
  breakdownStaff: string = null;
  sats: boolean = false;
  breakdownStartDataTime: string = null;
  breakdownEndDataTime: string = null;
  summaryId: number = 0;
  rowNumber: number = 0;
  serviceContrator: string = null;
  serviceContractorName: string = null;
  shipmentNumber: string = null;
  natureOfGoods: string = null;
  damagedFlag: string = null;
  warehouseDestination = null;
  actualLocation = null;
  breakdownPcsWt = null;
  shipments: Array<BreakDownSummaryUldModel> = [];
}


export class Email extends BaseRequest {
  toAddress: string;
  flightkey: string;
  flightDate: string;
}

@Model(BreakDownSummary)
export class BreakDownSummary extends BaseRequest {
  flightId: number = 0;
  impBreakDownSummaryId: number = 0;
  feedbackForStaff: number = 0;
  breakDownStaffGroup: string = null;
  reasonForWaive: string = null;
  reasonForDelay: string = null;
  liquIdatedDamagesWaived: Boolean = false;
  liquIdatedDamageApplicable: Boolean = false;
  approvedLDWaive: Boolean = false;
  approvedLDWaiveApprovedBy: string = null;
  approvedLDApplicable: Boolean = false;
  delayInMinutes: string = null;
  approvedLDApplicableApprovedBy: string = null;
  approvedLDApplicableApprovedOn: string = null;
  flightNumber: string = null;
  flightDate: Date;
  emailGroup: string = null;
  @IsArrayOf(BreakDownSummaryTonnageHandledModel)
  public tonnageHandlingInfo: Array<BreakDownSummaryTonnageHandledModel> = [];
  @IsArrayOf(BreakDownSummaryUldModel)
  public uldInfo: Array<BreakDownSummaryUldModel> = [];

  public emails: Array<Email> = new Array<Email>();

}

@Model(BreakDownSummaryModel)
export class BreakDownSummaryModel extends BaseRequest {
  id: string = null;
  delayInMinutes: string = null;
  dutyManager: string = null;
  checker: string = null;
  breakDownStaffGroup: string = null;
  tonnageBreakDownBySp: number = 0;
  tonnageBreakDownBySats: number = 0;
  flight: string = null;
  flightDate: string = null;
  uldNumber: string = null;
  sta: string = null;
  eta: string = null;
  ata: string = null;
  flightNumber: string = null;
  firstUldTowInTime: number = 0;
  lastUldTowInTime: number = 0;
  breakdownCompletionDataTime: number = 0;
  flightCompletionDataTime: number = 0;
  ldApplicable: boolean = false;
  ldWaive: boolean = false;
  liquIdatedDamagesWaived: boolean;
  liquIdatedDamageApplicable: boolean;
  reasonForWaive: string;
  reasonForDelay: string;
  approvedBy: string = null;
  checkBoxValue: boolean = false;
  flightId: number = 0;
  flightClosedFlag: boolean;
  flightClosedAt: string;
  fightClosedBy: string;
  flightNo: string = null;
  tonnageULDWeight: number = 0;
  tonnageBulkWeight: number = 0;
  public tonnageInfo: BreakDownSummaryTonnageHandledModel = new BreakDownSummaryTonnageHandledModel();
  @IsArrayOf(BreakDownSummaryUldModel)
  public uldInfo: Array<BreakDownSummaryUldModel> = [];
  @IsArrayOf(BreakDownSummaryTonnageHandledModel)
  public tonnageHandlingInfo: Array<BreakDownSummaryTonnageHandledModel> = [];
}

@Model(DelayStatusSearch)
export class DelayStatusSearch extends BaseRequest {
  public flightId: number = 0;
  public terminals: number = 0;
  public fromDate: Date = null;
  public toDate: Date = null;
  public carrierGroup: string = null;
  public flight: string = null;
  public date: Date = null;
  public flightClosed: string = null;
  public flightNumber: string = null;
  public flightDate: string = null;
}
export class SearchTransferManifest extends BaseResponseData {
  incomingCarrier: string;
  transferCarrier: string;
  destination: string;
  dispatchNumber: string;
}
export class TransferManifestDetails extends BaseResponseData {
  select: boolean;
  incomingCarrier: string;
  transferCarrier: string;
  destination: string;
  mailBagNumber: string;
  dispatchNumber: any;
  receptacleNumber: any;
  origin: any;
  pieces: any;
  weight: any;
  registeredIndicator: any;
  damaged: any;
  flightId: any;
  flightKey: any;
  flightDate: any;
}

@Model(DelayStatusData)
export class DelayStatusData extends BaseResponseData {
  @IsArrayOf(BreakDownSummaryModel)
  public delayStatusArray: Array<BreakDownSummaryModel> = [];
}

export class DamageSearchModel extends BaseRequest {
  flight: string;
  flightDate: any;
  flightId: number;
  id: number;
}

export class DamageReportModel extends BaseRequest {
  flight: string;
  flightDate: any;
  flightId: number;
  id: number;
  weatherCondition: string;
  preparedBy: string;
  listDamageReportAWBDetails: any;
  listDamageReportULDDetails: any;
  listDamageReportMailDetails: any;
}
export class MaintainServiceDeleteRequest extends BaseRequest {
  request: string;
}

export class InboundRampCheckIn extends BaseRequest {

}

export class RampCheckInModel extends BaseRequest {
  uldReceived: any;
  uldManifested: any;
  trollyReceived: any;
  uldList: Array<RampCheckInUld>;
}

export class ArrivalData extends BaseRequest {
  flight: string = null;
  date: string = null;
  typeReport: string = null;
}

export class RoutingRequestModel extends BaseRequest {
  shipmentNumber: string;
  carrier: string;
  flightNumber: string;
  shipmentOrigin: string;
  shipmentDestination: string;
  incomingFlightId: Number;
  flightBoardPoint: string;
  flightOffPoint: string;
  flightType: string;
  shipmentdate: string;
  flightDate: string;
}
export class SearchDGDeclations extends BaseRequest {
  shipmentNumber: string = null;
  dgdReferenceNo: any = null;
}

export class ShipperDeclaration extends BaseRequest {



  expDgShipperDeclarationId: any;
  dgdReferenceNo: any;
  shipmentNumber: any;
  transhipmentFlag: any;
  shipperCustomerId: any;



  departureAirport: any;
  destinationAirport: any;
  aircraftType: any;
  shipmentRadioactiveFlag: any;
  additionalHandlingInformation: any;
  shipmentID: any;
  origin: any;
  destination: any;
  declarationDetails: Array<ShipperDeclarationDetail>;
}
export class ShipperDeclarationDetail extends BaseRequest {
  expDgShipperDeclarationIdany: any;
  dgdReferenceNo: any;
  dgRegulationId: any;
  dgSubriskCode1: any;
  dgSubriskCode2: any;
  packingGroupCode: any;
  packagePieces: any;
  packageQuantity: any;
  packingType: any;
  packingInstructions: any;
  packingInstructionCategory: any;
  transportIndex: any;
  packingDimension1: any;
  packingDimension2: any;
  packingDimension3: any;
  apioNumber: any;
  overPackNumber: any;
  authorizationDetail: any;
  properShippingName: any;
  UNIDnumber: any;
  DGClassCode: any;
  overPackDetails: Array<UNIDOverpackDetails>
}


export class UNIDOverpackDetails extends BaseRequest {
  expDgShipperDeclarationId: any;
  dgdReferenceNo: any;
  dgRegulationId: any;
  autoManualFlag: any;
  overpackNumber: any;
}

export class VctInformationListRequest extends BaseRequest {
  vctNumber: string;
  vctDate: any
}
export class VctInformationlist {

  vtNumber: any;
  vtDate: any;
  vehicleRegistrationNumber: any;
  driverName: any;
  driverMobileNumber: any;
  driverLicenseNumber: any;
  driverAadharCard: any;
  vtNumberOfPieces: any;
  vtGrossWeight: any;
  agentCode: any;
  shc: any;
  dockInDateTime: any;
  vctInDoorNumber: any
  vctInRemarks: any;
  dockOutDateTime: any;
  vctOutDoorNumber: any;
  vctOutRemarks: any;
  vctShipmentInformationlist: Array<VCTShipmentInformationlist>;
}

export class VCTShipmentInformationlist {

  panentInformation: any;
  mawbNumber: any;
  hawbNumber: any;
  tspNumber: any;
  tspDate: any;
  boeNumber: any;
  boeValue: any;
  awbTotalPieces: any;
  awbTotalGrossWeight: any;
  remarks: any;

}

export class FlightPouchModelHandle {
  flightId: Number;
  confirmPickup: string;
  cancelPickup: string;
  confirmDelivery: string;
  cancelDelivery: string;
  confirmReceived: string;
  cancelReceived: string;
  flightNo: string;
  flightDate: string;
  functionType: string;
  staffId: string;
  remarks: string;
  dateTime: string;
  dateAta: string;
  paxfrt: string;
  fromDate: string;
  toDate: string;
  carrierGroup: string;
  carrierCode: string;
  date: string;
  pouchStatus: string;
}
export class DocumentHandOverModel {
  flightId: Number;
  flightType: string;
  returnRemarks: string;
  docinOutRemarks: string;
  flightNumber: string;
  flightDate: string;

}
export class maintainScheduleCollectionSearch extends BaseRequest {
  customerName: string;
  customerNo: number;
  iataCode: string;

}


export class maintainScheduleCollectionSave extends BaseRequest {
  customerName: string;
  customerNo: number;
  iataCode: number;
  truckDockNo: String;
  timeFrom: String;
  timeTo: String;
  toTime: String;
  fromTime: String;
  isMon: boolean;
  isTue: boolean;
  isWed: boolean;
  isThu: boolean;
  isFri: boolean;
  isSat: boolean;
  isSun: boolean;
  remarks: String

}

export class IssueSRFCustomerInfo {
  prevIATACode: number;
  truckDockNo: String;
  prevBank: String;
  prevCollectedBy: String;
  prevHkid: String;
  previousAppointedAgent: String;
  prevTruckCompany: number;
  prevTruckNumber: number;
  prevSRFRemarks: number;

}


export class IssueSRF extends BaseRequest {
  shipmentNumber: string;

}

export class captureTimeStampSearch extends BaseRequest {
  truckNo: string;
  purpose: string;
  srfNumber: Array<string>;
  captureType: string;
}

