import { Validators } from '@angular/forms';
import { ExportService } from './../../export.service';
import { AcceptanceService } from '../acceptance.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcUtility,
  PageConfiguration, NgcReportComponent, BaseResponse
} from 'ngc-framework';
import {
  CargoWeighingServiceModel, ShipmentModel, CargoWeighingDetailModel,
  CargoWeighingDetailInventory, HouseInformationModel,
  AcceptanceServiceModel, WeighingRemarks, ActionListModel, DimensionModel, Dimention,
  WeighingScaleRequest, weighingTimeModel
} from './../../export.sharedmodel';

@Component({
  selector: 'ngc-manage-acceptance-weighing',
  templateUrl: './manage-acceptance-weighing.component.html',
  styleUrls: ['./manage-acceptance-weighing.component.scss']
})
@PageConfiguration({
  trackInit: true,
  // callNgOnInitOnClear: true,
})
export class ManageAcceptanceWeighingComponent extends NgcPage implements OnInit {
  actionlistindicator: any;
  startWeighingDisabler: any;
  weighingstarttime: any;
  startweighingflag: any;
  startweighingflagTwo: any;
  cpeacknowledgeflag: any;
  shipmentNumberNew: any;
  totalCargoWeight: any = 0;
  prefinalizesave: boolean;
  shipmentNumber: any;
  billinguiflag: boolean;
  paymentFlag: boolean;
  totalVolWeightFinal: any = 0;
  totalVolPieces: any = 0;
  totalVolWeight: any = 0;
  invntoryweightsum: any = 0;
  totalgrosspieces: any;
  totalgrossweight: any;
  accType: any;
  setSVC = false;
  paymentStatusFlag = false;
  enableEcc = false;
  reportParameters: any;
  finalizeFlag = true;
  delayAcceptanceFlag = true;
  volumetricweight: number;
  totalCargoPieces: any;
  totalitenaryweight: any;
  totalitenarypiece: any;
  omegaDisabler = false;
  docId: number;
  shipmentId: number;
  serviceNumber: number;
  remarkControl: any;
  dimensionActualArray: any[];
  dataDisplay: any;
  dimensionArray: any[];
  fwbPieces: any;
  serverFetchedRowsNoId: any[] = [];
  serverFetchedRowsId: any[] = [];
  displayFlag = false;
  uldBup: any = 'N';
  dimensionFlag = false;
  remarksFlag = true;
  totalWeight: any;
  totalPieces: any;
  transferData: any;
  totalDimensionPieces: number;
  totalDimensionWeight: number;
  greaterPieceFlag = false;
  greaterWeightFlag = false;
  noLocationFlag = false;
  detailsPieces: number;
  detailsWeight: number;
  greaterPFlag = false;
  greaterWFlag = false;
  selectDisabler = false;
  searchDone = false;
  showReadOnlyWeight = false;
  addWeight = true;
  handlingDefination: any;
  errormessage: any;

  private cargoIndicator: string = '';
  private dimensionIndicator: string = '';
  private remarksIndicator: string = '';
  @ViewChild('summaryButton') backToSummary: NgcButtonComponent;
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  @ViewChild('delayAcceptanceButton') delayAcceptanceButton: NgcButtonComponent;
  @ViewChild('printSlipButton') printSlipButton: NgcButtonComponent;
  @ViewChild('returnDocumentButton') returnDocumentButton: NgcButtonComponent;
  @ViewChild('partConfirmButton') partConfirmButton: NgcButtonComponent;
  @ViewChild('finalizeWeightButton') finalizeWeightButton: NgcButtonComponent;
  @ViewChild('tagsWindow') tagsWindow: NgcWindowComponent;
  @ViewChild('changeTagsButton') changeTagsButton: NgcButtonComponent;
  @ViewChild('startWeighingButton') startWeighingButton: NgcButtonComponent;
  @ViewChild('eccButton') eccButton: NgcButtonComponent;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  statusDropdown: string[];
  awbDropdown: string[];
  resp: any;
  inventorypieces: any;
  weightdiff: any;
  shcList: string = '';
  cargoWeighingDetailList: any[];
  dimensionList: DimensionModel[];
  remarksList: WeighingRemarks[];
  dimensionRequest: DimensionModel[];
  newlyCreatedCargo: CargoWeighingDetailModel[];
  remarksRequest: WeighingRemarks[];
  cargoDetailsRequest: CargoWeighingDetailModel[];
  initDetailsArraySize: number;
  houseIndex: number;
  houseSubIndex: number;
  acceptedPieces: number;
  acceptedWeight: number;
  dimensionPieces: number;
  childWeight: number = 0;
  childPieces: number = 0;
  weightPerPiece: number = 0;
  weighingScaleData: any;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private exportService: ExportService, private _acceptanceService: AcceptanceService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  private weighingForm: NgcFormGroup = new NgcFormGroup({
    weigingstartdate: new NgcFormControl(),
    weighingScaleId: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    awbNo: new NgcFormControl(),
    eacceptanceType: new NgcFormControl(),
    serviceNumber: new NgcFormControl(),
    svc: new NgcFormControl(),
    awbList: new NgcFormControl(),
    partButton: new NgcFormControl(),
    acceptedPieces: new NgcFormControl(),
    acceptedWeight: new NgcFormControl(),
    weightDifference: new NgcFormControl(),
    totalVolWeight: new NgcFormControl(),
    destination: new NgcFormControl(),
    carrier: new NgcFormControl(),
    shc: new NgcFormControl(),
    uldBup: new NgcFormControl(),
    screenedPieces: new NgcFormControl(),
    totalIceWeight: new NgcFormControl(),
    totalVolumetricWeight: new NgcFormControl(),
    stopCheckList: new NgcFormArray([]),
    warningCheckList: new NgcFormArray([]),
    cmtButton: new NgcFormControl(),
    inhButton: new NgcFormControl(),
    mcButton: new NgcFormControl(),
    densityCode: new NgcFormControl(),
    cfButton: new NgcFormControl(),
    scale: new NgcFormControl(),
    totalPieces: new NgcFormControl(),
    totalWeight: new NgcFormControl(),
    totalVolumetricPieces: new NgcFormControl(),
    dateTimeStart: new NgcFormControl(),
    tagList: new NgcFormControl(),
    dimensionFwbArray: new NgcFormArray([]),
    dimensionActualArray: new NgcFormArray([
      new NgcFormGroup({
        length: new NgcFormControl(),
        width: new NgcFormControl(),
        height: new NgcFormControl(),
        piece: new NgcFormControl(),
        volumeWeight: new NgcFormControl(),
        pcs: new NgcFormControl()
      })
    ]),
    remarksArray: new NgcFormArray([
      new NgcFormGroup({
        type: new NgcFormControl(),
        detail: new NgcFormControl(),
        deleteRemark: new NgcFormControl()
      })
    ]),
    cargoDetailsArray: new NgcFormArray([]),
    houseTagsInfo: new NgcFormArray([]),
    requestedTemperatureRange: new NgcFormControl(),
    ruleShipmentExecutionDetails: new NgcFormGroup({
      execInfoList: new NgcFormArray([]),
      execWarnList: new NgcFormArray([]),
      execErrorList: new NgcFormArray([]),
    }),
  });

  ngOnInit() {
    this.transferData = this.getNavigateData(this.activatedRoute);
    if (this.transferData != null && this.transferData !== undefined) {
      this.weighingForm.get('awbNumber').setValue(this.transferData);
      this.prefinalizesave = false;
      this.onSearch();
    }
  }

