import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SearchFLightShipment, BookingDimnesion, BookingFlightEdit, BookCancelShipment,
  BookMultipleShipmentSearch, BookMultipleShipmentsFlight, Dimention, DimensionModel, DimensionDetails
} from './../export.sharedmodel';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, CellsRendererStyle,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration
} from 'ngc-framework';


import { ExportService } from './../export.service';
import { ApplicationFeatures } from '../../common/applicationfeatures';
/**
 * This component is used to book multiple shipments
 * for a particular flight
 * @export
 * @class BookMultipleShipmentComponent
 * @extends {NgcPage}
 * @implements {OnInit}
 */
@Component({
  selector: 'ngc-book-multiple-shipment',
  templateUrl: './book-multiple-shipment.component.html',
  styleUrls: ['./book-multiple-shipment.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: false,
  focusToMandatory: true
})
export class BookMultipleShipmentComponent extends NgcPage {

  @ViewChild('insertionWindow') insertionWindow: NgcWindowComponent;
  @ViewChild('dimensionWindow') dimensionWindow: NgcWindowComponent;
  @ViewChild('segmentDropDown') segmentDropDown: NgcDropDownComponent;
  cancelButton = true;
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
  dimenstionDeleteButton: boolean = true;

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
    volumeUnitCode: 'MC',
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
  multipleShipmentSearch = new BookMultipleShipmentSearch();
  flightShipmentDetailRq = new SearchFLightShipment();
  dataList = [];
  mesurementData = ["CMT", "INH"];
  transferData: any;
  flightDepartedFlag: boolean = false;
  skipFlightPopUp: boolean = false;

  private MultipleShipmentForm: NgcFormGroup = new NgcFormGroup({
    bookingCancellationReason: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    flightID: new NgcFormControl(),
    weightUnitCode: new NgcFormControl('K'),
    volumeUnitCode: new NgcFormControl(),
    totalShipment: new NgcFormControl(),
    totalPieces: new NgcFormControl(),
    totalWeight: new NgcFormControl(),
    volumeWeight: new NgcFormControl(),
    flightShipmentList: new NgcFormArray(
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
    awbDimensionList: new NgcFormArray([
    ]),
    totalDimentionPieces: new NgcFormControl(),
    totalDimentionVolume: new NgcFormControl(),
    totalDimentionVolumetricWeight: new NgcFormControl(),
    shipmentUnitCode: new NgcFormControl('CMT'),
    densityGroupCode: new NgcFormControl(),
    volume: new NgcFormControl(),
  });
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private exportService: ExportService,
    private route: ActivatedRoute,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }
  /**
   * Initialize default values of volume code
   * and weight code on initialization
   * @memberof BookMultipleShipmentComponent
   */
  ngOnInit() {
    this.transferData = this.getNavigateData(this.route);
    try {
      if (this.transferData !== null && this.transferData !== undefined) {
        this.MultipleShipmentForm.patchValue(this.transferData);
        this.skipFlightPopUp = true;
        this.searchBookingList();

      }
    } catch (e) { }
    this.MultipleShipmentForm.controls.weightUnitCode.setValue('K');
    this.MultipleShipmentForm.controls.volumeUnitCode.setValue('MC');
  }
  /**
   * Performs primilary actions
   * before opening insertion window
   * @memberof BookMultipleShipmentComponent
   */
  addMultipleShipments() {
    if (!this.MultipleShipmentForm.get('weightUnitCode').value) {
      this.showFormControlErrorMessage(<NgcFormControl>(this.MultipleShipmentForm.get('weightUnitCode')), 'export.weight.code.mandatory');
      return;
    }
    this.titleAddEditShipment = 'export.book.addShipment';
    this.displayAddRowFlag = true;
    this.removeShipment = true;
    this.commonDisabledFlag = false;
    this.manualBookingFlag = false;
    this.showShipperLOV = false;
    this.flagInsert = 'Y';
    this.exportService.dataToInsertOrUpdateBMS = { insert: this.flagInsert, update: this.flagUpdate, titleAddEditShipment: this.titleAddEditShipment };
    this.sourceIdSegmentDropdown = this.createSourceParameter(this.MultipleShipmentForm.get('flightID').value);
    (<NgcFormArray>this.MultipleShipmentForm.
      controls['MultipleShipmentBooking']).
      patchValue([this.defaultValuesAddShipment]);
    this.navigateTo(this.router, '/export/bookmultipleshipment/bookMultipleShipmentMaintain', this.MultipleShipmentForm.getRawValue());
    // this.insertionWindow.open();
  }


  searchBookingList() {
    this.setSearchRequest();
    this.fetchAndPopulateDataList();
    this.MultipleShipmentForm.get('bookingCancellationReason').setValue('');
  }

  setSearchRequest() {
    this.multipleShipmentSearch.flightKey = this.MultipleShipmentForm.controls.flightKey.value;
    this.multipleShipmentSearch.flightDate = this.MultipleShipmentForm.controls.flightDate.value;
    // this.MultipleShipmentForm.reset();
  }

  fetchAndPopulateDataList() {
    this.exportService.getMultipleShipmentBookingList(this.multipleShipmentSearch).subscribe(response => {
      this.refreshFormMessages(response);

      this.searchResultForList = response.data;
      if (this.searchResultForList != null && this.searchResultForList.flightShipmentList != null && this.searchResultForList.flightShipmentList.length > 0) {
        this.searchResultForList.flightShipmentList.forEach(element => {
          if (element.natureOfGoodsDescription != null) {
            const NOG: String = element.natureOfGoodsDescription;
            element.natureOfGoodsDescription = NOG.toUpperCase();
          }
        });
      }
      if (response.data.handlinginSystem && !this.skipFlightPopUp) {
        this.showConfirmMessage('g.flight.not.handled.confirmation').then(reason => {
          this.successResponse(response);
        }).catch(reason => {
          this.searchButtonClicked = false;
        });
      }
      else if (this.searchResultForList !== null) {
        this.flightDepartedFlag = this.searchResultForList.isFLightDeparted;
        this.searchResultForList['flightDate'] = this.MultipleShipmentForm.get('flightDate').value;
        const dupOffpointMap: any = {};
        let offPointGroupIndex = 1;
        //for serial number
        let count = 0;
        this.searchResultForList.flightShipmentList.forEach(element => {
          if (element.flightBookingID === 0 && !element.fromBookingDelta) {
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
          element.offPointGroup = dupOffpointMap[element.offPoint];

        });
        this.MultipleShipmentForm.patchValue(this.searchResultForList);

        this.disableCancelledShipments();
        this.searchButtonClicked = true;
      }

      else {
        this.searchButtonClicked = false;
      }
    });
  }
  successResponse(response) {
    this.flightDepartedFlag = this.searchResultForList.isFLightDeparted;
    this.searchResultForList['flightDate'] = this.MultipleShipmentForm.get('flightDate').value;
    const dupOffpointMap: any = {};
    let offPointGroupIndex = 1;
    //for serial number
    let count = 0;
    this.searchResultForList.flightShipmentList.forEach(element => {
      if (element.flightBookingID === 0 && !element.fromBookingDelta) {
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
      element.offPointGroup = dupOffpointMap[element.offPoint];

    });
    this.MultipleShipmentForm.patchValue(this.searchResultForList);

    this.disableCancelledShipments();
    this.searchButtonClicked = true;
  }
  disableCancelledShipments() {
    const shipmentListSize: number = (<NgcFormArray>this.MultipleShipmentForm.get('flightShipmentList')).length;
    const shipmentFormList: NgcFormArray = <NgcFormArray>this.MultipleShipmentForm.get('flightShipmentList');
    //
    shipmentFormList.controls.forEach((shipmentRecord: NgcFormGroup) => {
      if (shipmentRecord.get('bookingCancellationFlag').value === true) {
        // shipmentRecord.get('select').setValue(null);
        shipmentRecord.disable();
      }

      if (this.flightDepartedFlag) {
        shipmentRecord.controls.edit.disable();
        shipmentRecord.controls.dimension.disable();
      }
    });
  }

  public trolleyCellsStyleRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (value === false || value === 'false') {
      cellsStyle.data = ' ';

    }
    if (value === 'empty') {
      cellsStyle.data = ' ';
      cellsStyle.allowEdit = false;
    }
    return cellsStyle;
  }

  public groupsRenderer(value: string |
    number, rowData: any, level: any): string {
    return rowData.data.boardPoint + ' - ' + rowData.data.offPoint;
  }

  shipmentNumberInWindow: string;
  shipmentNumberLabel: string;
  onLinkClick(event) {
    var shipmentDateStr = event.record.shipmentDate.replace(',', " ");
    var shipmentDate = new Date(shipmentDateStr);
    this.shipmentNumberLabel = NgcUtility.translateMessage("export.booking.shipmentnumber.label", [event.record.shipmentNumber]);
    this.shipmentNumberInWindow = event.record.shipmentNumber
    this.displayAddRowFlag = false;
    this.columnName = event.column;
    this.popupRecord = event.record;
    this.editItemRowId = event.record.uid;
    this.bookingID = this.popupRecord.bookingID;
    this.flightBookingID = this.popupRecord.flightBookingID;
    if (this.columnName === 'edit') {
      if (this.MultipleShipmentForm.get('weightUnitCode').value) {
        this.exportService.dataToInsertOrUpdateBMS = { insert: this.flagInsert, update: this.flagUpdate, titleAddEditShipment: this.titleAddEditShipment, updateRecordIndex: event.record.uid };
        this.setDisabledFlagForEdit(this.editItemRowId, this.popupRecord);
        this.openShipmentPopup();
      } else {
        this.showFormControlErrorMessage(<NgcFormControl>(this.MultipleShipmentForm.get('weightUnitCode')), 'export.weight.code.mandatory');
        return;
      }

    }
    if (this.columnName === 'dimension') {
      this.MultipleShipmentForm.get('volume').setValue(this.popupRecord.volume);
      this.openDimensionPopup(event.record.shipmentNumber, shipmentDate);
    }



  }
  openShipmentPopup() {
    this.titleAddEditShipment = 'export.book.editshipment';
    this.flagUpdate = 'Y';
    this.flagInsert = 'N';
    this.sourceIdSegmentDropdown = this.createSourceParameter(this.MultipleShipmentForm.get('flightID').value);
    this.flightShipmentDetailRq.bookingID = this.bookingID;
    this.flightShipmentDetailRq.flightBookingID = this.flightBookingID;
    this.exportService.dataToInsertOrUpdateBMS = { insert: this.flagInsert, update: this.flagUpdate, titleAddEditShipment: this.titleAddEditShipment, updateRecord: this.popupRecord };
    this.navigateTo(this.router, '/export/bookmultipleshipment/bookMultipleShipmentMaintain', this.MultipleShipmentForm.getRawValue());
    // this.insertionWindow.open();
  }

  setDisabledFlagForEdit(editItemRowId, popupRecord) {
    const rowNum = editItemRowId.split('_');
    //
    if (popupRecord.manual === 'Y') {
      this.manualBookingFlag = false;
      this.commonDisabledFlag = true;
      this.showShipperLOV = true;
    }
    if (popupRecord.fbl === 'Y') {
      this.manualBookingFlag = true;
      this.commonDisabledFlag = true;
      this.showShipperLOV = true;
    }
  }
  openDimensionPopup(shipmentNumber: string, shipmentDate: Date) {
    this.dimenstionDeleteButton = true;
    this.flightShipmentDetailRq.bookingID = this.bookingID;
    this.flightShipmentDetailRq.flightBookingID = this.flightBookingID;
    this.flightShipmentDetailRq.shipmentNumber = shipmentNumber;
    this.flightShipmentDetailRq.shipmentDate = shipmentDate;
    this.exportService.getFlightDetail(this.flightShipmentDetailRq).subscribe(response => {

      if (this.showResponseErrorMessages(response)) {
        return;
      } else {
        this.flightDimention = response.data;

        this.MultipleShipmentForm.get('volumeUnitCode').setValue(this.flightDimention.volumeUnitCode);
        this.MultipleShipmentForm.get('volumeWeight').setValue(this.flightDimention.volumeWeight);
        this.MultipleShipmentForm.get('totalDimentionVolumetricWeight').setValue(this.flightDimention.volumeWeight);


        this.MultipleShipmentForm.controls['workingListRemarks']
          .patchValue(this.flightDimention.workingListRemarks);

        this.MultipleShipmentForm.controls['manifestRemarks']
          .patchValue(this.flightDimention.manifestRemarks);

        this.MultipleShipmentForm.controls['additionalRemarks']
          .patchValue(this.flightDimention.additionalRemarks);

        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Icms)) {
          (<NgcFormArray>this.MultipleShipmentForm.controls['dimensionList'])
            .patchValue(this.flightDimention.awbDimensionList);
        } else {
          (<NgcFormArray>this.MultipleShipmentForm.controls['dimensionList'])
            .patchValue(this.flightDimention.dimensionList);
        }
        if (this.flightDimention.dimensionList !== null) {
          this.flightDimention.dimensionList.forEach(element => {
            this.MultipleShipmentForm.get('shipmentUnitCode').setValue(element.shipmentUnitCode);
            this.MultipleShipmentForm.get('densityGroupCode').setValue(this.popupRecord.densityGroupCode);
          });

        }
        this.setDimentionValues();
        this.updateTotalshipment();
        this.subscribeForDimention();
        this.dimensionWindow.open();
      }

    }, Error => { });
  }
  addDimensionRow() {
    (<NgcFormArray>this.MultipleShipmentForm.controls['dimensionList'])
      .addValue([new BookingDimnesion()]);
    this.refresh();
  }

  saveFlightShipment() {
    const FlightDimensionUpdateRequest: BookingFlightEdit = new BookingFlightEdit();
    FlightDimensionUpdateRequest.workingListRemarks = this.MultipleShipmentForm.get('workingListRemarks').value;
    FlightDimensionUpdateRequest.manifestRemarks = this.MultipleShipmentForm.get('manifestRemarks').value;
    FlightDimensionUpdateRequest.additionalRemarks = this.MultipleShipmentForm.get('additionalRemarks').value;
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Icms)) {
      FlightDimensionUpdateRequest.awbDimensionList = (<NgcFormArray>this.MultipleShipmentForm.get('dimensionList')).getRawValue();
    } else {
      FlightDimensionUpdateRequest.dimensionList = (<NgcFormArray>this.MultipleShipmentForm.get('dimensionList')).getRawValue();
    }
    FlightDimensionUpdateRequest.flightBookingID = this.flightDimention.flightBookingID;
    FlightDimensionUpdateRequest.bookingID = this.flightDimention.bookingID;
    FlightDimensionUpdateRequest.flightID = this.flightDimention.flightID;
    FlightDimensionUpdateRequest.flightBoardPoint = this.flightDimention.flightBoardPoint;
    FlightDimensionUpdateRequest.flightOffPoint = this.flightDimention.flightOffPoint;
    FlightDimensionUpdateRequest.bookingPieces = this.flightDimention.bookingPieces;
    FlightDimensionUpdateRequest.bookingWeight = this.flightDimention.bookingWeight;
    FlightDimensionUpdateRequest.bookingStatusCode = this.flightDimention.bookingStatusCode;
    FlightDimensionUpdateRequest.throughTransitFlag = this.flightDimention.throughTransitFlag;
    FlightDimensionUpdateRequest.shipmentNumber = this.flightShipmentDetailRq.shipmentNumber;
    FlightDimensionUpdateRequest.shipmentDate = this.flightShipmentDetailRq.shipmentDate;
    FlightDimensionUpdateRequest.shcList = this.flightDimention.shcList;
    FlightDimensionUpdateRequest.densityGroupCode = this.MultipleShipmentForm.get('densityGroupCode').value;
    FlightDimensionUpdateRequest.volumeUnitCode = this.MultipleShipmentForm.get('volumeUnitCode').value;
    FlightDimensionUpdateRequest.volumeWeight = this.MultipleShipmentForm.get('volumeWeight').value;
    FlightDimensionUpdateRequest.volumetricWeight = this.MultipleShipmentForm.get('totalDimentionVolumetricWeight').value;

    // setting density group code to null if sum of pieces =total booking pcs
    let sumOfPcs = 0;
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Icms)) {
      FlightDimensionUpdateRequest.awbDimensionList.forEach(t => {
        sumOfPcs = sumOfPcs + t.pieces;
      });
    } else {
      FlightDimensionUpdateRequest.dimensionList.forEach(t => {
        sumOfPcs = sumOfPcs + t.pieces;
      });
    }
    if (sumOfPcs == this.flightDimention.bookingPieces) {
      FlightDimensionUpdateRequest.densityGroupCode = null;
    }
    FlightDimensionUpdateRequest.flagUpdate = 'Y';
    this.exportService.editFlightShipment(FlightDimensionUpdateRequest).subscribe(response => {
      this.refreshFormMessages(response);
      if (response.data !== null) {
        this.showSuccessStatus('g.completed.successfully');
        this.dimensionWindow.close();
        this.searchBookingList();

      }
    });
  }
  checkForDelete() {
    let deleteFlagCount = 0;
    const formValue = this.MultipleShipmentForm.getRawValue();
    const flightDimension = formValue.dimensionList;
    flightDimension.forEach(element => {
      if (element.checkBoxFlag) {
        deleteFlagCount++;
      }
    });
    if (deleteFlagCount > 0) {
      this.dimenstionDeleteButton = false;
    }
    else {
      this.dimenstionDeleteButton = true;
    }
  }
  deleteFlightDimention() {
    const flightDeleteDimensionRequest = new BookingFlightEdit();
    const deleteDimension = new Array<any>();
    flightDeleteDimensionRequest.workingListRemarks = this.MultipleShipmentForm.get('workingListRemarks').value;
    flightDeleteDimensionRequest.manifestRemarks = this.MultipleShipmentForm.get('manifestRemarks').value;
    flightDeleteDimensionRequest.additionalRemarks = this.MultipleShipmentForm.get('additionalRemarks').value;
    (<NgcFormArray>this.MultipleShipmentForm.controls['dimensionList']).getRawValue().forEach(ele => {
      if (ele.checkBoxFlag) {
        ele.flagDelete = 'Y';
      }
      deleteDimension.push(ele);
    });
    const nonDeletedDimension = new Array<any>();
    (<NgcFormArray>this.MultipleShipmentForm.controls['dimensionList']).getRawValue().forEach(ele => {
      if (!ele.checkBoxFlag) {
        nonDeletedDimension.push(ele);
      }
    });
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Icms)) {
      flightDeleteDimensionRequest.awbDimensionList = deleteDimension;
    } else {
      flightDeleteDimensionRequest.dimensionList = deleteDimension;
    }
    flightDeleteDimensionRequest.flightBookingID = this.flightDimention.flightBookingID;
    flightDeleteDimensionRequest.bookingID = this.flightDimention.bookingID;
    flightDeleteDimensionRequest.flightID = this.flightDimention.flightID;
    flightDeleteDimensionRequest.flightBoardPoint = this.flightDimention.flightBoardPoint;
    flightDeleteDimensionRequest.flightOffPoint = this.flightDimention.flightOffPoint;
    flightDeleteDimensionRequest.bookingPieces = this.flightDimention.bookingPieces;
    flightDeleteDimensionRequest.shipmentNumber = this.flightShipmentDetailRq.shipmentNumber;
    flightDeleteDimensionRequest.shipmentDate = this.flightShipmentDetailRq.shipmentDate;
    flightDeleteDimensionRequest.bookingWeight = this.flightDimention.bookingWeight;
    flightDeleteDimensionRequest.bookingStatusCode = this.flightDimention.bookingStatusCode;
    flightDeleteDimensionRequest.throughTransitFlag = this.flightDimention.throughTransitFlag;
    flightDeleteDimensionRequest.shcList = this.flightDimention.shcList;
    flightDeleteDimensionRequest.flagDelete = 'Y';
    this.exportService.editFlightShipment(flightDeleteDimensionRequest).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.updateTotalshipment();
        this.dimensionWindow.close();
        this.showSuccessStatus('g.completed.successfully');
        this.searchBookingList();
      } else {
        this.showResponseErrorMessages(response);
      }
    });
  }

  temporaryDeleteRow() {
    const MultipleShipmentBookingArray =
      this.MultipleShipmentForm.controls.
        MultipleShipmentBooking.value;
    const length =
      this.MultipleShipmentForm.controls.MultipleShipmentBooking.value.length;
    MultipleShipmentBookingArray.forEach(element => {
      if (element.temporaryDeleteCheckBox) {
        (<NgcFormArray>this.MultipleShipmentForm.controls['MultipleShipmentBooking']).deleteValue([element]);
      }
    });
  }

  cancelSelectedShipmentRecords() {
    const cancelShipmentList = new Array<any>();
    const allShipmentList = (<NgcFormArray>this.MultipleShipmentForm.controls['flightShipmentList']).getRawValue();
    (<NgcFormArray>this.MultipleShipmentForm.controls['flightShipmentList']).getRawValue().forEach(element => {
      if (element.cancelationCheckBox === true) {
        element['bookingCancellationFlag'] = true;
        element['bookingCancellationReasonCode'] = this.MultipleShipmentForm.controls.bookingCancellationReason.value;
        element['bookingCancellationUserCode'] = 'SYSADMIN';
        cancelShipmentList.push(element);
      }
    });

    const cancelRequest = new BookCancelShipment();
    cancelRequest.flightID = this.MultipleShipmentForm.get('flightID').value;
    cancelRequest.flightDate = this.MultipleShipmentForm.get('flightDate').value;
    cancelRequest.flightKey = this.MultipleShipmentForm.get('flightKey').value;
    cancelRequest.flightShipmentList = cancelShipmentList;
    this.exportService.cancelMultipleShipment(cancelRequest).subscribe(resp => {
      this.refreshFormMessages(resp);

      if (resp.success) {
        console.log(resp.data);
        if (resp.data.handoverShipment) {
          this.MultipleShipmentForm.get('flightShipmentList').patchValue(allShipmentList);
          this.showConfirmMessage(NgcUtility.translateMessage("confirmation.handover.for.shipment", [resp.data.handoverShipment])).then(fulfilled => {
            cancelRequest.skipHandoverFlag = true;
            this.exportService.cancelMultipleShipment(cancelRequest).subscribe(resp => {
              this.refreshFormMessages(resp);
              if (resp.success) {
                this.refreshFormMessages(resp);
                this.showSuccessStatus('g.completed.successfully');
                this.searchBookingList();
                return;
              }
              // return;
            });
          });
        } else {
          this.cancelButton = true;
          this.showSuccessStatus('g.completed.successfully');
          this.searchBookingList();
          return;
        }
      }
      if (cancelRequest.skipHandoverFlag) {
        const responseaftercancellation = resp.data;
        responseaftercancellation['flightDate'] = this.MultipleShipmentForm.get('flightDate').value;

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

        this.MultipleShipmentForm.patchValue(responseaftercancellation);
        this.disableCancelledShipments();
      }
    });
  }

  changeButtonFlag(event) {
    if (event.type !== 'check') {
      return;
    }
    const shipmentList: NgcFormArray = (<NgcFormArray>this.MultipleShipmentForm.get('flightShipmentList'));
    //
    if (shipmentList && shipmentList.length > 0) {
      try {
        shipmentList.controls.forEach((formGroup: NgcFormGroup) => {
          const cancelFlag: boolean = formGroup.get('bookingCancellationFlag').value;
          const selectFlag: boolean = formGroup.get('cancelationCheckBox').value;
          //
          if (cancelFlag === false && selectFlag === true) {
            // Enable
            this.cancelButton = false;
            throw new Error('export.record.found');
          }
        });
        // Disable
        this.cancelButton = true;
      } catch (e) {
      }
    }
  }

  public awbNumberCellsRenderer = (row: number, column: string, value: any, rowData: any): string => {

    rowData.rimIndicator
    rowData.dimIndicator
    let returnObj = value + ' ';

    if (rowData.dimIndicator === 'true' || rowData.dimIndicator === true) {
      returnObj = returnObj + '<span style="color:#fff;background:green; border-radius: 25px; padding:5px;font-weight:bold;font-size:12x;">&nbsp;D&nbsp;</i></span>'
    }
    if (rowData.rimIndicator === 'true' || rowData.rimIndicator === true) {
      returnObj = returnObj + '<span style="color:#fff;background:green; border-radius: 25px; padding:5px;font-weight:bold;font-size:12x;">&nbsp;R&nbsp;</i></span>'
    }
    return returnObj;
  }



  public checkBoxCellStyleRender = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if ((rowData.flightBookingID === 0 || rowData.flightBookingID === '0') &&
      !(rowData.fromBookingDelta === true || rowData.fromBookingDelta === 'true')) {
      cellsStyle.data = ' ';
      cellsStyle.allowEdit = false; cellsStyle.data = ' ';
      cellsStyle.allowEdit = false;
    }
    return cellsStyle;
  }
  subscribeForDimention() {

  }

  changeModel(event, column, dimention: NgcFormGroup, index) {
    if (column === 0) {
      // dimention.get('pieces').setValue(event);
      this.updateTotalshipment();
    } else if (column === 1) {
      // dimention.get('length').setValue(event);
    } else if (column === 2) {
      // dimention.get('width').setValue(event);
    } else {
      // dimention.get('height').setValue(event);
    }
    if (dimention.get('pieces').value !== null && dimention.get('length').value !== null
      && dimention.get('width').value !== null && dimention.get('height').value !== null) {
      this.setDimentionValues();
    }
  }
  closeDimentionPopup() {

  }

  setDimentionValues() {
    const dimention: Dimention = new Dimention();

    dimention.unitCode = this.MultipleShipmentForm.get('shipmentUnitCode').value;
    if (this.popupRecord != undefined) {
      dimention.weightCode = this.popupRecord.weightCode;
      dimention.shipmentPcs = this.popupRecord.bookingPieces;
      dimention.shipmentWeight = this.popupRecord.bookingWeight;
    }
    //dimention.weightCode = this.popupRecord.weightCode;
    dimention.volumeCode = this.MultipleShipmentForm.get('volumeUnitCode').value;
    if (this.popupRecord) {
      dimention.dg = this.popupRecord.densityGroupCode;
    }

    // dimention.shipmentPcs = this.popupRecord.bookingPieces;
    // dimention.shipmentWeight = this.popupRecord.bookingWeight;
    const dimentionList1 = (<NgcFormArray>this.MultipleShipmentForm.get('dimensionList')).getRawValue();
    dimentionList1.forEach(element => {

      const dimentionDetail: DimensionDetails = new DimensionDetails();
      dimentionDetail.pcs = element.pieces;
      dimentionDetail.length = element.length;
      dimentionDetail.width = element.width;
      dimentionDetail.height = element.height;
      if (dimentionDetail.pcs !== null && dimentionDetail.length !== null && dimentionDetail.width !== null && dimentionDetail.height !== null)
        dimention.dimensionDetails.push(dimentionDetail);
    });
    if (dimention.dimensionDetails.length > 0) {
      this.exportService.getDimensionVolumetricWeight(dimention).subscribe(resp => {
        (<NgcFormArray>this.MultipleShipmentForm.get('dimensionList')).controls.forEach((dim: NgcFormGroup) => {
          let pieces = +dim.get('pieces').value;
          let length = +dim.get('length').value;
          let width = +dim.get('width').value;
          let height = +dim.get('height').value;
          const dimensionData = resp.data;
          if (dimensionData !== null) {
            const volume = dimensionData.dimensionDetails.filter(ele => (ele.pcs === pieces && ele.length === length && ele.width === width && ele.height === height))[0];
            dim.get('volume').setValue(volume.volume);
            dim.get('shipmentUnitCode').setValue(dimention.unitCode);
            this.MultipleShipmentForm.get('volumeWeight').setValue(resp.data.calculatedVolume);
            this.MultipleShipmentForm.get('totalDimentionVolumetricWeight').setValue(resp.data.volumetricWeight);
            this.MultipleShipmentForm.get('volumeWeight').setValue(resp.data.calculatedVolume);
          }
        });

      });
    }
  }

  getDimensionInfo(dimension: Dimention): any {
    this.exportService.getDimesionVolume(dimension).subscribe(resp => {
      this.refreshFormMessages(resp);
      return resp;
    });
  }

  getDimensionVolumetricVolumeInfo(dimension: Dimention): any {
    this.exportService.getDimensionVolumetricWeight(dimension).subscribe(resp => {

      return resp;
    });
  }
  // this.dimensionWindow.close()
  updateTotalshipment() {
    let picesCount = 0;
    (<NgcFormArray>this.MultipleShipmentForm.get('dimensionList')).getRawValue().forEach(ele => { picesCount += +ele.pieces; });
    this.MultipleShipmentForm.get('totalDimentionPieces').setValue(picesCount);
  }

  eventCall(event) {
    this.setDimentionValues();
  }
  eventCallDensity(event) {
    let volume = +this.MultipleShipmentForm.get('totalDimentionVolume').value * +event.code;
    this.MultipleShipmentForm.get('volumeWeight').setValue(volume);
  }
  public onBack() {
    if (this.transferData !== null) {
      if (this.transferData['screenName'] === 'workinglist') {
        let transferDataWorkingList: any = { 'flightNo': this.MultipleShipmentForm.get('flightKey').value, 'flightDate': this.MultipleShipmentForm.get('flightDate').value };


        this.navigateTo(this.router, '/export/exportworkinglist', transferDataWorkingList);
      } else {
        this.navigateBack(this.transferData);
      }
    }
    else
      this.navigateBack({});
  }

  onClear() {
    this.searchButtonClicked = false;
    this.MultipleShipmentForm.reset();
    this.MultipleShipmentForm.get('flightDate').setValue(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy'));
    (this.MultipleShipmentForm.get("flightKey") as NgcFormControl).focus();
  }
}
