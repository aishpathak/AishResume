// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core

import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { AcceptanceService } from '../acceptance.service';
import { ExportService } from '../../export.service';
import { CargoProcessingEngineService } from '../../../warehouse/cargoprocessingengine/cargoprocessingengine.service';


import { AcceptanceweighingComponent } from './acceptanceweighing.component';

/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: AcceptanceweighingComponent },
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
        AcceptanceweighingComponent
    ],
    providers: [
        AcceptanceService, ExportService, CargoProcessingEngineService
    ],
    declarations: [
        AcceptanceweighingComponent
    ],
    bootstrap: []
})
export class AcceptanceweighingModule { }
