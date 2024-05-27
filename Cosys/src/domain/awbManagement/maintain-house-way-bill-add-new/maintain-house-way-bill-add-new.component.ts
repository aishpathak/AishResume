import {
  Component, NgZone, ElementRef, ViewContainerRef, OnInit,
  ViewChild, ViewChildren, QueryList, Input
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcWindowComponent, NgcFormArray
  , NgcDropDownComponent, NgcUtility, NgcButtonComponent, NgcDataTableComponent, PageConfiguration
} from 'ngc-framework';
import {
  CurdOperations, MaintainRemarkResponse, MaintainRemarkRequest,
  MaintainRemarkCommon, MaintainRemarkDeleteRequest, HouseClearanceInfoModel
} from './../awbManagement.shared';
import { AwbManagementService } from '../awbManagement.service';
import { NgcFormControl } from 'ngc-framework';
import { FormArray, AbstractControl } from '@angular/forms';
import { MasterAirWayBillModel, HouseModel, HouseSearch, HouseDescriptionOfGoodsModel, HouseHarmonisedTariffScheduleModel } from '../awbManagement.shared';
import { FormsModule, Validators } from '@angular/forms';
import { ApplicationFeatures } from '../../common/applicationfeatures';
@Component({
  selector: 'app-maintain-house-way-bill-add-new',
  templateUrl: './maintain-house-way-bill-add-new.component.html',
  styleUrls: ['./maintain-house-way-bill-add-new.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  focusToMandatory: true,
  focusToBlank: true,
})
export class MaintainHouseWayBillAddNewComponent extends NgcPage {
  shcData: any[];
  patchData: any;
  requestToPatch: any;
  originData: any;
  destinationData: any;
  displayFlagOrigin = false;
  displayFlagDestination = false;
  response: any;
  originShipperMandatoryflag: boolean = true;
  destinationConsigneeMandatoryFlag: boolean = true;

  private formAddNew: NgcFormGroup = new NgcFormGroup({
    masterAwbId: new NgcFormControl(),
    awbDate: new NgcFormControl(),
    id: new NgcFormControl(),
    houseId: new NgcFormControl(),
    hawbNumber: new NgcFormControl('', [Validators.maxLength(12)]),
    awbNumber: new NgcFormControl('', [Validators.maxLength(11)]),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    pieces: new NgcFormControl('', [Validators.required]),
    weight: new NgcFormControl("", Validators.required),
    weightUnitCode: new NgcFormControl('', [Validators.required, Validators.maxLength(1)]),
    slac: new NgcFormControl(),
    shc: new NgcFormArray([
    ]),
    natureOfGoods: new NgcFormControl('', [Validators.maxLength(15)]),
    shipperName: new NgcFormControl(),
    consigneeName: new NgcFormControl(),
    specialHandlingCode: new NgcFormControl(),
    license: new NgcFormArray([
      new NgcFormGroup({
        check: new NgcFormControl(),
        number: new NgcFormControl(),
        type: new NgcFormControl('LICENSE'),
        flagCRUD: new NgcFormControl('C')
      })
    ]),
    permit: new NgcFormArray([
      new NgcFormGroup({
        check: new NgcFormControl(),
        number: new NgcFormControl(),
        type: new NgcFormControl('PERMIT'),
        flagCRUD: new NgcFormControl('C')
      })
    ]),
    descriptionOfGoods: new NgcFormArray([
      new NgcFormGroup({
        check: new NgcFormControl(),
        content: new NgcFormControl(),
        flagCRUD: new NgcFormControl('C')
      })
    ]),
    tariffs: new NgcFormArray([
      new NgcFormGroup({
        check: new NgcFormControl(),
        code: new NgcFormControl('', [Validators.maxLength(18)]),
        flagCRUD: new NgcFormControl('C')
      })
    ]),
    oci: new NgcFormArray([
      new NgcFormGroup({
        houseId: new NgcFormControl(),
        country: new NgcFormControl(),
        identifier: new NgcFormControl(),
        csrcIdentifier: new NgcFormControl(),
        scsrcInformation: new NgcFormControl(),
        flagCRUD: new NgcFormControl('C')
      })
    ]),
    otherChargeDeclarations: new NgcFormGroup({
      id: new NgcFormControl(),
      houseId: new NgcFormControl(),
      currencyCode: new NgcFormControl(),
      insuranceValue: new NgcFormControl('', [Validators.maxLength(11)]),
      carriageValue: new NgcFormControl('', [Validators.maxLength(12)]),
      customValue: new NgcFormControl('', [Validators.maxLength(12)]),
      declaredCharge: new NgcFormControl(),
      pcIndicator: new NgcFormControl(),
      otherCharge: new NgcFormControl(),
      remarks: new NgcFormControl(),
      flagCRUD: new NgcFormControl('C')
    }),

    shipper: new NgcFormGroup({
      id: new NgcFormControl(),
      houseId: new NgcFormControl(),
      name: new NgcFormControl(),
      type: new NgcFormControl(),
      address: new NgcFormGroup({
        houseCustomerId: new NgcFormControl(),
        streetAddress: new NgcFormControl('', [Validators.maxLength(70)]),
        city: new NgcFormControl(),
        country: new NgcFormControl(),
        place: new NgcFormControl('', [Validators.maxLength(17)]),
        state: new NgcFormControl(),
        postal: new NgcFormControl(),
        contacts: new NgcFormArray([])
      })
    }),
    consignee: new NgcFormGroup({
      id: new NgcFormControl(),
      houseId: new NgcFormControl(),
      name: new NgcFormControl(),
      type: new NgcFormControl(),
      address: new NgcFormGroup({
        houseCustomerId: new NgcFormControl(),
        streetAddress: new NgcFormControl(),
        city: new NgcFormControl(),
        country: new NgcFormControl(),
        place: new NgcFormControl(),
        state: new NgcFormControl(),
        postal: new NgcFormControl(),
        contacts: new NgcFormArray([])
      })
    }),
    notify: new NgcFormGroup({
      id: new NgcFormControl(),
      houseId: new NgcFormControl(),
      name: new NgcFormControl(),
      type: new NgcFormControl(),
      address: new NgcFormGroup({
        houseCustomerId: new NgcFormControl(),
        streetAddress: new NgcFormControl(null, [Validators.maxLength(70)]),
        city: new NgcFormControl(),
        country: new NgcFormControl(),
        place: new NgcFormControl(null, [Validators.maxLength(17)]),
        state: new NgcFormControl(),
        postal: new NgcFormControl(),
        contacts: new NgcFormArray([])
      })
    }),
    distinguishRemarks: new NgcFormControl(),
    distinguishRemarksDescription: new NgcFormControl()
  });

  constructor(private awbService: AwbManagementService, appZone: NgZone,
    appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router,
    private maintainHouseservice: AwbManagementService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.patchData = this.getNavigateData(this.activatedRoute);
    const request = {
      awbNumber: this.patchData.awbNumber,
      masterAwbId: this.patchData.masterAwbId,
      awbDate: this.patchData.awbDate,
      id: this.patchData.id,
      houseId: this.patchData.houseId,
      origin: this.patchData.origin,
      weightUnitCode: this.patchData.weightUnitCode,
      destination: this.patchData.destination
    }
    this.formAddNew.patchValue(request);
    if (this.patchData.origin) {
      this.displayFlagOrigin = false;
      this.onTabOutOriginHandle(this.patchData.origin);
    } else {
      this.displayFlagOrigin = true;
    }
    if (this.patchData.destination) {
      this.displayFlagDestination = false;
      this.onTabOutDestinationHandle(this.patchData.destination);

    } else {
      this.displayFlagDestination = true;
    }
    this.validateSubscription();
    this.formAddNew.get('weightUnitCode').setValue('K');

    this.onAddShipperContact(0); this.onAddConsigneeContact(0); this.onAddNotifyContact(0);
    this.onAddShipperContact(1); this.onAddConsigneeContact(1); this.onAddNotifyContact(1);
  }


  addRowOci() {
    (<NgcFormArray>this.formAddNew.controls['oci']).addValue([
      {
        checkBox: false,
        country: '',
        identifier: '',
        csrcIdentifier: '',
        scsrcInformation: ''
      }
    ]);

  }

  onSave() {

    if (!this.validateField()) {
      this.formAddNew.validate();
      this.showErrorStatus('g.fill.all.details')
      return;
    }
    let request: any = this.formAddNew.getRawValue();
    const arrayRawValue = request.shc;
    this.shcData = [];
    this.originData = this.formAddNew.get('origin').value;
    this.destinationData = this.formAddNew.get('destination').value;

    request.shc = arrayRawValue;
    request.createdBy = 'SYSADMIN';
    request.createdOn = new Date();
    request.modifiedBy = 'SYSADMIN';
    request.modifiedOn = new Date();

    let array = <NgcFormArray>this.formAddNew.get('oci');
    for (let i = 0; i < array.length; i++) {
      if ((this.formAddNew.get(['oci', i, 'country']).value !== null && this.formAddNew.get(['oci', i, 'country']).value !== '')
        || (this.formAddNew.get(['oci', i, 'identifier']).value !== null && this.formAddNew.get(['oci', i, 'identifier']).value != '')
        || (this.formAddNew.get(['oci', i, 'csrcIdentifier']).value !== null && this.formAddNew.get(['oci', i, 'csrcIdentifier']).value != '')) {
        this.formAddNew.get(['oci', i, 'scsrcInformation']).setValidators([Validators.maxLength(35), Validators.required]);

        if (this.formAddNew.get(['oci', i, 'scsrcInformation']).value === null) {
          this.showErrorMessage('scsrcInformation', 'hwb.fill.oci.info');
          return;
        }
      }
    }
    //Setting the distinguishRemarksDescription for audit trail purpose
    this.formAddNew.get('distinguishRemarksDescription').setValue(this.formAddNew.get('distinguishRemarks').value == null ? null : this.formAddNew.get('distinguishRemarksDescription').value);

    if (this.validateField()) {
      this.maintainHouseservice.insertAWBRecord(request).subscribe(data => {
        if (data.data) {
          this.showSuccessStatus('g.operation.successful');
          this.formAddNew.reset();
          (<NgcFormArray>this.formAddNew.get('shc')).resetValue([]);
          const requestToPatch = {
            awbNumber: this.patchData.awbNumber,
            origin: this.originData,
            destination: this.destinationData
          }
          this.formAddNew.patchValue(requestToPatch);
          this.navigateTo(this.router, '/awbmgmt/maintainhouse', {
            searchBy: requestToPatch
          });
        }
        else {
          this.refreshFormMessages(data);
        }
      });
    }
  }

  validateSubscription() {
    this.formAddNew.controls['oci'].valueChanges.subscribe(data => {
      (<NgcFormArray>this.formAddNew.get('oci')).controls.forEach((formGroup: NgcFormGroup) => {
        if ((formGroup.get('country').value !== null && formGroup.get('country').value !== '')
          || (formGroup.get('identifier').value !== null && formGroup.get('identifier').value != '')
          || (formGroup.get('csrcIdentifier').value !== null && formGroup.get('csrcIdentifier').value != '')) {
          formGroup.controls['scsrcInformation'].setValidators([Validators.maxLength(35), Validators.required]);
        } else {
          formGroup.controls['scsrcInformation'].clearValidators()
        }
      });

    });
  }

  onAddShipperContact(index) {
    if (index < 2) {
      if (index === 1) {
        (<NgcFormArray>this.formAddNew.get('shipper.address.contacts')).addValue([
          {
            type: 'FX',
            detail: '',
          }
        ]);
      } else {
        (<NgcFormArray>this.formAddNew.get('shipper.address.contacts')).addValue([
          {
            type: 'TE',
            detail: '',
          }
        ]);
      }
    }
  }

  onAddConsigneeContact(index) {
    if (index < 2) {
      if (index === 1) {
        (<NgcFormArray>this.formAddNew.get('consignee.address.contacts')).addValue([
          {
            type: 'FX',
            detail: '',
          }
        ]);
      } else {
        (<NgcFormArray>this.formAddNew.get('consignee.address.contacts')).addValue([
          {
            type: 'TE',
            detail: '',
          }
        ]);
      }
    }
  }

  onAddNotifyContact(index) {
    if (index < 2) {
      if (index === 1) {
        (<NgcFormArray>this.formAddNew.get('notify.address.contacts')).addValue([
          {
            type: 'FX',
            detail: '',
          }
        ]);
      } else {
        (<NgcFormArray>this.formAddNew.get('notify.address.contacts')).addValue([
          {
            type: 'TE',
            detail: '',
          }
        ]);
      }
    }
  }

  onDeleteShipperContact(event, index: any): void {
    (<NgcFormArray>this.formAddNew.get(['shipper', 'address', 'contacts'])).markAsDeletedAt(event);
  }
  
  onDeleteLicenseNo(event, index: any): void {
    (<NgcFormArray>this.formAddNew.controls['license']).markAsDeletedAt(event);
  }

  onDeletePermitNo(event, index: any): void {
    (<NgcFormArray>this.formAddNew.controls['permit']).markAsDeletedAt(event);
  }

  onDeleteFreeText(event, index: any): void {
    (<NgcFormArray>this.formAddNew.controls['descriptionOfGoods']).markAsDeletedAt(event);
  }

  onDeleteCommodityCode(event, index: any): void {
    (<NgcFormArray>this.formAddNew.controls['tariffs']).markAsDeletedAt(event);
  }

  onDeleteConsigneeContact(event, index: any): void {
    (<NgcFormArray>this.formAddNew.get(['consignee', 'address', 'contacts'])).markAsDeletedAt(event);
  }

  onDeleteNotifyContact(event, index: any): void {
    (<NgcFormArray>this.formAddNew.get(['notify', 'address', 'contacts'])).markAsDeletedAt(event);
  }

  onDeleteOCI(event, index: any): void {
    (<NgcFormArray>this.formAddNew.controls['oci']).markAsDeletedAt(event);
  }

  addRowLicenseNo() {
    const col = new HouseClearanceInfoModel();
    col.type = 'LICENSE';
    const noOfRows = (<NgcFormArray>this.formAddNew.get('license')).length;
    if (noOfRows <= 8) {
      (<NgcFormArray>this.formAddNew.get('license')).addValue([col]);
    }
  }

  addRowPermitNo() {
    const col = new HouseClearanceInfoModel();
    col.type = 'PERMIT';
    const noOfRows = (<NgcFormArray>this.formAddNew.get('permit')).length;
    if (noOfRows <= 8) {
      (<NgcFormArray>this.formAddNew.get('permit')).addValue([col]);
    }
  }

  addRowFreeText() {
    const col = new HouseDescriptionOfGoodsModel()
    const noOfRows = (<NgcFormArray>this.formAddNew.get('descriptionOfGoods')).length;
    console.log(noOfRows);
    if (noOfRows <= 8) {
      (<NgcFormArray>this.formAddNew.get('descriptionOfGoods')).addValue([col]);
    }
  }
  addRowCommodity() {
    const col: HouseHarmonisedTariffScheduleModel = new HouseHarmonisedTariffScheduleModel();
    const noOfRows = (<NgcFormArray>this.formAddNew.get('tariffs')).length;
    if (noOfRows <= 8) {
      (<NgcFormArray>this.formAddNew.get('tariffs')).addValue([col]);
    }
  }

  onSelectShipperName(event, item) {
    this.formAddNew.get(['shipper', 'address', 'streetAddress']).setValue(event.param1);
    this.formAddNew.get(['shipper', 'address', 'city']).setValue(event.param4);
    this.formAddNew.get(['shipper', 'address', 'country']).setValue(event.parameter3);
    this.formAddNew.get(['shipper', 'address', 'place']).setValue(event.param2);
    if (event.parameter2) {
      this.formAddNew.get(['shipper', 'address', 'state']).setValue(event.parameter2);
    }
    this.formAddNew.get(['shipper', 'address', 'postal']).setValue(event.parameter1);
  }



  onSelectConsigneeName(event, item) {
    this.formAddNew.get(['consignee', 'address', 'streetAddress']).setValue(event.param1);
    this.formAddNew.get(['consignee', 'address', 'city']).setValue(event.param4);
    this.formAddNew.get(['consignee', 'address', 'country']).setValue(event.parameter3);
    this.formAddNew.get(['consignee', 'address', 'place']).setValue(event.param2);
    if (event.parameter2) {
      this.formAddNew.get(['consignee', 'address', 'state']).setValue(event.parameter2);
    }
    this.formAddNew.get(['consignee', 'address', 'postal']).setValue(event.parameter1);
  }

  onSelectNotifyName(event, item) {
    this.formAddNew.get(['notify', 'address', 'streetAddress']).setValue(event.param1);
    this.formAddNew.get(['notify', 'address', 'city']).setValue(event.param4);
    this.formAddNew.get(['notify', 'address', 'country']).setValue(event.parameter3);
    this.formAddNew.get(['notify', 'address', 'place']).setValue(event.param2);
    if (event.parameter2) {
      this.formAddNew.get(['notify', 'address', 'state']).setValue(event.parameter2);
    }
    this.formAddNew.get(['notify', 'address', 'postal']).setValue(event.parameter1);
  }

  onCancel(event) {
    this.maintainHouseservice.dataFromAddToHouse = this.requestToPatch;
    this.navigateTo(this.router, '/awbmgmt/maintainhouse', {
      searchBy: this.patchData
    });
  }

  onTabOutOriginHandle(event) {
    if (NgcUtility.isTenantAirport(event)) {
      this.originShipperMandatoryflag = true;
      this.destinationConsigneeMandatoryFlag = false;
    }
    else {
      this.destinationConsigneeMandatoryFlag = true;
    }
  }

  onTabOutDestinationHandle(event) {

    if (NgcUtility.isTenantAirport(event)) {
      this.originShipperMandatoryflag = false;
      this.destinationConsigneeMandatoryFlag = true;
    }
    else {
      this.originShipperMandatoryflag = true;
    }
  }

  onDistinguishRemarksSelect(event){
    this.formAddNew.get('distinguishRemarksDescription').setValue(event.desc);
  }
  

  validateField() {
    return (this.formAddNew.get('awbNumber').valid
      && this.formAddNew.get('origin').valid
      && this.formAddNew.get('hawbNumber').valid
      && this.formAddNew.get('destination').valid
      && this.formAddNew.get('pieces').valid
      && this.formAddNew.get('weight').valid
      && this.formAddNew.get('weightUnitCode').valid
      && this.formAddNew.get('natureOfGoods').valid
      && this.formAddNew.get('shipper').valid
      && this.formAddNew.get('consignee').valid
      && (NgcUtility.hasFeatureAccess(ApplicationFeatures.Edi_FHL_NotifyParty) ? this.formAddNew.get('notify').valid : true)
    ) ? true : false;
  }

  getShipperAndconsigneeInfoForFirstHouse() {
    if (this.formAddNew.get('awbNumber').value) {


      const houseModel = new HouseModel();
      houseModel.awbNumber = this.formAddNew.get('awbNumber').value;
      this.maintainHouseservice.shipperAndconsigneeInfoForFirstHouse(houseModel).subscribe(data => {
        console.log(data);
        this.response = data.data;
        this.refreshFormMessages(data);
        if (this.response) {
          if (this.response.shipper) {
            this.formAddNew.get('shipper').patchValue(this.response.shipper);
          }
          if (this.response.consignee) {
            this.formAddNew.get('consignee').patchValue(this.response.consignee);
          }
          if (this.response.notify) {
            this.formAddNew.get('notify').patchValue(this.response.notify);
          }
        }
      }, error => {
        this.showErrorStatus('Error:' + error);
      });
    } else {
      this.showErrorStatus('g.enter.awb')
    }
  }
}