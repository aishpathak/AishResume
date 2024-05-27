import { Injectable } from '@angular/core';
import { BaseResponse, BaseService, RestService, TrackRestCallProgress } from 'ngc-framework';
import { Observable } from 'rxjs';
// EXP_ENV/Configuration
import { AWB_ENV, CFG_ENV, EXPBU_ENV, EXP_ENV, IMP_ENV, SATSSGINTERFACE_ENV, MST_ENV, CARGOMESSAGING_ENV } from '../../environments/environment';
import { VolumetricRequest, WeighingScaleWeighingRequest, CargoWeighingRevisedServiceModelRevised, AwbReservation, AwbReservationSearch, BookCancelShipment, BookingFlightEdit, BookMultipleShipmentSearch, BookMultipleShipmentsFlight, CargoWeighingDetailInventory, CargoWeighingServiceModel, Dimention, Embargo, Flight, FlightSegment, FwbFhlDiscrepancyRequestModel, FwbFhlDiscrepancyResponseModel, GetAwbDetails, GetFlightId, HouseInformationModel, MaintainSSPDModel, ManifestFlight, NeutralAWBMasterResponse, OutboundLyingListRequest, OutboundLyingListResponse, SearchFLightShipment, SearchNAWBRQ, SearchSingleBookingShipment, SearchStockRequest, SIDHeaderDetailResponse, SIDSearchRequest, SingleShipmentBooking, StockResponse, ThroughTransitWorkingAdviceModel, WorkingList, WeighingScaleRequest, CargoWeighingDetailModel, weighingTimeModel, PartScenarioModel, ScannerResponseModel, AcceptanceWeighingSearchRequest, ExportAwbDocumentModel, ExportAwbDocumentSearchModel, SearchEFBL, ApproveRebuildCargoAdviceSearch, RebuildCargoAdviceSearch } from './export.sharedmodel';

@Injectable()
export class ExportService extends BaseService {

  public dataForSnapshotDisplay: any;
  public dataToNawbStockManagement: any;
  public dataToNawbStockStatus: any;
  public dataToInsertOrUpdateBMS: any;

  workingListURL: 'http://localhost:8082/';

  constructor(private restService: RestService) {
    super();

  }

  // @TrackRestCallProgress()
  // public getMessageId(request: ScanVolWgtRequest): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>
  //     this.restService.get('http://localhost:3000/embargo', request);
  // }

