import { ExportService } from './../../export.service';
import { BuildupService } from '../buildup.service';
import { AcceptanceService } from "../../acceptance/acceptance.service";
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
import { MailLoadShipmentComponent } from './mail-load-shipment.component'


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: MailLoadShipmentComponent },
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
        MailLoadShipmentComponent
    ],
    providers: [ExportService, BuildupService, AcceptanceService],
    declarations: [
        MailLoadShipmentComponent
    ],
    bootstrap: []
})
export class MailLoadShipmentModule { }
