import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { AdhocDockUpdateComponent } from './adhoc-dock-update.component';
import { TcsService } from '../tcs.service';


const routes: Routes = [
	{ path: '', component: AdhocDockUpdateComponent },
	{ path: '**', redirectTo: '/' }
];

@NgModule({
	imports: [
		CommonModule, ReactiveFormsModule, RouterModule,
		NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
	],
	declarations: [AdhocDockUpdateComponent],
	exports: [AdhocDockUpdateComponent],
	providers: [TcsService]
})
export class AdhocDockUpdateModuleWithoutRoute { }

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule, ReactiveFormsModule, RouterModule,
		NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
		AdhocDockUpdateModuleWithoutRoute
	],
	exports: [AdhocDockUpdateComponent],
	providers: [TcsService]
})
export class AdhocDockUpdateModule { }
