import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import {
  NgcFormControl,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  NgcTabsComponent,
  CellsRendererStyle,
  NgcPage,
  NgcFormGroup,
  NgcWindowComponent,
  NgcFormArray
  , NgcDropDownComponent, NgcUtility, NgcButtonComponent, NgcDataTableComponent, PageConfiguration, DateTimeKey, NgcReportComponent
} from 'ngc-framework';
import { AwbManagementService } from '../awbManagement.service';
import { holdNotifyShipmentRequest, UnHoldRequest, UpdateHoldNotifyGroup, UpdateAck } from '../awbManagement.shared';
import { CellsStyleClass } from '../../../shared/shared.data';
import { Validators } from '@angular/forms';
import { ApplicationFeatures } from '../../common/applicationfeatures';

@Component({
  selector: 'app-display-hold-notify-shipments',
  templateUrl: './display-hold-notify-shipments.component.html',
  styleUrls: ['./display-hold-notify-shipments.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class DisplayHoldNotifyShipmentsComponent extends NgcPage implements OnInit {
  private response: any;
  reportParameters: any = new Object();
  private shipmentShcArray: any = [];
  date: any;
  dateFrom: any;
  dateto: any;
  templateRef: TemplateRef<any>;
  private searchFlag: boolean = false;
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @ViewChild('parentWindow') parentWindow: NgcWindowComponent;
  @ViewChild('holdPopUp') holdPopUp: TemplateRef<any>;
  title: string;
  popUpWidth: Number;
  popUpHeight: Number;
  showMe: boolean = true;

  constructor(appZone: NgZone,
    private holdnotifygroupservice: AwbManagementService, ppZone: NgZone,
    appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData.formData) {
      let data = forwardedData.formData;
      this.holdNotifyShipmentsForm.controls['holdNotifyGroup'].setValue(data.holdNotifyGroup);
      this.holdNotifyShipmentsForm.controls['shipmentNumber'].setValue(data.shipmentNumber);
      this.holdNotifyShipmentsForm.controls['terminalPoint'].setValue(data.terminalPoint);
      this.holdNotifyShipmentsForm.controls['utl'].setValue(data.utl);
      this.holdNotifyShipmentsForm.controls['from'].setValue(data.from);
      this.holdNotifyShipmentsForm.controls['to'].setValue(data.to);
      this.holdNotifyShipmentsForm.controls['acknowledge'].setValue(data.acknowledge);
      this.onSearch();
    }
  }
  onClear() {
    this.holdNotifyShipmentsForm.reset();
    this.searchFlag = false;
  }

  private holdNotifyShipmentsForm: NgcFormGroup = new NgcFormGroup({
    terminalPoint: new NgcFormControl(),
    holdNotifyGroup: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    from: new NgcFormControl(),
    to: new NgcFormControl(),
    utl: new NgcFormControl(false),
    acknowledge: new NgcFormControl(),
    holdNotifyGroupUpdate: new NgcFormControl(),
    shipment: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        partSuffix: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        natureOfGoodsDescription: new NgcFormControl(),
        location: new NgcFormControl(),
        piecesInv: new NgcFormControl(),
        weightInv: new NgcFormControl(),
        warehouseLocation: new NgcFormControl(),
        hold: new NgcFormControl(),
        modifiedBy: new NgcFormControl(),
        datetime: new NgcFormControl(),
        reasonForHold: new NgcFormControl(),
        remarks: new NgcFormControl(),
        holdNotifyGroup: new NgcFormControl(),
        shcListInv: new NgcFormControl(),
        ackDate: new NgcFormControl()

      })
    ])
  });
  unholdForm: NgcFormGroup = new NgcFormGroup({
    unHoldRemarks: new NgcFormControl()
  })


  onSearch() {

    if (this.holdNotifyShipmentsForm.controls['holdNotifyGroup'].value == '') {
      this.holdNotifyShipmentsForm.controls['holdNotifyGroup'].setValue(null);
    }
    if (this.holdNotifyShipmentsForm.controls['shipmentNumber'].value == '') {
      this.holdNotifyShipmentsForm.controls['shipmentNumber'].setValue(null);
    }
    if (this.holdNotifyShipmentsForm.controls['terminalPoint'].value == '') {
      this.holdNotifyShipmentsForm.controls['terminalPoint'].setValue(null);
    }
    if (this.holdNotifyShipmentsForm.controls['acknowledge'].value == '') {
      this.holdNotifyShipmentsForm.controls['acknowledge'].setValue(null);
    }
    if (this.holdNotifyShipmentsForm.controls['holdNotifyGroupUpdate'].value == '') {
      this.holdNotifyShipmentsForm.controls['holdNotifyGroupUpdate'].setValue(null);
    }
    if (this.holdNotifyShipmentsForm.controls['holdNotifyGroup'].value === null
      && this.holdNotifyShipmentsForm.controls['shipmentNumber'].value === null) {
      this.showErrorStatus('awb.enter.shipment.or.holdnotifygroup');
    } else {
      let request = new holdNotifyShipmentRequest();
      request = this.holdNotifyShipmentsForm.getRawValue();
      this.holdnotifygroupservice.searchHoldNotifyGroupShipment(request).subscribe(result => {
        this.refreshFormMessages(result);
        this.holdNotifyShipmentsForm.get(['shipment']).patchValue(result.data);
        this.searchFlag = true;
      })
    }
  }
  openShipmentInfoPage(event) {
    var dataToSend = {
      shipmentNumber: event.record.shipmentNumber,
      formData: this.holdNotifyShipmentsForm.getRawValue()
    }
    this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', dataToSend);
  }

  public onHoldShipment() {
    let selectedRecord = [];
    let shipmentInfo = (<NgcFormArray>this.holdNotifyShipmentsForm.controls['shipment']).getRawValue();
    shipmentInfo.forEach(record => {
      if (record['select'] === true) {
        selectedRecord.push(record);
      }
    });
    if (selectedRecord.length === 0) {
      this.showErrorStatus('export.select.atleast.one.record');
    } else if (selectedRecord.length > 1) {
      this.showErrorStatus('expaccpt.select.only.one.record');
    } else {
      const obj = {
        shipmentId: shipmentInfo[0].shipmentId,
        shipmentNumber: shipmentInfo[0].shipmentNumber
      }
      this.navigateTo(this.router, 'awbmgmt/shipmentonhold', obj);
    }
  }

  public unHoldShipment() {
    let selectedRecord = [];
    let shipmentInfo = (<NgcFormArray>this.holdNotifyShipmentsForm.controls['shipment']).getRawValue();
    shipmentInfo.forEach(record => {
      if (record['select'] === true) {
        selectedRecord.push(record);
      }
    });
    if (selectedRecord.length === 0) {
      this.showErrorStatus('export.select.atleast.one.record');
    } else {
      this.unholdForm.reset();
      this.templateRef = this.holdPopUp;
      this.title = "2.Unhold.Shp"
      this.popUpWidth = 500;
      this.popUpHeight = 300;
      this.parentWindow.open();
    }

  }
  public unHoldShipmentsFunction(unHoldRequest) {
    this.holdnotifygroupservice.updateHoldForNotifyShipments(unHoldRequest).subscribe(data => {
      if (data) {
        this.showSuccessStatus('g.completed.successfully');
        this.closeHoldPopUp();
        this.onSearch();
      }
      else {
        this.showErrorStatus('export.error.occured.try.again');
      }
    });
  }
  public onSave(event) {
    this.resetFormMessages();
    let selectedRecord = [];
    let updateHoldNotifyGroup = new UpdateHoldNotifyGroup();
    updateHoldNotifyGroup.holdNotifyGroup = this.holdNotifyShipmentsForm.controls['holdNotifyGroupUpdate'].value;
    let shipmentNumber = [];
    let shipmentInfo = (<NgcFormArray>this.holdNotifyShipmentsForm.controls['shipment']).getRawValue();
    shipmentInfo.forEach(record => {
      if (record['select'] === true) {
        record['ackDate'] = null;
        selectedRecord.push(record);
        shipmentNumber.push(record);
      }
    });
    if (selectedRecord.length === 0) {
      this.showErrorStatus('export.select.atleast.one.record');
    } else if (updateHoldNotifyGroup.holdNotifyGroup === null) {
      this.showErrorStatus('awb.select.holdnotifygroup');
    }
    else {
      updateHoldNotifyGroup.shipmentNumber = shipmentNumber;
      this.holdnotifygroupservice.updateHoldNotifyGroup(updateHoldNotifyGroup).subscribe(data => {
        if (data) {
          this.showSuccessStatus('g.completed.successfully');
          this.holdNotifyShipmentsForm.controls['holdNotifyGroupUpdate'].setValue(null);
          this.onSearch();
        }
        else {
          this.showErrorStatus('export.error.occured.try.again');
        }
      });
    }
  }
  public updateACK() {
    this.resetFormMessages();
    let selectedRecord = [];
    let updateAck = new UpdateAck();
    let invList = [];
    let shipmentInfo = (<NgcFormArray>this.holdNotifyShipmentsForm.controls['shipment']).getRawValue();
    shipmentInfo.forEach(record => {
      if (record['select'] === true) {
        selectedRecord.push(record);
        invList.push(record.shipmentInventoryId);
      }
    });
    if (selectedRecord.length === 0) {
      this.showErrorStatus('export.select.atleast.one.record');
    }
    else {
      updateAck.shipmentInventoryId = invList;
      this.holdnotifygroupservice.updateAck(updateAck).subscribe(data => {
        if (data) {
          this.showSuccessStatus('g.completed.successfully');
          this.onSearch();
        }
        else {
          this.showErrorStatus('export.error.occured.try.again');
        }
      });
    }
  }
  validateNotifyGroup() {
    if (this.holdNotifyShipmentsForm.controls['shipmentNumber'] && this.holdNotifyShipmentsForm.controls['shipmentNumber'].value) {
      (<NgcFormControl>this.holdNotifyShipmentsForm.get('holdNotifyGroup')).clearValidators();
      this.holdNotifyShipmentsForm.controls['acknowledge'].setValue('');
    } else {
      (<NgcFormControl>this.holdNotifyShipmentsForm.get('holdNotifyGroup')).setValidators([Validators.required]);
    }

  }
  unHold() {
    if (this.holdNotifyShipmentsForm.controls['holdNotifyGroup'].value == '') {
      this.holdNotifyShipmentsForm.controls['holdNotifyGroup'].setValue(null);
    }

    if (this.unholdForm.controls['unHoldRemarks'].value == '') {
      this.unholdForm.controls['unHoldRemarks'].setValue(null);
    }
    if (this.unholdForm.controls['unHoldRemarks'].value == null) {
      this.showErrorStatus('awb.enter.remarks.unhold');
    } else {
      let selectedRecord = [];
      let unHoldRequest = new UnHoldRequest();
      let shipmentNumber = [];
      let shipmentInfo = (<NgcFormArray>this.holdNotifyShipmentsForm.controls['shipment']).getRawValue();
      shipmentInfo.forEach(record => {
        if (record['select'] === true) {
          selectedRecord.push(record);
          shipmentNumber.push(record);
          record['ackDate'] = null;
        }
      });
      unHoldRequest.shipmentNumber = shipmentNumber;
      unHoldRequest.unHoldRemarks = this.unholdForm.controls['unHoldRemarks'].value;
      this.unHoldShipmentsFunction(unHoldRequest);
    }
  }
  closeHoldPopUp() {
    this.parentWindow.close();
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.showMe = true;
  }
  onPrint() {
    this.reportParameters.terminalPointFlag = '0';
    this.reportParameters.holdNotifyGroupflag = '0';
    this.reportParameters.utlFlag = '0';
    this.reportParameters.acknowledgeFlag = '0';
    this.reportParameters.shipmentNumberFlag = '0';
    this.reportParameters.fromFlag = '0';
    this.reportParameters.toFlag = '0';
    this.reportParameters.acknowledgeFlagifNo = '0';

    this.reportParameters.holdNotifyGroup = this.holdNotifyShipmentsForm.controls['holdNotifyGroup'].value;
    this.reportParameters.terminalPoint = this.holdNotifyShipmentsForm.controls['terminalPoint'].value;
    this.reportParameters.shipmentNumber = this.holdNotifyShipmentsForm.controls['shipmentNumber'].value;
    this.reportParameters.from = this.holdNotifyShipmentsForm.get("from").value;
    this.reportParameters.to = this.holdNotifyShipmentsForm.get("to").value;

    if (this.holdNotifyShipmentsForm.controls['terminalPoint'].value) {
      this.reportParameters.terminalPointFlag = '1';
    }
    if (this.reportParameters.holdNotifyGroup) {
      this.reportParameters.holdNotifyGroupflag = '1';
    }
    if (this.holdNotifyShipmentsForm.get("utl").value) {
      this.reportParameters.utlFlag = '1';
    }
    if (this.holdNotifyShipmentsForm.get("acknowledge").value != null &&
      this.holdNotifyShipmentsForm.get("acknowledge").value == 'Y' &&
      this.holdNotifyShipmentsForm.controls['shipmentNumber'].value == null) {
      this.reportParameters.acknowledgeFlag = '1';
    }
    this.reportParameters.isAAT = NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_Shipment_ActualLocation);
    if ((this.holdNotifyShipmentsForm.get("acknowledge").value == null ||
      this.holdNotifyShipmentsForm.get("acknowledge").value == 'N') &&
      this.holdNotifyShipmentsForm.controls['shipmentNumber'].value == null) {
      this.reportParameters.acknowledgeFlagifNo = '1'
    }
    if (this.reportParameters.from) {
      this.reportParameters.fromFlag = '1';
    }
    if (this.reportParameters.to) {
      this.reportParameters.toFlag = '1';
    }
    if (this.holdNotifyShipmentsForm.controls['shipmentNumber'].value) {
      this.reportParameters.shipmentNumberFlag = '1';
    }
    this.reportWindow.downloadReport();

  }
}
