import { Router, ActivatedRoute } from '@angular/router';
import { Component, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration, NgcUtility, DateTimeKey } from 'ngc-framework';
import { AdminService } from '../../admin.service';
import { Validators } from '@angular/forms';

// TODO remove unused imports
// TODO Use JSDoc style comments for functions, interfaces, enums, and classes
// TODO html remove save and clear events on titlebar or implement corresponding function
@Component({
  selector: 'ngc-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
/**
 * Create User Component is responsible to create the user profile along with
 * Roles assigned to him
 */
@PageConfiguration({
  trackInit: true
  // callNgOnInitOnClear: true,
  // autoBackNavigation: true,
  // dontRestoreOnBrowserBack: true,
  // restorePageOnBack: false
})
export class CreateUserComponent extends NgcPage {
  resp: any;
  errors: any[];
  arrayUser: any[];
  minDate: Date;
  // customerValue: any;
  dataRetrieved: any;
  lovForRoleCode: any;
  forwardedData: any;
  lovForCustomer = false;
  lovForInternal = false;
  lovForExternal = false;
  showRestriction = false;
  showRestrictionFlag = false;
  lovForRoleCodeInternal: any;
  lovForRoleCodeExternal: any;
  lovForRoleCodeCustomer: any;
  userUploadLoginCode: any;
  userUploadAccessType: any;
  /**
  * Initialize
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private adminService: AdminService, private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }
  private createUserForm: NgcFormGroup = new NgcFormGroup({
    activeFlag: new NgcFormControl(false),
    cosysLoginFlag: new NgcFormControl(false),
    lovValue: new NgcFormControl(),
    customer: new NgcFormGroup
      ({
        id: new NgcFormControl(),
        name: new NgcFormControl()
      }),
    departmentCode: new NgcFormControl(),
    handlingArea: new NgcFormControl(),
    emailId: new NgcFormControl(null, [Validators.maxLength(60)]),
    encryptPassword: new NgcFormControl(''),
    gradeCode: new NgcFormControl(),
    userDigitalSignature: new NgcFormControl(),
    signatureFlag: new NgcFormControl(false),
    photoFlag: new NgcFormControl(false),
    userPhotograph: new NgcFormControl(),
    initialCode: new NgcFormControl('', [Validators.maxLength(6)]),
    loginCode: new NgcFormControl('', [Validators.required, Validators.maxLength(8)]),
    passportOrFinDescription: new NgcFormControl('', [Validators.maxLength(20)]),
    phoneNumber: new NgcFormControl('', [Validators.maxLength(10)]),
    profileId: new NgcFormControl(0),
    shortName: new NgcFormControl('', [Validators.required, Validators.maxLength(35)]),
    staffIdNumber: new NgcFormControl('', [Validators.maxLength(10)]),
    userRoleAssignments: new NgcFormArray([]),
    restrictedAirlines: new NgcFormArray([
      new NgcFormGroup({
        carrierCode: new NgcFormControl(),
        carrierCodeName: new NgcFormControl()
      })
    ]),
    restrictedHandlingArea: new NgcFormArray([]),
    userType: new NgcFormControl('', [Validators.required, Validators.maxLength(20)]),
    win2kCode: new NgcFormControl('', [Validators.maxLength(60)])
  });

  public ngOnInit(): void {
    super.ngOnInit();
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    const today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    if (null !== this.forwardedData) {
      this.getRoleFromCopy(this.forwardedData);
    }

    this.createUserForm.controls.userPhotograph.valueChanges.subscribe(data => {
      if (data) {
        this.createUserForm.controls.photoFlag.setValue(true);
      }
    });

    this.createUserForm.controls.userDigitalSignature.valueChanges.subscribe(data => {
      if (data) {
        this.createUserForm.controls.signatureFlag.setValue(true);
      }
    });

    this.createUserForm.controls.userType.valueChanges.subscribe(
      (newValue) => {
        if (newValue === 'External') {
          this.createUserForm.controls.cosysLoginFlag.setValue(true);
          this.createUserForm.controls.cosysLoginFlag.disable();
          this.createUserForm.controls.win2kCode.setValue('');
          this.createUserForm.controls.win2kCode.disable();
          this.showRestriction = true;
          this.showRestrictionFlag = true;
        }
        if (newValue === 'Customer') {
          this.createUserForm.controls.cosysLoginFlag.setValue(true);
          this.createUserForm.controls.cosysLoginFlag.disable();
          this.createUserForm.controls.win2kCode.setValue('');
          this.createUserForm.controls.win2kCode.disable();
          this.showRestriction = true;
          this.showRestrictionFlag = false;
        }
        if (newValue === 'Internal') {
          this.createUserForm.controls.cosysLoginFlag.enable();
          this.createUserForm.controls.win2kCode.enable();
          this.showRestriction = true;
          this.showRestrictionFlag = true;
        }
      }
    );


  }
  /**
  * On Destroy
  */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
  /**
  * This function is saving the User Profile with assigned roles to him
  * @param event Event
  */
  public onSave(event) {
    this.createUserForm.validate();
    if (!this.createUserForm.valid) {
      return;
    }
    const request = (<NgcFormGroup>this.createUserForm).getRawValue();
    /* if (request.encryptPassword) {
       if (!this.validatePassword(request.encryptPassword)) {
         this.showErrorStatus('admin.invalid.password.validation');
         return;
       }
     }*/
    if (request.initialCode) {
      if (request.initialCode !== request.loginCode) {
        this.showErrorStatus('admin.login.initial.same');
        return;
      }
    }
    if (request.cosysLoginFlag) {
      request.passwordChangeFlag = false;
    } else {
      request.passwordChangeFlag = true;
    }

    for (const eachRow of request.userRoleAssignments) {
      eachRow.customerId = request.customer.id;
      eachRow.userTypeCode = request.userType === 'External' ? 'E' : request.userType === 'Internal' ? 'I' :
        request.userType === 'Customer' ? 'C' : request.userType;
    }
    if (this.createUserForm.get('staffIdNumber').value === "") {
      this.createUserForm.get('staffIdNumber').setValue(null);
    }


    request.photoFlag = this.createUserForm.get('photoFlag').value;
    request.signatureFlag = this.createUserForm.get('signatureFlag').value;
    request.cosysLoginFlag = this.createUserForm.get('cosysLoginFlag').value;
    request.activeFlag = this.createUserForm.get('activeFlag').value;
    request.userType = request.userType === 'External' ? 'E' : request.userType === 'Internal' ? 'I' :
      request.userType === 'Customer' ? 'C' : request.userType;
    request.staffIdNumber = this.createUserForm.get('staffIdNumber').value;
    for (const obj of request.userRoleAssignments) {
      if (!obj.userRoleStartDate || !obj.applicationRoleCode.code) {
        this.showErrorStatus('admin.role.date.code.empty');
        return;
      }
    }
    request.restrictedHandlingArea = [];
    if (request.handlingArea) {
      for (let eachShc of request.handlingArea) {
        request.restrictedHandlingArea.push({
          admUserProfileId: request.profileId,
          handlingArea: eachShc
        });
      }
    }
    request.restrictedAirlinesData = [];
    if (request.restrictedAirlines) {
      for (const eachRow of request.restrictedAirlines) {
        if (eachRow.carrierCode) {
          request.restrictedAirlinesData.push(eachRow);
        }
      }
    }
    request.restrictedAirlines = [];
    request.restrictedAirlines = request.restrictedAirlinesData;
    this.adminService.saveUserDetails(request).subscribe(data1 => {
      if (!this.showResponseErrorMessages(data1)) {
        this.resp = data1;
        this.arrayUser = this.resp.data;
        // this.refreshFormMessages(data1);
        if (!data1.messageList) {
          let dataToSend = {
            "loginCode": this.resp.data.loginCode
          }
          this.showSuccessStatus('g.completed.successfully');
          this.navigateTo(this.router, '/admin/searchuser', dataToSend);
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].code);
        }
      }
    },
      error => { this.showErrorStatus(NgcUtility.translateMessage(this.errors[0].code, [])); });
  }
  /**
  * This function is used for adding New row for assigning any new Role to the user
  * @param event Event
  */
  public onAddRow(event) {
    const noOfRows = (<NgcFormArray>this.createUserForm.get('userRoleAssignments')).length;
    const lastRow = noOfRows ? (<NgcFormArray>this.createUserForm.get('userRoleAssignments')).controls[noOfRows - 1] : null;
    if (noOfRows === 0 || (lastRow.get('userRoleStartDate').value && lastRow.get('applicationRoleCode').get('code').value)) {
      (<NgcFormArray>this.createUserForm.controls['userRoleAssignments']).addValue([
        {
          applicationRoleCode: {
            code: ''
          },
          customerId: '',
          userTypeCode: '',
          userRoleEndDate: '',
          userRoleStartDate: ''
        }
      ]);
    }
  }
  /**
  * This is a confirmation window before deletion of any role assigned to User
  * @param event Event
  */
  // TODO better naming convention, use something like index
  onConfirm(i) {
    const self = this;
    this.showConfirmMessage('admin.delete.user.assigned.role.confirmation').then(fulfilled => {
      (<NgcFormArray>this.createUserForm.controls['userRoleAssignments']).deleteValueAt(i);
      const tableArray = (<NgcFormArray>this.createUserForm.controls['userRoleAssignments']).getRawValue();
    }).catch(reason => {
    });
  }
  /**
   * This function is responsible for selecting the Value from company's LOV
   * @param object
   */
  public onSelect(object) {
    this.createUserForm.get('lovValue').setValue(object.code);
    // this.customerValue = object.param1;
    this.createUserForm.controls.customer.get('id').setValue(object.param1);
  }
  /**
   * This function is responsible for selecting the Value from
   * @param object
   */
  public selectUserType(event) {
    this.createUserForm.get('lovValue').setValue(event.code);
    // this.createUserForm.controls.customer.get('id').setValue(event.param1);
    if (event.code === 'Internal') {
      this.lovForInternal = true;
      this.lovForExternal = false;
      this.lovForCustomer = false;
      this.showRestriction = true;
      this.showRestrictionFlag = true;
    } else if (event.code === 'External') {
      this.lovForInternal = false;
      this.lovForCustomer = false;
      this.lovForExternal = true;
      this.showRestriction = true;
      this.showRestrictionFlag = true;
    } else {
      this.lovForInternal = false;
      this.lovForExternal = false;
      this.lovForCustomer = true;
      this.showRestriction = true;
      this.showRestrictionFlag = false;
    }
  }

  /**
   * Validate Password
   */
  /*
  private validatePassword(password) {
    let patt = new RegExp("^(?=.*[A-Z])(?=.*[`~!@#$%^&_-])(?=.*[0-9])(?=.*[a-z])(?=\\S+$).{8,}$");
    return patt.test(password);
  }*/

  public getEntityKey(): string {
    return String(this.createUserForm.get('loginCode').value);
  }

  onCancel(event) {
    this.navigateTo(this.router, '/admin/searchuser', this.forwardedData);
  }

  getRoleFromCopy(forwardData: any) {
    this.adminService.copyUser1(forwardData).subscribe(data => {
      this.resp = data;
      this.refreshFormMessages(data);
      if (this.resp.data !== null) {
        this.createUserForm.get('userType').setValue(this.resp.data.userTypeDesc);
        this.createUserForm.get('customer').get('id').setValue(this.resp.data.customer.id);
        this.createUserForm.get('customer').get('name').setValue(this.resp.data.customer.name);
        if (this.createUserForm.get('userType').value != null) {
          this.selectUserType(this.createUserForm.get('userType').value);
        }
        this.createUserForm.get('userRoleAssignments').patchValue(this.resp.data.userRoleAssignments);
        if(this.resp.data.restrictedAirlines != null){
          (<NgcFormArray>this.createUserForm.controls['restrictedAirlines']).patchValue(this.resp.data.restrictedAirlines);
        }

        if(this.resp.data.restrictedHandlingAreas != null){
          this.createUserForm.get('handlingArea').setValue(this.resp.data.restrictedHandlingAreas);
          this.showRestrictionFlag = true;
        }       
      }
    });
  }

  addCarrierRow(index) {
    (<NgcFormArray>this.createUserForm.controls['restrictedAirlines']).addValue([
      {
        carrierCode: null,
        carrierCodeName: null
      }
    ]);
  }

  deleteCarrierRow(index) {
    (this.createUserForm.get(['restrictedAirlines', index]) as NgcFormGroup).markAsDeleted();
  }

  onCarrierCode(event, index) {
    this.createUserForm.get(['restrictedAirlines', index, 'carrierCodeName']).setValue(null);
    this.retrieveLOVRecords('CARRIER').subscribe(data => {
      for (const eachRow of data) {
        if (eachRow.code === event) {
          this.createUserForm.get(['restrictedAirlines', index, 'carrierCodeName']).setValue(eachRow.desc);
        }
      }
    }
    );
  }
}