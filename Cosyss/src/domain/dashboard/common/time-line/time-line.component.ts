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
  NgcControl, DateTimeKey
} from 'ngc-framework';

class TimeLine {
  public displayTime: string;
  public changeDay: string;
  public time: Date;
}

/**
 * Time Line
 */
@Component({
  selector: 'dashboard-timeline',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.css']
})
export class TimeLineComponent extends NgcControl {
  public timeline: Array<TimeLine> = [];
  //
  public currentTimeX: number = 0;
  public currentTimeY2: number = 0;
  public _width: number;
  public _height: number;
  //
  @Input('timelineWidth')
  public timelineWidth: number = 75;
  @Input('timelineHeight')
  public timelineHeight: number = 30;
  @Input('timelineDuration')
  public timelineDuration: number = 30; // in Minutes

  private _startTime: Date;
  private _endTime: Date;
  private _timelineStartTime: Date;
  private _timelineEndTime: Date;

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
   * After View Initialization
   */
  public ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  /**
   * Sets Start Time
   */
  @Input('timelineStartTime')
  public set timelineStartTime(timelineStartTime: Date) {
    if (this._timelineStartTime !== timelineStartTime) {
      this._timelineStartTime = timelineStartTime;
      // Update Location
      this.updateTimeline();
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
      this.updateTimeline();
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
      this.updateTimeline();
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
      this.updateTimeline();
    }
  }

  /**
   * Gets End Time
   */
  public get endTime() {
    return this._endTime;
  }

  /**
   * Sets Width
   */
  @Input('width')
  public set width(width: number) {
    if (this._width !== width) {
      this._width = width;
      // Update Location
      this.updateTimeline();
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
      this.updateTimeline();
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
  private updateTimeline() {
    if (!this.timelineStartTime) {
      return;
    }
    const timeline: Array<TimeLine> = [];
    let lastDay: string = '';
    let timelines: number = Math.round(this.width / this.timelineWidth);
    //
    for (let index = 0; index < timelines; index++) {
      const timeLine: TimeLine = new TimeLine();
      const time: Date = NgcUtility.addDate(this.timelineStartTime, index * 30, DateTimeKey.MINUTES);
      const day: string = NgcUtility.getDateTimeAsStringByFormat(time, 'DD/MM');
      //
      timeLine.time = time;
      //
      if (day !== lastDay) {
        lastDay = day;
        timeLine.changeDay = day;
      }
      timeLine.displayTime = NgcUtility.getTimeAsString(time);
      //
      timeline.push(timeLine);
    }
    const startDiffWithTimeline: number = NgcUtility.dateDifference(NgcUtility.addDate(new Date(), 2.5, DateTimeKey.HOURS), this.timelineStartTime) / 1000 / 60;
    const durationPerPixel: number = this.timelineWidth / this.timelineDuration;
    // Find Position
    this.currentTimeX = durationPerPixel * startDiffWithTimeline;
    this.currentTimeY2 = window.innerHeight;
    this.timeline = timeline;
  }

}

/**
 * Time Line
 */
@NgModule({
  imports: [
    CommonModule
  ],
  exports: [TimeLineComponent],
  declarations: [TimeLineComponent]
})
export class TimeLineComponentModule {
}
