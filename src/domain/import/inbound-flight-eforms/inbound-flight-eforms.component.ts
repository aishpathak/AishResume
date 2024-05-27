import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcUtility, NgcReportComponent, ReactiveModel, NgcWindowComponent, PageConfiguration } from 'ngc-framework';
import { ApplicationEntities } from '../../common/applicationentities';
import { ApplicationFeatures } from '../../common/applicationfeatures';
import { ImportService } from '../import.service';
import { ArrivalManifestFlight, ConsignmentMovementData, DimensionData, OciData, OtherServicesInformation, SegmentData, ShcData, ShipmentModel, UldModel } from '../import.sharedmodel';

//comment
@Component({
  selector: 'app-inbound-flight-eforms',
  templateUrl: './inbound-flight-eforms.component.html',
  styleUrls: ['./inbound-flight-eforms.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
})

export class InboundFlightEFormsComponent extends NgcPage implements OnInit {
  //initalization of values are done
  isFlightInformation: boolean = false;
  shcCode: string;
  count: Number = 0;
  resp: any;
  private dataSyncSearch: number = 0;
  airportCode: any;
  cityCode: any;

  //popUpwindow for the Apron transfer external
  @ViewChild('popUpWindow') popUpWindow: NgcWindowComponent;

  //constructor for the declaration value
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


  @ReactiveModel(ArrivalManifestFlight)
  public arrivalFlightDetails: NgcFormGroup;

  //form group for the inboundFlightEFormSearch
  private inboundFlightEFormSearch: NgcFormGroup = new NgcFormGroup({
    flightNumber: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    shc: new NgcFormControl(),
    customsClearance: new NgcFormControl()
  })

  //form group for the inboundFlightEForm
  private inboundFlightEForm: NgcFormGroup = new NgcFormGroup({
    sta: new NgcFormControl(),
    eta: new NgcFormControl(),
    ata: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    routingInfo: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    flightLevelCount: new NgcFormGroup({
      flightLooseCargoCount: new NgcFormControl(),
      flightCargoInULD: new NgcFormControl(),
      flightPieces: new NgcFormControl(),
      flightWeight: new NgcFormControl()
    }),
    addLooseCargoInfo: new NgcFormGroup({
      uldNumber: new NgcFormControl(),
      looseCargoResultList: new NgcFormArray([])
    }),
    uldShipments: new NgcFormArray([]),
    uldResultList: new NgcFormArray([]),
    looseShipments: new NgcFormArray([]),
    onwardMvmtResultList: new NgcFormArray([]),
  });

  //ngOnInit method
  ngOnInit() {
    this.dataSyncSearch = 0;
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null) {
      if (forwardedData.flightNumber != null && forwardedData.flightNumber != "" && forwardedData.flightDate != null && forwardedData.flightDate != "") {
        this.inboundFlightEForm.get("searchForm.flight").setValue(forwardedData.flightNumber);
        this.inboundFlightEForm.get("searchForm.date").setValue(forwardedData.flightDate);
        this.onSearch();
      }
    }
    super.ngOnInit();
    this.airportCode = NgcUtility.getTenantConfiguration().airportCode;
    this.cityCode = NgcUtility.getTenantConfiguration().cityCode;
  }

  //onSearch function for data fetch
  public onSearch(): void {
    this.inboundFlightEFormSearch.validate();
    if (this.inboundFlightEFormSearch.invalid) {
      return;
    }
    this.isFlightInformation = false;
    let flightSearchData = this.inboundFlightEFormSearch.getRawValue();
    this.importService.flightEFormRequest(flightSearchData).subscribe(response => {
      //response data is placed in the resp
      this.resp = response.data;
      //dummy array is palced 
      let uldResultListDummy = [];
      //segement details
      response.data.segments.forEach((element, segmentIndex) => {
        //bulkshipments
        if (element && element.bulkShipments.length > 0) {
          //bulk data
          element.bulkShipments.forEach(bulk => {
            bulk.check = false;
            bulk.index = (segmentIndex + 1) + '. ' + element["boardingPoint"];
            bulk["flightKey"] = element["flightKey"];
            bulk["flightDate"] = element["flightDate"];
            bulk["uldCount"] = element["uldCount"];
            bulk["looseCargoCount"] = element["looseCargoCount"];
            bulk["cargoInULD"] = element["cargoInULD"];
            bulk["segmentUldGruopDetailsCount"] = element["segmentUldGruopDetailsCount"];
            bulk["segmentPieceCount"] = element["segmentPieceCount"];
            bulk["segmentWeight"] = Number(NgcUtility.getDisplayWeight(element["segmentWeight"]));
            bulk["uldNumber"] = "BULK ";
            bulk["uldRemarks"] = "";
            bulk["pieceCount"] = "";
            bulk["shipmentCount"] = "";
            bulk["pieceCount"] = null;
            bulk["weightt"] = null;
            bulk["weight"] = Number(NgcUtility.getDisplayWeight(bulk["weight"]));
            bulk["nonAssistedCarrier"] = element["nonAssistedCarrier"];
            bulk["select"] = element["select"];
            let shcValue = "";
            //loop written for the shc array in bulk
            bulk["shc"].forEach(element => {
              shcValue = shcValue + ' ' + element.specialHandlingCode;
            });
            bulk.shcCodes = shcValue;
            uldResultListDummy.push(bulk);
          });
        }
        if (element && element.manifestedUlds.length > 0) {
          //manifestedULD Data We are fetching the data
          element.manifestedUlds.forEach(manifestedUld => {
            if (manifestedUld && manifestedUld.shipments && manifestedUld.shipments.length > 0) {
              manifestedUld.shipments.forEach(uldShipment => {
                uldShipment.check = false;
                uldShipment.index = (segmentIndex + 1) + '. ' + element["boardingPoint"];
                uldShipment["flightKey"] = element["flightKey"];
                uldShipment["flightDate"] = element["flightDate"];
                uldShipment["segmentId"] = element["impArrivalManifestBySegmentId"];
                uldShipment["uldNumber"] = manifestedUld["uldNumber"];
                uldShipment["uldRemarks"] = manifestedUld["uldRemarks"];
                uldShipment["pieceCount"] = manifestedUld["pieceCount"];
                uldShipment["boardingPoint"] = element["boardingPoint"];
                uldShipment["uldCount"] = element["uldCount"];
                uldShipment["looseCargoCount"] = element["looseCargoCount"];
                uldShipment["cargoInULD"] = element["cargoInULD"];
                uldShipment["segmentUldGruopDetailsCount"] = element["segmentUldGruopDetailsCount"];
                uldShipment["segmentPieceCount"] = element["segmentPieceCount"];
                uldShipment["segmentWeight"] = Number(NgcUtility.getDisplayWeight(element["segmentWeight"]));
                uldShipment["shipmentCount"] = manifestedUld["shipmentCount"];
                uldShipment["pieceCount"] = manifestedUld["pieceCount"];
                uldShipment["weightt"] = Number(NgcUtility.getDisplayWeight(manifestedUld["weight"]));
                uldShipment["segment"] = element["impArrivalManifestBySegmentId"];
                uldShipment["weight"] = Number(NgcUtility.getDisplayWeight(uldShipment["weight"]));
                uldShipment["nonAssistedCarrier"] = element["nonAssistedCarrier"];
                uldShipment["constraintCode"] = element["constraintCode"];
                uldShipment["select"] = element["select"];
                let shcValue = "";
                //loop written for the shc array in uldShipment
                uldShipment["shc"].forEach(element => {
                  shcValue = shcValue + ' ' + element.specialHandlingCode;
                });
                uldShipment.shcCodes = shcValue;

                uldResultListDummy.push(uldShipment);
              });
            }
          });
        }
      });
      //uldResultListDummy is placed in the response data
      response.data.uldResultList = uldResultListDummy;
      //we are patching the data which is present out the editable table data
      this.inboundFlightEForm.patchValue(this.resp);
      ///we are patching the data which is  the editable table data
      this.inboundFlightEForm.get(['uldResultList']).patchValue(response.data.uldResultList);
      this.isFlightInformation = true;
    },
      error => {
        this.showErrorStatus(error);
      }
    );
  }

  //onClick backhandling
  public onBack(event) {
    this.navigateBack(this.inboundFlightEForm.getRawValue());
  }

  //onSafeHand function is placed for Safe-hand carge handover button
  onReport(event) {
    this.resetFormMessages();
    const request = this.inboundFlightEForm.getRawValue();
    request.uldResultList = request.uldResultList.filter((element) => {
      return element.select && element.shipmentNumber
    });
    /* this is done so that user should select at least one record */
    if (request.uldResultList.length == 0) {
      this.showErrorMessage("select.one.record");
      return;
    }
  }
}