  onSearch() {
    const cargo: CargoWeighingServiceModel = new CargoWeighingServiceModel();
    const shipmentObj: ShipmentModel = new ShipmentModel();
    this.setSVC = false;
    this.searchDone = false;
    this.weighingForm.enable();
    this.serverFetchedRowsId = [];
    this.serverFetchedRowsNoId = [];
    this.awbDropdown = [];
    this.acceptedWeight = 0.0;
    this.acceptedPieces = 0;
    this.shcList = '';
    this.omegaDisabler = false;
    // if (this.weighingForm.get('awbNo').value != null) {
    this.shipmentNumber = this.weighingForm.get('awbNumber').value;
    shipmentObj.shipmentNumber = this.weighingForm.get('awbNumber').value;
    // } else {
    //   this.shipmentNumberNew = this.weighingForm.get('awbNumber').value;
    //   shipmentObj.shipmentNumber = this.weighingForm.get('awbNumber').value;
    // }
    this.weighingForm.reset();
    this.weighingForm.get('awbNumber').setValue(this.shipmentNumber);
    // if (this.weighingForm.get('awbNo').value != null) {
    //   this.weighingForm.get('awbNumber').setValue(this.shipmentNumber);
    // }

    this.displayFlag = false;
    this.totalDimensionPieces = 0;
    this.totalDimensionWeight = 0;
    this.paymentFlag = false;

    if (shipmentObj.shipmentNumber) {
      cargo.shipmentModel = shipmentObj;

      this.exportService.onSearchAWB(cargo).subscribe(data => {


        this.cpeacknowledgeflag = false;
        if (data.data != null && data.data.weighingstarttime == null) {
          this.startweighingflag = false;
          this.startWeighingDisabler = false;

        } else {
          this.startWeighingDisabler = true;
          this.startweighingflag = true;
          if (data.data != null && data.data.weighingstarttime != null) {
            this.weighingForm.get('weigingstartdate').patchValue(NgcUtility.toDateFromLocalDate(data.data.weighingstarttime));
          }
        }
        if (data.data != null && data.data.shipmentModel != null && data.data.shipmentModel.shipmentId != null) {
          this.shipmentId = data.data.shipmentModel.shipmentId;
          this.shipmentNumber = data.data.shipmentModel.shipmentNumber;
        }
        // Handling Definition for the respective Acceptance Type


        this.weighingForm.get('requestedTemperatureRange').patchValue(data.data.requestedTemperatureRange);



        //   this.showErrorMessage(this.showErrorMessage);
        this.resp = data.data;
        this.totalgrosspieces = this.resp.grossActualPieces;
        this.totalgrossweight = this.resp.grossActualWeight;
        if (this.resp && (this.resp.status === 'SERVICING' || this.resp.status === 'ACCEPTED')) {
          this.weighingForm.get('ruleShipmentExecutionDetails').patchValue(this.resp.ruleShipmentExecutionDetails);
          let executionlist = this.weighingForm.get('ruleShipmentExecutionDetails');
          let execErrorList = executionlist.get('execErrorList');
          let execInfoList = executionlist.get('execInfoList');
          let execWarnList = executionlist.get('execWarnList');
          //if (execErrorList.value.length > 0 || execInfoList.value.length > 0 || execWarnList.value.length > 0) {
          if (execErrorList.value.length > 0 || execWarnList.value.length > 0 || execInfoList.value.length > 0) {

            this.actionlistindicator = "error";
          } else {
            this.actionlistindicator = "";
          }
          this.searchDone = true;
          this.displayFlag = true;
          this.enablePartButton();
          this.enableFinalizeButton();
          this.serviceNumber = this.resp.serviceNumber;
          this.docId = this.resp.documentInformationId;
          this.totalWeight = this.resp.acceptedWeight;
          this.totalPieces = this.resp.acceptedPieces;
          this.weightPerPiece = this.totalWeight / this.totalPieces;
          this.setUldBup();
          this.setSHC();
          this.setDropdown();
          if (this.resp.eacceptanceType !== null) {
            this.weighingForm.get('eacceptanceType').setValue(this.resp.eacceptanceType);
            this.accType = this.resp.eacceptanceType;

          }
          this.weighingForm.get('serviceNumber').setValue(this.resp.serviceNumber);
          this.weighingForm.get('awbNumber').setValue(this.weighingForm.get('awbNumber').value);
          this.shipmentNumber = this.weighingForm.get('awbNumber').setValue(this.weighingForm.get('awbNumber').value);
          this.weighingForm.get('carrier').setValue(this.resp.shipmentModel.carrier);
          this.weighingForm.get('destination').setValue(this.resp.shipmentModel.destination);
          this.weighingForm.get('uldBup').setValue(this.uldBup);
          this.weighingForm.get('shc').setValue(this.shcList);
          this.totalPieces = this.resp.acceptedPieces;
          this.totalWeight = this.resp.acceptedWeight;
          this.weightdiff = this.resp.weightDifference;
          this.totalitenaryweight = this.resp.totalItenaryWeight;
          this.totalitenarypiece = this.resp.totalItenaryPiece;
          this.totalVolPieces = this.resp.dimensionPieceSum;
          this.totalVolWeight = this.resp.dimensionVolumeSum;
          this.weighingForm.get('totalVolumetricPieces').setValue(this.totalVolPieces);
          this.weighingForm.get('totalVolumetricWeight').setValue(this.totalVolWeight);

          if (this.resp.delayAcceptanceFlag == 1) {
            this.delayAcceptanceFlag = true;
          } else {
            this.delayAcceptanceFlag = false;
          }

          this.startweighingflagTwo = this.startweighingflag && !this.delayAcceptanceFlag;



          if (this.resp.svc === 1) {
            this.setSVC = true;

          }
          if (this.resp.physicalEcc == false) {
            this.enableEcc = this.resp.physicalEcc;
          } else {
            this.enableEcc = true;
          }

          this.dimensionList = this.resp.dimension;
          this.remarksList = this.resp.remarks;
          this.cargoWeighingDetailList = this.resp.cargoWeighingDetailModel;
          for (const entry of this.remarksList) {
            entry.deleteRemark = '';
          }
          if (this.dimensionList && this.dimensionList.length > 0) {
            this.setRadioButtons(this.dimensionList[0]);
            this.setTotalDimensionDetails();
          } else {
            this.weighingForm.controls['cmtButton'].setValue(true);
            this.weighingForm.controls['mcButton'].setValue(true);
          }
          this.setDetailsNet();
          (<NgcFormArray>this.weighingForm.controls['dimensionActualArray']).patchValue(this.dimensionList);
          (<NgcFormArray>this.weighingForm.controls['dimensionFwbArray']).patchValue(this.resp.fwbDimension);
          (<NgcFormArray>this.weighingForm.controls['remarksArray']).patchValue(this.remarksList);
          (<NgcFormArray>this.weighingForm.controls['cargoDetailsArray']).patchValue(this.cargoWeighingDetailList);
          let countinventoryitem = 0;
          this.cargoWeighingDetailList.forEach(element => {

            if (element.intentory.length <= 0) {
              this.onAddLocation(countinventoryitem);
            }
            countinventoryitem = countinventoryitem + 1;
          })
          this.setFetchedArrays();
          this.setAcceptedData();


          //  this.weighingForm.get('acceptedPieces').setValue(this.resp.acceptedPieces);
          //  this.weighingForm.get('acceptedWeight').setValue(this.resp.acceptedWeight);

          if (this.resp.finalize) {
            this.disableOnFinalize();
          }
          const lenflag = (<NgcFormArray>this.weighingForm.get('cargoDetailsArray')).length;
          if (!this.resp.finalize && lenflag == 0) {
            this.onAddRow()
          }

          this.prefinalizesave = false;

        } else {
          this.showErrorMessage('export.acceptance.not.done.for.awb');
        }
        this.onGetDimension(0);
      },
        error => {
          this.showErrorStatus('Error:' + error);

        });

    }
  }


  eventForPieceChange($event, index) {

  }

  onChangeValueOfPieces() {
    const len = (<NgcFormArray>this.weighingForm.get('cargoDetailsArray')).length;
    for (let i = 0; i < len; ++i) {
      let j = i;

      let value = this.weighingForm.get(['cargoDetailsArray', i, 'piece']).value;
      this.weighingForm.get(['cargoDetailsArray', j, 'grossWeight']).setValue((this.totalWeight * value) / this.totalPieces);
    }
  }





  onDetailsAddRow() {
    (<NgcFormArray>this.weighingForm.get('dimensionActualArray')).addValue([
      {
        length: '',
        width: '',
        height: '',
        piece: '',
        volumeWeight: ''
      }
    ]);
  }

  onAddRemark() {
    (<NgcFormArray>this.weighingForm.get('remarksArray')).addValue([
      {
        type: '',
        detail: '',
        deleteRemark: ''
      }
    ]);
  }

  // Sets the unit according to the stored info
  setRadioButtons(dimension: any) {
    if (dimension.measurementUnitCode === 'CMT') {
      this.weighingForm.controls['cmtButton'].setValue(true);
    }
    else if (dimension.measurementUnitCode === 'INH') {
      this.weighingForm.controls['inhButton'].setValue(true);
    }
    if (dimension.weightCode === 'MC') {
      this.weighingForm.controls['mcButton'].setValue(true);
    }
    else if (dimension.weightCode === 'CF') {
      this.weighingForm.controls['cfButton'].setValue(true);
    }
  }

  // Sets the respective net weight of each shipment
  setDetailsNet() {
    for (const entry of this.cargoWeighingDetailList) {
      if (entry.tareWeight) {
        if (entry.tareWeight !== 0) {
          entry.netWeight = entry.grossWeight - entry.tareWeight;
          if (entry.skids > 0) {
            entry.netWeight = (entry.grossWeight - (entry.tareWeight * entry.skids));
          }
        }
        else {
          entry.netWeight = entry.grossWeight;
        }
      }
      else {
        entry.netWeight = entry.grossWeight;
      }
    }
  }

  // Uld Bup flag
  setUldBup() {
    if (this.cargoWeighingDetailList) {
      for (const entry of this.cargoWeighingDetailList) {
        if (entry.autoWeighBupId !== 0) {
          this.uldBup = 'Y';
        }
      }
    }
  }

  // Display SHC for AWB
  setSHC() {
    if (this.resp.shipmentModel.shc) {
      for (const entry of this.resp.shipmentModel.shc) {
        if (entry.code) {
          this.shcList += entry.code + ' ';
        }
      }
    }
  }

