
import { AdminService } from '../../admin.service';
import { UpdateRoleComponent } from '../update-role/update-role.component';
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

/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: UpdateRoleComponent },
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
        UpdateRoleComponent
    ],
    declarations: [
        UpdateRoleComponent
    ],
    bootstrap: [],
    providers: [AdminService]
})
export class UpdateRoleModule { }
