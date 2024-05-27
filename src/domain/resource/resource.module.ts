import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { ResourceService } from "./resource.service";
// Core
import {
  NgcCoreModule,
  NgcControlsModule,
  NgcDirectivesModule,
  NgcDomainModule
} from "ngc-framework";
import { ResourceComponent } from "./resource.component";
import { StaffAssignmentComponent } from "./staff-assignment/staff-assignment.component";
import { FlightAssignmentComponent } from "./flight-assignment/flight-assignment.component";
import { AllocationmapforflightComponent } from "./allocationmapforflight/allocationmapforflight.component";
import { AllocationmapforflightComponentModule } from "./allocationmapforflight/allocationmapforflight.component";

const routes: Routes = [
  // Default
  { path: "staffallocation", component: StaffAssignmentComponent },
  { path: "flightallocation", component: FlightAssignmentComponent }
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
    AllocationmapforflightComponentModule
  ],
  exports: [],
  declarations: [
    ResourceComponent,
    StaffAssignmentComponent,
    FlightAssignmentComponent
  ],
  bootstrap: [],
  providers: [ResourceService]
})
export class ResourceModule {}
