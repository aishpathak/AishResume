import { DimensionDetails, Dimention, HouseModel, HouseWayBillMasterform, HousewayDimentionForm, MaintainHouseDetailsList } from './../awbManagement.shared';
import { NgcUtility, NgcLOVComponent } from 'ngc-framework';
import {
  Component, Input, Output, EventEmitter, NgZone, ElementRef, ViewContainerRef, OnInit,
  ViewChild, ViewChildren, QueryList
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, PageConfiguration, ReactiveModel, NgcFormArray, NgcWindowComponent
} from 'ngc-framework';
import { AwbManagementService } from '../awbManagement.service';
import { NgcFormControl } from 'ngc-framework';
import { HouseWayBillListform, SearchHouseWayBillListform, CustomerInformationForm } from '../awbManagement.shared';
import { FormsModule, Validators } from '@angular/forms';

import { SearchShipmentLocation, SearchShipmentLocationHouse } from '../awbManagement.shared';
import { BookingDimnesion } from '../../export/export.sharedmodel';
import { ApplicationEntities } from '../../common/applicationentities';
import { ApplicationFeatures } from '../../common/applicationfeatures';


@Component({
  selector: 'app-maintain-house-master',
  templateUrl: './maintain-house-master.component.html',
  styleUrls: ['./maintain-house-master.component.scss']
})

@PageConfiguration({
  trackInit: true,
  focusToBlank: true,
  focusToMandatory: true,
  // restorePageOnBack: true,
  // autoBackNavigation: true,
  callNgOnInitOnClear: true
})

export class MaintainHouseMasterComponent extends NgcPage {
  mesurementData = ["CMT", "INH"];

  @ReactiveModel(HousewayDimentionForm)
  public HousewayDimentionForm: NgcFormGroup;


  consigneAgentSourceParameter: {};

  @ReactiveModel(SearchHouseWayBillListform)
  public searchForm: NgcFormGroup;

  @ViewChild('appointedAgent') appointedAgent: NgcLOVComponent;
  @ViewChild('dimensionWindow') dimensionWindow: NgcWindowComponent;

  hawbSourceParameters: {};

  @ReactiveModel(HouseWayBillMasterform)
  public form: NgcFormGroup;
  showData: boolean = false;
  houseIdfromGet: any;
  globalDirectConsignee: any;
  /* 
  *
  */
  housingFlag = false;
  forwardedData: any;

