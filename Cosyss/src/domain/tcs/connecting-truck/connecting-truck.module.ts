
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';
import { ConnectingTruckComponent } from './connecting-truck.component';

const routes: Routes = [
  { path: '', component: ConnectingTruckComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [ConnectingTruckComponent],
  declarations: [ConnectingTruckComponent],
  providers: [TcsService]

})
export class ConnectingTruckModuleWithoutRoute { }

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
    ConnectingTruckModuleWithoutRoute
  ],
  exports: [ConnectingTruckComponent],
  providers: [TcsService]

})
export class ConnectingTruckModule { }
