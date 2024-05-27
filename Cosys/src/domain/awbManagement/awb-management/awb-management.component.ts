import { CustomerCode } from './../../admin/admin.sharedmodel';
import { AlsoNotify, Consignee, Shipper, AwbManagementformSearch, AppointedAgentForm } from './../awbManagement.shared';
import { ActivatedRoute, Router } from '@angular/router';
import { AwbManagementService } from '../awbManagement.service';
import { Component, ElementRef, NgZone, ViewChild, ViewContainerRef, Output, Input, EventEmitter } from '@angular/core';
import { AwbRoutingReqModel, LOVRequest, emailInfo, AwbManagementform, SearchAWB } from '../awbManagement.shared';
import {
  NgcFormArray, NgcFormControl, NgcFormGroup, NgcInputComponent,
  NgcPage, NgcUtility, NgcWindowComponent, PageConfiguration, NgcLOVComponent, ReactiveModel, NgcReportComponent
} from 'ngc-framework';
import { Validators } from '@angular/forms';
import { Console } from 'console';
import { ApplicationEntities } from '../../common/applicationentities';
import { ApplicationFeatures } from '../../common/applicationfeatures';

@Component({
  selector: 'app-awb-management',
  templateUrl: './awb-management.component.html',
  styleUrls: ['./awb-management.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  functionId: 'AWB_DOCUMENT'
})
export class AwbManagementComponent extends NgcPage {
  /* 
  * Reactive Form
  */
  @ReactiveModel(AwbManagementform)
  public form: NgcFormGroup;

  @ReactiveModel(AwbManagementformSearch)
  public searchForm: NgcFormGroup;

  @ReactiveModel(AppointedAgentForm)
  public appointedAgentForm: NgcFormGroup;

  @ViewChild("reportAWB") reportAWB: NgcReportComponent;
  @ViewChild('appointedAgent') appointedAgent: NgcLOVComponent;
  @ViewChild('appointedAgentShipper') appointedAgentShipper: NgcLOVComponent;
  @ViewChild('appointedAgentsWindow') appointedAgentsWindow: NgcWindowComponent;
  oldPieces: any = null;
  oldWeight: any = null;
  reportParameters: any;
  customerCodeList: any;
  subMessageParameter: {};
  responseArray: any = null;
  consigneAgentSourceParameter: {};
  parameterForShpAppointedAgent: any;
  consigneeMandatoryFlag: boolean = false;
  routingFlag: boolean = false;
  // FLAG FOR CONTAINERS START HERE
  chgWeightFlag = false;
  handledByHouse = false;
  importFlag = false;
  exportFlag = false;
  transhipmentFlag = false;
  disableButton = false;
  saveFlag: boolean = false;
  printFlag: boolean = false;
  shipmentTypeFlag: string;
  oldshipmentTypeFlag: string;
  awbOnHoldFlag: boolean = false;
  shipmentCancelled: boolean = false;
  awbFreightOutFlag: boolean = false;
  awbInventoryFlag: boolean = false;
  awbIrregularityFlag: boolean = false;
  changeHandlingFlag: boolean = false;
  handlingFlag: boolean = false;
  // Navigated Data From Another Screen
  transferedData: any = null;
  transferData: any = null;
  // Show and Hide Table Content
  showTabledata = false;
  @ViewChild("shipmentType") shipmentType: any = 'AWB';
  shipmentTypeValue: any = 'AWB';
  forwardedData: any;
  isSearching = false;
  // saveDisable = false;
  agentContactType: any[];
  chargesValidation: string = "";
  shipperValidation: string = "";
  consigneeValidation: string = "";
  locatAuthorityValidation: string = "";
  otherInformationRemarksValidation: string = "";
  alsoNotifyValidation: string = "";
  calculation: number;
  @Input('shipmentNumberData') shipmentNumberData: string;
  @Input('shipmentTypeData') shipmentTypeData: string;
  @Input('showAsPopup') showAsPopup: boolean;
  @Output() autoSearchShipmentInfo = new EventEmitter<boolean>();
  roundUpValue: any;
  airportCode: any;
  cityCode: any;

  //  shipmentCustomerInfoId: any;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    private router: Router,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private awbDocumentService: AwbManagementService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    //
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    //
    this.retrieveLOVRecords("KEY_AWB_CONSIGNEE_DATA_REVAMP").subscribe(record => {
      this.customerCodeList = record;
    });
    if (this.forwardedData && Object.keys(this.forwardedData).length > 0) {
      this.searchForm.patchValue(this.forwardedData);
      this.search();
    }
    if (this.shipmentTypeData || this.shipmentNumberData) {
      this.searchForm.get('shipmentNumber').patchValue(this.shipmentNumberData);
      this.searchForm.get('shipmentType').patchValue(this.shipmentTypeData);
      this.shipmentType = this.shipmentTypeData;
      this.search();
    } else {
      this.shipmentType = 'AWB';
      this.searchForm.get('shipmentType').patchValue(this.shipmentType);
    }
    this.airportCode = NgcUtility.getTenantConfiguration().airportCode;
    this.cityCode = NgcUtility.getTenantConfiguration().cityCode;
  }
  onCancel(event) {
    this.showConfirmMessage('on.cancel.message').then(fulfilled => {
      this.navigateBack(this.forwardedData);
    });
  }
  /**
  * After Control Init
  *
  * @param event Event
  */
  protected afterControlInit(event) {
  }

  protected afterFocus() {
    (this.form.get(['consignee', 'customerCode']) as NgcFormControl).focus();
  }

  selectShipmentType(event) {
    if (event.shipmentType) {
      this.shipmentTypeValue = event.shipmentType;
      this.searchForm.get('shipmentType').patchValue(event.shipmentType);
    }

  }

  private onSearch() {
    this.search();
    this.onAwbNumberChange();
  }

  /**
   * Search Record Data
   */
  search() {
    this.chargesValidation = "";
    this.shipperValidation = "";
    this.consigneeValidation = "";
    this.locatAuthorityValidation = "";
    this.otherInformationRemarksValidation = "";
    this.alsoNotifyValidation = "";
    this.consigneeMandatoryFlag = false;
    const searchRequest = this.searchForm.getRawValue();
    this.form.get('shcs').patchValue([]);
    if (searchRequest.shipmentNumber == null) {
      this.showErrorStatus('g.shipment.number.mandatory');
      return;
    }
    let checkLength = searchRequest.shipmentNumber.toString();
    if (searchRequest.shipmentType == 'UCB' && searchRequest.nonIATA && checkLength.length < 1) {
      this.showErrorStatus('g.invalid.shipment.number');
      return;
    }
    this.searchForm.validate();
    if (!this.searchForm.valid) {
      return;
    }
    if (!searchRequest.nonIATA) {
      searchRequest["shipmentNumber"] = searchRequest["shipmentNumber"].replace('-', '');
    }
    this.resetFormMessages();
    this.awbDocumentService.fetchAwbDocumentDetails(searchRequest).subscribe(response => {
      this.saveFlag = true;
      this.printFlag = true;
      this.isSearching = true;
      this.chgWeightFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_ChargeableWeight);
      this.form.get(['consignee', 'authorizationRemarks']).setValidators([]);
      this.resetFormMessages();
      this.responseArray = response.data ? response.data : {};
      this.responseArray.shipmentType = this.shipmentTypeValue;
      if (response.messageList) {
        this.showErrorStatus(response.messageList[0].code);
        return;
      }
      if (this.responseArray.shipmentId) {
        this.oldshipmentTypeFlag = response.data.shipmentType;
        if (this.responseArray.shipmentType == 'AWB') {
          this.shipmentTypeFlag = 'CBV';
        } else {
          this.shipmentTypeFlag = 'AWB';
        }
      }
      if (this.responseArray) {
        this.setValueToCharges(this.responseArray);
        this.form.reset();
        this.showTabledata = false;
        this.refreshFormMessages(this.responseArray);
        this.roundUpValue = this.responseArray.roundUpValue;
        this.oldPieces = this.responseArray.pieces;
        this.oldWeight = this.responseArray.weight;
        this.responseArray.actualWeight = NgcUtility.getDisplayWeight(this.responseArray.actualWeight);
        if (this.responseArray.routing != null) {
          if (this.responseArray.routing.length == 0) {
            this.routingFlag = true;
          }
        } else {
          this.routingFlag = true;
        }
        this.assignAllLists();
        if (this.responseArray.flightKey == null && this.responseArray.flightDate == null
          && this.responseArray.documentType == null
          && (this.responseArray.destination != null
            && !NgcUtility.isTenantCityOrAirport(this.responseArray.destination))
          && (this.responseArray.origin != null
            && !NgcUtility.isTenantCityOrAirport(this.responseArray.origin))) {
          this.responseArray.consignee = null;
          this.responseArray.shipper = null;
        }
        if (this.responseArray.consignee) {
          this.allConsigneeOperations();
        }
        if (this.responseArray.shipper) {
          if (this.responseArray.shipper.contactEmail) {
            let emailList = this.responseArray.shipper.contactEmail.split(',');
            this.responseArray.shipper.contactEmail = emailList;
          }
        }
        if (this.responseArray.consignee) {
          if (this.responseArray.consignee.contactEmail) {
            let emailList = this.responseArray.consignee.contactEmail.split(',');
            this.responseArray.consignee.contactEmail = emailList;
          }
        }
        //patch  awbdocument response data 
        this.form.patchValue(this.responseArray, { newSet: true });
        this.awbOnHoldFlag = this.responseArray.awbOnHold;
        this.awbInventoryFlag = this.responseArray.shipmentInventoryFlag;
        this.awbIrregularityFlag = this.responseArray.shipmentIrregularityFlag;
        this.awbFreightOutFlag = this.responseArray.shipmentFreightOutFlag;
        this.changeHandlingFlag = this.responseArray.handlingChangeFlag;
        if (this.responseArray.cancelledOn != null) {
          this.shipmentCancelled = true;
        }
        else {
          this.shipmentCancelled = false;
        }
        if (!this.awbOnHoldFlag && !this.awbFreightOutFlag && !this.shipmentCancelled && this.changeHandlingFlag) {
          this.handlingFlag = true;
        } else {
          this.handlingFlag = false;
        }
        if (this.responseArray.handledByMasterHouse == 'H') {
          this.handledByHouse = true;
        }
        else {
          this.handledByHouse = false;
        }
        this.onChangeLarType();
        this.consigneeMandatory();
        if (this.responseArray && this.responseArray.destination != null && this.responseArray.origin != null
          && !NgcUtility.isTenantCityOrAirport(this.responseArray.destination)
          && !NgcUtility.isTenantCityOrAirport(this.responseArray.origin)) {
          this.shipperDetailsMandatory();
        }
      } else {
        this.showTabledata = false;
        this.refreshFormMessages(response);
      }
      let val = this.responseArray.destination;
      let awbDataRequest = {
        shipmentNumber: this.form.get('shipmentNumber').value
      }

      // this.caluclateTotalCharge();
      if (NgcUtility.isTenantCityOrAirport(this.responseArray.destination)) {
        (<NgcFormArray>this.form.get(['chargeCode'])).setValidators([Validators.required, Validators.maxLength(2)]);
      } else if (NgcUtility.isTenantCityOrAirport(this.responseArray.origin)) {
        (<NgcFormArray>this.form.get(['chargeCode'])).setValidators([]);
        if (this.responseArray.localAuthority) {
          if (this.responseArray.localAuthority.length > 0) {
            if (this.responseArray.localAuthority[0].details.length > 0) {
              if (this.responseArray.localAuthority[0].details[0].referenceNumber === null) {
                this.responseArray.localAuthority[0].type = 'PTF';
                this.responseArray.localAuthority[0].details[0].referenceNumber = 'PTF';
              }
            } else {
              this.addNewLocalAuthorityDataDetails();
            }
          } else {
            this.addNewLocalAuthorityData();
          }
        } else {
          this.addNewLocalAuthorityData();
        }
      }
      if (this.responseArray && this.responseArray.destination != null && this.responseArray.origin != null
        && !NgcUtility.isTenantCityOrAirport(this.responseArray.destination) && !NgcUtility.isTenantCityOrAirport(this.responseArray.origin)) {
        (<NgcFormArray>this.form.get(['chargeCode'])).setValidators([]);
        if (this.responseArray && this.responseArray.localAuthority != null && this.responseArray.localAuthority.length > 0 &&
          (this.responseArray.localAuthority[0].details == null || this.responseArray.localAuthority[0].details.length == 0)) {
          this.addNewLocalAuthorityDataDetails();
          this.form.get(['localAuthority', 0, 'type']).setValue('EC');
          this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValue('TS');
          this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).clearValidators();
          this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValidators([Validators.maxLength(2)]);
          this.form.get(['localAuthority', 0, 'details', 0, 'license']).setValidators([Validators.maxLength(65)]);
          this.form.get(['localAuthority', 0, 'details', 0, 'remarks']).setValidators([Validators.maxLength(65)]);
        } else if (this.responseArray && (this.responseArray.localAuthority == null || this.responseArray.localAuthority.length == 0)) {
          this.addNewLocalAuthorityData();
          this.addNewLocalAuthorityDataDetails();
          this.form.get(['localAuthority', 0, 'type']).setValue('EC');
          this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValue('TS');
          this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).clearValidators();
          this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValidators([Validators.maxLength(2)]);
          this.form.get(['localAuthority', 0, 'details', 0, 'license']).setValidators([Validators.maxLength(65)]);
          this.form.get(['localAuthority', 0, 'details', 0, 'remarks']).setValidators([Validators.maxLength(65)]);
        }
      }
      this.addNewDataList();
      this.onSelectAppointedAgentCodeCne();
      this.alsoNotifyMandatory();
      this.isCustomerCodeExistInMaster();
      // It will create template as per IMPORT EXPORT AND TRANSHIPMENT
      this.tabsRequiredOnSearchOnOriginDestination(null, null);

      this.async(() => {
        try {
          (this.form.get('origin') as NgcFormControl).focus();
        } catch (e) { }
      }, 50);
    });
  }

  private isCustomerCodeExistInMaster() {
    if (this.form.get(['consignee']).value === null || this.form.get(['consignee', 'customerName']).value === null) {
      this.form.get(['consignee']).reset();
      return;
    }
    let customerCode: string = this.form.get(['consignee', 'customerCode']).value;
    let count = 0;
    if (this.customerCodeList) {
      (<NgcFormArray>this.customerCodeList.filter(record => {
        if (record.code === customerCode) {
          count++;
        }
      }));
    }
    if (count > 0) {
      this.form.get(['consignee', 'customerName']).disable();

      if (this.form.get(['consignee', 'address', 'place']).value) {
        this.form.get(['consignee', 'address', 'place']).disable();
      }

      if (this.form.get(['consignee', 'address', 'postal']).value) {
        this.form.get(['consignee', 'address', 'postal']).disable();
      }

      if (this.form.get(['consignee', 'address', 'countryCode']).value) {
        this.form.get(['consignee', 'address', 'countryCode']).disable();
      }

      if (this.form.get(['consignee', 'address', 'streetAddress']).value) {
        this.form.get(['consignee', 'address', 'streetAddress']).disable();
      }
    } else {
      this.form.get(['consignee', 'customerName']).enable();
      this.form.get(['consignee', 'address', 'place']).enable();
      this.form.get(['consignee', 'address', 'postal']).enable();
      this.form.get(['consignee', 'address', 'countryCode']).enable();
      this.form.get(['consignee', 'address', 'streetAddress']).enable();
      this.consigneAgentSourceParameter = this.createSourceParameter(null);
      if (!this.isSearching) {
        (<NgcFormControl>this.form.get(['consignee', 'accountNumber'])).setValue(null);
        (<NgcFormControl>this.form.get(['consignee', 'overseasCustomer'])).setValue(false);
        (<NgcFormControl>this.form.get(['consignee', 'address', 'place'])).setValue(null);
        (<NgcFormControl>this.form.get(['consignee', 'address', 'postal'])).setValue(null);
        (<NgcFormControl>this.form.get(['consignee', 'address', 'countryCode'])).setValue(null);
        (<NgcFormControl>this.form.get(['consignee', 'address', 'streetAddress'])).setValue(null);
        (<NgcFormControl>this.form.get(['consignee', 'customerName'])).setValue(null, { onlySelf: true, emitEvent: false });
      }
      this.isSearching = false;
    }
  }

  private isCustomerCodeExistInMasterNew() {
    if (this.form.get(['consignee']).value === null || this.form.get(['consignee', 'customerCode']).value === null) {
      return;
    }
    let customerCode: string = this.form.get(['consignee', 'customerCode']).value;
    let count = 0;
    (<NgcFormArray>this.customerCodeList.filter(record => {
      if (record.code === customerCode) {
        count++;
      }
    }));
    if (count > 0) {
      this.form.get(['consignee', 'customerName']).disable();
      this.form.get(['consignee', 'address', 'place']).disable();
      this.form.get(['consignee', 'address', 'postal']).disable();
      this.form.get(['consignee', 'address', 'countryCode']).disable();
      this.form.get(['consignee', 'address', 'streetAddress']).disable();
    } else {
      this.form.get(['consignee', 'customerName']).enable();
      this.form.get(['consignee', 'address', 'place']).enable();
      this.form.get(['consignee', 'address', 'postal']).enable();
      this.form.get(['consignee', 'address', 'countryCode']).enable();
      this.form.get(['consignee', 'address', 'streetAddress']).enable();
      this.consigneAgentSourceParameter = this.createSourceParameter(null);
      if (!this.isSearching) {
        (<NgcFormControl>this.form.get(['consignee', 'accountNumber'])).setValue(null);
        (<NgcFormControl>this.form.get(['consignee', 'overseasCustomer'])).setValue(false);
        (<NgcFormControl>this.form.get(['consignee', 'address', 'place'])).setValue(null);
        (<NgcFormControl>this.form.get(['consignee', 'address', 'postal'])).setValue(null);
        (<NgcFormControl>this.form.get(['consignee', 'address', 'countryCode'])).setValue(null);
        (<NgcFormControl>this.form.get(['consignee', 'address', 'streetAddress'])).setValue(null);
        (<NgcFormControl>this.form.get(['consignee', 'customerCode'])).setValue(null, { onlySelf: true, emitEvent: false });
      }
      this.isSearching = false;
    }
  }

  onSave() {
    this.chargesValidation = "";
    this.shipperValidation = "";
    this.consigneeValidation = "";
    this.locatAuthorityValidation = "";
    this.otherInformationRemarksValidation = "";
    this.alsoNotifyValidation = "";
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.AWb_LoosePrepackDetails)) {
      if (this.saveshipmentPiecesWeight()) {
        return;
      }
    }
    //if it is import shipment shipper detail not required
    if (NgcUtility.isTenantCityOrAirport(this.form.get('destination').value)) {
      this.form.get(['shipper', 'customerName']).clearValidators();
      this.form.get(['shipper', 'address', 'place']).clearValidators();
      this.form.get(['shipper', 'address', 'streetAddress']).clearValidators();
      this.form.get(['shipper', 'address', 'postal']).clearValidators();
      this.form.get(['shipper']).reset();
    }
    if (this.form.get(['chargeCode']).value) {
      if (this.form.get(['chargeCode']).invalid) {
        return;
      }
      //to show red icon when charge code ic CC if no charges entered
      if (this.form.get('otherChargeInfo').invalid == true) {
        this.chargesValidation = "error";
        this.showErrorMessage("error.charges.required");
      } else {
        this.chargesValidation = "";
      }
    }

    if (this.form.get('consignee').invalid == true) {
      this.consigneeValidation = "error";
    } else {
      this.consigneeValidation = "";
    }

    if (this.form.get('alsoNotify').invalid == true) {
      this.alsoNotifyValidation = "error";
    } else {
      this.alsoNotifyValidation = "";
    }

    this.form.validate();
    if (!this.searchForm.valid) {
      return;
    }
    if (!NgcUtility.isTenantCityOrAirport(this.form.get('destination').value)) {
      this.alsoNotifyMandatory();
    }

    if ((this.importFlag || this.transhipmentFlag)
      && NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_ChargeableWeight)) {
      if (this.form.get('chargeableWeight').value == null) {
        this.showErrorMessage('expaccpt.fill.all.mandatory.details');
        return;
      }
    }

    if (!this.form.valid) {
      return;
    }
    if (this.form.get('origin').value === this.form.get('destination').value) {
      this.showErrorMessage('awb.origin.destination.not.same');
      return;
    }
    const saveRequest = this.form.getRawValue();
    console.log(saveRequest);
    saveRequest.shipmentType = this.shipmentTypeValue;
    saveRequest.oldPieces = this.oldPieces;
    saveRequest.oldWeight = this.oldWeight;

    if (saveRequest.weight == 0) {
      this.showErrorMessage('awb.weight.not.0');
    } else {
      if (NgcUtility.isTenantCityOrAirport(this.form.get('origin').value)) {
        if (saveRequest.localAuthority[0].details && saveRequest.localAuthority[0].details[0].customerAppAgentId) {
          saveRequest.shipper.appointedAgent = saveRequest.localAuthority[0].details[0].customerAppAgentId;
        }
      }
      if (NgcUtility.isTenantCityOrAirport(this.form.get('destination').value)) {
        saveRequest.localAuthority = [];
      }

      let emailFlag = false;
      if (saveRequest.shipper) {
        if (saveRequest.shipper.contactEmail) {
          for (const eachRow of saveRequest.shipper.contactEmail) {
            if (!this.validateEmail(eachRow)) {
              emailFlag = true;
            }
          }
          saveRequest.shipper.contactEmail = saveRequest.shipper.contactEmail.toString();
        }
      }
      if (saveRequest.consignee) {
        if (saveRequest.consignee.contactEmail) {
          for (const eachRow of saveRequest.consignee.contactEmail) {
            if (!this.validateEmail(eachRow)) {
              emailFlag = true;
            }
          }
          saveRequest.consignee.contactEmail = saveRequest.consignee.contactEmail.toString();
        }
        if (saveRequest.consignee.ivrsContactInfo) {
          for (const ivrsContact of saveRequest.consignee.ivrsContactInfo) {
            if (ivrsContact.contactTypeCode == 'EM' && ivrsContact.flagCRUD != 'D' && !this.validateEmail(ivrsContact.contactTypeDetail)) {
              this.showErrorStatus('awb.invalid.email.ivrs');
              return;
            }
          }
        }

      }

      if (emailFlag) {
        this.showErrorStatus('g.invalid.email');
        emailFlag = false;
        return;
      }
      if (this.transhipmentFlag == true && this.form.get('handledByMasterHouse').value == 'H') {
        this.showErrorStatus('transhipment.handling.always.M');
        return;
      }
      this.awbDocumentService.saveAWBDocumentDetails(saveRequest).subscribe(response => {
        this.refreshFormMessages(response);
        const resp = response.data;
        if (!this.showResponseErrorMessages(response)) {
          //no auto serch after save so setting up Pices/weight as old piece/weight 
          this.oldPieces = saveRequest.pieces;
          this.oldWeight = saveRequest.weight;
          this.showSuccessStatus('g.completed.successfully');
          this.autoSearchShipmentInfo.emit(true);
          this.onSearch();
        } else {
          if (this.form.get('shipper').invalid == true) {
            this.shipperValidation = "error";
          } else {
            this.shipperValidation = "";
          }
          if (this.form.get('consignee').invalid == true) {
            this.consigneeValidation = "error";
          } else {
            this.consigneeValidation = "";
          }
          if (this.form.get('alsoNotify').invalid == true) {
            this.alsoNotifyValidation = "error";
          } else {
            this.alsoNotifyValidation = "";
          }
          if (this.form.get('localAuthority').invalid == true) {
            this.locatAuthorityValidation = "error";
          } else {
            this.locatAuthorityValidation = "";
          }
          if (this.form.get('otherChargeInfo').invalid == true) {
            this.chargesValidation = "error";
            this.showErrorMessage("error.charges.required")
          } else {
            this.chargesValidation = "";
          }
          if (this.form.get('ssrRemarksList').invalid == true
            || this.form.get('osiRemarksList').invalid == true
            || this.form.get('generalRemarks').invalid == true) {
            this.otherInformationRemarksValidation = "error";
          } else {
            this.otherInformationRemarksValidation = "";
          }
        }
      }, error => {
        this.showErrorMessage(error);
      });
    }
  }
  /* 
  * For Assigning all lists Value
  * shcList; routingList; osiList; ssrList; genList
  */
  assignAllLists() {
    const shcList = new Array();
    for (let index = 0; index < 9; index++) {
      if (this.responseArray.shcs && index < this.responseArray.shcs.length) {
        if (this.responseArray.shcs[index]) {
          shcList.push({ specialHandlingCode: this.responseArray.shcs[index].specialHandlingCode });
        }
      }
    }
    const routingList = new Array();
    for (let index = 0; index < 3; index++) {
      if (this.responseArray.routing && index < this.responseArray.routing.length) {
        if (this.responseArray.routing[index]) {
          routingList.push({ carrier: this.responseArray.routing[index].carrier, fromPoint: this.responseArray.routing[index].fromPoint });
        }
      } else {
        routingList.push({ carrier: null, fromPoint: null });
      }
    }
    const osiList = new Array();
    for (let index = 0; index < 3; index++) {
      if (this.responseArray.osiRemarksList && index < this.responseArray.osiRemarksList.length) {
        if (this.responseArray.osiRemarksList[index]) {
          osiList.push({ shipmentRemarksId: this.responseArray.osiRemarksList[index].shipmentRemarksId, shipmentRemarks: this.responseArray.osiRemarksList[index].shipmentRemarks });
        }
      } else {
        osiList.push({ shipmentRemarks: '', shipmentType: '' });
      }
    }
    const ssrList = new Array();
    for (let index = 0; index < 3; index++) {
      if (this.responseArray.ssrRemarksList && index < this.responseArray.ssrRemarksList.length) {
        if (this.responseArray.ssrRemarksList[index]) {
          ssrList.push({ shipmentRemarksId: this.responseArray.ssrRemarksList[index].shipmentRemarksId, shipmentRemarks: this.responseArray.ssrRemarksList[index].shipmentRemarks, shipmentType: '' });
        }
      } else {
        ssrList.push({ shipmentRemarks: '', shipmentType: '' });
      }
    }
    const genList = new Array();
    for (let index = 0; index < 3; index++) {
      if (this.responseArray.generalRemarks && index < this.responseArray.generalRemarks.length) {
        if (this.responseArray.generalRemarks[index]) {
          genList.push({ shipmentRemarksId: this.responseArray.generalRemarks[index].shipmentRemarksId, shipmentRemarks: this.responseArray.generalRemarks[index].shipmentRemarks, shipmentType: '' });
        }
      } else {
        genList.push({ shipmentRemarks: '', shipmentType: '' });
      }
    }
    this.responseArray.shcs = shcList;
    this.responseArray.osiRemarksList = osiList;
    this.responseArray.ssrRemarksList = ssrList;
    this.responseArray.generalRemarks = genList;
    this.responseArray.routing = routingList;
  }

  /**
   * For Adding One Row For Local Authority when record is null
   * @param type 
   */
  onAddLarType(type: any) {
    if ((<NgcFormArray>this.form.get("localAuthority")).length === 0) {
      (<NgcFormArray>this.form.get("localAuthority")).addValue([{
        type: type,
        details: [{
          deliveryOrderNo: '',
          license: '',
          appointedAgentName: '',
          remarks: '',
          referenceNumber: '',
          exemptionCode: '',
          permitNumbers: '',
          appointedAgent: '',
          customsAgentCode: '',
          customerAppAgentId: '',
          tsRedocFlightDate: '',
          tsRedocFlightKey: '',
          transactionSequenceNo: Math.floor((Math.random() * 100) + 1),
        }]
      }]);
    }
  }

  /**
  * Changing the value of Local Authority as per origin and destination
  */
  onChangeLarType() {
    if (this.responseArray.origin && this.responseArray.destination) {
      if (!NgcUtility.isTenantCityOrAirport(this.responseArray.destination) && !NgcUtility.isTenantCityOrAirport(this.responseArray.origin) && (this.responseArray.localAuthority == null || this.responseArray.localAuthority.length == 0)) {
        this.onAddLarType('EC');
        this.form.get(['localAuthority', 0, 'type']).setValue('EC');
        if ((<NgcFormArray>this.form.get(['localAuthority', 0, 'details'])).length === 0) {
          this.addNewLocalAuthorityDataDetails();
        }
        this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValue('TS');
      } else if (NgcUtility.isTenantCityOrAirport(this.responseArray.origin) && !NgcUtility.isTenantCityOrAirport(this.responseArray.destination)) {
        if (this.responseArray.localAuthority) {
          this.responseArray.localAuthority.forEach(element => {
            if (element.type === null) {
              this.onAddLarType('PTF');
              this.form.get(['localAuthority', 0, 'type']).setValue('PTF');
              this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValue('PTF');
            }
          });
        }
      } else if (!NgcUtility.isTenantCityOrAirport(this.responseArray.origin) && NgcUtility.isTenantCityOrAirport(this.responseArray.destination)
        && (this.responseArray.localAuthority || (this.responseArray.localAuthority != null && this.responseArray.localAuthority.length < 1))) {
        this.responseArray.localAuthority = [];
      }
    }
  }


  /**
   * For Converting Email String to an Array
   * @param emailInfo 
   */
  convertEmailStringToarray(emailInfo: any) {
    let splitted: String[] = emailInfo.split(",");
    console.log(splitted)
    return splitted.toString();
  }

  onCurrencyTabout(event) {
    let data = this.form.getRawValue();
    this.form.get('otherChargeInfo.exchangeRate').reset();
    this.awbDocumentService.getExchangeRate(data).subscribe(response => {
      console.log(response.data);
      if (response.data && response.data.otherChargeInfo.exchangeRate !== null) {
        if (response.data.otherChargeInfo.exchangeRate == 0) {
          this.showErrorMessage("exchange.rate.not.found");
          return;
        }
        this.form.get('otherChargeInfo.exchangeRate').patchValue(response.data.otherChargeInfo.exchangeRate);
      }
    });
  }

  /**
   * For calculating the Total Chanrger using
   * exchangeRate; dueFromAgent; dueFromAirline; freightCharges; valuationCharges;
   */
  caluclateTotalCharge() {
    this.caluclateCC();
    let tax = this.form.get(['otherChargeInfo', 'tax']).value ? this.form.get(['otherChargeInfo', 'tax']).value : 0.0;
    let exchangeRate = this.form.get(['otherChargeInfo', 'exchangeRate']).value ? this.form.get(['otherChargeInfo', 'exchangeRate']).value : 0.0;
    let dueFromAgent = this.form.get(['otherChargeInfo', 'dueFromAgent']).value ? this.form.get(['otherChargeInfo', 'dueFromAgent']).value : 0.0;
    let dueFromAirline = this.form.get(['otherChargeInfo', 'dueFromAirline']).value ? this.form.get(['otherChargeInfo', 'dueFromAirline']).value : 0.0;
    let freightCharges = this.form.get(['otherChargeInfo', 'freightCharges']).value ? this.form.get(['otherChargeInfo', 'freightCharges']).value : 0.0;
    let valuationCharges = this.form.get(['otherChargeInfo', 'valuationCharges']).value ? this.form.get(['otherChargeInfo', 'valuationCharges']).value : 0.0;
    let total = (valuationCharges + freightCharges + dueFromAgent + dueFromAirline + tax)
    this.form.get('otherChargeInfo.total').setValue(total);
    let destinationCurrencyChargeAmount = 0.0;
    if (exchangeRate) {
      destinationCurrencyChargeAmount = (total * exchangeRate);
      destinationCurrencyChargeAmount = (Math.round(destinationCurrencyChargeAmount / this.roundUpValue)) * this.roundUpValue;
      this.form.get('otherChargeInfo.destinationCurrencyChargeAmount').setValue(destinationCurrencyChargeAmount);
    }
    let ccFee = this.form.get(['otherChargeInfo', 'ccFee']).value ? this.form.get(['otherChargeInfo', 'ccFee']).value : 0.0;
    ccFee = Number(ccFee);
    let totalCollectChargesChargeAmount = (destinationCurrencyChargeAmount + ccFee);
    this.form.get('otherChargeInfo.totalCollectChargesChargeAmount').setValue(this.roundByDecimal(Number(totalCollectChargesChargeAmount)));
  }

  roundByDecimal(currency) {
    let split = currency.toString().split(".");
    let splitIndex = Number(split[1]);
    let s = splitIndex / 10;
    let v = s.toString().split(".");
    if (v.length >= 1) {
      if ((Number(v[1]) > 5) && (Number(v[1]) < 7)) {
        currency = (Number(currency) + 0.02);
      } else if ((Number(v[1]) > 0) && (Number(v[1]) < 2)) {
        currency = Number(currency) + 0.02;
      }
    }
    var multiplier = 1 / (0.05);
    let ammount = Math.round(currency * multiplier) / multiplier;
    return ammount;
  }

  roundAbs(currency) {
    var y = Math.abs(currency) + 0.05;
    return Math.floor(y + 0.05)
  }

  setValueToCharges(value) {
    if (this.responseArray.otherChargeInfo) {
      this.responseArray.otherChargeInfo.tax = this.responseArray.otherChargeInfo.tax ? this.responseArray.otherChargeInfo.tax : 0;
      this.responseArray.otherChargeInfo.ccFee = this.responseArray.otherChargeInfo.ccFee ? this.responseArray.otherChargeInfo.ccFee : 0;
      this.responseArray.otherChargeInfo.minccFee = this.responseArray.otherChargeInfo.minccFee ? this.responseArray.otherChargeInfo.minccFee : 0;
      this.responseArray.otherChargeInfo.exchangeRate = this.responseArray.otherChargeInfo.exchangeRate ? this.responseArray.otherChargeInfo.exchangeRate : 0;
      this.responseArray.otherChargeInfo.dueFromAgent = this.responseArray.otherChargeInfo.dueFromAgent ? this.responseArray.otherChargeInfo.dueFromAgent : 0;
      this.responseArray.otherChargeInfo.dueFromAirline = this.responseArray.otherChargeInfo.dueFromAirline ? this.responseArray.otherChargeInfo.dueFromAirline : 0;
      this.responseArray.otherChargeInfo.freightCharges = this.responseArray.otherChargeInfo.freightCharges ? this.responseArray.otherChargeInfo.freightCharges : 0;
      this.responseArray.otherChargeInfo.ccFeeprecentage = this.responseArray.otherChargeInfo.ccFeeprecentage ? this.responseArray.otherChargeInfo.ccFeeprecentage : 0;
      this.responseArray.otherChargeInfo.valuationCharges = this.responseArray.otherChargeInfo.valuationCharges ? this.responseArray.otherChargeInfo.valuationCharges : 0;
      this.responseArray.otherChargeInfo.destinationCurrencyChargeAmount = this.responseArray.otherChargeInfo.destinationCurrencyChargeAmount ? this.responseArray.otherChargeInfo.destinationCurrencyChargeAmount : 0;
    }

  }
  caluclateTotalCollectChargesChargeAmount() {
    let ccFee = this.form.get(['otherChargeInfo', 'ccFee']).value;
    let destinationCurrencyChargeAmount = this.form.get(['otherChargeInfo', 'destinationCurrencyChargeAmount']).value;
    let totalCollectChargesChargeAmount = (destinationCurrencyChargeAmount + ccFee);
    this.form.get('otherChargeInfo.totalCollectChargesChargeAmount').setValue(totalCollectChargesChargeAmount);

  }

  tabInfo(event) {
    if (event.index == 3) {
      (this.form.get(['otherChargeInfo', 'currency']) as NgcFormControl).focus();
    }
  }

  /* 
  * Sub Function for Calculation of caluclateTotalCharge
  */
  caluclateCC() {
    let ccFeeprecentage = this.form.get('ccFeeprecentage').value ? this.form.get('ccFeeprecentage').value : 0;
    let minccFee = this.form.get('minccFee').value ? this.form.get('minccFee').value : 0;
    let freightCharges = this.form.get('otherChargeInfo.freightCharges').value ? this.form.get('otherChargeInfo.freightCharges').value : 0;
    let valuationCharges = this.form.get('otherChargeInfo.valuationCharges').value ? this.form.get('otherChargeInfo.valuationCharges').value : 0;
    let exchangeRate = this.form.get('otherChargeInfo.exchangeRate').value ? this.form.get('otherChargeInfo.exchangeRate').value : 0;
    let ccFee1 = 0;
    let ccFee2 = 0;
    if (exchangeRate) {
      ccFee1 = (((freightCharges + valuationCharges) * exchangeRate) * Number(ccFeeprecentage)) / 100;
      ccFee2 = Number(minccFee);
    }
    if (ccFee1 > ccFee2) {
      this.form.get('otherChargeInfo.ccFee').setValue(ccFee1);
    } else {
      this.form.get('otherChargeInfo.ccFee').setValue(ccFee2);
    }
  }

  /* 
  * All the validations related to Consignee will come under this function
  */
  allConsigneeOperations() {
    if (this.responseArray.consignee.contactEmail) {
      this.responseArray.consignee.contactEmail = this.convertEmailStringToarray(this.responseArray.consignee.contactEmail);
    }
    if (this.responseArray.consignee.customerCode !== null) {
      this.consigneAgentSourceParameter = this.createSourceParameter(this.responseArray.consignee.customerCode);
    } else {
      this.consigneAgentSourceParameter = null;
    }
    this.subMessageParameter = this.createSourceParameter(this.responseArray.consignee.id);
  }

  /**
   * On Selection of Shipper Details patching the related value in TAB
   * @param event 
   * @param item 
   */
  onSelectShipperName(event, item) {
    if (event.code) {
      this.onSelectAppointedAgentCodeShp(event.code);
      this.parameterForShpAppointedAgent = event.code;
      this.form.get(['shipper', 'customerId']).setValue(event.param5);
      this.form.get(['shipper', 'customerCode']).setValue(event.code);
      this.form.get(['shipper', 'accountNumber']).setValue(event.param4);
      this.form.get(['shipper', 'address', 'place']).setValue(event.param2);
      this.form.get(['shipper', 'address', 'postal']).setValue(event.parameter1);
      this.form.get(['shipper', 'address', 'streetAddress']).setValue(event.param1);
      this.form.get(['shipper', 'address', 'stateCode']).setValue(event.parameter2);
      this.form.get(['shipper', 'address', 'countryCode']).setValue(event.parameter3);
    }
    else {
      this.form.get(['shipper', 'customerId']).setValue(null);
      this.form.get(['shipper', 'accountNumber']).setValue(null);
      this.form.get(['shipper', 'address', 'place']).setValue(null);
      this.form.get(['shipper', 'address', 'postal']).setValue(null);
      this.form.get(['shipper', 'address', 'streetAddress']).setValue(null);
      this.form.get(['shipper', 'address', 'stateCode']).setValue(null);
      this.form.get(['shipper', 'address', 'countryCode']).setValue(null);
      (<NgcFormControl>this.form.get(['shipper', 'appointedAgentCode'])).setValue('EXX');
    }
    this.shipperDetailsMandatory();
  }

  shipperDetailsMandatory() {
    if (this.form.get(['shipper']).value && (this.form.get(['shipper', 'customerName']).value || this.form.get(['shipper', 'customerCode']).value)) {
      (<NgcFormControl>this.form.get(['shipper', 'address', 'place'])).setValidators([Validators.required, Validators.maxLength(17)]);
      //if (!this.transhipmentFlag) {
      if (this.responseArray && this.responseArray.destination != null && this.responseArray.origin != null
        && !(!NgcUtility.isTenantCityOrAirport(this.responseArray.destination)
          && !NgcUtility.isTenantCityOrAirport(this.responseArray.origin))) {
        (<NgcFormControl>this.form.get(['shipper', 'address', 'postal'])).setValidators([Validators.required, Validators.maxLength(10)]);
      }
      (<NgcFormControl>this.form.get(['shipper', 'address', 'streetAddress'])).setValidators([Validators.required, Validators.maxLength(70)]);
    } else {
      (<NgcFormControl>this.form.get(['shipper', 'accountNumber'])).setValue(null);
      (<NgcFormControl>this.form.get(['shipper', 'address', 'stateCode'])).setValidators([]);
      (<NgcFormControl>this.form.get(['shipper', 'address', 'countryCode'])).setValidators([]);
      (<NgcFormControl>this.form.get(['shipper', 'address', 'streetAddress'])).setValidators([]);
      (<NgcFormControl>this.form.get(['shipper', 'address', 'postal'])).setValidators([]);
      (<NgcFormControl>this.form.get(['shipper', 'address', 'place'])).setValidators([]);

      (<NgcFormControl>this.form.get(['shipper', 'address', 'place'])).setValue(null);
      (<NgcFormControl>this.form.get(['shipper', 'address', 'postal'])).setValue(null);
      (<NgcFormControl>this.form.get(['shipper', 'address', 'streetAddress'])).setValue(null);
      (<NgcFormControl>this.form.get(['shipper', 'address', 'stateCode'])).setValue(null);
      (<NgcFormControl>this.form.get(['shipper', 'address', 'countryCode'])).setValue(null);
      (<NgcFormControl>this.form.get(['shipper', 'appointedAgentCode'])).setValue(null);
    }
  }

  /**
   * On Change of Consignee Name
   * @param event 
   */
  onSelectConsigneeName(event) {
    this.form.get(['consignee', 'authorizationRemarks']).setValidators([]);
    this.forConsigneeRecord(event);
    this.isCustomerCodeExistInMaster();
  }

  /**
   * On Change of Consignee Name
   * @param event 
   */
  onSelectConsigneeNameNew(event) {
    this.form.get(['consignee', 'authorizationRemarks']).setValidators([]);
    this.forConsigneeRecord(event);
    this.isCustomerCodeExistInMasterNew();
  }

  insertContactNotifyDetails(record) {
    this.retrieveLOVRecords("KEY_AWB_CONTACT_DETAILS", { param5: record }).subscribe(response => {
      if (response != null && response.length > 0) {
        const contactInformation = [];
        for (let data of response) {
          let contactInfo = {};
          contactInfo['contactTypeCode'] = data.code;
          contactInfo['contactTypeDetail'] = data.desc;
          contactInformation.push(contactInfo);
        }
        (<NgcFormArray>this.form.get(['alsoNotify', 'address', 'contacts'])).patchValue(contactInformation);
      } else {
        (<NgcFormArray>this.form.get(['alsoNotify', 'address', 'contacts'])).patchValue([]);
      }
    });
  }

  insertContactDetails(record) {
    this.retrieveLOVRecords("KEY_AWB_CONTACT_DETAILS", { param5: record }).subscribe(response => {
      if (response != null && response.length > 0) {
        const contactInformation = [];
        for (let data of response) {
          let contactInfo = {};
          contactInfo['contactTypeCode'] = data.code;
          contactInfo['contactTypeDetail'] = data.desc;
          contactInformation.push(contactInfo);
        }
        (<NgcFormArray>this.form.get(['consignee', 'address', 'contacts'])).patchValue(contactInformation);
      } else {
        (<NgcFormArray>this.form.get(['consignee', 'address', 'contacts'])).patchValue([]);
      }
    });
  }

  consigneeMandatory() {
    if (!NgcUtility.isTenantCityOrAirport(this.form.get(['origin']).value) && NgcUtility.isTenantCityOrAirport(this.form.get(['destination']).value)) {
      this.form.get(['consignee', 'customerName']).setValidators(Validators.required);
      this.form.get(['consignee', 'address', 'place']).setValidators([Validators.required, Validators.maxLength(17)]);
      this.form.get(['consignee', 'address', 'postal']).setValidators([Validators.required, Validators.maxLength(10)]);
      this.form.get(['consignee', 'address', 'streetAddress']).setValidators([Validators.required, Validators.maxLength(70)]);
      this.form.get(['consignee', 'address', 'countryCode']).setValidators(Validators.required);
      this.form.get(['consignee', 'appointedAgentCode']).setValidators(Validators.required);
      this.form.get(['chargeCode']).setValidators([Validators.required, Validators.maxLength(2)]);
      this.consigneeMandatoryFlag = true;
    } else {
      this.form.get(['chargeCode']).setValidators([]);
      this.form.get(['consignee', 'customerName']).setValidators([]);
      this.form.get(['consignee', 'address', 'place']).setValidators([Validators.maxLength(17)]);
      this.form.get(['consignee', 'address', 'postal']).setValidators([Validators.maxLength(10)]);
      this.form.get(['consignee', 'appointedAgentCode']).setValidators([]);
      this.form.get(['consignee', 'address', 'streetAddress']).setValidators([Validators.maxLength(70)]);
      this.form.get(['consignee', 'address', 'countryCode']).setValidators([]);
      this.form.get(['consignee']).setValidators([]);
      this.form.get(['shipper']).setValidators([]);
      this.consigneeMandatoryFlag = false;
    }
  }


  onSelectAlsoNotifyCode(event, item) {
    if (event.code) {
      this.form.get('alsoNotify.customerId').setValue(event.param5);
      this.form.get('alsoNotify.accountNumber').setValue(event.param4);
      this.form.get('alsoNotify.address.place').setValue(event.param2);
      this.form.get(['alsoNotify', 'customerCode']).setValue(event.code);
      this.form.get(['alsoNotify', 'customerName']).setValue(event.desc);
      this.form.get('alsoNotify.address.postal').setValue(event.parameter1);
      this.form.get('alsoNotify.address.streetAddress').setValue(event.param1);
      this.form.get('alsoNotify.address.stateCode').setValue(event.parameter2);
      this.form.get('alsoNotify.address.countryCode').setValue(event.parameter3);
      this.insertContactNotifyDetails(event.param5);
    }
    this.alsoNotifyMandatory();
  }

  alsoNotifyMandatory() {
    if (this.form.get(['alsoNotify', 'customerCode']).value || this.form.get(['alsoNotify', 'customerName']).value) {
      this.form.get(['alsoNotify', 'customerName']).setValidators([Validators.required]);
      this.form.get(['alsoNotify', 'address', 'place']).setValidators([Validators.required, Validators.maxLength(17)]);
      this.form.get(['alsoNotify', 'address', 'postal']).setValidators([Validators.required, Validators.maxLength(10)]);
      this.form.get(['alsoNotify', 'address', 'streetAddress']).setValidators([Validators.required, Validators.maxLength(70)]);
    } else {
      this.form.get(['alsoNotify', 'customerName']).setValidators([]);
      this.form.get(['alsoNotify', 'address', 'place']).setValidators([Validators.maxLength(17)]);
      this.form.get(['alsoNotify', 'address', 'postal']).setValidators([Validators.maxLength(10)]);
      this.form.get(['alsoNotify', 'address', 'streetAddress']).setValidators([Validators.maxLength(70)]);
      this.form.get(['alsoNotify', 'address', 'place']).setValue(null);
      this.form.get(['alsoNotify', 'address', 'postal']).setValue(null);
      this.form.get(['alsoNotify', 'address', 'streetAddress']).setValue(null);
      this.form.get(['alsoNotify', 'address', 'countryCode']).setValue(null);
      this.form.get(['alsoNotify', 'address', 'stateCode']).setValue(null);
      this.form.get(['alsoNotify', 'accountNumber']).setValue(null);
    }
  }
  patchConsigneeValue(event) {
    if (event.code) {
      //      this.shipmentCustomerInfoId = event.param5;
      this.form.get(['consignee', 'customerId']).setValue(event.param5);
      this.form.get(['consignee', 'customerCode']).setValue(event.code);
      this.form.get(['consignee', 'customerName']).setValue(event.desc);
      if (event.param6) {
        const setEmail = [event.param6];
        this.form.get(['consignee', 'contactEmail']).setValue(setEmail);
      }
      this.form.get(['consignee', 'accountNumber']).setValue(event.param4);
      this.form.get(['consignee', 'address', 'place']).setValue(event.param2);
      this.consigneAgentSourceParameter = this.createSourceParameter(event.code);
      this.form.get(['consignee', 'address', 'postal']).setValue(event.parameter1);
      this.form.get(['consignee', 'address', 'streetAddress']).setValue(event.param1);
      this.form.get(['consignee', 'address', 'stateCode']).setValue(event.parameter2);
      this.form.get(['consignee', 'address', 'countryCode']).setValue(event.parameter3);
    }
  }

  onAddShipperContactContact() {
    (<NgcFormArray>this.form.get("shipper.address.contacts")).addValue([
      {
        contactTypeCode: "",
        contactTypeDetail: "",
      }
    ]);
  }

  onAddConsigneeContact() {
    (<NgcFormArray>this.form.get("consignee.address.contacts")).addValue([
      {
        contactTypeCode: "",
        contactTypeDetail: "",
      }
    ]);
  }

  onAddIvrsContact() {
    (<NgcFormArray>this.form.get("consignee.ivrsContactInfo")).addValue([
      {
        customerType: "",
        contactTypeCode: "",
        contactTypeDetail: "",
      }
    ]);
  }

  onAddPermitNumber(index) {
    let i = (<NgcFormArray>this.form.get(['localAuthority', index, 'details'])).length;
    (<NgcFormArray>this.form.get(['localAuthority', index, 'details'])).addValue([
      {
        deliveryOrderNo: '',
        license: '',
        remarks: '',
        referenceNumber: '',
        exemptionCode: '',
        permitNumbers: '',
        appointedAgent: '',
        customsAgentCode: '',
        customerAppAgentId: '',
        tsRedocFlightDate: '',
        appointedAgentName: '',
        tsRedocFlightKey: '',
        transactionSequenceNo: index,
      }
    ]);

    this.form.get(['localAuthority', index, 'details', i, 'referenceNumber']).setValidators([Validators.maxLength(12)]);

  }

  onAddAlsoNotifyContact() {
    (<NgcFormArray>this.form.get("alsoNotify.address.contacts")).addValue([
      {
        contactTypeCode: "",
        contactTypeDetail: "",
      }
    ]);
  }

  onDeleteConsigneeContact(event): void {
    (<NgcFormArray>this.form.get(['consignee', 'address', 'contacts'])).markAsDeletedAt(event);
  }

  onDeleteIvrsContact(event): void {
    (<NgcFormArray>this.form.get(['consignee', 'ivrsContactInfo'])).markAsDeletedAt(event);
  }

  onDeleteShipperContact(event) {
    (<NgcFormArray>this.form.get(['shipper', 'address', 'contacts'])).markAsDeletedAt(event);
  }

  onDeletePermitNumberRows(index, sindex) {
    (this.form.get(["localAuthority", index, 'details', sindex]) as NgcFormGroup).markAsDeleted();
  }

  onDeleteAlsoNotifyContact(event): void {
    (<NgcFormArray>this.form.get(['alsoNotify', 'address', 'contacts'])).markAsDeletedAt(event);
  }

  changeLocalAuthorityType(event) {
    console.log(event);

    if (event !== 'PN') {
      (<NgcFormArray>this.form.get(['localAuthority', 0, 'details'])).patchValue([]);
      (<NgcFormArray>this.form.get(['localAuthority', 0, 'details'])).addValue([
        {
          license: '',
          remarks: '',
          appointedAgentName: '',
          deliveryOrderNo: '',
          referenceNumber: '',
          exemptionCode: '',
          permitNumbers: '',
          appointedAgent: '',
          customsAgentCode: '',
          customerAppAgentId: '',
          tsRedocFlightDate: '',
          tsRedocFlightKey: '',
          transactionSequenceNo: 0,
        }
      ]);
    }
    if (event === 'PTF') {
      this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).clearValidators();
      this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValue('PTF');
      this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValidators([Validators.maxLength(3)]);
    } else {
      if ((<NgcFormArray>this.form.get(['localAuthority', 0, 'details'])).length > 0) {
        this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValue('');
      }
    }
    if (event === 'EC') {
      this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValue('TS');
      this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).clearValidators();
      this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValidators([Validators.maxLength(2)]);
      this.form.get(['localAuthority', 0, 'details', 0, 'license']).setValidators([Validators.maxLength(65)]);
      this.form.get(['localAuthority', 0, 'details', 0, 'remarks']).setValidators([Validators.maxLength(65)]);
    }

    if (event === 'PN') {
      this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).clearValidators();
      this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValidators([Validators.maxLength(12)]);
    }
  }

  addNewLocalAuthority() {
    (<NgcFormArray>this.form.get(['localAuthority'])).addValue([
      {
        type: '',
        details: [{
          license: '',
          remarks: '',
          appointedAgentName: '',
          deliveryOrderNo: '',
          referenceNumber: '',
          exemptionCode: '',
          permitNumbers: '',
          appointedAgent: '',
          customsAgentCode: '',
          customerAppAgentId: '',
          tsRedocFlightDate: '',
          tsRedocFlightKey: '',
          transactionSequenceNo: 0,
        }]
      }
    ]);
  }

  addNewLocalAuthorityDataDetails() {
    this.form.get(['localAuthority', 0, 'details']).patchValue([]);
    (<NgcFormArray>this.form.get(['localAuthority', 0, 'details'])).addValue([
      {
        license: '',
        remarks: '',
        appointedAgentName: '',
        deliveryOrderNo: '',
        referenceNumber: '',
        exemptionCode: '',
        permitNumbers: '',
        appointedAgent: '',
        customsAgentCode: '',
        customerAppAgentId: '',
        tsRedocFlightDate: '',
        tsRedocFlightKey: '',
        transactionSequenceNo: 0,
      }
    ]);
  }

  addNewDataList() {
    if (!this.form.get('alsoNotify')) {
      this.onAddAlsoNotifyContact();
    } else {
      if (this.form.get('alsoNotify.address.contacts')) {
        if ((<NgcFormArray>this.form.get('alsoNotify.address.contacts')).length === 0) {
          this.onAddAlsoNotifyContact();
        }
      } else {
        this.onAddAlsoNotifyContact();
      }
    }
    if (!this.form.get('consignee')) {
      this.onAddConsigneeContact();
    } else {
      if ((<NgcFormArray>this.form.get('consignee.address.contacts'))) {
        if ((<NgcFormArray>this.form.get('consignee.address.contacts')).length === 0) {
          this.onAddConsigneeContact();
        }
        if ((<NgcFormArray>this.form.get('consignee.ivrsContactInfo')).length === 0) {
          this.onAddIvrsContact();
        }
      } else {
        this.onAddConsigneeContact();
      }
    }
    if (!this.form.get('shipper')) {
      this.onAddShipperContactContact();
    } else {
      if ((<NgcFormArray>this.form.get('shipper.address.contacts'))) {
        if ((<NgcFormArray>this.form.get('shipper.address.contacts')).length === 0) {
          this.onAddShipperContactContact();
        }
      } else {
        this.onAddShipperContactContact();
      }
    }
  }

  tabsRequiredOnSearchOnOriginDestination(event, value) {
    if (this.routingFlag) {
      this.getRouteingDetails();
    }
    this.consigneeMandatory();
    this.checkLocalAuthority();
    this.importFlag = false;
    this.exportFlag = false;
    this.transhipmentFlag = false;
    if (this.form.get('isExport').value) {
      (<NgcFormControl>this.form.get(['flightKey'])).setValidators([]);
      (<NgcFormControl>this.form.get(['flightDate'])).setValidators([]);
      this.exportFlag = true;
      return;
    }
    (<NgcFormControl>this.form.get(['shipmentType'])).setValue(this.shipmentTypeValue);
    (<NgcFormControl>this.form.get(['flightKey'])).setValidators([Validators.required]);
    (<NgcFormControl>this.form.get(['flightDate'])).setValidators([Validators.required]);
    if (NgcUtility.isTenantCityOrAirport(this.form.get('origin').value)) {
      (<NgcFormControl>this.form.get(['flightKey'])).setValidators([]);
      (<NgcFormControl>this.form.get(['flightDate'])).setValidators([]);
      this.importFlag = false;
      this.exportFlag = true;
      this.transhipmentFlag = false;
      if (value === 'origin') {
        this.async(() => {
          try {
            (this.form.get('destination') as NgcFormControl).focus();
          } catch (e) { }
        });
      } else if (value === 'destination') {
        this.async(() => {
          try {
            (this.form.get('pieces') as NgcFormControl).focus();
          } catch (e) { }
        });
      }
    } else if (NgcUtility.isTenantCityOrAirport(this.form.get('destination').value)) {
      this.importFlag = true;
      this.exportFlag = false;
      this.transhipmentFlag = false;
      if (value === 'origin') {
        this.async(() => {
          try {
            (this.form.get('destination') as NgcFormControl).focus();
          } catch (e) { }
        });
      } else if (value === 'destination') {
        this.async(() => {
          try {
            (this.form.get('pieces') as NgcFormControl).focus();
          } catch (e) { }
        });
      }
    } else {
      this.importFlag = false;
      this.exportFlag = false;
      this.transhipmentFlag = true;
      if (value === 'origin') {
        this.async(() => {
          try {
            (this.form.get('destination') as NgcFormControl).focus();
          } catch (e) { }
        });
      } else if (value === 'destination') {
        this.async(() => {
          try {
            (this.form.get('pieces') as NgcFormControl).focus();
          } catch (e) { }
        });
      }
    }
  }

  onOriginDestination(event, value) {
    this.getRouteingDetails();
    this.consigneeMandatory();
    this.checkLocalAuthority();
    this.importFlag = false;
    this.exportFlag = false;
    this.transhipmentFlag = false;
    if (this.form.get('isExport').value) {
      (<NgcFormControl>this.form.get(['flightKey'])).setValidators([]);
      (<NgcFormControl>this.form.get(['flightDate'])).setValidators([]);
      this.exportFlag = true;
      return;
    }
    (<NgcFormControl>this.form.get(['shipmentType'])).setValue(this.shipmentTypeValue);
    (<NgcFormControl>this.form.get(['flightKey'])).setValidators([Validators.required]);
    (<NgcFormControl>this.form.get(['flightDate'])).setValidators([Validators.required]);
    if (NgcUtility.isTenantCityOrAirport(this.form.get('origin').value)) {
      (<NgcFormControl>this.form.get(['flightKey'])).setValidators([]);
      (<NgcFormControl>this.form.get(['flightDate'])).setValidators([]);
      this.importFlag = false;
      this.exportFlag = true;
      this.transhipmentFlag = false;
      if (value === 'origin') {
        this.async(() => {
          try {
            (this.form.get('destination') as NgcFormControl).focus();
          } catch (e) { }
        });
      } else if (value === 'destination') {
        this.async(() => {
          try {
            (this.form.get('pieces') as NgcFormControl).focus();
          } catch (e) { }
        });
      }
    } else if (NgcUtility.isTenantCityOrAirport(this.form.get('destination').value)) {
      this.importFlag = true;
      this.exportFlag = false;
      this.transhipmentFlag = false;
      if (value === 'origin') {
        this.async(() => {
          try {
            (this.form.get('destination') as NgcFormControl).focus();
          } catch (e) { }
        });
      } else if (value === 'destination') {
        this.async(() => {
          try {
            (this.form.get('pieces') as NgcFormControl).focus();
          } catch (e) { }
        });
      }
    } else {
      this.importFlag = false;
      this.exportFlag = false;
      this.transhipmentFlag = true;
      if (value === 'origin') {
        this.async(() => {
          try {
            (this.form.get('destination') as NgcFormControl).focus();
          } catch (e) { }
        });
      } else if (value === 'destination') {
        this.async(() => {
          try {
            (this.form.get('pieces') as NgcFormControl).focus();
          } catch (e) { }
        });
      }
    }
  }

  getRouteingDetails() {
    if (this.form.get('carrierCode').value != null
      && this.form.get('origin').value != null
      && this.form.get('destination').value != null
      && this.form.get('carrierCode').value != ''
      && this.form.get('origin').value != ''
      && this.form.get('destination').value != ''
      && this.form.get('shipmentNumber').value !== null
      && this.form.get('shipmentNumber').value !== ''
      && this.form.get('shipmentdate').value !== null
      && this.form.get('shipmentdate').value !== ''
    ) {
      const req: AwbRoutingReqModel = new AwbRoutingReqModel();
      req.carrier = this.form.get('carrierCode').value;
      req.shipmentOrigin = this.form.get('origin').value;
      req.shipmentDate = this.form.get('shipmentdate').value;
      req.shipmentNumber = this.form.get('shipmentNumber').value;
      req.shipmentDestination = this.form.get('destination').value;
      this.awbDocumentService.awbDocumentRouting(req).subscribe(response => {
        if (response && response.data) {
          response.data.forEach((enr, index) => {
            this.form.get(['routing', index, 'fromPoint']).setValue(enr.nextDestination);
            this.form.get(['routing', index, 'carrier']).setValue(enr.nextCarrier);
          });
        }
      });
    }
  }

  selectCarrierCode(event) {
    if (event.code) {
      this.getRouteingDetails();
    }
  }

  addNewLocalAuthorityData() {
    if (!this.form.get('localAuthority')) {
      this.addNewLocalAuthority();
    } else {
      if (this.form.get('localAuthority')) {
        if ((<NgcFormArray>this.form.get('localAuthority')).length === 0) {
          this.addNewLocalAuthority();
        }
      } else {
        this.addNewLocalAuthority();
      }
    }
  }

  openInfoPopUp() {
    var fromDate1;
    fromDate1 = this.form.get(['shipmentdate']).value;
    var dataToSend = {
      entityValue: this.form.get(['shipmentNumber']).value,
      fromDate: fromDate1,
      toDate: new Date(),
      entityType: 'AWB'
    }
    console.log("dataToSend", dataToSend);
    this.navigateTo(this.router, '/audit/audittrail', dataToSend);
  }

  openIrregularityPage() {
    var dataToSend = {
      shipmentNumber: this.form.get(['shipmentNumber']).value,
      shipmentType: this.form.get(['shipmentType']).value
    }
    this.navigateTo(this.router, 'awbmgmt/irregularity', dataToSend);
  }

  openAWBRemark() {
    var dataToSend = {
      shipmentNumber: this.form.get(['shipmentNumber']).value,
      shipmentType: this.form.get(['shipmentType']).value
    }
    this.navigateTo(this.router, 'awbmgmt/maintainremarks', dataToSend);
  }
  onIssueDO() {
    var dataToSend = {
      shipmentNumber: this.form.get(['shipmentNumber']).value,
      chargeCode: this.form.get(['chargeCode']).value
    }
    this.navigateTo(this.router, 'import/issuedo', dataToSend)

  }

  openMaintainHousePage() {
    var dataToSend = {
      shipmentNumber: this.form.get(['shipmentNumber']).value,
      shipmentType: this.form.get(['shipmentType']).value
    }
    if (this.handledByHouse) {
      this.navigateTo(this.router, 'awbmgmt/housewaybilllist', dataToSend);
    }
    else {
      this.navigateTo(this.router, '/awbmgmt/maintainhouse', dataToSend);
    }
  }

  openMaintainFWBPage() {
    var dataToSend = {
      awbNumber: this.form.get(['shipmentNumber']).value,
      shipmentNumber: this.form.get(['shipmentNumber']).value,
      awbDate: this.form.get(['shipmentdate']).value,
      shipmentType: this.form.get(['shipmentType']).value
    }
    this.navigateTo(this.router, 'import/maintainfwb', dataToSend);
  }

  openChargePage() {
    var dataToSend = {
      shipment: this.form.get(['shipmentNumber']).value,
      shipmentNumber: this.form.get(['shipmentNumber']).value,
      shipmentType: this.form.get(['shipmentType']).value,
      awbDate: this.form.get(['shipmentdate']).value
    }
    this.navigateTo(this.router, 'billing/collectPayment/enquireCharges', dataToSend);
  }

  openShipmentInfoPage() {
    var dataToSend = {
      shipmentNumber: this.form.get(['shipmentNumber']).value,
      shipmentType: this.form.get(['shipmentType']).value
    }
    if (this.handledByHouse) {
      this.navigateTo(this.router, 'awbmgmt/hwb-informationCR', dataToSend);
    }
    else {
      this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', dataToSend);
    }
  }

  selectChargeCode(item) {
    if (item) {
      if (item.code) {
        (<NgcFormControl>this.form.get(['otherChargeInfo', 'chargeCode'])).setValue(item.code);
        (<NgcFormControl>this.form.get(['chargeCode'])).setValue(item.code);
      } else {
        (<NgcFormControl>this.form.get(['otherChargeInfo', 'chargeCode'])).setValue(null);
        (<NgcFormControl>this.form.get(['chargeCode'])).setValue(null);
      }
    } else {
      (<NgcFormControl>this.form.get(['otherChargeInfo', 'chargeCode'])).setValue(null);
      (<NgcFormControl>this.form.get(['chargeCode'])).setValue(null);
    }
  }

  onSelectDATACode(event, index, sindex) {
    (<NgcFormControl>this.form.get(['consignee', index, 'details', sindex, 'customerAppAgentId'])).setValue(event.code);
  }

  onSelectAppointedAgentCodeCne() {
    let dataLength = 0;
    this.disableButton = false;
    this.form.get(['consignee', 'appointedAgentCode']).enable();
    (<NgcFormControl>this.form.get(['consignee', 'appointedAgentCode'])).setErrors(null);
    const event = (<NgcFormControl>this.form.get(['consignee', 'appointedAgentCode'])).value;
    let checkAvailable = true;
    let checkAvailableForValid = true;
    this.form.get(['consignee', 'authorizationRemarks']).setValidators([]);
    this.retrieveLOVRecords("AWB_RELEASE_APPOINTED_AGENT_DATA", { parameter1: this.form.get(['consignee', 'customerCode']).value }).subscribe(response => {
      dataLength = response.length;
      for (const eachRow of response) {
        if (eachRow.code === event && checkAvailable) {
          checkAvailable = false;
          this.form.get(['consignee', 'authorizationRemarks']).setValidators([]);
          (<NgcFormControl>this.form.get(['consignee', 'appointedAgentCode'])).setErrors(null);
          (<NgcFormControl>this.form.get(['consignee', 'appointedAgent'])).setValue(eachRow.param3, { onlySelf: true, emitEvent: false });
          return;
        }
      }
      if (response.length > 0 && event === 'IXX') {
        (<NgcFormControl>this.form.get(['consignee', 'authorizationRemarks'])).setValidators([Validators.required]);
        this.form.get(['consignee', 'appointedAgent']).setValue(this.form.get(['directConsigneeCustomerId']).value, { onlySelf: true, emitEvent: false });
      }
    });
    if (checkAvailable && (<NgcFormControl>this.form.get(['consignee', 'appointedAgentCode'])).value !== 'IXX'
    ) {
      if (event) {
        this.retrieveLOVRecords("KEY_AWB_VALID_IMPORT_APPOINTED_AGENT", { parameter1: event }).subscribe(responseData => {
          checkAvailableForValid = false;
          (<NgcFormControl>this.form.get(['consignee', 'appointedAgentCode'])).setErrors(null);
          (<NgcFormControl>this.form.get(['consignee', 'appointedAgent'])).setValue(responseData[0].param3, { onlySelf: true, emitEvent: false });
          return;
        });
      } else {
        (<NgcFormControl>this.form.get(['consignee', 'authorizationRemarks'])).setValidators([]);
      }
      if (checkAvailableForValid) {
        this.showFormControlErrorMessage(<NgcFormControl>this.form.get(['consignee', 'appointedAgentCode']), 'invalid');
        (<NgcFormControl>this.form.get(['consignee', 'appointedAgent'])).setValue(null, { onlySelf: true, emitEvent: false });
        if (event) {
          (<NgcFormControl>this.form.get(['consignee', 'authorizationRemarks'])).setValidators([Validators.required]);
        } else {
          (<NgcFormControl>this.form.get(['consignee', 'authorizationRemarks'])).setValidators([]);
        }
        return;
      }
    } else {
      (<NgcFormControl>this.form.get(['consignee', 'authorizationRemarks'])).setValidators([]);
      this.form.get(['consignee', 'appointedAgent']).setValue(this.form.get(['directConsigneeCustomerId']).value, { onlySelf: true, emitEvent: false });
    }
  }

  onSelectAppointedAgentCodeShp(event) {
    let email = new emailInfo();
    email.customerCode = event;
    this.awbDocumentService.getEmailInfo(email).subscribe(data => {
      if (data.data) {
        this.form.get('shipper.contactEmail').patchValue(this.convertEmailStringToarray(data.data.contactEmail));
      } else {
        return;
      }
    });
    this.retrieveLOVRecords("APPOINTED_AGENT_DATA_EXPORT", { parameter1: this.parameterForShpAppointedAgent }).subscribe(response => {
      if (response) {
        if (response.length > 1) {
          (<NgcFormControl>this.form.get(['shipper', 'appointedAgentCode'])).setValue(null);
          this.showInfoStatus('info.more.than.one.appointed.agent');
          (this.appointedAgentShipper as any).showWindowButtonClick();
        } else if (response.length === 1) {
          (<NgcFormControl>this.form.get(['shipper', 'appointedAgent'])).setValue(response[0].param2);
          (<NgcFormControl>this.form.get(['shipper', 'appointedAgentCode'])).setValue(response[0].code);
        } else {
          (<NgcFormControl>this.form.get(['shipper', 'appointedAgentCode'])).setValue('EXX');
          (<NgcFormControl>this.form.get(['shipper', 'appointedAgent'])).setValue(this.form.get(['directShipperCustomerId']).value);
        }
      }
      for (const eachRow of response) {
        if (eachRow.code === event) {
          (<NgcFormControl>this.form.get(['shipper', 'appointedAgent'])).setValue(eachRow.param3);
          (<NgcFormControl>this.form.get(['shipper', 'appointedAgentCode'])).setValue(eachRow.code);
        }
      }
    });
  }

  onAwbNumberChange() {
    this.importFlag = false;
    this.exportFlag = false;
    this.showTabledata = false;
    this.transhipmentFlag = false;
  }

  onPrint() {
    this.reportParameters = new Object();
    this.reportParameters.shipmentId = this.responseArray.shipmentId;
    this.reportParameters.shipmentNumber = this.responseArray.shipmentNumber;
    this.reportParameters.shipmentDate = this.responseArray.shipmentdate;
    this.reportAWB.open();
  }

  forConsigneeRecord(event) {
    if (event.code) {
      this.patchConsigneeValue(event);
      let val = this.form.get(['consignee', 'appointedAgentCode']).value;
      if (event.dataList != null && event.dataList.length === 1) {
        if (val) {
          let email = new emailInfo();
          email.customerCode = val;
          this.awbDocumentService.getEmailInfo(email).subscribe(data => {
            if (data.data) {
              this.form.get('consignee.contactEmail').patchValue(this.convertEmailStringToarray(data.data.contactEmail));
            } else {
              return;
            }
          });
        }
      }
      this.insertContactDetails(event.param5);
      let email = new emailInfo();
      email.customerCode = event.code;
      this.awbDocumentService.getFWBConsigneeAgentInfoOnSelect(email).subscribe(response => {
        if (response.data) {
          this.form.get(['consignee', 'appointedAgent']).setValue(null, { onlySelf: true, emitEvent: false });
          if (response.data.length > 1) {
            (<NgcFormControl>this.form.get(['consignee', 'appointedAgentCode'])).setValue(null);
            this.showInfoStatus('info.more.than.one.appointed.agent');
            (this.appointedAgent as any).showWindowButtonClick();
          } else if (response.data.length === 1) {
            (<NgcFormControl>this.form.get(['consignee', 'appointedAgentCode'])).setValue(response.data[0].customerCode, { onlySelf: true, emitEvent: false });
            (<NgcFormControl>this.form.get(['consignee', 'appointedAgent'])).setValue(response.data[0].customerId, { onlySelf: true, emitEvent: false });
          } else {
            this.form.get(['consignee', 'appointedAgentCode']).setValue('IXX', { onlySelf: true, emitEvent: false });
            this.form.get(['consignee', 'appointedAgent']).setValue(this.form.get(['directConsigneeCustomerId']).value, { onlySelf: true, emitEvent: false });
          }
        }
      });
      this.consigneeMandatory();
    } else {
      this.consigneeMandatoryFlag = false;
      this.form.get(['consignee', 'customerName']).enable();
      this.form.get(['consignee', 'address', 'place']).enable();
      this.form.get(['consignee', 'address', 'postal']).enable();
      this.form.get(['consignee', 'address', 'countryCode']).enable();
      this.form.get(['consignee', 'address', 'streetAddress']).enable();
      this.form.get(['consignee', 'appointedAgent']).setValue(this.form.get(['directConsigneeCustomerId']).value, { onlySelf: true, emitEvent: false });
      this.form.get(['consignee', 'appointedAgentCode']).setValue('IXX', { onlySelf: true, emitEvent: false });
      (<NgcFormArray>this.form.get(['consignee', 'address', 'contacts'])).patchValue([]);
      this.onAddConsigneeContact();
    }
  }

  checkLocalAuthority() {
    if (<NgcFormArray>this.form.get(['localAuthority']) && (<NgcFormArray>this.form.get(['localAuthority'])).length > 0) {
      if ((<NgcFormArray>this.form.get(['localAuthority', 0, 'details'])).length == 0) {
        this.addNewLocalAuthorityDataDetails();
        if (this.form.get('origin').value != null && !NgcUtility.isTenantCityOrAirport(this.form.get('origin').value)
          && this.form.get('destination').value != null && !NgcUtility.isTenantCityOrAirport(this.form.get('destination').value)) {
          this.form.get(['localAuthority', 0, 'type']).setValue('EC');
          this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValue('TS');
          this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).clearValidators();
          this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValidators([Validators.maxLength(2)]);
          this.form.get(['localAuthority', 0, 'details', 0, 'license']).setValidators([Validators.maxLength(65)]);
          this.form.get(['localAuthority', 0, 'details', 0, 'remarks']).setValidators([Validators.maxLength(65)]);
        }
        if (this.form.get('origin').value != null && NgcUtility.isTenantCityOrAirport(this.form.get('origin').value)) {
          this.form.get(['localAuthority', 0, 'type']).setValue('PTF');
          this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).clearValidators();
          this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValue('PTF');
          this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValidators([Validators.maxLength(3)]);
        }
      } else {
        if (this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).value == null
          || this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).value == '') {
          if (this.form.get('origin').value != null && !NgcUtility.isTenantCityOrAirport(this.form.get('origin').value)
            && this.form.get('destination').value != null && !NgcUtility.isTenantCityOrAirport(this.form.get('destination').value)) {
            this.form.get(['localAuthority', 0, 'type']).setValue('EC');
            this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValue('TS');
            this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).clearValidators();
            this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValidators([Validators.maxLength(2)]);
            this.form.get(['localAuthority', 0, 'details', 0, 'license']).setValidators([Validators.maxLength(65)]);
            this.form.get(['localAuthority', 0, 'details', 0, 'remarks']).setValidators([Validators.maxLength(65)]);
          }
          if (this.form.get('origin').value != null && NgcUtility.isTenantCityOrAirport(this.form.get('origin').value)) {
            this.form.get(['localAuthority', 0, 'type']).setValue('PTF');
            this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).clearValidators();
            this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValue('PTF');
            this.form.get(['localAuthority', 0, 'details', 0, 'referenceNumber']).setValidators([Validators.maxLength(3)]);
          }
        }
      }
    } else {
      this.addNewLocalAuthority();
    }
  }

  onAppointedAgentDetails() {
    const appointedAgentRequest = (<NgcFormGroup>this.form.get(['consignee'])).getRawValue();
    appointedAgentRequest.contactEmail = null;
    this.awbDocumentService.getAllAppointedAgents(appointedAgentRequest).subscribe(response => {
      const dataToPatch: any = response.data;
      this.agentContactType = [];
      if (dataToPatch) {
        if (dataToPatch.contactType) {
          let recordCheck = dataToPatch.contactType.split(',');
          for (let eachAgent of recordCheck) {
            this.agentContactType.push({
              contactType: eachAgent,
              contactDetails: ''
            });
          }
        }
        if (dataToPatch.contactTypeDetails) {
          let recordCheck = dataToPatch.contactTypeDetails.split(',');
          for (let i = 0; i < recordCheck.length; i++) {
            this.agentContactType[i].contactDetails = recordCheck[i];
          }
        }
        this.appointedAgentForm.patchValue(dataToPatch);
        this.appointedAgentsWindow.open();
      }
    });
  }

  checkValidation(event) {
    if (event.origin === event.destination) {
      this.showErrorMessage('awb.origin.destination.not.same');
      return;
    }
  }
  /**
 * Validate Email
 */
  private validateEmail(Email) {
    let patt = new RegExp("[a-zA-Z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+(\.[a-zA-Z0-9,!#\$%&'\*\+/=\?\^_`\{\|}~-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.([a-zA-Z]{2,})");
    return patt.test(Email);
  }

  changeShipmentType() {

    if (this.responseArray.shipmentType == this.shipmentTypeValue) {
      this.showErrorMessage('awb.change.shipment.type');
      return;
    }


    if (this.shipmentTypeValue == 'AWB') {
      if (!this.form.valid) {
        this.showErrorMessage('awb.save.awbdoc')
        return;
      }
    }


    const saveRequest = this.form.getRawValue();
    saveRequest.shipmentType = this.shipmentTypeValue;
    saveRequest.oldPieces = this.oldPieces;
    saveRequest.oldWeight = this.oldWeight

    this.showConfirmMessage('awb.change.shipment.type.warn').then(reason => {
      this.awbDocumentService.changeShipmentType(saveRequest).subscribe(response => {
        this.refreshFormMessages(response);
        const resp = response.data;
        if (resp) {
          this.showSuccessStatus('g.completed.successfully');
          this.onSearch();
        } else {
          this.showErrorStatus(response.messageList[0].code);
        }
      }, error => {
        this.showErrorMessage(error);
      });
    });
  }


  changeShipmentTypeCouTOCom() {

    if (this.shipmentTypeValue != 'AWB') {
      this.showErrorMessage('awb.change.shipment.type.awb');
      return;
    }
    if (this.shipmentTypeValue == 'AWB') {
      if (!this.form.valid) {
        this.showErrorMessage('awb.save.awbdoc');
        return;
      }
    }

    this.form.get('couToCommercial').patchValue(true);
    if (!this.form.get('couToCommercialDate').value) {
      this.showErrorMessage('enter.cou.comm.date');
      return;
    }
    const saveRequest = this.form.getRawValue();
    saveRequest.shipmentType = this.shipmentTypeValue;
    saveRequest.oldPieces = this.oldPieces;
    saveRequest.oldWeight = this.oldWeight;
    saveRequest.shipmentTypeConvertFrom = this.oldshipmentTypeFlag;
    saveRequest.couToCommercial = this.form.get('couToCommercial').value;


    this.showConfirmMessage('awb.change.shipment.type.warn').then(reason => {
      this.awbDocumentService.changeShipmentType(saveRequest).subscribe(response => {
        this.refreshFormMessages(response);
        const resp = response.data;
        if (resp) {
          this.showSuccessStatus('g.completed.successfully');
          //this.searchForm.get('shipmentType').patchValue('AWB');
          this.onSearch();

        } else {
          this.showErrorStatus(response.messageList[0].code);
        }
      }, error => {
        this.showErrorMessage(error);
      });
    });
  }




  changeAwbHwbHandling() {
    this.showConfirmMessage('confirm.unsaved.data').then(fulfilled => {
      this.responseArray.handledByHouse = this.responseArray.handledByMasterHouse;
      this.responseArray.shipmentUpdateEventFireFlag = true;
      //   if (this.awbInventoryFlag || this.awbIrregularityFlag) {
      //   this.showErrorMessage('hawb.cannot.change.handling.type');
      //}
      //else
      if (this.responseArray.handledByHouse === 'H') {
        this.showConfirmMessage("awb.confirm.1").then(fulfilled => {
          this.awbDocumentService.changeHandlingMasterOrHouse(this.responseArray).subscribe(data => {
            if (!this.showResponseErrorMessages(data)) {
              this.onSearch();
            }
          }, error => {
            this.showErrorStatus(error);
          });

        })
      } else {
        this.showConfirmMessage("awb.confirm.2").then(fulfilled => {
          this.awbDocumentService.changeHandlingMasterOrHouse(this.responseArray).subscribe(data => {
            if (!this.showResponseErrorMessages(data)) {
              this.onSearch();
            }
          }, error => {
            this.showErrorStatus(error);
          });
        })
      }
    })
  }

  onClear() {
    this.showConfirmMessage('clear.message').then(fulfilled => {
      this.reloadPage();
      this.form.reset();
      this.searchForm.reset();
      this.appointedAgentForm.reset();

    });
  }
  public addRow() {
    (<NgcFormArray>this.form.controls[
      'shipmentMasterFlightTonnageInfo'
    ]).addValue([
      {
        deleted: false,
        shipmentNumber: this.form.get('shipmentNumber').value,
        shipmentdate: this.form.get('shipmentdate').value,
        flightKey: '',
        flightDate: '',
        loosePieces: 0,
        looseWeight: 0.0,
        prepackPieces: 0,
        prepackWeight: 0.0
      }
    ]);

  }
  onFlightdetailsChange(index) {

    var data = (<NgcFormArray>this.form.get(['shipmentMasterFlightTonnageInfo', index])).value;
    let reqdata = {
      flightKey: data.flightKey,
      flightDate: data.flightDate,
      flightType: '',
      tenantId: NgcUtility.getTenantConfiguration().airportCode
    };
    // if (reqdata.flightKey != "" && reqdata.flightDate != "") {
    //   this.awbDocumentService.checkValidFlightNotCancelled(reqdata).subscribe((res: any) => {
    //     if (!this.showResponseErrorMessages(res)) {
    //       if (!res.data) {
    //         (this.form.get(['shipmentMasterFlightTonnageInfo', index, 'flightKey'])).setValue("");
    //         (this.form.get(['shipmentMasterFlightTonnageInfo', index, 'flightDate'])).setValue("");
    //         this.showErrorMessage("flight.invalid.flight");


    //       }
    //     }

    //   });
    // }
  }
  saveshipmentPiecesWeight() {
    let finalDateList: any[] = [];

    let totalLoosePieces: number = 0;
    let totalPrepackWeight: number = 0.0;
    let totalLooseWeight: number = 0.0;
    let totalPrepackPieces: number = 0;
    let dateList: any[] = this.form.get("shipmentMasterFlightTonnageInfo").value;
    let error: boolean = false;
    dateList.forEach(obj => {
      if (obj.flightKey == "" || obj.flightDate == "") {
        this.showErrorMessage("Please enter Flight key/ date")
      } else {
        if (!obj.deleted) {
          totalLoosePieces += obj.loosePieces;
          totalLooseWeight += obj.looseWeight;
          totalPrepackPieces += obj.prepackPieces;
          totalPrepackWeight += obj.prepackWeight;
        } else {
          totalLoosePieces -= obj.loosePieces;
          totalLooseWeight -= obj.looseWeight;
          totalPrepackPieces -= obj.prepackPieces;
          totalPrepackWeight -= obj.prepackWeight;
        }

        finalDateList.push(obj);
      }




    })
    this.form.get("totalLoosePieces").setValue(totalLoosePieces < 0 ? 0 : totalLoosePieces);
    this.form.get("totalLooseWeight").setValue(totalLooseWeight < 0 ? 0 : totalLooseWeight);
    this.form.get("totalPrepackPieces").setValue(totalPrepackPieces < 0 ? 0 : totalPrepackPieces);
    this.form.get("totalPrepackWeight").setValue(totalPrepackWeight < 0 ? 0 : totalPrepackWeight);

    if (totalLoosePieces > Number(this.form.get('awbloosePieces').value)) {
      this.showErrorMessage("awb.loosepieces.more");
      error = true;
    }
    if (totalPrepackPieces > Number(this.form.get('awbprepackPieces').value)) {
      this.showErrorMessage("awb.prepackpieces.more");
      error = true;
    }
    if (totalLooseWeight > Number(this.form.get('awblooseWeight').value)) {
      this.showErrorMessage("awb.looseweight.more");
      error = true;
    }
    if (totalPrepackWeight > Number(this.form.get('awbprepackWeight').value)) {
      this.showErrorMessage("awb.prepackweight.more");
      error = true;
    }
    if (!error) {
      this.form.get("shipmentMasterFlightTonnageInfo").patchValue(finalDateList);
    }
    return error;
  }
  deleteRow(index) {
    let reqObj = this.form.get("shipmentMasterFlightTonnageInfo").value[index];
    if (reqObj.ShipmentMasterFlightTonnageInfoId == "") {
      let dateList: any[] = this.form.get("shipmentMasterFlightTonnageInfo").value;
      dateList.splice(index, 1);
      this.form.get("shipmentMasterFlightTonnageInfo").patchValue(dateList);
    } else {
      (this.form.get(['shipmentMasterFlightTonnageInfo', index, 'deleted'])).setValue(true);
      (<NgcFormArray>this.form.get('shipmentMasterFlightTonnageInfo')).markAsDeletedAt(index)

    }
  }
  onHoldChange() {
    if (this.form.get('hold') == null || !this.form.get('hold').value) {
      this.form.get('holdReason').setValue(null);
      this.form.get('holdRemarks').setValue(null);
      this.form.get('holdUserGroupToNotify').setValue(null);
    }
  }
  bankcheck() {
    if (!this.form.get("otherChargeInfo.collectBankEndorsementClearanceLetter").value) {
      this.form.get("otherChargeInfo.bankName").setValue(null);
    }
  }
}

