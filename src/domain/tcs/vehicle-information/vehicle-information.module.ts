import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { VehicleInformationComponent } from './vehicle-information.component';
import { TcsService } from '../tcs.service';

/**
* Route
*/
const routes: Routes = [
  { path: '', component: VehicleInformationComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  declarations: [VehicleInformationComponent],
  providers: [TcsService]

})
export class VehicleInformationModule { }
