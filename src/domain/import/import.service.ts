import {
  ShipmentInfo,
  CargoPreAnnouncementGroup,
  CargoPreAnnouncementRequest,
  EccInboundResult,
  SearchInbound,
  ShipmentList,
  BreakdownWorkingListModel,
  MaintainFwb,
  MaintainFwbRequest,
  MaintainFwbResponse,
  FWBRequest,
  InboundBreakdownModel,
  InboundBreakdownShipmentModel,
  DocumentVerificationGroup,
  DocumentVerificationRequest,
  BreakDownWorkingListShipmentResult,
  ImpAwbNotificationInfo,
  AWBReleaseSearch,
  FetchRouting,
  SearchRegulation,
  Dgregulations,
  AwbPrintRequestList, AwbRoutingReqModel
} from "./import.shared";
import {
  BreakDownSummaryModel,
  BreakDownSummary,
  BreakDownSummaryUldModel,
  BreakDownSummaryTonnageHandledModel,
  ArrivalManifestFlight,
  RampCheckInModel,
  RampCheckInRequestClass
} from "./import.sharedmodel";
import { MaintainServiceDeleteRequest } from "./import.sharedmodel";

import {
  BaseService,
  RestService,
  BaseResponse,
  TrackRestCallProgress
} from "ngc-framework";
import { Injectable } from "@angular/core";
import {
  Environment,
  IMP_ENV,
  IMPDLV_ENV,
  SATSSGINTERFACE_ENV,
  WH_ENV
} from "../../environments/environment";
import { DomainEnvironement } from "../../environments/environment";
import { Observable } from "rxjs";
import {
  FlightRequest,
  FlightsResponse,
  Flight,
  AgentDeliverySummary,
  DeliveryShipmentList,
  RampCheckInFlight,
  RampCheckInQuery,
  RampCheckInUld,
  BulkUpdate,
  PiggybackUld,
  FlightDiscrepancyListRequest,
  FlightDiscrepancyListResponse,
  RequestImportMailManifest,
  ResponseMailManifest,
  RequestUpdateLocationMail,
  ImportDocumentRequest,
  CaptureImportDocumentData,
  CaptureImportDocumentSearchRequest,
  MailBreakdownData,
  MailBreakdownSearchResult,
  MailBreakdownSearchRequest,
  BreakDownHandlingRequest,
  DisplayCpmModel,
  inboundFlightMonitoringSerach,
  inboundFlightMonitoringModel,
  DamageSearchModel,
  DamageReportModel,
  IncomingFlightDateRange
} from "./import.sharedmodel";
import { VAL_ENV, CFG_ENV, CARGO_MESSAGING_ENV, CARGOMESSAGING_ENV } from "../../environments/environment";
/* for Eorder monitoring added AutoRefresh */
export const REFRESH_MS: number = 15000;
@Injectable()
export class ImportService extends BaseService {

