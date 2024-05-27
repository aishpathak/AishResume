import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';
import { MaintainTruckDockModuleWithoutRoute } from '../maintain-truck-dock/maintain-truck-dock.module';
import { TruckParkActivityComponent } from './truck-park-activity.component';
const routes: Routes = [
    { path: '', component: TruckParkActivityComponent },
    { path: '**', redirectTo: '/' }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, MaintainTruckDockModuleWithoutRoute
    ],
    declarations: [TruckParkActivityComponent],
    providers: [TcsService]

})
export class TruckParkActivityModule { }
