import { CellsStyleClass } from './../../../../shared/shared.data';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { EventsService } from '../events.service';
import { Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcUtility, DateTimeKey, PageConfiguration, CellsRendererStyle, NgcWindowComponent, NgcDataTableComponent } from 'ngc-framework';
import { FlightInfo } from '../events.sharedmodel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-import-FlightEVM',
  templateUrl: './import-FlightEVM.component.html',
  styleUrls: ['./import-FlightEVM.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true

})
export class ImportFlightEVMComponent extends NgcPage implements OnInit {

  dateTo: any;
  showTableFlag: any;
  pageNumber: any;
  @ViewChild('inBoundTable') inBoundTable: NgcDataTableComponent;

  private autoRefreshSubscription: Subscription;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private userService: EventsService) {
    super(appZone, appElement, appContainerElement);
    // this.functionId = "PLAYGROUND";
  }

  ngOnInit() {
    this.pageNumber = 1;
    this.refreshDashboard();
    this.onSwitchChange(this.importFlightEVM.get('auto').value);
  }

  public importFlightEVM: NgcFormGroup = new NgcFormGroup({
    auto: new NgcFormControl(true),
    fromDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 1, DateTimeKey.MINUTES)),
    toDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), (24 * 60) - 1, DateTimeKey.MINUTES)),
    rampCheckInCompleted: new NgcFormControl('BOTH'),
    documentVerificationCompleted: new NgcFormControl('BOTH'),
    breakdownCompleted: new NgcFormControl('BOTH'),
    flightCompleted: new NgcFormControl('BOTH'),
    carrierGroup: new NgcFormControl(),
    requestTerminal: new NgcFormControl(),
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
    this.pageNumber = 1;
    let flightDates: FlightInfo = new FlightInfo();
    flightDates.fromDate = this.importFlightEVM.get('fromDate').value;
    flightDates.toDate = this.importFlightEVM.get('toDate').value;
    flightDates.rampCheckInCompleted = this.importFlightEVM.get('rampCheckInCompleted').value;
    flightDates.documentVerificationCompleted = this.importFlightEVM.get('documentVerificationCompleted').value;
    flightDates.breakdownCompleted = this.importFlightEVM.get('breakdownCompleted').value;
    flightDates.flightCompleted = this.importFlightEVM.get('flightCompleted').value;
    flightDates.carrierGroup = this.importFlightEVM.get('carrierGroup').value;
    flightDates.requestTerminal = this.importFlightEVM.get('requestTerminal').value;
    this.userService.fetchInboundFlightInfo(flightDates).subscribe(data => {
      this.refreshFormMessages(data);
      if (!this.showResponseErrorMessages(data)) {
        if (data.data && data.data.length > 0) {
          this.showTableFlag = true;
          (<NgcFormArray>this.importFlightEVM.get('importFlightList')).patchValue(data.data);

        } else {
          this.showErrorStatus('warehouse.norecordfound');
          (<NgcFormArray>this.importFlightEVM.get('importFlightList')).patchValue([]);
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

  /**
   * On SwitchChange
   */
  /**
   * On SwitchChange
  //  */
  // public onSwitchChange(event) {
  //   if (this.autoRefreshSubscription) {
  //     this.autoRefreshSubscription.unsubscribe();
  //     this.autoRefreshSubscription = null;
  //   }
  //   if (event === true) {
  //     if (this.inBoundTable) {
  //       this.autoRefreshSubscription = this.getTimer(10000).subscribe((data) => {
  //         if (this.inBoundTable.getTotalPages() > 1) {
  //           if (this.pageNumber === this.inBoundTable.getTotalPages()) {
  //             this.inBoundTable.goToPage(1);
  //             this.pageNumber = 1;
  //           } else {
  //             this.pageNumber = this.pageNumber + 1;
  //             this.inBoundTable.goToPage(this.pageNumber);
  //           }
  //         }
  //       });
  //     }
  //   }
  // }

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
    this.fetchImportFlightInfo();
  }


  //method to dispaly event specific color code 
  public rampCheckCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (rowData.rampCheckInCompletedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.rampCheckInCompletedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.rampCheckInCompletedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  }
  //method to dispaly event specific color code 
  public documentVerificationCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (rowData.documentVerificationCompletedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.documentVerificationCompletedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.documentVerificationCompletedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  }
  //method to dispaly event specific color code 
  public breakdownCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (rowData.breakdownCompletedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.breakdownCompletedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.breakdownCompletedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  }
  //method to dispaly event specific color code 
  public inwardServiceCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (rowData.inwardServiceReportFinalizedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.inwardServiceReportFinalizedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.inwardServiceReportFinalizedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  }
  //method to dispaly event specific color code 
  public flightCompletedCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (rowData.flightCompletedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.flightCompletedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.flightCompletedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  }
  //method to dispaly event specific color code 
  public flightClosedCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (rowData.flightClosedColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.flightClosedColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.flightClosedColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  }
  //method to dispaly event specific color code 
  public fdlCompletedCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (rowData.fdlCompletedSlaColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.fdlCompletedSlaColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.fdlCompletedSlaColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  }


  //method to dispaly event specific color code 
  public ffmStatusCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (rowData.ffmStatusColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.ffmStatusColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.ffmStatusColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  }

  //method to dispaly event specific color code 
  public ibbdfltevmCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (rowData.breakdownCompletedColor === "RED") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.breakdownCompletedColor === "GREEN") {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    } else if (rowData.breakdownCompletedColor === "AMBER") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    }
    return cellsStyle;
  }

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
}

