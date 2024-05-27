import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBreakdownDiscrepancyComponent } from './list-breakdown-discrepancy.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CustomACESService } from './../customs.service';

const routes: Routes = [

    { path: '', component: ListBreakdownDiscrepancyComponent },
    { path: '**', redirectTo: '/' }

];
@NgModule({
    imports: [

        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

    ],
    exports: [
        ListBreakdownDiscrepancyComponent
    ],
    providers: [CustomACESService],
    declarations: [ListBreakdownDiscrepancyComponent]
})
export class ListBreakdownDiscrepancyModule { }
@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, ListBreakdownDiscrepancyModule
    ],
    exports: [

    ],
    providers: [],
    declarations: [],
    bootstrap: []
})
export class ListBreakdownDiscrepancyRouteModule { }