  // Pack the Dimension Request
  setDimensionRequest() {
    this.dimensionActualArray = (Array)(this.weighingForm.controls['dimensionActualArray']);
    this.dimensionPieces = 0;
    if (this.dimensionActualArray.length > 0) {
      this.dimensionActualArray.forEach(fwbArrayData => {
        this.dataDisplay = fwbArrayData.controls;
        this.dataDisplay.forEach(e => {
          if (!((e.controls.height == null) || (e.controls.width == null) || (e.controls.length == null)
            || (e.controls.piece == null) || (e.controls.volumeWeight == null))) {
            let dimIter: DimensionModel = new DimensionModel();
            dimIter.width = +(e.controls.width.value);
            dimIter.height = +(e.controls.height.value);
            dimIter.length = +(e.controls.length.value);
            dimIter.piece = +(e.controls.piece.value);
            dimIter.volumeWeight = +(e.controls.volumeWeight.value);
            dimIter.weightCode = '';
            dimIter.measurementUnitCode = '';
            dimIter.documentInformationId = this.docId;
            this.dimensionPieces += +(e.controls.piece.value);
            this.dimensionRequest.push(dimIter);
          }
          else {
            this.showErrorStatus('export.fill.all.details.for.each.line.item');
          }
        });
      });
      const unitCode = this.weighingForm.get('cmtButton').value ? 'CMT' : 'INH';
      const volumeCode = this.weighingForm.get('mcButton').value ? 'MC' : 'CF';
      for (let i = 0; i < this.dimensionRequest.length; i++) {
        this.dimensionRequest[i].measurementUnitCode = unitCode;
        this.dimensionRequest[i].weightCode = volumeCode;
      }
    }
  }

  setRemarksRequest() {
    const remarksIter: NgcFormArray = <NgcFormArray>(this.weighingForm.controls['remarksArray']);
    if (remarksIter) {
      for (const remark of remarksIter.getRawValue()) {
        const remarks: WeighingRemarks = new WeighingRemarks();
        remarks.type = remark['type'];
        if (remark['detail']) {
          remarks.detail = remark['detail'];
          remarks.documentInformationId = this.docId;
          this.remarksFlag = true;
          this.remarksRequest.push(remarks);
        }
        else {
          this.remarksFlag = false;
          break;
        }
      }
    }
  }

  // Packs the Cargo Details Request
  setCargoDetailsRequest() {
    const cargoDetails = (<NgcFormArray>this.weighingForm.get('cargoDetailsArray')).getRawValue();
    for (const entry of cargoDetails) {
      if ('weighingId' in entry && entry.weighingId !== 0) {
        for (const iter of this.serverFetchedRowsId) {
          if (iter.weighingId === entry.weighingId) {
            iter.flagCRUD = entry.flagCRUD;
            iter.grossWeight = entry.grossWeight;
            iter.netWeight = entry.netWeight;
            iter.piece = entry.piece;
            iter.skids = entry.skids;
            iter.tareWeight = entry.tareWeight;
            iter.uldNumber = entry.uldNumber;
            if (iter.intentory.length > 0) {
              for (let i = iter.intentory.length - 1; i >= 0; i--) {
                if (iter.intentory[i].flagCRUD !== 'D') {
                  iter.intentory.splice(i, 1);
                }
              }

            }
            if (entry.intentory.length !== 0) {
              for (const inventory of entry.intentory) {
                inventory.weight = this.weightPerPiece * inventory.piece;
                if (inventory.shc === "") {
                  inventory.shc = []
                }
                iter.intentory.push(inventory);
              }
            }
          }
        }
      } else if ('autoWeighBupId' in entry && entry.autoWeighBupId !== 0) {
        for (const iter of this.serverFetchedRowsNoId) {
          if (iter.autoWeighBupId === entry.autoWeighBupId) {
            iter.flagCRUD = entry.flagCRUD;
            iter.grossWeight = entry.grossWeight;
            iter.netWeight = entry.netWeight;
            iter.piece = entry.piece;
            iter.skids = entry.skids;
            iter.tareWeight = entry.tareWeight;
            iter.uldNumber = entry.uldNumber;
            iter.intentory.length = 0;
            if (entry.intentory.length !== 0) {
              for (const inventory of entry.intentory) {
                inventory.weight = this.weightPerPiece * inventory.piece;
                if (inventory.shc === "") {
                  inventory.shc = []
                }
                iter.intentory.push(inventory);
              }
            }
          }
        }
      } else {
        const cargo: CargoWeighingDetailModel = new CargoWeighingDetailModel();
        cargo.documentInformationId = this.docId;
        cargo.flagCRUD = entry.flagCRUD;
        cargo.grossWeight = entry.grossWeight;
        cargo.netWeight = entry.netWeight;
        cargo.piece = entry.piece;
        cargo.skids = entry.skids;
        cargo.tareWeight = entry.tareWeight;
        cargo.uldNumber = entry.uldNumber;
        if (entry.intentory.length !== 0) {
          cargo.intentory = new Array<CargoWeighingDetailInventory>();
          for (const inventory of entry.intentory) {
            inventory.weight = this.weightPerPiece * inventory.piece;
            if (inventory.shc === "") {
              inventory.shc = []
            }
            cargo.intentory.push(inventory);
          }
        }
        this.newlyCreatedCargo.push(cargo);
      }
    }
    for (const entry of this.newlyCreatedCargo) {
      this.cargoDetailsRequest.push(entry);
    }
    this.packFetchedRows();
    this.tareWeightSetter();
    this.checkAllWeightPiece();
   
  }

  // This method is used to pack the Cargo Details from the table into appropriate model before sending to backend
  packFetchedRows() {
    for (const entry of this.serverFetchedRowsId) {
      // let tempHouse = new  Array<HouseInformationModel>();
      let tempInventory = new Array<CargoWeighingDetailInventory>();
      const tempDetail = new CargoWeighingDetailModel();
      tempInventory = entry.intentory;
      tempDetail.flagCRUD = entry.flagCRUD;
      tempDetail.autoWeighBupId = entry.autoWeighBupId;
      tempDetail.documentInformationId = entry.documentInformationId;
      tempDetail.grossWeight = entry.grossWeight;
      tempDetail.netWeight = entry.netWeight;
      tempDetail.piece = entry.piece;
      tempDetail.skids = entry.skids;
      tempDetail.tareWeight = entry.tareWeight;
      tempDetail.uldNumber = entry.uldNumber;
      tempDetail.weighingId = entry.weighingId;
      tempDetail.intentory = tempInventory;
      this.cargoDetailsRequest.push(tempDetail);
    }
    for (const entry of this.serverFetchedRowsNoId) {
      // let tempHouse = new  Array<HouseInformationModel>();
      let tempInventory = new Array<CargoWeighingDetailInventory>();
      const tempDetail = new CargoWeighingDetailModel();
      tempDetail.flagCRUD = entry.flagCRUD;
      tempInventory = entry.intentory;
      tempDetail.autoWeighBupId = entry.autoWeighBupId;
      tempDetail.documentInformationId = entry.documentInformationId;
      tempDetail.grossWeight = entry.grossWeight;
      tempDetail.netWeight = entry.netWeight;
      tempDetail.piece = entry.piece;
      tempDetail.skids = entry.skids;
      tempDetail.tareWeight = entry.tareWeight;
      tempDetail.uldNumber = entry.uldNumber;
      tempDetail.weighingId = entry.weighingId;
      tempDetail.intentory = tempInventory;
      this.cargoDetailsRequest.push(tempDetail);
    }
  }

  checkAllWeightPiece() {
    for (const entry of this.cargoDetailsRequest) {
      if (entry.intentory.length > 0) {

        for (const entry1 of entry.intentory) {
          if (entry.flagCRUD === 'D') {
            entry1.flagCRUD = 'D'
          }

          //   break;
        }
      }
      else {
        this.noLocationFlag = true;
        break;
      }
    }

  }


  onDelete(event, index) {
    (<NgcFormArray>this.weighingForm.controls['remarksArray']).deleteValueAt(index);
  }


  onChangeWeightAll() {
    let cargo: CargoWeighingServiceModel = new CargoWeighingServiceModel();
    let cargoWeighingDetails: any;
    //cargoWeighingDetails = (<NgcFormGroup>this.weighingForm.get('cargoDetailsArray')).getRawValue();
    cargoWeighingDetails = this.weighingForm.get(['cargoDetailsArray']);
    cargo.cargoWeighingDetailModel = cargoWeighingDetails.getRawValue();
    // cargo.cargoWeighingDetailModel = (<NgcFormGroup>this.weighingForm.get('cargoDetailsArray')).getRawValue();
    this.exportService.getProportionalWeight(cargo).subscribe(data => {
      if (data.data) {
        //  cargo.cargoWeighingDetailModel = data.data.cargoWeighingDetailModel;

        this.weighingForm.get('cargoDetailsArray').patchValue(data.data.cargoWeighingDetailModel);
      }

    });


  }


