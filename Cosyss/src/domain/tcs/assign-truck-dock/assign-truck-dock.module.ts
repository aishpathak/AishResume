import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { AssignTruckDockComponent } from './assign-truck-dock.component';
import { TcsService } from '../tcs.service';

const routes: Routes = [
  { path: '', component: AssignTruckDockComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [AssignTruckDockComponent],
  declarations: [AssignTruckDockComponent],
  providers: [TcsService]
})
export class AssignTruckDockModuleWithoutRoute { }

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
    AssignTruckDockModuleWithoutRoute
  ],
  exports: [AssignTruckDockComponent],
  providers: [TcsService]
})
export class AssignTruckDockModule { }