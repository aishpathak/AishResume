import { Injectable } from '@angular/core';
import { BaseResponse, RestService, BaseService, BaseRequest, TrackRestCallProgress } from 'ngc-framework';

import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { EFACILITATION_ENV, EXP_ENV } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReceivedocumentService {
    [x: string]: any;

    constructor(private restService: RestService, private httpClient: HttpClient) {
    }

    @TrackRestCallProgress()
    public retrieveReceiveDocument(request): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post
            (EXP_ENV.serviceBaseURL + EXP_ENV.retrieveReceiveDocument, request);
    }

    @TrackRestCallProgress()
    public saveReceiveDocument(request): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post
            (EXP_ENV.serviceBaseURL + EXP_ENV.saveReceiveDocument, request);
    }

}
