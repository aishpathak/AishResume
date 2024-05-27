import { EXPBU_ENV } from './../../../../environments/environment';

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService, RestService, BaseRequest, BaseResponse } from 'ngc-framework';
import { PresortingRequest, PresortingResponse, FetchRegionResponse, PresortingResultBO, GetRegionRequest } from './presorting.shared';

@Injectable()
export class PresortingService extends BaseService {

  constructor(private restService: RestService) {
    super();
  }

  public getAWBPresortingInfo(request: PresortingRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getPreSortingDetails, request);
  }

  public checkAWBExist(request: PresortingRequest) {
    return <Observable<BaseResponse<PresortingResponse>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.checkAWBExist, request);
  }

  public getRegions(request: GetRegionRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getRegions, request);
  }

  public updateManualLocation(request: PresortingRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateManualLocation, request);
  }

  // Dummy
  public getMsg(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.get(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.dummy, request);
  }

}
