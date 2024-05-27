import {
    BaseService, RestService, BaseRequest, BaseResponse, BaseResponseData,
    NgcLOVComponent, Model, IsArrayOf, Min, Max, MinLength, NotBlank
} from 'ngc-framework';

import { Time } from '@angular/common/src/i18n/locale_data_api';

@Model(EfacilitationShipmentListModel)
export class EfacilitationShipmentListModel extends BaseRequest {
    remarks: string = null;
    flightKey: string = null;
    flightDate: string = null;
    chargeRate: number = null;
    shipmentNumber: string = null;
    requestedPieces: number = null;
    requestedWeight: number = null;
    flightInOrOutBound: string = null;
    chargeQuotedAmount: number = null;
    customStatus: string = null;
    customRemarks: string = null;
    customPermitNumber: string = null;
    agentStatus: string = null;
    agentStatusType: string = "";
    deliveryOrderNo: string = null;
}

@Model(EfacilitationForm)
export class EfacilitationForm extends BaseRequest {
    status: string = null;
    rejectedOn: Date = null;
    approvedOn: Date = null;
    agentName: string = null;
    customerId: number = null;
    requestedBy: string = null;
    serviceCode: string = null;
    serviceName: string = null;
    requestedOn: string = null;
    rejectReason: string = null;
    serviceMasterId: number = null;
    serviceRequestNo: string = null;
    documentReferenceId: number = null;
    serviceRequestSetId: number = null;
    requestorContactNumber: string = null;
    customClearanceRequired: string = null;
    customBroker: string = null;
    customStatus: string = null;
    customRemarks: string = null;
    customPermitNumber: string = null;
    showAgentStatus: boolean = false;
    showCustomerDocuments: boolean = false;
    @IsArrayOf(EfacilitationShipmentListModel)
    public shipmentList: Array<EfacilitationShipmentListModel> = new Array<EfacilitationShipmentListModel>();
}

@Model(EfacilitationSearchForm)
export class EfacilitationSearchForm extends BaseRequest {
    status: string = null;
    serviceCode: string = null;
    serviceName: string = null;
    customerIdEqp: string = null;
    shipmentNumber: string = null;
    serviceRequestNo: string = null;
}

