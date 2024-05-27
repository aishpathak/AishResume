
import {
    FlightEnroutements, FlightEnroutementRequestList,
    GenerateOperativeFlightsRQ, maintainFlightScheduleRQ, maintainFlightScheduleRS, SpiltDetailsscheduleComponent, FlightSchedules
} from './flight.sharedmodel';
import {
    GenerateOperativeFlightRQ, cancelOperativeFlight,
    createOperativeFlightRQ, createOperativeFlightRS
} from './flight.sharedmodel';
import {
    CodeShareFlightRequest, CodeShareFlightResponse, CodeShareFlightGroup,
    FlightEnroutementRequest, SpecialenroutementResponse,
    FlightEnroutementResponse, FlightRequest, FlightResponse,
    FlightScheduleRequest, FlightScheduleResponse, SpecialenroutementFlightGroup,
    Specialenroutement, SpecialenroutementRequest,
    DisplayOperativeRequest, DisplayOperativeResponse, SpecialenroutementRequestList,
    CopyDetailsscheduleComponent
} from './flight.sharedmodel';
import {
    detailsScheduleRequest, detailsScheduleResponse, UfisFlight,
    UfisFlightRequest, UfisFlightGroup, UfisFlightResponse, FindSchedule
} from './flight.sharedmodel';
import { EAcceptanceSearchResultBO } from './../playground/playground.shared';
import {
    NgcCoreModule, BaseResponseData, BaseResponse,
    BaseService, RestService, BaseRequest, TrackRestCallProgress
} from 'ngc-framework';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


// Environment/Configuration
import { FLT_ENV } from '../../environments/environment';


@Injectable()
export class FlightService extends BaseService {
    /**
         * Initialize
         *
         * @param restService Rest Service
         */
    public previousURL: string;
    public currentURL: string;
    public responseDisplayScheduleScreenOnSearch: any;

    public carrierCodeLastEnteredForInNormalScreen: string;
    public destinationLastEnteredForInNormalScreen: string;
    public normalScreenSearchResponse: any

    public carrierLastEnteredForInSpecialScreen: string;
    public specialScreenSearchResponse: any
    constructor(private restService: RestService) {
        super();
    }

