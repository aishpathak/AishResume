import { NgcUtility } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcReportComponent, NgcFormArray, NgcFormControl, NgcWindowComponent, PageConfiguration } from 'ngc-framework';
import { AdminService } from '../../admin.service';
import { FormsModule, Validators } from '@angular/forms';
// Create Role Admin
// TODO remove (clear) and (save) event on titlebar
import {
  UpdateRoleRequest, UpdateRoleResponse, CreateRoleSearchRequest,
  CreateRoleSearchResponse, RoleBO, DeleteRoleRequest
} from '../../admin.sharedmodel';
@Component({
  selector: 'ngc-rolelist',
  templateUrl: './rolelist.component.html',
  styleUrls: ['./rolelist.component.scss']
})

/**
 * This class Allow  to create Admin role and to preform insert and update operation.
 */
@PageConfiguration({
  trackInit: true,
  // callNgOnInitOnClear: true,
  autoBackNavigation: true,
  focusToBlank: true,
  focusToMandatory: true
})
export class RolelistComponent extends NgcPage {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  resp: any;
  deleteResp: any;
  responseArray: any[];
  sendDataArray: any[];
  sendData: any;
  title: any;
  reportParametersData: any;
  type: any;
  showSearchButton: boolean;
  columnName: any;
  record: any;
  dispTableFlag: boolean;
  dropDownAny: any;
  roleCodeDisplay: any;
  transferData: any;
  roleCodesParams: any;
  moduleCodeForGroup: any = null;
  submoduleCodeForGroup: any = null;
  sendDataToGrant: any = null;
  hasReadPermission: boolean = false;
  /**
  * constructor execute on Component creation
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private adminService: AdminService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  // Form controls of roleListForm
  private roleListForm: NgcFormGroup = new NgcFormGroup({
    applicationAccess: new NgcFormControl('', [Validators.required]),
    roleCategory: new NgcFormControl(),
    roleCode: new NgcFormControl(),
    description: new NgcFormControl(),
    screenName: new NgcFormControl(),
    resultList: new NgcFormArray([
    ]),
  });

  /**
  * Function execute on Component Initialization.
  */
  ngOnInit() {
    super.ngOnInit();
    this.dispTableFlag = false;
    this.showSearchButton = true;
    this.transferData = this.getNavigateData(this.activatedRoute);
    if (this.transferData) {
      this.showSearchButton = false;
      this.roleListForm.patchValue(this.transferData);
      this.roleListForm.get('roleCode').setValue(this.transferData.code);
      if (this.transferData.screenName) {
        this.roleListForm.get('screenName').setValue(this.transferData.screenName);
      }
      if (this.transferData.description) {
        this.roleListForm.get('description').setValue(this.transferData.description);
      }
      this.setApplicationAccesType(this.transferData.applicationAccess);
      this.onSearchRole();
    }

  }

  /**
  * Function execute and return the result on basis of role category and Application access.
  */
  public onSearchRole() {
    this.hasReadPermission = NgcUtility.hasReadPermission('ROLE_LIST');
    const fetchRoles: RoleBO = new RoleBO();
    (<NgcFormArray>this.roleListForm.get('resultList')).resetValue([]);
    fetchRoles.applicationAccess = this.roleListForm.get('applicationAccess').value;
    fetchRoles.roleCategory = this.roleListForm.get('roleCategory').value;
    fetchRoles.code = this.roleListForm.get('roleCode').value;
    fetchRoles.description = this.roleListForm.get('description').value;
    fetchRoles.screenName = this.roleListForm.get('screenName').value;
    if (fetchRoles.applicationAccess === 'Internal') {
      fetchRoles.applicationAccess = 'I';
    } else if (fetchRoles.applicationAccess === 'External') {
      fetchRoles.applicationAccess = 'E';
    } else {
      fetchRoles.applicationAccess = 'C';
    }
    (<NgcFormArray>this.roleListForm.controls['resultList']).resetValue([]);
    this.adminService.searchRole(fetchRoles).subscribe(data => {
      this.resp = data;
      // TODO use like this a = b = 9;
      this.responseArray = this.resp.data;
      this.sendDataArray = this.resp.data;

      if (this.resp.success) {
        this.dispTableFlag = true;
        this.editFunction();
        //this.deleteFunction();
        //this.grantFunction();
        (<NgcFormArray>this.roleListForm.controls['resultList']).patchValue(this.responseArray);
      } else {
        this.dispTableFlag = false;
      }
    },
      error => {
        this.dispTableFlag = false;
      }
    );
  }

