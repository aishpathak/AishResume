import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcContainerComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from "@angular/router";
import { SearchShipmentLocation } from '../awbManagement.shared';
import { AwbManagementService } from '../awbManagement.service';


@Component({
  selector: 'app-mergeShipmentLocation',
  templateUrl: './mergeShipmentLocation.component.html',
  styleUrls: ['./mergeShipmentLocation.component.scss']
})

export class MergeShipmentLocationComponent extends NgcPage implements OnInit {

  totalpieces: any = 0;
  list: any;
  finalList: any;
  totalweight: number = 0;
  finalfinalwalalist: any = [];
  finaldata: any;
  inputFlag: boolean = false;
  displayFlag: boolean = true;
  FrieghtFlag = false;

  private mergeLocationForm: NgcFormGroup = new NgcFormGroup({
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
        shcListInv: new NgcFormArray([
          new NgcFormGroup({
            shcInv: new NgcFormControl()
          })
        ])
      })
    ]),
    partSuffix: new NgcFormControl(),
  })

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private awbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    let forwardedData = this.getNavigateData(this.activatedRoute);
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
    let finalShcListInv = new Array();
    this.list.shipmentInventories.forEach(ele => {
      let shcInvList = new Array();
      this.totalweight += ele.weightInv;
      this.totalpieces += parseInt(ele.piecesInv);

      if (ele.shcListInv !== null) {
        ele.shcListInv.forEach(e => {
          let shc: any = new Object();
          shc.shcInv = e.shcInv;
          finalShcListInv.push(shc);
        })
      }

      this.finaldata = {
        shipmentLocation: ele.shipmentLocation,
        warehouseLocation: ele.warehouseLocation,
        handlingArea: ele.handlingArea,
        flightId: ele.flightId,
        flightKey: ele.flightKey,
        flightKeyDate: ele.flightKeyDate,
        shipmentId: ele.shipmentId,
        partSuffix: ele.partSuffix
      }
    });
    let uniq: any = new Object();
    var filteredFinalShcListInv = finalShcListInv.filter(obj => !uniq[obj.shcInv] && (uniq[obj.shcInv] = true));
    this.mergeLocationForm.patchValue(this.list);

    (<NgcFormArray>this.mergeLocationForm.get("shipmentInventories")).controls.forEach(element => {
      (element as NgcFormGroup).markAsDeleted();
    });

    (this.mergeLocationForm.get("shipmentInventories") as NgcFormArray)
      .addValue([{
        flightId: this.finaldata.flightId, shipmentId: this.finaldata.shipmentId,
        shipmentLocation: null, piecesInv: this.totalpieces,
        weightInv: this.totalweight, warehouseLocation: null,
        flightKey: this.finaldata.flightKey, flightKeyDate: this.finaldata.flightKeyDate,
        shcListInv: filteredFinalShcListInv, handlingArea: this.finaldata.handlingArea, shcDummy: null,
        partSuffix: this.finaldata.partSuffix
      }]);
  }

  private onSave(event) {
    this.resetFormMessages();
    let rawValue = this.mergeLocationForm.getRawValue();
    this.awbManagementService.updateMergedLocation(rawValue).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        const response = data.data;
        if (response) {
          this.showSuccessStatus('g.completed.successfully');
          this.navigateTo(this.router, '/awbmgmt/shipmentLocation', rawValue);
        }

      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  public onBack(event) {
    this.navigateBack(this.mergeLocationForm.getRawValue());
  }
}
