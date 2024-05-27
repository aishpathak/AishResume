import { BaseRequest,Model,IsArrayOf } from 'ngc-framework';
import { BaseResponseData, BaseBO } from 'ngc-framework';
import { Flight, SHCModel } from './../export.sharedmodel';

export class DLSSegment extends BaseRequest {
    flightId: string = null;
    segmentId: string = null;
    segmentName: string = null;
    uldList: Array<DLSULD> = null;
    trollyList: Array<DLSULD> = null;
}

export class DLS extends BaseRequest {
    dlsId: any = null;
    flightId: any = null;
    uldTrolleyList: Array<DLSULD> = null;
    trolleyList: Array<DLSULD> = null;
    osiList: Array<DLSOsi> = new Array<DLSOsi>();
    systemOsiList: Array<DLSOsi> = null;
    flightKey: any = null;
    flightOriginDate: any = null;
    ackInfo: any = null;
    ackForeignUld: any = null;
    flightSegmentId: any = null;
    flightOffPoint: any = null;
    uwsSegWeightList: Array<UwsMsg> = new Array<UwsMsg>();
    totalFlightBookingWeight: any = null;
}

export class BuildUpMailSearch extends BaseRequest {
    flightId: number;
    flightKey: string;
    flightOriginDate: string;
    segmentId: number;
    uldNumber: string;
    flightOffPoint: string;
    mailBagNumber: any;
    mailbagId: Array<any>;
    shipmentType: string;
    dlsCompleted: boolean;
    mailIndicator: string;
    carrierCode: string;
    dispatchList: any;
}


export class DLSULD extends BaseRequest {
    select = false;
    dlsId: any = null;// DLSId
    uldTrolleyNumber: any = null;// ULDNumber
    trolleyInd = false;
    estimatedWeight: any = null;
    tareWeight: any = null;
    dryIceWeight: any = null;
    actualWeight: any = null;
    priorityOfLoading: any = null;
    contentCode: any = null;
    heightCode: any = null;
    transferType: any = null;
    usedForPerishableContainer: any = false;
    usedForExpressCourierContainer: any = null;
    usedForTransitUse: any = false;
    usedAsTrolley: any = null;
    usedAsStandBy: any = null;
    loadingControlAdviceId: any = null;
    plannedFlightId: any = null;
    remarks: any = null;
    flightSegmentId: any = null;
    piggyback = false;
    actualGrossWeight: any = null;
    netWeight: any = null;
    autoWeight: any = null;
    weightDifference: any = null;
    rampHandover: any = null;
    accessory: any = null;
    flightId: any = null;
    flightKey: any = null;
    flightOriginDate: any = null;
    createdBy = 'SYSADMIN';
    selectAllpiggyback = false;
    selectAllAccessory = false;
    bupUnitType = null;
    tagUnitType = null;
    handlingCode = null;
    overhangingInd = null;
    manual = false;
    routeList: Array<DLSNFMRoute> = null;
    shcs: Array<SHC> = null;
    accessoryList: Array<DLSAccessory> = null;
    piggyBackUldList: Array<DLSPiggyBackInfo> = null;
    manifestWeight = null;
    icsGrossWeight = null;
    icsULD = false;
    handlingArea = null;
    flightOffPoint: any = null;
    carrierCode: any;
}

export class SearchUpdateDLS extends BaseRequest {
    flightId: number;
    flightKey: string;
    flightOriginDate: string;
    aircraftRegistration: string;
    std: string;
    etd: string;
    status: string;
    ali: Array<any>;
    flightSegmentId: any;
    flightOffPoint: string;
    pwgInd: boolean;
}

export class SHC extends BaseRequest {
    dlsId: any = null;
    specialHandlingCode: any = null;
    createdBy = 'SYSADMIN';
    dlsSHCId: any = null;
}

export class DLSAccessory extends BaseRequest {
    dlsId: any = null;
    type: any = null;
    select = false;
    transactionSequenceNo: any = null;
    dlsULDTrolleyAccessoryInfoId: any = null;
    accessoryTypeId: any = null;
    accessoryPartId: any = null;
    createdBy = 'SYSADMIN';
    quantity: any = null;
}

