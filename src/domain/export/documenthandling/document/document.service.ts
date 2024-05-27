import { Environment, DomainEnvironement, EXPBU_ENV, CFG_ENV } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService, RestService, BaseRequest, BaseResponse, TrackRestCallProgress } from 'ngc-framework';
import {
  UpdateDocumentViewDataResponse,
  CheckValidPasswordResponseData, GetLoginDetails, UpdateDocumentResponseData, UpdateAdminColourResponseData, UpdateAdminColourResultBO,
  DocumentViewResponseData, DocumentViewRequestDTO, DocumenthandlingmasterRequest, AdminColourRequest, AdminColourResponseData,
  LocationConfigRequest, LocationConfigResultBO, LocationConfigResponseData, DocumenthandlingmasterResultBO, DocumenthandlingmasterResponseData, FlightViewRequestObject, DashboardTVRequestBO, LoginRequestData, ReportRequest, UpdateDocumentRequestDTO, PigeonHoleLocationFlightMapping, DateRangeReportRequest, FlightReportRequest
} from './document.sharedmodel';

@Injectable()
export class DocumentService extends BaseService {

  flightViewReq: any = {};

  constructor(private restService: RestService) {
    super();
  }

  public fltMasking(fightNum) {
    if (fightNum == null || fightNum == '') {
      return fightNum;
    }
    else {
      let fltNum = fightNum;
      let car = fltNum.substring(0, 2);
      let fnum = fltNum.substring(2, 6);
      let maskedFltNum = car + ("0000" + fnum).slice(-4);
      return maskedFltNum;
    }
  }

  public fltNumMasking(fightNum) {
    if (fightNum == null || fightNum == '') {
      return fightNum;
    }
    else {
      if (fightNum.length <= 4) {
        let maskedFltNum = ("0000" + fightNum).slice(-4);
        return maskedFltNum;
      }
      else if (fightNum.length > 4) {
        return fightNum;
      }
    }
  }

  public trimPouch(pouchId) {
    if (pouchId == null || pouchId == '') {
      return pouchId;
    }
    else {
      let trimmedPouchId = pouchId.trim();
      return trimmedPouchId;
    }
  }