  onFinalizeWeight() {


    // variable initialization for request

    const cargo: CargoWeighingServiceModel = new CargoWeighingServiceModel();
    this.dimensionRequest = new Array<DimensionModel>();
    this.remarksRequest = new Array<WeighingRemarks>();
    this.newlyCreatedCargo = new Array<CargoWeighingDetailModel>();
    this.cargoDetailsRequest = new Array<CargoWeighingDetailModel>();

    // variable initialization for request


    cargo.documentInformationId = this.docId;
    cargo.eAcceptanceType = this.accType;
    this.greaterPieceFlag = false;
    this.greaterWeightFlag = false;
    this.noLocationFlag = false;
    this.greaterPFlag = false;
    this.greaterWFlag = false;
    this.detailsPieces = this.childPieces = 0;
    this.detailsWeight = this.childWeight = 0;
    let savesuccessflag = 0;
    let errormessage: any;
    if (this.weighingForm.get('cargoDetailsArray').invalid === true) {
      this.cargoIndicator = "error";
    } else {
      this.cargoIndicator = "";
    }
    if (this.weighingForm.controls['remarksArray']) {
      this.setRemarksRequest();
    }
    else
      this.showErrorStatus('expaccpt.provide.remarks');

    if (this.weighingForm.controls['dimensionActualArray']) {
      this.setDimensionRequest();
    } else {
      this.dimensionPieces = 0;
    }
    if (this.cargoIndicator === '') {
      if ((this.dimensionPieces <= this.totalPieces)) {
        if (this.remarksFlag) {
         
          cargo.dimension = this.dimensionRequest;
          cargo.remarks = this.remarksRequest;
          this.setCargoDetailsRequest();
          if (this.noLocationFlag === false) {

            cargo.cargoWeighingDetailModel = this.cargoDetailsRequest;


            cargo.cargoWeighingDetailModel = this.cargoDetailsRequest;


            cargo.cargoWeighingDetailModel.forEach(row => {
              let rowpiece = row.piece;
              let rowweight = row.grossWeight;
              let inventorypiece = 0;
              let inventoryweight = 0;
              row.intentory.forEach(inventory => {
                inventorypiece = inventorypiece + inventory.piece;
                inventoryweight = inventoryweight + inventory.actualWeight;
              })
              if (rowpiece < inventorypiece) {
               
                errormessage = "export.row.pieces.less.sum.inventory.pieces";
                savesuccessflag = 1;
              } else if (rowweight < inventoryweight) {
                errormessage = "export.gross.weight.less.sum.inventory.weight";
                savesuccessflag = 1;
              }
            });
            if (savesuccessflag) {
              this.showErrorMessage(errormessage);
            } else {



              const shipmentObj: ShipmentModel = new ShipmentModel();
              shipmentObj.shipmentNumber = this.weighingForm.get('awbNumber').value;

              shipmentObj.carrier = this.weighingForm.get('carrier').value;
              cargo.shipmentModel = shipmentObj;
              cargo.acceptedPieces = this.weighingForm.get('totalPieces').value;
              cargo.acceptedWeight = this.weighingForm.get('totalWeight').value;
              if (cargo.cargoWeighingDetailModel.length > 0) {
                cargo.paymentStatusFlag = this.paymentStatusFlag;
                cargo.shipmentModel.shipmentId = this.shipmentId;
                cargo.serviceNumber = this.serviceNumber;

                if (cargo.cargoWeighingDetailModel.length > 0) {
                  this.totalCargoPieces = 0;
                  this.totalCargoWeight = 0;
                  cargo.cargoWeighingDetailModel.forEach(ele => {

                    ele.intentory.forEach(element => {
                      this.totalCargoPieces = this.totalCargoPieces + element.piece;
                      this.totalCargoWeight = this.totalCargoWeight + element.actualWeight;
                    });

                  });

                }
                this.weightdiff = this.totalWeight - this.totalCargoWeight
                this.prefinalizesave = true;
                this.weighingForm.get('acceptedPieces').setValue(this.totalCargoPieces);
                this.weighingForm.get('acceptedWeight').setValue(this.totalCargoWeight);
                this.weighingForm.get('weightDifference').setValue(this.weightdiff);
                const lengthflag = (<NgcFormArray>this.weighingForm.get('cargoDetailsArray')).length;
                // if (lengthflag > 1) {
                //   this.onSave();
                // }


                if (this.totalCargoPieces != cargo.acceptedPieces) {

                  this.showConfirmMessage('export.total.cargo.pieces.not.equal.accepted.pieces').then(fulfilled => {
                    this.prefinalizeoperation(cargo);

                  }).catch(reason => {

                  });

                } else {
                  this.prefinalizeoperation(cargo);

                }


              } else {
                this.showWarningStatus('export.atleast.one.cargo.detail.required.to.save');
              }
            }



          } else {
            this.showWarningStatus('export.all.cargo.detail.must.have.atleast.one.location.details');
          }
        } else {
          this.showWarningStatus('export.enter.details.for.all.remarks');
        }
      } else {
        this.showWarningStatus('export.dimension.pieces.greater.than.total.pieces');
      }
    }
    else {
      this.showWarningStatus('export.cargo.details.incorrect');
    }
  }

  postFinalize(cargo: CargoWeighingServiceModel) {

    cargo.actualPieces = this.weighingForm.get('acceptedPieces').value;
    cargo.actualWeight = this.weighingForm.get('acceptedWeight').value;
    //    cargo.cargoWeighingDetailModel = this.weighingForm.get('cargoDetailsArray').value;
    this.exportService.onFinalize(cargo).subscribe(data => {
      let ruleexecution: any = data.data;
      if (data.messageList && data.messageList.length == 0) {

        if ((data.data == null
          || (data.data != null && data.data.cpeErrorFlag == false))) {
          if (data.success == true) {
            this.showSuccessStatus('g.operation.successful');
            this.startweighingflag = true;
            this.onSearch();
            this.finalizeFlag = true;
            this.weighingForm.get('ruleShipmentExecutionDetails').patchValue(ruleexecution.ruleShipmentExecutionDetails);
            let executionlist = this.weighingForm.get('ruleShipmentExecutionDetails');
            let execErrorList = executionlist.get('execErrorList');
            let execInfoList = executionlist.get('execInfoList');
            let execWarnList = executionlist.get('execWarnList');
            //if (execErrorList.value.length > 0 || execInfoList.value.length > 0 || execWarnList.value.length > 0) {
            if (execErrorList.value.length > 0 || execWarnList.value.length > 0 || execInfoList.value.length > 0) {
              //  if (execErrorList.status == "PENDING" || execWarnList.status == "PENDING" || execInfoList.status == "PENDING") {
              this.actionlistindicator = "error";
              //     }
            } else {
              this.actionlistindicator = "";
            }
            this.cpeacknowledgeflag = false;
          }
          else {
            //     this.onSearch();
            this.weighingForm.get('ruleShipmentExecutionDetails').patchValue(ruleexecution.ruleShipmentExecutionDetails);
            let executionlist = this.weighingForm.get('ruleShipmentExecutionDetails');
            let execErrorList = executionlist.get('execErrorList');
            let execInfoList = executionlist.get('execInfoList');
            let execWarnList = executionlist.get('execWarnList');
            //if (execErrorList.value.length > 0 || execInfoList.value.length > 0 || execWarnList.value.length > 0) {
            if (execErrorList.value.length > 0 || execWarnList.value.length > 0 || execInfoList.value.length > 0) {
              if (execErrorList.status == "PENDING" || execWarnList.status == "PENDING" || execInfoList.status == "PENDING") {
                this.actionlistindicator = "error";
              }
            } else {
              this.actionlistindicator = "";
            }
          }


        } else if ((data.data != null && data.data.cpeErrorFlag == true)) {
          this.onSearch();
          this.weighingForm.get('ruleShipmentExecutionDetails').patchValue(ruleexecution.ruleShipmentExecutionDetails);
          let executionlist = this.weighingForm.get('ruleShipmentExecutionDetails');
          let execErrorList = executionlist.get('execErrorList');
          let execInfoList = executionlist.get('execInfoList');
          let execWarnList = executionlist.get('execWarnList');

          if (execErrorList.value.length > 0 || execWarnList.value.length > 0 || execInfoList.value.length > 0) {

            this.actionlistindicator = "error";

          } else {
            this.actionlistindicator = "";

          }

          this.showErrorMessage(data.messageList[0].code);


        }



      } else {
        this.onSearch();
        //this.showErrorMessage(data.messageList[0].code);

        this.weighingForm.get('ruleShipmentExecutionDetails').patchValue(ruleexecution.ruleShipmentExecutionDetails);
        let executionlist = this.weighingForm.get('ruleShipmentExecutionDetails');
        let execErrorList = executionlist.get('execErrorList');
        let execInfoList = executionlist.get('execInfoList');
        let execWarnList = executionlist.get('execWarnList');
        //if (execErrorList.value.length > 0 || execInfoList.value.length > 0 || execWarnList.value.length > 0) {
        if (execErrorList.value.length > 0 || execWarnList.value.length > 0 || execInfoList.value.length > 0) {
          //     if (execErrorList.status == "PENDING" || execWarnList.status == "PENDING" || execInfoList.status == "PENDING") {
          this.actionlistindicator = "error";
          //         }
          //    if (cargo.cargoWeighingDetailModel.length > 0) {
          // cargo.flagCRUD = 'U';
          //    }
          //this.onSave();
        } else {
          this.actionlistindicator = "";

        }
      }

    });
  }

