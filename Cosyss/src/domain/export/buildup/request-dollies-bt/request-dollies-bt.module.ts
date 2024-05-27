// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { RequestDolliesBTComponent } from './request-dollies-bt.component';
import { WarehouseService } from '../../../warehouse/warehouse.service';

/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: RequestDolliesBTComponent },
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
        RequestDolliesBTComponent
    ],
    providers: [WarehouseService],
    declarations: [
        RequestDolliesBTComponent
    ],
    bootstrap: []
})
export class RequestDolliesBTModule { }
