// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
// Cosys
import { ForgotPasswordModule } from './forgotpassword/forgotpassword.component';
import { ChangePasswordModule } from './changepassword/changepassword.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { AuthService } from './auth.service';

const routes: Routes = [
  { path: 'changepassword', component: ChangepasswordComponent },
  { path: 'changepassword/unauth', component: ChangepasswordComponent }
];

@NgModule({
  imports: [
    // Child Routes
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
    ForgotPasswordModule, ChangePasswordModule
  ],
  exports: [],
  declarations: [
  ],
  providers: [AuthService]
})
export class AuthRoutingModule {
}
