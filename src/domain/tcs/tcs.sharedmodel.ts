import { Time } from '@angular/common';
import {
    BaseService, RestService, BaseRequest, BaseResponse, BaseResponseData,
    NgcLOVComponent, Model, IsArrayOf, Min, Max, MinLength, NotBlank
} from 'ngc-framework';
import { date } from '../awbManagement/awbManagement.shared';

/* 
* REACTIVE FORM MADE FOR TRUCK CONTROL SYSTEM
*/

@Model(TruckSearchForm)
export class TruckSearchForm extends BaseRequest {
    public truckNumber: string = null;
    public incomingPurpose: string = null;
}

@Model(TruckDetails)
export class TruckDetails extends BaseRequest {
    truckNumber: string = null;
    arrivalTime: string = null;
    declareProposeTime: string = null;
    waitingTime: string = null;
    overStay: string = null;
    truckStatus: string = null;
}

@Model(TruckParkActivityList)
export class TruckParkActivityList extends BaseRequest {
    incomingPurpose: string = null;
    numberOfTrucks: string = null;
    @IsArrayOf(TruckDetails)
    truckDetails: Array<TruckDetails> = new Array<TruckDetails>();
}

@Model(TruckParkActivityForm)
export class TruckParkActivityForm extends BaseRequest {
    @IsArrayOf(TruckParkActivityList)
    truckParkActivityList: Array<TruckParkActivityList> = new Array<TruckParkActivityList>();
}

export class MaintainTruckSearch extends BaseRequest {

    vehicleNo: String;
    banStatus: String;
    purposeCategory: String;

}
export class MaintainTruckResultSearch extends BaseResponse<any>{
    vehicleNo: String;
    banStatus: String;
    purposeCategory: String;
}
export class MaintainTruckModel extends BaseResponse<any>{
    vehicleNo: String;
    banStatus: String;
    purposeCategory: String;
}
export class TruckAssignModel extends BaseResponse<any>{
    vehicleNo: String;
    srfNO: String;
    tripId: String;

}
export class TruckAssignSearch extends BaseRequest {

    vehicleNo: String;
    srfNO: String;
    tripId: String;
}
export class TruckAssignResultSearch extends BaseResponse<any>{
    vehicleNo: String;
    srfNO: String;
    tripId: String;
}
export class MaintainTenantSearch extends BaseRequest {

    dockPoolSize: number;
    parkPoolSize: number;
    gateChargeRequired: boolean;
    docks: number;
    customerShortName: string;
    autoEnqueueRequired: boolean;
    parkOverlapSize: number;
    parkOverlapMinute: number;
    companyId: number;
    active: number;
}
export class MaintainTenantResultSearch extends BaseResponse<any>{

    dockPoolSize: number;
    parkPoolSize: number;
    gateChargeRequired: boolean;
    docks: number;
    customerShortName: string;
    autoEnqueueRequired: boolean;
    parkOverlapSize: number;
    parkOverlapMinute: number;
    companyId: number;
    active: number;
}
export class MaintainTenantModel extends BaseRequest {

    dockPoolSize: number;
    parkPoolSize: number;
    gateChargeRequired: boolean;
    docks: number;
    customerShortName: string;
    autoEnqueueRequired: boolean;
    parkOverlapSize: number;
    parkOverlapMinute: number;
    companyId: number;
    active: number;
}
export class CompanyOccupanySearchModel extends BaseRequest {
    tenantId: String;
    dockPoolSize: String;
    parkPoolSize: String;
    companyId: String;
    companyType: String;
    companyName: String;
    tenant: String;
    customerShortName: string;
    inTruckDock: String;
    inTruckPark: String;
    poolSize: String;
    autoQueue: String;
    parkingPoolSize: String;
}
export class CompanyOccupancyResultSearch extends BaseResponse<any>{
    tenantId: String;
    dockPoolSize: String;
    parkPoolSize: String;
    companyId: String;
    companyType: String;
    companyName: String;
    tenant: String;
    customerShortName: string;
    inTruckDock: String;
    inTruckPark: String;
    poolSize: String;
    autoQueue: String;
    parkingPoolSize: String;
}
export class CompanyOccupancyModel extends BaseResponse<any>{
    tenantId: String;
    dockPoolSize: String;
    parkPoolSize: String;
    companyId: String;
    companyType: String;
    companyName: String;
    tenant: String;
    customerShortName: string;
    inTruckDock: String;
    inTruckPark: String;
    poolSize: String;
    autoQueue: String;
    parkingPoolSize: String;
}
@Model(ScheduleCollectionSearchModel)
export class ScheduleCollectionSearchModel extends BaseRequest {

    scheduleCollectionId: number;
    vehicleNo: string;
    startPeriodDate: date;
    endPeriodDate: date;
    truckDockNo: string;
    companyName: string;
    companyId: string;
    scheduledFromTime: string;
    scheduledTillTime: string;

}
@Model(ScheduleCollectionModel)
export class ScheduleCollectionModel extends BaseRequest {
    scheduleCollectionId: number;
    vehicleNo: string;
    truckDockNo: string;
    companyName: string;
    resourceId: string;
    scheduledFromTime: string;
    scheduledTillTime: string;
    startPeriodDate: string;
    endPeriodDate: string;
    applicableOnMonday: boolean;
    applicableOnTuesday: boolean;
    applicableOnWednesday: boolean;
    applicableOnThursday: boolean;
    applicableOnFriday: boolean;
    applicableOnSaturday: boolean;
    applicableOnSunday: boolean;

}

export class LedDisplayModel extends BaseRequest {
    floor: string;
}

