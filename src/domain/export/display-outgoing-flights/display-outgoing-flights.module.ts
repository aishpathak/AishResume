import { ExportService } from './../export.service';
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
import { DisplayOutgoingFlightsComponent } from './display-outgoing-flights.component'


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: DisplayOutgoingFlightsComponent },
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
        DisplayOutgoingFlightsComponent
    ],
    providers: [ExportService],
    declarations: [
        DisplayOutgoingFlightsComponent
    ],
    bootstrap: []
})
export class DisplayOutgoingFlightsModule { }
