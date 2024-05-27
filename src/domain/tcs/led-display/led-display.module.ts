import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { LedDisplayComponent } from './led-display.component';
import { TcsService } from '../tcs.service';


const routes: Routes = [

  { path: '', component: LedDisplayComponent },

  { path: '**', redirectTo: '/' }

];


@NgModule({
  imports: [

    RouterModule.forChild(routes),

    CommonModule, ReactiveFormsModule, RouterModule,

    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

  ],

  declarations: [LedDisplayComponent],
  providers: [TcsService]
})
export class LedDisplayModule { }
