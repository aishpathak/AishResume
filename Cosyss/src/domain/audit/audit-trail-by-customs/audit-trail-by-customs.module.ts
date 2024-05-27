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
import { AuditTrailByCustomsComponent } from "./audit-trail-by-customs.component";

// import { OverlayPanel } from './OverlayPanel/OverlayPanel.component';

const routes: Routes = [
    // Default
    { path: '', component: AuditTrailByCustomsComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        NgcCoreModule,
        NgcControlsModule,
        NgcDirectivesModule,
        NgcDomainModule
    ],
    exports: [],
    declarations: [
        AuditTrailByCustomsComponent
    ],
    bootstrap: [],
    providers: [AuditService]
})
export class AuditTrailByCustomsModule { }
