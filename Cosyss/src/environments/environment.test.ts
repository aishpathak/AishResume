// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const Environment = {

  //serviceBaseURL: 'http://localhost' + ':3000/',
  /**
   * Global Settings -->START
      * */
  production: false,
  theme: 'ngc',
  /**
  * FOR DATE FORMAT -->START
*/
  dateFormat: 'ddMMMyyyy',
  timeFormat: 'HH:mm',
  dateTimeFormat: 'ddMMMyyyy HH:mm',
  currencySymbol: 'S$',
  currencyDecimalDigits: 2

  /*DATE FORMAT END */

 /*GLOBAL SETTING ---->END */
};

export const DomainEnvironement = {


  //serviceBaseURL: 'http://localhost' + ':3000/',
  /**
     * Application URL's
     */

  /* Masters ---->Start */
  uldSeriesURL: 'configuration/api/config/airlineMaster/uldSeries',
  uldSeriesSearchURL: 'configuration/api/config/airlineMaster/searchUldSeries',
  uldSeriesUpdateURL: 'configuration/api/config/airlineMaster/updateUldSeries',
  addUldSeriesURL: 'configuration/api/config/airlineMaster/insertUldSeries',
  deleteUldSeriesURL: 'configuration/api/config/airlineMaster/deleteUldSeries',
  carrierCodeAddURL: 'configuration/api/config/airlineMaster/insertCarrier',
  carrierCodeUpdateURL: 'configuration/api/config/airlineMaster/updateCarrier',
  deleteCarrierCodeURL: 'configuration/api/config/airlineMaster/deleteCarrier',
  awbPrefixURL: 'configuration/api/config/airlineMaster/prefixListDropDown',

  mastersListBaseURL: 'configuration/api/config/maintainMaster/singleMasterList',
  fetchMastersListBaseURL: 'configuration/api/config/maintainMaster/masterDetail',
  fetchSystemParameterListBaseURL: 'configuration/api/config/Search/in/systemParam/systemParamList',
  fetchSystemParameterListByNameBaseURL: 'configuration/api/config/Search/in/systemParam/',
  updateSystemParameterBaseURL: 'configuration/api/config/system/param/updateSysListValues/',
  searchMasters: 'configuration/api/config/maintainMaster/searchMasterDetail',
  insertMasters: 'configuration/api/config/maintainMaster/saveMasterDetail',
  updateMasters: 'configuration/api/config/maintainMaster/updateMasterDetail',
  deleteMasters: 'configuration/api/config/maintainMaster/deleteMasterDetail',

  masterShcDetails: 'configuration/api/masters/shc/masterShcDetails',
  searchMaintainShcDetails: 'configuration/api/masters/shc/searchMaintainShc/',
  edithMaintainShcDetails: 'configuration/api/masters/shc/editMasterShc',
  saveMaintainShcDetails: 'configuration/api/masters/shc/saveMasterShcDetails',
  searchShcCodeDesc: 'configuration/api/masters/shc/searchShcCodeDesc',
  updateShcDetails: 'configuration/api/masters/shc/updateMasterShcDetails',
  deleteShcDetails: 'configuration/api/masters/shc/deleteMasterShcDetails',
  editColoadableShcData: 'configuration/api/masters/shc/editColoadableShc/',
  updateShcColoadableDetails: 'configuration/api/masters/shc/updateColoadableShcDetails',
  deleteShcColoadableShcData: 'configuration/api/masters/shc/deleteShc',


  /* Maintain Code Administartion */
  mastersCodeAdminDropdownDataTableURL: 'configuration/api/config/dropdown-datatable',
  mastersCodeAdminInsertURL: 'configuration/api/config/maintainCodeAdministration/insert',
  mastersCodeAdminDeleteURL: 'configuration/api/config/MaintainCodeAdministration/delete',
  mastersCodeAdminUpdateURL: 'configuration/api/config/MaintainCodeAdministration/update',

  /* ULD Type */
  uldTypeSaveDetails: 'configuration/api/config/airlineMaster/insertUldType',
  uldTypeUpdateDetails: 'configuration/api/config/airlineMaster/updateUldType',
  getUldTypeListDetails: 'configuration/api/config/airlineMaster/fetchUldType',
  uldTypeSearchDetails: 'configuration/api/config/airlineMaster/searchUldType',
  deleteUldTypeDetails: 'configuration/api/config/airlineMaster/deleteUldType',
  aircraftTypeSaveDetails: 'configuration/api/config/airlineMaster/aircraftType',
  deleteAircraftType: 'configuration/api/config/airlineMaster/deletAircraftType',
  editAircraftType: 'configuration/api/config/airlineMaster/editAircraftType',
  /* carrier code */
  getCarrierCodeListDetails: 'configuration/api/config/airlineMaster/fetchCarrier',
  searchCarrierCodeListDetails: 'configuration/api/config/airlineMaster/searchCarrier',
  carrierCodeUpdateDetails: 'configuration/api/config/airlineMaster/updateCarrier',
  updateAwbPrefixListURL: 'configuration/api/config/airlineMaster/updateprefix',
  addAwbPrefixListURL: 'configuration/api/config/airlineMaster/insertprefix',
  deleteAwbPrefixListURL: 'configuration/api/config/airlineMaster/deleteprefix',

  /* Masters  ---->END */


  /* FLIGHT ---->START */
  createOperativeFlights: 'flight/api/flight/schedule/createoperativeflight',
  cancelOperativeFlights: 'flight/api/flight/schedule/canceloperativeflight',
  maintainFlightSchedule: 'flight/api/flight/schedule/maintain',
  findFlightSchedule: 'flight/api/flight/schedule/find',
  generateOperativeFlights: 'flight/api/flight/schedule/generateoperativeflight',
  outgoingEnroutementBaseURL: 'flight/api/flight/enroutement/display',
  flightDetailsBaseURl: 'flight/api/flight/operating/find',
  deleteCodeShareFlight: 'flight/api/flight/codeShare/delete',
  maintainCodeShareFlight: 'flight/api/flight/codeShare/maintain',
  getCodeShareFlights: 'flight/api/flight/codeShare/fetch',
  saveSplEnroutement: 'flight/api/flight/enroutement/create',
  deleteSplEnroutement: 'flight/api/flight/enroutement/delete',
  loadSplEnroutement: 'flight/api/flight/enroutement/find',
  getOperativeFlights: 'flight/api/flight/operating/searchlist',
  getScheduleDetails: 'flight/api/flight/schedule/searchlist',
  updateFlightDetails: 'flight/api/flight/operating/updateflight',
  restoreFlightDetails: 'flight/api/flight/operating/restore',
  cancelFlightDetails: 'flight/api/flight/operating/cancel',
  getFlightSchedules: 'flight/api/flight/schedule/schedulelist',
  saveFlightDetails: 'flight/api/flight/operating/save',
  deleteFlightFact: 'flight/api/flight/operating/deletefact',
  deleteFlightLeg: 'flight/api/flight/operating/deleteleg',
  updateSplEnroutement: 'flight/api/flight/enroutement/update',

  getUfisFlights: 'flight/api/flight/ufis/fetch',
  updateUfisFlight: 'flight/api/flight/ufis/update',
  createUfisFlight: 'flight/api/flight/ufis/create',
  deleteUfisFlight: 'flight/api/flight/ufis/delete',

  /* FLIGHT ---->END */
  /*  ULD ----->START */
  stockLevelUrl: 'uld/api/uldstock/retreive',
  inventorySearchUrl: 'uld/api/uld/inventory/search',
  transferCreateUrl: 'uld/api/uld/transfer/createUldTransfer',
  /*  ULD in movement */
  finduldUrl: 'uld/api/uld/movement/in/finduld/',
  createuldUrl: 'uld/api/uld/movement/in/createuld',
  createrepairUrl: 'uld/api/uld/movement/in/createrepair',
  returnfromagentUrl: 'uld/api/uld/movement/in/returnfromagent',
  updatefoundcargoUrl: 'uld/api/uld/movement/in/updatefoundcargo',
  updatefoundapronUrl: 'uld//api/uld/movement/in/updatefoundapron',
  createinflightUrl: 'uld/api/uld/movement/in/createinflight',
  /* ULD out movement */
  createOutrepairUrl: 'uld/api/uld/movement/out/createOutrepair',
  updatemissingcargoUrl: 'uld/api/uld/movement/out/updatemissingcargo',
  updatemissingapronUrl: 'uld/api/uld/movement/out/updatemissingapron',
  createoutflightUrl: 'uld/api/uld/movement/out/createoutflight',
  deleteuldUrl: 'uld/api/uld/movement/out/deleteuld',
  senttoagentUrl: 'uld/api/uld/movement/in/senttoagent',
  releasedtootherghaUrl: 'uld/api/uld/movement/out/releasedtoothergha',
  flightdetailsUrl: 'uld/api/uld/movement/in/flightdetails',
  editULDUrl: 'uld/api/uld/movement/editULD/',
  /* ULD Transfer */
  fetchULDTransferDetailsUrl: 'uld/api/uld/transfer/fetch',
  generateRecieptNumberUrl: 'uld/api/uld/transfer/generateReceipt',
  createUldTransferUrl: 'uld/api/uld/transfer/create',
  uldValidationUrl: 'uld/api/uld/transfer/validateUld',
  finalizeTransferUrl: 'uld/api/uld/transfer/finalize',
  updateTransferUrl: 'uld/api/uld/transfer/update',
  deleteTransferUrl: 'uld/api/uld/transfer/delete',
  /* ULD Stock Check */
  uldStocksStatusFetchUrl: 'uld/api/uld/stockcheck/uldstockcheckstatus',
  fetchSightedUldsUrl: 'uld/api/uld/stockcheck/fetchsighteduld',
  fetchUnsightedUldsUrl: 'uld/api/uld/stockcheck/fetchunsighteduld',
  fetchStockConsolidationUrl: 'uld/api/uld/stockcheck/stockconsolidation',
  confirmSightedServiceUrl: 'uld/api/uld/stockcheck/unsighteduldassighted',
  confirmMissingServiceUrl: 'uld/api/uld/stockcheck/unsightedmissinguld',
  confirmDeleteServiceUrl: 'uld/api/uld/stockcheck/deletedunsighteduld',
  osiRemarkUrl: 'uld/api/uld/stockcheck/osiremarks',
  confirmReconcilCargoUrl: 'uld/api/uld/stockcheck/reconcilecargo',
  confirmReconcilApronUrl: 'uld/api/uld/stockcheck/reconcileapron',
  confirmCompletCargoUrl: 'uld/api/uld/stockcheck/completecargo',
  confirmCompletApronUrl: 'uld/api/uld/stockcheck/completeapron',
  confrimScmCargoUrl: 'uld/api/uld/stockcheck/scmcargo',
  confrimScmApronUrl: 'uld/api/uld/stockcheck/scmapron',
  confirmScmCargoApronBothUrl: 'uld/api/uld/stockcheck/scmcargoapronboth',
  /* END ULD Stock Check */
  /* ULD ---->END */

  /* ADMIN START */
  /*Start URLS related to User Roles*/
  createRole: 'admin/api/admin/role/create-role',
  updateRole: 'admin/api/admin/role/update-role',
  deleteRole: 'admin/api/admin/role/delete-role',
  searchRole: 'admin/api/admin/role/search-role',
  fetchRoleFunctions: 'admin/api/admin/role/search-assign-role-function',
  updateScreenFunction: 'admin/api/admin/role/update-screen-function-assignment',
  createScreenFunction: 'admin/api/admin/role/create-screen-function-assignment',
  deleteSubModule: 'admin/api/admin/role/delete-submodule',
  fetchUpdateRole: 'admin/api/admin/role/getrole',
  saveScreenAssignments: 'admin/api/admin/role/update-screen-assignments',
  /*End of URLS related to User Roles*/
  getCompaniesLOV: 'admin/api/admin/staff/searchcompanieslov',
  getRolesLov: 'admin/api/admin/staff/searchdutycodeslov',
  searchUserDetailsByCriteria: 'admin/api/admin/user/search-user',
  saveUser: 'admin/api/admin/user/create-user',
  updateUser: 'admin/api/admin/user/update-user',
  deleteUser: 'admin/api/admin/user/delete-user',
  deleteRoleAssignments: 'admin/api/admin/user/delete-user-role-assignment',

  /* ADMIN END */

  /* EXPORT START */

  outboundLyingList: 'expaccpt/api/outbound/layinglist/search',
  searchMultipleShipmentBookingDetail: 'expaccpt/api/multiple-shipment-booking/search',
  maintainMultipleShipmentBookingDetail: 'expaccpt/api/multiple-shipment-booking/maintain',
  getFlightShipmentDetail: 'expaccpt/api/multiple-shipment-booking/get-flight-shipment-detail',
  getShipmentDetail: 'expaccpt/api/multiple-shipment-booking/get-shipment',
  editFlightShipmentDetail: 'expaccpt/api/multiple-shipment-booking/edit-flight-shipment-detail',
  cancelMultipleShipment: 'expaccpt/api/multiple-shipment-booking/cancel',
  searchWorkingList: 'expaccpt/api/export/workinglist/search',
  searchSnapshot: 'expaccpt/api/export/workinglist/searchSnapshot',
  createSnapshot: 'expaccpt/api/export/workinglist/createSnapshot',
  getAwbDetails: '',
  singleShipmentBookingSearch: 'expaccpt/api/export/booking/single-shipment/search',
  singleShipmentBookingCreateBooking: 'expaccpt/api/export/booking/single-shipment/create',
  singleShipmentBookingDeletePart: 'expaccpt/api/export/booking/single-shipment/delete-part',
  singleShipmentBookingMergePart:'expaccpt/api/export/booking/single-shipment/merge-part',
  singleShipmentBookingGetSuffix:'/api/export/booking/single-shipment/getSuffix',
  getRejectReturnAwbDetails:'',
  /* EXPORT END */
 
  /*VAL STARTS*/

   
   saveCaptureIncomingRequest:  'val/api/val/incomingrequestadvice/save',
   searchCaptureIncomingRequest: 'val/api/val/incomingrequestadvice/search',
   saveCheckInDiplomat: 'val/api/val/checkin/search',
   searchCheckInDiplomat: 'val/api/val/checkin/search',
   searchEnquireShipment:' val/api/val/enquire/search',
   searchInboundShipment:'val/api/val/inboundshipmentmonitoring/search',
   
/* VAL END */

/*AWB SHIPMENT STARTS*/

  searchIrregularity: 'awb/api/shpmng/irregularity/search',
  addIrregularity: 'awb/api/shpmng/irregularity/add',
  saveIrregularity: 'awb/api/shpmng/irregularity/save',
  deleteIrregularity: 'awb/api/shpmng/irregularity/delete',
  getShipmentNumber: 'shp/api/shpmng/reuse/search',
  getAllShipmentNumber: 'shp/api/shpmng/reuse/searchAll',
  addShipmentNumber:'shp/api/shpmng/reuse/add',
  deleteShipmentNumber: 'shp/api/shpmng/reuse/delete',

/*AWB SHIPMENT END*/ 

};

