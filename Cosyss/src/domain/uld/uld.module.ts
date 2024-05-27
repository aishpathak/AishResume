
/**
 *  ULD Routing Module
 *
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, NgcUtility } from 'ngc-framework';
// uld components
import { UnsighteduldComponent } from './uldStockCheck/unsighteduld/unsighteduld.component';
import { OsiComponent } from './uldStockCheck/stockconsolidation/osi/osi.component';
import { IcsComponent } from './uldStockCheck/stockconsolidation/ics/ics.component';
import { SighteduldsComponent } from './uldStockCheck/stockconsolidation/sightedulds/sightedulds.component';
import { StockconsolidationComponent } from './uldStockCheck/stockconsolidation/stockconsolidation.component';
import { UldstockcheckstatusComponent } from './uldStockCheck/uldstockcheckstatus/uldstockcheckstatus.component';
import { UldInventoryComponent } from './uldinventory/uldinventory.component';
import { UldstocklevelComponent } from './uldstocklevel/uldstocklevel.component';
import { UldService } from './uld.service';
import { UldMovmentComponent } from './uldmovment/uldmovment.component';
import { UldnewComponent } from './uldmovment/uldnew/uldnew.component';
import { UldFlightInComponent } from './uldmovment/uldflightin/uldflightin.component';
import { UldrepairComponent } from './uldmovment/uldrepair/uldrepair.component';
import { UldmissingcargoComponent } from './uldmovment/uldmissingcargo/uldmissingcargo.component';
import { UldmissingapronComponent } from './uldmovment/uldmissingapron/uldmissingapron.component';
import { ReturnfromworkshopComponent } from './uldmovment/returnfromworkshop/returnfromworkshop.component';
import { ReturnfromagentComponent } from './uldmovment/returnfromagent/returnfromagent.component';
import { FoundatcargoComponent } from './uldmovment/foundatcargo/foundatcargo.component';
import { FoundatapronComponent } from './uldmovment/foundatapron/foundatapron.component';

import { UldflightoutComponent } from './uldmovment/uldflightout/uldflightout.component';
import { UlddeleteComponent } from './uldmovment/ulddelete/ulddelete.component';
import { UldagentComponent } from './uldmovment/uldagent/uldagent.component';
import { UldreleaseComponent } from './uldmovment/uldrelease/uldrelease.component';
import { UldtransferviewComponent } from './uldtransfer/uldtransferview/uldtransferview.component';
import { UldtransferViewDataComponent } from './uldtransfer/uldtransferviewdata/uldtransferviewdata.component';
import { UldtransfernewComponent } from './uldtransfer/uldtransfernew/uldtransfernew.component';
import { UldenquireComponent } from './uldenquire/uldenquire.component';
import { UldUcmComponent } from './ulducm/uldUcm.component';
import { AddingnewrowComponent } from './uldmovment/addingnewrow/addingnewrow.component';
import { MaintainMovableLocationTypesComponent } from './maintain-movable-location-types/maintain-movable-location-types.component';
import { UldMaintainMovableLocationTypesComponent } from './uld-maintain-movable-location-types/uld-maintain-movable-location-types.component';
import { UldallotmentComponent } from './uldallotment/uldallotment.component';
import { TempLogComponent } from './temp-log/temp-log.component';
import { MaintainEicComponent } from './maintain-eic/maintain-eic.component';
import { UldInventoryDetailsComponent } from './uld-inventory-details/uld-inventory-details.component';
import { GlobalULDStockCheckComponent } from './globalUldInventory/global-uldstock-check/global-uldstock-check.component';
import { ULDLSPComponent } from './uldlsp/uldlsp.component';
import { GlobalUldTrackingComponent } from './globalUldInventory/global-uld-tracking/global-uld-tracking.component';
import { UldMovementHistoryComponent } from './uld-movement-history/uld-movement-history.component';
import { MaintainGlobalUldCharacteristicsComponent } from './globalUldInventory/maintain-global-uld-characteristics/maintain-global-uld-characteristics.component';
import { MaintainGlobalUldInventoryListComponent } from './globalUldInventory/maintain-global-uld-inventory-list/maintain-global-uld-inventory-list.component';
import { EnquiryLSPBYLocationComponent } from './enquiry-lspbylocation/enquiry-lspbylocation.component';
import { ServiceErrorLogComponent } from './service-error-log/service-error-log.component';
import { AddAccessoryModule } from '../warehouse/add-accessory/add-accessory.module';
import { EquipmentModuleWithoutRoute } from '../equipment/equipment.module';
import { CommonsModule } from '../common/common.module';

/**
 * Route
 */
