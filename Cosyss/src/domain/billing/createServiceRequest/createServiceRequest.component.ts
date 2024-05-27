import { AwbManagementService } from './../../awbManagement/awbManagement.service';
import {
  NgcFormGroup, NgcFormArray, NgcApplication, NgcDropDownComponent, NgcButtonComponent,
  NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest, BaseResponse, PageConfiguration, UserProfile,
  NgcUtility, DateTimeKey, NgcFileUploadComponent
} from "ngc-framework";



import {
  Component, NgZone, ElementRef, OnInit,
  OnDestroy, ViewContainerRef, ViewChild
} from "@angular/core";

import { NgcFormControl } from "ngc-framework";
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { BillingService } from '../billing.service';
import { CreateServiceRequest } from '../billing.sharedmodel';
import { ApplicationEntities } from "../../common/applicationentities";
import { isNull } from 'util';
import { ApplicationFeatures } from '../../common/applicationfeatures';


@Component({
  selector: 'app-createServiceRequest',
  templateUrl: './createServiceRequest.component.html',
  styleUrls: ['./createServiceRequest.component.scss']
})

@PageConfiguration({
  //functionId: "BILLING_SERVICE_REQUEST",
  trackInit: true,
  callNgOnInitOnClear: true
})
export class CreateServiceRequestComponent extends NgcPage {
  hawbInvalid: boolean = false;
  handledbyHouse: any = [];
  displayHouseDetail: boolean = false;
  private isAWB: boolean = true;
  private isULD: boolean = false;
  private isTruck: boolean = false;
  private isGenric: boolean = false;
  private durationBased: boolean = false;
  private quantityBased: boolean = false;
  private optionBased: boolean = false;
  private customerId: any;
  private serviceMasterId: any;
  rep: any;
  response: any;
  enableCreate: any = false;
  enableCustomer: any = false;
  enableService: any = false;
  private customerIdForDrop: any;
  private status: any;
  hideData: any;
  hideDuration: any = false;
  showQuantity: any = false;
  hideOption: any = false;
  hideButton: any = false;
  clickCreate: boolean = false;
  createRes: any;
  navigateData: any;
  arrString: any;
  userInfo: UserProfile;
  userId: any;
  loggedCustomerName: any;
  loggedInCustomerId: any;
  sName: any;
  cName: any;
  sCode: any;
  serviceCategory: any;
  totalCharges: any = 0.00;
  estimateCharge: any = 0.00
  @ViewChild("fileUpload")
  private fileUpload: NgcFileUploadComponent;