  @ViewChild("shipmentType") shipmentType: any = 'AWB';
  @Input('shipmentNumberData') shipmentNumberData: string;
  @Input('shipmentTypeData') shipmentTypeData: string;
  @Input('hwbNumberData') hwbNumberData: string;
  @Input('showAsPopup') showAsPopup: boolean;
  @Output() autoSearchShipmentInfo = new EventEmitter<boolean>();
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
    this.retrieveLOVRecords("APPOINTED_AGENT_DATA_IXX").subscribe(response => {
      if (response) {
        //this.globalDirectConsignee = response[0].param1;
      }
    });
    if (this.shipmentTypeData && this.shipmentNumberData) {
      this.searchForm.get('awbNumber').setValue(this.shipmentNumberData);
      this.searchForm.get('type').setValue(this.shipmentTypeData);
      if (this.hwbNumberData) {
        this.housingFlag = true;
        this.searchForm.get('hawbNumber').setValue(this.hwbNumberData);
      }
      this.onSearch();
    } else {
      //
      this.forwardedData = this.getNavigateData(this.activatedRoute);
      //
      if (this.forwardedData.awbNumber) {
        this.forwardedData.awbNumber = this.forwardedData.awbNumber;
      } else if (this.forwardedData.shipmentNumber) {
        this.forwardedData.awbNumber = this.forwardedData.shipmentNumber;
      }
      if (this.forwardedData.awbDate) {
        this.forwardedData.awbDate = this.forwardedData.awbDate;
      } else if (this.forwardedData.shipmentDate) {
        this.forwardedData.awbDate = this.forwardedData.shipmentDate;
      }
      if (this.forwardedData && Object.keys(this.forwardedData).length > 0) {
        this.searchForm.patchValue(this.forwardedData);
        this.onSearch();
      }
    }
  }

  onSearch() {
    this.resetFormMessages();
    this.searchForm.validate();
    if (!this.searchForm.valid) {
      return;
    }
    let hawbdata: SearchHouseWayBillListform = this.searchForm.getRawValue();
    this.awbService.getHouseWayBillMaster(hawbdata).subscribe(response => {
      this.form.reset();
      // this.checkMandatoryShipper(null);
      // this.checkMandatoryConsignee(null);
      if (response.messageList) {
        this.showErrorStatus(response.messageList[0].code);

        return;
      }
      this.showData = false;
      if (response.data && !this.showResponseErrorMessages(response.data)) {
        if (!response.data.handledByHouse) {
          this.showErrorMessage('ERR_HAWB_13');

          return;
        }

        this.showData = true;
        this.form.patchValue(response.data);
        this.houseIdfromGet = response.data.houseModel.id;
        console.log(response.data);
        if (response.data.houseModel) {
          if (response.data.houseModel.shipper) {
            this.checkMandatoryShipper(response.data.houseModel.shipper.name);
          }
          if (!response.data.houseModel.weightUnitCode) {
            this.form.get('houseModel').get('weightUnitCode').setValue('K');
          }
          if (response.data.houseModel.consignee) {
            // if (response.data.houseModel.consignee.appointedAgent &&
            //   !response.data.houseModel.consignee.appointedAgentCode) {
            //   this.form.get(['houseModel', 'consignee', 'appointedAgentCode']).setValue('IXX');
            // }
            this.checkMandatoryConsignee(response.data.houseModel.consignee.name);
            this.consigneAgentSourceParameter = this.createSourceParameter(response.data.houseModel.consignee.code);
          }
        }
      } else {
        this.showErrorStatus(response.data.messageList[0].code);
        console.log(3)
      }
    }
      , error => {
        this.showErrorMessage(error);

      });
  }

  onSave() {
    this.form.validate();
    if (!this.form.valid) {
      return;
    }
    const saveData = this.form.getRawValue();
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
    if (saveData.houseModel.consignee.name) {
      if ((saveData.houseModel.consignee.flagCRUD !== 'U') && (saveData.houseModel.consignee.flagCRUD !== 'D')) {
        saveData.houseModel.consignee.flagCRUD = 'C';
        saveData.houseModel.consignee.houseId = this.houseIdfromGet;
      }
      if (!this.form.get(['houseModel', 'consignee']).valid) {
        this.showErrorMessage("ERR_HAWB_10");
        return;
      }
    } else {
      saveData.houseModel.shipper.address.flagCRUD = 'D';
      saveData.houseModel.consignee.flagCRUD = 'D';
    }
    if (saveData.houseModel.shipper.name) {
      if ((saveData.houseModel.shipper.flagCRUD !== 'U') && (saveData.houseModel.shipper.flagCRUD !== 'D')) {
        saveData.houseModel.shipper.flagCRUD = 'C';
        //  this.form.get(['houseModel', 'shipper', 'houseId']).setValue(this.houseIdfromGet);
        saveData.houseModel.shipper.houseId = this.houseIdfromGet;
      }
      if (!this.form.get(['houseModel', 'shipper']).valid) {
        this.showErrorMessage("ERR_HAWB_11");
        return;
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
        // this.form.patchValue(response.data);
        this.showSuccessStatus("g.completed.successfully");
        this.autoSearchShipmentInfo.emit(true);
        this.onSearch();
      } else {
        this.showErrorStatus(response.messageList[0].code);
      }
    });
  }

  /**
   * On Change of Consignee Name
   * @param event 
   */
  onSelectConsigneeName(event) {
    this.checkMandatoryConsignee(event.code);
    this.consigneAgentSourceParameter = this.createSourceParameter(null);
    //this.form.get(['houseModel', 'consignee', 'appointedAgent']).setValue(null);
    //this.form.get(['houseModel', 'consignee', 'appointedAgentCode']).setValue(null);
    this.checkAppointedAgent(event);
    if (event.code) {
      this.consigneAgentSourceParameter = this.createSourceParameter(event.code);
      this.form.get(['houseModel', 'consignee', 'code']).setValue(event.code);
      this.form.get(['houseModel', 'consignee', 'name']).setValue(event.desc);
      this.form.get(['houseModel', 'consignee', 'address', 'place']).setValue(event.param2);
      this.form.get(['houseModel', 'consignee', 'address', 'state']).setValue(event.parameter2);
      this.form.get(['houseModel', 'consignee', 'address', 'postal']).setValue(event.parameter1);
      this.form.get(['houseModel', 'consignee', 'address', 'country']).setValue(event.parameter3);
      this.form.get(['houseModel', 'consignee', 'address', 'streetAddress']).setValue(event.param1);
    } else {
      this.form.get(['houseModel', 'consignee', 'code']).setValue(null);
      //  this.form.get(['houseModel', 'consignee', 'name']).setValue(null);
      this.form.get(['houseModel', 'consignee', 'address', 'place']).setValue(null);
      this.form.get(['houseModel', 'consignee', 'address', 'state']).setValue(null);
      this.form.get(['houseModel', 'consignee', 'address', 'postal']).setValue(null);
      this.form.get(['houseModel', 'consignee', 'address', 'country']).setValue(null);
      this.form.get(['houseModel', 'consignee', 'address', 'streetAddress']).setValue(null);

      this.form.get(['houseModel', 'consignee', 'appointedAgentCode']).patchValue(null);

      this.form.get(['houseModel', 'consignee', 'appointedAgent']).patchValue(null);
    }
  }

  /**
   * On Change of Shipper Name
   * @param event 
   */
  onSelectShipperName(event) {
    this.checkMandatoryShipper(event.code);
    if (event.code) {
      this.form.get(['houseModel', 'shipper', 'code']).setValue(event.code);
      this.form.get(['houseModel', 'shipper', 'name']).setValue(event.desc);
      this.form.get(['houseModel', 'shipper', 'address', 'place']).setValue(event.param2);
      this.form.get(['houseModel', 'shipper', 'address', 'state']).setValue(event.parameter2);
      this.form.get(['houseModel', 'shipper', 'address', 'postal']).setValue(event.parameter1);
      this.form.get(['houseModel', 'shipper', 'address', 'country']).setValue(event.parameter3);
      this.form.get(['houseModel', 'shipper', 'address', 'streetAddress']).setValue(event.param1);
    } else {
      this.form.get(['houseModel', 'shipper', 'code']).setValue(null);
      //   this.form.get(['houseModel', 'shipper', 'name']).setValue(null);
      this.form.get(['houseModel', 'shipper', 'address', 'state']).setValue(null);
      this.form.get(['houseModel', 'shipper', 'address', 'place']).setValue(null);
      this.form.get(['houseModel', 'shipper', 'address', 'country']).setValue(null);
      this.form.get(['houseModel', 'shipper', 'address', 'postal']).setValue(null);
      this.form.get(['houseModel', 'shipper', 'address', 'streetAddress']).setValue(null);
    }
  }

  checkMandatoryConsignee(event) {
    // if (event) {
    //   this.form.get(['houseModel', 'consignee', 'name']).setValidators(Validators.required);
    //   this.form.get(['houseModel', 'consignee', 'address', 'place']).setValidators(Validators.required);
    //   this.form.get(['houseModel', 'consignee', 'address', 'postal']).setValidators(Validators.required);
    //   this.form.get(['houseModel', 'consignee', 'appointedAgentCode']).setValidators(Validators.required);
    //   this.form.get(['houseModel', 'consignee', 'address', 'country']).setValidators(Validators.required);
    //   this.form.get(['houseModel', 'consignee', 'address', 'streetAddress']).setValidators(Validators.required);
    // }
    // else {
    //     this.form.get(['houseModel', 'consignee', 'name']).setValidators([]);
    //     this.form.get(['houseModel', 'consignee', 'address', 'place']).setValidators([]);
    //     this.form.get(['houseModel', 'consignee', 'address', 'postal']).setValidators([]);
    //     this.form.get(['houseModel', 'consignee', 'address', 'country']).setValidators([]);
    //     this.form.get(['houseModel', 'consignee', 'appointedAgentCode']).setValidators([]);
    //     this.form.get(['houseModel', 'consignee', 'address', 'streetAddress']).setValidators([]);
    //   }
  }

  checkMandatoryShipper(event) {
    // if (event) {
    //   this.form.get(['houseModel', 'shipper', 'name']).setValidators(Validators.required);
    //   this.form.get(['houseModel', 'shipper', 'address', 'place']).setValidators(Validators.required);
    //   this.form.get(['houseModel', 'shipper', 'address', 'postal']).setValidators(Validators.required);
    //   this.form.get(['houseModel', 'shipper', 'address', 'country']).setValidators(Validators.required);
    //   this.form.get(['houseModel', 'shipper', 'address', 'streetAddress']).setValidators(Validators.required);
    // }
    // else {
    //     this.form.get(['houseModel', 'shipper', 'name']).setValidators([]);
    //     this.form.get(['houseModel', 'shipper', 'address', 'place']).setValidators([]);
    //     this.form.get(['houseModel', 'shipper', 'address', 'postal']).setValidators([]);
    //     this.form.get(['houseModel', 'shipper', 'address', 'country']).setValidators([]);
    //     this.form.get(['houseModel', 'shipper', 'address', 'streetAddress']).setValidators([]);
    //   }
  }

  onSelectAppointedAgentCodeCne(event) {
    let appointedAgentCodeValue = this.form.get(['houseModel', 'consignee', 'appointedAgentCode']).value;
    this.form.get(['houseModel', 'consignee', 'appointedAgent']).setValue(null, { onlySelf: true, emitEvent: false });
    this.form.get(['houseModel', 'consignee', 'appointedAgentCode']).setValue(null, { onlySelf: true, emitEvent: false });
    if (event.code) {
      this.form.get(['houseModel', 'consignee', 'appointedAgentCode']).setValue(event.code, { onlySelf: true, emitEvent: false });
      this.form.get(['houseModel', 'consignee', 'appointedAgent']).setValue(event.param1, { onlySelf: true, emitEvent: false });
    } else {
      this.form.get(['houseModel', 'consignee', 'appointedAgent']).setValue(null, { onlySelf: true, emitEvent: false });
      if (appointedAgentCodeValue && (appointedAgentCodeValue !== 'IXX' || appointedAgentCodeValue !== 'ixx')) {
        // this.retrieveLOVRecords("KEY_AWB_VALID_IMPORT_APPOINTED_AGENT_HOUSE", { parameter1: appointedAgentCodeValue }).subscribe(response => {
        //   if (response) {
        //     (<NgcFormControl>this.form.get(['houseModel', 'consignee', 'appointedAgent'])).setValue(response[0].param3, { onlySelf: true, emitEvent: false });
        //     (<NgcFormControl>this.form.get(['houseModel', 'consignee', 'appointedAgentCode'])).setValue(response[0].code, { onlySelf: true, emitEvent: false });
        //   }
        // });
        (<NgcFormControl>this.form.get(['houseModel', 'consignee', 'appointedAgent'])).setValue(null, { onlySelf: true, emitEvent: false });
        (<NgcFormControl>this.form.get(['houseModel', 'consignee', 'appointedAgentCode'])).setValue(appointedAgentCodeValue, { onlySelf: true, emitEvent: false });

      }

    }
  }

  checkAppointedAgent(record) {
    this.retrieveLOVRecords("AWB_RELEASE_APPOINTED_AGENT_DATA_WITHOUT_PARAMETER").subscribe(response => {
      let responseData = []
      responseData = response;
      if (responseData) {
        for (const eachRow of responseData) {
          if (eachRow.code == 'IXX') {
            this.form.get(['houseModel', 'consignee', 'appointedAgentCode']).setValue(eachRow.code);
            this.form.get(['houseModel', 'consignee', 'appointedAgent']).setValue(eachRow.param1);
            break;
          }
        }
      }
    });
  }


  setAWBNumber(object) {
    this.searchForm.get('hawbNumber').setValue(object.code, { onlySelf: true, emitEvent: false });

  }

  /* Code added for Daxing Project Requirment */
  onAWBChange(event) {
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_House_Enable)) {
      if (event.shipmentType) {
        this.searchForm.get('type').patchValue(event.type);
      }
      this.housingFlag = false;
      this.searchForm.get('hawbNumber').patchValue("");
      this.searchForm.get('hawbNumber').clearValidators();
      this.hawbSourceParameters = this.createSourceParameter(this.searchForm.get('awbNumber').value);

      this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
        if (data != null && data.length > 0) {
          this.housingFlag = true;
          this.searchForm.get('hawbNumber').setValidators([Validators.required, Validators.maxLength(16)]);
          this.retrieveLOVRecords("HWBNUMBER", this.hawbSourceParameters).subscribe(data => {
            if (data != null && data.length == 1) {
              this.searchForm.get('hawbNumber').setValue(data[0].code);
            }

          })

        } else {
          this.housingFlag = false;
          this.searchForm.get('hawbNumber').clearValidators();
        }
      },
      );
      let search: SearchShipmentLocation = new SearchShipmentLocation();
      search.shipmentNumber = this.searchForm.get('awbNumber').value;
      search.shipmentType = this.searchForm.get('type').value;
      search.appFeatures = null;
      this.awbService.isHandledByHouse(search).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          if (data.data) {
            this.housingFlag = true;
            //this.houseEnabled = 1;

          }
          else {
            this.housingFlag = false;
          }
        }
      });
    }

  }

  openHwbList() {
    const sendData = this.searchForm.getRawValue();
    sendData.shipmentType = sendData.type;
    sendData.hwbNumber = sendData.hawbNumber;
    sendData.shipmentNumber = sendData.awbNumber;
    this.navigateTo(this.router, 'awbmgmt/housewaybilllist', sendData);
  }

  openHwbRemarks() {
    const sendData = this.searchForm.getRawValue();
    sendData.shipmentType = sendData.type;
    sendData.hwbNumber = sendData.hawbNumber;
    sendData.shipmentNumber = sendData.awbNumber;
    this.navigateTo(this.router, 'awbmgmt/maintainremarks', sendData);
  }

  openInboundBreakdown() {
    const sendData = this.searchForm.getRawValue();
    sendData.shipmentType = sendData.type;
    sendData.hwbNumber = sendData.hawbNumber;
    sendData.shipmentNumber = sendData.awbNumber;
    this.navigateTo(this.router, 'import/inbound-breakdown', sendData);
  }

  openHoldHwb() {
    const sendData = this.searchForm.getRawValue();
    sendData.shipmentType = sendData.type;
    sendData.hwbNumber = sendData.hawbNumber;
    sendData.shipmentNumber = sendData.awbNumber;
    this.navigateTo(this.router, 'awbmgmt/shipmentonhold', sendData);
  }

  openHwnInfo() {
    const sendData = this.searchForm.getRawValue();
    sendData.shipmentType = sendData.type;
    sendData.hwbNumber = sendData.hawbNumber;
    sendData.shipmentNumber = sendData.awbNumber;
    this.navigateTo(this.router, 'awbmgmt/hwb-informationCR', sendData);
  }

  openCollectCharges() {
    const sendData = this.searchForm.getRawValue();
    sendData.shipmentType = sendData.type;
    sendData.hwbNumber = sendData.hawbNumber;
    sendData.shipmentNumber = sendData.awbNumber;
    this.navigateTo(this.router, '/billing/collectPayment/enquireCharges', sendData);
  }

  openDimension() {
    const sendData = this.searchForm.getRawValue();
    sendData.shipmentType = sendData.type;
    sendData.hwbNumber = sendData.hawbNumber;
    sendData.shipmentNumber = sendData.awbNumber;
    this.showInfoStatus("YET TO IMPLEMENT");
    // this.navigateTo(this.router, 'awbmgmt/changeawbhandling', sendData);
  }

  onLinkClick() {
    console.log(this.form.get(['houseModel']));

    this.HousewayDimentionForm.patchValue(this.form.get(['houseModel', 'houseDimension']).value);

    // this.HousewayDimentionForm.get('unitCode').setValue('CMT');
    //this.HousewayDimentionForm.get('volumeUnitCode').setValue('MC');



    this.openDimensionPopup();
  }

  openDimensionPopup() {
    this.dimensionWindow.open();

    /*let reqDimension: HouseModel = new HouseModel();
    reqDimension.houseId = this.houseIdfromGet;

    this.awbService.getDimensionDetail(this.reqDimension).subscribe(response => {

      if (this.showResponseErrorMessages(response)) {
        return;
      } else {
        if (response.data != null) {
          this.hawbDimention = response.data;
          this.HousewayDimentionForm.get('shipmentUnitCode').setValue(this.hawbDimention.unitCode);
          this.HousewayDimentionForm.get('volumeUnitCode').setValue(this.hawbDimention.volumeUnitCode);
          this.HousewayDimentionForm.get('volumeWeight').setValue(this.hawbDimention.volumeWeight);
          this.HousewayDimentionForm.get('totalDimentionVolumetricWeight').setValue(this.hawbDimention.volumeWeight);

          (<NgcFormArray>this.HousewayDimentionForm.controls['dimensionList'])
            .patchValue(this.hawbDimention.dimensionList);
        }
        else {
          this.HousewayDimentionForm.reset();
        }
        this.setDimentionValues();
        this.updateTotalshipment();
        this.dimensionWindow.open();
      }

    }, Error => { });*/
  }

  addDimensionRow() {
    (<NgcFormArray>this.HousewayDimentionForm.controls['dimensionList'])
      .addValue([new BookingDimnesion()]);
    this.refresh();
  }

  saveHouseDimension() {
    const HouseDimensionUpdateRequest: MaintainHouseDetailsList = new MaintainHouseDetailsList();
    HouseDimensionUpdateRequest.houseDimension = this.HousewayDimentionForm.getRawValue();
    var house: HouseWayBillMasterform = this.form.value.houseModel;

    HouseDimensionUpdateRequest.houseDimension.houseId = this.houseIdfromGet;
    HouseDimensionUpdateRequest.houseDimension.pieces = house.pieces;


    HouseDimensionUpdateRequest.houseDimension.flagUpdate = 'Y';
    this.awbService.editHouseDimension(HouseDimensionUpdateRequest).subscribe(response => {
      this.refreshFormMessages(response);
      if (response.data !== null) {
        this.showSuccessStatus('g.completed.successfully');
        this.dimensionWindow.close();
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
    const nonDeletedDimension = new Array<any>();
    (<NgcFormArray>this.HousewayDimentionForm.controls['dimensionList']).getRawValue().forEach(ele => {
      if (!ele.checkBoxFlag) {
        nonDeletedDimension.push(ele);
      }
    });
    flightDeleteDimensionRequest.houseDimension.dimensionList = deleteDimension;
    flightDeleteDimensionRequest.houseDimension.flagDelete = 'Y';
    this.awbService.editHouseDimension(flightDeleteDimensionRequest).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.updateTotalshipment();
        this.showSuccessStatus('g.completed.successfully');
        this.dimensionWindow.close();
        this.onSearch();
      } else {
        this.showResponseErrorMessages(response);
      }
    });
  }
  updateTotalshipment() {
    let picesCount = 0;
    (<NgcFormArray>this.HousewayDimentionForm.get('dimensionList')).getRawValue().forEach(ele => { picesCount += +ele.pieces; });
    this.HousewayDimentionForm.get('totalDimpieces').setValue(picesCount);
  }

  eventCall(event) {
    this.setDimentionValues();
  }
  setDimentionValues() {
    const dimention: Dimention = new Dimention();
    console.log(this.form.value.houseModel);
    console.log(this.form.get(['houseModel']));
    var house: HouseWayBillMasterform = this.form.value.houseModel;

    dimention.weightCode = house.weightUnitCode;
    dimention.shipmentPcs = house.pieces;
    dimention.shipmentWeight = house.weight;


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
  changeModel(event, column, dimention: NgcFormGroup, index) {
    if (column === 0) {
      // dimention.get('pieces').setValue(event);
      this.updateTotalshipment();
    } else if (column === 1) {
      // dimention.get('length').setValue(event);
    } else if (column === 2) {
      // dimention.get('width').setValue(event);
    } else {
      // dimention.get('height').setValue(event);
    }
    if (dimention.get('pieces').value !== null && dimention.get('length').value !== null
      && dimention.get('width').value !== null && dimention.get('height').value !== null) {
      this.setDimentionValues();
    }
  }


  onCancel() {
    this.navigateBack(this.forwardedData);
  }
}

