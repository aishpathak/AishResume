import {
  BaseService,
  RestService,
  BaseRequest,
  BaseResponseData,
  BaseResponse
} from "ngc-framework";

export class MaintainMastersResponse extends BaseResponseData {
  public masters: Array<MaintainMasters>;
}
export class MaintainMasters extends BaseResponseData {
  public masterslist: string;
}

export class MaintainMastersRequest extends BaseRequest {
  public masterName: string;
  public masterLabelName: string;
}
export class MaintainSystemParameterRequestSearch extends BaseRequest {
  public searchName: string;
}

export class MaintainSystemParameterRequestEdit extends BaseRequest {
  public systemParamList: string;
}
export class MaintainSystemParameterUpdateRequest extends BaseRequest {
  public systemParam: string;
  public name: String;
  public code: string;
  public purpose: string;
  public LastModifiedBy: string;
  public value: string;
  public active: boolean;
  public parameterValueNum: any;
  public parameterValueDate: Date;
  public startDate: Date;
  public endDate: Date;
}
export class MaintainSystemParameterUpdateResponse extends BaseResponseData {
  public sysParamList: Array<MaintainSystemParameterUpdateResponse>;
}

export class MaintainSystemParameterEditResponse extends BaseResponseData {
  public sysParamList: Array<MaintainSystemParameterEditResponse>;
}

export class MaintainSystemParameterReq extends BaseRequest {
  public systemParam: string;
  public name: String;
  public code: string;
  public purpose: string;
  public value: string;
  public active: boolean;
}

export class MaintainSystemParameterEdit extends BaseRequest {
  public code: string;
  public purpose: string;
  public value: string;
  public active: boolean;
}
export class MaintainSystemParameterRes extends BaseRequest {
  public maintainSysCode: Array<MaintainSystemParameterRes>;
}

export class MaintainSystemParameterResSearch extends BaseResponseData {
  public maintainSysName: Array<MaintainSystemParameterResSearch>;
}
export class MaintainSHCMastersRequest extends BaseRequest {
  codSplHdl: string;
  desSplHdl: string;
  flgIta: string;
  codeSplHdlPri: string;
  startDate: string;
  endDate: string;
  flagUpdate: string;
  flagAdd: string;
}
export class MaintainSHCMastersResponse extends BaseResponseData {
  public masterShcCode: Array<MaintainSHCMastersResponse>;
}
export class MaintainSHCMasterSearchResponse extends BaseResponseData {
  public masterShcSearch: Array<MaintainSHCMasterSearchResponse>;
}
export class MaintainSHCMasterSearchRequest extends BaseRequest {
  public masterCodeSearch: string;
}
export class MaintainSHCMasterEditResponse extends BaseResponseData {
  public shcEdit: Array<MaintainSHCMasterEditResponse>;
}
export class MaintainSHCMasterEditRequest extends BaseRequest {
  public masterCodeEdit: string;
}
export class MaintainSHCMasterSaveResponse extends BaseResponseData {
  public shcSave: Array<MaintainSHCMasterSaveResponse>;
}
export class MaintainSHCMasterSaveRequest extends BaseRequest {
  codSplHdl: string;
  desSplHdl: string;
  flgIta: string;
  codSplHdlTyp: string;
  codeSplHdlPri: string;
  startDate: any;
  endDate: string;
  createdUserCode: "SYSADMIN";
  updatedUserCode: "SYSADMIN";
}
export class MaintainSHCMasterDescResponse extends BaseResponseData {
  public shcSave: Array<MaintainSHCMasterDescResponse>;
}
export class MaintainSHCMasterDescRequest extends BaseRequest {
  codSplHdl: string;
  desSplHdl: string;
}
export class MaintainSHCMasterUpdateResponse extends BaseResponseData {
  public shcUpdate: Array<MaintainSHCMasterUpdateResponse>;
}
export class MaintainSHCMasterUpdateRequest extends BaseRequest {
  codSplHdl: string;
  desSplHdl: string;
  flgIta: string;
  codSplHdlTyp: string;
  codeSplHdlPri: string;
  startDate: string;
  endDate: string;
  createdUserCode: "SYSADMIN";
  updatedUserCode: "SYSADMIN";
}
export class MaintainSHCMasterDeleteResponse extends BaseResponseData {
  public shcSave: Array<MaintainSHCMasterDeleteResponse>;
}
export class MaintainSHCMasterDeleteRequest extends BaseRequest {
  codSplHdl: string;
  desSplHdl: string;
}
export class MaintainSHCNonColoadableResponse extends BaseResponseData {
  public shcNon: Array<MaintainSHCNonColoadableResponse>;
}
export class MaintainSHCNonColoadableRequest extends BaseRequest {
  shcNon: string;
  shcNonDesc: string;
}
export class MaintainSHCNonColoadableUpdateResponse extends BaseResponseData {
  public shcNoncoloadable: Array<MaintainSHCNonColoadableUpdateResponse>;
}
export class MaintainSHCNonColoadableUpdateRequest extends BaseRequest {
  masterShc: string;
  shcCode: string;
  createdUserCode: "SYSADMIN";
  updatedUserCode: "SYSADMIN";
}
export class MaintainSHCNonColoadableUpdateRequestArray extends BaseRequest {
  public shcNoncoloadable: Array<MaintainSHCNonColoadableUpdateRequest>;
}
export class MaintainSHCNonColoadableDeleteResponse extends BaseResponseData {
  public shcNoncoloadableDelete: Array<MaintainSHCNonColoadableDeleteResponse>;
}
export class MaintainSHCNonColoadableDeleteRequest extends BaseRequest {
  masterShcDetails: string;
  shcCode: string;
}
export class MaintainMastersSearchRequest extends BaseRequest {
  public searchMasters: Array<MaintainMastersSearchData>;
}

