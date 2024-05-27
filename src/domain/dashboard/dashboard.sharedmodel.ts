import { BaseRequest, BaseResponseData, BaseBO, Model, NotBlank, IsArrayOf, Min, ReactiveModel } from 'ngc-framework';

export class SlaDashboard extends BaseRequest {
    flightId: string;
    flightKey: string;
    flightTime: Date;
    flightDisplayTime: string;
    flightDelayDisplayTime: string;
    currentTime: Date;
    startTime: Date;
    endTime: Date;
    actualTime: Date;
    flightComplete: Date;
    flightType: string;
    dateSTA: Date;
    dateSTD: Date;
    dateATA: Date;
    dateATD: Date;
    delayFlag: boolean = false;

    //
    cargoEvents: CargoEvents[];
}

export class CargoEvents extends BaseRequest {
    slaEquation: string;
    slaColorCategory: string;
    slaEventMinutes: number;
    eventName: string
    eventTime: Date;
    slaTime: Date;
    eventColor: string;
    eventDisplayTime: string;
    slaDisplayTime: string;
    x: number;
    width: number;
}

export class SearchForMssDetails extends BaseRequest {
    sats: boolean;
    dnata: boolean;
    fromDate: string;
    toDate: string;
}

export class ResponseForMssDetails extends BaseRequest {
    elrUpliftInd: string;
    eagerLoadInd: string;
    paflightId: Number;
    paFlight: string;
    paFlightDate: string;
    paFlightSTDTime: string;
    allocation: string;
    totMailbag: Number;
    truckDocColorCode: string;
    infeedColorCode: string;
    manfColorCode: string;
    hndColorCode: string;
    ofdColorCode: string;
    releaseToDnata: string;
}

export class SearchForMssFlightDetails extends BaseRequest {
    paFlightKey: string;
    paFlightDate: string;
    paFlightId: Number;
    fromDate: string;
    toDate: String;
}

export class DispatchDetails extends BaseRequest {
    paFltId: Number;
    dispatchSeries: string
    dispatchNumber: string;
    recpID: string;
    aaScanDate: string;
    acpDateTime: string;
    haFlight: string;
    haFlightDate: string;
    OfdDate: string;
    Origin: string;
    destination: string;
    pieces: string;
    weight: string;
    mailType: string;
    truckDocColor: string;
    infeedColor: string;
    manifestColor: string;
    rampColor: string;
    offloadColor: string;
    mailBagDetails: Array<MailbagModel>;
}

export class MailbagModel extends BaseRequest {
    mailBagNumber: string;
    dispatchSeries: string;
    originCountry: string;
    originAirport: string;
    originQualifier: string;
    destinationCountry: string;
    destinationAirport: string;
    destinationQualifier: string;
    category: string;
    subCategory: string;
    year: string;
    dispatchNumber: string;
    receptableNumber: string;
    lastBagIndicator: string;
    registeredInsuredFlag: string;
    weight: string;
    truckDocColor: string;
    infeedColor: string;
    manifestColor: string;
    rampColor: string;
    offloadColor: string;
    flightOffPoint: string;
    outgoingCarrier: string;
    incomingCarrier: string;
    incomingCountry: string;
    incomingCity: string;
}
@Model(FlightDashboardList)
export class FlightDashboardList extends BaseRequest {
    flightKey: string;
    flightId: number;
    flightDate: Date;
    dateETD: Date;
    dateATD: Date;
    aircraftRegCode: string;
    aircraftType: string;
    flightType: string;
    totalAWBDocument: number;
    destination: string;
    cargoAcceptance: number;
    buLink: number;
    uldReady: number;
    uldHo: number;
    documentAcceptance: number;
    preManfiestDate: number;
    dlsFinalDateTime: string;
    flightStatusDescription: string;
    totalManifestWeight: string;
    manifestedFFMShipmentTotal: number;
    totalDocumentReceived: number;
    flightCustomSubmission: string;
    ccTotalShipment: number;
    towinRamp: string;
    firstULDcheckinTime: Date;
    lastULDcheckinTime: Date;
    manifestedIMRTotal: number;
    manifestedPRITotal: number;
    manifestedGENTotal: number;
    ecanTotalShipment: number;
    eicTotalUld: number;
    dateETA: Date;
    dateATA: Date;
    awbDocReceivedDisplayColor: string;
    buildUpShipmentDisplay: string;
}
export class SearchFlightDashboard extends BaseRequest {
    @IsArrayOf(FlightDashboardList)
    public importList: Array<FlightDashboardList> = new Array<FlightDashboardList>();
    public exportList: Array<FlightDashboardList> = new Array<FlightDashboardList>();
}