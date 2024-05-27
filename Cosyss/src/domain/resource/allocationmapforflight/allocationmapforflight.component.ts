import {
  NgModule,
  NgZone,
  OnInit,
  Component,
  ElementRef,
  Renderer2,
  Input,
  Output,
  forwardRef,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
  EventEmitter,
  ContentChildren,
  QueryList,
  ViewContainerRef
} from "@angular/core";
import { NgcFormControl } from "ngc-framework";
import { CommonModule } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormArrayName,
  FormArray,
  FormGroup
} from "@angular/forms";
import { Observable } from "rxjs";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcWindowComponent,
  NgcButtonComponent,
  NgcUtility,
  NgcDropDownComponent,
  NgcInputComponent,
  NgcControl,
  DateTimeKey
} from "ngc-framework";
import { Flight, TimeLine } from "./../resource.sharedmodel";

@Component({
  selector: "app-allocationmapforflight",
  templateUrl: "./allocationmapforflight.component.html",
  styleUrls: ["./allocationmapforflight.component.css"]
})
export class AllocationmapforflightComponent extends NgcControl {
  public timeline: Array<TimeLine> = [];
  public sx: number = 0;
  public sy: number = 0;
  public ex: number = 0;
  public ey: number = 0;
  public _width: number;
  public _height: number;
  private _shiftStartTime: Date;
  private _shiftEndTime: Date;
  private _shiftFlights: Array<Flight>;
  private timelineStartTime: Date;
  private timelineWidth: number = 20;
  private timelineDuration: number = 60;

  @Input("shiftDate") private shiftDate: Date;

  /**
   * Initialize
   */
  constructor(appZone: NgZone, appElement: ElementRef, renderer: Renderer2) {
    super(appZone, appElement, renderer, null);
  }

  /**
   * On Initialization
   */
  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Sets Shift Start Time
   *
   * @memberof AllocationmapforflightComponent
   */
  @Input("shiftStartTime")
  public set shiftStartTime(shiftStartTime: Date) {
    const dateString: string = NgcUtility.getDateAsString(this.shiftDate);
    const timeString: string = NgcUtility.getTimeAsString(shiftStartTime);
    //
    this._shiftStartTime = NgcUtility.getDateTime(
      `${dateString} ${timeString}`
    );
    // Update Timeline
    this.updateTimeline();
    this.updateFlightAssignment();
  }

  /**
   * Gets Shift Start Time
   *
   * @readonly
   * @type {Date}
   * @memberof AllocationmapforflightComponent
   */
  public get shiftStartTime(): Date {
    return this._shiftStartTime;
  }

  /**
   * Sets Shift End Time
   *
   * @memberof AllocationmapforflightComponent
   */
  @Input("shiftEndTime")
  public set shiftEndTime(shiftEndTime: Date) {
    const dateString: string = NgcUtility.getDateAsString(this.shiftDate);
    const timeString: string = NgcUtility.getTimeAsString(shiftEndTime);
    //
    this._shiftEndTime = NgcUtility.getDateTime(`${dateString} ${timeString}`);
    // Update Timeline
    this.updateTimeline();
    this.updateFlightAssignment();
  }

  /**
   * Gets Shift End Time
   *
   * @readonly
   * @type {Date}
   * @memberof AllocationmapforflightComponent
   */
  public get shiftEndTime(): Date {
    return this._shiftEndTime;
  }

  /**
   * Sets Shift Flights
   *
   * @memberof AllocationmapforflightComponent
   */
  @Input("shiftFlights")
  public set shiftFlights(shiftFlights: Array<Flight>) {
    this._shiftFlights = shiftFlights;
    // Update Timeline
    this.updateTimeline();
    this.updateFlightAssignment();
  }

  /**
   * Gets Shift Flights
   *
   * @readonly
   * @type {Date}
   * @memberof AllocationmapforflightComponent
   */
  public get shiftFlights(): Array<Flight> {
    return this._shiftFlights;
  }

  /**
   * Sets Width
   */
  @Input("width")
  public set width(width: number) {
    if (this._width !== width) {
      this._width = width;
      // Update Timeline
      this.updateTimeline();
      this.updateFlightAssignment();
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
  @Input("height")
  public set height(height: number) {
    if (this._height !== height) {
      this._height = height;
      // Update Timeline
      this.updateTimeline();
      this.updateFlightAssignment();
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
    if (!this.shiftStartTime || !this.shiftEndTime) {
      return;
    }
    const timeline: Array<TimeLine> = [];
    let lastDay: string = "";
    let timelines: number = Math.round(this.width / this.timelineWidth);
    this.timelineStartTime = NgcUtility.subtractDate(
      this.shiftStartTime,
      1,
      DateTimeKey.HOURS
    );
    //
    for (let index = 0; index < timelines; index++) {
      const timeLine: TimeLine = new TimeLine();
      const time: Date = NgcUtility.addDate(
        this.timelineStartTime,
        index * 1,
        DateTimeKey.HOURS
      );
      const day: string = NgcUtility.getDateTimeAsStringByFormat(time, "DD/MM");
      //
      timeLine.time = time;
      //
      if (day !== lastDay) {
        lastDay = day;
        timeLine.changeDay = day;
      }
      timeLine.displayTime = NgcUtility.getDateTimeAsStringByFormat(time, "HH");
      //
      timeline.push(timeLine);
    }
    const startDiffWithTimeline: number =
      NgcUtility.dateDifference(new Date(), this.shiftStartTime) / 1000 / 60;
    const durationPerPixel: number = this.timelineWidth / this.timelineDuration;
    this.timeline = timeline;
  }

  /**
   * Update Flight Assignment
   */
  private updateFlightAssignment() {
    if (
      this.shiftStartTime &&
      this.shiftEndTime &&
      this.shiftFlights &&
      this.shiftFlights.length > 0
    ) {
      const startDiffWithTimeline: number =
        NgcUtility.dateDifference(this.shiftStartTime, this.timelineStartTime) /
        1000 /
        60;
      const flightBarTimeDiff: number =
        NgcUtility.dateDifference(this.shiftEndTime, this.shiftStartTime) /
        1000 /
        60;
      const durationPerPixel: number =
        this.timelineWidth / this.timelineDuration;
      // Find Position
      this.sx = durationPerPixel * startDiffWithTimeline;
      this.ex = durationPerPixel * (startDiffWithTimeline + flightBarTimeDiff);
      // Calculate SLA Events Time Line Properties
      this.shiftFlights.forEach((flight: Flight, index: number) => {
        const flightTimeDiff: number =
          NgcUtility.dateDifference(flight.std, this.timelineStartTime) /
          1000 /
          60;
        // Find Position
        flight.x = this.sx + durationPerPixel * flightTimeDiff;
        // console.log(`sx ${this.sx} ex ${this.ex} x = ${flight.x}`);
        //console.log(`${flight.std} ${this.shiftStartTime} = ${flightTimeDiff}`);
      });
    }
  }
}

/**
 * Allcation Map For Flight
 */
@NgModule({
  imports: [CommonModule],
  exports: [AllocationmapforflightComponent],
  declarations: [AllocationmapforflightComponent]
})
export class AllocationmapforflightComponentModule { }
