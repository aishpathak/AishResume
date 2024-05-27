import { ApplicationEntities } from './../../../common/applicationentities';
import { ShipmentList } from './../../../import/import.shared';
import { BuildupService } from './../buildup.service';
import {
  UnloadShipment, Flight,
  UnloadShipmentSearch, UnloadShipmentRequest, Shipment
} from './../../export.sharedmodel';
// Angular imports
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
// Application imports
import { element } from 'protractor';
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcFormControl, NgcButtonComponent, NgcUtility, PageConfiguration
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { IfStmt } from '@angular/compiler';
import { ApplicationFeatures } from '../../../common/applicationfeatures';

@Component({
  selector: 'app-unload-shipment',
  templateUrl: './unload-shipment.component.html',
  styleUrls: ['./unload-shipment.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true

})
export class UnloadShipmentComponent extends NgcPage implements OnInit {
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  @ViewChild('reopenBuildup') reopenBuildup: NgcButtonComponent;
  private unloadShipmentForm: NgcFormGroup = null;
  private uldSourceParameter = {};
  private awbSourceParameter = {};
  shipmentInfoFlag: boolean;
  flightInfoFlag: any;
  flightId: any;
  transferData: any;
  unloadShipmentSearch: UnloadShipmentSearch = new UnloadShipmentSearch();
  isTTCase: boolean = false;
  isPopulateUld: boolean = false;
  validSuccessFlag: boolean = false;
  uldNumber: string;
  awbList: any;
  chgWgtFlag: boolean = false;
  reasonlabel: boolean = false;

  ngOnInit(): void {
    this.initialize();
    this.shipmentInfoFlag = false;
    this.flightInfoFlag = false;
    this.transferData = this.getNavigateData(this.activatedRoute);
    if (this.transferData) {
      this.unloadShipmentForm.patchValue(this.transferData);
      this.fetchFlightDetails();
    }
  }

  /**

* Initialize

*/
  public initialize() {
    this.unloadShipmentForm = new NgcFormGroup
      ({
        checked: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        flightOriginDate: new NgcFormControl(new Date()),
        flightName: new NgcFormControl(),
        originDate: new NgcFormControl(),
        std: new NgcFormControl(),
        etd: new NgcFormControl(),
        status: new NgcFormControl(),
        segment1: new NgcFormControl(),
        uldNumber: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        shipmentNumbers: new NgcFormControl(),
        reason: new NgcFormControl(),
        contractor: new NgcFormControl(),
        ttcase: new NgcFormControl(),
        unloadShipments: new NgcFormArray(
          [

          ]
        ),
      });
  }


  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private buildService: BuildupService, private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
    // this.functionId = "PLAYGROUND";
  }

  // @PageConfiguration({
  //   trackInit: true,
  //  callNgOnInitOnClear:  true
  //   })

  public fetchFlightDetails() {
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Exp_UnloadShipmentReasonFreeForm)
          || NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Exp_UnloadShipmentReasonLov)) {
      this.reasonlabel = true;
    }

    if (this.unloadShipmentForm.get('flightKey').value == null || this.unloadShipmentForm.get('flightOriginDate').value == null) {
      this.showErrorStatus("export.enter.flight.details");
      return;
    }
    const flight: Flight = new Flight();
    this.flightInfoFlag = false;
    this.shipmentInfoFlag = false;
    this.unloadShipmentForm.get('uldNumber').setValue(null);
    this.uldSourceParameter = this.createSourceParameter(null);
    flight.flightKey = this.unloadShipmentForm.get('flightKey').value;
    flight.flightOriginDate = this.unloadShipmentForm.get('flightOriginDate').value;
    this.unloadShipmentSearch.flight = flight;
    console.log('flifht deatils' + JSON.stringify(this.unloadShipmentSearch));
    this.buildService.fetchFlightDetails(flight).subscribe(data => {
      this.refreshFormMessages(data);
      if (!this.showResponseErrorMessages(data)) {
        const res = data.data;
        if (data.data) {
          if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
            this.chgWgtFlag = true;
          }
          else {
            this.chgWgtFlag = false;
          }
          this.flightInfoFlag = true;
          const flightdata = data.data;
          // this.searchButton.disabled = false;
          this.unloadShipmentForm.get('flightName').setValue(flightdata.flightKey);
          console.log(flightdata.flightOriginDate);
          this.unloadShipmentForm.get('std').setValue(flightdata.std);
          this.unloadShipmentForm.get('etd').setValue(flightdata.etd);
          this.unloadShipmentForm.get('status').setValue(flightdata.status);
          this.unloadShipmentForm.get('segment1').setValue(flightdata.segment1);
          // JV01-208 change
          this.unloadShipmentForm.get('reason').setValue(flightdata.reason);
          // JV01-208 change end
          const flightKey: string = this.unloadShipmentForm.get('flightKey').value;
          const flightOriginDate: Date = this.unloadShipmentForm.get('flightOriginDate').value;
          this.flightId = flightdata.flightId;
          this.uldSourceParameter = this.createSourceParameter(this.flightId);
          this.awbSourceParameter = this.createSourceParameter(null);
          // Transhipment Screen
          if (this.transferData && this.transferData.uldNumber) {
            this.unloadShipmentForm.get('uldNumber').setValue(this.transferData.uldNumber);
            this.onChange(this.transferData.uldNumber);
            if (this.transferData.shipmentNumberList && this.transferData.shipmentNumberList.length > 0) {
              this.unloadShipmentForm.get('shipmentNumbers').patchValue(this.transferData.shipmentNumberList);
            }
          }

        } else {
          this.flightInfoFlag = false;
          //  this.showErrorStatus('export.no.data.found!!');
        }
      } else {
        this.flightInfoFlag = false;
      }
    }, error => {
      this.flightInfoFlag = false;
      this.showErrorStatus('export.error.occured.try.again');
    });
  }
  //On select Of ULD Number fetch Shipment list
  public onChange(event) {
    this.shipmentInfoFlag = false;
    const uldNumber = event;
    this.uldNumber = uldNumber;
    this.awbSourceParameter = this.createSourceParameter(this.flightId, uldNumber);
    this.retrieveDropDownListRecords("UNLD_SHPMNT_AWB_DRPDWN", 'query', this.awbSourceParameter).subscribe(record => {
      this.awbList = record;
    });
  }
  public fetchShipmentDetails() {
    const flight: Flight = new Flight();
    this.shipmentInfoFlag = false;
    flight.flightId = this.flightId;
    const unloadShipment: UnloadShipmentSearch = new UnloadShipmentSearch();
    const shipmentNumberList: Array<Shipment> = new Array<Shipment>();
    unloadShipment.flight = flight;
    unloadShipment.uldNumber = this.unloadShipmentForm.get('uldNumber').value;
    // unloadShipment.shipmentNumbers = this.unloadShipmentForm.get('shipmentNumbers').value;
    const shipmentNumbers = this.unloadShipmentForm.get('shipmentNumbers').value;
    console.log(shipmentNumbers)
    if (shipmentNumbers && shipmentNumbers.length > 0) {
      for (let i = 0; i < shipmentNumbers.length; i++) {
        const shipment: Shipment = new Shipment();
        shipment.shipmentNumber = shipmentNumbers[i];
        shipmentNumberList.push(shipment);
      }
      unloadShipment.shipmentNumberList = shipmentNumberList;
    }
    unloadShipment.shipmentNumber = this.unloadShipmentForm.get('shipmentNumber').value;
    unloadShipment.reason = this.unloadShipmentForm.get('reason').value;
    this.buildService.fetchShipmentDetails(unloadShipment).subscribe(data => {
      this.refreshFormMessages(data);
      const res = data.data;
      console.log(data);
      if (res && res.length > 0) {
        this.shipmentInfoFlag = true;
        res.forEach((group: any) => {
          group.shpmtInventoryList = [];
          group.checked = false;
        });
        this.unloadShipmentForm.get('unloadShipments').patchValue(res);
        console.log(this.unloadShipmentForm);
      } else {
        this.shipmentInfoFlag = false;
        this.uldSourceParameter = this.createSourceParameter(this.flightId);
      }
    }, error => {
      this.shipmentInfoFlag = false;
      this.showErrorStatus('export.error.occured.try.again');
    });
  }

  onPieceChange(event, index, subIndex) {
    if (event) {
      let unloadShipment: UnloadShipment = new UnloadShipment();
      (<NgcFormArray>this.unloadShipmentForm
        .get(['unloadShipments', index, 'shpmtInventoryList', subIndex])).get('weight').setValue(null);

      let partWeight = (<NgcFormArray>this.unloadShipmentForm
        .get(['unloadShipments', index, 'shpmtInventoryList', subIndex])).get('partWeight').value;

      let partPiece = (<NgcFormArray>this.unloadShipmentForm
        .get(['unloadShipments', index, 'shpmtInventoryList', subIndex])).get('partPiece').value;

      unloadShipment = (<NgcFormArray>this.unloadShipmentForm.get(['unloadShipments',
        index])).value;
      unloadShipment.unloadPieces = event;
      unloadShipment.partWeight = partWeight;
      unloadShipment.partPiece = partPiece;
      unloadShipment.piecesChange = true;
      unloadShipment.fromUnloadScreen = true;
      this.buildService.unloadWeight(unloadShipment).subscribe(data => {
        //this.refreshFormMessages(data);
        const res = data.data;
        if (res) {
          (<NgcFormArray>this.unloadShipmentForm
            .get(['unloadShipments', index, 'shpmtInventoryList', subIndex])).get('weight').setValue(res.unloadWeight);
        }
      }, error => {
        this.showErrorStatus('export.error.occured.try.again');
      });
    } else {
      (<NgcFormArray>this.unloadShipmentForm
        .get(['unloadShipments', index, 'shpmtInventoryList', subIndex])).get('pieces').setValue(null);
      (<NgcFormArray>this.unloadShipmentForm
        .get(['unloadShipments', index, 'shpmtInventoryList', subIndex])).get('weight').setValue(null);
      return;
    }
  }

  onWeightChange(event, index, subIndex) {
    if (event) {
      let unloadShipment: UnloadShipment = new UnloadShipment();
      let partWeight = (<NgcFormArray>this.unloadShipmentForm
        .get(['unloadShipments', index, 'shpmtInventoryList', subIndex])).get('partWeight').value;

      let partPiece = (<NgcFormArray>this.unloadShipmentForm
        .get(['unloadShipments', index, 'shpmtInventoryList', subIndex])).get('partPiece').value;

      let unloadPcs = (<NgcFormArray>this.unloadShipmentForm
        .get(['unloadShipments', index, 'shpmtInventoryList', subIndex])).get('pieces').value;

      unloadShipment = (<NgcFormArray>this.unloadShipmentForm.get(['unloadShipments',
        index])).value;
      unloadShipment.unloadWeight = event;
      unloadShipment.unloadPieces = unloadPcs;
      unloadShipment.partWeight = partWeight;
      unloadShipment.partPiece = partPiece;
      unloadShipment.weightChange = true;
      unloadShipment.fromUnloadScreen = true;
      this.buildService.unloadWeight(unloadShipment).subscribe(data => {
        const res = data.data;
        if (res) {
          if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
            (<NgcFormArray>this.unloadShipmentForm
              .get(['unloadShipments', index, 'shpmtInventoryList', subIndex])).get('chargeableWeight').setValue(res.unloadChargeableWeight);
          }
        }
      }, error => {
        this.showErrorStatus('export.error.occured.try.again');
      });
    }
  }

  public createNewRow(event, index) {
    let shipmentLocation = '';
    // this.shcs = this.createSourceParameter((<NgcFormArray>this.unloadShipmentForm.
    //   get(['unloadShipments', index])).get(loadedShipmentInfoId).value);
    this.isTTCase = this.unloadShipmentForm.get(['unloadShipments', index]).get('ttcase').value;
    const dipSvcSTATS_ = this.unloadShipmentForm.get(['unloadShipments', index]).get('dipSvcSTATS').value;

    const uldNumber = this.unloadShipmentForm.get('uldNumber').value;
    if (this.isPopulateUld) {
      if (uldNumber == 'BULK') {
        shipmentLocation = '';
      }
      else {
        shipmentLocation = this.uldNumber;
      }
    }
    let warehouseLocation = '';
    if (this.isTTCase && uldNumber !== 'BULK') {
      shipmentLocation = uldNumber;
      // (<NgcFormArray>this.unloadShipmentForm.get(['unloadShipments', index])).get('isTTCase').setValue(true);
    } else if (this.isTTCase && uldNumber === 'BULK') {
      // (<NgcFormArray>this.unloadShipmentForm.get(['unloadShipments', index])).get('isTTCase').setValue(true);
      warehouseLocation = 'TTL5'
    }

    (<NgcFormArray>this.unloadShipmentForm.get(['unloadShipments', index, 'shpmtInventoryList'])).addValue([{
      pieces: null,
      weight: null,
      chargeableWeight: null,
      shipmentLocation: shipmentLocation,
      warehouseLocation: warehouseLocation,
      shcCodes: null,
      houseNumbers: null,
      shcCodeList: (<NgcFormArray>this.unloadShipmentForm.get(['unloadShipments', index]))
        .get('shcCodes').value,
      houseList: (<NgcFormArray>this.unloadShipmentForm.get(['unloadShipments', index]))
        .get('houseNumbers').value,
      dipSvcSTATS: dipSvcSTATS_,
      partSuffix: null,
      partPiece: null,
      partWeight: null
    }
    ]);

  }
  addNewRow(index) {
    this.createNewRow(index, 0);
  }
  public deleteRow(index, subIndex) {
    (<NgcFormArray>this.unloadShipmentForm.get(['unloadShipments', index, 'shpmtInventoryList'])).deleteValueAt(subIndex);

  }

  public confirmUnload(event) {
    if (this.unloadShipmentForm.invalid) {
      return;
    }

    this.validSuccessFlag = true;
    let totalPieces = 0;
    let totalWeight = 0.0;
    const unloadList = (<NgcFormArray>this.unloadShipmentForm.controls['unloadShipments']).getRawValue();
    const unloadShipmentRequest: UnloadShipmentRequest = new UnloadShipmentRequest();
    const unloadSelectedList = unloadList.filter(function (obj) {
      return ((obj.checked === true) && (obj.shpmtInventoryList && obj.shpmtInventoryList.length > 0));
    });
    console.log(this.unloadShipmentForm.getRawValue());
    if (unloadSelectedList && unloadSelectedList.length > 0) {
      //Changes for JV01 - 208 
      unloadShipmentRequest.reason = this.unloadShipmentForm.get('reason').value;
      //Changes end here for JV01 - 208 
      unloadSelectedList.forEach((item: any) => {
        item.shpmtInventoryList.forEach(element => {
          item.reason = this.unloadShipmentForm.get('reason').value;
          item.unloadedBy = this.unloadShipmentForm.get('contractor').value;
          item.checked = false;
          totalPieces += element.pieces;
          totalWeight += element.weight;
          if (element.pieces <= 0 || element.weight <= 0.0) {
            this.validSuccessFlag = false;
            this.showErrorStatus('export.pieces.weight.cannot.less.than.0');
          }
        });
        //for audit trial
        item.flight.flightKey = this.unloadShipmentForm.get('flightKey').value;
        item.flight.flightOriginDate = this.unloadShipmentForm.get('flightOriginDate').value;
      });
      unloadShipmentRequest.unloadShipments = unloadSelectedList;
      // if (this.isTTCase) {
      //   unloadShipmentRequest.isTTCase = true;
      // } else {
      //   unloadShipmentRequest.isTTCase = false;
      // }

      console.log('json data before unload' + JSON.stringify(unloadShipmentRequest))
      if (this.validSuccessFlag == true) {
        this.buildService.unloadShipments(unloadShipmentRequest).subscribe(data => {
          this.showResponseErrorMessages(data);
          const res = data.data;
          if (res && res.flagUpdate === 'Y') {
            this.awbSourceParameter = this.createSourceParameter(this.flightId,
              this.unloadShipmentForm.get('uldNumber').value);
            this.fetchShipmentDetails();
            this.showSuccessStatus('export.unloaded.sucessfully');

          }
        }, error => {
          this.showErrorStatus('export.error.occured.try.again');
        });
      }
    }
  }

  public loadshipment() {
    this.navigateTo(this.router, 'export/buildup/revisedloadshipment', 'yes');
  }

  public onBack(event) {
    this.navigateBack(this.transferData);
  }
  onClickFlightPlanner() {
    this.navigateTo(this.router, '/export/planning-list', this.transferData);
  }

  // onSelectULD(event) {

  //   if (event.param1 === 'Y') {
  //     this.isTTCase = true;
  //   } else {
  //     this.isTTCase = false;
  //   }


  // }

  onSelectAWB(event) {
    this.isPopulateUld = false;
    let awbList = [];

    // if (event[0].desc === 'All') {
    //   if (event[1].param1 === 'Y') {
    //     this.isTTCase = true;
    //   } else {
    //     this.isTTCase = false;
    //   }
    // } else if (event[0].param1 === 'Y') {
    //   if (event[0].param1 === 'Y') {
    //     this.isTTCase = true;
    //   } else {
    //     this.isTTCase = false;
    //   }
    // }


    if (event.length == this.awbList.length) {
      this.isPopulateUld = true;
    }
  }

  clearErrMsgWhenEnteredWarehouseLoction(event, index, subIndex) {
    if (event) {
      // if ((<NgcFormArray>this.unloadShipmentForm.get(['unloadShipments', index, 'shpmtInventoryList', subIndex])).get('warehouseLocation').value !== null) {
      (<NgcFormArray>this.unloadShipmentForm
        .get(['unloadShipments', index, 'shpmtInventoryList', subIndex])).get('shipmentLocation').setErrors(null);
      // }

    }
  }

}

