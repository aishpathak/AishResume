import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request } from './../model/resp';
import { } from './';
import { Environment } from '../../environments/environment';
import {
  SearchShipment, InboundResponse,
  SearchEnquireValShipment, IncomingRequest, OutboundResponse, SearchInventory, ShipmentInventory, NotFoundShipment, ShipmentInInventory, ShipmentInventoryDetails, HandoverShipment
} from './../valManagement/val.sharemodel';
import { CheckInShipmentModel, SearchShipmentContext } from './val.checkin-model';
import { NgcCoreModule, BaseResponse, RestService, TrackRestCallProgress, BaseRequest } from 'ngc-framework';
import { VAL_ENV, CFG_ENV } from '../../environments/environment';
import { SearchOutboundShipment } from './val.sharemodel';

@Injectable()
export class ValSharedService {
  // fetchSearchListForCheckOut(request: any) {
  //   throw new Error("Method not implemented.");
  // }

  constructor(private restService: RestService) { }
  notFoundShipment: any;

  requestInventory: any;
  @TrackRestCallProgress()
  public save(request: IncomingRequest): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      VAL_ENV.serviceBaseURL + VAL_ENV.saveCaptureIncomingRequest, request);
  }

  @TrackRestCallProgress()
  public search(request: IncomingRequest): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      VAL_ENV.serviceBaseURL + VAL_ENV.searchCaptureIncomingRequest, request);
  }

  @TrackRestCallProgress()
  public searchResult(request: SearchShipment):
    Observable<BaseResponse<InboundResponse>> {
    return <Observable<BaseResponse<InboundResponse>>>
      this.restService.post
        (VAL_ENV.serviceBaseURL + VAL_ENV.searchInboundShipment, request);
  }

  // Serch list return
  @TrackRestCallProgress()
  public fetchSearchList(request: SearchEnquireValShipment):
    Observable<BaseResponse<IncomingRequest>> {
    return <Observable<BaseResponse<IncomingRequest>>>
      this.restService.post
        (VAL_ENV.serviceBaseURL + VAL_ENV.searchEnquireShipment, request);
  }

  @TrackRestCallProgress()
  public fetchSearchListForCheckOut(request: SearchEnquireValShipment):
    Observable<BaseResponse<IncomingRequest>> {
    return <Observable<BaseResponse<IncomingRequest>>>
      this.restService.post
        (VAL_ENV.serviceBaseURL + VAL_ENV.searchEnquireShipmentCheckout, request);
  }
  /**
   * Called when search button is clicked.
   * This fetches the requires shipment.
   * @param request
   * @returns Observable<BaseResponse<CheckInShipmentModel>>
   */
  @TrackRestCallProgress()
  public fetchCheckInShipment(request: SearchShipmentContext):
    Observable<BaseResponse<CheckInShipmentModel>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<CheckInShipmentModel>>>
      this.restService.post
        (VAL_ENV.serviceBaseURL + VAL_ENV.searchCheckInDiplomat, request);
  }
  /**
    * Called when save button is clicked.
    * This fetches the requires shipment.
    * @param request
    * @returns Observable<BaseResponse<CheckInShipmentModel>>
    */
  @TrackRestCallProgress()
  public saveCheckInShipment(request: CheckInShipmentModel):
    Observable<BaseResponse<CheckInShipmentModel>> {
    return <Observable<BaseResponse<CheckInShipmentModel>>>
      this.restService.post
        (VAL_ENV.serviceBaseURL + VAL_ENV.saveCheckInDiplomat, request);
  }
  @TrackRestCallProgress()
  public searchOutboundResult(request: SearchOutboundShipment):
    any {
    return <any>
      this.restService.post
        (VAL_ENV.serviceBaseURL + VAL_ENV.searchOutboundShipment, request);
  }

  @TrackRestCallProgress()
  public onDateSearch():
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (VAL_ENV.serviceBaseURL + VAL_ENV.saveCheckInShipment, new BaseRequest());
  }
  @TrackRestCallProgress()
  public onDateSearchInbound():
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (VAL_ENV.serviceBaseURL + VAL_ENV.fetchInboundFromDate, new BaseRequest());
  }
  @TrackRestCallProgress()
  public onDateSearchInventory():
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (VAL_ENV.serviceBaseURL + VAL_ENV.fetchInventoryFromDate, new BaseRequest());
  }
  public searchInventory(request: SearchInventory):
    Observable<BaseResponse<ShipmentInventory>> {
    return <Observable<BaseResponse<ShipmentInventory>>>
      this.restService.post(VAL_ENV.serviceBaseURL + VAL_ENV.searchinventory, request);
  }
  public handoverShipment(request: SearchInventory):
    Observable<BaseResponse<HandoverShipment>> {
    return <Observable<BaseResponse<HandoverShipment>>>
      this.restService.post(VAL_ENV.serviceBaseURL + VAL_ENV.handovershipment, request);
  }
  public searchDetailInventory(request: ShipmentInventory):
    Observable<BaseResponse<ShipmentInventoryDetails>> {
    return <Observable<BaseResponse<ShipmentInventoryDetails>>>
      this.restService.post(VAL_ENV.serviceBaseURL + VAL_ENV.searchdetailinventory, request);
  }

  public notFoundShipmnt(request: ShipmentInventoryDetails):
    Observable<BaseResponse<NotFoundShipment>> {
    return <Observable<BaseResponse<NotFoundShipment>>>
      this.restService.post(VAL_ENV.serviceBaseURL + VAL_ENV.notfoundshipmnt, request);
  }

  public closeDiscrepency(request: ShipmentInventory):
    Observable<BaseResponse<ShipmentInventory>> {
    return <Observable<BaseResponse<ShipmentInventory>>>
      this.restService.post(VAL_ENV.serviceBaseURL + VAL_ENV.closediscrepency, request);
  }
  public complete(request: ShipmentInInventory):
    Observable<BaseResponse<ShipmentInInventory>> {
    return <Observable<BaseResponse<ShipmentInInventory>>>
      this.restService.post(VAL_ENV.serviceBaseURL + VAL_ENV.complete, request);
  }
  public onPurgeRecord(request: NotFoundShipment):
    Observable<BaseResponse<NotFoundShipment>> {
    return <Observable<BaseResponse<NotFoundShipment>>>
      this.restService.post(VAL_ENV.serviceBaseURL + VAL_ENV.onpurgerecord, request);
  }
  public fetchSystemParam(request: any) {
    return <Observable<BaseResponse<any>>>
      this.restService.post(CFG_ENV.serviceBaseURL + VAL_ENV.fetchsystemparam, request);

  }
}