export class DLSPiggyBackInfo extends BaseRequest {
    dlsId: any = null;
    select: boolean = null;
    serialNumber: number = null;
    uldNumber: any = null;
    createdBy = 'SYSADMIN';
    dlsUldTrolleyPiggyBackId: any = null;
}

export class OffloadModel extends BaseRequest {
    flight: Flight = null;
    shipmentList: Array<String>;
    segments: Array<OffloadSegment> = null;
    offloadSegments: Array<OffloadSegment> = null;
    expPreOffloadULDInfoId: number;
    expPreOffloadShipmentInfoId: number;
    removedShipment: OffloadShipment;
    shipmentId: number;
    uldList: any;
}

export class OffloadSegment extends BaseRequest {
    flight: Flight = null;
    segmentId: number;
    boardPoint: string;
    offPoint: string;
    uldList: Array<OffloadULD> = null;
}

export class OffloadULD extends BaseRequest {
    flightId: number;
    driverId: any;
    flightKey: any;
    flightOriginDate: any;
    flightSegmentId: number;
    segment: any;
    assUldTrolleyId: number;
    uldNumber: string;
    reason: string;
    numberOfAWB: number;
    pieces: number;
    weight: number;
    shipments: Array<OffloadShipment> = null;
    shcs: Array<string> = null;
    fromOffloadHandover: any;
    flagForGettingFlightDetails: any;
    rampFlag: any;
    heightCode: string;
    dlsVersion: number;
    actualWeight: number;
    trolleyInd: boolean;
}

export class DLSFlight extends BaseRequest {
    flightId;
    flightKey;
    flightOriginDate;
    aircraftRegistration;
    std;
    etd;
    status;
    dls: DLS;
    flagError;
    dlsId;
    segment: Array<DLSSegment>;
    aliTotal: Array<any>;
    aliRemain: Array<any>;
    uldTrolleyList: Array<any>;
    finalizeStatus: boolean;
    dlsversion;
    flightType;
    aircraftType;
    carrierCode;
    ackForPriorityShc: any = null;
    ackForLastPrintedUldDgShcMissedInDLS;
}
export class OffloadShipment extends BaseRequest {
    loadedShipmentInfoId: number;
    shipmentId: number;
    awbNumber: String;
    partFlag: boolean = null;
    origin: string;
    destination: string;
    pieces: number;
    weight: number;
    natureOfGoods: string;
    preoffloadLocations: Array<OffloadShipmentInventory>;
    shc: Array<SHCModel> = null;
    shipmentNumber: string;
    //for audit trial 
    assignedUldTrolley: any;
    offloadWeight: number;
    offloadPieces: number;
    warehouselocations: string;
    offloadLocation: string;
    reason: string;
    offloadLocations: string;
    manifestedWeight: number;
    manifestedPieces: number;
    transferType: any;
    shcs: any;
    expPreOffloadULDInfoId: number;
    expPreOffloadShipmentInfoId: number;
    expPreOffloadShipmentInventoryInfoId: number;
    warehouseLocation: string;
    dipSvcSTATS: string;
    piecesList: Array<OffloadShipmentInventory> = new Array<OffloadShipmentInventory>();
    offloadLocationsList: Array<OffloadShipmentInventory> = new Array<OffloadShipmentInventory>()
    totaloffloadpieces: number;
    totaloffloadweight: number;
    actualLocation: string;
}

export class OffloadInventory extends BaseRequest {
    warehouseLocation: string;
    piece: number;
    weight: number;
}

export class OffloadShipmentInventory extends BaseRequest {
    expPreOffloadShipmentInfoId: number;
    loadedShipmentInfoId: number;
    assUldTrolleyId: number;
    offloadPieces: number;
    offloadWeight: number;
    offloadLocation: string;
    origin: string;
    destination: string;
    warehouseLocation: string;
    partSuffix: string;
    dipSvcSTATS: string;
    shipmentNumber: string;
    inventoryShc: any;
    uldNumber: String;
    awbNumber: String;
    warehouselocation: String;
    expPreOffloadShipmentInventoryInfoId: number;
    totaloffloadpieces: number;
    totaloffloadweight: number;
    expPreOffloadULDInfoId: number;
    shipmentId: number;
    actualLocation: string;
}

