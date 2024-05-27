import { CommonModule } from '@angular/common';
import { TruckDockMonitoringComponent } from './truck-dock-monitoring.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';
import { TcsModule } from '../tcs.module';
import { CreateBanModuleWithoutRoute } from '../create-ban/create-ban.module';
import { ReleaseTruckDockModuleWithoutRoute } from '../release-truck-dock/release-truck-dock.module';
import { AdhocDockUpdateModuleWithoutRoute } from '../adhoc-dock-update/adhoc-dock-update.module';
import { ReserveTruckDockSaveModuleWithoutRoute } from '../reserve-truck-dock-save/reserve-truck-dock-save.module';
import { AssignTruckDockModuleWithoutRoute } from '../assign-truck-dock/assign-truck-dock.module';
import { ConnectingTruckModuleWithoutRoute } from '../connecting-truck/connecting-truck.module';
import { TruckInformationModuleWithoutRoute } from '../truck-information/truck-information.module';
import { UnReserveTruckDockSaveModuleWithoutRoute } from '../unreserve-truck-dock/unreserve-truck-dock.module';
import { ReleaseBanModuleWithoutRoute } from '../release-ban/release-ban.module';

const routes: Routes = [
	{ path: "", component: TruckDockMonitoringComponent },
	{ path: '**', redirectTo: '/' }
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule, ReactiveFormsModule, RouterModule,
		NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, TcsModule,
		CreateBanModuleWithoutRoute, ReleaseTruckDockModuleWithoutRoute,
		AdhocDockUpdateModuleWithoutRoute, ReserveTruckDockSaveModuleWithoutRoute,
		AssignTruckDockModuleWithoutRoute, AdhocDockUpdateModuleWithoutRoute,
		ConnectingTruckModuleWithoutRoute, TruckInformationModuleWithoutRoute,
		UnReserveTruckDockSaveModuleWithoutRoute,
		ReleaseBanModuleWithoutRoute
	],
	declarations: [TruckDockMonitoringComponent],
	providers: [TcsService]
})
export class TruckDockMonitoringModule { }
