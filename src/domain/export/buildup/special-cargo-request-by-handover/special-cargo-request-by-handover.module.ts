// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { SpecialCargoRequestByHandoverComponent } from './special-cargo-request-by-handover.component';
import { ExportService } from '../../export.service';
import { BuildupService } from '../buildup.service';

/**
 * Route
 */
const routes: Routes = [
  // Default
  { path: '', component: SpecialCargoRequestByHandoverComponent },
  { path: '**', redirectTo: '/' }
];


@NgModule({
  imports: [
    // Admin Child Routes
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [
    SpecialCargoRequestByHandoverComponent
  ],
  providers: [ExportService, BuildupService],
  declarations: [SpecialCargoRequestByHandoverComponent],
  bootstrap: []
})
export class SpecialCargoRequestByHandoverModule { }
