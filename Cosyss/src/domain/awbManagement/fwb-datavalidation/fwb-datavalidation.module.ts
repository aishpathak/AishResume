
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';

import { FwbDataValidationComponent } from './fwb-datavalidation.component';


const routes: Routes = [
    // Default
    { path: '', component: FwbDataValidationComponent },
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
        FwbDataValidationComponent
    ],
    providers: [],
    declarations: [
        FwbDataValidationComponent
    ],
    bootstrap: []
})
export class FwbDataValidationModule { }