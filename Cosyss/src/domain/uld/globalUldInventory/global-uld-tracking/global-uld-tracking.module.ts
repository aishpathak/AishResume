
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { UldService } from '../../uld.service';
import { GlobalUldTrackingComponent } from './global-uld-tracking.component';




const routes: Routes = [
    // Default
    { path: '', component: GlobalUldTrackingComponent },
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

    ],
    providers: [UldService],
    declarations: [

    ],
    bootstrap: []
})

export class GlobalUldTrackingModule { }