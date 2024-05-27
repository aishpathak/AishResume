// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, NgcUtility } from 'ngc-framework';

import {
  Component, OnInit, NgZone, ElementRef, ViewContainerRef, forwardRef, ComponentRef,
  ComponentFactoryResolver, ViewChild, ViewChildren, ContentChildren, QueryList,
  Input, Output, EventEmitter
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NgcPage, CacheService, UserProfile, UserFavourite, NgcApplication,
  NgcFormGroup, NgcFormArray, NgcFormControl, MessageType, StatusMessage, NgcWindowComponent, NgcDropDownListComponent, ErrorMessage
} from 'ngc-framework';
import { FormGroupDirective, FormArray, FormGroup, FormControl, FormControlName, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ChangePasswordReq, ChangepasswordResponse, User } from '../auth.shared';

@Component({
  selector: 'app-changepassword',
  inputs: ['staffIdFromfp'],
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent extends NgcApplication {
  passwordChanged = false;
  resp: any;
  // @Input('loginId') loginId: string;
  @Input('staffIdFromfp') staffIdFromfp: string;
  //@Input('userId') userId: string;
  @Input('staffIdNumber') staffIdNumber: string;
  @Input('userId') userId: string;

  ngOnInit() {
    console.log("staff id:" + this.staffIdNumber + " " + "staff fp:" + this.userId);
  }

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    appComponentResolver: ComponentFactoryResolver, private router: Router, private activatedRouter: ActivatedRoute,
    private authService: AuthService) {
    super(appZone, appElement, appContainerElement, appComponentResolver);
  }
  private changePasswordForm = new NgcFormGroup({
    staffIdNumber: new NgcFormControl(),
    userId: new NgcFormControl(),
    currentPassword: new NgcFormControl(),
    newPassword: new NgcFormControl(),
    confirmPassword: new NgcFormControl(),
    password: new NgcFormControl(),

  });

  // @Input('userId') userId: string;

  @Output('closewindow')
  change: EventEmitter<number> = new EventEmitter<number>();
  clearChangePassword(event) {
    this.changePasswordForm.reset();
    // if (this.authService.getCurrentUser().lastLoginDateTime != null) {
    //   this.router.navigate(['/misc/home']);
    // }
    // if (this.authService.getCurrentUser().lastLoginDateTime == null) {
    //   this.authService.logout();
    // }
  }

  validatePassword(currentPassword) {
    var patt = new RegExp("^(?=.*[A-Z])(?=.*[`~!@#$%^&_-])(?=.*[0-9])(?=.*[a-z])(?=\\S+$).{8,}$");
    return patt.test(currentPassword);
  }

  changePassword(event) {

    // if (!this.changePasswordForm.valid) {
    //   this.showErrorStatus('Please fill the fields');
    //   return;
    // }

    this.changePasswordForm.get('userId').setValue(this.userId);
    const changePasswordRequest = this.changePasswordForm.getRawValue();
    const changePasswordReq: User = changePasswordRequest;
    const userProfile: UserProfile = this.getUserProfile();

    if (this.userId) {
      changePasswordRequest.userName = this.changePasswordForm.get('userId').value;
    } else if (userProfile && userProfile.userLoginCode) {
      changePasswordRequest.userName = userProfile.userLoginCode;
    }

    // if (changePasswordReq.currentPassword == changePasswordReq.newPassword) {
    //   this.showErrorStatus('Current Password and New Password should not be same !');
    //   return;
    // }
    // if (!this.validatePassword(changePasswordReq.newPassword)) {
    //   this.showErrorStatus('Invalid New Password! Password must be at least 8 characters and include a combination of uppercase, lowercase letters & numbers');
    //   return;
    // }

    // if (changePasswordReq.newPassword !== changePasswordReq.confirmPassword) {
    //   this.showErrorStatus('New Password and Confirm New Password not Matched!');
    //   return;
    // }
    // if (!this.validatePassword(changePasswordReq.confirmPassword)) {
    //   this.showErrorStatus('Invalid Confirm New Password!');
    //   return;
    // }

    this.authService.changePassword(changePasswordReq).subscribe(
      data => {
        this.resp = data.data;
        if (this.resp) {
          console.log('response---------' + this.resp);
          if (this.resp.messageList.length > 0) {
            let obh = this.resp.messageList[0];
            let code = obh['code'];
            this.showErrorMessage(code);
            return;
          } else {
            this.change.emit(7);
            this.showMessage("auth.pass.change").then(() => {
              // Remove Authorization Token
              this.updateAuthorizationToken(null);
              // Clear Cache
              this.clearCache();
              // Navigtate to Base URL
              this.navigateHome();
            });
          }
        }
      },
      error => { this.showErrorStatus('auth.pass.change.error'); }
    );
  }

  onCancel() {
    this.change.emit(7);
    this.navigateBack(null);
  }
}

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [ChangepasswordComponent],
  declarations: [
    ChangepasswordComponent
  ],
  providers: [AuthService]
})
export class ChangePasswordModule {
}