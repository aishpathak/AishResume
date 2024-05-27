import {
  NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcDropDownComponent, NgcButtonComponent,
  NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest, BaseResponse, PageConfiguration
} from "ngc-framework";

import {
  Component, NgZone, ElementRef, OnInit,
  OnDestroy, ViewContainerRef, ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgcFormControl, NgcUtility, DateTimeKey } from "ngc-framework";
import { Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SlaDashboard, CargoEvents } from '../dashboard.sharedmodel';
import { DashboardService } from '../dashboard.service';

/**
 * SLA Dashboard
 */
@Component({
  selector: 'app-slaDashboard',
  templateUrl: './slaDashboard.component.html',
  styleUrls: ['./slaDashboard.component.css']
})
export class SlaDashboardComponent extends NgcPage {
  private isInbound: boolean = false;
  private isOutbound: boolean = false;
  public historyFlag: number = 0;
  public delayFlag: boolean = false;
  //
  public flightList: Array<SlaDashboard> = [];
  public timelineWidth: number = 40;
  public timelineHeight: number = 30;
  public timelineDuration: number = 30;
  public timelineStartTime: Date;
  private autoRefreshSubscription: Subscription;
  private currentDateTime = new Date();
  public width: number = window.innerWidth;
  public height: number = window.innerHeight;
  public totalFlights: number = 0;
  public newDateInFormat: Date = null;

  private slaDashboardForm: NgcFormGroup = new NgcFormGroup({
    auto: new NgcFormControl(true),
    // plus: new NgcFormControl()
  });

