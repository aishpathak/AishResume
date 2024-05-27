import {
  BaseRequest,
  BaseResponseData,
  BaseBO,
  Model,
  IsArrayOf,
  Pattern
} from "ngc-framework";
import { isObject } from "util";
export class EmbargoRecordRequest extends BaseRequest {
  id: number;
  country: string;
  flightSector: string;
  shcGroup: string;
  schCode: string;
  customsOrigin: string;
  startDate: Date;
  endDate: Date;
  aircraftType: string;
  paxOrFrt: string;
  reason: string;
  isSelected: boolean;
}
export class Embargo extends BaseRequest {
  carrierCode: string;
}

// LYING LIST STARTS HERE
export class OutboundLyingListRequest extends BaseRequest {
  awbNumber: string;
  carrierCode: string;
  shipmentNumber: string;
  carrier: string;
  destination: string;
  booking: string;
  shipment: string;
  bookingStatus: string;
  shipmentState: string;
  shipmentType: string;
  dwellType: string;
  dwellTime: number;
  shcPriority: boolean;
}
export class OutboundLyingListResponse extends BaseRequest {
  segment: string;
  awbNumber: string;
  readyToLoad: string;
  partShipment: string;
  pieces: string;
  weight: string;
  orgDes: string;
  nog: string;
  offloaded: string;
  cancelled: string;
  location: string;
  shc: string;
  agentCode: string;
  shipperName: string;
  dwellTime: string;
}

export class GetAwbDetails extends BaseRequest {
  bookingID: String;
  flightBookingID: String;
}
// LYING LIST ENDS HERE

// BOOK MULTIPLE SHIPMENT STARTS
export class BookMultipleShipmentsFlight extends BaseRequest {
  flightID: number;
  flightKey: String;
  flagInsert: string;
  flagUpdate: string;
  totalPieces: number;
  shipmentList: any;
  flightDate: Date;
  isLyingListShipment: boolean;
  ruleEngineWarningAndInfoMessage: string;
  skipRuleEngineFlag: boolean;
}

export class BookMultipleShipmentSearch extends BaseRequest {
  flightKey: String;
  flightDate: String;
  flightOffPoint: String;
}

export enum BookingRemarks {
  W_LIST_RMK = "W_LIST_RMK",
  MAN_RMK = "MAN_RMK",
  ADD_RMK = "ADD_RMK"
}

export class BookingDimnesion {
  checkBoxFlag = false;
  pieces: number = 0;
  weight: number = 0;
  weightUnit: string = null;
  weightUnitCode: string = null;
  length: number = 0;
  width: number = 0;
  height: number = 0;
  volume: number = 0.00;
  shipmentUnitCode: string = "CMT";
  flagInsert = "Y";
  createdBy = "SYSADMIN";
}

export class BookingFlightEdit extends BaseRequest {
  workingListRemarks: any;
  manifestRemarks: any;
  additionalRemarks: any;
  dimensionList: any;
  awbDimensionList: any;
  flightBookingID: any;
  bookingID: any;
  flightID: any;
  flightBoardPoint: any;
  flightOffPoint: any;
  bookingPieces: any;
  bookingWeight: any;
  bookingStatusCode: any;
  throughTransitFlag: any;
  flagDelete: any;
  flagUpdate: any;
  shcList: any;
  densityGroupCode: any;
  volumeUnitCode: any;
  volume: any;
  volumeWeight: any;
  volumetricWeight: any;
  shipmentNumber: any;
  shipmentDate: Date;
}

export class BookCancelShipment extends BaseRequest {
  flightKey: string;
  flightID: string;
  flightDate: string;
  flightSegmentId: any;
  flightBoardPoint: any;
  flightOffPoint: any;
  newFlightDate: any;
  newFlightKey: any;
  cancelRebookFlag: any;
  flightShipmentList: Array<any>;
  ruleEngineWarningAndInfoMessage: string;
  skipRuleEngineFlag: boolean;
  skipHandoverFlag: boolean;
}

export class SearchFLightShipment extends BaseRequest {
  bookingID: number;
  flightBookingID: number;
  shipmentNumber: string;
  shipmentDate: Date;
}

// BOOK MULTIPLE SHIPMENTS ENDS

// WORKING LIST STARTS

export class ExportFlight {
  flightNo: string;
  flightDate: Date;
  flightId: number;
  std: Date;
  etd: Date;
  aircraftType: string;
  aircraftRegistration: string;
}
export class BookingDelta extends BaseRequest {
  bookingDeltaId: number;
  bookingVersion: number;
  flightId: number;
  flightBoardPoint: string;
  flightOffPoint: string;
  shipmentNumber: string;
  bookingPieces: number;
  bookingWeight: number;
  throughTransitFlag: number;
  statusCode: string;
  bookingChanges: string;
  shc: string;
  shc1: string;
  shc2: string;
  shc3: string;
  shc4: string;
  shc5: string;
  shc6: string;
  shc7: string;
  shc8: string;
  shc9: string;
  workingListRemarks: string;
  manifestRemarks: string;
  additionalRemarks: string;
  createdUserCode: string;
  createdDateTime: Date;
  lastUpdatedUserCode: string;
  lastUpdatedDateTime: Date;
}

export class WorkingListBooking extends BookingDelta {
  snapshotId: number;
  // snapshotShipmentId: number;
  awbOrigin: string;
  awbDestination: string;
  bookingPiecesOld: number;
  bookingWeightOld: number;
  natureOfGoodsDescription: string;
  // inboundFlight: ExportFlight;
}

export class FlightSegment extends BaseRequest {
  flightId: number;
  snapshotId: number;
  segmentId: number;
  snapShotVersion: number;
  flightBoardingPoint: string;
  flightOffPoint: string;
  bookingChanges: Array<WorkingListBooking>;
  shipmentList: Array<ShipmentWorklist>;
}

export class WorkingList extends BaseRequest {
  flight: ExportFlight;
  mode: string;
  segments: Array<FlightSegment>;
}
export class ShipmentWorklist extends BaseRequest { }

export class MailInformationModel extends BaseRequest {

  flightId: number;
  flighSegmentId: number;
  mailType: String;
  piece: number;
  weight: number;
  workingListOtherShipmentInfoId: number;
}



// WORKING LIST ENDS

// BOOK SINGLESHIPMENT STARTS

// export class ShipmentBookingDimension {
//   flightBookingId: number;
//   partBookingId: number;
//   txSequenceNumber: number;
//   pieces: number;
//   weight: number;
//   weightUnitCode: string;
//   length: number;
//   width: number;
//   height: number;
//   shipmentUnitCode: string;
//   checkBoxFlag: boolean;
// }
export class SearchSingleBookingShipment extends BaseRequest {
  shipmentNumber: string;
  blockSpace: number;
  suffix: string;
  originalSuffix: string;
  shipmentDate: any;
  flightKeyList: any;
  shipmentType: any;
}

export class ShipmentPartSuffix extends BaseRequest {
  carrierCode: string;
  crossBookingFlag: string;
  crossBookCarrier: string;
  startPrefix: string;
  endPrefix: string;
  primaryIdentifier: string;
  excludePrefix: string;
  createdUserCode: string;
  createdDateTime: Date;
  lastUpdatedUserCode: string;
  lastUpdatedDateTime: Date;
}

export class SingleShipmentFlightBooking {
  flightBookingId: number;
  bookingId: number;
  flightId: number;
  flightBoardPoint: string;
  flightOffPoint: string;
  departureTime: number;
  arrivalTime: number;
  bookingPieces: number;
  bookingWeight: number;
  bookingStatusCode: string;
  bookingCancellationFlag: number;
  bookingCancellationDate: Date;
  bookingCancellationUserCode: string;
  bookingCancellationReasonCode: string;
  workingListRemarks: string;
  manifestRemarks: string;
  additionalRemarks: string;
  shc1: string;
  shc2: string;
  shc3: string;
  shc4: string;
  shc5: string;
  shc6: string;
  shc7: string;
  shc8: string;
  shc9: string;
  throughTransitFlag: number;
  // shipmentBookingDimensionList: ShipmentBookingDimension[];
}

export class ShipmentPartBookingDimension {
  partBookingId: number;
  flightBookingId: number;
  txSequenceNumber: number;
  pieces: number;
  weight: number;
  weightUnit: string;
  length: number;
  width: number;
  height: number;
  shipmentUnitCode: string;
  checkBoxFlag: boolean;
}

export class SingleShipmentFlightPartBooking {
  partBookingId: number;
  bookingId: number;
  partSuffix: string;
  partPieces: number;
  partWeight: number;
  workingListRemarks: string;
  manifestRemarks: string;
  additionalRemarks: string;
  shc1: string;
  shc2: string;
  shc3: string;
  shc4: string;
  shc5: string;
  shc6: string;
  shc7: string;
  shc8: string;
  shc9: string;
  partIdentifier: string;
  singleShipmentFlightBookingList: SingleShipmentFlightBooking[];
  shipmentPartBookingDimensionList: ShipmentPartBookingDimension[];
}

export class SingleShipmentBooking extends BaseRequest {
  bookingId: number;
  shipmentNumber: string;
  origin: string;
  destination: string;
  pieces: number;
  grossWeight: number;
  weightUnitCode: string;
  densityGroupCode: number;
  volumeWeight: number;
  volumeUnitCode: string;
  natureOfGoods: string;
  serviceFlag: number;
  blockSpace: number;
  manual: number;
  shipperCustomerId: number;
  flagCreatePart: string;
  flagMergePart: string;
  flagDeletePart: string;
  flagUpdatePart: string;
  flagUpdate: string;
  flagCreate: string;
  partSuffix: string;
  partBookingList: SingleShipmentFlightPartBooking[];
  shipmentBookingDimensionList: any;
}

// BOOK SINGLESHIPMENT ENDS

// Acceptance Handling Definition Start Here //
export class HandlingDefAccpt extends BaseRequest {
  handlingDefinitionAccptId: string;
  acceptancetype: string;
  acceptanceDescription: string;
  handlingDefinition: HandlingDefinition[];
}
export class HandlingDefinition extends BaseRequest {
  handlingDefinitionId: string;
  handlingDefinitionAccptId: string;
  requiredprelodging: string;
  requiredAWBnumberformatcheck: string;
  partialacceptanceallowed: string;
  servicenumbersuffix: string;
  chargesapplicable: string;
  requiredcustomscheck: string;
  requiredlocalauthorityinfo: string;
  requireddocumentlistforprelodging: string;
  cutoftimeforprelodgemins: string;
  sendfsurcs: string;
  sendfsurct: string;
  handlingDefinitionByAirline: HandlingDefinitionByAirline[];
  handlingDefinitionBySHC: HandlingDefinitionBySHC[];
}
export class HandlingDefinitionByAirline {
  handlingDefinitionAirlineId: string;
  carrierCode: string;
  handlingDefinitionId: string;
}
export class HandlingDefinitionBySHC {
  handlingDefinitionBySHCId: string;
  handlingDefinitionId: string;
  shcGroup: string;
}

// Acceptance Handling Definition Ends Here //

export class AwbDetails extends BaseRequest {
  shipmentNumber: string;
  origin: string;
  destination: string;
  pieces: number;
  weight: number;
  natureOfGoods: string;
  shc1: string;
  shc2: string;
  shc3: string;
  shc4: string;
  shc5: string;
  shc6: string;
  shc7: string;
  shc8: string;
  shc9: string;
  bookedFlight: string;
  flightDate: any;
}

export class InventoryDetails extends BaseRequest {
  shipmentLocation: string;
  pieces: number;
  weight: number;
  location: string;
}

export class ShipmentDetails extends BaseRequest {
  awbData: AwbDetails;
  inventory: Array<InventoryDetails>;
}

export class AutoWeigh {
  uldNumber: string;
  shipmentNumber: string;
}

export class UldWeighRecord {
  acceptanceBy: string;
  uldNumber: string;
  shipmentNumber: string;
  prelodgeServiceId: string;
  shipmentNumberList: string;
  carrier: string;
  flightId: number;
  flightSegmentId: number;
  flight: string;
  flightBoardPoint: string;
  flightOffPoint: string;
  segment: string;
  contourCode: string;
  uldTagPrinted: string;
  weighingScaleId: number;
  pdTrolleyNumber: string;
  pdTrolleyWeight: number;
  grossWeight: number;
  xpsShipment: boolean;
  dgShipment: boolean;
  cargo: boolean;
  mail: boolean;
  courier: boolean;
  tagRemarks: string;
  uldTagPrintedOn: any;
  dryIceWeight: number;
  weightCapturedManually: string;
  dgDetails: any;
  equipmentReturn: any;
  reprint: any;
  grossWeightLess: any;
  grossWeightMore: any;
  ackWarn: any;
  foreignUldCheck: any;
  ackForeignUld: boolean;
}

export class EquipmentReturnRowData {
  equipmentNumber: string = "";
  agent: string = "";
  eqpReturn: Array<EquipmentReturnRowData> = null;
  equipType: string;
  // returned = false;
}

