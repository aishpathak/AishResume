import { ImportService } from '../import.service';




// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { IssueGroupDOComponent } from './issueGroupDO.component';





/**
 * Route
 */
const routes: Routes = [
  // Default
  { path: '', component: IssueGroupDOComponent },
  { path: '**', redirectTo: '/' }
];


@NgModule({
  imports: [
    // Admin Child Routes
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [
    IssueGroupDOComponent
  ],
  providers: [ImportService],
  declarations: [IssueGroupDOComponent],
  bootstrap: []
})
export class IssueGroupDOModule { }
