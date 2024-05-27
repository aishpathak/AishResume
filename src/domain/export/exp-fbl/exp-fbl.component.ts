import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';

//import { BuildupService } from './../buildup.service';
import { ExportService } from './../export.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormGroup, Validator, Validators } from '@angular/forms';

import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, CellsRendererStyle,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import {
  SearchFLightShipment, BookingDimnesion, BookingFlightEdit, BookCancelShipment,
  BookMultipleShipmentSearch, BookMultipleShipmentsFlight, Dimention, DimensionModel, DimensionDetails
} from './../export.sharedmodel';

import { ApplicationFeatures } from '../../common/applicationfeatures';
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: false
})
@Component({
  selector: 'app-exp-fbl',
  templateUrl: './exp-fbl.component.html',
  styleUrls: ['./exp-fbl.component.scss']
})
export class ExpFBLComponent extends NgcPage {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  reportParameters: any = new Object();
  cancelButton = true;
  flightKeyforDropdown: any;
  private transferData: any;
  private flightDateForAutoSearch: any;
  private flightKeyForAutoSearch: any;
  searchResultForList: any;
  searchButtonClicked = false;
  flightDepartedFlag: boolean = false;
  skipFlightPopUp: boolean = false;
  multipleShipmentSearch = new BookMultipleShipmentSearch();
  titleAddEditShipment: String;
  editItemRowId: number;
  columnName: any;
  popupRecord: any;
  displayAddRowFlag = true;
  sourceIdSegmentDropdown: any;
  response: any;
  flagInsert: string;
  flagUpdate: string;
  bookingID: number;
  flightBookingID: number;
  flightDimention: any;
  editShipmentRecord: any;
  commonDisabledFlag = false;
  showShipperLOV: boolean;
  removeShipment = true;
  manualBookingFlag = true;

  private ExportFblForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    flightSegmentId: new NgcFormControl(),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    weightUnitCode: new NgcFormControl('K'),
    volumeUnitCode: new NgcFormControl(),
    flightRemark: new NgcFormControl(),
    acRegistration: new NgcFormControl(),
    flightOffPoint: new NgcFormControl(),
    flightBoardPoint: new NgcFormControl(),
    segment_ID: new NgcFormControl(),

