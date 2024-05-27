import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment, BILL_ENV } from '../../../environments/environment';
import { NgcCoreModule, BaseResponse, RestService, TrackRestCallProgress } from 'ngc-framework';

@Injectable()
export class CollectPaymentService {
  @TrackRestCallProgress()
  savePdAccountChanges(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.enquireCharges, request);
    //throw new Error('Method not implemented.');
  }

  constructor(private restService: RestService) { }

  @TrackRestCallProgress()
  public enquireCharges(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.enquireCharges, request);
  }

  @TrackRestCallProgress()
  public saveWaivedCharges(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.waiveCharges, request);
  }

  @TrackRestCallProgress()
  public savePayCharges(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.payCharges, request);
  }

  @TrackRestCallProgress()
  public saveEnquireCharges(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.saveEnquireCharges, request);
  }

  @TrackRestCallProgress()
  public checkValidWaiverCharges(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.checkValidWaiverCharges, request);
  }

  @TrackRestCallProgress()
  public calculateWaiver(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.calculateWaiver, request);
  }

  @TrackRestCallProgress()
  public getAuthorizedPersonnelInfo(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.authorizedPersonnel, request);
  }

  @TrackRestCallProgress()
  public updateCharges(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(BILL_ENV.serviceBaseURL + BILL_ENV.updateCharges, request);
  }
}
