import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// NGC framework imports
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, NotificationMessage, NgcReportComponent, PageConfiguration
} from 'ngc-framework';
import { BuildupService } from '../buildup.service';
import { SearchSpecialCargoShipmentForHO } from './../../export.sharedmodel';
@Component({
  selector: 'app-special-cargo-request-by-handover',
  templateUrl: './special-cargo-request-by-handover.component.html',
  styleUrls: ['./special-cargo-request-by-handover.component.scss']
})
@PageConfiguration({
  trackInit: true,
  //callNgOnInitOnClear: true,
  // autoBackNavigation: true
})
export class SpecialCargoRequestByHandoverComponent extends NgcPage implements OnInit {
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private buildupService: BuildupService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }
  defaultDate = NgcUtility.getCurrentDateOnly();

  private specialcargorequestform: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    atdetdstd: new NgcFormControl(),
    shcGroup: new NgcFormControl(),
    select: new NgcFormControl(),
    selectAll: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    partSuffix: new NgcFormControl(),
    bookingStatus: new NgcFormControl(),
    segmentId: new NgcFormControl(),
    bookePieces: new NgcFormControl(),
    location: new NgcFormControl(),
    locationSHC: new NgcFormControl(),
    reqPieces: new NgcFormControl(),
    locPieces: new NgcFormControl(),
    reqLocation: new NgcFormControl(),
    reqDatetTime: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    shipmentInventoryShipmentLocation: new NgcFormControl(),
    inventoryShcForDisplay: new NgcFormControl(),
    requestPieces: new NgcFormControl(),
    shipmentInventoryPieces: new NgcFormControl(),
    awbSHC: new NgcFormControl(),
    whLocation: new NgcFormControl(),
    expDateTime: new NgcFormControl(),
    requestedDateTime: new NgcFormControl(),
    requestingPieces: new NgcFormControl(),
    sqCarrier: new NgcFormControl(),
    shipmentsList: new NgcFormArray([]),
    inventoryList: new NgcFormArray([]),
    shipmentListFromWorkingList: new NgcFormArray([]),


  })
  // segmentIdPopulated: any = false;
  navigateBackData: any;
  ngOnInit() {

    this.specialcargorequestform.get('flightDate').setValue(this.defaultDate);
    this.navigateBackData = this.getNavigateData(this.activatedRoute);
    if (this.navigateBackData) {
      if (this.navigateBackData.flightKey) {
        this.specialcargorequestform.get('flightKey').patchValue(this.navigateBackData.flightKey);
      }
      if (this.navigateBackData.flightDate) {
        this.specialcargorequestform.get('flightDate').patchValue(this.navigateBackData.flightDate);

      }
      if (this.navigateBackData.shipmentListFromWorkingList) {
        this.specialcargorequestform.get('shipmentListFromWorkingList').patchValue(this.navigateBackData.shipmentListFromWorkingList);
      }

      if (this.navigateBackData.shcGroup) {
        this.specialcargorequestform.get('shcGroup').patchValue(this.navigateBackData.shcGroup);

      }

      this.flightForSegment();
      this.retrieveDropDownListRecords('FLIGHTSEGMENT', 'query', this.flightKeyforDropdown)

        .subscribe(value => {
          console.log("DropDownvalue", value);
          if (value.length > 0) {
            //   this.specialcargorequestform.get('segmentId').patchValue(value[0].code);
            this.specialcargorequestform.get('segmentId').patchValue(this.navigateBackData.segment);
            this.onSearch();
          }
        });
      // this.onSearch();
    }
  }

  dateFrom: any = NgcUtility.getDateTimeOnly(new Date());
  segmentId: any;
  flightKeyforDropdown: any;
  onFlightKey() {
    this.flightKeyforDropdown = this.createSourceParameter(this.specialcargorequestform.get('flightKey').value,
      this.specialcargorequestform.get('flightDate').value);
  }
  selectSegmentId(event) {
    if (event === null) {
      this.segmentId = 0;
    }
    this.segmentId = event.code;
  }
  onSearch() {

    if (!this.specialcargorequestform.get('flightKey').value || !this.specialcargorequestform.get('flightDate').value
      || !this.specialcargorequestform.get('segmentId').value || !this.specialcargorequestform.get('shcGroup').value) {
      this.showErrorStatus('expaccpt.input.all.mandatory.details');
      return;
    }

    let request = new SearchSpecialCargoShipmentForHO();
    this.resetFormMessages();
    request.flightKey = this.specialcargorequestform.get('flightKey').value;
    request.flightDate = this.specialcargorequestform.get('flightDate').value;
    request.segmentId = this.specialcargorequestform.get('segmentId').value;
    request.shcGroup = this.specialcargorequestform.get('shcGroup').value;
    request.shipmentListFromWorkingList = this.specialcargorequestform.get('shipmentListFromWorkingList').value;
    request.fromRequest = true;
    // request.source = 'DESKTOP';
    this.buildupService.specialCargoRequestSearch(request).subscribe(response => {
      // console.log(response.data);
      // this.specialcargorequestform.get('shipmentListFromWorkingList').patchValue(new Array());
      if (response.success) {
        this.specialcargorequestform.get('sqCarrier').patchValue(response.data.sqCarrier);
        this.specialcargorequestform.get('atdetdstd').patchValue(response.data.atdetdstd);
        this.specialcargorequestform.get('shipmentsList').patchValue(response.data.readyShipment);
        if (response.data.readyShipment == null || response.data.readyShipment.length === 0) {
          return this.showErrorMessage("NO_RECORDS_EXIST");
        }
        // console.log(this.specialcargorequestform.get('shipmentsList').value);
        this.specialcargorequestform.get('expDateTime').setValue(new Date());
        if (this.specialcargorequestform.get('whLocation')) { this.specialcargorequestform.get('whLocation').reset(); }
        if (this.specialcargorequestform.get('selectAll')) { this.specialcargorequestform.get('selectAll').reset(); }

      } else {
        this.showResponseErrorMessages(response);
        this.refreshFormMessages(response);
      }
    });

  }


  public openSpecialCargoHandoverScreen() {
    let formData = this.specialcargorequestform.getRawValue();
    let navigateObj = {
      flightKey: formData.flightKey,
      flightDate: formData.flightDate,
      shcGroup: formData.shcGroup,
      segment: formData.segmentId
    }
    this.navigateTo(this.router, '/export/buildup/specialCargoHandover', navigateObj);
  }



  selectAll(value: any) {
    for (let i = 0; i < (<NgcFormArray>this.specialcargorequestform.get(['shipmentsList'])).length; i++) {
      if (value) {
        this.specialcargorequestform.get(['shipmentsList', i, 'select']).patchValue(true);
        let shipmentLenght = (<NgcFormArray>this.specialcargorequestform.get(['shipmentsList'])).length
        for (let i = 0; i < shipmentLenght; i++) {
          let data = (<NgcFormArray>this.specialcargorequestform.get(['shipmentsList', i, 'inventoryList'])).getRawValue();
          data.forEach(element => {
            if (element.handoverFlag == false && element.availablePieces != 0 && !element.requestingPieces) {
              element.requestingPieces = element.availablePieces;
            }
          });
          (<NgcFormArray>this.specialcargorequestform.get(['shipmentsList', i, 'inventoryList'])).patchValue(data);
        }
      } else {
        this.specialcargorequestform.get(['shipmentsList', i, 'select']).patchValue(false);
        let shipmentLenght = (<NgcFormArray>this.specialcargorequestform.get(['shipmentsList'])).length
        for (let i = 0; i < shipmentLenght; i++) {
          let data = (<NgcFormArray>this.specialcargorequestform.get(['shipmentsList', i, 'inventoryList'])).getRawValue();
          data.forEach(element => {
            element.requestingPieces = null;
          });
          (<NgcFormArray>this.specialcargorequestform.get(['shipmentsList', i, 'inventoryList'])).patchValue(data);
        }
      }
    }

  }

  select(value: any, shipmentIndex: any) {
    if (value) {
      let data = (<NgcFormGroup>this.specialcargorequestform.get(['shipmentsList', shipmentIndex, 'inventoryList'])).getRawValue();
      data.forEach(element => {
        if (element.handoverFlag == false && element.availablePieces != 0 && !element.requestingPieces) {
          element.requestingPieces = element.availablePieces;
        }
      });
      (<NgcFormArray>this.specialcargorequestform.get(['shipmentsList', shipmentIndex, 'inventoryList'])).patchValue(data);
    }
    else {
      let data = (<NgcFormGroup>this.specialcargorequestform.get(['shipmentsList', shipmentIndex, 'inventoryList'])).getRawValue();
      data.forEach(element => {
        element.requestingPieces = null;
      });
      (<NgcFormArray>this.specialcargorequestform.get(['shipmentsList', shipmentIndex, 'inventoryList'])).patchValue(data);
    }
  }



  onRequest() {
    if (this.specialcargorequestform.get('whLocation').invalid) {
      return this.showErrorMessage("ERR_SPECIALCARGO_14");
    }
    let formvalue: any = (<NgcFormArray>this.specialcargorequestform.get(['shipmentsList'])).getRawValue();
    let request: any = [];
    let input: any = [];
    formvalue.forEach(element => {
      if (element.select) {
        element.whLocation = this.specialcargorequestform.get('whLocation').value;
        //new
        let inputCount = 0;
        element.inventoryList.forEach(req => {
          if (req.requestingPieces) {
            inputCount++;
          }
        });
        if (inputCount > 0) {
          input.push(element);
        }
        element.expDateTime = this.specialcargorequestform.get('expDateTime').value;
        element.flightKey = this.specialcargorequestform.get('flightKey').value;
        element.flightDate = this.specialcargorequestform.get('flightDate').value;
        element.shcGroup = this.specialcargorequestform.get('shcGroup').value;
        //for audit trail
        element.timeStamp = new Date();
        request.push(element);
      }
    });
    if (request.length === 0) {
      return this.showErrorMessage("selectAtleastOneRecord");
    }
    if (request.length !== input.length) {
      return this.showErrorMessage("ERR_SPECIALCARGO_12");
    }
    if (!this.specialcargorequestform.get('whLocation').value || !this.specialcargorequestform.get('expDateTime').value) {
      return this.showErrorMessage("expaccpt.input.all.mandatory.details!");
    }

    if (this.specialcargorequestform.get('expDateTime').value < NgcUtility.getDateTimeOnly(new Date())) {
      return this.showErrorMessage("ERR_SPECIALCARGO_13");
    }

    this.buildupService.saveSpecialCargoRequestList(request).subscribe(response => {
      // console.log(response.data);
      if (response.data) {
        this.onSearch();
        this.showSuccessStatus("g.operation.successful");
        this.specialcargorequestform.get('whLocation').reset();
        this.specialcargorequestform.get('selectAll').reset();
      } else {
        this.showResponseErrorMessages(response);
      }
    });
  }

  flightForSegment() {
    this.specialcargorequestform.get('segmentId').reset();
    this.resetFormMessages();
    const searchReq = new SearchSpecialCargoShipmentForHO();
    searchReq.flightKey = this.specialcargorequestform.get('flightKey').value;
    searchReq.flightDate = this.specialcargorequestform.get('flightDate').value;
    if (searchReq.flightKey != null && searchReq.flightDate != null) {
      this.buildupService.validateFlight(searchReq).subscribe(response => {
        if (!response.data) {
          return this.showErrorMessage("invalid.flight");
        }
      });
    }
    if (this.specialcargorequestform.get('flightDate').value) {
      this.flightKeyforDropdown = this.createSourceParameter(this.specialcargorequestform.get('flightKey').value,
        this.specialcargorequestform.get('flightDate').value);
    }
  }


  onDeleteRequest(shipmentIndex: any, inventoryIndex: any) {
    this.showConfirmMessage('export.wish.to.delete.confirmation').then(fulfilled => {

      let req = (<NgcFormGroup>this.specialcargorequestform.get(['shipmentsList', shipmentIndex, 'inventoryList', inventoryIndex])).getRawValue();
      let reqForShipmentNumber = (<NgcFormGroup>this.specialcargorequestform.get(['shipmentsList', shipmentIndex])).getRawValue();
      let request = new SearchSpecialCargoShipmentForHO();
      request.shipmentNumber = reqForShipmentNumber.shipmentNumber;
      request.flightKey = this.specialcargorequestform.get('flightKey').value;
      request.flightDate = this.specialcargorequestform.get('flightDate').value;
      this.resetFormMessages();
      request.shipmentInventoryId = req.shipmentInventoryId;
      request.whLocation = req.shipmentInventoryShipmentLocation;
      if (req && req.requestList.length > 0)
        request.requestId = req.requestList[0].requestId;
      this.buildupService.deleteRequest(request).subscribe(response => {
        if (response.data) {
          this.showSuccessStatus("g.completed.successfully");
          this.onSearch();
        }
      });
    });
  }
  onClear(event) {
    if (this.navigateBackData == null) {
      this.reloadPage();
    }
    else {
      this.specialcargorequestform.reset();
      this.resetFormMessages();
      this.specialcargorequestform.get('flightDate').setValue(new Date());
      this.navigateBackData = null
      this.navigateTo(this.router, '/export/buildup/specialcargorequestbyhandover', null);
    }
  }
  onCancel() {
    this.navigateBack(this.navigateBackData);
  }

}
