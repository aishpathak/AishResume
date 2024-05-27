
import { BaseService, RestService, BaseRequest, BaseResponse, BaseResponseData, BaseBO } from 'ngc-framework';
export class Capturedamage extends BaseRequest {
  uploadDocId: number;
  damageInfoId: number;
  referenceId: string;
  entityType: string;
  entityKey: string;
  associatedTo: string;
  stage: string;
  remarks: string;
  damagePieces: number;
  content: string;
  remark: string;
  captureDetails: any;
}

export class ShipmentInfoReqModel extends BaseRequest {
  entityKey: string;
  //shipmentDate: Date;
  entityType: string;
  printerName: string;
  userLoginCode: string;
  hwbNumber: string;
  shipmentHouseId: any;

}

export class uploadPhotodata extends BaseRequest {
  uploadDocId: number;
  referenceId: string;
  sequenceNo: number;
  associatedTo: string;
  stage: string;
  document: string;
  remarks: string;
  entityType: string;
  entityKey: string;
  documentName: string;
  documentSize: string;
  documentType: string;
  isDeleted: any;
}

export class MailingDetails extends BaseRequest {

  public cc: String;
  public bcc: String;
  public to: String;
  public replyTo: String;
  public subject: String;
  public body: String;
  public shipmentNumber: String;
  public type: String;
  public user: String;
  public tenantAirportCode: String;
  public flight: String;
  public flightdate: Date;
  public uploadedFiles: Array<UploadedFiles> = [];
  public entityType: String;
  public entityKey: String;
  public associatedTo: String;
  public stage: String;
  public entityType2: String;
  public entityKey2: String;
  public subEntityKey: String;
  public entityDate: Date;


}

export class UploadedFiles extends BaseRequest {

  public fileName: String;
  public fileType: String;
  public fileId: number;
  public remarks: String;

}

export class ManifestFlightData extends BaseRequest {
  public entityType: String;
  public entityKey: String;
  public flight: string;
  public flightDate: string;

}

export class CaptureDamageShipmentHouseModel extends BaseRequest {
  public houseNumber: String;
  public housePicecWeight: String;
  public hawbDamagePcs: Number;
  public hawbDamageWt: Number;
  public hawbRemarks: String;
  damageLineItemsByHouseInfoId: Number;
  damageLineItemsId: Number;
  shipmentHouseId: Number;
  hawbOrigin: String;
  hawbDestination: String;
  hawbNatureOfGoods: String;

}