  prefinalizeoperation(cargo: CargoWeighingServiceModel) {

    this.exportService.chargecalculation(cargo).subscribe(data => {

      if (data.data == true) {

        this.exportService.paymentststatuscheck(cargo).subscribe(data => {
          if (data.data == true) {
            this.paymentStatusFlag = true;
          }
          else {
            this.paymentStatusFlag = false;
          }

          if (this.paymentStatusFlag == false) {
            this.showConfirmMessage('export.acceptance.charges.pending.confirmation').then(fulfilled => {
              cargo.paymentStatusFlag = true;
              this.postFinalize(cargo);
            }
            ).catch(reason => {

            });
          } else {
            cargo.paymentStatusFlag = true;
            this.postFinalize(cargo);
          }

        });

      }
    })
  }



  onSave() {

    const cargo: CargoWeighingServiceModel = new CargoWeighingServiceModel();
    this.dimensionRequest = new Array<DimensionModel>();
    this.remarksRequest = new Array<WeighingRemarks>();
    this.newlyCreatedCargo = new Array<CargoWeighingDetailModel>();
    this.cargoDetailsRequest = new Array<CargoWeighingDetailModel>();
    let savesuccessflag = 0;
    let errormessage: any;
    cargo.eAcceptanceType = this.accType;




    cargo.acceptedPieces = this.weighingForm.get('totalPieces').value;
    cargo.acceptedWeight = this.weighingForm.get('totalWeight').value;





    this.dimensionArray = (Array)(this.weighingForm.controls['dimensionFwbArray']);
    cargo.documentInformationId = this.docId;
    // cargo.weighingstarttime = this.weighingstarttime;
    this.greaterPieceFlag = false;
    this.greaterWeightFlag = false;
    this.noLocationFlag = false;
    this.greaterPFlag = false;
    this.greaterWFlag = false;
    this.detailsPieces = this.childPieces = 0;
    this.detailsWeight = this.childWeight = 0;



    if (this.weighingForm.get('cargoDetailsArray').invalid === true) {
      this.cargoIndicator = "error";
    } else {
      this.cargoIndicator = "";
    }
    if (this.weighingForm.controls['remarksArray']) {
      this.setRemarksRequest();
    } else {
      this.showErrorStatus('expaccpt.provide.remarks');
    }
    if ((<NgcFormArray>this.weighingForm.controls['dimensionActualArray']).length > 0) {
      this.setDimensionRequest();
    }
    else {
      this.dimensionPieces = 0;
    }
    if (this.cargoIndicator === '') {
      if ((this.dimensionPieces <= this.totalPieces)) {
        if (this.remarksFlag) {
        
          cargo.dimension = this.dimensionRequest;
          cargo.remarks = this.remarksRequest;
          this.setCargoDetailsRequest();
          if (this.noLocationFlag === false) {

            cargo.cargoWeighingDetailModel = this.cargoDetailsRequest;


            cargo.cargoWeighingDetailModel.forEach(row => {
              let rowpiece = row.piece;
              let rowweight = row.grossWeight;
              let inventorypiece = 0;
              let inventoryweight = 0;
              row.intentory.forEach(inventory => {
                inventorypiece = inventorypiece + inventory.piece;
                inventoryweight = inventoryweight + inventory.actualWeight;
              })
              if (rowpiece < inventorypiece) {
                errormessage = "export.row.pieces.less.sum.inventory.pieces";
                savesuccessflag = 1;
              } else if (rowweight < inventoryweight) {
                errormessage = "export.gross.weight.less.sum.inventory.weight";
                savesuccessflag = 1;
              }
            });
            if (savesuccessflag) {
              this.showErrorMessage(errormessage);
            } else {


              const shipmentObj: ShipmentModel = new ShipmentModel();
              shipmentObj.shipmentNumber = this.weighingForm.get('awbNumber').value;
              cargo.shipmentModel = shipmentObj;
              cargo.acceptedPieces = this.weighingForm.get('totalPieces').value;
              cargo.acceptedWeight = this.weighingForm.get('totalWeight').value;

              cargo.requestedTemperatureRange = this.weighingForm.get('requestedTemperatureRange').value;
              if (cargo.cargoWeighingDetailModel.length > 0) {
                this.totalCargoPieces = 0;
                cargo.cargoWeighingDetailModel.forEach(ele => {
                  this.totalCargoPieces = this.totalCargoPieces + ele.piece;
                });
                if (this.totalCargoPieces > cargo.acceptedPieces && this.prefinalizesave == false) {


                  this.showConfirmMessage('export.total.cargo.pieces.greater.than.accepted.pieces').then(fulfilled => {
                    cargo.requestedTemperatureRange = this.weighingForm.get('requestedTemperatureRange').value;

                    this.exportService.onSaveWeighing(cargo).subscribe(data => {
                      this.showFormErrorMessages(data);
                      if (data.success) {
                        if (this.prefinalizesave == false) {
                          this.showSuccessStatus('g.operation.successful');
                          this.onSearch();
                        }

                      }
                    });

                  }
                  ).catch(reason => { });

                }
                else {
                  this.exportService.onSaveWeighing(cargo).subscribe(data => {
                    this.showFormErrorMessages(data);
                    if (data.success) {
                      if (this.prefinalizesave == false) {
                        this.showSuccessStatus('g.operation.successful');
                        this.onSearch();
                      }
                    }
                  });
                }
              } else {
                this.showWarningStatus('export.atleast.one.cargo.detail.required.to.save');
              }

            }

          } else {
            this.showWarningStatus('export.all.cargo.detail.must.have.atleast.one.location.details');
          }
        } else {
          this.showWarningStatus('export.enter.details.for.all.remarks');
        }
      } else {
        this.showWarningStatus('export.dimension.pieces.greater.than.total.pieces');
      }
    } else {
      this.showWarningStatus('export.cargo.details.incorrect');
    }
  }




  onPartConfirm() {
    const cargo: CargoWeighingServiceModel = new CargoWeighingServiceModel();
    this.dimensionRequest = new Array<DimensionModel>();
    this.remarksRequest = new Array<WeighingRemarks>();
    this.newlyCreatedCargo = new Array<CargoWeighingDetailModel>();
    this.cargoDetailsRequest = new Array<CargoWeighingDetailModel>();
    cargo.documentInformationId = this.docId;
    this.greaterPieceFlag = false;
    this.greaterWeightFlag = false;
    this.noLocationFlag = false;
    this.greaterPFlag = false;
    this.greaterWFlag = false;
    this.detailsPieces = this.childPieces = 0;
    this.detailsWeight = this.childWeight = 0;
    if (this.weighingForm.get('cargoDetailsArray').invalid === true) {
      this.cargoIndicator = "error";
    } else {
      this.cargoIndicator = "";
    }
    if (this.weighingForm.controls['remarksArray']) {
      this.setRemarksRequest();
    }
    else
      this.showErrorStatus('expaccpt.provide.remarks');

    if (this.weighingForm.controls['dimensionActualArray']) {
      this.setDimensionRequest();
    } else {
      this.dimensionPieces = 0;
    }
    if (this.cargoIndicator === '') {
      if ((this.dimensionPieces <= this.totalPieces)) {
        if (this.remarksFlag) {
        
          cargo.dimension = this.dimensionRequest;
          cargo.remarks = this.remarksRequest;
          this.setCargoDetailsRequest();
          if (this.noLocationFlag === false) {

            cargo.cargoWeighingDetailModel = this.cargoDetailsRequest;
            const shipmentObj: ShipmentModel = new ShipmentModel();
            shipmentObj.shipmentNumber = this.weighingForm.get('awbNumber').value;
            cargo.shipmentModel = shipmentObj;
            cargo.acceptedPieces = this.weighingForm.get('totalPieces').value;
            cargo.acceptedWeight = this.weighingForm.get('totalWeight').value;
            if (cargo.cargoWeighingDetailModel.length > 0) {
              
              this.exportService.onPart(cargo).subscribe(data => {
                this.showFormErrorMessages(data);
                this.showSuccessStatus('g.operation.successful');
                this.onSearch();
              });
            } else {
              this.showWarningStatus('export.atleast.one.cargo.detail.required.to.save');
            }

          } else {
            this.showWarningStatus('export.all.cargo.detail.must.have.atleast.one.location.details');
          }
        } else {
          this.showWarningStatus('export.enter.details.for.all.remarks');
        }
      } else {
        this.showWarningStatus('export.dimension.pieces.greater.than.total.pieces');
      }
    } else {
      this.showWarningStatus('export.cargo.details.incorrect');
    }
  }

