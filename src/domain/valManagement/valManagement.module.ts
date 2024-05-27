/**
 *  ValManagement Barrel File
 *
 * @copyright SATS Singapore 2017-18
 */
// Angular
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

// Cosys
import { ValManagementComponent } from "./valManagement.component";
import { InboundShipmentComponent } from "./inbound-shipment/inbound-shipment.component";
import { IncomingRequestComponent } from "./incoming-request/incoming-request.component";
import { ValSharedService } from "./val-shared.service";
import { EnquireShipmentComponent } from './enquire-shipment/enquire-shipment.component';
import { CheckinShipmentComponent } from './checkin-shipment/checkin-shipment.component';
import { OutboundShipmentComponent } from './OutboundShipment/OutboundShipment.component';
import { InventorychecklistComponent } from './inventorychecklist/inventorychecklist.component';
import { InventorycheckdetailsComponent } from './inventorycheckdetails/inventorycheckdetails.component';
import { SignedhandoverformComponent } from './signedhandoverform/signedhandoverform.component';
import { NotfoundshipmentlistComponent } from './notfoundshipmentlist/notfoundshipmentlist.component';





const routes: Routes = [

  { path: "inboundshipment", component: InboundShipmentComponent },
  { path: "incomingrequest", component: IncomingRequestComponent },
  { path: 'enquire', component: EnquireShipmentComponent },
  { path: 'checkin-shipment', component: CheckinShipmentComponent },
  { path: 'outboundshipment', component: OutboundShipmentComponent },
  { path: 'inventorychecklist', component: InventorychecklistComponent },
  { path: 'inventorycheckdetails', component: InventorycheckdetailsComponent },
  { path: 'signedhandoverform', component: SignedhandoverformComponent },
  { path: 'notfoundshipmentlist', component: NotfoundshipmentlistComponent }


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



  declarations: [ValManagementComponent, IncomingRequestComponent,
    InboundShipmentComponent, EnquireShipmentComponent, CheckinShipmentComponent,
    OutboundShipmentComponent,
    InventorychecklistComponent,
    InventorycheckdetailsComponent,
    SignedhandoverformComponent,
    NotfoundshipmentlistComponent
  ],
  providers: [ValSharedService]


})
export class ValManagementModule { }
