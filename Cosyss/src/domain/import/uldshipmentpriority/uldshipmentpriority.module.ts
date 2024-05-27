import { ImportService } from '../import.service';

// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { UldshipmentpriorityComponent } from './uldshipmentpriority.component';

const routes: Routes = [
  // Default
  { path: '', component: UldshipmentpriorityComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [
    UldshipmentpriorityComponent
  ],
  providers: [ImportService],
  declarations: [
    UldshipmentpriorityComponent
  ],
  bootstrap: []
})
export class UldshipmentpriorityModule {

}
