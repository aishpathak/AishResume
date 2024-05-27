import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitReconciliationErrordetailsComponent } from './submit-reconciliation-errordetails.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CustomACESService } from './../customs.service';


const routes: Routes = [

  { path: '', component: SubmitReconciliationErrordetailsComponent },
  { path: '**', redirectTo: '/' }
];
@NgModule({
  imports: [

    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

  ],
  exports: [SubmitReconciliationErrordetailsComponent],
  providers: [CustomACESService],
  declarations: [SubmitReconciliationErrordetailsComponent]
})
export class SubmitReconciliationErrordetailsModule { }
