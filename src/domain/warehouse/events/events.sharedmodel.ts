import { BaseRequest, BaseResponseData, BaseBO } from 'ngc-framework';
export class UserGroup extends BaseRequest {
    name: any;
    description: any;
    active: any;
    userList: Array<User> = new Array<User>();
    checked: any;
    editFlag: any;
    eventGroupId: any;
    eventTypesId: any;
}
export class User extends BaseRequest {
    loginCode: any;
    email: any;
    adminMember: any;
    eventGroupId: any;
    eventNotificationUserGroupId: any;
    eventNotificationId: any;

}
export class UserGroupRequest extends BaseRequest {
    userGroupList: Array<UserGroup> = new Array<UserGroup>();
    userList: Array<User> = new Array<User>();
    flightList: Array<FlightInfo> = new Array<FlightInfo>();
    eventNotificationList: Array<EventNotification> = new Array<EventNotification>();
    templateList: Array<NotificationTemplate> = new Array<NotificationTemplate>();
    id: any;
    purpose: any;
}

export class EventNotification extends BaseRequest {
    eventNotificationId: any;
    eventTypesId: any;
    slaCategory: any;
    aircraftType: any;
    aircraftBodyType: any;
    domIntl: any;
    shcPurpose: any;
    flightTime: any;
    equation: any;
    occurenceInMinutes: any;
    occurenceInCount: any;
    notificationType: any;
    userList: Array<User> = new Array<User>();
    flightList: Array<FlightInfo> = new Array<FlightInfo>();
    checked: any;
    fixedTime: any;
    repeatTime: any;
    eventTemplateId: any;
    code: any;
    flightType: any;
    purpose: any;
    dlsPrecisionTime: any;
    fltPrecisionTime: any;
}
export class NotifyUser extends BaseRequest {
    loginCode: any;
    eventNotificationId: any;
    name: any;
    eventGroupId: any
}
export class FlightInfo extends BaseRequest {
    carrierCode: any;
    flightKey: any;
    flightDate: any;
    eventNotificationId: any;
    eventNotificationByFlightId: any;
    fromDate: any;
    toDate: any;
    carrierGroup: any;
    requestTerminal: any;
    rampCheckInCompleted: any;
    documentVerificationCompleted: any;
    breakdownCompleted: any;
    flightCompleted: any;
    manfiestCompYesNo: any;
    dlsFinalizedYesNo: any;
    rampCompYesNo: any;
    flightCompYesNo: any;
    ucmSentYesNo: any;
}

export class NotificationTemplate extends BaseRequest {
    eventTemplateId: any;
    eventNotificationId: any;
    email: any;
    sms: any;
    fax: any;
    message: any;
    name: any;
    parametersList: Array<TemplateParameter> = new Array<TemplateParameter>();
}

export class TemplateParameter extends BaseRequest {
    eventTemplateParametersId: any;
    eventTemplateIdany: any;
    parameterName: any;
}

export class DBoardBatchLog extends BaseRequest {
    dashboardBatchLogId: any;
}

