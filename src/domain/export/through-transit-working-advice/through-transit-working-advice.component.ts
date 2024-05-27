import {
  NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcPage, NgcButtonComponent, PageConfiguration, NgcFormControl, NgcUtility
} from 'ngc-framework';
import {
  Component, OnInit, ViewEncapsulation, ViewChild, ViewChildren, NgZone, ElementRef, ViewContainerRef
} from '@angular/core';
import { Validator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ThroughTransitWorkingAdviceModel, ConnectingFlights,
  ThroughTransitWorkingAdviceUldModel, ThroughTransitWorkingAdviceShipmentModel,
  PiggyBackUldModel
} from './../export.sharedmodel';
import { ExportService } from './../export.service';

@Component({
  selector: 'ngc-through-transit-working-advice',
  templateUrl: './through-transit-working-advice.component.html'
})
@PageConfiguration({
  trackInit: true
})

export class ThroughTransitWorkingAdviceComponent extends NgcPage {
  uldIndex: any;
  response: any;
  flightIndex: any;
  windowFlag = false;
  headerFlag = false;
  contourCodeResponse: any;
  tempPiggybackArray: any;
  incomingFlights: any[] = [];
  showDeleteIcon: boolean = false;
  incomingFlightsEmptyDropDown = false;
  incomingFlightsDropDown = true;
  sourceParameterForSegment: any;
  clickedIncomingFlights: any;
  @ViewChild('piggyBackWindow') piggyBackWindow: NgcWindowComponent;
  @ViewChild('displayDifferenceWindow') displayDifferenceWindow: NgcWindowComponent;

  // Display Record after search
  showResponseFlag = false;

  private eachBulk = {
    pieces: 0,
    weight: 0,
    remarks: '',
    location: '',
    select: false,
    impFlag: false,
    flagInsert: 'Y',
    transferType: '',
    natureOfGoods: '',
    tttRemarks: false,
    shipmentNumber: '',
    weightUnitCode: 'K',
    shipmentFlag: false,
    shcList: []
  };

  private addFlightRow = {
    origin: '',
    dateSTA: '',
    flagInsert: 'Y',
    flagCRUD: 'C',
    inboundFlight: '',
    inboundFlightDate: '',
    flightPairFlag: false,
    flightPairSequence: '',
    inboundFlightSegmentId: '',
    bulkShipments: [{
      pieces: 0,
      weight: 0,
      remarks: '',
      location: '',
      select: false,
      impFlag: false,
      flagInsert: 'Y',
      flagCRUD: 'C',
      transferType: '',
      tttRemarks: false,
      natureOfGoods: '',
      shipmentNumber: '',
      weightUnitCode: 'K',
      shipmentFlag: false,
      shcList: []
    }],
    uldWithShipments: [{
      edit: '',
      weight: 0,
      remarks: '',
      select: false,
      uldNumber: '',
      impFlag: false,
      uldFlag: false,
      contourCode: '',
      flagInsert: 'Y',
      transferType: '',
      tttRemarks: false,
      natureOfGoods: '',
      weightUnitCode: 'K',
      flagCRUD: 'C',
      shcList: [],
      shipments: [{
        flagCRUD: 'C',
        shipmentNumber: '',
        pieces: 0,
        weight: 0,
        weightUnitCode: '',
        natureOfGoods: '',
        shcList: []
      }],
      piggyBackUlds: [{
        sno: '',
        select: false,
        piggyNumber: ''
      }]
    }]
  };

  private eachPiggy = {
    sno: '',
    select: false,
    piggyNumber: ''
  }

  private eachUldDetails = {
    edit: '',
    weight: 0,
    shcList: [],
    remarks: '',
    select: false,
    uldNumber: '',
    impFlag: false,
    uldFlag: false,
    flagInsert: 'Y',
    flagCRUD: 'C',
    contourCode: '',
    transferType: '',
    natureOfGoods: '',
    tttRemarks: false,
    weightUnitCode: '',
    piggyBackUlds: [{
      sno: '',
      select: false,
      piggyNumber: ''
    }],
    shipments: [{
      weight: 0,
      pieces: '',
      select: false,
      flagInsert: 'Y',
      flagCRUD: 'C',
      natureOfGoods: '',
      tttRemarks: false,
      shipmentNumber: '',
      weightUnitCode: '',
      shipmentFlag: false,
      shcList: []
    }]
  };

