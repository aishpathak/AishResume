import { Validators } from '@angular/forms';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcUtility,
  PageConfiguration
} from 'ngc-framework';
import { MaintainSSPDModel, ShipmentInventory, HouseInformationModel, UnloadShipment } from './../export.sharedmodel';
import { ExportService } from './../export.service';
import { ApplicationFeatures } from '../../common/applicationfeatures';

@Component({
  selector: 'ngc-maintain-sspd',
  templateUrl: './maintain-sspd.component.html',
  styleUrls: ['./maintain-sspd.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class MaintainSspdComponent extends NgcPage implements OnInit {
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  resp: any;
  dispArray: any[] = [];
  displayFlag = false;
  tagSelection: any[] = [];
  shipId: any;
  invArray: any[] = [];
  pieceFlag = false;
  zeroFlag = false;
  totalPieceFlag = false;
  uldArray: any[] = [];
  shc: any[] = [];
  house: any[] = [];
  showUldFlag: boolean = false;
  origin: string;
  destination: string;
  builtTotalPieces: number;
  builtTotalWeight: number;
  validSuccessFlag: boolean = false;
  suffixDropDownSourceId: string;
  partSuffixDetailList: any;
  partShowFlag = false;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private exportService: ExportService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  private sspdForm: NgcFormGroup = new NgcFormGroup({
    awbNumber: new NgcFormControl(),
    awbNo: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(new Date()),
    shipmentPieces: new NgcFormControl(),
    shipmentDate: new NgcFormControl(),
    shipmentWeight: new NgcFormControl(),
    flight: new NgcFormControl(),
    date: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    shipmentDetails: new NgcFormArray([]),
    builtTotalPieces: new NgcFormControl(),
    builtTotalWeight: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    partSuffix: new NgcFormControl()
  });

  ngOnInit() {
  }
  onselectUldNumber(uldNumber) {
    if (uldNumber) {
      if (this.sspdForm.get('shipmentDetails').value && this.sspdForm.get('shipmentDetails').value.length > 0) {
        this.showErrorMessage("export.delete.locations.before.changing.uld");
        return;
      } else {
        let sspdObject = this.sspdForm.getRawValue();
        let requestObject = new MaintainSSPDModel();
        requestObject.uldNumber = uldNumber;
        requestObject.flightId = sspdObject.flightId;
        requestObject.shipmentId = sspdObject.shipmentId;
        this.exportService.onSearchPartSuffixForSSPD(requestObject).subscribe(response => {
          if (response.data) {
            if (response.data.partSuffixDetails && response.data.partSuffixDetails.length > 0) {
              if (response.data.partSuffixDetails.length == 1 && !response.data.partSuffixDetails[0].partSuffix) {
                if (!NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_PartSuffix)) {
                  this.partSuffixDetailList = response.data.partSuffixDetails;
                }
                else {
                  // non sq case
                  this.partSuffixDetailList = null;
                }
              } else {
                //sq case
                this.partSuffixDetailList = response.data.partSuffixDetails;
              }
              this.sspdForm.get('builtTotalPieces').setValue(response.data.builtTotalPieces);
              this.sspdForm.get('builtTotalWeight').setValue(response.data.builtTotalWeight);
            }
          }
        });
      }

    }
  }
  search() {
    this.dispArray = [];
    this.tagSelection = [];
    this.invArray = [];
    this.validSuccessFlag = true;
    const sspdRequest: MaintainSSPDModel = new MaintainSSPDModel();
    sspdRequest.flightKey = this.sspdForm.get('flightKey').value;
    sspdRequest.flightDate = this.sspdForm.get('flightDate').value;
    sspdRequest.shipmentNumber = this.sspdForm.get('awbNumber').value;
    this.sspdForm.get('awbNo').setValue(this.sspdForm.get('awbNumber').value);
    this.sspdForm.get('flight').setValue(this.sspdForm.get('flightKey').value);
    // this.sspdForm.get('date').patchValue(this.sspdForm.get('flightDate'));
    let tempDateStr = ('' + this.sspdForm.get('flightDate').value).substring(4, 15);
    let actualDate = (tempDateStr.substr(4, 2) + tempDateStr.substr(0, 3) + tempDateStr.substr(7, 4));
    this.sspdForm.get('date').patchValue(actualDate);
    if (this.sspdForm.get('awbNumber').value == null || this.sspdForm.get('awbNumber').value == "") {
      this.showErrorStatus('export.enter.shipment.number');
      this.validSuccessFlag = false;
    }
    if (this.validSuccessFlag) {
      this.exportService.onSearchSSPD(sspdRequest).subscribe((data) => {
        this.resp = data.data;
        if (!this.showFormErrorMessages(data)) {
          //this.origin = this.resp.origin;
          // this.destination = this.resp.destination;
          this.showUldFlag = true;
          if (this.resp.built !== null) {
            this.tagSelection = this.resp.existingTags;
            this.displayFlag = true;
            this.shipId = this.resp.shipmentId;
            this.sspdForm.patchValue(this.resp);

            this.sspdForm.get('shipmentDetails').patchValue(this.invArray);

            if (this.resp.uldList) {
              this.uldArray = this.resp.uldList;
            }
            if (this.resp.uldList) {
              this.shc = this.resp.shcs;
            }
            if (this.resp.uldList) {
              this.house = this.resp.house;
            }


          } else {
            this.showWarningStatus('export.shipment.not.booked.on.flight');
          }
        } else {
          if (data.success == false) {
            this.displayFlag = false;
          }
          this.showFormErrorMessages(data);
        }
      });
    }
  }

  onAddRow() {
    this.partShowFlag = false;
    if (this.sspdForm.get('uldNumber').value == null || this.sspdForm.get('uldNumber').value.length === 0) {
      this.showErrorMessage('export.select.uld.trolley.number');
      return;
    }
    if (this.partSuffixDetailList && this.partSuffixDetailList.length > 0) {
      let suffixList = [];
      this.partSuffixDetailList.forEach(t => {
        suffixList.push({
          code: t.partSuffix,
          desc: t.partSuffix
        });
      })
      //this.sspdForm.get('partSuffix').setValue(response.data.partSuffixList);
      this.suffixDropDownSourceId = NgcUtility.createAndCacheSourceByObjectList(suffixList);
      this.partShowFlag = true;
      (<NgcFormArray>this.sspdForm.get('shipmentDetails')).addValue([
        {
          partSuffix: this.partSuffixDetailList[0].partSuffix,
          partPieces: this.partSuffixDetailList[0].partPieces,
          partWeight: this.partSuffixDetailList[0].partWeight,
          shipmentLocation: '',
          warehouseLocation: '',
          pieces: 0,
          weight: 0,
          chargeableWeight: 0,
          shcList: this.shc,
          houseList: this.house
        }
      ]);
    } else {
      (<NgcFormArray>this.sspdForm.get('shipmentDetails')).addValue([
        {
          shipmentLocation: '',
          warehouseLocation: '',
          pieces: 0,
          weight: 0,
          chargeableWeight: 0,
          shcList: this.shc,
          houseList: this.house
        }
      ]);
    }

  }

  onSave() {
    this.zeroFlag = false;
    this.pieceFlag = false;
    let totalpieces = 0;
    let totalWeight = 0;
    this.builtTotalPieces = this.sspdForm.get('builtTotalPieces').value;;
    this.builtTotalWeight = this.sspdForm.get('builtTotalWeight').value;
    if (this.sspdForm.valid) {
      this.validSuccessFlag = true;
      // this.sspdForm.reset();
      let noice = (<NgcFormArray>this.sspdForm.get('shipmentDetails')).getRawValue();
      // check for SQ part pcs/wt. not exceeding sum of sspd pcs/wt for each part
      let check = this.checkSQPartPcsWt(noice);
      if (check) {
        return;
      }
      this.piecesCheck(noice);
      //   if(this.pieceFlag) {
      //if(this.zeroFlag === false) {
      let requestSSPD = new MaintainSSPDModel();
      requestSSPD.inventory = new Array<ShipmentInventory>();
      for (let entry of noice) {
        let tempShip: ShipmentInventory = new ShipmentInventory();
        if (this.partShowFlag && !entry.partSuffix && NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_PartSuffix)) {
          this.showErrorMessage("export.part.suffix.selection.mandatory");
          return;
        }
        tempShip.partSuffix = entry.partSuffix;
        tempShip.partPieces = entry.partPieces;
        tempShip.partWeight = entry.partWeight;
        tempShip.flagCRUD = entry.flagCRUD;
        tempShip.shipmentLocation = entry.shipmentLocation;
        tempShip.shipmentId = this.shipId;
        tempShip.warehouseLocation = entry.warehouseLocation;
        tempShip.pieces = entry.pieces;
        tempShip.weight = entry.weight;
        tempShip.houseList = entry.houseList;
        tempShip.shcList = entry.shcList;
        requestSSPD.inventory.push(tempShip);

        totalpieces += tempShip.pieces;
        totalWeight += Number(tempShip.weight);
        if (tempShip.shipmentLocation == '' && tempShip.warehouseLocation == '') {
          this.validSuccessFlag = false;
          this.showWarningStatus('export.shipment.lcoation.warehouse.location');
        }
        if (tempShip.pieces <= 0 || tempShip.weight <= 0) {
          this.validSuccessFlag = false;
          this.showWarningStatus('export.pieces.weight.cannot.less.than.0');
        }
      }

      if (Number(totalpieces) > Number(this.builtTotalPieces)) {
        this.validSuccessFlag = false;
        this.showWarningStatus('export.unloaded.pieces.greater.than.loaded.pieces');
      }

      if (totalWeight == this.builtTotalWeight && (totalpieces > this.builtTotalPieces || totalpieces < this.builtTotalPieces)) {
        this.validSuccessFlag = false;
        this.showWarningStatus('export.unloaded.pieces.lesser.greater.than.loaded.pieces');
      }

      if (totalpieces == this.builtTotalPieces && (totalWeight > this.builtTotalWeight || totalWeight < this.builtTotalWeight)) {
        this.validSuccessFlag = false;
        this.showWarningStatus('export.unloaded.weight.lesser.greater.than.loaded.weight');
      }

      if (totalWeight > this.builtTotalWeight) {
        this.validSuccessFlag = false;
        this.showWarningStatus('export.unloaded.weight.lesser.greater.than.loaded.weight');
      }
      if (totalpieces <= 0 && totalWeight <= 0.0) {
        this.validSuccessFlag = false;
        this.showWarningStatus('export.pieces.weight.cannot.less.than.0');
      }

      requestSSPD.flightDate = this.sspdForm.get('flightDate').value;
      requestSSPD.flightKey = this.sspdForm.get('flightKey').value;
      requestSSPD.shipmentNumber = this.sspdForm.get('awbNumber').value;
      requestSSPD.uldNumber = this.sspdForm.get('uldNumber').value;
      requestSSPD.flightId = this.sspdForm.get('flightId').value;
      requestSSPD.flightSegmentId = this.sspdForm.get('flightSegmentId').value;
      requestSSPD.shipmentId = this.shipId;
      requestSSPD.shipmentPieces = this.resp.shipmentPieces;
      requestSSPD.shipmentWeight = this.resp.shipmentWeight;
      requestSSPD.shipmentDate = this.resp.shipmentDate;
      requestSSPD.destination = this.resp.destination;
      requestSSPD.origin = this.resp.origin;
      requestSSPD.flightOffPoint = this.resp.flightOffPoint;
      requestSSPD.flightBoardPoint = this.resp.flightBoardPoint;
      if (this.validSuccessFlag == true) {
        this.exportService.onSaveSSPD(requestSSPD).subscribe((data) => {
          this.refreshFormMessages(data);
          if (data.success) {
            this.showSuccessStatus('g.completed.successfully');
            this.partShowFlag = false;
            this.search();
          }
          else {
            this.showResponseErrorMessages(data);
          }
        });
      }

    }
  }

  onSelectDropdown(event, index) {
    let tagPieces = 0;
    for (const entry of this.tagSelection) {
      if (entry.number === event) {
        tagPieces = entry.pieces;
      }
    }
    this.sspdForm.get(['shipmentDetails', index, 'housePieces']).setValue(tagPieces);
  }

  getTagPieces(param: any) {
    for (let entry of this.tagSelection) {
      if (entry.number === param) {
        return entry.pieces;
      }
    }
  }

  onDeleteRow(index) {
  }

  piecesCheck(arr: any) {
    const total = this.resp.builtTotalPieces;
    let piecesTally = 0;
    let actualPieces = 0;
    for (const entry of arr) {
      if ((entry.sspdPieces - 0) === 0) {
        this.zeroFlag = true;
        break;
      }
      piecesTally += entry.sspdPieces;
    }
    if (piecesTally > total) {
      this.pieceFlag = false;
    } else {
      this.pieceFlag = true;
    }
  }

  onBack(event) {
    this.navigateBack(this.sspdForm.getRawValue);
  }

  onClear(event) {
    this.sspdForm.reset();
    this.pieceFlag = false;
    this.zeroFlag = false;
    this.displayFlag = false;
  }


  onDeleteLocation(index) {
    (<NgcFormArray>this.sspdForm.get(['shipmentDetails'])).deleteValueAt(index);
  }


  onPiecesChange(event, i) {
    let obj: UnloadShipment = new UnloadShipment();
    const pieces = this.sspdForm.get('builtTotalPieces').value;
    const weight = this.sspdForm.get('builtTotalWeight').value;
    obj.loadedPieces = +pieces;
    obj.loadedWeight = +weight;
    obj.unloadPieces = +event;
    obj.shipmentId = this.sspdForm.get('shipmentId').value;

    this.exportService.unloadWeight(obj).subscribe(data => {
      this.refreshFormMessages(data);
      const res = data.data;
      if (res) {
        (<NgcFormArray>this.sspdForm.get(['shipmentDetails', i])).get('weight').patchValue(res.unloadWeight);
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
          (<NgcFormArray>this.sspdForm
            .get(['shipmentDetails', i])).get('chargeableWeight').setValue(res.unloadChargeableWeight);
        }
      }
    }, error => {
      this.showErrorStatus('export.error.occured.try.again');
    });
  }

  eventCallPartSuffixDropdown(event, index) {

    let obj = this.sspdForm.getRawValue();
    if (obj.shipmentDetails && obj.shipmentDetails.length > 0) {
      if (this.partSuffixDetailList && this.partSuffixDetailList.length > 0) {
        for (let t of this.partSuffixDetailList) {
          if (t.partSuffix == event.code) {
            this.sspdForm.get(['shipmentDetails', index]).get('partPieces').setValue(t.partPieces);
            this.sspdForm.get(['shipmentDetails', index]).get('partWeight').setValue(t.partWeight);
          }
        };
      }

    }
  }

  checkSQPartPcsWt(inventoryList: any) {
    // check if part suffix present
    if (this.partShowFlag && inventoryList && inventoryList.length > 0) {
      let groupedByPrtSfxInvList = this.customGroupBy(inventoryList, "partSuffix");
      for (let key in groupedByPrtSfxInvList) {
        if (groupedByPrtSfxInvList[key] && groupedByPrtSfxInvList[key].length > 0) {
          // save part pcs/wt. here to match sum
          let prtPcs = groupedByPrtSfxInvList[key][0].partPieces;
          let prtWt = groupedByPrtSfxInvList[key][0].partWeight;
          let sumOfInvPcs = 0;
          let sumOfInvWt = 0;
          for (let inv of groupedByPrtSfxInvList[key]) {
            if (inv.pieces) {
              sumOfInvPcs = sumOfInvPcs + inv.pieces;
            }
            if (inv.weight) {
              sumOfInvWt = sumOfInvWt + inv.weight;
            }
          }
          if (sumOfInvPcs > prtPcs || sumOfInvWt > prtWt) {
            this.showErrorMessage("SSPD PCs/WT. for part {" + key + "} greater than part Pcs/WT.");
            return true;
          }
        }
      }
    }
    return false;
  }
  customGroupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      // Add object to list for given key's value
      acc[key].push(obj);
      return acc;
    }, {});
  }
}
