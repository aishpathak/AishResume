// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const Environment = {
  production: false,
  theme: "ngc",
  dateFormat: "ddMMMyyyy",
  timeFormat: "HH:mm",
  dateTimeFormat: "ddMMMyyyy HH:mm",
  enableGuard: false,
  currencySymbol: "SGD",
  currencyDecimalDigits: 2,
  defaultTerminal: "AFT5",
  applicationId: "COSYS",
  enableAuthentication: false,
  enableAccessControl: false,
  enableBindError: false,
  helpAPIURL: [{ 'uat': 'http://10.130.8.4/mediawiki/api.php', 'prod': 'http://10.130.4.25/mediawiki/api.php' }],
  applicationVersion: require("../../package.json").version,
  buildPackageContent: require("../../package.json"),
  lovPreLoadIds: ["APT", "CARRIER", "CURRENCY", "KEY_AWB_CONSIGNEE_DATA_REVAMP", "COUNTRY", "UNID_PSN", "FINAL_DESTINATION"],
  dropDownPreLoadIds: [],
  excludedUrls: ['/export/cdh/dashboardtv/T3', '/export/cdh/dashboardtv/T5',
    '/warehouse/events/exportFlightEVMDashboardTV', '/warehouse/events/importFlightEVMDashboardTV',
    '/warehouse/events/exportFlightEVMSlaTV', '/warehouse/events/importFlightEVMSlaTV'],
  instrumentationKey: [{ uat: '38b919dd-8964-49f2-a4d7-6ff8f50d6c8c' }, { prod: '18b6bf62-640b-481b-84e2-5931b739adea' }]
};

export const DomainEnvironement = {
  // serviceBaseURL: 'http://10.91.243.83:8180/',
  /**
   * Application URL's
   */
};

export const PLATFORM_ENV = {
  serviceBaseURL: "http://10.130.8.6:9050/",
  //
  applicationConfigUrl: 'platform/tenant/config',
  tenantThemeUrl: 'platform/theme/tenant/css',
  configDropDownUrl: 'platform/config/dropdown',
  fetchTenants: 'platform/config/tenants'
};

export const CFG_ENV = {
  /**
   * Setting For Core Services(service.js) ---->START  */
  serviceBaseURL: "http://localhost:9130/",//'http://10.130.8.4:8081/',
  // userProfileURL: 'services/security/user-profile',
  // accessControlListURL: 'services/security/access-control-list',
  // i18nGlobalListURL: 'services/master/i18n-global-list',
  // menuFunctionListURL: 'services/security/menu-function-list',
  // autoCompleteURL: 'services/master/autocomplete-data',
  // dropDownListURL: 'services/master/dropdown-data',
  // dropDownQueryListURL: 'services/master/dropdown-data',
  // LOVURL: 'services/master/lov-data'

  /*Setting For Core Services(service.js) --> END */

  /**
   * Setting For Core Services(10.130.8.4) ---->START
   */
  fetchI18NLabels: "configuration/api/security/i18n-label",
  saveI18NLabels: "configuration/api/security/i18n-label-save",
  userProfileURL: "configuration/services/security/user-profile",
  userFavouriteURL: "configuration/services/security/user-favourite",
  i18nGlobalListURL: "configuration/api/security/i18n-list",
  menuFunctionListURL: "configuration/services/security/menu/load-menu",
  autoCompleteURL: "configuration/services/master/autocomplete-data",
  dropDownListURL: "configuration/api/config/dropdown-data",
  dropDownQueryListURL: "configuration/api/masters/dropdown-data",
  LOVURL: "configuration/api/masters/lov/searchLOV",
  systemParameterURL: "configuration/api/config/Search/in/systemParam/systemParamList",

  uiURIMappingsURL: "configuration/services/security/ui-uri-mappings",
  //Below line was done for access control tracking but not being used/analyzed and is overhead
  //serviceURIMappingURL: "configuration/services/security/update-service-uri-mapping",
  captchaLoadURL: "configuration/services/security/generate-captcha",
  captchaValidateURL: "configuration/services/security/validate-captcha",
  flightAutoCompleteURL:
    "configuration/api/flight/service/select-auto-complete-arrival-departure-flight-details",
  fileDownloadURL: "configuration/api/masters/service/download-file",
  flightInfoURL:
    "configuration/api/flight/service/select-arrival-departure-flight-details",
  fileUploadURL: "configuration/api/masters/service/upload-file",
  multiFileUploadURL: "configuration/api/masters/service/upload-list-of-files",
  multiFileDownloadURL: "configuration/api/masters/service/load-list-of-files",
  fileDeleteURL: "configuration/api/masters/service/delete-file",
  saveDamagePhoto: "configuration/upload",
  saveDamage: "configuration/save",
  deleteDamageInfo: "configuration/delete",
  fetchDamage: "configuration/fetch"
  /**
   * Setting For Core Services(10.130.8.4) ---->END
   */
};

/*-----------------------REPORT Module----------------------------*/
export const RPT_ENV = {
  serviceBaseURL: "http://10.130.8.6:8081/",
  // Report
  reportURL: "reportservice/report",
  // Message

  messageEndpoint: "reportservice/message-endpoint",
  notificationTopic: "/topic/notification",
  notificationDestination: "/messages/notification",
  chatTopic: "/topic/chat",
  chatDestination: "/messages/chat",
  getServiceStandardMaintenanceInfo: "reportservice/api/reports/servicestandardmaintenance/get",
  saveServiceStandardMaintenanceInfo: "reportservice/api/reports/servicestandardmaintenance/save",
  deleteServiceStandardMaintenanceInfo: "reportservice/api/reports/servicestandardmaintenance/delete"
};

