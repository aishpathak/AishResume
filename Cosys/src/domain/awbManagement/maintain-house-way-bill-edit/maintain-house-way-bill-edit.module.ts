
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

import { MaintainHouseWayBillEditComponent } from './maintain-house-way-bill-edit.component';


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: MaintainHouseWayBillEditComponent },
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
        MaintainHouseWayBillEditComponent
    ],
    providers: [],
    declarations: [
        MaintainHouseWayBillEditComponent
    ],
    bootstrap: []
})
export class MaintainHouseWayBillEditModule { }