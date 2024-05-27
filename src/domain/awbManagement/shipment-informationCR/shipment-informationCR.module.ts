
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
import { AwbManagementService } from '../awbManagement.service';
import { ShipmentInformationComponent } from './shipment-information.component';
import { CollectPaymentService } from '../../billing/collectPayment/collectPayment.service';
import { MaintainShipmentIrregularityModule } from '../maintain-shipment-irregularity/maintain-shipment-irregularity.module';
import { ShipmentOnHoldModule } from '../shipmentOnHold/shipmentOnHold.module';
import { MaintainRemarkModule } from '../maintain-remark/maintain-remark.module';
import { ShipmentLocationModule } from '../shipmentLocation/shipmentLocation.module';
import { CommonsModule } from '../../common/common.module';
import { ReviveModule } from '../reviveshipment/reviveshipment.module';
import { AwbManagementModule } from '../awb-management/awb-management.module';
import { UpdateBookingModule } from '../../update-booking/update-booking.module';
import { ExportService } from '../../export/export.service';






/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: ShipmentInformationComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
        MaintainShipmentIrregularityModule, ShipmentOnHoldModule, MaintainRemarkModule, ShipmentLocationModule, CommonsModule, ReviveModule, AwbManagementModule, UpdateBookingModule
    ],
    providers: [CollectPaymentService, ExportService],
    exports: [],
    declarations: [ShipmentInformationComponent],
})
export class ShipmentInformationModuleCR { }