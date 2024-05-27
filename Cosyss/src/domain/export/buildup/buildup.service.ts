import {
  SearchUpdateDLS,
  DLS,
  DLSULD,
  DLSFlight,
  OffloadModel,
  OffloadSegment,
  OffloadShipmentInventory,
  OffloadULD,
  OffloadHandoverModel,
  OffloadHandoverULD,
  OffloadWarehouseFlight,
  SpecialShipmentRequest,
  SpecialShipment,
  OutgoingFlightRequest,
  OutgoingFlights,
  OutwardServiceReportSearchRequest,
  OutwardServiceReportSearchResponse,
  OutwardServiceReportInsertRequest,
  FinalizeFlagDataOutwardServiceReport,
  SearchForLyingList,
  OffloadShipment,
  LyingListShipment,
  LyingListContainer,
  FlightCompleteSearch,
  FlightComplete,
  WeightLoadStatement,
  WeightLoadStmtFlight
} from "./buildup.sharedmodel";
import {
  Flight,
  SearchBuildupFlight,
  ManifestFlight,
  FlightAirlineLoadingInstructions,
  SearchLoadShipment,
  SeparateManifest,
  FlightEvent,
  UnloadShipment,
  AssignULDSearch,
  UnloadShipmentSearch,
  DisplayDLSVariance,
  SearchDisplayDLSVariance,
  SearchMailOffload,
  LoadAndUnloadModelForAmendFlight,
  SearchSpecialCargoShipmentForHO
} from "./../export.sharedmodel";

import { Injectable } from "@angular/core";
import {
  BaseResponse,
  RestService,
  BaseService,
  BaseRequest,
  TrackRestCallProgress
} from "ngc-framework";
import { Observable } from "rxjs";
import { log } from "util";
import { EXP_ENV, EXPBU_ENV, CARGO_MESSAGING_ENV, WH_ENV, BATCH_ENV } from "../../../environments/environment";
import {
  UldShipment,
  BuildupLoadShipment,
  BuildupLoadShipmentResponse,
  SearchUldShipment,
  BuildUpCompleteEvent,
  MoveToFlight
} from "./../export.sharedmodel";

@Injectable()
export class BuildupService {

  requestUld: () => any;
  constructor(private restService: RestService) { }

  @TrackRestCallProgress()
  public checkAssignedUldTrolleyToFight(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.checkAssignedUldTrolleyToFight,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchEquipmentReturnRecord(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.fetchEquipmentReturnRecord,
      request
    );
  }

