import { BaseBO, BaseResponseData, BaseService, RestService, BaseRequest, BaseResponse } from 'ngc-framework';

export class DocumenthandlingmasterRequest extends BaseRequest {

}

export class DocumenthandlingmasterResultBO extends BaseRequest {
    slaId: string;
    flightCarrier: string;
    office: string;
    carrierCode: string;
    carrierName: string;
    paxFreighter: string;
    veriRequired: string;
    nilPouchRequired: string;
    lblPrintRed: string;
    lblPrintOrg: string;
    docReceivedRed: string;
    docReceivedOrg: string;
    maniFinalRed: string;
    maniFinalOrg: string;
    dlsFinalRed: string;
    dlsFinalOrg: string;
    pouchStartRed: string;
    pouchStartOrg: string;
    pouchCompRed: string;
    pouchCompOrg: string;
    pouchReadyRed: string;
    pouchReadyOrg: string;
    chkoutRed: string;
    chkoutOrg: string;
    deliACRed: string;
    deliACOrg: string;
    pouchStartX: string;
    reVerificationX: string;
    notifyFltDisc: string;
    dlvTo: string;
    dlvTo1: string;
    dlvTo2: string;
    dlvTo3: string;
    action: string;
    startRowNum: string;
    endRowNum: string;
    totalRows: string;
    modifiedBy: string;
}

export class DocumenthandlingmasterResponseData extends BaseResponseData {

    public resultList: Array<DocumenthandlingmasterResultBO>;

}


export class AdminColourRequest extends BaseRequest {

}

export class AdminColourResultBO extends BaseResponseData {
    slaId: string;
    slaDescription: string;
    slColourCode: string;

}

export class AdminColourResponseData extends BaseResponseData {

    public resultList: Array<AdminColourResultBO>;

}

export class UpdateAdminColourResultBO extends BaseRequest {
    slaId: string;
    slColourCode: string;
    modifiedBy: string;
}

export class UpdateAdminColourResponseData extends BaseResponseData {

    public resultList: Array<AdminColourResultBO>;

}


export class LoginRequestData extends BaseRequest {
    loginId: string;
    password: string;
    officeId: string;
    officeName: string;
}

export class CheckValidPasswordResponseData extends BaseResponseData {
    loginId: string;
    password: string;
    userId: string;
    officeId: string;
    officeName: string;
    public sessionDetails: SessionProperty;
}

export class SessionProperty extends BaseRequest {

    userId: string;
    officeId: string;
}

export class GetLoginDetails extends BaseRequest {
}

export class DocumentViewResultBOResponse extends BaseRequest {
    arrayList: Array<DocumentViewResponseData>;
}
export class DocumentViewRequestDTO extends BaseRequest {
    shipmentNumber: string;
    pigeonHoleLoc: string;
    documentStatus: string;
    flightKey: string;
    flightOriginDate: string;
    carrierCode: string;
    docReceivedDate: string;
    docToDate: string;
}

export class DocumentViewResponseData extends BaseResponseData {
    sNo: number;
    awbNo: string;
    copyNo: string;
    flightNo: string;
    destination: string;
    location: string;
    status: string;
    impFlightDate: string;
    pouchFlt: string;
    ecc: string;
    eawb: string;
    tt: string;
    notifyDate: string
    flightCar: string;
    receiveDate: string;
    dateFrom: string;
    dateTo: string;
    deleteReason: string;
    importFlights: string;
    exportFlights: string;

    public resultList: Array<DocumentViewResponseData>;

}

//Location Details

export class LocationConfigRequest extends BaseRequest {
}
export class LocationConfigResultBO extends BaseRequest {
    type: string;
    officeId: string;
    regionId: string;
    locationId: any;
    flightno: string;
    destination: string;
    carrier: string;
    locationconfigId: string;
    locationName: string;
    locDesc: string;
    dispDeviceId: string;
    officeName: string;
    regionName: string;
    locationCode: string;
    sourceId: string;
    modifiedBy: string;
}

export class LocationConfigResponseData extends BaseResponseData {
    type: string;
    locationId: string;
    locationName: string;
    regionId: string;
    regionName: string;
    carrier: string;
    locationconfigId: string;
    destination: string;
    flightno: string;
    dispDeviceId: string;
}

export class UpdateDocumentRequestDTO extends BaseRequest {
    flightId: string;
    shipmentId: string;
    shipmentNumber: string;
    copyNum: string;
    pigeonHoleLocationId: string;
    deleteReasonCode: string;
    docstatus: string;
    fltPouchId: string;
    deleteRemarks: string;
    deleteFlag: string;
    status: string;
    printerName: string;
    copyNo: string;
    flightNumDate: string;
}

export class UpdateDocumentViewData extends BaseRequest {
    // awbNo: string;
    // copyNo: string;
    // status: string;
    // location: string;
    // locationId: string;
    // pouchFlt: string;
    // deleteReason: string;
    // remarks: string;
    // destination: string;
    // pouchId: string;
    // createdBy: string;
    // createdOn: string;
    // modifiedBy: string;
    // modifiedOn: string;
    // flightNo: string;
    // flightdate: string;
}

export class ImportFlights extends BaseRequest {
    importFlights: string;
}
export class ExportFlights extends BaseRequest {
    ExportFlights: string;
}

export class UpdateDocumentResponseData extends BaseResponseData {
    public documentUpdateData: Array<UpdateDocumentViewData>;
    public importFlt: Array<ImportFlights>;
    public exportFlt: Array<ExportFlights>;
}

export class UpdateDocumentViewDataResponse extends BaseResponseData {
    awbNo: string;
    copyNo: string;
    status: string;
    location: string;
    pouchFlt: string;
    deleteReason: string;
    remark: string;

}

export class FlightViewRequestObject extends BaseRequest {
    dateFrom: string;
    dateTo: string;
    carrier: string;
    pouchStatus: string;
    flightId: string;
    flightNo: string;
    flightDate: string;
    discrepancy: string;
    pouchId: string;
    phLocId: string;
    officeId: string;
    office: string;
    //officeName: string;
}

export class DashboardTVRequestBO extends BaseRequest {
    officeId: string;
    officeName: string;
}

export class DashboardRequestBO extends BaseRequest {
    officeId: string;
    officeName: string;
}

export class ReportRequest extends BaseRequest {
    dateFrom: string;
    dateTo: string;
    reportName: string;
}

export class PigeonHoleLocationFlightMapping extends BaseRequest {
    flightNumber: string = null;
    flightOriginDate: Date = null;
    flightKey: String = null;
    destination: String = null;
    flightId: number = 0;
    locationName: String = null
}


export class DateRangeReportRequest extends BaseRequest {
    dateFrom: string;
    dateTo: string;
    pouchStatus: string;
    eccPouch: string;
    officeId: string;
    carrier: string;
    discrepancy: string;
    slaMet: string;
    selectedType: string;


    public resultList: Array<DocumentViewResponseData>;


}

export class FlightReportRequest extends BaseRequest {
    dateFrom: string;
    dateTo: string;
    locTrans: string;
    discrepancy: string;
    eccHandled: string;
    carrier: string;
    flightNo: string;
    date: string;
    uplifted: string;
    selectedType: string;

    public resultList: Array<DocumentViewResponseData>;


}