  public createServiceRequestForm: NgcFormGroup = new NgcFormGroup({

    serviceCode: new NgcFormControl(),
    associatedTo: new NgcFormControl(),
    customerId: new NgcFormControl(),
    requestedOn: new NgcFormControl(new Date(),
      Validators.required),
    requestedBy: new NgcFormControl('', [Validators.maxLength(64)]),
    quantityOf: new NgcFormControl(),

    uom: new NgcFormControl(),
    durationOf: new NgcFormControl(),
    optionName: new NgcFormControl(),
    optionValue: new NgcFormControl(),
    durationUom: new NgcFormControl(),
    duration: new NgcFormControl(),
    status: new NgcFormControl(),
    requestedQuantity: new NgcFormControl(''),
    requestorContactNumber: new NgcFormControl(),
    alreadyCompleted: new NgcFormControl(false),
    durationBased: new NgcFormControl(false),
    serviceName: new NgcFormControl(),
    customerName: new NgcFormControl(),

    remarks: new NgcFormControl('', [Validators.maxLength(65)]),
    documentReferenceId: new NgcFormControl(Math.random() * 100000000000000),
    handlingArea: new NgcFormControl(),
    serviceCategory: new NgcFormControl(),
    notificationEmailId1: new NgcFormControl(),
    notificationEmailId2: new NgcFormControl(),
    notificationEmailId3: new NgcFormControl(),
    mailAddressList: new NgcFormControl(),
    totalCharges: new NgcFormControl(),
    estimatedChargesForGeneric: new NgcFormControl(),
    terms: new NgcFormControl(),
    defaultQuantity: new NgcFormControl(),
    quantityModifiable: new NgcFormControl(),

    serviceRequestShipmentInfo: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(false),
        shipmentNumber: new NgcFormControl(),
        hawbNumber: new NgcFormControl('', [Validators.maxLength(30)]),
        flightId: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        tripStartDate: new NgcFormControl(),
        tripEndDate: new NgcFormControl(),
        truckTripId: new NgcFormControl(),
        containerNumber: new NgcFormControl(),
        additionalRemarks: new NgcFormControl('', [Validators.maxLength(65)]),
        requestedQuantity: new NgcFormControl(''),
        duration: new NgcFormControl(''),
        estimatedCharges: new NgcFormControl(),
        uom: new NgcFormControl(),
        durationUom: new NgcFormControl(),
        taxAmount: new NgcFormControl(),
        taxCompCode: new NgcFormControl(),
        taxComp1Code: new NgcFormControl(),
        taxComp2Code: new NgcFormControl(),
        taxComp3Code: new NgcFormControl(),
        shipmentHouseId: new NgcFormControl(),
        amount: new NgcFormControl(),
        grossAmount: new NgcFormControl(),
        taxComp1: new NgcFormControl(),
        taxComp2: new NgcFormControl(),
        taxComp3: new NgcFormControl(),
        truckNumber: new NgcFormControl()
      })
    ]),



  });
  randomValue: number;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private billingService: BillingService, private router: Router,
    private activatedRoute: ActivatedRoute, private awbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }
  ngOnInit() {
    NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_AirlineBilling) ? this.createServiceRequestForm.get('serviceCategory').patchValue('Agent') : this.createServiceRequestForm.get('serviceCategory').patchValue(null);
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_AirlineBilling)) {
      this.createServiceRequestForm.get('serviceCategory').setValidators(Validators.required);
    }
    else {
      this.createServiceRequestForm.get('serviceCategory').setValidators([]);
    }
    this.userInfo = this.getUserProfile();
    this.randomValue = Math.random();

    this.navigateData = this.getNavigateData(this.activatedRoute);
    this.createServiceRequestForm.controls.serviceCode.disable();
    this.createServiceRequestForm.controls.handlingArea.disable();
    if (this.navigateData && this.navigateData.customerId) {
      this.createServiceRequestForm.get('customerId').patchValue(this.navigateData.customerId);
      this.createServiceRequestForm.get('alreadyCompleted').patchValue(true);
      this.createServiceRequestForm.controls.serviceCode.enable();
      //this.createServiceRequestForm.controls.handlingArea.enable();
      // this.completedService = true;
    }
    this.enableCreate = true;
    this.hideData = false;
    this.hideButton = false;
    this.createServiceRequestForm.get('customerId').valueChanges.subscribe(newValue => {
      if (newValue) {
        this.createServiceRequestForm.controls.serviceCode.enable();

      } else {
        this.createServiceRequestForm.controls.serviceCode.disable();
        this.createServiceRequestForm.controls.handlingArea.disable();
      }
    });
    this.createServiceRequestForm.controls.serviceCode.valueChanges.subscribe(
      (newValue) => {
        if (newValue) {
          this.enableCreate = false;
          this.createServiceRequestForm.controls.handlingArea.enable();
          this.createServiceRequestForm.get('handlingArea').patchValue(this.getUserProfile().terminalId);
        } else {
          this.enableCreate = true;
        }
      }
    );


  }



  /**
  *
  *called when custumer code selected
  * @param {any} event
  * @memberof 
  */
  onClickCustomer(event) {
    this.customerIdForDrop = event.param1;
    this.customerId = event.param1;
    this.cName = event.desc;
  }
  onClickCategory(event) {
    this.serviceCategory = this.createSourceParameter(event.code);
    this.createServiceRequestForm.get('customerId').patchValue(null);
    this.createServiceRequestForm.get('serviceCode').patchValue(null);
  }
  /**
   *
   *called when custumer code selected
   * @param {any} event
   * @memberof 
   */
  onClickService(event) {
    this.serviceMasterId = this.createSourceParameter(
      this.customerIdForDrop,
      event.param1
    );
    this.sName = event.desc;

  }

  /**
  *
  *called when clear button is triggered
  * @param {any} event
  * @memberof 
  */
  onClear(event): void {
    this.createServiceRequestForm.reset();
    this.resetFormMessages();
  }

  /**
   * called when shipment no field tab out
   * @param event 
   */
  getFlightDetails(event, index) {
    let search: CreateServiceRequest = this.createServiceRequestForm.getRawValue();
    search.shipmentNumber = event;
    this.billingService.getFlightDetails(search).subscribe(response => {
      this.checkHawb(event, index);
      if (!this.showResponseErrorMessages(response) && response && response.data) {
        if (response.data.flightKey != null && response.data.flightDate != null) {
          this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('flightKey').patchValue(response.data.flightKey);
          this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('flightDate').patchValue(response.data.flightDate);
        }
        else {
          this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('flightKey').patchValue("");
          this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('flightDate').patchValue("");
        }
      }
    }, error => {
      this.checkHawb(event, index);
      this.showErrorMessage(error);
    });

    for (let i = 0; i < search.serviceRequestShipmentInfo.length; i++) {
      if (search.serviceRequestShipmentInfo[i].duration != null || search.serviceRequestShipmentInfo[i].requestedQuantity != null) {
        this.chargeEstimation(event, i);
      }

    }
    this.onTabOutEntity(index);

  }

  createEvent(event) {


    this.resetFormMessages();
    this.clickCreate = true;

    this.navigateData = this.getNavigateData(this.activatedRoute);
    let search: CreateServiceRequest = this.createServiceRequestForm.getRawValue();
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_AirlineBilling) && !search.serviceCategory) {
      this.showErrorStatus('billing.service.category');
      return;
    }
    this.billingService.checkServiceType(search).subscribe(response => {
      this.createRes = response.data;
      if (response.data) {
        this.sName = this.createRes.serviceName;
        this.sCode = this.createRes.associatedTo;
        this.enableCreate = true;
        this.enableCustomer = true;
        this.enableService = true;
        if (this.navigateData && this.navigateData.shipmentNumber && this.sCode == "AWB") {
          this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[0].get('shipmentNumber').patchValue(this.navigateData.shipmentNumber);
          if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
            this.getFlightDetails(this.navigateData.shipmentNumber, 0);
          }
          if (this.navigateData.shipmentNumber != null) {
            search.shipmentNumber = this.navigateData.shipmentNumber;
          }
          this.billingService.getFlightDetails(search).subscribe(response => {
            if (response.data.flightKey != null && response.data.flightDate != null) {
              this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[0].get('flightKey').patchValue(response.data.flightKey);
              this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[0].get('flightDate').patchValue(response.data.flightDate);
            }
            else {
              this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[0].get('flightKey').patchValue("");
              this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[0].get('flightDate').patchValue("");
            }

          });


        }
        if ((response.data as any).durationBased) {
          this.durationBased = true;
          this.hideDuration = true;
          // this.createServiceRequestForm.get(['duration']).setValidators(Validators.required);
        } else {
          this.durationBased = false;
          this.hideDuration = false;
        }
        if ((response.data as any).quantityBased) {
          this.quantityBased = true;
          this.showQuantity = true;
        } else {
          this.quantityBased = false;
          this.showQuantity = false;
        }



        this.hideData = true;
        this.createServiceRequestForm.get('quantityOf').setValue(this.createRes.quantityOf);
        this.createServiceRequestForm.get('uom').setValue(this.createRes.uom);
        this.createServiceRequestForm.get('durationOf').setValue(this.createRes.durationOf);
        this.createServiceRequestForm.get('durationUom').setValue(this.createRes.durationUom);
        this.createServiceRequestForm.get('optionName').setValue(this.createRes.optionName);
        this.createServiceRequestForm.get('terms').setValue(this.createRes.terms);
        this.createServiceRequestForm.get('defaultQuantity').setValue(this.createRes.defaultQuantity);
        this.createServiceRequestForm.get('quantityModifiable').setValue(this.createRes.quantityModifiable);
        this.createServiceRequestForm.get(['serviceRequestShipmentInfo', 0, 'durationUom']).patchValue(this.createRes.durationUom);
        this.createServiceRequestForm.get(['serviceRequestShipmentInfo', 0, 'uom']).patchValue(this.createRes.uom);
        this.createServiceRequestForm.get(['serviceRequestShipmentInfo', 0, 'requestedQuantity']).patchValue(this.createRes.defaultQuantity);
        if (this.createRes.optionValue)
          this.arrString = this.createRes.optionValue.split(',');
        if ((response.data as any).associatedTo === 'AWB') {
          this.isAWB = true;
          this.isGenric = false;
          this.hideButton = false;
          this.isULD = false;
          this.isTruck = false;
        } else if ((response.data as any).associatedTo === 'GENERIC') {
          this.isAWB = false;
          this.isGenric = true;
          this.hideButton = true;
          this.isULD = false;
          this.isTruck = false;
        } else if ((response.data as any).associatedTo === 'ULD') {
          this.isAWB = false;
          this.isGenric = false;
          this.hideButton = false;
          this.isULD = true;
          this.isTruck = false;
          this.createServiceRequestForm.get('containerNumber').setValidators(Validators.required);
        } else if ((response.data as any).associatedTo === 'TRUCK') {
          this.isAWB = false;
          this.isGenric = false;
          this.hideButton = false;
          this.isULD = false;
          this.isTruck = true;
        }

        if ((response.data as any).optionBased) {
          this.hideOption = true;
        } else {
          this.hideOption = false;
        }
      } else {
        this.refreshFormMessages(response);
      }


    });
  }
  /**
    *  removes selected rows
    */
  onLocationLinkClick(event, index: any): void {
    (<NgcFormArray>this.createServiceRequestForm.controls['serviceRequestShipmentInfo']).deleteValueAt(index);
    this.totalCharges = this.calculateTotalSum();
    this.createServiceRequestForm.get('totalCharges').setValue(this.totalCharges);
  }

  /**
    * Add a row for more records for mail
    */
  onAddRowEmailNotification() {
    let len = (<NgcFormArray>this.createServiceRequestForm.get(["createServiceRequest"])).length;
    if (len < 3) {
      (<NgcFormArray>this.createServiceRequestForm.get(["createServiceRequest"])).addValue([
        {
          email: "",

        }
      ]);
    }
  }

  /**
    * Add a row for more records
    */
  onAddRowShipmentInfo() {
    // this.resetFormMessages();
    let len = (<NgcFormArray>this.createServiceRequestForm.get(["serviceRequestShipmentInfo"])).length;
    if (len < 10) {
      (<NgcFormArray>this.createServiceRequestForm.get(["serviceRequestShipmentInfo"])).addValue([
        {
          select: false,
          shipmentNumber: "",
          flightId: "",
          flightKey: null,
          flightDate: null,
          containerNumber: null,
          additionalRemarks: "",
          requestedQuantity: NgcUtility.isBlank(this.createServiceRequestForm.get('defaultQuantity').value) ? null : this.createServiceRequestForm.get('defaultQuantity').value,
          duration: '',
          estimatedCharges: null,
          hawbNumber: null,
          uom: this.createServiceRequestForm.get('uom').value,
          durationUom: this.createServiceRequestForm.get('durationUom').value,
          amount: null,
          grossAmount: null,
          taxCompCode: null,
          taxAmount: null,
          taxComp1Code: null,
          taxComp2Code: null,
          taxComp3Code: null,
          shipmentHouseId: null,
          taxComp1: null,
          taxComp2: null,
          taxComp3: null,
          truckNumber: null
        }
      ]);
    }
  }

  /**
  * back To previous page
  * @param {any} $event
  * @memberof 
  */
  onCancel($event) {
    this.resetFormMessages();
    this.isAWB = false;
    this.isGenric = false;
    this.hideData = false;
    this.isULD = false;
    this.isTruck = false;
    this.navigateBack({});
  }

  /**
   * Called when data has to be  inserted
   * 
   */
  public onSave() {
    this.status = 'Pending';
    this.onSaveOrSubmit(this.status);
  }

  /**
     * Called when data has to be  inserted depending on status
     * 
     */
  onSaveOrSubmit(status) {
    this.createServiceRequestForm.validate();



    if (this.createServiceRequestForm.valid) {
      let save: CreateServiceRequest = this.createServiceRequestForm.getRawValue();

      save['status'] = this.status;
      save['serviceName'] = this.sName;
      save['customerName'] = this.cName;
      save.mailAddressList = new Array();
      save.mailAddressList.push(this.createServiceRequestForm.get('notificationEmailId1').value);
      save.mailAddressList.push(this.createServiceRequestForm.get('notificationEmailId2').value);
      save.mailAddressList.push(this.createServiceRequestForm.get('notificationEmailId3').value);
      // save['mailAddressList'] = [this.createServiceRequestForm.get('notificationEmailId1').value, {}, {}];
      let x = new Array();
      if (this.durationBased) {
        save['durationBased'] = true;
      } else {
        save['durationBased'] = false;
      }
      if (this.quantityBased) {
        save['quantityBased'] = true;
      } else {
        save['quantityBased'] = false;
      }
      if (this.isAWB) {
        save['associatedTo'] = 'AWB';

        x = save.serviceRequestShipmentInfo.filter(a => a.shipmentNumber || a.flightId ||
          a.containerNumber || a.requestedQuantity || a.duration ||
          a.additionalRemarks);
        save.serviceRequestShipmentInfo = x;
      } else if (this.isGenric) {
        save['associatedTo'] = 'generic';
      } else if (this.isULD) {
        save['associatedTo'] = 'ULD';
      } else if (this.isTruck) {
        save['associatedTo'] = 'TRUCK';
      }
      // this.resetFormMessages();
      if (!x.length && this.isAWB) {
        this.showErrorStatus('billing.error.shipment');
      } else {
        this.fileUpload.upload();
        let serviceRequests: any = []
        this.billingService.saveServiceRequest(save).subscribe(response => {
          if (response.data && response.data.length) {
            response.data.forEach(serviceRequest => {
              serviceRequests.push(serviceRequest.serviceRequestNo);
            });
            response.data = response.data[0];
          }
          if (!this.showResponseErrorMessages(response)) {
            this.resetFormMessages();
            this.showMessage(NgcUtility.translateMessage("billing.info.service.placeholder", [serviceRequests.join(', ')]));
            this.showSuccessStatus("billing.sucess.service");
            this.reloadPage();
            this.isAWB = false;
            this.isGenric = false;
            this.hideData = false;
            this.isULD = false;
            this.isTruck = false;
          }
        });
      }
    }
  }

  public getReferenceId(): string {

    return String(Math.trunc(this.createServiceRequestForm.get('documentReferenceId').value));
    // return String((this.createServiceRequestForm.get('documentReferenceId').value).replace('.', ''));
  }

  chargeEstimation(event, index) {
    let innerArray = [];
    let formValues: CreateServiceRequest = this.createServiceRequestForm.getRawValue();
    innerArray.push(formValues.serviceRequestShipmentInfo[index]);
    formValues.serviceRequestShipmentInfo = innerArray;
    formValues['index'] = index;

    if (this.isAWB) {
      formValues['associatedTo'] = 'AWB';
    } else if (this.isGenric) {
      formValues['associatedTo'] = 'generic';
    } else if (this.isULD) {
      formValues['associatedTo'] = 'ULD';
    } else if (this.isTruck) {
      formValues['associatedTo'] = 'TRUCK';
    }

    if (this.durationBased) {
      formValues['durationBased'] = true;
    } else {
      formValues['durationBased'] = false;
    }
    if (this.quantityBased) {
      formValues['quantityBased'] = true;
    } else {
      formValues['quantityBased'] = false;
    }
    this.billingService.getChargeEstimation(formValues).subscribe((response: any) => {
      if (!this.showResponseErrorMessages(response)) {
        if (response.data.associatedTo == 'generic') {
          this.createServiceRequestForm.get('estimatedChargesForGeneric').setValue(response.data.estimatedCharges);
        } else {
          if (response.data.estimatedCharges != null) {
            this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('estimatedCharges').setValue(response.data.estimatedCharges);
          } else {
            this.showErrorMessage('billing.error.service.attached');

          }
          this.totalCharges = this.calculateTotalSum();
          this.createServiceRequestForm.get('totalCharges').setValue(this.totalCharges);
          if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_SalesTax)) {
            // response.data.taxCompCode = '' + (!isNull(response.data.taxComp1Code) ? response.data.taxComp1Code : '') + (!isNull(response.data.taxComp2Code) ? ' +' + response.data.taxComp2Code : '') + (!isNull(response.data.taxComp3Code) ? ' +' + response.data.taxComp3Code : '');
            this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('taxAmount').setValue(response.data.taxAmount);
            // this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('taxCompCode').setValue(response.data.taxCompCode);
            this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('taxComp1Code').setValue(response.data.taxComp1Code);
            this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('taxComp2Code').setValue(response.data.taxComp2Code);
            this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('taxComp3Code').setValue(response.data.taxComp3Code);
            this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('taxComp1').setValue(response.data.taxComp1);
            this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('taxComp2').setValue(response.data.taxComp2);
            this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('taxComp3').setValue(response.data.taxComp3);
            this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('amount').setValue(response.data.amount);
            this.createServiceRequestForm.getList('serviceRequestShipmentInfo')[index].get('grossAmount').setValue(response.data.netAmount);
          }
        }

      }

    }, error => {
      this.showErrorMessage(error);
    });

  }
  /**
   * call chargeestimate api based on dropdown change
   * @param event 
   */

  setChargesByOptionValue(event) {
    let formValues: CreateServiceRequest = this.createServiceRequestForm.getRawValue();
    if (this.isAWB) {
      for (let i = 0; i < formValues.serviceRequestShipmentInfo.length; i++) {
        if (formValues.serviceRequestShipmentInfo[i].shipmentNumber != null && formValues.serviceRequestShipmentInfo[i].duration != null && formValues.serviceRequestShipmentInfo[i].requestedQuantity != null) {
          this.chargeEstimation(event, i);
        }

      }
    }
  }


  /**
   * calculateTotalSum
   */
  calculateTotalSum() {
    var innerArray = [];
    let totalestimatecharges = 0;
    let formValues: CreateServiceRequest = this.createServiceRequestForm.getRawValue();
    innerArray.push(formValues.serviceRequestShipmentInfo);
    for (let i = 0; i < innerArray.length; i++) {
      for (let j = 0; j < innerArray[i].length; j++) {
        totalestimatecharges = totalestimatecharges + innerArray[i][j].estimatedCharges;
      }

    }

    return totalestimatecharges;
  }



  backtoCargoAcceptance(event) {
    // navigating to Cargo Acceptance 
    let awbNumber = null;
    if (this.navigateData && this.navigateData.shipmentNumber) {
      awbNumber = this.navigateData.shipmentNumber;
    }
    this.navigateTo(this.router, 'export/acceptance/managecargoacceptance', awbNumber);
  }

  acceptanceWeighing() {
    // navigating to Cargo Acceptance 
    let formValues: CreateServiceRequest = this.createServiceRequestForm.getRawValue();
    let awbNumberValue = null;
    let count = 0;
    for (let i = 0; i < formValues.serviceRequestShipmentInfo.length; i++) {
      if (formValues.serviceRequestShipmentInfo[i].select) {
        awbNumberValue = formValues.serviceRequestShipmentInfo[i].shipmentNumber;
        count++;
      }
    }
    const awbNumber = this.navigateData && this.navigateData.shipmentNumber ? this.navigateData.shipmentNumber : awbNumberValue;
    if (count > 1) {
      this.showErrorMessage('export.select.only.one.record')
      return;
    }
    this.navigateTo(this.router, 'export/acceptance/manageacceptanceweighingrevised', awbNumber);
  }

  setAWBNumber(object, index) {
    if (object.code == null) {
      this.hawbInvalid = true;
      this.showErrorStatus('hawb.invalid');
    }
    else {
      this.hawbInvalid = false;
      this.resetFormMessages();
      this.createServiceRequestForm.get(['serviceRequestShipmentInfo', index, 'shipmentHouseId']).setValue(object.param2);
      this.createServiceRequestForm.get(['serviceRequestShipmentInfo', index, 'hawbNumber']).setValue(object.code);
      this.onTabOutEntity(index);
    }
  }
  checkHawb(event, index) {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      let search = {
        shipmentNumber: this.createServiceRequestForm.get(['serviceRequestShipmentInfo', index, 'shipmentNumber']).value,
        shipment: this.createServiceRequestForm.get(['serviceRequestShipmentInfo', index, 'shipmentNumber']).value,
        shipmentType: 'AWB',
        appFeatures: null,
      }
      this.billingService.checkHandledByOrAccpByHouse(search).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          if (data) {
            this.displayHouseDetail = true;
            this.handledbyHouse[index] = true;
          } else {
            this.handledbyHouse[index] = false;
          }
        }
      })
    }
  }
  setTruckTrip(event, index) {
    this.createServiceRequestForm.get(['serviceRequestShipmentInfo', index, 'tripStartDate']).setValue(event.param1);
    this.createServiceRequestForm.get(['serviceRequestShipmentInfo', index, 'tripEndDate']).setValue(event.param2);
    this.createServiceRequestForm.get(['serviceRequestShipmentInfo', index, 'truckTripId']).setValue(event.param3);

    // console.log(event);

  }

  onTabOutEntity(index) {
    if (!this.durationBased && !NgcUtility.isBlank(this.createRes.defaultQuantity) && !this.createRes.quantityModifiable) {
      this.chargeEstimation(null, index);
    }
  }
}
