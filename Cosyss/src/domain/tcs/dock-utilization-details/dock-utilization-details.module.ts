import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockUtilizationDetailsComponent } from './dock-utilization-details.component';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';

const routes: Routes = [

  { path: "", component: DockUtilizationDetailsComponent },

  { path: '**', redirectTo: '/' }

];


@NgModule({
  imports: [

    RouterModule.forChild(routes),

    CommonModule, ReactiveFormsModule, RouterModule,

    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

  ],
  declarations: [DockUtilizationDetailsComponent],
  providers: [TcsService]

})
export class DockUtilizationDetailsModule { }
