import { BaseService, RestService, BaseResponse, TrackRestCallProgress } from 'ngc-framework';
import { Injectable } from '@angular/core';
import { Environment, IMP_ENV, IMPDLV_ENV } from '../../../environments/environment';
import { DomainEnvironement } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { TransferByCarrierSearch, TranshipmentTransferManifestByAWB, TRMByAWBSearch, TranshipmentTransferManifestByAWBInfo } from './transhipment.sharedmodels';

@Injectable()
export class TranshipmentService {

  public createTrmData;
  public fromCarrier;

  constructor(private restService: RestService) { }

  @TrackRestCallProgress()
  public geTranshipmentByCarrier(request: TransferByCarrierSearch):
    Observable<BaseResponse<TransferByCarrierSearch>> {
    return <Observable<BaseResponse<TransferByCarrierSearch>>>this.restService.post
      (IMP_ENV.serviceImportURL + IMP_ENV.geTranshipmentByCarrier, request);
  }

  @TrackRestCallProgress()
  public getTranshipmentByAWBList(request: TRMByAWBSearch):
    Observable<BaseResponse<TRMByAWBSearch>> {
    return <Observable<BaseResponse<TRMByAWBSearch>>>this.restService.post
      (IMP_ENV.serviceImportURL + IMP_ENV.getTranshipmentByAWBList, request);
  }

  @TrackRestCallProgress()
  public getTranshipmentByAWB(request: TRMByAWBSearch):
    Observable<BaseResponse<TRMByAWBSearch>> {
    return <Observable<BaseResponse<TRMByAWBSearch>>>this.restService.post
      (IMP_ENV.serviceImportURL + IMP_ENV.getTranshipmentByAWB, request);
  }

  @TrackRestCallProgress()
  public maintainTranshipmentByAWB(request: TranshipmentTransferManifestByAWB):
    Observable<BaseResponse<TranshipmentTransferManifestByAWB>> {
    return <Observable<BaseResponse<TranshipmentTransferManifestByAWB>>>this.restService.post
      (IMP_ENV.serviceImportURL + IMP_ENV.maintainTranshipmentByAWB, request);
  }


  @TrackRestCallProgress()
  public cancelTranshipmentAWB(request: TRMByAWBSearch):
    Observable<BaseResponse<TRMByAWBSearch>> {
    return <Observable<BaseResponse<TRMByAWBSearch>>>this.restService.post
      (IMP_ENV.serviceImportURL + IMP_ENV.cancelTranshipmentAWB, request);
  }


  @TrackRestCallProgress()
  public finalizeTranshipmentAWB(request: TRMByAWBSearch):
    Observable<BaseResponse<TRMByAWBSearch>> {
    return <Observable<BaseResponse<TRMByAWBSearch>>>this.restService.post
      (IMP_ENV.serviceImportURL + IMP_ENV.finalizeTranshipmentAWB, request);
  }

  @TrackRestCallProgress()
  public unfinalizeTranshipmentAWB(request: TRMByAWBSearch):
    Observable<BaseResponse<TRMByAWBSearch>> {
    return <Observable<BaseResponse<TRMByAWBSearch>>>this.restService.post
      (IMP_ENV.serviceImportURL + IMP_ENV.unfinalizeTranshipmentAWB, request);
  }


  @TrackRestCallProgress()
  public getTrmNumberWithIssueDate(request: TranshipmentTransferManifestByAWB):
    Observable<BaseResponse<TranshipmentTransferManifestByAWB>> {
    return <Observable<BaseResponse<TranshipmentTransferManifestByAWB>>>this.restService.post
      (IMP_ENV.serviceImportURL + IMP_ENV.getTrmNumberWithIssueDate, request);
  }

  @TrackRestCallProgress()
  public getShipmentInfo(request: TranshipmentTransferManifestByAWBInfo):
    Observable<BaseResponse<TranshipmentTransferManifestByAWBInfo>> {
    return <Observable<BaseResponse<TranshipmentTransferManifestByAWBInfo>>>this.restService.post
      (IMP_ENV.serviceImportURL + IMP_ENV.getShipmentInfo, request);
  }

  @TrackRestCallProgress()
  public printManifestData(request: TranshipmentTransferManifestByAWB):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (IMP_ENV.serviceImportURL + IMP_ENV.printManifestReport, request);
  }

  @TrackRestCallProgress()
  public checKRemainingPiecesLocation(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (IMP_ENV.serviceImportURL + IMP_ENV.checkRemainingPiecesLocation, request);
  }

}
