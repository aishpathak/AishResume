import { Injectable } from '@angular/core';
import { BaseResponse, BaseService, RestService, TrackRestCallProgress } from 'ngc-framework';
import { Observable } from 'rxjs';
import { AAT_CUSTOMS_ENV, CUSTOMS_ENV, IMPDLV_ENV } from '../../environments/environment';
import { AddFlightModel, CustomFlightScheduleResponseModel, customMRSMOdel, customMrs, cmdModel, MaintainAccsInformation, CustomsHouseModel } from './customs.sharedmodel';

@Injectable()
export class CustomACESService extends BaseService {

    constructor(private restService: RestService) {
        super();
    }
    @TrackRestCallProgress()
    public getMrsShipmentInfo(request: customMrs):
        Observable<BaseResponse<customMrs>> {
        if (request.addOrUpdate === 'ADD') {
            return <Observable<BaseResponse<customMrs>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.getshipmentinfoincaseofadd, request);
        } else {
            return <Observable<BaseResponse<customMrs>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.customsshipmentadd, request);

        }
    }


    @TrackRestCallProgress()
    public filterFlightInfoBasedOnCriteria(searchInfo) {
        return <Observable<BaseResponse<CustomFlightScheduleResponseModel>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.searchFilteredFlightInfo, searchInfo);
    }

    @TrackRestCallProgress()
    public isFlightNumberExist(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.isFlightNumberExist, request);
    }

    @TrackRestCallProgress()
    public autoPopulateBasedOnFlightKeyAndDate(request) {
        return <Observable<BaseResponse<AddFlightModel>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.autoPopulateBasedOnFlightKeyAndDate, request);
    }

    @TrackRestCallProgress()
    public addFlightDetails(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.addFlightDetails, request);
    }

    @TrackRestCallProgress()
    public updateCancelledUncancelledFlightStatus(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.updateCancelledUncancelledFlightStatus, request);
    }

    @TrackRestCallProgress()
    public addMrsShipmentInfo(request: customMrs):
        Observable<BaseResponse<customMrs>> {
        if (request.addOrUpdate === 'ADD') {
            return <Observable<BaseResponse<customMrs>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.addNewShipmentmanually, request);
        } else {
            return <Observable<BaseResponse<customMrs>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.addMRSshipmentInfo, request);

        }
    }

    @TrackRestCallProgress()
    public getCustomsShipmentInfo(request: customMrs):
        Observable<BaseResponse<customMrs>> {
        request.addOrUpdate === 'UPDATE';
        return <Observable<BaseResponse<customMrs>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.customsShipmentInfo, request);
    }

    @TrackRestCallProgress()
    public getMrsInfo(request: customMRSMOdel):
        Observable<BaseResponse<customMRSMOdel>> {
        return <Observable<BaseResponse<customMRSMOdel>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.getMrsInfo, request);
    }

    @TrackRestCallProgress()
    public deleteMrsInfo(request: customMrs):
        Observable<BaseResponse<customMrs>> {
        return <Observable<BaseResponse<customMrs>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.deleteMrsInfo, request);
    }

    @TrackRestCallProgress()
    public getCmdInfo(request: cmdModel):
        Observable<BaseResponse<cmdModel>> {
        return <Observable<BaseResponse<cmdModel>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.cargomanifestdecleration, request);
    }

    @TrackRestCallProgress()
    public sendMrsInfo(request: customMRSMOdel):
        Observable<BaseResponse<customMRSMOdel>> {
        return <Observable<BaseResponse<customMRSMOdel>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.sendMrsInfo, request);
    }

    @TrackRestCallProgress()
    public deleteFlights(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(CUSTOMS_ENV.serviceBaseURL + CUSTOMS_ENV.deleteACESFlights, request);
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
    public searchCustomFlights(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.searchCustomsFlights, request);
    }

    @TrackRestCallProgress()
    public saveShipmentInfo(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.customsaveShipmentInfo, request);
    }

    @TrackRestCallProgress()
    public updateShipmentInfo(request) {
        // return <Observable<BaseResponse<number>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.customupdateShipmentInfo, request);
    }






    @TrackRestCallProgress()
    public customFlightShipmentInfo(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.customFlightShipmentInfo, request);
    }





    @TrackRestCallProgress()
    public fetchSubmitInitialConsigment(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.fetchSubmitInitialConsigment, request);
    }
    @TrackRestCallProgress()
    public fetchDcDetails(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.fetchDcDetails, request);
    }

    @TrackRestCallProgress()
    public fetchSubmitExportConsigment(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.fetchExportSubmitConsignment, request);
    }

    @TrackRestCallProgress()
    public fetchSubmitExportShipment(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.fetchExportSubmitShipment, request);
    }


    @TrackRestCallProgress()
    public fetchSubmitAmendedConsigment(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.fetchSubmitAmendedConsigment, request);
    }


    @TrackRestCallProgress()
    public fetchSubmitInitialShipment(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.fetchSubmitInitialShipment, request);
    }


    @TrackRestCallProgress()
    public submitConsignment(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.submitConsignment, request);
    }


    @TrackRestCallProgress()
    public fetchSubmitAmendedShipment(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.fetchSubmitAmendedShipment, request);
    }

    @TrackRestCallProgress()
    public saveAmendedConsignment(request) {
        return <Observable<BaseResponse<number>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.saveAmendedConsignment, request);
    }

    @TrackRestCallProgress()
    public submitAmendedToCustom(request) {
        // return <Observable<BaseResponse<number>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.submitAmendedToCustom, request);
    }



    @TrackRestCallProgress()
    public maintainAccsAddressInfo(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post
            (AAT_CUSTOMS_ENV.serviceBaseURL +
                AAT_CUSTOMS_ENV.maintainAccsAddressDetail, request);
    }

    @TrackRestCallProgress()
    public maintainAccsFlightInfo(request: MaintainAccsInformation):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post
            (AAT_CUSTOMS_ENV.serviceBaseURL +
                AAT_CUSTOMS_ENV.maintainAccsFlightDetail, request);
    }

    @TrackRestCallProgress()
    public maintainAccsInformationList(request:
        MaintainAccsInformation):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post
            (AAT_CUSTOMS_ENV.serviceBaseURL +
                AAT_CUSTOMS_ENV.maintainAccsDetail, request);
    }

    @TrackRestCallProgress()
    public getCustomsHouseList(request: any): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>(
            this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.getCustomsHouseList, request));
    }

    @TrackRestCallProgress()
    public saveCustomsHouseInfo(request: any): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>(
            this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.saveCustomsHouseInfo, request));
    }

    @TrackRestCallProgress()
    public getCustomsHouseInfo(request: CustomsHouseModel): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>(
            this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.getCustomsHouseInfo, request));
    }

    //Maintain Constraint Code:
    @TrackRestCallProgress()
    public getMaintainConstraintCode(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.getMaintainConstraintCode, request);
    }

    @TrackRestCallProgress()
    public insertMaintainConstraintCode(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.insertMaintainConstraintCode, request);
    }

    //Print/List ConstraintCodes Report
    @TrackRestCallProgress()
    public getPrintConstraintCode(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.getPrintConstraintCode, request);
    }

    @TrackRestCallProgress()
    public getPopUpConstraintCodeHistory(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.getPopUpConstraintCodeHistory, request);
    }

    @TrackRestCallProgress()
    public getBrkdwnDiscFltDtls(request) {
        return <Observable<BaseResponse<any>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL +
            AAT_CUSTOMS_ENV.getBrkdwnDiscFltDtls, request)
    }

    @TrackRestCallProgress()
    public getBrkdwnDiscShpDtls(request) {
        return <Observable<BaseResponse<any>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL +
            AAT_CUSTOMS_ENV.getBrkdwnDiscShpDtls, request)
    }

    @TrackRestCallProgress()
    public submitBrkdwnDiscDtls(request) {
        return <Observable<BaseResponse<any>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL +
            AAT_CUSTOMS_ENV.submitBrkdwnDiscDtls, request)
    }

    //Customs Message Log Details
    @TrackRestCallProgress()
    public getCustomsMessage(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(
            AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.fetchCustomsMessage, request);
    }

    @TrackRestCallProgress()
    public saveDcDetails(request:
        any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post
            (AAT_CUSTOMS_ENV.serviceBaseURL +
                AAT_CUSTOMS_ENV.saveDcDetails, request);
    }

    @TrackRestCallProgress()
    public searchFaxHashData(request) {
        return <Observable<BaseResponse<any>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL +
            AAT_CUSTOMS_ENV.getFaxHashTotalData, request)
    }

    // @TrackRestCallProgress()
    // public sendHashTotal(request) {
    //     return <Observable<BaseResponse<any>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL +
    //         AAT_CUSTOMS_ENV.sendHashTotal, request)
    // }

    @TrackRestCallProgress()
    public getEIttData(request) {
        return <Observable<BaseResponse<any>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL +
            AAT_CUSTOMS_ENV.getEITTData, request)
    }

    @TrackRestCallProgress()
    public saveSubmission(request) {
        return <Observable<BaseResponse<any>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL +
            AAT_CUSTOMS_ENV.saveSubmission, request)
    }

    @TrackRestCallProgress()
    public fetchRecList(request) {
        return <Observable<BaseResponse<any>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL +
            AAT_CUSTOMS_ENV.getRecList, request)
    }

    @TrackRestCallProgress()
    public fetchRecData(request) {
        return <Observable<BaseResponse<any>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL +
            AAT_CUSTOMS_ENV.getRecData, request)
    }

    //Enquire/Print Examination Results
    @TrackRestCallProgress()
    public getExaminationResults(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(
            AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.fetchExaminationResults, request);
    }

    @TrackRestCallProgress()
    public fetchPopUpConstraintCodeHistory(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(
            AAT_CUSTOMS_ENV.serviceBaseURL + AAT_CUSTOMS_ENV.fetchPopUpConstraintCodeHistory, request);
    }
    //left behind management report

    @TrackRestCallProgress()
    public fetchManagementDetails(request) {
        return <Observable<BaseResponse<any>>>this.restService.post(AAT_CUSTOMS_ENV.serviceBaseURL +
            AAT_CUSTOMS_ENV.fetchMangementDetails, request)
    }


}
