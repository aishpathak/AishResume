
import { AdminService } from '../../admin.service';
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
import { RcarAgentGroupComponent } from './rcar-agent-group.component';

/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: RcarAgentGroupComponent },
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
        RcarAgentGroupComponent
    ],
    declarations: [
        RcarAgentGroupComponent
    ],
    bootstrap: []
})
export class RcarAgentGroupModule { }
