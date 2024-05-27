import { log } from "util";
import {
  BaseResponse,
  RestService,
  BaseService,
  BaseRequest,
  TrackRestCallProgress
} from "ngc-framework";
import { Observable } from "rxjs";
import {
  StaffAssignment,
  Flight,
  Staff,
  FlightAssignment
} from "./resource.sharedmodel";
import { Injectable } from "@angular/core";

// EXP_ENV/Configuration
import {
  EXP_ENV,
  AWB_ENV,
  EXPBU_ENV,
  CFG_ENV,
  WH_ENV
} from "../../environments/environment";

@Injectable()
export class ResourceService extends BaseService {
  constructor(private restService: RestService) {
    super();
  }

  @TrackRestCallProgress()
  public searchStaffAssignment(request: Staff): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      WH_ENV.serviceBaseURL + WH_ENV.fetchStaffAssignment,
      request
    );
  }

  @TrackRestCallProgress()
  public getFlightDate(request: Flight): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      WH_ENV.serviceBaseURL + WH_ENV.fetchFlightDate,
      request
    );
  }

  @TrackRestCallProgress()
  public saveStaffAllocation(request: Staff): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      WH_ENV.serviceBaseURL + WH_ENV.saveStaffAllocation,
      request
    );
  }

  @TrackRestCallProgress()
  public saveStaffAssignment(request: Staff): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      WH_ENV.serviceBaseURL + WH_ENV.saveStaffAssignment,
      request
    );
  }

  @TrackRestCallProgress()
  public deleteStaff(request: Flight): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      WH_ENV.serviceBaseURL + WH_ENV.deleteStaffAllocation,
      request
    );
  }

  @TrackRestCallProgress()
  public searchFlightAssignment(
    request: FlightAssignment
  ): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      WH_ENV.serviceBaseURL + WH_ENV.fetchFlightAssignment,
      request
    );
  }

  @TrackRestCallProgress()
  public uploadRoster(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post(
      WH_ENV.serviceBaseURL + WH_ENV.uploadRoster,
      request
    );
  }
}
