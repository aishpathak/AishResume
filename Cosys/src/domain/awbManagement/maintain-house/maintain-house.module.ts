
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

import { MaintainHouseComponent } from './maintain-house.component';
import { AwbManagementService } from '../awbManagement.service'


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: MaintainHouseComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        // Admin Child Routes
        //RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [
        MaintainHouseComponent
    ],
    providers: [AwbManagementService],
    declarations: [
        MaintainHouseComponent
    ],
    bootstrap: []
})
export class MaintainHouseModule { }
@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, MaintainHouseModule
    ],
    exports: [

    ],
    providers: [],
    declarations: [

    ],
    bootstrap: []
})
export class MaintainHouseRouteModule { }