import { ExportService } from '../../export.service';
import { BuildupService } from '../buildup.service';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { SpecialCargoMonitoringListComponent } from './special-cargo-monitoring-list.component'

/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: SpecialCargoMonitoringListComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [
        SpecialCargoMonitoringListComponent
    ],
    providers: [ExportService, BuildupService],
    declarations: [
        SpecialCargoMonitoringListComponent
    ],
    bootstrap: []
})
export class SpecialCargoMonitoringListModule { }
