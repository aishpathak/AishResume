import {
  NgModule, NgZone, Component, ElementRef, Renderer2, Input, Output,
  forwardRef, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, EventEmitter,
  ContentChildren, QueryList, ViewContainerRef
} from '@angular/core';
import { NgcFormControl } from 'ngc-framework';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormArrayName, FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent,
  NgcControl
} from 'ngc-framework';
import { SlaDashboard, CargoEvents } from '../../dashboard.sharedmodel';

/**
 * Flight Bar
 */
@Component({
  selector: 'dashboard-flightbar',
  templateUrl: './flight-bar.component.html',
  styleUrls: ['./flight-bar.component.css']
})
export class FlightBarComponent extends NgcControl {
  public sx: number = 0;
  public sy: number = 0;
  public ex: number = 0;
  public ey: number = 0;
  public dsx: number = 0;
  public dsy: number = 0;
  public dex: number = 0;
  public dey: number = 0;
  //
  public _flightInfo: SlaDashboard;
  public _width: number;
  public _height: number;
  //
  @Input('flightBarRowIndex')
  public flightBarRowIndex: number;
  @Input('timelineWidth')
  public timelineWidth: number;
  @Input('timelineDuration')
  public timelineDuration: number = 30; // in Minutes

  private _startTime: Date;
  private _endTime: Date;
  private _actualTime: Date;
  private _timelineStartTime: Date;
  private _timelineEndTime: Date;
  private _eventStartTime: Date;


  /**
   * Initialize
   */
  constructor(appZone: NgZone, appElement: ElementRef, renderer: Renderer2) {
    super(appZone, appElement, renderer, null);
  }

  /**
   * On Initialization
   */
  public ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Sets Start Time
   */
  @Input('timelineStartTime')
  public set timelineStartTime(timelineStartTime: Date) {
    if (this._timelineStartTime !== timelineStartTime) {
      this._timelineStartTime = timelineStartTime;
      // Update Location
      this.updateFlightBarSpace();
    }
  }

  /**
   * Gets Start Time
   */
  public get timelineStartTime() {
    return this._timelineStartTime;
  }

  /**
   * Sets End Time
   */
  @Input('timelineEndTime')
  public set timelineEndTime(timelineEndTime: Date) {
    if (this._timelineEndTime !== timelineEndTime) {
      this._timelineEndTime = timelineEndTime;
      // Update Location
      this.updateFlightBarSpace();
    }
  }

  /**
   * Gets End Time
   */
  public get timelineEndTime() {
    return this._timelineEndTime;
  }

  /**
   * Sets Start Time
   */
  @Input('startTime')
  public set startTime(startTime: Date) {
    if (this._startTime !== startTime) {
      this._startTime = startTime;
      // Update Location
      this.updateFlightBarSpace();
    }
  }

  /**
   * Gets Start Time
   */
  public get startTime() {
    return this._startTime;
  }

  /**
   * Sets End Time
   */
  @Input('endTime')
  public set endTime(endTime: Date) {
    if (this._endTime !== endTime) {
      this._endTime = endTime;
      // Update Location
      this.updateFlightBarSpace();
    }
  }

  /**
   * Gets End Time
   */
  public get endTime() {
    return this._endTime;
  }

  /**
   * Sets Actual Time
   */
  @Input('actualTime')
  public set actualTime(actualTime: Date) {
    if (this._actualTime !== actualTime) {
      this._actualTime = actualTime;
      // Update Location
      this.updateFlightBarSpace();
    }
  }

  /**
   * Gets Delay Time
   */
  public get actualTime() {
    return this._actualTime;
  }


  /**
   * Sets Flight Info
   */
  @Input('flightInfo')
  public set flightInfo(flightInfo: SlaDashboard) {
    if (this._flightInfo !== flightInfo) {
      this._flightInfo = flightInfo;
      // Update Location
      this.updateFlightBarSpace();
    }
  }

  /**
   * Gets Start Time
   */
  public get flightInfo() {
    return this._flightInfo;
  }

  /**
    * Sets Width
    */
  @Input('width')
  public set width(width: number) {
    if (this._width !== width) {
      this._width = width;
      // Update Location
      this.updateFlightBarSpace();
    }
  }

  /**
   * Gets Width
   */
  public get width() {
    return this._width;
  }

  /**
   * Sets Height
   */
  @Input('height')
  public set height(height: number) {
    if (this._height !== height) {
      this._height = height;
      // Update Location
      this.updateFlightBarSpace();
    }
  }

  /**
   * Gets Height
   */
  public get height() {
    return this._height;
  }

