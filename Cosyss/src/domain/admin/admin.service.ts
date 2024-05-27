import {
  User, UserSearchRequest, UserResponse, Company,
  CompanyResponse, Role, RoleResponse, RoleBO, RoleListResponse, SearchCustomerList,
  CustomerList, SearchCustomer, CustomerListDetail, VehiclePermitServiceRequest, CopyUserDetails, CustomerAuthorizePersonnelList
} from './admin.sharedmodel';
import { NgcCoreModule } from 'ngc-framework';
import { Injectable } from '@angular/core';
import { Observable, ObservableLike } from 'rxjs';
import { BaseService, RestService, BaseRequest, BaseResponse, TrackRestCallProgress } from 'ngc-framework';
// ADM_ENV/Configuration
import { ADM_ENV } from '../../environments/environment';
// Create Role Admin
import {
  CreateRoleRequest, CreateRoleResponse, UpdateRoleRequest, UpdateRoleResponse,
  CreateRoleSearchRequest, CreateRoleSearchResponse,
  RoleResponseBO, DeleteRoleRequest, DeleteRoleResponse, AssignRoleFunctionResponse,
  AssignRoleFunctionRequest, DeleteSubModuleRequest,
  SearchRequestBlackList, SearchResponseBlackList,
  CreateScreenFunctionRequest, CreateScreenFunctionResponse, UpdateScreenAssignmentRequest,
  SaveScreenAssignmentRequest, RegistrationRequest, RegistrationRequestListResponse,
  ChangeOfCode, CustomerCode,
  RcarNumberDetails, RcarNumber, AddRcarNumber, TeamCreation, SearchTeam, MaintainAgentLocation, AuthorizedPersonnelSearchRequest,
  AuthorizedPersonnelSerachResponse, AuthorizedPersonnelUpdateInsertRequest, AuthorizedPersonnelUpdateInsertResponse, RcarAgentGroup,
  RcarAgentGroupDetails, AddRcarAgentGroup, UpdateRcarAgentGroup, CustomerAuthrizedPersonnelBlacklistModel
} from './admin.sharedmodel';

@Injectable()
export class AdminService extends BaseService {

  /**
   * Initialize
   *
   * @param restService Rest Service
   */
  dataFromSearchToUpdate: any;
  dataFromChangeOfCodeToCustomerMaster: any;
  dataFromCustomerListToCustomermaster: any;
  dataFromCustomerMasterToChangeOfCode: any;
  dataFromCustomerMasterToAuthorizedPersonnel: any;
  dataFromCustomerMasterToSubUSerProfile: any;
  rollbackdata: any;
  dataAuto: any;
  dataFromCreateTeam: any;
  userSearchRequest: any;
  constructor(private restService: RestService) {
    super();
  }

  @TrackRestCallProgress()
  public getCompaniesLov(request: Company): Observable<BaseResponse<CompanyResponse>> {
    return <Observable<BaseResponse<CompanyResponse>>>this.restService.get
      (ADM_ENV.serviceBaseURL + ADM_ENV.getCompaniesLOV, request);
  }

  @TrackRestCallProgress()
  public getRolesLov(request: Role): Observable<BaseResponse<RoleResponse>> {
    return <Observable<BaseResponse<RoleResponse>>>this.restService.get
      (ADM_ENV.serviceBaseURL + ADM_ENV.getRolesLov, request);
  }