export class tenentQueueSearchModel extends BaseRequest {
    tenantname: string;
}


export class tenentQueueModel extends BaseRequest {
    srNo: string;
    positionNo: string;
    vehicleNo: string;
    queuingTime: string
}


export class watingManualQueueModel extends BaseRequest {
    srNo: string;
    action: string
    vehicleNo: string;
    purposeStartTime: string
}


export class allocatedVehicleModel extends BaseRequest {
    srNo: string;
    action: string
    vehicleNo: string;
    allocatedTime: string
}


export class TruckQueueSearchModel extends BaseRequest {
    declaredPurposeCode: string;
    priority: string;
    public vehicleNo: string;
    public queueType: string;

}


export class TruckUpdateQueueOrder extends BaseRequest {
    firstQueueOrder: string;
    secondQueueOrder: string;
    firstVehicleNo: string;
    secondVehicleNo: string;

}
export class TruckActivitySearchModel extends BaseRequest {

    companyName: string;
    vehicleNo: string;
    terminalEntryDateTime: string;
    banDateTime: string;
    fine: string;
    bookingNo: string;
    declaredPurposeCode: string;
    declarePurposeDateTime: string;
    dockAllocatedDateTime: string;
    truckDockArraivalTime: string;
    dockLeaveDateTime: string;
    terminalExitDateTime: string;
    customerShortName: string;
    dockOccupyDateTime: string;
    banReason: string;

}
export class VehicleInfoSearchModel extends BaseRequest {
    associatedId: string;
    vehicleNo: string;
    companyId: string;
    vehicleType: string;
    notificationPhoneNo: string;
    vehicleCardId: string;
    deActiveReason: string;
    remarks: string;
    companyCode: string;
    vehicleId: string;
    customerShortName: string;
    active: string;
    natureOfBusiness: string;
    contactMobileNo: string;

}

export class VehicleInfoModel extends BaseRequest {

    associatedId: string;
    vehicleNo: string;
    companyId: string;
    vehicleType: string;
    notificationPhoneNo: string;
    vehicleCardId: string;
    deActiveReason: string;
    remarks: string;
    companyCode: string;
    vehicleId: string;
    active: string;
    natureOfBusiness: string;
    contactMobileNo: string;
}
export class UnknownVehicleSearchModel extends BaseRequest {
    vehicleNo: string;
    declaredPurpose: string;
    entryTime: string;
    tripId: string;
    associatedId: string;
}
export class UnknownVehicleModel extends BaseRequest {
    vehicleNo: string;
    declaredPurpose: string;
    entryTime: string;
    tripId: string;
    associatedId: string;
}

export class ConnectingTruckModel extends BaseRequest {
    truckDockNo: string;
    currentVehicleNo: string;
    vehicleNo1: string;
    vehicleNo2: string;
    vehicleNo3: string;
    vehicleNo4: string;
    vehicleNo5: string;
}
export class ConnectingTruckSearchModel extends BaseRequest {
    truckDockNo: string;
    currentVehicleNo: string;
}

export class DockUtlizationSearchModel extends BaseRequest {
    dockCharacteristics: string;
    floor: string;
    zone: string;
    startPeriodDate: string;
    scheduledFromTime: string;
    endPeriodDate: string;
    scheduledTillTime: string;
}

export class ReserveTruckDockSaveModel extends BaseRequest {
    truckDockNo: number;
    vehicleNo: string;
    durationFrom: Date;
    durationTo: Date;
}

export class PreWaiveParkingModel extends BaseRequest {
    vehicleNo: string;
    visitorName: string;
    visitorCompanyId: number;
    effectiveFromDateTime: Date;
    effectiveTillDateTime: Date;
    waiveHours: number;
    waiveFee: Boolean;
    multiUse: Boolean;
    reason: string;
    applicationDateTime: Date;
    collectionDateTime: Date;
    remarks: string;
    active: string;
}

export class ExitGateSearchModel extends BaseRequest {
    gateNumber: string;
    vehicleNo: string;
    tripId: number;
}
export class ExitGateResponseModel extends BaseResponse<any> {
    positionNo: string;
    GateNo: string;
    truckNo: string;
    TerminalArrivalTime: string;
    TerminalExitTime: string;
}

export class ReleaseDockSearchModel extends BaseRequest {
    truckDocNo: string;
    resourceId: string;
}
export class ReleaseDockResponseModel extends BaseResponse<any> {
    vehicleNo: string;
}

export class ReleaseDockUpdateModel extends BaseRequest {
    resourceId: number;
    requeue: Boolean
    remarks: string
}

@Model(AdhocUpdateChange)
export class AdhocUpdateChange extends BaseRequest {
    carrier: string;
    country: string;
    destination: string;
    firstPurpose: string;
    secondPurpose: string;
    thirdPurpose: string;
    fourthPurpose: string;
    fifthPurpose: string;
    flightDate: string;
    flightKey: string;
    resourceId: number;
    shc: string;
    status: string;
    xray: boolean;
    changeFromDateTime: string;
    changeTillDateTime: string;
}
@Model(AssignTruckDcock)
export class AssignTruckDcock extends BaseRequest {
    resourceId: number;
    vehicleNo: string;
    loggedInUser: string;
}
@Model(ManualCaptureEvent)
export class ManualCaptureEvent extends BaseRequest {
    vehicleNo: string;
    checkpointDevice: string;
    eventTime: string;
    logDateTime: string;

}

@Model(ManualCaptureEvent)
export class TenantQueueChange extends BaseRequest {
    vehicleNo: string;
}

