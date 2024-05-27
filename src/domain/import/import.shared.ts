import { ConnectingFlight } from './../export/export.sharedmodel';
import { BaseService, RestService, BaseRequest, BaseResponseData } from 'ngc-framework';

export class MaintainFwb extends BaseRequest {

}
export class ShipmentInfo extends BaseRequest {
    awbNumber: String;
    photoCopy: any;
    flight: any;
    message: String;
    flightDate: any;
    flagSaved: any;
    segment: any;
    flightKeyId: any;
    printerName: any;
    fltKey: any;
}

export class CargoPreAnnouncementRequest extends BaseRequest {
    flight: String;
    date: any;
    flightId: any;
    finalzeAndunFinalize: any;
    screenFunction: any;
    bulk: any;
    public cargoPreAnnouncementList: Array<CargoPreAnnouncement> = new Array<CargoPreAnnouncement>();
}
export class SearchInbound extends BaseRequest {
    workingShift: string;
    startsAt: string;
    endsAt: string;
    comTeamId: number;
    date: string;
    agent: string;
    flightKey: string;
}

export class EccInboundResult extends BaseRequest {
    workingShift: string;
    date: string;
    id: string;
    ic: any;
    eo: string;
    authorizeTo: Array<AuthorizeTo>;
    shipmentList: Array<ShipmentList>;
}

export class AuthorizeTo extends BaseRequest {
    authorize: string;
    userID: string;
}
export class ShipmentList extends BaseRequest {
    SNO: string;
    checkFlag: boolean;
    flightKey: string;
    flightDate: string;
    eta: string;
    sta: string;
    bay: string;
    agent: string;
    worksheetID: string;
    worksheetShipmentID: string;

}
export class ShipmentListDetails extends BaseRequest {
    pieces: string;
    weight: string;
    agent: string;
    uldnumber: string;
    awbnumber: string;
    loadingAdivce: string;
    shipmentNumber: string;
    shcList: Array<SpecialHandlingCode>;
    wareHouseLocation: string;
    deliveryLocation: string;
    status: string;
    remarks: string;
    eo: String;
    userCode: string;
    noShow: boolean;
}
export class SpecialHandlingCode extends BaseRequest {
    shc: string;
}

export class CargoPreAnnouncement extends BaseRequest {
    cargoPreAnnouncementId: String;
    uldNumber: String;
    incomingFlightId: String;
    uldBoardPoint: String;
    uldOffPoint: String;
    contentCode: String;
    uldStatus: String;
    transferType: String;
    uldLoadedWith: String;
    phcFlag: boolean;
    icsOutputLocation: String;
    handlingAreaCode: String;
    cargoTerminalCode: String;
    warehouseLocationCode: String;
    connectingFlightId: String;
    specialHandlingCode1: String;
    specialHandlingCode2: String;
    specialHandlingCode3: String;
    specialHandlingCode4: String;
    specialHandlingCode5: String;
    specialHandlingCode6: String;
    specialHandlingCode7: String;
    specialHandlingCode8: String;
    specialHandlingCode9: String;
    specialHandlingCodes: String;
    rampHandlingInstructions: String;
    warehouseHandlingInstructions: String;
    announcementSourceType: String;
    flight: String;
    date: any;
    manualFlag: String;
    flagInsert: String;
    bulk: boolean;
    handlingWerehouseValidation: boolean;
}


export class CargoPreAnnouncementGroup extends BaseRequest {
    public flightId: String;
    public flight: string;
    public date: String;
    public finalzeAndunFinalize: any;
    public screenFunction: any;
    public cargoPreAnnouncementList: Array<CargoPreAnnouncement> = new Array<CargoPreAnnouncement>();
}