export class MaintainMastersSearchData extends BaseRequest {
  public mType: string;
  public mTable: String;
  public mColName: string;
  public columnValue: string;
  public mDisplayColumn: string;
  public mDisplayOrd: string;
  public mMandatoryColumn: String;
  public mUniqueColumn: string;
  public mPK: string;
  public mColumnType: string;
  public mRegularExpression: String;
  public mRegExpMsg: string;
  public mSelectList: string;
  public mColumnLabel: string;
  public mSearchLabel: string;
  public mColumnDataType: string;
  public mCreateUserCode: string;
  public mCreatedtime: string;
  public mUpdatedUserCode: string;
  public mUpdatedTime: string;
  public flagDelete: Boolean;
  public mTableTitle: string;
  public mValueDescription: string;
}
// uld type start here
export class UldTypeSaveResponse extends BaseResponseData {
  public shcSave: Array<UldTypeSaveResponse>;
}
export class UldTypeSaveRequest extends BaseRequest {
  carrierCode: string;
  uldType: string;
  contourIndicator: string;
  tareWeight: string;
  mainCargoNetWeight: string;
  lowerCargoNetWeight: string;
  containerCount: string;
  groupType: string;
  minimumStock: string;
  maximumStock: string;
  maximumAging: string;
  plasticSheetQuantity: string;
  uldCharacteristicsId: number;
  defualt: string;
  aircraftType: string;
  createdUserCode: string;
  updatedUserCode: string;
  createdBy: string;
  modifiedBy: string;
}
export class UldTypeDetailsRequest extends BaseRequest {
  carrierCode: string;
  uldType: string;
  contourIndicator: string;
  tareWeight: string;
  mainCargoNetWeight: string;
  lowerCargoNetWeight: string;
  uldCharacteristicsId: number;
  halfPalletCount: string;
  groupType: string;
  minimumStock: string;
  maximumStock: string;
  plasticSheetQuantity: string;
  defualt: string;
  uldGroup: string;
}
export class UldTypeDetailsResponse extends BaseResponseData {
  public masterShcCode: Array<UldTypeDetailsResponse>;
}
export class UldTypeSearchRequest extends BaseRequest {
  carrierCode: string;
  uldType: string;
}
export class UldTypeSearchResponse extends BaseResponseData {
  public masterShcCode: Array<UldTypeSearchResponse>;
}
export class UldTypeDeleteResponse extends BaseResponseData {
  public uldTypeDelete: Array<UldTypeDeleteResponse>;
}
export class UldTypeDeleteRequest extends BaseRequest {
  carrierCode: string;
  uldType: string;
}
export class MaintainCodeAdminInsertRequest extends BaseRequest {
  public parameter2: string;
  public modifiedBy: string;
  public code: string;
  public desc: string;
  public createdBy: string;
  public flagInsert: boolean;
}
export class MaintainCodeAdminSearchRequest extends BaseRequest {
  public parameter1: string;
  public parameter2: string;
}
export class MaintainCodeAdminSearchResponse extends BaseResponseData {
  public adminSearch: Array<MaintainCodeAdminSearchResponse>;
}

