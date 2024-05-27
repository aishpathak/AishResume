import { EXP_ENV, EXPBU_ENV, CARGO_MESSAGING_ENV, CARGOMESSAGING_ENV } from './../../../environments/environment';
import { Observable } from 'rxjs';
import { ThroughTransitWorkingAdviceModel, Message, TranshipmentHandlingSummaryRequest, GetOutgoingTransshipmentFlightsRequest, UldInformation, TranshipmentWorkingListModel, FinalizeAndUnfinalizeTranshipmentRequest, InboundFlightTranshipmentListRequest, InboundFlightTranshipmentList } from './transhipment.sharedmodel.ts';
import { TrackRestCallProgress, BaseResponse, RestService, BaseService } from 'ngc-framework';
import { Injectable } from '@angular/core';

@Injectable()
export class TranshipmentService extends BaseService {


  constructor(private restService: RestService) {
    super();
  }

  @TrackRestCallProgress()
  public getSearchTTWAApron(request: ThroughTransitWorkingAdviceModel):
    Observable<BaseResponse<ThroughTransitWorkingAdviceModel>> {
    return <Observable<BaseResponse<ThroughTransitWorkingAdviceModel>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.getSearchTTWAApron, request);
  }

  @TrackRestCallProgress()
  public getSendTTWAApron(request: ThroughTransitWorkingAdviceModel):
    Observable<BaseResponse<ThroughTransitWorkingAdviceModel>> {
    return <Observable<BaseResponse<ThroughTransitWorkingAdviceModel>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.getSendTTWAApron, request);
  }

  @TrackRestCallProgress()
  public getSendUpdateTTWAApron(request: ThroughTransitWorkingAdviceModel):
    Observable<BaseResponse<ThroughTransitWorkingAdviceModel>> {
    return <Observable<BaseResponse<ThroughTransitWorkingAdviceModel>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.getSendUpdateTTWAApron, request);
  }

  @TrackRestCallProgress()
  public getReSendTTWAApron(request: ThroughTransitWorkingAdviceModel):
    Observable<BaseResponse<ThroughTransitWorkingAdviceModel>> {
    return <Observable<BaseResponse<ThroughTransitWorkingAdviceModel>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.getReSendTTWAApron, request);
  }

  @TrackRestCallProgress()
  public getConfiguredAddressesForTTM():
    Observable<BaseResponse<ThroughTransitWorkingAdviceModel>> {
    return <Observable<BaseResponse<ThroughTransitWorkingAdviceModel>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.getConfiguredAddressesForTTM, null);
  }

  @TrackRestCallProgress()
  public getSendTTWAApronMessage(request: ThroughTransitWorkingAdviceModel):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.send, request);
  }

  @TrackRestCallProgress()
  public getSendUpdateTTWAApronMessage(request: ThroughTransitWorkingAdviceModel):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (CARGOMESSAGING_ENV.serviceBaseURL +
          CARGOMESSAGING_ENV.sendUpdate, request);
  }

  @TrackRestCallProgress()
  public getReSendTTWAApronMessage(request: ThroughTransitWorkingAdviceModel):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (CARGOMESSAGING_ENV.serviceBaseURL +
          CARGOMESSAGING_ENV.reSend, request);
  }

  @TrackRestCallProgress()
  public getListOfThroughTransitFlights(request: TranshipmentHandlingSummaryRequest):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.searchTranshipmentMonitoringSummary, request);
  }

  @TrackRestCallProgress()
  public getOutgoingFlightListDetails(request: GetOutgoingTransshipmentFlightsRequest):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.fetchInboundFlightListForOutboundFlights, request);
  }

  @TrackRestCallProgress()
  public getIncomingFlightListDetails(request: GetOutgoingTransshipmentFlightsRequest):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.fetchOutboundFlightListForInboundFlights, request);
  }

  @TrackRestCallProgress()
  public loadShipmentToFlights(request: TranshipmentWorkingListModel):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.loadShipmentToFlights, request);
  }

  @TrackRestCallProgress()
  public unloadShipmentToFlights(request: TranshipmentWorkingListModel):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.unloadShipmentToFlights, request);
  }

  @TrackRestCallProgress()
  public shipmentByfinalized(request: TranshipmentWorkingListModel):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.shipmentByfinalized, request);
  }

  @TrackRestCallProgress()
  public loadShipmentTranshipment(request: TranshipmentWorkingListModel):
    Observable<BaseResponse<TranshipmentWorkingListModel>> {
    return <Observable<BaseResponse<TranshipmentWorkingListModel>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.loadShipment, request);
  }

  @TrackRestCallProgress()
  public finalizeTransshipment(request: FinalizeAndUnfinalizeTranshipmentRequest):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.finalizeTransshipment, request);
  }
  @TrackRestCallProgress()
  public unfinalizeTransshipment(request: FinalizeAndUnfinalizeTranshipmentRequest):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.unfinalizeTransshipment, request);
  }
  @TrackRestCallProgress()
  public sendAdvice(request: any):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.sendAdviceTranshipmentWorkingList, request);
  }

  @TrackRestCallProgress()
  public getListOfShortTransitFlights(request: TranshipmentHandlingSummaryRequest):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.searchShortTransitSummary, request);
  }

  @TrackRestCallProgress()
  public getUldDetails(request: UldInformation):
    Observable<BaseResponse<UldInformation>> {
    return <Observable<BaseResponse<UldInformation>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.getUldDetails, request);
  }
  @TrackRestCallProgress()
  public getInboundFlightTranshipmentList(request: InboundFlightTranshipmentListRequest):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.searchInboundFlightTranshipment, request);
  }

  @TrackRestCallProgress()
  public saveInboundFlightTranshipmentList(request: InboundFlightTranshipmentList):
    Observable<BaseResponse<Message>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (EXPBU_ENV.serviceBaseURL +
          EXPBU_ENV.saveInboundFlightTranshipment, request);
  }


}