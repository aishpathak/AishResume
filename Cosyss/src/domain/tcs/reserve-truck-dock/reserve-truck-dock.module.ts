import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';
import { ReserveTruckDockComponent } from './reserve-truck-dock.component';
import { TcsModule } from '../tcs.module';

const routes: Routes = [
    { path: "", component: ReserveTruckDockComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes), CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, TcsModule
    ],
    declarations: [ReserveTruckDockComponent],
    providers: [TcsService]
})

export class ReserveTruckDockModule { }
