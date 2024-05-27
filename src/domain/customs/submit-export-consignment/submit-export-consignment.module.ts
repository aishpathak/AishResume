import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CustomACESService } from './../customs.service';
import { SubmitExportConsignmentComponent } from './submit-export-consignment.component';

const routes: Routes = [

    { path: '', component: SubmitExportConsignmentComponent },
    { path: '**', redirectTo: '/' }

];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

    ],

    exports: [SubmitExportConsignmentComponent],

    providers: [CustomACESService],

    declarations: [SubmitExportConsignmentComponent]

})
export class SubmitExportConsignmentModule { }
