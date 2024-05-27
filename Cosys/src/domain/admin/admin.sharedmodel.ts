import { ScheduleService } from "./../flight/schedule/schedule.service";
import { OperativeFlight } from "./../flight/flight.sharedmodel";
import {
  BaseService,
  RestService,
  BaseRequest,
  BaseResponseData
} from "ngc-framework";
import { Binary } from 'selenium-webdriver/firefox';
import { ExportEmailAddressComponent } from './customer/exportEmailAddress/exportEmailAddress.component';
import { FlightPouchResponse } from "../export/documenthandling/flightpouch/flightpouch.shared";
export class User extends BaseRequest {
  activeFlag: boolean;
  cosysLoginFlag: boolean;
  customer: {
    id: number;
    name: String;
  };
  departmentCode: String;
  emailId: String;
  encryptPassword: String;
  graceLoginUsed: number;
  gradeCode: String;
  initialCode: string;
  loginCode: string;
  passportOrFinDescription: String;
  phoneNumber: number;
  profileId: number;
  shortName: string;
  staffIdNumber: string;
  userRoleAssignments: AssignedRole[];
  userType: string;
  win2kCode: String;
}

export class UserSearchRequest extends BaseRequest {
  staffIdNumber: number;
  profileId: number;
  loginCode: string;
  departmentCode: string;
  companyCode: string;
  userType: string;
  roleCode: string;
  roleCategory: string;
  initialCode: string;
  encryptPassword: string;
  shortName: string;
  screenName: any;
  description: any;
}

export class AssignedRole {
  applicationRoleCode: ApplicationRoleCode;
  customerId: number;
  userRoleEndDate: string;
  userRoleStartDate: string;
  profileId: number;
  role: Role;
}

export class Company extends BaseRequest {
  code: string;
  name: string;
}

export class ApplicationRoleCode {
  code: string;
}

export class Role extends BaseRequest {
  code: string;
  role_category: string;
}

export class UserResponse extends BaseResponseData {
  public userResponse: Array<User>;
}

export class CompanyResponse extends BaseResponseData {
  public company: Array<Company>;
}

export class RoleResponse extends BaseResponseData {
  public role: Array<Role>;
}

//Create Role request and response starts here
export class CreateRoleResponse extends BaseResponseData {
  public createRole: RoleBO;
}

export class RoleBO extends BaseRequest {
  code: string;
  duties: string;
  roleCategory: string;
  applicationAccess: string;
  description: string;
  screenName: string;
  subModules: Array<SubModule>;
}

export class RoleResponseBO extends BaseRequest {
  code: string;
  duties: string;
  roleCategory: string;
  description: string;
}

export class RoleListResponse extends BaseResponseData {
  roleList: Array<RoleResponseBO>;
}

export class FunctionRQ {
  public functionName: string;
  public read: boolean;
  public readWrite: boolean;
}

export class SubModule {
  public moduleCode: string;
  public roleCode: string;
  public subModuleCode: string;
  public description: string;
  public displayFlag: number;
  public updateFlag: number;
  public readBoolean: boolean;
  public writeBoolean: boolean;
  public flagDelete: string;
  public flagUpdate: string;
  public flagInsert: string;
  public flagCRUD: string;
  public moduleFlag: boolean;
  public functionsRequired: string;
  public read: boolean;
  public readWrite: boolean;
}



export class ScreenAssignment {
  public subModule: boolean;
  public screenCode: string;
  public roleCode: string;
  public screenCodeDescription: string;
  public displayFlag: number;
  public updateFlag: number;
  public existing: number;
  public moduleCode: string;
  public subModuleCode: string;
  public subModuleCodeDescription: string;
  public isSubFunctionexist: boolean;
  public moduleCodeDescription: string;
}

export class CreateRoleRequest extends BaseRequest {
  code: string;
  duties: string;
  roleCategory: string;
  applicationAccess: string;
  subModules: Array<SubModule>;
  // endDate: string;
}

export class UpdateRoleResponse extends BaseResponseData {
  public updatedRole: RoleBO;
}

export class UpdateRoleRequest extends BaseRequest {
  code: string;
  duties: string;
  roleCategory: string;
  applicationAccess: string;
  moduleFlag: boolean;
  subModules: Array<SubModule>;
  // endDate: string;
}

