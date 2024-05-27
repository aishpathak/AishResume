import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcFormControl, NgcButtonComponent, NgcUtility, PageConfiguration, NgcWindowComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { OffloadShipmentInventory, OffloadSegment, OffloadULD, OffloadShipment, OffloadModel, SummaryModel } from './../buildup.sharedmodel';
import { BuildupService } from './../buildup.service';
import { Flight, UnloadShipment } from './../../export.sharedmodel';
import { ApplicationFeatures } from '../../../common/applicationfeatures';

@Component({
  selector: 'app-offload-summary',
  templateUrl: './offload-summary.component.html',
  styleUrls: ['./offload-summary.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class OffloadSummaryComponent extends NgcPage implements OnInit {
  resp: any;
  display: SummaryModel[] = [];
  offloadedDisplay: SummaryModel[] = [];
  displayFlag = false;
  offloadLocations: any = [];
  maniPiecesTotal: number;
  maniWeightTotal: number;
  offPiecesTotal: number;
  offWeightTotal: number;
  offloadedPiecesTotal: number;
  offloadedWeightTotal: number;
  innerTemp: OffloadShipment;
  reportParameters: any;
  expPreOffloadShipmentInventoryInfoId: number;
  index: any;
  flagCRUD: string = 'R';
  offWeightFlag = false;
  offPiecesFlag = false;
  zeroWeightFlag = false;
  zeroPiecesFlag = false;
  totaloffloadweight: number = 0.0;
  totaloffloadpieces: number = 0;
  expPreOffloadShipmentInfoId: number;
  shipmentId: number;
  expPreOffloadULDInfoId: number;
  private actualLocationFeatureEnabled: boolean = false;
  private addlLocationFeatureEnabled: boolean = false;
  private shipmentSelectionFeatureEnabled: boolean = false;
  private shipmentLocationFeatureEnabled: boolean = false;
  private warehouseLocationFeatureEnabled: boolean = false;
  private sectorId: any = '';
  @ViewChild('finalizeButton') finalizeButton: NgcButtonComponent;
  @ViewChild('saveButton') saveButton: NgcButtonComponent;
  @ViewChild("locationdetailsWindow")
  locationdetailsWindow: NgcWindowComponent;
  showlocationdetails: boolean = true;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private buildUpService: BuildupService, private route: ActivatedRoute,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  private offloadForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flightOriginDate: new NgcFormControl(new Date()),
    flight: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    status: new NgcFormControl(),
    flightType: new NgcFormControl(),
    sel: new NgcFormControl(),
    aircraftRegistration: new NgcFormControl(),
    awbList: new NgcFormArray([]),
    maniPieces: new NgcFormControl(),
    offPieces: new NgcFormControl(),
    maniWeight: new NgcFormControl(),
    offWeight: new NgcFormControl(),
    doneOffPieces: new NgcFormControl(),
    doneOffWeight: new NgcFormControl(),
    ShipmentLocation: new NgcFormControl(),
    warehouselocation: new NgcFormControl(),
    actualLocation: new NgcFormControl(),
    offloadPieces: new NgcFormControl(),
    offloadWeight: new NgcFormControl(),
    offloadLocation: new NgcFormControl(),
    warehouseLocation: new NgcFormControl(),
    preOffload: new NgcFormArray([]),
    preoffloadLocations: new NgcFormArray([]),
    offloadedList: new NgcFormArray([]),
    select: new NgcFormControl(),


  });


  public offloadDetailsForm: NgcFormGroup = new NgcFormGroup({
    offloadLocationsList: new NgcFormArray([
      new NgcFormGroup({
        offloadPieces: new NgcFormControl(),
        offloadWeight: new NgcFormControl(),
        offloadLocation: new NgcFormControl(),
        warehouseLocation: new NgcFormControl(),
        actualLocation: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),

      })
    ]),
    piecesList: new NgcFormArray([
      new NgcFormGroup({
        uldNumber: new NgcFormControl(),
        awbNumber: new NgcFormControl(),

      })
    ]),
  });
  ngOnInit() {
    const transferData = this.getNavigateData(this.route);
    this.actualLocationFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_Shipment_ActualLocation);
    this.addlLocationFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_Offload_AddLocation);
    this.shipmentSelectionFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_Offload_ShipmentSelection);
    this.shipmentLocationFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_Offload_ShipmentLocation);
    this.warehouseLocationFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_Offload_WarehouseLocation);
    try {
      if (transferData !== null && transferData !== undefined) {
        this.offloadForm.get('flightKey').setValue(transferData.flightKey);
        this.offloadForm.get('flightOriginDate').setValue(transferData.flightDate);
        this.fetchFlightULD();
      }
    } catch (e) { }
  }

  fetchFlightULD() {
    this.display = new Array<SummaryModel>();
    this.offloadedDisplay = [];
    const flight: Flight = new Flight();
    flight.flightKey = this.offloadForm.get('flightKey').value;
    flight.flightOriginDate = this.offloadForm.get('flightOriginDate').value;
    this.buildUpService.searchPreoffload(flight).subscribe(data => {
      if (data.data) {
        this.totaloffloadpieces = 0;
        this.totaloffloadweight = 0.0;
        this.displayFlag = true;
        this.resp = data.data;
        console.log(this.resp);
        if (data.success) {
          this.offloadForm.get('flight').setValue(this.offloadForm.get('flightKey').value);
          let tempDateStr = ('' + this.offloadForm.get('flightOriginDate').value).substring(4, 15);
          let actualDate = (tempDateStr.substr(4, 2) + tempDateStr.substr(0, 3) + tempDateStr.substr(7, 4));
          this.offloadForm.get('flightDate').patchValue(NgcUtility.getDateAsString(this.offloadForm.get('flightOriginDate').value));
          this.offloadForm.patchValue(this.resp.flight);

          this.offloadForm.get('etd').setValue(this.resp.etd);
          this.formatRequestData(this.resp);
          this.formatResponseData(this.resp);
          console.log('OFFLOAD');
          console.log(this.offloadedDisplay);
          this.offloadForm.get('awbList').patchValue(this.display);
          this.offloadForm.get('offloadedList').patchValue(this.offloadedDisplay);
          this.offloadForm.get('maniPieces').patchValue(this.maniPiecesTotal);
          this.offloadForm.get('maniWeight').patchValue(this.maniWeightTotal);
          this.offloadForm.get('offPieces').patchValue(this.offPiecesTotal);
          this.offloadForm.get('offWeight').patchValue(this.offWeightTotal);
          this.offloadForm.get('doneOffPieces').patchValue(this.offloadedPiecesTotal);
          this.offloadForm.get('doneOffWeight').patchValue(this.offloadedWeightTotal);
        }
      }
      else if (!data.messageList) {
        this.showErrorStatus("no.record");
      } else {
        this.showErrorStatus(data.messageList[0].code);
      }
    });
  }


  finalizeFlag = false;
  onFinalizeButton() {
    this.finalizeFlag = true;
    const offload: OffloadModel = this.resp;
    let awblist = [];
    this.offloadForm.get(['awbList'])
    if (this.shipmentSelectionFeatureEnabled) {
      awblist = this.offloadForm.get(['awbList']).value.filter(element => element.select == true);
      if (awblist.length < 1) {
        this.showErrorMessage("flight.select.atleast.one.checkbox");
        return;
      } else {
        offload.shipmentList = awblist;
        awblist.forEach((value, index) => {
          offload.shipmentList[index] = value.awbNumber
        });
      }
    } else {
      awblist = offload.shipmentList = this.offloadForm.get(['awbList']).value;
      awblist.map((value, index) => {
        offload.shipmentList[index] = value.awbNumber
      });
    }
    offload.flight.etd = null;
    offload.flight.std = null;
    if ((<NgcFormArray>this.offloadForm.get(['awbList'])).length > 0) {
      this.buildUpService.finalSaveOffload(offload).subscribe((data) => {
        this.finalizeFlag = false;
        if (data.success) {
          this.showSuccessStatus('export.offload.finalize.completed');
          this.fetchFlightULD();
        } else {
          this.showResponseErrorMessages(data);
        }

      });
    }

  }

  formatResponseData(response: any) {
    this.offloadedPiecesTotal = 0;
    this.offloadedWeightTotal = 0.0;
    const segArray = response.offloadSegments;
    for (const seg of segArray) {
      const origin = seg.flightBoardPoint;
      const dest = seg.flightOffPoint;
      if (seg.uldList.length > 0) {
        for (const uld of seg.uldList) {
          const uldNum = uld.uldNumber;
          const reasonOff = uld.reason;
          if (uld.shipments && uld.shipments.length > 0) {
            for (const ship of uld.shipments) {
              const temp: SummaryModel = new SummaryModel();
              temp.uldNumber = uldNum;
              temp.awbNumber = ship.awbNumber;
              temp.origin = ship.origin;
              temp.destination = ship.destination;
              temp.natureOfGoods = ship.natureOfGoods;
              temp.tt = ship.transferType;
              temp.reason = reasonOff;
              let tempShc = '';
              if (ship.shc && ship.shc.length > 0) {
                for (const code of ship.shc) {
                  tempShc = tempShc + code.code + ' ';
                }
              }
              let warehouselocation = '';
              if (ship.preoffloadLocations && ship.preoffloadLocations.length > 0) {
                for (const code2 of ship.preoffloadLocations) {
                  warehouselocation = warehouselocation + code2.offloadLocation + ' ';
                }
              }
              temp.terminal = uld.handlingArea;
              temp.warehouselocation = warehouselocation;
              temp.shc = tempShc;
              temp.offloadPieces = ship.pieces;
              temp.offloadWeight = ship.weight;
              temp.offloadLocation = ship.offloadLocation;
              temp.warehouselocation = ship.warehouselocation;
              temp.actualLocation = ship.actualLocation;

              this.offloadedDisplay.push(temp);
            }
          }
        }
      }
    }
    for (const entry of this.offloadedDisplay) {
      this.offloadedPiecesTotal += entry.offloadPieces;
      this.offloadedWeightTotal += entry.offloadWeight;
    }
  }

  formatRequestData(req: any) {
    this.maniPiecesTotal = 0;
    this.maniWeightTotal = 0.0;
    this.offPiecesTotal = 0;
    this.offWeightTotal = 0.0;
    const segArray = req.segments;
    for (const seg of segArray) {
      const origin = seg.flightBoardPoint;
      const dest = seg.flightOffPoint;
      if (seg.uldList.length > 0) {
        for (const uld of seg.uldList) {
          const uldNum = uld.uldNumber;
          const reasonOff = uld.reason;
          if (uld.shipments && uld.shipments.length > 0) {
            for (const ship of uld.shipments) {
              const temp: SummaryModel = new SummaryModel();
              temp.uldNumber = uldNum;
              temp.awbNumber = ship.awbNumber;
              temp.origin = ship.origin;
              temp.destination = ship.destination;
              temp.terminal = uld.handlingArea;
              temp.manifestedPieces = ship.manifestedPieces;
              temp.manifestedWeight = ship.manifestedWeight;
              temp.natureOfGoods = ship.natureOfGoods;
              temp.tt = ship.transferType;
              temp.reason = reasonOff;
              temp.offloadLocation = ship.offloadLocations;
              temp.warehouselocation = ship.warehouselocations;
              temp.actualLocation = ship.actualLocations;

              let tempShc = '';
              if (ship.shc && ship.shc.length > 0) {
                for (const code of ship.shc) {
                  tempShc = tempShc + code.code + ' ';
                }
              }

              temp.shc = tempShc;
              temp.offloadPieces = ship.pieces;
              temp.offloadWeight = ship.weight;
              temp.expPreOffloadShipmentInfoId = ship.expPreOffloadShipmentInfoId
              temp.shipmentId = ship.shipmentId
              temp.expPreOffloadULDInfoId = uld.expPreOffloadULDInfoId;
              temp.heightCode = uld.heightCode;
              temp.dlsversion = uld.dlsversion;
              temp.actualWeight = uld.actualWeight;
              temp.select = uld.select = false;

              this.display.push(temp);
            }
          }
        }
      }
    }
    for (const entry of this.display) {
      this.maniPiecesTotal += entry.manifestedPieces;
      this.maniWeightTotal += entry.manifestedWeight;
      this.offPiecesTotal += entry.offloadPieces;
      this.offWeightTotal += entry.offloadWeight;
    }
  }

  onCancel() {
    let transferData: any = { flightKey: this.offloadForm.get('flightKey').value, flightOriginDate: this.offloadForm.get('flightOriginDate').value }
    this.navigateTo(this.router, '/export/buildup/offloaduld', transferData);
  }

  deletePreOffloadLineItem(expPreOffloadULDInfoId, expPreOffloadShipmentInfoId) {
    console.log("console====" + expPreOffloadULDInfoId);
    console.log("console====" + expPreOffloadShipmentInfoId);


    const offload: OffloadModel = new OffloadModel();
    offload.expPreOffloadULDInfoId = expPreOffloadULDInfoId
    offload.expPreOffloadShipmentInfoId = expPreOffloadShipmentInfoId

    this.buildUpService.deletePreOffloadData(offload).subscribe((data) => {

      if (data.success) {
        this.showSuccessStatus('export.pre.offload.data.deleted.successfully');
      }
      this.fetchFlightULD();
    });
  }

  public onOpenlocationdetailsWindow(expPreOffloadShipmentInfoId, shipmentId, expPreOffloadULDInfoId, index): void {
    let awbDetail = this.offloadForm.get(["awbList", index]).value;
    let awbDetails = [];
    awbDetails.push(awbDetail);
    if (!NgcUtility.isBlank(awbDetails)) {
      this.offloadDetailsForm.get('piecesList').patchValue(awbDetails);
    } else {
      let emptyList = [];
      this.offloadDetailsForm.get('piecesList').patchValue(emptyList);
    }
    const offload: OffloadShipment = new OffloadShipment();
    let offloadLocationsList = (<NgcFormArray>this.offloadDetailsForm.get("offloadLocationsList")).getRawValue();

    offload.offloadLocationsList = offloadLocationsList;
    offload.expPreOffloadShipmentInfoId = expPreOffloadShipmentInfoId
    offload.shipmentId = shipmentId
    offload.expPreOffloadULDInfoId = expPreOffloadULDInfoId

    this.buildUpService.getlocationinfo(offload).subscribe((data) => {
      this.refreshFormMessages(data);
      let response = data.data;
      if (response) {
        (<NgcFormArray>this.offloadDetailsForm.get("offloadLocationsList")).patchValue(response.offloadLocationsList);
      }
      this.locationdetailsWindow.open();
    });
  }

  onPiecesChange(event, i) {
    let obj: UnloadShipment = new UnloadShipment();

    const pieces = (<NgcFormArray>this.offloadDetailsForm
      .get(['piecesList', 0])).get('manifestedPieces').value;
    const weight = (<NgcFormArray>this.offloadDetailsForm
      .get(['piecesList', 0])).get('manifestedWeight').value;

    obj.loadedPieces = +pieces;
    obj.loadedWeight = +weight;
    obj.unloadPieces = +event;

    this.buildUpService.unloadWeight(obj).subscribe(data => {
      console.log(data);
      this.refreshFormMessages(data);
      const res = data.data;
      if (res) {
        (<NgcFormArray>this.offloadDetailsForm
          .get(['offloadLocationsList', i])).get('offloadWeight').patchValue(res.unloadWeight);
      }
    }, error => {
      this.showErrorStatus('export.error.occured.try.again');
    });
  }

  addoffloadlocation() {
    const locationFormArray: NgcFormArray =
      <NgcFormArray>this.offloadDetailsForm.get(['offloadLocationsList']);
    locationFormArray.addValue([
      {
        offloadPieces: '',
        offloadWeight: '',
        offloadLocation: '',
        warehouseLocation: '',
        actualLocation: '',
        expPreOffloadShipmentInfoId: '',
        shipmentId: '',
        expPreOffloadULDInfoId: '',
        shipmentNumber: '',
      }
    ], { onlySelf: true, emitEvent: false });
    this.flagCRUD = 'C';
  }

  onclose() {
    this.locationdetailsWindow.close();
  }

  ondeletelocation(index) {
    (<NgcFormArray>this.offloadDetailsForm.get('offloadLocationsList')).markAsDeletedAt(index);
    this.flagCRUD = 'D';
  }

  ondeletepreoffloadlocation(index) {
    (<NgcFormArray>this.offloadDetailsForm.get(['piecesList'])).deleteValueAt(index);
  }

  offloadmandatorydetails() {
    if (!this.offloadDetailsForm.get(['offloadPieces', 'offloadWeight', 'actualLocation']).value) {
      return true;
    }
  }

  validatesave() {
    if (this.offloadmandatorydetails()) {
      this.showErrorMessage('enter mandatory details');
    }
  }

  onLocationChange(data, index) {
    this.sectorId = data.parameter2;
  }

  onsaveandclose() {
    this.offloadDetailsForm.validate();
    if (this.offloadDetailsForm.controls.offloadLocationsList.invalid) {
      this.validatesave();
      return;
    } else {
      this.innerTemp = this.offloadDetailsForm.getRawValue();
      let offloadLocationsList = (<NgcFormArray>this.offloadDetailsForm.get("offloadLocationsList")).getRawValue();

      let warehouseFlag = false;
      let validFlag = false;
      let zeroPiecesFlag = false;
      let weight = (<NgcFormArray>this.offloadDetailsForm
        .get(['piecesList', 0])).get('manifestedWeight').value;
      let offWeightFlag = false;
      let offloadflag = false;

      if (offloadLocationsList.length == 0) {
        this.showErrorMessage('export.enter.offload.location');
      } else {
        for (const eachRow of offloadLocationsList) {
          if (eachRow.offloadLocation == "" || eachRow.offloadLocation == null) {
            offloadflag = true;
          }
          if (eachRow.warehouseLocation == "" || eachRow.warehouseLocation == null) {
            warehouseFlag = true;
          }
          if (eachRow.offloadWeight <= 0) {
            validFlag = true;
          }
          if (eachRow.offloadPieces <= 0) {
            zeroPiecesFlag = true;
          }
          if (eachRow.offloadWeight > weight) {
            offWeightFlag = true;
          }
        }
        if (offloadflag) {
          this.showErrorMessage("exp.entershipmentlocation.m");
          return;
        }
        if (warehouseFlag) {
          this.showErrorMessage("enter.unload.warehouselocation");
          return;
        }
        if (validFlag) {
          this.showErrorMessage("export.weight.cannot.lesser.than.equal.to.0");
          return;
        }
        if (zeroPiecesFlag) {
          this.showErrorMessage('export.pieces.cannot.lesser.than.equal.to.0');
          return;
        }
        if (offWeightFlag) {
          this.showErrorMessage('export.offload.weight.cannot.lesser.greater.part.total.pieces')
          return;
        }
        for (const entry of offloadLocationsList) {
          this.totaloffloadpieces += entry.offloadPieces;
          this.totaloffloadweight += entry.offloadWeight;
        }

        this.innerTemp.offloadLocationsList = offloadLocationsList;

        let piecesList = (<NgcFormArray>this.offloadDetailsForm.get("piecesList")).getRawValue();
        this.innerTemp.piecesList = piecesList;

        this.innerTemp.expPreOffloadShipmentInfoId = piecesList[0].expPreOffloadShipmentInfoId
        this.innerTemp.shipmentId = piecesList[0].shipmentId
        this.innerTemp.expPreOffloadULDInfoId = piecesList[0].expPreOffloadULDInfoId
        this.innerTemp.shipmentNumber = piecesList[0].awbNumber


        this.innerTemp.offloadLocationsList.forEach(a => {
          a.expPreOffloadShipmentInfoId = this.innerTemp.piecesList[0].expPreOffloadShipmentInfoId,
            a.totaloffloadpieces = this.totaloffloadpieces,
            a.totaloffloadweight = this.totaloffloadweight
        })
        if (this.innerTemp.offloadLocationsList) {
          this.buildUpService.savelocations(this.innerTemp).subscribe((data) => {
            this.resetFormMessages();
            if (data != null) {
              if (data.data.messageList.length == 0) {
                this.locationdetailsWindow.close();
                this.showSuccessStatus('g.completed.successfully');
                this.fetchFlightULD();
                this.offloadDetailsForm.reset();
              } else {
                this.showResponseErrorMessages(data);
              }
            }
          })
        }
      }

    }
  }

  onSelectingUld(index, value) {
    this.resp.segments[0].uldList[index].select = value;
  }
}
