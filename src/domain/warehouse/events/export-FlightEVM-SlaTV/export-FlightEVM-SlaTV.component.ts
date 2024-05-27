
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, OnDestroy } from '@angular/core';

import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcUtility, DateTimeKey, NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, NgcWindowComponent, BaseRequest, NgcDataTableComponent
} from 'ngc-framework';

import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from "rxjs";
import { EventsService } from '../events.service';
import { FlightInfo, DBoardBatchLog } from '../events.sharedmodel';

@Component({
  selector: 'app-export-FlightEVM',
  templateUrl: './export-FlightEVM-SlaTV.component.html',
  styleUrls: ['./export-FlightEVM-SlaTV.component.scss']
})

export class ExportFlightEVMSlaTVComponent extends NgcPage implements OnInit, OnDestroy {
  responseArray: any[];
  returnResult: any[];
  refreshTime: any;
  recordsPerPage: any;
  systemDate: any;
  startPage: number = 1;
  startPageDisplay: number;
  endPage: number = 10;
  endPageDisplay: number;
  totalRowCount: number;
  pageCount: number = 1;
  disButtonPre: boolean = false;
  disButtonNxt: boolean = false;
  totalPage: number;
  previousRoute: any;
  showHideAdd = false;
  autoPaginationSubscription: Subscription;
  getDataOnDashboardPageLoad: Subscription;
  searchOptionsOn: boolean = true;
  dashboardBatchLogId: any;
  getLatestDboardRecExportSub: Subscription;
  nextFireTime: Date;
  lastJobRun: any;
  nextJobRun: any;
  flightDates: FlightInfo = new FlightInfo();
  dashboardForm: NgcFormGroup = new NgcFormGroup({
    dateTime: new NgcFormControl(),
    dashboardFlightList: new NgcFormArray([]),
  });

