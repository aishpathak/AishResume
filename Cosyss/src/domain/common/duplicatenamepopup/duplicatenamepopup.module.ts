// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, PageConfiguration } from 'ngc-framework';
import { DuplicatenamepopupComponent } from './duplicatenamepopup.component';
import { CommonService } from '../common.service'
/**
 * Route
 */
const routes: Routes = [
  // Default
  { path: '', component: DuplicatenamepopupComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [
    DuplicatenamepopupComponent
  ],
  providers: [
    CommonService
  ],
  declarations: [
    DuplicatenamepopupComponent
  ]
})
export class DuplicatenamepopupModule { }
