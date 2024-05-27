import { UldService } from '../uld.service';




// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TempLogComponent } from './temp-log.component';
import { DatePipe } from '@angular/common';




/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: TempLogComponent },
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
        TempLogComponent,
    ],
    providers: [UldService, DatePipe],
    declarations: [TempLogComponent],
    bootstrap: []
})
export class TempLogModule { }