  @TrackRestCallProgress()
  public searchUserDetailsByCriteria(request: UserSearchRequest): Observable<BaseResponse<UserResponse>> {
    return <Observable<BaseResponse<UserResponse>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.searchUserDetailsByCriteria, request);
  }

  @TrackRestCallProgress()
  public saveUserDetails(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.saveUser, request);
  }

  @TrackRestCallProgress()
  public updateUserDetails(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.updateUser, request);
  }

  @TrackRestCallProgress()
  public updateUserDetailsWithChangedPassword(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.updateUserDetailsWithChangedPassword, request);
  }

  @TrackRestCallProgress()
  public deleteUserDetails(request: any): Observable<BaseResponse<UserResponse>> {
    return <Observable<BaseResponse<UserResponse>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.deleteUser, request);
  }

  @TrackRestCallProgress()
  public deleteRoleAssignments(request: any): Observable<BaseResponse<UserResponse>> {
    return <Observable<BaseResponse<UserResponse>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.deleteRoleAssignments, request);
  }

  @TrackRestCallProgress()
  public saveRole(request: CreateRoleRequest): Observable<BaseResponse<CreateRoleResponse>> {
    return <Observable<BaseResponse<CreateRoleResponse>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.createRole, request);
  }

  @TrackRestCallProgress()
  public updateRole(request: UpdateRoleRequest): Observable<BaseResponse<UpdateRoleResponse>> {
    return <Observable<BaseResponse<UpdateRoleResponse>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.updateRole, request);
  }

  @TrackRestCallProgress()
  public deleteRole(request: DeleteRoleRequest): Observable<BaseResponse<RoleBO>> {
    return <Observable<BaseResponse<RoleBO>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.deleteRole, request);
  }

  @TrackRestCallProgress()
  public searchUpdateRole(request: RoleBO): Observable<BaseResponse<RoleBO>> {
    return <Observable<BaseResponse<RoleBO>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.fetchUpdateRole, request);
  }

  @TrackRestCallProgress()
  public searchRole(request: RoleBO): Observable<BaseResponse<RoleListResponse>> {
    return <Observable<BaseResponse<RoleListResponse>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.searchRole, request);
  }

  @TrackRestCallProgress()
  public fetchRoleFunctions(request: AssignRoleFunctionRequest): Observable<BaseResponse<AssignRoleFunctionResponse>> {
    return <Observable<BaseResponse<AssignRoleFunctionResponse>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.fetchRoleFunctions, request);
  }

  @TrackRestCallProgress()
  public deleteSubModule(request: DeleteSubModuleRequest): Observable<BaseResponse<RoleBO>> {
    return <Observable<BaseResponse<RoleBO>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.deleteSubModule, request);
  }

  @TrackRestCallProgress()
  public createScreenFunctionAssignment(request: CreateScreenFunctionRequest):
    Observable<BaseResponse<CreateScreenFunctionResponse>> {
    return <Observable<BaseResponse<CreateScreenFunctionResponse>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.createScreenFunction, request);
  }

  @TrackRestCallProgress()
  public updateScreenFunctionAssignment(request: CreateScreenFunctionRequest):
    Observable<BaseResponse<CreateScreenFunctionResponse>> {
    return <Observable<BaseResponse<CreateScreenFunctionResponse>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.updateScreenFunction, request);
  }

  @TrackRestCallProgress()
  public saveScreenFunctionAssignment(request: any): Observable<BaseResponse<SaveScreenAssignmentRequest>> {
    return <Observable<BaseResponse<SaveScreenAssignmentRequest>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.saveScreenAssignments, request);
  }

  // starting the services for blacklisting the customer and authorized personnel
  @TrackRestCallProgress()
  public searchBlackListCustomer(request: SearchRequestBlackList):
    Observable<BaseResponse<SearchResponseBlackList>> {
    return <Observable<BaseResponse<SearchResponseBlackList>>>
      this.restService.post
        (ADM_ENV.serviceBaseURL + ADM_ENV.searchBlackListCustomer, request);
  }

  @TrackRestCallProgress()
  public updateBlackListCustomer(request: SearchResponseBlackList):
    Observable<BaseResponse<SearchResponseBlackList>> {
    return <Observable<BaseResponse<SearchResponseBlackList>>>
      this.restService.post
        (ADM_ENV.serviceBaseURL + ADM_ENV.updateBlackListCustomer, request);
  }
  @TrackRestCallProgress()
  public removeBlackListCustomer(request: SearchResponseBlackList):
    Observable<BaseResponse<SearchResponseBlackList>> {
    return <Observable<BaseResponse<SearchResponseBlackList>>>
      this.restService.post
        (ADM_ENV.serviceBaseURL + ADM_ENV.removeBlackListCustomer, request);
  }

  @TrackRestCallProgress()
  public searchAuthorizedPersonnel(request: SearchRequestBlackList):
    Observable<BaseResponse<SearchResponseBlackList>> {
    return <Observable<BaseResponse<SearchResponseBlackList>>>
      this.restService.post
        (ADM_ENV.serviceBaseURL + ADM_ENV.searchAuthorizedPersonnel, request);
  }

  @TrackRestCallProgress()
  public updateAuthorizedPersonnel(request: SearchResponseBlackList):
    Observable<BaseResponse<SearchResponseBlackList>> {
    return <Observable<BaseResponse<SearchResponseBlackList>>>
      this.restService.post
        (ADM_ENV.serviceBaseURL + ADM_ENV.updateAuthorizedPersonnel, request);
  }
  @TrackRestCallProgress()
  public removeAuthorizedPersonnel(request: SearchResponseBlackList):
    Observable<BaseResponse<SearchResponseBlackList>> {
    return <Observable<BaseResponse<SearchResponseBlackList>>>
      this.restService.post
        (ADM_ENV.serviceBaseURL + ADM_ENV.removeAuthorizedPersonnel, request);
  }
  // ending the services for blacklisting the customer and authorized personnel

  @TrackRestCallProgress()
  public fetchRegistrationRequestList(request: RegistrationRequest):
    Observable<BaseResponse<RegistrationRequestListResponse>> {
    return <Observable<BaseResponse<RegistrationRequestListResponse>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.fetchRegReqList, request);
  }

  @TrackRestCallProgress()
  public approveRequestSave(request: RegistrationRequestListResponse):
    Observable<BaseResponse<RegistrationRequestListResponse>> {
    return <Observable<BaseResponse<RegistrationRequestListResponse>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.saveRegReq, request);
  }

  @TrackRestCallProgress()
  public rejectRequestStatus(request: RegistrationRequestListResponse):
    Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.rejectReqStatus, request);
  }

  @TrackRestCallProgress()
  public searchCode(request) {
    return <Observable<BaseResponse<ChangeOfCode>>>
      this.restService.post
        (ADM_ENV.serviceBaseURL + ADM_ENV.searchCustomerCode, request);
  }

  @TrackRestCallProgress()
  public saveCode(request: ChangeOfCode) {
    return <Observable<BaseResponse<ChangeOfCode>>>
      this.restService.post(
        ADM_ENV.serviceBaseURL + ADM_ENV.saveCustomerCode, request);
  }

  @TrackRestCallProgress()
  public searchRcarNumber(request: RcarNumber) {
    return <Observable<BaseResponse<RcarNumberDetails>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.searchRcarNumber, request);

  }

  @TrackRestCallProgress()
  public searchRcarAgentGroup(request: RcarAgentGroup) {
    return <Observable<BaseResponse<RcarAgentGroupDetails>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.searchRcarAgentGroup, request);

  }


  @TrackRestCallProgress()
  public fetchAllRcarNumber(request: RcarNumber) {
    return <Observable<BaseResponse<RcarNumberDetails>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.fetchAllRcarNumber, request);
  }

  @TrackRestCallProgress()
  public fetchAllRcarAgentGroup(request: RcarAgentGroup) {
    return <Observable<BaseResponse<RcarAgentGroupDetails>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.fetchAllAgentGroup, request);
  }

  @TrackRestCallProgress()
  public deleteRcarAgentGroup(request: RcarAgentGroupDetails) {
    return <Observable<BaseResponse<RcarAgentGroupDetails>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.deleteRcarAgentGroup, request);
  }


  @TrackRestCallProgress()
  public updateRcarNumber(request: AddRcarNumber) {
    return <Observable<BaseResponse<RcarNumberDetails>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.updateRcarNumber, request);
  }

  @TrackRestCallProgress()
  public updateRcarAgentGroup(request: UpdateRcarAgentGroup) {
    return <Observable<BaseResponse<RcarAgentGroupDetails>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.updateRcarAgentGroup, request);
  }

  @TrackRestCallProgress()
  public addRcarNumber(request: AddRcarNumber) {
    return <Observable<BaseResponse<RcarNumberDetails>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.addRcarNumber, request);
  }

  @TrackRestCallProgress()
  public addRcarAgentGroup(request: AddRcarAgentGroup) {
    return <Observable<BaseResponse<RcarAgentGroupDetails>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.addRcarAgentGroup, request);
  }

  @TrackRestCallProgress()
  public checkForBlacklistedCustomer(request: AuthorizedPersonnelUpdateInsertRequest):
    Observable<BaseResponse<CustomerAuthrizedPersonnelBlacklistModel>> {
    return <Observable<BaseResponse<CustomerAuthrizedPersonnelBlacklistModel>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.checkForBlacklistedCustomer, request)
      ;
  }

  @TrackRestCallProgress()
  public insertUpdateAuthorizedPersonnel(request: AuthorizedPersonnelUpdateInsertRequest):
    Observable<BaseResponse<AuthorizedPersonnelUpdateInsertResponse>> {
    return <Observable<BaseResponse<AuthorizedPersonnelUpdateInsertResponse>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.insertUpdateAuthorizedPersonnel, request)
      ;
  }
  @TrackRestCallProgress()
  public getCustomerList(request: SearchCustomerList): Observable<BaseResponse<CustomerList>> {
    return <Observable<BaseResponse<CustomerList>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.getCustomerList, request);
  }

  @TrackRestCallProgress()
  public searchAuthorizedPersonnelByName(request: AuthorizedPersonnelSearchRequest):
    Observable<BaseResponse<AuthorizedPersonnelSerachResponse>> {
    return <Observable<BaseResponse<AuthorizedPersonnelSerachResponse>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.searchAuthorizedPersonnelByName, request)
      ;
  }

  // @TrackRestCallProgress()
  // public validateAuthorizedPersonName(request: any): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>
  //     this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.validateAuthorizedPersonName, request);
  // }

  // @TrackRestCallProgress()
  // public fetchDuplicateAirportPass(request: any): Observable<BaseResponse<any>> {
  //   return <Observable<BaseResponse<any>>>
  //     this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.fetchDuplicateAirportPass, request);
  // }


  @TrackRestCallProgress()
  public getTransferList(request: SearchCustomerList): Observable<BaseResponse<CustomerList>> {
    return <Observable<BaseResponse<CustomerList>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.searchTransferList, request);


    // public deleteAuthorizedPersonnel(request: AuthorizedPersonnelUpdateInsertRequest):
    // Observable<BaseResponse<AuthorizedPersonnelUpdateInsertResponse>> {
    // return <Observable<BaseResponse<AuthorizedPersonnelUpdateInsertResponse>>>
    //     this.restService.post(ADM_ENV.serviceBaseURL +  ADM_ENV.deleteAuthorizedPersonnelRow,
    //       request);
  }
  @TrackRestCallProgress()
  public transferAgent(request: SearchCustomerList): Observable<BaseResponse<CustomerList>> {
    return <Observable<BaseResponse<CustomerList>>>
      this.restService.post(ADM_ENV.serviceBaseURL + ADM_ENV.transferCustomer, request);
  }

  @TrackRestCallProgress()
  public fetchOnSearch(request: SearchCustomer):
    Observable<BaseResponse<CustomerListDetail>> {
    return <Observable<BaseResponse<CustomerListDetail>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.getCustomerListDetail, request);
  }

  @TrackRestCallProgress()
  public fetchAgentLocList(request: MaintainAgentLocation):
    Observable<BaseResponse<MaintainAgentLocation>> {
    return <Observable<BaseResponse<MaintainAgentLocation>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.getAgentLocList, request);
  }

  @TrackRestCallProgress()
  public insertTeamInformation(request: TeamCreation):
    Observable<BaseResponse<TeamCreation>> {
    return <Observable<BaseResponse<TeamCreation>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.createteam, request);
  }

  @TrackRestCallProgress()
  public fetchTeamInformation(request: SearchTeam):
    Observable<BaseResponse<TeamCreation>> {
    return <Observable<BaseResponse<TeamCreation>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.fetchteam, request);
  }

  @TrackRestCallProgress()
  public updateTeamInformation(request: TeamCreation):
    Observable<BaseResponse<TeamCreation>> {
    return <Observable<BaseResponse<TeamCreation>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.updateteam, request);
  }

  @TrackRestCallProgress()
  public deleteTeamInformation(request: TeamCreation):
    Observable<BaseResponse<TeamCreation>> {
    return <Observable<BaseResponse<TeamCreation>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.deleteteam, request);
  }

  @TrackRestCallProgress()
  public deleteWholeTeamInformation(request: TeamCreation):
    Observable<BaseResponse<TeamCreation>> {
    return <Observable<BaseResponse<TeamCreation>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.deletewholeteam, request);
  }

  @TrackRestCallProgress()
  public deleteAuthorizedPersonnel(request: AuthorizedPersonnelUpdateInsertRequest):
    Observable<BaseResponse<AuthorizedPersonnelUpdateInsertResponse>> {
    return <Observable<BaseResponse<AuthorizedPersonnelUpdateInsertResponse>>>
      this.restService.post(ADM_ENV.serviceBaseURL
        + ADM_ENV.deleteAuthorizedPersonnelRow, request);
  }


  @TrackRestCallProgress()
  public addCustomerMaster(request: any): Observable<BaseResponse<number>> {
    return <Observable<BaseResponse<number>>>this.restService
      .post("http://localhost:8082/admin/api/customer/master/add", request);
  }

  @TrackRestCallProgress()
  public addDeliveryLoc(request: any):
    Observable<BaseResponse<MaintainAgentLocation>> {
    return <Observable<BaseResponse<MaintainAgentLocation>>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.addAgentLoc, request);
  }

  @TrackRestCallProgress()
  public deleteDeliveryLoc(request: any):
    Observable<any> {
    return <Observable<any>>this.restService
      .post(ADM_ENV.serviceBaseURL + ADM_ENV.deleteAgentLoc, request);
  }

  // OVERSEAS CONSIGNEE SEARCH//
  @TrackRestCallProgress()
  public onSearchConsignee(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSearchConsignee, request);
  }
  @TrackRestCallProgress()
  public onSaveConsignee(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSaveConsignee, request);
  }
  // OVERSEAS CONSIGNEE SEARCH//

  // MAINTAIN CUSTOMER MASTER //
  @TrackRestCallProgress()
  public onSearchCustomerId(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSearchCustomerId, request);
  }
  @TrackRestCallProgress()
  public onSaveCustomer(request) {
    // if (request && request.notificationDetail) {
    //   request.notificationDetail.forEach(notification => {
    //     if (notification.notificationTypeDetail) {
    //       notification.notificationDetails = new Array([]);
    //       notification.notificationTypeDetail.forEach(notificationValue => {
    //         // let notificationTypeDetail:  notificationValue.notificationTypeDetail;
    //         const notificationTypeDetail = { notificationTypeDetail: notificationValue };
    //         notification.notificationDetails.push(notificationTypeDetail);
    //       });
    //     }
    //   });
    // }
    return <Observable<BaseResponse<any>>>this.restService.cleanAndPost
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSaveCustomer, request);
  }

  @TrackRestCallProgress()
  public onSaveAppointedAgent(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSaveAppointedAgent, request);
  }

  @TrackRestCallProgress()
  public onDeregisterAppointedAgent(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onDeregisterAppointedAgent, request);
  }

  @TrackRestCallProgress()
  public onSaveAliasDetail(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSaveAlias, request);
  }
  @TrackRestCallProgress()
  public onSearchLucDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSearchLuc, request);
  }
  @TrackRestCallProgress()
  public onSaveLucDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSaveLuc, request);
  }
  @TrackRestCallProgress()
  public onSaveEctDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSaveEct, request);
  }

  @TrackRestCallProgress()
  public onSaveTruckDetails(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.onSaveTruckDetails, request);
  }


  // MAINTAIN CUSTOMER MASTER //

  // SUB USER PROFILE LIST //

  @TrackRestCallProgress()
  public getSubuserList(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.getSubuserList, request);
  }

  @TrackRestCallProgress()
  public searchExistingRole(request) {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.searchExistingRole, request);
  }

  @TrackRestCallProgress()
  public searchVehicleRequests(request: VehiclePermitServiceRequest): Observable<BaseResponse<VehiclePermitServiceRequest[]>> {
    return <Observable<BaseResponse<VehiclePermitServiceRequest[]>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.searchForVehicleRequestList, request);
  }

  @TrackRestCallProgress()
  public sendRejectionEmail(request: VehiclePermitServiceRequest): Observable<BaseResponse<VehiclePermitServiceRequest[]>> {
    return <Observable<BaseResponse<VehiclePermitServiceRequest[]>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.sendRejectionEmail, request);
  }

  @TrackRestCallProgress()
  public sendApprovalEmail(request: VehiclePermitServiceRequest): Observable<BaseResponse<VehiclePermitServiceRequest[]>> {
    return <Observable<BaseResponse<VehiclePermitServiceRequest[]>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.sendApprovalEmail, request);
  }

  @TrackRestCallProgress()
  public copyUser(request: CopyUserDetails): Observable<BaseResponse<UserResponse>> {
    return <Observable<BaseResponse<UserResponse>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.copyUser, request);
  }

  public copyUser1(request: UserSearchRequest): Observable<BaseResponse<UserResponse>> {
    return <Observable<BaseResponse<UserResponse>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.copyUser1, request);
  }

  public fetchSubModuleByRoleCode(request): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<UserResponse>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.fetchSubModuleByRoleCode, request);
  }

  @TrackRestCallProgress()
  public fetchCustomerRelatedAgentsAndawbs(request: any): Observable<BaseResponse<any>> {
    return <Observable<BaseResponse<any>>>this.restService.post
      (ADM_ENV.serviceBaseURL + ADM_ENV.fetchCustomerRelatedAgentsAndawbs, request);
  }

}
