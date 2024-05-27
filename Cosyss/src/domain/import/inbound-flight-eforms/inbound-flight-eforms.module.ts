// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { InboundFlightEFormsComponent } from './inbound-flight-eforms.component';
import { ImportService } from '../import.service';


const routes: Routes = [
    // Default
    { path: '', component: InboundFlightEFormsComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    exports: [
        InboundFlightEFormsComponent
    ],
    providers: [ImportService],
    declarations: [
        InboundFlightEFormsComponent
    ],
    bootstrap: []
})
export class InboundFlightEFormsModule {

}
