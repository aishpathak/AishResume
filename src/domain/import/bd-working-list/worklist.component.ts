// Angular
import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ChangeDetectorRef,
  QueryList, Pipe, ViewChild, AfterViewInit, OnInit,
} from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


// Application
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NotificationMessage, StatusMessage, CellsRendererStyle,
  DropDownListRequest, MessageType, NgcCheckBoxComponent, NgcUtility, PageConfiguration, NgcWindowComponent, NgcReportComponent
} from 'ngc-framework';
import { CellsStyleClass } from "../../../shared/shared.data";
import { BreakdownWorkingListModel, BreakDownWorkingListShipmentResult, InboundBreakdownModel, InboundBreakdownShipmentInventoryModel } from '../import.shared';
import { ImportService } from '../import.service';
import { FlightMail } from '../../export/buildup/buildup.sharedmodel';
import { BuildupService } from '../../export/buildup/buildup.service';
import { ApplicationFeatures } from '../../common/applicationfeatures';
import { element } from 'protractor';
import { isNull } from 'util';
import { ApplicationEntities } from '../../common/applicationentities';

/**
 *
 * Breakdown Working List of Flight
 *
 */
@Component({
  templateUrl: './worklist.component.html',
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  restorePageOnBack: true
})
export class BDWorkListComponent extends NgcPage {
  private breakDownWorkList: any;
  private isBdWorkListPresent = false;
  private shipment: any;
  private hawbInfoFeatureEnabled: boolean = false;
  private selectedShipmentsForGroupLocation: any[] = [];
  @ViewChild('window')
  private window: NgcWindowComponent;
  @ViewChild('reportWindow')
  reportWindow: NgcReportComponent;
  @ViewChild('addLocation')
  private addLocation: NgcWindowComponent;
  private breakDownServiceProvider: any;
  segmentInformation: any[] = [];
  consolidateViewSegmentInformation: any[] = [];
  @ViewChild('accessoryPopUp')
  accessoryPopUp: NgcWindowComponent;

