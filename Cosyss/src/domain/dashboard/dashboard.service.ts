
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request } from './../model/resp';
import { Environment, WH_ENV, EXP_ENV, RPT_ENV } from '../../environments/environment';
import { NgcCoreModule, BaseResponse, RestService, TrackRestCallProgress } from 'ngc-framework';
import { SlaDashboard, ResponseForMssDetails, SearchForMssDetails } from './dashboard.sharedmodel';


export const REFRESH_IN_MS: number = 15000;
@Injectable()
export class DashboardService {

    constructor(private restService: RestService) { }

    /**
     * Inbound
     */
    // @TrackRestCallProgress()
    public getInboundFlightInfo(request: SlaDashboard):
        Observable<BaseResponse<SlaDashboard>> {
        return <Observable<BaseResponse<SlaDashboard>>>
            this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.getInboundFlightInfo, request);
    }

    /**
     * Outbound
     */
    @TrackRestCallProgress()
    public getOutboundFlightInfo(request: SlaDashboard):
        Observable<BaseResponse<SlaDashboard>> {
        return <Observable<BaseResponse<SlaDashboard>>>
            this.restService.post(WH_ENV.serviceBaseURL + WH_ENV.getOutboundFlightInfo, request);
    }

    /**
   * Outbound
   */
    @TrackRestCallProgress()
    public getMssDashBoard(request: SearchForMssDetails):
        Observable<BaseResponse<ResponseForMssDetails>> {
        return <Observable<BaseResponse<ResponseForMssDetails>>>
            this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getMssDashboardDetail, request);
    }
    public getPAFlightDetails(request: any):
        Observable<BaseResponse<ResponseForMssDetails>> {
        return <Observable<BaseResponse<ResponseForMssDetails>>>
            this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getPAFlightDetails1, request);
    }
    @TrackRestCallProgress()
    public getMssFlightDetails(request: any):
        Observable<BaseResponse<ResponseForMssDetails>> {
        return <Observable<BaseResponse<ResponseForMssDetails>>>
            this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getMssFlightDetails, request);
    }
    @TrackRestCallProgress()
    public getMssFlightDetailsDnata(request: any):
        Observable<BaseResponse<ResponseForMssDetails>> {
        return <Observable<BaseResponse<ResponseForMssDetails>>>
            this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getMssFlightDetailsDnata, request);
    }
    // @TrackRestCallProgress()
    public getFlightDetailService(request: any):
        Observable<BaseResponse<ResponseForMssDetails>> {
        return <Observable<BaseResponse<ResponseForMssDetails>>>
            this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getFlightDetailsForMssDashboard, request);
    }
    // @TrackRestCallProgress()
    public getFlightDetailDNATAService(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>
            this.restService.post(EXP_ENV.serviceBaseURL + EXP_ENV.getFlightDetailDNATAService, request);
    }

    public getPerformanceReport(request: any):
        Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>
            this.restService.post(RPT_ENV.serviceBaseURL + RPT_ENV.reportURL, request);
    }
    @TrackRestCallProgress()
    public getLatestDboardRecExport(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.getLatestDboardRecExport, request);
    }
    @TrackRestCallProgress()
    public getSlaDashBoardTVExport(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.getSlaDashBoardTVExport, request);
    }
    @TrackRestCallProgress()
    public getSlaDashBoardTVImport(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL +
                WH_ENV.getSlaDashBoardTVImport, request);
    }


    @TrackRestCallProgress()
    public getFlightShipmentDetails(request) {
        return <Observable<BaseResponse<any>>>this.restService.post
            (WH_ENV.serviceBaseURL + WH_ENV.getDetailsFlightDashboard, request);
    }

}