export class DeleteRoleRequest extends BaseRequest {
  code: string;
  applicationAccess: string;
}

export class DeleteRoleResponse extends BaseResponseData {
  public deleteRole: RoleBO;
}

export class CreateRoleSearchResponse extends BaseResponseData {
  public CreateRoleSearch: Array<CreateRoleSearchResponse>;
}

export class CreateRoleSearchRequest extends BaseRequest {
  public CreateRoleSearch: string;
}

export class AssignRoleFunctionRequest extends BaseRequest {
  roleCode: string;
  moduleCodeDescription: string;
  parameter1: string;
  applicationId: string;
  moduleCodeDescriptions: any[];
}

export class AssignRoleFunctionResponse extends BaseResponseData {
  flightEnroutList: Array<ScreenAssignment>;
}

export class DeleteSubModuleRequest extends BaseRequest {
  code: string;
  applicationAccess: string;
  subModules: Array<SubModule>;
}

export class CreateScreenFunctionRequest extends BaseRequest {
  public roleCode: string;
  public screenCode: string;
  public screenFunctionCode: string;
  public screenAssignedFlag: number;
  public moduleCode: string;
  public screenCodeDescription: string;
}

export class CreateScreenFunctionResponse extends BaseResponseData {
  flightEnroutList: Array<CreateScreenFunctionRequest>;
}

export class UpdateScreenAssignmentRequest extends BaseRequest {
  public updateRequestArray: Array<CreateScreenFunctionRequest>;
}

export class SaveScreenAssignmentRequest extends BaseRequest {
  public subModuleCodeDescription: string;
  public screenAssignments: Array<CreateScreenFunctionRequest>;
}

export class SearchCustomerMaster extends BaseRequest {
  public customerID: number;
  public customerCode: string;
  public customerShortName: string;
  public iataAgentCode: string;
  public uenNumber: string;
  public adminLoginCode: string;
  public deRegisterDate: string;
  public chaNumber: any;
  public chaNumberExpiry: any;
  public panNumber: any;

}

export class AddCustomerMaster extends BaseRequest {
  public customerID: number;
  public transactionSequenceNumber: number;
  public customerCode: string;
  public customerName: string;
  public formallyKnownAs: string;
  public correspondenceAddress1: string;
  public correspondenceAddress2: string;
  public correspondencePlace: string;
  public correspondenceStateCode: string;
  public correspondencePostalCode: string;
  public correspondenceCityCode: string;
  public correspondenceCountryCode: string;
  public sameAsCustomerFlag: number;
  public billingAddress1: string;
  public billingAddress2: string;
  public billingPlace: string;
  public billingStateCode: string;
  public billingPostalCode: string;
  public billingCityCode: string;
  public billingCountryCode: string;
  public accountNumber: string;
  public bookingQuotaDays: number;
  public carrierCode: string;
  public carrierGroup: string;
  public uenNumber: string;
  public deRegisterDate: string;
  public importAuthorizationFlagValue: number;
  public iAExpiryDate: string;
  public containerFreightStation: string;
  public containerFreightStationValue: number;
  public cassCode: number;
  public amsCustomsNumber: string;
  public iataAgentCode: string;
  public customerCodeChangeReason: string;
  public blacklistReasonCode: string;
  public blackListIndicator: boolean;
  public administratorName: string;
  public administratorUserProfileID: number;
  public designation: string;
  public notificationEmailId: string;
  public customerTypeList: string[];
  public pimaCustomerAddress: string[];
  public pimaCustomerAddressValue: string;
  public contactDetails: CustomerContactDetailsMaster[];
  public loginIdWeb: string;
  public contactList: any[];
}
export class CustomerContactDetailsMaster extends BaseRequest {
  public contactType: string;
  public contactDetails: string;
  public isPrimaryContact: boolean;
}
// model for blacklisting customer and authorized personnel
export class SearchRequestBlackList extends BaseRequest {
  customerCode: string;
  authorizedPersonnelName: string;
}

// model for blacklisting customer and authorized personnel
export class AssociatedAirlinesForCustomer extends BaseRequest {
  associatedAirlines: string;
  // associatedAirlinesList:any;
  customerId: number;
}

