import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintainHawbInformationComponent } from './maintain-hawb-information.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';


const routes: Routes = [
  // Default
  { path: '', component: MaintainHawbInformationComponent },
  { path: '**', redirectTo: '/' }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  declarations: [MaintainHawbInformationComponent]
})
export class MaintainHawbInformationModule { }
