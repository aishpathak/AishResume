import { InventoryCheckListDetailComponent } from './inventory-check-list-detail/inventory-check-list-detail.component';
import { InventoryCheckListComponent } from './inventory-check-list/inventory-check-list.component';
import { LocationsComponent } from './warehouse-configuration/warehouse-configuration-sector/locations/locations.component';
import { SetupDevicesComponent } from './setup-devices/setup-devices.component';
import { DisplayConstraintComponent } from './warehouse-configuration/display-constraint/display-constraint.component';
import { AllocateTruckDockComponent } from './allocate-truck-dock/allocate-truck-dock.component';
import { AddLocationComponent } from './add-location/add-location.component';
import { HandlingConstraintsComponent } from './handling-constraints/handling-constraints.component';
import { AssociateHandlingConstraintComponent } from './associate-handling-constraint/associate-handling-constraint.component';
import { WarehouseService } from './warehouse.service';
import { WarehouseConfigurationSectorComponent } from './warehouse-configuration/warehouse-configuration-sector/warehouse-configuration-sector.component';
import { WarehouseConfigurationComponent } from './warehouse-configuration/warehouse-configuration.component';
import { AddSectorComponent } from './add-sector/add-sector.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { WhsConfigurationComponent } from './whs-configuration/whs-configuration.component';
import { TerminalSectorComponent } from './whs-configuration/terminal-sector/terminal-sector.component';
import { TerminalComponent } from './whs-configuration/terminal/terminal.component';
import { LocationComponent } from './whs-configuration/location/location.component';
import { ShipmentListByLocationComponent } from './shipment-list-by-location/shipment-list-by-location.component';
import { AllocateWorkstationAirsideComponent } from './allocate-workstation-airside/allocate-workstation-airside.component';
import { QueryBinComponent } from './query-bin/query-bin.component';
import { MastersService } from '../masters/masters.service';
import { AddAccessoryComponent } from './add-accessory/add-accessory.component';
import { PrintAccessoryUsageComponent} from './print-accessory-usage/print-accessory-usage.component';





const routes: Routes = [
    // { path: 'configuration', component: WarehouseConfigurationComponent },
    { path: 'whconfiguration', component: WhsConfigurationComponent },
    { path: 'addsector', component: AddSectorComponent },
    { path: 'handling-constraints', component: HandlingConstraintsComponent },
    { path: 'addlocation', component: AddLocationComponent },
    { path: 'allocatetruckdock', component: AllocateTruckDockComponent },
    { path: 'setupdevices', component: SetupDevicesComponent },
    { path: 'shipmentlist', component: ShipmentListByLocationComponent },
    { path: 'inventorychecklist', component: InventoryCheckListComponent },
    { path: 'inventorychecklistdetail', component: InventoryCheckListDetailComponent },
    { path: 'querybindetails', component: QueryBinComponent },
];
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
    ],
    declarations: [
        WarehouseConfigurationComponent, WarehouseConfigurationSectorComponent, AddSectorComponent,
        AssociateHandlingConstraintComponent, HandlingConstraintsComponent, AddLocationComponent,
        AllocateTruckDockComponent, DisplayConstraintComponent, SetupDevicesComponent, LocationsComponent,
        WhsConfigurationComponent, ShipmentListByLocationComponent, TerminalComponent, LocationComponent, TerminalSectorComponent,
        InventoryCheckListComponent, InventoryCheckListDetailComponent, AllocateWorkstationAirsideComponent, QueryBinComponent, AddAccessoryComponent,
        PrintAccessoryUsageComponent
    ],
    providers: [WarehouseService,MastersService]
})
export class WarehouseModule { }

