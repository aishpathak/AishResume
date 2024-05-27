/**
 *  Application Routing Module
 *
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { NgModule, NgZone } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
// Core
import {
  NgcCoreModule, NgcControlsModule, NgcDirectivesModule, NgcRootRoutingModule
} from 'ngc-framework';
import { AdminService } from '../domain/admin/admin.service';
import { AwbManagementService } from '../domain/awbManagement/awbManagement.service';
import { ExportService } from '../domain/export/export.service';
import { BuildupService } from '../domain/export/buildup/buildup.service';
import { BillingService } from '../domain/billing/billing.service';
import { AirlineBillingService } from '../domain/billing/airlineBilling/airlineBilling.service';

/**
 * Application Route
 */
const applicationRoutes: Routes = [

  // Default Routing Module

  {
    path: '',
    loadChildren: '../domain/default/default.module#DefaultRoutingModule'
  },

  // change password

  {
    path: 'auth',
    loadChildren: '../domain/auth/auth.module#AuthRoutingModule'
  },
  // Default Routing Module
  {
    path: 'common',
    loadChildren: '../domain/common/common.module#CommonRoutingModule'
  },
  // Playground Routing Module
  {
    path: 'playground',
    loadChildren:
      '../domain/playground/playground.module#PlaygroundRoutingModule',
  },
  // tcs routing module
  // {
  //   path: 'tcs/bantruck',
  //   loadChildren: '../domain/tcs/bantruck/bantruck.module#BantruckModule'
  // },
  // {
  //   path: 'tcs/vehicle-info',
  //   loadChildren: '../domain/tcs/vehicle-info/vehicle-info.module#VehicleInfoModule'
  // },

  {
    path: 'tcs/vehicle-information',
    loadChildren: '../domain/tcs/vehicle-information/vehicle-information.module#VehicleInformationModule'
  },
  {
    path: 'flight',
    loadChildren: '../domain/flight/flight.module#FlightModule'
  },

  // {
  //   path: 'admin',
  //   loadChildren: '../domain/admin/admin.module#AdminModule'
  // },
  {
    path: 'uld/templog',
    loadChildren: '../domain/uld/temp-log/temp-log.module#TempLogModule'
  },
  {
    path: 'uld',
    loadChildren: '../domain/uld/uld.module#UldModule'
  },
  {
    path: 'uld/globalUldTracking',
    loadChildren: '../domain/uld/globalUldInventory/global-uld-tracking/global-uld-tracking.module#GlobalUldTrackingModule'
  },
  {
    path: 'uld/maintainGlobalUldInventoryList',
    loadChildren: '../domain/uld/globalUldInventory/maintain-global-uld-inventory-list/maintain-global-uld-inventory-list.module#MaintainGlobalUldInventoryListModule'
  },
  {
    path: 'masters',
    loadChildren: '../domain/masters/masters.module#MastersModule'
  },


  // call of export functions ----------------------------------------------------------------------------------------------------------


  {
    path: 'export/bookmultipleshipment',
    loadChildren: '../domain/export/book-multiple-shipment/book-multiple-shipment.module#BookMultipleShipmentModule'
  },
  {
    path: 'export/autokcscreeningtarget',
    loadChildren: '../domain/export/auto-kc-screening-target/auto-kc-screening-target.module#AutoKcScreeningTargetModule'
  },
  {
    path: 'export/autokctargetmonitoring',
    loadChildren: '../domain/export/auto-kc-target-monitoring/auto-kc-target-monitoring.module#AutoKcTargetMonitoringModule'
  },

  {
    path: 'export/booksingleshipment',
    loadChildren: '../domain/export/book-single-shipment/book-single-shipment.module#BookSingleShipmentModule'
  },
  {
    path: 'export/bypassaedacas',
    loadChildren: '../domain/export/bypass-aed-acas/bypass-aed-acas.module#BypassAedAcasModule'
  },
  {
    path: 'export/cancelbookedshipment',
    loadChildren: '../domain/export/cancel-booked-shipment/cancel-booked-shipment.module#CancelBookedShipmentModule'
  },
  {
    path: 'export/carrierfwb',
    loadChildren: '../domain/export/carrier-fwb/carrier-fwb.module#CarrierFWBModule'
  },
  {
    path: 'export/displayfwbfhldiscrepancy',
    loadChildren: '../domain/export/display-fwb-fhl-discrepancy/display-fwb-fhl-discrepancy.module#DisplayFwbFhlDiscrepancyModule'
  },
  {
    path: 'export/displayoutgoingflights',
    loadChildren: '../domain/export/display-outgoing-flights/display-outgoing-flights.module#DisplayOutgoingFlightsModule'
  },
  {
    path: 'export/displayspecialshipment',
    loadChildren: '../domain/export/displayspecialshipment/displayspecialshipment.module#DisplaySpecialShipmentModule'
  }
  , {
    path: 'export/eawbsetup',
    loadChildren: '../domain/export/eawbsetup/eawbsetup.module#EawbsetupModule'
  }, {
    path: 'export/eccexpoutdetailer',
    loadChildren: '../domain/export/ecc-export/detailer/detailer.module#DetailerModule'
  },
  {
    path: 'export/acceptance/exportawbdocument',
    loadChildren: '../domain/export/acceptance/exportAwbDocument/exportAwbDocument.module#ExportAwbDocumentModule'
  },
  {
    path: 'export/planning-list',
    loadChildren: '../domain/export/ecc-export/flight-planning-list/flight-planning-list.module#FlightPlanningListModule'
  }, {
    path: 'export/electronicConsignmentSecurityDeclaration',
    loadChildren: '../domain/export/electronic-consignment-security-declaration/electronic-consignment-security-declaration.module#ElectronicConsignmentSecurityDeclarationModule'
  }, {
    path: 'export/fwbfhldiscrepancy',
    loadChildren: '../domain/export/fwb-fhl-discrepancy/fwb-fhl-discrepancy.module#FwbFhlDiscrepancyModule'
  }, {
    path: 'export/maintainnawb',
    loadChildren: '../domain/export/maintain-nawb/maintain-nawb.module#MaintainNawbModule'
  }, {
    path: 'export/maintainsspd',
    loadChildren: '../domain/export/maintain-sspd/maintain-sspd.module#MaintainSspdModule'
  }, {
    path: 'export/moveuldtrolley',
    loadChildren: '../domain/export/move-uld-trolley/move-uld-trolley.module#MoveUldTrolleyModule'
  }, {
    path: 'export/neutralairwaybill',
    loadChildren: '../domain/export/neutral-airway-bill/neutral-airway-bill.module#NeutralAirwayBillModule'
  }, {
    path: 'export/outboundlyinglist',
    loadChildren: '../domain/export/outbound-lying-list/outbound-lying-list.module#OutboundLyingListModule'
  }, {
    path: 'export/shipmentembargo',
    loadChildren: '../domain/export/shipment-embargo/shipment-embargo.module#ShipmentEmbargoModule'
  }, {
    path: 'export/sidlist',
    loadChildren: '../domain/export/sid-list/sid-list.module#SidListModule'
  }, {
    path: 'export/snapshotworkinglist',
    loadChildren: '../domain/export/snapshotworkinglist/snapshotworkinglist.module#SnapshotworkinglistModule'
  }, {
    path: 'export/awbReservation',
    loadChildren: '../domain/export/stock-management/awb-reservation/awb-reservation.module#AwbReservationModule'
  }, {
    path: 'export/awbstockmanagement',
    loadChildren: '../domain/export/stock-management/awb-stock-management/awb-stock-management.module#AwbStockManagementModule'
  }, {
    path: 'export/awbstockstatus',
    loadChildren: '../domain/export/stock-management/awb-stock-status/awb-stock-status.module#AwbStockStatusModule'
  }, {
    path: 'export/awbstocksummary',
    loadChildren: '../domain/export/stock-management/awb-stock-summary/awb-stock-summary.module#AwbStockSummaryModule'
  }, {
    path: 'export/stockmanagement',
    loadChildren: '../domain/export/stockmanagement/stockmanagement.module#StockManagementModule'
  }, {
    path: 'export/through-transit-working-advice',
    loadChildren: '../domain/export/through-transit-working-advice/through-transit-working-advice.module#ThroughTransitWorkingAdviceModule'
  }, {
    path: 'export/workinglist',
    loadChildren: '../domain/export/workinglist/workinglist.module#WorkinglistModule'
  },
  {
    path: 'export/exportworkinglist',
    loadChildren: '../domain/export/exportworkinglist/exportwokinglist.module#ExportwokinglistModule'
  },
  {
    path: 'export/promotecargo',
    loadChildren: '../domain/export/promotecargo/promotecargo.module#PromotecargoModule'
  },

  {
    path: 'export/eawbmonitoring',
    loadChildren: '../domain/export/e-awbmonitoring/e-awbmonitoring.module#EAWBMonitoringModule'
  },

  {
    path: 'export/eFBL',
    loadChildren: '../domain/export/e-fbl/e-fbl.module#EFBLModule'
  },

  {
    path: 'export/rebuild-cargo-advice',
    loadChildren: '../domain/export/rebuild-cargo-advice/rebuild-cargo-advice.module#RebuildCargoAdviceModule'
  },

  {
    path: 'export/approve-rebuild-cargo-advice',
    loadChildren: '../domain/export/approve-rebuild-cargo-advice/approve-rebuild-cargo-advice.module#ApproveRebuildCargoAdviceModule'
  },

  {
    path: 'export/premanifest',
    loadChildren: '../domain/export/premanifest/premanifest.module#PreManifestModule'
  },

  // call of functions inside acceptance module (export) ------------------------------------------------------------------------------
  {
    path: 'export/acceptance/acceptancemonitoringbyhouse',
    loadChildren: '../domain/export/acceptance/acceptance-monitoring-by-house/acceptance-monitoring-by-house.module#AcceptanceMonitoringByHouseModule'
  },
  {
    path: 'export/acceptance/acceptancesummarybyhouse',
    loadChildren: '../domain/export/acceptance/acceptance-weighing-by-house-summary/acceptance-weighing-by-house-summary.module#AcceptanceWeighingByHouseSummaryModule'
  },
  {
    path: 'export/acceptance/managecargoacceptance',
    loadChildren: '../domain/export/acceptance/manage-cargo-acceptance/manage-cargo-acceptance.module#ManageCargoAcceptanceModule'
  },

  {
    path: 'export/acceptance/managecargoawbinformation',
    loadChildren: '../domain/export/acceptance/manage-cargo-awb-information/manage-cargo-awb-information.module#ManageCargoAwbInformationModule'
  },

  {
    path: 'export/acceptance/managecargoereadyshipment',
    loadChildren: '../domain/export/acceptance/manage-cargo-e-ready-shipment/manage-cargo-e-ready-shipment.module#ManageCargoEReadyShipmentModule'
  },

  {
    path: 'export/acceptance/managecargolocalcourier',
    loadChildren: '../domain/export/acceptance/manage-cargo-local-courier/manage-cargo-local-courier.module#ManageCargoLocalCourierModule'
  },

  {
    path: 'export/acceptance/managecargonawbshipment',
    loadChildren: '../domain/export/acceptance/manage-cargo-nawb-shipment/manage-cargo-nawb-shipment.module#ManageCargoNawbShipmentModule'
  },

  {
    path: 'export/acceptance/managecargoprelodge',
    loadChildren: '../domain/export/acceptance/manage-cargo-pre-lodge/manage-cargo-pre-lodge.module#ManageCargoPreLodgeModule'
  },
  {
    path: 'export/acceptance/managecargotranshipmentcourier',
    loadChildren: '../domain/export/acceptance/manage-cargo-transhipment-courier/manage-cargo-transhipment-courier.module#ManageCargoTranshipmentCourierModule'
  },

  {
    path: 'export/acceptance/managecargotranshipmentcourier',
    loadChildren: '../domain/export/acceptance/manage-cargo-transhipment-courier/manage-cargo-transhipment-courier.module#ManageCargoTranshipmentCourierModule'
  },

  {
    path: 'export/acceptance/managecargotruckingflight',
    loadChildren: '../domain/export/acceptance/manage-cargo-trucking-flight/manage-cargo-trucking-flight.module#ManageCargoTruckingFlightModule'
  },

  {
    path: 'export/acceptance/managecargotruckingsurf',
    loadChildren: '../domain/export/acceptance/manage-cargo-trucking-surf/manage-cargo-trucking-surf.module#ManageCargoTruckingSurfModule'
  },

  {
    path: 'export/acceptance/rcarscreeningpoint',
    loadChildren: '../domain/export/acceptance/rcar-screening-point/rcar-screening-point.module#RcarScreeningPointModule'
  },

  {
    path: 'export/acceptance/rejectshipment',
    loadChildren: '../domain/export/acceptance/reject-shipment/reject-shipment.module#RejectShipmentModule'
  },

  {
    path: 'export/acceptance/returnmail',
    loadChildren: '../domain/export/acceptance/return-mail/return-mail.module#ReturnMailModule'
  },

  {
    path: 'export/acceptance/returnshipment',
    loadChildren: '../domain/export/acceptance/return-shipment/return-shipment.module#ReturnShipmentModule'
  },
  {
    path: 'export/acceptance/truckdockacceptancemonitoring',
    loadChildren: '../domain/export/acceptance/truckdock-acceptance-monitoring/truckdock-acceptance-monitoring.module#TruckdockAcceptanceMonitoringModule'
  },
  {
    path: 'export/acceptance/shipmenttobescreened',
    loadChildren: '../domain/export/acceptance/shipment-to-be-screened/shipment-to-be-screened.module#ShipmentToBeScreenedModule'
  },
  {
    path: 'export/acceptance/shipmentvolumetricweightinfo',
    loadChildren: '../domain/export/acceptance/shipment-volumetric-weight-info/shipment-volumetric-weight-info.module#ShipmentVolumetricWeightInfoModule'
  },
  {
    path: 'export/acceptance/acasquery',
    loadChildren: '../domain/export/acceptance/acas-query/acas-query.module#AcasQueryModule'
  },

  {
    path: 'export/acceptance/acceptancehandlingdefinition',
    loadChildren: '../domain/export/acceptance/acceptance-handling-definition/acceptance-handling-definition.module#AcceptanceHandlingDefinitionModule'
  },

  {
    path: 'export/acceptance/acceptanceweighingcargodetails',
    loadChildren: '../domain/export/acceptance/acceptance-weighing-cargo-details/acceptance-weighing-cargo-details.module#AcceptanceWeighingCargoDetailsModule'
  },
  {
    path: 'export/acceptance/acceptence-weighing-bup',
    loadChildren: '../domain/export/acceptance/acceptence-weighing-bup/acceptence-weighing-bup.module#AcceptenceWeighingBupModule'
  },
  {
    path: 'export/acceptance/autoweighcaptureduldlist',
    loadChildren: '../domain/export/acceptance/autoweigh-captured-uld-list/autoweigh-captured-uld-list.module#AutoweighCapturedUldListModule'
  },
  {
    path: 'export/acceptance/awbinformation',
    loadChildren: '../domain/export/acceptance/awb-information/awb-information.module#AwbInformationModule'
  },
  {
    path: 'export/acceptance/cargodocumentacceptance',
    loadChildren: '../domain/export/acceptance/cargo-document-acceptance/cargo-document-acceptance.module#CargoDocumentAcceptanceModule'
  },
  {
    path: 'export/acceptance/embargoMail',
    loadChildren: '../domain/export/acceptance/embargoMail/embargoMail.module#EmbargoMailModule'
  },
  {
    path: 'export/acceptance/exportbooklistmail',
    loadChildren: '../domain/export/acceptance/export-booklist-mail/export-booklist-mail.module#ExportBooklistMailModule'
  },
  {
    path: 'export/acceptance/exportmailmanifest',
    loadChildren: '../domain/export/acceptance/export-mail-manifest/export-mail-manifest.module#ExportMailManifestModule'
  },
  {
    path: 'export/acceptance/scawblist',
    loadChildren: '../domain/export/acceptance/listscawb/listscawb.module#ListscawbModule'
  },
  {
    path: 'export/acceptance/mailExportAcceptance',
    loadChildren: '../domain/export/acceptance/mail-export-acceptance/mail-export-acceptance.module#MailExportAcceptanceModule'
  },
  {
    path: 'export/acceptance/manageacceptanceweighing',
    loadChildren: '../domain/export/acceptance/manage-acceptance-weighing/manage-acceptance-weighing.module#ManageAcceptanceWeighingModule'
  },
  {
    path: 'export/acceptance/manageacceptanceweighingrevised',
    loadChildren: '../domain/export/acceptance/manage-acceptance-weighing-revised/manage-acceptance-weighing-revised.module#ManageAcceptanceWeighingRevisedModule'
  },
  {
    path: 'export/buildup/loadshipment',
    loadChildren: '../domain/export/buildup/load-shipment/load-shipment.module#LoadShipmentModule'
  },
  {
    path: 'export/buildup/assign-uld-flight',
    loadChildren: '../domain/export/buildup/assign-uld-flight/assign-uld-flight.module#AssignUldFlightModule'
  },
  {
    path: 'export/buildup/warehouse-weighing-uld',
    loadChildren: '../domain/export/buildup/warehouse-weighing-uld/warehouse-weighing-uld.module#WarehouseWeighingUldModule'
  },
  {
    path: 'export/buildup/unloadshipmentDesktop',
    loadChildren: '../domain/export/buildup/unload-shipment/unload-shipment.module#UnloadShipmentModule'
  },
  {
    path: 'export/buildup/airlineloadinginstructions',
    loadChildren: '../domain/export/buildup/airline-loading-instructions/airline-loading-instructions.module#AirlineLoadingInstructionsModule'
  },
  {
    path: 'export/buildup/cargomanifest',
    loadChildren: '../domain/export/buildup/cargomanifest/cargomanifest.module#CargomanifestModule'
  },
  {
    path: 'export/buildup/update-dls-revised',
    loadChildren: '../domain/export/buildup/update-dls/update-dls.module#UpdateDlsModule'
  },
  {
    path: 'export/buildup/update-dls',
    loadChildren: '../domain/export/buildup/update-dls-revised/update-dls-revised.module#UpdateDlsRevisedModule'
  },
  {
    path: 'export/buildup/update-dls-plus',
    loadChildren: '../domain/export/buildup/update-dls-revised-new/update-dls-revised-new.module#UpdateDlsRevisedNewModule'
  },
  {
    path: 'export/buildup/offloaduld',
    loadChildren: '../domain/export/buildup/offload-uld-awb/offload-uld-awb.module#OffloadUldAwbModule'
  },
  {
    path: 'export/buildup/amend-uld-trolley',
    loadChildren: '../domain/export/amend-uld-trolley/amend-uld-trolley.module#AmendUldTrolleyModule'
  },
  {
    path: 'export/buildup/releasemanifestdls',
    loadChildren: '../domain/export/buildup/releaseManifestDLS/releaseManifestDLS.module#ReleaseManifestDLSModule'
  },
  {
    path: 'export/buildup/offloadsummary',
    loadChildren: '../domain/export/buildup/offload-summary/offload-summary.module#OffloadSummaryModule'
  },
  {
    path: 'export/buildup/mailloadshipment',
    loadChildren: '../domain/export/buildup/mail-load-shipment/mail-load-shipment.module#MailLoadShipmentModule'
  },
  {
    path: 'export/buildup/ramprelease',
    loadChildren: '../domain/export/buildup/ramp-release/ramp-release.module#RampReleaseModule'
  },
  {
    path: 'export/buildup/offloadhandover',
    loadChildren: '../domain/export/buildup/offload-handover/offload-handover.module#OffloadHandovertModule'
  },
  {
    path: 'export/buildup/returntowarehouse',
    loadChildren: '../domain/export/buildup/return-to-warehouse/return-to-warehouse.module#ReturnToWarehouseModule'
  },
  {
    path: 'export/buildup/display-dls-variance',
    loadChildren: '../domain/export/buildup/display-dls-variance/display-dls-variance.module#DisplayDlsVarianceModule'
  },
  {
    path: 'export/buildup/specialShipment',
    loadChildren: '../domain/export/buildup/special-shipment/special-shipment.module#SpecialShipmentModule'
  },
  {
    path: 'export/buildup/uldsummary',
    loadChildren: '../domain/export/buildup/uld-summary/uld-summary.module#UldSummaryModule'
  },
  {
    path: 'export/buildup/ulddetails',
    loadChildren: '../domain/export/buildup/uld-details/uld-details.module#UldDetailsModule'
  },
  {
    path: 'export/buildup/displayDlsVariance',
    loadChildren: '../domain/export/buildup/display-dls-variance/display-dls-variance.module#DisplayDlsVarianceModule'
  },
  {
    path: 'export/buildup/outwardservicereport',
    loadChildren: '../domain/export/buildup/outward-service-report/outward-service-report.module#OutwardServiceReportModule'
  },
  {
    path: 'export/buildup/specialShipment',
    loadChildren: '../domain/export/buildup/special-shipment/special-shipment.module#SpecialShipmentModule'
  },
  {
    path: 'export/buildup/outgoingFlights',
    loadChildren: '../domain/export/buildup/outgoing-flights/outgoing-flights.module#OutgoingFlightsModule'
  },
  {
    path: 'export/buildup/lyingList',
    loadChildren: '../domain/export/buildup/lying-list/lying-list.module#LyingListModule'
  },
  {
    path: 'export/buildup/flightComplete',
    loadChildren: '../domain/export/buildup/flight-complete/flight-complete.module#FlightCompleteModule'
  },
  {
    path: "export/buildup/mailbag",
    loadChildren: '../domain/export/buildup/mailbag-offload/mailbag-offload.module#MailbagOffloadModule'
  },
  {
    path: "export/buildup/flightlist",
    loadChildren: '../domain/export/buildup/flightList/flightList.module#FlightListModule'
  },
  {
    path: 'export/buildup/myflight',
    loadChildren: '../domain/export/buildup/my-flight/my-flight.module#MyFlightModule'
  },

  {
    path: 'export/checklist',
    loadChildren: '../domain/export/check-list/check-list.module#CheckListModule'
  },

  {
    path: 'export/expfbl',
    loadChildren: '../domain/export/exp-fbl/exp-fbl.module#ExpFBLModule'
  },
  // Build Up routing




  //{ path: 'export/buildup', loadChildren: '../domain/export/buildup/buildup.module#BuildupModule' },

  {
    path: 'export/dangerousgoods',
    loadChildren: '../domain/export/dangerousgoods/dangerousgoods.module#DangerousgoodsModule'
  },
  { path: 'export/cdh', loadChildren: '../domain/export/documenthandling/documenthandling.module#DocumenthandlingModule' },

  { path: 'export/transhipment', loadChildren: '../domain/export/transhipment/transhipment.module#TranshipmentModule' },
  { path: 'export/notoc', loadChildren: '../domain/export/notoc/notoc.module#NotocModule' },
  {
    path: 'export/buildup/revisedloadshipment',
    loadChildren: '../domain/export/buildup/revised-load-shipment/revised-load-shipment.module#RevisedLoadShipmentModule'
  },
  {
    path: 'export/buildup/specialcargomonitoringlist',
    loadChildren: '../domain/export/buildup/special-cargo-monitoring-list/special-cargo-monitoring-list.module#SpecialCargoMonitoringListModule'
  },
  {
    path: 'export/',
    loadChildren: '../domain/export/export.module#ExportModule'
  },
  {
    path: 'export/buildup/specialCargoHandover',
    loadChildren: '../domain/export/buildup/special-cargo-handover/special-cargo-handover.module#SpecialCargoHandoverModule'
  },
  {
    path: 'export/buildup/specialcargorequestbyhandover',
    loadChildren: '../domain/export/buildup/special-cargo-request-by-handover/special-cargo-request-by-handover.module#SpecialCargoRequestByHandoverModule'
  },

  //dashboard
  {
    path: 'export/buildup/specialcargoflightdashboard',
    loadChildren: '../domain/export/buildup/special-cargo-flight-dashboard/special-cargo-flight-dashboard.module#SpecialCargoFlightDashboardModule'
  },




  //------------------------------------------------------------------------------------------------------

  {
    path: 'valmgmt',
    loadChildren: '../domain/valManagement/valManagement.module#ValManagementModule'
  },
  {
    path: 'tracing',
    loadChildren: '../domain/tracing/tracing.module#TracingModule'
  },
  { path: 'awbmgmt/awbdocument', loadChildren: '../domain/awbManagement/awb-management/awb-management.module#AwbManagementRouteModule' },
  { path: 'awbmgmt/capturedamage', loadChildren: '../domain/awbManagement/capture-damage/capture-damage.module#CaptureDamageModule' },
  { path: 'awbmgmt/changeawb', loadChildren: '../domain/awbManagement/change-awb-hawb/change-awb-hawb.module#ChangeAwbHawbModule' },
  { path: 'awbmgmt/coolportshipmentmonitoring', loadChildren: '../domain/awbManagement/coolport-shipment-monitoring/coolport-shipment-monitoring.module#CoolportShipmentMonitoringModule' },
  { path: 'awbmgmt/createcn46', loadChildren: '../domain/awbManagement/create-cn46/create-cn46.module#CreateCn46Module' },
  { path: 'awbmgmt/hwb-informationCR', loadChildren: '../domain/awbManagement/hwb-informationCR/hwb-information.moduleCR#HwbInformationModule' },
  { path: 'awbmgmt/inactivecargolist', loadChildren: '../domain/awbManagement/inactive-or-old-cargo/inactive-or-old-cargo.module#InactiveOrOldCargoModule' },
  { path: 'awbmgmt/mailbagcorrection', loadChildren: '../domain/awbManagement/mailbag-overview-correction/mailbag-overview-correction.module#MailbagOverviewCorrectionModule' },
  { path: 'awbmgmt/mailbagoverview', loadChildren: '../domain/awbManagement/mailbag-overview-details/mailbag-overview-details.module#MailbagOverviewDetailsModule' },
  { path: 'awbmgmt/maintainhouse', loadChildren: '../domain/awbManagement/maintain-house/maintain-house.module#MaintainHouseRouteModule' },
  { path: 'awbmgmt/maintainhousewaybilladdnew', loadChildren: '../domain/awbManagement/maintain-house-way-bill-add-new/maintain-house-way-bill-new.module#MaintainHouseWayBillAddNewModule' },
  { path: 'awbmgmt/maintainhousewaybilladdedit', loadChildren: '../domain/awbManagement/maintain-house-way-bill-edit/maintain-house-way-bill-edit.module#MaintainHouseWayBillEditModule' },
  { path: 'awbmgmt/maintainremarks', loadChildren: '../domain/awbManagement/maintain-remark/maintain-remark.module#MaintainRemarkRouteModule' },
  { path: 'awbmgmt/irregularity', loadChildren: '../domain/awbManagement/maintain-shipment-irregularity/maintain-shipment-irregularity.module#MaintainShipmentIrregularityRouteModule' },
  { path: 'awbmgmt/markShipmentForReuse', loadChildren: '../domain/awbManagement/mark-shipment-for-reuse/mark-shipment-for-reuse.module#MarkShipmentForReuseModule' },
  { path: 'awbmgmt/mergeshipmentLocation', loadChildren: '../domain/awbManagement/mergeShipmentLocation/mergeShipmentLocation.module#MergeShipmentLocationModule' },
  { path: 'awbmgmt/reviveshipment', loadChildren: '../domain/awbManagement/reviveshipment/reviveshipment.module#ReviveshipmentModule' },
  { path: 'awbmgmt/shipmenthandover', loadChildren: '../domain/awbManagement/shipment-handover-terminal/shipment-handover.module#ShipmentHandoverModule' },
  { path: 'awbmgmt/shipmentinfo', loadChildren: '../domain/awbManagement/shipment-information/shipment-information.module#ShipmentInformationModule' },
  { path: 'awbmgmt/shipmentinfoCR', loadChildren: '../domain/awbManagement/shipment-informationCR/shipment-informationCR.module#ShipmentInformationModuleCR' },
  { path: 'awbmgmt/shipmentLocation', loadChildren: '../domain/awbManagement/shipmentLocation/shipmentLocation.module#ShipmentLocationRouteModule' },
  { path: 'awbmgmt/shipmentonhold', loadChildren: '../domain/awbManagement/shipmentOnHold/shipmentOnHold.module#ShipmentOnHoldRouteModule' },
  { path: 'awbmgmt/splitshipmentLocation', loadChildren: '../domain/awbManagement/splitShipmentLocation/splitShipmentLocation.module#SplitShipmentLocationModule' },
  { path: 'awbmgmt/temperaturelogentry', loadChildren: '../domain/awbManagement/temperature-log-entry/temperature-log-entry.module#TemperatureLogEntryModule' },
  { path: 'awbmgmt/fwb-log', loadChildren: '../domain/awbManagement/fwb-log/fwb-log.module#FwbLogModule' },
  { path: 'awbmgmt/uldtemperaturelogentry', loadChildren: '../domain/awbManagement/uldtemperaturelogentry/uldtemperaturelogentry.module#UldtemperaturelogentryModule' },
  { path: 'awbmgmt/fhllog', loadChildren: '../domain/awbManagement/fhl-log/fhl-log.module#FhlLogModule' },
  // hawb list
  {
    path: 'awbmgmt/deleteHouse',
    loadChildren: '../domain/awbManagement/delete-house-way-bill/delete-house-way-bill.module#DeleteHouseWayBillModule'
  },
  {
    path: 'awbmgmt/housewaybilllist',
    loadChildren: '../domain/awbManagement/maintain-house-way-bill-list/maintain-house-way-bill-list.module#MaintainHouseWayBillListRouteModule'
  },

  {
    path: 'awbmgmt/maintainhousemaster',
    loadChildren: '../domain/awbManagement/maintain-house-master/maintain-house-master.module#MaintainHouseMasterRouteModule'
  },

  { path: 'awbmgmt/display-hold-notify-shipments', loadChildren: '../domain/awbManagement/display-hold-notify-shipments/display-hold-notify-shipments.module#DisplayHoldNotifyShipmentsModule' },
  {
    path: 'awbmgmt/fwbEyeBallCheck',
    loadChildren: '../domain/awbManagement/fwb-datavalidation/fwb-datavalidation.module#FwbDataValidationModule'
  },
  {
    path: 'awbmgmt',
    loadChildren: '../domain/awbManagement/awbManagement.module#AwbManagementModule'
  },
  {
    path: 'equipment',
    loadChildren: '../domain/equipment/equipment.module#EquipmentModule'
  },

  {
    path: 'billing',
    loadChildren: '../domain/billing/billing.module#BillingModule'
  },
  {
    path: 'dashboard',
    loadChildren: '../domain/dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'billing/billingReports',
    loadChildren: '../domain/billing/billingReports/billingReports.module#BillingReportsModule'
  },
  {
    path: 'billing/collectPayment',
    loadChildren: '../domain/billing/collectPayment/collectPayment.module#CollectPaymentModule'
  },
  {
    path: 'billing/billingSetup',
    loadChildren: '../domain/billing/billingSetup/billingSetup.module#BillingSetupModule'
  },
  {
    path: 'billing/airlineBilling',
    loadChildren: '../domain/billing/airlineBilling/airlineBilling.module#AirlineBillingModule'
  },
  // Tracing
  {
    path: 'tracing',
    loadChildren: '../domain/tracing/tracing.module#TracingModule'
  },
  // outhouse
  { path: 'outhouse', loadChildren: '../domain/outhouse/outhouse.module#OuthouseModule' },



  {
    path: 'cargoIQ',
    loadChildren: '../domain/CargoIQ/cargoIQ.module#CargoIQModule'
  },


  { path: 'support', loadChildren: '../domain/support/support.module#SupportModule' },

  {
    path: 'tcs/adhoc-dock-update',
    loadChildren: '../domain/tcs/adhoc-dock-update/adhoc-dock-update.module#AdhocDockUpdateModule'
  },

  { path: 'tcs', loadChildren: '../domain/tcs/tcs.module#TcsModule' },

  //{ path: 'export/acceptance', loadChildren: '../domain/export/acceptance/acceptance.module#AcceptanceModule' },


  {
    path: 'warehouse/addAccessory',
    loadChildren: '../domain/warehouse/add-accessory/add-accessory.module#AddAccessoryRouteModule'
  },
  {

    path: 'export/buplist',

    loadChildren: '../domain/export/buplist/buplist.module#BuplistModule'

  },
  {
    path: 'warehouse/printAccessory',
    loadChildren: '../domain/warehouse/print-accessory-usage/print-accessory-usage.module#PrintAccessoryModule'
  },

  {
    path: 'warehouse',
    loadChildren: '../domain/warehouse/warehouse.module#WarehouseModule'
  },

  {
    path: 'warehouse/cargoprocessingengine',
    loadChildren: '../domain/warehouse/cargoprocessingengine/cargoprocessingengine.module#CargoProcessingEngineModule'
  },
  { path: 'import/transhipment', loadChildren: '../domain/import/transhipment/transhipment.module#TranshipmentModule' },
  { path: 'import/maintainfwb', loadChildren: '../domain/import/maintainfwb/maintainfwb.module#MaintainfwbRouteModule' },
  { path: 'import/maintainserviceprovider', loadChildren: '../domain/import/maintainserviceprovider/maintainserviceprovider.module#MaintainServiceProviderModule' },
  { path: 'import/maintaincdif', loadChildren: '../domain/import/cdif/cdif.module#CDIFModule' },


  { path: 'import/pomonitoring', loadChildren: '../domain/import/pomonitoring/pomonitoring.module#POMonitoringModule' },
  { path: 'import/issuedo', loadChildren: '../domain/import/issuedo/issuedo.module#IssueDOModule' },
  { path: 'import/issueGroupDO', loadChildren: '../domain/import/issueGroupDO/issueGroupDO.module#IssueGroupDOModule' },
  { path: 'import/documenthandover', loadChildren: '../domain/import/documenthandover/documenthandover.module#DocumentHandOverModule' },

  { path: 'import/flightpouchhandle', loadChildren: '../domain/import/flightPouchHnadling/flight-pouch-handling.module#FlightPouchHandlingModule' },

  { path: 'import/exportflightpouchhandle', loadChildren: '../domain/import/exportflight-pouch-hnadling/exportflight-pouch-hnadling.module#ExportflightPouchHnadlingModule' },

  { path: 'import/issuepo', loadChildren: '../domain/import/issuepo/issuepo.module#IssuePOModule' },
  { path: 'import/displaydo', loadChildren: '../domain/import/delivery/delivery.module#DeliveryModule' },
  { path: 'import/customsOrderExamination', loadChildren: '../domain/import/customorderexamination/customorderexamination.module#CustomorderexaminationModule' },
  { path: 'import/displaypickorder', loadChildren: '../domain/import/displaypickorder/displaypickorder.module#DisplaypickorderModule' },
  { path: 'import/flightdiscrepancylist', loadChildren: '../domain/import/flightDiscrepancyList/flightDiscrepancyList.module#FlightDiscrepancyListModule' },
  { path: 'import/eccworksheet', loadChildren: '../domain/import/ecc-inbound-worksheet/ecc-inbound-worksheet.module#EccInboundWorksheetModule' },
  { path: 'import/preannouncement/:screenFunction', loadChildren: '../domain/import/preannouncement/preannouncement.module#PreannouncementModule' },
  { path: 'import/awbreleaseform', loadChildren: '../domain/import/awb-release-from/awb-release-from.module#AwbReleaseFromModule' },
  { path: 'import/breakdownsummary', loadChildren: '../domain/import/breakdownsummary/breakdownsummary.module#BreakdownsummaryModule' },
  { path: 'import/breakdownworkinglist', loadChildren: '../domain/import/bd-working-list/worklist.module#BDWorkListModule' },
  { path: 'import/breakdownhandlinginfo', loadChildren: '../domain/import/breakdown-handling-information/breakdown-handling-information.module#BreakdownHandlingInformationModule' },
  { path: 'import/breakDownTracing', loadChildren: '../domain/import/breakdowntracing/breakdowntracing.module#BreakdowntracingModule' },
  { path: 'import/changeserviceprovider', loadChildren: '../domain/import/changeserviceprovider/changeserviceprovider.module#ChangeserviceproviderModule' },
  { path: 'import/createdamagereport', loadChildren: '../domain/import/createDamageReport/createDamageReport.module#CreateDamageReportModule' },
  { path: 'import/delaystatus', loadChildren: '../domain/import/delaystatus/deleystatus.module#DelaystatusModule' },
  { path: 'import/displayffm', loadChildren: '../domain/import/displayffm/displayffm.module#DisplayffmModule' },
  { path: 'import/displaycpm', loadChildren: '../domain/import/display-cpm/display-cpm.module#DisplayCpmModule' },
  { path: 'import/documentverification', loadChildren: '../domain/import/documentverification/documentverification.module#DocumentverificationModule' },
  { path: 'import/ecc-delivery-list', loadChildren: '../domain/import/ecc-agent-delivery-shipment-list/ecc-agent-delivery-shipment-list.module#EccAgentDeliveryShipmentListModule' },
  { path: 'import/import-awbnotification', loadChildren: '../domain/import/import-awbnotification/import-awbnotification.module#ImportAwbnotificationModule' },
  { path: 'import/inbound-breakdown', loadChildren: '../domain/import/inbound-breakdown/inbound-breakdown.module#InboundBreakdownModule' },
  { path: 'import/inboundFlightMonitoring', loadChildren: '../domain/import/inboundFlightMonitoring/inboundFlightMonitoring.module#InboundFlightMonitoringModule' },
  { path: 'import/incoming-flight', loadChildren: '../domain/import/incoming-flight/incoming-flight.module#IncomingFlightModule' },
  { path: 'import/inwardservicereport', loadChildren: '../domain/import/inwardservice-report/inwardservicereport.module#InwardservicereportModule' },
  { path: 'import/uncollectedfreightout', loadChildren: '../domain/import/uncollectedfreightout/uncollectedfreightout.module#UncollectedfreightoutModule' },
  { path: 'import/undeliveredshipment', loadChildren: '../domain/import/undeliveredshipment/undeliveredshipment.module#UndeliveredshipmentModule' },
  { path: 'import/printAWBbarcode', loadChildren: '../domain/import/print-awb-bar-code/print-awb-bar-code.module#PrintAwbBarCodeModule' },
  { path: 'import/transfermanifest', loadChildren: '../domain/import/transfermanifest/transfermanifest.module#TransfermanifestModule' },
  { path: 'import/agentissuedo', loadChildren: '../domain/import/agent-issuedo/agent-issuedo.module#AgentIssuedoModule' },
  { path: 'import/createarrival', loadChildren: '../domain/import/createarrivalmanifest/createarrivalmanifest.module#CreatearrivalmanifestModule' },
  { path: 'import/arrivalmanifest', loadChildren: '../domain/import/arrivalmanifest/arrivalmanifest.module#ArrivalmanifestModule' },
  { path: 'import/createmanifest', loadChildren: '../domain/import/createmanifest/createmanifest.module#CreatemanifestModule' },
  { path: 'import/inbound-ramp-check-in', loadChildren: '../domain/import/inbound-ramp-check-in/inbound-ramp-check-in.module#InboundRampCheckInModule' },
  { path: 'import/captureimportdocument', loadChildren: '../domain/import/mail/capture-import-document/capture-import-document.module#CaptureImportDocumentModule' },
  { path: 'import/importmailbreakdown', loadChildren: '../domain/import/mail/import-mail-breakdown/import-mail-breakdown.module#ImportMailBreakdownModule' },
  { path: 'import/importmanifestmail', loadChildren: '../domain/import/mail/import-manifest/import-manifest.module#ImportManifestModule' },
  { path: 'import/mailbag', loadChildren: '../domain/import/mail/mail-bag/mail-bag.module#MailBagModule' },
  { path: 'import/servicereportmail', loadChildren: '../domain/import/mail/servicereportmail/servicereportmail.module#ServicereportmailModule' },
  { path: 'import/customshipment', loadChildren: '../domain/import/shipment-for-custom-inspection/shipment-for-custom-inspection.module#ShipmentForCustomInspectionModule' },
  { path: 'import/confirmUld', loadChildren: '../domain/import/confirm-uld/confirm-uld.module#ConfirmUldModule' },
  { path: 'uld/maintainEic', loadChildren: '../domain/uld/maintain-eic/maintain-eic.module#maintaineic' },
  { path: 'import/', loadChildren: '../domain/import/import.module#ImportModule' },
  { path: 'import/closeUncloseFlight', loadChildren: '../domain/import/close-unclose-flight/close-unclose-flight.module#CloseUncloseFlightModule' },
  { path: 'import/enquire-customs-imp-shp-manual-req', loadChildren: '../domain/import/enquire-customs-imp-shp-manual-req/enquire-customs-imp-shp-manual-req.module#EnquireCustomsImpShpManualReqModule' },
  { path: 'import/manual-weight-verification-request', loadChildren: '../domain/import/manual-weight-verification-request/manual-weight-verification-request.module#ManualWeightVerificationRequestModule' },
  { path: 'import/customs-imp-shp-manual-reqest', loadChildren: '../domain/import/customs-imp-shp-manual-request/customs-imp-shp-manual-request.module#CustomsImpShpManualRequestModule' },
  { path: 'import/vctinformation', loadChildren: '../domain/import/vct-information/vct-information.module#VctInformationModule' },
  { path: 'import/FlightDiscrepancy', loadChildren: '../domain/import/flight-discrepancy/flight-discrepancy.module#FlightDiscrepancyModule' },
  { path: 'import/CargoDamageReportList', loadChildren: '../domain/import/cargodamagereportlist/cargodamagereportlist.module#CargoDamageReportListModule' },
  { path: 'import/IssueSRF', loadChildren: '../domain/import/issuesrf/issuesrf.module#IssueSRFModule' },
  { path: 'import/PostUnpostSRF', loadChildren: '../domain/import/post-unpost-srf/post-unpost-srf.module#PostUnpostSRFModel' },
  { path: 'import/uldshipmentpriority', loadChildren: '../domain/import/uldshipmentpriority/uldshipmentpriority.module#UldshipmentpriorityModule' },
  { path: 'import/uldRhoPriorityMaster', loadChildren: '../domain/import/uldshipmentpriority/uldRhoPriorityMaster/uldRhoPriorityMaster.module#UldRhoPriorityMasterModule' },
  { path: 'import/UldShipmentPriorityGroupEmail', loadChildren: '../domain/import/uld-shipment-priority-group-email/uld-shipment-priority-group-email.module#UldShipmentPriorityGroupEmailModule' },
  { path: 'import/UldShipmentPrioritySpecialCargoHandling', loadChildren: '../domain/import/uldshipmentpriorityspecialcargohandling/uldshipmentpriorityspecialcargohandling.module#UldShipmentPrioritySpecialCargoHandlingModule' },
  { path: 'import/UldShipmentPrioritySpecialHandlingAutoSelect', loadChildren: '../domain/import/uldshipmentpriorityspecialhandlingautoselect/uldshipmentpriorityspecialhandlingautoselect.module#UldShipmentPrioritySpecialHandlingAutoSelectModule' },
  { path: 'import/maintainScheduleCollectionMaster', loadChildren: '../domain/import/maintain-schedule-collection-master/maintain-schedule-collection-master.module#MaintainScheduleCollectionMasterModule' },
  { path: 'import/captureTimeStamp', loadChildren: '../domain/import/capture-time-stamp/capture-time-stamp.module#CaptureTimeStampModule' },
  { path: 'import/ecanStatusEnquiry', loadChildren: '../domain/import/ecan-status-enquiry/ecan-status-enquiry.module#EcanStatusEnquiryModule' },
  { path: 'import/eSRFApproval', loadChildren: '../domain/import/eSRFApproval/eSRFApproval.module#ESRFApprovalModule' },
  { path: 'import/SRFMonitoring', loadChildren: '../domain/import/SRFMonitoring/SRFMonitoring.module#SRFMonitoringModule' },
  { path: 'import/scheduleCollectionList', loadChildren: '../domain/import/schedule-collection-list/schedule-collection-list.module#ScheduleCollectionListModule' },
  { path: 'import/inboundflighteforms', loadChildren: '../domain/import/inbound-flight-eforms/inbound-flight-eforms.module#InboundFlightEFormsModule' },
  { path: 'import/arrivalCargoCollection', loadChildren: '../domain/import/arrival-cargo-collection/arrival-cargo-collection.module#ArrivalCargoCollectionModule' },

  // Unknown
  {
    path: 'customs',
    loadChildren: '../domain/customs/customs.module#CustomACESModule'
  },

  {
    path: 'customs/maintainConstraintCode',
    loadChildren: '../domain/customs/maintain-constraint-code/maintain-constraint-code.module#MaintainConstraintCodeModule'
  },

  {
    path: 'customs/printConstraintCodeReport',
    loadChildren: '../domain/customs/print-constraint-code-report/print-constraint-code-report.module#PrintConstraintCodeReportModule'
  },
  {
    path: 'customs/leftbehindmanagementreport',
    loadChildren: '../domain/customs/left-behind-management/left-behind-management.module#LeftBehindManagementModule'
  },


  { path: 'resource', loadChildren: '../domain/resource/resource.module#ResourceModule' },
  { path: 'audit', loadChildren: '../domain/audit/audit.module#AuditModule' },
  { path: 'audit/audittrailbyawb', loadChildren: '../domain/audit/audit-trail-by-awb/audit-trail-by-awb.module#AuditTrailByAWBRouteModule' },
  { path: 'audit/audittrailbyuldtrolley', loadChildren: '../domain/audit/audit-trail-by-uld/audit-trail-by-uld.module#AuditTrailByULDModule' },
  { path: 'audit/audittrailbyagent', loadChildren: '../domain/audit/audit-trail-by-agent/audit-trail-by-agent.module#AuditTrailByAgentModule' },
  { path: 'audit/audittrailbybilling', loadChildren: '../domain/audit/audit-trail-by-billing/audit-trail-by-billing.module#AuditTrailByBillingModule' },
  { path: 'audit/audittrailbyefacilitation', loadChildren: '../domain/audit/audit-trail-by-efacilitation/audit-trail-by-efacilitation.module#AuditTrailByEFacilitationModule' },
  { path: 'audit/audittrailbyequipment', loadChildren: '../domain/audit/audit-trail-by-equipment/audit-trail-by-equipment.module#AuditTrailByEquipmentModule' },
  { path: 'audit/audittrailbyflight', loadChildren: '../domain/audit/audit-trail-by-flight/audit-trail-by-flight.module#AuditTrailByFlightModule' },
  { path: 'audit/audittrailbylocation', loadChildren: '../domain/audit/audit-trail-by-location/audit-trail-by-location.module#AuditTrailByLocationModule' },
  { path: 'audit/audittrailbycustoms', loadChildren: '../domain/audit/audit-trail-by-customs/audit-trail-by-customs.module#AuditTrailByCustomsModule' },
  { path: 'audit/audittrailbycustomer', loadChildren: '../domain/audit/audit-trail-by-customer/audit-trail-by-customer.module#AuditTrailByCustomerModule' },
  { path: 'audit/audittrailbytracing', loadChildren: '../domain/audit/audit-trail-by-tracing/audit-trail-by-tracing.module#AuditTrailByTracingModule' },
  { path: 'audit/audittrailbymasters', loadChildren: '../domain/audit/audit-trail-by-masters/audit-trail-by-masters.module#AuditTrailByMastersModule' },
  { path: 'audit/audittrailbymailbag', loadChildren: '../domain/audit/audit-trail-by-mailbag/audit-trail-by-mailbag.module#AuditTrailByMailBagModule' },
  { path: 'audit/audittrailbyuserrole', loadChildren: '../domain/audit/audit-trail-by-userrole/audit-trail-by-userrole.module#AuditTrailByUserroleModule' },
  { path: 'audit/audittrailbycdh', loadChildren: '../domain/audit/audit-trail-by-cdh/audit-trail-by-cdh.module#AuditTrailByCDHModule' },
  { path: 'audit/audittrailbyval', loadChildren: '../domain/audit/audit-trail-by-val/audit-trail-by-val.module#AuditTrailByVALModule' },
  { path: 'epouch', loadChildren: '../domain/epouch/epouch.module#EpouchModule' },
  //Events Configuration management
  { path: 'warehouse/events', loadChildren: '../domain/warehouse/events/events.module#EventsModule' },
  { path: 'interface', loadChildren: '../domain/interface/interface.module#InterfaceModule' },

  // ADMIN USER PROFILE URL's
  {
    path: 'admin/createuser', loadChildren: '../domain/admin/user/create-user/create-user.module#CreateUserModule'
  },
  {
    path: 'admin/searchuser', loadChildren: '../domain/admin/user/search-user/search-user.module#SearchUserModule'
  },
  {
    path: 'admin/updateuser', loadChildren: '../domain/admin/user/update-user/update-user.module#UpdateUserModule'
  },
  {
    path: 'admin/usercertificationlist', loadChildren: '../domain/admin/user/user-certification-list/user-certification-list.module#UserCertificationListModule'
  },
  {
    path: 'admin/createrole', loadChildren: '../domain/admin/role/create-role/create-role.module#CreateRoleModule'
  },
  {
    path: 'admin/updaterole', loadChildren: '../domain/admin/role/update-role/update-role.module#UpdateRoleModule'
  },
  {
    path: 'admin/rolelist', loadChildren: '../domain/admin/role/rolelist/rolelist.module#RolelistModule'
  },
  {
    path: 'admin/import', loadChildren: '../domain/admin/role/rolelist/import/import.module#ImportModule'
  },
  {
    path: 'admin/assignfunction', loadChildren: '../domain/admin/role/assignrolefunction/assignrolefunction.module#AssignrolefunctionModule'
  },
  {
    path: 'admin/maintaincustomer', loadChildren: '../domain/admin/customer/maintain-customer-master/maintain-customer-master.module#MaintainCustomerMasterModule'
  },
  {
    path: 'admin/changeofcode', loadChildren: '../domain/admin/customer/change-of-code/change-of-code.module#ChangeOfCodeModule'
  },
  {
    path: 'admin/authorizedpersonnel', loadChildren: '../domain/admin/customer/authorizedPersonnel/authorizedPersonnel.module#AuthorizedPersonnelModule'
  },
  {
    path: 'admin/blacklistcustomer', loadChildren: '../domain/admin/customer/blacklist-customer/blacklist-customer.module#BlacklistCustomerModule'
  },
  {
    path: 'admin/companyregistration', loadChildren: '../domain/admin/customer/company-registration/company-registration.module#CompanyRegistrationModule'
  },
  {
    path: 'admin/companyregistrationapproval', loadChildren: '../domain/admin/customer/company-registration-approval/company-registration-approval.module#CompanyRegistrationApprovalModule'
  },
  {
    path: 'admin/customerlistbyappointee', loadChildren: '../domain/admin/customer/customerListByAppointedAgent/customerListByAppointedAgent.module#CustomerListByAppointedAgentModule'
  },
  {
    path: 'admin/exportemail', loadChildren: '../domain/admin/customer/exportEmailAddress/exportEmailAddress.module#ExportEmailAddressComponentModule'
  },
  {
    path: 'admin/maintainagentloc', loadChildren: '../domain/admin/customer/maintain-agent-location/maintain-agent-location.module#MaintainAgentLocationModule'
  },
  {
    path: 'admin/maintaincustlist', loadChildren: '../domain/admin/customer/maintainCustomerList/maintainCustomerList.module#MaintainCustomerListModule'
  },
  {
    path: 'admin/overseasconsignee', loadChildren: '../domain/admin/customer/overseas-consignee/overseas-consignee.module#OverseasConsigneeModule'
  },
  {
    path: 'admin/rcarAgentGroup', loadChildren: '../domain/admin/customer/rcar-agent-group/rcar-agent-group.module#RcarAgentGroupModule'
  },
  {
    path: 'admin/rcarNumber', loadChildren: '../domain/admin/customer/rcar-number/rcar-number.module#RcarNumberModule'
  },
  {
    path: 'admin/subuserprofilelist', loadChildren: '../domain/admin/customer/sub-user-profile-list/sub-user-profile-list.module#SubUserProfileListModule'
  },
  {
    path: 'admin/vehiclepermitapproval', loadChildren: '../domain/admin/customer/vehiclePermitApproval/vehiclePermitApproval.module#VehiclePermitApprovalModule'
  },
  {
    path: 'admin/vehiclepermitapproval', loadChildren: '../domain/admin/customer/vehiclePermitApproval/vehiclePermitApproval.module#VehiclePermitApprovalModule'
  },
  {
    path: 'admin/maintainteam', loadChildren: '../domain/admin/resource/team/maintain-team/maintain-team.module#MaintainTeamModule'
  },
  {
    path: 'efacilitation',
    loadChildren: '../domain/efacilitation/efacilitation.module#EfacilitationModule'
  },
  {
    path: 'export/acceptance/acceptanceweighing',
    loadChildren: '../domain/export/acceptance/acceptanceweighing/acceptanceweighing.module#AcceptanceweighingModule'
  },
  // {
  //  path: 'tcs/vehicle-information',
  //   loadChildren: '../domain/tcs/vehicle-information/vehicle-information.module#VehicleInformationModule'

  // },


  // ADMIN USER PROFILE URL's

  // Truck Control Systems



  {
    path: 'tcs/company-occupancy',
    loadChildren: '../domain/tcs/company-occupancy/company-occupancy.module#CompanyOccupancyModule'
  },
  {
    path: 'tcs/add-queue',
    loadChildren: '../domain/tcs/add-queue/add-queue.module#AddQueueModule'
  },
  {
    path: 'tcs/truck-assign',
    loadChildren: '../domain/tcs/truck-assign/truck-assign.module#TruckAssignModule'
  },
  {
    path: 'tcs/trackactivity',
    loadChildren: '../domain/tcs/truck-activity/truck-activity.module#TruckActivityModule'
  },
  {
    path: 'tcs/truckparkactivity',
    loadChildren: '../domain/tcs/truck-park-activity/truck-park-activity.module#TruckParkActivityModule'
  },
  {
    path: 'tcs/reservetruckdock',
    loadChildren: '../domain/tcs/reserve-truck-dock/reserve-truck-dock.module#ReserveTruckDockModule'
  },
  {
    path: 'tcs/maintain-tenant',
    loadChildren: '../domain/tcs/maintain-tenant/maintain-tenant.module#MaintainTenantModule'
  },
  {
    path: 'tcs/maintain-truck-dock',
    loadChildren: '../domain/tcs/maintain-truck-dock/maintain-truck-dock.module#MaintainTruckDockModule'
  },

  {
    path: 'tcs/schedule-collection',
    loadChildren: '../domain/tcs/schedule-collection/schedule-collection.module#ScheduleCollectionModule'
  },
  {
    path: 'tcs/led-display',
    loadChildren: '../domain/tcs/led-display/led-display.module#LedDisplayModule'
  },
  {
    path: 'tcs/tenantqueueinformation',
    loadChildren: '../domain/tcs/tenant-queuing-information/tenant-queuing-information.module#TenantQueuingInformationModule'
  }
  ,

  {
    path: 'tcs/truckqueuinginfo',
    loadChildren: '../domain/tcs/truck-queuing-info/truck-queuing-info.module#TruckQueuingInfoModule'
  },

  {
    path: 'tcs/maintainBanInfo',
    loadChildren: '../domain/tcs/maintain-ban-information/maintain-ban-information.module#MaintainBanInformationModule'
  },
  {
    path: 'tcs/prewaivingparking',
    loadChildren: '../domain/tcs/pre-waiving-parking/pre-waiving-parking.module#PreWaivingParkingModule'
  },
  {
    path: 'tcs/truck-dock-maintenance',
    loadChildren: '../domain/tcs/truck-dock-maintenance/truck-dock-maintenance.module#TruckDockMaintenanceModule'
  },
  {
    path: 'tcs/truck-dock-monitoring',
    loadChildren: '../domain/tcs/truck-dock-monitoring/truck-dock-monitoring.module#TruckDockMonitoringModule'
  },
  {
    path: 'tcs/truck-dock-template',
    loadChildren: '../domain/tcs/truck-dock-template/truck-dock-template.module#TruckDockTemplateModule'
  },

  {
    path: 'tcs/dockutildetails',
    loadChildren: '../domain/tcs/dock-utilization-details/dock-utilization-details.module#DockUtilizationDetailsModule'
  },

  {
    path: 'tcs/releasedock',
    loadChildren: '../domain/tcs/release-truck-dock/release-truck-dock.module#ReleaseTruckDockModule'
  },

  {
    path: 'tcs/assign-truck-dock',
    loadChildren: '../domain/tcs/assign-truck-dock/assign-truck-dock.module#AssignTruckDockModule'
  },

  {
    path: 'tcs/simulator',
    loadChildren: '../domain/tcs/simulator/simulator.module#SimulatorModule'
  },

  {
    path: 'export/buplist',
    loadChildren: '../domain/export/buplist/buplist.module#BuplistModule'
  },
  {
    path: 'export/receivedocument',
    loadChildren: '../domain/export/receivedocument/receivedocument.module#ReceivedocumentModule'
  },
  {
    path: 'tcs/manual-capture-event',
    loadChildren: '../domain/tcs/manual-capture-event/manual-capture-event.module#ManualCaptureEventModule'
  },
  {
    path: 'export/acceptance/mRCLSummary',
    loadChildren: '../domain/export/acceptance/by-packaging/mrclsummary/mrclsummary.module#MRCLSummaryModule'
  },
  {
    path: 'export/acceptance/mRCLPredeclration',
    loadChildren: '../domain/export/acceptance/by-packaging/mrclsummary/maintainmrclpredeclaration/maintainmrclpredeclaration.module#MaintainmrclpredeclarationModule'
  },
  {
    path: 'export/acceptance/rclsummary',
    loadChildren: '../domain/export/acceptance/by-packaging/rclsummary/rclsummary.module#RclsummaryModule'
  },
  {
    path: 'export/acceptance/maintainRcl',
    loadChildren: '../domain/export/acceptance/by-packaging/maintain-rcl/maintain-rcl.module#MaintainRCLModule'
  },
  {

    path: 'export/localtransfer',
    loadChildren: '../domain/export/acceptance/by-packaging/localtransfer/localtransfer.module#LocaltransferModule'
  },
  {
    path: 'export/exportawbdocument',
    loadChildren: '../domain/export/acceptance/by-packaging/exportawbdocument/exportawbdocument.module#ExportawbdocumentModule'
  },
  {
    path: 'export/rejectreturnvoidrcl',
    loadChildren: '../domain/export/acceptance/by-packaging/rejectreturnvoidrcl/rejectreturnvoidrcl.module#RejectreturnvoidrclModule'
  },

  {

    path: 'uld/RetrieveULDLSPfromMHS',
    loadChildren: '../domain/uld/uldlsp/uldlsp.module#UldLspModule'
  },
  {

    path: 'tcs/exit-gate',
    loadChildren: '../domain/tcs/exit-gate/exit-gate.module#ExitGateModule'
  },

  { path: '**', redirectTo: '/', pathMatch: 'full' }


];

/**
 * Application Routing Module
 */
@NgModule({
  imports: [
    // Main Routes
    RouterModule.forRoot(applicationRoutes),
    NgcCoreModule, NgcControlsModule, NgcDirectivesModule
  ],
  exports: [
  ],
  declarations: [],
  bootstrap: [],
  providers: [AdminService, AwbManagementService, ExportService, BuildupService, BillingService, AirlineBillingService]
})
export class CosysRoutingModule extends NgcRootRoutingModule {

  /**
   * Initialize Routing Module
   *
   * @param router Router
   */
  constructor(router: Router, zone: NgZone) {
    super(router, zone);
    // Reconfig
    this.reconfig();
  }
}

