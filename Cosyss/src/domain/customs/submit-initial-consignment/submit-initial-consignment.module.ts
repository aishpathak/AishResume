import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CustomACESService } from './../customs.service';
import { SubmitInitialConsignmentComponent } from './submit-initial-consignment.component';

const routes: Routes = [

  { path: '', component: SubmitInitialConsignmentComponent },
  { path: '**', redirectTo: '/' }

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

  ],

  exports: [SubmitInitialConsignmentComponent],

  providers: [CustomACESService],

  declarations: [SubmitInitialConsignmentComponent]

})
export class SubmitInitialConsignmentModule { }
