
import { Injectable } from '@angular/core';
import { BaseResponse, RestService, BaseService, BaseRequest, TrackRestCallProgress } from 'ngc-framework';
import { Observable } from 'rxjs';
import { EXP_ENV, EQP_ENV, EXPBU_ENV, TRACING_ENV } from '../../../environments/environment';
import { TracingModule } from '../../tracing/tracing.module';
import {
  MailExportAcceptance, MailExportAcceptanceRequest, TruckdockMonitoringRequest, TruckdockMonitoringResponse,
  MailExportAcceptanceDetails, AddToScreeningFlight, AddToScreeningShipmentList, ScreeningPointRequest,
  ScreeningPointShipment, AddToScreeningShipment, ACASRequest, ACASShipment, SCRequest, SearchEmbargoMail, WeighingScaleRequest, CargoWeighingRevisedServiceModelRevised
} from '../export.sharedmodel';

@Injectable()
export class AcceptanceService {
  dataforShipmentList: any;
  dataToSearchOnShipmentSummary: any;
  dataFromCargoAcceptanceToShipmentSummary: any;
  dataFromShipmentSummaryToAwbInformation: any;

  constructor(private restService: RestService) { }


  @TrackRestCallProgress()
  public getDefaultDefinition() {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.getDefaultDefinitionURL, new BaseRequest());
  }

  @TrackRestCallProgress()
  public updateDefaultHandlingDefinition(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.updateDefaultHandlingDefinitionURL, request);
  }

  @TrackRestCallProgress()
  public deleteShcDefinition(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.deleteShcDefinitionURL, request);
  }

  @TrackRestCallProgress()
  public deleteAirlineDefinition(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.deleteAirlineDefinitionURL, request);
  }

  @TrackRestCallProgress()
  public saveAirlineDetails(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.saveAirlineDetailsURL, request);
  }

  @TrackRestCallProgress()
  public saveShcDetails(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.saveShcDetailsURL, request);
  }
  // Acceptance Handling Definition //
  // <================================================> //
  // <================================================> //
  // CARGO DOCUMENT ACCEPTANCE //
  @TrackRestCallProgress()
  public getContractorInformation(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.getContractorInformation, request);
  }

  @TrackRestCallProgress()
  public onValidate(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onValidate, request);
  }

  // onValidateForAwbNoValidation
  @TrackRestCallProgress()
  public onValidateForAwbNoValidation(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onValidateForAwbNoValidation, request);
  }

  @TrackRestCallProgress()
  public onAddShipment(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onAddShipment, request);
  }

  @TrackRestCallProgress()
  public onValidateContractor(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onValidateContractor, request);
  }
  @TrackRestCallProgress()
  public onEditEAcceptance(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onEditEAcceptance, request);
  }


  // onSaveAwbInformation
  @TrackRestCallProgress()
  public onSaveAwbInformation(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSaveCargoDocument, request);
  }

  @TrackRestCallProgress()
  public isFlightExistInCurrentCosys(request) {

    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.isFlightExistInCurrentCosys, request);
  }

  @TrackRestCallProgress()
  public getFlightDetail(request) {

    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.getFlightDetail, request);
  }

  @TrackRestCallProgress()
  public isFlightExistInCurrentCosysSummary(request) {

    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.isFlightExistInCurrentCosysSummary, request);
  }


  // save cargo document for no awb validation
  @TrackRestCallProgress()
  public onSaveCargoDocumentForNoAwbValidation(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSaveCargoDocumentForNoAwbValidation, request);
  }

  @TrackRestCallProgress()
  public fetchRuleShipmentExecutionListAcceptance(request:
    CargoWeighingRevisedServiceModelRevised) {
    return <Observable<BaseResponse<CargoWeighingRevisedServiceModelRevised>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.fetchRuleShipmentExecutionListAcceptance, request);
  }

  @TrackRestCallProgress()
  public fetchStartFreightRuleExecutionList(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.fetchStartFreightRuleExecutionList, request);
  }

  // startEFromShipment
  @TrackRestCallProgress()
  public startEFromShipment(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.startEFromShipment, request);
  }

  @TrackRestCallProgress()
  public onStartEAcceptance(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onStartEAcceptance, request);
  }

  // starteacceptancefornoawbvalidation
  @TrackRestCallProgress()
  public onStartEAcceptanceForNoAwbValidation(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onStartEAcceptanceForNoAwbValidation, request);
  }

  @TrackRestCallProgress()
  public getShcGroup(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getShcGroup, request);
  }

  @TrackRestCallProgress()
  public onGenerateTag(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onGenerateTag, request);
  }
  @TrackRestCallProgress()
  public onServiceNumber() {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onServiceNumber, new BaseRequest());
  }

  @TrackRestCallProgress()
  public onCloseFailureData(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onCloseFailureData, request);
  }
  // updating Exp_ShipmentBooking
  @TrackRestCallProgress()
  public updateBooking(request) {
    <Observable<BaseResponse<any>>>this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.updateBooking, request);
  }


  // END OF CARGO DOCUMENT ACEPTENCE

  // ACCEPTANCE WEIGHING ULD STARTS

  @TrackRestCallProgress()
  public fetchPrelodgeDetails(request) {
    console.log(request);
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.fetchPrelodgeDetails, request);
  }


  @TrackRestCallProgress()
  public insertBupAutoWeighDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.insertBupAutoWeighDetails, request);
  }
  @TrackRestCallProgress()
  public fetchEquipmentReturnRecord(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EQP_ENV.serviceBaseURL + EQP_ENV.equipReleaseReturn, request);
  }

  // AUTOWEIGH CAPTURED ULD LIST STARTS

  @TrackRestCallProgress()
  public getAutoWeighCapturedUldList(request) {
    console.log(request);
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.getAutoWeighCapturedUldList, request);
  }


  @TrackRestCallProgress()
  public updateFlightDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.updateFlightDetailsUrl, request);
  }

  @TrackRestCallProgress()
  public printAndUpdateUldTagDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.printAndUpdateUldTag, request);
  }

  @TrackRestCallProgress()
  public getRejectReturnShipment(request) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL +
        EXP_ENV.getRejectReturnAwbDetails, request);
  }

  @TrackRestCallProgress()
  public rejectShipmentRecord(request) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.rejectShipment, request);
  }

  // @TrackRestCallProgress()
  // public checkForBlackListCustomer(request) {
  //   return <Observable<BaseResponse<any>>>
  //     this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.checkForBlackListCustomer, request);
  // }

  // @TrackRestCallProgress()
  // public validateBlackListCustomer(request) {
  //   return <Observable<BaseResponse<any>>>
  //     this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.validateBlackListCustomer, request);
  // }


  @TrackRestCallProgress()
  public getProportionalWeightForTRejectShipment(request) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL +
        EXP_ENV.singleShipmentGetProportionalWeight, request);
  }

  @TrackRestCallProgress()
  public returnShipmentRecord(request) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.returnShipment, request);
  }
  @TrackRestCallProgress()
  public cancelReturnShipmentRecord(request) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.cancelReturnShipment, request);
  }
  @TrackRestCallProgress()
  public returnRequestShipmentRecord(request) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.returnRequestShipment, request);
  }

  @TrackRestCallProgress()
  public checkIcCode(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.checkIcCodeValidation, request);
  }

  @TrackRestCallProgress()
  public addMailExportAcceptance(request: MailExportAcceptanceRequest):
    Observable<BaseResponse<MailExportAcceptanceRequest>> {
    return <Observable<BaseResponse<MailExportAcceptanceRequest>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.addMailExportAcceptance, request);
  }

  @TrackRestCallProgress()
  public getPAFlight(request: MailExportAcceptanceRequest):
    Observable<BaseResponse<MailExportAcceptanceRequest>> {
    return <Observable<BaseResponse<MailExportAcceptanceRequest>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getPAFlight, request);
  }

  @TrackRestCallProgress()
  public fetchAcceptanceDetails(request: MailExportAcceptanceDetails):
    Observable<BaseResponse<Array<MailExportAcceptance>>> {
    return <Observable<BaseResponse<Array<MailExportAcceptance>>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.fetchAcceptanceDetails, request);
  }

  @TrackRestCallProgress()
  public updateNestedId(request: MailExportAcceptanceDetails):
    Observable<BaseResponse<MailExportAcceptanceDetails>> {
    return <Observable<BaseResponse<MailExportAcceptanceDetails>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.updateNestedId, request);
  }

  @TrackRestCallProgress()
  public getCountryCode(request: MailExportAcceptanceRequest):
    Observable<BaseResponse<MailExportAcceptanceRequest>> {
    return <Observable<BaseResponse<MailExportAcceptanceRequest>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getCountryCode, request);
  }

  @TrackRestCallProgress()
  public getTruckdockMonitoringData(request: TruckdockMonitoringRequest) {
    return <Observable<BaseResponse<TruckdockMonitoringResponse>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getTruckdockMonitoringData, request);
  }
  @TrackRestCallProgress()
  public mailBooklistService(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.mailBooklistService, request);
  }

  @TrackRestCallProgress()
  public updateBooklistRemarks(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.updateBooklistRemarks, request);
  }


  @TrackRestCallProgress()
  public fetchReturnMail(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.fetchReturnMail, request);
  }

  @TrackRestCallProgress()
  public validate(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.validate, request);
  }

  @TrackRestCallProgress()
  public insert(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.insert, request);
  }

  @TrackRestCallProgress()
  public updatePendingMailBags(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.updatePendingMailBags, request);
  }

  @TrackRestCallProgress()
  public fetchExportMailManifest(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchExportMailManifest, request);
  }

  @TrackRestCallProgress()
  public updateNestedIdMailManifest(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateNestedIdMailManifest, request);
  }
  @TrackRestCallProgress()
  public exportFlightComplete(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.exportFlightComplete, request);
  }
  @TrackRestCallProgress()
  public deleteRecord(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.exportDeleteMail, request);
  }

  @TrackRestCallProgress()
  public exportManifestComplete(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.exportManifestComplete, request);
  }

  @TrackRestCallProgress()
  public exportMailTransferToCN46(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.exportMailTransferToCN46, request);
  }

  @TrackRestCallProgress()
  public fetchAddToScreening(request: AddToScreeningFlight) {
    return <Observable<BaseResponse<AddToScreeningShipmentList>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.fetchAddToScreening, request);
  }
  @TrackRestCallProgress()
  public fetchToBeScreenedShipments(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.fetchToBeScreenedShipments, request);
  }

  @TrackRestCallProgress()
  public addShipmentToScreening(request: AddToScreeningShipment) {
    return <Observable<BaseResponse<AddToScreeningShipment>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.insertShipmentToScreening, request);
  }
  @TrackRestCallProgress()
  public addShipmentsToScreening(request: any) {
    return <Observable<BaseResponse<AddToScreeningShipment[]>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.insertShipmentsToScreening, request);
  }
  @TrackRestCallProgress()
  public updateScreenedShipment(request: ScreeningPointShipment) {
    return <Observable<BaseResponse<ScreeningPointShipment>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.updateScreenedShipment, request);
  }

  @TrackRestCallProgress()
  public updateScreeningComplete(request: ScreeningPointShipment) {
    return <Observable<BaseResponse<ScreeningPointShipment>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.updateScreeningComplete, request);
  }
  @TrackRestCallProgress()
  public detainShipments(request: ScreeningPointRequest) {
    return <Observable<BaseResponse<ScreeningPointRequest>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.detainShipments, request);
  }
  @TrackRestCallProgress()
  public fetchACASShipments(request: ACASRequest) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.fetchACASShipments, request);
  }

  @TrackRestCallProgress()
  public byPassACASShipments(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.byPassACASShipments, request);
  }

  @TrackRestCallProgress()
  public undoByPassACASShipment(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.undoByPassACASShipment, request);
  }

  @TrackRestCallProgress()
  public sendForScreening(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.sendForScreening, request);
  }
  @TrackRestCallProgress()
  public getScreeningTarget() {
    const request: BaseRequest = new BaseRequest();
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getScreeningTarget, request);
  }

  @TrackRestCallProgress()
  public fetchSCShipments(request: SCRequest) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.fetchSCShipments, request);
  }

  @TrackRestCallProgress()
  public captureSCShipments(request: any): any {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.captureSCShipments, request);
  }

  @TrackRestCallProgress()
  public searchForEmbargoMail(request: SearchEmbargoMail) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getSearchEmbargoMail, request);
  }

  @TrackRestCallProgress()
  public updateEmbargo(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getUpdateEmbargo, request);
  }

  public fetchUldDetails(request: MailExportAcceptanceRequest):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getUldDetails, request);
  }

  @TrackRestCallProgress()
  public updateRemarks(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateRemarks, request);
  }

  @TrackRestCallProgress()
  public fetchVolumetricWeightDetails(request: any): any {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getVolumetricWeightDetails, request);
  }

  @TrackRestCallProgress()
  public fetchVolumetricScannerDetails(request: any): any {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getVolumetricScannerDetails, request);
  }

  @TrackRestCallProgress()
  public updateRejectReturnShipment(request) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.updateRejectReturnShipment, request);
  }

  @TrackRestCallProgress()
  public onPSNHistory(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getPSNHistory, request);
  }
  @TrackRestCallProgress()
  public fetchVolumetricScannerImageDetails(request: any): any {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getVolumetricScannerImageDetails, request);
  }
  @TrackRestCallProgress()
  public checkIncomingFlight(request: any): any {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.checkIncomingFlightDetails, request);
  }

  @TrackRestCallProgress()
  public searchForAcceptanceHouseMonitoring(request: any): any {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.acceptanceHouseByMonitoring, request);
  }

  @TrackRestCallProgress()
  public onPrint(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (TRACING_ENV.serviceBaseURL + TRACING_ENV.onPrint, request);
  }

  /**
   * 
   * @param request 
   * @returns 
   * THIS METHOD IS USED TO FETCH TOTAL AVAILABLE PIECES AND WEIGHT FOR SCREENING
   * FOR SPECIFIC LOCATION (ULD OR BULK)
   */
  @TrackRestCallProgress()
  public availablePiecesForScreening(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.availablePiecesForScreening, request);
  }
}

