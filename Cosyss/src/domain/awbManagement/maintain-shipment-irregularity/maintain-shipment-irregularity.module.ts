
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
import { MaintainShipmentIrregularityComponent } from './maintain-shipment-irregularity.component';


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: MaintainShipmentIrregularityComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [
        MaintainShipmentIrregularityComponent
    ],
    providers: [],
    declarations: [
        MaintainShipmentIrregularityComponent
    ],
    bootstrap: []
})
export class MaintainShipmentIrregularityModule { }

@NgModule({
    imports: [
        // Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
        MaintainShipmentIrregularityModule
    ],
    exports: [
    ],
    providers: [],
    declarations: [
    ],
    bootstrap: []
})
export class MaintainShipmentIrregularityRouteModule { }