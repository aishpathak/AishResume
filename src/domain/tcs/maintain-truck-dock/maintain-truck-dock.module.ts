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
//
import { TcsService } from "../tcs.service";
//
import { MaintainTruckDockComponent } from './maintain-truck-dock.component';
import { AddQueueModuleWithoutRoute } from "../add-queue/add-queue.module";
import { AssignTruckDockModuleWithoutRoute } from "../assign-truck-dock/assign-truck-dock.module";
import { TruckActivityModuleWithoutRoute } from "../truck-activity/truck-activity.module";
import { ReleaseTruckDockModuleWithoutRoute } from "../release-truck-dock/release-truck-dock.module";
import { ReserveTruckDockSaveModuleWithoutRoute } from "../reserve-truck-dock-save/reserve-truck-dock-save.module";
import { ConnectingTruckModuleWithoutRoute } from "../connecting-truck/connecting-truck.module";
import { CreateBanModuleWithoutRoute } from "../create-ban/create-ban.module";
import { ReleaseBanModuleWithoutRoute } from "../release-ban/release-ban.module";
import { BanHistoryModuleWithoutRoute } from "../ban-history/ban-history.module";

const routes: Routes = [
    { path: "", component: MaintainTruckDockComponent },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        NgcCoreModule,
        NgcControlsModule,
        NgcDirectivesModule,
        NgcDomainModule,
        AddQueueModuleWithoutRoute,
        TruckActivityModuleWithoutRoute,
        ReleaseTruckDockModuleWithoutRoute,
        AssignTruckDockModuleWithoutRoute,
        ReserveTruckDockSaveModuleWithoutRoute,
        ConnectingTruckModuleWithoutRoute,
        CreateBanModuleWithoutRoute,
        ReleaseBanModuleWithoutRoute,
        BanHistoryModuleWithoutRoute
    ],
    exports: [MaintainTruckDockComponent],
    declarations: [MaintainTruckDockComponent],
    providers: [TcsService]
})
export class MaintainTruckDockModuleWithoutRoute { }



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
        CreateBanModuleWithoutRoute,
        ReleaseBanModuleWithoutRoute,
        BanHistoryModuleWithoutRoute,
        AddQueueModuleWithoutRoute,
        TruckActivityModuleWithoutRoute,
        ReleaseTruckDockModuleWithoutRoute,
        AssignTruckDockModuleWithoutRoute,
        ReserveTruckDockSaveModuleWithoutRoute,
        ConnectingTruckModuleWithoutRoute,
        MaintainTruckDockModuleWithoutRoute
    ],

    providers: [TcsService]
})
export class MaintainTruckDockModule { }
