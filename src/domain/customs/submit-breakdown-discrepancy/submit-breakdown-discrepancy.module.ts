import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitBreakdownDiscrepancyComponent } from './submit-breakdown-discrepancy.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CustomACESService } from './../customs.service';

const routes: Routes = [

    { path: '', component: SubmitBreakdownDiscrepancyComponent },
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
        SubmitBreakdownDiscrepancyComponent
    ],
    providers: [CustomACESService],
    declarations: [SubmitBreakdownDiscrepancyComponent]
})
export class SubmitBreakdownDiscrepancyModule { }
@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, SubmitBreakdownDiscrepancyModule
    ],
    exports: [

    ],
    providers: [],
    declarations: [],
    bootstrap: []
})
export class SubmitBreakdownDiscrepancyRouteModule { }

