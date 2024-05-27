import { ScheduledetailseditableComponent } from './../reusablecomponent/scheduledetailseditable/scheduledetailseditable.component';
import { ScheduleService } from './../schedule.service';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, PageConfiguration, NgcUtility } from 'ngc-framework';
import { FlightService } from './../../flight.service';
import { detailsScheduleRequest, maintainFlightScheduleRQ, GenerateOperativeFlightRQ, FindSchedule } from './../../flight.sharedmodel';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChildren } from '@angular/core';

/**
 * this class is related to save / update Flight schedule
 * @export
 * @class ModifyscheduleComponent
 * @extends {NgcPage}
 * @implements {OnInit}
 */

@Component({
  selector: 'app-modifyschedule',
  templateUrl: './modifyschedule.component.html',
  styleUrls: ['./modifyschedule.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  functionId: 'MAINTAIN_FLIGHT_SCHEDULE_'


})
export class ModifyscheduleComponent extends NgcPage {
  @ViewChildren(ScheduledetailseditableComponent) schedules: any;
  createNew: boolean;
  createNewEdit: boolean;

  resp: any;
  resp1: any = [];
  fromMax: any;
  toMin: any;
  reqData: any = {};
  hideHandlerDropdown: boolean;
  flightCarrierCode: any;
  isFight8Flag: boolean = false;
  flightNumber: any;
  // date = new Date();
  // todayDate: Date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());

  deleteSchedule: Array<any> = new Array<any>();
  isDeletePeriod = false;
  isDeleteSchedule = false;


  detailsScheduleForm: NgcFormGroup = new NgcFormGroup
    ({
      flightCarrierCode: new NgcFormControl(),
      flightNumber: new NgcFormControl(),
      flight: new NgcFormControl(),
      flightName: new NgcFormControl(),
      dateFrom: new NgcFormControl(),
      dateTo: new NgcFormControl(),
      apron: new NgcFormControl(false),
      assisted: new NgcFormControl(),
      groundHandler: new NgcFormControl(),
      flightSchedulePeriodID: new NgcFormControl(),
      //copyFlag: new NgcFormControl(),
      defaultGroundHandler: new NgcFormControl()
    });

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService,
    private scheduleService: ScheduleService) {
    super(appZone, appElement, appContainerElement);
  }
  /**
   * onload this method calls
   * @memberof ModifyscheduleComponent
   */
  ngOnInit() {
    const transferData = this.getNavigateData(this.route);
    if (transferData) {
      this.reqData = transferData;
    }
    this.isFight8Flag = false;
    this.createNewEdit = false;
    this.hideHandlerDropdown = true;
    this.scheduleService.dayDisabled.isAll = false;
    this.scheduleService.dayDisabled.sunFlg = false;
    this.scheduleService.dayDisabled.monFlg = false;
    this.scheduleService.dayDisabled.tueFlg = false;
    this.scheduleService.dayDisabled.wedFlg = false;
    this.scheduleService.dayDisabled.thurFlg = false;
    this.scheduleService.dayDisabled.friFlg = false;
    this.scheduleService.dayDisabled.satFlg = false;
    this.route.params.subscribe(params => {
      if (params.id === 'create' || params.id === 'add') {
        this.createNew = true;
      } else if (params.id === 'copy') {

      } else {
        this.createNew = false;
      }
    });
    let detailsRequest;
    if (!this.createNew) {
      detailsRequest = JSON.parse(JSON.stringify(this.scheduleService.objFromMaintainToDisplay));
      this.scheduleService.objFromMaintainToDisplay = detailsRequest;
    } else {
      detailsRequest = JSON.parse(JSON.stringify(this.scheduleService.objFromMaintainToCreate));
      this.flightService.getHandlerbyCarrier(detailsRequest.flightCarrierCode).subscribe(record => {
        detailsRequest.defaultGroundHandler = record.data;
      });
      this.scheduleService.backToFlightSchedule = detailsRequest;
    }
    this.detailsScheduleForm.get('flight').setValue(detailsRequest.flight);
    this.detailsScheduleForm.get('flightName').setValue(detailsRequest.flightName);
    this.detailsScheduleForm.get('flightCarrierCode').setValue(detailsRequest.flightCarrierCode);
    this.detailsScheduleForm.get('flightNumber').setValue(detailsRequest.flightNumber);
    this.detailsScheduleForm.get('assisted').setValue(detailsRequest.assisted);
    this.detailsScheduleForm.get('groundHandler').setValue(detailsRequest.groundHandler);
    this.detailsScheduleForm.get('flightSchedulePeriodID').setValue(detailsRequest.flightSchedulePeriodID);

    if (!this.createNew) {
      this.detailsScheduleForm.get('dateTo').patchValue(detailsRequest.copyToDate);
      this.detailsScheduleForm.get('dateFrom').patchValue(detailsRequest.copyFromDate);
      //this.detailsScheduleForm.get('copyFlag').patchValue(detailsRequest.copyFlag);
      this.detailsScheduleForm.get('apron').setValue(detailsRequest.apron);
      if (!detailsRequest.copyToDate) {
        this.detailsScheduleForm.get('dateTo').patchValue(detailsRequest.dateTo);
        this.detailsScheduleForm.get('dateFrom').patchValue(detailsRequest.dateFrom);
        // this.detailsScheduleForm.get('copyFlag').patchValue(detailsRequest.copyFlag);

      }
    }


    this.refresh();
    if (this.createNew) {
      if (detailsRequest.defaultGroundHandler === 'SATS') {
        this.detailsScheduleForm.get('groundHandler').setValue('SATS');
        this.hideHandlerDropdown = true;
      } else {
        this.detailsScheduleForm.get('groundHandler').setValue(detailsRequest.defaultGroundHandler);
        this.hideHandlerDropdown = false;
      }
    }
    if (this.createNew) {
      this.resp1 = [{
        flightCarrierCode: this.detailsScheduleForm.get('flightCarrierCode').value,
        flightNumber: this.detailsScheduleForm.get('flightNumber').value,
        flight: this.detailsScheduleForm.get('flight').value,
        apron: this.detailsScheduleForm.get('apron').value,
        assisted: this.detailsScheduleForm.get('assisted').value,
        groundHandler: this.detailsScheduleForm.get('groundHandler').value
      }];
    }
    if (!this.createNew) {
      this.hideHandlerDropdown = true;
      const findOperationReq: FindSchedule = new FindSchedule();
      findOperationReq.groundHandler = detailsRequest.groundHandler;
      findOperationReq.dateFrom = detailsRequest.dateFrom;
      findOperationReq.dateTo = detailsRequest.dateTo;
      findOperationReq.flight = detailsRequest.flight;
      findOperationReq.flightCarrierCode = detailsRequest.flightCarrierCode;
      findOperationReq.flightNumber = detailsRequest.flightNumber;
      findOperationReq.flightSchedulePeriodID = detailsRequest.flightSchedulePeriodID;
      findOperationReq.flightName = detailsRequest.flightName;
      // findOperationReq.copyFlag = detailsRequest.copyFlag;

      this.flightService.getDetailsSchedule(findOperationReq).subscribe(data => {
        const response = data.data;
        // this.detailsScheduleForm.patchValue(data);
        this.detailsScheduleForm.get('flightName').setValue(response.flightName);
        this.detailsScheduleForm.get('flightSchedulePeriodID').setValue(response.flightSchedulePeriodID);
        this.detailsScheduleForm.get('apron').setValue(response.apron);
        this.detailsScheduleForm.get('groundHandler').setValue(response.groundHandler);
        if (response.groundHandler === 'SATS') {
          this.detailsScheduleForm.get('groundHandler').setValue(response.groundHandler);
          this.hideHandlerDropdown = true;
        } else {
          this.detailsScheduleForm.get('groundHandler').setValue(response.groundHandler);
          this.hideHandlerDropdown = false;
        }
        this.resp = response.schFlightList;
        const newArray: Array<any> = new Array<any>();
        const count = 0;
        this.resp.forEach(element => {
          if (this.scheduleService.copyScheduleFlag) {
            element['flagInsert'] = 'N';
            element['isCreated'] = 'Y';
          } else {
            element['flagUpdate'] = 'Y';
          }
          if (element.factList !== null) {
            element.factList.forEach(element1 => {
              if (this.scheduleService.copyScheduleFlag) {
                element1['flagInsert'] = 'Y';
              } else {
                element1['flagUpdate'] = 'Y';
              }
            });
          }
          if (element.schFlightLegs !== null) {
            element.schFlightLegs.forEach(element1 => {
              if (this.scheduleService.copyScheduleFlag) {
                element1['flagInsert'] = 'Y';
              } else {
                element1['flagUpdate'] = 'Y';
              }
            });
          }

          if (element.schFlightSegments !== null) {
            element.schFlightSegments.forEach(element1 => {
              if (this.scheduleService.copyScheduleFlag) {
                element1['flagInsert'] = 'Y';
              } else {
                element1['flagUpdate'] = 'Y';
              }
            });
          }
          if (this.scheduleService.copyScheduleFlag) {
            element.schFlightSegments = [];
          }
        });
      });
    }
  }

  /**
   * save Flight schedule
   * @param {any}
   * @returns
   * @memberof ModifyscheduleComponent
   */
  onSave(event) {

    let scheduleList: Array<any> = new Array<any>();
    let scheduleCount = 1;
    let legCount = 1;
    let factCount = 1;
    const airports = [];
    if (!this.detailsScheduleForm.get('groundHandler').value) {
      return this.showErrorMessage("Please select handler!");
    }
    const schPeriod: maintainFlightScheduleRQ = new maintainFlightScheduleRQ();
    schPeriod.flightSchedulePeriodID = this.detailsScheduleForm.get('flightSchedulePeriodID').value;
    schPeriod.flightCarrierCode = this.detailsScheduleForm.get('flightCarrierCode').value;
    schPeriod.flightNumber = this.detailsScheduleForm.get('flightNumber').value;
    schPeriod.flight = this.detailsScheduleForm.get('flight').value;
    schPeriod.dateFrom = this.detailsScheduleForm.getRawValue().dateFrom;
    schPeriod.dateTo = this.detailsScheduleForm.getRawValue().dateTo;
    schPeriod.groundHandler = this.detailsScheduleForm.get('groundHandler').value;
    schPeriod.apron = this.detailsScheduleForm.get('apron').value;

    for (const scheduleInstance of this.schedules._results) {
      let numberPattern = /^[0-9]$/;
      const sch = (<NgcFormGroup>scheduleInstance.form).getRawValue();

      scheduleInstance.form.validate();
      if (!scheduleInstance.form.valid) {
        this.detailsScheduleForm.validate();
        if (!this.detailsScheduleForm.valid) {
          this.showErrorMessage('flight.operation.failed');
          return;
        }
        this.showErrorMessage('flight.operation.failed');
        return;
      }

      for (let i = 0; i < sch.schFlightLegs.length; i++) {
        for (let j = i; j < sch.schFlightLegs.length; j++) {
          if (i != j && sch.schFlightLegs[i].offPt === sch.schFlightLegs[j].offPt
            && sch.schFlightLegs[i].brdPt === sch.schFlightLegs[j].brdPt) {
            this.showErrorStatus('flight.invalid.leg');
            return;
          }
        }
      }


      if (sch.schFlightLegs != null) {
        var airportList = [];
        var idx = 0;
        sch.schFlightLegs.forEach(eleArp => {
          if (idx == 0) {
            airportList.push(eleArp.brdPt);
          }
          idx++;
          airportList.push(eleArp.offPt);

          if (this.isEightOrNine(airportList)) {
            this.isFight8Flag = true;
            this.showErrorStatus('flight.invalid.flight.route');
            return;
          } else {
            this.isFight8Flag = false;
          }
        });
      }

      if (this.createNew) {
        schPeriod['flagInsert'] = 'Y';
        sch['apron'] = this.detailsScheduleForm.get('apron').value;
        sch['codFrqNum'] = scheduleCount;
        sch['flagInsert'] = 'Y';
        sch['ssmFlag'] = false;
        sch['createdBy'] = 'SYSADMIN';

        for (const eachRow of sch.schFlightLegs) {
          eachRow['codLegOrder'] = legCount;
          eachRow['createdBy'] = 'SYSADMIN';
          ++legCount;
        }
        legCount = 1;
        for (const eachRow of sch.factList) {
          eachRow['sequnceNumber'] = factCount;
          eachRow['createdBy'] = 'SYSADMIN';
          ++factCount;
        } factCount = 1;

        for (const eachRow of sch.schFlightJointList) {
          eachRow['createdBy'] = 'SYSADMIN';
        }

        for (let i = 0; i < sch.schFlightLegs.length; i++) {
          if (sch.schFlightLegs[i].offPt === sch.schFlightLegs[i].brdPt) {
            scheduleList = new Array<any>();
            this.showErrorStatus('flight.leg.off.board.point.different');
            return;
          }
        }
        for (let i = 1; i < sch.schFlightLegs.length; i++) {

          if (sch.schFlightLegs[i - 1].offPt !== sch.schFlightLegs[i].brdPt) {
            scheduleList = new Array<any>();

            this.showErrorStatus('flight.board.point.same.off.point');
            return;
          }
        }
        let checkDayChange: number = sch.schFlightLegs[0].dayChangeDep;
        for (let i = 0; i < sch.schFlightLegs.length; i++) {
          if (!numberPattern.test(sch.schFlightLegs[i].dayChangeDep)) {
            this.showErrorStatus('flight.enter.number.day.change');
            return;
          }
          if (checkDayChange > sch.schFlightLegs[i].dayChangeDep) {
            this.showErrorStatus('flight.invalid.day.change');
            return;
          }
          checkDayChange = sch.schFlightLegs[i].dayChangeDep;
          if (!numberPattern.test(sch.schFlightLegs[i].dayChangeArr)) {
            this.showErrorStatus('flight.enter.number.day.change');
            return;
          }
          if (checkDayChange > sch.schFlightLegs[i].dayChangeArr) {
            this.showErrorStatus('flight.invalid.day.change');
            return;
          }
          checkDayChange = sch.schFlightLegs[i].dayChangeArr;
        }
        ++scheduleCount;
      } else if (this.scheduleService.copyScheduleFlag) {
        schPeriod['flagInsert'] = 'Y';
        schPeriod['createdBy'] = 'SYSADMIN';
        sch['flagInsert'] = 'Y';
        sch['isCreated'] = 'Y';
        sch['flagSaved'] = 'N';
        sch['createdBy'] = 'SYSADMIN';
        sch['ssmFlag'] = false;
        for (const eachRow of sch.schFlightLegs) {
          eachRow['flagInsert'] = 'Y';
          eachRow['flagSaved'] = 'N';
          eachRow['createdBy'] = 'SYSADMIN';
        }
        for (const eachRow of sch.factList) {
          eachRow['flagInsert'] = 'Y';
          eachRow['flagSaved'] = 'N';
          eachRow['createdBy'] = 'SYSADMIN';
        }
        for (const eachRow of sch.schFlightJointList) {
          eachRow['createdBy'] = 'SYSADMIN';
        }

        for (let i = 0; i < sch.schFlightLegs.length; i++) {
          if (sch.schFlightLegs[i].offPt === sch.schFlightLegs[i].brdPt) {
            scheduleList = new Array<any>();
            this.showErrorStatus('flight.leg.off.board.point.different');
            return;
          }
        }

        for (let i = 1; i < sch.schFlightLegs.length; i++) {
          if (sch.schFlightLegs[i - 1].offPt !== sch.schFlightLegs[i].brdPt) {
            scheduleList = new Array<any>();
            this.showErrorStatus('flight.board.point.same.off.point');
            return;
          }
        }

        let checkDayChange: number = sch.schFlightLegs[0].dayChangeDep;

        for (let i = 0; i < sch.schFlightLegs.length; i++) {
          if (!numberPattern.test(sch.schFlightLegs[i].dayChangeDep)) {
            this.showErrorStatus('flight.enter.number.day.change');
            return;
          }
          if (checkDayChange > sch.schFlightLegs[i].dayChangeDep) {
            this.showErrorStatus('flight.invalid.day.change');
            return;
          }
          checkDayChange = sch.schFlightLegs[i].dayChangeDep;
          if (!numberPattern.test(sch.schFlightLegs[i].dayChangeArr)) {
            this.showErrorStatus('flight.enter.number.day.change');
            return;
          }
          if (checkDayChange > sch.schFlightLegs[i].dayChangeArr) {
            this.showErrorStatus('flight.invalid.day.change');
            return;
          }
          checkDayChange = sch.schFlightLegs[i].dayChangeArr;
        }

      } else {
        for (let i = 0; i < sch.schFlightLegs.length; i++) {
          if (sch.schFlightLegs[i].offPt === sch.schFlightLegs[i].brdPt) {
            scheduleList = new Array<any>();
            this.showErrorStatus('flight.leg.off.board.point.different');
            return;
          }
        }


        for (let i = 1; i < sch.schFlightLegs.length; i++) {

          if (sch.schFlightLegs[i - 1].offPt !== sch.schFlightLegs[i].brdPt) {
            scheduleList = new Array<any>();
            this.showErrorStatus('flight.board.point.same.off.point');
            return;
          }
        }

        if (sch.schFlightLegs[0] != undefined) {
          let checkDayChange: number = sch.schFlightLegs[0].dayChangeDep;

          for (let i = 0; i < sch.schFlightLegs.length; i++) {
            if (!numberPattern.test(sch.schFlightLegs[i].dayChangeDep)) {
              this.showErrorStatus('flight.enter.number.day.change');
              return;
            }
            if (checkDayChange > sch.schFlightLegs[i].dayChangeDep) {
              this.showErrorStatus('flight.invalid.day.change');
              return;
            }
            checkDayChange = sch.schFlightLegs[i].dayChangeDep;
            if (!numberPattern.test(sch.schFlightLegs[i].dayChangeArr)) {
              this.showErrorStatus('flight.enter.number.day.change');
              return;
            }
            if (checkDayChange > sch.schFlightLegs[i].dayChangeArr) {
              this.showErrorStatus('flight.invalid.day.change');
              return;
            }
            checkDayChange = sch.schFlightLegs[i].dayChangeArr;
          }
        }
        schPeriod['flagUpdate'] = 'Y';
        sch['createdBy'] = 'SYSADMIN';
        sch['ssmFlag'] = sch.ssmFlag === 'SYS';
        if (sch.flagInsert !== 'Y') {
          sch['flagUpdate'] = 'Y';
        }

        for (const eachRow of sch.factList) {
          eachRow['createdBy'] = 'SYSADMIN';
          if (eachRow.flagInsert !== 'Y') {
            eachRow['flightScheduleID'] = sch.flightScheduleID;
            eachRow['flagUpdate'] = 'Y';
          }
        }

        for (const eachRow of sch.schFlightJointList) {
          this.createdByAttach(eachRow);
          eachRow['flagUpdate'] = 'N';
          if (eachRow.flagInsert !== 'Y') {
            eachRow['flightScheduleID'] = sch.flightScheduleID;
            eachRow['flagUpdate'] = 'N';
          }
        }



        for (const eachRow of sch.deletedFactList) {
          sch.factList.push(eachRow);
        }

        for (const eachRow of sch.deletedJointList) {
          sch.schFlightJointList.push(eachRow);
        }

        for (const eachRow of sch.deletedSegmentList) {
          sch.schFlightSegments.push(eachRow);
        }

        for (const eachRow of sch.deletedschFlightLegs) {
          sch.schFlightLegs.push(eachRow);
        }
      }

      scheduleList.push(sch);
    }
    scheduleList.forEach(ele => {
      if (ele.joint && ele.joint === true) {
        ele['friJntFlg'] = ele.friFlg;
        ele['monJntFlg'] = ele.monFlg;
        ele['satJntFlg'] = ele.satFlg;
        ele['sunJntFlg'] = ele.sunFlg;
        ele['thuJntFlg'] = ele.thurFlg;
        ele['tueJntFlg'] = ele.tueFlg;
        ele['wedJntFlg'] = ele.wedFlg;
      }
    });
    this.setFlagForDelete();
    if (this.deleteSchedule.length > 0) {
      if (!this.scheduleService.copyScheduleFlag && !this.createNew) {
        if (this.schedules._results.length === 0) {
          schPeriod['flagDelete'] = 'Y';
          schPeriod['flagInsert'] = 'N';
          schPeriod['flagUpdate'] = 'N';
          this.isDeletePeriod = true;
        } else {
          schPeriod['flagDelete'] = 'N';
          schPeriod['flagInsert'] = 'N';
          schPeriod['flagUpdate'] = 'Y';
          this.isDeleteSchedule = true;
        }
        this.deleteSchedule.forEach(delSch => scheduleList.push(delSch));
      }
    }

    schPeriod.schFlightList = scheduleList;

    if (!this.isFight8Flag) {
      this.flightService.saveDetailsSchedule(schPeriod).subscribe(resp => {
        const responce = resp.data;
        if (!this.showResponseErrorMessages(resp)) {
          this.scheduleService.sacheduleSave = true;
          const x: any = responce;
          const schedulePeriod = {
            flightCarrierCode: x.flightCarrierCode,
            flightNumber: x.flightNumber,
            flight: this.detailsScheduleForm.get('flight').value,
            flightName: this.detailsScheduleForm.get('flightName').value,
            groundHandler: this.detailsScheduleForm.get('groundHandler').value,
            defaultGroundHandler: this.detailsScheduleForm.get('defaultGroundHandler').value,
            dateFrom: new Date(NgcUtility.toDateFromLocalDate(x.dateFrom)),
            dateTo: new Date(NgcUtility.toDateFromLocalDate(x.dateTo)),
            apron: x.apron,
            flightSchedulePeriodID: x.flightSchedulePeriodID
          };

          this.scheduleService.objFromMaintainToDisplay = schedulePeriod;
          this.scheduleService.backToFlightSchedule = schedulePeriod;
          if (this.isDeletePeriod || this.isDeleteSchedule) {
            // this.router.navigate(['flight', 'maintainschedule', ' ']);
            // this.navigateTo(this.router, '/flight/maintainschedule', this.scheduleService.backToFlightSchedule);
            // this.router.navigate(['flight', 'detailsschedule']);
            // var dataToSend = {
            //   flightCarrierCode: x.flightCarrierCode,
            //   flightNumber: x.flightNumber,
            // }
            // this.navigateTo(this.router, '/flight/maintainschedule', dataToSend);
            this.showSuccessStatus('operation.success');
          } else if (this.createNew || this.scheduleService.copyScheduleFlag) {
            this.showSuccessStatus('flight.schedule.created.success');
            this.scheduleService.scheduleCreated = true;
          } else {
            // const goprReq: GenerateOperativeFlightRQ = new GenerateOperativeFlightRQ();
            // goprReq.dateFrom = new Date(NgcUtility.toDateFromLocalDate(x.dateFrom)),
            //   goprReq.dateTo = new Date(NgcUtility.toDateFromLocalDate(x.dateTo)),
            //   goprReq.flight = this.detailsScheduleForm.get('flight').value,
            //   goprReq.flightCarrierCode = x.flightCarrierCode,
            //   goprReq.flightNumber = x.flightNumber,
            //   goprReq.flightSchedulePeriodID = x.flightSchedulePeriodID
            // this.flightService.getGeneratedOperativeFlight(goprReq).subscribe(resp => {
            //   if (resp.messageList === null) {

            //   } else {
            //     this.showErrorStatus('No Data Found');

            //   }
            //this.refresh();

            this.navigateTo(this.router, '/flight/maintainschedule/U', this.reqData);

            this.showSuccessStatus('flight.schedule.updated');
          }

          setTimeout(() => {
            if (this.isDeletePeriod) {
              this.navigateTo(this.router, '/flight/maintainschedule', this.scheduleService.backToFlightSchedule);
              // this.router.navigate(['flight', 'maintainschedule', '  ']);
            } else {
              this.router.navigate(['flight', 'detailsschedule']);
            }
          }, 10);

        } else {
          const response = resp.messageList[0].message;
          this.showErrorStatus(resp.messageList[0].message);
          if (response !== null) {
            this.showErrorStatus(resp.messageList[0].message);
            return;
          }
          this.router.navigate(['flight', 'maintainschedule', ' ']);
        }
      }, error => {
        this.showErrorStatus("Error:" + error);
      });
    }
  }

  isEightOrNine(airports) {
    if (airports.length < 5) {
      return false;
    }

    if (airports.length = 5) {
      return this.isEight(airports);
    }

    if (airports.length = 6) {
      return this.isNine(airports);
    }
  }

  isEight(airports) {
    for (let i = 0; i < airports.length / 2; i++) {
      if ((NgcUtility.isTenantAirport(airports[0])) && (NgcUtility.isTenantAirport(airports[airports.length - 1]))) {
        return true;
      }

    }
    return false;
  }

  isNine(airports) {
    airports.pop();
    for (let i = 0; i < airports.length / 2; i++) {
      if ((NgcUtility.isTenantAirport(airports[0])) && (!NgcUtility.isTenantAirport(airports[airports.length - 1]))) {
        return true;
      }
    }
    return false;
  }

  /**
   * attaching created by
   * @param {any}
   * @memberof ModifyscheduleComponent
   */
  createdByAttach(obj) {
    obj['createdBy'] = 'SYSADMIN';
  }

  /**
   * reset flight schedule
   * @param {any}
   * @memberof ModifyscheduleComponent
   */
  onClear(event) {
    this.resp = [];
    this.resp1 = [];
  }
  /**
   * new Flight SChedule
   * @memberof ModifyscheduleComponent
   */
  addNewSchedule() {
    if (this.scheduleService.dayDisabled.sunFlg && this.scheduleService.dayDisabled.monFlg && this.scheduleService.dayDisabled.tueFlg &&
      this.scheduleService.dayDisabled.wedFlg && this.scheduleService.dayDisabled.thurFlg && this.scheduleService.dayDisabled.friFlg &&
      this.scheduleService.dayDisabled.satFlg) {
      this.showErrorStatus('flight.max.schedule.addedd');
    } else if (this.resp1.length > 6 || (this.resp && this.resp.length > 6)) {
      this.showErrorStatus('flight.max.schedule.addedd');
    } else {
      if (this.createNew) {
        this.resp1.push({
          flightSchedulePeriodID: this.detailsScheduleForm.get('flightSchedulePeriodID').value,
          assisted: this.detailsScheduleForm.get('assisted').value,
          flagUpdate: 'N',
          flagInsert: 'Y',
          flagDelete: 'N',
          flightCarrierCode: this.detailsScheduleForm.get('flightCarrierCode').value,
          flight: this.detailsScheduleForm.get('flight').value
        });
      } else {
        this.createNewEdit = true;
        this.resp.push({
          flightSchedulePeriodID: this.detailsScheduleForm.get('flightSchedulePeriodID').value,
          assisted: this.detailsScheduleForm.get('assisted').value,
          flagUpdate: 'N',
          flagInsert: 'Y',
          flagDelete: 'N',
          flightCarrierCode: this.detailsScheduleForm.get('flightCarrierCode').value,
          flight: this.detailsScheduleForm.get('flight').value
        });
      }
      this.refresh();
    }
  }


  /**
   * Days Validation
   * @param {any}
   * @memberof ModifyscheduleComponent
   */
  disableCheckBox(data) {
    if (data.index > 0 && this.schedules._results.length > 0) {
      this.schedules._results[0]['isAllDisabled'] = true;
    }
    this.scheduleService.dayDisabled[data.day] = data.value;
    for (let i = 0; i < this.schedules.length; i++) {
      if (data.index !== i) {
        this.schedules._results[i][data.day + 'Disabled'] = data.value;
      }
    }
  }

  /**
   * delete schedule
   * @param {any}
   * @memberof ModifyscheduleComponent
   */
  deleteSChedule(scheduleIndex) {
    const deleteScheduleRS = this.schedules._results[scheduleIndex];
    const isAllDisabled = deleteScheduleRS.isAllDisabled;
    const monFlgDisabled = deleteScheduleRS.monFlgDisabled;
    const tueFlgDisabled = deleteScheduleRS.tueFlgDisabled;
    const wedFlgDisabled = deleteScheduleRS.wedFlgDisabled;
    const thurFlgDisabled = deleteScheduleRS.thurFlgDisabled;
    const friFlgDisabled = deleteScheduleRS.friFlgDisabled;
    const satFlgDisabled = deleteScheduleRS.satFlgDisabled;
    const sunFlgDisabled = deleteScheduleRS.sunFlgDisabled;

    if (this.createNew) {
      this.resp1.splice(scheduleIndex, 1);
    } else if (this.scheduleService.copyScheduleFlag) {
      this.resp.splice(scheduleIndex, 1);
    } else {
      this.deleteSchedule.push(JSON.parse(JSON.stringify(this.resp[scheduleIndex])));
      this.resp.splice(scheduleIndex, 1);
    }
    for (let i = 0; i < this.schedules.length; i++) {
      if (this.schedules.length === 2) { this.schedules._results[i]['isAllDisabled'] = false; }
      if (!monFlgDisabled) {
        this.schedules._results[i]['monFlgDisabled'] = monFlgDisabled;
        this.scheduleService.dayDisabled.monFlg = false;
      }
      if (!tueFlgDisabled) {
        this.schedules._results[i]['tueFlgDisabled'] = tueFlgDisabled;
        this.scheduleService.dayDisabled.tueFlg = false;
      }
      if (!wedFlgDisabled) {
        this.schedules._results[i]['wedFlgDisabled'] = wedFlgDisabled;
        this.scheduleService.dayDisabled.wedFlg = false;
      }
      if (!thurFlgDisabled) {
        this.schedules._results[i]['thurFlgDisabled'] = thurFlgDisabled;
        this.scheduleService.dayDisabled.thurFlg = false;
      }
      if (!friFlgDisabled) {
        this.schedules._results[i]['friFlgDisabled'] = friFlgDisabled;
        this.scheduleService.dayDisabled.friFlg = false;
      }
      if (!satFlgDisabled) {
        this.schedules._results[i]['satFlgDisabled'] = satFlgDisabled;
        this.scheduleService.dayDisabled.satFlg = false;
      }
      if (!sunFlgDisabled) {
        this.schedules._results[i]['sunFlgDisabled'] = sunFlgDisabled;
        this.scheduleService.dayDisabled.sunFlg = false;
      }
    }
  }

  /**
   * for delete schedule
   * @memberof ModifyscheduleComponent
   */
  setFlagForDelete() {
    this.deleteSchedule.forEach(sch => {
      sch['flagDelete'] = 'Y';
      sch['flagInsert'] = 'N';
      sch['flagUpdate'] = 'N';
      sch.createdOn = null;
      sch.modifiedOn = null;
      sch.ssmFlag = null;
      if (sch.schFlightLegs) {
        for (const eachRow of sch.schFlightLegs) {
          eachRow['flagDelete'] = 'Y';
          eachRow['flagInsert'] = 'N';
          eachRow['flagUpdate'] = 'N';
          eachRow.createdOn = null;
          eachRow.modifiedOn = null;
          eachRow.arrTime = eachRow.arrTime;
          eachRow.depTime = eachRow.depTime;
        }
      }
      if (sch.factList) {
        for (const eachRow of sch.factList) {
          eachRow['flagDelete'] = 'Y';
          eachRow['flagInsert'] = 'N';
          eachRow['flagUpdate'] = 'N';
          eachRow.createdOn = null;
          eachRow.modifiedOn = null;
        }
      }
      if (sch.schFlightJointList) {
        for (const eachRow of sch.schFlightJointList) {
          eachRow['flagDelete'] = 'Y';
          eachRow['flagInsert'] = 'N';
          eachRow['flagUpdate'] = 'N';
          eachRow.createdOn = null;
          eachRow.modifiedOn = null;
        }
      }
      if (sch.schFlightSegments) {
        for (const eachRow of sch.schFlightSegments) {
          eachRow['flagDelete'] = 'Y';
          eachRow['flagInsert'] = 'N';
          eachRow['flagUpdate'] = 'N';
          eachRow.createdOn = null;
          eachRow.modifiedOn = null;
        }
      }
    });
  }
  /**
   * convert json date array to json string
   * @param {any}
   * @returns {String}
   * @memberof ModifyscheduleComponent
   */
  convertJsonTime(dateObj): string {
    let returnObj = '';
    let hour: String = '' + dateObj.substring(0, 2);
    let min: String = '' + dateObj.substring(3, 5);
    // let sec: String = '';
    // if (dateObj[2]) {
    //   sec = '' + dateObj[2];
    // } else {
    //   sec = '0';
    // }
    hour = hour.length === 1 ? '0' + hour : hour;
    min = min.length === 1 ? '0' + min : min;
    //sec = sec.length === 1 ? '0' + sec : sec;
    // 10:24
    return '2017-10-11' + hour + ':' + min;
    //  + sec + '.000';

  }

  /**
   * date logic
   * @param {string}
   * @returns {string}
   * @memberof ModifyscheduleComponent
   */
  dateChange(s: string): string {
    const sArray: string[] = s.split(' ');
    return sArray[0] + 'T' + sArray[1];
  }

  /**
   * back To previous page
   * @param {any} $event
   * @memberof ModifyscheduleComponent
   */
  onCancel($event) {
    if (this.createNew) {
      this.navigateTo(this.router, '/flight/maintainschedule', this.scheduleService.backToFlightSchedule);
    } else {
      this.router.navigate(['flight', 'detailsschedule']);
    }
  }

}


