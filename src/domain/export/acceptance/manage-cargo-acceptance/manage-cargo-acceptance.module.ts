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
import { ManageCargoAcceptanceComponent } from './manage-cargo-acceptance.component';
import { CommonsModule } from '../../../common/common.module';


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: ManageCargoAcceptanceComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, CommonsModule
    ],
    exports: [
        ManageCargoAcceptanceComponent
    ],
    providers: [AcceptanceService, ExportService],
    declarations: [
        ManageCargoAcceptanceComponent
    ],
    bootstrap: []
})
export class ManageCargoAcceptanceModule { }
