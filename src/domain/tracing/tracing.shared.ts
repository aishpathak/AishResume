import { BaseService, RestService, BaseRequest, BaseResponseData, Model, IsArrayOf } from 'ngc-framework';

export const ImportExportIndicator = {
    IMPORT: 'I',
    EXPORT: 'E'
};

export class MstAssignTeamToAirport extends BaseRequest {
    //    public mstAssignTeamToGroupId: number;
    public airportCode: string;
    public mstAssignTeamToAirportId: number;
}

export class MstAssignTeamToGroup extends BaseRequest {
    //    public mstAssignTeamToGroupId: number = null;
    public teamId: number = null;
    public importExportIndicator: string = null;
    public carrierCode: string = null;
    public groupName: string = null;
    public airports: string[] = null;
    public teamToAirports: Array<MstAssignTeamToAirport> = new Array<MstAssignTeamToAirport>();
    public associateCarrierWithGroupId: number = null;
}

export class MstAssignTeamToGroupList extends BaseRequest {
    public groupList: Array<MstAssignTeamToGroup>;
    public carrierGroupType: number;
    public associatedCarrierType: number;
}


export class SearchGroup extends BaseRequest {
    public associateCarrierWithGroupId: number;
    public searchKey: string;
    public airportCode: string;
    public teamId: number;
    public importExpIndicator: string;

}


export class CargoSurvey extends BaseRequest {

    public comConductSurveyId: number;
    public surveyNo: number;
    public status: string;
    public carrierGp: string;
    public referenceNo: string;
    public placeOfsurvey: string;
    public surveyForName: string;
    public surveyFor: RefOfSurveyFor;
    public shipments: Array<Shipment>;
    public surveydetails: SurveyDetails;
    public signatureAndPayment: SignatureAndPayment;
    public cargoOfficialReceipt: string;
    public startedDateTime: Date;
    public endDateTime: Date;
    public questionnairList: Array<Questionnair>;
    public conductSurveyReceiptInfo: Array<ConductSurveyReceiptInfo>;
}


export class RefOfSurveyFor extends BaseRequest {

    public referenceId: number;
    public surveyForName: string;
    public noOfPieces: number;
    public refWeight: number;
    public hawb: HAWB;
    public flight: number;
    public impFlight: ImpFlight;
    public date: string;
    public originStation: string;
    public destinationStation: string;
}

export class HAWB {
    public weight: number;
    public pieces: number;
    public hawbNumber: string;
}

export class SignatureAndPayment {
    public consignee: Consignee;
    public witness: WitnessedBy;
    public surveyBy: SurveyBy;
}

export class Consignee {
    public icNo: string;
    public name: string;
    public designation: string;
    public signature: string;
}

export class WitnessedBy {
    public icNo: string;
    public name: string;
    public designation: string;
    public signature: string;
}


export class SurveyBy {

    public icNo: string;
    public name: string;
    public designation: string;
    public signature: string;
}


export class SurveyDetails {
    public pieces: number;
    public weight: number;
}

export class GeneratedCargoSurvey extends BaseRequest {
    public carrierGp: string;
    public surveyNo: number = 0;
    public status: string = "";
    public startedDateTime: Date = null;
    public updateStatusDate: Date = null;
    public referenceNo: string = "";
    public surveyForName: String = "";
    public questionnairList: Array<Questionnair> = null;
    public hawbNumber: string = null;
    public cargoOfficialReceiptInfo: any;
    public flightKey: string;
    public remarks: string = null;
}

export class Shipment extends BaseRequest {
    public comConductSurveyId: number;
    public surveyPackingId: number = 0;
    public natureOfGoods: string = "";
    public description: string = "";
    public quantityDamagedLost: any;
    public invoiceNo: string = "";
    public packingItem: Array<PackingItem> = [];
    public isDiscrepancy: String = 'N';
    public transactionSequenceNo: number;
    public packingEvidenceDocument: PackingEvidenceDocument = null;
    public others: string = null;
}
export class PackingItem extends BaseRequest {
    // public comConductSurveyId: number = 0;
    // public surveyQuestionnaireId: number = 0;
    // public responseFlag: boolean = true;
    // public question: string = "";
    public comConductSurveyShipmentPackingItemId: Number = 0;
    public comConductSurveyShipmentPackingId: Number = 0;
    public item: string;
    public packingDetails: Array<PackingDetails> = [];

}

