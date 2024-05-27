
import { ImportService } from '../import.service';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { EcanStatusEnquiryComponent } from './ecan-status-enquiry.component'


const routes: Routes = [
    // Default
    { path: '', component: EcanStatusEnquiryComponent },
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
        EcanStatusEnquiryComponent
    ],
    providers: [ImportService],
    declarations: [
        EcanStatusEnquiryComponent
    ],
    bootstrap: []
})
export class EcanStatusEnquiryModule { }