/*-----------------------FLIGHT Module----------------------------*/
export const FLT_ENV = {
  serviceBaseURL: 'http://10.130.8.9:9180/',//"http://10.130.8.4:5959/",
  createOperativeFlights: "flight/api/flight/schedule/createoperativeflight",
  cancelOperativeFlights: "flight/api/flight/schedule/canceloperativeflight",
  maintainFlightSchedule: "flight/api/flight/schedule/maintain",
  findFlightSchedule: "flight/api/flight/schedule/find",
  copyFlightSchedule: "flight/api/flight/schedule/copyScheduleFlight",
  spiltFlightSchedule: "flight/api/flight/schedule/splitScheduleFlight",
  generateOperativeFlights:
    "flight/api/flight/schedule/generateoperativeflight",
  getGeneratedOperativeScheduleFlight:
    "flight/api/flight/schedule/generateoperativescheduleflight",
  outgoingEnroutementBaseURL: "flight/api/flight/enroutement/display",
  flightDetailsBaseURl: "flight/api/flight/operating/find",
  deleteCodeShareFlight: "flight/api/flight/codeShare/delete",
  maintainCodeShareFlight: "flight/api/flight/codeShare/maintain",
  getCodeShareFlights: "flight/api/flight/codeShare/fetch",
  saveSplEnroutement: "flight/api/flight/enroutement/create",
  deleteSplEnroutement: "flight/api/flight/enroutement/delete",
  loadSplEnroutement: "flight/api/flight/enroutement/find",
  getOperativeFlights: "flight/api/flight/operating/searchlist",
  getScheduleDetails: "flight/api/flight/schedule/searchlist",
  updateFlightDetails: "flight/api/flight/operating/updateflight",
  restoreFlightDetails: "flight/api/flight/operating/restore",
  deleteFlightDetails: "flight/api/flight/operative/deleteCnlFlight",
  cancelFlightDetails: "flight/api/flight/operating/cancel",
  closeFlightBooking: "flight/api/flight/operating/closebooking",
  openFlightBooking: "flight/api/flight/operating/openbooking",
  getFlightSchedules: "flight/api/flight/schedule/schedulelist",
  fetchFlightSchedules: "flight/api/flight/schedule/fetchAllSchedulesAndStatus",
  saveFlightDetails: "flight/api/flight/operating/save",
  deleteFlightFact: "flight/api/flight/operating/deletefact",
  deleteFlightLeg: "flight/api/flight/operating/deleteleg",
  updateSplEnroutement: "flight/api/flight/enroutement/update",
  generateCustomFlight: "flight/api/flight/operative/generateCustomFlight",
  getUfisFlights: "flight/api/flight/ufis/fetch",
  updateUfisFlight: "flight/api/flight/ufis/update",
  createUfisFlight: "flight/api/flight/ufis/create",
  deleteUfisFlight: "flight/api/flight/ufis/delete",
  searchCANReportlist: "flight/api/flight/CANReports/search",
  insertCANDetails: "flight/api/flight/CANReports/createCANReports",
  sendCANReport: "flight/api/flight/CANReports/sendCANReports",
  serviceprovidedCANdata:
    "flight/api/flight/CANReports/searchcodeadministrationCAN",
  flightHistory: "flight/api/flight/history",
  getsenderdetails: "flight/api/flight/CANReports/getsenderdetails",
  getflightdetails: "flight/api/flight/CANReports/getfllightdetails",
  getHandlerbyCarrier: "flight/api/flight/gethandlerbycarrier",
  fetchFlightDetailsForWeather: "flight/api/flight/weather/search",
  updateWeatherCondition: "flight/api/flight/weather/updateweather",
  fetchDefaultBuBdOfficeDetails: "flight/api/flight/fetchdefaultbubdoffice",
  fetchExistingScheduleForFlight: "flight/api/flight/fetchexistingscheduleforflight",
  //serviceprovidedcreateadata: "flight/api/flight/CANReports/searchserviceprovidedcreateadata"
};
/*-----------------------IMPORT Module----------------------------*/
export const IMP_ENV = {
  // serviceBaseURL: 'http://10.91.243.83:8180/',
  serviceBaseURL: "http://10.130.8.4:8080/",
  serviceImportURL: "http://10.130.8.4:8080/",
  //serviceBaseURL: 'http://10.91.243.83:8180/',
  //serviceImportURL: 'http://10.91.243.83:8180/',
  /*----------------------AwB barcode print*------------------------*/

  getMailBreakdownDetails: "",
  specialcargohandlingform: "impbd/api/impbd/specialcargohandlingform/sendemail",
  sendEmailIn: "impbd/api/impbd/inward/sendattachment",
  verifyAWBNumber: "impbd/api/shpmng/printAWBbarcode/validate",
  printAWBBarcode: "impbd/api/shpmng/printAWBbarcode/print",
  printMultiAwbBarcode: "impbd/api/shpmng/printMultiAWBbarcode/print",
  getCargoPreAnnouncement:
    "impbd/api/impbd/preannouncement/getCorgoPreannouncementTableDetails",
  savaUpdateCargoPreAnnouncement:
    "impbd/api/impbd/preannouncement/insertUpdateCorgoPreannouncement",
  deleteCargoPreAnnouncement:
    "impbd/api/impbd/preannouncement/deleteCorgoPreannouncement",
  finalizeUnfinalize:
    "impbd/api/impbd/preannouncement/finalizeUnfinalize" /* -----------------------*AwB barcode print End-------------------------*/,
  searchIncomingFlights: "impbd/api/impbd/incoming/fetch",
  incomingFlightTelexMessage: "impbd/api/impbd/incoming/fetchTelexMessage",
  searchMyFlights: "impbd/api/impbd/myincoming/fetch",
  incomingFlightsConfigTime: "impbd/api/impbd/incoming/configuarationtime",
  isFlightExist: "impbd/api/impbd/preannouncement/isFlightExist",
  /* Inbound Ramp CheckIn */
  rampCheckInSearch: "impbd/api/rampcheckin/search",
  rampCheckInCreate: "impbd/api/ramp-check-in/create-uld",
  saveUldTemperatureLog: "impbd/api/ramp-check-in/save-temperature-log",
  rampCheckInAddDriver: "impbd/api/ramp-check-in/update-driver",
  rampCheckInUpdate: "impbd/api/ramp-check-in/updatedata",
  rampUnCheckInUlds: "impbd/api/ramp-check-in/uncheckin",
  rampCheckInDelete: "impbd/api/ramp-check-in/delete-uld",
  rampCheckIn: "impbd/api/ramp-check-in/check-in",
  rampCheckInReopen: "impbd/api/ramp-check-in/reopen",
  getPiggyback: "impbd/api/ramp-check-in/get-piggyback",
  updatePiggyback: "impbd/api/ramp-check-in/update-piggyback",
  getRampStatus: "impbd/api/ramp-check-in/check-status",
  updateBulk: "impbd/api/ramp-check-in/update-bulk",
  checkCarrierGroupcode: "impbd/api/ramp-check-in/carriercheck",
  updateBreakBulkIndicator: "impbd/api/impbd/preannouncement/updatebreakbulkIndicator",
  /*----------------------- * Capture Import Document start * -------------------*/
  fetchImportDocument: "impbd/api/mail/document/search",
  insertImportDocument: "impbd/api/mail/document/save",
  getDispatchYears: "impbd/api/mail/document/dispatchyear",
  update: "impbd/api/mail/document/update",
  validate:
    "impbd/api/mail/document/validate" /*----------------------- * Capture Import Document end * -------------------*/,

  /* -----------------------*Arrival Manifest Start-------------------------*/
  fetchArrivalManifestSearch:
    "impbd/api/config/arrivalManifest/fetchManifestDetails",
  createULDArrivalManifest:
    "impbd/api/config/arrivalManifest/createULDShipment",
  mergeULDArrivalManifest:
    "impbd/api/config/arrivalManifest/mergeFFMShipment",
  deleteULDArrivalManifest:
    "impbd/api/config/arrivalManifest/deleteULDShipment",
  createULDAdditionalInfoArrivalManifest:
    "impbd/api/config/arrivalManifest/AdditionalInfo",
  checkValidFlight: "impbd/api/config/arrivalManifest/FlightCheck",
  updateUldShipmentPriorty: "impbd/api/config/arrivalManifest/updateULDShipmentPrioriy",
  uldShipmentPriortySendMail: "impbd/api/config/arrivalManifest/shipmentPrioritySendMail",
  fetchRouting:
    "impbd/api/config/arrivalManifest/fetchRouting" /* -----------------------*Arrival Manifest End-------------------------*/,

  /*--------------------breakdown working list----------------------------*/
  getBreakDownWorkingList: "impbd/api/impbd/bdworklist/getbreakdownworkinglist",
  updateFlightDelayForShipment: "impbd/api/impbd/bdworklist/updateflightdelay",
  getInboundBreakdownList: "impbd/api/impbd/inboundbreakdown/getdetails",
  getShipmentHandlingInfo:
    "impbd/api/impbd/inboundbreakdown/fetchHandlingInstructions",
  createBreakDownData: "impbd/api/impbd/inboundbreakdown/createShipmentDetails",
  createBreakDownListData: "impbd/api/impbd/inboundbreakdown/createShipmentDetailsList",
  updateBreakDownComplete: "impbd/api/impbd/bdworklist/breakdownComplete",
  sendLhRcfNfdReport: "impbd/api/impbd/bdworklist/sendLhRcfNfd",
  createMaintainHouseBreakDownData: "impbd/api/impbd/inboundbreakdown/createMaintainHouseBreakDownData",
  getMaintainHouseBreakDownData: "impbd/api/impbd/inboundbreakdown/getMaintainHouseBreakDownData",
  updateReopenBreakDownComplete:
    "impbd/api/impbd/bdworklist/ReopenbreakdownComplete", /*--------------------breakdown working list End---------------------------*/
  /*--------------------Maintain FWB list----------------------------*/
  fetchFwbDetails: "shpmng/api/shpmng/fwb/get",
  saveFwbDetails: "shpmng/api/shpmng/fwb/save",
  deleteFwb: "shpmng/api/shpmng/fwb/delete",
  fetchFwbDetailsNonIata: "shpmng/api/shpmng/fwb/get/noniata",
  fetchRoutingDeatils:
    "shpmng/api/shpmng/fwb/fetchRouting" /*--------------------Maintain FWB list End---------------------------*/,

  /*--------------------Flight Discrepancy List---------------------------*/
  onSearchDiscrepancyList: "impbd/api/impbd/fdl/fetch",
  onsearchdiscrepancyHAWB: "impbd/api/impbd/fetch/discrepancyHAWB/fetch",
  onsearchFlightDiscrepancy: "impbd/api/impbd/flightDiscrepancy/getFlightDiscrepancyList",
  onSearchMaintainScheduleCollection: "impbd/api/impbd/maintainSchedule/getMaintainSchedule",
  onSaveMaintainScheduleCollection: "impbd/api/impbd/maintainSchedule/saveMaintainSchedule",
  onDeleteMaintainScheduleCollection: "impbd/api/impbd/maintainSchedule/deleteMaintainSchedule",
  onSearchCaptureTimeStamp: "impbd/api/impbd/captureTimeStamp/getCaptureTimeStamp",
  onupdateCaptureTime: "impbd/api/impbd/captureTimeStamp/updateCaptureTimeStamp",
  /*--------------------Transhipment---------------------------*/
  geTranshipmentByCarrier: "impbd/api/transfer/shipment-transfer-by-carrier",
  getTranshipmentByAWBList: "impbd/api/transfer-manifest-by-awb/search-list",
  getTranshipmentByAWB: "impbd/api/transfer-manifest-by-awb/search",
  maintainTranshipmentByAWB: "impbd/api/transfer-manifest-by-awb/maintain",
  cancelTranshipmentAWB: "impbd/api/transfer-manifest-by-awb/cancel",
  finalizeTranshipmentAWB: "impbd/api/transfer-manifest-by-awb/finalize",
  unfinalizeTranshipmentAWB: "impbd/api/transfer-manifest-by-awb/unfinalize",
  getTrmNumberWithIssueDate:
    "impbd/api/transfer-manifest-by-awb/getTrmNumberWithIssueDate",
  getShipmentInfo: "impbd/api/transfer-manifest-by-awb/getShipmentInfo",
  printManifestReport: "impbd/api/transfer-manifest-by-awb/printtrm",
  checkRemainingPiecesLocation: "impbd/api/transfer/checkLocationforRemainingShipmentPieces",

  /*--------------DocumentVerification----------------------*/
  getDocumentVerification: "impbd/api/impbd/documentVerification/fetch",
  documentComplete: "impbd/api/impbd/documentVerification/documentsComplete",
  offLoadDocumentVerification: "impbd/api/impbd/documentVerification/offload",
  onHoldDocumentVerificationShipments:
    "impbd/api/impbd/documentVerification/onhold",
  updateShipmentRemarks: "impbd/api/impbd/documentVerification/updateremarks",
  updatFlightDelayforShipment:
    "impbd/api/impbd/documentVerification/updateFlightDelay",
  reOpenDocumentComplete:
    "impbd/api/impbd/documentVerification/reOpenDocumentComplete",
  saveUpdateDocumentVerification:
    "impbd/api/impbd/documentVerification/saveDocumentVerification",
  saveDGDDetails: "impbd/api/impbd/dgd/save",
  getRegulationDetails: "impbd/api/impbd/dgd/getUnidDetailsByRegId",
  deleteDgDecDetails: "impbd/api/impbd//dgd/deleteDgdDetails",
  getDGDDetailsByAwbNumber: "impbd/api/impbd/dgd/getDgdDetails",

  getSeqNo:
    "impbd/api/impbd/dgd/getOverPackSeqNo",
  getDGDEliElmDetails: "impbd/api/impbd/dgd/getelielm",
  saveDGDEliElmDetails: "impbd/api/impbd/dgd/saveelielm",
  deleteDGDEliElmDetails: "impbd/api/impbd/dgd/deleteelielm",
  getEliElmRemark: "impbd/api/impbd/dgd/getelielmremark",

  /*--------------DocumentVerification----------------------*/

  /*--------------------Import Mail Manifest starts---------------------------*/
  onSearchImportManifest: "impbd/api/mail/manifest/search",
  transferToCN46: "impbd/api/mail/manifest/transferToCN46",
  transferToServiceReport: "impbd/api/mail/manifest/transferToServiceReport",
  documentCompleteForMail: "impbd/api/mail/manifest/documentComplete",
  breakDownCompleteForMail: "impbd/api/mail/manifest/breakDownComplete",
  resendSegregationReport: "impbd/api/impbd/bdworklist/reSendSegregationReport",
  checkContainerDestination: "impbd/api/mail/manifest/checkContainerDestination",
  updateLocation: "impbd/api/mail/manifest/updateLocation",
  /*--------------------Import Mail Manifest ends---------------------------*/

  /*--------------------Import Dispaly  ffm starts---------------------------*/

  getAllDisplayffmList: "impbd/api/import/displayffm/getAllDisplayffm",
  updateFFMstatus: "impbd/api/import/displayffm/updateFFMstatus",
  /*--------------------Import Dispaly  ffm ends---------------------------*/

  /*----------------------- * mail breakdown start * -------------------*/
  getMailBreakdownworkinglist: "impbd/api/mail/breakdown/search",
  checkContainerDestinationForBreakDown: "impbd/api/mail/breakdown/checkContainerDestinationForBreakDown",
  insertMailBreakdown: "impbd/api/mail/breakdown/save",
  getMailBreakdown: "impbd/api/mail/breakdown/searchmailbreakdown",
  splitmailbagnumber: "impbd/api/mail/breakdown/split",
  checkmailbag: "impbd/api/mail/breakdown/checkmailbag",
  dispatchyear:
    "impbd/api/mail/breakdown/dispatchyear",
  /*----------------------- * mail breakdown end * -------------------*/

  getbreakDownList: "impbd/selectbdinfo",
  insertBreakDownHandling: "impbd/createbdinfo",
  deleteBreakDownHandling: "impbd/deletebdinfo",
  getHAWBInfo: "impbd/getHAWBInfo",
  /*----------------------- *  breakdowntracing start * -------------------*/
  getTracingList: "impbd/api/config/breakdown/tracingList",
  /*----------------------- * Display Cpm start * -------------------*/
  getDisplayCpmModel:
    "impbd/api/displaycpm/search",
  /*----------------------- * Display Cpm end * -------------------*/
  /*----------------------- * Create Capture Damage  start* -------------------*/
  getDamageReportModel: "impbd/api/createdamagereport/search",
  saveAdditionDamageReportModel: "impbd/api/createdamagereport/saveAddition",
  finalizeCargoDamage:
    "impbd/api/createdamagereport/finalize",
  getCargoDamageList: "impbd/api/createdamagereport/fetchCargoDamageReportList",
  /*----------------------- * Create Capture Damage end * -------------------*/
  /*----------------------- * Mail Transfer Manifest starts * -------------------*/
  fetchTransferManifestDetails: "impbd/api/mail/transfermanifest/fetchDetails",
  saveTransferManifestDetails:
    "impbd/api/mail/transfermanifest/save" /*----------------------- * Mail Transfer Manifest Ends * -------------------*/,
  /*----------------------- * Inward service report start * -------------------*/
  fetchDiscrepancy: "impbd/api/impbd/inward/fetch",
  addDiscrepancy: "impbd/api/impbd/inward/add",
  finalizeDiscrepancy: "impbd/api/impbd/inward/finalize",
  finalizeMailDiscrepancy: "impbd/api/impbd/inward/finalizeservicereport",
  getshipdetails: "impbd/api/impbd/inward/getshipdetails",
  /*----------------------- * Inbound Flight Monitoring start * -------------------*/
  getInboundFlightMonitoringSerach:
    "impbd/api/inboundFlightMonitoring/search" /*----------------------- * Inbound Flight Monitoring end * -------------------*/,

  /*----------------------- * Breakdown Summary Start * -------------------*/
  getBreakDownSummary: "impbd/api/config/breakdown/summaryList",
  createBreakDownSummary: "impbd/api/config/breakdown/insertSummaryList",
  updateFeedBack: "impbd/api/config/breakdown/updateFeedBack",
  sendEmail:
    "impbd/api/config/breakdown/sendEmail" /*----------------------- * Breakdown Summary End * -------------------*/,

  /*----------------------- * Breakdown Delay Start * -------------------*/
  getDelayStatus: "impbd/api/config/breakdown/delayList",
  closeFlight:
    "impbd/api/config/breakdown/closeFlight" /*----------------------- * Breakdown Delay End * -------------------*/,
  /*----------------------- * Maintain service Provider * -------------------*/
  saveServiceList: "impbd/api/import/serviceProvider/createServiceProvider",
  getServiceProviderList:
    "impbd/api/import/serviceProvider/getAllServiceProvider",
  editServiceProviderList:
    "impbd/api/import/serviceProvider/editServiceProvider",
  updateServiceProviderList:
    "impbd/api/import/serviceProvider/updateServiceProvider",
  deleteServiceProviderList:
    "impbd/api/import/serviceProvider/deleteServiceProvider" /*----------------------- * Maintain service Provider * -------------------*/,
  eccfetchSystemParam:
    "configuration/api/config/Search/in/systemParam/ECC_PREBOOKINGLIST",
  sendTsmManually: "impbd/api/impbd/bdworklist/ManualsendTsm",
  vctInformationList: "impbd/api/impbd/vctinformation/getvctinformationList",
  getFlightinfo: "impbd/api/impbd/impbd/getFlightInfo",
  closeFlt: "impbd/api/impbd/impbd/closeFlight",
  validateStaffId: "impbd/api/impbd/impbd/validateStaffId",
  unCloseFlt: "impbd/api/impbd/impbd/unCloseFlight",
  confirmUldFetch: "impbd/api/impbd/uld/confirmList",
  fetchRHOPriority: "impbd/api/config/arrivalManifest/fetchRHOPriority",
  updateRHOPriority: "impbd/api/config/arrivalManifest/updateRHOPriority",
  fetchSpecialHandlingAutoSelect: "impbd/api/config/arrivalManifest/fetchSpecialHandlingAutoSelect",
  updateSpecialHandlingAutoSelect: "impbd/api/config/arrivalManifest/updateSpecialHandlingAutoSelect",
  fetchSpecialCargoHandling: "impbd/api/config/arrivalManifest/fetchSpecialCargoHandling",
  updateSpecialCargoHandling: "impbd/api/config/arrivalManifest/updateSpecialCargoHandling",
  fetchShipmentPriorityGroupEmail: "impbd/api/config/arrivalManifest/fetchShipmentPriorityGroupEmail",
  updateShipmentPriorityGroupEmail: "impbd/api/config/arrivalManifest/updateShipmentPriorityGroupEmail",
  updateUld: "impbd/api/impbd/uld/updateUld",
  savevctInformationList: "impbd/api/impbd/vctinformation/savevctinformationList",
  getDocumentHandOver: "impbd/api/document/getDocumentHandOver",
  saveDocHandOverRemarkInfo: "impbd/api/document/saveDocHandoverRemark",
  saveDocHandoverInOutTimeInfo: "impbd/api/document/saveDocHandoverInOutTime",

  getFlightPouchHandle: "impbd/api/flightpouch/getFlightPouchHandle",
  getExportFlightPouchHandle: "impbd/api/flightpouch/getExportFlightPouchHandle",
  saveConfirmPouchPickupInfo: "impbd/api/flightpouch/confirmPouchPickupInfo",
  saveConfirmPouchDeliverInfo: "impbd/api/flightpouch/confirmPouchDeliveryInfo",
  saveConfirmPouchReceiveInfo: "impbd/api/flightpouch/confirmPouchReceiveInfo",
  saveCancelPouchPickupInfo: "impbd/api/flightpouch/cancelPouchPickupInfo",
  saveCancelPouchDeliveryInfo: "impbd/api/flightpouch/cancelPouchDeliverInfo",
  saveCancelPouchReceivedInfo: "impbd/api/flightpouch/cancelPouchReceivedInfo",

  getEcanStatusEnquiry: "impbd/api/impbd/fetchEcanStatusEnquiryList",
  onSendEcan: "impbd/api/impbd/sendEcan",
  onFetchArrivalCargoCollectionList: "impbd/api/impbd/getArrivalCargoCollection",
  onSaveArrivalCargoCollectionList: "impbd/api/impbd/saveArrivalCargoCollection",

  /*--------------------EForms starts---------------------------*/
  flightEFormRequestData: "impbd/api/impbd/fetchflightEForm"
  /*--------------------EForm Ends---------------------------*/

};
/*-----------------------EXPORT Module----------------------------*/
/*-----------------------EXPORT Module----------------------------*/
export const EXP_ENV = {
  serviceBaseURL: "http://10.130.8.6:9150/", //"http://10.130.8.4:8280/"
  getFLightId: "expaccpt/api/getflightid",
  outboundLyingList: "expaccpt/api/outbound/lyinglist/search",
  searchMultipleShipmentBookingDetail:
    "expaccpt/api/multiple-shipment-booking/search",
  maintainMultipleShipmentBookingDetail:
    "expaccpt/api/multiple-shipment-booking/maintain",
  validateRoutingForMultipleShipment:
    "expaccpt/api/multiple-shipment-booking/validateRouting",
  getShipmentMasterData:
    "expaccpt/api/multiple-shipment-booking/get-shipment-master-data",
  onFetchVolumetricWeight: "expaccpt/api/export/acceptance/getvolumetricweight",
  onFetchVolumetricWeightRevised: "expaccpt/api/export/acceptance/getvolumetricweightrevised",
  getFlightShipmentDetail:
    "expaccpt/api/multiple-shipment-booking/get-flight-shipment-detail",
  onFetchVolumetricScannerResponse: "expaccpt/api/export/acceptance/onGetVolumetricScannerResponse",
  chargeCreation: "expaccpt/api/export/acceptance/calculatecharge",
  paymentStatusCheck: "expaccpt/api/export/acceptance/checkpaymentstatus",
  onStartWeighingCustomCheck:
    "expaccpt/api/export/acceptance/onstartweighingcustomcheck",
  onStartWeighingCustomCheckRevised: "expaccpt/api/export/acceptance/onstartweighingcustomcheckrevised",
  updateMasters: "expaccpt/api/export/acceptance/updateMasters",
  getShipmentDetail: "expaccpt/api/multiple-shipment-booking/get-shipment",
  calculateDimensionVolume: "expaccpt/api/export/acceptance/getdimensionvolume",
  editFlightShipmentDetail:
    "expaccpt/api/multiple-shipment-booking/edit-flight-shipment-detail",
  cancelMultipleShipment: "expaccpt/api/multiple-shipment-booking/cancel",
  sendFBR: "expaccpt/api/export/outgoingFlights/sendFBR",
  searchWorkingList: "expaccpt/api/export/workinglist/search",
  deleteMultipleShipment: "expaccpt/api/multiple-shipment-booking/delete",
  getExportWorkingListInfo: "expaccpt/api/export/workinglist/getworkinglistinfo",
  searchSnapshot: "expaccpt/api/export/workinglist/searchSnapshot",
  createSnapshot: "expaccpt/api/export/workinglist/createSnapshot",
  createSnapshotnew: "expaccpt/api/export/workinglist/createSnapshotnew",
  createSnapshotReport: "expaccpt/api/export/workinglist/createSnapshotForReport",
  onSaveWeighingRevised: "expaccpt/api/export/acceptance/saveweighingcargorevised",
  onFinalizeWeightRevised: "expaccpt/api/export/acceptance/finalizeweightRevised",
  getProportionalWeightRevised: "expaccpt/api/export/acceptance/onChangeWeightAllRevised",
  getProportionalWeightRevisedForGross: "expaccpt/api/export/acceptance/onChangeWeightAllRevisedForGross",
  getExcludedSHCFlagForVolumetric: "expaccpt/api/export/acceptance/getExcludedSHCFlagForVolumetric",
  setPartAccepted: "expaccpt/api/export/acceptance/onPartButtonClick",
  fetchRuleShipmentExecutionList: "expaccpt/api/export/acceptance/fetchruleshipmentexecutionlist",
  fetchRuleShipmentExecutionListAcceptance: "expaccpt/api/export/acceptance/fetchruleshipmentexecutionlistacceptance",
  fetchStartFreightRuleExecutionList: "expaccpt/api/export/acceptance/start-freight-acceptance",
  unfinalizeWeightOfShipmentRevised: "expaccpt/api/export/acceptance/unfinalizeWeighingRevised",
  getAwbDetails: "",
  getMessageId: "satssginterfaces/api/smartgate/scanVolWgtReq",
  singleShipmentBookingSearch:
    "expaccpt/api/export/booking/single-shipment/search",
  singleShipmentBookingCreateBooking:
    "expaccpt/api/export/booking/single-shipment/create",
  singleShipmentBookingDeletePart:
    "expaccpt/api/export/booking/single-shipment/delete-part",
  singleShipmentBookingMergePart:
    "expaccpt/api/export/booking/single-shipment/merge-part",
  singleShipmentBookingGetSuffix:
    "expaccpt/api/export/booking/single-shipment/getSuffix",
  singleShipmentAddNewPart:
    "expaccpt/api/export/booking/single-shipment/addNewPart",
  singleShipmentDeleteFlightBooking:
    "expaccpt/api/export/booking/single-shipment/delete-flight",
  singleShipmentGetProportionalWeight:
    "expaccpt/api/export/booking/single-shipment/getproportionalWt",
  // Validate if loaded when TT is unchecked
  validateOnTTUncheck:
    "expaccpt/api/export/booking/single-shipment/validateOnTTUncheck",
  //updateBooking URL starts here
  updateBookingPcsWtSearch: "expaccpt/api/export/booking/update-booking/search",
  updateBookingPcsWtOperation: "expaccpt/api/export/booking/update-booking/updatePcsWt",
  getAgentDetail: "expaccpt/api/export/acceptance/getAgentDetails",
  //updateBooking URL ens here	
  getRejectReturnAwbDetails: "expaccpt/api/reject-return-shipment/fetch",
  getDefaultDefinitionURL: "expaccpt/api/export/acceptance/fetch",
  updateDefaultHandlingDefinitionURL: "expaccpt/api/export/acceptance/create",
  deleteShcDefinitionURL: "expaccpt/api/export/acceptance/deleteshc",
  deleteAirlineDefinitionURL: "expaccpt/api/export/acceptance/deleteairline",
  saveAirlineDetailsURL: "expaccpt/api/export/acceptance/saveairline",
  saveShcDetailsURL: "expaccpt/api/export/acceptance/saveshc",
  getCargoAcceptance: "expaccpt/api/export/acceptance/fetchshipmentdetails",
  getContractorInformation:
    "expaccpt/api/export/acceptance/fetchcontractorinfo",
  onValidate: "expaccpt/api/export/acceptance/fetchshipmentdetails",
  onValidateForAwbNoValidation:
    "expaccpt/api/export/acceptance/fetchshipmentsfornoawbvalidation",
  onAddShipment: "expaccpt/api/export/acceptance/onAddShipment",
  onValidateContractor: "expaccpt/api/export/acceptance/validate",
  onSaveCargoDocument: "expaccpt/api/export/acceptance/savecargodocument",
  isFlightExistInCurrentCosys: "expaccpt/api/export/acceptance/isFlightExistInCurrentCosys",
  isFlightExistInCurrentCosysSummary: "expaccpt/api/export/acceptance/isFlightExistInCurrentCosysSummary",
  getFlightDetail: "expaccpt/api/export/acceptance/getFlightDetail",
  onSaveCargoDocumentForNoAwbValidation:
    "expaccpt/api/export/acceptance/savecargodocumentfornoawbvalidation",
  startEFromShipment: "expaccpt/api/export/acceptance/estartfromshipment",
  updateBooking: "expaccpt/api/export/acceptance/updateBooking",
  onCloseFailureData: "expaccpt/api/export/acceptance/onclosefailuredata",
  onStartEAcceptance: "expaccpt/api/export/acceptance/starteacceptance",
  onStartEAcceptanceForNoAwbValidation:
    "expaccpt/api/export/acceptance/starteacceptancefornoawbvalidation",
  onGenerateTag: "expaccpt/api/export/acceptance/generatetag",
  getShcGroup: "expaccpt/api/export/acceptance/getShcGroup",
  onServiceNumber: "expaccpt/api/export/acceptance/fetchallservice",
  onEditEAcceptance: "expaccpt/api/export/acceptance/editshipmentdetails",
  checkAssignedUldTrolleyToFight: "expaccpt/api/warehouse-weighing-uld/search",
  fetchEquipmentReturnRecord:
    "expaccpt/api/warehouse-weighing-uld/searchequipment",
  insertUldWeighRecord: "expaccpt/api/warehouse-weighing-uld/insert",
  onSearchAWB: "expaccpt/api/export/acceptance/fetchweighingcargo",
  onSearchAWBRevised: "expaccpt/api/export/acceptance/fetchweighingcargorevised",
  onSaveWeighing: "expaccpt/api/export/acceptance/saveweighingcargo",
  //onSaveWeighingRevised: "expaccpt/api/export/acceptance/saveweighingcargorevised",
  onGetPartData: "expaccpt/api/export/acceptance/getPartActivateFlag",
  onFetchHouseTags: "expaccpt/api/export/acceptance/gethousetags",
  onSearchEccExpDetails: "expaccpt/api/multiple-ecc-export/search",
  saveAddPlanning: "expaccpt/api/update/ecc-export/plane",
  onPartConfirm: "expaccpt/api/export/acceptance/partconfirm",
  onFinalizeWeight: "expaccpt/api/export/acceptance/finalizeweight",
  volumetricWeightInfo: "expaccpt/api/export/acceptance/volumetricWeightInfo",
  //onFinalizeWeightRevised: "expaccpt/api/export/acceptance/finalizeweightRevised",
  getProportionalWeight: "expaccpt/api/export/acceptance/onChangeWeightAll",
  //getProportionalWeightRevised: "expaccpt/api/export/acceptance/onChangeWeightAllRevised",
  //fetchRuleShipmentExecutionList: "expaccpt/api/export/acceptance/fetchruleshipmentexecutionlist",
  onSaveStartWeighingTime:
    "expaccpt/api/export/acceptance/onsavestartweighingtime",
  onSaveStartWeighingTimeRevised: "expaccpt/api/export/acceptance/onsavestartweighingtimerevised",
  onSaveDelayWeighingTimeRevised: "expaccpt/api/export/acceptance/onsavedelayweighingtimerevised",
  onResumeDelayWeighingTimeRevised: "expaccpt/api/export/acceptance/onresumeweighingtimerevised",
  unfinalizeWeightOfShipment:
    "expaccpt/api/export/acceptance/unfinalizeWeighing",
  //unfinalizeWeightOfShipmentRevised: "expaccpt/api/export/acceptance/unfinalizeWeighingRevised",
  onDelayAcceptance: "expaccpt/api/export/acceptance/delayacceptance",
  onResumeAcceptance: "expaccpt/api/export/acceptance/resumeacceptance",
  eccFinalize: "expaccpt/api/export/acceptance/eccfinalize",
  eccFinalizeRevised: "expaccpt/api/export/acceptance/eccfinalizerevised",
  pullULDBUP: "expaccpt/api/export/acceptance/pulluldbup",
  // AUTOWEIGH BUP STARTS
  fetchPrelodgeDetails:
    "expaccpt/api/acceptance-weighing-bup/fetchPrelodgeDetails    ",
  insertBupAutoWeighDetails:
    "expaccpt/api/acceptance-weighing-bup/insertBupAutoWeighDetails",
  getAutoWeighCapturedUldList:
    "expaccpt/api/acceptance-weighing-bup/getautoweightcaptureduldlist",
  updateFlightDetailsUrl:
    "expaccpt/api/acceptance-weighing-bup/updateFlightDetail",
  printAndUpdateUldTag:
    "expaccpt/api/acceptance-weighing-bup/updateUldtagInformation",
  addMailExportAcceptance: "expaccpt/api/export/acceptance/insertExportData",
  getPAFlight: "expaccpt/api/export/acceptance/getPAFlight",
  fetchAcceptanceDetails:
    "expaccpt/api/export/acceptance/fetchAcceptanceDetails",
  fetchOAcceptanceDetails:
    "expaccpt/api/export/acceptance/fetchOAcceptanceDetails",
  updateNestedId: "expaccpt/api/export/acceptance/updateNestedId",
  getCountryCode: "expaccpt/api/export/acceptance/getCountryCode",
  fetchOuthouseDetails:
    "expaccpt/api/export/acceptance/outhouse/fetchOuthouseDetails",
  addMailOuthouseAcceptance:
    "expaccpt/api/export/acceptance/outhouse/insertData",
  getPAFlightDetails:
    "expaccpt/api/export/acceptance/outhouse/getPAFlightDetails",
  getCountryCodeDetails:
    "expaccpt/api/export/acceptance/outhouse/getCountryCode",
  sendEmail: "expaccpt/api/outhousehandover/triggeremail",
  // bug 5815 popup for mail information update call
  updateWorkingListMailInformation: "expaccpt/api/export/workinglist/updateMailInformation",
  promotecargosearch: "expaccpt/api/export/workinglist/promotecargosearch",
  promotecargosearchAWB: "expaccpt/api/export/workinglist/promotecargosearchAWB",
  // REJECT RETURN SHIPMENT STARTS
  rejectShipment: "expaccpt/api/reject-return-shipment/rejectshipment",
  checkForBlackListCustomer: "expaccpt/api/reject-return-shipment/validateBlacklistedCustomer",
  validateBlackListCustomer: "expaccpt/api/export/acceptance/validateBlacklistedCustomer",
  cancelReturnShipment: "expaccpt/api/reject-return-shipment/cancelreturnshipment",
  returnShipment: "expaccpt/api/reject-return-shipment/returnshipment",
  returnRequestShipment: "expaccpt/api/reject-return-shipment/returnrequestshipment",
  updateRejectReturnShipment: "expaccpt/api/update-reject-return-shipment",
  checkIcCodeValidation: "expaccpt/api/reject-return-shipment/getIcName",
  // ECC Export
  getShipments: "expaccpt/api/ecc/planner-list",
  updateAdvice: "expaccpt/api/ecc/advice",
  updateShipment: "expaccpt/api/ecc/shipment",
  markAsNoShow: "expaccpt/api/ecc/noshow",
  updateShipmentStatus: "expaccpt/api/ecc/update-status",
  getFlightOffPoint: "expaccpt/api/ecc/get-flight-offpoint",
  fetchAwbDetail: "expaccpt/api/ecc/get-awb-details",
  deleteAdviceDetail: "expaccpt/api/ecc/delete-advice",
  editAdvice: "expaccpt/api/ecc/update-advice",
  updateAdviceForNoShow: "expaccpt/api/ecc/advice-for-noshow",
  updateShipmentForNoShow: "expaccpt/api/ecc/shipment-for-noshow",
  checkAcceptance: "expaccpt/api/ecc/check-acceptance",
  addNoFlightDetails: "expaccpt/api/ecc/add-noflight-record",

  dimentionVolume: "expaccpt/api/export/expaccpt/getVolume",
  dimentionVolumetricWeight:
    "expaccpt/api/export/expaccpt/getVolumeWithVolumetricWeight",
  convertedVolumeBasedOnVolumeCode: "expaccpt/api/export/expaccpt/getConvertedVolume",

  // CHECKLIST TEMPLATE
  onSearchChecklist: "expaccpt/checklist/search",
  onSaveChecklist: "expaccpt/checklist/saveChecklist",
  onCopyChecklist: "expaccpt/checklist/saveCopyAirline",
  onSavePageHeader: "expaccpt/checklist/savePageHeader",
  onSavePageFooter: "expaccpt/checklist/savePageFooter",
  onSavePageDetail: "expaccpt/checklist/savePageDetail",
  onDeletePageHeader: "expaccpt/checklist/deletePageHeader",
  onDeletePageDetail: "expaccpt/checklist/deletePageDetail",
  onSearchPageHeader: "expaccpt/checklist/searchPageHeader",
  onSearchPageDetail: "expaccpt/checklist/searchPageDetail",
  onSearchPageFooter: "expaccpt/checklist/searchPageFooter",
  onSavePageParameter: "expaccpt/checklist/savePageParameter",
  onDeleteChecklist: "expaccpt/checklist/deletePageChecklist",
  onSearchPageParameter: "expaccpt/checklist/searchPageParameter",
  onDeletePageParameter: "expaccpt/checklist/deletePageParameter",
  onSaveQuestionnaireWithSubHeadings:
    "expaccpt/checklist/saveQuestionnaireWithSubHeadings",
  onSearchQuestionnaireWithSubHeadings:
    "expaccpt/checklist/searchQuestionnaireWithSubHeadings",
  onSaveQuestionnaireWithoutSubHeadings:
    "expaccpt/checklist/saveQuestionnaireWithoutSubHeadings",
  onSearchQuestionnaireWithoutSubHeadings:
    "expaccpt/checklist/searchQuestionnaireWithoutSubHeadings",
  // CHECKLIST TEMPLATE AS PER SHIPMENT NUMBER
  onSearchFillChecklist: "expaccpt/checklist/getFillChecklist",
  onSearchFillChecklistForEdit: "expaccpt/checklist/getFillChecklistEdit",
  onSaveFillChecklist: "expaccpt/checklist/saveFillingChecklist",
  onSearchQuestionnaire: "expaccpt/checklist/searchFillChecklist",
  onSaveSetupChecklist: "expaccpt/checklist/saveShipmentChecklist",
  onStatusFlagCompleted: "expaccpt/checklist/onStatusFlagCompleted",
  onStatusFlagInProgress: "expaccpt/checklist/onStatusFlagInProgress",
  onSearchSetupChecklist: "expaccpt/checklist/searchShipmentChecklist",
  onSearchChecklistAsPerShipmentNumber:
    "expaccpt/checklist/searchShipmentChecklistAsPerShipmentNumber",
  // CHECKLIST TEMPLATE AS PER SHIPMENT NUMBER
  getTruckdockMonitoringData: "expaccpt/api/acceptance/fetchTruckdockData",
  fetchOuthouseAcceptanceDetails:
    "expaccpt/api/export/acceptance/fetchOuthouseAcceptance",

  // Export Mail Booklist//
  mailBooklistService: "expaccpt/api/expaccpt/mailbooklist/fetch",
  updateBooklistRemarks: "expaccpt/api/expaccpt/mailbooklist/save",
  handoverOuthouseMailbag:
    "expaccpt/api/export/acceptance/handoverOuthouseMailbag",
  // Return Mail Booklist//
  fetchReturnMail: "expaccpt/api/expaccpt/returnmail/fetch",
  validate: "expaccpt/api/expaccpt/returnmail/validate",
  insert: "expaccpt/api/expaccpt/returnmail/insert",
  updatePendingMailBags: "expaccpt/api/expaccpt/returnmail/update",
  // Return Mail Booklist//
  sendForScreening: "expaccpt/api/acas/sendForScreening",
  fetchAddToScreening: "expaccpt/api/rcarScreening/fetchShipments",
  fetchToBeScreenedShipments:
    "expaccpt/api/rcarScreening/fetchShipmentsForScreening",
  insertShipmentToScreening:
    "expaccpt/api/rcarScreening/insertShipmentToScreening",
  insertShipmentsToScreening: "expaccpt/api/rcarScreening/insertShipmentsToScreening",
  updateScreenedShipment: "expaccpt/api/rcarScreening/updateScreenedShipment",
  updateScreeningComplete: "expaccpt/api/rcarScreening/updateScreeningComplete",
  availablePiecesForScreening: "expaccpt/api/rcarScreening/availablePiecesForScreening",
  getScreeningTarget: "expaccpt/api/rcarScreening/getScreeningTarget",
  detainShipments: "expaccpt/api/rcarScreening/detainShipments",
  // Comman Service for Dimension calculation
  getDimension: "expaccpt/api/export/expaccpt/getVolumeWithVolumetricWeight",
  fetchACASShipments: "expaccpt/api/acas/fetchACASShipments",
  undoByPassACASShipment: "expaccpt/api/acas/undoBypassACASShipment",
  byPassACASShipments: "expaccpt/api/acas/bypassACASShipments",
  fetchSCShipments: "expaccpt/api/scawb/fetchSCShipments",
  captureSCShipments: "expaccpt/api/scawb/captureSCShipments",
  getSearchEmbargoMail: "expaccpt/api/export/acceptance/embargomail/search",
  getUpdateEmbargo: "expaccpt/api/export/acceptance/embargomail/update",
  getMssDashboardDetail: "expaccpt/api/expaccpt/searchMssDashboardDetail",
  getFlightDetailsForMssDashboard:
    "expaccpt/api/expaccpt/searchForFlightDetail",
  getMssFlightDetails: "expaccpt/api/expaccpt/getMssFlightDetail",
  getMssFlightDetailsDnata: "expaccpt/api/expaccpt/getFlightDetail",
  getPAFlightDetails1: "",
  getFlightDetailDNATAService: "expaccpt/api/expaccpt/searchForFlightDetailDNATA",
  // get weight service call api
  getWeighingData: "expaccpt/api/warehouse-weighing-uld/getWeightDetails",
  getWeighingScaleData: "expaccpt/api/export/acceptance/fetchWeighingScaleData",
  cancelBooking: "expaccpt/api/export/booking/single-shipment/cancel",
  getVolumeByDensity: "expaccpt/api/export/expaccpt/getVolumByDensity",
  getUldDetails: "expaccpt/api/export/acceptance/ulddetails",
  getSegmentTime: "expaccpt/api/export/booking/single-shipment/getSegmentTime",

  getHandleInSystem: "expaccpt/api/export/booking/single-shipment/getHandleInSystem",
  getVolumetricWeightDetails: "expaccpt/api/export/acceptance/volumetricWeightInfo",
  getVolumetricScannerDetails: "expaccpt/api/export/acceptance/volumetricScannerInfo",
  getVolumetricScannerImageDetails: "expaccpt/api/export/acceptance/getDocInfo",
  // Cancel Book Shipment
  searchCancelBookedShipmentList: "expaccpt/api/cancel-shipment-booking/search",
  bookedShipmentCancel: "expaccpt/api/booked-shipment/cancel",
  reBookShipments: "expaccpt/api/booked-shipment/reBookShipments",
  validateRouteForReBooking: "expaccpt/api/booked-shipment/validateRoute",
  targetCancel: "expaccpt/api/booked-shipment/targettocancel",
  getPSNHistory: "expaccpt/api/acas/getPSNHistory",
  checkIncomingFlightDetails: "expaccpt/api/export/acceptance/incomingFlightDetails",
  // acceptance weighing by house start
  finalize: "expaccpt/api/export/acceptance/finalize",
  unfinalize: 'expaccpt/api/export/acceptance/unfinalize',
  onCalculation: 'expaccpt/api/export/acceptance/calculate',
  saveAcceptanceWeighing: 'expaccpt/api/export/acceptance/save',
  fetchHouseList: 'expaccpt/api/export/acceptance/fetchhouselist',
  unfinalizeHawb: 'expaccpt/api/export/acceptance/unfinalizeHawb',
  refreshHawbList: 'expaccpt/api/export/acceptance/refreshHawbList',
  onFinalizeWeightHouseList: 'expaccpt/api/export/acceptance/finalizeHawbList',
  unfinalizeShipmentHouseList: 'expaccpt/api/export/acceptance/unfinalizeHawbList',
  getHouseSummary: 'expaccpt/api/export/acceptance/getHouseSummary',
  fetchRuleShipmentExecutionListAccptByHouse: 'expaccpt/api/export/acceptance/fetchRuleShipmentExecutionListAccptByHouse',
  fetchRuleShipmentExecutionListExportAwbDocument: 'expaccpt/api/export/acceptance/fetchRuleShipmentExecutionListExportAwbDocument',
  fetchAwbRecord: "expaccpt/api/export/acceptance/fetchAwbRecord",
  onSaveAwbRecord: "expaccpt/api/export/acceptance/onSaveAwbRecord",
  changeAwbNumber: "expaccpt/api/export/acceptance/changeAwbNumber",
  fetchSerialNumberRecord: "expaccpt/api/export/acceptance/fetchSerialNumberRecord",
  finalizeHouse: 'expaccpt/api/export/acceptance/finalizeHawb',
  unfinalizeHouse: 'expaccpt/api/export/acceptance/unfinalizeHouseweight',
  fetchAWBNumber: 'expaccpt/api/export/acceptance/search',
  replaceDummyAWB: 'expaccpt/api/export/acceptance/replacedummyawb',
  generateDummyAWB: 'expaccpt/api/export/acceptance/generateDummyAWB',
  getFlightOffPointWeighing: 'expaccpt/api/export/acceptance/getFlightOffPoint',
  getFlightOffPointSummary: 'expaccpt/api/export/acceptance/getFlightOffPointSummary',

  // acceptance weighing by house end
  // acceptance summary by house starts
  searchSummary: 'expaccpt/api/export/acceptance/searchSummary',
  saveAcceptanceSummary: 'expaccpt/api/export/acceptance/saveSummary',
  deleteSB: 'expaccpt/api/export/acceptance/deleteHouse',
  sendCargoArrivalReport: 'expaccpt/api/export/acceptance/sendcargoarrivalreport',
  sendCargoArrivalReportForAmendment: 'expaccpt/api/export/acceptance/sendcargoarrivalreportforamendment',
  saveDeclaredDimensions: 'expaccpt/api/export/acceptance/savedeclareddimensions',
  cancelHouse: 'expaccpt/api/export/acceptance/cancelhouse',
  acceptanceHouseByMonitoring: 'expaccpt/api/export/acceptance/acceptanceMonitoringByHouse/search',
  finalizeWeight: 'expaccpt/api/export/acceptance/finalizeweight',
  reOpenfinalizeWeight: 'expaccpt/api/export/acceptance/reopenfinalizeweight',
  rejectHouse: 'expaccpt/api/export/acceptance/rejectHouse',
  returnCargo: 'expaccpt/api/export/acceptance/returnCargo',
  cancelReturnCargo: 'expaccpt/api/export/acceptance/cancelReturnCargo',
  cancelReturnCargoWeighing: 'expaccpt/api/export/acceptance/cancelReturnCargoWeighing',
  returnDomesticCargo: 'expaccpt/api/export/acceptance/returnDomesticCargo',
  cancelReturnHouse: 'expaccpt/api/export/acceptance/cancelReturnHouse',
  startHouseWeighing: 'expaccpt/api/export/acceptance/startHouseWeighing',
  // acceptance summary by house ends

  //Export AWB Document

  getExportAwbDocumentResponse: "expaccpt/api/expaccpt/getExportAwbDocument",
  saveExportAwbDocumentResponse: "expaccpt/api/expaccpt/saveExportAwbDocument",
  getEmailInfoResponse: "expaccpt/api/expaccpt/addressdetails",
  getDocumentComplete: "expaccpt/api/expaccpt/documentcomplete",
  getDocumentReOpen: "expaccpt/api/expaccpt/documentreopen",
  //

  //eAWBMonitoring
  fetchEAWBMonitoring: "expaccpt/api/expaccpt/fetchEAWBMonitoring",

  //EFBL
  getEFBLInfo: "expaccpt/api/export/eFBL/searchEFBLInfo",
  flightBUComplete: "expaccpt/api/export/eFBL/flightBUComplete",
  manifestByEFBL: "expaccpt/api/export/eFBL/manifestByEFBL",

  //RCL
  rclSummaryList: "expaccpt/api/acceptance/by/packaging/summary",
  rclRetrieveDetail: "expaccpt/api/acceptance/by/packaging/retrieveDocumentDetails",
  rclExportSearch: "expaccpt/api/acceptance/by/packaging/exportsearch",
  saveRcl: "expaccpt/api/acceptance/by/packaging/save",
  finalizeRcl: "expaccpt/api/acceptance/by/packaging/finalize",
  generateAwbNo: "expaccpt/api/acceptance/by/packaging/generateawb",
  updateChargesOnDocumentComplete: "expaccpt/api/expaccpt/updateCharges",

  //BUPList
  buplist_Awb: "expaccpt/api/acceptance/by/packaging/retriveBUP_Awb",
  buplist_Uld: "expaccpt/api/acceptance/by/packaging/retriveBUP_Uld",
  buplist_Save: "expaccpt/api/acceptance/by/packaging/saveBUP",
  buplist_Delete: "expaccpt/api/acceptance/by/packaging/deleteBUP",

  //ReceiveDocument
  retrieveReceiveDocument: "expaccpt/api/acceptance/by/packaging/receive/document/get",
  saveReceiveDocument: "expaccpt/api/acceptance/by/packaging/receive/document/save",

  validateAndFetchBooking: 'expaccpt/api/acceptance/by/packaging/validateAndFetchBooking',
  generateServiceNumber: 'expaccpt/api/acceptance/by/packaging/getrclnumber',
  voidSearch: 'expaccpt/api/acceptance/by/packaging/retrieveRcl',
  voidRclAndRemoveInventories: 'expaccpt/api/acceptance/by/packaging/voidRclAndRemoveInventories',
  rejectSearchByAWB: 'expaccpt/api/acceptance/by/packaging/retrieveRclForRejectByAWB',
  rejectSearchByULD: 'expaccpt/api/acceptance/by/packaging/retrieveRclForRejectByULD',
  rejectSave: 'expaccpt/api/acceptance/by/packaging/voidRclAndRemoveInventories',
  returnSearchByAWB: 'expaccpt/api/acceptance/by/packaging/retrieveRclForReturnByAWB',
  returnSearchByULD: 'expaccpt/api/acceptance/by/packaging/retrieveRclForReturnByULD',
  returnSave: 'expaccpt/api/acceptance/by/packaging/voidRclAndRemoveInventories',

  // returnCargoList
  retrieveReturnCargoList: 'expaccpt/api/acceptance/by/packaging/retrieveReturnCargolist',
  deleteReturnCargoList: 'expaccpt/api/acceptance/by/packaging/deleteReturnCargoList',

  fetchExportAwbDocumentDetails: 'expaccpt/api/acceptance/by/packaging/awbdocument/search',
  saveExportAwbDocumentDetails: 'expaccpt/api/acceptance/by/packaging/awbdocument/update',
  confirmExportAwbDocumentDetails: 'expaccpt/api/acceptance/by/packaging/awbdocument/confirm',
  unConfirmExportAwbDocumentDetails: 'expaccpt/api/acceptance/by/packaging/awbdocument/unconfirm',
  // return reject void rcl
  get: 'expaccpt/api/acceptance/by/packaging/rejectreturnvoid/get',
  process: 'expaccpt/api/acceptance/by/packaging/rejectreturnvoid/process'



};

