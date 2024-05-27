
import { ImportService } from './../import.service';
import {
  Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, ViewChildren,
  QueryList
} from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, PageConfiguration, NgcUtility, NgcFormControl, CreateFormByModel, ReactiveModel, NgcAwbInputComponent, NgcULDInputComponent } from 'ngc-framework';
import { ArrivalManifestFlight, SegmentData, UldModel, ShipmentModel, DimensionData, OciData, ConsignmentMovementData, OtherServicesInformation, ShcData, ArrivalManifestData, RoutingRequestModel } from '../import.sharedmodel';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-createarrivalmanifest',
  templateUrl: './createarrivalmanifest.component.html',
  styleUrls: ['./createarrivalmanifest.component.scss']
})

@PageConfiguration({
  trackInit: true,
  //callNgOnInitOnClear: true,
  autoBackNavigation: true,
  focusToBlank: true,
  noAutoFocus: true,
  restorePageOnBack: false,
  dontRestoreOnBrowserBack: false
})
export class CreatearrivalmanifestComponent extends NgcPage {
  shipmentData: any;
  @ViewChild('additionalInformationWindow') additionalInformationWindow: NgcWindowComponent;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private importService: ImportService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.arrivalFlightDetails.get('segment').reset();
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null) {
      if (forwardedData.flightNumber != null && forwardedData.flightNumber != "" && forwardedData.flightDate != null && forwardedData.flightDate != "") {
        this.arrivalFlightDetails.get('searchArrivalData.flight').setValue(forwardedData.flightNumber);
        this.arrivalFlightDetails.get('searchArrivalData.date').setValue(forwardedData.flightDate);
        this.onSearch();
      }
    }
  }

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
  count: number = 0;



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
      flightDate: new NgcFormControl(),
      sta: new NgcFormControl(),
      eta: new NgcFormControl(),
      ata: new NgcFormControl(),
      aircraftRegCode: new NgcFormControl(),
      flightStatus: new NgcFormControl(),
      weightUnitCode: new NgcFormControl(),
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

  public onAdditionalInformationPopUp(event, parentIndex, index, segmentrow): void {
    let additionalDetails: ShipmentModel = new ShipmentModel();
    additionalDetails = (this.arrivalFlightDetails.get(["segments", segmentrow, "manifestedUlds", parentIndex, "shipments", index]) as NgcFormGroup).getRawValue();
    this.segmentindex = segmentrow;
    this.uldIndex = parentIndex;
    this.shipmentsIndex = index;
    this.isLooseCargo = false;
    this.bindAdditionalInformation(additionalDetails);
  }

  public onAdditionalInformationpopUpLoose(event, index, segmentrow): void {
    let additionalDetails: ShipmentModel = new ShipmentModel();
    additionalDetails = (this.arrivalFlightDetails.get(["segments", segmentrow, "bulkShipments", index]) as NgcFormGroup).getRawValue();
    this.segmentindex = segmentrow;
    this.isLooseCargo = true;
    this.LooseShipmentsIndex = index;
    this.bindAdditionalInformation(additionalDetails);
  }

  public onSearch(): void {

    (<NgcFormArray>this.arrivalFlightDetails.get(['segments'])).resetValue([]);
    let flightSearchData: ArrivalManifestFlight = new ArrivalManifestFlight();
    flightSearchData.flightNumber = this.arrivalFlightDetails.get("searchArrivalData.flight").value;
    flightSearchData.flightDate = this.arrivalFlightDetails.get("searchArrivalData.date").value;
    flightSearchData.segmentId = this.arrivalFlightDetails.get("segment").value;
    flightSearchData.segmentId = flightSearchData.segmentId ? flightSearchData.segmentId : 0;
    this.isShipmentInformation = false;
    this.isFlightInformation = false;
    this.FlightId = 0;
    this.carrierCode = null;
    if (flightSearchData.flightNumber == null || flightSearchData.flightDate == null) {
      this.showErrorStatus("error.import.enter.mandatory.fields");
      return;
    }
    this.importService.fetchArrivalSearchDetails(flightSearchData).subscribe(data => {
      console.log(data);
      this.LooseCargoShipments = [];
      this.uldInformation = [];
      this.dimensionInformation = [];
      if (!this.showResponseErrorMessages(data)) {
        /* Begin comment
		if (data.data) {
          if (data.data.handlinginSystem) {
            this.showConfirmMessage('Entered flight is not being handled in COSYS+, please proceed to handle this flight in COSYS').then(reason => {
              this.bindDataToControls(data, flightSearchData);
            }).catch(reason => {

            })
          } else {
            this.bindDataToControls(data, flightSearchData);
          }

        } --- End comment */
      }
    }, (error) => {
      this.showErrorStatus(error);
    });
  }

  bindDataToControls(data, flightSearchData) {
    this.isFlightInformation = true;
    this.FlightId = data.data.impArrivalManifestByFlightId;
    this.aircraftRegCode = data.data.aircraftRegCode;
    this.flightStatus = data.data.flightStatus;
    this.arrivalFlightDetails.patchValue(data.data);
    this.arrivalFlightDetails.get('flightNumber').setValue(flightSearchData.flightNumber);
    this.carrierCode = data.data.carrierCode;
    this.sourceIdSegmentDropdown = this.createSourceParameter(this.arrivalFlightDetails.get("searchArrivalData.flight").value, this.arrivalFlightDetails.get("searchArrivalData.date").value);
    for (let segmentData of data.data.segments) {
      for (let looseCargo of segmentData.bulkShipments) {
        this.LooseCargoShipments.push(looseCargo);
      }
      for (let uldData of segmentData.manifestedUlds) {
        this.uldInformation.push(uldData);
      }
    }

    if (this.LooseCargoShipments.length > 0 || this.uldInformation.length > 0) {
      this.isShipmentInformation = true;
      this.dimensionInformation = [];
      this.ociInformation = [];
      this.osiInformation = [];
      this.onwardInformation = [];
    }

    //if (flightSearchData.segmentId) {
    if (data.data.segments && data.data.segments[0]) {
      this.arrivalFlightDetails.get("nilCargo").setValue(data.data.segments[0].nilCargo);
    }
    //}


    this.arrivalFlightDetails.get('segments').patchValue(data.data.segments);
    this.arrivalFlightDetails.get('segments').valueChanges.subscribe(value => {


    }
    );
    this.arrivalFlightDetails.get('weightUnitCode').patchValue('K');
    if (flightSearchData.segmentId == 0) {
      this.arrivalFlightDetails.get('segment').reset();
    }
    this.retrieveDropDownListRecords("ARRIVAL_FLIGHTSEGMENT", "query", this.sourceIdSegmentDropdown).subscribe(data => {
      if (data.length == 1) {
        this.arrivalFlightDetails.get('segment').reset();
        this.arrivalFlightDetails.get('segment').setValue(data[0].code);
      }
    });
    if (this.uldInformation && this.uldInformation.length > 0) {
      this.arrivalFlightDetails.get('segments.manifestedUlds').patchValue(this.uldInformation);
    }
    for (let segmentindex = 0; segmentindex < data.data.segments.length; segmentindex++) {
      if (data.data.segments[segmentindex].manifestedUlds.length > 0) {
        for (let index = 0; index < this.uldInformation.length; index++) {
          (this.arrivalFlightDetails.get(["segments", segmentindex, "manifestedUlds", index, "uldNumber"]) as NgcFormGroup).disable({ onlySelf: true, emitEvent: false });
          for (let subindex = 0; subindex < this.uldInformation[index].shipments.length; subindex++) {

            if (this.uldInformation[index].shipments[subindex].offloadedFlag) {
              (this.arrivalFlightDetails.get(["segments", segmentindex, "manifestedUlds", index, "shipments", subindex]) as NgcFormGroup).disable({ onlySelf: true, emitEvent: false });
              this.arrivalFlightDetails.get(["segments", segmentindex, "manifestedUlds", index, "shipments", subindex, "shc"]).disable({ onlySelf: true, emitEvent: false });
              (this.arrivalFlightDetails.get(["segments", segmentindex, "manifestedUlds", index, "shipments", subindex, "specialHandlingCode"]) as NgcFormGroup).disable({ onlySelf: true, emitEvent: false });
            }
            else {
              (this.arrivalFlightDetails.get(["segments", segmentindex, "manifestedUlds", index, "shipments", subindex, "shipmentNumber"]) as NgcFormGroup).disable({ onlySelf: true, emitEvent: false });
            }
          }
        }
      }
      if (data.data.segments[segmentindex].bulkShipments.length > 0) {
        for (let index = 0; index < this.LooseCargoShipments.length; index++) {
          if (this.LooseCargoShipments[index].offloadedFlag) {
            (this.arrivalFlightDetails.get(["segments", segmentindex, "bulkShipments", index]) as NgcFormGroup).disable({ onlySelf: true, emitEvent: false });
            this.arrivalFlightDetails.get(["segments", segmentindex, "bulkShipments", index, "shc"]).disable({ onlySelf: true, emitEvent: false });
          } else {
            (this.arrivalFlightDetails.get(["segments", segmentindex, "bulkShipments", index, "shipmentNumber"]) as NgcFormGroup).disable({ onlySelf: true, emitEvent: false });
          }
        }
      }

    }
  }

  public onBack(event) {
    this.navigateBack(this.arrivalManifestData.getRawValue());
  }

  public onSegmentChange(event) {
    if (event) {
      this.onSearch();
    }
  }

  public onSave(): void {
    let segmentData: SegmentData = new SegmentData();
    let flightData: ArrivalManifestData = new ArrivalManifestData();
    const item = (this.arrivalFlightDetails.get(["segments", 0,]) as NgcFormArray).getRawValue();
    segmentData.manifestedUlds = (this.arrivalFlightDetails.get(["segments", 0, "manifestedUlds"]) as NgcFormArray).getRawValue();
    console.log(segmentData.manifestedUlds);
    segmentData.bulkShipments = (this.arrivalFlightDetails.get(["segments", 0, "bulkShipments"]) as NgcFormArray).getRawValue();
    console.log(segmentData.bulkShipments);
    flightData.flightId = this.FlightId;
    flightData.carrierCode = this.carrierCode;
    if (this.arrivalFlightDetails.get("segment").value == null || this.arrivalFlightDetails.get("segment").value == "") {
      this.showErrorMessage('choose.segment');
      return;
    }
    segmentData.segmentId = this.arrivalFlightDetails.get("segment").value;
    segmentData.boardingPoint = this.arrivalFlightDetails.get(["segments", 0, "boardingPoint"]).value;
    segmentData.offPoint = this.arrivalFlightDetails.get(["segments", 0, "offPoint"]).value;
    segmentData.nilCargo = this.arrivalFlightDetails.get("nilCargo").value;
    flightData.flightNumber = this.arrivalFlightDetails.get("flightNumber").value;
    flightData.flightDate = this.arrivalFlightDetails.get("flightDate").value;
    flightData.flightNo = this.arrivalFlightDetails.get("flightNumber").value;
    flightData.segments.push(segmentData);
    this.importService.saveULD(flightData).subscribe(response => {
      console.log(response);
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('shipment.added.successfully');
        this.onSearch();
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

  private validateRemarks(remarks) {
    let patt = new RegExp("^\s*([0-9a-zA-Z -.]+)\s*$");
    return patt.test(remarks);
  }

  public onAdditionalInformationSave(): void {
    const dimensionDetails = (<NgcFormArray>this.arrivalManifestData.get('dimensionResultList')).getRawValue();
    dimensionDetails.forEach((item, index) => {
      if (item.noOfPieces == "" && item.weight == ""
        && item.length == "" && item.width == "" && item.height == ""
      ) dimensionDetails.splice(index, 1);
    });
    const ociDetails = (<NgcFormArray>this.arrivalManifestData.get('ociResultList')).getRawValue();
    ociDetails.forEach((item, index) => {
      if (item.informationIdentifier == ""
        && item.csrciIdentifier == "" && item.scsrcInformation == "" && (item.countryCode == "" || item.countryCode == null)) ociDetails.splice(index, 1);
    });
    const onwardDetails = (<NgcFormArray>this.arrivalManifestData.get('onwardMvmtResultList')).getRawValue();
    onwardDetails.forEach((item, index) => {
      if ((item.flightNumber == null || item.flightNumber == "")
        && item.departureDate == null) onwardDetails.splice(index, 1);
    });
    const osiDetails = (<NgcFormArray>this.arrivalManifestData.get('osiResultList')).getRawValue();
    let patternCheck: boolean = false;
    osiDetails.forEach((item, index) => {
      if (item.remarks == null
        || item.remarks == "") osiDetails.splice(index, 1);
      if ((item.remarks != null && item.remarks != "") && !this.validateRemarks(item.remarks)) {
        this.showErrorMessage("osi.remarks.contents");
        patternCheck = true;
      }
    });
    if (patternCheck) {
      return;
    }


    if (!this.isLooseCargo) {
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "manifestedUlds",
        this.uldIndex, "shipments", this.shipmentsIndex, "densityGroupCode"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.densityGroup").value);
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "manifestedUlds",
        this.uldIndex, "shipments", this.shipmentsIndex, "volumeAmount"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.volume").value);
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "manifestedUlds",
        this.uldIndex, "shipments", this.shipmentsIndex, "volumeunitCode"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.volumeUnitCode").value);
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "manifestedUlds",
        this.uldIndex, "shipments", this.shipmentsIndex, "customsReference"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.customsReference").value);
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "manifestedUlds",
        this.uldIndex, "shipments", this.shipmentsIndex, "customsOriginCode"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.customsOrigin").value);
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "manifestedUlds",
        this.uldIndex, "shipments", this.shipmentsIndex, "movementPriorityCode"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.movementPriorityCode").value);
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "manifestedUlds",
        this.uldIndex, "shipments", this.shipmentsIndex, "offloadedFlag"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.offloadedFlag").value);
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "manifestedUlds",
        this.uldIndex, "shipments", this.shipmentsIndex, "offloadReasonCode"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.offloadReasonCode").value);
      //additonal Info Details
      (this.arrivalFlightDetails.get(["segments", this.segmentindex, "manifestedUlds",
        this.uldIndex, "shipments", this.shipmentsIndex, "dimensions"]) as NgcFormArray).patchValue(dimensionDetails);
      (this.arrivalFlightDetails.get(["segments", this.segmentindex, "manifestedUlds",
        this.uldIndex, "shipments", this.shipmentsIndex, "oci"]) as NgcFormArray).patchValue(ociDetails);
      (this.arrivalFlightDetails.get(["segments", this.segmentindex, "manifestedUlds",
        this.uldIndex, "shipments", this.shipmentsIndex, "movementInfo"]) as NgcFormArray).patchValue(onwardDetails);
      (this.arrivalFlightDetails.get(["segments", this.segmentindex, "manifestedUlds",
        this.uldIndex, "shipments", this.shipmentsIndex, "osi"]) as NgcFormArray).patchValue(osiDetails);
    } else {
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "bulkShipments",
        this.LooseShipmentsIndex, "densityGroupCode"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.densityGroup").value);
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "bulkShipments",
        this.LooseShipmentsIndex, "volumeAmount"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.volume").value);
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "bulkShipments",
        this.LooseShipmentsIndex, "volumeunitCode"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.volumeUnitCode").value);
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "bulkShipments",
        this.LooseShipmentsIndex, "customsReference"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.customsReference").value);
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "bulkShipments",
        this.LooseShipmentsIndex, "customsOriginCode"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.customsOrigin").value);
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "bulkShipments",
        this.LooseShipmentsIndex, "movementPriorityCode"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.movementPriorityCode").value);
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "bulkShipments",
        this.LooseShipmentsIndex, "offloadedFlag"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.offloadedFlag").value);
      this.arrivalFlightDetails.get(["segments", this.segmentindex, "bulkShipments",
        this.LooseShipmentsIndex, "offloadReasonCode"])
        .setValue(this.arrivalManifestData.get("additionalInfoData.offloadReasonCode").value);
      //additional info details
      (this.arrivalFlightDetails.get(["segments", this.segmentindex, "bulkShipments",
        this.LooseShipmentsIndex, "dimensions"]) as NgcFormArray).patchValue(dimensionDetails);
      (this.arrivalFlightDetails.get(["segments", this.segmentindex, "bulkShipments",
        this.LooseShipmentsIndex, "oci"]) as NgcFormArray).patchValue(ociDetails);
      (this.arrivalFlightDetails.get(["segments", this.segmentindex, "bulkShipments",
        this.LooseShipmentsIndex, "movementInfo"]) as NgcFormArray).patchValue(onwardDetails);
      (this.arrivalFlightDetails.get(["segments", this.segmentindex, "bulkShipments",
        this.LooseShipmentsIndex, "osi"]) as NgcFormArray).patchValue(osiDetails);
    }

    this.additionalInformationWindow.close();
  }

  public bindAdditionalInformation(additionalDetails): void {
    this.shipmentInformation = additionalDetails;
    this.shipmentRowId = additionalDetails.impArrivalManifestShipmentInfoId;
    this.arrivalManifestData.get('additionalInfoData.awbNumber').setValue(additionalDetails.shipmentNumber);
    additionalDetails.densityGroupCode = additionalDetails.densityGroupCode ? additionalDetails.densityGroupCode : 0;
    this.arrivalManifestData.get("additionalInfoData.densityGroup").setValue(additionalDetails.densityGroupCode);
    this.arrivalManifestData.get("additionalInfoData.volume").setValue(additionalDetails.volumeAmount);
    this.arrivalManifestData.get("additionalInfoData.volumeUnitCode").setValue(additionalDetails.volumeunitCode);
    this.arrivalManifestData.get("additionalInfoData.customsReference").setValue(additionalDetails.customsReference);
    this.arrivalManifestData.get("additionalInfoData.customsOrigin").setValue(additionalDetails.customsOriginCode);
    this.arrivalManifestData.get("additionalInfoData.movementPriorityCode").setValue(additionalDetails.movementPriorityCode);
    this.arrivalManifestData.get('dimensionResultList').patchValue(additionalDetails.dimensions);
    this.arrivalManifestData.get('ociResultList').patchValue(additionalDetails.oci);
    this.arrivalManifestData.get('onwardMvmtResultList').patchValue(additionalDetails.movementInfo);
    this.arrivalManifestData.get('osiResultList').patchValue(additionalDetails.osi);
    this.arrivalManifestData.get('additionalInfoData.offloadedFlag').patchValue(additionalDetails.offloadedFlag);
    this.arrivalManifestData.get('additionalInfoData.offloadReasonCode').patchValue(additionalDetails.offloadReasonCode);
    const onward = (<NgcFormArray>this.arrivalManifestData.get("onwardMvmtResultList")).controls;
    const dimension = (<NgcFormArray>this.arrivalManifestData.get("dimensionResultList")).controls;
    const oci = (<NgcFormArray>this.arrivalManifestData.get("ociResultList")).controls;
    const osi = (<NgcFormArray>this.arrivalManifestData.get("osiResultList")).controls;
    if (dimension.length == 0) {
      this.onAddDimension();
    }
    if (oci.length == 0) {
      this.onAddOCI();
    }
    if (onward.length == 0) {
      this.onAddMovement();
    }
    if (osi.length == 0) {
      this.onAddOSI();
      this.onAddOSI();
    }

    this.arrivalManifestData.get('additionalInfoData.volumeUnitCode').setValue('MC');
    this.isOffloaded = false;
    if (additionalDetails.offloadedFlag) {
      this.arrivalManifestData.get('dimensionResultList').disable({ onlySelf: true, emitEvent: false });
      this.arrivalManifestData.get('ociResultList').disable({ onlySelf: true, emitEvent: false });
      this.arrivalManifestData.get('onwardMvmtResultList').disable({ onlySelf: true, emitEvent: false });
      this.arrivalManifestData.get('osiResultList').disable({ onlySelf: true, emitEvent: false });
      this.arrivalManifestData.get("additionalInfoData.densityGroup").disable({ onlySelf: true, emitEvent: false });
      this.arrivalManifestData.get("additionalInfoData.volume").disable({ onlySelf: true, emitEvent: false });
      this.arrivalManifestData.get("additionalInfoData.volumeUnitCode").disable({ onlySelf: true, emitEvent: false });
      this.arrivalManifestData.get("additionalInfoData.customsReference").disable({ onlySelf: true, emitEvent: false });
      this.arrivalManifestData.get("additionalInfoData.customsOrigin").disable({ onlySelf: true, emitEvent: false });
      this.arrivalManifestData.get("additionalInfoData.movementPriorityCode").disable({ onlySelf: true, emitEvent: false });
      this.isOffloaded = true;
    } else {
      this.arrivalManifestData.get('dimensionResultList').enable();
      this.arrivalManifestData.get('ociResultList').enable();
      this.arrivalManifestData.get('onwardMvmtResultList').enable();
      this.arrivalManifestData.get('osiResultList').enable();
      this.arrivalManifestData.get("additionalInfoData.densityGroup").enable();
      this.arrivalManifestData.get("additionalInfoData.volume").enable();
      this.arrivalManifestData.get("additionalInfoData.volumeUnitCode").enable();
      this.arrivalManifestData.get("additionalInfoData.customsReference").enable();
      this.arrivalManifestData.get("additionalInfoData.customsOrigin").enable();
      this.arrivalManifestData.get("additionalInfoData.movementPriorityCode").enable();
      this.isOffloaded = false;
    }
    this.additionalInformationWindow.open();
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
    const flightDetails = this.arrivalFlightDetails.getRawValue();
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
      console.log(response);
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
    const flightDetails = this.arrivalFlightDetails.getRawValue();
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
      console.log(response);
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

  // protected afterFocus() {
  //   if (this.shipmenInputList) {
  //     const shipmentInput: NgcAwbInputComponent = this.shipmenInputList.last as NgcAwbInputComponent;
  //     if (shipmentInput) {
  //       shipmentInput.focus();
  //     }
  //   }
  // }

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

  onClear() {
    this.arrivalFlightDetails.get('searchArrivalData').reset();
    this.arrivalFlightDetails.get('segment').reset();
    (<NgcFormArray>this.arrivalFlightDetails.get(['segments'])).resetValue([]);
    this.arrivalFlightDetails.reset();
  }


}
