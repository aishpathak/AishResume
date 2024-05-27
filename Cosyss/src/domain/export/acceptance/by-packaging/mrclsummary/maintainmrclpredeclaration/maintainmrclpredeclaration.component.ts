import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import {
  NgcFormGroup, NgcFormArray, NgcPage,
  NgcButtonComponent, NgcFormControl, NgcReportComponent, NgcUtility, DateTimeKey, UserProfile, NgcFileUploadComponent, PageConfiguration
} from 'ngc-framework';
import { ActivatedRoute, } from '@angular/router';
import { MrclpredeclarationService } from './mrclpredeclaration.service';
import { Router } from '@angular/router';
import { ReportForMrclPreDeclaration, SearchSpecialCargoShipmentForHO } from '../../../../export.sharedmodel';
import { BuildupService } from '../../../../buildup/buildup.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-maintainmrclpredeclaration',
  templateUrl: './maintainmrclpredeclaration.component.html',
  styleUrls: ['./maintainmrclpredeclaration.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class MaintainmrclpredeclarationComponent extends NgcPage implements OnInit {
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @ViewChild('addButton') addButton: NgcButtonComponent;


  title = 'Maintain mrcl Pre-Declaration';
  showDataTable = false;
  secrTranspMethod: any;
  acceptanceType: any;
  prelodgeServiceNo: any;
  documentPieces: any;
  agentName: any;
  agentIATACode: any;
  documentWeight: any;
  prelodgeCreationDateFrom: any;
  shipmentNumber: any;
  responseArray: any = null;
  searchResult: boolean = false;
  createNewmRCL = false;
  flgDGchk: boolean = false;
  /**display Date for planned cargo */
  dateObj = formatDate(NgcUtility.getCurrentDateOnly(), 'dd-MMM-yyyy', 'en_US');
  today = this.dateObj;
  tomorrow = formatDate(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 1, DateTimeKey.DAYS), 'dd-MMM-yyyy', 'en_US');
  dAtomorrow = formatDate(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 2, DateTimeKey.DAYS), 'dd-MMM-yyyy', 'en_US') + ' Onwards'; lithiumBatteryFlagForMix: boolean;
  shcsFromService: any;
  lithiumBatteryFlag: boolean;
  ;
  /**used in select fun for clearance table*/
  dutiableCommodities: boolean = false;
  exportProhibitedArticle: boolean = false;
  /**Used in planned cargo delivery status validation */
  rACSorFKC: boolean = false;
  forToday: any;
  forTomo: any;
  forDAT: any;
  flightDate: any = NgcUtility.getCurrentDateOnly();
  //for planned cargo retrieval
  todayFlag: boolean = false;
  tomorrowFlag: boolean = false;
  tomorrowOnwardsFlag: boolean = false;
  plannedCargoActiveSTatus: boolean = true;
  screeningExeUploadFlg: boolean = false;
  reportType: string;
  reportParameters: any;
  serviceStatus: any;
  disableSave: boolean = false;
  flightIdforDropdown;
  flightOffPoint: any;
  response;
  disableTareWeightEntry = false;
  editUldTrolleyFlag = false;
  piVar: any = new Array();
  batteryFlg: boolean;
  piArrayCBFlag: boolean;
  duplicateFlag: boolean;
  notduplicateFlg: boolean;
  /* controler names for  maintainmrclpredeform */
  maintainmrclpredeform: NgcFormGroup = new NgcFormGroup({
    agentName: new NgcFormControl(),
    agentCustomerId: new NgcFormControl(),
    prelodgeServiceNo: new NgcFormControl(),
    prelodgeDocumentId: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    documentDestination: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    countryCode: new NgcFormControl(),
    contourCode: new NgcFormControl(),
    documentPieces: new NgcFormControl(0),
    documentWeight: new NgcFormControl(0.00),
    dg: new NgcFormControl(false),
    dutiableCommodities: new NgcFormControl(false),
    exportProhibitedArticle: new NgcFormControl(false),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    spx: new NgcFormControl(true),
    unk: new NgcFormControl(false),
    securityCheck: new NgcFormControl(),
    natureOfGoodsDescription: new NgcFormControl(),
    specialHandlingCode: new NgcFormArray([]),

    //todo with dateform controlnames
    dateFormToday: new NgcFormControl(),
    dateFormTomorrow: new NgcFormControl(),
    dateFormdAtomorrow: new NgcFormControl(),
    plannedCargoDeliveryOn: new NgcFormControl(),
    agentIATACode: new NgcFormControl(),
    packagingInformationList: new NgcFormArray([
      new NgcFormGroup({
        reference: new NgcFormControl()
      })
    ]),

    notificationInfo1: new NgcFormControl(),
    notificationInfo2: new NgcFormControl(),
    notificationInfo3: new NgcFormControl(),
    truckNumber: new NgcFormControl(),
    airsideAcceptance: new NgcFormControl(false),
    directTow: new NgcFormControl(false),
    handCarry: new NgcFormControl(false),
    securityScreeningOption: new NgcFormControl(),
    xRayscreen: new NgcFormControl(true),
    rACSorFKC: new NgcFormControl(false),
    screeningExempted: new NgcFormControl(false),
    screeningExemptedReason: new NgcFormControl(),
    plasticSheetColor: new NgcFormControl(),
    screeningSecuredTransportationMethod: new NgcFormControl(),
    viewUpload: new NgcFormControl(),
    serviceStatus: new NgcFormControl(),
    shipmentStatus: new NgcFormControl(),
    acceptanceType: new NgcFormControl(),
    issueDate: new NgcFormControl(),
    expiryDate: new NgcFormControl(),
    heightCode: new NgcFormControl(),
    clearance: new NgcFormArray([

    ]),
    racsf: new NgcFormArray([

    ]),
    screeningRemarks: new NgcFormControl(),
    dimesion: new NgcFormArray([
      new NgcFormGroup({
        sel: new NgcFormControl(),
        length: new NgcFormControl(),
        width: new NgcFormControl(),
        height: new NgcFormControl(),
        pieces: new NgcFormControl()
      })
    ]),
    // notes: new NgcFormControl(),
    cargoBreakDownDetails: new NgcFormArray([


    ]),
    uldInfo: new NgcFormArray([
      new NgcFormGroup({
        sel: new NgcFormControl(),
        documentPieces: new NgcFormControl(),
        documentWeight: new NgcFormControl(),
        uldNumber: new NgcFormControl(),
        heightCode: new NgcFormControl()
      })
    ])
  });


  constructor(appZone: NgZone
    , private router: Router
    , appElement: ElementRef
    , appContainerElement: ViewContainerRef
    , private activatedRoute: ActivatedRoute, private mrclpredeclarationService: MrclpredeclarationService,
    private cd: ChangeDetectorRef, private buildUpService: BuildupService
  ) {
    super(appZone, appElement, appContainerElement,
    );
    this.showDataTable = false;
  }

  ngOnInit() {

    const param = this.getNavigateData(this.activatedRoute); // to get the title for the page
    this.maintainmrclpredeform.patchValue(param);
    if (param.acceptanceType) {
      this.acceptanceType = param.acceptanceType;
      this.title = this.title + ' ' + '(' + this.acceptanceType + ')';
    }
    if (param.prelodgeServiceNo) {
      var prelodgeServiceNo = param.prelodgeServiceNo;
      this.maintainmrclpredeform.get('prelodgeServiceNo').setValue(prelodgeServiceNo);

      this.createNewmRCL = false;
      this.onEdit(param);

    }
    else {
      const sending = {};
      this.mrclpredeclarationService.getmRCLNumber(sending).subscribe(data => {
        var prelodgeServiceNo = data.data;
        this.maintainmrclpredeform.get('prelodgeServiceNo').setValue(prelodgeServiceNo);
      });
      this.createNewmRCL = true;
      if (param.acceptanceType === 'Bulk' || param.acceptanceType === 'Prepack') {
        let req = this.maintainmrclpredeform.getRawValue();
        this.mrclpredeclarationService.getCarrierCodeByShipment(req).subscribe(data => {
          if (data != null) {
            this.maintainmrclpredeform.get('carrierCode').setValue(data.data);
          }
        });
      }
      else if (param.acceptanceType === 'Mix') {
        let req = this.maintainmrclpredeform.getRawValue();
        this.mrclpredeclarationService.getCarrierCodeByULD(req).subscribe(data => {
          if (data != null) {
            this.maintainmrclpredeform.get('carrierCode').setValue(data.data);
          }
        });
      }


      for (let i = 0; i < 5; i++) {
        (<NgcFormArray>this.maintainmrclpredeform.get('packagingInformationList')).addValue([this.patchList]);
      }
      (<NgcFormArray>this.maintainmrclpredeform.get('cargoBreakDownDetails')).controls.forEach(element => {
        for (let i = 0; i <= 5; i++) {
          (<NgcFormArray>element.get('packagingInformationList')).addValue([this.patchList]);
        }
      });
    }
    this.addCragoBreakDownTbl();
    this.todayFlag = true;
  }
  private patchList = {
    reference: null
  }
  clear(event): void {
    this.maintainmrclpredeform.reset();
    this.resetFormMessages();
  }
  public onCancel(event) {
    this.navigateBack(this.maintainmrclpredeform.getRawValue);
  }
  onDeleteButton(event) {
    const sendReq = this.maintainmrclpredeform.getRawValue();
    this.mrclpredeclarationService.getmRCLpreDeDelete(sendReq).subscribe(data => {
      if (data.success === true) {
        this.showSuccessStatus("deleted");
      }
    });
    this.navigateTo(this.router, 'export/acceptance/mRCLSummary', null);
  }
  onCreateBooking(event) {
    this.showMessage("It will navigates to truck doc Booking");
  }
  /** onEdit  */
  onEdit(param) {
    if (param.prelodgeServiceNo) {
      this.createNewmRCL = false;
      /**Patch the form values on EDIT button */

      const requestObject = {
        prelodgeServiceNo: param.prelodgeServiceNo, prelodgeDocumentId: param.prelodgeDocumentId, shipmentStatus: param.shipmentStatus, acceptanceType: param.acceptanceType
      };
      this.mrclpredeclarationService.getmRCLRetrieveDetails(requestObject).subscribe(data => {
        if (data.data.plannedCargoDeliveryValues.active == false) {
          var dateStatus = data.data.plannedCargoDeliveryValues.active;
          this.disableSave = true;
          this.showWarningMessage("Record got expired");
        }

        if (data.data.airsideAcceptance === true) {
          data.data.securityScreeningOption == false;
        }

        this.serviceStatus = data.data.serviceStatus;
        // for pi lithium batteries
        let piLength = 0
        if (data.data.packagingInformationList.length) {
          piLength = data.data.packagingInformationList.length;
        }
        for (let i = 0; i < 6 - piLength; i++) {
          data.data.packagingInformationList.push(this.patchList);
        }
        // to check Cargobreakdown length 
        if (!(data.data.cargoBreakDownDetails == null) && !(data.data.cargoBreakDownDetails.length === 0)) {
          let cargoLength = data.data.cargoBreakDownDetails.length;
          if (cargoLength > 0) {
            data.data.cargoBreakDownDetails.forEach(element => {
              var piBLength = element.packagingInformationList.length;
              for (let i = 0; i < 6 - piBLength; i++) {
                element.packagingInformationList.push(this.patchList);
              }
            });
          }
        }
        this.maintainmrclpredeform.patchValue(data.data);
        this.prelodgeServiceNo = data.data.prelodgeServiceNo;
        this.documentPieces = data.data.documentPieces;
        this.documentWeight = data.data.documentWeight;
        this.prelodgeCreationDateFrom = data.data.prelodgeCreationDateFrom;
        console.log(" this.prelodgeCreationDateFrom", this.prelodgeCreationDateFrom);
        this.agentName = data.data.agentName;
        this.agentIATACode = data.data.agentIATACode;
        if (data.data.securityCheck == "SPX") {
          this.maintainmrclpredeform.get('spx').setValue(true);
        } else {
          this.maintainmrclpredeform.get('unk').setValue(true);
        }
        /* on security screening option 3 radio buttons*/
        if (data.data.airsideAcceptance === true) {
          this.maintainmrclpredeform.get('xRayscreen').setValue(false);

          this.maintainmrclpredeform.get('rACSorFKC').setValue(false);

          this.maintainmrclpredeform.get('screeningExempted').setValue(false);

        } else {
          if (data.data.securityScreeningOption == "x-Ray") {
            this.maintainmrclpredeform.get('xRayscreen').setValue(true);
          }
          else if (data.data.securityScreeningOption == "RACSF") {
            this.maintainmrclpredeform.get('rACSorFKC').setValue(true);
          }
          else {
            this.maintainmrclpredeform.get('screeningExempted').setValue(true);
          }
        }
        /**For Planned cargo delivery */
        if (data.data.plannedCargoDeliveryValues) {
          this.today = formatDate(data.data.plannedCargoDeliveryValues.date1, 'dd-MMM-yyyy', 'en_US');
          this.tomorrow = formatDate(data.data.plannedCargoDeliveryValues.date2, 'dd-MMM-yyyy', 'en_US');
          this.dAtomorrow = formatDate(data.data.plannedCargoDeliveryValues.date3, 'dd-MMM-yyyy', 'en_US') + ' Onwards';
          this.plannedCargoActiveSTatus = data.data.plannedCargoDeliveryValues.active;
        }
        if (data.data.plannedCargoDeliveryValues.chosenOption == '1') {
          this.todayFlag = true;
        }
        else if (data.data.plannedCargoDeliveryValues.chosenOption == '2') {
          this.tomorrowFlag = true;
        }
        else if (data.data.plannedCargoDeliveryValues.chosenOption == '3') {
          this.tomorrowOnwardsFlag = true;
        }
      });
    }
    else {
      this.createNewmRCL = true;
    }
  }
  /**add button function to add empty row for clearance Table */
  onAddClearanceTbl() {
    (<NgcFormArray>this.maintainmrclpredeform.get('clearance')).addValue([
      {
        sel: '',
        documentType: '',
        documentNo: '',
        issueDate: '',
        expiryDate: '',
      }
    ]);
  }
  onAddRacsfTable() {
    (<NgcFormArray>this.maintainmrclpredeform.get('racsf')).addValue([
      {
        sel: '',
        truckerId: '',
        truckerName: '',
        truckNumber: this.maintainmrclpredeform.get('truckNumber').value,
        sealNo: '',
        facilityCode: '',
        guardName: '',
        guardId: '',

      }
    ])

  }

  onSelectFunction(eve) {
    this.secrTranspMethod = eve;
  }


  /**Add funtion to add dimensionList table*/
  addDimensionListTable() {
    (<NgcFormArray>this.maintainmrclpredeform.get('dimesion')).addValue([
      {
        sel: '',
        sNo: '',
        length: '',
        width: '',
        height: '',
        pieces: '',
      }
    ]);
  }

  /**Function to add CragoBreakDownList in the table */
  addCragoBreakDownTbl() {
    this.createRow();
  }
  private cargoBreakdownDetails = {
    sel: null,
    sNo: null,
    shipmentNumber: '',
    nonIATA: '',
    documentDestination: this.maintainmrclpredeform.get('truckNumber').value,
    documentPieces: '',
    documentWeight: 0.00,
    natureOfGoodsDescription: '',
    specialHandlingCode: [],
    packagingInformationList: [],
    notificationInfo1: '',
    notificationInfo2: '',
    notificationInfo3: ''
  }

  public shcForMix(event) {
    let uldSHCsFlag: boolean = false;
    let formSHCs: any = new Array();
    (<NgcFormArray>this.maintainmrclpredeform.get('specialHandlingCode')).controls.forEach(i => {
      formSHCs.push(i.get('specialHandlingCode').value);
    });
    (<NgcFormArray>this.maintainmrclpredeform.get('cargoBreakDownDetails')).controls.forEach(element => {
      let uldSHCs: any;
      (<NgcFormArray>element.get('specialHandlingCode')).controls.forEach(ele => {
        ele.get('specialHandlingCode').value;
        uldSHCs = ele.get('specialHandlingCode').value;
      });
      for (let i = 0; i < formSHCs.length; i++) {
        if (uldSHCs == formSHCs[i]) {
          uldSHCsFlag = true;
          return;
        }
        else {
          uldSHCsFlag = false;
        }
      }
      if (uldSHCsFlag == false) {
        (this.maintainmrclpredeform.get("specialHandlingCode") as NgcFormArray).addValue([{ 'specialHandlingCode': uldSHCs }]);
        uldSHCs = '';
      }
    });

    this.lithiumBatteryFlagForMix = true;
    this.retrieveLOVRecords('SHC_WITH_GROUP').subscribe(data => {
      (<NgcFormArray>this.maintainmrclpredeform.get('cargoBreakDownDetails')).controls.forEach(element => {

        this.shcsFromService = element.get(['specialHandlingCode']).value.map(shc => shc.specialHandlingCode);
        console.log("this.shcsFromService", this.shcsFromService);
      });
      let shcsArray: Array<any> = new Array();
      shcsArray = this.shcsFromService;
      const shcs = data.filter(shc => this.shcsFromService.includes(shc.code));
      console.log("shcs", shcs);
      let i = 0;
      const ELICount = shcs.filter(obj => (obj.param2 === 'ELI'));
      if (ELICount.length > 0) {
        this.lithiumBatteryFlagForMix = false;
      } else {
        this.lithiumBatteryFlagForMix = true;
      }

      let j = 0;
      let dgrobj = [];
      let dgrEliobj = [];
      shcsArray.forEach(ele => {
        let filteredShc = shcs.filter(obj => (obj.code === ele));
        let dgrobj = filteredShc.filter(obj => (obj.param2 === 'DGR'));
        let dgrEliobj = filteredShc.filter(obj => (obj.param2 === 'ELI'));
        if (dgrobj.length > 0 && dgrEliobj.length == 0) {
          j++;
        }
      })
      if (j > 0) {
        this.maintainmrclpredeform.get('dg').setValue(true);
      }
      else {
        this.maintainmrclpredeform.get('dg').setValue(false);
      }
      //  })
    });

  }

  /**to add cargobreakdown rows */
  createRow() {
    this.cargoBreakdownDetails.packagingInformationList = [];

    for (let i = 0; i < 6; i++) {
      this.cargoBreakdownDetails.packagingInformationList.push(this.patchList);
    }
    (<NgcFormArray>this.maintainmrclpredeform.get('cargoBreakDownDetails')).addValue([
      this.cargoBreakdownDetails
    ]);
  }
  /* add funtion to add Uld Info table   */
  addUld() {
    (<NgcFormArray>this.maintainmrclpredeform.get('uldInfo')).addValue([
      {
        sel: '',
        SNo: '',
        documentPieces: '',
        documentWeight: 0.00,
        uldNumber: '',
        heightCode: '',
      }
    ]);
  }
  funForMixNatureOfGoods(event) {
    if (this.maintainmrclpredeform.get('acceptanceType').value == "Mix") {
      this.showErrorMessage('Cargobreakdown.to.get.NOG.for.ULD');
      return
    }
  }

  /* Save Function to save the mRCL Pre-Declaration data  */
  onSave(event) {
    this.resetFormMessages();
    this.maintainmrclpredeform.validate();
    if (!this.maintainmrclpredeform.valid) {
      this.showErrorMessage("edi.enter.mandatory.fields");
      return;
    }
    /*validation for shc and pi batteries for cargobreakdown */
    let cargoBreakDownSHC = false;
    let cargoBreakDownPILIBatteries = false;
    (<NgcFormArray>this.maintainmrclpredeform.get('cargoBreakDownDetails')).controls.forEach(element => {
      (<NgcFormArray>element.get('specialHandlingCode')).controls.forEach(ele => {
        if (ele.get('specialHandlingCode').value === 'ELI' || ele.get('specialHandlingCode').value === 'ELM' ||
          ele.get('specialHandlingCode').value === 'RLI' || ele.get('specialHandlingCode').value === 'RLM' || element.get('specialHandlingCode').value === 'RBI' ||
          ele.get('specialHandlingCode').value === 'EBI' || ele.get('specialHandlingCode').value === 'RBM' || element.get('specialHandlingCode').value === 'EBM') {
          cargoBreakDownSHC = true;
        }
      });
      (<NgcFormArray>element.get('packagingInformationList')).controls.forEach(ele => {
        if (ele.get('reference').value && ele.get('reference').value != null) {
          cargoBreakDownPILIBatteries = true;
        }
      });
    });
    if (cargoBreakDownSHC && !cargoBreakDownPILIBatteries) {
      this.showErrorStatus("pi.Lithium.Battery.is.mandatory.for.CargoBreakdown");
      return;
    }
    if (!cargoBreakDownSHC && cargoBreakDownPILIBatteries) {
      this.showErrorStatus("choose.SHC.for.piLithiumBattery.for.CargoBreakdown");
      return;
    }
    /**For Planned cargo delivery  */
    if (this.maintainmrclpredeform.get('dateFormToday').value == true) {
      if (this.plannedCargoActiveSTatus == true) {
        this.forToday = this.dateObj;
        this.forToday = formatDate(this.forToday, 'yyyy-MM-dd', 'en_US');
        this.maintainmrclpredeform.get('plannedCargoDeliveryOn').setValue(this.forToday);
      }
      else {
        this.showErrorStatus("Record.is.expired");
        return;
      }
    }
    else if (this.maintainmrclpredeform.get('dateFormTomorrow').value == true) {
      if (this.plannedCargoActiveSTatus == true) {
        this.forTomo = NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 1, DateTimeKey.DAYS);
        this.maintainmrclpredeform.get('plannedCargoDeliveryOn').setValue(this.forTomo);
      }
      else {
        this.showErrorStatus("Record.is.expired");
        return;
      }
    }
    else if (this.maintainmrclpredeform.get('dateFormdAtomorrow').value == true) {
      if (this.plannedCargoActiveSTatus == true) {
        this.forDAT = NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 2, DateTimeKey.DAYS);
        this.maintainmrclpredeform.get('plannedCargoDeliveryOn').setValue(this.forDAT);
      } else {
        this.showErrorStatus("Record.is.expired");
        return;
      }
    }

    /* validation for shc and Pi Lithium battery*/
    // let shcFlag = false;
    // (<NgcFormArray>this.maintainmrclpredeform.get('specialHandlingCode')).controls.forEach(ele => {
    //   if (ele.get('specialHandlingCode').value === 'ELI' || ele.get('specialHandlingCode').value === 'ELM' ||
    //     ele.get('specialHandlingCode').value === 'RLI' || ele.get('specialHandlingCode').value === 'RLM' || ele.get('specialHandlingCode').value === 'RBI' ||
    //     ele.get('specialHandlingCode').value === 'EBI' || ele.get('specialHandlingCode').value === 'RBM' || ele.get('specialHandlingCode').value === 'EBM') {
    //     shcFlag = true;
    //   }
    // });
    let piLiFlag = false;

    (<NgcFormArray>this.maintainmrclpredeform.get('packagingInformationList')).controls.forEach(ele => {
      if (ele.get('reference').value && ele.get('reference').value != null) {
        piLiFlag = true;
      }
    });
    if (this.lithiumBatteryFlag == false && piLiFlag) {
      this.showErrorStatus("SHC.is.mandatory.for.pi.Lithium.Battery");
      return;
    }
    // if (this.maintainmrclpredeform.get('acceptanceType').value === 'Bulk' || this.maintainmrclpredeform.get('acceptanceType').value === 'Prepack') {
    //   if (shcFlag && !piLiFlag) {
    //     this.showErrorStatus("pi Lithium Battery is mandatory");
    //     return;
    //   }
    // }
    // if (!shcFlag && piLiFlag) {
    //   this.showErrorStatus("Special Handling Code  is mandatory for pi Lithium Battery");
    //   return;
    // }

    if (this.lithiumBatteryFlag == false && (this.acceptanceType == 'Bulk' || this.acceptanceType == 'Prepack')) {
      let PIFilter = (this.maintainmrclpredeform.get(['packagingInformationList']) as NgcFormArray).getRawValue().filter(obj => (obj.reference != null));
      if (PIFilter == null || PIFilter.length == 0) {
        this.showErrorStatus("Atleast.One.PI.Lithium.Battery.is.Mandatory");
        return false;
      }
    }
    if (this.lithiumBatteryFlagForMix == false && this.acceptanceType == 'Mix') {
      let PIFilterCB: any;
      (<NgcFormArray>this.maintainmrclpredeform.get('cargoBreakDownDetails')).controls.forEach(element => {
        PIFilterCB = (element.get(['packagingInformationList']) as NgcFormArray).getRawValue().filter(obj => (obj.reference != null));
      });
      if (PIFilterCB == null || PIFilterCB.length == 0) {
        this.showErrorStatus("Atleast.One.PI.Lithium.Battery.is.Mandatory");
        return false;
      }
    }
    /*validation for Flight Number and Flight date*/
    const searchReq = new SearchSpecialCargoShipmentForHO();
    searchReq.flightKey = this.maintainmrclpredeform.get('flightKey').value;
    searchReq.flightDate = this.maintainmrclpredeform.get('flightDate').value;
    if (searchReq.flightKey != null && searchReq.flightDate != null) {
      this.mrclpredeclarationService.validateFlight(searchReq).subscribe(response => {
        if (!response.success) {
          this.showErrorMessage("invalid.flight");
          return;
        }
      });
    }
    /**For Security check Radio buttons */
    if (this.maintainmrclpredeform.get('spx').value == true) {
      this.maintainmrclpredeform.get('securityCheck').setValue('SPX');
    }
    else {
      this.maintainmrclpredeform.get('securityCheck').setValue('UNK');
    }
    /**For Security screening option radio buttons  */
    if (this.maintainmrclpredeform.get('xRayscreen').value == true) {
      this.maintainmrclpredeform.get('securityScreeningOption').setValue('x-Ray');
    }
    else if (this.maintainmrclpredeform.get('rACSorFKC').value == true) {
      this.maintainmrclpredeform.get('securityScreeningOption').setValue('RACSF');

    } else if (this.maintainmrclpredeform.get('screeningExempted').value == true) {
      this.maintainmrclpredeform.get('securityScreeningOption').setValue('screeningExempted');
    }
    this.maintainmrclpredeform.get('serviceStatus').setValue('Submited')
    this.maintainmrclpredeform.get('shipmentStatus').setValue('Submited')
    /**Validation for SHC duplication in Mix & Setting Nature of Goods for mix  */
    if (this.maintainmrclpredeform.get('acceptanceType').value === 'Mix') {
      let varshccargo: any = new Array();
      let varshccargo1: any;
      let varshccargo2: any;
      (<NgcFormArray>this.maintainmrclpredeform.get('cargoBreakDownDetails')).controls.forEach(ele => {
        varshccargo.push(ele.get('shipmentNumber').value);
      })
      for (let i = 0; i < varshccargo.length; i++) {
        varshccargo1 = varshccargo[0];
      }
      varshccargo2 = "UNK-" + varshccargo1
      this.maintainmrclpredeform.get('natureOfGoodsDescription').setValue(varshccargo2);
    }

    let userInfo: UserProfile = this.getUserProfile();
    this.maintainmrclpredeform.get('agentCustomerId').setValue(userInfo.customerId);

    /*Getting all the raw data in an object*/
    const request = this.maintainmrclpredeform.getRawValue();

    this.mrclpredeclarationService.getmRCLpreDeSave(request).subscribe(data => {
      if (this.showResponseErrorMessages(data)) {
        return;
      }
      this.searchResult = true;
      if (data.success === true) {
        this.showSuccessStatus("status.Success");

        /*Navigating data to Summary page after save operation */
        if (this.maintainmrclpredeform.get('acceptanceType').value === 'Mix') {
          var dataTosendMix = {
            securityScreeningOption: this.maintainmrclpredeform.get('securityScreeningOption').value,
            uldNumber: this.maintainmrclpredeform.get('uldNumber').value,
            acceptanceType: this.maintainmrclpredeform.get('acceptanceType').value,
            shipmentStatus: data.data.shipmentStatus,
            prelodgeServiceNo: data.data.prelodgeServiceNo,
            prelodgeCreationDateFrom: data.data.shipmentDate,
            prelodgeCreationDateTo: NgcUtility.addDate(data.data.shipmentDate, 59, DateTimeKey.MINUTES)
          };

          this.navigateTo(this.router, 'export/acceptance/mRCLSummary', dataTosendMix);
        }
        else if (this.maintainmrclpredeform.get('acceptanceType').value === 'Bulk' || this.maintainmrclpredeform.get('acceptanceType').value === 'Prepack') {
          var dataTosend = {
            securityScreeningOption: this.maintainmrclpredeform.get('securityScreeningOption').value,
            shipmentNumber: this.maintainmrclpredeform.get('shipmentNumber').value,
            acceptanceType: this.maintainmrclpredeform.get('acceptanceType').value,
            shipmentStatus: data.data.shipmentStatus,
            prelodgeServiceNo: data.data.prelodgeServiceNo,
            prelodgeCreationDateFrom: data.data.shipmentDate,
            prelodgeCreationDateTo: NgcUtility.addDate(data.data.shipmentDate, 59, DateTimeKey.MINUTES)
          };
          this.navigateTo(this.router, 'export/acceptance/mRCLSummary', dataTosend);
        }
      }
    });
  }// end of onSave


  onChangeTruckNumber(event) {
    (<NgcFormArray>this.maintainmrclpredeform.get('racsf')).controls.forEach(element => {
      if (!element.get('truckNumber') || element.get('truckNumber').value == null)
        element.get('truckNumber').setValue(event);
    });
  }
  selectDGOpt(event) {
    if (this.maintainmrclpredeform.get('dg').value == true) {
      let isDGRSHCChosen = false;
      (<NgcFormArray>this.maintainmrclpredeform.get('specialHandlingCode')).controls.forEach(element => {
        if (element.get('specialHandlingCode').value === 'DGR') {
          isDGRSHCChosen = true;
        }
      });
      if (!isDGRSHCChosen) {
        (this.maintainmrclpredeform.get("specialHandlingCode") as NgcFormArray).addValue([{ 'specialHandlingCode': 'DGR' }])
      }
    }

  }
  selectdutiableCommoditiesOpt(event) {
    this.dutiableCommodities = this.maintainmrclpredeform.get('dutiableCommodities').value;
  }
  selectexportProhibitedArticleOpt(event) {
    this.exportProhibitedArticle = this.maintainmrclpredeform.get('exportProhibitedArticle').value;
  }
  /* if true RACSF table displays Also Making airsideAcceptance as reset*/
  selectracsfOpt(event) {
    this.rACSorFKC = this.maintainmrclpredeform.get('rACSorFKC').value;
    this.maintainmrclpredeform.get('airsideAcceptance').reset();
    this.maintainmrclpredeform.get('spx').setValue(false);
    this.maintainmrclpredeform.get('unk').setValue(false);
  }
  selectXRayOpt(event) {
    this.maintainmrclpredeform.get('airsideAcceptance').reset();
  }
  /*to display upload button when screening exempted is selected */
  onSelectScreeningExempted(event) {
    this.maintainmrclpredeform.get('spx').setValue(false);
    this.maintainmrclpredeform.get('unk').setValue(false);
    this.maintainmrclpredeform.get('airsideAcceptance').reset();
    this.screeningExeUploadFlg = false;
    if (this.maintainmrclpredeform.get('screeningExempted').value == true) {
      this.screeningExeUploadFlg = true;
    }
  }


  /**Common delete button functionality for clearance / license table */
  onDeleteClearance() {
    const formValue = this.maintainmrclpredeform.getRawValue();
    const clearanceList = formValue.clearance;
    const deleteClearance = new Array<any>();
    clearanceList.forEach(element => {
      if (element.sel) {
        deleteClearance.push(element);
      }
    });
    (<NgcFormArray>this.maintainmrclpredeform.controls['clearance']).deleteValue(deleteClearance);
    this.cd.detectChanges();
  }
  /**Common delete button functionality for racsf table  */
  onDeleteRacsf() {
    const formValue = this.maintainmrclpredeform.getRawValue();
    const racsfList = formValue.racsf;
    const deleteRacsf = new Array<any>();
    racsfList.forEach(element => {
      if (element.sel) {
        deleteRacsf.push(element);
      }
    });
    (<NgcFormArray>this.maintainmrclpredeform.controls['racsf']).deleteValue(deleteRacsf);
    this.cd.detectChanges();
  }
  /**Common delete button functionality for Dimension table  */
  onDeleteDimension() {
    const formValue = this.maintainmrclpredeform.getRawValue();
    const dimensionList = formValue.dimesion;
    const deleteDimension = new Array<any>();
    dimensionList.forEach(element => {
      if (element.sel) {
        deleteDimension.push(element);
      }
    });
    (<NgcFormArray>this.maintainmrclpredeform.controls['dimesion']).deleteValue(deleteDimension);
    this.cd.detectChanges();
  }
  /**Common delete button functionality for cargo breakdown table  */
  onDeleteCargoBreakDownDetails() {
    const formValue = this.maintainmrclpredeform.getRawValue();
    const cargoBreakDownDetailsList = formValue.cargoBreakDownDetails;
    const deleteCargoBreakDownDetails = new Array<any>();
    cargoBreakDownDetailsList.forEach(element => {
      if (element.sel) {
        deleteCargoBreakDownDetails.push(element);
      }
    });
    (<NgcFormArray>this.maintainmrclpredeform.controls['cargoBreakDownDetails']).deleteValue(deleteCargoBreakDownDetails);
    this.cd.detectChanges();
  }
  /**Common delete button functionality for ULDInfo table  */
  onDeleteuldInfo() {
    const formValue = this.maintainmrclpredeform.getRawValue();
    const uldInfoList = formValue.uldInfo;
    const deleteuldInfo = new Array<any>();
    uldInfoList.forEach(element => {
      if (element.sel) {
        deleteuldInfo.push(element);
      }
    });
    (<NgcFormArray>this.maintainmrclpredeform.controls['uldInfo']).deleteValue(deleteuldInfo);
    this.cd.detectChanges();
  }
  onShcChanges(event) {
    // this.flgDGchk = false;

    // (<NgcFormArray>this.maintainmrclpredeform.get('specialHandlingCode')).controls.forEach(element => {

    //   if (element.get('specialHandlingCode').value === 'DGR') {
    //     this.maintainmrclpredeform.get('dg').setValue(true);
    //     this.flgDGchk = true;
    //   }

    // });
    this.lithiumBatteryFlag = true;
    this.retrieveLOVRecords('SHC_WITH_GROUP').subscribe(data => {
      this.shcsFromService = this.maintainmrclpredeform.get(['specialHandlingCode']).value.map(shc => shc.specialHandlingCode);
      console.log("this.shcsFromService", this.shcsFromService);

      let shcsArray: Array<any> = new Array();
      shcsArray = this.shcsFromService;
      const shcs = data.filter(shc => this.shcsFromService.includes(shc.code));
      console.log("shcs", shcs);
      let i = 0;
      const ELICount = shcs.filter(obj => (obj.param2 === 'ELI'));
      if (ELICount.length > 0) {
        this.lithiumBatteryFlag = false;
      } else {
        this.lithiumBatteryFlag = true;
      }

      let j = 0;
      let dgrobj = [];
      let dgrEliobj = [];
      shcsArray.forEach(ele => {
        let filteredShc = shcs.filter(obj => (obj.code === ele));
        let dgrobj = filteredShc.filter(obj => (obj.param2 === 'DGR'));
        let dgrEliobj = filteredShc.filter(obj => (obj.param2 === 'ELI'));
        if (dgrobj.length > 0 && dgrEliobj.length == 0) {
          j++;
        }
      })
      if (j > 0) {
        this.maintainmrclpredeform.get('dg').setValue(true);
      }
      else {
        this.maintainmrclpredeform.get('dg').setValue(false);
      }
      //  })
    });
  }
  /*for destination , to populate country code  */
  onselectCity(event) {
    this.maintainmrclpredeform.get('countryCode').setValue(event.parameter1);
  }
  /** validation for air side acceptance and screening exempted reason */
  onSelectAirsideAcce(event) {

    if (this.maintainmrclpredeform.get('airsideAcceptance').value == true) {
      this.maintainmrclpredeform.get('xRayscreen').reset();
      this.maintainmrclpredeform.get('rACSorFKC').reset();
      this.maintainmrclpredeform.get('screeningExempted').reset();
    }
  }

  print() {
    let reportParameters: ReportForMrclPreDeclaration = this.maintainmrclpredeform.getRawValue();
    let userInfo: UserProfile = this.getUserProfile();
    this.reportParameters = reportParameters;
    this.reportWindow.reportParameters = this.reportParameters;
    if (this.serviceStatus === "Submited") {
      if (this.maintainmrclpredeform.get('acceptanceType').value === 'Bulk') {
        this.reportType = 'mRCLBulkbeforerclfinalized';
      }
      else if (this.maintainmrclpredeform.get('acceptanceType').value === 'Mix') {
        this.reportType = 'mrcl_mixprepackbeforeFinalize_RCL';
      }
      else if (this.maintainmrclpredeform.get('acceptanceType').value === 'Prepack') {
        this.reportType = 'beforemrclprepack';
      }
    }
    else if (this.serviceStatus === "Finalized") {
      this.reportWindow.reportParameters = this.reportParameters;
      if (this.maintainmrclpredeform.get('acceptanceType').value === 'Bulk') {
        this.reportType = 'mRCLBulkafterRclfinalized';
      }
      if (this.maintainmrclpredeform.get('acceptanceType').value === 'Prepack') {
        this.reportType = 'mRCLDeclPrepackAfterfinalize';
      }
      if (this.maintainmrclpredeform.get('acceptanceType').value === 'Mix') {
        this.reportType = 'mRCLDeclMixPrepackAfterfinalize';
      }
    }
    this.reportWindow.reportParameters = this.reportParameters;
    this.reportWindow.open();
  }

  onuldNumberChange(index) {
    // if (!this.maintainmrclpredeform.get(["uldInfo", index, "trolleyInd"]).value) {
    if (this.maintainmrclpredeform.get(["uldInfo", index, "uldNumber"]).value != null
    ) {
      this.serviceGetTareWeight(
        this.transformULDModelFrontToBack(
          (<NgcFormGroup>this.maintainmrclpredeform.get([
            "uldInfo",
            index
          ])).getRawValue()
        ),
        index
      );
    }
    // change source parameter
    // }
  }


  serviceGetTareWeight(uldNoRequest, index) {

    //Clear the message
    this.resetFormMessages();

    if (uldNoRequest.uld.uldNumber.length > 1) {
      //Populate the segment
      this.flightIdforDropdown = this.createSourceParameter(
        this.maintainmrclpredeform.get("flightKey").value,
        this.maintainmrclpredeform.get("flightDate").value
      );

      this.retrieveDropDownListRecords('FLIGHTSEGMENT', 'query', this.flightIdforDropdown)
        .subscribe(data => {
          for (let index = 0; index < data.length; index++) {
            if (data[index].code) {
              uldNoRequest.flightOffPoint = data[index].desc;
              this.flightOffPoint = data[index].desc;
              break;
            }
          }

          this.buildUpService.getTareWeight(uldNoRequest).subscribe(resp => {
            this.response = resp;
            if (this.response &&
              this.response.data &&
              this.response.data.flightMatchesWithICS == false) {
              this.showConfirmMessage(
                "export.flight.details.not.matching.ics.confirmation"
              ).then(fulfilled => {
                this.populateHeightCodeTareWeight(this.response, index);
              }).catch(reason => {
                //Do nothing
                // (<NgcFormControl>this.maintainmrclpredeform.get(["uldInfo", index, "tareWeight"])).setValue(null, { onlySelf: true, emitEvent: false });
                (<NgcFormControl>this.maintainmrclpredeform.get(["uldInfo", index, "heightCode"])).setValue("QL", { onlySelf: true, emitEvent: false });
                (<NgcFormControl>this.maintainmrclpredeform.get(["uldInfo", index, "uldNumber"])).setValue(null, { onlySelf: true, emitEvent: false });
              });
            } else {
              this.populateHeightCodeTareWeight(this.response, index);
            }
          });
        });
    }
  }

  transformULDModelFrontToBack(obj): any {
    const piggyBackULDList = [];

    const addULDRequest = {
      flightKey: this.maintainmrclpredeform.get("flightKey").value,
      flightOriginDate: this.maintainmrclpredeform.get("flightDate").value,
      assUldTrolleyId: obj.assUldTrolleyId,
      flagCRUD: obj.flagCRUD,
      actualLocation: obj.actualLocation,
      wareHouseLocation: obj.wareHouseLocation,
      eic: obj.eic,
      empty: obj.shipmentAssigned,
      reprintTag: obj.reprintTag,
      uld: {
        segmentId: obj.segmentId,
        uldNumber: obj.uldNumber,
        contentCode: obj.contentCode,
        heightCode: obj.heightCode,
        handlingArea: obj.handlingArea,
        remarks: obj.remarks,
        phcFlag: obj.phcFlag,
        eccFlag: obj.eccFlag,
        standByFlag: obj.standByFlag,
        trolleyFlag: obj.trolleyFlag,
        trolleyInd: obj.trolleyInd,
        tareWeight: obj.tareWeight,
        seriesTareWeight: obj.seriesTareWeight,
        loadedWeight: obj.loadedWeight,
        priority: obj.priority,
        loadingStartedOn: null,
        loadingCompletedOn: null,
        handlingServiceGroupId: null,
        reasonIdForMovement: null,
        uldTagPrintedOn: null,
        shipment: null,
        selectULD: obj.selectULD,
        flightOffPoint: this.flightOffPoint,
        transferType: obj.transferType,
        actualGrossWeight: obj.actualGrossWeight
      },
      piggyBackULDList: piggyBackULDList
    };
    return addULDRequest;
  }

  populateHeightCodeTareWeight(response, index) {
    if (index != null) {
      if (this.response.data.uld.heightCode) {
        this.maintainmrclpredeform
          .get(["uldInfo", index, "heightCode"])
          .setValue(this.response.data.uld.heightCode, { onlySelf: true, emitEvent: false });
      }
      if (this.response.data.uld.palletTypeFlag) {
      }
    }
    if (this.response.data.uld.tareWeight) {
      this.disableTareWeightEntry = true;
      if (!this.editUldTrolleyFlag) {
      }
    } else {
      this.disableTareWeightEntry = false;
    }
  }

  onChangePermitType(data, index) {
    this.maintainmrclpredeform.get(['clearance', index, 'issueDate']).setValue(formatDate(data.parameter2, 'yyyy-MM-dd', 'en_US'));
    if (data.parameter3 !== "1900-01-01 00:00:00.0") {
      this.maintainmrclpredeform.get(['clearance', index, 'expiryDate']).setValue(formatDate(data.parameter3, 'yyyy-MM-dd', 'en_US'));
    }
  }

}
