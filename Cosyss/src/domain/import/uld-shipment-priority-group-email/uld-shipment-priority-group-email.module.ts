import { ImportService } from '../import.service';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { UldShipmentPriorityGroupEmailComponent } from './uld-shipment-priority-group-email.component'
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';


const routes: Routes = [
    // Default
    { path: '', component: UldShipmentPriorityGroupEmailComponent },
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
        UldShipmentPriorityGroupEmailComponent
    ],
    providers: [ImportService],
    declarations: [
        UldShipmentPriorityGroupEmailComponent
    ],
    bootstrap: []
})
export class UldShipmentPriorityGroupEmailModule { }