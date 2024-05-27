import {
  Component, NgZone, ElementRef, ViewContainerRef, OnInit,
  ViewChild, ViewChildren, QueryList
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcWindowComponent, NgcFormArray
  , NgcDropDownComponent, NgcUtility, NgcButtonComponent, NgcDataTableComponent, PageConfiguration
} from 'ngc-framework';
import {
  CurdOperations, MaintainRemarkResponse, MaintainRemarkRequest,
  MaintainRemarkCommon, MaintainRemarkDeleteRequest, HouseHarmonisedTariffScheduleModel, HouseDescriptionOfGoodsModel, HouseClearanceInfoModel
} from './../awbManagement.shared';
import { AwbManagementService } from '../awbManagement.service';
import { NgcFormControl } from 'ngc-framework';
import { FormArray, AbstractControl } from '@angular/forms';
import { MasterAirWayBillModel, HouseModel, HouseSearch } from '../awbManagement.shared';
import { FormsModule, Validators } from '@angular/forms';
import { ApplicationFeatures } from '../../common/applicationfeatures';

@Component({
  selector: 'app-maintain-house-way-bill-edit',
  templateUrl: './maintain-house-way-bill-edit.component.html',
  styleUrls: ['./maintain-house-way-bill-edit.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  focusToMandatory: true,
  focusToBlank: true,
})
export class MaintainHouseWayBillEditComponent extends NgcPage {
  displayAdd: boolean;
  requestToPatch: any;
  shcData: any[];
  patchData: any;
  response: any;
  routingData: any;
  hasReadPermission: boolean = false;
  originShipperMandatoryflag: boolean = true;
  destinationConsigneeMandatoryFlag: boolean = true;

  private formAddNew: NgcFormGroup = new NgcFormGroup({
    masterAwbId: new NgcFormControl(),
    awbDate: new NgcFormControl(),
    id: new NgcFormControl(),
    houseId: new NgcFormControl(),
    hawbNumber: new NgcFormControl('', [Validators.maxLength(12)]),
    awbNumber: new NgcFormControl('', [Validators.maxLength(11)]),
    awbPrefix: new NgcFormControl(),
    awbSuffix: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    weightUnitCode: new NgcFormControl('', [Validators.maxLength(1)]),
    slac: new NgcFormControl(),
    shc: new NgcFormArray([
      new NgcFormGroup({
        houseId: new NgcFormControl(),
        id: new NgcFormControl(),
        code: new NgcFormControl(),
      })
    ]),
    natureOfGoods: new NgcFormControl('', [Validators.maxLength(15)]),
    shipperName: new NgcFormControl(),
    consigneeName: new NgcFormControl(),
    specialHandlingCode: new NgcFormControl(),
    descriptionOfGoods: new NgcFormArray([
      new NgcFormGroup({
        check: new NgcFormControl(),
        content: new NgcFormControl(),
        flagCRUD: new NgcFormControl('C')
      })
    ]),
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
    tariffs: new NgcFormArray([
      new NgcFormGroup({
        houseId: new NgcFormControl(),
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
      customValue: new NgcFormControl('', [Validators.maxLength(12)]),
      carriageValue: new NgcFormControl('', [Validators.maxLength(12)]),
      declaredCharge: new NgcFormControl(),
      pcIndicator: new NgcFormControl(),
      otherCharge: new NgcFormControl(),
      remarks: new NgcFormControl(),
    }),
    shipper: new NgcFormGroup({
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
        contacts: new NgcFormArray([
          new NgcFormGroup({
            houseCustomerAddressId: new NgcFormControl(),
            type: new NgcFormControl('TE'),
            detail: new NgcFormControl(),
            flagCRUD: new NgcFormControl('C')
          })
        ])
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
        contacts: new NgcFormArray([
          new NgcFormGroup({
            houseCustomerAddressId: new NgcFormControl(),
            type: new NgcFormControl('TE'),
            detail: new NgcFormControl(),
            flagCRUD: new NgcFormControl('C')
          })
        ])
      })
    }),
    notify: new NgcFormGroup({
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
        contacts: new NgcFormArray([
          new NgcFormGroup({
            houseCustomerAddressId: new NgcFormControl(),
            type: new NgcFormControl('TE'),
            detail: new NgcFormControl(),
            flagCRUD: new NgcFormControl('C')
          })
        ])
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
    this.displayAdd = true;
    this.routingData = this.getNavigateData(this.activatedRoute);
    let forwardedData = this.routingData;
    this.getHAWB(forwardedData);
    this.validateSubscription();
    this.onAddShipperContact(0); this.onAddConsigneeContact(0);
    this.onAddShipperContact(1); this.onAddConsigneeContact(1);
  }

  addRowFreeText() {
    const col = new HouseDescriptionOfGoodsModel()
    const noOfRows = (<NgcFormArray>this.formAddNew.get('descriptionOfGoods')).length;
    console.log(noOfRows);
    if (noOfRows <= 8) {
      (<NgcFormArray>this.formAddNew.get('descriptionOfGoods')).addValue([col]);
    }
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

  addRowCommodity() {
    const col: HouseHarmonisedTariffScheduleModel = new HouseHarmonisedTariffScheduleModel();
    var noOfRows = (<NgcFormArray>this.formAddNew.get('tariffs')).length;
    if (noOfRows <= 8) {
      (<NgcFormArray>this.formAddNew.get('tariffs')).addValue([col]);
    }

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
    this.formAddNew.validate();
    this.formAddNew.markAsUpdated();
    let request: any = this.formAddNew.getRawValue();
    request.flagCRUD = 'U';

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

    if (this.validateField()) {
      //Save the record
      this.maintainHouseservice.insertAWBRecord(request).subscribe(data => {
        this.response = data.data;
        this.refreshFormMessages(data);
        if (data.success) {
          this.showSuccessStatus('g.operation.successful');
          this.requestToPatch = {
            awbNumber: this.formAddNew.get('awbNumber').value
          }
          this.maintainHouseservice.dataFromAddToHouse = this.requestToPatch;

          this.navigateTo(this.router, '/awbmgmt/maintainhouse', this.requestToPatch);
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

  getHAWB(forwardedData) {
    this.hasReadPermission = NgcUtility.hasReadPermission('HOUSE_AIRWAY_BILL_LIST');
    console.log(JSON.stringify(forwardedData));
    this.maintainHouseservice.searchHAWB(forwardedData).subscribe(data => {
      console.log(data);
      this.response = data;
      this.refreshFormMessages(data);
      this.response.data.awbNumber = forwardedData.awbNumber;
      this.formAddNew.patchValue(this.response.data);
      if (this.response.data.oci.length === 0) {
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

      let originVal = this.formAddNew.get('origin').value;
      let destinationVal = this.formAddNew.get('destination').value;

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

      if (this.response.data.tariffs.length === 0) {
        const col: HouseHarmonisedTariffScheduleModel = new HouseHarmonisedTariffScheduleModel();
        var noOfRows = 0;
        (<NgcFormArray>this.formAddNew.get('tariffs')).addValue([col]);
      }
      if (this.response.data.license.length === 0) {
        const col = new HouseClearanceInfoModel();
        col.type = 'LICENSE';
        var noOfRows = 0;
        (<NgcFormArray>this.formAddNew.get('license')).addValue([col]);
      }
      if (this.response.data.permit.length === 0) {
        const col = new HouseClearanceInfoModel();
        col.type = 'PERMIT';
        var noOfRows = 0;
        (<NgcFormArray>this.formAddNew.get('permit')).addValue([col]);
      }
      if (this.response.data.descriptionOfGoods.length === 0) {
        const col = new HouseDescriptionOfGoodsModel()
        var noOfRows = 0;
        (<NgcFormArray>this.formAddNew.get('descriptionOfGoods')).addValue([col]);
      }
    }, error => {
      this.showErrorStatus('Error:' + error);
    });
  }

  updateFormData(house: any) {
    if (house.descriptionOfGoods != null) {
      house.descriptionOfGoods.forEach(element => {
        element['check'] = false;
      });
    }
    if (house.tariffs != null) {
      house.descriptionOfGoods.forEach(element => {
        element['check'] = false;
      });
    }
    if (house.oci != null) {
      house.descriptionOfGoods.forEach(element => {
        element['check'] = false;
      });
    }

    if (house.descriptionOfGoods === null) {
      house.descriptionOfGoods = [];
    }

    if (house.descriptionOfGoods === null) {
      house.descriptionOfGoods = [];
    }
    if (house.tariffs === null) {
      house.tariffs = [];
    }
  }

  onAddShipperContact(index) {
    if (index < 2) {
      if (index === 0) {
        (<NgcFormArray>this.formAddNew.get('shipper.address.contacts')).addValue([
          {
            type: 'TE',
            detail: '',
          }
        ]);
      } else if (index === 1) {
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
      if (index === 0) {
        (<NgcFormArray>this.formAddNew.get('consignee.address.contacts')).addValue([
          {
            type: 'TE',
            detail: '',
          }
        ]);
      } else if (index === 1) {
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
      if (index === 0) {
        (<NgcFormArray>this.formAddNew.get('notify.address.contacts')).addValue([
          {
            type: 'TE',
            detail: '',
          }
        ]);
      } else if (index === 1) {
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

  onCancel(event) {
    this.navigateTo(this.router, '/awbmgmt/maintainhouse', this.routingData);
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
      && this.formAddNew.get('oci').valid
      && this.formAddNew.get('shipper').valid
      && this.formAddNew.get('consignee').valid 
      && (NgcUtility.hasFeatureAccess(ApplicationFeatures.Edi_FHL_NotifyParty) ? this.formAddNew.get('notify').valid : true)
    ) ? true : false;
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
}