export class MaintainCodeAdminInsertResponse extends BaseResponseData {
  public parameter2: string;
  public modifiedBy: string;
  public code: string;
  public desc: string;
  public createdBy: string;
  public flagInsert: boolean;
}
export class MaintainCodeAdminDeleteRequest extends BaseRequest {
  public parameter2: string;
  public code: string;
  public desc: string;
  public flagDelete: boolean;
}
export class MaintainCodeAdminDeleteResponse extends BaseRequest {
  public parameter2: string;
  public code: string;
  public desc: string;
  public flagDelete: boolean;
}
export class MaintainCodeAdminUpdateRequest extends BaseRequest {
  public parameter2: string;
  public code: string;
  public desc: string;
  public flagUpdate: boolean;
  public modifiedBy: string;
  public updatedCode: string;
  public updatedCodeDesc: string;
}
export class MaintainCodeAdminUpdateResponse extends BaseResponseData {
  public parameter2: string;
  // public modifiedBy:string;
  public code: string;
  public desc: string;
  public flagUpdate: boolean;
}
// carrier Code start here

export class CarrierCodeDetailsRequest extends BaseRequest {
  public carrierCode: string;
  public carrierShortName: string;
  public assistedCarrierFlag: string;
  public logo: string;
  public imagePath: string;
  public awbPrefix: string;
  public awbPrefixList: any[];
  public groundHandlerCode: any;
}

export class CarrierCodeDeleteRequest extends BaseRequest {
  public carrierCode: string;
  public carrierShortName: string;
  public assistedCarrierFlag: string;
  public groundHandlerCode: any;
  awbPrefix: string;
}

export class CarrierCodeDetailsResponse extends BaseResponseData {
  public masterShcCode: Array<CarrierCodeDetailsResponse>;
}
export class CarrierCodeSearchRequest extends BaseRequest {
  carrierCode: string;
  carrierShortName: string;
  awbPrefix: string;
  carrierAWBPrefix: string;
}
export class CarrierCodeSearchResponse extends BaseResponseData {
  public carrierCodeSearch: Array<CarrierCodeSearchResponse>;
}

export class CarrierCodeUpdateResponse extends BaseResponseData {
  public carrierCodeUpdate: Array<CarrierCodeUpdateResponse>;
}

export class AwbPrefixListRequest extends BaseRequest {
  public carrierCode: any;
}

export class AwbPrefixRequest extends BaseRequest {
  public carrierCode: string;
  public awbPrefix: string;
  public flagIATA: number;
  public awbModelCheckFlag: number;
  public flagUpdate: string;
  public flagInsert: string;
}

export class AwbPrefixListResponse extends BaseResponseData {
  public awBPrefixList: Array<AwbPrefixListResponse>;
}

export class MaintainUldSeriesResponse extends BaseResponseData {
  public uldsSeriesList: Array<MaintainUldSeriesResponse>;
}

