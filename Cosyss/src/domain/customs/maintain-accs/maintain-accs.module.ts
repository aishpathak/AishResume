import { CustomACESService } from './../customs.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { MaintainAccsComponent } from './../maintain-accs/maintain-accs.component';
//import { SubmitConsignmentModule } from './../../customs/submit-shipment/submit-shipment.module'

const routes: Routes = [
    { path: '', component: MaintainAccsComponent },
    { path: 'maintainAccs', component: MaintainAccsComponent },
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
        MaintainAccsComponent
    ],
    providers: [CustomACESService],
    declarations: [
        MaintainAccsComponent],
    bootstrap: []

})
export class MaintainAccsModule { }