export class DgRowData {
  classCode: String = "";
  specialHandlingCode: String = "";
  flagInsert: String = "Y";
}
export class Flight extends BaseRequest {
  flightOriginDate: any;
  aircraftRegistration: string;
  std: string;
  etd: string;
  status: string;
  flightKey: string;
  flightId: any;
  skipCpeCheck: any;
}

//model class for unload shipment
export class UnloadShipmentSearch extends BaseRequest {
  flight: Flight;

  uldNumber: string;
  shipmentNumber: any;
  shipmentNumbers: Array<string> = new Array<string>();
  reason: any;
  shipmentNumberList: Array<Shipment> = new Array<Shipment>();
}
export class SendAdvice extends BaseRequest {


  transTTWAFlightId: any;
  flightId: any;
  inboundFlightId: any;
  inboundFlightSegmentId: any;
  flightSegmentId: any;
  flightKey: any;
  standardEstimatedDateTime: any;
  std: any;
  etd: any;
  sta: any;
  eta: any;
  date: any;
  transferType: any;
  airport: any;
  flightList: any;
  shipmentList: any;
  transferTypeShipments: any;
  outbound: boolean;


}
export class ShipmentInventory extends BaseRequest {
  flagCRUD: any;
  shipmentId: any;
  shipmentNumber: any;
  tagNumber: any;
  shipmentInventoryId: any;
  comTracingShipmentLocationInfoId: any;
  shipmentInventoryHouseId: any;
  pieces: number;
  weight: number;
  shipmentLocation: string;
  warehouseLocation: string;
  housePieces: number;
  houseWeight: number;
  sspdPieces: number;
  sspdWeight: number;
  house: HouseInformationModel;
  tags: Array<HouseInformationModel>;
  origin: string;
  destination: string;
  shcList: any;
  houseList: any;
  partSuffix: String;
  partPiece: Number;
  partWeight: Number;
  partPieces;
}
// export class SHC extends BaseRequest {
//   code: any;
// }

export class UnloadShipmentInventory extends ShipmentInventory {
  shcCodes: Array<string> = new Array<string>();
}

export class Shipment {
  shipmentNumber: any;
  loadedPieces: any;
  loadedWeight: any;
  unloadPieces: any;
  unloadWeight: any;
  schs: any;
  natureOfGoods: any;
  shipmentId: any;
  shipmentType: string;
  partWeight: any;
  partPiece: any;
}
export class UnloadShipmentRequest extends BaseRequest {
  isTTCase: boolean = false;
  unloadShipments: Array<UnloadShipment> = new Array<UnloadShipment>();
  reason: any;
}
export class UnloadShipment extends Shipment {
  flight: Flight;
  segment: Segment;
  uldNumber: any;
  assUldTrolleyId: any;
  loadedShipmentInfoId: any;
  assUldTrolleyNumber: any;
  reason: any;
  shpmtInventoryList: Array<ShipmentInventory> = new Array<ShipmentInventory>();
  houseNumbers: Array<String> = new Array<String>();
  sumOfLoadedWeightForAmend: any;
  sumOfLoadedPiecesForAmend: any;
  unloadedBy: any;
  partSuffix: String;
  partSuffixDisplay: String;
  trolleyInd: boolean;
  ttcase: boolean;
  weightChange: boolean;
  piecesChange: boolean;
  fromUnloadScreen: boolean;
}
export class Segment extends BaseRequest {
  segmentId: any;
  segment: any;
  flightBoardPoint: any;
  flightOffPoint: any;
}
//model class for unload shipment ends
// Model for sending search request for LoadShipment
export class SearchLoadShipment extends BaseRequest {
  flightKey: any;
  flightOriginDate: any;
  //Sree Laxmi
  segmentId: any;
  fromRevisedLoadShipment: boolean;

}
export class ManifestFlight extends BaseRequest {
  flight: Flight;
  segment: Array<ManifestSegment>;
  nilCargo: boolean;
  warnigAndErrorMessage: any;
}
export class ManifestSegment extends BaseRequest {
  manifestId: any;
  flightId: any;
  type: string;
  versionNo: any;
  pieces: any;
  weight: any;
  connectingFlights: Array<ConnectingFlight>;
}

export class ConnectingFlight extends BaseRequest {
  manifestConnectingFlightId: any;
  manifestId: any;
  flightKey: string;
  flightDate: any;
  destination: string;
}
export class SeparateManifest extends BaseRequest {
  flight: Flight;
  manifestShipmentInfoIds: Array<any>;
}

// Model for retriving response form  server for LoadShipment
export class SearchBuildupFlight extends BaseResponseData { }
// AirlineloadingInstrcutions Starts
export class AirlineLoadingInstructions extends BaseRequest {
  /**
   * Id of the instruction entered
   */
  expAirlineLoadingInstructionId: number;
  /**
   * flightId of operating flight.
   */
  flightId: number;
  /**
   * Number of pallets used by Flight
   */
  palletForFlightUse: number;
  /**
   * Number of pallets used by Flight Container
   */
  palletForFlightContainer: number;
  /**
   * Number of transit pallets used by Flight
   */
  palletForTransitUse: number;
  /**
   * Number of transit containers used
   */
  containerForTransitUse: number;
  /**
   * Number of pallets used by CARGO
   */
  palletForCargoUse: number;
  /**
   * Number of containers to be used by CARGO
   */
  containerForCargoUse: number;
  /**
   * Number of BT's to be used
   */
  trolleys: number;
  /**
   *  Airline Loading Instruction
   */
  loadingInstruction: String;
  /**
   * Version of the instruction
   */
  instructionVersion: number;
  /**
   * Date of the instruction entered
   */
  receivedDate: Date;
}

export class FlightAirlineLoadingInstructions extends BaseRequest {
  /**
   * flightKey of operating flight.
   */
  flightKey: String;
  /**
   * OriginDate of operating flight.
   */
  flightOriginDate: Date;
  /**
   * Standard time departure  of operating flight.
   */
  std: Date;
  /**
   * dayOfFly of operating flight.
   */
  dayOfFly: Date;
  /**
   * flightType of operating flight.
   */
  flightType: String;
  /**
   * routing of operating flight.
   */
  routing: String;
  /**
   * airlineLoadingInstructions of operating flight.
   */
  airlineLoadingInstructions: AirlineLoadingInstructions;
  /**
   * dayOfFly of operating flight
   */
  day: String;

  uldType: Array<any>;
  countUldType: Array<any>;
}

// Assign ULD starts
export class AssignULDSearch extends BaseRequest {
  flight: Flight;
}

export class BuildUpSegment { }

// Manage Acceptance Weighing starts

export class CargoWeighingServiceModel extends BaseRequest {
  cpeErrorFlag: boolean;
  billingErrorFlag: boolean;
  documentInformationId: number;
  shipmentModel: ShipmentModel;
  acceptanceServiceModel: AcceptanceServiceModel;
  cargoWeighingDetailModel: Array<CargoWeighingDetailModel>;
  acceptedPieces: number;
  acceptedWeight: number;
  dimension: any;
  remarks: any;
  eAcceptanceType: any;
  actionList: Array<ActionListModel>;
  serviceNumber: any;
  duplicateentryflag: boolean;
  paymentStatusFlag: boolean;
  requestedTemperatureRange: any;
  weighingstarttime: any;
  actualPieces: any;
  actualWeight: any;

}

export class weighingTimeModel extends BaseRequest {
  weighingstartdatetime: any;
  weighingenddatetime: any;
  shipmentNumber: any;
}

export class delayTimeModel extends BaseRequest {
  delaystartdatetime: any;
  delayenddatetime: any;
  shipmentNumber: any;
}

export class ShipmentModel {
  documentInformationId: number;
  carrier: string;
  destination: string;
  shipmentNumber: string;
  shipmentDate: string;
  shipmentId: number;
  shc: Array<SHCModel>;
  customStatus: string;
}

export class SHCModel {
  code: string;
}

export class CargoWeighingDetailModel extends BaseRequest {
  documentInformationId: number;
  weighingId: number;
  autoWeighBupId: number;
  uldNumber: string;
  grossWeight: number;
  piece: number;
  netWeight: number;
  tareWeight: number;
  skids: number;
  dryIceWeight: number;
  intentory: Array<CargoWeighingDetailInventory>;
}

export class CargoWeighingDetailInventory extends BaseRequest {
  documentInformationId: number;
  shipmentLocation: string;
  dryIceWeight: any;
  piece: number;
  weight: number;
  actualWeight: number;
  warehouseLocation: string;
  house: Array<HouseInformationModel>;
}

export class PartScenarioModel extends BaseRequest {
  shipmentId: any;
  masterPieces: any;
  inventoryPieces: any;
  loadedPieces: any;
  departedPieces: any;
  currentRowPieces: any;
  partButtonFlag: any;
  finalizeButtonFlag: any;
  isPart: any;
}

export class HouseInformationModel extends BaseRequest {
  documentInformationId: number;
  shipmentInventoryId: any;
  shipmentId: any;
  shipmentHouseId: any;
  type: string;
  number: number;
  pieces: number;
  weight: number;
  totPieces: number;
  totWeight: number;
  sspdPieces: number;
  shipmentInventoryHouseId: any;
}

export class AcceptanceServiceModel {
  documentInformationId: number;
  acceptanceType: string;
  serviceNumber: string;
  svc: string;
  uldBup: string;
  screenedPieces: number;
  totalDryIceWeight: number;
}

export class WeighingRemarks extends BaseRequest {
  documentInformationId: number;
  type: string;
  detail: string;
  deleteRemark: any;
}

export class ActionListModel {
  constraint: string;
  constraintStatus: string;
}

export class DimensionModel extends BaseRequest {
  documentInformationId: number;
  piece: any;
  length: any;
  width: any;
  height: any;
  volumeWeight: any;
  weightCode: string;
  measurementUnitCode: string;
}

export class SearchUldShipment extends BaseRequest {
  searchShipmentUldList: Array<SearchShipmentUld>;
}
export class SearchMailOffload extends BaseRequest {
  flight: any;
  departureDate: any;
  segment: any;
  segments: any;
  nextDestinationCode: any;
  finalDestinationCode: any;
  mailbagoffloadresponsedetail: any;
  flightKey: any;
  flightDate: any;
}
export class ResponseMailOffload extends BaseResponseData {
  MailOffloadDetails: Array<any>;
}

export class SearchShipmentUld extends BaseRequest {
  shipmentId: any;
  pieces: number;
  weight: number;
  segmentId: any;
  segment: string;
  shipmentNumber: any;
  flightkey: any;
  trmCase: any;
}

export class UldShipment extends BaseResponseData {
  responseData: Array<UldShipment>;
}

export class LoadUldShipment extends BaseResponseData {
  shipmentNumber: any;
  shipmentId: any;
  pieces: number;
  weight: number;
  assUldTrolleyNo: string;
  assUldTrolleyId: number;
  contentCode: string;
  segment: string;
  heightCode: string;
  phcIndicator: number;
  flightId: number;
  flightKey: string;
  flightOriginDate: any;
  segmentId: any;
  popUpOpeningTime: any;
  loadShipmentList: Array<LoadedShipment>;
  origin: any;
  destination: any;
  //for revised load shipment
  sqCarrierGroup: boolean;
}

export class LoadedShipment extends BaseRequest {
  assUldTrolleyNo: string;
  assUldTrolleyId: number;
  contentCode: string;
  heightCode: string;
  phcIndicator: number;
  flightId: number;
  flightKey: string;
  shipmentId: any;
  segmentId: any;
  shipmentNumber: string;
  shipmentInventoryId: any;
  locationPiecs: any;
  locationWeight: any;
  loadedShipmentInfoId: any;
  loadedPieces: number;
  movePiecs: number;
  moveWeight: number;
  loadedWeight: number;
  shcList: Array<string>;
  tagNumberList: Array<string>;
  shipHouseList: Array<any>;
  loadedShcList: Array<any>;
  tagInfo: string;
  dryIceWeight: number;
  moveDryIce: number;
  actualWeightWeighed: number;
  awbPieces: number;
  awbWeight: number;
  trmNumber: string;
  natureOfGoodsDescription: string;
  flightOriginDate: any;
  //Laxmi
  trmCarrier: String;
  isInvWithTrm: boolean;
  sqCarrierGroup: boolean
  partSuffix: string;
  dipSvcSTATS: string;
  fromRevisedLoadShipment: any;
}

export class ShipmentHouse extends BaseRequest {
  number: any;
  type: any;
}

export class BuildupLoadShipment extends BaseRequest {
  flightKey: string;
  flightId: number;
  flightOriginDate: any;
  std: any;
  etd: any;
  segmentId: any;
  assUldTrolleyNo: string;
  assUldTrolleyId: number;
  contentCode: string;
  heightCode: string;
  phcIndicator: number;
  loadType: string;
  ackInfo: boolean;
  loadedShipmentList: Array<LoadUldShipment>;
  flightType: string;
  carrierCode: string;
  flightBoardPoint: string;
  flightOffPoint: string;
  aircraftType: string;
  fromRevisedLoadShipment: boolean;
  fromLoadShipment: boolean;
  ackInfoForUldAssign: boolean;
  ackForeignUld: boolean;
}

export class BuildupLoadShipmentResponse extends BaseResponseData {
  loadedShipmentList: Array<LoadUldShipment>;
}

