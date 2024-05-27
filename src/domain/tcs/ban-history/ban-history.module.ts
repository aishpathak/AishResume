import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BanHistoryComponent } from './ban-history.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { TcsService } from '../tcs.service';
import { TcsModule } from '../tcs.module';

const routes: Routes = [
  { path: "", component: BanHistoryComponent },
  { path: '**', redirectTo: '/' }
];
@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, TcsModule
  ],
  exports: [BanHistoryComponent],
  declarations: [BanHistoryComponent],
  providers: [TcsService]
})
export class BanHistoryModuleWithoutRoute { }

@NgModule({
  imports: [
    RouterModule.forChild(routes), CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, TcsModule, BanHistoryModuleWithoutRoute
  ],
  exports: [BanHistoryComponent],
  providers: [TcsService]
})
export class BanHistoryModule { }

