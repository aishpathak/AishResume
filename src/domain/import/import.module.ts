import { CustomorderexaminationComponent } from './customorderexamination/customorderexamination.component';
import { EccAgentDeliveryShipmentListComponent } from "./ecc-agent-delivery-shipment-list/ecc-agent-delivery-shipment-list.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaintainfwbComponent } from "./maintainfwb/maintainfwb.component";
import { PrintAwbBarCodeComponent } from "./print-awb-bar-code/print-awb-bar-code.component";
import { ImportService } from "./import.service";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import {
  NgcCoreModule,
  NgcControlsModule,
  NgcDirectivesModule,
  NgcDomainModule
} from "ngc-framework";
import { EccInboundWorksheetComponent } from "./ecc-inbound-worksheet/ecc-inbound-worksheet.component";
import { PreannouncementComponent } from "./preannouncement/preannouncement.component";
import { IncomingFlightComponent } from "./incoming-flight/incoming-flight.component";
import { ArrivalmanifestComponent } from "./arrivalmanifest/arrivalmanifest.component";
import { DocumentverificationComponent } from "./documentverification/documentverification.component";
import { BDWorkListComponent } from "./bd-working-list/worklist.component";
import { InboundRampCheckInComponent } from "./inbound-ramp-check-in/inbound-ramp-check-in.component";
import { SendTelexComponent } from "./inbound-ramp-check-in/send-telex/send-telex.component";
import { UploadPhotoComponent } from "./inbound-ramp-check-in/upload-photo/upload-photo.component";
import { AddUldComponent } from "./inbound-ramp-check-in/add-uld/add-uld.component";
import { DriverIdComponent } from "./inbound-ramp-check-in/driver-id/driver-id.component";
import { FlightDiscrepancyListComponent } from "./flightDiscrepancyList/flightDiscrepancyList.component";
import { ImportManifestComponent } from "./mail/import-manifest/import-manifest.component";
import { CaptureImportDocumentComponent } from "./mail/capture-import-document/capture-import-document.component";
import { TranshipmentModule } from "./transhipment/transhipment.module";
import { IssuepoComponent } from "./issuepo/issuepo.component";
import { DisplayffmComponent } from "./displayffm/displayffm.component";
import { InboundBreakdownComponent } from "./inbound-breakdown/inbound-breakdown.component";
import { UndeliveredshipmentComponent } from "./undeliveredshipment/undeliveredshipment.component";
import { ImportMailBreakdownComponent } from "./mail/import-mail-breakdown/import-mail-breakdown.component";
import { MailBagComponent } from "./mail/mail-bag/mail-bag.component";
// tslint:disable-next-line:max-line-length
import { BreakdownHandlingInformationComponent } from "./breakdown-handling-information/breakdown-handling-information.component";
import { ImportAwbNotification } from "./import-awb-notification/importawbnotification.component";
import { DisplaypickorderComponent } from "./displaypickorder/displaypickorder.component";
import { IssuedoComponent } from "./issuedo/issuedo.component";
import { IssueGroupDOComponent } from "./issueGroupDO/issueGroupDO.component";
import { DocumenthandoverComponent } from "./documenthandover/documenthandover.component";
import { FlightPouchHandlingComponent } from './flightPouchHnadling/flight-pouch-handling.component';
import { ExportflightPouchHnadlingComponent } from './exportflight-pouch-hnadling/exportflight-pouch-hnadling.component';
import { DeliveryComponent } from "./delivery/delivery.component";
import { PomonitoringComponent } from "./pomonitoring/pomonitoring.component";
import { BreakdowntracingComponent } from "./breakdowntracing/breakdowntracing.component";
import { DisplayCpmComponent } from "./display-cpm/display-cpm.component";
import { InwardservicereportComponent } from "./inwardservice-report/inwardservicereport.component";
import { InboundFlightMonitoringComponent } from "./inboundFlightMonitoring/inboundFlightMonitoring.component";
import { AwbReleaseFromComponent } from "./awb-release-from/awb-release-from.component";
import { CreatearrivalmanifestComponent } from "./createarrivalmanifest/createarrivalmanifest.component";
import { ServicereportmailComponent } from "./mail/servicereportmail/servicereportmail.component";
import { AgentIssuedoComponent } from "./agent-issuedo/agent-issuedo.component";
import { BreakdownsummaryComponent } from "./breakdownsummary/breakdownsummary.component";
import { TransfermanifestComponent } from "./transfermanifest/transfermanifest.component";
import { DelaystatusComponent } from "./delaystatus/delaystatus.component";
import { MaintainserviceproviderComponent } from "./maintainserviceprovider/maintainserviceprovider.component";
import { ChangeserviceproviderComponent } from "./changeserviceprovider/changeserviceprovider.component";
import { CreateDamageReportComponent } from "./createDamageReport/createDamageReport.component";
import { ImportAwbnotificationComponent } from "./import-awbnotification/import-awbnotification.component";
import { DangerousgoodsService } from "../export/dangerousgoods/dangerousgoods.service";
import { PsnModule } from '../export/dangerousgoods/psn-dtl/psn.module';
import { WarehouseService } from '../warehouse/warehouse.service'
import { AddAccessoryModule } from '../warehouse/add-accessory/add-accessory.module'
import { BuildupService } from "../export/buildup/buildup.service";
import { UncollectedfreightoutComponent } from "./uncollectedfreightout/uncollectedfreightout.component";
import { ShipmentForCustomInspectionComponent } from './shipment-for-custom-inspection/shipment-for-custom-inspection.component';
import { VctInformationComponent } from "./vct-information/vct-information.component";
import { CargodamagereportlistComponent } from './cargodamagereportlist/cargodamagereportlist.component';
import { ConfirmUldComponent } from './confirm-uld/confirm-uld.component';
import { EcanStatusEnquiryComponent } from './ecan-status-enquiry/ecan-status-enquiry.component';
import { ScheduleCollectionListComponent } from './schedule-collection-list/schedule-collection-list.component';

