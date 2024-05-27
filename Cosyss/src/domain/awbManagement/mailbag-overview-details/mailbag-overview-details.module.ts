
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
import { MailbagOverviewDetailsComponent } from './mailbag-overview-details.component';


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: MailbagOverviewDetailsComponent },
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
        MailbagOverviewDetailsComponent
    ],
    providers: [],
    declarations: [
        MailbagOverviewDetailsComponent
    ],
    bootstrap: []
})
export class MailbagOverviewDetailsModule { }