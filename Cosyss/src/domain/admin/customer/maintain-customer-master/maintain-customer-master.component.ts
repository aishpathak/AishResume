
import { date } from './../../../awbManagement/awbManagement.shared';
// import { index } from 'chalk';
import { AppointedAgent, CustomerCode, ChangeOfCode, ApplicationRoleCode, SearchLucDetails } from './../../admin.sharedmodel';
import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, ContentChildren, forwardRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroupDirective, FormArray, FormGroup, FormControl, FormControlName, Validators, NgControl
} from '@angular/forms';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, BaseResponse, NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcTabsComponent,
  PageConfiguration,
  NgcInputComponent,
  NgcReportComponent
} from 'ngc-framework';
import { SearchCustomerMaster } from '../../admin.sharedmodel';
import { AdminService } from '../../admin.service';
import { Environment } from '../../../../environments/environment';
import { OnInit, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from "rxjs";
import { ApplicationEntities } from '../../../common/applicationentities';
import { ApplicationFeatures } from '../../../common/applicationfeatures';

@Component({
  selector: 'app-maintain-customer-master',
  templateUrl: './maintain-customer-master.component.html',
  styleUrls: ['./maintain-customer-master.component.scss']
})
@PageConfiguration({
  trackInit: true,
  focusToMandatory: true,
  noAutoFocus: true
})
export class MaintainCustomerMasterComponent extends NgcPage {
  adminFlag: boolean;
  searchForChargeCodeCustomerId: any;
  searchForChargeCode: any;
  stateByCountry: any;

  searchRequestChangeOfCode: {
    customerCod: any;
  };
  customerCodeSave: any;
  private allowSearch: boolean = false;
  count: 0;
  softDeleteCount: 0;
  searchFlag = false;
  customerCodeDisplay: any;
  displaySearchFlag = true;
  diplayAfterSearch = false;
  flagOldCustomer = false;
  customerIdData: any;
  dataAppointedAgent: any[];
  contactFlagTE = false;
  contactFlagFX = false;
  showFlag = false;
  showFlag1 = false;
  customerListByAppointedAgent: any;
  customerListByAppointedAgentData: any;
  notificationFlagDelete: any;
  disablePDFFlag: boolean;
  responseDataForSearch: any;
  deregisterFlag: boolean;
  deregisterSaveFlag: boolean;
  pimaFlagCRUD: any;
  notificationFlagCRUD: any;
  appointedFlagCRUD: any;
  contactFlagCRUD: any;
  customerIddata: any;
  billingPostalCodeValue: any;
  billingPlaceValue: any;
  billingStateCodeValue: any;
  billingCityCodeValue: any;
  billingCountryCodeValue: any;
  billingaddressValue: any;
  requestData: any;
  disableFlag: boolean;
  resp: any;
  errors: any;
  buttonFlag: boolean;
  isCustomerTypeAirline: boolean;
  customerTypeValue: string;
  saveRequest: any = [];
  saveAliasDetailRequest: any = [];
  appointedAgentArray: any;
  markForDeleteCount = 0;
  COMPANY_AGENT_LIST: any;
  jointGroupCodeParam: any;
  loggedInUserName: any;
  agentUpdateFlag = false;
  previousUrl: any
  pdAccount: any
  displayLucDetailsAfterSearch: boolean = false;
  displayHaffaFlag: boolean = true;
  appointedAgentValueSubscriptions: Subscription[] = [];
  expandorcollapse: boolean = false;

  min: Date;
  @ViewChild('emailWindow') emailWindow: NgcWindowComponent;
  @ViewChild('selectWindow') selectWindow: NgcWindowComponent;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindowMaster') reportWindowMaster: NgcReportComponent;
  @ViewChild('appointedAgentsWindow') appointedAgentsWindow: NgcWindowComponent;
  @ViewChild('deregisterAppointedAgentsWindow') deregisterAppointedAgentsWindow: NgcWindowComponent;
  @ViewChild('customerShortName') customerShortName: NgcInputComponent;
  @ViewChild('showPopUpWindow') showPopUpWindow: NgcWindowComponent;
  @ViewChild('showPopUpWindow1') showPopUpWindow1: NgcWindowComponent;
  @ViewChild('showPopUpWindow2') showPopUpWindow2: NgcWindowComponent;
  @ViewChild('showPopUpWindow3') showPopUpWindow3: NgcWindowComponent;
  reportParameters: any = new Object();
  reportParameters1: any = new Object();
  customerStatus: any;
  currentPageIndex = 0;
  billingAddressIcon: string = '';
  correspondenceAddressIcon: string = '';

  public addCustomerForm: NgcFormGroup = new NgcFormGroup({
    customerId: new NgcFormControl(),
    customerCode: new NgcFormControl(),
    adminProfileId: new NgcFormControl(),
    customerShortName: new NgcFormControl('', [Validators.maxLength(70)]),
    formallyKnownAs: new NgcFormControl('', [Validators.maxLength(70)]),
    uenNumber: new NgcFormControl(),
    importAuthorizationHolderFlag: new NgcFormControl('N'),
    iaExpiryDate: new NgcFormControl(),
    adminLoginCode: new NgcFormControl(),
    lastShipmentAssignment: new NgcFormControl(),
    lastModifiedOn: new NgcFormControl(),
    customerCodeChangeReason: new NgcFormControl(),
    blacklistReasonCode: new NgcFormControl(),
    blackListIndicator: new NgcFormControl(),
    expressService: new NgcFormControl(),
    courierService: new NgcFormControl(),
    efacilitationCustomer: new NgcFormControl(),
    lastUpdatedDateTime: new NgcFormControl(),
    correspondenceAddress: new NgcFormControl('', [Validators.maxLength(70)]),
    correspondenceCountryCode: new NgcFormControl('', [Validators.maxLength(2)]),
    correspondenceCityCode: new NgcFormControl(),
    correspondenceStateCode: new NgcFormControl(),
    correspondencePlace: new NgcFormControl('', [Validators.maxLength(17)]),
    correspondencePostalCode: new NgcFormControl(),
    sameAsCorrespondence: new NgcFormControl(false),
    billingAddress: new NgcFormControl('', [Validators.maxLength(70)]),
    billingCountryCode: new NgcFormControl('', [Validators.maxLength(2)]),
    billingCityCode: new NgcFormControl('', [Validators.maxLength(3)]),
    billingStateCode: new NgcFormControl('', [Validators.maxLength(2)]),
    billingPlace: new NgcFormControl('', [Validators.maxLength(17)]),
    billingPostalCode: new NgcFormControl('', [Validators.maxLength(9)]),
    accountNumber: new NgcFormControl('', [Validators.maxLength(14)]),
    containerFreightStationCode: new NgcFormControl('', [Validators.maxLength(2)]),
    cassCode: new NgcFormControl('', [Validators.maxLength(4)]),
    amsCustomsNo: new NgcFormControl('', [Validators.maxLength(8)]),
    iataAgentCode: new NgcFormControl(),
    administratorUserProfileName: new NgcFormControl('', [Validators.maxLength(35)]),
    administratorUserProfileID: new NgcFormControl(),
    designationCode: new NgcFormControl(),
    notificationEmailId: new NgcFormControl(),
    oldCustomerCode: new NgcFormControl(),
    oldCustomerName: new NgcFormControl(),
    agentCustomerRelatedAgents: new NgcFormArray([]),
    appointedAgent: new NgcFormArray([]),
    awbRelatedToCustomer: new NgcFormArray([]),
    userInitialCode: new NgcFormControl(),
    chaNumber: new NgcFormControl(),
    chaNumberExpiry: new NgcFormControl(),
    panNumber: new NgcFormControl(),
    withPdAccount: new NgcFormControl(),
    withoutPdAccount: new NgcFormControl(),
    salesTaxNumber: new NgcFormControl(),
    customerTypes: new NgcFormControl('', [Validators.required]),
    truckerCompany: new NgcFormControl(),
    eInvoice: new NgcFormControl(),
    aisrsMember: new NgcFormControl(),
    fhlValidation: new NgcFormControl(),
    electronicInvoice: new NgcFormControl(),
    haffaMember: new NgcFormControl(),
    customerAcceptanceTypes: new NgcFormControl(),
    administrativeOfficeAddress: new NgcFormControl(),
    administrativeOfficePlace: new NgcFormControl(),
    administrativeOfficeStateCode: new NgcFormControl(),
    administrativeOfficePostalCode: new NgcFormControl(),
    administrativeOfficeCityCode: new NgcFormControl(),
    administrativeOfficeCountryCode: new NgcFormControl(),
    administratorNotificationEmailId: new NgcFormControl(),
    typeCode: new NgcFormControl(),
    contactDetail: new NgcFormArray([
      new NgcFormGroup({
        contType: new NgcFormControl(),
        defaultFlag: new NgcFormControl(),
        flagCRUD: new NgcFormControl(),
        contactDetails: new NgcFormArray([
          new NgcFormGroup({
            primaryContact: new NgcFormControl(),
            contactTypeDetail: new NgcFormControl(),
            flagCRUD: new NgcFormControl(),
            typeCode: new NgcFormControl(),
          })
        ])
      })
    ]),
    notificationDetail: new NgcFormArray([
      new NgcFormGroup({
        flagCRUD: new NgcFormControl(),
        defaultFlag: new NgcFormControl(),
        notificationType: new NgcFormControl(),
        notificationDetails: new NgcFormControl(),
      })
    ]),
    rcarDetails: new NgcFormArray([]),
    pimaAddresses: new NgcFormArray([
      new NgcFormGroup({
        address: new NgcFormControl(),
        flagCRUD: new NgcFormControl(''),
        select: new NgcFormControl(false)
      })
    ]),
    aliasDetails: new NgcFormArray([

    ]),
    ectHandlerLocalDestination: new NgcFormArray([

    ])
    ,
    truckerCompanyDetails: new NgcFormArray([

    ])

  });

  public emailForm: NgcFormGroup = new NgcFormGroup({
    index: new NgcFormControl(),
    notificationEmailMultiple: new NgcFormControl()
  });



  private LucDetails: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    customerShortName: new NgcFormControl(),
    lucAgentCode: new NgcFormControl(),
    customerId: new NgcFormControl(),
    lucAgentCodelist: new NgcFormArray([

    ])
  });
  saveLucDetailRequest: any;
  saveEctHandlerDetailRequest: any;
  saveTruckerDetailRequest: any;
  displayAddAliasDetails: boolean = false;





  /**
  * Initialize
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private adminService: AdminService, private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  /**
  * Called when clear button is clicked.
  * This clears all the forms
  * @param event
  * @returns void
  */
  onClear(event): void {

    this.addCustomerForm.reset();

    (<NgcFormArray>this.addCustomerForm.controls['appointedAgent']).controls = [];

    (<NgcFormArray>this.addCustomerForm.controls['contactDetail']).controls = [];

    (<NgcFormArray>this.addCustomerForm.controls['notificationDetail']).controls = [];

    (<NgcFormArray>this.addCustomerForm.controls['rcarDetails']).controls = [];

    (<NgcFormArray>this.addCustomerForm.controls['pimaAddresses']).controls = [];

    this.addCustomerForm.controls.customerCode.enable();

    this.resetFormMessages();

  }

  onRefresh(event) {

    const requestCustomerData = this.addCustomerForm.getRawValue();
    requestCustomerData.customerId = this.customerIdData;

    this.onSearhofCustomerMaster(requestCustomerData);

    this.addCustomerForm.get('uenNumber').setValue("");
    this.addCustomerForm.get('iataAgentCode').setValue(null);

    this.displaySearchFlag = false;
    this.addSearchCustomerData(event);
  }
  ngOnInit() {
    super.ngOnInit();
    const forwardedData = this.getNavigateData(this.activatedRoute);
    this.customerStatus = forwardedData.CustomerStatus;
    this.currentPageIndex = forwardedData.currentPageIndex;
    const today = new Date();
    this.min = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    if (forwardedData) {
      this.displaySearchFlag = true;
      this.previousUrl = forwardedData.previousUrl;
      // when navigate from maitain RCAR registration for agent 
      if (forwardedData.customerCode) {
        this.addCustomerForm.get('customerCode').patchValue(forwardedData.customerCode);
        this.addCustomerForm.get('customerShortName').patchValue(forwardedData.customerName);
      } else {
        this.addCustomerForm.get('customerCode').patchValue(forwardedData.companyCode);
        this.addCustomerForm.get('customerShortName').patchValue(forwardedData.companyName);
      }
      this.addSearchCustomerData(event);
    }
    this.searchFlag = true;
    this.deregisterFlag = false;
    this.disablePDFFlag = true;
    this.flagOldCustomer = true;
    this.customerListByAppointedAgent = this.getNavigateData(forwardedData);

    this.addCustomerForm.controls.customerTypes.valueChanges.subscribe(
      (newValue) => {
        const customerTypes: string[] = <Array<string>>newValue;
        if (customerTypes && customerTypes.length > 0) {
          if (customerTypes.indexOf('ARL') >= 0 || customerTypes.indexOf('AGT') >= 0) {
            this.addCustomerForm.controls.customerCode.setValidators(Validators.required);
          } else {
            this.addCustomerForm.controls.customerCode.setValidators([]);
          }
        }
        this.onDisableEnableHaffaFlag(this.addCustomerForm.controls.customerTypes.value);
      }

    );
    if (this.adminService.dataFromCustomerListToCustomermaster) {
      this.requestData = this.adminService.dataFromCustomerListToCustomermaster;
    }
    else if (this.adminService.dataFromChangeOfCodeToCustomerMaster) {
      this.requestData = this.adminService.dataFromChangeOfCodeToCustomerMaster;
      this.requestData.customerCode = this.adminService.dataFromChangeOfCodeToCustomerMaster.newCustomerCode;
    }
    if (this.requestData) {
      this.customerIddata = this.requestData.customerId;
    }
    if (this.requestData || this.customerListByAppointedAgentData) {
      const patchData = this.requestData || this.customerListByAppointedAgentData;
      patchData.customerShortName = this.requestData.customerName;
      patchData.customerId = this.requestData.customerId;
      this.addCustomerForm.patchValue(patchData);
      this.onSearhofCustomerMaster(this.addCustomerForm.getRawValue());
      this.diplayAfterSearch = true;
      this.displaySearchFlag = false;
    }
  }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.addCustomerForm.controls['sameAsCorrespondence'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.addCustomerForm.controls.billingAddress.setValue(
          this.addCustomerForm.controls.correspondenceAddress.value);
        this.addCustomerForm.controls.billingCountryCode.setValue(
          this.addCustomerForm.controls.correspondenceCountryCode.value);
        this.addCustomerForm.controls.billingCityCode.setValue(
          this.addCustomerForm.controls.correspondenceCityCode.value);
        this.addCustomerForm.controls.billingStateCode.setValue(
          this.addCustomerForm.controls.correspondenceStateCode.value);
        this.addCustomerForm.controls.billingPlace.setValue(
          this.addCustomerForm.controls.correspondencePlace.value);
        this.addCustomerForm.controls.billingPostalCode.setValue(
          this.addCustomerForm.controls.correspondencePostalCode.value);
        // adminstrator change
        this.addCustomerForm.controls.administrativeOfficeAddress.setValue(
          this.addCustomerForm.controls.correspondenceAddress.value);
        this.addCustomerForm.controls.administrativeOfficeCountryCode.setValue(
          this.addCustomerForm.controls.correspondenceCountryCode.value);
        this.addCustomerForm.controls.administrativeOfficeCityCode.setValue(
          this.addCustomerForm.controls.correspondenceCityCode.value);
        this.addCustomerForm.controls.administrativeOfficeStateCode.setValue(
          this.addCustomerForm.controls.correspondenceStateCode.value);
        this.addCustomerForm.controls.administrativeOfficePlace.setValue(
          this.addCustomerForm.controls.correspondencePlace.value);
        this.addCustomerForm.controls.administrativeOfficePostalCode.setValue(
          this.addCustomerForm.controls.correspondencePostalCode.value);

      } else {
        this.addCustomerForm.controls.billingAddress.setValue('');
        this.addCustomerForm.controls.billingCountryCode.setValue('');
        this.addCustomerForm.controls.billingCityCode.setValue('');
        this.addCustomerForm.controls.billingStateCode.setValue('');
        this.addCustomerForm.controls.billingPlace.setValue('');
        this.addCustomerForm.controls.billingPostalCode.setValue('');

        //
        this.addCustomerForm.controls.administrativeOfficeAddress.setValue('');
        this.addCustomerForm.controls.administrativeOfficePlace.setValue('');
        this.addCustomerForm.controls.administrativeOfficePostalCode.setValue('');
        this.addCustomerForm.controls.administrativeOfficeCityCode.setValue('');
        this.addCustomerForm.controls.administrativeOfficeCountryCode.setValue('');
        this.addCustomerForm.controls.administrativeOfficeStateCode.setValue('');
      }
    });

  }

  afterOpenDeRegisterCustomer() {
    if (this.addCustomerForm.get('customerShortName').value &&
      this.addCustomerForm.get('customerCode').value) {
      let length = this.addCustomerForm.getRawValue().agentCustomerRelatedAgents.length
      let length1 = this.addCustomerForm.getRawValue().awbRelatedToCustomer.length
      if (!length && !length1) {

        this.onDeregisterAppointedAgent();
        return false;
      }
    }
    return true;
  }


  /**
  * To add new text box
  */
  addPIMAAddressRow(event) {
    (<NgcFormArray>this.addCustomerForm.controls['pimaAddresses']).addValue([
      {
        flagCRUD: 'C',
        address: '',
        select: false
      }
    ]);
  }

  addAppointedAgentRow(event) {
    (<NgcFormArray>this.addCustomerForm.controls['appointedAgent']).addValue([
      {
        flagCRUD: 'C',
        customerId: this.customerIddata,
        customerCode: null,
        agentName: '',
        agentCustomerId: '',
        agentId: '',
        delegationAgreementType: null,
        effectiveDate: null,
        expiryDate: null,
        remarks: '',
        letterIssueDate: null,
        letterReceivedDate: null,
        letterSignedBy: '',
        designationCode: '',
        contractTerms: '',
        uploadDocumentReferenceNo: '',
        softDeleteFlag: false,
        lastUpdateByOn: '',
        agentUpdateFlag: false
      }
    ]);
  }



  onSave(event) {
    for (let i = 0; i < (<NgcFormArray>this.addCustomerForm.get(['appointedAgent'])).length; i++) {
      if (!(<NgcFormControl>this.addCustomerForm.get(['appointedAgent', i, 'customerCode'])).value ||
        !(<NgcFormControl>this.addCustomerForm.get(['appointedAgent', i, 'delegationAgreementType'])).value ||
        !(<NgcFormControl>this.addCustomerForm.get(['appointedAgent', i, 'effectiveDate'])).value) {
        (<NgcFormArray>this.addCustomerForm.controls['appointedAgent']).removeAt(i);
      }
    }
    this.addCustomerForm.validate();
    if (this.addCustomerForm.invalid) {
      this.expandorcollapse = true;
      return;
    }
    this.saveRequest = this.addCustomerForm.getRawValue();
    this.appointedAgentArray = this.saveRequest.appointedAgent;
    for (const eachRow of this.appointedAgentArray) {
      eachRow.customerId = this.customerIddata;
    }

    if (this.addCustomerForm.get('billingCityCode').value === "") {
      this.addCustomerForm.get('billingCityCode').setValue(null);
    }

    if (this.addCustomerForm.get('billingCountryCode').value === "") {
      this.addCustomerForm.get('billingCountryCode').setValue(null);
    }
    if (this.addCustomerForm.get('billingStateCode').value === "") {
      this.addCustomerForm.get('billingStateCode').setValue(null);
    }

    if (this.addCustomerForm.get('notificationEmailId').value === "") {
      this.addCustomerForm.get('notificationEmailId').setValue(null);
    }
    if (this.addCustomerForm.get('notificationEmailId').value === "") {
      this.addCustomerForm.get('notificationEmailId').setValue(null);
    }
    if (this.addCustomerForm.get('administrativeOfficeStateCode').value === "") {
      this.addCustomerForm.get('administrativeOfficeStateCode').setValue(null);
    }
    if (this.addCustomerForm.get('administrativeOfficeCountryCode').value === "") {
      this.addCustomerForm.get('administrativeOfficeCountryCode').setValue(null);
    }

    let contTypeResult = [];
    var valueArr = this.saveRequest.contactDetail
      .filter(function (item) { return item.flagCRUD != 'D' && item.contType && item.contType != "" && item.contType != null })
    valueArr.filter(function (item, idx, array) {
      return array.some(function (record, index) {
        return index != idx && item.contType === record.contType
      })
    }).forEach(item => {
      if (contTypeResult.indexOf(item.contType) < 0) {
        contTypeResult.push(item.contType);
      }
    });
    if (contTypeResult.length > 0) {
      this.showErrorStatus('admin.contact.type.unique');
      return;
    }

    let NotiTypeResult = [];
    var valueArr = this.saveRequest.notificationDetail
      .filter(function (item) { return item.flagCRUD != 'D' && item.notificationType && item.notificationType != "" && item.notificationType != null })
    valueArr.filter(function (item, idx, array) {
      return array.some(function (record, index) {
        return index != idx && item.notificationType === record.notificationType
      })
    }).forEach(item => {
      if (NotiTypeResult.indexOf(item.notificationType) < 0) {
        NotiTypeResult.push(item.notificationType);
      }
    });
    if (NotiTypeResult.length > 0) {
      this.showErrorStatus('admin.notification.type.unique');
      return;
    }

    /*this.saveRequest.aliasDetails.forEach(element => {
      if (element.customerAliasNamesId != null && element.flagCRUD != 'D') {
        element.flagCRUD = 'U'
      }
      else if (element.customerAliasNamesId == null) {
        element.flagCRUD = 'C'
      }
    });*/




    this.saveCustomerInformation();
  }


  addContactRow(index, sindex) {
    (<NgcFormArray>this.addCustomerForm.get(['contactDetail', index, 'contactDetails'])).addValue([
      {
        primaryContact: false,
        contactTypeDetail: '',
        typeCode: ''
      }
    ]);
    console.clear();
  }

  addContact(event) {
    (<NgcFormArray>this.addCustomerForm.get(['contactDetail'])).addValue([
      {
        flagCRUD: 'C',
        contType: '',
        contactDetails: [{
          primaryContact: false,
          contactTypeDetail: '',
          typeCode: ''
        }]
      }
    ]);
    console.clear();
  }

  onCloseAppointedAgent(event) {
    this.onSaveAppointedAgent(event);
  }


  onSaveAppointedAgent(event) {
    const request = (<NgcFormArray>this.addCustomerForm.controls.appointedAgent).getRawValue();
    let deleted: number = 0;
    let count = 0;
    for (const eachRow of request) {
      if (eachRow.flagCRUD === 'D') {
        deleted++;
      }
      if (eachRow.flagCRUD === 'C') {
        count++;
      }
      if (eachRow.customerCode === null || eachRow.effectiveDate === null || eachRow.delegationAgreementType === null) {
        this.showWarningStatus('admin.fill.mandatory.fields');
        return;
      }

      let validFrom = new Date();
      let validTo = new Date();
      validFrom = eachRow.effectiveDate;
      validTo = eachRow.expiryDate;
      if (validFrom === null) {
        this.showWarningStatus('admin.effective.date.cannot.blank');
        return;
      }
      if (validTo != null && validFrom >= validTo) {
        this.showWarningStatus('admin.expiry.date.should.greater.effectivedate');
        return;
      }

    }
    let messages: string[] = [];
    if (this.softDeleteCount > 0) {
      messages.push(this.softDeleteCount + ' Records are marked for update save the customer profile for the action to be completed');
    }
    if (deleted > 0) {
      messages.push(deleted + ' Records are marked for delete save the customer profile for the action to be completed');
    }
    if (messages.length > 0) {
      this.showInfoStatus(messages.join(', '));
      this.appointedAgentsWindow.close();
    }
    if (count > 0) {
      this.showInfoStatus('admin.appointed.agent.add.sucess');
    }
    this.appointedAgentsWindow.close();
    this.saveRequest.appointedAgent = request;
    this.appointedAgentValueSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }



  addNotificationRow(event) {
    (<NgcFormArray>this.addCustomerForm.controls['notificationDetail']).addValue([
      {
        flagCRUD: 'C',
        defaultFlag: false,
        notificationType: '',
        notificationDetails: ''
      }
    ]);
    console.clear();
  }

  onContactDelete(event, index: any): void {
    (<NgcFormArray>this.addCustomerForm.controls['contactDetail']).markAsDeletedAt(event);
  }

  onPimaDelete(event, index: any): void {
    (<NgcFormArray>this.addCustomerForm.controls['pimaAddresses']).markAsDeletedAt(event);
  }

  onNotificationDelete(event, index: any): void {
    (<NgcFormArray>this.addCustomerForm.controls['notificationDetail']).markAsDeletedAt(event);
  }


  onNotificationEmailAdd(event, index: any): void {
    this.emailForm.get('index').patchValue(event);
    this.emailForm.get('notificationEmailMultiple').patchValue(this.addCustomerForm.get(['notificationDetail', event, 'notificationDetails']).value);
    this.emailWindow.open();
  }

  onPopUpOKClick() {
    let index = this.emailForm.get('index').value;
    this.addCustomerForm.get(['notificationDetail', index, 'notificationDetails']).patchValue(this.emailForm.get('notificationEmailMultiple').value);
    this.emailForm.reset();
    this.emailWindow.close();
  }

  onPopUpCancelClick() {
    this.emailForm.reset();
    this.emailWindow.close();
  }


  onPrimaryContactDelete(index, sindex) {
    (this.addCustomerForm.get(['contactDetail', index, 'contactDetails', sindex]) as NgcFormGroup).markAsDeleted();
  }


  onDeleteAppointedAget(event, index: any): void {
    if ((this.addCustomerForm.get(['appointedAgent', event]) as NgcFormGroup).get('softDeleteFlag').value) {
      this.softDeleteCount--;
      if (this.softDeleteCount < 0) {
        this.softDeleteCount = 0;
      }
      (<NgcFormArray>this.addCustomerForm.controls['appointedAgent']).markAsDeletedAt(event);
    } else {
      if (this.addCustomerForm.get(['appointedAgent', event, 'expiryDate']).value == null) {
        this.addCustomerForm.get(['appointedAgent', event, 'expiryDate']).setValue(new Date(Date.now() - 86400000));
        if (this.addCustomerForm.get(['appointedAgent', event, 'expiryDate']).value != null) {
          this.addCustomerForm.controls.appointedAgent.disable();
        }
      }
      (this.addCustomerForm.get(['appointedAgent', event]) as NgcFormGroup).markAsUpdated();
      (this.addCustomerForm.get(['appointedAgent', event]) as NgcFormGroup).get('softDeleteFlag').patchValue(true);
      this.softDeleteCount++;
    }

  }

  openAppointedAgentsWindow(event) {

    this.appointedAgentValueSubscriptions = [];

    (this.addCustomerForm.get('appointedAgent') as NgcFormArray).controls.forEach((appointedAgent, index) => {
      if (appointedAgent.get(['expiryDate']).value != null) {
        this.addCustomerForm.get(['appointedAgent', index]).disable();
      }
      if (appointedAgent.get(['customerCode']).value != null) {
        appointedAgent.get(['customerCode']).disable();
      }

      this.appointedAgentValueSubscriptions.push(appointedAgent.valueChanges.subscribe(value => {
        if (appointedAgent.get(['agentUpdateFlag']).value !== true) {
          appointedAgent.get(['agentUpdateFlag']).setValue(true);
        }
      }));

    });
    this.appointedAgentsWindow.open();
  }




  openAuthorizedPersonnel(event) {
    const authorizedPersonnelData = this.addCustomerForm.getRawValue();
    this.adminService.dataFromCustomerMasterToAuthorizedPersonnel = authorizedPersonnelData;
    var dataToSend = {
      companyCode: this.addCustomerForm.get('customerCode').value,
      companyName: this.addCustomerForm.get('customerShortName').value,
      customerId: this.addCustomerForm.get('customerId').value
    }
    this.navigateTo(this.router, 'admin/authorizedpersonnel', dataToSend);
  }

  openBillingConfiguration(event) {
    const BillingData = this.addCustomerForm.getRawValue();
    this.adminService.dataFromCustomerMasterToAuthorizedPersonnel = BillingData;
    var dataToSend = {
      companyCode: this.addCustomerForm.get('customerCode').value,
      companyName: this.addCustomerForm.get('customerShortName').value,
      customerId: this.addCustomerForm.get('customerId').value
    }
    this.navigateTo(this.router, '/billing/billingSetup/customerbillingsetup', dataToSend);


  }

  openSubUserProfile(event) {
    const subUserProfileData = this.addCustomerForm.getRawValue();
    this.adminService.dataFromCustomerMasterToSubUSerProfile = subUserProfileData;
    var dataToSend = {
      customerId: this.addCustomerForm.get('customerId').value,
      companyCode: this.addCustomerForm.get('customerCode').value,
      uenNumber: this.addCustomerForm.get('uenNumber').value,
      iataAgentCode: this.addCustomerForm.get('iataAgentCode').value,
      adminLoginCode: this.addCustomerForm.get('adminLoginCode').value,
      companyName: this.addCustomerForm.get('customerShortName').value
    }
    this.navigateTo(this.router, 'admin/subuserprofilelist', dataToSend);
  }



  openChangeOfCode(event) {
    let changeOfCodeData = this.addCustomerForm.getRawValue();
    this.adminService.dataFromCustomerMasterToChangeOfCode = changeOfCodeData;
    this.router.navigate(['admin', 'changeofcode']);


  }

  openDeRegisterCustomer(event) {
    let request = this.addCustomerForm.getRawValue();
    this.adminService.fetchCustomerRelatedAgentsAndawbs(request).subscribe(data => {
      this.refreshFormMessages(data);
      let response = data.data;
      if (response) {
        this.addCustomerForm.get('agentCustomerRelatedAgents').patchValue(response.agentCustomerRelatedAgents);
        this.addCustomerForm.get('awbRelatedToCustomer').patchValue(response.awbRelatedToCustomer);
        this.resp.agentCustomerRelatedAgents = response.agentCustomerRelatedAgents;
        this.resp.awbRelatedToCustomer = response.awbRelatedToCustomer;
      }
      let a = this.afterOpenDeRegisterCustomer();
      if (!a) {
        return;
      }
      this.deregisterAppointedAgentsWindow.open();
      if (this.resp.agentCustomerRelatedAgents.length === 0 || this.resp.awbRelatedToCustomer.length1 === 0) {
        this.disablePDFFlag = true;
        this.disableFlag = false;
      } else {
        this.disablePDFFlag = true;
        this.disableFlag = false;
      }


      if (this.resp.awbRelatedToCustomer.length === 0) {
        this.showFlag = false;
      } else {
        this.showFlag = true;
      }

      if (this.resp.agentCustomerRelatedAgents.length === 0) {
        this.showFlag1 = false;
      } else {
        this.showFlag1 = true;
      }
    }, error => this.showErrorStatus('g.error'));

  }


  onExportToPDFClickCustomer(event) {
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_CustomerPaymentAccount)) {

      this.selectWindow.open();
    }
    else {
      this.onGenerateReportCustomerReport();
    }


  }


  onServiceReport() {

    if (this.addCustomerForm.get('withPdAccount').value) {
      this.pdAccount = this.addCustomerForm.get('withPdAccount').value;
      this.onGenerateReportCustomerReport();

    }
    else if (this.addCustomerForm.get('withoutPdAccount').value) {
      this.pdAccount = false;
      this.onGenerateReportCustomerReport();

    }


  }

  onGenerateReportCustomerReport() {
    this.selectWindow.close();
    this.reportParameters1.cutomerId = this.addCustomerForm.get('customerId').value;
    this.reportParameters1.flag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_CustomAgentNumberExpiryDate);
    this.reportParameters1.uenNumber = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_CustomerUniqueEntityNumber).displayName;
    this.reportParameters1.chaNumber = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_CustomHouseAgentNumber).displayName;
    this.reportParameters1.chaNumberExpiry = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_CustomAgentNumberExpiryDate).displayName;
    this.reportParameters1.panNumber = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_TaxAccountNumber).displayName;
    this.reportParameters1.pdAccount = this.pdAccount;
    this.reportParameters1.haffaMember = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_HaffaMember).displayName;
    this.reportParameters1.aisrs = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_AISRSMember).displayName;
    this.reportParameters1.fhlValidation = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_FHLValidation).displayName;
    this.reportParameters1.airsideAcceptanceType = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_AirsideAcceptanceType).displayName;
    this.reportParameters1.electronicInvoice = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_ElectronicInvoice).displayName;
    this.reportParameters1.flag1 = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_HaffaMember);
    this.reportParameters1.customerContactPurpose = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_ContactPurpose).displayName;

    this.reportWindowMaster.open();
  }

  onExportToPDFClick(event) {
    this.disableFlag = true;

    this.onGenerateReportCustomer();
  }
  onExportToXLSClick(event) {
    this.disableFlag = true;
    this.reportParameters.customerID = this.addCustomerForm.get('customerId').value;
    this.reportWindow1.downloadReport();
  }
  onGenerateReportCustomer() {
    this.reportParameters.customerID = this.addCustomerForm.get('customerId').value;
    this.reportWindow.open();
  }



  onDeregisterAppointedAgent() {
    this.deregisterFlag = false;
    const requestDeregister = this.addCustomerForm.getRawValue();
    this.showConfirmMessage('admin.deregister.company.confirmation').then(fulfilled => {
      this.adminService.onDeregisterAppointedAgent(requestDeregister).subscribe(data => {
        this.resp = data;
        this.refreshFormMessages(data);
        if (!data.messageList) {
          this.deregisterFlag = true;
          this.showSuccessStatus('g.completed.successfully');
          this.deregisterAppointedAgentsWindow.hide();
          this.reloadPage();
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);
        }

      }, error => this.showErrorStatus('g.error'));
    });
  }

  onSearhofCustomerMaster(searchData) {
    this.softDeleteCount = 0;
    this.buttonFlag = true;
    const searchRequestData = searchData;
    this.resetFormMessages();
    this.adminService.onSearchCustomerId(searchRequestData ||
      this.requestData || this.customerListByAppointedAgentData || this.responseDataForSearch
    ).subscribe(data => {
      this.diplayAfterSearch = true;
      this.displaySearchFlag = false;
      this.resp = data.data;
      if (this.resp) {
        // SAVING DATA FOR CUSTOMER SEARCH COMING FROM CHANGE OF CODE
        this.loggedInUserName = this.resp.loggedInUser;
        this.searchForChargeCodeCustomerId = this.resp.customerId;
      }
      if (!data.data) {
        this.showErrorStatus('no.record');
        this.displaySearchFlag = true;
        this.diplayAfterSearch = false;
        return;
      } else {
        this.stateByCountry = this.createSourceParameter(
          this.resp.correspondenceCountryCode
        ); // Fetching List of  states by selected country and updating the LOV
        this.customerCodeSave = this.resp.customerCode;
        this.addCustomerForm.controls.customerCode.disable();
        this.addCustomerForm.controls.adminLoginCode.disable();
        this.addCustomerForm.controls.lastShipmentAssignment.disable();
        this.addCustomerForm.controls.lastUpdatedDateTime.disable();
        this.contactFlagCRUD = this.resp.contactDetail;
        this.appointedFlagCRUD = this.resp.appointedAgent;
        this.notificationFlagCRUD = this.resp.notificationDetail;
        this.pimaFlagCRUD = this.resp.pimaAddresses;
        if (this.contactFlagCRUD && this.contactFlagCRUD.length > 0) {
          this.contactFlagCRUD.forEach(contactFlag => {
            contactFlag.flagCRUD = 'U';
            this.contactFlagCRUD = contactFlag.contactDetails;
            this.contactFlagCRUD.forEach(contactCRUD => {
              contactCRUD.flagCRUD = 'U';
            });
          });
        }
        if (this.appointedFlagCRUD && this.appointedFlagCRUD.length > 0) {
          this.appointedFlagCRUD.forEach(appointedFlag => {
            appointedFlag.flagCRUD = 'U';
          });
        }
        if (this.notificationFlagCRUD && this.notificationFlagCRUD.length > 0) {
          this.notificationFlagCRUD.forEach(notificationFlag => {
            notificationFlag.flagCRUD = 'U';
          });
        }
        if (this.pimaFlagCRUD && this.pimaFlagCRUD.length > 0) {
          this.pimaFlagCRUD.forEach(pimaFlag => {
            pimaFlag.flagCRUD = 'U';
          });
        }
        this.refreshFormMessages(data);
        if (!data.messageList) {
          this.diplayAfterSearch = true;
          this.addCustomerForm.patchValue(this.resp);
          if (this.resp.appointedAgent && this.resp.appointedAgent.length === 0) {
            this.addAppointedAgentRow(event);
          }
          // Validate in case, if IA holder Flag is "YES"
          if ((<NgcFormControl>this.addCustomerForm.get(['importAuthorizationHolderFlag'])).value) {
            this.onChangeIaHolder('true');
          } else {
            this.onChangeIaHolder('false');
          }
          if (this.addCustomerForm.controls.adminLoginCode.value) {
            this.adminFlag = false;
          } else {
            this.adminFlag = true;
          }
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);
        }
      }
      // 

    }, (error) => {
      this.diplayAfterSearch = false;
    });
  }


  /**
   * This function is responsible for selecting the Value from company's LOV
   * @param object
   */
  public onSelect(object) {
    this.addCustomerForm.get('agentName').setValue(object.desc);
  }

  disableLov(index) {
    if ((<NgcFormControl>this.addCustomerForm.get(["appointedAgent", index, "customerCode"])).value != null
      && (<NgcFormControl>this.addCustomerForm.get(["appointedAgent", index, "customerCode"])).value != '') {
      (<NgcFormControl>this.addCustomerForm.get(["appointedAgent", index, "customerCode"])).disable();
    }
  }

  OnSelectAppointedAgentCode(event, index) {
    const formGroup: NgcFormGroup = <NgcFormGroup>this.addCustomerForm.get(['appointedAgent', index]);
    formGroup.get('agentName').setValue(event.desc);
    formGroup.get('agentId').setValue(event.param1);
    if (event.code === null) {
      this.showErrorStatus("admin.agent.not.registered");
    }

  }

  OnSelectAppointedAgentName(event, index) {
    const formGroup: NgcFormGroup = <NgcFormGroup>this.addCustomerForm.get(['appointedAgent', index]);
    formGroup.get('customerCode').setValue(event.code);
  }

  saveCustomerInformation() {
    this.saveRequest.customerCode = this.customerCodeSave;
    let request = this.addCustomerForm.getRawValue();
    let flag = true;
    request.contactDetail.forEach(element => {
      if (element.id == null) {
        element.flagCRUD = 'C';
      }
      if (element != null) {
        element.contactDetails.forEach(element => {
          if (element.id == null) {
            element.flagCRUD = 'C';
          }
        });
      }
    });
    request.notificationDetail.forEach(element => {
      if (element.id == null) {
        element.flagCRUD = 'C';
      }
    });
    console.log(request.notificationDetail);
    for (let i = 0; i < request.notificationDetail.length; i++) {
      if (request.notificationDetail[i].notificationType !== null
        && request.notificationDetail[i].notificationDetails === "") {
        return this.showErrorMessage(NgcUtility.translateMessage("error.enter.atleast.one.email.notification", [request.notificationDetail[i].notificationType]));

      }
    }
    request.pimaAddresses.forEach(element => {
      if (element.id == null) {
        element.flagCRUD = 'C';
      }
    });
    request.appointedAgent.forEach(element => {
      if (element.customerCode == null || element.delegationAgreementType == null || element.effectiveDate == null) {
        this.showWarningStatus('admin.fill.mandatory.fields.for.appointed.agent');
        flag = false;
        return;
      }
    })
    request.deregistered = 0;
    request.deregistredUen = 0;
    if (flag) {
      request.notificationEmailId = request.administratorNotificationEmailId;
      this.adminService.onSaveCustomer(request).subscribe(data => {
        if (data.messageList !== null && data.messageList[0].message === 'Customer Deregistered') {

          this.showConfirmMessage(NgcUtility.translateMessage("error.cust.code.deleted.on", [data.messageList[0].referenceId])).then(fulfilled => {
            request.deregistered = 1;


            this.adminService.onSaveCustomer(request).subscribe(data => {
              if (!data.data) {
                this.responseDataForSearch = data;
              } else {
                this.responseDataForSearch = data.data;
              }
              this.customerCodeDisplay = this.responseDataForSearch.customerCode;

              this.refreshFormMessages(data);
              this.validateCorrespondenceBillingTabs();
              if (!data.messageList) {
                this.showSuccessStatus('g.completed.successfully');
                const requestDataCustomerId = {
                  customerId: data.data.customerId
                }
                this.onSearhofCustomerMaster(requestDataCustomerId);
                this.addCustomerForm.controls.customerCode.enable();
                this.addCustomerForm.controls.customerShortName.enable();

              }


              else if (data.data === null && data.messageList[0].code == "data.customer.uenNumberExists") {
                return this.showErrorStatus(NgcUtility.translateMessage("error.customer.code.same", [data.messageList[0].referenceId, NgcUtility.translateMessage(data.messageList[0].message, [])]));
              }


            });




          });
        }

        if (data.messageList !== null && data.messageList[0].message === 'UEN Number Deregistered') {

          this.showConfirmMessage(NgcUtility.translateMessage("error.un.number.deleted", [data.messageList[0].referenceId])).then(fulfilled => {
            request.deregistredUen = 1;
            this.adminService.onSaveCustomer(request).subscribe(data => {
              if (!data.data) {
                this.responseDataForSearch = data;
              } else {
                this.responseDataForSearch = data.data;
              }
              this.customerCodeDisplay = this.responseDataForSearch.customerCode;

              this.refreshFormMessages(data);
              this.validateCorrespondenceBillingTabs();
              if (!data.messageList) {
                this.showSuccessStatus('g.completed.successfully');
                const requestDataCustomerId = {
                  customerId: data.data.customerId
                }
                this.onSearhofCustomerMaster(requestDataCustomerId);
                this.addCustomerForm.controls.customerCode.enable();
                this.addCustomerForm.controls.customerShortName.enable();

              }
              else if (data.data === null && data.messageList[0].code == "data.customer.uenNumberExists") {
                return this.showErrorStatus(NgcUtility.translateMessage("error.customer.code.same", [data.messageList[0].referenceId, NgcUtility.translateMessage(data.messageList[0].message, [])]));
              }
            });

          });
        }

        if (!data.data) {
          this.responseDataForSearch = data;
        } else {
          this.responseDataForSearch = data.data;
        }
        this.customerCodeDisplay = this.responseDataForSearch.customerCode;

        this.refreshFormMessages(data);
        this.validateCorrespondenceBillingTabs();
        if (!data.messageList) {

          this.showSuccessStatus('g.completed.successfully');

          const requestDataCustomerId = {
            customerId: data.data.customerId
          }
          this.onSearhofCustomerMaster(requestDataCustomerId);
          this.addCustomerForm.controls.customerCode.enable();
          this.addCustomerForm.controls.customerShortName.enable();

        }
        else if (data.data === null && data.messageList[0].code == "data.customer.uenNumberExists") {
          return this.showErrorStatus(NgcUtility.translateMessage("error.customer.code.same", [data.messageList[0].referenceId, NgcUtility.translateMessage(data.messageList[0].message, [])]));
        }
      }, error => this.showErrorStatus('g.error'));
    }
  }



  addSearchCustomerData(event) {


    const requestCustomerData: SearchCustomerMaster = new SearchCustomerMaster();
    requestCustomerData.customerID = this.customerIdData;
    requestCustomerData.customerCode = this.addCustomerForm.get('customerCode').value;
    requestCustomerData.customerShortName = this.addCustomerForm.get('customerShortName').value;
    requestCustomerData.uenNumber = this.addCustomerForm.get('uenNumber').value;
    requestCustomerData.iataAgentCode = this.addCustomerForm.get('iataAgentCode').value;
    requestCustomerData.adminLoginCode = this.addCustomerForm.get('adminLoginCode').value;
    requestCustomerData.chaNumber = this.addCustomerForm.get('chaNumber').value;
    requestCustomerData.chaNumberExpiry = this.addCustomerForm.get('chaNumberExpiry').value;
    requestCustomerData.panNumber = this.addCustomerForm.get('panNumber').value;



    if (this.addCustomerForm.get('customerCode').invalid || this.addCustomerForm.get('customerShortName').invalid
      || this.addCustomerForm.get('iataAgentCode').invalid || this.addCustomerForm.get('uenNumber').invalid) {
      return;
    }
    if (this.addCustomerForm.controls.customerShortName.value &&
      this.addCustomerForm.controls.customerCode.value || this.addCustomerForm.controls.uenNumber.value
      || this.addCustomerForm.controls.iataAgentCode.value === '' || this.addCustomerForm.controls.iataAgentCode.value || this.addCustomerForm.controls.adminLoginCode.value === ''
      || this.addCustomerForm.controls.adminLoginCode.value) {
      this.onSearhofCustomerMaster(requestCustomerData);
    } else {
      this.showInfoStatus('no.record');
      return;
    }
  }
  onSelectUen() {
    if (this.addCustomerForm.controls.uenNumber.value) {

      var patt = new RegExp("^[0-9]{8,9}[A-Za-z]{1}$");
      var patt1 = new RegExp("^[T,S]{1}[0-9]{2}[A-Za-z]{2}[0-9]{4}[A-Za-z]{1}$");
      if (patt.test(this.addCustomerForm.get('uenNumber').value) || patt1.test(this.addCustomerForm.get('uenNumber').value)) {
      } else {
        this.showErrorMessage('data.uen.code.invalid');
        return;
      }
    }

  }


  onSelectCity(event) {

    this.addCustomerForm.get('correspondenceCountryCode').setValue(event.parameter1);
    this.stateByCountry = this.createSourceParameter(
      event.parameter1
    );
  }



  onSelectCityBill(event) {
    this.addCustomerForm.get('billingCountryCode').setValue(event.parameter1);
    this.stateByCountry = this.createSourceParameter(
      event.parameter1
    );
  }

  onCompanyLOVSelect(object) {
    this.customerIdData = object.param1;
    this.addCustomerForm.get('customerShortName').setValue(object.desc);
  }

  onCustomerTypeSelect(object) {
    let customerTypesArray: Array<String> = [];
    let count = 0;
    this.displayHaffaFlag = true;

    console.log(object);


    for (let i = 0; i < object.length; i++) {
      customerTypesArray.push(object[i].code);

    }
    this.onDisableEnableHaffaFlag(customerTypesArray);
    this.addCustomerForm.controls.customerCode.setErrors(null);
  }

  onCompanyNameLOVSelect(object) {
    this.customerIdData = object.param1;
    this.addCustomerForm.get('customerCode').setValue(object.code);
  }
  onSelectCountry(object) {
    this.stateByCountry = this.createSourceParameter(
      object.code
    );
  }

  addCreateCustomerData(event) {
    this.addCustomerForm.reset();
    this.resetFormMessages();
    this.diplayAfterSearch = true;
    this.buttonFlag = false;
    this.displaySearchFlag = false;
    this.flagOldCustomer = false;
    this.addCustomerForm.controls.customerCode.enable();
    this.addCustomerForm.controls.customerShortName.enable();
    this.addCustomerForm.controls.administratorUserProfileName.enable();
    this.addCustomerForm.controls.designationCode.enable();
    this.addCustomerForm.controls.notificationEmailId.enable();

    this.addCustomerForm.get('customerCode').setValidators([]);
    setTimeout(() => {
      this.customerShortName.focus();
    }, 1000);


  }

  // public afterFocus() {
  //   setTimeout(() => {
  //     this.customerShortName.focus();
  //   }, 100);
  // }

  public onBack(event) {
    if (event) {
      this.diplayAfterSearch = false;
      this.displaySearchFlag = true;
      this.addCustomerForm.get('customerCode').setValue("");
      this.addCustomerForm.get('customerShortName').setValue("");
      this.addCustomerForm.get('uenNumber').setValue("");
      this.addCustomerForm.get('iataAgentCode').setValue(null);
      this.addCustomerForm.get('adminLoginCode').setValue("");
      this.addCustomerForm.controls.customerCode.setValidators([]);
      this.addCustomerForm.controls.customerCode.enable();
      this.addCustomerForm.controls.adminLoginCode.enable();
      this.addCustomerForm.controls.customerShortName.setValidators([]);
      this.addCustomerForm.controls.uenNumber.setValidators([]);
      if (this.previousUrl == '/admin/customerlistbyappointee') {
        this.router.navigate(['admin', 'customerlistbyappointee']);
      }
    } else {
      const record = this.addCustomerForm.getRawValue();
      record.customerStatus = this.customerStatus;
      record.currentPageIndex = this.currentPageIndex;
      this.navigateBack(record);
    }
  }

  onChangeIaHolder(event) {
    this.resetFormMessages();
    // (<NgcFormControl>this.addCustomerForm.get('uenNumber')).setValidators([]);
  }

  isDateDifference(value, index) {
    let check = NgcUtility.dateDifference(value, this.min);
    if (check > 0) {
      return true;
    } else {
      return false;
    }
  }

  validateCorrespondenceBillingTabs() {
    this.correspondenceAddressIcon = '';
    if (this.addCustomerForm.get('correspondenceAddress').invalid == true || this.addCustomerForm.get('correspondencePlace').invalid == true || this.addCustomerForm.get('correspondencePostalCode').invalid == true) {
      this.correspondenceAddressIcon = "error";
      return;
    }
    this.billingAddressIcon = '';
    if (this.addCustomerForm.get('billingAddress').invalid == true || this.addCustomerForm.get('billingPlace').invalid == true || this.addCustomerForm.get('billingPostalCode').invalid == true) {
      this.billingAddressIcon = "error";
      return;
    }
  }

  onClickAliasPopup(event) {

    const requestCustomerData: SearchCustomerMaster = new SearchCustomerMaster();
    requestCustomerData.customerID = this.customerIdData;
    requestCustomerData.customerCode = this.addCustomerForm.get('customerCode').value;
    requestCustomerData.customerShortName = this.addCustomerForm.get('customerShortName').value;
    requestCustomerData.uenNumber = this.addCustomerForm.get('uenNumber').value;
    requestCustomerData.iataAgentCode = this.addCustomerForm.get('iataAgentCode').value;
    requestCustomerData.adminLoginCode = this.addCustomerForm.get('adminLoginCode').value;
    requestCustomerData.chaNumber = this.addCustomerForm.get('chaNumber').value;
    requestCustomerData.chaNumberExpiry = this.addCustomerForm.get('chaNumberExpiry').value;
    requestCustomerData.panNumber = this.addCustomerForm.get('panNumber').value;
    this.onSearhofCustomerMaster(requestCustomerData);


    this.displayAddAliasDetails = false;


    this.showPopUpWindow.open();
  }
  addAliasRow(index, sindex) {

    (<NgcFormArray>this.addCustomerForm.get(['aliasDetails'])).addValue([
      {
        aliasName: '',
        carrierCode: null,
        flagCRUD: 'C'
      }
    ]);
    console.clear();
  }
  onDeleteAliasRow(event, index: any): void {
    (<NgcFormArray>this.addCustomerForm.controls['aliasDetails']).markAsDeletedAt(event);
  }
  saveAliasDetails(event) {
    let displayError = 0;
    let errorMessage: string = null;
    this.saveAliasDetailRequest = this.addCustomerForm.getRawValue();
    /*this.saveAliasDetailRequest.aliasDetails.forEach(element => {
      if (element.customerAliasNamesId != null && element.flagCRUD != 'D') {
        //element.flagCRUD = 'U'
      }
      else if (element.customerAliasNamesId == null && element.flagCRUD != 'D') {
        // element.flagCRUD = 'C'
      }
    });*/
    let request = this.addCustomerForm.getRawValue();
    this.adminService.onSaveAliasDetail(request).subscribe(data => {

      if (!data.messageList) {

        this.showSuccessStatus('g.completed.successfully');
        if (data! = null) {
          this.addCustomerForm.get('aliasDetails').patchValue(data.data.aliasDetails);
        }
        this.refreshFormMessages(data);
      }
      else {
        this.showErrorStatus(NgcUtility.translateMessage(data.messageList[0].code, []));
        return;
      }
      this.showPopUpWindow.close();
    });





  }

  onClickLucAgentPopup() {
    this.LucDetails.get('customerShortName').patchValue(this.addCustomerForm.get('customerShortName').value)
    this.LucDetails.get('customerId').patchValue(this.addCustomerForm.get('customerId').value)
    const requestCustomerData: SearchLucDetails = new SearchLucDetails();
    requestCustomerData.customerId = this.LucDetails.get('customerId').value;
    requestCustomerData.groupCarrier = this.LucDetails.get('carrierGroup').value;
    requestCustomerData.customerId = this.LucDetails.get('customerId').value;
    this.onsearchLucAgent(requestCustomerData);
    this.showPopUpWindow1.open();
  }
  searchLucAgent() {
    const requestCustomerData: SearchLucDetails = new SearchLucDetails();
    requestCustomerData.carrierCode = this.LucDetails.get('carrierCode').value;
    requestCustomerData.groupCarrier = this.LucDetails.get('carrierGroup').value;
    requestCustomerData.customerId = this.LucDetails.get('customerId').value;
    this.onsearchLucAgent(requestCustomerData);
  }
  onsearchLucAgent(requestCustomerData) {
    this.adminService.onSearchLucDetails(requestCustomerData).subscribe(data => {

      this.displayLucDetailsAfterSearch = true;
      this.displaySearchFlag = false;
      this.resp = data.data;
      this.LucDetails.get('lucAgentCodelist').patchValue(this.resp);




      // 

    }, (error) => {
      this.displayLucDetailsAfterSearch = false;
    });

  }
  addLucAgent() {
    (<NgcFormArray>this.LucDetails.get(['lucAgentCodelist'])).addValue([
      {
        lucAgentCode: '',
        carrierCode: null,
        flagCRUD: 'C'
      }
    ]);
    console.clear();
  }
  saveLucInformationDetails(event) {
    this.saveLucDetailRequest = this.LucDetails.getRawValue();
    /*this.saveLucDetailRequest.lucAgentCodelist.forEach(element => {
      if (element.customerLUCAgentId != null && element.flagCRUD != 'D') {
        //element.flagCRUD = 'U'
      }
      else if (element.customerLUCAgentId == null && element.flagCRUD != 'D') {
        //element.flagCRUD = 'C'
      }
    });*/

    this.saveLucInformation();


  }
  saveLucInformation() {
    let request = this.LucDetails.getRawValue();

    this.adminService.onSaveLucDetails(request).subscribe(data => {

      if (!data.messageList) {

        this.showSuccessStatus('g.completed.successfully');
        this.LucDetails.get('lucAgentCodelist').patchValue(data.data.lucAgentCodelist);
        this.refreshFormMessages(data);
        this.showPopUpWindow1.close();
      }
      else {
        this.showErrorStatus(NgcUtility.translateMessage(data.messageList[0].code, []));
        return;
      }



    });

  }
  onDeleteLucDetail(event, index: any) {
    (<NgcFormArray>this.LucDetails.controls['lucAgentCodelist']).markAsDeletedAt(event);
  }
  // ECT Functions

  onClickECTHandlerPopup(event) {
    const requestCustomerData: SearchCustomerMaster = new SearchCustomerMaster();
    requestCustomerData.customerID = this.customerIdData;
    requestCustomerData.customerCode = this.addCustomerForm.get('customerCode').value;
    requestCustomerData.customerShortName = this.addCustomerForm.get('customerShortName').value;
    requestCustomerData.uenNumber = this.addCustomerForm.get('uenNumber').value;
    requestCustomerData.iataAgentCode = this.addCustomerForm.get('iataAgentCode').value;
    requestCustomerData.adminLoginCode = this.addCustomerForm.get('adminLoginCode').value;
    requestCustomerData.chaNumber = this.addCustomerForm.get('chaNumber').value;
    requestCustomerData.chaNumberExpiry = this.addCustomerForm.get('chaNumberExpiry').value;
    requestCustomerData.panNumber = this.addCustomerForm.get('panNumber').value;
    this.onSearhofCustomerMaster(requestCustomerData);
    this.showPopUpWindow2.open();
  }
  addECTHandlerRow(index, sindex) {
    (<NgcFormArray>this.addCustomerForm.get(['ectHandlerLocalDestination'])).addValue([
      {
        localDestination: '',
        customerECTLocalDestinationId: null,
        flagCRUD: 'C'
      }
    ]);
    console.clear();
  }
  onDeleteECTHandlerRow(event, index: any): void {
    (<NgcFormArray>this.addCustomerForm.controls['ectHandlerLocalDestination']).markAsDeletedAt(event);
  }
  saveECTHandlerDetails(event) {
    this.saveEctHandlerDetailRequest = this.addCustomerForm.getRawValue();
    this.saveEctHandlerDetailRequest.ectHandlerLocalDestination.forEach(element => {
      /*if (element.customerECTLocalDestinationId != null && element.flagCRUD != 'D') {
        //element.flagCRUD = 'U'
      }
      else if (element.customerECTLocalDestinationId == null && element.flagCRUD != 'D') {
        //element.flagCRUD = 'C'
      }*/
    });

    this.saveEctHandlerDetailInformation();


  }

  saveEctHandlerDetailInformation() {
    let request = this.addCustomerForm.getRawValue();
    this.adminService.onSaveEctDetails(request).subscribe(data => {

      if (!data.messageList) {

        this.showSuccessStatus('g.completed.successfully');
        this.addCustomerForm.get('ectHandlerLocalDestination').patchValue(data.data.ectHandlerLocalDestination);

      }
      else {
        this.showErrorStatus(NgcUtility.translateMessage(data.messageList[0].code, []));
        return;
      }
      this.refreshFormMessages(data);
      this.showPopUpWindow2.close();
    });

  }
  //-------------------------------------------------


  onClickTruckDetailsPopup(event) {
    const requestCustomerData: SearchCustomerMaster = new SearchCustomerMaster();
    requestCustomerData.customerID = this.customerIdData;
    requestCustomerData.customerCode = this.addCustomerForm.get('customerCode').value;
    requestCustomerData.customerShortName = this.addCustomerForm.get('customerShortName').value;
    requestCustomerData.uenNumber = this.addCustomerForm.get('uenNumber').value;
    requestCustomerData.iataAgentCode = this.addCustomerForm.get('iataAgentCode').value;
    requestCustomerData.adminLoginCode = this.addCustomerForm.get('adminLoginCode').value;
    requestCustomerData.chaNumber = this.addCustomerForm.get('chaNumber').value;
    requestCustomerData.chaNumberExpiry = this.addCustomerForm.get('chaNumberExpiry').value;
    requestCustomerData.panNumber = this.addCustomerForm.get('panNumber').value;
    this.onSearhofCustomerMaster(requestCustomerData);

    this.showPopUpWindow3.open();
  }
  addTruckDetailsRow(index, sindex) {
    (<NgcFormArray>this.addCustomerForm.get(['truckerCompanyDetails'])).addValue([
      {
        truckerCompany: '',
        customerTruckerCompanyId: null,
        effectiveDateFrom: null,
        effectiveDateTo: null,
        flagCRUD: 'C'
      }
    ]);
    console.clear();
  }
  onDeleteTruckDetailsRow(event, index: any): void {
    (<NgcFormArray>this.addCustomerForm.controls['truckerCompanyDetails']).markAsDeletedAt(event);
  }
  saveTruckDetails(event) {
    let dateCheck = 0;
    this.saveTruckerDetailRequest = this.addCustomerForm.getRawValue();
    this.saveTruckerDetailRequest.truckerCompanyDetails.forEach(element => {
      /*if (element.customerTruckerCompanyId != null && element.flagCRUD != 'D') {
        //element.flagCRUD = 'U'
      }
      else if (element.customerTruckerCompanyId == null && element.flagCRUD != 'D') {
        //element.flagCRUD = 'C'
      }*/
      if (element.flagCRUD == 'C' || element.flagCRUD == 'U') {
        if (element.effectiveDateFrom > element.effectiveDateTo) {
          dateCheck++;
        }


      }
    });
    if (dateCheck != 0) {
      this.showErrorStatus("admin.effectivedaterror");
      return;
    }

    this.saveTruckDetailInformation();


  }

  saveTruckDetailInformation() {
    let request = this.addCustomerForm.getRawValue();
    this.adminService.onSaveTruckDetails(request).subscribe(data => {

      if (!data.messageList) {

        this.showSuccessStatus('g.completed.successfully');
        this.addCustomerForm.get('truckerCompanyDetails').patchValue(data.data.truckerCompanyDetails);

      }
      else {
        this.showErrorStatus(NgcUtility.translateMessage(data.messageList[0].code, []));
        return;
      }
      this.refreshFormMessages(data);
      this.showPopUpWindow3.close();
    });


  }
  onSelectCityAdministrative(event) {
    this.addCustomerForm.get('administrativeOfficeCountryCode').setValue(event.parameter1);
    this.stateByCountry = this.createSourceParameter(
      event.parameter1
    );
  }
  onDisableEnableHaffaFlag(object) {
    let count = 0;
    for (let i = 0; i < object.length; i++) {
      if (object[i] == 'AGT' && NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_HaffaMember)) {
        count++;
        this.displayHaffaFlag = false;
      }
      if (this.displayHaffaFlag && count == 0) {
        console.log(this.addCustomerForm.get('haffaMember').value)
        this.addCustomerForm.get('haffaMember').patchValue(0);
        this.addCustomerForm.get('aisrsMember').patchValue(0);
      }
    }

  }


}
