import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request } from './../model/resp';
import { Environment } from '../../environments/environment';
import {
  SearchShipment, InboundResponse,
  SearchEnquireValShipment, IncomingRequest, OutboundResponse,
} from './../valManagement/val.sharemodel';
import {
  SearchForTaskList, TaskListResult, SearchEquipment, ListOfEquipment, EquipmentPrepData, EquipmentReleaseInfo,
  EquipmentReleaseContainerInfo, EquipmentSerachRequest, EquipmentReqShipments,
  EquipmentRequest, SearchForRequestList, EquipmentListResult, CreateEquipmentRequestByULDModel, CreateTrip, EquipmentRequestByULD
} from './equipmentsharedmodel';
import { NgcCoreModule, BaseResponse, RestService, TrackRestCallProgress } from 'ngc-framework';


import { EQP_ENV, RPT_ENV } from '../../environments/environment';

@Injectable()
export class EquipmentService {


  constructor(private restService: RestService) { }

  @TrackRestCallProgress()
  public searchResult(request: SearchEquipment):
    Observable<BaseResponse<ListOfEquipment>> {
    return <Observable<BaseResponse<ListOfEquipment>>>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.equipmentTripSearch, request);
  }

  @TrackRestCallProgress()
  public createTrip(request: CreateTrip):
    Observable<BaseResponse<CreateTrip>> {
    return <Observable<BaseResponse<CreateTrip>>>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.equipmentCreateTrip, request);
  }

  @TrackRestCallProgress()
  public preparation(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.preparationlist, request);
  }

  @TrackRestCallProgress()
  public savepreparation(request):
    Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.savepreparationlist, request);
  }


  @TrackRestCallProgress()
  public searchTaskList(request: SearchForTaskList):
    Observable<BaseResponse<TaskListResult>> {
    return <Observable<BaseResponse<TaskListResult>>>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.equipTasklist, request);
  }

  @TrackRestCallProgress()
  public prepareTaskList(request: any):
    Observable<BaseResponse<TaskListResult>> {
    return <Observable<BaseResponse<TaskListResult>>>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.prepareTasklist, request);
  }

  @TrackRestCallProgress()
  public searchByReqId(request: EquipmentSerachRequest): Observable<BaseResponse<EquipmentReqShipments>> {
    return <Observable<BaseResponse<EquipmentReqShipments>>>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.fetchByEqupId, request);
  }

  @TrackRestCallProgress()
  public searchByFlight(request: EquipmentSerachRequest): Observable<BaseResponse<EquipmentReqShipments>> {
    return <Observable<BaseResponse<EquipmentReqShipments>>>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.fetchByFlight, request);
  }

  @TrackRestCallProgress()
  public searchByAWB(request: EquipmentReqShipments): Observable<BaseResponse<EquipmentReqShipments>> {
    return <Observable<BaseResponse<EquipmentReqShipments>>>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.fetchByAWB, request);
  }

  @TrackRestCallProgress()
  public saveDeliveryRequest(request: EquipmentRequest): Observable<BaseResponse<EquipmentRequest>> {
    return <Observable<BaseResponse<EquipmentRequest>>>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.saveEquipmentRequest, request);
  }

  @TrackRestCallProgress()
  public searchrequlist(request: SearchForRequestList): Observable<BaseResponse<EquipmentListResult>> {
    return <Observable<BaseResponse<EquipmentListResult>>>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.equipRequestlist, request);
  }
  @TrackRestCallProgress()
  public searchEquipmentReleaseReturn(request: any): any {
    return <any>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.equipReleaseReturn, request);
  }

  @TrackRestCallProgress()
  public forceReturn(request: any): any {
    return <any>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.forceReturn, request);
  }
  @TrackRestCallProgress()
  public return(request: any): any {
    return <any>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.return, request);
  }

  @TrackRestCallProgress()
  public searchEquipmentReturnAirline(request: any): any {
    return <any>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.searchEquipmentReturnAirlineDetail, request);
  }

  @TrackRestCallProgress()
  public deleteEquipmentRequest(request: SearchForTaskList): any {
    return <Observable<BaseResponse<SearchForTaskList>>>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.deleteEquipmentRequest, request);
  }

  @TrackRestCallProgress()
  public saveEquipmentReqByULD(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EQP_ENV.serviceBaseURL + EQP_ENV.saveEquipmentRequestByULD, request);
  }
  @TrackRestCallProgress()
  public maintain(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EQP_ENV.serviceBaseURL + EQP_ENV.maintain, request);
  }
  @TrackRestCallProgress()
  public printReport(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (RPT_ENV.serviceBaseURL + RPT_ENV.reportURL, request);
  }
  @TrackRestCallProgress()
  public cancel(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EQP_ENV.serviceBaseURL + EQP_ENV.cancel, request);
  }
  @TrackRestCallProgress()
  public approve(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EQP_ENV.serviceBaseURL + EQP_ENV.approve, request);
  }
  @TrackRestCallProgress()
  public splitEir(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EQP_ENV.serviceBaseURL + EQP_ENV.splitEir, request);
  }

  @TrackRestCallProgress()
  public delete(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EQP_ENV.serviceBaseURL + EQP_ENV.delete, request);
  }

  @TrackRestCallProgress()
  public fetchEquipmentRequestData(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EQP_ENV.serviceBaseURL + EQP_ENV.fetchEquipmentRequestData, request);
  }

  @TrackRestCallProgress()
  public edit(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EQP_ENV.serviceBaseURL + EQP_ENV.edit, request);
  }

  @TrackRestCallProgress()
  public releaseEIR(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EQP_ENV.serviceBaseURL + EQP_ENV.releaseEIR, request);
  }
}
