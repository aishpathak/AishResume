import { Injectable } from "@angular/core";
import {
  BaseResponse,
  RestService,
  BaseService,
  BaseRequest,
  TrackRestCallProgress
} from "ngc-framework";
import { Observable } from "rxjs";
import { log } from "util";
import { EXP_ENV, EXPBU_ENV } from "../../../environments/environment";
import { Notoc } from "../export.sharedmodel";

@Injectable()
export class NotocService {
  constructor(private restService: RestService) {}

  @TrackRestCallProgress()
  public fetchSearchFlight(request: Notoc): Observable<BaseResponse<Notoc>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.notocFetchFlight,
      request
    );
  }

  @TrackRestCallProgress()
  public saveNotocDetail(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.notocSaveDetail,
      request
    );
  }

  @TrackRestCallProgress()
  public finalize(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.finalizeDone,
      request
    );
  }

  @TrackRestCallProgress()
  public Unfinalize(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.UnfinalizeDone,
      request
    );
  }
}
