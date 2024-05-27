import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExitGateComponent } from './exit-gate.component';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';
import { TruckInformationComponent } from './../truck-information/truck-information.component';
import { TruckInformationModuleWithoutRoute } from '../truck-information/truck-information.module';


const routes: Routes = [
	{ path: "", component: ExitGateComponent },
	{ path: '**', redirectTo: '/' }

];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule, ReactiveFormsModule, RouterModule,
		NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
		TruckInformationModuleWithoutRoute
	],
	declarations: [ExitGateComponent],
	providers: [TcsService]
})
export class ExitGateModule { }
