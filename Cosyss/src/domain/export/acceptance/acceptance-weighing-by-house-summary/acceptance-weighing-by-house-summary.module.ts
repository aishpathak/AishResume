// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { AcceptanceService } from '../acceptance.service';
import { ExportService } from '../../export.service';
import { AcceptanceWeighingByHouseSummaryComponent } from './acceptance-weighing-by-house-summary.component';
import { CargoProcessingEngineService } from '../../../warehouse/cargoprocessingengine/cargoprocessingengine.service';

const routes: Routes = [
  // Default
  { path: '', component: AcceptanceWeighingByHouseSummaryComponent },
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
    AcceptanceWeighingByHouseSummaryComponent
  ],
  providers: [
    AcceptanceService, ExportService, CargoProcessingEngineService
  ],
  declarations: [
    AcceptanceWeighingByHouseSummaryComponent
  ],
  bootstrap: []
})
export class AcceptanceWeighingByHouseSummaryModule { }