import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EXP_ENV } from '../../../environments/environment';
import { BaseResponse, RestService, BaseService, BaseRequest, TrackRestCallProgress } from 'ngc-framework';

@Injectable()
export class CheckListService {

  dataFromChecklistTemplate: any;
  dataFromChecklist: any;
 
  constructor(private restService: RestService) { }

  @TrackRestCallProgress()
  public onSearchChecklist(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchChecklist, request);
  }

  @TrackRestCallProgress()
  public onSaveChecklist(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSaveChecklist, request);
  }

  @TrackRestCallProgress()
  public onDeleteChecklist(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onDeleteChecklist, request);
  }

  @TrackRestCallProgress()
  public onSearchPageParameter(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchPageParameter, request);
  }

  @TrackRestCallProgress()
  public onSavePageParameter(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSavePageParameter, request);
  }

  @TrackRestCallProgress()
  public onDeletePageParameter(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onDeletePageParameter, request);
  }

  @TrackRestCallProgress()
  public onSearchPageHeader(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchPageHeader, request);
  }

  @TrackRestCallProgress()
  public onSavePageHeader(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSavePageHeader, request);
  }

  @TrackRestCallProgress()
  public onSearchPageFooter(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchPageFooter, request);
  }

  @TrackRestCallProgress()
  public onDeletePageHeader(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onDeletePageHeader, request);
  }



  @TrackRestCallProgress()
  public onSearchPageDetail(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchPageDetail, request);
  }

  @TrackRestCallProgress()
  public onSavePageDetail(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSavePageDetail, request);
  }

  @TrackRestCallProgress()
  public onDeletePageDetail(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onDeletePageDetail, request);
  }

  @TrackRestCallProgress()
  public onSavePageFooter(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSavePageFooter, request);
  }

  @TrackRestCallProgress()
  public onSearchQuestionnaireWithSubHeadings(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchQuestionnaireWithSubHeadings, request);
  }

  @TrackRestCallProgress()
  public onSearchQuestionnaireWithoutSubHeadings(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchQuestionnaireWithoutSubHeadings, request);
  }

  @TrackRestCallProgress()
  public onSaveQuestionnaireWithSubHeadings(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSaveQuestionnaireWithSubHeadings, request);
  }

  @TrackRestCallProgress()
  public onSaveQuestionnaireWithoutSubHeadings(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSaveQuestionnaireWithoutSubHeadings, request);
  }

  @TrackRestCallProgress()
  public onCopyChecklist(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onCopyChecklist, request);
  }

  @TrackRestCallProgress()
  public onSearchChecklistAsPerShipmentNumber(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchChecklistAsPerShipmentNumber, request);
  }

  @TrackRestCallProgress()
  public onSearchSetupChecklist(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchSetupChecklist, request);
  }

  @TrackRestCallProgress()
  public onSaveSetupChecklist(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSaveSetupChecklist, request);
  }

  @TrackRestCallProgress()
  public onSearchFillChecklist(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchFillChecklist, request);
  }

  @TrackRestCallProgress()
  public onSearchFillChecklistForEdit(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchFillChecklistForEdit, request);
  }

  @TrackRestCallProgress()
  public onSearchQuestionnaire(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchQuestionnaire, request);
  }

  @TrackRestCallProgress()
  public onSaveFillChecklist(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSaveFillChecklist, request);
  }

  @TrackRestCallProgress()
  public onStatusFlagCompleted(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onStatusFlagCompleted, request);
  }

  @TrackRestCallProgress()
  public onStatusFlagInProgress(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onStatusFlagInProgress, request);
  }

}
