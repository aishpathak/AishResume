import {
    BaseRequest,
    BaseResponseData,
    BaseBO,
    Model,
    IsArrayOf,
    Pattern
} from "ngc-framework";

export class SummaryOfEpouch extends BaseRequest {
    flightDepDate: any;
    ePouchUploaded: string;
    shipmentNumber: string;
    agentCode: string;
    shipmentDate: any;
    epouchCreatedDateTime: any;
    fromDate: any;
    toDate: any;
}
