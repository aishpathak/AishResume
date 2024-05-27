import { EventEmitter } from '@angular/core';
// Angular
import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ChangeDetectorRef,
  QueryList, Pipe, ViewChild, AfterViewInit, OnInit
} from '@angular/core';
import { FormGroupDirective, Validator } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationFeatures } from '../../../common/applicationfeatures';

// Application
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NotificationMessage, StatusMessage, NgcWindowComponent, NgcTabComponent,
  DropDownListRequest, MessageType, NgcCheckBoxComponent, NgcUtility, PageConfiguration, DateTimeKey, NgcLOVComponent, NgcDropDownComponent, CodeDescriptionPair
} from 'ngc-framework';

// Maintain Operative Flight
import { FlightService } from '../../../flight/flight.service';
import { FlightRequest, FlightLegs, FlightFcts } from './../../flight.sharedmodel';
import { NgcInputComponent } from 'ngc-framework';
import { ApplicationEntities } from '../../../common/applicationentities';
import { element } from 'protractor';

/**
 *
 * Maintain Operative Flight
 *
 */
@Component({
  selector: 'ngc-maintenanceoperativeflight',
  templateUrl: './maintenanceoperativeflight.component.html',
  styleUrls: ['./maintenanceoperativeflight.component.css']
})
@PageConfiguration({
  trackInit: true,
  autoBackNavigation: true
})
export class MaintenanceoperativeflightComponent extends NgcPage {
  @ViewChild('focusLov') serviceTypeComponent: NgcLOVComponent;
  @ViewChild('jointflt') jointflt: HTMLElement;
  @ViewChild('outboundCancelRemark') outboundCancelRemarkComponent: NgcInputComponent;
  @ViewChild('inboundCancelRemark') inboundCancelRemarkComponent: NgcInputComponent;
  @ViewChild('inboundCancelReason') inboundCancelReasonComponent: NgcDropDownComponent;
  @ViewChild('outboundCancelReason') outboundCancelReasonComponent: NgcDropDownComponent;
  @ViewChild('remarksTab') remarksTabComponent: NgcTabComponent;
  @ViewChild('miscDetailTab') miscDetailTabComponent: NgcTabComponent;
  @ViewChild('stfsTab') stfsTabComponent: NgcTabComponent;
  @ViewChild('flightCompletePopup') flightCompletePopup: NgcWindowComponent;
  flightOriginDate: String;
  private serviceTypeFocused: boolean = false;
  lengthLegList = 0;
  saveflight = 0;
  arrayString = [];
  defaultDate = NgcUtility.getCurrentDateOnly();
  terminalFlag = true;
  autoFlightEnable = false;
  lengthExceptionList = 0;
  defaultTerminal = false;
  lengthExpUldTypeList = 0;
  lengthFactList = 0;
  autoFlightFlag = "off";
  lengthJointFlightList = 0;
  editableBoolean: any;
  bookingStatusFlag = false;
  editableSTD = 0;
  editableSTDFlag = false;
  restoreBoolean = false;
  bookingStatus = false;
  hideHandlerDropdown = true;
  displayFlightInfo = false;
  flagDisplayTerminalDropdownListFalse = false;
  // This flag is used to disable Flight Leg form controls
  disabledControles = 0;
  dateTo: any;
  dateToMax: any;
  igmNumberFlagDisabled: boolean = false;//IGM Number

  // TODO give specific names if possible full names
  resp: any;
  gettingOperativeFlight: any;
  carrierCode: string;
  onSearchFlag = false;
  onSaveFlag = false;
  flag = false;
  flags = 'false';
  flagJoint = false;
  flagApron = false;
  flagDelayIn = false;
  flagDelayOut = false;
  flagExpUld = false;
  flagExpWt = false;
  boardPointFlag = false;
  offPointFlag = false;
  flightAutoCompleteValue = ["On", "Off"];
  derivedHandlingArea = [];// assign  value or response value
  flgSsmAsm = false;
  isSSMActive: boolean = true;
  errors: any[];
  jointGroupCodeParam: any;
  inboundRhoLovParam: any;
  errorMessage: any;
  disableclosebutton: boolean = false;
  autoFlightData: any;
  flightInfoColumn: any = 7;
  flightPriorityColumn: any = 0;
  customsColumn: any = 0;
  customerShortName: String;
  contractorId: any;
  isOnlyIgmEgmEnabled: boolean = false;
  schPresent: boolean = false;
  providerType: any;
  miscDetailIcon: string = "";
  stfsIcon: string = "";
  remarksIcon: string = "";
  showTabs: boolean = false;

