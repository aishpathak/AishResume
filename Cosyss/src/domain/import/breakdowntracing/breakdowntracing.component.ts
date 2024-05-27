import { ApplicationFeatures } from './../../common/applicationfeatures';
import { Segment } from './../../export/export.sharedmodel';
import { ApplicationEntities } from './../../common/applicationentities';

import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, PageConfiguration, NgcReportComponent, NgcUtility } from 'ngc-framework';
import { NgcFormControl } from 'ngc-framework';
import { BreakDownTracingFlightModel } from '../import.sharedmodel';
import { ImportService } from './../import.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-breakdowntracing',
  templateUrl: './breakdowntracing.component.html',
  styleUrls: ['./breakdowntracing.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class BreakdowntracingComponent extends NgcPage {

  segmentInformation: any[] = [];
  uldLocationDetails: any[] = [];
  isBreakDownInformation: boolean = false;
  isULDInformation: boolean = false;

  flightDate: string = '';
  customColspan: any = 8;
  segmentDropdownValue: any;
  segmentDropDownReport: any;
  sourceIdSegmentDropdown: any;
  numberTypeValue: string = '';
  typeOfNumberLabelValue: string = '';
  segmentChangeFlag: boolean = false;
  flightChange: any;
  awbInputFlag: boolean = false;
  reportParameters: any = new Object();
  response: any;
  @ViewChild("report") report: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private importService: ImportService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.customColspan = 9;
    }
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null) {
      if (forwardedData.flightNumber != null && forwardedData.flightNumber != "" && forwardedData.flightDate != null && forwardedData.flightDate != "") {
        this.tracingBreakdownData.get('searchTracingData.flightId').setValue(forwardedData.flightNumber);
        this.tracingBreakdownData.get('searchTracingData.date').setValue(forwardedData.flightDate);
        this.onSearch();
      }
    }
  }

  private tracingBreakdownData: NgcFormGroup = new NgcFormGroup({
    searchTracingData: new NgcFormGroup({
      flightId: new NgcFormControl(),
      date: new NgcFormControl(),
      typeOfNumber: new NgcFormControl(),
      numberValue: new NgcFormControl(),
    }),


    tracingList: new NgcFormArray(
      [
      ]
    ),

    uldDetails: new NgcFormArray(
      [
        new NgcFormGroup({
          uldNumber: new NgcFormControl(),
          LocationDetails: new NgcFormControl(),
        })
      ]
    ),
    searchData: new NgcFormGroup({
      flightNumber: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      numberValue: new NgcFormControl(),
      status: new NgcFormControl(),
      segment: new NgcFormControl(),
      segmentDropDown: new NgcFormControl(),
    }),

  });

  public onSearch(): void {
    this.numberTypeValue = null;

    if (!this.segmentChangeFlag) {
      this.tracingBreakdownData.get('searchData.segmentDropDown').patchValue(null);
    }
    let tracingData = new BreakDownTracingFlightModel();
    tracingData.flightNumber = this.tracingBreakdownData.get("searchTracingData.flightId").value;
    tracingData.flightDate = this.tracingBreakdownData.get("searchTracingData.date").value;
    tracingData.flightSegmentId = this.segmentDropdownValue;
    this.sourceIdSegmentDropdown = this.createSourceParameter(
      tracingData.flightNumber,
      tracingData.flightDate
    );
    const tempData = this.tracingBreakdownData.get("searchTracingData.typeOfNumber").value;
    if (tracingData.flightNumber == null || tracingData.flightDate == null) {
      this.showErrorMessage('mandatory.field.not.empty');
      return;
    }
    if (tempData == "ULD / Trolley Number") {
      tracingData.uldNumber = this.tracingBreakdownData.get("searchTracingData.numberValue").value;
    } else if (tempData == "AWB Number") {
      tracingData.shipmentNumber = this.tracingBreakdownData.get("searchTracingData.numberValue").value;
    }

    if (tracingData.shipmentNumber || tracingData.uldNumber) {
      this.numberTypeValue = tempData;
    }


    //tracingData.shipmentNumber='61863638470';
    this.importService.getTracingList(tracingData).subscribe(data => {
      console.log(data);
      this.response = data.data;
      this.refreshFormMessages(data);
      if (data.messageList) {
        if (data.messageList[0] != null) {
          this.isBreakDownInformation = false;
        }
      }
      this.segmentInformation = [];
      this.uldLocationDetails = [];
      if (data.data) {
        if (data.data[0].shipments) {
          let previousSegment = null;
          for (let shipmentInfo of data.data[0].shipments) {
            if (shipmentInfo.origin != previousSegment) {
              shipmentInfo.segmentChange = true;
              previousSegment = shipmentInfo.origin;
            } else {
              shipmentInfo.segmentChange = false;
            }
            if (shipmentInfo.irregularityPiece) {
              shipmentInfo.irregularityPiece = shipmentInfo.irregularityCode + '(' + shipmentInfo.irregularityPiece + ')';
            }
          }
        }

        if (data.data[0].uldData) {
          for (let uld of data.data[0].uldData) {
            if (uld.uldNumber) {
              if (uld.uldNumber == 'Bulk') {
                uld.uldNumber = 'Loose';
              }
              let uldLevelInformation = Object.assign({}, null);
              uldLevelInformation['uldNumber'] = uld.uldNumber;
              uldLevelInformation['LocationDetails'] = uld.uldLocationDetails;
              this.uldLocationDetails.push(uldLevelInformation);
            }
          }
        }

      }

      if (this.uldLocationDetails.length == 0) {
        this.isULDInformation = false;
      } else {
        this.isULDInformation = true;
      }
      this.isBreakDownInformation = true;
      //
      if (data.data && data.data.length > 0) {
        this.tracingBreakdownData.get('searchData.flightNumber').setValue(data.data[0].flightkey);
        this.tracingBreakdownData.get('searchData.status').setValue(data.data[0].flightStatus);
        this.tracingBreakdownData.get('searchData.flightDate').setValue(this.tracingBreakdownData.get("searchTracingData.date").value);
        this.tracingBreakdownData.get('searchData.numberValue').setValue(this.tracingBreakdownData.get("searchTracingData.numberValue").value);
        this.tracingBreakdownData.get('tracingList').patchValue(data.data[0].shipments);
        this.tracingBreakdownData.get('uldDetails').patchValue(this.uldLocationDetails);
        this.tracingBreakdownData.get('searchData.segment').patchValue(data.data[0].segment);

      }
    }, (error) => {
      this.showErrorStatus(error);
    });
    this.segmentDropdownValue = null;
    this.segmentChangeFlag = false;


  }
  // value: string | number, rowData: any, level: any
  protected groupsRenderer = (value: any, rowData: any, level: any, groupData: any): any => {

    if (level == 1) {
      if (value != 'Loose Cargo') {
        let uldDamage = '';
        if (rowData.data && rowData.data.uldDamage == true || rowData.data.uldDamage === "true") {
          uldDamage = '(D)-';
        }
        return '&nbsp;&nbsp;&nbsp;&nbsp;' + value + uldDamage + '-' + rowData.data.handlingMode + '&nbsp;&nbsp;BD Start Time:' + rowData.data.breakDownStartDate +
          '&nbsp;&nbsp;BD Complete Time:' + rowData.data.breakDownEndDate + '&nbsp;&nbsp;User ID:' + rowData.data.breakDownDoneBy;
      } else {
        return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + value;
      }

    }
    else {
      if (!rowData.data.offload) {
        rowData.data.offload = 0;
      }
      if (!rowData.data.surplus) {
        rowData.data.surplus = 0;
      }
      if (!rowData.data.intact) {
        rowData.data.intact = 0;
      }
      if (!rowData.data.breakULD) {
        rowData.data.breakULD = 0;
      }
      if (!rowData.data.shortLand) {
        rowData.data.shortLand = 0;
      }
      if (!rowData.data.damage) {
        rowData.data.damage = 0;
      }
      if (!rowData.data.uldCount) {
        rowData.data.uldCount = 0;
      }
      return '&nbsp;' + value + '&nbsp;&nbsp;ULD -' + rowData.data.uldCount + '&nbsp;&nbsp;(INTACT-' + rowData.data.intact + '&nbsp&nbsp;BREAK-'
        + rowData.data.breakULD + '&nbsp;&nbsp;OFFLOAD-' + rowData.data.offload + '&nbsp;&nbsp;SURPLUS-' + rowData.data.surplus
        + '&nbsp;&nbsp;SHORTLAND-' + rowData.data.shortLand + '&nbsp;&nbsp;DAMAGE-' + rowData.data.damage + ')';
    }
  }

  public onSelectFlight(event): void {
    console.log(event);
  }

  public onSegmentChange(event) {
    if (event) {
      this.segmentDropdownValue = event;
      this.segmentDropDownReport = event;
    }
    else {
      this.segmentDropdownValue = null;
      this.segmentDropDownReport = null;
    }
    this.segmentChangeFlag = true;
    this.onSearch();
  }


  public ontypeOfNumberChange(event) {
    if (event.desc == "AWB Number") {
      this.typeOfNumberLabelValue = "g.awbNumber";
      this.awbInputFlag = true;
    }
    if (event.desc == "ULD / Trolley Number") {
      this.typeOfNumberLabelValue = "g.uldTrolleyNumber";
      this.awbInputFlag = false;
    }
  }

  public onBack(event) {
    this.navigateBack(this.tracingBreakdownData.getRawValue());
  }
  onPrint() {
    this.flightChange = this.reportParameters.FlightId;

    if (this.flightChange != this.response[0].flightId && this.flightChange != null && !this.segmentChangeFlag) {
      this.segmentDropDownReport = null;
    }
    this.reportParameters.FlightId = this.response[0].flightId;
    this.reportParameters.segmentId = this.response[0].flightId;
    this.reportParameters.flightSegmentId = parseInt(this.segmentDropDownReport);
    this.reportParameters.hawbHandlingFlag = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling);
    this.reportParameters.hawbInfoFlag = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBInfo);


    if (this.response[0].shipmentNumber && this.response[0].shipmentDate) {
      this.reportParameters.shipmentNumber = this.response[0].shipmentNumber;
      this.reportParameters.shipmentDate = this.response[0].shipmentDate;
    } else {
      this.reportParameters.shipmentNumber = null;
      this.reportParameters.shipmentDate = null;
    }
    if (this.response[0].uldNumber) {
      this.reportParameters.uldTrolley = this.response[0].uldNumber
    } else {
      this.reportParameters.uldTrolley = null;
    }
    this.reportParameters.loggedInUser = this.getUserProfile().userShortName;
    this.report.open();


  }

}
