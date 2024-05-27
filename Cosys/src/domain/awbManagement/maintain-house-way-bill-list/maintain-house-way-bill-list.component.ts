import { NgcUtility, NgcLOVComponent } from 'ngc-framework';
import { Consignee } from './../../tracing/tracing.shared';
import {
  Component, NgZone, ElementRef, ViewContainerRef, OnInit,
  ViewChild, ViewChildren, QueryList, Output, EventEmitter, Input
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, PageConfiguration, ReactiveModel, NgcFormArray, NgcWindowComponent
} from 'ngc-framework';
import { AwbManagementService } from '../awbManagement.service';
import { NgcFormControl } from 'ngc-framework';
import { FormArray, AbstractControl } from '@angular/forms';
import { HouseWayBillListform, SearchHouseWayBillListform, HousewayDimentionForm, CustomerInformationForm, Dimention, DimensionDetails, BookingDimnesion, ShipmentLocationSearch, DeleteHouseWayBillSearchModel, MaintainHouseDetailsList, HouseWayBillMasterform } from '../awbManagement.shared';
import { FormsModule, Validators } from '@angular/forms';
import { summaryFileName } from '@angular/compiler/src/aot/util';

@Component({
  selector: 'maintain-house-way-bill-list',
  templateUrl: './maintain-house-way-bill-list.component.html',
  styleUrls: ['./maintain-house-way-bill-list.component.scss']
})

@PageConfiguration({
  trackInit: true,
  focusToBlank: true,
  focusToMandatory: true,
  restorePageOnBack: true,
  callNgOnInitOnClear: true
})

export class MaintainHouseWayBillListComponent extends NgcPage {
  variable: number;
  popupRecord: any;
  mesurementData = ["CMT", "INH"];
  hawbDimention: any;
  showDeleteButton: boolean = false;
  AWBNumber: any;
  showData: boolean = false;
  houseIdfromGet: any;
  checkIndex: any;
  originShipperMandatoryflag = false;
  destinationConsigneeMandatoryFlag = false;
  fractionScale: number;

  private deleteform: NgcFormGroup = new NgcFormGroup({
    awbNumber: new NgcFormControl(),
    hawbNumber: new NgcFormControl('', Validators.required),
    remarks: new NgcFormControl(),
    shipmentId: new NgcFormControl()
  })

  /*
  * Reactive Form
  */
  @ReactiveModel(HouseWayBillListform)
  public form: NgcFormGroup;

  @ReactiveModel(HouseWayBillListform)
  public addHouseForm: NgcFormGroup;

  @ReactiveModel(SearchHouseWayBillListform)
  public searchForm: NgcFormGroup;

  @ReactiveModel(CustomerInformationForm)
  public customerInformationForm: NgcFormGroup;

  @ReactiveModel(CustomerInformationForm)
  public customerInformationFormList: NgcFormGroup;

  @ReactiveModel(HousewayDimentionForm)
  public HousewayDimentionForm: NgcFormGroup;

  @ReactiveModel(SearchHouseWayBillListform)
  public searchHawbRecordForm: NgcFormGroup;

  @ReactiveModel(HouseWayBillMasterform)
  public hawbResponseRecordForm: NgcFormGroup;


  @ViewChild('appointedAgent') appointedAgent: NgcLOVComponent;

  /* 
  * Global Parameters For Calculating Total of
  * HAWB record, pieces, weight and chargeable weight
  */
  totalHawbWeight: number;
  totalHawbPieces: number;
  totalHawbNumber: number;
  totalHawbChargeableWeight: number;
  // Flag For Hiding and Showing HAWB NUMBER INPUT as per the record of HawbNumber
  showHawbNumber: boolean = false;
  // Flag when Data is coming for showing all the records
  onSuccess: boolean = false;

  consigneAgentSourceParameter: {};

  @ViewChild('addHouseFormWindow')
  private addHouseFormWindow: NgcWindowComponent;
  @ViewChild('customerInformationWindow')
  private customerInformationWindow: NgcWindowComponent;
  @ViewChild('customerInformationWindowList')
  private customerInformationWindowList: NgcWindowComponent;
  @ViewChild('dimensionWindow') dimensionWindow: NgcWindowComponent;
  @ViewChild('deleteWindow') deleteWindow: NgcWindowComponent;
  @ViewChild('recordWindow') recordWindow: NgcWindowComponent;
  @Input('showAsPopup') showAsPopup: boolean;
  @Input('shipmentNumberData') shipmentNumberData;
  @Output() autoSearchShipmentInfo = new EventEmitter<boolean>();

  globalShipmentId: number;
  hawbdata: any;
  forwardedData: any;
  globalDirectConsignee: any;
  windowOpenFlag: boolean = false;

