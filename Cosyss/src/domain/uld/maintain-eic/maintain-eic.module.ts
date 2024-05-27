import { UldService } from './../uld.service';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MaintainEicComponent } from './maintain-eic.component'
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { AddAccessoryModule } from '../../warehouse/add-accessory/add-accessory.module';



const routes: Routes = [
    // Default
    { path: '', component: MaintainEicComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, AddAccessoryModule
    ],
    exports: [
        MaintainEicComponent
    ],
    providers: [UldService],
    declarations: [
        MaintainEicComponent
    ],
    bootstrap: []
})

export class maintaineic { }