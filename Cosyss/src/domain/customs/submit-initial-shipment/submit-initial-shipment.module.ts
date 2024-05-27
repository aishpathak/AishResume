import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitInitialShipmentComponent } from './submit-initial-shipment.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CustomACESService } from './../customs.service';

const routes: Routes = [

  { path: '', component: SubmitInitialShipmentComponent },
  { path: '**', redirectTo: '/' }

];
@NgModule({
  imports: [

    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

  ],
  exports: [
    SubmitInitialShipmentComponent
  ],
  providers: [CustomACESService],
  declarations: [SubmitInitialShipmentComponent]
})
export class SubmitInitialShipmenttModule { }
@NgModule({
  imports: [
    // Admin Child Routes
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, SubmitInitialShipmenttModule
  ],
  exports: [

  ],
  providers: [],
  declarations: [],
  bootstrap: []
})
export class SubmitInitialShipmentRouteModule { }

