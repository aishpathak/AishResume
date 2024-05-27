import { NgcFormControl } from 'ngc-framework';
import { FormArray, FormGroup, Validator, Validators } from '@angular/forms';
import {
  SearchLoadShipment, SearchBuildupFlight, BuildupLoadShipment, SearchUldShipment, SearchShipmentUld,
  LoadUldShipment, ShipmentHouse, LoadedShipment, SHC, BuildUpCompleteEvent, UnloadShipment, BookMultipleShipmentSearch, ShipmentsTobeLoadedInventory
} from './../../export.sharedmodel';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';

import { BuildupService } from './../buildup.service';
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration, BaseResponse
} from 'ngc-framework';
import { DLSULD } from '../buildup.sharedmodel';

/**
 * This component helps in loading
 * shipment to ULD by AWB
 * and by ULD itself
 *
 * @export
 * @class revisedLoadShipmentComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'ngc-revised-load-shipment',
  templateUrl: './revised-load-shipment.component.html',
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: false
})
export class RevisedLoadShipmentComponent extends NgcPage {
  //Constants
  private CONTENET_CODE = 'C';
  private HEIGHT_CODE = 'QL';
  private BULK = 'BULK';
  private response;
  private eventRes;
  private uldResp;
  private loadResp;
  private loadType: string = 'ULD';
  // private toBeLoadFlag;
  //Flags for loaded shipments
  private loadedShipmentsByULD;
  private loadedShipmentsByAWB;
  //private currentLoadedRow;
  private flightFlag;
  private countCheckFlag = 0;
  private uldSourceParameter: any;
  private loadShipmentEnableFlag = true;
  private multipleShipmentSearch = new BookMultipleShipmentSearch();
  private confirmLoadFlag = true;
  private param: any;
  private tagInfo: any[];
  private totalLoadedWeight: Number = 0.0;
  private inventorySHCParam = {};
  private inventoryTAGParam = {};
  private isUldWindowOpen: boolean = false;
  private isAWBWindowOpen: boolean = false;
  private totalShipmentWeightBeforeUpdate: number = 0;
  private totalShipmentWeightAfterUpdate: number = 0;
  private totalPieces: number = 0;
  private transferData: any;
  private uldReq = new SearchUldShipment();
  private popUpOpeningTime: any;
  checkUldBuildUpFlag: boolean = false;
  piggyResponse: any;
  loadByULD: any;
  loadByAWB: any;
  loadByShipment: any;
  flightKeyforDropdown: any;
  loadedShipments: any;
  private afterConformLoading: boolean = false;
  private shipmentsSelectedToLoad: any;
  private awbLOVSourceId: any;
  private uldDropdownSourceID: any;
  private flightDateForAutoSearch: any;
  private flightKeyForAutoSearch: any;
  private disableULD: boolean;
  private afterWeightUpdate: boolean;
  private flightType: any;
  private carrierCode: any;
  private flightBoardPoint: any;
  private flightOffPoint: any;
  private aircraftType: any;
  private sqCarrierGroup: boolean;
  private terminalId: any;



  @ViewChild('uldWindow') uldWindow: NgcWindowComponent;
  @ViewChild('awbWindow') awbWindow: NgcWindowComponent;
  @ViewChild('updateWeightWindow') updateWeightWindow: NgcWindowComponent;

  private LoadShipmentForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl('', Validators.required),
    flight_key: new NgcFormControl('', Validators.required),
    flightOriginDate: new NgcFormControl('', Validators.required),
    flightDate: new NgcFormControl(new Date(), Validators.required),
    flightSegmentId: new NgcFormControl(),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    currentWeight: new NgcFormControl(),
    newWeight: new NgcFormControl(),
    assUldTrolleyNo: new NgcFormControl(),
    param1: new NgcFormControl(),
    contentCode: new NgcFormControl(),
    assUldTrolleyId: new NgcFormControl(),
    loadTime: new NgcFormControl(new Date()),
    heightCode: new NgcFormControl(),
    phcIndicator: new NgcFormControl(),
    trolleyInd: new NgcFormControl(false),
    toBeLoadedList: new NgcFormArray([]),

    uldShipmentArray: new NgcFormArray([]),

    loadedUldList: new NgcFormArray([])
    , updateLoadedWeightArray: new NgcFormArray([]),
    loadbyULD: new NgcFormControl('true'),
    loadbyAWB: new NgcFormControl('false'),
    totalLoadedPiecestoDisplay: new NgcFormControl(0),
    totalLoadedWeighttoDisplay: new NgcFormControl(0.0),

    assignedULDTrollies: new NgcFormArray([
    ]),

    shipmentToLoad: new NgcFormArray([
      new NgcFormGroup({
        shipmentNumber: new NgcFormControl(),
        assignedPieces: new NgcFormControl(),
        assignedWeight: new NgcFormControl(),
        remainingPieces: new NgcFormControl(),
        remainingWeight: new NgcFormControl(),
        segment: new NgcFormControl(),
        shipmentId: new NgcFormControl()
      })
    ]),
    totalToBeloaded: new NgcFormControl(),
    totalToBeloadedPieces: new NgcFormControl(0),
    totalToBeloadedWeight: new NgcFormControl(0.0),
    segment_ID: new NgcFormControl(),
    shipmentList: new NgcFormArray([]),
    terminalId: new NgcFormControl()

  });

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private buildupService: BuildupService, private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute, private router: Router, private _buildService: BuildupService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.loadByULD = false;
    this.loadByAWB = false;
    this.loadedShipmentsByULD = false;
    this.loadedShipmentsByAWB = false;
    this.afterConformLoading = false;
    this.afterWeightUpdate = false;
    this.disableULD = false;
    this.loadType = "ULD";
    this.transferData = this.getNavigateData(this.activatedRoute);
    if (this.transferData) {
      this.LoadShipmentForm.get('flight_key').setValue(this.transferData.flightKey);
      this.LoadShipmentForm.get('flightDate').setValue(this.transferData.flightOriginDate);
      this.LoadShipmentForm.patchValue(this.transferData);
      this.onFlightKey();
      this.LoadShipmentForm.get('segment_ID').setValue(this.transferData.segmentId);
      this.flightDateForAutoSearch = this.LoadShipmentForm.get('flightDate').value;
      this.flightKeyForAutoSearch = this.LoadShipmentForm.get('flight_key').value;
      this.onSearch();

    }
  }

  /**
   *
   *
   * @memberof LoadShipmentComponent
   */
  onSearch() {

    if (!this.afterConformLoading) {
      //this.toBeLoadFlag = false;
      //Buttons....
      //to Show loaded pieces and weight
      this.loadedShipmentsByULD = false;
      this.loadedShipmentsByAWB = false;
      this.loadByULD = false;
      this.loadByAWB = false;
      this.loadType = 'ULD';
      //Making loadbyULD radio button enable by deafult and load by AWB disabled otherwise two buttons getting enabled simultaneouly
      this.LoadShipmentForm.get('loadbyULD').setValue(true);
      this.LoadShipmentForm.get('loadbyAWB').setValue(false);
    }
    this.loadedShipments = null;
    if (this.LoadShipmentForm.get('flight_key').invalid || this.LoadShipmentForm.get('flightDate').invalid || this.LoadShipmentForm.get('segment_ID').invalid || !this.LoadShipmentForm.get('segment_ID').value) {
      this.showErrorStatus('expaccpt.input.all.mandatory.details');
      return;
    }

    const searchReq = new SearchLoadShipment();
    searchReq.flightKey = this.LoadShipmentForm.get('flight_key').value;
    searchReq.flightOriginDate = this.LoadShipmentForm.get('flightDate').value;
    //SreeLaxmi
    searchReq.segmentId = this.LoadShipmentForm.get('segment_ID').value;
    searchReq.fromRevisedLoadShipment = true;
    this.buildupService.revisedLoadShipmentSearch(searchReq).subscribe((resp) => {
      this.response = resp;
      this.uldResp = null;
      if (this.response.success) {

        this.flightFlag = true;
        this.flightType = this.response.data.flightType;
        this.carrierCode = this.response.data.carrierCode;
        this.flightBoardPoint = this.response.data.flightBoardPoint;
        this.flightOffPoint = this.response.data.flightOffPoint;
        this.aircraftType = this.response.data.aircraftType;
        this.flightFlag = true;
        this.showResponseErrorMessages(resp);
        this.uldSourceParameter = this.createSourceParameter(this.LoadShipmentForm.get('segment_ID').value, Math.random().toString());
        if (this.LoadShipmentForm.get('assUldTrolleyNo').value) {
          this.retrieveLOVRecords('ULD_TROLLEY_NO_SEGMENT', this.uldSourceParameter).subscribe(response => {
            for (const eachRow of response) {
              if (eachRow.code === this.LoadShipmentForm.get('assUldTrolleyNo').value) {
                this.LoadShipmentForm.get('assUldTrolleyId').setValue(eachRow.desc);
              }
            }
          });
        }
        this.LoadShipmentForm.patchValue(this.response.data);
        const toBeload = (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).getRawValue();
        const loaded = (<NgcFormArray>this.LoadShipmentForm.get('loadedUldList')).getRawValue();
        this.loadedShipments = (<NgcFormArray>this.LoadShipmentForm.get('loadedUldList')).getRawValue();
        this.sqCarrierGroup = this.response.data.sqCarrierGroup;
        //after conform load need to make the Inventory empty
        // if (this.afterConformLoading) {
        //   if (!this.afterWeightUpdate) {
        //  //   this.LoadShipmentForm.get('uldShipmentArray').patchValue([]);
        //   }
        // }

        if (this.loadType === 'ULD') {
          this.onUldClick(1);
        } else {
          this.onAwbClick(1);
        }
        this.checkbeBookingStatus();

      } else {
        this.showResponseErrorMessages(resp);
        // this.LoadShipmentForm.reset();
        //this.showErrorStatus(this.loadResp.messageList);
        this.refreshFormMessages(this.response);
      }
    });

  }


  calcualtedWeight() {
    let weight: Number = 0.0;
    for (let i = 0; i < (<NgcFormArray>this.LoadShipmentForm.get('updateLoadedWeightArray')).length; i++) {
      weight += this.LoadShipmentForm.get(['updateLoadedWeightArray', i]).get('loadedWeight').value;
    }
    if (this.totalLoadedWeight === 0.0) {
      this.totalLoadedWeight = weight;
    }
    return weight;
  }

  /**
   * Method called for loading shipment by ULD
   */
  onUldClick(event) {
    if (event && event === 1) {
      if (this.LoadShipmentForm.get('loadbyULD').value) {
        this.loadType = 'ULD';
        this.confirmLoadFlag = true;
        this.loadByULD = true;
        this.loadByAWB = false;
        this.loadedShipmentsByULD = false;
        this.loadedShipmentsByAWB = false;
        this.refreshFormMessages([]);
        if (!this.afterConformLoading) {
          this.resetULDData();
        } else {
          this.loadedShipmentsByULD = true;
          this.showLoadedShipmentsByULDOrAWB();
          this.LoadShipmentForm.get('uldShipmentArray').patchValue([]);
        }
        this.afterConformLoading = false;
        this.afterWeightUpdate = false;

      }
      else {
        this.onAwbClick(1);
      }
      // }
    }
  }

  /**
   * Method called for loading shipment by AWB
   */
  onAwbClick(event) {
    if (event && event === 1) {
      this.disableULD = false;
      this.refreshFormMessages([]);
      // To hide loaded shipment deatils
      this.loadedShipmentsByULD = false;
      this.loadedShipmentsByAWB = false;
      this.loadByULD = false;
      this.loadByAWB = true;
      (this.LoadShipmentForm.get('totalToBeloadedPieces')).patchValue(0);
      (this.LoadShipmentForm.get('totalToBeloadedWeight')).patchValue(0.0);
      if (!this.afterConformLoading) {
        //on toggle need to  reset Shipment LOV's and Shipmnet Inventory
        // this.LoadShipmentForm.get('shipmentToLoad').resetValue([]);
        (<NgcFormArray>this.LoadShipmentForm.get('shipmentToLoad')).resetValue([]);
        (<NgcFormArray>this.LoadShipmentForm.get('shipmentToLoad')).addValue([{
          shipmentNumber: null,
          assignedPieces: null,
          assignedWeight: null,
          remainingPieces: null,
          remainingWeight: null,
          segment: null,
          shipmentId: null
        }]);
        this.LoadShipmentForm.get('uldShipmentArray').patchValue([]);
        //reset assignedULD trolley selected ULD
        (<NgcFormArray>this.LoadShipmentForm.get('assignedULDTrollies')).controls.forEach((formGroup: NgcFormGroup) => {
          if (formGroup.get('checkBox').value) {
            formGroup.get('checkBox').setValue(false);
          }
        });
      } else {
        this.loadedShipmentsByAWB = true;
        this.showLoadedShipmentsByULDOrAWB();
        //After Confirm Load by  AWB, need to show the updated values
        let tobeloadedShipment = (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).getRawValue().filter(shipment => shipment.shipmentNumber === (<NgcFormArray>this.LoadShipmentForm.get(['shipmentToLoad', 0, 'shipmentNumber'])).value);
        //In case of full shipment loaded
        if (tobeloadedShipment.length === 0) {
          this.resetULDData();
          this.LoadShipmentForm.get('uldShipmentArray').patchValue([]);
          let shipmentNumber = (<NgcFormArray>this.LoadShipmentForm.get(['shipmentToLoad', 0, 'shipmentNumber'])).value;
          let shpList = (<NgcFormArray>this.LoadShipmentForm.get('shipmentList')).getRawValue().filter(shipment => shipment.shipmentNumber === shipmentNumber);
          (<NgcFormArray>this.LoadShipmentForm.get('shipmentToLoad')).patchValue(shpList);
        } else {
          (<NgcFormArray>this.LoadShipmentForm.get('shipmentToLoad')).patchValue(tobeloadedShipment);
          this.setShipmentInvenotoryDetails(tobeloadedShipment[0]);
        }
      }
      // this.LoadShipmentForm.get([ 'shipmentToLoad', 0]).get('shipmentNumber').setValue(null);
      this.loadType = 'AWB';
      //for tobe loaded shipments LOV
      this.ToBeLoadedAWBList();
      //reset ULD details
      this.resetULDData();
      this.afterConformLoading = false;
      this.afterWeightUpdate = false;
    }
  }

  onLoad() {
    const buildupLoadShipment = new BuildupLoadShipment();
    const loadedShipmentList = [];
    const shc = new SHC();
    const shipmentHouse = new ShipmentHouse();
    this.shipmentsSelectedToLoad = (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).getRawValue().filter(element => element.select);
    // setting the Load level values into main model
    buildupLoadShipment.flightOriginDate = this.LoadShipmentForm.get('flightDate').value;
    buildupLoadShipment.flightKey = this.LoadShipmentForm.get('flight_key').value;
    buildupLoadShipment.flightId = this.LoadShipmentForm.get('flightId').value;
    buildupLoadShipment.loadType = this.loadType;
    // getitng the Shipment yet to be loaded data Array
    const toBeload = (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).getRawValue();
    // getitng the Array data for Shipment whichh is about to load
    const uldArray = (<NgcFormArray>this.LoadShipmentForm.get('uldShipmentArray')).getRawValue();

    if (this.LoadShipmentForm.get('assUldTrolleyNo') && this.LoadShipmentForm.get('assUldTrolleyNo').value.length > 11) {
      this.showFormControlErrorMessage(<NgcFormControl>this.LoadShipmentForm.get('assUldTrolleyNo'),
        'export.uld.trolley.cannot.more.than.11');
      return;
    }

    // Loop for ULD level data
    for (let i = 0; i < uldArray.length; i++) {
      const shipment = new LoadUldShipment();
      const laodShipmentList = [];
      shipment.flightKey = this.LoadShipmentForm.get('flight_key').value;
      shipment.flightOriginDate = this.LoadShipmentForm.get('flightDate').value;
      shipment.flightId = this.LoadShipmentForm.get('flightId').value;
      shipment.shipmentId = uldArray[i].shipmentId;
      shipment.segmentId = uldArray[i].segmentId;
      shipment.segment = uldArray[i].segment;
      //Bug 12779
      shipment.origin = uldArray[i].origin;
      //Part Suffix flag
      shipment.sqCarrierGroup = uldArray[i].sqCarrierGroup;
      buildupLoadShipment.segmentId = uldArray[i].segmentId;
      const inveArray: Array<any> = <Array<any>>uldArray[i].uldInventory;
      // loop for shipment level data
      for (let j = 0; j < inveArray.length; j++) {
        const shcList = [];
        //const tagNumberList: Array<ShipmentHouse> = [];
        const loadedShipment = new LoadedShipment();
        loadedShipment.flightId = this.LoadShipmentForm.get('flightId').value;
        loadedShipment.shipmentId = uldArray[i].shipmentId;
        loadedShipment.segmentId = uldArray[i].segmentId;
        loadedShipment.natureOfGoodsDescription = inveArray[j].natureOfGoodsDescription;
        loadedShipment.flightKey = this.LoadShipmentForm.get('flight_key').value;
        loadedShipment.flightOriginDate = this.LoadShipmentForm.get('flightDate').value;
        loadedShipment.shipmentInventoryId = inveArray[j].shipmentInventoryId;
        loadedShipment.locationPiecs = inveArray[j].locationPiecs;
        loadedShipment.locationWeight = inveArray[j].locationWeight;
        loadedShipment.dryIceWeight = inveArray[j].dryIceWeight;
        loadedShipment.actualWeightWeighed = inveArray[j].actualWeightWeighed;
        loadedShipment.awbPieces = this.LoadShipmentForm.get(['uldShipmentArray', 0, 'pieces']).value;
        loadedShipment.awbWeight = this.LoadShipmentForm.get(['uldShipmentArray', 0, 'weight']).value;
        loadedShipment.shipmentNumber = uldArray[i].shipmentNumber;
        if (!inveArray[j].dryIceWeight) {
          loadedShipment.dryIceWeight = 0.0;
        }
        // Case for By ULD loading
        loadedShipment.assUldTrolleyNo = this.LoadShipmentForm.get('assUldTrolleyNo').value;
        loadedShipment.assUldTrolleyId = +this.LoadShipmentForm.get('assUldTrolleyId').value;
        loadedShipment.contentCode = this.LoadShipmentForm.get('contentCode').value;
        loadedShipment.heightCode = this.LoadShipmentForm.get('heightCode').value;
        loadedShipment.phcIndicator = this.LoadShipmentForm.get('phcIndicator').value;
        // setting data into Uld level object
        shipment.assUldTrolleyNo = this.LoadShipmentForm.get('assUldTrolleyNo').value;
        shipment.assUldTrolleyId = +this.LoadShipmentForm.get('assUldTrolleyId').value;
        shipment.contentCode = this.LoadShipmentForm.get('contentCode').value;
        shipment.heightCode = this.LoadShipmentForm.get('heightCode').value;
        shipment.phcIndicator = this.LoadShipmentForm.get('phcIndicator').value;
        // setting data into biludup object
        buildupLoadShipment.assUldTrolleyNo = this.LoadShipmentForm.get('assUldTrolleyNo').value;
        buildupLoadShipment.assUldTrolleyId = +this.LoadShipmentForm.get('assUldTrolleyId').value;
        buildupLoadShipment.contentCode = this.LoadShipmentForm.get('contentCode').value;
        buildupLoadShipment.heightCode = this.LoadShipmentForm.get('heightCode').value;
        buildupLoadShipment.phcIndicator = this.LoadShipmentForm.get('phcIndicator').value;
        // set the value for PHC Indicator to 0 in case of it's null
        if (this.LoadShipmentForm.get('phcIndicator').value === null
          || !this.LoadShipmentForm.get('phcIndicator').value
          || this.LoadShipmentForm.get('phcIndicator').value === "0"
          || this.LoadShipmentForm.get('contentCode').value === "M"
        ) {
          loadedShipment.phcIndicator = 0;
          shipment.phcIndicator = 0;
          buildupLoadShipment.phcIndicator = 0;
        } else {
          loadedShipment.phcIndicator = 1;
          shipment.phcIndicator = 1;
          buildupLoadShipment.phcIndicator = 1;
        }
        //}
        if (!inveArray[j].movePiecs) {
          loadedShipment.movePiecs = 0;
        } else {
          loadedShipment.movePiecs = inveArray[j].movePiecs;
        }
        if (!inveArray[j].moveWeight) {
          loadedShipment.moveWeight = 0.0;
        } else {
          loadedShipment.moveWeight = inveArray[j].moveWeight;
        }
        if (!inveArray[j].moveDryIce) {
          loadedShipment.moveDryIce = 0.0;
        } else {
          loadedShipment.moveDryIce = inveArray[j].moveDryIce;
        }
        // Laxmi--Trm case
        loadedShipment.trmNumber = inveArray[j].trmNumber
        loadedShipment.trmCarrier = inveArray[j].trmCarrier
        loadedShipment.isInvWithTrm = inveArray[j].isInvWithTrm
        //END--
        loadedShipment.shcList = inveArray[j].shcList;
        loadedShipment.tagNumberList = inveArray[j].tagNumberList;
        //partSuffixInfo
        loadedShipment.partSuffix = inveArray[j].partSuffix;
        loadedShipment.sqCarrierGroup = inveArray[j].sqCarrierGroup;
        //dipSvcSTATS
        loadedShipment.dipSvcSTATS = inveArray[j].dipSvcSTATS;

        laodShipmentList.push(loadedShipment);
      }
      shipment.loadShipmentList = laodShipmentList;
      /* if (this.popUpOpeningTime) {
         shipment.popUpOpeningTime = this.popUpOpeningTime;
       }*/
      shipment.popUpOpeningTime = uldArray[i].popUpOpeningTime;
      loadedShipmentList.push(shipment);
    }

    buildupLoadShipment.loadedShipmentList = loadedShipmentList;
    buildupLoadShipment.flightType = this.flightType;
    buildupLoadShipment.carrierCode = this.carrierCode;
    buildupLoadShipment.flightBoardPoint = this.flightBoardPoint;
    buildupLoadShipment.flightOffPoint = this.flightOffPoint;
    buildupLoadShipment.aircraftType = this.aircraftType;
    buildupLoadShipment.fromRevisedLoadShipment = true;


    this.buildupService.insertLoadShipment(buildupLoadShipment).subscribe(resp => {
      this.loadResp = resp;
      let resData = resp.data;
      if (this.loadResp.success) {
        this.confirmLoadFlag = true;
        this.showSuccessStatus('g.completed.successfully');
        this.afterConformLoading = true;
        //       this.uldWindow.close();
        //       this.awbWindow.close();
        this.onSearch();
        /*if (this.loadType === 'ULD') {
          this.onUldClick();
        } else {
          this.onAwbClick();
        }*/


      } else if (resData && resData.trmCaseExists) {
        this.showConfirmMessage(NgcUtility.translateMessage('confirmation.shpmnt.trm.diff.carrier', [resData.trmCarriers])).then(fulfilled => {
          resData.trmConformed = true;
          this.sendLoadingRequest(resData);
        }
        ).catch(reason => {
        });
      }
      //Display prompt when ULD is not assigned to flight
      else if (resData && resData.uldNotAssigned) {
        this.showConfirmMessage(NgcUtility.translateMessage('confirmation.uld.not.assigned', [resData.assUldTrolleyNo])).then(fulfilled => {
          buildupLoadShipment.ackInfoForUldAssign = true;
          this.buildupService.insertLoadShipment(buildupLoadShipment).subscribe(resp => {
            this.loadResp = resp;
            if (this.loadResp.success) {
              this.confirmLoadFlag = false;
              this.showSuccessStatus('g.completed.successfully');
              this.afterConformLoading = true;
              this.onSearch();
            } else if (this.loadResp.data && this.loadResp.data.warnForForeignUld) {
              this.showConfirmMessage(NgcUtility.translateMessage("maintain.foreign.uld.check.5", [this.loadResp.data.warnigInfoAndErrorMessage])).then(fulfilled => {
                buildupLoadShipment.ackForeignUld = true;
                this.sendLoadingRequestFromFoerignUldCheck(buildupLoadShipment);
              }
              ).catch(reason => {
              });
            }
            else if (this.loadResp.data && this.loadResp.data.infoFlag && this.loadResp.data.messageList.length > 0) {
              this.showConfirmMessage(this.loadResp.data.warnigInfoAndErrorMessage).then(fulfilled => {
                buildupLoadShipment.ackInfo = true;
                this.sendLoadingRequest(buildupLoadShipment);
              }
              ).catch(reason => {
              });
            } else {
              this.confirmLoadFlag = false;
              this.refreshFormMessages(this.loadResp.data);
              this.refreshFormMessages(this.loadResp);
            }
          });
        }
        ).catch(reason => {
        });
      } else if (this.loadResp.data && this.loadResp.data.infoFlag && this.loadResp.data.messageList.length > 0) {
        this.showConfirmMessage(this.loadResp.data.warnigInfoAndErrorMessage).then(fulfilled => {
          buildupLoadShipment.ackInfo = true;
          this.sendLoadingRequest(buildupLoadShipment);
        }
        ).catch(reason => {
        });
      }
      this.confirmLoadFlag = false;
      if (this.loadResp.data && !this.loadResp.data.infoFlag) {
        this.refreshFormMessages(this.loadResp.data);
        this.refreshFormMessages(this.loadResp);
      }

      else if (this.loadResp.data == null) {
        this.refreshFormMessages(this.loadResp.data);
        this.refreshFormMessages(this.loadResp);
      }
    });
    (error) => {
      this.confirmLoadFlag = false;
      this.showErrorStatus(error);
    }
  }

  sendLoadingRequestFromFoerignUldCheck(buildupLoadShipment: any) {
    this.buildupService.insertLoadShipment(buildupLoadShipment).subscribe(resp => {
      this.loadResp = resp;
      if (this.loadResp.success) {
        this.confirmLoadFlag = false;
        this.showSuccessStatus('g.completed.successfully');
        this.afterConformLoading = true;
        this.onSearch();
      } else if (this.loadResp.data && this.loadResp.data.infoFlag && this.loadResp.data.messageList.length > 0) {
        this.showConfirmMessage(this.loadResp.data.warnigInfoAndErrorMessage).then(fulfilled => {
          buildupLoadShipment.ackInfo = true;
          this.sendLoadingRequest(buildupLoadShipment);
        }
        ).catch(reason => {
        });
      }
      else {
        this.confirmLoadFlag = false;
        this.refreshFormMessages(this.loadResp.data);
        this.refreshFormMessages(this.loadResp);
      }
    });
  }


  //onSelect /enter ULD while dng confirm load
  onSelect(event, fromUI) {

    if ((event || this.LoadShipmentForm.get('assUldTrolleyNo').value) && fromUI === 1) {
      if (event && event.code) {
        this.disableULD = true;
        this.LoadShipmentForm.get('contentCode').setValue(event.param1);
        this.LoadShipmentForm.get('assUldTrolleyId').setValue(event.desc);
        this.LoadShipmentForm.get('heightCode').setValue(event.param2);
        this.LoadShipmentForm.get('phcIndicator').setValue(event.param3);
      }
      //this.disableULD = false;
      const PiggyBack = new DLSULD();
      PiggyBack.uldTrolleyNumber = this.LoadShipmentForm.get('assUldTrolleyNo').value;
      PiggyBack.flightKey = this.LoadShipmentForm.get("flightKey").value;
      PiggyBack.flightOriginDate = this.LoadShipmentForm.get("flightOriginDate").value;
      const formArray: NgcFormArray = this.LoadShipmentForm.get('toBeLoadedList') as NgcFormArray;
      if (this.loadType === 'AWB') {
        PiggyBack.flightOffPoint = this.LoadShipmentForm.get(['shipmentToLoad', 0, 'segment']).value;
      } else {
        let selectedSegment: string = null;
        formArray.controls.forEach((toBeLoadedGroup: NgcFormGroup) => {
          const selectFlag: NgcFormControl = toBeLoadedGroup.get('select') as NgcFormControl;
          const segment: NgcFormControl = toBeLoadedGroup.get('segment') as NgcFormControl;
          if (selectFlag && selectFlag.value === true) {
            selectedSegment = segment.value;
          }
        });
        PiggyBack.flightOffPoint = selectedSegment;
      }
      if (PiggyBack.uldTrolleyNumber) {
        if (this.LoadShipmentForm.get('assUldTrolleyNo').value === this.BULK || this.LoadShipmentForm.get('assUldTrolleyNo').value.length <= 8) {
          this.LoadShipmentForm.get('trolleyInd').setValue(true);
        } else {
          this.LoadShipmentForm.get('trolleyInd').setValue(false);
        }
        this._buildService.getPiggyBackFlag(PiggyBack).subscribe(res => {
          this.refreshFormMessages(res);
          this.piggyResponse = res.data;
          if (this.piggyResponse && this.piggyResponse.flightMatchesWithICS == false) {
            this.showWarningStatus('FLIGHT NO/DATE/DESTINATION IS NOT MATCHING WITH ICS INFORMATION. DO YOU WANT TO CONTINUE ASSIGNING WITH THIS FLIGHT?');
          }
          if (!event || (event && !event.code)) {
            this.LoadShipmentForm.get('contentCode').setValue(this.CONTENET_CODE);
            if (!this.LoadShipmentForm.get('trolleyInd').value) {
              this.LoadShipmentForm.get('heightCode').setValue(res.data.heightCode);
              this.LoadShipmentForm.get('assUldTrolleyId').setValue(0);
            }
            if (this.LoadShipmentForm.get('trolleyInd').value) {
              //Apend 0 to trolley ID if only 3 didgits are entered(Bug 15925)
              if (res.data.key !== this.LoadShipmentForm.get('assUldTrolleyNo').value) {
                this.LoadShipmentForm.get('assUldTrolleyNo').setValue(res.data.key);
              }
            }
          }
          //To show loaded shipments based on ULD --Laxmi
          if (this.loadType === 'ULD') {
            //This method is to show loaded shipments when you ULD/AWB
            this.showLoadedShipmentsByULDOrAWB();
          }
          if (this.loadType === 'AWB') {
            (<NgcFormArray>this.LoadShipmentForm.get('assignedULDTrollies')).controls.forEach((formGroup: NgcFormGroup) => {

              if (event === formGroup.get('assUldTrolleyNo').value) {
                this.LoadShipmentForm.get('assUldTrolleyId').setValue(formGroup.get('assUldTrolleyId').value);
              }

            });
          }

        }, error => {
          this.showErrorStatus('export.error.occured.try.again');

        });
      }
    }
    // AAT Changes 
    //Check for uld buildup complete

    this.checkForUldBuildupComplete(this.LoadShipmentForm.get('assUldTrolleyId').value);
  }

  /* onULDTrolleyNoSelect(event, index) {
     console.log(event);
     const trolleyGroup: NgcFormGroup = <NgcFormGroup>this.LoadShipmentForm.get(['uldShipmentArray', index]);
     // this.param = this.createSourceParameter(event.param1);
     trolleyGroup.get('contentCode').setValue(event.param1);
     trolleyGroup.get('assUldTrolleyId').setValue(event.desc);
     trolleyGroup.get('heightCode').setValue(event.param2);
     trolleyGroup.get('phcIndicator').setValue(event.param3);

   }*/

  onBuildUpCompleted() {
    const event = new BuildUpCompleteEvent();
    event.flightId = this.LoadShipmentForm.get('flightId').value;
    event.flightKey = this.LoadShipmentForm.get('flight_key').value;
    event.flightOriginDate = this.LoadShipmentForm.get('flightDate').value;
    this.buildupService.updateBuildUpCompleteEvent(event).subscribe((resp) => {
      this.showResponseErrorMessages(resp);
      this.eventRes = resp;
      if (this.eventRes.success) {
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.refreshFormMessages(this.eventRes.data);
      }
    });
  }

  onPiecesChange(event, i, j) {
    if (event) {
      let obj: UnloadShipment = new UnloadShipment();

      const pieces = (<NgcFormArray>this.LoadShipmentForm
        .get(['uldShipmentArray', i, 'uldInventory', j])).get('locationPiecs').value;
      const weight = (<NgcFormArray>this.LoadShipmentForm
        .get(['uldShipmentArray', i, 'uldInventory', j])).get('locationWeight').value;

      obj.loadedPieces = +pieces;
      obj.loadedWeight = +weight;
      obj.unloadPieces = +event;

      this.buildupService.unloadWeight(obj).subscribe(data => {
        this.refreshFormMessages(data);
        const res = data.data;
        if (res) {
          (<NgcFormArray>this.LoadShipmentForm
            .get(['uldShipmentArray', i, 'uldInventory', j])).get('moveWeight').setValue(res.unloadWeight);
        }
      }, error => {
        this.showErrorStatus('export.error.occured.try.again');
      });
    }
  }

  updateWeight() {
    let temp = 0;
    this.totalPieces = 0;
    this.totalShipmentWeightAfterUpdate = 0.0;
    this.totalShipmentWeightBeforeUpdate = 0.0;
    this.LoadShipmentForm.get('updateLoadedWeightArray').patchValue([]);
    this.totalLoadedWeight = 0.0;
    const req: LoadedShipment = new LoadedShipment();
    // req.shipmentId = event.record.shipmentId;
    req.shipmentId = this.LoadShipmentForm.get(['shipmentToLoad', 0]).get('shipmentId').value
    req.flightId = this.LoadShipmentForm.get('flightId').value;
    req.flightOriginDate = this.LoadShipmentForm.get('flightDate').value;
    req.flightKey = this.LoadShipmentForm.get('flight_key').value;
    req.sqCarrierGroup = this.sqCarrierGroup;
    req.fromRevisedLoadShipment = true;
    this.buildupService.getLoadedDataByShipment(req).subscribe((resp) => {

      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i].newShcList === undefined || resp.data[i].newShcList.length === 0) {
          resp.data[i].newShcList = null;
        }
        temp += resp.data[i].loadedPieces;
      }
      this.totalPieces = temp;
      this.LoadShipmentForm.get('updateLoadedWeightArray').patchValue(resp.data);
      this.totalShipmentWeightBeforeUpdate = +this.LoadShipmentForm.get(['updateLoadedWeightArray', 0]).get('totalWeight').value;
      this.totalShipmentWeightBeforeUpdate = Number(NgcUtility.getDisplayWeight(this.totalShipmentWeightBeforeUpdate));
    }
      , (error) => {
        this.showErrorStatus(error);
      }
    );
    this.updateWeightWindow.open();
  }


  // onUpdateWeightButton() {
  //   const loadedList = (<NgcFormArray>this.LoadShipmentForm.get(['updateLoadedWeightArray'])).getRawValue();

  //   this.buildupService.updateLoadedWeight(loadedList).subscribe(resp => {
  //     this.showResponseErrorMessages(resp);
  //     if (resp.success) {
  //       this.showSuccessStatus('g.completed.successfully');
  //       this.updateWeightWindow.close();
  //       //flag to maitain search screen after conform load/update weight
  //       this.afterConformLoading = true;
  //       this.afterWeightUpdate = true;
  //       this.onSearch();
  //     }
  //   }, (error) => {
  //     this.showErrorStatus(error);
  //   });

  // }

  onUpdateWeightButton() {
    const loadedList = (<NgcFormArray>this.LoadShipmentForm.get(['updateLoadedWeightArray'])).getRawValue();
    loadedList.forEach(uld => {
      uld.flightId = this.LoadShipmentForm.get('flightId').value;
      uld.flightKey = this.LoadShipmentForm.get('flight_key').value;
      uld.flightOriginDate = this.LoadShipmentForm.get('flightDate').value;
      uld.aircraftType = this.response.data.aircraftType;
      // uld.segment = this.flightOffPoint;
      uld.uldCarrierCode2 = this.carrierCode;
      uld.uldType = this.flightType;
      uld.ackInfo = false;
      uld.sqCarrierGroup = this.sqCarrierGroup;
      uld.fromRevisedLoadShipment = true;
    });

    this.buildupService.updateLoadedWeight(loadedList).subscribe(resp => {
      if (resp.success) {
        this.showSuccessStatus('g.completed.successfully');
        this.updateWeightWindow.close();
        this.afterConformLoading = true;
        this.afterWeightUpdate = true;
        this.onSearch();
      }
      else if (resp.data && resp.data[0].infoFlag && resp.data[0].messageList.length > 0) {
        this.showConfirmMessage(resp.data[0].messageList[0].code).then(fulfilled => {
          const loadedList = (<NgcFormArray>this.LoadShipmentForm.get(['updateLoadedWeightArray'])).getRawValue();
          loadedList.forEach(uld => {
            uld.flightId = this.LoadShipmentForm.get('flightId').value;
            uld.flightKey = this.LoadShipmentForm.get('flight_key').value;
            uld.flightOriginDate = this.LoadShipmentForm.get('flightDate').value;
            uld.segment = this.flightOffPoint;
            uld.uldCarrierCode2 = this.carrierCode;
            uld.uldType = this.flightType;
            uld.ackInfo = true;
            uld.sqCarrierGroup = this.sqCarrierGroup;
            uld.fromRevisedLoadShipment = true;
          });
          this.buildupService.updateLoadedWeight(loadedList).subscribe(resp => {
            this.showSuccessStatus('g.completed.successfully');
            this.updateWeightWindow.close();
            this.afterConformLoading = true;
            this.afterWeightUpdate = true;
            this.onSearch();
          });
        }
        ).catch(reason => {
        });
      }
      if (resp.data && !resp.data[0].infoFlag) {
        this.showResponseErrorMessages(resp);
      }

      else if (resp.data == null) {
        this.showResponseErrorMessages(resp);
      }
    }, (error) => {
      this.showErrorStatus(error);
    });

  }

  onMultipleShipment() {
    // this.multipleShipmentSearch.flightKey = this.LoadShipmentForm.get('flight_key').value;
    // this.multipleShipmentSearch.flightDate = this.LoadShipmentForm.get('flightDate').value;
    let navigateObj = {
      flightKey: this.LoadShipmentForm.get('flight_key').value,
      flightDate: this.LoadShipmentForm.get('flightDate').value,
      segmentId: this.LoadShipmentForm.get('segment_ID').value,
    }
    this.navigate('export/bookmultipleshipment', navigateObj);
  }

  onClickFlightPlanner() {
    this.navigateTo(this.router, '/export/planning-list', this.transferData);
  }


  sendLoadingRequest(buildupLoadShipment: any) {
    this.buildupService.insertLoadShipment(buildupLoadShipment).subscribe(resp => {
      this.loadResp = resp;
      if (this.loadResp.success) {
        this.confirmLoadFlag = false;
        this.showSuccessStatus('g.completed.successfully');
        //       this.uldWindow.close();
        //       this.awbWindow.close();
        this.afterConformLoading = true;
        this.onSearch();


        /* if (this.loadType === 'ULD') {
           this.onUldClick();
         } else {
           this.onAwbClick();
         } */

      } else {
        this.confirmLoadFlag = false;
        this.refreshFormMessages(this.loadResp.data);
        this.refreshFormMessages(this.loadResp);
      }
    });
  }

  checkbeBookingStatus() {
    (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).controls.forEach((formGroup: NgcFormGroup) => {
      //
      if (formGroup.controls.bookingStatusCode.value !== 'SS' && formGroup.controls.bookingStatusCode.value !== 'SB') {
        formGroup.controls.select.disable();
      }
    });
  }

  public groupsRenderer(value: string |
    number, rowData: any, level: any): any {
    console.log(value);
    console.log(rowData);
    if (level == 0) {
      return value;
    } else {
      return value + ' - ' + rowData.data.totalPieces + 'P' + '/' + rowData.data.totalWeight + 'W';
    }
  }

  onUpdateWeightChange(event: any, index: any) {
    let i: number = 0.0;
    let holdWeight: number;
    (<NgcFormArray>this.LoadShipmentForm.get('updateLoadedWeightArray')).controls.forEach((formGroup: NgcFormGroup) => {
      i += +formGroup.get('loadedWeight').value;
    });
    this.totalShipmentWeightAfterUpdate = (this.totalShipmentWeightBeforeUpdate - i);
    this.totalShipmentWeightAfterUpdate = +(Number(NgcUtility.getDisplayWeight(this.totalShipmentWeightAfterUpdate)));
  }

  onFlightKey() {
    // this.flightKeyforDropdown =   this.createSourceParameter(event);
    this.LoadShipmentForm.get('segment_ID').reset();
    if (this.LoadShipmentForm.get('flightDate').value) {
      this.flightKeyforDropdown = this.createSourceParameter(this.LoadShipmentForm.get('flight_key').value,
        this.LoadShipmentForm.get('flightDate').value);
    }
  }
  //On select of segment ID
  selectSegmentId(event) {
    this.afterConformLoading = false;
    //these two parameters were to control deafault serach
    let flightkey: any;
    let flightDate: any;
    this.loadType = 'ULD';
    //Making loadbyULD radio button enable by deafult and load by AWB disabled otherwise two buttons getting enabled simultaneouly
    this.LoadShipmentForm.get('loadbyULD').setValue(true);
    this.LoadShipmentForm.get('loadbyAWB').setValue(false);
    if (event) {
      this.uldSourceParameter = this.createSourceParameter(event.code);
      this.LoadShipmentForm.get('segment_ID').setValue(event.code);
      if (this.flightDateForAutoSearch === this.LoadShipmentForm.get('flightDate').value
        && this.flightKeyForAutoSearch === this.LoadShipmentForm.get('flight_key').value
        && this.LoadShipmentForm.get('flight_key').value === this.LoadShipmentForm.get('flightKey').value) {
        this.onSearch();
      }
      this.flightDateForAutoSearch = this.LoadShipmentForm.get('flightDate').value;
      this.flightKeyForAutoSearch = this.LoadShipmentForm.get('flight_key').value;

    }

  }
  //Method to show loaded shipments on click of ULD /AWB from LOV
  showLoadedShipmentsByULDOrAWB() {
    let loadedShipmentByULDOrAWB: Array<any> = new Array();
    if (this.loadedShipments) {
      //filtering  loaded Shipments
      if (this.loadType === 'ULD') {
        this.loadedShipmentsByULD = true;
        loadedShipmentByULDOrAWB = this.loadedShipments.filter(shipment => shipment.assUldTrolleyNo === this.LoadShipmentForm.get('assUldTrolleyNo').value);
      } else {
        this.loadedShipmentsByAWB = true;
        loadedShipmentByULDOrAWB = this.loadedShipments.filter(shipment => shipment.shipmentNumber === this.LoadShipmentForm.get(['shipmentToLoad', 0]).get('shipmentNumber').value);
      }
      //If loaded shipments exists ,need to calculate total loaded shipment total weight
      if (loadedShipmentByULDOrAWB.length !== 0) {
        (<NgcFormArray>this.LoadShipmentForm.get('loadedUldList')).patchValue(loadedShipmentByULDOrAWB);
        if (this.loadType === 'ULD') {
          //to show total loaded shipments in the ULD
          (this.LoadShipmentForm.get('totalLoadedPiecestoDisplay')).setValue(loadedShipmentByULDOrAWB[0].totalPieces);
          (this.LoadShipmentForm.get('totalLoadedWeighttoDisplay')).setValue(loadedShipmentByULDOrAWB[0].totalWeight);
          //(this.LoadShipmentForm.get('totalloaded')).patchValue(loadedShipmentByULDOrAWB[0].totalPieces + '/' + loadedShipmentByULDOrAWB[0].totalWeight);
        } else {
          let totalWeight = 0;
          let totalPieces = 0.0;
          loadedShipmentByULDOrAWB.forEach(shipment => {
            totalPieces += shipment.loadedPieces;
            totalWeight += shipment.loadedWeight;
          });
          //to show total shipment loaded  pieces and eight
          (this.LoadShipmentForm.get('totalLoadedPiecestoDisplay')).setValue(totalPieces);
          (this.LoadShipmentForm.get('totalLoadedWeighttoDisplay')).setValue(totalWeight);
          // (this.LoadShipmentForm.get('totalloaded')).patchValue(totalPieces + '/' + totalWeight);
        }
      } else {
        (<NgcFormArray>this.LoadShipmentForm.get('loadedUldList')).patchValue([]);
        (this.LoadShipmentForm.get('totalLoadedPiecestoDisplay')).setValue(0);
        (this.LoadShipmentForm.get('totalLoadedWeighttoDisplay')).setValue(0.0)

      }
    }
  }
  // On delete of shipmnet inventory on load by ULD
  onDeleteShipment(index: any) {
    let shipment = (<NgcFormArray>this.LoadShipmentForm.controls["uldShipmentArray"]).getRawValue();
    let shipmentNumber = shipment[index].shipmentNumber;
    (<NgcFormArray>this.LoadShipmentForm.controls["uldShipmentArray"]).deleteValueAt(index);
    if ((<NgcFormArray>this.LoadShipmentForm.get('uldShipmentArray')).length === 0) {
      this.confirmLoadFlag = true;
    }
    (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).controls.forEach((formGroup: NgcFormGroup) => {
      if (formGroup.get('shipmentNumber').value === shipmentNumber) {
        formGroup.get('select').setValue(false);
      }
    });
  }
  //On select of check box , Shipment inventory to be loaded  on Load By ULD
  onSelectCheckBox(event) {
    // (<NgcFormArray>this.LoadShipmentForm.get(['uldShipmentArray'])).patchValue(this.eventData[event.record.NGC_ROW_ID]);
    let shipment = event.record;
    if (shipment.select) {
      let shipmentNum = shipment.shipmentNumber;
      let tobeloadedShipmentInventory = (<NgcFormArray>this.LoadShipmentForm.get('uldShipmentArray')).getRawValue();
      if (tobeloadedShipmentInventory.length === 0) {
        this.setShipmentInvenotoryDetails(shipment);
      } else {
        // if Inventory is already existed for the selected shipment.
        let exits = tobeloadedShipmentInventory.some(({ shipmentNumber }) => shipmentNumber == shipmentNum);
        if (!exits) {
          this.setShipmentInvenotoryDetails(shipment);
        }
      }

      this.confirmLoadFlag = false;
    }
  }

  //Setting actual shipment details for shipment Inventory
  setActualShipmnetDetails(shipment: any) {
    let uldResponse = new ShipmentsTobeLoadedInventory();
    uldResponse.shipmentNumber = shipment.shipmentNumber;
    uldResponse.shipmentId = shipment.shipmentId;
    uldResponse.segment = shipment.segment;
    uldResponse.pieces = shipment.pieces;
    uldResponse.weight = shipment.weight
    uldResponse.segmentId = shipment.segmentId;
    uldResponse.segmentId = shipment.segmentId;
    uldResponse.sqCarrierGroup = shipment.sqCarrierGroup;
    //Bug 12779
    uldResponse.origin = shipment.origin;

    if (shipment.shipmentLocked) {
      uldResponse.shipmentLockFlag = true;
    }
    else {
      uldResponse.shipmentLockFlag = false;
    }
    if (shipment.finalizeWeightInitiatedOn) {
      uldResponse.popUpOpeningTime = shipment.finalizeWeightInitiatedOn;
    }
    return uldResponse;
  }
  //common function to get Inventory details
  setShipmentInvenotoryDetails(shipment: any) {
    let uldList: Array<any> = new Array();
    if (shipment) {
      // this.uldReq.searchShipmentUldList = shipment;
      let uldInventory = shipment.shipmentInventoryList;
      if (uldInventory && uldInventory.length !== 0) {
        //Setting actual shipment details for shipment Inventory
        let uldResponse = this.setActualShipmnetDetails(shipment);
        uldResponse.uldInventory = uldInventory;
        uldList.push(uldResponse);
      }
    }
    //If Shipments already selected to load in load by ULD we need to add selected shipment to this list
    let tobeloadedShipmentInventory = (<NgcFormArray>this.LoadShipmentForm.get('uldShipmentArray')).getRawValue();
    if (tobeloadedShipmentInventory.length !== 0 && this.loadType === 'ULD') {
      tobeloadedShipmentInventory.forEach(shipment => {
        uldList.push(shipment);
      })
    }
    if (uldList.length !== 0) {
      this.LoadShipmentForm.get('uldShipmentArray').patchValue(uldList);
      this.confirmLoadFlag = false;
      //This method is to calculate  total shipment to be loaded
      this.setTotaltobeloadedWeight(uldList);

    } else {
      this.confirmLoadFlag = true;
      this.LoadShipmentForm.get('uldShipmentArray').patchValue([]);
      // (this.LoadShipmentForm.get('totalToBeloaded')).patchValue(0 + '/' + 0.0);
      (this.LoadShipmentForm.get('totalToBeloadedPieces')).patchValue(0);
      (this.LoadShipmentForm.get('totalToBeloadedWeight')).patchValue(0.0);
    }
    // }

  }

  //On click of AWB number --displaying inventory to be loaded on Load by AWB
  onSelectAWB(event, fromUI) {
    if (event && fromUI === 1) {
      this.loadByAWB = true;
      if (event.code) {
        //getting selected shipment details
        let tobeloadedShipment = (<NgcFormArray>this.LoadShipmentForm.get('shipmentList')).getRawValue().filter(shipment => shipment.shipmentNumber === event.code);
        (<NgcFormArray>this.LoadShipmentForm.get('shipmentToLoad')).patchValue(tobeloadedShipment);
        //Preparing Shipment Inventory details
        this.setShipmentInvenotoryDetails(tobeloadedShipment[0]);
        //preapring loaded shipmet details
        this.showLoadedShipmentsByULDOrAWB();
      }
    }
  }

  //On select ULD check box on load by AWB
  onSelectULDCheckBox(event) {
    this.disableULD = true;
    let uld = event.record;
    let uldList = new Array();
    if (!uld.checkBox) {
      if (uld.assUldTrolleyNo === this.LoadShipmentForm.get('assUldTrolleyNo').value) {
        this.resetULDData();
        this.disableULD = false;
      }
      return;
    } else {
      let list = (<NgcFormArray>this.LoadShipmentForm.get('assignedULDTrollies')).getRawValue().filter(element => element.checkBox);
      if (list.length > 1) {
        this.showErrorStatus('export.select.one.uld.atmost');
        (<NgcFormArray>this.LoadShipmentForm.get('assignedULDTrollies')).controls.forEach((formGroup: NgcFormGroup) => {
          if (formGroup.get('assUldTrolleyNo').value === uld.assUldTrolleyNo) {
            formGroup.get('checkBox').setValue(false);
          }
        });
        return;
      } else {
        this.refreshFormMessages([]);
      }

    }
    let uldDetails = {
      code: uld.assUldTrolleyNo,
      desc: uld.assUldTrolleyId,
      param1: uld.contentCode,
      param2: uld.heightCode,
      param3: uld.phcIndicator,
      param4: uld.assUldTrolleyNo
    }
    this.onSelectULD(uldDetails);

  }

  //if one ULD select on Load by AWB default ULD details need to Auto filled
  onSelectULD(event) {
    this.LoadShipmentForm.get('assUldTrolleyNo').setValue(event.code);
    this.LoadShipmentForm.get('contentCode').setValue(event.param1);
    this.LoadShipmentForm.get('assUldTrolleyId').setValue(event.desc);
    this.LoadShipmentForm.get('heightCode').setValue(event.param2);
    this.LoadShipmentForm.get('phcIndicator').setValue(event.param3)
    if (this.LoadShipmentForm.get('assUldTrolleyNo').value === this.BULK || this.LoadShipmentForm.get('assUldTrolleyNo').value.length <= 8) {
      this.LoadShipmentForm.get('trolleyInd').setValue(true);
    } else {
      this.LoadShipmentForm.get('trolleyInd').setValue(false);
    }
  }
  //reset ULD data after load/while shuffling load by ULD or load by AWB
  resetULDData() {
    this.LoadShipmentForm.get('assUldTrolleyNo').setValue('');
    this.LoadShipmentForm.get('assUldTrolleyId').reset();
    this.LoadShipmentForm.get('contentCode').reset();
    this.LoadShipmentForm.get('heightCode').reset();
    this.LoadShipmentForm.get('phcIndicator').reset();
    this.LoadShipmentForm.get('trolleyInd').setValue(false);

    if (this.loadType === 'ULD') {
      this.LoadShipmentForm.get('uldShipmentArray').patchValue([]);
      (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).controls.forEach((formGroup: NgcFormGroup) => {

        formGroup.get('select').setValue(false);

      });

    }

  }
  //For, to be loaded shipments LOV
  ToBeLoadedAWBList() {
    let shpList = new Array();
    // (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).getRawValue().forEach(element => {
    //   if (element.bookingStatusCode === 'SS' || element.bookingStatusCode === 'SB') {
    //     shpList.push({
    //       code: element.shipmentNumber,
    //       desc: element.shipmentNumber
    //     });
    //   }
    // });
    (<NgcFormArray>this.LoadShipmentForm.get('shipmentList')).getRawValue().forEach(element => {
      shpList.push({
        code: element.shipmentNumber,
        desc: element.shipmentNumber
      });
    });
    if (shpList && shpList.length !== 0) {
      this.awbLOVSourceId = NgcUtility.createAndCacheSourceByObjectList(shpList);
    } else {
      this.awbLOVSourceId = NgcUtility.createAndCacheSourceByObjectList([]);
    }
  }


  // checkTrmcase() {
  //   this.confirmLoadFlag = true;

  //   const buildupLoadShipment = new BuildupLoadShipment();
  //   const loadedShipmentList = [];
  //   const shc = new SHC();
  //   const shipmentHouse = new ShipmentHouse();
  //   this.shipmentsSelectedToLoad = (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).getRawValue().filter(element => element.select);
  //   // setting the Load level values into main model
  //   buildupLoadShipment.flightOriginDate = this.LoadShipmentForm.get('flightDate').value;
  //   buildupLoadShipment.flightKey = this.LoadShipmentForm.get('flight_key').value;
  //   buildupLoadShipment.flightId = this.LoadShipmentForm.get('flightId').value;
  //   buildupLoadShipment.loadType = this.loadType;
  //   // getitng the Shipment yet to be loaded data Array
  //   const toBeload = (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).getRawValue();
  //   // getitng the Array data for Shipment whichh is about to load
  //   const uldArray = (<NgcFormArray>this.LoadShipmentForm.get('uldShipmentArray')).getRawValue();

  //   // Loop for ULD level data
  //   for (let i = 0; i < uldArray.length; i++) {
  //     const shipment = new LoadUldShipment();
  //     const laodShipmentList = [];
  //     shipment.flightKey = this.LoadShipmentForm.get('flight_key').value;
  //     shipment.flightOriginDate = this.LoadShipmentForm.get('flightDate').value;
  //     shipment.flightId = this.LoadShipmentForm.get('flightId').value;
  //     shipment.shipmentId = uldArray[i].shipmentId;
  //     shipment.segmentId = uldArray[i].segmentId;
  //     shipment.segment = uldArray[i].segment;
  //     buildupLoadShipment.segmentId = uldArray[i].segmentId;
  //     const inveArray: Array<any> = <Array<any>>uldArray[i].uldInventory;
  //     // loop for shipment level data
  //     for (let j = 0; j < inveArray.length; j++) {
  //       const shcList = [];
  //       //const tagNumberList: Array<ShipmentHouse> = [];
  //       const loadedShipment = new LoadedShipment();
  //       loadedShipment.flightId = this.LoadShipmentForm.get('flightId').value;
  //       loadedShipment.shipmentId = uldArray[i].shipmentId;
  //       loadedShipment.segmentId = uldArray[i].segmentId;
  //       loadedShipment.flightKey = this.LoadShipmentForm.get('flight_key').value;
  //       loadedShipment.shipmentInventoryId = inveArray[j].shipmentInventoryId;
  //       loadedShipment.locationPiecs = inveArray[j].locationPiecs;
  //       loadedShipment.locationWeight = inveArray[j].locationWeight;
  //       loadedShipment.dryIceWeight = inveArray[j].dryIceWeight;
  //       loadedShipment.actualWeightWeighed = inveArray[j].actualWeightWeighed;
  //       loadedShipment.awbPieces = this.LoadShipmentForm.get(['uldShipmentArray', 0, 'pieces']).value;
  //       loadedShipment.awbWeight = this.LoadShipmentForm.get(['uldShipmentArray', 0, 'weight']).value;
  //       if (!inveArray[j].dryIceWeight) {
  //         loadedShipment.dryIceWeight = 0.0;
  //       }
  //       // Case for By ULD loading
  //       loadedShipment.assUldTrolleyNo = this.LoadShipmentForm.get('assUldTrolleyNo').value;
  //       loadedShipment.assUldTrolleyId = +this.LoadShipmentForm.get('assUldTrolleyId').value;
  //       loadedShipment.contentCode = this.LoadShipmentForm.get('contentCode').value;
  //       loadedShipment.heightCode = this.LoadShipmentForm.get('heightCode').value;
  //       loadedShipment.phcIndicator = this.LoadShipmentForm.get('phcIndicator').value;
  //       // setting data into Uld level object
  //       shipment.assUldTrolleyNo = this.LoadShipmentForm.get('assUldTrolleyNo').value;
  //       shipment.assUldTrolleyId = +this.LoadShipmentForm.get('assUldTrolleyId').value;
  //       shipment.contentCode = this.LoadShipmentForm.get('contentCode').value;
  //       shipment.heightCode = this.LoadShipmentForm.get('heightCode').value;
  //       shipment.phcIndicator = this.LoadShipmentForm.get('phcIndicator').value;
  //       // setting data into biludup object
  //       buildupLoadShipment.assUldTrolleyNo = this.LoadShipmentForm.get('assUldTrolleyNo').value;
  //       buildupLoadShipment.assUldTrolleyId = +this.LoadShipmentForm.get('assUldTrolleyId').value;
  //       buildupLoadShipment.contentCode = this.LoadShipmentForm.get('contentCode').value;
  //       buildupLoadShipment.heightCode = this.LoadShipmentForm.get('heightCode').value;
  //       buildupLoadShipment.phcIndicator = this.LoadShipmentForm.get('phcIndicator').value;
  //       // set the value for PHC Indicator to 0 in case of it's null
  //       if (this.LoadShipmentForm.get('phcIndicator').value == null || !this.LoadShipmentForm.get('phcIndicator').value) {
  //         loadedShipment.phcIndicator = 0;
  //         shipment.phcIndicator = 0;
  //         buildupLoadShipment.phcIndicator = 0;
  //       } else {
  //         loadedShipment.phcIndicator = 1;
  //         shipment.phcIndicator = 1;
  //         buildupLoadShipment.phcIndicator = 1;
  //       }
  //       //}
  //       if (!inveArray[j].movePiecs) {
  //         loadedShipment.movePiecs = 0;
  //       } else {
  //         loadedShipment.movePiecs = inveArray[j].movePiecs;
  //       }
  //       if (!inveArray[j].moveWeight) {
  //         loadedShipment.moveWeight = 0.0;
  //       } else {
  //         loadedShipment.moveWeight = inveArray[j].moveWeight;
  //       }
  //       if (!inveArray[j].moveDryIce) {
  //         loadedShipment.moveDryIce = 0.0;
  //       } else {
  //         loadedShipment.moveDryIce = inveArray[j].moveDryIce;
  //       }

  //       loadedShipment.shcList = inveArray[j].shcList;
  //       loadedShipment.tagNumberList = inveArray[j].tagNumberList;
  //       laodShipmentList.push(loadedShipment);
  //     }
  //     shipment.loadShipmentList = laodShipmentList;
  //     if (this.popUpOpeningTime) {
  //       shipment.popUpOpeningTime = this.popUpOpeningTime;
  //     }
  //     loadedShipmentList.push(shipment);
  //   }

  //   buildupLoadShipment.loadedShipmentList = loadedShipmentList;

  // }

  onCancel() {
    this.navigateBack(this.transferData);
  }

  OnClear(event) {
    this.LoadShipmentForm.reset();
    this.resetFormMessages();
    this.loadByULD = false;
    this.loadByAWB = false;
    this.loadedShipmentsByULD = false;
    this.loadedShipmentsByAWB = false;
    this.afterConformLoading = false;
    //this.toBeLoadFlag = false;
    this.flightFlag = false;
    this.loadType = null;
    this.LoadShipmentForm.get('flightDate').setValue(new Date());
  }

  routeToAssignUld() {
    let navigateObj = {
      flightKey: this.LoadShipmentForm.get('flight_key').value,
      flightOriginDate: this.LoadShipmentForm.get('flightDate').value,
      segmentId: this.LoadShipmentForm.get('segment_ID').value,
    }
    this.navigateTo(this.router, '/export/buildup/assign-uld-flight', navigateObj);
  }

  routeToUnloadShipment() {
    let navigateObj = {
      flightKey: this.LoadShipmentForm.get('flight_key').value,
      flightOriginDate: this.LoadShipmentForm.get('flightDate').value,
      segmentId: this.LoadShipmentForm.get('segment_ID').value
    }
    this.navigateTo(this.router, '/export/buildup/unloadshipmentDesktop', navigateObj);
  }

  routeToUpdateDLS() {
    let transferData: any = {
      flightKey: this.LoadShipmentForm.get('flight_key').value,
      flightOriginDate: this.LoadShipmentForm.get('flightDate').value,
      segmentId: this.LoadShipmentForm.get('segment_ID').value
    };
    this.navigateTo(this.router, '/export/buildup/update-dls', transferData);
  }

  routeToNOTOC() {
    let transferData: any = {
      flightKey: this.LoadShipmentForm.get('flight_key').value,
      flightOriginDate: this.LoadShipmentForm.get('flightDate').value,
    };
    this.navigateTo(this.router, '/export/notoc/revisednotoc', transferData);
  }

  routeToAccessary() {
    let transferData: any = {
      flightKey: this.LoadShipmentForm.get('flight_key').value,
      flightDate: this.LoadShipmentForm.get('flightDate').value,
    };
    this.navigateTo(this.router, '/warehouse/addAccessory', transferData);
  }

  onClickShipmentInformation() {
    let shipmentNumber: any;
    if (this.loadType === 'ULD') {
      let list = (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).getRawValue().filter(element => element.select);
      if (list.length > 1) {
        this.showErrorStatus('select.one.shipment.atmost');
        return;
      } else if (list.length > 0) {
        shipmentNumber = list[0].shipmentNumber;

      }
    } else {
      let shipmentlist = (<NgcFormArray>this.LoadShipmentForm.get('shipmentToLoad')).getRawValue();
      if (shipmentlist.length > 0) {
        shipmentNumber = shipmentlist[0].shipmentNumber;
      }
    }
    if (!shipmentNumber) {
      this.showErrorStatus('export.select.a.shipment');
      return;
    }
    let navigateObj = {
      flightKey: this.LoadShipmentForm.get('flight_key').value,
      flightOriginDate: this.LoadShipmentForm.get('flightDate').value,
      segmentId: this.LoadShipmentForm.get('segment_ID').value,
      shipmentNumber: shipmentNumber
    }

    this.navigateTo(this.router, '/awbmgmt/shipmentinfoCR', navigateObj);
  }
  //This method is to set total shipment to be loaded
  setTotaltobeloadedWeight(uldList: any) {
    if (this.loadType === 'AWB') {
      let totalPieces = 0;
      let totalWeight = 0.0;
      uldList.forEach(shipment => {
        shipment.uldInventory.forEach(inv => {
          totalPieces += inv.locationPiecs;
          totalWeight += inv.locationWeight;
        })
      });

      //(this.LoadShipmentForm.get('totalToBeloaded')).patchValue(totalPieces + '/' + totalWeight);
      (this.LoadShipmentForm.get('totalToBeloadedPieces')).patchValue(totalPieces);
      (this.LoadShipmentForm.get('totalToBeloadedWeight')).patchValue(totalWeight);
    }


  }


  // AAT Changes starts here

  onBuildUpCompletedByULD() {
    const event = new BuildUpCompleteEvent();
    event.flightId = this.LoadShipmentForm.get('flightId').value;
    event.flightKey = this.LoadShipmentForm.get('flight_key').value;
    event.flightOriginDate = this.LoadShipmentForm.get('flightDate').value;
    event.assULDTrolleyId = this.LoadShipmentForm.get('assUldTrolleyId').value;
    event.uldNumber = this.LoadShipmentForm.get('assUldTrolleyNo').value;
    event.checkUldBuildUpComplete = this.checkUldBuildUpFlag;
    let loadedlist = [];
    loadedlist = this.LoadShipmentForm.get('loadedUldList').value

    console.log(this.LoadShipmentForm.get('loadedUldList').value);
    console.log(loadedlist);
    console.log(loadedlist.length);

    console.log(this.LoadShipmentForm.value);
    console.log(event);
    if (loadedlist.length == 0) {
      this.showErrorStatus('nothing.loaded.in.uld');
      return;
    }
    if (event.uldNumber == null) {
      this.showErrorStatus('load.select.uld.trolley');
      return;
    }
    if (event.assULDTrolleyId == null) {
      this.showErrorStatus('load.uld.is.not.assigned');
      return;
    }

    this.buildupService.updateBuildUpCompleteByULD(event).subscribe((resp) => {
      this.showResponseErrorMessages(resp);
      this.eventRes = resp;
      if (this.eventRes.success) {
        this.checkUldBuildUpFlag = this.eventRes.data.checkUldBuildUpComplete;
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.refreshFormMessages(this.eventRes.data);
      }
    });
  }

  checkForUldBuildupComplete(assULDTrolleyId: any) {
    const event = new BuildUpCompleteEvent();
    event.assULDTrolleyId = assULDTrolleyId;
    this.buildupService.checkBuildUpCompleteByULD(event).subscribe((resp) => {
      this.showResponseErrorMessages(resp);
      this.eventRes = resp;
      if (this.eventRes.success) {
        if (this.eventRes.data.checkUldBuildUpComplete != null) {
          this.checkUldBuildUpFlag = this.eventRes.data.checkUldBuildUpComplete;
        }
      } else {
        this.refreshFormMessages(this.eventRes.data);
      }
    });


  }

}