  @TrackRestCallProgress()
  public insertUldWeighRecord(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.insertUldWeighRecord,
      request
    );
  }

  // Unload shipment service start
  @TrackRestCallProgress()
  public fetchFlightDetails(request: Flight) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchFlightDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public fetchShipmentDetails(request: UnloadShipmentSearch) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchShipmentDetails,
      request
    );
  }

  @TrackRestCallProgress()
  public unloadShipments(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.unloadShipment,
      request
    );
  }
  @TrackRestCallProgress()
  public unloadWeight(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.unloadWeight,
      request
    );
  }

  @TrackRestCallProgress()
  public getPartSuffixPieceWeight(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getPartSuffixPieceWeight,
      request
    );
  }
  // Unload shipment service end

  // Cargo Manifest
  @TrackRestCallProgress()
  public getManifest(request: Flight) {
    return <Observable<BaseResponse<ManifestFlight>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getManifest,
      request
    );
  }

  @TrackRestCallProgress()
  public createSeparateManifest(request: SeparateManifest) {
    return <Observable<BaseResponse<ManifestFlight>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.createSeparateManifest,
      request
    );
  }

  // @TrackRestCallProgress()
  public deleteSeparateManifest(request: SeparateManifest) {
    return <Observable<BaseResponse<ManifestFlight>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteSeparateManifest,
      request
    );
  }

  @TrackRestCallProgress()
  public createSupplementaryManifest(request: Flight) {
    return <Observable<BaseResponse<ManifestFlight>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.createSupplementaryManifest,
      request
    );
  }

  @TrackRestCallProgress()
  public reCreateManifest(request: Flight) {
    return <Observable<BaseResponse<ManifestFlight>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.reCreateManifest,
      request
    );
  }

  @TrackRestCallProgress()
  public updateConnectingFlightInfo(request: ManifestFlight) {
    return <Observable<BaseResponse<ManifestFlight>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateConnectingFlightInfo,
      request
    );
  }

  // LoadShipment Services start here
  @TrackRestCallProgress()
  public searchLoadShipment(request: SearchLoadShipment) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<SearchBuildupFlight>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.loadShipmentSearch,
      request
    );
  }

  // AssignULD starts
  @TrackRestCallProgress()
  public searchULDList(request: AssignULDSearch) {
    console.log(request);
    return this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.assignULDSearchULDList,
      request
    );
  }

  @TrackRestCallProgress()
  public addULD(request) {
    console.log(JSON.stringify(request));
    return this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.assignULDAddULD,
      request
    );
  }

  @TrackRestCallProgress()
  public addTrolley(request) {
    console.log(JSON.stringify(request));
    return this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.assignULDAddTrolley,
      request
    );
  }

  @TrackRestCallProgress()
  public updateULD(request) {
    console.log(JSON.stringify(request));
    console.log(request);
    return this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.assignULDUpdateULD,
      request
    );
  }

  @TrackRestCallProgress()
  public updateTrolley(request) {
    console.log(JSON.stringify(request));
    console.log(request);
    return this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.assignULDUpdateTrolley,
      request
    );
  }

  @TrackRestCallProgress()
  public deleteULDList(request) {
    console.log(JSON.stringify(request));
    console.log(request);
    return this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.assignULDDeleteULDList,
      request
    );
  }

  @TrackRestCallProgress()
  public getTareWeight(request) {
    console.log(JSON.stringify(request));
    console.log(request);
    return this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getTareWeight,
      request
    );
  }

  @TrackRestCallProgress()
  public modifyUlds(request) {
    console.log(JSON.stringify(request));
    return this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.modify,
      request
    );
  }

  @TrackRestCallProgress()
  public insertInventory(request) {
    console.log(request);
    return this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.insertInventory,
      request
    );
  }

  @TrackRestCallProgress()
  public printUldTagData(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.printUldTagData,
      request
    );
  }
  // Assign ULD ends

  // AirlineLoadingInstructions starts here
  @TrackRestCallProgress()
  public fetchAirlineLoadingInstructionsForAFlight(
    request: FlightAirlineLoadingInstructions
  ): Observable<BaseResponse<FlightAirlineLoadingInstructions>> {
    return <Observable<
      BaseResponse<FlightAirlineLoadingInstructions>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.searchAirlineLoadingInstructions,
      request
    );
  }

  @TrackRestCallProgress()
  public saveAirlineLoadingInstructionsForAFlight(
    request: FlightAirlineLoadingInstructions
  ): Observable<BaseResponse<FlightAirlineLoadingInstructions>> {
    return <Observable<
      BaseResponse<FlightAirlineLoadingInstructions>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveAirlineLoadingInstructions,
      request
    );
  }

  @TrackRestCallProgress()
  public deleteULDType(
    request: FlightAirlineLoadingInstructions
  ): Observable<BaseResponse<FlightAirlineLoadingInstructions>> {
    return <Observable<
      BaseResponse<FlightAirlineLoadingInstructions>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteULDType,
      request
    );
  }

  @TrackRestCallProgress()
  public deleteByHeight(
    request: FlightAirlineLoadingInstructions
  ): Observable<BaseResponse<FlightAirlineLoadingInstructions>> {
    return <Observable<
      BaseResponse<FlightAirlineLoadingInstructions>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteByHeight,
      request
    );
  }
  @TrackRestCallProgress()
  public fetchShipmentByUld(request: SearchUldShipment) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<UldShipment>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchShipmentByUld,
      request
    );
  }

  // @TrackRestCallProgress()
  // public fetchMailbagOffload(request: SearchMailOffload) {
  //   return <Observable<BaseResponse<any>>>this.restService.post
  //     (EXPBU_ENV.serviceBaseURL +
  //     EXPBU_ENV.getMailOffloads, request);
  // }

  @TrackRestCallProgress()
  public insertLoadShipment(request: BuildupLoadShipment) {
    console.log(JSON.stringify(request));
    return <Observable<
      BaseResponse<any>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.insertLoadShipment,
      request
    );
  }

  @TrackRestCallProgress()
  public saveUld(request: DLS) {
    if (request.uldTrolleyList && request.uldTrolleyList.length > 0) {
      if (request.uldTrolleyList[0].contentCode) {
        request.uldTrolleyList[0].contentCode = [request.uldTrolleyList[0].contentCode];
      }
    }
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveULD,
      request
    );
  }

  @TrackRestCallProgress()
  public saveTrolly(request: DLS) {
    if (request.uldTrolleyList && request.uldTrolleyList.length > 0) {
      if (request.uldTrolleyList[0].contentCode) {
        request.uldTrolleyList[0].contentCode = [request.uldTrolleyList[0].contentCode];
      }
    }
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveTrolly,
      request
    );
  }

  @TrackRestCallProgress()
  public deleteUldTrolly(request: DLS) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteUldTrolly,
      request
    );
  }

  @TrackRestCallProgress()
  public finalizeDLS(request: DLSFlight) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.finalizedDls,
      request
    );
  }

  @TrackRestCallProgress()
  public sendDLS(request: DLSFlight) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.sendDls,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchWeight(request: DLSFlight) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchWeight,
      request
    );
  }

  @TrackRestCallProgress()
  public searchUpdateDLS(request: SearchUpdateDLS) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchUpdateDLS,
      request
    );
  }


  @TrackRestCallProgress()
  public getshccode(request: SearchUpdateDLS) {
    console.log(JSON.stringify(request));
    return <Observable<any>>this.restService.post(
      CARGO_MESSAGING_ENV.serviceBaseURL + CARGO_MESSAGING_ENV.getshccodedetails,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchMailbagOffload(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.mailbagoffload,
      request
    );
  }

  @TrackRestCallProgress()
  public saveDLSOSI(request: DLS) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveDLSOSI,
      request
    );
  }

  @TrackRestCallProgress()
  public saveDLSNFM(request: DLS) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveDLSNFM,
      request
    );
  }

  @TrackRestCallProgress()
  public getTareWeightULD(request: DLSULD) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getTareWeightforULD,
      request
    );
  }
  // AirlineLoadingInstructions ends
  // Release Manifest DLS Control starts
  @TrackRestCallProgress()
  public displayFlightStatus(request: Flight) {
    return <Observable<BaseResponse<FlightEvent>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.displayFlightStatus,
      request
    );
  }
  @TrackRestCallProgress()
  public updateFlightStatus(request: FlightEvent) {
    return <Observable<BaseResponse<FlightEvent>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateFlightStatus,
      request
    );
  }

  @TrackRestCallProgress()
  public updateBuildUpCompleteEvent(request: BuildUpCompleteEvent) {
    console.log(JSON.stringify(request));
    return <Observable<
      BaseResponse<BuildUpCompleteEvent>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateBuildupEvent,
      request
    );
  }

  //AAT changes.BuildUp complete by ULD
  @TrackRestCallProgress()
  public updateBuildUpCompleteByULD(request: BuildUpCompleteEvent) {
    console.log(JSON.stringify(request));
    return <Observable<
      BaseResponse<BuildUpCompleteEvent>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateBuildUpCompleteByULD,
      request
    );
  }

  @TrackRestCallProgress()
  public checkBuildUpCompleteByULD(request: BuildUpCompleteEvent) {
    console.log(JSON.stringify(request));
    return <Observable<
      BaseResponse<BuildUpCompleteEvent>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.checkBuildUpCompleteByULD,
      request
    );
  }
  // amend ULD Search
  @TrackRestCallProgress()
  public searchLoadShipmentAmend(request: SearchLoadShipment) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<SearchBuildupFlight>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.searchAmendUld,
      request
    );
  }

  // LoadShipment Services start here
  @TrackRestCallProgress()
  public revisedLoadShipmentSearch(request: SearchLoadShipment) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<SearchBuildupFlight>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.revisedLoadShipmentSearch,
      request
    );
  }
  // move to flight
  @TrackRestCallProgress()
  public onMoveToFlight(request: MoveToFlight) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<MoveToFlight>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.moveToFlight,
      request
    );
  }
  // Move To ULD

  @TrackRestCallProgress()
  public onMoveToTrolley(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<MoveToFlight>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.moveToTrolley,
      request
    );
  }

  @TrackRestCallProgress()
  public getProportionWeightForAmend(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getProportionWeightForAmend,
      request
    );
  }

  // do unload and load for amend uld trolley
  @TrackRestCallProgress()
  public onUnloadAndLoadForAmendFlight(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<
      BaseResponse<LoadAndUnloadModelForAmendFlight>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.onUnloadAndLoadForAmenFlight,
      request
    );
  }
  //perform unload and Load in trolley
  @TrackRestCallProgress()
  public onUnloadAndLoadForAmendUldTrolley(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<
      BaseResponse<LoadAndUnloadModelForAmendFlight>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.onUnloadAndLoadForAmendUldTrolley,
      request
    );
  }
  @TrackRestCallProgress()
  public ontareWeightCalForAmendUld(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<
      BaseResponse<LoadAndUnloadModelForAmendFlight>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getTareWeightForAmendUld,
      request
    );
  }

  @TrackRestCallProgress()
  public onMoveToLoad(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.moveToLoad,
      request
    );
  }

  // validate flight for movement to flight
  @TrackRestCallProgress()
  public validateRouteForAmendFlight(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<
      BaseResponse<SearchBuildupFlight>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.validateRouteForAmendFlight,
      request
    );
  }

  // Offload ULD AWB Begins

  @TrackRestCallProgress()
  public getUldAwb(request: Flight) {
    return <Observable<BaseResponse<OffloadModel>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getUldAwb,
      request
    );
  }

  @TrackRestCallProgress()
  public saveUldAwb(request: OffloadSegment) {
    return <Observable<BaseResponse<OffloadSegment>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveUldAwb,
      request
    );
  }

  @TrackRestCallProgress()
  public searchPreoffload(request: Flight) {
    return <Observable<BaseResponse<OffloadModel>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getPreoffload,
      request
    );
  }

  @TrackRestCallProgress()
  public finalSaveOffload(request: OffloadModel) {
    return <Observable<BaseResponse<OffloadModel>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveOffload,
      request
    );
  }

  @TrackRestCallProgress()
  public deletePreOffloadData(request: OffloadModel) {
    return <Observable<BaseResponse<OffloadModel>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deletePreOffloadData,
      request
    );
  }

  @TrackRestCallProgress()
  public onlyOffload(request: OffloadULD) {
    return <Observable<BaseResponse<OffloadULD>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.onlyOffload,
      request
    );
  }

  // Offload ULD AWB Ends
  @TrackRestCallProgress()
  public onMoveCallToFlight(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.onmoveCallToFlight,
      request
    );
  }

  //  saveRampRelease
  @TrackRestCallProgress()
  public saveRampRelease(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveRampRelease,
      request
    );
  }
  // End Ramp Release Service URL
  @TrackRestCallProgress()
  public validateDriverIdForRampRelease(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.validateDriverIdForRampRelease,
      request
    );
  }
  @TrackRestCallProgress()
  public mailFetchFlightDetail(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.mailFetchFlightDetail,
      request
    );
  }

  @TrackRestCallProgress()
  public mailInsertLoad(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.mailInsertLoad,
      request
    );
  }

  @TrackRestCallProgress()
  public checkMailBagNumber(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.checkMailBagNumber,
      request
    );
  }

  // Offload Handover Starts
  @TrackRestCallProgress()
  public searchFlight(request: OffloadULD) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.searchFlight,
      request
    );
  }
  @TrackRestCallProgress()
  public validateDriverIDForOffloadHandOver(request: OffloadHandoverULD) {
    return <Observable<BaseResponse<Flight>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.validateDriverIdForOffloadHandOver,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchSHC(request: OffloadULD) {
    return <Observable<BaseResponse<OffloadULD>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchShcs,
      request
    );
  }

  @TrackRestCallProgress()
  public insertUlds(request: OffloadHandoverModel) {
    return <Observable<
      BaseResponse<OffloadHandoverModel>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.insertUlds,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchULD(request: OffloadHandoverULD) {
    return <Observable<BaseResponse<OffloadHandoverULD>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchUld,
      request
    );
  }

  @TrackRestCallProgress()
  public updateULDs(request: OffloadWarehouseFlight) {
    return <Observable<
      BaseResponse<OffloadWarehouseFlight>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateUlds,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchOffloadCheckULDs(request: OffloadULD) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchOffloadCheck,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchReturnCheckULDs(request: OffloadULD) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchReturnCheck,
      request
    );
  }

  @TrackRestCallProgress()
  public searchSpecialShipment(request: SpecialShipmentRequest) {
    return <Observable<BaseResponse<SpecialShipment>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.specialShipmentSearch,
      request
    );
  }
  // Offload handover Ends

  @TrackRestCallProgress()
  public getFlightInfo(request: SearchDisplayDLSVariance) {
    console.log(request);
    return <Observable<BaseResponse<DisplayDLSVariance>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getFlightInfo,
      request
    );
  }

  // Ramp Release Service URL
  @TrackRestCallProgress()
  public fetchRampRelease(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchRampRelease,
      request
    );
  }
  @TrackRestCallProgress()
  public deleteRampReleaseUlds(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteRampReleaseUld,
      request
    );
  }

  // ULD Summary & Details Starts
  @TrackRestCallProgress()
  public fetchUldSummery(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchUldSummery,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchUldDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchUldDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public reprint(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.reprintReleasedUld,
      request
    );
  }
  @TrackRestCallProgress()
  public groupUldTrolley(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.groupUldTrolley,
      request
    );
  }

  @TrackRestCallProgress()
  public unGroupUldTrolley(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.unGroupUldTrolley,
      request
    );
  }
  // ULD Summary & Details Ends

  // get outgoing flights
  @TrackRestCallProgress()
  public getOutgoingFlights(request: OutgoingFlightRequest) {
    return <Observable<BaseResponse<OutgoingFlights>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getOutgoingFlights,
      request
    );
  }

  // get telex message in outgoing flight
  @TrackRestCallProgress()
  public getTelexMessages(request: OutgoingFlightRequest) {
    return <Observable<BaseResponse<OutgoingFlights>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getTelexMessages,
      request
    );
  }

  @TrackRestCallProgress()
  public getConfigurableTime(request: any) {
    return <Observable<any>>this.restService.post(
      EXPBU_ENV.serviceBaseURL +
      EXPBU_ENV.getConfigurableTimeForOutgoingFlights,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchOutwardServiceReport(request: OutwardServiceReportSearchRequest) {
    return <Observable<
      BaseResponse<OutwardServiceReportSearchResponse>
    >>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchOutwardServiceReport,
      request
    );
  }

  @TrackRestCallProgress()
  public insertOutwardServiceReportManifest(
    request: OutwardServiceReportInsertRequest
  ) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.insertManifestDiscrepancies,
      request
    );
  }

  @TrackRestCallProgress()
  public insertOutwardServiceReportWarehouse(
    request: OutwardServiceReportInsertRequest
  ) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.insertWarehouseDiscrepancies,
      request
    );
  }

  @TrackRestCallProgress()
  public fetchShipmentNumberValues(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchShipmentRecord,
      request
    );
  }

  @TrackRestCallProgress()
  public setFinalizeFlagOutwardServiceReport(
    request: FinalizeFlagDataOutwardServiceReport
  ) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateFinalizeFlag,
      request
    );
  }

  @TrackRestCallProgress()
  public searchForLyingList(request: SearchForLyingList) {
    return <Observable<BaseResponse<LyingListContainer>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.searchLyingList,
      request
    );
  }

  @TrackRestCallProgress()
  public updateLocation(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateLocationforLyingList,
      request
    );
  }

  @TrackRestCallProgress()
  public checkFlightAssignment(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.checkFlightAssignmentforLyingList,
      request
    );
  }

  @TrackRestCallProgress()
  public checkContainerDestination(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.checkContainerDestinationforLyingList,
      request
    );
  }


  @TrackRestCallProgress()
  public checkForDifferentCarrierAssignment(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.checkForDifferentCarrierAssignment,
      request
    );
  }

  @TrackRestCallProgress()
  public bookShipmentInfo(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.bookShipmentInfo,
      request
    );
  }

  @TrackRestCallProgress()
  public freightOut(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.moveToFreightOut,
      request
    );
  }

  //flight complete begins here
  @TrackRestCallProgress()
  public searchFlightComplete(request: FlightCompleteSearch) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.searchFlightCompleteDetails,
      request
    );
  }
  @TrackRestCallProgress()
  public flightComplete(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.flightComplete,
      request
    );
  }
  @TrackRestCallProgress()
  public onLhSendFwb(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.flightCompleteSendLHMail,
      request
    );
  }
  @TrackRestCallProgress()
  public flightCompleteResendMessages(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.flightCompleteResendMessages,
      request
    );
  }
  @TrackRestCallProgress()
  public fetchResendMessageList(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      CARGO_MESSAGING_ENV.serviceBaseURL + CARGO_MESSAGING_ENV.flightCompleteResendmessageList,
      request
    );
  }

  @TrackRestCallProgress()
  public searchFlightList(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.searchFlightList,
      request
    );
  }

  @TrackRestCallProgress()
  public saveFlightList(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveFlightList,
      request
    );
  }
  @TrackRestCallProgress()
  public searchMyFlight(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.searchMyFlight,
      request
    );
  }

  @TrackRestCallProgress()
  public searchOsi(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.searchOsi,
      request
    );
  }
  @TrackRestCallProgress()
  public onDelete(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteFlight,
      request
    );
  }
  @TrackRestCallProgress()
  public savecn46(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.savecn46mailbag,
      request
    );
  }

  @TrackRestCallProgress()
  public updateLoadedWeight(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateLoadedWeight,
      request
    );
  }

  @TrackRestCallProgress()
  public getPiggyBackFlag(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getPiggyBackInfo,
      request
    );
  }

  @TrackRestCallProgress()
  public getLoadedDataByShipment(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getLoadedDataByShipment,
      request
    );
  }

  @TrackRestCallProgress()
  public onKESendPldMail(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.onKESendPldMail,
      request
    );
  }

  @TrackRestCallProgress()
  // public getFfmPreview(request: any) {
  //   return <Observable<any>>this.restService.post(
  //     CARGO_MESSAGING_ENV.serviceBaseURL + CARGO_MESSAGING_ENV.getFfmPreviewMessage,
  //     request
  //   );
  // }

  @TrackRestCallProgress()
  public saveUldList(request: DLS) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveUldList,
      request
    );
  }

  @TrackRestCallProgress()
  public updateuldlistonSave(request: DLS) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateuldlistonSave,
      request
    );
  }

  @TrackRestCallProgress()
  public searchUpdateDLSList(request: SearchUpdateDLS) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchUpdateDLSList,
      request
    );
  }

  public updateuldlistontab(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updateuldlistontab,
      request
    );
  }

  // Special Cargo //
  @TrackRestCallProgress()
  public validateFlight(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.validateFlight,
      request
    );
  }

  @TrackRestCallProgress()
  public specialCargoRequestSearch(request: SearchSpecialCargoShipmentForHO) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.specialCargoRequestSearch,
      request
    );
  }

  @TrackRestCallProgress()
  public specialCargoHandoverSearch(request: SearchSpecialCargoShipmentForHO) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.specialCargoHandoverSearch,
      request
    );
  }

  @TrackRestCallProgress()
  public specialCargoHandoverUserProfileFetch(request: SearchSpecialCargoShipmentForHO) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.specialCargoHandoverUserProfileFetch,
      request
    );
  }

  @TrackRestCallProgress()
  public saveSpecialCargoRequestList(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveSpecialCargoRequestList, request);
  }


  @TrackRestCallProgress()
  public deleteRequest(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteSpecialCargoRequest,
      request
    );
  }

  @TrackRestCallProgress()
  public deleteHandover(shipmentInventoryId: any) {
    console.log(JSON.stringify(shipmentInventoryId));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.deleteSpecialCargoHandover,
      shipmentInventoryId
    );
  }

  @TrackRestCallProgress()
  public saveSpecialCargoHandover(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveSpecialCargoHandover, request);
  }

  @TrackRestCallProgress()
  public calculatePropotionalWeightforHandover(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.calculatePropotionalWeightforHandover, request);
  }

  @TrackRestCallProgress()
  public fetchHOPhotoSetup(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchHOPhotoSetup, request);
  }

  @TrackRestCallProgress()
  public fetchMonitoringList(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchMonitoringList,
      request
    );
  }

  @TrackRestCallProgress()
  public updatePhotoForHandoverLoc(requestList: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.updatePhotoForHandoverLoc, requestList);
  }

  @TrackRestCallProgress()
  public fetchPhotoForDocId(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchPhotoForDocId,
      request
    );
  }
  // Special Cargo //


  //special cargo flight dashboard
  @TrackRestCallProgress()
  public getExportFlights(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
        WH_ENV.getSlaDashBoardTVExport, request);
  }


  @TrackRestCallProgress()
  public getLatestExportFlights(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (WH_ENV.serviceBaseURL +
        WH_ENV.getLatestDboardRecExport, request);
  }
  @TrackRestCallProgress()
  public handoverToDNATA(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EXPBU_ENV.serviceBaseURL +
        EXPBU_ENV.processDNATATransfer, request);
  }
  @TrackRestCallProgress()
  public sendFBR(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.sendFBR, request);
  }

  @TrackRestCallProgress()
  public searchUwsDetails(request: DLSFlight) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchSegForUWS,
      request
    );
  }

  @TrackRestCallProgress()
  public saveUwsDetails(request: DLS) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveSegForUWS,
      request
    );
  }
  @TrackRestCallProgress()
  public savelocations(request: OffloadShipment) {
    return <Observable<BaseResponse<OffloadShipment>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.savelocations,
      request
    );
  }

  @TrackRestCallProgress()
  public getlocationinfo(request: OffloadShipment) {
    return <Observable<BaseResponse<OffloadShipment>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getlocationinfo,
      request
    );
  }
  @TrackRestCallProgress()
  public searchWeightLoadStatement(request: WeightLoadStatement) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.fetchWlsDLSList,
      request
    );
  }
  @TrackRestCallProgress()
  public saveWeightLoadStatement(request: WeightLoadStmtFlight) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveWlsDLSList,
      request
    );
  }

  @TrackRestCallProgress()
  public finalizeOrUnfinalizeWeightLoadStatement(request: WeightLoadStmtFlight) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.finalizeOrUnfinalizeWls,
      request
    );
  }

  @TrackRestCallProgress()
  public getRequestDolliesBTInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getRequestDolliesBTInfo, request);
  }

  @TrackRestCallProgress()
  public saveRequestDolliesBTInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveRequestDolliesBTInfo, request);
  }

  @TrackRestCallProgress()
  public confirmRequestDolliesBTInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.confirmRequestDolliesBTInfo, request);
  }

  @TrackRestCallProgress()
  public sendNotification(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.sendNotification, request);
  }

  @TrackRestCallProgress()
  public saveOffloadRemarks(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveOffloadRemarks, request);
  }
  
  @TrackRestCallProgress()
  public saveManifestRMK(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      EXPBU_ENV.serviceBaseURL + EXPBU_ENV.saveManifestRMK,
      request
    );
  }
}
