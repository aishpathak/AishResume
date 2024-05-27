import { CellsStyleClass } from './../../../../shared/shared.data';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { EventsService } from '../events.service';
import { Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcUtility, DateTimeKey, PageConfiguration, CellsRendererStyle, NgcWindowComponent, NgcDataTableComponent } from 'ngc-framework';
import { FlightInfo, DBoardBatchLog } from '../events.sharedmodel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-import-FlightEVM',
  templateUrl: './import-FlightEVM-DashboardTV.component.html',
  styleUrls: ['./import-FlightEVM-DashboardTV.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  dashboard: true
})
export class ImportFlightEVMDashboardTVComponent extends NgcPage implements OnInit {
  dateTo: any;
  showTableFlag: any;
  dashboardBatchLogId: any;
  systemDate: any;
  lastJobRun: any;
  nextJobRun: any;
  pageNumber: number;
  autoPaginationInSec: number;

  impShipManifDG: boolean = false;
  impShipManifXPS: boolean = false;
  impShipManifRAC: boolean = false;
  impShipManifPIL: boolean = false;
  impShipManifVAL: boolean = false;
  impShipManifAVI: boolean = false;
  impShipManifHUM: boolean = false;
  impShipManifOTH: boolean = false;
  impFLTPouchReceived: boolean = false;

