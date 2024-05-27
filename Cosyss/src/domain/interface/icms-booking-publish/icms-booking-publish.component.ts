import { formatDate } from '@angular/common';
import { Component, ElementRef, Input, NgZone, OnChanges, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration
} from 'ngc-framework';
import { ExportService } from '../../export/export.service';


@Component({
  selector: 'app-icms-booking-publish',
  templateUrl: './icms-booking-publish.component.html',
  styleUrls: ['./icms-booking-publish.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class IcmsBookingPublishComponent extends NgcPage implements OnChanges {

  @Input('icmsBookingPublishObject') icmsBookingPublishObject;
  searchButtonClicked = false;
  private response;
  flightKey: string;
  transferData: any;
  sccCode: string[];
  isShowRemark: boolean = false;
  shcs: string;
  popupDisplay: boolean = true;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private route: ActivatedRoute,
    private exportService: ExportService,) {
    super(appZone, appElement, appContainerElement);
  }

  private icmsForm: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    svc: new NgcFormControl(), // chnage
    origin: new NgcFormControl(''),
    destination: new NgcFormControl(''),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    weightUnitCode: new NgcFormControl(), // change
    natureOfGoodsDescription: new NgcFormControl(), // change
    bookingRemarks: new NgcFormControl(),
    handlingInformationRemarks: new NgcFormControl(),
    flightRemarks: new NgcFormControl(),
    sccCodes: new NgcFormControl([]),
    shcs: new NgcFormControl(),
    dimensionUnit: new NgcFormControl(),
    bookingCommodityDetails: new NgcFormArray([
      new NgcFormGroup({
        numberOfPieces: new NgcFormControl(),
        lengthPerPiece: new NgcFormControl(),
        widthPerPiece: new NgcFormControl(),
        heightPerpiece: new NgcFormControl(),
        volume: new NgcFormControl(),
        weight: new NgcFormControl(),
        dimensionUnit: new NgcFormControl(),
      })
    ]),
    bookingFlightDetails: new NgcFormArray([
      new NgcFormGroup({
        flightKey: new NgcFormControl(),
        flightNumber: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        segmentOrigin: new NgcFormControl(),
        segmentDestination: new NgcFormControl(),
        pair: new NgcFormControl(),
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        volumeUnit: new NgcFormControl(),
        volume: new NgcFormControl(),
        volumeCode: new NgcFormControl(),
        status: new NgcFormControl(),
        flightBookingStatus: new NgcFormControl(),
        remarks: new NgcFormControl(),
        flightInfo: new NgcFormControl(),
        errorMessage: new NgcFormControl(),
      })
    ]),
    cosysBookingDetails: new NgcFormArray([
      new NgcFormGroup({
        partSuffix: new NgcFormControl(),
        flightNumber: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        volume: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        bookingStatus: new NgcFormControl(),
        outgoingFlightNumber: new NgcFormControl(),
        outgoingFlightDate: new NgcFormControl(),
        outgoingBookingStatus: new NgcFormControl(),
        outgoingOrigin: new NgcFormControl(),
        outgoingDestination: new NgcFormControl(),
      })
    ]),
    outgoingFlightDetails: new NgcFormArray([
      new NgcFormGroup({
        flightNumber: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        segmentOrigin: new NgcFormControl(),
        segmentDestination: new NgcFormControl(),
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        volume: new NgcFormControl(),
        volumeCode: new NgcFormControl(),
        status: new NgcFormControl(),
      })
    ]),
  });
  ngOnInit() {
    super.ngOnInit();
    this.transferData = this.getNavigateData(this.route);
    this.isShowRemark = false;

    try {
      if (this.transferData !== null && this.transferData !== undefined) {
        this.icmsForm.get('shipmentNumber').setValue(this.transferData.shipmentNumber);
        //  const s = new SearchUpdateDLS();
        // flightKey = this.transferData.flightKey;
        // s.flightOriginDate = this.transferData.flightOriginDate;
        // this.form.patchValue(s);
        this.searchBookingList();
      }
    } catch (e) { }
    // this.searchBookingList();
  }

  ngOnChanges(changes) {
    console.log("chnages", changes);
    console.log("icmsobject", this.icmsBookingPublishObject)
    if (this.icmsBookingPublishObject) {
      this.popupDisplay = false;
      // this.icmsForm.value.shipmentNumber = this.icmsBookingPublishObject.shipmentNumber;
      this.icmsForm.get('shipmentNumber').setValue(this.icmsBookingPublishObject.shipmentNumber);
      this.searchIcmsBookingPublish(this.icmsForm);
    } else {
      this.popupDisplay = true;
    }
  }

  onCancel() {
    this.navigateBack(this.transferData);
  }

  searchBookingList() {
    this.searchButtonClicked = false;
    this.searchIcmsBookingPublish(this.icmsForm);
    //this.icmsForm.reset();
  }

  searchIcmsBookingPublish(icmsForm) {
    this.exportService.getIcmsBookingPublishList(icmsForm.value).subscribe(resp => {
      this.response = resp as any;
      this.sccCode = this.response.sccCodes;
      this.shcs = "";
      this.response.sccCodes.forEach(element => {
        this.shcs = this.shcs + element + " ";
      });
      this.icmsForm.get('shcs').setValue(this.shcs);
      this.icmsForm.get('svc').setValue(this.response.svc);
      this.icmsForm.get('origin').setValue(this.response.origin);
      this.icmsForm.get('destination').setValue(this.response.destination);
      this.icmsForm.get('pieces').setValue(this.response.pieces);
      this.icmsForm.get('weight').setValue(this.response.weight);
      this.icmsForm.get('weightUnitCode').setValue(this.response.weightUnit);
      this.icmsForm.get('natureOfGoodsDescription').setValue(this.response.natureOfGoods);
      this.icmsForm.get('bookingRemarks').setValue(this.response.bookingRemarks);
      this.icmsForm.get('handlingInformationRemarks').setValue(this.response.handlingInformationRemarks);
      if (this.response.dimensionDetails != '' && this.response.dimensionDetails != null && this.response.dimensionDetails.length > 0) {
        this.icmsForm.get('dimensionUnit').setValue(this.response.dimensionDetails[0].dimensionUnit);
      }
      else {
        this.icmsForm.get('dimensionUnit').setValue('');
      }
      var remarkCount = 0;
      this.response.bookingFlightDetails.forEach(element => {
        element.flightNumber = element.carrierCode + element.flightNumber;
        element.flightDate = formatDate(element.flightDate, 'ddMMMyyyy', 'en_US');
        if (element.remarks != null && element.remarks.length > 0) {
          remarkCount = remarkCount + 1;
        }
      });
      this.response.cosysBookingDetails.forEach(element => {
        if (element.flightDate != null) {
          element.flightDate = formatDate(element.flightDate, 'ddMMMyyyy', 'en_US');
        }
        if (element.outgoingFlightDate != null) {
          element.outgoingFlightDate = formatDate(element.outgoingFlightDate, 'ddMMMyyyy', 'en_US');
        }
      });
      if (remarkCount > 0) {
        this.isShowRemark = true;
      } else {
        this.isShowRemark = false;
      }

      this.icmsForm.controls.bookingFlightDetails.patchValue(this.response.bookingFlightDetails);
      this.icmsForm.controls.outgoingFlightDetails.patchValue(this.response.bookingFlightDetails);

      this.icmsForm.controls.bookingCommodityDetails.patchValue(this.response.dimensionDetails);
      this.icmsForm.controls.cosysBookingDetails.patchValue(this.response.cosysBookingDetails);

    });
  }

}