  /**
  * This function is responsible for adding new record to Cargo Details
  */
  onAddRow() {
    (<NgcFormArray>this.weighingForm.get('cargoDetailsArray')).addValue([
      {
        sno: '',
        grossWeight: '0.0',
        piece: '0',
        netWeight: '0.0',
        uldNumber: '',
        tareWeight: '0.0',
        skids: '0',
        dryIceWeight: '0.0',
        user: '',
        dateTime: '',
        intentory: [
          {
            shipmentLocation: '',
            piece: '0',
            weight: '0.0',
            warehouseLocation: '',
            dryIceWeight: '0.0',
            shc: null,
            actualWeight: '0.0'
          }
        ]
      }
    ]);
  }

  /**
  * This function is responsible for adding new record to Cargo Details Inventory
  */
  onAddLocation(index: any) {
    (<NgcFormArray>this.weighingForm.get(['cargoDetailsArray', index, 'intentory'])).addValue([
      {
        shipmentLocation: '',
        piece: '0',
        weight: '0.0',
        warehouseLocation: '',
        dryIceWeight: '0.0',
        shc: null,
        actualWeight: '0.0'
      }
    ]);
  }

  onEditRow(index) {
    const updatedRow: NgcFormGroup = (Object)(<NgcFormArray>this.weighingForm.get(['cargoDetailsArray', index]));

  }

  onEditLocation(index, subIndex) {

    const updatedLocation: NgcFormGroup
      = (Object)(<NgcFormGroup>this.weighingForm.get(['cargoDetailsArray', index, 'intentory', subIndex]));
  }

  onDeleteLocation(index, subIndex) {
    const parentElementdata =
      (<NgcFormGroup>this.weighingForm.get(['cargoDetailsArray', index])).getRawValue();
    const childElementdata =
      (<NgcFormGroup>this.weighingForm.get(['cargoDetailsArray', index, 'intentory', subIndex])).getRawValue();
    if ('shipmentInventoryId' in childElementdata) {
      if ('weighingId' in parentElementdata) {
        if (parentElementdata.weighingId !== 0) {
          childElementdata.flagCRUD = 'D';
          childElementdata.weight = Math.floor(childElementdata.actualWeight);
        
          for (const entry of this.serverFetchedRowsId) {
            if (entry.weighingId === parentElementdata.weighingId) {
              entry.intentory.push(childElementdata);
            }
          }
        }
      }
    }
    (<NgcFormArray>this.weighingForm.get(['cargoDetailsArray', index, 'intentory'])).deleteValueAt(subIndex);
  }

  onDeleteRow(index) {
    const parentElementdata =
      (<NgcFormGroup>this.weighingForm.get(['cargoDetailsArray', index])).getRawValue();
    if ('weighingId' in parentElementdata && parentElementdata.weighingId !== 0) {
      for (const entry of this.serverFetchedRowsId) {
        if (entry.weighingId === parentElementdata.weighingId) {
          entry.flagCRUD = 'D';
          entry.intentory = parentElementdata.intentory;
        }
      }
    }
    if ('autoWeighBupId' in parentElementdata && parentElementdata.autoWeighBupId !== 0) {
      for (const entry of this.serverFetchedRowsNoId) {
        if (entry.autoWeighBupId === parentElementdata.autoWeighBupId) {
          entry.flagCRUD = 'D';
        }
      }
    }
    (<NgcFormArray>this.weighingForm.get(['cargoDetailsArray'])).removeAt(index);
  }

  onDeleteDimension(index) {
    (<NgcFormArray>this.weighingForm.get(['dimensionActualArray'])).removeAt(index);
    this.totalDimensionPieces = 0;
    this.totalDimensionWeight = 0;

  }

  onGetDimension(index) {
    if (this.weighingForm.get(['dimensionActualArray', index]) != null) {
      const lineItem = (<NgcFormGroup>this.weighingForm.get(['dimensionActualArray', index])).getRawValue();
      if (lineItem.length !== 0 && lineItem.length !== '' && lineItem.width !== 0 && lineItem.width !== '' &&
        lineItem.height !== 0 && lineItem.height !== '' && lineItem.pcs !== 0 && lineItem.pcs !== '') {
        this.totalDimensionPieces = 0;
        this.totalDimensionWeight = 0;
        const volume = (+(lineItem.length)) * (+(lineItem.width)) * (+(lineItem.height)) * (+(lineItem.pcs));
        (<NgcFormControl>this.weighingForm.get(['dimensionActualArray', index, 'volumeWeight'])).setValue((volume));


        //backend call to calculate volumetric weight

        const dimension: Dimention = new Dimention();
        if (this.weighingForm.get('cmtButton').value) {
          dimension.unitCode = 'CMT';
        } else {
          dimension.unitCode = 'INH';
        }
        if (this.weighingForm.get('mcButton').value) {
          dimension.volumeCode = 'MC';
        } else {
          dimension.volumeCode = 'CF';
        }
        dimension.weightCode = 'K';
        if (this.weighingForm.get('densityCode').value) {
          dimension.dg = this.weighingForm.get('densityCode').value;
        }
        dimension.shipmentPcs = this.totalPieces;
        dimension.shipmentWeight = this.totalWeight;
        const dimensionList = (<NgcFormArray>this.weighingForm.get('dimensionActualArray')).getRawValue();
        dimensionList.forEach(ele => {
          ele.pcs = ele.piece
        })
        dimension.dimensionDetails = dimensionList;
       


        this.exportService.getVolumetricWeight(dimension).subscribe(data => {
          if (data) {
            let dimensionres: any;
            dimensionres = data;
            if (dimensionres.data != null) {
              this.weighingForm.get(['dimensionActualArray', index, 'volumeWeight']).setValue(dimensionres.dimensionDetails[index].volume);
            }

            this.volumetricweight = dimensionres.volumetricWeight;
            this.reSum();
          }
        });


      } else {
        this.showErrorStatus('export.dimensions.not.calculated');
      }
    }
  }

  reSum() {
    this.totalVolPieces = 0;
    this.totalVolWeight = 0;
    this.totalVolWeightFinal = 0;
    for (const entry of (<NgcFormGroup>this.weighingForm.get(['dimensionActualArray'])).getRawValue()) {
      this.totalVolPieces += entry.piece;
      this.totalVolWeight += entry.volumeWeight;
      this.totalVolWeightFinal = this.volumetricweight;

    }
    if (this.totalVolWeightFinal > this.weighingForm.value.acceptedWeight) {
      this.showWarningMessage("export.volumetric.weight.greater.than.accepted.weight");
    }

    this.weighingForm.get('totalVolumetricPieces').setValue(this.totalVolPieces);
    this.weighingForm.get('totalVolumetricWeight').setValue(this.totalVolWeight);
    this.weighingForm.get('totalVolWeight').setValue(this.totalVolWeightFinal);


  }

  onOpenTagsInfo(event, index, subIndex) {
    this.houseIndex = index;
    this.houseSubIndex = subIndex;
    if ((<NgcFormArray>this.weighingForm.get(['cargoDetailsArray', index, 'intentory', subIndex, 'house'])).length > 0) {
      this.weighingForm.controls.houseTagsInfo =
        (<NgcFormArray>this.weighingForm.get(['cargoDetailsArray', index, 'intentory', subIndex, 'house']));
    }
    else {
      const fetchHouse: HouseInformationModel = new HouseInformationModel();
      fetchHouse.documentInformationId = this.docId;
      this.exportService.onOpenTagsInfo(fetchHouse).subscribe(data => {
      
      });
    }
    this.tagsWindow.open();
  }

  onCloseWindow(event) {
    (<NgcFormArray>this.weighingForm.get(['cargoDetailsArray', this.houseIndex, 'intentory', this.houseSubIndex, 'house'])).patchValue((<NgcFormArray>this.weighingForm.controls.houseTagsInfo).getRawValue());
  }

  // Set initial arrays for Cargo Details without ID and with ID
  setFetchedArrays() {
    for (let index = 0; index < this.cargoWeighingDetailList.length; index++) {
      const parentElementdata = this.cargoWeighingDetailList[index];
      if (parentElementdata.weighingId === 0) {
        parentElementdata.intentory = new Array();
        this.serverFetchedRowsNoId.push(parentElementdata);
      }
      if (parentElementdata.autoWeighBupId === 0) {
        parentElementdata.intentory = new Array();
        this.serverFetchedRowsId.push(parentElementdata);
      }
    }
  }

  setAcceptedData() {
    if (this.serverFetchedRowsId != null) {
      for (const entry of this.serverFetchedRowsId) {
        this.acceptedPieces += entry.piece;
        this.acceptedWeight += entry.grossWeight;
      }
    } else {
      this.acceptedPieces = 0;
      this.acceptedWeight = 0;
    }
    this.weighingForm.get('acceptedPieces').patchValue(this.totalgrosspieces);
    this.weighingForm.get('totalPieces').patchValue(this.totalPieces);
    this.weighingForm.get('acceptedWeight').patchValue(this.totalgrossweight);
    this.weighingForm.get('totalWeight').patchValue(this.totalWeight);
    this.weighingForm.get('weightDifference').patchValue(this.weightdiff);

  }

