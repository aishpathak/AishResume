import { Injectable } from '@angular/core';
import { RestService, TrackRestCallProgress, BaseResponse } from 'ngc-framework';

import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

import { PrelodgeExportDocuments, PrelodgeExportDocumentsClearance, PrelodgeExportDocumentsDimension, PrelodgeExportDocumentsRacsf, PrelodgeExportDocumentsUldInfo } from '../../../../export.sharedmodel';
import { EXPBU_ENV, EXPORTaat } from '../../../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MrclpredeclarationService {
  constructor(private restService: RestService, private httpClient: HttpClient) {
  }
  //For Save ----------------------------------------------
  @TrackRestCallProgress()
  public getmRCLpreDeSave(request: any):
    Observable<any> {
    return <Observable<any>>this.restService.post(EXPORTaat.serviceBaseURL + EXPORTaat.mRCLPreDeclarationSaveService, request);
  }

  //For getmRCLNumber ----------------------------------------------
  @TrackRestCallProgress()
  public getmRCLNumber(request: any):
    Observable<any> {
    return <Observable<any>>this.restService.post(EXPORTaat.serviceBaseURL + EXPORTaat.getmRCLNumber, request);
  }

  //For Update---------------------------------------
  @TrackRestCallProgress()
  public getmRCLpreDeUpdate(request: any):
    Observable<any> {
    return <Observable<any>>this.restService.post(EXPORTaat.serviceBaseURL + EXPORTaat.mRCLPreDeclarationUpdateService, request);
  }
  //For Delete---------------------------------------
  @TrackRestCallProgress()
  public getmRCLpreDeDelete(request: any):
    Observable<any> {
    return <Observable<any>>this.restService.post(EXPORTaat.serviceBaseURL + EXPORTaat.mRCLPreDeclarationDeleteService, request);
  }

  //For Retrive---------------------------------------
  @TrackRestCallProgress()
  public getmRCLRetrieveDetails(request: any):
    Observable<any> {
    return <Observable<any>>this.restService.post(EXPORTaat.serviceBaseURL + EXPORTaat.mRCLRetrieveDetails, request);
  }

  @TrackRestCallProgress()
  public getCarrierCodeByShipment(request: any):
    Observable<any> {
    return <Observable<any>>this.restService.post(EXPORTaat.serviceBaseURL + EXPORTaat.fetchCarrierCodebyShipment, request);
  }


  @TrackRestCallProgress()
  public getCarrierCodeByULD(request: any):
    Observable<any> {
    return <Observable<any>>this.restService.post(EXPORTaat.serviceBaseURL + EXPORTaat.fetchCarrierCodebyULD, request);
  }

  @TrackRestCallProgress()

  public getmRCLSUmmaryList(request: PrelodgeExportDocuments): Observable<any> {

    return <Observable<any>>this.restService.post(EXPORTaat.serviceBaseURL + EXPORTaat.mRCLSummaryRetrieveService, request);
  }

  // Special Cargo //
  @TrackRestCallProgress()
  public validateFlight(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.validateFlight,
      request
    );
  }
}