//Manage Acceptance Weighing ends

//Manage Acceptance Weighing Revised starts

export class CargoWeighingRevisedServiceModelRevised extends BaseRequest {

  shipmentModel: ShipmentModel;
  status: String;
  svc: Boolean;
  greaterAcceptedPiecesFlag: Boolean;
  physicalEcc: Boolean;
  acceptedDocumentPieces: any;
  weighingAcceptedPieces: any;
  weighingAcceptedWeight: any;
  acceptedDocumentWeight: any;
  greaterAcceptedWeightFlag: Boolean;
  paymentStatusAcknowledge: Boolean;
  paymentStatusFlag: Boolean;
  cargoWeighingDetailModel: Array<any>;
  totalAcceptedWeightSum: any;
  totalAcceptedPiecesSum: any;
  differenceWeight: any;
  differencePieces: any;
  latestLoggedInTime: any;
  differenceWeightPercent: any;
  acknowledgeindicatornotclose: Boolean;
  ruleShipmentExecutionDetails: Array<any>;
  finalize: any;
  detailrowindex: any;
  inventorysubindex: any;
  partEnableFlag: Boolean;
  volumetricWeight: any;
  preveiousWeighingAcceptedPieces: any;
  previousDocumentAcceptedPieces: any;
  saveAgainFlag: any;
  delayAcceptanceFlag: Boolean;
  isFinalizeSuffix: Boolean;
  // shipmentNumberList: String[];
  ackWarnForeignUldCheck: Boolean;
  foreignUldCheck: Boolean;
  foreignUld: any;
  acknowledgeIndicatorCPE: boolean = false;
}

//Manage Acceptance Weighing Revised ends


// AUTOWEIGH CAPTURED ULD LIST STARTS
export class SearchAutoWeighDetailsRequest extends BaseRequest {
  timeFrom: any;
  timeTo: any;
  date: any;
  fromDateTime: any;
  toDateTime: any;
  selectedTerminal: string;
  flightKey: string;
  uldNumber: string;
  shipmentNumber: any;
}

export class RequestRliRlmRegulation extends BaseRequest {
  uniqueIdentificationNo: number;
  properShippingName: string;
  impCode: string;
  carrierCode: string;
  dgRegulationId: string;
}

export class ResponseRliRlmRegulation extends BaseRequest {
  dgRegulationID: number;
  uniqueIdentificationNo: number;
  properShippingName: string;
  impCode: string;
  dgClassCode: string;
  emergencyRespondGroup: string;
  dgSubRiskCode1: string;
  dgSubRiskCode2: string;
  dgSubRiskIMPCode1: string;
  dgSubRiskIMPCode2: string;
  rliRlmInstructionList: any;
}

export class ResponseEliElmRegulation extends BaseRequest {
  dgHandlingId: number;
  dgRegulationID: number;
  carrierCode: string;
  impCode: string;
  packingGroupCode: string;
  packingInstruction: string;
  dgQuantityFlag: string;
  dgQuantity: boolean;
  upperDeck: boolean;
  lowerDeck: boolean;
  passengerFlag: boolean;
  forbiddenFlag: boolean;
  dgRemarks: string;
}

// DGD Classes

export class DgdAWBNumber extends BaseRequest {
  shipmentNumber: string;
  dgdReferenceNo: number;
}

export class DgdRefNumber extends BaseRequest {
  shipmentNumber: string;
  dgdReferenceNo: number;
}

export class DropdownPi extends BaseRequest {
  code: string;
  desc: string;
  unitCode: string;
}

export class DgdDetails extends BaseRequest {
  // shipmentNumber: string;
  shipperName: string;
  shipperAddress1: string;
  shipperAddress2: string;
  shipperPlace: string;
  shipperPostalCode: number;
  consigneeName: string;
  consigneeAddress1: string;
  consigneeAddress2: string;
  consigneePlace: string;
  consigneePostalCode: number;
  departureAirport: string;
  destinationAirport: string;
  shipperCityCode: number;
  shipperStateCode: number;
  shipperCountryCode: number;
  consigneeCityCode: number;
  consigneeStateCode: number;
  consigneeCountryCode: number;
  aircraftType: number;
  shipmentRadioactiveFlag: number;
  unid: number;
  dgSubriskCode1: number;
  packingInstructionCategory: number;
  packingGroupCode: number;
  packagePieces: number;
  packageQuantity: number;
  packingType: string;
  packingInstructions: string;
  authorizedUserProfileId: number;
  apioNumber: number;
  overPackNumber: string;
  natureAndQuantityOfdgd: string;
  psn: string;
  dgdReferenceNo: number;
  classCode: number;
  transportIndex: number;
  packingDimension1: number;
  packingDimension2: number;
  packingDimension3: number;
  additionalHandlingInformation: string;
}

//ecc export shp
export class EccExportRequest extends BaseRequest {
  flightDate: string;
  flight: string;
  flight1: string;
  planningAdvice: string;
  flightDate1: string;
}

export class planeAdviceRequest extends BaseRequest {
  planningAdvice: string;
}

export class EccExportResponse extends BaseResponseData {
  awbNo: string;
  pieces: string;
  weight: number;
  accptpieces: string;
  accptweight: string;
  flight: string;
  flightDate: string;
  std: string;
  agent: string;
  shc: number;
  offPoint: string;
  units: string;
  checker: string;
  bookStatus: string;
  bay: string;
  flightId: number;
}

export class SearchDgregulations extends BaseRequest {
  unid: number;
  psn: any;
}

export class SearchRegulation extends BaseRequest {
  dgRegulationId: any;
}

export class Dgregulations extends BaseRequest {
  unid: number;
  psn: any;
  unidDetails: Array<UnidDetails>;
}

export class UnidDetails extends BaseRequest {
  select: any;
  unid: any;
  psn: any;
  tech: any;
  class: any;
  imp: any;
  erg: any;
  sbr1: any;
  imp1: any;
  sbr2: any;
  imp2: any;
  dgDetails: Array<DgDetails>;
}

export class DgDetails extends BaseRequest {
  select: any;
  pg: any;
  fbd: any;
  mlqPInfo: any;
  mlqQuantity: any;
  mlqUnit: any;
  mpcPInfo: any;
  mpcQuantity: any;
  mpcUnit: any;
  mcoPInfo: any;
  mcoQuantity: any;
  mcoUnit: any;
  remarks: any;
}

export class DgDetailsList extends BaseRequest {
  dgList: any;
}

export class Count extends BaseRequest {
  count: any;
  subCount: any;
}

export class Notoc extends BaseRequest {
  flightKey: string;
  flightOriginDate: any = null;
  std: string;
  etd: string;
  paxCao: string;
  aircraftReg: string;
  selectsegment: string;
  boardingPoint: string;
  offPoint: string;
  isRevisedNotoc: any;
}

export class NotocDetail extends BaseRequest {
  flightKey: string;
  flightOriginDate: string;
  flightId: number;
  flightBoardPoint: string;
  flightOffPoint: string;
  serviceType: any;
  transactionSequenceNo: string;
  status: string;
  notocId: string;
  finalizeVersion: number;
  ntmVersionSent: number;
  notocDangerousGoodsDetails: any[];
  otherSpecialLoads: any[];
  specialInstructions: any[];
  dgRegulations: any[];
  flight: any[];
  dgHeaders: any[];
  freeText: any[];
  ackInfo: any;
  checkerInitial: any;
  ackInfoForUnfinalizeAudit = false;
  segmentId: any;
}

export class SIDSearchRequest extends BaseRequest {
  sidHeaderId: number;
  sidNumber: string;
  awbNumber: string;
  status: string;
  terminal: string;
  stockId: string;
  fromDate: Date;
  toDate: Date;
  carrierCode: string;
  shipmentNumber: any;
}
export class SIDHeaderDetailResponse extends BaseResponseData {
  public sIDHeaderDetailResponse: Array<SIDHeaderDetail>;
}
export class SIDHeaderDetail extends BaseRequest {
  sidHeaderId: number;
  sidNumber: string;
  shipmentNumber: string;
  shipperName: string;
  consigneeName: string;
  createdOn: Date;
  status: string;
  createdBy: string;
}
export class SearchStockRequest extends BaseRequest {
  stockCategoryCode: string;
  stockId: string;
  carrierCode: string;
  awbStockDetailsId: string;
}

export class StockResponse extends BaseResponseData {
  public stockResponse: Array<Stock>;
}
export class Stock extends BaseRequest {
  awbStockId: number;
  stockId: string;
  awbNumber: string;
}
export class NeutralAWBMasterResponse extends BaseResponseData {
  public neutralAWBMasterResponse: Array<Stock>;
}
export class CustomerInfo extends BaseRequest {
  //sidHeaderId: number;
  //customerName: String;

  shipmentFreightWayBillId: any = null;
  shipmentFreightWayBillCustomerInfoId: any = null;
  neutralAWBId: any = null;
  neutralAWBCustomerInfoId: any = null;
  sidHeaderId: any = null;
  sidCustomerDtlsId: any = null;
  customerType: any = null;
  customerName: any = null;
  customerAccountNumber: any = null;
  customerCode: any = null;
  customerAddressInfo: CustomerAddressInfo = new CustomerAddressInfo();
}
export class NeutralAWBMaster extends BaseRequest {
  sidNumber: string;
  consigneeInfo: CustomerInfo;
}

export class NeutralAWBMasters extends BaseRequest {
  svcFlag: any = null;
  neutralAWBId: any = null;
  sidHeaderId: any = null;
  sidNumber: any = null;
  consigneeInfo: CustomerInfo = new CustomerInfo();
  shipperInfo: CustomerInfo = new CustomerInfo();
  agentInfo: AgentInfo = new AgentInfo();
  shcCode: Array<SHC> = new Array<SHC>();
  routing: Routing = new Routing();
  accountingInfo: Array<AccountingInfo> = new Array<AccountingInfo>();
  otherCustomsInfo: Array<OtherCustomsInfo> = new Array<OtherCustomsInfo>();
  rateDescriptionOtherInfo: Array<RateDescOtherInfo> = new Array<
    RateDescOtherInfo
  >();
  rateDescription: Array<RateDescription> = new Array<RateDescription>();
  ppdCol: Array<PrepaidCollectChargeSummary> = new Array<
    PrepaidCollectChargeSummary
  >();
  chargeDeclaration: ChargeDeclaration = new ChargeDeclaration();
  ssrOsiInfo: Array<SSROSIInfo> = new Array<SSROSIInfo>();
  neutralAwbCustoms: NeutralAwbCustoms = new NeutralAwbCustoms();
  neutralAWBLocalAuthDetails: NeutralAWBLocalAuthDetails = new NeutralAWBLocalAuthDetails();
  otherCharges: Array<OtherCharges> = new Array<OtherCharges>();
  ppd: PrepaidCollectChargeSummary = new PrepaidCollectChargeSummary();
  col: PrepaidCollectChargeSummary = new PrepaidCollectChargeSummary();
  shipmentReferenceInfo: ShpReferenceInformation = new ShpReferenceInformation();
  senderReferenceInfo: SenderReferenceInformation = new SenderReferenceInformation();
  ccCharges: CCCharges = new CCCharges();
  nawbNominatedHandlingParty: NominatedHandlingParty = new NominatedHandlingParty();
  otherParticipantInfo: Array<OtherParticipantInfo> = new Array<
    OtherParticipantInfo
  >();
  flightBooking: FlightBooking = new FlightBooking();
  awbPrefix: any = null;
  awbSuffix: any = null;
  awbNumber: any = null;

  DateTime: Date = null;
  origin: any = null;
  destination: any = null;
  pieces: any = null;
  weightUnitCode: any = null;
  weight: any = null;
  natureOfGoodsDescription: any = null;
  volumeUnitCode: any = null;
  volumeAmount: any = null;
  densityIndicator: any = null;
  densityGroupCode: any = null;
  shippersCertificateSignature: any = null;

  carriersExecutionDate: any = null;
  carriersExecutionPlace: any = null;
  carriersExecutionAuthorisationSignature: any = null;
  customOrigin: any = null;
  commissionInformationCASSIndicator: any = null;
  commissionInformationCommissionAmount: any = null;
  salesIncentiveDetailCommissionPercentage: any = null;
  salesIncentiveDetailCASSIndicator: any = null;
  endorsedBy: any = null;
  endorsedFor: any = null;

  //DateTime: Date= null;
  handlingArea: any = null;
  status: any = null;
  handlingInformation: any = null;
  ardAgentReference: any = null;
  departureAirportName: any = null;
  destinationAirportName: any = null;

  constructor() {
    super();
  }
}

export class CustomerAddressInfo extends BaseRequest {
  shipmentFreightWayBillCustomerInfoId: any = null;
  shipmentFreightWayBillCustomerAddressInfoId: any = null;
  neutralAWBCustomerInfoId: any = null;
  neutralAWBCustomerAddressInfoId: any = null;
  sidCustomerDtlsId: any = null;
  sidCustomerAddressInfoId: any = null;
  customerInfoId: any = null;
  streetAddress1: any = null;
  streetAddress2: any = null;
  customerPlace: any = null;
  stateCode: any = null;
  countryCode: any = null;
  postalCode: any = null;
  conacatAddress: any = null;
  customerContactInfo: Array<CustomerContactInfo> = new Array<
    CustomerContactInfo
  >();
}

