import { AutoKcScreeningTargetComponent } from './auto-kc-screening-target.component';
import { ExportService } from './../export.service';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';

const routes: Routes = [
  // Default
  { path: '', component: AutoKcScreeningTargetComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    // Admin Child Routes
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [
    AutoKcScreeningTargetComponent
  ],
  providers: [ExportService],
  declarations: [
    AutoKcScreeningTargetComponent
  ],
  bootstrap: []
})
export class AutoKcScreeningTargetModule {

}  
