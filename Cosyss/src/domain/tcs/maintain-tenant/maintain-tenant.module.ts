import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
// Core
import {
  NgcCoreModule,
  NgcControlsModule,
  NgcDirectivesModule,
  NgcDomainModule
} from "ngc-framework";
import { MaintainTenantComponent } from './maintain-tenant.component';
import { TcsService } from "../tcs.service";


const routes: Routes = [
  { path: "", component: MaintainTenantComponent }
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
  declarations: [MaintainTenantComponent],
  providers: [TcsService]
})
export class MaintainTenantModule { }
