import { BaseService, RestService, BaseRequest, BaseResponse, BaseResponseData } from 'ngc-framework';


export class FlightRequest extends BaseRequest {
    flightId: string;
    carrierCode: string;
    flightNo: string;
    flightDate: string;
    flightKey: string;
    jointFlight: string;
    flgApn: string;
    assisted: string;
    flightLegs: FlightLegs[];
    flightSegments: FlightSegments[];
    flightFcts: FlightFcts[];
    flightExps: FlightExp[];
    flightExpULDTyps: FlightExp[];
    flightJoints: FlightJoints[];
    flightStatus: String;
    flgExpUld: String;
    flgExpWt: String;
    description: String;
    bookingStatus: String;
    inboundCancelReason: String;
    inboundCancelRemark: String;
    outboundCancelReason: String;
    outboundCancelRemark: String;
    inboundFlightAttributes: FlightAttributes;
    outboundFlightAttributes: FlightAttributes;
}

export class FlightAttributes extends BaseRequest {
    flightId: String;
    flightType: String;
    warehouseLevel: String;
    rho: String;
    arrDepStatus: String;
    weather: String;
    truckSeaCompany: String;
    companyServiceType: String;
    customsFlightNumber: String;
    customsFlightDate: String;
    gate: String;
    bubdOffice: String;
    printer: String;
    vesselId: String;
    vesselName: String;
    voyageNumber: String;
    delayCode: String;
}

export class FlightLegs extends BaseRequest {
    flightId: string;
    boardPointCode: string;
    offPointCode: string;
    legOrderCode: string;
    departureDate: string;
    arrivalDate: string;
    aircraftModel: string;
    codAirTypCar: string;
    datEtd: string;
    datEta: string;
    datAtd: string;
    datAta: string;
    domesticStatus: string;
    registration: string;
    createdUserCode: string;
    createdDateTime: string;
}

export class FlightSegments extends BaseRequest {
    flightId: string;
    codAptBrd: string;
    codAptOff: string;
    codSegOdr: string;
    flgNfl: string;
    flgTecStp: string;
    flgCargo: string;
    datStd: string;
    flgLeg: string;
    noMail: string;
    createdUserCode: string;
    createdDateTime: string;
}

export class FlightFcts extends BaseRequest {
    flightId: string;
    seqNo: string;
    remarks: string;
    createdUserCode: string;
    createdDateTime: string;
    flagDelete: string;
    flagSaved: string;
    flagUpdate: string;
    flagInsert: string;
}

export class FlightJoints extends BaseRequest {
    jointFlightCarCode: string;
    flightId: string;
    boardingPoint: string;
    departureDateTime: string;
    createdUserCode: string;
    createdDateTime: string;
}

export class FlightExp extends BaseRequest {
    flightId: string;
    departureDateTime: String;
    uldNo: String;
    uldWtReason: string;
    uldExpType: string;
    seqNo: string;
    createdUserCode: string;
    createdDateTime: string;
    exceptionType: string;
}

export class FlightResponse extends BaseResponseData {
    public carrierCode: string;
    public flightNo: string;
    public flightDate: string;
    public flightKey: String;
    public serviceType: String;
    public codAirPrkBay: String;
    public jointFlight: String;
    public codPrkBayDep: String;
    public codPrkBayArr: String;
    public operatingFlight: any;
    public flgExpWt: String;
    public flgExpUld: String;
    public bookingStatus: String;
    public data: any;
    igmAccessFlag: boolean;
    breakDownCompletedAt: boolean;
}

export class FlightEnroutementRequest extends BaseRequest {
    public carrierCode: string;
    public finalDestination: string;
    public restrictedcarrier: string;
}

export class GenerateOperativeFlightRQ extends BaseRequest {
    // {"flightCarrierCode": "SQ", "flightNumber": "1777", "dateFrom": "01AUG2017", "dateTo": "31AUG2017"}
    public flightSchedulePeriodID: number;
    public flightCarrierCode: string;
    public flightNumber: string;
    public dateFrom: string;
    public dateTo: string;
    public flight: string;
}

export class FlightEnroutementResponse extends BaseResponseData {
    public flightEnroutements: Array<FlightEnroutements>;
}
export class FlightEnroutements extends BaseResponseData {
    public carrierCode: string;
    public periodFrom: string;
    public periodTo: string;
    public via: string;
    public serviceType: string;
    public transfer: string;
    public boardPointCode: string;
    public finalDestination: string;
}
export class CodeShareFlightRequest extends BaseRequest {
    public operatingFlightNo: string;
    public shareFlightNo: string;
    public flightDate: string;
    public restrictedcarrier: string;
}

