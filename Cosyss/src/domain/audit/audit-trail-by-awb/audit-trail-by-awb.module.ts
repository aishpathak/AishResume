import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { AuditService } from "../audit.service";
// Core
import {
    NgcCoreModule,
    NgcControlsModule,
    NgcDirectivesModule,
    NgcDomainModule
} from "ngc-framework";
import { AuditTrailByAwbComponent } from '../audit-trail-by-awb/audit-trail-by-awb.component';
// import { OverlayPanel } from './OverlayPanel/OverlayPanel.component';

const routes: Routes = [
    // Default
    { path: '', component: AuditTrailByAwbComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        // RouterModule.forChild(routes),
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        NgcCoreModule,
        NgcControlsModule,
        NgcDirectivesModule,
        NgcDomainModule
    ],
    exports: [AuditTrailByAwbComponent],
    declarations: [
        AuditTrailByAwbComponent
        // ,OverlayPanel
    ],
    bootstrap: [],
    providers: [AuditService]
})
export class AuditTrailByAWBModule { }
@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, AuditTrailByAWBModule
    ],
    exports: [

    ],
    providers: [],
    declarations: [

    ],
    bootstrap: []
})
export class AuditTrailByAWBRouteModule { }