export class BreakdownWorkingListModel extends BaseRequest {
    flightId: Number;
    flightNumber: String;
    flightDate: any;
    sta: any;
    ata: any;
    boardPoint: String;
    aircraftType: String;
    flightRemarks: String;
    status: String;
    ConnectingFlight: String;
    carrierCode: string;
    handlinginSystem: boolean;
    breakdownPending: boolean;
    // breakDownWorkingListShipmentResult: any;
    public breakDownWorkingListShipmentResult: Array<BreakDownWorkingListShipmentResult> = new Array<BreakDownWorkingListShipmentResult>();
    breakDownWorkingListSegment: any;
}
export class FWBRequest extends BaseRequest {
    awbNumber: string;
    nonIATA: boolean;
}
export class FetchRouting extends BaseRequest {
    carrierCode: string;
    airportCode: string;
    flightNumber: string;
    origin: string;
    flightDate: any;

}

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
export class MaintainFwbResponse extends BaseResponseData {
    public fwbDetails: Array<MaintainFwbResponse>;
}
export class MaintainFwbRequest extends BaseRequest {
    shipmentFreightWayBillId: any;
    awbPrefix: string;
    awbSuffix: string;
    natureOfGoodsDescription: string;
    awbDate: any;
    nonIATA: boolean;
    awbNumber: string;
    origin: string;
    destination: string;
    pieces: any;
    weightUnitCode: string;
    weight: any;
    volumeUnitCode: string;
    volumeAmount: any;
    densityIndicator: string;
    densityGroupCode: any;

    carriersExecutionDate: any;
    carriersExecutionPlace: string;
    carriersExecutionAuthSign: string;
    customOrigin: string;
    shpCertificateSign: string;
    messageSequence: any;
    messageVersion: any;

    messageProcessedDate: any;
    messageStatus: string;
    shcode: Array<SHC>;
    flightBooking: Array<FlightBooking>;
    routing: Array<Routing>;
    consigneeInfo: CustomerInfo;
    shipperInfo: CustomerInfo;
    alsoNotify: CustomerInfo;
    accountingInfo: Array<AccountingInfo>;
    chargeDeclaration: ChargeDeclaration;
    ssrOsiInfo: Array<SSROSIInfo>;
    agentInfo: AgentInfo;
    rateDescription: RateDescription;
    otherCharges: Array<OtherCharges>;
    ppd: PrepaidCollectChargeSummary;
    col: PrepaidCollectChargeSummary;
    //  PrepaidCollectChargeSummary ppdCol;
    // rateDescriptionOtherInfo: Array<RateDescOtherInfo>;
    shipmentReferenceInfor: ShpReferenceInformation;
    fwbNominatedHandlingParty: NominatedHandlingParty;
    otherParticipantInfo: Array<OtherParticipantInfo>;
    otherCustomsInfo: Array<OtherCustomsInfo>;
    ardAgentReference: string;

}

export class SenderReference extends BaseRequest {

}


export class FlightBooking extends BaseRequest {

}
export class SHC extends BaseRequest {

}
export class Routing extends BaseRequest {

}
export class CustomerInfo extends BaseRequest {

}
export class AccountingInfo extends BaseRequest {

}
export class ChargeDeclaration extends BaseRequest {

}
export class SSROSIInfo extends BaseRequest {

}
export class AgentInfo extends BaseRequest {

}
export class RateDescription extends BaseRequest {

}
export class OtherCharges extends BaseRequest {

}
// export class RateDescOtherInfo extends BaseRequest {

// }
export class ShpReferenceInformation extends BaseRequest {

}
export class NominatedHandlingParty extends BaseRequest {

}
export class OtherParticipantInfo extends BaseRequest {

}
export class OtherCustomsInfo extends BaseRequest {

}
export class ChargesDestinationCurrency extends BaseRequest {

}
export class PrepaidCollectChargeSummary extends BaseRequest {

}

export class InboundBreakdownModel extends BaseRequest {
    flightId: Number;
    flightNumber: String;
    flightDate: any;
    boardingPoint: string;
    hawbNumber: string;
    carrierCode: string;
    //added handlinginSystem
    handlinginSystem: boolean;
    shipment: InboundBreakdownShipmentModel = new InboundBreakdownShipmentModel();
    hawbInfo: InboundBreakdownHAWBModel = new InboundBreakdownHAWBModel();
}

export class InboundBreakdownHAWBModel extends BaseRequest {
    shipmentId: Number;
    shipmentType: string;
    shipmentHouseId: Number
    hawbNumber: string;
    hawbOrigin: string;
    hawbDestination: string;
    hawbPieces: Number;
    hawbWeight: Number;
    hawbChargebleWeight: Number;
    weightUnitCode: string;
    hawbNatureOfGoods: string;
    hawbManuallyCreated: boolean;
    hawbLocked: boolean;
    lockedReason: string;
    uldLoadCount: Number;
    public hawbShcs: Array<InboundBreakdownHAWBShcModel> = new Array<InboundBreakdownHAWBShcModel>();
}

