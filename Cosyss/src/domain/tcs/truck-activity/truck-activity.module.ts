import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TruckActivityComponent } from './truck-activity.component';
import { TcsService } from '../tcs.service';

/**
* Route
*/
const routes: Routes = [
  { path: '', component: TruckActivityComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  declarations: [TruckActivityComponent],
  exports: [TruckActivityComponent],
  providers: [TcsService]
})
export class TruckActivityModuleWithoutRoute { }

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
    TruckActivityModuleWithoutRoute
  ],
  exports: [TruckActivityComponent],
  providers: [TcsService]
})
export class TruckActivityModule { }