  /**
   * Adjust Flight Bar based On Data Change
   */
  private updateFlightBarSpace() {
    if (!this.timelineStartTime) {
      return;
    }
    if (this._startTime && this._endTime) {
      const startDiffWithTimeline: number = NgcUtility.dateDifference(this._startTime, this.timelineStartTime) / 1000 / 60;
      const endDiffWithTimeline: number = NgcUtility.dateDifference(this._endTime, this.timelineStartTime) / 1000 / 60;
      const flightBarTimeDiff: number = NgcUtility.dateDifference(this._endTime, this._startTime) / 1000 / 60;
      const flightBarInboundDelayTimeDiff: number = this._actualTime ?
        NgcUtility.dateDifference(this._actualTime, this._startTime) / 1000 / 60 : null;
      const flightBarOutboundDelayTimeDiff: number = this._actualTime ?
        NgcUtility.dateDifference(this._actualTime, this._startTime) / 1000 / 60 : null;
      const durationPerPixel: number = this.timelineWidth / this.timelineDuration;
      // Find Position
      this.sx = durationPerPixel * startDiffWithTimeline;
      this.sy = this.flightBarRowIndex * 100;
      this.ex = durationPerPixel * (startDiffWithTimeline + flightBarTimeDiff);
      this.ey = this.flightBarRowIndex * 100;
      //
      if (this.flightInfo && this.flightInfo.dateSTA) {
        this.dsx = this.sx;
        this.dsy = this.sy;
        this.dex = flightBarInboundDelayTimeDiff ?
          durationPerPixel * (startDiffWithTimeline + flightBarInboundDelayTimeDiff) : null;
        this.dey = this.sy;
      } else if (this.flightInfo && this.flightInfo.dateSTD) {
        this.dsx = flightBarOutboundDelayTimeDiff ?
          durationPerPixel * (endDiffWithTimeline + flightBarOutboundDelayTimeDiff) : null;
        this.dsy = this.sy;
        this.dex = this.ex;
        this.dey = this.sy;
      }
      // Calculate SLA Events Time Line Properties
      if (this.flightInfo && this.flightInfo.cargoEvents) {
        this.flightInfo.cargoEvents.forEach((event: CargoEvents, index: number) => {
          const flightEventSlaTimeDiff: number =
            NgcUtility.dateDifference(event.slaTime, this.flightInfo.startTime) / 1000 / 60;
          const flightEventTimeDiff: number =
            NgcUtility.dateDifference(event.eventTime, event.slaTime) / 1000 / 60;
          // Find Position
          event.x = this.sx + (durationPerPixel * flightEventSlaTimeDiff);
          event.width = durationPerPixel * flightEventTimeDiff;
          //
          switch (event.slaColorCategory) {
            case "GREEN":
              event.eventColor = '#2ECC40';
              break;
            case "RED":
              event.eventColor = '#FF4136';
              break;
            case "AMBER":
              event.eventColor = '#FF851B';
              break;
          }
          event.slaDisplayTime = NgcUtility.getTimeAsString(event.slaTime);
          event.eventDisplayTime = NgcUtility.getTimeAsString(event.eventTime);
        });
      }
    } else {
      this.sx = this.sy = this.ex = this.ey = 0;
    }
  }

  public get segmentEventTimes(): Array<any> {
    const uniqueEvents: Array<any> = new Array<any>();
    //
    if (this.flightInfo.cargoEvents) {
      const dupMap: any = {};
      //
      this.flightInfo.cargoEvents.forEach((event: any) => {
        const eventTimeBarTime: string = NgcUtility.getTimeAsString(event.slaTime);
        //
        if (!dupMap[eventTimeBarTime]) {
          dupMap[eventTimeBarTime] = true;
          uniqueEvents.push({ x: event.x, slaTime: event.slaTime, time: eventTimeBarTime });
        }
      });
    }
    return uniqueEvents;
  }

  public segmentEvents(slaTime: string): Array<any> {
    const finalEvents: Array<any> = new Array<any>();
    //
    if (this.flightInfo.cargoEvents) {
      this.flightInfo.cargoEvents.forEach((event: any) => {
        if (event.slaTime == slaTime) {
          finalEvents.push(event);
        }
      });
    }
    return finalEvents;
  }

  public segmentX2(event, index): number {
    let size: number = this.segmentEvents(event.slaTime).length;
    return (20.91549430918954 * Math.cos(Math.PI * (-90 + ((360 / size)) * index) / 180));
  }

  public segmentY2(event, index): number {
    let size: number = this.segmentEvents(event.slaTime).length;
    return (20.91549430918954 * Math.sin(Math.PI * (-90 + ((360 / size)) * index) / 180));
  }

  public segmentX(event, index): number {
    let size: number = this.segmentEvents(event.slaTime).length;
    const initialAngle = -90;
    const radius = 15.91549430918954;
    const labelRadius = 33.91549430918954;
    const titleRadius = 40.91549430918954;
    const gutterLineWidth = 20.91549430918954;
    //
    return (labelRadius * Math.cos(Math.PI * (initialAngle + ((360 / (size)) * (index + 1)) - (360 / (size * 2))) / 180))
  }

  public segmentY(event, index): number {
    let size: number = this.segmentEvents(event.slaTime).length;
    const initialAngle = -90;
    const radius = 15.91549430918954;
    const labelRadius = 33.91549430918954;
    const titleRadius = 40.91549430918954;
    const gutterLineWidth = 20.91549430918954;
    //
    return (labelRadius * Math.sin(Math.PI * (initialAngle + ((360 / (size)) * (index + 1)) - (360 / (size * 2))) / 180))
  }

}

/**
 * Flight Bar
 */
@NgModule({
  imports: [
    CommonModule
  ],
  exports: [FlightBarComponent],
  declarations: [FlightBarComponent]
})
export class FlightBarComponentModule {
}
