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
import { ShipmentForCustomInspectionComponent } from "./shipment-for-custom-inspection.component";
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';



const routes: Routes = [
    // Default
    { path: '', component: ShipmentForCustomInspectionComponent },
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
        ShipmentForCustomInspectionComponent
    ],
    providers: [ImportService],
    declarations: [
        ShipmentForCustomInspectionComponent
    ],
    bootstrap: []
})
export class ShipmentForCustomInspectionModule { }