    MultipleShipmentBooking: new NgcFormArray(
      [
      ]),
  });

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
    totalPieces: '',
    bookingPriority: '',
    buInstruction: '',
    fblRemarks: ''
  };
  flightShipmentDetailRq = new SearchFLightShipment();

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
        // this.ExportFblForm.patchValue(this.transferData);
        this.ExportFblForm.get('flightKey').patchValue(this.transferData.flightKey);
        this.ExportFblForm.get('flightDate').patchValue(this.transferData.flightDate);

        //  this.skipFlightPopUp = true;
        this.searchBookingList();

      }
    } catch (e) { }
    this.ExportFblForm.controls.weightUnitCode.setValue('K');
    this.ExportFblForm.controls.volumeUnitCode.setValue('MC');
  }

  setSearchRequest() {
    this.multipleShipmentSearch.flightKey = this.ExportFblForm.controls.flightKey.value;
    this.multipleShipmentSearch.flightDate = this.ExportFblForm.controls.flightDate.value;
    // this.ExportFblForm.reset();
  }

  OnSearch() {
    this.setSearchRequest();
    this.fetchAndPopulateDataList();
    // this.ExportFblForm.get('bookingCancellationReason').setValue('');
  }



  fetchAndPopulateDataList() {
    this.exportService.getMultipleShipmentBookingList(this.multipleShipmentSearch).subscribe(response => {
      this.refreshFormMessages(response);

      this.searchResultForList = response.data;
      if (response.data.handlinginSystem && !this.skipFlightPopUp) {
        this.showConfirmMessage('g.flight.not.handled.confirmation').then(reason => {
          this.successResponse(response);
        }).catch(reason => {
          this.searchButtonClicked = false;
        });
      }
      else if (this.searchResultForList !== null) {
        this.flightDepartedFlag = this.searchResultForList.isFLightDeparted;
        this.searchResultForList['flightDate'] = this.ExportFblForm.get('flightDate').value;
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
        this.ExportFblForm.patchValue(this.searchResultForList);

        this.disableCancelledShipments();
        this.searchButtonClicked = true;
      }

      else {
        this.searchButtonClicked = false;
      }
    });
  }

  shipmentNumberInWindow: string;
  shipmentNumberLabel: string;

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

  onLinkClick(event) {
    this.shipmentNumberLabel = NgcUtility.translateMessage("export.booking.shipmentnumber.label", [event.record.shipmentNumber]);
    this.shipmentNumberInWindow = event.record.shipmentNumber
    this.displayAddRowFlag = false;
    this.columnName = event.column;
    this.popupRecord = event.record;
    this.editItemRowId = event.record.uid;
    this.bookingID = this.popupRecord.bookingID;
    this.flightBookingID = this.popupRecord.flightBookingID;
    if (this.columnName === 'edit') {
      if (this.ExportFblForm.get('weightUnitCode').value) {
        this.exportService.dataToInsertOrUpdateBMS = { insert: this.flagInsert, update: this.flagUpdate, titleAddEditShipment: this.titleAddEditShipment, updateRecordIndex: event.record.uid };
        this.setDisabledFlagForEdit(this.editItemRowId, this.popupRecord);
        this.openShipmentPopup();
      } else {
        this.showFormControlErrorMessage(<NgcFormControl>(this.ExportFblForm.get('weightUnitCode')), 'export.weight.code.mandatory');
        return;
      }

    }
    if (this.columnName === 'dimension') {
      this.ExportFblForm.get('volume').setValue(this.popupRecord.volume);
      //   this.openDimensionPopup(event.record.shipmentNumber);
    }



  }

  public groupsRenderer(value: string |
    number, rowData: any, level: any): string {
    return rowData.data.boardPoint + ' - ' + rowData.data.offPoint;
  }

  changeButtonFlag(event) {
    if (event.type !== 'check') {
      return;
    }
    const shipmentList: NgcFormArray = (<NgcFormArray>this.ExportFblForm.get('flightShipmentList'));
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
  successResponse(response) {
    this.flightDepartedFlag = this.searchResultForList.isFLightDeparted;
    this.searchResultForList['flightDate'] = this.ExportFblForm.get('flightDate').value;
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
    this.ExportFblForm.patchValue(this.searchResultForList);

    this.disableCancelledShipments();
    this.searchButtonClicked = true;
  }
  searchBookingList() {
    this.setSearchRequest();
    this.fetchAndPopulateDataList();
    //    this.ExportFblForm.get('bookingCancellationReason').setValue('');
  }

  cancelSelectedShipmentRecords() {
    const cancelShipmentList = new Array<any>();
    const allShipmentList = (<NgcFormArray>this.ExportFblForm.controls['flightShipmentList']).getRawValue();
    (<NgcFormArray>this.ExportFblForm.controls['flightShipmentList']).getRawValue().forEach(element => {
      if (element.cancelationCheckBox === true) {
        cancelShipmentList.push(element);
      }
    });

    const cancelRequest = new BookCancelShipment();
    cancelRequest.flightID = this.ExportFblForm.get('flightID').value;
    cancelRequest.flightDate = this.ExportFblForm.get('flightDate').value;
    cancelRequest.flightKey = this.ExportFblForm.get('flightKey').value;
    cancelRequest.flightShipmentList = cancelShipmentList;
    this.exportService.deleteMultipleShipment(cancelRequest).subscribe(resp => {
      this.refreshFormMessages(resp);

      if (resp.success) {
        console.log(resp.data);
        // if (resp.data.handoverShipment) {
        //   this.ExportFblForm.get('flightShipmentList').patchValue(allShipmentList);
        //   this.showConfirmMessage(NgcUtility.translateMessage("confirmation.handover.for.shipment", [resp.data.handoverShipment])).then(fulfilled => {
        //     cancelRequest.skipHandoverFlag = true;
        //     this.exportService.deleteMultipleShipment(cancelRequest).subscribe(resp => {
        //       this.refreshFormMessages(resp);
        //       if (resp.success) {
        //         this.refreshFormMessages(resp);
        //         this.showSuccessStatus('g.completed.successfully');
        //         this.searchBookingList();
        //         return;
        //       }
        //       // return;
        //     });
        //   });
        // } else {
        //   this.cancelButton = true;
        this.showSuccessStatus('g.completed.successfully');
        this.searchBookingList();
        return;
      }
      if (cancelRequest.skipHandoverFlag) {
        const responseaftercancellation = resp.data;
        responseaftercancellation['flightDate'] = this.ExportFblForm.get('flightDate').value;

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

        this.ExportFblForm.patchValue(responseaftercancellation);
        this.disableCancelledShipments();
      }
    });
  }

  disableCancelledShipments() {
    const shipmentListSize: number = (<NgcFormArray>this.ExportFblForm.get('flightShipmentList')).length;
    const shipmentFormList: NgcFormArray = <NgcFormArray>this.ExportFblForm.get('flightShipmentList');
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

  addMultipleShipments() {
    if (!this.ExportFblForm.get('weightUnitCode').value) {
      this.showFormControlErrorMessage(<NgcFormControl>(this.ExportFblForm.get('weightUnitCode')), 'export.weight.code.mandatory');
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
    this.sourceIdSegmentDropdown = this.createSourceParameter(this.ExportFblForm.get('flightID').value);
    console.log(this.exportService.dataToInsertOrUpdateBMS);
    console.log(this.sourceIdSegmentDropdown);
    (<NgcFormArray>this.ExportFblForm.
      controls['MultipleShipmentBooking']).
      patchValue([this.defaultValuesAddShipment]);
    console.log(this.ExportFblForm.getRawValue());
    this.navigateTo(this.router, 'export/expfbl/addexpfbl', this.ExportFblForm.getRawValue());
    // this.insertionWindow.open();
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


  openShipmentPopup() {
    this.titleAddEditShipment = 'export.book.editshipment';
    this.flagUpdate = 'Y';
    this.flagInsert = 'N';
    this.sourceIdSegmentDropdown = this.createSourceParameter(this.ExportFblForm.get('flightID').value);
    this.flightShipmentDetailRq.bookingID = this.bookingID;
    this.flightShipmentDetailRq.flightBookingID = this.flightBookingID;
    this.exportService.dataToInsertOrUpdateBMS = { insert: this.flagInsert, update: this.flagUpdate, titleAddEditShipment: this.titleAddEditShipment, updateRecord: this.popupRecord };
    this.navigateTo(this.router, 'export/expfbl/addexpfbl', this.ExportFblForm.getRawValue());
    // this.insertionWindow.open();
  }


  saveFlightShipment() {
    const FlightDimensionUpdateRequest: BookingFlightEdit = new BookingFlightEdit();
    FlightDimensionUpdateRequest.workingListRemarks = this.ExportFblForm.get('workingListRemarks').value;
    FlightDimensionUpdateRequest.manifestRemarks = this.ExportFblForm.get('manifestRemarks').value;
    FlightDimensionUpdateRequest.additionalRemarks = this.ExportFblForm.get('additionalRemarks').value;
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Icms)) {
      FlightDimensionUpdateRequest.awbDimensionList = (<NgcFormArray>this.ExportFblForm.get('dimensionList')).getRawValue();
    } else {
      FlightDimensionUpdateRequest.dimensionList = (<NgcFormArray>this.ExportFblForm.get('dimensionList')).getRawValue();
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
    FlightDimensionUpdateRequest.shcList = this.flightDimention.shcList;
    FlightDimensionUpdateRequest.densityGroupCode = this.ExportFblForm.get('densityGroupCode').value;
    FlightDimensionUpdateRequest.volumeUnitCode = this.ExportFblForm.get('volumeUnitCode').value;
    FlightDimensionUpdateRequest.volumeWeight = this.ExportFblForm.get('volumeWeight').value;
    FlightDimensionUpdateRequest.volumetricWeight = this.ExportFblForm.get('totalDimentionVolumetricWeight').value;

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
        //this.dimensionWindow.close();
        this.searchBookingList();

      }
    });
  }


  eFBL() {
    var dataToSend = {
      flightKey: this.ExportFblForm.controls.flightKey.value,
      flightDate: this.ExportFblForm.controls.flightDate.value
    }
    this.navigateTo(this.router, '/export/eFBL', dataToSend);
  }
  onClear() {
    this.searchButtonClicked = false;
    this.ExportFblForm.reset();
    this.resetFormMessages();
  }

  onPrint() {
    let fblData = this.ExportFblForm.getRawValue();
    this.reportParameters = new Object();
    this.reportParameters.flightKey = fblData.flightKey
    this.reportParameters.flightDate = fblData.flightDate
    this.reportParameters.tenant = NgcUtility.getTenantConfiguration().airportCode;
    console.log(this.reportParameters);
    this.reportWindow.open();
  }

}


