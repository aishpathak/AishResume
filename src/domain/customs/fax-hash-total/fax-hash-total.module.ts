import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaxHashTotalComponent } from './fax-hash-total.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CustomACESService } from './../customs.service';


const routes: Routes = [

  { path: '', component: FaxHashTotalComponent },
  { path: '**', redirectTo: '/' }
];
@NgModule({
  imports: [

    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule

  ],
  exports: [FaxHashTotalComponent],
  providers: [CustomACESService],
  declarations: [FaxHashTotalComponent]
})

export class FaxHashTotalModule { }
