import { Injectable } from '@angular/core';
import { BaseResponse, RestService, BaseService, TrackRestCallProgress } from 'ngc-framework';
import { Observable } from 'rxjs';
import { TCS_ENV } from '../../environments/environment';

import {
  ExitGateSearchModel,
  PreWaiveParkingModel,
  ReserveTruckDockSaveModel,
  ScheduleCollectionSearchModel, tenentQueueSearchModel, TruckActivitySearchModel,
  TruckQueueSearchModel, ReleaseDockSearchModel,
  VehicleInfoModel, VehicleInfoSearchModel, ConnectingTruckSearchModel, UnknownVehicleSearchModel, UnknownVehicleModel, ManualCaptureEvent
} from './tcs.sharedmodel';


export const MAX_RECORDS: number = 8;
export const PAGE_REFRESH_MS: number = 10000;
export const REFRESH_IN_MS: number = 30000;

@Injectable()
export class TcsService extends BaseService {

  constructor(private restService: RestService) {
    super();
  }

  @TrackRestCallProgress()
  public getFreeSlots(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (TCS_ENV.serviceBaseURL + TCS_ENV.freeSlots, request);
  }

  //////////////////////////////////SIMULATOR//////////////////////////////////////////

  @TrackRestCallProgress()
  public simulate(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (TCS_ENV.serviceBaseURL + TCS_ENV.simulate, request);
  }

  @TrackRestCallProgress()
  public simulatorTrip(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (TCS_ENV.serviceBaseURL + TCS_ENV.simulatorTrip, request);
  }

  @TrackRestCallProgress()
  public simulatorSlots(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (TCS_ENV.serviceBaseURL + TCS_ENV.simulatorSlots, request);
  }

  @TrackRestCallProgress()
  public simulatorGenerateSlots(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (TCS_ENV.serviceBaseURL + TCS_ENV.simulatorGenerateSlots, request);
  }

  //////////////////////////////////////ORIGINAL API///////////////////////////////////////

  @TrackRestCallProgress()
  public simulateVehicleAtGate(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (TCS_ENV.serviceBaseURL + TCS_ENV.kioskAPIVehicleAtGate, request);
  }

  @TrackRestCallProgress()
  public simulateUpdateKioskStatus(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (TCS_ENV.serviceBaseURL + TCS_ENV.kioskAPIKioskStatus, request);
  }

  @TrackRestCallProgress()
  public simulateKioskPressKey(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (TCS_ENV.serviceBaseURL + TCS_ENV.kioskAPIPressKey, request);
  }

  @TrackRestCallProgress()
  public simulateLogEvent(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (TCS_ENV.serviceBaseURL + TCS_ENV.kioskAPILogEvent, request);
  }

  @TrackRestCallProgress()
  public simulateUpdateDockStatus(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (TCS_ENV.serviceBaseURL + TCS_ENV.kioskAPIDockStatus, request);
  }

  ////////////////////////////////////////////////////////////////////////////

  @TrackRestCallProgress()
  public search(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (TCS_ENV.serviceBaseURL + TCS_ENV.search, request);

  }


