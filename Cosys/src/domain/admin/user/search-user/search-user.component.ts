import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  OnDestroy,
  ViewChild
} from "@angular/core";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  PageConfiguration,
  NgcWindowComponent,
  NgcReportComponent
} from "ngc-framework";
import { AdminService } from "../../admin.service";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
  User,
  UserResponse,
  UserSearchRequest,
  CopyUserDetails
} from "../../admin.sharedmodel";

// TODO remove unused imports
// TODO Use JSDoc style comments for functions, interfaces, enums, and classes
@Component({
  selector: "ngc-search-user",
  templateUrl: "./search-user.component.html",
  styleUrls: ["./search-user.component.scss"]
})
/**
 * Search User Component is responsible for searching and editing a already saved User
 */
@PageConfiguration({
  trackInit: true
  //callNgOnInitOnClear: true,
  //: true,
  //restorePageOnBack: true
})
export class SearchUserComponent extends NgcPage implements OnInit, OnDestroy {
  /**
   * This flag is used for displaying of table when the criteria is right
   */
  isTableFlg: boolean;
  isCopy: boolean;
  arrayUser: any[];
  profileId: number;
  reportParameters: any;
  resp: any;
  datatoforward: any;
  @ViewChild("copyuserwindow")
  copywindow: NgcWindowComponent;
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  @ViewChild("reportWindow111")
  reportWindow111: NgcReportComponent;
  @ViewChild("reportWindow2")
  reportWindow2: NgcReportComponent;
  @ViewChild("reportWindow21")
  reportWindow21: NgcReportComponent;
  private searchUserForm: NgcFormGroup = new NgcFormGroup({
    roleCategory: new NgcFormControl(),
    roleCode: new NgcFormControl(),
    companyCode: new NgcFormControl(),
    userType: new NgcFormControl(),
    staffIdNumber: new NgcFormControl(),
    departmentCode: new NgcFormControl(),
    loginCode: new NgcFormControl(),
    shortName: new NgcFormControl(),
    users: new NgcFormArray([]),
    staffIdNumberFrom: new NgcFormControl(),
    loginCodeFrom: new NgcFormControl(),
    description: new NgcFormControl(),
    screenName: new NgcFormControl()
  });
  dropDownAny: {};
  moduleCodeForGroup: any;
  submoduleCodeForGroup: any;
  module: any;
  /**
   * Initialize
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private adminService: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    const forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {
      this.searchUserForm.patchValue(forwardedData);
      this.onSearch(event);
    }
    this.searchUserForm.get('userType').setValue('Internal');
  }

  /**
   * On Destroy
   */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /**
   * This function is responsible for displaying the data of the user
   * @param event
   */
  public onSearch(event) {
    (<NgcFormArray>this.searchUserForm.get("users")).resetValue([]);
    //
    console.log(`Search ${new Date()}`);
    this.searchUserForm.validate();
    console.log(`Validate ${new Date()}`);
    //
    if (this.searchUserForm.invalid) {
      return;
    }
    const request: UserSearchRequest = new UserSearchRequest();
    //
    request.staffIdNumber = this.searchUserForm.get("staffIdNumber").value;
    request.loginCode = this.searchUserForm.get("loginCode").value;
    request.departmentCode = this.searchUserForm.get("departmentCode").value;
    request.companyCode = this.searchUserForm.get("companyCode").value;
    request.userType = this.searchUserForm.get("userType").value;
    request.roleCode = this.searchUserForm.get("roleCode").value;
    request.shortName = this.searchUserForm.get("shortName").value;
    request.screenName = this.searchUserForm.get("screenName").value;
    request.description = this.searchUserForm.get("description").value;
    request.roleCategory = this.searchUserForm.get("roleCategory").value;
    request.userType =
      request.userType === "External"
        ? "E"
        : request.userType === "Internal"
          ? "I"
          : request.userType === "Customer"
            ? "C"
            : request.userType;
    console.log(`Search Service ${new Date()}`);
    this.adminService.searchUserDetailsByCriteria(request).subscribe(
      data1 => {
        this.resp = data1;
        this.arrayUser = this.resp.data;
        this.resetFormMessages();
        // TODO write instead if (this.arrayUser.length) {...}
        if (this.arrayUser !== null && this.arrayUser.length > 0) {
          this.toUpdateUser();
          for (const eachRow of this.arrayUser) {
            eachRow.select = false;
          }
          (<NgcFormArray>this.searchUserForm.controls["users"]).reset();
          this.resetFormMessages();
          (<NgcFormArray>this.searchUserForm.controls["users"]).patchValue(
            this.arrayUser
          );
          this.isTableFlg = true;
        } else {
          this.isTableFlg = false;
          this.showErrorStatus("NO_RECORDS_EXIST");
        }
      },
      error => { });
  }

