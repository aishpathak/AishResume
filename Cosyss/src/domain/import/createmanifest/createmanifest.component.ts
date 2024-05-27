import {
  Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, ViewChildren,
  QueryList,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, PageConfiguration, NgcFormControl, CreateFormByModel, ReactiveModel, NgcAwbInputComponent, NgcULDInputComponent } from 'ngc-framework';
import { ArrivalManifestFlight, SegmentData, UldModel, ShipmentModel, DimensionData, OciData, ConsignmentMovementData, OtherServicesInformation, ShcData, ArrivalManifestData, RoutingRequestModel } from '../import.sharedmodel';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { ImportService } from '../import.service';

@Component({
  selector: 'app-createmanifest',
  templateUrl: './createmanifest.component.html',
  styleUrls: ['./createmanifest.component.scss']
})
@PageConfiguration({
  trackInit: true,
  //callNgOnInitOnClear: true,
  autoBackNavigation: false,
  focusToBlank: true,
  noAutoFocus: true,
  restorePageOnBack: false,
  dontRestoreOnBrowserBack: false
})
export class CreatemanifestComponent extends NgcPage {

  shipmentData: any;
  private _list: any;
  response: any;
  responseForSave: any;
  count: number = 0;
  existingManifestData: any;
  @ViewChild('additionalInformationWindow') additionalInformationWindow: NgcWindowComponent;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private importService: ImportService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null) {
      if (forwardedData.flightNumber != null && forwardedData.flightNumber != "" && forwardedData.flightDate != null && forwardedData.flightDate != "") {
        this.arrivalFlightDetails.get('searchArrivalData.flight').setValue(forwardedData.flightNumber);
        this.arrivalFlightDetails.get('searchArrivalData.date').setValue(forwardedData.flightDate);
        this.onSearch();
      }
    }
    super.ngOnInit();
  }

  @Output("update") change: EventEmitter<number> = new EventEmitter<number>();
  FlightId: Number;
  aircraftRegCode: string;
  flightStatus: string;
  segmentInformation: any[] = [];
  uldInformation: any[] = [];
  shipmentInformation: ShipmentModel = new ShipmentModel;
  dimensionInformation: any[] = [];
  ociInformation: any[] = [];
  onwardInformation: any[] = [];
  osiInformation: any[] = [];
  shipmentRowId: any;
  sourceIdSegmentDropdown: any;
  isFlightInformation: boolean = false;
  isShipmentInformation: boolean = false;
  LooseCargoShipments: any[] = [];
  uldIndex: string;
  shipmentsIndex: string;
  LooseShipmentsIndex: string;
  isLooseCargo: boolean = false;
  carrierCode: string;
  segmentindex: string;
  isOffloaded: boolean;
  uldFocus: boolean = false;
  shipmentFocus: string = null;
  manifestedIndex: number;
  looseIndex: number;
  bulkShipmentsCount: number = 0;
  manifestUldCount: number = 0;

  existingManifestedUlds: Array<UldModel> = new Array<UldModel>();
  existingbulkShipments: Array<ShipmentModel> = new Array<ShipmentModel>();



  @ViewChildren('shipmentNo')
  shipmenInputList: QueryList<NgcAwbInputComponent>;

  @ReactiveModel(ArrivalManifestFlight)
  public arrivalFlightDetails: NgcFormGroup;

  private arrivalManifestData: NgcFormGroup = new NgcFormGroup({
    searchArrivalData: new NgcFormGroup({
      flight: new NgcFormControl(),
      date: new NgcFormControl(),
      segment: new NgcFormControl(),
    }),



    flightData: new NgcFormGroup({
      flightNumber: new NgcFormControl(),
      flightDate: new NgcFormControl(new Date()),
      sta: new NgcFormControl(),
      eta: new NgcFormControl(),
      ata: new NgcFormControl(),
      aircraftRegCode: new NgcFormControl(),
      flightStatus: new NgcFormControl(),
      weightUnitCode: new NgcFormControl('K'),
      segment: new NgcFormControl(),
    }),
    uldResultList: new NgcFormArray(
      [
        new NgcFormGroup({
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
          carrierDestination: new NgcFormControl(),
          shipmentRejected: new NgcFormControl(),
          additionalInfo: new NgcFormControl(),
          checkBoxValue: new NgcFormControl(),
          shcCode: new NgcFormControl(),
          flagCRUD: new NgcFormControl(),
          handledByMasterHouse: new NgcFormControl()

        })
      ]
    ),


    addUldInfo: new NgcFormGroup({
      uldResultList: new NgcFormArray(
        [
          new NgcFormGroup({
            uldNumber: new NgcFormControl(),
            uldRemarks: new NgcFormControl(),
            shipments: new NgcFormArray([
              new NgcFormGroup({
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
                shcs: new NgcFormControl(),
                flagCRUD: new NgcFormControl(),
                checkBoxValue: new NgcFormControl(),
                carrierDestination: new NgcFormControl(),
                carrierCode: new NgcFormControl(),
                svc: new NgcFormControl(),
                densityGroupCode: new NgcFormControl(),
                volumeAmount: new NgcFormControl(),
                volumeunitCode: new NgcFormControl(),
                customsReference: new NgcFormControl(),
                customsOriginCode: new NgcFormControl(),
                movementPriorityCode: new NgcFormControl(),
                handledByMasterHouse: new NgcFormControl()
              })
            ]
            ),
            dimensions: new NgcFormArray([
              new NgcFormGroup({
                weightUnitCode: new NgcFormControl(),
                measurementUnitCode: new NgcFormControl(),
                width: new NgcFormControl(),
                height: new NgcFormControl(),
                length: new NgcFormControl(),
                weight: new NgcFormControl(),
                noOfPieces: new NgcFormControl(),
              })
            ]
            ),
            oci: new NgcFormArray([
              new NgcFormGroup({
                countryCode: new NgcFormControl(),
                informationIdentifier: new NgcFormControl(),
                csrciIdentifier: new NgcFormControl(),
                scsrcInformation: new NgcFormControl(),
              })
            ]
            ),
            osi: new NgcFormArray([
              new NgcFormGroup({
                remarks: new NgcFormControl()
              })
            ]
            ),
            movementInfo: new NgcFormArray([
              new NgcFormGroup({
                flightNumber: new NgcFormControl(),
                departureDate: new NgcFormControl(),
              })
            ]
            ),
          }),

        ]

      )
    }),

    segments: new NgcFormGroup({
      uldNumber: new NgcFormControl(),
      bulkShipments: new NgcFormArray(
        [
          new NgcFormGroup({
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
            shcs: new NgcFormControl(),
            flagCRUD: new NgcFormControl(),
            carrierDestination: new NgcFormControl(),
            carrierCode: new NgcFormControl(),
            svc: new NgcFormControl(),
            densityGroupCode: new NgcFormControl(),
            volumeAmount: new NgcFormControl(),
            volumeunitCode: new NgcFormControl(),
            customsReference: new NgcFormControl(),
            customsOriginCode: new NgcFormControl(),
            movementPriorityCode: new NgcFormControl(),
            handledByMasterHouse: new NgcFormControl(),
            dimensions: new NgcFormArray([
              new NgcFormGroup({
                weightUnitCode: new NgcFormControl(),
                measurementUnitCode: new NgcFormControl(),
                width: new NgcFormControl(),
                height: new NgcFormControl(),
                length: new NgcFormControl(),
                weight: new NgcFormControl(),
                noOfPieces: new NgcFormControl(),
              })
            ]
            ),
            oci: new NgcFormArray([
              new NgcFormGroup({
                countryCode: new NgcFormControl(),
                informationIdentifier: new NgcFormControl(),
                csrciIdentifier: new NgcFormControl(),
                scsrcInformation: new NgcFormControl(),
              })
            ]
            ),
            osi: new NgcFormArray([
              new NgcFormGroup({
                remarks: new NgcFormControl()
              })
            ]
            ),
            movementInfo: new NgcFormArray([
              new NgcFormGroup({
                flightNumber: new NgcFormControl(),
                departureDate: new NgcFormControl(),
              })
            ]
            ),
          })
        ]
      ),
    }),
    dimensionResultList: new NgcFormArray(
      [
        new NgcFormGroup({

          noOfPieces: new NgcFormControl(),
          weight: new NgcFormControl(),
          weightUnitCode: new NgcFormControl(),
          length: new NgcFormControl(),
          width: new NgcFormControl(),
          height: new NgcFormControl(),
          measurementUnitCode: new NgcFormControl(),
        })
      ]
    ),
    ociResultList: new NgcFormArray(
      [
        new NgcFormGroup({

          countryCode: new NgcFormControl(),
          informationIdentifier: new NgcFormControl(),
          csrciIdentifier: new NgcFormControl(),
          scsrcInformation: new NgcFormControl(),
        })
      ]
    ),

    onwardMvmtResultList: new NgcFormArray(
      [
        new NgcFormGroup({

          flightNumber: new NgcFormControl(),
          departureDate: new NgcFormControl(),
        })
      ]
    ),

    osiResultList: new NgcFormArray(
      [
        new NgcFormGroup({
          remarks: new NgcFormControl(),
        })
      ]
    ),


    additionalInfoData: new NgcFormGroup({
      densityGroup: new NgcFormControl(),
      volume: new NgcFormControl(),
      volumeUnitCode: new NgcFormControl(),
      customsReference: new NgcFormControl(),
      customsOrigin: new NgcFormControl(),
      movementPriorityCode: new NgcFormControl(),
      awbNumber: new NgcFormControl(),
      offloadedFlag: new NgcFormControl(),
      offloadReasonCode: new NgcFormControl()
    }),
  });

  public addMoreULD(parentindex): void {
    if (this.arrivalFlightDetails.get("segment").value == null || this.arrivalFlightDetails.get("segment").value == "") {
      this.showErrorMessage('choose.segment');
      return;
    }
    (this.arrivalFlightDetails.get(["segments", 0, "manifestedUlds", parentindex, "shipments"]) as NgcFormArray).addValue([
      {
        shipmentNumber: "",
        origin: "",
        destination: "",
        shipmentDescriptionCode: 'T',
        piece: "",
        weight: "",
        weightUnitCode: "K",
        totalPieces: "",
        natureOfGoodsDescription: "",
        shc: [],
        flagCRUD: "C",
        svc: false,
        carrierDestination: null,
        carrierCode: null,
        dimensions: [],
        oci: [],
        osi: [],
        movementInfo: [],
        densityGroupCode: "",
        volumeAmount: "",
        volumeunitCode: "",
        customsReference: "",
        customsOriginCode: "",
        movementPriorityCode: "",
        handledByMasterHouse: "",
        offloadedFlag: false,
        offloadReasonCode: null
      }
    ]);

    this.shipmentFocus = 'Shipment';

    this.manifestedIndex = parentindex;

    //set Auto Focus
    this.async(() => {
      if ((this.arrivalFlightDetails.get(["segments", 0, "manifestedUlds", parentindex, "shipments"]) as NgcFormArray).length == 1) {
        (this.arrivalFlightDetails.get(["segments", 0, "manifestedUlds", parentindex, "uldNumber"]) as NgcFormControl).focus();
      } else {
        const uldShipmentIndex = (this.arrivalFlightDetails.get(["segments", 0, "manifestedUlds", parentindex, "shipments"]) as NgcFormArray).length - 1;
        (this.arrivalFlightDetails.get(["segments", 0, "manifestedUlds", parentindex, "shipments", uldShipmentIndex, "shipmentNumber"]) as NgcFormControl).focus();
      }
    }, 1000);

  }

  public createULD(index): void {
    if (this.arrivalFlightDetails.get("segment").value == null || this.arrivalFlightDetails.get("segment").value == "") {
      this.showErrorMessage('choose.segment');
      return;
    }
    (this.arrivalFlightDetails.get(["segments", 0, "manifestedUlds"]) as NgcFormArray).addValue([
      {
        uldNumber: "",
        uldRemarks: "",
        shipments: []
      }
    ]);
    this.addMoreULD((this.arrivalFlightDetails.get(["segments", 0, "manifestedUlds"]) as NgcFormArray).length - 1);
  }

  public deleteULDShipment(event, parentindex, index, segmentrow) {
    (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments"]) as NgcFormArray).markAsDeletedAt(index);
    const items = (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments"]) as NgcFormArray).getRawValue();
    if (items.length == 0) {
      (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds"]) as NgcFormArray).markAsDeletedAt(parentindex);
    }
  }
  public deleteLooseShipment(event, index, segmentrow) {
    console.log((this.arrivalFlightDetails.get(["segments", segmentrow, "bulkShipments", index]) as NgcFormArray));
    (this.arrivalFlightDetails.get(["segments", segmentrow, "bulkShipments"]) as NgcFormArray).markAsDeletedAt(index);
  }

  public addMoreLooseCargo(): void {
    if (this.arrivalFlightDetails.get("segment").value == null || this.arrivalFlightDetails.get("segment").value == "") {
      this.showErrorMessage('choose.segment');
      return;
    }
    (<NgcFormArray>this.arrivalFlightDetails.get(["segments", 0, "bulkShipments"])).addValue([
      {

        shipmentNumber: "",
        origin: "",
        destination: "",
        shipmentDescriptionCode: 'T',
        piece: "",
        weight: "",
        weightUnitCode: "K",
        totalPieces: "",
        natureOfGoodsDescription: "",
        shc: [],
        svc: false,
        carrierDestination: null,
        carrierCode: null,
        dimensions: [],
        oci: [],
        osi: [],
        movementInfo: [],
        densityGroupCode: "",
        volumeAmount: "",
        volumeunitCode: "",
        customsReference: "",
        customsOriginCode: "",
        movementPriorityCode: "",
        handledByMasterHouse: "",
        offloadedFlag: false,
        offloadReasonCode: null
      }
    ]);
    this.shipmentFocus = 'Loose';
    this.looseIndex = (this.arrivalFlightDetails.get(["segments", 0, "bulkShipments"]) as NgcFormArray).length - 1;

    //set Auto Focus
    this.async(() => {
      (this.arrivalFlightDetails.get(["segments", 0, "bulkShipments", this.looseIndex, "shipmentNumber"]) as NgcFormControl).focus();
    }, 1000);

  }

  public onPieceChange(event, index, segmentrow): void {
    const shipmentData = (this.arrivalFlightDetails.get(["segments", segmentrow, "bulkShipments", index]) as NgcFormGroup).getRawValue();
    if (shipmentData.shipmentDescriptionCode == null || shipmentData.shipmentDescriptionCode == "T") {
      const totalPieces = (this.arrivalFlightDetails.get(["segments", segmentrow, "bulkShipments", index, "totalPieces"]) as NgcFormGroup).value;
      (this.arrivalFlightDetails.get(["segments", segmentrow, "bulkShipments", index, "totalPieces"]) as NgcFormGroup).setValue(event);
      (this.arrivalFlightDetails.get(["segments", segmentrow, "bulkShipments", index, "totalPieces"]) as NgcFormGroup).disable();
    }

  }

  public onDescriptionChange(event, index, segmentrow): void {
    const shipmentData = (this.arrivalFlightDetails.get(["segments", segmentrow, "bulkShipments", index]) as NgcFormGroup).getRawValue();
    if (event) {
      const totalPieces = (this.arrivalFlightDetails.get(["segments", segmentrow, "bulkShipments", index, "totalPieces"]) as NgcFormGroup).value;
      console.log(totalPieces);
      if (totalPieces) {
        (this.arrivalFlightDetails.get(["segments", segmentrow, "bulkShipments", index, "totalPieces"]) as NgcFormGroup).enable();
      }
    } else {
      (this.arrivalFlightDetails.get(["segments", segmentrow, "bulkShipments", index, "totalPieces"]) as NgcFormGroup).setValue(shipmentData.piece);
      (this.arrivalFlightDetails.get(["segments", segmentrow, "bulkShipments", index, "totalPieces"]) as NgcFormGroup).disable({ onlySelf: true, emitEvent: false });
    }

  }

  public onULDPieceChange(event, parentindex, index, segmentrow): void {
    const shipmentData = (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index]) as NgcFormGroup).getRawValue();
    if (shipmentData.shipmentDescriptionCode == null || shipmentData.shipmentDescriptionCode == "" || shipmentData.shipmentDescriptionCode == "T") {
      const totalPieces = (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index, "totalPieces"]) as NgcFormGroup).value;
      (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index, "totalPieces"]) as NgcFormGroup).setValue(event);
      (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index, "totalPieces"]) as NgcFormGroup).disable();
    }

  }

  public onULDDescriptionChange(event, parentindex, index, segmentrow): void {
    const shipmentData = (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index]) as NgcFormGroup).getRawValue();
    if (event) {
      const totalPieces = (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index]) as NgcFormGroup).value;
      console.log(totalPieces);
      if (totalPieces) {
        (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index, "totalPieces"]) as NgcFormGroup).enable();
      }
    } else {
      (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index, "totalPieces"]) as NgcFormGroup).setValue(shipmentData.piece);
      (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index, "totalPieces"]) as NgcFormGroup).disable({ onlySelf: true, emitEvent: false });
    }

  }

  public onSearch(): void {
    this.existingManifestData = null;
    this.bulkShipmentsCount = 0;
    this.manifestUldCount = 0;
    let flightSearchData: ArrivalManifestFlight = new ArrivalManifestFlight();
    let segments: Array<SegmentData> = new Array<SegmentData>();
    let segmentData: SegmentData = new SegmentData();
    if (this.arrivalFlightDetails) {
      (<NgcFormArray>this.arrivalFlightDetails.get(['segments'])).resetValue([]);
      flightSearchData.flightNumber = this.arrivalFlightDetails.get("searchArrivalData.flight").value;
      flightSearchData.flightDate = this.arrivalFlightDetails.get("searchArrivalData.date").value
      flightSearchData.segmentId = this.arrivalFlightDetails.get("segment").value;
      flightSearchData.segmentId = flightSearchData.segmentId ? flightSearchData.segmentId : 0;
    }
    this.FlightId = 0;
    this.carrierCode = null;
    this.importService.fetchArrivalSearchDetails(flightSearchData).subscribe(data => {
      this.LooseCargoShipments = [];
      this.uldInformation = [];
      this.dimensionInformation = [];
      this.showResponseErrorMessages(data);
      //console.log(data.data);
      this.isShipmentInformation = false;
      if (data.data) {
        this.response = data.data;
        this.FlightId = data.data.impArrivalManifestByFlightId;
        this.aircraftRegCode = data.data.aircraftRegCode;
        this.flightStatus = data.data.flightStatus;
        this.arrivalFlightDetails.get('flightNumber').setValue(flightSearchData.flightNumber);
        this.arrivalFlightDetails.get('flightDate').setValue(data.data.flightDate);
        this.arrivalFlightDetails.get('sta').setValue(data.data.sta);
        this.arrivalFlightDetails.get('ata').setValue(data.data.ata);
        this.arrivalFlightDetails.get('eta').setValue(data.data.eta);
        this.arrivalFlightDetails.get('aircraftRegCode').setValue(data.data.aircraftRegCode);
        this.carrierCode = data.data.carrierCode;
        this.sourceIdSegmentDropdown = this.createSourceParameter(this.arrivalFlightDetails.get("searchArrivalData.flight").value, this.arrivalFlightDetails.get("searchArrivalData.date").value);
        if (data.data.segments && data.data.segments[0]) {
          this.arrivalFlightDetails.get("nilCargo").setValue(data.data.segments[0].nilCargo);
        }

        //copy the data for validatig duplicate shipments whilesaving
        this.existingManifestData = data.data;
        this.response.segments.forEach(element => {
          //making arrays as empty to not pacthing the data to data model
          segmentData.impArrivalManifestByFlightId = element.impArrivalManifestByFlightId;
          segmentData.impArrivalManifestBySegmentId = element.impArrivalManifestBySegmentId;
          segmentData.segmentId = element.segmentId;
          segmentData.flightId = element.flightId;
          segmentData.boardingPoint = element.boardingPoint;
          segmentData.offPoint = element.offPoint;
          this.bulkShipmentsCount = element.bulkShipments.length;
          this.manifestUldCount = element.manifestedUlds.length;
          segments.push(segmentData);
        });
        //re-setting arrays
        this.existingbulkShipments = [];
        this.existingManifestedUlds = [];
        this.arrivalFlightDetails.get('segments').patchValue(segments);
        this.retrieveDropDownListRecords("ARRIVAL_FLIGHTSEGMENT", "query", this.sourceIdSegmentDropdown).subscribe(data => {
          if (data.length == 1) {
            this.arrivalFlightDetails.get('segment').reset();
            this.arrivalFlightDetails.get('segment').setValue(data[0].code);
          }
        });
      }
    }, (error) => {
      this.showErrorStatus(error);
    });


  }

  public onBack(event) {
    this.navigateBack(this.arrivalManifestData.getRawValue());
  }

  public onSegmentChange(event) {
    if (event) {
      this.showConfirmMessage("change.segment").then(fulfilled => {
        this.onSearch();
      }).catch(reason => {
        // Do nothing;
      });

    }
  }

  public onAddingShipment(event, parentIndex, childIndex) {
    this.existingManifestData.segments.forEach(element => {

      element.bulkShipments.forEach(elementExist => {
        if (event == elementExist.shipmentNumber) {
          elementExist.carrierDestination = null;
          this.existingbulkShipments.push(elementExist);
        }

      });
      element.manifestedUlds.forEach(uldExist => {
        uldExist.shipments.forEach(uldShipmentExist => {
          if (event == uldShipmentExist.shipmentNumber) {
            uldShipmentExist.carrierDestination = null;
            this.existingManifestedUlds.push(uldExist);
          } else {
            uldShipmentExist.carrierDestination = null;
          }
        });

      });

    });
  }

  public onSave(): void {

    let segmentData: SegmentData = new SegmentData();
    let flightData: ArrivalManifestData = new ArrivalManifestData();
    const item = (this.arrivalFlightDetails.get(["segments", 0,]) as NgcFormArray).getRawValue();
    segmentData.manifestedUlds = (this.arrivalFlightDetails.get(["segments", 0, "manifestedUlds"]) as NgcFormArray).getRawValue();
    segmentData.bulkShipments = (this.arrivalFlightDetails.get(["segments", 0, "bulkShipments"]) as NgcFormArray).getRawValue();
    flightData.flightId = this.FlightId;
    flightData.carrierCode = this.carrierCode;
    if (this.arrivalFlightDetails.get("segment").value == null || this.arrivalFlightDetails.get("segment").value == "") {
      this.showErrorMessage('choose.segment');
      return;
    }

    this.existingManifestedUlds.forEach(element => {
      segmentData.manifestedUlds.push(element);
    });
    this.existingbulkShipments.forEach(element => {
      segmentData.bulkShipments.push(element);
    });


    // if (segmentData.manifestedUlds.length == 0 && segmentData.bulkShipments.length == 0) {
    //   this.showErrorMessage('please.add.shipments');
    //   return;
    // }

    segmentData.segmentId = this.arrivalFlightDetails.get("segment").value;
    segmentData.boardingPoint = this.arrivalFlightDetails.get(["segments", 0, "boardingPoint"]).value;
    segmentData.offPoint = this.arrivalFlightDetails.get(["segments", 0, "offPoint"]).value;
    segmentData.nilCargo = this.arrivalFlightDetails.get("nilCargo").value;
    segmentData.manifestUldCount = this.manifestUldCount;
    segmentData.bulkShipmentsCount = this.bulkShipmentsCount;
    flightData.flightNumber = this.arrivalFlightDetails.get("searchArrivalData.flight").value;
    flightData.flightDate = this.arrivalFlightDetails.get("searchArrivalData.date").value;
    flightData.flightNo = this.arrivalFlightDetails.get("searchArrivalData.flight").value;
    flightData.segments.push(segmentData);
    this.importService.saveULD(flightData).subscribe(response => {
      //console.log(response);
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('data.updated.successfully');
        this.navigateToDisplay();
      }
    }, (error) => {
      this.showErrorStatus(error);
    });

  }

  public onAddMovement(): void {
    const rowLength = (<NgcFormArray>this.arrivalManifestData.get("onwardMvmtResultList")).controls;

    if (rowLength.length === 3) {
      return;
    }

    (<NgcFormArray>this.arrivalManifestData.get("onwardMvmtResultList")).addValue([
      {
        checkBoxValue: "",
        flightNumber: "",
        departureDate: ""
      }
    ]);

  }

  public onAddOCI(): void {


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

  public onAddDimension(): void {


    (<NgcFormArray>this.arrivalManifestData.get("dimensionResultList")).addValue([
      {
        checkBoxValue: "",
        noOfPieces: "",
        weight: "",
        weightUnitCode: "K",
        length: "",
        width: "",
        height: "",
        measurementUnitCode: "CMT"
      }
    ]);

  }

  public onAddOSI(): void {
    (<NgcFormArray>this.arrivalManifestData.get("osiResultList")).addValue([
      {
        remarks: "",

      }
    ]);

  }

  public onDeleteDimension(event, index): void {
    (this.arrivalManifestData.get(["dimensionResultList"]) as NgcFormArray).markAsDeletedAt(index);
  }

  public onDeleteOCI(event, index): void {
    (this.arrivalManifestData.get(["ociResultList"]) as NgcFormArray).markAsDeletedAt(index);
  }

  public onDeleteOnward(event, index): void {
    (this.arrivalManifestData.get(["onwardMvmtResultList"]) as NgcFormArray).markAsDeletedAt(index);
  }

  public checkSegment() {
    if (this.arrivalManifestData.get("flightData.segment").value == null || this.arrivalManifestData.get("flightData.segment").value == "") {
      this.showErrorMessage('choose.segment');
      return false;
    }
  }

  public navigateToDisplay() {
    let flightSearchData: ArrivalManifestFlight = new ArrivalManifestFlight();

    flightSearchData.flightNumber = this.arrivalManifestData.get(
      "searchArrivalData.flight"
    ).value;
    flightSearchData.flightDate = this.arrivalManifestData.get(
      "searchArrivalData.date"
    ).value;
    let shipmentData = {
      flightNumber: this.arrivalFlightDetails.get("searchArrivalData.flight")
        .value,
      flightDate: this.arrivalFlightDetails.get("searchArrivalData.date").value
    };
    this.navigateTo(this.router, "/import/arrivalmanifest", shipmentData);
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
      flightNumber: this.arrivalFlightDetails.get("searchArrivalData.flight")
        .value,
      flightDate: this.arrivalFlightDetails.get("searchArrivalData.date").value
    };
    this.navigateTo(this.router, "/import/documentverification", shipmentData);
  }



  public onDestinationChange(event, parentIndex, childIndex) {
    let flightData: ArrivalManifestData = new ArrivalManifestData();
    const flightDetails = this.existingManifestData;
    flightData.flightId = flightDetails.flightId;
    flightData.carrierCode = flightDetails.carrierCode;
    flightData.flightDate = flightDetails.flightDate;
    flightData.flightNo = flightDetails.flightNo;
    flightData.flightType = flightDetails.flightType;
    flightData.segments = (this.arrivalFlightDetails.get(["segments"]) as NgcFormGroup).getRawValue();
    flightData.segments[childIndex].bulkShipments = [];
    flightData.segments[childIndex].manifestedUlds = [];
    flightData.segments[childIndex].bulkShipments[parentIndex] = (this.arrivalFlightDetails.get(["segments", childIndex, "bulkShipments", parentIndex]) as NgcFormGroup).getRawValue();
    this.importService.fetchRoutingInformation(flightData).subscribe(response => {
      //console.log(response);
      if (!this.showResponseErrorMessages(response)) {
        if (response.data) {
          (this.arrivalFlightDetails.get(["segments", childIndex, "bulkShipments", parentIndex, "carrierDestination"]) as NgcFormGroup).setValue(response.data.carrierDestination);
          (this.arrivalFlightDetails.get(["segments", childIndex, "bulkShipments", parentIndex, "carrierCode"]) as NgcFormGroup).setValue(response.data.carrierCode);
          (this.arrivalFlightDetails.get(["segments", childIndex, "bulkShipments", parentIndex, "movementInfo"]) as NgcFormArray).patchValue(response.data.movementInfo);
        } else {
          (this.arrivalFlightDetails.get(["segments", childIndex, "bulkShipments", parentIndex, "carrierDestination"]) as NgcFormGroup).setValue(null);
          (this.arrivalFlightDetails.get(["segments", childIndex, "bulkShipments", parentIndex, "carrierCode"]) as NgcFormGroup).setValue(null);
        }


      }
    }, (error) => {
      this.showErrorStatus(error);
    });

  }

  public onULDDestinationChange(event, parentindex, index, segmentrow) {
    let flightData: ArrivalManifestData = new ArrivalManifestData();
    const flightDetails = this.existingManifestData;
    flightData.flightId = flightDetails.flightId;
    flightData.carrierCode = flightDetails.carrierCode;
    flightData.flightDate = flightDetails.flightDate;
    flightData.flightNo = flightDetails.flightNo;
    flightData.flightType = flightDetails.flightType;
    flightData.segments = (this.arrivalFlightDetails.get(["segments"]) as NgcFormGroup).getRawValue();
    flightData.segments = (this.arrivalFlightDetails.get(["segments"]) as NgcFormGroup).getRawValue();
    flightData.segments[segmentrow].manifestedUlds = [];
    flightData.segments[segmentrow].manifestedUlds[0] = (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex]) as NgcFormGroup).getRawValue();
    flightData.segments[segmentrow].manifestedUlds[0].shipments = [];
    flightData.segments[segmentrow].manifestedUlds[0].shipments[0] = (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index]) as NgcFormGroup).getRawValue();
    flightData.segments[segmentrow].bulkShipments = [];
    this.importService.fetchRoutingInformation(flightData).subscribe(response => {
      //console.log(response);
      if (!this.showResponseErrorMessages(response)) {
        if (response.data) {
          (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index, "carrierDestination"]) as NgcFormGroup).setValue(response.data.carrierDestination);
          (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index, "carrierCode"]) as NgcFormGroup).setValue(response.data.carrierCode);
          (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index, "movementInfo"]) as NgcFormArray).patchValue(response.data.movementInfo);
        } else {
          (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index, "carrierDestination"]) as NgcFormGroup).setValue(null);
          (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentindex, "shipments", index, "carrierCode"]) as NgcFormGroup).setValue(null);
        }


      }
    }, (error) => {
      this.showErrorStatus(error);
    });

  }

  protected afterFocus() {
    if (this.shipmentFocus == 'ULD') {
      (this.arrivalFlightDetails.get(["segments", 0, "manifestedUlds", this.manifestedIndex, "uldNumber"]) as NgcFormControl).focus();
    } else if (this.shipmentFocus == 'Loose') {
      (this.arrivalFlightDetails.get(["segments", 0, "bulkShipments", this.looseIndex, "shipmentNumber"]) as NgcFormControl).focus();
    } else if (this.shipmentFocus == 'Shipment') {
      (this.arrivalFlightDetails.get(["segments", 0, "manifestedUlds", this.manifestedIndex, "shipments", (this.arrivalFlightDetails.get(["segments", 0, "manifestedUlds", this.manifestedIndex, "shipments"]) as NgcFormArray).length - 1, "shipmentNumber"]) as NgcFormControl).focus();
    }
  }

  /**
   * Track by Segment
   * 
   * @param index Index
   * @param item Item
   */
  public trackBySegment(index: number, item: any) {
    return item.get(['boardingPoint']).value + '-' + item.get(['offPoint']).value;
  }

  /**
   * Track by ULD
   * 
   * @param index Index
   * @param item Item
   */
  public trackByUld(index: number, item: any) {
    return item.get(['uldNumber']).value;
  }

  private validateRemarks(remarks) {
    let patt = new RegExp("^\s*([0-9a-zA-Z -.]+)\s*$");
    return patt.test(remarks);
  }

  onClear() {
    this.arrivalFlightDetails.get('searchArrivalData').reset();
    this.arrivalFlightDetails.get('segment').reset();
    (<NgcFormArray>this.arrivalFlightDetails.get(['segments'])).resetValue([]);
    this.arrivalFlightDetails.reset();
  }
  onCancel() {
    this.navigateToDisplay();
  }

}