/*-----------------------EXPORT BuildUp Module----------------------------*/
export const EXPBU_ENV = {
  serviceBaseURL: "http://10.130.8.9:9160/",
  // Assign ULD starts
  updateuldlistontab: "expbu/api/update-dls/update-uld-list-ontab",
  updateuldlistonSave: "expbu/api/update-dls/update-uld-list-onsave",
  assignULDSearchULDList: "expbu/api/assignUld/search",
  assignULDDeleteULDList: "expbu/api/assignUld/delete",
  assignULDAddULD: "expbu/api/assignUld/add",
  assignULDAddTrolley: "expbu/api/assignUld/addTrolley",
  assignULDUpdateULD: "expbu/api/assignUld/update",
  assignULDUpdateTrolley: "expbu/api/assignUld/updateTrolley",
  getTareWeight: "expbu/api/assignUld/getTareWeight",
  insertInventory: "expbu/api/assignUld/insertInventory",
  saveULDTrolly: "expbu/api/update-dls/update",
  getDgdDetails: "expbu/api/expbu/dgd/getDgRegulations",
  saveDgdDetails: "expbu/api/expbu/dgd/saveDgRegulations",
  deleteDgdDetails: "expbu/api/expbu/dgd/deleteDgRegulations",
  modify: "expbu/api/assignUld/modify",
  searchMyFlight: "expbu/api/export/buildup/flightlist/searchmyflight",
  searchFlightList: "expbu/api/export/buildup/flightlist/search",
  saveFlightList: "expbu/api/export/buildup/flightlist/save",
  searchOsi: "expbu/api/export/buildup/flightlist/searchosi",
  deleteFlight: "expbu/api/export/buildup/flightlist/deleteFlight",
  printUldTagData: "expbu/api/assignUld/printUldTag",

  /*-----------------------Document handling start----------------------------*/
  dummy: "expbu/api/cdh/hello",
  getFlightPouchDetails: "expbu/api/pouch/flightpouchlegs",
  createPouch: "expbu/api/pouch/createPouch",
  deleteDoc: "expbu/api/pouch/deleteDoc",
  saveDiscrepancy: "expbu/api/pouch/saveDiscrepancy",
  deleteDiscrepancy: "expbu/api/pouch/updateDiscrepancy",
  updatepouchpopup: "expbu/api/pouch/updatepouchpopup",
  updateflightpouch: "expbu/api/pouch/updateflightpouch",
  deleteFlightPouch: "expbu/api/pouch/deleteflightpouch",
  addDocAndFinalizeDetails: "expbu/api/pouch/adddocandfinalize",
  addDocument: "expbu/api/pouch/adddocument",
  checkIfDocCanBeVerified: "expbu/api/pouch/checkIfDocCanBeVerified",
  checkNilPouchRequired: "expbu/api/pouch/checkNilPouchRequired",
  verifyDoc: "expbu/api/pouch/verifyDoc",
  finalizeDoc: "expbu/api/pouch/finalizeDoc",
  updatePouchCheckout: "expbu/api/pouch/updatePouchCheckout",
  printpouch: "expbu/api/pouch/printPouch",
  getDocumentMaster: "expbu/api/document/documentmaster",
  updateDocumentMaster: "expbu/api/document/updatedocumentmaster",
  getContainerList: "configuration/api/config/dropdown-data",
  // getDiscrepancy: "expbu/api/pouch/getDiscrepancy",
  dashBoardList: "expbu/api/getDashboardData",
  getDateRangeReport: "expbu/api/getDateRangeReport",
  getFlightReport: "expbu/api/getFlightReport",
  adminConsole: "cdh-services/admincolour",
  updateAdminColour: "cdh-services/updatecolourcode",

  //-----Presorting Screen
  getRegions: "expbu/api/getRegions",
  getPreSortingDetails: "expbu/api/presorting",
  checkAWBExist: "expbu/api/checkAWBExist",
  updateManualLocation: "expbu/api/presorting/updatelocation",

  //-----DocumentView - Search
  getDocumentView: "expbu/api/documentViewDetails",
  //--Update Document View - Search
  getUpdateDocumentView: "expbu/api/documentView/updateDocumentViewDetails",
  //--Update Document View - Update
  updateAWBDocDetails: "expbu/api/documentUpdate/updateAWBDocDetails",
  //--Update Document View - Delete Document-Copy
  deleteDocumentCopy: "expbu/api/documentUpdate/deleteDocumentCopy",
  //--Update Document View - Delete Document-Original
  updateDocumentOrignal: "expbu/api/documentUpdate/updateDocumentOrignal",
  //--Get FlightView Dashboard
  getFlightViewDetails: "expbu/api/getFlightViewDetails",
  updatePHLocation: "expbu/api/updatePHLocation",
  //-- FWB FHL Discrepancy Search
  searchFWBFHLDiscrepancy: "expbu/api/outbound/search-fwb-fhl-discrepancy",

  printAWB: "expbu/api/documentview/printAWB",
  sendMailWhenPouchStatusFinalized:
    "cdh-services/pouch/sendMailWhenPouchStatusFinalized",
  updatepouchlocation: "expbu/pouch/updatepouchlocation",
  getLocationConfigDetails: "expbu/locationconfig/getlocationdetails",
  getLocationConfigEdit: "expbu/locationconfig/geteditlocationdetails",
  SaveLocationConfigEdit: "expbu/locationconfig/savelocationdetails",
  getFlightMappingDetails: "expbu/locationconfig/geteditFlightMappingdetails",
  updateLocation: "expbu/locationconfig/updatelocationName",
  deleteLocationRow: "expbu/locationconfig/deletelocationrow",
  deletePigeonHoleForFlight: "expbu/locationconfig/deletepigeonholeForFlight",
  deleteLocationRecordsForDocument:
    "expbu/locationconfig/deletelocationtypedocument",
  deleteLocationRecordsForFlight:
    "expbu/locationconfig/deletelocationtypeFlight",
  deleteUpdateDocsRow: "expbu/deleteUpdateDocsrow",
  updateDocsRow: "cdh-services/updateDocsrow",
  performLogin: "cdh-services/performLogin",
  saveNewAwbCopyDetails: "expbu/api/documentview/savenewawbcopyno",
  getLoginDetails: "cdh-services/loginidandpassword",
  getColorCodesOnFlightViewPageLoad: "cdh-services/admincolour", // Added By Abhishek : For DashboardTv Page  2/12/2017
  printAWBBarcode: "cdh-services/document/printAWBBarcode",
  checkFlightShouldFinalize: "expbu/api/pouch/checkFlightShouldFinalize",
  /*-----------------------Document Handling end----------------------------*/

  /*-----------------------Display-DLS-Vairance start----------------------------*/
  getFlightInfo: "expbu/api/export/buildup/display-dls-variance/search",
  /*-----------------------Display-DLS-Vairance end------------------------------*/

  /*---------------------handelling regulation for lithium batteries----------------*/
  fetchrlirlmregulation:
    "expbu/api/export/handellingregulation/fetchrlirlmregulation",
  updaterlirlmregulation:
    "expbu/api/export/handellingregulation/updateregulation",
  deleterlirlmregulation:
    "expbu/api/export/handellingregulation/deleterlirlmregulation",
  fetchelielmregulation:
    "expbu/api/export/handellingregulation/fetchelielmregulation",
  updatelieelmregulation:
    "expbu/api/export/handellingregulation/updateelielmregulation",
  deleteelieelmregulation:
    "expbu/api/export/handellingregulation/deleteelielmregulation",
  /*--------------------- end of handelling regulation for lithium batteries----------------*/

  /*-----------------------LoadShipment----------------------------*/
  loadShipmentSearch: "expbu/api/export/buildup/load-shipment/search",
  fetchShipmentByUld: "expbu/api/export/buildup/load-shipment/get-uld-shipment",
  insertLoadShipment:
    "expbu/api/export/buildup/load-shipment/insert-load-shipment",
  updateBuildupEvent:
    "expbu/api/export/buildup/load-shipment/buildup-complete-event",
  updateLoadedWeight:
    "expbu/api/export/buildup/load-shipment/update-loaded-weight",
  getLoadedDataByShipment:
    "expbu/api/export/buildup/load-shipment/get-loaded-weight",
  revisedLoadShipmentSearch: "expbu/api/export/buildup/load-shipment/revisedSearch",
  updateBuildUpCompleteByULD: "expbu/api/export/buildup/load-shipment/buildup-complete-by-uld",
  checkBuildUpCompleteByULD: "expbu/api/export/buildup/load-shipment/check-buildup-complete-by-uld",
  /*-----------------------UnloadShipment----------------------------*/
  fetchFlightDetails: "expbu/api/export/buildup/unload-shipment/fetch",
  fetchShipmentDetails:
    "expbu/api/export/buildup/unload-shipment/fetchShpmtInfo",
  unloadShipment: "expbu/api/export/buildup/unload-shipment/updateShipments",
  unloadWeight: "expbu/api/export/buildup/unload-shipment/unloadWeight",
  getPartSuffixPieceWeight: "expbu/api/export/buildup/unload-shipment/partSuffixDetails",
  /*-----------------------UnloadShipment end----------------------------*/
  /*-----------------------Cargo Manifest Start-----------------*/
  getManifest: "expbu/api/manifest/search",
  checkNilAndCreateManifest: "expbu/api/manifest/checkNilAndCreate",
  createManifest: "expbu/api/manifest/create",
  createSeparateManifest: "expbu/api/manifest/createSeparate",
  deleteSeparateManifest: "expbu/api/manifest/deleteSeparate",
  createSupplementaryManifest: "expbu/api/manifest/createSupplementary",
  reCreateManifest: "expbu/api/manifest/reCreate",
  updateConnectingFlightInfo: "expbu/api/manifest/updateFlightInfo",
  /*-----------------------Cargo Manifest End-----------------*/
  /*------------------------Promote Cargo Starts -------------*/
  promotecargo: "expbu/api/manifest/promotecargo",
  /*------------------------Promote Cargo Ends----------------*/

  /*-------------search operation for airlineLoadingInstructions-----------*/
  searchAirlineLoadingInstructions:
    "expbu/api/airlineloadinstr/searchairlineloadinstr",
  saveAirlineLoadingInstructions: "expbu/api/airlineloadinstr/insert",
  deleteULDType: "expbu/api/airlineloadinstr/deleteuldtype",
  deleteByHeight: "expbu/api/airlineloadinstr/deletebyheight",
  /*---------------------end of airlineloading instructions----------------*/
  /*---------------------Notoc----------------*/
  notocFetchFlight: "expbu/api/notoc/search",
  notocSaveDetail: "expbu/api/notoc/save",
  finalizeDone: "expbu/api/notoc/finalize",
  UnfinalizeDone: "expbu/api/notoc/Unfinalize",

  fetchUpdateDLS: "expbu/api/update-dls/search",
  fetchUpdateDLSList: "expbu/api/update-dls/searchlist",
  getPiggyBackInfo: "expbu/api/update-dls/piggyback",
  saveULD: "expbu/api/update-dls/update-uld",
  saveUldList: "expbu/api/update-dls/update-uld-list",
  saveTrolly: "expbu/api/update-dls/update-trolley",
  saveDLSOSI: "expbu/api/update-dls/updateOsi",
  saveDLSNFM: "expbu/api/update-dls/updateNFM",
  deleteUldTrolly: "expbu/api/update-dls/delete-uld-trolley",
  finalizedDls: "expbu/api/update-dls/finalized-dls",
  sendDls: "expbu/api/update-dls/send-dls",
  fetchWeight: "expbu/api/update-dls/fetch-weight",
  fetchSegForUWS: "expbu/api/update-dls/fetchSegForUws",
  saveSegForUWS: "expbu/api/update-dls/saveSegForUws",

  getDGDDetailsByAwbNumber: "expbu/api/export/dgd/getDgdDetails",
  getOriginAndDestination: "expbu/api/export/dgd/getOriginAndDestination",
  saveDGDDetails: "expbu/api/export/dgd/save",
  saveDGDEliElmDetails: "expbu/api/export/dgd/saveelielm",
  deleteDGDEliElmDetails: "expbu/api/export/dgd/deleteelielm",
  getDGDEliElmDetails: "expbu/api/export/dgd/getelielm",
  getEliElmRemark: "expbu/api/export/dgd/getelielmremark",
  // saveDGDDetails: 'expbu/api/export/dgd/save',
  getShipperDetails: "expbu/api/export/dgd/getShipperOrConsigneeDetails",
  getConsigneeDetails: "expbu/api/export/dgd/getDgdDetails",
  getUnidDetails: "expbu/api/export/dgd/getUnidDetails",
  getSeqNo: "expbu/api/export/dgd/getOverPackSeqNo",
  getRegulationDetails: "expbu/api/expbu/dgd/getUnidDetailsByRegId",

  deleteDgDecDetails: "expbu/api/export/dgd/deleteDgdDetails",
  getTareWeightforULD: "expbu/api/update-dls/getTareWeight",
  /*---------------------Start of Release manifest dls----------------*/
  displayFlightStatus: "expbu/api/releaseManifestDLS/display",
  updateFlightStatus: "expbu/api/releaseManifestDLS/update",
  /*---------------------End of Release manifest dls----------------*/
  /*---------------------Start of Offload----------------*/
  getUldAwb: "expbu/api/export/buildup/offload/search",
  saveUldAwb: "expbu/api/export/buildup/offload/saveoffload",
  getPreoffload: "expbu/api/export/buildup/offload/searchpreoffload",
  saveOffload: "expbu/api/export/buildup/offload/finalizeoffload",
  deletePreOffloadData: "expbu/api/export/buildup/offload/deletePreOffloadData",
  onlyOffload: "expbu/api/export/buildup/offload/onlyoffloaduld",
  savelocations: "expbu/api/export/buildup/offload/savelocations",
  getlocationinfo: "expbu/api/export/buildup/offload/getlocationinfo",
  /*----------------------Amend ULD Start------------*/
  searchAmendUld: "expbu/api/export/amendUld/trolley/search",
  moveToFlight: "expbu/api/export/amendUld/flight/move",
  moveToTrolley: "expbu/api/export/amendUld/trolley/move",
  moveToLoad: "expbu/api/export/amendUld/load/move",
  onmoveCallToFlight: "expbu/api/export/amendUld/load/moveFlight",
  onUnloadAndLoadForAmenFlight:
    "expbu/api/export/amendUld/unloadAndLoad/moveFlight",
  validateRouteForAmendFlight:
    "expbu/api/export/amendUld/unloadAndLoad/validateRoute",
  onUnloadAndLoadForAmendUldTrolley:
    "expbu//api/export/amendUld/unloadAndLoad/moveUldTrolley",
  getTareWeightForAmendUld:
    "expbu/api/export/amendUld/unloadAndLoad/getTareWeight",
  getProportionWeightForAmend:
    "expbu/api/export/amendUld/getProportionWeightForAmend",
  /*-----------------------Ramp Release url's----------------*/
  fetchRampRelease: "expbu/api/ramprelease/fetch",
  deleteRampReleaseUld: "expbu/api/ramprelease/deleteUld",
  saveRampRelease: "expbu/api/ramprelease/save",
  validateDriverIdForRampRelease: "expbu/api/ramprelease/ValidateDriverId",
  /*-----------------------End Ramp Release url's----------------*/
  /*---------------------Start of Offload Handover----------------*/
  searchFlight: "expbu/api/export/buildup/offloadhandover/search",
  fetchShcs: "expbu/api/export/buildup/offloadhandover/fetchshcs",
  insertUlds: "expbu/api/export/buildup/offloadhandover/insert",
  fetchUld: "expbu/api/export/buildup/offloadhandover/fetchreturnuld",
  updateUlds: "expbu/api/export/buildup/offloadhandover/update",
  fetchOffloadCheck: "expbu/api/export/buildup/offloadhandover/fetchulds",
  fetchReturnCheck: "expbu/api/export/buildup/offloadhandover/fetchoffloadulds",
  validateDriverIdForOffloadHandOver: "expbu/api/export/buildup/offloadhandover/validateDriverId",
  /*---------------------End of Offload Handover----------------*/
  /*---------------------Start of Mail Load Shipment----------------*/
  mailFetchFlightDetail:
    "expbu/api/export/buildup/mail-load-shipment/fetch-flight-detail",
  mailInsertLoad:
    "expbu/api/export/buildup/mail-load-shipment/insert-mail-load-shipment",
  checkMailBagNumber:
    "expbu/api/export/buildup/mail-load-shipment/check-mailBag-Number",
  /*---------------------End of Mail Load Shipment----------------*/

  /*----------------------Spcial-Shipment Start------------*/
  specialShipmentSearch: "expbu/api/export/buildup/special-shipment/search",
  /*----------------------Spcial-Shipment End------------*/

  /*----------------------Outgoing Flights Start------------*/
  getOutgoingFlights: "expbu/api/export/outgoingFlights/search",
  getConfigurableTimeForOutgoingFlights:
    "expbu/api/export/outgoingFlights/getConfigurableTime",
  getTelexMessages: "expbu/api/export/outgoingFlights/getTelexMessages",
  /*----------------------Outgoing Flights  End------------*/
  /*-----------------------Through-Transit-Working-Advice starts here----------------------------------*/
  getTTWASearch:
    "expbu/api/export/transhipment/through-transit-working-advice/search",
  insertTTWA:
    "expbu/api/export/transhipment/through-transit-working-advice/insert",
  getIncomingflights:
    "expbu/api/export/transhipment/through-transit-working-advice/get-incoming-flights",
  getContourCodeForTTWorkingAdvice:
    "expbu/api/export/transhipment/through-transit-working-advice/getContourCode",
  deleteFlightPair:
    "expbu/api/export/transhipment/through-transit-working-advice/deleteflightpair",
  validatePreExistingShift: "expbu/api/export/transhipment/through-transit-working-advice/validatepreexistingshift",
  send: "expbu/api/transhipment/sendTTWAApron/send",
  /*-----------------------Through-Transit-Working-Advice ends here----------------------------------*/

  /*-----------------------ULD Summary & Details---------------------------------------------------- */

  fetchUldSummery: "expbu/api/uldsummery/fetch",
  fetchUldDetails: "expbu/api/ulddetails/fetch",
  groupUldTrolley: "expbu/api/ulddetails/group",
  unGroupUldTrolley: "expbu/api/ulddetails/ungroup",
  reprintReleasedUld: "expbu/api/ulddetails/reprint",
  /*-----------------------ULD Summary & Details---------------------------------------------------- */
  /*-----------------------ULD Summary & Details---------------------------------------------------- */

  /*______________________ Outward Service Report Start________________________________*/
  fetchOutwardServiceReport: "expbu/api/outward-service-report/fetchreport",
  insertWarehouseDiscrepancies:
    "expbu/api/outward-service-report/insertwarehousediscrepancies",
  insertManifestDiscrepancies:
    "expbu/api/outward-service-report/insertmanifestdiscrepancies",
  fetchShipmentRecord: "expbu/api/outward-service-report/fetchShipmentRecord",
  updateFinalizeFlag: "expbu/api/outward-service-report/updateFinalizeFlag",

  /*______________________ Outward Service Report End________________________________*/

  /*----------------------MaintainSSPD start------------*/
  searchSSPD: "expbu/api/export/maintainsspd/search",
  saveSSPD: "expbu/api/export/maintainsspd/save",
  searchPartSuffix: "expbu/api/export/maintainsspd/searchPartSuffix",
  /*----------------------MaintainSSPD end------------*/
  getSearchTTWAApron: "expbu/api/transhipment/sendTTWAApron/search",
  getSendTTWAApron: "expbu/api/transhipment/sendTTWAApron/send",
  getSendUpdateTTWAApron: "expbu/api/transhipment/sendTTWAApron/sendUpdate",
  getReSendTTWAApron: "expbu/api/transhipment/sendTTWAApron/reSend",
  getConfiguredAddressesForTTM: "expbu/api/transhipment/sendTTWAApron/getconfiguredaddressesforresend",
  /*----------------------FlightComplete starts here----------*/
  searchFlightCompleteDetails: "expbu/api/expbu/flightComplete/search",
  flightComplete: "expbu/api/expbu/flightComplete/event",
  flightCompleteSendLHMail: "expbu/api/expbu/flightComplete/sendLHMail",
  onKESendPldMail: "expbu/api/expbu/flightComplete/sendPLDMail",
  flightCompleteResendMessages: "expbu/api/expbu/flightComplete/resendMessages",
  searchLyingList: "expbu/api/export/buildup/lyingList/searchLyingList",
  updateLocationforLyingList:
    "expbu/api/export/buildup/lyingList/updateLocation",
  checkFlightAssignmentforLyingList: "expbu/api/export/buildup/lyingList/checkFlightAssignment",
  checkContainerDestinationforLyingList: "expbu/api/export/buildup/lyingList/checkContainerDestination",
  checkForDifferentCarrierAssignment: "expbu/api/export/buildup/lyingList/checkForDifferentCarrierAssignment",
  bookShipmentInfo: "expbu/api/export/buildup/lyingList/bookShipmentInfo",
  moveToFreightOut: "expbu/api/export/buildup/lyingList/freightOut",
  fetchawbdata: "expbu/api/expbu/ecsd/fetchrecord",
  saveEcsdData: "expbu/api/expbu/ecsd/saverecords",

  /*---------Transshipment Monitoring and Handling-------------*/
  searchTranshipmentMonitoringSummary:
    "expbu/api/transhipmentmonitoring/search",
  fetchInboundFlightListForOutboundFlights:
    "expbu/api/transhipmentmonitoring/getOutboundTranshipmentWorkingList",
  fetchOutboundFlightListForInboundFlights:
    "expbu/api/transhipmentmonitoring/getInboundTranshipmentWorkingList",
  loadShipmentToFlights:
    "expbu/api/transhipmentmonitoring/loadShipmentToFlights",
  unloadShipmentToFlights:
    "expbu/api/transhipmentmonitoring/unloadShipmentToFlights",
  shipmentByfinalized:
    "expbu/api/transhipmentmonitoring/finalizeTranshipmentWorkingListByShipment",
  loadShipment: "expbu/api/transhipmentmonitoring/loadShipment",
  getUldDetails: "expbu/api/transhipmentmonitoring/getUldDetails",
  finalizeTransshipment:
    "expbu/api/transhipmentmonitoring/finalizeTranshipmentWorkingList",
  unfinalizeTransshipment:
    "expbu/api/transhipmentmonitoring/unfinalizeTranshipmentWorkingList",
  sendAdviceTranshipmentWorkingList: "expbu/api/transhipmentmonitoring/sendAdviceTranshipmentWorkingList",
  savecn46mailbag: "expbu/api/shipment/mailbagoffload/savecn46",
  mailbagoffload: "expbu/api/shipment/mailbagoffload/get",
  searchShortTransitSummary: "expbu/api/transhipmentmonitoring/searchShortTransit",
  searchInboundFlightTranshipment: "expbu/api/transhipment/inboundflight/get",
  saveInboundFlightTranshipment: "expbu/api/transhipment/inboundflight/pair",
  // aead/acas
  saveAedAcasData: "expbu/api/bypassinfo/saveaeadacasdata",

  //Export Mail Manifest//
  fetchExportMailManifest: "expbu/api/expbu/exportmailmanifest/fetch",
  updateNestedIdMailManifest: "expbu/api/expbu/exportmailmanifest/update",
  exportFlightComplete: "expbu/api/expbu/exportmailmanifest/event",
  exportManifestComplete: "expbu/api/expbu/exportmailmanifest/manifestComplete",
  exportMailTransferToCN46: "expbu/api/expbu/exportmailmanifest/transferToCN46",
  exportDeleteMail: "expbu/api/expbu/exportmailmanifest/delete",
  updateRemarks: "expbu/api/expbu/exportmailmanifest/updateRemarks",
  //Export Mail Manifest//

  // Special Cargo Request/Handover//
  specialCargoRequestSearch: "expbu/api/export/buildup/special-cargo/requestSearch",
  specialCargoHandoverSearch: "expbu/api/export/buildup/special-cargo/handoverSearch",
  specialCargoHandoverUserProfileFetch: "expbu/api/export/buildup/special-cargo/handoverUserProfile",
  deleteSpecialCargoRequest: "expbu/api/export/buildup/special-cargo/handoverReqDelete",
  saveSpecialCargoRequestList: "expbu/api/export/buildup/specialCargo/saveRequest",
  saveSpecialCargoHandover: "expbu/api/export/buildup/specialCargo/saveHandover",
  validateFlight: "expbu/api/export/buildup/specialCargo/valiateFlight",
  deleteSpecialCargoHandover: "expbu/api/export/buildup/specialCargo/handoverDelete",
  calculatePropotionalWeightforHandover: "expbu/api/export/buildup/specialCargo/calculatePropotionalWeightforHandover",
  fetchHOPhotoSetup: "expbu/api/export/buildup/specialCargo/fetchHOPhotoSetup",
  fetchMonitoringList: "expbu/api/export/buildup/special-cargo/fetchMonitoringList",
  updatePhotoForHandoverLoc: "expbu/api/export/buildup/specialCargo/updatePhotoForHandoverLoc",
  fetchPhotoForDocId: "expbu/api/export/buildup/specialCargo/fetchPhotoForDocId",

  // Special Cargo Request/Handover//
  processDNATATransfer: "expbu/api/export/buildup/lyingList/processDNATATransfer",
  sendFBR: "expbu/api/export/outgoingFlights/sendFBR",
  // Rebuild Cargo Advice//
  getRebuildCargoAdvice: "expbu/api/export/rebuild_cargo_advice/fetchRebuildCargoAdvice",
  setRebuildCargoAdvice: "expbu/api/export/rebuild_cargo_advice/insertRebuildCargoAdvice",
  deleteRebuildCargoAdvice: "expbu/api/export/rebuild_cargo_advice/deleteRebuildCargoAdvice",
  // Approve Rebuild Cargo Advice//
  getApproveRebuildCargoAdvice: "expbu/api/export/approve_rebuild_cargo_advice/fetchApproveRebuildCargoAdvice",
  setApproveRebuildCargoAdvice: "expbu/api/export/approve_rebuild_cargo_advice/updateApproveRebuildCargoAdvice",

  //Premanifest
  getPreManifestDetails: "expbu/api/export/premanifest/getPreManifestDetails",
  savePreManifestDetails: "expbu/api/export/premanifest/savePreManifestDetails",
  fetchPmanAwbDetails: "expbu/api/export/premanifest/fetchAwbDetails",
  fetchPmanUldDetails: "expbu/api/export/premanifest/fetchUldDetails",
  deletePmanDtls: "expbu/api/export/premanifest/deletePmanDtls",

  //WeightLoadStmt
  fetchWlsDLSList: "expbu/api/weight-load-stmt/search",
  saveWlsDLSList: "expbu/api/weight-load-stmt/update",
  finalizeOrUnfinalizeWls: "expbu/api/weight-load-stmt/finalizeOrUnfinalize",

  //Request Dollies BT Info
  getRequestDolliesBTInfo: "expbu/api/ramp/requestdolliesbt/get",
  saveRequestDolliesBTInfo: "expbu/api/ramp/requestdolliesbt/save",
  confirmRequestDolliesBTInfo: "expbu/api/ramp/requestdolliesbt/confirm",
  sendNotification: "expbu/api/ramp/requestdolliesbt/sendnotification",

  //Save OffloadRemarks- Offload ULD AWB
  saveOffloadRemarks: "expbu/api/export/buildup/offload/saveOffloadRemarks",

  //Save manifest remark
  saveManifestRMK: "expbu/api/manifest/saveManifestRemark"
};