export class CodeShareFlightGroup extends BaseRequest {
    public codeShareFlightList: Array<CodeShareFlight>;
}

export class CodeShareFlightResponse extends BaseResponseData {
    public codeShareFlights: Array<CodeShareFlight>;
}



export class CodeShareFlight extends BaseRequest {
    public operatingFlightNo: string;
    public shareFlightNo: string;
    public flightFromDate: string;
    public flightToDate: string;
    public flagSaved: string;
    public flagUpdate: string;
    public flagInsert: string;
    public edit: string;
}

export class FlightScheduleRequest extends BaseRequest {
    carrierCode: string;
    fromDate: string;
    toDate: string;
    fromLocation: string;
    toLocation: string;
    flightNo: string;
    flightType: string;
    aircraftType: string;
    restrictedcarrier: string;
}

export class FlightScheduleResponseModel extends BaseResponseData {
    userID: string;
    createdUserId: string;
    modifiedUserId: string;
    weekFrequency: string;
    jointFrequency: string;
    departureTime: number;
    arrivalTime: number;
    svc: string;
    dayChange: number;
    carrierCode: string;
    flightNumber: string;
    dateFrom: string;
    dateTo: string;
    aircraftType: string;
}
export class FlightScheduleResponse extends BaseResponseData {
    public flightScheduleResponse: Array<FlightScheduleResponseModel>;
}

export class DisplayOperativeRequest extends BaseRequest {
    carrierCode: string;
    fromDate: string;
    toDate: string;
    fromSector: String;
    toSector: String;
    restrictedcarrier: string;

}
export class cancelOperativeFlight extends BaseRequest {
    cancelList: Array<any>;
}

export class DisplayOperativeModel extends BaseResponseData {
    flightKey: string;
    dateStd: string;
    dateSta: string;
    caoPax: string;
    flgApn: string;
    airCraft: String;

}

export class DisplayOperativeResponse extends BaseResponseData {
    public displayOperativeResponse: Array<DisplayOperativeModel>;

}

export class FlightEnroutementRequestList extends BaseRequest {
    public flightEnroutements: Array<FlightEnroutements>;
}

// <-- Details Schedule Starts Here-->
export class detailsScheduleRequest extends BaseRequest {
    public flightCarrierCode: string;
    public flightNumber: string;
    public dateFrom: string;
    public dateTo: string;
    public flight: string;
    public name: string;
    public apron: string;

}
export class detailsScheduleResponse extends BaseResponseData {
    public detailsSchedule: Array<displayDetailsSchedule>;
}
export class displayDetailsSchedule extends BaseResponseData {
    public aircraft: string;
    public boardPoint: string;
    public offPoint: string;
    public departureTime: string;
    public dayChangeArrival: string;
    public arrivalTime: string;
    public dayChangeDomestic: string;
    public dometicLeg: string;
}

export class CopyDetailsscheduleComponent extends BaseRequest {

    dateFrom: string;
    dateTo: string;
    flightCarrierCode: string;
    flightNumber: string;


}
//split
export class SpiltDetailsscheduleComponent extends BaseRequest {
    dateFrom: string;
    dateTo: string;
    splitDateTo: string;
    splitDateFrom: string;
    flightCarrierCode: string;
    flightNumber: string;
    flightSchedulePeriodID: number;
    groundHandler: string;
    apron: number;
}
//fetchSchedulesAndDetails
export class FlightSchedules extends BaseRequest {
    carrierCode: string;
    flightNumber: string;
}

export class createOperativeFlightRQ extends BaseRequest {
    createList: Array<any>;
}

export class createOperativeFlightRS extends BaseResponseData {
}

export class GenerateOperativeFlightsRQ extends BaseResponseData {
    data: Array<OperativeFlight>;
    confirmMessage: boolean;
    messageList: Array<any>;
    success: boolean;
}

export class UfisFlightRequest extends BaseRequest {
    public flightNo: string;
}

export class UfisFlightGroup extends BaseRequest {
    public ufisFlightList: Array<UfisFlight>;
}

export class UfisFlightResponse extends BaseResponseData {
    public ufisFlights: Array<UfisFlight>;
}

