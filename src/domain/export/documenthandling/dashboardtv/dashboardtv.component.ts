
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, OnDestroy } from '@angular/core';

import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, NgcWindowComponent, BaseRequest, NgcDataTableComponent
} from 'ngc-framework';

import { DocumentService } from "../document/document.service";
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardRequestBO } from '../document/document.sharedmodel';
import { interval, Subscription } from "rxjs";

@Component({
  selector: 'app-dashboardtv',
  templateUrl: './dashboardtv.component.html',
  styleUrls: ['./dashboardtv.component.scss']
})

export class DashboardtvComponent extends NgcPage implements OnInit, OnDestroy {
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
  totalPageDisplay: any;
  previousRoute: any;

  autoPaginationSubscription: Subscription;
  getDataOnDashboardPageLoad: Subscription;

  dashboardForm: NgcFormGroup = new NgcFormGroup({
    dateTime: new NgcFormControl(),
    dashboardFlightList: new NgcFormArray([]),
  });
  urlTerminal: string;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private route: ActivatedRoute,
    private documentService: DocumentService, private router: Router) {
    super(appZone, appElement, appContainerElement);
    this.previousRoute = sessionStorage.getItem('previousRoute');
    sessionStorage.setItem('previousRoute', this.router.url);
    this.route.params.subscribe(params => {
      this.urlTerminal = params.id;
      if (this.urlTerminal === undefined) {
        if (this.getUserProfile().terminalId.includes('T3')) {
          this.urlTerminal = 'T3';
        } else if (this.getUserProfile().terminalId.includes('T5')) {
          this.urlTerminal = 'T5';
        }
      }
      // alert(this.urlTerminal);
      setInterval(() => {
        this.setSystemDateAndTime();
      }, 1000);
      this.setData('first');
      console.log(this.urlTerminal);
    }
    );
  }

  ngOnInit() {
    super.ngOnInit();

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
      this.onDashBoardPageLoad1();
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
      this.onDashBoardPageLoad1();
    }
    this.recordDisplay();
  }

  onDashBoardPageLoad1() {
    let dashboardRQ: DashboardRequestBO = new DashboardRequestBO();
    dashboardRQ.officeId = this.urlTerminal;

    this.getDataOnDashboardPageLoad = this.documentService.getDataOnDashboardPageLoad(dashboardRQ)
      .subscribe(responseBean => {
        this.responseArray = responseBean.data.dashboardList;
        this.totalRowCount = this.responseArray.length;
        this.returnResult = this.responseArray.slice(this.startPage, this.endPage);
        this.dashboardForm.controls['dashboardFlightList'].patchValue(this.returnResult);
        // this.recordsPerPage = parseInt(responseBean.data.noOfRecPerPge);
        // this.refreshTime = responseBean.data.pageRefreshTime;
        // this.systemDate = responseBean.data.systemDateTime;
        this.recordsPerPage = 10;
        this.refreshTime = 5;
        //this.setSystemDateAndTime();
        this.totalPage = Math.ceil(this.totalRowCount / this.recordsPerPage);
        this.totalPageDisplay = this.totalPage;

        //AutoPaginate on every 'refreshTime' min : Added (this.router) consdition, will Hit DB for fresh Data only when URL is /dashboardtv
        if (this.responseArray.length > 0) {
          this.autoPaginationSubscription = interval(1000 * this.refreshTime).subscribe(x => {
            if (this.endPage === this.totalRowCount) {            //when Last Page is displayed
              this.autoPaginationSubscription.unsubscribe();     //Unscubscribe from the autoPaginationSubscription
              this.reset();                                    //refresh the whole component and get new data
            }
            else {
              if (this.responseArray.length <= 10) {
                this.autoPaginationSubscription.unsubscribe();     //Unscubscribe from the autoPaginationSubscription
                this.reset();
              } else {
                this.setData('nxt')
              }
            }
          });
        }
      }, error => { this.showErrorStatus('export.no.details.found'); }
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

  setSystemDateAndTime() {
    var objDate = new Date();
    this.systemDate = ("0" + objDate.getDate()).slice(-2) + "-"
      + objDate.toLocaleString("en-us", { month: "short" }).toUpperCase() + "-"
      + objDate.getFullYear() + " " // .toString().substr(2)
      + ('0' + objDate.getHours()).slice(-2)
      + ":" + ('0' + objDate.getMinutes()).slice(-2);
    //  + ":" + objDate.getSeconds();
  }


  reset() {
    if (this.router.url.includes("dashboardtv/T3")) {
      this.router.navigateByUrl('/RefrshComponent', { skipLocationChange: true }).then(() =>
        this.router.navigate(["export/cdh/dashboardtv/T3"]));
    }
    else if (this.router.url.includes("dashboardtv/T5")) {
      this.router.navigateByUrl('/RefrshComponent', { skipLocationChange: true }).then(() =>
        this.router.navigate(["export/cdh/dashboardtv/T5"]));
    }
    else if (this.router.url.includes("dashboardtv")) {
      this.router.navigateByUrl('/RefrshComponent', { skipLocationChange: true }).then(() =>
        this.router.navigate(["export/cdh/dashboardtv"]));
    }
  }

  ngOnDestroy() { // required do not delete
    if (this.autoPaginationSubscription != undefined) {
      this.autoPaginationSubscription.unsubscribe();
    }
    if (this.getDataOnDashboardPageLoad != undefined) {
      this.getDataOnDashboardPageLoad.unsubscribe();
    }
  }
}