import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcDomainModule, NgcDirectivesModule, NgcControlsModule, NgcCoreModule, NgcUtility } from 'ngc-framework';;
import { PsnDtlComponent } from './psn-dtl.component';
import { DangerousgoodsService } from '../dangerousgoods.service';

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  exports: [
    PsnDtlComponent
],
providers: [DangerousgoodsService],
  declarations: [PsnDtlComponent]
})
export class PsnModule { }
