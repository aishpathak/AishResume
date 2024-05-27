import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitReconciliationComponent } from './submit-reconciliation.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CustomACESService } from './../customs.service';



const routes: Routes = [

    { path: '', component: SubmitReconciliationComponent },
    { path: '**', redirectTo: '/' }
];
@NgModule({
    imports: [

        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

    ],
    exports: [SubmitReconciliationComponent],
    providers: [CustomACESService],
    declarations: [SubmitReconciliationComponent]
})
export class SubmitReconciliationModule { }