  setDropdown() {
    this.awbDropdown = new Array<string>();
    if (this.resp.awbList.length > 0) {
      for (const entry of this.resp.awbList) {
        this.awbDropdown.push(entry.shipmentNumber);
      }
    }
  }

  onSelectAWB(event) {
    this.weighingForm.get('awbNumber').setValue(event);

  }

  setTotalDimensionDetails() {
    for (const entry of this.dimensionList) {
      this.totalDimensionPieces += entry.piece;
      this.totalDimensionWeight += entry.volumeWeight;
    }

  }

  onBackToSummary() {
    const awbNumber = this.weighingForm.get('awbNumber').value;
    this.navigateTo(this.router, 'export/acceptance/managecargoacceptance', awbNumber);
  }

  enablePartButton() {
    if (this.resp.part >= 1) {
      return false;
    } else {
      return true;
    }
  }

  enableFinalizeButton() {
    if (this.resp.finalize) {
      this.finalizeFlag = true;
      return true;
    } else {
      this.finalizeFlag = false;
      return false;
    }
  }

  disableOnFinalize() {
    if (this.resp.finalize === 1) {
      this.weighingForm.disable();
      this.weighingForm.get('awbNumber').enable();
      this.weighingForm.get('awbList').enable();
      this.omegaDisabler = true;

    }
  }

  tareWeightSetter() {
    for (const entry of this.cargoDetailsRequest) {
      if (entry.tareWeight === null || entry.tareWeight === 0) {
        entry.tareWeight = 0.0;
      }
      for (const iter of entry.intentory) {
        if (iter.dryIceWeight === null) {
          iter.dryIceWeight = 0.0;
        }
      }
    }
  }


  onResumeAcceptance() {
    const cargo: CargoWeighingServiceModel = new CargoWeighingServiceModel();
    this.dimensionRequest = new Array<DimensionModel>();
    this.remarksRequest = new Array<WeighingRemarks>();
    this.newlyCreatedCargo = new Array<CargoWeighingDetailModel>();
    this.cargoDetailsRequest = new Array<CargoWeighingDetailModel>();
    cargo.documentInformationId = this.docId;
    this.greaterPieceFlag = false;
    this.greaterWeightFlag = false;
    this.noLocationFlag = false;
    this.greaterPFlag = false;
    this.greaterWFlag = false;
    this.detailsPieces = this.childPieces = 0;
    this.detailsWeight = this.childWeight = 0;
    cargo.dimension = this.dimensionRequest;
    cargo.remarks = this.remarksRequest;
    this.setCargoDetailsRequest();
    cargo.cargoWeighingDetailModel = this.cargoDetailsRequest;
    const shipmentObj: ShipmentModel = new ShipmentModel();
    shipmentObj.shipmentNumber = this.weighingForm.get('awbNumber').value;
    cargo.shipmentModel = shipmentObj;
    cargo.acceptedPieces = this.weighingForm.get('totalPieces').value;
    cargo.acceptedWeight = this.weighingForm.get('totalWeight').value;
    this.exportService.onResume(cargo).subscribe(data => {
      this.showFormErrorMessages(data);
      this.showSuccessStatus('g.operation.successful');
      this.onSearch();
    });

  }

  onDelayAcceptance() {
    const cargo: CargoWeighingServiceModel = new CargoWeighingServiceModel();
    this.dimensionRequest = new Array<DimensionModel>();
    this.remarksRequest = new Array<WeighingRemarks>();
    this.newlyCreatedCargo = new Array<CargoWeighingDetailModel>();
    this.cargoDetailsRequest = new Array<CargoWeighingDetailModel>();
    cargo.documentInformationId = this.docId;
    this.greaterPieceFlag = false;
    this.greaterWeightFlag = false;
    this.noLocationFlag = false;
    this.greaterPFlag = false;
    this.greaterWFlag = false;
    this.detailsPieces = this.childPieces = 0;
    this.detailsWeight = this.childWeight = 0;
    if (this.weighingForm.get('cargoDetailsArray').invalid === true) {
      this.cargoIndicator = "error";
    } else {
      this.cargoIndicator = "";
    }
    if (this.weighingForm.controls['remarksArray']) {
      this.setRemarksRequest();
    }
    else
      this.showErrorStatus('expaccpt.provide.remarks');

    if (this.weighingForm.controls['dimensionActualArray']) {
      this.setDimensionRequest();
    } else {
      this.dimensionPieces = 0;
    }
    if (this.cargoIndicator === '') {
      if ((this.dimensionPieces <= this.totalPieces)) {
        if (this.remarksFlag) {
         
          cargo.dimension = this.dimensionRequest;
          cargo.remarks = this.remarksRequest;
          this.setCargoDetailsRequest();
          if (this.noLocationFlag === false) {

            cargo.cargoWeighingDetailModel = this.cargoDetailsRequest;
            const shipmentObj: ShipmentModel = new ShipmentModel();
            shipmentObj.shipmentNumber = this.weighingForm.get('awbNumber').value;
            cargo.shipmentModel = shipmentObj;
            cargo.acceptedPieces = this.weighingForm.get('totalPieces').value;
            cargo.acceptedWeight = this.weighingForm.get('totalWeight').value;
            if (cargo.cargoWeighingDetailModel.length > 0) {
              this.exportService.onDelay(cargo).subscribe(data => {
                this.showFormErrorMessages(data);
                this.showSuccessStatus('g.operation.successful');
                this.onSearch();
              });
            } else {
              this.showWarningStatus('export.atleast.one.cargo.detail.required.to.save');
            }

          } else {
            this.showWarningStatus('export.all.cargo.detail.must.have.atleast.one.location.details');
          }
        } else {
          this.showWarningStatus('export.enter.details.for.all.remarks');
        }
      } else {
        this.showWarningStatus('export.dimension.pieces.greater.than.total.pieces');
      }
    } else {
      this.showWarningStatus('export.cargo.details.incorrect');
    }
  }

  changeModel(event, column, dimension: NgcFormGroup, index) {
    if (dimension.get('piece').value !== null && dimension.get('length').value !== null
      && dimension.get('width').value !== null && dimension.get('height').value !== null) {
      this.setDimensionValues();
    }
  }

  setDimensionValues() {
    const dimension: Dimention = new Dimention();
    if (this.weighingForm.get('cmtButton').value) {
      dimension.unitCode = 'CMT';
    } else {
      dimension.unitCode = 'INH';
    }
    if (this.weighingForm.get('mcButton').value) {
      dimension.volumeCode = 'MC';
    } else {
      dimension.volumeCode = 'CF';
    }
    dimension.weightCode = 'KG';
    if (this.weighingForm.get('densityCode').value) {
      dimension.dg = this.weighingForm.get('densityCode').value;
    }
    dimension.shipmentPcs = this.totalPieces;
    dimension.shipmentWeight = this.totalWeight;
    const dimensionList = (<NgcFormArray>this.weighingForm.get('dimensionActualArray')).getRawValue();
  }

  // On selection of Start Weight Button Disabling weighingScaleId
  onStartWeighingSelect = false;
  onStartWeighing(event) {
    this.onStartWeighingSelect = true;

    const cargo: CargoWeighingServiceModel = new CargoWeighingServiceModel();
    const shipmentObj: ShipmentModel = new ShipmentModel();

    shipmentObj.shipmentNumber = this.weighingForm.get('awbNumber').value;



    if (shipmentObj.shipmentNumber) {
      cargo.shipmentModel = shipmentObj;
    }


    this.exportService.onStartWeighingCustomCheck(cargo).subscribe(data => {
      let resp1: any = data.data;
      if (resp1 != null && resp1.ruleShipmentExecutionDetails != null && resp1.ruleShipmentExecutionDetails.execErrorList.length > 0
        && resp1.ruleShipmentExecutionDetails.execErrorList[0].status == "PENDING") {
        this.showErrorMessage(resp1.ruleShipmentExecutionDetails.execErrorList[0].failureMessage);
      } else {
        let weighingtimemodel: weighingTimeModel = new weighingTimeModel();
        this.startweighingflag = true;


        this.weighingstarttime = Date.now();
        weighingtimemodel.shipmentNumber = this.weighingForm.get('awbNumber').value;

        this.exportService.onSaveWeighingStartTime(cargo).subscribe(data => {
          if (data.data) {

            this.weighingForm.get('weigingstartdate').patchValue(new Date());
            this.showSuccessStatus("export.operation.started");
            this.startWeighingDisabler = true;

          }
        });
      }

    })

  }



  onChangeNetWeight(netweight, index, item) {
   

  }
  onChangeGrossWeight(grossweight, index, item) {
    if (grossweight != undefined && grossweight > 0) {
      this.weighingForm.get(['cargoDetailsArray', index, 'netWeight']).setValue(grossweight - (item.value.tareWeight * item.value.skids));
    }
    // this.onChangeWeightAll();
  }




