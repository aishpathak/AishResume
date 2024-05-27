import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { AuditService } from "./audit.service";
// Core
import {
  NgcCoreModule,
  NgcControlsModule,
  NgcDirectivesModule,
  NgcDomainModule
} from "ngc-framework";
import { AuditComponent } from './audit.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';

const routes: Routes = [
  // Default
  { path: "audittrail", component: AuditTrailComponent }
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
  declarations: [AuditComponent,
  AuditTrailComponent],
  bootstrap: [],
  providers: [AuditService]
})
export class AuditModule { }