/*-----------------------MASTER Module----------------------------*/
export const MST_ENV = {
  serviceBaseURL: "http://localhost:9130/",
  serviceAgentURL: "http://10.130.8.4:8080/",
  uldSeriesURL: "configuration/api/config/airlineMaster/uldSeries",
  uldSeriesSearchURL: "configuration/api/config/airlineMaster/searchUldSeries",
  uldSeriesUpdateURL: "configuration/api/config/airlineMaster/updateUldSeries",
  addUldSeriesURL: "configuration/api/config/airlineMaster/insertUldSeries",
  deleteUldSeriesURL: "configuration/api/config/airlineMaster/deleteUldSeries",
  carrierCodeAddURL: "configuration/api/config/airlineMaster/insertCarrier",
  carrierCodeUpdateURL: "configuration/api/config/airlineMaster/updateCarrier",
  deleteCarrierCodeURL: "configuration/api/config/airlineMaster/deleteCarrier",
  awbPrefixURL: "configuration/api/config/airlineMaster/prefixListDropDown",
  mastersListBaseURLHeader:
    "configuration/api/config/maintainMaster/singleMasterHeader",
  mastersListBaseURL:
    "configuration/api/config/maintainMaster/singleMasterList",
  fetchMastersListBaseURL:
    "configuration/api/config/maintainMaster/masterDetail",
  fetchSystemParameterListBaseURL:
    "configuration/api/config/Search/in/systemParam/systemParamList",
  fetchSystemParameterListByNameBaseURL:
    "configuration/api/config/Search/in/systemParam/",
  updateSystemParameterBaseURL:
    "configuration/api/config/system/param/updateSysListValues/",
  searchMasters: "configuration/api/config/maintainMaster/searchMasterDetail",
  insertMasters: "configuration/api/config/maintainMaster/saveMasterDetail",
  updateMasters: "configuration/api/config/maintainMaster/updateMasterDetail",
  deleteMasters: "configuration/api/config/maintainMaster/deleteMasterDetail",

  masterShcDetails: "configuration/api/masters/shc/masterShcDetails",
  searchMaintainShcDetails: "configuration/api/masters/shc/searchMaintainShc/",
  edithMaintainShcDetails: "configuration/api/masters/shc/editMasterShc",
  saveMaintainShcDetails: "configuration/api/masters/shc/saveMasterShcDetails",
  searchShcCodeDesc: "configuration/api/masters/shc/searchShcCodeDesc",
  updateShcDetails: "configuration/api/masters/shc/updateMasterShcDetails",
  deleteShcDetails: "configuration/api/masters/shc/deleteMasterShcDetails",
  editColoadableShcData: "configuration/api/masters/shc/editColoadableShc/",
  updateShcColoadableDetails:
    "configuration/api/masters/shc/updateColoadableShcDetails",
  deleteShcColoadableShcData: "configuration/api/masters/shc/deleteShc",

  /* Maintain Code Administartion */
  mastersCodeAdminDropdownDataTableURL:
    "configuration/api/config/dropdown-datatable",
  mastersCodeAdminInsertURL:
    "configuration/api/config/maintainCodeAdministration/insert",
  mastersCodeAdminDeleteURL:
    "configuration/api/config/MaintainCodeAdministration/delete",
  mastersCodeAdminUpdateURL:
    "configuration/api/config/MaintainCodeAdministration/update",

  /* ULD Type */
  uldTypeSaveDetails: "configuration/api/config/airlineMaster/insertUldType",
  uldTypeUpdateDetails: "configuration/api/config/airlineMaster/updateUldType",
  getUldTypeListDetails: "configuration/api/config/airlineMaster/fetchUldType",
  uldTypeSearchDetails: "configuration/api/config/airlineMaster/searchUldType",
  deleteUldTypeDetails: "configuration/api/config/airlineMaster/deleteUldType",
  aircraftTypeSaveDetails:
    "configuration/api/config/airlineMaster/aircraftType",
  deleteAircraftType:
    "configuration/api/config/airlineMaster/deletAircraftType",
  editAircraftType: "configuration/api/config/airlineMaster/editAircraftType",
  /* carrier code */
  getCarrierCodeListDetails:
    "configuration/api/config/airlineMaster/fetchCarrier",
  searchCarrierCodeListDetails:
    "configuration/api/config/airlineMaster/searchCarrier",
  carrierCodeUpdateDetails:
    "configuration/api/config/airlineMaster/updateCarrier",
  updateAwbPrefixListURL: "configuration/api/config/airlineMaster/updateprefix",
  addAwbPrefixListURL: "configuration/api/config/airlineMaster/insertprefix",
  deleteAwbPrefixListURL: "configuration/api/config/airlineMaster/deleteprefix",
  /* MAINTAIN MASTERS */
  saveWindowData:
    "configuration/api/config/maintainMaster/saveAssociatedMasterData",
  associatedmasterDetail:
    "configuration/api/config/maintainMaster/associatedmasterDetail",

  // TermAndCondition

  searchList:
    "expimpextapi/api/expimpextapi/termandcondition/termandconditionsearch",
  updateList:
    "expimpextapi/api/expimpextapi/termandcondition/termandconditionsearch/update",
  maintainList: "expimpextapi/api/expimpextapi/termandcondition/maintain",
  saveAirlinePlasticList:
    "configuration/api/config/airlineMaster/saveAirlinePlastic",

  updatePlasticSheet:
    "configuration/api/config/airlineMaster/updateAirlinePlastic",

  searchAirlineList:
    "configuration/api/config/airlineMaster/fetchAirlinePlastic",
  deletePlasticSheets:
    "configuration/api/config/airlineMaster/deleteAirlinePlastic",
  // Broadcast message

  messageData: "expimpextapi/api/expimpextapi/broadcastmessage/save",
  fetchbroadcastData:
    "expimpextapi/api/expimpextapi/broadcastmessage/fetchrecords",

  deletebroadcastData: "expimpextapi/api/expimpextapi/broadcastmessage/delete",

  //Auto Kc Target CR
  createAutoKCConfig: "expimpextapi/api/export/autoKCTarget/insertAutoKCTargetConfiguration",
  fetchAutoKCConfig: "expimpextapi/api/export/autoKCTarget/fetchAutoKCTargetConfiguration",
  fetchAutoKCMonitoringList: "expimpextapi/api/export/autoKCTarget/fetchAutoKCMonitoringList",
  // CIQ CONFIGURATION SLA //
  searchSLAConfiguration: "configuration/ciq/search",
  saveSLAConfiguration: "configuration/ciq/saveCIQSLA",
  getEmailConfiguration: "configuration/ciq/searchEmailNotification",
  saveEmailConfiguration: "configuration/ciq/saveCIQSLAEmailNotification",
  // SAVE SETUP PART BOOKING //
  savePartBooking: "configuration/api/config/airlineMaster/savePartBooking",


  /* Maintain Code Administartion Revamp Screen */
  fetchSelectData: "configuration/api/config/MaintainCodeAdministration/fetchSelectData",
  fetchSelectDataCode: "configuration/api/config/MaintainCodeAdministration/fetchSelectDataCode",
  fetchSelectDataDetails: "configuration/api/config/MaintainCodeAdministration/fetchSelectDataDetails",
  onSaveCodeAdministration: "configuration/api/config/MaintainCodeAdministration/onSaveCodeAdministration",
  onSaveCodeAdministrationCode: "configuration/api/config/MaintainCodeAdministration/onSaveCodeAdministrationCode",
  onSaveCodeAdministrationDetails: "configuration/api/config/MaintainCodeAdministration/onSaveCodeAdministrationDetails",
  insertAuditInfo: "expimpextapi/api/expimpextapi/broadcastmessage/insertIntoAuditTable",
  fetchbroadcastNData: "expimpextapi/api/expimpextapi/broadcastmessage/fetchrecordsforAgentPortal",
  fetchSummaryOfEpouch: "expimpextapi/api/agent/pouch/fetchSummaryOfEpouch",
  // BlackList AWB Screen
  searchBlackListAWB: "configuration/api/config/airlineMaster/searchBlackListAWB",
  saveAddedRangeForBlackListAWB: "configuration/api/config/airlineMaster/saveAddedRangeForBlackListAWB",
  deleteRangeForBlackListAWB: "configuration/api/config/airlineMaster/deleteRangeForBlackListAWB",
  deleteGroupCodeURL: "configuration/api/config/MaintainCodeAdministration/delete/code/admingroup",
  deleteSubGroupCodeURL: "configuration/api/config/MaintainCodeAdministration/delete/subgroup",
  /* Maintain Code Administartion Revamp Screen */
  fetchBuBdOfficeDetails: "configuration/api/config/airlineMaster/fetchBuBdOfficeDetails",
  saveBuBdDetails: "configuration/api/config/airlineMaster/saveBuBdOfficeDetails"
};
/*-----------------------ULD Module----------------------------*/
export const ULD_ENV = {
  serviceBaseURL: "http://10.130.8.4:8080/",
  stockLevelUrl: "uld/api/uldstock/retreive",
  inventorySearchUrl: "uld/api/uld/inventory/search",
  inventoryDetailsSearchUrl: "uld/api/uld/inventorydetails/search",
  enquiryLSPByLocationSearchUrl: "uld/api/uld/enquiryLSPByLocation/search",
  serviceErrorLogSearchUrl: "uld/api/uld/serviceerrorlog/search",
  saveServiceErrorLogInfo: "uld/api/uld/serviceerrorlog/save",
  transferCreateUrl: "uld/api/uld/transfer/createUldTransfer",
  tempratureySearchUrl: "uld/api/uld/temperature/search",
  tempratureyAddUrl: "uld/api/uld/temperature/add",
  tempratureyDeleteUrl: "uld/api/uld/temperature/delete",
  /*  ULD IN OUT movement history */
  getMovementHistory: "uld/api/uld/movementhistory/getMovementHistory",
  /*  ULD in movement */
  searchInOutMovementUld: "uld/api/uld/movement/searchInOutMovementUld",
  finduldUrl: "uld/api/uld/movement/in/finduld/",
  createuldUrl: "uld/api/uld/movement/in/createuld",
  createrepairUrl: "uld/api/uld/movement/in/createrepair",
  returnfromagentUrl: "uld/api/uld/movement/in/returnfromagent",
  updatefoundcargoUrl: "uld/api/uld/movement/in/updatefoundcargo",
  updatefoundapronUrl: "uld//api/uld/movement/in/updatefoundapron",
  createinflightUrl: "uld/api/uld/movement/in/createinflight",
  checkDuplicateInMovement: "uld/api/uld/movement/checkduplicateinmovement",
  checkAssignFlightForInFlight: "uld/api/uld/movement/assignflightforinflight",
  checkDulicateInFlightMovement:
    "uld/api/uld/movement/checkduplicateinflightmovement",
  /* ULD out movement */
  createOutrepairUrl: "uld/api/uld/movement/out/createOutrepair",
  updatemissingcargoUrl: "uld/api/uld/movement/out/updatemissingcargo",
  updatemissingapronUrl: "uld/api/uld/movement/out/updatemissingapron",
  createoutflightUrl: "uld/api/uld/movement/out/createoutflight",
  deleteuldUrl: "uld/api/uld/movement/out/deleteuld",
  senttoagentUrl: "uld/api/uld/movement/in/senttoagent",
  releasedtootherghaUrl: "uld/api/uld/movement/out/releasedtoothergha",
  flightdetailsUrl: "uld/api/uld/movement/in/flightdetails",
  editULDUrl: "uld/api/uld/movement/editULD/",
  checkDuplicateOutMovementForDeleteUld:
    "uld/api/uld/movement/checkduplicateoutmovementfordelete",
  assignFlight: "uld/api/uld/movement/assignflight",
  checkDulicateOutFlightMovement:
    "uld/api/uld/movement/checkduplicateoutmovementforflight",
  checkDuplicateOutMovement: "uld/api/uld/movement/checkduplicateoutmovement",
  /* Uld Movement Condition */
  movementCondition: "uld/api/uld/movement/condition",
  /* ULD Transfer */
  fetchULDTransferDetailsUrl: "uld/api/uld/transfer/fetch",
  generateRecieptNumberUrl: "uld/api/uld/transfer/generateReceipt",
  createUldTransferUrl: "uld/api/uld/transfer/create",
  uldValidationUrl: "uld/api/uld/transfer/validateUld",
  finalizeTransferUrl: "uld/api/uld/transfer/finalize",
  updateTransferUrl: "uld/api/uld/transfer/update",
  deleteTransferUrl: "uld/api/uld/transfer/delete",
  getHandlingCarrierCode: "uld/api/uld/transfer/getHandlingCarrierCode",
  /* ULD Stock Check */
  uldStocksStatusFetchUrl: "uld/api/uld/stockcheck/uldstockcheckstatus",
  fetchSightedUldsUrl: "uld/api/uld/stockcheck/fetchsighteduld",
  fetchUnsightedUldsUrl: "uld/api/uld/stockcheck/fetchunsighteduld",
  fetchStockConsolidationUrl: "uld/api/uld/stockcheck/stockconsolidation",
  confirmSightedServiceUrl: "uld/api/uld/stockcheck/unsighteduldassighted",
  confirmMissingServiceUrl: "uld/api/uld/stockcheck/unsightedmissinguld",
  confirmDeleteServiceUrl: "uld/api/uld/stockcheck/deletedunsighteduld",
  osiRemarkUrl: "uld/api/uld/stockcheck/osiremarks",
  confirmReconcilCargoUrl: "uld/api/uld/stockcheck/reconcilecargo",
  confirmReconcilApronUrl: "uld/api/uld/stockcheck/reconcileapron",
  confirmCompletCargoUrl: "uld/api/uld/stockcheck/completecargo",
  confirmCompletApronUrl: "uld/api/uld/stockcheck/completeapron",
  confrimScmCargoUrl: "uld/api/uld/stockcheck/scmcargo",
  confrimScmApronUrl: "uld/api/uld/stockcheck/scmapron",
  confirmScmCargoApronBothUrl: "uld/api/uld/stockcheck/scmcargoapronboth",
  getUldEnquire: "uld/api/uld/enquire/get",
  getUserType: "uld/api/uld/enquire/getuserdetails",
  releaseBT: "uld/api/uld/enquire/releaseBT",
  fetchPhotoForDocId: "uld/api/uld/enquire/fetchPhotoForDocId",
  //maintainEIC
  maintainEicFetch: "uld/api/impbd/maintainEic/Info",
  DismantleUld: "uld/api/impbd/maintainEic/dismantleUld",
  addUldMaintainEic: "uld/api/impbd/maintainEic/add",
  saveMaintainEic: "uld/api/impbd/maintainEic/save",
  //getULDLSPdetails
  getULDLSPDetails: "uld/api/uldlsp/get",
  updateULDLSPRetrieveDate: "uld/api/uldlsp/updateRetrieveDate",
  searchUcmUld: "uld/api/uld/ucm/search",
  checkUldExistance: "uld/api/uld/ucm/checkuldexistance",
  createUcmUld: "uld/api/uld/ucm/ucmUldCreate",
  ucmUldIn: "uld/api/uld/ucm/ucmUldIn",
  ucmUldout: "uld/api/uld/ucm/ucmUldOut",
  ucmUldBoth: "uld/api/uld/ucm/ucmUldBoth",
  deleteUcmUld: "uld/api/uld/ucm/deleteUcmUld",
  isUldExistInMasterTable: "uld/api/uld/ucm/ucmUldBoth/isUldExistInMasterTable",
  /* END ULD Stock Check */
  /* Start Of Movement location Types */
  setMovementLocationTypes: "uld/setMovementLocationTypes",
  getMovementLocationTypes: "uld/getMovementLocationTypes",
  getUldSeriesTypes: "uld/getUldSeriesTypes",
  setUldSeriesTypes: "uld/setUldSeriesTypes",
  sightednuldassighted: "uld/api/uld/stockcheck/sightednuldassighted",
  getosiRemarkUrl: "uld/api/uld/stockcheck/getosiremarks",
  delosiRemarkUrl: "uld/api/uld/stockcheck/delosiremarks",
  getUldstatusFlag: "uld/api/uld/stockcheck/getuldstatusflag",
  getUldinfo: "uld/api/uld/stockcheck/getorcreateuldmob",
  saveulddata: "uld/api/uld/stockcheck/saveulddata",
  geticsulddata: "uld/api/uld/stockcheck/geticsulddetails",
  restartSCMCycle: "uld/api/uld/stockcheck/restartSCMCycle",
  deltransferosiRemarkUrl: "uld/api/uld/transfer/deltranserremark",
  /* End of Movement location Types */
  /* ULD Allotment : Starts */
  searchUldAllotment: "uld/api/uld/allotment/get/getUldAllotment",
  saveUldAllotment: "uld/api/uld/allotment/saveUldAllotment",
  saveUldAllotmentGroup: "uld/api/uld/allotment/saveUldAllotmentGroup",
  deleteUldAllotment: "uld/api/uld/allotment/deleteUldAllotment",
  /* ULD Allotment : Ends */
  /* Global Inventory Allotment : Starts */
  getGlobalUldStockCheckRequest: "uld/globalULDStockCheck",
  /* Global Inventory Allotment : Ends */
  /* Global ULD Tracking :Starts */
  getUldTrackingRequest: "uld/api/uld/globalUldTracking/get/getUldTracking",
  /* Global ULD Tracking :End*/
  /* Global ULD Characteristics : Starts */
  saveGlobalUldCharacteristic: "uld/api/uld/globalUldCharacteristic/save",
  getGlobalUldCharacteristicsDetails: "uld/api/uld/globalUldCharacteristic/search",
  deleteGlobalUldCharacteristicsDetails: "uld/api/uld/globalUldCharacteristic/delete",
  /* Global ULD Characteristics : Ends */
  /* Maintain Global Uld Inventory List : starts*/
  getGlobalUldInventoryList: "uld/api/uld/getGlobalUldInventoryList",
  deleteGlobalInventoryList: "uld/api/uld/deleteGlobalInventoryList",
  saveGlobalInventoryList: "uld/api/uld/saveGlobalInventoryList"
  /* Maintain Global Uld Inventory List : ends*/
};
/*-----------------------AWB Management Module----------------------------*/
export const AWB_ENV = {
  serviceBaseURL: "http://10.130.8.9:9250/",
  getFwbFhlFsuMessageList: 'shpmng/api/shipmentinfo/fetchMessageInfo',
  getCnFlightId: "",
  printNAWBCopy: "shpmng/api/shipment/nawb/printNawb",
  searchIrregularity: "shpmng/api/shipment/irregularity/search",
  addIrregularity: "shpmng/api/shipment/irregularity/add",
  saveIrregularity: "shpmng/api/shipment/irregularity/save",
  deleteIrregularity: "shpmng/api/shipment/irregularity/delete",
  irregularityHAWBList: 'shpmng/api/shipment/irregularityHAWBList/search',
  irregularityHAWBAdd: 'shpmng/api/shipment/irregularityHAWBList/add',
  irregularityHAWBUpdate: 'shpmng/api/shipment/irregularityHAWBList/update',
  irregularityHAWBDelete: 'shpmng/api/shipment/irregularityHAWBList/delete',
  searchamdbpieceweight: 'shpmng/api/shipment/irregularity/searchamdbpieceweight',
  getShipmentNumber: "shpmng/api/shipment/reuse/search",
  getAllShipmentNumber: "shpmng/api/shipment/reuse/searchAll",
  addShipmentNumber: "shpmng/api/shipment/reuse/add",
  deleteShipmentNumber: "shpmng/api/shipment/reuse/delete",
  getShipmentOnHoldDetails: "shpmng/api/shipment/shipmentonhold/fetch",
  updateShipmentOnHoldDetails: "shpmng/api/shipment/shipmentonhold/hold",
  generateCTOcase: "shpmng/api/shipment/shipmentonhold/generateCTOcase",
  searchAWBFromStockList: "shpmng/api/shipment/nawb/search-awb-from-stock",
  updateInProcessForAwbNumber: "shpmng/api/shipment/nawb/update-inprocess-status",
  shipmentRemarksFetch: "shpmng/api/shipment/remark/get",
  shipmentRemarksInsert: "shpmng/api/shipment/remark/insert",
  shipmentRemarksDelete: "shpmng/api/shipment/remark/delete",
  saveNawb: "shpmng/api/shipment/nawb/create-nawb",
  searchNawb: "shpmng/api/shipment/nawb/search-nawb-by-awbnumber",
  saveNeutralAWB: "shpmng/api/shipment/nawb/save",
  fetchChargeList: "shpmng/api/shipment/nawb/checkShipmentCharges",
  searchSIDListByCriteria: "shpmng/api/shipment/nawb/search-sid",
  searchSIDDetails: "shpmng/api/shipment/nawb/search-sid-by-id",
  searchAgentInfo: 'shpmng/api/shipment/nawb/agentInfo',
  issueNAWB: "shpmng/api/shipment/nawb/issue-nawb",
  searchShipLocation: "shpmng/api/shipment/maintainShipLoc/search",
  updateMergedShipLocation: "shpmng/api/shipment/maintainShipLoc/merge",
  insertsplittedShipLocation: "shpmng/api/shipment/maintainShipLoc/split",
  insertAddedShipLocation: "shpmng/api/shipment/maintainShipLoc/update",
  deleteInventory: "shpmng/api/shipment/maintainShipLoc/delete",
  getInventoryHouse: "shpmng/api/shipment/inventory/getInventoryHouse",
  createInventoryHouse: "shpmng/api/shipment/inventory/createInventoryHouse",
  isHandledByHouse: "shpmng/api/shipmentinfo/isShipmentHandledByHouse",
  gethouseInformation: "shpmng/api/shipmentinfo/getHouseInfo",
  changeHandlingMasterOrHouse: "shpmng/api/shipment/awb/changeHandling",
  fhllogDetails: "shpmng/api/shipment/awb/fhllog",
  getFwbDataValidationDetails: "shpmng/api/fwb/datavalidation/search",
  fwbConfirm: "shpmng/api/fwb/datavalidation/confirm",
  fwbReject: "shpmng/api/fwb/datavalidation/reject",
  fwbRejectAndSave: "shpmng/api/fwb/datavalidation/rejectAndSend",
  saveCheckBoxes: "shpmng/api/fwb/datavalidation/save",

  checkHandledByHouse: "shpmng/api/shipment/awb/changeHandling",

  // Stock management starts
  addAWBStock: "shpmng/api/stockmanagment/neutralawb/add/awbstock",
  fetchAWBStockStatus:
    "shpmng/api/stockmanagment/neutralawb/select/awbstocksummarystatus",
  fetchAWBStockSummary:
    "shpmng/api/stockmanagment/neutralawb/select/list/awbstocksummary",
  updateLowStockLimit:
    "shpmng/api/stockmanagment/neutralawb/update/lowstocklimit",
  fetchLowStockLimit:
    "shpmng/api/stockmanagment/neutralawb/fetch/lowStockLimit",
  updateNewStockLimit:
    "shpmng/api/stockmanagment/neutralawb/update/updateNewStockLimit",
  markDelete: "shpmng/api/stockmanagment/neutralawb/update/markDelete",
  // Stock management ends

  // awb reservation starts here
  getNextAwbNumberForReservation:
    "shpmng/api/stockmanagment/awbReservation/search/nextawbNumber",
  saveAwbReservation: "shpmng/api/stockmanagment/awbReservation/save",
  fetchAwbReservationDetails:
    "shpmng/api/stockmanagment/awbReservation/searchAwbReservationDetails",
  //awb rservation end here

  // Awb Documents
  checkValidFlightNotCancelled: "shpmng/api/shpmng/awb/checkvalidflightnotcancelled",
  fetchAwbDocumentDetails: "shpmng/api/shpmng/awb/get",
  saveAWBDocumentDetails: "shpmng/api/shpmng/awb/save",
  updateShipmentType: "shpmng/api/shpmng/awb/update/shipmentType",
  fetchAWBRoutingDetails: "shpmng/api/shpmng/awb/routing",
  fetchAcceptanceInfo: "shpmng/api/shpmng/awb/getAcceptanceInfo",
  emailInfo: "shpmng/api/shpmng/awb/getEmailInfo",
  getAllAppointedAgents: "shpmng/api/shpmng/awb/getAllAppointedAgents",
  getFWBConsigneeInfo: "shpmng/api/shpmng/awb/getFWBConsigneeInfo",
  getFWBConsigneeAgentInfoOnSelect:
    "shpmng/api/shpmng/awb/getFWBConsigneeAgentInfoOnSelect",
  getExchangeRate: "shpmng/api/shpmng/awb/getExchangeRate",

  // shipment information starts
  getShipmentInformation: "shpmng/api/shipmentinfo/getShipmentInfo",
  printAWBBarcode: "shpmng/api/shipmentinfo/printAWBBarcode",
  senddocs: "shpmng/api/shipmentinfo/senddocs",
  cancelshipmentfromSI: "shpmng/api/shipmentinfo/cancelshipment",
  getFWBLogDetails: "shpmng/api/shpmng/getFwbLogDetails",
  getFHLLogDetails: "shpmng/api/shipment/fhl/log/enquire",
  // shipment information ends

  // maintain House starts
  getMasterAirWayBillModel: "shpmng/api/shipment/house/getMawbInfo",
  saveHouseModel: "shpmng/api/shipment/house/saveHouse",
  searchHAWB: "shpmng/api/shipment/house/getHouse",
  deleteHAWB: "shpmng/api/shipment/house/deleteHouse",
  onDeleteMaster: "shpmng/api/shipment/house/deleteHouse",
  shipperAndconsigneeInfoForFirstHouse: "shpmng/api/shipment/house/getShipperAndconsigneeInfoForFirstHouse",
  getMaintainHouseCaptureDamage: "shpmng/api/shipment/damage/getMaintainHouseCaptureDamage",
  createMaintainHouseCaptureDamage: "shpmng/api/shipment/damage/createMaintainHouseCaptureDamage",
  // maintain House ends
  // updateHouseModel:'/api/shipment/house/'
  // maintain House ends
  createCn46Request: "shpmng/api/shipment/mail/cn46Request",
  searchCN46: "shpmng/api/shipment/mail/searchCN46Details",
  updateHouseModel: "shpmng/api/shipment/house/updateHouse",
  temperatureLogEntryModel: "shpmng/api/shipment/temperature/get",
  temperatureLogEntryModelSave: "shpmng/api/shipment/temperature/save",
  temperatureLogEntryModelDelete: "shpmng/api/shipment/temperature/delete",
  //ULD Temp Log
  UldtemperatureLogEntryModel: "shpmng/api/shipment/temperature/getULDMobile",
  UldtemperatureLogEntryModelForDelete: "shpmng/api/shipment/temperature/deleteULDMobile",
  UldTempLogEntrySaveList: "shpmng/api/shipment/temperature/saveULD",
  coolportShipmentMonitoring: "shpmng/api/shipment/cooolportmonitoring/get",
  coolportShipmentMonitoringUpdate:
    "shpmng/api/shipment/cooolportmonitoring/update",
  // incativeOrOldCargoList
  getInactiveOrOldCargoo: "shpmng/api/shipment/inactive/getlist",
  moveToFreightOut: "shpmng/api/shipment/freightout",
  defalultCreationDays: "shpmng/api/shipment/defaultCreationDays",

  // mailbag overview start
  getMailbagOverviewList: "shpmng/api/mailbaginfo/getmailbaglist",
  mailBagUpdateLocation: "shpmng/api/mailbaginfo/updateLocation",
  getAllStatusOfMailBag: "shpmng/api/mailbaginfo/getAllStatusOfTheMailBag",
  checkForContentCode: "shpmng/api/mailbaginfo/checkForContentCode",
  checkForShcsOtherThanMail: "shpmng/api/mailbaginfo/checkForShcsOtherThanMail",
  checkForContainerDestination: "shpmng/api/mailbaginfo/checkForContainerDestination",
  // mailbag overview end

  // Change of AWB or HAWB start
  changeAWBNumber: "shpmng/api/shipment/updateawbhawb/updateawb",
  changeHAWBNumber: "shpmng/api/shipment/updateawbhawb/updatehawb",
  // Change of AWB or HAWB end

  //terminal to terminal handover api
  getDtlsOfShpAtTrml: "shpmng/api/shpmng/getDetailsOfShipmentFromTerminal",
  transferShipmentToTerminal: "shpmng/api/shpmng/transferShipmentToTerminal",
  getDetailsOfShipmentToTerminal:
    "shpmng/api/shpmng/getDetailsOfShipmentToTerminal",
  //capture damage start
  isHandleByHouse: "shpmng/api/shipment/damage/isShipmentHandledByHouse",
  saveDamagePhoto: "shpmng/api/shipment/damage/upload",
  saveDamage: "shpmng/api/shipment/damage/save",
  deleteDamageInfo: "shpmng/api/shipment/damage/delete",
  fetchDamage: "shpmng/api/shipment/damage/fetch",
  fetchManifestFlightDetails:
    "shpmng/api/shipment/damage/fetch/manifestflightdetails",
  sendEmails: "shpmng/api/shipment/damage/send-email",
  sendEmailWithUploadedDoc:
    "shpmng/api/shipment/capturePhoto/sendEmailWithUploadedDoc",
  sendEmailForDamageWithUploadedDoc: "shpmng/api/shipment/captureDamage/sendDamageEmailWithUploadedDoc",
  reviveShipmentInfo: "shpmng/api/shipment/reviveShipment/get",
  onRevive: "shpmng/api/shipment/reviveShipment/onrevive",
  purgeShipment: "shpmng/api/shipmentinfo/purgeShipment",
  //capture damage ends

  retiveInboundFlightDetailsForPartSuffix: "shpmng/api/shipment/maintainShipLoc/getInboundDetailsForPartsuffix",
  //Hold Shipment Notify changes start
  holdShipmentNotifySearch: "shpmng/api/shipment/holdshipmentnotifygroup/fetch",
  updateHoldNotifyShipments: "shpmng/api/shipment/holdshipmentnotifygroup/updatehold",
  updateHoldNotifyGroup: "shpmng/api/shipment/holdnotifygroup/updateholdnotifygroup",
  updateAck: "shpmng/api/shipment/holdnotifygroup/updateack",
  //Hold Shipment Notify changes start

  /*-----------------Delete HWB------------------------------*/
  deleteHouseWayBill: "shpmng/api/shipment/deleteHouse/deleteHouseWayBill",
  /*-----------------Delete HWB ends------------------------------*/


  //HOUSE WAY MASTER
  getHouseWayBillMaster: "shpmng/api/shipment/house/getHouseWayBillMaster",
  setHouseWayBillMaster: "shpmng/api/shipment/house/setHouseWayBillMaster",
  isShipmentHandledByHouse: "shpmng/api/shipment/maintainShipLoc/isShipmentHandledByHouse",
  // HOUSE WAY BILL LIST

  onSaveHouse: "shpmng/api/shipment/house/onSaveHouseNumber",
  getHouseWayBillList: "shpmng/api/shipment/house/getHouseWayBillList",
  onSaveCustomerinformation: "shpmng/api/shipment/house/onSaveCustomerinformation",
  getConsigneeShipperDetails: "shpmng/api/shipment/house/getConsigneeShipperDetails",
  onSaveCustomerinformationList: "shpmng/api/shipment/house/onSaveCustomerinformationList",
  dimentionVolumetricWeight:
    "shpmng/api/shipment/house/getVolumeWithVolumetricWeight",

  editHouseDimension:
    "shpmng/api/shipment/house/editHouseDimension",
  //DimensionPopup  
  saveDimensionInformation: "shpmng/api/shipmentinfo/saveDimensionInformation",
  updateCloseUnclose: "shpmng/api/shipmentinfo/updateClosedOn",
  getDimensionInformation: "shpmng/api/shipmentinfo/getDimensionInformation",

};
/*--------------------VALUBLE CARGO Management Module---------------------*/
export const VAL_ENV = {
  serviceBaseURL: "http://10.130.8.4:8080/",
  saveCaptureIncomingRequest: "valmng/api/val/incomingrequestadvice/save",
  searchCaptureIncomingRequest: "valmng/api/val/incomingrequestadvice/search",
  saveCheckInDiplomat: "valmng/api/val/checkin/save",
  searchCheckInDiplomat: "valmng/api/val/checkin/search",
  searchEnquireShipment: "valmng/api/val/enquire/search",
  searchInboundShipment: "valmng/api/val/inboundshipmentmonitoring/search",
  searchOutboundShipment: "valmng/api/val/ouboundshipmentmonitoring/search",
  saveCheckInShipment: "valmng/api/val/ouboundshipmentmonitoring/init",
  searchEnquireShipmentCheckout: "valmng/api/val/enquire/searchCheckOut",
  searchinventory: "valmng/api/inventorycheck/searchInventory",
  handovershipment: "valmng/api/inventorycheck/handovershipment",
  searchdetailinventory: "valmng/api/inventorycheck/searchInventoryDetails",
  notfoundshipmnt: "valmng/api/inventorycheck/notfoundshipment",
  closediscrepency: "valmng/api/inventorycheck/closediscrepancy",
  complete: "valmng/api/inventorycheck/complete",
  onpurgerecord: "valmng/api/inventorycheck/onpurge",
  fetchsystemparam:
    "configuration/api/config/Search/in/systemParam/VAL_INBOUND",
  fetchInboundFromDate: "valmng/api/val/inboundshipmentmonitoring/init",
  fetchInventoryFromDate: "valmng/api/val/inventorytmonitoring/init"
};
/*-----------------------ADMIN Management Module----------------------------*/
export const ADM_ENV = {
  serviceBaseURL: 'http://10.130.8.6:9100/',//"http://10.130.8.4:8235/",,// ,
  /*Starting of URLS related to LOGIN OF A USER*/
  validateUserLogin: "admin/userLogin/search",
  changePassword: "admin/userLogin/changePassword",
  onChangePasswordSave: "admin/userLogin/onChangePasswordSave",
  updateUserDetailsWithChangedPassword:
    "admin/api/admin/user/update-user-with-changed-password",
  /*End of URLS related to LOGIN OF A USER*/
  /*Start URLS related to User Roles*/
  createRole: "admin/api/admin/role/create-role",
  updateRole: "admin/api/admin/role/update-role",
  deleteRole: "admin/api/admin/role/delete-role",
  searchRole: "admin/api/admin/role/search-role",
  accessControlList: "admin/security/access-control-list",
  fetchRoleFunctions: "admin/api/admin/role/search-assign-role-function",
  updateScreenFunction:
    "admin/api/admin/role/update-screen-function-assignment",
  createScreenFunction:
    "admin/api/admin/role/create-screen-function-assignment",
  deleteSubModule: "admin/api/admin/role/delete-submodule",
  fetchUpdateRole: "admin/api/admin/role/getrole",
  saveScreenAssignments: "admin/api/admin/role/update-screen-assignments",
  /*End of URLS related to User Roles*/
  getCompaniesLOV: "admin/api/admin/staff/searchcompanieslov",
  getRolesLov: "admin/api/admin/staff/searchdutycodeslov",
  searchUserDetailsByCriteria: "admin/api/admin/user/search-user",
  saveUser: "admin/api/admin/user/create-user",
  updateUser: "admin/api/admin/user/update-user",
  deleteUser: "admin/api/admin/user/delete-user",
  deleteRoleAssignments: "admin/api/admin/user/delete-user-role-assignment",
  /*start of urls related to blacklisting of customer and authorized Personnel */
  searchBlackListCustomer: "admin/api/admin/blkcustauth/fetchblacklistcustomer",
  updateBlackListCustomer:
    "admin/api/admin/blkcustauth/updateblacklistcustomer",
  removeBlackListCustomer:
    "admin/api/admin/blkcustauth/removeblacklistcustomer",
  searchAuthorizedPersonnel:
    "admin/api/admin/blkcustauth/fetchauthorizedpersonnel",
  updateAuthorizedPersonnel:
    "admin/api/admin/blkcustauth/updateauthorizedpersonnel",
  removeAuthorizedPersonnel:
    "admin/api/admin/blkcustauth/removeauthorizedPersonnel",
  /*end of urls related to blacklisting of customer and authorized Personnel */
  searchRcarAgentGroup: "admin/api/admin/rcar/searchRcarAgentGroup",
  updateRcarAgentGroup: "admin/api/admin/rcar/updateRcarAgentGroup",
  addRcarAgentGroup: "admin/api/admin/rcar/addRcarAgentGroup",
  deleteRcarAgentGroup: "admin/api/admin/rcar/deleteRcarAgentGroup",
  fetchAllAgentGroup: "admin/api/admin/rcar/fetchAllRcarAgentGroup",
  searchRcarNumber: "admin/api/admin/rcar/searchRcarNumber",
  fetchAllRcarNumber: "admin/api/admin/rcar/fetchAllRcarNumber",
  updateRcarNumber: "admin/api/admin/rcar/updateRcarNumber",
  addRcarNumber: "admin/api/admin/rcar/addRcarNumber",
  searchCustomerCode: "admin/api/admin/changeofcustomercode/search",
  saveCustomerCode: "admin/api/admin/changeofcustomercode/save",
  /*Registration Request List Return*/
  fetchRegReqList: "admin/api/admin/customer/searchrequestlist",
  saveRegReq: "admin/api/admin/customer/saverequest",
  rejectReqStatus: "admin/api/admin/customer/saverejection",
  /*Start of URLS related to Customer List by Appointed Agents*/
  getCustomerList: "admin/api/admin/customerlist/searchCustomer",
  getCustomerListDetail: "admin/api/admin/searchcutomer/fetch",
  transferCustomer: "admin/api/admin/customerlist/transferCustomer",
  searchTransferList: "admin/api/admin/customerlist/searchTransferCustomer",
  /*End of URLS related to Customer List by Appointed Agents*/
  // Start of URLS of Maintain authorized Personnel
  checkForBlacklistedCustomer:
    "admin/api/config/usermangement/checkForBlacklistedCustomer",
  insertUpdateAuthorizedPersonnel:
    "admin/api/config/usermangement/insertUpdateAuthorizedPersonnel",
  searchAuthorizedPersonnelByName:
    "admin/api/config/usermangement/searchAuthorizedPersonnel",
  deleteAuthorizedPersonnelRow:
    "admin/api/config/usermangement/deleteAuthorizedPersonnel",
  validateAuthorizedPersonName:
    "admin/api/config/usermangement/validateAuthorizedPersonName",
  fetchDuplicateAirportPass:
    "admin/api/config/usermangement/fetchDuplicateAirportPass",
  // End  of URLS of Maintain authorized Personnel

  getAgentLocList: "admin/api/admin/Agent/searchagentloclist",
  addAgentLoc: "admin/api/admin/Agent/addLoc",
  deleteAgentLoc: "admin/api/admin/Agent/deleteLoc",
  /*starts of urls related to create team */
  createteam: "admin/api/admin/teamcreation/insertteam",
  fetchteam: "admin/api/admin/teamcreation/fetchteam",
  updateteam: "admin/api/admin/teamcreation/updateteam",
  deleteteam: "admin/api/admin/teamcreation/deleteteam",
  deletewholeteam: "admin/api/admin/teamcreation/deletewholeteam",
  /*End of URLS related to create team*/

  /* OVERSEAS CONSIGNEE */
  onSearchConsignee: "admin/customer/overseasconsignee/search",
  onSaveConsignee: "admin/customer/overseasconsignee/save",
  /* OVERSEAS CONSIGNEE */

  /* MAINTAIN CUSTOMER MASTER */
  onSearchCustomerId: "admin/customer/master/search",
  onSaveCustomer: "admin/customer/master/save",
  getSubuserList: "admin/customer/subuser/search",
  onSaveAppointedAgent: "admin/customer/master/saveAppointedAgent",
  onDeregisterAppointedAgent: "admin/customer/master/deregister",
  onSaveAlias: "admin/customer/master/saveAliasDetails",
  onSearchLuc: "admin/customer/master/searchLucAgent",
  onSaveLuc: "admin/customer/master/saveLucDetails",
  onSaveEct: "admin/customer/master/saveEctDetails",
  onSaveTruckDetails: "admin/customer/master/saveTruckDetails",
  /* MAINTAIN CUSTOMER MASTER */

  onSearchAudit: "admin/api/audit/fetchaudit",
  searchExistingRole: "admin/api/admin/role/search-existing-role",
  searchForVehicleRequestList: "admin/api/vehiclePermitRequest/search",
  sendRejectionEmail: "admin/api/vehiclePermitRequest/sendRejectionEmail",
  sendApprovalEmail: "admin/api/vehiclePermitRequest/sendApprovalEmail",
  forgotPassword: "admin/userLogin/forgotPassword",
  copyUser: "admin/api/admin/user/copyUser",
  copyUser1: "admin/api/admin/user/copyUser1",
  fetchSubModuleByRoleCode: "admin/api/admin/role/fetch-submodule-by-rolecode",
  /* FETCH CUSTOMER RELATED AGENTS AND AWBS ON CLICK OF COMPANY DE_RESGISTER BUTTON  */
  fetchCustomerRelatedAgentsAndawbs: "admin/customer/master/fetchCustomerRelatedAgentsAndawbs",
  /* Start - Audit Changes   */
  onSearchAWBAudit: "admin/api/audit/searchByAWB",
  onSearchULDTrolleyAudit: "admin/api/audit/searchByULDTrolley",
  onSearchAgentAudit: "admin/api/audit/searchByAgent",
  onSearchBillingAudit: "admin/api/audit/searchByBilling",
  onSearchEFacilitationAudit: "admin/api/audit/searchByEFacilitation",
  onSearchEquipmentAudit: "admin/api/audit/searchByEquipment",
  getAuditTrailByFlight: "admin/api/audit/searchByFlight",
  getAuditTrailByLocation: "admin/api/audit/searchByLocation",
  getAuditTrailByCustoms: "admin/api/audit/searchByCustoms",
  getAuditTrailByCustomer: "admin/api/audit/searchByCustomer",
  getAuditTrailByTracing: "admin/api/audit/searchByTracing",
  getAuditTrailByMasters: "admin/api/audit/searchByMasters",
  onSearchMailBagAudit: "admin/api/audit/searchByMailBag",
  getAuditTrailByUserRole: "admin/api/audit/searchByUserProfile",
  getAuditTrailByCDH: "admin/api/audit/searchByCDH",
  getAuditTrailByVAL: "admin/api/audit/searchByVAL"
  /* End - Audit Changes  */
};
/*--------------------Import Delivery Module---------------------*/
export const IMPDLV_ENV = {
  serviceBaseURL: "http://10.130.8.4:8080/",
  onSearchURL: "http://10.130.8.4:8080/",
  getArivalCargoCollection: 'impdlv/api/getArivalCargoCollection',

  saveUpdateArivalCargoCollection: 'impdlv/api/saveUpdate/ArivalCargoCollection',
  sendMailForArivalCargoCollection: 'impdlv/api/sendMail/ArivalCargoCollection',

  getDeliveryList: "impdlv/api/impdlv/delivery/searchList",
  saveHandOverDetails: "impdlv/api/impdlv/delivery/handOver",
  getTeams: "impdlv/api/impdlv/delivery/getTeams",
  getEO: "impdlv/api/impdlv/delivery/getEO",
  onSearchEccInbound: "impbd/api/ecc/worksheetplanning/search",
  fetchSysParam: "configuration/api/config/Search/in/systemParam/ECC_NO_SHOW",
  onSaveEccInbound: "impbd/api/ecc/worksheetplanning/save",
  onSaveByFlight: "impbd/api/ecc/worksheetplanning/savebyflight",
  onSearchFlight: "expimpextapi/api/ecc/inboundprebookinglist/searchflight",
  onDelete: "impbd/api/ecc/worksheetplanning/delete",

  getAllUndeliveredShipment: "impdlv/api/impdlv/undelivered/getUndeliShipment",
  getAwbNotificationInfo: "impbd/api/awbinfo/getAwbNotificationInfo",
  getDisplayPo: "impdlv/api/impdlv/displaypo/search",
  getDeliveryDo: "impdlv/api/impdlv/delivery/search",
  getShipmentInfo: "impdlv/get",
  saveShipmentInfo: "impdlv/create",
  saveMultipleShipmentInfo: "impdlv/createGroupPoRequest",
  saveIsseSRF: "impdlv/createIsseSrf",
  getShipmentInf: "impdlv/api/impdlv/displaypo/getPickOrder",
  getDeliveryInfo: "impdlv/api/shipment/delivery/get",
  onSaveIssueDo: "impdlv/api/shipment/delivery/create",
  checkForBlackListCustomer: "impdlv/api/shipment/delivery/validateForBlackListedCustomer",
  validateBlackListCustomer: "impdlv/api/awbrelasefrom/validateForBlacklistedCustomer",
  getIssueGroupDo: "impdlv/api/shipment/delivery/getIssueGroupDo",
  createGroupShipmentInfo: "impdlv/api/shipment/delivery/createIssueGroupDo",
  cancelDelivery: "impdlv/api/impdlv/delivery/cancel",
  getPoMonitoring: "impdlv/api/shipment/delivery/monitoring/search",
  getShipmentEsrfApproval: "impdlv/api/ShipmentesrfApproval/search",
  getEsrfApproveStatus: "impdlv/api/ShipmentesrfApproval/Approve",
  getEsrfRejectedStatus: "impdlv/api/ShipmentesrfApproval/Reject",
  getEsrfApprovelPaymentStatus: "impdlv/api/ShipmentesrfApproval/getPaymentStatus",
  getSrfMonitoring: "impdlv/api/SrfMonitoring/search",
  cancelDeliveryRequest: "impdlv/api/shipment/delivery/monitoring/cancel",
  extendIssueSrf: "impdlv/api/impdlv/delivery/extendIssueSrf",
  cancelPostSrf: "impdlv/api/impdlv/delivery/cancelPostSrf",
  changePriority: "impdlv/api/shipment/delivery/monitoring/changePriority",
  cancelWorkOrder: "impdlv/api/shipment/delivery/monitoring/cancelWorkOrder",
  forceComplete: "impdlv/api/shipment/delivery/monitoring/forceComplete",
  interrupt: "impdlv/api/shipment/delivery/monitoring/interrupt",
  resume: "impdlv/api/shipment/delivery/monitoring/resume",
  fetchEquipment: "impdlv/api/shipment/delivery/fetchEquipment",
  getMultiShipmentInfo: "impdlv/api/multiple/shipment/delivery/get",
  createMultiShipmentInfo: "impdlv/api/multiple/shipment/delivery/create",
  getCustomExaminationInfo: "impdlv/api/shipment/customOrderExamination/get",
  onSaveCustomOrder: "impdlv/api/shipment/customOrderExamination/create",

  /*----------------------- * AWB ReleaseForm Started * -------------------*/
  getAwbRelasefromList: "impdlv/api/awbrelasefrom/search",
  saveOrupdateAwbReleaseFormList: "impdlv/api/awbrelasefrom/create",
  awbReleaseFormList: "impdlv/api/awbrelasefrom/release",
  validateIcNumber: "impdlv/api/awbrelasefrom/validateicnumber",
  /*----------------------- * AWB ReleaseForm end * -------------------*/

  getAwbNotificationDetails:
    "impdlv/api/impdlv/awbNotification/getAwbNotification",
  sendAwbNotificationDetails:
    "impdlv/api/impdlv/awbNotification/sendAwbNotification",
  validateAirportPass: "impdlv/api/shipment/delivery/validateAirportPass",
  resendAWBNotification: "impdlv/api/impdlv/awbNotification/resendAwbNotification",
  validatePOAirportPass: "impdlv/validateAirportPass",
  printPO: "impdlv/api/impdlv/displaypo/printpo",
  printDO: "impdlv/api/impdlv/delivery/printdo",
  validateIANumber: "impdlv/validateIANumber",
  validateDOIANumber: "impdlv/api/shipment/delivery/validateIANumber",
  validateAgentIcNumber: "impdlv/api/multiple/shipment/delivery/validateAgentIcNumber",
  checkPaymentStatus: "impdlv/checkPaymentStatus",
  checkPaymentStatusIssueSrf: "impdlv/checkPaymentStatusIssueSrf",
  cancelPaymentRequest: "impdlv/cancelPaymentRequest",
  sendDateForUncollectedFreightout: "impdlv/api/shipment/delivery/unCollectedFreightout",
  generateUncollectedFreightoutNotification: "impdlv/api/shipment/delivery/saveUncollectedFreightoutNotification",
  customShipmentInspectionFetch: "impdlv/api/impdlv/importdelivery/shipmentinspection",
  getCustomsImportShipmentList: "impdlv/api/impdlv/delivery/getCustomsImportShipmentList",
  fetchCustomImportShpManualReq: "impdlv/api/impdlv/delivery/customsImportShipmentManualSearch",
  customsImportShipmentManualStatusUpdate: "impdlv/api/impdlv/delivery/customsImportShipmentManualStatusUpdate",
  onManualUpdateCustomImportShipment: "impdlv/api/impdlv/delivery/onManualUpdateCustomImportShipment",
  fetchScheduleCollectionList: "impdlv/api/impdlv/onFetchScheduleCollectionList",
  generateSchCollNo: "impdlv/api/impdlv/generateSchCollNo"
};

