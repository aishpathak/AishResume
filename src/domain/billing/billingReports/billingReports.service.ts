import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse, RestService, TrackRestCallProgress } from 'ngc-framework';
import { BILL_ENV } from '../../../environments/environment';

@Injectable()
export class BillingReportsService {

constructor(private restService: RestService) { }

@TrackRestCallProgress()
  public generateReport(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.generateReport, request);
  }

  @TrackRestCallProgress()
  public searchVerifiedReports(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.searchVerifiedReports, request);
  }
}
