import { BaseRequest, BaseResponseData, BaseBO } from "ngc-framework";

export class Flight extends BaseRequest {
  resourceStaffAllocatedFlightInfoId: any;
  flightOriginDate: any;
  aircraftRegistration: string;
  std: Date;
  etd: Date;
  status: string;
  flightKey: string;
  flightId: any;
  x: number;
}

export class Shift extends BaseRequest {
  resourceStaffShiftInfoId: any;
  shiftDate: any;
  shiftStart: any;
  shiftEnd: any;
  flights: Array<Flight>;
}

export class Staff extends BaseRequest {
  userProfileId: any;
  name: any;
  roleCode: any;
  staffId: any;
  shiftDate: any;
  shiftStart: any;
  shiftEnd: any;
  handlingArea: any;
  resourceStaffAllocatedFlightInfoId: any;
  resourceStaffShiftInfoId: any;
  from: any;
  to: any;
  flights: Array<Flight>;
}

export class StaffAssignment extends BaseRequest {
  staff: Array<Staff>;
}

export class StaffAssignmentFlight extends BaseRequest {
  fromDate: string;
  toDate: string;
  handlingArea: any;
  role: any;
  staff: any;
  flightKey: string;
  uploadDoc: any;
  staffList: any;
}

export class FlightAssignment extends BaseRequest {
  from: string;
  to: string;
  handlingArea: any;
  carrier: any;
  role1: string;
  role2: string;
  role3: string;
  type: any;
}

export class TimeLine {
  public displayTime: string;
  public changeDay: string;
  public time: Date;
}

export class StaffAgainstFlight {
  public flightId: any;
  public flightKey: any;
  public std: any;
  public ac: any;
  public fltClose: any;
  public dls: any;
  public dest: any;
  public bkgWt: any;
  public ttWt: any;
  public phc: any;
  public ecc: any;
  public remain: any;
  public noOf: any;
  public ali: any;
  public staffName1: any;
  public staffShift1: any;
  public staffName2: any;
  public staffShift2: any;
  public staffName3: any;
  public staffShift3: any;
  public role1: any;
  public role2: any;
  public role3: any;
}

export class FileUpload {
  public document: any;
  public documentType: string;
}