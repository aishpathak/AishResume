import { BaseRequest, BaseResponseData, BaseBO } from 'ngc-framework';
export class SearchEquipment extends BaseRequest {
    terminal: string;
    agent: string;
    blockTime: string;
    collectionType: string;
}
export class ListOfEquipment extends BaseRequest {
    agent: string;
    blockTime: string;
    collectionType: string;
    customerType: string;
    pDNumber: string;
    select: boolean;
}

export class SearchForTaskList extends BaseRequest {
    flightDatecriteria: boolean;
    collectionDatecriteria: boolean;
    equipmentReqId: Number;
    flightId: Number;
    fromDate: string;
    toDate: string;
    blockTime: string;
    blockTimedesc: string;
    terminaldesc: string;
    carriercode: string;
    typeOfCollectiondesc: string;
    agent: string;
    status: string;
    shipmenttype: string;
    releaseIdList: Array<Number>;
    requestTransactionNumber: string;
}

export class TaskListResult extends BaseRequest {
    terminaldesc: string;
    equipmentReqId: Number;
    blockTime: string;
    requestDate: string;
    shipmenttype: string;
    flightId: Number;
    flightKey: string;
    flightDate: string;
    staOrStd: string;
    agent: string;
    typeOfCollectiondesc: string;
    numberOfUlds: string;
    status: string;
    sourceOfRequest: string;
}

export class TaskListCriteria extends BaseRequest {
    terminaldesc: string;
    fromDate: string;
    toDate: string;
    blockTime: string;
    agent: string;
    status: string;
    typeOfCollectiondesc: string;
}

export class EquipmentPrepData extends BaseRequest {
    customerCode: string;
    blocktimeDesc: string;
    typeOfCollection: string;
    equipmentReleaseHeaderLabel: string;
    numEstPDReq: number;
    requestUldTyp: Array<EquipmentRequestContainerInfo>;
    releaseInfo: Array<EquipmentReleaseInfo>;
}

export class EquipmentRequestContainerInfo extends BaseRequest {
    equipmentRequestId: Array<Number>;
    uldType: string;
    qty: number
}
export class EquipmentReleaseInfo extends BaseRequest {
    equipmentReleaseInfoId: Number;
    equipmentRequestIdList: Array<Number>;
    pdNumber: string;
    uldList: Array<EquipmentReleaseContainerInfo>;
    remarks: string;

}
export class EquipmentReleaseContainerInfo extends BaseRequest {
    equipmentReleaseInfoId: Array<Number>;
    uldNumber: String;
}


export class EquipmentSerachRequest extends BaseRequest {
    public equipmentRequestId: number;
    public agentCustomerCode: number;
    public requestfor: string;
    public flightKey: string;
    public flightDate: string;
    public byAwbMode: boolean;
    public byFlightMode: boolean;
}

export class EquipmentRequest extends BaseRequest {
    public agentCustomerCode: string;
    public requestedby: number;
    public requestfor: string;
    public flightKey: string;
    public flightDate: string;
    public collectiondatetime: string;
    public blocktime: string;
    public typeofcollection: string;
    public handlingarea: string;
    public specialinstruction: string;
    public deliveryaddress: string;
    public status: string;
    public sourceofrequest: string;
    public estimatedpdfortowing: number;
    public blockFromTime: number;
    public blockToTime: number;
    public reqShipmets: Array<EquipmentReqShipments>;
    public reqContainers: Array<EquipmentReqContainerInfo>;
}

export class EquipmentReqShipments extends BaseRequest {
    public requestShipmentsId: number;
    public shipmentNumber: string;
    public destination: string;
    public bookedFlightId: number;
    public flightKey: string;
    public flightOriginDate: string;
    public createdBy: string;
    public createdOn: string;
    public modifiedBy: string;
    public modifiedOn: string;
}



export class SearchForRequestList extends BaseRequest {
    equipmentReqId: Number;
    flightId: Number;
    fromDate: string;
    toDate: string;
    flightDatecriteria: boolean;
    collectionDatecriteria: boolean;
    serviceCreationDate: boolean;
}

export class EquipmentListResult extends BaseRequest {
    equipmentReqId: Number;
    blockTime: string;
    requestDate: string;
    shipmenttype: string;
    flightId: Number;
    flightKey: string;
    flightDate: string;
    staOrStd: string;
    typeOfCollectiondesc: string;
    numberOfUlds: Number;
    status: string;
}

export class CreateTrip extends BaseRequest {
    public list: Array<ListOfEquipment>;
}

export class CreateEquipmentRequestByULDModel extends BaseRequest {
    public requestPrinterId: string;
    public uldListRecord: Array<EquipmentRequestByULD>;
}

export class EquipmentRequestByULD extends BaseRequest {
    public requestPrinterId: string;
    public carrierCode: string;
    public requiredByCarrier: boolean;
    public flightKey: string;
    public flightDate: string;
    public customerCode: number;
    public reqContainers: Array<EquipmentReqContainerInfo>;
    public reqAccessory: Array<EquipmentReqAccInfo>;
    public specialinstruction: string;
    public emailNotificationFlag: boolean;
    public transactionNumber: string;
}


export class EquipmentReqContainerInfo extends BaseRequest {
    public requestRequiredContainerInfoId: number;
    public requestId: number
    public ULDType: string;
    public qty: number;
    public flightsegmentid: String;
    public createdBy: string;
    public createdOn: string;
    public modifiedBy: string;
    public modifiedOn: string;
}

export class EquipmentReqAccInfo extends BaseRequest {
    public requestRequiredAccessoryInfoId: number;
    public requestId: number
    public AccessoryType: string;
    public qty: number;
    public createdBy: string;
    public createdOn: string;
    public modifiedBy: string;
    public modifiedOn: string;
}

export class ReportRequest extends BaseRequest {
    public reportName: string;
    public requestType: string;
    public format: string;
    public printerType: string;
    public locale: string;
    public theme: string;
    public function: string;
    public dataSource: string;
    public parameters: any;
    public multiParameters: any[];
    public queueName: string;
}

export enum PrinterType {
    LASER = "LASER"
}

export const ReportRequestType = {
    DOWNLOAD: "download",
    VIEW: "inline",
    PRINT: "print"
};

export class MaintainEquipmentRequestByULD extends BaseRequest {
    maintainUldList: any;
    uldListRecord: any;
    equipmentRequestId: any;
}