export class CustomerContactInfo extends BaseRequest {
  shipmentFreightWayBillCustomerAddressInfoId: any = null;
  neutralAWBCustomerAddressInfoId: any = null;
  sidCustomerAddressInfoId: any = null;
  contactIdentifier: any = null;
  contactDetail: any = null;
}

export class AgentInfo extends BaseRequest {
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  expNeutralAWBAgentInfoId: any = null;
  accountNumber: any = null;
  iATACargoAgentNumericCode: any = null;
  iATACargoAgentCASSAddress: any = null;
  participantIdentifier: any = null;
  agentName: any = null;
  agentPlace: any = null;
}

export class SHC extends BaseRequest {
  specialHandlingCode: any = null;
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  neutralAWBSHCId: any = null;
  origin: any = null;
}

export class Routing extends BaseRequest {
  airportCode: any = null;
  carrierCode: any = null;
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  neutralAWBRoutingId: any = null;
  sidHeaderId: any = null;
  from: any = null;
  to: any = null;
  flightKey: any = null;
  FlightDate: any = null;
}

export class AccountingInfo extends BaseRequest {
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  expNeutralAWBAccountingInfoId: any = null;
  informationIdentifier: any = null;
  accountingInformation: any = null;
  countryCode: any = null;
}

export class OtherCustomsInfo extends BaseRequest {
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  expNeutralAWBOtherCustomsInfoId: any = null;
  informationIdentifier: any = null;
  csrciIdentifier: any = null;
  scrcInformation: any = null;
  countryCode: any = null;
}

export class RateDescOtherInfo extends BaseRequest {
  type: any = null;
  weight: any = null;
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  neutralAWBRateDescriptionOtherInfoId: any = null;
  dimensionLength: any = null;
  dimensionWIdth: any = null;
  dimensionHeight: any = null;
  numberOfPieces: any = null;
  natureOfGoodsDescription: any = null;
  volumeUnitCode: any = null;
  volumeAmount: any = null;
  uldNumber: any = null;
  harmonisedCommodityCode: any = null;
  slacCount: any = null;
  countryCode: any = null;
  serviceCode: any = null;
  measurementUnitCode: any = 'CMT';
}

export class RateDescription extends BaseRequest {
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  neutralAWBRateDescriptionId: any = null;
  rateLineNumber: any = null;
  grossWeight: any = null;
  rateClassCode: any = null;
  commodityItemNo: any = null;
  chargeableWeight: any = null;
  rateChargeAmount: any = null;
  totalChargeAmount: any = null;
  natureOfGoodsDescription: any = null;
  numberOfPieces: any = null;
}

export class PrepaidCollectChargeSummary extends BaseRequest {
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  neutralAWBPPDCOLId: any = null;
  chargeTypeLineIdentifier: any = null;
  valuationChargeAmount: any = null;
  totalWeightChargeAmount: any = null;
  taxesChargeAmount: any = null;
  totalOtherChargesDueAgentChargeAmount: any = null;
  totalOtherChargesDueCarrierChargeAmount: any = null;
  chargeSummaryTotalChargeAmount: any = null;
  totalWeightChargeIdentifier: any = null;
  valuationChargeIdentifier: any = null;
  taxesChargeIdentifier: any = null;
  totalOtherChargesDueAgentChargeIdentifier: any = null;
  totalOtherChargesDueCarrierChargeIdentifier: any = null;
  chargeSummaryTotalChargeIdentifier: any = null;
}

export class ChargeDeclaration extends BaseRequest {
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  expNeutralAWBChargeDeclarationId: any = null;
  sidHeaderId: any = null;
  currencyCode: any = null;
  chargeCode: any = null;
  carriageValueDeclarationNawb: any = null;
  customsValueDeclarationNawb: any = null;
  insuranceValueDeclarationNawb: any = null;
  prepaIdCollectChargeDeclaration: any = null;
}

export class SSROSIInfo extends BaseRequest {
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  expNeutralAWBSSROSIInfoId: any = null;
  serviceRequestType: any = null;
  serviceRequestcontent: any = null;
}

export class OtherCharges extends BaseRequest {
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  neutralAWBOtherChargesId: any = null;
  otherChargeIndicator: any = null;
  otherChargeCode: any = null;
  entitlementCode: any = null;
  chargeAmount: any = null;
}

export class ShpReferenceInformation extends BaseRequest {
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  expNeutralAWBShipmentReferenceInfoId: any = null;
  referenceNumber: any = null;
  supplementaryShipmentInformation1: any = null;
  supplementaryShipmentInformation2: any = null;
}

export class SenderReferenceInformation extends BaseRequest {
  neutralAWBId: any = null;
  neutralAWBSenderReferenceId: any = null;
  airportCityCode: any = null;
  officeFunctionDesignator: any = null;
  companyDesignator: any = null;
  fileReference: any = null;
  participantIdentifier: any = null;
  participantCode: any = null;
  participantAirportCityCode: any = null;
}

export class CCCharges extends BaseRequest {
  neutralAWBId: any = null;
  neutralAWBCCChargesId: any = null;
  destinationCountryCode: any = null;
  currencyConversionExchangeRate: any = null;
  destinationCurrencyChargeAmount: any = null;
  chargesAtDestinationChargeAmount: any = null;
  totalCollectChargesChargeAmount: any = null;
}

export class NominatedHandlingParty extends BaseRequest {
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  expNeutralAWBNominatedHandlingPartyId: any = null;
  handlingPartyPlace: any = null;
}

export class OtherParticipantInfo extends BaseRequest {
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  expNeutralAWBOtherParticipantInfoId: any = null;
  participantName: any = null;
  airportCityCode: any = null;
  officeFunctionDesignator: any = null;
  companyDesignator: any = null;
  fileReference: any = null;
  opiParticipantIdentifier: any = null;
  opiParticipantCode: any = null;
  opiAirportCityCode: any = null;
}

export class FlightBooking extends BaseRequest {
  shipmentFreightWayBillId: any = null;
  neutralAWBId: any = null;
  flightNumber: any = null;
  flightDate: any = null;
  carrierCode: any = null;
  flightDays: any = null;
}

export class NeutralAwbCustoms extends BaseRequest {
  neutralAWBLocalAuthorityIn: any = null;
  neutralA: any = null;
  documentInformati: any = null;
  type: any = null;
}

export class NeutralAWBLocalAuthDetails extends BaseRequest {
  NeutralAWBLocalAuthorityDetailsId: any = null;

  neutralAWBLocalAuthorityInfoId: any = null;

  referenceNumber: any = null;

  customerAppAgentId: any = null;

  license: any = null;

  remarks: any = null;

  exemptionCode: any = null;

  aces: any = null;
}

export class SearchNAWBRQ extends BaseRequest {
  sidHeaderId: any = null;
  awbNumber: any = null;
}

export class UpdateFlightDetails extends BaseResponseData {
  autoWeighCapturedList: UpdateFlightData[];
}

export class UpdateFlightData {
  flightKey: string;
  date: Date;
  segment: string;
  autoWeighBupHeaderId: number;
  flightSegmentId: number;
  xpsShipment: boolean;
  dgShipment: boolean;
  cargo: boolean;
  mail: boolean;
  courier: boolean;
  tagRemarks: string;
  dgDetails: any;
  uldNumber: string;
  weightCapturedManually: any;
  pdTrolleyWeight: any;
  grossWeight: number;
  printerName: any;
  contourCode: any;
  carrierCode: any;
  oldFlightKey: any;
  oldFlightDate: any;
  acceptanceBy: any;
}

export class PrintUldtagData extends BaseRequest {
  xpsShipment: boolean;
  dgShipment: boolean;
  cargo: boolean;
  mail: boolean;
  bup: boolean;
  courier: boolean;
  tagRemarks: string;
  dgDetails: any;
  uldNumber: string;
  weightCapturedManually: any;
  pdTrolleyWeight: any;
  flightKey: string;
  autoWeighBupHeaderId: number;
  grossWeight: number;
  date: any;
  segment: string;
  printerName: any;
  contourCode: any;
  flightSegmentId: any;
  carrierCode: any;
  reprint: any;
  acceptanceBy: any;
}

export class FlightEvent extends Flight {
  departed: boolean;
  releaseManifest: boolean;
  releaseDLS: boolean;
  firstTimeManifestCompletedAt: any;
  firstTimeManifestCompletedBy: String;
  manifestCompletedAt: any;
  manifestCompletedBy: String;
  firstTimeDLSCompletedAt: any;
  firstTimeDLSCompletedBy: String;
  dlsCompletedAt: any;
  dlsCompletedBy: String;
  status: string;

  // below params added only for audit purpose
  flightKey: string;
  flightOriginDate: any;
}

export class GetRejectReturnShipmentDetails extends BaseRequest {
  shipmentNumber: string;

}

export class BuildUpCompleteEvent extends BaseRequest {
  flightId: number;
  flightKey: any = null;
  flightOriginDate: any = null;
  uldNumber: any;
  assULDTrolleyId: any;
  checkUldBuildUpComplete: boolean;

}

export class MoveToFlight extends BaseRequest {
  flightKey: any = null;
  flightOriginDate: any = null;
  segment: any = null;
  flightId: any = null;
  newsegment: any = null;
  flightSegmentId: any = null;
}

export class RejectShipmentRequest extends BaseRequest {
  prelodgeDocumentId: number;
  documentInformationId: number;
  shipmentId: number;
  shipmentNumber: String;
  rejectType: boolean;
  icCode: String;
  icName: String;
  reasonId: String;
  remarks: String;
}

export class ReturnShipmentRequest extends BaseRequest {
  prelodgeDocumentId: number;
  documentInformationId: number;
  shipmentId: number;
  shipmentNumber: String;
  pieces: number;
  weight: number;
  piecesToReturn: number;
  weightToReturn: number;
  rejectType: boolean;
  icCode: string;
  icName: string;
  reasonId: String;
  remarks: any = null;
  returnShipmentList: any;
  specialHandlingCode: any;
  email: any = [];
  contractorInfoRequired: any;
  origin;
  natureOfGoods;
  destination;
  firstBookedFlight
  firstBookedFlightDate;
  paymentSuccessfulFlag: boolean;
}

export class MailExportAcceptanceRequest extends BaseRequest {
  customerName: string;
  agentCode: string;
  customerId: number;
  shipmentType: string;
  totalPieces: number;
  totalWeight: number;
  shipmentId: number;
  shipmentNumber: string;
  dnNumber: string;
  dnOrigin: string;
  dnDestination: string;
  carrierCode: string;
  isSatsAssistedCar: string;
  uldNumber: string;
  warehouseLocation: string;
  dnRemarks: string;
  originOfficeExchange: string;
  mailBagMailCategory: string;
  mailBagMailSubcategory: string;
  mailBagDispatchYear: number;
  mailBagRegisteredIndicator: number;
  destinationOfficeExchange: string;
  mailNumber: string;
  bookingId: number;
  paFlightId: string;
  paFlightKey: string;
  paFlightDate: string;
  paFlightCarrier: string;
  countryCode: string;
  byAgent: any;
  byGHA: any;
  searchMode: any;
  transferredFromCarrier: any;
  mailBagNumber: string;
  incomingCarrier: string;
  incomingCountry: string;
  incomingCity: string;
  outgoingCountry: string;
  outgoingCity: string;
  outgoingCarrier: string;
  originCountry: string;
  originCity: string;
  destinationCountry: string;
  destinationCity: string;
  nextDestination: string;
  embargoFlag: string;
  damaged: string;
  intact: boolean;
  validateContainerDest: boolean;
  mailExportAcceptance: Array<MailExportAcceptance>;
  fieldLocked: boolean;
  bup: boolean;
  returned: string;
  flightAssigned: any;
  alreadyAcceptedBags: any;
}

export class MailExportAcceptance extends BaseRequest {
  mailBagNumber: string;
  category: string;
  mailType: string;
  year: number;
  receptalNumber: number;
  pieces: number;
  weight: number;
  origin: string;
  destination: string;
  paFlight: string;
  dispatchNumber: string;
  lastBagIndicator: number;
  registeredIndicator: number;
  nextDestination: string;
  shipmentLocation: string;
  releaseDest: boolean;
  containerDestination: string;
  carrierCode: string;
  uldPopup: boolean;
  paFlightKey: string;
  paFlightDate: any;
  returned: any;
}

export class MailExportAcceptanceDetails extends BaseRequest {
  agentCode: string;
  carrierCode: string;
  uldNumber: string;
  uldType: string;
  uldNum: string;
  uldCarrier: string;
  uldKey: string;
  nestedId: string;
  warehouseLocation: string;
  byAgent: any;
  byGHA: any;
  searchMode: any;
  transferredFromCarrierCode: string;
}

//CommonLoadShipment