  /**
   * This function will take on the Update User along with the data saved for the user
   * @param value Value
   */
  public onEdit(value) {
    this.adminService.userSearchRequest = this.searchUserForm.getRawValue();
    this.adminService.dataFromSearchToUpdate = (<NgcFormArray>(
      this.searchUserForm.get("users")
    )).getRawValue()[value.record.NGC_ROW_ID];
    this.router.navigate(["admin", "updateuser"]);
  }
  /**
   * It is for editing the data as per the selected record
   * @param event
   */
  toUpdateUser() {
    for (let index = 0; index < this.arrayUser.length; index++) {
      this.arrayUser[index]["edit"] = "edit";
    }
  }

  /**
   * This function is responsible for deleting the User Profile along with the Roles assigned to the User
   * @param event Event
   */
  public ondelete(event) {
    if ((<NgcFormArray>this.searchUserForm.get("users")).length === 0) {
      return this.showErrorStatus("g.no.record.delete");
    }
    for (
      let i = 0;
      i < (<NgcFormArray>this.searchUserForm.get("users")).length;
      i++
    ) {
      if (
        (<NgcFormArray>this.searchUserForm.get("users")).getRawValue()[i].select
      ) {
        const profileId = (<NgcFormArray>(
          this.searchUserForm.get("users")
        )).getRawValue()[i].profileId;
        const loginCode = (<NgcFormArray>(
          this.searchUserForm.get("users")
        )).getRawValue()[i].loginCode;
        this.showConfirmMessage(
          "Do you want to delete the user with loginId" + " " + loginCode + "?"
        )
          .then(fulfilled => {
            (<NgcFormArray>this.searchUserForm.get("users")).deleteValueAt(i);
            const request = {
              profileId: profileId,
              loginCode: loginCode
            };
            this.adminService.deleteUserDetails(request).subscribe(data => {
              if (data.success) {
                this.showSuccessStatus("g.completed.successfully");
              } else {
                this.showErrorStatus("admin.user.not.deleted");
              }
            });
          })
          .catch(reason => { });
      }
    }
  }
  /**
   * This function will take on the Create User for creating the new user
   * @param value Value
   */
  public onAddUser(value) {
    this.navigateTo(this.router, "/admin/createuser", null);
  }

  public copyUser(value) {
    const dataSelect = this.searchUserForm.getRawValue();
    const selectedItem = (dataSelect.users as any[]).filter(item => {
      return item.select
    })
    if (selectedItem != null && selectedItem.length > 0) {
      this.isCopy = true;
      this.adminService.dataFromSearchToUpdate = selectedItem[0];
      this.profileId = selectedItem[0].profileId;
      this.searchUserForm.get("staffIdNumber").setValue(selectedItem[0].staffIdNumber);
      this.searchUserForm.get("loginCode").setValue(selectedItem[0].loginCode);
      this.copywindow.open();
    }
    this.copywindow.open();
  }

  public copyUsertoAdd(value) {
    const request: UserSearchRequest = new UserSearchRequest();
    request.staffIdNumber = this.searchUserForm.get("staffIdNumber").value;
    request.loginCode = this.searchUserForm.get("loginCode").value;
    if (
      (request.staffIdNumber == null || request.staffIdNumber == 0) &&
      (request.loginCode == null || request.loginCode == "")
    ) {
      return this.showErrorStatus("admin.enter.staffid.loginId");
    }
    if (this.isCopy == true) {
      this.copywindow.hide();
      this.navigate("admin/createuser", request);
    }
  }

