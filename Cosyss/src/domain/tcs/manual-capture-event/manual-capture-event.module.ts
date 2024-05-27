import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { ManualCaptureEventComponent } from './manual-capture-event.component';
import { TcsService } from '../tcs.service';


const routes: Routes = [

  { path: '', component: ManualCaptureEventComponent },

  { path: '**', redirectTo: '/' }

];


@NgModule({
  imports: [

    RouterModule.forChild(routes),

    CommonModule, ReactiveFormsModule, RouterModule,

    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

  ],
  providers: [DatePipe, TcsService],
  declarations: [ManualCaptureEventComponent]
})
export class ManualCaptureEventModule { }
