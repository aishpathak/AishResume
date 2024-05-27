import { MST_ENV } from "./../../environments/environment";
import { Injectable, EventEmitter } from "@angular/core";

import {
  MaintainSystemParameterUpdateResponse,
  MaintainSystemParameterUpdateRequest
} from "./masters.sharedmodel";
import {
  MaintainSystemParameterRes,
  MaintainSystemParameterReq,
  MaintainSystemParameterResSearch,
  MaintainSystemParameterEditResponse,
  MaintainUldSeriesResponse
} from "./masters.sharedmodel";
import {
  MaintainCodeAdminSearchResponse,
  MaintainCodeAdminSearchRequest,
  MaintainCodeAdminInsertRequest,
  MaintainCodeAdminInsertResponse,
  MaintainCodeAdminDeleteRequest,
  MaintainCodeAdminDeleteResponse,
  MaintainCodeAdminUpdateRequest,
  MaintainCodeAdminUpdateResponse,
  MaintainUldSeriesRequest,
  MaintainSHCMasterDeleteRequest,
  MaintainSHCMasterDeleteResponse,
  AwbPrefixListRequest,
  CarrierCodeAddRequest,
  AwbPrefixRequest,
  SearchTermsAndCondition
} from "./masters.sharedmodel";
import {
  MaintainUldSeriesDeleteRequest,
  CarrierCodeUpdateRequest,
  CarrierCodeUpdateResponse
} from "./masters.sharedmodel";
import {
  BaseService,
  RestService,
  BaseRequest,
  BaseResponse,
  TrackRestCallProgress
} from "ngc-framework";
import { NgcCoreModule } from "ngc-framework";
import { Observable } from "rxjs";

import { Http } from "@angular/http";
// import { BaseService, RestService, BaseRequest, BaseResponse } from 'ngc-framework';
// import { MaintainMastersResponse, MaintainMastersRequest } from './masters.sharedmodel';
// import { MaintainSystemParameterUpdateResponse, MaintainSystemParameterUpdateRequest } from './masters.sharedmodel';
// import { MaintainSystemParameterRes, MaintainSystemParameterReq, MaintainSystemParameterResSearch,
// MaintainSystemParameterEditResponse } from './masters.sharedmodel';
// Maintain SHC Models
import {
  MaintainSHCMastersRequest,
  MaintainSHCMastersResponse,
  MaintainSHCMasterSearchResponse,
  MaintainSHCMasterSearchRequest,
  MaintainSHCMasterEditResponse,
  MaintainSHCMasterEditRequest,
  MaintainSHCMasterSaveResponse,
  MaintainSHCMasterSaveRequest,
  MaintainSHCMasterDescResponse,
  MaintainSHCMasterDescRequest,
  MaintainSHCMasterUpdateResponse,
  MaintainSHCMasterUpdateRequest,
  MaintainSHCNonColoadableResponse,
  MaintainSHCNonColoadableRequest,
  AwbPrefixListResponse,
  MaintainSHCNonColoadableUpdateResponse,
  MaintainSHCNonColoadableUpdateRequest,
  CarrierCodeDeleteRequest,
  MaintainSHCNonColoadableDeleteResponse,
  MaintainSHCNonColoadableDeleteRequest,
  MaintainMastersRequest,
  MaintainMastersResponse,
  CarrierPrefix
} from "./masters.sharedmodel";
// ULD Type Model
import {
  UldTypeDetailsRequest,
  UldTypeDetailsResponse,
  UldTypeSearchRequest,
  UldTypeSearchResponse,
  UldTypeDeleteRequest,
  UldTypeDeleteResponse
} from "./masters.sharedmodel";
// Carrier Code  Model
import {
  CarrierCodeDetailsRequest,
  CarrierCodeDetailsResponse,
  CarrierCodeSearchRequest,
  CarrierCodeSearchResponse
} from "./masters.sharedmodel";
// ULD Type Model
import { UldTypeSaveRequest, UldTypeSaveResponse } from "./masters.sharedmodel";
// Airline Code  Model
import {
  PlasticSheetsSaveResponse,
  PlasticSheetsSaveRequest
} from "./masters.sharedmodel";

@Injectable()
export class MastersService extends BaseService {
  onSearch = new EventEmitter<MaintainMastersRequest>();
  constructor(private restService: RestService) {
    super();
  }

