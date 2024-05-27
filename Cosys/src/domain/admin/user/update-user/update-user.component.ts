import { Component, NgZone, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcUtility, DateTimeKey, NgcFormControl, NgcWindowComponent, NgcLOVComponent, PageConfiguration } from 'ngc-framework';
import { AdminService } from '../../admin.service';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

// TODO Use JSDoc style comments for functions, interfaces, enums, and classes
// TODO remove save and clear events from html or implement corresponding function

@Component({
  selector: 'ngc-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})

/**
* Update User Component is responsible to Updating the user profile along with
* Roles assigned to him
*/
@PageConfiguration({
  trackInit: true
  //callNgOnInitOnClear: true,
  //autoBackNavigation: true,
  //restorePageOnBack: true
})

export class UpdateUserComponent extends NgcPage {
  @ViewChild('window') window: NgcWindowComponent;
  resp: any;
  minDate: Date;
  arrayUser: any[];
  dataRetrieved: any = [];
  disableControls: any = [];
  errors: any[];
  cosysPassword: boolean = true;
  forwardedData: any;
  showRestrictionFlag = false;
  dropDownAny: any;

  /**
  * Initialize
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router,
    private adminService: AdminService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }
  private updateUserForm: NgcFormGroup = new NgcFormGroup({
    activeFlag: new NgcFormControl(),
    cosysLoginFlag: new NgcFormControl(),
    customer: new NgcFormGroup
      ({
        id: new NgcFormControl('', [Validators.required]),
        name: new NgcFormControl()
      }),
    departmentCode: new NgcFormControl(),
    emailId: new NgcFormControl('', [Validators.maxLength(60)]),
    encryptPassword: new NgcFormControl(''),
    encryptPasswordChange: new NgcFormControl(''),
    graceLoginUsed: new NgcFormControl(),
    gradeCode: new NgcFormControl(),
    userDigitalSignature: new NgcFormControl(),
    userPhotograph: new NgcFormControl(),
    initialCode: new NgcFormControl('', [Validators.maxLength(6)]),
    loginCode: new NgcFormControl('', [Validators.required, Validators.maxLength(8)]),
    passportOrFinDescription: new NgcFormControl('', [Validators.maxLength(20)]),
    phoneNumber: new NgcFormControl('', [Validators.maxLength(10)]),
    profileId: new NgcFormControl(),
    userRoleAssignmentId: new NgcFormControl(),
    shortName: new NgcFormControl('', [Validators.required, Validators.maxLength(35)]),
    staffIdNumber: new NgcFormControl('', [Validators.maxLength(10)]),
    createdOn: new NgcFormControl(),
    createdOnPopUp: new NgcFormControl(),
    passwordChangedDate: new NgcFormControl(),
    passwordChangedDatePopUp: new NgcFormControl(),
    userRoleAssignments: new NgcFormArray([]),
    restrictedAirlines: new NgcFormArray([]),
    restrictedHandlingArea: new NgcFormArray([]),
    relatedSubUsers: new NgcFormArray([]),
    handlingArea: new NgcFormControl(),
    duties: new NgcFormControl(),
    userType: new NgcFormControl('', [Validators.required, Validators.maxLength(20)]),
    win2kCode: new NgcFormControl('', [Validators.maxLength(60)])
  });
  public ngOnInit(): void {
    super.ngOnInit();
    const today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    this.dataRetrieved = this.adminService.dataFromSearchToUpdate;
    if (this.dataRetrieved.cosysLoginFlag === false) {
      this.cosysPassword = false;
    }
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (null !== this.forwardedData) {
      this.getRoleFromCopy(this.forwardedData);
    } else {
      this.testThis()
    }
  }


  /**
  * On Destroy
  */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /**
  * This function is updating the User Profile with assigned roles to him
  * @param event Event
  */
  public onSave(event) {
    const request1 = (<NgcFormGroup>this.updateUserForm).getRawValue();
    /*if (request1.encryptPasswordChange) {
      if (!this.validatePassword(request1.encryptPasswordChange)) {
        this.showErrorStatus('admin.invalid.password.validation');
        return;
      }
    }*/
    // if (request1.cosysLoginFlag) {
    //   request1.passwordChangeFlag = false;
    // } else {
    //   request1.passwordChangeFlag = true;
    // }
    request1.encryptPassword = request1.encryptPasswordChange;
    request1.passwordChangeFlag = request1.cosysLoginFlag;
    request1.restrictedHandlingArea = [];
    if (request1.handlingArea) {
      for (let eachShc of request1.handlingArea) {
        request1.restrictedHandlingArea.push({
          admUserProfileId: request1.profileId,
          handlingArea: eachShc
        });
      }
    }
    request1.restrictedAirlinesData = [];
    if (request1.restrictedAirlines) {
      for (const eachRow of request1.restrictedAirlines) {
        if (eachRow.carrierCode) {
          eachRow.admUserProfileId = request1.profileId;
          request1.restrictedAirlinesData.push(eachRow);
        }
      }
    }
    request1.restrictedAirlines = [];
    request1.restrictedAirlines = request1.restrictedAirlinesData;
    let newArray: any = [];
    for (const eachRow of request1.userRoleAssignments) {
      if (!eachRow.userRoleStartDate || !eachRow.applicationRoleCode.code) {
        this.showErrorStatus('admin.role.date.code.empty');
        return;
      }

      if (eachRow.flagCRUD == 'C' || eachRow.flagCRUD == 'U') {
        if (eachRow.userRoleEndDate != null && eachRow.userRoleEndDate != '') {
          if (eachRow.userRoleEndDate < this.minDate) {
            return this.showErrorMessage(NgcUtility.translateMessage("user.role.enddate.must.greaterthan.currentdate", [eachRow.applicationRoleCode.code]));
          }
        }
        eachRow.customerId = request1.customer.id;
        eachRow.profileId = request1.profileId;
        eachRow.duties = request1.duties;
        if (eachRow.userRoleEndDate != null) {
          eachRow.userRoleEndDate = eachRow.userRoleEndDate;
        }
        eachRow.userRoleStartDate = eachRow.userRoleStartDate;
        eachRow.userTypeCode = request1.userType === 'External' ? 'E' : request1.userType === 'Internal' ? 'I' :
          request1.userType === 'Customer' ? 'C' : request1.userType;
        newArray.push(eachRow);
      }

    }
    request1.userRoleAssignments = newArray;
    request1.cosysLoginFlag = this.updateUserForm.get('cosysLoginFlag').value;
    request1.activeFlag = this.updateUserForm.get('activeFlag').value;
    request1.userTypeCode = request1.userType === 'External' ? 'E' : request1.userType === 'Internal' ? 'I' :
      request1.userType === 'Customer' ? 'C' : request1.userType;
    console.log(JSON.stringify(request1));
    if (request1.encryptPassword && request1.encryptPassword.length > 0) {
      this.adminService.updateUserDetailsWithChangedPassword(request1).subscribe(data1 => {
        if (!this.showResponseErrorMessages(data1)) {
          this.resp = data1;
          this.arrayUser = this.resp.data;
          if (!data1.messageList) {
            let dataToSend = {
              "loginCode": this.resp.data.loginCode
            }
            this.showSuccessStatus('g.completed.successfully');
            this.updateFormArray();
            this.updateUserForm.get('encryptPasswordChange').setValue('');
            this.navigateTo(this.router, '/admin/searchuser', dataToSend);
          } else {
            this.errors = this.resp.messageList;
            this.showErrorStatus(this.errors[0].message);
          }
        }
      },
        error => { this.showErrorMessage(error); });
    } else {
      this.adminService.updateUserDetails(request1).subscribe(data1 => {
        if (!this.showResponseErrorMessages(data1)) {
          this.resp = data1;
          this.arrayUser = this.resp.data;
          if (!data1.messageList) {
            let dataToSend = {
              "loginCode": this.resp.data.loginCode
            }
            this.showSuccessStatus('g.completed.successfully');
            this.updateFormArray();
            this.navigateTo(this.router, '/admin/searchuser', dataToSend);
          } else {
            this.errors = this.resp.messageList;
            this.showErrorStatus(this.errors[0].code);
          }
        }
      },
        error => { this.showErrorMessage(this.errors[0].code); });
    }
  }

  /**
  * This function is used for adding New row for assigning any new Role to the user
  * @param event Event
  */
  public onAddRow(event) {
    const noOfRows = (<NgcFormArray>this.updateUserForm.get('userRoleAssignments')).length;
    const lastRow = noOfRows ? (<NgcFormArray>this.updateUserForm.get('userRoleAssignments')).controls[noOfRows - 1] : null;
    if (noOfRows === 0 || (lastRow.get('userRoleStartDate').value && lastRow.get('applicationRoleCode').get('code').value)) {
      this.disableControls.push({
        roleCodeDisable: false,
        fromDateDisable: false
      });
      (<NgcFormArray>this.updateUserForm.controls['userRoleAssignments']).addValue([
        {
          applicationRoleCode: {
            code: '',
            desc: ''
          },
          customerId: '',
          userRoleEndDate: '',
          userRoleStartDate: '',
          profileId: '',
          userTypeCode: '',
          flagDelete: 'N',
          flagUpdate: 'N',
          flagInsert: 'Y'
        }
      ]);
    }
  }


  onSelect(object) {

    this.updateUserForm.get('duties').setValue(object.desc);

  }

  /**
  * This is a confirmation window before deletion of any role assigned to User
  *
  * @param event Event
  */
  // TODO use index instead of i as parameter
  onConfirm(i) {
    const self = this;
    this.showConfirmMessage('admin.delete.user.assigned.role.confirmation').then(fulfilled => {
      const customer = {
        id: (<NgcFormGroup>this.updateUserForm.controls.customer).controls.id.value
      };
      const userRoleAssignments = [];
      const profileId = this.updateUserForm.controls.profileId.value;
      const userType = this.updateUserForm.controls.userType.value;
      const userTypeCode = (userType === 'External') ? 'E' : (userType === 'Internal') ? 'I' : 'C'
      const shortName = this.updateUserForm.controls.shortName.value;
      const loginCode = this.updateUserForm.controls.loginCode.value;
      const userRoleAssignmentId = this.updateUserForm.controls.userRoleAssignmentId.value;
      const applicationRole = this.updateUserForm.get(['userRoleAssignments', i, 'applicationRoleCode']).value;
      const parentCodeDelete = applicationRole.code;
      const relatedSubUsers = this.updateUserForm.controls.relatedSubUsers.value;
      const deleteRequest = {
        customer: customer,
        profileId: profileId,
        shortName: shortName,
        userType: userType,
        loginCode: loginCode,
        userRoleAssignmentId: userRoleAssignmentId,
        userRoleAssignments: userRoleAssignments,
        relatedSubUsers: relatedSubUsers,
        userTypeCode: userTypeCode,
        parentCodeDelete: parentCodeDelete
      };
      (<NgcFormArray>this.updateUserForm.controls['userRoleAssignments']).deleteValueAt(i);
      this.disableControls.splice(i, 1);
      let tableArray;
      if (i >= this.adminService.dataFromSearchToUpdate.length) {
        return;
      }
      tableArray = this.adminService.dataFromSearchToUpdate.userRoleAssignments;
      tableArray[i].flagDelete = 'Y';
      delete tableArray[i].userRoleEndDate;
      tableArray[i].userRoleStartDate = (tableArray[i].userRoleStartDate);
      deleteRequest.userRoleAssignments.push(tableArray[i]);
      this.adminService.deleteRoleAssignments(deleteRequest).subscribe((data) => {
        console.log(data);
        console.log(i);
      });
    }).catch(reason => {
      console.log('failed' + reason);
    });
  }

  /**
   * This Function will work For On Link Click For Open Window Pop-up
   * @param event
   */
  public onLinkClick(event) {
    this.window.open();
  }

  public updateFormArray() {
    this.disableControls = [];
    const assignRoleArray = (<NgcFormArray>this.updateUserForm.get('userRoleAssignments')).controls;
    for (let i = 0; i < assignRoleArray.length; i++) {
      this.updateUserForm.get('userRoleAssignments.' + i + '.flagUpdate').setValue('Y');
      this.updateUserForm.get('userRoleAssignments.' + i + '.flagInsert').setValue('N');
      this.disableControls.push({
        roleCodeDisable: true,
        fromDateDisable: true
      });
    }
  }

  /**
   * Validate Password
   */
  /* private validatePassword(password) {
     let patt = new RegExp("^(?=.*[A-Z])(?=.*[`~!@#$%^&_-])(?=.*[0-9])(?=.*[a-z])(?=\\S+$).{8,}$");
     return patt.test(password);
   }*/

  public getEntityKey(): string {
    return String(this.updateUserForm.get('loginCode').value);
  }

  onCancel(event) {
    let requesttosearch = this.adminService.userSearchRequest;
    this.navigateTo(this.router, '/admin/searchuser', requesttosearch);
  }

  getRoleFromCopy(forwardData: any) {
    this.adminService.copyUser1(forwardData).subscribe(data => {
      this.resp = data;
      this.refreshFormMessages(data);
      if (this.resp.data !== null) {
        if (this.resp.data.userRoleAssignments.length == 0) {
          this.showErrorStatus("admin.no.roles.copy");
        } else {
          this.updateUserForm.get('userRoleAssignments').patchValue(this.resp.data.userRoleAssignments);
          this.updateFormArray();
          this.testThis();
        }
      }
    });
  }

  public testThis() {
    for (let index = 0; index < this.dataRetrieved.userRoleAssignments.length; index++) {
      this.dataRetrieved.userRoleAssignments[index]['userRoleStartDate'] =
        (this.dataRetrieved.userRoleAssignments[index]['userRoleStartDate']);
      if (this.dataRetrieved.userRoleAssignments[index]['userRoleEndDate'] !== null) {
        this.dataRetrieved.userRoleAssignments[index]['userRoleEndDate'] =
          (this.dataRetrieved.userRoleAssignments[index]['userRoleEndDate']);
      }
    }
    if (this.dataRetrieved.userType === 'C') {
      this.dropDownAny = this.createSourceParameter('C');
    }
    else if (this.dataRetrieved.userType === 'E') {
      this.dropDownAny = this.createSourceParameter('E');
    }
    else if (this.dataRetrieved.userType === 'I') {
      this.dropDownAny = this.createSourceParameter('I');
    }
    this.dataRetrieved.userType = this.dataRetrieved.userType === 'C' ? 'Customer' :
      this.dataRetrieved.userType === 'I' ? 'Internal' : this.dataRetrieved.userType === 'E' ? 'External' : this.dataRetrieved.userType;
    for (let index = 0; index < this.dataRetrieved.userRoleAssignments.length; index++) {
      this.dataRetrieved.userRoleAssignments[index]['flagUpdate'] = 'Y';
      this.disableControls.push({
        roleCodeDisable: true,
        fromDateDisable: true
      });
    }
    if (!this.dataRetrieved.restrictedAirlines || this.dataRetrieved.restrictedAirlines.length === 0) {
      this.dataRetrieved.restrictedAirlines.push({
        carrierCode: null,
        carrierCodeName: null,
        admUserProfileId: null
      })
    } else {
      this.retrieveLOVRecords('CARRIER').subscribe(data => {
        for (const eachRowData of data) {
          for (let index = 0; index < this.dataRetrieved.restrictedAirlines.length; index++) {
            if (this.dataRetrieved.restrictedAirlines[index].carrierCode === eachRowData.code) {
              this.updateUserForm.get(['restrictedAirlines', index, 'carrierCodeName']).setValue(eachRowData.desc);
            }
          }
        }
      });
    }
    this.dataRetrieved.handlingArea = [];
    for (let eachRow of this.dataRetrieved.restrictedHandlingArea) {
      this.dataRetrieved.handlingArea.push(eachRow.handlingArea);
    }
    this.dataRetrieved.encryptPasswordChange = null;
    this.updateUserForm.patchValue(this.dataRetrieved);
    this.updateUserForm.controls.createdOnPopUp.setValue((this.dataRetrieved.createdOn));
    if (this.dataRetrieved.passwordChangedDate !== null) {
      this.updateUserForm.controls.passwordChangedDatePopUp.setValue((this.dataRetrieved.passwordChangedDate));
    }
    this.updateUserForm.get('userType').setValue(this.dataRetrieved.userType);
    if (this.dataRetrieved.userType === 'External') {
      this.updateUserForm.controls.cosysLoginFlag.setValue(true);
      this.updateUserForm.controls.win2kCode.setValue('');
      this.updateUserForm.controls.win2kCode.disable();
      this.showRestrictionFlag = true;
    } else if (this.dataRetrieved.userType === 'Customer') {
      this.updateUserForm.controls.cosysLoginFlag.setValue(true);
      this.updateUserForm.controls.win2kCode.setValue('');
      this.updateUserForm.controls.win2kCode.disable();
      this.showRestrictionFlag = false;
    } else if (this.dataRetrieved.userType === 'Internal') {
      this.updateUserForm.controls.cosysLoginFlag.enable();
      this.updateUserForm.controls.win2kCode.enable();
      this.showRestrictionFlag = true;
    }
  }

  addCarrierRow(index) {
    (<NgcFormArray>this.updateUserForm.controls['restrictedAirlines']).addValue([
      {
        carrierCode: null,
        carrierCodeName: null,
        admUserProfileId: null
      }
    ]);
  }

  deleteCarrierRow(index) {
    (this.updateUserForm.get(['restrictedAirlines', index]) as NgcFormGroup).markAsDeleted();
    this.updateUserForm.get(['restrictedAirlines', index, 'carrierCode']).setValue(null);
  }

  onCarrierCode(event, index) {
    this.updateUserForm.get(['restrictedAirlines', index, 'carrierCodeName']).setValue(null);
    this.retrieveLOVRecords('CARRIER').subscribe(data => {
      for (const eachRow of data) {
        if (eachRow.code === event) {
          this.updateUserForm.get(['restrictedAirlines', index, 'carrierCodeName']).setValue(eachRow.desc);
        }
      }
    });
  }

}