export class CommonLoadShipment extends BaseRequest {
  flightKey: string;
  flightOriginDate: Date;
  flightId: any;
  flightSegmentId: any;
  newsegment: any;
  newflightKey: any;
  newflightOriginDate: Date;
  pieces: any = 0.0;
  weight: any = 0.0;
  natureOfGoods: any;
  destination: any;
  shipmentNumber: any;
  shipmentDate: any;
  segment: any;
  uldList: Array<BuildUpULD> = new Array<BuildUpULD>();
}
//LoadAndUnloadModelForAmendFlight
export class LoadAndUnloadModelForAmendFlight extends BaseRequest {
  commonLoadShipment: CommonLoadShipment;
  unLoadShipmentList: Array<UnloadShipment> = new Array<UnloadShipment>();
  uldNumber: any;
  heightCode: any;
  tareWeight: any;
  flightId: any;
}

export class BuildUpULD extends BaseRequest {
  uldTrolleyNo: any;
  shipmentList: Array<UldShipments> = new Array<UldShipments>();
}

export class UldShipments extends BaseRequest {
  shipmentDate: any = null;
  shipmentNumber: any = null;
  assUldTrolleyNo: any = null;
  newUldNumber: any = null;
  assUldTrolleyId: any = null;
  contentCode: any = null;
  heightCode: any = null;
  flightKey: any = null;
  flightOriginDate: any = null;
  segment: any = null;
  shipmentId: any = null;
  segmentId: any = null;
  flightSegmentId: any = null;
  flightId: any = null;
  phcIndicator: any = null;
  dryIceWeight: any = 0;
  moveDryIce: any = 0;
  pieces: any = 0.0;
  weight: any = 0.0;
  natureOfGoods: any;
  destination: any;
  shcList: any;
  shipmentType: string;
  partSuffix: string;
  sumOfLoadedWeightForAmend: any;
  sumOfLoadedPiecesForAmend: any;
}

export class IcCodeValidation extends BaseRequest {
  shipmentId: any;
  icCode: any;
  customerId: any;
}

export class TruckdockMonitoringRequest extends BaseRequest {
  datetimeFrom: any;
  datetimeTo: any;
  terminal: string;
  shipmentNumber: string;
  carrier: string;
  destination: string;
  status: string;
  shc: string;
}

export class TruckdockMonitoringResponse extends BaseBO {
  monitoringList: TruckdockMonitoringData[];
}

export class TruckdockMonitoringData extends BaseBO {
  shipmentNumber: string;
  flightNumber: string;
  carrier: string;
  destination: string;
  status: string;
  pieces: any;
  weight: any;
  natureOfGoods: string;
  std: any;
  documentAccepted: string;
  autoWeighDone: string;
  readyToLoad: string;
  shc: string;
}

export class SearchDisplayDLSVariance extends BaseRequest {
  flightNumber: string;
  flightDate: string;
  segmentId: string;
}

export class DisplayDLSVariance extends BaseResponseData {
  flightKey: string;
  flightNum: string;
  flightOriDate: string;
  dateSTD: any;
  dateETD: any;
  status: string;
  dlsVarianceResult: Array<DLSVariance>;
  dlsDiscrepancyResult: Array<DLSDiscrepancy>;
}

export class DLSVariance {
  segment: string;
  uld: string;
  dlsWeight: string;
  manifestedWeight: string;
  difference: string;
  percentage: string;
  icsGrossWeight: string;
  uldTag: string;
}

export class DLSDiscrepancy {
  segment: string;
  uld: string;
  shc: string;
  remarks: string;
}

export class ThroughTransitWorkingAdviceModel extends BaseRequest {
  flightType: string;
  shift: string;
  adviceDate: Date;
  flightPairSequence: number;
  outboundFlight: string;
  outboundFlightDate: Date;
  destination: string;
  transThroughTransitWorkingAdviceId: number;
  inboundFlight: string;
  inboundFlightDate: Date;
  origin: string;
  inboundFlightSegmentId: any;
  outboundFlightSegmentId: any;
  dateSTA: string;
  connectingFlights: Array<ConnectingFlights>;
}

export class ConnectingFlights extends BaseRequest {
  referenceId: number;
  flightPairSequence: number;
  inboundFlight: string;
  inboundFlightDate: Date;
  flightId: number;
  inboundFlightId: number;
  transTTWAConnectingFlightId: number;
  inboundFlightSegmentId: any;
  flightDate: Date;
  flight: string;
  flightStatus: string;
  airport: string;
  bulkShipments: Array<ThroughTransitWorkingAdviceShipmentModel>;
  uldWithShipments: Array<ThroughTransitWorkingAdviceUldModel>;
}

export class ThroughTransitWorkingAdviceUldModel extends BaseRequest {
  referenceId: number;
  transTTWAConnectingFlightId: number;
  recordIndex: number;
  uldNumber: string;
  contourCode: string;
  natureOfGoods: string;
  transferType: string;
  remarks: string;
  weightUnitCode: string;
  select: boolean;
  weight: number;
  impFlag: boolean;
  createdFromAdvice: boolean;
  shcList: Array<any>;
  piggyBackUlds: Array<PiggyBackUldModel>;
  shipments: Array<ThroughTransitWorkingAdviceShipmentModel>;
}

export class ThroughTransitWorkingAdviceShipmentModel extends BaseRequest {
  shipmentNumber: string;
  id: number;
  pieces: number;
  weight: number;
  weightUnitCode: string;
  referenceId: number;
  transTTWAConnectingFlightULDId: number;
  transTTWAConnectingFlightId: number;
  impFlag: boolean;
  transferType: string;
  remarks: string;
  recordIndex: number;
  natureOfGoods: string;
  shcList: Array<any>;
}

export class PiggyBackUldModel extends BaseRequest {
  id: number;
  referenceId: number;
  transTTWAConnectingFlightULDID: number;
  number: any;
}

export class AdviceSHC extends BaseRequest { }

export class GetFlightId extends BaseRequest {
  flightNumber: string;
  flightDate: string;
  flightType = "EXP";
}

export class ReturnMail extends BaseRequest {
  carrierCode: string;
  houseNumber: string;
  shipmentType: string;
  remarks: string;
  reason: string;
  bup: boolean;
  reasonID: any;
}

export class AddToScreeningFlight extends BaseRequest {
  flightKey: string;
  flightDate: any;
  flightType: any;
  type: string;
  uldNumber: string;
}

export class AddToScreeningShipmentList extends BaseResponseData {
  shipmentList: Array<AddToScreeningShipment>;
}

export class AddToScreeningShipment extends BaseRequest {
  customerId: any;
  customerName: string;
  shipmentId: any;
  shipmentNumber: string;
  origin: string;
  destination: string;
  piece: any;
  weight: any;
  natureOfGoods: string;
  flightId: any;
  flightKey: string;
  std: any;
  screeningReason: string;
  shipmentLocation: string;
  shc: string;
  screeningReqPieces: string;
  uldNumber: string;
  screeningChargeCustomer: string;
}

export class ScreeningPointRequest extends BaseRequest {
  shipmentNumber: string;
  uldNumber: string;
  flightKey: string;
  flightDate: any;
  tenderedDateFrom: any;
  tenderedDateTo: any;
  carrier: string;
  acceptanceTerminal: string;
  screeningReason: string;
  transferType: string;
  showScreenedShipmentsIndicator: boolean;
  screeningList: any[];
  shipmentNumbers: any[];
}

export class ScreeningPointShipment extends BaseRequest {
  tenderedDate: any;
  screenedMethod: string;
  screeningFlightId: any;
  shipmentNumber: string;
  shipmentId: any;
  flightId: any;
  carrierCode: any;
  customerId: any;
  natureOfGoods: string;
  rcarType: string;
  partShipment: string;
  outboundFlight: string;
  shipmentType: string;
  screeningTerminal: string;
  pieces: any;
  weight: any;
  screenedPieces: any;
  screenedWeight: any;
  stickerNumberFrom: string;
  stickerNumberTo: string;
  clearedForUplift: any;
  shipmentBuildType: any;
  partConfirm: boolean;
  screeningReasons: string[];
  agentCode: string;
  agentName: string;
  rcaNumber: string;
  reasonForRejection: string;
  screeningStartDate: any;
  screeningEndDate: any;
  screeningRemarks: string;
  transferType: any;
  screeningReason: any;
  passFailStatus: any;
  methodList: Array<ScreeningPointShipment> = new Array<ScreeningPointShipment>();

}


export class BookMultipleShipmentFlightDetails extends BaseRequest {
  temporaryDeleteCheckBox: false;
  dropDownVal: "";
  flightBookingID = null;
  bookingID = null;
  partBookingID = null;
  flightID = null;
  flightBoardPoint = null;
  flightOffPoint = null;
  segmentId = null;
  departureTime = null;
  arrivalTime = null;
  bookingPieces = null;
  bookingWeight = null;
  bookingStatusCode = null;
  bookingCancellationFlag = null;
  bookingCancellationDate = null;
  bookingCancellationUserCode = null;
  bookingCancellationReasonCode = null;
  workingListRemarks = null;
  manifestRemarks = null;
  additionalRemarks = null;
  throughTransitFlag = null;
  shcList: Array<BookingSHC> = new Array<BookingSHC>();
  // List<ShipmentBookingRemarks> remarks;
  // List<ShipmentBookingDimension> dimensionList;
}

export class BookingSHC extends BaseRequest {
  flightBookingId = null;
  specialHandlingCode = null;
  flightBookingSHCId = null;
}

export class MaintainSSPDModel extends BaseRequest {
  flightId: any;
  flightKey: string;
  flightDate: any;
  shipmentNumber: string;
  shipmentId: string;
  uldNumber: any;
  built: Array<ShipmentInventory>;
  inventory: Array<ShipmentInventory>;
  existingTags: Array<HouseInformationModel>;
  shipmentPieces: any;
  shipmentWeight: any;
  shipmentDate: any;
  origin: any;
  destination: any;
  flightOffPoint: any;
  flightBoardPoint: any;
  flightSegmentId: number;
}

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


export class ScannerResponseModel extends BaseRequest {
  messageId = null;
  measuredLength = null;
  measuredWidth = null;
  measuredHeight = null;
  measuredVolume = null;
  measuredVolWeight = null;
  dimensionCapturedManually = null;
  texture = null;
}