export const TRACING_ENV = {
  serviceBaseURL: "http://10.130.8.4:8080/",
  saveAssigneeTeamGp: "tracing/api/tracing/createGroup",
  getGroupList: "tracing/api/tracing/getGroupList",
  deleteBasedOnTeamID: "tracing/api/tracing/daleteGroup",
  checkTeamID: "tracing/api/tracing/checkTeamAvailability",
  checkAirportAvailability: "tracing/api/tracing/checkAirportAvailability",

  onSearchRfid: 'tracker/import/tag/getTag',
  onSearchByTagId: 'tracker/tag/getTagHistoryByTagId',
  onReprint: 'tracker/tag/reprint',
  onPrint: 'tracker/tag/createTag',
  deleteTag: 'tracker/tag/deleteTag',
  updateTag: 'tracker/tag/updateTag',
  cancelTag: 'tracker/tag/cancelTag',
  addTag: 'tracker/tag/addTag',
  // MANAGE RFID

  getCargoSurveyNo: "tracing/api/cargoSurvey/getCargoSurveyNumber",
  validateBlacklistedCustomer: "tracing/api/cargoSurvey/validateBlacklistedCustomer",
  createCargoSurvey: "tracing/api/conductCargoSurvey/createConductSurvey",
  updateCargoSurvey: "tracing/api/conductCargoSurvey/updateSurvey",
  sendReportMail: "tracing/api/conductCargoSurvey/sendReportMail",
  getSurveyBy: "tracing/api/conductCargoSurvey/getSurveyBy",
  getShipment: "tracing/api/conductCargoSurvey/getShipment",
  cancelConductSurvey: "tracing/api/conductCargoSurvey/cancelConductSurvey",
  finalizeConductSurvey: "tracing/api/conductCargoSurvey/finalizeConductSurvey",
  validatingItems: "tracing/api/conductCargoSurvey/validatingItems",
  getPackingDetails: "tracing/api/conductCargoSurvey/getPackingDetails",
  deleteRaiseShipmentPacking:
    "tracing/api/conductCargoSurvey/deleteRaiseShipmentPacking",
  getMaintainCustAuthList:
    "tracing/api/conductCargoSurvey/getMaintainCustAuthList",
  getUserProfileList: "tracing/api/conductCargoSurvey/getUserProfileList",
  getFlight: "tracing/api/conductCargoSurvey/getFlight",

  getsurveylist: "tracing/api/getSurveyDetails/groupList",
  getAbandonedCargoList: "tracing/api/getabandonedcargo/groupList",
  getShimentLocationList: "tracing/api/getShimentLocation/groupList",
  getTracingActivityList: "tracing/api/gettracingactivityList/groupList",
  disposeAbandonCargo: "tracing/api/disoseabandoncargo/list",
  moveToImportAbandonCargo: "tracing/api/moveabandoncargo/list",

  displayTracingRecords: "tracing/api/tracing/getTracingRecords",
  getTypeOFLoggedInUser: "tracing/api/tracing/getusertype",
  getTracingActivities: "tracing/api/tracing/maintainTracingActivity/fetch",
  saveTracingActivity: "tracing/api/tracing/createTracingActivity",
  restoreTracingRecord: "tracing/api/tracing/restoreTracingRecord",
  getTracingActivitiesShipmentData: "tracing/api/tracing/getshipmentdata",
  getTracingNumberOnCreate: "tracing/api/tracing/getTracingNumberOnCreate",
  validateAirportPass: "tracing/api/cargoSurvey/validateAirportPass",
  sendReportMailmain: "tracing/api/getSurveyDetails/sendReportMailMain",
  //  ||||||||||||||||| GENERATE TRACING REPORT ||||||||||||||||||||

  searchData: "tracing/api/tracing/generatetracingreport",
  updateData: "tracing/api/tracing/updatetracingreport",

  //  ||||||||||||||||| GENERATE TRACING REPORT ||||||||||||||||||||
  // ||||||||||||||||||||| NETWORK ULD TRACKING ||||||||||||||||||||
  networkUldTrackingRecords: "tracing/api/tracing/fetchNetworkUldTrackingDetails",
  // ||||||||||||||||||||| NETWORK AWB TRACKING ||||||||||||||||||||
  networkAWBTrackingRecords: "tracing/api/tracing/fetchNetworkAWBTrackingDetails",
  //||||||||||||||||||TRACING Email |||||||||||||||||||
  getTracingEmailInfo: "tracing/api/tracing/getEMailinfo",
  sendTracingMail: "tracing/api/tracing/sendMail",
  onPrintRfid: "tracker/tag/createUldTag",
  unFinalizeConductSurvey: "tracing/api/conductCargoSurvey/unFinalizeConductSurvey"
};

