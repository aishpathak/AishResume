import { UldService } from '../../uld.service';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { MaintainGlobalUldCharacteristicsComponent } from './maintain-global-uld-characteristics.component';



const routes: Routes = [
    // Default
    { path: '', component: MaintainGlobalUldCharacteristicsComponent },
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
        MaintainGlobalUldCharacteristicsComponent
    ],
    providers: [UldService],
    declarations: [
        MaintainGlobalUldCharacteristicsComponent
    ],
    bootstrap: []
})

export class MaintainGlobalUldCharacteristicsModule { }