  private eachShipment = {
    weight: 0,
    pieces: '',
    select: false,
    flagCRUD: 'C',
    flagInsert: 'Y',
    natureOfGoods: '',
    tttRemarks: false,
    shipmentNumber: '',
    weightUnitCode: '',
    shipmentFlag: false,
    shcList: []
  };
  /*
  Search Form
  */
  private ttwaformSearch: NgcFormGroup = new NgcFormGroup({
    shift: new NgcFormControl(),
    origin: new NgcFormControl(),
    dateSTD: new NgcFormControl(),
    dateSTA: new NgcFormControl(),
    adviceDate: new NgcFormControl(),
    flightType: new NgcFormControl(),
    destination: new NgcFormControl(),
    outboundFlight: new NgcFormControl(),
    outboundFlightDate: new NgcFormControl(),
    flightPairSequence: new NgcFormControl(),
    inboundFlightSegmentId: new NgcFormControl(),
    outboundFlightSegmentId: new NgcFormControl(),
    inboundFlight: new NgcFormControl(),
    inboundFlightDate: new NgcFormControl(),
  });

  /*
  Response Form To patch after Search
  */
  private ttwaform: NgcFormGroup = new NgcFormGroup({
    origin: new NgcFormControl(),
    dateSTD: new NgcFormControl(),
    dateSTA: new NgcFormControl(),
    destination: new NgcFormControl(),
    inboundFlight: new NgcFormControl(),
    piggyBackUlds: new NgcFormArray([]),
    connectingFlights: new NgcFormArray([]),
    inboundFlightDate: new NgcFormControl(),
    flightPairSequence: new NgcFormControl(),
    selectedInboundFlight: new NgcFormControl(),
    inboundFlightSegmentId: new NgcFormControl(),
    displayDifferenceArray: new NgcFormArray([]),
    shift: new NgcFormControl('', Validators.required),
    adviceDate: new NgcFormControl('', Validators.required),
    flightType: new NgcFormControl('', Validators.required),
    outboundFlight: new NgcFormControl('', Validators.required),
    outboundFlightDate: new NgcFormControl('', Validators.required),
    outboundFlightSegmentId: new NgcFormControl('', Validators.required),
  });
  outBoundFlightId: any;
  shift: any;
  adviceDate: Date;
  outboundFlightSegmentId: any;
  incomingFlightBoardPoint: any;
  incomingFlightOffPoint: any;
  mode: any;
  ttwaformDefault: any;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private route: ActivatedRoute, private exportService: ExportService, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  /**
   * Initialize default values of volume code
   * and weight code on initialization
   * @memberof BookMultipleShipmentComponent
   */
  ngOnInit() {
    const transferData = this.getNavigateData(this.route);
    if (transferData) {
      if (transferData.flightType == 'PASSENGER') {
        transferData.flightType = 'PAX';
      }
      this.outboundFlightSegmentId = transferData.outboundFlightSegmentId;
      this.ttwaformSearch.patchValue(transferData);
      this.ttwaform.get('selectedInboundFlight').patchValue(transferData.selectedInboundFlight);
      this.mode = transferData.mode;
      this.createSourceParameterForFlightSegment();
      if (transferData.mode === 'sendTT') {
        let selectedFlight = null;
        if (transferData.inboundFlight) {
          selectedFlight = transferData.inboundFlight + ' ' + transferData.formattedInboundDate + ' ' + transferData.flightBoardPoint + ' ' + transferData.formattedInboundTime;
        } else {
          const temp = transferData.selectedInboundFlight.split(" ");
          selectedFlight = transferData.selectedInboundFlight;
          transferData.inboundFlight = temp[0];
          transferData.formattedInboundDate = NgcUtility.getDateTimeByFormat(temp[1], 'DD-MM-YYYY');
          transferData.flightBoardPoint = temp[2];
          transferData.formattedInboundTime = temp[3];
        }

        const incomingData = {
          incomingFlt: selectedFlight,
          mode: transferData.mode,
          inboundFlight: transferData.inboundFlight,
          formattedInboundDate: transferData.formattedInboundDate,
          flightBoardPoint: transferData.flightBoardPoint,
          formattedInboundTime: transferData.formattedInboundTime

        }
        this.onFlightSelect(incomingData);

      } else {
        this.onSearch(null);
      }

    }
    (<NgcFormArray>this.ttwaform.controls.connectingFlights).addValue([this.addFlightRow]);
    this.ttwaformDefault = this.ttwaform.getRawValue();
  }

