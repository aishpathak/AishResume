import { CellsStyleClass } from '../../../../shared/shared.data';
import { NgcFormGroup, NgcFormControl, NgcFormArray, NgcPage, NgcUtility, DateTimeKey, CellsRendererStyle, PageConfiguration, NgcDataTableComponent, NgcWindowComponent } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BuildupService } from '../buildup.service';
import { FlightInfo, DBoardBatchLog } from '../buildup.sharedmodel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-special-cargo-flight-dashboard',
  templateUrl: './special-cargo-flight-dashboard.component.html',
  styleUrls: ['./special-cargo-flight-dashboard.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  dashboard: true
})
export class SpecialCargoFlightDashboardComponent extends NgcPage implements OnInit {
  dateTo: any;
  showTableFlag: any;
  dashboardBatchLogId: any;
  systemDate: any;
  lastJobRun: any;
  nextJobRun: any;
  searchOptionsOn: boolean = true;
  pageNumber: number;
  autoPaginationInSec: number;
  //new
  shcGroup: any;

  expShipAccptDG: boolean = false;
  expShipAccptXPS: boolean = false;
  expShipAccptRAC: boolean = false;
  expShipAccptPIL: boolean = false;
  expShipAccptVAL: boolean = false;
  expShipAccptAVI: boolean = false;
  expShipAccptHUM: boolean = false;
  expShipAccptOTH: boolean = false;
  expShipAssgnDG: boolean = false;
  expShipAssgnXPS: boolean = false;
  expShipAssgnRAC: boolean = false;
  expShipAssgnPIL: boolean = false;
  expShipAssgnVAL: boolean = false;
  expShipAssgnAVI: boolean = false;
  expShipAssgnHUM: boolean = false;
  expShipAssgnOTH: boolean = false;
  expShipAssgnTRS: boolean = false;

