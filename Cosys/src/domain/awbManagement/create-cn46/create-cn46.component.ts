import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';

// NGC framework imports
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, NotificationMessage, NgcReportComponent, PageConfiguration
} from 'ngc-framework';

import { CreateCN46, CN46Details } from '../awbManagement.shared';
import { AwbManagementService } from '../awbManagement.service';
import { ImportService } from './../../import/import.service';

@Component({
  selector: 'app-create-cn46',
  templateUrl: './create-cn46.component.html',
  styleUrls: ['./create-cn46.component.scss']
})

@PageConfiguration({
  trackInit: true,
  autoBackNavigation: true
})

export class CreateCn46Component extends NgcPage implements OnInit {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private awbManagementService: AwbManagementService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  flightKeyforDropdown: any;
  param: any;
  segmentId: any;
  response: any;
  flagread: boolean;
  reportParameters: any;
  airmailManifestId: number;
  deletedShipments: any;
  totalPieces: any = 0;
  totalWeight: any = 0;

  private cn46Form: NgcFormGroup = new NgcFormGroup
    ({
      observations: new NgcFormControl(),
      adminOfOriginOfMails: new NgcFormControl('', [Validators.maxLength(3)]),
      airportOfLoading: new NgcFormControl('', [Validators.maxLength(3)]),
      airportOfOffLoading: new NgcFormControl('', [Validators.maxLength(3)]),
      destinationOffice: new NgcFormControl('', [Validators.maxLength(6)]),
      outgoingFlightKey: new NgcFormControl(),
      outgoingFlightDate: new NgcFormControl(),
      flightId: new NgcFormControl(),
      segmentId: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      flightKey: new NgcFormControl(),
      segment: new NgcFormControl(),
      trolleyNumber: new NgcFormControl(),
      bulk: new NgcFormControl(),
      cn46Details: new NgcFormArray([])
    })
  selectIndex: any = 1;

  ngOnInit() {
    let importManifestData = this.getNavigateData(this.activatedRoute);
    if (importManifestData) {
      this.cn46Form.get('flightKey').patchValue(importManifestData.flightKey);
      this.cn46Form.get('flightDate').patchValue(importManifestData.flightDate);
      this.cn46Form.get('segment').patchValue(importManifestData.segments);
      this.onFlightKey();
      this.onSearch();
    }
  }

  onFlightKey() {
    this.flightKeyforDropdown = this.createSourceParameter(this.cn46Form.get('flightKey').value,
      this.cn46Form.get('flightDate').value);
  }

  selectSegmentId(event) {
    if (event === null) {
      this.segmentId = 0;
    }
    this.segmentId = event.code;
  }

  onAdd() {
    (<NgcFormArray>this.cn46Form.controls['cn46Details']).addValue([
      {
        select: false,
        uldNumber: '',
        mailNumber: '',
        originOfficeExchange: '',
        destinationOfficeExchange: '',
        airportOfTranshipment: '',
        airportOfOffloading: '',
        dateOfDispactch: '',
        letterPost: 0,
        cp: 0,
        ems: 0,
        otherItems: 0,
        remarks: '',
        weight: 0.0
      }
    ]);
  }

  onSearch() {
    const req = new CreateCN46();
    req.segmentId = this.segmentId;
    this.retrieveDropDownListRecords('CN46_SEGMENT', 'query', this.flightKeyforDropdown)
      .subscribe(value => {
        if (value.length == 1) {
          this.selectIndex = 1;
        } else {
          this.selectIndex = 0;
        }
      })
    req.trolleyNumber = this.cn46Form.get('trolleyNumber').value;
    req.flightKey = this.cn46Form.get('flightKey').value;
    req.flightDate = this.cn46Form.get('flightDate').value;
    if (this.cn46Form.get('bulk').value == true) {
      req.bulkFlag = true;
    }
    if ((this.cn46Form.get('flightKey').value === null) || (this.cn46Form.get('flightKey').value === "")) {
      req.flightId = null;
    }
    else if (this.cn46Form.get('flightKey').value != null) {
      if (req.flightId === null) {
        req.flightId = 0;
      }
    }
    if (!req.segmentId) {
      req.segmentId = this.cn46Form.get('segment').value;
    }
    this.awbManagementService.searchCN46(req).subscribe(data => {
      if (data.data) {
        this.response = data.data;
        this.totalPieces = 0;
        this.totalWeight = 0;
        this.response.cn46Details.forEach(element => {
          this.totalPieces += element.cp + element.ems + element.letterPost + element.otherItems;
          this.totalWeight += element.weight;
          this.totalWeight = Number.parseFloat(NgcUtility.getDisplayWeight(this.totalWeight));
        })
        this.cn46Form.get('observations').setValue(data.data.observations);
        this.cn46Form.get('adminOfOriginOfMails').setValue(data.data.adminOfOriginOfMails);
        this.cn46Form.get('airportOfLoading').setValue(data.data.airportOfLoading);
        this.cn46Form.get('airportOfOffLoading').setValue(data.data.airportOfOffLoading);
        this.cn46Form.get('destinationOffice').setValue(data.data.destinationOffice);
        this.cn46Form.get('outgoingFlightKey').setValue(data.data.outgoingFlightKey);
        data.data.outgoingFlightDate = NgcUtility.toDateFromLocalDate(data.data.outgoingFlightDate);
        this.cn46Form.get('outgoingFlightDate').setValue(data.data.outgoingFlightDate);
        if (this.response.cn46Details) {
          this.response.cn46Details.forEach(obj => {
            obj.select = false;
            obj.dateOfDispactch = NgcUtility.toDateFromLocalDate(obj.dateOfDispactch);
          })
        }
        (<NgcFormArray>this.cn46Form.controls['cn46Details']).patchValue(this.response.cn46Details);
        this.resetFormMessages();
        this.flagread = false;
        this.airmailManifestId = data.data.airmailManifestId;
        if (!this.segmentId) {
          this.segmentId = data.data.segmentId;
        }
      }
      else {
        if (data.messageList) {
          this.refreshFormMessages(data);
          this.flagread = true;
          this.cn46Form.get('observations').reset();
          this.cn46Form.get('adminOfOriginOfMails').reset();
          this.cn46Form.get('airportOfLoading').reset();
          this.cn46Form.get('airportOfOffLoading').reset();
          this.cn46Form.get('destinationOffice').reset();
          (<NgcFormArray>this.cn46Form.controls['cn46Details']).resetValue([]);
        }
        else {
          this.showInfoStatus("info.no.cn.found");
          this.flagread = true;
          this.cn46Form.get('observations').reset();
          this.cn46Form.get('adminOfOriginOfMails').reset();
          this.cn46Form.get('airportOfLoading').reset();
          this.cn46Form.get('airportOfOffLoading').reset();
          this.cn46Form.get('destinationOffice').reset();
          (<NgcFormArray>this.cn46Form.controls['cn46Details']).resetValue([]);
          this.resetFormMessages();
        }
      }
    },
      error => { });
  }

