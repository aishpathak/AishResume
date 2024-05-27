import { AcceptanceService } from './../acceptance.service';
import { ExportService } from './../../export.service';
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
import { AutoweighCapturedUldListComponent } from './autoweigh-captured-uld-list.component'


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: AutoweighCapturedUldListComponent },
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
        AutoweighCapturedUldListComponent
    ],
    providers: [AcceptanceService, ExportService],
    declarations: [
        AutoweighCapturedUldListComponent
    ],
    bootstrap: []
})
export class AutoweighCapturedUldListModule { }