  //method for getting defalut contour code
  getContourCode(event, uldItem, k, i) {
    let uldData = this.ttwaform.get(['connectingFlights', i, 'uldWithShipments', k]).value;
    this.exportService.getContourCodeForTTWorkingAdvice(uldData).subscribe(response => {
      if (response.data != null) {
        this.contourCodeResponse = response.data;
        this.ttwaform.get(['connectingFlights', i, 'uldWithShipments', k, 'contourCode']).
          setValue(this.contourCodeResponse.contourCode);
      }
    });
  }

  onSearch(event) {
    this.ttwaformSearch.validate();
    // Check whether form is valid or not
    if (this.ttwaformSearch.invalid) {
      // return;
    }
    this.ttwaform.get('selectedInboundFlight').reset();
    this.getIncomingflights(event);
  }

  onUld(index) {
    (<NgcFormArray>this.ttwaform.get(['connectingFlights', index, 'uldWithShipments'])).validate();
    const uldList = (<NgcFormArray>this.ttwaform.get(['connectingFlights', index, 'uldWithShipments']));
    const uld = (<NgcFormArray>this.ttwaform.get(['connectingFlights', index, 'uldWithShipments'])).getRawValue();

    if (uldList.invalid) {
      this.showErrorStatus('export.fill.in.mandatory.details');
      return;
    }
    (<NgcFormArray>this.ttwaform.get(['connectingFlights', index, 'uldWithShipments'])).addValue(
      [this.eachUldDetails]
    );
  }

  onBulk(index) {
    //const bulkIndex = (<NgcFormArray>this.ttwaform.get(['connectingFlights', index, 'bulkShipments'])).length - 1;
    (<NgcFormArray>this.ttwaform.get(['connectingFlights', index, 'bulkShipments'])).validate();
    const bulkList = (<NgcFormArray>this.ttwaform.get(['connectingFlights', index, 'bulkShipments']));
    if (bulkList.invalid) {
      this.showErrorStatus('export.fill.in.mandatory.details');
      return;
    }

    const bulk = (<NgcFormArray>this.ttwaform.get(['connectingFlights', index, 'bulkShipments'])).getRawValue();
    (<NgcFormArray>this.ttwaform.get(['connectingFlights', index, 'bulkShipments'])).addValue(
      [this.eachBulk]
    );
  }

  onShipment(i, k) {
    (<NgcFormArray>this.ttwaform.get(['connectingFlights', i, 'uldWithShipments', k, 'shipments'])).validate();
    const ship = (<NgcFormArray>this.ttwaform.get(['connectingFlights', i, 'uldWithShipments', k, 'shipments']));

    if (ship.invalid) {
      this.showErrorStatus('export.fill.in.mandatory.details');
      return;
    }
    (<NgcFormArray>this.ttwaform.get(['connectingFlights', i, 'uldWithShipments', k, 'shipments'])).addValue([
      this.eachShipment
    ]);
  }

