// Angular
import { NgModule, Input } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
// Core
import {
  NgcCoreModule,
  NgcControlsModule,
  NgcDirectivesModule,
  NgcDomainModule
} from "ngc-framework";

import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  forwardRef,
  ComponentRef,
  ComponentFactoryResolver,
  ViewChild,
  ViewChildren,
  ContentChildren,
  QueryList,
  EventEmitter,
  Output
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NgcPage,
  CacheService,
  UserProfile,
  UserFavourite,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  MessageType,
  StatusMessage,
  NgcWindowComponent,
  NgcDropDownListComponent,
  ErrorMessage
} from "ngc-framework";
import {
  FormGroupDirective,
  FormArray,
  FormGroup,
  FormControl,
  FormControlName,
  Validators
} from "@angular/forms";
import { AuthService } from "../auth.service";
import { LoginReq, LoginResponse, User } from "../auth.shared";

@Component({
  selector: "app-forgotpassword",
  templateUrl: "./forgotpassword.component.html",
  styleUrls: ["./forgotpassword.component.css"]
})
export class ForgotpasswordComponent extends NgcPage {
  errors: any;
  resp: any;
  //forgetpasswordSubmitted: any;
  //@Output() forgetpasswordSubmitted = new EventEmitter<boolean>();
  // @Output() staffId = new EventEmitter<String>();
  // @Output() staffIdNumber = new EventEmitter<String>();


  constructor(
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    appZone: NgZone,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private authService: AuthService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  privateforgotPasswordForm = new NgcFormGroup({
    staffIdNumber: new NgcFormControl(),
    emailID: new NgcFormControl()
  });

  @Output("closewindow")
  change: EventEmitter<number> = new EventEmitter<number>();

  @Output("emitsavedata")
  saveForgotPassData: EventEmitter<number> = new EventEmitter<number>();

  submitForgotPassword() {
    const forgotreq = this.privateforgotPasswordForm.getRawValue();
    const forgotrequest: User = forgotreq;
    this.authService.forgotPassword(forgotrequest).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.resp = data.data;
        this.privateforgotPasswordForm.patchValue(this.resp);
        if (this.resp.isvalid) {
          setTimeout(() => {
            this.showMessage("auth.pass.email.success").then(() => {
            });
            this.privateforgotPasswordForm.reset();
          }, 1000);

          this.change.emit(7);
        } else {

          this.showErrorMessage("auth.validation.failed");
          this.privateforgotPasswordForm.reset();
        }
      }
    }, error => {
      this.showErrorMessage(error);
    }
    );
  }
  onCancel() {
    this.change.emit(7);
  }
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgcCoreModule,
    NgcControlsModule,
    NgcDirectivesModule,
    NgcDomainModule
  ],
  exports: [ForgotpasswordComponent],
  declarations: [ForgotpasswordComponent],
  providers: [AuthService]
})
export class ForgotPasswordModule { }
