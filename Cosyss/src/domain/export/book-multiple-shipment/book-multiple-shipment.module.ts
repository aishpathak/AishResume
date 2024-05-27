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
import { BookMultipleShipmentComponent } from './book-multiple-shipment.component';
import { BookMultipleShipmentMaintainComponent } from '../book-multiple-shipment-maintain/book-multiple-shipment-maintain.component';

/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: BookMultipleShipmentComponent },
    { path: 'bookMultipleShipmentMaintain', component: BookMultipleShipmentMaintainComponent },
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
        BookMultipleShipmentComponent
    ],
    providers: [ExportService],
    declarations: [
        BookMultipleShipmentComponent
        ,
        BookMultipleShipmentMaintainComponent
    ],
    bootstrap: []
})
export class BookMultipleShipmentModule { }
