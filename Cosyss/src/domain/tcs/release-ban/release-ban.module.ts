
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';
import { TcsModule } from '../tcs.module';

import { ReleaseBanComponent } from './release-ban.component';

const routes: Routes = [
  { path: "", component: ReleaseBanComponent },
  { path: '**', redirectTo: '/' }
];
@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, TcsModule
  ],
  exports: [ReleaseBanComponent],
  declarations: [ReleaseBanComponent],
  providers: [TcsService]
})
export class ReleaseBanModuleWithoutRoute { }
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
    ReleaseBanModuleWithoutRoute
  ],
  exports: [ReleaseBanComponent],
  providers: [TcsService]
})
export class ReleaseBanModule { }