import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { ScheduleCollectionComponent } from './schedule-collection.component';
import { TcsService } from '../tcs.service';


const routes: Routes = [

  { path: '', component: ScheduleCollectionComponent },

  { path: '**', redirectTo: '/' }

];


@NgModule({
  imports: [

    RouterModule.forChild(routes),

    CommonModule, ReactiveFormsModule, RouterModule,

    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

  ],
  declarations: [ScheduleCollectionComponent],
  providers: [TcsService]

})
export class ScheduleCollectionModule { }
