/**
 * Billing Setup Route Module
 *
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Core
import { NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { BillingService } from '../billing.service';
//import { AirlineCreditDebitNoteComponent } from './airline-credit-debit-note/airline-credit-debit-note.component';

const routes: Routes = [
   // { path: 'CreditDebitInvoiceAirlineBilling', component: AirlineCreditDebitNoteComponent }
]
/**
 * Billing Setup Module
 */
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],
  declarations: [
   // AirlineCreditDebitNoteComponent
  ],
  providers: [BillingService]
})
export class AirlineBillingModule { }
