import { BookMultipleShipmentsFlight, SearchFLightShipment, BookingSHC } from './../export.sharedmodel';
import { Router, ActivatedRoute } from '@angular/router';
import { ExportService } from './../export.service';
import { ElementRef, ViewContainerRef } from '@angular/core';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcWindowComponent, NgcUtility } from 'ngc-framework';
import { Dimention, SearchSingleBookingShipment } from './../export.sharedmodel';

@Component({
  selector: 'app-book-multiple-shipment-maintain',
  templateUrl: './book-multiple-shipment-maintain.component.html',
  styleUrls: ['./book-multiple-shipment-maintain.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class BookMultipleShipmentMaintainComponent extends NgcPage {

  @ViewChild('routingInfoWindow') routingInfoWindow: NgcWindowComponent;
  private multipleShipmentFlightBooking = new BookMultipleShipmentsFlight();
  selectedIndex = 0;
  count = 0;
  showFlag: boolean;
  flagInsert;
  flagUpdate;
  response;
  searchResponse;
  volume: number;
  manualBookingFlag = true;
  commonDisabledFlag = false;
  showShipperLOV: boolean;
  titleAddEditShipment;
  sourceIdSegmentDropdown;
  shipmentNumberInWindow;
  shipmentNumberLabel;
  displayAddRowFlag;
  statusList: any[] = ['UU', 'SS', 'SB', 'EM'];
  ruleEngineWarningAndInfoMessage = null;
  skipRuleEngineFlag = false;
  nonMatchingRoutePresent = false;

  private MultipleShipmentForm: NgcFormGroup = new NgcFormGroup({
    bookingCancellationReason: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    std: new NgcFormControl(),
    flightID: new NgcFormControl(),
    weightUnitCode: new NgcFormControl(),
    volumeUnitCode: new NgcFormControl(),
    totalShipment: new NgcFormControl(),
    totalPieces: new NgcFormControl(),
    totalWeight: new NgcFormControl(),
    flightShipmentList: new NgcFormArray(
      [
      ]),
    MultipleShipmentBooking: new NgcFormArray(
      [
      ]),
    MultipleShipmentBookingWithMatchingRoute: new NgcFormArray(
      [
      ]),
    MultipleShipmentBookingWithNonMatchingRoute: new NgcFormArray(
      [
      ]),
    MultipleShipmentBookingWithNoRouteInfo: new NgcFormArray(
      [
      ]),
    workingListRemarks: new NgcFormControl(),
    manifestRemarks: new NgcFormControl(),
    additionalRemarks: new NgcFormControl(),
    dimensionList: new NgcFormArray([
    ]),
  });


  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private exportService: ExportService,
    private route: ActivatedRoute,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    const transferData = this.getNavigateData(this.route);
    this.showFlag = true;
    try {
      if (transferData !== null && transferData !== undefined) {
        if (transferData.MultipleShipmentBooking && transferData.MultipleShipmentBooking.length > 0) {
          // transferData.MultipleShipmentBooking.forEach(t => {
          //   t.dgFlag = false;
          //   t.volumeFlag = false;
          // })
        }
        this.MultipleShipmentForm.patchValue(transferData);
      }
    } catch (e) { }
    const insertOrUpdate = this.exportService.dataToInsertOrUpdateBMS;
    if (insertOrUpdate) {
      //this.exportService.dataToInsertOrUpdateBMS = { insert: this.flagInsert, update: this.flagUpdate, titleAddEditShipment: this.titleAddEditShipment };
      this.flagInsert = insertOrUpdate.insert;
      this.flagUpdate = insertOrUpdate.update;
      this.titleAddEditShipment = insertOrUpdate.titleAddEditShipment;
      this.sourceIdSegmentDropdown = this.createSourceParameter(this.MultipleShipmentForm.get('flightID').value);
    }
    if (this.flagUpdate === 'Y') {
      this.displayAddRowFlag = false;
      this.titleAddEditShipment = 'export.book.editshipment';
      this.flagUpdate = 'Y';
      this.flagInsert = 'N';
      const flightShipmentDetailRq = new SearchFLightShipment();
      this.shipmentNumberInWindow = insertOrUpdate.updateRecord.shipmentNumber;
      this.shipmentNumberLabel = NgcUtility.translateMessage("export.booking.shipmentnumber.label", [insertOrUpdate.updateRecord.shipmentNumber]);
      flightShipmentDetailRq.bookingID = insertOrUpdate.updateRecord.bookingID;
      flightShipmentDetailRq.flightBookingID = insertOrUpdate.updateRecord.flightBookingID;
      // enabling of DG and volume field based on Dimensions
      let sumOfDimPcs = 0;
      if (transferData && transferData.dimensionList && transferData.dimensionList.length > 0) {
        transferData.dimensionList.forEach(t => {
          sumOfDimPcs = sumOfDimPcs + t.pieces;
        });
      }
      // this.updateFormAsUnModified
      this.exportService.getShipmentDetail(flightShipmentDetailRq).subscribe(response => {
        this.refreshFormMessages(response);
        const editShipmentRecord = response.data;
        this.searchResponse = response.data;
        editShipmentRecord.tempVolumeUnitCode = editShipmentRecord.volumeUnitCode;
        if (sumOfDimPcs == editShipmentRecord.pieces) {
          editShipmentRecord.dgFlag = true;
          editShipmentRecord.volumeFlag = true;
          editShipmentRecord.volumeUnitFlag = true;
        }


        editShipmentRecord.dropDownVal = editShipmentRecord.boardPoint + '-'
          + editShipmentRecord.offPoint;
        editShipmentRecord.temporaryDeleteCheckBox = false;
        (<NgcFormArray>this.MultipleShipmentForm.
          controls['MultipleShipmentBooking'])
          .patchValue([editShipmentRecord], { onlySelf: true, emitEvent: false });
        this.setDisabledFlagForEdit(insertOrUpdate.updateRecord);
      });
    } else {
      this.displayAddRowFlag = true;
      this.manualBookingFlag = false;
      // this.defaultValuesAddShipment.dropDownVal=
      (<NgcFormArray>this.MultipleShipmentForm.controls['MultipleShipmentBooking']).
        patchValue([this.defaultValuesAddShipment], { onlySelf: true, emitEvent: false });
    }

    this.onVolumeChange();
  }


  /**
   * Patch default control values
   * on additing of row in insertion window
   * @memberof BookMultipleShipmentComponent
   */
  onAddRow() {
    (<NgcFormArray>this.MultipleShipmentForm.
      controls['MultipleShipmentBooking']).
      addValue([this.defaultValuesAddShipment], { onlySelf: true, emitEvent: false });
    this.onVolumeChange();
  }
  /**
   * Calls all required functions required
   * to save shipment details
   *
   * @memberof BookMultipleShipmentComponent
   */
  onSaveOfShipmentDetails() {

    this.setAddRequest();
    this.addBoardAndOffPoint();
    if (this.displayAddRowFlag) {
      this.validateRouting();
    }
    else {
      this.sendRequestAddShipment();
    }
  }

  /**
   * Used to split dropdown and set
   * board point and off point
   * @memberof BookMultipleShipmentComponent
   */
  addBoardAndOffPoint() {
    //const MultipleShipmentBookingArray = (<NgcFormArray>this.MultipleShipmentForm.get('MultipleShipmentBooking')).getRawValue();
    this.multipleShipmentFlightBooking.shipmentList.forEach(element => {
      const splitVal = element.dropDownVal.split('-');
      element.boardPoint = splitVal[0];
      element.offPoint = splitVal[1];
      element.weightUnitCode =
        this.MultipleShipmentForm.controls['weightUnitCode'].value;
      // element.volumeUnitCode =
      //   this.MultipleShipmentForm.controls['volumeUnitCode'].value;
      element.temporaryDeleteCheckBox = false;
      /* TODO
      * Remove this harcoded value
      */
      element.createdBy = 'SYSADMIN';
    });
  }

  /**
   * set all add multiple shipment
   * parameters
   *
   * @memberof BookMultipleShipmentComponent
   */
  setAddRequest() {
    this.multipleShipmentFlightBooking.flightID =
      this.MultipleShipmentForm.controls.flightID.value;
    this.multipleShipmentFlightBooking.flightKey =
      this.MultipleShipmentForm.controls.flightKey.value;
    this.multipleShipmentFlightBooking.flightDate = this.MultipleShipmentForm.controls.flightDate.value;
    this.multipleShipmentFlightBooking.totalPieces = +this.MultipleShipmentForm.get(['MultipleShipmentBooking', 0]).get('totalPieces').value;
    this.multipleShipmentFlightBooking['flagInsert'] = this.flagInsert;
    this.multipleShipmentFlightBooking['flagUpdate'] = this.flagUpdate;
    this.multipleShipmentFlightBooking.shipmentList =
      (<NgcFormArray>this.MultipleShipmentForm.get('MultipleShipmentBooking')).getRawValue();
  }


  /**
   * send request to add shipment
   * patch response to UI
   * @memberof BookMultipleShipmentComponent
   */
  sendRequestAddShipment() {
    if (this.nonMatchingRoutePresent) {
      let isShipmentSelected = false;
      this.multipleShipmentFlightBooking.shipmentList = [];
      (<NgcFormArray>this.MultipleShipmentForm.controls['MultipleShipmentBookingWithMatchingRoute']).getRawValue().forEach(matchingRoutesShipment => {

        if (matchingRoutesShipment.checkBox) {
          this.multipleShipmentFlightBooking.shipmentList.push(matchingRoutesShipment);
          isShipmentSelected = true;
        }
      });
      (<NgcFormArray>this.MultipleShipmentForm.controls['MultipleShipmentBookingWithNonMatchingRoute']).getRawValue().forEach(nonMatchingRoutesShipment => {
        if (nonMatchingRoutesShipment.checkBox) {
          this.multipleShipmentFlightBooking.shipmentList.push(nonMatchingRoutesShipment);
          isShipmentSelected = true;
        }
      });
      (<NgcFormArray>this.MultipleShipmentForm.controls['MultipleShipmentBookingWithNoRouteInfo']).getRawValue().forEach(nonRoutesShipment => {
        this.multipleShipmentFlightBooking.shipmentList.push(nonRoutesShipment);
      });
      // this.multipleShipmentFlightBooking.shipmentList.push((<NgcFormArray>this.MultipleShipmentForm.controls['MultipleShipmentBookingWithNoRouteInfo']).getRawValue());

      if (!isShipmentSelected) {
        this.showErrorMessage("export.select.shipments.to.proceed");
        return;
      }
    }
    if (this.searchResponse != null && this.searchResponse != undefined) {
      if (this.searchResponse.bookingStatusCode == "UU" && this.multipleShipmentFlightBooking.shipmentList != '') {
        this.multipleShipmentFlightBooking.shipmentList.forEach(shipmentList => {
          if (shipmentList.bookingStatusCode == "SS" || shipmentList.bookingStatusCode == "SB") {
            shipmentList.statusFlag = true;
          }
          else {
            shipmentList.statusFlag = false;
          }
        });
      }
    }
    // this.exportService.addMultipleShipmentBookingList
    //   (this.multipleShipmentFlightBooking).subscribe(data => {
    //     this.resetFormMessages();
    //     this.showResponseErrorMessages(data);
    //     this.response = data.data;
    //     if (this.response !== null) {
    //       this.response['flightDate'] = this.MultipleShipmentForm.get('flightDate').value;
    //       // commented due to error after save
    //       // this.response.flightShipmentList.forEach(element => {
    //       //   if (element.flightBookingID || element.flightBookingID === 0) {
    //       //     element.cancelationCheckBox = ' ';
    //       //     element.bookingPieces = 'NIL';
    //       //     element.bookingWeight = ' ';
    //       //     element.edit = 'empty';
    //       //     element.dimension = 'empty';
    //       //   } else {
    //       //     element.cancelationCheckBox = false;
    //       //     element.edit = ' ';
    //       //     element.dimension = ' ';
    //       //   }
    //       // });
    //       //comment ends here 
    //       // this.MultipleShipmentForm.patchValue(this.response);

    //       if (this.response.ruleEngineWarningAndInfoMessage) {
    //         this.showConfirmMessage(this.response.ruleEngineWarningAndInfoMessage).then(fulfilled => {
    //           this.multipleShipmentFlightBooking.ruleEngineWarningAndInfoMessage = null;
    //           this.multipleShipmentFlightBooking.skipRuleEngineFlag = true;

    //           this.exportService.addMultipleShipmentBookingList
    //             (this.multipleShipmentFlightBooking).subscribe(data => {
    //               this.resetFormMessages();
    //               this.showResponseErrorMessages(data);
    //               this.response = data.data;
    //               if (this.response !== null) {
    //                 this.response['flightDate'] = this.MultipleShipmentForm.get('flightDate').value;
    //                 //this.navigateBack(this.response);
    //                 this.navigateTo(this.router, '/export/bookmultipleshipment', this.response);

    //               }
    //             });

    //         }).catch(reason => {
    //         });
    //       } else {
    //         this.navigateBack(this.response);
    //       }

    //       this.showSuccessStatus('g.completed.successfully');

    //     }
    //   });
    // this.closePopup();
  }

  defaultValuesAddShipment = {
    tempVolumeUnitCode: 'MC',
    volumeUnitFlag: false,
    dgFlag: false,
    volumeFlag: false,
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
    volumeWeight: 0.01,
    volumeUnitCode: 'MC',
    natureOfGoodsDescription: '',
    serviceFlag: false,
    blockSpace: false,
    manual: true,
    shipperCustomerID: '',
    shcList: new Array<BookingSHC>(),
    flagInsert: 'Y',
    flagUpdate: 'N',
    totalPieces: '',
    bookingStatusCode: 'SS'
  };
  setDisabledFlagForEdit(popupRecord) {
    // const rowNum = editItemRowId.split('_');
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
  onCancel() {
    this.navigateTo(this.router, '/export/bookmultipleshipment', this.MultipleShipmentForm.getRawValue());
  }

  eventCallDensity(event, i) {
    let shipmentObject = this.MultipleShipmentForm.get(['MultipleShipmentBooking', i]).value;
    //  if (this.count > 0 || this.flagUpdate != 'Y') {
    const dimention: Dimention = new Dimention();
    dimention.weightCode = this.MultipleShipmentForm.get('weightUnitCode').value;
    dimention.dg = event.code;
    dimention.shipmentWeight = +this.MultipleShipmentForm.get(['MultipleShipmentBooking', i]).get('grossWeight').value;
    this.exportService.getVolumeByDensity(dimention).subscribe(resp => {
      this.volume = resp.data;
      if (this.volume !== null) {
        this.MultipleShipmentForm.get(['MultipleShipmentBooking', i]).get('volumeWeight').setValue(this.volume, { onlySelf: true, emitEvent: false });
      }
    });
    // }
    this.count++;
  }
  onVolumeChange() {
    for (let i = 0; i < this.MultipleShipmentForm.get('MultipleShipmentBooking').value.length; i++) {
      this.MultipleShipmentForm.get(['MultipleShipmentBooking', i, 'volumeWeight']).valueChanges.subscribe(volResp => {
        let grossWeight = this.MultipleShipmentForm.get(['MultipleShipmentBooking', i, 'grossWeight']).value;
        let densityGroupCode = this.MultipleShipmentForm.get(['MultipleShipmentBooking', i, 'densityGroupCode']).value;
        if (grossWeight && densityGroupCode) {
          const dimention: Dimention = new Dimention();
          dimention.weightCode = this.MultipleShipmentForm.get('weightUnitCode').value;
          dimention.dg = densityGroupCode;
          dimention.shipmentWeight = grossWeight;
          this.exportService.getVolumeByDensity(dimention).subscribe(resp => {
            if (resp && volResp != resp) {
              this.MultipleShipmentForm.get(['MultipleShipmentBooking', i]).get('densityGroupCode').setValue(null);
            }
          });
        }

      });

    }
  }


  onShipmentChange(event, i) {
    const searchRequest: SearchSingleBookingShipment = new SearchSingleBookingShipment();
    searchRequest.shipmentNumber = this.MultipleShipmentForm.get(['MultipleShipmentBooking', i]).get('shipmentNumber').value;
    if (searchRequest.shipmentNumber) {
      this.exportService.getShipmentMasterData(searchRequest).subscribe(resp => {
        this.refreshFormMessages(resp);
        if (resp.success) {
          this.MultipleShipmentForm.get(['MultipleShipmentBooking', i]).get('serviceFlag').setValue(resp.data.serviceFlag);
          this.MultipleShipmentForm.get(['MultipleShipmentBooking', i]).get('origin').setValue(resp.data.origin);
          this.MultipleShipmentForm.get(['MultipleShipmentBooking', i]).get('destination').setValue(resp.data.destination);
          this.MultipleShipmentForm.get(['MultipleShipmentBooking', i]).get('totalPieces').setValue(resp.data.pieces);
          this.MultipleShipmentForm.get(['MultipleShipmentBooking', i]).get('grossWeight').setValue(resp.data.grossWeight);
          this.MultipleShipmentForm.get(['MultipleShipmentBooking', i]).get('natureOfGoodsDescription').setValue(resp.data.natureOfGoodsDescription);
          if (resp.data.combinedShcs != null) {
            const shcList = resp.data.combinedShcs.split(',');
            const shcs = new Array<BookingSHC>();
            if (shcList.length > 0) {
              shcList.forEach(shc => {
                const bookingSHC = new BookingSHC();
                bookingSHC.specialHandlingCode = shc;
                shcs.push(bookingSHC);
              });
            }
            this.MultipleShipmentForm.get(['MultipleShipmentBooking', i]).get('shcList').patchValue(shcs);
          }
        }
      });
    }

  }
  eventCallVolume(event, index) {
    if (event) {
      const dimention: Dimention = new Dimention();
      dimention.volumeCode = this.MultipleShipmentForm.get(['MultipleShipmentBooking', index]).get('volumeUnitCode').value;
      if (this.MultipleShipmentForm.get(['MultipleShipmentBooking', index]).get('tempVolumeUnitCode').value) {
        dimention.oldVolumeCode = this.MultipleShipmentForm.get(['MultipleShipmentBooking', index]).get('tempVolumeUnitCode').value;
      } else {
        dimention.oldVolumeCode = 'MC';
      }
      dimention.volume = this.MultipleShipmentForm.get(['MultipleShipmentBooking', index]).get('volumeWeight').value;
      if (dimention.volume) {
        this.exportService.getConvertedVolume(dimention).subscribe(resp => {
          this.MultipleShipmentForm.get(['MultipleShipmentBooking', index]).get('tempVolumeUnitCode').setValue(this.MultipleShipmentForm.get(['MultipleShipmentBooking', index]).get('volumeUnitCode').value);
          if (resp.data) {
            this.MultipleShipmentForm.get(['MultipleShipmentBooking', index]).get('volumeWeight').setValue(resp.data, { onlySelf: true, emitEvent: false });
          }
        });
      }
    }
  }



  validateRouting() {
    this.exportService.validateRoutingForMultipleShipment
      (this.multipleShipmentFlightBooking).subscribe(data => {
        this.resetFormMessages();

        if (data.messageList != null && data.messageList.length > 0) {
          data.messageList = this.changeControlNameForErrorMessage('shipmentList', 'MultipleShipmentBooking', data.messageList);
          this.showResponseErrorMessages(data);
          return;
        }
        this.response = data.data;
        let sno = 1;
        let nonmatchingsno = 1;
        const multipleShipmentBookingWithMatchingRoute = [];
        const multipleShipmentBookingWithNonMatchingRoute = [];
        const multipleShipmentBookingWithNoRouteInfo = [];
        const shipmentWithRoutingInfo = this.response.shipmentList;
        if (this.response !== null) {
          this.nonMatchingRoutePresent = false;
          for (const eachRow of shipmentWithRoutingInfo) {
            if (eachRow.routeMatches) {
              eachRow['checkBox'] = true;
              eachRow['sno'] = sno++;
              multipleShipmentBookingWithMatchingRoute.push(eachRow);
            } else {
              eachRow['checkBox'] = false;
              //Do not Consider shipments without routing info for validation
              if (eachRow.shipmentRoutingInfo != null) {
                multipleShipmentBookingWithNonMatchingRoute.push(eachRow);
                this.nonMatchingRoutePresent = true;
                eachRow['sno'] = nonmatchingsno++;
              } else {
                multipleShipmentBookingWithNoRouteInfo.push(eachRow);
              }
            }
          }
          if (this.nonMatchingRoutePresent) {
            (<NgcFormArray>this.MultipleShipmentForm.controls['MultipleShipmentBookingWithMatchingRoute'])
              .patchValue(multipleShipmentBookingWithMatchingRoute);
            (<NgcFormArray>this.MultipleShipmentForm.controls['MultipleShipmentBookingWithNonMatchingRoute'])
              .patchValue(multipleShipmentBookingWithNonMatchingRoute);
            (<NgcFormArray>this.MultipleShipmentForm.controls['MultipleShipmentBookingWithNoRouteInfo'])
              .patchValue(multipleShipmentBookingWithNoRouteInfo);
          }
        }
        if (this.nonMatchingRoutePresent) {
          this.routingInfoWindow.open();
        } else {
          this.sendRequestAddShipment();
        }
      });
  }

  closePopup() {
    this.routingInfoWindow.close();
  }

  changeControlNameForErrorMessage(changeFrom, changeTo, data) {
    const dataToReturn = []
    data.forEach(element => {
      if (element.referenceId) {
        const varData = element.referenceId.replace(changeFrom, changeTo);
        element.referenceId = varData;
        dataToReturn.push(element);
      }
    });
    return dataToReturn;
  }

}
