import { BaseService, RestService, BaseRequest } from 'ngc-framework';
import { NgcCoreModule, BaseResponseData, BaseResponse, TrackRestCallProgress } from 'ngc-framework';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OuthouseAcceptance, AcceptedMailDispatch, MailOuthouseAcceptanceDetails, MailOuthouseAcceptance, MailOuthouseAcceptanceRequest } from './outhouse.sharedmodel';

import { EXP_ENV } from '../../environments/environment';

@Injectable()
export class OuthouseService extends BaseService {

  constructor(private restService: RestService) {
    super();
  }

  @TrackRestCallProgress()
  public fetchOuthouseAcceptanceDetails(request: OuthouseAcceptance): Observable<BaseResponse<Array<AcceptedMailDispatch>>> {
    return <Observable<BaseResponse<Array<AcceptedMailDispatch>>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.fetchOuthouseAcceptanceDetails, request);
  }

  @TrackRestCallProgress()
  public handoverOuthouseMailbag(request: AcceptedMailDispatch): Observable<BaseResponse<AcceptedMailDispatch>> {
    return <Observable<BaseResponse<AcceptedMailDispatch>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.handoverOuthouseMailbag, request);
  }

  @TrackRestCallProgress()
  public addMailOuthouseAcceptance(request: MailOuthouseAcceptanceRequest):
    Observable<BaseResponse<MailOuthouseAcceptanceRequest>> {
    return <Observable<BaseResponse<MailOuthouseAcceptanceRequest>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.addMailOuthouseAcceptance, request);
  }
  @TrackRestCallProgress()
  public fetchOuthouseDetails(request: MailOuthouseAcceptanceDetails):
    Observable<BaseResponse<Array<MailOuthouseAcceptance>>> {
    return <Observable<BaseResponse<Array<MailOuthouseAcceptance>>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.fetchOuthouseDetails, request);
  }
  @TrackRestCallProgress()
  public getPAFlightDetails(request: MailOuthouseAcceptanceRequest):
    Observable<BaseResponse<MailOuthouseAcceptanceRequest>> {
    return <Observable<BaseResponse<MailOuthouseAcceptanceRequest>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getPAFlightDetails, request);
  }
  @TrackRestCallProgress()
  public getCountryCodeDetails(request: MailOuthouseAcceptanceRequest):
    Observable<BaseResponse<MailOuthouseAcceptanceRequest>> {
    return <Observable<BaseResponse<MailOuthouseAcceptanceRequest>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getCountryCodeDetails, request);
  }
  
   @TrackRestCallProgress()
  public sendEmail(request: MailOuthouseAcceptanceRequest):
    Observable<BaseResponse<MailOuthouseAcceptanceRequest>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.sendEmail, request);
  }

}