export class SummaryModel extends BaseRequest {
    warehouselocation: string;
    offloadLocation: string;
    awbNumber: string;
    uldNumber: string;
    origin: string;
    destination: string;
    terminal: any;
    manifestedPieces: number;
    manifestedWeight: number;
    offloadPieces: number;
    offloadWeight: number;
    tt: any;
    shc: string;
    natureOfGoods: string;
    expPreOffloadULDInfoId: number;
    expPreOffloadShipmentInfoId: number;
    source: any;
    reason: string;
    heightCode: string;
    dlsversion: number;
    actualWeight: number;
    shipmentId: number;
    actualLocation: string;
    select: boolean = false;
}


export class DLSOsi extends BaseRequest {
    flagCRUD = 'C';
    dlsId: any = null;
    transactionSequenceNo: any = null;
    dlsULDTrolleyOsiId: any = null;
    detail: any = null;
    manual = 1;
    series = null;
    rampIndicate = null;
    createdBy = '';
    createdOn = '';
}

export class DLSNFMRoute extends BaseRequest {
    serialNumber = null;
    dlsUldTrolleyId = null;
    airportCode = null;
    dlsNFMRouteId = null;
}

export class ExpHandover extends BaseRequest {

    exphandoverid: any;

    dlsUldTrolleyId: any;

    flightid: any;

    flightKey: any;

    handedoverat: any;

    tractornumber: any;

    handedoverby: any;

    startedat: any;

    completedat: any;

    /**
     * Id of the trip of the HandOver Uld trolley
     */
    tripid: any;

    /**
     * Location of the ULD Trolley
     */
    releaselocation: any;
    /**
     * Instance of Hand-over Container Trolley Info
     */
    //  List<ExpHandoverContainerTrolleyInfo> handOverContainerTrolley;
}

export class ExpHandoverContainerTrolleyInfo extends BaseRequest {

}

export class OffloadHandoverModel extends BaseRequest {
    wareFlight: Array<OffloadWarehouseFlight> = null;
    fromOffloadHandOverFlag: any;
    checkForTrolley: any;
    printerName: any;
    isWarehouse: any;
}

export class OffloadWarehouseFlight extends BaseRequest {
    flightId: number;
    expCheckInId: number;
    handUlds: Array<OffloadHandoverULD> = null;
    flightKey: any;
    flightDate: any;
    checkForTrolley: any;
    uldNumber: any;
    bay: any;
    noOfBags: any;
    ocs: any;
    handCarry: any;
}

export class OffloadHandoverULD extends BaseRequest {
    expcheckInId: number;
    expCheckInCTIId: number;
    reason: string;
    handedOverBy: string;
    handedOverAt: string;
    handedOverTime: any;
    uldNumber: string;
    handCarry: any;
    returnInd: any;
    offloadInd: any;
    flightId: number;
    flightKey: string;
    flightDate: string;
    std: any;
    shc: string;
    handlingArea: string;
    driverId: string;
    showDateFlag: any;
    noOfBags: any;
    ocs: any;

}

export class OffloadHandoverFormULD extends BaseRequest {
    reason: string;
    flightId: number;
    handCarry: any;
    shc: string;
    flightKey: string;
    flightDate: string;
    std: any;
    uldNumber: string;
    handlingArea: string;
    checkForTrolley: any;
    etd: any;
    reasonForReturn: any;
    bay: any;
    showDateFlag: any;
    etdWithoutDate: any;
    noOfBags: any;
    ocs: any;

}


