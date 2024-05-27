import { Awbnumber } from './../../import.shared';
import { TransferByCarrier, TranshipmentTransferManifestByAWB, TranshipmentTransferManifestByAWBInfo, TranshipmentTransferManifestByAWBSHC } from './../transhipment.sharedmodels';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { PageConfiguration, NgcFormGroup, NgcFormControl, NgcPage, NgcFormArray, CellsRendererStyle } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { TranshipmentService } from '../transhipment.service';
import { TransferByCarrierSearch } from '../transhipment.sharedmodels';

@Component({
  selector: 'app-transfer-by-carrier',
  templateUrl: './transfer-by-carrier.component.html',
  styleUrls: ['./transfer-by-carrier.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class TransferByCarrierComponent extends NgcPage implements OnInit {
  forwardedData: any;
  showDataTable = false;
  showPage = false

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _transhipmentService: TranshipmentService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData) {
      this.form.get('transferringCarrier').setValue(this.forwardedData.transferringCarrier);
      this.form.get('onwardCarrier').setValue(this.forwardedData.onwardCarrier);
      //Initiate the search
      this.async(() => {
        this.search();
      }, 1000)
    }
    super.ngOnInit();
  }

  public form: NgcFormGroup = new NgcFormGroup({
    transferringCarrier: new NgcFormControl(),
    onwardCarrier: new NgcFormControl()

  });
  search() {
    let searchObj = new TransferByCarrierSearch();
    searchObj = this.form.getRawValue();
    if (searchObj.onwardCarrier === '') {
      searchObj.onwardCarrier = null;
    }
    this._transhipmentService.geTranshipmentByCarrier(searchObj).subscribe(resp => {
      const response = resp;
      const data = response.data;
      this.refreshFormMessages(resp);
      if (response.messageList === null) {
        if (data.transferByCarrierList === null || data.transferByCarrierList.length === 0) {
          this.showDataTable = false;

          this.showErrorMessage('no.record.found');
        } else {
          this.showDataTable = true;
          this.form.patchValue(data);
          (<NgcFormArray>this.form.get('transferByCarrierList')).controls.forEach((shipment: NgcFormGroup) => {
            if (!shipment.get('readyToTransfer').value) {
              shipment.get('select').disable();
            }
          });
        }
      }
    })
  }

  routeToTransferByAWB() {
    const transferCarrierList = new Array<TransferByCarrier>();
    let count = 0;
    let baseCarrier = null;
    let showError = false;
    (<NgcFormArray>this.form.get(['transferByCarrierList'])).controls.forEach((shipment: NgcFormGroup) => {
      if (shipment.get('select').value) {
        count++;
        if (baseCarrier === null) {
          baseCarrier = shipment.get('to').value;
        }
        if (baseCarrier !== shipment.get('to').value) {
          showError = true;
          this.showErrorMessage('select.carrier.to.transfer.to.awb');
          return;
        }
        transferCarrierList.push(shipment.getRawValue());
      }
    });
    if (showError) {
      return;
    }
    if (count > 8) {
      this.showErrorMessage('select.shipment.create.trm');
      return;
    }
    this._transhipmentService.fromCarrier = true;
    const AWB = new TranshipmentTransferManifestByAWB();
    AWB.carrierCodeFrom = this.form.get('transferringCarrier').value;
    AWB.carrierCodeTo = baseCarrier;
    AWB.awbInfoList = new Array<TranshipmentTransferManifestByAWBInfo>();
    transferCarrierList.forEach((element: TransferByCarrier) => {
      const awbInfo = new TranshipmentTransferManifestByAWBInfo();
      awbInfo.destination = element.destination;
      awbInfo.inboundFlightDate = element.date;
      awbInfo.inboundFlightHandler = element.handler;
      awbInfo.inboundFlightNumber = element.flight;
      awbInfo.natureOfGoodsDescription = element.natureOfGoods;
      awbInfo.pieces = element.pieces;
      awbInfo.weight = element.weight;
      awbInfo.weightUnitCode = element.weightCode;
      awbInfo.shipmentNumber = element.awbNumber;
      awbInfo.origin = element.origin;
      awbInfo.awbDestination = element.awbDestination;
      awbInfo.inventoryPieces = element.piecesInventory;
      awbInfo.inventoryWeight = element.weightInventory;
      let shcList: Array<string> = null;
      if (element.shc != null) {
        shcList = element.shc.split(' ');
      }
      if (shcList != null && shcList.length > 0) {
        awbInfo.shcList = new Array<TranshipmentTransferManifestByAWBSHC>();
        shcList.forEach(shcValue => {
          const shcObj = new TranshipmentTransferManifestByAWBSHC();
          shcObj.specialHandlingCode = shcValue;
          awbInfo.shcList.push(shcObj);
        });
      }
      AWB.awbInfoList.push(awbInfo);
    });
    console.log(AWB);
    this.navigateTo(this.router, '/import/transhipment/maintainTRMByAWB', AWB);
  }
  public indecatorCellsStyleRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    console.log('log' + value + 'log', column);
    if (value === '' || value === null || value === '0') {
      cellsStyle.data = ' ';
    } else {
      cellsStyle.data = 'Y';
    }
    return cellsStyle;
  }

  public redyToTransferCellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
    let tooltipInfo = rowData.tooltipInfo;
    let shcs: any;
    if (value && (value === true || value === "true")) {
      // tslint:disable-next-line:max-line-length
      shcs = '<span style="color:#fff;background:green; border-radius: 25px; padding:5px;font-weight:bold;font-size:12x;" title="' + tooltipInfo + '">&nbsp;Y&nbsp;</i></span>';
    } else if (value && (value === false || value === "false")) {
      // tslint:disable-next-line:max-line-length
      shcs = '<span style="color:#fff;background:red; border-radius: 25px; padding:5px;font-weight:bold;font-size:12x;" title="' + tooltipInfo + '">&nbsp;N&nbsp;</i></span>';
    } else {
      shcs = '';
      // tslint:disable-next-line:max-line-length
      shcs = '<span style="color:#fff;background:red; border-radius: 25px; padding:5px;font-weight:bold;font-size:12x;" title="' + tooltipInfo + '">&nbsp;N&nbsp;</i></span>';
    }
    return shcs;
  }


  redirectToShipmentInformation(event) {
    let transferringCarrier = this.form.get('transferringCarrier').value;
    let onwardCarrier = this.form.get('onwardCarrier').value;
    const rowId = event.record.NGC_ROW_ID;
    const requestForShipmentInfo: any =
    {
      'shipmentNumber': event.record.awbNumber,
      'shipmentType': 'AWB',
      'transferringCarrier': transferringCarrier,
      'onwardCarrier': onwardCarrier
    };
    this.navigateTo(this.router, '/awbmgmt/shipmentinfoCR', requestForShipmentInfo);
  }
}