  validatePreExistingShift() {
    const searchFormData: any = this.ttwaformSearch.getRawValue();
    // setting advice model level data
    const ttwa: any = this.ttwaform.getRawValue() as ThroughTransitWorkingAdviceModel;

    if (searchFormData.outboundFlight != null && searchFormData.outboundFlightSegmentId == null) {
      this.showErrorMessage("export.invalid.outbound.flight");
      return;
    }
    ttwa.flightType = searchFormData.flightType;
    this.clickedIncomingFlights = ttwa.selectedInboundFlight;
    if (!searchFormData.shift || searchFormData.shift == '') {
      ttwa.shift = this.shift;
    } else {
      ttwa.shift = searchFormData.shift;
    }

    if (!searchFormData.adviceDate) {
      ttwa.adviceDate = this.adviceDate;
    } else {
      ttwa.adviceDate = searchFormData.adviceDate;
    }
    ttwa.flightPairSequence = searchFormData.flightPairSequence
    ttwa.outboundFlight = searchFormData.outboundFlight
    ttwa.outboundFlightDate = searchFormData.outboundFlightDate;
    ttwa.outboundFlightSegmentId = searchFormData.outboundFlightSegmentId;

    if (searchFormData.flightType == 'P' && (searchFormData.shift == '' || !searchFormData.shift)) {
      this.showErrorStatus('export.select.shift');
      return;
    }
    const uldArray: Array<any> = [];
    const bulkArray: Array<any> = [];
    const tempConFlightArr: Array<any> = [];
    if (!ttwa.connectingFlights[0].flagCRUD) {
      ttwa.connectingFlights[0].flagCRUD = 'C';
    }
    if (ttwa.connectingFlights[0].bulkShipments && ttwa.connectingFlights[0].bulkShipments.length > 0 &&
      !ttwa.connectingFlights[0].bulkShipments[0].flagCRUD) {
      ttwa.connectingFlights[0].bulkShipments[0].flagCRUD = 'C'
    }
    if (ttwa.connectingFlights[0].uldWithShipments && ttwa.connectingFlights[0].uldWithShipments.length > 0 &&
      !ttwa.connectingFlights[0].uldWithShipments[0].flagCRUD) {
      ttwa.connectingFlights[0].uldWithShipments[0].flagCRUD = 'C'
    }
    if (ttwa.connectingFlights[0].uldWithShipments && ttwa.connectingFlights[0].uldWithShipments.length > 0 &&
      ttwa.connectingFlights[0].uldWithShipments[0].shipments && ttwa.connectingFlights[0].uldWithShipments[0].shipments.length > 0 &&
      !ttwa.connectingFlights[0].uldWithShipments[0].shipments[0].flagCRUD) {
      ttwa.connectingFlights[0].uldWithShipments[0].shipments[0].flagCRUD = 'C'
    }
    const tempConFlight: ConnectingFlights = ttwa.connectingFlights[0];
    for (let i = tempConFlight.bulkShipments.length - 1; i >= 0; i--) {
      if (!tempConFlight.bulkShipments[i].shipmentNumber && tempConFlight.bulkShipments[i].pieces == 0
        && tempConFlight.bulkShipments[i].weight == 0.0 && !tempConFlight.bulkShipments[i].weightUnitCode &&
        !tempConFlight.bulkShipments[i].transferType) {
        // delete tempConFlight.bulkShipments[i];
      } else if (tempConFlight.bulkShipments[i].shipmentNumber) {
        bulkArray.push(tempConFlight.bulkShipments[i]);
      }
    }
    tempConFlight.bulkShipments = bulkArray;
    for (let j = tempConFlight.uldWithShipments.length - 1; j >= 0; j--) {
      if (tempConFlight.uldWithShipments[j].uldNumber) {
        let uldObjecct = tempConFlight.uldWithShipments[j];
        let uldShipArray: Array<any> = [];
        if (!uldObjecct.uldNumber && uldObjecct.weight == 0.0 && !uldObjecct.contourCode &&
          !uldObjecct.weightUnitCode && !uldObjecct.transferType) {
        } else {
          for (let k = uldObjecct.shipments.length - 1; k >= 0; k--) {
            if (!uldObjecct.shipments[k].shipmentNumber && uldObjecct.shipments[k].pieces == 0
              && uldObjecct.shipments[k].weight == 0.0 && !uldObjecct.shipments[k].weightUnitCode) {
            } else if (uldObjecct.shipments[k].shipmentNumber) {
              uldShipArray.push(uldObjecct.shipments[k]);
            }

          }
          uldObjecct.shipments = uldShipArray;
          uldArray.push(uldObjecct);
        }
      }
    }
    tempConFlight.uldWithShipments = uldArray;
    tempConFlightArr.push(tempConFlight);
    ttwa.connectingFlights = tempConFlightArr;
    if (searchFormData.flightType == 'P') {
      this.exportService.validatePreExistingShift(ttwa).subscribe(resp => {
        if (resp.data && resp.data.previousShipmentInfo) {
          this.showConfirmMessage(resp.data.previousShipmentInfo).then(fulfilled => {
            this.onSave(resp.data);
          }).catch(reason => {
            // Do nothing
          });
        } else {
          this.onSave(resp.data);
        }
      })
    } else {
      this.onSave(ttwa);
    }
  }

