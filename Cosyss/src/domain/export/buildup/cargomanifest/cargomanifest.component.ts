import { element } from 'protractor';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';
import {
  NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcButtonComponent,
  PageConfiguration, NgcUtility, NgcReportComponent, NgcWindowComponent
} from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { BuildupService } from './../buildup.service';
import { ManifestFlight, Flight, SeparateManifest, ManifestSegment, ManifestRemarks} from '../../export.sharedmodel';
import { ApplicationFeatures } from '../../../common/applicationfeatures';
import { ApplicationEntities } from '../../../common/applicationentities';

@Component({
  selector: 'app-cargomanifest',
  templateUrl: './cargomanifest.component.html',
  styleUrls: ['./cargomanifest.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  //autoBackNavigation: true
})
export class CargomanifestComponent extends NgcPage implements OnInit {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  @ViewChild('reportWindow3') reportWindow3: NgcReportComponent;
  @ViewChild('reportWindow4') reportWindow4: NgcReportComponent;
  @ViewChild('reportWindow5') reportWindow5: NgcReportComponent;
  @ViewChild('searchbutton') searchbutton: NgcButtonComponent;
  @ViewChild('separatebutton') separatebutton: NgcButtonComponent;
  @ViewChild('deleteseparatebutton') deleteseparatebutton: NgcButtonComponent;
  @ViewChild('supplementarybutton') supplementarybutton: NgcButtonComponent;
  @ViewChild('recreatebutton') recreatebutton: NgcButtonComponent;

  /*view child is the pop up add window for adding Remark*/
  @ViewChild('addRMKWindow')
  /*addWindow is the component for pop up window*/
  private addRMKWindow: NgcWindowComponent;

  /*
  * search Form
  */
  private windowForm = new NgcFormGroup({
    remark: new NgcFormControl(),
    segmentList: new NgcFormArray([])
  });

  /* 
  Manipulated list to store the data for maniest remarks 
  */
  manifestRemarks: any[];
  data: any;
  main: any[];
  mainList: any[];
  separateList: any[];
  separateShipmentId: any[];
  supplementaryList: any[];
  courierList: any[];
  reportParameters: any;
  private groupSelectState: any;
  //group select flag for separate list 
  private groupSelectSeparateState: any;
  //group select flag for supplymentary list 
  private groupSelectSupplState: any = {};
  //group select flag for supplymentary list 
  private groupSelectCourierState: any = {};
  checkEventData: NgcFormArray = new NgcFormArray([]);
  nilCargo: boolean;
  outgoingFlightData: any;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private buildupService: BuildupService
    , private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  private cargomanifestForm: NgcFormGroup = null;


  onSearch() {
    this.manifestRemarks = [];
    this.groupSelectState = {};
    this.groupSelectSeparateState = {};
    this.groupSelectCourierState = {};
    this.groupSelectSupplState = {};
    const flightRequest: Flight = new Flight();
    flightRequest.flightKey = this.cargomanifestForm.get('flightKey').value;
    flightRequest.flightOriginDate = this.cargomanifestForm.get('flightOriginDate').value;
    if (flightRequest.flightKey == null || flightRequest.flightOriginDate == null) {
      this.showErrorStatus("export.enter.flight.details");
      return;
    }
    this.searchbutton.disabled = true;
    this.nilCargo = false;
    this.buildupService.getManifest(flightRequest).subscribe(data => {
      this.refreshFormMessages(data);
      if (!data.messageList) {
        this.data = data.data;
        if (this.data.nilCargo) {
          this.nilCargo = true;
        }
        this.bindData(this.data.segment);
      }
      this.searchbutton.disabled = false;
    }, error => {
      this.searchbutton.disabled = false;
    });

  }
  bindData(segments: Array<any>) {
    this.mainList = [];
    this.separateList = [];
    this.supplementaryList = [];
    this.courierList = [];
    for (const segment of segments) {
      let newSegment = {};
      newSegment = segment;
      newSegment['awb'] = [];
      newSegment['courier'] = [];
      for (let uld of segment.ulds) {
        uld.shipment.forEach(element => {
          element['select'] = false;
          element['segmentId'] = segment['segmentId'];
          if (segment['weight'] % 1 == 0)
            element['manifestedWeight'] = segment['weight'] + '.0';
          else
            element['manifestedWeight'] = segment['weight'];
          element['manifestedPieces'] = segment['pieces'];
          if (!element.uldNumber) {
            element.uldNumber = ' ';
          }
          element.uldRemark = uld.remarks;
        });
        uld.courier.forEach(element => {
          element['select'] = false;
          if (segment['weight'] % 1 == 0)
            element['manifestedWeight'] = segment['weight'] + '.0';
          else
            element['manifestedWeight'] = segment['weight'];
          element['manifestedPieces'] = segment['pieces'];
          element.uldRemark = uld.remarks;
        });
        newSegment['awb'] = newSegment['awb'].concat(uld.shipment);
        if (uld.courier) {
          newSegment['courier'] = newSegment['courier'].concat(uld.courier);
        }
      }
      switch (segment.type) {
        case 'Main': {
          this.mainList = this.mainList.concat(newSegment['awb']);
          break;
        }
        case 'Separate': {
          this.separateList.push(newSegment);
          break;
        }
        case 'Supplementary': {
          this.supplementaryList.push(newSegment);
          break;
        }
        case 'Courier': {
          this.courierList = this.courierList.concat(newSegment['awb']);
          break;
        }
        default: {
          this.mainList = this.mainList.concat(newSegment['awb']);
          break;
        }
      }
    }
    // if ((!this.mainList || this.mainList.length === 0) &&
    //   (!this.separateList || this.separateList.length === 0) &&
    //   (!this.supplementaryList || this.supplementaryList.length === 0)) {
    for (const segment of segments) {
      if (segment.type === 'Main' && segment.nilCargo) {
        this.mainList.push({
          'shipmentNumber': 'NIL',
          'uldNumber': '',
          'segment': NgcUtility.getTenantConfiguration().airportCode+ ' - ' + segment.segment
        })
      }

      //
    }
    this.cargomanifestForm.get('supplementaryList').patchValue(this.supplementaryList);
    this.cargomanifestForm.get('courierList').patchValue(this.courierList);
    console.log(this.courierList);
    this.cargomanifestForm.get('mainManifestList').patchValue(this.mainList);
    this.cargomanifestForm.get('separateList').patchValue(this.separateList);
    this.cargomanifestForm.get('flight').patchValue(this.data.flight);
  }

  protected mainGroupsRenderer = (value: string | number, rowData: any, level: any): string => {
    let pieces = 0;
    let weight = 0;
    let trolleyInd;
    if (level === 1) {
      let remark = rowData.data.uldRemark ? rowData.data.uldRemark: '';
      const checkBoxState: boolean = this.groupSelectState[rowData.data.uldNumber + ':' + rowData.data.segment] ? true : false;
      const check = NgcUtility.createCheckBox(rowData.data.uldNumber + ':' + rowData.data.segment, checkBoxState);
      for (let row of rowData.records) {
        pieces += row.loadedPieces;
        weight += row.loadedWeight;
        trolleyInd = row.trolleyInd;
      }
      if (rowData.data.uldNumber == '') {
        return '';
      }
      if (trolleyInd !== "false" && trolleyInd !== false) {
        if (weight % 1 == 0)
          return check + value + ' - B - ' + pieces + ' - ' + weight + '.0' + 'K '+ remark
        else
          return check + value + ' - B - ' + pieces + ' - ' + NgcUtility.getDisplayWeight(weight) + 'K '+ remark
      }
      if (weight % 1 == 0)
        return check + value + ' ' + pieces + ' - ' + weight + '.0' + 'K '+ remark
        else
        return check + value + ' ' + pieces + ' - ' + NgcUtility.getDisplayWeight(weight) + 'K '+ remark
    }
    else
      for (let row of rowData.records) {
        for (let subrow of row.records) {
          pieces = subrow.manifestedPieces;
          weight = subrow.manifestedWeight;
        }
        pieces = (pieces == null || pieces == undefined) ? 0 : pieces;
        return `<label style=''>${rowData.data.segment}</label> &nbsp&nbsp&nbsp
        <label style=''>Manifested Pieces</label>  -  ${pieces} &nbsp&nbsp
        <label style=''>Manifested Weight</label>  -  ${(weight == null || weight == undefined) ? '0.0' : NgcUtility.getDisplayWeight(weight)}K &nbsp&nbsp
        `;
      }
  }
  
  protected courierGroupsRenderer = (value: string | number, rowData: any, level: any): string => {
    let pieces = 0;
    let weight = 0;
    let trolleyInd;
    if (level === 1) {
      let remark = rowData.data.uldRemark ? rowData.data.uldRemark: '';
      const checkBoxState: boolean = this.groupSelectCourierState[rowData.data.uldNumber + ':' + rowData.data.segment] ? true : false;
      const check = NgcUtility.createCheckBox(rowData.data.uldNumber + ':' + rowData.data.segment, checkBoxState);
      for (let row of rowData.records) {
        pieces += row.loadedPieces;
        weight += row.loadedWeight;
        trolleyInd = row.trolleyInd;
      }
      if (rowData.data.uldNumber == '') {
        return '';
      }
      if (trolleyInd !== "false" && trolleyInd !== false) {
        if (weight % 1 == 0)
          return check + value + ' - B - ' + pieces + ' - ' + weight + '.0' + 'K '+ remark
        else
          return check + value + ' - B - ' + pieces + ' - ' + NgcUtility.getDisplayWeight(weight) + 'K '+ remark
      }
      if (weight % 1 == 0)
        return check + value + ' ' + pieces + ' - ' + weight + '.0' + 'K '+ remark
        else
        return check + value + ' ' + pieces + ' - ' + NgcUtility.getDisplayWeight(weight) + 'K '+ remark
    }
    else
      for (let row of rowData.records) {
        for (let subrow of row.records) {
          pieces = subrow.manifestedPieces;
          weight = subrow.manifestedWeight;
        }
        pieces = (pieces == null || pieces == undefined) ? 0 : pieces;
        return `<label style=''>${rowData.data.segment}</label> &nbsp&nbsp&nbsp
        <label style=''>Manifested Pieces</label>  -  ${pieces} &nbsp&nbsp
        <label style=''>Manifested Weight</label>  -  ${(weight == null || weight == undefined) ? '0.0' : NgcUtility.getDisplayWeight(weight)}K &nbsp&nbsp
        `;
      }
  }

  onSelectMainCheckBox(event) {
     if(NgcUtility.isBlank(this.manifestRemarks)){
      this.manifestRemarks = [];
     }
    if (event && event.record) {
      let mainManifestList = this.cargomanifestForm.get('mainManifestList').value;
      let index = 0;
      for (let item of mainManifestList) {
        if (item.uldNumber == event.record.uldNumber && item.shipmentNumber == event.record.shipmentNumber) {
          (<NgcFormGroup>this.cargomanifestForm.get(['mainManifestList', index])).get('select').setValue(event.record.select);
          // removal and addition of object for manifest remarks
          if(event.record.select) {
            item.remarksType = 'shipment';
            this.manifestRemarks.push(item);
          } else {
            this.manifestRemarks = this.manifestRemarks.filter((obj, index) => {
              return (obj.manifestShipmentInfoId != item.manifestShipmentInfoId)
              || obj.remarksType != 'shipment';
            });
          }
        }
        index++;
      }
    }
  }

  onSelectCourierCheckBox(event) {
    if(NgcUtility.isBlank(this.manifestRemarks)){
      this.manifestRemarks = [];
    }
    if (event && event.record) {
      let courierManifestList = this.cargomanifestForm.get('courierList').value;
      let index = 0;
      for (let item of courierManifestList) {
        if (item.uldNumber == event.record.uldNumber && item.shipmentNumber == event.record.shipmentNumber) {
          (<NgcFormGroup>this.cargomanifestForm.get(['courierList', index])).get('select').setValue(event.record.select);
          // removal and addition of object for manifest remarks
          if(event.record.select) {
            item.remarksType = 'shipment';
            this.manifestRemarks.push(item);
          } else {
            this.manifestRemarks = this.manifestRemarks.filter((obj, index) => {
              return (obj.manifestShipmentInfoId != item.manifestShipmentInfoId)
              || obj.remarksType != 'shipment';
            });
          }
        }
        index++;
      }
    }
  }

  onSelectSeprateCheckBox(event, index) {
    if(NgcUtility.isBlank(this.manifestRemarks)){
      this.manifestRemarks = [];
    }
    if (event && event.record) {
      let seprateManifestList = this.cargomanifestForm.get('separateList').value;
      let i = 0;
      for (let item of seprateManifestList) {
        if (i == index) {
          if (item.awb) {
            let subIndex = 0;
            for (let subItem of item.awb) {
              if (subItem.uldNumber == event.record.uldNumber && subItem.shipmentNumber == event.record.shipmentNumber) {
                (this.cargomanifestForm.get(["separateList", index, "awb", subIndex, 'select']) as NgcFormControl).setValue(event.record.select);
                // removal and addition of object for manifest remarks
                if(event.record.select) {
                  subItem.remarksType = 'shipment';
                  this.manifestRemarks.push(subItem);
                } else {
                  this.manifestRemarks = this.manifestRemarks.filter((obj, index) => {
                    return (obj.manifestShipmentInfoId != subItem.manifestShipmentInfoId)
                    || obj.remarksType != 'shipment';
                  });
                }
              }
              subIndex++;
            }
          }
        }
        i++;
      }
    }
  }

  onSelectSupplementaryCheckBox(event, index) {
    if(NgcUtility.isBlank(this.manifestRemarks)){
      this.manifestRemarks = [];
    }
    if (event && event.record) {
      let supplementaryList = this.cargomanifestForm.get('supplementaryList').value;
      let i = 0;
      for (let item of supplementaryList) {
        if (i == index) {
          if (item.awb) {
            let subIndex = 0;
            for (let subItem of item.awb) {
              if (subItem.uldNumber == event.record.uldNumber && subItem.shipmentNumber == event.record.shipmentNumber) {
                (this.cargomanifestForm.get(["supplementaryList", index, "awb", subIndex, 'select']) as NgcFormControl).setValue(event.record.select);
                // removal and addition of object for manifest remarks
                if(event.record.select) {
                  subItem.remarksType = 'shipment';
                  this.manifestRemarks.push(subItem);
                } else {
                  this.manifestRemarks = this.manifestRemarks.filter((obj, index) => {
                    return (obj.manifestShipmentInfoId != subItem.manifestShipmentInfoId)
                    || obj.remarksType != 'shipment';
                  });
                }
              }
              subIndex++;
            }
          }
        }
        i++;
      }
    }
  }

  onClickHandler(event) {
    if(NgcUtility.isBlank(this.manifestRemarks)){
      this.manifestRemarks = [];
    }
    const temp = event.key.split(':');
    let pushDataForRemarks :any={};
    this.cargomanifestForm.getRawValue().mainManifestList.forEach((shipment, shipmentIndex: number) => {
      if (shipment['uldNumber'] === temp[0] && shipment['segment'] === temp[1]) {
        console.log(temp, shipment);
        this.cargomanifestForm.get(['mainManifestList', shipmentIndex, 'select']).setValue(event.checked);
        // removal and addition of object for manifest remarks
        if(event.checked) {
          pushDataForRemarks = Object.assign({}, shipment);  
          shipment.remarksType = 'shipment';
          this.manifestRemarks.push(shipment);
        } else {
          this.manifestRemarks = this.manifestRemarks.filter((obj, index) => {
            return (obj.manifestShipmentInfoId != shipment.manifestShipmentInfoId);
          });
        }
      }
    });
    this.groupSelectState[event.key] = event.checked;
    // removal and addition of object for manifest remarks
    if(event.checked) {
      pushDataForRemarks.remarksType = 'uld';
      this.manifestRemarks = this.manifestRemarks.concat(pushDataForRemarks);
    }
  }

  onClickCourierHandler(event) {
    if(NgcUtility.isBlank(this.manifestRemarks)){
      this.manifestRemarks = [];
    }
    const temp = event.key.split(':');
    let pushDataForRemarks :any={};
    this.cargomanifestForm.getRawValue().courierList.forEach((shipment, shipmentIndex: number) => {
      if (shipment['uldNumber'] === temp[0] && shipment['segment'] === temp[1]) {
        this.cargomanifestForm.get(['courierList', shipmentIndex, 'select']).setValue(event.checked);
        // removal and addition of object for manifest remarks
        if(event.checked) {
          pushDataForRemarks = Object.assign({}, shipment);  
          shipment.remarksType = 'shipment';
          this.manifestRemarks.push(shipment);
        } else {
          this.manifestRemarks = this.manifestRemarks.filter((obj, index) => {
            return (obj.manifestShipmentInfoId != shipment.manifestShipmentInfoId);
          });
        }
      }
    });
    this.groupSelectCourierState[event.key] = event.checked;
    // removal and addition of object for manifest remarks
    if(event.checked) {
      pushDataForRemarks.remarksType = 'uld';
      this.manifestRemarks = this.manifestRemarks.concat(pushDataForRemarks);
    }
  }

  onClickHandlerSeparate(event) {
    if(NgcUtility.isBlank(this.manifestRemarks) || this.cargomanifestForm.getRawValue().mainManifestList.length == 0){
      this.manifestRemarks = [];
    }
    const temp = event.key.split(':');
    let pushDataForRemarks :any;
    let seprateManifestList = this.cargomanifestForm.get('separateList').value;
    let i = 0;
    for (let item of seprateManifestList) {
        if (item.awb) {
          let subIndex = 0;
          for (let subItem of item.awb) {
            if (subItem.uldNumber === temp[0] && subItem.segment === temp[1]) {
              (this.cargomanifestForm.get(["separateList", i, "awb", subIndex, 'select']) as NgcFormControl).setValue(event.checked);
              // removal and addition of object for manifest remarks
              if(event.checked) {
                pushDataForRemarks = Object.assign({}, subItem);
                subItem.remarksType = 'shipment';
                this.manifestRemarks.push(subItem);
              } else {
                this.manifestRemarks = this.manifestRemarks.filter((obj, index) => {
                  return (obj.manifestShipmentInfoId != subItem.manifestShipmentInfoId);
                });
              }
            }
            subIndex++;
          }
        }
      i++;
    }
    
    this.groupSelectSeparateState[event.key] = event.checked;
    // removal and addition of object for manifest remarks
    if(event.checked) {
      pushDataForRemarks.remarksType = 'uld';
      this.manifestRemarks = this.manifestRemarks.concat(pushDataForRemarks);
    }
  }
  
  onClickHandlerSupplementary(event) {
    if(NgcUtility.isBlank(this.manifestRemarks)){
      this.manifestRemarks = [];
    }
    const temp = event.key.split(':');
    let pushDataForRemarks :any;
    let supplementaryList = this.cargomanifestForm.get('supplementaryList').value;
    let i = 0;
    for (let item of supplementaryList) {
        if (item.awb) {
          let subIndex = 0;
          for (let subItem of item.awb) {
            if (subItem.uldNumber === temp[0] && subItem.segment === temp[1]) {
              (this.cargomanifestForm.get(["supplementaryList", i, "awb", subIndex, 'select']) as NgcFormControl).setValue(event.checked);
              // removal and addition of object for manifest remarks
              if(event.checked) {
                pushDataForRemarks = Object.assign({}, subItem);
                subItem.remarksType = 'shipment';
                this.manifestRemarks.push(subItem);
              } else {
                this.manifestRemarks = this.manifestRemarks.filter((obj, index) => {
                  return (obj.manifestShipmentInfoId != subItem.manifestShipmentInfoId);
                });
              }
            }
            subIndex++;
          }
        }
      i++;
    }
    
    this.groupSelectSupplState[event.key] = event.checked;
    // removal and addition of object for manifest remarks
    if(event.checked) {
      pushDataForRemarks.remarksType = 'uld';
      this.manifestRemarks = this.manifestRemarks.concat(pushDataForRemarks);
    }
  }

  onSeparate(type) {
    this.separateShipmentId = [];
    let formValue = this.cargomanifestForm.getRawValue();
    let awb: any;
    if (type === 'main') {
      awb = formValue['mainManifestList'].filter(function (item) {
        return item.select;
      });
    }
    if (type === 'courier') {
      awb = formValue['courierList'].filter(function (item) {
        return item.select;
      });
    }

    awb.forEach(element => {
      this.separateShipmentId.push(element.manifestShipmentInfoId);
    });

    for (let segment of formValue['separateList']) {
      this.addSeparateId(segment);
    }
    for (let segment of formValue['supplementaryList']) {
      this.addSeparateId(segment);
    }
    if (this.separateShipmentId.length) {
      const separateRequest = new SeparateManifest();
      const flight = new Flight();
      flight.flightKey = formValue['flightKey'];
      flight.flightOriginDate = formValue['flightOriginDate'];
      separateRequest.flight = flight;
      separateRequest.manifestShipmentInfoIds = this.separateShipmentId;
      this.buildupService.createSeparateManifest(separateRequest).subscribe(data => {
        if (this.refreshFormMessages(data)) {
          this.separatebutton.disabled = false;
          return;
        }
        if (!data.messageList) {
          this.showSuccessStatus('g.completed.successfully');
          if (!this.searchbutton.disabled) {
            this.onSearch();
          }
        }
        this.separatebutton.disabled = false;
      }, error => {
        this.separatebutton.disabled = false;
      });
    } else {
      this.showInfoStatus("export.select.shipments.to.seperate");
    }
  }
  onDeleteSeparate() {
    this.separateShipmentId = [];
    let formValue = this.cargomanifestForm.getRawValue();
    for (let segment of formValue['separateList']) {
      this.addSeparateId(segment);
    }
    if (this.separateShipmentId.length) {
      const separateRequest = new SeparateManifest();
      const flight = new Flight();
      flight.flightKey = formValue['flightKey'];
      flight.flightOriginDate = formValue['flightOriginDate'];
      separateRequest.flight = flight;
      separateRequest.manifestShipmentInfoIds = this.separateShipmentId;
      this.buildupService.deleteSeparateManifest(separateRequest).subscribe(data => {
        this.refreshFormMessages(data);
        if (!data.messageList) {
          this.showSuccessStatus('g.completed.successfully');
          if (!this.searchbutton.disabled) {
            this.onSearch();
          }
        }
        this.separatebutton.disabled = false;
      }, error => {
        this.separatebutton.disabled = false;
      });
    } else {
      this.showInfoStatus("export.select.shipments.send.back.main.manifest");
    }
  }

  addSeparateId(segment) {
    let awb = segment['awb'].filter(function (item) {
      return item.select;
    });
    let courier = segment['courier'].filter(function (item) {
      return item.select;
    });
    awb.forEach(element => {
      this.separateShipmentId.push(element.manifestShipmentInfoId);
    });
    courier.forEach(element => {
      this.separateShipmentId.push(element.manifestShipmentInfoId);
    });
  }

  onSupplementary() {
    const flight = new Flight();
    flight.flightId = this.data.flight.flightId;
    flight.flightKey = this.data.flight.flightKey;
    flight.flightOriginDate = this.data.flight.flightOriginDate;
    this.supplementarybutton.disabled = true;
    this.buildupService.createSupplementaryManifest(flight).subscribe(data => {
      if (this.refreshFormMessages(data)) {
        this.supplementarybutton.disabled = false;
        return;
      }
      if (data.success && !data.messageList) {
        this.showSuccessStatus('g.completed.successfully');
        if (!this.searchbutton.disabled) {
          this.onSearch();
        }
      }
      this.supplementarybutton.disabled = false;
    }, error => {
      this.supplementarybutton.disabled = false;
    });
  }

  onReCreate() {
    const flight = new Flight();
    flight.flightId = this.data.flight.flightId;
    flight.flightKey = this.data.flight.flightKey;
    flight.flightOriginDate = this.data.flight.flightOriginDate;
    flight.aircraftRegistration = this.cargomanifestForm.get('flight').value.aircraftRegistration;
    this.recreatebutton.disabled = true;
    // check ulds not   in DLS but present in manifest then give prompt
    if (this.data.uldNotInDlsFlag) {
      this.showConfirmMessage(this.data.uldsNosNotInDLS + " not in DLS. Do you still want to create manifest?").then(fulfilled => {
        this.buildupService.reCreateManifest(flight).subscribe(data => {
          if (data.data && data.data.warnigAndErrorMessage) {
            flight.skipCpeCheck = true;
            this.showConfirmMessage(data.data.warnigAndErrorMessage).then(fulfilled => {
              this.buildupService.reCreateManifest(flight).subscribe(data => {
                if (this.refreshFormMessages(data)) {
                  this.recreatebutton.disabled = false;
                  return;
                }
                if (data.success && !data.messageList) {
                  this.showSuccessStatus('g.completed.successfully');
                  if (!this.searchbutton.disabled) {
                    this.onSearch();
                  }
                }
                this.recreatebutton.disabled = false;
              }, error => {
                this.recreatebutton.disabled = false;
              });

            }).catch(reason => {
              this.recreatebutton.disabled = false;
              return;
            });

          } else {
            if (this.refreshFormMessages(data)) {
              this.recreatebutton.disabled = false;
              return;
            }
            if (data.success && !data.messageList) {
              this.showSuccessStatus('g.completed.successfully');
              if (!this.searchbutton.disabled) {
                this.onSearch();
              }
            }
            this.recreatebutton.disabled = false;
          }

        }, error => {
          this.recreatebutton.disabled = false;
        });

      }
      ).catch(reason => {
        return;
      });
    } else {
      this.buildupService.reCreateManifest(flight).subscribe(data => {
        if (data.data && data.data.warnigAndErrorMessage) {
          flight.skipCpeCheck = true;
          this.showConfirmMessage(data.data.warnigAndErrorMessage).then(fulfilled => {
            this.buildupService.reCreateManifest(flight).subscribe(data => {
              if (this.refreshFormMessages(data)) {
                this.recreatebutton.disabled = false;
                return;
              }
              if (data.success && !data.messageList) {
                this.showSuccessStatus('g.completed.successfully');
                if (!this.searchbutton.disabled) {
                  this.onSearch();
                }
              }
              this.recreatebutton.disabled = false;
            }, error => {
              this.recreatebutton.disabled = false;
            });

          }).catch(reason => {
            this.recreatebutton.disabled = false;
            return;
          })

        } else {
          if (this.refreshFormMessages(data)) {
            this.recreatebutton.disabled = false;
            return;
          }
          if (data.success && !data.messageList) {
            this.showSuccessStatus('g.completed.successfully');
            if (!this.searchbutton.disabled) {
              this.onSearch();
            }
          }
          this.recreatebutton.disabled = false;
        }
      }, error => {
        this.recreatebutton.disabled = false;
      });
    }


  }

  onUpdateFlightInfo() {
    let segments = [];
    let formValue = this.cargomanifestForm.getRawValue();
    let validList = true;
    const self = this;
    segments = formValue['separateList'].filter(function (item, index) {
      let formArray = self.cargomanifestForm.get(['separateList', index, 'connectingFlight']);
      for (let connectingFlight of formArray['controls']) {
        if (connectingFlight.get('flagCRUD').value === 'C' && !connectingFlight.valid) {
          self.showInfoStatus('export.cannot.send.empty.connecting.flight.value');
          validList = false;
          return false;
        }
      }
      return true;
    });
    if (validList) {
      const manifestFlight = new ManifestFlight();
      manifestFlight.flight = new Flight();
      manifestFlight.flight.flightId = this.cargomanifestForm.getRawValue().flight.flightId;
      manifestFlight.flight.flightKey = this.cargomanifestForm.getRawValue().flight.flightKey;
      manifestFlight.flight.flightOriginDate = this.cargomanifestForm.getRawValue().flight.flightOriginDate;
      manifestFlight.flight.aircraftRegistration = this.cargomanifestForm.getRawValue().flight.aircraftRegistration;
      manifestFlight.segment = segments;
      this.buildupService.updateConnectingFlightInfo(manifestFlight).subscribe(data => {
        this.refreshFormMessages(data);
        if (!data.messageList) {
          this.showSuccessStatus('g.completed.successfully');
          if (!this.searchbutton.disabled) {
            this.onSearch();
          }
        }
      }, error => {
        this.showErrorMessage(error);
      });
    }
  }

  onConnectingFlightAdd(index) {
    (<NgcFormArray>this.cargomanifestForm.get(['separateList', index, 'connectingFlight'])).addValue([{
      flagCRUD: 'C',
      flightKey: '',
      flightDate: null,
      destination: ''
    }]);
  }

  onConnectingFlightDelete(index, flightIndex) {
    (<NgcFormArray>this.cargomanifestForm.get(['separateList', index, 'connectingFlight'])).markAsDeletedAt(flightIndex);
  }

  /**
     * Groups Renderer
     *
     * @param value Value
     * @param rowData Row Data
     * @param level Level
     */
  protected groupsRenderer =(value: string | number, rowData: any, level: any): string => {
    if(NgcUtility.isBlank(this.groupSelectSeparateState)){
      this.groupSelectSeparateState = {};
    }
    let pieces = 0;
    let weight = 0;
    let trolleyInd;
    let remark = rowData.data.uldRemark ? rowData.data.uldRemark: '';
    const checkBoxState: boolean = this.groupSelectSeparateState[rowData.data.uldNumber + ':' + rowData.data.segment] ? true : false;
    const check = NgcUtility.createCheckBox(rowData.data.uldNumber + ':' + rowData.data.segment, checkBoxState);
    for (let row of rowData.records) {
      pieces += row.loadedPieces;
      weight += row.loadedWeight;
      trolleyInd = row.trolleyInd;
    }
    if (value == '') {
      return '';
    }
    if (trolleyInd !== "false" && trolleyInd !== false) {
      return check + value + ' - B - ' + pieces + ' - ' + NgcUtility.getDisplayWeight(weight) + 'K '+ remark;
    }
    return check + value + ' - ' + pieces + ' - ' + NgcUtility.getDisplayWeight(weight) + 'K '+ remark;
  }

  /**
     * Groups Renderer
     *
     * @param value Value
     * @param rowData Row Data
     * @param level Level
     */
   protected supplGroupsRenderer =(value: string | number, rowData: any, level: any): string => {
    if(NgcUtility.isBlank(this.groupSelectSupplState)){
      this.groupSelectSupplState = {};
    }
    let pieces = 0;
    let weight = 0;
    let trolleyInd;
    let remark = rowData.data.uldRemark ? rowData.data.uldRemark: '';
    const checkBoxState: boolean = this.groupSelectSupplState[rowData.data.uldNumber + ':' + rowData.data.segment] ? true : false;
    const check = NgcUtility.createCheckBox(rowData.data.uldNumber + ':' + rowData.data.segment, checkBoxState);
    for (let row of rowData.records) {
      pieces += row.loadedPieces;
      weight += row.loadedWeight;
      trolleyInd = row.trolleyInd;
    }
    if (value == '') {
      return '';
    }
    if (trolleyInd !== "false" && trolleyInd !== false) {
      return check + value + ' - B - ' + pieces + ' - ' + NgcUtility.getDisplayWeight(weight) + 'K '+ remark;
    }
    return check + value + ' - ' + pieces + ' - ' + NgcUtility.getDisplayWeight(weight) + 'K '+ remark;
  }

  ngOnInit() {
    this.initialize();
    this.manifestRemarks = [];
    this.groupSelectState = {};
    this.groupSelectSeparateState = {};
    this.groupSelectCourierState = {};
    this.groupSelectSupplState = {};
    this.mainList = [];
    this.separateList = [];
    this.supplementaryList = [];
    this.separateShipmentId = [];
    this.data = {};
    this.outgoingFlightData = this.getNavigateData(this.activatedRoute);
    console.log(this.outgoingFlightData)
    if (this.outgoingFlightData) {
      this.cargomanifestForm.patchValue(this.outgoingFlightData);
      this.onSearch();
    }
    this.onSearch();
  }

  onPrint(type, version) {


    if (this.data.reportseparateCount == 0 && this.data.reportsupplementaryCount == 0) {
      this.reportParameters = new Object();
      this.reportParameters.flightId = this.data.flight.flightId;
      this.reportParameters.type = type;
      this.reportParameters.version = version;
     
      this.reportParameters.boardpoint = NgcUtility.getTenantConfiguration().airportCode;

      if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_CustomsExportFlightNumber)) {
        this.reportParameters.CustomsExportFlightNumber = true;
      }

      this.reportWindow.open();




    } else {
     this.reportParameters = new Object();
      this.reportParameters.flightId = this.data.flight.flightId;
      this.reportParameters.mainversion = version;
      this.reportParameters.separateCount = this.data.reportseparateCount + '';
      this.reportParameters.supplementaryCount = this.data.reportsupplementaryCount + '';
      this.reportParameters.boardpoint = NgcUtility.getTenantConfiguration().airportCode;
      if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_CustomsExportFlightNumber)) {
        this.reportParameters.CustomsExportFlightNumber = true;
      }
      this.reportWindow2.open();

    }

  }

  onPrintSupp(type, version) {

    this.reportParameters = new Object();
    this.reportParameters.flightId = this.data.flight.flightId;
    this.reportParameters.type = type;
    this.reportParameters.version = version;
    this.reportParameters.boardpoint = NgcUtility.getTenantConfiguration().airportCode;
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_CustomsExportFlightNumber)) {
      this.reportParameters.CustomsExportFlightNumber = true;
    }
    this.reportWindow.open();


  }



  onPrintCourier(type, version) {
    this.reportParameters = new Object();
    this.reportParameters.flightId = this.data.flight.flightId;
    this.reportParameters.type = type;
    this.reportParameters.version = version;
    this.reportParameters.boardpoint = NgcUtility.getTenantConfiguration().airportCode;
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_CustomsExportFlightNumber)) {
      this.reportParameters.CustomsExportFlightNumber = true;
    }
    this.reportWindow1.open();
  }
  onPrintSeparate(type, version) {
    this.reportParameters = new Object();
    this.reportParameters.flightId = this.data.flight.flightId;
    this.reportParameters.type = type;
    this.reportParameters.version = version;
    this.reportParameters.boardpoint = NgcUtility.getTenantConfiguration().airportCode;
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_CustomsExportFlightNumber)) {
      this.reportParameters.CustomsExportFlightNumber = true;
    }
    this.reportWindow.open();
  }

  onPrintPiggyback(type, version){
    this.reportParameters = new Object();
    this.reportParameters.flightId = this.data.flight.flightId;
    this.reportParameters.type = type;
    this.reportParameters.version = version;
    this.reportParameters.boardpoint = NgcUtility.getTenantConfiguration().airportCode;
    this.reportWindow4.open();
  }

  onPrintShipmentBilling(type, version) {
    this.reportParameters = new Object();
    this.reportParameters.flightId = this.data.flight.flightId;
    this.reportParameters.type = type;
    this.reportParameters.version = version;
    this.reportParameters.boardpoint = NgcUtility.getTenantConfiguration().airportCode;
    this.reportWindow3.open();
  }

  onPrintXrayDetails(type, version) {
    this.reportParameters = new Object();
    this.reportParameters.flightId = this.data.flight.flightId;
    this.reportParameters.type = type;
    this.reportParameters.version = version;
    this.reportParameters.boardpoint = NgcUtility.getTenantConfiguration().airportCode;
    this.reportWindow5.open();
  }




  onReleaseManifest() {
    let navigateObj = {
      flightKey: this.data.flight.flightKey,
      flightOriginDate: new Date(this.data.flight.flightOriginDate)
    }
    this.navigateTo(this.router, '/export/buildup/releasemanifestdls', navigateObj);
  }
  initialize() {
    this.cargomanifestForm = new NgcFormGroup({
      flightKey: new NgcFormControl(),
      flightOriginDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
      flight: new NgcFormGroup({
        aircraftRegistration: new NgcFormControl(),
        etd: new NgcFormControl(),
        flightId: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        flightOriginDate: new NgcFormControl(),
        status: new NgcFormControl(),
        std: new NgcFormControl(),
        reportFlight: new NgcFormControl(),
      }),
      mainManifestList: new NgcFormArray([
        new NgcFormGroup({
          destination: new NgcFormControl(),
          loadedPieces: new NgcFormControl(),
          loadedWeight: new NgcFormControl(),
          totalPieces: new NgcFormControl(),
          totalWeight: new NgcFormControl(),
          manifestId: new NgcFormControl(),
          manifestShipmentInfoId: new NgcFormControl(),
          manifestUldId: new NgcFormControl(),
          origin: new NgcFormControl(),
          shipmentId: new NgcFormControl(),
          shipmentNumber: new NgcFormControl(),
          uldNumber: new NgcFormControl(),
          uldSequenceId: new NgcFormControl(),
          weightCode: new NgcFormControl(),
          partShipment: new NgcFormControl(),
          transferType: new NgcFormControl(),
          tagNumbers: new NgcFormControl(),
          shipmentType: new NgcFormControl(),
          manifestRemark: new NgcFormControl()
        })
      ]),
      separateList: new NgcFormArray([
        new NgcFormGroup({
          tenantId: new NgcFormControl(),
          segment: new NgcFormControl(),
          pieces: new NgcFormControl(),
          weight: new NgcFormControl(),
          versionNo: new NgcFormControl(),
          connectingFlight: new NgcFormArray([
            new NgcFormGroup({
              flightKey: new NgcFormControl('', [Validators.required]),
              flightDate: new NgcFormControl('', [Validators.required]),
              destination: new NgcFormControl('', [Validators.required])
            })
          ]),
          additionalInformation: new NgcFormControl(),
          awb: new NgcFormArray([
            new NgcFormGroup({
              select: new NgcFormControl(false),
              destination: new NgcFormControl(),
              loadedPieces: new NgcFormControl(),
              loadedWeight: new NgcFormControl(),
              totalPieces: new NgcFormControl(),
              totalWeight: new NgcFormControl(),
              manifestId: new NgcFormControl(),
              manifestShipmentInfoId: new NgcFormControl(),
              manifestUldId: new NgcFormControl(),
              natureOfGoods: new NgcFormControl(),
              origin: new NgcFormControl(),
              shc: new NgcFormControl(),
              shipmentId: new NgcFormControl(),
              shipmentNumber: new NgcFormControl(),
              uldNumber: new NgcFormControl(),
              uldSequenceId: new NgcFormControl(),
              weightCode: new NgcFormControl(),
              partShipment: new NgcFormControl(),
              transferType: new NgcFormControl(),
              manifestRemark: new NgcFormControl(),
              shipmentType: new NgcFormControl()
            })
          ]),
          courier: new NgcFormArray([
            new NgcFormGroup({
              destination: new NgcFormControl(),
              loadedPieces: new NgcFormControl(),
              loadedWeight: new NgcFormControl(),
              totalPieces: new NgcFormControl(),
              totalWeight: new NgcFormControl(),
              manifestId: new NgcFormControl(),
              manifestShipmentInfoId: new NgcFormControl(),
              manifestUldId: new NgcFormControl(),
              origin: new NgcFormControl(),
              shipmentId: new NgcFormControl(),
              shipmentNumber: new NgcFormControl(),
              uldNumber: new NgcFormControl(),
              uldSequenceId: new NgcFormControl(),
              weightCode: new NgcFormControl(),
              partShipment: new NgcFormControl(),
              transferType: new NgcFormControl(),
              tagNumbers: new NgcFormControl(),
              shipmentType: new NgcFormControl()
            })
          ])
        })
      ]),
      supplementaryList: new NgcFormArray([
        new NgcFormGroup({
          tenantId: new NgcFormControl(),
          segment: new NgcFormControl(),
          pieces: new NgcFormControl(),
          weight: new NgcFormControl(),
          versionNo: new NgcFormControl(),
          connectingFlight: new NgcFormArray([
            new NgcFormGroup({
              flightKey: new NgcFormControl(),
              flightDate: new NgcFormControl(),
              destination: new NgcFormControl()
            })
          ]),
          awb: new NgcFormArray([
            new NgcFormGroup({
              select: new NgcFormControl(false),
              destination: new NgcFormControl(),
              loadedPieces: new NgcFormControl(),
              loadedWeight: new NgcFormControl(),
              totalPieces: new NgcFormControl(),
              totalWeight: new NgcFormControl(),
              manifestId: new NgcFormControl(),
              manifestShipmentInfoId: new NgcFormControl(),
              manifestUldId: new NgcFormControl(),
              natureOfGoods: new NgcFormControl(),
              origin: new NgcFormControl(),
              shc: new NgcFormControl(),
              shipmentId: new NgcFormControl(),
              shipmentNumber: new NgcFormControl(),
              uldNumber: new NgcFormControl(),
              uldSequenceId: new NgcFormControl(),
              weightCode: new NgcFormControl(),
              partShipment: new NgcFormControl(),
              transferType: new NgcFormControl(),
              manifestRemark: new NgcFormControl(),
              shipmentType: new NgcFormControl()
            })
          ]),
          courier: new NgcFormArray([
            new NgcFormGroup({
              destination: new NgcFormControl(),
              loadedPieces: new NgcFormControl(),
              loadedWeight: new NgcFormControl(),
              totalPieces: new NgcFormControl(),
              totalWeight: new NgcFormControl(),
              manifestId: new NgcFormControl(),
              manifestShipmentInfoId: new NgcFormControl(),
              manifestUldId: new NgcFormControl(),
              origin: new NgcFormControl(),
              shipmentId: new NgcFormControl(),
              shipmentNumber: new NgcFormControl(),
              uldNumber: new NgcFormControl(),
              uldSequenceId: new NgcFormControl(),
              weightCode: new NgcFormControl(),
              partShipment: new NgcFormControl(),
              transferType: new NgcFormControl(),
              tagNumbers: new NgcFormControl(),
              shipmentType: new NgcFormControl()
            })
          ])
        })
      ]),
      courierList: new NgcFormArray([
        new NgcFormGroup({
          destination: new NgcFormControl(),
          loadedPieces: new NgcFormControl(),
          loadedWeight: new NgcFormControl(),
          totalPieces: new NgcFormControl(),
          totalWeight: new NgcFormControl(),
          manifestId: new NgcFormControl(),
          manifestShipmentInfoId: new NgcFormControl(),
          manifestUldId: new NgcFormControl(),
          origin: new NgcFormControl(),
          shipmentId: new NgcFormControl(),
          shipmentNumber: new NgcFormControl(),
          uldNumber: new NgcFormControl(),
          uldSequenceId: new NgcFormControl(),
          weightCode: new NgcFormControl(),
          partShipment: new NgcFormControl(),
          transferType: new NgcFormControl(),
          tagNumbers: new NgcFormControl(),
          shipmentType: new NgcFormControl(),
          manifestRemark: new NgcFormControl()
        })
      ]),
      nilCargo: new NgcFormControl('NIL')
    });
    this.subscribeValidateSearch();
  }

  subscribeValidateSearch() {
    this.cargomanifestForm.valueChanges.subscribe(data => {
      if (data['flightKey'] === '' || data['flightOriginDate'] === null) {
        this.searchbutton.disabled = true;
      } else {
        this.searchbutton.disabled = false;
      }
    });
  }
  onCancel() {
    this.navigateBack(this.outgoingFlightData);
  }

  openShipmentInfoPage(event) {
    var dataToSend = {
      shipmentNumber: event.record.shipmentNumber,
      shipmentType: event.record.shipmentType,
      flightKey: this.cargomanifestForm.get('flightKey').value,
      flightOriginDate: this.cargomanifestForm.get('flightOriginDate').value
    }
    this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', dataToSend);
  }

  /* to close the pop up window */
  closeAddWindow() {
    this.addRMKWindow.close();
  }

  /* to open the pop up window by clicking on Add RMK button */
  addManifestRemark() {this.windowForm.reset();
    /* to open the pop up window */
    if(this.manifestRemarks.length != 0){
      this.addRMKWindow.open();
    }else{
      this.showErrorMessage("export.select.uld.or.shipment");
    }
  }

  /* to save Remark */
  onSaveRemark() {
    /* to validate the windowform global Uld data */
    this.windowForm.validate();
    if (!this.windowForm.valid) {
      return;
    } else {
      const manifestRemark = new ManifestRemarks();
      manifestRemark.remark = this.windowForm.get('remark').value;
      manifestRemark.shipmentList = this.manifestRemarks;
      this.buildupService.saveManifestRMK(manifestRemark).subscribe(resp => {
        if (!this.showResponseErrorMessages(resp)) {
          if (resp.data) {
            this.showSuccessStatus('g.completed.successfully');
            this.addRMKWindow.close();
            this.onSearch();
          } else {
            this.showErrorMessage('error');
          }
        }
      }, (error: string) => {
        this.showErrorMessage(error);
      }
      );
    }
  }
}
