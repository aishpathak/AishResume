import {
    BaseRequest,
    BaseResponseData,
    BaseBO,
    Model,
    IsArrayOf,
    Pattern
} from "ngc-framework";

export class SearchMessageRequest extends BaseRequest {
    carrierCode: string;
    messageFromDate: Date;
    messageToDate: Date;
}

export class GetErrorMsgRequest extends BaseRequest {
    flightId: number;
    subMessageType: string;
    messageType: string;
}

/**
 * ResendFwbFhl Screen - Start
 */
 @Model(ResendMessageFwbFhlHouseModel)
 export class ResendMessageFwbFhlHouseModel extends BaseRequest {
    selectFhl  : boolean = false;
	houseNumber: string = null;
	pieces : number = null;;
	weight : number = null;;
 }

 @Model(ResendMessageFwbFhlShipmentModel)
 export class ResendMessageFwbFhlShipmentModel extends BaseRequest {
    shipmentId : number = null;
    selectFwb  : boolean = false; 
	selectRcs  : boolean = false;
    allFhl : boolean = false;  
	hideFwb  : boolean = false; 
	hideFhl  : boolean = false; 
	shipmentNumber : string = null;
	natureOfGoodsDescription: string = null;
	shc: string = null;
	shipmentOrigin: string = null;
	shipmentDestination: string = null;
	customerCode: string = null;
	customerName: string = null;
	shipmentDate: string = null;
	fwbDateTimeSent: Date = null;; 
	fhlDateTimeSent: Date = null;; 
	fwbPieces : number = null;
	fhlPieces: number = null;
    flightSegmentId: string = null;
	fhlWeight: number = null;
	fwbWeight: number = null;
    @IsArrayOf(ResendMessageFwbFhlHouseModel)
    houseInformation: Array<ResendMessageFwbFhlHouseModel> = new Array<ResendMessageFwbFhlHouseModel>();
 }

 @Model(ResendMessageFwbFhlModel)
 export class ResendMessageFwbFhlModel extends BaseRequest {
    flightId : number = null;
    flightKey : string = null;
    carrierCode : string = null;
    shipmentNumber: string = null;
    unloadingPoint: string = null;
    shipmentOrigin: string = null;
    shipmentDestination: string = null;
    customerId: number = null;
    flightDate : Date = null;
    shipmentDate : Date = null;
    shipmentOriginExclude : boolean = false;
    shipmentDestinationExclude  : boolean = false;
    customerExclude  : boolean = false;
    telexAddress : string = null;
    emailAddress : string = null;
    @IsArrayOf(ResendMessageFwbFhlShipmentModel)
    shipmentInformation : Array<ResendMessageFwbFhlShipmentModel> = new Array<ResendMessageFwbFhlShipmentModel>();
 }
 /**
  * ResendFwbFhl Screen - End
  */