export const WH_ENV = {
  serviceBaseURL: "http://10.130.8.6:9330/",
  movableStorageLocationURL: "warehouse/api/whConfiguration/maintainMovableLocationTypes",
  fetchWareHouseLocations: "warehouse/api/whConfiguration/fetch",
  fetchWareHouseTerminal: "warehouse/api/whConfiguration/fetchTerminal",
  fetchSector: "warehouse/api/whConfiguration/fetchSector",
  updateSectors: "warehouse/api/whConfiguration/updateSectors",
  updateParentSectors: "warehouse/api/whConfiguration/updateParentSectors",
  addLocations: "warehouse/api/whConfiguration/addLocations",
  fetchHandlingConstraints:
    "warehouse/api/whConfiguration/fetchHandlingConstraints",
  modifyHandlingConstraintsArea:
    "warehouse/api/whConfiguration/modifyHandlingConstraintsArea",
  modifyHandlingConstraints:
    "warehouse/api/whConfiguration/modifyHandlingConstraints",
  fetchSectorLocationsByType:
    "warehouse/api/whConfiguration/fetchSectorLocationsByType",
  fetchHandlingConstraintDetails:
    "warehouse/api/whConfiguration/fetchHandlingConstraintDetails",
  fetchTruckDocksSector: "warehouse/api/whConfiguration/fetchTruckDocksSector",
  modifyTruckDocksSector:
    "warehouse/api/whConfiguration/modifyTruckDocksSector",
  fetchWhsLocationDeviceMapping:
    "warehouse/api/whConfiguration/fetchWhsLocationDeviceMapping",
  modifyWhsLocationDeviceMapping:
    "warehouse/api/whConfiguration/modifyWhsLocationDeviceMapping",
  fetchHandlingConstraint:
    "warehouse/api/whConfiguration/fetchHandlingConstraint",
  updateLocationFlags: "warehouse/api/whConfiguration/updateLocationFlags",
  updateZoneCodes: "warehouse/api/whConfiguration/updateZoneCodes",
  updateTemperatureRange:
    "warehouse/api/whConfiguration/updateTemperatureRange",
  deleteHandlingConstraint:
    "warehouse/api/whConfiguration/deleteHandlingConstraint",
  fetchShipmentListByLocation:
    "warehouse/api/whConfiguration/fetchShipmentListByLocation",
  fetchWarehouseInventoryList:
    "warehouse/api/whConfiguration/fetchWarehouseInventoryList",
  updateLocation: "warehouse/api/whConfiguration/updateInventoryLocation",
  markAsUtl: "warehouse/api/whConfiguration/markAsUtl",
  closeInventoryCheckStatus:
    "warehouse/api/whConfiguration/closeInventoryCheckStatus",
  getAllocatedWorkStation:
    "warehouse/api/whConfiguration/getAllocatedWorkStation",
  modifyAllocatedWorkStation:
    "warehouse/api/whConfiguration/modifyAllocatedWorkStation",
  // CARGO PROCESSING ENGINE //
  saveSetupProcessArea:
    "warehouse/masters/cargo-processing-engine/setup/save-processArea",
  getSetupProcessArea:
    "warehouse/masters/cargo-processing-engine/setup/select-processArea",
  saveSetupTriggerPoints:
    "warehouse/masters/cargo-processing-engine/setup/save-triggerPoints",
  onSearchTriggerPoints:
    "warehouse/masters/cargo-processing-engine/setup/select-triggerPoints",
  saveOperationalMessage:
    "warehouse/masters/cargo-processing-engine/setup/save-operational-message",
  onSearchOperationalMessages:
    "warehouse/masters/cargo-processing-engine/setup/select-operational-message",
  saveAssociateProcessArea:
    "warehouse/masters/cargo-processing-engine/setup/save-associate-processArea-triggerPoints",
  onSearchAssociateProcessArea:
    "warehouse/masters/cargo-processing-engine/setup/select-associate-processArea-triggerPoints",
  searchPrecedents:
    "warehouse/masters/cargo-processing-engine/setup/select-cargo-processing-engine-precedents",
  savePrecedents:
    "warehouse/masters/cargo-processing-engine/setup/save-cargo-processing-engine-precedents",
  onSearchExectionShipmentInfo:
    "warehouse/masters/cargo-processing-engine/setup/rule-engine/execution/shipment-info",
  fetchWarehouseInventoryDetail:
    "warehouse/api/whConfiguration/updateWarehouseInventoryList",
  // CARGO PROCESSING ENGINE //
  getEventDetails: "",
  //Events Configuration management
  fetchEventGroups: "warehouse/api/events/userConfiguration/fetch",
  saveUserGroupInfo: "warehouse/api/events/userConfiguration/save",
  vallidateUser: "warehouse/api/events/userConfiguration/vallidate",
  deleteUserGroup: "warehouse/api/events/userConfiguration/delete",
  vallidateNotifyUser:
    "warehouse/api/events/eventNotification/vallidateUserGroup ",
  saveEventNotification: "warehouse/api/events/eventNotification/save",
  vallidateFlightInfo: "warehouse/api/events/eventNotification/vallidateFlight",
  fetchEventNotifications: "warehouse/api/events/eventNotification/fetch",
  fetchNotificationTemplate: "warehouse/api/events/notificationTemplate/fetch",
  saveNotificationTemplate: "warehouse/api/events/notificationTemplate/save",
  deleteNotificationTemplate:
    "warehouse/api/events/notificationTemplate/delete",
  getInboundFlightInfo: "warehouse/api/dashboard/fetchInboundInfo",
  getOutboundFlightInfo: "warehouse/api/dashboard/fetchOutboundInfo",
  fetchOutboundFlightInfo:
    "warehouse/api/events/inboundOutboundFlightEVM/fetchOutboundFlight",
  fetchInboundFlightInfo:
    "warehouse/api/events/inboundOutboundFlightEVM/fetchInboundFlight",
  //  ||||||||||||||||| Staff Allocation ||||||||||||||||||||

  fetchStaffAssignment:
    "warehouse/api/resource/resourceDocument/getStaffAssignmentDetails",
  fetchFlightDate: "warehouse/api/resource/resourceDocument/fetchFlightDate",

  deleteStaffAllocation:
    "warehouse/api/resource/staffAllocation/deleteStaffAllocation",
  saveStaffAllocation:
    "warehouse/api/resource/staffAllocation/addStaffAllocation",
  saveStaffAssignment:
    "warehouse/api/resource/staffAssignment/saveStaffAssignment",
  uploadRoster: "warehouse/api/resource/resourceDocument/uploadRoster",
  //  ||||||||||||||||| Staff Allocation ||||||||||||||||||||
  //  ||||||||||||||||| Flight Allocation ||||||||||||||||||||

  fetchFlightAssignment:
    "warehouse/api/resource/flightAssignment/getFlightAssignmentDetails",
  //  ||||||||||||||||| Flight Allocation ||||||||||||||||||||
  oncloseFailure:
    "warehouse/masters/cargo-processing-engine/setup/rule-engine/execution/shipment-close-failure",
  getSlaDashBoardTVExport: "warehouse/api/events/slaDashboard/exportFlightWeb",
  getSlaDashBoardTVImport: "warehouse/api/events/slaDashboard/importFlightWeb",
  getSlaTVExport: "warehouse/api/events/slaDashboard/exportFlightWebSla",
  getSlaTVImport: "warehouse/api/events/slaDashboard/importFlightWebSla",
  getLatestDboardRecExport: "warehouse/api/events/slaDashboard/exportLatestDetails",
  getLatestDboardRecImport: "warehouse/api/events/slaDashboard/importLatestDetails",

  getAccessory: "warehouse/api/accessory/search",
  saveAccessory: "warehouse/api/accessory/save",
  deleteAccessory: "warehouse/api/accessory/delete",
  getDetailsFlightDashboard: "warehouse/api/events/slaDashboard/detailsFlightDashboard",
  // E ORDER URL's STARTS HERE
  getInfoByProcessType: "warehouse/api/eOrder/getInfoByProcessType",
  create: "warehouse/api/eOrder/create",
  summary: "warehouse/api/eOrder/monitoring",
  acknowledge: "warehouse/api/eOrder/acknowledge",
  cancel: "warehouse/api/eOrder/cancel",
  completed: "warehouse/api/eOrder/complete",
  priority: "warehouse/api/eOrder/priority"
  // E ORDER URL's ENDS HERE

};

