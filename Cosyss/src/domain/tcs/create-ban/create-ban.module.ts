import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';
import { CreateBanComponent } from './create-ban.component';

const routes: Routes = [
  { path: '', component: CreateBanComponent },
  { path: '**', redirectTo: '/' }
];
@NgModule({
  imports: [
    RouterModule,
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule],
  exports: [CreateBanComponent],
  declarations: [CreateBanComponent],
  providers: [TcsService]
})
export class CreateBanModuleWithoutRoute { }
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, CreateBanModuleWithoutRoute],
  exports: [CreateBanComponent],
  providers: [TcsService]
})
export class CreateBanModule { }