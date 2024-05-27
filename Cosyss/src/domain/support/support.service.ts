import { log } from 'util';
import { Observable } from 'rxjs';
import { Request } from './../model/resp';
import { Injectable } from '@angular/core';
import { EXP_ENV, AWB_ENV, EXPBU_ENV, CFG_ENV, BATCH_ENV } from '../../environments/environment';
import { BaseResponse, RestService, BaseService, BaseRequest, TrackRestCallProgress } from 'ngc-framework';
@Injectable()
export class SupportService extends BaseService {
  constructor(private restService: RestService) {
    super();
  }

  @TrackRestCallProgress()
  public searchJob(): Observable<BaseResponse<Array<any>>> {
    return <Observable<BaseResponse<Array<any>>>>
      this.restService.post(BATCH_ENV.serviceBaseURL + BATCH_ENV.searchJob, new BaseRequest());
  }

  @TrackRestCallProgress()
  public startJob(request): Observable<BaseResponse<Array<any>>> {
    return <Observable<BaseResponse<Array<any>>>>
      this.restService.post(BATCH_ENV.serviceBaseURL + BATCH_ENV.startJob, request);
  }

  @TrackRestCallProgress()
  public createJob(request): Observable<BaseResponse<Array<any>>> {
    return <Observable<BaseResponse<Array<any>>>>
      this.restService.post(BATCH_ENV.serviceBaseURL + BATCH_ENV.createJob, request);
  }

  @TrackRestCallProgress()
  public pauseJob(request): Observable<BaseResponse<Array<any>>> {
    return <Observable<BaseResponse<Array<any>>>>
      this.restService.post(BATCH_ENV.serviceBaseURL + BATCH_ENV.pauseJob, request);
  }

  @TrackRestCallProgress()
  public resumeJob(request): Observable<BaseResponse<Array<any>>> {
    return <Observable<BaseResponse<Array<any>>>>
      this.restService.post(BATCH_ENV.serviceBaseURL + BATCH_ENV.resumeJob, request);
  }

  @TrackRestCallProgress()
  public deleteJob(request): Observable<BaseResponse<Array<any>>> {
    return <Observable<BaseResponse<Array<any>>>>
      this.restService.post(BATCH_ENV.serviceBaseURL + BATCH_ENV.deleteJob, request);
  }

  @TrackRestCallProgress()
  public stopJob(request): Observable<BaseResponse<Array<any>>> {
    return <Observable<BaseResponse<Array<any>>>>
      this.restService.post(BATCH_ENV.serviceBaseURL + BATCH_ENV.stopJob, request);
  }

  @TrackRestCallProgress()
  public cleanupJob(request): Observable<BaseResponse<Array<any>>> {
    return <Observable<BaseResponse<Array<any>>>>
      this.restService.post(BATCH_ENV.serviceBaseURL + BATCH_ENV.cleanupJob, request);
  }

  @TrackRestCallProgress()
  public reinitiateMessages(request): Observable<BaseResponse<Array<any>>> {
    return <Observable<BaseResponse<Array<any>>>>
      this.restService.post(BATCH_ENV.serviceBaseURL + BATCH_ENV.reinitiateMessages, request);
  }

  @TrackRestCallProgress()
  public checkJob(request): Observable<BaseResponse<Array<any>>> {
    return <Observable<BaseResponse<Array<any>>>>
      this.restService.post(BATCH_ENV.serviceBaseURL + BATCH_ENV.checkJob, request);
  }
}