// model for blacklisting customer and authorized personnel
export class SearchResponseBlackList extends BaseRequest {
  associatedAirlinesList: any;
  authorizedPersonnelName: string;
  airportPassNumber: string;
  icfin_id: string;
  custAuthPer_Id: number;
  customerCode: string;
  customerName: string;
  customerId: number;
  blackListStartDate: string;
  blackListEndDate: string;
  blackListRequestedBy: string;
  blackListReason: string;
  blackListPurpose: string;
  effectiveDate: Date;
  lastShipmentAssignment: string;
  lastUpdated: string;
}

export class RegistrationRequest extends BaseRequest {
  applicationReferenceNo: string;
  requestStatus: string;
  applicationDateFrom: string;
  applicationDateTo: string;
}

export class RcarNumber extends BaseRequest {
  customerId: number;
  customerCode: string;
  customerName: string;
  iataAgentCode: string;
  rcarStatus: string;
  startDate: string;
  endDate: string;
  customerRCARAgentGroupId: number;
  rcarNumberDetails: Array<RcarNumberDetails>;
}

export class RcarAgentGroup extends BaseRequest {
  groupCode: string;
  description: string;
  customerRCARAgentGroupId: number;
  statusCode: Array<string>;
  // customerTypeList: string[];
  rcarAgentGroupDetails: Array<RcarAgentGroupDetails>;
}

export class RegistrationRequestListResponse extends BaseRequest {
  applicationReferenceNo: string;
  customerCode: string;
  customerName: string;
  formallyKnownAs: string;
  uenNumber: string;
  customerCodeChoice1: string;
  customerCodeChoice2: string;
  importAuthorizationFlagValue: string;
  iaexpiryDate: string;
  iataAgentCode: string;
  registrationDate: string;
  requestStatus: string;
  requestProcessedDate: string;
  correspondenceAddress1: string;
  correspondenceAddress2: string;
  correspondenceCountryCode: string;
  correspondenceCityCode: string;
  correspondenceStateCode: string;
  correspondencePlace: string;
  correspondencePostalCode: string;
  correspondenceTelephoneNo: string;
  correspondenceFaxNo: string;
  billingAddress1: string;
  billingAddress2: string;
  billingCountryCode: string;
  billingCityCode: string;
  billingStateCode: string;
  billingPlace: string;
  billingPostalCode: string;
  sameAsCustomerFlag: number;
  administratorName: string;
  designation: string;
  notificationEmailId: string;
  oldCustomerCode: string;
  oldCustomerName: string;
  loginId: string;
  deRegisterDate: string;
  customerTypeList: string[];
  customerTypeListApproved: string[];
  roleCode: string;
  roleDesc: string;
  reasonForRejection: string;
  customerCodeFinal: string;
  existingCustomerFlag: boolean;
  customerType: string;
  companyRegistrationRequestID: number;
  applicationDateFrom: string;
  applicationDateTo: string;
  customerID: number;
  electronicInvoice: boolean;
  administrativeOfficeAddress: string;
  administrativeOfficePlace: string;
  administrativeOfficePostalCode: string;
  administrativeOfficeCityCode: string;
  administrativeOfficeCountryCode: string;
  administrativeOfficeStateCode: string;
  administrativeOfficeTelephoneNo: string;
  administrativeOfficeFaxNo: string;
}

export class RcarNumberDetails extends BaseRequest {
  customerId: number;
  customerCode: string;
  customerName: string;
  rcarStatus: string;
  rcarNumber: string;
  startDate: string;
  endDate: string;
  lastUpdatedBy: string;
  lastUpdatedOn: string;
}

export class RcarAgentGroupDetails extends BaseRequest {
  groupCode: string;
  description: string;
  customerRcarAgentGroupId: number;
  statusCode: string;
  lastUpdatedBy: string;
  lastUpdatedOn: string;
  scInd: Binary;
}

export class AddRcarNumber extends BaseRequest {
  customerId: number;
  customerCode: string;
  customerName: string;
  rcarStatus: string;
  rcarNumber: string;
  startDate: string;
  endDate: string;
  customerUpdateCode: string;
  customerUpdateName: string;
  rcarUpdateStatus: string;
  rcarUpdateNumber: string;
  startUpdateDate: string;
  endUpdateDate: string;
}

export class AddRcarAgentGroup extends BaseRequest {
  groupCode: string;
  description: string;
  customerRCARAgentGroupId: number;
  statusCode: Array<string>;