  @TrackRestCallProgress()
  public getDataOnDashboardPageLoad(request: DashboardTVRequestBO) {
    return <Observable<any>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.dashBoardList, request);
  }

  //adminconsole
  @TrackRestCallProgress()
  public getAdminConsole(request: AdminColourRequest) {
    return <Observable<any>>this.restService.get(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.adminConsole, request);
  }
  @TrackRestCallProgress()
  public updateAdminColour(request: UpdateAdminColourResultBO): Observable<BaseResponse<UpdateAdminColourResponseData>> {
    return <Observable<BaseResponse<UpdateAdminColourResponseData>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateAdminColour, request);
  }

  //Login
  // public getValidPassword(request: CheckValidPasswordResultBO) {
  //     console.log("Login request service: "+(request));
  //     console.log(JSON.stringify(request));
  //     return <Observable<BaseResponse<CheckValidPasswordResponseData>>>this.restService.post(Environment.serviceBaseURL + DomainEnvironement.login, request);
  // }

  // public performLogin(request: LoginRequestData) {
  //     return <Observable<BaseResponse<CheckValidPasswordResponseData>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.performLogin, request);
  // }

  @TrackRestCallProgress()
  public getLoginDetails(request: GetLoginDetails) {
    return <Observable<BaseResponse<CheckValidPasswordResponseData>>>this.restService.get(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getLoginDetails, request);
  }

  //document view
  @TrackRestCallProgress()
  public getDocumentViewDetails(request: DocumentViewRequestDTO) {
    return <Observable<BaseResponse<any>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getDocumentView, request);
  }

  //get update document view
  // public getUpdateDocumentData(request: DocumentViewResultBO) {
  //     return <Observable<BaseResponse<DocumentViewResponseData>>>this.restService.post(Environment.serviceBaseURL + Environment.getUpdateDocumentView, request);
  // }
  @TrackRestCallProgress()
  public getUpdateDocumentData(updateDocumentRequestDTO: UpdateDocumentRequestDTO) {
    return <Observable<BaseResponse<any>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getUpdateDocumentView, updateDocumentRequestDTO);
  }

  //update Documents
  // public updateRemark(request: any) {
  //     return <Observable<BaseResponse<UpdateDocumentViewDataResponse>>>this.restService.post(Environment.serviceBaseURL + DomainEnvironement.updateremark, request);
  // }
  @TrackRestCallProgress()
  public updateAWBDocDetails(request: any) {
    return <Observable<BaseResponse<UpdateDocumentViewDataResponse>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateAWBDocDetails, request);
  }
  @TrackRestCallProgress()
  public getNewAwbCreateCopy(request: UpdateDocumentRequestDTO) {
    return <Observable<BaseResponse<UpdateDocumentViewDataResponse>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveNewAwbCopyDetails, request);
  }

  //-- Abhishek: Update Document View - Delete Document-Copy
  @TrackRestCallProgress()
  deleteDocumentCopy(request: UpdateDocumentRequestDTO) {
    return <Observable<BaseResponse<UpdateDocumentViewDataResponse>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteDocumentCopy, request);
  }

  //-- Abhishek: Update Document View - Delete Document-Original
  @TrackRestCallProgress()
  updateDocumentOrignal(request: UpdateDocumentRequestDTO) {
    return <Observable<BaseResponse<UpdateDocumentViewDataResponse>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateDocumentOrignal, request);
  }

  //location master
  @TrackRestCallProgress()
  public getLocationConfigDetails(request: LocationConfigResultBO) {
    return <Observable<BaseResponse<LocationConfigResponseData>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getLocationConfigDetails, request);
  }

  //Location Master Edit table
  @TrackRestCallProgress()
  public getLocationConfigEdit(request: LocationConfigResultBO) {
    return <Observable<BaseResponse<LocationConfigResponseData>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getLocationConfigEdit, request);
  }

  //Location Master Edit table
  @TrackRestCallProgress()
  public getLocationConfigEditForFlightMapping(request: LocationConfigResultBO) {
    return <Observable<BaseResponse<LocationConfigResponseData>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getFlightMappingDetails, request);
  }

  //Location Master Edit table
  @TrackRestCallProgress()
  public deleteRecordsTypeForDocument(request: LocationConfigResultBO) {
    return <Observable<BaseResponse<LocationConfigResponseData>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteLocationRecordsForDocument, request);
  }
  //Location Master Edit table
  @TrackRestCallProgress()
  public deleteRecordsTypeForFlight(request: LocationConfigResultBO) {
    return <Observable<BaseResponse<LocationConfigResponseData>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteLocationRecordsForFlight, request);
  }

  //Location Add Row
  @TrackRestCallProgress()
  public SaveLocationConfigEdit(request: LocationConfigResultBO) {
    return <Observable<BaseResponse<String>>>this.restService.cleanAndPost(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.SaveLocationConfigEdit, request);
  }

  // //Get Droup Down List
  // public getOfficeAndTypeDroupDown(request:LocationConfigResultBO){
  //         return <Observable<BaseResponse<LocationConfigResponseData>>>this.restService.get("http://localhost:7001/CDHSpringBootRestService/locationconfig/getlocationtypedrop-down", request);
  //     }

  // //Get Droup Down List for Carriew , destination and flight No.
  // public getFlightCarAndDesDroupDown(request:LocationConfigRequest){
  //         return <Observable<BaseResponse<LocationConfigResponseData>>>this.restService.get("http://localhost:7001/CDHSpringBootRestService/locationconfig/getflightselect", request);
  //     }
  @TrackRestCallProgress()
  public updateLocation(request: LocationConfigResultBO) {
    return <Observable<BaseResponse<LocationConfigResponseData>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateLocation, request);
  }
  // @TrackRestCallProgress()
  // deleteLocationRow(request: LocationConfigResultBO) {
  //   return <Observable<BaseResponse<LocationConfigResponseData>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteLocationRow, request);
  // }
  @TrackRestCallProgress()
  deleteFlightForPigeonhole(request: PigeonHoleLocationFlightMapping) {
    return <Observable<BaseResponse<LocationConfigResponseData>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deletePigeonHoleForFlight, request);
  }
  @TrackRestCallProgress()
  public getDocumentHandlingMaster(request: DocumenthandlingmasterRequest) {
    return <Observable<BaseResponse<DocumenthandlingmasterResponseData>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getDocumentMaster, request);
  }
  @TrackRestCallProgress()
  public getDeliveryToList(request: LocationConfigResultBO) {
    return <Observable<BaseResponse<any>>>this.restService.post(CFG_ENV.serviceBaseURL + CFG_ENV.dropDownListURL, request);
  }
  @TrackRestCallProgress()
  public updateDocumentHandlingMaster(request): Observable<any> {
    return <Observable<BaseResponse<DocumenthandlingmasterResponseData>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateDocumentMaster, request);
  }
  @TrackRestCallProgress()
  public getColorCodesOnFlightViewPageLoad(request: BaseRequest) {
    return <Observable<any>>this.restService.get(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getColorCodesOnFlightViewPageLoad, request);
  }

  @TrackRestCallProgress()
  public getFlightViewDetails(request: FlightViewRequestObject) {
    return <Observable<any>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getFlightViewDetails, request);
  }

  @TrackRestCallProgress()
  public updatePHLocation(request: FlightViewRequestObject) {
    return <Observable<any>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updatePHLocation, request);
  }

  // public getPigeonHoleFlights(request): Observable<any> {
  //     return <Observable<any>>this.restService.get("http://localhost:3000/services/pigeonholeflight", request);
  // }
  @TrackRestCallProgress()
  public exportDocumentReport(reportRequest: ReportRequest) {
    return <Observable<any>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getFlightViewDetails, reportRequest);
  }
  @TrackRestCallProgress()
  public exportPouchReport(reportRequest: ReportRequest) {
    return <Observable<any>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getFlightViewDetails, reportRequest);
  }

  @TrackRestCallProgress()
  public getDateRangeReport(request: DateRangeReportRequest) {
    return <Observable<any>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getDateRangeReport, request);
  }

  @TrackRestCallProgress()
  public getFlightReport(request: FlightReportRequest) {
    return <Observable<any>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getFlightReport, request);
  }


}
