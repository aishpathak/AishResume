import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcWindowComponent, PageConfiguration, NgcFileUploadComponent, NgcReportComponent, NgcPrinterComponent, NgcUtility } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShipmentInfoReqModel, ShipmentData, SearchInactiveCargo } from '../awbManagement.shared';
import { AwbManagementService } from '../awbManagement.service';
import { SearchShipmentLocation } from '../awbManagement.shared';
import { NgcFormArray } from 'ngc-framework/core/model/formarray.model';
import { ApplicationFeatures } from '../../common/applicationfeatures';
import { ApplicationEntities } from '../../common/applicationentities';
import { CollectPaymentService } from './../../billing/collectPayment/collectPayment.service';

@Component({
  selector: 'app-hwb-information',
  templateUrl: './hwb-information.component.html',
  styleUrls: ['./hwb-information.component.scss']
})
@PageConfiguration({
  trackInit: true,
})
export class HwbInformationComponent extends NgcPage {
  AWBNumber: any;
  responseArray: any;
  allSum: any;
  paidTotalCharge: any = 0;
  cancelShipmentReason: String = null;
  allTotalsCharge: any = 0;
  totalFlightPieces: any = 0;
  totalFlightWeight: any = 0;
  totalBookingPieces: any = 0;
  totalBookingWeight: any = 0;
  totalLoadedPieces: any = 0;
  totalLoadedWeight: any = 0;
  totalPartPieces: any = 0;
  totalPartWeight: any = 0;
  totalFrtPieces: any = 0;
  totalFrtWeight: any = 0;
  totalDeliveryPieces: any = 0;
  totalDeliveryWeight: any = 0;
  collectTotal: any = 0;
  shipmentType1: any = "AWB";
  Shipmentdateofreport: any;
  documentInformationId: any;
  partShpFlag: boolean = false;
  tramDetails: boolean = false;
  valCheck: boolean = false;
  bookingInfoTitle: any = 'BOOKING INFO';
  features: any;
  featureCNBilling: boolean = false;
  isCnBillingCall: boolean = false;
  chargeResponse: any = new Array();
  inventoryDetails: any = new Array();
  hawbInvalid: boolean = false;
  handledbyHouse: boolean = false;
  hawbSourceParameters: {};
  totalChgWeight: any = 0;
  colorMapping = {
    "INT": {
      bgColor: 'blue'
    },
    "DOM": {
      bgColor: 'gray'
    }
  };
  templateRef: TemplateRef<any>;
  isClosePopupScreen: boolean = true;
  title: string;
  popUpWidth: Number;
  popUpHeight: Number;
  showMe: boolean = false;
  @ViewChild('parentWindow') parentWindow: NgcWindowComponent;
  @ViewChild('courierTagPopUp') courierTagPopUp: NgcWindowComponent;
  @ViewChild('rfidTagPopUp') rfidTagPopUp: NgcWindowComponent;
  @ViewChild('shipmentLocation') shipmentLocation: TemplateRef<any>;
  @ViewChild('maintainHouseMaster') maintainHouseMaster: TemplateRef<any>;
  @ViewChild('maintainRemark') maintainRemark: TemplateRef<any>;
  @ViewChild('CaptureDamage') CaptureDamage: TemplateRef<any>;
  @ViewChild('shipmentOnHold') shipmentOnHold: TemplateRef<any>;
  @ViewChild('maintainShipmentIrregularity') maintainShipmentIrregularity: TemplateRef<any>;


  @ViewChild('infoPopUp') infoPopUp: NgcWindowComponent;
  @ViewChild('damageInfoPopUp') damageInfoPopUp: NgcWindowComponent;
  @ViewChild('fwbMsgPopUp') fwbMsgPopUp: NgcWindowComponent;
  @ViewChild('fsuMsgPopUp') fsuMsgPopUp: NgcWindowComponent;
  @ViewChild('partShpPopUp') partShpPopUp: NgcWindowComponent;
  @ViewChild('fhlMsgPopUp') fhlMsgPopUp: NgcWindowComponent;
  @ViewChild('docfiles') docfiles: NgcFileUploadComponent;
  @ViewChild('houseSummaryWindow') houseSummaryWindow: NgcWindowComponent;
  @ViewChild('reportWindowHwbWeightSlip') reportWindowHwbWeightSlip: NgcReportComponent;
  @ViewChild('reportWindowHwbTotalWeightSlip') reportWindowHwbTotalWeightSlip: NgcReportComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  @ViewChild('reportWindow3') reportWindow3: NgcReportComponent;
  @ViewChild('reportWindow4') reportWindow4: NgcReportComponent;
  @ViewChild('reportWindow5') reportWindow5: NgcReportComponent;
  @ViewChild('cancelShpPopUp') cancelShpPopUp: NgcWindowComponent;
  @ViewChild('manualFreightOut') manualFreightOut: NgcWindowComponent;
  @ViewChild('remarksPopup') remarksPopup: NgcWindowComponent;
  @ViewChild('CapturePhoto') CapturePhoto: TemplateRef<any>;

