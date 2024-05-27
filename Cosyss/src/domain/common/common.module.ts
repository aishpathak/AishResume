/**
 *  Default Routing Module
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
// Cosys
import { CapturePhotoComponent } from './camera/capturephoto/capturephoto.component';

import { CapturedamageComponent } from './camera/capturedamage/capturedamage.component';
import { CommonService } from './common.service';
import { DuplicatenamepopupComponent } from './duplicatenamepopup/duplicatenamepopup.component';
/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: 'capturephoto', component: CapturePhotoComponent },
    { path: 'capturedamageDesktop', component: CapturedamageComponent },
    { path: 'duplicatenamepopup', component: DuplicatenamepopupComponent }
];

/**
 * Playground Routing Module
 */
@NgModule({
    imports: [
        // Playground Child Routes
        //RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [CapturedamageComponent, CapturePhotoComponent, DuplicatenamepopupComponent],
    declarations: [
        CapturePhotoComponent, CapturedamageComponent, DuplicatenamepopupComponent],
    bootstrap: [],
    providers: [CommonService]
})
export class CommonsModule {
}
@NgModule({
    imports: [
        // Playground Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, CommonsModule
    ],
    exports: [],
    declarations: [
    ],
    bootstrap: [],
    providers: []
})
export class CommonRoutingModule {
}