export class VolumetricRequest extends BaseRequest {
  shipmentNumber = null;
  messageId = null;
  scannerType = null;
  scannerId = null;
  oddSize = null;
  scannerIP = null;
  measuredPieces = null;
  skidHeight = null;
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
@Model(ACASShipment)
export class ACASShipment extends BaseRequest {
  flightKey: string = null;
  std: any = null;
  shipmentNumber: string = null;
  partShipment: string = null;
  agentName: string = null;
  destination: string = null;
  fwb: string = null;
  uld: string = null;
  awbPieces: any = null;
  fwbfhlPieces: string = null;
  psnCode: string = null;
  byPassFlag: string = null;
}

@Model(ACASRequest)
export class ACASRequest extends BaseRequest {
  @Pattern("^[A-Z0-9]{2,3}[0-9]{2,4}[A-Z0-9!@#$%^&*)(+=._-]$")
  flightKey: string = null;
  flightDate: any = null;
  shipmentNumber: string = null;
  psnCode: string = null;
  @IsArrayOf(ACASShipment)
  shipmentList: Array<ACASShipment> = new Array<ACASShipment>();
}

@Model(ByPassRequest)
export class ByPassRequest extends BaseRequest {
  @IsArrayOf(ACASShipment)
  shipmentList: Array<ACASShipment> = new Array<ACASShipment>();
  remarks: string = null;
  password: string = null;
  userLoginCode: string = null;

}

@Model(SCRequest)
export class SCRequest extends BaseRequest {
  terminal: string = null;
  shipmentNumber: string = null;
  shipmentDate: any = null;
  dateFrom: any = null;
  dateTo: any = null;
}
export class EcsdFetch {
  rcarNumber: any;
  otherScreeningMethod: any;
  awbNumber: String;
  awbDate: any;
  origin: String;
  destination: String;
  transferTransitPoints: String;
  awbPrefix: String;
  awbSuffix: String;
  contentsOfConsignmentFlag: boolean;
  contentsOfConsignment: String;
  securityStatus: string;
  ecsdoci: Array<EcsdOciModel> = new Array<EcsdOciModel>();
  regulatedList: any;
  additionalArray: any;
  flagCRUD: any;
}

export class EcsdOciModel {
  id: number;
  ecsdRecordId: number;
  securityStatus: string;
  informationIdentifier: any;
  screeningMethod: any;
  groundsForExemption: any;
  securityStatusIssuedBy: any;
  securityStatusIssuedOn: any;
  additionalSecurityInfo: any;
  regulatedCategory: any;
  ecsdSupplementaryInformation: any;
  ecsdCsrcIdentifier: any;
  otherScreeningMethod: any;
  countryCode: any;
  additionalArray: any;
  regulatedList: any;
}
export class SCShipment extends BaseRequest {
  shipmentNumber: string = null;
  destination: string = null;
  shipmentDate: any = null;
  pieces: any = null;
  weight: any = null;
  agent: string = null;
  scIndicator: string = null;
  outBoundFlight: string = null;
  screeningFailed: string = null;
  status: string = null;
  scOfficerName: string = null;
  scCheckDateTime: any = null;
  scRemarks: string = null;
}

export class SearchEmbargoMail extends BaseRequest {
  carriercode: string;
  dnNumber: string;
  origin: string;
  destination: string;
  byPass: string;
}

export class ResponseEmbargoMail extends BaseRequest {
  incomingCarrier: string;
  totalPieces: Number;
  totalWeight: string;
  responseEmabargoMailDetail: Array<ResponseEmabargoMailDetail>;
}

export class ResponseEmabargoMailDetail extends BaseRequest {
  mailBagNumber: string;
  nextDestination: string;
  dispatch: Number;
  shipmentType: string;
  receptacleNumber: Number;
  origin: string;
  destination: string;
  pieces: Number;
  weight: string;
  bypass: boolean;
  registered: string;
  damaged: boolean;
  reasonForUplift: string;
  select: boolean;
}
//awbreservation starts here
export class AwbReservationSearch extends BaseRequest {
  terminalId: any = null;
  core: any = null;
  destination: string = null;
  carrierCode: string = null;
  stockId: any = null;
  svc: any = null;
  awbStockDetailsId: any = null;
  bookedList: Array<AwbReservation> = null;
}
export class AwbReservation extends BaseRequest {
  awbStockReservationId: any = null;
  aWBStockDetailsId: any = null;
  shipperId: any = null;
  origin: any = null;
  destination: any = null;
  flightKey: any = null;
  flightDate: any = null;
  terminalId: any = null;
  core: any = null;
  shipperName: string = null;
  awbNumber: string = null;
  segment: string = null;
  date: any = null;
  staff: string = null;
  std: any = null;
}
//awbreservation ends here

//------------------- FWB FHL Discrepancy Shared Model Starts Here-------------------
export class FwbFhlDiscrepancyRequestModel extends BaseRequest {
  flightKey: string;
  flightDate: string;
  std: string;
  etd: string;
  status: string;
  manifestControl: string;
  selectSegment: string;
  shipmentStatus: string;
  consol: string;
  pieceOrWeightdiscrepancy: string;
  eawb: string;
  singleProcessPrint: string;
}

export class FwbFhlDiscrepancyResponseModel extends BaseRequest {
  slNumber: string;
  awbNumber: string;
  hw: string;
  org: string;
  desNumber: string;
  natureOfGoods: string;
  shippingAgent: string;
  eawb: string;
  fwbReceived: string;
  originalFwbDiscrepancy: string;
  amendedFwbReceived: string;
  fwbPieces: string;
  consolIndicator: string;
  readyToLoad: string;
  noOfFHLReceived: string;
  sumOfFHLPieces: string;
  completeHWB: string;
  singleProcessPrint: string;
  offPoint: string;
  boardPoint: string;
}
//------------------- FWB FHL Discrepancy Shared Model Ends Here-------------------

// Weighing scale request

export class WeighingScaleRequest extends BaseRequest {
  wscaleIP: string = "";
  wscalePort: string = "";
}

export class WeighingScaleWeighingRequest extends BaseRequest {
  whsLocationDeviceMappingId: any;
  canConnectFlag: any;
}


export class EliElmSavRequest extends BaseRequest {
  shipmentNumber: string;
  eliElmFormDetails: any;
}

export class SearchVolumetericRequest extends BaseRequest {
  awbNumber: string;
  carrier: string;
  agentname: string;
  accFromDate: Date;
  accToDate: Date;

}
export class EquipmentReturnSearchDetail extends BaseRequest { }

@Model(PsnMessageLogSummary)
export class PsnMessageLogSummary extends BaseRequest {
  status: string = null;
  message: string = null;
  version: string = null;
  rejectReason: string = null;
}

@Model(PsnMessageForm)
export class PsnMessageForm extends BaseRequest {
  @IsArrayOf(PsnMessageLogSummary)
  psnMessageLogSummary: Array<PsnMessageLogSummary> = new Array<PsnMessageLogSummary>();
}

export class ShipmentsTobeLoadedInventory extends BaseRequest {
  id: any;
  shipmentNumber: string;
  shipmentDate: any;
  assUldTrolleyNo: string;
  assUldTrolleyId: any;
  contentCode: string;
  heightCode: string;
  flightKey: string;
  flightOriginDate: any;
  segment: string;
  uldType: string;
  uldCarrierCode: string;
  uldCarrierCode2: string;
  phcIndicator: any;
  shipmentId: any;
  segmentId: any;
  flightSegmentId: any;
  flightId: any;
  pieces: any;
  weight: any;
  shipmentLockFlag: boolean;
  partConfirm: any;
  returned: any;
  finalizeWeight: any;
  rejected: any;
  trolleyInd: boolean;
  tareWeight: any;
  eccIndicator: string;
  usedAsTrolley: boolean;
  usedAsStandBy: boolean;
  ocsCargoFlag: boolean;
  remarks: string;
  uldInventory: Array<any> = new Array();
  grossWeight: any;
  assignedPieces: any;
  assignedWeight: any;
  // List of Inventory which need to be loaded Common Load Shipment
  loadShipmentList: Array<LoadedShipment> = new Array();
  // List of Shipment House for Loading mail bag
  mailBagList: Array<ShipmentHouse> = new Array();
  mailInd: string;
  // For transhipment scenario
  transferType: string;
  shcList: Array<ShipmentHouse> = new Array();
  fromAmendFlag: boolean;
  newUldNumber: string;
  newULD: boolean;
  shipmentType: string;
  popUpOpeningTime: any;
  serviceFlag: boolean;
  bookingPieces: any;
  bookingWeight: any;
  loadedPieces: any;
  loadedWeight: any;
  totalPieces: any;
  totalWeight: any;
  weighingAccepted: boolean;
  confirmBookingStatus: boolean;
  origins: string;
  destination: string;
  //Laxmi
  sqCarrierGroup: boolean;

  //Bug 12779
  origin: any;

}

export class ELM extends BaseBO {
  carrierCode: string;
  impCode: string;
  packingInstruction: string;
}
export class RLI extends BaseBO {
  carrierCode: string;
  packingGroupCode: string;
  dgQuantityFlag: string;
}

//model class for Special Cargo Shipment Starts
// Model for sending search request for LoadShipment
export class SearchSpecialCargoShipmentForHO extends BaseRequest {
  flightKey: any;
  flightDate: any;
  segmentId: any;
  shcGroup: any;
  fromRequest: any;
  shipmentInventoryId: any;
  requestId: any;
  handoverId: any;
  whLocation: any;
  uldBtNumber: any;
  handoverToLoginId: any;
  shipmentListFromWorkingList: Array<any> = new Array();
  shipmentNumber: any;
  fromDate: any;
  toDate: any;
  carrierGroup: any;
  byRequestHandOver: any;
  terminal: any;
  dlsMismatchYesNo: any;
  notocMismatchYesNo: any;
  requestTerminal: any;
}


export class SpecialCargoHandover extends BaseRequest {
  //for upload image
  identityKeyForImage: any;
  shipmentInventoryShipmentLocation: any;
  handoverShipmentId: any;
  flightId: any;
  partsuffix: any;
  handoverLocation: any;
  uploadedDocId: any;
}



//model class for Special Cargo Shipment Ends
/* Below mentioned models are used for  revamped accetanceweighing after discussion with Ranjith */
@Model(Shcs)
export class Shcs extends BaseRequest {

}

@Model(AceptanceWeighingModel)
export class AceptanceWeighingModel extends BaseRequest {

  shipmentNumber: number = null;
  handledByHouse: Boolean = false;
  hawbNumber: string = null;
  shipmentType: string = 'AWB';
  acceptanceType: string = 'DOM';
  dummyAWB: boolean = false;
}

export class AcceptanceWeighingSearchRequest extends BaseRequest {
  shipmentNumber: number;
  handledByHouse: boolean;
  hawbNumber: string;
  shipmentType: string;
}
export class HouseFinalize extends BaseRequest {

  houseNumber: string;
  inventoryPieces: number;
  houseTotalPieces: number;
  documentInformationId: number;
}


/* REACTIVE FORMS FOR ACCEPTANCE WEIGHING */

@Model(LocationListModel)
export class LocationListModel extends BaseRequest {
  pieces: number = null;
  weight: number = null;
  dryIceWeight: number = null;
  locShc: Array<String> = null;
  shipmentLocation: String = null;
  wareHouseLocation: String = null;
}

@Model(AcceptanceWeighingListModel)
export class AcceptanceWeighingListModel extends BaseRequest {
  pieces: number = null;
  dateTime: Date = null;
  noOfSkids: number = null;
  uldNumber: String = null;
  skidHeight: number = null;
  netWeight: number = null;
  tareWeight: number = null;
  grossWeight: number = null;
  dryIceWeight: number = null;
  skidTareWeight: number = null;
  weighingScaleId: number = null;
  volumetricWeight: number = null;
  dolleyTareWeight: number = null;
  manualWeightEntry: boolean = false;
  @IsArrayOf(LocationListModel)
  locationList: Array<LocationListModel> = new Array<LocationListModel>();
}

@Model(AcceptanceWeighingRemarksModel)
export class AcceptanceWeighingRemarksModel extends BaseRequest {
}

@Model(AcceptanceWeighingDimensionModel)
export class AcceptanceWeighingDimensionModel extends BaseRequest {
}

@Model(AcceptanceWeighingHouseSummaryModel)
export class AcceptanceWeighingHouseSummaryModel extends BaseRequest {
}

@Model(RuleShipmentArray)
export class RuleShipmentArray extends BaseRequest {
}

@Model(RuleShipmentExecutionDetails)
export class RuleShipmentExecutionDetails extends BaseRequest {
  @IsArrayOf(RuleShipmentArray)
  execInfoList: Array<RuleShipmentArray> = new Array<RuleShipmentArray>();
  @IsArrayOf(RuleShipmentArray)
  execWarnList: Array<RuleShipmentArray> = new Array<RuleShipmentArray>();
  @IsArrayOf(RuleShipmentArray)
  execErrorList: Array<RuleShipmentArray> = new Array<RuleShipmentArray>();
}

@Model(ShipmentExecModel)
export class ShipmentExecModel extends BaseRequest {
  shipmentInfoDetails: any;
  shipmentWarnDetails: any;
}

@Model(SaveAcceptanceWeighing)
export class SaveAcceptanceWeighing extends BaseRequest {
  fwbPieces: number = null;
  fwbWeight: number = null;
  acceptedPieces: number = null;
  acceptedWeight: number = null;
  summaryInfoFwbReceived: string = "N";
  summaryInfoFhlReceived: string = "N";
  summaryInfoIsEAWB: string = "N";
  summaryInfoIsNAWB: string = "N";
  type: string = null;
  origin: string = null;
  weight: number = null;
  status: string = null;
  pieces: number = null;
  totalVol: number = null;
  netWeight: number = null;
  accepted: boolean = null;
  shipmentId: number = null;
  hawbNumber: String = null;
  hawbPieces: number = null;
  hawbWeight: number = null;
  shipmentDate: Date = null;
  carrierCode: string = null;
  destination: string = null;
  ackReceived: string = null;
  shipmentType: string = null;
  hawbTotalVol: number = null;
  awbShc: Array<String> = null;
  currentWeight: number = null;
  differencePcs: number = null;
  hawbShc: Array<String> = null;
  hawbFinalized: boolean = null;
  shipmentNumber: string = null;
  acceptedDateTime: Date = null;
  totalVolWeight: number = null;
  shipmentHouseId: number = null;
  currentTotalVol: number = null;
  finalizeWeight: boolean = null;
  hawbDestination: String = null;
  hawbOrigin: String = null;
  weighingScaleId: number = null;
  differencePieces: number = null;
  differenceWeight: number = null;
  totalAcceptedHawb: number = null;
  flagCgoAppraised: boolean = null;
  currenthawbWeight: number = null;
  arrivalReportSent: String = null;
  houseInformationId: number = null;
  flagCgoUpsideDown: boolean = null;
  acceptanceByHouse: boolean = null;
  hawbTotalVolWeight: number = null;
  domesticIndicator: boolean = null;
  securitycClearFlag: String = null;
  totalFinalizedHawb: number = null;
  acceptanceType: string = null;
  currenthawbTotalVol: number = null;
  hawbFinalizedDateTime: Date = null;
  differencePercentage: number = null;
  allHawbArrivalSent: boolean = false;
  serviceInformationId: number = null;
  hawbChargeableWeight: number = null;
  totalHawbAcceptedPcs: number = null;
  totalHawbAckReceived: number = null;
  hawbFlagCgoAppraised: boolean = null;
  currentTotalVolWeight: number = null;
  flagWoodenDetachable: boolean = null;
  documentInformationId: number = null;
  totalAcceptedWeightSum: number = null;
  totalAcceptedPiecesSum: number = null;
  hawbFlagCgoUpsideDown: boolean = null;
  hawbListFinalizedState: String = null;
  differenceWeightPercent: number = null;
  currentChargeableWeight: number = null;
  finalizeWeightInitiatedOn: Date = null;
  flagGenUnloadingCharge: boolean = null;
  natureOfGoodsDescription: string = null;
  hawbFlagWoodenDetachable: boolean = null;
  finalizeWeightInitiatedBy: string = null;
  currenthawbTotalVolWeight: number = null;
  totalHawbArrivalReportSent: number = null;
  handledByDomesticIndicator: boolean = null;
  hawbFlagGenUnloadingCharge: boolean = null;
  currenthawbChargeableWeight: number = null;
  hawbNatureOfGoodsDescription: String = null;
  hawbDeclaredWeight: number = null;
  hawbDeclaredVolumetricWeight: number = null;
  hawbDeclaredChargeableWeight: number = null;
  flightCarrierCode: string = null;
  firstBookedFlight: string = null;;
  firstBookedFlightDate: Date = null;
  currentBookedFlight: string = null;
  currentBookedFlightDate: Date = null;
  firstOffPoint: string = null;
  currentFirstOffPoint: string = null;
  firstBookingDateTime: Date = null;
  manualBookingInfo: boolean = null;
  totalpieces: number = null;
  ruleShipmentExecutionDetails: RuleShipmentExecutionDetails = new RuleShipmentExecutionDetails();
  returnRemarks: string = null;
  returnReason: string = 'AWB_RETURN'; //For Domestic Return Cargo
  showReturnSection: boolean = false;
  returnRequested: boolean = false;
  customerName: string = null;
  customerCode: string = null;
  rcarStatus: string = null;
  requestedTemperatureRange: string = null;
  hawbCustomerCode: string = null;
  hawbCustomerName: string = null;
  hawbArrivalReportSent: string = null;
  hawbAckReceived: string = null;
  chargesPending: boolean = false;
  //Concurrency Check parameters
  shipMasterCreatedDateTime = null;  //Shipment_Master CreatedDateTime
  accptDocInfoCreatedDateTime = null;//Exp_eAcceptanceDocumentInformation CreatedDateTime
  shipMasterLastUpdatedDateTime = null;  //Shipment_Master LastUpdatedDateTime
  accptDocInfoLastUpdatedDateTime = null;  //Exp_eAcceptanceDocumentInformation LastUpdatedDateTime

