import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IssuesrfComponent } from './issuesrf.component';
import { ImportService } from '../import.service';

const routes: Routes = [
    // Default
    { path: '', component: IssuesrfComponent },
    { path: '**', redirectTo: '/' }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    providers: [ImportService],
    declarations: [IssuesrfComponent]
})
export class IssueSRFModule { }