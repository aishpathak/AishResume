
import { BaseRequest, BaseResponse } from 'ngc-framework';
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
    createdUser_Code: string;
    created_DateTime: string;
    vehicleId: string;
    createdUserCode: string;
    createdDateTime: string;
    active: string;

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
    createdUser_Code: string;
    created_DateTime: string;
    vehicleId: string;
    createdUserCode: string;
    createdDateTime: string;
    customerShortName: string;
    active: string;


}
export class VehicleInfoSearchResultModel extends BaseResponse<any> {

    associatedId: string;
    vehicleNo: string;
    companyId: string;
    vehicleType: string;
    notificationPhoneNo: string;
    vehicleCardId: string;
    deActiveReason: string;
    remarks: string;
    companyCode: string;
    createdUser_Code: string;
    created_DateTime: string;
    vehicleId: string;
    createdUserCode: string;
    createdDateTime: string;
    customerShortName: string;
    active: string;


}


