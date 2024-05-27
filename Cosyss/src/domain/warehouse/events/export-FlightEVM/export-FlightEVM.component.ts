import { CellsStyleClass } from './../../../../shared/shared.data';
import { NgcFormGroup, NgcFormControl, NgcFormArray, NgcPage, NgcUtility, DateTimeKey, CellsRendererStyle, PageConfiguration, NgcWindowComponent } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../events.service';
import { FlightInfo } from '../events.sharedmodel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-export-FlightEVM',
  templateUrl: './export-FlightEVM.component.html',
  styleUrls: ['./export-FlightEVM.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true

})
export class ExportFlightEVMComponent extends NgcPage implements OnInit {
  dateTo: any;
  showTableFlag: any;
  @ViewChild('outBoundTable') selectWindow: NgcWindowComponent;
  private autoRefreshSubscription: Subscription;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private userService: EventsService) {
    super(appZone, appElement, appContainerElement);
    // this.functionId = "PLAYGROUND";
  }

  ngOnInit() {
    this.refreshDashboard();
    this.onSwitchChange(this.exportFlightEVM.get('auto').value);
  }

  public exportFlightEVM: NgcFormGroup = new NgcFormGroup({
    auto: new NgcFormControl(true),
    fromDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 1, DateTimeKey.MINUTES)),
    toDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), (24 * 60) - 1, DateTimeKey.MINUTES)),
    carrierGroup: new NgcFormControl(),
    requestTerminal: new NgcFormControl(),
    manfiestCompYesNo: new NgcFormControl('BOTH'),
    rampCompYesNo: new NgcFormControl('BOTH'),
    dlsFinalizedYesNo: new NgcFormControl('BOTH'),
    flightCompYesNo: new NgcFormControl('BOTH'),
    ucmSentYesNo: new NgcFormControl('BOTH'),
    exportFlightList: new NgcFormArray([
    ])
  });


  ngAfterViewInit() {
    this.exportFlightEVM.controls['fromDate'].valueChanges.subscribe(data => {
      this.dateTo = NgcUtility.getDateOnly(this.exportFlightEVM.get('fromDate').value);
    });
  }

  public fetchExportFlightInfo() {
    let flightDates: FlightInfo = new FlightInfo();
    flightDates.fromDate = this.exportFlightEVM.get('fromDate').value;
    flightDates.toDate = this.exportFlightEVM.get('toDate').value;
    flightDates.carrierGroup = this.exportFlightEVM.get('carrierGroup').value;
    flightDates.requestTerminal = this.exportFlightEVM.get('requestTerminal').value;
    flightDates.manfiestCompYesNo = this.exportFlightEVM.get('manfiestCompYesNo').value;
    flightDates.dlsFinalizedYesNo = this.exportFlightEVM.get('dlsFinalizedYesNo').value;
    flightDates.rampCompYesNo = this.exportFlightEVM.get('rampCompYesNo').value;
    flightDates.flightCompYesNo = this.exportFlightEVM.get('flightCompYesNo').value;
    flightDates.ucmSentYesNo = this.exportFlightEVM.get('ucmSentYesNo').value;
    this.userService.fetchOutboundFlightInfo(flightDates).subscribe(data => {
      this.refreshFormMessages(data);
      if (!this.showResponseErrorMessages(data)) {
        if (data.data && data.data.length > 0) {
          this.showTableFlag = true;
          (<NgcFormArray>this.exportFlightEVM.get('exportFlightList')).patchValue(data.data);
        } else {
          this.showErrorStatus('warehouse.norecordfound');
          (<NgcFormArray>this.exportFlightEVM.get('exportFlightList')).patchValue([]);
          this.showTableFlag = false;
        }
      } else {
        this.showTableFlag = false;
      }
    }, error => {
      this.showErrorStatus('g.unable.to.contact.server');
      this.showTableFlag = false;
    })
  }

  private rampCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.rampReleaseSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.rampReleaseSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.rampReleaseSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  };


  public loadCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.readyToLoad === null && rowData.bookedPiecs === null) {
      cellsStyle.data = 0 + '/' + 0;
      cellsStyle.allowEdit = false;
    }
    if (rowData.readyToLoad === null && rowData.bookedPiecs !== null) {
      cellsStyle.data = 0 + '/' + rowData.bookedPiecs;
      cellsStyle.allowEdit = true;
    }
    if (rowData.readyToLoad !== null && rowData.bookedPiecs === null) {
      cellsStyle.data = rowData.readyToLoad + '/' + 0;
      cellsStyle.allowEdit = true;
    }
    if (rowData.readyToLoad !== null && rowData.bookedPiecs !== null) {
      cellsStyle.data = rowData.readyToLoad + '/' + rowData.bookedPiecs;
      cellsStyle.allowEdit = true;
    }
    //
    // if (rowData.indicator === "RED") {
    //   cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    // } else if (rowData.indicator === "GREEN") {
    //   cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    // } else if (rowData.indicator === "AMBER") {
    //   cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    // }
    return cellsStyle;
  };

  public onLinkClick(event) {
    let record = event.record;
    let navigateObj = {
      flightKey: record.flightKey,
      flightOriginDate: record.flightDate
    }
    this.navigateTo(this.router, '/export/exportworkinglist', navigateObj);
  }


  //method to dispaly event specific color code 
  private buildUpCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //cellsStyle.data = rowData.actualULD + '/' + rowData.manifestedULD;
    /*    if (rowData.buildUpCompletedAt) {
          // cellsStyle.data = rowData.buildUpCompleted + '(' + NgcUtility.getDateTimeAsString(NgcUtility.getDateTime(rowData.buildUpCompletedAt)) + ')';
          cellsStyle.data = 'YES'
        } else {
          cellsStyle.data = 'NO'
        }*/
    if (rowData.buildUpCompletedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.buildUpCompletedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.buildUpCompletedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }

    return cellsStyle;
  };
  //method to dispaly event specific color code 
  private manifestCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //cellsStyle.data = rowData.actualULD + '/' + rowData.manifestedULD;
    /*    if (rowData.manifestCompletedAt) {
          //cellsStyle.data = rowData.manifestCompleted + '(' + NgcUtility.getDateTimeAsString(NgcUtility.getDateTime(rowData.manifestCompletedAt)) + ')';
          cellsStyle.data = 'YES'
        } else {
          cellsStyle.data = 'NO'
        }*/
    if (rowData.manifestCompletedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.manifestCompletedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.manifestCompletedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  };
  //method to dispaly event specific color code 
  private dlsCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //cellsStyle.data = rowData.actualULD + '/' + rowData.manifestedULD;
    /*    if (rowData.dlsFinalizedAt) {
          // cellsStyle.data = rowData.dlsFinalized + '(' + NgcUtility.getDateTimeAsString(NgcUtility.getDateTime(rowData.dlsFinalizedAt)) + ')';
          cellsStyle.data = 'YES'
        } else {
          cellsStyle.data = 'NO'
        }*/
    if (rowData.dlsFinalizedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.dlsFinalizedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.dlsFinalizedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  };
  //method to dispaly event specific color code 
  private notocCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //cellsStyle.data = rowData.actualULD + '/' + rowData.manifestedULD;
    /*    if (rowData.notocFinalizedDate) {
          // cellsStyle.data = rowData.notocFinalized + '(' + NgcUtility.getDateTimeAsString(NgcUtility.getDateTime(rowData.notocFinalizedDate)) + ')';
          cellsStyle.data = 'YES'
        } else {
          cellsStyle.data = 'NO'
        }*/
    if (rowData.notocFinalizedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.notocFinalizedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.notocFinalizedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  };
  //method to dispaly event specific color code 
  private flightCompletedCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //cellsStyle.data = rowData.actualULD + '/' + rowData.manifestedULD;
    /*    if (rowData.flightCompletedAt) {
          // cellsStyle.data = rowData.flightCompleted + '(' + NgcUtility.getDateTimeAsString(NgcUtility.getDateTime(rowData.flightCompletedAt)) + ')';
          cellsStyle.data = 'YES'
        } else {
          cellsStyle.data = 'NO'
        }*/
    if (rowData.flightCompletedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.flightCompletedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.flightCompletedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  };


  private otwdSrvcRptCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //cellsStyle.data = rowData.actualULD + '/' + rowData.manifestedULD;
    /*    if (rowData.otwdSrvcRptFinalizedAt) {
          // cellsStyle.data = rowData.otwdSrvcRptFinalized + '(' + NgcUtility.getDateTimeAsString(NgcUtility.getDateTime(rowData.otwdSrvcRptFinalizedAt)) + ')';
          cellsStyle.data = 'YES'
        } else {
          cellsStyle.data = 'NO'
        }*/
    if (rowData.otwdSrvcRptFinalizedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.otwdSrvcRptFinalizedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.otwdSrvcRptFinalizedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  };

  private ucmSentCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.ucmSentSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.ucmSentSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.ucmSentSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  };

  private pouchCompCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.pouchCompletedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.pouchCompletedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.pouchCompletedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  };

  /**
  * On SwitchChange
  */
  public onSwitchChange(event) {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
    }
    if (event === true) {
      this.autoRefreshSubscription = this.getTimer(900000).subscribe((data) => {
        this.refreshDashboard();
      });
    }
  }

  /**
  * Refresh
  */
  private refreshDashboard() {
    this.fetchExportFlightInfo();
  }
}

