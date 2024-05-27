import { BaseRequest, Model, IsArrayOf } from 'ngc-framework';
import { Environment } from '../../../environments/environment'
export class ThroughTransitWorkingAdviceModel extends BaseRequest {
    flightType = null;
    shift = null;
    adviceDate = null;
    flightPairSequence = null;
    outboundFlight = null;
    outboundFlightDate = null;
    destination = null;
    transThroughTransitWorkingAdviceId = null;
    transTTWAConnectingFlightId = null;
    transTTWAOutboundFlightId = null;
    inboundFlight = null;
    outBoundFlightId = null;
    inBoundFlightId = null;
    inboundFlightDate = null;
    origin = null;
    adviceSentFlag = null;
    adviceSentDate = null;
    adviceSentBy = null;
    updatedAdviceSentFlag = null;
    updatedAdviceSentDate = null;
    updatedAdviceSentBy = null;
    adviceReSentFlag = null;
    adviceReSentDate = null;
    adviceReSentBy = null;
    connectingFlights: Array<any> = new Array<any>();
    fromAddress: string;
    toAddress: any;
    searchTime: any;
    carrierCode = null;
    carrierGroupCode = null;
}
// export class ThroughTransitWorkingAdviceConnectingFlightModel extends BaseRequest {
//     private BigInteger id;

//     private boolean select = Boolean.FALSE;

//     private BigInteger referenceId;

//     private BigInteger flightPairSequence;

//     private BigInteger transTTWAOutboundFlightId;

//     private BigInteger transTTWAConnectingFlightId;

//     private BigInteger transThroughTransitWorkingAdviceId;

//     private BigInteger outBoundFlightId;

//     private Boolean errorFlag = Boolean.FALSE;

//     private BigInteger inBoundFlightId;

//     @CheckAirportCodeConstraint
//     private string origin;

//     @NotBlank(message = "Required")
//     private string inboundFlight;

//     @NotNull(message = "Required")
//     @JsonSerialize(using = LocalDateSerializer.class)
//     private LocalDate inboundFlightDate;

//     @NgenCosysAppAnnotation
//     @Valid
//     private List<ThroughTransitWorkingAdviceUldModel> uldWithShipments;

//     @NgenCosysAppAnnotation
//     @Valid
//     private List<ThroughTransitWorkingAdviceShipmentModel> bulkShipments;

//     private string inboundOutboundFlight;
//     private string originDestination;
// }


export class Message extends BaseRequest {
    flightType = null;
    shift = null;
    adviceDate = null;

    tenantId = null;

    flightKey = null;
    flightDate = null;

}

export class TransferShipment {
    transferType: string;
    number: number;
}

export class ShipmentInformation {
    public select: boolean = false;
    public shipmentNumber: number;
    public origin: string;
    public destination: string;
    public concatSHC: string;
    public natureOfGoods: string;
    public pieces: number;
    public weight: number;
    public handlingInstructions: string;
    public transferType: string;
    public fwb: string;
    public fhl: string;
    public rct: string;
    public dls: string;
    public ali: string;
    public loadingInstructionTransitUse: string;
    public uldKey: string;
    public contourCode: string;
    public weightUld: number;
    public weightUnitCode: string;
    public shc: string;
    public assigned: boolean;
    public intact: boolean;
    public flightKey: string;
    public airport: string;
    public flightId: number;
    public standardEstimatedDateTime: Date = new Date();
    public terminal: string = Environment.defaultTerminal;
    public loadedShipmentInfoId: number = null;
    public warehouseLocation: string;
    public specialHandlingCod: string;
    public bookingStatusCode: string;
    public totalWeight: number = null;
    public partSuffix: string;
    public loadedUld: string;
    public mixLoadStatus: boolean = false;
    public sqCarrier: boolean = false;

}

@Model()
export class SHC {
    terminal: string = Environment.defaultTerminal;
    code: string = null;
    transTTWAConnectingFlightULDId: number = null;
}

@Model()
export class UldInformation extends BaseRequest {
    transTTWAConnectingFlightULDId: number = null;
    uldKey: string = null;
    contourCode: string = null;
    weightUld: number = null;
    weightUnitCode: string = null;
    shc: string = null;
    assigned: boolean = null;
    intact: boolean = null;
    mixLoad: any = null;
    terminal: string = Environment.defaultTerminal;
    warehouseLocation: string = null;
    sqCarrier: boolean;
    @IsArrayOf(ShipmentInformation)
    shipmentList: Array<ShipmentInformation> = new Array<ShipmentInformation>();
    @IsArrayOf(SHC)
    shcs: Array<SHC> = new Array<SHC>();
    shcList: Array<any> = new Array<any>();
    icsULDcount: boolean;
    partSuffix: string
}


@Model()
export class TranshipmentWorkingListModel extends BaseRequest {
    public transTTWAFlightId: number;
    public flightKey: string = null;
    public date: Date = new Date();
    public airport: string = null;
    public flightId: number;
    public flightSegmentId: number;
    public standardEstimatedDateTime: Date = new Date();
    public etaWithDate: string = null;

    public etd: Date = new Date();
    public std: Date = new Date();
    public acRegistration: string = null;
    public sta: Date = new Date();
    public eta: Date = new Date();
    sqCarrier: boolean;
    // public boardPoint: string;
    // public destination: string;
    public transmitType: string = null;
    public finalze = false;
    public transferType: string = null;
    public transferTypeList: Array<string>;
    public allotment: string = null;
    public notifyParty: string = null;
    public timeDifference: string = null;
    public segment: string = null;
    public loadingInstruction: string = null;
    public terminal: string = Environment.defaultTerminal;
    private isFinalized: boolean;
    @IsArrayOf(TranshipmentWorkingListModel)
    public flightList: Array<TranshipmentWorkingListModel> = new Array<TranshipmentWorkingListModel>();
    @IsArrayOf(UldInformation)
    public uldInformationList: Array<UldInformation> = new Array<UldInformation>();
    public shipmentList: Array<any> = new Array<any>();
    @IsArrayOf(TransferShipment)
    public transferTypeShipments: Array<TransferShipment> = new Array<TransferShipment>();
    public aircraftType: string;
    public flightType: string;
    public carrierCode: string;
    public ackInfo: boolean;
    // For Select Check
    public select: boolean = false;


}