export class InboundBreakdownHAWBShcModel extends BaseRequest {
    shipmentHouseId: Number;
    shipmentHouseShcId: number;
    specialHandlingCode: string;
}

export class InboundBreakdownShipmentModel extends BaseRequest {
    uldNumber: string;
    shipmentNumber: string;
    warehouseHandlingInstruction: string;
    transferType: string;
    handlingMode: string;
    shipmentType: string;
    manifestPieces: Number;
    manifestWeight: Number;
    handCarry: boolean;
    uldDamage: boolean;
    flightId: Number;
    shipmentVerificationId: Number;
    inboundBreakdownId: Number;
    id: Number;
    breakdownStaffGroup: string;
    breakDownStartDate: string;
    breakDownPieces: Number;
    breakDownWeight: Number;
    totalBreakDownPieces: Number;
    totalBreakDownWeight: Number;
    piece: Number;
    weight: Number;
    handOverWarning: boolean;
    natureOfGoodsDescription: string;
    origin: string;
    destination: string;
    preBookedPieces: boolean;
    irregularityPiecesFound: number;
    totalHousePieces: number;
    totalHouseWeight: number;
    totalHouseChargeableWeight: number;
    irregularityPiecesMissing: number;
    lastUpdatedTime: string;
    handledByDOMINT: string;
    handledByMasterHouse: string;
    public inventory: Array<InboundBreakdownShipmentInventoryModel> = new Array<InboundBreakdownShipmentInventoryModel>();
    public shcs: Array<InboundBreakdownShipmentShcModel> = new Array<InboundBreakdownShipmentShcModel>();
}

export class InboundBreakdownShipmentInventoryModel extends BaseRequest {
    inventoryId: Number;
    shipmentHouseAWBId: Number;
    chargeableWeight: Number;
    inboundBreakdownShipmentId: Number;
    shipmentId: Number;
    flightId: Number;
    shipmentLocation: string;
    warehouseLocation: string;
    pieces: Number;
    damagePieces: Number;
    weight: Number;
    chargebleWeight: Number;
    uldNumber: string;
    partSuffix: string;
    handlingMode: string;
    handlingArea: string;
    transferType: string;
    warehouseHandlingInstruction: string;
    impArrivalManifestULDId: Number;
    manifestPieces: number;
    manifestWeight: number;
    isDeliveryInitiated: number;
    deliveryOrderNo: number;
    deliveryRequestOrderNo: number;
    inboundFlightId: number;
    throughTransit: boolean;
    assignedUldTrolley: string;
    loaded: number;
    isGroupLocation: boolean = false;
    uldDamage: boolean;
    actualLoction: string;
    accessoryType: string;
    public shc: Array<InboundBreakdownShipmentShcModel> = new Array<InboundBreakdownShipmentShcModel>();
    public house: Array<InboundBreakdownShipmentHouseModel> = new Array<InboundBreakdownShipmentHouseModel>();
    public housewayBillInformation: Array<InboundBreakdownShipmentHouseModel> = new Array<InboundBreakdownShipmentHouseModel>();
}

export class InboundBreakdownShipmentShcModel extends BaseRequest {
    inboundBreakDownShipmentId: Number;
    shipmentInventoryId: Number;
    specialHandlingCode: string;
}

export class InboundBreakdownShipmentHouseModel extends BaseRequest {
    shipmentId: Number;
    shipmentInventoryId: Number;
    shipmentHouseId: Number;
    type: string;
    number: string;
    pieces: Number;
    weight: Number;
    originOfficeExchange: string;
    mailCategory: string;
    mailType: string;
    mailSubType: string;
    dispatchYear: Number;
    dispatchNumber: string;
    receptacleNumber: string;
    lastBag: boolean;
    registered: boolean;
    destinationOfficeExchange: string;
    nextDestination: string;
    transferCarrier: string;

    inboundBreakdownStorageInfoId: Number;
    houseNumber: string;
    hawbBDPcs: Number;
    hawbBDWt: Number;
    hawbRemarks: string;
    inventoryPieces: Number;
    inventoryWeight: Number;
}

export class DocumentVerificationGroup extends BaseRequest {
    public flightId: String;
    public flightNumber: String;
    public flightDate: String;
    public customsFlightNumber: String;
    public ata: String;
    public printerName: String;
    public printerForAT: String;
    public finalizeCheck: String;
    public documentVerificationShipmentModelList: Array<DocumentVerification>;
}

