import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TruckDockTemplateComponent } from './truck-dock-template.component';
import { TcsService } from '../tcs.service';
const routes: Routes = [
  { path: '', component: TruckDockTemplateComponent },
  { path: '**', redirectTo: '/' }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  declarations: [TruckDockTemplateComponent],
  providers: [TcsService]

})
export class TruckDockTemplateModule { }
