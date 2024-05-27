import { BaseService, RestService, BaseRequest } from 'ngc-framework';
// import { NgcCoreModule, HTTPService, BaseResponseData, BaseResponse, TrackRestCallProgress } from 'ngc-framework';
import { NgcCoreModule, BaseResponseData, BaseResponse, TrackRestCallProgress } from 'ngc-framework';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import {
  SearchIrregularityRequest, IrregularitySummary, IrregularityDetail,
  MarkShipmentForReuse, SearchShipmentNumberForReuse, AddShipmentNumberForReuse,
  SearchAWB, ShipmentMaster, MaintainRemarkRequest, MaintainRemarkResponse,
  MaintainRemarkDeleteRequest, MaintainRemarkDeleteResponse, MaintainRemarkCommon, HouseSearch,
  CoolportShipmetSearch, MasterAirWayBillModel, HouseModel, FetchAWBRequest, AWBDocumentModel,
  SearchShipmentLocation, CreateCN46, CN46Details, ShipmentTemperatureRange, ShipmentSearch,
  TemperatureLogEntry, TemperatureLogEntryArray, SearchInactiveCargo, SearchGroup,
  AwbRoutingReqModel, ShipmentInventory, SearchHouseWayBillListform, Dimention, DeleteHouseWayBillSearchModel,
  MaintainHouseDetailsList, ShipmentInformation, SearchFwbDataValidationform, ULDTemperatureEntrySearch, ULDTemperatureLogEntry
} from './awbManagement.shared';


// AWB_ENV/Configuration
import { AWB_ENV, CFG_ENV, IMPDLV_ENV } from '../../environments/environment';

@Injectable()
export class AwbManagementService extends BaseService {
  dataFromAddToHouse: any;
  awbNumberData: any;
  houseAWB: any;
  routedData: any;
  constructor(private restService: RestService) {
    super();
  }

