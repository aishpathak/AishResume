
import { TenantQueuingInformationComponent } from './tenant-queuing-information.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';

import { MaintainTruckDockModuleWithoutRoute } from '../maintain-truck-dock/maintain-truck-dock.module';


const routes: Routes = [

  { path: "", component: TenantQueuingInformationComponent },

  { path: '**', redirectTo: '/' }

];


@NgModule({
  imports: [

    RouterModule.forChild(routes),

    CommonModule, ReactiveFormsModule, RouterModule,

    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, MaintainTruckDockModuleWithoutRoute

  ],
  declarations: [TenantQueuingInformationComponent],
  providers: [TcsService]

})
export class TenantQueuingInformationModule {

}
