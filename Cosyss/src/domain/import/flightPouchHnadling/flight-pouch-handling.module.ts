import { ImportService } from '../import.service';


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { FlightPouchHandlingComponent } from './flight-pouch-handling.component';



/**
 * Route
 */
const routes: Routes = [
  // Default
  { path: '', component: FlightPouchHandlingComponent },
  { path: '**', redirectTo: '/' }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [
    FlightPouchHandlingComponent
  ],

  providers: [ImportService],
  declarations: [FlightPouchHandlingComponent],
  bootstrap: []
})
export class FlightPouchHandlingModule { }
