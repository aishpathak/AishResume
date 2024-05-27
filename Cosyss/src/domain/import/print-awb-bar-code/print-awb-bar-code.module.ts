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
import { PrintAwbBarCodeComponent } from './print-awb-bar-code.component';


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: PrintAwbBarCodeComponent },
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
        PrintAwbBarCodeComponent
    ],
    providers: [ImportService],
    declarations: [
        PrintAwbBarCodeComponent
    ],
    bootstrap: []
})
export class PrintAwbBarCodeModule { }