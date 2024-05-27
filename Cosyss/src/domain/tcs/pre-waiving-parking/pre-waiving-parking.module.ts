import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';
import { PreWaivingParkingComponent } from './pre-waiving-parking.component';

const routes: Routes = [
    { path: '', component: PreWaivingParkingComponent },
    { path: '**', redirectTo: '/' }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    declarations: [PreWaivingParkingComponent],
    providers: [TcsService]
})
export class PreWaivingParkingModule { }
