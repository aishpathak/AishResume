
import { ShipperDeclaration } from './../import.sharedmodel';
import { filter } from 'rxjs/operators';

import { Subscription } from 'rxjs';
// NGC framework imports
import {
  NgcFormGroup,
  NgcFormArray,
  NgcApplication,
  NgcWindowComponent,
  NgcDropDownComponent,
  NgcButtonComponent, NgcInputComponent,
  NgcPage,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  PageConfiguration,
  NgcReportComponent,
  NgcLOVComponent,
  NgcUtility
} from "ngc-framework";

import {
  Component,
  NgZone,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ViewChild, HostListener, Input, Output, EventEmitter
} from "@angular/core";
import { NgcFormControl } from "ngc-framework";
import { ActivatedRoute, Router } from "@angular/router";
import { ImportService } from '../import.service';
import { FWBRequest, AwbRoutingReqModel, MaintainFwbRequest, MaintainFwbResponse } from './../import.shared';
import { FormsModule, Validators } from '@angular/forms';
// import { Validators } from "@angular/forms/src/forms";

@Component({
  selector: "app-maintainfwb",
  templateUrl: "./maintainfwb.component.html",
  styleUrls: ["./maintainfwb.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class MaintainfwbComponent extends NgcPage {
  private flightRoutingIcon: string = "";
  private shipperConsigneeIcon: string = "";
  private notifyAgentIcon: string = "";
  private ssrOsiIcon: string = "";
  private accountingInfoIcon: string = "";
  private rateDescIcon: string = "";
  private chargesPpdColIcon: string = "";
  private ardNomSrnIcon: string = "";
  private opiIcon: string = "";
  private ociIcon: string = "";
  private cdcIcon: string = "";
  private refIcon: string = "";
  showTable: boolean;
  enableSave: boolean = false;
  printFlag: boolean = false;
  focusOrigin: boolean = false;
  rateDescValue: boolean;
  showRtdDimension: boolean;
  showRtdVolume: boolean;
  showRtdGoodsDesc: boolean;
  showRtdULD: boolean;
  arrayUser: any;
  errors: any;
  resp: any;
  responseArray: any;
  currentFwbDetails: any;
  saveFlag = true;
  noOfFlightDetailsFilled = 0;
  noOfOtherChargesDetailsFilled = 0;
  noOfNOMHandlingPartyDetailsFilled = 0;
  noOfShipmentRefInfoDetailsFilled = 0;
  noOfOCIDetailsFilled = 0;
  noOfColDetailsCount = 0;
  noOfPpdDetailsCount = 0;
  ssi1: any;
  ssi2: any;
  hashTable = {};
  rtdoiHashTable = {};
  accInfoHashTable = {};
  othChargeHashTable = {};
  opiHashTable = {};
  otherCustomsHashTable = {};
  showwithoutrequired: boolean = true;
  showwithrequired: boolean = false;
  showwAccReq: boolean = false;
  showAccNotReq: boolean = true;
  showwithoutRefRequired: boolean = true;
  showwithRefRequired: boolean = false;
  showwithoutRefRequired1: boolean = true;
  showwithRefRequired1: boolean = false;
  showWithoutAgentRequired: boolean = true;
  showWithAgentRequired: boolean = false;
  flightCarrierCode: any;
  opiCount: any;
  accCount: any = true;
  oldpieces: any;
  oldweight: any;
  newPieces: any;
  newWeight: any;
  currentCharge: number;
  newCharge: number;
  totalCharge: any;
  sumOftotalCharge: number;
  sumOfChargeAmount: number = 0;
  private routingGroupParameter = {};
  charegeItems: any = { Amount: 0, ind: null };
  chargesArray = [];
  accLen: any;
  forwardedData: any;
  receivedManuallyFlag: boolean = true;
  shipperContactLength: any = 0;
  consigneeContactLength: any = 0;
  alsoNotiyConatctLength: any = 0;
  rtdDeletecount: number = 1;
  reportParameters: any = new Object();
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  transferData: any;
  constructor(appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private el: ElementRef

  ) {
    super(appZone, appElement, appContainerElement);
    this.focusOrigin = false;
  }
  @ViewChild('saveUpdateShipment') saveUpdateShipment: NgcWindowComponent;
  // @ViewChild('OVCDWindow') OVCDWindow: NgcWindowComponent;
  @Input('shipmentNumberData') shipmentNumberData: string;
  @Input('showAsPopup') showAsPopup: boolean;
  @Output() autoSearchShipmentInfo = new EventEmitter<boolean>();

  private maintainFWBForm: NgcFormGroup = new NgcFormGroup({

    maintainFWBSearch: new NgcFormGroup({
      awbNumber: new NgcFormControl(),
      awbDate: new NgcFormControl(),
      nonIATA: new NgcFormControl()
    }),

    awbPrefix: new NgcFormControl(),
    awbSuffix: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    awbDate: new NgcFormControl(),
    nonIATA: new NgcFormControl(),
    messageProcessedDate: new NgcFormControl(),
    origin: new NgcFormControl(),
    natureOfgoods: new NgcFormControl(),
    //ovcd
    ovcdReasonCode: new NgcFormControl(),
    ovcdUserId: new NgcFormControl(),
    destination: new NgcFormControl('', [Validators.maxLength(3)]),
    pieces: new NgcFormControl('', [Validators.maxLength(4)]),
    weightUnitCode: new NgcFormControl('K'),
    weight: new NgcFormControl(),
    volumeUnitCode: new NgcFormControl('MC'),
    volumeAmount: new NgcFormControl(),
    densityIndicator: new NgcFormControl('DG'),
    densityGroupCode: new NgcFormControl('', [Validators.maxLength(1)]),
    carriersExecutionDate: new NgcFormControl(),
    carriersExecutionPlace: new NgcFormControl('', [Validators.maxLength(17)]),
    carriersExecutionAuthSign: new NgcFormControl('', [Validators.maxLength(35)]),
    customOrigin: new NgcFormControl('', [Validators.maxLength(2)]),
    shpCertificateSign: new NgcFormControl('', [Validators.maxLength(35)]),
    messageSequence: new NgcFormControl(),
    messageVersion: new NgcFormControl(),
    natureOfGoodsDescription: new NgcFormControl('', [Validators.maxLength(20)]),
    messageStatus: new NgcFormControl(),
    isManifested: new NgcFormControl(),
    siiChargeAmount: new NgcFormControl(),
    cassIndicator: new NgcFormControl(),

    shcode: new NgcFormArray([]),
    flightBooking: new NgcFormArray([
      new NgcFormGroup({

        flightNumber: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        carrierCode: new NgcFormControl(),
      })
    ]),
    routing: new NgcFormArray([
      new NgcFormGroup({
        carrierCode: new NgcFormControl(),
        airportCode: new NgcFormControl(),
      }),
      new NgcFormGroup({
        carrierCode: new NgcFormControl(),
        airportCode: new NgcFormControl(),
      }),
      new NgcFormGroup({
        carrierCode: new NgcFormControl(),
        airportCode: new NgcFormControl(),
      }),
    ]),
    rateDescription: new NgcFormArray([
      new NgcFormGroup({
        rateLineNumber: new NgcFormControl(1),
        grossWeight: new NgcFormControl('', [Validators.maxLength(8)]),
        rateClassCode: new NgcFormControl('', [Validators.maxLength(1)]),
        commodityItemNo: new NgcFormControl('', [Validators.maxLength(7)]),
        chargeableWeight: new NgcFormControl(),
        rateChargeAmount: new NgcFormControl(),
        totalChargeAmount: new NgcFormControl(),
        numberOfPieces: new NgcFormControl('', [Validators.maxLength(4)]),
        weightUnitCode: new NgcFormControl('K', [Validators.maxLength(1)]),


        rateDescriptionOtherInfo: new NgcFormArray([
          new NgcFormGroup({

            rateLine: new NgcFormControl('NG'),
            natureOfGoodsDescription: new NgcFormControl('', [Validators.maxLength(20)]),
            measurementUnitCode: new NgcFormControl('CMT', [Validators.maxLength(3)]),
            dimensionLength: new NgcFormControl('', [Validators.maxLength(5)]),
            dimensionHeight: new NgcFormControl('', [Validators.maxLength(5)]),
            dimensionWIdth: new NgcFormControl('', [Validators.maxLength(5)]),
            numberOfPieces: new NgcFormControl('', [Validators.maxLength(4)]),
            weight: new NgcFormControl(null),
            volumeUnitCode: new NgcFormControl('MC', [Validators.maxLength(2)]),
            volumeAmount: new NgcFormControl(),
            uldNumber: new NgcFormControl('', [Validators.maxLength(11)]),
            harmonisedCommodityCode: new NgcFormControl('', [Validators.maxLength(18)]),
            slacCount: new NgcFormControl('', [Validators.maxLength(5)]),
            countryCode: new NgcFormControl(null),
            noDimensionAvailable: new NgcFormControl(false),
            serviceCode: new NgcFormControl('', [Validators.maxLength(1)]),


          })
        ]),

      }),]),

    agentInfo: new NgcFormGroup({

      accountNumber: new NgcFormControl(),
      iatacargoAgentNumericCode: new NgcFormControl(),
      iatacargoAgentCASSAddress: new NgcFormControl(),
      participantIdentifier: new NgcFormControl(),
      agentName: new NgcFormControl(),
      agentPlace: new NgcFormControl(),
    }),
    otherCharges: new NgcFormArray([
      new NgcFormGroup({

        otherChargeIndicator: new NgcFormControl('', [Validators.maxLength(1)]),
        otherChargeCode: new NgcFormControl('', [Validators.maxLength(2)]),
        entitlementCode: new NgcFormControl('', [Validators.maxLength(1)]),
        chargeAmount: new NgcFormControl(),
      })]),
    otherChargesCarrier: new NgcFormArray([
      new NgcFormGroup({

        otherChargeIndicator: new NgcFormControl('', [Validators.maxLength(1)]),
        otherChargeCode: new NgcFormControl('', [Validators.maxLength(2)]),
        entitlementCode: new NgcFormControl('', [Validators.maxLength(1)]),
        chargeAmount: new NgcFormControl(),
      })]),
    accountingInfo: new NgcFormArray([
      new NgcFormGroup({

        informationIdentifier: new NgcFormControl('', [Validators.maxLength(3)]),
        accountingInformation: new NgcFormControl('', [Validators.maxLength(34)]),
      })
    ]),
    // Temp start
    ssrInfo: new NgcFormArray([
      new NgcFormGroup({

        serviceRequestcontent: new NgcFormControl('', [Validators.maxLength(65)])
      }),
      new NgcFormGroup({

        serviceRequestcontent: new NgcFormControl('', [Validators.maxLength(65)])
      }),
      new NgcFormGroup({

        serviceRequestcontent: new NgcFormControl('', [Validators.maxLength(65)])
      })
    ]),
    osiInfo: new NgcFormArray([
      new NgcFormGroup({

        serviceRequestcontent: new NgcFormControl('', [Validators.maxLength(65)])
      }),
      new NgcFormGroup({

        serviceRequestcontent: new NgcFormControl('', [Validators.maxLength(65)])
      }),
      new NgcFormGroup({

        serviceRequestcontent: new NgcFormControl('', [Validators.maxLength(65)])
      })
    ]),
    // Temp
    shipmentReferenceInfor: new NgcFormGroup({


      referenceNumber: new NgcFormControl('', [Validators.maxLength(14)]),
      supplementaryShipmentInformation1: new NgcFormControl('', [Validators.maxLength(12)]),
      supplementaryShipmentInformation2: new NgcFormControl('', [Validators.maxLength(12)])
    }),
    col: new NgcFormGroup({


      chargeTypeLineIdentifier: new NgcFormControl(),
      valuationChargeAmount: new NgcFormControl(),
      totalWeightChargeAmount: new NgcFormControl(),
      taxesChargeAmount: new NgcFormControl(),
      totalOtherChargesDueAgentChargeAmount: new NgcFormControl(),
      totalOtherChargesDueCarrierChargeAmount: new NgcFormControl(),
      chargeSummaryTotalChargeAmount: new NgcFormControl(),
      totalWeightChargeIdentifier: new NgcFormControl(),
      valuationChargeIdentifier: new NgcFormControl(),
      taxesChargeIdentifier: new NgcFormControl(),
      totalOtherChargesDueAgentChargeIdentifier: new NgcFormControl(),
      totalOtherChargesDueCarrierChargeIdentifier: new NgcFormControl(),
      chargeSummaryTotalChargeIdentifier: new NgcFormControl(),
    }),
    ppd: new NgcFormGroup({


      chargeTypeLineIdentifier: new NgcFormControl(),
      valuationChargeAmount: new NgcFormControl(),
      totalWeightChargeAmount: new NgcFormControl(),
      taxesChargeAmount: new NgcFormControl(),
      totalOtherChargesDueAgentChargeAmount: new NgcFormControl(),
      totalOtherChargesDueCarrierChargeAmount: new NgcFormControl(),
      chargeSummaryTotalChargeAmount: new NgcFormControl(),
      totalWeightChargeIdentifier: new NgcFormControl(),
      valuationChargeIdentifier: new NgcFormControl(),
      taxesChargeIdentifier: new NgcFormControl(),
      totalOtherChargesDueAgentChargeIdentifier: new NgcFormControl(),
      totalOtherChargesDueCarrierChargeIdentifier: new NgcFormControl(),
      chargeSummaryTotalChargeIdentifier: new NgcFormControl(),
    }),
    otherParticipantInfo: new NgcFormArray([
      new NgcFormGroup({

        participantName: new NgcFormControl('', [Validators.maxLength(35)]),
        airportCityCode: new NgcFormControl('', [Validators.maxLength(3)]),
        officeFunctionDesignator: new NgcFormControl('', [Validators.maxLength(2)]),
        companyDesignator: new NgcFormControl('', [Validators.maxLength(2)]),
        fileReference: new NgcFormControl('', [Validators.maxLength(15)]),
        opiParticipantIdentifier: new NgcFormControl('', [Validators.maxLength(3)]),
        opiParticipantCode: new NgcFormControl('', [Validators.maxLength(17)]),
        opiAirportCityCode: new NgcFormControl('', [Validators.maxLength(3)]),

      })
    ]),

    senderReference: new NgcFormGroup({
      airportCityCode: new NgcFormControl('', [Validators.maxLength(3)]),
      officeFunctionDesignator: new NgcFormControl('', [Validators.maxLength(2)]),
      companyDesignator: new NgcFormControl('', [Validators.maxLength(2)]),
      fileReference: new NgcFormControl('', [Validators.maxLength(15)]),
      refParticipantIdentifier: new NgcFormControl('', [Validators.maxLength(3)]),
      refParticipantCode: new NgcFormControl('', [Validators.maxLength(17)]),
      refAirportCityCode: new NgcFormControl('', [Validators.maxLength(3)]),

    }),

    otherCustomsInfo: new NgcFormArray([
      new NgcFormGroup({

        informationIdentifier: new NgcFormControl('', [Validators.maxLength(3)]),
        csrciIdentifier: new NgcFormControl('', [Validators.maxLength(2)]),
        scrcInformation: new NgcFormControl('', [Validators.maxLength(35)]),
        countryCode: new NgcFormControl(null, [Validators.maxLength(2)]),

      })
    ]),
    chargeDestCurrency: new NgcFormGroup({


      destinationCurrencyCode: new NgcFormControl(),
      totalCollectChargesChargeAmount: new NgcFormControl(),
      chargesAtDestinationChargeAmount: new NgcFormControl(),
      destinationCurrencyChargeAmount: new NgcFormControl(),
      currencyConversionExchangeRate: new NgcFormControl(),
      destinationCountryCode: new NgcFormControl(),


    }),
    chargeDeclaration: new NgcFormGroup({

      currencyCode: new NgcFormControl(),
      chargeCode: new NgcFormControl(),
      fwbCarriageValueDeclaration: new NgcFormControl(),
      fwbCustomsValueDeclaration: new NgcFormControl(),
      fwbInsuranceValueDeclaration: new NgcFormControl(),
      prepaIdCollectChargeDeclaration: new NgcFormControl('', [Validators.maxLength(2)]),
      carriageValueDeclaration: new NgcFormControl('NVD', [Validators.maxLength(12)]),
      customsValueDeclaration: new NgcFormControl('NCV', [Validators.maxLength(12)]),
      insuranceValueDeclaration: new NgcFormControl('XXX', [Validators.maxLength(12)]),


    }),

    shipperInfo: new NgcFormGroup({

      customerName: new NgcFormControl('', [Validators.maxLength(70)]),
      customerAccountNumber: new NgcFormControl('', [Validators.maxLength(14)]),
      customerAddressInfo: new NgcFormGroup({

        streetAddress1: new NgcFormControl('', [Validators.maxLength(70)]),
        customerPlace: new NgcFormControl('', [Validators.maxLength(17)]),
        postalCode: new NgcFormControl('', [Validators.maxLength(9)]),
        stateCode: new NgcFormControl('', [Validators.maxLength(9)]),
        countryCode: new NgcFormControl(),
        customerContactInfo: new NgcFormArray([
          new NgcFormGroup({
            contactIdentifier: new NgcFormControl(),
            contactDetail: new NgcFormControl('', [Validators.maxLength(25)]),
          })
        ])
      }),
    }),
    alsoNotify: new NgcFormGroup({
      customerName: new NgcFormControl('', [Validators.maxLength(70)]),
      customerAddressInfo: new NgcFormGroup({
        streetAddress1: new NgcFormControl('', [Validators.maxLength(70)]),
        customerPlace: new NgcFormControl('', [Validators.maxLength(17)]),
        postalCode: new NgcFormControl('', [Validators.maxLength(9)]),
        stateCode: new NgcFormControl('', [Validators.maxLength(9)]),
        countryCode: new NgcFormControl('', [Validators.maxLength(2)]),
        customerContactInfo: new NgcFormArray([
          new NgcFormGroup({
            contactIdentifier: new NgcFormControl(),
            contactDetail: new NgcFormControl('', [Validators.maxLength(25)]),
          })
        ])
      }),
    }),

    fwbNominatedHandlingParty: new NgcFormGroup({

      handlingPartyName: new NgcFormControl('', [Validators.maxLength(35)]),
      handlingPartyPlace: new NgcFormControl('', [Validators.maxLength(17)]),
    }),

    consigneeInfo: new NgcFormGroup({

      customerName: new NgcFormControl('', [Validators.maxLength(70)]),
      customerAccountNumber: new NgcFormControl('', [Validators.maxLength(14)]),
      flag: new NgcFormControl(),
      customerAddressInfo: new NgcFormGroup({

        streetAddress1: new NgcFormControl('', [Validators.maxLength(70)]),
        customerPlace: new NgcFormControl('', [Validators.maxLength(17)]),
        postalCode: new NgcFormControl('', [Validators.maxLength(9)]),
        stateCode: new NgcFormControl('', [Validators.maxLength(9)]),
        countryCode: new NgcFormControl(),
        customerContactInfo: new NgcFormArray([
          new NgcFormGroup({

            contactIdentifier: new NgcFormControl(),
            contactDetail: new NgcFormControl('', [Validators.maxLength(25)]),
          })
        ])
      }),
    }),
    ardAgentReference: new NgcFormControl('', [Validators.maxLength(15)]),
  })
  // });
  searchSuccessful = false;

  ngOnInit() {
    super.ngOnInit();
    this.accLen = 0;

    this.forwardedData = this.getNavigateData(this.activatedRoute);

    if (this.forwardedData) {
      this.maintainFWBForm.get('maintainFWBSearch.awbNumber').setValue(this.forwardedData.awbNumber);
      this.onSearch();
    }
    if (this.forwardedData && this.forwardedData.length == 11) {
      this.maintainFWBForm.get('maintainFWBSearch.awbNumber').setValue(this.forwardedData);
      this.onSearch();
    }

    if (this.shipmentNumberData) {
      this.maintainFWBForm.get('maintainFWBSearch.awbNumber').patchValue(this.shipmentNumberData);
      this.onSearch();
    }

    console.log('contact info' + this.maintainFWBForm.get('shipperInfo.customerAddressInfo.customerContactInfo').value);
    //this.ppdColTotal();
    this.ppdAdd();
    this.colAdd();
    this.cdcTotal();
    this.onChangeNatureOfgoods();
    this.onChangeRateDiscriptionNog();
    this.onChangeChargeDeclaration();
    this.onChageRouting();
    this.onChangeAccountingInfo();
    this.onChageOtherCharge();
    this.onChangeOtherChargesByCarrier();
    this.onChangeOtherCustomerInfo();
    this.onChangeFlightBooking();
    this.onChangeRateDiscription();
    this.onChangeOtherParticipantInfo();

    this.maintainFWBForm.get('shipmentReferenceInfor').get('supplementaryShipmentInformation1').valueChanges.subscribe(data => {
      data ? this.ssi1 = true : this.ssi1 = false;
      if (this.ssi1 && this.ssi2) {
      }
    });

    this.maintainFWBForm.get('shipmentReferenceInfor').get('supplementaryShipmentInformation2').valueChanges.subscribe(data => {
      data ? this.ssi2 = true : this.ssi2 = false;
    });
  }


  protected afterFocus() {
    if (!this.focusOrigin) {
      this.async(() => {
        try {
          (this.maintainFWBForm.get('origin') as NgcFormControl).focus();
          this.focusOrigin = true;
        } catch (e) { }
      }, 100);
    }
  }

  onChangeNatureOfgoods() {
    this.maintainFWBForm.get('natureOfgoods').valueChanges.subscribe(val => {
      (this.maintainFWBForm.get(["rateDescription", 0, "rateDescriptionOtherInfo", 0, 'natureOfGoodsDescription']) as NgcFormControl).setValue(this.maintainFWBForm.get('natureOfgoods').value, { onlySelf: true, emitEvent: false });
      this.maintainFWBForm.get('natureOfGoodsDescription').setValue(this.maintainFWBForm.get('natureOfgoods').value, { onlySelf: true, emitEvent: false });
    });
  }

  onChangeRateDiscriptionNog() {
    let fo = (this.maintainFWBForm.get(["rateDescription", 0, "rateDescriptionOtherInfo"]) as NgcFormArray)
    fo.valueChanges.subscribe(val => {
      fo.controls.forEach((data: NgcFormGroup, index) => {
        let dat = data.get('natureOfGoodsDescription').value;
        if (dat) {
          this.maintainFWBForm.get('natureOfgoods').patchValue(dat, { onlySelf: true, emitEvent: false });
          this.maintainFWBForm.get('natureOfGoodsDescription').setValue(dat, { onlySelf: true, emitEvent: false });
        }
      })
    })
  }

  onChangeChargeDeclaration() {
    this.maintainFWBForm.get('chargeDeclaration.prepaIdCollectChargeDeclaration').valueChanges.subscribe(val => {
      if (this.maintainFWBForm.get('chargeDeclaration.prepaIdCollectChargeDeclaration').value === 'PP') {
        if (this.sumOftotalCharge) {
          this.maintainFWBForm.get('ppd.totalWeightChargeAmount').patchValue(this.sumOftotalCharge, { onlySelf: true, emitEvent: false });
          this.maintainFWBForm.get('col.totalWeightChargeAmount').setValue(0);
        }

      } else {
        if (this.sumOftotalCharge) {
          this.maintainFWBForm.get('col.totalWeightChargeAmount').patchValue(this.sumOftotalCharge, { onlySelf: true, emitEvent: false });
          this.maintainFWBForm.get('ppd.totalWeightChargeAmount').setValue(0);
        }

      }
      //this.ppdColTotal();
      this.ppdAdd();
      this.colAdd();

    });
  }
  onChageRouting() {
    for (let i = 0; i < (this.maintainFWBForm.get(['routing']) as NgcFormArray).length; i++) {
      this.maintainFWBForm.get(['routing', i, 'airportCode']).valueChanges.subscribe(a => {

        if ((i == 0 && (this.maintainFWBForm.get(['routing', i, 'carrierCode']).value !== null)
          && this.maintainFWBForm.get(['routing', i, 'carrierCode']).value.length > 0)) {
          this.maintainFWBForm.get(['routing', i, 'carrierCode']).setValidators([Validators.required, Validators.maxLength(3)]);
          this.maintainFWBForm.get(['routing', i, 'airportCode']).setValidators([]);
        }

        if (i > 0) {
          if (((this.maintainFWBForm.get(['routing', i, 'airportCode']).value !== null)
            && this.maintainFWBForm.get(['routing', i, 'airportCode']).value.length > 0)) {
            this.maintainFWBForm.get(['routing', i, 'airportCode']).setValidators([Validators.required, Validators.maxLength(3)]);
          }
          else {
            this.maintainFWBForm.get(['routing', i, 'airportCode']).clearValidators();

          }
        }
      });

    }
  }
  onChangeAccountingInfo() {
    (this.maintainFWBForm.get(['accountingInfo']) as NgcFormArray).valueChanges.subscribe(() => {
      (this.maintainFWBForm.get(['accountingInfo']) as NgcFormArray).controls.forEach((formGroup1: NgcFormGroup) => {
        const informationIdentifier1: string = formGroup1.get('informationIdentifier').value;
        const accountingInformation1: string = formGroup1.get('accountingInformation').value;
        if ((informationIdentifier1) || (accountingInformation1)) {
          formGroup1.get('informationIdentifier').setValidators([Validators.required, Validators.maxLength(3)]);
          formGroup1.get('accountingInformation').setValidators([Validators.required, Validators.maxLength(34)]);
        } else {
          formGroup1.get('informationIdentifier').clearValidators();
          formGroup1.get('accountingInformation').clearValidators();
        }
      });
    });
  }
  onChageOtherCharge() {
    (this.maintainFWBForm.get(['otherCharges']) as NgcFormArray).valueChanges.subscribe(() => {
      (this.maintainFWBForm.get(['otherCharges']) as NgcFormArray).controls.forEach((formGroup1: NgcFormGroup) => {
        const otherChargeIndicator1: string = formGroup1.get('otherChargeIndicator').value;
        const otherChargeCode1: string = formGroup1.get('otherChargeCode').value;
        const entitlementCode1: any = formGroup1.get('entitlementCode').value;
        const chargeAmount1: any = formGroup1.get('chargeAmount').value;
        if ((otherChargeIndicator1) || (otherChargeCode1) || (entitlementCode1) || (chargeAmount1)) {
          formGroup1.get('otherChargeIndicator').setValidators([Validators.required, Validators.maxLength(1)]);
          formGroup1.get('otherChargeCode').setValidators([Validators.required, Validators.maxLength(2)]);
          formGroup1.get('chargeAmount').setValidators([Validators.required]);
        } else {
          formGroup1.get('otherChargeIndicator').clearValidators();
          formGroup1.get('otherChargeCode').clearValidators();
          formGroup1.get('chargeAmount').clearValidators();
        }
      });
    });
  }
  onChangeOtherChargesByCarrier() {
    (this.maintainFWBForm.get(['otherChargesCarrier']) as NgcFormArray).valueChanges.subscribe(() => {
      (this.maintainFWBForm.get(['otherChargesCarrier']) as NgcFormArray).controls.forEach((formGroup1: NgcFormGroup) => {
        const otherChargeIndicator1: string = formGroup1.get('otherChargeIndicator').value;
        const otherChargeCode1: string = formGroup1.get('otherChargeCode').value;
        const chargeAmount1: any = formGroup1.get('chargeAmount').value;
        if ((otherChargeIndicator1) || (otherChargeCode1) || (chargeAmount1)) {
          formGroup1.get('otherChargeIndicator').setValidators([Validators.required, Validators.maxLength(1)]);
          formGroup1.get('otherChargeCode').setValidators([Validators.required, Validators.maxLength(2)]);
          formGroup1.get('chargeAmount').setValidators([Validators.required]);
        } else {
          formGroup1.get('otherChargeIndicator').clearValidators();
          formGroup1.get('otherChargeCode').clearValidators();
          formGroup1.get('chargeAmount').clearValidators();
        }
      });
    });
  }
  onChangeOtherCustomerInfo() {
    //oci validation
    (this.maintainFWBForm.get(['otherCustomsInfo']) as NgcFormArray).valueChanges.subscribe(() => {
      (this.maintainFWBForm.get(['otherCustomsInfo']) as NgcFormArray).controls.forEach((formGroup1: NgcFormGroup) => {
        const countryCode1: string = formGroup1.get('countryCode').value;
        const informationIdentifier1: string = formGroup1.get('informationIdentifier').value;
        const csrciIdentifier1: any = formGroup1.get('csrciIdentifier').value;
        const scrcInformation1: any = formGroup1.get('scrcInformation').value;
        if ((countryCode1) || (informationIdentifier1) || (csrciIdentifier1) || (scrcInformation1)) {

          formGroup1.get('countryCode').setValidators([Validators.required, Validators.maxLength(2)]);
          formGroup1.get('scrcInformation').setValidators([Validators.required, Validators.maxLength(35)]);
          formGroup1.get('informationIdentifier').setValidators([Validators.required, Validators.maxLength(3)]);
          formGroup1.get('csrciIdentifier').setValidators([Validators.required, Validators.maxLength(2)]);

        } else {
          formGroup1.get('countryCode').clearValidators();
          formGroup1.get('scrcInformation').clearValidators();
          formGroup1.get('informationIdentifier').clearValidators();
          formGroup1.get('csrciIdentifier').clearValidators();

        }
      });
    });
  }
  onChangeFlightBooking() {
    (this.maintainFWBForm.get(['flightBooking']) as NgcFormArray).valueChanges.subscribe(() => {
      (this.maintainFWBForm.get(['flightBooking']) as NgcFormArray).controls.forEach((formGroup1: NgcFormGroup) => {
        const carrierCode1: string = formGroup1.get('carrierCode').value;
        const flightNumber1: string = formGroup1.get('flightNumber').value;
        const flightDate1: any = formGroup1.get('flightDate').value;

        if ((flightDate1) || (flightNumber1) || (carrierCode1)) {

          formGroup1.get('carrierCode').setValidators([Validators.required, Validators.maxLength(3)]);
          formGroup1.get('flightDate').setValidators([Validators.required]);
          formGroup1.get('flightNumber').setValidators([Validators.required, Validators.maxLength(5)]);
          if (flightDate1 != null && flightNumber1 != null && carrierCode1 != null)
            this.onCompanyLOVSelect(formGroup1);
        } else {
          formGroup1.get('carrierCode').clearValidators();
          formGroup1.get('flightDate').clearValidators();
          formGroup1.get('flightNumber').clearValidators();

        }

      });
    });
  }
  onChangeRateDiscription() {
    (this.maintainFWBForm.get('rateDescription') as NgcFormArray).valueChanges.subscribe(() => {
      (this.maintainFWBForm.get('rateDescription') as NgcFormArray).controls.forEach((formGroup: NgcFormGroup) => {
        (formGroup.get('rateDescriptionOtherInfo') as NgcFormArray).controls.forEach((formGroup1: NgcFormGroup) => {
          const carrierCode1: string = formGroup1.get('noDimensionAvailable').value;
          if (formGroup1.get('rateLine').value == 'ND') {
            if (!carrierCode1) {
              formGroup1.get('measurementUnitCode').setValidators([Validators.required]);
              formGroup1.get('dimensionLength').setValidators([Validators.required]);
              formGroup1.get('dimensionWIdth').setValidators([Validators.required]);
              formGroup1.get('dimensionHeight').setValidators([Validators.required]);
              formGroup1.get('numberOfPieces').setValidators([Validators.required]);
            } else {
              formGroup1.get('measurementUnitCode').clearValidators();
              formGroup1.get('dimensionLength').clearValidators();
              formGroup1.get('dimensionWIdth').clearValidators();
              formGroup1.get('dimensionHeight').clearValidators();
              formGroup1.get('numberOfPieces').clearValidators();
            }
          }
        });
      });
    });
  }
  onChangeOtherParticipantInfo() {

    (this.maintainFWBForm.get(['otherParticipantInfo']) as NgcFormArray).valueChanges.subscribe(() => {
      (this.maintainFWBForm.get(['otherParticipantInfo']) as NgcFormArray).controls.forEach((formGroup: NgcFormGroup) => {
        const airportCityCode: string = formGroup.get('airportCityCode').value;
        //
        if (airportCityCode) {

          formGroup.get('airportCityCode').setValidators([Validators.required, Validators.maxLength(3)]);
          formGroup.get('officeFunctionDesignator').setValidators([Validators.required, Validators.maxLength(2)]);
          formGroup.get('companyDesignator').setValidators([Validators.required, Validators.maxLength(2)]);
        }
        const officeFunctionDesignator: string = formGroup.get('officeFunctionDesignator').value;
        if (officeFunctionDesignator) {
          formGroup.get('airportCityCode').setValidators([Validators.required, Validators.maxLength(3)]);
          formGroup.get('officeFunctionDesignator').setValidators([Validators.required, Validators.maxLength(2)]);
          formGroup.get('companyDesignator').setValidators([Validators.required, Validators.maxLength(2)]);
        }
        const companyDesignator: string = formGroup.get('companyDesignator').value;
        if (companyDesignator) {
          formGroup.get('airportCityCode').setValidators([Validators.required, Validators.maxLength(3)]);
          formGroup.get('officeFunctionDesignator').setValidators([Validators.required, Validators.maxLength(2)]);
          formGroup.get('companyDesignator').setValidators([Validators.required, Validators.maxLength(2)]);
        }

        const opiParticipantIdentifier: string = formGroup.get('opiParticipantIdentifier').value;
        if (opiParticipantIdentifier) {
          formGroup.get('opiParticipantIdentifier').setValidators([Validators.required, Validators.maxLength(3)]);
          formGroup.get('opiParticipantCode').setValidators([Validators.required, Validators.maxLength(17)]);
          formGroup.get('opiAirportCityCode').setValidators([Validators.required, Validators.maxLength(3)]);
        }
        const opiParticipantCode: string = formGroup.get('opiParticipantCode').value;
        if (opiParticipantCode) {
          formGroup.get('opiParticipantIdentifier').setValidators([Validators.required, Validators.maxLength(3)]);
          formGroup.get('opiParticipantCode').setValidators([Validators.required, Validators.maxLength(17)]);
          formGroup.get('opiAirportCityCode').setValidators([Validators.required, Validators.maxLength(3)]);
        }
        const opiAirportCityCode: string = formGroup.get('opiAirportCityCode').value;
        if (opiAirportCityCode) {
          formGroup.get('opiParticipantIdentifier').setValidators([Validators.required, Validators.maxLength(3)]);
          formGroup.get('opiParticipantCode').setValidators([Validators.required, Validators.maxLength(17)]);
          formGroup.get('opiAirportCityCode').setValidators([Validators.required, Validators.maxLength(3)]);
        }
      });
    });


    for (let i = 0; i < (this.maintainFWBForm.get(['otherParticipantInfo']) as NgcFormArray).length; i++) {
      this.maintainFWBForm.get(['otherParticipantInfo', i, 'airportCityCode']).valueChanges.subscribe(a => {
        this.maintainFWBForm.get(['otherParticipantInfo', i, 'airportCityCode']).setValidators([Validators.required]);
        this.maintainFWBForm.get(['otherParticipantInfo', i, 'officeFunctionDesignator']).setValidators([Validators.required]);
        this.maintainFWBForm.get(['otherParticipantInfo', i, 'companyDesignator']).setValidators([Validators.required]);
      });
      this.maintainFWBForm.get(['otherParticipantInfo', i, 'officeFunctionDesignator']).valueChanges.subscribe(a => {
        this.maintainFWBForm.get(['otherParticipantInfo', i, 'airportCityCode']).setValidators([Validators.required]);
        this.maintainFWBForm.get(['otherParticipantInfo', i, 'officeFunctionDesignator']).setValidators([Validators.required]);
        this.maintainFWBForm.get(['otherParticipantInfo', i, 'companyDesignator']).setValidators([Validators.required]);
      });
      this.maintainFWBForm.get(['otherParticipantInfo', i, 'companyDesignator']).valueChanges.subscribe(a => {
        this.maintainFWBForm.get(['otherParticipantInfo', i, 'airportCityCode']).setValidators([Validators.required]);
        this.maintainFWBForm.get(['otherParticipantInfo', i, 'officeFunctionDesignator']).setValidators([Validators.required]);
        this.maintainFWBForm.get(['otherParticipantInfo', i, 'companyDesignator']).setValidators([Validators.required]);
      });
    }

  }


  addNewRowForRateDescription(event) {
    if ((<NgcFormArray>this.maintainFWBForm.get("rateDescription")).length > 9) {
      this.showInfoStatus("import.info120");
      return;
    }
    let ratelineNumber = 1;
    if ((<NgcFormArray>this.maintainFWBForm.get("rateDescription")).length > 0) {
      let size = (<NgcFormArray>this.maintainFWBForm.get("rateDescription")).length - 1;
      let currentRate = Number(this.maintainFWBForm.get(["rateDescription", size, "rateLineNumber"]).value);
      ratelineNumber = currentRate ? currentRate + 1 : 1;
    }

    (<NgcFormArray>this.maintainFWBForm.get("rateDescription")).addValue([
      {

        rateLineNumber: (<NgcFormArray>this.maintainFWBForm.get("rateDescription")).length + 1,
        "grossWeight": "",
        "rateClassCode": "",
        "commodityItemNo": "",
        "chargeableWeight": null,
        "rateChargeAmount": null,
        "totalChargeAmount": null,
        "numberOfPieces": "",
        "weightUnitCode": "K",

        "rateDescriptionOtherInfo": [
          {
            "natureOfGoodsDescription": "",
            "measurementUnitCode": "",
            "dimensionLength": "",
            "dimensionHeight": "",
            "dimensionWIdth": "",
            "numberOfPieces": "",
            "weight": null,
            "volumeUnitCode": "",
            "volumeAmount": null,
            "uldNumber": "",
            "harmonisedCommodityCode": "",
            "slacCount": "",
            "countryCode": "",
            "serviceCode": "",
            "rateLine": ""

          }
        ]
      }
    ]);
    let i = (<NgcFormArray>this.maintainFWBForm.get("rateDescription")).length - 1;
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescription', i, 'grossWeight'])).setValidators([Validators.maxLength(8)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescription', i, 'rateClassCode'])).setValidators([Validators.maxLength(1)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescription', i, 'commodityItemNo'])).setValidators([Validators.maxLength(8)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescription', i, 'type'])).setValidators([Validators.maxLength(20)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescription', i, 'numberOfPieces'])).setValidators([Validators.maxLength(4)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescription', i, 'weightUnitCode'])).setValidators([Validators.maxLength(1)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescription', i, 'chargeableWeight'])).setValidators([Validators.maxLength(4)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescription', i, 'rateChargeAmount'])).setValidators([Validators.maxLength(1)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescription', i, 'totalChargeAmount'])).setValidators([Validators.maxLength(1)]);



  }
  onAddType(event) {
    console.log(this.maintainFWBForm.getRawValue());

    (<NgcFormArray>this.maintainFWBForm.get("shipperInfo.customerAddressInfo.customerContactInfo")).addValue([
      {
        contactIdentifier: "",
        contactDetail: ""
      }
    ]);
  }



  onAddContact(event) {

    let contactInfo = <NgcFormArray>this.maintainFWBForm.get("shipperInfo.customerAddressInfo.customerContactInfo");

    this.shipperContactLength = contactInfo.length + 1;
    if (contactInfo.length < 3) {
      (<NgcFormArray>this.maintainFWBForm.get("shipperInfo.customerAddressInfo.customerContactInfo")).addValue([
        {
          contactIdentifier: "",
          contactDetail: ""
        }
      ]);
    }
  }

  onAddConsigneeContact(event) {

    let contactInfo = <NgcFormArray>this.maintainFWBForm.get("consigneeInfo.customerAddressInfo.customerContactInfo");

    this.consigneeContactLength = contactInfo.length + 1;
    if (contactInfo.length < 3) {
      (<NgcFormArray>this.maintainFWBForm.get("consigneeInfo.customerAddressInfo.customerContactInfo")).addValue([
        {
          contactIdentifier: "",
          contactDetail: ""
        }
      ]);
    }
  }

  onAddAlsoContact(event) {

    let contactInfo = <NgcFormArray>this.maintainFWBForm.get("alsoNotify.customerAddressInfo.customerContactInfo");
    this.alsoNotiyConatctLength = contactInfo.length + 1;

    if (contactInfo.length < 3) {
      (<NgcFormArray>this.maintainFWBForm.get("alsoNotify.customerAddressInfo.customerContactInfo")).addValue([
        {
          contactIdentifier: "",
          contactDetail: ""
        }
      ]);
    }
  }

  addNewText(event) {
    this.accLen = (<NgcFormArray>this.maintainFWBForm.get("accountingInfo")).length
    if (this.accLen <= 4) {
      this.accCount = true;
    }
    if (this.accLen >= 5) {
      this.accCount = false;
    }
    let indArr = (<NgcFormArray>this.maintainFWBForm.get("accountingInfo")).length - 1;
    if (this.accLen === 6 && ((<NgcFormControl>this.maintainFWBForm.get(['accountingInfo', indArr, 'informationIdentifier'])).value != ""
      || (<NgcFormControl>this.maintainFWBForm.get(['accountingInfo', indArr, 'accountingInformation'])).value != "")) {
      return;
    }

    if ((<NgcFormControl>this.maintainFWBForm.get(['accountingInfo', indArr, 'informationIdentifier'])).value != ""
      || (<NgcFormControl>this.maintainFWBForm.get(['accountingInfo', indArr, 'accountingInformation'])).value != "") {
      (<NgcFormArray>this.maintainFWBForm.get("accountingInfo")).addValue([
        {
          informationIdentifier: "",
          accountingInformation: "",

        }
      ]);
      if ((<NgcFormControl>this.maintainFWBForm.get(['accountingInfo', indArr, 'informationIdentifier'])).value === null
        || (<NgcFormControl>this.maintainFWBForm.get(['accountingInfo', indArr, 'accountingInformation'])).value == null) {
        return;
      }
      let i = (<NgcFormArray>this.maintainFWBForm.get("accountingInfo")).length - 1;
      (<NgcFormControl>this.maintainFWBForm.get(['accountingInfo', i, 'informationIdentifier'])).setValidators([Validators.maxLength(3)]);
      (<NgcFormControl>this.maintainFWBForm.get(['accountingInfo', i, 'accountingInformation'])).setValidators([Validators.maxLength(34)]);
    }
  }

  onDeleteAccountInfo(event, index) {
    //(this.maintainFWBForm.get(["rateDescription", "rateDescriptionOtherInfo", index]) as NgcFormGroup).markAsDeleted();
    (this.maintainFWBForm.get(["accountingInfo", index]) as NgcFormGroup).markAsDeleted();
    this.accCount = true;
    this.accLen--;
  }
  // onDeleteFightBooking(event, index) {
  //   (this.maintainFWBForm.get(["flightBooking", index]) as NgcFormGroup).markAsDeleted();
  // }


  onDeleteRateDesc(event, index) {
    let val = (this.maintainFWBForm.get(["rateDescription", index]) as NgcFormGroup).get('totalChargeAmount').value;
    if (this.sumOftotalCharge > 0 && val > 0) {
      this.sumOftotalCharge = Number(this.sumOftotalCharge) - Number(val);
    }
    this.maintainFWBForm.get('ppd.totalWeightChargeAmount').patchValue(this.sumOftotalCharge);
    this.maintainFWBForm.get('col.totalWeightChargeAmount').setValue(0);

    this.maintainFWBForm.get('col.totalWeightChargeAmount').patchValue(this.sumOftotalCharge);
    this.maintainFWBForm.get('ppd.totalWeightChargeAmount').setValue(0);
    let rateDescriptionCount = (<NgcFormArray>this.maintainFWBForm.get("rateDescription")).length;
    if (rateDescriptionCount != this.rtdDeletecount) {
      this.rtdDeletecount++;
      (this.maintainFWBForm.get(["rateDescription", index]) as NgcFormGroup).markAsDeleted();
    }
  }

  onDeleteOtherCharges(event, index) {
    let item = (this.maintainFWBForm.get(["otherCharges", index]) as NgcFormGroup);
    if (item.get('otherChargeIndicator').value && item.get('otherChargeIndicator').value === 'C') {
      this.maintainFWBForm.get('col.totalOtherChargesDueAgentChargeAmount').patchValue(0);
    }
    else if (item.get('otherChargeIndicator').value && item.get('otherChargeIndicator').value === 'P') {
      this.maintainFWBForm.get('ppd.totalOtherChargesDueAgentChargeAmount').patchValue(0);
    }
    //this.ppdColTotal();
    this.ppdAdd();
    this.colAdd();
    (this.maintainFWBForm.get(["otherCharges", index, 'chargeAmount']).setValue(0));
    (this.maintainFWBForm.get(["otherCharges", index]) as NgcFormGroup).markAsDeleted();
    this.OncalculateTotalChargeAmount(event, item);

  }

  onDeleteOtherChargesCarrier(event, index) {
    let item = (this.maintainFWBForm.get(["otherChargesCarrier", index]) as NgcFormGroup);
    if (item.get('otherChargeIndicator').value && item.get('otherChargeIndicator').value === 'P') {
      this.maintainFWBForm.get('ppd.totalOtherChargesDueCarrierChargeAmount').patchValue(0);
    }
    else if (item.get('otherChargeIndicator').value && item.get('otherChargeIndicator').value === 'C') {
      this.maintainFWBForm.get('col.totalOtherChargesDueCarrierChargeAmount').patchValue(0);
    }
    //this.ppdColTotal();
    this.ppdAdd();
    this.colAdd();
    (this.maintainFWBForm.get(["otherChargesCarrier", index, 'chargeAmount']).setValue(0));
    (this.maintainFWBForm.get(["otherChargesCarrier", index]) as NgcFormGroup).markAsDeleted();
    this.OncalculateTotalChargeAmount(event, item);
  }


  onDeleteRateDescOtherInfo(index, sindex) {
    (this.maintainFWBForm.get(["rateDescription", index, "rateDescriptionOtherInfo", sindex]) as NgcFormGroup).markAsDeleted();
  }


  onAddFlightBooking(event) {
    if ((<NgcFormArray>this.maintainFWBForm.get(["flightBooking"])).length > 1) {
      this.showInfoStatus("import.info120");
      return;
    }
    let indArr1 = (<NgcFormArray>this.maintainFWBForm.get("flightBooking")).length - 1;
    if (indArr1 != -1 && ((<NgcFormControl>this.maintainFWBForm.get(['flightBooking', indArr1, 'flightNumber'])).value != ""
      && (<NgcFormControl>this.maintainFWBForm.get(['flightBooking', indArr1, 'flightNumber'])).value != null
      || (<NgcFormControl>this.maintainFWBForm.get(['flightBooking', indArr1, 'flightDate'])).value != ""
      && (<NgcFormControl>this.maintainFWBForm.get(['flightBooking', indArr1, 'flightDate'])).value != null
      || (<NgcFormControl>this.maintainFWBForm.get(['flightBooking', indArr1, 'carrierCode'])).value != ""
      && (<NgcFormControl>this.maintainFWBForm.get(['flightBooking', indArr1, 'carrierCode'])).value != null))
    // || (<NgcFormControl>this.maintainFWBForm.get(['otherCharges', indArr1, 'chargeAmount'])).value !==0)
    {
      (<NgcFormArray>this.maintainFWBForm.get("flightBooking")).addValue([
        {

          flightNumber: "",
          flightDate: "",
          carrierCode: "",
          Delete: ""
        }
      ]);

      let i = (<NgcFormArray>this.maintainFWBForm.get("flightBooking")).length - 1;
      (<NgcFormControl>this.maintainFWBForm.get(['flightBooking', i, 'flightNumber'])).setValidators([]);
      (<NgcFormControl>this.maintainFWBForm.get(['flightBooking', i, 'flightDate'])).setValidators([]);
      (<NgcFormControl>this.maintainFWBForm.get(['flightBooking', i, 'carrierCode'])).setValidators([]);
      //(<NgcFormControl>this.maintainFWBForm.get(['otherCharges', i, 'chargeAmount'])).setValidators([]);

    }
    if (indArr1 == -1) {
      (<NgcFormArray>this.maintainFWBForm.get("flightBooking")).addValue([
        {

          flightNumber: "",
          flightDate: "",
          carrierCode: "",
          Delete: ""
        }
      ]);

      let i = (<NgcFormArray>this.maintainFWBForm.get("flightBooking")).length - 1;
      (<NgcFormControl>this.maintainFWBForm.get(['flightBooking', i, 'flightNumber'])).setValidators([]);
      (<NgcFormControl>this.maintainFWBForm.get(['flightBooking', i, 'flightDate'])).setValidators([]);
      (<NgcFormControl>this.maintainFWBForm.get(['flightBooking', i, 'carrierCode'])).setValidators([]);

    }
  }
  onDeleteFlight($event, index) {

    (<NgcFormArray>this.maintainFWBForm.get("flightBooking")).markAsDeletedAt(index);



  }



  onDeleteOtherParticipantInfo(event, index) {
    (this.maintainFWBForm.get(["otherParticipantInfo", index]) as NgcFormGroup).markAsDeleted();
    let indArr1 = (<NgcFormArray>this.maintainFWBForm.get("otherParticipantInfo")).length - 1;
    if (indArr1 < 0) {
      this.opiCount = true;
    }

  }
  onDeleteotherCustomsInfo(event, index) {
    (this.maintainFWBForm.get(["otherCustomsInfo", index]) as NgcFormGroup).markAsDeleted();
  }
  addNewText1(event) {
    (<NgcFormArray>this.maintainFWBForm.get("maintainFWBDetailsData")).addValue([
      {
        pcrcp: "",
        grossWeight: "",
        rateClass: "",
        commodityItemNo: "",
        chargeableWeight: "",
        rateCharge: "",
        total: "",
        natureandQuantityofGoods: "",
        Delete: ""
      }
    ]);
  }
  addNewText2(event) {
    (<NgcFormArray>this.maintainFWBForm.get("rateDescriptionOtherInfo")).addValue([
      {
        length: "",
        weight: "",
        height: "",
        width: "",
        numberofPieces: "",
        volumeCode: "",
        volumeAmount: "",
        uldNumber: "",
        sLAC: "",
        harmonizedCommodityCode: "",
        iSOCountryCode: "",
        serviceCode: "",
        Delete: ""
      }
    ]);
    let i = (<NgcFormArray>this.maintainFWBForm.get("rateDescriptionOtherInfo")).length - 1;
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescriptionOtherInfo', i, 'measurementUnitCode'])).setValidators([Validators.maxLength(3)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescriptionOtherInfo', i, 'dimensionLength'])).setValidators([Validators.maxLength(5)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescriptionOtherInfo', i, 'dimensionHeight'])).setValidators([Validators.maxLength(5)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescriptionOtherInfo', i, 'dimensionWIdth'])).setValidators([Validators.maxLength(5)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescriptionOtherInfo', i, 'numberOfPieces'])).setValidators([Validators.maxLength(4)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescriptionOtherInfo', i, 'volumeUnitCode'])).setValidators([Validators.maxLength(2)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescriptionOtherInfo', i, 'uldNumber'])).setValidators([Validators.maxLength(11)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescriptionOtherInfo', i, 'harmonisedCommodityCode'])).setValidators([Validators.maxLength(18)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescriptionOtherInfo', i, 'slacCount'])).setValidators([Validators.maxLength(8)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescriptionOtherInfo', i, 'countryCode'])).setValidators([Validators.maxLength(2)]);
    (<NgcFormControl>this.maintainFWBForm.get(['rateDescriptionOtherInfo', i, 'serviceCode'])).setValidators([Validators.maxLength(1)]);


  }
  addNewText4(event) {

    let indArr1 = (<NgcFormArray>this.maintainFWBForm.get("otherCharges")).length - 1;
    if (indArr1 != -1 && ((<NgcFormControl>this.maintainFWBForm.get(['otherCharges', indArr1, 'otherChargeIndicator'])).value != ""
      || (<NgcFormControl>this.maintainFWBForm.get(['otherCharges', indArr1, 'otherChargeCode'])).value != "")) {
      (<NgcFormArray>this.maintainFWBForm.get("otherCharges")).addValue([
        {
          otherChargeIndicator: "",
          otherChargeCode: "",
          entitlementCode: "A",
          chargeAmount: "",
          Delete: ""
        }
      ]);
      let i = (<NgcFormArray>this.maintainFWBForm.get("otherCharges")).length - 1;
      (<NgcFormControl>this.maintainFWBForm.get(['otherCharges', i, 'otherChargeIndicator'])).setValidators([Validators.maxLength(1)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherCharges', i, 'otherChargeCode'])).setValidators([Validators.maxLength(2)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherCharges', i, 'chargeAmount'])).setValidators([]);

    }
    if (indArr1 == -1) {
      (<NgcFormArray>this.maintainFWBForm.get("otherCharges")).addValue([
        {
          otherChargeIndicator: "",
          otherChargeCode: "",
          entitlementCode: "A",
          chargeAmount: "",
          Delete: ""
        }
      ]);
      let i = (<NgcFormArray>this.maintainFWBForm.get("otherCharges")).length - 1;
      (<NgcFormControl>this.maintainFWBForm.get(['otherCharges', i, 'otherChargeIndicator'])).setValidators([Validators.maxLength(1)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherCharges', i, 'otherChargeCode'])).setValidators([Validators.maxLength(2)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherCharges', i, 'chargeAmount'])).setValidators([]);

    }
  }

  addNewText41(event) {

    let indArr1 = (<NgcFormArray>this.maintainFWBForm.get("otherChargesCarrier")).length - 1;
    if (indArr1 != -1 && ((<NgcFormControl>this.maintainFWBForm.get(['otherChargesCarrier', indArr1, 'otherChargeIndicator'])).value != ""
      || (<NgcFormControl>this.maintainFWBForm.get(['otherChargesCarrier', indArr1, 'otherChargeCode'])).value != "")) {
      (<NgcFormArray>this.maintainFWBForm.get("otherChargesCarrier")).addValue([
        {
          otherChargeIndicator: "",
          otherChargeCode: "",
          entitlementCode: "C",
          chargeAmount: "",
          Delete: ""
        }
      ]);
      let i = (<NgcFormArray>this.maintainFWBForm.get("otherChargesCarrier")).length - 1;
      (<NgcFormControl>this.maintainFWBForm.get(['otherChargesCarrier', i, 'otherChargeIndicator'])).setValidators([Validators.maxLength(1)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherChargesCarrier', i, 'otherChargeCode'])).setValidators([Validators.maxLength(2)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherChargesCarrier', i, 'chargeAmount'])).setValidators([]);

    }
    if (indArr1 == -1) {
      (<NgcFormArray>this.maintainFWBForm.get("otherChargesCarrier")).addValue([
        {
          otherChargeIndicator: "",
          otherChargeCode: "",
          entitlementCode: "C",
          chargeAmount: "",
          Delete: ""
        }
      ]);
      let i = (<NgcFormArray>this.maintainFWBForm.get("otherChargesCarrier")).length - 1;
      (<NgcFormControl>this.maintainFWBForm.get(['otherChargesCarrier', i, 'otherChargeIndicator'])).setValidators([Validators.maxLength(1)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherChargesCarrier', i, 'otherChargeCode'])).setValidators([Validators.maxLength(2)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherChargesCarrier', i, 'chargeAmount'])).setValidators([]);

    }
  }

  addNewText5(event) {
    let indArr1 = (<NgcFormArray>this.maintainFWBForm.get("otherParticipantInfo")).length - 1;


    if (indArr1 < 0) {
      this.opiCount = true;
    } else {
      this.opiCount = false;
    }
    if (indArr1 != -1 && ((<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', indArr1, 'participantName'])).value != ""
      || (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', indArr1, 'airportCityCode'])).value != ""
      || (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', indArr1, 'officeFunctionDesignator'])).value != ""
      || (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', indArr1, 'companyDesignator'])).value != ""
      || (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', indArr1, 'fileReference'])).value != ""
      || (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', indArr1, 'opiParticipantIdentifier'])).value != ""
      || (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', indArr1, 'opiParticipantCode'])).value != ""
      || (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', indArr1, 'opiAirportCityCode'])).value != "")) {
      (<NgcFormArray>this.maintainFWBForm.get("otherParticipantInfo")).addValue([
        {
          participantName: "",
          airportCityCode: "",
          officeFunctionDesignator: "",
          companyDesignator: "",
          fileReference: "",
          opiParticipantIdentifier: "",
          opiParticipantCode: "",
          opiAirportCityCode: "",
          Delete: ""
        }
      ]);
      let i = (<NgcFormArray>this.maintainFWBForm.get("otherParticipantInfo")).length - 1;
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'participantName'])).setValidators([Validators.maxLength(35)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'airportCityCode'])).setValidators([Validators.maxLength(3)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'officeFunctionDesignator'])).setValidators([Validators.maxLength(2)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'companyDesignator'])).setValidators([Validators.maxLength(2)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'fileReference'])).setValidators([Validators.maxLength(15)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiParticipantIdentifier'])).setValidators([Validators.maxLength(3)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiParticipantCode'])).setValidators([Validators.maxLength(17)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiAirportCityCode'])).setValidators([Validators.maxLength(3)]);
    }
    if (indArr1 < 0) {
      (<NgcFormArray>this.maintainFWBForm.get("otherParticipantInfo")).addValue([
        {
          participantName: "",
          airportCityCode: "",
          officeFunctionDesignator: "",
          companyDesignator: "",
          fileReference: "",
          opiParticipantIdentifier: "",
          opiParticipantCode: "",
          opiAirportCityCode: "",
          Delete: ""
        }
      ]);
      let i = (<NgcFormArray>this.maintainFWBForm.get("otherParticipantInfo")).length - 1;
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'participantName'])).setValidators([Validators.maxLength(35)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'airportCityCode'])).setValidators([Validators.maxLength(3)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'officeFunctionDesignator'])).setValidators([Validators.maxLength(2)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'companyDesignator'])).setValidators([Validators.maxLength(2)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'fileReference'])).setValidators([Validators.maxLength(15)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiParticipantIdentifier'])).setValidators([Validators.maxLength(3)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiParticipantCode'])).setValidators([Validators.maxLength(17)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiAirportCityCode'])).setValidators([Validators.maxLength(3)]);
      this.opiCount = false;
    }
  }
  addNewText6(event) {
    let indArr1 = (<NgcFormArray>this.maintainFWBForm.get("otherCustomsInfo")).length - 1;
    if (indArr1 != -1 && ((<NgcFormControl>this.maintainFWBForm.get(['otherCustomsInfo', indArr1, 'informationIdentifier'])).value != ""
      || (<NgcFormControl>this.maintainFWBForm.get(['otherCustomsInfo', indArr1, 'csrciIdentifier'])).value != ""
      || (<NgcFormControl>this.maintainFWBForm.get(['otherCustomsInfo', indArr1, 'scrcInformation'])).value != ""
      || (<NgcFormControl>this.maintainFWBForm.get(['otherCustomsInfo', indArr1, 'countryCode'])).value != ""
    )) {
      (<NgcFormArray>this.maintainFWBForm.get("otherCustomsInfo")).addValue([
        {
          countryCode: null,
          informationIdentifier: "",
          csrciIdentifier: "",
          scrcInformation: "",
          Delete: ""
        }
      ]);
      let i = (<NgcFormArray>this.maintainFWBForm.get("otherCustomsInfo")).length - 1;
      (<NgcFormControl>this.maintainFWBForm.get(['otherCustomsInfo', i, 'informationIdentifier'])).setValidators([Validators.maxLength(3)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherCustomsInfo', i, 'csrciIdentifier'])).setValidators([Validators.maxLength(2)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherCustomsInfo', i, 'scrcInformation'])).setValidators([Validators.maxLength(35)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherCustomsInfo', i, 'countryCode'])).setValidators([Validators.maxLength(2)]);

    }
    if (indArr1 == -1) {
      (<NgcFormArray>this.maintainFWBForm.get("otherCustomsInfo")).addValue([
        {
          countryCode: null,
          informationIdentifier: "",
          csrciIdentifier: "",
          scrcInformation: "",
          Delete: ""
        }
      ]);
      let i = (<NgcFormArray>this.maintainFWBForm.get("otherCustomsInfo")).length - 1;
      (<NgcFormControl>this.maintainFWBForm.get(['otherCustomsInfo', 0, 'informationIdentifier'])).setValidators([Validators.maxLength(3)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherCustomsInfo', 0, 'csrciIdentifier'])).setValidators([Validators.maxLength(2)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherCustomsInfo', 0, 'scrcInformation'])).setValidators([Validators.maxLength(35)]);
      (<NgcFormControl>this.maintainFWBForm.get(['otherCustomsInfo', 0, 'countryCode'])).setValidators([Validators.maxLength(2)]);

    }
  }



  onSearch() {
    this.resetFormControlValues();
    this.focusOrigin = false;
    this.receivedManuallyFlag = true;

    let iata = this.maintainFWBForm.get('maintainFWBSearch.nonIATA').value;
    let fwbDetails = this.maintainFWBForm.get('maintainFWBSearch.awbNumber').value;
    this.currentFwbDetails = this.maintainFWBForm.get('maintainFWBSearch.awbNumber').value;
    this.currentFwbDetails = this.maintainFWBForm.get('maintainFWBSearch.nonIATA').value;
    const searchRequest: FWBRequest = new FWBRequest();
    searchRequest.nonIATA = iata;
    searchRequest.awbNumber = fwbDetails;
    let awbnO = this.maintainFWBForm.get('maintainFWBSearch.awbNumber').value;
    if (!awbnO) {
      this.maintainFWBForm.validate();
      this.showErrorStatus("imp.err127")
      return;

    }
    else {
      this.printFlag = true;
      this.enableSave = true;
      if (this.maintainFWBForm.get('maintainFWBSearch.awbNumber').value != null) {
        this.maintainFWBForm.get('awbNumber').setValue(awbnO);
      }
      if (iata) {


        this.importService.fetchMaintainFwbDetailsNonIata(searchRequest).subscribe(data => {
          this.saveFlag = false;
          this.afterFocus();
          if (this.showResponseErrorMessages(data, null, "maintainFWBSearch")) {
            //console.log(this.maintainFWBForm)
            this.showTable = true;
            this.searchSuccessful = true;
            this.resp = data;

            var isBlackListed: any = false;
            if (data.messageList && data.messageList.length != 0) {
              data.messageList.forEach(message => {
                var convertedMessage = this.getI18NValue(message.code);
                if (convertedMessage.includes("Blacklisted")) {
                  isBlackListed = true;
                }
                //changes for bug -2561
                if (message.referenceId == 'awbNumber') {
                  this.showTable = false;
                }
              });
            }
            if (isBlackListed) {
              this.showTable = false;
              this.searchSuccessful = false;
              return;
            }

            if (this.resp.data.restrictedAirline) {
              this.showTable = false;
              this.searchSuccessful = false;
            }
            return;
          }

          //this.refreshFormMessages(data);
          this.resp = data;
          this.responseArray = data.data;
          if (this.responseArray.receivedManuallyFlag != null) {
            this.receivedManuallyFlag = this.responseArray.receivedManuallyFlag;
          } else {
            this.receivedManuallyFlag = true;
          }
          if (this.responseArray.shipperInfo != null) {
            this.shipperContactLength = this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo.length;
          }
          if (this.responseArray.consigneeInfo != null) {
            this.consigneeContactLength = this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo.length;
          }
          if (this.responseArray.alsoNotify != null) {
            this.alsoNotiyConatctLength = this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo.length;
          }
          console.log(data.data);

          if (this.responseArray) {
            //this.maintainFWBForm.patchValue(this.responseArray);
            this.showTable = true;
            this.searchSuccessful = true;
          } else {
            this.showTable = true;

            //this.showSuccessStatus('AWB Not exist, create new');
            // this.maintainFWBForm.reset();

            return;
          }
          //console.log(this.responseArray);
          let msgFlag = false;
          let shcList = new Array();

          let shclen;
          let conslen;
          let shiplen;
          let alsonotlen;
          let ssrlen;
          let osilen;
          let routingData;
          let flightlen;
          let accInfo;
          let ociInfo;
          if (this.responseArray != null) {

            msgFlag = true;
            if (this.responseArray.shcode != null) {
              shclen = this.responseArray.shcode.length;
            }

            if (this.responseArray.flightBooking != null
              && this.responseArray.flightBooking.length > 0) {
              flightlen = this.responseArray.flightBooking.length;
            } else {
              flightlen = 0;
            }

            if (flightlen !== undefined) {
              for (let i = flightlen; i < 1; ++i) {
                this.responseArray.flightBooking[i] = {
                  flightNumber: null,
                  flightDate: null,
                  carrierCode: null
                };
              }
            }

            if (this.responseArray.accountingInfo != null
              && this.responseArray.accountingInfo.length > 0) {
              accInfo = this.responseArray.accountingInfo.length;
            } else {
              accInfo = 0;
            }

            if (accInfo !== undefined) {
              for (let i = accInfo; i < 1; ++i) {
                this.responseArray.accountingInfo[i] = {
                  informationIdentifier: null,
                  accountingInformation: null

                };
              }
            }

            if (this.responseArray.otherCustomsInfo != null
              && this.responseArray.otherCustomsInfo.length > 0) {
              ociInfo = this.responseArray.otherCustomsInfo.length;
            } else {
              ociInfo = 0;
            }

            if (ociInfo !== undefined) {
              for (let i = ociInfo; i < 1; ++i) {
                this.responseArray.otherCustomsInfo[i] = {
                  countryCode: null,
                  informationIdentifier: null,
                  csrciIdentifier: null,
                  scrcInformation: null

                };
              }
            }

            if (this.responseArray.routing != null
              && this.responseArray.routing.length > 0) {
              routingData = this.responseArray.routing.length;
            } else {
              routingData = 0;
            }

            if (routingData !== undefined) {
              for (let i = routingData; i < 3; ++i) {
                this.responseArray.routing[i] = {
                  carrierCode: null,
                  airportCode: null
                };
              }
            }

            if (this.responseArray.ssrInfo != null
              && this.responseArray.ssrInfo.length > 0) {
              ssrlen = this.responseArray.ssrInfo.length;
            } else {
              ssrlen = 0;
            }

            if (this.responseArray.osiInfo != null
              && this.responseArray.osiInfo.length > 0) {
              osilen = this.responseArray.osiInfo.length;
            } else {
              osilen = 0;
            }



            if (ssrlen !== undefined) {
              for (let i = ssrlen; i < 3; ++i) {
                this.responseArray.ssrInfo[i] = {
                  serviceRequestcontent: ''
                };
              }
            }

            if (osilen !== undefined) {
              for (let i = osilen; i < 3; ++i) {
                this.responseArray.osiInfo[i] = {
                  serviceRequestcontent: ''
                };
              }
            }

            if (this.responseArray.alsoNotify == null) {
              this.responseArray.alsoNotify = {};
              this.responseArray.alsoNotify.customerAddressInfo = {};
              //this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo = [{}];
            } else {
              if (this.responseArray.alsoNotify.customerAddressInfo == null) {
                this.responseArray.alsoNotify.customerAddressInfo = {};
                this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo = [{}];
                alsonotlen = 0;
              } else {
                if (this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo == null
                  || this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo.length == 0) {
                  this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo = [{}];
                  alsonotlen = 0;
                } else {
                  alsonotlen = this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo.length;
                }
                for (let i = alsonotlen; i < 1; ++i) {
                  this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo[i].contactIdentifier = '';
                  this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo[i].contactDetail = '';
                }
              }
            }

            //Consignee
            if (this.responseArray.consigneeInfo == null) {
              this.responseArray.consigneeInfo = {};
              this.responseArray.consigneeInfo.customerAddressInfo = {};
              //this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo = [{}];
            } else {
              if (this.responseArray.consigneeInfo.customerAddressInfo == null) {
                this.responseArray.consigneeInfo.customerAddressInfo = {};
                this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo = [{}];
                conslen = 0;
              } else {
                if (this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo == null
                  || this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo.length == 0) {
                  this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo = [{}];
                  conslen = 0;
                } else {
                  conslen = this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo.length;
                }
                for (let i = conslen; i < 1; ++i) {
                  this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo[i].contactIdentifier = '';
                  this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo[i].contactDetail = '';
                }
              }
            }
            //Shipper
            if (this.responseArray.shipperInfo == null) {
              this.responseArray.shipperInfo = {};
              this.responseArray.shipperInfo.customerAddressInfo = {};
              //this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo = [{}];
            } else {
              if (this.responseArray.shipperInfo.customerAddressInfo == null) {
                this.responseArray.shipperInfo.customerAddressInfo = {};
                this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo = [{}];
                shiplen = 0;
              } else {
                if (this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo == null
                  || this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo.length == 0) {
                  this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo = [{}];
                  shiplen = 0;
                } else {
                  shiplen = this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo.length;
                }
                for (let i = shiplen; i < 1; ++i) {
                  this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo[i].contactIdentifier = '';
                  this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo[i].contactDetail = '';
                }
              }
            }


          }
          console.log(this.responseArray);
          this.oldpieces = this.responseArray['pieces'];
          this.oldweight = this.responseArray['weight'];
          this.maintainFWBForm.patchValue(this.responseArray);

          if (!msgFlag) {
            this.showSuccessStatus('awb.not.exist');
            this.maintainFWBForm.reset();
          }
        },
          error => {
            this.showErrorStatus(error);
          }
        );


      }
      else {
        this.importService.fetchMaintainFwbDetails(searchRequest).subscribe(data => {
          this.saveFlag = false;

          if (this.showResponseErrorMessages(data, null, "maintainFWBSearch")) {
            //console.log(this.maintainFWBForm)
            this.showTable = true;
            this.searchSuccessful = true;
            this.resp = data;
            this.maintainFWBForm.controls['rateDescription'].reset();
            this.maintainFWBForm.get(["rateDescription", 0, "weightUnitCode"]).setValue('K');
            this.maintainFWBForm.get(["rateDescription", 0, "rateLineNumber"]).setValue(1);
            this.maintainFWBForm.get(["rateDescription", 0, "rateDescriptionOtherInfo", 0, 'rateLine']).setValue('NG');

            var isBlackListed: any = false;
            if (data.messageList && data.messageList.length != 0) {
              data.messageList.forEach(message => {
                var convertedMessage = this.getI18NValue(message.code);
                if (convertedMessage.includes("Blacklisted")) {
                  isBlackListed = true;
                }
                //changes for bug - 2561
                if (message.referenceId == 'awbNumber') {
                  this.showTable = false;
                }
              });
            }
            if (isBlackListed) {
              this.showTable = false;
              this.searchSuccessful = false;
              return;
            }

            if (this.resp.data != null && this.resp.data.restrictedAirline) {
              this.showTable = false;
              this.searchSuccessful = false;
            }
            return;
          }
          this.resp = data;
          this.responseArray = data.data;
          if (this.responseArray.receivedManuallyFlag != null) {
            this.receivedManuallyFlag = this.responseArray.receivedManuallyFlag;
          } else {
            this.receivedManuallyFlag = true;
          }

          if (this.responseArray.shipperInfo != null) {
            this.shipperContactLength = this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo.length;
          }
          if (this.responseArray.consigneeInfo != null) {
            this.consigneeContactLength = this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo.length;
          }
          if (this.responseArray.alsoNotify != null) {
            this.alsoNotiyConatctLength = this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo.length;
          }
          if (this.responseArray) {
            this.showTable = true;
            this.searchSuccessful = true;
            if (this.responseArray.isManifested === true) {
              this.showErrorMessage('data.manifest.completed');
              this.maintainFWBForm.disable();
              this.disableInnerForm()
            }

          } else {
            this.showTable = true;
            if (this.responseArray.isManifested === true) {
              this.showErrorMessage('data.manifest.completed');
              this.maintainFWBForm.disable();
              this.disableInnerForm()

            }
            return;
          }
          //console.log(this.responseArray);
          let msgFlag = false;
          let shcList = new Array();

          let shclen;
          let conslen;
          let shiplen;
          let alsonotlen;
          let ssrlen;
          let osilen;
          let routingData;
          let flightlen;
          let accInfo;
          let ociInfo;
          if (this.responseArray != null) {

            msgFlag = true;
            if (this.responseArray.shcode != null) {
              shclen = this.responseArray.shcode.length;
            }

            if (this.responseArray.flightBooking != null
              && this.responseArray.flightBooking.length > 0) {
              flightlen = this.responseArray.flightBooking.length;
            } else {
              flightlen = 0;
            }

            if (flightlen !== undefined) {
              for (let i = flightlen; i < 1; ++i) {
                this.responseArray.flightBooking[i] = {
                  flightNumber: null,
                  flightDate: null,
                  carrierCode: null
                };
              }
            }

            if (this.responseArray.accountingInfo != null
              && this.responseArray.accountingInfo.length > 0) {
              accInfo = this.responseArray.accountingInfo.length;
            } else {
              accInfo = 0;
            }

            if (accInfo !== undefined && this.responseArray.accountingInfo != null) {
              for (let i = accInfo; i < 1; ++i) {
                this.responseArray.accountingInfo[i] = {
                  informationIdentifier: null,
                  accountingInformation: null

                };
              }
            }

            if (this.responseArray.otherCustomsInfo != null
              && this.responseArray.otherCustomsInfo.length > 0) {
              ociInfo = this.responseArray.otherCustomsInfo.length;
            } else {
              ociInfo = 0;
            }

            if (ociInfo !== undefined && this.responseArray.otherCustomsInfo != null) {
              for (let i = ociInfo; i < 1; ++i) {
                this.responseArray.otherCustomsInfo[i] = {
                  countryCode: null,
                  informationIdentifier: null,
                  csrciIdentifier: null,
                  scrcInformation: null

                };
              }
            }

            if (this.responseArray.routing != null
              && this.responseArray.routing.length > 0) {
              routingData = this.responseArray.routing.length;
            } else {
              routingData = 0;
            }

            if (routingData !== undefined && this.responseArray.routing != null) {
              for (let i = routingData; i < 3; ++i) {
                this.responseArray.routing[i] = {
                  carrierCode: null,
                  airportCode: null
                };
              }
            }

            if (this.responseArray.ssrInfo != null
              && this.responseArray.ssrInfo.length > 0) {
              ssrlen = this.responseArray.ssrInfo.length;
            } else {
              ssrlen = 0;
            }

            if (this.responseArray.osiInfo != null
              && this.responseArray.osiInfo.length > 0) {
              osilen = this.responseArray.osiInfo.length;
            } else {
              osilen = 0;
            }



            if (ssrlen !== undefined && this.responseArray.ssrInfo != null) {
              for (let i = ssrlen; i < 3; ++i) {
                this.responseArray.ssrInfo[i] = {
                  serviceRequestcontent: ''
                };
              }
            }

            if (osilen !== undefined && this.responseArray.osiInfo != null) {
              for (let i = osilen; i < 3; ++i) {
                this.responseArray.osiInfo[i] = {
                  serviceRequestcontent: ''
                };
              }
            }



            if (this.responseArray.densityGroupCode === 0) {
              this.responseArray.densityGroupCode = null;
            }
          }

          if (this.responseArray.alsoNotify == null) {
            this.responseArray.alsoNotify = {};
            this.responseArray.alsoNotify.customerAddressInfo = {};
            //this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo = [{}];
          } else {
            if (this.responseArray.alsoNotify.customerAddressInfo == null) {
              this.responseArray.alsoNotify.customerAddressInfo = {};
              this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo = [{}];
              alsonotlen = 0;
            } else {
              if (this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo == null
                || this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo.length == 0) {
                this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo = [{}];
                alsonotlen = 0;
              } else {
                alsonotlen = this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo.length;
              }
              for (let i = alsonotlen; i < 1; ++i) {
                this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo[i].contactIdentifier = '';
                this.responseArray.alsoNotify.customerAddressInfo.customerContactInfo[i].contactDetail = '';
              }
            }
          }

          //Consignee
          if (this.responseArray.consigneeInfo == null) {
            this.responseArray.consigneeInfo = {};
            this.responseArray.consigneeInfo.customerAddressInfo = {};
            //this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo = [{}];
          } else {
            if (this.responseArray.consigneeInfo.customerAddressInfo == null) {
              this.responseArray.consigneeInfo.customerAddressInfo = {};
              this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo = [{}];
              conslen = 0;
            } else {
              if (this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo == null
                || this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo.length == 0) {
                this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo = [{}];
                conslen = 0;
              } else {
                conslen = this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo.length;
              }
              for (let i = conslen; i < 1; ++i) {
                this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo[i].contactIdentifier = '';
                this.responseArray.consigneeInfo.customerAddressInfo.customerContactInfo[i].contactDetail = '';
              }
            }
          }
          //Shipper
          if (this.responseArray.shipperInfo == null) {
            this.responseArray.shipperInfo = {};
            this.responseArray.shipperInfo.customerAddressInfo = {};
            //this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo = [{}];
          } else {
            if (this.responseArray.shipperInfo.customerAddressInfo == null) {
              this.responseArray.shipperInfo.customerAddressInfo = {};
              this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo = [{}];
              shiplen = 0;
            } else {
              if (this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo == null
                || this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo.length == 0) {
                this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo = [{}];
                shiplen = 0;
              } else {
                shiplen = this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo.length;
              }
              for (let i = shiplen; i < 1; ++i) {
                this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo[i].contactIdentifier = '';
                this.responseArray.shipperInfo.customerAddressInfo.customerContactInfo[i].contactDetail = '';
              }
            }
          }


          //ssr or osi
          //console.log(JSON.stringify(this.responseArray));
          this.oldpieces = this.responseArray['pieces'];
          this.oldweight = this.responseArray['weight'];

          this.maintainFWBForm.patchValue(this.responseArray);
          if (this.responseArray.shipperInfo != null && this.responseArray.shipperInfo.customerAddressInfo.stateCode && this.responseArray.shipperInfo.customerAddressInfo.stateCode != null) {
            this.maintainFWBForm.get('shipperInfo.customerAddressInfo.stateCode').setValue(this.responseArray.shipperInfo.customerAddressInfo.stateCode);
          }
          if (this.responseArray.consigneeInfo != null && this.responseArray.consigneeInfo.customerAddressInfo.stateCode && this.responseArray.consigneeInfo.customerAddressInfo.stateCode != null) {
            this.maintainFWBForm.get('consigneeInfo.customerAddressInfo.stateCode').setValue(this.responseArray.consigneeInfo.customerAddressInfo.stateCode);
          }

          (this.maintainFWBForm.get('rateDescription') as NgcFormArray).controls.forEach((formGroup: NgcFormGroup, ind) => {
            formGroup.get('weightUnitCode').setValue('K');
            (formGroup.get('rateDescriptionOtherInfo') as NgcFormArray).controls.forEach((formGroup1: NgcFormGroup, index) => {
              // const carrierCode1: string = formGroup1.get('measurementUnitCode').value;
              const carrierCode1: string = formGroup1.get('noDimensionAvailable').value;

              if (!carrierCode1) {
                formGroup1.get('measurementUnitCode').setValidators([Validators.required]);
                formGroup1.get('dimensionLength').setValidators([Validators.required]);
                formGroup1.get('dimensionWIdth').setValidators([Validators.required]);
                formGroup1.get('dimensionHeight').setValidators([Validators.required]);
                formGroup1.get('numberOfPieces').setValidators([Validators.required]);
              }
            });
          });


          let fo = (this.maintainFWBForm.get(["rateDescription", 0, "rateDescriptionOtherInfo"]) as NgcFormArray)
          fo.valueChanges.subscribe(val => {
            fo.controls.forEach((data: NgcFormGroup, index) => {
              let dat = data.get('natureOfGoodsDescription').value;
              if (dat) {
              }
            })
            if (!msgFlag) {
              this.showSuccessStatus('awb.not.exist');
              this.maintainFWBForm.reset();
            }
          },
            error => {
              this.showErrorStatus(error);
            }
          );



        });
      }

    }

  }

  resetFormControlValues() {
    this.maintainFWBForm.get('origin').reset();
    this.maintainFWBForm.get('natureOfgoods').reset();
    this.maintainFWBForm.get('ovcdReasonCode').reset();
    this.maintainFWBForm.get('destination').reset();
    this.maintainFWBForm.get('pieces').reset();
    this.maintainFWBForm.get('weight').reset();
    this.maintainFWBForm.get('volumeUnitCode').reset();
    this.maintainFWBForm.get('volumeAmount').reset();
    this.maintainFWBForm.get('densityIndicator').reset();
    this.maintainFWBForm.get('densityGroupCode').reset();
    this.maintainFWBForm.get('carriersExecutionDate').reset();
    this.maintainFWBForm.get('carriersExecutionPlace').reset();
    this.maintainFWBForm.get('carriersExecutionAuthSign').reset();
    this.maintainFWBForm.get('customOrigin').reset();
    this.maintainFWBForm.get('shpCertificateSign').reset();
    this.maintainFWBForm.get('messageSequence').reset();
    this.maintainFWBForm.get('messageVersion').reset();
    this.maintainFWBForm.get('natureOfGoodsDescription').reset();
    this.maintainFWBForm.get('messageStatus').reset();
    this.maintainFWBForm.get('siiChargeAmount').reset();
    this.maintainFWBForm.get('cassIndicator').reset();
    this.maintainFWBForm.controls['flightBooking'].reset();
    this.maintainFWBForm.controls['routing'].reset();
    //this.maintainFWBForm.controls['rateDescription'].reset();
    this.maintainFWBForm.get('agentInfo').reset();
    this.maintainFWBForm.controls['otherCharges'].reset();
    this.maintainFWBForm.controls['otherChargesCarrier'].reset();
    this.maintainFWBForm.controls['accountingInfo'].reset();
    this.maintainFWBForm.controls['ssrInfo'].reset();
    this.maintainFWBForm.controls['osiInfo'].reset();
    this.maintainFWBForm.get('shipmentReferenceInfor').reset();
    this.maintainFWBForm.get('col').reset();
    this.maintainFWBForm.get('ppd').reset();
    this.maintainFWBForm.get('chargeDeclaration').reset();
    //this.maintainFWBForm.get('chargeDestCurrency').reset();
    this.maintainFWBForm.get('senderReference').reset();
    this.maintainFWBForm.get('shipperInfo').reset();
    this.maintainFWBForm.get('consigneeInfo').reset();
    this.maintainFWBForm.get('alsoNotify').reset();
    //this.maintainFWBForm.controls['otherParticipantInfo'].reset();
    this.maintainFWBForm.controls['otherCustomsInfo'].reset();
    //this.maintainFWBForm.controls['rateDescription'].reset();
  }

  public onSave() {
    this.accountingInfoIcon = "";
    this.flightRoutingIcon = "";
    this.shipperConsigneeIcon = "";
    this.notifyAgentIcon = "";
    this.ssrOsiIcon = "";
    this.accountingInfoIcon = "";
    this.rateDescIcon = "";
    this.chargesPpdColIcon = "";
    this.ardNomSrnIcon = "";
    this.opiIcon = "";
    this.ociIcon = "";
    this.cdcIcon = "";
    this.refIcon = "";

    // if (!this.maintainFWBForm.valid) {

    // }

    this.clearHashTable();
    const maintainFwbDetails = this.maintainFWBForm.getRawValue();
    console.log(maintainFwbDetails);
    let flag: boolean = false;

    if (((!NgcUtility.isTenantCityOrAirport(maintainFwbDetails.origin) && !NgcUtility.isTenantCityOrAirport(maintainFwbDetails.destination)) || (NgcUtility.isTenantCityOrAirport(maintainFwbDetails.origin)))
      && maintainFwbDetails.carriersExecutionDate == null && (maintainFwbDetails.carriersExecutionPlace == null || maintainFwbDetails.carriersExecutionPlace == '')) {
      this.maintainFWBForm.get('carriersExecutionDate').setValidators([Validators.required]);
      this.maintainFWBForm.get('carriersExecutionPlace').setValidators([Validators.required]);
      maintainFwbDetails.carriersExecutionDate = new Date();
      maintainFwbDetails.carriersExecutionPlace = NgcUtility.getTenantConfiguration().airportCode;
    }


    //Flight Booking
    let flightArr = <NgcFormArray>this.maintainFWBForm.get('flightBooking');
    for (let i = 0; i < flightArr.length; i++) {
      if ((this.maintainFWBForm.get(['flightBooking', i, 'carrierCode']).value !== null
        && this.maintainFWBForm.get(['flightBooking', i, 'carrierCode']).value.length > 0
        || this.maintainFWBForm.get(['flightBooking', i, 'flightNumber']).value !== null
        && this.maintainFWBForm.get(['flightBooking', i, 'flightNumber']).value.length > 0)
        || this.maintainFWBForm.get(['flightBooking', i, 'flightDate']).value !== null
        && this.maintainFWBForm.get(['flightBooking', i, 'flightDate']).value.length > 0) {

        if ((this.maintainFWBForm.get(['flightBooking', i, 'carrierCode']).value !== null)
          && this.maintainFWBForm.get(['flightBooking', i, 'carrierCode']).value.length == 0
          || (this.maintainFWBForm.get(['flightBooking', i, 'flightNumber']).value !== null)
          && this.maintainFWBForm.get(['flightBooking', i, 'flightNumber']).value.length == 0
          || (this.maintainFWBForm.get(['flightBooking', i, 'flightDate']).value !== null)
          && this.maintainFWBForm.get(['flightBooking', i, 'flightDate']).value.length == 0) {
          this.showInfoStatus('import.info123');
          return;
        }
      }
    }

    // Other participant info
    let array = <NgcFormArray>this.maintainFWBForm.get('otherParticipantInfo');
    for (let i = 0; i < array.length; i++) {
      if ((this.maintainFWBForm.get(['otherParticipantInfo', i, 'airportCityCode']).value !== null
        && this.maintainFWBForm.get(['otherParticipantInfo', i, 'airportCityCode']).value.length > 0)
        || (this.maintainFWBForm.get(['otherParticipantInfo', i, 'officeFunctionDesignator']).value !== null
          && this.maintainFWBForm.get(['otherParticipantInfo', i, 'officeFunctionDesignator']).value.length > 0)
        || (this.maintainFWBForm.get(['otherParticipantInfo', i, 'companyDesignator']).value !== null
          && this.maintainFWBForm.get(['otherParticipantInfo', i, 'companyDesignator']).value.length > 0)) {
        this.maintainFWBForm.get(['otherParticipantInfo', i, 'airportCityCode']).setValidators([Validators.required]);
        this.maintainFWBForm.get(['otherParticipantInfo', i, 'officeFunctionDesignator']).setValidators([Validators.required]);
        this.maintainFWBForm.get(['otherParticipantInfo', i, 'companyDesignator']).setValidators([Validators.required]);
        this.maintainFWBForm.get(['otherParticipantInfo', i, 'participantName']).setValidators([Validators.required]);

        if ((this.maintainFWBForm.get(['otherParticipantInfo', i, 'airportCityCode']).value !== null
          && this.maintainFWBForm.get(['otherParticipantInfo', i, 'airportCityCode']).value.length == 0)
          || (this.maintainFWBForm.get(['otherParticipantInfo', i, 'officeFunctionDesignator']).value !== null
            && this.maintainFWBForm.get(['otherParticipantInfo', i, 'officeFunctionDesignator']).value.length == 0)
          || (this.maintainFWBForm.get(['otherParticipantInfo', i, 'companyDesignator']).value !== null
            && this.maintainFWBForm.get(['otherParticipantInfo', i, 'companyDesignator']).value.length == 0)
          || (this.maintainFWBForm.get(['otherParticipantInfo', i, 'participantName']).value !== null
            && this.maintainFWBForm.get(['otherParticipantInfo', i, 'participantName']).value.length == 0)) {
          this.showInfoStatus('import.info124');
          return;
        }
      }

      else {
        if ((this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiAirportCityCode']).value !== null
          && this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiAirportCityCode']).value.length > 0)
          || (this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiParticipantIdentifier']).value !== null
            && this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiParticipantIdentifier']).value.length > 0)
          || (this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiParticipantCode']).value !== null
            && this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiParticipantCode']).value.length > 0)) {
          this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiAirportCityCode']).setValidators([Validators.required]);
          this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiParticipantIdentifier']).setValidators([Validators.required]);
          this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiParticipantCode']).setValidators([Validators.required]);
          this.maintainFWBForm.get(['otherParticipantInfo', i, 'participantName']).setValidators([Validators.required]);

          if ((this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiAirportCityCode']).value !== null
            && this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiAirportCityCode']).value.length == 0)
            || (this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiParticipantIdentifier']).value !== null
              && this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiParticipantIdentifier']).value.length == 0)
            || (this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiParticipantCode']).value !== null
              && this.maintainFWBForm.get(['otherParticipantInfo', i, 'opiParticipantCode']).value.length == 0)
            || (this.maintainFWBForm.get(['otherParticipantInfo', i, 'participantName']).value !== null
              && this.maintainFWBForm.get(['otherParticipantInfo', i, 'participantName']).value.length == 0)) {
            this.showInfoStatus('import.info125');
            return;
          }
        }
      }

    }

    //oci validation
    let arrayOci = <NgcFormArray>this.maintainFWBForm.get('otherCustomsInfo');
    for (let i = 0; i < arrayOci.length; i++) {
      if ((this.maintainFWBForm.get(['otherCustomsInfo', i, 'countryCode']).value !== null
        && this.maintainFWBForm.get(['otherCustomsInfo', i, 'countryCode']).value.length > 0)) {
        this.maintainFWBForm.get(['otherCustomsInfo', i, 'countryCode']).setValidators([Validators.maxLength(2), Validators.required]);
        this.maintainFWBForm.get(['otherCustomsInfo', i, 'informationIdentifier']).setValidators([Validators.required]);
        this.maintainFWBForm.get(['otherCustomsInfo', i, 'csrciIdentifier']).setValidators([Validators.required]);

        if ((this.maintainFWBForm.get(['otherCustomsInfo', i, 'countryCode']).value !== null
          && this.maintainFWBForm.get(['otherCustomsInfo', i, 'countryCode']).value.length == 0)) {
          this.showInfoStatus('import.info126');
          return;
        }
      }
    }


    //consignee validation
    if (this.maintainFWBForm.get('consigneeInfo.customerName').value !== null
      && this.maintainFWBForm.get('consigneeInfo.customerName').value.length > 0) {
      this.maintainFWBForm.get('consigneeInfo.customerName').setValidators([Validators.required]);
      this.maintainFWBForm.get('consigneeInfo.customerAddressInfo.streetAddress1').setValidators([Validators.required]);
      this.maintainFWBForm.get('consigneeInfo.customerAddressInfo.customerPlace').setValidators([Validators.maxLength(17), Validators.required]);
      this.maintainFWBForm.get('consigneeInfo.customerAddressInfo.countryCode').setValidators([Validators.maxLength(2), Validators.required]);
      if (this.maintainFWBForm.get('consigneeInfo.customerAddressInfo.streetAddress1').value == null
        || this.maintainFWBForm.get('consigneeInfo.customerAddressInfo.streetAddress1').value.length == 0
        || this.maintainFWBForm.get('consigneeInfo.customerAddressInfo.customerPlace').value == null
        || this.maintainFWBForm.get('consigneeInfo.customerAddressInfo.customerPlace').value.length == 0
        || this.maintainFWBForm.get('consigneeInfo.customerAddressInfo.countryCode').value == null
        || this.maintainFWBForm.get('consigneeInfo.customerAddressInfo.countryCode').value.length == 0
      ) {
        this.showInfoStatus('import.info127');
        return;
      }
    }

    let consigneeContactInfo = (<NgcFormArray>this.maintainFWBForm.get('consigneeInfo.customerAddressInfo.customerContactInfo'));
    let consigneeError = false;
    if (consigneeContactInfo.length > 0) {
      consigneeContactInfo.controls.forEach((data: NgcFormGroup, index) => {
        if (data.get('contactIdentifier').value != null && data.get('contactDetail').value == null) {
          consigneeError = true;
        }
      });
      if (consigneeError) {
        this.showErrorStatus('imp.err128');
        return;
      }
    }

    //OTHER CHARGES
    let arrayOth = <NgcFormArray>this.maintainFWBForm.get('otherCharges');
    for (let i = 0; i < arrayOth.length; i++) {
      if ((this.maintainFWBForm.get(['otherCharges', i, 'otherChargeIndicator']).value !== null
        && this.maintainFWBForm.get(['otherCharges', i, 'otherChargeIndicator']).value.length > 0)
        || (this.maintainFWBForm.get(['otherCharges', i, 'otherChargeCode']).value !== null
          && this.maintainFWBForm.get(['otherCharges', i, 'otherChargeCode']).value.length > 0)
        || (this.maintainFWBForm.get(['otherCharges', i, 'entitlementCode']).value !== null
          && this.maintainFWBForm.get(['otherCharges', i, 'entitlementCode']).value.length > 0)
        || (this.maintainFWBForm.get(['otherCharges', i, 'chargeAmount']).value !== null
          && this.maintainFWBForm.get(['otherCharges', i, 'chargeAmount']).value.length > 0)) {
        this.maintainFWBForm.get(['otherCharges', i, 'otherChargeIndicator']).setValidators([Validators.required, Validators.maxLength(1)]);
        this.maintainFWBForm.get(['otherCharges', i, 'otherChargeCode']).setValidators([Validators.required, Validators.maxLength(2)]);
        this.maintainFWBForm.get(['otherCharges', i, 'entitlementCode']).setValidators([Validators.required, Validators.maxLength(1)]);

        this.maintainFWBForm.get(['otherCharges', i, 'chargeAmount']).setValidators([Validators.required]);

        if ((this.maintainFWBForm.get(['otherCharges', i, 'otherChargeIndicator']).value !== null
          && this.maintainFWBForm.get(['otherCharges', i, 'otherChargeIndicator']).value.length == 0)
          || (this.maintainFWBForm.get(['otherCharges', i, 'otherChargeCode']).value !== null
            && this.maintainFWBForm.get(['otherCharges', i, 'otherChargeCode']).value.length == 0)
          || (this.maintainFWBForm.get(['otherCharges', i, 'entitlementCode']).value !== null
            && this.maintainFWBForm.get(['otherCharges', i, 'entitlementCode']).value.length == 0)

          || (this.maintainFWBForm.get(['otherCharges', i, 'chargeAmount']).value !== null
            && this.maintainFWBForm.get(['otherCharges', i, 'chargeAmount']).value.length == 0
          )) {
          this.showInfoStatus('import.info128');
          return;
        }
      }
    }



    if (this.maintainFWBForm.get('shipperInfo.customerName').value != null
      && this.maintainFWBForm.get('shipperInfo.customerName').value.length > 0) {
      this.maintainFWBForm.get('shipperInfo.customerName').setValidators([Validators.required]);
      this.maintainFWBForm.get('shipperInfo.customerAddressInfo.streetAddress1').setValidators([Validators.required]);
      this.maintainFWBForm.get('shipperInfo.customerAddressInfo.customerPlace').setValidators([Validators.maxLength(17), Validators.required]);
      this.maintainFWBForm.get('shipperInfo.customerAddressInfo.countryCode').setValidators([Validators.maxLength(2), Validators.required]);
      if (this.maintainFWBForm.get('shipperInfo.customerAddressInfo.streetAddress1').value == null
        || this.maintainFWBForm.get('shipperInfo.customerAddressInfo.streetAddress1').value.length == 0
        || this.maintainFWBForm.get('shipperInfo.customerAddressInfo.customerPlace').value == null
        || this.maintainFWBForm.get('shipperInfo.customerAddressInfo.customerPlace').value.length == 0
        || this.maintainFWBForm.get('shipperInfo.customerAddressInfo.countryCode').value == null
        || this.maintainFWBForm.get('shipperInfo.customerAddressInfo.countryCode').value.length == 0) {
        this.showInfoStatus('import.info129');
        return;
      }
    }
    let shipperContactInfo = (<NgcFormArray>this.maintainFWBForm.get('shipperInfo.customerAddressInfo.customerContactInfo'));
    let shippereError = false;
    if (shipperContactInfo.length > 0) {
      shipperContactInfo.controls.forEach((data: NgcFormGroup, index) => {
        if (data.get('contactIdentifier').value != null && data.get('contactDetail').value == null) {
          shippereError = true;
        }
      });
      if (shippereError) {
        this.showErrorStatus('imp.err129');
        return;
      }
    }

    if (this.maintainFWBForm.get('alsoNotify.customerName').value != null
      && this.maintainFWBForm.get('alsoNotify.customerName').value.length > 0) {
      this.maintainFWBForm.get('alsoNotify.customerName').setValidators([Validators.required]);
      this.maintainFWBForm.get('alsoNotify.customerAddressInfo.streetAddress1').setValidators([Validators.required]);
      this.maintainFWBForm.get('alsoNotify.customerAddressInfo.customerPlace').setValidators([Validators.maxLength(17), Validators.required]);
      this.maintainFWBForm.get('alsoNotify.customerAddressInfo.countryCode').setValidators([Validators.maxLength(2), Validators.required]);
      if (this.maintainFWBForm.get('alsoNotify.customerAddressInfo.streetAddress1').value == null
        || this.maintainFWBForm.get('alsoNotify.customerAddressInfo.streetAddress1').value.length == 0
        || this.maintainFWBForm.get('alsoNotify.customerAddressInfo.customerPlace').value == null
        || this.maintainFWBForm.get('alsoNotify.customerAddressInfo.customerPlace').value.length == 0
        || this.maintainFWBForm.get('alsoNotify.customerAddressInfo.countryCode').value == null
        || this.maintainFWBForm.get('alsoNotify.customerAddressInfo.countryCode').value.length == 0) {
        this.showInfoStatus('import.info130');
        return;
      }
    }

    let alsoNotifyContactInfo = (<NgcFormArray>this.maintainFWBForm.get('alsoNotify.customerAddressInfo.customerContactInfo'));
    let alsoNotifyError = false;
    if (alsoNotifyContactInfo.length > 0) {
      alsoNotifyContactInfo.controls.forEach((data: NgcFormGroup, index) => {
        if (data.get('contactIdentifier').value != null && data.get('contactDetail').value == null) {
          alsoNotifyError = true;
        }
      });

      if (alsoNotifyError) {
        this.showErrorStatus('imp.err130');
        return;
      }
    }

    // opi dulicate checks opiHashTable
    let opiArray = (<NgcFormArray>this.maintainFWBForm.get('otherParticipantInfo')).getRawValue();
    for (let i = 0; i < opiArray.length; i++) {
      for (let j = 0; j < opiArray.length; j++) {
        if (i != j) {
          if (opiArray[i].participantName == opiArray[j].participantName
            && opiArray[i].airportCityCode == opiArray[j].airportCityCode
            && opiArray[i].officeFunctionDesignator == opiArray[j].officeFunctionDesignator
            && opiArray[i].companyDesignator == opiArray[j].companyDesignator
            && opiArray[i].fileReference == opiArray[j].fileReference
            && opiArray[i].opiParticipantIdentifier == opiArray[j].opiParticipantIdentifier
            && opiArray[i].opiAirportCityCode == opiArray[j].opiAirportCityCode
            && opiArray[i].opiParticipantCode == opiArray[j].opiParticipantCode
          ) {
            this.showInfoStatus("import.info122");
            return;
          }
        }
      }
    }


    let rateDescription = (<NgcFormArray>this.maintainFWBForm.get('rateDescription')).getRawValue();
    let rateDescrpptionvalidator: boolean = false;
    let rateDescriptionRateClassCodeEmpty: boolean = false;
    let rateDescriptionOtherInfoCheck: boolean = false;
    for (let i = 0; i < rateDescription.length; i++) {
      let rateDescriptionOtherInfo = rateDescription[i].rateDescriptionOtherInfo;
      if (!rateDescription[i].rateClassCode) {
        rateDescriptionRateClassCodeEmpty = true;
      }
      rateDescriptionOtherInfo.forEach(rateDescriptionOtherInfoElement => {
        if (rateDescriptionOtherInfoElement.flagCRUD != 'D' &&
          rateDescriptionOtherInfoElement.rateLine && rateDescriptionOtherInfoElement.rateLine != "1") {
          rateDescriptionOtherInfoCheck = true;
        }
        if (rateDescriptionOtherInfoElement.rateLine == 'NV') {
          let vloumeAmmount = '' + rateDescriptionOtherInfoElement.volumeAmount;
          let data = parseFloat(vloumeAmmount);
          if (data < 0.01 || data > 999999999) {
            rateDescrpptionvalidator = true;
          }
        }
      });
    };

    if (rateDescription.length < 1 || rateDescriptionRateClassCodeEmpty || !rateDescriptionOtherInfoCheck) {
      this.showErrorMessage("rtd.is.mandatory")
      this.rateDescIcon = "error";
      return
    }
    if (rateDescrpptionvalidator) {
      this.showErrorMessage("rtd.volume.allow.value.range")
      this.rateDescIcon = "error";
      return
    }

    if (this.maintainFWBForm.get('chargeDeclaration.fwbCarriageValueDeclaration').value ==
      this.maintainFWBForm.get('chargeDeclaration.carriageValueDeclaration').value) {
      maintainFwbDetails.chargeDeclaration.fwbCarriageValueDeclaration = '';
    }
    if (this.maintainFWBForm.get('chargeDeclaration.fwbCustomsValueDeclaration').value ==
      this.maintainFWBForm.get('chargeDeclaration.customsValueDeclaration').value) {
      maintainFwbDetails.chargeDeclaration.fwbCustomsValueDeclaration = '';
    }
    if (this.maintainFWBForm.get('chargeDeclaration.fwbInsuranceValueDeclaration').value ==
      this.maintainFWBForm.get('chargeDeclaration.insuranceValueDeclaration').value) {
      maintainFwbDetails.chargeDeclaration.fwbInsuranceValueDeclaration = '';
    }





    maintainFwbDetails.awbNumber = this.maintainFWBForm.get('maintainFWBSearch.awbNumber').value;
    this.newPieces = this.maintainFWBForm.get('pieces').value;
    this.newWeight = this.maintainFWBForm.get('weight').value;

    //console.log(maintainFwbDetails);
    this.importService.saveMaintainFwbDetails(maintainFwbDetails).subscribe(data => {
      this.resp = data;


      if (!this.showResponseErrorMessages(data)) {
        //console.log(data);
        this.rtdDeletecount = 1;
        this.showSuccessStatus('g.completed.successfully');
        this.onSearch();
      }
      else {
        if (this.maintainFWBForm.get('accountingInfo').invalid == true
          || this.maintainFWBForm.get('chargeDeclaration').invalid == true) {
          this.accountingInfoIcon = "error";
        } else {
          this.accountingInfoIcon = "";
        }
        if (this.maintainFWBForm.get('flightBooking').invalid == true
          || this.maintainFWBForm.get('routing').invalid == true) {
          this.flightRoutingIcon = "error";
        } else {
          this.flightRoutingIcon = "";
        }
        if (this.maintainFWBForm.get('shipperInfo').invalid == true
          || this.maintainFWBForm.get('consigneeInfo').invalid == true) {
          this.shipperConsigneeIcon = "error";
        } else {
          this.shipperConsigneeIcon = "";
        }
        if (this.maintainFWBForm.get('alsoNotify').invalid == true
          || this.maintainFWBForm.get('agentInfo').invalid == true) {
          this.notifyAgentIcon = "error";
        } else {
          this.notifyAgentIcon = "";
        }
        if (this.maintainFWBForm.get('ssrInfo').invalid == true
          || this.maintainFWBForm.get('osiInfo').invalid == true) {
          this.ssrOsiIcon = "error";
        } else {
          this.ssrOsiIcon = "";
        }
        if (this.maintainFWBForm.get('rateDescription').invalid == true) {
          this.rateDescIcon = "error";
        } else {
          this.rateDescIcon = "";
        }
        if (this.maintainFWBForm.get('otherCharges').invalid == true
          || this.maintainFWBForm.get('ppd').invalid == true
          || this.maintainFWBForm.get('col').invalid == true) {
          this.chargesPpdColIcon = "error";
        } else {
          this.chargesPpdColIcon = "";
        }

        if (this.maintainFWBForm.get('fwbNominatedHandlingParty').invalid == true
          || this.maintainFWBForm.get('shipmentReferenceInfor').invalid == true) {
          this.ardNomSrnIcon = "error";
        } else {
          this.ardNomSrnIcon = "";
        }
        if (this.maintainFWBForm.get('otherParticipantInfo').invalid == true
        ) {
          this.opiIcon = "error";
        } else {
          this.opiIcon = "";
        }
        if (this.maintainFWBForm.get('otherCustomsInfo').invalid == true
        ) {
          this.ociIcon = "error";
        } else {
          this.ociIcon = "";
        }
        if (this.maintainFWBForm.get('chargeDestCurrency').invalid == true
        ) {
          this.cdcIcon = "error";
        } else {
          this.cdcIcon = "";
        }

      }
    }, error => {
      this.showErrorStatus(error);

    });
  }


  rtdTotalAmmountCharge(event, item: any) {
    this.maintainFWBForm.get(['ppd', 'totalWeightChargeAmount']).setValue(event);
  }

  public clearHashTable() {
    this.hashTable = {};
    this.rtdoiHashTable = {};
    this.accInfoHashTable = {};
    this.othChargeHashTable = {};
    this.opiHashTable = {};
    this.otherCustomsHashTable = {};
    return;
  }

  public onDeleteAll() {
    const maintainFwbDetails = this.maintainFWBForm.getRawValue();
    // const maintainFwbDetails: MaintainFwbRequest = new MaintainFwbRequest();
    this.showConfirmMessage('delete.this.fwb').then(reason => {

      this.importService.deleteMaintainFwbDetails(maintainFwbDetails).subscribe(data => {
        this.resp = data;
        this.responseArray = this.resp.data;
        if (this.showResponseErrorMessages(data)) {
          return;
        }
        if (this.resp.data !== null) {
          this.showSuccessStatus('g.completed.successfully');

          this.maintainFWBForm.reset();
          this.showTable = false;
          // this.onSearch();
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors);
          this.showTable = false;
          //this.showErrorStatus(this.errors[0].message);
        }
      },
        error => {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors);
          //this.showErrorStatus(this.errors[0].message);
        }
      );
    }).catch(reason => {
    });
  }

  public ppdColTotal() {
    this.maintainFWBForm.get('ppd').valueChanges.subscribe(data => {

      var totalAmount = Number(data['totalWeightChargeAmount']) + Number(data['valuationChargeAmount']) +
        Number(data['totalOtherChargesDueCarrierChargeAmount']) + Number(data['totalOtherChargesDueAgentChargeAmount']) +
        Number(data['taxesChargeAmount']);
      if (Number(data['chargeSummaryTotalChargeAmount']) !== totalAmount) {
        this.maintainFWBForm.get(['ppd', 'chargeSummaryTotalChargeAmount']).setValue(Number(totalAmount));
      }
    });
    this.maintainFWBForm.get('col').valueChanges.subscribe(data => {

      var totalAmount = Number(data['totalWeightChargeAmount']) + Number(data['valuationChargeAmount']) +
        Number(data['totalOtherChargesDueCarrierChargeAmount']) + Number(data['totalOtherChargesDueAgentChargeAmount']) +
        Number(data['taxesChargeAmount']);
      if (Number(data['chargeSummaryTotalChargeAmount']) !== totalAmount) {
        this.maintainFWBForm.get(['col', 'chargeSummaryTotalChargeAmount']).setValue(Number(totalAmount));
      }
    });
  }


  //cdc calculation
  public cdcTotal() {
    this.maintainFWBForm.get('chargeDestCurrency').valueChanges.subscribe(data => {

      var totalAmount = data['destinationCurrencyChargeAmount'] + data['chargesAtDestinationChargeAmount'];
      if (data['totalCollectChargesChargeAmount'] !== totalAmount) {
        this.maintainFWBForm.get(['chargeDestCurrency', 'totalCollectChargesChargeAmount']).setValue(totalAmount);
      }
    });
  }

  ondeleteRowNotification(sindex) {
    (this.maintainFWBForm.get(['rateDescription', sindex, 'rateDescriptionOtherInfo']) as NgcFormGroup).markAsDeleted();
  }

  onAddRowNotification(sindex) {
    if ((<NgcFormArray>this.maintainFWBForm.get(["rateDescription", sindex, "rateDescriptionOtherInfo"])).length > 9) {
      this.showInfoStatus("import.info120");
      return;
    }
    (<NgcFormArray>this.maintainFWBForm.get(['rateDescription', sindex, 'rateDescriptionOtherInfo'])).addValue([
      {

        "natureOfGoodsDescription": "",
        "measurementUnitCode": "CMT",
        "dimensionLength": "",
        "dimensionHeight": "",
        "dimensionWIdth": "",
        "numberOfPieces": "",
        "weight": null,
        "volumeUnitCode": "MC",
        "volumeAmount": null,
        "uldNumber": "",
        "harmonisedCommodityCode": "",
        "slacCount": "",
        "noDimensionAvailable": false,
        "serviceCode": "",
        "countryCode": "",
        "rateLine": 1

      }
    ]);




  }

  onSelectShipperName(event, item) {
    if (event.code) {
      this.maintainFWBForm.get(['shipperInfo', 'customerAddressInfo', 'streetAddress1']).setValue(event.param1);
      this.maintainFWBForm.get(['shipperInfo', 'customerAddressInfo', 'customerPlace']).setValue(event.param2);
      this.maintainFWBForm.get(['shipperInfo', 'customerAddressInfo', 'postalCode']).setValue(event.parameter1);
      if (event.parameter2) {
        this.maintainFWBForm.get('shipperInfo.customerAddressInfo.stateCode').setValue(event.parameter2);
      }

      this.maintainFWBForm.get(['shipperInfo', 'customerAddressInfo', 'countryCode']).setValue(event.parameter3);
      this.maintainFWBForm.get(['shipperInfo', 'customerAccountNumber']).setValue(event.param4);
      this.maintainFWBForm.get(['shipperInfo', 'customerName']).setValue(event.desc);
    }
  }

  onSelectConsigneeName(event, item) {
    if (event.code) {
      this.maintainFWBForm.get(['consigneeInfo', 'customerAddressInfo', 'streetAddress1']).setValue(event.param1);
      this.maintainFWBForm.get(['consigneeInfo', 'customerAddressInfo', 'customerPlace']).setValue(event.param2);
      this.maintainFWBForm.get(['consigneeInfo', 'customerAddressInfo', 'postalCode']).setValue(event.parameter1);
      if (event.parameter1) {
        this.maintainFWBForm.get('consigneeInfo.customerAddressInfo.stateCode').setValue(event.parameter2);
      }
      this.maintainFWBForm.get(['consigneeInfo', 'customerAddressInfo', 'countryCode']).setValue(event.parameter3);
      this.maintainFWBForm.get(['consigneeInfo', 'customerAccountNumber']).setValue(event.param4);
      this.maintainFWBForm.get(['consigneeInfo', 'customerName']).setValue(event.desc);
    }
  }


  public onCompanyLOVSelect(event) {
    //const dataRoute: FetchRouting = new FetchRouting();
    const dataRoute: AwbRoutingReqModel = new AwbRoutingReqModel();
    let destAirport = this.maintainFWBForm.get('destination').value;
    let originAirport = this.maintainFWBForm.get('origin').value;
    let flightData = (<NgcFormArray>this.maintainFWBForm.get('flightBooking')).getRawValue();
    let flightCarrierCode = flightData[0].carrierCode;
    let flightNumber1 = flightData[0].flightNumber;
    let flighDate1 = flightData[0].flightDate;

    dataRoute.shipmentNumber = this.maintainFWBForm.get('awbNumber').value;
    dataRoute.shipmentDate = this.maintainFWBForm.get('awbDate').value;
    this.importService.fetchRouteDetails(dataRoute).subscribe(data => {
      this.resp = data;
      this.responseArray = this.resp.data;
      if (this.resp.data !== null) {
        (<NgcFormArray>this.maintainFWBForm.get('routing')).resetValue;
        console.log(this.resp.data);
        // this.onSelectDestination(this.responseArray);
        let len = this.responseArray.length();
        if (!len) {
          len = 0;
        }
        for (let i = 0; i < len; i++) {
          this.maintainFWBForm.get(['routing', i, 'airportCode']).setValue(this.responseArray.routing[i].nextCarrier);
        }
      }
    },
      error => {
        this.errors = this.resp.messageList;
        this.showErrorStatus(this.errors[0].message);
      }
    );

  }

  onSelectDestination(event) {
    //let destAirport = this.maintainFWBForm.get('destination').value;
    if (event.viaDest == null && event.fromOrigin != null) {
      this.maintainFWBForm.get(['routing', 0, 'airportCode']).setValue(event.fromOrigin);
      this.maintainFWBForm.get(['routing', 0, 'carrierCode']).setValue(event.carrierCode);
      this.maintainFWBForm.get(['routing', 1, 'airportCode']).setValue(event.toDest);
      this.maintainFWBForm.get(['routing', 1, 'carrierCode']).setValue(event.tocarrierCode);
      this.maintainFWBForm.get(['routing', 2, 'airportCode']).reset();
      this.maintainFWBForm.get(['routing', 2, 'carrierCode']).reset();
      // this.maintainFWBForm.get(['routing', 1, 'airportCode']).clearValidators();
      this.maintainFWBForm.get(['routing', 2, 'airportCode']).clearValidators();


    }

    else if (event.viaDest == null) {
      this.maintainFWBForm.get(['routing', 0, 'airportCode']).setValue(event.toDest);
      this.maintainFWBForm.get(['routing', 0, 'carrierCode']).setValue(event.carrierCode);
      this.maintainFWBForm.get(['routing', 1, 'airportCode']).reset();
      this.maintainFWBForm.get(['routing', 1, 'carrierCode']).reset();
      this.maintainFWBForm.get(['routing', 2, 'airportCode']).reset();
      this.maintainFWBForm.get(['routing', 2, 'carrierCode']).reset();
      this.maintainFWBForm.get(['routing', 1, 'airportCode']).clearValidators();
      this.maintainFWBForm.get(['routing', 2, 'airportCode']).clearValidators();


    }

    else {
      this.maintainFWBForm.get(['routing', 0, 'airportCode']).setValue(event.airportCode);
      this.maintainFWBForm.get(['routing', 0, 'carrierCode']).setValue(event.carrierCode);
      if (event.viaDest != null) {
        this.maintainFWBForm.get(['routing', 1, 'airportCode']).setValue(event.viaDest);
        this.maintainFWBForm.get(['routing', 1, 'carrierCode']).setValue(event.carrierCode);
        this.maintainFWBForm.get(['routing', 2, 'airportCode']).setValue(event.toDest);
        this.maintainFWBForm.get(['routing', 2, 'carrierCode']).setValue(event.tocarrierCode);
      }
      else {
        this.maintainFWBForm.get(['routing', 1, 'airportCode']).setValue(event.toDest);
        this.maintainFWBForm.get(['routing', 1, 'carrierCode']).setValue(event.carrierCode);
        this.maintainFWBForm.get(['routing', 2, 'airportCode']).reset();
        this.maintainFWBForm.get(['routing', 2, 'carrierCode']).reset();
        this.maintainFWBForm.get(['routing', 2, 'airportCode']).clearValidators();
      }
    }

  }

  makeRequired(item) {
    if (item) {
      this.showwithrequired = true;
      this.showwithoutrequired = false
    }
  }

  makeRefReuired(item) {
    if (item) {
      this.showwithoutRefRequired = false;
      this.showwithRefRequired = true;
    }
  }

  makeRefReuiredPart2(item) {
    if (item) {
      this.showwithoutRefRequired1 = false;
      this.showwithRefRequired1 = true;
    }
  }



  makeAgentRequired(item) {
    if (item) {
      this.showWithoutAgentRequired = false;
      this.showWithAgentRequired = true;
    }
  }


  onChange(event, sitem) {
    let val = event.srcElement.children[1].value;
    sitem.get('rateLine').patchValue(val);
  }


  onDeleteContact(event, sindex) {
    (<NgcFormArray>this.maintainFWBForm.get('shipperInfo.customerAddressInfo.customerContactInfo')).controls.forEach(
      (group: NgcFormGroup, index) => {
        if (index === sindex) {
          group.markAsDeleted();
        }
      }
    );
    this.shipperContactLength = (<NgcFormArray>this.maintainFWBForm.get('shipperInfo.customerAddressInfo.customerContactInfo')).length - 1;
  }
  onDeleteConsigneeContact(event, sindex) {
    (<NgcFormArray>this.maintainFWBForm.get('consigneeInfo.customerAddressInfo.customerContactInfo')).controls.forEach(
      (group: NgcFormGroup, index) => {
        if (index === sindex) {
          group.markAsDeleted();
        }
      }
    );
    this.consigneeContactLength = (<NgcFormArray>this.maintainFWBForm.get('consigneeInfo.customerAddressInfo.customerContactInfo')).length - 1;
  }
  onDeleteAlsoNotifyContact(event, sindex) {
    (<NgcFormArray>this.maintainFWBForm.get('alsoNotify.customerAddressInfo.customerContactInfo')).controls.forEach(
      (group: NgcFormGroup, index) => {
        if (index === sindex) {
          group.markAsDeleted();
        }
      }
    );
    this.alsoNotiyConatctLength = (<NgcFormArray>this.maintainFWBForm.get('alsoNotify.customerAddressInfo.customerContactInfo')).length - 1;
  }

  // chargeableWeight
  // rateChargeAmount
  onChargableWeight(event, item, index) {
    let charge = event;
    let rate = 0;
    if (item.get('rateChargeAmount').value) {
      rate = Number(item.get('rateChargeAmount').value);
    }

    //If rate charge value is M/B/U/R/S then do not calculate total charge amount multiplied by rate/charge
    if (item.get('rateClassCode').value === 'M'
      || item.get('rateClassCode').value === 'B'
      || item.get('rateClassCode').value === 'U') {
      item.get('totalChargeAmount').patchValue(Number(item.get('rateChargeAmount').value));
    } else if (item.get('rateClassCode').value === 'R' || item.get('rateClassCode').value === 'S') {
      item.get('totalChargeAmount').patchValue(0.0);
    } else {
      this.calculateTotalChargeAmount(charge, rate, item, index)
    }
  }

  onRateCharge(event, item, index) {
    let rate = Number(event);
    let charge = 0;
    if (item.get('chargeableWeight').value) {
      charge = Number(item.get('chargeableWeight').value);
    }
    //If rate charge value is M/B/U/R/S then do not calculate total charge amount multiplied by rate/charge
    if (item.get('rateClassCode').value === 'M'
      || item.get('rateClassCode').value === 'B'
      || item.get('rateClassCode').value === 'U') {
      item.get('totalChargeAmount').patchValue(Number(item.get('rateChargeAmount').value));
    } else if (item.get('rateClassCode').value === 'R' || item.get('rateClassCode').value === 'S') {
      item.get('totalChargeAmount').patchValue(0.0);
    } else {
      this.calculateTotalChargeAmount(charge, rate, item, index);
    }
  }

  onRateClassChange(event, item, index) {
    item.get('totalChargeAmount').patchValue(0.0);
    item.get('rateChargeAmount').patchValue(0.0);

  }

  calculateTotalChargeAmount(RateCharge: any, rateChargeAmount: any, sitem: any, index: any) {
    this.sumOftotalCharge = 0;
    this.charegeItems = { Amount: 0, ind: null };
    let totalChargeAmmount = Number(RateCharge) * Number(rateChargeAmount);
    let totalChargeAmountWithoutRounding = "0";
    if (totalChargeAmmount.toString().indexOf(".") > 0) {
      totalChargeAmountWithoutRounding = totalChargeAmmount.toString().substring(0, totalChargeAmmount.toString().indexOf(".") + 3);
    }
    else {
      totalChargeAmountWithoutRounding = totalChargeAmmount.toString();
    }
    //sitem.get('totalChargeAmount').patchValue(Number(totalChargeAmmount));
    sitem.get('totalChargeAmount').patchValue(Number(totalChargeAmountWithoutRounding));
    //    this.newCharge = sitem.get('totalChargeAmount').value;
    if (this.chargesArray.length > 0) {
      this.chargesArray.filter(p => {
        if (p.ind === index) {
          let inde = this.chargesArray.indexOf(p);
          if (inde > -1) {
            this.chargesArray.splice(inde, 1);

          }


        }

      })
      this.charegeItems['Amount'] = Number(sitem.get('totalChargeAmount').value);
      this.charegeItems['ind'] = index;
      this.chargesArray.push(this.charegeItems);

    } else {

      this.charegeItems['Amount'] = Number(sitem.get('totalChargeAmount').value);
      this.charegeItems['ind'] = index;
      this.chargesArray.push(this.charegeItems);

    }
    //console.log(this.chargesArray);
    this.chargesArray.forEach(data => {
      let val = data['Amount'];
      if (this.sumOftotalCharge > 0) {
        this.sumOftotalCharge = this.sumOftotalCharge + val;
      } else {
        this.sumOftotalCharge = val;
      }

    });
    if (this.maintainFWBForm.get('chargeDeclaration.prepaIdCollectChargeDeclaration').value === 'PP') {
      this.maintainFWBForm.get('ppd.totalWeightChargeAmount').patchValue(Number(this.sumOftotalCharge));
      this.maintainFWBForm.get('col.totalWeightChargeAmount').setValue(0);
      //this.ppdColTotal();
      this.ppdAdd();
      this.colAdd();
    } else if (this.maintainFWBForm.get('chargeDeclaration.prepaIdCollectChargeDeclaration').value === 'CC') {
      this.maintainFWBForm.get('col.totalWeightChargeAmount').patchValue(Number(this.sumOftotalCharge));
      this.maintainFWBForm.get('ppd.totalWeightChargeAmount').setValue(0);
      //this.ppdColTotal();
      this.ppdAdd();
      this.colAdd();
    }
  }
  OncalculateTotalChargeAmount(event, item) {

    this.maintainFWBForm.get('ppd.totalOtherChargesDueCarrierChargeAmount').patchValue(0);
    this.maintainFWBForm.get('col.totalOtherChargesDueAgentChargeAmount').patchValue(0);
    this.maintainFWBForm.get('col.totalOtherChargesDueCarrierChargeAmount').patchValue(0);
    this.maintainFWBForm.get('ppd.totalOtherChargesDueAgentChargeAmount').patchValue(0);
    (this.maintainFWBForm.get('otherCharges') as NgcFormArray).controls.forEach((formgroup: NgcFormGroup) => {

      formgroup.get('entitlementCode').setValue('A');

      if (formgroup.get('otherChargeIndicator').value && formgroup.get('otherChargeIndicator').value === 'C') {
        let chargeamount = this.maintainFWBForm.get('col.totalOtherChargesDueAgentChargeAmount').value;
        let charge = formgroup.get('chargeAmount').value;
        chargeamount = Number(chargeamount);
        charge = Number(charge);
        let totalOtherChargesDueAgentChargeAmount = chargeamount + charge;
        this.maintainFWBForm.get('col.totalOtherChargesDueAgentChargeAmount').patchValue(Number(totalOtherChargesDueAgentChargeAmount));
      }
      else if (formgroup.get('otherChargeIndicator').value && formgroup.get('otherChargeIndicator').value === 'P') {
        let chargeamount = this.maintainFWBForm.get('ppd.totalOtherChargesDueAgentChargeAmount').value;
        let charge = formgroup.get('chargeAmount').value;
        chargeamount = Number(chargeamount);
        charge = Number(charge);
        let totalOtherChargesDueAgentChargeAmount = chargeamount + charge;
        this.maintainFWBForm.get('ppd.totalOtherChargesDueAgentChargeAmount').patchValue(Number(totalOtherChargesDueAgentChargeAmount));
      }
      //this.ppdColTotal();
      this.ppdAdd();
      this.colAdd();
    });

    (this.maintainFWBForm.get('otherChargesCarrier') as NgcFormArray).controls.forEach((formgroup: NgcFormGroup) => {


      formgroup.get('entitlementCode').setValue('C')


      if (formgroup.get('otherChargeIndicator').value && formgroup.get('otherChargeIndicator').value === 'P') {
        let chargeamount = this.maintainFWBForm.get('ppd.totalOtherChargesDueCarrierChargeAmount').value;
        let charge = formgroup.get('chargeAmount').value;
        chargeamount = Number(chargeamount);
        charge = Number(charge);
        let totalOtherChargesDueAgentChargeAmount = chargeamount + charge;
        this.maintainFWBForm.get('ppd.totalOtherChargesDueCarrierChargeAmount').patchValue(Number(totalOtherChargesDueAgentChargeAmount));
      }

      else if (formgroup.get('otherChargeIndicator').value && formgroup.get('otherChargeIndicator').value === 'C') {
        let chargeamount = this.maintainFWBForm.get('col.totalOtherChargesDueCarrierChargeAmount').value;
        let charge = formgroup.get('chargeAmount').value;
        chargeamount = Number(chargeamount);
        charge = Number(charge);
        let totalOtherChargesDueAgentChargeAmount = chargeamount + charge;
        this.maintainFWBForm.get('col.totalOtherChargesDueCarrierChargeAmount').patchValue(Number(totalOtherChargesDueAgentChargeAmount));
      }

      this.ppdAdd();
      this.colAdd();
    });

  }
  OnChangeIndicatorCode(event, item) {
    item.get('chargeAmount').patchValue(0);
    let ChargeInfo = ['PC', 'PA', 'CC', 'CA'];
    let existingCharge = [];
    (this.maintainFWBForm.get('otherCharges') as NgcFormArray).controls.forEach((formgroup: NgcFormGroup, index) => {
      let p = formgroup.get('otherChargeIndicator').value;
      let c = formgroup.get('entitlementCode').value;
      let inde = ChargeInfo.indexOf(p + c);
      if (inde > -1) {
        ChargeInfo.splice(inde, 1);
      }
      (this.maintainFWBForm.get('otherCharges') as NgcFormArray).controls.forEach((formgroup: NgcFormGroup, indexs) => {
        if (indexs != index && ((formgroup.get('otherChargeIndicator').value === p) && (formgroup.get('entitlementCode').value === c))) {
          formgroup.get('chargeAmount').patchValue(0);
        }
      });
    });
    for (let charge of ChargeInfo) {
      if (charge === 'PC') {
        this.maintainFWBForm.get('ppd.totalOtherChargesDueCarrierChargeAmount').patchValue(0);

      }
      else if (charge === 'PA') {
        this.maintainFWBForm.get('ppd.totalOtherChargesDueAgentChargeAmount').patchValue(0);

      } else if (charge === 'CA') {
        this.maintainFWBForm.get('col.totalOtherChargesDueAgentChargeAmount').patchValue(0);

      }
      else if (charge === 'CC') {
        this.maintainFWBForm.get('col.totalOtherChargesDueCarrierChargeAmount').patchValue(0);

      }
    }

    //this.ppdColTotal();
    this.ppdAdd();
    this.colAdd();
  }

  OnChangeEntitleCode(event, item) {
    item.get('chargeAmount').patchValue(0);
    this.ppdAdd();
    this.colAdd();
  }
  onChangeNog(event, index) {
    this.maintainFWBForm.get('natureOfgoods').patchValue(event);
  }

  onPrint() {
    this.reportParameters.shipmentNumber = this.maintainFWBForm.get('awbNumber').value;
    // alert(JSON.stringify(this.reportParameters));
    this.reportWindow.open();
  }
  disableInnerForm() {
    this.maintainFWBForm.get('chargeDestCurrency').disable();
    this.maintainFWBForm.get('chargeDeclaration').disable();
    this.maintainFWBForm.get('shipperInfo').disable();
    this.maintainFWBForm.get('alsoNotify').disable();
    this.maintainFWBForm.get('fwbNominatedHandlingParty').disable();
    this.maintainFWBForm.get('consigneeInfo').disable();
    this.maintainFWBForm.get('otherCharges').disable();
    this.maintainFWBForm.get('accountingInfo').disable();
    this.maintainFWBForm.get('ssrInfo').disable();
    this.maintainFWBForm.get('osiInfo').disable();
    this.maintainFWBForm.get('shipmentReferenceInfor').disable();
    this.maintainFWBForm.get('col').disable();
    this.maintainFWBForm.get('ppd').disable();
    this.maintainFWBForm.get('otherParticipantInfo').disable();
    this.maintainFWBForm.get('senderReference').disable();
    this.maintainFWBForm.get('otherCustomsInfo').disable();
    this.maintainFWBForm.get('shcode').disable();
    this.maintainFWBForm.get('saveUpdateShipment').disable();
    this.maintainFWBForm.get('flightBooking').disable();
    this.maintainFWBForm.get('routing').disable();
    this.maintainFWBForm.get('rateDescription').disable();
    this.maintainFWBForm.get('rateDescriptionOtherInfo').disable();
    this.maintainFWBForm.get('agentInfo').disable();
  }

  onCancel(event) {
    this.navigateBack(this.forwardedData);
  }

  //----------------------------- new calculation code-------------------

  ppdAdd() {
    let sum = 0;
    if (this.maintainFWBForm.get('ppd').get('valuationChargeAmount').value != null)
      sum = sum + Number(this.maintainFWBForm.get('ppd').get('valuationChargeAmount').value);

    if (this.maintainFWBForm.get('ppd').get('totalWeightChargeAmount').value != null)
      sum = sum + Number(this.maintainFWBForm.get('ppd').get('totalWeightChargeAmount').value);

    if (this.maintainFWBForm.get('ppd').get('taxesChargeAmount').value != null)
      sum = sum + Number(this.maintainFWBForm.get('ppd').get('taxesChargeAmount').value);

    if (this.maintainFWBForm.get('ppd').get('totalOtherChargesDueAgentChargeAmount').value != null)
      sum = sum + Number(this.maintainFWBForm.get('ppd').get('totalOtherChargesDueAgentChargeAmount').value);

    if (this.maintainFWBForm.get('ppd').get('totalOtherChargesDueCarrierChargeAmount').value != null)
      sum = sum + Number(this.maintainFWBForm.get('ppd').get('totalOtherChargesDueCarrierChargeAmount').value);

    this.maintainFWBForm.get('ppd').get('chargeSummaryTotalChargeAmount').setValue(Number(sum));
  }
  colAdd() {
    let sum = 0;
    if (this.maintainFWBForm.get('col').get('valuationChargeAmount').value != null)
      sum = sum + Number(this.maintainFWBForm.get('col').get('valuationChargeAmount').value);

    if (this.maintainFWBForm.get('col').get('totalWeightChargeAmount').value != null)
      sum = sum + Number(this.maintainFWBForm.get('col').get('totalWeightChargeAmount').value);

    if (this.maintainFWBForm.get('col').get('taxesChargeAmount').value != null)
      sum = sum + Number(this.maintainFWBForm.get('col').get('taxesChargeAmount').value);

    if (this.maintainFWBForm.get('col').get('totalOtherChargesDueAgentChargeAmount').value != null)
      sum = sum + Number(this.maintainFWBForm.get('col').get('totalOtherChargesDueAgentChargeAmount').value);

    if (this.maintainFWBForm.get('col').get('totalOtherChargesDueCarrierChargeAmount').value != null)
      sum = sum + Number(this.maintainFWBForm.get('col').get('totalOtherChargesDueCarrierChargeAmount').value);

    this.maintainFWBForm.get('col').get('chargeSummaryTotalChargeAmount').setValue(Number(sum));
  }

  onCommodityRateChange(index) {
    let chargeableWeight = this.maintainFWBForm.get(['rateDescription', index, 'chargeableWeight']).value;
    let rateChargeAmount = this.maintainFWBForm.get(['rateDescription', index, 'rateChargeAmount']).value;
    let total: any = 0;
    let rateClass = this.maintainFWBForm.getRawValue().rateDescription[index].rateClassCode;
    if (rateClass == 'B' || rateClass == 'M' || rateClass == 'U') {
      total = Number(rateChargeAmount);
    } else if (rateClass == 'R' || rateClass == 'S') {
      total = 0;
    } else {
      total = (Number(rateChargeAmount) * Number(chargeableWeight)).toFixed(3);

    }
    this.maintainFWBForm.get(['rateDescription', index, 'totalChargeAmount']).patchValue(total);
    this.onTotalChargeAmount(index);
  }

  onTotalChargeAmount(index) {
    let data = this.maintainFWBForm.get(['rateDescription', index, 'totalChargeAmount']).value;
    let chargeDecl = this.maintainFWBForm.get('chargeDeclaration').get('prepaIdCollectChargeDeclaration').value;
    if (data || data == 0) {
      let totalRate: any = 0;
      this.maintainFWBForm.getRawValue().rateDescription.forEach(rate => {
        totalRate += Number(rate.totalChargeAmount);
      });
      //Considering both P and PP as Prepaid
      if (chargeDecl == "PP" || chargeDecl == "P") {
        this.maintainFWBForm.get('ppd').get('totalWeightChargeAmount').setValue(totalRate);
        this.maintainFWBForm.get('col').get('totalWeightChargeAmount').setValue(null);
      }
      //Considering both C and CC as Collect
      else if (chargeDecl == "CC" || chargeDecl == "C") {
        this.maintainFWBForm.get('col').get('totalWeightChargeAmount').setValue(totalRate);
        this.maintainFWBForm.get('ppd').get('totalWeightChargeAmount').setValue(null);
      }
    }
  }


  calculatePpdTotal() {
    var totalAmount = Number(this.maintainFWBForm.get(['ppd', 'totalWeightChargeAmount']).value) +
      Number(this.maintainFWBForm.get(['ppd', 'valuationChargeAmount']).value) +
      Number(this.maintainFWBForm.get(['ppd', 'totalOtherChargesDueCarrierChargeAmount']).value) +
      Number(this.maintainFWBForm.get(['ppd', 'totalOtherChargesDueAgentChargeAmount']).value) +
      Number(this.maintainFWBForm.get(['ppd', 'taxesChargeAmount']).value);
    if (Number(this.maintainFWBForm.get(['ppd', 'chargeSummaryTotalChargeAmount']).value) !== totalAmount) {
      this.maintainFWBForm.get(['ppd', 'chargeSummaryTotalChargeAmount']).setValue(Number(totalAmount));
    }
  }

  calculateColTotal() {
    var totalAmount = Number(this.maintainFWBForm.get(['col', 'totalWeightChargeAmount']).value) +
      Number(this.maintainFWBForm.get(['col', 'valuationChargeAmount']).value) +
      Number(this.maintainFWBForm.get(['col', 'totalOtherChargesDueCarrierChargeAmount']).value) +
      Number(this.maintainFWBForm.get(['col', 'totalOtherChargesDueAgentChargeAmount']).value) +
      Number(this.maintainFWBForm.get(['col', 'taxesChargeAmount']).value);
    if (Number(this.maintainFWBForm.get(['col', 'chargeSummaryTotalChargeAmount']).value) !== totalAmount) {
      this.maintainFWBForm.get(['col', 'chargeSummaryTotalChargeAmount']).setValue(Number(totalAmount));
    }
  }

}