  stausForCancel: any;
  cancelShipmentRmrk: any;
  forwardedData: any;
  dataToNavigateBack: any;
  /**
  * Initialize
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private awbManagementService: AwbManagementService, private collectPaymentService: CollectPaymentService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private shipmentInfoForm: NgcFormGroup = new NgcFormGroup({

    searchFormGroup: new NgcFormGroup({
      shipmentNumber: new NgcFormControl(''),
      shipmentDate: new NgcFormControl(''),
      cancelledOn: new NgcFormControl(''),
      cancelShipmentRmrk: new NgcFormControl(''),
      shipmentType: new NgcFormControl(''),
      hwbNumber: new NgcFormControl(''),
      shipmentHouseId: new NgcFormControl('')
    }),
    freightOutremarks: new NgcFormGroup({
      remarks: new NgcFormControl(),
      remarkType: new NgcFormControl(),
      flightNumber: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      doNumber: new NgcFormControl(),
      trmNumber: new NgcFormControl(),
      trmDate: new NgcFormControl(),
      type: new NgcFormControl(),
      inventoryDetails: new NgcFormArray([
        new NgcFormGroup({
          select: new NgcFormControl(''),
          shipmentLocation: new NgcFormControl(''),
          inventoryPieces: new NgcFormControl(''),
          inventoryWeight: new NgcFormControl(''),
          warehouseLocation: new NgcFormControl(''),
          shcs: new NgcFormControl(''),
          locked: new NgcFormControl(''),
          lockedBy: new NgcFormControl(''),
          lockReason: new NgcFormControl(''),
          deliveryRequestInfo: new NgcFormControl(''),
          inventoryChgWeight: new NgcFormControl('')
        })
      ]),
      localAuthorityDetail: new NgcFormArray([
        new NgcFormGroup({
          referenceNumber: new NgcFormControl(),
          customerAppAgentId: new NgcFormControl(),
          license: new NgcFormControl(null, [Validators.maxLength(65)]),
          remarks: new NgcFormControl(null, [Validators.maxLength(65)]),
        })
      ])
    }),
    cancelShipmentInfoForm: new NgcFormGroup({
      cancelRemark: new NgcFormControl(''),
      encryptPasswordChange: new NgcFormControl('')
    }),
    shipmentInfoFormGroup: new NgcFormGroup({
      sumAmount: new NgcFormControl(''),
      shipmentNumber: new NgcFormControl(''),
      awbOnHold: new NgcFormControl(''),
      lar: new NgcFormControl(''),
      origin: new NgcFormControl(''),
      svc: new NgcFormControl(''),
      destination: new NgcFormControl(''),
      awbPiece: new NgcFormControl(''),
      awbWeight: new NgcFormControl(''),
      actualPieces: new NgcFormControl(''),
      actualWeight: new NgcFormControl(''),
      natureOfGoods: new NgcFormControl(''),
      shcs: new NgcFormControl(''),
      indicatorDomIntl: new NgcFormControl(''),
      partShipment: new NgcFormControl(''),
      slacPieces: new NgcFormControl(''),
      volume: new NgcFormControl(''),
      consol: new NgcFormControl(''),
      receivedOn: new NgcFormControl(''),
      eawb: new NgcFormControl(''),
      pouchReceived: new NgcFormControl(''),
      fwbe: new NgcFormControl(''),
      fwb: new NgcFormControl(''),
      fhl: new NgcFormControl(''),
      fwbm: new NgcFormControl(''),
      fhle: new NgcFormControl(''),
      fhlm: new NgcFormControl(''),
      fsu: new NgcFormControl(''),
      agent: new NgcFormControl(''),
      rcarType: new NgcFormControl(''),
      releasedOn: new NgcFormControl(''),
      releasedBy: new NgcFormControl(''),
      awbRemarks: new NgcFormControl(''),
      shipmentRemarks: new NgcFormControl(''),
      uploadedDocument: new NgcFormControl(''),
      courierTag: new NgcFormControl(''),
      rfidTag: new NgcFormControl(''),
      canReUse: new NgcFormControl(''),
      abondanedCargo: new NgcFormControl(''),
      uploadedDocuments: new NgcFormControl(''),
      emailTo: new NgcFormControl(''),
      shipmentHouseId: new NgcFormControl(''),
      housePieces: new NgcFormControl(''),
      houseWeight: new NgcFormControl(''),
      houseOrigin: new NgcFormControl(''),
      houseDestination: new NgcFormControl(''),
      houseChargeableWeight: new NgcFormControl(''),
      houseNOG: new NgcFormControl(''),
      chargebleWeight: new NgcFormControl(''),
      houseShcs: new NgcFormControl(''),
      houseCustomerCode: new NgcFormControl(''),
      hwbNumber: new NgcFormControl(''),
      customClearanceFlag: new NgcFormControl(''),
      securitycClearFlag: new NgcFormControl(''),
      houseChgWeight: new NgcFormControl(''),
      incomingFlightDetails: new NgcFormArray([
        new NgcFormGroup({
          flightDetailsKey: new NgcFormControl(''),
          flightDate: new NgcFormControl(''),
          flightDetailsSta: new NgcFormControl(''),
          flightDetailsBoardPoint: new NgcFormControl(''),
          manifestPieces: new NgcFormControl(''),
          manifestWeight: new NgcFormControl(''),
          breakdownPieces: new NgcFormControl(''),
          breakdownWeight: new NgcFormControl(''),
          photoCopyAwbFlag: new NgcFormControl(''),
          documentReceivedFlag: new NgcFormControl(''),
          readyForDelivery: new NgcFormControl(''),
          screeningCompleted: new NgcFormControl(''),
          bookingPieces: new NgcFormControl(''),
          flightOffPoint: new NgcFormControl(''),
          flightRemarks: new NgcFormControl(''),
          shipmentStatus: new NgcFormControl(''),
          flightFsuStatus: new NgcFormControl(''),
          flightScreeningCompleted: new NgcFormControl(''),
          flightDetailsStaTime: new NgcFormControl(''),
          viewDamage: new NgcFormControl(''),
          irregularityInfo: new NgcFormControl(''),
          damagedPieces: new NgcFormControl(''),
          shipmentFlightCustomsInfo: new NgcFormGroup({
            rfe: new NgcFormControl(''),
            ffe: new NgcFormControl(''),
            boe: new NgcFormControl(''),
            oc: new NgcFormControl(''),
            cav: new NgcFormControl(''),
            totalDuty: new NgcFormControl(''),
            edoNumber: new NgcFormControl(''),
            edoDate: new NgcFormControl('')
          }),
          inventoryDetails: new NgcFormArray([
            new NgcFormGroup({
              shipmentLocation: new NgcFormControl(''),
              inventoryPieces: new NgcFormControl(''),
              inventoryWeight: new NgcFormControl(''),
              warehouseLocation: new NgcFormControl(''),
              shcs: new NgcFormControl(''),
              locked: new NgcFormControl(''),
              lockedBy: new NgcFormControl(''),
              lockReason: new NgcFormControl(''),
              deliveryRequestInfo: new NgcFormControl(''),
              inventoryChgWeight: new NgcFormControl('')
            })
          ]),
          loadingInfoModels: new NgcFormArray([
            new NgcFormGroup({
              assignedUldOrTrolley: new NgcFormControl(''),
              loadedPieces: new NgcFormControl(''),
              loadedWeight: new NgcFormControl(''),
              offLoadedPieces: new NgcFormControl(''),
              offLoadedWeight: new NgcFormControl(''),
              buildupComplete: new NgcFormControl('')
            })
          ]),
          damageDetails: new NgcFormArray([
            new NgcFormGroup({
              flightId: new NgcFormControl(''),
              referenceId: new NgcFormControl(''),
              natureOfDamage: new NgcFormControl(''),
              damagedPieces: new NgcFormControl(''),
              occurrence: new NgcFormControl(''),
              severity: new NgcFormControl('')
            })
          ]),
          remarks: new NgcFormArray([
            new NgcFormGroup({
              shipmentRemarks: new NgcFormControl('')
            })
          ]),
          noalist: new NgcFormArray([
            new NgcFormGroup({
              noaemail: new NgcFormControl(''),
              noadate: new NgcFormControl(''),
            })
          ])
        })
      ]),
      outbooundFlightDetails: new NgcFormArray([
        new NgcFormGroup({
          bookingFlightKey: new NgcFormControl(''),
          bookingStatusCode: new NgcFormControl(''),
          transferType: new NgcFormControl(''),
          bookingSta: new NgcFormControl(''),
          bookingFlightBoardingPoint: new NgcFormControl(''),
          manifestPieces: new NgcFormControl(''),
          documentReceivedFlag: new NgcFormControl(''),
          readyForDelivery: new NgcFormControl(''),
          screeningCompleted: new NgcFormControl(''),
          bookingPieces: new NgcFormControl(''),
          bookingFlightOffPoint: new NgcFormControl(''),
          flightRemarks: new NgcFormControl(''),
          shipmentstatus: new NgcFormControl(''),
          flightFsuStatus: new NgcFormControl(''),
          flightScreeningCompleted: new NgcFormControl(''),
          flightDetailsStaTime: new NgcFormControl(''),
          loadingInfoModels: new NgcFormArray([
            new NgcFormGroup({
              assignedUldOrTrolley: new NgcFormControl(''),
              loadedPieces: new NgcFormControl(''),
              loadedWeight: new NgcFormControl(''),
              offLoadedPieces: new NgcFormControl(''),
              offLoadedWeight: new NgcFormControl(''),
              buildupComplete: new NgcFormControl('')
            })
          ])
        })
      ]),
      shipmentDeliveryDetails: new NgcFormArray([
        new NgcFormGroup({
          doNumber: new NgcFormControl(''),
          deliveryDate: new NgcFormControl(''),
          deliveryPieces: new NgcFormControl(''),
          deliveryWeight: new NgcFormControl(''),
          remarks: new NgcFormControl(''),
          referenceNumber: new NgcFormControl(''),
          status: new NgcFormControl('')
        })
      ]),
      chargeAdvice: new NgcFormArray([
        new NgcFormGroup({
          receipt: new NgcFormControl(''),
          totalSum: new NgcFormControl(''),
          allTotals: new NgcFormControl(''),
          serviceType: new NgcFormControl(''),
          quantity: new NgcFormControl(''),
          duration: new NgcFormControl(''),
          amount: new NgcFormControl(''),
          paid: new NgcFormControl(''),
          receiptNumber: new NgcFormControl(''),
          waivedAmount: new NgcFormControl('')
        })
      ]),
      acceptanceDetails: new NgcFormArray([
        new NgcFormGroup({
          eacceptance: new NgcFormControl(''),
          ServiceCreationDateTime: new NgcFormControl(''),
          acceptedPiece: new NgcFormControl(''),
          acceptanceType: new NgcFormControl(''),
          declaredPieceWeight: new NgcFormControl(''),
          acceptanceStatus: new NgcFormControl(''),
          acceptanceRemarks: new NgcFormControl(''),
          requestedTemperatureRange: new NgcFormControl(''),
          truckType: new NgcFormControl('')
        })
      ]),
      tmDetails: new NgcFormArray([
        new NgcFormGroup({
          trmNumber: new NgcFormControl(''),
          transfereeCarrier: new NgcFormControl(''),
          receivingCarrier: new NgcFormControl(''),
          finalized: new NgcFormControl('')
        })
      ]),
      fwbOutgoingMessageSummary: new NgcFormArray([
        new NgcFormGroup({
          message: new NgcFormControl(''),
          messageType: new NgcFormControl(''),
          messageSentOn: new NgcFormControl('')
        })
      ]),
      fsuOutgoingMessageSummary: new NgcFormArray([
        new NgcFormGroup({
          message: new NgcFormControl(''),
          messageType: new NgcFormControl(''),
          messageSentOn: new NgcFormControl('')
        })
      ]),
      fhlOutgoingMessageSummary: new NgcFormArray([
        new NgcFormGroup({
          message: new NgcFormControl(''),
          messageType: new NgcFormControl(''),
          messageSentOn: new NgcFormControl('')
        })
      ]),
      partShipmentDetails: new NgcFormArray([]),
      eWarehouseRemarks: new NgcFormArray([]),
      houseInfoDetails: new NgcFormArray([
        new NgcFormGroup({
          houseInfoTagNumber: new NgcFormControl(''),
          houseInfoRfidTagPieces: new NgcFormControl('')
        })
      ]),
    })
  });

  showFlag: boolean = false;
  mannualFrtFlag: boolean = false;
  showCancelButton: boolean = false;
  shipmentNumberparam: any;
  courierFlag: boolean = false;
  xpsFlag: boolean = false;
  importFlag: boolean = false;
  exportFlag: boolean = false;
  transhipmentFlag: boolean = false;
  searchResponse: any;
  processType: any;
  chargeableWeightFeature: boolean = false;
  courierInfo = [];
  fwbMessageInfo = [];
  fhlMessageInfo = [];
  fsuMessageInfo = [];
  awbRemarkList = [];
  hwbRemarkList = [];
  flightRemarkList = [];
  rfidInfo = [];
  serviceInfo = [];
  throughTransitFlag: boolean = false;
  consolFlag: boolean = false;
  eawbFlag: boolean = false;
  partShipmentFlag: boolean = false;
  pouchReceivedFlag: boolean = false;
  fwbeFlag: boolean = false;
  fwbmFlag: boolean = false;
  fhleFlag: boolean = false;
  fhlmFlag: boolean = false;
  fsuFlag: boolean = false;
  canReUseFlag: boolean = false;
  abondanedCargoFlag: boolean = false;
  houseInfoShipmentCount: any;
  documentReceivedFlag1: boolean = false;
  shipmentId: any;
  billingServiceRes = [];
  totalSumFlag: boolean = false;
  reportParameters: any;
  cancelShipmentFlag: boolean = true;
  flightDetails: boolean = false;
  flightDetailsOptional: boolean = false;
  deliveryDetials: boolean = false;
  flightLable: boolean = false;
  inactiveShipmentData: SearchInactiveCargo = new SearchInactiveCargo();
  excemptionCodeFlag: boolean;
  permitNumberFlag: boolean;
  permitToFollowFlag: boolean;
  larInfoForImport: boolean = false;
  showBankEndorsement = true
  appointedAgent = false;
  expireAppointedAgent = true;
  appointedAgentValue: any
  segmentId: any;
  isReadOnly = false
  isIA = true;
  freightOutrequest: any
  type: any;
  clearingAgentParam: any;
  shipmentDateLen: boolean = false;
  handlingFlag: boolean = false;

  ngOnInit() {
    super.ngOnInit();
    this.shipmentDateLen = false;
    this.valCheck = false;
    this.shipmentInfoForm.get('searchFormGroup').get('shipmentNumber').valueChanges
      .subscribe(a => {
        if (a) {
          this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).reset();
          this.getShipmentDates();
        }
      });
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    this.dataToNavigateBack = this.forwardedData;
    if (this.forwardedData == null) {
      const data: any = this.retrievePageState("ShipmentInformation");
      if (data && data.searchFormGroup) {
        this.forwardedData = data.searchFormGroup;
      }
      this.savePageState('ShipmentInformation', {});
    }
    if (this.forwardedData.screenName === "AcceptanceWeighing") {
      this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).patchValue(this.forwardedData.shipmentNumber);
      this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).patchValue(this.forwardedData.hwbNumber);
      this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).patchValue(this.forwardedData.shipmentType);
      this.onSearch();
    }

    if (this.forwardedData && this.forwardedData.shipmentNumber) {
      this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).patchValue(this.forwardedData.shipmentNumber);
      this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).patchValue(this.forwardedData.hwbNumber);
      if (this.forwardedData.shipmentType) {
        this.shipmentType1 = this.forwardedData.shipmentType;
      } else {
        this.shipmentType1 = "AWB"
      }

      this.async(() => {
        this.onSearch();
      }, 1000);
    }

    this.shipmentInfoForm.get(['freightOutremarks', 'type']).setValue('IA');
    this.permitToFollowFlag = true;
    this.shipmentInfoForm.get(['freightOutremarks', 'type']).valueChanges.subscribe(
      (newValue) => {
        if (newValue) {
          if (newValue === 'EC') {
            this.shipmentInfoForm.get(['freightOutremarks', 'localAuthorityDetail']).patchValue([{
              referenceNumber: null,
              license: null,
              remarks: null,
            }]);
            this.permitNumberFlag = false;
            this.excemptionCodeFlag = true;
            this.permitToFollowFlag = false;
          }
          if (newValue === 'PN') {
            this.shipmentInfoForm.get(['freightOutremarks', 'localAuthorityDetail']).patchValue([{
              referenceNumber: null,
              license: null,
              remarks: null,
            }]);
            this.permitNumberFlag = true;
            this.excemptionCodeFlag = false;
            this.permitToFollowFlag = false;
          }
          if (newValue === 'IA') {
            this.shipmentInfoForm.get(['freightOutremarks', 'localAuthorityDetail']).patchValue([{
              referenceNumber: null,
              customerAppAgentId: null,
              license: null,
              remarks: null,
            }]);
            this.permitNumberFlag = false;
            this.permitToFollowFlag = true;
            this.excemptionCodeFlag = false;
          }
        }
      }
    );


  }
  getShapeColor(code, attribute) {
    const codeColorData = this.colorMapping[code];
    return codeColorData ? codeColorData[attribute] : this.colorMapping["D"][attribute];
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.showMe = true;
  }


  autoSearchShipmentInfo($event) {
    this.onSearch();
  }

  onSearch() {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_ChargeableWeight)) {
      this.chargeableWeightFeature = true;
    }
    this.bookingInfoTitle = 'title.booking.info';
    this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'chargeAdvice']).patchValue(new Array());
    this.showFlag = false;
    this.xpsFlag = false;
    this.courierFlag = false;
    this.documentReceivedFlag1 = false;
    this.totalFlightPieces = 0;
    this.totalFlightWeight = 0;
    this.totalBookingPieces = 0;
    this.totalBookingWeight = 0;
    this.totalLoadedPieces = 0;
    this.totalLoadedWeight = 0;
    this.totalPartPieces = 0;
    this.totalPartWeight = 0;
    this.totalFrtPieces = 0;
    this.totalFrtWeight = 0;
    this.totalDeliveryPieces = 0;
    this.totalDeliveryWeight = 0;
    this.totalChgWeight = 0;

    const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.shipmentInfoForm.get('searchFormGroup'));
    searchFormGroup.validate();
    if (this.shipmentInfoForm.get('searchFormGroup').invalid) {
      return;
    }
    if (this.hawbInvalid) {
      this.showErrorStatus('hawb.invalid');
      return;
    }
    const req: ShipmentInfoReqModel = new ShipmentInfoReqModel();
    req.flagCRUD = 'R';
    req.shipmentNumber = searchFormGroup.get('shipmentNumber').value;
    req.shipmentDate = searchFormGroup.get('shipmentDate').value;
    req.hwbNumber = searchFormGroup.get('hwbNumber').value;
    req.shipmentHouseId = searchFormGroup.get('shipmentHouseId').value;

    if (searchFormGroup.get('shipmentType').value != "") {
      req.shipmentType = searchFormGroup.get('shipmentType').value;
    } else {
      req.shipmentType = this.shipmentType1;
    }


    this.awbManagementService.gethouseInfo(req).subscribe(response => {
      this.responseArray = response.data;

      if (response.data == null) {
        this.showFlag = false;
        this.showCancelButton = false;
        if (this.stausForCancel == 'Yes') {
          this.shipmentInfoForm.get(['searchFormGroup', 'cancelShipmentRmrk']).patchValue(this.searchResponse.cancelShipmentRmrk);
        } else {
          this.showErrorStatus(response.messageList[0].code);
        }

      } else {
        this.stausForCancel = 'No'
        this.Shipmentdateofreport = response.data.shipmentDate;
        this.totalSumFlag = false;
        this.showFlag = true;
        this.refreshFormMessages(response);
        this.searchResponse = response.data;
        if (this.searchResponse) {
          if (this.searchResponse.process == 'IMPORT' || this.searchResponse.process == 'EXPORT') {
            if (this.searchResponse.cancelledOn) {
              this.showCancelButton = true;
              this.showFlag = false;
              this.shipmentInfoForm.get(['searchFormGroup', 'cancelShipmentRmrk']).patchValue(this.searchResponse.cancelShipmentRmrk);
              this.shipmentInfoForm.get(['searchFormGroup', 'cancelledOn']).patchValue(this.searchResponse.cancelledOn);
            } else {
              this.showFlag = true;
              this.showCancelButton = false;
            }
          }

        }

        if (this.searchResponse) {
          this.shipmentId = this.searchResponse.shipmentId;
          this.processType = this.searchResponse.process;
          this.shipmentInfoForm.get('shipmentInfoFormGroup').patchValue(this.searchResponse);
          this.shipmentInfoForm.get('shipmentInfoFormGroup').get('houseOrigin').patchValue(this.searchResponse.houseOrigin + '/' + this.searchResponse.houseDestination);
          this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'shipmentNumber']).patchValue(req.shipmentNumber);

          if (this.searchResponse.consol == null) {
            this.consolFlag = true;
          } else {
            this.consolFlag = false;
          }

          if (this.searchResponse.consol == false) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'consol']).patchValue('N');

          }
          if (this.searchResponse.consol == true) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'consol']).patchValue('Y');
          }

          if (this.searchResponse.partShipment == null) {
            this.partShipmentFlag = true;
          } else {
            this.partShipmentFlag = false;
          }

          if (this.searchResponse.partShipment == false) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'partShipment']).patchValue('N');
          }
          if (this.searchResponse.partShipment == true) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'partShipment']).patchValue('Y');
          }

          if (this.searchResponse.svc == false) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'svc']).patchValue('N');
          }
          if (this.searchResponse.svc == true) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'svc']).patchValue('Y');
          }

          if (this.searchResponse.eawb == null) {
            this.eawbFlag = true;
          } else {
            this.eawbFlag = false;
          }

          if (this.searchResponse.eawb == false) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'eawb']).patchValue('N');
          }
          if (this.searchResponse.eawb == true) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'eawb']).patchValue('Y');
          }

          if (this.searchResponse.pouchReceived == null) {
            this.pouchReceivedFlag = true;
          } else {
            this.pouchReceivedFlag = false;
          }

          if (this.searchResponse.pouchReceived == false) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'pouchReceived']).patchValue('N');
          }
          if (this.searchResponse.pouchReceived == true) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'pouchReceived']).patchValue('Y');
          }

          if (this.searchResponse.fwbe == null) {
            this.fwbeFlag = true;
          } else {
            this.fwbeFlag = false;
          }

          if (this.searchResponse.fwbm == true) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fwb']).patchValue('M');
          }

          if (this.searchResponse.fwbe == true) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fwb']).patchValue('E');
          }

          if (this.searchResponse.fwbe == false && this.searchResponse.fwbm == false) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fwb']).patchValue('N');
          }

          if (this.searchResponse.fwbm == null) {
            this.fwbmFlag = true;
          } else {
            this.fwbmFlag = false;
          }

          if (this.searchResponse.fhle == null) {
            this.fhleFlag = true;
          } else {
            this.fhleFlag = false;
          }

          if (this.searchResponse.fhlm == true) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fhl']).patchValue('M');
          }

          if (this.searchResponse.fhle == true) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fhl']).patchValue('E');
          }

          if (this.searchResponse.fhlm == false && this.searchResponse.fhle == false) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fhl']).patchValue('N');
          }

          if (this.searchResponse.fhlm == null) {
            this.fhlmFlag = true;
          } else {
            this.fhlmFlag = false;
          }
          if (this.searchResponse.fsu == null) {
            this.fsuFlag = true;
          } else {
            this.fsuFlag = false;
          }

          if (this.searchResponse.fsu == false) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fsu']).patchValue('N');
          }
          if (this.searchResponse.fsu == true) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fsu']).patchValue('Y');
          }

          if (this.searchResponse.canReUse == null) {
            this.canReUseFlag = true;
          } else {
            this.canReUseFlag = false;
          }


          if (this.searchResponse.canReUse == false) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'canReUse']).patchValue('N');
          }
          if (this.searchResponse.canReUse == true) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'canReUse']).patchValue('Y');
          }

          if (this.searchResponse.abondanedCargo == null) {
            this.abondanedCargoFlag = true;
          } else {
            this.abondanedCargoFlag = false;
          }

          if (this.searchResponse.abondanedCargo == false) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'abondanedCargo']).patchValue('N');
          }
          if (this.searchResponse.abondanedCargo == true) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'abondanedCargo']).patchValue('Y');
          }

          if (this.searchResponse.origin && this.searchResponse.destination) {
            var originDestination = this.searchResponse.origin + '/' + this.searchResponse.destination;
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'origin']).patchValue(originDestination);
          }


          if (this.searchResponse.incomingFlightDetails) {
            this.totalFlightPieces = 0;
            this.totalFlightWeight = 0;
            this.totalChgWeight = 0;
            if (this.searchResponse.incomingFlightDetails.length > 0) {
              this.searchResponse.incomingFlightDetails.forEach((flightData, index) => {

                if (flightData.documentReceivedFlag != null)
                  this.isCnBillingCall = true;
                this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'incomingFlightDetails', index]).patchValue(flightData);

                if (flightData.flightDetailsSta) {
                  var fTime = flightData.flightDetailsSta;
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'incomingFlightDetails', index, 'flightDetailsStaTime']).patchValue(fTime);
                }

                if (flightData.documentReceivedFlag == null) {
                  this.documentReceivedFlag1 = false;
                  //Set the default value to false if null
                  flightData.documentReceivedFlag = false;
                } else {
                  this.documentReceivedFlag1 = true;
                }

                if (flightData.photoCopyAwbFlag == null) {
                  flightData.photoCopyAwbFlag = false;
                } else {
                  flightData.photoCopyAwbFlag = true;
                }
                if (flightData.inventoryDetails != null && flightData.inventoryDetails.length > 0) {
                  flightData.inventoryDetails.forEach((invData, index) => {
                    this.totalFlightPieces = this.totalFlightPieces + invData.inventoryPieces;
                    this.totalFlightWeight = this.totalFlightWeight + invData.inventoryWeight;
                    this.totalChgWeight = this.totalChgWeight + invData.inventoryChgWeight;

                  })
                }

                if (flightData.documentReceivedFlag == false && flightData.photoCopyAwbFlag == false) {
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'incomingFlightDetails', index, 'documentReceivedFlag']).patchValue('N');
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'incomingFlightDetails', index, 'photoCopyAwbFlag']).patchValue('');
                }

                if (flightData.documentReceivedFlag == true && flightData.photoCopyAwbFlag == false) {
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'incomingFlightDetails', index, 'documentReceivedFlag']).patchValue('Y');
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'incomingFlightDetails', index, 'photoCopyAwbFlag']).patchValue(' ORIGINAL');
                }

                if (flightData.documentReceivedFlag == false && flightData.photoCopyAwbFlag == true) {
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'incomingFlightDetails', index, 'documentReceivedFlag']).patchValue('Y');
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'incomingFlightDetails', index, 'photoCopyAwbFlag']).patchValue(' COPY AWB');
                }

                if (flightData.documentReceivedFlag == true && flightData.photoCopyAwbFlag == true) {
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'incomingFlightDetails', index, 'documentReceivedFlag']).patchValue('Y');
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'incomingFlightDetails', index, 'photoCopyAwbFlag']).patchValue(' ORIGINAL');
                }
                this.throughTransitFlag = flightData.throughTransitFlag;
                if (flightData.inventoryDetails == null) {
                  this.mannualFrtFlag = true;
                } else {
                  this.mannualFrtFlag = false;
                }
                if (flightData.shipmentFlightCustomsInfo.oc == null &&
                  NgcUtility.isEntityAttributeRequired(ApplicationEntities.Import_CustomsClearanceRequiredForDelivery)) {
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'incomingFlightDetails', index, 'readyForDelivery']).patchValue('0');
                }
              });
            }
          }

          if (this.searchResponse.outbooundFlightDetails) {
            this.totalBookingPieces = 0;
            this.totalBookingWeight = 0;
            if (this.searchResponse.outbooundFlightDetails.length > 0) {
              this.searchResponse.outbooundFlightDetails.forEach((flightData1, index) => {
                this.totalBookingPieces = parseInt(this.totalBookingPieces) + parseInt(flightData1.bookingPieces);
                this.totalBookingWeight = parseFloat(this.totalBookingWeight.toFixed(1)) + parseFloat(flightData1.bookingWeight.toFixed(1));
                if (flightData1.loadingInfoModel) {
                  flightData1.loadingInfoModel.forEach((loadedInfo, index1) => {
                    this.totalLoadedPieces = parseInt(this.totalLoadedPieces) + parseInt(loadedInfo.loadedPieces);
                    this.totalLoadedWeight = parseFloat(this.totalLoadedWeight.toFixed(1)) + parseFloat(loadedInfo.loadedWeight.toFixed(1));
                  })
                }
              })
            }
          }

          if (this.searchResponse.freightOutDetails) {
            this.totalFrtPieces = 0;
            this.totalFrtWeight = 0;
            if (this.searchResponse.freightOutDetails.length > 0) {
              this.searchResponse.freightOutDetails.forEach((flightData2, index) => {
                this.totalFrtPieces = this.totalFrtPieces + flightData2.freightOutPieces;
                this.totalFrtWeight = this.totalFrtWeight + flightData2.freightOutWeight;
              })
            }
          }

          if (this.searchResponse.houseInfoDetails) {
            this.courierInfo = [];
            this.rfidInfo = [];
            this.searchResponse.houseInfoDetails.forEach(tagInfo => {
              if (tagInfo.houseInfoShipmentType == 'COU') {
                var carrierHouseInfoObj = {
                  houseInfoTagNumber: tagInfo.houseInfoTagNumber,
                  houseInfoRfidTagPieces: tagInfo.houseInfoRfidTagPieces
                };
                this.courierInfo.push(carrierHouseInfoObj);
              }
              if (tagInfo.houseInfoShipmentType == 'XPS') {
                var rfidHouseInfoObj = {
                  houseInfoTagNumber: tagInfo.houseInfoTagNumber,
                  houseInfoRfidTagPieces: tagInfo.houseInfoRfidTagPieces
                };
                this.rfidInfo.push(rfidHouseInfoObj);
              }
            });
          }

          if (this.searchResponse.acceptanceDetails) {
            if (this.searchResponse.acceptanceDetails.length > 0) {
              this.searchResponse.acceptanceDetails.forEach((acceptanceData, index) => {
                var acceptancePieceWeight;
                acceptancePieceWeight = acceptanceData.acceptedPiece + '/' + acceptanceData.acceptedWeight;
                if (acceptanceData.inventoryDetails == null) {
                  this.mannualFrtFlag = true;
                }

                if (acceptanceData.readyForLoad == '1')
                  this.isCnBillingCall = true;
              });
            }
          } else {
            this.mannualFrtFlag = false;
          }

          if (this.searchResponse.houseSummaryDetails) {
            if (this.searchResponse.houseSummaryDetails.length > 0) {
              this.searchResponse.houseSummaryDetails.forEach((houseInfoType, houseInfoCount) => {
                if (houseInfoType.houseInfoShipmentType == 'Courier Tag') {
                  this.courierFlag = true;
                  this.xpsFlag = false;
                  this.houseInfoShipmentCount = houseInfoType.houseInfoCount;
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'courierTag']).patchValue(this.houseInfoShipmentCount);
                }
                if (houseInfoType.houseInfoShipmentType == 'XPS Tag') {
                  this.courierFlag = false;
                  this.xpsFlag = true;
                  this.houseInfoShipmentCount = houseInfoType.houseInfoCount;
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'rfidTag']).patchValue(this.houseInfoShipmentCount);
                }
              });
            }
          }
          if (this.searchResponse.shipmentDeliveryDetails) {
            if (this.searchResponse.shipmentDeliveryDetails.length > 0) {
              this.cancelShipmentFlag = true;
            } else {
              this.cancelShipmentFlag = false;
            }
          }

          if (this.searchResponse.shipmentDeliveryDetails) {
            this.totalDeliveryPieces = 0;
            this.totalDeliveryWeight = 0;
            if (this.searchResponse.shipmentDeliveryDetails.length > 0) {
              this.searchResponse.shipmentDeliveryDetails.forEach((flightData2, index) => {
                this.totalDeliveryPieces = this.totalDeliveryPieces + flightData2.deliveryPieces;
                this.totalDeliveryWeight = this.totalDeliveryWeight + flightData2.deliveryWeight;
              })
            }
          }

          if (this.searchResponse.remarks) {
            this.awbRemarkList = [];
            if (this.searchResponse.remarks.length > 0) {
              this.searchResponse.remarks.forEach(awbRmk => {
                var remarkListObj = {
                  shipmentRemarks: awbRmk.shipmentRemarks
                };
                this.awbRemarkList.push(remarkListObj);
              });
            }
          }
          if (this.searchResponse.houseRemarks) {
            this.hwbRemarkList = [];
            if (this.searchResponse.houseRemarks.length > 0) {
              this.searchResponse.houseRemarks.forEach(awbRmk => {
                var remarkListObj = {
                  shipmentRemarks: awbRmk.shipmentRemarks
                };
                this.hwbRemarkList.push(remarkListObj);
              });
            }
          }

          if (this.searchResponse.awbOnHold) {
            this.cancelShipmentFlag = true;
          } else {
            this.cancelShipmentFlag = false;
          }

          if (this.searchResponse.tmDetails) {
            if (this.searchResponse.tmDetails.length > 0) {
              this.searchResponse.tmDetails.forEach((tmData, index) => {
                if (tmData.finalized) {
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'tmDetails', index, 'finalized']).patchValue('Y');
                } else {
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'tmDetails', index, 'finalized']).patchValue('N');
                }
              });
            }
          }
          if (this.searchResponse.handlingChangeFlag) {
            this.handlingFlag = true;
          }
          else {
            this.handlingFlag = false;
          }
        }
      }

      let obj: any = new Object();
      obj.entityType = 'A';
      obj.shipmentNumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
      obj.houseNumber = this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).value;
      obj.flagCRUD = 'C';
      this.collectTotal = 0;
      this.allTotalsCharge = 0;
      let that = this;
      let sum: number = 0;
      let billingReq: any = new Object();
      billingReq.shipment = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
      billingReq.shipmentType = 'Shipment Number';
      billingReq.hawbNumber = this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).value;
      billingReq.shipmentHouseId = this.searchResponse.shipmentHouseId;

      this.collectPaymentService.enquireCharges(billingReq).subscribe(billingRes => {
        this.chargeResponse = new Array();
        if (billingRes && billingRes.data) {
          this.billingServiceRes = billingRes.data;
          if (this.billingServiceRes.length) {
            this.totalSumFlag = true;
            this.allTotalsCharge = 0;
            this.paidTotalCharge = 0;
            this.collectTotal = 0;
            this.billingServiceRes.forEach(advice => {
              advice.chargeAdvice.forEach(element => {

                this.chargeResponse.push(element);

                if (element.receiptNumber && element.receiptNumber.length) {
                  element.receiptNumber = element.receiptNumber.toString();
                }

                if (element.paymentType == 'Collect') {
                  this.collectTotal += element.amount;

                  if (element.waivedAmount) {
                    this.collectTotal -= element.waivedAmount;
                  }

                  if (element.paid) {
                    this.collectTotal -= element.paid;
                  }

                  element.paidAmount = element.paid;
                  this.paidTotalCharge = this.paidTotalCharge + element.paid;

                  if (element.paymentStatus == 'Paid') {
                    element.paid = "Y"
                  } else {
                    element.paid = "N"
                  }
                } else {
                  element.paid = '';
                }

                this.allTotalsCharge = this.allTotalsCharge + element.amount;

                if (element.paymentStatus == 'Paid') {
                  this.cancelShipmentFlag = true;
                  this.cancelShipmentReason = NgcUtility.translateMessage('awb.si.cancel.reason.paid', null);
                  return;
                }
              });
            });
          } else {
            this.totalSumFlag = false;
          }
          if (this.billingServiceRes.length) {
            console.log(this.chargeResponse)
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'chargeAdvice']).patchValue(this.chargeResponse);
          }
        }
      })
    })
  }

  savePageValue() {
    this.savePageState("ShipmentInformation", this.shipmentInfoForm.getRawValue());
  }

  closePopUp() {
    this.cancelShpPopUp.close();
  }


  getShipmentDates() {
    this.shipmentNumberparam = this.createSourceParameter(this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value);
    this.showCancelButton = false;
    this.retrieveDropDownListRecords('SHIPMENTDATE', 'query', this.shipmentNumberparam)
      .subscribe(value => {
        if (value.length == 1) {
          this.shipmentDateLen = false;
        } else {
          this.shipmentDateLen = true;
        }
      })
  }

  openCorierTagPopUp() {
    this.courierTagPopUp.open();
  }

  openFWBMsgPopUp() {
    this.fwbMsgPopUp.open();
  }

  openFSUMsgPopUp() {
    this.fsuMsgPopUp.open();
  }

  openFHLMsgPopUp() {
    this.fhlMsgPopUp.open();
  }

  private onShipmentSelect(event) {
    if (event.shipmentType) {
      this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).patchValue(event.shipmentType);
    }
    this.handledbyHouse = false;
    this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).patchValue("");
    this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).clearValidators();
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.hawbSourceParameters = this.createSourceParameter(event.shipmentNo);
      this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
        if (data != null && data.length > 0) {
          this.handledbyHouse = true;
          this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).setValidators([Validators.required, Validators.maxLength(16)]);
          this.retrieveLOVRecords("HWBNUMBER", this.hawbSourceParameters).subscribe(data => {
            if (data != null && data.length == 1) {
              this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).setValue(data[0].code);
            }

          })

        } else {
          this.handledbyHouse = false;
          this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).clearValidators();
        }
      },
      );
    }
  }

  onselectEmailid(event) {
    this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'emailTo']).setValue(event.desc);
  }

  openRfidTagPopUp() {
    this.rfidTagPopUp.open();
  }

  openInfoPopUp() {
    this.infoPopUp.open();
  }




  openAwbDocumentPage() {
    this.savePageValue();
    var dataToSend = null;
    if (this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value) {
      dataToSend = {
        shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
        shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,
        hwbNumber: this.shipmentInfoForm.get('searchFormGroup').get('hwbNumber').value
      }
    } else {
      dataToSend = {
        shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
        shipmentType: this.shipmentType1,
        hwbNumber: this.shipmentInfoForm.get('searchFormGroup').get('hwbNumber').value
      }
    }
    this.navigateTo(this.router, 'awbmgmt/awbdocument', dataToSend);
  }

  openCheckListPage() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
    }
    this.navigateTo(this.router, 'export/checklist/setupcheckliststatus', dataToSend);
  }

  openBillingPage() {
    this.savePageValue();
    var dataToSend = {
      shipment: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
    }
    this.navigateTo(this.router, '/billing/collectPayment/enquireCharges', dataToSend);
  }

  openHistoryPage() {
    this.savePageValue();
    var fromDate1;
    fromDate1 = this.Shipmentdateofreport;
    var dataToSend = {
      entityValue: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      fromDate: fromDate1,
      toDate: new Date(),
      entityType: 'AWB'
    }
    this.navigateTo(this.router, '/audit/audittrail', dataToSend);
  }
  openTracingPage() {
    this.savePageValue();
    var dataToSend = {
      recordData: {
        shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
        shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
      }
    }
    this.navigateTo(this.router, 'tracing/tracingdisplay', dataToSend);
  }

  openInactiveOldCargo() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
    }
    this.navigateTo(this.router, 'awbmgmt/inactivecargolist', dataToSend);
  }





  openMaintainsspdPage() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
    }
    this.navigateTo(this.router, 'export/maintainsspd', dataToSend);
  }

  openAddServicePage() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
    }
    this.navigateTo(this.router, 'billing/createServiceRequest', dataToSend);
  }

  openBillingServicePage() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
    }
    this.navigateTo(this.router, 'billing/listServiceRequest', dataToSend);
  }



  openSurveyPage() {
    this.savePageValue();
    var dataToSend = {
      referenceNo: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
    }
    this.navigateTo(this.router, 'tracing/surveydetailscomponent', dataToSend);
  }

  openAWBReleasePage() {
    this.savePageValue();
    var agentDetails = this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'agent']).value;
    var agentCode = null;
    if (agentDetails != null) {
      let code = agentDetails.split('-');
      agentCode = code[0];
    }
    var dataToSend = [{
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      agent: agentCode
    }]
    this.navigateTo(this.router, 'import/awbreleaseform', dataToSend);
  }


  onereceipt() {
    this.freightOutrequest = this.shipmentInfoForm.getRawValue();
    this.reportParameters = new Object();
    this.reportParameters.shipmentnumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
    this.reportParameters.shipmentdate = this.Shipmentdateofreport;
    this.reportParameters.remarktype = 'AGT'
    this.reportWindow2.open();
  }

  onweighingslipServiceReport() {
    this.reportParameters = new Object();
    this.reportParameters.shipmentNumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
    this.reportParameters.houseNumber = this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).value;
    this.reportParameters.loginUser = this.getUserProfile().userShortName;
    this.reportParameters.documentInformationId = this.searchResponse.acceptanceDetails[0].documentInformationId;
    this.reportParameters.shipmentId = this.searchResponse.shipmentId;
    this.reportWindow1.open();

  }

  openMaintainsFwb() {
    this.savePageValue();
    var dataToSend = {
      awbNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      hwbNumber: this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).value
    }
    this.navigateTo(this.router, 'import/maintainfwb', dataToSend);
  }

  onHwbWeightSlip(index) {
    const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.shipmentInfoForm.get('searchFormGroup'));
    this.reportParameters = new Object();
    this.reportParameters.shipmentId = this.searchResponse.shipmentId;
    this.reportParameters.shipmentNumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
    this.reportParameters.houseNumber = this.shipmentInfoForm.get('searchFormGroup').get('hwbNumber').value;
    this.reportParameters.documentInformationId = this.searchResponse.acceptanceDetails[0].documentInformationId;
    this.reportParameters.loginUser = this.getUserProfile().userShortName;
    this.reportWindowHwbWeightSlip.open();
  }

  onTotalWeightPrint() {
    const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.shipmentInfoForm.get('searchFormGroup'));
    this.reportParameters = new Object();
    this.reportParameters.loginUser = this.getUserProfile().userShortName;
    this.reportParameters.shipmentId = this.searchResponse.shipmentId;
    this.reportParameters.shipmentNumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
    this.reportParameters.documentInformationId = this.searchResponse.acceptanceDetails[0].documentInformationId;
    if (searchFormGroup.get('shipmentHouseId').value) {
      this.reportParameters.houseNumber = searchFormGroup.get('shipmentHouseId').value;
    } else {
      this.reportParameters.houseNumber = null;
    }
    this.reportWindowHwbTotalWeightSlip.open();
  }

  openDgEntry() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
    }
    this.navigateTo(this.router, 'export/dangerousgoods/dgdradioactive', dataToSend);
  }

  openPartShipmentpage() {
    if (this.searchResponse.partShipmentDetails && this.searchResponse.partShipmentDetails.length > 0) {
      this.partShpFlag = true;
      this.partShpPopUp.open();
    } else {
      this.partShpFlag = false;
      this.partShpPopUp.close();
      this.showInfoStatus("awb.no.part.found")
    }
  }

  freightOutCargo() {
    this.tramDetails = false;
    this.valCheck = false;
    if (this.mannualFrtFlag == true) {
      this.showErrorStatus("awb.no.inventory.found");
    } else {
      this.shipmentInfoForm.get('freightOutremarks.trmNumber').reset();
      this.shipmentInfoForm.get('freightOutremarks.trmDate').reset();
      this.shipmentInfoForm.get('freightOutremarks.localAuthorityDetail').reset();
      this.shipmentInfoForm.get('freightOutremarks.remarks').reset();
      this.shipmentInfoForm.get('freightOutremarks.flightNumber').reset();
      this.shipmentInfoForm.get('freightOutremarks.flightDate').reset();
      this.shipmentInfoForm.get('freightOutremarks.doNumber').reset();
      let shipmentData = [];
      let origin = [];
      let destination = [];
      let data = this.searchResponse;
      let shipment: ShipmentData = new ShipmentData();
      shipment.shipmentId = data.shipmentId;
      shipment.origin = data.origin;
      shipment.destination = data.destination;
      shipment.awbNumber = data.shipmentNumber;
      shipment.shipmentDate = data.shipmentDate;
      shipment.shipmentType = data.shipmentType;
      shipment.pieces = data.awbPiece;
      shipment.weight = data.awbWeight;
      if (data.agent != null) {
        let agentCode = data.agent.split('-');
        shipment.agent = agentCode[0];
      } else if (data.agent == null && (data.origin != this.getUserProfile().tenantConfiguration.airportCode && data.destination != this.getUserProfile().tenantConfiguration.airportCode)) {
        shipment.agent = "";
      } else {
        this.showErrorMessage("awb.no.app.agent");
        return;
      }
      shipmentData.push(shipment);
      //Import Case
      if (data.incomingFlightDetails != null && data.incomingFlightDetails.length > 0) {
        let details = [];
        data.incomingFlightDetails.forEach((flightData, index) => {
          flightData.inventoryDetails.forEach(element => {
            if (details.length > 0 && element.shipmentInventory_Id) {
              details.splice(details.length + 1, 0, element);
            } else if (element.shipmentInventory_Id) {
              details.push(element);
            }
            if (element.shcs != null && element.shcs.match('VAL') && element.deliveryRequestInfo != null) {
              this.valCheck = true;
              this.larInfoForImport = false;
            } else {
              this.valCheck = false;
              this.shipmentInfoForm.get('freightOutremarks.doNumber').setValidators([Validators.maxLength(8), Validators.required]);
            }
          });
        });
        this.shipmentInfoForm.get('freightOutremarks.inventoryDetails').patchValue(details);
      }
      //Export Case
      if (data.acceptanceDetails != null && data.acceptanceDetails.length > 0) {
        let details = [];
        data.acceptanceDetails.forEach(element => {
          element.inventoryDetails.forEach(element => {
            if (details.length > 0 && element.shipmentInventory_Id) {
              details.splice(details.length + 1, 0, element);
            } else if (element.shipmentInventory_Id) {
              details.push(element);
            }
          });
        });
        this.shipmentInfoForm.get('freightOutremarks.inventoryDetails').patchValue(details);
      }

      if (data.process == 'IMPORT') {
        this.shipmentInfoForm.get('freightOutremarks.remarkType').setValue('DLV');
      }
      if (data.process == 'EXPORT') {
        shipment.natureOfGoodsDescription = data.natureOfGoods;
        shipment.totalPieces = data.awbPiece;
        shipment.totalWeight = data.awbWeight;
        this.shipmentInfoForm.get('freightOutremarks.flightNumber').setValidators(([Validators.required]));
        this.shipmentInfoForm.get('freightOutremarks.flightDate').setValidators(([Validators.required]));
        this.shipmentInfoForm.get('freightOutremarks.remarkType').setValue('DEP');
      }
      if (data.process == 'TRANSHIPMENT') {
        this.searchResponse.incomingFlightDetails.forEach(element => {
          this.shipmentInfoForm.get('freightOutremarks.flightNumber').clearValidators();
          this.shipmentInfoForm.get('freightOutremarks.flightDate').clearValidators();
          this.shipmentInfoForm.get('freightOutremarks.remarkType').setValue('DEP');
        });
      }
      this.inactiveShipmentData.shipmentData = shipmentData;
      this.manualFreightOut.open();
    }

  }

  manualFreigtOut() {
    let first = '';
    let second;
    this.resetFormMessages();
    let data = this.shipmentInfoForm.get('freightOutremarks').value;
    if (this.shipmentInfoForm.get('freightOutremarks.remarks').value != null) {
      this.inactiveShipmentData.remarks = this.shipmentInfoForm.get('freightOutremarks.remarks').value;

      const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.shipmentInfoForm.get('searchFormGroup'));
      this.inactiveShipmentData.shipmentNumber = searchFormGroup.get('shipmentNumber').value;
      this.inactiveShipmentData.hawbNumber = searchFormGroup.get('hwbNumber').value;
      this.inactiveShipmentData.isHandledByHouse = true;
      this.inactiveShipmentData.remarkType = this.shipmentInfoForm.get('freightOutremarks.remarkType').value;
      this.inactiveShipmentData.deliveryOrderNo = this.shipmentInfoForm.get('freightOutremarks.doNumber').value;
      this.inactiveShipmentData.flightkey = this.shipmentInfoForm.get('freightOutremarks.flightNumber').value;
      this.inactiveShipmentData.flightDate = this.shipmentInfoForm.get('freightOutremarks.flightDate').value;
      this.inactiveShipmentData.shipmentType = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;
      this.inactiveShipmentData.trmNumber = this.shipmentInfoForm.get('freightOutremarks.trmNumber').value;
      this.inactiveShipmentData.trmDate = this.shipmentInfoForm.get('freightOutremarks.trmDate').value;
      this.inactiveShipmentData.type = data.type;
      this.inactiveShipmentData.inventoryId = [];
      let valDoNumbers = Array();
      let doNumber = null;
      data.inventoryDetails.forEach(element => {
        if (element.select) {
          this.inactiveShipmentData.inventoryId.push(element.shipmentInventory_Id);
          if (doNumber == null && element.deliveryRequestInfo != null) {
            valDoNumbers.push(element.deliveryRequestInfo);
            doNumber = element.deliveryRequestInfo;
          } else if (doNumber != element.deliveryRequestInfo) {
            valDoNumbers.push(element.deliveryRequestInfo);
          }
        }
      });
      if (valDoNumbers.length > 1) {
        this.showErrorMessage("error.choose.unique.do.number");
        return;
      }
      if (this.inactiveShipmentData.inventoryId.length != (<NgcFormArray>this.shipmentInfoForm.get(['freightOutremarks', 'inventoryDetails'])).length) {
        this.showErrorMessage("select.all.inventory");
        return;
      }
      //validate DoNumber
      if (this.deliveryDetials && !this.flightDetails) {
        if (this.inactiveShipmentData.deliveryOrderNo != null) {
          first = this.inactiveShipmentData.deliveryOrderNo.substring(0, 1);
          second = Number(this.inactiveShipmentData.deliveryOrderNo.substring(1, 7));
          if (this.validateDonumber(first, second) || this.inactiveShipmentData.deliveryOrderNo.length < 7) {
            this.showErrorMessage("awb.invalid.do.pattern");
            return;
          }
        } else {
          this.showErrorMessage("awb.enter.do.no")
        }
      }
      if ((this.flightDetails && !this.flightDetailsOptional) && (this.inactiveShipmentData.flightkey == null || this.inactiveShipmentData.flightDate == null || this.inactiveShipmentData.remarkType != 'DEP')) {
        if (this.inactiveShipmentData.remarkType != 'DEP') {
          this.showErrorMessage("awb.remark.type.dep");
          return;
        }
        this.showErrorMessage("export.enter.flight.details");
        return;
      }


      this.awbManagementService.moveToFreightOut(this.inactiveShipmentData).subscribe((res) => {
        this.refreshFormMessages(res);
        if (res.data == "sucess") {
          this.showSuccessStatus('awb.frtout.completed');
          this.onSearch();
          this.manualFreightOut.close();
        }
      },
        error => {
          this.showErrorStatus('Error:' + error);
        });

    } else {
      this.showErrorMessage('export.enter.all.mandatory.details');
    }
  }

  remarkSave() {
    let first = '';
    let second;
    this.resetFormMessages();
    let data = this.shipmentInfoForm.get('freightOutremarks').value;
    if (this.shipmentInfoForm.get('freightOutremarks.remarks').value != null) {
      this.inactiveShipmentData.remarks = this.shipmentInfoForm.get('freightOutremarks.remarks').value;
      this.inactiveShipmentData.remarkType = this.shipmentInfoForm.get('freightOutremarks.remarkType').value;
      this.inactiveShipmentData.deliveryOrderNo = this.shipmentInfoForm.get('freightOutremarks.doNumber').value;
      this.inactiveShipmentData.flightkey = this.shipmentInfoForm.get('freightOutremarks.flightNumber').value;
      this.inactiveShipmentData.flightDate = this.shipmentInfoForm.get('freightOutremarks.flightDate').value;
      this.inactiveShipmentData.shipmentType = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;
      this.inactiveShipmentData.trmNumber = this.shipmentInfoForm.get('freightOutremarks.trmNumber').value;
      this.inactiveShipmentData.trmDate = this.shipmentInfoForm.get('freightOutremarks.trmDate').value;
      this.inactiveShipmentData.shipmentNumber = this.shipmentInfoForm.get('shipmentNumber').value;
      this.inactiveShipmentData.type = data.type;
      data.localAuthorityDetail[0].customerAppAgentId = this.appointedAgentValue;
      this.inactiveShipmentData.localAuthorityDetail = data.localAuthorityDetail;
      if (this.deliveryDetials && !this.flightDetails) {
        if (this.inactiveShipmentData.deliveryOrderNo != null) {
          first = this.inactiveShipmentData.deliveryOrderNo.substring(0, 1);
          second = Number(this.inactiveShipmentData.deliveryOrderNo.substring(1, 7));
          if (this.validateDonumber(first, second) || this.inactiveShipmentData.deliveryOrderNo.length < 7) {
            this.showErrorMessage("awb.invalid.do.pattern");
            return;
          }
        } else {
          this.showErrorMessage("awb.enter.do.no")
        }
      }
      if ((this.flightDetails && !this.flightDetailsOptional) && (this.inactiveShipmentData.flightkey == null || this.inactiveShipmentData.flightDate == null || this.inactiveShipmentData.remarkType != 'DEP')) {
        if (this.inactiveShipmentData.remarkType != 'DEP') {
          this.showErrorMessage("awb.remark.type.dep");
          return;
        }
        this.showErrorMessage("CN46_02");
        return;
      }

      this.awbManagementService.moveToFreightOut(this.inactiveShipmentData).subscribe((res) => {
        this.refreshFormMessages(res);
        if (res.data == "sucess") {
          this.showSuccessStatus("status.Success");
          this.onSearch();
          this.remarksPopup.hide();
        }
      },
        error => {
          this.showErrorStatus('Error:' + error);
        });

    } else {
      this.showErrorMessage("CN46_04");
    }
  }

  private validateDonumber(first, second) {
    let flag = false;
    let patt1 = new RegExp("^[A-Z]");
    let patt2 = new RegExp("^[0-9]");
    if (!patt1.test(first) || !patt2.test(second)) {
      flag = true;
    }
    return flag;
  }

  onChangeIA(event) {
    this.freightOutrequest = this.shipmentInfoForm.getRawValue()
    this.type = this.freightOutrequest.freightOutremarks.type
    const requestData = {
      referenceNumber: event.controls.referenceNumber.value,
      type: this.type
    }
    if (event.controls.referenceNumber.value != null) {
      this.awbManagementService.validateDOIANumber(requestData).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          const resp = response.data
          if (resp) {
            this.appointedAgent = true;
            this.expireAppointedAgent = false;
          }
          if (resp == null) {
            this.showConfirmMessage('confirm.11'
            ).then(fulfilled => {


            }

            ).catch(reason => {

            });
            this.appointedAgent = true;
            this.expireAppointedAgent = false;
            this.shipmentInfoForm.controls.freightOutremarks.get(['localAuthorityDetail', 0, 'customerAppAgentId']).patchValue('');
          }
          if (resp != null) {
            this.shipmentInfoForm.controls.freightOutremarks.get(['localAuthorityDetail', 0, 'customerAppAgentId']).patchValue(resp.appointedAgentCode);
            this.appointedAgentValue = resp.id;
          }

        }

      })
    }
  }

  onSelectClearingAgent(event, index) {
    this.clearingAgentParam = event.param1;
  }

  onAddPermitNumber(index) {
    (<NgcFormArray>this.shipmentInfoForm.get('freightOutremarks.localAuthorityDetail')).addValue([
      {
        referenceNumber: ''
      }
    ]);
  }

  onDeletePermitNumberRows(index) {
    (<NgcFormArray>this.shipmentInfoForm.get('freightOutremarks.localAuthorityDetail')).deleteValueAt(index);
  }


  onPrint() {

    if (this.searchResponse.process == 'EXPORT') {
      this.reportParameters = new Object();
      this.reportParameters.shipmentNumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
      this.reportParameters.shipmentdate = this.Shipmentdateofreport;
      this.reportParameters.awbtype = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;
      if (this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == null || this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == "") {
        this.reportParameters.awbtype = "AWB";
      } else {
        this.reportParameters.awbtype = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;
      }
      this.reportParameters.tenantAirportCode = this.getUserProfile().tenantConfiguration.airportCode;
      this.reportParameters.tenantCityCode = this.getUserProfile().tenantConfiguration.cityCode;
      this.reportWindow3.open();
    }

    if (this.searchResponse.process == 'IMPORT') {
      this.reportParameters = new Object();
      this.reportParameters.shipmentnumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
      this.reportParameters.shipmentdate = this.Shipmentdateofreport;
      this.reportParameters.shipmenttype = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;
      if (this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == null || this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == "") {
        this.reportParameters.shipmenttype = "AWB";
      } else {
        this.reportParameters.shipmenttype = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;
      }
      this.reportParameters.houseNumber = this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).value;
      this.reportParameters.airportCode = this.getUserProfile().tenantConfiguration.airportCode;
      this.reportParameters.cityCode = this.getUserProfile().tenantConfiguration.cityCode;
      this.reportWindow4.open();
    }


    if (this.searchResponse.process == 'TRANSHIPMENT') {
      this.reportParameters = new Object();
      this.reportParameters.shipmentnumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
      this.reportParameters.shipmentdate = this.Shipmentdateofreport;
      this.reportParameters.shipmenttype = this.shipmentType1;
      this.reportParameters.houseNumber = this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).value;
      this.reportParameters.shipmentId = this.shipmentId;
      this.reportParameters.tenantAirportCode = this.getUserProfile().tenantConfiguration.airportCode;
      this.reportParameters.tenantCityCode = this.getUserProfile().tenantConfiguration.cityCode;
      this.reportWindow5.open();
    }
  }

  onClear() {
    this.resetFormMessages();
    this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).setValue(null);
    this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).setValue(null);
    this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).clearValidators();
    this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).clearValidators();
    this.shipmentInfoForm.reset();
    this.showFlag = false;
  }

  onChangeRemarkType(data: any) {
    if (data === "TRM") {
      this.tramDetails = true;
      this.flightDetails = true;
      this.flightLable = true;
      this.deliveryDetials = false;
      this.larInfoForImport = false;
      this.flightDetailsOptional = true;
    } else if (data == "DEP") {
      this.flightDetails = true;
      this.deliveryDetials = false;
      this.tramDetails = false;
      this.larInfoForImport = false;
      this.flightDetailsOptional = false;
    } else if (data == "DLV") {
      this.deliveryDetials = true;
      if (!this.valCheck) {
        this.larInfoForImport = true;
      }
      this.tramDetails = false;
      this.flightDetails = false;
      this.flightLable = false;
    }
    else if (data == "BCS") {
      this.tramDetails = false;
      this.flightDetails = false;
      this.flightLable = false;
      this.deliveryDetials = false;
      this.larInfoForImport = false;
      this.flightDetailsOptional = false;
    }
  }
  //handling AWB/HWB handling 

  onSelectInventory(event: any, index: any, data: any) {
    let count = 0;
    let inventroy = this.shipmentInfoForm.get('freightOutremarks').value;
    inventroy.inventoryDetails.forEach(element => {
      if (element.select && element.deliveryRequestInfo != null) {
        this.shipmentInfoForm.get('freightOutremarks.doNumber').clearValidators();
        this.shipmentInfoForm.get('freightOutremarks.doNumber').setValue(element.deliveryRequestInfo.split('/')[0]);
        this.valCheck = true;
        this.larInfoForImport = false;
      }
      if (element.select && element.deliveryRequestInfo == null) {
        this.valCheck = false;
        let val = this.shipmentInfoForm.get('freightOutremarks.remarkType').value;
        if (val == 'DLV') {
          this.larInfoForImport = true;
        } else {
          this.larInfoForImport = false;
        }
        this.shipmentInfoForm.get('freightOutremarks.doNumber').setValidators([Validators.maxLength(8), Validators.required]);
      }
    });
  }

  onCancel() {
    this.navigateBack(this.dataToNavigateBack);
  }

  onAWBChange(event) {
    let search: SearchShipmentLocation = new SearchShipmentLocation();
    search.shipmentNumber = this.shipmentInfoForm.get('searchFormGroup').get('shipmentNumber').value;
    if (search.shipmentNumber != null && search.shipmentNumber != '') {
      this.awbManagementService.isHandledByHouse(search).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          if (data) {
            this.AWBNumber = this.createSourceParameter(this.shipmentInfoForm.get('searchFormGroup').get('shipmentNumber').value);
          }
          else {
            this.showErrorStatus("shipment.handledbymaster.export/transhipment");
          }
        }
      });
    }
  }
  setAWBNumber(object) {
    if (object.code == null) {
      this.hawbInvalid = true;
      this.showErrorStatus('hawb.invalid');
    }
    else {
      this.hawbInvalid = false;
      this.shipmentInfoForm.get('searchFormGroup').get('hwbNumber').setValue(object.code);
    }
  }

  onDeleteHouse() {
    this.savePageValue();
    var dataToSend = {
      awbNumber: this.shipmentInfoForm.get('searchFormGroup').get('shipmentNumber').value,
      hawbNumber: this.shipmentInfoForm.get('searchFormGroup').get('hwbNumber').value,
      shipmentId: this.shipmentId
    }
    this.navigateTo(this.router, 'awbmgmt/deleteHouse', dataToSend);
  }

  openParentWindow(width?: number, height?: number) {
    const WIDTH = 1500;
    const HEIGHT = 780;
    if (width && height) {
      this.popUpWidth = width;
      this.popUpHeight = height;
    }
    else {
      this.popUpWidth = WIDTH;
      this.popUpHeight = HEIGHT;
    }
    this.parentWindow.open();
  }
  openLocationPage() {
    this.templateRef = this.shipmentLocation;
    this.isClosePopupScreen = false;
    this.title = "awb.shipment.location";
    this.openParentWindow();
  }

  openHwbRecordPage() {
    this.templateRef = this.maintainHouseMaster;
    this.isClosePopupScreen = false;
    this.title = "HWB Record";
    this.openParentWindow();
  }

  openRemarksPage() {
    this.templateRef = this.maintainRemark;
    this.isClosePopupScreen = false;
    this.title = "title.shipment.remarks";
    this.openParentWindow();
  }


  captureDamagePage(index) {
    this.templateRef = this.CaptureDamage;
    this.isClosePopupScreen = false;
    this.title = "common.capture.damage";
    this.openParentWindow();
  }

  openHoldShipmentPage(index) {
    this.templateRef = this.shipmentOnHold;
    this.isClosePopupScreen = false;
    this.title = "shp.title";
    this.openParentWindow();
  }

  openMaintainHousePage() {
    this.savePageValue();
    var dataToSend = {
      awbNumber: this.shipmentInfoForm.get('searchFormGroup').get('shipmentNumber').value,
      hawbNumber: this.shipmentInfoForm.get('searchFormGroup').get('hwbNumber').value,
      shipmentDate: this.shipmentInfoForm.get('searchFormGroup').get('shipmentDate').value,
      shipmentNumber: this.shipmentInfoForm.get('searchFormGroup').get('shipmentNumber').value,
      hwbNumber: this.shipmentInfoForm.get('searchFormGroup').get('hwbNumber').value
    }
    this.navigateTo(this.router, 'awbmgmt/housewaybilllist', dataToSend);
  }

  openHAWBRecordScreen() {
    this.savePageValue();
    var dataToSend = {
      awbNumber: this.shipmentInfoForm.get('searchFormGroup').get('shipmentNumber').value,
      hawbNumber: this.shipmentInfoForm.get('searchFormGroup').get('hwbNumber').value,
      shipmentDate: this.shipmentInfoForm.get('searchFormGroup').get('shipmentDate').value,
      shipmentNumber: this.shipmentInfoForm.get('searchFormGroup').get('shipmentNumber').value,
      hwbNumber: this.shipmentInfoForm.get('searchFormGroup').get('hwbNumber').value
    }
    this.navigateTo(this.router, 'awbmgmt/maintainhousemaster', dataToSend);
  }

  openMaintainUpdateBOEOC() {
    this.savePageValue();
    var dataToSend = {
      hawbNumber: this.shipmentInfoForm.get('searchFormGroup').get('hwbNumber').value,
      shipmentNumber: this.shipmentInfoForm.get('searchFormGroup').get('shipmentNumber').value,
      hwbNumber: this.shipmentInfoForm.get('searchFormGroup').get('hwbNumber').value,
      documentType: 'BOE'
    }
    this.navigateTo(this.router, 'import/customs-imp-shp-manual-reqest', dataToSend);
  }


  openIrregularityPage(index) {
    this.templateRef = this.maintainShipmentIrregularity;
    this.isClosePopupScreen = false;
    this.title = "shpIrr.title";
    this.openParentWindow();
  }


  closePopScreen() {
    this.isClosePopupScreen = true;
  }

  changeAwbHwbHandling() {
    this.showConfirmMessage('confirm.unsaved.data').then(fulfilled => {
      this.responseArray.shipmentUpdateEventFireFlag=true;
      if (this.responseArray.handledByHouse === 'H') {
        this.showConfirmMessage("awb.confirm.1").then(fulfilled => {
          this.awbManagementService.changeHandlingMasterOrHouse(this.responseArray).subscribe(data => {
            if (!this.showResponseErrorMessages(data)) {
              this.onSearch();
            }
          }, error => {
            this.showErrorStatus(error);
          });
        })
      } else if (this.responseArray.handledByHouse === 'M') {
        this.showConfirmMessage("awb.confirm.2").then(fulfilled => {
          this.awbManagementService.changeHandlingMasterOrHouse(this.responseArray).subscribe(data => {
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

  openCapturePhotograph() {
    this.templateRef = this.CapturePhoto;
    this.isClosePopupScreen = false;
    this.title = "title.capture.photograph";
    this.openParentWindow();

  }
}