  viewBySegement: boolean = false;
  manifestedSelectedSegmentInformation: any[] = [];
  consolidateSelectedSegmentSeInformation: any[] = [];
  consolidatedView: boolean = false;
  manifestedView: boolean = true;
  private cargoInULD: Number;
  private pieceCount: Number;
  private weightCount: Number;
  private looseCargo: Number;
  private flightId: Number;
  private flagChecked: boolean = false;
  private reopenBDTab: boolean = false;
  private openBDTab: boolean = false;
  private carrierCode: string = null;
  private boardPoint: string = null;
  private departureTime: string = null;
  private inventoryPieceCount: Number = 0;
  private shcList = [];
  private dataSyncSearch: number = 0;
  routedInformation: any;
  private selectedTabIndex: number = 0;
  sourceIdSegmentDropdown: any;
  segmentDropDown: any[] = [];
  private bdWorkListForm: NgcFormGroup = new NgcFormGroup({
    flight: new NgcFormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(5)]),
    flightNumber: new NgcFormControl('', Validators.required),
    flightDate: new NgcFormControl(new Date(), Validators.required),
    breakdownPending: new NgcFormControl(),
    sta: new NgcFormControl(),
    ata: new NgcFormControl(),
    boardPoint: new NgcFormControl(),
    aircraftType: new NgcFormControl(),
    flightRemarks: new NgcFormControl(),
    status: new NgcFormControl(),
    segment: new NgcFormControl(),
    firstTimeBreakDownCompletedAt: new NgcFormControl(),
    flightCompletedDate: new NgcFormControl(),
    segmentDropdown: new NgcFormControl(),
    weatherCondition: new NgcFormControl(),
    customSubmission: new NgcFormControl(),
    customSubmissionAcknowledgement: new NgcFormControl(),
    breakDownWorkingListSegment: new NgcFormArray(
      [
      ]
    ),
    shipmentMismatchPieces: new NgcFormArray(
      [
      ]
    ),
    breakDownWorkingListShipmentResult: new NgcFormArray(
      [
      ]
    ),
    breakDownWorkingListShipmentResultConsolidatedView: new NgcFormArray(
      [
      ]
    ),
    breakDownWorkingListShipmentResultBySegment: new NgcFormArray(
      [
      ]
    ),
    breakDownWorkingListShipmentResultConsolidatedViewBySegement: new NgcFormArray(
      [
      ]
    ),
    flightLevelCount: new NgcFormGroup({
      flightULDCount: new NgcFormControl(),
      flightLooseCargoCount: new NgcFormControl(),
      flightCargoInULD: new NgcFormControl(),
      flightPieces: new NgcFormControl(),
      flightWeight: new NgcFormControl(),
      transhipmentULDsManifested: new NgcFormControl(),
      localULDsManifested: new NgcFormControl(),
      totalULDsManifested: new NgcFormControl(),


      transhipmentULDsBDcomplete: new NgcFormControl(),
      localULDsBDcomplete: new NgcFormControl(),
      totalULDsBDcomplete: new NgcFormControl(),

      transhipmentLooseManifested: new NgcFormControl(),
      localLooseManifested: new NgcFormControl(),
      totalLooseManifested: new NgcFormControl(),

      transhipmentLooseBDcomplete: new NgcFormControl(),
      localLooseBDcomplete: new NgcFormControl(),
      totalLooseBDcomplete: new NgcFormControl(),
    }),
    changeLocation: new NgcFormGroup({
      shipmentLocation: new NgcFormControl(),
      warehouseLocation: new NgcFormControl(),
      bdstaffGroups: new NgcFormControl(),
      shipmentOrigin: new NgcFormControl(''),
      shipmentDestination: new NgcFormControl(''),
      shipmentList: new NgcFormArray([
        new NgcFormGroup({
          shipmentNumber: new NgcFormControl(''),
          awbPieces: new NgcFormControl(''),
          awbWeight: new NgcFormControl(''),
          specialHandlingCode: new NgcFormControl(''),
          natureOfGoodsDescription: new NgcFormControl(''),
          origin: new NgcFormControl(''),
          destination: new NgcFormControl('')
        })
      ]),
    }),
  });
  reportParameters: any;
  arrivalManifestData: any;
  resp: any;
  inputData: { flightKey: any; flightDate: any; uldNumber: any; modeType: string; };
  inboundBreakdownFormGroup: any;
  uldNumber: any;


  public ngOnInit(): void {
    this.dataSyncSearch = 0;
    super.ngOnInit();
    let forwardedData = this.getNavigateData(this.activatedRoute);
    this.routedInformation = this.getNavigateData(this.activatedRoute);
    this.hawbInfoFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBInfo);
    if (forwardedData != null) {
      if (forwardedData.shipmentData != null &&
        forwardedData.shipmentData.flightNumber != null && forwardedData.shipmentData.flightNumber != ""
        && forwardedData.shipmentData.flightDate != null && forwardedData.shipmentData.flightDate != "") {
        this.bdWorkListForm.get('flightNumber').setValue(forwardedData.shipmentData.flightNumber);
        this.bdWorkListForm.get('flightDate').setValue(forwardedData.shipmentData.flightDate);
        this.dataSyncSearch = forwardedData.dataSyncSearch;
        this.getBeakDownList();
      } else if (forwardedData.flightNumber != null && forwardedData.flightNumber != ""
        && forwardedData.flightDate != null && forwardedData.flightDate != "") {
        this.bdWorkListForm.get('flightNumber').setValue(forwardedData.flightNumber);
        this.bdWorkListForm.get('flightDate').setValue(forwardedData.flightDate);
        this.dataSyncSearch = forwardedData.dataSyncSearch;
        this.getBeakDownList();
      }
    }
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
  }
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute, private router: Router, private importService: ImportService,
    private buildUpService: BuildupService) {
    super(appZone, appElement, appContainerElement);
  }

  getBeakDownList() {
    this.viewBySegement = false;
    this.isBdWorkListPresent = false;
    this.segmentDropDown = [];
    this.selectedShipmentsForGroupLocation = [];
    let flightNumber = this.bdWorkListForm.get("flightNumber").value;
    let flightDate = this.bdWorkListForm.get("flightDate").value;
    let breakdownPending = this.bdWorkListForm.get("breakdownPending").value;
    this.bdWorkListForm.get('segmentDropdown').patchValue('');
    if (flightNumber != undefined && flightNumber != null && flightNumber != '' && flightDate != undefined) {
      const breakdownWorkingListModel: BreakdownWorkingListModel = new BreakdownWorkingListModel();
      breakdownWorkingListModel.flightDate = flightDate;
      breakdownWorkingListModel.flightNumber = flightNumber;
      breakdownWorkingListModel.breakdownPending = breakdownPending;
      this.resetFormMessages();
      this.importService.getBreakDownWorkingList(breakdownWorkingListModel).subscribe((response) => {
        console.log(response);
        if (!this.showResponseErrorMessages(response)) {
          if (response.data.handlinginSystem && this.dataSyncSearch == 0) {
            this.showConfirmMessage('entered.flight.not.handled.in.cosys').then(reason => {
              this.successResponse(response);
              this.dataSyncSearch++;
            }).catch(reason => {
              this.isBdWorkListPresent = false;
            });
          } else {
            this.successResponse(response);
          }
        }
      }, (err) => {
        this.showWarningStatus("invalid.import.flight");
      });
    } else {
      this.bdWorkListForm.validate();
      this.showWarningStatus("mandatory.field.not.empty");
    }
  }
  successResponse(response) {
    if (response != undefined && response.data != undefined) {
      this.flightId = response.data.flightId;
      // response.data.sta = NgcUtility.getTimeAsString(NgcUtility.toDateFromLocalDate(response.data.sta));
      // response.data.ata = NgcUtility.getTimeAsString(NgcUtility.toDateFromLocalDate(response.data.ata));
      this.bdWorkListForm.get('boardPoint').setValue(response.data.boardPoint);
      this.bdWorkListForm.get('ata').setValue(response.data.ata);
      this.bdWorkListForm.get('sta').setValue(response.data.sta);
      this.bdWorkListForm.get('aircraftType').setValue(response.data.aircraftType);
      this.bdWorkListForm.get('flightRemarks').setValue(response.data.flightRemarks);
      this.bdWorkListForm.get('status').setValue(response.data.status);
      this.bdWorkListForm.get('firstTimeBreakDownCompletedAt').setValue(response.data.firstTimeBreakDownCompletedAt);
      this.bdWorkListForm.get('flightCompletedDate').setValue(response.data.flightCompletedDate);
      this.bdWorkListForm.get('segment').setValue(response.data.segment);
      this.bdWorkListForm.get('customSubmission').setValue(response.data.customSubmission);
      this.bdWorkListForm.get('customSubmissionAcknowledgement').setValue(response.data.customSubmissionAcknowledgement);
      this.bdWorkListForm.get('flightDate').setValue(this.bdWorkListForm.get("flightDate").value);
      this.bdWorkListForm.get('flightNumber').setValue(this.bdWorkListForm.get("flightNumber").value);
      if (response.data.weatherCondition != null) {
        this.bdWorkListForm.get('weatherCondition').setValue(response.data.weatherCondition);
      }

      this.carrierCode = response.data.carrierCode;
      this.boardPoint = response.data.boardPoint;
      this.departureTime = response.data.departureTime;

      this.sourceIdSegmentDropdown = this.createSourceParameter(
        this.bdWorkListForm.get("flightNumber").value,
        this.bdWorkListForm.get("flightDate").value
      );
      this.retrieveDropDownListRecords('ARRIVAL_FLIGHTSEGMENT', 'query', this.sourceIdSegmentDropdown)
        .subscribe(value => {
          this.segmentDropDown = value;
          if (value.length == 1) {
            //this.form.get("segment").patchValue(value[0].code);
          } else {
            let dropdown: any = null;
            dropdown = { flagCRUD: 'R', code: "0", desc: "ALL" };
            value.push(dropdown);
          }
        });

      if (response.data.status == 'BreakDown Completed' || response.data.status == 'Flight Completed') {
        this.reopenBDTab = true;
        this.openBDTab = false;
      } else {
        this.openBDTab = true;
        this.reopenBDTab = false;
      }

      this.isBdWorkListPresent = true;

    } else {
      this.dataNullResponse();
      this.showInfoStatus("import.info102");
    }

    this.segmentInformation = [];
    this.consolidateViewSegmentInformation = [];

    this.cargoInULD = 0;
    this.looseCargo = 0;
    this.pieceCount = 0;
    this.weightCount = 0;
    if (response.data.breakDownWorkingListSegment) {
      for (let item = 0; item < response.data.breakDownWorkingListSegment.length; item++) {
        this.cargoInULD = +this.cargoInULD + + response.data.breakDownWorkingListSegment[item].cargoInULD;
        this.looseCargo = +this.looseCargo + + response.data.breakDownWorkingListSegment[item].looseCargoCount;
        this.pieceCount = +this.pieceCount + + response.data.breakDownWorkingListSegment[item].segmentPieceCount;
        this.weightCount = +this.weightCount + + response.data.breakDownWorkingListSegment[item].segmentWeight;
      }
    }


    this.bdWorkListForm.get("flightLevelCount.flightULDCount").setValue(this.cargoInULD);
    this.bdWorkListForm.get("flightLevelCount.flightLooseCargoCount").setValue(this.looseCargo);
    this.bdWorkListForm.get("flightLevelCount.flightCargoInULD").setValue(this.pieceCount);
    this.bdWorkListForm.get("flightLevelCount.flightPieces").setValue(this.pieceCount);
    this.bdWorkListForm.get("flightLevelCount.flightWeight").setValue(this.weightCount);

    this.bdWorkListForm.get("flightLevelCount.transhipmentULDsManifested").setValue(response.data.flightLevelUldCounts.transhipmentULDsManifested);
    this.bdWorkListForm.get("flightLevelCount.localULDsManifested").setValue(response.data.flightLevelUldCounts.localULDsManifested);
    this.bdWorkListForm.get("flightLevelCount.totalULDsManifested").setValue(response.data.flightLevelUldCounts.totalULDsManifested);

    this.bdWorkListForm.get("flightLevelCount.transhipmentULDsBDcomplete").setValue(response.data.flightLevelUldCounts.transhipmentULDsBDcomplete);
    this.bdWorkListForm.get("flightLevelCount.localULDsBDcomplete").setValue(response.data.flightLevelUldCounts.localULDsBDcomplete);
    this.bdWorkListForm.get("flightLevelCount.totalULDsBDcomplete").setValue(response.data.flightLevelUldCounts.totalULDsBDcomplete);

    this.bdWorkListForm.get("flightLevelCount.transhipmentLooseManifested").setValue(response.data.flightLevelUldCounts.transhipmentLooseManifested);
    this.bdWorkListForm.get("flightLevelCount.localLooseManifested").setValue(response.data.flightLevelUldCounts.localLooseManifested);
    this.bdWorkListForm.get("flightLevelCount.totalLooseManifested").setValue(response.data.flightLevelUldCounts.totalLooseManifested);

    this.bdWorkListForm.get("flightLevelCount.transhipmentLooseBDcomplete").setValue(response.data.flightLevelUldCounts.transhipmentLooseBDcomplete);
    this.bdWorkListForm.get("flightLevelCount.localLooseBDcomplete").setValue(response.data.flightLevelUldCounts.localLooseBDcomplete);
    this.bdWorkListForm.get("flightLevelCount.totalLooseBDcomplete").setValue(response.data.flightLevelUldCounts.totalLooseBDcomplete);


    for (let item of response.data.breakDownWorkingListSegment) {
      for (let shipmentData of item.breakDownWorkingListShipmentInfoModel) {
        shipmentData.bdPieces = shipmentData.bdPieces ? shipmentData.bdPieces : 0;
        shipmentData.bdWeight = shipmentData.bdWeight ? shipmentData.bdWeight : 0;
        shipmentData.irregularPieces = shipmentData.irregularPieces ? shipmentData.irregularPieces : 0;
        shipmentData.irregularWeight = shipmentData.irregularWeight ? shipmentData.irregularWeight : 0;
        shipmentData.cargoIrregularityCode = shipmentData.cargoIrregularityCode ? shipmentData.cargoIrregularityCode : '';
        shipmentData.origin = shipmentData.origin;
        shipmentData.mnPieces = shipmentData.mnPieces;
        shipmentData.mnWeight = shipmentData.mnWeight;

        let tempSHC = '';
        if (shipmentData.breakDownWorkingListULDDetails) {
          for (let uldData of shipmentData.breakDownWorkingListULDDetails) {
            if (uldData) {
              //loose Shipment Check
              if (uldData.uldNumber === shipmentData.shipmentNumber) {
                let newShipment = {};
                newShipment['uldORawbNumber'] = uldData.uldNumber;
                //newShipment['origin'] = uldData.origin;
                newShipment['shipmentNumber'] = 'Loose Shipment';
                newShipment['shipmentNumberCopy'] = uldData.uldNumber;
                newShipment['cargoInULD'] = item.cargoInULD;
                newShipment['looseCargoCount'] = item.looseCargoCount;
                newShipment['segmentPieceCount'] = item.segmentPieceCount;
                newShipment['segmentWeight'] = NgcUtility.getDisplayWeight(item.segmentWeight);
                newShipment['flightBoardPoint'] = item.flightBoardPoint;
                newShipment['destination'] = shipmentData.destination;
                newShipment['outBoundFlightKey'] = shipmentData.outboundFlightKey;
                newShipment['origin'] = shipmentData.origin;
                newShipment['mnPieces'] = uldData.manifestedPiece;
                newShipment['mnWeight'] = uldData.manifestedWeight;

                newShipment['awbPieces'] = shipmentData.awbPieces;
                newShipment['awbWeight'] = shipmentData.awbWeight;
                newShipment['shipmenthargebleWeight'] = shipmentData.shipmenthargebleWeight;
                newShipment['natureOfGoodsDescription'] = shipmentData.natureOfGoodsDescription;
                newShipment['impArrivalManifestShipmentInfoId'] = shipmentData.impArrivalManifestShipmentInfoId;
                newShipment['shipmentId'] = shipmentData.shipmentId;
                newShipment['bdPieces'] = uldData.breakDownPieces ? uldData.breakDownPieces : 0;
                newShipment['bdWeight'] = uldData.breakDownWeight ? uldData.breakDownWeight : 0;
                newShipment['readyForDelivery'] = shipmentData.readyForDelivery;
                newShipment['surplusFlag'] = shipmentData.surplusFlag;
                newShipment['shipmentdate'] = shipmentData.shipmentdate;
                newShipment['transferType'] = shipmentData.transferType;
                newShipment['irregularity'] = null;
                if (shipmentData.cargoIrregularityCode) {
                  newShipment['irregularity'] = shipmentData.cargoIrregularityCode;
                }
                newShipment['instruction'] = shipmentData.shipmentInstruction;
                newShipment['shipmentType'] = 'Loose';
                newShipment['shipmentTypeCopy'] = shipmentData.shipmentType;
                newShipment['temp'] = 'Loose Shipment';
                newShipment['manifestPieces'] = shipmentData.mnPieces;
                newShipment['manifestWeight'] = shipmentData.mnWeight;
                newShipment['dmgFlag'] = shipmentData.damagedPieces;
                newShipment['damagedPieces'] = null;
                if (shipmentData.breakDownWorkingListSHC) {
                  for (let shctempData of shipmentData.breakDownWorkingListSHC) {
                    tempSHC = tempSHC + ' ' + shctempData.specialHandlingCode;
                  }
                }
                newShipment['specialHandlingCode'] = shipmentData.shcCode;
                newShipment['deliveryPieces'] = null;
                newShipment['irregularityCode'] = shipmentData.cargoIrregularityCode;
                newShipment['shipmentInstruction'] = shipmentData.shipmentInstruction;
                newShipment['masterShcs'] = shipmentData.masterShcs;
                newShipment['partSuffix'] = shipmentData.partSuffix;
                newShipment['view'] = "Manifested";

                newShipment['handledByDOMINT'] = shipmentData.handledByDOMINT;
                newShipment['handledByMasterHouse'] = shipmentData.handledByMasterHouse;
                newShipment['currentLocation'] = shipmentData.currentLocation;
                newShipment['ffmLocation'] = shipmentData.ffmLocation;
                newShipment['warehouseDestination'] = null;
                newShipment['uldLocation'] = null;
                newShipment['uldConfirmedDate'] = null;
                newShipment['eic'] = null;
                newShipment['emptyFlag'] = null;
                newShipment['uldCurrentStatus'] = null;
                newShipment['uldCondition'] = null;



                newShipment['shipmentHawbList'] = shipmentData.shipmentHawbList;
                this.segmentInformation.push(newShipment);

              }

            }
          }
        }

      }
    }

    for (let item of response.data.breakDownWorkingListSegment) {
      for (let shipmentData of item.breakDownWorkingListShipmentInfoModel) {
        shipmentData.bdPieces = shipmentData.bdPieces ? shipmentData.bdPieces : 0;
        shipmentData.bdWeight = shipmentData.bdWeight ? shipmentData.bdWeight : 0;
        shipmentData.irregularPieces = shipmentData.irregularPieces ? shipmentData.irregularPieces : 0;
        shipmentData.origin = shipmentData.origin;
        shipmentData.irregularWeight = shipmentData.irregularWeight ? NgcUtility.getDisplayWeight(shipmentData.irregularWeight) : 0.0;
        shipmentData.mnWeight = NgcUtility.getDisplayWeight(shipmentData.mnWeight);
        shipmentData.cargoIrregularityCode = shipmentData.cargoIrregularityCode ? shipmentData.cargoIrregularityCode : '';
        let tempSHC = '';
        if (shipmentData.breakDownWorkingListULDDetails) {
          for (let uldData of shipmentData.breakDownWorkingListULDDetails) {
            if (uldData) {
              if (uldData.uldNumber != shipmentData.shipmentNumber) {
                let newShipment = Object.assign({}, shipmentData);
                newShipment['shipmentNumberCopy'] = shipmentData.shipmentNumber;
                newShipment['cargoInULD'] = item.cargoInULD;
                newShipment['looseCargoCount'] = item.looseCargoCount;
                newShipment['segmentPieceCount'] = item.segmentPieceCount;
                newShipment['segmentWeight'] = NgcUtility.getDisplayWeight(item.segmentWeight);
                newShipment['flightBoardPoint'] = item.flightBoardPoint;
                newShipment['shipmentNumber'] = shipmentData.shipmentNumber;
                newShipment['uldORawbNumber'] = uldData.uldNumber;
                newShipment['transferType'] = uldData.transferType;
                newShipment['bdPieces'] = uldData.breakDownPieces ? uldData.breakDownPieces : 0;
                newShipment['bdWeight'] = uldData.breakDownWeight ? uldData.breakDownWeight : 0;
                newShipment['instruction'] = shipmentData.shipmentInstruction;
                newShipment['shipmentType'] = 'ULD';
                newShipment['shipmentTypeCopy'] = shipmentData.shipmentType;
                newShipment['deliveryPieces'] = shipmentData.readyForDelivery;
                newShipment['irregularityCode'] = shipmentData.cargoIrregularityCode;
                newShipment['dmgFlag'] = shipmentData.damagedPieces;
                newShipment['damagedPieces'] = shipmentData.damagedPieces ? shipmentData.damagedPieces : '';
                delete newShipment.readyForDelivery;
                if (shipmentData.cargoIrregularityCode) {
                  newShipment['irregularity'] = shipmentData.cargoIrregularityCode;
                }

                newShipment['specialHandlingCode'] = shipmentData.shcCode;
                newShipment['temp'] = shipmentData.shipmentNumber;
                newShipment['mnPieces'] = uldData.manifestedPiece;
                newShipment['mnWeight'] = uldData.manifestedWeight;
                newShipment['shipmenthargebleWeight'] = shipmentData.shipmenthargebleWeight;
                newShipment['manifestPieces'] = shipmentData.mnPieces;
                newShipment['manifestWeight'] = shipmentData.mnWeight;
                newShipment['shipmentInstruction'] = shipmentData.shipmentInstruction;
                newShipment['outBoundFlightKey'] = uldData.outboundFlight;

                //Show NOG for ULD 
                if (uldData.natureOfGoodsDescription) {
                  newShipment['natureOfGoodsDescription'] = uldData.natureOfGoodsDescription;
                } else {
                  newShipment['natureOfGoodsDescription'] = shipmentData.natureOfGoodsDescription;
                }

                delete newShipment.irregularity;
                newShipment['partSuffix'] = shipmentData.partSuffix;

                newShipment['handledByDOMINT'] = shipmentData.handledByDOMINT;
                newShipment['handledByMasterHouse'] = shipmentData.handledByMasterHouse;
                newShipment['currentLocation'] = shipmentData.currentLocation;
                newShipment['ffmLocation'] = shipmentData.ffmLocation;
                newShipment['view'] = "Manifested";

                newShipment['warehouseDestination'] = uldData.warehouseDestination;
                newShipment['uldLocation'] = uldData.uldLocation;
                newShipment['uldConfirmedDate'] = uldData.uldConfirmedDate;
                newShipment['eic'] = uldData.eic;
                newShipment['emptyFlag'] = uldData.emptyFlag;
                newShipment['uldCurrentStatus'] = uldData.uldCurrentStatus;
                newShipment['uldCondition'] = uldData.uldCondition;



                newShipment['shipmentHawbList'] = shipmentData.shipmentHawbList;
                this.segmentInformation.push(newShipment);
              }
            }
          }
        }
      }

      if (item.nilCargo) {
        let newShipment = {};
        newShipment['uldORawbNumber'] = null;
        newShipment['shipmentNumber'] = null;
        newShipment['cargoInULD'] = item.cargoInULD;
        newShipment['looseCargoCount'] = item.looseCargoCount;
        newShipment['segmentPieceCount'] = item.segmentPieceCount;
        newShipment['segmentWeight'] = NgcUtility.getDisplayWeight(item.segmentWeight);
        newShipment['flightBoardPoint'] = item.flightBoardPoint;
        newShipment['destination'] = null;
        newShipment['outBoundFlightKey'] = null;
        newShipment['origin'] = null;
        newShipment['handledByDOMINT'] = null;
        newShipment['handledByMasterHouse'] = null;
        newShipment['currentLocation'] = null;
        newShipment['ffmLocation'] = null;
        newShipment['mnPieces'] = null;
        newShipment['mnWeight'] = null;
        newShipment['natureOfGoodsDescription'] = null;
        newShipment['impArrivalManifestShipmentInfoId'] = null;
        newShipment['shipmentId'] = null;
        newShipment['bdPieces'] = null;
        newShipment['bdWeight'] = null;
        newShipment['readyForDelivery'] = null;
        newShipment['surplusFlag'] = null;
        newShipment['shipmentdate'] = null;
        newShipment['transferType'] = null;
        newShipment['instruction'] = null;
        newShipment['shipmentType'] = null;
        newShipment['shipmentTypeCopy'] = null;
        newShipment['temp'] = 'Nil Cargo';
        newShipment['manifestPieces'] = null;
        newShipment['manifestWeight'] = null;
        newShipment['specialHandlingCode'] = null;
        newShipment['deliveryPieces'] = null;
        newShipment['irregularityCode'] = null;
        newShipment['shipmentInstruction'] = '';
        newShipment['dmgFlag'] = null;
        newShipment['damagedPieces'] = null;
        newShipment['shipmentHawbList'] = null;
        newShipment['warehouseDestination'] = null;
        newShipment['eic'] = null;
        newShipment['uldLocation'] = null;
        newShipment['uldConfirmedDate'] = null;
        newShipment['emptyFlag'] = null;
        newShipment['uldCurrentStatus'] = null;
        newShipment['uldCondition'] = null;
        this.segmentInformation.push(newShipment);

        //consolidated View for nil cargo
        this.consolidateViewSegmentInformation.push(newShipment);
      }

    }

    //consolidated View
    for (let item of response.data.breakDownWorkingListSegment) {
      for (let shipmentData of item.breakDownWorkingListShipmentInfoModel) {
        shipmentData.bdPieces = shipmentData.bdPieces ? shipmentData.bdPieces : 0;
        shipmentData.bdWeight = shipmentData.bdWeight ? shipmentData.bdWeight : 0;
        shipmentData.irregularPieces = shipmentData.irregularPieces ? shipmentData.irregularPieces : 0;
        shipmentData.irregularWeight = shipmentData.irregularWeight ? shipmentData.irregularWeight : 0;
        shipmentData.cargoIrregularityCode = shipmentData.cargoIrregularityCode ? shipmentData.cargoIrregularityCode : '';
        shipmentData.origin = shipmentData.origin;
        shipmentData.mnPieces = shipmentData.mnPieces;
        shipmentData.mnWeight = shipmentData.mnWeight;
        let tempSHC = '';

        //consolidated View
        let newShipmentConsolidatedView = {};
        newShipmentConsolidatedView['uldORawbNumber'] = shipmentData.shipmentNumber;
        newShipmentConsolidatedView['shipmentNumber'] = shipmentData.shipmentNumber;
        newShipmentConsolidatedView['shipmentNumberCopy'] = shipmentData.shipmentNumber;
        newShipmentConsolidatedView['cargoInULD'] = item.cargoInULD;
        newShipmentConsolidatedView['looseCargoCount'] = item.looseCargoCount;
        newShipmentConsolidatedView['segmentPieceCount'] = item.segmentPieceCount;
        newShipmentConsolidatedView['segmentWeight'] = NgcUtility.getDisplayWeight(item.segmentWeight);
        newShipmentConsolidatedView['flightBoardPoint'] = item.flightBoardPoint;
        newShipmentConsolidatedView['destination'] = shipmentData.destination;
        newShipmentConsolidatedView['outBoundFlightKey'] = shipmentData.outboundFlightKey;
        newShipmentConsolidatedView['origin'] = shipmentData.origin;
        newShipmentConsolidatedView['mnPieces'] = shipmentData.mnPieces;
        newShipmentConsolidatedView['mnWeight'] = shipmentData.mnWeight;
        newShipmentConsolidatedView['awbPieces'] = shipmentData.awbPieces;
        newShipmentConsolidatedView['awbWeight'] = shipmentData.awbWeight;
        //Show NOG for ULD 
        for (let uldData of shipmentData.breakDownWorkingListULDDetails) {
          if (uldData.natureOfGoodsDescription) {
            newShipmentConsolidatedView['natureOfGoodsDescription'] = uldData.natureOfGoodsDescription;
          } else {
            newShipmentConsolidatedView['natureOfGoodsDescription'] = shipmentData.natureOfGoodsDescription;
          }
        }

        newShipmentConsolidatedView['impArrivalManifestShipmentInfoId'] = shipmentData.impArrivalManifestShipmentInfoId;
        newShipmentConsolidatedView['shipmentId'] = shipmentData.shipmentId;
        newShipmentConsolidatedView['bdPieces'] = shipmentData.bdPieces ? shipmentData.bdPieces : 0;
        newShipmentConsolidatedView['bdWeight'] = shipmentData.bdWeight ? shipmentData.bdWeight : 0;
        newShipmentConsolidatedView['readyForDelivery'] = shipmentData.readyForDelivery;
        newShipmentConsolidatedView['surplusFlag'] = shipmentData.surplusFlag;
        newShipmentConsolidatedView['shipmentdate'] = shipmentData.shipmentdate;
        newShipmentConsolidatedView['transferType'] = shipmentData.transferType;
        newShipmentConsolidatedView['irregularity'] = null;
        if (shipmentData.cargoIrregularityCode) {
          newShipmentConsolidatedView['irregularity'] = shipmentData.cargoIrregularityCode;
        }
        newShipmentConsolidatedView['instruction'] = shipmentData.shipmentInstruction;
        newShipmentConsolidatedView['shipmentType'] = 'Loose';
        newShipmentConsolidatedView['shipmentTypeCopy'] = shipmentData.shipmentType;
        newShipmentConsolidatedView['temp'] = 'Loose Shipment';
        newShipmentConsolidatedView['manifestPieces'] = shipmentData.mnPieces;
        newShipmentConsolidatedView['manifestWeight'] = shipmentData.mnWeight;
        newShipmentConsolidatedView['dmgFlag'] = shipmentData.damageInfoDetails;
        newShipmentConsolidatedView['damagedPieces'] = null;
        if (shipmentData.breakDownWorkingListSHC) {
          for (let shctempData of shipmentData.breakDownWorkingListSHC) {
            tempSHC = tempSHC + ' ' + shctempData.specialHandlingCode;
          }
        }
        newShipmentConsolidatedView['specialHandlingCode'] = shipmentData.shcCode;
        newShipmentConsolidatedView['deliveryPieces'] = null;
        newShipmentConsolidatedView['irregularityCode'] = shipmentData.cargoIrregularityCode;
        newShipmentConsolidatedView['shipmentInstruction'] = shipmentData.shipmentInstruction;
        newShipmentConsolidatedView['masterShcs'] = shipmentData.masterShcs;
        newShipmentConsolidatedView['partSuffix'] = shipmentData.partSuffix;

        newShipmentConsolidatedView['handledByDOMINT'] = shipmentData.handledByDOMINT;
        newShipmentConsolidatedView['handledByMasterHouse'] = shipmentData.handledByMasterHouse;
        newShipmentConsolidatedView['currentLocation'] = shipmentData.currentLocation;
        newShipmentConsolidatedView['ffmLocation'] = shipmentData.ffmLocation;
        newShipmentConsolidatedView['view'] = "Consolidated"
        newShipmentConsolidatedView['shipmentHawbList'] = shipmentData.shipmentHawbList;
        this.consolidateViewSegmentInformation.push(newShipmentConsolidatedView);

      }
    }

    (<NgcFormArray>this.bdWorkListForm.get('breakDownWorkingListShipmentResult')).patchValue(this.segmentInformation);
    (<NgcFormArray>this.bdWorkListForm.get('breakDownWorkingListShipmentResultConsolidatedView')).patchValue(this.consolidateViewSegmentInformation);
  }
  dataNullResponse() {

    this.bdWorkListForm.get('sta').patchValue("");
    this.bdWorkListForm.get('ata').patchValue("");
    this.bdWorkListForm.get('boardPoint').patchValue("");
    this.bdWorkListForm.get('aircraftType').patchValue("");
    this.bdWorkListForm.get('flightRemarks').patchValue("");
    this.bdWorkListForm.get('status').patchValue("");
    this.bdWorkListForm.get('firstTimeBreakDownCompletedAt').patchValue("");
    this.bdWorkListForm.get('flightCompletedDate').patchValue("");
    this.bdWorkListForm.controls['breakDownWorkingListShipmentResult'].patchValue(new Array());
    this.bdWorkListForm.controls['shipmentMismatchPieces'].patchValue(new Array());
    this.shipment = undefined;
  }

  updateFlightDelayForAllShipment() {
    let shipmentData: Array<BreakDownWorkingListShipmentResult>;
    if (this.bdWorkListForm.getRawValue().breakDownWorkingListShipmentResult.length > 0) {
      const item = this.bdWorkListForm.getRawValue().breakDownWorkingListShipmentResult;

      for (let index = item.length - 1; index >= 0; index--) {
        if (item[index].flagCRUD) {
          item[index]['flightId'] = this.flightId;
          item[index]['shipmentNumber'] = item[index].shipmentNumber != 'Loose Shipment' ? item[index].shipmentNumber : item[index].uldORawbNumber;
        } else {
          item.splice(index, 1);
        }
      }
      if (item.length > 0) {
        this.importService.updateFlightDelayForShipment(item).subscribe(() => {
          this.showSuccessStatus("updated.delay.for.all.shipments");
        });
      } else {
        this.showErrorMessage('select.shipment.to.update');
        return;
      }

    } else {
      this.showInfoStatus("no.shipment.found");
    }
  }

  public onSegmentChange(event) {
    let segment = "";
    this.viewBySegement = false;
    this.manifestedSelectedSegmentInformation = [];
    this.consolidateSelectedSegmentSeInformation = [];
    if (this.segmentDropDown != null && this.segmentDropDown.length > 0) {
      for (let item of this.segmentDropDown) {
        if (item.code == event) {
          segment = item.desc.substring(0, 3);
        }
      }
    }
    //initialize with empty list
    (<NgcFormArray>this.bdWorkListForm.get('breakDownWorkingListShipmentResultBySegment')).patchValue(this.manifestedSelectedSegmentInformation);
    (<NgcFormArray>this.bdWorkListForm.get('breakDownWorkingListShipmentResultConsolidatedViewBySegement')).patchValue(this.consolidateSelectedSegmentSeInformation);
    const manifestView = this.bdWorkListForm.getRawValue().breakDownWorkingListShipmentResult;
    const consolidatedView = this.bdWorkListForm.getRawValue().breakDownWorkingListShipmentResultConsolidatedView;
    if (event != null && event != '') {
      consolidatedView.forEach(element => {
        if (element.flightBoardPoint == segment) {
          this.consolidateSelectedSegmentSeInformation.push(element);
        }
      });

      manifestView.forEach(element => {
        if (element.flightBoardPoint == segment) {
          this.manifestedSelectedSegmentInformation.push(element);
        }
      });
      this.viewBySegement = true;
    } else {
      this.viewBySegement = false;
      (<NgcFormArray>this.bdWorkListForm.get('breakDownWorkingListShipmentResultBySegment')).patchValue(this.manifestedSelectedSegmentInformation);
      (<NgcFormArray>this.bdWorkListForm.get('breakDownWorkingListShipmentResultConsolidatedViewBySegement')).patchValue(this.consolidateSelectedSegmentSeInformation);
    }
    (<NgcFormArray>this.bdWorkListForm.get('breakDownWorkingListShipmentResultBySegment')).patchValue(this.manifestedSelectedSegmentInformation);
    (<NgcFormArray>this.bdWorkListForm.get('breakDownWorkingListShipmentResultConsolidatedViewBySegement')).patchValue(this.consolidateSelectedSegmentSeInformation);
  }

  showMisMatchPieces() {

    let weatherCondition = this.bdWorkListForm.get('weatherCondition').value;
    if (!weatherCondition) {
      this.showErrorMessage('choose.weather.condition');
      return;
    }
    const breakdownWorkingListModel: BreakdownWorkingListModel = new BreakdownWorkingListModel();
    breakdownWorkingListModel.flightId = this.flightId;
    breakdownWorkingListModel.flightRemarks = this.bdWorkListForm.get('weatherCondition').value;
    breakdownWorkingListModel.flightNumber = this.bdWorkListForm.get("flightNumber").value;
    breakdownWorkingListModel.flightDate = this.bdWorkListForm.get("flightDate").value;
    breakdownWorkingListModel.boardPoint = this.boardPoint;
    breakdownWorkingListModel.carrierCode = this.carrierCode;
    const item = this.bdWorkListForm.getRawValue().breakDownWorkingListShipmentResult;
    let notconfirmedUldList: any = null;
    for (let index = 0; index < item.length; index++) {

      let shipmentData: BreakDownWorkingListShipmentResult = new BreakDownWorkingListShipmentResult();
      shipmentData.shipmentNumber = item[index].shipmentNumber != 'Loose Shipment' ? item[index].shipmentNumber : item[index].uldORawbNumber;
      shipmentData.shipmentId = item[index].shipmentId;
      shipmentData.flightId = this.flightId;
      shipmentData.bdPieces = item[index].bdPieces;
      shipmentData.bdWeight = item[index].bdWeight;
      shipmentData.outgoingFlightid = item[index].outgoingFlightid;
      shipmentData.shipmentdate = item[index].shipmentdate;
      shipmentData.destination = item[index].destination;
      shipmentData.specialHandlingCode = item[index].specialHandlingCode;
      shipmentData.origin = item[index].origin;
      shipmentData.mnPieces = item[index].mnPieces;
      shipmentData.mnWeight = item[index].mnWeight;
      if (item[index].specialHandlingCode && item[index].specialHandlingCode.includes("EAP")) {
        shipmentData.isEAPExists = true;
      } else {
        shipmentData.isEAPExists = false;
      }
      if (item[index].specialHandlingCode && item[index].specialHandlingCode.includes("EAW")) {
        shipmentData.isEAWExists = true;
      } else {
        shipmentData.isEAWExists = false;
      }
      breakdownWorkingListModel.breakDownWorkingListShipmentResult.push(shipmentData);

      if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_UldCheckInToStorageConfirmationRequired)) {
        if (item[index].shipmentNumber != 'Loose Shipment' && item[index].uldORawbNumber && (item[index].uldConfirmedDate == null)) {
          if (notconfirmedUldList == null) {
            notconfirmedUldList = item[index].uldORawbNumber;
          } else {
            notconfirmedUldList = notconfirmedUldList + " ," + item[index].uldORawbNumber;
          }
        }

        if (notconfirmedUldList != null) {
          this.showErrorMessage("imp.highlighted.ulds");
          return;
        }
      }
    }
    this.resetFormMessages();
    this.importService.updateBreakdownComplete(breakdownWorkingListModel).subscribe((response) => {

      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus("g.completed.successfully");
        // If Carrier Code is LH or LX then trigger mail
        this.onLhSendFwb()
        this.openBDTab = false;
        this.reopenBDTab = true;
        this.getBeakDownList();
        this.onSendLHRCFNFDReport();
      }
    });

  }

  onSendLHRCFNFDReport() {
    let request: BreakdownWorkingListModel = new BreakdownWorkingListModel();
    request.flightId = this.flightId;
    request.flightNumber = this.bdWorkListForm.get('flightNumber').value;
    request.flightDate = this.bdWorkListForm.get("flightDate").value;
    request.carrierCode = this.carrierCode;

    if ((request.flightNumber.substring(0, 2) === 'LH') && (this.carrierCode === 'LH')) {
      this.importService.onSendLHRcfNfdReport(request).subscribe((response) => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus("rcf.mail.sent.successfully");
        }
      }, error => {
        this.showErrorStatus(error);
      });
    }
  }

  reopenBreakdown() {
    const breakdownWorkingListModel: BreakdownWorkingListModel = new BreakdownWorkingListModel();
    breakdownWorkingListModel.flightId = this.flightId;
    breakdownWorkingListModel.flightNumber = this.bdWorkListForm.get("flightNumber").value;
    breakdownWorkingListModel.flightDate = this.bdWorkListForm.get("flightDate").value;
    this.importService.updateReopenBreakdownComplete(breakdownWorkingListModel).subscribe(() => {
      this.openBDTab = true;
      this.reopenBDTab = false;
      this.showSuccessStatus("g.completed.successfully");
      this.getBeakDownList();
    });
  }



  shipmentFunction(task) {
    if (this.shipment != undefined && this.shipment.shipmentNumber != undefined) {
      let flightNumber = this.bdWorkListForm.get("flightNumber").value;
      let flightDate = this.bdWorkListForm.get("flightDate").value;
      let shipmentData, url;
      if (this.shipment.shipmentNumber == 'Loose Shipment') {
        this.shipment.shipmentNumber = this.shipment.uldORawbNumber;
      }
      switch (task) {
        case "HOLD":
          shipmentData = { "shipmentNumber": this.shipment.shipmentNumber, "flightNumber": flightNumber, "flightDate": flightDate };
          url = "/awbmgmt/shipmentonhold";
          break;

        case "REMARK":
          shipmentData = { "shipmentNumber": this.shipment.shipmentNumber, "flightNumber": flightNumber, "flightDate": flightDate };
          url = "/awbmgmt/maintainremarks";
          break;
        case "IRREGULARITY":
          shipmentData = { "shipmentNumber": this.shipment.shipmentNumber, "shipmentType": this.shipment.shipmentTypeCopy };
          // shipmentData = this.shipment.shipmentNumber;
          url = "/awbmgmt/irregularity";
          break;
        case "BREAKDOWN":
          shipmentData = { "shipmentNumber": this.shipment.shipmentNumber, "shipmentType": this.shipment.shipmentTypeCopy, "flightNumber": flightNumber, "flightDate": flightDate, "dataSyncSearch": this.dataSyncSearch, 'handledByMasterHouse': this.shipment.handledByMasterHouse };
          url = "/import/inbound-breakdown";
          break;
        case "Capture Break Down":
          shipmentData = { "flight": flightNumber, "flightDate": flightDate, "entityKey": this.shipment.shipmentNumber, "entityType": this.shipment.shipmentTypeCopy };
          url = "/common/capturedamageDesktop";
          break;
      }
      if (shipmentData != undefined)
        this.navigateTo(this.router, url, shipmentData);
    } else {
      this.showInfoStatus("import.info103");
    }
  }

  public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {

    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.uldORawbNumber) {
      switch (column) {

        case "mnPieces": cellsStyle.data = NgcUtility.getDisplayPieces(rowData.mnPieces) + "/" + NgcUtility.getDisplayWeight(rowData.mnWeight); break;
        case "awbPieces": cellsStyle.data = NgcUtility.getDisplayPieces(rowData.awbPieces) + "/" + NgcUtility.getDisplayWeight(rowData.awbWeight); break;
        //case "readyForDelivery": cellsStyle.data = rowData.readyForDelivery + "/" + rowData.mnPieces; break;
      }
    }
    return cellsStyle;
  };
  public breakdownPieceCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {

    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.uldORawbNumber) {
      cellsStyle.data = NgcUtility.getDisplayPieces(rowData.bdPieces) + "/" + NgcUtility.getDisplayWeight(rowData.bdWeight);
    }
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_UldCheckInToStorageConfirmationRequired)) {
      if (rowData.mnPieces != null && NgcUtility.getDisplayPieces(rowData.bdPieces) == NgcUtility.getDisplayPieces(rowData.mnPieces)) {
        cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
      }
    }
    return cellsStyle;
  };
  public uldConfirmDateCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_UldCheckInToStorageConfirmationRequired)) {
      let cellsStyle: CellsRendererStyle = new CellsRendererStyle();

      if (rowData.uldConfirmedDate === null && rowData.shipmentType == "ULD") {

        cellsStyle.className = CellsStyleClass.CRITICAL_RED;
      }

      return cellsStyle;
    }
  };
  onClickConfirmButton() {
    this.window.close();
    this.showInfoStatus("import.info104");
  }
  onClickCancelButton() {
    this.window.close();
  }

  onConsolidatedCheckBoxClick(event) {
    if (event.record.flagCRUD) {
      this.shipment = event.record;
      this.selectedShipmentsForGroupLocation.push(event.record);
    } else {
      let i = 0;
      this.selectedShipmentsForGroupLocation = [];
      let consolidatedView = (<NgcFormArray>this.bdWorkListForm.get('breakDownWorkingListShipmentResultConsolidatedView')).value;
      consolidatedView.forEach(element => {
        if (element.flagCRUD) {
          this.selectedShipmentsForGroupLocation.push(element);
        }
      })
    }
  }

  reSendSegregationReport() {
    const breakdownWorkingListModel: BreakdownWorkingListModel = new BreakdownWorkingListModel();
    breakdownWorkingListModel.flightId = this.flightId;
    breakdownWorkingListModel.flightRemarks = this.bdWorkListForm.get('weatherCondition').value;
    breakdownWorkingListModel.flightNumber = this.bdWorkListForm.get("flightNumber").value;
    breakdownWorkingListModel.flightDate = this.bdWorkListForm.get("flightDate").value;
    breakdownWorkingListModel.boardPoint = this.boardPoint;
    breakdownWorkingListModel.carrierCode = this.carrierCode;

    this.importService.resendSegregationReportEvent(breakdownWorkingListModel).subscribe((response) => {

      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus("report.sent.successfully");

      }
    });
  }


  onCheckBoxClick(event) {
    if (event.record.flagCRUD) {
      this.shipment = event.record;
    }
  }



  onClear() {
    this.bdWorkListForm.reset();
    this.bdWorkListForm.controls['breakDownWorkingListShipmentResult'].patchValue(new Array());
    this.bdWorkListForm.controls['shipmentMismatchPieces'].patchValue(new Array());
    this.shipment = undefined;
  }


  protected groupsRenderer = (value: any, rowData: any, level: any, groupData: any): any => {

    if (level == 1) {
      if (value != 'Loose Shipment' && value != 'Nil Cargo') {
        rowData.data.mnWeight = NgcUtility.getDisplayWeight(rowData.data.mnWeight);
        if (!rowData.data.deliveryPieces) {
          rowData.data.deliveryPieces = 0;
        }
        rowData.data.shipmentInstruction = rowData.data.shipmentInstruction ? rowData.data.shipmentInstruction : ' ';
        if (rowData.data.surplusFlag == "true" || rowData.data.surplusFlag == true) {
          return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + rowData.data.shipmentNumber + '-' + rowData.data.manifestPieces + '/' + '&nbsp;&nbsp;<font color="orange">Surplus:</font> ' + rowData.data.natureOfGoodsDescription + '&nbsp;&nbsp;Handling Instruction:' + rowData.data.shipmentInstruction + '&nbsp;&nbsp;Irregularity:' + rowData.data.irregularityCode + '&nbsp;&nbsp;Location Pieces:' + rowData.data.deliveryPieces + '&nbsp;&nbsp;Damaged pieces:' + rowData.data.damagedPieces;
        }
        return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + rowData.data.shipmentNumber + '-' + rowData.data.manifestPieces + '/' + rowData.data.manifestWeight + '&nbsp;&nbsp;Handling Instruction:' + rowData.data.shipmentInstruction + '&nbsp;&nbsp;Irregularity:' + rowData.data.irregularityCode + '&nbsp;&nbsp;Location Pieces:' + rowData.data.deliveryPieces + '&nbsp;&nbsp;Damaged Pieces:' + rowData.data.damagedPieces;
      } else {
        return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + value;
      }

    } else {
      if (rowData) {
        if (!rowData.data.cargoInULD) {
          rowData.data.cargoInULD = 0;
        }
        if (!rowData.data.looseCargoCount) {
          rowData.data.looseCargoCount = 0;
        }
        if (!rowData.data.segmentPieceCount) {
          rowData.data.segmentPieceCount = 0;
        }
        if (!rowData.data.segmentWeight) {
          rowData.data.breakULD = 0;
        }
        if (rowData) {
          if (rowData.data.view === 'Manifested') {
            return '&nbsp;' + value + '&nbsp;&nbsp;&nbsp;&nbsp;ULD -' + rowData.data.cargoInULD + '&nbsp;&nbsp;&nbsp;&nbsp;Loose Cargo-' + rowData.data.looseCargoCount + '&nbsp&nbsp;&nbsp;&nbsp;Pieces-'
              + rowData.data.segmentPieceCount + '&nbsp;&nbsp;&nbsp;&nbsp;Weight-' + rowData.data.segmentWeight;
          } else {
            return '&nbsp;' + value;
          }
        }
      }
    }



  }

  bindData(segments: BreakdownWorkingListModel) {
    this.segmentInformation = [];
    for (let segmentData of segments.breakDownWorkingListSegment) {
      for (let shipmentData of segmentData.breakDownWorkingListShipmentInfoModel) {
        let newShipment = Object.assign({}, shipmentData);
        newShipment['cargoInULD'] = segmentData['cargoInULD'];
        newShipment['looseCargoCount'] = segmentData['looseCargoCount'];
        newShipment['segmentPieceCount'] = segmentData['segmentPieceCount'];
        newShipment['segmentWeight'] = segmentData['segmentWeight'];
        newShipment['origin'] = segmentData['origin'];
        newShipment['mnPieces'] = segmentData['mnPieces'];
        newShipment['mnWeight'] = segmentData['mnWeight'];
        this.segmentInformation.push(newShipment);
      }
    }


    (<NgcFormArray>this.bdWorkListForm.get('breakDownWorkingListShipmentResult')).patchValue(this.segmentInformation);

  }

  public navigateToFDL() {
    let shipmentData = {
      flight: this.bdWorkListForm.get("flightNumber").value,
      flightDate: this.bdWorkListForm.get("flightDate").value
    };
    this.navigateTo(this.router, "/import/flightdiscrepancylist", shipmentData);
  }

  public navigateToBDSummary() {

    let shipmentData = {
      flightNumber: this.bdWorkListForm.get("flightNumber").value,
      flightDate: this.bdWorkListForm.get("flightDate").value
    };
    this.navigateTo(this.router, "/import/breakdownsummary", shipmentData);
  }

  public navigateToInBD() {

    let shipmentData = {
      flightNumber: this.bdWorkListForm.get("flightNumber").value,
      flightDate: this.bdWorkListForm.get("flightDate").value,
      dataSyncSearch: this.dataSyncSearch
    };
    this.navigateTo(this.router, "/import/inbound-breakdown", shipmentData);
  }

  public navigateToBDTracing() {

    let shipmentData = {
      flightNumber: this.bdWorkListForm.get("flightNumber").value,
      flightDate: this.bdWorkListForm.get("flightDate").value
    };
    this.navigateTo(this.router, "/import/breakDownTracing", shipmentData);
  }

  onLhSendFwb() {

    let request: FlightMail = new FlightMail();
    request.flightId = this.flightId + '';
    request.flightKey = this.bdWorkListForm.get('flightNumber').value;
    request.flightOriginDate = this.bdWorkListForm.get("flightDate").value; // this.departureTime
    request.carrierCode = this.carrierCode;
    request.flightType = 'import';

    if ((request.flightKey.substring(0, 2) === 'LH' || request.flightKey.substring(0, 2) === 'LX')
      && (this.carrierCode === 'LH' || this.carrierCode === 'LX')) {
      this.buildUpService.onLhSendFwb(request).subscribe((response) => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus("mail.sent.successfully");
        }
      }, error => {
        this.showErrorStatus(error);
      });

    } else {
      this.showErrorMessage('mail.triggered.only.for.LH.LX');
    }
  }

  groupLocation() {
    this.bdWorkListForm.get('changeLocation').reset();
    this.bdWorkListForm.get(['changeLocation', 'shipmentLocation']).setValue(null);
    let flightKey = this.bdWorkListForm.get("flightNumber").value
    this.getBDServiceProvider(flightKey.slice(2, flightKey.length), this.bdWorkListForm.get("flightDate").value, this.flightId);
    this.retrieveDropDownListRecords("BDSUMMARY_SERVICEPROVIDER", "query", this.breakDownServiceProvider).subscribe(data => {
      if (data.length == 1) {
        //this.serviceProviderLength = true;
      } else {
        //this.serviceProviderLength = false;
      }
    });

    let result = (<NgcFormArray>this.bdWorkListForm.get('breakDownWorkingListShipmentResult')).getRawValue();
    if (this.selectedShipmentsForGroupLocation.length > 0) {
      result.forEach(element => {
        this.selectedShipmentsForGroupLocation.forEach(selectedShipment => {
          if (element.shipmentNumberCopy === selectedShipment.shipmentNumberCopy) {
            element.flagCRUD = true;
          }
        })
      });
    }
    let array: any[] = [];
    result.forEach(element => {

      if (element.flagCRUD === true) {
        this.bdWorkListForm.get(['changeLocation', 'shipmentOrigin']).patchValue(element.origin);
        this.bdWorkListForm.get(['changeLocation', 'shipmentDestination']).patchValue(element.destination);

        if (element.shipmentType == 'Loose' && ((element.deliveryPieces == null || element.deliveryPieces == 0)
          && (element.readyForDelivery == null || element.readyForDelivery == 0))) {
          element.shipmentNumber = element.uldORawbNumber
          element.awbPieces = element.awbPieces;
          element.awbWeight = element.awbWeight;
          array.push(element);
        } else if (element.shipmentType == 'ULD' && (element.deliveryPieces == null || element.deliveryPieces == 0)) {
          if (array.length > 0) {
            let elementNotExisted = false;
            let elementExisted = false;
            array.forEach(contains => {
              if (contains.shipmentNumberCopy != element.shipmentNumberCopy && !elementExisted) {
                elementNotExisted = true;
              } else {
                elementExisted = true;
              }
            });
            if (elementNotExisted && !elementExisted) {
              array.push(element);
            }
          } else {
            array.push(element);
          }
        }
      }
    });
    if (array != null && array.length <= 0) {
      this.showInfoStatus('import.info105');
      return;
    }
    console.log(array);
    this.bdWorkListForm.get(['changeLocation', 'shipmentList']).patchValue(array);
    this.addLocation.open();
  }

  getBDServiceProvider(flightkey, flightDate, flightid) {
    if (flightkey && flightDate && flightid) {
      this.breakDownServiceProvider = this.createSourceParameter(flightkey, this.bdWorkListForm.get('flightNumber').value, 'BREAKDOWN', flightid, null, null);
    }
  }

  saveLocationForMultipleShipments(event) {

    if (this.bdWorkListForm.get('changeLocation').invalid) {
      this.showErrorMessage("shipmentlocaiton.invalid")
      return;
    }
    let userProfileData = this.getUserProfile();
    let rawData = (<NgcFormArray>this.bdWorkListForm.get(['changeLocation', 'shipmentList'])).getRawValue();

    const breakDownModelList = Array<InboundBreakdownModel>();
    //let houseData = new InboundBreakdownShipmentHouseModel();
    this.inventoryPieceCount = 0;
    let formControlData = this.bdWorkListForm.get('changeLocation').value;
    if (formControlData.shipmentLocation === null && formControlData.warehouseLocation === null) {
      this.showErrorMessage("enter.shipmentlocation");
      return;
    }

    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.requestModelDataForCreatingGroupLocationForHAWBHadling(rawData, userProfileData, breakDownModelList);
    } else {
      this.requestModelDataForCreatingGroupLocation(rawData, userProfileData, breakDownModelList);
    }
    console.log(breakDownModelList);
    this.importService.createListData(breakDownModelList).subscribe((response) => {
      if (response.messageList) {
        this.showErrorStatus("error.import.breakdown.not.completed.update.location");
        return;
      }
      if (!this.showResponseErrorMessages(response)) {
        if (response.data) {
          this.selectedShipmentsForGroupLocation = [];
          response.data = response.data.shipment;
          this.showSuccessStatus('g.completed.successfully');
          this.addLocation.close();
          this.getBeakDownList();
        }
      }
    });

  }

  closeGroupLocation() {
    this.getBeakDownList();
  }

  private requestModelDataForCreatingGroupLocation(rawData: any[], userProfileData, breakDownModelList: InboundBreakdownModel[]) {
    rawData.forEach(element => {
      let breakDownModel = new InboundBreakdownModel();
      breakDownModel.shipment.shipmentNumber = element.shipmentNumber;
      breakDownModel.shipment.shipmentType = 'AWB';
      breakDownModel.flightId = this.flightId;
      breakDownModel.boardingPoint = element.origin;
      breakDownModel.shipment.flightId = this.flightId;
      breakDownModel.flightNumber = this.bdWorkListForm.get('flightNumber').value;
      breakDownModel.flightDate = this.bdWorkListForm.get('flightDate').value;
      breakDownModel.shipment.breakdownStaffGroup = this.bdWorkListForm.get(['changeLocation', 'bdstaffGroups']).value;
      breakDownModel.shipment.origin = element.origin;
      breakDownModel.shipment.destination = element.destination;
      breakDownModel.shipment.piece = element.awbPieces;
      breakDownModel.shipment.weight = element.awbWeight;
      breakDownModel.shipment.manifestPieces = Number(element.manifestPieces);
      breakDownModel.shipment.manifestWeight = Number(element.manifestWeight);
      breakDownModel.shipment.breakDownPieces = Number(element.bdPieces);
      breakDownModel.shipment.breakDownWeight = Number(element.bdWeight);
      breakDownModel.shipment.flagCRUD = 'C';
      breakDownModel.shipment.shcs = element.masterShcs;
      breakDownModel.shipment.natureOfGoodsDescription = element.natureOfGoodsDescription;
      //required only for RCF need to set these values also 
      this.splitIrregulartyCode(breakDownModel, element);

      if (element.shipmentType == 'Loose') {
        let inventoryData = new InboundBreakdownShipmentInventoryModel();
        //------------flag conditions to not allow duplicate record insertion for Service side----------------------
        inventoryData.deliveryOrderNo = null;
        inventoryData.throughTransit = false;
        inventoryData.assignedUldTrolley = null;
        inventoryData.loaded = 0;
        inventoryData.deliveryRequestOrderNo = null;
        inventoryData.isDeliveryInitiated = null;
        //------------------------------------------end-----------------------------------------------
        inventoryData.pieces = element.manifestPieces;
        inventoryData.weight = element.manifestWeight;
        inventoryData.shipmentLocation = this.bdWorkListForm.get(['changeLocation', 'shipmentLocation']).value;
        inventoryData.warehouseLocation = this.bdWorkListForm.get(['changeLocation', 'warehouseLocation']).value;
        inventoryData.uldNumber = 'Bulk';

        inventoryData.warehouseHandlingInstruction = null;
        inventoryData.handlingMode = 'BREAK';
        inventoryData.handlingArea = userProfileData.terminalId;
        inventoryData.transferType = null;
        inventoryData.flightId = breakDownModel.flightId;
        inventoryData.flagCRUD = 'C';
        inventoryData.inventoryId = 0;
        inventoryData.isDeliveryInitiated = 0;
        inventoryData.shc = element.masterShcs;
        inventoryData.manifestPieces = Number(element.manifestPieces) ? Number(element.manifestPieces) : 0;
        inventoryData.manifestWeight = Number(element.manifestWeight) ? Number(element.manifestWeight) : 0.0;
        inventoryData.isGroupLocation = true;
        inventoryData.partSuffix = element.partSuffix;
        breakDownModel.shipment.inventory.push(inventoryData);
      }
      if (element.shipmentType == 'ULD') {
        if (element.breakDownWorkingListULDDetails != null) {
          for (let item = 0; item < element.breakDownWorkingListULDDetails.length; item++) {

            let inventoryData = new InboundBreakdownShipmentInventoryModel();
            //------------flag conditions to not allow duplicate record insertion for service side----------------------
            inventoryData.deliveryOrderNo = null;
            inventoryData.throughTransit = false;
            inventoryData.assignedUldTrolley = null;
            inventoryData.loaded = 0;
            inventoryData.deliveryRequestOrderNo = null;
            inventoryData.isDeliveryInitiated = null;
            inventoryData.inventoryId = null;
            //----------------------------------------end-------------------------------------------------
            inventoryData.flightId = breakDownModel.flightId;
            inventoryData.pieces = Number(element.breakDownWorkingListULDDetails[item].manifestedPiece);
            inventoryData.weight = Number(element.breakDownWorkingListULDDetails[item].manifestedWeight);
            inventoryData.shipmentLocation = this.bdWorkListForm.get(['changeLocation', 'shipmentLocation']).value;
            inventoryData.warehouseLocation = this.bdWorkListForm.get(['changeLocation', 'warehouseLocation']).value;
            inventoryData.uldNumber = element.breakDownWorkingListULDDetails[item].uldNumber;
            inventoryData.warehouseHandlingInstruction = null;
            inventoryData.handlingMode = 'NO BREAK';
            inventoryData.handlingArea = userProfileData.terminalId;
            inventoryData.transferType = null;
            inventoryData.flagCRUD = 'C';
            inventoryData.shc = element.masterShcs;
            inventoryData.manifestPieces = Number(element.breakDownWorkingListULDDetails[item].manifestedPiece) ? Number(element.breakDownWorkingListULDDetails[item].manifestedPiece) : 0;
            inventoryData.manifestWeight = Number(element.breakDownWorkingListULDDetails[item].manifestedWeight) ? Number(element.breakDownWorkingListULDDetails[item].manifestedWeight) : 0.0;
            inventoryData.isGroupLocation = true;
            inventoryData.partSuffix = element.partSuffix;
            breakDownModel.shipment.inventory.push(inventoryData);

          }
        }
      }
      breakDownModelList.push(breakDownModel);
    });
  }

  private requestModelDataForCreatingGroupLocationForHAWBHadling(rawData: any[], userProfileData, breakDownModelList: InboundBreakdownModel[]) {
    rawData.forEach(element => {

      //Handeled By House
      if (element.handledByMasterHouse === 'H') {

        if (element.shipmentType == 'Loose') {

          for (let item = 0; item < element.shipmentHawbList.length; item++) {

            let breakDownModel = new InboundBreakdownModel();
            breakDownModel.shipment.shipmentNumber = element.shipmentNumber;
            breakDownModel.shipment.shipmentType = 'AWB';
            breakDownModel.flightId = this.flightId;
            breakDownModel.boardingPoint = element.origin;
            breakDownModel.shipment.flightId = this.flightId;
            breakDownModel.flightNumber = this.bdWorkListForm.get('flightNumber').value;
            breakDownModel.flightDate = this.bdWorkListForm.get('flightDate').value;
            breakDownModel.shipment.breakdownStaffGroup = this.bdWorkListForm.get(['changeLocation', 'bdstaffGroups']).value;
            breakDownModel.shipment.origin = element.origin;
            breakDownModel.shipment.destination = element.destination;
            breakDownModel.shipment.piece = element.awbPieces;
            breakDownModel.shipment.weight = element.awbWeight;
            breakDownModel.shipment.manifestPieces = Number(element.manifestPieces);
            breakDownModel.shipment.manifestWeight = Number(element.manifestWeight);
            breakDownModel.shipment.breakDownPieces = Number(element.bdPieces);
            breakDownModel.shipment.breakDownWeight = Number(element.bdWeight);
            breakDownModel.shipment.flagCRUD = 'C';
            breakDownModel.shipment.shcs = element.masterShcs;
            breakDownModel.shipment.natureOfGoodsDescription = element.natureOfGoodsDescription;

            breakDownModel.hawbInfo.hawbNumber = element.shipmentHawbList[item].hawbNumber;
            breakDownModel.hawbInfo.shipmentHouseId = element.shipmentHawbList[item].shipmentHouseId;
            //required only for RCF need to set these values also 
            this.splitIrregulartyCode(breakDownModel, element);

            let inventoryData = new InboundBreakdownShipmentInventoryModel();
            //------------flag conditions to not allow duplicate record insertion for Service side----------------------
            inventoryData.deliveryOrderNo = null;
            inventoryData.throughTransit = false;
            inventoryData.assignedUldTrolley = null;
            inventoryData.loaded = 0;
            inventoryData.deliveryRequestOrderNo = null;
            inventoryData.isDeliveryInitiated = null;
            //------------------------------------------end-----------------------------------------------

            inventoryData.pieces = Number(element.shipmentHawbList[item].hawbPieces) ? Number(element.shipmentHawbList[item].hawbPieces) : 0;
            inventoryData.weight = Number(element.shipmentHawbList[item].hawbWeight) ? Number(element.shipmentHawbList[item].hawbWeight) : 0.0;
            inventoryData.chargeableWeight = Number(element.shipmentHawbList[item].hawbChargebleWeight) ? Number(element.shipmentHawbList[item].hawbChargebleWeight) : 0.0;
            inventoryData.shipmentHouseAWBId = element.shipmentHawbList[item].shipmentHouseId;


            inventoryData.shipmentLocation = this.bdWorkListForm.get(['changeLocation', 'shipmentLocation']).value;
            inventoryData.warehouseLocation = this.bdWorkListForm.get(['changeLocation', 'warehouseLocation']).value;
            inventoryData.uldNumber = 'Bulk';

            inventoryData.warehouseHandlingInstruction = null;
            inventoryData.handlingMode = 'BREAK';
            inventoryData.handlingArea = userProfileData.terminalId;
            inventoryData.transferType = null;
            inventoryData.flightId = breakDownModel.flightId;
            inventoryData.flagCRUD = 'C';
            inventoryData.inventoryId = 0;
            inventoryData.isDeliveryInitiated = 0;
            inventoryData.shc = element.masterShcs;
            inventoryData.manifestPieces = Number(element.manifestPieces) ? Number(element.manifestPieces) : 0;
            inventoryData.manifestWeight = Number(element.manifestWeight) ? Number(element.manifestWeight) : 0.0;
            inventoryData.isGroupLocation = true;
            inventoryData.partSuffix = element.partSuffix;

            breakDownModel.shipment.inventory.push(inventoryData);
            breakDownModelList.push(breakDownModel);
          }
        }
        if (element.shipmentType == 'ULD') {
          if (element.breakDownWorkingListULDDetails != null && element.breakDownWorkingListULDDetails.length == 1) {
            for (let item = 0; item < element.shipmentHawbList.length; item++) {

              let breakDownModel = new InboundBreakdownModel();
              breakDownModel.shipment.shipmentNumber = element.shipmentNumber;
              breakDownModel.shipment.shipmentType = 'AWB';
              breakDownModel.flightId = this.flightId;
              breakDownModel.boardingPoint = element.origin;
              breakDownModel.shipment.flightId = this.flightId;
              breakDownModel.flightNumber = this.bdWorkListForm.get('flightNumber').value;
              breakDownModel.flightDate = this.bdWorkListForm.get('flightDate').value;
              breakDownModel.shipment.breakdownStaffGroup = this.bdWorkListForm.get(['changeLocation', 'bdstaffGroups']).value;
              breakDownModel.shipment.origin = element.origin;
              breakDownModel.shipment.destination = element.destination;
              breakDownModel.shipment.piece = element.awbPieces;
              breakDownModel.shipment.weight = element.awbWeight;
              breakDownModel.shipment.manifestPieces = Number(element.manifestPieces);
              breakDownModel.shipment.manifestWeight = Number(element.manifestWeight);
              breakDownModel.shipment.breakDownPieces = Number(element.bdPieces);
              breakDownModel.shipment.breakDownWeight = Number(element.bdWeight);
              breakDownModel.shipment.flagCRUD = 'C';
              breakDownModel.shipment.shcs = element.masterShcs;
              breakDownModel.shipment.natureOfGoodsDescription = element.natureOfGoodsDescription;

              breakDownModel.hawbInfo.hawbNumber = element.shipmentHawbList[item].hawbNumber;
              breakDownModel.hawbInfo.shipmentHouseId = element.shipmentHawbList[item].shipmentHouseId;

              let inventoryData = new InboundBreakdownShipmentInventoryModel();
              //------------flag conditions to not allow duplicate record insertion for service side----------------------
              inventoryData.deliveryOrderNo = null;
              inventoryData.throughTransit = false;
              inventoryData.assignedUldTrolley = null;
              inventoryData.loaded = 0;
              inventoryData.deliveryRequestOrderNo = null;
              inventoryData.isDeliveryInitiated = null;
              inventoryData.inventoryId = null;
              //----------------------------------------end-------------------------------------------------
              inventoryData.flightId = breakDownModel.flightId;

              inventoryData.pieces = Number(element.shipmentHawbList[item].hawbPieces);
              inventoryData.weight = Number(element.shipmentHawbList[item].hawbWeight);
              inventoryData.chargeableWeight = Number(element.shipmentHawbList[item].hawbChargebleWeight);
              inventoryData.shipmentHouseAWBId = element.shipmentHawbList[item].shipmentHouseId;

              inventoryData.shipmentLocation = this.bdWorkListForm.get(['changeLocation', 'shipmentLocation']).value;
              inventoryData.warehouseLocation = this.bdWorkListForm.get(['changeLocation', 'warehouseLocation']).value;
              inventoryData.uldNumber = element.breakDownWorkingListULDDetails[0].uldNumber;
              inventoryData.warehouseHandlingInstruction = null;
              inventoryData.handlingMode = 'NO BREAK';
              inventoryData.handlingArea = userProfileData.terminalId;
              inventoryData.transferType = null;
              inventoryData.flagCRUD = 'C';
              inventoryData.shc = element.masterShcs;
              inventoryData.manifestPieces = Number(element.manifestPieces) ? Number(element.manifestPieces) : 0;
              inventoryData.manifestWeight = Number(element.manifestWeight) ? Number(element.manifestWeight) : 0.0;
              inventoryData.isGroupLocation = true;
              inventoryData.partSuffix = element.partSuffix;
              breakDownModel.shipment.inventory.push(inventoryData);
              breakDownModelList.push(breakDownModel);
            }

          } else {
            for (let item = 0; item < element.shipmentHawbList.length; item++) {
              let breakDownModel = new InboundBreakdownModel();
              breakDownModel.shipment.shipmentNumber = element.shipmentNumber;
              breakDownModel.shipment.shipmentType = 'AWB';
              breakDownModel.flightId = this.flightId;
              breakDownModel.boardingPoint = element.origin;
              breakDownModel.shipment.flightId = this.flightId;
              breakDownModel.flightNumber = this.bdWorkListForm.get('flightNumber').value;
              breakDownModel.flightDate = this.bdWorkListForm.get('flightDate').value;
              breakDownModel.shipment.breakdownStaffGroup = this.bdWorkListForm.get(['changeLocation', 'bdstaffGroups']).value;
              breakDownModel.shipment.origin = element.origin;
              breakDownModel.shipment.destination = element.destination;
              breakDownModel.shipment.piece = element.awbPieces;
              breakDownModel.shipment.weight = element.awbWeight;
              breakDownModel.shipment.manifestPieces = Number(element.manifestPieces);
              breakDownModel.shipment.manifestWeight = Number(element.manifestWeight);
              breakDownModel.shipment.breakDownPieces = Number(element.bdPieces);
              breakDownModel.shipment.breakDownWeight = Number(element.bdWeight);
              breakDownModel.shipment.flagCRUD = 'C';
              breakDownModel.shipment.shcs = element.masterShcs;
              breakDownModel.shipment.natureOfGoodsDescription = element.natureOfGoodsDescription;

              breakDownModel.hawbInfo.hawbNumber = element.shipmentHawbList[item].hawbNumber;
              breakDownModel.hawbInfo.shipmentHouseId = element.shipmentHawbList[item].shipmentHouseId;

              let inventoryData = new InboundBreakdownShipmentInventoryModel();
              //------------flag conditions to not allow duplicate record insertion for service side----------------------
              inventoryData.deliveryOrderNo = null;
              inventoryData.throughTransit = false;
              inventoryData.assignedUldTrolley = null;
              inventoryData.loaded = 0;
              inventoryData.deliveryRequestOrderNo = null;
              inventoryData.isDeliveryInitiated = null;
              inventoryData.inventoryId = null;
              //----------------------------------------end-------------------------------------------------
              inventoryData.flightId = breakDownModel.flightId;

              inventoryData.pieces = Number(element.shipmentHawbList[item].hawbPieces);
              inventoryData.weight = Number(element.shipmentHawbList[item].hawbWeight);
              inventoryData.chargeableWeight = Number(element.shipmentHawbList[item].chawbWeight);
              inventoryData.shipmentHouseAWBId = element.shipmentHawbList[item].shipmentHouseId;

              inventoryData.shipmentLocation = this.bdWorkListForm.get(['changeLocation', 'shipmentLocation']).value;
              inventoryData.warehouseLocation = this.bdWorkListForm.get(['changeLocation', 'warehouseLocation']).value;
              inventoryData.uldNumber = 'Bulk';
              inventoryData.warehouseHandlingInstruction = null;
              inventoryData.handlingMode = 'BREAK';
              inventoryData.handlingArea = userProfileData.terminalId;
              inventoryData.transferType = null;
              inventoryData.flagCRUD = 'C';
              inventoryData.shc = element.masterShcs;
              inventoryData.manifestPieces = Number(element.manifestPieces) ? Number(element.manifestPieces) : 0;
              inventoryData.manifestWeight = Number(element.manifestWeight) ? Number(element.manifestWeight) : 0.0;
              inventoryData.isGroupLocation = true;
              inventoryData.partSuffix = element.partSuffix;
              breakDownModel.shipment.inventory.push(inventoryData);
              breakDownModelList.push(breakDownModel);
            }
          }
        }

      } else {
        //handeled by master 
        let breakDownModel = new InboundBreakdownModel();
        breakDownModel.shipment.shipmentNumber = element.shipmentNumber;
        breakDownModel.shipment.shipmentType = 'AWB';
        breakDownModel.flightId = this.flightId;
        breakDownModel.boardingPoint = element.origin;
        breakDownModel.shipment.flightId = this.flightId;
        breakDownModel.flightNumber = this.bdWorkListForm.get('flightNumber').value;
        breakDownModel.flightDate = this.bdWorkListForm.get('flightDate').value;
        breakDownModel.shipment.breakdownStaffGroup = this.bdWorkListForm.get(['changeLocation', 'bdstaffGroups']).value;
        breakDownModel.shipment.origin = element.origin;
        breakDownModel.shipment.destination = element.destination;
        breakDownModel.shipment.piece = element.awbPieces;
        breakDownModel.shipment.weight = element.awbWeight;
        breakDownModel.shipment.manifestPieces = Number(element.manifestPieces);
        breakDownModel.shipment.manifestWeight = Number(element.manifestWeight);
        breakDownModel.shipment.breakDownPieces = Number(element.bdPieces);
        breakDownModel.shipment.breakDownWeight = Number(element.bdWeight);
        breakDownModel.shipment.flagCRUD = 'C';
        breakDownModel.shipment.shcs = element.masterShcs;
        breakDownModel.shipment.natureOfGoodsDescription = element.natureOfGoodsDescription;

        if (element.shipmentType == 'Loose') {
          let inventoryData = new InboundBreakdownShipmentInventoryModel();
          //------------flag conditions to not allow duplicate record insertion for Service side----------------------
          inventoryData.deliveryOrderNo = null;
          inventoryData.throughTransit = false;
          inventoryData.assignedUldTrolley = null;
          inventoryData.loaded = 0;
          inventoryData.deliveryRequestOrderNo = null;
          inventoryData.isDeliveryInitiated = null;
          //------------------------------------------end-----------------------------------------------

          inventoryData.pieces = Number(element.manifestPieces) ? Number(element.manifestPieces) : 0;
          inventoryData.weight = Number(element.manifestWeight) ? Number(element.manifestWeight) : 0.0;
          inventoryData.chargeableWeight = Number(element.shipmenthargebleWeight) ? Number(element.shipmenthargebleWeight) : 0.0;


          inventoryData.shipmentLocation = this.bdWorkListForm.get(['changeLocation', 'shipmentLocation']).value;
          inventoryData.warehouseLocation = this.bdWorkListForm.get(['changeLocation', 'warehouseLocation']).value;
          inventoryData.uldNumber = 'Bulk';

          inventoryData.warehouseHandlingInstruction = null;
          inventoryData.handlingMode = 'BREAK';
          inventoryData.handlingArea = userProfileData.terminalId;
          inventoryData.transferType = null;
          inventoryData.flightId = breakDownModel.flightId;
          inventoryData.flagCRUD = 'C';
          inventoryData.inventoryId = 0;
          inventoryData.isDeliveryInitiated = 0;
          inventoryData.shc = element.masterShcs;
          inventoryData.manifestPieces = Number(element.manifestPieces) ? Number(element.manifestPieces) : 0;
          inventoryData.manifestWeight = Number(element.manifestWeight) ? Number(element.manifestWeight) : 0.0;
          inventoryData.isGroupLocation = true;
          inventoryData.partSuffix = element.partSuffix;

          breakDownModel.shipment.inventory.push(inventoryData);

        }
        if (element.shipmentType == 'ULD') {
          if (element.breakDownWorkingListULDDetails != null) {
            for (let item = 0; item < element.breakDownWorkingListULDDetails.length; item++) {

              let inventoryData = new InboundBreakdownShipmentInventoryModel();
              //------------flag conditions to not allow duplicate record insertion for service side----------------------
              inventoryData.deliveryOrderNo = null;
              inventoryData.throughTransit = false;
              inventoryData.assignedUldTrolley = null;
              inventoryData.loaded = 0;
              inventoryData.deliveryRequestOrderNo = null;
              inventoryData.isDeliveryInitiated = null;
              inventoryData.inventoryId = null;
              //----------------------------------------end-------------------------------------------------
              inventoryData.flightId = breakDownModel.flightId;
              inventoryData.pieces = Number(element.breakDownWorkingListULDDetails[item].manifestedPiece);
              inventoryData.weight = Number(element.breakDownWorkingListULDDetails[item].manifestedWeight);
              inventoryData.chargeableWeight = Number(element.shipmenthargebleWeight);

              inventoryData.shipmentLocation = this.bdWorkListForm.get(['changeLocation', 'shipmentLocation']).value;
              inventoryData.warehouseLocation = this.bdWorkListForm.get(['changeLocation', 'warehouseLocation']).value;
              inventoryData.uldNumber = element.breakDownWorkingListULDDetails[item].uldNumber;
              inventoryData.warehouseHandlingInstruction = null;
              inventoryData.handlingMode = 'NO BREAK';
              inventoryData.handlingArea = userProfileData.terminalId;
              inventoryData.transferType = null;
              inventoryData.flagCRUD = 'C';
              inventoryData.shc = element.masterShcs;
              inventoryData.manifestPieces = Number(element.breakDownWorkingListULDDetails[item].manifestedPiece) ? Number(element.breakDownWorkingListULDDetails[item].manifestedPiece) : 0;
              inventoryData.manifestWeight = Number(element.breakDownWorkingListULDDetails[item].manifestedWeight) ? Number(element.breakDownWorkingListULDDetails[item].manifestedWeight) : 0.0;
              inventoryData.isGroupLocation = true;
              inventoryData.partSuffix = element.partSuffix;
              breakDownModel.shipment.inventory.push(inventoryData);
            }
          }

        }
        breakDownModelList.push(breakDownModel);
      }
    });
  }

  onChangeFlight() {
    this.dataSyncSearch = 0;
  }

  splitIrregulartyCode(breakDownModel, element) {
    let splitIrregularity = []
    if (element.irregularityCode !== null && element.irregularityCode != '') {
      splitIrregularity = element.irregularityCode.split(' ');
      let irregularityPiecesAndCode = []
      splitIrregularity.forEach(element => {
        irregularityPiecesAndCode = element.split("(");
        if (irregularityPiecesAndCode[0] == 'FDCA') {
          breakDownModel.shipment.irregularityPiecesFound = Number(irregularityPiecesAndCode[1].split(')')[0]);
        } else if (irregularityPiecesAndCode[0] == 'MSCA') {
          breakDownModel.shipment.irregularityPiecesMissing = Number(irregularityPiecesAndCode[1].split(')')[0]);
        }
      });
    }
  }

  /**
   * On Tab Select
   */

  public onPrint() {
    const reportParameters: any = {};
    this.reportParameters = new Object();
    this.reportParameters.flightkey = this.bdWorkListForm.get("flightNumber").value;
    this.reportParameters.flightorigindate = this.bdWorkListForm.get("flightDate").value;
    this.reportParameters.breakdownPending = this.bdWorkListForm.get("breakdownPending").value ? 1 : 0;
    this.reportParameters.flightId = this.flightId;
    this.reportParameters.offPoint = NgcUtility.getTenantConfiguration().airportCode;
    this.reportParameters.customerId = this.getUserProfile().userLoginCode;

    this.reportParameters.transhipmentULDsManifested = this.bdWorkListForm.get("flightLevelCount.transhipmentULDsManifested").value;
    this.reportParameters.localULDsManifested = this.bdWorkListForm.get("flightLevelCount.localULDsManifested").value;
    this.reportParameters.totalULDsManifested = this.bdWorkListForm.get("flightLevelCount.totalULDsManifested").value;

    this.reportParameters.transhipmentULDsBDcomplete = this.bdWorkListForm.get("flightLevelCount.transhipmentULDsBDcomplete").value;
    this.reportParameters.localULDsBDcomplete = this.bdWorkListForm.get("flightLevelCount.localULDsBDcomplete").value;
    this.reportParameters.totalULDsBDcomplete = this.bdWorkListForm.get("flightLevelCount.totalULDsBDcomplete").value;

    this.reportParameters.transhipmentLooseManifested = this.bdWorkListForm.get("flightLevelCount.transhipmentLooseManifested").value;
    this.reportParameters.localLooseManifested = this.bdWorkListForm.get("flightLevelCount.localLooseManifested").value;
    this.reportParameters.totalLooseManifested = this.bdWorkListForm.get("flightLevelCount.totalLooseManifested").value;

    this.reportParameters.transhipmentLooseBDcomplete = this.bdWorkListForm.get("flightLevelCount.transhipmentLooseBDcomplete").value;
    this.reportParameters.localLooseBDcomplete = this.bdWorkListForm.get("flightLevelCount.localLooseBDcomplete").value;
    this.reportParameters.totalLooseBDcomplete = this.bdWorkListForm.get("flightLevelCount.totalLooseBDcomplete").value;

    this.reportWindow.open();

  }


  public onTabSelect(event) {
    if (event.index > -1) {
      // (this.bdWorkListForm.get('breakDownWorkingListShipmentResultConsolidatedView') as NgcFormArray).controls.forEach((formGroup: NgcFormGroup) => {
      //   formGroup.get('flagCRUD').setValue(false);
      // });
      // (this.bdWorkListForm.get('breakDownWorkingListShipmentResult') as NgcFormArray).controls.forEach((formGroup: NgcFormGroup) => {
      //   formGroup.get('flagCRUD').setValue(false);
      // });
    }
  }
  onCancel(event) {
    this.navigateBack(this.routedInformation);
  }


  onLinkClick($event) {
    // console.log(accessory);
    this.inputData = {
      flightKey: this.bdWorkListForm.get('flightNumber').value,
      flightDate: this.bdWorkListForm.get(['flightDate']).value,
      uldNumber: this.uldNumber,
      modeType: 'IMPORT'
    };
    this.accessoryPopUp.open();

  }

}
