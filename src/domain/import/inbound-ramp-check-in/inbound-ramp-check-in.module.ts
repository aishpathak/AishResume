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
import { InboundRampCheckInComponent } from './inbound-ramp-check-in.component';
import { DriverIdComponent } from './driver-id/driver-id.component';
import { SendTelexComponent } from './send-telex/send-telex.component';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';
import { AddUldComponent } from './add-uld/add-uld.component';
import { AddAccessoryModule } from '../../warehouse/add-accessory/add-accessory.module'


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: InboundRampCheckInComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
        AddAccessoryModule
    ],
    exports: [
        InboundRampCheckInComponent
    ],
    providers: [ImportService],
    declarations: [
        InboundRampCheckInComponent,
        DriverIdComponent,
        SendTelexComponent,
        UploadPhotoComponent,
        AddUldComponent
    ],
    bootstrap: []
})
export class InboundRampCheckInModule { }