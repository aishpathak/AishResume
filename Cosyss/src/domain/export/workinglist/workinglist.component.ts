import { element } from 'protractor';
import { request } from 'http';
import { forEach } from '@angular/router/src/utils/collection';
import { WorkingList, ExportFlight, FlightSegment, Flight, MailInformationModel } from './../export.sharedmodel';
import { BuildupService } from './../buildup/buildup.service';
import { ExportService } from './../export.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, NgcButtonComponent, NgcUtility, PageConfiguration, NgcReportComponent } from 'ngc-framework';

@Component({
  selector: 'ngc-workinglist',
  templateUrl: './workinglist.component.html',
  styleUrls: ['./workinglist.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  focusToBlank: false,
  focusToMandatory: false
})
export class WorkinglistComponent extends NgcPage {
  @ViewChild('captureSnapshotButton') captureSnapshotButton: NgcButtonComponent;
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  @ViewChild('viewSnapshotButton') viewSnapshotButton: NgcButtonComponent;
  @ViewChild('aliButton') aliButton: NgcButtonComponent;
  @ViewChild('bookingButton') bookingButton: NgcButtonComponent;
  @ViewChild('cancelBookingButton') cancelBookingButton: NgcButtonComponent;
  @ViewChild('assignUldButton') assignUldButton: NgcButtonComponent;
  @ViewChild('loadShipmentButton') loadShipmentButton: NgcButtonComponent;
  @ViewChild('unloadShipmentButton') unloadShipmentButton: NgcButtonComponent;
  @ViewChild('unassignUldButton') unassignUldButton: NgcButtonComponent;
  @ViewChild('outboundButton') outboundButton: NgcButtonComponent;
  @ViewChild('addWindow') addWindow: NgcWindowComponent;
  @ViewChild('createManifestButton') createManifestButton: NgcButtonComponent;
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @ViewChild("reportWindow1") reportWindow1: NgcReportComponent;
  @ViewChild("shipmentNotLoadedPopup") shipmentNotLoadedPopup: NgcWindowComponent;
  @ViewChild('mailManifestPopup') mailManifestPopup: NgcWindowComponent;
  reportParameters: any = new Object();
  dataFromoutgoingFlight: any;
  displayFlag: boolean = false;
  resp: any;
  resultSegments: any[];
  deleteResp: any;
  responseArray: any[];
  segmentDropdown: string[];
  currentFlight: any;
  retrievedSegmentList: any[];
  currentSegment: any;
  version: number;
  versionDate: any;
  versionDropdown: string[];
  selectedSegment: string;
  requestSegment: any;
  dateArray: any[];
  dateString: string;
  sourceIdSegmentDropdown: any;
  flagForPreCondition: boolean = true;
  showEtdTimeOnly: boolean = false;
  showStdTimeOnly: boolean = false;
  navigateBackData: any;

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
  bookingChangesValue: any = [];
  tempWeight: number = 0;
  tempPieces: number = 0;
  notReadyTotalWeight: any;
  notReadyTotalPieces: any;
  showManifestedInformation: boolean;
  responseData: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private exportService: ExportService
    , private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  private workingListForm: NgcFormGroup = new NgcFormGroup({
    flightNum: new NgcFormControl(),
    flightDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    flightNo: new NgcFormControl(),
    date: new NgcFormControl(),
    firstTimeManifestCompletedAtDisplay: new NgcFormControl(),
    versionNo: new NgcFormControl(),
    versionDate: new NgcFormControl(),
    palletsforFlight: new NgcFormControl(0),
    palletsForCargo: new NgcFormControl(0),
    containerForFlight: new NgcFormControl(0),
    containersForCargo: new NgcFormControl(0),
    totalTrollies: new NgcFormControl(0),
    aliCargoTwo: new NgcFormControl(),
    aliRemainingOne: new NgcFormControl(),
    aliRemainingTwo: new NgcFormControl(),
    snapshotVersionList: new NgcFormControl(),
    maxSnapVersion: new NgcFormControl(),
    segmentList: new NgcFormControl(),
    segment: new NgcFormControl(), std: new NgcFormControl(),
    etd: new NgcFormControl(),
    sel: new NgcFormControl(),
    aircraftType: new NgcFormControl(),
    aircraftRegistration: new NgcFormControl(),
    shape: new NgcFormControl(),
    totaBookedPiecesFlight: new NgcFormControl(),
    totaBookedWeightFlight: new NgcFormControl(),
    bookingChangesList: new NgcFormArray([]),
    shimentLoadingList: new NgcFormArray([
      new NgcFormGroup({
        selectFlag: new NgcFormControl()
      })
    ]),
    totalShipmentReadyBookingPieces: new NgcFormControl(0),
    totalShipmentReadyBookingWeight: new NgcFormControl(0.0),
    totalShipmentNotReadyBookingWeight: new NgcFormControl(0.0),
    totalShipmentNotReadyBookingPieces: new NgcFormControl(0),
    flightReadyBookingweightCount: new NgcFormControl(0.0),
    flightReadyBookingpiecesCount: new NgcFormControl(0),
    palletsUsed: new NgcFormControl(0),
    containersUsed: new NgcFormControl(0),
    palletsUsedForCargo: new NgcFormControl(0),
    containersUsedForCargo: new NgcFormControl(0),
    trolliesUsed: new NgcFormControl(0),
    remainingPallets: new NgcFormControl(0),
    remainingContainers: new NgcFormControl(0),
    remainingPalletsUsedForCargo: new NgcFormControl(0),
    remainingContainerUsedForCargo: new NgcFormControl(0),
    remainingTrollies: new NgcFormControl(0),
    mailInformationList: new NgcFormArray([])

  });


  ngOnInit() {
    const transferData = this.getNavigateData(this.activatedRoute);
    this.navigateBackData = this.getNavigateData(this.activatedRoute);
    try {
      if (transferData !== null && transferData !== undefined) {
        this.workingListForm.patchValue(transferData);
        if (transferData.fromOutgoingFlight) {
          this.dataFromoutgoingFlight = transferData;
        }
        this.onSearchWorkinglist();
      }
    } catch (e) { }
  }

  /**
   * On click of Search, Booking Changes and Shipments for Loading are displayed
   */
  public onSearchWorkinglist() {
    const fetchWorkingList: WorkingList = new WorkingList();
    const exportFlight: ExportFlight = new ExportFlight();
    fetchWorkingList.flight = exportFlight;
    exportFlight.flightNo = this.workingListForm.get('flightNo').value;
    exportFlight.flightDate = this.workingListForm.get('flightDate').value;
    this.searchButton.disabled = true;
    this.exportService.getWorkingList(exportFlight).subscribe(data => {
      this.refreshFormMessages(data);
      if (!this.showResponseErrorMessages(data)) {
        if (data.data) {
          this.resp = data.data;
          this.responseData = data.data;
          this.currentFlight = this.resp.flight;
          this.currentFlight.segment = this.resp.segment; if (this.currentFlight.ali) {
            (<NgcFormGroup>this.workingListForm).get('palletsforFlight').setValue(this.currentFlight.ali.palletsforFlight);
            (<NgcFormGroup>this.workingListForm).get('containerForFlight').setValue(this.currentFlight.ali.containerForFlight);
            (<NgcFormGroup>this.workingListForm).get('palletsForCargo').setValue(this.currentFlight.ali.palletsForCargo);
            (<NgcFormGroup>this.workingListForm).get('containersForCargo').setValue(this.currentFlight.ali.containersForCargo);
            (<NgcFormGroup>this.workingListForm).get('totalTrollies').setValue(this.currentFlight.ali.totalTrollies);
            (<NgcFormGroup>this.workingListForm).get('palletsUsed').setValue(this.currentFlight.ali.palletsUsed);
            (<NgcFormGroup>this.workingListForm).get('containersUsed').setValue(this.currentFlight.ali.containersUsed);
            (<NgcFormGroup>this.workingListForm).get('palletsUsedForCargo').setValue(this.currentFlight.ali.palletsUsedForCargo);
            (<NgcFormGroup>this.workingListForm).get('containersUsedForCargo').setValue(this.currentFlight.ali.containersUsedForCargo);
            (<NgcFormGroup>this.workingListForm).get('trolliesUsed').setValue(this.currentFlight.ali.trolliesUsed);
            (<NgcFormGroup>this.workingListForm).get('remainingPalletsUsedForCargo').setValue(this.currentFlight.ali.remainingPalletsUsedForCargo);
            (<NgcFormGroup>this.workingListForm).get('remainingContainerUsedForCargo').setValue(this.currentFlight.ali.remainingContainerUsedForCargo);
            (<NgcFormGroup>this.workingListForm).get('remainingPallets').setValue(this.currentFlight.ali.remainingPallets);
            (<NgcFormGroup>this.workingListForm).get('remainingContainers').setValue(this.currentFlight.ali.remainingContainers);
            (<NgcFormGroup>this.workingListForm).get('remainingTrollies').setValue(this.currentFlight.ali.remainingTrollies);
          }

          if (this.currentFlight.firstTimeManifestCompletedAt && this.currentFlight.firstTimeManifestCompletedAt !== (null || '')) {
            this.showManifestedInformation = true;
          } else {
            this.showManifestedInformation = false;
          }
          this.sourceIdSegmentDropdown = this.createSourceParameter(this.currentFlight.flightId);
          this.retrievedSegmentList = this.resp.segments;

          this.filterBookingChangesBasedOnSegments();
          this.currentSegment = 'All'
          this.calculateTotalPieceWeightOfReadyNotReadyShipment();

          this.resultSegments = this.resp.segments;
          this.getSegments();

          (<NgcFormGroup>this.workingListForm).patchValue(this.currentFlight);
          this.setEtdStd();
          this.bookingDisplay(this.currentSegment);
          this.laodingShipment(this.currentSegment);

        }
      } else {
        this.showResponseErrorMessages(data)

      }
      this.searchButton.disabled = false;
    },
      error => {
        this.showErrorStatus('Error:' + error);
        this.searchButton.disabled = false;
      });
    this.searchButton.disabled = false;

  }

  public afterFocus() {
    if (this.workingListForm.get('flightNo').value != ''
      && this.workingListForm.get('flightNo').value != null) {
      this.searchButton.focus();
    }
  }

  setEtdStd(): any {
    let dateData = NgcUtility.getDateOnly(this.workingListForm.get('flightDate').value);
    if (this.workingListForm.get('etd').value !== null) {
      let dateDataEtd = NgcUtility.getDateOnly(this.workingListForm.get('etd').value);


      if (dateDataEtd.toDateString() === dateData.toDateString()) {
        this.showEtdTimeOnly = false;
      } else {
        this.showEtdTimeOnly = true;
      }
    }
    if (this.workingListForm.get('std').value !== null) {
      let dateDateStd = NgcUtility.getDateOnly(this.workingListForm.get('std').value);
      if (dateDateStd.toDateString() === dateData.toDateString()) {
        this.showStdTimeOnly = false;
      } else {
        this.showStdTimeOnly = true;
      }
    }
  }
  /**
   *This function will be used to set serial number to ready list based on segment
   *
   * @memberof WorkinglistComponent
   */
  addSerialNumberToShipmentReadyData(data) {
    let index = 1;

    data.shipmentList.forEach(readyShipmentData => {
      readyShipmentData['sno'] = index++;

    });
  }


  /**
   * This fucntion used to filter booking changes as per segment
   *
   * @memberof WorkinglistComponent
   */
  filterBookingChangesBasedOnSegments(): void {
    let filteredData: any = [];
    this.resp.segments.forEach(segment => {
      filteredData = segment.bookingChanges.filter(booking => booking.flightOffPoint === segment.flightOffPoint)
      filteredData.forEach(element => {
        element.partShipment === true ? element['partShipmentData'] = 'Y' : element['partShipmentData'] = 'N';
      });
      segment.bookingChanges = filteredData;
    });
  }

  calculateTotalPieceWeightOfReadyNotReadyShipment(): void {
    // variable to hold temp result

    let totalFlightBookingPiecesCount = 0;
    let totalFlightBookingWeightCount = 0;

    this.resp.segments.forEach(segment => {
      let countOfPieces = 0;
      let countOfWeight = 0;
      let countOfBookingPieces = 0;
      let countOfBookingWeight = 0;
      if (segment.shipmentList.length > 0) {
        segment.shipmentList.forEach(element => {

          // tempCountLoadedPieces variable used to count the piece weight of loaded shipment
          //bug 5545
          let tempCountLoadedPieces = 0;
          let tempCountLoadedWeight = 0;
          if (element.uldList.length > 0) {
            element.uldList.forEach(loadedUld => {
              tempCountLoadedPieces += loadedUld.pieces;
              tempCountLoadedWeight += loadedUld.weight;
            });
          }

          countOfPieces = countOfPieces + tempCountLoadedPieces;
          countOfWeight = countOfWeight + tempCountLoadedWeight;
          countOfBookingPieces = countOfBookingPieces + element.shpBookingPieces;
          countOfBookingWeight = countOfBookingWeight + element.shpBookingWeight;
        });
      }
      segment['totalReadyBookingPieces'] = countOfPieces;
      totalFlightBookingPiecesCount += countOfBookingPieces;
      segment['totalReadyBookingWeight'] = countOfWeight;
      totalFlightBookingWeightCount += countOfBookingWeight;

      this.workingListForm.get('flightReadyBookingpiecesCount').patchValue(totalFlightBookingPiecesCount);
      this.workingListForm.get('flightReadyBookingweightCount').patchValue(totalFlightBookingWeightCount);

      // reseting value for resuse in shipment not ready
      countOfPieces = 0;
      countOfWeight = 0;
      if (segment.bookingChanges.length > 0) {
        segment.bookingChanges.forEach(element => {
          if (element.statusCode != 'XX') {
            countOfPieces = countOfPieces + element.bookingPieces;
            countOfWeight = countOfWeight + element.bookingWeight;
          }
        });
      }
      segment['totalNotReadyBookingPieces'] = countOfPieces;

      segment['totalNotReadyBookingWeight'] = countOfWeight;
      totalFlightBookingPiecesCount += countOfPieces;
      totalFlightBookingWeightCount += countOfWeight;

    });
    this.workingListForm.get('totaBookedPiecesFlight').patchValue(totalFlightBookingPiecesCount);
    this.workingListForm.get('totaBookedWeightFlight').patchValue(totalFlightBookingWeightCount);

    if (this.currentSegment === 'All') {
      this.tempPieces = 0;
      this.tempWeight = 0;
      this.notReadyTotalPieces = 0;
      this.notReadyTotalWeight = 0;
      this.resp.segments.forEach(segment => {
        this.tempPieces += segment.totalReadyBookingPieces;
        this.tempWeight += segment.totalReadyBookingWeight;
        this.notReadyTotalWeight += segment.totalNotReadyBookingWeight
        this.notReadyTotalPieces += segment.totalNotReadyBookingPieces;
      });

    }
  }

  /**
   * On selecting segment from the segment list, Booking changes and Loading changes will be displayed for that segment
   */
  public onSelect(event) {
    this.selectedSegment = event;
    if (this.selectedSegment !== 'All') {
      const boardingPoint = this.selectedSegment.substring(0, 3);
      const offPoint = this.selectedSegment.substring(4);
      for (let entry of this.retrievedSegmentList) {
        if (entry.flightBoardingPoint === boardingPoint && entry.flightOffPoint === offPoint)
          this.currentSegment = entry;
      }
      this.bookingDisplay(this.currentSegment);
      this.laodingShipment(this.currentSegment);
    } else {
      this.bookingDisplay(this.selectedSegment);
      this.laodingShipment(this.selectedSegment);
    }
  }

  /**
   * For  a given flight and date, this method generates the list of segments displayed in the segment dropdown list
   */
  public getSegments() {
    this.segmentDropdown = new Array<string>();
    if (this.resultSegments.length > 1) {
      this.segmentDropdown.push('All'); // this is added as part of 5878 bug
    }
    for (let index = 0; index < this.resultSegments.length; index++) {
      this.segmentDropdown.push(this.resultSegments[index].flightBoardingPoint + '-' + this.resultSegments[index].flightOffPoint);
    }
    this.workingListForm.controls['segmentList'].setValue(this.segmentDropdown[0]);
    if (this.resultSegments.length === 1) {
      this.onSelect(this.segmentDropdown[0]);
    }
  }

  /**
   * This method will be modifying and adapting values to be displayed
   * pertaining to a certain booking changes list belonging to the selected segment
   */
  public bookingDisplay(displaySegment: any) {
    if (displaySegment !== 'All') {
      this.displayFlag = true;
      if (displaySegment.modifiedOn === null)
        this.versionDate = displaySegment.createdOn;
      else
        this.versionDate = displaySegment.modifiedOn;
      if (displaySegment.snapShotVersion === 1) {
        (<NgcFormControl>this.workingListForm.controls['versionNo']).patchValue(displaySegment.snapShotVersion);
        this.versionDropdown = new Array<string>();
      }
      else {
        let snapVersion = displaySegment.snapShotVersion;
        snapVersion--;
        (<NgcFormControl>this.workingListForm.controls['versionNo']).patchValue(displaySegment.snapShotVersion);
        this.versionDropdown = new Array<string>();
        for (let i = 1; i <= snapVersion; i++)
          this.versionDropdown.push("" + i);
      }
      let sno = 1;
      (<NgcFormControl>this.workingListForm.controls['versionDate']).patchValue(this.versionDate);
      for (let entry of displaySegment.bookingChanges) {
        entry.selectFlag = false;
        entry.sno = sno++;
      }
      this.workingListForm.get('totalShipmentNotReadyBookingPieces').patchValue(displaySegment.totalNotReadyBookingPieces);
      this.workingListForm.get('totalShipmentNotReadyBookingWeight').patchValue(displaySegment.totalNotReadyBookingWeight);
      (<NgcFormArray>this.workingListForm.controls['bookingChangesList']).patchValue(displaySegment.bookingChanges);
    }
    else {
      this.setBookingChangesData();
    }
  }

  // changes done in below method to show not ready booking when first segment is nil
  setBookingChangesData() {
    this.bookingChangesValue = [];
    let sno = 1;

    this.resp.segments.forEach(segment => {
      segment.bookingChanges.forEach(bookingDetails => {

        bookingDetails['selectFlag'] = 'false';
        bookingDetails.partShipment === true ? bookingDetails['partShipmentData'] = 'Y' : bookingDetails['partShipmentData'] = 'N';
        bookingDetails['sno'] = sno++;
        this.bookingChangesValue.push(bookingDetails);
      });
    });
    this.displayFlag = true;
    (<NgcFormArray>this.workingListForm.controls['bookingChangesList']).patchValue(this.bookingChangesValue);
    this.workingListForm.get('totalShipmentNotReadyBookingPieces').patchValue(this.notReadyTotalPieces);
    this.workingListForm.get('totalShipmentNotReadyBookingWeight').patchValue(this.notReadyTotalWeight);
  }

  public captureSnapshot() {
    let createSnapshotSegment: FlightSegment = new FlightSegment();
    const selectedSegment = this.workingListForm.get('segmentList').value + '';
    const boardingPoint = selectedSegment.substr(0, 3);
    if (boardingPoint !== 'All') {
      const offPoint = selectedSegment.substring(4);
      for (let entry of this.retrievedSegmentList) {
        if (entry.flightBoardingPoint === boardingPoint && entry.flightOffPoint === offPoint) {
          createSnapshotSegment = entry;
        }
      }
      this.captureSnapshotButton.disabled = true;
      createSnapshotSegment.snapShotVersion = this.workingListForm.get('versionNo').value;
      this.exportService.createSnapshot(createSnapshotSegment).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.captureSnapshotButton.disabled = false;
          this.onSearchWorkinglist();
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

  /**
   * On clicking view snapshot button, opens the selected snapshot version of the selected segment in new tab
   */
  // Not working due to non-communicability between tabs in framework
  public viewSnapshot() {
    let viewSnapshotSegment: FlightSegment = new FlightSegment();
    let selectedSegment = this.workingListForm.get('segmentList').value + '';
    const boardingPoint = selectedSegment.substring(0, 3);
    const offPoint = selectedSegment.substring(4);
    for (let entry of this.retrievedSegmentList) {
      if (entry.flightBoardingPoint === boardingPoint && entry.flightOffPoint === offPoint) {
        viewSnapshotSegment = entry;
      }
    }
    const stringVersionNo = this.workingListForm.get('snapshotVersionList').value;
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
        if (data !== null)
          this.navigateTo(this.router, 'export/snapshotworkinglist', data.data);
      } else {
        this.showResponseErrorMessages(data);
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
        this.viewSnapshotButton.disabled = false;
      });
  }

  /**
   * Routing for Book Single Shipment
   */
  public routeToAli() {
    let navigateObj = {
      flightKey: this.workingListForm.get("flightNo").value,
      flightOriginDate: new Date(this.workingListForm.get("flightDate").value)
    }
    this.navigateTo(this.router, '/export/buildup/airlineloadinginstructions', navigateObj);
  }
  public routeToBookSingle() {
    let selected = this.workingListForm.get(["bookingChangesList"]).
      value.filter((element) => element.selectFlag == true);
    if (selected.length > 1 || selected.length == 0) {
      this.showErrorMessage("export.select.one.shipment");
    }
    else {
      let shipment = this.workingListForm.get(["bookingChangesList"]).value.find((element) => element.selectFlag == true);
      let navigateObj = {
        shipmentNumber: shipment.shipmentNumber
      }
      this.navigateTo(this.router, '/export/booksingleshipment', navigateObj);
    }
  }
  public cancelShipment() {
    this.routeToBookMultiple();
  }
  routeToBookMultiple() {
    let navigateObj = {
      flightKey: this.workingListForm.get("flightNo").value,
      flightDate: new Date(this.workingListForm.get("flightDate").value),
      screenName: 'workinglist'
    }
    this.navigateTo(this.router, '/export/bookmultipleshipment', navigateObj);
  }
  routeToAssignUld() {
    let navigateObj = {
      flightKey: this.workingListForm.get("flightNo").value,
      flightOriginDate: new Date(this.workingListForm.get("flightDate").value)
    }
    this.navigateTo(this.router, '/export/buildup/assign-uld-flight', navigateObj);
  }
  public routeToLoadShipment() {
    let navigateObj = {
      flightKey: this.workingListForm.get("flightNo").value,
      flightOriginDate: new Date(this.workingListForm.get("flightDate").value)
    }
    this.navigateTo(this.router, '/export/buildup/loadshipment', navigateObj);
  }
  public routeToUnloadShipment() {
    let navigateObj = {
      flightKey: this.workingListForm.get("flightNo").value,
      flightOriginDate: new Date(this.workingListForm.get("flightDate").value)
    }
    this.navigateTo(this.router, '/export/buildup/unloadshipmentDesktop', navigateObj);

  }
  public routeToOutbound() {
    this.navigateTo(this.router, '/export/outboundlyinglist', this.dateString);
  }

  public laodingShipment(segment: any) {
    if (segment !== 'All') {
      this.workingListForm.get('totalShipmentReadyBookingPieces').patchValue(segment.totalReadyBookingPieces);
      this.workingListForm.get('totalShipmentReadyBookingWeight').patchValue(segment.totalReadyBookingWeight);
      this.addSerialNumberToShipmentReadyData(segment);

      (<NgcFormArray>this.workingListForm.controls['shimentLoadingList']).patchValue(segment.shipmentList);
    }
    else {
      this.setValuesForAllSegment();
    }
  }

  /* This method will show details of all segments consolidated*/
  setValuesForAllSegment() {
    let index: number = 1;
    let consolidatedReadyShipmentList = new Array();
    this.resp.segments.forEach(segment => {
      segment.shipmentList.forEach(shipment => {
        shipment['sno'] = index++
        consolidatedReadyShipmentList.push(shipment);
      });
    });
    (this.workingListForm.controls['shimentLoadingList']).patchValue(consolidatedReadyShipmentList);
    this.workingListForm.get('totalShipmentReadyBookingPieces').patchValue(this.tempPieces);
    this.workingListForm.get('totalShipmentReadyBookingWeight').patchValue(this.tempWeight);
  }
  public createManifest() {
    // check ulds not exists in DLS but present in manifest then give prompt  
    if (this.currentFlight.uldNotInDlsFlag) {

      this.showConfirmMessage(NgcUtility.translateMessage("export.uld.not.in.dls.confirmation", [this.currentFlight.uldsNosNotInDLS])).then(fulfilled => {
        this.checkForManifestPreConditions();

      }
      ).catch(reason => {
        return;
      });
    } else {
      this.checkForManifestPreConditions();
    }

  }

  public getShapeColor(code, attribute) {
    const codeColorData = this.colorMapping[code];
    return codeColorData ? codeColorData[attribute] : this.colorMapping['Removed'][attribute];
  }

  onPrint() {
    this.reportParameters.tenantId = NgcUtility.getTenantConfiguration().airportCode;
    this.reportParameters.flightKey = this.workingListForm.get('flightNo').value;
    this.reportParameters.flightDate = this.workingListForm.get('flightDate').value;
    this.reportParameters.loggedinID = this.getUserProfile().userLoginCode;
    this.reportWindow.open();
  }

  onPrintUld() {
    this.reportParameters.tenantId = NgcUtility.getTenantConfiguration().airportCode;
    this.reportParameters.flightKey = this.workingListForm.get('flightNo').value;
    this.reportParameters.flightDate = this.workingListForm.get('flightDate').value;
    this.reportParameters.loggedinID = this.getUserProfile().userLoginCode;
    this.reportWindow1.open();
  }

  // method to route to cargo manifest screen along with flight key and date
  routeToCargoManifest() {
    let transferData: any = { 'flightKey': this.workingListForm.get('flightNo').value, 'flightOriginDate': this.workingListForm.get('flightDate').value };
    this.navigateTo(this.router, '/export/buildup/cargomanifest', transferData);
  }

  // method to route to cargo manifest screen along with flight key and date
  routeToUpdateDLS() {
    let transferData: any = { 'flightKey': this.workingListForm.get('flightNo').value, 'flightOriginDate': this.workingListForm.get('flightDate').value };
    this.navigateTo(this.router, '/export/buildup/update-dls', transferData);
  }

  // bug 4367

  checkForManifestPreConditions(): void {

    const exportFlight: ExportFlight = new ExportFlight();
    // fetchWorkingList.flight = exportFlight;
    exportFlight.flightNo = this.workingListForm.get('flightNo').value;
    exportFlight.flightDate = this.workingListForm.get('flightDate').value;

    /*     this.exportService.getWorkingList(exportFlight).subscribe(data => {
          this.refreshFormMessages(data);
          if (!this.showResponseErrorMessages(data)) {
            if (data.data) {
              this.resp = data.data; */
    this.resp = this.responseData;
    let readyErrorflag = true;
    this.flagForPreCondition = false;
    let flagForWarningToUserForNoReadyShipments: boolean = false;
    let flagForSegmentWiseShipmenReady: boolean = false;
    let flagForReadyForBookingShipmentInNotReadyState = false;
    this.resp.segments.forEach(segmentData => {
      if (segmentData.shipmentList.length > 0) {
        flagForSegmentWiseShipmenReady = true;
      }
      if (segmentData.shipmentList.length === 0) {
        flagForWarningToUserForNoReadyShipments = true;
      }

      const bookingData = segmentData.bookingChanges.filter(booking => booking.statusCode === 'SS');
      if (bookingData.length > 0) {
        flagForReadyForBookingShipmentInNotReadyState = true;
      }
    });

    if (flagForReadyForBookingShipmentInNotReadyState) {
      this.showErrorMessage('export.not.ready.booking.exists');
    } else {

      if (flagForWarningToUserForNoReadyShipments && !flagForSegmentWiseShipmenReady) {
        this.showConfirmMessage("export.create.manifest.with.no.shipments").then(fulfilled => {
          readyErrorflag = false;
          this.createManifestFromWorkingList();
        }).catch(reason => {
          this.flagForPreCondition = false;
          this.onSearchWorkinglist();
        });
      } else {
        this.checkNotReady();
      }
    }
  }
  checkNotReady() {
    let flagForShipmentWithNoLoadedData: boolean = false;
    this.resp.segments.forEach(segmentData => {
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
    manifestFlight.flightKey = this.workingListForm.get('flightNo').value;
    manifestFlight.flightOriginDate = this.workingListForm.get('flightDate').value;
    manifestFlight.aircraftRegistration = this.workingListForm.get('aircraftRegistration').value;
    this.createManifestButton.disabled = true;
    this.exportService.checkNilAndCreateManifest(manifestFlight).subscribe(data => {
      if (data.data && data.data.nilCargo) {
        this.showConfirmMessage('export.flight.nil.cargo.proceed.with.manifest.confirmation').then(fulfilled => {
          this.exportService.createManifest(data.data).subscribe(data => {
            this.refreshFormMessages(data);

            if (data.messageList == null) {
              this.showSuccessStatus("g.completed.successfully");
            }
            this.createManifestButton.disabled = false;
          }, error => {
            this.showErrorStatus(error);
            this.createManifestButton.disabled = false;
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
                  }
                  this.createManifestButton.disabled = false;
                }, error => {
                  this.showErrorStatus(error);
                  this.createManifestButton.disabled = false;
                });
              }
              ).catch(reason => {
              });
            }

          });
          this.refreshFormMessages(data);
          if (data.messageList == null) {
            this.showSuccessStatus("g.completed.successfully");
          }
          this.createManifestButton.disabled = false;
        }, error => {
          if (error) {
            this.showErrorStatus(error);
          }
          this.createManifestButton.disabled = false;
        }).catch(reason => {
          this.createManifestButton.disabled = false;
        });
      }
      this.refreshFormMessages(data);
      if (data.success && data.messageList == null) {
        this.showSuccessStatus("g.completed.successfully");
      }
      this.createManifestButton.disabled = false;
    }, error => {
      if (error) {
        this.showErrorStatus(error);
      }

      this.createManifestButton.disabled = false;
    });
  }

  mailManifest() {
    (<NgcFormArray>this.workingListForm.get("mailInformationList")).patchValue(new Array());
    (<NgcFormArray>this.workingListForm.get("mailInformationList")).patchValue(this.currentFlight.mailInformation);
    this.mailManifestPopup.open();
  }

  addMailManifestInformation() {
    (<NgcFormArray>this.workingListForm.get("mailInformationList")).addValue([
      {
        mailType: null,
        flightSegmentId: null,
        piece: 0,
        weight: 0
      }
    ]);
  }

  saveMailManifestInformation() {
    let request: any;
    request = (<NgcFormArray>this.workingListForm.get("mailInformationList")).getRawValue();
    request.forEach(element => {
      element['flightId'] = this.currentFlight.flightId;
    });

    this.exportService.updateMailInformation(request).subscribe(data => {
      this.refreshFormMessages(data);
      let response = data;
      if (response.success) {
        this.showSuccessStatus('g.completed.successfully');
        this.mailManifestPopup.close();
        this.onSearchWorkinglist();
      }
    });
  }

  deleteData(event) {
    (this.workingListForm.get(["mailInformationList", event]) as NgcFormGroup).markAsDeleted();
  }

  onCancel(event) {
    this.navigateBack(this.navigateBackData);
    // if (this.dataFromoutgoingFlight == null) {
    //   let tranferData;
    //   this.navigateTo(this.router, '**', tranferData);
    // } else {
    //   this.navigateTo(this.router, '/export/buildup/outgoingFlights', this.dataFromoutgoingFlight);
    // }
  }

  routeShipmentInfo(data) {
    const routeData = { shipmentNumber: data, flightNo: this.workingListForm.get('flightNo').value, flightDate: this.workingListForm.get('flightDate').value };
    this.navigateTo(this.router, 'awbmgmt/shipmentinfo', routeData);
  }

  routeFWBScreen(data) {
    //  const routeData = { shipmentNumber: data, flightNo: this.workingListForm.get('flightNo').value, flightDate: this.workingListForm.get('flightDate').value };
    var dataToSend = {
      awbNumber: data
    }
    this.navigateTo(this.router, 'import/maintainfwb', dataToSend);
    //this.navigateTo(this.router, 'awbmgmt/shipmentinfo', routeData);
  }

  cancelRebookShipments() {
    let navigateObj = {
      flightKey: this.workingListForm.get("flightNo").value,
      flightDate: new Date(this.workingListForm.get("flightDate").value),
      screenName: 'workinglist'
    }
    this.navigateTo(this.router, '/export/cancelbookedshipment', navigateObj);
  }

}