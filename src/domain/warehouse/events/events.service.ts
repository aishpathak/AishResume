import { Observable } from 'rxjs';
import { BaseService, RestService, BaseResponse, TrackRestCallProgress } from 'ngc-framework';
import { Injectable } from '@angular/core';
import { WH_ENV } from '../../../environments/environment';

@Injectable()
export class EventsService extends BaseService {
  private allParentsNames;
  private allParentsIds;
  private sectorModel;
  private terminalModel;
  private referenceId;
  private referenceType;
  private dataToSetUpDevices;

  constructor(private restService: RestService) {
    super();
  }
  @TrackRestCallProgress()
  public fetchEventGroups(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.fetchEventGroups, request);
  }

  @TrackRestCallProgress()
  public saveUserGroupInfo(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.saveUserGroupInfo, request);
  }
  @TrackRestCallProgress()
  public vallidateUser(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.vallidateUser, request);
  }

  @TrackRestCallProgress()
  public deleteUserGroup(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.deleteUserGroup, request);
  }

  @TrackRestCallProgress()
  public vallidateNotifyUser(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.vallidateNotifyUser, request);
  }

  @TrackRestCallProgress()
  public saveEventNotification(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.saveEventNotification, request);
  }



  @TrackRestCallProgress()
  public vallidateFlightInfo(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.vallidateFlightInfo, request);
  }

  @TrackRestCallProgress()
  public fetchEventNotifications(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.fetchEventNotifications, request);
  }

  @TrackRestCallProgress()
  public fetchNotificationTemplate(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.fetchNotificationTemplate, request);
  }

  @TrackRestCallProgress()
  public saveNotificationTemplate(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.saveNotificationTemplate, request);
  }


  @TrackRestCallProgress()
  public deleteNotificationTemplate(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.deleteNotificationTemplate, request);
  }

  @TrackRestCallProgress()
  public fetchOutboundFlightInfo(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.fetchOutboundFlightInfo, request);
  }

  @TrackRestCallProgress()
  public fetchInboundFlightInfo(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.fetchInboundFlightInfo, request);
  }

  @TrackRestCallProgress()
  public getSlaDashBoardTVExport(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.getSlaDashBoardTVExport, request);
  }
  @TrackRestCallProgress()
  public getSlaDashBoardTVImport(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.getSlaDashBoardTVImport, request);
  }

  @TrackRestCallProgress()
  public getSlaTVExport(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.getSlaTVExport, request);
  }
  @TrackRestCallProgress()
  public getSlaTVImport(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.getSlaTVImport, request);
  }

  @TrackRestCallProgress()
  public getLatestDboardRecExport(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.getLatestDboardRecExport, request);
  }
  
  @TrackRestCallProgress()
  public getLatestDboardRecImport(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
      WH_ENV.getLatestDboardRecImport, request);
  }
}

