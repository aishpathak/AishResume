import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { EnquireChargesComponent } from './enquireCharges/enquireCharges.component';
import { WaveChargesComponent } from './waveCharges/waveCharges.component';
import { PayChargesComponent } from './payCharges/payCharges.component';
import { CollectPaymentService } from './collectPayment.service';

const routes: Routes = [
  { path: 'enquireCharges', component: EnquireChargesComponent },
  { path: 'waveCharges', component: WaveChargesComponent },
  { path: 'payCharges', component: PayChargesComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  declarations: [EnquireChargesComponent,
    WaveChargesComponent,
    PayChargesComponent
  ],
  exports: [EnquireChargesComponent],
  providers: [CollectPaymentService]
})
export class CollectPaymentModule { }
