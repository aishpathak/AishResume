import { WorkingList, ExportFlight, FlightSegment } from './../export.sharedmodel';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcUtility, NgcWindowComponent, NgcButtonComponent, PageConfiguration, NgcReportComponent } from 'ngc-framework';

@Component({
  selector: 'ngc-snapshotworkinglist',
  templateUrl: './snapshotworkinglist.component.html',
  styleUrls: ['./snapshotworkinglist.component.scss']
})
@PageConfiguration({
  trackInit: true,
  //callNgOnInitOnClear: true,
  // autoBackNavigation: true
})
export class SnapshotworkinglistComponent extends NgcPage {
  reportParameters: any;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  data: any;
  dateArray: any[];
  dateObj: any;
  segmentObj: any;
  dateString: string;
  titleObj: string;
  sqCarrier = false;
  colorMapping = {
    'SS': {
      textColor: 'white',
      bgColor: 'green'
    },
    'Removed': {
      textColor: 'black',
      bgColor: 'gray'
    },
    'Modified': {
      textColor: 'black',
      bgColor: 'gray'
    },
    'Cancelled': {
      textColor: 'black',
      bgColor: 'gray'
    },
    'SB': {
      textColor: 'black',
      bgColor: 'yellow'
    },
    'UU': {
      textColor: 'white',
      bgColor: 'gray'
    },
    'EM': {
      textColor: 'white',
      bgColor: 'red'
    },
    'XX': {
      textColor: 'white',
      bgColor: 'red'
    },
    'TT': {
      textColor: 'white',
      bgColor: 'gray'
    }

  };
  private snapshotForm: NgcFormGroup = new NgcFormGroup({
    flightNo: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    snapshotSegment: new NgcFormControl(),
    aliTotalOne: new NgcFormControl(),
    aliTotalTwo: new NgcFormControl(),
    aliUsedOne: new NgcFormControl(),
    aliUsedTwo: new NgcFormControl(),
    aliCargoOne: new NgcFormControl(),
    aliCargoTwo: new NgcFormControl(),
    aliRemainingOne: new NgcFormControl(),
    aliRemainingTwo: new NgcFormControl(),
    aircraftType: new NgcFormControl(),
    aircraftRegistration: new NgcFormControl(),
    bookingChangesList: new NgcFormArray([]),
    shimentLoadingList: new NgcFormArray([]),


  })

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.data = this.getNavigateData(this.activatedRoute);
    this.titleObj = 'Snapshot Version ' + this.data.segments[0].snapShotVersion + ' ' + NgcUtility.getDateTimeAsString(this.data.segments[0].snapshotDateTime);
    this.sqCarrier = this.data.sqCarrier;
    let exportFlight: ExportFlight = new ExportFlight();
    exportFlight = this.data.flight;
    let viewSnapshotSegment: FlightSegment = new FlightSegment();
    viewSnapshotSegment = this.data.segments[0];
   
    for (let entry of viewSnapshotSegment.bookingChanges) {
     
      for (let iter = 1; iter < 10; iter++) {
        if (iter === 1) {
          entry.shc1 = entry['shc' + iter]
        } else if (entry['shc' + iter]) {

          entry.shc1 += ' ' + entry['shc' + iter];
        }
      }
    }
    this.segmentObj = viewSnapshotSegment.flightBoardingPoint + '-' + viewSnapshotSegment.flightOffPoint;
    this.snapshotForm.get('snapshotSegment').setValue(this.segmentObj);
    (<NgcFormArray>this.snapshotForm.controls['shimentLoadingList']).patchValue(viewSnapshotSegment.shipmentList);
    (<NgcFormArray>this.snapshotForm.controls['bookingChangesList']).patchValue(viewSnapshotSegment.bookingChanges);
    (<NgcFormGroup>this.snapshotForm).patchValue(exportFlight);
  }

  /*This function is to convert the date into the specified format
 */
  public convertToMMM(month: string) {
    switch (month) {
      case '01':
        return 'JAN';
      case '02':
        return 'FEB';
      case '03':
        return 'MAR';
      case '04':
        return 'APR';
      case '05':
        return 'MAY';
      case '06':
        return 'JUN';
      case '07':
        return 'JUL';
      case '08':
        return 'AUG';
      case '09':
        return 'SEP';
      case '10':
        return 'OCT';
      case '10':
        return 'NOV';
      case '12':
        return 'DEC';
    }
  }

  public getShapeColor(code, attribute) {
    const codeColorData = this.colorMapping[code];
    return codeColorData ? codeColorData[attribute] : this.colorMapping['Removed'][attribute];
  }

  onCancel(event) {
    let flightDate = this.snapshotForm.get('std').value;
    if (flightDate === null) {
      flightDate = this.snapshotForm.get('flightDate').value
    }
    let transferData: any = { 'flightNo': this.snapshotForm.get('flightNo').value, 'flightDate': flightDate };
    if (this.data.mode === 'expwrknglstnew') {
      this.navigateTo(this.router, '/export/exportworkinglist', transferData);
    } else {
      this.navigateTo(this.router, '/export/workinglist', transferData);
    }
  }

  onPrint() {
    this.reportParameters = new Object();
    this.reportParameters.tenantId = NgcUtility.getTenantConfiguration().airportCode;
    this.reportParameters.flightKey = this.snapshotForm.get('flightNo').value;
    this.reportParameters.flightDate = this.snapshotForm.get('flightDate').value;
    this.reportParameters.loggedinID = this.getUserProfile().userLoginCode;
    this.reportParameters.version = this.data.segments[0].snapShotVersion;
    if (this.sqCarrier) {
      this.reportParameters.flagToShow = "1";
      this.reportParameters.sqcarrierflag = "1";
    }
    else {
      this.reportParameters.flagToShow = "0";
      this.reportParameters.sqcarrierflag = "0";
    }


    this.reportWindow.open();



  }
}
