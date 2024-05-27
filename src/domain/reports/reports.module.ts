import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from './reports.service';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgcCoreModule,
  NgcControlsModule,
  NgcDirectivesModule,
  NgcDomainModule
} from "ngc-framework";
import { ServiceStandardMaintenanceComponent } from './service-standard-maintenance/service-standard-maintenance.component';

const routes: Routes = [
  // interface Page Component
  { path: "service-standard-maintenance", component: ServiceStandardMaintenanceComponent }
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
    NgcDomainModule,
  ],
  exports: [

  ],
  declarations: [
    ServiceStandardMaintenanceComponent
  ],
  providers: [ReportsService]
})
export class ReportsModule { }
