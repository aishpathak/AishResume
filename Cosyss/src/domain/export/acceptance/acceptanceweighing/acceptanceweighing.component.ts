import { Component, OnInit, NgZone, ViewContainerRef, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NgcPage, ReactiveModel, NgcFormGroup, PageConfiguration, NgcFormControl, NgcFormArray, NgcUtility, NgcWindowComponent, NgcReportComponent, NgcLOVComponent } from 'ngc-framework';
import { AceptanceWeighingModel, AcceptanceWeighingSearchRequest, WeighingScaleRequest, SaveAcceptanceWeighing, WeighingScaleWeighingRequest, ReplaceDummyAWBModel, ShipmentExecModel, AcceptanceWeighingListModel, LocationListModel } from '../../export.sharedmodel';
import { Router, ActivatedRoute } from '@angular/router';
import { ExportService } from '../../export.service';
import { CargoProcessingEngineService } from '../../../warehouse/cargoprocessingengine/cargoprocessingengine.service';
import { ViewChild } from "@angular/core";
import { Validators } from '@angular/forms';
import { interval, Subscription } from "rxjs";


@Component({
  selector: 'app-acceptanceweighing',
  templateUrl: './acceptanceweighing.component.html',
  styleUrls: ['./acceptanceweighing.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  restorePageOnBack: true
})
export class AcceptanceweighingComponent extends NgcPage {
  /* 
  * Reactive Form
  */
  @ReactiveModel(AceptanceWeighingModel)
  public acceptanceWeighingForm: NgcFormGroup;

  @ReactiveModel(SaveAcceptanceWeighing)
  public saveAcceptanceWeighing: NgcFormGroup;

  @ReactiveModel(ReplaceDummyAWBModel)
  public replaceDummyAWBGroup: NgcFormGroup;

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  @ViewChild('houseSummaryWindow') houseSummaryWindow: NgcWindowComponent;
  @ViewChild('reportWindowHwbWeightSlip') reportWindowHwbWeightSlip: NgcReportComponent;
  @ViewChild('reportWindowHwbTotalWeightSlip') reportWindowHwbTotalWeightSlip: NgcReportComponent;
  @ViewChild('replaceDummyAWBWindow') replaceDummyAWBWindow: NgcWindowComponent;
  resp: any;
  shclist: any;
  hawbShclist: any;
  shcListForAdd: any;
  releasetable: any;
  displayFlag = true;
  cargoIndicator: any;
  reportParameters: any;
  remarksIndicator: any;
  weighingScaleData: any;
  hawbListIndicator: any;
  dimensionIndicator: any;
  totalDimensionPieces: number;
  totalDimensionWeight: number;
  shipmentlocationerrorflag: boolean;
  houseLovParameter: any;
  actionlistindicator: string;
  transferData: any;
  userAccessType: Boolean = false;
  houseNumber: string;
  showSendArrivalReportButtonHOuse: boolean = false;
  hawbListSendArrival: boolean = false;
  IsinputgrossWeight: boolean = true;
  titleValue: string = 'Domestic Acceptance Weighing';
  searchEnableFlag: boolean = true;
  tenantCountryCode = NgcUtility.getTenantConfiguration().countryCode;
  weighingscalename: String;
  wighingScaleAvailable: boolean = true;
  flightOffPointDropdownSourceParam : any;

  //FinalizeSendArrivalFlag: boolean;
  ngOnInit() {
    super.ngOnInit();

    this.transferData = this.getNavigateData(this.activatedRoute);
    if (this.transferData != null && this.transferData !== undefined) {

      this.acceptanceWeighingForm.get('shipmentNumber').setValue(
        (this.transferData['shipmentNumber'] == null) ? '' : this.transferData['shipmentNumber']
      );
      this.acceptanceWeighingForm.get('hawbNumber').setValue(
        (this.transferData['hawbNumber'] == '') ? '' : this.transferData['hawbNumber']
      );
      this.acceptanceWeighingForm.get('acceptanceType').setValue((this.transferData['acceptanceType'] == null) ? 'INT' : this.transferData['acceptanceType']);
      if (this.acceptanceWeighingForm.get('acceptanceType').value == "INT") {
        this.titleValue = 'International Acceptance Weighing';
        this.searchEnableFlag = false;
      } else {
        this.searchEnableFlag = true;
      }
      this.onSearch();

    }

  }

  constructor(private router: Router, appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private exportService: ExportService, private _cargoEngineProcessService: CargoProcessingEngineService,
    private changeDetectorRef: ChangeDetectorRef, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();

  }
  onSearch() {
    this.cargoIndicator = null;
    this.remarksIndicator = null;
    this.hawbListIndicator = null;
    this.dimensionIndicator = null;
    this.acceptanceWeighingForm.validate();
    if (this.acceptanceWeighingForm.invalid) {
      return;
    }
    let constRequest = this.acceptanceWeighingForm.getRawValue();
    this.exportService.getAWBNumber(constRequest).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.displayFlag = true;
        (<NgcFormArray>this.saveAcceptanceWeighing.get("shc")).resetValue([]);
        (<NgcFormArray>this.saveAcceptanceWeighing.get("hawbList")).resetValue([]);
        (<NgcFormArray>this.saveAcceptanceWeighing.get("remarksList")).resetValue([]);
        (<NgcFormArray>this.saveAcceptanceWeighing.get("dimensionList")).resetValue([]);
        (<NgcFormArray>this.saveAcceptanceWeighing.get("weighingList")).resetValue([]);
        this.refreshFormMessages(response);
        if (response.data != null) {
          if (response.data.acknowledgeIndicatorCPE) {
            this.actionlistindicator = "error";
          } else {
            this.actionlistindicator = "";
          }
          this.displayFlag = false;
          //if(this.saveAcceptanceWeighing.get("hawbShc").value != null) {
          this.shclist = response.data.awbShc;
          this.hawbShclist = response.data.hawbShc;
          this.houseNumber = response.data.hawbNumber;
          this.saveAcceptanceWeighing.patchValue(response.data);
          if (this.houseNumber == null) {
            this.showSendArrivalReportButtonHOuse = true;
            this.flightOffPointDropdownSourceParam = this.createSourceParameter(this.saveAcceptanceWeighing.get('firstBookedFlight').value,NgcUtility.getDateTimeAsStringByFormat(this.saveAcceptanceWeighing.get('firstBookedFlightDate').value,'YYYY-MM-DD')); //Updting Flight Off Point DropDown
          } else {
            this.showSendArrivalReportButtonHOuse = false;
          }
          if (this.saveAcceptanceWeighing.get('hawbNumber').value) {
            var every = this.saveAcceptanceWeighing.getRawValue().hawbList.every(function (obj) {
              return obj.hwbAckReceived == 'Y'
            })
            this.showSendArrivalReportButtonHOuse = every;
          }
          this.getTotalAmount(response.data.dimensionList);
          // }
          //for loop for location Shc Null when length is 0
          if (response.data.weighingList && response.data.weighingList.length > 0) {
            for (const eachRow of response.data.weighingList) {
              if (eachRow.locationList && eachRow.locationList.length > 0) {
                for (const eachRowData of eachRow.locationList) {
                  if (eachRowData.locShc && eachRowData.locShc.length < 1) {
                    eachRowData.locShc = null;
                    (<NgcFormControl>this.saveAcceptanceWeighing.get(['weighingList', 0, 'locationList', 0, 'locShc'])).setValue([]);
                  } else {
                    this.shclist = eachRowData.locShc;
                  }
                }
              }
            }
            (<NgcFormArray>this.saveAcceptanceWeighing.get("weighingList")).patchValue(response.data.weighingList);
          } else {
            if (this.saveAcceptanceWeighing.get("hawbNumber").value != null || this.saveAcceptanceWeighing.get("hawbNumber").value != '') {
              this.shclist = [];
              (<NgcFormArray>this.saveAcceptanceWeighing.get("weighingList")).patchValue([]);
            }
          }
          // Make Form Controls Non Mandatory/Mandatory
          if (!this.saveAcceptanceWeighing.get('hawbNumber').value) {
            this.saveAcceptanceWeighing.controls.hawbPieces.setValidators([]);
            this.saveAcceptanceWeighing.controls.hawbDestination.setValidators([]);
            this.saveAcceptanceWeighing.controls.hawbNatureOfGoodsDescription.setValidators([]);
            if (this.saveAcceptanceWeighing.get('showReturnSection').value || this.saveAcceptanceWeighing.get('returnRequested').value) {
              this.saveAcceptanceWeighing.get('returnRemarks').setValidators(Validators.required);
            }
            this.onChangeManualBookingInfo(this.saveAcceptanceWeighing.get('manualBookingInfo').value);//In order to set the validators
          } else {
            this.saveAcceptanceWeighing.controls.hawbPieces.setValidators([Validators.required]);
            this.saveAcceptanceWeighing.controls.hawbDestination.setValidators([Validators.required]);
            this.saveAcceptanceWeighing.controls.hawbNatureOfGoodsDescription.setValidators([Validators.required]);
          }
          if (!response.data.weighingList || (response.data.weighingList && response.data.weighingList.length < 1)) {
            this.onAddRow();
          }
        }
      }
    });
  }
  public getTotalAmount(arr) {

  }
  onAddRow() {
    if (this.saveAcceptanceWeighing.get("hawbNumber").value != null && this.saveAcceptanceWeighing.get("hawbNumber").value != '') {
      this.shcListForAdd = this.hawbShclist;
    } else {
      this.shcListForAdd = this.shclist;

    }


    (<NgcFormArray>this.saveAcceptanceWeighing.get('weighingList')).addValue([
      {
        sno: null,
        user: null,
        pieces: null,
        dateTime: null,
        netWeight: '0.0',
        uldNumber: null,
        tareWeight: '0.0',
        grossWeight: null,
        skidHeight: null,
        dryIceWeight: '0.0',
        skidTareWeight: '0.0',
        noOfSkids: '0',
        volumetricWeight: '0',
        dolleyTareWeight: '0.0',
        weighingScaleId: null,
        manualWeightEntry: false,

        locationList: [
          {
            weight: '0.0',
            pieces: null,
            dryIceWeight: '0.0',
            shipmentLocation: null,
            wareHouseLocation: null,
            locShc: (this.shcListForAdd && this.shcListForAdd.length > 0) ? this.shcListForAdd : null,
          }
        ]
      }
    ]);
    this.shcListForAdd = null;
    this.changeDetectorRef.detectChanges();
  }

  onManualWeightEntry(index, event) {

    let size: number = (<NgcFormArray>this.saveAcceptanceWeighing.get(['weighingList', index, 'locationList'])).getSize();
    let manual: boolean = (<NgcFormArray>this.saveAcceptanceWeighing.get(['weighingList', index, 'manualWeightEntry'])).value;

    if (!manual) {
      for (let i = 0; i < size; i++) {

        (<NgcFormControl>this.saveAcceptanceWeighing.get(['weighingList', index, 'locationList', i, 'weight'])).setValue("0.0");

      }
    }

  }

  onDeleteRow(index) {
    (<NgcFormArray>this.saveAcceptanceWeighing.get(['weighingList'])).markAsDeletedAt(index);
  }

  onDeleteLocation(index, subIndex) {
    (<NgcFormArray>this.saveAcceptanceWeighing.get(['weighingList', index, 'locationList'])).markAsDeletedAt(subIndex);
  }

  onAddLocation(index: any) {
    if (this.saveAcceptanceWeighing.get("hawbNumber").value != null && this.saveAcceptanceWeighing.get("hawbNumber").value != '') {
      this.shcListForAdd = this.hawbShclist;
    } else {
      this.shcListForAdd = this.shclist;

    }
    (<NgcFormArray>this.saveAcceptanceWeighing.get(['weighingList', index, 'locationList'])).addValue([
      {
        pieces: '0',
        weight: '0.0',
        actualWeight: '0.0',
        dryIceWeight: '0.0',
        shipmentLocation: null,
        wareHouseLocation: null,
        locShc: (this.shcListForAdd && this.shcListForAdd.length > 0) ? this.shcListForAdd : null,
      }
    ]);
    this.shcListForAdd = null;
  }


  onSave() {
    this.saveAcceptanceWeighing.validate();

    if (this.saveAcceptanceWeighing.invalid) {
      if (this.saveAcceptanceWeighing.get('weighingList').invalid) {
        this.cargoIndicator = "error";
      } else {
        this.cargoIndicator = null;
      }
      if (this.saveAcceptanceWeighing.get('remarksList').invalid) {
        this.remarksIndicator = "error";
      } else {
        this.remarksIndicator = null;
      }
      if (this.saveAcceptanceWeighing.get('dimensionList').invalid) {
        this.dimensionIndicator = "error";
      } else {
        this.dimensionIndicator = null;
      }
      if (this.saveAcceptanceWeighing.get('hawbList').invalid) {
        this.hawbListIndicator = "error";
      } else {
        this.hawbListIndicator = null;
      }
      return;
    }
    if (this.saveAcceptanceWeighing.get('remarksList').invalid) {
      this.remarksIndicator = "error";
    } else {
      this.remarksIndicator = null;
    }
    const cargoDetails = this.saveAcceptanceWeighing.getRawValue();
    this.exportService.onSaveAcceptanceWeighing(cargoDetails).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.refreshFormMessages(response);
        if (response.data != null) {
          this.showSuccessStatus("uld.operation.completed.successfully");
          //for loop for location Shc Null when length is 0
          if (response.data.weighingList && response.data.weighingList.length > 0) {
            for (const eachRow of response.data.weighingList) {
              if (eachRow.locationList && eachRow.locationList.length > 0) {
                for (const eachRowData of eachRow.locationList) {
                  if (eachRowData.locShc && eachRowData.locShc.length < 1) {
                    eachRowData.locShc = null;
                  }
                }
              }
            }
          }
          this.saveAcceptanceWeighing.patchValue(response.data);
          // this.onSearch();
          // Make Form Controls Non Mandatory
          if (!this.saveAcceptanceWeighing.get('hawbNumber').value) {
            this.saveAcceptanceWeighing.controls.hawbPieces.setValidators([]);
            this.saveAcceptanceWeighing.controls.hawbDestination.setValidators([]);
            this.saveAcceptanceWeighing.controls.hawbNatureOfGoodsDescription.setValidators([]);
          } else {
            this.saveAcceptanceWeighing.controls.hawbPieces.setValidators([Validators.required]);
            this.saveAcceptanceWeighing.controls.hawbDestination.setValidators([Validators.required]);
            this.saveAcceptanceWeighing.controls.hawbNatureOfGoodsDescription.setValidators([Validators.required]);
          }
          // Add a new row when no record in weighingList
          if (!response.data.weighingList || (response.data.weighingList && response.data.weighingList.length < 1)) {
            this.onAddRow();
          }
          this.houseLovParameter = { 'parameter1': response.data.shipmentNumber, r: Math.random() };
        }
      }
    }, error => {
      this.showErrorMessage('error' + error)
    });
  }

  onChangeGrossPieces(grossweight, index, item) {
  }
  onChangeGrossWeight(grossweight, index, item) {
    let noOfSkids = 1;
    if (parseInt(item.value.noOfSkids) > 0) {
      noOfSkids = item.value.noOfSkids;
    }
    if (grossweight != undefined && grossweight > 0) {
      if (item.value.uldNumber != null && item.value.uldNumber != "") {
        this.saveAcceptanceWeighing.get(['weighingList', index, 'netWeight']).patchValue(parseFloat(grossweight) - ((parseFloat(item.value.tareWeight) * noOfSkids) + parseFloat(item.value.dolleyTareWeight) + parseFloat(item.value.skidTareWeight)));
      } else {
        this.saveAcceptanceWeighing.get(['weighingList', index, 'netWeight']).patchValue(parseFloat(grossweight) - ((parseFloat(item.value.tareWeight) * noOfSkids) + parseFloat(item.value.skidTareWeight)));
      }
    } else {
      this.saveAcceptanceWeighing.get(['weighingList', index, 'netWeight']).setValue(0.0);
    }
  }

  onGetWeight(event, index) {
    let request: WeighingScaleRequest = new WeighingScaleRequest();
    if (this.saveAcceptanceWeighing.get('weighingScaleId').value == null) {
      this.showErrorMessage("please select the weighing scale before clicking getweight");
      return;
    }
    if (this.weighingScaleData != undefined && this.weighingScaleData != null) {
      if (this.saveAcceptanceWeighing.get('weighingScaleId').value != null) {
        this.saveAcceptanceWeighing.get(['weighingList', index, 'weighingScaleId']).setValue(this.saveAcceptanceWeighing.get('weighingScaleId').value);
      }
      const tempDetails = this.weighingScaleData.split(':');
      request.wscaleIP = tempDetails[0];
      request.wscalePort = tempDetails[1];
      this.exportService.getWeightInformation(request).subscribe(response => {
        this.refreshFormMessages(response);
        if (response !== null) {
          // console.log(response);
          this.saveAcceptanceWeighing.get(['weighingList', index, 'grossWeight']).setValue(response);
        } else {
          this.saveAcceptanceWeighing.get(['weighingList', index, 'grossWeight']).patchValue(0.0);
        }
      })
    }
  }

  /*onGetWeight(event, index) {
    // if (this.saveAcceptanceWeighing.get('weighingScaleId').value == null) {
    //   this.showErrorMessage("please select the weighing scale before clicking getweight");
    //   return;
    // }
    // if (this.weighingScaleData != undefined && this.weighingScaleData != null) {
    // if (this.saveAcceptanceWeighing.get('weighingScaleId').value != null) {
    //   this.saveAcceptanceWeighing.get(['weighingList', index, 'weighingScaleId']).setValue(this.saveAcceptanceWeighing.get('weighingScaleId').value);
    // }
    // const tempDetails = this.weighingScaleData.split(':');
    let searchRes = {
      flagCRUD: 'R'
    }
    this.exportService.getWeightInformationNew(searchRes).subscribe(response => {

      if (response.success == false) {
        this.showErrorMessage(response.data.messageList[0].code);
        this.saveAcceptanceWeighing.get(['weighingList', index, 'grossWeight']).setValue(0.0);
      } else {

        this.saveAcceptanceWeighing.get(['weighingList', index, 'grossWeight']).setValue(response.data.weight);
      }
    })
    //}
  }*/

  onSelectScale(event) {
    this.wighingScaleAvailable = false;

    this.weighingScaleData = event.parameter1;
    if (event.desc != null || event.desc != undefined) {
      this.weighingscalename = event.desc;
    }

    if (event.parameter2 == '1') {
      this.wighingScaleAvailable = true;
    }

  }




  onChangeDolley(event, index) {
    let gross = parseFloat(this.saveAcceptanceWeighing.get(['weighingList', index, 'grossWeight']).value);
    let uld = this.saveAcceptanceWeighing.get(['weighingList', index, 'uldNumber']).value;
    let tare = parseFloat(this.saveAcceptanceWeighing.get(['weighingList', index, 'tareWeight']).value);
    let dolley = parseFloat(this.saveAcceptanceWeighing.get(['weighingList', index, 'dolleyTareWeight']).value);
    let skidTare = parseFloat(this.saveAcceptanceWeighing.get(['weighingList', index, 'skidTareWeight']).value);
    let skidNumber = this.saveAcceptanceWeighing.get(['weighingList', index, 'noOfSkids']).value;
    let noOfSkids = 1;
    if (parseInt(skidNumber) > 0) {
      noOfSkids = skidNumber;
    }
    if (uld != null && uld != "") {
      if (tare != undefined && tare >= 0 && skidTare != undefined && skidTare >= 0 && dolley != undefined && dolley >= 0) {
        this.saveAcceptanceWeighing.get(['weighingList', index, 'netWeight']).patchValue(gross - (dolley + (tare * noOfSkids) + skidTare));
      } else if (tare != undefined && tare >= 0 && dolley != undefined && dolley >= 0) {
        this.saveAcceptanceWeighing.get(['weighingList', index, 'netWeight']).patchValue(gross - (dolley + (tare * noOfSkids)));
      } else if (skidTare != undefined && skidTare >= 0 && dolley != undefined && dolley >= 0) {
        this.saveAcceptanceWeighing.get(['weighingList', index, 'netWeight']).patchValue(gross - (dolley + skidTare));
      }
    } else {
      if (tare != undefined && tare >= 0 && skidTare != undefined && skidTare >= 0) {
        this.saveAcceptanceWeighing.get(['weighingList', index, 'netWeight']).patchValue(gross - ((tare * noOfSkids) + skidTare));
      } else if (tare != undefined && tare >= 0) {
        this.saveAcceptanceWeighing.get(['weighingList', index, 'netWeight']).patchValue(gross - (tare * noOfSkids));
      } else if (skidTare != undefined && skidTare >= 0) {
        this.saveAcceptanceWeighing.get(['weighingList', index, 'netWeight']).patchValue(gross - skidTare);
      }
    }
  }

  onChangeShipmentLocation(index, sindex) {
    this.shipmentlocationerrorflag = false;
  }

  onAddRemark() {
    (<NgcFormArray>this.saveAcceptanceWeighing.get('remarksList')).addValue([
      {
        remarkType: null,
        deleteRemark: null,
        remarkDetails: null,
      }
    ]);
  }

  onCalculation() {
    let request = this.saveAcceptanceWeighing.getRawValue();
    this.exportService.onCalculation(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        let resp = data.data;
        this.saveAcceptanceWeighing.patchValue(resp);
      }
    })
  }

  onGetProportionateWeight(index, sindex, $event) {
    let weighing: AcceptanceWeighingListModel = (<NgcFormGroup>this.saveAcceptanceWeighing.get(["weighingList", index])).getRawValue();
    if (weighing.manualWeightEntry) {
      let weighingPieces = weighing.pieces;
      let weighingNetWeight = weighing.netWeight;
      let remainingWeight = weighing.netWeight;
      let remainingPieces = weighing.pieces;
      let locationPieces = 0;
      let locationWeight = 0;
      let totalLocationPieces = 0;
      let totalLocationWeight = 0;
      if (weighingNetWeight > 0 && weighingPieces > 0) {
        if (weighing.locationList && weighing.locationList.length > 0) {
          for (const locationRow of weighing.locationList) {
            if (locationRow.weight > 0 && locationRow.pieces > 0) {
              remainingWeight = remainingWeight - locationRow.weight;
              remainingPieces = remainingPieces - locationRow.pieces;
            }
          }
        }
        else {
          return;
        }
        let location: LocationListModel = (<NgcFormGroup>this.saveAcceptanceWeighing.get(["weighingList", index, "locationList", sindex])).getRawValue();
        if (location.pieces > 0 && location.weight == 0 && sindex == (weighing.locationList.length - 1)) {
          (<NgcFormControl>this.saveAcceptanceWeighing.get(["weighingList", index, "locationList", sindex, "weight"])).setValue(Number(NgcUtility.getDisplayWeight(remainingWeight)))

        }
        else if (location.pieces > 0 && location.weight == 0) {
          locationWeight = (remainingWeight / remainingPieces) * location.pieces;
          (<NgcFormControl>this.saveAcceptanceWeighing.get(["weighingList", index, "locationList", sindex, "weight"])).setValue(Number(NgcUtility.getDisplayWeight(locationWeight)))
        }

      }
    }
  }


  onDetailsAddRow() {
    let lineItem = (<NgcFormGroup>this.saveAcceptanceWeighing.get(['dimensionList'])).getRawValue();
    let totaldimpieces = 0;
    for (const entry of lineItem) {
      totaldimpieces += entry.pcs;
    }
    if (this.saveAcceptanceWeighing.get('pieces').value <= totaldimpieces) {
      return;
    }
    (<NgcFormArray>this.saveAcceptanceWeighing.get('dimensionList')).addValue([
      {
        length: 0,
        width: 0,
        height: 0,
        volume: '0',
        pieces: null,
        reason: 0,
        volumeCode: null,
        weightCode: null,
        volumetricWeight: 0,
        manualScanReason: 'SYSTEM',
        measurementUnitCode: null,
        voulmetricEnableFlag: null,
        dimensionCapturedManually: true,
        multiplier: 0,
        totalPieces: 0,
        totalVolumetricWeight: 0
      }
    ]);
    let index = this.saveAcceptanceWeighing.get(['dimensionList']).value.length;
    this.saveAcceptanceWeighing.get(['dimensionList', index - 1, 'dimensionCapturedManually']).patchValue(
      true
    );
  }

  onDeleteDimension(index, item) {
    if (item.value.flagCRUD == 'D') return;
    let idx = this.saveAcceptanceWeighing.get(['dimensionList']).value.length;
    (<NgcFormArray>this.saveAcceptanceWeighing.get(['dimensionList'])).markAsDeletedAt(index);

    // this.getTotalAmount(this.saveAcceptanceWeighing.get(['dimensionList']).value);
  }
  ChangePieces(event) {
    this.getTotalAmount(this.saveAcceptanceWeighing.get(['dimensionList']).value);
  }
  onDelete(event, index) {
    (<NgcFormArray>this.saveAcceptanceWeighing.get(['remarksList'])).markAsDeletedAt(index);
  }

  onClickMaterial() {
    let navigateObj = {
      houseNumber: this.saveAcceptanceWeighing.get('hawbNumber').value,
      shipmentDate: this.saveAcceptanceWeighing.get('shipmentDate').value,
      shipmentType: this.saveAcceptanceWeighing.get('shipmentType').value,
      shipmentNumber: this.saveAcceptanceWeighing.get('shipmentNumber').value,
    }
    this.navigateTo(this.router, "export/acceptance/cargomaterial", navigateObj);
  }

  onClickHWBSummary() {
    let cargo = this.saveAcceptanceWeighing.getRawValue();
    cargo['houseSummaryList'] = null;
    this.exportService.getHouseSummary(cargo).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.messageList) {
          this.showFormErrorMessages(data);
        } else {
          if (data.data && data.data.length) {
            for (let house in data.data) {
              data.data[house]['select'] = false;
            }
            this.saveAcceptanceWeighing.get('houseSummaryList').patchValue(data.data);
            console.log(this.saveAcceptanceWeighing);
            this.houseSummaryWindow.open();
          }
        }
      }
    });
  }

  onDgDetailNavigate() {
    let shipmentObj: any = new Object();
    shipmentObj.shipmentType = this.saveAcceptanceWeighing.get('shipmentType').value;
    shipmentObj.shipmentNumber = this.saveAcceptanceWeighing.get('shipmentNumber').value;
    this.navigateTo(this.router, 'export/dangerousgoods/dgdradioactive', shipmentObj);
  }

  onFinalizeWeight() {
    this.saveAcceptanceWeighing.validate();
    if (this.saveAcceptanceWeighing.invalid) {
      if (this.saveAcceptanceWeighing.get('weighingList').invalid) {
        this.cargoIndicator = "error";
      } else {
        this.cargoIndicator = null;
      }
      if (this.saveAcceptanceWeighing.get('remarksList').invalid) {
        this.remarksIndicator = "error";
      } else {
        this.remarksIndicator = null;
      }
      if (this.saveAcceptanceWeighing.get('dimensionList').invalid) {
        this.dimensionIndicator = "error";
      } else {
        this.dimensionIndicator = null;
      }
      if (this.saveAcceptanceWeighing.get('hawbList').invalid) {
        this.hawbListIndicator = "error";
      } else {
        this.hawbListIndicator = null;
      }
      return;
    }
    if (this.saveAcceptanceWeighing.get('remarksList').invalid) {
      this.remarksIndicator = "error";
    } else {
      this.remarksIndicator = null;
    }
    const cargoDetails = this.saveAcceptanceWeighing.getRawValue();
    let errInd: boolean = false;
    this.exportService.finalize(cargoDetails).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.refreshFormMessages(response);
        if (response.data != null) {
          if (response.data.acknowledgeIndicatorCPE && !response.data.hawbNumber) {
            errInd = true;
            this.showErrorStatus('export.acknowledge.and.close.all.actions');
            this.actionlistindicator = "error";
          } if (response.data.chargesPending) {
            errInd = true;
            this.showErrorStatus('Charges are pending. Please pay the charges and finalize');
          }
          else if (!errInd) {
            this.showSuccessStatus("uld.operation.completed.successfully");
            this.actionlistindicator = ""
          }
          //for loop for location Shc Null when length is 0
          if (response.data.weighingList && response.data.weighingList.length > 0) {
            for (const eachRow of response.data.weighingList) {
              if (eachRow.locationList && eachRow.locationList.length > 0) {
                for (const eachRowData of eachRow.locationList) {
                  if (eachRowData.locShc && eachRowData.locShc.length < 1) {
                    eachRowData.locShc = null;
                  }
                }
              }
            }
          }
          this.saveAcceptanceWeighing.patchValue(response.data);
          // this.onSearch();
        }
      }
    }, error => {
      this.showErrorMessage('error' + error)
    });
  }


  onAddDummyData() {
    (<NgcFormArray>this.saveAcceptanceWeighing.get('hawbList')).addValue([
      {
        hawbPcs: null,
        hawbPieces: null,
        hawbWeight: null,
        shipmentId: null,
        hawbNumber: null,
        hwbACKReceived: null,
        shipmentHouseId: null,
        houseInformationId: null,
        hawbfinalizeWeight: null,
        hwbArrivalReportSent: null,
        documentInformationId: null,
      }
    ]);
  }

  onSearchHawb(index) {
    this.acceptanceWeighingForm.get('hawbNumber').setValue((<NgcFormControl>this.saveAcceptanceWeighing.get(['hawbList', index, 'hawbNumber']).value));
    this.onSearch();
  }

  onHwbWeightSlip(index) {
    this.reportParameters = new Object();
    this.reportParameters.shipmentId = this.saveAcceptanceWeighing.get(['shipmentId']).value;
    this.reportParameters.shipmentNumber = this.saveAcceptanceWeighing.get(['shipmentNumber']).value;
    this.reportParameters.houseNumber = this.saveAcceptanceWeighing.get(['hawbList', index, 'hawbNumber']).value;
    this.reportParameters.documentInformationId = this.saveAcceptanceWeighing.get(['documentInformationId']).value;
    this.reportParameters.loginUser = this.getUserProfile().userShortName;
    this.reportWindowHwbWeightSlip.open();
  }





  onTotalWeightPrint() {
    this.reportParameters = new Object();
    this.reportParameters.loginUser = this.getUserProfile().userShortName;
    this.reportParameters.shipmentId = this.saveAcceptanceWeighing.get(['shipmentId']).value;
    this.reportParameters.shipmentNumber = this.saveAcceptanceWeighing.get(['shipmentNumber']).value;
    this.reportParameters.documentInformationId = this.saveAcceptanceWeighing.get(['documentInformationId']).value;
    if (this.saveAcceptanceWeighing.get(['hawbNumber']).value) {
      this.reportParameters.houseNumber = this.saveAcceptanceWeighing.get(['hawbNumber']).value;
    } else {
      this.reportParameters.houseNumber = null;
    }
    this.reportWindowHwbTotalWeightSlip.open();
  }

  onFinalizeWeightHouseList() {
    let checkSelected = 0;
    const request = (<NgcFormArray>this.saveAcceptanceWeighing.get(['hawbList'])).getRawValue();
    request.forEach(element => {
      if (element.select) {
        checkSelected = checkSelected + 1;
      }
    });
    if (checkSelected < 1) {
      this.showErrorMessage("Please Select Atleast One Row");
      return;
    }
    this.exportService.onFinalizeWeightHouseList(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.refreshFormMessages(data);
        if (data.success == true) {
          if (data.messageList === null) {
            this.showSuccessStatus('save Successfully');
            // this.onSearch();
            //for loop for location Shc Null when length is 0
            if (data.data.weighingList && data.data.weighingList.length > 0) {
              for (const eachRow of data.data.weighingList) {
                if (eachRow.locationList && eachRow.locationList.length > 0) {
                  for (const eachRowData of eachRow.locationList) {
                    if (eachRowData.locShc && eachRowData.locShc.length < 1) {
                      eachRowData.locShc = null;
                    }
                  }
                }
              }
            }
            this.saveAcceptanceWeighing.patchValue(data.data);
          } else {
            this.showErrorMessage(data.messageList[0].code);
          }
        } else {
          this.showErrorMessage(data.data.messageList[0].code);
        }
      }
    }, error => {
      this.showErrorMessage('error' + error)
    })
  }

  unfinalizeShipmentHouseList() {
    let checkSelected = 0;
    const request = (<NgcFormArray>this.saveAcceptanceWeighing.get(['hawbList'])).getRawValue();
    request.forEach(element => {
      if (element.select) {
        checkSelected = checkSelected + 1;
      }
    });
    if (checkSelected < 1) {
      this.showErrorMessage("Please Select Atleast One Row");
      return;
    }
    this.exportService.unfinalizeShipmentHouseList(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (!this.showResponseErrorMessages(data)) {
          this.refreshFormMessages(data);
          if (data.success == true) {
            if (data.messageList === null) {
              this.showSuccessStatus('save Successfully');
              // this.onSearch();
              //for loop for location Shc Null when length is 0
              if (data.data.weighingList && data.data.weighingList.length > 0) {
                for (const eachRow of data.data.weighingList) {
                  if (eachRow.locationList && eachRow.locationList.length > 0) {
                    for (const eachRowData of eachRow.locationList) {
                      if (eachRowData.locShc && eachRowData.locShc.length < 1) {
                        eachRowData.locShc = null;
                      }
                    }
                  }
                }
              }
              this.saveAcceptanceWeighing.patchValue(data.data);
            } else {
              this.showErrorMessage(data.messageList[0].code);
            }
          } else {
            this.showErrorMessage(data.data.messageList[0].code);
          }
        }
      }
    }, error => {
      this.showErrorMessage('error' + error)
    })
  }

  onFinalizeHouseWeight(index) {
    const request = (<NgcFormGroup>this.saveAcceptanceWeighing.get(['hawbList', index])).getRawValue();
    this.exportService.finalizeHouse(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.refreshFormMessages(data);
        if (data.success == true) {
          if (!data.messageList) {
            this.saveAcceptanceWeighing.get(['hawbList', index]).patchValue(data.data);
            this.showSuccessStatus('Finalized.Successfully');
            // this.onSearch();
            //for loop for location Shc Null when length is 0
            if (data.data.weighingList && data.data.weighingList.length > 0) {
              for (const eachRow of data.data.weighingList) {
                if (eachRow.locationList && eachRow.locationList.length > 0) {
                  for (const eachRowData of eachRow.locationList) {
                    if (eachRowData.locShc && eachRowData.locShc.length < 1) {
                      eachRowData.locShc = null;
                    }
                  }
                }
              }
            }
            this.saveAcceptanceWeighing.patchValue(data.data);
          } else {
            this.showErrorMessage(data.messageList[0].code);
          }
        } else {
          this.showErrorMessage(data.data.messageList[0].code);
        }
      }
    }, error => {
      this.showErrorMessage('error' + error)
    })
  }

  unfinalizeHawb(index) {
    const request = (<NgcFormGroup>this.saveAcceptanceWeighing.get(['hawbList', index])).getRawValue();
    this.exportService.unfinalizeHawb(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.refreshFormMessages(data);
        if (data.success == true) {
          if (!data.messageList) {
            this.saveAcceptanceWeighing.get(['hawbList', index]).patchValue(data.data);
            this.showSuccessStatus('UnFinalized.Successfully');
            // this.onSearch();
            //for loop for location Shc Null when length is 0
            if (data.data.weighingList && data.data.weighingList.length > 0) {
              for (const eachRow of data.data.weighingList) {
                if (eachRow.locationList && eachRow.locationList.length > 0) {
                  for (const eachRowData of eachRow.locationList) {
                    if (eachRowData.locShc && eachRowData.locShc.length < 1) {
                      eachRowData.locShc = null;
                    }
                  }
                }
              }
            }
            this.saveAcceptanceWeighing.patchValue(data.data);
          } else {
            this.showErrorMessage(data.messageList[0].code);
          }
        } else {
          this.showErrorMessage(data.data.messageList[0].code);
        }
      }
    }, error => {
      this.showErrorMessage('error' + error)
    })
  }

  unfinalize() {
    const cargoForDocmnt = this.saveAcceptanceWeighing.getRawValue();
    this.exportService.unfinalize(cargoForDocmnt).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.success == true && data.messageList == null) {
          this.showSuccessStatus("status.Success");
          //for loop for location Shc Null when length is 0
          if (data.data.weighingList && data.data.weighingList.length > 0) {
            for (const eachRow of data.data.weighingList) {
              if (eachRow.locationList && eachRow.locationList.length > 0) {
                for (const eachRowData of eachRow.locationList) {
                  if (eachRowData.locShc && eachRowData.locShc.length < 1) {
                    eachRowData.locShc = null;
                  }
                }
              }
            }
          }
          this.saveAcceptanceWeighing.patchValue(data.data);
          // this.onSearch();
        } else {
          if (data.messageList[0] != null) {
            this.showErrorMessage(data.messageList[0].code);
          }
        }
      }
    });
  }

  releaseEvent(event) {
    if (event.index === 3) {
      // this.refreshHawbList();
    }
  }

  refreshHawbList() {
    let constRequest = this.saveAcceptanceWeighing.getRawValue();
    this.exportService.refreshHawbList(constRequest).subscribe(response => {
      this.saveAcceptanceWeighing.patchValue(response.data);
    });
  }

  setHAWBNumber(event) {
    if (event && event.code) {
      this.acceptanceWeighingForm.get(['hawbNumber']).setValue(event.code);
    } else {
      this.acceptanceWeighingForm.get(['hawbNumber']).setValue(this.acceptanceWeighingForm.get('hawbNumber').value);
    }
  }

  onChangeAwbShc(event) {
    this.shclist = event;
    if (this.saveAcceptanceWeighing.get(['weighingList'])
      && ((<NgcFormArray>this.saveAcceptanceWeighing.get(['weighingList'])).length > 0 || (<NgcFormArray>this.saveAcceptanceWeighing.get(['weighingList'])).value != null)
      && (<NgcFormControl>this.saveAcceptanceWeighing.get(['weighingList', 0, 'locationList'])
        && ((<NgcFormArray>this.saveAcceptanceWeighing.get(['weighingList', 0, 'locationList'])).length > 0
          && (<NgcFormControl>this.saveAcceptanceWeighing.get(['weighingList', 0, 'flagCRUD'])).value === 'C')
        && (<NgcFormControl>this.saveAcceptanceWeighing.get(['weighingList', 0, 'locationList', 0, 'flagCRUD'])).value === 'C')
      && (this.saveAcceptanceWeighing.get("hawbNumber").value == null || this.saveAcceptanceWeighing.get("hawbNumber").value == '')
    ) {
      (<NgcFormControl>this.saveAcceptanceWeighing.get(['weighingList', 0, 'locationList', 0, 'locShc'])).setValue(this.shclist);
    }
  }

  onChangeHawbShc(event) {
    this.hawbShclist = event;
    if (this.saveAcceptanceWeighing.get(['weighingList'])
      && ((<NgcFormArray>this.saveAcceptanceWeighing.get(['weighingList'])).length > 0 || (<NgcFormArray>this.saveAcceptanceWeighing.get(['weighingList'])).value != null)
      && (<NgcFormControl>this.saveAcceptanceWeighing.get(['weighingList', 0, 'locationList'])
        && ((<NgcFormArray>this.saveAcceptanceWeighing.get(['weighingList', 0, 'locationList'])).length > 0
          && (<NgcFormControl>this.saveAcceptanceWeighing.get(['weighingList', 0, 'flagCRUD'])).value === 'C')
        && (<NgcFormControl>this.saveAcceptanceWeighing.get(['weighingList', 0, 'locationList', 0, 'flagCRUD'])).value === 'C')
      && (this.saveAcceptanceWeighing.get("hawbNumber").value != null && this.saveAcceptanceWeighing.get("hawbNumber").value != '')
    ) {
      (<NgcFormControl>this.saveAcceptanceWeighing.get(['weighingList', 0, 'locationList', 0, 'locShc'])).setValue(this.hawbShclist);
    }
  }

  onClear() {
    this.displayFlag = true;
    this.cargoIndicator = null;
    this.remarksIndicator = null;
    this.hawbListIndicator = null;
    this.dimensionIndicator = null;
    (<NgcFormArray>this.saveAcceptanceWeighing.get("shc")).resetValue([]);
    (<NgcFormArray>this.saveAcceptanceWeighing.get("hawbList")).resetValue([]);
    (<NgcFormArray>this.saveAcceptanceWeighing.get("remarksList")).resetValue([]);
    (<NgcFormArray>this.saveAcceptanceWeighing.get("weighingList")).resetValue([]);
    (<NgcFormArray>this.saveAcceptanceWeighing.get("dimensionList")).resetValue([]);
    this.acceptanceWeighingForm.reset();
    this.saveAcceptanceWeighing.reset();
    (<NgcFormControl>this.acceptanceWeighingForm.get("shipmentType")).setValue('AWB');
  }

  // Report method for print weighing slip should be enabled on;y after finalize
  onPrintViewingSlip() {
    this.reportParameters = new Object();
    this.reportParameters.loginuser = this.getUserProfile().userShortName;
    this.reportParameters.shipmentId = this.saveAcceptanceWeighing.get('shipmentId').value;
    this.reportParameters.documentInformationId = this.saveAcceptanceWeighing.get('documentInformationId').value;
    this.reportWindow.open();
  }

  onChangeShipmentNumber(event) {
    this.houseLovParameter = { 'parameter1': event, r: Math.random() };
  }

  replaceDummyAWB() {
    this.replaceDummyAWBGroup.reset();
    this.replaceDummyAWBGroup.get('shipmentNumber').setValue(this.saveAcceptanceWeighing.get('shipmentNumber').value);
    this.replaceDummyAWBWindow.open();
  }

  onSaveReplaceDummyAwb() {
    this.replaceDummyAWBGroup.validate();
    if (!this.replaceDummyAWBGroup.valid) {
      return;
    }
    else {
      let request: ReplaceDummyAWBModel = this.replaceDummyAWBGroup.getRawValue();
      request.shipmentDate = this.saveAcceptanceWeighing.get('shipmentDate').value;
      this.exportService.replaceDummyAWB(request).subscribe(response => {
        this.resetFormMessages();
        if (response !== null) {
          if (!this.showResponseErrorMessages(response)) {
            this.saveAcceptanceWeighing.patchValue(response.data);
            this.acceptanceWeighingForm.get('shipmentNumber').patchValue(this.saveAcceptanceWeighing.get('shipmentNumber').value);
            this.showSuccessStatus('uld.operation.completed.successfully');
            this.replaceDummyAWBWindow.close();
          }
        }
      })
    }
  }

  onCancelReplaceDummyAwb() {
    this.replaceDummyAWBGroup.reset();
    this.replaceDummyAWBWindow.close();
  }

  generateDummyAWB() {
    let request = this.acceptanceWeighingForm.getRawValue();
    this.exportService.generateDummyAWB(request).subscribe(response => {
      this.resetFormMessages();
      if (response !== null) {
        if (!this.showResponseErrorMessages(response)) {
          this.acceptanceWeighingForm.patchValue(response.data);
          this.onSearch();
        }
      }
    })
  }

  onReturnCargo() {
    this.saveAcceptanceWeighing.get('returnRemarks').setValidators(Validators.required);
    this.saveAcceptanceWeighing.get('showReturnSection').setValue(true);
  }

  onEnquireCharges() {
    const requestObject = {
      shipmentNumber: this.saveAcceptanceWeighing.get('shipmentNumber').value,
      shipment: this.saveAcceptanceWeighing.get('shipmentNumber').value,
      returnAWBWeighing: true,
      acceptanceType: this.saveAcceptanceWeighing.get('acceptanceType').value,
      shipmentType: 'AWB'
    };
    this.navigateTo(this.router, 'billing/collectPayment/enquireCharges', requestObject);
  }

  returnCargo() {
    this.resetFormMessages();
    if (this.saveAcceptanceWeighing.get('returnRemarks').value === null || this.saveAcceptanceWeighing.get('returnRemarks').value === '') {
      this.showErrorMessage('export.accpt.please.enter.report.remarks');
      return;
    }

    this.showConfirmMessage('Do you want to Return the Complete Shipment').then(fulfilled => {
      let request: SaveAcceptanceWeighing = this.saveAcceptanceWeighing.getRawValue();
      request.returnReason = 'AWB_RETURN';
      this.exportService.returnDomesticCargo(request).subscribe(response => {
        this.resetFormMessages();
        if (response !== null) {
          if (!this.showResponseErrorMessages(response)) {
            this.saveAcceptanceWeighing.patchValue(response.data);
            if (this.saveAcceptanceWeighing.get('paymentStatus').value === 'CHARGE_PENDING') {
              this.showErrorMessage('exp.accpt.return.cargo.warining'); //Please pay the charges and confirm Return Cargo
            } else {
              this.onPrintGatePass();
              this.saveAcceptanceWeighing.reset();
              this.replaceDummyAWBGroup.reset();
              this.displayFlag = true;
              this.saveAcceptanceWeighing.get('returnRemarks').clearValidators();
              this.showSuccessStatus('uld.operation.completed.successfully');
            }
          }
        }
      })

    }).catch(reason => {
    });
  }

  cancelReturn() {
    this.saveAcceptanceWeighing.get('showReturnSection').setValue(false);
    this.saveAcceptanceWeighing.get('returnRemarks').clearValidators();
    this.saveAcceptanceWeighing.get('returnRemarks').setValue(null);

    if (this.saveAcceptanceWeighing.get('returnRequested').value) {
      let request: SaveAcceptanceWeighing = this.saveAcceptanceWeighing.getRawValue();

      this.exportService.cancelReturnCargoWeighing(request).subscribe(response => {
        this.resetFormMessages();
        if (response !== null) {
          if (!this.showResponseErrorMessages(response)) {
            this.saveAcceptanceWeighing.patchValue(response.data);
            this.showSuccessStatus('uld.operation.completed.successfully');
          }
        }
      });
    }
  }

  onPrintHawbWighingSlip() {
    this.reportParameters = new Object();
    this.reportParameters.loginuser = this.getUserProfile().userShortName;
    this.reportParameters.shipmentId = this.saveAcceptanceWeighing.get('shipmentId').value;
    this.reportParameters.documentInformationId = this.saveAcceptanceWeighing.get('documentInformationId').value;
    this.reportParameters.houseInformationId = this.saveAcceptanceWeighing.get('houseInformationId').value;
    this.reportWindow1.open();

  }

  public onBack(event) {
    let record;
    if (this.transferData != null) {
      record = {
        shipmentNumber: this.transferData['shipmentNumber']
      }
    }
    this.navigateBack(record);
  }


  onAgentNameAutoFill(object) {
    this.saveAcceptanceWeighing.get('customerName').setValue(object.desc);
  }

  onAgentNameAutoFillHawb(object) {
    this.saveAcceptanceWeighing.get('hawbCustomerName').setValue(object.desc);
  }

  onPrintGatePass() {
    this.reportParameters = new Object();
    this.reportParameters.acceptanceType = '(For Domestic Freight)';
    this.reportParameters.sbFlag = true;
    this.reportParameters.documentInformationId = this.saveAcceptanceWeighing.get('documentInformationId').value;
    this.reportParameters.staffId = this.getUserProfile().userLoginCode;
    this.reportParameters.loginuser = this.getUserProfile().userShortName;
    this.reportWindow2.open();
  }


  onCloseFailureData() {

    const closeFailureRequest: ShipmentExecModel = new ShipmentExecModel();
    const requestData = this.saveAcceptanceWeighing.get('ruleShipmentExecutionDetails').value;
    const shipmentWarnDetails = [];
    const shipmentInfoDetails = [];
    for (const eachRow of requestData.execWarnList) {
      if (eachRow.acknowledge && !eachRow.issueClosedOn) {
        eachRow.recordId = eachRow.failureId;
        shipmentWarnDetails.push(eachRow);
      }
    }
    for (const eachRow of requestData.execInfoList) {
      if (eachRow.acknowledge && !eachRow.issueClosedOn) {
        eachRow.recordId = eachRow.failureId;
        shipmentInfoDetails.push(eachRow);
      }
    }
    closeFailureRequest.shipmentWarnDetails = shipmentWarnDetails;
    closeFailureRequest.shipmentInfoDetails = shipmentInfoDetails;
    this._cargoEngineProcessService.oncloseFailure(closeFailureRequest).subscribe(response => {
      if(!this.showResponseErrorMessages(response)){
        this.fetchRuleExecutionList();
      };
    });
  }

  fetchRuleExecutionList() {
    let cargo = this.acceptanceWeighingForm.getRawValue();
    //Research the data
    this.exportService.fetchRuleShipmentExecutionListAccptByHouse(cargo).subscribe(response => {
      let ruleShipmentExecutionDetails: any;
      ruleShipmentExecutionDetails = response.data.ruleShipmentExecutionDetails;
      this.saveAcceptanceWeighing.get('ruleShipmentExecutionDetails').patchValue(response.data.ruleShipmentExecutionDetails);
      if (response.data.acknowledgeIndicatorCPE) {
        this.actionlistindicator = "error"
      } else {
        this.actionlistindicator = "";
      }
    });
  }

  getFlightOffPoint(event) {
    let request: SaveAcceptanceWeighing = this.saveAcceptanceWeighing.getRawValue();
    console.log(request.firstBookedFlight);
    this.saveAcceptanceWeighing.get('firstOffPoint').patchValue(null);
    this.flightOffPointDropdownSourceParam = this.createSourceParameter(this.saveAcceptanceWeighing.get('firstBookedFlight').value,NgcUtility.getDateTimeAsStringByFormat(this.saveAcceptanceWeighing.get('firstBookedFlightDate').value,'YYYY-MM-DD')); //Updting Flight Off Point DropDown
    // if (request.firstBookedFlight != null && request.firstBookedFlightDate != null && request.firstBookedFlight.length > 0) {
    //   this.exportService.getFlightOffPointWeighing(request).subscribe(response => {
    //     if (response !== null) {
    //       if (!this.showResponseErrorMessages(response)) {
    //         this.saveAcceptanceWeighing.get('firstOffPoint').patchValue(response.data.firstOffPoint);
    //       }
    //     }
    //   })
    // }
  }


  onChangeManualBookingInfo(event) {
    if (event) {
      this.saveAcceptanceWeighing.get('firstBookedFlight').setValidators(Validators.required);
      this.saveAcceptanceWeighing.get('firstBookedFlightDate').setValidators(Validators.required);
      this.saveAcceptanceWeighing.get('firstOffPoint').setValidators(Validators.required);
    } else {
      this.saveAcceptanceWeighing.get('firstBookedFlight').clearValidators();
      this.saveAcceptanceWeighing.get('firstBookedFlightDate').clearValidators();
      this.saveAcceptanceWeighing.get('firstOffPoint').clearValidators();
    }
  }



}