  /**
  * companyOccupancy
  */
  @TrackRestCallProgress()
  public searchCompanyOccupancy(request): Observable<any> {
    console.log(request)
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.companyOccupancySearch, request)
  }
  @TrackRestCallProgress()
  public detailsCompanyOccupancy(request): Observable<any> {
    console.log(request)
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.companyOccupancyDetails, request)
  }
  /**
   * maintainTenant
   */
  @TrackRestCallProgress()
  public searchMaintainTenant(request): Observable<any> {
    console.log(request)
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.maintainTenantSearch, request)
  }

  @TrackRestCallProgress()
  public createMaintainTenant(request): Observable<any> {
    console.log(request)
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.maintainTenantCreate, request)
  }

  @TrackRestCallProgress()
  public findMaintainTenant(request): Observable<any> {
    console.log(request)
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.maintainTenantFind, request)
  }
  @TrackRestCallProgress()
  public updateMaintainTenant(request): Observable<any> {
    console.log(request)
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.maintainTenantUpdate, request)
  }

  @TrackRestCallProgress()
  public deleteMaintainTenant(request): Observable<any> {
    console.log(request)
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.maintainTenantDelete, request)
  }
  /**
  * truckAssign Search
  */
  @TrackRestCallProgress()
  public searchTruckAssign(request): Observable<any> {
    console.log(request)
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.truckAssignSearch, request)
  }

  /**
  * truckAssign Save
  */
  @TrackRestCallProgress()
  public saveTruckAssignSRF(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.truckAssignSave, request)
  }

  /**
   * Add Queue Search
   */
  @TrackRestCallProgress()
  public searchAddQueue(request): Observable<any> {
    console.log(request)
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.addQueueSearch, request)
  }

  /**
   * Add Queue - To Queue
   */
  @TrackRestCallProgress()
  public addToQueue(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.addQueueToQueue, request)
  }


  /**
   * maintain truck dock
   */

  @TrackRestCallProgress()
  public searchMaintainTruckDock(request): Observable<any> {
    console.log(request)
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.maintainTruckDockSearch, request)
  }



  @TrackRestCallProgress()
  public searchLedInfo(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.leddisplaysearch, request);
  }
  @TrackRestCallProgress()
  public createEvent(request: ManualCaptureEvent): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.updateCheckPoint, request);
  }

  @TrackRestCallProgress()
  public searchScheduleCollectioInfo(request: ScheduleCollectionSearchModel): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.schedulecollectionInfoSearch, request);
  }
  @TrackRestCallProgress()
  public createScheduleCollectioInfo(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.schedulecollectionInfoCreate, request);
  }
  @TrackRestCallProgress()
  public updateScheduleCollectioInfo(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.schedulecollectionInfoUpdate, request);
  }
  @TrackRestCallProgress()
  public deleteScheduleCollectioInfo(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.schedulecollectionInfoDelete, request);
  }

  @TrackRestCallProgress()
  public searchAdhocUpdate(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.getAdhocChange, request);
  }

  @TrackRestCallProgress()
  public saveAdhocUpdate(request: any): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.updateAdhocChange, request);
  }
  @TrackRestCallProgress()
  public updateVehicleInfo(request: VehicleInfoModel): Observable<BaseResponse<any>> {

    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.vehicleInfoUpdate, request);
  }
  @TrackRestCallProgress()
  public deleteVehicleInfo(request: VehicleInfoModel): Observable<BaseResponse<any>> {

    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.vehicleInfoDelete, request);
  }

  @TrackRestCallProgress()
  public searchVehicleInfo(request: VehicleInfoSearchModel): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.vehicleInfoSearch, request)
  }

  @TrackRestCallProgress()
  public findVehicleInfo(request: VehicleInfoSearchModel): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.vehicleInfoFind, request)
  }

  @TrackRestCallProgress()
  public createVehicleInfo(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.vehicleInfoCreate, request);
  }

  @TrackRestCallProgress()
  public saveVehicleInfo(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.vehicleInfoSave, request);
  }

  @TrackRestCallProgress()
  public searchTruckActivity(request: TruckActivitySearchModel): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.truckActivityHistorySearch, request)
  }

  @TrackRestCallProgress()
  public searchAllocatedVehicleInfo(request: tenentQueueSearchModel): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.searchallocatedvehicleQueueInfo, request);
  }

  @TrackRestCallProgress()
  public searchManualQueueInfo(request: tenentQueueSearchModel): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.searchManualQueueInfo, request);
  }

  @TrackRestCallProgress()
  public searchTenantInfo(request: tenentQueueSearchModel): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.searchTenantInfo, request);
  }

  @TrackRestCallProgress()
  public getPriorityList(request: TruckQueueSearchModel): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.getPriorityList, request);
  }

  @TrackRestCallProgress()
  public updateQueueType(request: TruckQueueSearchModel): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.updateQueueType, request);
  }

  @TrackRestCallProgress()
  public updateQueueOrder(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.updateQueueOrder, request);

  }
  @TrackRestCallProgress()
  public createBanTruckInfo(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.maintainBanTruckCreate, request);
  }
  @TrackRestCallProgress()
  public releaseBruckInfo(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.maintainBanTruckrelease, request);
  }
  @TrackRestCallProgress()
  public updateBruckInfo(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.maintainBanTruckUpdate, request);
  }
  @TrackRestCallProgress()
  public getBanTruckHistoryInfo(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.maintainBanTruckHistory, request);
  }
  @TrackRestCallProgress()
  public getTemplateTableData(): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.createTruckDockTemplate, null);
  }
  @TrackRestCallProgress()
  public getUpdateTableData(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.updateTruckDockTemplate, request);
  }
  @TrackRestCallProgress()
  public getTemplateList(): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.templateDetails, null);
  }
  @TrackRestCallProgress()
  public updateTemplateStatus(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.templateStatusUpdate, request);
  }
  @TrackRestCallProgress()
  public creatNewTeamplate(): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.createTruckDockTemplate, null);
  }
  @TrackRestCallProgress()
  public deleteData(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.deleteTemplate, request);
  }
  @TrackRestCallProgress()
  public saveData(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.saveTemplate, request);
  }


  @TrackRestCallProgress()
  public searchDockUtilDetails(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.dockUtilzationSearch, request);
  }

  @TrackRestCallProgress()
  public getDockList(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.dockList, request);
  }


  //Reserve Truck Dock
  @TrackRestCallProgress()
  public createReserveTruckDock(request: ReserveTruckDockSaveModel): Observable<BaseResponse<ReserveTruckDockSaveModel>> {
    return <Observable<BaseResponse<ReserveTruckDockSaveModel>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.createReserveTruckDock, request);
  }

  @TrackRestCallProgress()
  public searchReserveTruckDock(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.searchReserveTruckDock, request);
  }


  @TrackRestCallProgress()
  public deleteReserveTruckDock(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.unReserveTruckDock, request);
  }

  //unreserve truck dock
  @TrackRestCallProgress()
  public unReserveTruckDock(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.unReserveTruckDock, request);
  }

  //Create Pre Waive Parking
  @TrackRestCallProgress()
  public createPreWaiveParking(request: PreWaiveParkingModel): Observable<BaseResponse<PreWaiveParkingModel>> {
    return <Observable<BaseResponse<PreWaiveParkingModel>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.createPreWaiveParking, request);
  }

  //Search Pre Waive Parking
  @TrackRestCallProgress()
  public searchPreWaiveParking(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.searchPreWaiveParking, request);
  }

  //Update Pre Waive Parking
  @TrackRestCallProgress()
  public updatePreWaiveParking(request: PreWaiveParkingModel): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.updatePreWaiveParking, request);
  }

  //Delete Pre Waive Parking
  @TrackRestCallProgress()
  public deletePreWaiveParking(request: PreWaiveParkingModel): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.deletePreWaiveParking, request);
  }

  @TrackRestCallProgress()
  public dockMonitoringSearch(): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.dockMonitoringSearch, null);
  }


  @TrackRestCallProgress()
  public getExitGateData(request: ExitGateSearchModel): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.getExitGateDetails, request);
  }

  @TrackRestCallProgress()
  public getTruckDetails(request: ExitGateSearchModel): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.getTruckDetails, request);
  }
  @TrackRestCallProgress()
  public searchUnknownVehicleList(request: UnknownVehicleSearchModel): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.UnknownVehicleList, request)
  }
  @TrackRestCallProgress()
  public mapToVehicleService(request: UnknownVehicleModel): Observable<BaseResponse<any>> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.mapToVehicleEP, request);
  }
  @TrackRestCallProgress()
  public UVRegister(request): Observable<any> {

    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.UnknownVehicleRegister, request);
  }

  @TrackRestCallProgress()
  public connectingTruckSearch(request: ConnectingTruckSearchModel): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.connectingtrucksearch, request)
  }

  @TrackRestCallProgress()
  public connectingtruck(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.conectingtruck, request);
  }

  public saveConnectTruck(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.conectingtruck, request);
  }

  @TrackRestCallProgress()
  public getVehicleInfo(request: ReleaseDockSearchModel): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.getTruckDockInfo, request);
  }

  @TrackRestCallProgress()
  public fetchBanReasonData(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.fetchBanReasonData, request);
  }
  @TrackRestCallProgress()
  public updateReleaseDock(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.updateTruckDock, request);
  }

  @TrackRestCallProgress()
  public assignTruckDock(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.assignTruckDock, request)
  }

  @TrackRestCallProgress()
  public assignDockGetVehicleInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.assignTruckDockGetVehicleInfo, request)
  }

  @TrackRestCallProgress()
  public triggerEvent(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.simulator, request)
  }

  @TrackRestCallProgress()
  public searchBanTruckInfo(request): Observable<any> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.maintainBanTruckSearch, request)
  }


  @TrackRestCallProgress()
  public tenantAddToQueue(request: any): Observable<BaseResponse<any>> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.tenantAddtoQueue, request)
  }

  @TrackRestCallProgress()
  public tenantCancelAllocation(request: any): Observable<BaseResponse<any>> {
    return this.restService.post(TCS_ENV.serviceBaseURL + TCS_ENV.tenantCancelAllocation, request)
  }

}

