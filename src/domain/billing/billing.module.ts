import { CollectPaymentModule } from './collectPayment/collectPayment.module';
/**
 * Billing Route Module
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
// Billing Service
import { BillingService } from './billing.service';
import { CollectPaymentService } from './collectPayment/collectPayment.service';
import { BillingReportsService } from './billingReports/billingReports.service'
// Billing Components
import { CreateServiceRequestComponent } from './createServiceRequest/createServiceRequest.component';
import { BillingverificationComponent } from './billingverification/billingverification.component';
import { WaiveapprovalListComponent } from './waiveapproval-list/waiveapproval-list.component';
import { ListServiceRequestComponent } from './listServiceRequest/listServiceRequest.component';
import { EditServiceRequestComponent } from './editServiceRequest/editServiceRequest.component';
import { ChargeCalculatorComponent } from './chargecalculator/chargecalculator.component';
import { CounterclosureVerificationComponent } from './counterclosure-verification/counterclosure-verification.component';
import { GroupPaymentComponent } from './groupPayment/groupPayment.component';
import { SapInvoiceCreditNoteComponent } from './sapInvoiceCreditNote/sapInvoiceCreditNote.component';
import { DriverSummaryReportComponent } from './driver-summary-report/driver-summary-report.component';
import { NgcRegularReportComponent } from './ngc-regular-report/ngc-regular-report.component';
import { AirlineTonnageReportComponent } from './airlineTonnageReport/airlineTonnageReport.component';
import { BillingReportComponent } from './billing-report/billing-report.component';
import { CreditDebitNoteListComponent } from './credit-debit-note-list/credit-debit-note-list.component';
import { CreditDebitNoteComponent } from './credit-debit-note/credit-debit-note.component';
import { ListOfInvoicesComponent } from './list-of-invoices/list-of-invoices.component';
import { PdAccountLedgerComponent } from './pd-account-ledger/pd-account-ledger/pd-account-ledger.component';
// import { BillingReportComponent } from './airlineTonnageReport/airlineTonnageReport.component';

/**
 * Billing Routes
 */
const routes: Routes = [

  { path: 'billingreport', component: BillingReportComponent },
  { path: 'createServiceRequest', component: CreateServiceRequestComponent },
  { path: 'billingverification', component: BillingverificationComponent },
  { path: 'waiveapprovallist', component: WaiveapprovalListComponent },
  { path: 'listServiceRequest', component: ListServiceRequestComponent },
  { path: 'editServiceRequest', component: EditServiceRequestComponent },
  { path: 'counterclosureverification', component: CounterclosureVerificationComponent },
  { path: 'chargecalculator', component: ChargeCalculatorComponent },
  { path: 'chargecalculator/unauth', component: ChargeCalculatorComponent },
  { path: 'groupPayment', component: GroupPaymentComponent },
  { path: 'sapInvoiceCreditNote', component: SapInvoiceCreditNoteComponent },
  { path: 'driverSummaryReport', component: DriverSummaryReportComponent },
  { path: 'ngcRegularReport', component: NgcRegularReportComponent },
  { path: 'airlineTonnageReport', component: AirlineTonnageReportComponent },
  { path: 'listOfInvoices', component: ListOfInvoicesComponent },
  { path: 'listOfCreditDebitNote', component: CreditDebitNoteListComponent },
  { path: 'pdAccountLedger', component: PdAccountLedgerComponent },
  { path: 'creditDebitNote', component: CreditDebitNoteComponent }
];

/**
 * Billing Module
 */
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule,
    CollectPaymentModule
  ],
  declarations: [
    BillingverificationComponent,
    CreateServiceRequestComponent,
    WaiveapprovalListComponent,
    ListServiceRequestComponent,
    EditServiceRequestComponent,
    ChargeCalculatorComponent,
    CounterclosureVerificationComponent,
    GroupPaymentComponent,
    SapInvoiceCreditNoteComponent,
    DriverSummaryReportComponent,
    NgcRegularReportComponent,
    AirlineTonnageReportComponent,
    BillingReportComponent,
    CreditDebitNoteListComponent,
    ListOfInvoicesComponent,
    PdAccountLedgerComponent,
    CreditDebitNoteComponent
  ],
  providers: [BillingService, BillingReportsService, CollectPaymentService]
})
export class BillingModule {
}