  @IsArrayOf(Shcs)
  shc: Array<Shcs> = new Array<Shcs>();
  @IsArrayOf(AcceptanceWeighingRemarksModel)
  remarksList: Array<AcceptanceWeighingRemarksModel> = new Array<AcceptanceWeighingRemarksModel>();
  @IsArrayOf(AcceptanceWeighingListModel)
  weighingList: Array<AcceptanceWeighingListModel> = new Array<AcceptanceWeighingListModel>();
  @IsArrayOf(AcceptanceWeighingDimensionModel)
  dimensionList: Array<AcceptanceWeighingDimensionModel> = new Array<AcceptanceWeighingDimensionModel>();
  @IsArrayOf(AcceptanceWeighingHouseSummaryModel)
  hawbList: Array<AcceptanceWeighingHouseSummaryModel> = new Array<AcceptanceWeighingHouseSummaryModel>();
  @IsArrayOf(AcceptanceWeighingDimensionModel)
  fwbDimensionList: Array<AcceptanceWeighingDimensionModel> = new Array<AcceptanceWeighingDimensionModel>();
}

@Model(ReplaceDummyAWBModel)
export class ReplaceDummyAWBModel extends BaseRequest {
  shipmentNumber: string = null;
  newShipmentNumber: string = null;
  remarks: string = null;
  shipmentDate: Date = null;
}

//reactive model class for Export AWB document
//reactive model class for Export AWB document
@Model(ShipmentMasterSHCModel)
export class ShipmentMasterSHCModel extends BaseRequest {
  shipmentMasterSHCId: number = null;

  shipmentId: number = null;

  specialHandlingCode: string = null;
}

@Model(ExportAwbDocumentSearchModel)
export class ExportAwbDocumentSearchModel extends BaseBO {

  shipmentType: string = 'AWB';

  shipmentNumber: string = null;

  nonIATA: boolean = false;
}

@Model(IVRSNotificationContactInfo)
export class IVRSNotificationContactInfo extends BaseRequest {
  ivrsNotificationContactInfoId: number = null;

  customerType: string = null;

  contactTypeCode: string = null;

  contactTypeDetail: string = null;

  shipmentId: number = null;
}

@Model(ShipmentMasterCustomerContactInfoModel)
export class ShipmentMasterCustomerContactInfoModel extends BaseRequest {
  shipmentCustomerAddInfoId: number = null;

  contactTypeCode: string = null;

  contactTypeDetail: string = null;

  shipmentCustomerContInfoId: number = null;

  customerType: string = null;
}

@Model(ShipmentMasterCustomerAddressInfoModel)
export class ShipmentMasterCustomerAddressInfoModel extends BaseRequest {
  shipmentCustomerAddInfoId: number = null;

  shipmentCustomerInfoId: number = null;

  streetAddress: string = null;

  place: string = null;

  postal: string = null;

  stateCode: string = null;

  countryCode: string = null;

  @IsArrayOf(ShipmentMasterCustomerContactInfoModel)
  contactInformation: Array<ShipmentMasterCustomerContactInfoModel> = new Array<ShipmentMasterCustomerContactInfoModel>();
}



@Model(ShipmentMasterCustomerInfoModel)
export class ShipmentMasterCustomerInfoModel extends BaseRequest {

  shipmentCustomerInfoId: number = null;

  shipmentId: number = null;

  customerCode: string = null;

  customerName: string = null;

  accountNumber: string = null;

  overseasCustomer: boolean = null;

  appointedAgent: number = null;

  contactEmail: string = null;

  notifyPartyCode: string = null;

  notifyPartyName: string = null;

  authorizedPersonnel: boolean = null;

  authorizationRemarks: string = null;

  customerType: string = null;

  address: ShipmentMasterCustomerAddressInfoModel = new ShipmentMasterCustomerAddressInfoModel();

  @IsArrayOf(ShipmentMasterCustomerContactInfoModel)
  fwbContactInformation: Array<ShipmentMasterCustomerContactInfoModel> = new Array<ShipmentMasterCustomerContactInfoModel>();

  @IsArrayOf(IVRSNotificationContactInfo)
  ivrsContactInformation: Array<IVRSNotificationContactInfo> = new Array<IVRSNotificationContactInfo>();
}


@Model(ShipmentMasterRoutingInfoModel)
export class ShipmentMasterRoutingInfoModel extends BaseRequest {
  shipmentMasterRoutingId: number = null;

  shipmentId: number = null;

  fromPoint: string = null;

  carrier: string = null;
}

@Model(ShipmentRemarksModel)
export class ShipmentRemarksModel extends BaseRequest {

  shipmentRemark_Id: number = null;

  shipmentNumber: string = null;

  shipmentdate: Date = null;

  shipmentId: number = null;

  remarkType: string = null;

  flightId: number = null;

  shipmentRemarks: string = null;

  shipmentType: string = null;

  houseWayBillNumber: string = null;

  houseNumber: string = null;
}

@Model(LocationInfo)
export class LocationInfo extends BaseRequest {

  locPcs: number = null;

  locWeight: number = null;

  wareHouseLocation: string = null;

  shipmentLocation: string = null;

  locShc: string = null;
}


@Model(DimensionInfo)
export class DimensionInfo extends BaseRequest {
  length: number = null;
  width: number = null;
  height: number = null;
  pieces: number = null;
  volume: number = null;
  volumetricWeight: number = null;
  reason: string = null;
  multiplier: number = null;
  totalPieces: number = null;
  totalVolumetricWeight: number = null;
}

@Model(AcceptanceInfoModel)
export class AcceptanceInfoModel extends BaseRequest {

  documentInformationId: number = null;

  houseInformationId: number = null;

  houseNumber: string = null;

  houseDate: string = null;

  arrivalReportSent: boolean = null;

  ackReceived: boolean = null;

  housePcs: number = null;

  houseWeight: number = null;

  showAdditionalLocation: boolean = null;

  @IsArrayOf(LocationInfo)
  locationInfoList: Array<LocationInfo> = new Array<LocationInfo>();

  @IsArrayOf(DimensionInfo)
  dimensionInfoList: Array<DimensionInfo> = new Array<DimensionInfo>();
}

@Model(ExportAwbDocumentModel)
export class ExportAwbDocumentModel extends BaseBO {

  acceptanceType: string = null;

  accepted: boolean = null;

  shipmentType: string = null;

  shipmentId: number = null;

  documentInformationId: number = null;

  shipmentNumber: string = null;

  shipmentDate: Date = null;

  nonIATA: boolean = false;

  svc: boolean = null;

  origin: string = null;

  destination: string = null;

  pieces: number = null;

  weight: number = null;

  totalVolumetricWeight: number = null;

  totalVolume: number = null;

  chargeableWeight: number = null;

  weightUnitCode: string = null;

  natureOfGoodsDescription: string = null;

  handledByDOMINT: boolean = null;

  chargeCode: string = null;

  carrierCode: string = null;

  firstBookedFlight: string = null;

  firstBookedFlightDate: Date = null;

  pouchReceived: boolean = null;

  checkListReceived: boolean = null;

  requestedTemperatureRange: string = null;

  acceptedDateTime: Date = null;

  @IsArrayOf(ShipmentMasterSHCModel)
  specialHandlingCodeList: Array<ShipmentMasterSHCModel> = new Array<ShipmentMasterSHCModel>();

  @IsArrayOf(AcceptanceInfoModel)
  acceptanceInfoList: Array<AcceptanceInfoModel> = new Array<AcceptanceInfoModel>();

  @IsArrayOf(ShipmentMasterRoutingInfoModel)
  routing: Array<ShipmentMasterRoutingInfoModel> = new Array<ShipmentMasterRoutingInfoModel>();

  public shipper: ShipmentMasterCustomerInfoModel = new ShipmentMasterCustomerInfoModel();

  public consignee: ShipmentMasterCustomerInfoModel = new ShipmentMasterCustomerInfoModel();

  @IsArrayOf(ShipmentRemarksModel)
  otherServiceInformationList: Array<ShipmentRemarksModel> = new Array<ShipmentRemarksModel>();

  @IsArrayOf(ShipmentRemarksModel)
  generalRemarksList: Array<ShipmentRemarksModel> = new Array<ShipmentRemarksModel>();


  @IsArrayOf(ShipmentRemarksModel)
  specialServiceRequestList: Array<ShipmentRemarksModel> = new Array<ShipmentRemarksModel>();


  ruleShipmentExecutionDetails: RuleShipmentExecutionDetails = new RuleShipmentExecutionDetails();

  acknowledgeIndicatorCPE: boolean = null;

  //Bonder Truck Information
  isBondedTruck: boolean = false;

  incomingFlightKey: string = null;

  incomingFlightDate: Date = null;

  paymentStatus: string = null;

  billingErrorPlaceholder: string = null;

  bypassLodgeInCheck: boolean = false;

  DateSTD: Date = null;

  flightType: string = null;

  lodgeInType: string = null;

  lodgeInAlertType: string = null;

  lodgeInMsg: string = null;

  lodgeInPlaceHolder: string = null;

  lodgeInRequest: boolean = null;

  byPassLodgeInRemarks: string = null;
}

//Acceptance weighing by house summary starts

@Model(AcceptanceWeighingSummarySearchModel)
export class AcceptanceWeighingSummarySearchModel extends BaseRequest {
  acceptanceType: string = 'INT';
  shipmentNumber: string = null;
  isBondedTruck: boolean = false;
}

@Model(AcceptanceWeighingSummaryHouseDimesionModel)
export class AcceptanceWeighingSummaryHouseDimesionModel extends BaseRequest {
  dimensionId: number = null;
  documentInformationId: number = null;
  houseInformationId: number = null;
  length: number = null;
  width: number = null;
  height: number = null;
  pieces: number = null;
  volume: number = null;
  volumeCode: string = null;
  measurementUnitCode: string = null;
  volumetricWeight: number = null;
  dimensionCapturedManually: boolean = true;
  customsExportShipmentDimensionId: number = null;
  customsExportShipmentId: number = null;
}



@Model(AcceptanceWeighingSummaryHouseListModel)
export class AcceptanceWeighingSummaryHouseListModel extends BaseRequest {
  //private static final long serialVersionUID = 1L;
  select: boolean = false;
  acceptanceType: string = null;
  houseNumber: string = null;
  houseDate: Date = null;
  customerCode: string = null;
  customerShortName: string = null;
  natureOfGoodsDescription: string = null;
  shipmentChargeableWeight: number = null;
  declaredPieces: number = null;
  declaredWeight: number = null;
  declaredVolume: number = null;
  declaredVolumetricWeight: number = null;
  declaredChargeableWeight: number = null;
  customsDeclaredValue: number = null;
  pieces: number = null;
  weight: number = null;
  volumetricWeight: number = null;
  chargeableWeight: number = null;
  finalChargeableWeight: number = null;
  finalHawbChargeableWeight: number = null;
  examinationPieces: number = null;
  currentExaminationPieces: number = null;
  examinedPieces: number = null;
  finalized: boolean = false;
  finalizedDateTime: Date = null;
  finalizedBy: string = null;
  arrivalReportSentOn: Date = null;
  arrivalReportSent: boolean = false;
  ackReceived: boolean = false;
  shipmentId: string = null;
  shipmentHouseId: number = null;
  documentInformationId: number = null;
  houseInformationId: number = null;
  shipmentNumber: string = null;
  shipmentType: string = 'AWB';
  customsExportShipmentId: number = null;
  allowDelete: boolean = true;
  hawbShc: Array<String> = null;
  cancelRequested: boolean = false;
  generateCreditNote: boolean = false;
  weighingStarted: boolean = false;
  measurementUnitCode: string = null;
  accptHouseInfoCreatedDateTime = null;
  accptHouseInfoLastUpdatedDateTime = null;
  @IsArrayOf(AcceptanceWeighingSummaryHouseDimesionModel)
  declaredDimensions: Array<AcceptanceWeighingSummaryHouseDimesionModel> = new Array<AcceptanceWeighingSummaryHouseDimesionModel>();
}

@Model(AcceptanceWeighingSummaryModel)
export class AcceptanceWeighingSummaryModel extends BaseRequest {
  //private static final long serialVersionUID = 1L;

