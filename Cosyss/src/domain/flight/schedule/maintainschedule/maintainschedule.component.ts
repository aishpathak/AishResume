import { Component, ElementRef, NgZone, ViewContainerRef } from '@angular/core';
// angular imports
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, PageConfiguration, NgcUtility } from 'ngc-framework';
import { FlightService } from '../../flight.service';
import { cancelOperativeFlight, createOperativeFlightRQ, FindSchedule, FlightSchedules, GenerateOperativeFlightRQ } from '../../flight.sharedmodel';
// Flight Module imports
import { OperativeFlight, OperativeFlightLeg } from './../../flight.sharedmodel';
import { ScheduleService } from './../schedule.service';

/**
 *  Mantain Flight Schedule main page
 * @export
 * @class MaintainscheduleComponent
 * @extends {NgcPage}
 * @implements {OnInit}
 */
@Component({
  selector: 'ngc-maintainschedule',
  templateUrl: './maintainschedule.component.html',
  styleUrls: ['./maintainschedule.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class MaintainscheduleComponent extends NgcPage {

  hasReadPermission: boolean = false;

  private form: NgcFormGroup = new NgcFormGroup({
    flightCarrierCode: new NgcFormControl('', [Validators.minLength(2), Validators.maxLength(3)]),
    flightNumber: new NgcFormControl('', [Validators.minLength(3), Validators.maxLength(5)]),
    flight: new NgcFormControl(),
    flightName: new NgcFormControl(),
    assisted: new NgcFormControl(),
    flightSchedulePeriodID: new NgcFormControl(),
    defaultGroundHandler: new NgcFormControl()
  });

  private scheduleForm: NgcFormGroup = new NgcFormGroup({
    flightScheduleGroupList: new NgcFormArray(
      [
        new NgcFormGroup({
          flightScheduleList: new NgcFormArray(
            [
            ]
          )
        })
      ]
    )
  });

  private operativeFlightForm: NgcFormGroup = new NgcFormGroup({
    checkAll: new NgcFormControl(true),
    checkAllforCancel: new NgcFormControl(true),
    // operativeFlightCheck1: new NgcFormControl(false),
    // operativeFlightCheck2: new NgcFormControl(false),
    // operativeFlightCheck3: new NgcFormControl(false),
    operativeFlighList1: new NgcFormArray([]),
    operativeFlighList2: new NgcFormArray([]),
    operativeFlighList3: new NgcFormArray([]),
    operativeFlighList4: new NgcFormArray([]),
    operativeFlighList5: new NgcFormArray([]),
    operativeFlighList6: new NgcFormArray([]),
    scheduleFlightList: new NgcFormArray([])
  });

  data;
  flight;
  flightName;
  schedulePDS: any[];
  focusPage = 0;
  focusIndex = -1;
  dataTable: Array<OperativeFlight>;
  ScheduleData;
  operativeData;
  reqData: any = {}
  giveAccess = false;
  showStat = true;
  showFlightSchedule = false;
  showICMSSchedule = false;
  showOperativeFlight = false;
  isBackFlag = false;
  isBackToDisplayFlag = false;
  showErrorMessages = true;
  isBackToDisplaySchedule = false;
  show = true;
  showSecond = false
  resp: any[] = [];
  calStart;
  calEnd;
  showHide = false;
  trueCount = 0;
  falseCount = 0;
  totalRowCount = 0;
  checkStatusInfo: any[] = [];
  flightAvbList: any = [];
  isMsgAvb: boolean = false;
  isMsgAvb1: boolean = false;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private _flightService: FlightService,
    private router: Router, private scheduleService: ScheduleService) {
    super(appZone, appElement, appContainerElement);
  }
  /**
   * on load
   * @memberof MaintainscheduleComponent
   */
  ngOnInit() {
    this.isMsgAvb1 = false;
    const transferData = this.getNavigateData(this.activatedRoute);
    this.showICMSSchedule = false;
    this.operativeFlightForm.controls.checkAll.setValue(true);
    this.operativeFlightForm.controls.checkAllforCancel.setValue(true);
    this.checkAll();
    this.checkAllforCancel();
    try {
      if (transferData) {
        if (transferData.carrierCode != null && transferData.flightNumber != null) {
          this.reqData = transferData
          this.form.get("flightCarrierCode").setValue(transferData.carrierCode);
          this.form.get("flightNumber").setValue(transferData.flightNumber);
          this.isBackToDisplaySchedule = true;
          this.submit();
        }
        this.isBackFlag = false;
        this.form.patchValue(this.scheduleService.backToFlightSchedule);
        this.submit();
      }
    } catch (e) { }

    this.activatedRoute.params.subscribe(params => {
      if (params.id === ' ') {
        this.isMsgAvb1 = true;
      }
      if (params.id === ' ') {
        this.isBackFlag = true;
        this.form.patchValue(this.scheduleService.backToFlightSchedule);
        this.isBackToDisplayFlag = true;
        this.submit();
      } else if (params.id === 'U') {
        this.isBackFlag = true;
        this.showErrorMessages = false;
        this.isBackToDisplayFlag = false;
        this.form.patchValue(this.scheduleService.backToFlightSchedule);
        this.submit();
        this.isBackFlag = false;
      }
    });
    // this.checkAll();
  }

  onClear() {
    this.refreshFormMessages(null, 'mainForm');
    this.flight = false;
    this.showOperativeFlight = false;
    this.ScheduleData = undefined;
    this.scheduleService.backToFlightSchedule = undefined;
    this.scheduleService.objFromMaintainToDisplay = undefined;
    (<NgcFormArray>this.scheduleForm.controls['flightScheduleGroupList']).resetValue([]);
    this.form.reset();
    this.scheduleForm.reset();
    this.operativeFlightForm.reset();
    this.showFlightSchedule = false;
  }

  /**
   *  on Search this method will call
   * @memberof MaintainscheduleComponent
   */
  submit() {
    this.hasReadPermission = NgcUtility.hasReadPermission('MAINTAIN_FLIGHT_SCHEDULE_');

    this.scheduleForm.validate();
    if (!this.scheduleForm.valid) {
      return;
    }
    this.showHide = true;
    this.calStart = new Date().getTime();
    if (!this.form.invalid) {
    } else {
      this.flight = undefined;
      const x: any[] = [];
      if (this.form.controls['flightCarrierCode'].value === '') {
        x.push({ referenceId: 'flightCarrierCode', message: 'Mandatory', type: 'E' });
      }
      if (this.form.controls['flightNumber'].value === '') {
        x.push({ referenceId: 'flightNumber', message: 'Mandatory', type: 'E' });
      }
      const data = { messageList: x };
      this.refreshFormMessages(data, 'mainForm');
    }
    if (this.form.controls['flightCarrierCode'].value !== '' && this.form.controls['flightNumber'].value !== '') {
      let body = this.form.controls['flightCarrierCode'].value;
      body = body + this.form.controls['flightNumber'].value;
      this.form.get('flight').setValue(body);
      this.focusPage = 0;
      this.ScheduleData = undefined;
      this.showOperativeFlight = false;
      const findSchedule: FindSchedule = new FindSchedule();
      findSchedule.flightCarrierCode = this.form.controls['flightCarrierCode'].value;
      findSchedule.flightNumber = this.form.controls['flightNumber'].value;
      findSchedule.flight = body;
      findSchedule.dateFrom = '2017-11-11';
      findSchedule.dateTo = '2017-11-11';

      this.scheduleService.objFromMaintainToCreate = {
        flightCarrierCode: this.form.controls['flightCarrierCode'].value,
        flightNumber: this.form.controls['flightNumber'].value,
        flight: body,
        flightName: this.form.controls['flightName'].value,
        assisted: this.form.controls['assisted'].value,
        defaultGroundHandler: this.form.controls['defaultGroundHandler'].value
      };

      const scheduleDetails: FlightSchedules = new FlightSchedules();
      scheduleDetails.carrierCode = this.form.controls['flightCarrierCode'].value;
      scheduleDetails.flightNumber = this.form.controls['flightNumber'].value;
      this._flightService.fetchFlightSchedules(scheduleDetails).subscribe(resp => {
        if (resp.data) {
          this.showICMSSchedule = true;
          this.data = resp;
          let sno = 0;
          this.data.data.forEach(ele => {
            sno++;
            ele.sno = sno;
            const fromDate = ele.effectiveFromDate.toString();
            ele.effectiveFromDate = new Date(fromDate);
            const toDate = ele.effectiveToDate.toString();
            ele.effectiveToDate = new Date(toDate);
          });
          this.operativeFlightForm.controls.scheduleFlightList.patchValue(this.data.data);
        }
      })


      this._flightService.getFlightSchedules(findSchedule).subscribe(resp => {
        this.data = resp;
        this.schedulePDS = this.data.data;
        this.refreshFormMessages(this.data, 'mainForm');
        const x = false;
        if (this.schedulePDS === null || this.schedulePDS.length < 1) {
          this.operativeData = undefined;

          this.flight = undefined;
          if (!this.data.messageList) {
            if (this.showErrorMessages) {

              this.showErrorStatus('flight.no.schedule.match');
            } else {
              this.showErrorMessages = true;
            }
          }
          this.showFlightSchedule = false;
          this.showOperativeFlight = false;
        }
        let subCount = 0;
        const check = 1;
        const flightScheduleGroupList: Array<any> = new Array<any>();
        let flightScheduleArray: Array<any> = new Array<any>();
        let focusi = 0;
        if (this.schedulePDS) {
          this.flight = body;
          for (let i = 0; i < this.schedulePDS.length; i++) {
            const count = i + 1;
            this.showFlightSchedule = true;
            this.schedulePDS[i]['schedule'] = 'SCHEDULE ' + count;
            this.schedulePDS[i]['flightName'] = this.form.get('flightName').value;
            this.schedulePDS[i]['assisted'] = this.form.get('assisted').value;
            if (this.setStringValue(this.schedulePDS[i].apron) == "NULL") {
              this.schedulePDS[i]['apronString'] = "NIL";
            } else {
              this.schedulePDS[i]['apronString'] = this.setStringValue(this.schedulePDS[i].apron);
            }
            this.schedulePDS[i].dateTo = new Date(this.convertJsonDate(this.schedulePDS[i].dateTo));
            this.schedulePDS[i].dateFrom = new Date(this.convertJsonDate(this.schedulePDS[i].dateFrom));
            flightScheduleArray.push(this.schedulePDS[i]);
            ++subCount;

            if (subCount === check) {
              flightScheduleGroupList.push({ flightScheduleList: flightScheduleArray });
              flightScheduleArray = new Array<any>();
              subCount = 0;
            }
          }
          if (subCount < check && subCount > 0) {
            flightScheduleGroupList.push({ flightScheduleList: flightScheduleArray });
          }

          (<NgcFormArray>this.scheduleForm.controls['flightScheduleGroupList']).patchValue(this.data.data);


          if (this.isBackFlag) {
            for (let i = 0; i < flightScheduleGroupList.length; i++) {
              for (let j = 0; j < flightScheduleGroupList[i].flightScheduleList.length; j++) {
                if (flightScheduleGroupList[i].flightScheduleList[j].flightSchedulePeriodID
                  === this.scheduleService.backToFlightSchedule.flightSchedulePeriodID) {
                  focusi = i;
                  this.focusIndex = j;
                  this.operativeData = flightScheduleGroupList[i].flightScheduleList[j];
                  // this.onCreate();
                }
              }
            }
          } else {
            for (let i = 0; i < flightScheduleGroupList.length; i++) {
              for (let j = 0; j <= flightScheduleGroupList[i].flightScheduleList.length; j++) {
                if (flightScheduleGroupList[i].flightScheduleList[j] != undefined &&
                  flightScheduleGroupList[i].flightScheduleList[j].currentSchedule) {
                  focusi = i;
                  this.focusIndex = j;
                  this.operativeData = flightScheduleGroupList[i].flightScheduleList[j];
                }
              }
            }
          }

          if (this.operativeData && this.isBackToDisplayFlag) {
            this.clicGet(this.operativeData, 1, 1);
          }
          else if (this.operativeData != undefined) {
            this.clicGet(this.operativeData, 1, 1);
          }

          this.refresh();
          setTimeout(() => {
            this.focusPage = focusi;
          }, 200);
          this.refresh();
        }
        this.showHide = false;
      },
        error => {
          this.showHide = false;
          this.showErrorStatus(error);
        });
    }
  }

  /**
   * convert json date array to json date
   * @param {any} dateObj
   * @returns {string}
   * @memberof MaintainscheduleComponent
   */
  convertJsonDate(dateObj): string {
    let returnObj = '';
    const year: String = '' + dateObj[0];
    let month: String = '' + dateObj[1];
    let day: String = '' + dateObj[2];
    month = month.length === 1 ? '0' + month : month;
    day = day.length === 1 ? '0' + day : day;
    returnObj = year + '-' + month + '-' + day;
    return returnObj;
  }



  /**
   *  on select of all operative Flight.
   * @memberof MaintainscheduleComponent
   */
  getVal() {
    // TO DO
  }

  /**
   * display oerative Flihgts
   * @param {any} data
   * @param {any} index
   * @param {any} page
   * @memberof MaintainscheduleComponent
   */
  clicGet(data, index, page) {
    if (page == 0) {
      this.isMsgAvb = false;
      this.isMsgAvb1 = false;
    }

    this.flightAvbList = [];
    this.resetFormMessages();
    if (index >= 0) {
      this.focusIndex = index;
    }
    if (page >= 0) {
      this.focusPage = page;
    }
    this.ScheduleData = data;
    this.dataTable = new Array<OperativeFlight>();

    this.scheduleService.objFromMaintainToDisplay = data;
    const endDate = new Date(this.scheduleService.objFromMaintainToDisplay.dateTo);
    const today = new Date();
    this.scheduleService.copyScheduleFlag = true;
    if (today.getTime() < endDate.getTime()) {
      this.giveAccess = false;
    } else {
      this.giveAccess = true;

    }
    const goprReq: GenerateOperativeFlightRQ = new GenerateOperativeFlightRQ();
    goprReq.dateFrom = this.ScheduleData.dateFrom;
    goprReq.dateTo = this.ScheduleData.dateTo;
    goprReq.flight = this.ScheduleData.flight;
    goprReq.flightCarrierCode = this.ScheduleData.flightCarrierCode;
    goprReq.flightNumber = this.ScheduleData.flightNumber;
    goprReq.flightSchedulePeriodID = this.ScheduleData.flightSchedulePeriodID;
    this._flightService.getGeneratedOperativeFlight(goprReq).subscribe(resp => {
      if (resp.messageList === null) {
        this.showOperativeFlight = false;
      } else {
        this.showErrorStatus('flight.no.record');
        this.operativeFlightForm.reset();
      }

      if (resp.data !== null) {
        this.resp = resp.data;
        if (this.isMsgAvb == false && this.isMsgAvb1 == true) {
          this.resp.forEach(resFlt => {
            if (resFlt.flightId != 0) {
              this.flightAvbList.push(NgcUtility.getDateTimeAsStringByFormat(resFlt.flightDate, "DD-MMM-YYYY"));
            }
          });

          var msg: any;
          var msg1: any;
          this.flightAvbList.forEach(element => {
            msg1 = element + " ";
          });
          msg = goprReq.flight + " for " + this.flightAvbList + " is already saved."
          if (this.flightAvbList.length > 0) {
            if (this.flightAvbList.length < 5) {
              this.showInfoStatus(msg);
            }
          }
        }


        if (this.resp.length < 1) {
          this.showOperativeFlight = false;
          this.showErrorStatus('flight.operative.not.found');
          return;
        }
        const List1: Array<any> = new Array<any>();
        const List2: Array<any> = new Array<any>();
        const List3: Array<any> = new Array<any>();
        const List4: Array<any> = new Array<any>();
        const List5: Array<any> = new Array<any>();
        const List6: Array<any> = new Array<any>();
        this.totalRowCount = this.resp.length;
        for (let i = 0; i < this.resp.length; i++) {
          let stat = null;
          if (this.resp[i].cancellation === 'A') {
            stat = true;
          } else if (this.resp[i].cancellation === 'D') {
            stat = false;
          } else {
            stat = null;
          }
          const oprFlt = {
            check: this.scheduleService.scheduleCreated = false,
            flightDate: new Date(this.resp[i].flightDate),
            routing: this.resp[i].routing,
            'status': stat
          };
          if (i < 10) {
            List1.push(oprFlt);
          }
          else if (i < 20) {
            List2.push(oprFlt);
          }
          else if (i < 30) {
            List3.push(oprFlt);
          }
          else if (i < 40) {
            List4.push(oprFlt);
          }
          else if (i < 50) {
            List5.push(oprFlt);
          }
          else {
            List6.push(oprFlt);
          }

        }
        this.scheduleService.scheduleCreated = false;
        this.calEnd = new Date().getTime();
        (<NgcFormArray>this.operativeFlightForm.controls['operativeFlighList1']).patchValue(List1);
        (<NgcFormArray>this.operativeFlightForm.controls['operativeFlighList2']).patchValue(List2);
        (<NgcFormArray>this.operativeFlightForm.controls['operativeFlighList3']).patchValue(List3);
        (<NgcFormArray>this.operativeFlightForm.controls['operativeFlighList4']).patchValue(List4);
        (<NgcFormArray>this.operativeFlightForm.controls['operativeFlighList5']).patchValue(List5);
        (<NgcFormArray>this.operativeFlightForm.controls['operativeFlighList6']).patchValue(List6);
        this.operativeFlightForm.get(['operativeFlighList1']).value;
        this.operativeFlightForm.get(['operativeFlighList2']).value;
        this.operativeFlightForm.get(['operativeFlighList3']).value;
        this.operativeFlightForm.get(['operativeFlighList4']).value;
        this.operativeFlightForm.get(['operativeFlighList5']).value;
        this.operativeFlightForm.get(['operativeFlighList6']).value;
        this.subscribeToCheckBox();
        this.refresh();
        this.showOperativeFlight = true;
        this.resp.forEach(element => {
          this.showOperativeFlight = true;
          const legs: Array<OperativeFlightLeg> = new Array<OperativeFlightLeg>();
          if (element.flightLegs !== null) {
            element.flightLegs.forEach(leg => {
              legs.push(new OperativeFlightLeg(leg.flightId, leg.aircraftModel, leg.aircraftType,
                leg.arrivalDate, leg.arrivalTime, leg.boardPointCode, leg.cargoVolume,
                leg.cargoWeight, ' ', leg.codAirTypCar, leg.codTypFltSvc, leg.codVolUnt, leg.codWgtUnt,
                leg.departureDate, leg.departureTime, leg.flagDelete, leg.flagInsert,
                leg.flagSaved, leg.flagUpdate, leg.flgDly, ' ', ' ', leg.legOrderCode, leg.mailVolume, leg.mailWeight,
                leg.maxHalfPallets, leg.offPointCode, leg.domesticStatus, leg.handledInSystem));
            });
          }
          if (element.cancellation === 'A') {
            element['status'] = true;
          } else if (element.cancellation === 'D') {
            element['status'] = false;
          } else {
            element['status'] = undefined;
          }
          this.dataTable.push(new OperativeFlight(false, element.flightKey, element.serviceType, element.flightId,
            element.groundHandlerCode, element.carrierCode, element.cancellation, element.flagDelete,
            element.flagInsert, element.flagSaved, element.flagUpdate, element.flgDlsCtl, element.flgKvl,
            element.flgManCtlv, element.flgRes, element.flgSvcFinOut,
            new Date(element.flightDate), element.routing, element.flightNo,
            element.flightSegments, element.jointFlight, element.status, legs, element.flightFcts,
            element.flightJoints, element.flgApn, element.caoPax, element.inboundFlightAttributes, element.outboundFlightAttributes));
        });
      }
    });
  }




  /**
   * create Operative Flights.
   * @memberof MaintainscheduleComponent
   */
  onCreate() {
    this.isMsgAvb = true;
    const createFlight = new createOperativeFlightRQ();
    createFlight.createList = this.getCheckedListOfOperativeFlight();
    if (this.validateCreateCancel(createFlight.createList, false)) {
      this.operativeFlightForm.controls.checkAll.setValue(false);
      this.operativeFlightForm.controls.checkAllforCancel.setValue(false);
      this._flightService.createOperativeFlight(createFlight).subscribe(resp => {
        const x: any = resp;

        if (x.data) {
          this.showStat = false;
          this.showSuccessStatus('flight.create.flight.success');
          this.clicGet(this.ScheduleData, 1, 1);
          this.showStat = true;

        }
        else if (x.messageList[0] != null) {
          this.showErrorStatus(x.messageList[0].message);
        }
      });

    } else {
      this.showErrorStatus('flight.cannot.create.check.status');
      window.scrollTo(0, 0);
    }
  }

  /**
   * cancel operative Flight
   * @memberof MaintainscheduleComponent
   */
  onCancelFlight() {
    const cancelFlight: cancelOperativeFlight = new cancelOperativeFlight();
    cancelFlight.cancelList = this.getCheckedListOfOperativeFlight();
    if (this.validateCreateCancel(cancelFlight.cancelList, true)) {
      this._flightService.cancelOperativeFlight(cancelFlight).subscribe(resp => {
        const x: any = resp;
        if (x.data) {
          this.showStat = false;
          //this.router.navigate(['flight', 'maintainschedule', ' ']);
          this.showSuccessStatus('flight.cancel.flight.success');

          this.clicGet(this.ScheduleData, 1, 1);


          this.showStat = true;

        }
        else {
          const response = resp.messageList[0].message;
          this.showErrorStatus(resp.messageList[0].message);
        }
      });
    } else {
      this.showErrorStatus('flight.cannot.cancel.check.status');
      window.scrollTo(0, 0);
    }
  }




  /**
   * get operative Flight list.
   * @returns {Array<any>}
   * @memberof MaintainscheduleComponent
   */
  getCheckedListOfOperativeFlight(): Array<any> {
    const list: Array<any> = new Array<any>();
    (<NgcFormArray>this.operativeFlightForm.controls['operativeFlighList1']).getRawValue().forEach(element => {
      if (element.check) {
        list.push(this.dataTable.filter(ele => ele.flightDate.getTime() === new Date(element.flightDate).getTime())[0]);
      }
    });
    (<NgcFormArray>this.operativeFlightForm.controls['operativeFlighList2']).getRawValue().forEach(element => {
      if (element.check) {
        list.push(this.dataTable.filter(ele => ele.flightDate.getTime() === new Date(element.flightDate).getTime())[0]);
      }
    });
    (<NgcFormArray>this.operativeFlightForm.controls['operativeFlighList3']).getRawValue().forEach(element => {
      if (element.check) {
        list.push(this.dataTable.filter(ele => ele.flightDate.getTime() === new Date(element.flightDate).getTime())[0]);
      }
    });
    (<NgcFormArray>this.operativeFlightForm.controls['operativeFlighList4']).getRawValue().forEach(element => {
      if (element.check) {
        list.push(this.dataTable.filter(ele => ele.flightDate.getTime() === new Date(element.flightDate).getTime())[0]);
      }
    });
    (<NgcFormArray>this.operativeFlightForm.controls['operativeFlighList5']).getRawValue().forEach(element => {
      if (element.check) {
        list.push(this.dataTable.filter(ele => ele.flightDate.getTime() === new Date(element.flightDate).getTime())[0]);
      }
    });
    (<NgcFormArray>this.operativeFlightForm.controls['operativeFlighList6']).getRawValue().forEach(element => {
      if (element.check) {
        list.push(this.dataTable.filter(ele => ele.flightDate.getTime() === new Date(element.flightDate).getTime())[0]);
      }
    });
    if (list.length == 0) {
      this.showErrorMessage('flight.select.atleast.one.flight');
      window.scrollTo(0, 0);
      return;
    }
    return list;
  }

  /**
   * create new Schedule
   * @memberof MaintainscheduleComponent
   */
  routeToCreateSchedules() {

    this.router.navigate(['flight', 'modifyschedule', 'create']);
  }

  /**
   * navigate to display schedule
   * @memberof MaintainscheduleComponent
   */
  routeToDisplaySchedules() {
    this.navigateTo(this.router, '/flight/detailsschedule', this.reqData);
  }

  public routeToDisplaySchedulesScreen() {
    let returnObj = {
      carrierCode: this.form.get('flightCarrierCode').value,
      flightNo: this.form.get('flightNumber').value
    }
    this.navigateTo(this.router, "/flight/displayschedule", { returnObj: returnObj });
  }

  /**
   * Show error message's for cancel / create operative Flights
   * @param {any[]} list
   * @param {boolean} status
   * @returns {boolean}
   * @memberof MaintainscheduleComponent
   */
  validateCreateCancel(list: any[], status: boolean): boolean {
    let localCheck = true;
    let cancelflightlist = [];
    list.forEach(e => {
      if (status) {
        if (status !== e.status && localCheck) {
          localCheck = false;
        }
        //For the fix of 11140 point no2
        else {
          cancelflightlist.push(e);

        }
        if (cancelflightlist.length > 0) {
          localCheck = true;
        }
        // For the fix of 11140 point no2 ends
      } else {
        switch (e.status) {
          case false: {
            break;
          }
          case undefined: {
            break;
          }
          default: {
            localCheck = false;
            break;
          }
        }
      }
    });
    return localCheck;
  }
  /**
   * selection of  carrier code lov.
   * @param {any} object
   * @memberof MaintainscheduleComponent
   */
  public onSelectCarrier(object) {

    this.flightName = object.desc;
    this.form.get('flightName').setValue(object.desc);
    this.form.get('assisted').setValue(object.param1);
    this.form.get('defaultGroundHandler').setValue(object.param2);
  }

  /**
   * set string Value of boolean
   *
   * @param {boolean} value
   * @returns {string}
   * @memberof ScheduledetailseditableComponent
   */
  setStringValue(value: boolean): string {
    return value ? 'Y' : 'NULL';
  }

  checkAllforCancel() {
    this.operativeFlightForm.controls.checkAllforCancel.valueChanges.subscribe(data => {
      if (data) {
        this.operativeFlightForm.controls.checkAll.setValue(false);
      }
      let j = 0;
      let oprLst1 = this.operativeFlightForm.getRawValue().operativeFlighList1;
      let oprLst2 = this.operativeFlightForm.getRawValue().operativeFlighList2;
      let oprLst3 = this.operativeFlightForm.getRawValue().operativeFlighList3;
      let oprLst4 = this.operativeFlightForm.getRawValue().operativeFlighList4;
      let oprLst5 = this.operativeFlightForm.getRawValue().operativeFlighList5;
      let oprLst6 = this.operativeFlightForm.getRawValue().operativeFlighList6;

      let createdOprList1 = oprLst1.filter(obj => {
        return obj.status !== null && obj.status !== true;
      });
      let createdOprList2 = oprLst2.filter(obj => {
        return obj.status !== null && obj.status !== true;
      });
      let createdOprList3 = oprLst3.filter(obj => {
        return obj.status !== null && obj.status !== true;
      });
      let createdOprList4 = oprLst4.filter(obj => {
        return obj.status !== null && obj.status !== true;
      });
      let createdOprList5 = oprLst5.filter(obj => {
        return obj.status !== null && obj.status !== true;
      });
      let createdOprList6 = oprLst6.filter(obj => {
        return obj.status !== null && obj.status !== true;
      });
      let operativeFltLength = oprLst1.length + oprLst2.length + oprLst3.length + oprLst4.length + oprLst5.length + oprLst6.length;
      let createdoperativeFltLength = createdOprList1.length + createdOprList2.length + createdOprList3.length
        + createdOprList4.length + createdOprList5.length + createdOprList6.length
      if (operativeFltLength === createdoperativeFltLength) {
        j = 1;
      }


      if (j === 0) {
        (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList1")).controls.forEach((user, i) => {
          if ((<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList1).controls[i]).get('status').value === true && data) {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList1).controls[i]).get('check').setValue(data);
          } else {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList1).controls[i]).get('check').setValue(false);
          }

        });

        (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList2")).controls.forEach((user, i) => {
          if ((<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList2).controls[i]).get('status').value === true && data) {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList2).controls[i]).get('check').setValue(data);
          } else {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList2).controls[i]).get('check').setValue(false);
          }

        });

        (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList3")).controls.forEach((user, i) => {
          if ((<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList3).controls[i]).get('status').value === true && data) {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList3).controls[i]).get('check').setValue(data);
          } else {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList3).controls[i]).get('check').setValue(false);
          }


        });

        (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList4")).controls.forEach((user, i) => {
          if ((<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList4).controls[i]).get('status').value === true && data) {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList4).controls[i]).get('check').setValue(data);
          } else {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList4).controls[i]).get('check').setValue(false);
          }

        });

        (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList5")).controls.forEach((user, i) => {
          if ((<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList5).controls[i]).get('status').value === true && data) {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList5).controls[i]).get('check').setValue(data);
          } else {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList5).controls[i]).get('check').setValue(false);
          }

        });

        (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList6")).controls.forEach((user, i) => {
          if ((<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList6).controls[i]).get('status').value === true && data) {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList6).controls[i]).get('check').setValue(data);
          } else {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList6).controls[i]).get('check').setValue(false);
          }

        });
      } else if (data && j === 1) {
        return this.showErrorMessage("flight.all.cancelled");
      }

    });
  }

  fetchAllSchedules

  checkAll() {
    this.operativeFlightForm.controls.checkAll.valueChanges.subscribe(data => {
      if (data) {
        this.operativeFlightForm.controls.checkAllforCancel.setValue(false);
      }
      let j = 0;
      let oprLst1 = this.operativeFlightForm.getRawValue().operativeFlighList1;
      let oprLst2 = this.operativeFlightForm.getRawValue().operativeFlighList2;
      let oprLst3 = this.operativeFlightForm.getRawValue().operativeFlighList3;
      let oprLst4 = this.operativeFlightForm.getRawValue().operativeFlighList4;
      let oprLst5 = this.operativeFlightForm.getRawValue().operativeFlighList5;
      let oprLst6 = this.operativeFlightForm.getRawValue().operativeFlighList6;

      let createdOprList1 = oprLst1.filter(obj => {
        return obj.status !== null && obj.status === true;
      });
      let createdOprList2 = oprLst2.filter(obj => {
        return obj.status !== null && obj.status === true;
      });
      let createdOprList3 = oprLst3.filter(obj => {
        return obj.status !== null && obj.status === true;
      });
      let createdOprList4 = oprLst4.filter(obj => {
        return obj.status !== null && obj.status === true;
      });
      let createdOprList5 = oprLst5.filter(obj => {
        return obj.status !== null && obj.status === true;
      });
      let createdOprList6 = oprLst6.filter(obj => {
        return obj.status !== null && obj.status === true;
      });
      let operativeFltLength = oprLst1.length + oprLst2.length + oprLst3.length + oprLst4.length + oprLst5.length + oprLst6.length;
      let createdoperativeFltLength = createdOprList1.length + createdOprList2.length + createdOprList3.length
        + createdOprList4.length + createdOprList5.length + createdOprList6.length
      if (operativeFltLength === createdoperativeFltLength) {
        j = 1;
      }

      if (j === 0) {
        (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList1")).controls.forEach((user, i) => {
          if (((<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList1).controls[i]).get('status').value === null ||
            !(<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList1).controls[i]).get('status').value) && data) {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList1).controls[i]).get('check').setValue(data);
          } else {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList1).controls[i]).get('check').setValue(false);
          }
          // (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList1).controls[i]).get('check').setValue(data);
        });
        (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList2")).controls.forEach((user, i) => {
          if (((<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList2).controls[i]).get('status').value === null ||
            !(<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList2).controls[i]).get('status').value) && data) {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList2).controls[i]).get('check').setValue(data);
          } else {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList2).controls[i]).get('check').setValue(false);
          }
          // (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList2).controls[i]).get('check').setValue(data);
        });
        (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList3")).controls.forEach((user, i) => {
          if (((<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList3).controls[i]).get('status').value === null ||
            !(<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList3).controls[i]).get('status').value) && data) {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList3).controls[i]).get('check').setValue(data);
          } else {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList3).controls[i]).get('check').setValue(false);
          }
          // (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList3).controls[i]).get('check').setValue(data);
        });
        (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList4")).controls.forEach((user, i) => {
          if (((<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList4).controls[i]).get('status').value === null ||
            !(<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList4).controls[i]).get('status').value) && data) {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList4).controls[i]).get('check').setValue(data);
          } else {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList4).controls[i]).get('check').setValue(false);
          }
          // (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList4).controls[i]).get('check').setValue(data);
        });
        (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList5")).controls.forEach((user, i) => {
          if (((<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList5).controls[i]).get('status').value === null ||
            !(<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList5).controls[i]).get('status').value) && data) {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList5).controls[i]).get('check').setValue(data);
          } else {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList5).controls[i]).get('check').setValue(false);
          }
          // (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList5).controls[i]).get('check').setValue(data);(<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList5).controls[i]).get('check').setValue(data);
        });
        (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList6")).controls.forEach((user, i) => {
          if (((<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList6).controls[i]).get('status').value === null ||
            !(<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList6).controls[i]).get('status').value) && data) {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList6).controls[i]).get('check').setValue(data);
          } else {
            (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList6).controls[i]).get('check').setValue(false);
          }
          // (<NgcFormGroup>(<NgcFormArray>this.operativeFlightForm.controls.operativeFlighList6).controls[i]).get('check').setValue(data);
        });
      } else if (data && j === 1) {
        return this.showErrorMessage("flight.all.created");
      }
    });
  }

  subscribeToCheckBox() {
    this.trueCount = 0;
    this.falseCount = 0;
    this.checkStatusInfo = [];
    (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList1")).controls.forEach((user, i) => {
      (<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList1", i, "check"])).value == true ? this.trueCount++ : this.falseCount++;
      if ((<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList1", i, "status"])).value != null) {
        this.checkStatusInfo.push((<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList1", i, "status"])).value);
      }
    });
    (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList2")).controls.forEach((user, i) => {
      (<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList2", i, "check"])).value == true ? this.trueCount++ : this.falseCount++;
      if ((<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList2", i, "status"])).value != null) {
        this.checkStatusInfo.push((<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList2", i, "status"])).value);
      }
    });
    (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList3")).controls.forEach((user, i) => {
      (<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList3", i, "check"])).value == true ? this.trueCount++ : this.falseCount++;
      if ((<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList3", i, "status"])).value != null) {
        this.checkStatusInfo.push((<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList3", i, "status"])).value);
      }
    });
    (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList4")).controls.forEach((user, i) => {
      (<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList4", i, "check"])).value == true ? this.trueCount++ : this.falseCount++;
      if ((<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList4", i, "status"])).value != null) {
        this.checkStatusInfo.push((<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList4", i, "status"])).value);
      }
    });
    (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList5")).controls.forEach((user, i) => {
      (<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList5", i, "check"])).value == true ? this.trueCount++ : this.falseCount++;
      if ((<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList5", i, "status"])).value != null) {
        this.checkStatusInfo.push((<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList5", i, "status"])).value);
      }
    });
    (<NgcFormArray>this.operativeFlightForm.get("operativeFlighList6")).controls.forEach((user, i) => {
      (<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList6", i, "check"])).value == true ? this.trueCount++ : this.falseCount++;
      if ((<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList6", i, "status"])).value != null) {
        this.checkStatusInfo.push((<NgcFormControl>this.operativeFlightForm.get(["operativeFlighList6", i, "status"])).value);
      }
    });

    if (this.falseCount == this.totalRowCount) {
      this.operativeFlightForm.controls.checkAll.setValue(false, { onlySelf: true, emitEvent: true });
      this.operativeFlightForm.controls.checkAllforCancel.setValue(false, { onlySelf: true, emitEvent: true });
    }
    else if (this.trueCount == this.totalRowCount) {
      let i = 0;
      if (i < this.checkStatusInfo.length) {
        this.operativeFlightForm.controls.checkAll.setValue(false, { onlySelf: false, emitEvent: true });
        this.operativeFlightForm.controls.checkAllforCancel.setValue(false, { onlySelf: false, emitEvent: true });
      }

      else {
        this.operativeFlightForm.controls.checkAll.setValue(true, { onlySelf: false, emitEvent: true });
        this.operativeFlightForm.controls.checkAllforCancel.setValue(false, { onlySelf: false, emitEvent: true });
      }

    }
    else if (this.falseCount > 0) {
      this.operativeFlightForm.controls.checkAll.setValue(false, { onlySelf: true, emitEvent: false });
      this.operativeFlightForm.controls.checkAllforCancel.setValue(false, { onlySelf: true, emitEvent: false });
    }
  }

  // private onNext(event) {
  //   this.operativeFlightForm.get(['operativeFlighList4']).value;
  //   this.operativeFlightForm.get(['operativeFlighList5']).value;
  //   this.operativeFlightForm.get(['operativeFlighList6']).value;
  // }

  // private onPrevious(event) {
  //   this.operativeFlightForm.get(['operativeFlighList1']).value;
  //   this.operativeFlightForm.get(['operativeFlighList2']).value;
  //   this.operativeFlightForm.get(['operativeFlighList3']).value;
  // }

  onShowNext() {
    this.show = false;
    this.showSecond = true;
  }

  onShowPrevious() {
    this.show = true;
    this.showSecond = false;
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    //this.scheduleService.backToFlightSchedule = undefined;
  }

  onCancel() {
    if (!this.isBackToDisplaySchedule) {
      this.refreshFormMessages(null, 'mainForm');
      this.form.reset();
      this.scheduleForm.reset();
      this.operativeFlightForm.reset();
      this.navigateHome();
    } else {
      this.navigateTo(this.router, '/flight/displayschedule', this.reqData);
    }
  }
}