    /**
     * Gets AWB List
     *
     * @param serverBaseURL Server Base URL (Optional)
     */
    @TrackRestCallProgress()
    public getFlightDetails(request: FlightRequest): Observable<BaseResponse<FlightResponse>> {
        return <Observable<BaseResponse<FlightResponse>>>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.flightDetailsBaseURl, request);
    }



    @TrackRestCallProgress()
    public saveFlightDetails(request: FlightRequest): Observable<BaseResponse<FlightResponse>> {
        // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        console.log(FlightRequest);
        return <Observable<BaseResponse<FlightResponse>>>this.restService.post(FLT_ENV.serviceBaseURL +
            FLT_ENV.saveFlightDetails, request);
    }

    @TrackRestCallProgress()
    getFlightSchedules(data: FindSchedule) {
        return this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.getFlightSchedules, data);
    }

    @TrackRestCallProgress()
    getGeneratedOperativeFlight(data: GenerateOperativeFlightRQ): Observable<GenerateOperativeFlightsRQ> {
        // let x:{} = data;
        // http://localhost:8080/flight/api/flight/schedule/generateoperativeflight

        return <Observable<GenerateOperativeFlightsRQ>>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.generateOperativeFlights, data);
    }


    //display schedule and operative
    @TrackRestCallProgress()
    getGeneratedOperativeScheduleFlight(data: GenerateOperativeFlightRQ): Observable<GenerateOperativeFlightsRQ> {
        // let x:{} = data;
        // http://localhost:8080/flight/api/flight/schedule/generateoperativeflight

        return <Observable<GenerateOperativeFlightsRQ>>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.getGeneratedOperativeScheduleFlight, data);
    }

    @TrackRestCallProgress()
    public cancelFlightDetails(request: FlightRequest): Observable<BaseResponse<FlightResponse>> {
        // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        return <Observable<BaseResponse<FlightResponse>>>this.restService.post(FLT_ENV.serviceBaseURL
            + FLT_ENV.cancelFlightDetails, request);
    }

    @TrackRestCallProgress()
    public restoreFlightDetails(request: FlightRequest): Observable<BaseResponse<FlightResponse>> {
        // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        return <Observable<BaseResponse<FlightResponse>>>this.restService.post(FLT_ENV.serviceBaseURL
            + FLT_ENV.restoreFlightDetails, request);
    }

    @TrackRestCallProgress()
    public deleteFlightDetail(request: FlightRequest): Observable<BaseResponse<FlightResponse>> {
        // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        return <Observable<BaseResponse<FlightResponse>>>this.restService.post(FLT_ENV.serviceBaseURL
            + FLT_ENV.deleteFlightDetails, request);
    }

    @TrackRestCallProgress()
    public updateFlightDetails(request: FlightRequest): Observable<BaseResponse<FlightResponse>> {
        console.log(JSON.stringify(request));
        // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        return <Observable<BaseResponse<FlightResponse>>>this.restService.post(FLT_ENV.serviceBaseURL
            + FLT_ENV.updateFlightDetails, request);
    }

    @TrackRestCallProgress()
    public getEnroutementDetails(request: FlightEnroutementRequest):
        Observable<BaseResponse<FlightEnroutementResponse>> {
        // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        return <Observable<BaseResponse<FlightEnroutementResponse>>>this.
            restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.outgoingEnroutementBaseURL,
                request);
    }

    @TrackRestCallProgress()
    public getCodeShareFlights(request: CodeShareFlightRequest) {
        return <Observable<BaseResponse<CodeShareFlightResponse>>>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.getCodeShareFlights, request);
    }

    @TrackRestCallProgress()
    public maintainCodeShareFlight(request: CodeShareFlightGroup) {
        return <Observable<BaseResponse<CodeShareFlightResponse>>>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.maintainCodeShareFlight, request);
    }

    @TrackRestCallProgress()
    public deleteCodeShareFlight(request: CodeShareFlightGroup) {
        return <Observable<BaseResponse<CodeShareFlightResponse>>>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.deleteCodeShareFlight, request);
    }

    @TrackRestCallProgress()
    public getScheduleDetails(request: FlightScheduleRequest): Observable<BaseResponse<FlightScheduleResponse>> {
        return <Observable<BaseResponse<FlightScheduleResponse>>>this.restService
            .post(FLT_ENV.serviceBaseURL + FLT_ENV.getScheduleDetails, request);
    }

    @TrackRestCallProgress()
    public getOperativeFlights(request: DisplayOperativeRequest): Observable<BaseResponse<DisplayOperativeResponse>> {
        // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        return <Observable<BaseResponse<DisplayOperativeResponse>>>this.restService
            .post(FLT_ENV.serviceBaseURL + FLT_ENV.getOperativeFlights, request);
    }

    /* public loadSplEnroutement(request): Observable<BaseResponse<FlightEnroutements>> {
          //let baseURL = !serverBaseURL ? "/" : serverBaseURL;
          return <Observable<BaseResponse<FlightEnroutements>>>this.restService
          .get(FLT_ENV.serviceBaseURL+FLT_ENV.loadSplEnroutement, request);
      }*/


    @TrackRestCallProgress()
    public saveSplEnroutement(request: FlightEnroutementRequestList): Observable<BaseResponse<FlightEnroutements>> {
        //     //let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        return <Observable<BaseResponse<FlightEnroutements>>>this.restService
            .post(FLT_ENV.serviceBaseURL + FLT_ENV.saveSplEnroutement, request);
    }

    @TrackRestCallProgress()
    public getDetailsSchedule(request: FindSchedule): Observable<any> {
        return <Observable<any>>this.
            restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.findFlightSchedule, request);
    }
    //for copy function
    @TrackRestCallProgress()
    public getCopyDetailsSchedule(request: CopyDetailsscheduleComponent): Observable<any> {
        return <Observable<any>>this.
            restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.copyFlightSchedule, request);
    }

    //for spilt function
    @TrackRestCallProgress()
    public spiltSchedule(request: SpiltDetailsscheduleComponent): Observable<any> {
        return <Observable<any>>this.
            restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.spiltFlightSchedule, request);
    }

    @TrackRestCallProgress()
    public fetchFlightSchedules(request: FlightSchedules): Observable<any> {
        return <Observable<any>>this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.fetchFlightSchedules, request);
    }

    @TrackRestCallProgress()
    public saveDetailsSchedule(request: maintainFlightScheduleRQ): Observable<maintainFlightScheduleRS> {
        return <Observable<maintainFlightScheduleRS>>this.
            restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.maintainFlightSchedule, request);
    }

    @TrackRestCallProgress()
    public cancelOperativeFlight(request: cancelOperativeFlight): Observable<BaseResponse<DisplayOperativeResponse>> {
        // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        return <Observable<BaseResponse<DisplayOperativeResponse>>>this.restService
            .post(FLT_ENV.serviceBaseURL + FLT_ENV.cancelOperativeFlights, request);
    }
    @TrackRestCallProgress()
    public closeForBooking(request: FlightRequest): Observable<BaseResponse<DisplayOperativeResponse>> {
        // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        return <Observable<BaseResponse<DisplayOperativeResponse>>>this.restService
            .post(FLT_ENV.serviceBaseURL + FLT_ENV.closeFlightBooking, request);
    }

    @TrackRestCallProgress()
    public openForBooking(request: FlightRequest): Observable<BaseResponse<DisplayOperativeResponse>> {
        // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        return <Observable<BaseResponse<DisplayOperativeResponse>>>this.restService
            .post(FLT_ENV.serviceBaseURL + FLT_ENV.openFlightBooking, request);
    }

    @TrackRestCallProgress()
    public createOperativeFlight(request: createOperativeFlightRQ): Observable<createOperativeFlightRS> {

        return <Observable<createOperativeFlightRS>>this.restService.
            post(FLT_ENV.serviceBaseURL + FLT_ENV.createOperativeFlights, request);
    }

    @TrackRestCallProgress()
    public deleteFlightFact(request: cancelOperativeFlight): Observable<BaseResponse<DisplayOperativeResponse>> {
        // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        return <Observable<BaseResponse<DisplayOperativeResponse>>>this.restService
            .post(FLT_ENV.serviceBaseURL + FLT_ENV.deleteFlightFact, request);
    }

    @TrackRestCallProgress()
    public deleteFlightLeg(request: cancelOperativeFlight): Observable<BaseResponse<DisplayOperativeResponse>> {
        // let baseURL = !serverBaseURL ? "/" : serverBaseURL;
        return <Observable<BaseResponse<DisplayOperativeResponse>>>this.restService
            .post(FLT_ENV.serviceBaseURL + FLT_ENV.deleteFlightLeg, request);
    }

    @TrackRestCallProgress()
    public maintainFlightSchedule(request: maintainFlightScheduleRQ): Observable<maintainFlightScheduleRS> {
        return <Observable<maintainFlightScheduleRS>>this.restService
            .post(FLT_ENV.serviceBaseURL + FLT_ENV.maintainFlightSchedule, request);
    }

    @TrackRestCallProgress()
    public deleteSplEnroutement(request: any):
        Observable<BaseResponse<Specialenroutement>> {
        return <Observable<BaseResponse<Specialenroutement>>>this.restService
            .post(FLT_ENV.serviceBaseURL + FLT_ENV.deleteSplEnroutement, request);
    }

    @TrackRestCallProgress()
    public getSplEnroutementFlights(request: SpecialenroutementRequest):
        Observable<BaseResponse<SpecialenroutementResponse>> {
        return <Observable<BaseResponse<SpecialenroutementResponse>>>this.restService
            .post(FLT_ENV.serviceBaseURL + FLT_ENV.loadSplEnroutement, request);
    }

    @TrackRestCallProgress()
    public updateSplEnroutementFlight(request: SpecialenroutementRequest):
        Observable<BaseResponse<SpecialenroutementResponse>> {
        return <Observable<BaseResponse<SpecialenroutementResponse>>>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.updateSplEnroutement, request);
    }

    @TrackRestCallProgress()
    public saveSplEnroutementFlight(request: SpecialenroutementRequest):
        Observable<BaseResponse<SpecialenroutementResponse>> {
        return <Observable<BaseResponse<SpecialenroutementResponse>>>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.saveSplEnroutement, request);
    }

    @TrackRestCallProgress()
    public deleteSplEnroutementFlight(request: SpecialenroutementRequestList):
        Observable<BaseResponse<SpecialenroutementResponse>> {
        return <Observable<BaseResponse<SpecialenroutementResponse>>>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.deleteSplEnroutement, request);
    }

    @TrackRestCallProgress()
    public getUfisFlights(request: UfisFlightRequest) {
        return <Observable<BaseResponse<UfisFlightResponse>>>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.getUfisFlights, request);
    }

    @TrackRestCallProgress()
    public updateUfisFlight(request: UfisFlight) {
        return <Observable<BaseResponse<CodeShareFlightResponse>>>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.updateUfisFlight, request);
    }

    @TrackRestCallProgress()
    public createUfisFlight(request: UfisFlight) {
        return <Observable<BaseResponse<CodeShareFlightResponse>>>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.createUfisFlight, request);
    }

    @TrackRestCallProgress()
    public deleteUfisFlight(request: UfisFlightGroup) {
        return <Observable<BaseResponse<UfisFlightResponse>>>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.deleteUfisFlight, request);
    }

    @TrackRestCallProgress()
    public searchCANReport(request: any): any {
        return <any>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.searchCANReportlist, request);
    }

    @TrackRestCallProgress()
    public insertCANDetails(request: any): any {
        return <any>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.insertCANDetails, request);
    }

    @TrackRestCallProgress()
    public serviceprovidedCANdata(request: any): any {
        return <any>
            this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.serviceprovidedCANdata, request);
    }

    // @TrackRestCallProgress()
    // public serviceprovidedcreateadata(request: any): any {
    //   return <any>
    //     this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.serviceprovidedcreateadata, request);
    // }

    @TrackRestCallProgress()
    public getFlightHistoryDetails(request): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.flightHistory, request);
    }

    @TrackRestCallProgress()
    public onCANServiceReportgeneration(request): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.sendCANReport, request);
    }
    //getsenderdetails
    @TrackRestCallProgress()
    public getsenderdetails(request): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.getsenderdetails, request);
    }

    @TrackRestCallProgress()
    public getflightdetails(request): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.getflightdetails, request);
    }

    @TrackRestCallProgress()
    public getHandlerbyCarrier(request): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.getHandlerbyCarrier, request);
    }

    @TrackRestCallProgress()
    public getFlightDetailsForWeather(request): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.fetchFlightDetailsForWeather, request);
    }
    @TrackRestCallProgress()
    public updateWeatherCondition(request): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.updateWeatherCondition, request);
    }

    @TrackRestCallProgress()
    public fetchDefaultBuBdOfficeDetails(request): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.fetchDefaultBuBdOfficeDetails, request);
    }

    @TrackRestCallProgress()
    public fetchExistingScheduleForFlight(request): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.fetchExistingScheduleForFlight, request);
    }

    @TrackRestCallProgress()
    public generateCustomFlightNumber(request: any): Observable<BaseResponse<any>> {
        return <Observable<BaseResponse<any>>>this.restService.post(FLT_ENV.serviceBaseURL + FLT_ENV.generateCustomFlight, request);
    }

}