export class SpecialShipmentRequest extends BaseRequest {
    terminal: string;
    flight: string;
    from: string;
    to: string;
    shipmentType: string;
    excludeSHC: string;
    shc: Array<string>;
    carrier: string;

}
export class SpecialShipmentFlight extends BaseRequest {
    eta: string;
    sta: string;
    ata: string;
    etd: string;
    std: string;
    atd: string;
    weight: number;
    flight: string;
    pieces: number;
    shipmentType: string;
    outgoingFlight: string;
    outgoingPieces: number;
    outgoingWeight: number
}
export class SpecialShipment extends BaseRequest {
    shipmentNumber: string;
    awbPieces: string;
    awbWeight: string;
    destination: string;
    origin: string;
    rfid: string;
    dwellTime: string;
    readtToLoad: string;
    tranferType: string;
    shipmentShc: string;
    incommingFlights: Array<SpecialShipmentFlight>;
    outgoingFlights: Array<SpecialShipmentFlight>;
}

//Outgoing flights
export class OutgoingFlightRequest extends BaseRequest {
    requestTerminal: string;
    dateTimeFrom: any;
    dateTimeTo: any;
    carrierGroup: string;
    carrierCode: string;
    requestFlight: string;
    flightType: string;
    offPoint: string;
    flightKey: string;
    flightOriginDate: any;
}
export class OutgoingFlights extends BaseRequest {
    terminal: string;
    flight: string;
    DateATDstd: any;
    DateETD: any;
    DateSTD: any;
    aircraft: string;
    aircraftRegistration: string;
    bay: string;
    routing: string;
    dls: string;
    dlsPrecisionTime: string;
    flightClosePrecisionTime: string;
    man: any;
    dep: string;
    ofld: string;
    remark: string;
}

export class OutwardServiceReportSearchRequest extends BaseRequest {
    flightKey: string;
    date: any;
}

export class OutwardServiceReportSearchResponse {
    flightKey: string;
    date: any;
    flightId: number;
    segment: string;
    std: any;
    etd: any;
    flightComplete: boolean;
    manifest: boolean;
    warehouse: boolean;
    documentDiscrepancies: any;
    freightDiscrepancies: any;
    offloadingDiscrepancies: any;
    otherDiscrepancies: any;
    damageReport: any;
    finalize: boolean;
    expOutwardServiceReportId: number;
    warehouseLastUpdatedBy: any;
}

export class OutwardServiceReportInsertRequest extends BaseRequest {
    flightKey: string;
    date: any;
    flightId: number;
    flightSegmentId: string;
    std: any;
    etd: any;
    manifest: boolean;
    warehouse: boolean;
    manifestLastUpdatedBy: string;
    warehouseLastUpdatedBy: string;
    warehouseNewDataFlag: boolean;
    documentCheckedBy: any;
    cargoCheckedBy: any;
    manifestingOA: any;
    loadControlCO: string;
    exportWarehouseOA: any;
    cargoPreCheckedBy: any;
    exportWarehouseCO: string;
    documentDiscrepancies: any;
    freightDiscrepancies: any;
    offloadingDiscrepancies: any;
    otherDiscrepancies;
    damageReport: any;
    expOutwardServiceReportId: number;

}

export class FinalizeFlagDataOutwardServiceReport extends BaseRequest {
    finalize: boolean;
    flightKey: any;
    date: any;
    expOutwardServiceReportId: number;
    flightId: number;
}

export class SearchForLyingList extends BaseRequest {
    carriercode: string;
    origin: string;
    destination: string;
    nextDestination: string;
    uldOrTrolley: string;
    flightKey: string;
    flightDate: string;
    dnCompSearch: string;
    dnNumber: string;
}

export class LyingListContainer extends BaseRequest {
    shipmentId: Number;
    storeLocation: string;
    warehouseLocation: string;
    locationType: string;
    destinationResp: string;
    pieces: Number;
    weights: string;
    bookingFlight: string;
    flightDate: string;
    intact: boolean;
    selectParent: boolean;
    lyingListShipment: Array<LyingListShipment>;
}

export class LyingListShipment extends BaseRequest {
    shipmentId: Number;
    shpInventoryId: Number;
    inventoryFlightId: Number;
    shipmentHouseId: Number;
    dispatchNumber: Number;
    mailBagNumber: string;
    piecesDetail: Number;
    piecesInv: Number;
    weightDetail: string;
    mailType: string;
    org: string;
    dest: string;
    nextDest: string;
    dnCompflag: boolean;
    dnComp: string;
    bookingFlightDetail: string;
    bookedFlightDateDetail: string;
    remarks: string;
    storeLocation: string;
    warehouseLocation: string;
}

