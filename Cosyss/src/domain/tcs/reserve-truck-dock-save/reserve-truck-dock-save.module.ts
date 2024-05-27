import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';
import { ReserveTruckDockSaveComponent } from './reserve-truck-dock-save.component';

const routes: Routes = [
    { path: "", component: ReserveTruckDockSaveComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [ReserveTruckDockSaveComponent],
    declarations: [ReserveTruckDockSaveComponent],
    providers: [TcsService]
})
export class ReserveTruckDockSaveModuleWithoutRoute { }

@NgModule({
    imports: [
        RouterModule.forChild(routes), CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
        ReserveTruckDockSaveModuleWithoutRoute
    ],
    exports: [ReserveTruckDockSaveComponent],
    providers: [TcsService]
})
export class ReserveTruckDockSaveModule { }
