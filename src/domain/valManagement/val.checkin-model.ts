import { BaseService, RestService, BaseRequest, BaseResponse, BaseResponseData } from 'ngc-framework';

export class CheckInShipmentModel extends BaseRequest {
    shipmentType: string;
    shipmentNumber: string;
    hawbNumber: string;
    flightKey: string;
    inbFlightNumber: string;
    checkInFlightDate: string;
    flightDate: string;
    originAirport: string;
    destinationAirport: string;
    remark: string;
    sroPiecesIn: number;
    sroWeightIn: number;
    natureOfGoods: string;
    specialHandlingCode: string;
    consigneeName: string;
    appointedAgent: string;
    ksro: string;
    fsro: string;
    senderIdentity: string;
    senderName: string;
    importExportFlag: string;
    transhipmentStatus: string;
    exportShipmentStatus: string;
    cargoStaffId: number;
    storingLocation: string;
    shipmentInfo: ShipmentInfo;
    checkOutDate: string;
    flightList: Array<CheckInFight>;

}
export class CheckOutShipmentModel extends BaseRequest {

    shipmentNumber: string;
    flightKey: string;

    flightDate: string;
    shipmentType: string;

}
export class CheckInFight extends BaseRequest {
    flightKey: string;
    inbFlightNumber: string;
    flightDate: string;
    sroPiecesIn: number;
    sroWeightIn: number;
}


export class SearchShipmentContext extends BaseRequest {
    shipmentType: string;
    shipmentNumber: string;

    //added hawb
    hawbNumber: string;
}

export class ShipmentInfo extends BaseRequest {
    shipmentNumber: string;
    origin: string;
    shipmentDate: string;
    destination: string;
    weight: string;
    natureOfGoods: string;
    specialHandlingCode: string;
    consigneeName: string;
    shipperName: string;
    appointedAgent: string;
    flagImportExport: string;
}