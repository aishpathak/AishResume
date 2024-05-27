import { ExportService } from './../export.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgcDomainModule, NgcDirectivesModule, NgcControlsModule, NgcCoreModule, NgcUtility } from 'ngc-framework';
import { AcceptenceWeighingBupComponent } from './acceptence-weighing-bup/acceptence-weighing-bup.component';
import { AcceptanceService } from './acceptance.service';
import { BuildupService } from '../buildup/buildup.service';
import { ShipmentSummaryComponent } from './shipment-summary/shipment-summary.component';
import { AwbInformationComponent } from './awb-information/awb-information.component';
import { CargoDocumentAcceptanceComponent } from './cargo-document-acceptance/cargo-document-acceptance.component';
import { AcceptanceHandlingDefinitionComponent } from './acceptance-handling-definition/acceptance-handling-definition.component';
import { ManageAcceptanceWeighingComponent } from './manage-acceptance-weighing/manage-acceptance-weighing.component';
import { AutoweighCapturedUldListComponent } from './autoweigh-captured-uld-list/autoweigh-captured-uld-list.component';
import { AcceptanceWeighingCargoDetailsComponent } from './acceptance-weighing-cargo-details/acceptance-weighing-cargo-details.component';
import { RejectShipmentComponent } from './reject-shipment/reject-shipment.component';
import { ReturnShipmentComponent } from './return-shipment/return-shipment.component';
import { TruckdockAcceptanceMonitoringComponent } from './truckdock-acceptance-monitoring/truckdock-acceptance-monitoring.component';
import { RcarScreeningPointComponent } from './rcar-screening-point/rcar-screening-point.component';
import { ShipmentToBeScreenedComponent } from './shipment-to-be-screened/shipment-to-be-screened.component';
import { ExportBooklistMailComponent } from './export-booklist-mail/export-booklist-mail.component';
import { ReturnMailComponent } from './return-mail/return-mail.component';
import { ExportMailManifestComponent } from './export-mail-manifest/export-mail-manifest.component';
import { AcasQueryComponent } from './acas-query/acas-query.component';
import { EmbargoMailComponent } from './embargoMail/embargoMail.component';
import { ListscawbComponent } from './listscawb/listscawb.component';
// REVAMPINF OF E-ACCEPTANCE
import { ManageCargoPreLodgeComponent } from './manage-cargo-pre-lodge/manage-cargo-pre-lodge.component';
import { ManageCargoAcceptanceComponent } from './manage-cargo-acceptance/manage-cargo-acceptance.component';
import { ManageCargoLocalCourierComponent } from './manage-cargo-local-courier/manage-cargo-local-courier.component';
import { ManageCargoTruckingSurfComponent } from './manage-cargo-trucking-surf/manage-cargo-trucking-surf.component';
import { ManageCargoNawbShipmentComponent } from './manage-cargo-nawb-shipment/manage-cargo-nawb-shipment.component';
import { ManageCargoAwbInformationComponent } from './manage-cargo-awb-information/manage-cargo-awb-information.component';
import { ManageCargoTruckingFlightComponent } from './manage-cargo-trucking-flight/manage-cargo-trucking-flight.component';
import { ManageCargoEReadyShipmentComponent } from './manage-cargo-e-ready-shipment/manage-cargo-e-ready-shipment.component';
import { ManageCargoTranshipmentCourierComponent } from './manage-cargo-transhipment-courier/manage-cargo-transhipment-courier.component';
// import { ManageAcceptanceWeighingRevisedComponent } from './manage-acceptance-weighing-revised/manage-acceptance-weighing-revised.component';
// import { ManageAcceptanceWeighingCargodetailsComponent } from './manage-acceptance-weighing-cargodetails/manage-acceptance-weighing-cargodetails.component';
// import { ManageAcceptanceWeighingDimensionsComponent } from './manage-acceptance-weighing-dimensions/manage-acceptance-weighing-dimensions.component';
// import { ManageAcceptanceWeighingRemarksComponent } from './manage-acceptance-weighing-remarks/manage-acceptance-weighing-remarks.component';
// import { ManageAcceptanceWeighingActionlistComponent } from './manage-acceptance-weighing-actionlist/manage-acceptance-weighing-actionlist.component';
import { ManageAcceptanceWeighingRevisedComponent } from './manage-acceptance-weighing-revised/manage-acceptance-weighing-revised.component';
import { ShipmentVolumetricWeightInfoComponent } from './shipment-volumetric-weight-info/shipment-volumetric-weight-info.component';
import { TracingService } from './../../tracing/tracing.service';
import { MailExportAcceptanceModule } from './mail-export-acceptance/mail-export-acceptance.module';
import { ExportAwbDocumentComponent } from './exportAwbDocument/exportAwbDocument.component';
import { AcceptanceWeighingByHouseSummaryComponent } from './acceptance-weighing-by-house-summary/acceptance-weighing-by-house-summary.component';
import { AcceptanceMonitoringByHouseComponent } from './acceptance-monitoring-by-house/acceptance-monitoring-by-house.component';
import { MRCLSummaryComponent } from '../acceptance/by-packaging/mrclsummary/mrclsummary.component';
import { MaintainmrclpredeclarationComponent } from '../acceptance/by-packaging/mrclsummary/maintainmrclpredeclaration/maintainmrclpredeclaration.component';
import { RclsummaryComponent } from './by-packaging/rclsummary/rclsummary.component';
import { MaintainRCLComponent } from './by-packaging/maintain-rcl/maintain-rcl.component';
import { LocaltransferComponent } from './by-packaging/localtransfer/localtransfer.component';