  //Shipment Header information
  awbDeclaredPieces = null;
  awbDeclaredWeight = null;
  fwbPieces: number = null;
  fwbWeight: number = null;
  acceptedPieces: number = null;
  acceptedWeight: number = null;
  fwbReceived: string = "N";
  fhlReceived: string = "N";
  isEAWB: string = "N";
  isNAWB: string = "N";
  finalizeWeight: boolean = false;
  accepted: boolean = false; //indicator for document complete
  finalizeWeightInitiatedOn: Date = null;
  finalizeWeightInitiatedBy: string = null;
  shipmentWeighingStarted: boolean = false;

  //Carting order information
  carrierCode: string = null;
  firstBookedFlight: string = null;
  firstBookedFlightDate: Date = null;
  currentBookedFlight: string = null;
  currentBookedFlightDate: Date = null;
  firstOffPoint: string = null;
  currentFirstOffPoint: string = null;
  firstBookingDateTime: Date = null;
  manualBookingInfo: boolean = false;

  //Shipment info
  shipmentNumber: string = null;
  origin: string = null;
  destination: string = null;;
  pieces: number = null;
  weight: number = null;
  volume: number = null;
  volumetricWeight: number = null;
  chargeableWeight: number = null;
  natureOfGoodsDescription: string = null;
  customerName: string = null;
  customerCode: string = null;
  rcarStatus: string = null;
  requestedTemperatureRange: string = null;
  serviceInformationId: number = null
  documentInformationId: number = null;
  shipmentId: number = null;
  status: string = null;
  awbShc: Array<String> = null;

  //Bonder Truck Information
  isBondedTruck: boolean = false;
  incomingFlightKey: string = null;
  incomingFlightDate: Date = null;

  // return cargo 
  returnReason: string = null;
  tansferCTO: string = null;
  newShipmentNumber: string = null;
  returnRemarks: string = null;
  allLeoRecieved: boolean = false;
  returnRequested: boolean = false;
  cancelledHouse: string = null;
  creditDebitNoteList: Array<CreditDebitNote> = null;
  billingErrorPlaceholder: string = null;

  ruleShipmentExecutionDetails: RuleShipmentExecutionDetails = new RuleShipmentExecutionDetails();

  // UI manipulationParameters 
  allowReturnCargo: boolean = false;
  showReturnSection: boolean = false;

  //Concurrency Check parameters
  shipMasterCreatedDateTime = null;  //Shipment_Master CreatedDateTime
  accptDocInfoCreatedDateTime = null;//Exp_eAcceptanceDocumentInformation CreatedDateTime
  shipMasterLastUpdatedDateTime = null;  //Shipment_Master LastUpdatedDateTime
  accptDocInfoLastUpdatedDateTime = null;  //Exp_eAcceptanceDocumentInformation LastUpdatedDateTime

  //Shipping Bill Information
  @IsArrayOf(AcceptanceWeighingSummaryHouseListModel)
  houseSummaryList: Array<AcceptanceWeighingSummaryHouseListModel> = new Array<AcceptanceWeighingSummaryHouseListModel>();
}
@Model(AcceptanceMonitoringByHouseRequestModel)
export class AcceptanceMonitoringByHouseRequestModel extends BaseRequest {
  [x: string]: any;
  dateTimeFrom: String;
  dateTimeTo: String;
  shipmentNumber: Number;
  domesticFlightFlag: String;
  customerCode: String;
  carrierCode: String;

}

export class CreditDebitNote extends BaseRequest {
  creditDebitNoteReceiptId: number = null;
  creditDebitNoteNumber: string = null;
  receiptNumber: number = null;
}

//Acceptance weighing by house summary ends


//eFBL Starts

export class SearchEFBL extends BaseRequest {
  flightKey: any;
  flightOriginDate: any;
  segmentId: any;
  flightId: any;
  aircraftRegistration: any;
}
// Rebuild Cargo Advice STARTS
export class RebuildCargoAdviceSearch extends BaseRequest {
  flightKey: String;
  flightDate: String;
  retrieveCargoAdvice: any;
}

// Rebuild Cargo Advice ENDS

// Approve Rebuild Cargo Advice STARTS
export class ApproveRebuildCargoAdviceSearch extends BaseRequest {
  carr: String;
  fromDate: String;
  toDate: String;
  retrieveApproveCargoAdvice: any;
}


// Approve Rebuild Cargo Advice ENDS

export class MaintainAccsInformation extends BaseRequest {
  shipmentNumber: String = null;
  awbPieces: number = null;
  awbWeight: number = null;
  manPieces: number = null;
  manWeight: number = null;
  origin: String = null;
  destination: String = null;
  loadingPoint: String = null;
  content: String = null;
  ata: any;
  flightNumber: any;
  flightDate: any;
  fhlPiece: number = null;
  fhlWeight: number = null;
  splCode: any;
  holdingAgent: any;
  relIndicator: any;
  shipmentList: any;
  // shipper: any;
  // consignee: CustomsMaintainAccsCustomerAddress = new CustomsMaintainAccsCustomerAddress();
}

@Model(CustomsMaintainAccsCustomerAddress)
export class CustomsMaintainAccsCustomerAddress extends BaseRequest {
  customerCode: String;
  customerName: String;
  address: Number;
  countryCode: String;
  postal: String;
  place: String;
  stateCode: String;
}
// Approve Rebuild Cargo Advice ENDS

//Premanifest starts
export class PreManifestSearch extends BaseRequest {
  flightId: number;
  flightKey: String;
  flightDate: String;
  segmentId: any;
  shipmentList: any;
  boardPoint: string;
  offPoint: string;
  shipmentNumber: any;
  uldNumber: any;
  preMnfstdAwbList: any;
  nonPreMnfstdAwbList: any;
  preMnfstdUldList: any;
  nonPreMnfstdUldList: any;
  awbList: any[];
  isBulk: boolean = false;
}

//Premanifest ends

//changed by abhishek
export class MRCSummaryRequestModel extends BaseRequest {


  shipmentNumber: any;
  uld: any;
  mRCLType: any;
  SubmissionDateFrom: any;
  SubmissionDateTo: any;
  Status: any;
  SecurityScrOption: any;
  carrier: any;
  carriergroup: any;
  agent: any;
  IataName: any;
  PredeclarationNumber: any;
  TruckNumber: any;
  SecuredTransMethod: any;
}

export class PrelodgeExportDocumentsClearance extends BaseRequest {
  documentType: String;
  documentNo: String;
  issueDate: String;
  expiryDate: String;
}
export class PrelodgeExportDocumentsRacsf extends BaseRequest {
  truckerName: String;
  truckerId: String;
  truckNo: String;
  facilityCode: String;
  sealNo: String;
  guardName: String;
  guardId: String;
  fileReferenceNumber: String;
}
export class PrelodgeExportDocumentsDimension extends BaseRequest {
  length: number;
  width: number;
  height: number;
  pieces: number;
}
export class PrelodgeExportDocumentsUldInfo extends BaseRequest {
  documentPieces: number;
  documentWeight: any;
  height: String;
  pieces: String;
}
export class CargoBreakDownDetails extends BaseRequest {
  shipmentNumber: String;
  destination: String;
  pieces: String;
  weight: String;
  specialHandlingCode: Array<PrelodgeExportDocumentsSHC1>;
  packagingInformationList: Array<PrelodgeExportDocumentsPackagingInformation>
  notificationInfo1: String;
  notificationInfo2: String;
  notificationInfo3: String;
}
export class PrelodgeExportDocumentsSHC1 extends BaseRequest {
  specialHandlingCode: number;
}
export class PrelodgeExportDocumentsPackagingInformation extends BaseRequest {

  reference: String;
}


export class PrelodgeExportDocuments extends BaseRequest {
  shipmentNumber: String;
  uldNumber: String;
  acceptanceType: String;
  prelodgeServiceNo: String;
  totalDocumentPieces: number;
  totalDocumentWeight: number;
  shipmentDate: String;
  shipmentStatus: String;
  securityScreeningOption: String;
  carrierCode: String;
  agentCustomerID: number;
  agentName: String;
  agentIATACode: String;
  prelodgeDocumentId: number;
  truckNumber: any;
  screeningSecuredTransportationMethod: String;
  rejectCode: String;
  rejectReason: String;
  documentDestination: String;
  countryCode: String;
  documentPieces: number;
  documentWeight: any;
  flightKey: String;
  flightDate: String;
  securityCheck: String;
  specialHandlingCode: Array<PrelodgeExportDocumentsSHC1>;
  dg: Boolean;
  dutiableCommodities: Boolean;
  exportProhibitedArticle: Boolean;
  plannedCargoDeliveryOn: String;
  packagingInformation: Array<String>;
  notificationInfo1: String;
  notificationInfo2: String;
  notificationInfo3: String;
  airsideAcceptance: Boolean;
  directTow: Boolean;
  handCarry: Boolean;
  screeningExemptedReason: String;
  documnetRefernceNumber: String;
  plasticSheetColor: String;
  natureOfGoodsDescription: String;
  packagingInformationList: Array<PrelodgeExportDocumentsPackagingInformation>
  clearance: Array<PrelodgeExportDocumentsClearance>;
  racsf: Array<PrelodgeExportDocumentsRacsf>;
  dimesion: Array<PrelodgeExportDocumentsDimension>;
  uLDInfo: Array<PrelodgeExportDocumentsUldInfo>;
  cargoBreakDownDetails: Array<CargoBreakDownDetails>;
  //end
}

export class MRCSummaryResponseModel extends BaseResponseData {


  shipmentNumber: any;
  uld: any;
  mRCLType: any;
  SubmissionDateFrom: any;
  SubmissionDateTo: any;
  Status: any;
  SecurityScrOption: any;
  carrier: any;
  carriergroup: any;
  agent: any;
  IataName: any;
  PredeclarationNumber: any;
  TruckNumber: any;
  SecuredTransMethod: any;
}

//Acceptance weighing by house summary ends

//class for pre-declaration

export class MRCLpreDeclarationModel extends BaseResponseData {

}
//end of pre-declaration class
//RCL Part begins
export class SearchMaintainRCL extends BaseRequest {
  acceptanceType: String;
  shipmentNumber: String;
  uld: String;
}

export class SearchRclSummaryReq extends BaseRequest {
  fromDate: Date;
  toDate: Date;
  shipmentNumber: String;
  uldNumber: String;
  serviceNumber: String;
  incomingFlight: String;
  incomingFlightDate: String;
  carrierCode: String;
  carrierGroup: String;
  status: String;
  agentName: String;
}

export class RclRetriveReq extends BaseRequest {
  serviceInformationId: number;
  acceptanceType: String;
}

export class RclSearchReq extends BaseRequest {
  shipmentNumber: String;
  uldNumber: String;
  acceptanceType: String;
}

export class ReportForMrclSummary extends BaseRequest {
  shipmentNumber: String;
  uldNumber: String;
  acceptanceType: String;
  shipmentStatus: String;
  securityScreeningOption: String;
  carrierCode: String;
  shipmentDate: String;
  shipmentDateTo: String;
  truckNumber: String;
  screeningSecuredTransportationMethod: String;
  prelodgeServiceNo: String;
  agentIATACode: String;
  agentName: String;
  carriergroup: String;
}
export class ReportForMrclPreDeclaration extends BaseRequest {
  shipmentNumber: String;
  documentDestination: String;
  dateFormToday: String;
  dateFormTomorrow: String;
  dateFormdAtomorrow: String;
  plannedCargoDeliveryOn: String;
  documentPieces: String;
  documentWeight: String;
  truckNumber: String;
  securityCheck: String;
  screeningRemarks: String;
  specialHandlingCode: Array<specialHandlingCode>;
  packagingInformationList: Array<packagingInformationList>;
}
export class packagingInformationList extends BaseRequest {
  reference: String;
}
export class specialHandlingCode extends BaseRequest {
  specialHandlingCode: String;
}

export class RclGenerateAwbReq extends BaseRequest {
  acceptanceType: String;
  awbPrefix: String;
}

export class validateAndFetchBookingReq extends BaseRequest {
  acceptanceType: String;
  shipmentNumber: String;
  uldNumber: String;
}

export class ManifestRemarks extends BaseRequest {
  remark: String;
  shipmentList: Array<any>;
}

//end of RCL Part 


