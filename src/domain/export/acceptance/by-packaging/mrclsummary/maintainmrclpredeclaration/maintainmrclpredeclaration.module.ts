import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaintainmrclpredeclarationComponent } from './maintainmrclpredeclaration.component';
import { NgcControlsModule, NgcCoreModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
//import { MRCLPredeclarationComponent } from './m-rcl-predeclaration/m-rcl-predeclaration.component';
//import { CargoBreakDownComponent } from './cargo-break-down/cargo-break-down.component';
//import { ULDInfoComponent } from './uld-info/uld-info.component';
//import { DimensionComponent } from './dimension/dimension.component';


const routes: Routes = [
    { path: '', component: MaintainmrclpredeclarationComponent },
    { path: '**', redirectTo: '/' }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [
        MaintainmrclpredeclarationComponent,
        //MRCLPredeclarationComponent, CargoBreakDownComponent, ULDInfoComponent, DimensionComponent
    ],
    declarations: [MaintainmrclpredeclarationComponent
        // MRCLPredeclarationComponent, CargoBreakDownComponent, ULDInfoComponent, DimensionComponent
    ]

})

export class MaintainmrclpredeclarationModule { }