export class UfisFlight extends BaseRequest {
    public ufisFlightId: string;
    public cosysFlightNo: string;
    public ufisFlightNo: string;
    public flightFromDate: string;
    public flightToDate: string;
    public flagSaved: string;
    public flagUpdate: string;
    public flagInsert: string;
}
export class OperativeFlightLeg {
    public flightId: number;
    public aircraftModel: string;
    public aircraftType: string;
    public arrivalDate: string;
    public arrivalTime: string;
    public boardPointCode: string;
    public cargoVolume: string;
    public cargoWeight: string;
    public carrierCode: string;
    public codAirTypCar: string;
    public codTypFltSvc: string;
    public codVolUnt: string;
    public codWgtUnt: string;
    public departureDate: string;
    public departureTime: string;
    public flagDelete: string;
    public flagInsert: string;
    public flagSaved: string;
    public flagUpdate: string;
    public flgDly: string;
    public flightDate: string;
    public flightNo: string;
    public legOrderCode: string;
    public mailVolume: string;
    public mailWeight: string;
    public maxHalfPallets: string;
    public offPointCode: string;
    public createdBy: string;
    public createdUserCode: string;
    public createdDateTime: Date;
    public domesticStatus: string;
    public handledInSystem: boolean;


    constructor(flightId: number, aircraftModel: string,
        aircraftType: string,
        arrivalDate: string,
        arrivalTime: string,
        boardPointCode: string,
        cargoVolume: string,
        cargoWeight: string,
        carrierCode: string,
        codAirTypCar: string,
        codTypFltSvc: string,
        codVolUnt: string,
        codWgtUnt: string,
        departureDate: string,
        departureTime: string,
        flagDelete: string,
        flagInsert: string,
        flagSaved: string,
        flagUpdate: string,
        flgDly: string,
        flightDate: string,
        flightNo: string,
        legOrderCode: string,
        mailVolume: string,
        mailWeight: string,
        maxHalfPallets: string,
        offPointCode: string,
        domesticStatus: string,
        handledInSystem: boolean) {
        this.flightId = flightId;
        this.aircraftModel = aircraftModel;
        this.aircraftType = aircraftType;
        this.arrivalDate = arrivalDate;
        this.arrivalTime = arrivalTime;
        this.boardPointCode = boardPointCode;
        this.cargoVolume = cargoVolume;
        this.cargoWeight = cargoWeight;
        this.carrierCode = carrierCode;
        this.codAirTypCar = codAirTypCar;
        this.codTypFltSvc = codTypFltSvc;
        this.codVolUnt = codVolUnt;
        this.codWgtUnt = codWgtUnt;
        this.departureDate = departureDate;
        this.departureTime = departureTime;
        this.flagDelete = flagDelete;
        this.flagInsert = flagInsert;
        this.flagSaved = flagSaved;
        this.flagUpdate = flagUpdate;
        this.flgDly = flgDly;
        this.flightDate = flightDate;
        this.flightNo = flightNo;
        this.legOrderCode = legOrderCode;
        this.mailVolume = mailVolume;
        this.mailWeight = mailWeight;
        this.maxHalfPallets = maxHalfPallets;
        this.offPointCode = offPointCode;
        this.createdUserCode = 'SYSADMIN';
        this.createdBy = 'SYSADMIN';
        this.createdDateTime = new Date();
        this.domesticStatus = domesticStatus;
        this.handledInSystem = handledInSystem;
    }
}
export class OperativeFlight {
    public check: boolean;
    public flightId: number;
    public flightKey: string;
    public groundHandlerCode: string;
    public carrierCode: string;
    public cancellation: string;
    public flagDelete: string;
    public flagInsert: string;
    public flagSaved: string;
    public flagUpdate: string;
    public flgDlsCtl: string;
    public flgKvl: string;
    public flgManCtlv: string;
    public flgRes: string;
    public flgSvcFinOut: string;
    public flightDate: Date;
    public routing: string;
    public flightNo: string;
    public flightSegments: any;
    public jointFlight: string;
    public status: any;
    public createdBy: string;
    public createdUserCode: string;
    public createdDateTime: Date;
    public serviceType: string;
    public flightLegs: Array<OperativeFlightLeg>;
    public flightFcts: any;
    public flightJoints: any;
    public flgApn: any;
    public caoPax: any;
    public inboundFlightAttributes: any;
    public outboundFlightAttributes: any;

