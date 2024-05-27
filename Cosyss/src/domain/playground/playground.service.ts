/**
 *  Domain Service
 * 
 * @copyright NIIT Technologies Ltd. 2017-18
 */
// Angular
import { Component, Inject, Injectable } from '@angular/core';
import { Observable, Subscription, } from 'rxjs';
// NGC
import {
    BaseService, RestService, BaseRequest, BaseResponse,
    Log, TrackRestCallProgress
} from 'ngc-framework';
// Playground
import { EAcceptanceSearchRequest, EAcceptanceSearchResponseData } from './playground.shared';

/**
 *  Playground Service
 */
@Injectable()
export class PlaygroundService extends BaseService {

    /**
     * Initialize
     * 
     * @param restService Rest Service
     */
    constructor(private restService: RestService) {
        super();
    }

    /**
     * Gets AWB List
     * 
     * @param serverBaseURL Server Base URL (Optional)
     */
    @Log()
    @TrackRestCallProgress()
    public getAWBList(serverBaseURL: string, request: EAcceptanceSearchRequest): Observable<BaseResponse<EAcceptanceSearchResponseData>> {
        let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        //
        return <Observable<BaseResponse<EAcceptanceSearchResponseData>>>this.restService.post(baseURL + "services/playground/awblist", request);
    }

    /**
     * Validate
     * 
     * @param serverBaseURL Server Base URL (Optional)
     */
    @Log()
    @TrackRestCallProgress()
    public validateEAccept(serverBaseURL: string, request: EAcceptanceSearchRequest): Observable<BaseResponse<EAcceptanceSearchResponseData>> {
        let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        //
        return <Observable<BaseResponse<EAcceptanceSearchResponseData>>>this.restService.post(baseURL + "services/playground/e-accept-validate", request);
    }
}
