import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintainHawbListComponent } from './maintain-hawb-list.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { DatePipe } from '@angular/common'


const routes: Routes = [
  // Default
  { path: '', component: MaintainHawbListComponent },
  { path: '**', redirectTo: '/' }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  declarations: [MaintainHawbListComponent],
})
export class MaintainHawbListModule { }
