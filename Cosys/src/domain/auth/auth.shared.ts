import { BaseService, RestService, BaseRequest, BaseResponseData } from 'ngc-framework';

export class LoginReq extends BaseRequest {
  username: string;
  password: string;
}

export class UserProfileRequest extends BaseRequest {
  userloginName: string;
}

export class User extends BaseRequest {
  userName: any;
  emailID: string;
  stationId: number;
  password: string;
  username: string;
  active: boolean;
  company: string;
  isvalid: boolean;
  superAdmin: boolean;
  resetPassword: boolean;
  lastLoginDateTime: any;
  validForgotPassDetails: any;
  changePassword: any;
  staffIdNumber: string;
  newPassword: any;
  confirmPassword: any;
  loginCode: string;
  currentPassword: string;
}

export class AssignedRole {
  roleId: number;
  userId: number;
  carrierId: number;
  userRoleAssignedDate: string;
  userRoleGivenBy: string;
  select: boolean;
  carrier: string;
}

export class LoginResponse extends BaseResponseData {
  success: boolean;
  userResponse: User;
  superAdmin: boolean;
  resetPassword: boolean;
  lastLoginDateTime: Date;
}

export class ChangePasswordReq extends BaseRequest {
  userId: number;
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export class ChangepasswordResponse extends BaseResponseData {
  success: boolean;
  user: User;
}