@Model()
export class TranshipmentHandlingSummaryModel {
    public by: string = null;
    public dateTimeFrom: Date = new Date();
    public dateTimeTo: Date = new Date();
    public carrierGroup: string = null;
    public carrier: string = null;
    public transferType: string = null;
    public transferTypeList: Array<string> = new Array<string>();
    public flightKey: string = null;
    public flightDate: Date = null;
    public st: boolean = false;
    public tt: boolean = false;
    public otherType: boolean = false;
    public shcByPurpose: string = null;
    public terminal: string = Environment.defaultTerminal;
    public outboundFlightKey: string = null;
    public outboundFlightDate: Date = null;
    public outboundCarrier: string = null;
    public terminalRequest: string = null;

    @IsArrayOf(TranshipmentWorkingListModel)
    public flightList: Array<TranshipmentWorkingListModel> = new Array<TranshipmentWorkingListModel>();
    @IsArrayOf(ShipmentInformation)
    shipmentList: Array<ShipmentInformation> = new Array<ShipmentInformation>();
    // public outboundFlightList: Array<TranshipmentWorkingListModel> = new Array<TranshipmentWorkingListModel>();
}


export class TranshipmentHandlingSummaryRequest extends BaseRequest {
    public by: string;
    public dateTimeFrom: Date;
    public dateTimeTo: Date;
    public shcByPurpose: string;
    public flightKey: string;
    public flightDate: string;
    public carrierGroup: string;
    public carrier: string;
    public terminal: string = Environment.defaultTerminal;
    public transferType: string = null;
    public transferTypeList: Array<string> = new Array<string>();
    public st: boolean = false;
    public tt: boolean = false;
    public otherType: boolean = false;
    public outboundFlightKey: string;
    public outboundFlightDate: string;
    public outboundCarrier: string
    public terminalRequest: string;
}

export class GetOutgoingTransshipmentFlightsRequest extends BaseRequest {
    public flightId: number;
    public transferType: string;
    public transferTypeList: Array<string> = new Array<string>();
    public terminal: string = Environment.defaultTerminal;
}

export class FinalizeAndUnfinalizeTranshipmentRequest extends BaseRequest {
    public flightId: number = null;
}


export class AwbPrintRequestList extends BaseRequest {
    awbNumbers: Array<string>;
    printerName: String;

    awbNumber: String;
    flightOffPoint: String;
    destination: String;
    carrierCode: String;
    shipmentId: number;

}

export class InboundFlightTranshimentListShipmentBookedModel extends BaseRequest {
    id: String = null;
    inboundFlightTranshipmentListShipmentId: String = null;
    flightId: String = null;
    flightSegmentId: String = null;
    flightKe: String = null;
    unloadingPoint: String = null;
    flightDate: String = null;
    pieces: String = null;
    weight: String = null;
}

@Model()
export class InboundFlightTranshimentListShipmentConnectingFlightModel extends BaseRequest {
    // Attribute to differentiate key column id
    id: String = null;
    inboundFlightTranshipmentListShipmentId: String = null;
    flightId: String = null;
    flightSegmentId: String = null;
    flightKey: String = null;
    transferType: String = null;
    flightDate: String = null;
    pieces: String = null;
    weight: String = null;
    timeDiff: String = null;
    segment: String = null;
    bookingAllowed: boolean = false;
}

@Model()
export class InboundFlightTranshipmentListShipmentModel extends BaseRequest {

    id: String = null;
    inboundFlightTranshipmentListUldId: String = null;
    shipmentNumber: String = null;
    clearanceCode: String = null;
    origin: String = null;
    destination: String = null;
    shc: String = null;
    shipmentDate: String = null;
    pieces: String = null;
    weight: String = null;
    constraintCode: String = null;
    sequence: Number = null
    @IsArrayOf(InboundFlightTranshimentListShipmentConnectingFlightModel)
    connectingFlightInfo: Array<InboundFlightTranshimentListShipmentConnectingFlightModel> = new Array<InboundFlightTranshimentListShipmentConnectingFlightModel>();
    @IsArrayOf(InboundFlightTranshimentListShipmentBookedModel)
    bookingInfo: Array<InboundFlightTranshimentListShipmentBookedModel> = new Array<InboundFlightTranshimentListShipmentBookedModel>();


}

@Model()
export class InboundFlightTranshipmentListUldModel extends BaseRequest {

    uldKey: String = null;
    @IsArrayOf(InboundFlightTranshipmentListShipmentModel)
    shipmentInfo: Array<InboundFlightTranshipmentListShipmentModel> = new Array<InboundFlightTranshipmentListShipmentModel>();




}
@Model()
export class InboundFlightTranshipmentList extends BaseRequest {

    flightKey: String = null;
    flightDate: Date = null;
    sta: String = null;
    ata: String = null;
    eta: String = null;
    anyErrors: Boolean = false;
    @IsArrayOf(InboundFlightTranshipmentListUldModel)
    uldInfo: Array<InboundFlightTranshipmentListUldModel> = new Array<InboundFlightTranshipmentListUldModel>();

}

@Model()
export class InboundFlightTranshipmentListRequest extends BaseRequest {
    flightKey: string = null;
    flightDate: string = null;
}