  @TrackRestCallProgress()
  public getEmbargoList(request: Embargo): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.get('http://localhost:3000/embargo', request);
  }


  public addEmbargo(request) {
    return true;
  }

  public udpateEmbargo(request) {
    return true;
  }

  public deleteEmbargoList(request) {
    return true;
  }

  // LYING LIST STARTS HERE
  @TrackRestCallProgress()
  public fetchLyingList(request: OutboundLyingListRequest):
    Observable<BaseResponse<OutboundLyingListResponse>> {
    return <Observable<BaseResponse<OutboundLyingListResponse>>>
      this.restService.post
        (EXP_ENV.serviceBaseURL +
          EXP_ENV.outboundLyingList, request);
  }

  @TrackRestCallProgress()
  public getAwbDetails(request: GetAwbDetails):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL +
        EXP_ENV.getAwbDetails, request);
  }

  @TrackRestCallProgress()
  public getMessageId(request: VolumetricRequest):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (SATSSGINTERFACE_ENV.serviceBaseURL + SATSSGINTERFACE_ENV.getMessageId, request);
  }
  // LYING LIST ENDS HERE

  // BOOK MULTIPLE SHIPMENT STARTS HERE
  @TrackRestCallProgress()
  public getMultipleShipmentBookingList(request: BookMultipleShipmentSearch):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXP_ENV.serviceBaseURL +
          EXP_ENV.searchMultipleShipmentBookingDetail, request);
  }

  // @TrackRestCallProgress()
  // public addMultipleShipmentBookingList(request:
  //   BookMultipleShipmentsFlight):
  //   Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>this.restService.post
  //     (EXP_ENV.serviceBaseURL +
  //       EXP_ENV.maintainMultipleShipmentBookingDetail, request);
  // }

  @TrackRestCallProgress()
  public getFlightDetail(request: SearchFLightShipment): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getFlightShipmentDetail, request);
  }

  @TrackRestCallProgress()
  public getShipmentDetail(request: SearchFLightShipment): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getShipmentDetail, request);
  }

  @TrackRestCallProgress()
  public editFlightShipment(request: BookingFlightEdit) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.editFlightShipmentDetail, request);
  }

  @TrackRestCallProgress()
  public cancelMultipleShipment(request: BookCancelShipment): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.cancelMultipleShipment, request);
  }

  @TrackRestCallProgress()
  public deleteMultipleShipment(request: BookCancelShipment): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.deleteMultipleShipment, request);
  }

  @TrackRestCallProgress()
  public validateRoutingForMultipleShipment(request:
    BookMultipleShipmentsFlight):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL +
        EXP_ENV.validateRoutingForMultipleShipment, request);
  }
  //  BOOK MULTIPLE SHIPMENTS ENDS HERE

  // WORKING LIST STARTS HERE
  @TrackRestCallProgress()
  public checkNilAndCreateManifest(request: Flight) {
    return <Observable<BaseResponse<ManifestFlight>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.checkNilAndCreateManifest, request);
  }
  @TrackRestCallProgress()
  public createManifest(request: ManifestFlight) {
    return <Observable<BaseResponse<ManifestFlight>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.createManifest, request);
  }
  @TrackRestCallProgress()
  public getWorkingList(request:
    any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.searchWorkingList, request);
  }


  @TrackRestCallProgress()
  public getExportWorkingListInfo(request:
    any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.getExportWorkingListInfo, request);
  }

  @TrackRestCallProgress()
  public sendFBR(request:
    any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.sendFBR, request);
  }

  @TrackRestCallProgress()
  public getSnapshot(request:
    FlightSegment): Observable<BaseResponse<WorkingList>> {
    return <Observable<BaseResponse<WorkingList>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.searchSnapshot, request);
  }
  @TrackRestCallProgress()
  public createSnapshot(request:
    FlightSegment): Observable<BaseResponse<FlightSegment>> {
    return <Observable<BaseResponse<FlightSegment>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.createSnapshot, request);
  }

  @TrackRestCallProgress()
  public createSnapshotNew(request:
    FlightSegment): Observable<BaseResponse<FlightSegment>> {
    return <Observable<BaseResponse<FlightSegment>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.createSnapshotnew, request);
  }

  @TrackRestCallProgress()
  public createSnapshotReport(request:
    FlightSegment): Observable<BaseResponse<FlightSegment>> {
    return <Observable<BaseResponse<FlightSegment>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.createSnapshotReport, request);
  }

  @TrackRestCallProgress()
  public updateMailInformation(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.updateWorkingListMailInformation, request);
  }

  @TrackRestCallProgress()
  public promoteCargoSearch(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.promotecargosearch, request);
  }

  @TrackRestCallProgress()
  public promoteCargo(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.promotecargo, request);
  }


  // WORKING LIST ENDS HERE

  // BOOK SINGLE SHIPMENT

  @TrackRestCallProgress()
  public singleBookingShipmentSearch(request: SearchSingleBookingShipment) {
    return <Observable<BaseResponse<SingleShipmentBooking>>>this.restService.post
      (EXP_ENV.serviceBaseURL +
        EXP_ENV.singleShipmentBookingSearch, request);
  }

  @TrackRestCallProgress()
  public singleBookingShipmentSave(request: SingleShipmentBooking) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL +
        EXP_ENV.singleShipmentBookingCreateBooking, request);
  }

  @TrackRestCallProgress()
  public singleBookingShipmentDeletePartBooking(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL +
        EXP_ENV.singleShipmentBookingDeletePart, request);
  }

  @TrackRestCallProgress()
  public singleBookingShipmentMergePart(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL +
        EXP_ENV.singleShipmentBookingMergePart, request);
  }

  @TrackRestCallProgress()
  public singleBookingShipmentGetSuffix(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL +
        EXP_ENV.singleShipmentBookingGetSuffix, request);
  }
  @TrackRestCallProgress()
  public addNewPart(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL +
        EXP_ENV.singleShipmentAddNewPart, request);
  }

  // BOOK SINGLE SHIPMENT ENDS HERE

  // <================================================> //
  // Acceptance Handling Definition //
  @TrackRestCallProgress()
  public getProportionalWeightForSingleShipment(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL +
        EXP_ENV.singleShipmentGetProportionalWeight, request);
  }

  @TrackRestCallProgress()
  public validateOnTTUncheck(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL +
        EXP_ENV.validateOnTTUncheck, request);
  }


  // NAWB STARTS HERE
  @TrackRestCallProgress()
  public searchSID(request: SIDSearchRequest): Observable<BaseResponse<SIDHeaderDetailResponse>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<SIDHeaderDetailResponse>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.searchSIDListByCriteria, request);
  }
  //  @TrackRestCallProgress()
  // public searchStock(request: SearchStockRequest): Observable<BaseResponse<StockResponse>> {
  //   console.log(JSON.stringify(request));
  //   return <Observable<BaseResponse<StockResponse>>>this.restService.post
  //     (AWB_ENV.serviceBaseURL + AWB_ENV.searchAWBFromStockList, request);
  // }
  @TrackRestCallProgress()
  public searchSIDByHeaderID(request: SIDSearchRequest): Observable<BaseResponse<NeutralAWBMasterResponse>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<NeutralAWBMasterResponse>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.searchSIDDetails, request);
  }

  @TrackRestCallProgress()
  public getAgentInfo(): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.searchAgentInfo, null);
  }

  // MANAGE ACCEPTANCE WEIGHING//
  @TrackRestCallProgress()
  public onSearchAWB(request: CargoWeighingServiceModel): Observable<BaseResponse<CargoWeighingServiceModel>> {
    return <Observable<BaseResponse<CargoWeighingServiceModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchAWB, request);
  }

  // MANAGE ACCEPTANCE WEIGHING REVISED//
  @TrackRestCallProgress()
  public onSearchAWBRevised(request: CargoWeighingRevisedServiceModelRevised): Observable<BaseResponse<CargoWeighingRevisedServiceModelRevised>> {
    return <Observable<BaseResponse<CargoWeighingRevisedServiceModelRevised>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchAWBRevised, request);
  }

  @TrackRestCallProgress()
  public onSaveWeighing(request:
    CargoWeighingServiceModel) {
    return <Observable<BaseResponse<CargoWeighingServiceModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSaveWeighing, request);
  }

  @TrackRestCallProgress()
  public onSaveWeighingRevised(request:
    CargoWeighingRevisedServiceModelRevised) {
    return <Observable<BaseResponse<CargoWeighingRevisedServiceModelRevised>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSaveWeighingRevised, request);
  }

  @TrackRestCallProgress()
  public getPartData(request:
    PartScenarioModel) {
    return <Observable<BaseResponse<PartScenarioModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onGetPartData, request);
  }

  @TrackRestCallProgress()
  public chargecalculation(request:
    CargoWeighingServiceModel) {
    return <Observable<BaseResponse<Boolean>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.chargeCreation, request);
  }

  @TrackRestCallProgress()
  public updateMasters(request:
    CargoWeighingServiceModel) {
    return <Observable<BaseResponse<Boolean>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.updateMasters, request);
  }


  @TrackRestCallProgress()
  public paymentststatuscheck(request:
    CargoWeighingServiceModel) {
    return <Observable<BaseResponse<Boolean>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.paymentStatusCheck, request);
  }

  @TrackRestCallProgress()
  public onOpenTagsInfo(request:
    HouseInformationModel) {
    return <Observable<BaseResponse<CargoWeighingDetailInventory>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onFetchHouseTags, request);
  }

  @TrackRestCallProgress()
  public getVolumetricWeight(request:
    Dimention) {
    return <Observable<BaseResponse<Dimention>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onFetchVolumetricWeight, request);
  }

  @TrackRestCallProgress()
  public getVolumetricWeightRevised(request:
    Dimention) {
    return <Observable<BaseResponse<Dimention>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onFetchVolumetricWeightRevised, request);
  }

  @TrackRestCallProgress()
  public getDimensionsFromScanner(request:
    ScannerResponseModel) {
    return <Observable<BaseResponse<ScannerResponseModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onFetchVolumetricScannerResponse, request);
  }

  @TrackRestCallProgress()
  public onPart(request:
    CargoWeighingServiceModel) {
    return <Observable<BaseResponse<CargoWeighingServiceModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onPartConfirm, request);
  }

  @TrackRestCallProgress()
  public onFinalize(request:
    CargoWeighingServiceModel) {
    return <Observable<BaseResponse<CargoWeighingServiceModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onFinalizeWeight, request);
  }


  @TrackRestCallProgress()
  public onFinalizeRevised(request:
    CargoWeighingRevisedServiceModelRevised) {
    return <Observable<BaseResponse<CargoWeighingRevisedServiceModelRevised>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onFinalizeWeightRevised, request);
  }

  @TrackRestCallProgress()
  public getProportionalWeight(request:
    any) {
    return <Observable<BaseResponse<CargoWeighingServiceModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.getProportionalWeight, request);
  }


  @TrackRestCallProgress()
  public getProportionalWeightRevised(request:
    any) {
    //return null;
    return <Observable<BaseResponse<CargoWeighingRevisedServiceModelRevised>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.getProportionalWeightRevised, request);
    //(null, null);
  }

  @TrackRestCallProgress()
  public getProportionalWeightRevisedForGross(request:
    any) {
    //return null;
    return <Observable<BaseResponse<CargoWeighingRevisedServiceModelRevised>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.getProportionalWeightRevisedForGross, request);
  }

  @TrackRestCallProgress()
  public getExcludedSHCFlagForVolumetric(request:
    any) {
    //return null;
    return <Observable<BaseResponse<CargoWeighingRevisedServiceModelRevised>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.getExcludedSHCFlagForVolumetric, request);
  }

  @TrackRestCallProgress()
  public setPartAccepted(request:
    CargoWeighingRevisedServiceModelRevised) {
    //return null;
    return <Observable<BaseResponse<CargoWeighingRevisedServiceModelRevised>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.setPartAccepted, request);
  }
  @TrackRestCallProgress()
  public fetchRuleShipmentExecutionList(request:
    CargoWeighingRevisedServiceModelRevised) {
    return <Observable<BaseResponse<CargoWeighingRevisedServiceModelRevised>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.fetchRuleShipmentExecutionList, request);
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

  @TrackRestCallProgress()
  public getVolumeDimension(request:
    CargoWeighingServiceModel) {
    return <Observable<BaseResponse<CargoWeighingServiceModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.calculateDimensionVolume, request);
  }


  @TrackRestCallProgress()
  public onDelay(request:
    CargoWeighingServiceModel) {
    return <Observable<BaseResponse<CargoWeighingServiceModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onDelayAcceptance, request);
  }

  @TrackRestCallProgress()
  public onResume(request:
    CargoWeighingServiceModel) {
    return <Observable<BaseResponse<CargoWeighingServiceModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onResumeAcceptance, request);
  }

  @TrackRestCallProgress()
  public onSaveWeighingStartTime(request:
    CargoWeighingServiceModel) {
    return <Observable<BaseResponse<weighingTimeModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSaveStartWeighingTime, request);
  }

  @TrackRestCallProgress()
  public onSaveWeighingStartTimeRevised(request:
    CargoWeighingRevisedServiceModelRevised) {
    return <Observable<BaseResponse<weighingTimeModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSaveStartWeighingTimeRevised, request);
  }

  @TrackRestCallProgress()
  public onSaveWeighingDelayTimeRevised(request:
    CargoWeighingRevisedServiceModelRevised) {
    return <Observable<BaseResponse<weighingTimeModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSaveDelayWeighingTimeRevised, request);
  }

  @TrackRestCallProgress()
  public onResumeWeighingDelayTimeRevised(request:
    CargoWeighingRevisedServiceModelRevised) {
    return <Observable<BaseResponse<weighingTimeModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onResumeDelayWeighingTimeRevised, request);
  }

  @TrackRestCallProgress()
  public onStartWeighingCustomCheck(request:
    CargoWeighingServiceModel) {
    return <Observable<BaseResponse<CargoWeighingServiceModel>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onStartWeighingCustomCheck, request);
  }

  @TrackRestCallProgress()
  public onStartWeighingCustomCheckRevised(request:
    CargoWeighingRevisedServiceModelRevised) {
    return <Observable<BaseResponse<CargoWeighingRevisedServiceModelRevised>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onStartWeighingCustomCheckRevised, request);
  }



  @TrackRestCallProgress()
  public unfinalizeShipment(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.unfinalizeWeightOfShipment, request);

  }

  @TrackRestCallProgress()
  public unfinalizeShipmentRevised(request: CargoWeighingRevisedServiceModelRevised) {
    return <Observable<BaseResponse<CargoWeighingRevisedServiceModelRevised>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.unfinalizeWeightOfShipmentRevised, request);

  }

  @TrackRestCallProgress()
  public eccFinalize(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.eccFinalize, request);

  }

  @TrackRestCallProgress()
  public eccFinalizeRevised(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.eccFinalizeRevised, request);

  }

  @TrackRestCallProgress()
  public pullULDBUP(request: any) {
    return <Observable<BaseResponse<CargoWeighingDetailModel>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.pullULDBUP, request);

  }
  // <================================================> //

  @TrackRestCallProgress()
  public onSearchEccExpDetails(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchEccExpDetails, request);
  }


  @TrackRestCallProgress()
  public saveAddPlanning(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.saveAddPlanning, request);
  }

  // stock management starts
  @TrackRestCallProgress()
  public fetchAWBStockSummary(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.fetchAWBStockSummary, request);
  }
  // stock management starts
  @TrackRestCallProgress()
  public updateNewStockLimit(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.updateNewStockLimit, request);
  }

  // stock mark as deleted
  @TrackRestCallProgress()
  public markDelete(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.markDelete, request);
  }

  @TrackRestCallProgress()
  public addAWBStock(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.addAWBStock, request);
  }

  @TrackRestCallProgress()
  public updateLowStockLimit(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.updateLowStockLimit, request);
  }

  // stock management ends

  // NAWB STARTS HERE



  @TrackRestCallProgress()
  public fetchLowStockLimit(request) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.fetchLowStockLimit, request);
  }
  // stock management ends

  // NAWB STARTS HERE

  @TrackRestCallProgress()
  public searchStock(request: SearchStockRequest): Observable<BaseResponse<StockResponse>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<StockResponse>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.searchAWBFromStockList, request);
  }

  @TrackRestCallProgress()
  public updateInProcessForAwbNumber(request: SearchStockRequest): Observable<BaseResponse<StockResponse>> {
    return <Observable<BaseResponse<StockResponse>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.updateInProcessForAwbNumber, request);
  }

  @TrackRestCallProgress()
  public saveNawb(saveRequest): Observable<BaseResponse<NeutralAWBMasterResponse>> {
    console.log(saveRequest);
    console.log(JSON.stringify(saveRequest));
    return <Observable<BaseResponse<NeutralAWBMasterResponse>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.saveNawb, saveRequest);
  }
  @TrackRestCallProgress()
  public searchNawb(searchNawb: SearchNAWBRQ): Observable<BaseResponse<NeutralAWBMasterResponse>> {
    console.log(searchNawb);
    return <Observable<BaseResponse<NeutralAWBMasterResponse>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.searchNawb, searchNawb);
  }
  @TrackRestCallProgress()
  public saveNeutralAWB(saveRequest): Observable<BaseResponse<NeutralAWBMasterResponse>> {
    console.log(saveRequest);
    console.log(JSON.stringify(saveRequest));
    return <Observable<BaseResponse<NeutralAWBMasterResponse>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.saveNeutralAWB, saveRequest);
  }
  @TrackRestCallProgress()
  public fetchChargeList(saveRequest): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.fetchChargeList, saveRequest);
  }
  @TrackRestCallProgress()
  public fetchData(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchawbdata, request);
  }

  @TrackRestCallProgress()
  public saveEcsdData(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveEcsdData, request);
  }


  @TrackRestCallProgress()
  public fetchFlightId(getFlightId: GetFlightId): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.getFLightId, getFlightId);
  }

  // @TrackRestCallProgress()
  //    public onSearchAWB(request:
  //     CargoWeighingServiceModel): Observable<BaseResponse<CargoWeighingServiceModel>> {
  //     return <Observable<BaseResponse<CargoWeighingServiceModel>>>this.restService.post
  //       (EXP_ENV.serviceBaseURL + EXP_ENV.onSearchAWB, request);
  //   }

  // @TrackRestCallProgress()
  // public saveNawb(saveRequest): Observable<BaseResponse<NeutralAWBMasterResponse>> {
  //   console.log(saveRequest);
  //   console.log(JSON.stringify(saveRequest));
  //   return <Observable<BaseResponse<NeutralAWBMasterResponse>>>this.restService.post
  //     (AWB_ENV.serviceBaseURL + AWB_ENV.saveNawb, saveRequest);
  // }

  // @TrackRestCallProgress()
  // public searchNawb(searchNawb:SearchNAWBRQ): Observable<BaseResponse<NeutralAWBMasterResponse>> {
  //   console.log(searchNawb);
  //   return <Observable<BaseResponse<NeutralAWBMasterResponse>>>this.restService.post
  //     (AWB_ENV.serviceBaseURL + AWB_ENV.searchNawb, searchNawb);
  // }

  // Through Transit Working Advice Services start from here
  @TrackRestCallProgress()
  public insertTTWorkingAdvice(request): Observable<BaseResponse<ThroughTransitWorkingAdviceModel>> {
    return <Observable<BaseResponse<ThroughTransitWorkingAdviceModel>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.insertTTWA, request);
  }
  @TrackRestCallProgress()
  public getTTWorkingAdvice(request): Observable<BaseResponse<ThroughTransitWorkingAdviceModel>> {
    return <Observable<BaseResponse<ThroughTransitWorkingAdviceModel>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getTTWASearch, request);
  }
  //for getting contour code
  @TrackRestCallProgress()
  public getContourCodeForTTWorkingAdvice(request): Observable<BaseResponse<ThroughTransitWorkingAdviceModel>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getContourCodeForTTWorkingAdvice, request);
  }
  //
  @TrackRestCallProgress()
  public deleteFlightPair(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteFlightPair, request);
  }

  @TrackRestCallProgress()
  public getIncomingFlights(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getIncomingflights, request);
  }

  @TrackRestCallProgress()
  public validatePreExistingShift(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.validatePreExistingShift, request);
  }


  // Through Transit Working Advice Services ends here

  // MaintainSSPD Service starts here

  @TrackRestCallProgress()
  public onSearchSSPD(request:
    MaintainSSPDModel) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.searchSSPD, request);
  }

  public onSearchPartSuffixForSSPD(request:
    MaintainSSPDModel) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.searchPartSuffix, request);
  }

  @TrackRestCallProgress()
  public onSaveSSPD(request:
    MaintainSSPDModel) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveSSPD, request);
  }




  // MaintainSSPD Service ends here

  @TrackRestCallProgress()
  public getDimesionVolume(request: Dimention) {
    return <Observable<BaseResponse<Dimention>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.dimentionVolume, request);
  }
  @TrackRestCallProgress()
  public getDimensionVolumetricWeight(request: Dimention) {
    return <Observable<BaseResponse<Dimention>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.dimentionVolumetricWeight, request);
  }
  @TrackRestCallProgress()
  public getConvertedVolume(request: Dimention) {
    return <Observable<BaseResponse<Dimention>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.convertedVolumeBasedOnVolumeCode, request);
  }

  //awbReservation service starts here

  @TrackRestCallProgress()
  public getNextAwbNumberForReservation(request: AwbReservationSearch) {
    return <Observable<BaseResponse<AwbReservationSearch>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.getNextAwbNumberForReservation, request);
  }
  @TrackRestCallProgress()
  public saveAwbReservation(request: AwbReservation) {
    return <Observable<BaseResponse<AwbReservation>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.saveAwbReservation, request);
  }
  @TrackRestCallProgress()
  public fetchAwbReservationDetails(request: AwbReservationSearch) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.fetchAwbReservationDetails, request);
  }
  //awbReservation service ends here


  // FWB FHL Discrepancy Service
  @TrackRestCallProgress()
  public searchFWBFHLDiscrepancy(request: FwbFhlDiscrepancyRequestModel): Observable<BaseResponse<FwbFhlDiscrepancyResponseModel>> {
    return <Observable<BaseResponse<FwbFhlDiscrepancyResponseModel>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.searchFWBFHLDiscrepancy, request);
  }


  @TrackRestCallProgress()
  public getWeightInformation(request: WeighingScaleRequest) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getWeighingData, request);
  }

  @TrackRestCallProgress()
  public getWeighingScaleData(request: WeighingScaleWeighingRequest) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getWeighingScaleData, request);
  }

  @TrackRestCallProgress()
  public cancelShipment(request: SearchSingleBookingShipment) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.cancelBooking, request);
  }


  @TrackRestCallProgress()
  public getVolumeByDensity(request: Dimention) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.getVolumeByDensity, request);
  }


  @TrackRestCallProgress()
  public saveAedAcasDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveAedAcasData, request);
  }

  @TrackRestCallProgress()
  public getShipmentMasterData(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.getShipmentMasterData, request);
  }



  @TrackRestCallProgress()
  public printMultiAWBBarcode(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      IMP_ENV.serviceImportURL + IMP_ENV.printMultiAwbBarcode,
      request
    );
  }

  @TrackRestCallProgress()
  public printNAWBCopy(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      AWB_ENV.serviceBaseURL + AWB_ENV.printNAWBCopy,
      request
    );
  }

  @TrackRestCallProgress()
  public getSegmentTime(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.getSegmentTime,
      request
    );
  }


  @TrackRestCallProgress()
  public getHandleInfo(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.getHandleInSystem,
      request
    );
  }

  @TrackRestCallProgress()
  public deleteFlightBooking(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.singleShipmentDeleteFlightBooking, request
    );
  }

  // Cancel BOOK  SHIPMENT STARTS HERE
  @TrackRestCallProgress()
  public getCancelBookedShipmentList(request: BookMultipleShipmentSearch):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXP_ENV.serviceBaseURL +
          EXP_ENV.searchCancelBookedShipmentList, request);
  }

  //New ICMS BOOKING PUBLISH 
  @TrackRestCallProgress()
  public getIcmsBookingPublishList(request): Observable<BaseResponse<any>> {
    const searchParams = '?awbNumber=' + (request.shipmentNumber ? request.shipmentNumber : '');
    return <Observable<BaseResponse<any>>>
      this.restService.get
        (CARGOMESSAGING_ENV.serviceBaseURL +
          CARGOMESSAGING_ENV.searchIcmsBookingPublishList + searchParams, request);
  }

  @TrackRestCallProgress()
  public cancelBookedShipment(request: BookCancelShipment): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.bookedShipmentCancel, request);
  }

  @TrackRestCallProgress()
  public unloadWeight(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.unloadWeight,
      request
    );
  }

  @TrackRestCallProgress()
  public reBookShipments(request: BookCancelShipment): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.reBookShipments, request);
  }

  @TrackRestCallProgress()
  public validateRouteForReBooking(request: BookCancelShipment): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.validateRouteForReBooking, request);
  }

  @TrackRestCallProgress()
  public targetCancel(request: BookCancelShipment): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.targetCancel, request);
  }

  // updateBooking services satrts here
  @TrackRestCallProgress()
  public searchUpdateBooking(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.updateBookingPcsWtSearch, request);
  }
  @TrackRestCallProgress()
  public UpdateBookingPcsWt(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.updateBookingPcsWtOperation, request);
  }
  // updateBooking services ends here
  @TrackRestCallProgress()
  public getAgentDetail(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getAgentDetail, request);

  }

  //Auto KC target
  @TrackRestCallProgress()
  public createAutoKCConfig(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceAgentURL + MST_ENV.createAutoKCConfig, request);
  }

  @TrackRestCallProgress()
  public fetchAutoKCConfig(): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceAgentURL + MST_ENV.fetchAutoKCConfig, null);
  }

  @TrackRestCallProgress()
  public fetchAutoKCMonitoringList(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(MST_ENV.serviceAgentURL + MST_ENV.fetchAutoKCMonitoringList, request);
  }

  /* Revamped UI acceptance weighing service calls*/
  @TrackRestCallProgress()
  public getHouseListWeighing(request: AcceptanceWeighingSearchRequest) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.fetchHouseList, request
    )
  }
  @TrackRestCallProgress()
  getAWBNumber(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.fetchAWBNumber, request
    )
  }
  @TrackRestCallProgress()
  onSaveAcceptanceWeighing(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.saveAcceptanceWeighing, request
    )
  }

  @TrackRestCallProgress()
  onCalculation(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.onCalculation, request
    )
  }
  @TrackRestCallProgress()
  public finalize(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.finalize, request
    )
  }
  @TrackRestCallProgress()
  public finalizeHouse(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.finalizeHouse, request
    )
  }
  @TrackRestCallProgress()
  public unfinalizeHawb(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.unfinalizeHawb, request
    )
  }
  @TrackRestCallProgress()
  public unfinalizeHouse(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.unfinalizeHouse, request
    )
  }

  @TrackRestCallProgress()
  public onFinalizeWeightHouseList(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.onFinalizeWeightHouseList, request
    )
  }

  @TrackRestCallProgress()
  public unfinalizeShipmentHouseList(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.unfinalizeShipmentHouseList, request
    )
  }

  @TrackRestCallProgress()
  public unfinalize(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.unfinalize, request
    )
  }

  @TrackRestCallProgress()
  public refreshHawbList(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.refreshHawbList, request
    )
  }

  @TrackRestCallProgress()
  public getHouseSummary(cargo: CargoWeighingRevisedServiceModelRevised) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.getHouseSummary, cargo
    );
  }

  @TrackRestCallProgress()
  public fetchRuleShipmentExecutionListAccptByHouse(request:
    CargoWeighingRevisedServiceModelRevised) {
    return <Observable<BaseResponse<CargoWeighingRevisedServiceModelRevised>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.fetchRuleShipmentExecutionListAccptByHouse, request);
  }

  @TrackRestCallProgress()
  public getFlightOffPointWeighing(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.getFlightOffPointWeighing, request
    )
  }

  @TrackRestCallProgress()
  public getFlightOffPointSummary(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.getFlightOffPointSummary, request
    )
  }



  @TrackRestCallProgress()
  public getExportAwbDocumentResponse(request: ExportAwbDocumentModel): Observable<BaseResponse<ExportAwbDocumentSearchModel>> {
    return <Observable<BaseResponse<ExportAwbDocumentSearchModel>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.getExportAwbDocumentResponse, request);
  }

  @TrackRestCallProgress()
  public saveExportAwbDocumentResponse(request: ExportAwbDocumentModel): Observable<BaseResponse<ExportAwbDocumentSearchModel>> {
    return <Observable<BaseResponse<ExportAwbDocumentSearchModel>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.saveExportAwbDocumentResponse, request);
  }

  @TrackRestCallProgress()
  public getEmailInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getEmailInfoResponse, request);
  }

  @TrackRestCallProgress()
  public getDocumentCompleteResponse(request: ExportAwbDocumentModel): Observable<BaseResponse<ExportAwbDocumentModel>> {
    return <Observable<BaseResponse<ExportAwbDocumentModel>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getDocumentComplete, request);
  }

  @TrackRestCallProgress()
  public getDocumentReOpenResponse(request: ExportAwbDocumentModel): Observable<BaseResponse<ExportAwbDocumentModel>> {
    return <Observable<BaseResponse<ExportAwbDocumentModel>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getDocumentReOpen, request);
  }


  @TrackRestCallProgress()
  public searchAcceptanceSummary(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.searchSummary, request)
  }

  @TrackRestCallProgress()
  public deleteSB(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.deleteSB, request)
  }

  @TrackRestCallProgress()
  public saveAcceptanceSummary(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.saveAcceptanceSummary, request)
  }

  @TrackRestCallProgress()
  public sendcargoarrivalreport(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.sendCargoArrivalReport, request)
  }

  @TrackRestCallProgress()
  public sendCargoArrivalReportForAmendment(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.sendCargoArrivalReportForAmendment, request)
  }

  @TrackRestCallProgress()
  public saveDeclaredDimensions(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.saveDeclaredDimensions, request)
  }

  @TrackRestCallProgress()
  public cancelHouse(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.cancelHouse, request)
  }

  @TrackRestCallProgress()
  public finalizeWeight(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.finalizeWeight, request)
  }

  @TrackRestCallProgress()
  public reOpenfinalizeWeight(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.reOpenfinalizeWeight, request);
  }

  @TrackRestCallProgress()
  public replaceDummyAWB(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.replaceDummyAWB, request);
  }

  @TrackRestCallProgress()
  public generateDummyAWB(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.generateDummyAWB, request);
  }
  @TrackRestCallProgress()
  public rejectHouse(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.rejectHouse, request)
  }
  @TrackRestCallProgress()
  public returnCargo(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.returnCargo, request)
  }
  @TrackRestCallProgress()
  public returnDomesticCargo(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.returnDomesticCargo, request)
  }

  @TrackRestCallProgress()
  public cancelReturnCharges(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.returnDomesticCargo, request)
  }
  @TrackRestCallProgress()
  public promoteCargoSearchAWB(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.promotecargosearchAWB, request);
  }

  @TrackRestCallProgress()
  public cancelReturnCargo(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.cancelReturnCargo, request)
  }

  @TrackRestCallProgress()
  public cancelReturnCargoWeighing(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.cancelReturnCargoWeighing, request)
  }

  @TrackRestCallProgress()
  public cancelReturnHouse(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.cancelReturnHouse, request)
  }

  @TrackRestCallProgress()
  public startHouseWeighing(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.startHouseWeighing, request)
  }

  @TrackRestCallProgress()
  public fetchRuleShipmentExecutionListExportAwbDocument(request:
    CargoWeighingRevisedServiceModelRevised) {
    return <Observable<BaseResponse<CargoWeighingRevisedServiceModelRevised>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.fetchRuleShipmentExecutionListExportAwbDocument, request);
  }

  @TrackRestCallProgress()
  public fetchEAWBMonitoring(request: any): any {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.fetchEAWBMonitoring, request);
  }

  // Rebuild Cargo Advice Starts
  @TrackRestCallProgress()
  public getRebuildCargoAdvice(request: RebuildCargoAdviceSearch) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getRebuildCargoAdvice,
      request
    );
  }




  //efbl starts

  @TrackRestCallProgress()
  public getEFBLInfo(request:
    SearchEFBL): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.getEFBLInfo, request);
  }



  @TrackRestCallProgress()
  public flightBUComplete(request:
    SearchEFBL): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.flightBUComplete, request);
  }

  @TrackRestCallProgress()
  public manifestByEFBL(request: SearchEFBL): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXP_ENV.serviceBaseURL + EXP_ENV.manifestByEFBL, request);
  }

  @TrackRestCallProgress()
  public setRebuildCargoAdvice(request: RebuildCargoAdviceSearch) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.setRebuildCargoAdvice,
      request
    );
  }

  @TrackRestCallProgress()
  public deleteRebuildCargoAdvice(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteRebuildCargoAdvice,
      request
    );
  }
  // Rebuild Cargo Advice End

  // Approve Rebuild Cargo Advice Starts
  @TrackRestCallProgress()
  public getApproveRebuildCargoAdvice(request: ApproveRebuildCargoAdviceSearch) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getApproveRebuildCargoAdvice,
      request
    );
  }

  @TrackRestCallProgress()
  public setApproveRebuildCargoAdvice(request: ApproveRebuildCargoAdviceSearch) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.setApproveRebuildCargoAdvice,
      request
    );
  }
  // Approve Rebuild Cargo Advice End

  //Pre Manifest Screen
  @TrackRestCallProgress()
  public getPreManifestDetails(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getPreManifestDetails, request)
  }

  @TrackRestCallProgress()
  public savePreManifestDetails(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.savePreManifestDetails, request)
  }


  @TrackRestCallProgress()
  public fetchPmanAwbDetails(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchPmanAwbDetails, request)
  }

  @TrackRestCallProgress()
  public fetchPmanUldDetails(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchPmanUldDetails, request)
  }

  @TrackRestCallProgress()
  public deletePmanDtls(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deletePmanDtls, request)
  }

  public updateChargesOnDocumentComplete(request: ExportAwbDocumentModel): Observable<BaseResponse<ExportAwbDocumentModel>> {
    return <Observable<BaseResponse<ExportAwbDocumentModel>>>
      this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.updateChargesOnDocumentComplete, request);
  }

}