export class PackingEvidenceDocument extends BaseRequest {
    // public comConductSurveyId: number = 0;
    // public surveyQuestionnaireId: number = 0;
    // public responseFlag: boolean = true;
    // public question: string = "";

}
export class Questionnair extends BaseRequest {
    public comConductSurveyId: number = 0;
    public surveyQuestionnaireId: number = 0;
    public responseFlag: boolean = true;
    public question: string = "";

}
export class ConductSurveyReceiptInfo extends BaseRequest {

    /**
     * 
     */

    public comConductSurveyId: number = 0;
    public cargoOfficialReceipt: string = "";
    public emails: Array<Email> = [];
}

export class PackingDetails {
    public surveyPackingId: number = 0;
    public packing: string = "";
    public packingConditions: Array<PackingConditions> = [];
    public remarks: string = "";
}

export class PackingConditions {
    public surveyPackingConditionId: number = 0;
    public surveyPackingId: number = 0;
    public packingCondition: string = "";
    public packingConditionFlag: boolean = false;
    public remarks: string = "";

}


export class Email extends BaseRequest {
    public comConductSurveyId: number;
    public comConductSurveyReceiptInfoId: number;
    public email: string = "";
    public cargoOfficialReceipt: string = "";
}

export class ImpFlight {
    private flight_ID: number;
    private carrierCode: String;
    private flightNumber: String;
    private offPoint: String;
    private boardingPoint: String;
    private flightKey: String;
    private flightOriginDate: Date;

}

export class MaintainTracingActivity extends BaseRequest {

    public caseNumber: String;


}

export class SearchTracingRecord extends BaseRequest {
    public airportGroupCode: number;
    public importExportIndicator: string;
    public carrierGroupCode: string;
    public carrierCode: string;
    public shipmentNumber: string;
    public fromDate: Date;
    public toDate: string;
    public caseStatus: string;
    public irregularityTypeCode: string;
    public firstTimeLogin: string;
    public irregularity: string;
    public tracingCreatedfor: string;
    public flightKey: string;
    public reasonforClosing: string;
    public claimed: boolean;
    public notclaimed: boolean;
    public irpStatus: String;
    public stages: String;
}

export class MaintainTracingResponse extends BaseRequest {
    private comTracingShipmentInfoId: any;
    private ComTracingShipmentSHCId: any;
    private shipmentDate: any;
    private flightKey: String;
    private flightDate: any;
    private houseNumber: String;
    private caseNumber: String;
    private tracingCreatedfor: String;
    private shipmentId: any;
    private houseId: any;
    private origin: String;
    private destination: String;
    private flightId: any;
    private totalPieces: any;
    private totalWeight: any;
    private irregularitypieces: any;
    private irregularityWeight: any;
    private natureOfGoodsDescription: String;
    private shc: String;
    private importUserCode: String;
    private importstaffNumber: String;
    private importStaffName: String;
    private exportUserCode: any;
    private exportstaffNumber: String;
    private exportStaffName: String;

    private followUpDate: any;
    private reasonforClosing: String;
    private specialHandlingCode: String;
    private createdUserCode: String;

    private closedOn: any;

    private createdDateTime: any;
    private maintainTracingActivityLocationModel: Array<MaintainTracingActivityLocationModel>;
    private maintainTracingActivityDimensionModel: Array<MaintainTracingActivityDimensionModel>
    private maintainTracingActivitiesActivityModel: Array<MaintainTracingActivitiesActivityModel>


}

export class MaintainTracingActivityLocationModel {

    private comTracingShipmentLocationInfoId: any;
    private comTracingShipmentInfoId: any;

    private shipmentLocationCode: String;
    private pieces: any;
    private weight: any;
    private weightUnitCode: String;
    private warehouseLocationCode: String;

}
export class MaintainTracingActivityDimensionModel {

    private comTracingShipmentDimensionInfoId: any;
    private comTracingShipmentInfoId: any;
    private numberOfPieces: any;
    private dimensionWidth: any;
    private dimensionHeight: any;
    private measurementUnitCode: any;
    private dimensionLength: String;


}
export class MaintainTracingActivitiesActivityModel {

    public comTracingShipmentFollowupActionId: any;
    public comTracingShipmentInfoId: any;
    public activity: String;
    public activityPerformedBy: String;

    public activityPerformedOn: any;


}
export class SurveySearch extends BaseRequest {
    referenceNumber: string;
    carrirerGroup: string;
    fromDate: Date;
    toDate: Date;
    surveyStatus: string;
    constructor(referenceNumber: string, carrirerGroup: string, fromDate: Date, toDate: Date, surveyStatus: string) {
        super();
        this.referenceNumber = referenceNumber;
        this.carrirerGroup = carrirerGroup;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.surveyStatus = surveyStatus
    }
}