  // customerTypeList: string[];
}


export class UpdateRcarNumber extends BaseRequest {
  customerId: number;
  customerCode: string;
  customerName: string;
  rcarUpdateStatus: string;
  rcarNumber: string;
  startUpdateDate: string;
  endUpdateDate: string;
}
export class UpdateRcarAgentGroup extends BaseRequest {
  groupUpdateCode: string;
  updateDescription: string;
  customerRCARAgentGroupId: number;
  statusUpdateCode: Array<string>;
}

export class CustomerCode extends BaseRequest {
  public customerCod: string;
}

export class ChangeOfCode extends BaseRequest {
  public customerCode: string;
  public customerName: string;
  public loginID: string;
  public newCustomerCode: string;
  public newCustomerName: string;
  public newLoginID: string;
  public reason: string;
  public deRegisterFlag: boolean;
  public deregister: number;
  public agentCustomerRelatedAgents: Array<string>;
  public awbRelatedToCustomer: Array<string>;
  public relatedSubUsers: Array<string>;
}

export class ShipmentTrack extends BaseRequest {
  public shipmentID: string;
}

export class AuthorizedPersonnelSearchRequest extends BaseRequest {
  contractorName: string;
  companyCode: string;
  authorizedPersonnelName: string;
  authorizedPersonnelNumber: string;
  airportPassNumber: string;
  companyName: string;
  contractorCode: string;
  id: string;
  authorizationLetterDate: any;
  expiryDate: any;
  authorizationLetterReference: any;
  otherCompanyFlag: any
  customerAuthorizePersonnelList: Array<CustomerAuthorizePersonnelList> = new Array<CustomerAuthorizePersonnelList>();


}


export class AuthorizedPersonnelSerachResponse extends BaseRequest {
  customerId: string;
  authorizedPersonnelName: string;
  authorizedPersonnelNumber: string;
  airportPassNumber: string;
  airportPassValidityDate: string;
  effectiveDate: string;
  digitalSignature: Binary;
  purpose: string;
  allowClearVALCargo: boolean;
  haffaChopFlag: boolean;
  contractorId: string;
  constructorName: string;
  transactionSequenceNo: string;
  customerAuthPersonnelID: string;
  otherCompanyFlag: any;
  customerAuthorizePersonnelList: Array<CustomerAuthorizePersonnelList> = new Array<CustomerAuthorizePersonnelList>();
}
export class CustomerAuthorizePersonnelList extends BaseRequest {
  companyCode: any;
  companyName: any;
  authorizedPersonnelName: any;
  airportPassNumber: string;
  authorizedPersonnelNumber: string;
  authorizedPersonList: Array<AuthorizedPersonModel>;
}

export class AuthorizedPersonModel extends BaseRequest {
  authorizedPersonnelNumber: string;
  authorizedPassNumber: string;
  authorizedPersonnelName: string;
  customerId: any;
  customerShortName: string;
  contractorCompanyName: string;
  authorizedSignature: string;
  customerCode: string;
  blackListFlag: boolean;
  validationExpiredFlag: boolean;
}

export class AuthorizedPersonnel extends BaseRequest {
  authorizedPersonnelName: string;
  authorizedPersonnelNumber: string;
  airportPassNumber: string;
  airportPassValidityDate: string;
  digitalSignature: Binary;
  purpose: string;
  allowClearVALCargo: boolean;
  haffaChopFlag: boolean;
  contractorId: string;
  constructorName: string;
  companyCode: string;
  transactionSequenceNo: string;
  customerAuthPersonnelID: string;
  customerCode: string;

}
export class AuthorizedPersonnelUpdateInsertRequest extends BaseRequest {
  insertUpdateAuthorizedPersonnelRQ: AuthorizedPersonnel[];
}

export class CustomerAuthrizedPersonnelBlacklistModel extends BaseRequest {
  blackListErrorMessageContact: string;
  customerAuthList: Array<AuthorizedPersonnelUpdateInsertResponse>;
  blackListWarningMessage: Array<Array<string>>;
}

