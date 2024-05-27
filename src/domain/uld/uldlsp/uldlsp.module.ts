
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';

import { ULDLSPComponent } from './uldlsp.component';


const routes: Routes = [
    // Default
    { path: '', component: ULDLSPComponent },
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
        ULDLSPComponent
    ],
    providers: [],
    declarations: [
        ULDLSPComponent
    ],
    bootstrap: []
})
export class UldLspModule { }