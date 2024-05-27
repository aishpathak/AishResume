import { BaseService, RestService, BaseResponse, TrackRestCallProgress, HTTPContentType, NgcUtility } from 'ngc-framework';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RPT_ENV } from '../../environments/environment';

@Injectable()
export class ReportsService extends BaseService {
  /**
   * Initialize
   *
   * @param restService Rest Service
   */
  constructor(private restService: RestService) {
    super();
  }


  /**
   * Method to resend the selected FWB's and FHL's by the user
   */
  @TrackRestCallProgress()
  public getServiceStandardMaintenanceInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(RPT_ENV.serviceBaseURL + RPT_ENV.getServiceStandardMaintenanceInfo, request);
  }

  /**
   * Method to resend the selected FWB's and FHL's by the user
   */
  @TrackRestCallProgress()
  public saveServiceStandardMaintenanceInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(RPT_ENV.serviceBaseURL + RPT_ENV.saveServiceStandardMaintenanceInfo, request);
  }

  /**
  * Method to resend the selected FWB's and FHL's by the user
  */
  @TrackRestCallProgress()
  public deleteServiceStandardMaintenanceInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(RPT_ENV.serviceBaseURL + RPT_ENV.deleteServiceStandardMaintenanceInfo, request);
  }

}
