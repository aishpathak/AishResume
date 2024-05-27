import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { BaseService, RestService, BaseRequest, BaseResponseData, Model, IsArrayOf } from 'ngc-framework';
import { isArray } from 'util';
// Request Model for retrieving Uld Stock

export class UldStockLevelRequest extends BaseRequest {
  uldCarrier: string;
  stockLevel: string;
}
// Response Model for retrieving Uld Stock
export class UldStockLevelResponse extends BaseResponseData {

  uldTypeCode: String;
  uldTypeDesc: String;
  minUld: number;
  maxUld: number;
  ownerUlds: number;
  foreignUlds: number;
  balanceUld: String;
}

// Request Model for retrieving Uld Inventory List
export class UldInventoryRequest extends BaseRequest {
  carrierCode: String;
  uldType: String;
  uldGroup: String;
  airportPosition: String;
  uldOwnership: String;
  uldCondition: String;
  uldAvailability: String;
  aging: String;
  movmentTypeList: any;
}

// Request Model for retrieving Uld Inventory List
export class UldTempratureRequest extends BaseRequest {
  uldKey: String;
  fromDate: String;
  toDate: String;
}
// Request Model for retrieving Enquire LSP By Location
export class EnquiryLSPByLocationRequest extends BaseRequest {
  warehouseDestination: String;
  warehouseLocation: String;
  empty: String;
}

export class ServiceErrorLogRequest extends BaseRequest {
  fromDate: String;
  toDate: String;
  serviced: String;
  type: String;
}

export class ServiceErrorLogResponse extends BaseResponseData {
  logDate: String;
  userID: String;
  uldNo: String;
  eirNo: String;
  rclNo: String;
  reason: String;
  fltType: String;
  svcUid: String;
  svcDate: String;
  fltNoDate:String;   
}
// Request Model for retrieving Uld Inventory List
export class UldInventoryDetailsRequest extends BaseRequest {
  carrierCode: String;
  carrierGroup: String;
  uldType: String;
  uldGroup: String;
  airportPosition: String;
  uldOwnership: String;
  uldCondition: String;
  movmentTypeList: any;
  contentCode: any;
  heightCode: any;
  awbLoaded: String;
  destinationWhLocation: String;
  warehouseActualLocation: String;
  status: any;
  unConfirmed: boolean;
  unReserved: boolean;
  ppkLoaded: boolean;
  mixLoaded: boolean;
  missing: boolean;
  onHand: boolean;
}
//Uld Inventory Model
export class UldInventory {
  uldNumber: string;
  uldCarrier: string;
  uldType: string;
  usedBy: string;
  destinationWhLocation: string;
  contentsCode: string;
  airportPosition: string;
  contentsType: string;
  movementType: string;
}

// Response Model for retrieving Uld Inventory List
export class UldInventoryResponse extends BaseResponseData {

  uldCarrier: string;
  uldType: string;
  uldCount: string;
  uldList: Array<UldInventory>;

}
// Response Model for retrieving Enquire LSP By Location
export class EnquiryLSPByLocationResponse extends BaseResponseData {
  lspNumber: string;
  warehouseDestination: string;
  warehouseLocation: string;
  empty: string;
  HTClass: string;
  storageDate: string;
  retrivedDate: string;
}

export class UldTempratureResponse extends BaseResponseData {
  uldTemperatureLogId: String
  uldKey: String;
  temperatureType: String
  temperatureTypeValue: String;
  uldevent: String;
  temperatureValue: String;
  temperatureCaptureDt: String;
  remarks: String
  fromDate: String
  toDate: String
}

//Response Model for ULD IN/OUT Movement
export class UldMovement extends BaseResponseData {
  //uldNumber:String;
  usedBy: string;
  wareHouseLocation: string;
  grp: string;
  status: string;
  contentCode: string;
  conditionType: string;
  airportPosition: string;
  countourIndicator: string;
  remarks: string;
  uldDate: Date;
  fltNumOut: string;
  flaguldInout: boolean;
  uldMovement: any;
  flight: string;
  arrivalDate: Date;
  originAirport: string;
  departureDate: string;
  destinationAirport: string;
  usedByRemarks: string;
  conditionTypeRemarks: string;
  airportPositionRemarks: string;
  movementDescription: string;
  uldKey: any;
  uldNumbers: string;
  dateForNew: any;
  movementList: any;
  uldTrolleyNumber: any;
  movementDateTime: any;
  movementType: string;
  flightKey: any;
  flightDate: any;
  reserved: boolean = false;
  destinationWhLocation: any;
  uldNumberConcat: any;
  contentsCode: any;
}