  private dashboardQueryForm: NgcFormGroup = new NgcFormGroup({
    searchOn: new NgcFormControl(false),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    requestTerminal: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    autoRefresh: new NgcFormControl(false)
  });

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private route: ActivatedRoute,
    private eventsService: EventsService, private router: Router) {
    super(appZone, appElement, appContainerElement);
    this.previousRoute = sessionStorage.getItem('previousRoute');
    sessionStorage.setItem('previousRoute', this.router.url);
    this.route.params.subscribe(params => {
      this.setData('first');
    });
    this.searchOptionsOn = false;
  }

  ngOnInit() {
    super.ngOnInit();
    this.onDashBoardPageLoad1();
    // to run every 30 sec to check latest export records
    this.getDataOnDashboardPageLoad = this.getTimer(30000).subscribe(data => {
      this.checkLatestRecordsExport();
    });
  }

  setData(page) {
    if (page === 'first') {
      //this.reset();
      this.refreshTime = 0;
      this.pageCount = 1;
      this.startPage = 0;
      this.endPage = 10;
      this.disButtonPre = true;
      this.disButtonNxt = false;
      //this.onDashBoardPageLoad1();
      this.resultDisplay();
    }
    else if (page === 'pre') {
      if (this.startPage <= 0) {
        this.startPage = 0;
        this.disButtonPre = true;
        this.disButtonNxt = false;
        this.recordDisplay();
        return;
      }
      this.pageCount--;
      this.startPage = this.startPage - 10;
      this.endPage = this.endPage - 10;
      this.disButtonNxt = false;
      this.resultDisplay();
    }
    else if (page === 'nxt') {
      this.pageCount++;
      this.startPage = this.endPage;
      this.endPage = this.endPage + 10;
      if (this.startPage > this.totalRowCount) {
        this.startPage = 0;
        this.disButtonNxt = true;
      }
      if (this.pageCount === this.totalPage) {
        this.disButtonNxt = true;
        this.disButtonPre = false;
        this.endPage = this.totalRowCount;
      }
      this.resultDisplay();
      if (this.startPage >= 0) {
        this.disButtonPre = false;
        this.recordDisplay();
        return;
      }
    }
    else if (this.pageCount === this.totalPage) {
      this.disButtonPre = true;
      this.startPage = 1;
      this.endPage = 10;
      this.resultDisplay();
      //this.onDashBoardPageLoad1();
      return;
    }
    this.recordDisplay();
  }

  onDashBoardPageLoad1() {
   
    //let flightDates: FlightInfo = new FlightInfo();
    this.getDataOnDashboardPageLoad = this.eventsService.getSlaTVExport(this.flightDates).subscribe(responseBean => {
      if (responseBean.data) {
        this.refreshTime = responseBean.data.pageRefreshTimeSec;
        this.recordsPerPage = responseBean.data.noOfRecPerPge;
        this.totalRowCount = responseBean.data.noOfRecTotal;
        this.totalPage = responseBean.data.noOfTotalPages;
        this.dashboardBatchLogId = responseBean.data.dashboardBatchLogId;
        this.lastJobRun = responseBean.data.latestJobStartedOn;
        this.nextJobRun = responseBean.data.nextFireTime;
        this.responseArray = responseBean.data.exportList;
        this.returnResult = this.responseArray.slice(this.startPage, this.totalRowCount);
        this.dashboardForm.controls['dashboardFlightList'].patchValue(this.returnResult);

        //AutoPaginate on every 'refreshTime' min : Added (this.router) consdition, will Hit DB for fresh Data only when URL is /dashboardtv
        if (this.responseArray.length > 0) {
          this.autoPaginationSubscription = interval(1000 * this.refreshTime).subscribe(x => {
            //alert("1");
            //alert("this.endPage: "+this.endPage);
            //alert("this.totalRowCount: "+this.totalRowCount);
            if (this.endPage === this.totalRowCount) {            //when Last Page is displayed
              //alert("2");
              //this.autoPaginationSubscription.unsubscribe();     //Unscubscribe from the autoPaginationSubscription
              //this.reset();                                    //refresh the whole component and get new data
              this.setData('first')
            }
            else {
              //alert("3");
              if (this.responseArray.length <= this.recordsPerPage) {
                //alert("4");
                //this.autoPaginationSubscription.unsubscribe();     //Unscubscribe from the autoPaginationSubscription
                //this.reset();
                this.setData('first')
              } else {
                //alert("5");
                this.setData('nxt')
              }
            }
          });
        }
      }
    }, error => { this.showErrorStatus('warehouse.error.nodetails.found'); }
    );
  }

  resultDisplay() {
    this.returnResult = this.responseArray.slice(this.startPage, this.endPage);
    this.dashboardForm.controls['dashboardFlightList'].patchValue(this.returnResult);
  }

  recordDisplay() {
    this.startPageDisplay = this.startPage + 1;
    this.endPageDisplay = this.endPage;
  }

  reset() {
    this.router.navigate(["events/exportFlightEVMSlaTV"]);
    //this.router.navigate(["export/cdh/dashboardtv"]);
  }

  ngOnDestroy() { // required do not delete
    this.autoPaginationSubscription.unsubscribe();
    this.getDataOnDashboardPageLoad.unsubscribe();
  }

  public searchOptionsOnEvent(event) {
    if (event === true) {
      this.searchOptionsOn = true;
    } else {
      this.searchOptionsOn = false;
      this.flightDates.fromDate = this.dashboardQueryForm.get('fromDate').value;
      this.flightDates.toDate = this.dashboardQueryForm.get('toDate').value;
      this.flightDates.carrierGroup = this.dashboardQueryForm.get('carrierGroup').value;
      this.flightDates.requestTerminal = this.dashboardQueryForm.get('requestTerminal').value;
      this.flightDates.flightKey = this.dashboardQueryForm.get('flightKey').value;
      this.onDashBoardPageLoad1();
    }
  }

  clickSearch() {
    this.flightDates.fromDate = this.dashboardQueryForm.get('fromDate').value;
    this.flightDates.toDate = this.dashboardQueryForm.get('toDate').value;
    this.flightDates.carrierGroup = this.dashboardQueryForm.get('carrierGroup').value;
    this.flightDates.requestTerminal = this.dashboardQueryForm.get('requestTerminal').value;
    this.flightDates.flightKey = this.dashboardQueryForm.get('flightKey').value;
    this.getDataOnDashboardPageLoad.unsubscribe();
    this.autoPaginationSubscription.unsubscribe();
    this.onDashBoardPageLoad1();
  }
  /*
  public autoRefreshChange(event) {
    if (this.autoPaginationSubscription) {
      this.autoPaginationSubscription.unsubscribe();
    }
    if (this.getDataOnDashboardPageLoad) {
      this.getDataOnDashboardPageLoad.unsubscribe();
    }
    if (event === true) {
      // to run every 30 sec to check latest export records
      this.getDataOnDashboardPageLoad = this.getTimer(30000).subscribe(data => {
        this.checkLatestRecordsExport();
      });
    }
  }
*/
  public checkLatestRecordsExport() {
    if (null != this.dashboardBatchLogId) {
      let dboardBatchLog: DBoardBatchLog = new DBoardBatchLog();
      dboardBatchLog.dashboardBatchLogId = this.dashboardBatchLogId;
      this.getLatestDboardRecExportSub = this.eventsService.getLatestDboardRecExport(dboardBatchLog).subscribe(responseBean => {
        if (responseBean.data.latestRecordsExist) {
          this.onDashBoardPageLoad1();
        }
      });
    }
  }
}