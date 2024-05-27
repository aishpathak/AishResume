import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
// Core
import { NgcControlsModule, NgcCoreModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { BookMultipleShipmentMaintainComponent } from './book-multiple-shipment-maintain/book-multiple-shipment-maintain.component';
import { BookMultipleShipmentComponent } from './book-multiple-shipment/book-multiple-shipment.component';
import { BookSingleShipmentComponent } from './book-single-shipment/book-single-shipment.component';
import { CarrierFWBComponent } from './carrier-fwb/carrier-fwb.component';
import { DisplayFwbFhlDiscrepancyComponent } from './display-fwb-fhl-discrepancy/display-fwb-fhl-discrepancy.component';
import { DisplayOutgoingFlightsComponent } from './display-outgoing-flights/display-outgoing-flights.component';
import { DisplaySpecialShipmentComponent } from './displayspecialshipment/displayspecialshipment.component';
import { EawbsetupComponent } from './eawbsetup/eawbsetup.component';
import { DetailerComponent } from './ecc-export/detailer/detailer.component';
import { EccService } from './ecc-export/ecc.service';
import { FlightPlanningListComponent } from './ecc-export/flight-planning-list/flight-planning-list.component';

import { EccexpOutboundDetailerComponent } from './eccexp-outbound-detailer/eccexp-outbound-detailer.component';
import { ElectronicConsignmentSecurityDeclarationComponent } from './electronic-consignment-security-declaration/electronic-consignment-security-declaration.component';
import { ExportService } from './export.service';
import { FwbFhlDiscrepancyComponent } from './fwb-fhl-discrepancy/fwb-fhl-discrepancy.component';
import { MaintainNawbComponent } from './maintain-nawb/maintain-nawb.component';
import { MaintainSspdComponent } from './maintain-sspd/maintain-sspd.component';
import { MoveUldTrolleyComponent } from './move-uld-trolley/move-uld-trolley.component';
import { NeutralAirwayBillComponent } from './neutral-airway-bill/neutral-airway-bill.component';
import { OutboundLyingListComponent } from './outbound-lying-list/outbound-lying-list.component';
import { ShipmentEmbargoComponent } from './shipment-embargo/shipment-embargo.component';
import { SidListComponent } from './sid-list/sid-list.component';
import { SnapshotworkinglistComponent } from './snapshotworkinglist/snapshotworkinglist.component';
import { AwbStockManagementComponent } from './stock-management/awb-stock-management/awb-stock-management.component';
import { AwbStockStatusComponent } from './stock-management/awb-stock-status/awb-stock-status.component';
import { AwbStockSummaryComponent } from './stock-management/awb-stock-summary/awb-stock-summary.component';
import { StockManagementComponent } from './stockmanagement/stockmanagement.component';
import { ThroughTransitWorkingAdviceComponent } from './through-transit-working-advice/through-transit-working-advice.component';
import { TranshipmentModule } from './transhipment/transhipment.module';
import { WorkinglistComponent } from './workinglist/workinglist.component';
import { AwbReservationComponent } from './stock-management/awb-reservation/awb-reservation.component';
import { BypassAedAcasComponent } from './bypass-aed-acas/bypass-aed-acas.component';
import { CancelBookedShipmentComponent } from './cancel-booked-shipment/cancel-booked-shipment.component';
import { ExportworkinglistComponent } from './exportworkinglist/exportworkinglist.component';
import { PromotecargoComponent } from './promotecargo/promotecargo.component';
import { ExpFBLComponent } from './exp-fbl/exp-fbl.component';
import { AddExpFblComponent } from './add-exp-fbl/add-exp-fbl.component';
import { EAWBMonitoringComponent } from './e-awbmonitoring/e-awbmonitoring.component';

import { EFBLComponent } from './e-fbl/e-fbl.component';
import { BuplistComponent } from './buplist/buplist.component';
import { ReceivedocumentComponent } from './receivedocument/receivedocument.component';




/**
 * Route
 */

const routes: Routes = [
      // Default
      { path: 'displayspecialshipment', component: DisplaySpecialShipmentComponent },
      { path: 'shipmentembargo', component: ShipmentEmbargoComponent },
      { path: 'moveuldtrolley', component: MoveUldTrolleyComponent },
      { path: 'carrierfwb', component: CarrierFWBComponent },
      { path: 'eawbsetup', component: EawbsetupComponent },
      { path: 'outboundlyinglist', component: OutboundLyingListComponent },
      { path: 'booksingleshipment', component: BookSingleShipmentComponent },
      { path: 'bookmultipleshipment', component: BookMultipleShipmentComponent },
      { path: 'workinglist', component: WorkinglistComponent },
      { path: 'snapshotworkinglist', component: SnapshotworkinglistComponent },
      { path: 'stockmanagement', component: StockManagementComponent },
      { path: 'displayoutgoingflights', component: DisplayOutgoingFlightsComponent },
      { path: 'displayfwbfhldiscrepancy', component: DisplayFwbFhlDiscrepancyComponent },
      { path: 'neutralairwaybill', component: NeutralAirwayBillComponent },
      { path: 'sidlist', component: SidListComponent },
      { path: 'eccexpoutdetailer', component: DetailerComponent },
      { path: 'awbstocksummary', component: AwbStockSummaryComponent },
      { path: 'awbstockmanagement', component: AwbStockManagementComponent },
      { path: 'awbstockstatus', component: AwbStockStatusComponent },
      { path: 'planning-list', component: FlightPlanningListComponent },
      { path: 'through-transit-working-advice', component: ThroughTransitWorkingAdviceComponent },
      { path: 'maintainsspd', component: MaintainSspdComponent },
      { path: 'bookMultipleShipmentMaintain', component: BookMultipleShipmentMaintainComponent },
      { path: 'transhipment', loadChildren: '../export/transhipment/transhipment.module#TranshipmentModule' },
      { path: 'electronicConsignmentSecurityDeclaration', component: ElectronicConsignmentSecurityDeclarationComponent },
      { path: 'maintainnawb', component: MaintainNawbComponent },
      { path: 'fwbfhldiscrepancy', component: FwbFhlDiscrepancyComponent },
      { path: 'awbReservation', component: AwbReservationComponent },
      { path: 'bypassaedacas', component: BypassAedAcasComponent },
      { path: 'cancelbookedshipment', component: CancelBookedShipmentComponent },
      { path: 'buplist', component: BuplistComponent },
      { path: 'receivedocument', component: ReceivedocumentComponent },
      { path: 'exportworkinglist', component: ExportworkinglistComponent },
      { path: 'promotecargo', component: PromotecargoComponent },
      { path: 'expfbl', component: ExpFBLComponent },
      { path: 'addexpfbl', component: AddExpFblComponent }


];

@NgModule({
      imports: [
            RouterModule.forChild(routes),
            CommonModule, ReactiveFormsModule, RouterModule,
            NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
            TranshipmentModule
      ],
      exports: [
      ],
      declarations: [
            DisplaySpecialShipmentComponent,
            ShipmentEmbargoComponent,
            MoveUldTrolleyComponent,
            CarrierFWBComponent,
            EawbsetupComponent,
            OutboundLyingListComponent,
            BookSingleShipmentComponent,
            BookMultipleShipmentComponent,
            WorkinglistComponent,
            SnapshotworkinglistComponent,
            StockManagementComponent,
            DisplayOutgoingFlightsComponent,
            DisplayFwbFhlDiscrepancyComponent,
            NeutralAirwayBillComponent,
            SidListComponent,
            EccexpOutboundDetailerComponent,
            AwbStockSummaryComponent,
            AwbStockManagementComponent,
            AwbStockStatusComponent,
            FlightPlanningListComponent,
            DetailerComponent,
            ThroughTransitWorkingAdviceComponent,
            BookMultipleShipmentMaintainComponent,
            MaintainSspdComponent,
            ElectronicConsignmentSecurityDeclarationComponent,
            MaintainNawbComponent,
            FwbFhlDiscrepancyComponent,
            AwbReservationComponent,
            BypassAedAcasComponent,
            CancelBookedShipmentComponent,
            ExportworkinglistComponent,
            PromotecargoComponent,
            ExpFBLComponent,
            AddExpFblComponent,
            EAWBMonitoringComponent,
            EFBLComponent,
            BuplistComponent,
            ReceivedocumentComponent,


      ],
      bootstrap: [],
      providers: [ExportService, EccService]
})

export class ExportModule { }