export class FlightCompleteSearch extends BaseRequest {
    flightKey: any = null;
    flightOriginDate: any = null;
    std: any = null;
    etd: any = null;
    status: any = null;
    delayFlag: any = null;
    fwbDiscrepancyCount: any = null;
    fhlDiscrepancyCount: any = null;
    noOfConsolShipments: any = null;
    noOfConsolShipmentsWithFHL: any = null;
    noOfConsolShipmentsWithoutFHL: any = null;
    flightCompleteList: Array<FlightComplete>;
}
export class FlightComplete extends BaseRequest {
    customOut: any = null;
    fwbFlag: any = null;
    shipmentNumber: any = null;
    origin: any = null;
    destination: any = null;
    shcCodes: any = null;
    shcs: any = null;
    natureOfGoods: any = null;
    shipmentPieces: any = null;
    shipmentWeight: any = null;
}
export class MessageHandlingDefinitionByCustomerModel extends BaseRequest {
    messageHandlingDefinition: Array<MessageHandlingDefinitionModel>;
}
export class MessageHandlingDefinitionModel extends BaseRequest {
    messageType: any = null;
}
export class FlightCompleteResendModel extends BaseRequest {
    flightId: any = null;
}
export class SearchFlightList extends BaseRequest {
    terminalPoint: string;
    dateFrom: string;
    dateTo: string;
    userId: string;
    userName: string;
    carrierCode: any;
    carrierGroup: any;
    offPoint: any;
    flightKey: any;
    flightType: any;

}

export class SearchMyFlightList extends BaseRequest {
    terminalPoint: string;
    dateFrom: string;
    value: string;
    userId: string;
    userName: string;
    flight: string;
    flightListData: SearchFlightList;
}


export class FlightListResponse extends BaseRequest {
    flight: string;
    terminalPoint: string;
    bay: string;
    dls: boolean;
    sta: string;
    osi: Array<String>;
    date: string;
}

export class FlightListModel extends BaseRequest {
    userId: string;
    flightList: Array<FlightListResponse>
}

export class FlightMail extends BaseRequest {
    flightId: string;
    flightKey: string;
    flightOriginDate: string;
    carrierCode: string;
    flightType: string;
}


//dashboard

export class FlightInfo extends BaseRequest {
    carrierCode: any;
    flightKey: any;
    flightDate: any;
    eventNotificationId: any;
    eventNotificationByFlightId: any;
    fromDate: any;
    toDate: any;
    carrierGroup: any;
    requestTerminal: any;
    rampCheckInCompleted: any;
    documentVerificationCompleted: any;
    breakdownCompleted: any;
    flightCompleted: any;
    manfiestCompYesNo: any;
    dlsFinalizedYesNo: any;
    rampCompYesNo: any;
    flightCompYesNo: any;
    ucmSentYesNo: any;
    shcGroup: any;
}


export class DBoardBatchLog extends BaseRequest {
    dashboardBatchLogId: any;
}

export class UwsMsg extends BaseRequest {
    flightSegmentId: any;
    flightOffPoint: any;
    totalSegWeight: any;
    estimatedBookedSegWeight: any;
    dLSEstimatedWeightBySegmentId: any;

}
export class WeightLoadStatement extends BaseRequest {
    flightId: number;
    flightKey: string;
    flightOriginDate: string;
    aircraftRegistration: string;
    std: string;
    etd: string;
    status: string;
    ali: Array<any>;
    flightSegmentId: any;
    flightOffPoint: string;
    pwgInd: boolean;
}

