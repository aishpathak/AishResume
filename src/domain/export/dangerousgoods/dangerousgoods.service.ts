import { Injectable } from '@angular/core';
import { BaseResponse, RestService, BaseService, BaseRequest, TrackRestCallProgress } from 'ngc-framework';
import { Observable } from 'rxjs';
import { log } from 'util';
import { EXPBU_ENV } from '../../../environments/environment';
import { SearchDgregulations, SearchRegulation, Dgregulations, RequestRliRlmRegulation, ResponseRliRlmRegulation, ResponseEliElmRegulation } from '../export.sharedmodel';

@Injectable()
export class DangerousgoodsService {

  constructor(private restService: RestService) { }

  @TrackRestCallProgress()
  public getDGDDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getDGDDetailsByAwbNumber, request);
  }

  @TrackRestCallProgress()
  public saveDGDDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveDGDDetails, request);
  }

  @TrackRestCallProgress()
  public getOverPackSequenceNumber(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getSeqNo, request);
  }

  @TrackRestCallProgress()
  public getShipperDetailsByCode(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getShipperDetails, request);
  }

  @TrackRestCallProgress()
  public getConsigneeDetailsByCode(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getConsigneeDetails, request);
  }

  @TrackRestCallProgress()
  public deleteDgDecDetails(req) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteDgDecDetails, req);
  }

  @TrackRestCallProgress()
  public getUnidDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getUnidDetails, request);
  }



  @TrackRestCallProgress()
  public getDgRegulations(req: SearchDgregulations): Observable<BaseResponse<Dgregulations>> {
    return <Observable<BaseResponse<Dgregulations>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getDgdDetails, req);
    // (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getRegulationDetails, req);

  }

  @TrackRestCallProgress()
  public getDgRegulationsDetails(req: SearchRegulation): Observable<BaseResponse<Dgregulations>> {
    return <Observable<BaseResponse<Dgregulations>>>this.restService.post
      // (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getDgdDetails, req);
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getRegulationDetails, req);

  }

  @TrackRestCallProgress()
  public saveDgRegulations(req: Dgregulations): Observable<BaseResponse<Dgregulations>> {
    return <Observable<BaseResponse<Dgregulations>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveDgdDetails, req);
  }

  @TrackRestCallProgress()
  public deleteDgRegulations(req: Dgregulations): Observable<BaseResponse<Dgregulations>> {
    return <Observable<BaseResponse<Dgregulations>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteDgdDetails, req);
  }

  // Handelling regulation for lithium batteries
  @TrackRestCallProgress()
  public fetchRegulations(request: RequestRliRlmRegulation):
    Observable<BaseResponse<ResponseRliRlmRegulation>> {
    return <Observable<BaseResponse<ResponseRliRlmRegulation>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchrlirlmregulation, request);
  }

  @TrackRestCallProgress()
  public updateRegulations(request: ResponseRliRlmRegulation):
    Observable<BaseResponse<ResponseRliRlmRegulation>> {
    return <Observable<BaseResponse<ResponseRliRlmRegulation>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updaterlirlmregulation, request);
  }

  @TrackRestCallProgress()
  public daleteRliRlmInstruction(request: ResponseRliRlmRegulation):
    Observable<BaseResponse<ResponseRliRlmRegulation>> {
    return <Observable<BaseResponse<ResponseRliRlmRegulation>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleterlirlmregulation, request);
  }


  @TrackRestCallProgress()
  public fetchRegulationsEliInstruction(request: RequestRliRlmRegulation):
    Observable<BaseResponse<ResponseRliRlmRegulation>> {
    return <Observable<BaseResponse<ResponseRliRlmRegulation>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchelielmregulation, request);
  }

  @TrackRestCallProgress()
  public updateRegulationRelatedToEliElm(request: ResponseEliElmRegulation):
    Observable<BaseResponse<ResponseEliElmRegulation>> {
    return <Observable<BaseResponse<ResponseEliElmRegulation>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updatelieelmregulation, request);
  }

  @TrackRestCallProgress()
  public deleteEliElmInstruction(request: ResponseEliElmRegulation):
    Observable<BaseResponse<ResponseEliElmRegulation>> {
    return <Observable<BaseResponse<ResponseEliElmRegulation>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteelieelmregulation, request);
  }

  @TrackRestCallProgress()
  public saveDGDEliElmDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveDGDEliElmDetails, request);
  }


  @TrackRestCallProgress()
  public deleteDGDEliElmDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteDGDEliElmDetails, request);
  }

  @TrackRestCallProgress()
  public getEliDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getDGDEliElmDetails, request);
  }

  @TrackRestCallProgress()
  public getRemarkOnPiAndShc(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getEliElmRemark, request);
  }
  @TrackRestCallProgress()
  public getOriginAndDestination(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getOriginAndDestination, request);
  }

}