const routes: Routes = [
  { path: 'acceptence-weighing-bup', component: AcceptenceWeighingBupComponent },
  { path: 'acceptancehandlingdefinition', component: AcceptanceHandlingDefinitionComponent },
  { path: 'shipmentsummary', component: ShipmentSummaryComponent },
  { path: 'awbinformation', component: AwbInformationComponent },
  { path: 'cargodocumentacceptance', component: CargoDocumentAcceptanceComponent },
  { path: 'acceptanceweighingcargodetails', component: AcceptanceWeighingCargoDetailsComponent },
  { path: 'autoweighcaptureduldlist', component: AutoweighCapturedUldListComponent },
  { path: 'manageacceptanceweighing', component: ManageAcceptanceWeighingComponent },
  { path: 'rejectshipment', component: RejectShipmentComponent },
  { path: 'returnshipment', component: ReturnShipmentComponent },
  { path: 'truckdockacceptancemonitoring', component: TruckdockAcceptanceMonitoringComponent },
  { path: 'exportbooklistmail', component: ExportBooklistMailComponent },
  { path: 'returnmail', component: ReturnMailComponent },
  { path: 'rcarscreeningpoint', component: RcarScreeningPointComponent },
  { path: 'shipmenttobescreened', component: ShipmentToBeScreenedComponent },
  { path: 'exportmailmanifest', component: ExportMailManifestComponent },
  { path: 'acasquery', component: AcasQueryComponent },
  { path: 'embargoMail', component: EmbargoMailComponent },
  { path: 'scawblist', component: ListscawbComponent },
  // REVAMPINF OF E-ACCEPTANCE
  { path: 'managecargoprelodge', component: ManageCargoPreLodgeComponent },
  { path: 'managecargoacceptance', component: ManageCargoAcceptanceComponent },
  { path: 'managecargolocalcourier', component: ManageCargoLocalCourierComponent },
  { path: 'managecargotruckingsurf', component: ManageCargoTruckingSurfComponent },
  { path: 'managecargonawbshipment', component: ManageCargoNawbShipmentComponent },
  { path: 'managecargoereadyshipment', component: ManageCargoEReadyShipmentComponent },
  { path: 'managecargoawbinformation', component: ManageCargoAwbInformationComponent },
  { path: 'managecargotruckingflight', component: ManageCargoTruckingFlightComponent },
  { path: 'managecargotranshipmentcourier', component: ManageCargoTranshipmentCourierComponent },
  { path: 'manageacceptanceweighingrevised', component: ManageAcceptanceWeighingRevisedComponent },
  { path: 'shipmentvolumetricweightinfo', component: ShipmentVolumetricWeightInfoComponent },
  { path: 'exportawbdocument', component: ExportAwbDocumentComponent },
  { path: 'acceptancesummarybyhouse', component: AcceptanceWeighingByHouseSummaryComponent },
  { path: 'acceptancemonitoringbyhouse', component: AcceptanceMonitoringByHouseComponent },
  { path: 'mRCLSummary', component: MRCLSummaryComponent },
  { path: 'mRCLPredeclration', component: MaintainmrclpredeclarationComponent },
  { path: 'rclsummary', component: RclsummaryComponent },
  { path: 'maintainRcl', component: MaintainRCLComponent },
  { path: 'localtransfer', component: LocaltransferComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule, ReactiveFormsModule, RouterModule,
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcDomainModule, MailExportAcceptanceModule
  ],
  providers: [
    AcceptanceService, ExportService, BuildupService, TracingService
  ],
  declarations: [AcceptenceWeighingBupComponent,
    AcceptanceHandlingDefinitionComponent,
    CargoDocumentAcceptanceComponent,
    ShipmentSummaryComponent,
    AwbInformationComponent,
    AcceptanceWeighingCargoDetailsComponent,
    AutoweighCapturedUldListComponent,
    ManageAcceptanceWeighingComponent,
    ManageAcceptanceWeighingRevisedComponent,
    // ManageAcceptanceWeighingCargodetailsComponent,
    // ManageAcceptanceWeighingDimensionsComponent,
    // ManageAcceptanceWeighingRemarksComponent,
    // ManageAcceptanceWeighingActionlistComponent,
    RejectShipmentComponent,
    ReturnShipmentComponent,
    TruckdockAcceptanceMonitoringComponent,
    ReturnMailComponent,
    RcarScreeningPointComponent,
    ShipmentToBeScreenedComponent,
    ExportBooklistMailComponent,
    ExportMailManifestComponent,
    AcasQueryComponent,
    EmbargoMailComponent,
    ListscawbComponent,
    // REVAMPINF OF E-ACCEPTANCE
    ManageCargoPreLodgeComponent,
    ManageCargoAcceptanceComponent,
    ManageCargoNawbShipmentComponent,
    ManageCargoTruckingSurfComponent,
    ManageCargoLocalCourierComponent,
    ManageCargoEReadyShipmentComponent,
    ManageCargoAwbInformationComponent,
    ManageCargoTruckingFlightComponent,
    ManageCargoTranshipmentCourierComponent,
    ShipmentVolumetricWeightInfoComponent,
    ExportAwbDocumentComponent,
    AcceptanceWeighingByHouseSummaryComponent,
    AcceptanceMonitoringByHouseComponent,
    // ManageAcceptanceWeighingRevisedComponent,
    // ManageAcceptanceWeighingCargodetailsComponent,
    // ManageAcceptanceWeighingDimensionsComponent,
    // ManageAcceptanceWeighingRemarksComponent,
    // ManageAcceptanceWeighingActionlistComponent,
    MRCLSummaryComponent,
    MaintainmrclpredeclarationComponent,
    RclsummaryComponent, MaintainRCLComponent, LocaltransferComponent
  ]
})
export class AcceptanceModule {

}