export const EQP_ENV = {
  serviceBaseURL: "http://10.130.8.4:8080/",

  equipTasklist: "equipment/api/equipment/searchtasklist/fetch",
  prepareTasklist: "equipment/api/equipment/preparetasklist/prepare",
  equipmentCreateTrip: "equipment/api/equipment/createtrip/createTrip",
  equipmentTripSearch: "equipment/api/equipment/createtrip/search",
  preparationlist: "equipment/api/equipment/equipmentPreparation/search",
  savepreparationlist: "equipment/api/equipment/equipmentPreparation/save",
  fetchByEqupId: "equipment/api/equipment/request/fetchByEquipmentReqId",
  fetchByFlight: "equipment/api/equipment/request/fetchByFlight",
  fetchByAWB: "equipment/api/equipment/request/fetchByAWB",
  saveEquipmentRequest: "equipment/api/equipment/request/save",
  equipRequestlist: "equipment/api/expimpext/searchRequestlist/fetch",
  equipReleaseReturn:
    "equipment/api/equipment/equipmentReturn/searchequipmentreleasereturn",
  searchEquipmentReturnAirlineDetail:
    "equipment/api/equipment/equipmentReturn/searchequipmentairline",
  searchEquipmentReturnFromMobileUrl: "equipment/api/equipment/returndetails",
  deleteEquipmentRequest:
    "equipment/api/equipment/preparetasklist/deleterequest",
  forceReturn: "equipment/api/equipment/equipmentReturn/forceReturn",
  return: "equipment/api/equipment/equipmentReturn/return",
  saveEquipmentRequestByULD: "equipment/api/requestbyuld/create",
  maintain: "equipment/api/requestbyuld/maintain",
  cancel: "equipment/api/requestbyuld/cancel",
  approve: "equipment/api/requestbyuld/approve",
  splitEir: "equipment/api/requestbyuld/splitEIR",
  delete: "equipment/api/requestbyuld/delete",
  fetchEquipmentRequestData: "equipment/api/requestbyuld/fetchEquipmentRequestData",
  edit: "equipment/api/requestbyuld/edit",
  releaseEIR: "equipment/api/requestbyuld/releaseEIR"
};

export const BILL_ENV = {
  serviceBaseURL: "http://10.130.8.4:8080/",

  searchAllChargeCodes: "billing/api/billing/chargecode/searchAllCodes",
  searchChargeCode: "billing/api/billing/chargecode/searchcode",
  saveChargeCode: "billing/api/billing/chargecode/savecode",
  searchChargeFactor: "billing/api/billing/chargefactor/searchFactor",
  saveChargeFactor: "billing/api/billing/chargefactor/saveFactor",
  searchChargeModel: "billing/api/billing/chargemodel/searchChargeModel",
  searchCopyModel: "billing/api/billing/chargemodel/searchCopyChargeModel",
  saveChargeModel: "billing/api/billing/chargemodel/saveChargeModel",
  searchServiceMaster: "billing/api/billing/searchServiceMaster",
  createServiceSetup: "billing/api/billing/createServiceSetup",
  fetchServiceSetup: "billing/api/billing/fetchServiceSetupRecord",
  updateServiceSetup: "billing/api/billing/updateServiceSetup",
  deleteServiceMaster: "billing/api/billing/deleteServiceMaster",
  /** start of customer Billing setup */
  searchCustomerBillingSetup:
    "billing/api/customerbillingsetup/searchcustomerbillinginfo",
  saveCustomerBillingSetUp:
    "billing/api/customerbillingsetup/savecustomerbillinginfo",
  /**end of customer billing setup */
  /** start of Billing Verfication */
  searchBillingVerification:
    "billing/api/billingverification/searchbillingverification",
  saveBillingVerification:
    "billing/api/billingverification/savebillingverification",
  /** end of billing verification */
  /** start of create service request setup */
  createServiceRequest: "billing/api/billing/createServiceRequest",
  checkServiceType: "billing/api/billing/checkServiceType",
  getEstimatedCharges: "billing/api/billing/calculateServiceCharge",
  getFlightDetails: "billing/api/billing/getFlightDetails",
  /** start of waiveApprovalList */
  searchWaiveApprovalList: "billing/api/waiverapproval/searchwaiverapproval",
  /** end of waive Approval List */
  /** start of Collect Payment */
  enquireCharges: "billing/api/billing/collectpayment/enquirecharges",
  waiveCharges: "billing/api/billing/collectpayment/waivecharges",
  calculateWaiver: "billing/api/billing/collectpayment/calculateWaiver",
  payCharges: "billing/api/billing/collectpayment/paycharges",
  /** end of Collect Payment */
  /*** start of charge posting configuration */
  searchChargePostConfiguration:
    "billing/api/chargepostingconfigurtion/searchchargepostingconfiguration",
  saveChargePostConfiguration:
    "billing/api/chargepostingconfigurtion/savechargepostingconfiguration",
  /** end of charge posting configuration */

  /** start of ListServiceRequest */
  listServices: "billing/api/billing/listServices",
  fetchServiceRequest: "billing/api/billing/fetchServiceRequest",
  updateServiceRequest: "billing/api/billing/updateServiceRequest",
  startServiceRequest: "billing/api/billing/startOrCompleteServiceRequest",
  completeServiceRequest: "billing/api/billing/startOrCompleteServiceRequest",
  /** end of ListServiceRequest */
  saveEnquireCharges: "billing/api/billing/collectpayment/saveenquirecharges",
  checkValidWaiverCharges:
    "billing/api/billing/collectpayment/checkvalidwaivecharges",

  searchGroupPay: "billing/api/grouppayment/getgroupinfo",
  makeGroupPayment: "billing/api/grouppayment/makegrouppayment",
  /**counter closure verification starts here */
  searchCounterClosureVerification:
    "billing/api/counterclosureverification/searchcounterclosureverification",
  updateCounterClosureVerification:
    "billing/api/counterclosureverification/updatecounterclosureverification",
  updateCounterClosureVerificationForReport:
    "billing/api/counterclosureverification/updatecounterclosureverificationforreport",
  updatecounterpaymentdetails:
    "billing/api/counterclosureverification/updatecounterpaymentdetails",
  updateIsVoid: "billing/api/billing/updateIsVoid",
  fetchSapInvoice: "billing/api/billing/fetchSapInvList",
  updateSapInvoice: "billing/api/billing/updateSapInv"
  /**counter closure verification ends here */
  /** NGC Report Generation starts here*/,
  getReport: "billing/api/billing/getReport"
  /** NGC Report Generation ends here */,
  /** Driver Summary Report Starts here */
  getDriverDetail: "billing/api/billing/driverSummaryReport/fetch",
  /** Driver Summary Report ends here */
  listReportRecords: "billing/api/billing/listReportRecords",
  updateStatus: "billing/api/billing/updateStatus",
  fetchRecord: "billing/api/billing/fetchRecord",
  updateId: "billing/api/billing/updateDocId",
  fetchEntityForNewUpload: "billing/api/billing/fetchEntityForNewUpload",
  saveTonnageDoc: "billing/api/billing/saveTonnageDoc",
  generateReport: "billing/api/billing/generateReport",
  searchVerifiedReports: "billing/api/billing/searchVerifiedReports",
  authorizedPersonnel: "billing/api/billing/collectpayment/getAuthorizedPersonnelInfo",
  fetchExchangeRates: "billing/api/billing/exchangeRate/getExchangeRate",
  saveExchangeRates: "billing/api/billing/exchangeRate/saveExchangeRate",
  getBillingReport: "billing/api/billing/getBillingReport",
  updateCharges: "billing/api/chargeadvise/calculateShipmentCharge",
  saveCustomerPaymentAccount: "billing/api/customerbillingsetup/savecustomerpayentaccount",
  deleteCustomerPaymentAccount: "billing/api/customerbillingsetup/deletecustomerpayentaccount",
  topupPaymentAccount: "billing/api/customerbillingsetup/topuppaymentaccount",
  waiveApproveOrReject: "billing/api/waiverapproval/waiveApproveOrReject",
  getCreditDebitList: "billing/api/billing/getCreditDebitList",
  getListOfInvoices: "billing/api/billing/listOfInvoices/fetch",
  getPDAccountTransactions: "billing/api/billing/getPDAccountTransactions",
  sendToIRN: "billing/api/billing/sendToIRN",
  sendInvoiceToIRN: "billing/api/billing/listOfInvoices/sendToIRN",
  searchCreditDebitNoteData: "billing/api/billing/creditDebitNote/fetchDetails",
  payCreditDebitNote: "billing/api/billing/creditDebitNote/payment",
  checkHandledByOrAccpByHouse: "billing/api/billing/checkHandledByOrAccpByHouse",
  updateCustomerForChangePDAccount: "billing/api/billing/updateCustomerForChangePDAccount",
  fetchCustomerTaxApplicability: "billing/api/billing/creditDebitNote/fetchCustomerTaxApplicability"
};
///////////////// SERVICE FOR BATCH JOB MONITORING //////////////////////
export const BATCH_ENV = {
  serviceBaseURL: "http://10.130.8.4:8080/",
  // URL LINK STARTS HERE
  stopJob: "satssgbatches/api/job/stop",
  startJob: "satssgbatches/api/job/start",
  pauseJob: "satssgbatches/api/job/pause",
  searchJob: "satssgbatches/api/job/jobs",
  resumeJob: "satssgbatches/api/job/resume",
  deleteJob: "satssgbatches/api/job/delete",
  createJob: "satssgbatches/api/job/schedule",
  checkJob: "satssgbatches/api/job/checkJobName",
  cleanupJob: "satssgbatches/api/job/cleanupJob",
  reinitiateMessages: "satssgbatches/api/job/reinitiateMessages"
};
///////////////// SERVICE FOR BATCH JOB MONITORING //////////////////////
///////////////// CUSTOMS MODULE //////////////////////

