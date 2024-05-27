import { ImportService } from '../import.service';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { CargodamagereportlistComponent } from './cargodamagereportlist.component'
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';


const routes: Routes = [
    // Default
    { path: '', component: CargodamagereportlistComponent },
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
        CargodamagereportlistComponent
    ],
    providers: [ImportService],
    declarations: [
        CargodamagereportlistComponent
    ],
    bootstrap: []
})
export class CargoDamageReportListModule { }