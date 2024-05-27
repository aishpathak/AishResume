/**
 *  ValManagement Barrel File
 *
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule } from 'ngc-framework';
import { NgcDomainModule } from 'ngc-framework';

// Page Components
import { ShipmentOnHoldComponent } from './shipmentOnHold/shipmentOnHold.component';
import { MarkShipmentForReuseComponent } from './mark-shipment-for-reuse/mark-shipment-for-reuse.component';
import { MaintainRemarkComponent } from './maintain-remark/maintain-remark.component';
import { MaintainShipmentIrregularityComponent } from './maintain-shipment-irregularity/maintain-shipment-irregularity.component';
import { MaintainHouseWayBillEditComponent } from './maintain-house-way-bill-edit/maintain-house-way-bill-edit.component';
import { MaintainHouseWayBillAddNewComponent } from './maintain-house-way-bill-add-new/maintain-house-way-bill-add-new.component';
import { MaintainHouseComponent } from './maintain-house/maintain-house.component';
import { CreateCn46Component } from './create-cn46/create-cn46.component';
import { ShipmentInformationComponent } from './shipment-information/shipment-information.component';
import { TemperatureLogEntryComponent } from './temperature-log-entry/temperature-log-entry.component';
import { InactiveOrOldCargoComponent } from './inactive-or-old-cargo/inactive-or-old-cargo.component';
import { MaintainHouseWayBillListComponent } from "./maintain-house-way-bill-list/maintain-house-way-bill-list.component";
import { DeleteHouseWayBillComponent } from "./delete-house-way-bill/delete-house-way-bill.component";
import { MaintainHouseMasterComponent } from "./maintain-house-master/maintain-house-master.component";

// Module core Service
import { AwbManagementService } from './awbManagement.service';
import { CoolportShipmentMonitoringComponent } from './coolport-shipment-monitoring/coolport-shipment-monitoring.component';
import { ShipmentLocationComponent } from './shipmentLocation/shipmentLocation.component';
import { MergeShipmentLocationComponent } from './mergeShipmentLocation/mergeShipmentLocation.component';
import { SplitShipmentLocationComponent } from './splitShipmentLocation/splitShipmentLocation.component';
import { MailbagOverviewDetailsComponent } from './mailbag-overview-details/mailbag-overview-details.component';
import { MailbagOverviewCorrectionComponent } from './mailbag-overview-correction/mailbag-overview-correction.component';
import { CaptureDamageComponent } from './capture-damage/capture-damage.component';
import { ChangeAwbHawbComponent } from './change-awb-hawb/change-awb-hawb.component';
import { ShipmentHandoverComponent } from './shipment-handover-terminal/shipment-handover.component';
import { CollectPaymentService } from './../billing/collectPayment/collectPayment.service';
import { AwbManagementComponent } from './awb-management/awb-management.component';
import { ReviveshipmentComponent } from './reviveshipment/reviveshipment.component';
import { FhlLogComponent } from './fhl-log/fhl-log.component';
import { FwbLogComponent } from './fwb-log/fwb-log.component';
import { FwbDataValidationComponent } from './fwb-datavalidation/fwb-datavalidation.component';
import { uldTemperatureLogEntryComponent } from './uldtemperaturelogentry/uldtemperaturelogentry.component';

const routes: Routes = [
  { path: 'irregularity', component: MaintainShipmentIrregularityComponent },
  { path: 'maintainremarks', component: MaintainRemarkComponent },
  { path: 'markShipmentForReuse', component: MarkShipmentForReuseComponent },
  { path: 'shipmentonhold', component: ShipmentOnHoldComponent },
  { path: 'maintainhouse', component: MaintainHouseComponent },
  { path: 'maintainhousewaybilladdnew', component: MaintainHouseWayBillAddNewComponent },
  { path: 'maintainhousewaybilladdedit', component: MaintainHouseWayBillEditComponent },
  { path: 'awbdocument', component: AwbManagementComponent },
  { path: 'maintainhousewaybilladdedit', component: MaintainHouseWayBillEditComponent },
  { path: 'createcn46', component: CreateCn46Component },
  { path: 'shipmentinfo', component: ShipmentInformationComponent },
  { path: 'temperaturelogentry', component: TemperatureLogEntryComponent },
  { path: 'inactivecargolist', component: InactiveOrOldCargoComponent },
  //{ path: 'shipmentLocation', component: ShipmentLocationComponent },
  { path: 'mergeshipmentLocation', component: MergeShipmentLocationComponent },
  { path: 'splitshipmentLocation', component: SplitShipmentLocationComponent },
  { path: 'coolportshipmentmonitoring', component: CoolportShipmentMonitoringComponent },
  { path: 'mailbagoverview', component: MailbagOverviewDetailsComponent },
  { path: 'mailbagcorrection', component: MailbagOverviewCorrectionComponent },
  { path: 'capturedamage', component: CaptureDamageComponent },
  { path: 'changeawb', component: ChangeAwbHawbComponent },
  { path: 'shipmenthandover', component: ShipmentHandoverComponent },
  { path: 'reviveshipment', component: ReviveshipmentComponent },
  { path: 'housewaybilllist', component: MaintainHouseWayBillListComponent },
  { path: 'deleteHouse', component: DeleteHouseWayBillComponent },
  { path: 'maintainhousemaster', component: MaintainHouseMasterComponent },
  // { path: 'fhllog', component: FhlLogComponent },
  // { path: 'fwblog', component: FwbLogComponent },
  // { path: 'fwbEyeBallCheck', component: FwbDataValidationComponent },
  { path: 'uldtemperaturelogentry', component: uldTemperatureLogEntryComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],


  declarations: [MarkShipmentForReuseComponent,
    TemperatureLogEntryComponent,
    MaintainRemarkComponent, MaintainShipmentIrregularityComponent, ShipmentOnHoldComponent,
    MaintainHouseComponent, MaintainHouseWayBillAddNewComponent, MaintainHouseWayBillEditComponent,
    CreateCn46Component, ShipmentInformationComponent,
    CoolportShipmentMonitoringComponent,
    InactiveOrOldCargoComponent,
    //ShipmentLocationComponent,
    MergeShipmentLocationComponent,
    SplitShipmentLocationComponent,
    MailbagOverviewDetailsComponent,
    MailbagOverviewCorrectionComponent,
    CaptureDamageComponent,
    ChangeAwbHawbComponent,
    ShipmentHandoverComponent,
    AwbManagementComponent,
    ReviveshipmentComponent,
    MaintainHouseWayBillListComponent,
    DeleteHouseWayBillComponent,
    MaintainHouseMasterComponent,
    // FhlLogComponent,
    // FwbLogComponent,
    // FwbDataValidationComponent,
    uldTemperatureLogEntryComponent
  ],

  providers: [AwbManagementService, CollectPaymentService]
})
export class AwbManagementModule { }
