import {
    BaseService, RestService, BaseRequest, BaseResponseData,
    Model, IsArrayOf, NotBlank
} from 'ngc-framework';

export class CustomFlightScheduleRequestModel extends BaseRequest {
    importExportIndicator: string;
    flightOriginDate: Date;
    carrier: string;
    numberOfFlights: string;
    mrsSentFlag: string;
    fmaReceivedFlag: string;
    withCargoFlag: string;
    directShpCneShipmentFlag: string;
    directShpCneShipmentWithPermitFlag: string;
}
export class FlightModel extends BaseRequest {
    flightKey: string;
    flightDate: Date;
    exportOrImport: string;
    withCargoFlag: string;
    flightNumber: string;
    carrier: string;
    curruentpage: any;
    mrsSentFlag: any;
    fmaReceivedFlag: any;
    directShpCneShipment: any;
    directShpCneShipmentWithPermit: any;
}


@Model('CustomsHouseSearchModel')
export class CustomsHouseSearchModel extends BaseRequest {
    awbNumber: string = null;
    hawbNumber: string = null;
    flightId: Number = null;
    awbDate: string = null;
    flightKey: string = null;
    flightDate: string = null;
}



@Model('CustomsSpecialHandlingCodeModel')
export class CustomsSpecialHandlingCodeModel extends BaseRequest {
    houseId: number = null;
    id: number = null;
    code: string = null;
}

@Model('CustomsHarmonisedCommodityCode')
export class CustomsHarmonisedCommodityCode extends BaseRequest {
    houseId: number = null;
    id: number = null;
    code: string = null;
}

@Model('CustomsOtherCustomerInformation')
export class CustomsOtherCustomerInformation extends BaseRequest {
    houseId: number = null;
    id: number = null;
    countryCode: string = null;
    identifier: string = null;
    csrcIdentifier: string = null;
    scsrcInformation: string = null;
}

@Model('CustomsChargeDeclarationModel')
export class CustomsChargeDeclarationModel extends BaseRequest {
    houseId: number = null;
    id: number = null;
    currencyCode: string = null;
    wtValCharge: string = null;
    otherCharge: string = null;
    carriageValue: string = null;
    customValue: string = null;
    insuranceValue: string = null;
    remark: string = null;
}

@Model('CustomsFreeTextModel')
export class CustomsFreeTextModel extends BaseRequest {
    houseId: number = null;
    id: number = null;
    content: string = null;
}

@Model('CustomsCustomerModel')
export class CustomsCustomerModel extends BaseRequest {
    houseId: number = null;
    id: number = null;
    code: string = null;
    name: string = null;
    address: CustomsCustomerAddressModel = new CustomsCustomerAddressModel();
}



@Model('CustomsCustomerContactModel')
export class CustomsCustomerContactModel extends BaseRequest {
    houseCustomerAddressId: number = null;
    id: number = null;
    type: string = null;
    detail: string = null;
}

@Model('CustomsDocumentModel')
export class CustomsDocumentModel extends BaseRequest {
    houseId: number = null;
    id: number = null;
    type: string = null;
    detail: string = null;
}

@Model('CustomsCustomerAddressModel')
export class CustomsCustomerAddressModel extends BaseRequest {
    houseId: number = null;
    houseCustomerId: number = null;
    id: number = null;
    streetAddress: string = null;
    city: string = null;
    country: string = null;
    place: string = null;
    state: string = null;
    postal: number = null;
    @IsArrayOf(CustomsCustomerContactModel)
    contacts: Array<CustomsCustomerContactModel> = new Array<CustomsCustomerContactModel>();
}

@Model('CustomsHouseModel')
export class CustomsHouseModel extends BaseRequest {
    masterAwbId: any = null;
    id: number = null;
    @NotBlank()
    awbNumber: string = null;
    awbDate: Date = null;
    @NotBlank()
    hawbNumber: string = null;
    @NotBlank()
    pieces: number = null;
    @NotBlank()
    weight: DoubleRange = null;
    @NotBlank()
    origin: string = null;
    @NotBlank()
    destination: string = null;
    @NotBlank()
    natureOfGoods: string = null;

