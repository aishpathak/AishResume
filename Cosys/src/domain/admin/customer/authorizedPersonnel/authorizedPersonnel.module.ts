
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
import { AuthorizedPersonnelComponent } from './authorizedPersonnel.component';
import { CommonRoutingModule, CommonsModule } from '../../../common/common.module';
import { DuplicatenamepopupComponent } from '../../../common/duplicatenamepopup/duplicatenamepopup.component';
import { DuplicatenamepopupModule } from '../../../common/duplicatenamepopup/duplicatenamepopup.module';


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: AuthorizedPersonnelComponent },
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
        AuthorizedPersonnelComponent
    ],
    declarations: [
        AuthorizedPersonnelComponent
    ],
    bootstrap: []
})
export class AuthorizedPersonnelModule { }
