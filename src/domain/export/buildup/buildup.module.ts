import { UpdateDlsComponent } from "./update-dls/update-dls.component";

import { BuildupService } from "./buildup.service";
import { AssignUldFlightComponent } from "./assign-uld-flight/assign-uld-flight.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BuildupComponent } from "./buildup.component";
import { LoadShipmentComponent } from "./load-shipment/load-shipment.component";
import { UnloadShipmentComponent } from "./unload-shipment/unload-shipment.component";
import { WarehouseWeighingUldComponent } from "./warehouse-weighing-uld/warehouse-weighing-uld.component";
import { CargomanifestComponent } from "./cargomanifest/cargomanifest.component";
import {
  NgcDomainModule,
  NgcDirectivesModule,
  NgcControlsModule,
  NgcCoreModule,
  NgcUtility
} from "ngc-framework";
import { ReactiveFormsModule } from "@angular/forms";
import { AirlineLoadingInstructionsComponent } from "./airline-loading-instructions/airline-loading-instructions.component";
import { OffloadUldAwbComponent } from "./offload-uld-awb/offload-uld-awb.component";
import { ReleaseManifestDLSComponent } from "./releaseManifestDLS/releaseManifestDLS.component";
import { AmendUldTrolleyComponent } from "../amend-uld-trolley/amend-uld-trolley.component";
import { OffloadSummaryComponent } from "./offload-summary/offload-summary.component";
import { RampReleaseComponent } from "./ramp-release/ramp-release.component";
import { MailLoadShipmentComponent } from "./mail-load-shipment/mail-load-shipment.component";
import { OffloadHandoverComponent } from "./offload-handover/offload-handover.component";
import { ReturnToWarehouseComponent } from "./return-to-warehouse/return-to-warehouse.component";
import { DisplayDlsVarianceComponent } from "./display-dls-variance/display-dls-variance.component";
import { SpecialShipmentComponent } from "./special-shipment/special-shipment.component";
import { AcceptanceService } from "../acceptance/acceptance.service";
import { UldSummaryComponent } from "./uld-summary/uld-summary.component";
import { UldDetailsComponent } from "./uld-details/uld-details.component";
import { OutwardServiceReportComponent } from "./outward-service-report/outward-service-report.component";
import { OutgoingFlightsComponent } from "./outgoing-flights/outgoing-flights.component";
import { LyingListComponent } from "./lying-list/lying-list.component";
import { FlightCompleteComponent } from "./flight-complete/flight-complete.component";
import { QueryFlightComponent } from "./query-flight/query-flight.component";
import { MyFlightComponent } from "./my-flight/my-flight.component";
import { MailbagOffloadComponent } from "./mailbag-offload/mailbag-offload.component";
import { FlightListComponent } from "./flightList/flightList.component";
import { ExportService } from "../export.service";
import { RevisedLoadShipmentComponent } from "./revised-load-shipment/revised-load-shipment.component";
import { UpdateDlsRevisedComponent } from './update-dls-revised/update-dls-revised.component';
import { UpdateDlsRevisedNewComponent } from "./update-dls-revised-new/update-dls-revised-new.component";
import { SpecialCargoRequestByHandoverComponent } from './special-cargo-request-by-handover/special-cargo-request-by-handover.component';
import { SpecialCargoHandoverComponent } from './special-cargo-handover/special-cargo-handover.component';
import { SpecialCargoFlightDashboardComponent } from './special-cargo-flight-dashboard/special-cargo-flight-dashboard.component';
import { WeightLoadStatementComponent } from './weight-load-statement/weight-load-statement.component';



const routes: Routes = [
  { path: 'loadshipment', component: LoadShipmentComponent },
  { path: 'assign-uld-flight', component: AssignUldFlightComponent },
  { path: 'warehouse-weighing-uld', component: WarehouseWeighingUldComponent },
  { path: 'unloadshipment', component: UnloadShipmentComponent },
  { path: 'airlineloadinginstructions', component: AirlineLoadingInstructionsComponent },
  { path: 'unloadshipment', component: UnloadShipmentComponent },
  { path: 'cargomanifest', component: CargomanifestComponent },
  { path: 'update-dls-revised', component: UpdateDlsComponent },
  { path: 'offloaduld', component: OffloadUldAwbComponent },
  { path: 'amend-uld-trolley', component: AmendUldTrolleyComponent },
  { path: 'releasemanifestdls', component: ReleaseManifestDLSComponent },
  { path: 'offloadsummary', component: OffloadSummaryComponent },
  { path: 'mailloadshipment', component: MailLoadShipmentComponent },
  { path: 'ramprelease', component: RampReleaseComponent },
  { path: 'offloadhandover', component: OffloadHandoverComponent },
  { path: 'returntowarehouse', component: ReturnToWarehouseComponent },
  { path: 'display-dls-variance', component: DisplayDlsVarianceComponent },
  { path: 'specialShipment', component: SpecialShipmentComponent },
  { path: 'uldsummary', component: UldSummaryComponent },
  { path: 'ulddetails', component: UldDetailsComponent },
  { path: 'displayDlsVariance', component: DisplayDlsVarianceComponent },
  { path: 'outwardservicereport', component: OutwardServiceReportComponent },
  { path: 'specialShipment', component: SpecialShipmentComponent },
  { path: 'outgoingFlights', component: OutgoingFlightsComponent },
  { path: 'lyingList', component: LyingListComponent },
  { path: 'flightComplete', component: FlightCompleteComponent },
  { path: "mailbag", component: MailbagOffloadComponent },
  { path: "flightlist", component: FlightListComponent },
  { path: 'myflight', component: MyFlightComponent },
  { path: 'myflight', component: MyFlightComponent },
  { path: 'update-dls', component: UpdateDlsRevisedComponent },
  { path: 'update-dls-new', component: UpdateDlsRevisedNewComponent },
  { path: 'revisedLoadShipment', component: RevisedLoadShipmentComponent }

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
  providers: [BuildupService, AcceptanceService, ExportService],
  declarations: [
    LoadShipmentComponent,
    AssignUldFlightComponent,
    WarehouseWeighingUldComponent,
    UnloadShipmentComponent,
    AirlineLoadingInstructionsComponent,
    CargomanifestComponent,
    UpdateDlsComponent,
    ReleaseManifestDLSComponent,
    OffloadUldAwbComponent,
    DisplayDlsVarianceComponent,
    OffloadSummaryComponent,
    AmendUldTrolleyComponent,
    RampReleaseComponent,
    MailLoadShipmentComponent,
    OffloadHandoverComponent,
    ReturnToWarehouseComponent,
    SpecialShipmentComponent,
    UldSummaryComponent,
    UldDetailsComponent,
    OutgoingFlightsComponent,
    OutwardServiceReportComponent,
    LyingListComponent,
    FlightCompleteComponent,
    QueryFlightComponent,
    MyFlightComponent,
    FlightListComponent,
    MailbagOffloadComponent,
    UpdateDlsRevisedComponent,
    RevisedLoadShipmentComponent,
    UpdateDlsRevisedNewComponent,
    SpecialCargoHandoverComponent,
    SpecialCargoRequestByHandoverComponent,
    SpecialCargoFlightDashboardComponent,
    WeightLoadStatementComponent
  ]


})
export class BuildupModule { }
