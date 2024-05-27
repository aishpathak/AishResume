import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitLeftBehindShipmentComponent } from './submit-left-behind-shipment.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CustomACESService } from './../customs.service';



const routes: Routes = [

    { path: '', component: SubmitLeftBehindShipmentComponent },
    { path: '**', redirectTo: '/' }
];
@NgModule({
    imports: [

        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

    ],
    exports: [SubmitLeftBehindShipmentComponent],
    providers: [CustomACESService],
    declarations: [SubmitLeftBehindShipmentComponent]
})
export class SubmitLeftBehindConsignmentModule { }
