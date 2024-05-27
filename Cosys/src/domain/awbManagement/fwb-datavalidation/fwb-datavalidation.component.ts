import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// NGC framework imports
import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormControl, NgcWindowComponent, NgcUtility, NgcFormArray, ReactiveModel } from 'ngc-framework';
import { AwbManagementService } from '../awbManagement.service';
import { SearchFwbDataValidationform } from '../awbManagement.shared';

@Component({
  selector: 'app-fwb-datavalidation',
  templateUrl: './fwb-datavalidation.component.html',
  styleUrls: ['./fwb-datavalidation.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
})

export class FwbDataValidationComponent extends NgcPage {
  /* successful response Flag */
  onSuccess: boolean = false;
  /*this variable is for storing FNA message data*/
  rejectMessage: any;
  /*windowFlag is the flag used in ngIf in pop up window*/
  windowFlag: boolean = false;
  /* checkuncheckall flag is used for selecting and unselecting all checkboxes */
  checkUncheckAll: boolean = false;
  /* rejectCodeDesc and rejectCodeEmail , rejectDescEmail will  stored rejectCode and rejectReason and sent to the backend for FMA/FNA and Email */
  rejectCodeDesc: any;
  rejectCodeEmail: any;
  rejectDescEmail: any;
  /* constructor for dependency injection */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private awbService: AwbManagementService, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }
  /*view child is the pop up message window for FNA message*/
  @ViewChild('messageWindow')
  /*messageWindow is the component for pop up window*/
  private messageWindow: NgcWindowComponent;
  /* This form is used for getting the respose */
  private fwbDataValidationSearchForm: NgcFormGroup = new NgcFormGroup({
    awbNumber: new NgcFormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
    rejectReason: new NgcFormControl()
  })
  /* This form is used for saving the respose */
  private fwbDataValidationForm: NgcFormGroup = new NgcFormGroup({
    awbPrefix: new NgcFormControl(),
    awbSuffix: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    origin: new NgcFormControl(),
    volumeUnitCode: new NgcFormControl(),
    shpCertificateSign: new NgcFormControl(),
    destination: new NgcFormControl(),
    volumeAmount: new NgcFormControl(),
    carriersExecutionDate: new NgcFormControl(),
    pieces: new NgcFormControl(),
    densityGroupCode: new NgcFormControl(),
    carriersExecutionPlace: new NgcFormControl(),
    weight: new NgcFormControl(),
    natureOfGoodsDescription: new NgcFormControl(),
    carriersExecutionAuthSign: new NgcFormControl(),
    weightUnitCode: new NgcFormControl(),
    customOrigin: new NgcFormControl(),
    shcode: new NgcFormArray([]),
    ardAgentReference: new NgcFormControl(),
    fwbPieces: new NgcFormControl(),
    fhlPieces: new NgcFormControl(),
    fwbWeight: new NgcFormControl(),
    fhlWeight: new NgcFormControl(),
    fwbDestination: new NgcFormControl(),
    rclDestination: new NgcFormControl(),
    issuingCarrier: new NgcFormControl(),
    raCode: new NgcFormControl(),
    fwbSlac: new NgcFormControl(),
    fhlSlac: new NgcFormControl(),
    rclPieces: new NgcFormControl(),
    rclWeight: new NgcFormControl(),
    postalCode: new NgcFormControl(),
    chargeableWeight: new NgcFormControl(),
    flightBooking: new NgcFormArray([]),
    routing: new NgcFormArray([]),
    shipperInfo: new NgcFormGroup({
      customerName: new NgcFormControl(),
      customerAccountNumber: new NgcFormControl(),
      customerAddressInfo: new NgcFormGroup({
        streetAddress1: new NgcFormControl(),
        customerPlace: new NgcFormControl(),
        postalCode: new NgcFormControl(),
        stateCode: new NgcFormControl(),
        countryCode: new NgcFormControl(),
        customerPlace1: new NgcFormControl(),
        postalCode1: new NgcFormControl(),
        stateCode1: new NgcFormControl(),
        countryCode1: new NgcFormControl(),
        customerContactInfo: new NgcFormArray([])
      }),
    }),
    consigneeInfo: new NgcFormGroup({
      customerName: new NgcFormControl(),
      customerAccountNumber: new NgcFormControl(),
      customerAddressInfo: new NgcFormGroup({
        streetAddress1: new NgcFormControl(),
        customerPlace: new NgcFormControl(),
        customerPlace1: new NgcFormControl(),
        postalCode: new NgcFormControl(),
        stateCode: new NgcFormControl(),
        countryCode: new NgcFormControl(),
        postalCode1: new NgcFormControl(),
        stateCode1: new NgcFormControl(),
        countryCode1: new NgcFormControl(),
        customerContactInfo: new NgcFormArray([])
      }),
    }),
    alsoNotify: new NgcFormGroup({
      customerName: new NgcFormControl(),
      customerAccountNumber: new NgcFormControl(),
      customerAddressInfo: new NgcFormGroup({
        streetAddress1: new NgcFormControl(),
        customerPlace: new NgcFormControl(),
        postalCode: new NgcFormControl(),
        stateCode: new NgcFormControl(),
        countryCode: new NgcFormControl(),
        customerPlace1: new NgcFormControl(),
        postalCode1: new NgcFormControl(),
        stateCode1: new NgcFormControl(),
        countryCode1: new NgcFormControl(),
        customerContactInfo: new NgcFormArray([])
      }),
    }),
    agentInfo: new NgcFormGroup({
      agentName: new NgcFormControl(),
      agentPlace: new NgcFormControl(),
      participantIdentifier: new NgcFormControl(),
      accountNumber: new NgcFormControl(),
      iatacargoAgentNumericCode: new NgcFormControl(),
      iatacargoAgentCASSAddress: new NgcFormControl(),
    }),
    chargeDeclaration: new NgcFormGroup({
      currencyCode: new NgcFormControl(),
      chargeCode: new NgcFormControl(),
      prepaIdCollectChargeDeclaration: new NgcFormControl(),
      carriageValueDeclaration: new NgcFormControl(),
      customsValueDeclaration: new NgcFormControl(),
      insuranceValueDeclaration: new NgcFormControl(),
    }),
    ssrInfo: new NgcFormArray([]),
    osiInfo: new NgcFormArray([]),
    accountingInfo: new NgcFormArray([]),
    rateDescription: new NgcFormArray([
      new NgcFormGroup({
        rateDescriptionOtherInfo: new NgcFormArray([])
      }),
    ]),
    otherCharges: new NgcFormArray([]),
    otherChargesCarrier: new NgcFormArray([]),
    ppd: new NgcFormGroup({
      totalWeightChargeAmount: new NgcFormControl(),
      totalOtherChargesDueAgentChargeAmount: new NgcFormControl(),
      totalOtherChargesDueCarrierChargeAmount: new NgcFormControl(),
      valuationChargeAmount: new NgcFormControl(),
      chargeSummaryTotalChargeAmount: new NgcFormControl(),
      taxesChargeAmount: new NgcFormControl()
    }),
    col: new NgcFormGroup({
      totalWeightChargeAmount: new NgcFormControl(),
      totalOtherChargesDueAgentChargeAmount: new NgcFormControl(),
      totalOtherChargesDueCarrierChargeAmount: new NgcFormControl(),
      valuationChargeAmount: new NgcFormControl(),
      chargeSummaryTotalChargeAmount: new NgcFormControl(),
      taxesChargeAmount: new NgcFormControl()
    }),
    fwbNominatedHandlingParty: new NgcFormGroup({
      handlingPartyName: new NgcFormControl(),
      handlingPartyPlace: new NgcFormControl()
    }),
    shipmentReferenceInfor: new NgcFormGroup({
      referenceNumber: new NgcFormControl(),
      supplementaryShipmentInformation1: new NgcFormControl(),
      supplementaryShipmentInformation2: new NgcFormControl()
    }),
    otherCustomsInfo: new NgcFormArray([]),
    chargeDestCurrency: new NgcFormGroup({
      destinationCurrencyCode: new NgcFormControl(),
      destinationCurrencyChargeAmount: new NgcFormControl(),
      chargesAtDestinationChargeAmount: new NgcFormControl(),
      totalCollectChargesChargeAmount: new NgcFormControl(),
      currencyConversionExchangeRate: new NgcFormControl()
    }),
    senderReference: new NgcFormGroup({
      airportCityCode: new NgcFormControl(),
      officeFunctionDesignator: new NgcFormControl(),
      companyDesignator: new NgcFormControl(),
      fileReference: new NgcFormControl(),
      refParticipantIdentifier: new NgcFormControl(),
      refParticipantCode: new NgcFormControl(),
      refAirportCityCode: new NgcFormControl(),
    }),
    otherParticipantInfo: new NgcFormArray([]),
  })
  /* This form is used for saving the respose */
  private messageForm = new NgcFormGroup({
    fnaMessage: new NgcFormControl('')
  })
  /* Oninit function */
  ngOnInit() {
    super.ngOnInit();
  }
  /* On search : called when search is clicked */
  onSearch() {
    this.resetFormMessages();
    let request: SearchFwbDataValidationform = this.fwbDataValidationSearchForm.getRawValue();
    // Check form valid or not and return
    this.fwbDataValidationSearchForm.validate();
    if (!this.fwbDataValidationSearchForm.valid) {
      return;
    }
    this.onSuccess = false;
    // this.awbService.getFwbDataValidationDetails(request).subscribe(response => {
    //   this.resetFormMessages();
    //   this.fwbDataValidationForm.reset();
    //   if (response.data != null) {
    //     this.onSuccess = true;
    //     this.fwbDataValidationForm.patchValue(response.data);
    //     for (const eachRow in this.myFlagResponse) {
    //       if (typeof (this.myFlagResponse[eachRow]) == 'boolean') {
    //         this.myFlagResponse[eachRow] = response.data[eachRow];
    //       }
    //     }
    //   }
    //   else {
    //     this.showErrorMessage('awb.no.fwb');
    //   }
    // }, (error: string) => {
    //   this.showErrorMessage('error');
    // }
    // );
  }

  /* Onsave : called to save the status of the checkboxes */
  onSave(event) {
    let request = this.myFlagResponse;
    request.awbNumber = this.fwbDataValidationSearchForm.get('awbNumber').value;
    // this.awbService.saveCheckBoxes(request).subscribe(data => {
    //   if (!this.showResponseErrorMessages(data)) {
    //     this.showSuccessStatus('g.completed.successfully');
    //     this.resetFormMessages();
    //     this.onSearch();
    //   }
    //   else {
    //     this.refreshFormMessages(data);
    //   }
    // }, error => {
    //   this.showErrorStatus(error);
    // });
  }
  /* checkUncheck : called for selecting and unselecting all checkboxes at a time*/
  checkUncheck(value) {
    this.checkUncheckAll = !this.checkUncheckAll
    for (const eachRow in this.myFlagResponse) {
      if (typeof (this.myFlagResponse[eachRow]) == 'boolean' || this.myFlagResponse[eachRow] == null) {
        this.myFlagResponse[eachRow] = this.checkUncheckAll ? true : false;
      }
    }
    this.resetFormMessages();
  }
  /* changeValue : called for changing the status all checkboxes when they are clicked*/
  changeValue(event, value) {
    for (const eachRow in this.myFlagResponse) {
      if (eachRow == value) {
        this.myFlagResponse[eachRow] = !event;
      }
    }
  }

  /*confirmRequest : called for FWB data validation confirmation*/
  confirmRequest() {
    const request = this.fwbDataValidationForm.getRawValue();
    request.confirmedBy = this.getUserProfile().userLoginCode;
    for (let index in this.myFlagResponse) {
      if (typeof (this.myFlagResponse[index]) == 'boolean' && !this.myFlagResponse[index]) {
        this.showErrorStatus('FWB.DataValidation.Confirm');
        return;
      }
    }
    this.resetFormMessages();
    // this.awbService.fwbConfirm(request).subscribe(data => {
    //   if (!this.showResponseErrorMessages(data)) {
    //     this.showSuccessStatus("g.completed.successfully");
    //   }
    // });
  }
  /*this function is used for closing the pop up window*/
  closeMessageWindow() {
    this.windowFlag = true;
    this.messageWindow.close();
  }
  /*this function is used for getting the rejectReason and error code for mail and FNA message*/
  getRejectReason(event) {
    let rejectCodeDesc = [];
    let rejectCodeEmail = [];
    let rejectDescEmail = [];
    event.forEach(rejectList => {
      if (rejectList.code != '%' && rejectList.desc != 'All') {
        rejectCodeDesc.push(rejectList.code + ' - ' + rejectList.desc);
        rejectCodeEmail.push(rejectList.code);
        rejectDescEmail.push(rejectList.desc);
      }
    });
    this.rejectCodeDesc = rejectCodeDesc;
    this.rejectCodeEmail = rejectCodeEmail;
    this.rejectDescEmail = rejectDescEmail;
  }
  /*rejectRequest : called for FWB data validation rejection*/
  rejectRequest() {
    const request = this.fwbDataValidationSearchForm.getRawValue();
    if (this.fwbDataValidationSearchForm.get('rejectReason').value == null || (<NgcFormArray>this.fwbDataValidationSearchForm.get(['rejectReason'])).value[0] == null) {
      this.showErrorStatus('FWB.DataValidation.Reject');
      return;
    }
    request.rejectCodeDesc = this.rejectCodeDesc;
    request.rejectReason = this.rejectDescEmail;
    this.resetFormMessages();
    // this.awbService.fwbReject(request).subscribe(data => {
    //   if (!this.showResponseErrorMessages(data)) {
    //     this.messageForm.get(['fnaMessage']).patchValue(data.data.message);
    //     this.rejectMessage = data.data.message
    //     this.showSuccessStatus("g.completed.successfully");
    //     this.windowFlag = true;
    //     this.messageWindow.open();
    //   }
    // });
  }
  /*this function is used for sending mail when we click on send button in the pop window*/
  sendEmail() {
    let request = this.fwbDataValidationForm.getRawValue();
    request.rejectedBy = this.getUserProfile().userLoginCode;
    request.rejectCode = this.rejectCodeEmail;
    request.rejectReason = this.rejectDescEmail;
    // this.awbService.fwbRejectAndSave(request).subscribe(data => {
    //   if (!this.showResponseErrorMessages(data)) {
    //     this.windowFlag = false;
    //     this.closeMessageWindow();
    //     this.showSuccessStatus("g.completed.successfully");
    //   }
    // });
  }
  /*myflagresponse object is used for two way databinding of checkboxes*/
  myFlagResponse = {
    awbNumber: null,
    validOrigin: false,
    validDestination: false,
    validShipperCustomerPlace: false,
    validShipperCountryCode: false,
    validShipperStateCode: false,
    validShipperPostalCode: false,
    validConsigneeCustomerPlace: false,
    validConsigneeCountryCode: false,
    validConsigneeStateCode: false,
    validConsigneePostalCode: false,
    validAlsoNotifyCustomerPlace: false,
    validAlsoNotifyCountryCode: false,
    validAlsoNotifyStateCode: false,
    validAlsoNotifyPostalCode: false,
    validSpecialHandlingCode: false,
    validSLAC: false,
    validChargeableWeight: false,
    validNatureOfGoods: false,
    validHarmonisedCommodityCode: false,
    validAccountingInformation: false,
    validOCI: false,
    validOSI: false,
    validHandlingInformation: false
  }

}