export class DocumentVerificationRequest extends BaseRequest {
    flightId: String;
    flightNumber: String;
    flightDate: any;
    flightSegmentId: any;
}

export class DocumentVerification extends BaseRequest {
    public selectCheck: boolean;
    public flightId: String;
    public boardPoint: String;
    public offPoint: String;
    public segOrign: String;
    public origin: String;
    public destination: String;
    public segDestination: String;
    public arrivalManifestbyId: String;
    public shipmentId: String;
    public shipmentNumber: String;
    public shipmentdate: String;
    public awbPieces: String;
    public awbWeight: String;
    public manifestPieces: String;
    public manifestWeight: String;
    private docRecieved: String;
    private copyAwb: String;
    private docPouch: String;
    private checkListRequired: String;
    public transferType: String;
    private locked;
    private lockedReason;
    //private FlightModel outboundFlight: String;
    public eAwb: String;
    public eaw: String;
    public eap: String;
    public fwb: String;
    public fhl: String;
    public natureOfGoods: String;
    //private List<SHCModel> shc: String;
    public irregularity: String;
    public irregularityPieces: String;
    public irregularityWeight: String;
    public barcode: String;
    public consignee: String;
    public appointedAgent: String;
    public noaSent: String;
    public chargesMode: String;
    public breakdownPieceCompleted: String;
    public breakdownPieces: String;
    public breakdownWeight: String;
    public readyfordelivery: String;
    public offloadedFlag: String;
    public offloadReasonCode: String;
    public remark: String;
    public remarkType: String;

}

export class BreakDownWorkingListShipmentResult extends BaseRequest {
    public shipmentNumber: String;
    public flightId: Number;
    public shipmentId: Number;
    public bdPieces: Number;
    public bdWeight: Number;
    public outgoingFlightid: Number;
    public shipmentdate: any;
    public destination: string;
    public isEAPExists: boolean;
    public isEAWExists: boolean;
    public specialHandlingCode: string;
    public origin: string;
    public mnPieces: string;
    public mnWeight: string;
}

export class addBagList extends BaseRequest {
    bagNumber: string;
    originOfficeExchange: string;
    destinationOfficeExchange: string;
    mailCategory: string;
    mailSubType: string;
    year: Number;
    dsn: string;
    rsn: string;
    lastBag: string;
    registered: boolean;
    weight: Number;
}

export class ImpAwbNotification extends BaseRequest {
    terminal: string;
    carrierGroup: string;
    contactMode: string;
    awbNumber: string;
    awbNotificationInfo: Array<ImpAwbNotificationInfo>;
    ivrsHistoryList: Array<History>;
    emailFlag: boolean;
    faxFlag: boolean;
    smsFlag: boolean;
    phoneFlag: boolean;

}

export class ImpAwbNotificationInfo extends BaseRequest {
    awbNumber: string;
    flightDate: string;
    eawb: string;
    cneAgt: string;
    readDelivery: string;
    primaryContact: string;
    contactInfo: ContactInfo = new ContactInfo();
    ivrs: ContactInfo = new ContactInfo();
    resend: string = "";
    history: string = "";

}
export class ContactInfo {
    email: string;
    fax: string;
    sms: string;
    telephone: string;
}
export class History {
    ivrsType: string;
    contactDetail: string;
    responseDateTime: string;
    responseMessage: string;
}

export class AWBReleaseSearch extends BaseRequest {
    warehouseterminal: string;
    customer: string;
    agentName: string;
    customerShortName: string;
    shipmentNumbers: Array<Awbnumber>;
}
export class Awbnumber extends BaseRequest {
    shipment: string;
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

export class DgdAWBNumber extends BaseRequest {
    shipmentNumber: string;
    dgdReferenceNo: number;
}


export class AwbPrintRequestList extends BaseRequest {
    awbNumbers: Array<string>;
    printerName: String;
    printerForAT: String;
    awbNumber: String;
    flightOffPoint: String;
    destination: String;
    carrierCode: String;
    shipmentId: String;

}
export class EliElmSavRequest extends BaseRequest {
    shipmentNumber: string;
    boardPoint: string;
    offPoint: string;
    eliElmFormDetails: any;
}

export class CustomsImportShipmentManualRequest extends BaseRequest {
    documentType: string;
    fromDate: string;
    toDate: string;
    shipmentNumber: string;
    hawbNumber: string;
    manualRequestId: any;
}