    @IsArrayOf(CustomsSpecialHandlingCodeModel)
    shc: Array<CustomsSpecialHandlingCodeModel> = new Array<CustomsSpecialHandlingCodeModel>();

    @NotBlank()
    weightUnitCode: string = null;
    slac: string = null;

    @IsArrayOf(CustomsHarmonisedCommodityCode)
    harmonizedCommodityCode: Array<CustomsHarmonisedCommodityCode> = new Array<CustomsHarmonisedCommodityCode>();

    inputtedBy: string = null;
    source: string = null;
    amendmentDate: Date = null;

    shipper: CustomsCustomerModel = new CustomsCustomerModel();
    consignee: CustomsCustomerModel = new CustomsCustomerModel();
    notifyParty: CustomsCustomerModel = new CustomsCustomerModel();

    @IsArrayOf(CustomsDocumentModel)
    license: Array<CustomsDocumentModel> = new Array<CustomsDocumentModel>();

    @IsArrayOf(CustomsDocumentModel)
    permit: Array<CustomsDocumentModel> = new Array<CustomsDocumentModel>();

    charges: CustomsChargeDeclarationModel = new CustomsChargeDeclarationModel();

    @IsArrayOf(CustomsFreeTextModel)
    freeTexts: Array<CustomsFreeTextModel> = new Array<CustomsFreeTextModel>();

    @IsArrayOf(CustomsOtherCustomerInformation)
    otherCustomerInformation: Array<CustomsOtherCustomerInformation> = new Array<CustomsOtherCustomerInformation>();

    latestCCFlightKey: string = null;
    latestCCFlightDate: Date = null;
    latestCC: string = null;
    distinguishingMark: string = null;
    masterAWBStatus: string = null;
}

@Model('CustomsMaintainHouseListModel')
export class CustomsMaintainHouseListModel extends BaseRequest {
    awbNumber: string;
    awbDate: Date;
    flightKey: string;
    flightDate: Date;
    flightATA: string;
    hawbCount: number;
    awbPieces: number;
    awbWeight: DoubleRange;
    manifestedPieces: number;
    manifestWeight: DoubleRange;
    fhlPieces: number;
    fhlweight: DoubleRange;
    status: string;
    @IsArrayOf(CustomsHouseModel)
    houseList: Array<CustomsHouseModel> = new Array<CustomsHouseModel>();
}


export class CustomFlightScheduleResponseModel extends BaseRequest {
    flight: string;
    mRSCompletedDate: Date;
    mrssentDate: any;
    withCargoFlag: string;
    localShipmentCount: number;
    transitShipmentCount: number;
    flightCancelFlag: string;
    fmaacknowledgeDate: any;
    fnaacknowledgeDate: any;
}

export class AddFlightModel extends BaseRequest {
    flightNumberCount: number;
    flightData: any;
}


export class customMrs extends BaseRequest {
    //    public mstAssignTeamToGroupId: number;
    public flightDate: any;
    public flightKey: any;
    public shipmentDate: any;
    public exportOrImport: any;
    public customsFlightId: any;
    public shipmentNumber: any;
    public pieces: any;
    public weight: any;
    public shipmentPiece: any;
    public shipmentWeight: any;
    public shipmentId: any;
    public natureOfGoodsDescription: any;
    public origin: any;
    public destination: any;
    public appointedAgent: any;
    public customerName: any;
    public streetAddress: any;
    public place: any;
    public postal: any;
    public stateCode: any;
    public countryCode: any;
    public remarks: any;
    public license: any;
    public flag: any;
    public doNumber: any;
    public addOrUpdate: any;
    public mrsStatusCode: any;
    public localAuthorityDetail: Array<any>;
    customerList: Array<any>;
}

export class customerList extends BaseRequest {
    public customerType: any;
    public appointedAgent: any;
    public customerName: any;
    public streetAddress: any;
    public postal: any;
    public stateCode: any;
    public countryCode: any;
}

export class localAuthorityDetail extends BaseRequest {
    public referenceNumber: any;
    public appointedAgent: any;
    public license: any;
    public remarks: any;
}