    constructor(check: boolean, flightKey: string, serviceType: string,
        flightId: number,
        groundHandlerCode: string,
        carrierCode: string,
        cancellation: string,
        flagDelete: string,
        flagInsert: string,
        flagSaved: string,
        flagUpdate: string,
        flgDlsCtl: string,
        flgKvl: string,
        flgManCtlv: string,
        flgRes: string,
        flgSvcFinOut: string,
        flightDate: Date,
        routing: string,
        flightNo: string,
        flightSegments: string,
        jointFlight: string,
        status: boolean,
        flightLegs: Array<OperativeFlightLeg>,
        flightFcts: any,
        flightJoints: any,
        flgApn: any,
        caoPax: any,
        inboundFlightAttributes: any,
        outboundFlightAttributes: any) {
        this.serviceType = serviceType;
        this.check = check;
        this.flightId = flightId;
        this.flightKey = flightKey;
        this.groundHandlerCode = groundHandlerCode;
        this.carrierCode = carrierCode;
        this.cancellation = cancellation;
        this.flagDelete = flagDelete;
        this.flagInsert = flagInsert;
        this.flagSaved = flagSaved;
        this.flagUpdate = flagUpdate;
        this.flgDlsCtl = flgDlsCtl;
        this.flgKvl = flgKvl;
        this.flgManCtlv = flgManCtlv;
        this.flgRes = flgRes;
        this.flgSvcFinOut = flgSvcFinOut;
        this.flightDate = flightDate;
        this.routing = routing;
        this.flightNo = flightNo;
        this.flightSegments = flightSegments;
        this.jointFlight = jointFlight;
        this.status = status;
        this.flightLegs = flightLegs;
        this.createdBy = 'SYSADMIN'
        this.createdUserCode = 'SYSADMIN';
        this.createdDateTime = new Date();
        this.flightFcts = flightFcts;
        this.flightJoints = flightJoints;
        this.flgApn = flgApn;
        this.caoPax = caoPax;
        this.inboundFlightAttributes = inboundFlightAttributes;
        this.outboundFlightAttributes = outboundFlightAttributes;
    }


}

export class maintainFlightScheduleRQ extends BaseRequest {
    flightSchedulePeriodID: number;
    flightCarrierCode: String;
    flightNumber: String;
    dateFrom: String;
    dateTo: String;
    flightName: String;
    flight: String;
    apron: boolean;
    groundHandler: String;
    public createdBy: string = 'SYSAdmin';
    schFlightList: Array<any>;
}
export class maintainFlightScheduleRS {

    data: Array<any>;
    messageList: Array<any>;
    success: boolean;
    confirmMessage: boolean;
}


export class SpecialenroutementRequest extends BaseRequest {
    public carrierCode: string;
    public finalDestination: string;
    public via: string;
    public serviceType: string;
    public periodFrom: string;
    public periodTo: string;
    public transfer: string;
    public restrictedcarrier: string;

}


export class Specialenroutement extends BaseRequest {
    public enroutementId: string;
    public carrierCode: string;
    public finalDestination: string;
    public via: string;
    public serviceType: string;
    public periodFrom: string;
    public periodTo: string;
    public transfer: string;
    public flagSaved: string;
    public flagUpdate: string;
    public flagInsert: string;
    public restrictedcarrier: string;
}


export class SpecialenroutementFlightGroup extends BaseRequest {
    public specialEnroutementList: Array<Specialenroutement>;
}

export class SpecialenroutementRequestList extends BaseRequest {
    public flightEnroutements: Array<Specialenroutement>;

}


export class SpecialenroutementResponse extends BaseResponseData {
    public SpecialenroutementFlights: Array<Specialenroutement>;
}

export class FindSchedule extends BaseRequest {

    public apron: String;
    public dateFrom: String;
    public dateTo: String;
    public flight: String;
    public flightCarrierCode: String;
    public flightName: String;
    public flightNumber: String;
    public flightSchedulePeriodID: String;
    public groundHandler: String;
    public copyFlag: boolean;
    public createdBy: string = "SYSAdmin";

}

export class SearchCANReport extends BaseRequest {
    public canNumber: String;
    public exportImport: String;
    public flight: String;
    public date: String;
}

export class SearchCANReportDetail extends BaseRequest {
    public fltConfirmationAdviceNoticeReportId: string;
    public canNumber: String;
    public operatorName: String;
    public exportImport: String;
    public flight: String;
    public date: string;
    public origin: string;
    public destination: string;
    public senderName: string;
    public status: string;
}

export class CreateCANReports extends BaseRequest {
    private fltConfirmationAdviceNoticeReportId: string;
    private receiverdetail1: string;
    private receiverdetail2: string;
    private receiverdetail3: string;
    private email: string;
    private senderName: string;
    private currentdate: string;
    private canNumber: string;
    private exportImport: string;
    private operatorName: string;
    private flight: string;
    private aircrafttype: string;
    private aircraftregistration: string;
    private origindestination: string;
    private arrival: string;
    private departure: string;
    private status: string;
    private serviceprovided: Array<ServicesProvided>;
}

export class ServicesProvided extends BaseRequest {
    public fltConfirmationAdviceNoticeReportId: string;
    public service: string;
    public servicedetails: string;
}

export class MaintainWeatherRequest extends BaseRequest {
    flightType: string;
    carrier: string;
    flightNumber: string;
    fromDate: Date;
    toDate: Date;
    weather: string;
}





