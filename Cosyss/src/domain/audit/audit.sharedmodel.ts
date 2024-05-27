import {
    BaseRequest,
    BaseResponseData,
    BaseBO,
    Model,
    IsArrayOf,
    Pattern
} from "ngc-framework";

export class AuditRequest extends BaseRequest {
    fromDate: any;
    toDate: any;
    user: any;
    entityType: any;
    entityValue: any;
    eventType: any;
    shipmentNumber: any;
    uldNumber: any;
    flightKey: any;
    flightDate: any;
    mailbagNumber: any;
    warehouseLocation: any;
    entityAttributes: any;
    customerCode: any;
    customerName: any;
    roleCode: any;
    uenNumber: any;
    loginId: any;
    serviceNumber: any;
    pdNumber: any;
    locationSearchType: any;
    dnNumber: any;
    hawbNumber: any;
}