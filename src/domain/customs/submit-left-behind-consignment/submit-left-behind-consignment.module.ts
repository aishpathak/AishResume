import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitLeftBehindConsignmentComponent } from './submit-left-behind-consignment.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CustomACESService } from './../customs.service';



const routes: Routes = [

  { path: '', component: SubmitLeftBehindConsignmentComponent },
  { path: '**', redirectTo: '/' }
];
@NgModule({
  imports: [

    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

  ],
  exports: [SubmitLeftBehindConsignmentComponent],
  providers: [CustomACESService],
  declarations: [SubmitLeftBehindConsignmentComponent]
})
export class SubmitLeftBehindConsignmentModule { }