  dataFromImportToMail: any;
  /**
   * Initialize
   *
   * @param restService Rest Service
   */
  constructor(private restService: RestService) {
    super();
  }
  /*----------------------AwB barcode print*------------------------*/
  @TrackRestCallProgress()
  public validateAWBNumber(request: ShipmentInfo) {
    return <Observable<BaseResponse<ShipmentInfo>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.verifyAWBNumber,
        request
      )
    );
  }

  public printAWBBarcode(request: ShipmentInfo) {
    return <Observable<BaseResponse<ShipmentInfo>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.printAWBBarcode,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public printMultiAWBBarcode(request) {
    return <Observable<BaseResponse<DocumentVerificationGroup>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.printMultiAwbBarcode,
        request
      )
    );
  }

  /*----------------------AwB barcode print end*------------------------*/
  @TrackRestCallProgress()
  public getPreannoucementTable(
    request: CargoPreAnnouncementRequest
  ): Observable<BaseResponse<CargoPreAnnouncementRequest>> {
    return <Observable<BaseResponse<CargoPreAnnouncementRequest>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.getCargoPreAnnouncement,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public saveUpdatePreannoucementTable(
    request: CargoPreAnnouncementGroup
  ): Observable<BaseResponse<CargoPreAnnouncementGroup>> {
    return <Observable<BaseResponse<CargoPreAnnouncementGroup>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.savaUpdateCargoPreAnnouncement,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public finalizeDamage(
    request: DamageSearchModel
  ): Observable<BaseResponse<DamageReportModel>> {
    return <Observable<BaseResponse<DamageReportModel>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.finalizeCargoDamage,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public deletePreannoucementTable(
    request: CargoPreAnnouncementGroup
  ): Observable<BaseResponse<CargoPreAnnouncementGroup>> {
    return <Observable<BaseResponse<CargoPreAnnouncementGroup>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.deleteCargoPreAnnouncement,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getIncomingFlights(
    request: FlightRequest
  ): Observable<BaseResponse<FlightsResponse>> {
    return <Observable<BaseResponse<FlightsResponse>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.searchIncomingFlights,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getIncomingFlightsConfigurationTimings(
    request: IncomingFlightDateRange
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.incomingFlightsConfigTime,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getIncomingFlightsTelexMessage(
    request: FlightRequest
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.incomingFlightTelexMessage,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getMyFlights(
    request: IncomingFlightDateRange
  ): Observable<BaseResponse<FlightsResponse[]>> {
    return <Observable<BaseResponse<FlightsResponse[]>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.searchMyFlights,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getDeliveryList(
    request: AgentDeliverySummary
  ): Observable<BaseResponse<AgentDeliverySummary>> {
    return <Observable<BaseResponse<AgentDeliverySummary>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getDeliveryList,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveDetails(
    request: AgentDeliverySummary
  ): Observable<BaseResponse<DeliveryShipmentList>> {
    return <Observable<BaseResponse<DeliveryShipmentList>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.saveHandOverDetails,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public updateBulkFlag(
    request: BulkUpdate
  ): Observable<BaseResponse<RampCheckInFlight>> {
    return <Observable<BaseResponse<RampCheckInFlight>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.updateBulk,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getTeams(
    request: AgentDeliverySummary
  ): Observable<BaseResponse<DeliveryShipmentList>> {
    return <Observable<BaseResponse<DeliveryShipmentList>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getTeams,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getEO(
    request: AgentDeliverySummary
  ): Observable<BaseResponse<DeliveryShipmentList>> {
    return <Observable<BaseResponse<DeliveryShipmentList>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getEO,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public saveAdditionalInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL +
        IMP_ENV.createULDAdditionalInfoArrivalManifest,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveULD(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.createULDArrivalManifest,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public mergeFFMShipments(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.mergeULDArrivalManifest,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveLooseCargo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.createULDArrivalManifest,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public DeleteULD(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.deleteULDArrivalManifest,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public fetchArrivalSearchDetails(
    request: any
  ): Observable<BaseResponse<ArrivalManifestFlight>> {
    return <Observable<BaseResponse<ArrivalManifestFlight>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.fetchArrivalManifestSearch,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public updateUldShipmentPriority(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.updateUldShipmentPriorty,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public updateUldShipmentPrioritySendMail(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.uldShipmentPriortySendMail,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public searchResult(
    request: SearchInbound
  ): Observable<BaseResponse<EccInboundResult>> {
    return <Observable<BaseResponse<EccInboundResult>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMPDLV_ENV.onSearchEccInbound,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveResult(
    request: EccInboundResult
  ): Observable<BaseResponse<EccInboundResult>> {
    return <Observable<BaseResponse<EccInboundResult>>>(
      this.restService.cleanAndPost(
        IMP_ENV.serviceImportURL + IMPDLV_ENV.onSaveEccInbound,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public savebyflight(
    request: ShipmentList
  ): Observable<BaseResponse<ShipmentList>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<ShipmentList>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMPDLV_ENV.onSaveByFlight,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public onDelete(
    request: ShipmentList
  ): Observable<BaseResponse<ShipmentList>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<ShipmentList>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMPDLV_ENV.onDelete,
        request
      )
    );
  }

  /* Breakdown Worklist Service*/
  @TrackRestCallProgress()
  public getBreakDownWorkingList(
    request: BreakdownWorkingListModel
  ): Observable<BaseResponse<BreakdownWorkingListModel>> {
    return <Observable<BaseResponse<BreakdownWorkingListModel>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.getBreakDownWorkingList,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public updateFlightDelayForShipment(
    request: BreakDownWorkingListShipmentResult
  ): Observable<BaseResponse<BreakdownWorkingListModel>> {
    return <Observable<BaseResponse<BreakdownWorkingListModel>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.updateFlightDelayForShipment,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public fetchMaintainFwbDetails(
    request: FWBRequest
  ): Observable<BaseResponse<MaintainFwb>> {
    return <Observable<BaseResponse<MaintainFwb>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.fetchFwbDetails,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public fetchMaintainFwbDetailsNonIata(
    request: FWBRequest
  ): Observable<BaseResponse<MaintainFwb>> {
    return <Observable<BaseResponse<MaintainFwb>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.fetchFwbDetailsNonIata,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public deleteMaintainFwbDetails(
    request: MaintainFwbRequest
  ): Observable<BaseResponse<MaintainFwbResponse>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<MaintainFwbResponse>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.deleteFwb,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveMaintainFwbDetails(
    request: MaintainFwbRequest
  ): Observable<BaseResponse<MaintainFwbResponse>> {
    return <Observable<BaseResponse<MaintainFwbResponse>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.saveFwbDetails,
        request
      )
    );
  }

  /**
   * Get all flight information with all ulds for ramp checkin process
   *
   * @param FlightRequest This parameter have flight key and flight date
   *
   */
  @TrackRestCallProgress()
  public getIRampCheckInData(
    request: RampCheckInQuery
  ): Observable<BaseResponse<RampCheckInFlight>> {
    return <Observable<BaseResponse<RampCheckInFlight>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.rampCheckInSearch,
        request
      )
    );
  }

  /**
   * Get all flight information with all ulds for ramp checkin process
   *
   * @param RampCheckInUld This parameter have flight key and flight date
   *
   */
  @TrackRestCallProgress()
  public createRampCheckInUld(
    request: RampCheckInRequestClass
  ): Observable<BaseResponse<RampCheckInRequestClass>> {
    return <Observable<BaseResponse<RampCheckInRequestClass>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.rampCheckInCreate,
        request
      )
    );
  }

  /**
   * Get all flight information with all ulds for ramp checkin process
   *
   * @param RampCheckInUld This parameter have flight key and flight date
   *
   */
  @TrackRestCallProgress()
  public assignDriverToUld(
    request: any
  ): Observable<BaseResponse<RampCheckInUld>> {
    return <Observable<BaseResponse<RampCheckInUld>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.rampCheckInAddDriver,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public saveUldTemperatureLog(
    request: any
  ): Observable<BaseResponse<RampCheckInUld>> {
    return <Observable<BaseResponse<RampCheckInUld>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.saveUldTemperatureLog,
        request
      )
    );
  }

  /**
   * Get all flight information with all ulds for ramp checkin process
   *
   * @param RampCheckInUld This parameter have flight key and flight date
   *
   */
  @TrackRestCallProgress()
  public rampCheckInUpdate(
    request: any
  ): Observable<BaseResponse<RampCheckInModel>> {
    return <Observable<BaseResponse<RampCheckInModel>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.rampCheckInUpdate,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public rampUnCheckUlds(
    request: any
  ): Observable<BaseResponse<RampCheckInModel>> {
    return <Observable<BaseResponse<RampCheckInModel>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.rampUnCheckInUlds,
        request
      )
    );
  }

  /**
   * Get all flight information with all ulds for ramp checkin process
   *
   * @param RampCheckInUld This parameter have flight key and flight date
   *
   */
  @TrackRestCallProgress()
  public rampCheckInDelete(
    request: any
  ): Observable<BaseResponse<RampCheckInModel>> {
    return <Observable<BaseResponse<RampCheckInModel>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.rampCheckInDelete,
        request
      )
    );
  }

  /**
   * Get all flight information with all ulds for ramp checkin process
   *
   * @param RampCheckInUld This parameter have flight key and flight date
   *
   */
  @TrackRestCallProgress()
  public rampCheckIn(request: any): Observable<BaseResponse<RampCheckInModel>> {
    return <Observable<BaseResponse<RampCheckInModel>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.rampCheckIn,
        request
      )
    );
  }
  /**
   * Get all flight information with all ulds for ramp checkin process
   * @param RampCheckInUld This parameter have flight key and flight date
   *
   */
  @TrackRestCallProgress()
  public rampCheckInReopen(
    request: any
  ): Observable<BaseResponse<RampCheckInModel>> {
    return <Observable<BaseResponse<RampCheckInModel>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.rampCheckInReopen,
        request
      )
    );
  }
  /**
   * Get all flight information with all ulds for ramp checkin process
   *
   * @param RampCheckInUld This parameter have flight key and flight date
   *
   */
  @TrackRestCallProgress()
  public getPiggyback(request: any): Observable<BaseResponse<PiggybackUld[]>> {
    return <Observable<BaseResponse<PiggybackUld[]>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getPiggyback,
        request
      )
    );
  }

  /**
   * Get all flight information with all ulds for ramp checkin process
   *
   * @param RampCheckInUld This parameter have flight key and flight date
   *
   */
  @TrackRestCallProgress()
  public updatePiggyback(
    request: any
  ): Observable<BaseResponse<PiggybackUld[]>> {
    return <Observable<BaseResponse<PiggybackUld[]>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.updatePiggyback,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public inboundRampSendTelex(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<any>>this.restService.post(
      CARGOMESSAGING_ENV.serviceBaseURL + CARGOMESSAGING_ENV.sendTelex,
      request
    );
  }


  @TrackRestCallProgress()
  public getFlightDiscrepancyList(
    request: FlightDiscrepancyListRequest
  ): Observable<BaseResponse<FlightDiscrepancyListResponse>> {
    console.log(request);
    return <Observable<BaseResponse<FlightDiscrepancyListResponse>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.onSearchDiscrepancyList,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getFDLMessageDefination(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<any>>this.restService.post(
      CARGO_MESSAGING_ENV.serviceBaseURL + CARGO_MESSAGING_ENV.flightDiscriapancySendAdvce,
      request
    );
  }

  /**
   * Get all manifest related to mail
   *
   * @param will have flight key and flight date
   *
   */
  @TrackRestCallProgress()
  public searchImportMailManifest(
    request: RequestImportMailManifest
  ): Observable<BaseResponse<ResponseMailManifest>> {
    return <Observable<BaseResponse<ResponseMailManifest>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.onSearchImportManifest,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public transfer(
    request: RequestImportMailManifest
  ): Observable<BaseResponse<ResponseMailManifest>> {
    return <Observable<BaseResponse<ResponseMailManifest>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.transferToCN46,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public transferToServiceReport(
    request: RequestImportMailManifest
  ): Observable<BaseResponse<ResponseMailManifest>> {
    return <Observable<BaseResponse<ResponseMailManifest>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.transferToServiceReport,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public documentComplete(
    request: RequestImportMailManifest
  ): Observable<BaseResponse<ResponseMailManifest>> {
    return <Observable<BaseResponse<ResponseMailManifest>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.documentCompleteForMail,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public breakDownComplete(
    request: RequestImportMailManifest
  ): Observable<BaseResponse<ResponseMailManifest>> {
    return <Observable<BaseResponse<ResponseMailManifest>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.breakDownCompleteForMail,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public checkContainerDestination(
    request: RequestUpdateLocationMail
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.checkContainerDestination,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public updateLocation(
    request: RequestUpdateLocationMail
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.updateLocation,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getImportDocument(
    request: CaptureImportDocumentSearchRequest
  ): Observable<BaseResponse<CaptureImportDocumentData>> {
    return <Observable<BaseResponse<CaptureImportDocumentData>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.fetchImportDocument,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public update(request: any): Observable<BaseResponse<any[]>> {
    return <Observable<BaseResponse<any[]>>>(
      this.restService.post(IMP_ENV.serviceBaseURL + IMP_ENV.update, request)
    );
  }

  @TrackRestCallProgress()
  public validate(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(IMP_ENV.serviceBaseURL + IMP_ENV.validate, request)
    );
  }

  @TrackRestCallProgress()
  public getYears(request: any): Observable<BaseResponse<any[]>> {
    return <Observable<BaseResponse<any[]>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getDispatchYears,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public insertImportDocument(
    request: ImportDocumentRequest
  ): Observable<BaseResponse<CaptureImportDocumentData>> {
    return <Observable<BaseResponse<CaptureImportDocumentData>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.insertImportDocument,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getInboundBreakDownData(
    request: InboundBreakdownModel
  ): Observable<BaseResponse<InboundBreakdownModel>> {
    return <Observable<BaseResponse<InboundBreakdownModel>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.getInboundBreakdownList,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getShipmentHandlingInfo(
    request: InboundBreakdownShipmentModel
  ): Observable<BaseResponse<InboundBreakdownShipmentModel>> {
    return <Observable<BaseResponse<InboundBreakdownShipmentModel>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.getShipmentHandlingInfo,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public createData(
    request: InboundBreakdownModel
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.createBreakDownData,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public createListData(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.createBreakDownListData, request
      )
    );
  }
  @TrackRestCallProgress()
  public getMaintainHouseBDData(
    request: any
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.getMaintainHouseBreakDownData,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public createMaintainHouseBDData(
    request: any
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.createMaintainHouseBreakDownData,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public offLoadShipmentDocumentVerifyication(
    request: DocumentVerificationGroup
  ): Observable<BaseResponse<DocumentVerificationGroup>> {
    return <Observable<BaseResponse<DocumentVerificationGroup>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.offLoadDocumentVerification,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public onHoldShipments(
    request: DocumentVerificationGroup
  ): Observable<BaseResponse<DocumentVerificationGroup>> {
    return <Observable<BaseResponse<DocumentVerificationGroup>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.onHoldDocumentVerificationShipments,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public updateShipmentRemarks(
    request: DocumentVerificationGroup
  ): Observable<BaseResponse<DocumentVerificationGroup>> {
    return <Observable<BaseResponse<DocumentVerificationGroup>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.updateShipmentRemarks,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public updatFlightDelayforShipment(
    request: DocumentVerificationGroup
  ): Observable<BaseResponse<DocumentVerificationGroup>> {
    return <Observable<BaseResponse<DocumentVerificationGroup>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.updatFlightDelayforShipment,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public reopenDocuementVerification(
    request: DocumentVerificationRequest
  ): Observable<BaseResponse<DocumentVerificationRequest>> {
    return <Observable<BaseResponse<DocumentVerificationRequest>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.reOpenDocumentComplete,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getDocumentVerificationTable(
    request: DocumentVerificationRequest
  ): Observable<BaseResponse<DocumentVerificationRequest>> {
    return <Observable<BaseResponse<DocumentVerificationRequest>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.getDocumentVerification,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public sendEmailSpecialCargoHandlingForm(
    request: DocumentVerificationRequest
  ): Observable<BaseResponse<DocumentVerificationRequest>> {
    return <Observable<BaseResponse<DocumentVerificationRequest>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.specialcargohandlingform,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public updateBreakdownComplete(
    request: any
  ): Observable<BaseResponse<BreakdownWorkingListModel>> {
    return <Observable<BaseResponse<BreakdownWorkingListModel>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.updateBreakDownComplete,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public resendSegregationReportEvent(
    request: any
  ): Observable<BaseResponse<BreakdownWorkingListModel>> {
    return <Observable<BaseResponse<BreakdownWorkingListModel>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.resendSegregationReport,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public onSendLHRcfNfdReport(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post(
      IMP_ENV.serviceBaseURL + IMP_ENV.sendLhRcfNfdReport,
      request
    );
  }
  @TrackRestCallProgress()
  public getAllUndeliveredShipment(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getAllUndeliveredShipment,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public updateReopenBreakdownComplete(
    request: any
  ): Observable<BaseResponse<BreakdownWorkingListModel>> {
    return <Observable<BaseResponse<BreakdownWorkingListModel>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.updateReopenBreakDownComplete,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveUpdateDocumentVerification(
    request: DocumentVerificationGroup
  ): Observable<BaseResponse<DocumentVerificationGroup>> {
    return <Observable<BaseResponse<DocumentVerificationGroup>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.saveUpdateDocumentVerification,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public documentCompleteTable(
    request: DocumentVerificationGroup
  ): Observable<BaseResponse<DocumentVerificationGroup>> {
    return <Observable<BaseResponse<DocumentVerificationGroup>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.documentComplete,
        request
      )
    );
  }

  /**
   * Get all breakdown
   *
   * @param will have flightId
   *
   */

  @TrackRestCallProgress()
  public searchBreakdown(
    request: MailBreakdownData
  ): Observable<BaseResponse<MailBreakdownSearchResult>> {
    return <Observable<BaseResponse<MailBreakdownSearchResult>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getMailBreakdownworkinglist,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public checkContainerDestinationForBreakDown(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.checkContainerDestinationForBreakDown,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public insertMailBreakdown(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.insertMailBreakdown,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public splitMailBagNumber(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.splitmailbagnumber,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public checkMailbag(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.checkmailbag,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public searchMailBreakdown(
    request
  ): Observable<BaseResponse<MailBreakdownSearchResult>> {
    return <Observable<BaseResponse<MailBreakdownSearchResult>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getMailBreakdown,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public isfinalzeAndunFinalize(
    request: CargoPreAnnouncementRequest
  ): Observable<BaseResponse<CargoPreAnnouncementRequest>> {
    return <Observable<BaseResponse<CargoPreAnnouncementRequest>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.finalizeUnfinalize,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getbreakDownList(
    request: BreakDownHandlingRequest
  ): Observable<BaseResponse<MailBreakdownSearchResult>> {
    return <Observable<BaseResponse<MailBreakdownSearchResult>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getbreakDownList,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveUpdateBreakdownHandling(
    request: any
  ): Observable<BaseResponse<MailBreakdownSearchResult>> {
    return <Observable<BaseResponse<MailBreakdownSearchResult>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.insertBreakDownHandling,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public deleteBreakdownHandling(
    request: any
  ): Observable<BaseResponse<MailBreakdownSearchResult>> {
    return <Observable<BaseResponse<MailBreakdownSearchResult>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.deleteBreakDownHandling,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getAwbNotificationInfo(
    request: ImpAwbNotificationInfo
  ): Observable<BaseResponse<ImpAwbNotificationInfo>> {
    return <Observable<BaseResponse<ImpAwbNotificationInfo>>>(
      this.restService.get(
        IMP_ENV.serviceImportURL + IMPDLV_ENV.getAwbNotificationInfo,
        request
      )
    );
  }

  //////////////////// ISSUE DISPLAY PO AND DO ///////////////////////

  @TrackRestCallProgress()
  public onSaveIssuePo(request): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.saveShipmentInfo,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public onSaveMultipleIssuePo(request): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.saveMultipleShipmentInfo,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public onSaveIssueSRFPo(request): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.saveIsseSRF,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getShipmentData(request): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getShipmentInf,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getShipmemtInfo(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getShipmentInfo,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getDisplayPoList(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getDisplayPo,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getDeliveryDo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getDeliveryDo,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getDeliveryInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getDeliveryInfo,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public onSaveIssueDo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.onSaveIssueDo,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public checkForBlackListCustomer(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.checkForBlackListCustomer,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public validateBlackListCustomer(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.validateBlackListCustomer,
        request
      )
    );
  }


  @TrackRestCallProgress()
  public issueGroupDo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getIssueGroupDo,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public documenthandover(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getDocumentHandOver,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public flightpouchhandle(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getFlightPouchHandle,
        request
      )
    );
  }


  @TrackRestCallProgress()
  public exportflightpouchhandle(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getExportFlightPouchHandle,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public createMultiShipment(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.createMultiShipmentInfo,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public cancelDelivery(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.cancelDelivery,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public cancelPostSrf(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.cancelPostSrf,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public extendIssueSrf(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.extendIssueSrf,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getOnSearch(
    request: DisplayCpmModel
  ): Observable<BaseResponse<DisplayCpmModel>> {
    return <Observable<BaseResponse<DisplayCpmModel>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getDisplayCpmModel,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public forceComplete(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.forceComplete,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public cancelDeliveryRequest(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.cancelDeliveryRequest,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public interrupt(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.interrupt,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getTracingList(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getTracingList,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getPoMonitoring(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getPoMonitoring,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getShipmentEsrfApproval(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getShipmentEsrfApproval,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getEsrfApproveStatus(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getEsrfApproveStatus,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getEsrfApprovePaymentStatus(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getEsrfApprovelPaymentStatus,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public createGroupOfPORequest(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getEsrfApprovelPaymentStatus,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getEsrfRejectedStatus(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getEsrfRejectedStatus,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getSrfMonitoring(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getSrfMonitoring,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public changePriority(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.changePriority,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public cancelWorkOrder(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.cancelWorkOrder,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public resume(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.resume,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getAllDisplayffmList(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.getAllDisplayffmList,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public updateFFMStatus(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.updateFFMstatus,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public fetchEquipment(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.fetchEquipment,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public searchDiscrepancy(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.fetchDiscrepancy,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public addDiscrepancy(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.addDiscrepancy,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public finalizeDiscrepancy(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.finalizeDiscrepancy,
        request
      )
    );
  }



  @TrackRestCallProgress()
  public getAwbdiscrepancyshipdetails(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.getshipdetails,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public finalizeMailDiscrepancy(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.finalizeMailDiscrepancy,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getOnSearchInboundFlightMonitoring(
    request: inboundFlightMonitoringSerach
  ): Observable<BaseResponse<inboundFlightMonitoringSerach>> {
    return <Observable<BaseResponse<inboundFlightMonitoringSerach>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getInboundFlightMonitoringSerach,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getAwbReleaseForms(
    request: AWBReleaseSearch
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getAwbRelasefromList,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveOrupdateRleaseForm(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.saveOrupdateAwbReleaseFormList,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public awbRleaseForms(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.awbReleaseFormList,
        request
      )
    );
  }

  public fetchSystemParam(request: any) {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        CFG_ENV.serviceBaseURL + VAL_ENV.fetchsystemparam,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getMultiShipment(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getMultiShipmentInfo,
        request
      )
    );
  }


  @TrackRestCallProgress()
  public createGroupShipment(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.createGroupShipmentInfo,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveDocHandOverRemark(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.saveDocHandOverRemarkInfo,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public saveDocInOutTime(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.saveDocHandoverInOutTimeInfo,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveFlightConfirmPouchHandle(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.saveConfirmPouchPickupInfo,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveFlightConfirmPouchDeliverHandle(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.saveConfirmPouchDeliverInfo,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public saveFlightConfirmPouchReceivedHandle(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.saveConfirmPouchReceiveInfo,
        request
      )
    );
  }


  @TrackRestCallProgress()
  public saveFlightCancelPouchHandle(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.saveCancelPouchPickupInfo,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveFlightCancelPouchDeliverHandle(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.saveCancelPouchDeliveryInfo,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public saveFlightCancelPouchReceivedHandle(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.saveCancelPouchReceivedInfo,
        request
      )
    );
  }



  @TrackRestCallProgress()
  public fetchBreakDownSummary(
    request: any
  ): Observable<BaseResponse<BreakDownSummaryModel>> {
    return <Observable<BaseResponse<BreakDownSummaryModel>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.getBreakDownSummary,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveBreakdownSummary(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.createBreakDownSummary,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public fetchTransferManifestDetails(
    request: any
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.fetchTransferManifestDetails,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public validateIcOrAirportPass(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.validateIcNumber,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveTransferManifestDetails(
    request: any
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.saveTransferManifestDetails,
        request
      )
    );
  }

  public deleteServiceProvider(request): Observable<BaseResponse<any>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.deleteServiceProviderList,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getOnSearchDamage(
    request: DamageSearchModel
  ): Observable<BaseResponse<DamageReportModel>> {
    return <Observable<BaseResponse<DamageReportModel>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getDamageReportModel,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public saveServiceList(request: any): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.saveServiceList,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getServiceProviderList(request: any): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getServiceProviderList,
        request
      )
    );
  }
  public editServiceDetails(request): Observable<BaseResponse<any>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.editServiceProviderList,
        request
      )
    );
  }
  public updateServiceList(request): Observable<BaseResponse<any>> {
    // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.updateServiceProviderList,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public fetchDelayStatus(
    request: any
  ): Observable<BaseResponse<Array<BreakDownSummaryModel>>> {
    return <Observable<BaseResponse<Array<BreakDownSummaryModel>>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.getDelayStatus,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public closeFlight(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.closeFlight,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public unCloseFlt(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.unCloseFlt,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveAddition(
    request: DamageSearchModel
  ): Observable<BaseResponse<DamageReportModel>> {
    return <Observable<BaseResponse<DamageReportModel>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.saveAdditionDamageReportModel,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public fetchCargoDamageReportList(
    request: DamageSearchModel
  ): Observable<BaseResponse<DamageReportModel>> {
    return <Observable<BaseResponse<DamageReportModel>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getCargoDamageList,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public updateFeddBack(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.updateFeedBack,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getAwbNotificationDetails(
    request: any
  ): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getAwbNotificationDetails,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public sendAwbNotificationDetails(
    request: any
  ): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.sendAwbNotificationDetails,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public checkCarrierCodeGroup(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.checkCarrierGroupcode,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public checkValidFlight(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.checkValidFlight,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public validateAirportPass(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.validateAirportPass,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public fetchRouteDetails(
    request: AwbRoutingReqModel
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.fetchRoutingDeatils,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public SearchSystemParam(request: any) {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        CFG_ENV.serviceBaseURL + IMPDLV_ENV.fetchSysParam,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public validatePOAirportPass(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.validatePOAirportPass,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public searchFlight(request: ShipmentList) {
    return <Observable<BaseResponse<ShipmentList>>>(
      this.restService.post(
        CFG_ENV.serviceBaseURL + IMPDLV_ENV.onSearchFlight,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public sendEmail(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(IMP_ENV.serviceBaseURL + IMP_ENV.sendEmail, request)
    );
  }

  @TrackRestCallProgress()
  public fetchRoutingInformation(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.fetchRouting,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public isFlightExist(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.isFlightExist,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public updateBreakBulkIndicator(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.updateBreakBulkIndicator,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public fetchSystemParamECC(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        CFG_ENV.serviceBaseURL + IMP_ENV.eccfetchSystemParam,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getDgRegulationsDetails(
    req: SearchRegulation
  ): Observable<BaseResponse<Dgregulations>> {
    return <Observable<BaseResponse<Dgregulations>>>this.restService.post(
      // (EXPBU_ENV.serviceBaseURL + EXPBU_ENV.getDgdDetails, req);
      IMP_ENV.serviceBaseURL + IMP_ENV.getRegulationDetails,
      req
    );
  }

  @TrackRestCallProgress()
  public saveDGDDetails(request) {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.saveDGDDetails,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public deleteDgDecDetails(req) {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.deleteDgDecDetails,
        req
      )
    );
  }
  @TrackRestCallProgress()
  public getDGDDetails(request) {
    console.log("req", request);
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getDGDDetailsByAwbNumber,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getOverPackSequenceNumber(request) {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(IMP_ENV.serviceBaseURL + IMP_ENV.getSeqNo, request)
    );
  }

  @TrackRestCallProgress()
  public getICSLocationByShipmentLocation(request) {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        SATSSGINTERFACE_ENV.serviceBaseURL +
        SATSSGINTERFACE_ENV.fetchICSLocation,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public printPO(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.printPO,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public printDO(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.printDO,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public validateIANumber(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.validateIANumber,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public validateDOIANumber(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.validateDOIANumber,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getEliDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (IMP_ENV.serviceBaseURL + IMP_ENV.getDGDEliElmDetails, request);
  }

  @TrackRestCallProgress()
  public saveDGDEliElmDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (IMP_ENV.serviceBaseURL + IMP_ENV.saveDGDEliElmDetails, request);
  }


  @TrackRestCallProgress()
  public deleteDGDEliElmDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (IMP_ENV.serviceBaseURL + IMP_ENV.deleteDGDEliElmDetails, request);
  }
  @TrackRestCallProgress()
  public getRemarkOnPiAndShc(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (IMP_ENV.serviceBaseURL + IMP_ENV.getEliElmRemark, request);
  }

  @TrackRestCallProgress()
  public sendEmailInward(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.sendEmailIn,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public validateAgentIcNumber(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.validateAgentIcNumber,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public checkPaymentStatus(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.checkPaymentStatus,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public checkPaymentStatusIssueSrf(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.checkPaymentStatusIssueSrf,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public cancelPaymentRequest(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.cancelPaymentRequest,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public unCollectedFreightout(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.sendDateForUncollectedFreightout,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public unCollectedFreightoutreport(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.generateUncollectedFreightoutNotification,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public resendAWBNotification(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.resendAWBNotification,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getHAWBInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.getHAWBInfo,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public customShipmentInspectionFetch(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.customShipmentInspectionFetch,
        request
      )

    );
  }

  @TrackRestCallProgress()
  public confirmUldFetch(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.confirmUldFetch,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getFlightinfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getFlightinfo,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public closeFlt(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.closeFlt,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public validateStaffId(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.validateStaffId,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public updateConfirmUld(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.updateUld,
        request
      )

    );
  }

  /*   @TrackRestCallProgress()
    public MaintainEicdFetch(request: any): Observable<BaseResponse<any>> {
      return <Observable<BaseResponse<any>>>(
        this.restService.post(
          IMP_ENV.serviceBaseURL + IMP_ENV.maintainEicFetch,
          request
        )
  
      );
    } */

  /*   @TrackRestCallProgress()
    public DismantleUld(request: any): Observable<BaseResponse<any>> {
      return <Observable<BaseResponse<any>>>(
        this.restService.post(
          IMP_ENV.serviceBaseURL + IMP_ENV.DismantleUld,
          request
        )
      );
    } */
  /* 
    @TrackRestCallProgress()
    public addUldMaintainEic(request: any): Observable<BaseResponse<any>> {
      return <Observable<BaseResponse<any>>>(
        this.restService.post(
          IMP_ENV.serviceBaseURL + IMP_ENV.addUldMaintainEic,
          request
        )
      );
    } */


  /*  @TrackRestCallProgress()
   public SaveMaintainEic(request: any): Observable<BaseResponse<any>> {
     return <Observable<BaseResponse<any>>>(
       this.restService.post(
         IMP_ENV.serviceBaseURL + IMP_ENV.saveMaintainEic,
         request
       )
     );
   } */

  @TrackRestCallProgress()
  public getCustomsImporShipmentList(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getCustomsImportShipmentList,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getCustomExaminationInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getCustomExaminationInfo,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public onSaveCustomOrder(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.onSaveCustomOrder,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public fetchCustomImportShpManualReq(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.fetchCustomImportShpManualReq,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public customsImportShipmentManualStatusUpdate(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.customsImportShipmentManualStatusUpdate,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public onManualUpdateCustomImportShipment(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.onManualUpdateCustomImportShipment,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getVctInformationList(request: any): Observable<BaseResponse<any>> {
    console.log(request);
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.vctInformationList,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public saveVctInformationList(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.savevctInformationList,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public getEcanStatusEnquiryStatus(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.getEcanStatusEnquiry,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public onSendEcan(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.onSendEcan,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getmaintaincehouse(request: any): Observable<BaseResponse<any>> {
    console.log(request);
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.onsearchdiscrepancyHAWB,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getFlightDiscrepancy(request: any): Observable<BaseResponse<any>> {
    console.log(request);
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.onsearchFlightDiscrepancy,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public fetchRHOPriority(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.fetchRHOPriority,
        request
      )

    );
  }

  @TrackRestCallProgress()
  public updateRHOPriority(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.updateRHOPriority,
        request
      )

    );
  }

  @TrackRestCallProgress()
  public fetchSpecialHandlingAutoSelect(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.fetchSpecialHandlingAutoSelect,
        request
      )

    );
  }

  @TrackRestCallProgress()
  public updateSpecialHandlingAutoSelect(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.updateSpecialHandlingAutoSelect,
        request
      )

    );
  }


  @TrackRestCallProgress()
  public fetchSpecialCargoHandling(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.fetchSpecialCargoHandling,
        request
      )

    );
  }

  @TrackRestCallProgress()
  public updateSpecialCargoHandling(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.updateSpecialCargoHandling,
        request
      )

    );
  }

  @TrackRestCallProgress()
  public fetchShipmentPriorityGroupEmail(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.fetchShipmentPriorityGroupEmail,
        request
      )

    );
  }

  @TrackRestCallProgress()
  public updateShipmentPriorityGroupEmail(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.updateShipmentPriorityGroupEmail,
        request
      )

    );
  }

  @TrackRestCallProgress()
  public fetchScheduleColectionList(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.fetchScheduleCollectionList,
        request
      )

    );
  }
  @TrackRestCallProgress()
  public generateSchCollectionNo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.generateSchCollNo,
        request
      )

    );
  }

  @TrackRestCallProgress()
  public fetchmaintainScheduleCollection(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.onSearchMaintainScheduleCollection,
        request
      )

    );
  }

  @TrackRestCallProgress()
  public saveMaintainSchedule(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.onSaveMaintainScheduleCollection,
        request
      )

    );
  }

  @TrackRestCallProgress()
  public deleteMaintainSchedule(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.onDeleteMaintainScheduleCollection,
        request
      )

    );
  }

  @TrackRestCallProgress()
  public fetchCaptureTimeStamp(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.onSearchCaptureTimeStamp,
        request
      )

    );
  }

  @TrackRestCallProgress()
  public updateCaptureTime(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.onupdateCaptureTime,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public fetchArrivalCargoCollectionList(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.onFetchArrivalCargoCollectionList,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public flightEFormRequest(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceImportURL + IMP_ENV.flightEFormRequestData, request
      )
    );
  }

  @TrackRestCallProgress()
  public saveArrivalCargoCollectionList(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMP_ENV.serviceBaseURL + IMP_ENV.onSaveArrivalCargoCollectionList,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public fetchFlightDetails(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.fetchSectorLocationsByType, request);
  }

  @TrackRestCallProgress()
  public getArivalCargoCollection(
    request: any
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.getArivalCargoCollection,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public saveUpdateArivalCargoCollection(
    request: any
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.saveUpdateArivalCargoCollection,
        request
      )
    );
  }
  @TrackRestCallProgress()
  public sendMailForArivalCargoCollection(
    request: any
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        IMPDLV_ENV.serviceBaseURL + IMPDLV_ENV.sendMailForArivalCargoCollection,
        request
      )
    );
  }

  // E ORDER SERVICE CALLS STARTS HERE
  @TrackRestCallProgress()
  public getInfoByProcessType(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.getInfoByProcessType, request)
    );
  }

  @TrackRestCallProgress()
  public create(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.create, request)
    );
  }

  // @TrackRestCallProgress()
  // public summary(request: any): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>(
  //     this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.summary, request)
  //   );
  // }

  // @TrackRestCallProgress()
  // public acknowledge(request: any): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>(
  //     this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.acknowledge, request)
  //   );
  // }

  // @TrackRestCallProgress()
  // public cancel(request: any): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>(
  //     this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.cancel, request)
  //   );
  // }

  // @TrackRestCallProgress()
  // public completed(request: any): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>(
  //     this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.completed, request)
  //   );
  // }
  // @TrackRestCallProgress()
  // public priority(request: any): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>(
  //     this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.priority, request)
  //   );
  // }
  // E ORDER SERVICE CALLS ENDS HERE 
}


