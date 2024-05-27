import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { EIttSubmissionConfirmationCancellationComponent } from "./e-itt-submission-confirmation-cancellation.component";


const routes: Routes = [
  { path: '', component: EIttSubmissionConfirmationCancellationComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  declarations: [EIttSubmissionConfirmationCancellationComponent]
})
export class EIttSubmissionConfirmationCancellationModule { }
