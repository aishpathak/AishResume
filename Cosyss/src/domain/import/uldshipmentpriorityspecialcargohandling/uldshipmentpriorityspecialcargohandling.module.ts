import { ImportService } from '../import.service';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { UldshipmentpriorityspecialcargohandlingComponent } from './uldshipmentpriorityspecialcargohandling.component'
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';


const routes: Routes = [
    // Default
    { path: '', component: UldshipmentpriorityspecialcargohandlingComponent },
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
        UldshipmentpriorityspecialcargohandlingComponent
    ],
    providers: [ImportService],
    declarations: [
        UldshipmentpriorityspecialcargohandlingComponent
    ],
    bootstrap: []
})
export class UldShipmentPrioritySpecialCargoHandlingModule { }