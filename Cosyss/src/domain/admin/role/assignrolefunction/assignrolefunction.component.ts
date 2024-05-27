import { ScreenAssignment } from "./../../admin.sharedmodel";

import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcWindowComponent,
  PageConfiguration,
  NgcUtility
} from "ngc-framework";
import { AdminService } from "../../admin.service";
import {
  AssignRoleFunctionRequest,
  CreateScreenFunctionRequest,
  UpdateScreenAssignmentRequest,
  SaveScreenAssignmentRequest
} from "../../admin.sharedmodel";
import { FormsModule, Validators, ValidatorFn } from "@angular/forms";

@Component({
  selector: "ngc-assignrolefunction",
  templateUrl: "./assignrolefunction.component.html",
  styleUrls: ["./assignrolefunction.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
  // autoBackNavigation: true,
  // restorePageOnBack: true
})
export class AssignrolefunctionComponent extends NgcPage {
  @ViewChild("restrictedFunctionWindow")
  restrictedFunctionWindow: NgcWindowComponent;
  @ViewChild("functionListWindow")
  functionListWindow: NgcWindowComponent;
  resp: any;
  windowResp: any;
  errors: any[];
  responseArray: any[];
  windowRespArray: any[];
  flightEnroutListArray: string[] = [];
  operativeFlightListArray: string[] = [];
  scheduleFlightListArray: string[] = [];
  transferData: any;
  fetchedSubModuleList: any[];
  dropDownAny: any;
  expandorcollapse: boolean = true;
  functionlist: any[];
  showresult: boolean = false;
  arrayToPatch: any[];
  isSearched: boolean = false;
  hasReadPermission: boolean = false;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private assignRoleForm: NgcFormGroup = new NgcFormGroup({
    roleCode: new NgcFormControl(),
    moduleList: new NgcFormControl(),
    applicationAccess: new NgcFormControl(),
    parameter1: new NgcFormControl(),
    applicationId: new NgcFormControl(),

    createScreenFunctionList: new NgcFormArray([]),
    assignRoleFunctionList: new NgcFormArray([]),
    functionList: new NgcFormArray([])
  });

  /**
   * On  Initialization
   * @param event Event
   */
  ngOnInit() {
    this.transferData = this.getNavigateData(this.activatedRoute);
    this.assignRoleForm.get("roleCode").patchValue(this.transferData.code);
    this.assignRoleForm
      .get("applicationAccess")
      .patchValue(this.transferData.applicationAccess);

    if (this.assignRoleForm.get("applicationAccess").value == "Customer") {
      this.dropDownAny = this.createSourceParameter("'agent'");
    } else if (
      this.assignRoleForm.get("applicationAccess").value == "Internal" ||
      this.assignRoleForm.get("applicationAccess").value == "External"
    ) {
      this.dropDownAny = this.createSourceParameter("'cosys','mobile'");
    }
    this.expandorcollapse = true;
    if (this.transferData.moduleCodeDescriptions) {
      this.onAutoSearchModule();
    }

    this.hasReadPermission = NgcUtility.hasReadPermission('ROLE_LIST');
  }

  /**
   * Function to save ScreenAssignment records
   * @param event Event
   */
  onSave(event) {
    const saveScreenFunctionReq: any = [];
    const saveScreenFunctionArray = (<NgcFormArray>(
      this.assignRoleForm.get("assignRoleFunctionList")
    )).getRawValue();

    for (let i = 0; i < saveScreenFunctionArray.length; i++) {
      const saveScreenAssignmentRequest: SaveScreenAssignmentRequest = new SaveScreenAssignmentRequest();
      saveScreenAssignmentRequest.subModuleCodeDescription =
        saveScreenFunctionArray[i].subModuleCodeDescription;
      const screenAssignmentsArray: Array<any> = <Array<any>>(
        saveScreenFunctionArray[i].screenAssignments
      );

      const saveScreenFunctionSubReq: any = [];
      for (let j = 0; j < screenAssignmentsArray.length; j++) {
        const screenAssignment: ScreenAssignment = new ScreenAssignment();
        screenAssignment.screenCode = screenAssignmentsArray[j].screenCode;
        screenAssignment.screenCodeDescription = screenAssignmentsArray[j].screenCodeDescription;
        screenAssignment.subModuleCodeDescription = screenAssignmentsArray[j].subModuleCodeDescription;
        screenAssignment.moduleCodeDescription = screenAssignmentsArray[j].moduleCodeDescription;
        screenAssignment.existing = screenAssignmentsArray[j].existing;
        screenAssignment.roleCode = this.assignRoleForm.get("roleCode").value;
        screenAssignment.moduleCode = screenAssignmentsArray[j].moduleCode;
        screenAssignment.subModuleCode =
          screenAssignmentsArray[j].subModuleCode;
        if (screenAssignmentsArray[j].displayFlag) {
          screenAssignment.displayFlag = 1;
        } else {
          screenAssignment.displayFlag = 0;
        }
        if (screenAssignmentsArray[j].updateFlag) {
          screenAssignment.updateFlag = 1;
        } else {
          screenAssignment.updateFlag = 0;
        }
        saveScreenFunctionSubReq.push(screenAssignment);
      }
      saveScreenAssignmentRequest.screenAssignments = saveScreenFunctionSubReq;
      saveScreenFunctionReq.push(saveScreenAssignmentRequest);
    }
    this.adminService
      .saveScreenFunctionAssignment(saveScreenFunctionReq)
      .subscribe(data => {
        this.windowResp = data;
        this.windowRespArray = this.windowResp.data;
        if (this.windowResp.success) {
          this.restrictedFunctionWindow.hide();
          this.refreshFormMessages(data);
          this.showSuccessStatus("g.completed.successfully");
          if (this.isSearched) {
            this.onSearchModule();
          } else {
            this.onAutoSearchModule();
          }
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);
        }
      });
  }

  /**
   * Function to close popup window
   * @param event Event
   */

  onButtonCancel(event) {
    this.restrictedFunctionWindow.hide();
  }

  /**
   * Function to handle CreateScreenFunctionRequest
   * @param event Event
   */
  onButtonSave(event) {
    const indices: any = [];
    const updateScreenWindowArray = (<NgcFormArray>(
      this.assignRoleForm.get("createScreenFunctionList")
    )).controls;

    for (let i = 0; i < updateScreenWindowArray.length; i++) {
      const updateScreenFunctions: CreateScreenFunctionRequest = new CreateScreenFunctionRequest();
      updateScreenFunctions.roleCode =
        updateScreenWindowArray[i].value.roleCode;
      updateScreenFunctions.screenCode =
        updateScreenWindowArray[i].value.screenCode;
      updateScreenFunctions.screenFunctionCode =
        updateScreenWindowArray[i].value.screenFunctionCode;
      updateScreenFunctions.moduleCode =
        updateScreenWindowArray[i].value.moduleList;
      updateScreenFunctions.screenCodeDescription =
        updateScreenWindowArray[i].value.screenCodeDescription;
      if (updateScreenWindowArray[i].value.screenAssignedFlag) {
        updateScreenFunctions.screenAssignedFlag = 1;
      }
      indices.push(updateScreenFunctions);
    }

    this.adminService
      .updateScreenFunctionAssignment(indices)
      .subscribe(data => {
        this.windowResp = data;
        this.windowRespArray = this.windowResp.data;
        if (this.windowResp.success) {
          this.restrictedFunctionWindow.hide();
          this.refreshFormMessages(data);
          this.showSuccessStatus("g.completed.successfully");
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);
        }
      });
  }

  /**
   * Function to populate popup window to Create ScreenFunction Assignment
   * @param event Event
   */
  onLinkClick(event) {
    const createScreenFunctions: CreateScreenFunctionRequest = new CreateScreenFunctionRequest();
    createScreenFunctions.roleCode = this.assignRoleForm.get("roleCode").value;
    createScreenFunctions.screenCode = event;
    this.adminService
      .createScreenFunctionAssignment(createScreenFunctions)
      .subscribe(data => {
        this.windowResp = data;
        this.windowRespArray = this.windowResp.data;
        if (this.windowRespArray.length > 0) {
          (<NgcFormArray>(
            this.assignRoleForm.controls["createScreenFunctionList"]
          )).patchValue(this.windowRespArray);
          this.refreshFormMessages(data);
          this.showSuccessStatus("g.completed.successfully");
          this.restrictedFunctionWindow.open();
        } else if (this.windowResp.success) {
          this.showInfoStatus(
            "admin.no.sub.function.associated.with.this.screen"
          );
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);
        }
      });
  }

  /**
   * Function to handle request for AssignRoleFunction
   */

  public onsearchMuliple(event) {
    this.retrieveLOVRecords("MENUITEM", this.dropDownAny).subscribe(record => {
      this.functionlist = record;
      this.functionlist.forEach(element => {
        element.select = false;
        if (element.param2 != '0') {
          element.parent = false;
        } else {
          element.parent = true;
        }
      });
      (<NgcFormArray>this.assignRoleForm.controls['functionList']).patchValue(this.functionlist);
      this.functionListWindow.open();
    });
  }
  public onSearchModule() {
    this.isSearched = true;
    const fetchRoleFunctions: AssignRoleFunctionRequest = new AssignRoleFunctionRequest();
    const seachmodules = (<NgcFormArray>this.assignRoleForm.controls['functionList']).value;
    const requestmodules = [];
    fetchRoleFunctions.roleCode = this.assignRoleForm.get("roleCode").value;
    seachmodules.forEach(element => {
      if (element.select) {
        requestmodules.push(element);
      }
    });
    fetchRoleFunctions.moduleCodeDescription = this.assignRoleForm.get(
      "moduleList"
    ).value;

    if (this.assignRoleForm.get("applicationAccess").value == "Customer") {
      fetchRoleFunctions.parameter1 = "'agent'";
    } else if (
      this.assignRoleForm.get("applicationAccess").value == "Internal" ||
      this.assignRoleForm.get("applicationAccess").value == "External"
    ) {
      fetchRoleFunctions.parameter1 = "'cosys','mobile'";
    }
    fetchRoleFunctions.moduleCodeDescriptions = requestmodules;
   
    this.adminService.fetchRoleFunctions(fetchRoleFunctions).subscribe(data => {
      this.functionListWindow.close();
      this.resp = data;
      if (data.data) {
        this.responseArray = this.resp.data;
        (<NgcFormArray>(
          this.assignRoleForm.controls["assignRoleFunctionList"]
        )).patchValue(this.responseArray);
        (<NgcFormArray>(
          (<NgcFormGroup>this.assignRoleForm).get("assignRoleFunctionList")
        )).controls.forEach(item => {
          console.log((<NgcFormArray>(
            (<NgcFormGroup>item).get("screenAssignments")
          )).controls);
          (<NgcFormArray>(
            (<NgcFormGroup>item).get("screenAssignments")
          )).controls.forEach(item2 => {
            item2.get("updateFlag").valueChanges.subscribe(value => {
              if (value === true) {
                if (
                  value === item2.get("displayFlag").value ||
                  item2.get("displayFlag").value === 1
                ) {
                  item2.get("displayFlag").patchValue(!value);
                }
              }
            });
            item2.get("displayFlag").valueChanges.subscribe(value => {
              if (value === true) {
                if (
                  value === item2.get("updateFlag").value ||
                  item2.get("updateFlag").value === 1
                ) {
                  item2.get("updateFlag").patchValue(!value);
                }
              }
            });
          });
        });
      } else {
        this.showErrorStatus("NO_RECORDS_EXIST")
      }
    });

  }

  patchAllChildCheckBox(item, index) {
    let lovList = new Array();
    let itr = 0;
    // if (item.select) {
    for (let i = index + 1; i < this.functionlist.length; i++) {
      if (item.applicationMenuId === parseInt(this.functionlist[i].param2)) {
        lovList.push(this.functionlist[i]);
      } else {
        break;
      }
    }
    itr = lovList.length;
    for (let i = index; i <= itr + index; i++) {
      this.assignRoleForm.get(['functionList', i, 'select']).patchValue(item.select);
    }

  }

  onCancel() {
    this.navigateBack(this.transferData);
  }

  selectAll(value) {
    for (let i = 0; i < (<NgcFormArray>this.assignRoleForm.get(['functionList'])).length; i++) {
      if (value) {
        this.assignRoleForm.get(['functionList', i, 'select']).patchValue(true);
      } else {
        this.assignRoleForm.get(['functionList', i, 'select']).patchValue(false);
      }
    }
  }

  onSelectMenu(event) {
    this.arrayToPatch = [];
    this.retrieveLOVRecords("MENUITEM", this.dropDownAny).subscribe(record => {
      this.functionlist = record;
      this.functionlist.forEach(element => {
        element.select = false;
        if (element.param2 != '0') {
          element.parent = false;
        } else {
          element.parent = true;
        }
        if (event) {
          if (element.desc === event) {
            this.arrayToPatch.push(element);
          };
        } else {
          this.arrayToPatch.push(element);
        }
      });
      (<NgcFormArray>this.assignRoleForm.controls['functionList']).patchValue(this.arrayToPatch);
    });
  }
  public onAutoSearchModule() {
    const fetchRoleFunctions: AssignRoleFunctionRequest = new AssignRoleFunctionRequest();
    const seachmodules = this.transferData.moduleCodeDescriptions;
    const requestmodules = [];
    fetchRoleFunctions.roleCode = this.assignRoleForm.get("roleCode").value;
    fetchRoleFunctions.moduleCodeDescriptions = null;
    fetchRoleFunctions.moduleCodeDescriptions = this.transferData.moduleCodeDescriptions;
    if (this.assignRoleForm.get("applicationAccess").value == "Customer") {
      fetchRoleFunctions.parameter1 = "'agent'";
    } else if (
      this.assignRoleForm.get("applicationAccess").value == "Internal" ||
      this.assignRoleForm.get("applicationAccess").value == "External"
    ) {
      fetchRoleFunctions.parameter1 = "'cosys','mobile'";
    }
    this.adminService.fetchRoleFunctions(fetchRoleFunctions).subscribe(data => {
      this.functionListWindow.close();
      this.resp = data;
      if (data.data) {
        this.responseArray = this.resp.data;
        (<NgcFormArray>(
          this.assignRoleForm.controls["assignRoleFunctionList"]
        )).patchValue(this.responseArray);
        (<NgcFormArray>(
          (<NgcFormGroup>this.assignRoleForm).get("assignRoleFunctionList")
        )).controls.forEach(item => {
          console.log((<NgcFormArray>(
            (<NgcFormGroup>item).get("screenAssignments")
          )).controls);
          (<NgcFormArray>(
            (<NgcFormGroup>item).get("screenAssignments")
          )).controls.forEach(item2 => {
            console.log(item2.value);
            item2.get("updateFlag").valueChanges.subscribe(value => {
              if (value === true) {
                if (
                  value === item2.get("displayFlag").value ||
                  item2.get("displayFlag").value === 1
                ) {
                  item2.get("displayFlag").patchValue(!value);
                }
              }
            });
            item2.get("displayFlag").valueChanges.subscribe(value => {
              if (value === true) {
                if (
                  value === item2.get("updateFlag").value ||
                  item2.get("updateFlag").value === 1
                ) {
                  item2.get("updateFlag").patchValue(!value);
                }
              }
            });
          });
        });

      } else {
        this.showErrorStatus("NO_RECORDS_EXIST")
      }
    });

  }

  public onAutoSelectSubModule(index) {
    let screenAssignments = this.assignRoleForm.get(['assignRoleFunctionList', index, 'screenAssignments']).value;
    let submoduleindex = 0;
    let displayscreens = screenAssignments.filter(obj => {
      return obj.displayFlag && !obj.subModule;
    });
    let updatescreens = screenAssignments.filter(obj => {
      return obj.updateFlag && !obj.subModule;
    });
    screenAssignments.forEach((screen, index) => {
      if (screen.subModule) {
        submoduleindex = index;
      }
    });
    let isSubmodule = this.assignRoleForm.get(['assignRoleFunctionList', index, 'screenAssignments', submoduleindex, 'subModule']).value;
    if (isSubmodule) {
      if (displayscreens.length === 0) {
        this.assignRoleForm.get(['assignRoleFunctionList', index, 'screenAssignments', submoduleindex, 'displayFlag']).patchValue(false);
      } else {
        this.assignRoleForm.get(['assignRoleFunctionList', index, 'screenAssignments', submoduleindex, 'displayFlag']).patchValue(true);
      }
      if (updatescreens.length === 0) {
        this.assignRoleForm.get(['assignRoleFunctionList', index, 'screenAssignments', submoduleindex, 'updateFlag']).patchValue(false);
      } else {
        this.assignRoleForm.get(['assignRoleFunctionList', index, 'screenAssignments', submoduleindex, 'updateFlag']).patchValue(true);
        this.assignRoleForm.get(['assignRoleFunctionList', index, 'screenAssignments', submoduleindex, 'displayFlag']).patchValue(false);
      }

    }

  }
}
