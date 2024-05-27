import { Injectable } from '@angular/core';
import { BaseService, RestService, BaseRequest, BaseResponse, TrackRestCallProgress } from 'ngc-framework';
import { EnquiryLSPByLocationRequest, EnquiryLSPByLocationResponse, ServiceErrorLogRequest, ServiceErrorLogResponse, templogRequest, UldInventoryDetailsRequest, UldStockLevelRequest, UldStockLevelResponse } from '../uld/uld.shared';
import {
  UldInventoryRequest, UldInventoryResponse, UldTempratureRequest, UldTempratureResponse,
  UldMovement, ULD, UldStockStatusRequest,
  SightedUldRequest, SightedUldResponse, ConfirmSightedUldRequest,
  ConfirmSightedUldResponse, ConfirmMissingRequest, ConfirmMissingResponse,
  DeleteSightedUldRequest, DeleteSightedUldResponse,
  UldTransferViewDataRequest, UldTransferViewDataResponse,
  UldTransferRequest, UldTransferResponse, UldUcmManagement,
  UldGenerateRecieptNumberRequest
} from '../uld/uld.shared';
import { Observable } from 'rxjs';
// ULD_ENV/Configuration
import { ULD_ENV, SATSSGINTERFACE_ENV, EQP_ENV } from '../../environments/environment';

@Injectable()
export class UldService extends BaseService {

  public carrierFromLastSearchedForInULDTransfer: string;
  public carrierToLastSearchedForInULDTransfer: string;
  public transactionNumberLastSearchedForInULDTransfer: string;
  public unfinalizeCheckBoxLastSearchedForInULDTransfer: boolean;
  public dataFromCommonTable: any;
  public transferUldData: any;
  public uldinventoryData: any;
  public lspByLocation: any;
  //public carrierLastSearchedForInSpecialScreen:string;
  /**
       * Initialize
       *
       * @param restService Rest Service
       */
  constructor(private restService: RestService) {
    super();
  }

  /**
   * Gets ULD IN/OUT Movements.
   *
   * @param serverBaseURL Server Base URL (Optional)
   */

