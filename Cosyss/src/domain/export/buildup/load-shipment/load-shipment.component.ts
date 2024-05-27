import { NgcFormControl } from 'ngc-framework';
import { FormArray, FormGroup, Validator, Validators } from '@angular/forms';
import {
  SearchLoadShipment, SearchBuildupFlight, BuildupLoadShipment, SearchUldShipment, SearchShipmentUld,
  LoadUldShipment, ShipmentHouse, LoadedShipment, SHC, BuildUpCompleteEvent, UnloadShipment, BookMultipleShipmentSearch
} from './../../export.sharedmodel';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';

import { BuildupService } from './../buildup.service';
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration
} from 'ngc-framework';
import { DLSULD } from '../buildup.sharedmodel';

/**
 * This component helps in loading
 * shipment to ULD by AWB
 * and by ULD itself
 *
 * @export
 * @class LoadShipmentComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'ngc-load-shipment',
  templateUrl: './load-shipment.component.html',
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class LoadShipmentComponent extends NgcPage {
  private CONTENET_CODE = 'C';
  private HEIGHT_CODE = 'QL';
  private response;
  private eventRes;
  private uldResp;
  private loadResp;
  private loadType: string;
  private toBeLoadFlag;
  private loadFlag;
  private currentLoadedRow;
  private flightFlag;
  private loadingFlag;
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
  private totalPieces: number = 0;;
  private transferData: any;
  private uldReq = new SearchUldShipment();
  private popUpOpeningTime: any;
  piggyResponse: any;
  private flightType: any;
  private carrierCode: any;
  private flightBoardPoint: any;
  private flightOffPoint: any;
  private aircraftType: any;


  @ViewChild('uldWindow') uldWindow: NgcWindowComponent;
  @ViewChild('awbWindow') awbWindow: NgcWindowComponent;
  @ViewChild('updateWeightWindow') updateWeightWindow: NgcWindowComponent;

  private LoadShipmentForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl('', Validators.required),
    flightOriginDate: new NgcFormControl(new Date(), Validators.required),
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
    toBeLoadedList: new NgcFormArray([

    ]),

    uldShipmentArray: new NgcFormArray([
    ]),

    loadedUldList: new NgcFormArray([
    ])
    , updateLoadedWeightArray: new NgcFormArray([])
  });

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private buildupService: BuildupService, private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute, private router: Router, private _buildService: BuildupService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.onChanges();
    this.transferData = this.getNavigateData(this.activatedRoute);
    if (this.transferData && !this.transferData.fromDate) {
      this.LoadShipmentForm.patchValue(this.transferData);
      this.onSearch();
    }
  }

  onChanges(): void {
    this.LoadShipmentForm.get('assUldTrolleyNo').valueChanges.subscribe(
      newValue => {
        this.LoadShipmentForm.get('contentCode').setValue(this.LoadShipmentForm.get('param1')
          .value);
      });
  }
  /**
   *
   *
   * @memberof LoadShipmentComponent
   */
  onSearch() {
    this.toBeLoadFlag = false;
    this.loadingFlag = false;
    this.loadFlag = false;
    if (this.LoadShipmentForm.get('flightKey').invalid || this.LoadShipmentForm.get('flightOriginDate').invalid) {
      this.showErrorStatus('export.please.fill.details');
      return;
    }
    const searchReq = new SearchLoadShipment();
    searchReq.flightKey = this.LoadShipmentForm.get('flightKey').value;
    searchReq.flightOriginDate = this.LoadShipmentForm.get('flightOriginDate').value;
    //this.uldSourceParameter = this.createSourceParameter(searchReq.flightKey, NgcUtility.getDateOnly(searchReq.flightOriginDate).toJSON());
    this.buildupService.searchLoadShipment(searchReq).subscribe((resp) => {
      this.response = resp;
      if (this.uldResp) {
        if (this.uldResp.messageList) {
          this.showConfirmMessage(
            this.uldResp.messageList[0].message
          )
            .then(fulfilled => {
              this.uldReq.searchShipmentUldList[0].trmCase = true;
              this.buildupService.fetchShipmentByUld(this.uldReq).subscribe(resp => {
                this.uldResp = resp;
                if (!resp.success) {
                  this.isUldWindowOpen = false;
                  this.uldWindow.close();
                  return;
                } else {
                  this.uldWindow.open();
                }

                this.LoadShipmentForm.get('uldShipmentArray').patchValue(resp.data);
              });
            })
            .catch(reason => { });
        }
      }
      this.uldResp = null;
      if (this.response.success) {
        this.flightFlag = true;
        this.flightType = this.response.data.flightType;
        this.carrierCode = this.response.data.carrierCode;
        this.flightBoardPoint = this.response.data.flightBoardPoint;
        this.flightOffPoint = this.response.data.flightOffPoint;
        this.aircraftType = this.response.data.aircraftType;
        console.log(JSON.stringify);
        // this.showSuccessStatus('g.completed.successfully');

        this.toBeLoadFlag = true;
        this.loadingFlag = true;
        this.loadFlag = true;
        this.showResponseErrorMessages(resp);
        this.LoadShipmentForm.patchValue(this.response.data);
        this.checkbeBookingStatus();
        const toBeload = (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).getRawValue();
        const loaded = (<NgcFormArray>this.LoadShipmentForm.get('loadedUldList')).getRawValue();
        console.log(JSON.stringify(this.response.data));
      } else {
        this.showResponseErrorMessages(resp);
        // this.LoadShipmentForm.reset();
        this.showErrorStatus(this.loadResp.messageList);
        this.refreshFormMessages(this.response);
      }

      (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).controls.forEach((formGroup: NgcFormGroup) => {
        //
        formGroup.valueChanges.subscribe((changes) => {
          let enableShipmentControl: boolean = true;
          const formArray: NgcFormArray = this.LoadShipmentForm.get('toBeLoadedList') as NgcFormArray;
          let selectedSegment: string = null;
          //
          if (formArray && formArray.controls) {
            try {
              formArray.controls.forEach((toBeLoadedGroup: NgcFormGroup) => {
                const selectFlag: NgcFormControl = toBeLoadedGroup.get('select') as NgcFormControl;
                const segment: NgcFormControl = toBeLoadedGroup.get('segment') as NgcFormControl;
                //
                if (selectFlag && selectFlag.value === true) {
                  enableShipmentControl = false;
                  selectedSegment = segment.value;
                  throw new Error('export.data.found');
                }
              });
            } catch (e) { }
            //
            formArray.controls.forEach((toBeLoadedGroup: NgcFormGroup) => {
              const selectFlag: NgcFormControl = toBeLoadedGroup.get('select') as NgcFormControl;
              const segment: NgcFormControl = toBeLoadedGroup.get('segment') as NgcFormControl;
              //
              if (segment.value === selectedSegment || selectedSegment === null) {
                selectFlag.enable({
                  onlySelf: true,
                  emitEvent: false
                });
              } else {
                selectFlag.disable({
                  onlySelf: true,
                  emitEvent: false
                });
              }
            });
          }
          //
          this.loadShipmentEnableFlag = enableShipmentControl;
        });
      });

      console.log(this.response.data);
      console.log(JSON.stringify(this.response.data));
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
  onUldClick() {
    let segmentCheck: any;
    this.confirmLoadFlag = false;
    let count = 0;
    this.LoadShipmentForm.get('assUldTrolleyNo').reset();
    this.LoadShipmentForm.get('assUldTrolleyId').reset();
    this.LoadShipmentForm.get('contentCode').reset();
    this.LoadShipmentForm.get('heightCode').reset();
    this.LoadShipmentForm.get('phcIndicator').reset();
    this.LoadShipmentForm.get('uldShipmentArray').patchValue([]);
    this.loadType = 'ULD';
    const searchShipmentUldList = [];
    const uldArray = (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).getRawValue();
    for (let i = 0; i < uldArray.length; i++) {

      if (uldArray[i].select) {
        if (count === 0) {
          this.uldSourceParameter = this.createSourceParameter(uldArray[i].segmentId, Math.random().toString());
        }
        const search = new SearchShipmentUld();
        search.shipmentId = uldArray[i].shipmentId;
        search.shipmentNumber = uldArray[i].shipmentNumber;
        search.segmentId = uldArray[i].segmentId;
        search.segment = uldArray[i].segment;
        search.pieces = uldArray[i].pieces;
        search.weight = uldArray[i].weight;
        search.weight = uldArray[i].weight;
        search.flightkey = this.LoadShipmentForm.get('flightKey').value;
        searchShipmentUldList.push(search);
        count++;
        if (segmentCheck && segmentCheck != uldArray[i].segmentId) {
          this.showErrorStatus('export.check.selected.shipments.belongs.to.different.segments');
          return;
        }
        segmentCheck = uldArray[i].segmentId;
      }
    }
    this.uldReq.searchShipmentUldList = searchShipmentUldList;

    this.buildupService.fetchShipmentByUld(this.uldReq).subscribe((resp) => {
      this.uldResp = resp;
      if (this.uldResp.data) {
        this.popUpOpeningTime = this.uldResp.data[0].popUpOpeningTime;
      }
      if (!resp.success) {
        this.isUldWindowOpen = false;
        this.uldWindow.close();
        return;
      } else {
        this.uldWindow.open();
      }

      this.LoadShipmentForm.get('uldShipmentArray').patchValue(resp.data);
      console.log(this.uldResp.data);
      console.log(JSON.stringify(this.uldResp.data));
    });
    // this.inventorySHCParam = this.createSourceParameter(flightKey);
    // this.inventoryTAGParam = this.createSourceParameter();

  }

  /**
   * Method called for loading shipment by AWB
   */
  onAwbClick() {
    let segmentCheck: any;
    this.confirmLoadFlag = false;
    let count = 0;
    this.LoadShipmentForm.get('uldShipmentArray').patchValue([]);
    this.loadType = 'AWB';
    const uldReq = new SearchUldShipment();
    const searchShipmentUldList = [];
    const uldArray = (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).getRawValue();
    for (let i = 0; i < uldArray.length; i++) {

      if (uldArray[i].select) {
        if (count === 0) {
          this.uldSourceParameter = this.createSourceParameter(uldArray[i].segmentId, Math.random().toString());
        }
        const search = new SearchShipmentUld();
        search.shipmentId = uldArray[i].shipmentId;
        search.shipmentNumber = uldArray[i].shipmentNumber;
        search.segmentId = uldArray[i].segmentId;
        search.segment = uldArray[i].segment;
        search.pieces = uldArray[i].pieces;
        search.weight = uldArray[i].weight;
        search.flightkey = this.LoadShipmentForm.get('flightKey').value;
        searchShipmentUldList.push(search);
        count++;
        if (segmentCheck && segmentCheck != uldArray[i].segmentId) {
          this.showErrorStatus('export.check.selected.shipments.belongs.to.different.segments');
          return;
        }
        segmentCheck = uldArray[i].segmentId;
      }
    }
    uldReq.searchShipmentUldList = searchShipmentUldList;

    this.buildupService.fetchShipmentByUld(uldReq).subscribe((resp) => {
      this.uldResp = resp;
      if (this.uldResp.data) {
        this.popUpOpeningTime = this.uldResp.data[0].popUpOpeningTime;
      }
      if (!resp.success) {
        this.isAWBWindowOpen = false;
        this.awbWindow.close();
        return;
      }
      this.LoadShipmentForm.get('uldShipmentArray').patchValue(resp.data);
      console.log(this.uldResp.data);
      console.log(JSON.stringify(this.uldResp.data));
    });
    // this.inventorySHCParam = this.createSourceParameter(flightKey);
    // this.inventoryTAGParam = this.createSourceParameter();
    this.awbWindow.open();
  }

  onLoad() {
    this.confirmLoadFlag = true;
    const buildupLoadShipment = new BuildupLoadShipment();
    const loadedShipmentList = [];
    const shc = new SHC();
    const shipmentHouse = new ShipmentHouse();
    // setting the Load level values into main model
    buildupLoadShipment.flightOriginDate = this.LoadShipmentForm.get('flightOriginDate').value;
    buildupLoadShipment.flightKey = this.LoadShipmentForm.get('flightKey').value;
    buildupLoadShipment.flightId = this.LoadShipmentForm.get('flightId').value;
    buildupLoadShipment.loadType = this.loadType;
    // getitng the Shipment yet to be loaded data Array
    const toBeload = (<NgcFormArray>this.LoadShipmentForm.get('toBeLoadedList')).getRawValue();
    // getitng the Array data for Shipment whichh is about to load
    const uldArray = (<NgcFormArray>this.LoadShipmentForm.get('uldShipmentArray')).getRawValue();

    // Loop for ULD level data
    for (let i = 0; i < uldArray.length; i++) {
      const shipment = new LoadUldShipment();
      const laodShipmentList = [];
      shipment.flightKey = this.LoadShipmentForm.get('flightKey').value;
      shipment.flightOriginDate = this.LoadShipmentForm.get('flightOriginDate').value;
      shipment.flightId = this.LoadShipmentForm.get('flightId').value;
      shipment.shipmentId = uldArray[i].shipmentId;
      shipment.shipmentNumber = uldArray[i].shipmentNumber;
      shipment.segmentId = uldArray[i].segmentId;
      shipment.segment = uldArray[i].segment;
      buildupLoadShipment.segmentId = uldArray[i].segmentId;
      const inveArray: Array<any> = <Array<any>>uldArray[i].uldInventory;
      // loop for shipment level data
      for (let j = 0; j < inveArray.length; j++) {
        const shcList = [];
        //const tagNumberList: Array<ShipmentHouse> = [];
        const loadedShipment = new LoadedShipment();
        loadedShipment.flightId = this.LoadShipmentForm.get('flightId').value;
        loadedShipment.shipmentId = uldArray[i].shipmentId;
        loadedShipment.shipmentNumber = uldArray[i].shipmentNumber;
        loadedShipment.segmentId = uldArray[i].segmentId;
        loadedShipment.natureOfGoodsDescription = inveArray[j].natureOfGoodsDescription
        loadedShipment.flightKey = this.LoadShipmentForm.get('flightKey').value;
        loadedShipment.flightOriginDate = this.LoadShipmentForm.get('flightOriginDate').value;
        loadedShipment.shipmentInventoryId = inveArray[j].shipmentInventoryId;
        loadedShipment.locationPiecs = inveArray[j].locationPiecs;
        loadedShipment.locationWeight = inveArray[j].locationWeight;
        loadedShipment.dryIceWeight = inveArray[j].dryIceWeight;
        loadedShipment.actualWeightWeighed = inveArray[j].actualWeightWeighed;
        loadedShipment.awbPieces = this.LoadShipmentForm.get(['uldShipmentArray', 0, 'pieces']).value;
        loadedShipment.awbWeight = this.LoadShipmentForm.get(['uldShipmentArray', 0, 'weight']).value;
        if (!inveArray[j].dryIceWeight) {
          loadedShipment.dryIceWeight = 0.0;
        }
        // Case for By AWB Loading
        if (this.loadType === 'AWB') {
          loadedShipment.assUldTrolleyNo = uldArray[i].assUldTrolleyNo;
          loadedShipment.assUldTrolleyId = +uldArray[i].assUldTrolleyId;
          loadedShipment.contentCode = uldArray[i].contentCode;
          loadedShipment.heightCode = uldArray[i].heightCode;
          loadedShipment.phcIndicator = uldArray[i].phcIndicator;
          // setting data into Uld level object
          shipment.assUldTrolleyNo = uldArray[i].assUldTrolleyNo;
          shipment.assUldTrolleyId = +uldArray[i].assUldTrolleyId;
          shipment.contentCode = uldArray[i].contentCode;
          shipment.heightCode = uldArray[i].heightCode;
          shipment.phcIndicator = uldArray[i].phcIndicator;
          // setting data into biludup object
          buildupLoadShipment.assUldTrolleyNo = uldArray[i].assUldTrolleyNo;
          buildupLoadShipment.assUldTrolleyId = +uldArray[i].assUldTrolleyId;
          buildupLoadShipment.contentCode = uldArray[i].contentCode;
          buildupLoadShipment.heightCode = uldArray[i].heightCode;
          buildupLoadShipment.phcIndicator = uldArray[i].phcIndicator;
          // set the value for PHC Indicator to 0 in case of it's null
          if (uldArray[i].phcIndicator == null || !uldArray[i].phcIndicator) {
            loadedShipment.phcIndicator = 0;
            shipment.phcIndicator = 0;
            buildupLoadShipment.phcIndicator = 0;
          } else {
            loadedShipment.phcIndicator = 1;
            shipment.phcIndicator = 1;
            buildupLoadShipment.phcIndicator = 1;
          }

        } else {
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
        }
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

        loadedShipment.shcList = inveArray[j].shcList;
        loadedShipment.tagNumberList = inveArray[j].tagNumberList;
        if (inveArray[j].trmNumber) {
          loadedShipment.trmNumber = inveArray[j].trmNumber;
        }
        laodShipmentList.push(loadedShipment);
      }
      shipment.loadShipmentList = laodShipmentList;
      if (this.popUpOpeningTime) {
        shipment.popUpOpeningTime = this.popUpOpeningTime;
      }
      loadedShipmentList.push(shipment);
    }

    buildupLoadShipment.loadedShipmentList = loadedShipmentList;
    buildupLoadShipment.flightType = this.flightType;
    buildupLoadShipment.carrierCode = this.carrierCode;
    buildupLoadShipment.flightBoardPoint = this.flightBoardPoint;
    buildupLoadShipment.flightOffPoint = this.flightOffPoint;
    buildupLoadShipment.aircraftType = this.aircraftType;
    buildupLoadShipment.fromLoadShipment = true;

    this.buildupService.insertLoadShipment(buildupLoadShipment).subscribe(resp => {
      this.loadResp = resp;
      if (this.loadResp.success) {
        this.confirmLoadFlag = false;
        this.showSuccessStatus('g.completed.successfully');
        //       this.uldWindow.close();
        //       this.awbWindow.close();
        //       this.onSearch();
        if (this.loadType === 'ULD') {
          this.onUldClick();
        } else {
          this.onAwbClick();
        }

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
      this.showErrorStatus(error);
    }
  }

  onSelect(event) {
    this.LoadShipmentForm.get('assUldTrolleyId').setValue(event.desc);

    this.LoadShipmentForm.get('phcIndicator').setValue(event.param3);
    if (event && !event.code && this.LoadShipmentForm.get('assUldTrolleyNo').value) {
      this.LoadShipmentForm.get('contentCode').setValue(this.CONTENET_CODE);
    } else {
      this.LoadShipmentForm.get('contentCode').setValue(event.param1);
    }
    if (event && !event.code && this.LoadShipmentForm.get('assUldTrolleyNo').value) {
      this.LoadShipmentForm.get('heightCode').setValue(this.HEIGHT_CODE);
    } else {
      this.LoadShipmentForm.get('heightCode').setValue(event.param2);
    }

    const PiggyBack = new DLSULD();
    PiggyBack.uldTrolleyNumber = this.LoadShipmentForm.get('assUldTrolleyNo').value;
    PiggyBack.flightKey = this.LoadShipmentForm.get("flightKey").value;
    PiggyBack.flightOriginDate = this.LoadShipmentForm.get("flightOriginDate").value;
    const formArray: NgcFormArray = this.LoadShipmentForm.get('toBeLoadedList') as NgcFormArray;
    let selectedSegment: string = null;
    formArray.controls.forEach((toBeLoadedGroup: NgcFormGroup) => {
      const selectFlag: NgcFormControl = toBeLoadedGroup.get('select') as NgcFormControl;
      const segment: NgcFormControl = toBeLoadedGroup.get('segment') as NgcFormControl;
      //
      if (selectFlag && selectFlag.value === true) {
        selectedSegment = segment.value;
      }
    });
    PiggyBack.flightOffPoint = selectedSegment;
    this._buildService.getPiggyBackFlag(PiggyBack).subscribe(res => {
      this.piggyResponse = res.data;
      if (this.piggyResponse && this.piggyResponse.flightMatchesWithICS == false) {
        this.showWarningStatus('FLIGHT NO/DATE/DESTINATION IS NOT MATCHING WITH ICS INFORMATION. DO YOU WANT TO CONTINUE ASSIGNING WITH THIS FLIGHT?');
      }
    });
  }

  onULDTrolleyNoSelect(event, index) {
    console.log(event);
    const trolleyGroup: NgcFormGroup = <NgcFormGroup>this.LoadShipmentForm.get(['uldShipmentArray', index]);
    // this.param = this.createSourceParameter(event.param1);
    if (event && !event.code && trolleyGroup.get('assUldTrolleyNo').value) {
      trolleyGroup.get('contentCode').setValue(this.CONTENET_CODE);
    } else {
      trolleyGroup.get('contentCode').setValue(event.param1);
    }
    if (event && !event.code && trolleyGroup.get('assUldTrolleyNo').value) {
      trolleyGroup.get('heightCode').setValue(this.HEIGHT_CODE);
    } else {
      trolleyGroup.get('heightCode').setValue(event.param2);
    }
    trolleyGroup.get('assUldTrolleyId').setValue(event.desc)
    trolleyGroup.get('phcIndicator').setValue(event.param3);
  }

  onBuildUpCompleted() {
    const event = new BuildUpCompleteEvent();
    event.flightId = this.LoadShipmentForm.get('flightId').value;
    event.flightKey = this.LoadShipmentForm.get('flightKey').value;
    event.flightOriginDate = this.LoadShipmentForm.get('flightOriginDate').value;
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

  updateWeight(event) {
    let temp = 0;
    this.totalPieces = 0;
    this.totalShipmentWeightAfterUpdate = 0.0;
    this.totalShipmentWeightBeforeUpdate = 0.0;
    this.LoadShipmentForm.get('updateLoadedWeightArray').patchValue([]);
    this.totalLoadedWeight = 0.0;
    const req: LoadedShipment = new LoadedShipment();
    req.shipmentId = event.record.shipmentId;
    req.flightId = this.LoadShipmentForm.get('flightId').value;
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
    });
    this.updateWeightWindow.open();
  }

  onUpdateWeightButton() {
    const loadedList = (<NgcFormArray>this.LoadShipmentForm.get(['updateLoadedWeightArray'])).getRawValue();
    loadedList.forEach(uld => {
      uld.flightId = this.LoadShipmentForm.get('flightId').value;
      uld.flightKey = this.LoadShipmentForm.get('flightKey').value;
      uld.flightOriginDate = this.LoadShipmentForm.get('flightOriginDate').value;
      // uld.segment = this.flightOffPoint;
      uld.uldCarrierCode2 = this.carrierCode;
      uld.uldType = this.flightType;
      uld.ackInfo = false;
    });

    this.buildupService.updateLoadedWeight(loadedList).subscribe(resp => {
      if (resp.success) {
        this.showSuccessStatus('g.completed.successfully');
        this.updateWeightWindow.close();
        this.onSearch();
      }
      else if (resp.data && resp.data[0].infoFlag && resp.data[0].messageList.length > 0) {
        this.showConfirmMessage(resp.data[0].messageList[0].code).then(fulfilled => {
          const loadedList = (<NgcFormArray>this.LoadShipmentForm.get(['updateLoadedWeightArray'])).getRawValue();
          loadedList.forEach(uld => {
            uld.flightId = this.LoadShipmentForm.get('flightId').value;
            uld.flightKey = this.LoadShipmentForm.get('flightKey').value;
            uld.flightOriginDate = this.LoadShipmentForm.get('flightOriginDate').value;
            uld.segment = this.flightOffPoint;
            uld.uldCarrierCode2 = this.carrierCode;
            uld.uldType = this.flightType;
            uld.ackInfo = true;
          });
          this.buildupService.updateLoadedWeight(loadedList).subscribe(resp => {
            this.showSuccessStatus('g.completed.successfully');
            this.updateWeightWindow.close();
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
    this.multipleShipmentSearch.flightKey = this.LoadShipmentForm.get('flightKey').value;
    this.multipleShipmentSearch.flightDate = this.LoadShipmentForm.get('flightOriginDate').value;
    this.navigate('export/bookmultipleshipment', this.multipleShipmentSearch);
  }

  onClickFlightPlanner() {
    this.navigateTo(this.router, '/export/planning-list', this.transferData);
  }

  onCancelUldWindow() {
    this.isUldWindowOpen = false;
    this.onSearch();
  }

  onUldWindowOpen() {
    this.isUldWindowOpen = true;
  }

  onAwbWindowOpen() {
    this.isAWBWindowOpen = true;
  }

  onAwbWindowClose() {
    this.isAWBWindowOpen = false;
    this.onSearch();
  }

  sendLoadingRequest(buildupLoadShipment: any) {
    this.buildupService.insertLoadShipment(buildupLoadShipment).subscribe(resp => {
      this.loadResp = resp;
      if (this.loadResp.success) {
        this.confirmLoadFlag = false;
        this.showSuccessStatus('g.completed.successfully');
        //       this.uldWindow.close();
        //       this.awbWindow.close();
        //       this.onSearch();
        if (this.loadType === 'ULD') {
          this.onUldClick();
        } else {
          this.onAwbClick();
        }

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
}