export class customMRSMOdel extends BaseRequest {
    //    public mstAssignTeamToGroupId: number;
    public flightDate: any;
    public flightKey: any;
    public exportOrImport: any;
    public shipmentNumber: any;
    public shipmentstatus: any;
    public mrsSequenceNo: any;
    public acknowledgeCode: any;
    public acknowledgeDate: any;
    public openMrs: any;
    public customsFlightId: any;
    public mrssentby: any;
    public mrsModel: Array<any>;
}

export class mrsModel extends BaseRequest {
    public select: any;
    public sno: any;
    public shipmentNumber: any;
    public type: any;
    public natureOfGoods: any;
    public origin: any;
    public destination: any;
    //  agent:new NgcFormControl(),
    public shipmentPiece: any;
    public shipmentWeight: any;
    public totalPiece: any;
    public totalWeight: any;
    public cmdReceived: any;
    public mrsStatusCode: any;
    public shipmentstatus: any;
    public flightDate: any;
    public flightKey: any;
    public exportOrImport: any;
    public customShipmentCustomerInfoId: any;
    public customShipmentLocalAuthorityRequirementId: any;
    public customShipmentInfoId: any;
}
export class cmdModel extends BaseRequest {
    public flightdate: any;
    public flightKey: any;
    public shipmentNumber: any;
    public hawbNnumber: any;
    public cmdCount: any;
    public customsFlightId: any;
    public cmdlist: Array<any>;
}
export class cmdlist extends BaseRequest {
    public dateCmdRecieved: any;
    public shipmentPieces: any;
    public shipmentWeight: any;
    public shipmentNog: any;
    public hwbNumber: any;
    public hwbPieces: any;
    public hwbWeight: any;
    public hwbNog: any;
    public exemptionReason: any;
    public larType: any;
    public AgentIaNumber: any;
    public senderCompany: any;
    public customsFlightId: any;
}

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
    handlingAgent: any;
    relIndicator: any;
    shipmentList: any;
    shipmentDate: any;
    customFlightId: any;
    flightId: any;
    manifestPieces: any;
    manifestWeight: any;
    hawbPiecesWeight: any;
    natureOfGoods: any;
    flightATA: any;
    // shipper: any;
    // consignee: CustomsMaintainAccsCustomerAddress = new CustomsMaintainAccsCustomerAddress();
}

export class brkdwnDiscModel extends BaseRequest {
    flightNo: string;
    flightDate: Date;
    fltOriginDate: Date;
    flightId: any;
    flightBoardPoint: any;
    flightType: any;
    FltCarrierCode: any;
    customsFlightId: any;
    brkdwnDiscVerNo: any;
    shipmentList: any;
    startDate: Date;
    endDate: Date;
}

@Model('DutiableDetails')
export class DutiableDetails extends BaseRequest {
    dcCode: string = null;
    dcQty: number = null;
    string = null;
    dcPieces: number = null;
    customDutiableCommodityId: number = null;
    dcRemarks: string = null;
}

@Model('DcPermit')
export class DcPermit extends BaseRequest {
    permitNo: string = null;
    customDutiableCommodityId: number = null;
}

@Model('CreateAmendDcDetails')
export class CreateAmendDcDetails extends BaseRequest {
    shipmentType: string;
    flightDate: Date;
    flightNo: string;
    awbNumber: string;
    hawbNumber: string;
    datEtd: Date;
    datAta: Date;
    dateSTD: Date;
    dateSTA: Date;
    origin: string;
    destination: string;
    noOfPermits: any;
    dcType: string;
    dcContent: string;
    @IsArrayOf(DutiableDetails)
    duitableList: Array<DutiableDetails> = new Array<DutiableDetails>();
    @IsArrayOf(DcPermit)
    permitNo: Array<DcPermit> = new Array<DcPermit>();
    @IsArrayOf(CreateAmendDcDetails)
    HawbList: Array<CreateAmendDcDetails> = new Array<CreateAmendDcDetails>();
    shipmentId: any;
    dcPieces: any;
    dcQty: any;
    dcRemarks: any;
    dcCode: string;
    customDutiableCommodityId: any;
    content: string;
}
