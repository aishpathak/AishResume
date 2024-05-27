import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService, RestService, BaseRequest, BaseResponse, NgcCoreModule, TrackRestCallProgress } from 'ngc-framework';
import { SummaryOfEpouch } from './epouch.sharedModel';
import { MST_ENV } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EpouchService extends BaseService {
  /**
         * Initialize
         *
         * @param restService Rest Service
         */
  constructor(private restService: RestService) {
    super();
  }

@TrackRestCallProgress()
public fetchSummaryOfEpouch(request): Observable<BaseResponse<SummaryOfEpouch>> {
  return <Observable<BaseResponse<SummaryOfEpouch>>>this.restService.post(MST_ENV.serviceAgentURL + MST_ENV.fetchSummaryOfEpouch, request)
}

}
