import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, ReactiveModel, PageConfiguration, NgcWindowComponent, NgcReportComponent, NgcUtility, DateTimeKey } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { TranshipmentService } from '../transhipment.service';
import { ConnectingFlight } from '../../export.sharedmodel';
import { element } from 'protractor';
import { InboundFlightTranshimentListShipmentConnectingFlightModel, InboundFlightTranshipmentList, InboundFlightTranshipmentListRequest } from '../transhipment.sharedmodel.ts';
import { Validators } from '@angular/forms';
import { elementEnd } from '@angular/core/src/render3/instructions';
import { time } from 'console';

@Component({
  selector: 'app-inbound-flight-transhipment-list',
  templateUrl: './inbound-flight-transhipment-list.component.html',
  styleUrls: ['./inbound-flight-transhipment-list.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
  // autoBackNavigation: true,
  //restorePageOnBack: true
})


export class InboundFlightTranshipmentListComponent extends NgcPage implements OnInit {
  /* 
  Pop up Window for Booking Info
   */
  @ViewChild('showPopUpWindow1') showPopUpWindow1: NgcWindowComponent;

  /*  
  Data for Shipment Information and outgoing Flight connected with Particular Shipment
  */
  @ReactiveModel(InboundFlightTranshipmentList)
  public inboundFlightTranshipmentList: NgcFormGroup;

  /* 
  Search Parameter for Transhipments
   */
  public inboundFlightTranshipmentListSearch: NgcFormGroup = new NgcFormGroup({
    sta: new NgcFormControl,
    eta: new NgcFormControl,
    ata: new NgcFormControl,
    flightKey: new NgcFormControl,
    flightDate: new NgcFormControl,
  });

  /*  
  
  */
  public bookingInfoForm: NgcFormGroup = new NgcFormGroup({
    bookingInfoFormList: new NgcFormArray([])
  });

  /* Setting Intial values for Further use  */
  sourceIdSegmentDropdown: {};
  showTableFlag: boolean;
  FlightKey: string;
  forwardedData: any;
  redirect: boolean;
  previousPageData: any = null;
  responseArray: any;
  responseData: any[];
  cdcIcon: any;

  /*  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private transhipmentService: TranshipmentService, private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  /*  Data Required while Intialization*/
  ngOnInit() {
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData) {
      this.redirect = true;
      this.previousPageData = this.getNavigateData(this.activatedRoute);
      this.inboundFlightTranshipmentListSearch.get('flightKey').patchValue(this.forwardedData.flightKeyForInbound)
      this.inboundFlightTranshipmentListSearch.get('flightDate').patchValue(this.forwardedData.flightDateForInbound)
      this.getInboundFlightTranshipmentList();
    } else {
      this.redirect = false;
    }
  }

  /* Search Function */
  getInboundFlightTranshipmentList() {
    this.showTableFlag = false;
    this.resetFormMessages();
    this.inboundFlightTranshipmentListSearch.validate();
    if (this.inboundFlightTranshipmentListSearch.invalid) {
      return;
    }
    this.transhipmentService.getInboundFlightTranshipmentList(this.inboundFlightTranshipmentListSearch.getRawValue()).subscribe((response: any) => {
      /* TODO */
      if (response && response.data) {
        this.showTableFlag = true;
        this.inboundFlightTranshipmentList.patchValue(response.data);
        this.inboundFlightTranshipmentListSearch.get('sta').patchValue(response.data.sta);
        this.inboundFlightTranshipmentListSearch.get('ata').patchValue(response.data.ata);
        this.inboundFlightTranshipmentListSearch.get('eta').patchValue(response.data.eta);
        response.data.uldInfo.filter((element, uldIndex) => {
          element.shipmentInfo.filter((shipment, shipmentInfoIndex) => {
            if (shipment.connectingFlightInfo.length == 0) {
              this.onActivityAddRow(uldIndex, shipmentInfoIndex);
            }
            shipment.connectingFlightInfo.filter((flight, index) => {
              this.sourceIdSegmentDropdown = this.createSourceParameter(flight.flightKey, flight.flightDate);
              this.retrieveDropDownListRecords('LOADSHIPMENT_SEGMENT', 'query', this.sourceIdSegmentDropdown)
                .subscribe(data => {
                  data.forEach(element => {
                    flight.flightSegmentId = element.code;
                  })
                });
            })
          })
        })
      } else {
        this.showTableFlag = false;
        this.showErrorStatus('NO_RECORDS_EXIST');
      }
    });
  }

  /*  Saving Inbound Flight Transhipment Data */
  onSave(event) {
    this.resetFormMessages();
    this.inboundFlightTranshipmentList.validate();
    if (this.inboundFlightTranshipmentList.invalid) {
      return;
    }
    this.transhipmentService.saveInboundFlightTranshipmentList(this.inboundFlightTranshipmentList.getRawValue()).subscribe((data: any) => {
      if (!this.showResponseErrorMessages(data)) {
        this.showSuccessStatus('g.completed.successfully');
        this.getInboundFlightTranshipmentList();
      }
    }, error => {
      this.showErrorStatus(error);

    });
  }

  /**
 * @param index : index of uldInfo
 * @param subindex : index of shipmentInfo
 */
  public onActivityAddRow(index, subindex) {
    (<NgcFormArray>this.inboundFlightTranshipmentList.get(['uldInfo', index, 'shipmentInfo', subindex, 'connectingFlightInfo']))
      .addValue([{
        flightKey: null,
        transferType: null,
        flightDate: null,
        pieces: null,
        weight: null,
        timeDiff: null,
        segment: null,
        flightSegmentId: null,
        bookingAllowed: true
      }])
  }

  /**
 * @param index : index of uldInfo
 * @param subindex : index of shipmentInfo
 * @param tindex : index of connectingInfo
 */
  onFlightChange(event, index, subindex, tindex) {
    console.log(event + " " + index + "" + subindex + "" + tindex)
    this.FlightKey = event;
    this.inboundFlightTranshipmentList.get(['uldInfo', index, 'shipmentInfo', subindex, 'connectingFlightInfo', tindex, 'flightDate']).setValidators(Validators.required);
    this.inboundFlightTranshipmentList.get(['uldInfo', index, 'shipmentInfo', subindex, 'connectingFlightInfo', tindex, 'pieces']).setValidators(Validators.required);
    this.inboundFlightTranshipmentList.get(['uldInfo', index, 'shipmentInfo', subindex, 'connectingFlightInfo', tindex, 'weight']).setValidators(Validators.required);
    this.inboundFlightTranshipmentList.get(['uldInfo', index, 'shipmentInfo', subindex, 'connectingFlightInfo', tindex, 'segment']).setValidators(Validators.required);
  }

  /* Navigate to Transhipment Handling  */
  navigateToPreviousPage() {
    this.navigate('/export/transhipment/transshipment-monitoring-handling', this.previousPageData);
  }
  /**
 * @param index : index of uldInfo
 * @param subindex : index of shipmentInfo
 * @param tindex : index of connectingInfo
 * @param titem : data of connecting Flight Info
 */
  onDelete(index, subindex, tindex, titem) {
    (<NgcFormGroup>this.inboundFlightTranshipmentList.get(['uldInfo', index, 'shipmentInfo', subindex, 'connectingFlightInfo', tindex])).markAsDeleted();

  }

  /**
   * @param index : index of uldInfo
   * @param sindex : index of shipmentInfo
   * @param sindex : index of connectingFlightInfo
   */
  onSelectMultiflight(index, sindex, tindex) {
    let data = (<NgcFormArray>this.inboundFlightTranshipmentList.get(['uldInfo', index, 'shipmentInfo', sindex, 'bookingInfo'])).getRawValue();
    data.forEach((element) => {
      element.index = index;
      element.sindex = sindex;
      element.tindex = tindex;
      element.select = false;
    });
    (<NgcFormArray>this.bookingInfoForm.get(['bookingInfoFormList'])).patchValue(data);
    this.showPopUpWindow1.open();
  }

  /* Select Flight From Booking Info */
  onSelectFlight() {
    let flightData = (<NgcFormArray>this.bookingInfoForm.get(['bookingInfoFormList'])).getRawValue();
    flightData.forEach((element, index) => {
      if (element.select) {
        this.inboundFlightTranshipmentList.get(['uldInfo', element.index, 'shipmentInfo', element.sindex, 'connectingFlightInfo', element.tindex, 'flightKey']).patchValue(element.flightKey);
        this.inboundFlightTranshipmentList.get(['uldInfo', element.index, 'shipmentInfo', element.sindex, 'connectingFlightInfo', element.tindex, 'flightDate']).patchValue(element.flightDate);
        this.inboundFlightTranshipmentList.get(['uldInfo', element.index, 'shipmentInfo', element.sindex, 'connectingFlightInfo', element.tindex, 'pieces']).patchValue(element.pieces);
        this.inboundFlightTranshipmentList.get(['uldInfo', element.index, 'shipmentInfo', element.sindex, 'connectingFlightInfo', element.tindex, 'weight']).patchValue(element.weight);
        this.inboundFlightTranshipmentList.get(['uldInfo', element.index, 'shipmentInfo', element.sindex, 'connectingFlightInfo', element.tindex, 'timeDiff']).patchValue('');
        this.sourceIdSegmentDropdown = this.createSourceParameter(element.flightKey, element.flightDate);
        this.retrieveDropDownListRecords('LOADSHIPMENT_SEGMENT', 'query', this.sourceIdSegmentDropdown)
          .subscribe(data => {
            console.log(data.code)
            data.forEach(element1 => {
              this.inboundFlightTranshipmentList.get(['uldInfo', element.index, 'shipmentInfo', element.sindex, 'connectingFlightInfo', element.tindex, 'flightSegmentId']).patchValue(element1.code);
            })
          });
      }
    })
    this.showPopUpWindow1.close();
  }
  /* Set Segment Id while selecting the flight Date */
  onChangeSegment(event, index, sindex, tindex, flightKey) {
    this.sourceIdSegmentDropdown = this.createSourceParameter(flightKey, event);
    this.retrieveDropDownListRecords('LOADSHIPMENT_SEGMENT', 'query', this.sourceIdSegmentDropdown)
      .subscribe(data => {
        console.log(data.code)
        data.forEach(element1 => {
          this.inboundFlightTranshipmentList.get(['uldInfo', index, 'shipmentInfo', sindex, 'connectingFlightInfo', tindex, 'flightSegmentId']).patchValue(element1.code);
        })
      });
  }

}




