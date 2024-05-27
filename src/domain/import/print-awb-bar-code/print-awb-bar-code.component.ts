import { FlightSegment } from './../../export/export.sharedmodel';
import { ShipmentInfo } from './../import.shared';
// Angular imports
import { Validators } from '@angular/forms';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
// Application imports
import { element } from 'protractor';
import { ActivatedRoute } from "@angular/router";
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcFormControl, NgcButtonComponent, NgcUtility, PageConfiguration, NgcPrinterComponent
} from 'ngc-framework';
import { ImportService } from '../import.service';

@Component({
  selector: 'app-print-awb-bar-code',
  templateUrl: './print-awb-bar-code.component.html',
  styleUrls: ['./print-awb-bar-code.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class PrintAwbBarCodeComponent extends NgcPage implements OnInit {
  displaymsg: any;
  NoDataFlag: any;
  dataFlag: any;
  color: any;
  statusvalues: any[];
  response: any;
  flightKey: any[];
  flightIds: any;
  fltKey: any;
  sourceIdSegmentDropdown: any;
  photoCopyDisable: boolean = false;

  private printAWBBarcode: NgcFormGroup = new NgcFormGroup
    ({
      awbNumber: new NgcFormControl(),
      photoCopy: new NgcFormControl(false),
      flightData: new NgcFormArray([]),
      message: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      flightKeyId: new NgcFormControl(),
      printerName: new NgcFormControl(),
      flightDetails: new NgcFormArray([
        new NgcFormGroup({
          check: new NgcFormControl(),
          flightId: new NgcFormControl(),
          flightKey: new NgcFormControl()
        })
      ]),

    });
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private importService: ImportService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
    // this.functionId = "PLAYGROUND";
  }

  ngOnInit() {
    this.displaymsg = false;
    this.NoDataFlag = false;
    this.dataFlag = false;
    const transferData = this.getNavigateData(this.activatedRoute);
    console.log(transferData);
    if (transferData != null) {
      this.printAWBBarcode.get('awbNumber')
        .setValue(transferData);
      this.onAwbNumber();
    }

    this.printAWBBarcode.get('awbNumber').valueChanges.subscribe(datavalue => {
      this.onAwbNumber();
    });

    //this.onAwbNumber();

    // this.statusvalues = [
    //   'SIN-HKG',
    //   'HKG-BLR',
    //   'SIN-SYD',
    //   'ALL'
    // ];

  }

  // public printBarcode() {
  //   this.showSuccessStatus('print completed successfully');
  // }

  public onAwbNumber() {
    //console.log("inside onchange" + this.printAWBBarcode.get('awbNumber').value);


    //this.printAWBBarcode.get('awbNumber').valueChanges.subscribe(datavalue => {
    //console.log("test===" + datavalue.length);
    /*if (datavalue.length === 0) {
      this.showWarningStatus('AWBNumber is required');
      return;
    }*/
    const shipmentInfo: ShipmentInfo = new ShipmentInfo();
    let response: any;
    this.photoCopyDisable = false;
    this.printAWBBarcode.get('photoCopy').reset();
    shipmentInfo.awbNumber = this.printAWBBarcode.get('awbNumber').value;
    shipmentInfo.photoCopy = this.printAWBBarcode.get('photoCopy').value;
    this.importService.validateAWBNumber(shipmentInfo).subscribe(data => {
      // this.refreshFormMessages(data);
      let flightDataArray: any = new Array();
      let flightData: any = new Object();
      console.log(this.response);
      if (!this.showResponseErrorMessages(data)) {
        this.response = data.data;
        this.displaymsg = true;
        if (this.response.flagSaved === 'Y') {
          this.color = 'green';
          this.printAWBBarcode.get('message').setValue('AWB found in the manifest');
          this.NoDataFlag = false;

          console.log(this.response);
          this.response.flightDetails.forEach(element => {
            element.check = false;
          });
          if (this.response.documentReceivedFlag) {
            this.photoCopyDisable = true;
          }
          this.printAWBBarcode.get('flightDetails').patchValue(this.response.flightDetails);
          this.printAWBBarcode.get('photoCopy').patchValue(this.response.photoCopy);
          this.dataFlag = true;
          //(<NgcFormArray>this.printAWBBarcode.controls['flightData']).patchValue(this.response.flightDetails);


        } else {
          this.color = 'red';
          this.NoDataFlag = true;
          this.printAWBBarcode.get('message').setValue('AWB not found in the  manifest');
          this.dataFlag = false;
        }
      }
    }, error => {
      this.showErrorStatus('imp.err133');
      this.displaymsg = false;
      this.NoDataFlag = false;
      this.dataFlag = false;
      this.message = '';
    });
    //});
  }

  public printBarcode(event) {
    let index = 0;
    if (this.dataFlag) {
      let rowCount = 0;

      const rowData = (<NgcFormArray>this.printAWBBarcode.get('flightDetails')).getRawValue();
      for (const eachRow of rowData) {
        if (eachRow.check) {
          rowCount++;
        }
      }

      for (const eachRow of rowData) {
        index++;
        if (eachRow.check) {
          break;
        }
      }

      console.log("rowCount===" + rowCount);
      if (rowCount > 1) {
        this.showWarningStatus('import.warn111');
        // this.showWarningStatus('Select only one flight for shipment. Selected ' + rowCount);
        return;
      }
      if (rowCount === 0) {
        this.showWarningStatus('import.warn112');
        // this.showWarningStatus('Select flight for shipment. Selected ' + rowCount);
        return;
      }
      if (this.printAWBBarcode.get('printerName').value === null) {
        this.showWarningStatus('import.warn113');
        return;
      }
      //for (const eachRow of rowData) {
      //if (eachRow.flightId) {
      //this.flightId = eachRow.flightId;
      //this.flightIds = eachRow.flightId;
      //console.log("test==" + eachRow.flightId);
      //console.log("test==" + eachRow.value);
      //console.log("test==" + eachRow);
      //}
      //}
      this.flightIds = this.response.flightDetails[index - 1].flightId;
      this.fltKey = this.response.flightDetails[index - 1].flightKey;
      console.log("test=====" + this.response.flightDetails[index - 1].flightId);
    }



    if (this.response.photoCopy) {
      if (this.printAWBBarcode.get('photoCopy').value == false) {
        this.showWarningStatus('import.warn114');
        return;
      }
    }

    console.log("flightIds==" + this.flightIds);
    const shipmentInfo: ShipmentInfo = new ShipmentInfo();
    shipmentInfo.awbNumber = this.printAWBBarcode.get('awbNumber').value;
    shipmentInfo.photoCopy = this.printAWBBarcode.get('photoCopy').value;
    //shipmentInfo.flight = this.printAWBBarcode.get('flightId').value;
    //console.log("this===" + this.printAWBBarcode.get('flightId').value)
    shipmentInfo.flight = this.flightIds;
    shipmentInfo.fltKey = this.fltKey;
    shipmentInfo.flightDate = this.printAWBBarcode.get('flightDate').value;
    shipmentInfo.flightKeyId = this.printAWBBarcode.get('flightKeyId').value;
    shipmentInfo.printerName = this.printAWBBarcode.get('printerName').value;
    //shipmentInfo.segment = this.printAWBBarcode.get('segment').value;
    shipmentInfo.flagSaved = this.response.flagSaved;
    this.importService.printAWBBarcode(shipmentInfo).subscribe(data => {
      this.refreshFormMessages(data);
      const res = data.data;
      if (data.data) {
        this.showSuccessStatus('print.completed.successfully');
      }
    }, error => {
      this.showErrorStatus('imp.err133');
    });
  }

  onCancel(event) {
    this.navigateHome();
  }
  
}