  // getUldStocklevelDetails for caling service of uld stock level
  @TrackRestCallProgress()
  public getUldStocklevelDetails(request: UldStockLevelRequest): Observable<BaseResponse<UldStockLevelResponse>> {
    return <Observable<BaseResponse<UldStockLevelResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.stockLevelUrl, request);
  }
  /**
    * Gets Uld Inventory List
    *
    * @param serverBaseURL Server Base URL (Optional),RequestObject(Carrier,UldType,Location,ConditionType,Status)
    *@returns ULD Inventory Details
    */
  @TrackRestCallProgress()
  public getUldInventoryDetails(request: UldInventoryRequest): Observable<BaseResponse<UldInventoryResponse>> {

    return <Observable<BaseResponse<UldInventoryResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.inventorySearchUrl
        , request);
  }

  // @TrackRestCallProgress()
  // public getUldInventoryDetailsInfo(request: UldInventoryDetailsRequest): Observable<BaseResponse<UldInventoryResponse>> {

  //   return <Observable<BaseResponse<UldInventoryResponse>>>this.restService.post
  //     (ULD_ENV.serviceBaseURL + ULD_ENV.inventoryDetailsSearchUrl
  //       , request);
  // }

  // @TrackRestCallProgress()
  // public getLSPByLocation(request: EnquiryLSPByLocationRequest): Observable<BaseResponse<EnquiryLSPByLocationResponse>> {

  //   return <Observable<BaseResponse<EnquiryLSPByLocationResponse>>>this.restService.post
  //     (ULD_ENV.serviceBaseURL + ULD_ENV.enquiryLSPByLocationSearchUrl
  //       , request);
  // }

  @TrackRestCallProgress()
  public getServiceErrorLog(request: ServiceErrorLogRequest): Observable<BaseResponse<ServiceErrorLogResponse>> {

    return <Observable<BaseResponse<ServiceErrorLogResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.serviceErrorLogSearchUrl
        , request);
  }

  @TrackRestCallProgress()
  public saveServiceErrorLogInfo(request: ServiceErrorLogRequest): Observable<BaseResponse<ServiceErrorLogResponse>> {
    return <Observable<BaseResponse<ServiceErrorLogResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.saveServiceErrorLogInfo
        , request);
  }

  @TrackRestCallProgress()
  public getUldTemperatureDetails(request: UldTempratureRequest): Observable<BaseResponse<UldTempratureResponse>> {
    return <Observable<BaseResponse<UldTempratureResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.tempratureySearchUrl
        , request);
  }

  @TrackRestCallProgress()
  public addUldTemperatureDetails(request: templogRequest): Observable<BaseResponse<UldTempratureResponse>> {
    return <Observable<BaseResponse<UldTempratureResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.tempratureyAddUrl
        , request);
  }

  @TrackRestCallProgress()
  public deleteUldTemperatureDetails(request: templogRequest): Observable<BaseResponse<UldTempratureResponse>> {
    return <Observable<BaseResponse<UldTempratureResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.tempratureyDeleteUrl
        , request);
  }

  // ULD IN/OUT MOVEMENT
  @TrackRestCallProgress()
  public getUldMovemantDetails(request: string, request1: any): Observable<BaseResponse<UldMovement>> {

    return <Observable<BaseResponse<UldMovement>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.finduldUrl + request, request1);
  }
  // http://localhost:8080/uld/api/uld/movement/in/finduld/AKE01116SQ

  // Search For ULD
  @TrackRestCallProgress()
  public feedNewUld(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.createuldUrl, request);
  }

  // IRF
  @TrackRestCallProgress()
  public feedInReturnFromWorkshop(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.createrepairUrl, request);
  }
  // IRA
  @TrackRestCallProgress()
  public feedInReturnFromAgent(request: ULD) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.returnfromagentUrl, request);
  }
  // IFW
  @TrackRestCallProgress()
  public feedInUpdateATCargo(request: ULD) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.updatefoundcargoUrl, request);
  }
  // IFN
  @TrackRestCallProgress()
  public feedInUpdateATApron(request: ULD) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.updatefoundapronUrl, request);
  }
  // IFL
  @TrackRestCallProgress()
  public feedFlightInUld(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.createinflightUrl, request);
  }

  // checkDuplicateInMovement
  @TrackRestCallProgress()
  public checkDuplicateInMovement(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.checkDuplicateInMovement, request);
  }
  // ULD-OUT
  // ORP
  @TrackRestCallProgress()
  public feedRepairUld(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.createOutrepairUrl, request);
  }
  // OLW
  @TrackRestCallProgress()
  public feedCargoUld(request: ULD) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.updatemissingcargoUrl, request);
  }
  // OLS
  @TrackRestCallProgress()
  public feedApronUld(request: ULD) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.updatemissingapronUrl, request);
  }
  // OFL
  @TrackRestCallProgress()
  public feedFlightOutUld(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.createoutflightUrl, request);
  }
  // ODL
  @TrackRestCallProgress()
  public deleteUld(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.deleteuldUrl, request);
  }
  // ORA
  @TrackRestCallProgress()
  public feedAgentUld(request: ULD) {
    return <Observable<BaseResponse<UldMovement>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.senttoagentUrl, request);
  }
  // OGH
  @TrackRestCallProgress()
  public feedReleaseUld(request: ULD) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.releasedtootherghaUrl, request);

  }

  //checkAssignFlightForInFlight
  @TrackRestCallProgress()
  public checkAssignFlightForInFlight(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.checkAssignFlightForInFlight, request);

  }

  //checkDulicateInFlightMovement
  @TrackRestCallProgress()
  public checkDulicateInFlightMovement(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.checkDulicateInFlightMovement, request);

  }

  //checkDuplicateOutMovementForDeleteUld
  @TrackRestCallProgress()
  public checkDuplicateOutMovementForDeleteUld(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.checkDuplicateOutMovementForDeleteUld, request);
  }

  // assignFlight
  @TrackRestCallProgress()
  public assignFlight(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.assignFlight, request);
  }

  //checkDulicateOutFlightMovement
  @TrackRestCallProgress()
  public checkDulicateOutFlightMovement(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.checkDulicateOutFlightMovement, request);

  }
  //checkDuplicateOutMovement
  @TrackRestCallProgress()
  public checkDuplicateOutMovement(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.checkDuplicateOutMovement, request);

  }

  // Movement Condition movementCondition
  @TrackRestCallProgress()
  public movementCondition(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.movementCondition, request);

  }
  @TrackRestCallProgress()
  public getflightdetails(request: ULD) {
    return <Observable<BaseResponse<UldStockStatusRequest>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.flightdetailsUrl, request);
  }
  @TrackRestCallProgress()
  public updateUldInstruction(request: ULD): Observable<BaseResponse<UldMovement>> {
    return <Observable<BaseResponse<UldMovement>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.editULDUrl, request);
  }

  // ULD Stock Check Process ------------------------------------------------------------------------
  @TrackRestCallProgress()
  public uldStocksStatusFetch(request: UldStockStatusRequest) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<UldStockStatusRequest>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.uldStocksStatusFetchUrl, request);
  }//

  @TrackRestCallProgress()
  public fetchSightedUlds(request: SightedUldRequest): Observable<BaseResponse<SightedUldResponse>> {
    return <Observable<BaseResponse<SightedUldResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.fetchSightedUldsUrl, request);
  }// http://localhost:8080/uld/api/uld/stockcheck/fetchsighteduld

  @TrackRestCallProgress()
  public fetchUnsightedUlds(request: SightedUldRequest): Observable<BaseResponse<SightedUldResponse>> {
    return <Observable<BaseResponse<SightedUldResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.fetchUnsightedUldsUrl, request);
  }// http://localhost:8080/uld/api/uld/stockcheck/fetchunsighteduld

  @TrackRestCallProgress()
  public confirmSightedService(request: any): Observable<BaseResponse<ConfirmSightedUldResponse>> {
    return <Observable<BaseResponse<ConfirmSightedUldResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.confirmSightedServiceUrl, request);
  }// http://localhost:8080/uld/api/uld/stockcheck/unsighteduldassighted

  @TrackRestCallProgress()
  public confirmMissingService(request: any): Observable<BaseResponse<ConfirmMissingResponse>> {
    return <Observable<BaseResponse<ConfirmMissingResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.confirmMissingServiceUrl, request);
  }// http://localhost:8080/uld/api/uld/stockcheck/unsightedmissinguld

  @TrackRestCallProgress()
  public confirmDeleteService(request: any): Observable<BaseResponse<DeleteSightedUldResponse>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<DeleteSightedUldResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.confirmDeleteServiceUrl, request);
  }// http://localhost:8080/uld/api/uld/stockcheck/deletedunsighteduld

  @TrackRestCallProgress()
  public fetchStockConsolidation(request: any): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.fetchStockConsolidationUrl, request);
  }

  @TrackRestCallProgress()
  public osiRemark(request: any): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.osiRemarkUrl, request);
  }

  @TrackRestCallProgress()
  public getOsiRemark(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.getosiRemarkUrl, request);
  }

  @TrackRestCallProgress()
  public confirmReconcilCargo(request: any): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.confirmReconcilCargoUrl, request);
  }

  @TrackRestCallProgress()
  public confirmReconcilApron(request: any): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.confirmReconcilApronUrl, request);
  }

  @TrackRestCallProgress()
  public confirmCompletedCargo(request: any): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.confirmCompletCargoUrl, request);
  }

  @TrackRestCallProgress()
  public confirmCompletedApron(request: any): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.confirmCompletApronUrl, request);
  }

  @TrackRestCallProgress()
  public confirmScmCargo(request: any): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.confrimScmCargoUrl, request);
  }

  @TrackRestCallProgress()
  public confirmScmApron(request: any): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.confrimScmApronUrl, request);
  }

  @TrackRestCallProgress()
  public confirmScmCargoApronBoth(request: any): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.confirmScmCargoApronBothUrl, request);
  }
  // END ULD Stock Check Process ------------------------------------------------------------------------

  /**
   * ULD Transfer queries
   */

  @TrackRestCallProgress()
  public fetchUldTransferData(request: UldTransferViewDataRequest):
    Observable<BaseResponse<UldTransferViewDataResponse>> {
    return <Observable<BaseResponse<UldTransferViewDataResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.fetchULDTransferDetailsUrl, request);
  }

  @TrackRestCallProgress()
  public doUldValidation(request: UldTransferRequest): Observable<BaseResponse<UldTransferResponse>> {
    return <Observable<BaseResponse<UldTransferResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.uldValidationUrl, request);
  }

  @TrackRestCallProgress()
  public getRecieptNumber(request: UldGenerateRecieptNumberRequest): Observable<BaseResponse<UldTransferResponse>> {
    return <Observable<BaseResponse<UldTransferResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.generateRecieptNumberUrl, request);
  }
  @TrackRestCallProgress()
  public createUldTransfer(request: UldTransferRequest): Observable<BaseResponse<UldTransferResponse>> {
    return <Observable<BaseResponse<UldTransferResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.createUldTransferUrl, request);
  }

  @TrackRestCallProgress()
  public finalizeTransfer(request: UldTransferRequest): Observable<BaseResponse<UldTransferResponse>> {
    return <Observable<BaseResponse<UldTransferResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.finalizeTransferUrl, request);
  }

  @TrackRestCallProgress()
  public updateTransfer(request: UldTransferRequest): Observable<BaseResponse<UldTransferResponse>> {
    return <Observable<BaseResponse<UldTransferResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.updateTransferUrl, request);
  }

  @TrackRestCallProgress()
  public deleteTransfer(request: UldTransferRequest): Observable<BaseResponse<UldTransferResponse>> {
    return <Observable<BaseResponse<UldTransferResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.deleteTransferUrl, request);
  }


  @TrackRestCallProgress()
  public getHandlingCarrierCode(request: ULD): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.getHandlingCarrierCode, request);
  }

  @TrackRestCallProgress()
  public getUldEnquire(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.getUldEnquire, request);
  }

  @TrackRestCallProgress()
  public getUserType(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.getUserType, request);
  }

  @TrackRestCallProgress()
  public searchUcmUld(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.searchUcmUld, request);
  }

  // checkUldExistance

  @TrackRestCallProgress()
  public checkUldExistance(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.checkUldExistance, request);
  }

  @TrackRestCallProgress()
  public createUcmUld(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.createUcmUld, request);
  }


  @TrackRestCallProgress()
  public ucmUldIn(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.ucmUldIn, request);
  }

  @TrackRestCallProgress()
  public ucmUldOut(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.ucmUldout, request);
  }


  @TrackRestCallProgress()
  public ucmUldBoth(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.ucmUldBoth, request);
  }

  @TrackRestCallProgress()
  public deleteUcmUld(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.deleteUcmUld, request);
  }

  @TrackRestCallProgress()
  public isUldExistInMasterTable(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.isUldExistInMasterTable, request);
  }
  /**
   * This will take care of the date formate
   * @param dateObj
   */
  convertJsonDate(dateObj): string {
    let returnObj = '';
    const year: String = '' + dateObj[0];
    let month: String = '' + dateObj[1];
    let day: String = '' + dateObj[2];
    month = month.length === 1 ? '0' + month : month;
    day = day.length === 1 ? '0' + day : month;
    // 2016-01-01
    returnObj = year + '-' + month + '-' + day;
    return returnObj;
  }

  /**
   * This will take care of the date & time formate
   * @param dateObj
   */
  convertJsonDateTime(dateObj): string {
    let returnObj = '';
    const year: String = '' + dateObj[0];
    let month: String = '' + dateObj[1];
    let day: String = '' + dateObj[2];
    let hour: String = '' + dateObj[3];
    let min: String = '' + dateObj[4];
    const sec: String = '' + dateObj[5];
    month = month.length === 1 ? '0' + month : month;
    day = day.length === 1 ? '0' + day : month;
    hour = hour.length === 1 ? '0' + hour : hour;
    min = min.length === 1 ? '0' + min : min;
    // 2016-01-01T10:24
    returnObj = year + '-' + month + '-' + day + 'T' + hour + ':' + min;
    return returnObj;
  }

  /**
   * This will take care of the time formate
   * @param dateObj
   */
  convertJsonTime(dateObj): string {
    let returnObj = '';
    let hour: String = '' + dateObj[0];
    let min: String = '' + dateObj[1];
    const sec: String = '' + dateObj[2];
    hour = hour.length === 1 ? '0' + hour : hour;
    min = min.length === 1 ? '0' + min : min;
    // 10:24
    returnObj = hour + ':' + min;
    return returnObj;
  }

  @TrackRestCallProgress()
  public getMovementLocationTypes(request): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.getMovementLocationTypes, request);
  }

  @TrackRestCallProgress()
  public setMovementLocationTypes(request): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.setMovementLocationTypes, request);
  }

  @TrackRestCallProgress()
  public getUldSeriesTypes(request): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.getUldSeriesTypes, request);
  }

  @TrackRestCallProgress()
  public setUldSeriesTypes(request): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.setUldSeriesTypes, request);
  }

  @TrackRestCallProgress()
  public sightNewUldFromSighted(request: any): Observable<BaseResponse<ConfirmSightedUldResponse>> {
    return <Observable<BaseResponse<ConfirmSightedUldResponse>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.sightednuldassighted, request);
  }

  @TrackRestCallProgress()
  public delOsiRemark(request: any): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.delosiRemarkUrl, request);
  }

  @TrackRestCallProgress()
  public fetchULDListFromICS(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(SATSSGINTERFACE_ENV.serviceBaseURL + SATSSGINTERFACE_ENV.fetchUldList, request);
  }

  @TrackRestCallProgress()
  public getUldstatusFlag(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.getUldstatusFlag, request);
  }

  @TrackRestCallProgress()
  public getUldInfo(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.getUldinfo, request);
  }

  @TrackRestCallProgress()
  public saveUpdatedUldDetails(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.saveulddata, request);
  }

  @TrackRestCallProgress()
  public getIcsulddetails(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.geticsulddata, request);
  }

  @TrackRestCallProgress()
  public delUldTransferOsiRemark(request: any): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.deltransferosiRemarkUrl, request);
  }

  @TrackRestCallProgress()
  public releaseBT(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.releaseBT, request);
  }

  @TrackRestCallProgress()
  public fetchPhotoForDocId(request: any) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.fetchPhotoForDocId, request);
  }

  @TrackRestCallProgress()
  public restartSCMCycle(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.restartSCMCycle, request);
  }

  @TrackRestCallProgress()
  public searchUldAllotment(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(ULD_ENV.serviceBaseURL + ULD_ENV.searchUldAllotment, request, request);
  }

  @TrackRestCallProgress()
  public saveUldAllotment(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(ULD_ENV.serviceBaseURL + ULD_ENV.saveUldAllotment, request, request);
  }

  @TrackRestCallProgress()
  public saveUldAllotmentGroup(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(ULD_ENV.serviceBaseURL + ULD_ENV.saveUldAllotmentGroup, request, request);
  }

  @TrackRestCallProgress()
  public deleteUldAllotment(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(ULD_ENV.serviceBaseURL + ULD_ENV.deleteUldAllotment, request, request);
  }

  //maintain EIC
  @TrackRestCallProgress()
  public MaintainEicdFetch(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        ULD_ENV.serviceBaseURL + ULD_ENV.maintainEicFetch,
        request
      )

    );
  }

  @TrackRestCallProgress()
  public DismantleUld(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        ULD_ENV.serviceBaseURL + ULD_ENV.DismantleUld,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public addUldMaintainEic(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        ULD_ENV.serviceBaseURL + ULD_ENV.addUldMaintainEic,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public SaveMaintainEic(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        ULD_ENV.serviceBaseURL + ULD_ENV.saveMaintainEic,
        request
      )
    );
  }

  // @TrackRestCallProgress()
  // public getULDLSPDetails(request: any): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>(
  //     this.restService.post(
  //       ULD_ENV.serviceBaseURL + ULD_ENV.getULDLSPDetails,
  //       request
  //     )
  //   );
  // }

  @TrackRestCallProgress()
  public updateULDLSPRetrieveDate(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(
        ULD_ENV.serviceBaseURL + ULD_ENV.updateULDLSPRetrieveDate,
        request
      )
    );
  }

  @TrackRestCallProgress()
  public getGlobalUldStockCheckRequest(request): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.getGlobalUldStockCheckRequest, request);
  }

  //search request in the global-uld-tracking
  @TrackRestCallProgress()
  public getUldTrackingRequest(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.getUldTrackingRequest, request);
  }
  @TrackRestCallProgress()
  public searchInOutMovementUld(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.searchInOutMovementUld, request);
  }
  @TrackRestCallProgress()
  public getMovementHistory(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.getMovementHistory, request);
  }
  // maintain Global Uld Characteristic Start
  @TrackRestCallProgress()
  public saveGlobalUldCharacteristic(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(ULD_ENV.serviceBaseURL + ULD_ENV.saveGlobalUldCharacteristic, request, request);
  }

  @TrackRestCallProgress()
  public getGlobalUldCharacteristicsDetails(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(ULD_ENV.serviceBaseURL + ULD_ENV.getGlobalUldCharacteristicsDetails, request, request);
  }

  @TrackRestCallProgress()
  public deleteGlobalUldCharacteristic(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(ULD_ENV.serviceBaseURL + ULD_ENV.deleteGlobalUldCharacteristicsDetails, request, request);
  }
  // maintain Global Uld Characteristic End

  @TrackRestCallProgress()
  public getGlobalUldInventoryList(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.getGlobalUldInventoryList, request);
  }

  @TrackRestCallProgress()
  public deleteGlobalInventoryList(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.deleteGlobalInventoryList, request);
  }

  @TrackRestCallProgress()
  public saveGlobalInventoryList(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ULD_ENV.serviceBaseURL + ULD_ENV.saveGlobalInventoryList, request);
  }

  @TrackRestCallProgress()
  public fetchEquipmentRequestData(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (EQP_ENV.serviceBaseURL + EQP_ENV.fetchEquipmentRequestData, request);
  }
}