import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, UserProfile, ReactiveModel, NgcFormArray, NgcWindowComponent, PageConfiguration, NgcFileUploadComponent, NgcReportComponent, NgcPrinterComponent } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShipmentInfoReqModel, ShipmentData, SearchInactiveCargo, FileUploadDocumentModel, UploadDocumentModel, FileUploadModel, AwbPrintRequestList } from '../awbManagement.shared';
import { AwbManagementService } from '../awbManagement.service';
// import { CollectPaymentService } from '../awbManagement/billing/collectPayment/collectPayment.service';
import { CollectPaymentService } from './../../billing/collectPayment/collectPayment.service';

@Component({
  selector: 'app-shipment-information',
  templateUrl: './shipment-information.component.html',
  styleUrls: ['./shipment-information.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  focusToBlank: true,
  focusToMandatory: true
})

export class ShipmentInformationComponent extends NgcPage {
  allSum: any;
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
  partShpFlag: boolean = false;
  printFlag: boolean = false;
  tramDetails: boolean = false;
  valCheck: boolean = false;
  bookingInfoTitle: any = 'BOOKING INFO';
  chargeResponse: any = new Array();
  inventoryDetails: any = new Array();
  @ViewChild('courierTagPopUp') courierTagPopUp: NgcWindowComponent;
  @ViewChild('rfidTagPopUp') rfidTagPopUp: NgcWindowComponent;
  @ViewChild('infoPopUp') infoPopUp: NgcWindowComponent;
  @ViewChild('damageInfoPopUp') damageInfoPopUp: NgcWindowComponent;
  @ViewChild('fwbMsgPopUp') fwbMsgPopUp: NgcWindowComponent;
  @ViewChild('fsuMsgPopUp') fsuMsgPopUp: NgcWindowComponent;
  @ViewChild('partShpPopUp') partShpPopUp: NgcWindowComponent;
  @ViewChild('fhlMsgPopUp') fhlMsgPopUp: NgcWindowComponent;
  @ViewChild('docfiles') docfiles: NgcFileUploadComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  @ViewChild('reportWindow3') reportWindow3: NgcReportComponent;
  @ViewChild('reportWindow4') reportWindow4: NgcReportComponent;
  @ViewChild('reportWindow5') reportWindow5: NgcReportComponent;
  @ViewChild('cancelShpPopUp') cancelShpPopUp: NgcWindowComponent;
  @ViewChild('manualFreightOut') manualFreightOut: NgcWindowComponent;
  @ViewChild('epouchDocuments') epouchDocuments: NgcWindowComponent;
  @ViewChild('errorMessagePopUp') errorMessagePopUp: NgcWindowComponent;
  @ViewChild('printerName') printerName: NgcPrinterComponent;
  @ReactiveModel(UploadDocumentModel) uploadDocumentForm: NgcFormGroup;
  stausForCancel: any;
  cancelShipmentRmrk: any;
  forwardedData: any;
  /**
  * Initialize
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private awbManagementService: AwbManagementService,
    private collectPaymentService: CollectPaymentService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private shipmentInfoFormMessage: NgcFormGroup = new NgcFormGroup({
    fwbOutgoingMessageSummary: new NgcFormArray([]),
    fsuOutgoingMessageSummary: new NgcFormArray([]),
    fhlOutgoingMessageSummary: new NgcFormArray([]),
  })

  private shipmentInfoForm: NgcFormGroup = new NgcFormGroup({
    searchFormGroup: new NgcFormGroup({
      shipmentNumber: new NgcFormControl(''),
      shipmentDate: new NgcFormControl(''),
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
          deliveryRequestInfo: new NgcFormControl('')
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
      rcarType: new NgcFormControl(''),
      releasedOn: new NgcFormControl(''),
      releasedBy: new NgcFormControl(''),
      awbRemarks: new NgcFormControl(''),
      shipmentRemarks: new NgcFormControl(''),
      epouchUpload: new NgcFormControl(''),
      //uploadedDocument: new NgcFormControl(''),
      courierTag: new NgcFormControl(''),
      rfidTag: new NgcFormControl(''),
      canReUse: new NgcFormControl(''),
      abondanedCargo: new NgcFormControl(''),
      uploadedDocuments: new NgcFormControl(''),
      emailTo: new NgcFormControl(''),
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
          flightScreeningCompleted: new NgcFormControl(''),
          flightDetailsStaTime: new NgcFormControl(''),
          viewDamage: new NgcFormControl(''),
          irregularityInfo: new NgcFormControl(''),
          damagedPieces: new NgcFormControl(''),
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
              deliveryRequestInfo: new NgcFormControl('')
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

    if (this.forwardedData == null) {
      const data: any = this.retrievePageState("ShipmentInformation");
      if (data && data.searchFormGroup) {
        console.log(data.searchFormGroup);
        this.forwardedData = data.searchFormGroup;
      }
      console.log('PageState', this.retrievePageState("ShipmentInformation"));
      this.savePageState('ShipmentInformation', {});
      console.log('PageState 2', this.retrievePageState("ShipmentInformation"));
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


    if (this.forwardedData && this.forwardedData.shipmentNumber) {
      this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).patchValue(this.forwardedData.shipmentNumber);
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
    //console.log(this.shipmentInfoForm.get(['freightOutremarks', 'type']).setValue('IA'));
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
            // this.showLicenseRemarksFlag = true;
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
            // this.showLicenseRemarksFlag = false;
            this.permitNumberFlag = true;
            this.excemptionCodeFlag = false;
            this.permitToFollowFlag = false;
          }
          if (newValue === 'IA') {
            //console.log('enter')
            this.shipmentInfoForm.get(['freightOutremarks', 'localAuthorityDetail']).patchValue([{
              referenceNumber: null,
              customerAppAgentId: null,
              license: null,
              remarks: null,
            }]);
            // this.showLicenseRemarksFlag = false;
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
    //
  }




  onSearch() {
    this.bookingInfoTitle = 'BOOKING INFO';
    console.log(this.shipmentInfoForm.value);
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
    //Reset entire form group for data
    this.shipmentInfoForm.get('shipmentInfoFormGroup').reset();

    const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.shipmentInfoForm.get('searchFormGroup'));
    searchFormGroup.validate();
    if (this.shipmentInfoForm.get('searchFormGroup').invalid) {
      console.log('invalid return');
      this.showErrorStatus('g.enter.awb')
      return;
    }



    const req: ShipmentInfoReqModel = new ShipmentInfoReqModel();
    console.log(req);
    req.flagCRUD = 'R';
    req.shipmentNumber = searchFormGroup.get('shipmentNumber').value;
    req.shipmentDate = searchFormGroup.get('shipmentDate').value;
    req.userLoginCode = this.getUserProfile().userLoginCode
    if (searchFormGroup.get('shipmentType').value != "") {
      req.shipmentType = searchFormGroup.get('shipmentType').value;
    } else {
      // req.shipmentType = 'AWB';
      req.shipmentType = this.shipmentType1;
    }


    this.awbManagementService.getshipmentInfo(req).subscribe(response => {
      console.log(response.data);

      if (response.data == null) {
        this.showFlag = false;
        this.showCancelButton = false;
        // if (this.stausForCancel != 'Yes') {
        //   this.showErrorStatus(response.messageList[0].code);
        // } else {
        //   this.shipmentInfoForm.get(['searchFormGroup', 'cancelShipmentRmrk']).patchValue(this.searchResponse.cancelShipmentRmrk);
        // }
        if (this.stausForCancel == 'Yes') {
          this.shipmentInfoForm.get(['searchFormGroup', 'cancelShipmentRmrk']).patchValue(this.searchResponse.cancelShipmentRmrk);
          // this.refreshFormMessages(response);
        } else {
          if (response.messageList[0].message != null
            && response.messageList[0].message != '') {
            this.showErrorStatus(response.messageList[0].message);
          } else {
            this.showErrorStatus(response.messageList[0].code);
          }
        }

      } else {
        this.stausForCancel = 'No'
        this.Shipmentdateofreport = response.data.shipmentDate;
        this.totalSumFlag = false;
        this.showFlag = true;
        this.printFlag = true;
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
          (this.uploadDocumentForm.get('fileDocuments') as NgcFormArray).resetValue([]);
          this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'shipmentNumber']).patchValue(req.shipmentNumber);
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


          // this.filterEpouchData();
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
            if (this.searchResponse.incomingFlightDetails.length > 0) {
              this.searchResponse.incomingFlightDetails.forEach((flightData, index) => {
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
                // this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'acceptanceDetails', index, 'acceptedPiece']).patchValue(acceptancePieceWeight);
                console.log("this.mannualFrtFlag 1", this.mannualFrtFlag);
                console.log("acceptanceData.inventoryDetails", acceptanceData.inventoryDetails);
                if (acceptanceData.inventoryDetails == null) {
                  this.mannualFrtFlag = true;
                }
                console.log("this.mannualFrtFlag 3", this.mannualFrtFlag);
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
              console.log("dkdf", this.searchResponse.shipmentDeliveryDetails.length)
              this.cancelShipmentFlag = true;
              this.cancelShipmentReason = 'it has been delivered';
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

          if (this.searchResponse.awbOnHold) {
            this.cancelShipmentFlag = true;
            this.cancelShipmentReason = 'it is on hold';
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
                    this.cancelShipmentReason = 'it has been paid';
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
        this.bookingInfoTitle = this.bookingInfoTitle + ' (P)';
      }
    })
  }

  savePageValue() {
    this.savePageState("ShipmentInformation", this.shipmentInfoForm.getRawValue());
  }

  cancelShipment() {
    const cancelShipmentInfoForm: NgcFormGroup = (<NgcFormGroup>this.shipmentInfoForm.get('cancelShipmentInfoForm'));
    cancelShipmentInfoForm.validate();
    if (this.shipmentInfoForm.get('cancelShipmentInfoForm').invalid) {
      console.log('invalid return')
      return;
    }

    this.cancelShpPopUp.close();
    if (this.cancelShipmentFlag) {
      this.showErrorStatus("Shipment cannot be cancelled because " + this.cancelShipmentReason);
    } else {
      this.searchResponse.cancelShipmentRmrk = this.shipmentInfoForm.get(['cancelShipmentInfoForm', 'cancelRemark']).value;
      this.searchResponse.password = this.shipmentInfoForm.get(['cancelShipmentInfoForm', 'encryptPasswordChange']).value;
      // this.searchResponse.password = btoa
      this.searchResponse.userLoginCode = this.getUserProfile().userLoginCode;
      this.awbManagementService.cancelShipmentFromShipmentInfo(this.searchResponse).subscribe(response => {

        if (!this.showResponseErrorMessages(response)) {
          this.stausForCancel = response.data.stausForCancel;
          this.cancelShipmentRmrk = response.data.cancelShipmentRmrk;
          if (response.data.stausForCancel == 'No') {
            this.showErrorStatus('awb.si.cancelled');
          } else if (response.data.stausForCancel == 'PWD') {
            this.showErrorStatus('g.incorrect.password');
          } else {
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
    this.cancelShpPopUp.open();

  }

  closePopUp() {
    this.cancelShpPopUp.close();
  }




  sendMail() {
    if (this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'emailTo']).invalid) {
      return;
    }
    if (this.docfiles.getSelectedItems().length == 0) {
      this.showInfoStatus("awb.select.document");
    } else {
      var emailId = this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'emailTo']).value;
      if (emailId) {
        let mailReq: any = new Object();
        mailReq.emailTo = emailId;
        mailReq.uploadFilesList = this.docfiles.getSelectedItems();
        mailReq.shipmentNumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;

        this.awbManagementService.sendMailUploadedDocs(mailReq).subscribe(response => {
          console.log("response.data", response.data);
          // if (response.data) {
          this.showInfoStatus('g.email.sent');
          // }

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
        console.log("DropDownvalue", value);
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
    const request = (<NgcFormGroup>this.shipmentInfoForm.get(['searchFormGroup'])).getRawValue();
    request.messageType = 'FWB'
    request.shipmentDate = (<NgcFormControl>this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'shipmentDate'])).value;
    this.awbManagementService.getFwbFhlFsuMessageList(request).subscribe(response => {
      if (response.data && (!response.messageList || response.messageList.length === 0)) {
        this.fwbMsgPopUp.open();
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
        this.fsuMsgPopUp.open();
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
        this.fhlMsgPopUp.open();
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
    console.log("event", event);
    if (event.shipmentType) {
      this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).patchValue(event.shipmentType);
    }
  }

  onselectEmailid(event) {
    console.log("event", event);
    console.log("event", event.desc);
    this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'emailTo']).setValue(event.desc);
  }



  openRfidTagPopUp() {
    this.rfidTagPopUp.open();
  }

  openInfoPopUp() {
    this.infoPopUp.open();
  }

  onLinkClick(index) {
    var dataToSend = {
      entityKey: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      entityType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value
    }
    this.navigateTo(this.router, 'common/capturedamageDesktop', dataToSend);
  }


  openAwbDocumentPage() {
    this.savePageValue();
    if (this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value) {
      var dataToSend = {
        shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
        shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value,
      }
    } else {
      var dataToSend = {
        shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
        shipmentType: this.shipmentType1
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
    // var dataToSend = {
    //   shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
    //   shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
    // }
    // this.navigateTo(this.router, 'tracing/tracingdisplay', dataToSend);
    var fromDate1;
    fromDate1 = this.Shipmentdateofreport;
    var dataToSend = {
      entityValue: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      fromDate: fromDate1,
      toDate: new Date(),
      entityType: 'AWB'
    }
    console.log("dataToSend", dataToSend);
    this.navigateTo(this.router, '/audit/audittrail', dataToSend);
  }

  openLocationPage() {
    this.savePageValue();
    var dataToSend = {
      shipmentType: this.shipmentType1,
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value
    }
    this.navigateTo(this.router, 'awbmgmt/shipmentLocation', dataToSend);
  }

  openHoldShipmentPage() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value
    }
    this.navigateTo(this.router, 'awbmgmt/shipmentonhold', dataToSend);
  }

  openTracingPage() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
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

  openIrregularityPage() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value
    }
    this.navigateTo(this.router, 'awbmgmt/irregularity', dataToSend);
  }

  openRemarksPage() {
    this.savePageValue();
    var dataToSend = {
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      shipmentType: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value
    }
    this.navigateTo(this.router, 'awbmgmt/maintainremarks', dataToSend);
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

  openMaintainHousePage() {
    this.savePageValue();
    var searchBy = {
      awbNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
    }
    this.navigateTo(this.router, 'awbmgmt/maintainhouse', searchBy);
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
    var dataToSend = [{
      shipmentNumber: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value,
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value,
      agent: this.shipmentInfoForm.get(['shipmentInfoFormGroup', 'agent']).value
    }]
    this.navigateTo(this.router, 'import/awbreleaseform', dataToSend);
  }


  onereceipt() {

    this.freightOutrequest = this.shipmentInfoForm.getRawValue();
    this.reportParameters = new Object();
    this.reportParameters.shipmentnumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
    this.reportParameters.shipmentdate = this.Shipmentdateofreport;
    this.reportParameters.remarktype = 'AGT'
    //this.reportParameters.shipmentdate = this.response.data.shipmentDate;
    //this.reportParameters.loginuser = this.getUserProfile().userShortName;
    this.reportWindow2.open();
  }

  onweighingslipServiceReport() {
    //alert(JSON.stringify(this.reportParameters))
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
      shipmentDate: this.shipmentInfoForm.get(['searchFormGroup', 'shipmentDate']).value
    }
    this.navigateTo(this.router, 'import/maintainfwb', dataToSend);
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
    console.log("Part lenght", this.searchResponse.partShipmentDetails.length);
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
      console.log(data);
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
          console.log(flightData.inventoryDetails);
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
        //console.log(details);
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
      //console.log(shipmentData);
      this.manualFreightOut.open();
    }

  }

  manualFreigtOut() {
    let first = '';
    let second;
    this.resetFormMessages();
    let data = this.shipmentInfoForm.getRawValue().freightOutremarks;
    //console.log(data);
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
        this.showErrorMessage("error.choose.unique.do.number");
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
      //console.log(this.inactiveShipmentData);
      if (this.deliveryDetials && this.larInfoForImport &&
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
          this.manualFreightOut.hide();
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
      //appointedAgent: event.controls.appointedAgent.value

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
      // this.reportParameters.awbtype = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;
      if (this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == null || this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == "") {
        this.reportParameters.awbtype = "AWB";
      } else {
        this.reportParameters.awbtype = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;
      }
      this.reportWindow3.open();
    }

    if (this.searchResponse.process == 'IMPORT') {
      this.reportParameters = new Object();
      this.reportParameters.shipmentnumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
      this.reportParameters.shipmentdate = this.Shipmentdateofreport;
      // this.reportParameters.shipmenttype = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;

      if (this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == null || this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == "") {
        this.reportParameters.shipmenttype = "AWB";
      } else {
        this.reportParameters.shipmenttype = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;
      }
      this.reportWindow4.open();
    }


    if (this.searchResponse.process == 'TRANSHIPMENT') {
      this.reportParameters = new Object();
      this.reportParameters.shipmentnumber = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).value;
      this.reportParameters.shipmentdate = this.Shipmentdateofreport;
      // this.reportParameters.shipmenttype = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;

      if (this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == null || this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value == "") {
        this.reportParameters.shipmenttype = "AWB";
      } else {
        this.reportParameters.shipmenttype = this.shipmentInfoForm.get(['searchFormGroup', 'shipmentType']).value;
      }
      this.reportWindow5.open();
    }
  }

  onClear() {
    this.resetFormMessages();
    this.shipmentInfoForm.get(['searchFormGroup', 'shipmentNumber']).setValue(null);
    this.showFlag = false;

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

    if (NgcUtility.isTenantCityOrAirport((this.shipmentInfoForm.get('shipmentInfoFormGroup').get('origin').value).split('/')[0])) {
      if (this.shipmentInfoForm.get('shipmentInfoFormGroup').get(['acceptanceDetails', 0, 'eacceptance']) == null) {
        this.showErrorMessage('error.doc.not.accepted');
        return;
      }
    }
    else {
      if (this.shipmentInfoForm.get('shipmentInfoFormGroup').get(['incomingFlightDetails', 0, 'flightDetailsKey']) == null) {
        this.showErrorMessage('error.doc.not.received');
        return;
      }
    }

    const req: AwbPrintRequestList = new AwbPrintRequestList();
    req.shipmentId = this.searchResponse.shipmentId;
    req.awbNumber = this.shipmentInfoForm.get('searchFormGroup').get('shipmentNumber').value;
    req.destination = (this.shipmentInfoForm.get('shipmentInfoFormGroup').get('origin').value).split('/')[1];
    // req.carrierCode = (this.shipmentInfoForm.get('shipmentInfoFormGroup').get('routingInfo').value).split('/')[0];
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
  }

  onSelectInventory(event: any, index: any, data: any) {
    let count = 0;
    let i = 0;
    let inventroy = this.shipmentInfoForm.get('freightOutremarks').value;
    inventroy.inventoryDetails.forEach(element => {
      let patt1 = new RegExp("^[D]");
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
      this.epouchDocuments.open();
    }
    else {
      this.errorMessagePopUp.open();
    }
  }

  onMessageWindowClose() {
    (<NgcFormArray>this.shipmentInfoFormMessage.get('fwbOutgoingMessageSummary')).resetValue([]);
    (<NgcFormArray>this.shipmentInfoFormMessage.get('fsuOutgoingMessageSummary')).resetValue([]);
    (<NgcFormArray>this.shipmentInfoFormMessage.get('fhlOutgoingMessageSummary')).resetValue([]);
  }
}
