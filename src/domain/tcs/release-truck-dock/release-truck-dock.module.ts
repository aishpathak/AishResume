import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReleaseTruckDockComponent } from './release-truck-dock.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';

const routes: Routes = [
  { path: "", component: ReleaseTruckDockComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [ReleaseTruckDockComponent],
  declarations: [ReleaseTruckDockComponent],
  providers: [TcsService]
})
export class ReleaseTruckDockModuleWithoutRoute { }

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
    ReleaseTruckDockModuleWithoutRoute
  ],
  exports: [ReleaseTruckDockComponent],
  providers: [TcsService]

})
export class ReleaseTruckDockModule { }
