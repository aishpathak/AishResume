import { ImportService } from '../import.service';
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
import { BDWorkListComponent } from './worklist.component';
import { BuildupService } from '../../export/buildup/buildup.service';
import { AddAccessoryModule } from '../../warehouse/add-accessory/add-accessory.module'


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: BDWorkListComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, AddAccessoryModule
    ],
    exports: [
        BDWorkListComponent
    ],
    providers: [ImportService, BuildupService],
    declarations: [
        BDWorkListComponent
    ],
    bootstrap: []
})
export class BDWorkListModule { }