import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { uldTemperatureLogEntryComponent } from './uldtemperaturelogentry.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';

const routes: Routes = [
  { path: '', component: uldTemperatureLogEntryComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [
    uldTemperatureLogEntryComponent
  ],
  providers: [],
  declarations: [
    uldTemperatureLogEntryComponent
  ],
  bootstrap: []
})
export class UldtemperaturelogentryModule { }
