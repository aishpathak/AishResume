
import { ImportService } from '../import.service';
/**
 *  Admin Routing Module
 *
 * @copyright SATS Singapore 2017-18
 */

// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Core
import { ScheduleCollectionListComponent } from './schedule-collection-list.component';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';



const routes: Routes = [
    // Default
    { path: '', component: ScheduleCollectionListComponent },
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
        ScheduleCollectionListComponent
    ],
    providers: [ImportService],
    declarations: [
        ScheduleCollectionListComponent
    ],
    bootstrap: []
})
export class ScheduleCollectionListModule { }