export class ULD extends BaseRequest {
  uldNumberConcat: string;
  uldType: string;
  uldNumber: any;
  status: string;
  uldCarrier: string;
  usedBy: string;
  destinationWhLocation: string;
  airportPosition: string;
  listRemarks: string[] = [];
  remarks: string;
  uldDate: any;
  uldTime: string;
  flight: string;
  uldIn: ULDIn;
  conditionType: string;
  contentsCode: string;
  contourIndicator: any;
}

export class ULDIn extends BaseRequest {
  fltCarrier: string;
  fltNumber: string;
  flightKey: string;
  uldInDat: string;
  ucmTyp: string;
  aptBrd: string;
  aptOff: string;
  uldInTim: number;
  estDat: string;
  extTim: number;
  depDate: string;
  lstUpdDat: string;
  actualDepDate: string;
  actualDepTime: string;
  estimatedDepDate: string;
  estimatedDepTime: string;
  scheduledDepDate: string;
  scheduledDepTime: string;
  //  conditionType: string;
  date: string;
  //contentsCode: string;
  time: string;
}

export class UldTransferViewDataRequest extends BaseRequest {
  transferId: number;
  transferCarrier: string;
  receivingCarrier: string;
  transferFinalizedFlag: boolean;
  fromDateTime: any;
  toDateTime: any;
}

export class UldGenerateRecieptNumberRequest extends BaseRequest {
  transferCarrier: string;
  createdBy: String = 'Laxmi';
}

export class UldTransferViewDataResponse extends BaseResponseData {
  lucTransactionNo: any;
  transAirport: string;
  status: string;
  transferCarrier: string;
  receivingCarrier: string;
  issueDateTime: string;
  uldNum: string;
  usedBy: string;
  receiptPrefix: string;
  receiptOrder: string;
  receiptSuffix: string;
  conditionType: string;
  destination: string;
  remarks: string;
}
// Uld Stock Check UI models
export class UldTransferRequest extends BaseRequest {
  transferCarrier: string;
  receivingCarrier: string;
  issueDateTime: string;
  transferAirport: string;
  uldRemarks: any;
  lucReceiptNum: any;
  uldTransfers: any;
  finalized: boolean;
  transferId: number;
  flagUpdateTransfer: boolean;
  transferSeqNum: number;

}

export class UldTransferResponse extends BaseResponseData {
}

export class UldStockStatusRequest extends BaseRequest {
  carrierCode: string;
  apronCargoLocation: string;
}
export class UldStockStatusResponse extends BaseResponseData {
  carrier: string;
  heldBy: string;
  stockArea: string;
  status: string;
  startDateTime: string;
  endDateTime: string;
}
export class UldStockResponse extends BaseResponseData {
  public uldStock: Array<UldStockResponse>;
}

@Model(UldCharacteristicsGroup)
export class UldCharacteristicsGroup extends BaseRequest {
  carrierCode: any = null;
  uldGroup: any = null;
  uldType: any = null;
  station: any = null;
  minAllow: number = null;
  maxAllow: number = null;
}

export class SightedUldRequest extends BaseRequest {
  globalInventoryUldCharacteristicsId: any = null;
  uldGroup: any = null;
  uldGroupId: any = null;
  uldType: any = null;
  carrierGroupDesc: any = null;
  carrierCode: any = null;
  carrierGroup: any = null;
  apronCargoLocation: any = null;
  stockCheckAreaCode: any = null;
  uldKey: any = null;
  station: any = null;
  edit: boolean = false;
  stdLimit: number = null;
  minAllow: number = null;
  maxAllow: number = null;
  @IsArrayOf(UldCharacteristicsGroup)
  public uldCharacteristicsGroup: Array<UldCharacteristicsGroup> = new Array<UldCharacteristicsGroup>();
  // stockCheckAreaCodeApron: any;
  // stockCheckAreaCodeCargo: any;
}
export class SightedUldResponse extends BaseResponseData {
  public sightedUlds: Array<UldStockResponse>;
}
export class ConfirmSightedUldRequest extends BaseRequest {
  listConfirmSighted: any;
}
export class ConfirmSightedUldResponse extends BaseRequest {
  public confirmSighted: Array<ConfirmSightedUldResponse>;
}

export class DeleteSightedUldRequest extends BaseRequest {
  listDeleteSighted: any;
}

export class DeleteSightedUldResponse extends BaseRequest {
  public deleteSighted: Array<DeleteSightedUldResponse>;
}
export class ConfirmMissingRequest extends BaseRequest {
  listConfirmMissing: any;
}
export class ConfirmMissingResponse extends BaseRequest {
  public confirmMissing: Array<ConfirmMissingResponse>;
}

