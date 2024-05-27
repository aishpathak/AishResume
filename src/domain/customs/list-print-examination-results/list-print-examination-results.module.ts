import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPrintExaminationResultsComponent } from './list-print-examination-results.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';

const routes: Routes = [
  { path: '', component: ListPrintExaminationResultsComponent }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  declarations: [ListPrintExaminationResultsComponent]
})
export class ListPrintExaminationResultsModule { }
