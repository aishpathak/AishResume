
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
import { AwbManagementComponent } from './awb-management.component';
import { AwbManagementService } from '../awbManagement.service';


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: AwbManagementComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        // Admin Child Routes
        // RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [
        AwbManagementComponent
    ],
    providers: [AwbManagementService],
    declarations: [
        AwbManagementComponent
    ],
    bootstrap: []
})
export class AwbManagementModule { }
@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, AwbManagementModule
    ],
    exports: [

    ],
    providers: [AwbManagementService],
    declarations: [

    ],
    bootstrap: []
})
export class AwbManagementRouteModule { }