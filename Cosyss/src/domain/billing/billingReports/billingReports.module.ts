/**
 * Billing Reports Route Module
 *
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
// Core
import {
  NgcCoreModule,
  NgcControlsModule,
  NgcDirectivesModule,
  NgcDomainModule
} from "ngc-framework";
// Billing Reports Service
import { BillingReportsService } from "./billingReports.service";
//Report Components
import { TransactionReportComponent } from "./transactionReport/transactionReport.component";
import { InboundCargoCollectionReportComponent } from "./inboundCargoCollectionReport/inboundCargoCollectionReport.component";
import { ReturnsOnMiscellaneousServiceReportComponent } from "./returnsOnMiscellaneousServiceReport/returnsOnMiscellaneousServiceReport.component";
import { ShortCollectionReportComponent } from "./shortCollectionReport/shortCollectionReport.component";
import { BankingSlipsReportComponent } from "./bankingSlipsReport/bankingSlipsReport.component";
import { CargoSalesReturnComponent } from "./cargo-sales-return/cargo-sales-return.component";
import { BillingControlReportsComponent } from "./billingControlReports/billingControlReports.component";
import { AccountingffmComponent } from "./accountingffm/accountingffm.component";
import { UldAccountingComponent } from "./uldAccounting/uldAccounting.component";

const routes: Routes = [
  { path: "transactionReport", component: TransactionReportComponent },
  {
    path: "inboundCargoCollectionReport",
    component: InboundCargoCollectionReportComponent
  },
  {
    path: "returnsOnMiscellaneousServiceReport",
    component: ReturnsOnMiscellaneousServiceReportComponent
  },
  { path: "shortCollectionReport", component: ShortCollectionReportComponent },
  { path: "bankingSlipsReport", component: BankingSlipsReportComponent },
  { path: "cargoSalesReturnReport", component: CargoSalesReturnComponent },
  { path: "billingControlReports", component: BillingControlReportsComponent },
  { path: "accountingFfm", component: AccountingffmComponent },
  { path: "uldAccounting", component: UldAccountingComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgcCoreModule,
    NgcControlsModule,
    NgcDirectivesModule,
    NgcDomainModule
  ],
  declarations: [
    TransactionReportComponent,
    InboundCargoCollectionReportComponent,
    ReturnsOnMiscellaneousServiceReportComponent,
    ShortCollectionReportComponent,
    BankingSlipsReportComponent,
    CargoSalesReturnComponent,
    BillingControlReportsComponent,
    AccountingffmComponent,
    UldAccountingComponent
  ],
  providers: [BillingReportsService]
})
export class BillingReportsModule {}