export class MaintainUldSeriesRequest extends BaseRequest {
  public uldCarrierCode: string;
  public uldtype: string;
  public uldSeriesNumberFrom: string;
  public uldSeriesNumberTo: string;
  public uldSeriesTareWeight: number;
  public transactionSequenceNo: any;
  public operationCode: any;
}

export class MaintainUldSeriesDeleteRequest extends BaseRequest {
  public uldSeriesList: Array<MaintainUldSeriesRequest>;
}

export class CarrierCodeUpdateRequest extends BaseRequest {
  public carrierCode: string;
  public carrierShortName: string;
  public assistedCarrierFlag: string;
  public logo: string;
  public iataFlag: boolean;
  public volumeFlag: boolean;
  public cargoIqFlag: boolean;
  public imagePath: string;
  public groundHandlerCode: any;
  public dlsWeightUnit: string;
  public messageSequenceFlag: boolean;
  public pwgInd: boolean;
  public mailHandler: string;
  public autoFlightFlag: boolean;
  public notocFormat: string;
}

export class CarrierCodeAddRequest extends BaseRequest {
  public carrierCode: string;
  public carrierShortName: string;
  public assistedCarrierFlag: string;
  public logo: string;
  public volumeFlag: boolean;
  public cargoIqFlag: boolean;
  public iataFlag: boolean;
  public imagePath: string;
  public groundHandlerCode: any;
}

export class CarrierPrefix extends BaseRequest {
  public awbPrefix: string;
  public carrierCode: string;
  public flagIATA: string;
  public duties: string;
}

export class SearchTermsAndCondition extends BaseRequest {
  termConditionId: Number;
  functionCode: string;
  showTermCondition: boolean;
  termsConditionDetails: string;
}

export class SearchTAndC extends BaseResponseData {
  termConditionId: Number;
  functionCode: string;
  showTermCondition: boolean;
  termsConditionDetails: string;
}
// uld type start here
export class PlasticSheetsSaveResponse extends BaseResponseData {
  public shcSave: Array<PlasticSheetsSaveResponse>;
}
export class PlasticSheetsSaveRequest extends BaseRequest {
  carrierCode: string;
  uldType: string;
  contourIndicator: string;
  tareWeight: string;
  mainCargoNetWeight: string;
  lowerCargoNetWeight: string;
  containerCount: string;
  groupType: string;
  minimumStock: string;
  maximumStock: string;
  plasticSheetQuantity: string;
  defualtType: string;
  uldPlasticsheetId: number;
  accessoryType: string;
}
export class AirlinePlasticDeleteRequest extends BaseRequest {
  public carrierCode: string;
  public uldType: string;
  public contourIndicator: string;
  public containerCount: any;
}
export class AirlinePlasticSearchRequest extends BaseRequest {
  public carrierCode: string;
  public uldType: string;
  public contourIndicator: string;
  public containerCount: any;
}
export class AirlinePlasticSearchResponse extends BaseResponseData {
  public plasticSearchResponse: Array<AirlinePlasticSearchResponse>;
}
export class BroadcastResponse extends BaseRequest {

  notificationTitle: string;
  userGroupTo: string;
  roleCode: string;
  startDate: Date;
  expiryDate: Date;
  priority: string;
  message: string;
  userGroupList: any;

  check: boolean = false;
  carrierList: any;
  notificationType: any;

}

export class BroadcastNotificationDocumentModel extends BaseRequest {
  message: String
  ackdate: Date;

}

export class AuditBroadcastResponse extends BaseRequest {
  eventValue1: any;
  eventDateTime: Date;
  eventActor: string;
  eventName: string;
  eventAction: string;
  entityType: string;
  entityValue: string;
  eventValue: Array<BroadcastNotificationDocumentModel>;
}
export class BlackListAWBRequest extends BaseRequest {
  shipmentNumber: string;
  awbPrefixSearch: string;
  number: string;
  awbPrefix: string;
  fromNumber: string;
  toNumber: string;
  remarks: string;
}
