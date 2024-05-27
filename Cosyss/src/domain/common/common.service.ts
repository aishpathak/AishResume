import { Observable } from 'rxjs';
import { BaseService, RestService, BaseRequest, BaseResponse, TrackRestCallProgress } from 'ngc-framework';
import { NgcCoreModule } from 'ngc-framework';

import { Http } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { CFG_ENV } from './../../environments/environment';
import { AWB_ENV } from '../../environments/environment';
import { MailingDetails } from './common.sharedmodel';

@Injectable()
export class CommonService extends BaseService {

    constructor(private restService: RestService) {
        super();
    }
    //     @TrackRestCallProgress()
    //   public save(request: any {
    //     return <Observable<BaseResponse<ShipmentInfo>>>this.restService.post
    //       (IMP_ENV.serviceImportURL + IMP_ENV.verifyAWBNumber, request);
    //   }



    @TrackRestCallProgress()
    public isHandledByHouse(request: any): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>(
            this.restService
                .post(AWB_ENV.serviceBaseURL + AWB_ENV.isHandleByHouse, request)
        );
    }

    @TrackRestCallProgress()
    public save(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.saveDamage, request);
    }

    @TrackRestCallProgress()
    public upload(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.saveDamagePhoto, request);
    }



    @TrackRestCallProgress()
    public deleteDamage(request: any):
        Observable<BaseResponse<any>> {
        console.log(JSON.stringify(request));
        return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.deleteDamageInfo, request);
    }
    @TrackRestCallProgress()
    public fetch(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.fetchDamage, request);
    }

    @TrackRestCallProgress()
    public fetchManifestFlightDetails(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.fetchManifestFlightDetails, request);
    }

    @TrackRestCallProgress()
    public sendEmail(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.sendEmails, request);
    }

    @TrackRestCallProgress()
    public sendEmailWithUploadedDoc(request: MailingDetails):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.sendEmailWithUploadedDoc, request);
    }


    @TrackRestCallProgress()
    public sendEmailForDamageWithUploadedDoc(request: MailingDetails):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.sendEmailForDamageWithUploadedDoc, request);
    }

    @TrackRestCallProgress()
    public getMaintainHouseCaptureDamage(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.getMaintainHouseCaptureDamage, request);
    }

    @TrackRestCallProgress()
    public createMaintainHouseDamageData(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.createMaintainHouseCaptureDamage, request);

    }

    @TrackRestCallProgress()
    public deleteDamageHouse(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.createMaintainHouseCaptureDamage, request);

    }
}