  @ViewChild('dashboardDataTable') dashboardDataTable: NgcDataTableComponent;
  private autoRefreshSubscription: Subscription;
  private dataRefreshSubscription: Subscription;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private userService: BuildupService) {
    super(appZone, appElement, appContainerElement);
    this.setSystemDateAndTime();
    this.searchOptionsOn = false;
  }

  ngOnInit() {
    super.ngOnInit();
    //
    this.refreshDashboard();
    // this.autoRefreshChange(this.exportFlightEVM.get('auto').value);
  }

  public exportFlightEVM: NgcFormGroup = new NgcFormGroup({
    auto: new NgcFormControl(true),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    requestTerminal: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    shcGroup: new NgcFormControl(),
    autoRefresh: new NgcFormControl(true),
    exportFlightList: new NgcFormArray([
    ])
  });


  ngAfterViewInit() {
    this.exportFlightEVM.controls['fromDate'].valueChanges.subscribe(data => {
      this.dateTo = NgcUtility.getDateOnly(this.exportFlightEVM.get('fromDate').value);
    });
  }

  public fetchExportFlightInfo() {
    if (this.showTableFlag != true && !this.exportFlightEVM.get('shcGroup').value) {
      this.exportFlightEVM.get('shcGroup').patchValue('DG');
    }
    console.log(this.exportFlightEVM.get('shcGroup').invalid);
    if (this.exportFlightEVM.get('shcGroup').invalid) {
      return this.showErrorStatus('expaccpt.input.all.mandatory.details');
      // this.showWarningStatus('fill details');
    }

    let flightDates: FlightInfo = new FlightInfo();
    flightDates.fromDate = this.exportFlightEVM.get('fromDate').value;
    flightDates.toDate = this.exportFlightEVM.get('toDate').value;
    flightDates.carrierGroup = this.exportFlightEVM.get('carrierGroup').value;
    flightDates.requestTerminal = this.exportFlightEVM.get('requestTerminal').value;
    flightDates.flightKey = this.exportFlightEVM.get('flightKey').value;
    //new
    flightDates.shcGroup = this.exportFlightEVM.get('shcGroup').value;
    this.shcGroup = flightDates.shcGroup;

    this.userService.getExportFlights(flightDates).subscribe(data => {
      this.refreshFormMessages(data);
      if (!this.showResponseErrorMessages(data)) {

        if (data.data.exportList && data.data.exportList.length > 0) {
          this.showTableFlag = true;
          this.dashboardBatchLogId = data.data.dashboardBatchLogId;
          this.lastJobRun = data.data.latestJobStartedOn;
          this.nextJobRun = data.data.nextFireTime;
          this.autoPaginationInSec = data.data.pageRefreshTimeSec;
          console.log("current DashboardExportBatchLogId: " + data.data.dashboardBatchLogId);
          (<NgcFormArray>this.exportFlightEVM.get('exportFlightList')).patchValue(data.data.exportList);
          (<NgcFormArray>this.exportFlightEVM.get('exportFlightList')).controls.forEach(element => {
            this.expShipAccptDG = element.get('expShipAccptDG').value;
            this.expShipAccptXPS = element.get('expShipAccptXPS').value;
            this.expShipAccptRAC = element.get('expShipAccptRAC').value;
            this.expShipAccptPIL = element.get('expShipAccptPIL').value;
            this.expShipAccptVAL = element.get('expShipAccptVAL').value;
            this.expShipAccptAVI = element.get('expShipAccptAVI').value;
            this.expShipAccptHUM = element.get('expShipAccptHUM').value;
            this.expShipAccptOTH = element.get('expShipAccptOTH').value;
            this.expShipAssgnDG = element.get('expShipAssgnDG').value;
            this.expShipAssgnXPS = element.get('expShipAssgnXPS').value;
            this.expShipAssgnRAC = element.get('expShipAssgnRAC').value;
            this.expShipAssgnPIL = element.get('expShipAssgnPIL').value;
            this.expShipAssgnVAL = element.get('expShipAssgnVAL').value;
            this.expShipAssgnAVI = element.get('expShipAssgnAVI').value;
            this.expShipAssgnHUM = element.get('expShipAssgnHUM').value;
            this.expShipAssgnOTH = element.get('expShipAssgnOTH').value;
            this.expShipAssgnTRS = element.get('expShipAssgnTRS').value;
          });
        } else {
          this.showErrorStatus('warehouse.norecordfound');
          (<NgcFormArray>this.exportFlightEVM.get('exportFlightList')).patchValue([]);
          this.showTableFlag = false;
        }
        this.autoRefreshChange(this.exportFlightEVM.get('auto').value);
      } else {
        this.showTableFlag = false;
      }
    }, error => {
      this.showErrorStatus('g.unable.to.contact.server');
      this.showTableFlag = false;
    })
  }


  public onLinkClick(event) {
    let record = event.record;
    let navigateObj = {
      flightKey: record.flightKey,
      flightOriginDate: record.flightDate
    }
    this.navigateTo(this.router, '/export/exportworkinglist', navigateObj);
  }

  private flightDateCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    cellsStyle.data = rowData.flightDate.substring(0, 2) + "<br>" + rowData.flightDate.substring(2, 5);
    return cellsStyle;
  };

  private dateETDCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.flightDateChangeETD && null !== rowData.flightDateChangeETD && "" !== rowData.flightDateChangeETD) {
      cellsStyle.data = rowData.dateStdEtd + rowData.flightDateChangeETD;
      cellsStyle.className = CellsStyleClass.INFO_BLUE;
    } else if (null == rowData.dateStdEtd) {
      cellsStyle.data = "";
    } else {
      cellsStyle.data = rowData.dateStdEtd;
    }
    return cellsStyle;
  };


  private aircraftRegCodeCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.aircraftRegCodeColor === "BLUE") {
      cellsStyle.className = CellsStyleClass.INFO_BLUE;
    } else if (rowData.aircraftRegCodeColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
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

  private dateATDCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.flightDateChangeATD && null !== rowData.flightDateChangeATD && "" !== rowData.flightDateChangeATD) {
      cellsStyle.data = rowData.dateATD + rowData.flightDateChangeATD;
      cellsStyle.className = CellsStyleClass.INFO_BLUE;
    } else if (null == rowData.dateATD) {
      cellsStyle.data = "";
    } else {
      cellsStyle.data = rowData.dateATD;
    }
    return cellsStyle;
  };

  private shpAccDgCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAccDgSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAccDgSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAccDgSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private shpAccXpsCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAccXpsSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAccXpsSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAccXpsSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };
  private shpAccRacCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAccRacSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAccRacSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAccRacSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private shpAccPilCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAccPilSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAccPilSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAccPilSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private shpAccValCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAccValSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAccValSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAccValSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private shpAccAviCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAccAviSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAccAviSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAccAviSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private shpAccHumCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAccHumSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAccHumSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAccHumSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private shpAccOthCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAccOthSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAccOthSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAccOthSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private shpAssDgCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAssDgSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAssDgSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAssDgSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private shpAssXpsCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAssXpsSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAssXpsSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAssXpsSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private shpAssRacCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAssRacSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAssRacSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAssRacSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private shpAssPilCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAssPilSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAssPilSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAssPilSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private shpAssValCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAssValSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAssValSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAssValSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private shpAssAviCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAssAviSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAssAviSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAssAviSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private shpAssHumCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAssHumSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAssHumSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAssHumSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private shpAssOthCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.shpAssOthSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.shpAssOthSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.shpAssOthSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private lcDlsUPdCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.loadCtrlDLSUpdateSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.loadCtrlDLSUpdateSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.loadCtrlDLSUpdateSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private lcNotocFinCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    cellsStyle.data = rowData.loadCtrlNotocFinal;

    if (rowData.loadCtrlNotocFinalSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.loadCtrlNotocFinalSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.loadCtrlNotocFinalSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private lcManFinCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.loadCtrlManFinalSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.loadCtrlManFinalSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else if (rowData.loadCtrlManFinalSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    return cellsStyle;
  };

  private lcDocPchFinCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.loadCtrlDocPouchFinalSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.loadCtrlDocPouchFinalSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.loadCtrlDocPouchFinalSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  };

  private custOutCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.customOutSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.customOutSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.customOutSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  };

  private svcRptFinCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.svcRptFinalSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.svcRptFinalSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.svcRptFinalSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  };

  private uldPalletCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.uldPalletSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.uldPalletSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.uldPalletSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  };

  private uldAkeCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.uldAkeSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.uldAkeSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.uldAkeSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  };

  /**
  * Refresh
  */
  private refreshDashboard() {
    this.fetchExportFlightInfo();
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
      // to run every 30 sec to check latest export records exist or not.
      // if exist fetch new records. else no fetch just return false.
      this.dataRefreshSubscription = this.getTimer(30000).subscribe(data => {
        this.checkLatestRecordsExport();
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

  public checkLatestRecordsExport() {
    if (null != this.dashboardBatchLogId) {
      let dboardBatchLog: DBoardBatchLog = new DBoardBatchLog();
      dboardBatchLog.dashboardBatchLogId = this.dashboardBatchLogId;
      this.userService.getLatestExportFlights(dboardBatchLog).subscribe(responseBean => {
        if (responseBean.data.latestRecordsExist) {
          this.fetchExportFlightInfo();
        }
      })
    }
  }

  setSystemDateAndTime() {
    var objDate = new Date();
    console.log("setSystemDateAndTime new Date(): " + objDate);
    this.systemDate = ("0" + objDate.getDate()).slice(-2) + "-"
      + objDate.toLocaleString("en-us", { month: "short" }).toUpperCase() + "-"
      + objDate.getFullYear() + " " // .toString().substr(2)
      + ('0' + objDate.getHours()).slice(-2)
      + ":" + ('0' + objDate.getMinutes()).slice(-2)
      + ":" + objDate.getSeconds();
  }


  /**
    * Cells Renderer
    * @param value Value
    * @param rowData Row Data
    * @param level Level
    */
  public cellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
    if (column === 'loadCtrlManFinalSlaColor') {
      if ("AMBER" === rowData.loadCtrlManFinalSlaColor) {
        rowData.loadCtrlManFinalSlaColor = "YELLOW";
      }
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.loadCtrlManFinalSlaColor} " />
                </svg>
            </div>
            `
    }
    else if (column === 'loadCtrlDocPouchFinalSlaColor') {
      if ("AMBER" === rowData.loadCtrlDocPouchFinalSlaColor) {
        rowData.loadCtrlDocPouchFinalSlaColor = "YELLOW";
      }
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.loadCtrlDocPouchFinalSlaColor} " />
                </svg>
            </div>
            `
    }
    else if (column === 'customOutSlaColor') {
      if ("AMBER" === rowData.customOutSlaColor) {
        rowData.customOutSlaColor = "YELLOW";
      }
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData.customOutSlaColor} " />
                </svg>
            </div>
            `
    }

    // hoDlsColor
    else if (column === 'hoDlsColor') {
      if ("AMBER" === rowData.hoDlsColor) {
        rowData.hoDlsColor = "YELLOW";
      }
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill :${rowData.hoDlsColor} " />
                </svg>
            </div>
            `
    }
    else if (column === 'hoNotocColor') {
      if ("AMBER" === rowData.hoNotocColor) {
        rowData.hoNotocColor = "YELLOW";
      }
      return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill :${rowData.hoNotocColor} " />
                </svg>
            </div>
            `
    }
  };

}


