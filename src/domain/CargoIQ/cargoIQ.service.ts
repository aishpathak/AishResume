import { NgcCoreModule } from 'ngc-framework';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService, RestService, BaseRequest, BaseResponse, TrackRestCallProgress } from 'ngc-framework';
// ADM_ENV/Configuration
import { MST_ENV } from '../../environments/environment';
@Injectable()
export class CargoIQService extends BaseService {
dataFromSlatoEmail: any;
  /**
   * Initialize
   *
   * @param restService Rest Service
   */
  constructor(private restService: RestService) {
    super();
  }

  @TrackRestCallProgress()
    public searchSLAConfiguration(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.searchSLAConfiguration, request);
  }
  
  @TrackRestCallProgress()
    public saveSLAConfiguration(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.saveSLAConfiguration, request);
  }
    
  @TrackRestCallProgress()
    public getEmailConfiguration(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.getEmailConfiguration, request);
  }
      
  @TrackRestCallProgress()
    public saveEmailConfiguration(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(MST_ENV.serviceBaseURL + MST_ENV.saveEmailConfiguration, request);
  }
}