export const CFG_ENV = {
   /**
  * Setting For Core Services(service.js) ---->START  */



  serviceBaseURL: 'http://localhost:3000/',
  userProfileURL: 'services/security/user-profile',
  accessControlListURL: 'services/security/access-control-list',
  i18nGlobalListURL: 'services/master/i18n-global-list',
  menuFunctionListURL: 'services/security/menu-function-list',
  autoCompleteURL: 'services/master/autocomplete-data',
  dropDownListURL: 'services/master/dropdown-data',
  dropDownQueryListURL: 'services/master/dropdown-data',
  LOVURL: 'services/master/lov-data',

  /*Setting For Core Services(service.js) --> END */

  /**
    * Setting For Core Services(LocalHost) ---->START
  */

  // serviceBaseURL: 'http://localhost',
  // PORT: ':8080/',
  // userProfileURL: 'configuration/services/security/user-profile',
  // accessControlListURL: 'admin/api/security/access-control-list',
  // i18nGlobalListURL: 'configuration/api/security/i18n-list',
  // menuFunctionListURL: 'configuration/services/security/menu-function-list',
  // autoCompleteURL: 'configuration/services/master/autocomplete-data',
  // dropDownListURL: 'configuration/api/config/dropdown-data',
  // dropDownQueryListURL: 'configuration/api/masters/dropdown-data',
  // LOVURL: 'configuration/api/masters/lov/searchLOV',

   /**
    * Setting For Core Services(LocalHost) ---->END
  */



};
/*-----------------------FLIGHT Module----------------------------*/
export const FLT_ENV = {
  serviceBaseURL: 'http://localhost:3000/',

};
/*-----------------------IMPORT Module----------------------------*/
export const IMP_ENV = {
  serviceBaseURL: 'http://localhost:3000/',

};
/*-----------------------EXPORT Module----------------------------*/
export const EXP_ENV = {
  serviceBaseURL: 'http://localhost:3000/',

};
/*-----------------------MASTER Module----------------------------*/
export const MST_ENV = {
  serviceBaseURL: 'http://localhost:3000/',

};
/*-----------------------ULD Module----------------------------*/
export const ULD_ENV = {
  serviceBaseURL: 'http://localhost:3000/',

};
/*-----------------------AWB Management Module----------------------------*/
export const AWB_ENV = {
  serviceBaseURL: 'http://localhost:3000/',

};
/*--------------------VALUBLE CARGO Management Module---------------------*/
export const VAL_ENV = {
  serviceBaseURL: 'http://localhost:3000/',

};
/*-----------------------ADMIN Management Module----------------------------*/
export const ADM_ENV = {
  serviceBaseURL: 'http://localhost:3000/',

};
