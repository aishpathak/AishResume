import {BaseRequest,Model,IsArrayOf} from "ngc-framework";

@Model(ServiceStandardMaintenanceInformationModel)
 export class ServiceStandardMaintenanceInformationModel extends BaseRequest {
   mstServiceStandardId : number = null;
   select : boolean = false;
   reportBy : string = null;
   name : string = null;
   definition : string = null; 
   equation : string = null;
   equationValue : number = null;
   equateFrom : string = null;
   equateWith : string = null;
   equation2 : string = null;
   equationValue2 : number = null;
   nthPercentile : number = null;
   flightType : string = null;
   reportFor : string = null;
   tonnageFrom : number = null;
   tonnageTo : number = null;
   carrierCode : string = null;
   aircraftType : string = null;
   offLoad : string = null;
   packagingType : string = null;
   shcHandlingGroupCode : string = null;
 }


@Model(ServiceStandardMaintenanceModel)
 export class ServiceStandardMaintenanceModel extends BaseRequest {
    reportFor : string = null;
    @IsArrayOf(ServiceStandardMaintenanceInformationModel)
    serviceStandardMaintenanceInformation : Array<ServiceStandardMaintenanceInformationModel> = new Array<ServiceStandardMaintenanceInformationModel>();
 }
