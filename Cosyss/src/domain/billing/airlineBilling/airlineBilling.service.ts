import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgcCoreModule, BaseResponse, RestService, TrackRestCallProgress } from 'ngc-framework';
import { BILL_ENV } from '../../../environments/environment';



@Injectable()
export class AirlineBillingService {

    constructor(private restService: RestService) { }

    // @TrackRestCallProgress()
    // public searchAirlineCreditDebitNoteData(request: any): Observable<BaseResponse<any>> {
    //   return <Observable<BaseResponse<any>>>this.restService.post(
    //     BILL_ENV.serviceBaseURL + BILL_ENV.searchAirlineCreditDebitNoteData, request
    //   );
    // }

}