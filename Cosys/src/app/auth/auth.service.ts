// ADM_ENV/Configuration
import { ADM_ENV, CFG_ENV, PLATFORM_ENV } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService, RestService, BaseResponse, TrackRestCallProgress, HTTPObserveType } from 'ngc-framework';
//import { ChangePasswordReq, ChangepasswordResponse, LoginReq, User, BroadcastResponse, FeedbackformReq } from './auth.shared';
/**
 *  Authentication Service
 */
@Injectable()
export class AuthenticationService extends BaseService {
    // Saving Url While login to be used as MediaWiki url in ngc-help component
    public static mediaWikiUrl: any;
    /**
     * Initialize
     */
    constructor(private restService: RestService) {
        super();
    }

    @TrackRestCallProgress()
    public loginSSO(path: string): Observable<BaseResponse<any>> {
        const request: any = {};
        //
        return <Observable<BaseResponse<any>>>this.restService.post(`/gateway/get-sso-token/${path}`, request);
    }

    @TrackRestCallProgress()
    public validateUserLogin(request: any): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post
            (ADM_ENV.serviceBaseURL + ADM_ENV.validateUserLogin, request, HTTPObserveType.RESPONSE);
    }

    @TrackRestCallProgress()
    public changePassword(request: any): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post
            (ADM_ENV.serviceBaseURL + ADM_ENV.changePassword, request);
    }

    @TrackRestCallProgress()
    public onChangePasswordSave(request: any): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post
            (ADM_ENV.serviceBaseURL + ADM_ENV.onChangePasswordSave, request);
    }

    // update I18NLabel

    @TrackRestCallProgress()
    public fetchI18NLabels(request: any): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(CFG_ENV.serviceBaseURL + CFG_ENV.fetchI18NLabels, request);
    }

    // save I18NLabel

    @TrackRestCallProgress()
    public saveI18NLabels(request: any): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(CFG_ENV.serviceBaseURL + CFG_ENV.saveI18NLabels, request);
    }

    @TrackRestCallProgress()
    public fetchTenants(request: any): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(PLATFORM_ENV.serviceBaseURL + PLATFORM_ENV.fetchTenants, request);
    }
}