const routes: Routes = [
  // Default
  { path: 'transfernew', component: UldtransfernewComponent },
  { path: 'transferview', component: UldtransferviewComponent },
  { path: 'transferviewdata', component: UldtransferViewDataComponent },
  { path: 'inventory', component: UldInventoryComponent },
  { path: 'stocklevel', component: UldstocklevelComponent },
  { path: 'uldmovement', component: UldMovmentComponent },
  { path: 'uldNew', component: UldnewComponent },
  { path: 'uldflightin', component: UldnewComponent },
  { path: 'uldrepair', component: UldrepairComponent },
  { path: 'uldcargo', component: UldmissingcargoComponent },
  { path: 'uldapron', component: UldmissingapronComponent },
  { path: 'returnfromworkshop', component: ReturnfromworkshopComponent },
  { path: 'returnfromagent', component: ReturnfromworkshopComponent },
  { path: 'returnfromagent', component: FoundatcargoComponent },
  { path: 'returnfromagent', component: FoundatapronComponent },
  { path: 'uldstockcheck', component: UldstockcheckstatusComponent },
  { path: 'stockconsolidation', component: StockconsolidationComponent },
  { path: 'sightedulds', component: SighteduldsComponent },
  { path: 'ics', component: IcsComponent },
  { path: 'oci', component: OsiComponent },
  { path: 'RetrieveULDLSPfromMHS', component: ULDLSPComponent },
  { path: 'unsighteduld', component: UnsighteduldComponent },
  { path: 'uldenquire', component: UldenquireComponent },
  { path: 'ulducm', component: UldUcmComponent },
  { path: 'maintainmovablelocationtypes', component: MaintainMovableLocationTypesComponent },
  { path: 'uldmaintainmovablelocationtypes', component: UldMaintainMovableLocationTypesComponent },
  { path: 'uldallotment', component: UldallotmentComponent },
  { path: 'inventorydetails', component: UldInventoryDetailsComponent },
  { path: 'enquiryLSPByLocation', component: EnquiryLSPBYLocationComponent },
  { path: 'serviceerrorlog', component: ServiceErrorLogComponent },
  { path: 'templog', component: TempLogComponent },
  { path: 'maintainEic', component: MaintainEicComponent },
  { path: 'globalULDStockCheck', component: GlobalULDStockCheckComponent },
  { path: 'uldmovementhistory', component: UldMovementHistoryComponent },
  { path: 'globalUldTracking', component: GlobalUldTrackingComponent },
  { path: 'maintainGlobalUldCharacteristics', component: MaintainGlobalUldCharacteristicsComponent },
  { path: 'maintainGlobalUldInventoryList', component: MaintainGlobalUldInventoryListComponent },
  { path: '**', redirectTo: '/' }
];

/**
 * ULD Routing Module
 */
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, AddAccessoryModule, EquipmentModuleWithoutRoute, CommonsModule
  ],
  declarations: [
    UldstocklevelComponent,
    UldInventoryComponent,
    UldMovmentComponent,
    UldnewComponent,
    UldrepairComponent,
    UldmissingcargoComponent,
    UldmissingapronComponent,
    UldFlightInComponent,
    ReturnfromworkshopComponent,
    ReturnfromagentComponent,
    FoundatcargoComponent,
    FoundatapronComponent,
    UldflightoutComponent,
    UlddeleteComponent,
    UldagentComponent,
    UldreleaseComponent,
    UldtransferviewComponent,
    UldtransfernewComponent,
    UldtransferViewDataComponent,
    UldstockcheckstatusComponent,
    StockconsolidationComponent,
    SighteduldsComponent,
    IcsComponent,
    OsiComponent,
    UnsighteduldComponent,
    UldenquireComponent,
    UldUcmComponent,
    AddingnewrowComponent,
    MaintainMovableLocationTypesComponent,
    UldMaintainMovableLocationTypesComponent,
    UldallotmentComponent,
    TempLogComponent,
    MaintainEicComponent,
    ULDLSPComponent,
    UldInventoryDetailsComponent,
    GlobalULDStockCheckComponent,
    UldMovementHistoryComponent,
    GlobalUldTrackingComponent,
    MaintainGlobalUldCharacteristicsComponent,
    MaintainGlobalUldInventoryListComponent,
    EnquiryLSPBYLocationComponent,
    ServiceErrorLogComponent,

  ],
  providers: [UldService]
})
export class UldModule { }
