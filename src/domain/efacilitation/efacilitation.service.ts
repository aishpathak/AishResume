import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EFACILITATION_ENV } from '../../environments/environment';
import {
  NgcCoreModule,
  BaseResponse,
  RestService,
  TrackRestCallProgress
} from "ngc-framework";
import { EfacilitationForm } from './efacilitation.sharedmodel';


@Injectable()
export class EfacilitationService {
  constructor(private restService: RestService) { }
  @TrackRestCallProgress()
  public getEFacilitationDetails(
    request: any
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(EFACILITATION_ENV.serviceBaseURL + EFACILITATION_ENV.searchEfacilitationService, request)
    );
  }


  @TrackRestCallProgress()
  public saveEfacilitationService(request: EfacilitationForm): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<EfacilitationForm>>>(
      this.restService.post(EFACILITATION_ENV.serviceBaseURL + EFACILITATION_ENV.saveEfacilitationService, request)
    );
  }


  @TrackRestCallProgress()
  public getQuoteEfacilitationService(request: EfacilitationForm): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<EfacilitationForm>>>(
      this.restService.post(EFACILITATION_ENV.serviceBaseURL + EFACILITATION_ENV.getQuoteEfacilitationService, request)
    );
  }

  @TrackRestCallProgress()
  public searchEfacilitationService(request: EfacilitationForm): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<EfacilitationForm>>>(
      this.restService.post(EFACILITATION_ENV.serviceBaseURL + EFACILITATION_ENV.searchEfacilitationService, request)
    );
  }

  @TrackRestCallProgress()
  public approveEfacilitationServiceInternal(request: EfacilitationForm): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<EfacilitationForm>>>(
      this.restService.post(EFACILITATION_ENV.serviceBaseURL + EFACILITATION_ENV.approveEfacilitationServiceInternal, request)
    );
  }

  @TrackRestCallProgress()
  public rejectEfacilitationServiceInternal(request: EfacilitationForm): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<EfacilitationForm>>>(
      this.restService.post(EFACILITATION_ENV.serviceBaseURL + EFACILITATION_ENV.rejectEfacilitationServiceInternal, request)
    );
  }

  @TrackRestCallProgress()
  public editEfacilitationService(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<EfacilitationForm>>>(
      this.restService.post(EFACILITATION_ENV.serviceBaseURL + EFACILITATION_ENV.editEfacilitationService, request)
    );
  }
  
}