  /* 
  *
  */
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    private router: Router,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private awbService: AwbManagementService,
    private maintainHouseservice: AwbManagementService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.fractionScale = NgcUtility.getApplicationChargeWeightDecimals();
    if (this.shipmentNumberData) {
      this.shipmentNumberData = this.shipmentNumberData.replace(/-/g, "");
      this.searchForm.get('awbNumber').setValue(this.shipmentNumberData);
      this.onSearch();
    }
    else {
      this.forwardedData = this.getNavigateData(this.activatedRoute);
      if (this.forwardedData && this.forwardedData.awbNumber) {
        this.forwardedData.awbNumber = this.forwardedData.awbNumber;
      } else if (this.forwardedData && this.forwardedData.shipmentNumber) {
        this.forwardedData.awbNumber = this.forwardedData.shipmentNumber;
      }
      if (this.forwardedData && this.forwardedData.awbDate) {
        this.forwardedData.awbDate = this.forwardedData.awbDate;
      } else if (this.forwardedData && this.forwardedData.shipmentDate) {
        this.forwardedData.awbDate = this.forwardedData.shipmentDate;
      }
      if (this.forwardedData && Object.keys(this.forwardedData).length > 0) {
        this.searchForm.patchValue(this.forwardedData);
        this.onSearch();
      }
      this.variable = Math.random()
    }
  }

  /**
   * Search Record Data
   */
  onSearch() {
    if (!this.searchForm.valid) {
      return;
    }
    this.searchForm.validate();
    if (!this.searchForm.valid) {
      return;
    }
    let hawbdata: SearchHouseWayBillListform = this.searchForm.getRawValue();
    this.awbService.getHouseWayBillList(hawbdata).subscribe(response => {
      this.resetFormMessages();
      this.form.reset();
      this.onSuccess = false;
      this.originShipperMandatoryflag = false;
      this.destinationConsigneeMandatoryFlag = false;

      if (response.data && !this.showResponseErrorMessages(response.data)) {
        if (response.data.handledByHouse == 'M') {
          this.showErrorMessage('awb.handledby.master');
          return;
        }
        this.globalShipmentId = response.data.id;
        this.onSuccess = true;
        this.makeShcAvailable(response.data.maintainHouseDetailsList);
        this.form.patchValue(response.data);
        for (const eachRow of (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).value) {
          if (eachRow.hawbNumber == this.checkIndex) {
            eachRow.check = true;
          }
          if (eachRow.houseDimension == null) {
            eachRow.houseDimension = new HousewayDimentionForm();
            eachRow.houseDimension.volumetricWeight = 0.00;
          }
        }
      } else {
        if (response.data && response.data.messageList) {
          this.showErrorStatus(response.data.messageList[0].code);
        } else {
          this.showErrorStatus('eq.norecorfound.m');
        }
      }
    }, error => {
      this.showErrorMessage(error);
    }
    );
  }

  makeShcAvailable(record) {
    if (record) {
      for (const eachRow of record) {
        if (eachRow.shc) {
          for (const eachRowShc of eachRow.shc) {
            if (!eachRowShc.code) {
              eachRow.shc = [];
            }
          }
        }
      }
    }
  }

  onAdd() {
    this.resetFormMessages();
    (<NgcFormArray>this.addHouseForm.get(["maintainHouseDetailsList"])).resetValue([]);
    for (let i = 0; i < 10; i++) {
      (<NgcFormArray>this.addHouseForm.get(["maintainHouseDetailsList"])).addValue(
        [{
          origin: this.form.get('origin').value,
          pieces: null,
          weight: null,
          hawbNumber: null,
          destination: this.form.get('destination').value,
          natureOfGoods: null,
          weightUnitCode: 'K',
          chargeableWeight: null,
          houseDimension: {
            volumetricWeight: null,
            volumeUnitCode: 'MC',
            unitCode: 'CMT'
          },
          shc: []
        }]);
    }
    this.windowOpenFlag = true;
    this.addHouseFormWindow.open();

    this.addHouseForm.get("awbNumber").setValue(this.searchForm.get("awbNumber").value);
    this.addHouseForm.get("origin").setValue(this.form.get('origin').value);
    this.addHouseForm.get("destination").setValue(this.form.get('destination').value);
    this.addHouseForm.get("pieces").setValue(this.form.get('pieces').value);
    this.addHouseForm.get("weight").setValue(this.form.get('weight').value);
    this.addHouseForm.get("chargeableWeight").setValue(this.form.get('chargeableWeight').value);
    this.addHouseForm.get("hawbCount").setValue(this.form.get('totalHWB').value);
    this.addHouseForm.get("sumofPieces").setValue(this.form.get('totalPieces').value);
    this.addHouseForm.get("sumofWeight").setValue(this.form.get('totalWeight').value);
    this.addHouseForm.get("sumofChgWeight").setValue(this.form.get('totalChargeableWeight').value);
  }

  onAddHouseList() {
    (<NgcFormArray>this.addHouseForm.get(["maintainHouseDetailsList"])).addValue(
      [{
        origin: this.form.get('origin').value,
        pieces: null,
        weight: null,
        hawbNumber: null,
        destination: this.form.get('destination').value,
        natureOfGoods: null,
        weightUnitCode: 'K',
        chargeableWeight: null,
        houseDimension: {
          volumetricWeight: null,
          volumeUnitCode: 'MC',
          unitCode: 'CMT'
        },
        shc: [],
      }]);
    //  this.windowOpenFlag = true;
    //  this.addHouseFormWindow.open();
  }

  onDeleteHouse(event) {
    (<NgcFormArray>this.addHouseForm.get(['maintainHouseDetailsList'])).markAsDeletedAt(event);
    this.calculateData(null);
  }

  /* 
  * On save 
  */
  onSave() {
    if (!this.form.valid) {
      this.form.validate();
      return;
    }
    this.form.get('hawbNumber').setValue(this.searchForm.get('hawbNumber').value);
    if (this.validatorsOnSave((<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).value)) {
      this.onSaveHouse((<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).value);
    }
  }

  onSaveHouse(event) {
    if (event) {
      this.hawbdata = this.form.getRawValue();
      if (this.hawbdata.maintainHouseDetailsList.length == 1) {
        for (const eachRow of this.hawbdata.maintainHouseDetailsList) {
          if (eachRow.hawbNumber == null) {
            this.showErrorMessage("ERR_HAWB_14");
            return;
          }
        }
      }
    } else {
      this.hawbdata = this.addHouseForm.getRawValue();
    }
    if (this.hawbdata.invalid) {
      this.showErrorStatus("EXPIMPEXT14");
      return;
    }

    this.hawbdata.awbNumber = this.searchForm.get('awbNumber').value;
    this.hawbdata.id = this.globalShipmentId;
    const dataToSet = [];
    let awbChgWeight = 0;
    if (this.hawbdata.maintainHouseDetailsList) {
      for (const eachRow of this.hawbdata.maintainHouseDetailsList) {
        if (eachRow.hawbNumber && eachRow.flagCRUD !== 'R') {
          if (eachRow.pieces && eachRow.origin && eachRow.destination && eachRow.weight && eachRow.chargeableWeight &&
            eachRow.natureOfGoods && eachRow.weightUnitCode) {
            eachRow.masterAwbId = this.globalShipmentId;
            eachRow.awbNumber = this.searchForm.get('awbNumber').value;
            dataToSet.push(eachRow);
            if (eachRow.houseDimension.flagCRUD != 'R' && eachRow.houseDimension.volumetricWeight > eachRow.weight) {
              eachRow.chargeableWeight = eachRow.houseDimension.volumetricWeight;
            }
          } else {
            this.showErrorStatus('ERR_HAWB_08');
            return;
          }
        }
        awbChgWeight = Number(eachRow.chargeableWeight) + Number(awbChgWeight);
      }
    }
    this.hawbdata.maintainHouseDetailsList = [];
    for (const eachRowdata of dataToSet) {
      if (eachRowdata.shc && eachRowdata.shc.length > 0) {
        for (const eachRowdataShc of eachRowdata.shc) {
          eachRowdataShc.houseId = eachRowdata.houseId;
        }
      }
    }
    this.hawbdata.maintainHouseDetailsList = dataToSet;
    this.hawbdata.pieces = this.form.get('pieces').value;
    this.hawbdata.weight = this.form.get('weight').value;
    if (this.form.get('chargeableWeight').value == null) {
      this.hawbdata.chargeableWeight = 0;
    } else {
      this.hawbdata.chargeableWeight = this.form.get('chargeableWeight').value;
    }
    this.hawbdata.totalChargeableWeight = awbChgWeight;
    this.awbService.onSaveHouse(this.hawbdata).subscribe(response => {
      if (!response) {
        this.addHouseFormWindow.close();
        this.windowOpenFlag = false;

        this.checkIndex = null;
        this.onSearch();
        this.showSuccessStatus('g.completed.successfully');
        return;
      }
      if (!response.messageList) {
        this.addHouseFormWindow.close();
        this.windowOpenFlag = false;
        this.checkIndex = null;
        this.onSearch();
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.showErrorMessage(response.messageList[0].code,null,response.messageList[0].placeHolder);
      }
    });
  }

  onEdit(index) {
    this.resetFormMessages();
    this.customerInformationForm.reset();
    const dataToGet = {
      id: (<NgcFormControl>this.form.get(['maintainHouseDetailsList', index, 'houseId'])).value
    }

    this.awbService.getConsigneeShipperDetails(dataToGet).subscribe(response => {
      response.data.poFlag = (<NgcFormControl>this.form.get(['maintainHouseDetailsList', index, 'poFlag'])).value;
      response.data.doFlag = (<NgcFormControl>this.form.get(['maintainHouseDetailsList', index, 'doFlag'])).value;
      response.data.origin = (<NgcFormControl>this.form.get(['maintainHouseDetailsList', index, 'origin'])).value;
      response.data.pieces = (<NgcFormControl>this.form.get(['maintainHouseDetailsList', index, 'pieces'])).value;
      response.data.weight = (<NgcFormControl>this.form.get(['maintainHouseDetailsList', index, 'weight'])).value;
      response.data.awbNumber = (<NgcFormControl>this.form.get(['maintainHouseDetailsList', index, 'awbNumber'])).value;
      response.data.hawbNumber = (<NgcFormControl>this.form.get(['maintainHouseDetailsList', index, 'hawbNumber'])).value;
      response.data.destination = (<NgcFormControl>this.form.get(['maintainHouseDetailsList', index, 'destination'])).value;
      this.customerInformationForm.patchValue(response.data);

      if (!NgcUtility.isBlank(this.customerInformationForm.get(['consignee', 'appointedAgentCode']).value)) {

        this.customerInformationForm.get(['consignee', 'oldCode']).patchValue(this.customerInformationForm.get(['consignee', 'appointedAgentCode']).value);

      }
      if (response.data.consignee != null && response.data.consignee.code != null) {
        this.customerInformationForm.get(['consignee', 'customerCode']).patchValue(response.data.consignee.code)
      }
      let originVal = this.customerInformationForm.get('origin').value;
      let destinationVal = this.customerInformationForm.get('destination').value;

      if (NgcUtility.isTenantAirport(originVal)) {
        this.originShipperMandatoryflag = true;
        this.destinationConsigneeMandatoryFlag = false;
      }

      if (NgcUtility.isTenantAirport(destinationVal)) {
        this.originShipperMandatoryflag = false;
        this.destinationConsigneeMandatoryFlag = true;
      }

      if (!NgcUtility.isTenantAirport(originVal) && !NgcUtility.isTenantAirport(destinationVal)) {
        this.originShipperMandatoryflag = true;
        this.destinationConsigneeMandatoryFlag = true;
      }
      this.windowOpenFlag = true;
      this.customerInformationWindow.open();
    });
  }

  onSaveCustomerinformation() {
    if (this.form.getRawValue().deliveredOn) {
      this.showErrorMessage("shipment.already.delivered");
      return;
    }
    if (this.customerInformationForm.get('doFlag').value) {
      this.showErrorMessage("freighout.or.doissued");
      return;
    }
    if (this.customerInformationForm.get('poFlag').value) {
      this.showErrorMessage("poissued");
      return;
    }
    this.customerInformationForm.get('awbNumber').patchValue(this.searchForm.get('awbNumber').value);
    const dataToSaveCustomerInfo = this.customerInformationForm.getRawValue();
    dataToSaveCustomerInfo.masterAwbId = this.globalShipmentId;
    if (((this.customerInformationForm.get(['consignee', 'name']).value) == null ||
      (this.customerInformationForm.get(['consignee', 'address', 'streetAddress']).value) == null ||
      (this.customerInformationForm.get(['consignee', 'address', 'place']).value) == null ||
      (this.customerInformationForm.get(['consignee', 'address', 'country']).value) == null) && (this.destinationConsigneeMandatoryFlag == true)) {
      this.showErrorMessage("ERR_HAWB_10");
      return;
    }
    //    if (((this.customerInformationForm.get(['shipper', 'name']).value) == null ||
    //      (this.customerInformationForm.get(['shipper', 'address', 'streetAddress']).value) == null ||
    //      (this.customerInformationForm.get(['shipper', 'address', 'place']).value) == null ||
    //      (this.customerInformationForm.get(['shipper', 'address', 'country']).value) == null) && (this.originShipperMandatoryflag == true)) {
    //      this.showErrorMessage("ERR_HAWB_11");
    //      return;
    //    }

    this.checkValidation(dataToSaveCustomerInfo);
    this.awbService.onSaveCustomerinformation(dataToSaveCustomerInfo).subscribe(response => {
      if (!response) {
        this.customerInformationWindow.close();
        this.windowOpenFlag = false;
        this.checkIndex = null;
        this.onSearch();
        this.showSuccessStatus('g.completed.successfully');
        return;
      }
      if (!response.messageList) {
        this.customerInformationWindow.close();
        this.windowOpenFlag = false;
        this.checkIndex = null;
        this.onSearch();
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.showErrorStatus(response.messageList[0].code);
      }
    });
  }

  onAddConsigneeShipper() {
    this.resetFormMessages();
    if (this.form.getRawValue().deliveredOn) {
      this.showErrorMessage("shipment.already.delivered");
      return;
    }
    let checkFlag = false;
    for (const eachRow of (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).value) {
      if (eachRow.check) {
        checkFlag = true;
        if (eachRow.poFlag) {
          this.showErrorMessage("poissued");
          return;
        }
        if (eachRow.doFlag) {
          this.showErrorMessage("freighout.or.doissued");
          return;
        }
      }
    }
    if (!checkFlag) {
      this.showErrorMessage("selectAtleastOneRecord");
      return;
    }
    this.customerInformationFormList.reset();
    this.windowOpenFlag = true;
    this.customerInformationWindowList.open();
  }

  onSaveCustomerinformationList() {
    if (this.form.getRawValue().deliveredOn) {
      this.showErrorMessage("shipment.already.delivered");
      return;
    }

    const checkRecord = this.form.getRawValue();
    const consigneeShipperDetails = this.customerInformationFormList.getRawValue();
    if ((this.customerInformationFormList.get(['consignee', 'name']).value) == null ||
      (this.customerInformationFormList.get(['consignee', 'address', 'streetAddress']).value) == null ||
      (this.customerInformationFormList.get(['consignee', 'address', 'place']).value) == null ||
      (this.customerInformationFormList.get(['consignee', 'address', 'country']).value) == null) {
      this.showErrorMessage("ERR_HAWB_10");
      return;
    }

    // if ((this.customerInformationFormList.get(['shipper', 'name']).value) == null ||
    //   (this.customerInformationFormList.get(['shipper', 'address', 'streetAddress']).value) == null ||
    //   (this.customerInformationFormList.get(['shipper', 'address', 'place']).value) == null ||
    //   (this.customerInformationFormList.get(['shipper', 'address', 'country']).value) == null) {
    //   this.showErrorMessage("ERR_HAWB_11");
    //   return;
    // }

    this.validatorsOnSave(checkRecord.maintainHouseDetailsList);
    const requestedData = [];
    for (const eachRow of checkRecord.maintainHouseDetailsList) {
      if (eachRow.check) {

        if (eachRow.doFlag) {
          this.showErrorMessage("freighout.or.doissued");
          return;
        }
        if (eachRow.poFlag) {
          this.showErrorMessage("poissued");
          return;
        }

        eachRow.shipper = null;
        eachRow.consignee = null;
        if (eachRow.consigneeName) {
          eachRow.consignee = NgcUtility.clone(consigneeShipperDetails.consignee);
          if (consigneeShipperDetails.consignee.name) {
            eachRow.consignee.flagCRUD = 'U';
          } else {
            eachRow.consignee.flagCRUD = 'D';
          }
        } else {
          eachRow.consignee = NgcUtility.clone(consigneeShipperDetails.consignee);
          eachRow.consignee.flagCRUD = 'C';
        }
        if (eachRow.shipperName) {
          eachRow.shipper = NgcUtility.clone(consigneeShipperDetails.shipper);
          if (consigneeShipperDetails.shipper.name) {
            eachRow.shipper.flagCRUD = 'U';
          } else {
            eachRow.shipper.flagCRUD = 'D';
          }
        } else {
          eachRow.shipper = NgcUtility.clone(consigneeShipperDetails.shipper);
          eachRow.shipper.flagCRUD = 'C';
        }
        requestedData.push(eachRow);
      }
    }
    checkRecord.maintainHouseDetailsList = [];
    checkRecord.maintainHouseDetailsList = requestedData;
    for (let eachRowData of checkRecord.maintainHouseDetailsList) {
      if (eachRowData.consignee && eachRowData.consignee.name) {
        eachRowData.consignee.houseId = eachRowData.houseId;
        eachRowData.consignee.hawbNumber = eachRowData.hawbNumber;
        eachRowData.consignee.shipmentNumber = this.searchForm.get('awbNumber').value;
        eachRowData.consignee.address.houseId = eachRowData.houseId;
      } else {
        eachRowData.consignee.flagCRUD = 'D';
      }
      if (eachRowData.shipper && eachRowData.shipper.name) {
        eachRowData.shipper.houseId = eachRowData.houseId;
        eachRowData.shipper.hawbNumber = eachRowData.hawbNumber;
        eachRowData.shipper.shipmentNumber = this.searchForm.get('awbNumber').value;
        eachRowData.shipper.address.houseId = eachRowData.houseId;
      } else {
        eachRowData.shipper.flagCRUD = 'D';
      }
    }
    checkRecord.consignee.appointedAgentCode = this.customerInformationFormList.get(['consignee', 'appointedAgentCode']).value;
    checkRecord.consignee.appointedAgent = this.customerInformationFormList.get(['consignee', 'appointedAgent']).value;
    checkRecord.awbNumber = this.searchForm.get('awbNumber').value;
    this.awbService.onSaveCustomerinformationList(checkRecord).subscribe(response => {
      if (!response) {
        this.customerInformationWindowList.close();
        this.windowOpenFlag = false;
        this.checkIndex = null;
        this.onSearch();
        this.showSuccessStatus('g.completed.successfully');
        return;
      }
      if (!response.messageList) {
        this.customerInformationWindowList.close();
        this.windowOpenFlag = false;
        this.checkIndex = null;
        this.onSearch();
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.showErrorStatus(response.messageList[0].code);
      }
    });
  }

  /**
   * On Change of Consignee Name
   * @param event 
   */
  onSelectConsigneeNameAdd(event) {
    this.consigneAgentSourceParameter = this.createSourceParameter(null);
    this.checkAppointedAgent(event);
    if (event.code) {
      this.consigneAgentSourceParameter = this.createSourceParameter(event.code);
      this.customerInformationFormList.get(['consignee', 'customerCode']).setValue(event.code, { onlySelf: true, emitEvent: false });
      this.customerInformationFormList.get(['consignee', 'code']).setValue(event.code, { onlySelf: true, emitEvent: false });
      this.customerInformationFormList.get(['consignee', 'name']).setValue(event.desc, { onlySelf: true, emitEvent: false });
      this.customerInformationFormList.get(['consignee', 'address', 'place']).setValue(event.param2);
      this.customerInformationFormList.get(['consignee', 'address', 'state']).setValue(event.parameter2);
      this.customerInformationFormList.get(['consignee', 'address', 'postal']).setValue(event.parameter1);
      this.customerInformationFormList.get(['consignee', 'address', 'country']).setValue(event.parameter3);
      this.customerInformationFormList.get(['consignee', 'address', 'streetAddress']).setValue(event.param1);
    } else {
      this.customerInformationFormList.get(['consignee', 'code']).setValue(null);
      //   this.customerInformationFormList.get(['consignee', 'name']).setValue(null);
      this.customerInformationFormList.get(['consignee', 'address', 'place']).setValue(null);
      this.customerInformationFormList.get(['consignee', 'address', 'state']).setValue(null);
      this.customerInformationFormList.get(['consignee', 'address', 'postal']).setValue(null);
      this.customerInformationFormList.get(['consignee', 'address', 'country']).setValue(null);
      this.customerInformationFormList.get(['consignee', 'address', 'streetAddress']).setValue(null);
      this.customerInformationFormList.get(['consignee', 'customerCode']).setValue(null);
      this.customerInformationFormList.get(['consignee', 'appointedAgent']).setValue(null);
      this.customerInformationFormList.get(['consignee', 'appointedAgentCode']).setValue(null);
    }
  }

  /**
   * On Change of Consignee Name
   * @param event 
   */
  onSelectConsigneeNameEdit(event) {
    this.consigneAgentSourceParameter = this.createSourceParameter(null);
    this.checkAppointedAgentEdit(event);
    if (event.code) {
      this.consigneAgentSourceParameter = this.createSourceParameter(event.code);
      this.customerInformationForm.get(['consignee', 'customerCode']).setValue(event.code, { onlySelf: true, emitEvent: false });
      this.customerInformationForm.get(['consignee', 'code']).setValue(event.code, { onlySelf: true, emitEvent: false });
      this.customerInformationForm.get(['consignee', 'name']).setValue(event.desc, { onlySelf: true, emitEvent: false });
      this.customerInformationForm.get(['consignee', 'address', 'place']).setValue(event.param2);
      this.customerInformationForm.get(['consignee', 'address', 'state']).setValue(event.parameter2);
      this.customerInformationForm.get(['consignee', 'address', 'postal']).setValue(event.parameter1);
      this.customerInformationForm.get(['consignee', 'address', 'country']).setValue(event.parameter3);
      this.customerInformationForm.get(['consignee', 'address', 'streetAddress']).setValue(event.param1);
    }
    else {
      this.customerInformationForm.get(['consignee', 'code']).setValue(null);
      //   this.customerInformationForm.get(['consignee', 'name']).setValue(null);
      this.customerInformationForm.get(['consignee', 'address', 'place']).setValue(null);
      this.customerInformationForm.get(['consignee', 'address', 'state']).setValue(null);
      this.customerInformationForm.get(['consignee', 'address', 'postal']).setValue(null);
      this.customerInformationForm.get(['consignee', 'address', 'country']).setValue(null);
      this.customerInformationForm.get(['consignee', 'address', 'streetAddress']).setValue(null);
      this.customerInformationForm.get(['consignee', 'customerCode']).setValue(null);
      this.customerInformationForm.get(['consignee', 'appointedAgent']).setValue(null);
      this.customerInformationForm.get(['consignee', 'appointedAgentCode']).setValue(null);
    }

  }



  checkAppointedAgentEdit(record) {
    this.retrieveLOVRecords("AWB_RELEASE_APPOINTED_AGENT_DATA_WITHOUT_PARAMETER").subscribe(response => {
      let responseData = []
      responseData = response;
      if (responseData) {
        for (const eachRow of responseData) {
          if (eachRow.code == 'IXX') {
            this.customerInformationFormList.get(['consignee', 'appointedAgentCode']).setValue(eachRow.code);
            this.customerInformationFormList.get(['consignee', 'appointedAgent']).setValue(eachRow.param1);
            break;
          }
        }
      }
    });
  }

  checkValidation(checkValid) {
    if (checkValid.consignee.name) {
      if (!checkValid.consignee.flagCRUD) {
        checkValid.consignee.flagCRUD = 'C';
      }
      checkValid.consignee.houseId = checkValid.id;
      if (!this.customerInformationForm.get('consignee').valid) {
        this.showErrorMessage("ERR_HAWB_10");
        return;
      }
    } else {
      checkValid.consignee = null;
    }
    if (checkValid.shipper.name) {
      if (!checkValid.shipper.flagCRUD) {
        checkValid.shipper.flagCRUD = 'C';
      }
      checkValid.shipper.houseId = checkValid.id;
      if (!this.customerInformationForm.get('shipper').valid) {
        this.showErrorMessage("ERR_HAWB_11");
        return;
      }
    } else {
      checkValid.shipper = null;
    }
  }


  /**
   * On Selection of Shipper Details patching the related value in TAB
   * @param event 
   * @param item 
   */
  onSelectShipperName(event) {
    if (event.code) {
      this.customerInformationForm.get(['shipper', 'customerCode']).setValue(event.code, { onlySelf: true, emitEvent: false });
      this.customerInformationForm.get(['shipper', 'code']).setValue(event.code, { onlySelf: true, emitEvent: false });
      this.customerInformationForm.get(['shipper', 'name']).setValue(event.desc, { onlySelf: true, emitEvent: false });
      this.customerInformationForm.get(['shipper', 'address', 'place']).setValue(event.param2);
      this.customerInformationForm.get(['shipper', 'address', 'state']).setValue(event.parameter2);
      this.customerInformationForm.get(['shipper', 'address', 'postal']).setValue(event.parameter1);
      this.customerInformationForm.get(['shipper', 'address', 'country']).setValue(event.parameter3);
      this.customerInformationForm.get(['shipper', 'address', 'streetAddress']).setValue(event.param1);
    }
    else {
      this.customerInformationForm.get(['shipper', 'code']).setValue(null);
      // this.customerInformationForm.get(['shipper', 'name']).setValue(null);
      this.customerInformationForm.get(['shipper', 'address', 'place']).setValue(null);
      this.customerInformationForm.get(['shipper', 'address', 'state']).setValue(null);
      this.customerInformationForm.get(['shipper', 'address', 'postal']).setValue(null);
      this.customerInformationForm.get(['shipper', 'address', 'country']).setValue(null);
      this.customerInformationForm.get(['shipper', 'address', 'streetAddress']).setValue(null);
    }

  }

  onSelectShipperNameList(event) {
    if (event.code) {
      this.customerInformationFormList.get(['shipper', 'customerCode']).setValue(event.code, { onlySelf: true, emitEvent: false });
      this.customerInformationFormList.get(['shipper', 'code']).setValue(event.code, { onlySelf: true, emitEvent: false });
      this.customerInformationFormList.get(['shipper', 'name']).setValue(event.desc, { onlySelf: true, emitEvent: false });
      this.customerInformationFormList.get(['shipper', 'address', 'place']).setValue(event.param2);
      this.customerInformationFormList.get(['shipper', 'address', 'state']).setValue(event.parameter2);
      this.customerInformationFormList.get(['shipper', 'address', 'postal']).setValue(event.parameter1);
      this.customerInformationFormList.get(['shipper', 'address', 'country']).setValue(event.parameter3);
      this.customerInformationFormList.get(['shipper', 'address', 'streetAddress']).setValue(event.param1);
    }
    else {
      this.customerInformationFormList.get(['shipper', 'code']).setValue(null);
      //    this.customerInformationFormList.get(['shipper', 'name']).setValue(null);
      this.customerInformationFormList.get(['shipper', 'address', 'place']).setValue(null);
      this.customerInformationFormList.get(['shipper', 'address', 'state']).setValue(null);
      this.customerInformationFormList.get(['shipper', 'address', 'postal']).setValue(null);
      this.customerInformationFormList.get(['shipper', 'address', 'country']).setValue(null);
      this.customerInformationFormList.get(['shipper', 'address', 'streetAddress']).setValue(null);
    }

  }

  validatorsOnSave(checkData) {
    /* 
    * Check Number Of Pieces or weight or Chargeable Weight 
    * Greater than as of AWB
    */
    let checkWeight = 0;
    let checkPieces = 0;
    for (const eachRow of checkData) {
      checkPieces = eachRow.pieces + checkPieces;
      checkWeight = Number(checkWeight.toFixed(NgcUtility.getApplicationChargeWeightDecimals())) + Number(eachRow.weight.toFixed(NgcUtility.getApplicationChargeWeightDecimals()));
    }
    if (checkPieces > this.form.get('pieces').value) {
      this.showErrorStatus('ERR_HAWB_03');
      return false;
    }
    // if (checkWeight > this.form.get('weight').value) {
    //   this.showErrorStatus('ERR_HAWB_04');
    //   return false;
    // }
    if (Number(checkWeight.toFixed(this.fractionScale)) > Number(this.form.get('weight').value.toFixed(this.fractionScale))) {
      this.showErrorStatus('ERR_HAWB_04');
      return false;
    }
    return true;
  }

  onCancel(event) {
    this.navigateBack(this.forwardedData);
  }

  onSelectOrigin(event, index, formValue) {
    if (!event.code) {
      if (formValue === 'form') {
        this.form.get(['maintainHouseDetailsList', index, 'origin']).setValue(null, { onlySelf: true, emitEvent: false })
      } else {
        this.addHouseForm.get(['maintainHouseDetailsList', index, 'origin']).setValue(null, { onlySelf: true, emitEvent: false })
      }
    }
  }

  onSelectDestination(event, index, formValue) {
    if (!event.code) {
      if (formValue === 'form') {
        this.form.get(['maintainHouseDetailsList', index, 'destination']).setValue(null, { onlySelf: true, emitEvent: false })
      } else {
        this.addHouseForm.get(['maintainHouseDetailsList', index, 'destination']).setValue(null, { onlySelf: true, emitEvent: false })
      }
    }
  }

  openAwbDocument() {
    let count = 0;
    let index = 0;
    let actualIndex = 0;
    if (this.form.get(['maintainHouseDetailsList']) && (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).length > 0) {
      for (const eachRow of (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).getRawValue()) {
        index++;
        if (eachRow.check) {
          actualIndex = index - 1;
          count++;
        }
      }
    }
    // if (count !== 1) {
    //   this.showErrorStatus("selectAtleastOneRecord");
    //   return;
    // }
    const sendData = this.searchForm.getRawValue();
    sendData.shipmentType = sendData.type;
    sendData.hwbNumber = sendData.hawbNumber;
    sendData.shipmentNumber = sendData.awbNumber;
    this.navigateTo(this.router, 'awbmgmt/awbdocument', sendData);
  }

  openShipmentLocation() {

    let count = 0;
    let index = 0;
    let actualIndex = 0;
    if (this.form.get(['maintainHouseDetailsList']) && (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).length > 0) {
      for (const eachRow of (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).getRawValue()) {
        index++;
        if (eachRow.check) {
          actualIndex = index - 1;
          count++;
        }
      }
    }
    if (count !== 1) {
      this.showErrorStatus("selectAtleastOneRecord");
      return;
    }
    const sendData = (<NgcFormGroup>this.form.get(['maintainHouseDetailsList', actualIndex])).getRawValue();
    sendData.shipmentType = 'AWB';
    sendData.hwbNumber = sendData.hawbNumber;
    sendData.awbNumber = this.searchForm.get('awbNumber').value;
    sendData.shipmentNumber = this.searchForm.get('awbNumber').value;

    this.navigateTo(this.router, '/awbmgmt/shipmentLocation', sendData);

  }

  openHwbInformation() {
    let count = 0;
    let index = 0;
    let actualIndex = 0;
    if (this.form.get(['maintainHouseDetailsList']) && (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).length > 0) {
      for (const eachRow of (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).getRawValue()) {
        index++;
        if (eachRow.check) {
          actualIndex = index - 1;
          count++;
        }
      }
    }
    if (count !== 1) {
      this.showErrorStatus("selectAtleastOneRecord");
      return;
    }
    const sendData = (<NgcFormGroup>this.form.get(['maintainHouseDetailsList', actualIndex])).getRawValue();
    sendData.shipmentType = 'AWB';
    sendData.hwbNumber = sendData.hawbNumber;
    sendData.awbNumber = this.searchForm.get('awbNumber').value;
    sendData.shipmentNumber = this.searchForm.get('awbNumber').value;

    this.navigateTo(this.router, '/awbmgmt/hwb-informationCR', sendData);

  }

  setAWBNumber(object) {
    if (object.code) {
      (<NgcFormControl>this.searchForm.get(["hawbNumber"])).setErrors(null);
    }
  }

  checkAppointedAgent(record) {
    this.retrieveLOVRecords("AWB_RELEASE_APPOINTED_AGENT_DATA_WITHOUT_PARAMETER").subscribe(response => {
      let responseData = []
      responseData = response;
      if (responseData) {
        for (const eachRow of responseData) {
          if (eachRow.code == 'IXX') {
            this.customerInformationFormList.get(['consignee', 'appointedAgentCode']).setValue(eachRow.code);
            this.customerInformationFormList.get(['consignee', 'appointedAgent']).setValue(eachRow.param1);
            break;
          }
        }
      }
    });
  }

  addDimension() {

    var count = 0;
    for (const eachRow of (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).value) {
      if (eachRow.check) {
        count++;
        this.checkIndex = eachRow.hawbNumber;
        if (eachRow.houseDimension) {
          this.HousewayDimentionForm.patchValue(eachRow.houseDimension);
          this.HousewayDimentionForm.get('pieces').patchValue(eachRow.pieces);
          this.HousewayDimentionForm.get('weightUnitCode').patchValue(eachRow.weightUnitCode);
          this.HousewayDimentionForm.get('houseId').patchValue(eachRow.houseId);
        }
        else {
          this.HousewayDimentionForm.reset();
          this.HousewayDimentionForm.get('unitCode').setValue('CMT');
          this.HousewayDimentionForm.get('volumeUnitCode').setValue('MC');
        }
      }
    }
    if (count == 0) {
      this.showErrorMessage("export.select.record");
      return;
    }
    if (count > 1) {
      this.showErrorMessage("export.select.only.one.record");
      return;
    }
    this.openDimensionPopup();
  }

  openDimensionPopup() {
    this.resetFormMessages();
    this.setDimentionValues();
    this.updateTotalshipment();
    this.windowOpenFlag = true;
    this.dimensionWindow.open();
  }

  eventCall(event) {
    this.setDimentionValues();
  }

  setDimentionValues() {
    const dimention: Dimention = new Dimention();
    for (const eachRow of (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).value) {
      if (eachRow.check) {
        dimention.weightCode = eachRow.weightUnitCode;
        dimention.shipmentPcs = eachRow.pieces;
        dimention.shipmentWeight = eachRow.weight;
      }
    }
    dimention.unitCode = this.HousewayDimentionForm.get('unitCode').value;
    dimention.volumeCode = this.HousewayDimentionForm.get('volumeUnitCode').value;
    const dimentionList1 = (<NgcFormArray>this.HousewayDimentionForm.get('dimensionList')).getRawValue();
    dimentionList1.forEach(element => {
      const dimentionDetail: DimensionDetails = new DimensionDetails();
      dimentionDetail.pcs = element.pieces;
      dimentionDetail.length = element.length;
      dimentionDetail.width = element.width;
      dimentionDetail.height = element.height;
      if (dimentionDetail.pcs !== null && dimentionDetail.length !== null && dimentionDetail.width !== null && dimentionDetail.height !== null)
        dimention.dimensionDetails.push(dimentionDetail);
    });
    if (dimention.dimensionDetails.length > 0) {
      this.awbService.getDimensionVolumetricWeight(dimention).subscribe(resp => {
        (<NgcFormArray>this.HousewayDimentionForm.get('dimensionList')).controls.forEach((dim: NgcFormGroup) => {
          let pieces = +dim.get('pieces').value;
          let length = +dim.get('length').value;
          let width = +dim.get('width').value;
          let height = +dim.get('height').value;
          const dimensionData = resp.data;
          if (dimensionData !== null) {
            const volume = dimensionData.dimensionDetails.filter(ele => (ele.pcs === pieces && ele.length === length && ele.width === width && ele.height === height))[0];
            dim.get('volume').setValue(volume.volume);
            this.HousewayDimentionForm.get('volumeWeight').setValue(resp.data.calculatedVolume);
            this.HousewayDimentionForm.get('volumetricWeight').setValue(resp.data.volumetricWeight);
            this.HousewayDimentionForm.get('volumeWeight').setValue(resp.data.calculatedVolume);
          }
        });

      });
    }
  }


  addDimensionRow() {
    (<NgcFormArray>this.HousewayDimentionForm.controls['dimensionList'])
      .addValue([new BookingDimnesion()]);
    this.refresh();
  }


  changeModel(event, column, dimention: NgcFormGroup, index) {
    if (column === 0) {
      this.updateTotalshipment();
    } else if (column === 1) {
    } else if (column === 2) {
    } else {
    }
    if (dimention.get('pieces').value !== null && dimention.get('length').value !== null
      && dimention.get('width').value !== null && dimention.get('height').value !== null) {
      this.setDimentionValues();
    }
  }

  updateTotalshipment() {
    let picesCount = 0;
    (<NgcFormArray>this.HousewayDimentionForm.get('dimensionList')).getRawValue().forEach(ele => { picesCount += +ele.pieces; });
    this.HousewayDimentionForm.get('totalDimpieces').setValue(picesCount);
  }

  saveHouseDimension() {
    if (this.form.getRawValue().deliveredOn) {
      this.showErrorMessage("shipment.already.delivered");
      return;
    }
    const HouseDimensionUpdateRequest: MaintainHouseDetailsList = new MaintainHouseDetailsList();
    HouseDimensionUpdateRequest.houseDimension = this.HousewayDimentionForm.getRawValue();
    let awbChargeableWeight = 0;
    for (const eachRow of (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).value) {
      if (eachRow.check) {
        if (eachRow.doFlag) {
          this.showErrorMessage("freighout.or.doissued");
          return;
        }
        if (eachRow.poFlag) {
          this.showErrorMessage("poissued");
          return;
        }
        HouseDimensionUpdateRequest.houseDimension.houseId = eachRow.houseId;
        HouseDimensionUpdateRequest.houseDimension.pieces = eachRow.pieces;
        HouseDimensionUpdateRequest.weight = eachRow.weight;
        if (HouseDimensionUpdateRequest.houseDimension.volumetricWeight > eachRow.weight) {
          eachRow.chargeableWeight = HouseDimensionUpdateRequest.houseDimension.volumetricWeight;
        }
      }
      awbChargeableWeight = Number(eachRow.chargeableWeight) + Number(awbChargeableWeight);
    }
    this.form.get('totalChargeableWeight').setValue(awbChargeableWeight);
    if (this.form.get('chargeableWeight').value < this.form.get('totalChargeableWeight').value) {
      HouseDimensionUpdateRequest.awbChargeableWeight = this.form.get('totalChargeableWeight').value;
      HouseDimensionUpdateRequest.masterAwbId = this.form.get('id').value;
    }
    HouseDimensionUpdateRequest.houseDimension.flagUpdate = 'Y';
    this.awbService.editHouseDimension(HouseDimensionUpdateRequest).subscribe(response => {
      this.refreshFormMessages(response);
      if (response.data !== null) {
        this.showSuccessStatus('g.completed.successfully');
        this.dimensionWindow.close();
        this.windowOpenFlag = false;
        this.HousewayDimentionForm.reset();
        this.onSearch();
      }
    });
  }

  deleteHouseDimension() {
    const flightDeleteDimensionRequest = new MaintainHouseDetailsList();
    const deleteDimension = new Array<any>();
    var checkFlag = false;
    (<NgcFormArray>this.HousewayDimentionForm.controls['dimensionList']).getRawValue().forEach(ele => {
      if (ele.checkBoxFlag) {
        checkFlag = true;
        ele.flagDelete = 'Y';
        deleteDimension.push(ele);
      }
    });

    if (!checkFlag) {
      this.showErrorMessage("selectAtleastOneRecord");
      return;
    }
    if (this.form.getRawValue().deliveredOn) {
      this.showErrorMessage("shipment.already.delivered");
      return;
    }

    for (const eachRow of (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).value) {
      if (eachRow.check) {
        if (eachRow.doFlag) {
          this.showErrorMessage("freighout.or.doissued");
          return;
        }
        if (eachRow.poFlag) {
          this.showErrorMessage("poissued");
          return;
        }
      }
    }

    const nonDeletedDimension = new Array<any>();
    (<NgcFormArray>this.HousewayDimentionForm.controls['dimensionList']).getRawValue().forEach(ele => {
      if (!ele.checkBoxFlag) {
        nonDeletedDimension.push(ele);
      }
    });

    flightDeleteDimensionRequest.pieces = this.HousewayDimentionForm.get('pieces').value;
    flightDeleteDimensionRequest.weightUnitCode = this.HousewayDimentionForm.get('weightUnitCode').value;
    flightDeleteDimensionRequest.houseId = this.HousewayDimentionForm.get('houseId').value;
    flightDeleteDimensionRequest.houseDimension.dimensionList = deleteDimension;
    flightDeleteDimensionRequest.houseDimension.flagDelete = 'Y';
    this.awbService.editHouseDimension(flightDeleteDimensionRequest).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.updateTotalshipment();
        this.showSuccessStatus('g.completed.successfully');
        this.dimensionWindow.close();
        this.windowOpenFlag = false;
        this.onSearch();
      } else {
        this.showResponseErrorMessages(response);
      }
    });
  }

  openDeleteHouseWindow() {
    this.resetFormMessages();
    var count = 0;
    for (const eachRow of (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).value) {
      if (eachRow.check) {
        count++;
        this.deleteform.get('awbNumber').patchValue(this.searchForm.get('awbNumber').value);
        this.deleteform.get('hawbNumber').patchValue(eachRow.hawbNumber);
        this.deleteform.get('shipmentId').patchValue(this.form.get('id').value);
        this.deleteform.get('remarks').reset();
      }
    }
    if (count == 0) {
      this.showErrorMessage("export.select.record");
      return;
    }
    if (count > 1) {
      this.showErrorMessage("export.select.only.one.record");
      return;
    }
    this.windowOpenFlag = true;
    this.deleteWindow.open();

  }

  onAWBChange(event) {
    let search: ShipmentLocationSearch = new ShipmentLocationSearch();
    search.shipmentNumber = this.deleteform.get('awbNumber').value;
    search.shipmentType = "AWB"
    search.appFeatures = null;
    this.AWBNumber = this.createSourceParameter(this.deleteform.get('awbNumber').value);
  }

  onDelete() {
    this.deleteform.validate();
    if (this.deleteform.invalid) {
      this.showErrorStatus('enter.remarks');
      return;
    }
    let search: DeleteHouseWayBillSearchModel = new DeleteHouseWayBillSearchModel();
    search.shipmentNumber = this.deleteform.get('awbNumber').value;
    search.hawbNumber = this.deleteform.get('hawbNumber').value;
    search.remarks = this.deleteform.get('remarks').value;
    search.shipmentId = this.deleteform.get('shipmentId').value;
    this.awbService.deleteHouseWayBill(search).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.data) {
          this.showSuccessStatus("g.completed.successfully");
          this.checkIndex = null;
          this.deleteWindow.close();
          this.windowOpenFlag = false;
          this.onSearch();
        }
      }
    })
  }


  openHawbRecord() {
    this.hawbResponseRecordForm.reset();
    var count = 0;
    for (const eachRow of (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).value) {
      if (eachRow.check) {
        count++;
        this.checkIndex = eachRow.hawbNumber;
        this.searchHawbRecordForm.get('awbNumber').patchValue(this.searchForm.get('awbNumber').value);
        this.searchHawbRecordForm.get('hawbNumber').patchValue(eachRow.hawbNumber);
      }
    }
    if (count == 0) {
      this.showErrorMessage("export.select.record");
      return;
    }
    if (count > 1) {
      this.showErrorMessage("export.select.only.one.record");
      return;
    }

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
          if (response.data.houseModel.shipper) {
            this.checkMandatoryShipper(response.data.houseModel.shipper.name);
          }
          if (!response.data.houseModel.weightUnitCode) {
            this.hawbResponseRecordForm.get('houseModel').get('weightUnitCode').setValue('K');
          }
          if (response.data.houseModel.consignee) {
            if (response.data.houseModel.consignee.appointedAgent &&
              !response.data.houseModel.consignee.appointedAgentCode) {
              //this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgentCode']).setValue('IXX');
            }
            this.checkMandatoryConsignee(response.data.houseModel.consignee.name);
            this.consigneAgentSourceParameter = this.createSourceParameter(response.data.houseModel.consignee.code);
          }

        }
        if (response.success) {
          this.windowOpenFlag = true;
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

  checkMandatoryShipper(event) {
    // if (event) {
    //   this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'name']).setValidators(Validators.required);
    //   this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'place']).setValidators(Validators.required);
    //   this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'postal']).setValidators(Validators.required);
    //   this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'country']).setValidators(Validators.required);
    //   this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'streetAddress']).setValidators(Validators.required);
    // } else {
    //   this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'name']).setValidators([]);
    //   this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'place']).setValidators([]);
    //   this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'postal']).setValidators([]);
    //   this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'country']).setValidators([]);
    //   this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'streetAddress']).setValidators([]);
    // }
  }

  checkMandatoryConsignee(event) {
    // if (event) {
    //   this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'name']).setValidators(Validators.required);
    //   this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'place']).setValidators(Validators.required);
    //   this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'postal']).setValidators(Validators.required);
    //   this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgentCode']).setValidators(Validators.required);
    //   this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'country']).setValidators(Validators.required);
    //   this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'streetAddress']).setValidators(Validators.required);
    // } else {
    //   this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'name']).setValidators([]);
    //   this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'place']).setValidators([]);
    //   this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'postal']).setValidators([]);
    //   this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'country']).setValidators([]);
    //   this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgentCode']).setValidators([]);
    //   this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'streetAddress']).setValidators([]);
    // }
  }

  onSelectConsigneeName(event) {
    this.checkMandatoryConsignee(event.code);
    this.checkAppointedAgentRecord(event);
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
      //  this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'name']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'place']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'state']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'postal']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'country']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'address', 'streetAddress']).setValue(null);
    }
  }

  checkAppointedAgentRecord(record) {
    this.retrieveLOVRecords("AWB_RELEASE_APPOINTED_AGENT_DATA_WITHOUT_PARAMETER").subscribe(response => {
      let responseData = []
      responseData = response;
      if (responseData) {
        for (const eachRow of responseData) {
          if (eachRow.code == 'IXX') {
            this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgentCode']).setValue(eachRow.code);
            this.hawbResponseRecordForm.get(['houseModel', 'consignee', 'appointedAgent']).setValue(eachRow.param1);
            break;
          }
        }
      }
    });
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

  onSelectShipperNamerecord(event) {
    this.checkMandatoryShipper(event.code);
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
      //   this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'name']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'state']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'place']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'country']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'postal']).setValue(null);
      this.hawbResponseRecordForm.get(['houseModel', 'shipper', 'address', 'streetAddress']).setValue(null);
    }
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
      if (NgcUtility.getTenantConfiguration().airportCode != (this.form.get('destination').value)) {
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
        this.windowOpenFlag = false;
        this.autoSearchShipmentInfo.emit(true);
        this.onSearch();
      } else {
        this.showErrorStatus(response.messageList[0].code);
      }
    });
  }

  closeDimensionWindow() {
    this.dimensionWindow.close();
    this.windowOpenFlag = false;
  }
  closeCustomerWindowList() {
    this.windowOpenFlag = false;
    this.customerInformationWindowList.close();
  }
  closeCustomerWindow() {
    this.windowOpenFlag = false;
    this.customerInformationWindow.close();
  }
  closeAddHouseWindow() {
    this.addHouseFormWindow.close();
    this.windowOpenFlag = false;

  }
  closeDeleteWindow() {
    this.deleteWindow.close();
    this.windowOpenFlag = false;

  }
  closeRecordWindow() {
    this.recordWindow.close();
    this.windowOpenFlag = false;

  }

  calculateData(type) {
    this.resetFormMessages();
    let sumofChgWeight = 0;
    let sumofPieces = 0;
    let sumofWeight = 0
    let hawbCount = 0
    sumofChgWeight = this.form.get("totalChargeableWeight").value;
    sumofPieces = this.form.get("totalPieces").value;
    sumofWeight = this.form.get("totalWeight").value;
    hawbCount = this.form.getList(["maintainHouseDetailsList"]).length;
    this.addHouseForm.getList(['maintainHouseDetailsList']).forEach((element: any) => {

      for (const eachRow of (<NgcFormArray>this.form.get(['maintainHouseDetailsList'])).value) {
        let hawbNo = eachRow.hawbNumber;
        if (element.value.hawbNumber == hawbNo) {
          this.showErrorMessage("ERR_HAWB_06");
        }
      }
      if (element.value.hawbNumber != '' && element.value.hawbNumber != null) {
        if (element.value.pieces > 0) {
          sumofPieces = sumofPieces + element.value.pieces;
        }
        if (element.value.weight > 0) {
          sumofWeight = sumofWeight + element.value.weight;
        }
        if (element.value.chargeableWeight) {
          sumofChgWeight = sumofChgWeight + element.value.chargeableWeight;
        }
        if ((type == 'hawbNumber' && element.value.hawbNumber) || (element.value.hawbNumber && element.value.pieces > 0 &&
          element.value.weight > 0 && element.value.chargeableWeight > 0)) {
          hawbCount = hawbCount + 1;
        }
      }
    })
    this.addHouseForm.get("sumofPieces").setValue(sumofPieces);
    this.addHouseForm.get("sumofWeight").setValue(sumofWeight);
    this.addHouseForm.get("sumofChgWeight").setValue(sumofChgWeight);
    this.addHouseForm.get("hawbCount").setValue(hawbCount);
  }

  private onShipmentSelect(event) {
    if (event.shipmentType) {
      this.searchForm.get('shipmentType').patchValue(event.shipmentType);
    }
    this.searchForm.get('hawbNumber').patchValue("");
    this.searchForm.get('hawbNumber').clearValidators();
  }

  private selectAppointedAgent(object) {

    this.globalDirectConsignee = object.param1;
    this.customerInformationForm.get(['consignee', 'appointedAgent']).setValue(this.globalDirectConsignee);
    this.customerInformationFormList.get(['consignee', 'appointedAgentCode']).setValue(object.code);
  }
  private selectAppointedAgentForConsignee(object) {

    this.globalDirectConsignee = object.param1;

    this.customerInformationFormList.get(['consignee', 'appointedAgent']).setValue(this.globalDirectConsignee);
    if (this.globalDirectConsignee != null) {
      this.customerInformationFormList.get(['consignee', 'appointedAgentCode']).setValue(object.code);
    }
  }

}