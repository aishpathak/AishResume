// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// TCS
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';
import { TimeSlotComponent } from './time-slot.component';

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [TimeSlotComponent],
  declarations: [TimeSlotComponent],
  providers: [TcsService]
})
export class TimeSlotModule { }
