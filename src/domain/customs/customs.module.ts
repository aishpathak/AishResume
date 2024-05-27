import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgcControlsModule, NgcCoreModule, NgcDirectivesModule, NgcDomainModule } from 'ngc-framework';
import { CargomanifestdeclerationComponent } from './cargomanifestdecleration/cargomanifestdecleration.component';
import { CustomACESCodesComponent } from './customACEScodes/customACESCodes.component';
import { CustomFlightScheduleComponent } from './customFlightSchedule/customFlightSchedule.component';
import { CustomsShipmentAddUpdateComponent } from './customs-shipment-add-update/customs-shipment-add-update.component';
import { CustomACESService } from './customs.service';
import { CustomsmanifestreconsilestatementComponent } from './customsmanifestreconsilestatement/customsmanifestreconsilestatement.component';
import { SubmitLeftBehindConsignmentComponent } from './submit-left-behind-consignment/submit-left-behind-consignment.component';
import { SubmitInitialConsignmentComponent } from './submit-initial-consignment/submit-initial-consignment.component';
import { SubmitAmendedConsignmentComponent } from './submit-amended-consignment/submit-amended-consignment.component';
import { SubmitInitialShipmentComponent } from './submit-initial-shipment/submit-initial-shipment.component';
import { SubmitAmendedShipmentComponent } from './submit-amended-shipment/submit-amended-shipment.component';
import { MaintainAccsComponent } from './maintain-accs/maintain-accs.component';
import { MaintainHawbListComponent } from './maintain-hawb-list/maintain-hawb-list.component';
import { MaintainHawbInformationComponent } from './maintain-hawb-information/maintain-hawb-information.component';
import { SubmitBreakdownDiscrepancyComponent } from './submit-breakdown-discrepancy/submit-breakdown-discrepancy.component';
import { SubmitLeftBehindShipmentComponent } from './submit-left-behind-shipment/submit-left-behind-shipment.component';
import { PrintConstraintCodeReportComponent } from './print-constraint-code-report/print-constraint-code-report.component';
import { ListBreakdownDiscrepancyComponent } from './list-breakdown-discrepancy/list-breakdown-discrepancy.component';
import { EIttSubmissionConfirmationCancellationComponent } from './e-itt-submission-confirmation-cancellation/e-itt-submission-confirmation-cancellation.component';
import { CustomsmessagelogdetailsComponent } from './customsmessagelogdetails/customsmessagelogdetails.component';
import { SubmitExportConsignmentComponent } from './submit-export-consignment/submit-export-consignment.component';
import { SubmitExportShipmentComponent } from './submit-export-shipment/submit-export-shipment.component';
import { AmendDcDetailsComponent } from './amend-dc-details/amend-dc-details.component';
import { FaxHashTotalComponent } from './fax-hash-total/fax-hash-total.component';
import { SubmitReconciliationComponent } from './submit-reconciliation/submit-reconciliation.component';
import { SubmitReconciliationMessageComponent } from './submit-reconciliation-message/submit-reconciliation-message.component';
import { SubmitReconciliationHistoryComponent } from './submit-reconciliation-history/submit-reconciliation-history.component';
import { SubmitReconciliationErrorComponent } from './submit-reconciliation-error/submit-reconciliation-error.component';
import { SubmitReconciliationErrordetailsComponent } from './submit-reconciliation-errordetails/submit-reconciliation-errordetails.component';
import { ListPrintExaminationResultsComponent } from './list-print-examination-results/list-print-examination-results.component';
import { LeftBehindManagementComponent } from '../customs/left-behind-management/left-behind-management.component';


