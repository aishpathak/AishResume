import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceptanceService } from './../acceptance.service';
import { ExportService } from './../../export.service';
/**
 *  Admin Routing Module
 *
 * @copyright SATS Singapore 2017-18
 */

// Angular

import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { AcceptanceMonitoringByHouseComponent } from './acceptance-monitoring-by-house.component'


const routes: Routes = [
  // Default
  { path: '', component: AcceptanceMonitoringByHouseComponent },
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
    AcceptanceMonitoringByHouseComponent
  ],
  providers: [AcceptanceService, ExportService],
  declarations: [
    AcceptanceMonitoringByHouseComponent
  ],
  bootstrap: []
})
export class AcceptanceMonitoringByHouseModule { }