  @TrackRestCallProgress()
  public getMasterDetails(
    request
  ): Observable<BaseResponse<MaintainMastersResponse>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    request = {};
    return <Observable<
      BaseResponse<MaintainMastersResponse>
    >>this.restService.get(
      MST_ENV.serviceBaseURL + MST_ENV.mastersListBaseURL,
      request
    );
  }

  @TrackRestCallProgress()
  public getMasterDetailsHeader(
    request
  ): Observable<BaseResponse<MaintainMastersResponse>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    request = {};
    return <Observable<
      BaseResponse<MaintainMastersResponse>
    >>this.restService.get(
      MST_ENV.serviceBaseURL + MST_ENV.mastersListBaseURLHeader,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchMaster(
    request: MaintainMastersRequest
  ): Observable<BaseResponse<MaintainMastersResponse>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    return <Observable<
      BaseResponse<MaintainMastersResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.fetchMastersListBaseURL,
      request
    );
  }
  @TrackRestCallProgress()
  public fetchSystemParameter(
    request: MaintainSystemParameterReq
  ): Observable<BaseResponse<MaintainSystemParameterRes>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    return <Observable<
      BaseResponse<MaintainSystemParameterRes>
    >>this.restService.get(
      MST_ENV.serviceBaseURL + MST_ENV.fetchSystemParameterListBaseURL,
      request
    );
  }
  // search by name
  @TrackRestCallProgress()
  public fetchSystemParameterByName(
    request: string,
    request1: any
  ): Observable<BaseResponse<MaintainSystemParameterResSearch>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    return <Observable<
      BaseResponse<MaintainSystemParameterResSearch>
    >>this.restService.post(
      MST_ENV.serviceBaseURL +
      MST_ENV.fetchSystemParameterListByNameBaseURL +
      request,
      request1
    );
  }
  // update
  @TrackRestCallProgress()
  public updateSysParamter(
    request: MaintainSystemParameterUpdateRequest
  ): Observable<BaseResponse<MaintainSystemParameterEditResponse>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    return <Observable<
      BaseResponse<MaintainSystemParameterEditResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.updateSystemParameterBaseURL,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchMasterShcDetails(
    request: MaintainSHCMastersRequest
  ): Observable<BaseResponse<MaintainSHCMastersResponse>> {
    return <Observable<
      BaseResponse<MaintainSHCMastersResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.masterShcDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public searchMaintainShcDetails(
    request1: string,
    request2: any
  ): Observable<BaseResponse<MaintainSHCMasterSearchResponse>> {
    return <Observable<
      BaseResponse<MaintainSHCMasterSearchResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.searchMaintainShcDetails + request1,
      request2
    );
  }
  @TrackRestCallProgress()
  public edithMaintainShcDetails(
    request1: string,
    request2: any
  ): Observable<BaseResponse<MaintainSHCMasterEditResponse>> {
    return <Observable<
      BaseResponse<MaintainSHCMasterEditResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.edithMaintainShcDetails + request1,
      request2
    );
  }
  @TrackRestCallProgress()
  public saveMaintainShcDetails(
    request: MaintainSHCMasterSaveRequest
  ): Observable<BaseResponse<MaintainSHCMasterSaveResponse>> {
    console.log(JSON.stringify(request));
    return <Observable<
      BaseResponse<MaintainSHCMasterSaveResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.saveMaintainShcDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public searchShcCodeDesc(
    request1: string,
    request2: any
  ): Observable<BaseResponse<MaintainSHCMasterDescResponse>> {
    return <Observable<
      BaseResponse<MaintainSHCMasterDescResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.searchShcCodeDesc + request1,
      request2
    );
  }
  @TrackRestCallProgress()
  public updateShcDetails(
    request: MaintainSHCMasterUpdateRequest
  ): Observable<BaseResponse<MaintainSHCMasterUpdateResponse>> {
    console.log(JSON.stringify(request));
    return <Observable<
      BaseResponse<MaintainSHCMasterUpdateResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.updateShcDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public deleteShcDetails(
    request: MaintainSHCMasterDeleteRequest
  ): Observable<BaseResponse<MaintainSHCMasterDeleteResponse>> {
    console.log(JSON.stringify(request));
    return <Observable<
      BaseResponse<MaintainSHCMasterDeleteResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.deleteShcDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public editColoadableShcData(
    request1: string,
    request2: any
  ): Observable<BaseResponse<MaintainSHCNonColoadableResponse>> {
    console.log(JSON.stringify(request1));
    return <Observable<
      BaseResponse<MaintainSHCNonColoadableResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.editColoadableShcData + request1,
      request2
    );
  }
  @TrackRestCallProgress()
  public updateShcColoadableDetails(
    request: MaintainSHCNonColoadableUpdateRequest
  ): Observable<BaseResponse<MaintainSHCNonColoadableUpdateResponse>> {
    return <Observable<
      BaseResponse<MaintainSHCNonColoadableUpdateResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.updateShcColoadableDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public deleteShcColoadableShcData(
    request1: MaintainSHCNonColoadableDeleteRequest
  ): Observable<BaseResponse<MaintainSHCNonColoadableDeleteResponse>> {
    console.log(JSON.stringify(request1));
    return <Observable<
      BaseResponse<MaintainSHCNonColoadableDeleteResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.deleteShcColoadableShcData,
      request1
    );
  }

  @TrackRestCallProgress()
  public searchMasters(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.searchMasters,
      request
    );
  }

  @TrackRestCallProgress()
  public saveWindowData(request): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.saveWindowData,
      request
    );
  }
  @TrackRestCallProgress()
  public associatedmasterDetail(request): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.associatedmasterDetail,
      request
    );
  }

  @TrackRestCallProgress()
  public insertMasters(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.insertMasters,
      request
    );
  }

  @TrackRestCallProgress()
  public updateMasters(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.updateMasters,
      request
    );
  }
  // uld type sservice start here
  @TrackRestCallProgress()
  public saveUldTypeDetails(
    request: UldTypeSaveRequest
  ): Observable<BaseResponse<UldTypeSaveResponse>> {
    return <Observable<BaseResponse<UldTypeSaveResponse>>>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.uldTypeSaveDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public updateUldTypeDetails(
    request: UldTypeSaveRequest
  ): Observable<BaseResponse<UldTypeSaveResponse>> {
    return <Observable<BaseResponse<UldTypeSaveResponse>>>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.uldTypeUpdateDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public fetchUldTypeDetails(
    request: UldTypeDetailsRequest
  ): Observable<BaseResponse<UldTypeDetailsResponse>> {
    return <Observable<
      BaseResponse<UldTypeDetailsResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.getUldTypeListDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public searchUldTypeDetails(
    request: UldTypeSearchRequest
  ): Observable<BaseResponse<UldTypeSearchResponse>> {
    return <Observable<
      BaseResponse<UldTypeSearchResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.uldTypeSearchDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public deleteUldType(
    request: UldTypeDeleteRequest
  ): Observable<BaseResponse<UldTypeDeleteResponse>> {
    return <Observable<
      BaseResponse<UldTypeDeleteResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.deleteUldTypeDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public saveAircraftTypeDetails(
    request: UldTypeSaveRequest
  ): Observable<BaseResponse<UldTypeSaveResponse>> {
    return <Observable<BaseResponse<UldTypeSaveResponse>>>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.aircraftTypeSaveDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public editAircraftType(
    request: UldTypeSaveRequest
  ): Observable<BaseResponse<UldTypeSaveResponse>> {
    return <Observable<BaseResponse<UldTypeSaveResponse>>>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.editAircraftType,
      request
    );
  }
  @TrackRestCallProgress()
  public deleteAircraftType(
    request: UldTypeDeleteRequest
  ): Observable<BaseResponse<UldTypeDeleteResponse>> {
    return <Observable<
      BaseResponse<UldTypeDeleteResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.deleteAircraftType,
      request
    );
  }
  // uld type service end here
  // carrier code service start here
  @TrackRestCallProgress()
  public fetchCarrierCodeDetails(
    request: CarrierCodeDetailsRequest
  ): Observable<BaseResponse<CarrierCodeDetailsResponse>> {
    return <Observable<
      BaseResponse<CarrierCodeDetailsResponse>
    >>this.restService.get(
      MST_ENV.serviceBaseURL + MST_ENV.getCarrierCodeListDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public searchCarrierCodeDetails(
    request: CarrierCodeSearchRequest
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.searchCarrierCodeListDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public updateCarrierCodeDetails(
    request: CarrierCodeDetailsRequest
  ): Observable<BaseResponse<CarrierCodeUpdateResponse>> {
    return <Observable<
      BaseResponse<CarrierCodeUpdateResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.carrierCodeUpdateDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public fetchMastersDataOnDropDownSelection(
    request: MaintainCodeAdminSearchRequest
  ): Observable<BaseResponse<MaintainCodeAdminSearchResponse>> {
    return <Observable<
      BaseResponse<MaintainCodeAdminSearchResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.mastersCodeAdminDropdownDataTableURL,
      request
    );
  }

  @TrackRestCallProgress()
  public insertMastersCodeDesc(
    request: MaintainCodeAdminInsertRequest
  ): Observable<BaseResponse<MaintainCodeAdminInsertResponse>> {
    return <Observable<
      BaseResponse<MaintainCodeAdminInsertResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.mastersCodeAdminInsertURL,
      request
    );
  }

  @TrackRestCallProgress()
  public deleteMastersCodeDesc(
    request: any
  ): Observable<BaseResponse<MaintainCodeAdminSearchResponse>> {
    return <Observable<
      BaseResponse<MaintainCodeAdminSearchResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.mastersCodeAdminDeleteURL,
      request
    );
  }

  @TrackRestCallProgress()
  public updateMastersCodeDesc(
    request: MaintainCodeAdminUpdateRequest
  ): Observable<BaseResponse<MaintainCodeAdminUpdateResponse>> {
    return <Observable<
      BaseResponse<MaintainCodeAdminUpdateResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.mastersCodeAdminUpdateURL,
      request
    );
  }

  // Service is used to fetch ULD Series list
  @TrackRestCallProgress()
  public fetchUldSeriesList(
    request: MaintainUldSeriesRequest
  ): Observable<BaseResponse<MaintainUldSeriesResponse>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    return <Observable<
      BaseResponse<MaintainUldSeriesResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.uldSeriesURL,
      request
    );
  }

  // Service is used to fetch filtered data from ULD Series list
  @TrackRestCallProgress()
  public searchUldSeriesByCarrierCode(
    request: MaintainUldSeriesRequest
  ): Observable<BaseResponse<MaintainUldSeriesResponse>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    return <Observable<
      BaseResponse<MaintainUldSeriesResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.uldSeriesSearchURL,
      request
    );
  }

  @TrackRestCallProgress()
  public updateUldSeriesData(
    request: MaintainUldSeriesRequest
  ): Observable<BaseResponse<MaintainUldSeriesResponse>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    return <Observable<
      BaseResponse<MaintainUldSeriesResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.uldSeriesUpdateURL,
      request
    );
  }

  @TrackRestCallProgress()
  public addUldSeriesData(
    request: MaintainUldSeriesRequest
  ): Observable<BaseResponse<MaintainUldSeriesResponse>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    return <Observable<
      BaseResponse<MaintainUldSeriesResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.addUldSeriesURL,
      request
    );
  }

  @TrackRestCallProgress()
  public deleteUldSeriesData(
    request: MaintainUldSeriesDeleteRequest
  ): Observable<BaseResponse<MaintainUldSeriesResponse>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    return <Observable<
      BaseResponse<MaintainUldSeriesResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.deleteUldSeriesURL,
      request
    );
  }

  @TrackRestCallProgress()
  public updateCarrierCodeData(
    request: CarrierCodeUpdateRequest
  ): Observable<BaseResponse<CarrierCodeUpdateResponse>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    return <Observable<
      BaseResponse<CarrierCodeUpdateResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.carrierCodeUpdateURL,
      request
    );
  }

  @TrackRestCallProgress()
  public addCarrierCodeData(
    request: CarrierCodeUpdateRequest
  ): Observable<BaseResponse<CarrierCodeUpdateResponse>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    return <Observable<
      BaseResponse<CarrierCodeUpdateResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.carrierCodeAddURL,
      request
    );
  }

  @TrackRestCallProgress()
  public deleteCarrierCodeData(
    request: CarrierCodeDeleteRequest
  ): Observable<BaseResponse<CarrierCodeDetailsResponse>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    return <Observable<
      BaseResponse<CarrierCodeDetailsResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.deleteCarrierCodeURL,
      request
    );
  }

  @TrackRestCallProgress()
  public abWPrefixList(
    request: AwbPrefixListRequest
  ): Observable<BaseResponse<AwbPrefixListResponse>> {
    return <Observable<
      BaseResponse<AwbPrefixListResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.awbPrefixURL,
      request
    );
  }

  //
  @TrackRestCallProgress()
  public deleteMasters(request: any): Observable<BaseResponse<any>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    console.log(JSON.stringify(request));
    return <Observable<
      BaseResponse<CarrierCodeDetailsResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.deleteMasters,
      request
    );
  }

  @TrackRestCallProgress()
  public updateAwbPrefixList(
    request: AwbPrefixRequest
  ): Observable<BaseResponse<AwbPrefixListResponse>> {
    return <Observable<
      BaseResponse<AwbPrefixListResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.updateAwbPrefixListURL,
      request
    );
  }

  @TrackRestCallProgress()
  public addAWbPrefixList(
    request: AwbPrefixRequest
  ): Observable<BaseResponse<AwbPrefixListResponse>> {
    return <Observable<
      BaseResponse<AwbPrefixListResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.addAwbPrefixListURL,
      request
    );
  }

  @TrackRestCallProgress()
  public deleteAbWPrefixList(
    request: AwbPrefixRequest
  ): Observable<BaseResponse<AwbPrefixListResponse>> {
    return <Observable<
      BaseResponse<AwbPrefixListResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.deleteAwbPrefixListURL,
      request
    );
  }
  //   public addCarrierCodeData(request: CarrierCodeAddRequest): Observable<BaseResponse<CarrierCodeDetailsResponse>> {
  //   //let baseURL = !serverBaseURL ? "/" : serverBaseURL;
  //   return <Observable<BaseResponse<CarrierCodeDetailsResponse>>>this.restService.post
  //     (MST_ENV.serviceBaseURL + MST_ENV.carrierCodeAddURL, request);
  // }

  @TrackRestCallProgress()
  public searchList(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      MST_ENV.serviceAgentURL + MST_ENV.searchList,
      request
    );
  }

  public maintainList(
    request: SearchTermsAndCondition
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      MST_ENV.serviceAgentURL + MST_ENV.maintainList,
      request
    );
  }

  public updateList(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      MST_ENV.serviceAgentURL + MST_ENV.updateList,
      request
    );
  }
  @TrackRestCallProgress()
  public saveAirlinePlasticList(
    request: PlasticSheetsSaveRequest
  ): Observable<BaseResponse<PlasticSheetsSaveResponse>> {
    return <Observable<
      BaseResponse<PlasticSheetsSaveResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.saveAirlinePlasticList,
      request
    );
  }

  @TrackRestCallProgress()
  public updatePlasticSheet(
    request: PlasticSheetsSaveRequest
  ): Observable<BaseResponse<PlasticSheetsSaveResponse>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    return <Observable<
      BaseResponse<PlasticSheetsSaveResponse>
    >>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.updatePlasticSheet,
      request
    );
  }

  @TrackRestCallProgress()
  public searchAirlineList(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.searchAirlineList,
      request
    );
  }
  @TrackRestCallProgress()
  public deletePlasticSheets(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      MST_ENV.serviceBaseURL + MST_ENV.deletePlasticSheets,
      request
    );
  }
  @TrackRestCallProgress()
  public addData(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceAgentURL + MST_ENV.messageData, request);
  }

  @TrackRestCallProgress()
  public fetchBroadCastData(): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceAgentURL + MST_ENV.fetchbroadcastData, null);
  }

  @TrackRestCallProgress()
  public deleteData(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceAgentURL + MST_ENV.deletebroadcastData, request);
  }

  @TrackRestCallProgress()
  public savePartBooking(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.savePartBooking, request);
  }

  // CODE ADMINISTRATION REVAMP SCREEN //

  @TrackRestCallProgress()
  public onSaveCodeAdministration(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.onSaveCodeAdministration, request);
  }

  @TrackRestCallProgress()
  public onSaveCodeAdministrationCode(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.onSaveCodeAdministrationCode, request);
  }

  @TrackRestCallProgress()
  public onSaveCodeAdministrationDetails(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.onSaveCodeAdministrationDetails, request);
  }

  @TrackRestCallProgress()
  public fetchSelectData(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (MST_ENV.serviceBaseURL + MST_ENV.fetchSelectData, request);
  }

  @TrackRestCallProgress()
  public fetchSelectDataCode(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (MST_ENV.serviceBaseURL + MST_ENV.fetchSelectDataCode, request);
  }

  @TrackRestCallProgress()
  public fetchSelectDataDetails(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.fetchSelectDataDetails, request);
  }

  // CODE ADMINISTRATION REVAMP SCREEN //

  @TrackRestCallProgress()
  public fetchBroadCastNData(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceAgentURL + MST_ENV.fetchbroadcastNData, request);
  }


  @TrackRestCallProgress()
  public insertAuditInfo(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceAgentURL + MST_ENV.insertAuditInfo, request);
  }

  @TrackRestCallProgress()
  public searchBlackListAWB(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.searchBlackListAWB, request);
  }

  @TrackRestCallProgress()
  public saveAddedRangeForBlackListAWB(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.saveAddedRangeForBlackListAWB, request);
  }

  @TrackRestCallProgress()
  public deleteRangeForBlackListAWB(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.deleteRangeForBlackListAWB, request);
  } 
 
  @TrackRestCallProgress()
  public deleteGroupCode(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.deleteGroupCodeURL, request);
  } 

  @TrackRestCallProgress()
  public deleteSubGroupCode(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.deleteSubGroupCodeURL, request);
  } 

  @TrackRestCallProgress()
  public fetchBuBdOfficeDetails(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.fetchBuBdOfficeDetails, request);
  }

  @TrackRestCallProgress()
  public saveBuBdDetails(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.saveBuBdDetails, request);
  }
}