  onChangeWeight(pieceValue, index, subitem, item) {
  }

  onChange(pieceValue, index, subitem, item) {
   
    if (pieceValue != null) {


      this.invntoryweightsum = 0;
      this.inventorypieces = 0;
      item.controls.intentory.controls.forEach(element => {

        this.invntoryweightsum = this.invntoryweightsum + element.value.actualWeight;
        this.inventorypieces = this.inventorypieces + element.value.piece;

      });

      this.invntoryweightsum = this.invntoryweightsum - subitem.get('actualWeight').value
      this.inventorypieces = this.inventorypieces - pieceValue;

      var sumdiff = this.invntoryweightsum - item.get('netWeight').value;


      if (sumdiff > 0) {
        this.showErrorMessage("export.entered.weight.greater.total.weight");
      } else {
        sumdiff = -sumdiff;
      }

      //var updatednetweight = item.get('netWeight').value - (sumdiff);
      var actualweight = (sumdiff / (item.get('piece').value - this.inventorypieces) * pieceValue)

      //If the total sum of pieces is equal to declared pieces
      //then along proportionate weight + add up the remaining weight
      //if (this.inventorypieces == ){

      //}
      if (actualweight >= 0) {
        subitem.get('actualWeight').setValue(parseFloat(actualweight.toString()));
      } else {
        this.showErrorStatus("export.tare.weight.cannot.greater.gross.weight");
      }
    }



  }

  unfinalizeShipment() {
    const cargo: CargoWeighingServiceModel = new CargoWeighingServiceModel();
    const shipmentObj: ShipmentModel = new ShipmentModel();
    shipmentObj.shipmentNumber = this.weighingForm.get('awbNumber').value;
    cargo.shipmentModel = shipmentObj;
    this.exportService.unfinalizeShipment(cargo).subscribe(data => {
      if (data.data != null) {
        this.prefinalizesave = false;
        this.showSuccessStatus('g.operation.successful');
        this.onSearch();
      } else if (data.messageList != null) {
        this.refreshFormMessages(data);
      }


    });
  }

  onCloseFailureData() {
    const requestCloseFailure = (<NgcFormGroup>this.weighingForm.get('ruleShipmentExecutionDetails')).getRawValue();
    this._acceptanceService.onCloseFailureData(requestCloseFailure).subscribe(response => {
      this.showResponseErrorMessages(response);
      if (!response.messageList) {
        this.showSuccessStatus('g.completed.successfully');
        //Research the data
        // this.onSearch();
      } else {
        const errors = response.messageList;
        this.showErrorStatus(errors[0].message);
      }
    });
    this.cpeacknowledgeflag = true;
  }

  onReturnDocument() {
    this.navigateTo(this.router, '/export/acceptance/rejectshipment',
      this.weighingForm.get('awbNumber').value);
  }

  onECC() {
    const cargo: CargoWeighingServiceModel = new CargoWeighingServiceModel();
    this.dimensionRequest = new Array<DimensionModel>();
    this.remarksRequest = new Array<WeighingRemarks>();
    this.newlyCreatedCargo = new Array<CargoWeighingDetailModel>();
    this.cargoDetailsRequest = new Array<CargoWeighingDetailModel>();
    cargo.documentInformationId = this.docId;

    this.greaterPieceFlag = false;
    this.greaterWeightFlag = false;
    this.noLocationFlag = false;
    this.greaterPFlag = false;
    this.greaterWFlag = false;
    this.detailsPieces = this.childPieces = 0;
    this.detailsWeight = this.childWeight = 0;
    if (this.weighingForm.get('cargoDetailsArray').invalid === true) {
      this.cargoIndicator = "error";
    } else {
      this.cargoIndicator = "";
    }
    if (this.weighingForm.controls['remarksArray']) {
      this.setRemarksRequest();
    }
    else
      this.showErrorStatus('expaccpt.provide.remarks');

    if (this.weighingForm.controls['dimensionActualArray']) {
      this.setDimensionRequest();
    } else {
      this.dimensionPieces = 0;
    }
    if (this.cargoIndicator === '') {
      if ((this.dimensionPieces <= this.totalPieces)) {
        if (this.remarksFlag) {
         
          cargo.dimension = this.dimensionRequest;
          cargo.remarks = this.remarksRequest;
          this.setCargoDetailsRequest();
          if (this.noLocationFlag === false) {

            cargo.cargoWeighingDetailModel = this.cargoDetailsRequest;
            const shipmentObj: ShipmentModel = new ShipmentModel();
            shipmentObj.shipmentNumber = this.weighingForm.get('awbNumber').value;
            shipmentObj.shipmentId = this.shipmentId;
            cargo.shipmentModel = shipmentObj;
            cargo.acceptedPieces = this.weighingForm.get('totalPieces').value;
            cargo.acceptedWeight = this.weighingForm.get('totalWeight').value;
            if (cargo.cargoWeighingDetailModel.length > 0) {
              cargo.paymentStatusFlag = true;
              this.exportService.eccFinalize(cargo).subscribe(data => {
                this.showFormErrorMessages(data);
                if (!data.messageList) {
                  this.showSuccessStatus('g.operation.successful');
                }

              });
            } else {
              this.showWarningStatus('export.atleast.one.cargo.detail.required.to.save');
            }

          } else {
            this.showWarningStatus('export.all.cargo.detail.must.have.atleast.one.location.details');
          }
        } else {
          this.showWarningStatus('export.enter.details.for.all.remarks');
        }
      } else {
        this.showWarningStatus('export.dimension.pieces.greater.than.total.pieces');
      }
    }
    else {
      this.showWarningStatus('export.cargo.details.incorrect');
    }
  }

  onSelectScale(event) {
    this.weighingScaleData = event.parameter1;
  }

  onGetWeight(event, index) {
    let request: WeighingScaleRequest = new WeighingScaleRequest();
    if (this.weighingScaleData != undefined && this.weighingScaleData != null) {
      const tempDetails = this.weighingScaleData.split(':');
      request.wscaleIP = tempDetails[0];

      request.wscalePort = tempDetails[1];
      this.exportService.getWeightInformation(request).subscribe(response => {
        this.refreshFormMessages(response);
        if (response.data !== null && response.data !== "") {
          this.weighingForm.get(['cargoDetailsArray', index, 'grossWeight']).setValue(response.data);
          this.showReadOnlyWeight = true;
          this.addWeight = false;
        } else {
          this.weighingForm.get(['cargoDetailsArray', index, 'grossWeight']).setValue(0.0);
          this.showReadOnlyWeight = false;
          this.addWeight = true;
        }
      })
    }
  }

  onPrintViewingSlip() {
    this.reportParameters = new Object();
     this.reportParameters.shipmentNumber = this.weighingForm.get('shipmentModel').get('shipmentNumber').value
    this.reportParameters.shipmentdate = this.weighingForm.get('shipmentModel').get('shipmentDate').value
    this.reportWindow.open();
  }

  onChangeULD(event, index) {
    if (this.searchDone) {
      const cargo: CargoWeighingDetailModel = new CargoWeighingDetailModel();
      cargo.uldNumber = event;

      this.exportService.pullULDBUP(cargo).subscribe((data) => {
        this.showFormErrorMessages(data);
        if (data.success) {
          (this.weighingForm.get(['cargoDetailsArray', index, 'tareWeight'])).patchValue(data.data.tareWeight);
          (this.weighingForm.get(['cargoDetailsArray', index, 'grossWeight'])).patchValue(data.data.grossWeight);
          (this.weighingForm.get(['cargoDetailsArray', index, 'netWeight'])).patchValue(data.data.netWeight);
        }
      });
    }
  }

  onChangeSkid(event, index) {
    const tare = this.weighingForm.get(['cargoDetailsArray', index, 'tareWeight']).value;
    const gross = this.weighingForm.get(['cargoDetailsArray', index, 'grossWeight']).value;
    if (event != undefined && event > 0) {
      this.weighingForm.get(['cargoDetailsArray', index, 'netWeight']).setValue(gross - (tare * event));
    } else {
      this.weighingForm.get(['cargoDetailsArray', index, 'netWeight']).setValue(gross - (tare));
    }
    this.weighingForm.get(['cargoDetailsArray', index, 'intentory']).setValue(gross - (tare));
  }

  onChangeTare(event, index) {
    const skids = this.weighingForm.get(['cargoDetailsArray', index, 'skids']).value;
    const gross = this.weighingForm.get(['cargoDetailsArray', index, 'grossWeight']).value;
    if (skids != undefined && skids > 0) {
      this.weighingForm.get(['cargoDetailsArray', index, 'netWeight']).setValue(gross - (skids * event));
    } else {
      this.weighingForm.get(['cargoDetailsArray', index, 'netWeight']).setValue(gross - (event));
    }

  }

  onCancel(event) {
    this.navigateTo(this.router, '/', null);
  }

  onClear(event) {
    this.displayFlag = false;
    this.weighingForm.reset();
  }
  onClickFlightPlanner() {
    this.navigateTo(this.router, '/export/planning-list', {});
  }
}