  onSave(ttwa) {
    this.exportService.insertTTWorkingAdvice(ttwa).subscribe(resp => {
      this.response = resp;
      if (this.response.success) {
        this.showSuccessStatus('g.completed.successfully');
        if (this.response.data.connectingFlights[0].multiplePartsShipments &&
          this.response.data.connectingFlights[0].multiplePartsShipments.length > 0) {
          this.showInfoStatus(NgcUtility.translateMessage("ttwa.use.book.single.shipment.screen", [this.response.data.connectingFlights[0].multiplePartsShipments.toString()]));
        }
        this.onSearch(null);
      } else {
        this.refreshFormMessages(this.response.data);
        this.refreshFormMessages(this.response);
      }
    });
    (error) => {
      this.showErrorStatus(error);
    }
  }

  onPiggyback(i, k) {
    this.flightIndex = i;
    this.uldIndex = k;
    (<NgcFormArray>this.ttwaform.get('piggyBackUlds')).patchValue(
      (<NgcFormArray>this.ttwaform.get(['connectingFlights', i, 'uldWithShipments', k, 'piggyBackUlds'])).getRawValue()
    );
    this.piggyBackWindow.open();
  }

  onAddRow() {
    (<NgcFormArray>this.ttwaform.get('piggyBackUlds')).validate();
    const piggyList = (<NgcFormArray>this.ttwaform.get('piggyBackUlds'));
    const piggy = (<NgcFormArray>this.ttwaform.get('piggyBackUlds')).getRawValue();

    if (!piggyList.valid) {
      this.showErrorStatus('export.fill.in.mandatory.details');
      return;
    }

    (<NgcFormArray>this.ttwaform.get('piggyBackUlds')).addValue(
      [this.eachPiggy]
    );
  }

  onOK() {
    (<NgcFormArray>this.ttwaform.get(['connectingFlights', this.flightIndex, 'uldWithShipments', this.uldIndex, 'piggyBackUlds'])).patchValue(
      (<NgcFormArray>this.ttwaform.get('piggyBackUlds')).getRawValue()
    );
    this.piggyBackWindow.close();
  }

  getTTWorkingAdvieData() {
    const ttwa: any = this.ttwaformSearch.getRawValue();
    if (!ttwa.outboundFlightSegmentId) {
      ttwa.outboundFlightSegmentId = this.outboundFlightSegmentId;
    }
    this.exportService.getTTWorkingAdvice(ttwa).subscribe(resp => {
      this.headerFlag = false;
      // To remove the result on every search
      this.showResponseFlag = false;
      this.response = resp;
      this.refreshFormMessages(resp);
      if (this.response.success) {
        if (this.response.data.connectingFlights && this.response.data.connectingFlights.length > 0 &&
          this.response.data.connectingFlights[0].bulkShipments.length < 1 &&
          this.response.data.connectingFlights[0].uldWithShipments.length < 1) {
          this.showDeleteIcon = true;
        } else {
          this.showDeleteIcon = false;
        }
        this.shift = this.response.data.shift;
        this.adviceDate = this.response.data.adviceDate;
        // It will display when response is successful on search
        this.showResponseFlag = true;
        this.ttwaform.patchValue(this.response.data);
        this.ttwaform.get('flightPairSequence').patchValue(ttwa.flightPairSequence);
        //this.ttwaformSearch.get('shift').patchValue(this.response.data.shift);
        if ((<NgcFormArray>this.ttwaform.get('connectingFlights')).controls) {
          this.headerFlag = true;
        }
        this.markAsDelete();
      } else {
        this.refreshFormMessages(this.response.data);
        this.showInfoStatus('no.record');
        this.refreshFormMessages(this.response);

        this.ttwaform.reset();
        this.ttwaform.patchValue(this.ttwaformDefault);
        this.incomingFlightsEmptyDropDown = true;
        this.incomingFlightsDropDown = false;
      }
    });
    (error) => {
      this.showErrorStatus(error);
    }
  }

