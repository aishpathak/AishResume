import { ApplicationFeatures } from './../../common/applicationfeatures';
import { ApplicationEntities } from './../../common/applicationentities';
import { ValidatorFn } from "@angular/forms";
//import { dimensionData./../.sharedmodel, OciData./../.sharedmodel, ShcData } from './../import.sharedmodel';
import { NgcFormControl, NgcUtility, NgcReportComponent, ReactiveModel } from "ngc-framework";
import { ImportService } from "./../import.service";
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcWindowComponent,
  PageConfiguration
} from "ngc-framework";
import {
  ArrivalManifestFlight,
  SegmentData,
  UldModel,
  ShipmentModel,
  DimensionData,
  OciData,
  ConsignmentMovementData,
  OtherServicesInformation,
  ShcData,
  ArrivalManifestData
} from "../import.sharedmodel";
import { Router, ActivatedRoute } from "@angular/router";
import { listLazyRoutes } from "@angular/compiler/src/aot/lazy_routes";


@Component({
  selector: "app-arrivalmanifest",
  templateUrl: "./arrivalmanifest.component.html",
  styleUrls: ["./arrivalmanifest.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: false,
  dontRestoreOnBrowserBack: false
})
export class ArrivalmanifestComponent extends NgcPage {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('looseReport') looseReport: NgcReportComponent;
  @ViewChild('uldReport') uldReport: NgcReportComponent;
  @ViewChild('customsReportWindow') customsReportWindow: NgcReportComponent;
  @ViewChild('createShipment') createShipment: NgcWindowComponent;
  segmentInformation: any[] = [];
  uldInformation: any[] = [];
  shipmentInformation: any[] = [];
  dimensionInformation: any[] = [];
  ociInformation: any[] = [];
  onwardInformation: any[] = [];
  osiInformation: any[] = [];
  shipmentRowId: any;
  sourceIdSegmentDropdown: any;
  isFlightInformation: boolean = false;
  isShipmentInformation: boolean = false;
  isRejectedShipmentInformation: boolean = false;
  FlightId: Number;
  aircraftRegCode: string;
  sourceIdULDDropdown: any;
  shcCode: string;
  destination: string;
  tempData: any[] = [];
  isRecordsSelected: boolean = false;
  tempULDNumber: string;
  count: Number = 0;
  flightStatus: string;
  flightULDCount: number;
  flightLooseCargoCount: number;
  flightCargoInULD: number;
  flightPieces: number;
  flightWeight: number;
  printFlag: boolean = false;
  LooseCargoShipments: any[] = [];
  reportParameters: any;
  isFFMReceived: boolean = false;
  isFFMRejected: boolean = false;
  resp: any;
  searchList: any;
  carrierCode: string;
  editShipmentInformation: any;
  activeULD: boolean = false;
  private dataSyncSearch: number = 0;
  bulkShipment: ShipmentModel = new ShipmentModel();
  manifestedUld: UldModel = new UldModel;
  losseShipmentContainer: boolean = false;
  uldShipmentContainer: boolean = false;
  airportCode: any;
  cityCode: any;
  @ViewChild("additionalInformationWindow")
  additionalInformationWindow: NgcWindowComponent;
  @ViewChild("looseCargoWindow") looseCargoWindow: NgcWindowComponent;
  @ViewChild("editShipmentsWindow")
  editShipmentsWindow: NgcWindowComponent;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.dataSyncSearch = 0;
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null) {
      if (forwardedData.flightNumber != null && forwardedData.flightNumber != "" && forwardedData.flightDate != null && forwardedData.flightDate != "") {
        this.arrivalManifestData.get("searchArrivalData.flight").setValue(forwardedData.flightNumber);
        this.arrivalManifestData.get("searchArrivalData.date").setValue(forwardedData.flightDate);
        this.onSearch();
      }
    }
    super.ngOnInit();
    this.airportCode = NgcUtility.getTenantConfiguration().airportCode;
    this.cityCode = NgcUtility.getTenantConfiguration().cityCode;
  }

  @ReactiveModel(ArrivalManifestFlight)
  public arrivalFlightDetails: NgcFormGroup;

  private arrivalManifestData: NgcFormGroup = new NgcFormGroup({
    searchArrivalData: new NgcFormGroup({
      flight: new NgcFormControl(),
      date: new NgcFormControl(new Date()),
      typeReport: new NgcFormControl(),
      shc: new NgcFormControl(),
      customsClearance: new NgcFormControl(),
      leftBehindSubmission: new NgcFormControl(),
      leftBehindSubmissionSentDate: new NgcFormControl()
    }),

    flightLevelCount: new NgcFormGroup({
      flightULDCount: new NgcFormControl(),
      flightLooseCargoCount: new NgcFormControl(),
      flightCargoInULD: new NgcFormControl(),
      flightPieces: new NgcFormControl(),
      flightWeight: new NgcFormControl()
    }),

    flightData: new NgcFormGroup({
      flightNumber: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      sta: new NgcFormControl(),
      eta: new NgcFormControl(),
      ata: new NgcFormControl(),
      aircraftRegCode: new NgcFormControl(),
      flightStatus: new NgcFormControl(),
      typeReport: new NgcFormControl(),
      routingInfo: new NgcFormControl()
    }),
    uldResultList: new NgcFormArray([
      new NgcFormGroup({
        boardingPoint: new NgcFormControl(),
        uldNumber: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        shipmentDescriptionCode: new NgcFormControl(),
        piece: new NgcFormControl(),
        weight: new NgcFormControl(0.0),
        weightUnitCode: new NgcFormControl(),
        totalPieces: new NgcFormControl(),
        natureOfGoodsDescription: new NgcFormControl(),
        shc: new NgcFormControl(),
        carrierDestination: new NgcFormControl(),
        onwardMovement: new NgcFormControl(),
        handledByDOMINT: new NgcFormControl(),
        handledByMasterHouse: new NgcFormControl(),
        additionalInfo: new NgcFormControl(),
        checkBoxValue: new NgcFormControl(),
        shcCode: new NgcFormControl(),
        flagCRUD: new NgcFormControl(),
        priority: new NgcFormControl()
      })
    ]),
    ffmReceivedDetails: new NgcFormArray([
      new NgcFormGroup({
        segmentReceived: new NgcFormControl(),
        segmentRejected: new NgcFormControl()
      })
    ]),
    ffmRejectedDetails: new NgcFormArray([
      new NgcFormGroup({
        segmentReceived: new NgcFormControl(),
        segmentRejected: new NgcFormControl()
      })
    ]),
    rejectedShipments: new NgcFormArray([
      new NgcFormGroup({
        shipmentNumber: new NgcFormControl(),
        rejectReason: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        shipmentDescriptionCode: new NgcFormControl(),
        piece: new NgcFormControl(),
        weight: new NgcFormControl(0.0),
        weightUnitCode: new NgcFormControl(),
        natureOfGoodsDescription: new NgcFormControl(),
      })
    ]),

    addUldInfo: new NgcFormGroup({
      uldNumber: new NgcFormControl(),
      segment: new NgcFormControl(),
      remark: new NgcFormControl(),
      uldShipmentResultList: new NgcFormArray([
        new NgcFormGroup({
          shipmentNumber: new NgcFormControl(),
          origin: new NgcFormControl(),
          destination: new NgcFormControl(),
          shipmentDescriptionCode: new NgcFormControl(),
          piece: new NgcFormControl(),
          weight: new NgcFormControl(0.0),
          weightUnitCode: new NgcFormControl(),
          totalPieces: new NgcFormControl(),
          natureOfGoodsDescription: new NgcFormControl(),
          shc: new NgcFormControl(),
          shcs: new NgcFormControl(),
          flagCRUD: new NgcFormControl()
        })
      ])
    }),

    addLooseCargoInfo: new NgcFormGroup({
      uldNumber: new NgcFormControl(),
      looseCargoResultList: new NgcFormArray([
        new NgcFormGroup({
          segment: new NgcFormControl(),
          shipmentNumber: new NgcFormControl(),
          origin: new NgcFormControl(),
          destination: new NgcFormControl(),
          shipmentDescriptionCode: new NgcFormControl(),
          piece: new NgcFormControl(),
          weight: new NgcFormControl(0.0),
          weightUnitCode: new NgcFormControl(),
          totalPieces: new NgcFormControl(),
          natureOfGoodsDescription: new NgcFormControl(),
          shc: new NgcFormControl(),
          shcs: new NgcFormControl(),
          flagCRUD: new NgcFormControl()
        })
      ])
    }),
    dimensionResultList: new NgcFormArray([
      new NgcFormGroup({
        checkBoxValue: new NgcFormControl(),
        noOfPieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        weightUnitCode: new NgcFormControl(),
        length: new NgcFormControl(),
        width: new NgcFormControl(),
        height: new NgcFormControl(),
        measurementUnitCode: new NgcFormControl()
      })
    ]),
    ociResultList: new NgcFormArray([
      new NgcFormGroup({
        checkBoxValue: new NgcFormControl(),
        countryCode: new NgcFormControl(),
        informationIdentifier: new NgcFormControl(),
        csrciIdentifier: new NgcFormControl(),
        scsrcInformation: new NgcFormControl()
      })
    ]),

    onwardMvmtResultList: new NgcFormArray([
      new NgcFormGroup({
        checkBoxValue: new NgcFormControl(),
        airportCityCode: new NgcFormControl(),
        carrierCode: new NgcFormControl(),
        flightNumber: new NgcFormControl(),
        departureDate: new NgcFormControl()
      })
    ]),

    osiResultList: new NgcFormArray([
      new NgcFormGroup({
        remarks: new NgcFormControl()
      })
    ]),

    additionalInfoData: new NgcFormGroup({
      densityGroup: new NgcFormControl(),
      volume: new NgcFormControl(),
      volumeUnitCode: new NgcFormControl(),
      customsReference: new NgcFormControl(),
      customsOrigin: new NgcFormControl(),
      movementPriorityCode: new NgcFormControl()
    }),
    looseShipments: new NgcFormArray([
      new NgcFormGroup({
        boardingPoint: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        svc: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        shipmentDescriptionCode: new NgcFormControl('T'),
        piece: new NgcFormControl(),
        weight: new NgcFormControl(0.0),
        weightUnitCode: new NgcFormControl(),
        totalPieces: new NgcFormControl(),
        natureOfGoodsDescription: new NgcFormControl(),
        shc: new NgcFormControl(),
        carrierDestination: new NgcFormControl(),
        handledByDOMINT: new NgcFormControl(),
        handledByMasterHouse: new NgcFormControl(),
        carrierCode: new NgcFormControl(),
        additionalInfo: new NgcFormControl(),
        checkBoxValue: new NgcFormControl(),
        shcCode: new NgcFormControl(),
        flagCRUD: new NgcFormControl(),
        movementInfo: new NgcFormArray([
          new NgcFormGroup({
            flightNumber: new NgcFormControl(),
            departureDate: new NgcFormControl(),
            airportCityCode: new NgcFormControl(),
            carrierCode: new NgcFormControl(),
          })
        ]
        ),
      })
    ]),
    uldShipments: new NgcFormArray([
      new NgcFormGroup({
        boardingPoint: new NgcFormControl(),
        uldNumber: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        svc: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        shipmentDescriptionCode: new NgcFormControl('T'),
        piece: new NgcFormControl(),
        weight: new NgcFormControl(0.0),
        weightUnitCode: new NgcFormControl(),
        totalPieces: new NgcFormControl(),
        natureOfGoodsDescription: new NgcFormControl(),
        shc: new NgcFormControl(),
        carrierDestination: new NgcFormControl(),
        handledByDOMINT: new NgcFormControl(),
        handledByMasterHouse: new NgcFormControl(),
        carrierCode: new NgcFormControl(),
        additionalInfo: new NgcFormControl(),
        checkBoxValue: new NgcFormControl(),
        shcCode: new NgcFormControl(),
        flagCRUD: new NgcFormControl(),
        movementInfo: new NgcFormArray([
          new NgcFormGroup({
            flightNumber: new NgcFormControl(),
            departureDate: new NgcFormControl(),
            airportCityCode: new NgcFormControl(),
            carrierCode: new NgcFormControl(),
          })
        ]
        ),
      })
    ]),
  });



  public onSearch(): void {
    this.isRejectedShipmentInformation = false;
    this.isFFMReceived = false;
    this.isFFMRejected = false;
    let flightSearchData: ArrivalManifestFlight = new ArrivalManifestFlight();

    flightSearchData.flightNumber = this.arrivalManifestData.get("searchArrivalData.flight").value;
    flightSearchData.flightDate = this.arrivalManifestData.get("searchArrivalData.date").value;
    flightSearchData.specialHandlingCode = this.arrivalManifestData.get("searchArrivalData.shc").value;
    flightSearchData.segmentId = 0;

    if (
      flightSearchData.flightNumber == null || flightSearchData.flightDate == null
    ) {
      this.arrivalManifestData.validate();
      this.showErrorStatus("error.import.enter.mandatory.fields");
      return;
    }

    this.importService.fetchArrivalSearchDetails(flightSearchData).subscribe(
      data => {
        this.resp = data.data;
        //console.log(data);
        if (!this.showResponseErrorMessages(data)) {
          //Patch shipment reject details
          if (data.data.rejectedShipments.length > 0) {
            this.isRejectedShipmentInformation = true;
            this.arrivalManifestData.get('rejectedShipments').patchValue(data.data.rejectedShipments);
          }
          if (data.data.ffmReceivedDetails && data.data.ffmReceivedDetails.length > 0) {
            this.isFFMReceived = true;
            this.arrivalManifestData.get('ffmReceivedDetails').patchValue(data.data.ffmReceivedDetails);
          }
          if (data.data.ffmRejectedDetails && data.data.ffmRejectedDetails.length > 0) {
            this.isFFMRejected = true;
            this.arrivalManifestData.get('ffmRejectedDetails').patchValue(data.data.ffmRejectedDetails);
          }
          if (!data.data) {
            this.showErrorStatus("no.record.found");
            this.isFlightInformation = false;
            this.isShipmentInformation = false;
            return;
          }
        } else {
          this.isShipmentInformation = false;
          this.isFlightInformation = false;
        }
        this.shipmentInformation = [];
        this.printFlag = true;

        this.FlightId = data.data.impArrivalManifestByFlightId;
        this.aircraftRegCode = data.data.aircraftRegCode;
        this.flightStatus = data.data.flightStatus;
        this.arrivalManifestData.get("flightLevelCount.flightCargoInULD").setValue(data.data.cargoInULD);
        this.arrivalManifestData.get("flightLevelCount.flightLooseCargoCount").setValue(data.data.looseCargo);
        this.arrivalManifestData.get("flightLevelCount.flightPieces").setValue(data.data.pieceCount);
        this.arrivalManifestData.get("flightLevelCount.flightWeight").setValue(data.data.weight);
        this.arrivalManifestData.get("flightLevelCount.flightULDCount").setValue(data.data.uldCount);

        data.data.flightDate = data.data.flightDate ? data.data.flightDate.substring(0, 10) : data.data.flightDate;
        data.data.flightDate = this.arrivalManifestData.get("searchArrivalData.date").value;
        data.data.flightNumber = this.arrivalManifestData.get("searchArrivalData.flight").value;
        this.isFlightInformation = true;

        for (let item = 0; item < data.data.segments.length; item++) {
          for (let index = 0; index < data.data.segments[item].manifestedUlds.length; index++) {
            for (let k = 0; k < data.data.segments[item].manifestedUlds[index].shipments.length; k++) {
              this.shipmentInformation.push(data.data.segments[item].manifestedUlds[index].shipments[k]);
            }
            this.uldInformation.push(data.data.segments[item].manifestedUlds[index]);
          }
          this.segmentInformation.push(data.data.segments[item]);
        }
        for (let item = 0; item < this.shipmentInformation.length; item++) {
          if (this.shipmentInformation[item].shc.length > 0) {
            this.shcCode = "";
            for (let index = 0; index < this.shipmentInformation[item].shc.length; index++) {
              this.shcCode += " " + this.shipmentInformation[item].shc[index].specialHandlingCode;
            }
            this.shipmentInformation[item].shcCode = this.shcCode;
          }
          if (this.shipmentInformation[item].carrierDestination != null && this.shipmentInformation[item].carrierCode != null) {
            this.shipmentInformation[item].carrierDestination = this.shipmentInformation[item].carrierDestination + ' /' + this.shipmentInformation[item].carrierCode;
          }
        }
        //loose Cargo shc Code
        for (let item = 0; item < data.data.segments.length; item++) {
          for (let index = 0; index < data.data.segments[item].bulkShipments.length; index++) {
            if (data.data.segments[item].bulkShipments[index].shc.length > 0) {
              this.shcCode = "";
              for (let shcData = 0; shcData < data.data.segments[item].bulkShipments[index].shc.length; shcData++) {
                this.shcCode += " " + data.data.segments[item].bulkShipments[index].shc[shcData].specialHandlingCode;
              }
              data.data.segments[item].bulkShipments[index].shcCode = this.shcCode;
            }

            if (data.data.segments[item].bulkShipments[index].carrierDestination != null && data.data.segments[item].bulkShipments[index].carrierCode != null) {
              data.data.segments[item].bulkShipments[index].carrierDestination
                = data.data.segments[item].bulkShipments[index].carrierDestination + ' /' + data.data.segments[item].bulkShipments[index].carrierCode;
            }
          }
        }
        if (this.shipmentInformation.length > 0 || this.isFFMReceived || this.isFFMRejected) {
          this.isShipmentInformation = true;
        } else {
          //this.isFlightInformation = false;
          this.isShipmentInformation = false;
          //this.showErrorStatus('no.record.found');
        }
        if (this.resp.handlinginSystem && this.dataSyncSearch == 0) {
          this.showConfirmMessage('entered.flight.not.handled.in.cosys').then(reason => {
            this.setFlightLevelInformation(data);
            this.arrivalManifestData.get("flightData").patchValue(data.data);
            this.bindData(data.data.segments);
            this.dataSyncSearch++;
          }).catch(reason => {
            this.isFlightInformation = false;
            this.isShipmentInformation = false;
          })
        } else {
          this.setFlightLevelInformation(data);
          this.arrivalManifestData.get("flightData").patchValue(data.data);
          this.bindData(data.data.segments);
        }
        if (this.segmentInformation.length > 0) {
          this.isShipmentInformation = true;
        }
        //(<NgcFormArray>this.arrivalManifestData.controls['uldResultList']).patchValue(this.shipmentInformation);
      },
      error => {
        this.showErrorStatus(error);
      }
    );
  }

  private setFlightLevelInformation(data) {
    this.arrivalManifestData.get("flightData").patchValue(data.data);
    if (data.data.customsInfo != null) {
      this.arrivalManifestData.get("searchArrivalData.customsClearance").setValue(data.data.customsInfo.customsClearance);
      this.arrivalManifestData.get("searchArrivalData.leftBehindSubmission").setValue(data.data.customsInfo.leftBehindSubmission);
      this.arrivalManifestData.get("searchArrivalData.leftBehindSubmissionSentDate").setValue(data.data.customsInfo.leftBehindSubmissionSentDate);
    }
  }

  public onAddDimension(): void {
    const rowLength = (<NgcFormArray>this.arrivalManifestData.get(
      "dimensionResultList"
    )).controls;

    if (rowLength.length > 0) {
      if (this.arrivalManifestData.get("dimensionResultList").invalid) {
        this.showErrorStatus(
          "error.import.enter.mandatory.fields.more.dimension"
        );
        return;
      }
    }

    (<NgcFormArray>this.arrivalManifestData.get(
      "dimensionResultList"
    )).addValue([
      {
        checkBoxValue: "",
        noOfPieces: "",
        weight: "",
        weightUnitCode: "",
        length: "",
        width: "",
        height: "",
        measurementUnitCode: ""
      }
    ]);
  }

  public onDeleteDimension(): void {
    const dimensionDetails = (<NgcFormArray>this.arrivalManifestData.get(
      "dimensionResultList"
    )).controls;
    this.count = 0;
    this.dimensionInformation = [];
    for (let item = 0; item < dimensionDetails.length; item++) {
      if (dimensionDetails[item].value.checkBoxValue != "") {
        this.count = 1;
        break;
      }
    }

    if (this.count == 0) {
      this.showErrorStatus("error.import.select.records.to.delete");
      return;
    }

    for (let item = 0; item < dimensionDetails.length; item++) {
      if (dimensionDetails[item].value.checkBoxValue) {
        if (
          dimensionDetails[item].value.id != null &&
          dimensionDetails[item].value.id != ""
        ) {
          this.shipmentInformation[this.shipmentRowId].dimensions[
            item
          ].flagCRUD =
            "D";
          this.dimensionInformation.slice(item);
        } else {
          this.dimensionInformation.slice(item);
        }
      } else {
        this.dimensionInformation.push(dimensionDetails[item].value);
      }
    }

    (<NgcFormArray>this.arrivalManifestData.controls[
      "dimensionResultList"
    ]).patchValue(this.dimensionInformation);
  }

  public onAddOCI(): void {
    const rowLength = (<NgcFormArray>this.arrivalManifestData.get(
      "ociResultList"
    )).controls;

    if (rowLength.length > 0) {
      if (this.arrivalManifestData.get("ociResultList").invalid) {
        this.showErrorStatus(
          "error.import.enter.all.mandatory.fields.more.oci.data"
        );
        return;
      }
    }
    (<NgcFormArray>this.arrivalManifestData.get("ociResultList")).addValue([
      {
        checkBoxValue: "",
        countryCode: "",
        informationIdentifier: "",
        csrciIdentifier: "",
        scsrcInformation: ""
      }
    ]);
  }

  public onDeleteOCI(): void {
    this.ociInformation = [];

    const ociDetails = (<NgcFormArray>this.arrivalManifestData.get(
      "ociResultList"
    )).controls;

    this.count = 0;
    for (let item = 0; item < ociDetails.length; item++) {
      if (ociDetails[item].value.checkBoxValue != "") {
        this.count = 1;
        break;
      }
    }

    if (this.count == 0) {
      this.showErrorStatus("error.import.select.records.to.delete");
      return;
    }

    for (let item = 0; item < ociDetails.length; item++) {
      if (ociDetails[item].value.checkBoxValue) {
        if (
          ociDetails[item].value.id != null &&
          ociDetails[item].value.id != ""
        ) {
          this.shipmentInformation[this.shipmentRowId].oci[item].flagCRUD = "D";
          this.ociInformation.slice(item);
        } else {
          this.ociInformation.slice(item);
        }
      } else {
        this.ociInformation.push(ociDetails[item].value);
      }
    }

    (<NgcFormArray>this.arrivalManifestData.controls[
      "ociResultList"
    ]).patchValue(this.ociInformation);
  }

  public onAddMovement(): void {
    const rowLength = (<NgcFormArray>this.arrivalManifestData.get(
      "onwardMvmtResultList"
    )).controls;

    if (rowLength.length > 0) {
      if (this.arrivalManifestData.get("onwardMvmtResultList").invalid) {
        this.showErrorStatus(
          "error.import.enter.all.mandatory.fields.more.onward.data"
        );
        return;
      }
    }
    (<NgcFormArray>this.arrivalManifestData.get(
      "onwardMvmtResultList"
    )).addValue([
      {
        checkBoxValue: "",
        airportCityCode: "",
        carrierCode: "",
        flightNumber: "",
        departureDate: ""
      }
    ]);
  }

  public onDeleteMovement(): void {
    const movementDetails = (<NgcFormArray>this.arrivalManifestData.get(
      "onwardMvmtResultList"
    )).controls;
    this.onwardInformation = [];

    this.count = 0;
    for (let item = 0; item < movementDetails.length; item++) {
      if (movementDetails[item].value.checkBoxValue != "") {
        this.count = 1;
        break;
      }
    }

    if (this.count == 0) {
      this.showErrorStatus("error.import.select.records.to.delete");
      return;
    }

    for (let item = 0; item < movementDetails.length; item++) {
      if (movementDetails[item].value.checkBoxValue === true) {
        if (
          movementDetails[item].value.id != null &&
          movementDetails[item].value.id != ""
        ) {
          this.shipmentInformation[this.shipmentRowId].movementInfo[
            item
          ].flagCRUD =
            "D";
          this.onwardInformation.slice(item);
        } else {
          this.onwardInformation.slice(item);
        }
      } else {
        this.onwardInformation.push(this.onwardInformation);
      }
    }

    (<NgcFormArray>this.arrivalManifestData.controls[
      "onwardMvmtResultList"
    ]).patchValue(this.onwardInformation);
  }

  public onAdditionalInformationSave(): void {
    let shipmentData: ShipmentModel = new ShipmentModel();
    shipmentData.shipmentId = this.shipmentInformation[
      this.shipmentRowId
    ].impArrivalManifestShipmentInfoId;
    shipmentData.densityGroupCode = this.arrivalManifestData.get(
      "additionalInfoData.densityGroup"
    ).value;
    shipmentData.volumeAmount = this.arrivalManifestData.get(
      "additionalInfoData.volume"
    ).value;
    shipmentData.volumeunitCode = this.arrivalManifestData.get(
      "additionalInfoData.volumeUnitCode"
    ).value;
    shipmentData.customsReference = this.arrivalManifestData.get(
      "additionalInfoData.customsReference"
    ).value;
    shipmentData.customsOriginCode = this.arrivalManifestData.get(
      "additionalInfoData.customsOrigin"
    ).value;
    shipmentData.movementPriorityCode = this.arrivalManifestData.get(
      "additionalInfoData.movementPriorityCode"
    ).value;
    shipmentData.shipmentNumber = "0";

    const dimensionDetails = (<NgcFormArray>this.arrivalManifestData.get(
      "dimensionResultList"
    )).controls;
    const ociDetails = (<NgcFormArray>this.arrivalManifestData.get(
      "ociResultList"
    )).controls;
    const onwardDetails = (<NgcFormArray>this.arrivalManifestData.get(
      "onwardMvmtResultList"
    )).controls;
    const osiDetails = (<NgcFormArray>this.arrivalManifestData.get(
      "osiResultList"
    )).controls;

    for (let item = 0; item < dimensionDetails.length; item++) {
      let dimensionInfo: DimensionData = new DimensionData();
      dimensionInfo.noOfPieces = dimensionDetails[item].value.noOfPieces;
      dimensionInfo.weight = dimensionDetails[item].value.weight;
      dimensionInfo.weightUnitCode =
        dimensionDetails[item].value.weightUnitCode;
      dimensionInfo.length = dimensionDetails[item].value.length;
      dimensionInfo.width = dimensionDetails[item].value.width;
      dimensionInfo.height = dimensionDetails[item].value.height;
      dimensionInfo.measurementUnitCode =
        dimensionDetails[item].value.measurementUnitCode;
      dimensionInfo.shipmentId = this.shipmentInformation[
        this.shipmentRowId
      ].impArrivalManifestShipmentInfoId;
      if (
        dimensionDetails[item].value.id != null &&
        dimensionDetails[item].value.id != ""
      ) {
        dimensionInfo.id = dimensionDetails[item].value.id;
        dimensionInfo.flagCRUD = "U";
      } else {
        dimensionInfo.flagCRUD = "C";
      }
      shipmentData.dimensions.push(dimensionInfo);
    }

    //Soft Deleted record are sent to Service
    for (
      let index = 0;
      index < this.shipmentInformation[this.shipmentRowId].dimensions.length;
      index++
    ) {
      if (
        this.shipmentInformation[this.shipmentRowId].dimensions[index]
          .flagCRUD == "D"
      ) {
        let dimensionInfo: DimensionData = new DimensionData();
        dimensionInfo.noOfPieces = this.shipmentInformation[
          this.shipmentRowId
        ].dimensions[index].noOfPieces;
        dimensionInfo.weight = this.shipmentInformation[
          this.shipmentRowId
        ].dimensions[index].weight;
        dimensionInfo.weightUnitCode = this.shipmentInformation[
          this.shipmentRowId
        ].dimensions[index].weightUnitCode;
        dimensionInfo.length = this.shipmentInformation[
          this.shipmentRowId
        ].dimensions[index].length;
        dimensionInfo.width = this.shipmentInformation[
          this.shipmentRowId
        ].dimensions[index].width;
        dimensionInfo.height = this.shipmentInformation[
          this.shipmentRowId
        ].dimensions[index].height;
        dimensionInfo.measurementUnitCode = this.shipmentInformation[
          this.shipmentRowId
        ].dimensions[index].measurementUnitCode;
        dimensionInfo.shipmentId = this.shipmentInformation[
          this.shipmentRowId
        ].impArrivalManifestShipmentInfoId;
        dimensionInfo.id = this.shipmentInformation[
          this.shipmentRowId
        ].dimensions[index].id;
        dimensionInfo.flagCRUD = this.shipmentInformation[
          this.shipmentRowId
        ].dimensions[index].flagCRUD;
        shipmentData.dimensions.push(dimensionInfo);
      }
    }

    for (let item = 0; item < ociDetails.length; item++) {
      let ociInfo: OciData = new OciData();
      ociInfo.countryCode = ociDetails[item].value.countryCode;
      ociInfo.informationIdentifier =
        ociDetails[item].value.informationIdentifier;
      ociInfo.csrciIdentifier = ociDetails[item].value.csrciIdentifier;
      ociInfo.scsrcInformation = ociDetails[item].value.scsrcInformation;
      ociInfo.shipmentId = this.shipmentInformation[
        this.shipmentRowId
      ].impArrivalManifestShipmentInfoId;
      if (
        ociDetails[item].value.id != null &&
        ociDetails[item].value.id != ""
      ) {
        ociInfo.id = ociDetails[item].value.id;
        ociInfo.flagCRUD = "U";
      } else {
        ociInfo.flagCRUD = "C";
      }
      shipmentData.oci.push(ociInfo);
    }
    //Soft Deleted record are sent to Service
    for (
      let index = 0;
      index < this.shipmentInformation[this.shipmentRowId].oci.length;
      index++
    ) {
      if (
        this.shipmentInformation[this.shipmentRowId].oci[index].flagCRUD == "D"
      ) {
        //shipmentData.oci.push(this.shipmentInformation[this.shipmentRowId].oci[index]);
        let ociInfo: OciData = new OciData();
        ociInfo.countryCode = this.shipmentInformation[this.shipmentRowId].oci[
          index
        ].countryCode;
        ociInfo.informationIdentifier = this.shipmentInformation[
          this.shipmentRowId
        ].oci[index].informationIdentifier;
        ociInfo.csrciIdentifier = this.shipmentInformation[
          this.shipmentRowId
        ].oci[index].csrciIdentifier;
        ociInfo.scsrcInformation = this.shipmentInformation[
          this.shipmentRowId
        ].oci[index].scsrcInformation;
        ociInfo.shipmentId = this.shipmentInformation[
          this.shipmentRowId
        ].impArrivalManifestShipmentInfoId;
        ociInfo.flagCRUD = this.shipmentInformation[this.shipmentRowId].oci[
          index
        ].flagCRUD;
        ociInfo.id = this.shipmentInformation[this.shipmentRowId].oci[index].id;
        shipmentData.oci.push(ociInfo);
      }
    }

    for (let item = 0; item < onwardDetails.length; item++) {
      let movementDetail: ConsignmentMovementData = new ConsignmentMovementData();
      movementDetail.airportCityCode =
        onwardDetails[item].value.airportCityCode;
      movementDetail.carrierCode = onwardDetails[item].value.carrierCode;
      movementDetail.flightNumber = onwardDetails[item].value.flightNumber;
      movementDetail.departureDate = onwardDetails[item].value.departureDate
        ? onwardDetails[item].value.departureDate
        : null;
      movementDetail.shipmentId = this.shipmentInformation[
        this.shipmentRowId
      ].impArrivalManifestShipmentInfoId;
      if (
        onwardDetails[item].value.id != null &&
        onwardDetails[item].value.id != ""
      ) {
        movementDetail.id = onwardDetails[item].value.id;
        movementDetail.flagCRUD = "U";
      } else {
        movementDetail.flagCRUD = "C";
      }
      if (movementDetail.airportCityCode != "") {
        if (
          movementDetail.departureDate == null ||
          movementDetail.carrierCode == "" ||
          movementDetail.flightNumber == ""
        ) {
          this.showErrorStatus("error.import.enter.correct.onward.details");
          return;
        }
      }
      if (
        movementDetail.airportCityCode != "" ||
        movementDetail.carrierCode != "" ||
        movementDetail.flightNumber != "" ||
        movementDetail.departureDate != null
      ) {
        shipmentData.movementInfo.push(movementDetail);
      }
    }

    //Soft Deleted record are sent to Service
    for (
      let index = 0;
      index < this.shipmentInformation[this.shipmentRowId].movementInfo.length;
      index++
    ) {
      if (
        this.shipmentInformation[this.shipmentRowId].movementInfo[index]
          .flagCRUD == "D"
      ) {
        //shipmentData.oci.push(this.shipmentInformation[this.shipmentRowId].oci[index]);
        let movementDetail: ConsignmentMovementData = new ConsignmentMovementData();
        movementDetail.airportCityCode = this.shipmentInformation[
          this.shipmentRowId
        ].movementInfo[index].airportCityCode;
        movementDetail.carrierCode = this.shipmentInformation[
          this.shipmentRowId
        ].movementInfo[index].carrierCode;
        movementDetail.flightNumber = this.shipmentInformation[
          this.shipmentRowId
        ].movementInfo[index].flightNumber;
        movementDetail.departureDate = this.shipmentInformation[
          this.shipmentRowId
        ].movementInfo[index].departureDate;
        movementDetail.shipmentId = this.shipmentInformation[
          this.shipmentRowId
        ].impArrivalManifestShipmentInfoId;
        movementDetail.flagCRUD = this.shipmentInformation[
          this.shipmentRowId
        ].movementInfo[index].flagCRUD;
        movementDetail.id = this.shipmentInformation[
          this.shipmentRowId
        ].movementInfo[index].id;
        shipmentData.movementInfo.push(movementDetail);
      }
    }

    for (let item = 0; item < osiDetails.length; item++) {
      let osiInfo: OtherServicesInformation = new OtherServicesInformation();
      osiInfo.remarks = osiDetails[item].value.remarks;
      osiInfo.shipmentId = this.shipmentInformation[
        this.shipmentRowId
      ].impArrivalManifestShipmentInfoId;
      if (
        osiDetails[item].value.id != null &&
        osiDetails[item].value.id != ""
      ) {
        osiInfo.id = osiDetails[item].value.id;
        osiInfo.flagCRUD = "U";
      } else {
        osiInfo.flagCRUD = "C";
      }
      shipmentData.osi.push(osiInfo);
    }

    for (
      let item = 0;
      item < this.shipmentInformation[this.shipmentRowId].dimensions.length;
      item++
    ) {
      if (
        this.shipmentInformation[this.shipmentRowId].dimensions[item]
          .flagCRUD == "D"
      ) {
        shipmentData.dimensions.push(
          this.shipmentInformation[this.shipmentRowId].dimensions[item]
        );
      }
    }

    for (
      let item = 0;
      item < this.shipmentInformation[this.shipmentRowId].movementInfo.length;
      item++
    ) {
      if (
        this.shipmentInformation[this.shipmentRowId].movementInfo[item]
          .flagCRUD == "D"
      ) {
        shipmentData.movementInfo.push(
          this.shipmentInformation[this.shipmentRowId].movementInfo[item]
        );
      }
    }

    for (
      let item = 0;
      item < this.shipmentInformation[this.shipmentRowId].oci.length;
      item++
    ) {
      if (
        this.shipmentInformation[this.shipmentRowId].oci[item].flagCRUD == "D"
      ) {
        shipmentData.oci.push(
          this.shipmentInformation[this.shipmentRowId].oci[item]
        );
      }
    }
    if (this.arrivalManifestData.get("dimensionResultList").invalid) {
      this.showErrorStatus("error.import.enter.mandatory.fields");
      return;
    }

    this.importService.saveAdditionalInfo(shipmentData).subscribe(
      data => {
        this.refreshFormMessages(data);
        console.log(data);
        if (data.messageList == null) {
          this.showSuccessStatus("g.completed.successfully");
          this.additionalInformationWindow.close();
          this.onSearch();
        }
      },
      error => {
        this.showErrorStatus("error.import.operation.failed");
      }
    );
  }



  public onAddOSI(): void {
    (<NgcFormArray>this.arrivalManifestData.get("osiResultList")).addValue([
      {
        remarks: ""
      }
    ]);
  }

  public onAdditionalInformationPopUp(event): void {
    this.dimensionInformation = [];
    this.ociInformation = [];
    this.onwardInformation = [];
    this.osiInformation = [];
    if (event.column == "additionalInfo") {
      this.shipmentInformation = [];
      for (let index = 0; index < this.segmentInformation.length; index++) {
        this.shipmentInformation.push(this.segmentInformation[index]);
      }

      this.shipmentRowId = event.record.NGC_ROW_ID;
      this.arrivalManifestData.get("additionalInfoData").reset();

      this.arrivalManifestData.get("additionalInfoData.densityGroup").setValue(
        this.shipmentInformation[event.record.NGC_ROW_ID].densityGroupCode
      );
      this.arrivalManifestData.get("additionalInfoData.volume").setValue(
        this.shipmentInformation[event.record.NGC_ROW_ID].volumeAmount);
      this.arrivalManifestData.get("additionalInfoData.volumeUnitCode").setValue(
        this.shipmentInformation[event.record.NGC_ROW_ID].volumeunitCode
      );
      this.arrivalManifestData.get("additionalInfoData.customsReference").setValue(
        this.shipmentInformation[event.record.NGC_ROW_ID].customsReference
      );
      this.arrivalManifestData.get("additionalInfoData.customsOrigin")
        .setValue(
          this.shipmentInformation[event.record.NGC_ROW_ID].customsOriginCode
        );
      this.arrivalManifestData.get("additionalInfoData.movementPriorityCode")
        .setValue(
          this.shipmentInformation[event.record.NGC_ROW_ID].movementPriorityCode
        );
      for (
        let item = 0;
        item <
        this.shipmentInformation[event.record.NGC_ROW_ID].dimensions.length;
        item++
      ) {
        if (
          this.shipmentInformation[event.record.NGC_ROW_ID].dimensions[item]
            .flagCRUD != "D"
        ) {
          this.shipmentInformation[event.record.NGC_ROW_ID].dimensions[
            item
          ].checkBoxValue = false;
          this.dimensionInformation.push(
            this.shipmentInformation[event.record.NGC_ROW_ID].dimensions[item]
          );
        }
      }
      for (
        let item = 0;
        item < this.shipmentInformation[event.record.NGC_ROW_ID].oci.length;
        item++
      ) {
        if (
          this.shipmentInformation[event.record.NGC_ROW_ID].oci[item].flagCRUD !=
          "D"
        ) {
          this.shipmentInformation[event.record.NGC_ROW_ID].oci[
            item
          ].checkBoxValue = false;
          this.ociInformation.push(
            this.shipmentInformation[event.record.NGC_ROW_ID].oci[item]
          );
        }
      }
      for (
        let item = 0;
        item <
        this.shipmentInformation[event.record.NGC_ROW_ID].movementInfo.length;
        item++
      ) {
        if (
          this.shipmentInformation[event.record.NGC_ROW_ID].movementInfo[item]
            .flagCRUD != "D"
        ) {
          this.shipmentInformation[event.record.NGC_ROW_ID].movementInfo[
            item
          ].checkBoxValue = false;
          this.onwardInformation.push(
            this.shipmentInformation[event.record.NGC_ROW_ID].movementInfo[item]
          );
        }
      }
      for (
        let item = 0;
        item < this.shipmentInformation[event.record.NGC_ROW_ID].osi.length;
        item++
      ) {
        this.shipmentInformation[event.record.NGC_ROW_ID].osi[
          item
        ].checkBoxValue = false;
        this.osiInformation.push(
          this.shipmentInformation[event.record.NGC_ROW_ID].osi[item]
        );
      }

      if (this.dimensionInformation.length > 0) {
        (<NgcFormArray>this.arrivalManifestData.controls[
          "dimensionResultList"
        ]).patchValue(this.dimensionInformation);
      } else {
        (<NgcFormArray>this.arrivalManifestData.controls[
          "dimensionResultList"
        ]).resetValue([]);
        this.onAddDimension();
      }

      if (this.ociInformation.length > 0) {
        (<NgcFormArray>this.arrivalManifestData.controls[
          "ociResultList"
        ]).patchValue(this.ociInformation);
      } else {
        (<NgcFormArray>this.arrivalManifestData.controls[
          "ociResultList"
        ]).resetValue([]);
        this.onAddOCI();
      }

      if (this.onwardInformation.length > 0) {
        (<NgcFormArray>this.arrivalManifestData.controls[
          "onwardMvmtResultList"
        ]).patchValue(this.onwardInformation);
      } else {
        (<NgcFormArray>this.arrivalManifestData.controls[
          "onwardMvmtResultList"
        ]).resetValue([]);
        this.onAddMovement();
      }

      if (this.osiInformation.length > 0) {
        (<NgcFormArray>this.arrivalManifestData.controls[
          "osiResultList"
        ]).patchValue(this.osiInformation);
      } else {
        (<NgcFormArray>this.arrivalManifestData.controls[
          "osiResultList"
        ]).resetValue([]);
        this.onAddOSI();
        this.onAddOSI();
      }
      this.arrivalManifestData.get("osiResultList").disable();
      this.arrivalManifestData.get("onwardMvmtResultList").disable();
      this.arrivalManifestData.get("ociResultList").disable();
      this.arrivalManifestData.get("dimensionResultList").disable();
      this.arrivalManifestData.get("additionalInfoData").disable();
      this.additionalInformationWindow.open();
    } else if (event.column == 'Edit') {
      this.airportCode = NgcUtility.getTenantConfiguration().airportCode;
      this.cityCode = NgcUtility.getTenantConfiguration().cityCode
      let looseShipmentlist = [];
      let uldShipmentList = [];
      this.losseShipmentContainer = false;
      this.uldShipmentContainer = false;
      (<NgcFormArray>this.arrivalManifestData.controls['looseShipments']).resetValue([]);
      (<NgcFormArray>this.arrivalManifestData.controls['uldShipments']).resetValue([]);
      this.arrivalManifestData.getRawValue().uldResultList.forEach(element => {
        if (event.record.shipmentNumber == element.shipmentNumber && element.uldNumber == 'Loose Shipment') {
          if (element.carrierDestination != null) {
            element.carrierDestination = element.carrierDestination.split(' /')[0];
          }
          looseShipmentlist.push(element);
          (<NgcFormArray>this.arrivalManifestData.controls['looseShipments']).patchValue(looseShipmentlist);
          this.losseShipmentContainer = true;
        } else if (event.record.shipmentNumber == element.shipmentNumber && element.uldNumber != 'Loose Shipment') {
          if (element.carrierDestination != null) {
            element.carrierDestination = element.carrierDestination.split(' /')[0];
          }
          uldShipmentList.push(element);
          this.uldShipmentContainer = true;
          (<NgcFormArray>this.arrivalManifestData.controls['uldShipments']).patchValue(uldShipmentList);
        }
      });
      this.editShipmentsWindow.open();
    } else if (event.column == 'Delete') {
      console.log(event);
      this.deleteShipmentData(event.record);
    }
    else if (event.column == 'shipmentNumber') {
      var dataToSend = {
        shipmentNumber: event.record.shipmentNumber,
        flightNumber: this.arrivalManifestData.get("searchArrivalData.flight").value,
        flightDate: this.arrivalManifestData.get("searchArrivalData.date").value
      }
      this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', dataToSend);
    }
  }


  protected groupsRenderer = (
    value: any,
    rowData: any,
    level: any,
    groupData: any
  ): any => {
    if (level == 1) {
      rowData.data.uldRemarks = rowData.data.uldRemarks ? rowData.data.uldRemarks : ''
      if (value != "Loose Shipment" && value != "NIL Cargo") {
        return (
          "&nbsp;" +
          value +
          "&nbsp;&nbsp;Piece -" +
          rowData.data.pieceCount +
          "&nbsp;&nbsp;weight-" +
          rowData.data.weightt +
          "&nbsp&nbsp;AWB-" +
          rowData.data.shipmentCount +
          "&nbsp;&nbsp;Remark-" +
          rowData.data.uldRemarks
        );
      } else if (value == "Loose Shipment") {
        return "&nbsp;" + value;
      } else {
        return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + value;
      }
    } else {
      if (!rowData) {
        if (!rowData.data.uldCount) {
          rowData.data.uldCount = 0;
        }
        if (!rowData.data.looseCargoCount) {
          rowData.data.looseCargoCount = 0;
        }
        if (!rowData.data.cargoInULD) {
          rowData.data.cargoInULD = 0;
        }
        if (!rowData.data.segmentPieceCount) {
          rowData.data.segmentPieceCount = 0;
        }
        if (!rowData.data.segmentWeight) {
          rowData.data.segmentWeight = 0;
        }
      }
      if (rowData.data.segmentUldGruopDetailsCount == null) {
        return (
          "&nbsp;" +
          value +
          "&nbsp;&nbsp;ULD -" +
          rowData.data.uldCount +
          "&nbsp;&nbsp;Loose Shipments-" +
          rowData.data.looseCargoCount +
          "&nbsp&nbsp;ULD Shipment-" +
          rowData.data.cargoInULD +
          "&nbsp;&nbsp;Pieces-" +
          rowData.data.segmentPieceCount +
          "&nbsp;&nbsp;Weight-" +
          rowData.data.segmentWeight
        ).bold();
      } else {
        return (
          "&nbsp;" +
          value +
          "&nbsp;&nbsp;" + "[ " +
          rowData.data.segmentUldGruopDetailsCount + " ]" +
          "&nbsp&nbsp;&nbsp;&nbsp;Loose Shipments-" +
          rowData.data.looseCargoCount +
          "&nbsp&nbsp;&nbsp;&nbsp;ULD Shipment-" +
          rowData.data.cargoInULD +
          "&nbsp;&nbsp;&nbsp;&nbsp;Pieces-" +
          rowData.data.segmentPieceCount +
          "&nbsp;&nbsp;&nbsp;&nbsp;Weight-" +
          rowData.data.segmentWeight
        ).bold();
      }

    }
  };

  bindData(segments: Array<any>) {
    this.segmentInformation = [];
    let count = 0;
    for (const segment of segments) {
      count++;
      if (segment.bulkShipments.length > 0) {
        this.isShipmentInformation = true;
        for (let bulkShipment of segment.bulkShipments) {
          let newShipment = Object.assign({}, bulkShipment);
          newShipment["segmentId"] = segment["impArrivalManifestBySegmentId"];
          newShipment["index"] = count + '. ' + segment["boardingPoint"];
          newShipment["boardingPoint"] = segment["boardingPoint"];
          newShipment["uldCount"] = segment["uldCount"];
          newShipment["looseCargoCount"] = segment["looseCargoCount"];
          newShipment["cargoInULD"] = segment["cargoInULD"];
          newShipment["segmentUldGruopDetailsCount"] = segment["segmentUldGruopDetailsCount"];
          newShipment["segmentPieceCount"] = segment["segmentPieceCount"];
          newShipment["segmentWeight"] = Number(NgcUtility.getDisplayWeight(segment["segmentWeight"]));
          newShipment["uldNumber"] = "Loose Shipment";
          newShipment["uldRemarks"] = "";
          newShipment["pieceCount"] = "";
          newShipment["shipmentCount"] = "";
          newShipment["pieceCount"] = null;
          newShipment["weightt"] = null;
          newShipment["weight"] = Number(NgcUtility.getDisplayWeight(newShipment["weight"]));
          if (NgcUtility.isTenantCityOrAirport(newShipment.destination)) {
            newShipment.carrierDestination = '';
          }
          this.segmentInformation.push(newShipment);
        }
      }
      for (let uld of segment.manifestedUlds) {
        for (let shipmentData of uld.shipments) {
          let newShipment = Object.assign({}, shipmentData);
          //
          newShipment["segmentId"] = segment["impArrivalManifestBySegmentId"];
          newShipment["index"] = count + '. ' + segment["boardingPoint"];
          newShipment["uldNumber"] = uld["uldNumber"];
          newShipment["uldRemarks"] = uld["uldRemarks"];
          newShipment["pieceCount"] = uld["pieceCount"];
          newShipment["boardingPoint"] = segment["boardingPoint"];
          newShipment["uldCount"] = segment["uldCount"];
          newShipment["looseCargoCount"] = segment["looseCargoCount"];
          newShipment["cargoInULD"] = segment["cargoInULD"];
          newShipment["segmentUldGruopDetailsCount"] = segment["segmentUldGruopDetailsCount"];
          newShipment["segmentPieceCount"] = segment["segmentPieceCount"];
          newShipment["segmentWeight"] = Number(NgcUtility.getDisplayWeight(segment["segmentWeight"]));
          newShipment["shipmentCount"] = uld["shipmentCount"];
          newShipment["pieceCount"] = uld["pieceCount"];
          newShipment["weightt"] = Number(NgcUtility.getDisplayWeight(uld["weight"]));
          newShipment["segment"] = segment["impArrivalManifestBySegmentId"];
          newShipment["weight"] = Number(NgcUtility.getDisplayWeight(newShipment["weight"]));

          //
          if (NgcUtility.isTenantCityOrAirport(newShipment.destination)) {
            newShipment.carrierDestination = '';
          }
          this.segmentInformation.push(newShipment);
        }
      }

      if (segment.manifestedUlds.length == 0 && segment.bulkShipments.length == 0 && segment.nilCargo) {
        let newShipment = Object.assign({}, null);
        newShipment["boardingPoint"] = segment["boardingPoint"];
        newShipment["index"] = count + '. ' + segment["boardingPoint"];
        newShipment["uldNumber"] = "NIL Cargo";
        newShipment["uldRemarks"] = null;
        newShipment["pieceCount"] = null;
        newShipment["uldCount"] = null;
        newShipment["looseCargoCount"] = null;
        newShipment["cargoInULD"] = null;
        newShipment["segmentUldGruopDetailsCount"] = null;
        newShipment["segmentPieceCount"] = null;
        newShipment["segmentWeight"] = null;
        newShipment["shipmentCount"] = null;
        newShipment["pieceCount"] = null;
        newShipment["weightt"] = null;
        newShipment["segment"] = null;
        newShipment["weight"] = null;
        newShipment["shipmentNumber"] = null;
        newShipment["origin"] = null;
        newShipment["destination"] = null;
        newShipment["onwardMovement"] = null;
        newShipment["shipmentDescriptionCode"] = null;
        newShipment["piece"] = null;
        newShipment["weightUnitCode"] = null;
        newShipment["totalPieces"] = null;
        newShipment["natureOfGoodsDescription"] = null;
        newShipment["carrierDestination"] = null;
        newShipment["shcCode"] = null;
        newShipment["handledByMasterHouse"] = null;
        newShipment["handledByDOMINT"] = null;
        this.segmentInformation.push(newShipment);
      }
    }

    (<NgcFormArray>this.arrivalManifestData.get("uldResultList")).patchValue(
      this.segmentInformation
    );
    console.log(<NgcFormArray>this.arrivalManifestData.get("uldResultList"));
  }


  public loadCreate(): void {
    let flightSearchData: ArrivalManifestFlight = new ArrivalManifestFlight();

    flightSearchData.flightNumber = this.arrivalManifestData.get(
      "searchArrivalData.flight"
    ).value;
    flightSearchData.flightDate = this.arrivalManifestData.get(
      "searchArrivalData.date"
    ).value;
    let shipmentData = {
      flightNumber: this.arrivalManifestData.get("searchArrivalData.flight")
        .value,
      flightDate: this.arrivalManifestData.get("searchArrivalData.date").value
    };
    //this.router.navigate(['import', 'createarrival',shipmentData]);
    if (shipmentData.flightNumber && shipmentData.flightDate) {
      this.importService.checkValidFlight(flightSearchData).subscribe(
        data => {
          console.log(data);
          this.refreshFormMessages(data);
          if (data.messageList == null) {
            let url = "/import/createarrival";
            this.navigateTo(this.router, url, shipmentData);
          }
        },
        error => {
          this.showErrorStatus(error);
        }
      );

    } else {
      this.showErrorStatus("error.import.enter.flight.details");
      return;
    }

  }

  public onBack(event) {
    this.navigateBack(this.arrivalManifestData.getRawValue());
  }

  public print() {
    let intlDomFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_DomesticInternationalHandling);
    let hawbHandlingFlag = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling);
    if (this.arrivalManifestData.get(['flightData', 'typeReport']).value != null) {
      if (this.arrivalManifestData.get(['flightData', 'typeReport']).value === 'Loose and ULD') {
        this.reportParameters = new Object();
        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_House_Enable)) {
          this.reportParameters.isHawbEnable = true;
        }
        this.reportParameters.intlDomFlag = intlDomFlag;
        this.reportParameters.hawbHandlingFlag = hawbHandlingFlag;
        this.reportParameters.flightkey = this.arrivalManifestData.get("searchArrivalData.flight").value;
        this.reportParameters.flightorigindate = this.arrivalManifestData.get("searchArrivalData.date").value;
        this.reportParameters.customerId = this.getUserProfile().userLoginCode;
        this.reportParameters.flightId = this.resp.flightId;
        if (this.arrivalManifestData.get("searchArrivalData.shc").value != null) {
          this.reportParameters.shc = this.arrivalManifestData.get("searchArrivalData.shc").value;
        } else {
          this.reportParameters.shc = ''
        }
        this.reportWindow.open();

      }
      else if (this.arrivalManifestData.get(['flightData', 'typeReport']).value === 'Loose Only') {
        this.reportParameters = new Object();
        this.reportParameters.intlDomFlag = intlDomFlag;
        this.reportParameters.hawbHandlingFlag = hawbHandlingFlag;
        this.reportParameters.flightkey = this.arrivalManifestData.get("searchArrivalData.flight").value;
        this.reportParameters.flightorigindate = this.arrivalManifestData.get("searchArrivalData.date").value;
        this.reportParameters.customerId = this.getUserProfile().userLoginCode;
        this.reportParameters.flightId = this.resp.flightId;
        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_House_Enable)) {
          this.reportParameters.isHawbEnable = true;
        }
        if (this.arrivalManifestData.get("searchArrivalData.shc").value != null) {
          this.reportParameters.shc = this.arrivalManifestData.get("searchArrivalData.shc").value;
        } else {
          this.reportParameters.shc = ''
        }
        this.looseReport.open();
      }

      else if (this.arrivalManifestData.get(['flightData', 'typeReport']).value === 'ULD Only') {
        this.reportParameters = new Object();
        this.reportParameters = new Object();
        this.reportParameters.intlDomFlag = intlDomFlag;
        this.reportParameters.hawbHandlingFlag = hawbHandlingFlag;
        this.reportParameters.flightkey = this.arrivalManifestData.get("searchArrivalData.flight").value;
        this.reportParameters.flightorigindate = this.arrivalManifestData.get("searchArrivalData.date").value;
        this.reportParameters.customerId = this.getUserProfile().userLoginCode;
        this.reportParameters.flightId = this.resp.flightId;
        if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_House_Enable)) {
          this.reportParameters.isHawbEnable = true;
        }
        if (this.arrivalManifestData.get("searchArrivalData.shc").value != null) {
          this.reportParameters.shc = this.arrivalManifestData.get("searchArrivalData.shc").value;
        } else {
          this.reportParameters.shc = ''
        }
        this.uldReport.open();
      }
    }
    else {
      this.showErrorStatus("error.import.select.type.of.report");
    }
  }

  public Bondedmanifestreport() {
    // let intlDomFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_DomesticInternationalHandling);
    // let hawbHandlingFlag = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling);

    this.reportParameters = new Object();
    // if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_House_Enable)) {
    //   this.reportParameters.isHawbEnable = true;
    // }
    // this.reportParameters.intlDomFlag = intlDomFlag;
    // this.reportParameters.hawbHandlingFlag = hawbHandlingFlag;
    this.reportParameters.flightkey = this.arrivalManifestData.get("searchArrivalData.flight").value;
    this.reportParameters.flightorigindate = this.arrivalManifestData.get("searchArrivalData.date").value;
    this.reportParameters.customerId = this.getUserProfile().userLoginCode;
    this.reportParameters.flightId = this.resp.flightId;
    // if (this.arrivalManifestData.get("searchArrivalData.shc").value != null) {
    //   this.reportParameters.shc = this.arrivalManifestData.get("searchArrivalData.shc").value;
    // } else {
    //   this.reportParameters.shc = ''
    // }
    this.customsReportWindow.open();

  }



  public navigateToDocument() {
    let flightSearchData: ArrivalManifestFlight = new ArrivalManifestFlight();

    flightSearchData.flightNumber = this.arrivalManifestData.get(
      "searchArrivalData.flight"
    ).value;
    flightSearchData.flightDate = this.arrivalManifestData.get(
      "searchArrivalData.date"
    ).value;
    let shipmentData = {
      flightNumber: this.arrivalManifestData.get("searchArrivalData.flight")
        .value,
      flightDate: this.arrivalManifestData.get("searchArrivalData.date").value
    };
    this.navigateTo(this.router, "/import/documentverification", shipmentData);
  }

  public onDestinationChange(event, index: any, arrivalManifestData: any, type: any) {
    // console.log(type);
    // console.log(index);
    let loose = arrivalManifestData.value.looseShipments;
    let uld = arrivalManifestData.value.uldShipments;
    let flightData: ArrivalManifestData = new ArrivalManifestData();
    let segment: SegmentData = new SegmentData();
    let uldData: UldModel = new UldModel();
    let shipment: ShipmentModel = new ShipmentModel();
    let segments: Array<SegmentData> = new Array<SegmentData>();
    let manifestedUlds: Array<UldModel> = new Array<UldModel>();
    let bulkShipments: Array<ShipmentModel> = new Array<ShipmentModel>();
    const rawData = this.arrivalManifestData.getRawValue();
    let flightDetails = rawData.flightData;
    //console.log(flightDetails);
    flightData.flightId = flightDetails.flightId;
    flightData.carrierCode = flightDetails.carrierCode;
    flightData.flightDate = this.arrivalManifestData.get("searchArrivalData.date").value;
    flightData.flightNo = flightDetails.flightNo;
    flightData.flightType = flightDetails.flightType;
    if (type == "L") {
      shipment = loose[index];
      bulkShipments.push(shipment);
      segment.bulkShipments = bulkShipments;
      segments.push(segment);
    } else if (type == "U") {
      shipment = uld[index];
      uldData.uldNumber = uld[index].uldNumber;
      bulkShipments.push(shipment);
      uldData.shipments = bulkShipments;
      manifestedUlds.push(uldData);
      segment.manifestedUlds = manifestedUlds;
      segments.push(segment);
    }
    flightData.segments = segments;
    this.importService.fetchRoutingInformation(flightData).subscribe(response => {
      console.log(response);
      if (!this.showResponseErrorMessages(response)) {
        if (response.data) {
          if (type == 'L') {
            (this.arrivalManifestData.get(["looseShipments", index, "carrierDestination"]) as NgcFormGroup).setValue(response.data.carrierDestination);
            (this.arrivalManifestData.get(["looseShipments", index, "carrierCode"]) as NgcFormGroup).setValue(response.data.carrierCode);
            (this.arrivalManifestData.get(["looseShipments", index, "movementInfo"]) as NgcFormArray).patchValue(response.data.movementInfo);
          } else if (type == 'U') {
            (this.arrivalManifestData.get(["uldShipments", index, "carrierDestination"]) as NgcFormGroup).setValue(response.data.carrierDestination);
            (this.arrivalManifestData.get(["uldShipments", index, "carrierCode"]) as NgcFormGroup).setValue(response.data.carrierCode);
            (this.arrivalManifestData.get(["uldShipments", index, "movementInfo"]) as NgcFormArray).patchValue(response.data.movementInfo);
          }
        } else {
          if (type == 'L') {
            (this.arrivalManifestData.get(["looseShipments", index, "carrierDestination"]) as NgcFormGroup).setValue(null);
            (this.arrivalManifestData.get(["looseShipments", index, "carrierCode"]) as NgcFormGroup).setValue(null);
          } else if (type == 'U') {
            (this.arrivalManifestData.get(["uldShipments", index, "carrierDestination"]) as NgcFormGroup).setValue(null);
            (this.arrivalManifestData.get(["uldShipments", index, "carrierCode"]) as NgcFormGroup).setValue(null);
          }
        }
      }
    }, (error) => {
      this.showErrorStatus(error);
    });
  }

  public onPieceChange(event, index: any, arrivalManifestData: any, type: any): void {
    const shipmentData = (this.arrivalManifestData.get(["looseShipments", index]) as NgcFormGroup).getRawValue();
    if (shipmentData.shipmentDescriptionCode == null || shipmentData.shipmentDescriptionCode == "T") {
      const totalPieces = (this.arrivalManifestData.get(["looseShipments", index, "totalPieces"]) as NgcFormGroup).value;
      (this.arrivalManifestData.get(["looseShipments", index, "totalPieces"]) as NgcFormGroup).setValue(event);
      (this.arrivalManifestData.get(["looseShipments", index, "totalPieces"]) as NgcFormGroup).disable();
    }

  }

  public onDescriptionChange(event, index: any, arrivalManifestData: any, type: any): void {
    const shipmentData = (this.arrivalManifestData.get(["looseShipments", index]) as NgcFormGroup).getRawValue();
    if (event) {
      const totalPieces = (this.arrivalManifestData.get(["looseShipments", index, "totalPieces"]) as NgcFormGroup).value;
      console.log(totalPieces);
      if (totalPieces) {
        (this.arrivalManifestData.get(["looseShipments", index, "totalPieces"]) as NgcFormGroup).enable();
      }
    } else {
      (this.arrivalManifestData.get(["looseShipments", index, "totalPieces"]) as NgcFormGroup).setValue(shipmentData.piece);
      (this.arrivalManifestData.get(["looseShipments", index, "totalPieces"]) as NgcFormGroup).disable();
    }

  }

  public onULDPieceChange(event, index: any, arrivalManifestData: any, type: any): void {
    const shipmentData = (this.arrivalManifestData.get(["uldShipments", index]) as NgcFormGroup).getRawValue();
    if (shipmentData.shipmentDescriptionCode == null || shipmentData.shipmentDescriptionCode == "" || shipmentData.shipmentDescriptionCode == "T") {
      const totalPieces = (this.arrivalManifestData.get(["uldShipments", index, "totalPieces"]) as NgcFormGroup).value;
      (this.arrivalManifestData.get(["uldShipments", index, "totalPieces"]) as NgcFormGroup).setValue(event);
      (this.arrivalManifestData.get(["uldShipments", index, "totalPieces"]) as NgcFormGroup).disable();
    }

  }

  public onULDDescriptionChange(event, index: any, arrivalManifestData: any, type: any): void {
    const shipmentData = (this.arrivalManifestData.get(["uldShipments", index]) as NgcFormGroup).getRawValue();
    if (event) {
      const totalPieces = (this.arrivalManifestData.get(["uldShipments", index]) as NgcFormGroup).value;
      console.log(totalPieces);
      if (totalPieces) {
        (this.arrivalManifestData.get(["uldShipments", index, "totalPieces"]) as NgcFormGroup).enable();
      }
    } else {
      (this.arrivalManifestData.get(["uldShipments", index, "totalPieces"]) as NgcFormGroup).setValue(shipmentData.piece);
      (this.arrivalManifestData.get(["uldShipments", index, "totalPieces"]) as NgcFormGroup).disable();
    }

  }

  onUpdateShipmentSave() {

    let flightData: ArrivalManifestData = new ArrivalManifestData();
    let segment: SegmentData = new SegmentData();
    let segments: Array<SegmentData> = new Array<SegmentData>();
    let uldData: UldModel = new UldModel();
    let shipment: ShipmentModel = new ShipmentModel();
    let manifestedUlds: Array<UldModel> = new Array<UldModel>();
    let bulkShipments: Array<ShipmentModel> = new Array<ShipmentModel>();
    let uldShipmentList: Array<ShipmentModel> = new Array<ShipmentModel>();
    const rawData = this.arrivalManifestData.getRawValue();
    console.log(rawData);
    let flightDetails = rawData.flightData;
    let segmentDeatils = rawData.flightData.segments[0];
    flightData.flightId = flightDetails.flightId;
    flightData.carrierCode = flightDetails.carrierCode;
    flightData.flightDate = flightDetails.flightDate;
    flightData.flightNumber = flightDetails.flightNumber;
    flightData.flightNo = flightDetails.flightNo;
    flightData.flightType = flightDetails.flightType;
    flightData.flagCRUD = "R";
    segment.impArrivalManifestByFlightId = flightDetails.flightId;
    if (rawData.looseShipments.length > 0) {
      segment.segmentId = rawData.looseShipments[0].segmentId;
      segment.impArrivalManifestBySegmentId = rawData.looseShipments[0].segmentId;
      segment.boardingPoint = segmentDeatils.boardingPoint;
      segment.offPoint = segmentDeatils.offPoint;
      if (rawData.looseShipments[0].carrierDestination == '') {
        rawData.looseShipments[0].carrierDestination = null
      }
      bulkShipments.push(rawData.looseShipments[0]);
    }
    segment.bulkShipments = bulkShipments;
    rawData.uldShipments.forEach(element => {
      uldShipmentList = [];
      let uldData: UldModel = new UldModel();
      segment.segmentId = element.segmentId;
      segment.impArrivalManifestBySegmentId = element.segmentId;
      segment.boardingPoint = segmentDeatils.boardingPoint;
      segment.offPoint = segmentDeatils.offPoint;
      uldData.uldNumber = element.uldNumber;
      uldData.impArrivalManifestUldId = element.impArrivalManifestUldId;
      if (element.carrierDestination == '') {
        element.carrierDestination = null;
      }
      uldShipmentList.push(element);
      uldData.shipments = uldShipmentList;
      manifestedUlds.push(uldData);
    });
    segment.manifestedUlds = manifestedUlds;
    segments.push(segment);
    flightData.segments = segments;
    console.log(segments);
    //Calling arrival manifest Service for inserting data to manifest
    this.importService.saveULD(flightData).subscribe(response => {
      //console.log(response);
      if (!this.showResponseErrorMessages(response)) {
        this.editShipmentsWindow.close();
        this.onSearch();
        this.showSuccessStatus('shipment.updated.successfully');
      }
    }, (error) => {
      this.showErrorStatus(error);
    });

  }


  deleteShipmentData(shipmentData: any) {
    //console.log(shipmentData);
    this.showConfirmMessage('delete.this.shipment').then(reason => {
      let flightData: ArrivalManifestData = new ArrivalManifestData();
      let segment: SegmentData = new SegmentData();
      let segments: Array<SegmentData> = new Array<SegmentData>();
      let uldData: UldModel = new UldModel();
      let shipment: ShipmentModel = new ShipmentModel();
      let manifestedUlds: Array<UldModel> = new Array<UldModel>();
      let bulkShipments: Array<ShipmentModel> = new Array<ShipmentModel>();
      let uldShipmentList: Array<ShipmentModel> = new Array<ShipmentModel>();
      let shcCode: ShcData = new ShcData();
      let shcCodes: Array<ShcData> = new Array<ShcData>();
      const rawData = this.arrivalManifestData.getRawValue();
      //console.log(rawData.uldResultList);
      let flightDetails = rawData.flightData;
      let segmentDeatils = rawData.flightData.segments[0];
      flightData.flightId = flightDetails.flightId;
      flightData.carrierCode = flightDetails.carrierCode;
      flightData.flightDate = flightDetails.flightDate;
      flightData.flightNumber = flightDetails.flightNumber;
      flightData.flightNo = flightDetails.flightNo;
      flightData.flightType = flightDetails.flightType;
      flightData.flagCRUD = "U";
      if (shipmentData.uldNumber == 'Loose Shipment') {
        this.resp.segments.forEach(indexShipment => {
          segment.impArrivalManifestByFlightId = flightDetails.flightId;
          segment.segmentId = indexShipment.impArrivalManifestBySegmentId;
          segment.impArrivalManifestBySegmentId = indexShipment.impArrivalManifestBySegmentId;
          segment.boardingPoint = indexShipment.boardingPoint;
          segment.offPoint = indexShipment.offPoint;
          indexShipment.bulkShipments.forEach(element => {
            if (element.shipmentNumber == shipmentData.shipmentNumber) {
              element.carrierDestination = null;
              element.flagCRUD = 'D';
            } else {
              element.carrierDestination = null;
            }
            bulkShipments.push(element);
          });
        });
      }
      segment.bulkShipments = bulkShipments;
      if (shipmentData.uldNumber != 'Loose Shipment') {
        this.resp.segments.forEach(indexSegment => {
          segment.impArrivalManifestByFlightId = flightDetails.flightId;
          segment.segmentId = indexSegment.impArrivalManifestBySegmentId;
          segment.impArrivalManifestBySegmentId = indexSegment.impArrivalManifestBySegmentId;
          segment.boardingPoint = indexSegment.boardingPoint;
          segment.offPoint = indexSegment.offPoint;
          indexSegment.manifestedUlds.forEach(element => {
            if (element.uldNumber == shipmentData.uldNumber) {
              element.flagCRUD = 'U';
              element.shipments.forEach(shipment => {
                if (shipment.shipmentNumber == shipmentData.shipmentNumber) {
                  shipment.carrierDestination = null;
                  shipment.flagCRUD = 'D';
                } else {
                  shipment.carrierDestination = null;
                }
              });
              uldData = element;
            }
          });
        });
        manifestedUlds.push(uldData);
      }
      segment.manifestedUlds = manifestedUlds;
      segments.push(segment);
      console.log(segments);
      flightData.segments = segments;
      //Calling arrival manifest Service for inserting data to manifest 
      this.importService.saveULD(flightData).subscribe(response => {
        //console.log(response);
        if (!this.showResponseErrorMessages(response)) {
          this.onSearch();
          this.showSuccessStatus('shipment.deleted.successfully');
        }
      }, (error) => {
        this.showErrorStatus(error);
      });

    }).catch(reason => {
      return;
    });
  }

  someMethodWithFocusOutEvent() {
    //this.arrivalManifestData.get("searchArrivalData.date").setValue(new Date());
  }

  onChangeFlight() {
    this.dataSyncSearch = 0;
  }

  createShipments() {
    this.onSearch();
    this.searchList = this.resp;
    this.navigateTo(this.router, 'import/createmanifest', this.searchList);
  }

}
