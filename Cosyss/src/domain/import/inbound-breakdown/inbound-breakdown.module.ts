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
import { InboundBreakdownComponent } from './inbound-breakdown.component';
import { UpdateBookingModule } from '../../update-booking/update-booking.module';
import { AddAccessoryModule } from '../../warehouse/add-accessory/add-accessory.module'
import { ExportService } from '../../export/export.service';


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: InboundBreakdownComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, UpdateBookingModule, AddAccessoryModule
    ],
    exports: [
        InboundBreakdownComponent
    ],
    providers: [ImportService, ExportService],
    declarations: [
        InboundBreakdownComponent
    ],
    bootstrap: []
})
export class InboundBreakdownModule { }