export class AbandonedCargoSearch extends BaseRequest {
    public type: string;
    public carrierCode: string;
    public referenceNo: string;
    public fromDate: Date;
    public toDate: Date;
    public carrierGp: string;
    public referenceNumbers: Array<number> = [];
    public dispose: string;
    public status: string;
    public shcGroupCode: string;
}

export class ShimentLocation extends BaseRequest {

    public shimentInfoId: number;
    public shimentLocation: string;
    public pieces: number;
    public warehouselocation: string;
    public handlingArea: String;


}



export class SearchDetailsGetList {

}



export class TracingListReqObj {
    carrierGroupCode: string;
    carrierCode: string;
    fromDate: string;
    toDate: string;
    justifiableCaseFlag: string;
}

export class TracingListResponseObj {
    comTracingShipmentInfoId: any;
    caseNumber: string;
    caseStatus: string;
    irregularityTypeCode: string;
    importExportIndicator: string;
    tracingCreatedFor: string;
    origin: string;
    destination: string;
    totalPieces: any;
    totalWeight: any;
    irregularityPieces: any;
    irregularityWeight: any;
    natureOfGoodsDescription: string;
    importUserCode: string;
    importStaffNumber: string;
    importStaffName: string;
    exportUserId: string;
    exportStaffNumber: string;
    exportStaffName: string;
    followupDate: Date;
    reasonForClosing: string;
    justifiableCaseFlag: string;
    remarks: string;
    closedOn: any;
    createdDateTime: any;
    createdUserCode: string;
    source: string;
    shipmentType: string;
    shipmentNumber: string;
    shipmentDate: Date;
    houseNumber: string;
    flightKey: string;
    flightDate: Date;
    carrierCode: string;
    boardingPoint: string;
    offPoint: string;
    shc: any;
    shcs: any;
    tracingLocation: any;
}
export class MaintainTracingActivityShipmentData extends BaseRequest {

    public shipmentNumber: String;


}



export class MaintainTracingActivityShipmentDataResponse extends BaseRequest {

    public shipmentId: any;

    public shipmentNumber: String;

    public shipmentDate: any;
    public destination: String;
    public origin: String;
    public weight: any;
    public natureOfGoodsDescription: String;
    public pieces: any;
    public maintainTracingActivityShipmentInventoryModel: Array<MaintainTracingActivityShipmentInventoryModel>;


}
export class MaintainTracingActivityShipmentInventoryModel extends BaseRequest {

}

export class EmailEvent {
    /**
     * 
     * EMailEvent.java
     * 
     * Copyright <PRE><IMG SRC = XX></IMG></PRE>
     *
     * Version      Date         Author      Reason
     * 1.0          23 JUN, 2018   NIIT      -
     */


    /**
     * EMailEvent instance
     * 
     * @author NIIT Technologies Ltd
     * @version 1.0
     */




    public mailSubject: String;
    public mailBody: String;
    public senderName: String;
    public mailFrom: String;
    public mailTo: String;
    public mailCC: String;
    public mailBCC: String;
    public mailToAddress: String[];
    public mailCCAddress: String[];
    public mailBCCAddress: String[];
    public replyTo: String;
    public notifyAddress: String;
    public mailStatus: String;
    public failedReason: String;
    //   public TemplateBO template;
    //   public Map<String, AttachmentStream> mailAttachments;
}

export class AttachmentStream {


    public fileId: number; // File referenceId
    public fileName: string; // File Name
    public fileType: string; // File Format
    public fileData: string; // File Data
    public fileSize: string; // FileSize
    public fileBytes: ByteString; // File Bytes

}

export class SearchNetworkUldDetails extends BaseRequest {
    public uldKey: string;
}

export class SearchNetworkAwbDetails extends BaseRequest {
    public shipmentNumber: string;
}

export class EmailInfo extends BaseRequest {
    public mailIDs: Array<String> = [];
    public mailContent: String;
    public subject: String;
    public caseNumber: String;
    public tracingFollowup: MaintainTracingActivitiesActivityModel;
    public uploadFilekey: String;
}


// @Getter
// @Setter
// @NoArgsConstructor
// public class TemplateBO {
//    private BigInteger templateId;
//    private String templateCode;
//    private String templateName;
//    private String templateMessage;
//    private Map<String, String> templateParams;
//    private String templateHTML;
//    private boolean isTemplateEnabled = Boolean.FALSE;

// }

@Model(RfidList)
export class RfidList extends BaseRequest {

}

@Model(ManageRfidform)
export class ManageRfidform extends BaseRequest {
    shipmentNo: string = null;
    @IsArrayOf(RfidList)
    rfidList: Array<RfidList> = new Array<RfidList>();
}