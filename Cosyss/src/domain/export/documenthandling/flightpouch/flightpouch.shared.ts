import { BaseRequest, BaseResponse, BaseBO, BaseResponseData } from 'ngc-framework';

export class CheckDocumentRequest extends BaseRequest {
    public flightId: string;
    public flightNumber: string;
    public flightDate: string;
    public action: string;
    public pouchId: string;
}

export class FlightPouch extends BaseRequest {
    public flightId: string;
    public flightNumber: string;
    public flightOriDate: any;
    public pouchId: string;
}

export class FlightPouchRequest extends BaseRequest {
    public flightId: string;
    public flightNumber: string;
    public flightOriDate: string;
    public pouchId: string;
    public fltPouchId: string;
    public phlocId: string;
    public locationName: string;
    public pouchStatus: string;
    public copyNum: string;
    public officeId: string;
    public docStatus: string;
    public awbNum: string;
    public shipmentId: string;
    public status: string;
    public tempType: string;
    public awbManifest: string;
    public userId: string;
    public delReason: string;
    public remark: string;
    public phSeg: string;
    public userCreated: string;
    public modifiedBy: string;
    public datStor: string;
    public isECCCheck: boolean;
    public returnDocFlag: string;
    public printer: string;
    public carrierCode: string;
    public validationFlag: boolean;
    public docType: string;
    public shc: string;
    public impFltDate: string;
    public pouchCode: string;
}

export class FlightPouchBO extends BaseRequest {
    // public pouchId: string;
    public flightNumber: string;
    public flightOriDate: string;

    public phlocId: string;
    public tempPouchId: string;
    public fltPouchId: string;
    public popPouchId: string;
    public status: string;
    public userId: string;
    public locationName: string;
    public delReason: string;
    public remark: string;
    public manifestStatus: string;
    public awbManifest: string;
    public latestUserId: string;
    public latestLocId: string;

    public flightInfo: FlightInformation;
    public legList: Array<FlightPouchLeg>;
    public summary: Array<FlightPouchSummary>;
    public pouchDetails: Array<FlightPouchList>;
}

export class FlightPouchResponse extends BaseResponseData {
    public pouch: FlightPouchBO;
}

export class FlightInformation extends BaseRequest {
    public flightId: string;
    public flightKey: string;
    public flightOriDate: string;
    public dateSTD: string;
    public dateETD: string;
    public status: string;
    public carrierCode: string;
}

export class FlightPouchLeg extends BaseRequest {
    public legId: string;
    public summary: Array<FlightPouchSummary>;
    public pouches: Array<FlightPouches>;
    public pouchDetails: Array<FlightPouchList>;
}

export class FlightPouchSummary extends BaseRequest {
    public total: string;
    public expected: string;
    public inPouch: string;
    public status: string;
    public inProgress: string;
}

export class FlightPouches extends BaseRequest {
    public pouchId: string;
}

export class FlightPouchList extends BaseRequest {
    public sel: string;
    public flightId: string;
    public shipmentId: string;
    public awbNum: string;
    public status: string;
    public docStatus: string;
    public locationName: string;
    public copyReq: string;
    public remove: string;
    public shc: string;
    public disc: string;
    public discName: string;
    public remark: string;
    public pouchId: string;
    public fltPouchId: string;
    public eAwbFlag: string;
}

export class Discrepancy extends BaseRequest {
    public discId: string;
    public flightId: string;
    public shipmentId: string;
    public flightNumber: string;
    public flightDateOri: string;
    public awbNum: string;
    public awbCopyNum: string;
    public discRemark: string;
    public remarks: string;
    public userCreated: string;
    public dateCreated: string;
    public pouchId: string;
    public sector: string;
    public modifiedBy: string;
}

export class DiscrepancyResponse extends BaseRequest {
    public resp: Discrepancy;
}

export class PrinterBO extends BaseRequest {
    public ipAddress: string;
    public portNo: string;
    public pouchId: string;
    public flightNo: string;
    public flightDate: string;
    public offPoint: string;
    public printerName: string;
    public locName: string;
    public awbNumBarcode: string;
    public awbNumTextCode: string;
    public pouchLbl: string;
    public status: string;
    public awbNum: string;
}

export class PrinterResponse extends BaseResponseData {
    public pouch: PrinterBO;
}

export class CopyRequestDetails {
    public flightNumber: string;
    public flightOriDate: string;
    public pouchId: string;
    public routerUrl: string;
    public awbNo: string;
}