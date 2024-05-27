import { ImportService } from '../import.service';
/**
 *  Admin Routing Module
 *
 * @copyright SATS Singapore 2017-18
 */

// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { AgentIssuedoComponent } from './agent-issuedo.component';
import { CommonsModule } from '../../common/common.module';


/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: AgentIssuedoComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, CommonsModule
    ],
    exports: [
        AgentIssuedoComponent
    ],
    providers: [ImportService],
    declarations: [
        AgentIssuedoComponent
    ],
    bootstrap: []
})
export class AgentIssuedoModule { }