  /**
  * Function to initialize edit button
  */
  public editFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      // this.responseArray[index]['EDIT'] = 'Edit';
      this.responseArray[index]['sno'] = index + 1;
    }
  }

  /**
  * Function to initialize delete button
  */
  public deleteFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]['DELETE'] = 'Delete';
    }
  }

  /**
  * Function to initialize grant button
  */
  public grantFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]['GRANT'] = 'Grant';
    }
  }

  /**
  * Function execute and route to the update role page if user clicked Edit is link
  * else route to the Assign role page if user clicked Grant link.
  */
  public onLinkClick(event) {
    if (event.type === 'link') {
      this.columnName = event.column;
      this.record = event.record;
      this.record.moduleCodeDescriptions = [];
      if (this.columnName === 'EDIT') {
        for (const entry of this.sendDataArray) {
          if (entry.code === this.record.code) {
            this.record.applicationAccess = this.roleListForm.get('applicationAccess').value;
            this.adminService.fetchSubModuleByRoleCode(this.record).subscribe(response => {
              this.refreshFormMessages(response);
              if (response.data) {
                entry.subModules = response.data;
                //this.sendData.subModules = response.data;
              }
              this.sendData = entry;
              this.sendData.applicationAccess = this.roleListForm.get('applicationAccess').value;
              this.navigateTo(this.router, '/admin/updaterole', this.sendData);
            }, error => {
              this.showErrorStatus(error);
            });

          }
        }
      }
      else if (this.columnName === 'GRANT') {
        if (this.sendDataToGrant) {
          this.record.description = this.roleListForm.get('description').value;
          this.record.screenName = this.roleListForm.get('screenName').value;
          this.record.moduleCodeDescriptions[0] = this.sendDataToGrant;
        } else {
          this.record.moduleCodeDescriptions = this.sendDataToGrant;
        }
        this.navigateTo(this.router, '/admin/assignfunction', this.record);
        for (const entry of this.sendDataArray) {
          if (entry.code === this.record.code) {
            this.sendData = entry;
            this.sendData.applicationAccess = this.roleListForm.get('applicationAccess').value;
            this.sendData.moduleCodeDescriptions = [];
            if (this.sendDataToGrant) {
              this.sendData.description = this.roleListForm.get('description').value;
              this.sendData.screenName = this.roleListForm.get('screenName').value;
              this.sendData.moduleCodeDescriptions[0] = this.sendDataToGrant;
            } else {
              this.sendData.moduleCodeDescriptions = this.sendDataToGrant;
            }
            console.log(this.sendData);
            this.navigateTo(this.router, '/admin/assignfunction', this.sendData);

          }
        }
      } else if (this.columnName === 'DELETE') {

        this.showConfirmMessage('admin.delete.selected.role.confirmation').then(fulfilled => {
          const deleteRole: DeleteRoleRequest = new DeleteRoleRequest();
          deleteRole.code = this.record.code;
          this.adminService.deleteRole(deleteRole).subscribe(data => {
            this.deleteResp = data;
            if (this.deleteResp.success) {
              (<NgcFormArray>this.roleListForm.get('resultList')).deleteValue([{ code: this.record.code }]);
              this.showSuccessStatus('g.completed.successfully');
              this.onSearchRole();
            } else {
              this.showErrorStatus(data.messageList[0].code);
            }
          },
          );
        }).catch(reason => {
        });
      } else if (this.columnName === 'Report') {
        this.reportParametersData = new Object();
        this.reportParametersData.ROLECODE = this.record.code;
        this.reportParametersData.APPACESS = this.roleListForm.get('applicationAccess').value;
        if (this.reportParametersData.APPACESS === 'Customer') {
          this.reportParametersData.APPACESS = 'C';
        } else if (this.reportParametersData.APPACESS === 'Internal') {
          this.reportParametersData.APPACESS = 'I';
        } else if (this.reportParametersData.APPACESS === 'External') {
          this.reportParametersData.APPACESS = 'E';
        }
        this.reportWindow.open();
      }
    }
  }

  onSelect(event) {
    let roleCode = '';
    (<NgcFormArray>this.roleListForm.get('roleCode')).reset();
    (<NgcFormArray>this.roleListForm.get('roleCategory')).reset();
    (<NgcFormArray>this.roleListForm.get('description')).reset();
    this.moduleCodeForGroup = null;
    this.submoduleCodeForGroup = null;
    roleCode = event.code.charAt(0);
    if (event.code) {
      this.showSearchButton = false;
      this.setApplicationAccesType(event.code);
      // if (event.code == 'Customer') {
      //   this.roleCodeDisplay = 'C';
      //   this.dropDownAny = this.createSourceParameter("'agent'");
      // } else if (event.code == 'Internal') {
      //   this.roleCodeDisplay = 'I';
      //   this.dropDownAny = this.createSourceParameter("'cosys','mobile'");
      // } else if (event.code == 'External') {
      //   this.roleCodeDisplay = 'E';
      //   this.dropDownAny = this.createSourceParameter("'cosys','mobile'");
      // }
    }

  }

  onSelectCategory(event) {
    (<NgcFormArray>this.roleListForm.get('roleCode')).reset();
    (<NgcFormArray>this.roleListForm.get('description')).reset();
    this.moduleCodeForGroup = null;
    this.submoduleCodeForGroup = null;
    this.setApplicationAccesType((<NgcFormArray>this.roleListForm.get('applicationAccess')).value)
  }

  onSelectRole(event: any) {
    (<NgcFormArray>this.roleListForm.get('description')).reset();
    this.moduleCodeForGroup = null;
    this.submoduleCodeForGroup = null;
    if (this.roleCodeDisplay == 'C') {
      this.dropDownAny = this.createSourceParameter("'agent'", (<NgcFormArray>this.roleListForm.get('roleCategory')).value, (<NgcFormArray>this.roleListForm.get('roleCode')).value);
    } else if (this.roleCodeDisplay == 'E' || this.roleCodeDisplay == 'I') {
      this.roleCodeDisplay = 'I';
      this.dropDownAny = this.createSourceParameter("'cosys','mobile'", (<NgcFormArray>this.roleListForm.get('roleCategory')).value, (<NgcFormArray>this.roleListForm.get('roleCode')).value);
    }
  }


  setApplicationAccesType(accesType: any) {
    if (accesType == 'Customer') {
      this.roleCodeDisplay = 'C';
      this.dropDownAny = this.createSourceParameter("'agent'", (<NgcFormArray>this.roleListForm.get('roleCategory')).value, (<NgcFormArray>this.roleListForm.get('roleCode')).value);
    } else if (accesType == 'Internal') {
      this.roleCodeDisplay = 'I';
      this.dropDownAny = this.createSourceParameter("'cosys','mobile'", (<NgcFormArray>this.roleListForm.get('roleCategory')).value, (<NgcFormArray>this.roleListForm.get('roleCode')).value);
    } else if (accesType == 'External') {
      this.roleCodeDisplay = 'E';
      this.dropDownAny = this.createSourceParameter("'cosys','mobile'", (<NgcFormArray>this.roleListForm.get('roleCategory')).value, (<NgcFormArray>this.roleListForm.get('roleCode')).value);
    }
    if (this.roleCodeDisplay) {
      console.log("roleparams -----------" + this.roleCodeDisplay);
      this.roleCodesParams = this.createSourceParameter((<NgcFormArray>this.roleListForm.get('roleCategory')).value, this.roleCodeDisplay);
    }
  }
  onClear(event) {
    (<NgcFormArray>this.roleListForm.get('resultList')).resetValue([]);
    this.roleListForm.reset();
    this.dispTableFlag = false;
    this.sendDataToGrant = null;
  }

  onFunctionGroup(event) {
    console.log(event);
    (<NgcFormArray>this.roleListForm.get('screenName')).reset();
    if (event.code === event.param3) {
      this.moduleCodeForGroup = event.code;
      this.submoduleCodeForGroup = null;
    } else {
      this.moduleCodeForGroup = event.param3;
      this.submoduleCodeForGroup = event.code;
    }
    if (event.code) {
      this.sendDataToGrant = {
        applicationMenuId: event.applicationMenuId,
        code: event.code,
        desc: event.desc,
        param1: event.param1,
        param2: event.param2,
        param3: event.param3
      }
    } else {
      this.sendDataToGrant = null
    }
  }
}
