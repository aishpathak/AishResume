import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UldRhoPriorityMasterComponent } from './uldRhoPriorityMaster.component';
import { ImportService } from '../../import.service';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  // Default
  { path: '', component: UldRhoPriorityMasterComponent },
  { path: '**', redirectTo: '/' }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  providers: [ImportService],
  declarations: [UldRhoPriorityMasterComponent]
})
export class UldRhoPriorityMasterModule { }
