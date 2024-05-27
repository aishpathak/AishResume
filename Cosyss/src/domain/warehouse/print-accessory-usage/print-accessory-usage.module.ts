import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { PrintAccessoryUsageComponent } from './print-accessory-usage.component';
import { WarehouseService } from '../warehouse.service';

/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: PrintAccessoryUsageComponent },
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
        PrintAccessoryUsageComponent
    ],
    providers: [WarehouseService],
    declarations: [
        PrintAccessoryUsageComponent
    ],
    bootstrap: []
})
export class PrintAccessoryModule { }
