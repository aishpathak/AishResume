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
//import { AuthorizedPersonnelComponent } from './customer/authorizedPersonnel/authorizedPersonnel.component';
import { EquipmentCreatetripComponent } from './equipment-createtrip/equipment-createtrip.component';
import { EquipmentPreparationComponent } from './equipment-preparation/equipment-preparation.component';
import { EquipmentService } from './equipment.service';
import { EquipmentTaskListComponent } from './equipmentTaskList/equipmentTaskList.component';
import { EquipmentRequestMaintainComponent } from './equipmentRequestMaintain/equipmentRequestMaintain.component';
import { EquipmentRequestComponent } from './equipmentRequest/equipmentRequest.component';
import { EquipmentReturnComponent } from './equipmentReturn/equipmentReturn.component';
import { EquipmentSATSComponent } from './equipment-SATS/equipment-SATS.component';
import { EquipmentRequestByULDComponent } from './equipment-request-by-uld/equipment-request-by-uld.component';
import { MaintainEquipmentRequestByULDComponent } from './maintain-equipment-request-by-uld/maintain-equipment-request-by-uld.component';
import { MaintainEquipmentRequestByUldDetailsComponent } from './maintain-equipment-request-by-uld-details/maintain-equipment-request-by-uld-details.component';
import { ReleaseEirMaintainEquipmentRequestByUldComponent } from './release-eir-maintain-equipment-request-by-uld/release-eir-maintain-equipment-request-by-uld.component';
/**
 * Route
 */
const routes: Routes = [
  { path: 'createtrip', component: EquipmentCreatetripComponent },
  { path: 'equipmentpreparation', component: EquipmentPreparationComponent },
  { path: 'tasklist', component: EquipmentTaskListComponent },
  { path: 'equipmentrequesting', component: EquipmentRequestMaintainComponent },
  { path: 'equipReqlist', component: EquipmentRequestComponent },
  { path: 'equipmentreturn', component: EquipmentReturnComponent },
  { path: 'equipmentSATS', component: EquipmentSATSComponent },
  { path: 'equipmentrequestbyuld', component: EquipmentRequestByULDComponent },
  { path: 'maintain-equipment-request-by-uld', component: MaintainEquipmentRequestByULDComponent },
  { path: 'maintain-equipment-request-by-uld-details', component: MaintainEquipmentRequestByUldDetailsComponent },
  { path: 'release-eir-maintain-equipment-request-by-uld', component: ReleaseEirMaintainEquipmentRequestByUldComponent }
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
  exports: [MaintainEquipmentRequestByUldDetailsComponent],
  declarations: [
    EquipmentCreatetripComponent,
    EquipmentPreparationComponent,
    EquipmentTaskListComponent,
    EquipmentRequestMaintainComponent,
    EquipmentRequestComponent,
    EquipmentReturnComponent,
    EquipmentSATSComponent,
    EquipmentRequestByULDComponent,
    MaintainEquipmentRequestByULDComponent,
    MaintainEquipmentRequestByUldDetailsComponent,
    ReleaseEirMaintainEquipmentRequestByUldComponent
  ],
  providers: [EquipmentService]
})
export class EquipmentModuleWithoutRoute { }

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
    EquipmentModuleWithoutRoute
  ],
  exports: [MaintainEquipmentRequestByUldDetailsComponent],
  declarations: [

  ],
  providers: [EquipmentService]
})
export class EquipmentModule { }
