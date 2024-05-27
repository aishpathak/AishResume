import { ApplicationFeatures } from './../../common/applicationfeatures';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { ExportService } from './../export.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, Validators } from '@angular/forms';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent,
  NgcButtonComponent, NgcUtility, PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import { NeutralAwbCustoms, NeutralAWBLocalAuthDetails, CustomerContactInfo, CustomerAddressInfo, SearchStockRequest, SIDSearchRequest, NeutralAWBMasters, CustomerInfo, AccountingInfo, AgentInfo, SHC, Routing, OtherCustomsInfo, PrepaidCollectChargeSummary, SSROSIInfo, OtherCharges, FlightBooking, RateDescription, RateDescOtherInfo, SearchNAWBRQ } from '../export.sharedmodel';

@Component({
  selector: 'app-maintain-nawb',
  templateUrl: './maintain-nawb.component.html',
  styleUrls: ['./maintain-nawb.component.css']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class MaintainNawbComponent extends NgcPage {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('stockButton') stockButton: NgcButtonComponent;
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  @ViewChild('awbWindow') awbWindow: NgcWindowComponent;
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;
  @ViewChild('search') search: NgcButtonComponent;

  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });
  tenantSpecific: boolean = false;
  fractionScale: number;
  request: any;
  serviceRequestTypes = ['SSR', 'OSI'];
  printButtonFlag: boolean = true;
  reportParameters: any;
  stockButtonFlag: boolean = false;
  shipperInfoIndicatorIcon: string = "";
  flightBookingIndicatorIcon: string = "";
  accoutingInfoIndicatorIcon: string = "";
  alsoNotifyIndicatorIcon: string = "";
  chargeDetailsIndicatorIcon: string = "";
  customsIndicatorIcon: string = "";
  commodityIndicatorIcon: string = "";
  ssrOsiInfoIcon: string = "";
  saveResultAwbNumber: any;
  stockData: any;
  saveResponse: any;
  shcCodes: any = null;
  wtPPDPrepaid: any;
  wtPPDCollect: any;
  otherPrepaid: any;
  otherCollect: any;
  requestedFlight: any = [];
  requestFlightDate: any = [];
  executionDate: any;
  handlingInformation: any = [];
  chargeAmountData: any = [];
  accountingInfo: any = [];
  commodity: any = [];
  showDataFlg: boolean = false;
  response: any;
  sidResponse: any;
  permitNumberFlag: boolean;
  excemptionCodeFlag: boolean;
  permitToFollowFlag: boolean;
  weightChargePpdFlag: boolean = true;
  weightChrgeColFlag: boolean = true;
  valuationChargePpdFlag: boolean = true;
  valuationChargeColFlag: boolean = true;
  totalDueAgentPpdFlag: boolean = true;
  totalDueAgentColFlag: boolean = true;
  totalDueCarrierPpdFlag: boolean = true;
  totalDueCarrierColFlag: boolean = true;
  totalSummaryChargePpdFlag: boolean = true;
  totalSummaryChargeColFlag: boolean = true;
  stockSelected: boolean = false;
  stockAwbSelected: string;
  destination: any;
  chargeCodeValue: any;
  customerAppAgentIdCode: any;
  stockCatOcs: string;
  userName: string;
  commodityChargesList: any = [];
  flightBookingToList: any = [];
  routingToByList: any = [];
  customerId: any;
  awbCharge: any = false;
  weightVerificationCharge: any = false;
  rcarCharge: any = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private exportService: ExportService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }
  stockForm: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    stockCategoryCode: new NgcFormControl('GEN'),
    stockId: new NgcFormControl(),

    awbListArray: new NgcFormArray([]),
  });
  nawbForm: NgcFormGroup = new NgcFormGroup({
    awbNumber: new NgcFormControl(),
    svc: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),

    // added for pieces and weight
    pieces: new NgcFormControl(),
    weightUnitCode: new NgcFormControl("K"),
    weight: new NgcFormControl(),
    volumeUnitCode: new NgcFormControl('MC'),
    volumeAmount: new NgcFormControl(),
    densityIndicator: new NgcFormControl('DG'),
    densityGroupCode: new NgcFormControl(),
    shippersCertificateSignature: new NgcFormControl(),
    carriersExecutionDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    carriersExecutionPlace: new NgcFormControl('SINGAPORE'),
    carriersExecutionAuthorisationSignature: new NgcFormControl(this.userName),
    natureOfGoodsDescription: new NgcFormControl(),


    customOrigin: new NgcFormControl(),

    ssrOsiInfo: new NgcFormArray([
      new NgcFormGroup({
        serviceRequestType: new NgcFormControl(),
        serviceRequestcontent: new NgcFormControl()
      })
    ]),

    shipperInfo: new NgcFormGroup({
      customerCode: new NgcFormControl(),
      customerAccountNumber: new NgcFormControl(),
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
      appointedAgent: new NgcFormControl(),
      rcarType: new NgcFormControl(),
    }),
    consigneeInfo: new NgcFormGroup({
      customerCode: new NgcFormControl(),
      customerName: new NgcFormControl('', [Validators.maxLength(70)]),
      customerAccountNumber: new NgcFormControl('', [Validators.maxLength(14)]),
      flag: new NgcFormControl(),
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
    agentInfo: new NgcFormGroup({
      accountNumber: new NgcFormControl(null, [Validators.maxLength(14)]),
      cargAgentNumericCode: new NgcFormControl(null, [Validators.maxLength(7)]),
      iatacargoAgentCASSAddress: new NgcFormControl(null, [Validators.maxLength(4)]),
      participantIdentifier: new NgcFormControl(null, [Validators.maxLength(3)]),
      agentName: new NgcFormControl(null, [Validators.maxLength(35)]),
      agentPlace: new NgcFormControl(null, [Validators.maxLength(17)]),
      agentCode: new NgcFormControl()
    }),
    alsoNotify: new NgcFormGroup({
      customerCode: new NgcFormControl(),
      customerName: new NgcFormControl(null, [Validators.maxLength(70)]),
      customerAddressInfo: new NgcFormGroup({
        streetAddress1: new NgcFormControl(null, [Validators.maxLength(70)]),
        postalCode: new NgcFormControl('', [Validators.maxLength(9)]),
        customerPlace: new NgcFormControl(null, [Validators.maxLength(17)]),
        stateCode: new NgcFormControl(null, [Validators.maxLength(9)]),
        countryCode: new NgcFormControl(null, [Validators.maxLength(2)]),
        customerContactInfo: new NgcFormArray([
          new NgcFormGroup({
            contactIdentifier: new NgcFormControl(),
            contactDetail: new NgcFormControl(),
          })
        ])
      }),
    }),
    shcCode: new NgcFormArray([
    ]),
    routingList: new NgcFormArray([
      new NgcFormGroup({
        to: new NgcFormControl(null, [Validators.maxLength(3)]),
        carrierCode: new NgcFormControl(null, [Validators.maxLength(3)])
      })
    ]),
    flightBookingList: new NgcFormArray([
      new NgcFormGroup({

        flightNumber: new NgcFormControl(''),
        flightDate: new NgcFormControl(),
        carrierCode: new NgcFormControl(null, [Validators.maxLength(3)]),
      }),
    ]),
    rateDescription: new NgcFormArray([
      new NgcFormGroup({

        rateLineNumber: new NgcFormControl(1),
        grossWeight: new NgcFormControl('', [Validators.maxLength(8)]),
        rateClassCode: new NgcFormControl('', [Validators.maxLength(1)]),
        commodityItemNo: new NgcFormControl('1', [Validators.maxLength(7)]),
        chargeableWeight: new NgcFormControl(),
        rateChargeAmount: new NgcFormControl(0.0),
        totalChargeAmount: new NgcFormControl(0.0),
        natureOfGoodsDescription: new NgcFormControl('', [Validators.maxLength(20)]),
        numberOfPieces: new NgcFormControl('', [Validators.maxLength(4)]),
        weightUnitCode: new NgcFormControl('', [Validators.maxLength(1)]),
      })
    ]),
    rateDescriptionOtherInfo: new NgcFormArray([
      new NgcFormGroup({
        //  flagCRUD: new NgcFormControl('C'),
        measurementUnitCode: new NgcFormControl('', [Validators.maxLength(3)]),
        dimensionLength: new NgcFormControl('', [Validators.maxLength(5)]),
        dimensionHeight: new NgcFormControl('', [Validators.maxLength(5)]),
        dimensionWIdth: new NgcFormControl('', [Validators.maxLength(5)]),
        numberOfPieces: new NgcFormControl('', [Validators.maxLength(4)]),
        weight: new NgcFormControl(),
        volumeUnitCode: new NgcFormControl('', [Validators.maxLength(2)]),
        volumeAmount: new NgcFormControl(),
        uldNumber: new NgcFormControl('', [Validators.maxLength(11)]),
        harmonisedCommodityCode: new NgcFormControl('', [Validators.maxLength(18)]),
        slacCount: new NgcFormControl('', [Validators.maxLength(5)]),
        countryCode: new NgcFormControl('', [Validators.maxLength(2)]),
        serviceCode: new NgcFormControl('', [Validators.maxLength(1)]),
        neutralAWBRateDescriptionOtherInfoId: new NgcFormControl()

      })
    ]),

    col: new NgcFormGroup({
      flagCRUD: new NgcFormControl('C'),
      otherChargeIndicator: new NgcFormControl(),
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
      flagCRUD: new NgcFormControl('C'),
      otherChargeIndicator: new NgcFormControl(),
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
    otherChargesDueAgent: new NgcFormArray([
      new NgcFormGroup({
        //  flagCRUD: new NgcFormControl('C'),
        otherChargeIndicator: new NgcFormControl(null, [Validators.maxLength(1)]),
        otherChargeCode: new NgcFormControl(null, [Validators.maxLength(2)]),
        chargeType: new NgcFormControl(null, [Validators.maxLength(1)]),
        chargeAmount: new NgcFormControl(),
        entitlementCode: new NgcFormControl('A')
      })]),
    otherChargesDueCarrier: new NgcFormArray([
      new NgcFormGroup({
        //  flagCRUD: new NgcFormControl('C'),
        otherChargeIndicator: new NgcFormControl(null, [Validators.maxLength(1)]),
        otherChargeCode: new NgcFormControl(null, [Validators.maxLength(2)]),
        chargeType: new NgcFormControl(null, [Validators.maxLength(1)]),
        chargeAmount: new NgcFormControl(),
        entitlementCode: new NgcFormControl('C')
      })]),
    chargeDeclaration: new NgcFormGroup({
      flagCRUD: new NgcFormControl('C'),
      currencyCode: new NgcFormControl(null, [Validators.maxLength(3)]),
      chargeCode: new NgcFormControl(),
      carriageValueDeclaration: new NgcFormControl('NVD', [Validators.maxLength(12)]),
      customsValueDeclaration: new NgcFormControl('NCV', [Validators.maxLength(12)]),
      insuranceValueDeclaration: new NgcFormControl('XXX', [Validators.maxLength(11)]),
      carriageValueDeclarationNawb: new NgcFormControl(),
      customsValueDeclarationNawb: new NgcFormControl(),
      insuranceValueDeclarationNawb: new NgcFormControl(),
      prepaIdCollectChargeDeclaration: new NgcFormControl(),
      noCarriageValueDeclared: new NgcFormControl(),
      noCustomsValueDeclared: new NgcFormControl(),
      noInsuranceValueDeclared: new NgcFormControl(),


    }),
    accountingInfo: new NgcFormArray([
      new NgcFormGroup({
        // flagCRUD: new NgcFormControl('C'),
        informationIdentifier: new NgcFormControl('', [Validators.maxLength(3)]),
        accountingInformation: new NgcFormControl('', [Validators.maxLength(34)]),
      })
    ]),
    otherCustomsInfo: new NgcFormArray([
      new NgcFormGroup({
        flagCRUD: new NgcFormControl('C'),
        informationIdentifier: new NgcFormControl(null, [Validators.maxLength(3)]),
        csrciIdentifier: new NgcFormControl(null, [Validators.maxLength(2)]),
        scrcInformation: new NgcFormControl(null, [Validators.maxLength(35)]),
        countryCode: new NgcFormControl(null, [Validators.maxLength(2)]),

      })
    ]),
    neutralAwbCustoms: new NgcFormGroup({
      // flagCRUD: new NgcFormControl('C'),
      neutralAWBLocalAuthorityInfoId: new NgcFormControl(),
      type: new NgcFormControl(),
      neutralAWBLocalAuthDetails: new NgcFormArray([
        new NgcFormGroup({
          remarks: new NgcFormControl(),
          license: new NgcFormControl(),
          referenceNumber: new NgcFormControl(),
          customerAppAgentId: new NgcFormControl(),
          exemptionCode: new NgcFormControl(),
          aces: new NgcFormControl()
        })
      ])
    }),
    rateDescriptionForNawb: new NgcFormArray([
      new NgcFormGroup({
        //flagCRUD: new NgcFormControl('C'),
        rateLineNumber: new NgcFormControl(1),
        grossWeight: new NgcFormControl(null, [Validators.maxLength(8)]),
        rateClassCode: new NgcFormControl(null, [Validators.maxLength(1)]),
        commodityItemNo: new NgcFormControl(null, [Validators.maxLength(7)]),
        chargeableWeight: new NgcFormControl(),
        rateChargeAmount: new NgcFormControl(0.0),
        totalChargeAmount: new NgcFormControl(0.0),
        numberOfPieces: new NgcFormControl(null, [Validators.maxLength(4)]),
        weightUnitCode: new NgcFormControl(null, [Validators.maxLength(1)]),
        rateDescriptionOtherInfoForNawb: new NgcFormArray([])
      })
    ]),
    ardAgentReference: new NgcFormControl('', [Validators.maxLength(15)]),
  })

  // afterUserProfileLoad() {
  //   this.userName = this.getUserProfile().userShortName;
  // }

  ngOnInit() {
    this.fractionScale = NgcUtility.getApplicationCurrencyDecimals();
    this.tenantSpecific = NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_Nawb_RcarStatus);
    this.stockData = this.getNavigateData(this.activatedRoute);
    if (this.stockData) {
      if ((this.stockData.status != null && this.stockData.status.toUpperCase() == "Issued".toUpperCase())
        || this.stockData.isAwbReservation) {
        this.stockButtonFlag = true;
        this.nawbForm.get('awbNumber').disable();
        this.search.disabled = true;
      }
    }
    this.userName = this.getUserProfile().userShortName;
  }
  //checking of shipment number from sid list is pending  as it is comming null from sid 
  public ngAfterViewInit() {
    super.ngAfterViewInit();
    this.fetchDataFromSidOrNawb();
    this.onWeightChargeChangesPpd();
    this.onWeightChargeChangesCol();
    this.onValuationChargeChangesPpd();
    this.onValuationChargeChangesCol();
    this.ontaxesChangesPpd();
    this.ontaxesChangesCol();
    this.onDcChangesppd();
    this.onDcChangesCol();
    this.onDaChangesppd();
    this.onDaChangesCol();
    this.prepaIdCollectChargeDeclarationChange();

    (<NgcFormControl>this.nawbForm.get('destination')).valueChanges.subscribe(value => {
      this.destination = this.createSourceParameter(this.nawbForm.getRawValue().destination);
    });

    //this.onaddingDueAgentCharge();


    this.exportService.getAgentInfo().subscribe((resp) => {
      if (resp.data) {
        this.nawbForm.get('agentInfo').patchValue(resp.data);
        this.nawbForm.get('carriersExecutionPlace').patchValue(resp.data.carriersExecutionPlace);
      }
    });
  }
  onStock() {
    this.awbWindow.open();
  }

  onAwbSearch() {
    this.awbCharge = false;
    this.weightVerificationCharge = false;
    this.rcarCharge = false;

    if (!this.stockData) {
      this.stockData = new Object();
    }
    this.stockData.shipmentNumber = this.nawbForm.getRawValue().awbNumber;
    this.fetchDataFromSidOrNawb();

    if (this.showDataFlg) {
      this.nawbForm.get('awbNumber').disable();
      this.search.disabled = true;
      this.stockButtonFlag = true;
    }
  }

  consigneeSelect(item) {
    this.nawbForm.get('consigneeInfo').get('customerAddressInfo').get('streetAddress1').patchValue(item.desc);
    this.nawbForm.get('consigneeInfo').get('customerAddressInfo').get('customerPlace').patchValue(item.param1);
    this.nawbForm.get('consigneeInfo').get('customerAddressInfo').get('postalCode').patchValue(item.param3);
    this.nawbForm.get('consigneeInfo').get('customerAddressInfo').get('stateCode').patchValue(item.param2);
    this.nawbForm.get('consigneeInfo').get('customerAddressInfo').get('countryCode').patchValue(item.param4);
  }

  onSearch() {
    const request: SearchStockRequest = new SearchStockRequest();
    request.stockCategoryCode = this.stockForm.get('stockCategoryCode').value;
    request.stockId = this.stockForm.get('stockId').value;
    request.carrierCode = this.stockForm.get('carrierCode').value;

    this.exportService.searchStock(request).subscribe(dataDetail => {
      this.stockCatOcs = this.stockForm.get('stockCategoryCode').value;
      if (this.stockForm.get('stockCategoryCode').value == 'OCS') {
        if (!this.nawbForm.get("shcCode").value.length) {
          (<NgcFormArray>this.nawbForm.get("shcCode")).addValue([
            {
              specialHandlingCode: "OCS"
            }
          ]);
        }
        //this.nawbForm.get('svc').setValue(true);
      }
      if (this.stockForm.get('stockCategoryCode').value == 'MAIL') {
        if (!this.nawbForm.get("shcCode").value.length) {
          (<NgcFormArray>this.nawbForm.get("shcCode")).addValue([
            {
              specialHandlingCode: "MAL"
            }
          ]);
        }
        //this.nawbForm.get('svc').setValue(true);
      }
      this.refreshFormMessages(dataDetail);
      this.response = dataDetail.data;
      if (this.response != null) {
        this.stockForm.get('awbListArray').patchValue(this.response);
      }
      else {
        this.showErrorStatus('NO_RECORDS_EXIST');
      }
    });
  }
  onRowClick(event) {
    this.nawbForm.get('awbNumber').setValue(event.args.row.awbNumber);
    this.stockSelected = true;
    this.stockAwbSelected = event.args.row.awbNumber;
    const request: SearchStockRequest = new SearchStockRequest();
    request.awbStockDetailsId = event.args.row.awbStockDetailsId;
    if (event.args.row.awbStockDetailsId) {
      this.exportService.updateInProcessForAwbNumber(request).subscribe((resp) => {
        if (!this.showResponseErrorMessages(resp)) {
          this.awbWindow.close();
        } else {
          this.showErrorStatus(resp.messageList[0].message);
        }
      });
    }
  }
  onOciAddRow() {
    (<NgcFormArray>this.nawbForm.get("otherCustomsInfo")).addValue([
      new OtherCustomsInfo()
    ]);
  }
  deleteOCI(index) {
    (<NgcFormArray>this.nawbForm.get("otherCustomsInfo")).markAsDeletedAt(index);
  }
  onAddContact(event) {

    let contactInfo = <NgcFormArray>this.nawbForm.get("shipperInfo.customerAddressInfo.customerContactInfo");
    (<NgcFormArray>this.nawbForm.get("shipperInfo.customerAddressInfo.customerContactInfo")).addValue([
      {
        contactIdentifier: null,
        contactDetail: null
      }
    ]);

  }
  onAddconsigneeContact() {
    let contactInfo = <NgcFormArray>this.nawbForm.get("consigneeInfo.customerAddressInfo.customerContactInfo");
    (<NgcFormArray>this.nawbForm.get("consigneeInfo.customerAddressInfo.customerContactInfo")).addValue([
      {
        contactIdentifier: null,
        contactDetail: null
      }
    ]);

  }

  onAddOnNotifyContact() {
    let contactInfo = <NgcFormArray>this.nawbForm.get("alsoNotify.customerAddressInfo.customerContactInfo");
    (<NgcFormArray>this.nawbForm.get("alsoNotify.customerAddressInfo.customerContactInfo")).addValue([
      {
        contactIdentifier: null,
        contactDetail: null
      }
    ]);

  }
  onAddSSROSI() {
    (<NgcFormArray>this.nawbForm.get("ssrOsiInfo")).addValue([new SSROSIInfo()]);
  }
  onAlsoNotifyCodeSelection(event) {
    this.nawbForm.get('alsoNotify').get('customerName').setValue(event.desc);
  }
  onShipperCodeSelection(event) {
    this.nawbForm.get('shipperInfo.customerName').setValue(event.desc);
    this.nawbForm.get('shipperInfo.customerAddressInfo.streetAddress1').patchValue(event.param1);
    this.nawbForm.get('shipperInfo.customerAddressInfo.customerPlace').patchValue(event.param2);
    this.nawbForm.get('shipperInfo.customerAddressInfo.postalCode').patchValue(event.parameter1);
    this.nawbForm.get('shipperInfo.customerAddressInfo.stateCode').patchValue(event.parameter2);
    this.nawbForm.get('shipperInfo.customerAddressInfo.countryCode').patchValue(event.parameter3);
  }
  onConsigneeCodeeSelection(event) {
    this.nawbForm.get('consigneeInfo').get('customerName').setValue(event.desc);
  }
  addNewRouting(event) {
    let routing = <NgcFormArray>this.nawbForm.get("routingList");
    if (routing.length < 4) {
      (<NgcFormArray>this.nawbForm.get("routingList")).addValue([
        {
          to: null,
          carrierCode: null
        }
      ]);
      this.nawbForm.get(['routingList', routing.length, 'to']).setValidators(Validators.maxLength(3));
      this.nawbForm.get(['routingList', routing.length, 'carrierCode']).setValidators(Validators.maxLength(3));
    }
    else {
      this.showInfoStatus("export.no.more.routing.added");
    }
  }
  onDeleteRouting(event, index) {
    (<NgcFormArray>this.nawbForm.get("routingList")).markAsDeletedAt(index);
  }

  onAddFlightBooking(event) {
    let flight = <NgcFormArray>this.nawbForm.get("flightBookingList");
    if (flight.length < 4) {
      (<NgcFormArray>this.nawbForm.get("flightBookingList")).addValue([
        new FlightBooking()
      ]);
    }
    else {
      this.showInfoStatus("export.no.flight.can.be.added");
    }
  }
  onDeleteFlight($event, index) {
    (<NgcFormArray>this.nawbForm.get("flightBookingList")).markAsDeletedAt(index);
  }
  addOtherChargesDueAgent(event) {
    let otherCharges = <NgcFormArray>this.nawbForm.get("otherChargesDueAgent");
    let charge = new OtherCharges();
    charge.entitlementCode = 'A';
    (<NgcFormArray>this.nawbForm.get("otherChargesDueAgent")).addValue([
      charge
    ]);

  }
  addOtherChargesDueCarrier(event) {
    let otherCharges = <NgcFormArray>this.nawbForm.get("otherChargesDueCarrier");
    let charge = new OtherCharges();
    charge.entitlementCode = 'C';
    (<NgcFormArray>this.nawbForm.get("otherChargesDueCarrier")).addValue([
      charge
    ]);

  }
  deleteOtherChargesDueAgent(event, index) {
    let indicator = this.nawbForm.get(['otherChargesDueAgent', index, 'otherChargeIndicator']).value;
    (<NgcFormArray>this.nawbForm.get("otherChargesDueAgent")).markAsDeletedAt(index);
    this.onaddingDueAgentCharge(indicator, index);
  }
  deleteOtherChargesDueCarrier(event, index) {
    let indicator = this.nawbForm.get(['otherChargesDueCarrier', index, 'otherChargeIndicator']).value;
    (<NgcFormArray>this.nawbForm.get("otherChargesDueCarrier")).markAsDeletedAt(index);
    this.onaddingDueCarrierCharge(indicator, index);
  }

  addNewRowForRateDescriptionForNawb(event) {

    if ((<NgcFormArray>this.nawbForm.get("rateDescriptionForNawb")).length > 9) {
      this.showInfoStatus("export.max.no.of.rows.exceeded");
      return;
    }
    let ratelineNumber = 1;
    if ((<NgcFormArray>this.nawbForm.get("rateDescriptionForNawb")).length > 0) {
      let size = (<NgcFormArray>this.nawbForm.get("rateDescriptionForNawb")).length - 1;
      let currentRate = Number(this.nawbForm.get(["rateDescriptionForNawb", size, "rateLineNumber"]).value);
      ratelineNumber = currentRate ? currentRate + 1 : 1;
    }
    (<NgcFormArray>this.nawbForm.get("rateDescriptionForNawb")).addValue([
      {

        "rateLineNumber": ratelineNumber,
        "grossWeight": "",
        "rateClassCode": "",
        "commodityItemNo": "",
        "chargeableWeight": null,
        "rateChargeAmount": null,
        "totalChargeAmount": null,
        "numberOfPieces": "",
        "weightUnitCode": "K",

        "rateDescriptionOtherInfoForNawb": [
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
            "countryCode": null,
            "serviceCode": "",
            "type": ""

          }
        ]
      }
    ]);
  }
  onDeleteRateDesc(event, index) {
    (this.nawbForm.get(["rateDescriptionForNawb", index]) as NgcFormGroup).markAsDeleted();
  }
  addRateDescripOtherInfo(event) {

    let rateDescriptionOtherInfo = <NgcFormArray>this.nawbForm.get("rateDescriptionOtherInfo");
    if (rateDescriptionOtherInfo.length < 4) {
      (<NgcFormArray>this.nawbForm.get("rateDescriptionOtherInfo")).addValue([
        {
          measurementUnitCode: null,
          dimensionLength: null,
          dimensionHeight: null,
          dimensionWIdth: null,
          numberOfPieces: null,
          weight: null,
          volumeUnitCode: null,
          volumeAmount: null,
          uldNumber: null,
          harmonisedCommodityCode: null,
          slacCount: null,
          countryCode: null,
          serviceCode: null,
        }
      ]);
    }
    else {
      this.showInfoStatus("export.max.limit.exceed");
    }
  }
  onDeleteRateDescOtherInfo(event, index) {
    (<NgcFormArray>this.nawbForm.get("rateDescriptionOtherInfo")).markAsDeletedAt(index);
  }


  addNewAccountingInfo(event) {
    let accountingInfo = <NgcFormArray>this.nawbForm.get("accountingInfo");
    if (accountingInfo.length < 4) {
      (<NgcFormArray>this.nawbForm.get("accountingInfo")).addValue([
        {
          informationIdentifier: null,
          accountingInformation: null,
        }
      ]);
    }
    else {
      this.showInfoStatus("export.max.limit.exceed");
    }
  }
  onDeleteAccountInfo(event, index) {
    (<NgcFormArray>this.nawbForm.get("accountingInfo")).markAsDeletedAt(index);
  }
  onDeleteShipperContact(event, index) {
    (<NgcFormArray>this.nawbForm.get("shipperInfo.customerAddressInfo.customerContactInfo")).markAsDeletedAt(index);
  }
  onDeleteConsigneeContact(event, index) {
    (<NgcFormArray>this.nawbForm.get("consigneeInfo.customerAddressInfo.customerContactInfo")).markAsDeletedAt(index);
  }
  onDeleteAlsoNotifyContact(event, index) {
    (<NgcFormArray>this.nawbForm.get("alsoNotify.customerAddressInfo.customerContactInfo")).markAsDeletedAt(index);
  }
  onDeleteSSROSI(event, index) {
    (<NgcFormArray>this.nawbForm.get("ssrOsiInfo")).deleteValueAt(index);
  }


  fetchDataFromSidOrNawb() {
    this.excemptionCodeFlag = false;
    this.permitNumberFlag = false;
    this.permitToFollowFlag = false;
    if (this.stockData) {
      const request: SIDSearchRequest = new SIDSearchRequest();
      if (this.stockData.sidHeaderId != null || this.stockData.sidHeaderId != undefined) {
        request.sidHeaderId = this.stockData.sidHeaderId;
      }
      if (this.stockData.shipmentNumber != null || this.stockData.shipmentNumber != undefined) {
        request.awbNumber = this.stockData.shipmentNumber;
        this.printButtonFlag = false;
      } else {
        request.awbNumber = this.saveResultAwbNumber;

      }
      if (this.stockData.awbNumber != null || this.stockData.awbNumber != undefined) {
        request.awbNumber = this.stockData.awbNumber;
      }
      this.exportService.searchSIDByHeaderID(request).subscribe((resp) => {
        if (!this.showResponseErrorMessages(resp)) {
          this.refreshFormMessages(resp);

          if (this.stockAwbSelected != this.nawbForm.getRawValue().awbNumber) {
            this.stockSelected = false;
          }

          if (resp.data) {

            this.sidResponse = resp.data;

            //Set the stock category code
            this.stockForm.get('stockCategoryCode').setValue(this.sidResponse.stockCategoryCode);

            this.stockData.isAwbReservation = this.sidResponse.isAwbReservation;
            this.bindData();
          } else if (this.stockData.isAwbReservation) {
            this.sidResponse = this.stockData;
            this.bindData();
          } else if (this.stockSelected) {
            this.showDataFlg = true;
            this.nawbForm.get('carriersExecutionAuthorisationSignature').setValue(this.userName);
          } else {
            this.showDataFlg = false;
            this.showErrorMessage("export.no.data.found");
          }
        }

      }, error => {
        this.showErrorMessage(error);
      });
    }
  }

  bindData() {
    this.showDataFlg = true;
    if (this.sidResponse.weightUnitCode == null) {
      this.sidResponse.weightUnitCode = 'K'
    }
    if (this.sidResponse.neutralAwbCustoms == null) {
      this.sidResponse.neutralAwbCustoms = new NeutralAwbCustoms();
      this.sidResponse.neutralAwbCustoms.neutralAWBLocalAuthDetails = [];
      this.sidResponse.neutralAwbCustoms.neutralAWBLocalAuthDetails.push(new NeutralAWBLocalAuthDetails());
    }
    if (!this.stockData.isAwbReservation && this.sidResponse.chargeDeclaration &&
      this.sidResponse.chargeDeclaration.prepaIdCollectChargeDeclaration == "PP") {
      this.weightChrgeColFlag = true;
      this.valuationChargeColFlag = true;
      this.weightChargePpdFlag = false;
      this.valuationChargePpdFlag = false;
    }
    if (!this.stockData.isAwbReservation && this.sidResponse.chargeDeclaration &&
      this.sidResponse.chargeDeclaration.prepaIdCollectChargeDeclaration == "CC") {
      this.weightChrgeColFlag = false;
      this.valuationChargeColFlag = false;
      this.weightChargePpdFlag = true;
      this.valuationChargePpdFlag = true;
    }
    if (this.sidResponse.otherChargesDueAgent == null || this.sidResponse.otherChargesDueAgent.length == 0) {
      this.sidResponse.otherChargesDueAgent = [];
      let charge = new OtherCharges();
      charge.entitlementCode = 'A';
      this.sidResponse.otherChargesDueAgent.push(new OtherCharges());
    }
    if (this.sidResponse.otherChargesDueCarrier == null || this.sidResponse.otherChargesDueCarrier.length == 0) {
      this.sidResponse.otherChargesDueCarrier = [];
      let charge = new OtherCharges();
      charge.entitlementCode = 'C';
      this.sidResponse.otherChargesDueCarrier.push(charge);
    }

    if (this.sidResponse.neutralAwbCustoms != null &&
      (this.sidResponse.neutralAwbCustoms.neutralAWBLocalAuthDetails == null ||
        this.sidResponse.neutralAwbCustoms.neutralAWBLocalAuthDetails.length == 0)) {
      this.sidResponse.neutralAwbCustoms.neutralAWBLocalAuthDetails = [];
      this.sidResponse.neutralAwbCustoms.neutralAWBLocalAuthDetails.push(new NeutralAWBLocalAuthDetails());
    }

    if (this.sidResponse.accountingInfo == null || this.sidResponse.accountingInfo.length == 0) {
      this.sidResponse.accountingInfo = []; this.sidResponse.neutralAwbCustoms
      this.sidResponse.accountingInfo.push(new AccountingInfo());
    }
    if (this.sidResponse.rateDescription == null || this.sidResponse.rateDescription.length == 0) {
      this.sidResponse.rateDescription = [];
      let obj = new RateDescription();
      obj.rateLineNumber = this.sidResponse.rateDescription.length + 1;
      this.sidResponse.rateDescription.push(obj);
    }
    if (this.sidResponse.rateDescriptionOtherInfo == null || this.sidResponse.rateDescriptionOtherInfo.length == 0) {
      this.sidResponse.rateDescriptionOtherInfo = [];
      this.sidResponse.rateDescriptionOtherInfo.push(new RateDescOtherInfo());
    }
    if (this.sidResponse.flightBookingList == null || this.sidResponse.flightBookingList.length == 0) {
      this.sidResponse.flightBookingList = [];
      this.sidResponse.flightBookingList.push(new FlightBooking());
    }
    if (this.sidResponse.routingList == null || this.sidResponse.routingList.length == 0) {
      this.sidResponse.routingList = [];
      this.sidResponse.routingList.push(new Routing());
    }
    if (this.sidResponse.shipperInfo == null) {
      this.sidResponse.shipperInfo = new CustomerInfo();
    }
    if (this.sidResponse.shipperInfo.customerAddressInfo == null) {
      this.sidResponse.shipperInfo.customerAddressInfo = new CustomerAddressInfo();
    }
    if (this.sidResponse.consigneeInfo == null) {
      this.sidResponse.consigneeInfo = new CustomerInfo();
    }
    if (this.sidResponse.consigneeInfo.customerAddressInfo == null) {
      this.sidResponse.consigneeInfo.customerAddressInfo = new CustomerAddressInfo();
    }
    if (this.sidResponse.shipperInfo.customerAddressInfo.customerContactInfo == null ||
      this.sidResponse.shipperInfo.customerAddressInfo.customerContactInfo.length == 0) {
      this.sidResponse.shipperInfo.customerAddressInfo.customerContactInfo = [];
      this.sidResponse.shipperInfo.customerAddressInfo.customerContactInfo.push(new CustomerContactInfo());
    }

    if (this.sidResponse.consigneeInfo.customerAddressInfo.customerContactInfo == null ||
      this.sidResponse.consigneeInfo.customerAddressInfo.customerContactInfo.length == 0) {
      this.sidResponse.consigneeInfo.customerAddressInfo.customerContactInfo = [];
      this.sidResponse.consigneeInfo.customerAddressInfo.customerContactInfo.push(new CustomerContactInfo());
    }
    if (this.sidResponse.alsoNotify == null) {
      this.sidResponse.alsoNotify = new CustomerInfo();
    }
    if (this.sidResponse.alsoNotify.customerAddressInfo.customerContactInfo == null ||
      this.sidResponse.alsoNotify.customerAddressInfo.customerContactInfo.length == 0) {
      this.sidResponse.alsoNotify.customerAddressInfo.customerContactInfo = [];
      this.sidResponse.alsoNotify.customerAddressInfo.customerContactInfo.push(new CustomerContactInfo());
    }

    if (this.sidResponse.otherCustomsInfo == null || this.sidResponse.otherCustomsInfo.length == 0) {
      this.sidResponse.otherCustomsInfo = [];
      this.sidResponse.otherCustomsInfo.push(new OtherCustomsInfo());
    }
    if (this.sidResponse.ssrOsiInfo == null ||
      this.sidResponse.ssrOsiInfo.length == 0) {
      this.sidResponse.ssrOsiInfo = [];
      this.sidResponse.ssrOsiInfo.push(new SSROSIInfo());

    }
    if (this.sidResponse.shcCode == null) {
      this.sidResponse.shcCode = [];
    }
    if (this.sidResponse.shcCode == null && this.stockCatOcs == 'OCS') {
      this.sidResponse.shcCode = ["OCS"];
    }

    if (this.sidResponse.routing != null) {
      this.sidResponse.routingList = [];
      this.sidResponse.flightBookingList = [];
      this.sidResponse.routingList.push({
        to: this.sidResponse.routing.to,
        carrierCode: this.sidResponse.routing.carrierCode
      });

      //new code fro origin destination
      this.sidResponse.origin = this.sidResponse.routing.from;
      this.sidResponse.destination = this.sidResponse.routing.to;
      let flightInfo = new FlightBooking();
      flightInfo.carrierCode = this.sidResponse.routing.carrierCode;
      if (this.sidResponse.routing.flightKey != null) {
        flightInfo.flightDate = this.sidResponse.routing.flightDate;
        flightInfo.flightNumber = this.sidResponse.routing.flightKey;
      }
      this.sidResponse.flightBookingList.push(flightInfo);

    }
    if (this.sidResponse.routingList == null || this.sidResponse.routingList.length == 0) {
      this.sidResponse.routingList = [];
      this.sidResponse.routingList.push(new Routing());
    }
    if (this.sidResponse.flightBookingList == null || this.sidResponse.flightBookingList.length == 0) {
      this.sidResponse.flightBookingList = [];
      this.sidResponse.flightBookingList.push(new FlightBooking());
    }
    if (this.sidResponse.otherChargesDueAgent == null || this.sidResponse.otherChargesDueAgent.length == 0) {
      this.sidResponse.otherChargesDueAgent = [];
      this.sidResponse.otherChargesDueAgent.push
    }
    if (this.sidResponse.chargeDeclaration) {
      if (this.sidResponse.chargeDeclaration.carriageValueDeclarationNawb) {
        this.sidResponse.chargeDeclaration.carriageValueDeclaration = Number(this.sidResponse.chargeDeclaration.carriageValueDeclarationNawb);
      }
      if (this.sidResponse.chargeDeclaration.customsValueDeclarationNawb) {
        this.sidResponse.chargeDeclaration.customsValueDeclaration = Number(this.sidResponse.chargeDeclaration.customsValueDeclarationNawb);
      }
      if (this.sidResponse.chargeDeclaration.insuranceValueDeclarationNawb) {
        this.sidResponse.chargeDeclaration.insuranceValueDeclaration = Number(this.sidResponse.chargeDeclaration.insuranceValueDeclarationNawb);
      }
    }
    if (!this.sidResponse.carriersExecutionAuthorisationSignature) {
      this.sidResponse.carriersExecutionAuthorisationSignature = this.userName
    }
    this.nawbForm.patchValue(this.sidResponse);

    if (this.sidResponse.neutralAwbCustoms != null) {
      if (this.sidResponse.neutralAwbCustoms.type == "EC") {
        this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'customerAppAgentId']).clearValidators();
        this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'referenceNumber']).clearValidators();
        this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'exemptionCode']).setValidators(Validators.required);
        this.excemptionCodeFlag = true;
      }
      else if (this.sidResponse.neutralAwbCustoms.type == "PN") {
        this.permitNumberFlag = true;
        this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'exemptionCode']).clearValidators();
        this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'customerAppAgentId']).clearValidators();
        this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'referenceNumber']).setValidators(Validators.required);
      }
      else if (this.sidResponse.neutralAwbCustoms.type == "PTF") {
        this.permitToFollowFlag = true;
        this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'exemptionCode']).clearValidators();
        this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'referenceNumber']).clearValidators();
        this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'customerAppAgentId']).setValidators(Validators.required);
      }
    }
  }
  onAddPermitNumber() {
    (<NgcFormArray>this.nawbForm.get('neutralAwbCustoms').get('neutralAWBLocalAuthDetails')).addValue([
      new NeutralAWBLocalAuthDetails()
    ]);
  }
  onDeletePermitNumberRows(index) {
    (<NgcFormArray>this.nawbForm.get('neutralAwbCustoms').get('neutralAWBLocalAuthDetails')).markAsDeletedAt(index);

  }

  calculateVolume(event, index) {
    let rateDescArray = this.nawbForm.get('rateDescriptionOtherInfo').value;
    let rateDescObj = rateDescArray[index];
    rateDescArray.splice(index, 1);
    if (rateDescObj.measurementUnitCode == 'CMT' && rateDescObj.volumeUnitCode == 'CF') {
      rateDescObj.volumeAmount = rateDescObj.dimensionHeight * rateDescObj.dimensionWIdth *
        rateDescObj.dimensionLength / 28230;
      rateDescObj.volumeAmount = Number(NgcUtility.getDisplayWeight((Math.round(rateDescObj.volumeAmount * 100) / 100)));
    }
    if (rateDescObj.measurementUnitCode == 'INH' && rateDescObj.volumeUnitCode == 'CF') {
      rateDescObj.volumeAmount = rateDescObj.dimensionHeight * rateDescObj.dimensionWIdth *
        rateDescObj.dimensionLength / 1728;
      rateDescObj.volumeAmount = Number(NgcUtility.getDisplayWeight((Math.round(rateDescObj.volumeAmount * 100) / 100)));
    }
    if (rateDescObj.measurementUnitCode == 'CMT' && rateDescObj.volumeUnitCode == 'MC') {
      rateDescObj.volumeAmount = rateDescObj.dimensionHeight * rateDescObj.dimensionWIdth *
        rateDescObj.dimensionLength / 1000000;
      rateDescObj.volumeAmount = Number(NgcUtility.getDisplayWeight((Math.round(rateDescObj.volumeAmount * 100) / 100)));
    }
    if (rateDescObj.measurementUnitCode == 'INH' && rateDescObj.volumeUnitCode == 'MC') {
      rateDescObj.volumeAmount = rateDescObj.dimensionHeight * rateDescObj.dimensionWIdth *
        rateDescObj.dimensionLength / 61023;
      rateDescObj.volumeAmount = Number(NgcUtility.getDisplayWeight((Math.round(rateDescObj.volumeAmount * 100) / 100)));
    }
    rateDescArray.splice(index, 0, rateDescObj);
    this.nawbForm.get('rateDescriptionOtherInfo').patchValue(rateDescArray);
  }

  nog(item, index) {
    if (index == 0) {
      this.nawbForm.get('natureOfGoodsDescription').patchValue(item);
    }
  }

  headerNog(item) {
    if ((<NgcFormArray>this.nawbForm.get(["rateDescriptionForNawb", "rateDescriptionOtherInfoForNawb"]) &&
      (<NgcFormArray>this.nawbForm.get(["rateDescriptionForNawb", "rateDescriptionOtherInfoForNawb"])).value.length < 1)) {
      (<NgcFormArray>this.nawbForm.get(["rateDescriptionForNawb", "rateDescriptionOtherInfoForNawb"])).addValue([
        {
          type: "NG",
          natureOfGoodsDescription: this.nawbForm.get('natureOfGoodsDescription').value
        }
      ], {
        onlySelf: true, emitEvent: false
      });
    }
    else {
      if (this.nawbForm.get(["rateDescriptionForNawb", "rateDescriptionOtherInfoForNawb", 0, 'natureOfGoodsDescription'])) {
        this.nawbForm.get(["rateDescriptionForNawb", "rateDescriptionOtherInfoForNawb", 0, 'natureOfGoodsDescription']).setValue(this.nawbForm.get('natureOfGoodsDescription').value, { onlySelf: true, emitEvent: false });
      }
    }
  }

  onSave(event) {
    this.shipperInfoIndicatorIcon = "";
    this.flightBookingIndicatorIcon = "";
    this.accoutingInfoIndicatorIcon = "";
    this.alsoNotifyIndicatorIcon = "";
    this.chargeDetailsIndicatorIcon = "";
    this.customsIndicatorIcon = "";
    this.commodityIndicatorIcon = "";
    this.nawbForm.validate();
    let error: boolean = false;
    if (this.nawbForm.invalid) {
      if (this.nawbForm.get('shipperInfo').invalid) {
        this.shipperInfoIndicatorIcon = "error";
        error = true;
      }
      if (this.nawbForm.get('flightBookingList').invalid) {
        this.flightBookingIndicatorIcon = "error";
        error = true;
      }
      if (this.nawbForm.get('accountingInfo').invalid || this.nawbForm.get('chargeDeclaration').invalid) {
        this.accoutingInfoIndicatorIcon = "error";
        error = true;
      }
      if (this.nawbForm.get('alsoNotify').invalid) {
        this.alsoNotifyIndicatorIcon = "error";
        error = true;
      }
      if (this.nawbForm.get('rateDescriptionForNawb').invalid) {
        this.commodityIndicatorIcon = "error";
        error = true;
      }
      if (this.nawbForm.get('otherChargesDueAgent').invalid) {
        this.chargeDetailsIndicatorIcon = "error";
        error = true;
      }
      if (this.nawbForm.get('neutralAwbCustoms').invalid) {
        this.customsIndicatorIcon = "error";
        error = true;
      }
      if (this.nawbForm.get('routingList').invalid) {
        this.flightBookingIndicatorIcon = "error";
        error = true;
      }
      if (this.nawbForm.get('ssrOsiInfo').invalid) {
        this.ssrOsiInfoIcon = "error";
        error = true;
      }
      if (error) {
        return;
      }
    }

    if (this.nawbForm.get('awbNumber').value == null || this.nawbForm.get('awbNumber').value == undefined) {
      this.showErrorMessage("export.select.awb.number");
    }
    else if (this.checkForAlsoNotify()) {
      this.alsoNotifyIndicatorIcon = "error";
    }
    else {
      let saveRequest = this.setSaveRequest();
      this.exportService.fetchChargeList(saveRequest).subscribe((chargeResp) => {
        let awbChargeAmount = 0;
        let weightVerificationChargeAmount = 0;
        let rcarChargeAmount = 0;
        let otherCharges: any = this.nawbForm.get("otherChargesDueAgent").value;
        otherCharges.forEach((charge, index) => {
          if (!charge.otherChargeCode && !charge.chargeAmount) {
            (<NgcFormArray>this.nawbForm.get("otherChargesDueAgent")).markAsDeletedAt(index);
          } else if (charge.otherChargeCode == 'AW' && charge.flagCRUD != 'D') {
            this.awbCharge = true;
            awbChargeAmount = charge.chargeAmount;
          } else if (charge.otherChargeCode == 'MA' && charge.flagCRUD != 'D') {
            this.weightVerificationCharge = true;
            weightVerificationChargeAmount = charge.chargeAmount;
          } else if (charge.otherChargeCode == 'RC' && charge.flagCRUD != 'D') {
            this.rcarCharge = true;
            rcarChargeAmount = charge.chargeAmount;
          }
        })

        if (this.stockForm.get('stockCategoryCode').value != 'OCS' &&
          this.stockForm.get('stockCategoryCode').value != 'MAIL') {
          if (!(this.awbCharge && awbChargeAmount)) {
            let chargeDue = new OtherCharges();
            chargeDue.entitlementCode = 'A';
            chargeDue.otherChargeCode = 'AW';
            chargeDue.otherChargeIndicator = 'P';
            chargeDue.chargeAmount = 10;
            (<NgcFormArray>this.nawbForm.get("otherChargesDueAgent")).addValue([chargeDue]);
          }
        }

        if (chargeResp.data && chargeResp.data.length) {
          chargeResp.data.forEach(charge => {
            let chargeDue = new OtherCharges();
            if (charge.chargeCode === 'Exp.WeightVerification' && charge.chargeAmount) {
              chargeDue.entitlementCode = 'A';
              chargeDue.otherChargeCode = 'MA';
              chargeDue.otherChargeIndicator = 'P';
              chargeDue.chargeAmount = charge.chargeAmount;
              let otherDueAgentListLength = this.nawbForm.get("otherChargesDueAgent").value.length;
              if (!weightVerificationChargeAmount || (weightVerificationChargeAmount && weightVerificationChargeAmount != charge.chargeAmount)) {
                (<NgcFormArray>this.nawbForm.get("otherChargesDueAgent")).addValue([chargeDue]);
              }
            }
            if (charge.chargeCode === 'Exp.RCARScreeningFee' && charge.chargeAmount) {
              chargeDue.entitlementCode = 'C';
              chargeDue.otherChargeCode = 'RC';
              chargeDue.otherChargeIndicator = 'P';
              chargeDue.chargeAmount = charge.chargeAmount;
              if (!rcarChargeAmount || (rcarChargeAmount && rcarChargeAmount != charge.chargeAmount)) {
                (<NgcFormArray>this.nawbForm.get("otherChargesDueAgent")).addValue([chargeDue]);
              }
            }
          })
        }
        let otherDueAgentListLength = this.nawbForm.get("otherChargesDueAgent").value.length;
        if (otherDueAgentListLength > 0) {
          this.onAddChargesDueAgentSumEvent(otherDueAgentListLength - 1);
        }
        saveRequest = this.setSaveRequest();
        this.exportService.saveNeutralAWB(saveRequest).subscribe((resp) => {
          if (!this.showResponseErrorMessages(resp)) {
            this.showSuccessStatus("g.operation.successful");
            this.printButtonFlag = false;
            this.saveResponse = resp.data;
            this.saveResultAwbNumber = this.saveResponse.awbNumber;
            this.fetchDataFromSidOrNawb();
          }
          if (this.nawbForm.get('ssrOsiInfo').invalid == true) {
            this.ssrOsiInfoIcon = "error";
          } else {
            this.ssrOsiInfoIcon = "";
          }
        }, error => {
          this.showErrorStatus(error);
        });
      });
    }
  }

  setSaveRequest() {
    const saveRequest = this.nawbForm.getRawValue();
    saveRequest.sidNumber = this.stockData.sidNumber;
    saveRequest.flightBookingList.map(i => i.flightKey = i.carrierCode + i.flightNumber);
    saveRequest.neutralAwbCustoms.neutralAWBLocalAuthDetails.map(i => {
      // i.customerAppAgentId = this.customerAppAgentIdCode;
      if (i.flagCRUD == null)
        i.flagCRUD = "C"
      return i;
    });
    saveRequest.isAwbReservation = null;
    if (saveRequest.rateDescriptionForNawb.rateLineNumber)
      saveRequest.rateDescriptionForNawb.rateLineNumber = saveRequest.rateDescriptionForNawb.rateLineNumber.toString();
    saveRequest.flightBookingList.map(i => i.flightKey = i.carrierCode + i.flightNumber);
    this.stockData.isAwbReservation = false;
    saveRequest.otherChargesDueAgent.forEach(value => {
      value.entitlementCode = 'A';
    });
    saveRequest.otherChargesDueCarrier.forEach(value => {
      value.entitlementCode = 'C';
    });
    saveRequest.consigneeInfo.customerId = this.customerId;
    return saveRequest;
  }

  onSelectLocalAuthDetails(event) {
    if (event.code == "EC") {
      this.excemptionCodeFlag = true;
      this.permitNumberFlag = false;
      this.permitToFollowFlag = false;

      let len = (<NgcFormArray>this.nawbForm.get('neutralAwbCustoms').get('neutralAWBLocalAuthDetails')).value.length;
      this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'customerAppAgentId']).clearValidators();
      this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'referenceNumber']).clearValidators();
      this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'exemptionCode']).setValidators(Validators.required);

      for (let i = 1; i < len; i++)
        (<NgcFormArray>this.nawbForm.get('neutralAwbCustoms').get('neutralAWBLocalAuthDetails')).removeAt(i);
      (<NgcFormArray>this.nawbForm.get('neutralAwbCustoms').get('neutralAWBLocalAuthDetails')).reset();
    }
    else if (event.code == "PN") {
      this.excemptionCodeFlag = false;
      this.permitNumberFlag = true;
      this.permitToFollowFlag = false;

      (<NgcFormArray>this.nawbForm.get('neutralAwbCustoms').get('neutralAWBLocalAuthDetails')).reset();
      this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'exemptionCode']).clearValidators();
      this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'customerAppAgentId']).clearValidators();
      this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'referenceNumber']).setValidators(Validators.required);
    }
    else if (event.code == "PTF") {
      this.excemptionCodeFlag = false;
      this.permitNumberFlag = false;
      this.permitToFollowFlag = true;
      let len = (<NgcFormArray>this.nawbForm.get('neutralAwbCustoms').get('neutralAWBLocalAuthDetails')).value.length;
      for (let i = 1; i < len; i++)
        (<NgcFormArray>this.nawbForm.get('neutralAwbCustoms').get('neutralAWBLocalAuthDetails')).removeAt(i);
      (<NgcFormArray>this.nawbForm.get('neutralAwbCustoms').get('neutralAWBLocalAuthDetails')).reset();
      this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'exemptionCode']).clearValidators();
      this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'referenceNumber']).clearValidators();
      this.nawbForm.get('neutralAwbCustoms').get(['neutralAWBLocalAuthDetails', 0, 'customerAppAgentId']).setValidators(Validators.required);
    }
  }
  OnChargeCodeSelection(event) {
    this.chargeCodeValue = event;
    if (this.chargeCodeValue == "CC") {
      this.weightChrgeColFlag = false;
      this.valuationChargeColFlag = false;
      this.weightChargePpdFlag = true;
      this.valuationChargePpdFlag = true;
      this.nawbForm.get('ppd').get('valuationChargeAmount').setValue(Number(0));
      this.nawbForm.get('ppd').get('totalWeightChargeAmount').setValue(0);
      this.nawbForm.get('ppd').get('taxesChargeAmount').setValue(Number(0));

    }
    else if (this.chargeCodeValue == "PP") {
      this.weightChrgeColFlag = true;
      this.valuationChargeColFlag = true;
      this.weightChargePpdFlag = false;
      this.valuationChargePpdFlag = false;
      this.nawbForm.get('col').get('valuationChargeAmount').setValue(Number(0));
      this.nawbForm.get('col').get('totalWeightChargeAmount').setValue(Number(0));
      this.nawbForm.get('col').get('taxesChargeAmount').setValue(Number(0));

    }
  }

  onAddChargesDueAgentSumEvent(index) {
    let tempChargeObj = this.nawbForm.get('otherChargesDueAgent').value;
    if (tempChargeObj[index].otherChargeIndicator == null || tempChargeObj[index].otherChargeIndicator == "")
      this.showFormControlErrorMessage(<NgcFormControl>this.nawbForm.get(['otherChargesDueAgent', index, 'otherChargeIndicator']), "export.fill.details");

    else if (tempChargeObj[index].chargeAmount == null || tempChargeObj[index].chargeAmount == "")
      this.showFormControlErrorMessage(<NgcFormControl>this.nawbForm.get(['otherChargesDueAgent', index, 'chargeAmount']), "export.fill.details");

    else if (tempChargeObj[index].otherChargeCode == null || tempChargeObj[index].otherChargeCode == "") {
      this.showFormControlErrorMessage(<NgcFormControl>this.nawbForm.get(['otherChargesDueAgent', index, 'otherChargeCode']), "export.fill.details");
    }
    else {

      let indicator = this.nawbForm.get(['otherChargesDueAgent', index, 'otherChargeIndicator']).value;
      if (indicator == "C") {
        let sumcol = 0;
        tempChargeObj.map(i => {
          if (i.otherChargeIndicator == "C" && i.flagCRUD != 'D')
            sumcol = Number(sumcol) + Number(i.chargeAmount);
        });
        this.nawbForm.get('col').get('totalOtherChargesDueAgentChargeAmount').setValue(Number(sumcol));
      }
      if (indicator == "P") {
        let sumppd = 0;
        tempChargeObj.map(i => {
          if (i.otherChargeIndicator == "P" && i.flagCRUD != 'D')
            sumppd = Number(sumppd) + Number(i.chargeAmount);
        });
        this.nawbForm.get('ppd').get('totalOtherChargesDueAgentChargeAmount').setValue(Number(sumppd));
      }


    }
  }
  onAddChargesDueCarrierSumEvent(index) {
    let tempChargeObj = this.nawbForm.get('otherChargesDueCarrier').value;
    if (tempChargeObj[index].otherChargeIndicator == null || tempChargeObj[index].otherChargeIndicator == "")
      this.showFormControlErrorMessage(<NgcFormControl>this.nawbForm.get(['otherChargesDueCarrier', index, 'otherChargeIndicator']), "export.fill.details");

    else if (tempChargeObj[index].chargeAmount == null || tempChargeObj[index].chargeAmount == "")
      this.showFormControlErrorMessage(<NgcFormControl>this.nawbForm.get(['otherChargesDueCarrier', index, 'chargeAmount']), "export.fill.details");

    else if (tempChargeObj[index].otherChargeCode == null || tempChargeObj[index].otherChargeCode == "") {
      this.showFormControlErrorMessage(<NgcFormControl>this.nawbForm.get(['otherChargesDueCarrier', index, 'otherChargeCode']), "export.fill.details");
    }
    else {
      let indicator = this.nawbForm.get(['otherChargesDueCarrier', index, 'otherChargeIndicator']).value;
      if (indicator == "C") {
        let sumcol = 0;
        tempChargeObj.map(i => {
          if (i.otherChargeIndicator == "C" && i.flagCRUD != 'D')
            sumcol = Number(sumcol) + Number(i.chargeAmount);
        });
        this.nawbForm.get('col').get('totalOtherChargesDueCarrierChargeAmount').setValue(Number(sumcol));
      }
      if (indicator == "P") {
        let sumppd = 0;
        tempChargeObj.map(i => {
          if (i.otherChargeIndicator == "P" && i.flagCRUD != 'D')
            sumppd = Number(sumppd) + Number(i.chargeAmount);
        });
        this.nawbForm.get('ppd').get('totalOtherChargesDueCarrierChargeAmount').setValue(Number(sumppd));
      }


    }
  }
  onWeightChargeChangesPpd() {
    this.nawbForm.get('ppd').get('totalWeightChargeAmount').valueChanges.subscribe((data) => {
      this.ppdAdd();
    });
  }
  onWeightChargeChangesCol() {
    this.nawbForm.get('col').get('totalWeightChargeAmount').valueChanges.subscribe((data) => {
      this.colAdd();
    });

  }
  onValuationChargeChangesPpd() {
    this.nawbForm.get('ppd').get('valuationChargeAmount').valueChanges.subscribe((data) => {
      this.ppdAdd();
    });

  }
  onValuationChargeChangesCol() {
    this.nawbForm.get('col').get('valuationChargeAmount').valueChanges.subscribe((data) => {
      this.colAdd();
    });
  }
  ontaxesChangesPpd() {
    this.nawbForm.get('ppd').get('taxesChargeAmount').valueChanges.subscribe((data) => {
      this.ppdAdd();
    });
  }
  ontaxesChangesCol() {
    this.nawbForm.get('col').get('taxesChargeAmount').valueChanges.subscribe((data) => {
      this.colAdd();
    });
  }
  onDaChangesppd() {
    this.nawbForm.get('ppd').get('totalOtherChargesDueAgentChargeAmount').valueChanges.subscribe((data) => {
      this.ppdAdd();
    });
  }
  onDaChangesCol() {
    this.nawbForm.get('col').get('totalOtherChargesDueAgentChargeAmount').valueChanges.subscribe((data) => {
      this.colAdd();
    });
  }
  onDcChangesppd() {
    this.nawbForm.get('ppd').get('totalOtherChargesDueCarrierChargeAmount').valueChanges.subscribe((data) => {
      this.ppdAdd();
    });
  }
  onDcChangesCol() {
    this.nawbForm.get('col').get('totalOtherChargesDueCarrierChargeAmount').valueChanges.subscribe((data) => {
      this.colAdd();
    });
  }

  onaddingDueAgentCharge(indicator, index) {
    let agentArray = this.nawbForm.get('otherChargesDueAgent').value;

    let sumppd = 0, sumcol = 0;
    agentArray.map((i) => {
      if (i.otherChargeIndicator == "P" && i.chargeAmount != null && i.flagCRUD != "D")
        sumppd = Number(sumppd) + Number(i.chargeAmount);
    });
    agentArray.map((i) => {
      if (i.otherChargeIndicator == "C" && i.chargeAmount != null && i.flagCrud != "D")
        sumcol = Number(sumcol) + Number(i.chargeAmount);
    });
    this.nawbForm.get('ppd').get('totalOtherChargesDueAgentChargeAmount').setValue(sumppd);
    this.nawbForm.get('col').get('totalOtherChargesDueAgentChargeAmount').setValue(sumcol);

  }
  ppdAdd() {
    let sum = 0;
    if (this.nawbForm.get('ppd').get('valuationChargeAmount').value != null)
      sum = Number(sum) + Number(this.nawbForm.get('ppd').get('valuationChargeAmount').value);

    if (this.nawbForm.get('ppd').get('totalWeightChargeAmount').value != null)
      sum = Number(sum) + Number(this.nawbForm.get('ppd').get('totalWeightChargeAmount').value);

    if (this.nawbForm.get('ppd').get('taxesChargeAmount').value != null)
      sum = Number(sum) + Number(this.nawbForm.get('ppd').get('taxesChargeAmount').value);

    if (this.nawbForm.get('ppd').get('totalOtherChargesDueAgentChargeAmount').value != null)
      sum = Number(sum) + Number(this.nawbForm.get('ppd').get('totalOtherChargesDueAgentChargeAmount').value);

    if (this.nawbForm.get('ppd').get('totalOtherChargesDueCarrierChargeAmount').value != null)
      sum = Number(sum) + Number(this.nawbForm.get('ppd').get('totalOtherChargesDueCarrierChargeAmount').value);

    this.nawbForm.get('ppd').get('chargeSummaryTotalChargeAmount').setValue(sum);
  }
  colAdd() {
    let sum = 0;
    if (this.nawbForm.get('col').get('valuationChargeAmount').value != null)
      sum = Number(sum) + Number(this.nawbForm.get('col').get('valuationChargeAmount').value);

    if (this.nawbForm.get('col').get('totalWeightChargeAmount').value != null)
      sum = Number(sum) + Number(this.nawbForm.get('col').get('totalWeightChargeAmount').value);

    if (this.nawbForm.get('col').get('taxesChargeAmount').value != null)
      sum = Number(sum) + Number(this.nawbForm.get('col').get('taxesChargeAmount').value);

    if (this.nawbForm.get('col').get('totalOtherChargesDueAgentChargeAmount').value != null)
      sum = Number(sum) + Number(this.nawbForm.get('col').get('totalOtherChargesDueAgentChargeAmount').value);

    if (this.nawbForm.get('col').get('totalOtherChargesDueCarrierChargeAmount').value != null)
      sum = Number(sum) + Number(this.nawbForm.get('col').get('totalOtherChargesDueCarrierChargeAmount').value);

    this.nawbForm.get('col').get('chargeSummaryTotalChargeAmount').setValue(sum);
  }

  onaddingDueCarrierCharge(indicator, index) {
    let agentArray = this.nawbForm.get('otherChargesDueCarrier').value;

    let sumppd = 0, sumcol = 0;
    agentArray.map((i) => {
      if (i.otherChargeIndicator == "P" && i.chargeAmount != null && i.flagCRUD != "D")
        sumppd = Number(sumppd) + Number(i.chargeAmount);
    });
    agentArray.map((i) => {
      if (i.otherChargeIndicator == "C" && i.chargeAmount != null && i.flagCRUD != "D")
        sumcol = Number(sumcol) + Number(i.chargeAmount);
    });
    this.nawbForm.get('ppd').get('totalOtherChargesDueCarrierChargeAmount').setValue(sumppd);
    this.nawbForm.get('col').get('totalOtherChargesDueCarrierChargeAmount').setValue(sumcol);

  }
  onSelectAccountingIdentifier(event, item) {
    // this.nawbForm.get(['accountingInfo', item, 'accountingInformation']).setValue(event.desc);
  }
  onAddRowNotification(sindex) {

    if ((<NgcFormArray>this.nawbForm.get(["rateDescriptionForNawb", "rateDescriptionOtherInfoForNawb"])).value.length < 11) {
      (<NgcFormArray>this.nawbForm.get(["rateDescriptionForNawb", "rateDescriptionOtherInfoForNawb"])).addValue([
        new RateDescOtherInfo()
      ]);
    }
    else {
      this.showInfoStatus("export.max.limit.exceeded");
    }

  }
  onAddRowNotificationForNawb(sindex) {
    if ((<NgcFormArray>this.nawbForm.get(["rateDescriptionForNawb", sindex, "rateDescriptionOtherInfoForNawb"])).length > 9) {
      this.showInfoStatus("export.max.no.of.rows.exceeded");
      return;
    }
    (<NgcFormArray>this.nawbForm.get(['rateDescriptionForNawb', sindex, 'rateDescriptionOtherInfoForNawb'])).addValue([
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
        "rateLineNumber": 1,
        "type": ""
      }
    ]);
  }


  onDeleteRateDescOtherInfoForNawb(index, sindex) {
    (this.nawbForm.get(["rateDescriptionForNawb", index, "rateDescriptionOtherInfoForNawb", sindex]) as NgcFormGroup).markAsDeleted();
  }

  onDimensionValue(dimensionRequired, index, subIndex) {
    if (dimensionRequired) {
      this.nawbForm.get(["rateDescriptionForNawb", index, "rateDescriptionOtherInfoForNawb", subIndex, 'measurementUnitCode']).clearValidators();
      this.nawbForm.get(["rateDescriptionForNawb", index, "rateDescriptionOtherInfoForNawb", subIndex, 'dimensionLength']).clearValidators();
      this.nawbForm.get(["rateDescriptionForNawb", index, "rateDescriptionOtherInfoForNawb", subIndex, 'dimensionWIdth']).clearValidators();
      this.nawbForm.get(["rateDescriptionForNawb", index, "rateDescriptionOtherInfoForNawb", subIndex, 'dimensionHeight']).clearValidators();
      this.nawbForm.get(["rateDescriptionForNawb", index, "rateDescriptionOtherInfoForNawb", subIndex, 'numberOfPieces']).clearValidators();
    } else {
      this.nawbForm.get(["rateDescriptionForNawb", index, "rateDescriptionOtherInfoForNawb", subIndex, 'measurementUnitCode']).setValidators(Validators.required);
      this.nawbForm.get(["rateDescriptionForNawb", index, "rateDescriptionOtherInfoForNawb", subIndex, 'dimensionLength']).setValidators(Validators.required);
      this.nawbForm.get(["rateDescriptionForNawb", index, "rateDescriptionOtherInfoForNawb", subIndex, 'dimensionWIdth']).setValidators(Validators.required);
      this.nawbForm.get(["rateDescriptionForNawb", index, "rateDescriptionOtherInfoForNawb", subIndex, 'dimensionHeight']).setValidators(Validators.required);
      this.nawbForm.get(["rateDescriptionForNawb", index, "rateDescriptionOtherInfoForNawb", subIndex, 'numberOfPieces']).setValidators(Validators.required);
    }
  }

  onCommodityRateChange(index) {
    let chargeableWeight = this.nawbForm.get(['rateDescriptionForNawb', index, 'chargeableWeight']).value;
    let rateChargeAmount = this.nawbForm.get(['rateDescriptionForNawb', index, 'rateChargeAmount']).value;
    let total: any = 0;
    let rateClass = this.nawbForm.getRawValue().rateDescriptionForNawb[index].rateClassCode;
    if (rateClass == 'B' || rateClass == 'M' || rateClass == 'U') {
      total = Number(rateChargeAmount);
    } else if (rateClass == 'R' || rateClass == 'S') {
      total = 0;
    } else {
      total = Math.ceil((Number(rateChargeAmount) * Number(chargeableWeight)) / 0.01) * 0.01;
    }
    this.nawbForm.get(['rateDescriptionForNawb', index, 'totalChargeAmount']).patchValue(total);
    this.onTotalChargeAmount(index);
  }

  onTotalChargeAmount(index) {
    let data = this.nawbForm.get(['rateDescriptionForNawb', index, 'totalChargeAmount']).value;
    let chargeDecl = this.nawbForm.get('chargeDeclaration').get('prepaIdCollectChargeDeclaration').value;
    if (data || data == 0) {
      let totalRate: any = 0;
      this.nawbForm.getRawValue().rateDescriptionForNawb.forEach(rate => {
        totalRate += Number(rate.totalChargeAmount);
      });
      //Considering both P and PP as Prepaid
      if (chargeDecl == "PP" || chargeDecl == "P") {
        this.nawbForm.get('ppd').get('totalWeightChargeAmount').setValue(totalRate);
        this.nawbForm.get('col').get('totalWeightChargeAmount').setValue(null);
      }
      //Considering both C and CC as Collect
      else if (chargeDecl == "CC" || chargeDecl == "C") {
        this.nawbForm.get('col').get('totalWeightChargeAmount').setValue(totalRate);
        this.nawbForm.get('ppd').get('totalWeightChargeAmount').setValue(null);
      }
    }
  }

  onChange(event, sitem) {
    if (event.srcElement) {
      let val = event.srcElement.children[1].value;
      sitem.get('type').patchValue(val);
    }
  }

  prepaIdCollectChargeDeclarationChange() {
    this.nawbForm.get('chargeDeclaration').get('prepaIdCollectChargeDeclaration').valueChanges.subscribe((data) => {
      let totalRate: any = 0;
      this.nawbForm.getRawValue().rateDescriptionForNawb.forEach(rate => {
        totalRate += Number(rate.totalChargeAmount);
      });
      if (data == "PP") {
        if (totalRate) {
          this.nawbForm.get('ppd').get('totalWeightChargeAmount').setValue(totalRate);
          this.nawbForm.get('col').get('totalWeightChargeAmount').setValue(null);
        }
      }
      else if (data == "CC") {
        if (totalRate) {
          this.nawbForm.get('col').get('totalWeightChargeAmount').setValue(totalRate);
          this.nawbForm.get('ppd').get('totalWeightChargeAmount').setValue(null);
        }
      }
    });
  }
  checkForAlsoNotify(): boolean {
    let check = false;
    if (this.nawbForm.get('alsoNotify').get('customerCode').value != null ||
      this.nawbForm.get('alsoNotify').get('customerName').value != null ||
      this.nawbForm.get('alsoNotify').get('customerAddressInfo').get('streetAddress1').value != null ||
      this.nawbForm.get('alsoNotify').get('customerAddressInfo').get('customerPlace').value != null ||
      this.nawbForm.get('alsoNotify').get('customerAddressInfo').get('countryCode').value != null) {
      check = this.checkAlsoNotifyErrors();
    }
    return check;
  }
  checkAlsoNotifyErrors(): boolean {
    let check = false;
    if (this.nawbForm.get('alsoNotify').get('customerName').value == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.nawbForm.get(['alsoNotify', 'customerName']), "export.fill.details");
      check = true;
    }
    if (this.nawbForm.get('alsoNotify').get('customerAddressInfo').get('streetAddress1').value == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.nawbForm.get('alsoNotify').get(['customerAddressInfo', 'streetAddress1']), "export.fill.details");
      check = true;
    }
    if (this.nawbForm.get('alsoNotify').get('customerAddressInfo').get('customerPlace').value == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.nawbForm.get('alsoNotify').get(['customerAddressInfo', 'customerPlace']), "export.fill.details");
      check = true;
    }
    if (this.nawbForm.get('alsoNotify').get('customerAddressInfo').get('countryCode').value == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.nawbForm.get('alsoNotify').get(['customerAddressInfo', 'countryCode']), "export.fill.details");
      check = true;
    }
    return check;
  }

  printNAWBReport(event) {
    this.reportParameters = new Object();
    this.reportParameters.shipmentNumber = this.nawbForm.get('awbNumber').value;
    this.reportParameters.nawbID = this.sidResponse.neutralAWBId;
    this.reportWindow.open();
  }

  printNAWBCopy(event) {
    const requestPrintNawbCopy = this.nawbForm.getRawValue();
    this.requestedFlight = [];
    this.requestFlightDate = [];
    // to be changes as list
    for (let i = 0; i < 2; i++) {
      if (requestPrintNawbCopy.flightBookingList[i] && requestPrintNawbCopy.flightBookingList[i].carrierCode && requestPrintNawbCopy.flightBookingList[i].flightNumber && requestPrintNawbCopy.flightBookingList[i].flightDate) {
        this.requestedFlight.push(requestPrintNawbCopy.flightBookingList[i].carrierCode + requestPrintNawbCopy.flightBookingList[i].flightNumber);
        let newDate = new Date(requestPrintNawbCopy.flightBookingList[i].flightDate);
        this.requestFlightDate.push(NgcUtility.getDateAsString(newDate));
      }
    }
    // Below code is commented so that max 2 flight can be sent for print
    // if (requestPrintNawbCopy.flightBookingList[0].carrierCode && requestPrintNawbCopy.flightBookingList[0].flightNumber && requestPrintNawbCopy.flightBookingList[0].flightDate) {
    //   this.requestedFlight = requestPrintNawbCopy.flightBookingList[0].carrierCode + requestPrintNawbCopy.flightBookingList[0].flightNumber
    //   let newDate = new Date(requestPrintNawbCopy.flightBookingList[0].flightDate);
    //   this.requestFlightDate = newDate;
    // }
    if (requestPrintNawbCopy.shcCode.length) {
      this.shcCodes = null;
      requestPrintNawbCopy.shcCode.forEach(shc => {
        this.shcCodes = this.shcCodes !== null ? this.shcCodes + ' ' + shc.specialHandlingCode : shc.specialHandlingCode;
      });

    }

    else {
      this.shcCodes = null;
    }
    this.chargeAmountData = [];
    this.accountingInfo = [];
    this.commodity = [];
    let i = 0, j = 0, k = 0, l = 0;
    requestPrintNawbCopy.otherChargesDueAgent.forEach(obj => {
      if (obj.chargeAmount == null) {
        obj.chargeAmount = '';
      } else if (obj.chargeAmount.includes(".")) {
        obj.chargeAmount = "  " + obj.chargeAmount
      } else {
        obj.chargeAmount = "  " + obj.chargeAmount + '.00'
      }
      this.chargeAmountData[i] = obj.otherChargeCode + 'A' + obj.chargeAmount;
      i = i + 1;
    })


    requestPrintNawbCopy.otherChargesDueCarrier.forEach(obj => {
      if (obj.chargeAmount == null) {
        obj.chargeAmount = '';
      } else if (obj.chargeAmount.includes(".")) {
        obj.chargeAmount = "  " + obj.chargeAmount
      } else {
        obj.chargeAmount = "  " + obj.chargeAmount + '.00'
      }
      this.chargeAmountData[i] = obj.otherChargeCode + 'C' + obj.chargeAmount;
      i = i + 1;
    })

    requestPrintNawbCopy.rateDescriptionForNawb.forEach(element => {
      element.rateDescriptionOtherInfoForNawb.forEach(obj => {
        if (obj.type == 'NV') {
          obj.volumeAmount = "Volume " + obj.volumeAmount + '.0';
          this.commodity[k] = obj.volumeAmount;
        }
        else if (obj.type == 'ND') {
          obj.dimensionHeight = "DIM " + obj.dimensionLength + 'X' + obj.dimensionWIdth + 'X' + obj.dimensionHeight + '/' + obj.numberOfPieces;
          this.commodity[k] = obj.dimensionHeight;
        }
        else if (obj.type == 'NC') {
          this.commodity[k] = obj.natureOfGoodsDescription;
        }
        else if (obj.type == 'NG') {
          this.commodity[k] = obj.natureOfGoodsDescription;
        }
        else if (obj.type == 'NU') {
          obj.uldNumber = 'ULD ' + obj.uldNumber;
          this.commodity[k] = obj.uldNumber;
        }
        else if (obj.type == 'NS') {
          obj.slacCount = 'SLAC ' + obj.slacCount;
          this.commodity[k] = obj.slacCount;
        }
        else if (obj.type == 'NH') {
          obj.harmonisedCommodityCode = 'HCC ' + obj.harmonisedCommodityCode;
          this.commodity[k] = obj.harmonisedCommodityCode;
        }

        k = k + 1;
      })
    });
    requestPrintNawbCopy.accountingInfo.forEach(obj => {
      this.accountingInfo[j] = obj.accountingInformation;
      j = j + 1;
    })

    // code change to accomodate only top 3 values based on ssr/osi

    const ssr = requestPrintNawbCopy.ssrOsiInfo.filter(element => element.serviceRequestType === 'SSR');
    const osi = requestPrintNawbCopy.ssrOsiInfo.filter(element => element.serviceRequestType === 'OSI');

    let totalLength = ssr.length + osi.length;
    let ssrLength = ssr.length;
    let osiLength = osi.length;
    let tempOsi = 0;
    let tempSsr = 0;
    if (totalLength > 0) {

      for (l = 0; l < totalLength; l++) {
        if (ssrLength > 0 && tempSsr < ssrLength) {
          this.handlingInformation[l] = ssr[tempSsr].serviceRequestcontent;
          tempSsr++;
        } else {
          this.handlingInformation[l] = osi[tempOsi].serviceRequestcontent;
          tempOsi++;
        }
      }

    }

    if (requestPrintNawbCopy.chargeDeclaration.chargeCode == 'PP') {
      this.wtPPDPrepaid = 'X';
      this.otherPrepaid = 'X';
    }
    else if (requestPrintNawbCopy.chargeDeclaration.chargeCode == 'CC') {
      this.wtPPDCollect = 'X';
      this.otherCollect = 'X';
    }
    let consigneeContact: any = [];
    if (requestPrintNawbCopy.consigneeInfo.customerAddressInfo.customerContactInfo.length > 0) {
      requestPrintNawbCopy.consigneeInfo.customerAddressInfo.customerContactInfo.forEach(element => {
        if (null == element.contactIdentifier) element.contactIdentifier = "";
        if (null == element.contactDetail) element.contactDetail = "";
        consigneeContact.push(element.contactIdentifier + ' ' + element.contactDetail)
      });
    }

    let shipperContact: any = [];
    if (requestPrintNawbCopy.shipperInfo.customerAddressInfo.customerContactInfo.length > 0) {
      requestPrintNawbCopy.shipperInfo.customerAddressInfo.customerContactInfo.forEach(element => {
        if (null == element.contactIdentifier) element.contactIdentifier = "";
        if (null == element.contactDetail) element.contactDetail = "";
        shipperContact.push(element.contactIdentifier + ' ' + element.contactDetail)
      });
    }

    this.request = {
      tc: requestPrintNawbCopy.origin,
      destApt: requestPrintNawbCopy.destination,
      totalNoPieces: requestPrintNawbCopy.pieces,
      departCode: requestPrintNawbCopy.origin,
      awbNumber: requestPrintNawbCopy.awbNumber,
      carrierAgentName: 'SINGAPORE AIRLINES LIMITED',
      consigneePostalCode: requestPrintNawbCopy.consigneeInfo.customerAddressInfo.postalCode,
      consigneeCountry: requestPrintNawbCopy.consigneeInfo.customerAddressInfo.customerPlace,
      consigneeAdd: requestPrintNawbCopy.consigneeInfo.customerAddressInfo.streetAddress1,
      consigneeName: requestPrintNawbCopy.consigneeInfo.customerName,
      consigneeAccNo: requestPrintNawbCopy.consigneeInfo.customerAccountNumber,
      shipperPostalCode: requestPrintNawbCopy.shipperInfo.customerAddressInfo.postalCode,
      shipperCountry: requestPrintNawbCopy.shipperInfo.customerAddressInfo.customerPlace,
      shipperAdd: requestPrintNawbCopy.shipperInfo.customerAddressInfo.streetAddress1,
      shipperName: requestPrintNawbCopy.shipperInfo.customerName,
      shipperAccNo: requestPrintNawbCopy.shipperInfo.customerAccountNumber,
      handlingCode: this.shcCodes,
      totalGrossWeight: requestPrintNawbCopy.weight,
      carrierAgentCity: requestPrintNawbCopy.agentInfo.agentPlace,
      aentIATACode: requestPrintNawbCopy.agentInfo.cargAgentNumericCode.toString(),
      customValue: requestPrintNawbCopy.chargeDeclaration.customsValueDeclaration,
      departApt: requestPrintNawbCopy.routingList[0].to,
      carriage: requestPrintNawbCopy.chargeDeclaration.carriageValueDeclaration,
      chgsCode: requestPrintNawbCopy.chargeDeclaration.chargeCode,
      currencies: requestPrintNawbCopy.chargeDeclaration.currencyCode,
      routeTo: requestPrintNawbCopy.destination,
      accountNo: requestPrintNawbCopy.agentInfo.accountNumber,
      agentCode: 'SATS',
      flightBookingToList: requestPrintNawbCopy.flightBookingList,
      routingToByList: requestPrintNawbCopy.routingList,
      commodityChargesList: requestPrintNawbCopy.rateDescriptionForNawb,

      prepaidWc: requestPrintNawbCopy.ppd.totalWeightChargeAmount ? Number(requestPrintNawbCopy.ppd.totalWeightChargeAmount).toFixed(this.fractionScale) : null,
      prepaidVc: requestPrintNawbCopy.ppd.valuationChargeAmount ? Number(requestPrintNawbCopy.ppd.valuationChargeAmount).toFixed(this.fractionScale) : null,
      prepaidTax: requestPrintNawbCopy.ppd.taxesChargeAmount ? Number(requestPrintNawbCopy.ppd.taxesChargeAmount).toFixed(this.fractionScale) : null,
      prepaidOcA: requestPrintNawbCopy.ppd.totalOtherChargesDueAgentChargeAmount ? Number(requestPrintNawbCopy.ppd.totalOtherChargesDueAgentChargeAmount).toFixed(this.fractionScale) : null,
      prepaidOcC: requestPrintNawbCopy.ppd.totalOtherChargesDueCarrierChargeAmount ? Number(requestPrintNawbCopy.ppd.totalOtherChargesDueCarrierChargeAmount).toFixed(this.fractionScale) : null,
      totalPrepaid: requestPrintNawbCopy.ppd.chargeSummaryTotalChargeAmount ? Number(requestPrintNawbCopy.ppd.chargeSummaryTotalChargeAmount).toFixed(this.fractionScale) : null,
      collectWc: requestPrintNawbCopy.col.totalWeightChargeAmount ? Number(requestPrintNawbCopy.col.totalWeightChargeAmount).toFixed(this.fractionScale) : null,
      collectVc: requestPrintNawbCopy.col.valuationChargeAmount ? Number(requestPrintNawbCopy.col.valuationChargeAmount).toFixed(this.fractionScale) : null,
      collectTax: requestPrintNawbCopy.col.taxesChargeAmount ? Number(requestPrintNawbCopy.col.taxesChargeAmount).toFixed(this.fractionScale) : null,
      collectOcA: requestPrintNawbCopy.col.totalOtherChargesDueAgentChargeAmount ? Number(requestPrintNawbCopy.col.totalOtherChargesDueAgentChargeAmount).toFixed(this.fractionScale) : null,
      collectOcC: requestPrintNawbCopy.col.totalOtherChargesDueCarrierChargeAmount ? Number(requestPrintNawbCopy.col.totalOtherChargesDueCarrierChargeAmount).toFixed(this.fractionScale) : null,
      totalCollect: requestPrintNawbCopy.col.chargeSummaryTotalChargeAmount ? Number(requestPrintNawbCopy.col.chargeSummaryTotalChargeAmount).toFixed(this.fractionScale) : null,

      dueChargeAmount: this.chargeAmountData,
      accountingInfo: this.accountingInfo,
      commodityList: this.commodity,
      requestedFlight: this.requestedFlight,
      requestedFlightDate: this.requestFlightDate,
      firstFlightCarrier: requestPrintNawbCopy.routingList[0].carrierCode,
      insuranceValueDeclaration: requestPrintNawbCopy.chargeDeclaration.insuranceValueDeclaration,
      executionDate: NgcUtility.getDateAsString(requestPrintNawbCopy.carriersExecutionDate),
      executionPlace: requestPrintNawbCopy.carriersExecutionPlace,
      consigneeContactDetail: consigneeContact,
      shipperContactDetail: shipperContact,
      issuingAgentName: requestPrintNawbCopy.agentInfo.agentName,
      issuingAgentPlace: requestPrintNawbCopy.agentInfo.agentPlace,
      handlingInfo: this.handlingInformation,
      wtPPDPrepaid: this.wtPPDPrepaid,
      otherPrepaid: this.otherPrepaid,
      wtPPDCollect: this.wtPPDCollect,
      otherCollect: this.otherCollect,
      carriersExecutionAuthorisationSignature: requestPrintNawbCopy.carriersExecutionAuthorisationSignature

    }
    this.windowPrinter.open();
  }

  printNAWB() {
    this.showSuccessStatus("export.request.to.print.successfully");
    this.windowPrinter.hide();
    if (this.popupPrinterForm.get("printerdropdown").value == null) {
      this.showErrorStatus("expaccpt.select.printer.and.proceed");
    }
    else {
      this.request.printerName = this.popupPrinterForm.get("printerdropdown").value;
      this.exportService.printNAWBCopy(this.request).subscribe((resp) => {
        // if (!resp.messageList) {
        //   this.showSuccessStatus("g.operation.successful");
        // } else {
        //   this.showErrorStatus(resp.messageList[0].message);
        // }
      }, error => {
        this.showErrorStatus(error);
      });
    }
  }

  setAppointedAgent(appointedAgentData) {
    this.customerId = appointedAgentData.param3;
  }
}