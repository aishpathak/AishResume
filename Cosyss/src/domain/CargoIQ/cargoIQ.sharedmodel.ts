import { BaseRequest } from 'ngc-framework';

export class CargoIQEmailNotification extends BaseRequest {
    carrierList: Array<CarrierInfo> = new Array(new CarrierInfo);
}

export class CarrierInfo extends BaseRequest {
    ciqRptGenDay: String = null;
    ciqRptGenWeek: String = null;
    ciqRptGenTime: any = null;
    carrierCode: any = null;
    schedule: Array<Schedule> = new Array(new Schedule);
    scheduleIata: Array<Schedule> = new Array(new Schedule);
}

export class Schedule extends BaseRequest {
    membersInfo: Array<Member> = new Array(new Member);
}

export class Member extends BaseRequest {
    emailTo: String = null;
    weekly: boolean = false;
    daily: boolean = false;
    monthly: boolean = false;
}