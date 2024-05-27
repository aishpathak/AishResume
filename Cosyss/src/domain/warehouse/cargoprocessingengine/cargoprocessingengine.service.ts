import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { WH_ENV } from '../../../environments/environment';
import { BaseResponse, RestService, BaseService, BaseRequest, TrackRestCallProgress } from 'ngc-framework';

@Injectable()
export class CargoProcessingEngineService extends BaseService {
  constructor(private restService: RestService) {
    super();
  }

  @TrackRestCallProgress()
  public getSetupProcessArea() {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL + WH_ENV.getSetupProcessArea, new BaseRequest());
  }

  @TrackRestCallProgress()
  public saveSetupProcessArea(request): Observable<BaseResponse<Array<any>>> {
    return <Observable<BaseResponse<Array<any>>>>
      this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.saveSetupProcessArea, request);
  }

  /**
  * @param {any} request
  * @returns
  * @memberof CargoProcessingEngineService
  */
  @TrackRestCallProgress()
  public onSearchTriggerPoints(request) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.onSearchTriggerPoints, request);
  }

  /**
  * @param {any} request
  * @returns
  * @memberof CargoProcessingEngineService
  */
  @TrackRestCallProgress()
  public saveSetupTriggerPoints(request) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.saveSetupTriggerPoints, request);
  }

  /**
  * @param {any} request
  * @returns
  * @memberof CargoProcessingEngineService
  */
  @TrackRestCallProgress()
  public onSearchAssociateProcessArea(request) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.onSearchAssociateProcessArea, request);
  }

  /**
  * @param {any} request
  * @returns
  * @memberof CargoProcessingEngineService
  */
  @TrackRestCallProgress()
  public saveAssociateProcessArea(request) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.saveAssociateProcessArea, request);
  }

  /**
  * @param {any} request
  * @returns
  * @memberof CargoProcessingEngineService
  */
  @TrackRestCallProgress()
  public onSearchOperationalMessages() {
    return <Observable<BaseResponse<any>>>
      this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.onSearchOperationalMessages, new BaseRequest());
  }

  /**
  * @param {any} request
  * @returns
  * @memberof CargoProcessingEngineService
  */
  @TrackRestCallProgress()
  public saveOperationalMessage(request) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.saveOperationalMessage, request);
  }

  /**
  * @param {any} request
  * @returns
  * @memberof CargoProcessingEngineService
  */
  @TrackRestCallProgress()
  public searchPrecedents(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>
      this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.searchPrecedents, request);
  }

  /**
  * @param {any} request
  * @returns
  * @memberof CargoProcessingEngineService
  */
  @TrackRestCallProgress()
  public savePrecedents(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>
      this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.savePrecedents, request);
  }

  /**
  * @param {any} request
  * @returns
  * @memberof CargoProcessingEngineService
  */
  @TrackRestCallProgress()
  public onSearchExectionShipmentInfo(request) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.onSearchExectionShipmentInfo, request);
  }

  /**
  * @param {any} request
  * @returns
  * @memberof CargoProcessingEngineService
  */
  @TrackRestCallProgress()
  public oncloseFailure(request) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.oncloseFailure, request);
  }

}

