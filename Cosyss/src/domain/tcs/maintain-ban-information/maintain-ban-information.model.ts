import { BaseRequest, BaseResponse } from 'ngc-framework';
export class BanTruckSearchModel extends BaseRequest {
    companyName?: string;
    banStatus?: string;
    vehicleNo: string;
    banType?: string;
    banCreateDateFrom?: string;
    banCreateDateTo?: string;
    banPeriodDateFrom?: string;
    banPeriodDateTo?: string;
    banReleaseDateFrom?: string;
    banReleaseDateTo?: string;
    // records: string;
}
export class BanTruckSearchResultModel extends BaseResponse<any> {
    companyName: string;
    banStatus: string;
    vehicleNo: string;
    banType: string;
    banCreateDateFrom: string;
    banCreateDateTo: string;
    banPeriodDateFrom: string;
    banPeriodDateTo: string;
    banReleaseDateFrom: string;
    banReleaseDateTo: string;
    // records: string;
}
export class BanTruckModel extends BaseResponse<any> {
    // records: string;
    banTruckId: string;
    vehicleNo: string;
    banDateTime: string;
    banStatus: string;
    banReasonCode: string;
    fine: string;
    banFrom: string;
    banTill: string;
    remarks: string;
    banPerioddateto: string;

}