  onSave() {
    const request: CreateCN46 = this.cn46Form.getRawValue();
    request.airmailManifestId = this.airmailManifestId;
    request.segmentId = this.cn46Form.get('segment').value;
    if (request.flightId === null) {
      request.flightId = 0;
    }
    if (request.segmentId === null) {
      request.segmentId = 0;
    }
    request.cn46Details.forEach(e => {
      if (e.uldNumber === 'BULK') {
        e.uldNumber = null;
      }
    });
    if (this.deletedShipments) {
      this.deletedShipments.forEach(element => {
        request.cn46Details.push(element);
      })

    }
    if (this.flagread) {
      request.flagCRUD = 'C';
    } else {
      request.flagCRUD = 'U';
    }
    this.awbManagementService.createCn46Request(request).subscribe(data => {
      if (data.data) {
        this.showSuccessStatus('g.completed.successfully');
        this.resetFormMessages();
        this.onSearch();
        this.deletedShipments = null;
      }
      else {

        this.refreshFormMessages(data);
      }
    });
  }

  onClear() {
    this.cn46Form.reset();
    this.cn46Form.get('cn46Details').patchValue(new Array());
  }

  onDelete() {
    let selectedListForDelete = new Array();
    const value = this.cn46Form.getRawValue();
    let index = 0;
    value.cn46Details.forEach(ele => {
      if (ele['select']) {
        (<NgcFormArray>this.cn46Form.controls['cn46Details']).removeAt(index);
        selectedListForDelete.push(ele);
        this.resetFormMessages();
      } else {
        index++;
      }
    });
    selectedListForDelete.forEach(element => {
      element.flagCRUD = 'D';
    })
    this.deletedShipments = selectedListForDelete;
  }

  onCN46ServiceReport() {
    this.reportParameters = new Object();

    this.reportParameters.flightKey = this.cn46Form.get('flightKey').value;
    this.reportParameters.flightDate = NgcUtility.getDateAsString(this.cn46Form.get('flightDate').value);
    //this.reportParameters.outGoingFlightKey = this.cn46Form.get('flightKey').value;
    //this.reportParameters.outGoingFlightDate = NgcUtility.getDateAsString(this.cn46Form.get('flightDate').value);
    this.reportParameters.customerId = this.getUserProfile().userShortName;
    let allDataToBePrinted = this.cn46Form.getRawValue().cn46Details;
    let allSelectedData = new Array();
    let mailNumbers = new Array();
    let transhipments = new Array();
    let offLoadings = new Array();
    allDataToBePrinted.forEach(element => {
      if (element.select) {
        allSelectedData.push(element.uldNumber);
        mailNumbers.push(element.mailNumber);
        transhipments.push(element.airportOfTranshipment);
        offLoadings.push(element.airportOfOffloading);
      }
    });

    let allUlds: string = allSelectedData.toString();
    if (allUlds === "") {
      this.reportParameters.allUlds = null;
    } else {
      this.reportParameters.allUlds = allUlds;
    }

    this.reportParameters.segmentId = this.cn46Form.get('segment').value;
    if (!this.reportParameters.segmentId) {
      this.reportParameters.segmentId = this.segmentId;
    }
    this.reportParameters.segflag = '1'
    this.reportParameters.segmentId = this.reportParameters.segmentId.toString();
    if (!this.reportParameters.segmentId) {
      this.showErrorMessage('flight.segment.select');
    }
    this.reportParameters.outGoingFlightKey = this.cn46Form.get('outgoingFlightKey').value;
    this.reportParameters.outGoingFlightDate = this.cn46Form.get('outgoingFlightDate').value;
    if (this.reportParameters.outGoingFlightDate == '') {
      this.reportParameters.outGoingFlightDate = null;
    }
    this.reportWindow.open();
  }
}
