import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintainConstraintCodeComponent } from './maintain-constraint-code.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CustomACESService } from '../customs.service';

const routes: Routes = [
  { path: '', component: MaintainConstraintCodeComponent }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  declarations: [MaintainConstraintCodeComponent],
  providers: [CustomACESService]
})
export class MaintainConstraintCodeModule { }