import { UldshipmentpriorityComponent } from './uldshipmentpriority/uldshipmentpriority.component';
import { UldRhoPriorityMasterComponent } from './uldshipmentpriority/uldRhoPriorityMaster/uldRhoPriorityMaster.component';
import { UldShipmentPriorityGroupEmailComponent } from './uld-shipment-priority-group-email/uld-shipment-priority-group-email.component';
import { UldshipmentpriorityspecialcargohandlingComponent } from './uldshipmentpriorityspecialcargohandling/uldshipmentpriorityspecialcargohandling.component';
import { UldshipmentpriorityspecialhandlingautoselectComponent } from './uldshipmentpriorityspecialhandlingautoselect/uldshipmentpriorityspecialhandlingautoselect.component';
import { CloseUncloseFlightComponent } from './close-unclose-flight/close-unclose-flight.component';
import { ESRFApprovalComponent } from './eSRFApproval/eSRFApproval.component';
import { PostUnpostSrfComponent } from './post-unpost-srf/post-unpost-srf.component';
import { InboundFlightEFormsComponent } from './inbound-flight-eforms/inbound-flight-eforms.component';
import { ArrivalCargoCollectionComponent } from './arrival-cargo-collection/arrival-cargo-collection.component';
import { CreateEorderComponent } from './e-order/create-eorder/create-eorder.component';
import { EorderMonitoringComponent } from './e-order/eorder-monitoring/eorder-monitoring.component';

