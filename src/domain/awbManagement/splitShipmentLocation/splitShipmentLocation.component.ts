import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcContainerComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from "@angular/router";
import { SearchShipmentLocation } from '../awbManagement.shared';
import { AwbManagementService } from '../awbManagement.service';

@Component({
  selector: 'app-splitShipmentLocation',
  templateUrl: './splitShipmentLocation.component.html',
  styleUrls: ['./splitShipmentLocation.component.scss']
})
export class SplitShipmentLocationComponent extends NgcPage implements OnInit {

  list: any;
  finaldata: any;
  FrieghtFlag = false;
  inventoryPieces: any;
  inventoryPiecesAfterSpit: any;
  suffixValuesExist: boolean = false;
  handledbyHouse: boolean = false;
  shipmentTypeflag: any;

  private splitLocationForm: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    natureOfGoods: new NgcFormControl(),
    specialHandlingCode: new NgcFormControl(),
    shcList: new NgcFormControl(),
    shipmentInventories: new NgcFormArray([
      new NgcFormGroup({
        shipmentLocation: new NgcFormControl()
      })
    ]),
    partSuffix: new NgcFormControl(),
    chargeableWeight: new NgcFormControl(),
    hwbNumber: new NgcFormControl(''),
    houseInformation: new NgcFormGroup({
      hwbNumber: new NgcFormControl(),
      hwbOrigin: new NgcFormControl(),
      hwbDestination: new NgcFormControl(),
      hwbPieces: new NgcFormControl(),
      hwbWeight: new NgcFormControl(),
      hwbChgWeight: new NgcFormControl(),
      hwbNatureOfGoods: new NgcFormControl(),
      hwbSHC: new NgcFormArray([])
    }),
  })

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private awbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    let forwardedData = this.getNavigateData(this.activatedRoute);
    console.log("formadata", forwardedData);
    this.handledbyHouse = forwardedData.handledbyHouse;
    this.shipmentTypeflag = forwardedData.shipmentTypeflag;
    this.onSearch(forwardedData);
  }

  onSearch(requestData) {
    this.list = requestData;

    if (this.list.shipmentTypeflag == 'EXPORT') {
      this.FrieghtFlag = true;
    }
    else {
      this.FrieghtFlag = false;
    }

    this.finaldata = this.list.shipmentInventories[0];
    this.splitLocationForm.patchValue(this.list);
    this.suffixValuesExist = this.list.suffixValuesExist;
    (<NgcFormArray>this.splitLocationForm.get("shipmentInventories"))
      .addValue([{
        flightId: this.finaldata.flightId, shipmentId: this.finaldata.shipmentId, houseId: this.finaldata.houseId,
        shipmentLocation: null, piecesInv: null,
        weightInv: null, chargeableWeightInv: null, warehouseLocation: null,
        flightKey: this.finaldata.flightKey, flightKeyDate: this.finaldata.flightKeyDate,
        shcListInv: (this.finaldata.shcListInv && this.finaldata.shcListInv.length > 0 ? this.finaldata.shcListInv : []),
        handlingArea: this.finaldata.handlingArea, shcDummy: null, partSuffix: (this.list.partSuffixListDisplay.length == 1 && !NgcUtility.isTenantCityOrAirport(this.list.destination)) ? this.list.partSuffix : null
      }]);
  }

  private onSave(event) {
    if (this.splitLocationForm.invalid) {
      this.showErrorMessage("g.fill.all.details")
      return;
    }
    let rawValue = this.splitLocationForm.getRawValue();
    rawValue.shipmentInventories.forEach(element => {
      if (element.flagCRUD === 'U') {
        this.inventoryPieces = element.piecesInv;
      }
      if (element.flagCRUD === 'C') {
        this.inventoryPiecesAfterSpit = + element.piecesInv;
      }
    });
    if (this.inventoryPiecesAfterSpit >= this.inventoryPieces) {
      this.showErrorMessage("awb.pcs.equal.more.split.pcs");
      return;
    }
    this.resetFormMessages();
    this.awbManagementService.insertSplittedLocation(rawValue).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        const response = data.data;
        if (response != null) {
          this.showSuccessStatus('g.completed.successfully');
          this.navigateTo(this.router, '/awbmgmt/shipmentLocation', rawValue);
        }

      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  public onBack(event) {
    this.navigateBack(this.splitLocationForm.getRawValue());
  }

  public calculateRemainingPieces(event, index) {
    let count = 0;
    // Pieces and Weight without row
    let notRowPieces = 0;
    let notRowWeight = 0;
    let notRowChargeableWeight = 0;
    //If AWB weight is equal to inventory weight, Weight will be auto populated
    let totalpieces = 0;
    let totalWeight = 0;
    let totalChargeableWeight = 0;
    let totalInventoryWeight = 0;
    let totalIinventoryPieces = 0;
    let totalInventoryChargeableWeight = 0;
    let remainingManifestPieceWithoutCalculation = 0;
    let remainingManifestWeightWithoutCalculation = 0;
    let remainingManifestChargeableWeightWithoutCalculation = 0;
    const request = (<NgcFormArray>this.splitLocationForm.get("shipmentInventories")).getRawValue();
    totalpieces = request[0].piecesInv;
    totalWeight = request[0].weightInv;
    totalChargeableWeight = request[0].chargeableWeightInv;
    remainingManifestPieceWithoutCalculation = request[0].piecesInv;
    remainingManifestWeightWithoutCalculation = request[0].weightInv;
    remainingManifestChargeableWeightWithoutCalculation = request[0].chargeableWeightInv;
    if (index == 1 && event >= request[0].piecesInv && request.length === 2) {
      this.splitLocationForm.get(['shipmentInventories', index, 'weightInv']).setValue(Number(totalWeight));
      this.splitLocationForm.get(['shipmentInventories', index, 'chargeableWeightInv']).setValue(Number(totalChargeableWeight));
      return;
    }

    request.forEach(ele => {
      if (count > 0) {
        totalIinventoryPieces += ele.piecesInv;
        totalInventoryWeight += ele.weightInv;
        totalInventoryChargeableWeight += ele.chargeableWeightInv;
        if (count !== index) {
          notRowPieces += ele.piecesInv;
          notRowWeight += ele.weightInv;
          notRowChargeableWeight += ele.chargeableWeightInv;
          remainingManifestPieceWithoutCalculation = remainingManifestPieceWithoutCalculation - ele.piecesInv;
          remainingManifestWeightWithoutCalculation = remainingManifestWeightWithoutCalculation - ele.weightInv;
          remainingManifestChargeableWeightWithoutCalculation = remainingManifestChargeableWeightWithoutCalculation - ele.chargeableWeightInv;
        }
      }
      count++;
    });
    if (totalIinventoryPieces >= totalpieces) {
      if ((totalWeight - notRowWeight) > 0) {
        this.splitLocationForm.get(['shipmentInventories', index, 'weightInv']).setValue(Number((totalWeight - notRowWeight)));
      } else {
        this.splitLocationForm.get(['shipmentInventories', index, 'weightInv']).setValue(0.0);
      }
      if ((totalChargeableWeight - notRowChargeableWeight) > 0) {
        this.splitLocationForm.get(['shipmentInventories', index, 'chargeableWeightInv']).setValue(Number((totalWeight - notRowChargeableWeight)));
      } else {
        this.splitLocationForm.get(['shipmentInventories', index, 'chargeableWeightInv']).setValue(0.0);
      }
      return;
    } else {
      if (request.length > 2) {
        this.splitLocationForm.get(['shipmentInventories', index, 'weightInv']).setValue(Number((event * (remainingManifestWeightWithoutCalculation / remainingManifestPieceWithoutCalculation))).toFixed(1));
        this.splitLocationForm.get(['shipmentInventories', index, 'chargeableWeightInv']).setValue(Number((event * (remainingManifestChargeableWeightWithoutCalculation / remainingManifestPieceWithoutCalculation))));
      } else {
        this.splitLocationForm.get(['shipmentInventories', index, 'weightInv']).setValue(Number((event * (totalWeight / totalpieces))).toFixed(1));
        this.splitLocationForm.get(['shipmentInventories', index, 'chargeableWeightInv']).setValue(Number((event * (totalChargeableWeight / totalpieces))));
      }
    }
  }
}
