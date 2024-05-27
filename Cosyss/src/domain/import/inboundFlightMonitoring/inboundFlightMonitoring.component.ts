
import {
  Component, OnInit, NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcFormArray, NgcDropDownListComponent, NgcWindowComponent, PageConfiguration, CellsRendererStyle, NgcReportComponent,NgcUtility } from 'ngc-framework';
import { ImportService } from '../import.service';
import { Validators } from '@angular/forms';
import { inboundFlightMonitoringSerach, inboundFlightMonitoringModel } from './../import.sharedmodel';
import { CellsStyleClass } from '../../../shared/shared.data';
@Component({
  selector: 'app-inboundFlightMonitoring',
  templateUrl: './inboundFlightMonitoring.component.html',
  styleUrls: ['./inboundFlightMonitoring.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class InboundFlightMonitoringComponent extends NgcPage implements OnInit {
  carrier: any;
  autoRefresh: any;
  response: any;
  reportParameters: any;
  @ViewChild('iWindow') iWindow: NgcWindowComponent;
  showTable: boolean = false;
  currentDate = new Date();
  defaultFromDate = new Date();
  defaultToDate = new Date();
  timeDiffrence: number;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  @ViewChild('reportWindow3') reportWindow3: NgcReportComponent;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }
  resp: any;
  carrierGroupCodeParam: any;
  carrierCode: any;
  private InboundFlightMonitoringSerach: NgcFormGroup = new NgcFormGroup({
    terminals: new NgcFormControl(),
    fromDate: new NgcFormControl(this.defaultFromDate),
    toDate: new NgcFormControl(this.defaultToDate),
    carrierGroup: new NgcFormControl(),
    acType: new NgcFormControl(),
    carrier: new NgcFormControl(),
    flight: new NgcFormControl('', [Validators.maxLength(8)]),
    date: new NgcFormControl(),
    auto: new NgcFormControl(false),
    InboundFlightMonitoringModel: new NgcFormArray([
      new NgcFormGroup({
        flight: new NgcFormControl(),
        date: new NgcFormControl(),
        lastBoardPoint: new NgcFormControl(),
        sta: new NgcFormControl(),
        eta: new NgcFormControl(),
        ata: new NgcFormControl(),
        acType: new NgcFormControl(),
        acRegistration: new NgcFormControl(),
        tth: new NgcFormControl(),
        rampStartDateTime: new NgcFormControl(),
        rampCompleteDateTime: new NgcFormControl(),
        documentStartDateTime: new NgcFormControl(),
        documentCompleteDateTime: new NgcFormControl(),
        breakdownStartDateTime: new NgcFormControl(),
        breakdownCompleteDateTime: new NgcFormControl(),
        flightCompleteDateTime: new NgcFormControl(),
        flightCloseDateTime: new NgcFormControl(),
        flightDiscrepancyListSentAt: new NgcFormControl(),
        flightStatus: new NgcFormControl(),
        nilCargo: new NgcFormControl(),
        cancelled: new NgcFormControl()
      })
    ])
  });



  ngOnInit() {
    super.ngOnInit();
    this.showTable = false;
    this.timeDiffrence = 4;
    this.defaultFromDate.setHours(this.currentDate.getHours() - this.timeDiffrence);
    this.defaultToDate.setHours(this.currentDate.getHours() + 8);
    const request: any = new inboundFlightMonitoringSerach
    this.importService.fetchSystemParam(request).subscribe(data => {
      this.response = data.data[0].value;
    });
  }
  // onCancel() {
  //   this.navigateTo(this.router, "/", null);
  // }
  // onClear(event): void {
  //   this.InboundFlightMonitoringSerach.reset();
  //   this.resetFormMessages();
  // }


  public rowCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    // let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    // console.log(rowData);
    // if (rowData.flightStatus == 0) {
    //   cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    //   cellsStyle.allowEdit = false;
    // }
    // if (rowData.flightStatus == 1) {
    //   cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    //   cellsStyle.allowEdit = false;
    // }
    // if (rowData.flightStatus == 2) {

    // }
    // return cellsStyle;
    return null;
  };

  onFlightChange() {
    if (<NgcFormControl>this.InboundFlightMonitoringSerach.get('flight').value) {
      (<NgcFormControl>this.InboundFlightMonitoringSerach.get('date')).setValidators(Validators.required);
    } else {
      (<NgcFormControl>this.InboundFlightMonitoringSerach.get('date')).clearValidators();
    }
  }

  onFromDateChange() {
    if (<NgcFormControl>this.InboundFlightMonitoringSerach.get('fromDate').value) {
      (<NgcFormControl>this.InboundFlightMonitoringSerach.get('toDate')).setValidators(Validators.required);
    } else {
      (<NgcFormControl>this.InboundFlightMonitoringSerach.get('toDate')).clearValidators();
    }
  }
  onCarierGroup(event) {
    this.carrierCode = event.desc;
    this.carrierGroupCodeParam = this.createSourceParameter(this.InboundFlightMonitoringSerach.get('carrierGroup').value);

  }

  getCarrierCodeByCarrierGroup(event) {
    this.carrier = event;
  }
  onSearch(event) {
    const request = this.InboundFlightMonitoringSerach.getRawValue();
    request['carrierGroup'] = this.carrierCode;
    // if(request.fromDate == this.defaultFromDate){
    //   request.fromDate = null;
    // }
    // if(request.toDate == this.defaultToDate){
    //   request.toDate = null;
    // }

    // Reset Form Messages Just Before Search
    this.resetFormMessages();
    // Service Call for Search
    this.importService.getOnSearchInboundFlightMonitoring(request).subscribe(response => {
      // Patch Value If Successful
      if (!this.showResponseErrorMessages(response)) {
        this.InboundFlightMonitoringSerach.get('InboundFlightMonitoringModel').patchValue(response.data);
        this.showTable = true;
      } else {
        this.showTable = false;
        this.showResponseErrorMessages(response);
      }
    }, error => {

      this.showErrorStatus(error);


    });





    //   if (response.success) {
    //     this.resetFormMessages();
    //     this.resp = response.data;
    //     this.InboundFlightMonitoringSerach.get('InboundFlightMonitoringModel').patchValue(this.resp);
    //     console.log(this.InboundFlightMonitoringSerach.getRawValue());
    //     this.showTable = true;
    //     console.log(response);
    //   } else {
    //     this.showTable = false;

    //     this.refreshFormMessages(response);
    //   }
    // });


    // }

  }


  onprintexcel() {
    this.reportParameters = new Object();


    if (this.InboundFlightMonitoringSerach.get('terminals').value) {
      this.reportParameters.terminals = this.InboundFlightMonitoringSerach.get('terminals').value;
    }
    if (this.InboundFlightMonitoringSerach.get('fromDate').value) {
      this.reportParameters.fromDate = this.InboundFlightMonitoringSerach.get('fromDate').value;
    }
    if (this.InboundFlightMonitoringSerach.get('toDate').value) {
      this.reportParameters.toDate = this.InboundFlightMonitoringSerach.get('toDate').value;
    }
    if (this.InboundFlightMonitoringSerach.get('carrierGroup').value) {
      this.reportParameters.carrierGroup = this.InboundFlightMonitoringSerach.get('carrierGroup').value;
    }
    if (this.InboundFlightMonitoringSerach.get('acType').value) {
      this.reportParameters.acType = this.InboundFlightMonitoringSerach.get('acType').value;
    }
    if (this.InboundFlightMonitoringSerach.get('carrier').value) {
      this.reportParameters.carrier = this.InboundFlightMonitoringSerach.get('carrier').value;
    }
    if (this.InboundFlightMonitoringSerach.get('flight').value) {
      this.reportParameters.flight = this.InboundFlightMonitoringSerach.get('flight').value;
    }
    if (this.InboundFlightMonitoringSerach.get('date').value) {
      this.reportParameters.date = this.InboundFlightMonitoringSerach.get('date').value;
    }

    this.reportWindow2.reportParameters = this.reportParameters;
    this.reportWindow2.downloadReport();
  }


  onprintPDF() {
    this.reportParameters = new Object();


    if (this.InboundFlightMonitoringSerach.get('terminals').value) {
      this.reportParameters.terminals = this.InboundFlightMonitoringSerach.get('terminals').value;
    }
    if (this.InboundFlightMonitoringSerach.get('fromDate').value) {
      this.reportParameters.fromDate = this.InboundFlightMonitoringSerach.get('fromDate').value;
    }
    if (this.InboundFlightMonitoringSerach.get('toDate').value) {
      this.reportParameters.toDate = this.InboundFlightMonitoringSerach.get('toDate').value;
    }
    if (this.InboundFlightMonitoringSerach.get('carrierGroup').value) {
      this.reportParameters.carrierGroup = this.InboundFlightMonitoringSerach.get('carrierGroup').value;
    }
    if (this.InboundFlightMonitoringSerach.get('acType').value) {
      this.reportParameters.acType = this.InboundFlightMonitoringSerach.get('acType').value;
    }
    if (this.InboundFlightMonitoringSerach.get('carrier').value) {
      this.reportParameters.carrier = this.InboundFlightMonitoringSerach.get('carrier').value;
    }
    if (this.InboundFlightMonitoringSerach.get('flight').value) {
      this.reportParameters.flight = this.InboundFlightMonitoringSerach.get('flight').value;
    }
    if (this.InboundFlightMonitoringSerach.get('date').value) {
      this.reportParameters.date = this.InboundFlightMonitoringSerach.get('date').value;
    }


    this.reportWindow3.downloadReport();
  }



  onAutoRefresh(event) {
    if (this.autoRefresh) {
      this.autoRefresh.unsubscribe();
      this.autoRefresh = null;
    }
    if (event === true) {
      this.autoRefresh = this.getTimer(this.response).subscribe(data => {
        this.onSearch(event);
      });

    }
  }
}