  /**
   *
   * @param appZone
   * @param appElement
   * @param appContainerElement
   * @param router
   * @param activated
   */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router,
    private route: ActivatedRoute, private dashboardService: DashboardService) {
    super(appZone, appElement, appContainerElement);
    //
    const format: string = 'ddMMMyy HH';
    const currentHourDate: Date = NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), format), format);
    // Update Timeline Start Hour
    this.timelineStartTime = NgcUtility.subtractDate(currentHourDate, 10, DateTimeKey.HOURS)
    //
    this.route.params.subscribe(params => {
      if (params.id === 'inbound') {
        this.isInbound = true;
      } else if (params.id === 'outbound') {
        this.isOutbound = true;
      }
    });
  }

  /**
   * On Initialization
   */
  public ngOnInit() {
    super.ngOnInit();
    //

    this.newDateInFormat = NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'DDMMMYYYY HH'), 'DDMMMYYYY HH');
    this.refreshDashboard();
    this.onSwitchChange(this.slaDashboardForm.get('auto').value);
  }

  /**
   * Inbound
   */
  private fetchInboundFlightList() {
    //
    let request: SlaDashboard = new SlaDashboard();
    //
    request.currentTime = new Date();
    //send request to backend
    this.dashboardService.getInboundFlightInfo(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        console.log(response);
        const flightList: Array<SlaDashboard> = response.data as any;
        //
        if (flightList.length === 0) {
          this.showErrorStatus('no.record');
        }
        let minStartTime: Date = null;
        //
        flightList.forEach((flight: SlaDashboard) => {
          const flightTime: Date = NgcUtility.getDateTime(flight.dateSTA as any);
          //
          flight.flightTime = flightTime;
          flight.actualTime = flight.dateATA ? flight.dateATA : null;
          //
          if (minStartTime && flightTime
            && NgcUtility.dateDifference(flightTime, minStartTime) < 0) {
            minStartTime = NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(flightTime, 'DDMMMYYYY HH'), 'DDMMMYYYY HH');
          } else if (!minStartTime) {
            minStartTime = NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(flightTime, 'DDMMMYYYY HH'), 'DDMMMYYYY HH');
          }
          if (flight) {
            flight.startTime = flightTime;
            //to add  actual STA
            // flight.flightDisplayTime = 'STA ' + NgcUtility.getTimeAsString(flightTime);
            flight.flightDisplayTime = 'STA ' + NgcUtility.getTimeAsString(flight.flightTime);
            flight.flightDelayDisplayTime = 'ATA ' + NgcUtility.getTimeAsString(flight.dateATA);
            if (NgcUtility.dateDifference(flight.flightTime, flight.dateATA) < 0) {
              flight.delayFlag = true;
            }

            //
            // to check flighttype
            let endTime: Date = null;
            if (flight.flightComplete == null && flight.flightType == 'P') {
              endTime = NgcUtility.addDate(flightTime, 4, DateTimeKey.HOURS);
            } else {
              endTime = NgcUtility.addDate(flightTime, 6, DateTimeKey.HOURS);
            }
            //
            if (flight.cargoEvents) {
              flight.cargoEvents.forEach((event: CargoEvents) => {
                if (NgcUtility.dateDifference(event.eventTime, endTime) > 0) {
                  endTime = event.eventTime;
                }
                // if (NgcUtility.dateDifference(event.eventTime, flight.startTime) < 0) {
                //   flight.startTime = event.eventTime;
                // }
              });
            }
            flight.endTime = endTime;
          }
        });
        //
        this.totalFlights = flightList.length;
        // this.timelineStartTime = NgcUtility.subtractDate(minStartTime, 2, DateTimeKey.HOURS);
        //timelineStart -4 w.r.t currentTime +8 for import
        // this.timelineStartTime = NgcUtility.subtractDate(new Date(), 4, DateTimeKey.HOURS);
        this.timelineStartTime = NgcUtility.subtractDate(NgcUtility.addDate(this.newDateInFormat, this.historyFlag, DateTimeKey.HOURS), 4, DateTimeKey.HOURS);
        this.flightList = flightList;
      }
    }, error => {
      this.showErrorMessage(error);
    });
  }


  /**
   * Outbound
   */
  private fetchOutboundFlightList() {
    //
    let request: SlaDashboard = new SlaDashboard();
    //
    request.currentTime = new Date();
    //
    this.dashboardService.getOutboundFlightInfo(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        console.log(response);
        const flightList: Array<SlaDashboard> = response.data as any;
        //
        if (flightList.length === 0) {
          this.showErrorStatus('no.record');
        }
        let minStartTime: Date = null;
        //
        flightList.forEach((flight: SlaDashboard) => {
          const flightTime: Date = NgcUtility.getDateTime(flight.dateSTD as any);
          //
          flight.flightTime = flightTime;
          flight.actualTime = flight.dateSTA ? flight.dateSTA : null;
          //
          if (minStartTime && flightTime
            && NgcUtility.dateDifference(flightTime, minStartTime) < 0) {
            minStartTime = NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(flightTime, 'DDMMMYYYY HH'), 'DDMMMYYYY HH');
          } else if (!minStartTime) {
            minStartTime = NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(flightTime, 'DDMMMYYYY HH'), 'DDMMMYYYY HH');
          }
          if (flight) {
            //making bar to appear before 8 hrs of departure
            //  flight.startTime = flightTime;
            flight.endTime = flightTime;
            // flight.endTime = flight.dateATD - flight.dateSTD;
            flight.flightDisplayTime = 'STD ' + NgcUtility.getTimeAsString(flightTime);


            //
            let startTime: Date = NgcUtility.subtractDate(flightTime, 8, DateTimeKey.HOURS);
            // let endTime: Date = flightTime;
            //
            if (flight.cargoEvents) {
              flight.cargoEvents.forEach((event: CargoEvents) => {
                if (NgcUtility.dateDifference(event.eventTime, startTime) < 0) {
                  startTime = event.eventTime;
                }
                //  if (event.eventName === 'FLT' && NgcUtility.dateDifference(flightTime, event.eventTime) < 0) {
                if (NgcUtility.dateDifference(flight.endTime, event.eventTime) < 0) {
                  flight.endTime = event.eventTime;
                }
                //  event.slaTime = event.eventTime;
              });
            }
            flight.startTime = startTime;
          }
        });
        //
        this.totalFlights = flightList.length;
        // this.timelineStartTime = NgcUtility.subtractDate(minStartTime, 8, DateTimeKey.HOURS);
        //timelineStart -4 w.r.t currentTime +8 for import
        this.timelineStartTime = NgcUtility.subtractDate(this.newDateInFormat, 8, DateTimeKey.HOURS);
        this.flightList = flightList;
      }
    }, error => {
      this.showErrorMessage(error);
    });
  }

  /**
   * On SwitchChange
   */
  public onSwitchChange(event) {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
    }
    if (event === true) {
      this.autoRefreshSubscription = this.getTimer(1500000).subscribe((data) => {
        this.refreshDashboard();
      });
    }
  }

  /**
   * Refresh
   */
  private refreshDashboard() {
    if (this.isInbound) {
      this.fetchInboundFlightList();
    } else if (this.isOutbound) {
      this.fetchOutboundFlightList();
      // TODO
    }
  }

  /**
   * previous History
   */
  private onClickPlus() {
    // this.timelineStartTime = NgcUtility.subtractDate(new Date(), 8, DateTimeKey.HOURS);
    this.historyFlag = this.historyFlag + 1;
    console.log(this.historyFlag);
    this.timelineStartTime = NgcUtility.subtractDate(NgcUtility.addDate(this.newDateInFormat, this.historyFlag, DateTimeKey.HOURS), 4, DateTimeKey.HOURS);
  }

  /**
    * revert previous History
    */
  private onClickMinus() {
    //this.timelineStartTime = NgcUtility.subtractDate(new Date(), 8, DateTimeKey.HOURS);
    this.historyFlag = this.historyFlag - 1;
    console.log(this.historyFlag);
    this.timelineStartTime = NgcUtility.subtractDate(NgcUtility.addDate(this.newDateInFormat, this.historyFlag, DateTimeKey.HOURS), 4, DateTimeKey.HOURS);
  }
  /**
   * On Window Resize
   */
  public onResize(event) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  onCancel(){
    this.navigateHome();
  }
}
