
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
import { MaintainRemarkComponent } from './maintain-remark.component';


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: MaintainRemarkComponent },
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
        MaintainRemarkComponent
    ],
    providers: [],
    declarations: [
        MaintainRemarkComponent
    ],
    bootstrap: []
})
export class MaintainRemarkModule { }
@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, MaintainRemarkModule
    ],
    exports: [

    ],
    providers: [],
    declarations: [

    ],
    bootstrap: []
})
export class MaintainRemarkRouteModule { }