  getIncomingflights(event) {
    // setting advice level data to get the record of paired incoming and outgoing flight
    this.ttwaformSearch.get('destination').patchValue(this.incomingFlightOffPoint);
    if (event === 'search') {
      this.ttwaform.get('connectingFlights').reset();
      const ttwa = this.ttwaformSearch.getRawValue();
      this.exportService.getIncomingFlights(ttwa).subscribe(resp => {
        this.showResponseFlag = false;
        if (!this.showResponseErrorMessages(resp)) {
          this.response = resp;
          this.refreshFormMessages(resp);
          if (this.response.success) {
            this.outBoundFlightId = resp.data.outBoundFlightId;
            this.incomingFlights = this.response.data.incomingFlights;
            /*
            FOR PATCHING VALUE FROM SEARCH FORM TO RESPONSE ARRAY
            AS FULL FORM IS NOT PATCHED
            */
            this.ttwaformSearch.get('dateSTD').setValue(this.response.data.dateSTD);
            if (ttwa.flightPairSequence && this.incomingFlights && this.incomingFlights.length > 0) {
              this.ttwaform.get('selectedInboundFlight').patchValue(this.incomingFlights[0]);
              this.ttwaformSearch.get('outboundFlight').patchValue(this.response.data.outboundFlight);
              this.ttwaformSearch.get('outboundFlightDate').patchValue(this.response.data.outboundFlightDate);
              this.ttwaformSearch.get('outboundFlightSegmentId').patchValue(this.response.data.outboundFlightSegmentId);
              this.incomingFlightsDropDown = true;
              this.incomingFlightsEmptyDropDown = false;
              this.onFlightSelect(null);
            } else {
              if (this.incomingFlights && this.incomingFlights.length > 0) {
                this.incomingFlightsDropDown = true;
                this.incomingFlightsEmptyDropDown = false;
                if (this.incomingFlights.length > 1) {
                  this.showInfoStatus('export.select.incoming.flight.from.dropdown');
                } else if (this.incomingFlights.length == 1) {
                  this.ttwaform.get('selectedInboundFlight').patchValue(this.incomingFlights[0]);
                  this.onFlightSelect(null);
                }
              } else {
                this.showResponseFlag = true;
                this.showInfoStatus('export.no.incoming.flight.found');
                this.incomingFlightsDropDown = false;
                this.incomingFlightsEmptyDropDown = true;
                (<NgcFormArray>this.ttwaform.controls.connectingFlights).removeAt(0);
                (<NgcFormArray>this.ttwaform.controls.connectingFlights).addValue([this.addFlightRow]);

              }
            }
          } else {
            this.showResponseFlag = true;
            this.incomingFlightsDropDown = false;
            this.incomingFlightsEmptyDropDown = true;
            this.showInfoStatus('export.no.incoming.flight.found');
            (<NgcFormArray>this.ttwaform.controls.connectingFlights).removeAt(0);
            (<NgcFormArray>this.ttwaform.controls.connectingFlights).addValue([this.addFlightRow]);
            this.refreshFormMessages(this.response.data);
            this.refreshFormMessages(this.response);
          }
        }
      }, error => {
        this.showErrorMessage(error);
      });
    } else {
      let incomingFLights = new Array();
      if (this.clickedIncomingFlights) {
        incomingFLights.push(this.clickedIncomingFlights);
        this.ttwaform.get('selectedInboundFlight').patchValue(incomingFLights[0]);
        this.onFlightSelect(null);
      } else {
        let savedIncomingFlight = this.ttwaform.get(['connectingFlights', 0, 'inboundFlight']).value;
        let savedIncomingFlightDate = this.ttwaform.get(['connectingFlights', 0, 'inboundFlightDate']).value;
        this.ttwaformSearch.get('inboundFlight').setValue(savedIncomingFlight);
        this.ttwaformSearch.get('inboundFlightDate').setValue(NgcUtility.getDateTimeByFormat(savedIncomingFlightDate, 'DD-MM-YYYY'));
        this.ttwaformSearch.get('origin').setValue(this.incomingFlightBoardPoint);
        this.ttwaformSearch.get('dateSTA').setValue('00:00');
        this.ttwaformSearch.get('inboundFlightSegmentId').setValue(null);
        this.getTTWorkingAdvieData();
      }


    }

  }



