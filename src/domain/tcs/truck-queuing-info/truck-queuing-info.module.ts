import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckQueuingInfoComponent } from './truck-queuing-info.component';
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { TcsService } from '../tcs.service'


import {
  NgcCoreModule,
  NgcControlsModule,
  NgcDirectivesModule,
  NgcDomainModule
} from "ngc-framework";


const routes: Routes = [
  // Default
  { path: "", component: TruckQueuingInfoComponent }
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
    NgcDomainModule,
  ],
  exports: [],
  bootstrap: [],
  declarations: [TruckQueuingInfoComponent],
  providers: [TcsService]
})
export class TruckQueuingInfoModule { }
