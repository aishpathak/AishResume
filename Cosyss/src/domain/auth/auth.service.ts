import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import {
  BaseService, RestService, BaseResponse, AuthorizationToken,
  ErrorMessage, TrackRestCallProgress, MenuItem
} from 'ngc-framework';
import { ADM_ENV, DomainEnvironement } from '../../environments/environment';
import { ChangePasswordReq, ChangepasswordResponse, LoginReq, User } from './auth.shared';

@Injectable()
export class AuthService extends BaseService {

  /**
   *
   * @param restService
   */

  constructor(private restService: RestService) {
    super();
  }

  @TrackRestCallProgress()
  public forgotPassword(request: User): Observable<BaseResponse<User>> {
    if (request != null) {
      return <Observable<BaseResponse<User>>>this.restService.post
        (ADM_ENV.serviceBaseURL + ADM_ENV.forgotPassword, request);
    }
  }
  @TrackRestCallProgress()
  public changePassword(request: User): Observable<BaseResponse<User>> {
    return <Observable<BaseResponse<User>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.changePassword, request);
  }
}
