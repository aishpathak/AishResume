
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
import { AwbManagementService } from '../awbManagement.service';
import { ChangeAwbHawbComponent } from './change-awb-hawb.component';


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: ChangeAwbHawbComponent },
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
        ChangeAwbHawbComponent
    ],
    providers: [],
    declarations: [
        ChangeAwbHawbComponent
    ],
    bootstrap: []
})
export class ChangeAwbHawbModule { }