export class UldStockDetailsResponse extends BaseResponseData {
  scmCycleId: number;
  uldStockCheckId: number;
  uldId: number;
  stockCheckSource: string;
  uldStockCheckRecordType: string;
  sightedDate: any;
  sightedUserCode: string;
  uldKey: string;
  conditionType: string;
  stockCheckAreaCode: string;
  uldLastMovementType: string;
  uldLastMovementDetails: string;
  uldStockCheckCompleteFlag: string;
  uldStockCheckOsiRemarks: string;
  uldDamageRemarks: string;
  createdUserCode: string;
  createdDateTime: any;
  lastUpdatedUserCode: string;
  lastUpdatedDateTime: any;
}
// End Uld Stock Check
export class UldEnquire extends BaseResponseData {
  uldTrolleyNumber: string;
  userType: string;
  uploadedDocId: any;
}

export class UldUcmManagement extends BaseRequest {
  public flightId: any;
  public date: Date;

}


export class UldStatusFlag extends BaseRequest {
  public carrierCode: String;
  public cycleId: any;

}

export class UldUcmManagementRequest extends BaseRequest {
  flightId: any;
  date: Date;
  arrivalDate: Date;
  departureDate: Date;
  flightType: string;
  acRegistrtaion: string;
  ucmDate: Date;
  ucmSentBy: String;
  // IncomingCarrierUldList: Array<IncomingCarrierUld>;
  // IncomingForeignUldList: Array<IncomingForeignUld>;
  // OutgoingCarrierUldList: Array<OutgoingCarrierUld>;
  // OutgoingForeignUldList: Array<OutgoingForeignUld>;

}

// Request Model for retrieving Uld temparatire cool log List
export class UldTemperatureCoolRequest extends BaseRequest {
  ULDKey: String;
  TemperatureTypeValue: String;
}
@Model(UldTypes)
export class UldTypes extends BaseRequest {
  uldType: string = null;
}

@Model(UldAllotmentGroupModel)
export class UldAllotmentGroupModel extends BaseRequest {
  uldAllotmentGroupId: any = null;
  uldAllotmentId: any = null;
  uldAllotmentGroup: string = null;
  uldAllotmentGroupDescription: string = null;
  uldAllotmentGroupUldTypes: Array<String> = null;
  uldAllotmentGroupUldTypeList: string = null;

}

@Model(UldAllotmentListModel)
export class UldAllotmentListModel extends BaseRequest {
  uldAllotment_id: any = null;
  uldAllotment: string = null;
  uldAllotmentDescription: string = null;
  delete: any = null;
  edit: any = null;
  @IsArrayOf(UldAllotmentGroupModel)
  public uldAllotmentGroupList: Array<UldAllotmentGroupModel> = new Array<UldAllotmentGroupModel>();
}

@Model(UldAllotmentModel)
export class UldAllotmentModel extends BaseRequest {
  uldAllotment: string = null;
  @IsArrayOf(UldAllotmentListModel)
  public uldAllotmentList: Array<UldAllotmentListModel> = new Array<UldAllotmentListModel>();
}

export class templogRequest extends BaseRequest {
  public uldTemperatureLogId: String;
  public uldKey: string;
  public temperatureType: String;
  public temperatureTypeValue: any;
  public uldevent: any;
  public temperatureValue: any;
  public temperatureCaptureDt: any;
  public remarks: any;
  public cancel: any;
  public arr: templogRequest[];
}
export class MovementsUldEnquires extends BaseResponseData {
  uldTrolleyNumber: string;
  movementDateTime: any;
  movementType: string;
  movementDescription: string;
  flightKey: string;
  flightDate: any;
  segments: string;
  agent: string;
  conditionType: string;
  contentsCode: string;
  airportPosition: string;
  usedBy: string;
  remarks: string;
}
export class UldMovementHistory extends BaseResponseData {
  uldTrolleyNumber: string;
  uldFromDate: any;
  uldToDate: any;
  movmentTypeList: any;
}

export class SearchULDLSPform extends BaseRequest {
  public movableLocationType: String;
  public uldKey: string;
}

// export class IncomingCarrierUld extends BaseRequest {
//   uldNumber: string;
//   contentCode: string;
//   loadingAirport: String;
//   finalize: String;

// }
// export class IncomingForeignUld extends BaseRequest {
//   uldNumber: string;
//   contentCode: string;
//   loadingAirport: String;
//   finalize: String;
// }

// export class OutgoingCarrierUld extends BaseRequest {
//   uldNumber: string;
//   contentCode: string;
//   unloadingAirport: String;
//   finalize: String;
// }
// export class OutgoingForeignUld extends BaseRequest {
//   uldNumber: string;
//   contentCode: string;
//   unloadingAirport: String;
//   finalize: String;
// }

export class GlobalUldStockCheckRequest extends BaseRequest {
  carrier: String;
  station: String;
  uldType: String;
  minimumAllow: any;
  maximumAllow: any;
  totalUldCount: any;
  stdLimit: any;
}