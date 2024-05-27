import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitReconciliationMessageComponent } from './submit-reconciliation-message.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CustomACESService } from './../customs.service';


const routes: Routes = [

  { path: '', component: SubmitReconciliationMessageComponent },
  { path: '**', redirectTo: '/' }
];
@NgModule({
  imports: [

    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

  ],
  exports: [SubmitReconciliationMessageComponent],
  providers: [CustomACESService],
  declarations: [SubmitReconciliationMessageComponent]
})
export class SubmitReconciliationMessageModule { }