  @TrackRestCallProgress()
  public getIrregularityDetails(request: SearchIrregularityRequest): Observable<BaseResponse<IrregularitySummary>> {
    return <Observable<BaseResponse<IrregularitySummary>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.searchIrregularity, request);
  }

  @TrackRestCallProgress()
  public addUpdateIrregularityDetails(request: IrregularitySummary): Observable<BaseResponse<IrregularityDetail>> {
    return <Observable<BaseResponse<IrregularityDetail>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.addIrregularity, request);
  }

  @TrackRestCallProgress()
  public getIrregularityHWABDetails(request: any): Observable<BaseResponse<IrregularitySummary>> {
    return <Observable<BaseResponse<IrregularitySummary>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.irregularityHAWBList, request);
  }

  @TrackRestCallProgress()
  public deleteIrregularityHWABDetails(request: SearchIrregularityRequest): Observable<BaseResponse<IrregularitySummary>> {
    return <Observable<BaseResponse<IrregularitySummary>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.irregularityHAWBDelete, request);
  }
  @TrackRestCallProgress()
  public searchAMBDPieceWeightByFlightKetDate(request: any) {
    return this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.searchamdbpieceweight, request);
  }

  @TrackRestCallProgress()
  public updateIrregularityHWABDetails(request: any): Observable<BaseResponse<IrregularitySummary>> {
    return <Observable<BaseResponse<IrregularitySummary>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.irregularityHAWBUpdate, request);
  }
  @TrackRestCallProgress()
  public addIrregularityHWABDetails(request: any): Observable<BaseResponse<IrregularitySummary>> {
    return <Observable<BaseResponse<IrregularitySummary>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.irregularityHAWBAdd, request);
  }
  @TrackRestCallProgress()
  public deleteIrregularityDetails(request: IrregularityDetail): Observable<BaseResponse<IrregularityDetail>> {
    return <Observable<BaseResponse<IrregularityDetail>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.deleteIrregularity, request);
  }

  @TrackRestCallProgress()
  public getShipmentNumber(request: MarkShipmentForReuse) {
    return <Observable<BaseResponse<SearchShipmentNumberForReuse>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.getShipmentNumber, request);
  }

  @TrackRestCallProgress()
  public getAllShipmentNumber(request: MarkShipmentForReuse) {
    return <Observable<BaseResponse<SearchShipmentNumberForReuse>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.getAllShipmentNumber, request);
  }

  @TrackRestCallProgress()
  public addShipmentNumber(request: AddShipmentNumberForReuse) {
    return <Observable<BaseResponse<SearchShipmentNumberForReuse>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.addShipmentNumber, request);
  }

  @TrackRestCallProgress()
  public deleteShipmentNumber(request: MarkShipmentForReuse) {
    return <Observable<BaseResponse<SearchShipmentNumberForReuse>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.deleteShipmentNumber, request);
  }

  @TrackRestCallProgress()
  public fetchOnSearch(request: SearchAWB):
    Observable<BaseResponse<ShipmentMaster>> {
    return <Observable<BaseResponse<ShipmentMaster>>>this.restService
      .post(AWB_ENV.serviceBaseURL + AWB_ENV.getShipmentOnHoldDetails, request);
  }

  @TrackRestCallProgress()
  public updateHold(request: ShipmentMaster): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.updateShipmentOnHoldDetails, request);
  }

  @TrackRestCallProgress()
  public generateCTO(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.generateCTOcase, request);
  }

  @TrackRestCallProgress()
  public searchRemark(request: MaintainRemarkRequest):
    Observable<BaseResponse<MaintainRemarkResponse>> {
    return <Observable<BaseResponse<MaintainRemarkResponse>>>
      this.restService.post
        (AWB_ENV.serviceBaseURL + AWB_ENV.shipmentRemarksFetch, request);
  }

  @TrackRestCallProgress()
  public saveRemarks(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (AWB_ENV.serviceBaseURL + AWB_ENV.shipmentRemarksInsert, request);
  }

  @TrackRestCallProgress()
  public deleteRemarks(request: MaintainRemarkDeleteRequest): Observable<BaseResponse<MaintainRemarkDeleteResponse>> {
    return <Observable<BaseResponse<MaintainRemarkDeleteResponse>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.shipmentRemarksDelete, request);
  }
  @TrackRestCallProgress()
  public getOnSearch(request):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService
      .post(AWB_ENV.serviceBaseURL + AWB_ENV.getMasterAirWayBillModel, request);

  }
  @TrackRestCallProgress()
  public insertAWBRecord(request: HouseModel): Observable<BaseResponse<HouseModel>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<HouseModel>>>this.restService
      .post(AWB_ENV.serviceBaseURL + AWB_ENV.saveHouseModel, request);
  }

  @TrackRestCallProgress()
  public updateAWBRecord(request: HouseModel): Observable<BaseResponse<HouseModel>> {
    return <Observable<BaseResponse<HouseModel>>>this.restService
      .post(AWB_ENV.serviceBaseURL + AWB_ENV.saveHouseModel, request);
  }



  @TrackRestCallProgress()
  public deleteAWBRecord(request: MasterAirWayBillModel): Observable<BaseResponse<MasterAirWayBillModel>> {
    return <Observable<BaseResponse<MasterAirWayBillModel>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.deleteHAWB, request);
  }


  //  @TrackRestCallProgress()
  // public UpdateAWBRecord(request: HouseModel):Observable<BaseResponse<HouseModel>> {
  // return <Observable<BaseResponse<HouseModel>>> this.restService
  // .post(AWB_ENV.serviceBaseURL + AWB_ENV.updateHouseModel, request);

  // }

  @TrackRestCallProgress()
  public searchHAWB(request: HouseModel): Observable<BaseResponse<HouseModel>> {
    return <Observable<BaseResponse<HouseModel>>>this.restService
      .post(AWB_ENV.serviceBaseURL + AWB_ENV.searchHAWB, request);
  }

  @TrackRestCallProgress()
  public searchCN46(request: CreateCN46): Observable<BaseResponse<CreateCN46>> {
    return <Observable<BaseResponse<CreateCN46>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.searchCN46, request);

  }


  @TrackRestCallProgress()
  public createCn46Request(request: CreateCN46): Observable<BaseResponse<CN46Details>> {
    return <Observable<BaseResponse<CN46Details>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.createCn46Request, request);

  }

  @TrackRestCallProgress()
  public onDelete(request: HouseModel): Observable<BaseResponse<HouseModel>> {
    return <Observable<BaseResponse<HouseModel>>>this.restService
      .post(AWB_ENV.serviceBaseURL + AWB_ENV.deleteHAWB, request);
  }


  @TrackRestCallProgress()
  public onDeleteMaster(request: HouseModel): Observable<BaseResponse<HouseModel>> {
    return <Observable<BaseResponse<HouseModel>>>this.restService
      .post(AWB_ENV.serviceBaseURL + AWB_ENV.onDeleteMaster, request);
  }

  @TrackRestCallProgress()
  public getshipmentInfo(request) {
    console.log("req", request);
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.getShipmentInformation, request);
  }

  @TrackRestCallProgress()
  public getDimensionInformation(request) {
    console.log("req", request);
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.getDimensionInformation, request);
  }

  @TrackRestCallProgress()
  public saveShipmentDimensionInformation(request: ShipmentInformation) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL +
        AWB_ENV.saveDimensionInformation, request);
  }

  @TrackRestCallProgress()
  public updateCloseUnclose(request: any) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL +
        AWB_ENV.updateCloseUnclose, request);
  }

  @TrackRestCallProgress()
  public printAWBBarcode(request) {
    console.log("req", request);
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.printAWBBarcode, request);
  }

  @TrackRestCallProgress()
  public fetchShipmentTemperatureRangeInfo(request: ShipmentSearch): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.temperatureLogEntryModel, request);

  }

  @TrackRestCallProgress()
  public fetchCoolportShipmentInfo(request: CoolportShipmetSearch): Observable<BaseResponse<any>> {
    console.log("request", request);
    return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.coolportShipmentMonitoring, request);

  }

  @TrackRestCallProgress()
  public updateTemparatureShipmentInfo(request: any): Observable<BaseResponse<any>> {
    console.log("request", request);
    return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.coolportShipmentMonitoringUpdate, request);

  }
  @TrackRestCallProgress()
  public saveShipmentTemperatureLogEntry(request: any): Observable<BaseResponse<TemperatureLogEntry>> {
    return <Observable<BaseResponse<TemperatureLogEntry>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.temperatureLogEntryModelSave, request);
  }

  @TrackRestCallProgress()
  public deleteShipmentTemperatureLogEntry(request: any): Observable<BaseResponse<TemperatureLogEntry>> {
    return <Observable<BaseResponse<TemperatureLogEntry>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.temperatureLogEntryModelDelete, request);
  }

  @TrackRestCallProgress()
  public fetchAwbDocumentDetails(request: any):
    Observable<BaseResponse<any>> {
    //  request.consignee.contactEmail = request.consignee.contactEmail.toString();
    return <Observable<BaseResponse<any>>>this.restService
      .post(AWB_ENV.serviceBaseURL + AWB_ENV.fetchAwbDocumentDetails, request);

  }

  @TrackRestCallProgress()
  public saveAWBDocumentDetails(request: AWBDocumentModel):
    Observable<BaseResponse<any>> {
    if (request.consignee.contactEmail) {
      request.consignee.contactEmail = request.consignee.contactEmail.toString();
    }

    return <Observable<BaseResponse<any>>>
      this.restService.post
        (AWB_ENV.serviceBaseURL + AWB_ENV.saveAWBDocumentDetails, request);
  }

  @TrackRestCallProgress()
  public changeShipmentType(request: AWBDocumentModel):
    Observable<BaseResponse<any>> {
    if (request.consignee.contactEmail) {
      request.consignee.contactEmail = request.consignee.contactEmail.toString();
    }
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (AWB_ENV.serviceBaseURL + AWB_ENV.updateShipmentType, request);
  }

  @TrackRestCallProgress()
  public getInactiveOrOldCargoRecords(request: SearchInactiveCargo) {
    console.log(AWB_ENV.serviceBaseURL + AWB_ENV.getInactiveOrOldCargoo);
    return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.getInactiveOrOldCargoo, request);
  }

  @TrackRestCallProgress()
  public moveToFreightOut(request: any): Observable<BaseResponse<any>> {

    return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.moveToFreightOut, request);
  }

  @TrackRestCallProgress()
  public getDefaultCreationDays(request: any): Observable<BaseResponse<any>> {

    return <Observable<BaseResponse<any>>>this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.moveToFreightOut, request);
  }

  @TrackRestCallProgress()
  public searchLocation(request: SearchShipmentLocation): Observable<BaseResponse<ShipmentMaster>> {
    return <Observable<BaseResponse<ShipmentMaster>>>
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.searchShipLocation, request);
  }

  @TrackRestCallProgress()
  public updateMergedLocation(request: any): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.updateMergedShipLocation, request);
  }

  @TrackRestCallProgress()
  public insertSplittedLocation(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.insertsplittedShipLocation, request);
  }

  @TrackRestCallProgress()
  public insertAddedDetails(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.insertAddedShipLocation, request);
  }

  @TrackRestCallProgress()
  public deleteInventory(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.deleteInventory, request);
  }

  // @TrackRestCallProgress()
  // public getInventoryHouseDetails(request): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>this.restService.post
  //     (AWB_ENV.serviceBaseURL + AWB_ENV.getInventoryHouse, request);
  // }

  // @TrackRestCallProgress()
  // public createInventoryHouseWayBill(request): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>this.restService.post
  //     (AWB_ENV.serviceBaseURL + AWB_ENV.createInventoryHouse, request);
  // }

  @TrackRestCallProgress()
  public getMailbagOverviewDetails(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.getMailbagOverviewList, request);
  }

  @TrackRestCallProgress()
  public updateMailbagInvLocation(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.mailBagUpdateLocation, request);
  }

  @TrackRestCallProgress()
  public getAllStatusOfMailBag(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.getAllStatusOfMailBag, request);
  }

  @TrackRestCallProgress()
  public checkForContentCode(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.checkForContentCode, request);
  }

  @TrackRestCallProgress()
  public checkForShcsOtherThanMail(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.checkForShcsOtherThanMail, request);
  }

  @TrackRestCallProgress()
  public checkForContainerDestination(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.checkForContainerDestination, request);
  }


  @TrackRestCallProgress()
  public changeAWBNumber(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.changeAWBNumber, request);
  }



  @TrackRestCallProgress()
  public changeHAWBNumber(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.changeHAWBNumber, request);
  }

  //terminal to terminal
  @TrackRestCallProgress()
  public getDetailsOfShipmentToTerminal(request: SearchGroup): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.getDetailsOfShipmentToTerminal, request);
  }

  @TrackRestCallProgress()
  public transferShipmentToTerminal(request: SearchGroup): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.transferShipmentToTerminal, request);
  }

  @TrackRestCallProgress()
  public awbDocumentRouting(request: AwbRoutingReqModel):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService
      .post(AWB_ENV.serviceBaseURL + AWB_ENV.fetchAWBRoutingDetails, request);

  }

  @TrackRestCallProgress()
  public sendMailUploadedDocs(request) {
    console.log("req", request);
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.senddocs, request);
  }

  @TrackRestCallProgress()
  public getFwbFhlFsuMessageList(request) {
    console.log("req", request);
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.getFwbFhlFsuMessageList, request);
  }

  @TrackRestCallProgress()
  public cancelShipmentFromShipmentInfo(request) {
    console.log("req", request);
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.cancelshipmentfromSI, request);
  }
  public getAppointedAgentData(request) {
    return <Observable<BaseResponse<any>>>this.restService.post(CFG_ENV.serviceBaseURL + CFG_ENV.LOVURL, request);
  }


  @TrackRestCallProgress()
  public fetchAcceptanceInfo(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService
      .post(AWB_ENV.serviceBaseURL + AWB_ENV.fetchAcceptanceInfo, request);

  }

  @TrackRestCallProgress()
  public getEmailInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.emailInfo, request);
  }

  @TrackRestCallProgress()
  public getAllAppointedAgents(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.getAllAppointedAgents, request);
  }
  @TrackRestCallProgress()
  public getFWBConsigneeInfo(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.getFWBConsigneeInfo, request);
  }
  @TrackRestCallProgress()
  public getFWBConsigneeAgentInfoOnSelect(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.getFWBConsigneeAgentInfoOnSelect, request);
  }
  @TrackRestCallProgress()
  public getExchangeRate(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.getExchangeRate, request);
  }
  @TrackRestCallProgress()
  public shipperAndconsigneeInfoForFirstHouse(request: HouseModel): Observable<BaseResponse<HouseModel>> {
    return <Observable<BaseResponse<HouseModel>>>this.restService
      .post(AWB_ENV.serviceBaseURL + AWB_ENV.shipperAndconsigneeInfoForFirstHouse, request);
  }
  @TrackRestCallProgress()
  public getAppointedAgentList(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(CFG_ENV.serviceBaseURL + CFG_ENV.LOVURL, request);
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
  public reviveShipment(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.reviveShipmentInfo, request)
    );

  }
  @TrackRestCallProgress()
  public onRevive(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.onRevive, request)
    );

  }
  @TrackRestCallProgress()
  public purgeShipment(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.purgeShipment, request)
    );

  }

  @TrackRestCallProgress()
  public retiveInboundFlightDetailsForPartSuffix(request: ShipmentInventory): Observable<BaseResponse<ShipmentInventory>> {
    return <Observable<BaseResponse<ShipmentInventory>>>
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.retiveInboundFlightDetailsForPartSuffix, request);
  }

  //Hold Notify Changes start
  @TrackRestCallProgress()
  public searchHoldNotifyGroupShipment(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.holdShipmentNotifySearch, request)
    );
  }
  @TrackRestCallProgress()
  public updateHoldForNotifyShipments(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.updateHoldNotifyShipments, request)
    );

  }
  @TrackRestCallProgress()
  public updateHoldNotifyGroup(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.updateHoldNotifyGroup, request)
    );
  }
  @TrackRestCallProgress()
  public updateAck(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.updateAck, request)
    );
  }

  @TrackRestCallProgress()
  public deleteHouseWayBill(request: any):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (AWB_ENV.serviceBaseURL + AWB_ENV.deleteHouseWayBill, request);
  }

  @TrackRestCallProgress()
  public getHouseWayBillMaster(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.getHouseWayBillMaster, request);
  }


  @TrackRestCallProgress()
  public setHouseWayBillMaster(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.setHouseWayBillMaster, request);
  }

  @TrackRestCallProgress()
  public isShipmentHandledByHouse(request: SearchShipmentLocation): Observable<BaseResponse<number>> {
    return <Observable<BaseResponse<number>>>
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.isShipmentHandledByHouse, request);
  }
  /*
  * HOUSE WAY BILL END
  */
  //Hold Notify Changes ends
  @TrackRestCallProgress()
  public isHandledByHouse(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService
        .post(AWB_ENV.serviceBaseURL + AWB_ENV.isHandledByHouse, request)
    );
  }


  //copied from Daxing CodeBase
  @TrackRestCallProgress()
  // public cancelHWBFromHouseInfo(request) {
  //   return <Observable<BaseResponse<any>>>this.restService.post
  //     (AWB_ENV.serviceBaseURL + AWB_ENV.cancelHWBfromSI, request);
  // }

  @TrackRestCallProgress()
  public gethouseInfo(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.gethouseInformation, request);
  }
  //@TrackRestCallProgress()
  // public sendMailUploadedHWBDocs(request) {
  //   console.log("req", request);
  //   return <Observable<BaseResponse<any>>>this.restService.post
  //     (AWB_ENV.serviceBaseURL + AWB_ENV.sendHWBdocs, request);
  // }

  //Added For Daxing House Information//

  @TrackRestCallProgress()
  public changeHandlingMasterOrHouse(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (AWB_ENV.serviceBaseURL + AWB_ENV.changeHandlingMasterOrHouse, request);
  }

  @TrackRestCallProgress()
  public fhllogDetails(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>
      this.restService.post
        (AWB_ENV.serviceBaseURL + AWB_ENV.fhllogDetails, request);
  }
  @TrackRestCallProgress()
  public checkHandledByHouse(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      AWB_ENV.serviceBaseURL + AWB_ENV.checkHandledByHouse, request
    );
  }

  /* 
   * HOUSE WAY BILL LIST START
   */
  @TrackRestCallProgress()
  public getHouseWayBillList(request: SearchHouseWayBillListform): Observable<BaseResponse<any>> {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>(
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.getHouseWayBillList, request)
    );
  }

  @TrackRestCallProgress()
  public getConsigneeShipperDetails(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.getConsigneeShipperDetails, request)
    );
  }

  @TrackRestCallProgress()
  public onSaveHouse(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.onSaveHouse, request)
    );
  }

  @TrackRestCallProgress()
  public onSaveCustomerinformation(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.onSaveCustomerinformation, request)
    );
  }

  @TrackRestCallProgress()
  public onSaveCustomerinformationList(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>(
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.onSaveCustomerinformationList, request)
    );
  }


  @TrackRestCallProgress()
  public getDimensionVolumetricWeight(request: Dimention) {
    return <Observable<BaseResponse<Dimention>>>this.restService.post
      (AWB_ENV.serviceBaseURL + AWB_ENV.dimentionVolumetricWeight, request);
  }

  @TrackRestCallProgress()
  public editHouseDimension(request: MaintainHouseDetailsList) {
    console.log(JSON.stringify(request));
    return <Observable<BaseResponse<any>>>
      this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.editHouseDimension, request);
  }

  // @TrackRestCallProgress()
  // public fetchFwbLogDetailsOnSearch(request: any):
  //   Observable<BaseResponse<ShipmentMaster>> {
  //   return <Observable<BaseResponse<ShipmentMaster>>>this.restService
  //     .post(AWB_ENV.serviceBaseURL + AWB_ENV.getFWBLogDetails, request);
  // }

  // @TrackRestCallProgress()
  // public fetchFhlLogDetailsOnSearch(request: any):
  //   Observable<BaseResponse<ShipmentMaster>> {
  //   return <Observable<BaseResponse<ShipmentMaster>>>this.restService
  //     .post(AWB_ENV.serviceBaseURL + AWB_ENV.getFHLLogDetails, request);
  // }
  // @TrackRestCallProgress()
  // public checkValidFlightNotCancelled(request: any): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>(
  //     this.restService.post(
  //       AWB_ENV.serviceBaseURL + AWB_ENV.checkValidFlightNotCancelled,
  //       request
  //     )

  //   );
  // }

  // @TrackRestCallProgress()
  // public getFwbDataValidationDetails(request: SearchFwbDataValidationform): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>(
  //     this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.getFwbDataValidationDetails, request)
  //   );
  // }

  // @TrackRestCallProgress()
  // public fwbConfirm(request: SearchFwbDataValidationform): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>(
  //     this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.fwbConfirm, request)
  //   );
  // }
  // @TrackRestCallProgress()
  // public fwbReject(request: SearchFwbDataValidationform): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>(
  //     this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.fwbReject, request)
  //   );
  // }

  // @TrackRestCallProgress()
  // public fwbRejectAndSave(request: SearchFwbDataValidationform): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>(
  //     this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.fwbRejectAndSave, request)
  //   );
  // }

  // @TrackRestCallProgress()
  // public saveCheckBoxes(request: any): Observable<BaseResponse<any>> {
  //   console.log(JSON.stringify(request));
  //   console.log(AWB_ENV.serviceBaseURL + AWB_ENV.saveCheckBoxes);
  //   return <Observable<BaseResponse<any>>>(
  //     this.restService.post(AWB_ENV.serviceBaseURL + AWB_ENV.saveCheckBoxes, request)
  //   );
  // }

  // @TrackRestCallProgress()
  // public fetchUldTemperature(request: any): Observable<BaseResponse<ULDTemperatureEntrySearch>> {
  //   return <Observable<BaseResponse<ULDTemperatureEntrySearch>>>this.restService.post(AWB_ENV.serviceBaseURL
  //     + AWB_ENV.UldtemperatureLogEntryModel, request);
  // }
  // @TrackRestCallProgress()
  // public saveListUldTemperature(request: any): Observable<BaseResponse<ULDTemperatureLogEntry>> {
  //   return <Observable<BaseResponse<ULDTemperatureLogEntry>>>this.restService.post(AWB_ENV.serviceBaseURL
  //     + AWB_ENV.UldTempLogEntrySaveList, request);
  // }
  // @TrackRestCallProgress()
  // public deleteUldTemperature(request: any): Observable<BaseResponse<ULDTemperatureLogEntry>> {
  //   return <Observable<BaseResponse<ULDTemperatureLogEntry>>>this.restService.post(AWB_ENV.serviceBaseURL
  //     + AWB_ENV.UldtemperatureLogEntryModelForDelete, request);
  // }

}
