import { ExportService } from './../export.service';
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
import { BookSingleShipmentComponent } from './book-single-shipment.component'
import { UpdateBookingModule } from './../../update-booking/update-booking.module';
import { InterfaceModule } from '../../interface/interface.module';

/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: BookSingleShipmentComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, UpdateBookingModule, InterfaceModule
    ],
    exports: [
        BookSingleShipmentComponent
    ],
    providers: [ExportService],
    declarations: [
        BookSingleShipmentComponent,
    ],
    bootstrap: []
})
export class BookSingleShipmentModule { }
