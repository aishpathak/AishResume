
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
import { MaintainCustomerMasterComponent } from './maintain-customer-master.component';

/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: MaintainCustomerMasterComponent },
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
        MaintainCustomerMasterComponent
    ],
    declarations: [
        MaintainCustomerMasterComponent
    ],
    bootstrap: []
})
export class MaintainCustomerMasterModule { }