  onFlightSelect(event) {
    if (event && event.mode === 'sendTT') {
      let incomingFLights = new Array();
      incomingFLights.push(event.incomingFlt);
      this.incomingFlights = incomingFLights;
      this.ttwaform.get('selectedInboundFlight').patchValue(this.incomingFlights[0]);
      this.ttwaformSearch.get('inboundFlight').setValue(event.inboundFlight);
      this.ttwaformSearch.get('inboundFlightDate').setValue(NgcUtility.getDateTimeByFormat(event.formattedInboundDate, 'DD-MM-YYYY'));
      this.ttwaformSearch.get('origin').setValue(event.flightBoardPoint);
      this.ttwaformSearch.get('dateSTA').setValue(event.formattedInboundTime);

    } else {
      const inBoundFlight = this.ttwaform.get('selectedInboundFlight').value;
      const temp = inBoundFlight.split(" ");
      this.ttwaformSearch.get('inboundFlight').setValue(temp[0]);
      this.ttwaformSearch.get('inboundFlightDate').setValue(NgcUtility.getDateTimeByFormat(temp[1], 'DD-MM-YYYY'));
      this.ttwaformSearch.get('origin').setValue(temp[2]);
      this.ttwaformSearch.get('dateSTA').setValue(temp[3]);
      this.ttwaformSearch.get('inboundFlightSegmentId').setValue(null);
    }

    //

    this.getTTWorkingAdvieData();
  }

  onBulkDelete(i, j) {
    (<NgcFormGroup>this.ttwaform.get(['connectingFlights', i, 'bulkShipments', j])).markAsDeleted();
  }

  onUldDelete(i, k) {
    (<NgcFormGroup>this.ttwaform.get(['connectingFlights', i, 'uldWithShipments', k])).markAsDeleted();
  }

  onUldShipmentDelete(i, k, l) {
    (<NgcFormGroup>this.ttwaform.get(['connectingFlights', i, 'uldWithShipments', k, 'shipments', l])).markAsDeleted();
  }

  onPiggyBackDelete(index) {
    (<NgcFormGroup>this.ttwaform.get(['piggyBackUlds', index])).markAsDeleted();
  }

  markAsDelete() {
    const bulkArray = (<NgcFormGroup>this.ttwaform.get(['connectingFlights', 0, 'bulkShipments'])).getRawValue();
    const uldArray = (<NgcFormGroup>this.ttwaform.get(['connectingFlights', 0, 'uldWithShipments'])).getRawValue();

    for (let i = 0; i < bulkArray.length; i++) {
      if (bulkArray[i].markedAsDeleted) {
        (<NgcFormGroup>this.ttwaform.get(['connectingFlights', 0, 'bulkShipments', i])).markAsDeleted();
      }
    }

    for (let i = 0; i < uldArray.length; i++) {
      if (uldArray[i].markedAsDeleted) {
        (<NgcFormGroup>this.ttwaform.get(['connectingFlights', 0, 'uldWithShipments', i])).markAsDeleted();
      }
      const uldShipArray = uldArray[i].shipments;
      for (let j = 0; j < uldShipArray.length; j++) {
        if (uldShipArray[j].markedAsDeleted) {
          (<NgcFormGroup>this.ttwaform.get(['connectingFlights', 0, 'uldWithShipments', i, 'shipments', j])).markAsDeleted();
        }
      }
    }
  }

  onDisplayDiffrence() {
    this.ttwaform.get('displayDifferenceArray').patchValue(
      (<NgcFormArray>this.ttwaform.get(['connectingFlights', 0, 'displayDifferenceList'])).getRawValue());
    this.displayDifferenceWindow.open();
  }

  onUndoDifference() {

  }

  onDifferenceDelete() {

  }

  onTransitAdvice() {
    const request = this.ttwaformSearch.getRawValue();
    if (request.flightType === 'C') {
      request.adviceDate = null;
    }
    request.url = 'export/through-transit-working-advice';
    this.navigate('export/transhipment/sendThroughTransitAdvicetoApron', request);
  }

