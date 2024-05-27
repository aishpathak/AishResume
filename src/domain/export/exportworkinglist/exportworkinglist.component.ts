
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, NgcButtonComponent, NgcUtility, PageConfiguration, NgcReportComponent, ReportFormat } from 'ngc-framework';
import { Environment } from '../../../environments/environment';
import { TsmmessagepushComponent } from '../../interface/tsmmessagepush/tsmmessagepush.component';

import { ExportService } from './../export.service';
import { WorkingList, ExportFlight, FlightSegment, Flight, MailInformationModel } from './../export.sharedmodel';

@Component({
  selector: 'app-exportworkinglist',
  templateUrl: './exportworkinglist.component.html',
  styleUrls: ['./exportworkinglist.component.scss']
})
@PageConfiguration({
  trackInit: true,
  //callNgOnInitOnClear: true,
  focusToBlank: false,
  focusToMandatory: false
})
export class ExportworkinglistComponent extends NgcPage {

  @ViewChild("Report") Report: NgcReportComponent;
  @ViewChild("ReportWithPrecision") ReportWithPrecision: NgcReportComponent;
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @ViewChild("reportWindow1") reportWindow1: NgcReportComponent;
  @ViewChild('captureSnapshotButton') captureSnapshotButton: NgcButtonComponent;
  @ViewChild('viewSnapshotButton') viewSnapshotButton: NgcButtonComponent;
  @ViewChild('mailManifestPopup') mailManifestPopup: NgcWindowComponent;
  @ViewChild("shipmentNotLoadedPopup") shipmentNotLoadedPopup: NgcWindowComponent;
  @ViewChild('window') window: NgcWindowComponent;

  showAllControls: boolean = false;
  showPromoteButton: boolean = false;
  forwardedData: any;
  bookingByFlight: boolean;
  bookingByInventory: boolean;
  showEtdTimeOnly: boolean = false;
  showStdTimeOnly: boolean = false;
  segmentDropdown: string[];
  resultSegments: any;
  selectedSegment: any;
  retrievedSegmentList: any;
  currentSegment: any;
  displayFlag: boolean;
  versionDate: any;
  versionDropdown: string[];
  response: any;
  promoteCargoFlightListForPcsWgt: any;
  tempPieces: any;
  tempWeight: any;
  bookingChangesValue: any[];
  notReadyTotalPieces: any;
  notReadyTotalWeight: any;
  showManifestedInformation: boolean = false;
  reportParameters: any = new Object();
  sourceIdSegmentDropdown: any;
  sqCarrierGroup: boolean = false;
  nonSqShowFullLocation: boolean = false;
  hasReadPermission: boolean = false;
  showAllControlsForPromote: boolean = false;
  promoteCargoFlag: boolean = true;
  shcPromote: any;
  isactiveByDefault: boolean = false;
  isactiveByUld: boolean = false;
  isactiveByHeight: boolean = false;
  isactiveByAllotment: boolean = false;
  cancelledTabAvailableToShow: boolean = true;

