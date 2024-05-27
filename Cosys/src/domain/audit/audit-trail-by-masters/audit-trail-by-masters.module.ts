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
import { AuditTrailByMastersComponent } from "./audit-trail-by-masters.component";


// import { OverlayPanel } from './OverlayPanel/OverlayPanel.component';

const routes: Routes = [
    // Default
    { path: '', component: AuditTrailByMastersComponent },
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
        AuditTrailByMastersComponent
    ],
    bootstrap: [],
    providers: [AuditService]
})
export class AuditTrailByMastersModule { }
