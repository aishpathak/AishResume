import {
  Component, OnInit, NgZone,
  ElementRef, ViewContainerRef,
  Input, SimpleChanges,
  Output, EventEmitter
} from '@angular/core';
import {
  NgcPage, PageConfiguration,
  NgcFormGroup, NgcFormArray,
  NgcUtility, ReactiveModel
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomsHouseModel, CustomsOtherCustomerInformation } from '../customs.sharedmodel';
import { CustomACESService } from '../customs.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-maintain-hawb-information',
  templateUrl: './maintain-hawb-information.component.html',
  styleUrls: ['./maintain-hawb-information.component.scss']
})


@PageConfiguration({
  trackInit: true,
  focusToBlank: true,
  focusToMandatory: true,
  restorePageOnBack: true,
  callNgOnInitOnClear: true
})
export class MaintainHawbInformationComponent extends NgcPage {

  constructor(private houseService: CustomACESService,
    appZone: NgZone,
    appElement: ElementRef,
    private router: Router,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  /**
   * Reactive forms
   * 
   */
  @ReactiveModel(CustomsHouseModel)
  public maintainHouseInformation: NgcFormGroup;



  @Input()
  parentData = new CustomsHouseModel();

  @Output()
  searchInParent = new EventEmitter<boolean>();


  houseModel = new CustomsHouseModel();
  hawbDisabledFlag = false;
  disableFlag = false;
  disableCancelFlag = false;
  isFHLExistFlag = false;

  //tab error indicator flags
  shipperConsigneeIcon = '';
  notifyPartyIcon = '';
  licensePermitIcon = '';
  chargesIcon = '';
  ociInfoIcon = '';
  otherInfoIcon = '';



  ngOnInit() {

    super.ngOnInit();

    if (this.getNavigateData(this.activatedRoute)) {
      this.houseModel = this.getNavigateData(this.activatedRoute);
    }
    this.maintainHouseInformation.patchValue(this.houseModel);

    if (this.houseModel.id) {
      this.onSearch(this.houseModel);
    } else {
      this.addDefaultRowsForAllLists();
    }

  }

  /**
   * Retreive all house related information
   * 
   * @param requestData 
   */
  onSearch(requestData: CustomsHouseModel) {
    this.houseService.getCustomsHouseInfo(requestData).subscribe(response => {
      if (response.messageList) {
        this.showErrorStatus(response.messageList[0].code);
        return;
      }

      this.showSuccessStatus('g.completed.successfully');
      this.houseModel = response.data;
      this.maintainHouseInformation.reset();
      this.maintainHouseInformation.patchValue(this.houseModel);
      this.hawbDisabledFlag = true;
      this.addDefaultRowsForAllLists();


      // Disable form for the particular CC or particular status
      this.disableForm(requestData, 'CC');
    })
  }

  /**
   * Save all house related information
   * 
   * @returns 
   */
  onSave() {
    this.maintainHouseInformation.validate();
    if (!this.validateField()) {
      this.maintainHouseInformation.validate();
      this.showErrorStatus('g.fill.all.details')
      return;
    }
    let requestData = new CustomsHouseModel();
    requestData = this.maintainHouseInformation.value;

    // make scsrcInformation mandatory when when any of the information is given in OCI information
    let ociInfo = <NgcFormArray>this.maintainHouseInformation.get('otherCustomerInformation');
    for (let i = 0; i < ociInfo.length; i++) {
      if ((this.maintainHouseInformation.get(['otherCustomerInformation', i, 'countryCode']).value !== null && this.maintainHouseInformation.get(['otherCustomerInformation', i, 'countryCode']).value !== '')
        || (this.maintainHouseInformation.get(['otherCustomerInformation', i, 'identifier']).value !== null && this.maintainHouseInformation.get(['otherCustomerInformation', i, 'identifier']).value != '')
        || (this.maintainHouseInformation.get(['otherCustomerInformation', i, 'csrcIdentifier']).value !== null && this.maintainHouseInformation.get(['otherCustomerInformation', i, 'csrcIdentifier']).value != '')) {
        this.maintainHouseInformation.get(['otherCustomerInformation', i, 'scsrcInformation']).setValidators([Validators.maxLength(35), Validators.required]);

        if (this.maintainHouseInformation.get(['otherCustomerInformation', i, 'scsrcInformation']).value === null) {
          this.showErrorMessage('scsrcInformation', 'hwb.fill.oci.info');
          return;
        }
      }
    }

    // Api request to save house information
    this.houseService.saveCustomsHouseInfo(requestData).subscribe(response => {
      if (response.messageList) {
        // this.showErrorStatus(response.messageList[0].code);
        this.refreshFormMessages(response);
        this.validateField()
        return;
      }
      if (response.data) {
        this.onSearch(response.data);
        this.validateField();
        // to call the parent component's search method
        this.searchInParent.emit(true);
      }
    })
  }


  onCancel(event) {
    // this.navigateTo(this.router, '/customs/maintainhawblist', '');
  }


  /**
   * Method to make form read only for the particular CC Code
   * 
   * @param houseData 
   * @param ccCode 
   */
  disableForm(houseData, ccCode) {



    if (this.houseModel.masterAWBStatus == "Disabled") {
      this.maintainHouseInformation.disable();
      this.disableFlag = true;
    } else {
      this.maintainHouseInformation.enable();
      this.disableFlag = false;
    }

    if (this.houseModel.source == "FHL") {
      this.isFHLExistFlag = true;
    } else { this.isFHLExistFlag = false; }

    // if (houseData.latestCC !== null && houseData.latestCC == ccCode) {
    //   this.maintainHouseInformation.disable();
    //   this.disableFlag = true;
    // }
  }

  /**
   * Method to make form writable 
   * 
   * @param houseData 
   * @param ccCode 
   */
  enableForm() {
    this.maintainHouseInformation.enable();
    this.disableFlag = false;
    this.isFHLExistFlag = false;
  }


  /**
   * Basic screen level validations
   * 
   * @returns 
   */
  validateField() {

    if (this.maintainHouseInformation.get('shipper').invalid || this.maintainHouseInformation.get('consignee').invalid) {
      this.shipperConsigneeIcon = "error";
    } else { this.shipperConsigneeIcon = ''; }

    if (this.maintainHouseInformation.get("notifyParty").invalid) {
      this.notifyPartyIcon = "error";
    } else { this.notifyPartyIcon = ""; }


    if (this.maintainHouseInformation.get("license").invalid || this.maintainHouseInformation.get("permit").invalid) {
      this.licensePermitIcon = "error";
    } else { this.licensePermitIcon = ""; }

    if (this.maintainHouseInformation.get("charges").invalid || this.maintainHouseInformation.get("freeTexts").invalid) {
      this.chargesIcon = "error";
    } else { this.chargesIcon = ""; }

    if (this.maintainHouseInformation.get("otherCustomerInformation").invalid) {
      this.ociInfoIcon = "error";
    } else { this.ociInfoIcon = ""; }

    if (this.maintainHouseInformation.get("distinguishingMark").invalid) {
      this.otherInfoIcon = "error";
    } else { this.otherInfoIcon = ""; }



    return (
      this.maintainHouseInformation.get('hawbNumber').valid
      && this.maintainHouseInformation.get('origin').valid
      && this.maintainHouseInformation.get('destination').valid
      && this.maintainHouseInformation.get('pieces').valid
      && this.maintainHouseInformation.get('weight').valid
      && this.maintainHouseInformation.get('natureOfGoods').valid
      && this.maintainHouseInformation.get('shipper.name').valid
      && this.maintainHouseInformation.get('shipper.address.streetAddress').valid
      && this.maintainHouseInformation.get('shipper.address.place').valid
      && this.maintainHouseInformation.get('shipper.address.postal').valid
      && this.maintainHouseInformation.get('consignee.name').valid
      && this.maintainHouseInformation.get('consignee.address.streetAddress').valid
      && this.maintainHouseInformation.get('consignee.address.place').valid
      && this.maintainHouseInformation.get('consignee.address.postal').valid
    ) ? true : false;
  }

  /**
   * add default row values for each array form
   */
  addDefaultRowsForAllLists() {
    this.onAddCommodityCode(1);
    this.onAddShipperContact(1);
    this.onAddConsigneeContact(1);
    this.onAddNotifyPartyContact(1);
    this.onAddLicense(1);
    this.onAddPermit(1);
    this.onAddFreeText(1);
    this.onAddOCI(1);
  }


  /**
   * 
   * From here methods to add new rows to each ArrayForm starts
   * 
   */

  onAddCommodityCode(count: number) {
    const noOfRows = (<NgcFormArray>this.maintainHouseInformation.get('harmonizedCommodityCode')).length;
    if (noOfRows <= 7) {
      for (let index = 0; index < count; index++) {
        (<NgcFormArray>this.maintainHouseInformation.get('harmonizedCommodityCode')).addValue([{
          code: null
        }])
      }
    }

  }

  onAddShipperContact(count: number) {
    const noOfRows = (<NgcFormArray>this.maintainHouseInformation.get('shipper.address.contacts')).length;
    if (noOfRows <= 5) {
      for (let index = 0; index < count; index++) {
        (<NgcFormArray>this.maintainHouseInformation.get('shipper.address.contacts')).addValue([{
          type: null,
          detail: null
        }])
      }
    }
  }

  onAddConsigneeContact(count: number) {
    const noOfRows = (<NgcFormArray>this.maintainHouseInformation.get('consignee.address.contacts')).length;
    if (noOfRows <= 5) {
      for (let index = 0; index < count; index++) {
        (<NgcFormArray>this.maintainHouseInformation.get('consignee.address.contacts')).addValue([{
          type: null,
          detail: null
        }])
      }
    }
  }

  onAddNotifyPartyContact(count: number) {
    const noOfRows = (<NgcFormArray>this.maintainHouseInformation.get('notifyParty.address.contacts')).length;
    if (noOfRows <= 5) {
      for (let index = 0; index < count; index++) {
        (<NgcFormArray>this.maintainHouseInformation.get('notifyParty.address.contacts')).addValue([{
          type: null,
          detail: null
        }])
      }
    }
  }

  onAddLicense(count: number) {
    for (let index = 0; index < count; index++) {
      (<NgcFormArray>this.maintainHouseInformation.get('license')).addValue([{
        detail: null,
      }])
    }
  }

  onAddPermit(count: number) {
    for (let index = 0; index < count; index++) {
      (<NgcFormArray>this.maintainHouseInformation.get('permit')).addValue([{
        detail: null,
      }])
    }
  }

  onAddFreeText(count: number) {
    const noOfRows = (<NgcFormArray>this.maintainHouseInformation.get('freeTexts')).length;
    if (noOfRows <= 4) {
      for (let index = 0; index < count; index++) {
        (<NgcFormArray>this.maintainHouseInformation.get('freeTexts')).addValue([{
          content: null,
        }])
      }
    }
  }

  onAddOCI(count: number) {
    for (let index = 0; index < count; index++) {
      (<NgcFormArray>this.maintainHouseInformation.get('otherCustomerInformation')).addValue([{
        countryCode: null,
        identifier: null,
        csrcIdentifier: null,
        scsrcInformation: null
      }])
    }

  }


  /**
   * 
   * From here methods to delete rows from each ArrayForm starts
   * 
   */

  onDeleteCommodityCodeRow(index) {
    (<NgcFormGroup>this.maintainHouseInformation.get(['harmonizedCommodityCode', index])).markAsDeleted();
  }

  onDeleteConsigneeContactRow(index) {
    (<NgcFormGroup>this.maintainHouseInformation.get(['consignee', 'address', 'contacts', index])).markAsDeleted();
  }

  onDeleteShipperContactRow(index) {
    (<NgcFormGroup>this.maintainHouseInformation.get(['shipper', 'address', 'contacts', index])).markAsDeleted();
  }

  onDeleteNotifyPartyContactRow(index) {
    (<NgcFormGroup>this.maintainHouseInformation.get(['notifyParty', 'address', 'contacts', index])).markAsDeleted();
  }

  onDeleteLicenseRow(index) {
    (<NgcFormGroup>this.maintainHouseInformation.get(['license', index])).markAsDeleted();
  }

  onDeletePermitRow(index) {
    (<NgcFormGroup>this.maintainHouseInformation.get(['permit', index])).markAsDeleted();
  }

  onDeleteFreeTextRow(index) {
    (<NgcFormGroup>this.maintainHouseInformation.get(['freeTexts', index])).markAsDeleted();
  }

  onDeleteOCI(index) {
    (<NgcFormGroup>this.maintainHouseInformation.get(['otherCustomerInformation', index])).markAsDeleted();
  }



  /**
   * Below method to patch the Consignee's address info based upon selected name
   * 
   * @param event 
   */
  onSelectConsigneeName(event) {
    this.maintainHouseInformation.get(['consignee', 'address', 'streetAddress']).setValue(event.param1);
    this.maintainHouseInformation.get(['consignee', 'address', 'country']).setValue(event.parameter3);
    this.maintainHouseInformation.get(['consignee', 'address', 'place']).setValue(event.param2);
    if (event.parameter2) {
      this.maintainHouseInformation.get(['consignee', 'address', 'state']).setValue(event.parameter2);
    }
    this.maintainHouseInformation.get(['consignee', 'address', 'postal']).setValue(event.parameter1);
  }

  /**
   * Below method to patch the shipper's address info based upon selected name
   * 
   * @param event 
   */
  onSelectShipperName(event) {
    this.maintainHouseInformation.get(['shipper', 'address', 'streetAddress']).setValue(event.param1);
    this.maintainHouseInformation.get(['shipper', 'address', 'country']).setValue(event.parameter3);
    this.maintainHouseInformation.get(['shipper', 'address', 'place']).setValue(event.param2);
    if (event.parameter2) {
      this.maintainHouseInformation.get(['shipper', 'address', 'state']).setValue(event.parameter2);
    }
    this.maintainHouseInformation.get(['shipper', 'address', 'postal']).setValue(event.parameter1);
  }

  /**
   * Below method to patch the NOtifyParties's address info based upon selected name
   * 
   * @param event 
   */
  onSelectNotifyPartyName(event) {
    this.maintainHouseInformation.get(['notifyParty', 'address', 'streetAddress']).setValue(event.param1);
    this.maintainHouseInformation.get(['notifyParty', 'address', 'country']).setValue(event.parameter3);
    this.maintainHouseInformation.get(['notifyParty', 'address', 'place']).setValue(event.param2);
    if (event.parameter2) {
      this.maintainHouseInformation.get(['notifyParty', 'address', 'state']).setValue(event.parameter2);
    }
    this.maintainHouseInformation.get(['notifyParty', 'address', 'postal']).setValue(event.parameter1);
  }


  /**
   * LifeCycle Hook
   * search the house info if the parentData value is changed 
   * 
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges) {

    if (changes.parentData.currentValue) {
      this.enableForm();
      this.disableCancelFlag = true;
      this.houseModel = changes.parentData.currentValue;

      this.maintainHouseInformation.reset();
      this.maintainHouseInformation.patchValue(this.houseModel);
      this.maintainHouseInformation.get('weightUnitCode').patchValue('K');

      if (this.houseModel.id) {
        this.onSearch(this.houseModel);
      } else {
        this.hawbDisabledFlag = false;
        this.addDefaultRowsForAllLists();
      }
    }
  }

}