  onEnableNextFlight() {
    this.headerFlag = true;
    this.ttwaformSearch.get('dateSTD').reset();
    this.ttwaformSearch.get('outboundFlight').reset();
    this.ttwaformSearch.get('flightPairSequence').reset();
    this.ttwaformSearch.get('outboundFlightDate').reset();
    this.ttwaformSearch.get('outboundFlightSegmentId').reset();
    this.ttwaform.get('selectedInboundFlight').reset();
    this.ttwaform.get('connectingFlights').reset();
    this.showResponseFlag = false;
  }

  onClear() {
    // To remove disabling of search criteria
    this.headerFlag = false;
    // To remove the result on every search
    this.showResponseFlag = false;
    this.ttwaform.reset();
    this.ttwaformSearch.reset();
    this.ttwaform.controls.selectedInboundFlight.setValue([]);
    this.incomingFlights = [];
    this.mode = null;
  }

  deleteFlightPair(item: any) {
    this.showConfirmMessage("export.delete.the.record.confirmation").then(fulfilled => {
      this.exportService.deleteFlightPair(item).subscribe(data => {
        if (data.success) {
          this.showSuccessStatus('g.operation.successful');
          this.onSearch(null);
        }
      })
    });
  }

  onBookSingleShipment() {
    let formData = this.ttwaform.getRawValue();
    let bookShipmentArray = [];
    formData.connectingFlights.forEach(element => {
      element.bulkShipments.forEach(element1 => {
        if (element1.select) {
          bookShipmentArray.push(element1.shipmentNumber);
        }
      });
      element.uldWithShipments.forEach(ele2 => {
        ele2.shipments.forEach(ele3 => {
          if (ele3.select) {
            bookShipmentArray.push(ele3.shipmentNumber);
          }
        });
      });
    });
    if (bookShipmentArray.length > 1 || bookShipmentArray.length < 1) {
      this.showErrorStatus("export.select.shipment.to.navigate.to.book.single.shipment");
      return;
    }
    let navigateObj = {
      flightType: this.ttwaformSearch.get('flightType').value,
      shift: this.ttwaformSearch.get('shift').value,
      adviceDate: this.ttwaformSearch.get('adviceDate').value,
      flightPairSequence: this.ttwaformSearch.get('flightPairSequence').value,
      outboundFlight: this.ttwaformSearch.get('outboundFlight').value,
      outboundFlightDate: this.ttwaformSearch.get('outboundFlightDate').value,
      outboundFlightSegmentId: this.ttwaformSearch.get('outboundFlightSegmentId').value,
      selectedInboundFlight: this.ttwaform.get('selectedInboundFlight').value,
      shipmentNumber: bookShipmentArray[0],
      mode: 'sendTT'
    }
    this.clickedIncomingFlights = this.ttwaform.get('selectedInboundFlight').value
    this.navigateTo(this.router, '/export/booksingleshipment', navigateObj);

  }

  createSourceParameterForFlightSegment() {

    if (this.headerFlag) {
      this.ttwaform.reset();
      this.ttwaform.patchValue(this.ttwaformDefault);
      this.incomingFlightsEmptyDropDown = true;
      this.incomingFlightsDropDown = false;
    }

    this.ttwaformSearch.get('outboundFlightSegmentId').reset();
    let outseg = null;
    if (this.mode === 'sendTT') {
      outseg = this.outboundFlightSegmentId
    }
    this.sourceParameterForSegment = {
      parameter1: this.ttwaformSearch.get('outboundFlight').value,
      parameter2: this.ttwaformSearch.get('outboundFlightDate').value,
      parameter3: outseg
    }
  }

  getIncomingFlightBoardPoint(item) {
    this.incomingFlightBoardPoint = item.desc;
  }

  getOutgoingFlightOffPoint(item) {
    this.incomingFlightOffPoint = item.desc;
  }

  onCancel() {
    this.navigateBack(this.navigateBack);
  }
  onChangeClearForm(flightType) {
    this.ttwaformSearch.reset();
    this.ttwaformSearch.get('flightType').setValue(flightType);
  }
}
