
import { MaintainRemarkModule } from './../maintain-remark/maintain-remark.module';
import { CommonService } from './../../common/common.service';
//import { MaintainHouseMasterModule } from './../maintain-house-master/maintain-house-master.module';
import { CommonRoutingModule } from './../../common/common.module';
import { ShipmentOnHoldModule } from './../shipmentOnHold/shipmentOnHold.module';
import { MaintainShipmentIrregularityModule } from './../maintain-shipment-irregularity/maintain-shipment-irregularity.module';
import { CommonsModule } from '../../common/common.module';
import { CollectPaymentService } from '../../billing/collectPayment/collectPayment.service';


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
import { HwbInformationComponent } from "./hwb-information.component";
import { ShipmentLocationModule } from "./../shipmentLocation/shipmentLocation.module";







/**
 * Route
 */
const routes: Routes = [
    // Default
    { path: '', component: HwbInformationComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        // Admin Child Routes
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, ShipmentLocationModule,
        ShipmentOnHoldModule, MaintainShipmentIrregularityModule, CommonsModule,
        MaintainRemarkModule, CommonRoutingModule
    ],
    exports: [HwbInformationComponent
    ],
    declarations: [
        HwbInformationComponent,
    ],
    bootstrap: [],
    providers: [CollectPaymentService, CommonService]
})
export class HwbInformationModule { }
