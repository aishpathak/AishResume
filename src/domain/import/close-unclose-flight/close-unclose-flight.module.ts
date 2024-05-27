import { ImportService } from '../import.service';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { CloseUncloseFlightComponent } from './close-unclose-flight.component'
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';


const routes: Routes = [
    // Default
    { path: '', component: CloseUncloseFlightComponent },
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
        CloseUncloseFlightComponent
    ],
    providers: [ImportService],
    declarations: [
        CloseUncloseFlightComponent
    ],
    bootstrap: []
})
export class CloseUncloseFlightModule { }