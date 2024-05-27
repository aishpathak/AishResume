import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcInputComponent,
  NgcUtility, NgcWindowComponent, NgcContainerComponent, PageConfiguration, BaseBO
} from 'ngc-framework';
import { Validator, Validators } from '@angular/forms';
import { NgcFormControl, NgcReportComponent, ReportFormat } from 'ngc-framework';
import { StatusMessage } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { AwbManagementService } from '../awbManagement.service';
import { ShipmentInfoReqModel, ShipmentSearch } from '../awbManagement.shared';

import { ShipmentTemperatureRange, TemperatureLogEntryArray } from '../awbManagement.shared';
import { ApplicationEntities } from '../../common/applicationentities';
import { ApplicationFeatures } from '../../common/applicationfeatures';

@Component({
  selector: 'app-temperature-log-entry',
  templateUrl: './temperature-log-entry.component.html',
  styleUrls: ['./temperature-log-entry.component.scss'],
  providers: [AwbManagementService]
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class TemperatureLogEntryComponent extends NgcPage implements OnInit {
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  arrayData: number;
  response: any;
  sourceIdValue: string;
  private helpViewVisible: boolean = false;
  handledbyHouse: boolean = false;
  hawbNumber: string;
  hawbSourceParameters: {};
  reportParameters: any = new Object();
  printFlag: boolean = false;
  onSearchFlag: boolean = false;

  private ShipmentTemperatureSearch: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    shipmentId: new NgcFormControl()
  });
  private ShipmentTemperatureSearchFlag: boolean = false;
  private flagAll: boolean = false;
  private ShipmentTemperatureSearchResponse: NgcFormGroup = new NgcFormGroup({
    weightCode: new NgcFormControl(),
    svc: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    shipmentId: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    chargeCode: new NgcFormControl(),
    temperatureRange: new NgcFormControl(),
    processType: new NgcFormControl(),
    temperatureLogEntryData: new NgcFormArray([
    ]),
    selectAll: new NgcFormControl()
  });

  public onAddRow(event) {
    const noOfRows = (<NgcFormArray>this.ShipmentTemperatureSearchResponse.get('temperatureLogEntryData')).length;
    const lastRow = noOfRows ? (<NgcFormArray>this.ShipmentTemperatureSearchResponse.get('temperatureLogEntryData')).controls[noOfRows - 1] : null;
    let lastindex = noOfRows;

    if (this.ShipmentTemperatureSearchResponse.controls.shipmentNumber.value != null && this.ShipmentTemperatureSearchResponse.controls.shipmentNumber.value != '') {
      if (this.ShipmentTemperatureSearchResponse.get('temperatureLogEntryData').value.length > 0) {
        if (this.ShipmentTemperatureSearchResponse.get('temperatureLogEntryData').value[lastindex - 1].activity != '' &&
          this.ShipmentTemperatureSearchResponse.get('temperatureLogEntryData').value[lastindex - 1].activity != null &&
          this.ShipmentTemperatureSearchResponse.get('temperatureLogEntryData').value[lastindex - 1].temperature != '' &&
          this.ShipmentTemperatureSearchResponse.get('temperatureLogEntryData').value[lastindex - 1].temperature != null
        ) {
          (<NgcFormArray>this.ShipmentTemperatureSearchResponse.controls['temperatureLogEntryData']).addValue([
            {

              flagSave: "",
              SNo: "",
              temperature: "",
              capturedOn: new Date(),
              activity: "",
              locationCode: "",
              shipmentId: ""
            }
          ]);
        }

        else {
          this.helpViewVisible = false;
          this.showErrorMessage('g.fill.all.details');
        }
      }
      else {

        (<NgcFormArray>this.ShipmentTemperatureSearchResponse.controls['temperatureLogEntryData']).addValue([
          {

            flagSave: "",
            SNo: "",
            temperature: "",
            capturedOn: new Date(),
            activity: "",
            locationCode: "",
            shipmentId: ""


          }
        ]);

      }
    }
    else {
      this.showErrorMessage('g.shipment.number.mandatory');
    }
  }
  constructor(private awbService: AwbManagementService, appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private AwbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    NgcUtility.trackCheckUnCheckAll(this.ShipmentTemperatureSearchResponse.get('selectAll') as NgcFormControl,
      this.ShipmentTemperatureSearchResponse.get('temperatureLogEntryData') as NgcFormArray, 'flagSave');
  }

  onSave() {
    let shipmentTemperatureRange: ShipmentTemperatureRange = new ShipmentTemperatureRange();
    let length;
    shipmentTemperatureRange.temperatureLogEntryData = this.ShipmentTemperatureSearchResponse.get('temperatureLogEntryData').value;
    shipmentTemperatureRange.temperatureLogEntryData = shipmentTemperatureRange.temperatureLogEntryData.filter(logData => logData.flagCRUD == 'C');

    shipmentTemperatureRange.temperatureLogEntryData.map(
      (i) => {
        i.shipmentId = this.ShipmentTemperatureSearchResponse.get('shipmentId').value;
        i.shipmentNumber = this.ShipmentTemperatureSearch.get('shipmentNumber').value;
        i.hawbNumber = this.ShipmentTemperatureSearch.get('hawbNumber').value;

      }
    )
    length = shipmentTemperatureRange.temperatureLogEntryData;

    if (shipmentTemperatureRange.temperatureLogEntryData.length > 0) {
      if (shipmentTemperatureRange.temperatureLogEntryData[0].activity != '' &&
        shipmentTemperatureRange.temperatureLogEntryData[0].activity != null &&
        shipmentTemperatureRange.temperatureLogEntryData[0].temperature != '' &&
        shipmentTemperatureRange.temperatureLogEntryData[0].temperature != null
      ) {
        this.AwbManagementService.saveShipmentTemperatureLogEntry(shipmentTemperatureRange.temperatureLogEntryData).subscribe(data => {
          if (data) {
            this.showSuccessStatus('data.updated.successfully');
            this.onSearch();
          }
        })
      }
      else {
        this.showErrorMessage("g.fill.all.details");
      }
    }
    else {
      this.showErrorMessage('invalid.data');
    }
  }
  private onDelete() {
    this.showConfirmMessage('delete.selected.records').then(fulfilled => {
      let shipmentTemperatureRange: ShipmentTemperatureRange = new ShipmentTemperatureRange();
      shipmentTemperatureRange.temperatureLogEntryData = (this.ShipmentTemperatureSearchResponse.get('temperatureLogEntryData') as NgcFormArray).getRawValue();
      shipmentTemperatureRange.temperatureLogEntryData = shipmentTemperatureRange.temperatureLogEntryData.filter(logData => logData.flagSave == true);
      shipmentTemperatureRange.temperatureLogEntryData.map(
        (i) => {

          i.shipmentNumber = this.ShipmentTemperatureSearch.get('shipmentNumber').value;

        });

      if (shipmentTemperatureRange.temperatureLogEntryData.length > 0) {
        this.AwbManagementService.deleteShipmentTemperatureLogEntry(shipmentTemperatureRange.temperatureLogEntryData).subscribe(data => {
          if (data) {
            this.onSearch();
            this.showSuccessStatus('g.operation.successful');
          }
        })
      }
      else {
        this.showErrorMessage('please.select.record');
      }

    }).catch(reason => {
    });
  }

  private onClear() {
    this.helpViewVisible = false;
    this.ShipmentTemperatureSearch.reset();
    this.ShipmentTemperatureSearchResponse.controls.selectAll.reset();
    this.ShipmentTemperatureSearchResponse.reset();
    this.ShipmentTemperatureSearchResponse.controls.SNo.reset();
  }

  private onSearch() {
    this.ShipmentTemperatureSearchResponse.reset();
    this.ShipmentTemperatureSearchFlag = false;
    this.printFlag = true;
    let shipmentsearch: ShipmentSearch = new ShipmentSearch();
    shipmentsearch.shipmentNumber = this.ShipmentTemperatureSearch.get('shipmentNumber').value;
    shipmentsearch.hawbNumber = this.ShipmentTemperatureSearch.get('hawbNumber').value;
    this.AwbManagementService.fetchShipmentTemperatureRangeInfo(shipmentsearch).subscribe(data => {
      if (data != null) {
        if (this.handledbyHouse) {
          if ((shipmentsearch.shipmentNumber != '' && shipmentsearch.shipmentNumber != null) &&
            (shipmentsearch.hawbNumber != '' && shipmentsearch.hawbNumber != null)) {
            this.onSearchFlag = true;
          }
        }
        else if (!this.handledbyHouse) {
          if (shipmentsearch.shipmentNumber != '' && shipmentsearch.shipmentNumber != null) {
            this.onSearchFlag = true;
          }
        }
        else {
          this.onSearchFlag = false;
        }
        if (this.onSearchFlag) {
          this.helpViewVisible = true;
          this.resetFormMessages();
          this.response = data;
          this.refreshFormMessages(data);
          if (this.response.temperatureRange == 0) {
            this.sourceIdValue = 'TemperatureLog$Temperature_Group_0';
          } else if (this.response.temperatureRange == 1) {
            this.sourceIdValue = 'TemperatureLog$Temperature_Group_1';
          } else if (this.response.temperatureRange == 2) {
            this.sourceIdValue = 'TemperatureLog$Temperature_Group_2';
          }
          else {
            this.sourceIdValue = 'TemperatureLog$Temperature_Group_3';
          }

          this.ShipmentTemperatureSearchResponse.patchValue(this.response);
          if (this.ShipmentTemperatureSearchResponse.value.shipmentNumber != null && this.ShipmentTemperatureSearchResponse.value.shipmentNumber != '' && this.ShipmentTemperatureSearchResponse.value.shipmentId != '' && this.ShipmentTemperatureSearchResponse.value.shipmentId != null) {
            this.ShipmentTemperatureSearchFlag = true;
            this.ShipmentTemperatureSearchResponse.get('svc')
              .setValue(this.ShipmentTemperatureSearchResponse.get('svc').value ? 'Y' : '');
          }
          else {
            this.showErrorMessage('export.no.records.available');
          }
        }
        else {
          this.showErrorMessage('uld.please.fill.all.the.mandatory.fields');
        }
      }
      else {
        this.showErrorStatus('NO_RECORDS_EXIST');
      }
    })
  }
  onTabOutCheckHandledBy(event) {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.ShipmentTemperatureSearch);
      const req: ShipmentInfoReqModel = new ShipmentInfoReqModel();
      req.shipmentNumber = searchFormGroup.get('shipmentNumber').value;
      this.handledbyHouse = false;
      this.awbService.isHandledByHouse(req).subscribe(response => {
        console.log(response);
        if (response) {
          this.handledbyHouse = true;
        }
        console.log(this.handledbyHouse);
      })
      this.handledbyHouse = false;
      this.ShipmentTemperatureSearch.get('hawbNumber').patchValue("");
      this.ShipmentTemperatureSearch.get('hawbNumber').clearValidators();
      if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
        this.hawbSourceParameters = this.createSourceParameter(this.ShipmentTemperatureSearch.get('shipmentNumber').value);

        this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
          if (data != null && data.length > 0) {
            this.handledbyHouse = true;
            this.ShipmentTemperatureSearch.get('hawbNumber').setValidators([Validators.required, Validators.maxLength(16)]);
            this.retrieveLOVRecords("HAWBNUMBER", this.hawbSourceParameters).subscribe(data => {
              if (data != null && data.length == 1) {
                this.ShipmentTemperatureSearch.get('hawbNumber').setValue(data[0].code);
              }

            })

          } else {
            this.handledbyHouse = false;
            this.ShipmentTemperatureSearch.get('hawbNumber').clearValidators();
          }
        },
        );
      }





    }
  }


  private onShipmentSelect(event) {

    this.handledbyHouse = false;
    this.ShipmentTemperatureSearch.get('hawbNumber').patchValue("");
    this.ShipmentTemperatureSearch.get('hawbNumber').clearValidators();
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.hawbSourceParameters = this.createSourceParameter(this.ShipmentTemperatureSearch.get('shipmentNumber').value);

      this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
        if (data != null && data.length > 0) {
          this.handledbyHouse = true;
          this.ShipmentTemperatureSearch.get('hawbNumber').setValidators([Validators.required, Validators.maxLength(16)]);
          this.retrieveLOVRecords("HAWBNUMBER", this.hawbSourceParameters).subscribe(data => {
            if (data != null && data.length == 1) {
              this.ShipmentTemperatureSearch.get('hawbNumber').setValue(data[0].code);
            }

          })

        } else {
          this.handledbyHouse = false;
          this.ShipmentTemperatureSearch.get('hawbNumber').clearValidators();
        }
      },
      );
    }
  }
  public print() {
    this.reportParameters.shipmentNumber = this.ShipmentTemperatureSearch.get('shipmentNumber').value;
    this.reportParameters.hawbNumber = this.ShipmentTemperatureSearch.get('hawbNumber').value;
    this.reportParameters.shipmentid = this.ShipmentTemperatureSearchResponse.value.shipmentId;
    this.reportParameters.SVC = this.ShipmentTemperatureSearchResponse.get('svc').value;
    this.reportParameters.loginuser = this.getUserProfile().userShortName;
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.reportParameters.isHawbEnable = true;
    }
    this.reportWindow.reportParameters = this.reportParameters;
    this.reportWindow.format = ReportFormat.PDF;
    this.reportWindow.open();
  }
  onDropdownclick() {

  }




}
