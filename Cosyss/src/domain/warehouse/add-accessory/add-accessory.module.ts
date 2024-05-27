import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { AddAccessoryComponent } from './add-accessory.component';
import { WarehouseService } from '../warehouse.service';

/**
 * Route
 */
const routes: Routes = [
  // Default
  { path: '', component: AddAccessoryComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    // Admin Child Routes
    //RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [
    AddAccessoryComponent
  ],
  providers: [WarehouseService],
  declarations: [
    AddAccessoryComponent
  ],
  bootstrap: []
})
export class AddAccessoryModule { }

@NgModule({
  imports: [
    // Admin Child Routes
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, AddAccessoryModule
  ],
  exports: [

  ],
  providers: [WarehouseService],
  declarations: [

  ],
  bootstrap: []
})
export class AddAccessoryRouteModule { }
