import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef, TemplateRef, ViewEncapsulation, HostListener, ChangeDetectorRef } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, UserProfile, ReactiveModel, NgcFormArray, NgcWindowComponent, PageConfiguration, NgcFileUploadComponent, NgcReportComponent, NgcPrinterComponent, NgcPasswordInputComponent } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShipmentInfoReqModel, ShipmentData, SearchInactiveCargo, FileUploadDocumentModel, UploadDocumentModel, FileUploadModel, AwbPrintRequestList, ShipmentInformation } from '../awbManagement.shared';
import { AwbManagementService } from '../awbManagement.service';
// import { CollectPaymentService } from '../awbManagement/billing/collectPayment/collectPayment.service';
import { CollectPaymentService } from './../../billing/collectPayment/collectPayment.service';
import { ApplicationEntities } from '../../common/applicationentities';
import { ApplicationFeatures } from '../../common/applicationfeatures';
import { DimensionDetails, Dimention, } from '../../export/export.sharedmodel';
import { ExportService } from '../../export/export.service';

@Component({
  selector: 'app-shipment-information',
  templateUrl: './shipment-information.component.html',
  styleUrls: ['./shipment-information.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: false,
  focusToBlank: true,
  focusToMandatory: true
})

export class ShipmentInformationComponent extends NgcPage {
  uploadedDocId: any;
  lockedData: boolean;
  allSum: any;
  allTotalsCharge: any = 0;
  paidTotalCharge: any = 0;
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
  partShpFlag: boolean = false;
  doNum: boolean = false;
  tramDetails: boolean = false;
  valCheck: boolean = false;
  bookingInfoTitle: any = 'title.booking.info';
  chargeResponse: any = new Array();
  inventoryDetails: any = new Array();
  windowDestroy: boolean = true;
  holdShipment: boolean = true;
  shipmentRemarks: boolean = true;
  maintainLocation: boolean = true;
  isClosePopupScreen: boolean = true;
  isCapturePhoto: boolean = true;
  showMe: boolean = false;
  printFlag: boolean = false;
  templateRef: TemplateRef<any>;
  popUpWidth: Number;
  popUpHeight: Number;
  handledbyHouse: boolean = false;
  shippedonDate: any;
  ifNON: any;
  responseArray: any;
  hawbInvalid: boolean = false;
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
  private mesurementData = ["CMT", "INH"];
  dimenstionSaveButton: boolean = true;
  dimenstionDeleteButton: boolean = true;

  private eachDimensionRow = {
    bookingDimensionId: 0,
    bookingId: 0,
    checkBoxFlag: false,
    flagInsert: 'Y',
    weight: 0,
    length: '',
    width: '',
    height: '',
    measurementUnitCode: 'CMT',
    volumeUnitCode: 'MC',
    volume: 0.0,
    pieces: '',
    tempVolume: 0.0,
    unitCode: 'CMT'
  };

  @ViewChild('openUploadPhotoPopup') openUploadPhotoPopup: NgcWindowComponent;
  @ViewChild('parentWindow') parentWindow: NgcWindowComponent;
  @ViewChild('courierTagPopUp') courierTagPopUp: TemplateRef<any>;
  @ViewChild('rfidTagPopUp') rfidTagPopUp: TemplateRef<any>;
  @ViewChild('infoPopUp') infoPopUp: TemplateRef<any>;
  //@ViewChild('damageInfoPopUp') damageInfoPopUp: NgcWindowComponent;
  @ViewChild('fwbMsgPopUp') fwbMsgPopUp: TemplateRef<any>;
  @ViewChild('fsuMsgPopUp') fsuMsgPopUp: TemplateRef<any>;
  @ViewChild('partShpPopUp') partShpPopUp: TemplateRef<any>;
  @ViewChild('fhlMsgPopUp') fhlMsgPopUp: TemplateRef<any>;
  @ViewChild('docfiles') docfiles: NgcFileUploadComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  @ViewChild('reportWindow3') reportWindow3: NgcReportComponent;
  @ViewChild('reportWindow4') reportWindow4: NgcReportComponent;
  @ViewChild('reportWindow5') reportWindow5: NgcReportComponent;
  @ViewChild('cancelShpPopUp') cancelShpPopUp: TemplateRef<any>;
  @ViewChild('manualFreightOut') manualFreightOut: TemplateRef<any>;
  @ViewChild('epouchDocuments') epouchDocuments: TemplateRef<any>;
  @ViewChild('errorMessagePopUp') errorMessagePopUp: TemplateRef<any>;
  @ViewChild('shipmentIrregularity') shipmentIrregularity: TemplateRef<any>;
  @ViewChild("reviveShipment") reviveShipment: TemplateRef<any>;
  @ViewChild('shipmentOnHold') shipmentOnHold: TemplateRef<any>;
  @ViewChild('shipmentLocation') shipmentLocation: TemplateRef<any>;
  @ViewChild('awbDocument') awbDocument: TemplateRef<any>;
  @ViewChild('CapturePhoto') CapturePhoto: TemplateRef<any>;
  @ViewChild('CaptureDamage') CaptureDamage: TemplateRef<any>;
  @ViewChild('shipmentRemark') shipmentRemark: TemplateRef<any>;
  @ViewChild('printerName') printerName: NgcPrinterComponent;
  @ReactiveModel(UploadDocumentModel) uploadDocumentForm: NgcFormGroup;
  updateBookingObject: any;
  @ViewChild('updateBookingWindow') updateBookingWindow: TemplateRef<any>;
  // @ViewChild('updateBookingWindow') updateBookingWindow: NgcWindowComponent;
  @ViewChild('forcePurgePopUp') forcePurgePopUp: TemplateRef<any>;
  @ViewChild('passwordreset') passwordreset: NgcPasswordInputComponent;
  @ViewChild('windows') windows: NgcWindowComponent;


  stausForCancel: any;
  cancelShipmentRmrk: any;
  forwardedData: any;
  title: string;
  ShipmentInformationPrinterEnabled: boolean;
  /**
  * Initialize
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private awbManagementService: AwbManagementService,
    private collectPaymentService: CollectPaymentService, private exportService: ExportService, private cd: ChangeDetectorRef
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private shipmentInfoFormMessage: NgcFormGroup = new NgcFormGroup({
    fwbOutgoingMessageSummary: new NgcFormArray([]),
    fsuOutgoingMessageSummary: new NgcFormArray([]),
    fhlOutgoingMessageSummary: new NgcFormArray([]),
  })

  private shipmentInfoForm: NgcFormGroup = new NgcFormGroup({
    inventoryListforaddphoto: new NgcFormArray([]),
    entityType: new NgcFormControl('ULD'),


    searchFormGroup: new NgcFormGroup({
      shipmentNumber: new NgcFormControl(''),
      shipmentDate: new NgcFormControl(''),
      hwbNumber: new NgcFormControl(''),
      cancelledOn: new NgcFormControl(''),
      cancelShipmentRmrk: new NgcFormControl(''),
      shipmentType: new NgcFormControl(''),
      printerName: new NgcFormControl('')
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
      // encryptPasswordChange: new NgcFormControl('')
    }),
    forcePurgeInfoForm: new NgcFormGroup({
      reasonForPurge: new NgcFormControl(''),
      encryptPasswordChange: new NgcFormControl(''),
    }),
    shipmentInfoFormGroup: new NgcFormGroup({
      // for booking dimension popup
      dimensionList: new NgcFormArray([
      ]),
      tempVolume: new NgcFormControl(0.0),
      totalDimentionPieces: new NgcFormControl(0),
      totalDimentionVolumetricWeight: new NgcFormControl(0.0),
      volumeUnitCode: new NgcFormControl('MC'),
      measurementUnitCode: new NgcFormControl('CMT'),
      unitCode: new NgcFormControl('CMT'),
      weightUnitCode: new NgcFormControl('K'),
      // for booking dimension popup end
      shipmentDate: new NgcFormControl(''),
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
      totalVolume: new NgcFormControl(''),
      totalVolumetricWeight: new NgcFormControl(''),
      isBondedTruck: new NgcFormControl(''),
      chargebleWeight: new NgcFormControl(''),
      natureOfGoods: new NgcFormControl(''),
      shcs: new NgcFormControl(''),
      routingInfo: new NgcFormControl(''),
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
      agentCode: new NgcFormControl(''),
      agentName: new NgcFormControl(''),
      customerId: new NgcFormControl(''),
      rcarType: new NgcFormControl(''),
      releasedOn: new NgcFormControl(''),
      releasedBy: new NgcFormControl(''),
      awbRemarks: new NgcFormControl(''),
      shipmentRemarks: new NgcFormControl(''),
      epouchUpload: new NgcFormControl(''),
      uploadedDocId: new NgcFormControl(''),
      courierTag: new NgcFormControl(''),
      rfidTag: new NgcFormControl(''),
      canReUse: new NgcFormControl(''),
      abondanedCargo: new NgcFormControl(''),
      uploadedDocuments: new NgcFormControl(''),
      emailTo: new NgcFormControl(''),
      paymentStatus: new NgcFormControl(''),
      close: new NgcFormControl(''),
      closeRemarks: new NgcFormControl(''),
      unCloseRemarks: new NgcFormControl('', Validators.required),
      bankCreationDocument: new NgcFormControl(''),
      chgWeight: new NgcFormControl(''),
      ccrnNumber: new NgcFormControl(''),
      itfs: new NgcFormControl(''),
      piSection: new NgcFormControl(''),
      nonWorkingListPieces: new NgcFormControl(''),
      nonWorkingListWeight: new NgcFormControl(''),
      incomingFlightDetails: new NgcFormArray([
        new NgcFormGroup({
          flightDetailsKey: new NgcFormControl(''),
          flightDate: new NgcFormControl(''),
          flightDetailsSta: new NgcFormControl(''),
          flightAtaDay: new NgcFormControl(''),
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
          constraintCode: new NgcFormControl(''),
          noa: new NgcFormControl(''),
          freeStrgDue: new NgcFormControl(''),
          flightScreeningCompleted: new NgcFormControl(''),
          flightDetailsStaTime: new NgcFormControl(''),
          viewDamage: new NgcFormControl(''),
          irregularityInfo: new NgcFormControl(''),
          damagedPieces: new NgcFormControl(''),
          message: new NgcFormControl(''),
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
              contourCode: new NgcFormControl(''),
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
          ]),
        })
      ]),
      // chargeAdvice: new NgcFormArray([]),
      outbooundFlightDetails: new NgcFormArray([
        new NgcFormGroup({
          bookingFlightKey: new NgcFormControl(''),
          bookingStatusCode: new NgcFormControl(''),
          partSuffix: new NgcFormControl(''),
          transferType: new NgcFormControl(''),
          bookingSta: new NgcFormControl(''),
          bookingFlightBoardingPoint: new NgcFormControl(''),
          bookingShc: new NgcFormControl(''),
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
          srfNumber: new NgcFormControl(''),
          deliveryDate: new NgcFormControl(''),
          deliveryPieces: new NgcFormControl(''),
          deliveryWeight: new NgcFormControl(''),
          remarks: new NgcFormControl(''),
          referenceNumber: new NgcFormControl(''),
          status: new NgcFormControl(''),
          deliveryIrregularityNumber: new NgcFormControl(''),
          deliveryIrregularityPieces: new NgcFormControl(''),
          deliveryIrregularityWeight: new NgcFormControl(''),
          deliveryIrregularityUTLPieces: new NgcFormControl(''),
          deliveryIrregularityUTLWeight: new NgcFormControl(''),
          deliveryIrregularityPSPieces: new NgcFormControl(''),
          deliveryIrregularityPSWeight: new NgcFormControl(''),
          deliveryIrregularityDTPieces: new NgcFormControl(''),
          deliveryIrregularityDTWeight: new NgcFormControl('')
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
          waivedAmount: new NgcFormControl(''),
          paidAmount: new NgcFormControl('')
        })
      ]),
      screeningInfo: new NgcFormArray([
        new NgcFormGroup({
          sno: new NgcFormControl(''),
          method: new NgcFormControl(''),
          startedOn: new NgcFormControl(''),
          endedOn: new NgcFormControl(''),
          pieces: new NgcFormControl(''),
          weight: new NgcFormControl(''),
          chargeTo: new NgcFormControl(''),
          screeningReason: new NgcFormControl(''),
          acceptanceServiceNumber: new NgcFormControl(''),
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
          truckType: new NgcFormControl(''),
          damagedPieces: new NgcFormControl('')
        })
      ]),
      tmDetails: new NgcFormArray([
        new NgcFormGroup({
          trmNumber: new NgcFormControl(''),
          transfereeCarrier: new NgcFormControl(''),
          receivingCarrier: new NgcFormControl(''),
          finalized: new NgcFormControl(''),
          finalizedAt: new NgcFormControl(''),
          finalizedBy: new NgcFormControl(''),
          pieces: new NgcFormControl(''),
          weight: new NgcFormControl('')
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
      ])
    })
  });
  showTrmFlag: boolean = false;
  showFlag: boolean = false;
  showBookingFlag: boolean = false;
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
  billingServiceRes: any;
  totalSumFlag: boolean = false;
  reportParameters: any;
  cancelShipmentFlag: boolean = false;
  cancelShipmentReason: String = null;
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
  showIncomingFlightInfo: boolean = false;
  showAcceptanceInfo: boolean = false;
  showFreightOutInfo: boolean = false;
  showDeliveryInfo: boolean = false;
  showNoa: boolean = false;
  handlingFlag: boolean = false;
  ngOnInit() {
    super.ngOnInit();
    this.ShipmentInformationPrinterEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_Printer);
    this.onTabOutCheckHandledBy();
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

    if (this.forwardedData == null) {
      const data: any = this.retrievePageState("ShipmentInformation");
      if (data && data.searchFormGroup) {
        this.forwardedData = data.searchFormGroup;
      }
      this.savePageState('ShipmentInformation', {});
    }

    if (this.forwardedData && this.forwardedData.shipment) {
      this.forwardedData.shipmentNumber = this.forwardedData.shipment
    }
    if (this.forwardedData && this.forwardedData.awbNumber) {
      this.forwardedData.shipmentNumber = this.forwardedData.awbNumber
    }
    if (this.forwardedData && this.forwardedData.entityValue) {
      this.forwardedData.shipmentNumber = this.forwardedData.entityValue
    }

    if (this.forwardedData && this.forwardedData.shipmentNumber && !this.forwardedData.hwbNumber) {
      this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).patchValue(this.forwardedData.shipmentNumber);
      if (this.forwardedData.shipmentType) {
        this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).patchValue(this.forwardedData.shipmentType);
        this.shipmentType1 = this.forwardedData.shipmentType;
      } else {
        this.shipmentType1 = "AWB"
      }
      this.async(() => {
        this.onSearch();
      }, 1000);
    }

    if (this.forwardedData && this.forwardedData.shipmentNumber && this.forwardedData.hwbNumber) {
      this.handledbyHouse = true;
      this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).patchValue(this.forwardedData.shipmentNumber);
      this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).patchValue(this.forwardedData.hwbNumber);
      if (this.forwardedData.shipmentType) {
        this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).patchValue(this.forwardedData.shipmentType);
        this.shipmentType1 = this.forwardedData.shipmentType;
      } else {
        this.shipmentType1 = "AWB"
      }
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

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.showMe = true;
  }
  onPopup() {
    this.dimenstionSaveButton = true;
    this.dimenstionDeleteButton = true;
    this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'tempVolume']).setValue(0.0);
    this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'totalDimentionPieces']).setValue(0);
    this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'totalDimentionVolumetricWeight']).setValue(0.0);
    const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.shipmentInfoForm.get('searchFormGroup'));
    const req: ShipmentInfoReqModel = new ShipmentInfoReqModel();
    req.flagCRUD = 'R';
    req.shipmentNumber = searchFormGroup.get('shipmentNumber').value;
    req.shipmentDate = this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'shipmentDate']).value;

    req.userLoginCode = this.getUserProfile().userLoginCode
    if (searchFormGroup.get('shipmentType').value != "") {
      req.shipmentType = searchFormGroup.get('shipmentType').value;
    } else {
      req.shipmentType = this.shipmentType1;
    }

    this.awbManagementService.getDimensionInformation(req).subscribe(response => {

      if (response.data != null) {
        this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'dimensionList']).patchValue(response.data.dimensionList);
        if (response.data.weightUnitCode != null) {
          this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'weightUnitCode']).setValue(response.data.weightUnitCode);
        }

        if (response.data.dimensionList != null && response.data.dimensionList.length > 0) {
          let unitCode = response.data.dimensionList[0].unitCode;
          let volumeUnitCode = response.data.dimensionList[0].volumeUnitCode;

          if (unitCode != null) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'measurementUnitCode']).setValue(unitCode);
          }
          else {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'measurementUnitCode']).setValue("CMT");
          }
          if (volumeUnitCode != null) {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'volumeUnitCode']).setValue(volumeUnitCode);
          }
          else {
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'volumeUnitCode']).setValue("MC");
          }

        } else {
          this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'measurementUnitCode']).setValue("CMT");
          this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'volumeUnitCode']).setValue("MC");
        }
        this.updateTotalshipmentDimension();
        this.setBookingDimentionValues();
        this.windows.open();
      }
    });

  }

  eventCall(event) {
    console.log(event);
    this.setBookingDimentionValues();
    this.dimenstionSaveButton = false;

  }


  updateTotalshipmentDimension() {
    let picesCount = 0;
    (<NgcFormArray>this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'dimensionList'])).getRawValue().forEach(ele => { picesCount += +ele.pieces; });
    this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'totalDimentionPieces']).setValue(picesCount);
  }

  onAddShipDimension(index: number): void {
    this.dimenstionSaveButton = true;
    if ((<NgcFormArray>
      (<NgcFormGroup>
        (this.shipmentInfoForm.controls.shipmentInfoFormGroup))
        .controls.dimensionList).invalid) {
      this.showErrorStatus('export.fill.in.mandatory.details');
      return;
    }
    (<NgcFormArray>
      (<NgcFormGroup>
        (this.shipmentInfoForm.controls.shipmentInfoFormGroup))
        .controls.dimensionList).addValue([
          this.eachDimensionRow
        ]);
    this.cd.detectChanges();
  }
  checkForDelete() {
    let deleteFlagCount = 0;
    const formValue = this.shipmentInfoForm.getRawValue();
    const shipmentBookingDimension = formValue.shipmentInfoFormGroup.dimensionList;
    shipmentBookingDimension.forEach(element => {
      if (element.checkBoxFlag) {
        deleteFlagCount++;
      }
    });
    if (deleteFlagCount > 0) {
      this.dimenstionDeleteButton = false;
    }
    else {
      this.dimenstionDeleteButton = true;
    }
  }
  onDeleteShipDimension() {
    const formValue = this.shipmentInfoForm.getRawValue();
    const shipmentBookingDimension = formValue.shipmentInfoFormGroup.dimensionList;
    const deleteDimension = new Array<any>();
    shipmentBookingDimension.forEach(element => {
      if (element.checkBoxFlag) {
        deleteDimension.push(element);
      }
    });
    (<NgcFormArray>
      (<NgcFormGroup>
        (this.shipmentInfoForm.controls.shipmentInfoFormGroup))
        .controls.dimensionList).deleteValue(deleteDimension);
    this.dimenstionSaveButton = false;
    this.cd.detectChanges();
    this.dimenstionDeleteButton = true;
    this.setBookingDimentionValues();
  }

  onCloseDimPopUp() {
    this.windows.close();
    this.dimenstionSaveButton = true;
  }

  changeDimensionModel(event, column, dimention: NgcFormGroup, index) {
    this.dimenstionSaveButton = true;
    if (column === 0) {
      // dimention.get('pieces').setValue(event);
      this.updateTotalshipmentDimension();
    } else if (column === 1) {
      // dimention.get('length').setValue(event);
    } else if (column === 2) {
      // dimention.get('width').setValue(event);
    } else {
      // dimention.get('height').setValue(event);
    }
    if (dimention.get('pieces').value !== '' && dimention.get('length').value !== ''
      && dimention.get('width').value !== '' && dimention.get('height').value !== '') {
      this.setBookingDimentionValues();
      this.dimenstionSaveButton = false;
    }
    console.log(event);
  }

  setBookingDimentionValues() {

    const dimension: Dimention = new Dimention();
    let Pieces = this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'awbPiece']).value;
    let totalPieces2 = this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'totalDimentionPieces']).value;
    dimension.unitCode = this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'measurementUnitCode']).value;
    dimension.weightCode = this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'weightUnitCode']).value;
    dimension.volumeCode = this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'volumeUnitCode']).value;
    dimension.shipmentPcs = this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'awbPiece']).value;
    dimension.shipmentWeight = this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'awbWeight']).value;
    const dimentionList1 = (<NgcFormArray>this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'dimensionList'])).getRawValue();
    dimentionList1.forEach(element => {

      const dimentionDetail: DimensionDetails = new DimensionDetails();
      dimentionDetail.pcs = element.pieces;
      dimentionDetail.length = element.length;
      dimentionDetail.width = element.width;
      dimentionDetail.height = element.height;
      if (dimentionDetail.pcs !== null && dimentionDetail.length !== null && dimentionDetail.width !== null && dimentionDetail.height !== null)
        dimension.dimensionDetails.push(dimentionDetail);
    });
    if (dimension.dimensionDetails.length > 0) {
      this.exportService.getDimensionVolumetricWeight(dimension).subscribe(resps => {
        (<NgcFormArray>this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'dimensionList'])).controls.forEach((dim: NgcFormGroup) => {
          let pieces = +dim.get('pieces').value;
          let length = +dim.get('length').value;
          let width = +dim.get('width').value;
          let height = +dim.get('height').value;

          const dimensionData = resps.data;
          if (dimensionData !== null) {
            const volume = dimensionData.dimensionDetails.filter(ele => (ele.pcs === pieces && ele.length === length && ele.width === width && ele.height === height))[0];
            dim.get('volume').setValue(volume.volume, { onlySelf: true, emitEvent: false });
            //dim.get('measurementUnitCode').setValue(dimension.unitCode);
            dim.get('unitCode').setValue(dimension.unitCode);
            dim.get('volumeUnitCode').setValue(dimension.volumeCode);
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'tempVolume']).setValue(resps.data.calculatedVolume);
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'totalDimentionVolumetricWeight']).setValue(resps.data.volumetricWeight);
            if (Pieces === totalPieces2) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'volume']).setValue(resps.data.calculatedVolume);
            }
          }
        });

      });
    }
    else {
      this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'tempVolume']).setValue(0.0);
      this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'totalDimentionPieces']).setValue(0);
      this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'totalDimentionVolumetricWeight']).setValue(0.0);
    }
  }

  onSaveDimension() {
    const saveRequestForm = this.shipmentInfoForm.getRawValue();
    let save: ShipmentInformation = new ShipmentInformation();
    save.shipmentNumber = saveRequestForm.shipmentInfoFormGroup.shipmentNumber;
    save.shipmentDate = saveRequestForm.shipmentInfoFormGroup.shipmentDate;
    save.dimensionList = saveRequestForm.shipmentInfoFormGroup.dimensionList;
    this.awbManagementService.saveShipmentDimensionInformation(save).subscribe((resp) => {
      if (resp.success === true) {
        this.showSuccessStatus('g.completed.successfully');
        this.onCloseDimPopUp();
      }
    });
  }


  onSearch() {
    //Reset entire form group for data
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_ChargeableWeight)) {
      this.chargeableWeightFeature = true;
    }
    this.shipmentInfoForm.get('shipmentInfoFormGroup').reset();
    this.resetFormMessages();
    if (this.handledbyHouse &&
      (this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).value != null &&
        this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).value != '')) {
      this.savePageValue();
      if (this.hawbInvalid) {
        this.showErrorStatus('hawb.invalid');
        return;
      }
      if (NgcUtility.isBlank(this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).value)) {
        this.shipmentInfoForm.validate();
        this.showErrorStatus('hawb.mandatory');
        return;
      }
      var searchBy = {
        hwbNumber: this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).value,
        shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
        shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,
        shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      }
      this.navigateTo(this.router, 'awbmgmt/hwb-informationCR', searchBy);
    }
    else {
      this.bookingInfoTitle = 'title.booking.info';
      this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'chargeAdvice']).patchValue(new Array());
      this.showTrmFlag = false;
      this.showFlag = false;
      this.showBookingFlag = false;
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
      this.showIncomingFlightInfo = false;
      this.showAcceptanceInfo = false;
      this.showFreightOutInfo = false;
      this.showDeliveryInfo = false;
      this.showNoa = false;
      this.totalChgWeight = 0;
      const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.shipmentInfoForm.get('searchFormGroup'));
      searchFormGroup.validate();
      if (this.shipmentInfoForm.get('searchFormGroup').invalid) {
        this.shipmentInfoForm.validate();
        this.showErrorStatus('g.enter.awb')
        return;
      }
      const req: ShipmentInfoReqModel = new ShipmentInfoReqModel();
      req.flagCRUD = 'R';
      req.shipmentNumber = searchFormGroup.get('shipmentNumber').value;
      req.shipmentDate = searchFormGroup.get('shipmentDate').value;

      req.userLoginCode = this.getUserProfile().userLoginCode
      if (searchFormGroup.get('shipmentType').value != "") {
        req.shipmentType = searchFormGroup.get('shipmentType').value;
      } else {
        req.shipmentType = this.shipmentType1;
      }

      this.awbManagementService.getshipmentInfo(req).subscribe(response => {
        this.responseArray = response.data;
        if (response.data != null) {
          this.printFlag = true;
        }
        if (response.data == null) {
          this.showFlag = false;
          this.showCancelButton = false;
          if (this.stausForCancel == 'Yes') {
            this.shipmentInfoForm.get(['searchFormGroup', 'cancelShipmentRmrk']).patchValue(this.searchResponse.cancelShipmentRmrk);
          } else {
            if (response.messageList[0].message != null
              && response.messageList[0].message != '') {
              this.showErrorStatus(response.messageList[0].message);
            } else {
              this.showErrorStatus(response.messageList[0].code);
            }
          }



        } else if (response.data.stausForCancel == 'Yes') {
          this.stausForCancel = 'Yes';
          this.shipmentInfoForm.get(['searchFormGroup', 'cancelShipmentRmrk']).patchValue(response.data.cancelShipmentRmrk);

        } else {
          this.stausForCancel = 'No'
          this.Shipmentdateofreport = response.data.shipmentDate;
          this.totalSumFlag = false;
          this.showFlag = true;
          this.refreshFormMessages(response);
          this.searchResponse = response.data;
          if (this.searchResponse) {
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

          if (this.searchResponse) {
            this.ifNON = this.searchResponse.ifNON;
            this.shipmentId = this.searchResponse.shipmentId;
            this.processType = this.searchResponse.process;
            if (this.searchResponse.isBondedTruck) {
              this.processType = 'EXPORT';
            }
            this.shipmentInfoForm.get('shipmentInfoFormGroup').patchValue(this.searchResponse);
            this.uploadedDocId = this.searchResponse.uploadedDocId;
            (this.uploadDocumentForm.get('fileDocuments') as NgcFormArray).resetValue([]);
            this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'shipmentNumber']).patchValue(req.shipmentNumber);
            this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).patchValue(this.searchResponse.shipmentType)
            if (this.searchResponse.epouchDocuments.length > 0) {
              const documentMap: any = {};
              const documentList: Array<FileUploadDocumentModel> = new Array<FileUploadDocumentModel>();
              //
              (this.searchResponse.epouchDocuments as Array<FileUploadModel>).forEach((file: FileUploadModel) => {
                let document: FileUploadDocumentModel = documentMap[file.documentType + '-' + file.entityKey];
                // Set Default
                file.completed = true;
                // The Below Fields are Not Persisted Now. (TODO! Service Need to be Changed)
                file.userCode = file.userCode ? file.userCode : null;
                file.documentTime = file.documentTime ? file.documentTime : null;
                //
                if (!document) {
                  document = new FileUploadDocumentModel();
                  document.fileList = [];
                  documentMap[file.documentType + '-' + file.entityKey] = document;
                  // Add it to Final List
                  documentList.push(document);
                }
                //document.sh = file.entityKey;
                document.documentType = file.documentType;
                document.description = file.documentTypeDescription;
                document.completed = true;
                // Add it to Document List
                document.fileList.push(file);
              });

              (this.uploadDocumentForm.get('fileDocuments') as NgcFormArray).addValue(documentList);
            }

            if (this.searchResponse.consol === null || this.searchResponse.consol == false) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'consol']).patchValue('N');

            }
            if (this.searchResponse.consol == true) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'consol']).patchValue('Y');
            }

            if (this.searchResponse.partShipment == true) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'partShipment']).patchValue('Y');
            } else {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'partShipment']).patchValue('N');
            }

            if (this.searchResponse.svc === null || this.searchResponse.svc == false) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'svc']).patchValue('N');
            }
            if (this.searchResponse.svc == true) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'svc']).patchValue('Y');
            }

            if (this.searchResponse.uploadedDocument === null) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'uploadedDocument']).patchValue(0);
            }
            if (this.searchResponse.epouchUpload === null) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'epouchUpload']).patchValue('N');
            }

            if (this.searchResponse.eawb === null || this.searchResponse.eawb == false) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'eawb']).patchValue('N');
            }
            if (this.searchResponse.eawb == true) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'eawb']).patchValue('Y');
            }
            if (this.searchResponse.pouchReceived === null || this.searchResponse.pouchReceived == false) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'pouchReceived']).patchValue('N');
            }
            if (this.searchResponse.pouchReceived == true) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'pouchReceived']).patchValue('Y');
            }
            if (this.searchResponse.fwbm == true) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fwb']).patchValue('M');
            }

            if (this.searchResponse.fwbe == true) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fwb']).patchValue('E');
            }
            if (this.searchResponse.fwbe == null || this.searchResponse.fwbm == null) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fwb']).patchValue('N');
            }
            if (this.searchResponse.fwbe == false && this.searchResponse.fwbm == false) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fwb']).patchValue('N');
            }

            if (this.searchResponse.fhlm == true) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fhl']).patchValue('M');
            }

            if (this.searchResponse.fhle == true) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fhl']).patchValue('E');
            }
            if (this.searchResponse.fhlm === null && this.searchResponse.fhle === null) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fhl']).patchValue('N');
            }
            if (this.searchResponse.fhlm == false && this.searchResponse.fhle == false) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fhl']).patchValue('N');
            }
            if (this.searchResponse.fsu === null || this.searchResponse.fsu == false) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fsu']).patchValue('N');
            }
            if (this.searchResponse.fsu == true) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'fsu']).patchValue('Y');
            }
            if (this.searchResponse.canReUse === null || this.searchResponse.canReUse == false) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'canReUse']).patchValue('N');
            }
            if (this.searchResponse.canReUse == true) {
              this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'canReUse']).patchValue('Y');
            }

            if (this.searchResponse.abondanedCargo === null || this.searchResponse.abondanedCargo == false) {
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
                this.showIncomingFlightInfo = true;
                this.searchResponse.incomingFlightDetails.forEach((flightData, index) => {
                  if (flightData.noa) {

                    flightData.noa = 'Y'

                  } else {

                    flightData.noa = 'N'

                  }
                  this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'incomingFlightDetails', index]).patchValue(flightData);

                  if (flightData.flightDetailsSta) {
                    var fTime = flightData.flightDetailsSta;
                    this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'incomingFlightDetails', index, 'flightDetailsStaTime']).patchValue(fTime);
                  }

                  //Set the default value to false if null for both document and photocopy
                  if (flightData.documentReceivedFlag == null) {
                    flightData.documentReceivedFlag = false;
                  }

                  if (flightData.photoCopyAwbFlag == null) {
                    flightData.photoCopyAwbFlag = false;
                  }

                  if (flightData.inventoryDetails.length > 0) {
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
                this.showBookingFlag = true;
                this.searchResponse.outbooundFlightDetails.forEach((flightData1, index) => {
                  this.totalBookingPieces = parseInt(this.totalBookingPieces) + parseInt(flightData1.bookingPieces);
                  this.totalBookingWeight = parseFloat(NgcUtility.getDisplayWeight(this.totalBookingWeight)) + parseFloat(NgcUtility.getDisplayWeight(flightData1.bookingWeight));
                  if (flightData1.loadingInfoModel) {
                    flightData1.loadingInfoModel.forEach((loadedInfo, index1) => {
                      this.totalLoadedPieces = parseInt(this.totalLoadedPieces) + parseInt(loadedInfo.loadedPieces);
                      this.totalLoadedWeight = parseFloat(NgcUtility.getDisplayWeight(this.totalLoadedWeight)) + parseFloat(NgcUtility.getDisplayWeight(loadedInfo.loadedWeight));
                    })
                  }
                })
              }
            }

            if (this.searchResponse.freightOutDetails && this.searchResponse.freightOutDetails.length > 0) {
              this.totalFrtPieces = 0;
              this.totalFrtWeight = 0;
              if (this.searchResponse.freightOutDetails.length > 0) {
                this.showFreightOutInfo = true;
                this.searchResponse.freightOutDetails.forEach((flightData2, index) => {
                  this.totalFrtPieces = this.totalFrtPieces + flightData2.freightOutPieces;
                  this.totalFrtWeight = this.totalFrtWeight + flightData2.freightOutWeight;
                })
              }
            } else if (this.searchResponse.process != "IMPORT") {
              this.showFreightOutInfo = true;
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
                this.showAcceptanceInfo = true;
                this.searchResponse.acceptanceDetails.forEach((acceptanceData, index) => {
                  var acceptancePieceWeight;
                  acceptancePieceWeight = acceptanceData.acceptedPiece + '/' + acceptanceData.acceptedWeight;
                  if (acceptanceData.inventoryDetails == null) {
                    this.mannualFrtFlag = true;
                  }
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
                this.cancelShipmentReason = NgcUtility.translateMessage('awb.si.cancel.reason.delivered', null);
              }
            }

            if (this.searchResponse.shipmentDeliveryDetails && this.searchResponse.shipmentDeliveryDetails.length > 0) {
              this.totalDeliveryPieces = 0;
              this.totalDeliveryWeight = 0;
              if (this.searchResponse.shipmentDeliveryDetails.length > 0) {
                this.showDeliveryInfo = true;
                this.searchResponse.shipmentDeliveryDetails.forEach((flightData2, index) => {
                  this.totalDeliveryPieces = this.totalDeliveryPieces + flightData2.deliveryPieces;
                  this.totalDeliveryWeight = this.totalDeliveryWeight + flightData2.deliveryWeight;
                })
              }
            } else if (this.searchResponse.process == "IMPORT") {
              this.showDeliveryInfo = true;
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

            if (this.searchResponse.awbOnHold) {
              this.cancelShipmentFlag = true;
              this.cancelShipmentReason = NgcUtility.translateMessage('awb.si.cancel.reason.hold', null);
            }

            if (this.searchResponse.tmDetails) {
              if (this.searchResponse.tmDetails.length > 0) {
                this.showTrmFlag = true;
                this.searchResponse.tmDetails.forEach((tmData, index) => {
                  if (tmData.finalized) {
                    this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'tmDetails', index, 'finalized']).patchValue('Y');
                  } else {
                    this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'tmDetails', index, 'finalized']).patchValue('N');
                  }
                });
              }
            }

            //Turn ON NOA list info
            if (this.searchResponse.noalist) {
              if (this.searchResponse.noalist.length > 0) {
                this.showNoa = true;
              }
            }

          }
          let sum: number = 0;
          let billingReq: any = new Object();
          billingReq.shipment = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
          billingReq.shipmentType = 'Shipment Number';
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
                      // this.collectTotal += element.amount;

                      // if (element.waivedAmount) {
                      //   this.collectTotal -= element.waivedAmount;
                      // }

                      // if (element.paid) {
                      //   this.collectTotal -= element.paid;
                      // }
                      this.collectTotal += element.toCollect;
                      element.paidAmount = NgcUtility.isBlank(element.paid) ? 0 : element.paid;
                      this.paidTotalCharge += element.paidAmount;

                      if (element.paymentStatus == 'Paid') {
                        element.paid = "Y"
                      } else {
                        element.paid = "N"
                      }
                    } else {
                      element.paidAmount = NgcUtility.isBlank(element.paid) ? 0 : element.paid;
                      this.paidTotalCharge += element.paidAmount;
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
                this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'chargeAdvice']).patchValue(this.chargeResponse);
              }
            }
          })
        }

        if (this.searchResponse.partShipmentDetails && this.searchResponse.partShipmentDetails.length > 0) {
          //Calculate total part pieces/weight
          this.searchResponse.partShipmentDetails.forEach((partInfo, index) => {
            if (partInfo.partSuffix) {
              this.totalPartPieces = parseInt(this.totalPartPieces) + parseInt(partInfo.bookingPieces);
              this.totalPartWeight = parseFloat(NgcUtility.getDisplayWeight(this.totalPartWeight)) + parseFloat(NgcUtility.getDisplayWeight(partInfo.bookingWeight));
            }
          })
          this.bookingInfoTitle = NgcUtility.translateMessage(this.bookingInfoTitle, []) + ' (P)'
        }
        if (this.searchResponse.handlingChangeFlag) {
          this.handlingFlag = true;
        }
        else {
          this.handlingFlag = false;
        }
      })
    }
  }

  savePageValue() {
    this.savePageState("ShipmentInformation", this.shipmentInfoForm.getRawValue());
  }

  cancelShipment() {
    const cancelShipmentInfoForm: NgcFormGroup = (<NgcFormGroup>this.shipmentInfoForm.get('cancelShipmentInfoForm'));
    cancelShipmentInfoForm.validate();
    if (this.shipmentInfoForm.get('cancelShipmentInfoForm').invalid) {
      return;
    }
    this.templateRef = this.cancelShpPopUp
    if (this.cancelShipmentFlag) {
      this.showErrorStatus(NgcUtility.translateMessage('uld.assigned.to.flight.confirmation', null) + this.cancelShipmentReason);
    } else {
      this.searchResponse.cancelShipmentRmrk = this.shipmentInfoForm.get(['cancelShipmentInfoForm', 'cancelRemark']).value;
      this.searchResponse.userLoginCode = this.getUserProfile().userLoginCode;
      this.awbManagementService.cancelShipmentFromShipmentInfo(this.searchResponse).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.stausForCancel = response.data.stausForCancel;
          this.cancelShipmentRmrk = response.data.cancelShipmentRmrk;
          if (response.data.stausForCancel == 'No') {
            this.showErrorStatus('awb.si.cancelled');
          }
          else {
            this.parentWindow.close();
            this.resetFormMessages();
            this.onSearch();
          }
        }
      },
        error => {
          this.showErrorStatus(error);
        });

    }

  }

  openCancelShipmentPopup() {
    this.shipmentInfoForm.get('cancelShipmentInfoForm').reset();
    this.templateRef = this.cancelShpPopUp;
    this.title = "title.cancel.shipment";
    this.openParentWindow(700, 275);
  }

  closePopUp() {
    this.templateRef = this.cancelShpPopUp;
    this.parentWindow.close();
  }

  sendMail() {
    if (this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'emailTo']).invalid) {
      return;
    }
    if (this.docfiles.getSelectedItems().length == 0) {
      this.showInfoStatus('awb.select.document');
    } else {
      var emailId = this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'emailTo']).value;
      if (emailId) {
        let mailReq: any = new Object();
        mailReq.emailTo = emailId;
        mailReq.uploadFilesList = this.docfiles.getSelectedItems();
        mailReq.shipmentNumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;

        this.awbManagementService.sendMailUploadedDocs(mailReq).subscribe(response => {
          this.showInfoStatus('g.email.sent');
        },
          error => {
            this.showErrorStatus('Error:' + error);
          });

      } else {
        this.showInfoStatus('g.enter.email');
      }
    }
  }

  getShipmentDates() {
    this.shipmentNumberparam = this.createSourceParameter(this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value);
    this.showCancelButton = false;
    this.retrieveDropDownListRecords('SHIPMENTDATE', 'query', this.shipmentNumberparam)
      .subscribe(value => {
        if (value.length == 1) {
          this.shipmentDateLen = false;
          this.shippedonDate = value[0].code;
        } else {
          this.shipmentDateLen = true;
          this.shippedonDate = this.shipmentInfoForm.get('searchFormGroup').get('shipmentDate').value
        }
      })
  }

  openCorierTagPopUp() {
    this.templateRef = this.courierTagPopUp;
    this.title = "export.tagInfo";
    this.openParentWindow();
  }

  openFWBMsgPopUp() {
    const request = (<NgcFormGroup>this.shipmentInfoForm.get(['searchFormGroup'])).getRawValue();
    request.messageType = 'FWB'
    request.shipmentDate = (<NgcFormControl>this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'shipmentDate'])).value;
    this.awbManagementService.getFwbFhlFsuMessageList(request).subscribe(response => {
      if (response.data && (!response.messageList || response.messageList.length === 0)) {
        this.templateRef = this.fwbMsgPopUp;
        this.title = "title.message.info";
        this.openParentWindow();
        (<NgcFormArray>this.shipmentInfoFormMessage.get(['fwbOutgoingMessageSummary'])).patchValue(response.data);
      } else {
        this.showErrorStatus(response.messageList[0].code);
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  openFSUMsgPopUp() {
    const request = (<NgcFormGroup>this.shipmentInfoForm.get(['searchFormGroup'])).getRawValue();
    request.messageType = 'FSU'
    request.shipmentDate = (<NgcFormControl>this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'shipmentDate'])).value;
    this.awbManagementService.getFwbFhlFsuMessageList(request).subscribe(response => {
      if (response.data && (!response.messageList || response.messageList.length === 0)) {
        this.templateRef = this.fsuMsgPopUp;
        this.title = "title.message.info";
        this.openParentWindow();
        (<NgcFormArray>this.shipmentInfoFormMessage.get(['fsuOutgoingMessageSummary'])).patchValue(response.data);
      } else {
        this.showErrorStatus(response.messageList[0].code);
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  openFHLMsgPopUp() {
    const request = (<NgcFormGroup>this.shipmentInfoForm.get(['searchFormGroup'])).getRawValue();
    request.messageType = 'FHL'
    request.shipmentDate = (<NgcFormControl>this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'shipmentDate'])).value;
    this.awbManagementService.getFwbFhlFsuMessageList(request).subscribe(response => {
      if (response.data && (!response.messageList || response.messageList.length === 0)) {
        this.templateRef = this.fhlMsgPopUp;
        this.title = "title.message.info";
        this.openParentWindow();
        (<NgcFormArray>this.shipmentInfoFormMessage.get(['fhlOutgoingMessageSummary'])).patchValue(response.data);
      } else {
        this.showErrorStatus(response.messageList[0].code);
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  private onShipmentSelect(event) {

    if (event.shipmentType) {
      this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).patchValue(event.shipmentType);
    }
    this.handledbyHouse = false;
    this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).patchValue("");
    this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).clearValidators();
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.hawbSourceParameters = this.createSourceParameter(this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value);
      this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
        if (data != null && data.length > 0) {
          this.handledbyHouse = true;
          //this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).setValidators([Validators.required, Validators.maxLength(16)]);
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
    this.templateRef = this.rfidTagPopUp;
    this.title = "export.tagInfo";
    this.openParentWindow();
  }

  openInfoPopUp() {
    this.templateRef = this.infoPopUp;
    this.title = "title.info";
    this.openParentWindow();
  }

  onLinkClick(index) {
    this.templateRef = this.CaptureDamage;
    this.isClosePopupScreen = false;
    this.title = "export.capture.damage";
    this.openParentWindow();
  }

  openAwbDocumentPage() {
    this.templateRef = this.awbDocument;
    this.isClosePopupScreen = false;
    this.title = "g.awbdocument";
    this.openParentWindow();
  }

  openCheckListPage() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value
    }
    this.navigateTo(this.router, 'export/checklist/setupcheckliststatus', dataToSend);
  }
  updateBookingPcsWt() {
    this.updateBookingObject = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
    }
    this.templateRef = this.updateBookingWindow;
    this.isClosePopupScreen = false;
    this.title = "title.update.booking";
    this.openParentWindow();
  }

  openBillingPage() {
    this.savePageValue();
    var dataToSend = {
      shipment: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,
      shipmentInfoFlag: true
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
      entityType: 'AWB',
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
    }
    this.navigateTo(this.router, '/audit/audittrailbyawb', dataToSend);
  }

  openLocationPage() {
    this.templateRef = this.shipmentLocation;
    this.isClosePopupScreen = false;
    this.title = "awb.shipment.location";
    this.openParentWindow();
  }

  openHoldShipmentPage() {
    this.templateRef = this.shipmentOnHold;
    this.isClosePopupScreen = false;
    this.title = "si.holdshipments";
    this.openParentWindow();
  }
  openCapturePhotograph() {
    this.templateRef = this.CapturePhoto;
    this.isClosePopupScreen = false;
    this.title = "title.capture.photograph";
    this.openParentWindow();

  }
  openTracingPage() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,

    }
    this.navigateTo(this.router, 'tracing/tracingdisplay', dataToSend);
  }

  openInactiveOldCargo() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,

    }
    this.navigateTo(this.router, 'awbmgmt/inactivecargolist', dataToSend);
  }

  openIrregularityPage() {

    this.templateRef = this.shipmentIrregularity;
    this.isClosePopupScreen = false;
    this.title = "shpIrr.title";
    this.openParentWindow();
  }
  openReviveShipment() {
    this.templateRef = this.reviveShipment;
    this.isClosePopupScreen = false;
    this.title = "title.revive.shipment";
    this.openParentWindow();
  }
  openRemarksPage() {
    this.templateRef = this.shipmentRemark;
    this.isClosePopupScreen = false;
    this.title = "title.shipment.remarks";
    this.openParentWindow();
  }

  openMaintainsspdPage() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,
    }
    this.navigateTo(this.router, 'export/maintainsspd', dataToSend);
  }

  openAddServicePage() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,
    }
    this.navigateTo(this.router, 'billing/createServiceRequest', dataToSend);
  }

  openBillingServicePage() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,
    }
    this.navigateTo(this.router, 'billing/listServiceRequest', dataToSend);
  }

  openMaintainHousePage() {
    this.savePageValue();
    var searchBy = {
      awbNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
    }
    this.navigateTo(this.router, 'awbmgmt/maintainhouse', searchBy);
  }

  openSurveyPage() {
    this.savePageValue();
    var dataToSend = {
      referenceNo: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      surveyStatus: "ALL",
    }
    this.navigateTo(this.router, 'tracing/surveydetailscomponent', dataToSend);
  }

  openAWBReleasePage() {
    this.savePageValue();
    var dataToSend = [{
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      agent: this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'agentCode']).value,
      agentName: this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'agentName']).value,
      customerId: this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'customerId']).value
    }]
    this.navigateTo(this.router, 'import/awbreleaseform', dataToSend);
  }

  onereceipt(event, index) {
    this.freightOutrequest = this.shipmentInfoForm.getRawValue();
    this.reportParameters = new Object();
    this.reportParameters.shipmentnumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
    this.reportParameters.shipmentdate = this.Shipmentdateofreport;
    this.reportParameters.remarktype = 'AGT';
    this.reportParameters.servicenumber = this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'acceptanceDetails', index, 'eacceptance']).value;
    this.reportParameters.carrierval = this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'acceptanceDetails', index, 'carrierCode']).value;
    this.reportWindow2.open();
  }

  onweighingslipServiceReport() {
    this.reportParameters = new Object();
    this.reportParameters.shipmentNumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
    this.reportParameters.shipmentdate = this.Shipmentdateofreport;
    this.reportParameters.loginuser = this.getUserProfile().userShortName;
    this.reportWindow1.open();
  }

  openMaintainsFwb() {
    this.savePageValue();
    var dataToSend = {
      awbNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value
    }
    this.navigateTo(this.router, 'import/maintainfwb', dataToSend);
  }

  openDgEntry() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value
    }
    this.navigateTo(this.router, 'export/dangerousgoods/dgdradioactive', dataToSend);
  }

  openPartShipmentpage() {
    if (this.searchResponse.partShipmentDetails && this.searchResponse.partShipmentDetails.length > 0) {
      this.partShpFlag = true;
      this.templateRef = this.partShpPopUp;
      this.title = "title.part.shipment.info";
      this.openParentWindow();
    } else {
      this.partShpFlag = false;
      this.templateRef = this.partShpPopUp
      this.parentWindow.close();
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
      shipment.natureOfGoodsDescription = data.natureOfGoods;
      if (data.agent != null) {
        let agentCode = data.agent.split('-');
        shipment.agent = agentCode[0];
      } else if (data.agent == null && (!NgcUtility.isTenantCityOrAirport(data.origin) && !NgcUtility.isTenantCityOrAirport(data.destination))) {
        shipment.agent = "";
      } else if (data.process == 'IMPORT') {
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
        this.onChangeRemarkType(this.shipmentInfoForm.get('freightOutremarks.remarkType').value);
      }
      if (data.process == 'EXPORT') {
        shipment.natureOfGoodsDescription = data.natureOfGoods;
        shipment.totalPieces = data.awbPiece;
        shipment.totalWeight = data.awbWeight;
        this.shipmentInfoForm.get('freightOutremarks.flightNumber').setValidators(([Validators.required]));
        this.shipmentInfoForm.get('freightOutremarks.flightDate').setValidators(([Validators.required]));
        this.shipmentInfoForm.get('freightOutremarks.remarkType').setValue('DEP');
        this.onChangeRemarkType(this.shipmentInfoForm.get('freightOutremarks.remarkType').value);
      }
      if (data.process == 'TRANSHIPMENT') {
        this.searchResponse.incomingFlightDetails.forEach(element => {
          this.shipmentInfoForm.get('freightOutremarks.flightNumber').clearValidators();
          this.shipmentInfoForm.get('freightOutremarks.flightDate').clearValidators();
          this.shipmentInfoForm.get('freightOutremarks.remarkType').setValue('TRM');
          this.onChangeRemarkType(this.shipmentInfoForm.get('freightOutremarks.remarkType').value);
        });
      }
      this.inactiveShipmentData.shipmentData = shipmentData;
      this.templateRef = this.manualFreightOut;
      this.title = "title.manual.freight.out";
      this.openParentWindow(780, 500);
    }
  }

  manualFreigtOut() {
    let first = '';
    let second;
    this.resetFormMessages();
    let data = this.shipmentInfoForm.getRawValue().freightOutremarks;
    if (this.shipmentInfoForm.get('freightOutremarks.remarks').value != null) {
      this.inactiveShipmentData.remarks = this.shipmentInfoForm.get('freightOutremarks.remarks').value;
      this.inactiveShipmentData.remarkType = this.shipmentInfoForm.get('freightOutremarks.remarkType').value;
      this.inactiveShipmentData.deliveryOrderNo = this.shipmentInfoForm.get('freightOutremarks.doNumber').value;
      this.inactiveShipmentData.flightkey = this.shipmentInfoForm.get('freightOutremarks.flightNumber').value;
      this.inactiveShipmentData.flightDate = this.shipmentInfoForm.get('freightOutremarks.flightDate').value;
      this.inactiveShipmentData.shipmentType = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;
      this.inactiveShipmentData.trmNumber = this.shipmentInfoForm.get('freightOutremarks.trmNumber').value;
      this.inactiveShipmentData.trmDate = this.shipmentInfoForm.get('freightOutremarks.trmDate').value;
      this.inactiveShipmentData.type = data.type;
      data.localAuthorityDetail[0].customerAppAgentId = this.appointedAgentValue;
      this.inactiveShipmentData.localAuthorityDetail = data.localAuthorityDetail;
      //get Selected ShipmentInventory
      this.inactiveShipmentData.inventoryId = [];
      let valDoNumbers = Array();
      let doNumber = null;
      data.inventoryDetails.forEach(element => {
        if (element.select) {
          let patt1 = new RegExp("^[D]");
          this.inactiveShipmentData.inventoryId.push(element.shipmentInventory_Id);
          if (doNumber == null && element.deliveryRequestInfo != null && patt1.test(element.deliveryRequestInfo.split('/')[0].substring(0, 1))) {
            valDoNumbers.push(element.deliveryRequestInfo);
            doNumber = element.deliveryRequestInfo;
          } else if (doNumber != element.deliveryRequestInfo) {
            valDoNumbers.push(element.deliveryRequestInfo);
          }
        }
      });
      if (valDoNumbers.length > 1) {
        this.showErrorMessage("awb.choose.unique.do");
        return;
      }
      if (this.inactiveShipmentData.inventoryId.length <= 0) {
        this.showErrorMessage('awb.select.inventory');
        return;
      }
      //validate DoNumber
      if (this.deliveryDetials && !this.flightDetails) {
        if (this.inactiveShipmentData.deliveryOrderNo != null) {
          first = this.inactiveShipmentData.deliveryOrderNo.substring(0, 1);
          second = Number(this.inactiveShipmentData.deliveryOrderNo.substring(1, 7));
          if (this.validateDonumber(first, second) || this.inactiveShipmentData.deliveryOrderNo.length < 7) {
            this.showErrorMessage('awb.invalid.do.pattern');
            return;
          }
        } else {
          this.showErrorMessage('awb.enter.do.no')
        }
      }
      if ((this.flightDetails && !this.flightDetailsOptional) && (this.inactiveShipmentData.flightkey == null || this.inactiveShipmentData.flightDate == null || this.inactiveShipmentData.remarkType != 'DEP')) {
        if (this.inactiveShipmentData.remarkType != 'DEP') {
          this.showErrorMessage('awb.remark.type.dep');
          return;
        }
        this.showErrorMessage('export.enter.flight.details');
        return;
      }
      let localAuthorityDetailRequired = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Dlv_LocalAuthorityInfoRequiredAtDelivery);
      if (localAuthorityDetailRequired && this.deliveryDetials && this.larInfoForImport &&
        (this.inactiveShipmentData.deliveryOrderNo == null || this.inactiveShipmentData.type == null ||
          this.shipmentInfoForm.controls.freightOutremarks.get(['localAuthorityDetail', 0, 'referenceNumber']).value == null || this.inactiveShipmentData.remarkType != 'DLV')) {
        if (this.inactiveShipmentData.remarkType != 'DLV') {
          this.showErrorMessage('awb.remark.type.dlv');
          return;
        }
        this.showErrorMessage('g.fill.all.details');
        return;
      }
      if (this.shipmentInfoForm.get(['freightOutremarks', 'type']).value == "IA" &&
        this.shipmentInfoForm.controls.freightOutremarks.get(['localAuthorityDetail', 0, 'customerAppAgentId']).value == "") {
        this.showErrorMessage('awb.ia.number.invalid');
        return;
      }
      this.awbManagementService.moveToFreightOut(this.inactiveShipmentData).subscribe((res) => {
        this.refreshFormMessages(res);
        if (res.data == "sucess") {
          this.showSuccessStatus('awb.frtout.completed');
          this.onSearch();
          this.templateRef = this.manualFreightOut
          this.parentWindow.close();
        }
      },
        error => {
          this.showErrorStatus('Error:' + error);
        });

    } else {
      this.showErrorMessage('export.enter.all.mandatory.details');
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
          console.log(response.data);
          const resp = response.data
          if (resp) {
            this.appointedAgent = true;
            this.expireAppointedAgent = false;
          }
          if (resp == null) {
            this.showConfirmMessage('awb.ia.number.not.match.confirmation'
            ).then(fulfilled => {
              //empty
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
      if (this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == null || this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == "") {
        this.reportParameters.awbtype = "AWB";
      } else {
        this.reportParameters.awbtype = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;
      }
      this.reportParameters.shipmentInformationNonPremanifestedPiecesWeightEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_NonPremanifestedPiecesWeight);
      this.reportParameters.shipmentInformationPiEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_Pi);
      this.reportParameters.shipmentInformationITFSEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_ITFS);
      this.reportParameters.shipmentInformationCCRNEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_CCRN);
      this.reportParameters.shipCloseEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_Close);
      this.reportParameters.shipmentInformationChargeableWeightEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_ChargeableWeight);
      this.reportParameters.shipmentInformationScreeningEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_Screening)
      this.reportWindow3.open();
    }

    if (this.searchResponse.process == 'IMPORT') {
      this.reportParameters = new Object();
      this.reportParameters.shipmentnumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
      this.reportParameters.shipmentdate = this.Shipmentdateofreport;

      if (this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == null || this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == "") {
        this.reportParameters.shipmenttype = "AWB";
      } else {
        this.reportParameters.shipmenttype = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;
      }
      this.reportParameters.incomingFlightACCSEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_IncomingFlightAccs);
      this.reportParameters.incomingFlightNoaEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_IncomingFlightNoa);
      this.reportParameters.shipCloseEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_Close);
      this.reportParameters.shipmentIrregularityEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_DeliveryIrregularityInfo);
      this.reportWindow4.open();
    }


    if (this.searchResponse.process == 'TRANSHIPMENT') {
      this.reportParameters = new Object();
      this.reportParameters.shipmentnumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
      this.reportParameters.shipmentdate = this.Shipmentdateofreport;

      if (this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == null || this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == "") {
        this.reportParameters.shipmenttype = "AWB";
      } else {
        this.reportParameters.shipmenttype = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;
      }
      this.reportParameters.shipmentInformationNonPremanifestedPiecesWeightEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_NonPremanifestedPiecesWeight);
      this.reportParameters.incomingFlightACCSEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_IncomingFlightAccs);
      this.reportParameters.shipCloseEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_Close);
      this.reportParameters.shipmentInformationChargeableWeightEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ShipmentInformation_ChargeableWeight);
      this.reportWindow5.open();
    }
  }

  onClear() {
    this.resetFormMessages();
    this.printFlag = false;
    this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).setValue(null);
    this.shipmentInfoForm.get(['searchFormGroup', 'hwbNumber']).setValue(null);
    this.stausForCancel = 'No';
    this.shipmentInfoForm.get(['searchFormGroup', 'cancelShipmentRmrk']).setValue(null);
    this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).patchValue('AWB');
    this.shipmentType1 = 'AWB';
    this.showFlag = false;
    this.async(() => {
      try {
        (this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']) as NgcFormControl).focus();
      } catch (e) { }
    }, 1);
  }

  public printAWBBarcode() {
    if (this.shipmentInfoForm.get('searchFormGroup').get('shipmentNumber').value == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.shipmentInfoForm.get('searchFormGroup').get('shipmentNumber'), "Mandatory");
      return;
    }
    if (this.shipmentInfoForm.get('searchFormGroup').get('printerName').value == null || this.shipmentInfoForm.get('searchFormGroup').get('printerName').value == '') {
      this.showFormControlErrorMessage(<NgcFormControl>this.shipmentInfoForm.get('searchFormGroup').get('printerName'), "Mandatory");
      return;
    }

    const req: AwbPrintRequestList = new AwbPrintRequestList();
    req.shipmentId = this.searchResponse.shipmentId;
    req.awbNumber = this.shipmentInfoForm.get('searchFormGroup').get('shipmentNumber').value;
    req.destination = (this.shipmentInfoForm.get('shipmentInfoFormGroup').get('origin').value).split('/')[1];
    req.printerName = this.shipmentInfoForm.get('searchFormGroup').get('printerName').value;
    this.awbManagementService.printAWBBarcode(req).subscribe(data => {
      this.refreshFormMessages(data);
      this.showSuccessStatus('g.print.success');
    });
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
    else if (data == "NON") {
      this.tramDetails = false;
      this.flightDetails = false;
      this.deliveryDetials = false;
      this.larInfoForImport = false;
      this.flightDetailsOptional = false;
      this.flightLable = false;
    }
  }

  onSelectInventory(event: any, index: any, data: any) {

    let count = 0;
    let i = 0;
    let patt1 = new RegExp("^[D]");
    let inventory = this.shipmentInfoForm.get('freightOutremarks').value;

    inventory.inventoryDetails.forEach(element => {
      if (element.select && element.deliveryRequestInfo != null && patt1.test(element.deliveryRequestInfo.split('/')[0].substring(0, 1))) {
        this.shipmentInfoForm.get('freightOutremarks.doNumber').clearValidators();
        this.shipmentInfoForm.get('freightOutremarks.doNumber').setValue(element.deliveryRequestInfo.split('/')[0]);
        this.valCheck = true;
        this.larInfoForImport = false;
      }
      if (patt1.test(element.deliveryRequestInfo.split('/')[0].substring(0, 1))) {
        this.shipmentInfoForm.controls.freightOutremarks.get(['inventoryDetails', i, 'select']).setValue(true);
        this.shipmentInfoForm.controls.freightOutremarks.get(['inventoryDetails', i, 'select']).disable()

      }

      if (element.select && element.deliveryRequestInfo == null) {
        this.valCheck = false;
        let val = this.shipmentInfoForm.get('freightOutremarks.remarkType').value;
        if (val == 'DLV') {
          this.larInfoForImport = true;
        } else {
          this.larInfoForImport = false;
        }
        if (this.shipmentInfoForm.get('freightOutremarks.doNumber').value.length > 8) {
          this.shipmentInfoForm.get('freightOutremarks.doNumber').setValue('');
        }
        this.shipmentInfoForm.get('freightOutremarks.doNumber').setValidators([Validators.maxLength(8), Validators.required]);
      }
      ++i
    });
  }
  onCancel() {
    this.navigateBack(this.forwardedData);
  }

  openEpouchDoc() {
    if (this.searchResponse.epouchDocuments.length > 0) {
      this.templateRef = this.epouchDocuments
      this.title = "title.epouch.uploaded.documents"
      this.openParentWindow();
    }
    else {
      this.templateRef = this.errorMessagePopUp;
      this.title = "title.epouch.uploaded.documents";
      this.openParentWindow();
    }
  }

  closePopScreen() {
    this.isClosePopupScreen = true;
    (<NgcFormArray>this.shipmentInfoFormMessage.get('fwbOutgoingMessageSummary')).resetValue([]);
    (<NgcFormArray>this.shipmentInfoFormMessage.get('fsuOutgoingMessageSummary')).resetValue([]);
    (<NgcFormArray>this.shipmentInfoFormMessage.get('fhlOutgoingMessageSummary')).resetValue([]);
  }
  autoSearchShipmentInfo($event) {
    this.onSearch();
  }

  openForcedPurgePopup() {
    this.shipmentInfoForm.get('forcePurgeInfoForm').reset();
    this.templateRef = this.forcePurgePopUp
    this.title = "title.purge.shipment"
    if (this.passwordreset) {
      this.passwordreset.reset();
    }
    if (this.searchResponse.paymentStatus != null && this.searchResponse.paymentStatus != 'Paid'
      && this.searchResponse.paymentStatus != 'ChargeNotCreated') {
      this.showConfirmMessage('billing.charges.not.paid.warn').then(fulfilled => {
        this.openParentWindow(1000, 500);
      })
    } else {
      this.openParentWindow(1000, 500);
    }
  }
  closePurgePopUp() {
    this.templateRef = this.forcePurgePopUp;
    this.parentWindow.close();
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
  purgeShipment() {
    const forcePurgeInfoForm: NgcFormGroup = (<NgcFormGroup>this.shipmentInfoForm.get('forcePurgeInfoForm'));
    forcePurgeInfoForm.validate();
    if (this.shipmentInfoForm.get('forcePurgeInfoForm').invalid) {
      return;
    }
    this.templateRef = this.forcePurgePopUp
    this.parentWindow.close();
    this.searchResponse.reasonForPurge = this.shipmentInfoForm.get(['forcePurgeInfoForm', 'reasonForPurge']).value;
    this.searchResponse.password = this.shipmentInfoForm.get(['forcePurgeInfoForm', 'encryptPasswordChange']).value;
    this.searchResponse.userLoginCode = this.getUserProfile().userLoginCode;
    this.awbManagementService.purgeShipment(this.searchResponse).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.stausForCancel = response.data.stausForCancel;

        if (response.data.stausForCancel == 'PWD') {
          this.showErrorStatus('g.incorrect.password');
        }
        else {
          this.resetFormMessages();
          this.showSuccessStatus("shipment.purged.successfully");
          this.onSearch();
        }
      }
    },
      error => {
        this.showErrorStatus(error);
      });
  }
  closeWindow() {
    this.parentWindow.close();
  }
  onIssueDO() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value
    }
    this.navigateTo(this.router, 'import/issuedo', dataToSend);
  }

  onHandoverPhoto() {
    this.shipmentInfoForm.get('inventoryListforaddphoto').patchValue(this.searchResponse.handOverLocation);
    this.openUploadPhotoPopup.open();
  }

  onTabOutCheckHandledBy() {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.shipmentInfoForm.get('searchFormGroup'));
      searchFormGroup.validate();
      if (this.shipmentInfoForm.get('searchFormGroup').invalid) {
        this.shipmentInfoForm.validate();
        this.showErrorStatus('g.enter.awb');
        return;
      }
      const req: ShipmentInfoReqModel = new ShipmentInfoReqModel();
      req.shipmentNumber = searchFormGroup.get('shipmentNumber').value;
      if (req.shipmentNumber) {
        this.awbManagementService.isHandledByHouse(req).subscribe(response => {
          if (!this.showResponseErrorMessages(response)) {
            if (response) {
              this.handledbyHouse = true;
            }
            else {
              this.handledbyHouse = false;
            }
          }
        })
      }
    }
  }

  changeAwbHwbHandling() {
    this.showConfirmMessage('confirm.unsaved.data').then(fulfilled => {
      this.responseArray.shipmentUpdateEventFireFlag = true;
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
  setAWBNumber(object) {
    // if (object.code == null) {
    //   this.hawbInvalid = true;
    //   this.showErrorStatus('hawb.invalid');
    // }
    //else {
    if (object.code != null) {
      this.hawbInvalid = false;
      this.shipmentInfoForm.get('searchFormGroup').get('hwbNumber').setValue(object.code);
    }
  }
  getShapeColor(code, attribute) {
    const codeColorData = this.colorMapping[code];
    return codeColorData ? codeColorData[attribute] : this.colorMapping["D"][attribute];
  }


  onUnClose() {
    this.shipmentInfoForm.validate();
    let request = this.shipmentInfoForm.getRawValue();
    if (this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'unCloseRemarks']).value == null) {
      return;
    }
    var dataToSend = {
      shipmentId: this.shipmentId,
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,
      unCloseRemarks: this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'unCloseRemarks']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      closedOn: this.shipmentInfoForm.get('shipmentInfoFormGroup').get('close').value,
      process: this.processType

    }
    this.awbManagementService.updateCloseUnclose(dataToSend).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.operation.successful');
        this.onSearch();
      }
    }, error => {
      this.showErrorStatus(error);
    });

  }


}