export class WeightLoadStmtFlight extends BaseRequest {
    flightId;
    flightKey;
    flightOriginDate;
    aircraftRegistration;
    std;
    etd;
    status;
    weightLoadStatementULDTrolleyList: Array<WlsDLSULDTrolley>;
    flagError;
    dlsId;
    segment: Array<DLSSegment>;
    aliTotal: Array<any>;
    aliRemain: Array<any>;
    uldTrolleyList: Array<any>;
    flightType;
    aircraftType;
    carrierCode;
    ackForPriorityShc: any = null;
    ackForLastPrintedUldDgShcMissedInDLS;
    flightSegmentId;
    flightOffPoint;
    preparedBy;
	telephoneNo;
	checkedBy;
	remarks;
    wlsFinalizeDate;
	wlsStatus;
	wlsCompletedBy;
    finalize;
}

export class WlsDLSULDTrolley extends DLSULD {
    deck: any;
    position: any;
}

export enum WeightLoadStmtEnums {
	PRELOAD = "Pre-Load",
	FINALLOAD = "Final Load"
}

//Request Dollies/BT - Begin
@Model(RequestDolliesBTLogInfoModel)
export class RequestDolliesBTLogInfoModel extends BaseRequest{
    expRequestDolliesBTLogId : number = null;
	expRequestDolliesBTId : number = null;
    notificationSentOn : Date = null;
    notificationSequenceNo : number = null;
    eventDescription : string = null;
    dolliesRequested20Ft : number = null;
    dolliesReceived20Ft : number = null;
    dolliesRequested10Ft : number = null;
    dolliesReceived10Ft : number = null;
    dolliesRequested5Ft : number = null;
    dolliesReceived5Ft : number = null;
    btRequested : number = null;
    btReceived : number = null;
    remarks : string = null;
}

@Model(FlightDetailsModel)
export class FlightDetailsModel extends BaseRequest{
    flightKey : string = null;
    flightDate : Date = null;
}

@Model(RequestDolliesBTInfoModel)
export class RequestDolliesBTInfoModel extends BaseRequest{
    select : boolean = false;
    expRequestDolliesBTId : number = null;
    expRequestDolliesBTRequestedId : number = null;
    expRequestDolliesBTReceivedId : number = null;
    expRequestDolliesBTFlightId : number = null;
    requestNo: string = null;
	customerId: number = null;
    @IsArrayOf(FlightDetailsModel)
	flightDetails: Array<FlightDetailsModel> = [new FlightDetailsModel(),new FlightDetailsModel(),new FlightDetailsModel()];
	dolliesRequested20Ft: number = null;
	dolliesReceived20Ft: number = null;
	dolliesRequested10Ft: number = null;
	dolliesReceived10Ft: number = null;
	dolliesRequested5Ft: number = null;
	dolliesReceived5Ft: number = null;
	btRequested: number = null;
	btReceived: number = null;
	remarks: string = null;
    lastNotificationSeqNo: number = null;
    firstNftTime : Date = null;
    seconfNftTime : Date = null;
    thirdNftTime : Date = null;
	confirmed: boolean = null;
    confirmedBy: string = null;
	confirmationOn: Date = null; 
    lastUpdatedUserCode: string = null;
    @IsArrayOf(RequestDolliesBTLogInfoModel)
    requestDolliesBTLogInfo: Array<RequestDolliesBTLogInfoModel> = new Array<RequestDolliesBTLogInfoModel>();
}

@Model(RequestDolliesBTModel)
export class RequestDolliesBTModel extends BaseRequest {
    requestedDateTimeFrom : Date = null;
    requestedDateTimeTo : Date = null;
	customerId : number = null;
	flightKey : string = null;
	flightDate : Date = null;
	requestNo : string = null;
    totalNoDolliesRequested20Ft : number = null;
	totalNoDolliesReceived20Ft : number = null;
	totalNoDolliesRequested10Ft : number = null;
	totalNoDolliesReceived10Ft : number = null;
	totalNoDolliesRequested5Ft : number = null;
	totalNoDolliesReceived5Ft : number = null;
	totalNoBTRequested : number = null;
	totalNoBTReceived : number = null;
	@IsArrayOf(RequestDolliesBTInfoModel)
    requestDolliesBTInfo: Array<RequestDolliesBTInfoModel> = new Array<RequestDolliesBTInfoModel>();
}
//Request Dollies BT/End
