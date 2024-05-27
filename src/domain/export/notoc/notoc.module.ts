import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcDomainModule, NgcDirectivesModule, NgcControlsModule, NgcCoreModule, NgcUtility } from 'ngc-framework';
import { NotocComponent } from './notoc/notoc.component';
import { NotocService } from './notoc.service';
import { DangerousgoodsService } from '../dangerousgoods/dangerousgoods.service';
import { PsnModule } from '../dangerousgoods/psn-dtl/psn.module';
import { RevisedNotocComponent } from './revised-notoc/revised-notoc.component';

const routes: Routes = [
  { path: 'detail', component: NotocComponent },
  { path: 'revisednotoc', component: RevisedNotocComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, PsnModule
  ],
  providers: [NotocService, DangerousgoodsService],
  declarations: [NotocComponent, RevisedNotocComponent]
})
export class NotocModule { }
