import { ExportService } from './../../export.service';
import { BuildupService } from '../buildup.service';
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
import { OutgoingFlightsComponent } from './outgoing-flights.component'


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: OutgoingFlightsComponent },
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
        OutgoingFlightsComponent
    ],
    providers: [ExportService, BuildupService],
    declarations: [
        OutgoingFlightsComponent
    ],
    bootstrap: []
})
export class OutgoingFlightsModule { }
