import { BaseRequest, BaseResponseData, BaseBO } from 'ngc-framework';

export class FlightSearchQuery extends BaseRequest {
    fromDate: string;
    toDate: string;
    flightKey: string;
    flightDate: string;
    expressService: string;
}

export class ShipmentData extends BaseRequest {
    shipmentId: string;
    shipmentNumber: string;
    carrierCode: string;
    shipmentDate: Date;
    documentPieces: string;
    documentWeight: string;
    outgoingFlightNumber: string;
    departureDateTime: Date;
    flightOffPoint: string;
    parkingBayDepAircraft: string;
    customerCode: string;
    specialHandlingCode: string;
    uldNumber: string;
    acceptedPieces: string;
    acceptedWeight: string;
    shcHandlingGroupCode: string;
    expressService: string;
    labelPrintedBy: string;
    labelPrintedAt: string;
    shipmentStatus: string;
    noShowFlag: boolean;
    noShowMarkedBy: string;
    noShowMarkedAt: string;
    planningAdviceId: string;
    flightOriginDate: Date;
    flightKey: string;
    advice: string;
    fromEcc: string;
    std: Date;
    checker: string;
    groupField: string;
    groupOffPoint: string;
    outboundAircraftRegNo: string;
}
export class Worksheet extends BaseRequest {
    flight: string;
    std: Date;
    off: string;
    bay: string;
    acc: string;
    details: string;
}
export class Advice extends BaseRequest {
    planningAdviceId: string;
    advice: string;
    flightId: string;
    worksheetId: string;
    flightOriginDate: string;
    flightKey: string;
    plannedDate: Date;
    plannedShiftStartTime: string;
    plannedShiftEndTime: string;
    offPoint: string;
    customerCode: string;
    shipmentCount: Number;
}

export class EccExportAwbDetails extends BaseRequest {
    awbNo: string;
    fwbpcs: number;
    fwbwgt: number;
    rdy: string;
    fwb: string;
    fwbrq: string;
    rcar: string;
    svcNo: string;
    scind: string;
    rfidTag: string;
    fwbDisc: string;
    manDisc: string;
}

export class DeleteShipmentData extends BaseRequest {
    shipmentId: string;
    planningAdviceId: string;
    shimentNumber: string;
    shipmentNumber: string;
}

export class ShipmentDataNoFlight extends BaseRequest {
    shipmentId: string;
    shipmentNumber: string;
    carrierCode: string;
    shipmentDate: Date;
    documentPieces: string;
    documentWeight: string;
    outgoingFlightNumber: string;
    departureDateTime: Date;
    flightOffPoint: string;
    parkingBayDepAircraft: string;
    customerCode: string;
    specialHandlingCode: string;
    uldNumber: string;
    acceptedPieces: string;
    acceptedWeight: string;
    shcHandlingGroupCode: string;
    expressService: string;
    labelPrintedBy: string;
    labelPrintedAt: string;
    shipmentStatus: string;
    noShowFlag: boolean;
    noShowMarkedBy: string;
    noShowMarkedAt: string;
    planningAdviceId: string;
    flightOriginDate: Date;
    flightKey: string;
    advice: string;
    fromEcc: string;
    std: Date;
    checker: string;
    groupField: string;
    flightId: string;
    worksheetId: string;
    plannedDate: Date;
    plannedShiftStartTime: string;
    plannedShiftEndTime: string;
    offPoint: string;
}