  private mntform: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl('', [Validators.minLength(2), Validators.maxLength(3), Validators.pattern('([0-9A-Za-z]{2,3})')]),
    flightNo: new NgcFormControl('', [Validators.minLength(3), Validators.maxLength(5), Validators.pattern('([0-9]{0,4}|[A-Z0-9]{5})')]),
    flightDate: new NgcFormControl(),
    displayfltDate: new NgcFormControl(),
    terminals: new NgcFormControl(),
    serviceType: new NgcFormControl('', [Validators.maxLength(1)]),
    derivedHandlingAreadata: new NgcFormControl(),
    derivedHandlingArea: new NgcFormControl(),
    manuallyAutoFlag: new NgcFormControl(),
    jointFlight: new NgcFormControl(false),
    handlingArea: new NgcFormControl(),
    flgApn: new NgcFormControl(false),
    codPrkBayArr: new NgcFormControl(),
    codPrkBayDep: new NgcFormControl(),
    caoPax: new NgcFormControl(),
    flightId: new NgcFormControl(),
    assisted: new NgcFormControl(),
    flightStatus: new NgcFormControl(),
    inboundGeneralRemark: new NgcFormControl(),
    inboundCancelReason: new NgcFormControl(),
    inboundCancelRemark: new NgcFormControl(),
    inboundOffloadReason: new NgcFormControl(),
    inboundOffloadRemark: new NgcFormControl(),
    inboundAddedReason: new NgcFormControl(),
    inboundAddedRemark: new NgcFormControl(),
    outboundGeneralRemark: new NgcFormControl(),
    outboundCancelReason: new NgcFormControl(),
    outboundCancelRemark: new NgcFormControl(),
    outboundOffloadReason: new NgcFormControl(),
    outboundOffloadRemark: new NgcFormControl(),
    outboundAddedReason: new NgcFormControl(),
    outboundAddedRemark: new NgcFormControl(),
    regisArrival: new NgcFormControl('', [Validators.maxLength(10)]),
    regisDeparture: new NgcFormControl('', [Validators.maxLength(10)]),
    flgSsmAsm: new NgcFormControl(false),
    contractorId: new NgcFormControl(),
    customerShortName: new NgcFormControl(),
    customsImportFlightNumber: new NgcFormControl(),
    customsExportFlightNumber: new NgcFormControl(),
    flgDlyIn: new NgcFormControl(false),
    flgDlyOut: new NgcFormControl(false),
    dlyInReason: new NgcFormControl('', [Validators.maxLength(2000)]),
    dlyOutReason: new NgcFormControl('', [Validators.maxLength(2000)]),
    flgExpUld: new NgcFormControl(false),
    flgExpWt: new NgcFormControl(false),
    carrierName: new NgcFormControl(''),
    serviceDesc: new NgcFormControl(),
    description: new NgcFormControl(),
    flightAutoCompleteFlag: new NgcFormControl(),
    groundHandlerCode: new NgcFormControl(),
    createdUserCode: new NgcFormControl(),
    createdDateTime: new NgcFormControl(),
    deletedFactList: new NgcFormArray([]),
    deletedFlightLegs: new NgcFormArray([]),
    deletedJointList: new NgcFormArray([]),
    deletedUldTypeList: new NgcFormArray([]),
    deletedUldWtTypeList: new NgcFormArray([]),
    cancellation: new NgcFormControl(),
    bookingStatus: new NgcFormControl(),
    terminalList: new NgcFormArray([]),
    flightPriority: new NgcFormControl(),
    igmAccessFlag: new NgcFormControl(),
    breakDownCompletedAt: new NgcFormControl(),
    flightLegs: new NgcFormArray([
      new NgcFormGroup({
        flightId: new NgcFormControl(),
        boardPointCode: new NgcFormControl('', Validators.required),
        offPointCode: new NgcFormControl('', Validators.required),
        domesticStatus: new NgcFormControl(false),
        departureDate: new NgcFormControl('', Validators.required),
        arrivalDate: new NgcFormControl('', Validators.required),
        checkDepartureDate: new NgcFormControl(),
        checkArrivalDate: new NgcFormControl(),
        datEtd: new NgcFormControl(),
        datEta: new NgcFormControl(),
        datAtd: new NgcFormControl(),
        datAta: new NgcFormControl(),
        legOrderCode: new NgcFormControl(1),
        aircraftModel: new NgcFormControl(),
        aircraftType: new NgcFormControl(),
        flagDelete: new NgcFormControl(),
        flagSaved: new NgcFormControl(),
        flagUpdate: new NgcFormControl(),
        flagInsert: new NgcFormControl('Y'),
        registration: new NgcFormControl(),
        createdUserCode: new NgcFormControl(),
        createdDateTime: new NgcFormControl()
      })
    ]),
    flightSegments: new NgcFormArray([
      new NgcFormGroup({
        flightId: new NgcFormControl(),
        codAptBrd: new NgcFormControl(),
        codAptOff: new NgcFormControl(),
        flgNfl: new NgcFormControl(false),
        flgTecStp: new NgcFormControl(false),
        flgCargo: new NgcFormControl(false),
        noMail: new NgcFormControl(false)
      })
    ]),
    flightFcts: new NgcFormArray([
      new NgcFormGroup({
        seqNo: new NgcFormControl(1),
        remarks: new NgcFormControl('', [Validators.maxLength(65)]),
        flightId: new NgcFormControl(),
        flagDelete: new NgcFormControl(),
        flagSaved: new NgcFormControl(),
        flagUpdate: new NgcFormControl(),
        flagInsert: new NgcFormControl('Y')
      })
    ]),
    flightJoints: new NgcFormArray([
      new NgcFormGroup({
        flightId: new NgcFormControl(),
        jointFlightCarCode: new NgcFormControl(),
        seqNo: new NgcFormControl(1),
        flagDelete: new NgcFormControl(),
        flagSaved: new NgcFormControl(),
        flagUpdate: new NgcFormControl(),
        flagInsert: new NgcFormControl('Y'),
        jFlightName: new NgcFormControl(),
        carDesc: new NgcFormControl()
      })
    ]),
    flightExps: new NgcFormArray([
      new NgcFormGroup({
        flightId: new NgcFormControl(),
        uldNo: new NgcFormControl(),
        uldWtReason: new NgcFormControl('', [Validators.maxLength(100)]),
        seqNo: new NgcFormControl(1),
        departureDateTime: new NgcFormControl(),
        flagDelete: new NgcFormControl(),
        flagSaved: new NgcFormControl(),
        flagUpdate: new NgcFormControl(),
        flagInsert: new NgcFormControl('Y')
      })
    ]),
    flightExpULDTyps: new NgcFormArray([
      new NgcFormGroup({
        flightId: new NgcFormControl(),
        uldExpType: new NgcFormControl(),
        tareWeight: new NgcFormControl('', [Validators.maxLength(6), Validators.pattern('([0-9]{0,7})')]),
        uldWtReason: new NgcFormControl('', [Validators.maxLength(100)]),
        seqNo: new NgcFormControl(1),
        departureDateTime: new NgcFormControl(),
        flagDelete: new NgcFormControl(),
        flagSaved: new NgcFormControl(),
        flagUpdate: new NgcFormControl(),
        flagInsert: new NgcFormControl('Y')
      })
    ]),
    inboundFlightAttributes: new NgcFormGroup({
      flightId: new NgcFormControl(),
      warehouseLevel: new NgcFormControl(),
      rho: new NgcFormControl(),
      arrDepStatus: new NgcFormControl(),
      weather: new NgcFormControl(),
      truckSeaCompany: new NgcFormControl(),
      customsFlightNumber: new NgcFormControl(),
      gate: new NgcFormControl(),
      bubdOffice: new NgcFormControl(),
      printer: new NgcFormControl(),
      vesselId: new NgcFormControl(),
      vesselName: new NgcFormControl(),
      voyageNumber: new NgcFormControl(),
      delayCode: new NgcFormControl()

    }),
    outboundFlightAttributes: new NgcFormGroup({
      flightId: new NgcFormControl(),
      warehouseLevel: new NgcFormControl(),
      rho: new NgcFormControl(),
      arrDepStatus: new NgcFormControl(),
      weather: new NgcFormControl(),
      truckSeaCompany: new NgcFormControl(),
      customsFlightNumber: new NgcFormControl(),
      gate: new NgcFormControl(),
      bubdOffice: new NgcFormControl(),
      printer: new NgcFormControl(),
      vesselId: new NgcFormControl(),
      vesselName: new NgcFormControl(),
      voyageNumber: new NgcFormControl(),
      delayCode: new NgcFormControl()
    }),
    schDetails: new NgcFormGroup({
      scheduleFrom: new NgcFormControl(),
      scheduleTo: new NgcFormControl(),
      scheduleStartDate: new NgcFormControl(),
      scheduleEndDate: new NgcFormControl()
    })
  });
  terminal: any;
  updateLegsFlag = false;
  airportCode: any;
  cityCode: any;


  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private flightService: FlightService,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);

  }
  /**
   * ngOnInit
   *
   */
  public ngOnInit(): void {

    this.updateColumnLengthsDynamically();
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_WarehouseLevel)) {
      this.mntform.get('codPrkBayArr').setValidators([Validators.maxLength(10)]);
      this.mntform.get('codPrkBayDep').setValidators([Validators.maxLength(10)]);
      this.showTabs = true;
    } else {
      this.mntform.get('codPrkBayArr').setValidators([Validators.maxLength(8)]);
      this.mntform.get('codPrkBayDep').setValidators([Validators.maxLength(8)]);
    }
    //for the fix of 11213 starts
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null && forwardedData != undefined) {
      this.mntform.get('carrierCode').patchValue(forwardedData.carrierCode);
      this.mntform.get('flightNo').patchValue(forwardedData.flightNo);
      this.mntform.get('flightDate').patchValue(forwardedData.flightdateforflight);
      this.onSearch();
    } // for the fix of 11213 ends
    else {
      this.mntform.reset();
      this.onSaveFlag = false;
      this.flagExpUld = false;
      this.boardPointFlag = false;
      this.offPointFlag = false;
      this.bookingStatusFlag = false;
      this.defaultTerminal = false;
      this.flagDisplayTerminalDropdownListFalse = false;
      this.mntform.get('flightDate').setValue(this.defaultDate)


      if (!this.editableBoolean) {
        this.mntform.get('jointFlight').valueChanges.subscribe(jointFlightValue => {
          this.flagJoint = jointFlightValue;
        });
      }
      this.mntform.get('flgExpUld').valueChanges.subscribe(value => {
        this.flagExpUld = value;
      });
      this.mntform.get('flgSsmAsm').valueChanges.subscribe(value => {
        this.flgSsmAsm = value;
      });
      this.mntform.get('flgExpWt').valueChanges.subscribe(value => {
        this.flagExpWt = value;
      });
      this.mntform.get('flgApn').valueChanges.subscribe(flgApnValue => {
        this.flagApron = flgApnValue;
        if (this.flagApron) {
          if (this.mntform.get('flgApn').value === true) {
            this.showWarningStatus('flight.booking.not.accept.checkbox.checked');
            return;
          }
        }
      });
      this.mntform.get('flgDlyIn').valueChanges.subscribe(flgDlyInValue => {
        this.flagDelayIn = flgDlyInValue;
      });
      this.mntform.get('flgDlyOut').valueChanges.subscribe(flgDlyOutValue => {
        this.flagDelayOut = flgDlyOutValue;
      });
    }
    this.airportCode = NgcUtility.getTenantConfiguration().airportCode;
    this.cityCode = NgcUtility.getTenantConfiguration().cityCode;
  }
  ngAfterViewInit() {
    super.ngOnInit();
  }

  /**
   * dispDatePipe
   *
   * @param inputDate
   */
  dispDatePipe(inputDate) {
    if ((inputDate === '') || (inputDate === null)) {
      return inputDate;
    } else {
      const parseDate = new Date(inputDate);
      return (this.getMonthOrDateNumber(parseDate.getDate()) + '-' + this.getMonthOrDateNumber(parseDate.getMonth() + 1)
        + '-' + parseDate.getFullYear());
    }
  }

  onAutoFlightChange(event) {

    this.mntform.get('manuallyAutoFlag').setValue(true);
    let autoFlightExist = this.autoFlightData;
    let autoFlightNew = this.mntform.get('flightAutoCompleteFlag').value;
  }
  /**
  * Function to get mm or dd format of the month or date
  *
  * @param number month or date number for whose the mm or dd format is needed
  */
  getMonthOrDateNumber(number) {
    if (number < 10) {
      number = '0' + number;
    }
    return number;
  }
  /**
  * On Search
  *
  * @param event Event
  */
  validateCarrierCode(carrierCode) {
    var patt = new RegExp("^[a-zA-Z0-9]{2,3}$");
    return patt.test(carrierCode);

  }


  public onSearch() {
    this.updateLegsFlag = false;
    this.miscDetailIcon = "";
    this.updateColumnLengthsDynamically();
    (<NgcFormArray>this.mntform.controls['deletedFactList']).patchValue(new Array());
    if (this.mntform.get('carrierCode').value == null || this.mntform.get('flightDate').value == null || this.mntform.get('flightNo').value == null) {
      this.showErrorMessage('g.fill.all.details');
      return;
    }
    if (this.mntform.get('carrierCode').value != null && this.mntform.get('carrierCode').value != '' && !this.validateCarrierCode(this.mntform.get('carrierCode').value)) {
      return this.showErrorStatus('flight.no.record');
    }
    this.displayFlightInfo = true;
    if (this.mntform.get('flightDate').value instanceof Array) {
      this.mntform.get('displayfltDate').setValue(NgcUtility.toDateFromLocalDate(this.mntform.get('flightDate').value));
    } else {
      this.mntform.get('displayfltDate').setValue(this.mntform.get('flightDate').value);
    }
    const request: FlightRequest = new FlightRequest();
    request.carrierCode = this.mntform.get('carrierCode').value;
    request.flightDate = this.mntform.getRawValue().flightDate;
    request.flightNo = this.mntform.getRawValue().flightNo;
    this.mntform.get('flightNo').setValue(request.flightNo);
    request.flightKey = request.carrierCode + request.flightNo;
    this.resetFormMessages();
    this.getResponse(request);
    // FIXME Below code is required or not
    this.mntform.get('carrierCode').setValue(this.mntform.get('carrierCode').value);
    this.mntform.get('flightDate').setValue(this.mntform.get('flightDate').value);
    this.mntform.get('flightNo').setValue(this.mntform.get('flightNo').value);
    this.mntform.get('serviceDesc').setValue(this.mntform.get('description').value);
    if (this.mntform.get(['flightLegs', 0, 'aircraftModel']).value == null) {
      this.mntform.get(['flightLegs', 0, 'flagCRUD']).setValue('C');
    }
    if (this.mntform.get(['flightLegs', 0, 'aircraftModel']).value != null) {
      this.mntform.get(['flightLegs', 0, 'flagCRUD']).setValue('U');
    }
  }

  /**
   * TO reset all data in form
   *
   */
  clearFormAndSetData() {
    let tempFlightNo = this.mntform.get('carrierCode');
    let tempCarrierCode = this.mntform.get('flightNo');
    let tempFlightDate = this.mntform.get('flightDate');
    this.lengthLegList = (<NgcFormArray>this.mntform.get('flightLegs')).length;
    for (let index = this.lengthLegList - 1; index > 0; index--) {
      (<NgcFormArray>this.mntform.get('flightLegs')).removeAt(index);
    }
    this.mntform.reset();
    this.mntform.get('carrierCode').setValue(tempFlightNo);
    this.mntform.get('flightNo').setValue(tempCarrierCode);
    this.mntform.get('flightDate').setValue(tempFlightDate);
    this.resetFormMessages();
  }
  /**
   * Get Response
   *
   * @param flightRequest
   */
  public getResponse(flightRequest: FlightRequest) {
    this.flightService.getFlightDetails(flightRequest).subscribe(data => {
      this.gettingOperativeFlight = data;
      if (this.gettingOperativeFlight.data !== null && this.gettingOperativeFlight.data.status === 'DEP') {
        this.flightCompletePopup.open();
      }
      if (data.data !== null) {
        this.terminalFlag = true;
        this.flightOriginDate = data.data.flightDate;
      } else {
        this.terminalFlag = false;
      }
      this.errors = this.gettingOperativeFlight.messageList;
      // Iterating Fact List
      if (this.gettingOperativeFlight.data !== null) {
        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_CustomsImportFlightNumber)) {
          if (data.data.breakDownCompletedAt == false || data.data.igmAccessFlag == true) {
            this.igmNumberFlagDisabled = false;
          } else {
            this.igmNumberFlagDisabled = true;
          }
        }
        this.onSearchFlag = true;
        this.displayFlightInfo = true;
        this.autoFlightEnable = true;
        if (this.gettingOperativeFlight.data.flightFcts !== null) {
          this.gettingOperativeFlight.data.flightFcts.forEach(element => {
            element['flagUpdate'] = 'Y';
            element['seqNo'] = element.seqNo;
          });
        }
        if (this.gettingOperativeFlight.data.flightJoints !== null) {
          this.gettingOperativeFlight.data.flightJoints.forEach(element => {
            element['flagUpdate'] = 'Y';
            element['jFlightName'] = element.jointFlightCarCode;
          });
        }
        if (this.gettingOperativeFlight.data.flightLegs !== null) {
          this.gettingOperativeFlight.data.flightLegs.forEach(element => {
            element['flagUpdate'] = 'Y';
            if (element['domesticStatus'] === "true") {
              element['domesticStatus'] = true;
            } else if (element['domesticStatus'] === "false") {
              element['domesticStatus'] = false;
            }
            element['checkArrivalDate'] = element['arrivalDate'];
            element['checkDepartureDate'] = element['departureDate'];
          });
        }
        if (this.gettingOperativeFlight.data.flightExps !== null) {
          this.gettingOperativeFlight.data.flightExps.forEach(element => {
            element['flagUpdate'] = 'Y';
          });
        }

        if (this.gettingOperativeFlight.data.flightLegs !== null && this.gettingOperativeFlight.data.flightLegs.length > 0) {
          this.boardPointFlag = true;
          this.offPointFlag = true;


          // For getting the list of joint flight at a time of search

          let parameter1, parameter2, parameter3, parameter4, parameter5;
          parameter5 = this.mntform.get('carrierCode').value + this.mntform.get('flightNo').value;
          if (this.gettingOperativeFlight.data.flightLegs !== null) {
            this.gettingOperativeFlight.data.flightLegs.forEach(element => {
              if (NgcUtility.isTenantAirport(element.boardPointCode)) {
                parameter1 = element.departureDate;
                parameter2 = element.offPointCode;
                parameter3 = element.aircraftModel;
                parameter4 = element.arrivalDate;
              }

            });
            this.jointGroupCodeParam = this.createSourceParameter(parameter1, parameter2, parameter3, parameter4, parameter5);

          }
        }
        if (this.gettingOperativeFlight.data.flightExpULDTyps !== null) {
          this.gettingOperativeFlight.data.flightExpULDTyps.forEach(element => {
            element['flagUpdate'] = 'Y';
          });
        }


        if (this.gettingOperativeFlight.data.groundHandlerCode === 'SATS') {
          this.hideHandlerDropdown = true;
        } else {
          this.hideHandlerDropdown = false;
        }
        if (this.gettingOperativeFlight.data.cancellation === 'D') {
          this.mntform.get('flightStatus').setValue('CANCELLED');
          this.disableclosebutton = true;
          this.restoreBoolean = true;
          this.bookingStatus = true;
          this.bookingStatusFlag = true;
        } else {
          this.mntform.get('flightStatus').setValue('Active');
        }
        this.mntform.patchValue(this.gettingOperativeFlight.data);
        if (this.gettingOperativeFlight.data.jointFlight === 'true') {
          this.mntform.get('jointFlight').setValue(true);
        }
        if (this.gettingOperativeFlight.data.jointFlight === 'false') {
          this.mntform.get('jointFlight').setValue(false);
        }
        if (this.gettingOperativeFlight.data.flgApn === 'false') {
          this.mntform.get('flgApn').setValue(false);
        }
        if (this.gettingOperativeFlight.data.flgApn === 'true') {
          this.mntform.get('flgApn').setValue(true);
        }
        if (this.gettingOperativeFlight.data.flgExpUld === 'false') {
          this.flagExpUld = false;
          this.mntform.get('flgExpUld').setValue(false);
        }
        if (this.gettingOperativeFlight.data.flgExpUld === 'true') {
          this.flagExpUld = true;
          this.mntform.get('flgExpUld').setValue(true);
        }
        if (this.gettingOperativeFlight.data.flgExpWt === 'false') {
          this.flagExpWt = false;
          this.mntform.get('flgExpWt').setValue(false);
        }
        if (this.gettingOperativeFlight.data.flgExpWt === 'true') {
          this.flagExpWt = true;
          this.mntform.get('flgExpWt').setValue(true);
        }
        if (this.gettingOperativeFlight.data.flgDlyIn === 'true') {
          this.mntform.get('flgDlyIn').setValue(true);
        }
        if (this.gettingOperativeFlight.data.flgDlyIn === 'false') {
          this.mntform.get('flgDlyIn').setValue(false);
        }
        if (this.gettingOperativeFlight.data.flgDlyOut === 'true') {
          this.mntform.get('flgDlyOut').setValue(true);
        }
        if (this.gettingOperativeFlight.data.flgDlyOut === 'false') {
          this.mntform.get('flgDlyOut').setValue(false);
        }
        if (this.gettingOperativeFlight.data.flgSsmAsm === 'true') {
          this.mntform.get('flgSsmAsm').setValue(true);
          this.isSSMActive = true;
          this.mntform.get('flgSsmAsm').setValue('SYS');
        }
        if (this.gettingOperativeFlight.data.flgSsmAsm === 'false') {
          this.isSSMActive = false;
          this.mntform.get('flgSsmAsm').setValue('MAN');
        }
        let segments = this.gettingOperativeFlight.data.flightSegments;
        if (segments != null) {
          segments = segments.map(function (obj) {
            if (obj.flgNfl === "true") {
              obj.flgNfl = true;
            } else if (obj.flgNfl === "false") {
              obj.flgNfl = false;
            }
            if (obj.flgTecStp === "true") {
              obj.flgTecStp = true;
            } else if (obj.flgTecStp === "false") {
              obj.flgTecStp = false;
            }
            if (obj.flgCargo === "true") {
              obj.flgCargo = true;
            } else if (obj.flgCargo === "false") {
              obj.flgCargo = false;
            }
            if (obj.noMail === "true") {
              obj.noMail = true;
            } else if (obj.noMail === "false") {
              obj.noMail = false;
            }
            obj.flagUpdate = 'Y';
            return obj;
          });
        }

        if (this.gettingOperativeFlight.data !== null && this.gettingOperativeFlight.data.flightbookingStatus === "0" || this.gettingOperativeFlight.data.flightbookingStatus === null) {
          this.bookingStatus = false;
          this.bookingStatusFlag = false;
        } else if (this.gettingOperativeFlight.data !== null && this.gettingOperativeFlight.data.flightbookingStatus === "1") {
          this.bookingStatus = true;
          this.bookingStatusFlag = true;
        }
        this.mntform.get('flightSegments').patchValue(segments);
        this.mntform.get('flgExpUld').patchValue(this.gettingOperativeFlight.data.flgExpUld);
        this.mntform.get('flgExpWt').patchValue(this.gettingOperativeFlight.data.flgExpWt);
        this.mntform.get('handlingArea').setValue(this.gettingOperativeFlight.data.handlingArea);
        this.mntform.get('carrierCode').disable();
        this.mntform.get('flightNo').disable();
        this.mntform.get('flightDate').disable();
        this.lengthFactList = (<NgcFormArray>this.mntform.get('flightFcts')).length;
        this.lengthLegList = (<NgcFormArray>this.mntform.get('flightLegs')).length;
        this.lengthExceptionList = (<NgcFormArray>this.mntform.get('flightExps')).length;
        this.lengthExpUldTypeList = (<NgcFormArray>this.mntform.get('flightExpULDTyps')).length;
        this.lengthJointFlightList = (<NgcFormArray>this.mntform.get('flightJoints')).length;
        this.editableBoolean = true;
        this.onSearchFlag = true;
        this.onSaveFlag = false;
        this.editableSTD = this.lengthLegList;
        // STD becomes read only after flight is created (upon save), while creating a flight field is editable.
        this.disabledControles = this.lengthLegList;
        this.editableSTDFlag = true;
        if (this.gettingOperativeFlight.data.flightExpULDTyps.length === 0) {
          this.addExceptionULDRow();
        }
        if (this.gettingOperativeFlight.data.flightExps.length === 0) {
          this.addExceptionReasonRow();
        }
        if (this.gettingOperativeFlight.data.flightFcts.length === 0) {
          this.addFactRow();
        }
        if (this.gettingOperativeFlight.data.flightJoints.length === 0) {
          this.addJointFlightRow();
        }
        this.refreshFormMessages(data);
      } else {
        // FIXME refresh form messages will take care of thre same job remove this code

        this.mntform.get(['flightLegs', 0, 'departureDate']).setValue(this.mntform.get('flightDate').value);
        this.mntform.get(['flightLegs', 0, 'departureDate']).valueChanges.subscribe(data => {
          this.dateTo = NgcUtility.getDateOnly(this.mntform.get('flightDate').value);
          this.dateToMax = NgcUtility.addDate(this.dateTo, 1439, DateTimeKey.MINUTES);

        });
        if (data.messageList != null && data.messageList[0].code !== 'MAINTAIN_FETCH_FLIGHT_DETAILS') {
          if (data.messageList[0].code == 'CAR001') {
            this.onSearchFlag = false;
            this.autoFlightEnable = false;
            return this.showErrorStatus(data.messageList[0].message);
          } else if (data.messageList[0].referenceId === 'operativeFlight') {
            this.onSearchFlag = false;
            this.autoFlightEnable = false;
            return this.showErrorStatus(data.messageList[0].code);
          } else {
            if (data.messageList[0].message === null) {
              this.autoFlightEnable = false;
              this.showErrorStatus("flight.no.record");
            }
            return this.onSearchFlag = false;

          }



        }

        if (data.messageList[0].code === 'MAINTAIN_FETCH_FLIGHT_DETAILS') {
          this.showErrorStatus(data.messageList[0].message);
          this.displayFlightInfo = true;
          this.bookingStatus = false;
          this.onSearchFlag = true;
        }

      }
      if (this.gettingOperativeFlight.data !== null && (this.gettingOperativeFlight.data.flightbookingStatus === "0" || this.gettingOperativeFlight.data.flightbookingStatus === null)) {
        this.bookingStatus = false;
        this.bookingStatusFlag = false;
      } else if (this.gettingOperativeFlight.data !== null && this.gettingOperativeFlight.data.flightbookingStatus === "1") {
        this.bookingStatus = true;
        this.bookingStatusFlag = true;
      }
      if (this.gettingOperativeFlight.data != null) {
        this.autoFlightData = this.gettingOperativeFlight.data.autoFlightFlag;
      }

      if (this.gettingOperativeFlight.data != null && this.gettingOperativeFlight.data.flightLegs !== null && this.gettingOperativeFlight.data.flightLegs > 0) {
        if (this.gettingOperativeFlight.data.autoFlightFlag == 'Off') {
          this.mntform.get('flightAutoCompleteFlag').setValue('Off');
        }
        if (this.gettingOperativeFlight.data.autoFlightFlag == 'On') {
          this.mntform.get('flightAutoCompleteFlag').setValue('On');
        }
      }
      if (NgcUtility.isEntityAttributeEnabled("Flight.RHO") && !this.gettingOperativeFlight.data) {
        this.fetchExistingSchedule();
      }
    },
      error => { this.showErrorStatus(error); });
  }
  /**
   * Add Exception Reason Row
   *
   */
  addExceptionReasonRow() {
    ++this.lengthExceptionList;
    if (this.editableBoolean) {
      (<NgcFormArray>this.mntform.controls['flightExps']).addValue([
        {
          uldNo: '',
          uldWtReason: '',
          seqNo: null,
          flagUpdate: 'N',
          flagDelete: 'N',
          flagInsert: 'Y',
          flagSaved: 'Y'
        }
      ]);
    } else {
      (<NgcFormArray>this.mntform.controls['flightExps']).addValue([
        {
          uldNo: '',
          uldWtReason: '',
          seqNo: null,
          flagUpdate: 'N',
          flagDelete: 'N',
          flagInsert: 'Y',
          flagSaved: 'N'
        }
      ]);
    }
  }
  /**
   * Add Exception ULD Row
   *
   */
  addExceptionULDRow() {
    ++this.lengthExpUldTypeList;
    if (this.editableBoolean) {
      (<NgcFormArray>this.mntform.controls['flightExpULDTyps']).addValue([
        {
          uldExpType: '',
          tareWeight: '',
          uldWtReason: '',
          seqNo: null,
          flagUpdate: 'N',
          flagDelete: 'N',
          flagInsert: 'Y',
          flagSaved: 'Y'
        }
      ]);
    } else {
      (<NgcFormArray>this.mntform.controls['flightExpULDTyps']).addValue([
        {
          uldExpType: '',
          tareWeight: '',
          uldWtReason: '',
          //seqNo: this.lengthExpUldTypeList + 1,
          seqNo: null,
          flagUpdate: 'N',
          flagDelete: 'N',
          flagInsert: 'Y',
          flagSaved: 'N'
        }
      ]);
    }

  }
  /**
   * Add Joint Flight Row
   *
   */
  addJointFlightRow() {
    ++this.lengthJointFlightList;
    if (this.editableBoolean) {
      (<NgcFormArray>this.mntform.controls['flightJoints']).addValue([
        {
          seqNo: this.lengthJointFlightList,
          flagUpdate: 'N',
          flagDelete: 'N',
          flagInsert: 'Y',
          flagSaved: 'Y',
          jFlightName: '',
          carDesc: ''
        }
      ]);
    } else {
      (<NgcFormArray>this.mntform.controls['flightJoints']).addValue([
        {
          seqNo: this.lengthJointFlightList + 1,
          flagUpdate: 'N',
          flagDelete: 'N',
          flagInsert: 'Y',
          flagSaved: 'N',
          jFlightName: '',
          carDesc: ''
        }
      ]);
    }

  }
  /**
   * Add Legs Row
   *
   */

  validateStdDate() {
    this.mntform.get(['flightLegs', 0, 'departureDate']).valueChanges.subscribe(changedValue => {
      if (NgcUtility.getDateOnly(this.mntform.get(['flightLegs', 0, 'departureDate']).value) !== NgcUtility.getDateOnly(this.mntform.get('flightDate').value)) {
        return this.showErrorMessage("flight.first.leg.departure.date.equal.flight.date");
      }

    });

  }

  addLegsRow(index) {
    this.boardPointFlag = false;
    this.offPointFlag = false;
    ++this.lengthLegList;
    if (this.editableSTD < this.lengthLegList) {
      this.editableSTDFlag = false;
    } else {
      this.editableSTDFlag = false;
    }

    if (this.editableBoolean) {
      (<NgcFormArray>this.mntform.controls['flightLegs']).addValue([
        {
          boardPointCode: null,
          offPointCode: null,
          domesticStatus: false,
          departureDate: null,
          arrivalDate: null,
          datEtd: null,
          datEta: null,
          datAtd: null,
          datAta: null,
          legOrderCode: this.lengthLegList,
          aircraftModel: null,
          flagUpdate: 'N',
          flagDelete: 'N',
          flagInsert: 'Y',
          flagSaved: 'Y',
          flagCRUD: 'C',
        }
      ]);
      if (index === 0) {
        this.mntform.get(['flightLegs', index, 'departureDate']).valueChanges.subscribe(data => {
          this.dateTo = NgcUtility.getDateOnly(this.mntform.get('flightDate').value);
          this.dateToMax = NgcUtility.addDate(this.dateTo, 1439, DateTimeKey.MINUTES);
        });
        this.mntform.get(['flightLegs', index, 'departureDate']).patchValue(this.mntform.get('flightDate').value);
      }
    } else {
      (<NgcFormArray>this.mntform.controls['flightLegs']).addValue([
        {
          boardPointCode: null,
          offPointCode: null,
          domesticStatus: false,
          departureDate: null,
          arrivalDate: null,
          datEtd: null,
          datEta: null,
          datAtd: null,
          datAta: null,
          legOrderCode: this.lengthLegList + 1,
          aircraftModel: null,
          flagUpdate: 'N',
          flagDelete: 'N',
          flagInsert: 'Y',
          flagSaved: 'N',
        }
      ]);
      if (index === 0) {
        this.mntform.get(['flightLegs', index, 'departureDate']).valueChanges.subscribe(data => {
          this.dateTo = NgcUtility.getDateOnly(this.mntform.get('flightDate').value);
          this.dateToMax = NgcUtility.addDate(this.dateTo, 1439, DateTimeKey.MINUTES);
        });
        this.mntform.get(['flightLegs', index, 'departureDate']).patchValue(this.mntform.get('flightDate').value);
      }
    }
  }
  /**
   * Add Fact Row
   *
   */
  addFactRow() {
    ++this.lengthFactList;
    if (this.editableBoolean) {
      (<NgcFormArray>this.mntform.controls['flightFcts']).addValue([
        {

          seqNo: null,
          remarks: '',
          flagUpdate: 'N',
          flagDelete: 'N',
          flagInsert: 'Y',
          flagSaved: 'Y',
        }
      ]);
    } else {
      (<NgcFormArray>this.mntform.controls['flightFcts']).addValue([
        {
          seqNo: null,
          remarks: '',
          flagUpdate: 'N',
          flagDelete: 'N',
          flagInsert: 'Y',
          flagSaved: 'N'
        }
      ]);

    }
  }
  /**
   * Delete Fact Row
   *
   * @param index
   */
  deleteFactRow(index) {
    //if (index === (<NgcFormArray>this.mntform.get('flightFcts')).length - 1) {
    (<NgcFormArray>this.mntform.controls['flightFcts']).controls[index].get('flagDelete').setValue('Y');
    if ((<NgcFormArray>this.mntform.controls['flightFcts']).controls[index].get('flagSaved').value === 'Y') {
      (<NgcFormArray>this.mntform.controls['flightFcts']).controls[index].get('flagUpdate').setValue('N');
      (<NgcFormArray>this.mntform.controls['deletedFactList']).addValue([
        (<NgcFormArray>this.mntform.controls['flightFcts']).getRawValue()[index]
      ]);

    }
    (<NgcFormArray>this.mntform.controls['flightFcts']).deleteValueAt(index);

    if (index === 0) {
      this.addFactRow();
    }
    // }

  }
  /**
   * Delete Joint Flight
   *
   * @param index
   */
  deleteJointFlight(index) {
    // if (index === (<NgcFormArray>this.mntform.get('flightJoints')).length - 1) {
    (<NgcFormArray>this.mntform.controls['flightJoints']).controls[index].get('flagDelete').setValue('Y');
    if ((<NgcFormArray>this.mntform.controls['flightJoints']).controls[index].get('flagSaved').value === 'Y') {
      (<NgcFormArray>this.mntform.controls['flightJoints']).controls[index].get('flagUpdate').setValue('N');
      (<NgcFormArray>this.mntform.controls['deletedJointList']).addValue([
        (<NgcFormArray>this.mntform.controls['flightJoints']).getRawValue()[index]
      ]);
    }
    (<NgcFormArray>this.mntform.controls['flightJoints']).deleteValueAt(index);
    if (index === 0) {
      this.flagJoint = true;
      this.mntform.get('jointFlight').setValue(true);
      this.addJointFlightRow();
    }
    // }
  }
  /**
   * deleteuldType
   *
   * @param index
   */
  deleteuldType(index) {
    (<NgcFormArray>this.mntform.controls['flightExpULDTyps']).controls[index].get('flagDelete').setValue('Y');
    //
    if ((<NgcFormArray>this.mntform.controls['flightExpULDTyps']).controls[index].get('flagSaved').value === 'Y') {
      (<NgcFormArray>this.mntform.controls['flightExpULDTyps']).controls[index].get('flagUpdate').setValue('N');
      (<NgcFormArray>this.mntform.controls['deletedUldTypeList']).addValue([
        (<NgcFormArray>this.mntform.controls['flightExpULDTyps']).getRawValue()[index]
      ]);
    }
    (<NgcFormArray>this.mntform.controls['flightExpULDTyps']).markAsDeletedAt(index);
    if (index === 0 && (<NgcFormArray>this.mntform.get('flightExpULDTyps')).length === 0) {
      this.mntform.get('flgExpUld').setValue(false);
      this.flagExpUld = false;
      this.addExceptionULDRow();
    }
  }


  /**
   * Delete ULD No
   *
   * @param index
   */
  deleteuldNo(index) {
    // if (index === (<NgcFormArray>this.mntform.get('flightExps')).length - 1) {
    (<NgcFormArray>this.mntform.controls['flightExps']).controls[index].get('flagDelete').setValue('Y');
    //
    if ((<NgcFormArray>this.mntform.controls['flightExps']).controls[index].get('flagSaved').value === 'Y') {
      (<NgcFormArray>this.mntform.controls['flightExps']).controls[index].get('flagUpdate').setValue('N');
      (<NgcFormArray>this.mntform.controls['deletedUldWtTypeList']).addValue([
        (<NgcFormArray>this.mntform.controls['flightExps']).getRawValue()[index]
      ]);
    }
    (<NgcFormArray>this.mntform.controls['flightExps']).markAsDeletedAt(index);
    //
    if (index === 0 && (<NgcFormArray>this.mntform.get('flightExps')).length === 0) {
      this.mntform.get('flgExpWt').setValue(false);
      this.flagExpWt = false;
      this.addExceptionReasonRow();
    }
    // }
  }
  /**
   * Flight Legs Delete
   *
   * @param value Value
   */
  deleteFlightLegs(row) {
    this.boardPointFlag = false;
    this.offPointFlag = false;
    if (row === (<NgcFormArray>this.mntform.get('flightLegs')).length - 1) {
      (<NgcFormArray>this.mntform.controls['flightLegs']).controls[row].get('flagDelete').setValue('Y');
      (<NgcFormArray>this.mntform.controls['flightLegs']).controls[row].get('flagInsert').setValue('N');
      if ((<NgcFormArray>this.mntform.controls['flightLegs']).controls[row].get('flagSaved').value === 'Y') {
        (<NgcFormArray>this.mntform.controls['flightLegs']).controls[row].get('flagUpdate').setValue('N');
        (<NgcFormArray>this.mntform.controls['deletedFlightLegs']).addValue([
          (<NgcFormArray>this.mntform.controls['flightLegs']).getRawValue()[row]
        ]);
      }
      (<NgcFormArray>this.mntform.get('flightLegs')).markAsDeletedAt(row);
      if (row === 0) {
        this.addLegsRow(0);
      }
      this.lengthLegList = this.lengthLegList - 1;
      row = row - 1;
    }

    if (this.disabledControles === (row + 1)) {
      this.disabledControles--;
    }
  }
  /**
  * On Select
  *
  * @param object Object
  */


  // getCarrierCodeByCarrierGroup(event) {
  //  this.jointGroupCodeParam = this.createSourceParameter(this.mntform.get(['flightKey', 'flightDate']).value);
  // }

  /**
   * On Select Service
   *
   * @param object
   */
  public onSelectService(object) {
    //this.mntform.get('serviceType').setValue(object.code);
    this.mntform.get('description').setValue(object.desc);
    this.mntform.get('caoPax').setValue(object.param1);
  }
  /**
   * Is Eight
   *
   * @param airports
   */
  isEight(airports) {
    for (let i = 0; i < airports.length / 2; i++) {
      if ((NgcUtility.isTenantAirport(airports[0])) && (NgcUtility.isTenantAirport(airports[airports.length - 1]))) {
        return true;
      }
    }
    return false;
  }
  /**
   * Is Nine
   *
   * @param airports
   */
  isNine(airports) {
    airports.pop();
    for (let i = 0; i < airports.length / 2; i++) {
      if ((NgcUtility.isTenantAirport(airports[0])) && (!NgcUtility.isTenantAirport(airports[airports.length - 1]))) {
        return true;
      }
    }
    return false;
  }
  /**
   * Is Eight Or Nine
   * Is Eight Or Nine
   *
   * @param airports
   */
  isEightOrNine(airports) {
    if (airports.length < 5) {
      return false;
    }

    if (airports.length = 5) {
      return this.isEight(airports);
    }

    if (airports.length = 6) {
      return this.isNine(airports);
    }
  }
  /**
  * On Save
  *
  * @param event Event
  */
  public onSave(event) {
    this.resetFormMessages();
    this.onSaveFlag = true;
    this.defaultTerminal = false;
    this.mntform.validate();

    if (this.mntform.invalid) {
      this.showWarningStatus('flight.operation.failed');
      if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_RHO)) {
        if (this.mntform.value.flightLegs.length > 0) {
          const flightLegs = (<NgcFormArray>this.mntform.get('flightLegs')).value;
          for (let element of flightLegs) {
            if (NgcUtility.isTenantAirport(element.boardPointCode)) {
              if ((this.mntform.value.outboundFlightAttributes.truckSeaCompany == null) &&
                (NgcUtility.isBlank(this.mntform.value.outboundFlightAttributes.rho) ||
                  NgcUtility.isBlank(this.mntform.value.outboundFlightAttributes.bubdOffice) ||
                  NgcUtility.isBlank(this.mntform.value.outboundFlightAttributes.printer))) {
                this.miscDetailIcon = "error";
                this.miscDetailTabComponent.focus();
                return;
              } else {
                this.miscDetailIcon = "";
              }
            }
            if (NgcUtility.isTenantAirport(element.offPointCode)) {
              if ((NgcUtility.isBlank(this.mntform.value.inboundFlightAttributes.truckSeaCompany)) &&
                (NgcUtility.isBlank(this.mntform.value.inboundFlightAttributes.rho) ||
                  NgcUtility.isBlank(this.mntform.value.inboundFlightAttributes.bubdOffice) ||
                  NgcUtility.isBlank(this.mntform.value.inboundFlightAttributes.printer))) {
                this.miscDetailIcon = "error";
                this.miscDetailTabComponent.focus();
                return;
              } else {
                this.miscDetailIcon = "";
              }
            }
          }
        }
      }
      return;
    }

    if (this.mntform.value.serviceType == null) {
      this.showErrorStatus('flight.service.type.blank');
      return;
    }
    let request = this.mntform.getRawValue();

    let legsWithoutDelete: any = request.flightLegs.filter(value => value.flagCRUD != 'D');

    for (let i = 1; i < legsWithoutDelete.length; i++) {
      if (legsWithoutDelete[i - 1].offPointCode !== legsWithoutDelete[i].boardPointCode) {
        this.showErrorStatus('flight.board.point.same.off.point');
        return;
      }
    }
    for (let i = 0; i < legsWithoutDelete.length; i++) {
      for (let j = i; j < legsWithoutDelete.length; j++) {
        if (i != j && legsWithoutDelete[i].offPointCode === legsWithoutDelete[j].offPointCode
          && legsWithoutDelete[i].boardPointCode === legsWithoutDelete[j].boardPointCode) {
          this.showErrorStatus('flight.invalid.leg');
          return;
        }
      }
    }
    // Fix For Bug 20236 - Flight Board Point and Off Point cannot be same
    for (let i = 0; i < legsWithoutDelete.length; i++) {
      if (legsWithoutDelete[i].offPointCode == legsWithoutDelete[i].boardPointCode) {
        this.showErrorStatus('edi.brd.off.cannot.same');
        return;
      }
    }
    request.flightKey = request.carrierCode + request.flightNo;
    request.customerShortName = this.customerShortName;
    request.contractorId = this.contractorId;
    let airports = [];
    airports.push(request.flightLegs[0].boardPointCode);
    for (let eachRow of request.flightLegs) {
      airports.push(eachRow.offPointCode);
    }
    if (this.isEightOrNine(airports)) {
      this.showErrorStatus('flight.invalid.flight.route');
      return;
    }
    for (let i = 0; i < (<NgcFormArray>this.mntform.get('flightJoints')).length; i++) {
      request.flightJoints[i].jointFlightCarCode = request.flightJoints[i].jFlightName;
    }

    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_RHO)) {
      if (request.flightLegs.length > 0) {
        const flightLegs = (<NgcFormArray>this.mntform.get('flightLegs')).value;
        for (let element of flightLegs) {
          if (NgcUtility.isTenantAirport(element.boardPointCode)) {
            if (element.aircraftModel && element.aircraftModel === 'TRK'
              && this.providerType === "SEA FERRY"
              && (NgcUtility.isBlank(request.outboundFlightAttributes.vesselId)
                || NgcUtility.isBlank(request.outboundFlightAttributes.vesselName)
                || NgcUtility.isBlank(request.outboundFlightAttributes.voyageNumber))) {
              this.mntform.get('outboundFlightAttributes.vesselId').setValidators([Validators.required]);
              this.mntform.get('outboundFlightAttributes.vesselName').setValidators([Validators.required]);
              this.mntform.get('outboundFlightAttributes.voyageNumber').setValidators([Validators.required]);
              this.showInfoStatus("flight.outbound.stfs.details.missing");
              this.stfsIcon = "error";
              this.stfsTabComponent.focus();
              return;
            }
            else {
              this.stfsIcon = "";
            }
          }
          if (NgcUtility.isTenantAirport(element.offPointCode)) {
            if (element.aircraftModel && element.aircraftModel === 'TRK'
              && this.providerType === "SEA FERRY"
              && (NgcUtility.isBlank(request.inboundFlightAttributes.vesselId)
                || NgcUtility.isBlank(request.inboundFlightAttributes.vesselName)
                || NgcUtility.isBlank(request.inboundFlightAttributes.voyageNumber))) {
              this.mntform.get('inboundFlightAttributes.vesselId').setValidators([Validators.required]);
              this.mntform.get('inboundFlightAttributes.vesselName').setValidators([Validators.required]);
              this.mntform.get('inboundFlightAttributes.voyageNumber').setValidators([Validators.required]);
              this.showInfoStatus("flight.outbound.stfs.details.missing");
              this.stfsIcon = "error";
              this.stfsTabComponent.focus();
              return;
            }
            else {
              this.stfsIcon = "";
            }
          }
        }
      }
    }

    if (this.editableBoolean) {
      let formValues = this.mntform.value;
      for (let eachRow of request.deletedFactList) {
        eachRow.flagCRUD = 'D';
        request.flightFcts.push(eachRow);
      }
      for (let eachRow of request.deletedJointList) {
        request.flightJoints.push(eachRow);
      }
      for (let eachRow of request.deletedFlightLegs) {
      }
      for (let eachRow of request.deletedUldWtTypeList) {
        request.flightExps.push(eachRow);
      }
      for (let eachRow of request.deletedUldTypeList) {
        request.flightExpULDTyps.push(eachRow);
      }
      request.flightDate = request.displayfltDate;
      request.autoFlightFlag = this.mntform.get('flightAutoCompleteFlag').value;
      if (this.mntform.get('flightStatus').value == 'CANCELLED') {
        request.cancellation = 'D'
      } else {
        request.cancellation = 'A'
      }
      let expUldTypeArray = new Array();
      for (const obj of request.flightExpULDTyps) {
        if (obj.flagCRUD == 'C') {
          if ((obj.flagSaved == 'Y' && obj.flagDelete == 'N' && obj.uldExpType)) {
            expUldTypeArray.push(obj);
          }
        }
      }
      if (expUldTypeArray && expUldTypeArray.length > 0) {
      }
      if (request.flightExps != null && request.flightExps.length > 0) {
        request.flgExpWt = true;
        request.flgExpUld = true;
      } else {
        request.flgExpWt = false;
        request.flgExpUld = false;
      }
      if (this.gettingOperativeFlight.data.flightId != null || this.gettingOperativeFlight.data.flightId != " ") {
        this.flightService.updateFlightDetails(request).subscribe(data => {
          if (!this.showResponseErrorMessages(data)) {
            this.gettingOperativeFlight = data;

            this.errors = this.gettingOperativeFlight.messageList;
            if (this.gettingOperativeFlight.data == null) {
              this.showErrorStatus(this.errors[0].message);
              return;
            }

            else {
              // TODO Remove unused code or add extra comment why this code is left commented
              this.mntform.get('flightSegments').patchValue(this.gettingOperativeFlight.data.flightSegments);
              this.lengthLegList = (<NgcFormArray>this.mntform.get('flightLegs')).length;
              this.disabledControles = this.lengthLegList;
              if (this.gettingOperativeFlight.data.autoFlightFlag == 'Off') {
                setTimeout(() => { this.mntform.get('flightAutoCompleteFlag').setValue('Off') }, 3000)
              }
              if (this.gettingOperativeFlight.data.autoFlightFlag == 'On') {
                setTimeout(() => { this.mntform.get('flightAutoCompleteFlag').setValue('On') }, 3000)
              }
              this.onSearch();
              this.showSuccessStatus('flight.update.flight.success');
              this.miscDetailIcon = "";

              /*if (this.gettingOperativeFlight.data.isUpdateFlag == 'Yes') {
                this.onSearch();
                this.showSuccessStatus('Flight Details successfully Updated.');
                (<NgcFormArray>this.mntform.controls['flightExpULDTyps']).patchValue(new Array());
              } else {
                this.onSearch();
                if (this.gettingOperativeFlight.data.isUpdateFlag == 'Nobooking') {
                  this.showSuccessStatus('Operation Successful');
                }
                if (this.gettingOperativeFlight.data.isUpdateFlag == 'Noarrival') {
                  this.showSuccessStatus('Operation Successful');
                }
              }*/
              if (this.updateLegsFlag && this.gettingOperativeFlight.data.isUpdateFlag !== 'Yes') {
                this.showInfoStatus("flight.board.point.std.sta.not.updated");
              }
              this.onSearch();
              this.miscDetailIcon = "";
              return;
            }
          }
        },
          error => { this.showErrorStatus('flight.update.error'); }
        );
      }

    } else {
      const dataToTerminal = request.handlingArea;
      if (dataToTerminal) {
        request.handlingArea = [];
        for (const eachRow of dataToTerminal) {
          request.handlingArea.push(eachRow.code)
        }
      }
      if (this.mntform.get('flightId').value === null || this.mntform.get('flightId').value === " ") {
        this.flightService.saveFlightDetails(request).subscribe(data => {
          this.gettingOperativeFlight = data;
          this.errors = this.gettingOperativeFlight.messageList;
          if (this.showResponseErrorMessages(data)) {
          }
          else {
            this.mntform.get('flightSegments').patchValue(this.gettingOperativeFlight.data.flightSegments);
            this.mntform.get('terminalList').patchValue(this.gettingOperativeFlight.data.terminalList);
            this.lengthLegList = (<NgcFormArray>this.mntform.get('flightLegs')).length;
            this.disabledControles = this.lengthLegList;
            this.restoreBoolean = false;
            this.editableBoolean = true;
            this.getResponse(request);
            if (this.gettingOperativeFlight.data.autoFlightFlag == 'Off') {
              setTimeout(() => { this.mntform.get('flightAutoCompleteFlag').setValue('Off') }, 3000)
            }
            if (this.gettingOperativeFlight.data.autoFlightFlag == 'On') {
              setTimeout(() => { this.mntform.get('flightAutoCompleteFlag').setValue('On') }, 3000)
            }
            this.onSearch();
            this.showSuccessStatus('flight.create.flight.success');
            return;
          }
        },
          error => { this.showErrorStatus('flight.save.error'); }
        );
      }

    }
  }

  loadAsssitedValue() {
    if (this.mntform.get('groundHandlerCode').value === 'SATS') {
      this.hideHandlerDropdown = true;
    } else {
      this.hideHandlerDropdown = false;
    }
  }

  /**
   *  On Cancel
   *
   * @param event
   */
  public onCancelFlight(event) {
    const self = this;
    this.showConfirmMessage('flight.cancel.warning.press.yes').then(fulfilled => {
      if (this.editableBoolean) {
        const request: FlightRequest = new FlightRequest();
        request.flightId = this.mntform.get('flightId').value;
        request.flightStatus = this.mntform.get('flightStatus').value;
        request.flightNo = this.mntform.get('flightNo').value;
        request.flightDate = this.mntform.get('flightDate').value;
        request.carrierCode = this.mntform.get('carrierCode').value;
        request.inboundCancelReason = this.mntform.get('inboundCancelReason').value;
        request.inboundCancelRemark = this.mntform.get('inboundCancelRemark').value;
        request.outboundCancelReason = this.mntform.get('outboundCancelReason').value;
        request.outboundCancelRemark = this.mntform.get('outboundCancelRemark').value;
        request.flightLegs = (<NgcFormArray>this.mntform.get('flightLegs')).value;
        var isIncomingFlight: boolean = false;
        var isOutgoingFlight: boolean = false;
        for (let index = 0; index < request.flightLegs.length; index++) {
          if (request.flightLegs[index].boardPointCode == NgcUtility.getTenantConfiguration().airportCode) {
            isOutgoingFlight = true;
          }
          if (request.flightLegs[index].offPointCode == NgcUtility.getTenantConfiguration().airportCode) {
            isIncomingFlight = true;
          }
        }
        if (NgcUtility.isEntityAttributeEnabled("Flight.Remarks")) {
          if (isIncomingFlight && (NgcUtility.isBlank(this.mntform.get('inboundCancelRemark').value) || NgcUtility.isBlank(this.mntform.get('inboundCancelReason').value))) {
            this.remarksIcon = "error";
            this.remarksTabComponent.focus();
            this.mntform.get('inboundCancelRemark').setValidators([Validators.required]);
            this.mntform.get('inboundCancelReason').setValidators([Validators.required]);
            if (NgcUtility.isBlank(this.mntform.get('inboundCancelRemark').value)) {
              this.showInfoStatus("flight.please.fill.cancel.remark");
              this.inboundCancelRemarkComponent.focus();
              return;
            } else {
              this.showInfoStatus("flight.please.fill.cancel.reason");
              this.inboundCancelReasonComponent.focus();
              return;
            }
          } else {
            this.remarksIcon = "";
          }
          if (isOutgoingFlight && (NgcUtility.isBlank(this.mntform.get('outboundCancelRemark').value) || NgcUtility.isBlank(this.mntform.get('outboundCancelReason').value))) {
            this.remarksIcon = "error";
            this.remarksTabComponent.focus();
            this.mntform.get('outboundCancelRemark').setValidators([Validators.required]);
            this.mntform.get('outboundCancelReason').setValidators([Validators.required]);
            if (NgcUtility.isBlank(this.mntform.get('outboundCancelRemark').value)) {
              this.showInfoStatus("flight.please.fill.cancel.remark");
              this.outboundCancelRemarkComponent.focus();
              return;
            } else {
              this.showInfoStatus("flight.please.fill.cancel.reason");
              this.outboundCancelReasonComponent.focus();
              return;
            }
          } else {
            this.remarksIcon = "";
          }
        }
        this.flightService.cancelFlightDetails(request).subscribe(data => {
          this.restoreBoolean = true;
          this.gettingOperativeFlight = data;
          this.errors = this.gettingOperativeFlight.messageList;
          if (this.gettingOperativeFlight.data == null) {
            this.showErrorStatus(this.errors[0].message);
            this.editableBoolean = true;
            this.restoreBoolean = false;
          }
          else {
            this.mntform.get('flightStatus').setValue('CANCELLED');
            this.disableclosebutton = true;
            this.onSearch();
            this.showSuccessStatus('flight.cancel.flight.success');
          }
        },
          error => { this.showErrorStatus('flight.save.error'); }
        );
      }
    }).catch(reason => {
    });
  }
  /**
   * On Restore
   *
   * @param event
   */
  public onRestore(event) {
    this.showConfirmMessage('flight.restore.warning.press.yes').then(fulfilled => {
      if (this.restoreBoolean) {
        const request: FlightRequest = new FlightRequest();
        request.flightId = this.mntform.get('flightId').value;
        request.flightStatus = this.mntform.get('flightStatus').value;
        request.flightNo = this.mntform.get('flightNo').value;
        request.flightDate = this.mntform.get('flightDate').value;
        request.carrierCode = this.mntform.get('carrierCode').value;
        request.flightLegs = (<NgcFormArray>this.mntform.get('flightLegs')).value;
        this.flightService.restoreFlightDetails(request).subscribe(data => {
          this.restoreBoolean = false;
          this.gettingOperativeFlight = data;
          this.errors = this.gettingOperativeFlight.messageList;
          if (this.gettingOperativeFlight.data == null) {
            this.showErrorStatus(this.errors[0].message);
          }
          else {
            this.mntform.get('flightStatus').setValue('Active');
            this.disableclosebutton = false;
            this.showSuccessStatus('flight.restore.flight.success');
            this.onSearch()
          }
        },
          error => { this.showErrorStatus('flight.save.error'); }
        );
      }
    }).catch(reason => {
    });
  }

  public ondeleteFlight(event) {
    this.showConfirmMessage('flight.delete.warning.press.yes').then(fulfilled => {
      if (this.restoreBoolean) {
        const request: FlightRequest = new FlightRequest();
        request.flightId = this.mntform.get('flightId').value;
        request.flightStatus = this.mntform.get('flightStatus').value;
        request.flightNo = this.mntform.get('flightNo').value;
        request.flightDate = this.mntform.get('flightDate').value;
        request.carrierCode = this.mntform.get('carrierCode').value;
        request.loggedInUser = this.getUserProfile().userLoginCode;
        request.flightLegs = (<NgcFormArray>this.mntform.get('flightLegs')).value;
        if (request.flightStatus == "CANCELLED") {
          this.flightService.deleteFlightDetail(request).subscribe(data => {
            this.restoreBoolean = false;
            this.gettingOperativeFlight = data;
            this.errors = this.gettingOperativeFlight.messageList;
            if (this.gettingOperativeFlight.data == null) {
              this.showErrorStatus(this.errors[0].message);
            }
            else {
              this.disableclosebutton = false;
              this.showSuccessStatus('flight.delete.success');
              //  this.mntform.reset();
              this.onClear();
              //  this.navigateTo(this.router, '/flight/maintenanceoperativeflight', null);
            }
          },
            error => { this.showErrorStatus('flight.save.error'); }
          );
        } else {
          this.showErrorMessage('Cannot delete flight for now');
        }
      }
    }).catch(reason => {
    });
  }

  /**
   * Close For Booking
   *
   * @param event
   */
  public closeForBooking(event) {

    const self = this;
    this.showConfirmMessage('flight.close.booking.warning.press.yes').then(fulfilled => {
      if (this.editableBoolean) {
        const request: FlightRequest = new FlightRequest();
        request.flightId = this.mntform.get('flightId').value;
        request.flightStatus = this.mntform.get('flightStatus').value;
        request.flightNo = this.mntform.get('flightNo').value;
        request.flightDate = this.mntform.get('flightDate').value;
        request.carrierCode = this.mntform.get('carrierCode').value;
        request.flightLegs = (<NgcFormArray>this.mntform.get('flightLegs')).value;
        this.flightService.closeForBooking(request).subscribe(data => {
          this.bookingStatus = true;
          this.bookingStatusFlag = true;
          this.gettingOperativeFlight = data;
          this.errors = this.gettingOperativeFlight.messageList;
          if (this.gettingOperativeFlight.data == null) {
            this.showErrorStatus(this.errors[0].message);
          }
          else {
            this.getResponse(request);

            this.showSuccessStatus('flight.update.flight.success');
          }
        },
          error => { this.showErrorStatus('flight.save.error'); }
        );
      }
    }).catch(reason => {
    });
  }
  /**
   * openForBooking
   *
   * @param event
   */
  public openForBooking(event) {
    const self = this;
    this.showConfirmMessage('flight.open.booking.warning.press.yes').then(fulfilled => {
      if (this.editableBoolean) {
        const request: FlightRequest = new FlightRequest();
        request.flightId = this.mntform.get('flightId').value;
        request.flightStatus = this.mntform.get('flightStatus').value;
        request.flightNo = this.mntform.get('flightNo').value;
        request.flightDate = this.mntform.get('flightDate').value;
        request.carrierCode = this.mntform.get('carrierCode').value;
        request.flightLegs = (<NgcFormArray>this.mntform.get('flightLegs')).value;
        this.flightService.openForBooking(request).subscribe(data => {
          this.bookingStatus = false;
          this.bookingStatusFlag = false;
          this.gettingOperativeFlight = data;
          this.errors = this.gettingOperativeFlight.messageList;
          if (this.gettingOperativeFlight.data == null) {
            this.showErrorStatus(this.errors[0].message);
          }
          else {
            this.getResponse(request);
            this.showSuccessStatus('flight.update.flight.success');
          }
        },
          error => { this.showErrorStatus('flight.save.error'); }
        );
      }
    }).catch(reason => {
    });
  }
  public onSelect(object) {

    this.mntform.get('carrierName').setValue(object.desc);
    this.mntform.get('groundHandlerCode').patchValue(object.param2);

    this.loadAsssitedValue();

  }
  onChangeOfJointFLight(event, index) {
    let parameter1, parameter2, parameter3, parameter4, parameter5;
    parameter5 = this.mntform.get('carrierCode').value + this.mntform.get('flightNo').value;
    const flightLegs = (<NgcFormArray>this.mntform.get('flightLegs')).value;
    if (flightLegs.length > 0) {
      flightLegs.forEach(element => {
        if (NgcUtility.isTenantAirport(element.boardPointCode)) {
          parameter1 = element.departureDate;
          parameter2 = element.offPointCode;
          parameter3 = element.aircraftModel;
          parameter4 = element.arrivalDate;
        }
        this.jointGroupCodeParam = this.createSourceParameter(parameter1, parameter2, parameter3, parameter4, parameter5);

        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_RHO) &&
          NgcUtility.isTenantAirport(element.boardPointCode) &&
          element.departureDate &&
          NgcUtility.getTimeAsString(element.departureDate) != "00:00") {
          var departureTime = NgcUtility.getTimeAsString(element.departureDate);
          this.inboundRhoLovParam = this.createSourceParameter(parameter5, this.mntform.get('carrierCode').value, 'RHO', null, departureTime, null, this.mntform.get('caoPax').value, element.aircraftModel);
          this.retrieveLOVRecords("SERVICE_PROVIDER_TYPE_LOV", this.inboundRhoLovParam).subscribe(response => {
            if (element.flagSaved != "Y") {
              this.mntform.get(['outboundFlightAttributes', 'rho']).patchValue(response[0].param1);
            }
          }, error => {
            this.mntform.get(['outboundFlightAttributes', 'rho']).setValue(null);
            this.showErrorMessage("flight.rho.details.missing");
          });
        }
        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_RHO) &&
          NgcUtility.isTenantAirport(element.offPointCode) &&
          element.arrivalDate &&
          NgcUtility.getTimeAsString(element.arrivalDate) != "00:00") {
          var arrivalDate = NgcUtility.getTimeAsString(element.arrivalDate);
          this.inboundRhoLovParam = this.createSourceParameter(parameter5, this.mntform.get('carrierCode').value, 'RHO', null, null, arrivalDate, this.mntform.get('caoPax').value, element.aircraftModel);
          this.retrieveLOVRecords("SERVICE_PROVIDER_TYPE_LOV", this.inboundRhoLovParam).subscribe(response => {
            if (element.flagSaved != "Y") {
              this.mntform.get(['inboundFlightAttributes', 'rho']).patchValue(response[0].param1);
            }
          }, error => {
            this.mntform.get(['inboundFlightAttributes', 'rho']).setValue(null);
            this.showErrorMessage("flight.rho.details.missing");
          });
        }

        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_BuBdOffice) &&
          element.flagSaved != "Y" &&
          (element.boardPointCode != null ||
            element.offPointCode != null)) {
          var importOrExport;
          if (NgcUtility.isTenantAirport(element.boardPointCode)) {
            importOrExport = "O";
          }
          if (NgcUtility.isTenantAirport(element.offPointCode)) {
            importOrExport = "I";
          }
          const request = {
            carrierCode: this.mntform.get('carrierCode').value,
            flightType: importOrExport
          };
          this.flightService.fetchDefaultBuBdOfficeDetails(request).subscribe(data => {
            console.log(data);
            if (data.data != null) {
              if (data.data.flightType == "I") {
                this.mntform.get(['inboundFlightAttributes', 'bubdOffice']).patchValue(data.data.buBdOffice);
                this.mntform.get(['inboundFlightAttributes', 'printer']).patchValue(data.data.printer);
              }
              if (data.data.flightType == "O") {
                this.mntform.get(['outboundFlightAttributes', 'bubdOffice']).patchValue(data.data.buBdOffice);
                this.mntform.get(['outboundFlightAttributes', 'printer']).patchValue(data.data.printer);
              }
              if (data.data.flightType == "B" && NgcUtility.isTenantAirport(element.boardPointCode)) {
                this.mntform.get(['outboundFlightAttributes', 'bubdOffice']).patchValue(data.data.buBdOffice);
                this.mntform.get(['outboundFlightAttributes', 'printer']).patchValue(data.data.printer);
              }
              if (data.data.flightType == "B" && NgcUtility.isTenantAirport(element.offPointCode)) {
                this.mntform.get(['inboundFlightAttributes', 'bubdOffice']).patchValue(data.data.buBdOffice);
                this.mntform.get(['inboundFlightAttributes', 'printer']).patchValue(data.data.printer);
              }
            } else {
              if (this.mntform.get(['inboundFlightAttributes', 'flightId']) == null) {
                this.mntform.get(['inboundFlightAttributes', 'bubdOffice']).setValue(null);
                this.mntform.get(['inboundFlightAttributes', 'printer']).setValue(null);
              }
              if (this.mntform.get(['outboundFlightAttributes', 'flightId']) == null) {
                this.mntform.get(['outboundFlightAttributes', 'bubdOffice']).setValue(null);
                this.mntform.get(['outboundFlightAttributes', 'printer']).setValue(null);
              }
            }
          }, error => {

          });
        }

        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_RHO)) {
          if (element.boardPointCode && NgcUtility.isTenantAirport(element.boardPointCode)
            && element.aircraftModel != 'TRK') {
            this.mntform.get('outboundFlightAttributes.rho').setValidators([Validators.required]);
            this.mntform.get('outboundFlightAttributes.bubdOffice').setValidators([Validators.required]);
            this.mntform.get('outboundFlightAttributes.printer').setValidators([Validators.required]);
          }
          if (element.offPointCode && NgcUtility.isTenantAirport(element.offPointCode)
            && element.aircraftModel != 'TRK') {
            this.mntform.get('inboundFlightAttributes.rho').setValidators([Validators.required]);
            this.mntform.get('inboundFlightAttributes.bubdOffice').setValidators([Validators.required]);
            this.mntform.get('inboundFlightAttributes.printer').setValidators([Validators.required]);
          }
        }
      });
    }
    if (event && event.code == "TRK"
      && NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_RHO)
      && this.mntform.get(['inboundFlightAttributes', 'truckSeaCompany']).value == null
      && this.mntform.get(['outboundFlightAttributes', 'truckSeaCompany']).value == null) {
      this.showInfoStatus('for.aircraft.trk.select.truck.sea.company');
    }
    if (event && event.code == "TRK" && NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_CustomsImportFlightDate)
      && this.mntform.get('customerShortName').value == null) {
      this.showInfoStatus('for.aircraft.trk.select.truck.sea.company');
    }


  }

  public afterFocus() {
    super.afterFocus();
    if (this.serviceTypeComponent && !this.serviceTypeFocused) {
      this.serviceTypeFocused = true;
      this.serviceTypeComponent.focus();
    }

  }

  onCancel(event) {
    this.onSearchFlag = false;
    this.mntform.reset();
    this.navigateHome();
  }

  onHistory(event) {
    var flightDateForHistory = this.flightOriginDate.substring(0, 10);
    var flightDate = this.mntform.get('flightDate').value;
    var flightEntityValueHistory = this.mntform.get('carrierCode').value + this.mntform.get('flightNo').value;
    var carrierCode = this.mntform.get('carrierCode').value;
    var flightNo = this.mntform.get('flightNo').value;
    var datestaorstd = null;
    let legsWithoutDelete: any = (<NgcFormArray>this.mntform.get('flightLegs')).value.filter(value => value.flagCRUD != 'D');
    let boardpointlist = legsWithoutDelete.filter(value => NgcUtility.isTenantAirport(value.boardPointCode));
    let offpointlist = legsWithoutDelete.filter(value => NgcUtility.isTenantAirport(value.offPointCode));
    if (boardpointlist.length > 0) {
      datestaorstd = boardpointlist[0].departureDate;
    }
    if (offpointlist.length > 0) {
      datestaorstd = offpointlist[0].arrivalDate;
    }
    var source = 'OPERATIVEFLIGHT';
    var dataToSend = {
      flightOriginDate: flightDateForHistory,
      flightDate: flightDate,
      flightEntityValue: flightEntityValueHistory,
      flightKey: flightEntityValueHistory,
      carrierCode: carrierCode,
      flightNo: flightNo,
      flightdateforflight: flightDate,
      datestaorstd: datestaorstd,
      source: source

    }

    dataToSend.flightDate = NgcUtility.getDateTimeAsStringByFormat(flightDate, 'YYYY-MM-DD')
    this.navigateTo(this.router, "/audit/audittrailbyflight", dataToSend);
  }

  checkUpdated(event, index) {
    this.updateLegsFlag = false;
    const oldboardPointCode = this.gettingOperativeFlight.data.flightLegs[index].boardPointCode;
    const oldoffPointCode = this.gettingOperativeFlight.data.flightLegs[index].offPointCode;
    const oldarrivalDate = (<NgcFormControl>this.mntform.get(['flightLegs', index, 'checkArrivalDate'])).value;
    const olddepartureDate = (<NgcFormControl>this.mntform.get(['flightLegs', index, 'checkDepartureDate'])).value;
    const checkLegData = (<NgcFormArray>this.mntform.get(['flightLegs'])).value;
    for (const eachRow of checkLegData) {
      if (eachRow.flagCRUD) {

        if (oldboardPointCode !== eachRow.boardPointCode ||
          oldoffPointCode !== eachRow.offPointCode ||
          oldarrivalDate.getTime() !== eachRow.arrivalDate.getTime() ||
          olddepartureDate.getTime() !== eachRow.departureDate.getTime()) {
          this.updateLegsFlag = true;
        }
      }
    }
  }

  onClear() {
    this.gettingOperativeFlight = null;
    this.autoFlightEnable = false;
    this.editableBoolean = false;
    this.onSearchFlag = false;
    this.disabledControles = 0;
    this.boardPointFlag = false;
    this.offPointFlag = false;
    this.mntform.reset();
    (<NgcFormArray>this.mntform.get('flightLegs')).reset();
    this.onSaveFlag = false;
    this.flagExpUld = false;
    this.bookingStatusFlag = false;
    this.defaultTerminal = false;
    this.flagDisplayTerminalDropdownListFalse = false;
    this.editableSTD = 0;
    this.editableSTDFlag = false;
    this.flagApron = false;
    this.mntform.get('flightDate').setValue(this.defaultDate)
    this.resetFormMessages();
    this.mntform.patchValue(this.gettingOperativeFlight);
    this.navigateTo(this.router, '/flight/maintenanceoperativeflight', null);
    this.reloadPage();
  }

  clickOnOK() {
    this.flightCompletePopup.close();
  }

  updateColumnLengthsDynamically() {

    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_CustomsImportFlightNumber) &&
      !NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_WarehouseLevel)) {
      this.flightInfoColumn = 4;
      this.customsColumn = 3;
      this.isOnlyIgmEgmEnabled = true;
    }

    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Flight_Priority)) {
      this.flightInfoColumn = 6;
      this.flightPriorityColumn = 1;
    }
  }
  setCustomerShortName(event) {
    if (event && event.code) {
      this.customerShortName = event.code;
      this.contractorId = event.param1;
    }
  }

  checkProviderType(event, from: string) {
    this.customerShortName = event.code;
    this.providerType = event.param2;
    const request: FlightRequest = new FlightRequest();
    request.carrierCode = this.mntform.get('carrierCode').value;
    request.flightDate = this.mntform.getRawValue().flightDate;
    request.flightNo = this.mntform.getRawValue().flightNo;
    request.flightKey = request.carrierCode + request.flightNo;
    request.flightId = this.mntform.get('flightId').value;
    request.flightStatus = this.mntform.get('flightStatus').value;
    request.description = this.mntform.get('description').value;
    request.flightLegs = (<NgcFormArray>this.mntform.get('flightLegs')).value;
    request.inboundFlightAttributes = this.mntform.get("inboundFlightAttributes").value;
    request.outboundFlightAttributes = this.mntform.get("outboundFlightAttributes").value;

    if (from == "OUTBOUND") {
      request.outboundFlightAttributes.companyServiceType = event.param2;
    }
    if (from == "INBOUND") {
      request.inboundFlightAttributes.companyServiceType = event.param2;
    }

    this.flightService.generateCustomFlightNumber(request).subscribe(data => {
      if (this.showResponseErrorMessages(data)) {
        if (from == "OUTBOUND") {
          this.mntform.get(['outboundFlightAttributes', 'truckSeaCompany']).setValue('');
        }
        if (from == "INBOUND") {
          this.mntform.get(['inboundFlightAttributes', 'truckSeaCompany']).setValue('');
        }
      }
      if (data.data) {
        if (from == "OUTBOUND") {
          this.mntform.get(['outboundFlightAttributes', 'customsFlightNumber']).setValue(data.data.outboundFlightAttributes.customsFlightNumber);
        }
        if (from == "INBOUND") {
          this.mntform.get(['inboundFlightAttributes', 'customsFlightNumber']).setValue(data.data.inboundFlightAttributes.customsFlightNumber);
        }
      }
    },
      error => { this.showErrorStatus(error); });

  }

  fetchExistingSchedule() {
    if (this.mntform.get('carrierCode') != null && this.mntform.get('flightNo') != null && this.mntform.get('flightDate') != null) {
      const request = {
        carrierCode: this.mntform.get('carrierCode').value,
        flightNo: this.mntform.get('flightNo').value,
        flightDate: this.mntform.get('flightDate').value
      };
      this.flightService.fetchExistingScheduleForFlight(request).subscribe(response => {
        if (response.data != null) {
          this.schPresent = true;
          this.mntform.get('schDetails').patchValue(response.data);
          if (!this.gettingOperativeFlight.data) {
            this.showErrorMessage('flight.schedule.already.present');
          }
        }
      }, error => {

      });
    }
  }
}
