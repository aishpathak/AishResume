import { BuildupService } from '../buildup.service';
// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';

import { WeightLoadStatementComponent } from './weight-load-statement.component'
/**
 * Route
 */
 const routes: Routes = [
  // Default
  { path: '', component: WeightLoadStatementComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    // Admin Child Routes
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [ WeightLoadStatementComponent ],
  providers: [ BuildupService ],
  declarations: [ WeightLoadStatementComponent ],
  bootstrap: []
})
export class WeightLoadStatementModule { }
