import { BaseService, RestService, BaseRequest, BaseResponse, BaseResponseData, NgcUtility } from 'ngc-framework';

export class IncomingRequest extends BaseRequest {
    shipment: string;
    hawbNumber: string;
    status: string;
    shipmentType: string;
    uldnumber: string;
    shipmentNumber: string;
    inbFlightNumber: string;
    inboundDate: string;
    origin: string;
    destination: string;
    advicelocation: string;
    oubFlightNumber: string;
    originFlightNumber: string;
    inbFlightNo: string;
    oubFlightNo: string;
    inbFlightDate: string;
    oubFlightDate: string;
    originAirport: string;
    destinationAirport: string;
    checkInDateTime: string;
    checkOutdateTime: string;
    pieces: number;
    weight: number;
    natureOfGoods: string;
    outboundDate: string;
    shcList: Array<IncomingRequestSHC>;
    outboundFlights: string;
    remark: string;
    action: string;
    flagDelete: string;
    flagSaved: string;
    flagUpdate: string;
    flagInsert: string;
    checkInFlightDate: string;
}
export class IncomingRequestSHC extends BaseRequest {
    specialHandlingCode: string;
    shipmentMasterSHCId: number;
}

export class InboundResponse extends BaseRequest {
    shipmentNumber: string;
    uldnumber: string;
    inbFlightKey: string;
    oubFlightKey: string;
    sta: string;
    eta: string;
    bay: string;
    flightStatus: string;
    originAirport: string;
    pieces: string;
    weight: string;
    transferType: string;
    outboundFlight: string;
    consignee: string;
}


export class SearchShipment extends BaseRequest {
    dateTo: string;
    dateFrom: string;
    offPoint: string = NgcUtility.getTenantConfiguration().airportCode;
    carrierGroupCode: any;
    carrierCode: any;
    flightNo: any;
    flightDate: any;
    flightType: any;

}

export class SearchEnquireValShipment extends BaseRequest {
    importExportFlag: string;
    length: number;
    flightKey: string;
    checkInFlightDate: string;
    checkInDateTimeFrom: string;
    checkInDateTimeTo: string;
    checkOutDateTimeFrom: string;
    checkOutDateTimeTo: string;
    chackOutFlag: number;
}
export class SearchOutboundShipment extends BaseRequest {
    dateTo: string;
    dateFrom: string;

    //changes made for story JV01-404
    carrierGroupCode: string;
    carrierCode: string;
    flightNo: string;
    flightDate: string;
    flightType: string;

}
export class OutboundResponse extends BaseRequest {
    shipmentNumber: string;
    uLDNumber: string;
    origin: string;
    destination: string;
    pieces: string;
    weight: string;
    flightNumber: string;
    flightOriginDate: string;
    std: string;
    etd: string;
    parkingBay: string;
}

export class SearchInventory extends BaseRequest {
    carriedOnDateFrom: string;
    carriedOnDateTo: string;
}

export class ShipmentInventory extends BaseRequest {
    startedAt: string;
    completedAt: string;
    totalShipment: string;
    foundShipment: string;
    discrepency: boolean;
    checkDoneBy: string;
    inventoryCheckId: string;
    select: boolean;
    modifiedBy: string;
    modifiedOn: string;
}
export class FoundShipment extends BaseRequest {
    shipmentNumber: string;
    pieces: string;
    destination: string;
    serialN: number;

}
export class NotFoundShipment extends BaseRequest {
    shipmentNumber: string;
    uldNumber: string;
    bagNumber: string;
    checkInDate: string;
    checkInBy: string;
    addedBy: string;
    addedOn: string;
    pieces: string;
    destination: string;
    reason: string;
    check: boolean;

}

export class ShipmentInInventory extends BaseRequest {
    shipmentNumber: string;
    checkedInPieces: string;
    nventoryCheckPieces: string;
    destination: string;
    discrepency: string;
}
export class ShipmentInventoryDetails extends BaseRequest {
    shipmentInInventory: Array<ShipmentInInventory>
    notFoundShipment: Array<NotFoundShipment>
    foundShipmentArray: Array<FoundShipment>
}

export class HandoverShipment extends BaseRequest {
    startedAt: string;
    completedAt: string;
    handoverFromStaff: string;
    handoverToStaff: string;
    totalFoundShipment: string;
    remarks: string;
}
