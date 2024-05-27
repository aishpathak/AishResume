import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, CellsRendererStyle,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration
} from 'ngc-framework';
import { ExportService } from './../export.service';
import {
  SearchFLightShipment, BookingDimnesion, BookingFlightEdit, BookCancelShipment,
  BookMultipleShipmentSearch, BookMultipleShipmentsFlight, Dimention, DimensionModel, DimensionDetails
} from './../export.sharedmodel';

@Component({
  selector: 'app-cancel-booked-shipment',
  templateUrl: './cancel-booked-shipment.component.html',
  styleUrls: ['./cancel-booked-shipment.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  restorePageOnBack: true,
  focusToMandatory: true
})

export class CancelBookedShipmentComponent extends NgcPage {
  @ViewChild("reBookWindow") reBookWindow: NgcWindowComponent;
  @ViewChild('routingInfoWindow') routingInfoWindow: NgcWindowComponent;
  // bug-318 fix
  cancelRebookButton = true;
  //bug-318 fix END
  searchButtonClicked = false;
  editItemRowId: number;
  columnName: any;
  popupRecord: any;
  displayAddRowFlag = true;
  sourceIdSegmentDropdown: any;
  titleAddEditShipment: String;
  response: any;
  flagInsert: string;
  flagUpdate: string;
  searchResultForList: any;
  bookingID: number;
  flightBookingID: number;
  flightDimention: any;
  editShipmentRecord: any;
  commonDisabledFlag = false;
  showShipperLOV: boolean;
  removeShipment = true;
  sourceIdSegmentDropdownForSearchFlight: any;
  oldSegmentValue = true;
  nonMatchingRoutePresent = false;
  // dimenionSubscription: Subscription;

  flightIdforDropdown: any;

  defaultValuesAddShipment = {
    temporaryDeleteCheckBox: false,
    dropDownVal: '',
    bookingID: '',
    shipmentNumber: '',
    origin: '',
    destination: '',
    boardPoint: '',
    offPoint: '',
    pieces: '',
    grossWeight: '',
    weightUnitCode: '',
    densityGroupCode: '',
    volumeWeight: null,
    volumeUnitCode: '',
    natureOfGoodsDescription: '',
    serviceFlag: false,
    blockSpace: false,
    manual: true,
    shipperCustomerID: '',
    shcList: [],
    flagInsert: 'Y',
    flagUpdate: 'N',
    totalPieces: ''
  };
  manualBookingFlag = true;
  FBLBookingFlag = true;
  multipleShipmentFlightBooking = new BookMultipleShipmentsFlight();
  cancelShipmentSearch = new BookMultipleShipmentSearch();
  flightShipmentDetailRq = new SearchFLightShipment();
  dataList = [];
  mesurementData = ["CMT", "INH"];
  transferData: any;
  flightDepartedFlag: boolean = false;


  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private exportService: ExportService,
    private route: ActivatedRoute,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.transferData = this.getNavigateData(this.route);
    try {
      if (this.transferData !== null && this.transferData !== undefined) {
        this.form.patchValue(this.transferData);
        this.searchBookingList();
      }
    } catch (e) { }
  }

  private form: NgcFormGroup = new NgcFormGroup({
    bookingCancellationReason: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    flightID: new NgcFormControl(),
    segment: new NgcFormControl(),
    weightUnitCode: new NgcFormControl(),
    volumeUnitCode: new NgcFormControl(),
    totalShipment: new NgcFormControl(),
    totalPieces: new NgcFormControl(),
    totalWeight: new NgcFormControl(),
    volumeWeight: new NgcFormControl(),
    flightShipmentList: new NgcFormArray(
      [
      ]),
    flightShipmentListWithRoutingInfo: new NgcFormArray(
      [
      ]),
    flightShipmentListWithMatchingRoute: new NgcFormArray(
      [
      ]),
    flightShipmentListWithNonMatchingRoute: new NgcFormArray(
      [
      ]),
    flightShipmentListWithNoRouteInfo: new NgcFormArray(
      [
      ]),
    MultipleShipmentBooking: new NgcFormArray(
      [
      ]),
    workingListRemarks: new NgcFormControl(),
    manifestRemarks: new NgcFormControl(),
    additionalRemarks: new NgcFormControl(),
    dimensionList: new NgcFormArray([
    ]),
    totalDimentionPieces: new NgcFormControl(),
    totalDimentionVolume: new NgcFormControl(),
    totalDimentionVolumetricWeight: new NgcFormControl(),
    shipmentUnitCode: new NgcFormControl(),
    densityGroupCode: new NgcFormControl(),
    volume: new NgcFormControl(),
    flightAndSegmentForPopup: new NgcFormControl(),

  });

  private reBookForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    date: new NgcFormControl(),
    flightID: new NgcFormControl(),
    flightBoardPoint: new NgcFormControl(),
    flightOffPoint: new NgcFormControl(),
    bookingStatusCode: new NgcFormControl(),
    dateSTA: new NgcFormControl(),
    dateSTD: new NgcFormControl(),
    volumeWeight: new NgcFormControl(),
    flightSegmentId: new NgcFormControl()
  })

  searchBookingList() {
    this.fetchAndPopulateDataList();
    this.form.get('bookingCancellationReason').setValue('');
    this.reBookForm.reset();
  }

  fetchAndPopulateDataList() {
    this.cancelShipmentSearch.flightKey = this.form.get('flightKey').value;
    this.cancelShipmentSearch.flightDate = this.form.get('flightDate').value;
    if (this.form.get('flightDate').value) {
      this.oldSegmentValue = this.form.get('segment').value;
      this.cancelShipmentSearch.flightOffPoint = this.form.get('segment').value;
    }
    this.sourceIdSegmentDropdownForSearchFlight = this.createSourceParameter(
      this.form.get("flightKey").value
    );
    this.exportService.getCancelBookedShipmentList(this.cancelShipmentSearch).subscribe(response => {
      this.refreshFormMessages(response);

      this.searchResultForList = response.data;
      if (this.searchResultForList !== null) {
        this.flightDepartedFlag = this.searchResultForList.isFLightDeparted;
        this.searchResultForList['flightDate'] = this.form.get('flightDate').value;
        const dupOffpointMap: any = {};
        let offPointGroupIndex = 1;
        //for serial number
        let count = 0;
        this.searchResultForList.flightShipmentList.forEach(element => {
          if (element.flightBookingID === 0) {
            element.cancelationCheckBox = ' ';
            element.bookingPieces = 'NIL';
            element.bookingWeight = ' ';
            element.edit = 'empty';
            element.dimension = 'empty';
          } else {
            element.cancelationCheckBox = false;
            element.edit = ' ';
            element.dimension = ' ';
          }
          element.sno = ++count;
          if (!dupOffpointMap[element.offPoint]) {
            dupOffpointMap[element.offPoint] = offPointGroupIndex++;
          }
          if (element.partSuffix && element.partSuffix.startsWith("OAL")) {
            element.partSuffixToShowInUi = null;
          } else {
            element.partSuffixToShowInUi = element.partSuffix;
          }
          element.offPointGroup = dupOffpointMap[element.offPoint];
        });
        this.form.patchValue(this.searchResultForList);
        this.form.get('segment').setValue(this.oldSegmentValue)
        this.searchButtonClicked = true;
      } else {
        this.searchButtonClicked = false;
      }
    });
  }

  public checkBoxCellStyleRender = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    console.log(typeof value);
    console.log(rowData);
    // console.log(cellsStyle.data);
    if (rowData.flightBookingID === 0 || rowData.flightBookingID === '0') {
      cellsStyle.data = ' ';
      cellsStyle.allowEdit = false;
    }
    return cellsStyle;
  }

  public groupsRenderer(value: string |
    number, rowData: any, level: any): string {
    return rowData.data.boardPoint + ' - ' + rowData.data.offPoint;
  }


  cancelSelectedShipmentRecords() {
    //bug-318 fix
    if ((this.reBookForm.get('date').value === null && this.reBookForm.get('flightKey').value === null) || (this.reBookForm.get('date').value === 0 && this.reBookForm.get('flightKey').value === 0)) {
      if (!this.form.get('bookingCancellationReason').value || this.form.get('bookingCancellationReason').value.length === 0) {
        this.showErrorStatus('export.reason.for.cancellation.required');
        return;
      }
      const cancelShipmentList = new Array<any>();
      (<NgcFormArray>this.form.controls['flightShipmentList']).getRawValue().forEach(element => {
        if (element.cancelationCheckBox === true) {
          element['bookingCancellationFlag'] = true;
          element['bookingCancellationReasonCode'] = this.form.controls.bookingCancellationReason.value;
          element['bookingCancellationUserCode'] = 'SYSADMIN';
          cancelShipmentList.push(element);
        }
      });

      const cancelRequest = new BookCancelShipment();
      cancelRequest.flightID = this.form.get('flightID').value;
      cancelRequest.flightDate = this.form.get('flightDate').value;
      cancelRequest.flightKey = this.form.get('flightKey').value;
      cancelRequest.flightShipmentList = cancelShipmentList;
      this.exportService.cancelBookedShipment(cancelRequest).subscribe(resp => {
        this.refreshFormMessages(resp);

        if (resp.success) {
          this.showSuccessStatus('g.completed.successfully');
          this.searchBookingList();
          return;
        }
        const responseaftercancellation = resp.data;
        responseaftercancellation['flightDate'] = this.form.get('flightDate').value;

        responseaftercancellation.flightShipmentList.forEach(element => {
          if (element.flightBookingID === 0) {
            element.cancelationCheckBox = '  ';
            element.bookingPieces = 'NIL';
            element.bookingWeight = ' ';
            element.edit = 'empty';
            element.dimension = 'empty';
          } else {
            element.cancelationCheckBox = false;
            element.edit = ' ';
            element.dimension = ' ';
          }
        });
        this.form.patchValue(responseaftercancellation);
        // this.disableCancelledShipments();
      });
    }
    else {
      this.showErrorStatus('choose.rbk.btn');
    }
    //bug-318 fix end
  }


  changeButtonFlag(event) {
    if (event.type !== 'check') {
      return;
    }
    const shipmentList: NgcFormArray = (<NgcFormArray>this.form.get('flightShipmentList'));
    //
    if (shipmentList && shipmentList.length > 0) {
      try {
        shipmentList.controls.forEach((formGroup: NgcFormGroup) => {
          const cancelFlag: boolean = formGroup.get('bookingCancellationFlag').value;
          const selectFlag: boolean = formGroup.get('cancelationCheckBox').value;
          //
          if (cancelFlag === false && selectFlag === true) {
            // Enable
            //bug-318 fix
            this.cancelRebookButton = false;
            throw new Error('export.record.found');
          }
        });
        // Disable
        this.cancelRebookButton = true;
        //bug-318 fix END
      } catch (e) {
      }
    }
  }

  rebookShipment() {
    if (!this.getUserProfile().terminalId) {
      this.showErrorStatus(
        "export.select.terminal"
      );
      return;
    }
    if (this.nonMatchingRoutePresent) {
      const flightShipmentListWithRoutingInfo = [];
      let isShipmentSelected = false;
      if (this.reBookForm.get('flightSegmentId').value) {
        (<NgcFormArray>this.form.controls['flightShipmentListWithMatchingRoute']).getRawValue().forEach(element1 => {
          // console.log(element1.checkBox);
          if (element1.checkBox) {
            (<NgcFormArray>this.form.controls['flightShipmentList']).getRawValue().forEach(element2 => {
              if ((element2.shipmentNumber === element1.shipmentNumber) && (element2.partSuffix === element1.partSuffix)) {
                flightShipmentListWithRoutingInfo.push(element2);
                isShipmentSelected = true;
              }
            });
          }
        });

        (<NgcFormArray>this.form.controls['flightShipmentListWithNonMatchingRoute']).getRawValue().forEach(element => {
          if (element.checkBox) {
            (<NgcFormArray>this.form.controls['flightShipmentList']).getRawValue().forEach(element1 => {
              if ((element1.shipmentNumber === element.shipmentNumber) && (element1.partSuffix === element.partSuffix)) {
                flightShipmentListWithRoutingInfo.push(element1);
                isShipmentSelected = true;
              }
            });
          }
        });
        (<NgcFormArray>this.form.controls['flightShipmentListWithNoRouteInfo']).getRawValue().forEach(element => {
          (<NgcFormArray>this.form.controls['flightShipmentList']).getRawValue().forEach(element1 => {
            if ((element1.shipmentNumber === element.shipmentNumber) && (element1.partSuffix === element.partSuffix)) {
              flightShipmentListWithRoutingInfo.push(element1);
              isShipmentSelected = true;
            }
          });
        });
        if (!isShipmentSelected) {
          this.showErrorMessage("export.select.shipments.to.proceed");
          return;
        }
        (<NgcFormArray>this.form.controls['flightShipmentList']).patchValue(flightShipmentListWithRoutingInfo);
      }
    }
    const cancelShipmentList = new Array<any>();
    (<NgcFormArray>this.form.controls['flightShipmentList']).getRawValue().forEach(element => {
      if (element.cancelationCheckBox === true) {
        element['bookingCancellationFlag'] = true;
        element['bookingCancellationReasonCode'] = this.form.controls.bookingCancellationReason.value;
        element['bookingCancellationUserCode'] = 'SYSADMIN';
        cancelShipmentList.push(element);
      }
    });

    const cancelRequest = new BookCancelShipment();
    cancelRequest.flightID = this.form.get('flightID').value;
    cancelRequest.flightDate = this.form.get('flightDate').value;
    cancelRequest.flightKey = this.form.get('flightKey').value;

    cancelRequest.newFlightDate = this.reBookForm.get('date').value;
    cancelRequest.newFlightKey = this.reBookForm.get('flightKey').value;
    cancelRequest.flightOffPoint = this.reBookForm.get('flightSegmentId').value;
    cancelRequest.flightBoardPoint = NgcUtility.getTenantConfiguration().airportCode;
    //cancelRequest.flightOffPoint = this.reBookForm.get('flightOffPoint').value;
    cancelRequest.flightShipmentList = cancelShipmentList;
    if (cancelRequest.newFlightKey) {
      if (!cancelRequest.flightOffPoint) {
        this.showErrorStatus('export.check.flight.details');
        return;
      }
    }
    if (cancelRequest.flightOffPoint) {
      cancelRequest.cancelRebookFlag = true;
    } else {
      if (!this.form.get('bookingCancellationReason').value || this.form.get('bookingCancellationReason').value.length === 0) {
        this.showErrorStatus('export.reason.for.cancellation.required');
        return;
      }
      // bug-318 fix 
      if (this.reBookForm.get('date').value === null && this.reBookForm.get('flightKey').value === null) {
        this.showErrorStatus('exp.shi.flight.mandatory');
        return;
      }// bug-318 fix end
    }
    cancelRequest.skipRuleEngineFlag = false;
    this.exportService.reBookShipments(cancelRequest).subscribe(resp => {
      this.refreshFormMessages(resp);

      if (resp.success) {
        this.showSuccessStatus('g.completed.successfully');
        this.reBookForm.reset();
        this.searchBookingList();
        return;
      }
      const responseaftercancellation = resp.data;
      responseaftercancellation['flightDate'] = this.form.get('flightDate').value;

      // responseaftercancellation.flightShipmentList.forEach(element => {
      //   if (element.flightBookingID === 0) {
      //     element.cancelationCheckBox = '  ';
      //     element.bookingPieces = 'NIL';
      //     element.bookingWeight = ' ';
      //     element.edit = 'empty';
      //     element.dimension = 'empty';
      //   } else {
      //     element.cancelationCheckBox = false;
      //     element.edit = ' ';
      //     element.dimension = ' ';
      //   }
      // });
      if (responseaftercancellation.ruleEngineWarningAndInfoMessage) {
        this.showConfirmMessage(responseaftercancellation.ruleEngineWarningAndInfoMessage).then(fulfilled => {
          cancelRequest.ruleEngineWarningAndInfoMessage = null;
          cancelRequest.skipRuleEngineFlag = true;

          this.exportService.reBookShipments(cancelRequest).subscribe(resp => {
            this.refreshFormMessages(resp);
            this.response = resp.data;
            if (this.response !== null) {
              if (resp.success) {
                this.showSuccessStatus('g.completed.successfully');
                this.reBookForm.reset();
                this.searchBookingList();
                return;
              }
              this.response['flightDate'] = this.form.get('flightDate').value;
              // this.form.patchValue(this.response);
            }
          });

        }).catch(reason => {
          console.log('failed' + reason);
        });
      } else if (responseaftercancellation.handoverShipment) {
        this.showConfirmMessage(NgcUtility.translateMessage('confirmation.handover.for.shipment', [resp.data.handoverShipment])).then(fulfilled => {
          // cancelRequest.handoverShipment = null;
          cancelRequest.skipHandoverFlag = true;

          this.exportService.reBookShipments(cancelRequest).subscribe(resp => {
            this.refreshFormMessages(resp);
            this.response = resp.data;
            if (this.response !== null) {
              if (resp.success) {
                this.showSuccessStatus('g.completed.successfully');
                this.reBookForm.reset();
                this.searchBookingList();
                return;
              }
              this.response['flightDate'] = this.form.get('flightDate').value;
              // this.form.patchValue(this.response);
            }
          });

        }).catch(reason => {
          console.log('failed' + reason);
        });
      }
      if (!responseaftercancellation.handoverShipment) {
        this.form.patchValue(responseaftercancellation);
      }
      // this.disableCancelledShipments();
    });
    if (this.nonMatchingRoutePresent) {
      this.closeRoutingInfoWindow();
    }
  }

  public fetchSegment(event) {
    this.reBookForm.get('flightSegmentId').setValue(null);
  }

  public fetchSegmentForSearchFlight(event) {
    this.sourceIdSegmentDropdownForSearchFlight =
      this.createSourceParameter(this.form.get('flightKey').value,
        this.form.get('flightDate').value);
  }
  public onOffPointSelect() {
    this.reBookForm.get('bookingStatusCode').setValue('SS');
    const flightObj = {
      flightKey: this.reBookForm.get('flightKey').value,
      flagInsert: 'N',
      //bookingPieces: shipmentRecord.get('bookingPieces').value,
      //bookingWeight: shipmentRecord.get('bookingWeight').value,
      flightId: null,
      flightSegmentId: null,
      flightOriginDate: this.reBookForm.get('flightOriginDate').value,
      // flightBoardPoint: this.reBookForm.get('flightBoardPoint').value,
      // flightOffPoint: this.reBookForm.get('flightOffPoint').value,
      bookingStatusCode: this.reBookForm.get('bookingStatusCode').value,
      // bookingStatusCode: shipmentRecord.get('bookingStatusCode').value,
      // dateSTA: shipmentRecord.get('dateSTA').value,
      // dateSTD: shipmentRecord.get('dateSTD').value,
      shcList: [],
      bookingCancellationFlag: 0,
      densityGroupCode: null,
      volume: 0.0,
      flagUpdate: 'N',
      volumeUnitCode: '',
      totalDimentionVolumetricWeight: 0.0,
      isFLightDeparted: false
    };


    this.exportService.getSegmentTime(flightObj).subscribe((resp) => {
      if (!NgcUtility.isTenantAirport(this.reBookForm.get('flightBoardPoint').value)) {
        this.showErrorStatus("export.check.flight.details");
        return;
      }
      if (resp.data) {
        const res = resp.data;
        this.reBookForm.get('dateSTD').setValue(res.dateSTD);
        this.reBookForm.get('dateSTA').setValue(res.dateSTA);
      }
    });
  }

  refreshthesegment(event) {
    this.reBookForm.get('flightSegmentId').setValue(null);
  }
  refreshthesegmentForSearchFlight(event) {
    this.form.get('segment').setValue(null);
    this.form.get('flightDate').setValue(null);
  }

  onCancel() {
    this.navigateBack(this.transferData);
  }

  onSelectAll() {
    this.showConfirmMessage(
      "Do you want to Select All Shipments to Perform 'Cancel / Rebook Shipments' ?"
    )
      .then(fulfilled => {
        const shipmentList = new Array<any>();
        (<NgcFormArray>this.form.controls['flightShipmentList']).getRawValue().forEach(element => {
          element['cancelationCheckBox'] = true;
          shipmentList.push(element);
        });
        // Enable
        //bug-318 fix
        this.cancelRebookButton = false;
        //bug-318 fix END
        this.form.controls['flightShipmentList'].patchValue(shipmentList);
      })
      .catch(reason => { });



  }


  validateRoute() {
    if (!this.getUserProfile().terminalId) {
      this.showErrorStatus(
        "export.select.terminal"
      );
      return;
    }
    this.nonMatchingRoutePresent = false;
    const cancelShipmentList = new Array<any>();
    (<NgcFormArray>this.form.controls['flightShipmentList']).getRawValue().forEach(element => {
      if (element.cancelationCheckBox === true) {
        element['bookingCancellationFlag'] = true;
        element['bookingCancellationReasonCode'] = this.form.controls.bookingCancellationReason.value;
        element['bookingCancellationUserCode'] = 'SYSADMIN';
        cancelShipmentList.push(element);
      }
    });

    const cancelRequest = new BookCancelShipment();
    cancelRequest.flightID = this.form.get('flightID').value;
    cancelRequest.flightDate = this.form.get('flightDate').value;
    cancelRequest.flightKey = this.form.get('flightKey').value;

    cancelRequest.newFlightDate = this.reBookForm.get('date').value;
    cancelRequest.newFlightKey = this.reBookForm.get('flightKey').value;
    cancelRequest.flightOffPoint = this.reBookForm.get('flightSegmentId').value;
    cancelRequest.flightBoardPoint = NgcUtility.getTenantConfiguration().airportCode;
    //cancelRequest.flightOffPoint = this.reBookForm.get('flightOffPoint').value;
    cancelRequest.flightShipmentList = cancelShipmentList;
    if (cancelRequest.newFlightKey) {
      if (!cancelRequest.flightOffPoint) {
        this.showErrorStatus('export.check.flight.details');
        return;
      }
    }
    if (cancelRequest.flightOffPoint) {
      cancelRequest.cancelRebookFlag = true;
    } else {
      if (!this.form.get('bookingCancellationReason').value || this.form.get('bookingCancellationReason').value.length === 0) {
        this.showErrorStatus('export.reason.for.cancellation.required');
        return;
      }
    }
    cancelRequest.skipRuleEngineFlag = false;
    if (cancelRequest.cancelRebookFlag) {
      this.exportService.validateRouteForReBooking(cancelRequest).subscribe(resp => {

        this.refreshFormMessages(resp);
        this.response = resp.data;
        let sno = 1;
        let nonMatchingsno = 1;
        const shipmentWithMatchingRoute = [];
        const shipmentWithNonMatchingRoute = [];
        const flightShipmentListWithNoRouteInfo = [];
        const shipmentWithRoutingInfo = this.response.flightShipmentList;
        if (this.response !== null) {

          for (const eachRow of shipmentWithRoutingInfo) {
            if (eachRow.routeMatches) {
              eachRow['checkBox'] = true;
              eachRow['sno'] = sno++;
              shipmentWithMatchingRoute.push(eachRow);
            } else {
              eachRow['checkBox'] = false;

              //Do not Consider shipments without routing info for validation
              if (eachRow.shipmentRoutingInfo != null) {
                shipmentWithNonMatchingRoute.push(eachRow);
                eachRow['sno'] = nonMatchingsno++;
                this.nonMatchingRoutePresent = true;
              } else {
                flightShipmentListWithNoRouteInfo.push(eachRow);
              }
            }
          }
          if (this.nonMatchingRoutePresent) {
            this.form.get(['flightShipmentListWithMatchingRoute']).patchValue(shipmentWithMatchingRoute);
            this.form.get(['flightShipmentListWithNonMatchingRoute']).patchValue(shipmentWithNonMatchingRoute);
            this.form.get(['flightShipmentListWithNoRouteInfo']).patchValue(flightShipmentListWithNoRouteInfo);
            // console.log(shipmentWithNonMatchingRoute);
          }
        }
        if (this.nonMatchingRoutePresent) {
          this.form.get('flightAndSegmentForPopup').setValue(this.reBookForm.get('flightKey').value + '-' + NgcUtility.getTenantConfiguration().airportCode + '-' + this.reBookForm.get('flightSegmentId').value)
          this.routingInfoWindow.open();
        } else {
          this.rebookShipment();
        }
      });

    } else {
      this.rebookShipment();
    }

  }

  targetToCancel() {
    if ((this.reBookForm.get('date').value === null && this.reBookForm.get('flightKey').value === null) || (this.reBookForm.get('date').value === 0 && this.reBookForm.get('flightKey').value === 0)) {
      if (!this.form.get('bookingCancellationReason').value || this.form.get('bookingCancellationReason').value.length === 0) {
        this.showErrorStatus('export.reason.for.cancellation.required');
        return;
      }
      const cancelShipmentList = new Array<any>();
      (<NgcFormArray>this.form.controls['flightShipmentList']).getRawValue().forEach(element => {
        if (element.cancelationCheckBox === true) {
          element['bookingCancellationFlag'] = true;
          element['bookingCancellationReasonCode'] = this.form.controls.bookingCancellationReason.value;
          element['bookingCancellationUserCode'] = 'SYSADMIN';
          cancelShipmentList.push(element);
        }
      });

      const cancelRequest = new BookCancelShipment();
      cancelRequest.flightID = this.form.get('flightID').value;
      cancelRequest.flightDate = this.form.get('flightDate').value;
      cancelRequest.flightKey = this.form.get('flightKey').value;
      cancelRequest.flightShipmentList = cancelShipmentList;
      this.exportService.targetCancel(cancelRequest).subscribe(resp => {
        this.refreshFormMessages(resp);

        if (resp.success) {
          this.showSuccessStatus('g.completed.successfully');
          this.searchBookingList();
          return;
        }
        const responseaftercancellation = resp.data;
        responseaftercancellation['flightDate'] = this.form.get('flightDate').value;
        this.form.patchValue(responseaftercancellation);
        // this.disableCancelledShipments();
      });
    }
    else {
      this.showErrorStatus('choose.rbk.btn');
    }
  }

  closeRoutingInfoWindow() {
    this.routingInfoWindow.close();
  }
}
