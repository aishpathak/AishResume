import { log } from "util";
import {
  BaseResponse,
  RestService,
  BaseService,
  BaseRequest,
  TrackRestCallProgress
} from "ngc-framework";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuditRequest } from "./audit.sharedmodel";

// EXP_ENV/Configuration
import {
  EXP_ENV,
  AWB_ENV,
  EXPBU_ENV,
  CFG_ENV,
  WH_ENV,
  ADM_ENV
} from "../../environments/environment";

@Injectable()
export class AuditService extends BaseService {
  constructor(private restService: RestService) {
    super();
  }

  @TrackRestCallProgress()
  public onSearch(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSearchAudit, request);
  }
  @TrackRestCallProgress()
  public onAWBAuditSearch(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSearchAWBAudit, request);
  }
  @TrackRestCallProgress()
  public onULDTrolleyAuditSearch(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSearchULDTrolleyAudit, request);
  }
  @TrackRestCallProgress()
  public onAgentAuditSearch(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSearchAgentAudit, request);
  }
  @TrackRestCallProgress()
  public onBillingAuditSearch(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSearchBillingAudit, request);
  }
  @TrackRestCallProgress()
  public onEFacilitationAuditSearch(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSearchEFacilitationAudit, request);
  }
  @TrackRestCallProgress()
  public onEquipmentAuditSearch(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSearchEquipmentAudit, request);
  }

  @TrackRestCallProgress()
  public getAuditTrailByFlight(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.getAuditTrailByFlight, request);
  }

  @TrackRestCallProgress()
  public getAuditTrailByLocation(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.getAuditTrailByLocation, request);
  }

  @TrackRestCallProgress()
  public getAuditTrailByCustoms(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.getAuditTrailByCustoms, request);
  }

  @TrackRestCallProgress()
  public getAuditTrailByCustomer(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.getAuditTrailByCustomer, request);
  }

  @TrackRestCallProgress()
  public getAuditTrailByTracing(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.getAuditTrailByTracing, request);
  }

  @TrackRestCallProgress()
  public getAuditTrailByMasters(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.getAuditTrailByMasters, request);
  }
  @TrackRestCallProgress()
  public onMailBagAuditSearch(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSearchMailBagAudit, request);
  }

  @TrackRestCallProgress()
  public getAuditTrailByUserRole(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.getAuditTrailByUserRole, request);
  }
  @TrackRestCallProgress()
  public getAuditTrailByVAL(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.getAuditTrailByVAL, request);
  }
  
  
  @TrackRestCallProgress()
  public getAuditTrailByCDH(request:
    AuditRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.getAuditTrailByCDH, request);
  }
}