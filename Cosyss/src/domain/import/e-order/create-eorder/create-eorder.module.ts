// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CreateEorderComponent } from './create-eorder.component';
import { ImportService } from '../../import.service';


const routes: Routes = [
    // Default
    { path: '', component: CreateEorderComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [
        CreateEorderComponent
    ],
    providers: [ImportService],
    declarations: [
        CreateEorderComponent
    ],
    bootstrap: []
})
export class CreateEorderModule {

}