const routes: Routes = [
  { path: 'customacescodes', component: CustomACESCodesComponent },
  { path: 'customflightschedule', component: CustomFlightScheduleComponent },
  { path: 'customsmanifestreconsilation', component: CustomsmanifestreconsilestatementComponent },
  { path: 'customsmanifestdecleration', component: CargomanifestdeclerationComponent },
  { path: 'customsshipmentaddupdate', component: CustomsShipmentAddUpdateComponent },
  { path: 'shipmentconsignment', component: SubmitLeftBehindShipmentComponent },
  { path: 'leftbehindconsignment', component: SubmitLeftBehindConsignmentComponent },
  { path: 'maintainaccs', component: MaintainAccsComponent },
  { path: 'submitinitialconsignment', component: SubmitInitialConsignmentComponent },
  { path: 'submitAmendedConsignment', component: SubmitAmendedConsignmentComponent },
  { path: 'submitInitialShipment', component: SubmitInitialShipmentComponent },
  { path: 'submitAmendedShipment', component: SubmitAmendedShipmentComponent },
  { path: 'maintainhawblist', component: MaintainHawbListComponent },
  { path: 'maintainhawbinformation', component: MaintainHawbInformationComponent },
  { path: 'submitbreakdowndiscrepancy', component: SubmitBreakdownDiscrepancyComponent },
  { path: 'printConstraintCodeReport', component: PrintConstraintCodeReportComponent },
  { path: 'listbreakdowndiscrepancy', component: ListBreakdownDiscrepancyComponent },
  { path: 'customsmessagelogdetails', component: CustomsmessagelogdetailsComponent },
  { path: 'submitExportConsignment', component: SubmitExportConsignmentComponent },
  { path: 'submitExportShipment', component: SubmitExportShipmentComponent },
  { path: 'amendDcDetails', component: AmendDcDetailsComponent },
  { path: 'faxHashTotal', component: FaxHashTotalComponent },
  { path: 'eITTSubmissionConfimationCancellation', component: EIttSubmissionConfirmationCancellationComponent },
  { path: 'submitreconciliation', component: SubmitReconciliationComponent },
  { path: 'submitreconciliationmessage', component: SubmitReconciliationMessageComponent },
  { path: 'submitreconciliationhistory', component: SubmitReconciliationHistoryComponent },
  { path: 'submitreconciliationerror', component: SubmitReconciliationErrorComponent },
  { path: 'submitreconciliationerrordetails', component: SubmitReconciliationErrordetailsComponent },
  { path: 'listPrintExaminationResults', component: ListPrintExaminationResultsComponent },
  { path: 'leftBehindManagementreport', component: LeftBehindManagementComponent },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule
  ],

  declarations: [
    CustomACESCodesComponent,
    CustomFlightScheduleComponent,
    CustomsmanifestreconsilestatementComponent,
    CargomanifestdeclerationComponent,
    CustomsShipmentAddUpdateComponent,
    SubmitLeftBehindConsignmentComponent,
    SubmitInitialConsignmentComponent,
    SubmitAmendedConsignmentComponent,
    SubmitInitialShipmentComponent,
    SubmitAmendedShipmentComponent,
    SubmitLeftBehindConsignmentComponent,
    MaintainAccsComponent,
    MaintainHawbListComponent,
    MaintainHawbInformationComponent,
    SubmitBreakdownDiscrepancyComponent,
    SubmitLeftBehindShipmentComponent,
    PrintConstraintCodeReportComponent,
    ListBreakdownDiscrepancyComponent,
    CustomsmessagelogdetailsComponent,
    SubmitExportConsignmentComponent,
    SubmitExportShipmentComponent,
    AmendDcDetailsComponent,
    FaxHashTotalComponent,
    EIttSubmissionConfirmationCancellationComponent,
    SubmitReconciliationComponent,
    SubmitReconciliationMessageComponent,
    SubmitReconciliationHistoryComponent,
    SubmitReconciliationErrorComponent,
    SubmitReconciliationErrordetailsComponent,
    ListPrintExaminationResultsComponent,
    LeftBehindManagementComponent


    // MaintainAccsComponent,
  ],
  providers: [CustomACESService, CustomACESService
  ]


})
export class CustomACESModule { }
