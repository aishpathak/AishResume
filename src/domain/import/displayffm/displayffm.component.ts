import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  OnDestroy,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Validators } from "@angular/forms";

// NGC framework imports
import {
  NgcUtility,
  NgcFormGroup,
  NgcFormArray,
  NgcApplication,
  NgcWindowComponent,
  NgcButtonComponent,
  NgcPage,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  PageConfiguration,
  NgcFormControl,
  BaseRequest,
  CellsRendererStyle,
  ErrorMessage,
  NgcReportComponent
} from "ngc-framework";
import { CellsStyleClass } from "../../../shared/shared.data";
import { ImportService } from "../import.service";
import { InterfaceService } from '../../interface/interface.service';
import { DisplayffmFlight, SegmentData, ArrivalManifestData, ShipmentModel, UldModel, ArrivalManifestFlight, AirlineFlightManifest, DestinationHeaderInformation, Flight, DestinationHeader } from "../import.sharedmodel";
import { FORMERR } from "dns";
import { Shipment } from "../../export/export.sharedmodel";
import { ApplicationFeatures } from "../../common/applicationfeatures";

@Component({
  selector: "app-displayffm",
  templateUrl: "./displayffm.component.html",
  styleUrls: ["./displayffm.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class DisplayffmComponent extends NgcPage implements OnInit {
  segmentInformation: any[] = [];
  resp: any;
  responseArray: any[];
  @ViewChild("additionalInformationWindow")
  additionalInformationWindow: NgcWindowComponent;
  displayFFMList: any[];
  displayCompleteList: any[];
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
  FlightId: Number;
  aircraftRegCode: string;
  sourceIdULDDropdown: any;
  shcCode: string;
  onwardMovement: string;
  destination: string;
  tempData: any[] = [];
  defaultFromDate = new Date();
  isRecordsSelected: boolean = false;
  tempULDNumber: string;
  count: Number = 0;
  flightStatus: string;
  flightULDCount: number;
  flightLooseCargoCount: number;
  flightCargoInULD: number;
  flightPieces: number;
  flightWeight: number;
  LooseCargoShipments: any[] = [];
  reportParameters: any;
  isFFMReceived: boolean = false;
  isFFMRejected: boolean = false;
  isNotFFMReceived: boolean = false;
  segmentId: number = 0;
  messageCopy: number = 0;
  segmentIdForReplace: number = 0;
  messageCopyForReplace: number = 0;
  messageStatus: string;
  isProcessed: boolean = true;
  isnilCargo: boolean = false;
  ffmTimeStamp: string;
  response: any;
  routedInformation: any;
  shipmentCustomSubmissionDt: boolean = false;
  aircraftRegCodeFlag: boolean = false;
  private PreArrivalManifestRptInDisplayFFMEnabled: boolean = false;

  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  @ViewChild('reportWindow3') reportWindow3: NgcReportComponent;
  @ViewChild('reportWindow4') reportWindow4: NgcReportComponent;
  shipmentData: any;
  sourceParameter: {};
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private interfaceService: InterfaceService,
    private activatedRoute: ActivatedRoute, private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    const forwardedData = this.getNavigateData(this.activatedRoute);
    this.PreArrivalManifestRptInDisplayFFMEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_PreArrivalManifestRptInDisplayFFM);
    this.routedInformation = this.getNavigateData(this.activatedRoute);
    if (forwardedData && forwardedData.flightNumber && forwardedData.flightDate) {
      this.displayffmForm.get(['searchDisplayffm', 'flight']).setValue(forwardedData.flightNumber);
      this.displayffmForm.get(['searchDisplayffm', 'date']).setValue(forwardedData.flightDate);
      this.onSearch();
    } else if (forwardedData && forwardedData.flightKey && forwardedData.flightDate) {
      this.displayffmForm.get(['searchDisplayffm', 'flight']).setValue(forwardedData.flightKey);
      this.displayffmForm.get(['searchDisplayffm', 'date']).setValue(forwardedData.flightDate);
      this.onSearch();
    }
  }
  // tslint:disable-next-line:member-ordering
  private displayffmForm: NgcFormGroup = new NgcFormGroup({
    searchDisplayffm: new NgcFormGroup({
      flight: new NgcFormControl(),
      date: new NgcFormControl(this.defaultFromDate),
      flightStatus: new NgcFormControl(),
      typeReport: new NgcFormControl(),
      segment: new NgcFormControl(),
      shipmentCustomSubmissionDt: new NgcFormControl(),
    }),

    ffmReceivedDetails: new NgcFormArray([
      new NgcFormGroup({
        segmentReceived: new NgcFormControl(),
        segmentId: new NgcFormControl(),
        ffmVersionDetails: new NgcFormArray([
          new NgcFormGroup({
            segmentId: new NgcFormControl(),
            messageSequence: new NgcFormControl(),
            messageVersion: new NgcFormControl(),
            messageStatus: new NgcFormControl(),
            messageCopy: new NgcFormControl(),
            messageVersionWithCopy: new NgcFormControl(),
          })
        ])
      })
    ]),

    ffmRejectedDetails: new NgcFormArray([
      new NgcFormGroup({
        segmentRejected: new NgcFormControl(),
        segmentId: new NgcFormControl(),
      })
    ]),

    flightData: new NgcFormGroup({
      flightNumber: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      sta: new NgcFormControl(),
      eta: new NgcFormControl(),
      ata: new NgcFormControl(),
      segment: new NgcFormControl(),
      aircraftRegCode: new NgcFormControl(),
      messageCopy: new NgcFormControl(),
      ffmAircraftRegCode: new NgcFormControl(),
    }),

    segmentsList: new NgcFormGroup({
      flightSegmentId: new NgcFormControl(),
    }),

    flightLevelCount: new NgcFormGroup({
      flightULDCount: new NgcFormControl(),
      flightLooseCargoCount: new NgcFormControl(),
      flightCargoInULD: new NgcFormControl(),
      flightPieces: new NgcFormControl(),
      flightWeight: new NgcFormControl()
    }),
    additionalInfoData: new NgcFormGroup({
      densityGroup: new NgcFormControl(),
      volume: new NgcFormControl(),
      volumeUnitCode: new NgcFormControl(),
      customsReference: new NgcFormControl(),
      customsOrigin: new NgcFormControl(),
      movementPriorityCode: new NgcFormControl()
    }),
    uldResultList: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        boardingPoint: new NgcFormControl(),
        uldNumber: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        shipmentDescriptionCode: new NgcFormControl(),
        piece: new NgcFormControl(),
        weight: new NgcFormControl(),
        weightUnitCode: new NgcFormControl(),
        totalPieces: new NgcFormControl(),
        natureOfGoodsDescription: new NgcFormControl(),
        shc: new NgcFormControl(),
        onwardMovement: new NgcFormControl(),
        additionalInfo: new NgcFormControl(),
        checkBoxValue: new NgcFormControl(),
        shcCode: new NgcFormControl(),
        flagCRUD: new NgcFormControl(),
        flightSegmentOrder: new NgcFormControl()
      })
    ]),
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
    ])
  });
  // tslint:disable-next-line:cyclomatic-complexity
  public onAdditionalInformationPopUp(event): void {
    this.dimensionInformation = [];
    this.ociInformation = [];
    this.onwardInformation = [];
    this.osiInformation = [];
    this.shipmentInformation = [];
    for (let index = 0; index < this.segmentInformation.length; index++) {
      this.shipmentInformation.push(this.segmentInformation[index]);
    }
    this.shipmentRowId = event.record.NGC_ROW_ID;
    this.displayffmForm.get("additionalInfoData").reset();
    this.displayffmForm
      .get("additionalInfoData.densityGroup")
      .setValue(
        this.shipmentInformation[event.record.NGC_ROW_ID].densityGroupCode
      );
    this.displayffmForm
      .get("additionalInfoData.volume")
      .setValue(this.shipmentInformation[event.record.NGC_ROW_ID].volumeAmount);
    this.displayffmForm
      .get("additionalInfoData.volumeUnitCode")
      .setValue(
        this.shipmentInformation[event.record.NGC_ROW_ID].volumeunitCode
      );
    this.displayffmForm
      .get("additionalInfoData.customsReference")
      .setValue(
        this.shipmentInformation[event.record.NGC_ROW_ID].customsReference
      );
    this.displayffmForm
      .get("additionalInfoData.customsOrigin")
      .setValue(
        this.shipmentInformation[event.record.NGC_ROW_ID].customsOriginCode
      );
    this.displayffmForm
      .get("additionalInfoData.movementPriorityCode")
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
          .flagCRUD !== "D"
      ) {
        this.shipmentInformation[event.record.NGC_ROW_ID].dimensions[
          item
        ].checkBoxValue = false;
        this.dimensionInformation.push(
          this.shipmentInformation[event.record.NGC_ROW_ID].dimensions[item]
        );
      }
    }
    if (this.dimensionInformation.length === 1) {
      (<NgcFormArray>this.displayffmForm.controls[
        "dimensionResultList"
      ]).patchValue(this.dimensionInformation);
      this.onAdddimension();
    } else {
      (<NgcFormArray>this.displayffmForm.controls[
        "dimensionResultList"
      ]).patchValue(this.dimensionInformation);
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
    if (this.osiInformation.length === 1) {
      (<NgcFormArray>this.displayffmForm.controls["osiResultList"]).patchValue(
        this.osiInformation
      );
      this.onAddOSI();
    } else {
      (<NgcFormArray>this.displayffmForm.controls["osiResultList"]).patchValue(
        this.osiInformation
      );
    }
    for (
      let item = 0;
      item <
      this.shipmentInformation[event.record.NGC_ROW_ID].movementInfo.length;
      item++
    ) {
      if (
        this.shipmentInformation[event.record.NGC_ROW_ID].movementInfo[item]
          .flagCRUD !== "D"
      ) {
        this.shipmentInformation[event.record.NGC_ROW_ID].movementInfo[
          item
        ].checkBoxValue = false;
        this.onwardInformation.push(
          this.shipmentInformation[event.record.NGC_ROW_ID].movementInfo[item]
        );
      }
    }
    if (this.onwardInformation.length === 1) {
      (<NgcFormArray>this.displayffmForm.controls[
        "onwardMvmtResultList"
      ]).patchValue(this.onwardInformation);
      this.onAddmovement();
    } else {
      (<NgcFormArray>this.displayffmForm.controls[
        "onwardMvmtResultList"
      ]).patchValue(this.onwardInformation);
    }
    for (
      let item = 0;
      item < this.shipmentInformation[event.record.NGC_ROW_ID].oci.length;
      item++
    ) {
      if (
        this.shipmentInformation[event.record.NGC_ROW_ID].oci[item].flagCRUD !==
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
    if (this.ociInformation.length === 1) {
      (<NgcFormArray>this.displayffmForm.controls["ociResultList"]).patchValue(
        this.ociInformation
      );
      this.onAddoci();
    } else {
      (<NgcFormArray>this.displayffmForm.controls["ociResultList"]).patchValue(
        this.ociInformation
      );
    }
    this.additionalInformationWindow.open();
  }
  public onAddOSI(): void {
    (<NgcFormArray>this.displayffmForm.get("osiResultList")).addValue([
      {
        remarks: ""
      }
    ]);
  }
  public onAdddimension(): void {
    (<NgcFormArray>this.displayffmForm.get("dimensionResultList")).addValue([
      {
        weight: "",
        weightUnitCode: "",
        length: "",
        width: "",
        height: "",
        measurementUnitCode: "",
        noOfPieces: ""
      }
    ]);
  }
  public onAddmovement(): void {
    (<NgcFormArray>this.displayffmForm.get("onwardMvmtResultList")).addValue([
      {
        airportCityCode: "",
        carrierCode: "",
        flightNumber: "",
        departureDate: ""
      }
    ]);
  }
  public onAddoci(): void {
    (<NgcFormArray>this.displayffmForm.get("ociResultList")).addValue([
      {
        countryCode: "",
        informationIdentifier: "",
        csrciIdentifier: "",
        scsrcInformation: ""
      }
    ]);
  }
  // tslint:disable-next-line:cyclomatic-complexity

  protected groupsRenderer = (
    value: any,
    rowData: any,
    level: any,
    groupData: any
  ): any => {
    rowData.data.uldRemarks = rowData.data.uldRemarks ? rowData.data.uldRemarks : ''
    if (level == 1) {
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
          "&nbsp&nbsp;&nbsp&nbsp;ULD Shipment-" +
          rowData.data.cargoInULD +
          "&nbsp;&nbsp;&nbsp&nbsp;Pieces-" +
          rowData.data.segmentPieceCount +
          "&nbsp;&nbsp;&nbsp&nbsp;Weight-" +
          rowData.data.segmentWeight
        ).bold();
      }

    }
  };
  // tslint:disable-next-line:cyclomatic-complexity
  onSearch() {
    this.isFFMRejected = false;
    (<NgcFormArray>this.displayffmForm.get("uldResultList")).resetValue([]);
    (<NgcFormArray>this.displayffmForm.get("ffmReceivedDetails")).resetValue([]);
    this.displayffmForm.get("searchDisplayffm.segment").patchValue([]);
    const displayffmList: DisplayffmFlight = new DisplayffmFlight();
    displayffmList.flightNumber = this.displayffmForm.get("searchDisplayffm.flight").value;
    displayffmList.flightDate = this.displayffmForm.get("searchDisplayffm.date").value;
    displayffmList.segmentId = this.segmentId;
    displayffmList.segmentId = displayffmList.segmentId ? displayffmList.segmentId : 0;
    if (this.messageStatus) {
      displayffmList.typeOfFFM = this.messageStatus;
    } else {
      displayffmList.typeOfFFM = 'PROCESSED';
    }
    displayffmList.segmentCopy = this.messageCopy;
    if (
      displayffmList.flightNumber === "" ||
      displayffmList.flightDate === null
    ) {
      this.showErrorStatus("error.import.enter.mandatory.fields");
      return;
    }
    //console.log(JSON.stringify(displayffmList));
    this.importService.getAllDisplayffmList(displayffmList).subscribe(
      // tslint:disable-next-line:cyclomatic-complexity
      data => {
        console.log(this.resp);
        this.resp = data;
        this.responseArray = this.resp.data;
        this.refreshFormMessages(data);
        this.shipmentInformation = [];
        this.shipmentCustomSubmissionDt = this.responseArray[0].shipmentCustomSubmissionDt
        if (!data.data[0]) {
          this.showErrorStatus("no.record.found");
          (<NgcFormArray>this.displayffmForm.get("uldResultList")).patchValue(null);
          this.isFlightInformation = false;
          this.isShipmentInformation = false;
          return;
        }
        if (data.data[0]) {
          this.sourceIdSegmentDropdown = this.createSourceParameter(
            this.displayffmForm.get("searchDisplayffm.flight").value,
            this.displayffmForm.get("searchDisplayffm.date").value
          );
          this.retrieveDropDownListRecords('ARRIVAL_FLIGHTSEGMENT', 'query', this.sourceIdSegmentDropdown)
            .subscribe(value => {
              if (value.length == 1) {
                this.displayffmForm.get("searchDisplayffm.segment").patchValue(value[0].code);
              }
            })
        }
        if (data.data[0].ffmRejectedDetails && data.data[0].ffmRejectedDetails.length > 0) {
          this.isFFMRejected = true;
          this.displayffmForm.get('ffmRejectedDetails').patchValue(data.data[0].ffmRejectedDetails);
        }
        if (data.data[0].ffmReceivedDetails && data.data[0].ffmReceivedDetails.length == 0 && !data.data[0].isFFMProcessed) {
          this.isFlightInformation = false;
          this.isFFMReceived = false;
          this.isShipmentInformation = false;
          return this.showErrorMessage("no.ffm.found")
        }

        if (data && data.data[0] && data.data[0].isFFMProcessed) {

          if (data.data[0].ffmReceivedDetails && data.data[0].ffmReceivedDetails.length > 0) {
            this.isFFMReceived = true;
            this.displayffmForm.get('ffmReceivedDetails').patchValue(data.data[0].ffmReceivedDetails);
          }

          this.FlightId = data.data[0].impFreightFlightManifestByFlightId;
          this.aircraftRegCode = data.data[0].aircraftRegCode;
          this.flightStatus = data.data[0].flightStatus;
          this.displayffmForm
            .get("flightLevelCount.flightCargoInULD")
            .setValue(data.data[0].cargoInULD);
          this.displayffmForm
            .get("flightLevelCount.flightLooseCargoCount")
            .setValue(data.data[0].looseCargo);
          this.displayffmForm
            .get("flightLevelCount.flightPieces")
            .setValue(data.data[0].pieceCount);
          this.displayffmForm
            .get("flightLevelCount.flightWeight")
            .setValue(data.data[0].weight);
          this.displayffmForm
            .get("flightLevelCount.flightULDCount")
            .setValue(data.data[0].uldCount);

          // data.data[0].ata = data.data[0].ata ? data.data[0].ata.substring(11, 16) : data.data[0].ata;
          // data.data[0].sta = data.data[0].sta ? data.data[0].sta.substring(11, 16) : data.data[0].sta;
          // data.data[0].eta = data.data[0].eta ? data.data[0].eta.substring(11, 16) : data.data[0].eta;
          //  data.data.flightDate = data.data.flightDate ? data.data.flightDate.substring(0, 10) : data.data.flightDate;
          // data.data.flightDate = this.displayffmForm.get('searchArrivalData.date').value;
          //data.data.flightNumber = this.displayffmForm.get('searchArrivalData.flight').value;
          this.isFlightInformation = true;
          for (let items = 0; items < data.data[0].segmentsList.length; items++) {
            for (let item = 0; item < data.data[0].segmentsList[items].segments.length; item++) {
              for (
                let index = 0;
                index < data.data[0].segmentsList[items].segments[item].freightmanifestedUlds.length;
                index++
              ) {
                for (
                  let k = 0;
                  k <
                  data.data[0].segmentsList[items].segments[item].freightmanifestedUlds[index].shipments
                    .length;
                  k++
                ) {
                  this.shipmentInformation.push(
                    data.data[0].segmentsList[items].segments[item].freightmanifestedUlds[index]
                      .shipments[k]
                  );
                }
                this.uldInformation.push(
                  data.data[0].segmentsList[items].segments[item].freightmanifestedUlds[index]
                );
              }
              this.segmentInformation.push(data.data[0].segmentsList[items].segments[item]);
            }
          }
          if (this.shipmentInformation.length > 0) {
            this.isShipmentInformation = true;
          } else {
            //  this.showErrorMessage('no.record.found');
            this.isShipmentInformation = false;
          }
          // this.isFlightInformation = true;
          this.aircraftRegCodeFlag = false;
          if (data.data[0] != null && data.data[0].aircraftRegCode != null && data.data[0].ffmAircraftRegCode != null) {
            console.log(data.data[0].aircraftRegCode.localeCompare(data.data[0].ffmAircraftRegCode));
            if (data.data[0].aircraftRegCode.localeCompare(data.data[0].ffmAircraftRegCode)) {
              this.aircraftRegCodeFlag = true;
            }

          }
          this.displayffmForm.get("flightData").patchValue(data.data[0]);
          this.retrieveDropDownListRecords("ARRIVAL_FLIGHTSEGMENT", "query", this.sourceIdSegmentDropdown).subscribe(data => {
            if (data.length == 1) {
              this.displayffmForm.get('searchDisplayffm.segment').reset();
              this.displayffmForm.get('searchDisplayffm.segment').setValue(data[0].code);
            }
          });
          if (this.segmentId != null) {
            this.displayffmForm.get('searchDisplayffm.segment').setValue(this.segmentId);
          }
          this.bindData(data.data[0].segmentsList);
        } else {
          (<NgcFormArray>this.displayffmForm.get("uldResultList")).patchValue([]);
        }

        this.segmentId = null;
        this.messageStatus = null;
        this.messageCopy = 0;
      },
      // tslint:disable-next-line:no-shadowed-variable
      error => {
        this.showErrorStatus("no.record.found");
      }
    );
    // }
  }
  bindData(segmentsList: Array<any>) {
    //console.log(segmentsList);
    this.segmentInformation = [];
    let timeStamp: any;
    let count = 0;
    for (let seglist of segmentsList) {
      count++;
      if (seglist.createdTimeStamp != null) {
        timeStamp = seglist.createdTimeStamp;
      }
      for (const segment of seglist.segments) {
        //console.log(segment);
        if (segment.messageStatus == "PROCESSED") {
          this.isProcessed = true;
        } else if (segment.messageStatus == "UNPROCESSED") {
          this.isProcessed = false;
        }
        if (segment.freightawbDetails.length > 0) {
          this.isShipmentInformation = true;
          for (const freightawbDetails of segment.freightawbDetails) {
            const newShipment = Object.assign({}, freightawbDetails);
            newShipment["index"] = count + ' . ' + segment["boardingPoint"];
            newShipment["select"] = false;
            newShipment["boardingPoint"] = segment["boardingPoint"];
            newShipment["flightSegmentOrder"] = segment["flightSegmentOrder"];
            newShipment["messageStatus"] = segment["messageStatus"];
            newShipment["uldCount"] = segment["uldCount"];
            newShipment["looseCargoCount"] = segment["looseCargoCount"];
            newShipment["cargoInULD"] = segment["cargoInULD"];
            newShipment["segmentUldGruopDetailsCount"] = segment["segmentUldGruopDetailsCount"];
            newShipment["segmentPieceCount"] = segment["segmentPieceCount"];
            newShipment["segmentWeight"] = segment["segmentWeight"];
            newShipment["uldNumber"] = "Loose Shipment";
            newShipment["uldRemarks"] = "";
            newShipment["pieceCount"] = "";
            newShipment["shipmentCount"] = "";
            newShipment["pieceCount"] = "";
            newShipment["weightt"] = "";
            this.segmentInformation.push(newShipment);
          }
        }
        for (let uld of segment.freightmanifestedUlds) {
          if (uld.shipments.length > 0) {
            for (const shipmentData of uld.shipments) {
              const newShipment = Object.assign({}, shipmentData);
              newShipment["index"] = count + ' . ' + segment["boardingPoint"];
              newShipment["select"] = false;
              newShipment["messageStatus"] = segment["messageStatus"];
              newShipment["uldNumber"] = uld["uldNumber"];
              newShipment["uldRemarks"] = uld["uldRemarks"];
              newShipment["pieceCount"] = uld["pieceCount"];
              newShipment["boardingPoint"] = segment["boardingPoint"];
              newShipment["flightSegmentOrder"] = segment["flightSegmentOrder"];
              newShipment["uldCount"] = segment["uldCount"];
              newShipment["looseCargoCount"] = segment["looseCargoCount"];
              newShipment["cargoInULD"] = segment["cargoInULD"];
              newShipment["segmentUldGruopDetailsCount"] = segment["segmentUldGruopDetailsCount"];
              newShipment["segmentPieceCount"] = segment["segmentPieceCount"];
              newShipment["segmentWeight"] = segment["segmentWeight"];
              newShipment["shipmentCount"] = uld["shipmentCount"];
              newShipment["pieceCount"] = uld["pieceCount"];
              newShipment["weightt"] = uld["weight"];
              newShipment["segment"] = segment["impArrivalManifestBySegmentId"];

              //
              this.segmentInformation.push(newShipment);

            }
          } else {
            let newShipment = Object.assign({}, null);
            newShipment["index"] = count + ' . ' + segment["boardingPoint"];
            newShipment["select"] = false;
            newShipment["boardingPoint"] = segment["boardingPoint"];
            newShipment["flightSegmentOrder"] = segment["flightSegmentOrder"];
            newShipment["messageStatus"] = segment["messageStatus"];
            newShipment["uldCount"] = segment["uldCount"];
            newShipment["looseCargoCount"] = segment["looseCargoCount"];
            newShipment["cargoInULD"] = segment["cargoInULD"];
            newShipment["segmentPieceCount"] = segment["segmentPieceCount"];
            newShipment["segmentWeight"] = segment["segmentWeight"];
            newShipment["uldNumber"] = uld["uldNumber"];
            newShipment["shipmentNumber"] = "";
            newShipment["uldRemarks"] = "";
            newShipment["pieceCount"] = "";
            newShipment["shipmentCount"] = "";
            newShipment["pieceCount"] = "";
            newShipment["weightt"] = "";
            this.segmentInformation.push(newShipment);
          }
        }
        if (segment.freightmanifestedUlds.length == 0 && segment.freightawbDetails.length == 0 && seglist.isFFMProcessed) {
          let newShipment = Object.assign({}, null);
          newShipment["index"] = count + ' . ' + segment["boardingPoint"];
          newShipment["select"] = false;
          newShipment["boardingPoint"] = segment["boardingPoint"];
          newShipment["flightSegmentOrder"] = segment["flightSegmentOrder"];
          newShipment["messageStatus"] = "";
          newShipment["uldCount"] = "";
          newShipment["looseCargoCount"] = "";
          newShipment["cargoInULD"] = "";
          newShipment["segmentUldGruopDetailsCount"] = "";
          newShipment["segmentPieceCount"] = "";
          newShipment["segmentWeight"] = "";
          newShipment["uldNumber"] = "NIL Cargo";
          newShipment["uldRemarks"] = "";
          newShipment["pieceCount"] = "";
          newShipment["shipmentCount"] = "";
          newShipment["pieceCount"] = "";
          newShipment["weightt"] = "";
          this.segmentInformation.push(newShipment);
        }
      }
    }

    console.log(this.segmentInformation);
    if (this.segmentInformation.length > 0 && this.segmentInformation[0].uldNumber == 'NIL Cargo') {
      this.isnilCargo = true;
      this.ffmTimeStamp = segmentsList[0].flightBoardPoint + " " + timeStamp;
      console.log(this.ffmTimeStamp);
    } else {
      this.isnilCargo = false;
      this.ffmTimeStamp = null;
    }
    (<NgcFormArray>this.displayffmForm.get("uldResultList")).patchValue(this.segmentInformation);
    //console.log(<NgcFormArray>this.displayffmForm.get("uldResultList"));
  }
  public onCacel() {
    this.additionalInformationWindow.close();
  }
  public onSegmentChange(event) {
    if (event) {
      this.segmentId = this.displayffmForm.get("searchDisplayffm.segment").value;
      this.onSearch();
    }
  }

  getFFMreceived(event: any, index: any, type: any) {
    this.messageStatus = type.controls.messageStatus.value;
    this.segmentId = type.controls.segmentId.value;
    this.messageCopy = type.controls.messageCopy.value;
    this.segmentIdForReplace = type.controls.segmentId.value;
    this.messageCopyForReplace = type.controls.messageCopy.value;
    this.onSearch();
  }

  onPrint() {
    this.refreshFormMessages(this.resp);
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_PreArrivalManifestRptInDisplayFFM)) {

      this.reportParameters = new Object();
      this.reportParameters.flightkey = this.displayffmForm.get(['searchDisplayffm', 'flight']).value;
      this.reportParameters.flightdate = this.displayffmForm.get(['searchDisplayffm', 'date']).value;
      this.reportParameters.customerId = this.getUserProfile().userShortName;
      // this.reportParameters.seg1 = this.displayffmForm.get(['segmentsList', 'flightSegmentId']).value;

      if (this.displayffmForm.get(['searchDisplayffm', 'segment']).value == null) {
        this.reportParameters.flag = '0';
      }
      else {
        this.reportParameters.seg1 = this.displayffmForm.get(['searchDisplayffm', 'segment']).value;
        this.reportParameters.flag = '1';
      }
      if (this.responseArray.length != 0) {
        this.reportParameters.flightId = this.responseArray[0].flightId;
      } else {
        this.reportParameters.flightId = 0;
      }
      this.reportWindow4.open();

    } else {

      if (this.displayffmForm.get(['searchDisplayffm', 'typeReport']).value != null) {
        if (this.displayffmForm.get(['searchDisplayffm', 'typeReport']).value === 'Loose and ULD') {

          this.reportParameters = new Object();
          this.reportParameters.flightkey = this.displayffmForm.get(['searchDisplayffm', 'flight']).value;
          this.reportParameters.flightdate = this.displayffmForm.get(['searchDisplayffm', 'date']).value;
          this.reportParameters.customerId = this.getUserProfile().userShortName;
          // this.reportParameters.seg1 = this.displayffmForm.get(['segmentsList', 'flightSegmentId']).value;

          if (this.displayffmForm.get(['searchDisplayffm', 'segment']).value == null) {
            this.reportParameters.flag = '0';
          }
          else {
            this.reportParameters.seg1 = this.displayffmForm.get(['searchDisplayffm', 'segment']).value;
            this.reportParameters.flag = '1';
          }
          if (this.responseArray.length != 0) {
            this.reportParameters.flightId = this.responseArray[0].flightId;
          } else {
            this.reportParameters.flightId = 0;
          }
          this.reportWindow1.open();

        }
        else if (this.displayffmForm.get(['searchDisplayffm', 'typeReport']).value === 'Loose Only') {
          this.reportParameters = new Object();
          this.reportParameters.flightkey = this.displayffmForm.get(['searchDisplayffm', 'flight']).value;
          this.reportParameters.flightdate = this.displayffmForm.get(['searchDisplayffm', 'date']).value;
          this.reportParameters.customerId = this.getUserProfile().userShortName;
          if (this.displayffmForm.get(['searchDisplayffm', 'segment']).value == null) {
            this.reportParameters.flag = '0';
          }
          else {
            this.reportParameters.seg1 = this.displayffmForm.get(['searchDisplayffm', 'segment']).value;
            this.reportParameters.flag = '1';
          }
          if (this.responseArray.length != 0) {
            this.reportParameters.flightId = this.responseArray[0].flightId;
          } else {
            this.reportParameters.flightId = 0;
          }

          this.reportWindow2.open();
        }

        else if (this.displayffmForm.get(['searchDisplayffm', 'typeReport']).value === 'ULD Only') {
          this.reportParameters = new Object();
          this.reportParameters.flightkey = this.displayffmForm.get(['searchDisplayffm', 'flight']).value;
          this.reportParameters.flightdate = this.displayffmForm.get(['searchDisplayffm', 'date']).value;
          this.reportParameters.customerId = this.getUserProfile().userShortName;
          if (this.responseArray.length != 0) {
            this.reportParameters.flightId = this.responseArray[0].flightId;
          } else {
            this.reportParameters.flightId = 0;
          }


          if (this.displayffmForm.get(['searchDisplayffm', 'segment']).value == null) {
            this.reportParameters.flag = '0';
          }
          else {
            this.reportParameters.seg1 = this.displayffmForm.get(['searchDisplayffm', 'segment']).value;
            this.reportParameters.flag = '1';
          }
          this.reportWindow3.open();
        }
      }
      else {
        this.showErrorStatus("error.import.select.type.of.report");
      }
    }
  }


  onLogSummary(event) {
    const forwardedData = { messageType: 'FFM', flightKey: null, flightDate: null, carrierCode: null };
    if (this.displayffmForm && this.displayffmForm.get(['searchDisplayffm']) && this.displayffmForm.get(['searchDisplayffm', 'flight'])) {
      forwardedData['carrierCode'] = this.displayffmForm.get(['searchDisplayffm', 'flight']).value.slice(0, 2);
      forwardedData['flightKey'] = this.displayffmForm.get(['searchDisplayffm', 'flight']).value.slice(2, this.displayffmForm.get(['searchDisplayffm', 'flight']).value.length);
      forwardedData['flightDate'] = this.displayffmForm.get(['searchDisplayffm', 'date']).value;
      this.navigateTo(this.router, 'interface/incomingmessage', forwardedData);
    }
  }

  /**
   * Cells Style Renderer
   * 
   * @param value Value
   * @param rowData Row Data
   * @param level Level
   */
  public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (!value || value === ' ') {
      cellsStyle.data = "NIL";
    } else {
      cellsStyle.data = value;
    }
    //
    return cellsStyle;
  };

  /**
  * Cells Style Renderer
  * 
  * @param value Value
  * @param rowData Row Data
  * @param level Level
  */
  public cellsStyleRendererColor = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.rejectReason) {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    }
    return cellsStyle;
  };
  public cellsStyleRendererColorProcessed = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //console.log(rowData);
    if (rowData.messageStatus === "PROCESSED") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.messageStatus === "UNPROCESSED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    }
    return cellsStyle;
  };

  redirectToShipmentInformation(event) {

    this.navigationReUse();
    if (this.displayCompleteList.length === 1) {
      this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', { 'shipmentNumber': this.shipmentData });
    }

    // var dataToSend = {

    // }
    // this.navigateTo(this.router, 'awbmgmt/shipmentinfo', dataToSend);
  }

  redirectToAWBDocument(event) {
    this.navigationReUse();
    if (this.displayCompleteList.length === 1) {
      this.navigateTo(this.router, 'awbmgmt/awbdocument', {
        "shipmentNumber": this.displayCompleteList[0].shipmentNumber,
        "shipmentType": 'AWB'
      });
    }
    // var dataToSend = {
    // }
    // this.navigateTo(this.router, 'awbmgmt/awbdocument', dataToSend);

  }

  redirectToFWBScreen(event) {
    this.navigationReUse();
    if (this.displayCompleteList.length === 1) {
      this.navigateTo(this.router, 'import/maintainfwb', { 'awbNumber': this.shipmentData });
    }
    // var dataToSend = {
    // }
    // this.navigateTo(this.router, 'import/maintainfwb', dataToSend);
  }

  onCheckBoxClick(event: any) {
    //console.log(event);
  }

  //adding the shipments to the Existing FFM.
  onMerge() {
    let segmentData: SegmentData = new SegmentData();
    let flightData: ArrivalManifestData = new ArrivalManifestData();
    let segmentList = this.resp.data[0].segmentsList;
    let uldData = this.displayffmForm.get('uldResultList').value;
    //console.log(uldData);
    flightData.flightId = this.resp.data[0].flightId;
    flightData.carrierCode = this.resp.data[0].carrierCode;
    flightData.flightNumber = this.displayffmForm.get(['searchDisplayffm', 'flight']).value;
    flightData.flightDate = this.displayffmForm.get(['searchDisplayffm', 'date']).value;
    flightData.flightNo = this.displayffmForm.get(['searchDisplayffm', 'date']).value;
    flightData.flagCRUD = 'C';
    segmentList.forEach(element => {
      segmentData = element;
      element.segments.forEach(segment => {
        segmentData.flagCRUD = 'C';
        segmentData.segmentId = segment.segmentId;
        segmentData.flightId = segment.flightId;
        segmentData.boardingPoint = segment.boardingPoint;
        let manifestedUlds: Array<UldModel> = new Array<UldModel>();
        let bulkshipments: Array<ShipmentModel> = new Array<ShipmentModel>();
        uldData.forEach(shipment => {
          let uldModel: UldModel = new UldModel();
          let shipments: Array<ShipmentModel> = new Array<ShipmentModel>();

          if (shipment.messageStatus == 'PROCESSED') {
            this.showErrorMessage('shipment.available.existing.ffm');
            return;
          }
          //check Shipment Seleted
          if (shipment.select && shipment.uldNumber != 'Loose Shipment' && shipment.messageStatus != 'PROCESSED') {
            uldModel.uldNumber = shipment.uldNumber
            uldModel.flagCRUD = 'C';
            shipment.flagCRUD = 'C';
            if (shipment.carrierDestination != null) {
              let splitData = shipment.carrierDestination.split(' / ');
              shipment.carrierDestination = splitData[0].split(" ")[1];
              shipment.carrierCode = splitData[1];
            }
            shipments.push(shipment);
            uldModel.shipments = shipments;
            manifestedUlds.push(uldModel);
          } else if (shipment.select && shipment.uldNumber == 'Loose Shipment' && shipment.messageStatus != 'PROCESSED') {
            shipment.flagCRUD = 'C';
            if (shipment.carrierDestination != null) {
              let splitData = shipment.carrierDestination.split(' / ');
              shipment.carrierDestination = splitData[0].split(" ")[1];
              shipment.carrierCode = splitData[1];
            }
            bulkshipments.push(shipment);
          }
        });
        segmentData.manifestedUlds = manifestedUlds;
        segmentData.bulkShipments = bulkshipments;
      });
      flightData.segments.push(segmentData);
    });
    //console.log(flightData);
    if (flightData.segments[0].manifestedUlds.length == 0 && flightData.segments[0].bulkShipments.length == 0) {
      this.showInfoStatus("import.info103");
      return;
    }
    //Calling arrival manifest Service for inserting data to manifest
    this.importService.mergeFFMShipments(flightData).subscribe(response => {
      //console.log(response);
      if (!this.showResponseErrorMessages(response)) {
        this.onSearch();
        this.showSuccessStatus('shipment.added.successfully');
      }
    }, (error) => {
      this.showErrorStatus(error);
    });
  }

  //replacing the Processed FFM with the unProcessed FFM sengment wise.
  //this function call to arrival manifest code
  //not used 
  onReplaceAll() {
    this.showConfirmMessage('replace.ffm').then(reason => {
      let flightSearchData: ArrivalManifestFlight = new ArrivalManifestFlight();
      flightSearchData.flightNumber = this.displayffmForm.get("searchDisplayffm.flight").value;
      flightSearchData.flightDate = this.displayffmForm.get("searchDisplayffm.date").value;
      flightSearchData.segmentId = this.segmentIdForReplace;
      //get the arrival manifest data
      let segmentList = this.resp.data[0].segmentsList;
      if (segmentList[0].messageStatus == 'PROCESSED') {
        this.showErrorMessage('ffm.processed.already');
        return;
      }
      this.importService.fetchArrivalSearchDetails(flightSearchData).subscribe(
        resp => {
          let segmentData: SegmentData = new SegmentData();
          let flightData: ArrivalManifestData = new ArrivalManifestData();
          flightData.flightId = resp.data.flightId;
          flightData.carrierCode = resp.data.carrierCode;
          flightData.flightDate = this.displayffmForm.get(['searchDisplayffm', 'date']).value;
          flightData.flightNumber = this.displayffmForm.get(['searchDisplayffm', 'flight']).value;
          flightData.flightNo = this.displayffmForm.get(['searchDisplayffm', 'date']).value;
          flightData.flagCRUD = 'R';
          resp.data.segments.forEach(segment => {
            segmentData = segment;
            segmentData.flagCRUD = 'R';
            segmentData.segmentId = segment.impArrivalManifestBySegmentId;
            segmentData.flightId = segment.flightId;
            segmentData.boardingPoint = segment.boardingPoint;
            segment.manifestedUlds.forEach(ulds => {
              ulds.flagCRUD = 'U';
              ulds.shipments.forEach(uldShipment => {
                if (uldShipment.carrierDestination != null) {
                  let splitData = uldShipment.carrierDestination.split(' / ');
                  uldShipment.carrierDestination = splitData[0].split(" ")[1];
                  uldShipment.carrierCode = splitData[1];
                }
                uldShipment.flagCRUD = 'D';
              });
            });
            segmentData.manifestedUlds = segment.manifestedUlds;
            segment.bulkShipments.forEach(bulkShipment => {
              if (bulkShipment.carrierDestination != null) {
                let splitData = bulkShipment.carrierDestination.split(' / ');
                bulkShipment.carrierDestination = splitData[0].split(" ")[1];
                bulkShipment.carrierCode = splitData[1];
              }
              bulkShipment.flagCRUD = 'D';
            });
            segmentData.bulkShipments = segment.bulkShipments;
            flightData.segments.push(segmentData);
          });
          //Delete the arrival manifest data
          //Calling arrival manifest Service
          this.importService.saveULD(flightData).subscribe(response => {
            //console.log(response);
            if (!this.showResponseErrorMessages(response)) {
              this.insertSengmentData();
            }
          }, (error) => {
            this.showErrorStatus(error);
          });
        }
      );
    }).catch(reason => {
      return;
    });
  }

  insertSengmentData() {
    let segmentData: SegmentData = new SegmentData();
    let flightData: ArrivalManifestData = new ArrivalManifestData();
    let segmentList = this.resp.data[0].segmentsList;
    let uldData = this.displayffmForm.getRawValue();
    //console.log(uldData.uldResultList);
    flightData.flightId = this.resp.data[0].flightId;
    flightData.carrierCode = this.resp.data[0].carrierCode;
    flightData.flightNumber = this.displayffmForm.get(['searchDisplayffm', 'flight']).value;
    flightData.flightDate = this.displayffmForm.get(['searchDisplayffm', 'date']).value;
    flightData.flightNo = this.displayffmForm.get(['searchDisplayffm', 'date']).value;
    flightData.flagCRUD = 'C';
    segmentList.forEach(element => {
      segmentData = element;
      element.segments.forEach(segment => {
        segmentData.flagCRUD = 'C';
        segmentData.segmentId = segment.segmentId;
        segmentData.flightId = segment.flightId;
        segmentData.boardingPoint = segment.boardingPoint;
        let manifestedUlds: Array<UldModel> = new Array<UldModel>();
        let bulkshipments: Array<ShipmentModel> = new Array<ShipmentModel>();
        uldData.uldResultList.forEach(shipment => {
          let uldModel: UldModel = new UldModel();
          let shipments: Array<ShipmentModel> = new Array<ShipmentModel>();
          //check Shipment Seleted
          if (shipment.uldNumber != 'Loose Shipment') {
            uldModel.uldNumber = shipment.uldNumber
            uldModel.flagCRUD = 'C';
            shipment.flagCRUD = 'C';
            if (shipment.carrierDestination != null) {
              let splitData = shipment.carrierDestination.split(' / ');
              shipment.carrierDestination = splitData[0].split(" ")[1];
              shipment.carrierCode = splitData[1];
            }
            shipments.push(shipment);
            uldModel.shipments = shipments;
            manifestedUlds.push(uldModel);
          } else if (shipment.uldNumber == 'Loose Shipment') {
            shipment.flagCRUD = 'C';
            if (shipment.carrierDestination != null) {
              let splitData = shipment.carrierDestination.split(' / ');
              shipment.carrierDestination = splitData[0].split(" ")[1];
              shipment.carrierCode = splitData[1];
            }
            bulkshipments.push(shipment);
          }
        });
        segmentData.manifestedUlds = manifestedUlds;
        segmentData.bulkShipments = bulkshipments;
      });
      flightData.segments.push(segmentData);
    });
    //insert the data to arrival manifest segment wise
    this.importService.saveULD(flightData).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.upDateFFMStatus();
      }
    }, (error) => {
      this.showErrorStatus(error);
    });
  }

  upDateFFMStatus() {
    const displayffmList: DisplayffmFlight = new DisplayffmFlight();
    displayffmList.flightNumber = this.displayffmForm.get("searchDisplayffm.flight").value;
    displayffmList.flightDate = this.displayffmForm.get("searchDisplayffm.date").value;
    displayffmList.segmentId = this.segmentIdForReplace;
    displayffmList.segmentCopy = this.messageCopyForReplace;
    this.importService.updateFFMStatus(displayffmList).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.onSearch();
        this.showSuccessStatus('shipment.added.successfully');
      }
    }, (error) => {
      this.showErrorStatus(error);
    });
  }
  public navigationReUse() {
    this.shipmentData = null;
    this.displayCompleteList = [];
    this.displayFFMList = (<NgcFormArray>
      this.displayffmForm.get('uldResultList')).getRawValue();
    for (let item of this.displayFFMList) {
      if (item['select'] === true) {
        item.outboundFlight = null;
        item.readyfordelivery = null;
        this.displayCompleteList.push(item);
      }
    }
    if (this.displayCompleteList.length === 0) {
      this.showInfoStatus('import.info106');
      return;
    }
    if (this.displayCompleteList.length > 1) {
      this.showInfoStatus('import.info106');
      return;
    } else {
      this.shipmentData = this.displayCompleteList[0].shipmentNumber;
    }
  }

  //function call to edi ffm code
  onReplaceAllFFM() {
    let segmentList = this.resp.data[0].segmentsList;
    if (segmentList[0].messageStatus == 'PROCESSED') {
      this.showErrorMessage('ffm.processed.already');
      return;
    }
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_ReplaceFFMUponCustomSubmission)) {
      if (this.shipmentCustomSubmissionDt) {
        this.showWarningStatus('customs.submission.done')
        return;
      }
    }
    this.showConfirmMessage('replace.ffm').then(reason => {
      const displayffmList: DisplayffmFlight = new DisplayffmFlight();
      displayffmList.flightNumber = this.displayffmForm.get("searchDisplayffm.flight").value;
      displayffmList.flightDate = this.displayffmForm.get("searchDisplayffm.date").value;
      displayffmList.segmentId = this.segmentIdForReplace;
      displayffmList.segmentCopy = this.messageCopyForReplace;
      const flightManifest: AirlineFlightManifest = new AirlineFlightManifest();
      const destinationHeaderList: Array<DestinationHeaderInformation> = new Array<DestinationHeaderInformation>();
      const destinationHeader: DestinationHeaderInformation = new DestinationHeaderInformation();
      const insideDestinationHeader: DestinationHeader = new DestinationHeader();
      const flightInfo: Flight = new Flight();
      flightManifest.flightId = this.resp.data[0].flightId;
      destinationHeader.flightId = this.resp.data[0].flightId;
      destinationHeader.flightSegmentId = this.segmentIdForReplace;
      destinationHeader.flightKey = this.displayffmForm.get("searchDisplayffm.flight").value;
      destinationHeader.flightDate = this.displayffmForm.get("searchDisplayffm.date").value;
      destinationHeaderList.push(destinationHeader);
      flightInfo.flightId = this.resp.data[0].flightId;
      flightInfo.flightNo = this.displayffmForm.get("searchDisplayffm.flight").value;
      flightInfo.flightDate = this.displayffmForm.get("searchDisplayffm.date").value;
      flightInfo.carrier = this.resp.data[0].carrierCode;
      flightInfo.loadingPoint = this.resp.data[0].boardingPoint;
      flightInfo.flightType = this.resp.data[0].flightType;
      flightInfo.flightSegmentId = this.segmentIdForReplace;
      flightInfo.flightSegmentOrder = this.messageCopyForReplace;
      flightManifest.flightInfo = flightInfo;
      flightManifest.destinationHeader = destinationHeaderList;
      insideDestinationHeader.airportCodeOfUnloading = NgcUtility.getTenantConfiguration().airportCode;
      destinationHeader.destinationHeader = insideDestinationHeader;

      this.interfaceService.replaceIncomingMessageFFM(flightManifest).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.onSearch();
          this.showSuccessStatus('ffm.replaced.successfully');
        }
      }, (error) => {
        this.showErrorStatus(error);
      });
    }).catch(reason => {
      return;
    });
  }

  onCancel(event) {
    this.navigateBack(this.routedInformation);
  }

}
