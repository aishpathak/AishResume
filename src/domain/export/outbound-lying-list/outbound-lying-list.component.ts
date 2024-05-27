import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnDestroy, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  PageConfiguration, NgcWindowComponent, NgcUtility, NgcReportComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportService } from './../export.service';
import { OutboundLyingListRequest, BookMultipleShipmentsFlight, GetFlightId, BookingSHC } from './../export.sharedmodel';
import { Environment } from '../../../environments/environment';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngc-outbound-lying-list',
  templateUrl: './outbound-lying-list.component.html',
  styleUrls: ['./outbound-lying-list.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  focusToBlank: true,
  focusToMandatory: true
})
export class OutboundLyingListComponent extends NgcPage {
  @ViewChild('inventoryWindow') inventoryWindow: NgcWindowComponent;
  @ViewChild('routingInfoWindow') routingInfoWindow: NgcWindowComponent;
  forwardedData: any;
  reportParameters: any;
  outboundLyingListData: any[];
  assignToFlightData: any[];
  updateFlightData: any[];
  resp: any;
  flightIdforDropdown: any;
  nonMatchingRoutePresent = false;
  flagShowData = false;
  private stopCreatingFlightFlag = true;
  private response;
  private navigationFlag = true;
  private partShipmentFlag = false;
  private outboundLyingListForm: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    carrier: new NgcFormControl(),
    destination: new NgcFormControl(null),
    bookingStatus: new NgcFormControl('All'),
    shipmentState: new NgcFormControl('YES'),
    shipmentType: new NgcFormControl('All'),
    dwellTime: new NgcFormControl(),
    shcPriority: new NgcFormControl(false),
    flightKey: new NgcFormControl(),
    date: new NgcFormControl(),
    flightSegmentId: new NgcFormControl(),
    flightId: new NgcFormControl(),
    outboundLyingList: new NgcFormArray([]),
    outboundLyingListWithRoutes: new NgcFormArray([]),
    outboundLyingListWithMatchingRoute: new NgcFormArray([]),
    outboundLyingListWithNonMatchingRoute: new NgcFormArray([]),
    outboundLyingListWithNoRouteInfo: new NgcFormArray([]),
    displayShipmentNumber: new NgcFormControl(),
    flightAndSegmentForPopup: new NgcFormControl(),
    inventoryList: new NgcFormArray([])
  });
  @ViewChild("Report") Report: NgcReportComponent;
  @ViewChild("ReportExcel") ReportExcel: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private exportService: ExportService, private router: Router,
    private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData) {
      this.outboundLyingListForm.get('carrier').patchValue(this.forwardedData.carrier);
      this.outboundLyingListForm.get('destination').patchValue(this.forwardedData.destination);
      this.outboundLyingListForm.get('bookingStatus').patchValue(this.forwardedData.bookingStatus);
      this.outboundLyingListForm.get('shipmentState').patchValue(this.forwardedData.shipmentState);
      this.outboundLyingListForm.get('dwellTime').patchValue(this.forwardedData.dwellTime);
      this.outboundLyingListForm.get('shcPriority').patchValue(this.forwardedData.shcPriority);
      this.outboundLyingListForm.get('shipmentNumber').patchValue(this.forwardedData.searchShipmentNumber);
      this.outboundLyingListForm.get('shipmentType').patchValue(this.forwardedData.searchShipmentType);
      //Initiate the search
      this.async(() => {
        this.onSearch();
      }, 1000)
    }
  }
  /**
  * On Destroy
  */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  getFlightId(): void {
    if (this.outboundLyingListForm.get('flightKey').value !== null
      && this.outboundLyingListForm.get('date').value !== null) {
      this.outboundLyingListForm.get('flightSegmentId').reset();
      const flightIdValues = new GetFlightId();
      flightIdValues.flightNumber = this.outboundLyingListForm.get('flightKey').value;
      flightIdValues.flightDate = this.outboundLyingListForm.get('date').value;
      this.exportService.fetchFlightId
        (flightIdValues).subscribe(data => {
          this.refreshFormMessages(data);
          this.response = data.data;
          if (this.response !== null) {
            this.outboundLyingListForm.get('flightId').setValue(this.response.flightId);
          }
        });
    }
  }


  /**
  * This function is responsible for searching the records
  */
  onSearch() {
    this.outboundLyingListForm.get('flightKey').setValue(null);
    this.outboundLyingListForm.get('date').setValue(null);
    this.outboundLyingListForm.get('flightSegmentId').setValue(null);

    if (this.outboundLyingListForm.get('carrier').value == null || this.outboundLyingListForm.get('shipmentState').value == null) {
      this.showErrorMessage("export.enter.all.mandatory.detials");
      return;
    }
    this.flagShowData = false;
    const request = new OutboundLyingListRequest();
    request.carrier = this.outboundLyingListForm.get('carrier').value;
    request.shipmentNumber = this.outboundLyingListForm.get('shipmentNumber').value;
    request.destination = this.outboundLyingListForm.get('destination').value;
    request.shipmentState = this.outboundLyingListForm.get('shipmentState').value;
    request.shipmentType = this.outboundLyingListForm.get('shipmentType').value;
    request.dwellTime = this.outboundLyingListForm.get('dwellTime').value;
    request.shcPriority = this.outboundLyingListForm.get('shcPriority').value;
    request.bookingStatus = this.outboundLyingListForm.get('bookingStatus').value;
    this.exportService.fetchLyingList(request).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data.data;
      this.outboundLyingListData = this.resp.responseData;


      if (this.outboundLyingListData.length > 0) {
        this.flagShowData = true;
        let sno = 1;
        for (const eachRow of this.outboundLyingListData) {

          eachRow['checkBox'] = 'false';
          eachRow['sno'] = sno++;
          if (eachRow.bookingFlightDate != null) {
            let dateAndTime = eachRow.bookingFlightDate.split("T");
            eachRow.bookingFlightDate = dateAndTime[0];
            eachRow['bookingTime'] = dateAndTime[1];

          }
          let locInfo = '';
          if (eachRow.inventoryList.length > 0) {
            for (const inventoryRow of eachRow.inventoryList) {
              if ((inventoryRow.shipmentLocation != null && inventoryRow.shipmentLocation != "") && (inventoryRow.warehouseLocation == null || inventoryRow.warehouseLocation == "")) {
                locInfo = locInfo + inventoryRow.shipmentLocation + "/" + inventoryRow.pieces + "/" + inventoryRow.weight + " "
              }
              else if ((inventoryRow.shipmentLocation == null || inventoryRow.shipmentLocation == "") && (inventoryRow.warehouseLocation != null && inventoryRow.warehouseLocation != "")) {
                locInfo = locInfo + inventoryRow.warehouseLocation + "/" + inventoryRow.pieces + "/" + inventoryRow.weight + " "
              }
              else if (inventoryRow.shipmentLocation != null && inventoryRow.shipmentLocation != "" && inventoryRow.warehouseLocation != null && inventoryRow.warehouseLocation != "") {
                locInfo = locInfo + inventoryRow.shipmentLocation + "-" + inventoryRow.warehouseLocation + "/" + inventoryRow.pieces + "/" + inventoryRow.weight + " "
              }
              else {
                locInfo = locInfo + inventoryRow.pieces + "/" + inventoryRow.weight + " "
              }
            }

          }
          eachRow['locInfo'] = locInfo;
        }

        this.outboundLyingListForm.get('flightKey').reset();
        this.outboundLyingListForm.get('date').reset();
        this.outboundLyingListForm.get('flightSegmentId').reset();
        this.outboundLyingListForm.controls['outboundLyingList'].patchValue(this.outboundLyingListData);
      } else {
        this.showErrorStatus('NO_RECORDS_EXIST');
      }
    },
      error => {
        this.showErrorStatus('export.invalid.search.criteria.select.one.criteria');
      });
  }

  cellsRenderer(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + '';
  }

  assignToFlight() {
    // this.checkMandatoryValues();
    // if (this.stopCreatingFlightFlag === false) {

    if (this.nonMatchingRoutePresent) {
      let isShipmentSelected = false;
      let selectedShipments = [];
      (<NgcFormArray>this.outboundLyingListForm.controls['outboundLyingListWithMatchingRoute']).getRawValue().forEach(matchingRoutesShipment => {
        // console.log(matchingRoutesShipment.checkBox === true);
        if (matchingRoutesShipment.checkBox) {
          selectedShipments.push(matchingRoutesShipment);
          isShipmentSelected = true;
        }
      });
      (<NgcFormArray>this.outboundLyingListForm.controls['outboundLyingListWithNonMatchingRoute']).getRawValue().forEach(nonMatchingRoutesShipment => {
        if (nonMatchingRoutesShipment.checkBox) {
          selectedShipments.push(nonMatchingRoutesShipment);
          isShipmentSelected = true;
        }
      });
      (<NgcFormArray>this.outboundLyingListForm.controls['outboundLyingListWithNoRouteInfo']).getRawValue().forEach(noRoutesShipment => {
        selectedShipments.push(noRoutesShipment);
        // isShipmentSelected = true;
      });
      if (!isShipmentSelected) {
        this.showErrorMessage("export.select.shipments.to.proceed");
        return;
      }
      this.outboundLyingListForm.controls['outboundLyingListWithRoutes'].patchValue(selectedShipments);
      this.addListAssignToFlightWithRoutes();
    } else {
      this.addListAssignToFlight();
    }

    this.checkPartShipment();
    // if (this.partShipmentFlag === false) {
    //   this.setMultipleShipmentAssignData();
    //   // this.checkFlightInformation();
    //   const multipleShipmentFlightBooking = new BookMultipleShipmentsFlight();
    //   multipleShipmentFlightBooking.flightID = this.outboundLyingListForm.get('flightId').value;
    //   multipleShipmentFlightBooking.flightKey = this.outboundLyingListForm.get('flightKey').value;
    //   multipleShipmentFlightBooking.flightDate = this.outboundLyingListForm.get('date').value;
    //   multipleShipmentFlightBooking.isLyingListShipment = true;

    //   if (this.assignToFlightData.length > 0) {

    //     multipleShipmentFlightBooking['flagInsert'] = 'Y';
    //     multipleShipmentFlightBooking.shipmentList = this.assignToFlightData;
    //     this.sendRequestAddShipment(multipleShipmentFlightBooking);
    //   }
    // }



  }


  checkMandatoryValues() {
    this.stopCreatingFlightFlag = true;
    if (this.outboundLyingListForm.get('flightKey').value !== null
      && this.outboundLyingListForm.get('date').value !== null && this.outboundLyingListForm.get('flightSegmentId').value !== null) {
      this.stopCreatingFlightFlag = false;
    } else {
      this.showErrorStatus('export.flight.details.not.provided');
    }
  }

  setMultipleShipmentAssignData() {
    this.assignToFlightData.forEach(element => {
      element['flightId'] = this.outboundLyingListForm.get('flightId').value;
      element['boardPoint'] = NgcUtility.getTenantConfiguration().airportCode
      element['offPoint'] = this.outboundLyingListForm.get('flightSegmentId').value;
      element['manual'] = true;
      element['flagInsert'] = 'Y';
      if (element.shc !== null && element.shc !== "") {
        element['shc'] = element.shc.trim();

        const shcList = element.shc.split(' ');
        // shcList[0] = shcList[0].trim();
        console.log(shcList.length);

        const shcListForBooking = new Array<BookingSHC>();
        if (shcList.length > 1) {
          // let tempNumber = 1;
          shcList.forEach(shc => {

            const bookingSHC = new BookingSHC();
            bookingSHC.specialHandlingCode = shc;
            shcListForBooking.push(bookingSHC);
            //   element['specialHandlingCode' + tempNumber] = shc;
            //   tempNumber += 1;
          });
          element['shcList'] = shcListForBooking;
        } else {
          element.shc = element.shc.trim();
          const bookingSHC = new BookingSHC();
          bookingSHC.specialHandlingCode = element.shc;
          shcListForBooking.push(bookingSHC);
          element['shcList'] = shcListForBooking;
        }
        console.log(element);
      }
      element.serviceFlag === "Y" ? element.serviceFlag = true : element.serviceFlag = false;
    });
  }


  addListAssignToFlight() {

    const notReadyToLoadData = [];
    this.assignToFlightData = [];
    this.updateFlightData = [];
    (<NgcFormArray>this.outboundLyingListForm.controls['outboundLyingList']).getRawValue().forEach(element => {

      if (element.checkBox === true) {
        element.flagCRUD = 'C';
        this.assignToFlightData.push(element);
      }
      /* Below code is commented as we are showing only those shipments which can be booked and not all
            if (element.checkBox === true && (element.bookingFlightInfo.trim() !== null && element.bookingFlightInfo.trim() !== '')) {
              alredyAssignedFlightData.push(element);
            }
      */
      // if (element.checkBox === true && element.bookingFlightInfo !== null) {
      //   this.updateFlightData.push(element);
      // }

      // if (element.checkBox === true) {
      //   this.assignToFlightData.push(element);
    });
    this.assignToFlightData.forEach(element => {
      if (element.readyToLoad === "0") {
        notReadyToLoadData.push(element);
      }

    });
    if (notReadyToLoadData.length > 0) {
      let awbnumbers = '';
      notReadyToLoadData.forEach(element => {
        awbnumbers = awbnumbers + ' ' + element.shipmentNumber;
      });
      this.showErrorStatus(NgcUtility.translateMessage("export.shipment.numbers.not.ready.to.load", [awbnumbers]));
      this.partShipmentFlag = true;
    } else {
      this.partShipmentFlag = false;
    }


  }

  checkPartShipment() {
    this.partShipmentFlag = false;
    this.assignToFlightData.forEach(element => {
      if (element.partShipment === 'P') {
        this.partShipmentFlag = true;
      }
    });
    if (this.partShipmentFlag) {
      this.showErrorStatus('export.shipment.part.booking.use.bss');
      this.partShipmentFlag = true;
    }

  }
  // sendRequestAddShipment(multipleShipmentFlightBooking) {
  //   this.exportService.addMultipleShipmentBookingList
  //     (multipleShipmentFlightBooking).subscribe(data => {
  //       this.refreshFormMessages(data);
  //       this.response = data.data;
  //       if (this.response !== null) {
  //         if (this.response.ruleEngineWarningAndInfoMessageListForLyingList && this.response.ruleEngineWarningAndInfoMessageListForLyingList.length > 0) {
  //           let message = "";
  //           this.response.ruleEngineWarningAndInfoMessageListForLyingList.forEach(t => {
  //             message = message + "\n" + t;
  //           });
  //           this.showConfirmMessage(message).then(fulfilled => {
  //             multipleShipmentFlightBooking.skipRuleEngineFlag = true;
  //             multipleShipmentFlightBooking.ruleEngineWarningAndInfoMessageListForLyingList = null;
  //             this.exportService.addMultipleShipmentBookingList
  //               (multipleShipmentFlightBooking).subscribe(data => {
  //                 this.refreshFormMessages(data);
  //                 this.response = data.data;
  //                 if (this.response !== null) {

  //                   this.showSuccessStatus('export.flight.assigned.successfully');
  //                   this.onSearch();
  //                   this.outboundLyingListForm.get('flightKey').reset();
  //                   this.outboundLyingListForm.get('date').reset();
  //                   this.closeRoutingInfoWindow();
  //                 }
  //               });
  //           }).catch(reason => {
  //             console.log('failed' + reason);
  //           });
  //         } else {
  //           this.showSuccessStatus('export.flight.assigned.successfully');
  //           this.onSearch();
  //           this.outboundLyingListForm.get('flightKey').reset();
  //           this.outboundLyingListForm.get('date').reset();
  //           this.closeRoutingInfoWindow();
  //         }
  //       }
  //     });

  // }

  bookSingleShipment() {

    this.addListAssignToFlight();
    this.checkPart();
    if (this.navigationFlag === true) {
      this.navigateTo(this.router, '/export/booksingleshipment',
        {
          shipmentNumber: this.assignToFlightData[0].shipmentNumber
        });
    }
  }

  checkPart() {
    let partShipmentCountFlag = true;
    this.navigationFlag = true;
    if (this.assignToFlightData.length > 1) {
      this.showErrorStatus('export.book.one.shipment.at.once');
      partShipmentCountFlag = false;
      this.navigationFlag = false;
    }

    if (partShipmentCountFlag === true) {
      this.assignToFlightData.forEach(element => {
        if (element.partShipment === null) {
          this.navigationFlag = false;
          this.showErrorStatus('export.book.part.shipment.from.book.single.shipment');
        }
      });
    }
  }

  showLocationData(event) {
    const rowId = event;
    this.outboundLyingListForm.get('displayShipmentNumber').patchValue(this.outboundLyingListData[rowId].shipmentNumber);
    this.outboundLyingListForm.get('inventoryList').patchValue(this.outboundLyingListData[rowId].inventoryList);
    this.inventoryWindow.open();
  }
  onPrint() {
    this.reportParameters = new Object();
    if (this.outboundLyingListForm.get('carrier').value) {
      this.reportParameters.carrier = this.outboundLyingListForm.get('carrier').value;
    }
    if (this.outboundLyingListForm.get('destination').value) {
      this.reportParameters.offpoint = this.outboundLyingListForm.get('destination').value;
    }
    if (this.outboundLyingListForm.get('bookingStatus').value) {
      this.reportParameters.bookingstatus = this.outboundLyingListForm.get('bookingStatus').value;
    }
    if (this.outboundLyingListForm.get('shipmentState').value) {
      this.reportParameters.shipmentstate = this.outboundLyingListForm.get('shipmentState').value;
    }
    if (this.outboundLyingListForm.get('shipmentType').value) {
      this.reportParameters.shipmenttype = this.outboundLyingListForm.get('shipmentType').value;
    }
    if (this.outboundLyingListForm.get('dwellTime').value) {
      this.reportParameters.dwellTime = this.outboundLyingListForm.get('dwellTime').value;
    }
    if (this.outboundLyingListForm.get('shipmentNumber').value) {
      this.reportParameters.shipmentNumber = this.outboundLyingListForm.get('shipmentNumber').value;
    }
    if (this.outboundLyingListForm.get('shcPriority').value) {
      this.reportParameters.shcPriority = this.outboundLyingListForm.get('shcPriority').value;
    }
    else {
      this.reportParameters.shcPriority = false;
    }
    this.reportParameters.tenantID = NgcUtility.getTenantConfiguration().airportCode;
    this.reportParameters.loggedInUser = this.getUserProfile().userShortName;
    this.reportParameters.userType = (<any>Environment).applicationId;

    this.Report.open();
  }


  openShipmentInfoPage(shipmentNumber, shipmentType) {
    var dataToSend = {
      shipmentNumber: shipmentNumber,
      shipmentType: shipmentType,
      carrier: this.outboundLyingListForm.get('carrier').value,
      destination: this.outboundLyingListForm.get('destination').value,
      bookingStatus: this.outboundLyingListForm.get('bookingStatus').value,
      shipmentState: this.outboundLyingListForm.get('shipmentState').value,
      dwellTime: this.outboundLyingListForm.get('dwellTime').value,
      shcPriority: this.outboundLyingListForm.get('shcPriority').value,
      searchShipmentNumber: this.outboundLyingListForm.get('shipmentNumber').value,
      searchShipmentType: this.outboundLyingListForm.get('shipmentType').value
    }
    this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', dataToSend);
  }

  onCancel() {
    this.navigateBack(this.forwardedData);
  }


  onPrintExcel() {
    this.reportParameters = new Object();
    if (this.outboundLyingListForm.get('carrier').value) {
      this.reportParameters.carrier = this.outboundLyingListForm.get('carrier').value;
    }
    if (this.outboundLyingListForm.get('destination').value) {
      this.reportParameters.offpoint = this.outboundLyingListForm.get('destination').value;
    }
    if (this.outboundLyingListForm.get('bookingStatus').value) {
      this.reportParameters.bookingstatus = this.outboundLyingListForm.get('bookingStatus').value;
    }
    if (this.outboundLyingListForm.get('shipmentState').value) {
      this.reportParameters.shipmentstate = this.outboundLyingListForm.get('shipmentState').value;
    }
    if (this.outboundLyingListForm.get('shipmentType').value) {
      this.reportParameters.shipmenttype = this.outboundLyingListForm.get('shipmentType').value;
    }
    if (this.outboundLyingListForm.get('dwellTime').value) {
      this.reportParameters.dwellTime = this.outboundLyingListForm.get('dwellTime').value;
    }
    if (this.outboundLyingListForm.get('shipmentNumber').value) {
      this.reportParameters.shipmentNumber = this.outboundLyingListForm.get('shipmentNumber').value;
    }
    if (this.outboundLyingListForm.get('shcPriority').value == 'true') {
      this.reportParameters.shcPriority = this.outboundLyingListForm.get('shcPriority').value;
    }
    else {
      this.reportParameters.shcPriority = 'false';
    }
    this.reportParameters.tenantID = NgcUtility.getTenantConfiguration().airportCode;
    this.reportParameters.loggedInUser = this.getUserProfile().userShortName;
    this.reportParameters.userType = (<any>Environment).applicationId;

    this.ReportExcel.downloadReport();
  }

  validateRouting() {
    this.nonMatchingRoutePresent = false;
    this.checkMandatoryValues();
    if (this.stopCreatingFlightFlag === false) {
      this.addListAssignToFlight();

      if (this.assignToFlightData.length > 0) {
        let matchingsno = 1;
        let nonmatchingsno = 1;
        const outboundLyingListDataWithMatchingRoute = [];
        const outboundLyingListDataWithNonMatchingRoute = [];
        const outboundLyingListDataWithNoRouteInfo = [];
        //Get CarrierCode from flight
        var flightKey = this.outboundLyingListForm.get('flightKey').value;
        var flightCarrier = flightKey.substring(0, 2);
        var lettersOnly = /^ [a - zA - Z] + $/;
        if (flightKey.length == 6) {
          // then carrier is of two char
          flightCarrier = flightKey.substring(0, 2);
        } else if (flightKey.length == 7) {
          // then check last char is alphabet
          flightKey.keyCode;
          if (flightKey.substring(flightKey.length - 1).match(lettersOnly)) {
            // then carrier is of two char
            flightCarrier = flightKey.substring(0, 2);
          } else {
            // carrier is of three char
            flightCarrier = flightKey.substring(0, 3);
          }
        } else if (flightKey.length() == 8) {
          // carrier is of three char
          flightCarrier = flightKey.substring(0, 3);
        }
        this.assignToFlightData.forEach(element => {
          var shipmentRoutingArray = element.shipmentRoutingInfo.split('-');
          if (element.shipmentRoutingInfo && shipmentRoutingArray.length == 2) {
            element['shipmentRoutingInfo'] = shipmentRoutingArray[1] + '-' + shipmentRoutingArray[0];
          }
          if (element['shipmentRoutingInfo'] === flightCarrier + "-" + this.outboundLyingListForm.get('flightSegmentId').value) {
            element['checkBox'] = true;
            // element.get('checkBox').disable();
            element['sno'] = matchingsno++;
            element['shipmentRoutingInfo'] = NgcUtility.getTenantConfiguration().airportCode + "-" + element['shipmentRoutingInfo'];
            outboundLyingListDataWithMatchingRoute.push(element);

          } else {
            element['checkBox'] = false;
            element['shipmentRoutingInfo'] = NgcUtility.getTenantConfiguration().airportCode + "-" + element['shipmentRoutingInfo'];
            //Do not Consider shipments without routing info for validation
            if (element.shipmentRoutingInfo != null) {
              outboundLyingListDataWithNonMatchingRoute.push(element);
              this.outboundLyingListForm.get('flightAndSegmentForPopup').setValue(this.outboundLyingListForm.get('flightKey').value + '-' + NgcUtility.getTenantConfiguration().airportCode + '-' + this.outboundLyingListForm.get('flightSegmentId').value)
              this.nonMatchingRoutePresent = true;
              element['sno'] = nonmatchingsno++;
            } else {
              outboundLyingListDataWithNoRouteInfo.push(element);
            }
            // outboundLyingListDataWithNonMatchingRoute.push(element);
          }

        });
        if (this.nonMatchingRoutePresent) {
          this.outboundLyingListForm.controls['outboundLyingListWithMatchingRoute'].patchValue(outboundLyingListDataWithMatchingRoute);
          this.outboundLyingListForm.controls['outboundLyingListWithNonMatchingRoute'].patchValue(outboundLyingListDataWithNonMatchingRoute);
          this.outboundLyingListForm.controls['outboundLyingListWithNoRouteInfo'].patchValue(outboundLyingListDataWithNoRouteInfo);
        } else {
          this.assignToFlight()
        }
        if (this.nonMatchingRoutePresent) {
          this.routingInfoWindow.open();
        }
      }
    }
  }

  addListAssignToFlightWithRoutes() {

    const notReadyToLoadData = [];
    this.assignToFlightData = [];
    this.updateFlightData = [];
    (<NgcFormArray>this.outboundLyingListForm.controls['outboundLyingListWithRoutes']).getRawValue().forEach(element => {

      if (element.checkBox) {
        element.flagCRUD = 'C';
        this.assignToFlightData.push(element);
      }
    });
    this.assignToFlightData.forEach(element => {
      if (element.readyToLoad === "0") {
        notReadyToLoadData.push(element);
      }

    });
    if (notReadyToLoadData.length > 0) {
      let awbnumbers = '';
      notReadyToLoadData.forEach(element => {
        awbnumbers = awbnumbers + ' ' + element.shipmentNumber;
      });

      this.showErrorStatus(NgcUtility.translateMessage("export.shipment.numbers.not.ready.to.load", [awbnumbers]));
      this.partShipmentFlag = true;
    } else {
      this.partShipmentFlag = false;
    }

  }

  closeRoutingInfoWindow() {
    this.routingInfoWindow.close();
  }


  onFlightdetailsChange(index) {
    this.getFlightId();

    var parameters = { 'parameter1': this.outboundLyingListForm.get('flightKey').value, 'parameter2': this.outboundLyingListForm.get('date').value };
    this.outboundLyingListForm.get('flightSegmentId').setValue(null);

    var shipmentDestination = this.outboundLyingListForm.get('destination').value;
    this.retrieveDropDownListRecords('FLIGHTSEGMENT', 'query', parameters)
      .subscribe(response => {

        if (response.length == 1 && (shipmentDestination === null || shipmentDestination === '')) {
          response.forEach(value => {
            this.outboundLyingListForm.get('flightSegmentId').setValue(value.desc);
          });
        } else {
          response.forEach(value => {
            if (shipmentDestination !== null && shipmentDestination !== '') {
              if (value.desc.includes(shipmentDestination)) {
                this.outboundLyingListForm.get('flightSegmentId').setValue(value.desc);
              }
            }
          });
        }
      })
  }
}

