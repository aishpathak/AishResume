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
import { DefaultPage } from './default.component';
import { WelcomeComponent } from '../masters/welcome/welcome.component';
import { MastersService } from '../masters/masters.service';

/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: DefaultPage }
];

/**
 * Playground Routing Module
 */
@NgModule({
    imports: [
        // Playground Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [
    ],
    declarations: [
        DefaultPage,
        WelcomeComponent
    ],
    bootstrap: [],
    providers: [MastersService]
})
export class DefaultRoutingModule {
}
