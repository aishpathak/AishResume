
import { BaseResponse, RestService, BaseService, BaseRequest, TrackRestCallProgress } from 'ngc-framework';
import { Observable } from 'rxjs';
import { Request } from './../../model/resp';
import { Injectable } from '@angular/core';

import {
  FlightSearchQuery, ShipmentData, Advice, Worksheet, EccExportAwbDetails, DeleteShipmentData,
  ShipmentDataNoFlight
} from './ecc.sharedmodel';
// EXP_ENV/Configuration
import { EXP_ENV, AWB_ENV } from '../../../environments/environment';
@Injectable()
export class EccService {

  constructor(private restService: RestService) { }

  @TrackRestCallProgress()
  public getShipments(request: FlightSearchQuery): Observable<BaseResponse<ShipmentData[]>> {
    return <Observable<BaseResponse<ShipmentData[]>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.getShipments,
      request
    );
  }

  // api/ecc/planner-list-without-flight
  @TrackRestCallProgress()
  public getShipmentsWithoutFlight(request: FlightSearchQuery): Observable<BaseResponse<ShipmentData[]>> {
    return <Observable<BaseResponse<ShipmentData[]>>>this.restService.post(
      EXP_ENV.serviceBaseURL + 'expaccpt/api/ecc/planner-list-without-flight',
      request
    );
  }

  // updateAdvice: 'expaccpt/api/ecc/advice',
  @TrackRestCallProgress()
  public updateAdvice(request: Advice): Observable<BaseResponse<Advice>> {
    return <Observable<BaseResponse<Advice>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.updateAdvice,
      request
    );
  }

  // updateShipment: 'expaccpt/api/ecc/shipment',
  @TrackRestCallProgress()
  public updateShipment(request: ShipmentData): Observable<BaseResponse<ShipmentData>> {
    return <Observable<BaseResponse<ShipmentData>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.updateShipment,
      request
    );
  }

  // markAsNoShow: 'expaccpt/api/ecc/noshow',
  @TrackRestCallProgress()
  public markAsNoShow(request: any): Observable<BaseResponse<ShipmentData[]>> {
    return <Observable<BaseResponse<ShipmentData[]>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.markAsNoShow,
      request
    );
  }

  // updateShipmentStatus: 'expaccpt/api/ecc/update-status',
  @TrackRestCallProgress()
  public updateShipmentStatus(request: any): Observable<BaseResponse<ShipmentData[]>> {
    return <Observable<BaseResponse<ShipmentData[]>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.updateShipmentStatus,
      request
    );
  }
  // updateShipmentStatus: 'expaccpt/api/ecc/detailer',
  @TrackRestCallProgress()
  public getDetailerWorksheet(request: FlightSearchQuery): Observable<BaseResponse<Worksheet[]>> {
    return <Observable<BaseResponse<Worksheet[]>>>this.restService.post(
      EXP_ENV.serviceBaseURL + 'expaccpt/api/ecc/detailer',
      request
    );
  }

  @TrackRestCallProgress()
  public getShipmentInfo(request: ShipmentData): Observable<BaseResponse<ShipmentData>> {
    return <Observable<BaseResponse<ShipmentData>>>this.restService.post(
      EXP_ENV.serviceBaseURL + 'expaccpt/api/ecc/get-shipment-flight-info',
      request
    );
  }

  @TrackRestCallProgress()
  public getFlightOffPoint(request: FlightSearchQuery): Observable<BaseResponse<ShipmentData>> {
    return <Observable<BaseResponse<ShipmentData>>>this.restService.post(
      EXP_ENV.serviceBaseURL + 'expaccpt/api/ecc/get-fligh-offpoint',
      request
    );
  }

  @TrackRestCallProgress()
  public getAwbDetails(request: ShipmentData): Observable<BaseResponse<EccExportAwbDetails[]>> {
    return <Observable<BaseResponse<EccExportAwbDetails[]>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.fetchAwbDetail,
      request
    );
  }

  @TrackRestCallProgress()
  public deleteAdvice(request: DeleteShipmentData): Observable<BaseResponse<ShipmentData>> {
    return <Observable<BaseResponse<ShipmentData>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.deleteAdviceDetail,
      request
    );
  }

  @TrackRestCallProgress()
  public editAdvice(request: Advice): Observable<BaseResponse<Advice>> {
    return <Observable<BaseResponse<Advice>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.editAdvice,
      request
    );
  }

  @TrackRestCallProgress()
  public updateAdviceForNoShow(request: Advice): Observable<BaseResponse<Advice>> {
    return <Observable<BaseResponse<Advice>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.updateAdviceForNoShow,
      request
    );
  }

  // updateShipment: 'expaccpt/api/ecc/shipment',
  @TrackRestCallProgress()
  public updateShipmentForNoShow(request: ShipmentData): Observable<BaseResponse<ShipmentData>> {
    return <Observable<BaseResponse<ShipmentData>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.updateShipmentForNoShow,
      request
    );
  }

  @TrackRestCallProgress()
  public checkAcceptance(request: ShipmentData): Observable<BaseResponse<ShipmentData>> {
    return <Observable<BaseResponse<ShipmentData>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.checkAcceptance,
      request
    );
  }
  //
  @TrackRestCallProgress()
  public addNoFlightDetails(request: ShipmentDataNoFlight): Observable<BaseResponse<ShipmentData>> {
    return <Observable<BaseResponse<ShipmentData>>>this.restService.post(
      EXP_ENV.serviceBaseURL + EXP_ENV.addNoFlightDetails,
      request
    );
  }

  public getShipmentInfoDetails(request: FlightSearchQuery): Observable<BaseResponse<ShipmentData>> {
    return <Observable<BaseResponse<ShipmentData>>>this.restService.post(
      EXP_ENV.serviceBaseURL + 'expaccpt/api/ecc/get-shipment-flight-info-details',
      request
    );
  }
}