export class AuthorizedPersonnelUpdateInsertResponse extends BaseRequest {
  customerId: string;
  authorizedPersonnelName: string;
  authorizedPersonnelNumber: string;
  airportPassNumber: string;
  airportPassValidityDate: string;
  effectiveDate: string;
  digitalSignature: Binary;
  purpose: string;
  allowClearVALCargo: boolean;
  haffaChopFlag: boolean;
  contractorId: string;
  constructorName: string;
  contractor: string;
  companyCode: string;
  transactionSequenceNo: string;
  customerAuthPersonnelID: string;
}


export class CustomerList extends BaseRequest {
  customerId: number;
  appointee: string;
  customerCode: string;
  customerName: string;
  uenNumber: string;
  effectiveDate: Date;
  expiryDate: Date;
  deRegisterDate: Date;
  lastShipmentAssignment: Date;
  appointedAgentName: string;
  appointedAgentCode: string;
  reason: string;
}

export class SearchCustomerList extends BaseRequest {
  appointee: string;
  customerCode: string;
  customerName: string;
  customerId: number;
  deRegisterDate: Date;
  appointedAgentCode: string;
  appointedAgentName: string;
  reason: string;
}

export class TransferCustomer extends BaseRequest {
  appointedAgentId: string;
  customerId: number;
  sequenceId: number;
  createdBy: string;
  createdOn: Date;
  reason: string;
}

export class SearchCustomer extends BaseRequest {

  public customerType: Array<string>;
  public customerStatus: string;
  public offsetValue: Number;
  public currentPageIndexNo: Number;
  public iaHolderFilter: string;
  public blackListFilter: string;
  public activeFilter: string;
}

export class CustomerListDetail extends BaseRequest {
  public customerId: string;
  public customerCode: string;
  public customerName: string;
  public uenNumber: string;
  public deRegisterDate: Date;
  public startDate: Date;
  public endDate: Date;
  public lastShipmentAssignment: Date;
  public lastUpdated: Date;
  public totalCustomers: string;
  public iaHolder: string;
  public blacklistIndicator: string;
  public active: string;
}


export class MaintainAgentLocation extends BaseRequest {
  public customerCode: string;
  public customerName: string;
  public deliveryLocation: string;
  public locId: string;
}

export class AppointedAgent extends BaseRequest {
  // public appointedAgents: AppointedAgent[];
  public customerCode: string;
  public customerName: string;
  public agentName: string;
  public agentCode: string;
  public delegationAgreementType: string;
  public effectiveDate: string;
  public expiryDate: string;
  public remarksFromSystem: string;
  public letterSignedByName: string;
  public letterSignedByDesignation: string;
  public dateOfLetter: string;
  public dateOfLetterRecieved: string;
  public remarks: string;
  public softDeleteFlag: boolean;
}

export class SearchTeam extends BaseRequest {
  public shiftStartsAt: string;
  public shiftEndsAt: string;
  public teamName: string
}

export class TeamCreation extends BaseRequest {
  public teamName: string;
  public shiftStartsAt: string;
  public shiftEndsAt: string;
  public repeatUntill: string;
  public staff: string;
  public role: string;
  public name: string;
  public userProfileId: number;
  public comTeamAuthorizedToChangeId: number;
  public comTeamMembersId: number;
  public authorizeToChangeName: any;
  public staffrole: any;
  public comTeamId: number;

}

export class ExportEmailAddress extends BaseRequest {
  public contacttype: string;
  public for: string;
}

export class VehiclePermitServiceRequest extends BaseRequest {
  select: boolean;
  vehiclePermitAuthorizationID: any;
  status: any;
  requestNo: any;
  type: any;
  agentCode: any;
  shipmentNumber: any;
  pieces: any;
  weight: any;
  purpose: any;
  email: String;
  handlingTerminal: String;
  fromDate: any;
  toDate: any;
  createdOn: any;
  termsaccept: boolean;
  requestDate: any;
  from: any;
  to: any;
  registrationNumbersList: Array<string>;
  registrationNumbers: string;
  reasonForRejection: string;
  fromDateTime: any;
  toDateTime: any;
}

export class CopyUserDetails extends BaseRequest {
  copyUserStaffNoFrom: string;
  copyUserLoginIDFrom: string;
  copyUserStaffNoTo: string;
  copyUserLoginIDTo: string;
}

export class SearchLucDetails extends BaseRequest {

  carrierCode: string;
  groupCarrier: number;
  customerId: number

}
