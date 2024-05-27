import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PostUnpostSrfComponent } from './post-unpost-srf.component';
import { ImportService } from '../import.service';

const routes: Routes = [
    // Default
    { path: '', component: PostUnpostSrfComponent },
    { path: '**', redirectTo: '/' }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    providers: [ImportService],
    declarations: [PostUnpostSrfComponent]
})
export class PostUnpostSRFModel { }