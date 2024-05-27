import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CustomACESService } from './../customs.service';
import { SubmitAmendedConsignmentComponent } from './submit-amended-consignment.component';

const routes: Routes = [

    { path: '', component: SubmitAmendedConsignmentComponent },
    { path: '**', redirectTo: '/' }

];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

    ],

    exports: [SubmitAmendedConsignmentComponent],

    providers: [CustomACESService],

    declarations: [SubmitAmendedConsignmentComponent]

})
export class SubmitInitialConsignmentModule { }
