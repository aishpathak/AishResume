import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { request } from 'http';
import { BaseResponse, RestService, BaseService, BaseRequest, TrackRestCallProgress } from 'ngc-framework';
import { Observable } from 'rxjs';
import { EXP_ENV } from '../../../../../../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class ReturncargolistService {
  // getReturnCargoListData(arg0: string) {
  //   throw new Error('Method not implemented.');
  // }

  constructor(private restService: RestService, private httpClient: HttpClient) { }
  //private jsonURL = 'assets/testJson/returncargolist.json';

  // @TrackRestCallProgress()
  // public getReturnCargoListData(request): Observable<any> {
  //   return this.httpClient.get(this.jsonURL);
  // }
  @TrackRestCallProgress()
  public getReturnCargoListData(request): Observable<any> {
    return <Observable<any>>this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.retrieveReturnCargoList, request);
  }
  //delete service--------- 
  @TrackRestCallProgress()
  public getReturnCargoListDelete(request): Observable<any> {
    return <Observable<any>>this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.deleteReturnCargoList, request);
  }

}