  public cancelWindowButton(event) {
    this.searchUserForm.get("staffIdNumber").setValue(null);
    this.searchUserForm.get("loginCode").setValue(null);
    this.copywindow.hide();
  }

  PrintReport() {
    const reportParameters: any = {};
    if (this.searchUserForm.get("userType").value == "Customer") {
      reportParameters.userType = "c";
    } else if (this.searchUserForm.get("userType").value == "External") {
      reportParameters.userType = "e";
    } else if (this.searchUserForm.get("userType").value == "Internal") {
      reportParameters.userType = "i";
    }
    if (this.searchUserForm.get("roleCode").value == null) {
      if (this.searchUserForm.get("roleCategory").value == null) {
        reportParameters.shortName = this.searchUserForm.get("shortName").value;
        reportParameters.loginCode = this.searchUserForm.get("loginCode").value;
        reportParameters.FunctionName = this.searchUserForm.get("description").value;
        reportParameters.module = this.module;

        reportParameters.screenName = this.searchUserForm.get("screenName").value;
        reportParameters.departmentCode = this.searchUserForm.get(
          "departmentCode"
        ).value;
        reportParameters.staffIdNumber = this.searchUserForm.get(
          "staffIdNumber"
        ).value;
        this.reportParameters = reportParameters;
        this.reportWindow.downloadReport();

      }
      else if (this.searchUserForm.get("roleCategory").value !== null) {
        reportParameters.roleCategory = this.searchUserForm.get(
          "roleCategory"
        ).value;
        reportParameters.roleCode = this.searchUserForm.get("roleCode").value;
        reportParameters.shortName = this.searchUserForm.get("shortName").value;
        reportParameters.loginCode = this.searchUserForm.get("loginCode").value;
        reportParameters.FunctionName = this.searchUserForm.get("description").value;
        reportParameters.module = this.module;
        reportParameters.screenName = this.searchUserForm.get("screenName").value;
        reportParameters.departmentCode = this.searchUserForm.get(
          "departmentCode"
        ).value;
        reportParameters.staffIdNumber = this.searchUserForm.get(
          "staffIdNumber"
        ).value;
        this.reportParameters = reportParameters;
        this.reportWindow111.downloadReport();
      }
    } else if (this.searchUserForm.get("roleCode").value !== null) {
      reportParameters.roleCategory = this.searchUserForm.get(
        "roleCategory"
      ).value;
      reportParameters.roleCode = this.searchUserForm.get("roleCode").value;
      reportParameters.shortName = this.searchUserForm.get("shortName").value;
      reportParameters.loginCode = this.searchUserForm.get("loginCode").value;
      reportParameters.FunctionName = this.searchUserForm.get("description").value;
      reportParameters.module = this.module;
      reportParameters.screenName = this.searchUserForm.get("screenName").value;
      reportParameters.departmentCode = this.searchUserForm.get(
        "departmentCode"
      ).value;
      reportParameters.staffIdNumber = this.searchUserForm.get(
        "staffIdNumber"
      ).value;
      this.reportParameters = reportParameters;
      this.reportWindow111.downloadReport();
    }
  }

