import { Injectable } from '@angular/core';

@Injectable()
export class ScheduleService {
  objFromMaintainToDisplay: any;
  objFromMaintainToCreate: any;
  backToFlightSchedule: any;
  copyScheduleFlag: boolean;
  sacheduleSave: boolean;
  scheduleCreated: boolean = false;
  dayDisabled: any = {};
  constructor() {
    this.dayDisabled.sunFlg = false;
    this.dayDisabled.monFlg = false;
    this.dayDisabled.tueFlg = false;
    this.dayDisabled.wedFlg = false;
    this.dayDisabled.thurFlg = false;
    this.dayDisabled.friFlg = false;
    this.dayDisabled.satFlg = false;
    this.copyScheduleFlag = false;
  }
}
