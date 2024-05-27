import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';


import {ExportworkinglistComponent} from './exportworkinglist.component';
import { ExportService } from './../export.service';

const routes: Routes = [
  // Default
  { path: '', component: ExportworkinglistComponent},
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
        CommonModule, ReactiveFormsModule, RouterModule,
        NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [ExportworkinglistComponent],
  providers: [ExportService],
  declarations: [ExportworkinglistComponent]
})
export class ExportwokinglistModule { }
