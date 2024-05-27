import { Injectable } from '@angular/core';
import { EXPORTaat } from '../../../../../environments/environment';
import { BaseResponse, RestService, BaseService, BaseRequest, TrackRestCallProgress } from 'ngc-framework';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrelodgeExportDocuments } from '../../../export.sharedmodel';



@Injectable({
  providedIn: 'root'
})
export class MrclserviceService {

  constructor(private restService: RestService, private httpClient: HttpClient) {

  }


  @TrackRestCallProgress()

  public getmRCLSUmmaryList(request: PrelodgeExportDocuments): Observable<any> {

    return <Observable<any>>this.restService.post(EXPORTaat.serviceBaseURL + EXPORTaat.mRCLSummaryRetrieveService, request);
  }
  @TrackRestCallProgress()

  public validateAWBcreate(request: PrelodgeExportDocuments): Observable<any> {

    return <Observable<any>>this.restService.post(EXPORTaat.serviceBaseURL + EXPORTaat.createmRCLAWBvalidation, request);
  }
}
