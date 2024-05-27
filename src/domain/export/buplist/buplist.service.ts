import { Injectable } from '@angular/core';
// import { AcceptanceService } from '../acceptance.service';
import { BaseResponse, RestService, BaseService, BaseRequest, TrackRestCallProgress } from 'ngc-framework';

import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { EFACILITATION_ENV, EXP_ENV } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BuplistService {
    [x: string]: any;

    constructor(private restService: RestService, private httpClient: HttpClient) {
    }
    private jsonURL = 'assets/testJson/buplist.json';


    // @TrackRestCallProgress()
    // public getBupList(request): Observable<any> {
    //     return this.httpClient.get(this.jsonURL);
    // }

    @TrackRestCallProgress()
    public getBupList_Uld(request): Observable<BaseResponse<any>> {
        // console.log(JSON.stringify(request));
        return <Observable<BaseResponse<any>>>this.restService.post
            (EXP_ENV.serviceBaseURL + EXP_ENV.buplist_Uld, request);
    }

    @TrackRestCallProgress()
    public getBupList_Awb(request): Observable<BaseResponse<any>> {
        // console.log(JSON.stringify(request));
        return <Observable<BaseResponse<any>>>this.restService.post
            (EXP_ENV.serviceBaseURL + EXP_ENV.buplist_Awb, request);
    }

    @TrackRestCallProgress()
    public getBuplist_Save(request): Observable<BaseResponse<any>> {
        // console.log(JSON.stringify(request));
        return <Observable<BaseResponse<any>>>this.restService.post
            (EXP_ENV.serviceBaseURL + EXP_ENV.buplist_Save, request);
    }

    @TrackRestCallProgress()
    public getBuplist_Delete(request): Observable<BaseResponse<any>> {
        // console.log(JSON.stringify(request));
        return <Observable<BaseResponse<any>>>this.restService.post
            (EXP_ENV.serviceBaseURL + EXP_ENV.buplist_Delete, request);
    }

}