  @ViewChild('dashboardDataTable') dashboardDataTable: NgcDataTableComponent;
  private autoRefreshSubscription: Subscription;
  private dataRefreshSubscription: Subscription;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private userService: EventsService) {
    super(appZone, appElement, appContainerElement);
    // this.functionId = "PLAYGROUND";
  }

  ngOnInit() {
    super.ngOnInit();
    this.refreshDashboard();
    //this.autoRefreshChange(this.importFlightEVM.get('auto').value);
  }

  public importFlightEVM: NgcFormGroup = new NgcFormGroup({
    auto: new NgcFormControl(true),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    requestTerminal: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    autoRefresh: new NgcFormControl(true),
    importFlightList: new NgcFormArray([
    ])
  });


  ngAfterViewInit() {
    //  this.onSwitchChange(this.importFlightEVM.get('auto').value);
    this.importFlightEVM.controls['fromDate'].valueChanges.subscribe(data => {
      this.dateTo = NgcUtility.getDateOnly(this.importFlightEVM.get('fromDate').value);
    });
  }

  public fetchImportFlightInfo() {
    let flightDates: FlightInfo = new FlightInfo();
    flightDates.fromDate = this.importFlightEVM.get('fromDate').value;
    flightDates.toDate = this.importFlightEVM.get('toDate').value;
    flightDates.carrierGroup = this.importFlightEVM.get('carrierGroup').value;
    flightDates.requestTerminal = this.importFlightEVM.get('requestTerminal').value;
    flightDates.flightKey = this.importFlightEVM.get('flightKey').value;
    this.userService.getSlaDashBoardTVImport(flightDates).subscribe(data => {
      this.refreshFormMessages(data);
      if (!this.showResponseErrorMessages(data)) {
        if (data.data.importList && data.data.importList.length > 0) {
          this.showTableFlag = true;
          this.dashboardBatchLogId = data.data.dashboardBatchLogId;
          this.lastJobRun = data.data.latestJobStartedOn;
          this.nextJobRun = data.data.nextFireTime;
          this.autoPaginationInSec = data.data.pageRefreshTimeSec;
          console.log("current DashboardImportBatchLogId: " + data.data.dashboardBatchLogId);
          (<NgcFormArray>this.importFlightEVM.get('importFlightList')).patchValue(data.data.importList);
          (<NgcFormArray>this.importFlightEVM.get('importFlightList')).controls.forEach(element => {
            this.impShipManifDG = element.get('impShipManifDG').value;
            this.impShipManifXPS = element.get('impShipManifXPS').value;
            this.impShipManifRAC = element.get('impShipManifRAC').value;
            this.impShipManifPIL = element.get('impShipManifPIL').value;
            this.impShipManifVAL = element.get('impShipManifVAL').value;
            this.impShipManifAVI = element.get('impShipManifAVI').value;
            this.impShipManifHUM = element.get('impShipManifHUM').value;
            this.impShipManifOTH = element.get('impShipManifOTH').value;
            this.impFLTPouchReceived = element.get('impFLTPouchReceived').value;
          });
        } else {
          this.showErrorStatus('warehouse.norecordfound');
          (<NgcFormArray>this.importFlightEVM.get('importFlightList')).patchValue([]);
          this.showTableFlag = false;
        }
        this.autoRefreshChange(this.importFlightEVM.get('auto').value);
      } else {
        this.showTableFlag = false;
      }
    }, error => {
      this.showErrorStatus('g.unable.to.contact.server');
      this.showTableFlag = false;
    })

  }

  private flightDateCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    cellsStyle.data = rowData.flightDate.substring(0, 2) + "<br>" + rowData.flightDate.substring(2, 5);
    return cellsStyle;
  };

  private dateETACellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.flightDateChangeETA && null !== rowData.flightDateChangeETA && "" !== rowData.flightDateChangeETA) {
      cellsStyle.data = rowData.dateStaEta + rowData.flightDateChangeETA;
      cellsStyle.className = CellsStyleClass.INFO_BLUE;
    } else if (null == rowData.dateStaEta) {
      cellsStyle.data = "";
    } else {
      cellsStyle.data = rowData.dateStaEta;
    }
    return cellsStyle;
  };

  private bayCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.bayColor === "BLUE") {
      cellsStyle.className = CellsStyleClass.INFO_BLUE;
    } else if (rowData.bayColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    }
    return cellsStyle;
  };

  private dateATACellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.flightDateChangeATA && null !== rowData.flightDateChangeATA && "" !== rowData.flightDateChangeATA) {
      cellsStyle.data = rowData.dateATA + rowData.flightDateChangeATA;
      cellsStyle.className = CellsStyleClass.INFO_BLUE;
    } else if (null == rowData.dateATA) {
      cellsStyle.data = "";
    } else {
      cellsStyle.data = rowData.dateATA;
    }
    return cellsStyle;
  };

  private ffmCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.ffmColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.ffmColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.ffmColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };
  private towinCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.towinRampSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.towinRampSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.towinRampSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private docRecvCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.docReceivedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.docReceivedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.docReceivedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private bdCompCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.bdCompletedColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.bdCompletedColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.bdCompletedColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private bdCompDtTimCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    cellsStyle.data = rowData.bdCompDatTime;
    return cellsStyle;
  };

  private fdlTrigCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.fdlTriggeredColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.fdlTriggeredColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.fdlTriggeredColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private svcRptFinCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.svcRptFinalizedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.svcRptFinalizedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.svcRptFinalizedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private msDgCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.msDgSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.msDgSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.msDgSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private msXpsCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.msXpsSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.msXpsSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.msXpsSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private msRacCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.msRacSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.msRacSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.msRacSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private msPilCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.msPilSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.msPilSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.msPilSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private msValCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.msValSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.msValSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.msValSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private msAviCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.msAviSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.msAviSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.msAviSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private msHumCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.msHumSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.msHumSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.msHumSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private msOthCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.msOthSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.msOthSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.msOthSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  /**
* Refresh
*/
  private refreshDashboard() {
    this.fetchImportFlightInfo();
  }

  autoRefreshChange(event) {
    this.unsubscribeAutoRefresh();

    if (event === true) {
      // Auto pagination configured the seconds from backend
      this.autoRefreshSubscription = this.getTimer(this.autoPaginationInSec > 0 ? this.autoPaginationInSec : 10000).subscribe((data) => {
        if (this.dashboardDataTable.getTotalPages() > 1) {
          if (this.pageNumber === this.dashboardDataTable.getTotalPages()) {
            this.pageNumber = 0;
            this.dashboardDataTable.goToPage(this.pageNumber);
          } else {
            if (isNaN(this.pageNumber)) this.pageNumber = 0;
            this.pageNumber = this.pageNumber + 1;
            this.dashboardDataTable.goToPage(this.pageNumber);
          }
        }
      });

      // to run every 30 sec to check latest import records exist or not.
      // if exist fetch new records. else no fetch just return false.
      this.dataRefreshSubscription = this.getTimer(30000).subscribe(data => {
        this.checkLatestRecordsImport();
      });
    }
  }

  private unsubscribeAutoRefresh() {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
    }
    if (this.dataRefreshSubscription) {
      this.dataRefreshSubscription.unsubscribe();
      this.dataRefreshSubscription = null;
    }
  }

  public checkLatestRecordsImport() {
    if (null !== this.dashboardBatchLogId) {
      let dboardBatchLog: DBoardBatchLog = new DBoardBatchLog();
      dboardBatchLog.dashboardBatchLogId = this.dashboardBatchLogId;
      this.userService.getLatestDboardRecImport(dboardBatchLog).subscribe(responseBean => {
        if (responseBean.data.latestRecordsExist) {
          this.fetchImportFlightInfo();
        }
      })
    }
  }

  setSystemDateAndTime() {
    var objDate = new Date();
    this.systemDate = ("0" + objDate.getDate()).slice(-2) + "-"
      + objDate.toLocaleString("en-us", { month: "short" }).toUpperCase() + "-"
      + objDate.getFullYear() + " " // .toString().substr(2)
      + ('0' + objDate.getHours()).slice(-2)
      + ":" + ('0' + objDate.getMinutes()).slice(-2);
    + ":" + objDate.getSeconds();
  }


  /**
    * Cells Renderer
    * @param value Value
    * @param rowData Row Data
    * @param level Level
    */
  public cellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
    if (column === 'ffmColor') {
      if ("AMBER" === rowData.ffmColor) {
        rowData.ffmColor = "YELLOW";
      }
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.ffmColor} " />
                </svg>
            </div>
            `
    }
    else if (column === 'bdCompletedColor') {
      if ("AMBER" === rowData.bdCompletedColor) {
        rowData.bdCompletedColor = "YELLOW";
      }
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.bdCompletedColor} " />
                </svg>
            </div>
            `
    }
    else if (column === 'fdlTriggeredColor') {
      if ("AMBER" === rowData.fdlTriggeredColor) {
        rowData.fdlTriggeredColor = "YELLOW";
      }
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.fdlTriggeredColor} " />
                </svg>
            </div>
            `
    } else if (column == 'inboundFLTPouchReceivedColor') {
      if ("AMBER" === rowData.inboundFLTPouchReceivedColor) {
        rowData.inboundFLTPouchReceivedColor = "YELLOW";
      }
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.inboundFLTPouchReceivedColor} " />
                </svg>
            </div>
            `
    }
  };

}