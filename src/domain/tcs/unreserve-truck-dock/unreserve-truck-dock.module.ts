import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';
import { UnReserveTruckDockComponent } from './unreserve-truck-dock.component';

const routes: Routes = [
    { path: "", component: UnReserveTruckDockComponent },
    { path: '**', redirectTo: '/' }
];


@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [UnReserveTruckDockComponent],
    declarations: [UnReserveTruckDockComponent],
    providers: [TcsService]
})
export class UnReserveTruckDockSaveModuleWithoutRoute { }

@NgModule({
    imports: [
        RouterModule.forChild(routes), CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
        UnReserveTruckDockSaveModuleWithoutRoute
    ],
    exports: [UnReserveTruckDockComponent],
    providers: [TcsService]
})

export class UnReserveTruckDockModule { }
