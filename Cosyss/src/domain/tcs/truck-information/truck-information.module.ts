import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruckInformationComponent } from './truck-information.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';

const routes: Routes = [
  { path: "", component: TruckInformationComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    RouterModule, CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [TruckInformationComponent],
  declarations: [TruckInformationComponent],
  providers: [TcsService]
})
export class TruckInformationModuleWithoutRoute { }


@NgModule({
  imports: [
    RouterModule.forChild(routes), CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
    TruckInformationModuleWithoutRoute
  ],
  exports: [TruckInformationComponent],
  providers: [TcsService]
})
export class TruckInformationModule { }