  PrintReportPdf() {
    const reportParameters: any = {};
    if (this.searchUserForm.get("userType").value == "Customer") {
      reportParameters.userType = "c";
    } else if (this.searchUserForm.get("userType").value == "External") {
      reportParameters.userType = "e";
    } else if (this.searchUserForm.get("userType").value == "Internal") {
      reportParameters.userType = "i";
    }
    if (this.searchUserForm.get("roleCode").value == null) {
      if (this.searchUserForm.get("roleCategory").value == null) {
        reportParameters.shortName = this.searchUserForm.get("shortName").value;
        reportParameters.loginCode = this.searchUserForm.get("loginCode").value;
        reportParameters.FunctionName = this.searchUserForm.get("description").value;
        reportParameters.module = this.module;
        reportParameters.screenName = this.searchUserForm.get("screenName").value;
        reportParameters.departmentCode = this.searchUserForm.get(
          "departmentCode"
        ).value;
        reportParameters.staffIdNumber = this.searchUserForm.get(
          "staffIdNumber"
        ).value;
        this.reportParameters = reportParameters;
        this.reportWindow2.open();
      } else if (this.searchUserForm.get("roleCategory").value !== null) {
        reportParameters.roleCategory = this.searchUserForm.get(
          "roleCategory"
        ).value;
        reportParameters.roleCode = this.searchUserForm.get("roleCode").value;
        reportParameters.shortName = this.searchUserForm.get("shortName").value;
        reportParameters.loginCode = this.searchUserForm.get("loginCode").value;
        reportParameters.FunctionName = this.searchUserForm.get("description").value;
        reportParameters.module = this.module;
        reportParameters.screenName = this.searchUserForm.get("screenName").value;
        reportParameters.departmentCode = this.searchUserForm.get(
          "departmentCode"
        ).value;
        reportParameters.staffIdNumber = this.searchUserForm.get(
          "staffIdNumber"
        ).value;
        this.reportParameters = reportParameters;
        this.reportWindow21.open();
      }
    } else if (this.searchUserForm.get("roleCode").value !== null) {
      reportParameters.roleCategory = this.searchUserForm.get(
        "roleCategory"
      ).value;
      reportParameters.roleCode = this.searchUserForm.get("roleCode").value;
      reportParameters.shortName = this.searchUserForm.get("shortName").value;
      reportParameters.loginCode = this.searchUserForm.get("loginCode").value;
      reportParameters.FunctionName = this.searchUserForm.get("description").value;
      reportParameters.module = this.module;
      reportParameters.screenName = this.searchUserForm.get("screenName").value;
      reportParameters.departmentCode = this.searchUserForm.get(
        "departmentCode"
      ).value;
      reportParameters.staffIdNumber = this.searchUserForm.get(
        "staffIdNumber"
      ).value;
      this.reportParameters = reportParameters;
      this.reportWindow21.open();
    }
  }

  public clearCopyTo(event) {
    this.searchUserForm.get("staffIdNumberTo").setValue(null);
    this.searchUserForm.get("loginCodeTo").setValue(null);
  }

  onClear(event) {
    this.isTableFlg = false;
    this.searchUserForm.reset();
  }

  onCancel(event) {
    decodeURI
    this.isTableFlg = false;
    this.searchUserForm.reset();
    this.navigateTo(this.router, '/', null);
  }

  selectUserType(value) {
    this.moduleCodeForGroup = null;
    this.submoduleCodeForGroup = null;
    if (value == 'Customer' || value === 'C') {
      this.dropDownAny = this.createSourceParameter("'agent'", (<NgcFormArray>this.searchUserForm.get('roleCategory')).value, (<NgcFormArray>this.searchUserForm.get('roleCode')).value);
    } else if (value == 'Internal' || value === 'I') {
      this.dropDownAny = this.createSourceParameter("'cosys','mobile'", (<NgcFormArray>this.searchUserForm.get('roleCategory')).value, (<NgcFormArray>this.searchUserForm.get('roleCode')).value);
    } else if (value == 'External' || value === 'E') {
      this.dropDownAny = this.createSourceParameter("'cosys','mobile'", (<NgcFormArray>this.searchUserForm.get('roleCategory')).value, (<NgcFormArray>this.searchUserForm.get('roleCode')).value);
    }
  }
  onFunctionGroup(event) {
    if (event.code === event.param3) {
      this.moduleCodeForGroup = event.code;
      this.module = event.desc;
      this.submoduleCodeForGroup = null;
    } else {
      this.moduleCodeForGroup = event.param3;
      this.submoduleCodeForGroup = event.code;
      this.module = event.desc;
    }
  }
}
