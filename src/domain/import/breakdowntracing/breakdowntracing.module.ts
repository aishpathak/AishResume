import { ImportService } from '../import.service';
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
import { BreakdowntracingComponent } from './breakdowntracing.component';


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: BreakdowntracingComponent },
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
        BreakdowntracingComponent
    ],
    providers: [ImportService],
    declarations: [
        BreakdowntracingComponent
    ],
    bootstrap: []
})
export class BreakdowntracingModule { }