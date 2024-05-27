import { Router, ActivatedRoute } from '@angular/router';
import { BuildupService } from './../buildup.service';
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcFormControl, NgcButtonComponent, NgcUtility, PageConfiguration, NgcWindowComponent, NgcReportComponent
} from 'ngc-framework';
// Angular imports
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { Flight, BookMultipleShipmentSearch, UnloadShipment } from './../../export.sharedmodel';
import { OffloadShipmentInventory, OffloadSegment, OffloadULD, OffloadShipment } from './../buildup.sharedmodel';
import { e } from '@angular/core/src/render3';
import { ApplicationFeatures } from '../../../common/applicationfeatures';

@Component({
  selector: 'ngc-offload-uld-awb',
  templateUrl: './offload-uld-awb.component.html',
  styleUrls: ['./offload-uld-awb.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: false,
  //autoBackNavigation: true,
  restorePageOnBack: true
})
export class OffloadUldAwbComponent extends NgcPage implements OnInit {
  offWeightFlag = false;
  offPiecesFlag = false;
  zeroWeightFlag = false;
  zeroPiecesFlag = false;
  displayFlag = false;
  showMessageFlag = false;
  locationFlag: Boolean = false;
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  @ViewChild('okButton') okButton: NgcButtonComponent;
  @ViewChild('cancelButton') cancelButton: NgcButtonComponent;
  @ViewChild('offloadButton') offloadButton: NgcButtonComponent;
  @ViewChild('applyButton') applyButton: NgcButtonComponent;
  @ViewChild('offloadWindow') offloadWindow: NgcWindowComponent;
  @ViewChild('onlyOffloadWindow') onlyOffloadWindow: NgcWindowComponent;
  @ViewChild('saveButton') saveButton: NgcButtonComponent;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  resp: any;
  selectedShipments: any[] = [];
  tempObj: any;
  innerTemp: OffloadShipmentInventory;
  reportParameters: any;
  uldListContainer: OffloadSegment;
  onlyOffloadContainer: OffloadULD;
  expandorcollapse = false;
  response: any;
  multipleShipmentSearch = new BookMultipleShipmentSearch();
  outgoingFlightData: any;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private buildUpService: BuildupService, private router: Router, private activeRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  private offloadForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flightOriginDate: new NgcFormControl(new Date()),
    flight1: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    status: new NgcFormControl(),
    flightType: new NgcFormControl(),
    sel: new NgcFormControl(),
    aircraftRegistration: new NgcFormControl(),
    segments: new NgcFormArray([]),
    totalAwb: new NgcFormControl(),
    totalUld: new NgcFormControl(),
    totalPcWt: new NgcFormControl(),
    preOffloadRemarks: new NgcFormArray([])
  });

  onClear(event): void {
    this.offloadForm.reset();
    this.resetFormMessages();
    this.offloadForm.get('flightOriginDate').setValue(new Date());
    this.displayFlag = false;
    /** Changes for JV01-1141 */
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Uld_OffloadUldAwb_OffloadRemarks)) {
      this.offloadForm.get(['preOffloadRemarks']).setValue([]);
    }
  }

  private offloadWindowForm: NgcFormGroup = new NgcFormGroup({
    commonLocation: new NgcFormControl(),
    commonReason: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    preOffload: new NgcFormArray([
    ])
  });

  private onlyOffloadWindowForm: NgcFormGroup = new NgcFormGroup({
    reasonField: new NgcFormControl()
  });

  ngOnInit() {
    this.outgoingFlightData = this.getNavigateData(this.activeRoute);
    if (this.outgoingFlightData !== null && this.outgoingFlightData.flightKey !== null) {
      this.offloadForm.patchValue(this.outgoingFlightData);
      this.fetchFlightULD();
    }
  }

  fetchFlightULD() {

    this.showMessageFlag = false;
    this.displayFlag = false;
    const flight: Flight = new Flight();
    flight.flightKey = this.offloadForm.get('flightKey').value;
    flight.flightOriginDate = this.offloadForm.get('flightOriginDate').value;
    this.buildUpService.getUldAwb(flight).subscribe((data) => {
      this.response = data;
      this.showResponseErrorMessages(this.response);
      if (!this.showResponseErrorMessages(this.response)) {
        this.resp = data.data;
        this.displayFlag = true;
        this.offloadForm.get('flight1').setValue(this.offloadForm.get('flightKey').value);
        const tempDateStr = ('' + this.offloadForm.get('flightOriginDate').value).substring(4, 15);
        const actualDate = (tempDateStr.substr(4, 2) + tempDateStr.substr(0, 3) + tempDateStr.substr(7, 4));
        this.offloadForm.get('flightDate').patchValue(NgcUtility.getDateAsString(this.offloadForm.get('flightOriginDate').value));
        this.offloadForm.patchValue(this.resp.flight);
        this.offloadForm.get('totalAwb').patchValue(this.resp.totalAwb);
        this.offloadForm.get('totalUld').patchValue(this.resp.totalUld);
        this.offloadForm.get('totalPcWt').patchValue(this.resp.totalPcWt);
        for (const entry of this.resp.segments) {
          for (const uld of entry.uldList) {
            uld.sel = false;
            for (const shipment of uld.shipments) {
              shipment.innerSel = false;
              shipment.shcs = '';
              for (const shcObj of shipment.shc) {
                shipment.shcs += shcObj.code + ' ';
              }
            }
          }
        }
        this.offloadForm.get('segments').patchValue(this.resp.segments);
        this.onChangeValueOfSel();
        this.expandorcollapse = true;
        /** Changes for JV01-1141 */
        if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Uld_OffloadUldAwb_OffloadRemarks)) {
          if (this.resp.preOffloadRemarks && this.resp.preOffloadRemarks.length == 0) {
            this.addOffloadReason();
          } else {
            this.offloadForm.get('preOffloadRemarks').patchValue(this.resp.preOffloadRemarks);
          }
        }
      }
    });
  }

  onOffload() {
    this.showMessageFlag = false;
    this.selectedShipments = [];
    const selectedSegments = (<NgcFormArray>(this.offloadForm.get('segments'))).getRawValue();
    for (const entry of selectedSegments) {
      for (const val of entry.uldList) {
        if (val.sel) {
          for (const innerVal of val.shipments) {
            for (let locationInfo of innerVal.preoffloadLocations) {
              this.tempObj = Object.assign({}, innerVal);
              // this.tempObj = innerVal;
              this.tempObj.partPieces = locationInfo.locationPieces;
              this.tempObj.partWeight = locationInfo.locationWeight;
              this.tempObj.pieces = innerVal.pieces
              this.tempObj.weight = innerVal.weight;
              this.tempObj.partSuffix = locationInfo.partSuffix;
              this.tempObj.dipSvcSTATS = locationInfo.dipSvcSTATS;
              this.tempObj.uldNumber = val.uldNumber;
              this.tempObj.heightCode = val.heightCode;
              this.tempObj.dlsVersion = val.dlsVersion;
              this.tempObj.actualWeight = val.actualWeight;
              this.tempObj.reason = '';
              this.tempObj.inventoryShc = locationInfo.inventoryShc;
              this.tempObj.flightSegmentId = entry.flightSegmentId;
              this.tempObj.preoffloadLocations = [];
              this.innerTemp = new OffloadShipmentInventory();
              this.innerTemp.offloadPieces = 0;
              this.innerTemp.offloadWeight = 0;
              this.innerTemp.offloadLocation = '';
              this.innerTemp.inventoryShc = locationInfo.inventoryShc;
              if (this.tempObj.uldNumber != 'BULK') {
                this.innerTemp.offloadLocation = val.uldNumber;
              }
              this.innerTemp.warehouseLocation = '';
              this.innerTemp.expPreOffloadShipmentInfoId = null;
              this.tempObj.assUldTrolleyId = val.assUldTrolleyId;
              this.tempObj.loadedShipmentInfoId = innerVal.loadedShipmentInfoId;
              this.tempObj.preoffloadLocations.push(this.innerTemp);
              console.log("temp", this.tempObj);
              this.selectedShipments.push(this.tempObj);
            }
          }
        }
        else {
          for (const innerVal of val.shipments) {
            if (innerVal.innerSel) {
              for (let locationInfo of innerVal.preoffloadLocations) {
                this.tempObj = Object.assign({}, innerVal);
                this.tempObj.partPieces = locationInfo.locationPieces;
                this.tempObj.partWeight = locationInfo.locationWeight;
                this.tempObj.pieces = innerVal.pieces
                this.tempObj.weight = innerVal.weight;
                this.tempObj.partSuffix = locationInfo.partSuffix;
                this.tempObj.dipSvcSTATS = locationInfo.dipSvcSTATS;
                this.tempObj.uldNumber = val.uldNumber;
                this.tempObj.heightCode = val.heightCode;
                this.tempObj.dlsVersion = val.dlsVersion;
                this.tempObj.actualWeight = val.actualWeight;
                this.tempObj.reason = '';
                this.tempObj.inventoryShc = locationInfo.inventoryShc;
                this.tempObj.flightSegmentId = entry.flightSegmentId;
                this.tempObj.preoffloadLocations = [];
                this.innerTemp = new OffloadShipmentInventory();
                this.innerTemp.inventoryShc = locationInfo.inventoryShc;
                this.innerTemp.offloadPieces = 0;
                this.innerTemp.offloadWeight = 0;
                this.innerTemp.offloadLocation = '';
                if (this.tempObj.uldNumber != 'BULK') {
                  this.innerTemp.offloadLocation = val.uldNumber;
                }
                this.innerTemp.warehouseLocation = '';
                this.innerTemp.expPreOffloadShipmentInfoId = null;
                this.tempObj.assUldTrolleyId = val.assUldTrolleyId;
                this.tempObj.loadedShipmentInfoId = innerVal.loadedShipmentInfoId;
                this.tempObj.preoffloadLocations.push(this.innerTemp);
                this.selectedShipments.push(this.tempObj);
              }
            }
          }
        }
      }
    }
    console.log(this.selectedShipments);
    this.offloadWindowForm.get('preOffload').patchValue(this.selectedShipments);
    this.offloadWindow.open();
  }

  onAddLocation(index: any) {
    const locationFormArray: NgcFormArray =
      <NgcFormArray>this.offloadWindowForm.get(['preOffload', index, 'preoffloadLocations']);
    locationFormArray.addValue([
      {
        offloadPieces: '',
        offloadWeight: '',
        offloadLocation: '',
        warehouseLocation: '',
        expPreOffloadShipmentInfoId: ''
      }
    ], { onlySelf: true, emitEvent: false });
  }

  onDeleteLocation(index, subIndex) {
    (<NgcFormArray>this.offloadWindowForm.get(['preOffload', index, 'preoffloadLocations'])).deleteValueAt(subIndex);
  }

  onCloseWindow(event: any) {
    this.offloadWindow.close();
  }

  savePreoffload() {
    if (this.offloadWindowForm.valid) {
      this.offPiecesFlag = false;
      this.offWeightFlag = false;
      this.zeroPiecesFlag = false;
      this.zeroWeightFlag = false;
      this.showMessageFlag = false;
      this.locationFlag = true;
      this.saveButton.disabled = false;
      this.uldListContainer = new OffloadSegment();
      this.uldListContainer.flight = new Flight();
      this.uldListContainer.flight.flightKey = this.offloadForm.get('flightKey').value;
      this.uldListContainer.flight.flightOriginDate = this.offloadForm.get('flightOriginDate').value;
      let preOffloadList = (<NgcFormArray>this.offloadWindowForm.get('preOffload')).getRawValue();
      let preoffloadUld = preOffloadList;
      let uniqueUldList: UniqueUld[] = [];
      class UniqueUld {
        uldNumber: string;
        flightSegmentId: number;
        actualWeight: any;
        dlsVersion: any;
        heightCode: string;
      }
      var groupingUld = [];
      // Grouping the ULD's based on flight Segment IDlight Segment ID
      var result = preoffloadUld.reduce((hash, obj) => {
        let key = obj.uldNumber + '|' + obj.flightSegmentId;
        if (hash[key])
          hash[key].uldNumber.push(obj.uldNumber);
        else {
          hash[key] = obj;
          hash[key].uldNumber = [obj.uldNumber];
        }
        return hash;
      }, []);
      groupingUld = result;

      for (var key in groupingUld) {
        let tempUniqueUld: UniqueUld = new UniqueUld();
        var value = groupingUld[key];
        tempUniqueUld.uldNumber = value.uldNumber[0];
        tempUniqueUld.flightSegmentId = value.flightSegmentId;
        // added ULD details
        tempUniqueUld.actualWeight = value.actualWeight;
        tempUniqueUld.dlsVersion = value.dlsVersion;
        tempUniqueUld.heightCode = value.heightCode;
        uniqueUldList.push(tempUniqueUld);

      }
      let offloadUldList: OffloadULD[] = [];
      for (const entry of uniqueUldList) {
        let tempUld: OffloadULD = new OffloadULD();
        tempUld.uldNumber = entry.uldNumber;
        tempUld.flightSegmentId = entry.flightSegmentId;
        //added ULD details
        tempUld.actualWeight = entry.actualWeight;
        tempUld.heightCode = entry.heightCode;
        tempUld.dlsVersion = entry.dlsVersion;

        offloadUldList.push(tempUld);
      }
      preOffloadList = (<NgcFormArray>this.offloadWindowForm.get('preOffload')).getRawValue();
      for (const entry of offloadUldList) {
        for (const val of preOffloadList) {
          if (entry.uldNumber === val.uldNumber.toString()) {
            entry.heightCode = val.heightCode;
            entry.dlsVersion = val.dlsVersion;
            entry.actualWeight = val.actualWeight;
            if (val.reason === '' || val.reason === undefined || val.reason === null) {
              this.showErrorMessage('export.provide.reason.for.offload');
              return;
            }
            else {
              entry.reason = val.reason;
            }
          }
        }
        entry.shipments = [];
      }
      for (const entry of offloadUldList) {
        for (const val of preOffloadList) {

          if (entry.uldNumber === val.uldNumber.toString() && entry.flightSegmentId === val.flightSegmentId) {
            let weightCheck = 0.0;
            let piecesCheck = 0;
            let tempVal = new OffloadShipment();
            tempVal.reason = val.reason;
            tempVal.shipmentId = val.shipmentId;
            tempVal.pieces = val.partPieces;
            tempVal.weight = val.partWeight;
            //audit trial purpose
            tempVal.shipmentNumber = val.awbNumber;
            // tempVal.pieces = val.pieces;
            // tempVal.weight = val.weight;
            tempVal.shc = val.shc;
            tempVal.preoffloadLocations = new Array<OffloadShipmentInventory>();
            if (val.preoffloadLocations !== null) {
              let localWeight = 0.0;
              let localPieces = 0;
              for (let loc of val.preoffloadLocations) {
                let tempLoc = new OffloadShipmentInventory();
                weightCheck += loc.offloadWeight;
                piecesCheck += loc.offloadPieces;
                localWeight += loc.offloadWeight;
                localPieces += loc.offloadPieces;
                this.setZeroFlag(loc);
                tempLoc.inventoryShc = val.inventoryShc;
                tempLoc.partSuffix = val.partSuffix;
                tempLoc.dipSvcSTATS = val.dipSvcSTATS;
                tempLoc.offloadLocation = loc.offloadLocation;
                tempLoc.offloadPieces = loc.offloadPieces;
                tempLoc.offloadWeight = loc.offloadWeight;
                tempLoc.warehouseLocation = loc.warehouseLocation;
                tempLoc.expPreOffloadShipmentInfoId = null;
                //for audit trial
                tempLoc.shipmentNumber = tempVal.shipmentNumber;

                tempVal.preoffloadLocations.push(tempLoc);
                if (loc.offloadLocation == '' && loc.warehouseLocation == '') {
                  this.showWarningStatus('export.enter.valid.offload.location.warehouse.location');
                  this.locationFlag = false;
                }
                if (loc.offloadLocation == 'BULK') {
                  this.showWarningStatus('export.enter.valid.offload.location');
                  this.locationFlag = false;
                }
              }
              tempVal.weight = localWeight;
              tempVal.pieces = localPieces;
            }
            if (weightCheck > val.partWeight) {
              this.offWeightFlag = true;
            }
            if (piecesCheck === val.partPieces && weightCheck < val.partWeight) {
              this.offWeightFlag = true;
            }
            if (piecesCheck > val.partPieces) {
              this.offPiecesFlag = true;
            }
            entry.shipments.push(tempVal);
          }
        }
      }
      this.uldListContainer.uldList = offloadUldList;
      if (this.zeroWeightFlag === false) {
        if (this.zeroPiecesFlag === false) {
          if (this.offWeightFlag === false) {
            if (this.offPiecesFlag === false) {
              console.log("request", this.uldListContainer);
              if (this.locationFlag === true) {
                this.buildUpService.saveUldAwb(this.uldListContainer).subscribe((data) => {
                  this.saveButton.disabled = false;
                  if (data.success) {
                    this.fetchFlightULD();
                    this.showSuccessStatus('g.completed.successfully');
                    this.onCloseWindow(event);
                  }
                  else {
                    this.showResponseErrorMessages(data);
                  }
                });
              }
            } else {
              this.showWarningStatus('export.offload.pieces.greater.tahn.part.total.pieces');
              this.saveButton.disabled = false;
            }
          } else {
            this.showWarningStatus('export.offload.weight.cannot.lesser.greater.part.total.pieces');
            this.saveButton.disabled = false;
          }
        } else {
          this.showWarningStatus('export.pieces.cannot.lesser.than.equal.to.0');
          this.saveButton.disabled = false;
        }
      } else {
        this.showWarningStatus('export.weight.cannot.lesser.than.equal.to.0');
        this.saveButton.disabled = false;
      }
    }
  }

  onOffloadOnly(index: any, subIndex: any) {
    this.onlyOffloadContainer = new OffloadULD();
    this.onlyOffloadContainer.shipments = new Array<OffloadShipment>();
    const child =
      (<NgcFormGroup>this.offloadForm.get(['segments', index, 'uldList', subIndex])).getRawValue();
    this.onlyOffloadContainer.flightSegmentId = child.flightSegmentId;
    this.onlyOffloadContainer.flightKey = this.offloadForm.get('flightKey').value;
    this.onlyOffloadContainer.flightOriginDate = this.offloadForm.get('flightOriginDate').value;
    this.onlyOffloadContainer.uldNumber = child.uldNumber;
    this.onlyOffloadContainer.assUldTrolleyId = child.assUldTrolleyId;
    this.onlyOffloadContainer.trolleyInd = child.trolleyInd;
    for (const ship of child.shipments) {
      const temp: OffloadShipment = new OffloadShipment();
      temp.awbNumber = ship.awbNumber;
      temp.destination = ship.destination;
      temp.loadedShipmentInfoId = ship.loadedShipmentInfoId;
      temp.natureOfGoods = ship.natureOfGoods;
      temp.origin = ship.origin;
      temp.pieces = ship.pieces;
      temp.shipmentId = ship.shipmentId;
      temp.weight = ship.weight;
      if (ship.preoffloadLocations && ship.preoffloadLocations.length > 0) {
        for (let inv of ship.preoffloadLocations) {
          inv.offloadLocation = 'BULK';
          inv.offloadPieces = inv.locationPieces,
            inv.offloadWeight = inv.locationWeight;
        }
        temp.preoffloadLocations = ship.preoffloadLocations;
      } else {
        temp.preoffloadLocations = new Array<OffloadShipmentInventory>();
        const tempLoc: OffloadShipmentInventory = new OffloadShipmentInventory();
        tempLoc.offloadPieces = ship.pieces;
        tempLoc.offloadWeight = ship.weight;
        tempLoc.offloadLocation = 'BULK';
        //audit trial
        tempLoc.shipmentNumber = temp.awbNumber.toString();

        temp.preoffloadLocations.push(tempLoc);
      }

      this.onlyOffloadContainer.shipments.push(temp);
    }
    console.log(this.onlyOffloadContainer);
    this.showConfirmMessage('export.offload.uld.confirmation').then(fulfilled => {
      this.onlyOffloadWindow.open();
    }
    ).catch(reason => {
    });

  }

  onCloseOnlyWindow(event: any) {
    this.onlyOffloadWindow.close();
  }

  offloadOnly() {
    if (this.onlyOffloadWindowForm.valid) {
      this.onlyOffloadContainer.reason = this.onlyOffloadWindowForm.get('reasonField').value;
      this.onlyOffloadContainer.flightId = this.resp.flight.flightId;
      console.log(this.onlyOffloadContainer);
      this.buildUpService.onlyOffload(this.onlyOffloadContainer).subscribe((data) => {
        console.log(data);
        this.onlyOffloadWindow.close();
        this.fetchFlightULD();
      });
    } else {
      this.showWarningStatus('export.reason.mandatory');
    }
  }

  onApply() {
    //const loc = this.offloadWindowForm.get('commonLocation').value;
    const reason = this.offloadWindowForm.get('commonReason').value;
    const awbDetails = (<NgcFormArray>this.offloadWindowForm.get('preOffload')).getRawValue();
    for (let entry of awbDetails) {
      entry.reason = reason;
      // for (let inner of entry.preoffloadLocations) {
      //   inner.offloadLocation = loc;
      // }
    }
    this.offloadWindowForm.get('preOffload').patchValue(awbDetails);
  }

  onChangeValueOfSel() {
    const len = (<NgcFormArray>this.offloadForm.get('segments')).length;
    for (let i = 0; i < len; ++i) {
      let j = i;
      const innerLen = (<NgcFormArray>this.offloadForm.get(['segments', i, 'uldList'])).length;
      for (let k = 0; k < innerLen; ++k) {
        NgcUtility.trackCheckUnCheckAll((<NgcFormControl>this.offloadForm.get(['segments', i, 'uldList', k, 'sel'])),
          (<NgcFormArray>this.offloadForm.get(['segments', i, 'uldList', k, 'shipments'])), 'innerSel');
      }
    }
  }

  setZeroFlag(ele: any) {
    if (ele.offloadWeight <= 0) {
      this.zeroWeightFlag = true;
    }
    if (ele.offloadPieces <= 0) {
      this.zeroPiecesFlag = true;
    }
  }

  navigateToOffLoad() {
    this.multipleShipmentSearch.flightKey = this.offloadForm.get('flightKey').value;
    this.multipleShipmentSearch.flightDate = this.offloadForm.get('flightOriginDate').value;
    this.navigate('export/buildup/offloadsummary', this.multipleShipmentSearch);
  }

  onPiecesChange(event, i, j) {
    let obj: UnloadShipment = new UnloadShipment();

    const pieces = (<NgcFormArray>this.offloadWindowForm
      .get(['preOffload', i])).get('pieces').value;
    const weight = (<NgcFormArray>this.offloadWindowForm
      .get(['preOffload', i])).get('weight').value;

    obj.loadedPieces = +pieces;
    obj.loadedWeight = +weight;
    obj.unloadPieces = +event;

    this.buildUpService.unloadWeight(obj).subscribe(data => {
      console.log(data);
      this.refreshFormMessages(data);
      const res = data.data;
      if (res) {
        (<NgcFormArray>this.offloadWindowForm
          .get(['preOffload', i, 'preoffloadLocations', j])).get('offloadWeight').patchValue(res.unloadWeight);
      }
    }, error => {
      this.showErrorStatus('export.error.occured.try.again');
    });
  }

  onoffloadServiceReport() {
    this.reportParameters = new Object();
    this.reportParameters.flightkey = this.offloadForm.get('flightKey').value;
    this.reportParameters.tenantID = NgcUtility.getTenantConfiguration().airportCode;
    this.reportParameters.flightdate = this.offloadForm.get('flightOriginDate').value;
    this.reportParameters.loggedinuser = this.getUserProfile().userShortName;
    this.reportWindow.open();
  }

  onCancel() {
    this.navigateBack(this.outgoingFlightData);
  }

  onLocationChange(event, i, j) {
    let location = event;
    (<NgcFormArray>this.offloadWindowForm
      .get(['preOffload', i, 'preoffloadLocations', j])).get('offloadLocation').patchValue(location == null ? '' : location);
  }


  onDeletePreoffload(index) {
    (<NgcFormArray>this.offloadWindowForm.get(['preOffload'])).deleteValueAt(index);
  }

  addOffloadReason() {
    (<NgcFormArray>this.offloadForm.get(["preOffloadRemarks"])).addValue([
      {
        remarks: null,
        flightId: null
      }
    ]);
  }

  onDelete(index) {
    (this.offloadForm.get(['preOffloadRemarks', index]) as NgcFormGroup).markAsDeleted();
  }

  saveOffloadRemarks() {
    const request = {
      flightId: this.offloadForm.getRawValue().flightId,
      preOffloadRemarks: this.offloadForm.getRawValue().preOffloadRemarks
    }
    this.buildUpService.saveOffloadRemarks(request).subscribe((data) => {
      if (data) {
        this.showSuccessStatus('Saved Successfully');
        this.fetchFlightULD();
      }
    });
  }
}
