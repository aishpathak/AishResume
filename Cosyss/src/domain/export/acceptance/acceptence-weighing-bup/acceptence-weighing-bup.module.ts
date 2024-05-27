import { AcceptanceService } from './../acceptance.service';
import { ExportService } from './../../export.service';
import { BuildupService } from './../../buildup/buildup.service';
/**
 *  Admin Routing Module
 *
 * @copyright SATS Singapore 2017-18
 */

// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { AcceptenceWeighingBupComponent } from './acceptence-weighing-bup.component'


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: AcceptenceWeighingBupComponent },
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
        AcceptenceWeighingBupComponent
    ],
    providers: [AcceptanceService, ExportService, BuildupService],
    declarations: [
        AcceptenceWeighingBupComponent
    ],
    bootstrap: []
})
export class AcceptenceWeighingBupModule { }
