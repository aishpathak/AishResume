import { DatePipe } from '@angular/common';

import { FlightService } from './../../../flight.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input } from '@angular/core';
import { RestService, BaseRequest, PageConfiguration } from 'ngc-framework';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcReadOnlyComponent, NgcUtility
} from 'ngc-framework';
import {
  detailsScheduleRequest, detailsScheduleResponse,
  displayDetailsSchedule, FlightEnroutementRequest
} from './../../../flight.sharedmodel';
/**
 * display Flight schedule sub component
 * @export
 * @class ScheduledetailsComponent
 * @extends {NgcPage}
 * @implements {OnInit}
 */
@Component({
  selector: 'ngc-scheduledetails',
  templateUrl: './scheduledetails.component.html',
  styleUrls: ['./scheduledetails.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ScheduledetailsComponent extends NgcPage {
  displayJointFlight: boolean;
  @Input()
  responseServer: any;
  @Input()
  index: any;
  private checkboxForm: NgcFormGroup = new NgcFormGroup
    ({
      isAll: new NgcFormControl(true),
      isMon: new NgcFormControl(true),
      isTue: new NgcFormControl(true),
      isWed: new NgcFormControl(true),
      isThu: new NgcFormControl(true),
      isFri: new NgcFormControl(true),
      isSat: new NgcFormControl(true),
      isSun: new NgcFormControl(true),
      flightServiceType: new NgcFormControl(),
      description: new NgcFormControl(),
      flightType: new NgcFormControl(),
      charter: new NgcFormControl(),
      joint: new NgcFormControl(),
      assisted: new NgcFormControl(),
      ssm: new NgcFormControl(),
      codFrqNum: new NgcFormControl(),
      schFlightJointList: new NgcFormArray([]),
      schFlightLegs: new NgcFormArray([]),
      schFlightSegments: new NgcFormArray([])

    });
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private flightService: FlightService) {
    super(appZone, appElement, appContainerElement);
    // console.log('hello');
  }
  /**
   * on page load
   * @memberof ScheduledetailsComponent
   */
  ngOnInit() {
    (<NgcFormArray>this.checkboxForm.controls['schFlightJointList']).patchValue(this.responseServer.schFlightJointList);
    if (this.responseServer.schFlightLegs) {
      this.responseServer.schFlightLegs.forEach(element => {
        element.arrTime = element.arrTime;
        element.depTime = element.depTime;
      });
    }
    (<NgcFormArray>this.checkboxForm.controls['schFlightLegs']).patchValue(this.responseServer.schFlightLegs);
    (<NgcFormArray>this.checkboxForm.controls['schFlightSegments']).patchValue(this.responseServer.schFlightSegments);
    this.setAllData();
    this.refresh();
  }

  /**
   * setting joint flight
   * @memberof ScheduledetailsComponent
   */
  setAllData() {
    this.checkboxForm.get('joint').setValue(
      (this.responseServer.sunJntFlg ||
        this.responseServer.monJntFlg ||
        this.responseServer.tueJntFlg ||
        this.responseServer.wedJntFlg ||
        this.responseServer.thuJntFlg ||
        this.responseServer.friJntFlg ||
        this.responseServer.satJntFlg) ? 'Y' : 'N'
    );

    this.checkboxForm.get('assisted').setValue(this.responseServer.assisted);
    this.checkboxForm.get('ssm').setValue(this.responseServer.ssmFlag);
    this.checkboxForm.get('isSun').setValue(this.responseServer.sunFlg);
    this.checkboxForm.get('isMon').setValue(this.responseServer.monFlg);
    this.checkboxForm.get('isTue').setValue(this.responseServer.tueFlg);
    this.checkboxForm.get('isWed').setValue(this.responseServer.wedFlg);
    this.checkboxForm.get('isThu').setValue(this.responseServer.thurFlg);
    this.checkboxForm.get('isFri').setValue(this.responseServer.friFlg);
    this.checkboxForm.get('isSat').setValue(this.responseServer.satFlg);
    this.checkboxForm.get('flightType').setValue(this.responseServer.flightType);
    this.checkboxForm.get('flightServiceType').setValue(this.responseServer.flightServiceType);
    this.checkboxForm.get('description').setValue(this.responseServer.description);
    this.checkboxForm.get('isAll').setValue(
      this.checkboxForm.get('isSun').value &&
      this.checkboxForm.get('isMon').value &&
      this.checkboxForm.get('isTue').value &&
      this.checkboxForm.get('isWed').value &&
      this.checkboxForm.get('isThu').value &&
      this.checkboxForm.get('isFri').value &&
      this.checkboxForm.get('isSat').value
    );
    this.checkboxForm.get('codFrqNum').setValue(this.responseServer.codFrqNum);
  }
}
