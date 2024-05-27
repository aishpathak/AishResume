import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';


import { PremanifestComponent } from './premanifest.component';
import { ExportService } from './../export.service';

const routes: Routes = [
    // Default
    { path: '', component: PremanifestComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [PremanifestComponent],
    providers: [ExportService],
    declarations: [PremanifestComponent]
})
export class PreManifestModule { }
