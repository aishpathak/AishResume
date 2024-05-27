import { ImportService } from '../import.service';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { UldshipmentpriorityspecialhandlingautoselectComponent } from './uldshipmentpriorityspecialhandlingautoselect.component'
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';


const routes: Routes = [
    // Default
    { path: '', component: UldshipmentpriorityspecialhandlingautoselectComponent },
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
        UldshipmentpriorityspecialhandlingautoselectComponent
    ],
    providers: [ImportService],
    declarations: [
        UldshipmentpriorityspecialhandlingautoselectComponent
    ],
    bootstrap: []
})
export class UldShipmentPrioritySpecialHandlingAutoSelectModule { }