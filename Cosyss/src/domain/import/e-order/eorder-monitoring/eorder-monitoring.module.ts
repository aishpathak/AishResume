// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { EorderMonitoringComponent } from './eorder-monitoring.component';
import { ImportService } from '../../import.service';


const routes: Routes = [
    // Default
    { path: '', component: EorderMonitoringComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [
        EorderMonitoringComponent
    ],
    providers: [ImportService],
    declarations: [
        EorderMonitoringComponent
    ],
    bootstrap: []
})
export class EOrderMonitoringModule {

}