const routes: Routes = [
  // import Page Component
  { path: "flightdiscrepancylist", component: FlightDiscrepancyListComponent },
  { path: "maintainfwb", component: MaintainfwbComponent },
  { path: "eccworksheet", component: EccInboundWorksheetComponent },
  { path: "maintainfwb", component: MaintainfwbComponent },
  {
    path: "preannouncement/:screenFunction",
    component: PreannouncementComponent
  },
  { path: "printAWBbarcode", component: PrintAwbBarCodeComponent },
  { path: "incoming-flight", component: IncomingFlightComponent },
  {
    path: "ecc-delivery-list",
    component: EccAgentDeliveryShipmentListComponent
  },
  {
    path: "breakdownhandlinginfo",
    component: BreakdownHandlingInformationComponent
  },
  { path: "customsOrderExamination", component: CustomorderexaminationComponent },
  { path: "arrivalmanifest", component: ArrivalmanifestComponent },
  { path: "documentverification", component: DocumentverificationComponent },
  { path: "breakdownworkinglist", component: BDWorkListComponent },
  { path: "inbound-ramp-check-in", component: InboundRampCheckInComponent },
  { path: "inbound-ramp-check-in", component: InboundRampCheckInComponent },
  { path: "importmanifestmail", component: ImportManifestComponent },
  { path: "captureimportdocument", component: CaptureImportDocumentComponent },
  { path: "issuepo", component: IssuepoComponent },
  { path: "importmanifestmail", component: ImportManifestComponent },
  { path: "captureimportdocument", component: CaptureImportDocumentComponent },
  { path: "importmanifestmail", component: ImportManifestComponent },
  { path: "captureimportdocument", component: CaptureImportDocumentComponent },
  { path: "importmailbreakdown", component: ImportMailBreakdownComponent },
  { path: "mailbag", component: MailBagComponent },
  { path: "displaypickorder", component: DisplaypickorderComponent },
  { path: "undeliveredshipment", component: UndeliveredshipmentComponent },
  { path: "importawbnotification", component: ImportAwbNotification },
  { path: "issuedo", component: IssuedoComponent },
  { path: "issueGroupDO", component: IssueGroupDOComponent },
  { path: "documenthandover", component: DocumenthandoverComponent },
  { path: "flightpouchhandling", component: FlightPouchHandlingComponent },
  { path: "exportflightpouchhandling", component: ExportflightPouchHnadlingComponent },
  { path: "displaydo", component: DeliveryComponent },
  { path: "pomonitoring", component: PomonitoringComponent },
  { path: "breakDownTracing", component: BreakdowntracingComponent },
  { path: "displaycpm", component: DisplayCpmComponent },
  { path: "inwardservicereport", component: InwardservicereportComponent },
  {
    path: "inboundFlightMonitoring",
    component: InboundFlightMonitoringComponent
  },
  { path: "awbreleaseform", component: AwbReleaseFromComponent },
  { path: "displayffm", component: DisplayffmComponent },
  { path: "eccworksheet", component: EccInboundWorksheetComponent },
  { path: "maintainfwb", component: MaintainfwbComponent },
  { path: "printAWBbarcode", component: PrintAwbBarCodeComponent },
  { path: "incoming-flight", component: IncomingFlightComponent },
  {
    path: "ecc-delivery-list",
    component: EccAgentDeliveryShipmentListComponent
  },
  {
    path: "breakdownhandlinginfo",
    component: BreakdownHandlingInformationComponent
  },
  { path: "customsOrderExamination", component: CustomorderexaminationComponent },
  { path: "arrivalmanifest", component: ArrivalmanifestComponent },
  { path: "documentverification", component: DocumentverificationComponent },
  { path: "breakdownworkinglist", component: BDWorkListComponent },
  { path: "inbound-ramp-check-in", component: InboundRampCheckInComponent },
  { path: "inbound-ramp-check-in", component: InboundRampCheckInComponent },
  { path: "importmanifestmail", component: ImportManifestComponent },
  { path: "captureimportdocument", component: CaptureImportDocumentComponent },
  { path: "issuepo", component: IssuepoComponent },
  { path: "importmanifestmail", component: ImportManifestComponent },
  { path: "captureimportdocument", component: CaptureImportDocumentComponent },
  { path: "importmanifestmail", component: ImportManifestComponent },
  { path: "captureimportdocument", component: CaptureImportDocumentComponent },
  { path: "importmailbreakdown", component: ImportMailBreakdownComponent },
  { path: "mailbag", component: MailBagComponent },
  { path: "inbound-breakdown", component: InboundBreakdownComponent },
  { path: "displaypickorder", component: DisplaypickorderComponent },
  { path: "undeliveredshipment", component: UndeliveredshipmentComponent },
  { path: "importawbnotification", component: ImportAwbNotification },
  { path: "issuedo", component: IssuedoComponent },
  { path: "displaydo", component: DeliveryComponent },
  { path: "breakDownTracing", component: BreakdowntracingComponent },
  { path: "inwardservicereport", component: InwardservicereportComponent },
  {
    path: "inboundFlightMonitoring",
    component: InboundFlightMonitoringComponent
  },
  { path: "awbreleaseform", component: AwbReleaseFromComponent },
  { path: "maintainfwb", component: MaintainfwbComponent },
  { path: "eccworksheet", component: EccInboundWorksheetComponent },
  { path: "maintainfwb", component: MaintainfwbComponent },
  { path: "printAWBbarcode", component: PrintAwbBarCodeComponent },
  { path: "incoming-flight", component: IncomingFlightComponent },
  {
    path: "ecc-delivery-list",
    component: EccAgentDeliveryShipmentListComponent
  },
  {
    path: "breakdownhandlinginfo",
    component: BreakdownHandlingInformationComponent
  },
  { path: "customsOrderExamination", component: CustomorderexaminationComponent },
  { path: "arrivalmanifest", component: ArrivalmanifestComponent },
  { path: "documentverification", component: DocumentverificationComponent },
  { path: "breakdownworkinglist", component: BDWorkListComponent },
  { path: "inbound-ramp-check-in", component: InboundRampCheckInComponent },
  { path: "inbound-ramp-check-in", component: InboundRampCheckInComponent },
  { path: "importmanifestmail", component: ImportManifestComponent },
  { path: "captureimportdocument", component: CaptureImportDocumentComponent },
  { path: "issuepo", component: IssuepoComponent },
  { path: "importmanifestmail", component: ImportManifestComponent },
  { path: "captureimportdocument", component: CaptureImportDocumentComponent },
  { path: "importmanifestmail", component: ImportManifestComponent },
  { path: "captureimportdocument", component: CaptureImportDocumentComponent },
  { path: "importmailbreakdown", component: ImportMailBreakdownComponent },
  { path: "mailbag", component: MailBagComponent },
  { path: "inbound-breakdown", component: InboundBreakdownComponent },
  { path: "displaypickorder", component: DisplaypickorderComponent },
  { path: "undeliveredshipment", component: UndeliveredshipmentComponent },
  { path: "importawbnotification", component: ImportAwbNotification },
  { path: "issuedo", component: IssuedoComponent },
  { path: "displaydo", component: DeliveryComponent },
  { path: "pomonitoring", component: PomonitoringComponent },
  { path: "breakDownTracing", component: BreakdowntracingComponent },
  { path: "inwardservicereport", component: InwardservicereportComponent },
  {
    path: "inboundFlightMonitoring",
    component: InboundFlightMonitoringComponent
  },
  { path: "awbreleaseform", component: AwbReleaseFromComponent },
  { path: "createarrival", component: CreatearrivalmanifestComponent },
  { path: "servicereportmail", component: ServicereportmailComponent },
  { path: "agentissuedo", component: AgentIssuedoComponent },
  { path: "transfermanifest", component: TransfermanifestComponent },
  { path: "breakdownsummary", component: BreakdownsummaryComponent },
  { path: "delaystatus", component: DelaystatusComponent },
  { path: "eSRFApproval", component: ESRFApprovalComponent },

  {
    path: "maintainserviceprovider",
    component: MaintainserviceproviderComponent
  },
  {
    path: "changeserviceprovider",
    component: ChangeserviceproviderComponent
  },
  {
    path: "transhipment",
    loadChildren:
      "../import/transhipment/transhipment.module#TranshipmentModule"
  },
  { path: "createdamagereport", component: CreateDamageReportComponent },
  {
    path: "import-awbnotification",
    component: ImportAwbnotificationComponent
  },
  {
    path: "uncollectedfreightout",
    component: UncollectedfreightoutComponent
  },
  { path: 'closeUncloseFlight', component: CloseUncloseFlightComponent },
  { path: 'icustomshipment', component: ShipmentForCustomInspectionComponent },
  { path: 'confirmUld', component: ConfirmUldComponent },
  { path: 'ecanStatusEnquiry', component: EcanStatusEnquiryComponent },
  { path: 'cargodamagereportlist', component: CargodamagereportlistComponent },
  { path: 'scheduleCollectionList', component: ScheduleCollectionListComponent },
  { path: 'arrivalCargoCollection', component: ArrivalCargoCollectionComponent },
  {
    path: "vctinformation",
    component: VctInformationComponent
  },
  { path: 'uldshipmentpriority', component: UldshipmentpriorityComponent },
  { path: 'uldRhoPriorityMaster', component: UldshipmentpriorityComponent },
  { path: 'UldShipmentPriorityGroupEmail', component: UldShipmentPriorityGroupEmailComponent },
  { path: 'UldShipmentPrioritySpecialCargoHandling', component: UldshipmentpriorityspecialcargohandlingComponent },
  { path: 'UldShipmentPrioritySpecialHandlingAutoSelect', component: UldshipmentpriorityspecialhandlingautoselectComponent },
  {
    path: 'inboundflighteforms', component: InboundFlightEFormsComponent,
  }
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
    NgcDomainModule,
    TranshipmentModule,
    PsnModule,
    AddAccessoryModule
  ],
  exports: [
    MaintainfwbComponent,
    PreannouncementComponent,
    ArrivalmanifestComponent,
    DocumentverificationComponent,
    BreakdownHandlingInformationComponent,
    FlightDiscrepancyListComponent,
    TranshipmentModule,
    CustomorderexaminationComponent,
    ArrivalCargoCollectionComponent
  ],
  declarations: [
    MaintainfwbComponent,
    EccInboundWorksheetComponent,
    PreannouncementComponent,
    PrintAwbBarCodeComponent,
    IncomingFlightComponent,
    EccAgentDeliveryShipmentListComponent,
    BreakdownHandlingInformationComponent,
    ArrivalmanifestComponent,
    BDWorkListComponent,
    InboundRampCheckInComponent,
    SendTelexComponent,
    UploadPhotoComponent,
    AddUldComponent,
    DriverIdComponent,
    FlightDiscrepancyListComponent,
    ImportManifestComponent,
    CaptureImportDocumentComponent,
    IssuepoComponent,
    DocumentverificationComponent,
    UndeliveredshipmentComponent,
    ImportMailBreakdownComponent,
    MailBagComponent,
    ImportAwbNotification,
    DisplaypickorderComponent,
    IssuedoComponent,
    DeliveryComponent,
    PomonitoringComponent,
    BreakdowntracingComponent,
    DisplayCpmComponent,
    InwardservicereportComponent,
    InboundFlightMonitoringComponent,
    AwbReleaseFromComponent,
    DisplayffmComponent,
    CreatearrivalmanifestComponent,
    ServicereportmailComponent,
    AgentIssuedoComponent,
    TransfermanifestComponent,
    BreakdownsummaryComponent,
    DelaystatusComponent,
    MaintainserviceproviderComponent,
    ChangeserviceproviderComponent,
    CreateDamageReportComponent,
    ImportAwbnotificationComponent,
    UncollectedfreightoutComponent,
    ShipmentForCustomInspectionComponent,
    UncollectedfreightoutComponent,
    CustomorderexaminationComponent,
    IssueGroupDOComponent,
    FlightPouchHandlingComponent,
    ExportflightPouchHnadlingComponent,
    /* VctInformationComponent,*/
    ConfirmUldComponent,
    DocumenthandoverComponent,
    ESRFApprovalComponent,
    IssueGroupDOComponent,
    PostUnpostSrfComponent,
    EcanStatusEnquiryComponent,
    ScheduleCollectionListComponent,
    UldshipmentpriorityComponent,
    UldRhoPriorityMasterComponent,
    CargodamagereportlistComponent,
    UldShipmentPriorityGroupEmailComponent,
    UldshipmentpriorityspecialcargohandlingComponent,
    UldshipmentpriorityspecialhandlingautoselectComponent,
    CloseUncloseFlightComponent,
    ArrivalCargoCollectionComponent,
    CreateEorderComponent,
    EorderMonitoringComponent,
    InboundFlightEFormsComponent 
 ],
  providers: [ImportService, DangerousgoodsService, BuildupService, WarehouseService]
})
export class ImportModule { }
