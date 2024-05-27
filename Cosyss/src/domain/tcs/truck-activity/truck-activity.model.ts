import { BaseResponse, BaseRequest } from 'ngc-framework';

export class TruckActivityModel extends BaseRequest {

    companyName: string;
    vehicleNo: string;
    enterterminalTime: string;
    banDate: string;
    fine: string;
    bookingNo: string;
    declaredPurposeCode: string;
    declarePurposeTime: string;
    truckDockAllocationTime: string;
    truckDockArraivalTime: string;
    truckDockLeavingTime: string;
    leavingTerminalTime: string;


}
export class TruckActivitySearchResultModel extends BaseRequest {

    companyName: string;
    vehicleNo: string;
    enterterminalTime: string;
    banDate: string;
    fine: string;
    bookingNo: string;
    declaredPurposeCode: string;
    declarePurposeTime: string;
    truckDockAllocationTime: string;
    truckDockArraivalTime: string;
    truckDockLeavingTime: string;
    leavingTerminalTime: string;


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


}