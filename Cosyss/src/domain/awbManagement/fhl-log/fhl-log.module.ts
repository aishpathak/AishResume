import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
//core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { FhlLogComponent } from './fhl-log.component';
//import { UpdateBookingModule } from '../../update-booking/update-booking.module';

const routes: Routes = [
    // Default
    { path: '', component: FhlLogComponent },
    { path: '**', redirectTo: '/' }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [
        FhlLogComponent
    ],
    providers: [],
    declarations: [
        FhlLogComponent
    ],
    bootstrap: []
})
export class FhlLogModule { }
