import { ImportService } from '../import.service';


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { ExportflightPouchHnadlingComponent } from './exportflight-pouch-hnadling.component';


/**
 * Route
 */
const routes: Routes = [
  // Default
  { path: '', component: ExportflightPouchHnadlingComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [
    ExportflightPouchHnadlingComponent
  ],

  providers: [ImportService],
  declarations: [ExportflightPouchHnadlingComponent],
  bootstrap: []

})
export class ExportflightPouchHnadlingModule { }
