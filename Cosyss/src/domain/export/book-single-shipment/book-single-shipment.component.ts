import { request } from 'http';
import { Dummy } from './dummy';
import { SearchSingleBookingShipment, Dimention, DimensionDetails, SingleShipmentBooking } from './../export.sharedmodel';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportService } from './../export.service';
import {
  NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcPage,
  NgcButtonComponent, PageConfiguration, NgcFormControl,
  NgcLOVComponent, NgcUtility
} from 'ngc-framework';
import {
  Component, OnInit, ViewEncapsulation, ViewChild,
  ViewChildren, QueryList, NgZone, ElementRef, ViewContainerRef,
  ChangeDetectorRef
} from '@angular/core';
import { Validator, Validators } from '@angular/forms';
import { ApplicationFeatures } from '../../common/applicationfeatures';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-book-single-shipment',
  templateUrl: './book-single-shipment.component.html',
  styleUrls: ['./book-single-shipment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class BookSingleShipmentComponent extends NgcPage {
  resp: any;
  updateBookingObject: any;
  icmsBookingPublishObject: any;
  @ViewChild('updateBookingWindow') updateBookingWindow: NgcWindowComponent;
  @ViewChild('ismsBookingPublishWindow') ismsBookingPublishWindow: NgcWindowComponent;
  @ViewChildren('window') window: QueryList<NgcWindowComponent>;
  @ViewChild('windows') windows: NgcWindowComponent;
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  @ViewChild('originLOV') originLOV: NgcLOVComponent;
  @ViewChild('addNewPart') addNewPart: NgcWindowComponent;
  @ViewChild('bookshipment') bookshipment: NgcWindowComponent;
  bookingobjectForVolumeCodeChange: any;
  private errors: any[];
  private hideCreateNewBooking;
  private response;
  private searchResponse;
  public successFlag;
  private subscription;
  private subscribedPieces;
  private subcribedWeight;
  private subscribedPartPieces;
  private subcribedPartWeight;
  private partSuffix1;
  private partSuffix2;
  private saveFlag: boolean;
  private noOfCheckedAccordions = 0;
  private shipmentNoExists = false;
  private searchDone = false;
  private volume: any;
  private searchFocusFlag: boolean = false;
  private routeData: any;
  private collapseExpand: boolean = true;

  private noOfAccordionsSelected = 0;
  private partDeleteflag = false;
  private mesurementData = ["CMT", "INH"];

  private closeAccordion = true;
  private deleteFlightEntries = [];
  private monthNames = [
    'JAN', 'FEB', 'MAR',
    'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP',
    'OCT', 'NOV', 'DEC'
  ];
  private navigateData: any;

  private eachPartBooking = {
    createPartInvocationFlag: false,
    fromCreatePart: false,
    parentPieces: 0,
    parentWeight: 0.0,
    partPiecesWtFlag: false,
    volumeDisabledFlag: false,
    partIdentifier: 'Y',
    inComingFlight: null,
    outGoingFlight: '',
    mergeSelect: false,
    partPieces: 0,
    partWeight: 0.0,
    workingListRemarks: null,
    manifestRemarks: null,
    additionalRemarks: null,
    partSuffix: '',
    pshTriggerFlag: '',
    partSourceSuffix: '',
    partCreatedFrom: '',
    densityGroupCode: null,
    tempDensityGroupCode: null,
    volumeWeight: '',
    measurementUnitCode: 'CMT',
    volume: null,
    volumeUnitCode: 'MC',
    tempVolumeCode: 'MC',
    shcList: [],
    throughTransitFlag: 0,
    shipmentPartBookingDimensionList: [],
    singleShipmentFlightBookingList: [],
    flagInsert: 'Y',
    flagDelete: 'N',
    flagMergePart: 'N',
    flagDeletePart: 'N',
    updateFlag: 'N',
    tempVolume: 0.0,
    totalDimentionPieces: 0,
    totalDimentionVolume: 0.0,
    totalDimentionVolumetricWeight: 0.0,
    suffixAvail: false,
    isFLightDeparted: false,
    isFlightManifested: false,
    infoShc: 'SHC:',
    infoValue: 'Pcs/Wt:',
    infoVol: 'Vol:'
  };

  private eachFlightRow = {
    flagInsert: 'Y',
    bookingPieces: 0,
    bookingWeight: 0.0,
    flightKey: '',
    flightId: null,
    flightSegmentId: null,
    flightOriginDate: null,
    flightBoardPoint: '',
    flightOffPoint: '',
    bookingStatusCode: 'SS',
    dateSTA: null,
    dateSTD: null,
    shcList: [],
    bookingCancellationFlag: 0,
    densityGroupCode: null,
    volume: 0.0,
    flagUpdate: 'N',
    volumeUnitCode: '',
    totalDimentionVolumetricWeight: 0.0,
    isFLightDeparted: false,
    fromCreatePart: false,
    createPartInvocationFlag: false
  };

  private eachDimensionRow = {
    checkBoxFlag: false,
    flagInsert: 'Y',
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    measurementUnitCode: 'CMT',
    volumeUnitCode: 'MC',
    volume: 0.0,
    pieces: 0,
    tempVolume: 0.0,
    unitCode: 'CMT'
  };
  private volumeUnitCode: any;
  private volumeAmount: any;
  private densityGroupCode: any;
  private form1 = new NgcFormGroup({
    shipmentNumber: new NgcFormControl('', [Validators.maxLength(11)]),
    blockSpace: new NgcFormControl(0),
    serviceFlag: new NgcFormControl(0),
    origin: new NgcFormControl('', [Validators.required]),
    destination: new NgcFormControl(''),
    partIdentifier: new NgcFormControl(''),
    pieces: new NgcFormControl(0),
    grossWeight: new NgcFormControl(0.0),
    weightUnitCode: new NgcFormControl('K'),
    volumeWeight: new NgcFormControl(0.0),
    natureOfGoodsDescription: new NgcFormControl(''),
    shipperName: new NgcFormControl(null),
    proposedRouting: new NgcFormControl(''),
    forceBookingFlag: new NgcFormControl(0),
    flagInsert: new NgcFormControl('Y'),
    flagUpdate: new NgcFormControl('N'),
    primaryPart: new NgcFormControl(false),
    bookingCancellationReason: new NgcFormControl(),
    bookingCancellationFlag: new NgcFormControl(0),
    remainingPcs: new NgcFormControl(),
    remainingWt: new NgcFormControl(),
    commitTransaction: new NgcFormControl('F'),
    basePort: new NgcFormControl(),
    partBookingList: new NgcFormArray([]),
    shipmentBookingDimensionList: new NgcFormArray([
    ]),
    // for booking dimension popup
    tempVolume: new NgcFormControl(0.0),
    totalDimentionPieces: new NgcFormControl(0),
    totalDimentionVolumetricWeight: new NgcFormControl(0.0),
    volumeUnitCode: new NgcFormControl('MC'),
    measurementUnitCode: new NgcFormControl('CMT'),
    unitCode: new NgcFormControl('CMT')
  });

  private form;

  private addNewPartForm = new NgcFormGroup({
    partPieces: new NgcFormControl(),
    partWeight: new NgcFormControl(),
    densityGroupCode: new NgcFormControl(),
    volume: new NgcFormControl(),
    volumeUnitCode: new NgcFormControl('MC'),
    partSuffix: new NgcFormControl()
  });

  private validateBookForm = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(''),
    serviceFlag: new NgcFormControl(0),
    forceBookingFlag: new NgcFormControl(0),
    origin: new NgcFormControl(''),
    destination: new NgcFormControl(''),
    pieces: new NgcFormControl(0),
    grossWeight: new NgcFormControl(0.0),
    weightUnitCode: new NgcFormControl('K'),
    natureOfGoodsDescription: new NgcFormControl(''),
    partBooking: new NgcFormArray([
      new NgcFormControl({
        partSuffix: new NgcFormControl(),
        partPieces: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        flightOriginDate: new NgcFormControl(),
        bookingStatusCode: new NgcFormControl(),
        flightBookingStatus: new NgcFormControl(),
        flightBoardPoint: new NgcFormControl(),
        flightOffPoint: new NgcFormControl(),
        //isSaved: new NgcFormControl(false)
        flightKeyTwo: new NgcFormControl(),
        flightOriginDateTwo: new NgcFormControl(),
        bookingStatusCodeTwo: new NgcFormControl()
      })
    ])
  });
  flightValueArray = [];
  packageDetails;
  enableAddPart: boolean = false;
  ship: any;
  checkArray: any;
  disableFlag: boolean = false;
  checkBookingStatusCodeUU: boolean = false;
  SaveClicked: boolean = false;
  infoValue: string;
  displayPartPcs: any;
  infoShc: any;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private exportService: ExportService, private activatedRoute: ActivatedRoute, private router: Router,
    private cd: ChangeDetectorRef) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.navigateData = this.getNavigateData(this.activatedRoute);
    this.form = this.form1;

    this.form.controls.shipmentNumber.valueChanges.subscribe((data) => {
      if (data) {
        this.shipmentNoExists = true;
      } else {
        this.shipmentNoExists = false;
      }
    });

    // volume change
    this.subscribeVolume();
    // bookingCancellationFlag
    this.subscribeToShipmentNumber();


    this.form.controls.bookingCancellationFlag.valueChanges.subscribe((data) => {
      if (data !== NaN && data >= 1) {
        const partFormArray = (<NgcFormArray>this.form.controls.partBookingList);

        for (let i = 0; i < (<NgcFormArray>this.form.controls.partBookingList).length; ++i) {
          const length = (<NgcFormArray>(<NgcFormGroup>(<NgcFormArray>
            this.form.controls.partBookingList).controls[i]).controls.singleShipmentFlightBookingList).length;
          for (let j = 0; j < length; ++j) {
            (<NgcFormGroup>
              (<NgcFormArray>(<NgcFormGroup>(<NgcFormArray>
                this.form.controls.partBookingList).controls[i]).controls.singleShipmentFlightBookingList)
                .controls[j]).controls.bookingCancellationFlag.setValue(1);
          }
        }
        // singleShipmentFlightBookingList
      }
    });
    this.createFirstBooking(null);
    this.subscribePiecesWeight();
    if (this.navigateData && this.navigateData.shipmentNumber) {
      this.form.get('shipmentNumber').patchValue(this.navigateData.shipmentNumber)
      this.onSearch(null);
    }
  }

  subscribePiecesWeight() {
    this.subscribedPieces = this.form.controls.pieces.valueChanges.subscribe(
      (selectedValue) => {
        let bookingData = this.form.getRawValue();
        if (bookingData.partBookingList && bookingData.partBookingList.length == 1) {
          (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('partPieces').setValue(this.form.get('pieces').value);
        }

        this.methodToCalculateRemainingPcsWt();
      }

    );
    this.subcribedWeight = this.form.controls.grossWeight.valueChanges.subscribe(
      (selectedValue) => {
        let bookingData = this.form.getRawValue();
        if (bookingData.partBookingList && bookingData.partBookingList.length == 1) {
          (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('partWeight').setValue(this.form.get('grossWeight').value);
        }
        this.methodToCalculateRemainingPcsWt();
      }
    );
  }

  unsubscribePiecesWeight() {
    this.subscribedPieces.unsubscribe();
    this.subcribedWeight.unsubscribe();
  }

  subscribeToShipmentNumber() {
  }

  unSubscribeToShipmentNumber() {
    // this.subscription.unsubscribe();
  }

  createFirstBooking(shcs: any) {
    (<NgcFormArray>this.form.controls.partBookingList).patchValue([this.eachPartBooking]);
    this.subscribeOnCheckBox();
    // this.subscribeOnCheckBox();
    (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[0]).get('partIdentifier').setValue('I');
    this.onAddFlight(0);
    // if master shcs present then add  in flight line item
    if (shcs) {
      (<NgcFormArray>(<NgcFormArray>this.form.controls.partBookingList).controls[0]).get('shcList').patchValue(shcs);
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.routeData = this.getNavigateData(this.activatedRoute);
    if (this.routeData && this.routeData.shipmentNumber) {
      this.form.get('shipmentNumber').setValue(this.routeData.shipmentNumber);
      this.onSearch(null);
    }
  }

  subscribeOnCheckBox() {
    const length = (<NgcFormArray>this.form.controls.partBookingList).length;
    for (let i = 0; i < length; ++i) {
      (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[i]).get('mergeSelect')
        .valueChanges.subscribe((e) => {
          if (e) {
            ++this.noOfAccordionsSelected;
          } else {
            --this.noOfAccordionsSelected;
          }
        });
    }
  }


  setTTFlag() {
  }

  onSuccessfulOperationCompletion(resp) {
    this.response = resp;
    (<NgcFormArray>this.form.get('partBookingList')).resetValue([]);
    this.form.patchValue(this.response.data);
    if ((<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).
      controls[0]).get('partIdentifier').value === 'I') {
      (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).
        controls[0]).get('partIdentifier').setValue('N');
    }

    this.setTTFlag();
    this.subscribeOnCheckBox();
    this.searchDone = true;
    this.saveFlag = false;
  }
  /**
   * Searches booking corresponding to AWB Number
   *
   * @memberof BookSingleShipmentComponent
   */
  onSearch(redirect): void {

    this.deleteFlightEntries = [];
    const searchRequest: SearchSingleBookingShipment = this.formSearchObject();
    if (this.form.get('shipmentNumber').value === '') {
      this.showWarningStatus('export.awb.number.cannot.blank');
      return;
    }
    if (this.form.get('shipmentNumber').value.length > 11) {
      this.showInfoStatus('export.awb.number.max.length');
      return;
    }
    this.searchFocusFlag = false;
    //

    this.exportService.singleBookingShipmentSearch(searchRequest).subscribe((resp) => {
      this.response = resp;
      this.searchResponse = resp;
      this.bookingobjectForVolumeCodeChange = this.response.data;
      if (this.refreshFormMessages(resp)) {
        return;
      }
      if (resp.data != null) {
        if (resp.data.partBookingList != null) {
          resp.data.partBookingList.forEach(element => {
            element.singleShipmentFlightBookingList.forEach(ele => {
              if (ele.bookingStatusCode == 'UU') {
                this.checkBookingStatusCodeUU = true;
              }
              else {
                this.checkBookingStatusCodeUU = false;
              }
            });
          });

        }
      }
      this.unSubscribeToShipmentNumber();
      this.unsubscribePiecesWeight();
      this.searchFocusFlag = true;
      this.hideCreateNewBooking = this.response.success;
      if (this.response.success) {
        if (this.response.data.bookingNotExist) {
          if (!this.response.data.shipmentInShipmentMaster) {
            this.showInfoStatus('export.booking.doesnot.exist');
            this.async(() => {
              (this.form.get('origin') as NgcFormControl).focus();
            }, 50);
          }

          (<NgcFormArray>this.form.get('partBookingList')).resetValue([]);
          const shipmentNumber = this.form.controls.shipmentNumber.value;
          const blockSpace = this.form.controls.blockSpace.value;
          this.form1.reset();
          this.form = this.form1;
          if (!this.response.data.shipmentInShipmentMaster) {
            //this.subscribePiecesWeight();
            this.form.controls.shipmentNumber.setValue(shipmentNumber);
            this.form.controls.blockSpace.setValue(blockSpace);
            this.form.controls.flagInsert.setValue('Y');
            this.form.controls.flagUpdate.setValue('N');
            this.form.get('weightUnitCode').setValue('K');
            this.form.controls.serviceFlag.setValue(this.response.data.serviceFlag);
            //this.form.controls.forceBookingFlag.setValue(this.response.data.forceBookingFlag);
            if (this.routeData && this.routeData.isAwbReservation) {
              this.form.controls.origin.setValue(this.routeData.origin);
              this.form.controls.destination.setValue(this.routeData.destination);
            }
          } else {
            //this.subscribePiecesWeight();
            this.form.controls.shipmentNumber.setValue(this.response.data.shipmentNumber);
            this.form.controls.blockSpace.setValue(blockSpace);
            this.form.controls.flagInsert.setValue('Y');
            this.form.controls.flagUpdate.setValue('N');
            this.form.controls.origin.setValue(this.response.data.origin);
            this.form.controls.destination.setValue(this.response.data.destination);
            this.form.controls.pieces.setValue(this.response.data.pieces);
            this.form.controls.grossWeight.setValue(this.response.data.grossWeight);
            this.form.controls.weightUnitCode.setValue(this.response.data.weightUnitCode);
            this.form.controls.natureOfGoodsDescription.setValue(this.response.data.natureOfGoodsDescription);
            this.form.controls.serviceFlag.setValue(this.response.data.serviceFlag);
            if (this.response.data.proposedRouting) {
              this.form.controls.proposedRouting.setValue(this.response.data.proposedRouting);
            }
            //this.form.controls.forceBookingFlag.setValue(this.response.data.forceBookingFlag);
          }
          this.createFirstBooking(this.response.data.masterShcs);
          if (this.routeData && this.routeData.isAwbReservation) {
            const flight = (<NgcFormGroup>(<NgcFormArray>
              (<NgcFormGroup>
                (<NgcFormArray>this.form.controls.partBookingList)
                  .controls[0])
                .controls.singleShipmentFlightBookingList).controls[0]).controls;
            flight.flightKey.setValue(this.routeData.flightBookingList[0].flightKey);
            flight.flightOriginDate.setValue(this.routeData.flightBookingList[0].flightDate);
          }

          this.subscribePiecesWeight();
          this.setBookingPiecesWeight();
          this.subscribeVolume();
          return;
        }
        if (!this.response.data) {
          this.showInfoStatus('export.valid.awb.number');
          this.form.controls.origin.setValue('');
          this.searchDone = true;
          this.hideCreateNewBooking = false;
          this.shipmentNoExists = true;
          (<NgcFormArray>this.form.get('partBookingList')).resetValue([]);
        } else {
          this.setIncomingAndOutgoingFlightDetails(this.response.data);
          this.setTTFlag();
          this.form.patchValue(this.response.data);
          //this.subscribeOnCheckBox();
          this.searchDone = true;
          this.saveFlag = false;
          this.noOfAccordionsSelected = 0;
          this.form.get('shipmentNumber').disable();
          if (!redirect) {
            //this.showSuccessStatus('g.completed.successfully');
          }
        }

      } else {
        this.errors = this.response.messageList;
        this.showErrorStatus(this.errors[0].message);
        (<NgcFormArray>this.form.get('partBookingList')).resetValue([]);
        const shipmentNumber = this.form.controls.shipmentNumber.value;
        const blockSpace = this.form.controlsblockSpace.value;
        this.form1.reset();
        this.form = this.form1;
        // this.form.reset();
        this.form.controls.shipmentNumber.setValue(shipmentNumber);
        this.form.controls.blockSpace.setValue(blockSpace);
        this.form.controls.flagInsert.setValue('Y');
        this.form.controls.flagUpdate.setValue('N');
        this.form.get('weightUnitCode').setValue('K');
        this.form.get('volumeUnitCode').setValue('MC');
        this.form.controls.serviceFlag.setValue(this.response.data.serviceFlag);
        //this.form.controls.forceBookingFlag.setValue(this.response.data.forceBookingFlag);
        this.createFirstBooking(null);
        if (this.errors[0].message === 'Invalid AWB number') {
          this.searchDone = false;
          this.subscribeToShipmentNumber();
          this.subscribePiecesWeight();
          this.subscribeVolume();
          return;
        }
        this.searchDone = true;
        // this.searchButton.disabled = false;
      }
      this.subscribeToShipmentNumber();
      this.methodToSetflightBookingPcsWt();
      this.subscribePiecesWeight();
      this.subscribeOnCheckBox();
      this.enableAddPartOrNot();
      this.subscribeVolume();

      if (!this.response.data.bookingNotExist && this.form.get('origin').value != null && this.form.get(['partBookingList', 0]).get('singleShipmentFlightBookingList').value == null) {
        this.async(() => {
          (this.form.get(['partBookingList', 0]).get(['singleShipmentFlightBookingList', 0]) as NgcFormControl).focus();
        }, 1);
      } else if (!this.response.data.bookingNotExist) {
        this.async(() => {
          (this.form.get('origin') as NgcFormControl).focus();
        }, 50);
      }
      if (resp.data != null) {

        if (resp.data.shipmentBookingDimensionList != null && resp.data.shipmentBookingDimensionList.length > 0) {
          let unitCode = resp.data.shipmentBookingDimensionList[0].unitCode;
          let volumeUnitCode = resp.data.shipmentBookingDimensionList[0].volumeUnitCode;
          if (unitCode != null) {
            this.form.get('measurementUnitCode').setValue(unitCode);
          }
          else {
            this.form.get('measurementUnitCode').setValue("CMT");
          }
          if (volumeUnitCode != null) {
            this.form.get('volumeUnitCode').setValue(volumeUnitCode);
          }
          else {
            this.form.get('volumeUnitCode').setValue("MC");
          }

        } else {
          this.form.get('measurementUnitCode').setValue("CMT");
          this.form.get('volumeUnitCode').setValue("MC");
        }

      }
    });

  }
  subscribeVolume() {
    for (let i = 0; i < this.form.get('partBookingList').value.length; i++) {
      this.form.get(['partBookingList', i, 'volume']).valueChanges.subscribe(volResp => {
        let density = this.form.get(['partBookingList', i, 'densityGroupCode']).value;
        let partWeight = this.form.get(['partBookingList', i, 'partWeight']).value;
        if (density && partWeight) {
          const dimention: Dimention = new Dimention();
          dimention.weightCode = this.form.get('weightUnitCode').value;
          dimention.dg = density;
          dimention.shipmentWeight = partWeight;
          this.exportService.getVolumeByDensity(dimention).subscribe(resp => {
            if (resp && resp != volResp) {
              this.form.get(['partBookingList', i, 'densityGroupCode']).setValue(null);
            }
          });
        }
      });
    }
  }
  enableAddPartOrNot() {
    let bookingData = this.form.getRawValue();
    let totalPcs = 0;
    let totalWt = 0;
    for (let i = 0; i < bookingData.partBookingList.length; i++) {
      totalPcs = totalPcs + bookingData.partBookingList[i].partPieces;
      totalWt = totalWt + bookingData.partBookingList[i].partWeight;
    }
    if (totalPcs == bookingData.pieces && totalWt == bookingData.grossWeight) {
      this.enableAddPart = false;
    } else {
      this.enableAddPart = true;
    }
  }
  methodToSetflightBookingPcsWt() {
    let bookingFormValues = this.form.getRawValue();
    if (bookingFormValues && bookingFormValues.partBookingList.length == 1) {
      let flightDetails = bookingFormValues.partBookingList[0].singleShipmentFlightBookingList;
      if (!(flightDetails && flightDetails.length > 0)) {
        const pieces = this.form.get('pieces').value;
        const grossWeight = this.form.get('grossWeight').value;
        (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('partPieces').setValue(pieces);
        (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('partWeight').setValue(grossWeight);
        if (this.volumeAmount) {
          (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('volume').setValue(this.volumeAmount, { onlySelf: true, emitEvent: false });
        }
        if (this.volumeUnitCode) {
          (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('volumeUnitCode').setValue(this.volumeUnitCode);
        }
        if (this.densityGroupCode) {
          (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('densityGroupCode').setValue(this.densityGroupCode);
        }
      }

    }
  }

  setBookingPiecesWeight() {
    const pieces = this.form.get('pieces').value;
    const grossWeight = this.form.get('grossWeight').value;

    (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('partPieces').setValue(pieces);
    (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('partWeight').setValue(grossWeight);
  }

  /**
   * Opens the pop up for viewing/editing dimensions of each part booking
   *
   * @param {number} index
   * @memberof BookSingleShipmentComponent
   */
  onPopUp(index: number): void {
    this.updateTotalshipment(index);
    this.setDimentionValues(index);
    this.window.toArray()[index].open();
  }


  onPopup() {
    this.updateTotalshipmentDimension();
    this.setBookingDimentionValues();
    this.windows.open();
  }

  /**
   * Opens the pop up for viewing/editing dimensions of each part booking
   *
   * @param {number} index
   * @memberof BookSingleShipmentComponent
   */
  onClosePopUp(index: number): void {
    this.window.toArray()[index].close();
  }

  onCloseDimPopUp() {
    this.windows.close();
  }

  /**
   * Deletes a part booking
   *
   * @param {number} index
   * @memberof BookSingleShipmentComponent
   */
  onDelete(index: number): void {
    if ((<NgcFormGroup>(<NgcFormArray>
      this.form.controls.partBookingList).controls[index]).get('flagInsert').value === 'Y') {
      (<NgcFormArray>this.form.controls.partBookingList).deleteValueAt(index);
      return;
    }



    (<NgcFormGroup>this.form.get(['partBookingList', index])).get('flagDelete').setValue('Y');
    (<NgcFormGroup>this.form.get(['partBookingList', index])).get('flagUpdate').setValue('N');
    (<NgcFormGroup>this.form.get(['partBookingList', index])).get('flagCRUD').setValue('D');
  }

  /**
   * Forms request object for a part booking deletion
   *
   * @param {any} formRawValue
   * @param {number} index
   * @returns {SearchSingleBookingShipment}
   * @memberof BookSingleShipmentComponent
   */
  formDeleteObject(formRawValue, index: number) {
    const response = formRawValue;
    // delete response.partBookingList;
    // response.partBookingList = [this.form.getRawValue().partBookingList[index]];
    delete response.partBookingList[index].flagInsert;
    delete response.partBookingList[index].flagUpdate;
    response.partBookingList[index].flagDelete = 'Y';
    response.blockSpace = Number(response.blockSpace);
    response.serviceFlag = Number(response.serviceFlag);
    response.bookingId = Number(response.bookingId);
    delete response.bookingCancellationFlag;
    response.densityGroupCode = response.densityGroupCode;
    return response;
  }

  /**
   * Forms request object for searching booking
   *
   * @param {any}
   * @returns {SearchSingleBookingShipment}
   * @memberof BookSingleShipmentComponent
   */
  formSearchObject(): SearchSingleBookingShipment {
    const resp = new SearchSingleBookingShipment();
    resp.shipmentNumber = this.form.get('shipmentNumber').value;
    resp.blockSpace = Number(this.form.get('blockSpace').value);
    resp.suffix = '';
    resp.flightKeyList = null;
    return resp;
  }

  /**
   * Forms request object for merge booking
   *
   * @returns {SearchSingleBookingShipment}
   * @memberof BookSingleShipmentComponent
   */
  formMergeObject(): SearchSingleBookingShipment {
    const formRawValue = this.form.getRawValue();
    const formMergeRequest = this.form.getRawValue();
    delete formMergeRequest.partBookingList;
    // densityGroupCode
    formMergeRequest.densityGroupCode = formMergeRequest.densityGroupCode;
    formMergeRequest.partBookingList = [];
    for (const eachRow of formRawValue.partBookingList) {
      if (eachRow.mergeSelect && formMergeRequest.partBookingList.length < 2) {
        formMergeRequest.partBookingList.push(eachRow);
      }
      if (formMergeRequest.partBookingList.length >= 3) {
        this.showErrorStatus('export.only.two.part.bookings.can.be.merge');
        return new SearchSingleBookingShipment();
      }
    }
    formMergeRequest.blockSpace = Number(formMergeRequest.blockSpace);
    formMergeRequest.serviceFlag = Number(formMergeRequest.serviceFlag);
    delete formMergeRequest.bookingCancellationFlag;
    return formMergeRequest;
  }

  /**
   * Merges two booking parts
   *
   * @memberof BookSingleShipmentComponent
   */
  onMergeBooking(): void {
    // if (!this.form.get('bookingCancellationFlag').value) {
    //   this.showErrorStatus('export.reason.for.cancellation.required');
    //   return;
    // }
    const formMergeRequest = this.formMergeObject();
    this.exportService.singleBookingShipmentMergePart(formMergeRequest).subscribe((resp) => {
      this.response = resp;
      if (this.response.success) {
        this.refreshFormMessages(this.response);
        this.showSuccessStatus('g.completed.successfully');
        // this.onSuccessfulOperationCompletion(resp);
        this.onSearch('redirect');
      } else {
        this.refreshFormMessages(this.response);
        this.errors = this.response.messageList;
      }
    });
  }

  /**
   *  Deletes dimension row(s) of the corresponding part booking
   *
   * @param {any} index
   * @memberof BookSingleShipmentComponent
   */
  onDeleteDimensionRow(index: number): void {
    const formValue = this.form.getRawValue();
    const partBooking = formValue.partBookingList[index];
    const deleteDimension = new Array<any>();
    partBooking.shipmentPartBookingDimensionList.forEach(element => {
      if (element.checkBoxFlag) {
        deleteDimension.push(element);
      }
    });

    const n = (<NgcFormArray>
      (<NgcFormGroup>
        (<NgcFormArray>this.form.controls.partBookingList)
          .controls[index])
        .controls.shipmentPartBookingDimensionList).length;
    (<NgcFormArray>(<NgcFormGroup>(<NgcFormArray>
      this.form.controls['partBookingList']).controls[index]).controls['shipmentPartBookingDimensionList'])
      .deleteValue(deleteDimension);
    this.cd.detectChanges();
  }

  onDeleteShipDimension() {
    const formValue = this.form.getRawValue();
    const shipmentBookingDimension = formValue.shipmentBookingDimensionList;
    const deleteDimension = new Array<any>();
    shipmentBookingDimension.forEach(element => {
      if (element.checkBoxFlag) {
        deleteDimension.push(element);
      }
    });
    (<NgcFormArray>this.form.controls['shipmentBookingDimensionList']).deleteValue(deleteDimension);
    this.cd.detectChanges();
  }

  /**
   * Creates a new booking
   *
   * @memberof BookSingleShipmentComponent
   */
  onCreateNewBooking(): void {
    this.hideCreateNewBooking = true;

    (<NgcFormArray>this.form.controls.partBookingList).patchValue([this.eachPartBooking]);
    this.subscribeOnCheckBox();
    // this.subscribeOnCheckBox();
    (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[0]).get('partIdentifier').setValue('I');
    (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[0])
      .get('partPieces').setValue(this.form.get('pieces').value);
    (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[0])
      .get('partWeight').setValue(this.form.get('grossWeight').value);
    // this.setDummyValue();
  }

  /**
   * Creates a new part for the corresponding booking
   *
   * @memberof BookSingleShipmentComponent
   */
  onCreatePartBooking(index): void {

    this.form.get(['partBookingList', index]).get('partPiecesWtFlag').setValue(true);
    this.form.get(['partBookingList', index]).get('createPartInvocationFlag').setValue(true);
    for (let i = 0; i < (<NgcFormArray>this.form.controls.partBookingList).length; ++i) {
      if ((<NgcFormArray>this.form.controls.partBookingList).length == 1) {
        this.form.get('primaryPart').setValue(true);
        (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[0]).get('partIdentifier').setValue('Y');
        if (this.form.controls.partBookingList.controls[0].get('partSuffix').value == null)
          (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[0]).get('partSuffix').setValue('P');

      }
      if ((<NgcFormArray>
        (<NgcFormGroup>
          (<NgcFormArray>this.form.controls.partBookingList)
            .controls[i])
          .controls.singleShipmentFlightBookingList).length === 0) {
        this.showErrorStatus(NgcUtility.translateMessage('error.add.atleast.one.flight.segment', [(index + 1)]));
        return;
      }
    }

    // (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[0]).get('partIdentifier').setValue('Y');
    const noOfAccordions = (<NgcFormArray>this.form.controls.partBookingList).length;
    // (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[0]).get('partSuffix').setValue('P');
    this.eachPartBooking.partSuffix = '';
    //get SHC from part
    let shcList = ((<NgcFormGroup>this.form.get(['partBookingList', index])).getRawValue()).shcList;
    let parentPieces = ((<NgcFormGroup>this.form.get(['partBookingList', index])).getRawValue()).partPieces;
    let parentWeight = ((<NgcFormGroup>this.form.get(['partBookingList', index])).getRawValue()).partWeight;
    shcList.forEach(t => t.flagCRUD = "C");
    this.eachPartBooking.shcList = shcList;
    this.eachPartBooking.parentPieces = parentPieces;
    this.eachPartBooking.parentWeight = parentWeight;
    this.eachPartBooking.fromCreatePart = true;
    this.eachPartBooking.createPartInvocationFlag = true;
    (<NgcFormArray>this.form.controls.partBookingList).addValue([this.eachPartBooking]);

    const i = (<NgcFormArray>this.form.controls.partBookingList).length - 1;

    // setting the focus to newly added part accordian
    this.async(() => {
      (this.form.get(['partBookingList', i, 'partPieces']) as NgcFormControl).focus();
    }, 1);

    if (!(<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList)
      .controls[noOfAccordions - 1]).get('partSuffix').value) {
      const searchRequest: SearchSingleBookingShipment = this.formSearchObject();
      if (this.form.get(['partBookingList', index]).get('singleShipmentFlightBookingList').value) {
        let flightKsyList = this.form.get(['partBookingList', index]).get('singleShipmentFlightBookingList').value.map(t => t.flightKey);
        searchRequest.flightKeyList = flightKsyList;
      }
      this.getTwoPartSuffix(searchRequest);
    } else {
      const searchRequest: SearchSingleBookingShipment = this.formSearchObject();
      searchRequest.originalSuffix = (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList)
        .controls[index]).get('partSuffix').value;
      if (this.form.get(['partBookingList', index]).get('singleShipmentFlightBookingList').value) {
        let flightKsyList = this.form.get(['partBookingList', index]).get('singleShipmentFlightBookingList').value.map(t => t.flightKey);
        searchRequest.flightKeyList = flightKsyList;
      }
      this.getOnePartSuffix(searchRequest);
    }

    this.subscribePartPiecesWeight(index, i);
    //this.unsubscribePartPiecesWeight();
    //get SHC from part
    const partlength = (<NgcFormArray>this.form.get('partBookingList')).length;
    let arr: any[] = [];
    (<NgcFormArray>this.form.get(['partBookingList', index]).get('singleShipmentFlightBookingList')).controls.forEach((shipmentRecord: NgcFormGroup) => {


      arr.push({
        flagInsert: 'Y',
        bookingPieces: shipmentRecord.get('bookingPieces').value,
        bookingWeight: shipmentRecord.get('bookingWeight').value,
        flightKey: shipmentRecord.get('flightKey').value,
        flightId: null,
        flightSegmentId: null,
        flightOriginDate: shipmentRecord.get('flightOriginDate').value,
        flightBoardPoint: shipmentRecord.get('flightBoardPoint').value,
        flightOffPoint: shipmentRecord.get('flightOffPoint').value,
        bookingStatusCode: shipmentRecord.get('bookingStatusCode').value,
        dateSTA: shipmentRecord.get('dateSTA').value,
        dateSTD: shipmentRecord.get('dateSTD').value,
        shcList: [],
        bookingCancellationFlag: 0,
        densityGroupCode: null,
        volume: 0.0,
        flagUpdate: 'N',
        volumeUnitCode: '',
        totalDimentionVolumetricWeight: 0.0,
        isFLightDeparted: false,
        fromCreatePart: true
      });

    });
    (<NgcFormArray>this.form.get(['partBookingList', partlength - 1, 'singleShipmentFlightBookingList'])).patchValue(arr);

    this.bookingobjectForVolumeCodeChange = this.form.getRawValue();
    // volume change
    this.subscribeVolume();

  }

  subscribePartPiecesWeight(index, i) {
    const partPiece = (<NgcFormGroup>this.form.get(['partBookingList', index])).get('partPieces').value;
    const partWeight = (<NgcFormGroup>this.form.get(['partBookingList', index])).get('partWeight').value;
    const partVolume = (<NgcFormGroup>this.form.get(['partBookingList', index])).get('volume').value;

    this.subscribedPartPieces = (<NgcFormGroup>this.form.get(['partBookingList', i])).get('partPieces').valueChanges.subscribe((selectedValue) => {
      (<NgcFormGroup>this.form.get(['partBookingList', index])).get('partPieces').setValue(partPiece -
        (<NgcFormGroup>this.form.get(['partBookingList', i])).get('partPieces').value);

      (<NgcFormGroup>this.form.get(['partBookingList', i])).get('volume').setValue(((partVolume / partPiece) *
        Number(NgcUtility.getDisplayWeight((<NgcFormGroup>this.form.get(['partBookingList', i])).get('partPieces').value))), { onlySelf: true, emitEvent: false });

      (<NgcFormGroup>this.form.get(['partBookingList', index])).get('volume').setValue(partVolume -
        (<NgcFormGroup>this.form.get(['partBookingList', i])).get('volume').value, { onlySelf: true, emitEvent: false });

      // check part pieces to enable volume input
      let partObject = this.form.get(['partBookingList', index]).getRawValue();
      if (partObject.shipmentPartBookingDimensionList && partObject.shipmentPartBookingDimensionList.length > 0) {
        // check sum of pcs == part pcs
        let sumOfDimPcs = 0;
        let dimVolumeCode;
        partObject.shipmentPartBookingDimensionList.forEach(t => {
          sumOfDimPcs = sumOfDimPcs + t.pieces;
        });
        if (sumOfDimPcs == partObject.partPieces) {
          this.form.get(['partBookingList', index]).get('volumeDisabledFlag').setValue(true);
        } else {
          this.form.get(['partBookingList', index]).get('volumeDisabledFlag').setValue(false);
        }
      } else {
        this.form.get(['partBookingList', index]).get('volumeDisabledFlag').setValue(false);
      }
    });

    this.subcribedPartWeight = (<NgcFormGroup>this.form.get(['partBookingList', i])).get('partWeight').valueChanges.subscribe((selectedValue) => {
      (<NgcFormGroup>this.form.get(['partBookingList', index])).get('partWeight').setValue(partWeight -
        (<NgcFormGroup>this.form.get(['partBookingList', i])).get('partWeight').value);
    });
  }

  unsubscribePartPiecesWeight() {
    this.subscribedPartPieces.unsubscribe();
    this.subcribedPartWeight.unsubscribe();
  }

  /**
   * On Merge Select
   *
   * @param event Event
   * @param index Index
   */
  private onMergeSelect(event, index): void {
    const mergeSelectList: NgcFormArray = this.form.get(['partBookingList']) as NgcFormArray;
    //
    if (mergeSelectList) {
      this.noOfAccordionsSelected = 0;
      //
      mergeSelectList.controls.forEach((formGroup: NgcFormGroup) => {
        const mergeSelectControl: NgcFormControl = formGroup.get('mergeSelect') as NgcFormControl;
        //
        if (mergeSelectControl.value === true) {
          this.noOfAccordionsSelected++;
        } else {
          this.noOfAccordionsSelected--;
        }
      });
    }
  }

  /**
   * Adds a new flight to the corresponding part booking
   *
   * @param {any} index
   * @memberof BookSingleShipmentComponent
   */
  onAddFlight(index): void {
    // if (index != 0) {
    const length = (<NgcFormArray>
      (<NgcFormGroup>
        (<NgcFormArray>this.form.controls.partBookingList)
          .controls[index])
        .controls.singleShipmentFlightBookingList).length;

    if ((<NgcFormArray>
      (<NgcFormGroup>
        (<NgcFormArray>this.form.controls.partBookingList)
          .controls[index])
        .controls.singleShipmentFlightBookingList).invalid) {
      this.showErrorStatus('export.fill.in.mandatory.details');
      return;
    }
    // }

    (<NgcFormArray>
      (<NgcFormGroup>
        (<NgcFormArray>this.form.controls.partBookingList)
          .controls[index])
        .controls.singleShipmentFlightBookingList).addValue([
          this.eachFlightRow
        ]);

    this.methodToCalculateRemainingPcsWt();
  }

  /**
   * Add a new dimension to the corresponding part booking
   *
   * @param {number} index
   * @memberof BookSingleShipmentComponent
   */
  onAddDimension(index: number): void {
    if ((<NgcFormArray>
      (<NgcFormGroup>
        (<NgcFormArray>this.form.controls.partBookingList)
          .controls[index])
        .controls.shipmentPartBookingDimensionList).invalid) {
      this.showErrorStatus('export.fill.in.mandatory.details');
      return;
    }
    const dimensionList = (<NgcFormArray>
      (<NgcFormGroup>
        (<NgcFormArray>this.form.controls.partBookingList)
          .controls[index])
        .controls.shipmentPartBookingDimensionList).getRawValue();

    const n = (<NgcFormArray>
      (<NgcFormGroup>
        (<NgcFormArray>this.form.controls.partBookingList)
          .controls[index])
        .controls.shipmentPartBookingDimensionList).length;

    (<NgcFormArray>
      (<NgcFormGroup>
        (<NgcFormArray>this.form.controls.partBookingList)
          .controls[index])
        .controls.shipmentPartBookingDimensionList).addValue([
          this.eachDimensionRow
        ]);

    this.cd.detectChanges();
  }
  onAddShipDimension(index: number): void {
    if ((<NgcFormArray>this.form.controls['shipmentBookingDimensionList']).invalid) {
      this.showErrorStatus('export.fill.in.mandatory.details');
      return;
    }

    (<NgcFormArray>this.form.controls['shipmentBookingDimensionList']).addValue([
      this.eachDimensionRow
    ]);
    this.cd.detectChanges();
  }
  /**
   * Deletes flight row
   *
   * @param {number} index
   * @param {number} subIndex
   * @memberof BookSingleShipmentComponent
   */
  onDeleteFlightRow(index: number, subIndex: number): void {

    if (!this.form.get('bookingCancellationReason').value || this.form.get('bookingCancellationReason').value.length === 0) {
      this.showErrorStatus('export.reason.for.cancellation.required');
      return;
    }

    const formRawValue = this.form.getRawValue();
    //CHECK FOR TOTAL BOOKING fLIGHT DELETE
    if (formRawValue && formRawValue.partBookingList.length == 1) {
      let flightDetails = formRawValue.partBookingList[0].singleShipmentFlightBookingList;
      if (flightDetails && flightDetails.length == 1) {
        const pieces = this.form.get('pieces').value;
        const grossWeight = this.form.get('grossWeight').value;
        this.densityGroupCode = (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('densityGroupCode').value;
        this.volumeAmount = (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('volume').value;
        this.volumeUnitCode = (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('volumeUnitCode').value;

      }

    }
    if (formRawValue.partBookingList[index].singleShipmentFlightBookingList[subIndex].flagUpdate === 'Y') {
      if (!this.deleteFlightEntries[index]) {
        formRawValue.partBookingList[index].singleShipmentFlightBookingList[subIndex].flagInsert = 'N';
        formRawValue.partBookingList[index].singleShipmentFlightBookingList[subIndex].flagUpdate = 'N';
        formRawValue.partBookingList[index].singleShipmentFlightBookingList[subIndex].flagDelete = 'Y';
        this.deleteFlightEntries[index] =
          [formRawValue.partBookingList[index].singleShipmentFlightBookingList[subIndex]];
      } else {
        formRawValue.partBookingList[index].singleShipmentFlightBookingList[subIndex].flagInsert = 'N';
        formRawValue.partBookingList[index].singleShipmentFlightBookingList[subIndex].flagUpdate = 'N';
        formRawValue.partBookingList[index].singleShipmentFlightBookingList[subIndex].flagDelete = 'Y';
        this.deleteFlightEntries[index]
          .push(formRawValue.partBookingList[index].singleShipmentFlightBookingList[subIndex]);
      }
      this.exportService.deleteFlightBooking(formRawValue).subscribe((resp) => {
        if (resp.success) {
          this.showInfoStatus('export.flight.booking.deleted.sucessfully');
          this.onSearch('redirect');

        } else {
          this.showResponseErrorMessages(resp);
        }
      });
    }
    else {
      (<NgcFormArray>
        (<NgcFormGroup>
          (<NgcFormArray>this.form.controls.partBookingList)
            .controls[index])
          .controls.singleShipmentFlightBookingList).deleteValueAt(subIndex);
    }

  }

  packageDetailObject() {
    let packageDetail = {
      'serviceFlag': '',
      'shipmentNumber': '',
      'origin': '',
      'destination': '',
      'pieces': '',
      'grossWeight': '',
      'weightUnitCode': '',
      'natureOfGoodsDescription': '',
      'forceBookingFlag': '',
    }
    return packageDetail;
  }

  flightDetailObject() {
    let elementData = {
      'partSuffix': '',
      'partPieces': '',
      'flightKey': '',
      'flightOriginDate': '',
      'bookingStatusCode': '',
      'flightBookingStatus': '',
      'flightKeyTwo': '',
      'flightOriginDateTwo': '',
      'bookingStatusCodeTwo': '',
      'flightBoardPoint': '',
      'flightOffPoint': '',
    }
    return elementData;
  }

  bookShipment() {
    const saveRequest = this.form.getRawValue();
    // this.form.get('commitTransaction').setValue('SV');
    this.exportService.singleBookingShipmentSave(saveRequest).subscribe((resp) => {
      this.response = resp;
      if (resp.data.flagUpdate == 'N' && resp.data.flagUpdate == 'Y') {
        resp.data.commitTransaction = 'T';
      }
      this.checkArray = resp.data;
      if (this.response.success === true) {
        // if (this.response.reConfirmationFlag == true) {}
        this.flightValueArray = [];
        this.packageDetails = this.packageDetailObject();

        this.packageDetails.serviceFlag = 0;
        this.packageDetails.forceBookingFlag = 0;
        this.packageDetails.shipmentNumber = resp.data.shipmentNumber;
        this.packageDetails.origin = resp.data.origin;
        this.packageDetails.destination = resp.data.destination;
        this.packageDetails.pieces = resp.data.pieces;
        this.packageDetails.grossWeight = resp.data.grossWeight;
        this.packageDetails.weightUnitCode = resp.data.weightUnitCode;
        this.packageDetails.natureOfGoodsDescription = resp.data.natureOfGoodsDescription;
        let partPieces = (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('partPieces').value;
        let partWeight = (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('partWeight').value;
        let partSuffixValue = resp.data.partSuffix;
        let finalPiecesWeightData = partPieces + '/' + partWeight;
        let icmsStatus = resp.data.validateBookingFlightType != null &&
          resp.data.validateBookingFlightType.length > 0 ? resp.data.validateBookingFlightType[0].flightBookingStatus : resp.data.validateBookingFlightType;
        resp.data.partBookingList[0].singleShipmentFlightBookingList.forEach(element => {
          let elementData = this.flightDetailObject();
          elementData['partSuffix'] = partSuffixValue
          elementData['partPieces'] = finalPiecesWeightData
          elementData['flightKey'] = element.flightKey
          elementData['flightOriginDate'] = element.flightOriginDate
          elementData['bookingStatusCode'] = element.bookingStatusCode
          elementData['flightKeyTwo'] = element.flightKey
          elementData['bookingStatusCodeTwo'] = element.bookingStatusCode
          elementData['flightOriginDateTwo'] = element.flightOriginDate
          elementData['flightBoardPoint'] = element.flightBoardPoint
          elementData['flightOffPoint'] = element.flightOffPoint
          elementData['flightBookingStatus'] = icmsStatus
          this.flightValueArray.push(elementData);
        });
        if (this.flightValueArray.length > 0) {
          this.flightValueArray.forEach(flightData => {
            if (flightData.bookingStatusCode == icmsStatus || this.checkBookingStatusCodeUU == true) {
              if (resp.data.flagUpdate == 'Y' && (flightData.bookingStatusCode == 'SB' || flightData.bookingStatusCode == 'SS')) {
                resp.data.commitTransaction = 'B';
                this.checkArray = [];
                this.checkArray = resp.data;
              }
              this.onSaveNew();
            }
            else {
              this.bookshipment.open();
            }
          })
        }


      } else if (this.response.success === false) {
        this.showErrorMessage("Unable to call the API");
      }
    });

  }

  onSaveNew() {
    // this.form.get('commitTransaction').setValue('S');
    this.checkArray.userOverrideFlag = "Y";
    this.exportService.singleBookingShipmentSave(this.checkArray).subscribe((resp) => {
      this.response = resp;
      if (this.response.success == true) {
        if (this.showResponseErrorMessages(this.response)) {
          return;
        }
        this.showSuccessStatus('g.completed.successfully');
        this.bookshipment.hide();
        this.onSearch('redirect');
      } else if (this.response.success == false) {
        this.showResponseErrorMessages(this.response);
      }
    });
  }

  cancel() {
    this.checkArray.userOverrideFlag = "N";
    this.exportService.singleBookingShipmentSave(this.checkArray).subscribe((resp) => {
      this.response = resp;
      if (this.response.success == true) {
        if (this.showResponseErrorMessages(this.response)) {
          return;
        }
        this.showSuccessStatus('g.completed.successfully');
        this.bookshipment.hide();
        this.onSearch('redirect');
      } else if (this.response.success == false) {
        this.showResponseErrorMessages(this.response);
      }

    });
  }

  // cancel() {
  //   this.bookshipment.hide();
  // }


  statusChangeUUtoSB(singleShipmentFlightBookingList) {
    const resp = this.searchResponse.data;
    if (resp.partBookingList != null && resp.partBookingList != '') {
      if (singleShipmentFlightBookingList.flightBoardPoint == 'SIN' || singleShipmentFlightBookingList.flightOffPoint == 'SIN') {
        for (const eachRow of resp.partBookingList) {
          for (const eachFlightRow of eachRow.singleShipmentFlightBookingList) {
            if (eachFlightRow.flightId == singleShipmentFlightBookingList.flightId && eachFlightRow.bookingStatusCode == 'UU' && (singleShipmentFlightBookingList.bookingStatusCode == 'SS' || singleShipmentFlightBookingList.bookingStatusCode == 'SB')) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }


  /**
   * Saves the operations in database
   *
   * @memberof BookSingleShipmentComponent
   */
  onSave(): void {
    if (this.form.get('shipmentNumber').value == null ||
      this.form.get('shipmentNumber').value.length === 0) {
      this.showErrorStatus('export.enter.shipment.number');
      return;
    }
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Icms)) {
      this.form.get('commitTransaction').setValue('SV');
    } else {
      this.form.get('commitTransaction').setValue('');
    }
    const saveRequest = this.form.getRawValue();
    saveRequest.blockSpace = Number(saveRequest.blockSpace);
    saveRequest.serviceFlag = Number(saveRequest.serviceFlag);
    saveRequest.forceBookingFlag = Number(saveRequest.forceBookingFlag);
    const noOfAccordions = saveRequest.partBookingList.length;

    for (const eachRow of saveRequest.partBookingList) {
      // eachRow.densityGroupCode = eachRow.densityGroupCode;
      for (const eachflightRow of eachRow.singleShipmentFlightBookingList) {

        if (eachflightRow.bookingStatusCode == 'XX' && eachflightRow.flagCRUD == 'U'
          && eachRow.flagCRUD == 'U') {
          if (!this.form.get('bookingCancellationReason').value ||
            this.form.get('bookingCancellationReason').value.length === 0
          ) {
            this.showErrorStatus('export.reason.for.cancellation.required');
            return;
          }

        }
        eachflightRow.shcList = eachRow.shcList.length === 0 ? null : eachRow.shcList;
        eachflightRow.bookingPieces = eachRow.partPieces;
        eachflightRow.bookingWeight = eachRow.partWeight;
        eachflightRow.workingListRemarks = eachRow.workingListRemarks;
        eachflightRow.manifestRemarks = eachRow.manifestRemarks;
        eachflightRow.additionalRemarks = eachRow.additionalRemarks;
        eachflightRow.throughTransitFlag = Number(eachRow.throughTransitFlag);
        eachflightRow.dateSTA = eachflightRow.dateSTA;
        eachflightRow.dateSTD = eachflightRow.dateSTD;
        eachflightRow.densityGroupCode = eachRow.densityGroupCode;
        eachflightRow.volume = eachRow.volume;
        eachflightRow.volumeUnitCode = eachRow.volumeUnitCode;
        eachflightRow.totalDimentionVolumetricWeight = eachRow.totalDimentionVolumetricWeight;
        eachflightRow.measurementUnitCode = eachRow.measurementUnitCode;
        // eachflightRow.flightId = eachRow.flightId;
        // eachflightRow.flightSegmentId = eachRow.flightSegmentId
        if (NgcUtility.isTenantAirport(eachflightRow.flightBoardPoint)) {
          eachRow.flightRoute = eachflightRow.flightOffPoint;
          saveRequest.flightKeyForCarrier = eachflightRow.flightKey;
        }
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Icms)) {
          if (saveRequest.commitTransaction != 'B') {
            if (this.statusChangeUUtoSB(eachflightRow)) {
              saveRequest.commitTransaction = 'B';
            }
          }
        }
      }
    }


    for (let index in this.deleteFlightEntries) {
      for (const eachDeleteRow of this.deleteFlightEntries[index]) {
        saveRequest.partBookingList[index].singleShipmentFlightBookingList.push(eachDeleteRow);
      }
    }

    this.exportService.singleBookingShipmentSave(saveRequest).subscribe((resp) => {
      this.response = resp;
      if (this.showResponseErrorMessages(this.response)) {
        return;
      }

      this.checkArray = resp.data;
      this.checkArray.commitTransaction = 'S';

      if (this.response.success) {
        if (this.response.data.reconfirmationFlag == true && this.response.data.commitTransaction != "B") {

          this.SaveClicked = true;
          this.flightValueArray = [];
          this.packageDetails = this.packageDetailObject();


          this.validateBookForm.get('shipmentNumber').setValue(resp.data.shipmentNumber);
          this.validateBookForm.get('serviceFlag').setValue(resp.data.serviceFlag);
          this.validateBookForm.get('origin').setValue(resp.data.origin);
          this.validateBookForm.get('destination').setValue(resp.data.destination);
          this.validateBookForm.get('pieces').setValue(resp.data.pieces);
          this.validateBookForm.get('grossWeight').setValue(resp.data.grossWeight);
          this.validateBookForm.get('weightUnitCode').setValue(resp.data.weightUnitCode);
          this.validateBookForm.get('natureOfGoodsDescription').setValue(resp.data.natureOfGoodsDescription);
          this.validateBookForm.get('forceBookingFlag').setValue(resp.data.forceBookingFlag);
          resp.data.partBookingList.forEach(ele => {
            let elementData = this.flightDetailObject();
            ele.singleShipmentFlightBookingList.forEach(element => {
              if (element.flightBoardPoint == 'SIN' || element.flightOffPoint == 'SIN') {
                var flightOriginDate = formatDate(element.flightOriginDate, 'ddMMMyyyy', 'en_US');
                elementData['partSuffix'] = ele.partSuffix
                elementData['partPieces'] = ele.partPieces + '/' + ele.partWeight.toFixed(1)
                if (element.flightBoardPoint == "SIN") {
                  elementData['flightKeyTwo'] = element.flightKey
                  elementData['bookingStatusCodeTwo'] = element.bookingStatusCode
                  elementData['flightOriginDateTwo'] = flightOriginDate
                  elementData['flightBoardPoint'] = element.flightBoardPoint
                  elementData['flightBookingStatusTwo'] = element.icmsBookingStatus
                }
                else if (element.flightOffPoint == "SIN") {
                  elementData['flightKey'] = element.flightKey
                  elementData['flightOriginDate'] = flightOriginDate
                  elementData['bookingStatusCode'] = element.bookingStatusCode
                  elementData['flightOffPoint'] = element.flightOffPoint
                  elementData['flightBookingStatus'] = element.icmsBookingStatus
                }
              }
            });
            this.flightValueArray.push(elementData);
          });

          this.bookshipment.open();

          this.deleteFlightEntries = [];
          // this.onSuccessfulOperationCompletion(this.response);
          // this.onSearch('redirect');
        } else if (this.response.data.reconfirmationFlag == false) {
          this.showSuccessStatus('g.completed.successfully');
          this.onSearch('redirect');
        }
      } else {
        if (this.response.data && this.response.data.routingMismatch) {
          this.showConfirmMessage(NgcUtility.translateMessage("export.segment.not.matching.shipment.routing.confirmation", [this.response.data.flightRouteWhichHasMismatch, this.response.data.shipmentRoute])).then(fulfilled => {
            saveRequest.ruleEngineWarningAndInfoMessage = null;
            saveRequest.skipRoutingValidation = true;
            this.exportService.singleBookingShipmentSave(saveRequest).subscribe((resp) => {
              this.response = resp;
              this.refreshFormMessages(this.response);
              if (this.response.success) {
                this.showSuccessStatus('g.completed.successfully');
                this.deleteFlightEntries = [];
                this.onSearch('redirect');
              } else {
                if (this.response.data && this.response.data.ruleEngineWarningAndInfoMessage) {
                  this.showConfirmMessage(this.response.data.ruleEngineWarningAndInfoMessage).then(fulfilled => {
                    saveRequest.ruleEngineWarningAndInfoMessage = null;
                    saveRequest.skipRuleEngineFlag = true;
                    this.exportService.singleBookingShipmentSave(saveRequest).subscribe((resp) => {
                      this.response = resp;
                      this.refreshFormMessages(this.response);
                      if (this.response.success) {
                        this.showSuccessStatus('g.completed.successfully');
                        this.deleteFlightEntries = [];
                        this.onSearch('redirect');
                      } else {
                        if (this.response.data && this.response.data.handoverShipment) {
                          this.showConfirmMessage("handover.confirmation.shipment").then(fulfilled => {
                            // saveRequest.ruleEngineWarningAndInfoMessage = null;
                            saveRequest.skipHandoverFlag = true;
                            this.exportService.singleBookingShipmentSave(saveRequest).subscribe((resp) => {
                              this.response = resp;
                              this.refreshFormMessages(this.response);
                              if (this.response.success) {
                                this.showSuccessStatus('g.completed.successfully');
                                this.deleteFlightEntries = [];
                                this.onSearch('redirect');
                              } else {
                                this.refreshFormMessages(this.response);
                              }
                            });
                          }).catch(reason => {
                            console.log('failed' + reason);
                          });
                        }
                      }
                    });
                  }).catch(reason => {
                    console.log('failed' + reason);
                  });
                }
                if (this.response.data && this.response.data.handoverShipment) {
                  this.showConfirmMessage("handover.confirmation.shipment").then(fulfilled => {
                    // saveRequest.ruleEngineWarningAndInfoMessage = null;
                    saveRequest.skipHandoverFlag = true;
                    this.exportService.singleBookingShipmentSave(saveRequest).subscribe((resp) => {
                      this.response = resp;
                      this.refreshFormMessages(this.response);
                      if (this.response.success) {
                        this.showSuccessStatus('g.completed.successfully');
                        this.deleteFlightEntries = [];
                        this.onSearch('redirect');
                      } else {
                        this.refreshFormMessages(this.response);
                      }
                    });
                  }).catch(reason => {
                  });
                }
              }
            });
          }).catch(reason => {
          });
        }
        if (this.response.data && this.response.data.ruleEngineWarningAndInfoMessage) {
          this.showConfirmMessage(this.response.data.ruleEngineWarningAndInfoMessage).then(fulfilled => {
            saveRequest.ruleEngineWarningAndInfoMessage = null;
            saveRequest.skipRuleEngineFlag = true;
            this.exportService.singleBookingShipmentSave(saveRequest).subscribe((resp) => {
              this.response = resp;
              this.refreshFormMessages(this.response);
              if (this.response.success) {
                this.showSuccessStatus('g.completed.successfully');
                this.deleteFlightEntries = [];
                this.onSearch('redirect');
              } else {
                if (this.response.data && this.response.data.handoverShipment) {
                  this.showConfirmMessage("handover.confirmation.shipment").then(fulfilled => {
                    // saveRequest.ruleEngineWarningAndInfoMessage = null;
                    saveRequest.skipHandoverFlag = true;
                    this.exportService.singleBookingShipmentSave(saveRequest).subscribe((resp) => {
                      this.response = resp;
                      this.refreshFormMessages(this.response);
                      if (this.response.success) {
                        this.showSuccessStatus('g.completed.successfully');
                        this.deleteFlightEntries = [];
                        this.onSearch('redirect');
                      } else {
                        this.refreshFormMessages(this.response);
                      }
                    });
                  }).catch(reason => {
                    console.log('failed' + reason);
                  });
                }
              }
            });
          }).catch(reason => {
            console.log('failed' + reason);
          });
        }
        if (this.response.data && this.response.data.handoverShipment) {
          this.showConfirmMessage("handover.confirmation.shipment").then(fulfilled => {
            // saveRequest.ruleEngineWarningAndInfoMessage = null;
            saveRequest.skipHandoverFlag = true;
            this.exportService.singleBookingShipmentSave(saveRequest).subscribe((resp) => {
              this.response = resp;
              this.refreshFormMessages(this.response);
              if (this.response.success) {
                this.showSuccessStatus('g.completed.successfully');
                this.deleteFlightEntries = [];
                this.onSearch('redirect');
              } else {
                this.refreshFormMessages(this.response);
              }
            });
          }).catch(reason => {
          });
        }
        this.refreshFormMessages(this.response);
        // this.errors = this.response.messageList;
        //  this.showErrorStatus(this.errors[0].message);
      }
      // this.form.reset();
    });
  }



  /**
   * Setting dummy values for creation
   *
   * @memberof BookSingleShipmentComponent
   */
  setDummyValue(): void {
    const dummy = new Dummy();
    // this.form.patchValue(dummy.val);
  }

  onSelectShipper(event) {
  }

  setIncomingAndOutgoingFlightDetails(formRawValue) {
    if (formRawValue.partBookingList.length != 1) {
      this.collapseExpand = false;
    }
    for (const partBooking of formRawValue.partBookingList) {
      for (const flight of partBooking.singleShipmentFlightBookingList) {
        const date = new Date(flight.flightOriginDate);
        if (NgcUtility.isTenantAirport(flight.flightBoardPoint)) {
          partBooking.outGoingFlight = flight.flightKey + '/' + (date.getDate() + '' +
            this.monthNames[date.getMonth()] + '' + date.getFullYear())
            + '   ' + flight.flightBoardPoint + ' - ' + flight.flightOffPoint;
        } else if (NgcUtility.isTenantAirport(flight.flightOffPoint)) {
          partBooking.inComingFlight = flight.flightKey + '/' + (date.getDate() + '' +
            this.monthNames[date.getMonth()] + '' + date.getFullYear())
            + '   ' + flight.flightBoardPoint + ' - ' + flight.flightOffPoint;
        }
      }
      if (partBooking.partWeight != null) {
        let str = partBooking.partWeight.toString();
        if (!str.includes('.')) {
          partBooking.partWeight = str + ".0";
        }
      }
      partBooking.infoValue = "Pcs/Wt: " + partBooking.partPieces + "/" + partBooking.partWeight;
      partBooking.infoVol = "Vol: " + partBooking.volume;
      if (partBooking.concatenatedShc != null) {
        partBooking.infoShc = "SHC: " + partBooking.concatenatedShc;
      } else {
        partBooking.infoShc = "SHC: ";
      }
    }
  }

  getTwoPartSuffix(request) {
    this.exportService.singleBookingShipmentGetSuffix(request).subscribe((resp) => {
      // console.log(resp);
      this.partSuffix1 = resp.data;
      request.suffix = resp.data;
      (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[0])
        .get('partSuffix').setValue(this.partSuffix1);
      // nested backend call
      this.exportService.singleBookingShipmentGetSuffix(request).subscribe((resp1) => {
        // console.log(resp1);
        this.partSuffix2 = resp1.data;
        (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[1])
          .get('partSuffix').setValue(this.partSuffix2);
        (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[1])
          .get('pshTriggerFlag').setValue(true);
        (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[1])
          .get('partSourceSuffix').setValue(this.partSuffix1);
      });
    });
  }

  getOnePartSuffix(request) {
    const noOfAccordions = (<NgcFormArray>this.form.controls.partBookingList).length;
    request.suffix = (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList)
      .controls[noOfAccordions - 2]).get('partSuffix').value;
    this.exportService.singleBookingShipmentGetSuffix(request).subscribe((resp) => {
      // console.log(resp);
      (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[noOfAccordions - 1])
        .get('partSuffix').setValue(resp.data);
      (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[noOfAccordions - 1])
        .get('pshTriggerFlag').setValue(true);
      (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[noOfAccordions - 1])
        .get('partSourceSuffix').setValue(request.originalSuffix);

    });
  }


  onFlightSelect(event, index, subIndex) {
    console.log(event);
    let currentFormGroup = this.form.get(['partBookingList', index, 'singleShipmentFlightBookingList', subIndex]);
    console.log(currentFormGroup);
    currentFormGroup.get('flightBoardPoint').setValue(event.flightBoardPoint);
    currentFormGroup.get('flightOffPoint').setValue(event.flightOffPoint);
    currentFormGroup.get('flightSegmentId').setValue(event.flightSegmentId);
    currentFormGroup.get('dateSTA').setValue(event.dateSTA);
    currentFormGroup.get('dateSTD').setValue(event.dateSTD);
    currentFormGroup.get('flightKey').setValue(event.flightKey);
    currentFormGroup.get('flightOriginDate').setValue(event.flightOriginDate);
  }

  eventCall(event, i) {
    console.log(event);
    this.setDimentionValues(i);
  }
  // for booking dimension popup
  eventBookingCall(event) {
    console.log(event);
    this.setBookingDimentionValues();
  }

  eventCallDensity(event, i) {
    let partObject = this.form.get(['partBookingList', i]).getRawValue();
    // if dimension present and booking pcs == dimension pcs then
    if (partObject.shipmentPartBookingDimensionList && partObject.shipmentPartBookingDimensionList.length > 0) {
      // check sum of pcs == part pcs
      let sumOfDimPcs = 0;
      let dimVolumeCode;
      partObject.shipmentPartBookingDimensionList.forEach(t => {
        sumOfDimPcs = sumOfDimPcs + t.pieces;
      });
      if (sumOfDimPcs == partObject.partPieces) {
        this.form.get(['partBookingList', i]).get('densityGroupCode').setValue(partObject.tempDensityGroupCode);
        // this.form.get(['partBookingList', i]).get('tempDensityGroupCode').setValue(partObject.densityGroupCode);
        this.showErrorMessage("export.cannot.update.dg.volume");
        return;
      } else {
        // update volume based on DG
        const dimention: Dimention = new Dimention();
        dimention.weightCode = this.form.get('weightUnitCode').value;
        dimention.dg = event.code;
        dimention.shipmentWeight = +this.form.get(['partBookingList', i]).get('partWeight').value;
        this.exportService.getVolumeByDensity(dimention).subscribe(resp => {
          this.volume = resp.data;
          this.form.get(['partBookingList', i]).get('volume').setValue(this.volume, { onlySelf: true, emitEvent: false });

          if (this.form.get('weightUnitCode') === 'K') {
            this.form.get(['partBookingList', i]).get('volumeUnitCode').setValue('MC');
          } else if (this.form.get('weightUnitCode') === 'L') {
            this.form.get(['partBookingList', i]).get('volumeUnitCode').setValue('CF');
          }
          this.form.get(['partBookingList', i]).get('tempDensityGroupCode').setValue(partObject.densityGroupCode);
        });
      }
    } else {
      // update volume based on DG
      const dimention: Dimention = new Dimention();
      dimention.weightCode = this.form.get('weightUnitCode').value;
      dimention.dg = event.code;
      dimention.shipmentWeight = +this.form.get(['partBookingList', i]).get('partWeight').value;
      this.exportService.getVolumeByDensity(dimention).subscribe(resp => {
        this.volume = resp.data;
        this.form.get(['partBookingList', i]).get('volume').setValue(this.volume, { onlySelf: true, emitEvent: false });

        if (this.form.get('weightUnitCode') === 'K') {
          this.form.get(['partBookingList', i]).get('volumeUnitCode').setValue('MC');
        } else if (this.form.get('weightUnitCode') === 'L') {
          this.form.get(['partBookingList', i]).get('volumeUnitCode').setValue('CF');
        }
        this.form.get(['partBookingList', i]).get('tempDensityGroupCode').setValue(partObject.densityGroupCode);
      });
    }
  }
  eventCallForVolumeCode(event, i) {
    console.log("dimbookingObject", this.bookingobjectForVolumeCodeChange);
    let partObject = this.form.get(['partBookingList', i]).getRawValue();
    console.log("partObj", partObject);
    if (partObject.shipmentPartBookingDimensionList && partObject.shipmentPartBookingDimensionList.length > 0) {
      // check sum of pcs == part pcs
      let sumOfDimPcs = 0;
      let dimVolumeCode;
      partObject.shipmentPartBookingDimensionList.forEach(t => {
        sumOfDimPcs = sumOfDimPcs + t.pieces;
        dimVolumeCode = t.volumeUnitCode;
      });
      if (sumOfDimPcs == partObject.partPieces) {
        this.form.get(['partBookingList', i]).get('volumeUnitCode').setValue(dimVolumeCode);
        this.showErrorMessage("export.dimension.information.present.cannot.update.volume.code");
        return;
      }
    }// if no dimesnion present and user manually change the volume code
    else {
      const dimention: Dimention = new Dimention();
      dimention.volumeCode = partObject.volumeUnitCode;
      if (partObject.tempVolumeCode) {
        dimention.oldVolumeCode = partObject.tempVolumeCode;
      } else {
        dimention.oldVolumeCode = 'MC';
      }
      dimention.volume = partObject.volume;
      if (dimention.volume) {
        this.exportService.getConvertedVolume(dimention).subscribe(resp => {
          this.form.get(['partBookingList', i]).get('tempVolumeCode').setValue(partObject.volumeUnitCode);
          if (resp.data) {
            this.form.get(['partBookingList', i]).get('volume').setValue(resp.data, { onlySelf: true, emitEvent: false });
          }
        });
      }
    }
  }
  setDimentionValues(i) {
    const dimention: Dimention = new Dimention();
    const partPieces = this.form.get(['partBookingList', i]).get('partPieces').value;
    const totalPieces = this.form.get(['partBookingList', i]).get('totalDimentionPieces').value;
    dimention.unitCode = this.form.get(['partBookingList', i]).get('measurementUnitCode').value;
    dimention.weightCode = this.form.get('weightUnitCode').value;
    dimention.volumeCode = this.form.get(['partBookingList', i]).get('volumeUnitCode').value;
    dimention.dg = this.form.get(['partBookingList', i]).get('densityGroupCode').value;
    dimention.shipmentPcs = this.form.get(['partBookingList', i]).get('partPieces').value;
    dimention.shipmentWeight = this.form.get(['partBookingList', i]).get('partWeight').value;
    const dimentionList1 = (<NgcFormArray>this.form.get(['partBookingList', i, 'shipmentPartBookingDimensionList'])).getRawValue();
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
      this.exportService.getDimensionVolumetricWeight(dimention).subscribe(resps => {

        (<NgcFormArray>this.form.get(['partBookingList', i, 'shipmentPartBookingDimensionList'])).controls.forEach((dim: NgcFormGroup) => {
          let pieces = +dim.get('pieces').value;
          let length = +dim.get('length').value;
          let width = +dim.get('width').value;
          let height = +dim.get('height').value;
          const dimensionData = resps.data;
          if (dimensionData !== null) {
            const volume = dimensionData.dimensionDetails.filter(ele => (ele.pcs === pieces && ele.length === length && ele.width === width && ele.height === height))[0];
            dim.get('volume').setValue(volume.volume, { onlySelf: true, emitEvent: false });
            dim.get('measurementUnitCode').setValue(dimention.unitCode);
            this.form.get(['partBookingList', i]).get('tempVolume').setValue(resps.data.calculatedVolume);
            this.form.get(['partBookingList', i]).get('totalDimentionVolumetricWeight').setValue(resps.data.volumetricWeight);
            if (partPieces === totalPieces) {
              this.form.get(['partBookingList', i]).get('volume').setValue(resps.data.calculatedVolume);
            }

          }
        });

      });
    }
  }
  changeModel(event, column, dimention: NgcFormGroup, index, partIndex) {
    if (column === 0) {
      // dimention.get('pieces').setValue(event);
      this.updateTotalshipment(partIndex);
    } else if (column === 1) {
      // dimention.get('length').setValue(event);
    } else if (column === 2) {
      // dimention.get('width').setValue(event);
    } else {
      // dimention.get('height').setValue(event);
    }
    if (dimention.get('pieces').value !== 0 && dimention.get('length').value !== 0
      && dimention.get('width').value !== 0 && dimention.get('height').value !== 0) {
      this.setDimentionValues(partIndex);
    }
    console.log(event);
  }

  // for booking dimension popup
  changeDimensionModel(event, column, dimention: NgcFormGroup, index) {
    if (column === 0) {
      // dimention.get('pieces').setValue(event);
      this.updateTotalshipmentDimension();
    } else if (column === 1) {
      // dimention.get('length').setValue(event);
    } else if (column === 2) {
      // dimention.get('width').setValue(event);
    } else {
      // dimention.get('height').setValue(event);
    }
    if (dimention.get('pieces').value !== 0 && dimention.get('length').value !== 0
      && dimention.get('width').value !== 0 && dimention.get('height').value !== 0) {
      this.setBookingDimentionValues();
    }
    console.log(event);
  }

  // for booking dimension popup
  setBookingDimentionValues() {
    const dimension: Dimention = new Dimention();
    let Pieces = this.form.get('pieces').value;
    let totalPieces2 = this.form.get('totalDimentionPieces').value;
    dimension.unitCode = this.form.get('measurementUnitCode').value;
    dimension.weightCode = this.form.get('weightUnitCode').value;
    dimension.volumeCode = this.form.get('volumeUnitCode').value;
    // dimention.dg = this.form.get(['partBookingList', i]).get('densityGroupCode').value;
    dimension.shipmentPcs = this.form.get('pieces').value;
    dimension.shipmentWeight = this.form.get('grossWeight').value;
    const dimentionList1 = (<NgcFormArray>this.form.get(['shipmentBookingDimensionList'])).getRawValue();
    dimentionList1.forEach(element => {

      const dimentionDetail: DimensionDetails = new DimensionDetails();
      dimentionDetail.pcs = element.pieces;
      dimentionDetail.length = element.length;
      dimentionDetail.width = element.width;
      dimentionDetail.height = element.height;
      if (dimentionDetail.pcs !== null && dimentionDetail.length !== null && dimentionDetail.width !== null && dimentionDetail.height !== null)
        dimension.dimensionDetails.push(dimentionDetail);
    });
    if (dimension.dimensionDetails.length > 0) {
      this.exportService.getDimensionVolumetricWeight(dimension).subscribe(resps => {
        (<NgcFormArray>this.form.get(['shipmentBookingDimensionList'])).controls.forEach((dim: NgcFormGroup) => {
          let pieces = +dim.get('pieces').value;
          let length = +dim.get('length').value;
          let width = +dim.get('width').value;
          let height = +dim.get('height').value;

          const dimensionData = resps.data;
          if (dimensionData !== null) {
            const volume = dimensionData.dimensionDetails.filter(ele => (ele.pcs === pieces && ele.length === length && ele.width === width && ele.height === height))[0];
            dim.get('volume').setValue(volume.volume, { onlySelf: true, emitEvent: false });
            //dim.get('measurementUnitCode').setValue(dimension.unitCode);
            dim.get('unitCode').setValue(dimension.unitCode);
            dim.get('volumeUnitCode').setValue(dimension.volumeCode);
            this.form.get('tempVolume').setValue(resps.data.calculatedVolume);
            this.form.get('totalDimentionVolumetricWeight').setValue(resps.data.volumetricWeight);
            if (Pieces === totalPieces2) {
              this.form.get('volume').setValue(resps.data.calculatedVolume);
            }
          }
        });
      });
    }
  }

  // for booking dimension popup
  updateTotalshipmentDimension() {
    let picesCount = 0;
    (<NgcFormArray>this.form.get(['shipmentBookingDimensionList'])).getRawValue().forEach(ele => { picesCount += +ele.pieces; });
    this.form.get('totalDimentionPieces').setValue(picesCount);
  }

  updateTotalshipment(i) {
    let picesCount = 0;
    (<NgcFormArray>this.form.get(['partBookingList', i, 'shipmentPartBookingDimensionList'])).getRawValue().forEach(ele => { picesCount += +ele.pieces; });
    if (picesCount == this.form.get(['partBookingList', i]).get('partPieces').value) {
      this.form.get(['partBookingList', i]).get('volumeDisabledFlag').setValue(true);
    } else {
      this.form.get(['partBookingList', i]).get('volumeDisabledFlag').setValue(false);
    }
    this.form.get(['partBookingList', i]).get('totalDimentionPieces').setValue(picesCount);
  }


  onCancelBooking() {

    if (!this.form.get('bookingCancellationReason').value || this.form.get('bookingCancellationReason').value.length === 0) {
      this.showErrorStatus('export.reason.for.cancellation.required');
      return;
    }

    const req = this.form.getRawValue();
    // serviece call to cancel shipment
    this.exportService.cancelShipment(req).subscribe((resp) => {
      this.refreshFormMessages(resp);

      if (resp.success) {
        this.showSuccessStatus('export.booking.cancelled.sucessfully');
        this.form.reset();
        // this.form = this.form1;
      } else {
        if (resp.data) {
          this.showConfirmMessage("handover.confirmation.shipment").then(fulfilled => {
            req.skipHandoverFlag = true;
            this.exportService.cancelShipment(req).subscribe((resp) => {
              this.refreshFormMessages(resp);

              if (resp.success) {
                this.showInfoStatus('export.booking.cancelled.sucessfully');
                this.form.reset();
                // this.form = this.form1;
              }
            });
          });
        }
      }
    });
  }

  // protected afterFocus() {
  //   if (this.searchFocusFlag && this.originLOV) {
  //     this.searchFocusFlag = false;
  //     this.originLOV.focus();
  //   }
  // }
  onClickFlightPlanner() {
    this.navigateTo(this.router, '/export/planning-list', this.navigateData);
  }

  onClickIcmsBookingPublish() {
    // let transferData: any = {
    //   'shipmentNumber': this.form.get('shipmentNumber').value,
    // };
    // this.navigateTo(this.router, '/interface/icmsbookingpublish', transferData);
    this.icmsBookingPublishObject = {
      shipmentNumber: this.form.get('shipmentNumber').value,
    }
    console.log('icmspublishobject', this.icmsBookingPublishObject);
    this.ismsBookingPublishWindow.open();
  }

  public onOffPointSelect(event, i, j) {
    let flightObj: NgcFormGroup = (<NgcFormGroup>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j]));
    this.exportService.getSegmentTime(flightObj.getRawValue()).subscribe((resp) => {
      if (resp.data) {
        const res = resp.data;
        (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('dateSTD').setValue(res[0].dateSTD);
        (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('dateSTA').setValue(res[0].dateSTA);
      } else {
        this.showResponseErrorMessages(resp);
      }
    });

  }
  addNewPartMethod() {
    this.onaddNewPartBooking();
    this.addNewPart.open();

  }
  addPartServiceCall() {
    this.addNewPartForm.get('partPieces').setValidators([Validators.required]);
    this.addNewPartForm.get('partWeight').setValidators([Validators.required]);
    this.addNewPartForm.get('volume').setValidators([Validators.required]);
    this.addNewPartForm.get('volumeUnitCode').setValidators([Validators.required]);
    this.addNewPartForm.validate();
    if (this.addNewPartForm.invalid) {
      return;
    }
    if (this.addNewPartForm.get('partWeight').value == 0 || this.addNewPartForm.get('partPieces').value == 0) {
      this.showErrorMessage("export.part.pcs.wt.cannot.0");
      return;
    }
    let addNewPartFormData = this.addNewPartForm.getRawValue();
    let bookingData = this.form.getRawValue();
    bookingData.partBookingList.forEach(t => {
      if (t.flagCRUD == 'C' && t.singleShipmentFlightBookingList.length == 0) {
        t.partPieces = addNewPartFormData.partPieces;
        t.partWeight = addNewPartFormData.partWeight;
        t.densityGroupCode = addNewPartFormData.densityGroupCode;
        t.volume = addNewPartFormData.volume;
        t.volumeUnitCode = addNewPartFormData.volumeUnitCode;
      } else {
        t.flagCRUD = 'R';
      }
      if (t.singleShipmentFlightBookingList && t.singleShipmentFlightBookingList.length > 0) {
        for (const eachflightRow of t.singleShipmentFlightBookingList) {
          eachflightRow.shcList = t.shcList;
          eachflightRow.bookingPieces = t.partPieces;
          eachflightRow.bookingWeight = t.partWeight;
          eachflightRow.workingListRemarks = t.workingListRemarks;
          eachflightRow.manifestRemarks = t.manifestRemarks;
          eachflightRow.additionalRemarks = t.additionalRemarks;
          eachflightRow.throughTransitFlag = Number(t.throughTransitFlag);
          eachflightRow.dateSTA = eachflightRow.dateSTA;
          eachflightRow.dateSTD = eachflightRow.dateSTD;
          eachflightRow.densityGroupCode = t.densityGroupCode;
          eachflightRow.volume = t.volume;
          eachflightRow.volumeUnitCode = t.volumeUnitCode;
          eachflightRow.totalDimentionVolumetricWeight = t.totalDimentionVolumetricWeight;
          eachflightRow.measurementUnitCode = t.measurementUnitCode;
          eachflightRow.flightId = t.flightId;
          eachflightRow.flightSegmentId = t.flightSegmentId
        }
      }
    });
    // check for the pieces and weight equality
    let check = this.checkPcsWeightForAddPart();
    if (check) {
      bookingData.fromAddPart = true;
      this.exportService.singleBookingShipmentSave(bookingData).subscribe((resp) => {
        this.response = resp;
        this.refreshFormMessages(this.response);
        if (this.response.success) {
          this.showSuccessStatus('g.completed.successfully');
          this.deleteFlightEntries = [];
          this.addNewPart.close();
          this.onSearch('redirect');
        } else {
          this.refreshFormMessages(this.response);
        }
      });
    }

  }
  checkPcsWeightForAddPart(): boolean {
    let totalPieces = this.form1.get('pieces').value;
    let totalWeight = this.form1.get('grossWeight').value;
    let partBookingList = this.form1.get('partBookingList').value;
    //get new part pcs/wt
    let addNewPartFormData = this.addNewPartForm.getRawValue();
    let totalPartPieces = 0;
    let totalPartWeight = 0;
    console.log("partBookingList", partBookingList);
    if (partBookingList) {
      partBookingList.forEach(element => {
        totalPartPieces = totalPartPieces + element.partPieces;
        totalPartWeight = totalPartWeight + element.partWeight;
      });
      if (addNewPartFormData.partPieces)
        totalPartPieces = totalPartPieces + addNewPartFormData.partPieces;
      if (addNewPartFormData.partWeight)
        totalPartWeight = totalPartWeight + parseFloat(addNewPartFormData.partWeight);

      if (totalPartPieces > totalPieces) {
        this.showErrorMessage("error.total.part.pieces.greater.booking");
        return false;
      }
      if (totalPartWeight > totalWeight) {
        this.showErrorMessage("error.total.part.pieces.greater.booking");
        return false;
      }

    }
    return true;
  }
  onselectBookingSatatuCode(event) {
    console.log("event", event)
    if (event && event.code == 'XX') {
      //CHECK FOR TOTAL BOOKING fLIGHT DELETE
      let formRawValue = this.form.getRawValue();
      if (formRawValue && formRawValue.partBookingList.length == 1) {
        let flightDetails = formRawValue.partBookingList[0].singleShipmentFlightBookingList;
        if (flightDetails && flightDetails.length == 1) {
          const pieces = this.form.get('pieces').value;
          const grossWeight = this.form.get('grossWeight').value;
          this.densityGroupCode = (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('densityGroupCode').value;
          this.volumeAmount = (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('volume').value;
          this.volumeUnitCode = (<NgcFormGroup>this.form.get(['partBookingList', 0])).get('volumeUnitCode').value;

        }

      }
      if (!this.form.get('bookingCancellationReason').value || this.form.get('bookingCancellationReason').value.length === 0) {
        this.showErrorStatus('export.reason.for.cancellation.required');
        return;
      }
    }

  }
  collapseExpandButton() {
    this.collapseExpand = !this.collapseExpand;
  }


  onaddNewPartBooking(): void {
    const partlength = (<NgcFormArray>this.form.get('partBookingList')).length;
    console.log("this.form", this.form.getRawValue());
    for (let i = 0; i < (<NgcFormArray>this.form.controls.partBookingList).length; ++i) {
      if ((<NgcFormArray>this.form.controls.partBookingList).length == 1) {
        this.form.get('primaryPart').setValue(true);
        (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[0]).get('partIdentifier').setValue('Y');
        (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[0]).get('partSuffix').setValue('P');
      }
      (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList).controls[i]).get('flagCRUD').setValue('R');
    }


    const noOfAccordions = (<NgcFormArray>this.form.controls.partBookingList).length;
    let newPartBooking = this.eachPartBooking;
    newPartBooking.partSuffix = '';
    //get SHC from part
    let shcList = ((<NgcFormGroup>this.form.get(['partBookingList', partlength - 1])).getRawValue()).shcList;
    shcList.forEach(t => t.flagCRUD = "C");
    (<NgcFormArray>this.form.controls.partBookingList).addValue([newPartBooking]);
    const i = (<NgcFormArray>this.form.controls.partBookingList).length - 1;

    if (!(<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList)
      .controls[noOfAccordions - 1]).get('partSuffix').value) {
      const searchRequest: SearchSingleBookingShipment = this.formSearchObject();
      this.getTwoPartSuffix(searchRequest);
    } else {
      const searchRequest: SearchSingleBookingShipment = this.formSearchObject();
      searchRequest.originalSuffix = (<NgcFormGroup>(<NgcFormArray>this.form.controls.partBookingList)
        .controls[partlength - 1]).get('partSuffix').value;
      this.getOnePartSuffix(searchRequest);
    }
    let request = this.form.getRawValue();
    for (let i = 0; i < partlength; i++) {
      request.partBookingList[i].flagCRUD = 'R';
    }
    this.form.patchValue(request);
    this.bookingobjectForVolumeCodeChange = this.form.getRawValue();
  }
  closeAddNewPartWindow() {
    this.addNewPartForm.reset();
    this.onSearch('direct');
  }
  eventCallDensityForAddPart(event, i) {
    const dimention: Dimention = new Dimention();
    dimention.weightCode = this.form.get('weightUnitCode').value;
    dimention.dg = event.code;
    dimention.shipmentWeight = +this.addNewPartForm.get('partWeight').value;
    this.exportService.getVolumeByDensity(dimention).subscribe(resp => {
      this.volume = resp.data;
      this.addNewPartForm.get('volume').setValue(this.volume, { onlySelf: true, emitEvent: false });
      if (this.form.get('weightUnitCode') === 'K') {
        this.addNewPartForm.get('volumeUnitCode').setValue('MC');
      }
    });

  }

  onChangeFlightDetails(event, i, j) {
    let flightObj: NgcFormGroup = (<NgcFormGroup>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j]));
    if (flightObj.getRawValue().flightOriginDate) {
      this.exportService.getSegmentTime(flightObj.getRawValue()).subscribe((resp) => {
        if (resp.data) {
          const res = resp.data;
          if (res.length != 0) {
            (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('flightBoardPoint').setValue(res[0].flightBoardPoint);
            (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('flightOffPoint').setValue(res[0].flightOffPoint);
            (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('dateSTD').setValue(res[0].dateSTD);
            (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('dateSTA').setValue(res[0].dateSTA);
          } else {
            (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('flightBoardPoint').setValue('');
            (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('flightOffPoint').setValue('');
            (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('dateSTD').setValue('');
            (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('dateSTA').setValue('');
          }
        } else {
          this.showResponseErrorMessages(resp);
        }
      });
    }
    this.handleSystem(flightObj, i, j);
  }
  handleSystem(flightObj: NgcFormGroup, i: number, j: number) {
    this.exportService.getHandleInfo(flightObj.getRawValue()).subscribe(response => {
      if (response.data && response.data.handlinginSystem) {
        this.showConfirmMessage('g.flight.not.handled.confirmation').then(reason => {

        }).catch(reason => {
          // reset the screen
          this.ship = this.form.get('shipmentNumber').value;
          (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('flightBoardPoint').reset();
          (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('flightOffPoint').reset();
          (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('dateSTD').reset();
          (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('dateSTA').reset();
          (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('flightKey').reset();
          (<NgcFormArray>this.form.get(['partBookingList', i, 'singleShipmentFlightBookingList', j])).get('flightOriginDate').reset();
          // this.form.reset();
          this.form.get('shipmentNumber').setValue(this.ship).value;

        });
      }

    })

  }
  methodToCalculateRemainingPcsWt() {
    let bookingData = this.form.getRawValue();
    let sumOfPartPcs = 0;
    let sumOfPartWt = 0;
    if (bookingData.partBookingList && bookingData.partBookingList.length > 0) {
      bookingData.partBookingList.forEach(t => {
        sumOfPartPcs = sumOfPartPcs + t.partPieces;
        sumOfPartWt = sumOfPartWt + t.partWeight;
      });
    }
    this.form.get('remainingPcs').setValue(bookingData.pieces - sumOfPartPcs);
    this.form.get('remainingWt').setValue(Number(NgcUtility.getDisplayWeight((bookingData.grossWeight - sumOfPartWt))));
  }
  getProportionalWeight(index) {
    this.methodToCalculateRemainingPcsWt();
    // service call for getting proprtional Weight
    let bookingData = this.form.getRawValue();
    bookingData.indexForProprtionalWeight = index;

    this.exportService.getProportionalWeightForSingleShipment(bookingData).subscribe(response => {
      if (this.showResponseErrorMessages(response)) {
        this.showResponseErrorMessages(response);
        return;
      } else {
        this.form.get(['partBookingList', index]).get('partWeight').setValue(response);
        this.methodToCalculateRemainingPcsWt();
      }
    });
  }
  updateBookingPcsWt() {
    this.updateBookingObject = {
      shipmentNumber: this.form.get('shipmentNumber').value,
      shipmentDate: this.form.get('shipmentDate').value
    }
    this.updateBookingWindow.open();

  }
  closeUpdateBooking() {
    this.updateBookingWindow.close();
  }

  onCancel() {
    this.navigateBack(this.navigateData);
  }

  calculateProportionalWeightForAddNewPart() {
    let bookingData = this.form.getRawValue();
    bookingData.fromAddPart = true;
    bookingData.totalPieces = this.addNewPartForm.get('partPieces').value;
    this.exportService.getProportionalWeightForSingleShipment(bookingData).subscribe(response => {
      if (this.showResponseErrorMessages(response)) {
        this.showResponseErrorMessages(response);
        return;
      } else {
        this.addNewPartForm.get('partWeight').setValue(response);
      }
    })
  }

  validateOnUncheck(event, i) {
    if (!event) {
      let bookingData = (<NgcFormGroup>this.form.get(['partBookingList', i]));
      bookingData.get('shipmentNumber').patchValue(this.form.get('shipmentNumber').value);
      bookingData.get('shipmentDate').patchValue(this.form.get('shipmentDate').value);
      // console.log(bookingData.get('flightId').value);
      for (const flight of bookingData.get('singleShipmentFlightBookingList').value) {
        if (NgcUtility.isTenantAirport(flight.flightBoardPoint)) {
          // console.log(flight.flightId);
          bookingData.get('flightId').patchValue(flight.flightId);
        }
      }
      if (bookingData.get('shipmentNumber').value) {
        this.exportService.validateOnTTUncheck(bookingData.getRawValue()).subscribe((resp) => {
          if (resp.data) {
            //Do Nothing
          } else {
            this.showResponseErrorMessages(resp);
            let throughTransitFlag = this.form.get(['partBookingList', i, 'throughTransitFlag']);
            throughTransitFlag = Number(1);
            (<NgcFormGroup>this.form.get(['partBookingList', i, 'throughTransitFlag'])).setValue(throughTransitFlag);
          }
        });
      }
    }
  }

  removeHypen(event: ClipboardEvent) {
    console.log(event);
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    if (pastedText.length > 11) {
      let removedHypenText = pastedText.replace("-", "");
      this.form.get('shipmentNumber').setValue("");
      this.form.get('shipmentNumber').patchValue(removedHypenText);
    }
  }

  navToShipmentInfo() {
    let navigateObj = {
      shipmentNumber: this.form.get("shipmentNumber").value,
      screenName: 'bookSingleShipment'
    }
    this.navigateTo(this.router, '/awbmgmt/shipmentinfoCR', navigateObj);
  }

}



