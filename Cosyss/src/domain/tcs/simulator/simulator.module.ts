
// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
// TCS
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { SimulatorComponent } from './simulator.component';
import { TcsService } from '../tcs.service';
import { TimeSlotModule } from '../time-slot/time-slot.module';

const routes: Routes = [
  { path: "", component: SimulatorComponent },
  { path: '**', redirectTo: '/' }
];

// Simulator Module
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
    TimeSlotModule
  ],
  declarations: [SimulatorComponent],
  providers: [TcsService]
})
export class SimulatorModule { }
