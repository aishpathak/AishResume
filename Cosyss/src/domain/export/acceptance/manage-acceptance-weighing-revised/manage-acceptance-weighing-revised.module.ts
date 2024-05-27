import { AcceptanceService } from './../acceptance.service';
import { ExportService } from './../../export.service';
import { TracingService } from './../../../tracing/tracing.service';
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
import { ManageAcceptanceWeighingRevisedComponent } from './manage-acceptance-weighing-revised.component'


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: ManageAcceptanceWeighingRevisedComponent },
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
        ManageAcceptanceWeighingRevisedComponent
    ],
    providers: [AcceptanceService, ExportService, TracingService],
    declarations: [
        ManageAcceptanceWeighingRevisedComponent
    ],
    bootstrap: []
})
export class ManageAcceptanceWeighingRevisedModule { }