export const CUSTOMS_ENV = {
  serviceBaseURL: "http://10.130.8.4:8080/",
  // URL LINK STARTS HERE
  customsshipmentadd:
    "satssgcustoms/api/satssgcustoms/customsmrs/getCustomsShipmentInfo",
  getshipmentinfoincaseofadd:
    "satssgcustoms/api/satssgcustoms/customsmrs/getShipmentInfoInCaseOfAdd",
  addMRSshipmentInfo:
    "satssgcustoms/api/satssgcustoms/customsmrs/addCustomMRSShipmentInfo",
  addNewShipmentmanually:
    "satssgcustoms/api/satssgcustoms/customsmrs/addNewShipmentmanually",
  getMrsInfo: "satssgcustoms/api/satssgcustoms/customsmrs/getMRSInfo",
  deleteMrsInfo:
    "satssgcustoms/api/satssgcustoms/customsmrs/deleteCustomMRSShipmentInfo",
  customsShipmentInfo:
    "satssgcustoms/api/satssgcustoms/customsmrs/getCustomsShipmentInfo",

  searchFilteredFlightInfo:
    "satssgcustoms/api/customsflightschedule/searchFlightInfo",
  isFlightNumberExist:
    "satssgcustoms/api/customsflightschedule/isFlightNumberExists",
  autoPopulateBasedOnFlightKeyAndDate:
    "satssgcustoms/api/customsflightschedule/autoPopulateBasedOnFlightKeyAndDate",
  addFlightDetails: "satssgcustoms/api/customsflightschedule/addFlightDetails",
  updateCancelledUncancelledFlightStatus:
    "satssgcustoms/api/customsflightschedule/updateCancelledUncancelledFlightStatus",
  sendMrsInfo: "satssgcustoms/api/satssgcustoms/customsmrs/getConsolidatedInfo",
  cargomanifestdecleration:
    "satssgcustoms/api/satssgcustoms/customsmrs/getCmdInfo",
  deleteACESFlights: "satssgcustoms/api/customsflightschedule/deleteACESFlights"
};

export const CARGO_MESSAGING_ENV = {
  serviceBaseURL: "http://10.130.8.9:9120/",
  send:
    "cargomessaginginterfaces/api/manual/trigger/outbound/message/ttmMessage/send",
  sendUpdate:
    "cargomessaginginterfaces/api/manual/trigger/outbound/message/ttmMessage/sendUpdate",
  reSend:
    "cargomessaginginterfaces/api/manual/trigger/outbound/message/ttmMessage/reSend",
  flightCompleteResendmessageList: "cargomessaginginterfaces//api/edi/flightCompleteResend/messages",
  getshccodedetails: "cargomessaginginterfaces/api/edi/updatedls/messages",
  flightDiscriapancySendAdvce: "cargomessaginginterfaces//api/edi/flightdiscrepancy/messages",
  getFfmPreviewMessage: "cargomessaginginterfaces/api/edi/flightComplete/previewFFM"
};
export const CARGOMESSAGING_ENV = {
  serviceBaseURL: "http://10.130.8.9:9120/",
  sendUpdate:
    "cargomessaginginterfaces/api/manual/trigger/outbound/message/ttmMessage/sendUpdate",
  reSend:
    "cargomessaginginterfaces/api/manual/trigger/outbound/message/ttmMessage/reSend",
  fetchResendFwbFhlInfo: "cargomessaginginterfaces/api/edi/resendmessage/fwbfhl/get",
  resendFwbFhl: "cargomessaginginterfaces/api/edi/resendmessage/fwbfhl/send",
  fetchIncomingMessage:
    "cargomessaginginterfaces/api/message/enquire/incomingLog",

  fetchOutgoingMessage:
    "cargomessaginginterfaces/api/message/enquire/outgoingLog",

  fetchMonitorExternalInterface:
    "cargomessaginginterfaces/api/message/enquire/monitorextenalinterface",

  sendIncomingMessageProcess:
    "cargomessaginginterfaces/api/manual/message/incoming",

  sendTelexMessages: "cargomessaginginterfaces/api/message/attachtelex",
  sendTelex: "cargomessaginginterfaces/api/message/sendtelex",

  setUpMessageDefination:
    "cargomessaginginterfaces/api/message/setupmessagedefinition/search",

  saveSetUpMessageDefination:
    "cargomessaginginterfaces/api/message/setupmessagedefinition/save",
  fetchResendMessage: "cargomessaginginterfaces/api/edi/resendmessage/getdata",
  sendResendMessage:
    "cargomessaginginterfaces/api/edi/resendmessage/resenddata",
  telexSetup: "cargomessaginginterfaces/api/edi/sendtelexmessage/setupdata",
  fetchmonitoringMessage: "cargomessaginginterfaces/api/message/monitormessage",
  fetchErrorMessage: "cargomessaginginterfaces/api/message/errorMessage",
  pullMailTelexMessage: "cargomessaginginterfaces/api/message/pullmailtelex",
  fetchEdiInterfaceSetUp: "cargomessaginginterfaces/api/message/ediInterfaceSetUp/fetch",
  saveEdiInterfaceSetUp: "cargomessaginginterfaces/api/message/ediInterfaceSetUp/add",
  fetchEdiInterfaceTelexAddressSetUp: "cargomessaginginterfaces/api/message/ediInterfaceTelexAddressSetUp/fetch",
  addEdiInterfaceTelexAddressSetUp: "cargomessaginginterfaces/api/message/ediInterfaceTelexAddressSetUp/add",
  fetchEdiInterfaceEventSetUp: "cargomessaginginterfaces/api/message/ediInterfaceEventSetUp/fetch",
  addEdiInterfaceEventSetUp: "cargomessaginginterfaces/api/message/ediInterfaceEventSetUp/add",
  addEdiMessageDefinition: "cargomessaginginterfaces/api/message/ediInterfaceEventSetUp/addMessageDefinitionByCustomer",
  //addEdiMessageDefinition: "cargomessaginginterfaces/api/message/ediInterfaceEventSetUp/addMessageDefinitionByCustomer",
  // grouped message set up URLS//
  setUpGroupedMessageDefination: "cargomessaginginterfaces/api/message/setupmessagedefinition/search-grouped",
  editGroupedMessageDefination: "cargomessaginginterfaces/api/message/setupmessagedefinition/edit-groupedDefinition",
  deleteGroupedMessageDetails: "cargomessaginginterfaces/api/message/setupmessagedefinition/delete-groupedDefinition",
  fetchEventTypesForGroupedDefinition: "cargomessaginginterfaces/api/message/setupmessagedefinition/getEventType",
  editGroupedMessageHandlingDefinfition: "cargomessaginginterfaces/api/message/setupmessagedefinition/editOperations-groupedDefinition",
  editAndSendTsmMessage: "cargomessaginginterfaces/api/message/enquire/resendTsm",
  repalceFFMmessage: "cargomessaginginterfaces/api/manual/message/repalceincomingFFM",
  processInboundMsgFile: "cargomessaginginterfaces/api/manual/messagefile/incoming",
  getUploadedDocId: "cargomessaginginterfaces/api/manual/messagefile/getuploadeddocid",
  searchIcmsBookingPublishList: "cargomessaginginterfaces/api/cmd/icms/message/booking/getBookingDetails",
  checkHandledByHouse: "cargomessaginginterfaces/api/message/enquire/checkHandledByHouse"
};

export const SATSSGINTERFACE_ENV = {
  serviceBaseURL: "http://10.130.8.9:9320/",
  fetchUldList: "satssginterfaces/api/ics/fetch-uld-list",
  fetchICSLocation: "satssginterfaces/api/ics/fetch-ics-location",
  getMessageId: "satssginterfaces/api/smartgate/scanVolWgtReq",
  searchIcmsBookingPublishList: "satssginterfaces/api/cmd/icms/message/booking/getBookingDetails",
  getFsuApiStatus: "satssginterfaces/api/fsu/fetch",
  saveFsuApiStatus: "satssginterfaces/api/fsu/update"
};

export const EFACILITATION_ENV = {
  serviceBaseURL: "http://10.130.8.4:8080/",
  saveEfacilitationService: 'expimpextapi/api/eservices/request/saveEfacilitationServiceInternal',
  editEfacilitationService: 'expimpextapi/api/eservices/request/editEfacilitationServiceInternal',
  approveEfacilitationServiceInternal: 'expimpextapi/api/eservices/request/approveEfacilitationServiceInternal',
  rejectEfacilitationServiceInternal: 'expimpextapi/api/eservices/request/rejectEfacilitationServiceInternal',
  searchEfacilitationService: 'expimpextapi/api/eservices/request/searchEfaciliationServicesinternal',
  getQuoteEfacilitationService: 'expimpextapi//api/eservices/request/getQuoteEfacilitationServiceInternal',

  buplist_Awb:
    "expimpextapi/api/acceptance/declaration/by/packaging/retriveBUP_Awb",

  buplist_Uld:
    "expimpextapi/api/acceptance/declaration/by/packaging/retriveBUP_Uld",

  buplist_Save:
    "expimpextapi/api/acceptance/declaration/by/packaging//saveBUP",
};

export const TCS_ENV = {
  serviceBaseURL: "http://localhost:9380/",
  //
  simulate: 'tcs/api/simulator/simulate',
  simulatorTrip: 'tcs/api/simulator/trip',
  simulatorSlots: 'tcs/api/simulator/freeSlots',
  simulatorGenerateSlots: 'tcs/api/simulator/generateSlot',
  // Simulator Original API Call
  kioskAPIVehicleAtGate: 'tcs/api/smart-device/vehicle-at-gate',
  kioskAPIKioskStatus: 'tcs/api/smart-device/kiosk-status',
  kioskAPIPressKey: 'tcs/api/smart-device/press-key',
  kioskAPILogEvent: 'tcs/api/smart-device/log-event',
  kioskAPIDockStatus: 'tcs/api/smart-device/update-dock-status',
  // Time Slot
  freeSlots: 'tcs/api/time-slot/free-slots',
  //
  search: 'tcs/truck-park-activity/search',

  //API'S FOR COMPANY OCCUPANCY
  companyOccupancySearch: "tcs/company-occupancy/search",
  companyOccupancyDetails: "tcs/company-occupancy/details",

  //API'S FOR MAINTAIN TENANT
  maintainTenantSearch: "tcs/maintain-tenant/search",
  maintainTenantCreate: "tcs/maintain-tenant/create",
  maintainTenantFind: "tcs/maintain-tenant/find",
  maintainTenantUpdate: "tcs/maintain-tenant/update",
  maintainTenantDelete: "tcs/maintain-tenant/delete",
  //API'S FOR ADD Queue
  addQueueSearch: "tcs/add-queue/search",
  addQueueToQueue: "tcs/add-queue/add-to-queue",
  //API'S FOR MAINTAIN TRUCK DOCK
  maintainTruckDockSearch: "tcs/maintain-truck-dock/search",

  //API'S FOR TRUCK ASSIGN TO SRF
  truckAssignSearch: "tcs/truck-assign/search",
  truckAssignSave: "tcs/truckassign/savetruckassignSrf",
  //API'S FOR SCHEDULE COLLECTION
  schedulecollectionInfoSearch: "tcs/schedulecollection/search",
  schedulecollectionInfoCreate: "tcs/schedulecollection/create",
  schedulecollectionInfoUpdate: "tcs/schedulecollection/update",
  schedulecollectionInfoDelete: "tcs/schedulecollection/delete",
  leddisplaysearch: "tcs/leddisplay/search",


  //API'S FOR VEHICLE INFO
  vehicleInfoCreate: "tcs/vehicle-info/create",
  vehicleInfoUpdate: "tcs/vehicle-info/update",
  vehicleInfoDelete: "tcs/vehicle-info/delete",
  vehicleInfoSave: "tcs/vehicle-info/save",
  vehicleInfoSearch: "tcs/vehicle-info/search",
  vehicleInfoFind: "tcs/vehicle-info/find",
  UnknownVehicleList: "tcs/unknownVehicle/search",
  mapToVehicleEP: "tcs/unknownVehicle/map",
  UnknownVehicleRegister: "tcs/UnknownVehicle/Register",
  connectingtrucksearch: "tcs/connecting-truck/search",
  conectingtruck: "tcs/connecting-truck/save",


  //API FOR TRUCK ACTIVITY HISTORY

  truckActivityHistorySearch: "tcs/truck-activity-history/search",

  //API'S FOR tenant Queue info
  searchallocatedvehicleQueueInfo: "tcs/queueinformation/allocatedvehicle/search",
  searchManualQueueInfo: "tcs/queueinformation/manualqueuing/search",
  searchTenantInfo: "tcs/queueinformation/search",
  tenantAddtoQueue: "tcs/queueinformation/addqueue",
  tenantCancelAllocation: "tcs/queueinformation/cancelallocation",

  //API'S FOR  Truck Queue info
  getPriorityList: "tcs/truckqueue/search",
  getNormalList: "tcs/truckqueue/normal/search",
  updateQueueType: "tcs/truckqueue/updatetype",
  updateQueueOrder: "tcs/truckqueue/updateQueueOrder",
  maintainBanTruckSearch: "tcs/maintain-ban-truck/search",
  maintainBanTruckCreate: "tcs/maintain-ban-truck/create",
  maintainBanTruckrelease: "tcs/maintain-ban-truck/release",
  maintainBanTruckUpdate: "tcs/maintain-ban-truck/update",
  maintainBanTruckHistory: "tcs/maintain-ban-truck/history",
  templateDetails: "tcs/template/search",
  templateStatusUpdate: "tcs/template-status/update",
  createTruckDockTemplate: "tcs/template/fetch",
  updateTruckDockTemplate: "tcs/template/fetchUpdate",
  deleteTemplate: "tcs/template/delete",
  saveTemplate: "tcs/template/save",
  fetchBanReasonData: "tcs/maintain-ban-truck/fetchBanReasonData",

  // Dock Utilization Details      
  dockUtilzationSearch: "tcs/dockutlization/search",
  dockList: "tcs/docklist/search",

  // Dock Monitoring   
  dockMonitoringSearch: "tcs/dockmonitoring/search",

  //Reserve Truck Dock
  createReserveTruckDock: "tcs/reservetruckdock/createReserveTruckDock",
  searchReserveTruckDock: "tcs/reservetruckdock/searchReserveTruckDock",
  unReserveTruckDock: "tcs/reservetruckdock/unreserveReserveTruckDock",

  //Pre-waiving Parking
  createPreWaiveParking: "tcs/prewaiveparking/createPreWaiveParking",
  searchPreWaiveParking: "tcs/prewaiveparking/searchPreWaiveParking",
  updatePreWaiveParking: "tcs/prewaiveparking/updatePreWaiveParking",
  deletePreWaiveParking: "tcs/prewaiveparking/deletePreWaiveParking",

  // API For Exit gate
  getExitGateDetails: "tcs/exitgatedetails/search",
  getTruckDetails: "tcs/truckinformation/search",

  // API For Release Truck Doc 
  getTruckDockInfo: "tcs/releasetruckdoc/searchvehicleinfo",
  updateTruckDock: "tcs/releasetruckdoc/releaseVehicle",

  //  Assign TruckDock
  assignTruckDock: "tcs/assigntruckdock/assign",
  assignTruckDockGetVehicleInfo: "tcs/assigntruckdock/vehicle-info",

  //Adhoc Change
  getAdhocChange: "tcs/adhocdockupdate/getadhocdockchange",
  updateAdhocChange: "tcs/adhocdockupdate/updateahocdockchange",

  //Manual Capture Event
  updateCheckPoint: "tcs/updateeventatcheckpoint",
  simulator: "tcs/api/simulator/simulate",
};

// AAT Customs Module
export const AAT_CUSTOMS_ENV = {
  serviceBaseURL: "http://localhost:9370/",
  searchCustomsFlights: 'aatinterfaces/api/leftbehindshipment/search',
  maintainAccsDetail: "aatinterfaces/api/maintainAccsInformation/save",
  maintainAccsAddressDetail: "aatinterfaces/api/maintainAccsInformation/addressdetails",
  maintainAccsFlightDetail: "aatinterfaces/api/maintainAccsInformation/shipmentdetails",
  deleteDocumentInfo: "aatinterfaces/api/maintainAccsInformation/deleteDocInfo",
  validateMaintainAccsDetail: "aatinterfaces/api/maintainAccsInformation/validateInfo",
  customFlightShipmentInfo: "aatinterfaces/api/submitShipment/shipmentInfo",
  customsaveShipmentInfo: "aatinterfaces/api/submitShipment/saveshipment",
  customupdateShipmentInfo: "aatinterfaces/api/submitShipment/updateshipment",
  // URL LINK STARTS HERE
  getCustomsHouseList: "aatinterfaces/api/customs/getCustomsHouseList",
  saveCustomsHouseInfo: "aatinterfaces/api/customs/saveCustomsHouseInfo",
  getCustomsHouseInfo: "aatinterfaces/api/customs/getCustomsHouseInfo",
  //Submit Initial Consignment
  fetchSubmitInitialConsigment: "aatinterfaces/api/customs/fetchSubmitInitialConsigment",
  //
  fetchSubmitAmendedConsigment: "aatinterfaces/api/customs/fetchSubmitAmendedConsigment",
  fetchSubmitInitialShipment: "aatinterfaces/api/customs/fetchSubmitInitialShipment",
  submitConsignment: "aatinterfaces/api/customs/submitConsignment",
  fetchSubmitAmendedShipment: "aatinterfaces/api/customs/fetchSubmitAmendedShipment",
  saveAmendedConsignment: "aatinterfaces/api/customs/saveAmendedConsignment",
  submitAmendedToCustom: "aatinterfaces/api/customs/submitAmendedToCustom",
  //MaintainConstraint Code
  getMaintainConstraintCode: "aatinterfaces/api/maintain_constraint_code/getMaintainConstraintCode",
  insertMaintainConstraintCode: "aatinterfaces/api/maintain_constraint_code/insertMaintainConstraintCode",
  //List/Print Constraint Codes Report
  getPrintConstraintCode: "aatinterfaces/api/print_constraint_code_report/getPrintConstraintCode",
  getPopUpConstraintCodeHistory: "aatinterfaces/api/print_constraint_code_report/getPopUpConstraintCodeHistory",

  //Submit Breakdown Discrepancy
  getBrkdwnDiscFltDtls: 'aatinterfaces/api/submitbreakdowndiscrepancy/getFlightDetails',
  getBrkdwnDiscShpDtls: 'aatinterfaces/api/submitbreakdowndiscrepancy/getShipmentDetails',
  submitBrkdwnDiscDtls: 'aatinterfaces/api/submitbreakdowndiscrepancy/submitBrkdwnDiscDtl',

  //Customs Message Log Details
  fetchCustomsMessage: 'aatinterfaces/api/customsmessagelogdetails/fetchCustomsMessage',

  //export Submit Consignment
  fetchExportSubmitConsignment: 'aatinterfaces/api/customs/exportSubmitConsignment',
  fetchExportSubmitShipment: 'aatinterfaces/api/customs/submitexportShipment',

  //Create/Amend Dc Details
  fetchDcDetails: 'aatinterfaces/api/createAmendDcDetails/search',
  saveDcDetails: "aatinterfaces/api/saveDcDetails",

  //FaxHashTotal
  getFaxHashTotalData: 'aatinterfaces/api/faxhashtotal/search',
  sendHashTotal: 'aatinterfaces/api/faxhashtotal/sendhashtotal',

  //e-Itt Submission/Cancellation/Confirmation
  getEITTData: 'aatinterfaces/api/eitt_data/getEIttData',
  saveSubmission: 'aatinterfaces/api/eitt_data/saveSubmission',

  //Submit Reconciliation
  getRecList: 'aatinterfaces/api/submitreconciliationlist/search',
  getRecData: 'aatinterfaces/api/submitreconciliationdetails/search',

  //Enquire/Print Examination Results
  fetchExaminationResults: 'aatinterfaces/api/list_print_examination_results/fetchExaminationResults',
  fetchPopUpConstraintCodeHistory: 'aatinterfaces/api/list_print_examination_results/fetchPopUpConstraintCodeHistory',
  //Left Behind management
  fetchMangementDetails: 'aatinterfaces/api/leftbehindmangement/fetchMangementDetails',

};
export const EXPORTaat = {

  serviceBaseURL: "http://localhost:9170/",

  mRCLSummaryRetrieveService: 'expimpextapi/api/acceptance/declaration/by/packaging/summary',
  mRCLPreDeclarationSaveService: 'expimpextapi/api/acceptance/declaration/by/packaging/save',
  mRCLPreDeclarationUpdateService: 'expimpextapi/api/acceptance/declaration/by/packaging/update',
  mRCLPreDeclarationDeleteService: 'expimpextapi/api/acceptance/declaration/by/packaging/deletemRCL',
  mRCLRetrieveDetails: "expimpextapi/api/acceptance/declaration/by/packaging/retrivepredecleartiondetails",
  fetchCarrierCodebyShipment: "expimpextapi/api/acceptance/declaration/by/packaging/getCarrierCodeForShipment",
  fetchCarrierCodebyULD: "expimpextapi/api/acceptance/declaration/by/packaging/getCarrierCodeForULD",
  rclRetrivePredecleartionDetail: "expimpextapi/api/acceptance/declaration/by/packaging/retrivepredecleartiondetails",
  changePPKMixPPK: "expimpextapi/api/acceptance/declaration/by/packaging//change/changePPKMixPPK",
  getmRCLNumber: 'expimpextapi/api/acceptance/declaration/by/packaging/getmRCLNumber',
  createmRCLAWBvalidation: 'expimpextapi/api/acceptance/declaration/by/packaging/validateAWBcreate'
};
export const EXPORTlocaltransfer = {

  serviceBaseURL: "http://localhost:9150/",

  localtransferRetrieveService: 'expaccpt/api/acceptance/by/packaging/retrivelocaltransferdetails',
  localtransfersaveService: 'expaccpt/api/acceptance/by/packaging/savelc'

};