  colorMapping = {
    'SS': {
      textColor: 'white',
      bgColor: 'green'
    },
    'Removed': {
      textColor: 'black',
      bgColor: 'gray'
    },
    'Modified': {
      textColor: 'black',
      bgColor: 'gray'
    },
    'Cancelled': {
      textColor: 'black',
      bgColor: 'gray'
    },
    'SB': {
      textColor: 'black',
      bgColor: 'yellow'
    },
    'UU': {
      textColor: 'white',
      bgColor: 'gray'
    },
    'EM': {
      textColor: 'white',
      bgColor: 'red'
    },
    'XX': {
      textColor: 'white',
      bgColor: 'red'
    },
    'TT': {
      textColor: 'white',
      bgColor: 'gray'
    }
  };
  currentFlight: any;
  dateString: any;
  showAllLocations: boolean = false;
  responseData: any;
  resp: any;
  flagForPreCondition: boolean;
  navigateBackData: any;
  showAllForNonSq: boolean;
  THREEHUNDREDONE: string = '103';
  THREEHUNDREDONEDESC: string = 'Booking pieces/weight not matching Loaded pieces/weight.';
  origin2: any;
  flightBoardingPoint: any;
  flightId: any;
  inputPiece: any;
  wgPerPc: number;
  inputWeight: number;
  bookingWeight: any;
  bookingPieces: any;
  wgtPerPiece: number;
  selectToPromoteCount = 0;



  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private exportService: ExportService
    , private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }


  private exportworkingListForm: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    totalPieces: new NgcFormControl(),
    totalWeight: new NgcFormControl(),
    flightNo: new NgcFormControl(),
    flightDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    flightId: new NgcFormControl(),
    shcs: new NgcFormControl(),
    shcGroupCode: new NgcFormControl(),
    snapshotVersionList: new NgcFormControl(),
    versionNo: new NgcFormControl(),
    promoteCargoFlightList: new NgcFormArray([]),
    promoteCargoInventoryList: new NgcFormArray([]),
    flight: new NgcFormGroup({
      flightNo: new NgcFormControl(),
      fbrDate: new NgcFormControl(),
      fblDate: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      std: new NgcFormControl(),
      etd: new NgcFormControl(),
      aircraftType: new NgcFormControl(),
      aircraftRegistration: new NgcFormControl(),
      totalPiecesBookedInFlight: new NgcFormControl(),
      totalWeightBookedInFlight: new NgcFormControl(),
      firstTimeManifestCompletedAtDisplay: new NgcFormControl(),
      snapShotCapturedBy: new NgcFormControl(),
      segmentList: new NgcFormControl(),
      showAll: new NgcFormControl(),
      showAllForNonSQ: new NgcFormControl(true),
      aliTotal: new NgcFormControl(),
      aliRemain: new NgcFormControl(),
    }),
    segments: new NgcFormArray([
    ]),
    mailInformationList: new NgcFormArray([]),
    airlineLoadingInstructions: new NgcFormArray([]),
    totalShipmentReadyBookingPieces: new NgcFormControl(0),
    totalShipmentReadyBookingWeight: new NgcFormControl(0.0),
    totalShipmentNotReadyBookingWeight: new NgcFormControl(0.0),
    totalShipmentNotReadyBookingPieces: new NgcFormControl(0),
    totalShipmentCancelledPieces: new NgcFormControl(0),
    totalShipmentCancelledWeight: new NgcFormControl(0.0),
    promoteCargoAWBDetails: new NgcFormGroup({
      shipmentNumber: new NgcFormControl(),
      origin: new NgcFormControl(),
      destination: new NgcFormControl(),
      pieces: new NgcFormControl(),
      weight: new NgcFormControl(),
      natureOfGoods: new NgcFormControl(),
      shc: new NgcFormControl(),
      piecestoMove: new NgcFormControl(),
      weightToMove: new NgcFormControl()
    }),
    uldtypeali: new NgcFormArray([
      new NgcFormGroup({
        uldType: new NgcFormControl([]),
        totalUldType: new NgcFormControl([]),
        uldTypeUsed: new NgcFormControl([]),
        remainingUldType: new NgcFormControl([])
      })
    ]),
    heighttypeali: new NgcFormArray([
      new NgcFormGroup({
        heightCode: new NgcFormControl([]),
        totalHeightType: new NgcFormControl([]),
        heightTypeUsed: new NgcFormControl([]),
        remainingHeightType: new NgcFormControl([])
      })
    ]),
    allotmenttypeali: new NgcFormArray([
      new NgcFormGroup({
        allotmentType: new NgcFormControl([]),
        totalAllotment: new NgcFormControl([]),
        usedAllotment: new NgcFormControl([]),
        remainingAllotmentType: new NgcFormControl([])
      })
    ]),
  });



  ngOnInit() {
    this.navigateBackData = this.getNavigateData(this.activatedRoute);
    if (this.navigateBackData) {
      if (this.navigateBackData.flightKey) {
        this.exportworkingListForm.get('flightNo').patchValue(this.navigateBackData.flightKey);
      }
      if (this.navigateBackData.flightNo) {
        this.exportworkingListForm.get('flightNo').patchValue(this.navigateBackData.flightNo);
      }
      if (this.navigateBackData.dateSTD) {
        this.exportworkingListForm.get('flightDate').patchValue(this.navigateBackData.dateSTD);
      }
      if (this.navigateBackData.flightDate) {
        this.exportworkingListForm.get('flightDate').patchValue(this.navigateBackData.flightDate);
      }
      if (this.navigateBackData.flightOriginDate) {
        this.exportworkingListForm.get('flightDate').patchValue(this.navigateBackData.flightOriginDate);
      }
      if (this.navigateBackData.shcGroup) {
        this.exportworkingListForm.get('shcGroupCode').patchValue(this.navigateBackData.shcGroup);
      }

      if (this.navigateBackData.shcGroup) {
        this.exportworkingListForm.get('shcGroupCode').patchValue(this.navigateBackData.shcGroup);
      }

      this.onSearch();
      //this.onSearchAWB();
    }

  }

  onSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('EXPORT_WORKINGLIST');
    let requestData = new Object();
    let flightkey: string = this.exportworkingListForm.get('flightNo').value;
    let flightDate: string = this.exportworkingListForm.get('flightDate').value;
    let collectionCode: string = this.exportworkingListForm.get('shcGroupCode').value;
    requestData = {
      flightNo: flightkey,
      flightDate: flightDate,
      collectionCode: collectionCode
    }
    this.exportService.getExportWorkingListInfo(requestData).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        // NEW 
        // this.flightBoardingPoint = data.data.segments[0].flightBoardingPoint;
        // this.flightId = data.data.segments[0].flightId;
        this.showAllControls = true;
        this.cancelledTabAvailableToShow = data.data.cancelledTabAvailableToShow
        this.resultSegments = data.data.segments;
        this.retrievedSegmentList = data.data.segments;
        this.currentSegment = 'All'
        this.response = data.data;
        this.responseData = data.data;
        this.currentFlight = this.response.flight;
        this.sqCarrierGroup = this.currentFlight.sqCarrier;
        if (this.sqCarrierGroup) {
          this.nonSqShowFullLocation = false;
        } else {
          this.nonSqShowFullLocation = true;
        }
        this.sourceIdSegmentDropdown = this.createSourceParameter(this.currentFlight.flightId);
        this.showAllForNonSq = true;
        this.patchControlsOnForm(data.data);
        this.getSegments();
        this.setEtdStd();
      } else {
        this.showAllControls = false;
      }
    },
      error => {
        this.showErrorMessage(error);
      })
  }
  patchControlsOnForm(data) {

    if (this.currentFlight.firstTimeManifestCompletedAt && this.currentFlight.firstTimeManifestCompletedAt !== (null || '')) {
      this.showManifestedInformation = true;
    } else {
      this.showManifestedInformation = false;
    }
    let totalBookedPiecesforReady = 0;
    let totalBookedWeightForReady = 0;
    let totalPiecesBookedInFlight = 0;
    let totalWeightBookedInFlight = 0;
    let totalBookedPiecesForNotReady = 0;
    let totalBookedWeightForNotReady = 0;
    let totalCancelledPieces = 0;
    let totalCancelledWeight = 0;
    data.segments.forEach(obj => {
      let acceptedPiecesSum = 0;
      let acceptedWeightSum = 0;
      obj.shipmentList.forEach(element => {
        acceptedPiecesSum = acceptedPiecesSum + element.flightPieces;
        acceptedWeightSum = acceptedWeightSum + element.flightWeight;
        element.selectFlag = false;
        if (element.prtshp) {
          element.partShipmentData = "Y";
        } else {
          element.partShipmentData = "N";
        }
        if (this.showAllLocations) {
          element.showAllFlag = true;
        } else {
          element.showAllFlag = false;
        }
        if (this.showManifestedInformation) {
          if (this.sqCarrierGroup) {
            totalBookedPiecesforReady = totalBookedPiecesforReady + element.loadedPartPieces;
            totalBookedWeightForReady = totalBookedWeightForReady + element.loadedPartWeight;
            totalPiecesBookedInFlight = totalPiecesBookedInFlight + element.loadedPartPieces;
            totalWeightBookedInFlight = totalWeightBookedInFlight + element.loadedPartWeight;
          } else {
            totalBookedPiecesforReady = totalBookedPiecesforReady + element.loadedPieces;
            totalBookedWeightForReady = totalBookedWeightForReady + element.loadedWeight;
            totalPiecesBookedInFlight = totalPiecesBookedInFlight + element.loadedPieces;
            totalWeightBookedInFlight = totalWeightBookedInFlight + element.loadedWeight;
          }
        } else {
          if (this.sqCarrierGroup) {
            totalBookedPiecesforReady = totalBookedPiecesforReady + element.partPieces;
            totalBookedWeightForReady = totalBookedWeightForReady + element.partWeight;
            totalPiecesBookedInFlight = totalPiecesBookedInFlight + element.partPieces;
            totalWeightBookedInFlight = totalWeightBookedInFlight + element.partWeight;
          } else {
            totalBookedPiecesforReady = totalBookedPiecesforReady + element.acceptedPieces;
            totalBookedWeightForReady = totalBookedWeightForReady + element.acceptedWeight;
            totalPiecesBookedInFlight = totalPiecesBookedInFlight + element.acceptedPieces;
            totalWeightBookedInFlight = totalWeightBookedInFlight + element.acceptedWeight;
          }
        }
      });
      obj.segInfoForReadyShipments = obj.flightBoardingPoint + ' - ' + obj.flightOffPoint;
      obj.acceptedPiecesSum = acceptedPiecesSum;
      obj.acceptedWeightSum = acceptedWeightSum;
      obj.notReadyShipments.forEach(element => {
        if (element.discrepancyDetails && element.discrepancyDetails.length) {
          element.discrepancy = true;
        }
        element.selectFlag = false;
        if (element.prtshp) {
          element.partShipmentData = "Y"
        } else {
          element.partShipmentData = "N"
        }
        if (this.sqCarrierGroup) {
          totalBookedPiecesForNotReady = totalBookedPiecesForNotReady + element.partPieces;
          totalBookedWeightForNotReady = totalBookedWeightForNotReady + element.partWeight;
          totalPiecesBookedInFlight = totalPiecesBookedInFlight + element.partPieces;
          totalWeightBookedInFlight = totalWeightBookedInFlight + element.partWeight;
        } else {
          totalBookedPiecesForNotReady = totalBookedPiecesForNotReady + element.pieces;
          totalBookedWeightForNotReady = totalBookedWeightForNotReady + element.weight;
          totalPiecesBookedInFlight = totalPiecesBookedInFlight + element.pieces;
          totalWeightBookedInFlight = totalWeightBookedInFlight + element.weight;
        }

      });
      obj.segInfoForNotReadyShipments = obj.flightBoardingPoint + ' - ' + obj.flightOffPoint;
      obj.cancelledShipments.forEach(element => {
        element.incomingFlightInfo = '';
        element.selectFlag = false;
        totalCancelledPieces = totalCancelledPieces + element.flightPieces;
        totalCancelledWeight = totalCancelledWeight + element.flightWeight;

      })
      obj.segInfoForCancelledShipments = obj.flightBoardingPoint + ' - ' + obj.flightOffPoint;
    });

    //Set the ALI
    this.exportworkingListForm.get('flight.aliRemain').patchValue(data.aliRemain);
    this.exportworkingListForm.get('flight.aliTotal').patchValue(data.aliTotal);
    if (data.aliUldHeightAllot != null) {
      this.isactiveByUld = data.aliUldHeightAllot.activeByULD;
      this.isactiveByDefault = data.aliUldHeightAllot.activeByDefault;
      this.isactiveByHeight = data.aliUldHeightAllot.activeByHeight;
      this.isactiveByAllotment = data.aliUldHeightAllot.activeByAllotment;
      this.exportworkingListForm.get('uldtypeali').patchValue(data.aliUldHeightAllot.uldTypeALI);
      this.exportworkingListForm.get('heighttypeali').patchValue(data.aliUldHeightAllot.heightTypeALI);
      this.exportworkingListForm.get('allotmenttypeali').patchValue(data.aliUldHeightAllot.allotmentTypeALI);
      console.log(this.exportworkingListForm.get('allotmenttypeali').value);
    } else {
      this.isactiveByDefault = true;
    }

    //Set the totals
    this.exportworkingListForm.get('flight.totalPiecesBookedInFlight').patchValue(totalPiecesBookedInFlight);
    this.exportworkingListForm.get('flight.totalWeightBookedInFlight').patchValue(totalWeightBookedInFlight);
    this.exportworkingListForm.get('totalShipmentReadyBookingPieces').patchValue(totalBookedPiecesforReady);
    this.exportworkingListForm.get('totalShipmentReadyBookingWeight').patchValue(totalBookedWeightForReady);
    this.exportworkingListForm.get('totalShipmentNotReadyBookingPieces').patchValue(totalBookedPiecesForNotReady);
    this.exportworkingListForm.get('totalShipmentNotReadyBookingWeight').patchValue(totalBookedWeightForNotReady);
    this.exportworkingListForm.get('totalShipmentCancelledPieces').patchValue(totalCancelledPieces);
    this.exportworkingListForm.get('totalShipmentCancelledWeight').patchValue(totalCancelledWeight);
    this.exportworkingListForm.patchValue(data);

  }

  getCurrentSegmentAndVersion() {
    this.selectedSegment = this.exportworkingListForm.get('flight.segmentList').value;
    const boardingPoint = this.selectedSegment.substring(0, 3);
    const offPoint = this.selectedSegment.substring(4);
    for (let entry of this.retrievedSegmentList) {
      if (entry.flightBoardingPoint === boardingPoint && entry.flightOffPoint === offPoint) {
        this.currentSegment = entry;
      }
    }
    if (this.currentSegment == 'All') {
      this.versionCalCulation(this.retrievedSegmentList[0]);
    } else {
      this.versionCalCulation(this.currentSegment);
    }
  }

  setEtdStd(): any {
    let dateData = NgcUtility.getDateOnly(this.exportworkingListForm.get('flightDate').value);
    if (this.exportworkingListForm.get('flight.etd').value !== null) {
      let dateDataEtd = NgcUtility.getDateOnly(this.exportworkingListForm.get('flight.etd').value);


      if (dateDataEtd.toDateString() === dateData.toDateString()) {
        this.showEtdTimeOnly = false;
      } else {
        this.showEtdTimeOnly = true;
      }
    }
    if (this.exportworkingListForm.get('flight.std').value !== null) {
      let dateDateStd = NgcUtility.getDateOnly(this.exportworkingListForm.get('flight.std').value);
      if (dateDateStd.toDateString() === dateData.toDateString()) {
        this.showStdTimeOnly = false;
      } else {
        this.showStdTimeOnly = true;
      }
    }
  }

  public getSegments() {
    this.segmentDropdown = new Array<string>();
    if (this.resultSegments.length > 1) {
      this.segmentDropdown.push('All'); // this is added as part of 5878 bug
    }
    for (let index = 0; index < this.resultSegments.length; index++) {
      this.segmentDropdown.push(this.resultSegments[index].flightBoardingPoint + '-' + this.resultSegments[index].flightOffPoint);
    }
    this.exportworkingListForm.get('flight.segmentList').setValue(this.segmentDropdown[0]);
    this.getCurrentSegmentAndVersion();

  }

  public onSelect() {
    this.selectedSegment = this.exportworkingListForm.get('flight.segmentList').value;
    if (this.selectedSegment !== 'All') {
      const boardingPoint = this.selectedSegment.substring(0, 3);
      const offPoint = this.selectedSegment.substring(4);
      for (let entry of this.retrievedSegmentList) {
        if (entry.flightBoardingPoint === boardingPoint && entry.flightOffPoint === offPoint) {
          this.currentSegment = entry;
        }
      }
      this.patchSegmentData(this.selectedSegment, this.currentSegment);
      this.getCurrentSegmentAndVersion();
    } else {
      this.patchSegmentData(this.selectedSegment, this.retrievedSegmentList);
    }
  }

  patchSegmentData(segType, segmentData) {
    let data: any
    let segArray = [];
    if (segType !== 'All') {
      segArray.push(segmentData);
      data = {
        segments: segArray
      };
    } else {
      data = {
        segments: segmentData
      };
    }

    this.patchControlsOnForm(data);
  }

  routeShipmentInfo(shipmentNumber, shipmentType) {
    const routeData = {
      shipmentNumber: shipmentNumber,
      flightNo: this.exportworkingListForm.get('flightNo').value,
      flightDate: this.exportworkingListForm.get('flightDate').value,
      shipmentType: shipmentType
    };
    this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', routeData);
  }

  versionCalCulation(displaySegment: any) {

    if (displaySegment !== 'All') {
      this.displayFlag = true;
      if (displaySegment.modifiedOn === null)
        this.versionDate = displaySegment.createdOn;
      else
        this.versionDate = displaySegment.modifiedOn;
      if (displaySegment.snapShotVersion === 1) {
        (<NgcFormControl>this.exportworkingListForm.controls['versionNo']).patchValue(displaySegment.snapShotVersion);
        this.versionDropdown = new Array<string>();
      }
      else {
        if (displaySegment.snapShotVersion == 0) {
          displaySegment.snapShotVersion = 1;
        }
        let snapVersion = displaySegment.snapShotVersion;
        snapVersion--;
        (<NgcFormControl>this.exportworkingListForm.controls['versionNo']).patchValue(displaySegment.snapShotVersion);
        this.versionDropdown = new Array<string>();
        for (let i = 1; i <= snapVersion; i++)
          this.versionDropdown.push("" + i);
      }
      let sno = 1;
      //(<NgcFormControl>this.exportworkingListForm.controls['versionDate']).patchValue(this.versionDate);
      for (let entry of displaySegment.notReadyShipments) {
        entry.selectFlag = false;
        entry.sno = sno++;
      }
      // this.exportworkingListForm.get('totalShipmentNotReadyBookingPieces').patchValue(displaySegment.totalNotReadyBookingPieces);
      // this.exportworkingListForm.get('totalShipmentNotReadyBookingWeight').patchValue(displaySegment.totalNotReadyBookingWeight);
      // (<NgcFormArray>this.exportworkingListForm.controls['bookingChangesList']).patchValue(displaySegment.bookingChanges);
    }
    else {
      //this.setBookingChangesData();
    }
  }

  public laodingShipment(segment: any) {
    if (segment !== 'All') {
      this.exportworkingListForm.get('totalShipmentReadyBookingPieces').patchValue(segment.totalReadyBookingPieces);
      this.exportworkingListForm.get('totalShipmentReadyBookingWeight').patchValue(segment.totalReadyBookingWeight);
      //this.addSerialNumberToShipmentReadyData(segment);

      (<NgcFormArray>this.exportworkingListForm.controls['shimentLoadingList']).patchValue(segment.shipmentList);
    }
    else {
      this.setValuesForAllSegment();
    }
  }

  setValuesForAllSegment() {
    let consolidatedReadyShipmentList = new Array();
    this.response.segments.forEach(segment => {
      segment.shipmentList.forEach(shipment => {
        consolidatedReadyShipmentList.push(shipment);
      });
    });
    (this.exportworkingListForm.controls['shimentLoadingList']).patchValue(consolidatedReadyShipmentList);
    this.exportworkingListForm.get('totalShipmentReadyBookingPieces').patchValue(this.tempPieces);
    this.exportworkingListForm.get('totalShipmentReadyBookingWeight').patchValue(this.tempWeight);
  }

  setBookingChangesData() {
    this.bookingChangesValue = [];
    let sno = 1;

    this.response.segments.forEach(segment => {
      segment.bookingChanges.forEach(bookingDetails => {

        bookingDetails['selectFlag'] = 'false';
        bookingDetails.partShipment === true ? bookingDetails['partShipmentData'] = 'Y' : bookingDetails['partShipmentData'] = 'N';
        bookingDetails['sno'] = sno++;
        this.bookingChangesValue.push(bookingDetails);
      });
    });
    this.displayFlag = true;
    (<NgcFormArray>this.exportworkingListForm.controls['bookingChangesList']).patchValue(this.bookingChangesValue);
    this.exportworkingListForm.get('totalShipmentNotReadyBookingPieces').patchValue(this.notReadyTotalPieces);
    this.exportworkingListForm.get('totalShipmentNotReadyBookingWeight').patchValue(this.notReadyTotalWeight);
  }



  routeFWBScreen(data) {
    const routeData = {
      shipmentNumber: data,
      flightNo: this.exportworkingListForm.get('flightNo').value,
      flightDate: this.exportworkingListForm.get('flightDate').value,
      awbNumber: data
    };

    this.navigateTo(this.router, 'import/maintainfwb', routeData);
    //this.navigateTo(this.router, 'awbmgmt/shipmentinfo', routeData);
  }

  public captureSnapshot() {
    let createSnapshotSegment: any;
    const selectedSegment = this.exportworkingListForm.get('flight.segmentList').value + '';
    const boardingPoint = selectedSegment.substr(0, 3);
    if (boardingPoint !== 'All') {
      const offPoint = selectedSegment.substring(4);
      for (let entry of this.retrievedSegmentList) {
        if (entry.flightBoardingPoint === boardingPoint && entry.flightOffPoint === offPoint) {
          createSnapshotSegment = entry;
        }
      }
      this.captureSnapshotButton.disabled = true;
      let snpShtVrsn = this.exportworkingListForm.get('versionNo').value;
      if (!snpShtVrsn) {
        snpShtVrsn = 0;
      }
      createSnapshotSegment.snapShotVersion = snpShtVrsn;
      createSnapshotSegment.showAll = this.exportworkingListForm.get('flight.showAll').value;
      createSnapshotSegment.showAllForNonSQ = this.exportworkingListForm.get('flight.showAllForNonSQ').value;
      this.exportService.createSnapshotNew(createSnapshotSegment).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.captureSnapshotButton.disabled = false;
          this.onSearch();
        } else {
          this.captureSnapshotButton.disabled = false;
        }
      },
        error => {
          this.showErrorStatus('Error:' + error);
          this.captureSnapshotButton.disabled = false;
        });
    } else {
      this.showErrorMessage('export.select.segment.to.create.snapshot');
    }
  }


  public viewSnapshot() {
    let viewSnapshotSegment: FlightSegment = new FlightSegment();
    let selectedSegment = this.exportworkingListForm.get('flight.segmentList').value + '';
    const boardingPoint = selectedSegment.substring(0, 3);
    const offPoint = selectedSegment.substring(4);
    for (let entry of this.retrievedSegmentList) {
      if (entry.flightBoardingPoint === boardingPoint && entry.flightOffPoint === offPoint) {
        viewSnapshotSegment = entry;
      }
    }
    const stringVersionNo = this.exportworkingListForm.get('snapshotVersionList').value;
    const intVersionNo = +stringVersionNo;
    viewSnapshotSegment.snapShotVersion = intVersionNo;
    const sendSnapshotSegment: FlightSegment = new FlightSegment();
    sendSnapshotSegment.flightId = viewSnapshotSegment.flightId;
    sendSnapshotSegment.snapShotVersion = viewSnapshotSegment.snapShotVersion;
    sendSnapshotSegment.flightBoardingPoint = viewSnapshotSegment.flightBoardingPoint;
    sendSnapshotSegment.flightOffPoint = viewSnapshotSegment.flightOffPoint;
    sendSnapshotSegment.segmentId = viewSnapshotSegment.segmentId;
    this.viewSnapshotButton.disabled = true;
    this.exportService.getSnapshot(sendSnapshotSegment).subscribe(data => {
      this.refreshFormMessages(data);
      this.viewSnapshotButton.disabled = false;
      if (!this.showResponseErrorMessages(data)) {
        if (data !== null) {
          data.data.mode = 'expwrknglstnew'
          this.navigateTo(this.router, 'export/snapshotworkinglist', data.data);
        }
      } else {
        this.showResponseErrorMessages(data);
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
        this.viewSnapshotButton.disabled = false;
      });
  }

  public routeToAli() {
    let navigateObj = {
      flightKey: this.exportworkingListForm.get("flightNo").value,
      flightOriginDate: new Date(this.exportworkingListForm.get("flightDate").value)
    }
    this.navigateTo(this.router, '/export/buildup/airlineloadinginstructions', navigateObj);
  }

  routeToBookSingle() {
    let selectedSegments = this.exportworkingListForm.getRawValue().segments;
    let shipmentsToBeRouted = new Array();
    selectedSegments.forEach(element => {
      element.shipmentList.forEach(rdyEle => {
        if (rdyEle.selectFlag) {
          shipmentsToBeRouted.push(rdyEle);
        }
      });
      element.notReadyShipments.forEach(ntRdyEle => {
        if (ntRdyEle.selectFlag) {
          shipmentsToBeRouted.push(ntRdyEle);
        }
      });
      element.cancelledShipments.forEach(cncldEle => {
        if (cncldEle.selectFlag) {
          shipmentsToBeRouted.push(cncldEle);
        }
      });
    });
    if (shipmentsToBeRouted.length > 1 || shipmentsToBeRouted.length < 1) {
      this.showErrorMessage("export.select.one.shipment");
      return;
    } else {
      let navigateObj = {
        shipmentNumber: shipmentsToBeRouted[0].shipmentNumber,
        flightNo: this.exportworkingListForm.get('flightNo').value,
        flightDate: this.exportworkingListForm.get('flightDate').value
      }
      this.navigateTo(this.router, '/export/booksingleshipment', navigateObj);
    }
  }

  public cancelShipment() {
    // Route to book mulyiple shipment
    let navigateObj = {
      flightKey: this.exportworkingListForm.get("flightNo").value,
      flightDate: new Date(this.exportworkingListForm.get("flightDate").value),
      screenName: 'workinglist'
    }
    this.navigateTo(this.router, '/export/bookmultipleshipment', navigateObj);
  }

  routeToAssignUld() {
    let navigateObj = {
      flightKey: this.exportworkingListForm.get("flightNo").value,
      flightOriginDate: new Date(this.exportworkingListForm.get("flightDate").value)
    }
    this.navigateTo(this.router, '/export/buildup/assign-uld-flight', navigateObj);
  }

  routeToLoadShipment() {
    let segList = this.exportworkingListForm.get('flight.segmentList').value;
    let segId = null;
    if (segList === 'All') {
      segId = this.resultSegments[0].segmentId
    } else {
      segId = this.currentSegment.segmentId;
    }
    let navigateObj = {
      flightKey: this.exportworkingListForm.get("flightNo").value,
      flightOriginDate: new Date(this.exportworkingListForm.get("flightDate").value),
      segmentId: segId
    }
    this.navigateTo(this.router, '/export/buildup/revisedloadshipment', navigateObj);
  }

  routeToUnloadShipment() {
    let navigateObj = {
      flightKey: this.exportworkingListForm.get("flightNo").value,
      flightOriginDate: new Date(this.exportworkingListForm.get("flightDate").value)
    }
    this.navigateTo(this.router, '/export/buildup/unloadshipmentDesktop', navigateObj);
  }

  routeToOutbound() {
    let navigateObj = {
      flightKey: this.exportworkingListForm.get("flightNo").value,
      flightOriginDate: new Date(this.exportworkingListForm.get("flightDate").value),
      dateString: this.dateString
    }
    this.navigateTo(this.router, '/export/outboundlyinglist', navigateObj);
  }

  routeToCargoManifest() {
    let transferData: any = {
      'flightKey': this.exportworkingListForm.get('flightNo').value,
      'flightOriginDate': this.exportworkingListForm.get('flightDate').value
    };
    this.navigateTo(this.router, '/export/buildup/cargomanifest', transferData);
  }

  routeToUpdateDLS() {
    let transferData: any = {
      'flightKey': this.exportworkingListForm.get('flightNo').value,
      'flightOriginDate': this.exportworkingListForm.get('flightDate').value
    };
    this.navigateTo(this.router, '/export/buildup/update-dls', transferData);
  }

  mailManifest() {
    (<NgcFormArray>this.exportworkingListForm.get("mailInformationList")).patchValue(new Array());
    (<NgcFormArray>this.exportworkingListForm.get("mailInformationList")).patchValue(this.currentFlight.mailInformation);
    this.mailManifestPopup.open();
  }

  cancelRebookShipments() {
    let navigateObj = {
      flightKey: this.exportworkingListForm.get("flightNo").value,
      flightDate: new Date(this.exportworkingListForm.get("flightDate").value),
      segment: this.response.segments[0].flightOffPoint,
      screenName: 'workinglist'
    }
    this.navigateTo(this.router, '/export/cancelbookedshipment', navigateObj);
  }

  routeToMaintainFWB() {
    let selectedSegments = this.exportworkingListForm.getRawValue().segments;
    let shipmentsToBeRouted = new Array();
    selectedSegments.forEach(element => {
      element.shipmentList.forEach(rdyEle => {
        if (rdyEle.selectFlag) {
          shipmentsToBeRouted.push(rdyEle);
        }
      });
      element.notReadyShipments.forEach(ntRdyEle => {
        if (ntRdyEle.selectFlag) {
          shipmentsToBeRouted.push(ntRdyEle);
        }
      });
      element.cancelledShipments.forEach(cncldEle => {
        if (cncldEle.selectFlag) {
          shipmentsToBeRouted.push(cncldEle);
        }
      });
    });
    if (shipmentsToBeRouted.length > 1 || shipmentsToBeRouted.length < 1) {
      this.showErrorMessage("export.select.one.shipment");
      return;
    } else {
      this.routeFWBScreen(shipmentsToBeRouted[0].shipmentNumber)
      // let navigateObj = {
      //   shipmentNumber: shipmentsToBeRouted[0].shipmentNumber
      // }
    }
  }

  deleteData(event) {
    (this.exportworkingListForm.get(["mailInformationList", event]) as NgcFormGroup).markAsDeleted();
  }

  saveMailManifestInformation() {
    let request: any;
    request = (<NgcFormArray>this.exportworkingListForm.get("mailInformationList")).getRawValue();
    request.forEach(element => {
      element['flightId'] = this.currentFlight.flightId;
    });

    this.exportService.updateMailInformation(request).subscribe(data => {
      this.refreshFormMessages(data);
      let response = data;
      if (response.success) {
        this.showSuccessStatus('g.completed.successfully');
        this.mailManifestPopup.close();
        this.onSearch();
      }
    });
  }

  addMailManifestInformation() {
    (<NgcFormArray>this.exportworkingListForm.get("mailInformationList")).addValue([
      {
        mailType: null,
        flightSegmentId: null,
        piece: 0,
        weight: 0,
        uldNumber: ''
      }
    ]);
  }

  showAll() {
    this.nonSqShowFullLocation = false;
    if (this.sqCarrierGroup) {
      this.showAllLocations = this.exportworkingListForm.get('flight.showAll').value;
    } else {
      this.showAllLocations = this.exportworkingListForm.get('flight.showAllForNonSQ').value;
    }
    this.showAllForNonSq = false;
    this.response.flight.showAll = this.showAllLocations;
    this.patchControlsOnForm(this.response);

  }

  createManifest() {
    // check ulds not exists in DLS but present in manifest then give prompt
    if (this.currentFlight.uldNotInDlsFlag) {
      this.showConfirmMessage(NgcUtility.translateMessage("confirmation.want.to.create.manifest", [this.currentFlight.uldsNosNotInDLS])).then(fulfilled => {
        this.checkForManifestPreConditions();

      }
      ).catch(reason => {
        return;
      });
    } else {
      this.checkForManifestPreConditions();
    }

  }

  checkForManifestPreConditions(): void {

    const exportFlight: ExportFlight = new ExportFlight();
    // fetchWorkingList.flight = exportFlight;
    exportFlight.flightNo = this.exportworkingListForm.get('flightNo').value;
    exportFlight.flightDate = this.exportworkingListForm.get('flightDate').value;

    /*     this.exportService.getWorkingList(exportFlight).subscribe(data => {
          this.refreshFormMessages(data);
          if (!this.showResponseErrorMessages(data)) {
            if (data.data) {
              this.resp = data.data; */

    let readyErrorflag = true;
    this.flagForPreCondition = false;
    let flagForWarningToUserForNoReadyShipments: boolean = false;
    let flagForSegmentWiseShipmenReady: boolean = false;
    let flagForReadyForBookingShipmentInNotReadyState = false;
    this.responseData.segments.forEach(segmentData => {
      if (segmentData.shipmentList.length > 0) {
        flagForSegmentWiseShipmenReady = true;
      }
      if (segmentData.shipmentList.length === 0) {
        flagForWarningToUserForNoReadyShipments = true;
      }

      const bookingData = segmentData.notReadyShipments.filter(booking => booking.statusCode === 'SS');
      if (bookingData.length > 0) {
        flagForReadyForBookingShipmentInNotReadyState = true;
      }
    });

    if (flagForReadyForBookingShipmentInNotReadyState) {
      this.showErrorMessage('export.not.ready.booking.exists');
    } else {

      if (flagForWarningToUserForNoReadyShipments && !flagForSegmentWiseShipmenReady) {
        this.showConfirmMessage("export.no.shipments.in.ready.state.confirmation").then(fulfilled => {
          readyErrorflag = false;
          this.createManifestFromWorkingList();
        }).catch(reason => {
          this.flagForPreCondition = false;
          this.onSearch();
        });
      } else {
        this.checkNotReady();
      }
    }
  }

  checkNotReady() {
    let flagForShipmentWithNoLoadedData: boolean = false;
    this.responseData.segments.forEach(segmentData => {
      if (segmentData.shipmentList.length > 0) {
        segmentData.shipmentList.forEach(shipment => {
          if (shipment.shipmentNumber !== 'NIL' && shipment.uldList.length === 0) {
            flagForShipmentWithNoLoadedData = true;
          }
        });
      }
    });

    if (flagForShipmentWithNoLoadedData) {
      this.shipmentNotLoadedPopup.open();
    } else {
      this.createManifestFromWorkingList();
    }
  }

  createManifestFromWorkingList() {
    const manifestFlight = new Flight();
    manifestFlight.flightKey = this.exportworkingListForm.get('flightNo').value;
    manifestFlight.flightOriginDate = this.exportworkingListForm.get('flightDate').value;
    if (this.exportworkingListForm.get('flight').value.aircraftRegistration) {
      manifestFlight.aircraftRegistration = this.exportworkingListForm.get('flight').value.aircraftRegistration;
    }
    this.exportService.checkNilAndCreateManifest(manifestFlight).subscribe(data => {
      if (data.data && data.data.nilCargo) {
        this.showConfirmMessage('export.flight.nil.cargo.proceed.with.manifest.confirmation').then(fulfilled => {
          this.exportService.createManifest(data.data).subscribe(data => {
            this.refreshFormMessages(data);

            if (data.messageList == null) {
              this.showSuccessStatus("g.completed.successfully");
              this.onSearch();
            }
          }, error => {
            this.showErrorStatus(error);
          });
        }
        ).catch(reason => {
        });
      }
      if (data.data && data.data.warnigAndErrorMessage) {
        this.showConfirmMessage(data.data.warnigAndErrorMessage).then(fulfilled => {
          manifestFlight.skipCpeCheck = true;
          this.exportService.checkNilAndCreateManifest(manifestFlight).subscribe(data => {
            if (data.data && data.data.nilCargo) {
              this.showConfirmMessage('export.flight.nil.cargo.proceed.with.manifest.confirmation').then(fulfilled => {
                this.exportService.createManifest(data.data).subscribe(data => {
                  this.refreshFormMessages(data);
                  if (data.messageList == null) {
                    this.showSuccessStatus("g.completed.successfully");
                    this.onSearch();
                  }
                }, error => {
                  this.showErrorStatus(error);
                });
              }
              ).catch(reason => {
              });
            }
            this.refreshFormMessages(data);
            if (data.messageList == null) {
              this.showSuccessStatus("g.completed.successfully");
              this.onSearch();
            }
          });

        }, error => {
          if (error) {
            this.showErrorStatus(error);
          }
        }).catch(reason => {
        });
      }
      this.refreshFormMessages(data);
      if (data.success && data.messageList == null) {
        this.showSuccessStatus("g.completed.successfully");
        this.onSearch();
      }
    }, error => {
      if (error) {
        this.showErrorStatus(error);
      }

    });
  }
  promoteCargoWindow() {
    this.exportworkingListForm.get('shipmentNumber').reset();
    this.exportworkingListForm.get('promoteCargoAWBDetails').reset();
    this.exportworkingListForm.get('promoteCargoFlightList').reset();
    this.showAllControlsForPromote = false;
    this.window.open();
  }
  onSearchAWB() {
    this.showPromoteButton = false;
    this.promoteCargoFlag = true;
    let request = new Object();
    request = {
      shipmentNumber: this.exportworkingListForm.get('shipmentNumber').value
    }
    this.exportworkingListForm.get('promoteCargoFlightList').reset();
    this.exportworkingListForm.get('promoteCargoInventoryList').reset();
    this.exportService.promoteCargoSearch(request).subscribe(data => {
      if (data.data) {
        this.resetFormMessages();
        this.showAllControlsForPromote = true;
        this.response = data.data;
        this.promoteCargoFlightListForPcsWgt = data.data.promoteCargoFlightList
        this.exportworkingListForm.get('promoteCargoAWBDetails.pieces').patchValue(this.response.totalPieces);
        this.exportworkingListForm.get('promoteCargoAWBDetails.weight').patchValue(this.response.totalWeight);
        this.exportworkingListForm.get('promoteCargoAWBDetails.shc').patchValue(this.response.shcs);
        this.exportworkingListForm.get('promoteCargoAWBDetails.origin').patchValue(this.response.origin);
        this.exportworkingListForm.get('promoteCargoAWBDetails.destination').patchValue(this.response.destination);
        this.exportworkingListForm.get('promoteCargoAWBDetails.natureOfGoods').patchValue(this.response.natureOfGoods);
        if (this.response.promoteCargoFlightList) {
          this.response.promoteCargoFlightList.forEach(element => {
            if (element.stdTime) {
              element.stdTime = element.stdTime.substring(0, 5);
            }
            element.bookingPieces = null;
            element.bookingWeight = null;
            // if (element.flightDate) {
            //   element.flightDate = element.flightDate.substring(0, 10);
            // }
            element.totalLoadedPieces = 0;
            element.totalLoadedWeight = 0;
            element.loadedInfo.forEach(element1 => {
              if (element.shcs) {
                this.shcPromote = this.shcPromote + element.shcs;
              }
              element.totalLoadedPieces = element.totalLoadedPieces + element1.loadedPieces;
              element.totalLoadedWeight = element.totalLoadedWeight + element1.loadedWeight;
              if (!element.allAssignedUldTrolleyNumber) {
                element.allAssignedUldTrolleyNumber = element1.assignedUldTrolleyNumber;
              } else {
                element.allAssignedUldTrolleyNumber = element.allAssignedUldTrolleyNumber + ' ' + element1.assignedUldTrolleyNumber;
              }
            });
          });
        }

        this.exportworkingListForm.controls.promoteCargoFlightList.patchValue(data.data.promoteCargoFlightList);
        // (<NgcFormControl>this.promoteCargoForm.controls['promoteCargoFlightList']).patchValue(this.promoteCargo.promoteCargoFlightList);

      } else {
        this.exportService.promoteCargoSearchAWB(request).subscribe(data => {
          if (data.data) {
            this.resetFormMessages();
            this.showAllControlsForPromote = true;
            this.response = data.data;
            this.promoteCargoFlightListForPcsWgt = data.data.promoteCargoFlightList
            this.exportworkingListForm.get('promoteCargoAWBDetails.pieces').patchValue(this.response.totalPieces);
            this.exportworkingListForm.get('promoteCargoAWBDetails.weight').patchValue(this.response.totalWeight);
            this.exportworkingListForm.get('promoteCargoAWBDetails.shc').patchValue(this.response.shcs);
            this.exportworkingListForm.get('promoteCargoAWBDetails.origin').patchValue(this.response.origin);
            this.exportworkingListForm.get('promoteCargoAWBDetails.destination').patchValue(this.response.destination);
            this.exportworkingListForm.get('promoteCargoAWBDetails.natureOfGoods').patchValue(this.response.natureOfGoods);
          } else {
            //this.refreshFormMessages(data);
            this.showErrorStatus('Invalid AWB');
            this.showAllControlsForPromote = false;
          }
        })

      }

    })
  }
  onNavigateToPromote() {
    let allSegments = this.exportworkingListForm.get('flight.segmentList').value;
    if (allSegments === "All") {
      this.showErrorStatus('export.select.specific.segment');
      return;
    }
    this.showConfirmMessage('export.promote.shipment.confirmation').then(fulfilled => {
      let reqObj = new Object();
      reqObj = {
        flightKey: this.currentFlight.flightNo,
        dateSTD: this.currentFlight.std,
        flightId: this.currentFlight.flightId,
        segmentId: this.currentSegment.segmentId,
        flightOffPoint: this.currentSegment.flightOffPoint,
        flightBoardPoint: this.currentSegment.flightBoardingPoint
      }
      this.navigateTo(this.router, 'export/promotecargo', reqObj);
    });
  }

  onNavigateToNotoc() {
    let reqObj = new Object();
    reqObj = {
      flightKey: this.exportworkingListForm.get('flightNo').value,
      flightOriginDate: this.exportworkingListForm.get('flightDate').value
    }
    this.navigateTo(this.router, 'export/notoc/revisednotoc', reqObj);
  }

  onNavigateToHoldShipment() {
    let selectedSegments = this.exportworkingListForm.getRawValue().segments;
    let shipmentsToBeRouted = new Array();
    selectedSegments.forEach(element => {
      element.shipmentList.forEach(rdyEle => {
        if (rdyEle.selectFlag) {
          shipmentsToBeRouted.push(rdyEle);
        }
      });
      element.notReadyShipments.forEach(ntRdyEle => {
        if (ntRdyEle.selectFlag) {
          shipmentsToBeRouted.push(ntRdyEle);
        }
      });
      element.cancelledShipments.forEach(cncldEle => {
        if (cncldEle.selectFlag) {
          shipmentsToBeRouted.push(cncldEle);
        }
      });
    });
    if (shipmentsToBeRouted.length > 1 || shipmentsToBeRouted.length < 1) {
      this.showErrorMessage("export.select.one.shipment");
      return;
    } else {
      let navigateObj = {
        shipmentNumber: shipmentsToBeRouted[0].shipmentNumber,
        flightNo: this.exportworkingListForm.get('flightNo').value,
        flightDate: this.exportworkingListForm.get('flightDate').value
      }
      this.navigateTo(this.router, '/awbmgmt/shipmentonhold', navigateObj);
    }
  }

  methodToCalculateRemainingPcsWt(value, index) {
    this.bookingWeight = this.exportworkingListForm.controls.promoteCargoFlightList['controls'][index].controls.existingBookingWeight.value;
    this.bookingPieces = this.exportworkingListForm.controls.promoteCargoFlightList['controls'][index].controls.existingBookingPieces.value;
    this.wgtPerPiece = this.bookingWeight / this.bookingPieces;
    value = this.wgtPerPiece * value;
    if (this.bookingPieces = null) {
      this.exportworkingListForm.controls.promoteCargoFlightList['controls'][index].controls.bookingWeight.setValue(null);
    } else {
      this.exportworkingListForm.controls.promoteCargoFlightList['controls'][index].controls.bookingWeight.setValue(value);
    }
    // this.promoteCargoFlightListForPcsWgt.forEach(element => {
    //   this.inputPiece = value;
    //   this.wgPerPc = element.bookingWeight / element.bookingPieces;
    //   this.inputWeight = value * this.wgPerPc;
    // });
  }


  onPrint() {
    let requestData = this.exportworkingListForm.getRawValue();
    this.exportService.createSnapshotReport(requestData).subscribe(data => {
      if (data.success) {
        this.reportParameters.tenantId = NgcUtility.getTenantConfiguration().airportCode;
        this.reportParameters.flightKey = this.exportworkingListForm.get('flightNo').value;
        this.reportParameters.flightDate = this.exportworkingListForm.get('flightDate').value;
        this.reportParameters.loggedinID = this.getUserProfile().userLoginCode;
        if (this.showAllLocations) {
          this.reportParameters.flagToShow = "1";
        }
        else {
          this.reportParameters.flagToShow = "0";
        }
        if (this.sqCarrierGroup) {
          this.reportParameters.sqcarrierflag = "1";
        }
        else {
          this.reportParameters.sqcarrierflag = "0";
        }

        this.reportWindow.open();
      }
    });

  }

  onPrintUld() {
    let requestData = this.exportworkingListForm.getRawValue();
    this.exportService.createSnapshotReport(requestData).subscribe(data => {
      if (data.success) {
        this.reportParameters.tenantId = NgcUtility.getTenantConfiguration().airportCode;
        this.reportParameters.flightKey = this.exportworkingListForm.get('flightNo').value;
        this.reportParameters.flightDate = this.exportworkingListForm.get('flightDate').value;
        this.reportParameters.loggedinID = this.getUserProfile().userLoginCode;
        let nonSqShowAll = this.exportworkingListForm.get('flight.showAllForNonSQ').value;
        if (this.sqCarrierGroup && this.showAllLocations) {
          this.reportParameters.sqcarrierflag = "1";
          this.reportParameters.flagToShow = "1";
        } else if (this.sqCarrierGroup && !this.showAllLocations) {
          this.reportParameters.sqcarrierflag = "1";
          this.reportParameters.flagToShow = "0";
        } else if (!this.sqCarrierGroup && nonSqShowAll) {
          this.reportParameters.flagToShow = "1";

          this.reportParameters.sqcarrierflag = "0";

        } else if (!this.sqCarrierGroup && !nonSqShowAll) {
          this.reportParameters.flagToShow = "0";
          this.reportParameters.sqcarrierflag = "0";
        } else {

        }
        this.reportWindow1.open();
      }
    });


  }



  public getShapeColor(code, attribute) {
    const codeColorData = this.colorMapping[code];
    return codeColorData ? codeColorData[attribute] : this.colorMapping['Removed'][attribute];
  }

  onNavigateToRequestHandover() {
    let formData = this.exportworkingListForm.getRawValue();
    if (!formData.shcGroupCode) {
      this.showErrorMessage("export.select.shc.group");
      return;
    }
    let shipmentsToBeRouted = new Array();
    let selectedShipments = new Array();
    let flag: any;
    let ntRdyFlag: any;
    let cncldFlag: any;
    formData.segments.forEach(element => {
      flag = 0;
      element.shipmentList.forEach(rdyEle => {
        if (rdyEle.selectFlag) {
          flag = 1;
          shipmentsToBeRouted.push(rdyEle);
        }
      });
      selectedShipments.push(flag);

      element.notReadyShipments.forEach(ntRdyEle => {
        if (ntRdyEle.selectFlag) {
          ntRdyFlag = 1;
          shipmentsToBeRouted.push(ntRdyEle);
        }
      });
      element.cancelledShipments.forEach(cncldEle => {
        if (cncldEle.selectFlag) {
          cncldFlag = 1;
          shipmentsToBeRouted.push(cncldEle);
        }
      });
    });

    if (ntRdyFlag == 1 || cncldFlag == 1) {
      return this.showErrorMessage("export.select.only.ready");
    }

    let count = 0;
    selectedShipments.forEach(element => {
      if (element == 1) {
        count++;
      }
    });
    if (count > 1) {
      return this.showErrorMessage("export.select.shipment.one.segment");
    }
    if (shipmentsToBeRouted.length < 1) {
      this.showErrorMessage("export.select.a.shipment");
      return;
    }

    let navigateObj = {
      shipmentListFromWorkingList: shipmentsToBeRouted,
      flightKey: formData.flightNo,
      flightDate: formData.flightDate,
      shcGroup: formData.shcGroupCode,
      segment: shipmentsToBeRouted[0].segmentId
    }
    this.navigateTo(this.router, '/export/buildup/specialcargorequestbyhandover', navigateObj);

  }
  //new
  onNavigateHandoverConfirm() {
    let formData = this.exportworkingListForm.getRawValue();
    if (!formData.shcGroupCode) {
      this.showErrorMessage("export.select.shc.group");
      return;
    }
    let shipmentsToBeRouted = new Array();
    let selectedShipments = new Array();
    let flag: any;
    let ntRdyFlag: any;
    let cncldFlag: any;
    formData.segments.forEach(element => {
      flag = 0;
      element.shipmentList.forEach(rdyEle => {
        if (rdyEle.selectFlag) {
          flag = 1;
          shipmentsToBeRouted.push(rdyEle);
        }
      });
      selectedShipments.push(flag);


      element.notReadyShipments.forEach(ntRdyEle => {
        if (ntRdyEle.selectFlag) {
          ntRdyFlag = 1;
          shipmentsToBeRouted.push(ntRdyEle);
        }
      });
      element.cancelledShipments.forEach(cncldEle => {
        if (cncldEle.selectFlag) {
          cncldFlag = 1;
          shipmentsToBeRouted.push(cncldEle);
        }
      });
    });
    if (ntRdyFlag == 1 || cncldFlag == 1) {
      return this.showErrorMessage("export.select.only.ready");
    }

    let count = 0;
    selectedShipments.forEach(element => {
      if (element == 1) {
        count++;
      }
    });
    if (count > 1) {
      return this.showErrorMessage("export.select.shipment.one.segment");
    }
    if (shipmentsToBeRouted.length < 1) {
      this.showErrorMessage("export.select.a.shipment");
      return;
    }
    let navigateObj = {
      shipmentListFromWorkingList: shipmentsToBeRouted,
      flightKey: formData.flightNo,
      flightDate: formData.flightDate,
      shcGroup: formData.shcGroupCode,
      segment: shipmentsToBeRouted[0].segmentId
    }
    this.navigateTo(this.router, '/export/buildup/specialCargoHandover', navigateObj);

  }
  checkToPromote(item) {
    // if (item.value.selectToPromote) {
    //   //this.showPromoteButton = true;
    //   this.promoteCargoFlag = false;
    // } else {
    //   this.showPromoteButton = false;
    //   this.promoteCargoFlag = true;
    // }

    if (item.value.selectToPromote) {
      this.selectToPromoteCount++;
    } else {
      this.selectToPromoteCount--;
      console.log("count", this.selectToPromoteCount);
    }
    if (this.selectToPromoteCount == 0 || this.selectToPromoteCount < 0) {
      this.promoteCargoFlag = true;
    }
    else {
      this.promoteCargoFlag = false;
    }

  }
  onPromote() {
    if (this.response.promoteCargoFlightList && this.response.promoteCargoFlightList.length > 1) {
      this.showErrorStatus('export.shipment.booked.in.multiple.flights.validation');
      return;
    }

    let selectedShipmentsToPromote = this.exportworkingListForm.getRawValue().promoteCargoFlightList;
    selectedShipmentsToPromote.forEach(element => {
      if (element.bookingPieces == null || element.bookingPieces <= 0 || element.bookWeight <= 0 || element.bookingWeight == null) {
        this.showErrorStatus('Please enter pieces and/or weight');
      } else {

        // if (selectedShipmentsToPromote.existingBookingPieces == null || selectedShipmentsToPromote.bookingWeight == null) {
        //   this.showErrorStatus('please enter pieces and/or weight');
        // }
        let request: any;
        request = {
          shipmentNumber: this.exportworkingListForm.get('shipmentNumber').value,
          flightKey: this.currentFlight.flightNo,
          flightDate: this.currentFlight.std,
          stdTime: this.currentFlight.std,
          flightId: this.currentFlight.flightId,
          segmentId: this.currentSegment.segmentId,
          flightOffPoint: this.currentSegment.flightOffPoint,
          flightBoardPoint: this.currentSegment.flightBoardingPoint,
          segment: this.currentFlight.segment,
          shipmentListToPromote: selectedShipmentsToPromote,
          bookingByFlight: true,
        }

        this.exportService.promoteCargo(request).subscribe(data => {
          if (data.data) {
            // this.onSearchAWB();
            this.window.close();
            this.onSearch();
            this.showSuccessStatus('g.operation.successful');
            this.promoteCargoFlag = true;
            this.showAllControlsForPromote = false;
            this.refreshFormMessages(data);
          } else {
            this.refreshFormMessages(data);
          }
        })
      }
    });
  }

  onCancel() {
    this.navigateBack(this.navigateBackData);
  }

  onClear() {
    this.exportworkingListForm.reset();
    this.showAllControls = false;
  }


  sendFBR() {
    let requestData = new Object();
    let flightkey: string = this.exportworkingListForm.get('flightNo').value;
    let flightDate: string = this.exportworkingListForm.get('flightDate').value;
    let flightId: string = this.currentFlight.flightId;
    requestData = {
      flightKey: flightkey,
      flightDate: flightDate,
      flightId: flightId
    }
    this.exportService.sendFBR(requestData).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {

      }
      if (data.success) {
        this.showSuccessStatus('g.completed.successfully');
        this.onSearch();
      }
    }
    )
  }

  onPrintCancelShipment(type) {
    this.reportParameters = new Object();
    // this.reportParameters.shipmentNumber = '16048870931';
    // if (this.exportworkingListForm.get('flightNo').value) {
    //   this.reportParameters.flightNo = this.exportworkingListForm.get('flightNo').value;
    // }
    if (this.resultSegments[0].flightBoardingPoint) {
      this.reportParameters.flightBoardingPoint = this.resultSegments[0].flightBoardingPoint;
    }
    if (this.resultSegments[0].flightId) {
      this.reportParameters.flightId = String(this.resultSegments[0].flightId);
    }
    // this.reportParameters.tenantID = NgcUtility.getTenantConfiguration().airportCode;
    // this.reportParameters.loggedInUser = this.getUserProfile().userLoginCode;
    // this.reportParameters.userLoginCode = this.getUserProfile().userLoginCode;
    // this.reportParameters.usertype = (<any>Environment).applicationId;


    this.ReportWithPrecision.format = ReportFormat.XLS;
    this.ReportWithPrecision.downloadReport();


  }

}
