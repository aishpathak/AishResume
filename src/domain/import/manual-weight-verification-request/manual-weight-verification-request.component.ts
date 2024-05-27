import { CustomsImportShipmentManualRequest } from './../import.shared';
import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, NgZone, OnInit, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcPage, PageConfiguration, NgcFormGroup, ReactiveModel, NgcWindowComponent, NgcFormControl, NgcUtility, NgcFormArray, NgcInputComponent } from 'ngc-framework';
import { AwbManagementService } from '../../awbManagement/awbManagement.service';
import { HouseWayBillMasterform, SearchHouseWayBillListform, SearchShipmentLocation } from '../../awbManagement/awbManagement.shared';
import { ImportService } from '../import.service';


@Component({
  selector: 'app-manual-weight-verification-request',
  templateUrl: './manual-weight-verification-request.component.html',
  styleUrls: ['./manual-weight-verification-request.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: false,
  autoBackNavigation: false
})
export class ManualWeightVerificationRequestComponent extends NgcPage implements OnInit {
  @ViewChild('rejectReason') rejectReasonComponent: NgcInputComponent;
  private navigateData: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private awbService: AwbManagementService, private importService: ImportService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    const transferData = this.getNavigateData(this.activatedRoute);
    this.navigateData = transferData.requestData;
    console.log(this.navigateData);
    if (!NgcUtility.isBlank(transferData)) {
      let verificationObj: CustomsImportShipmentManualRequest = transferData.verificationObj;
      this.form.get('searchDetails').patchValue(verificationObj);
      this.onSearch();
    }
  }

  @ReactiveModel(SearchHouseWayBillListform)
  public searchHawbRecordForm: NgcFormGroup;

  @ReactiveModel(HouseWayBillMasterform)
  public hawbResponseRecordForm: NgcFormGroup;

  @ViewChild('recordWindow') recordWindow: NgcWindowComponent;
  @Output() autoSearchShipmentInfo = new EventEmitter<boolean>();

  AWBNumber: any;
  searchFlag: boolean = false;
  hawbRecordFlag: boolean = false;
  houseIdfromGet: any;
  showData: boolean = false;
  consigneAgentSourceParameter: {};
  private form: NgcFormGroup = new NgcFormGroup({
    searchDetails: new NgcFormGroup({
      shipmentNumber: new NgcFormControl(),
      hawbNumber: new NgcFormControl(),
      documentType: new NgcFormControl(),
      status: new NgcFormControl(),
      manualRequestId: new NgcFormControl()
    }),
    shipmentInfo: new NgcFormGroup({
      shipmentNumber: new NgcFormControl(),
      pieces: new NgcFormControl(),
      weight: new NgcFormControl(),
      chargeableWeight: new NgcFormControl()
    }),
    houseInfo: new NgcFormGroup({
      hawbNumber: new NgcFormControl(),
      pieces: new NgcFormControl(),
      weight: new NgcFormControl(),
      chargeableWeight: new NgcFormControl()
    }),
    shipmentNumber: new NgcFormControl(),
    shipmentPieces: new NgcFormControl(),
    shipmentWeight: new NgcFormControl(),
    shipmentChgWgt: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    hawbPieces: new NgcFormControl(),
    hawbWeight: new NgcFormControl(),
    hawbChgWgt: new NgcFormControl(),
    source: new NgcFormControl(),
    status: new NgcFormControl(),
    rejectReason: new NgcFormControl(),
    documentStore: new NgcFormArray([]),
    shipmentHouseId: new NgcFormControl(),
    shipmentId: new NgcFormControl()
  });

  onSearch() {
    this.form.validate();
    if (this.form.invalid) {
      this.showErrorStatus('g.fill.all.details');
      return;
    }
    this.form.get(['searchDetails', 'documentType']).patchValue('Wgt Ver');
    let request = this.form.getRawValue().searchDetails;
    this.importService.fetchCustomImportShpManualReq(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (NgcUtility.isBlank(data.data)) {
          this.searchFlag = false;
          this.hawbRecordFlag = false;
          this.showErrorStatus('flight.no.record');
        } else {
          this.searchFlag = true;
          this.hawbRecordFlag = true;
          this.form.patchValue(data.data);
        }
      }
    });

  }

  onStatusUpdate(status) {
    const request = this.form.getRawValue();
    request.status = status;
    request.source = 'Wgt Ver';
    console.log(request);
    if (status === 'Reject' && NgcUtility.isBlank(this.form.get('rejectReason').value)) {
      this.showErrorStatus('admin.provide.reason.reject');
      this.rejectReasonComponent.focus();
      return;
    }
        if (status === 'Approved' && request.houseInfo.chargeableWeight > request.hawbChgWgt) {
      this.showErrorStatus('import.file.hawb.chg.wgt.cannot be.less.system.hawb.chg.wgt');
      return;
    } else if (status === 'Approved') {
      request.rejectReason = null;
    }
    this.importService.customsImportShipmentManualStatusUpdate(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.showSuccessStatus("g.completed.successfully");
        this.onSearch();
      }
      else {
        console.log("not working :(");
      }
    });
  }
  onClear() {
    this.form.reset()
    this.searchFlag = false
    this.hawbRecordFlag = false;
  }
  onCancel($event) {
    this.navigateBack(this.navigateData);
  }

  openHawbRecord() {
    this.hawbResponseRecordForm.reset();
    this.searchHawbRecordForm.get('awbNumber').patchValue(this.form.get(['searchDetails', 'shipmentNumber']).value);
    this.searchHawbRecordForm.get('hawbNumber').patchValue(this.form.get(['searchDetails', 'hawbNumber']).value);

    let hawbdata: SearchHouseWayBillListform = this.searchHawbRecordForm.getRawValue();
    this.awbService.getHouseWayBillMaster(hawbdata).subscribe(response => {
      this.hawbResponseRecordForm.reset();
      if (response.messageList) {
        this.showErrorStatus(response.messageList[0].code);
        return;
      }
      this.showData = false;
      if (response.data && !this.showResponseErrorMessages(response.data)) {
        if (!response.data.handledByHouse) {
          this.showErrorMessage('awb.handledby.master');
          return;
        }
        this.showData = true;
        this.hawbResponseRecordForm.patchValue(response.data);
        this.houseIdfromGet = response.data.houseModel.id;
        if (response.data.houseModel) {
          if (!response.data.houseModel.weightUnitCode) {
            this.hawbResponseRecordForm.get('houseModel').get('weightUnitCode').setValue('K');
          }
          if (response.data.houseModel.consignee) {
            if (response.data.houseModel.consignee.appointedAgent &&
              !response.data.houseModel.consignee.appointedAgentCode) {
              this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgentCode']).setValue('IXX');
            }

            this.consigneAgentSourceParameter = this.createSourceParameter(response.data.houseModel.consignee.code);
          }

        }
        if (response.success) {
          this.recordWindow.open();
        }
      } else {
        this.showErrorStatus(response.data.messageList[0].code);
      }
    }
      , error => {
        this.showErrorMessage(error);

      });
  }

  onSaverecord() {
    const saveData = this.hawbResponseRecordForm.getRawValue();
    if (saveData.deliveredOn) {
      this.showErrorMessage("shipment.already.delivered");
      return;
    }
    if (saveData.houseModel.doFlag) {
      this.showErrorMessage("freighout.or.doissued");
      return;
    }
    if (saveData.houseModel.poFlag) {
      this.showErrorMessage("poissued");
      return;
    }
    if (this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'name']).value == null) {
      if ((this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'streetAddress']).value) == null ||
        (this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'place']).value) == null ||
        (this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'country']).value) == null ||
        (this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'postal']).value) == null) {
        this.showErrorMessage("ERR_HAWB_10");
        return;
      }
    }
    if (saveData.houseModel.consignee.name) {
      if ((saveData.houseModel.consignee.flagCRUD !== 'U') && (saveData.houseModel.consignee.flagCRUD !== 'D')) {
        saveData.houseModel.consignee.flagCRUD = 'C';
        saveData.houseModel.consignee.houseId = this.houseIdfromGet;
      }
      if (this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'name']).value == null) {
        if ((this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'streetAddress']).value) == null ||
          (this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'place']).value) == null ||
          (this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'country']).value) == null ||
          (this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'postal']).value) == null) {
          this.showErrorMessage("ERR_HAWB_10");
          return;
        }
      }
    } else {
      saveData.houseModel.shipper.address.flagCRUD = 'D';
      saveData.houseModel.consignee.flagCRUD = 'D';
    }
    if (saveData.houseModel.shipper.name) {
      if ((saveData.houseModel.shipper.flagCRUD !== 'U') && (saveData.houseModel.shipper.flagCRUD !== 'D')) {
        saveData.houseModel.shipper.flagCRUD = 'C';
        saveData.houseModel.shipper.houseId = this.houseIdfromGet;
      }
      if (NgcUtility.getTenantConfiguration().airportCode != (this.hawbResponseRecordForm.get('destination').value)) {
        if (!this.hawbResponseRecordForm.get(['houseModel', 'shipper']).valid) {
          this.showErrorMessage("ERR_HAWB_11");
          return;
        }
      }
    } else {
      saveData.houseModel.shipper.address.flagCRUD = 'D';
      saveData.houseModel.shipper.flagCRUD = 'D';
    }
    if (saveData.houseModel.shc && saveData.houseModel.shc.length > 0) {
      for (const eachRow of saveData.houseModel.shc) {
        eachRow.houseId = saveData.houseModel.id;
      }
    }
    this.awbService.setHouseWayBillMaster(saveData).subscribe(response => {
      if (!response) {
        this.showSuccessStatus('g.completed.successfully');
        this.recordWindow.close();
        this.autoSearchShipmentInfo.emit(true);
        this.onSearch();
      } else {
        this.showErrorStatus(response.messageList[0].code);
      }
    });
  }

  onSelectConsigneeName(event) {
    this.consigneAgentSourceParameter = this.createSourceParameter(null);
    this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgent']).setValue(null);
    this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgentCode']).setValue(null);
    if (event.code) {
      this.consigneAgentSourceParameter = this.createSourceParameter(event.code);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'code']).setValue(event.code);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'name']).setValue(event.desc);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'place']).setValue(event.param2);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'state']).setValue(event.parameter2);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'postal']).setValue(event.parameter1);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'country']).setValue(event.parameter3);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'streetAddress']).setValue(event.param1);
    } else {
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'code']).setValue(null);
      //    this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'name']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'place']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'state']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'postal']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'country']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'streetAddress']).setValue(null);
    }
  }

  onSelectShipperNamerecord(event) {
    if (event.code) {
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'code']).setValue(event.code);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'name']).setValue(event.desc);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'place']).setValue(event.param2);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'state']).setValue(event.parameter2);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'postal']).setValue(event.parameter1);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'country']).setValue(event.parameter3);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'streetAddress']).setValue(event.param1);
    } else {
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'code']).setValue(null);
      //  this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'name']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'state']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'place']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'country']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'postal']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'streetAddress']).setValue(null);
    }
  }
  closeRecordWindow() {
    this.recordWindow.close();
  }
  onSelectAppointedAgentCodeCne(event) {
    let appointedAgentCodeValue = this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgentCode']).value;
    this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgent']).setValue(null, { onlySelf: true, emitEvent: false });
    this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgentCode']).setValue(null, { onlySelf: true, emitEvent: false });
    if (event.code) {
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgentCode']).setValue(event.code, { onlySelf: true, emitEvent: false });
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgent']).setValue(event.param1, { onlySelf: true, emitEvent: false });
    } else {
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgent']).setValue(null, { onlySelf: true, emitEvent: false });
      if (appointedAgentCodeValue && (appointedAgentCodeValue !== 'IXX' || appointedAgentCodeValue !== 'ixx')) {
        // this.retrieveLOVRecords("KEY_AWB_VALID_IMPORT_APPOINTED_AGENT_HOUSE", { parameter1: appointedAgentCodeValue }).subscribe(response => {
        //   if (response) {
        //     (<NgcFormControl>this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgent'])).setValue(response[0].param3, { onlySelf: true, emitEvent: false });
        //     (<NgcFormControl>this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgentCode'])).setValue(response[0].code, { onlySelf: true, emitEvent: false });
        //   }
        // });

        (<NgcFormControl>this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgent'])).setValue(null, { onlySelf: true, emitEvent: false });
        (<NgcFormControl>this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgentCode'])).setValue(appointedAgentCodeValue, { onlySelf: true, emitEvent: false });
      }
    }
  }
  onChangeHawb(event) {
    var awbNumber = this.form.get(['searchDetails', 'shipmentNumber']).value;
    this.form.reset();
    this.form.get(['searchDetails', 'shipmentNumber']).setValue(awbNumber);
    this.form.get(['searchDetails', 'hawbNumber']).setValue(event.code, { onlySelf: true, emitEvent: false });
    this.searchFlag = false;
  }

}
