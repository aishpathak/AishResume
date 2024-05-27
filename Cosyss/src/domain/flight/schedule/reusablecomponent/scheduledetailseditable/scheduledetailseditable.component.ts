import { forEach } from '@angular/router/src/utils/collection';
import { Validators } from '@angular/forms';
import { ScheduleService } from './../../schedule.service';
import { NgcFormGroup, NgcFormControl, NgcFormArray, NgcPage, NgcInputComponent, NgcUtility, PageConfiguration } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { ApplicationEntities } from '../../../../common/applicationentities';
import { FlightService } from '../../../flight.service';
/**
 * edit maintain flight schedule sub component
 * @export
 * @class ScheduledetailseditableComponent
 * @extends {NgcPage}
 * @implements {OnInit}
 */
@Component({
  selector: 'ngc-scheduledetailseditable',
  templateUrl: './scheduledetailseditable.component.html',
  styleUrls: ['./scheduledetailseditable.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ScheduledetailseditableComponent extends NgcPage {
  @Input()
  responseServer: any;
  @Input()
  createNew: boolean;

  @Input()
  createNewEdit: boolean;

  @Input()
  index: number;
  @Output()
  dataReady = new EventEmitter<any>();
  @Output()
  disableCheckBox = new EventEmitter<any>();

  @Output()
  deleteScheduleEmit = new EventEmitter<any>();


  postToServer: any;
  @ViewChild('id1') id1: NgcInputComponent;
  isAllDisabled = false;
  monFlgDisabled = false;
  tueFlgDisabled = false;
  wedFlgDisabled = false;
  thurFlgDisabled = false;
  friFlgDisabled = false;
  satFlgDisabled = false;
  sunFlgDisabled = false;
  showJointFlight = false;
  rhoParam: any;

  form: NgcFormGroup = new NgcFormGroup({
    selectSchedule: new NgcFormControl(false),

    schFlightLegs: new NgcFormArray(
      [
      ]
    ),
    deletedschFlightLegs: new NgcFormArray(
      [
      ]
    ),
    schFlightSegments: new NgcFormArray(
      [
      ]
    ),
    deletedSegmentList: new NgcFormArray(
      [
      ]
    ),
    schFlightJointList: new NgcFormArray(
      [
      ]
    ),
    deletedJointList: new NgcFormArray(
      [
      ]
    ),
    factList: new NgcFormArray([]),
    deletedFactList: new NgcFormArray([]),
    isAll: new NgcFormControl(false),
    monFlg: new NgcFormControl(false),
    tueFlg: new NgcFormControl(false),
    wedFlg: new NgcFormControl(false),
    thurFlg: new NgcFormControl(false),
    friFlg: new NgcFormControl(false),
    satFlg: new NgcFormControl(false),
    sunFlg: new NgcFormControl(false),
    flightServiceType: new NgcFormControl(),
    description: new NgcFormControl(),
    flightType: new NgcFormControl(),
    joint: new NgcFormControl(false),
    assisted: new NgcFormControl(),
    ssmFlag: new NgcFormControl(),
    codFrqNum: new NgcFormControl(),
    dateFrom: new NgcFormControl({}, Validators.required),
    dateTo: new NgcFormControl({}, Validators.required),
    flightCarrierCode: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    flightSchedulePeriodID: new NgcFormControl(),
    flightScheduleID: new NgcFormControl(),
    flagUpdate: new NgcFormControl(),
    flagDelete: new NgcFormControl(),
    flagInsert: new NgcFormControl(),
  });
  airportCode: any;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private scheduleService: ScheduleService,
    private flightService: FlightService) {
    super(appZone, appElement, appContainerElement);

  }
  /**
   * ng On Init
   * @memberof ScheduledetailseditableComponent
   */
  ngOnInit() {
    this.form.get('joint').valueChanges.subscribe(e => {
      this.showJointFlight = e;
    });
    this.postToServer = {
      schFlightLegs: [],
      schFlightSegments: [],
      factList: []
    };
    this.disableDaysAlreadyBooked();
    this.listenToAllFlgChkBox();
    this.listenToFormGrp();
    this.listenToJntFlgtChkBox();
    if (!this.createNew) {
      if (this.createNewEdit) {
        this.createFormCntrlInTable();
      } else {
        this.setFormCntrlValsInEdit();
        setTimeout(() => {
          if (this.responseServer.sunFlg) {
            this.form.get('sunFlg').setValue(this.responseServer.sunFlg);
          } if (this.responseServer.monFlg) {
            this.form.get('monFlg').setValue(this.responseServer.monFlg);
          } if (this.responseServer.tueFlg) {
            this.form.get('tueFlg').setValue(this.responseServer.tueFlg);
          } if (this.responseServer.wedFlg) {
            this.form.get('wedFlg').setValue(this.responseServer.wedFlg);
          } if (this.responseServer.thurFlg) {
            this.form.get('thurFlg').setValue(this.responseServer.thurFlg);
          } if (this.responseServer.friFlg) {
            this.form.get('friFlg').setValue(this.responseServer.friFlg);
          } if (this.responseServer.satFlg) {
            this.form.get('satFlg').setValue(this.responseServer.satFlg);
          } if (this.responseServer.allFlg) {
            this.form.get('isAll').setValue(this.responseServer.allFlg);
          }
        }, 100);
      }
    } else {
      this.createFormCntrlInTable();
    }
    this.airportCode = NgcUtility.getTenantConfiguration().airportCode;
  }
  /**
   * disable Days Already Booked
   * @memberof ScheduledetailseditableComponent
   */
  disableDaysAlreadyBooked() {
    this.sunFlgDisabled = this.scheduleService.dayDisabled.sunFlg;
    this.monFlgDisabled = this.scheduleService.dayDisabled.monFlg;
    this.tueFlgDisabled = this.scheduleService.dayDisabled.tueFlg;
    this.wedFlgDisabled = this.scheduleService.dayDisabled.wedFlg;
    this.thurFlgDisabled = this.scheduleService.dayDisabled.thurFlg;
    this.friFlgDisabled = this.scheduleService.dayDisabled.friFlg;
    this.satFlgDisabled = this.scheduleService.dayDisabled.satFlg;
    if (this.index !== 0) {
      this.isAllDisabled = true;
    }
  }
  /**
   * disable All Flg ChkBox
   * @memberof ScheduledetailseditableComponent
   */
  disableAllFlgChkBox() {
    this.form.get('isAll').disable();
    this.refresh();
  }
  /**
   * create Form Cntrl In Table
   * @memberof ScheduledetailseditableComponent
   */
  createFormCntrlInTable() {
    this.form.get('assisted').setValue(this.responseServer.assisted);
    this.form.get('flagInsert').setValue(this.responseServer.flagInsert);
    this.form.get('ssmFlag').setValue('MAN');
    this.form.get('codFrqNum').setValue(this.index + 1);
    (<NgcFormArray>this.form.controls['schFlightLegs']).addValue([
      {
        flightScheduleID: this.form.get('flightScheduleID').value,
        aircraftType: '',
        brdPt: '',
        offPt: '',
        depTime: '00:00',
        dayChangeArr: 0,
        arrTime: '00:00',
        dayChangeDep: 0,
        domesticLeg: false,
        flagUpdate: 'N',
        flagDelete: 'N',
        flagInsert: 'Y',
        flagSaved: 'N',
        bubdOffice: null,
        warehouseLevel: null,
        rho: null,
        codLegOrder: (<NgcFormArray>this.form.controls['schFlightLegs']).length + 1
      }
    ]);
    (<NgcFormArray>this.form.controls['factList']).addValue([
      {
        flightScheduleID: this.form.get('flightScheduleID').value,
        fact: '',
        sequnceNumber: (<NgcFormArray>this.form.controls['factList']).length + 1,
        flagUpdate: 'N',
        flagDelete: 'N',
        flagInsert: 'Y',
        flagSaved: 'N'
      }
    ]);
  }
  /**
   * set Form Cntrl Vals In Edit
   * @memberof ScheduledetailseditableComponent
   */
  setFormCntrlValsInEdit() {
    this.form.get('joint').setValue(
      (this.responseServer.sunJntFlg ||
        this.responseServer.monJntFlg ||
        this.responseServer.tueJntFlg ||
        this.responseServer.wedJntFlg ||
        this.responseServer.thuJntFlg ||
        this.responseServer.friJntFlg ||
        this.responseServer.satJntFlg) ? true : false
    );
    this.form.patchValue(this.responseServer);
    this.form.get('assisted').setValue(this.responseServer.assisted);
    this.responseServer.ssmFlag = this.setSSMValue(this.responseServer.ssmFlag);
    // this.form.get('ssmFlag').setValue(this.setSSMValue(this.responseServer.ssmFlag));
    this.form.get('flightSchedulePeriodID').setValue(this.responseServer.flightSchedulePeriodID);
    if (this.responseServer.schFlightLegs && NgcUtility.isEntityAttributeEnabled("Flight.RHO")) {
      this.responseServer.schFlightLegs.forEach(element => {
        var depTime = (NgcUtility.isTenantAirport(element.brdPt) ? element.depTime : null);
        var arrTime = (NgcUtility.isTenantAirport(element.offPt) ? element.arrTime : null);
        this.rhoParam = this.createSourceParameter(this.responseServer.flight, this.responseServer.flightCarrierCode, 'RHO', null, depTime, arrTime, this.form.get('flightType').value, element.aircraftType);
        this.retrieveLOVRecords("SERVICE_PROVIDER_TYPE_LOV", this.rhoParam).subscribe(data => {
          element.rho = element.rho;
        }, error => {
        });
      });
    }
    console.log(this.responseServer.factList, this.responseServer.factList.length);
    if (this.responseServer.factList.length === 0) {
      this.addFact(0);
    }
    this.refresh();
  }
  /**
   * convert Json Time
   * @param {any} dateObj
   * @returns {string}
   * @memberof ScheduledetailseditableComponent
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
    return hour + ':' + min;
    //  + sec + '.000';

  }
  /**
   * listen To Jnt Flgt ChkBox
   * @memberof ScheduledetailseditableComponent
   */
  listenToJntFlgtChkBox() {
    this.form.controls['joint'].valueChanges.subscribe(data => {
      if (data && (<NgcFormArray>this.form.controls['schFlightJointList']).length === 0) {
        (<NgcFormArray>this.form.controls['schFlightJointList']).addValue([
          {
            flightScheduleID: this.form.get('flightScheduleID').value,
            jointFlightKey: '',
            jointFlightName: '',
            flagUpdate: 'N',
            flagDelete: 'N',
            flagInsert: 'Y',
            flagSaved: 'N'
          }
        ]);
      }
      if (!data) {
        (<NgcFormArray>this.form.controls['schFlightJointList']).resetValue([]);
      }
    });
  }


  /**
   *  listen To Form Grp
   * @memberof ScheduledetailseditableComponent
   */
  listenToFormGrp() {
    this.form.controls['monFlg'].valueChanges.subscribe(data => {
      const dayOfWeek = 'monFlg';
      // console.log(dayOfWeek);
      if (this.form.get('sunFlg').value &&
        this.form.get('monFlg').value &&
        this.form.get('tueFlg').value &&
        this.form.get('wedFlg').value &&
        this.form.get('thurFlg').value &&
        this.form.get('friFlg').value &&
        this.form.get('satFlg').value) {
        this.form.get('isAll').setValue(true);
      } else {
        if (this.form.get('isAll').value) {
          this.form.get('isAll').setValue(false);
        }
      }
      if (data === true) {
        this.disableCheckBox.emit({ day: dayOfWeek, index: this.index, value: true });
      } else { this.disableCheckBox.emit({ day: dayOfWeek, index: this.index, value: false }); }
    }
    );
    this.form.controls['tueFlg'].valueChanges.subscribe(data => {
      const dayOfWeek = 'tueFlg';
      if (this.form.get('sunFlg').value &&
        this.form.get('monFlg').value &&
        this.form.get('tueFlg').value &&
        this.form.get('wedFlg').value &&
        this.form.get('thurFlg').value &&
        this.form.get('friFlg').value &&
        this.form.get('satFlg').value) {
        this.form.get('isAll').setValue(true);
      } else {
        if (this.form.get('isAll').value) {
          this.form.get('isAll').setValue(false);
        }
      }
      if (data === true) {
        this.disableCheckBox.emit({ day: dayOfWeek, index: this.index, value: true });
      } else {
        this.disableCheckBox.emit({ day: dayOfWeek, index: this.index, value: false });
      }
    });
    this.form.controls['wedFlg'].valueChanges.subscribe(data => {
      const dayOfWeek = 'wedFlg';
      // console.log(dayOfWeek);
      if (this.form.get('sunFlg').value &&
        this.form.get('monFlg').value &&
        this.form.get('tueFlg').value &&
        this.form.get('wedFlg').value &&
        this.form.get('thurFlg').value &&
        this.form.get('friFlg').value &&
        this.form.get('satFlg').value) {
        this.form.get('isAll').setValue(true);
      } else {
        if (this.form.get('isAll').value) {
          this.form.get('isAll').setValue(false);
        }
      }
      if (data === true) {
        this.disableCheckBox.emit({ day: dayOfWeek, index: this.index, value: true });
      } else {
        this.disableCheckBox.emit({ day: dayOfWeek, index: this.index, value: false });
      }
    });
    this.form.controls['thurFlg'].valueChanges.subscribe(data => {
      const dayOfWeek = 'thurFlg';
      if (this.form.get('sunFlg').value &&
        this.form.get('monFlg').value &&
        this.form.get('tueFlg').value &&
        this.form.get('wedFlg').value &&
        this.form.get('thurFlg').value &&
        this.form.get('friFlg').value &&
        this.form.get('satFlg').value) {
        this.form.get('isAll').setValue(true);
      } else {
        if (this.form.get('isAll').value) {
          this.form.get('isAll').setValue(false);
        }
      }
      if (data === true) {
        this.disableCheckBox.emit({ day: dayOfWeek, index: this.index, value: true });
      } else {
        this.disableCheckBox.emit({ day: dayOfWeek, index: this.index, value: false });
      }
    });
    this.form.controls['friFlg'].valueChanges.subscribe(data => {
      const dayOfWeek = 'friFlg';
      if (this.form.get('sunFlg').value &&
        this.form.get('monFlg').value &&
        this.form.get('tueFlg').value &&
        this.form.get('wedFlg').value &&
        this.form.get('thurFlg').value &&
        this.form.get('friFlg').value &&
        this.form.get('satFlg').value) {
        this.form.get('isAll').setValue(true);
      } else {
        if (this.form.get('isAll').value) {
          this.form.get('isAll').setValue(false);
        }
      }
      if (data === true) {
        this.disableCheckBox.emit({ day: dayOfWeek, index: this.index, value: true });
      } else {
        this.disableCheckBox.emit({ day: dayOfWeek, index: this.index, value: false });
      }
    });
    this.form.controls['satFlg'].valueChanges.subscribe(data => {
      const dayOfWeek = 'satFlg';
      if (this.form.get('sunFlg').value &&
        this.form.get('monFlg').value &&
        this.form.get('tueFlg').value &&
        this.form.get('wedFlg').value &&
        this.form.get('thurFlg').value &&
        this.form.get('friFlg').value &&
        this.form.get('satFlg').value) {
        this.form.get('isAll').setValue(true);
      } else {
        if (this.form.get('isAll').value) {
          this.form.get('isAll').setValue(false);
        }
      }
      if (data === true) {
        this.disableCheckBox.emit({ day: dayOfWeek, index: this.index, value: true });
      } else {
        this.disableCheckBox.emit({ day: dayOfWeek, index: this.index, value: false });
      }
    });
    this.form.controls['sunFlg'].valueChanges.subscribe(data => {
      const dayOfWeek = 'sunFlg';
      if (this.form.get('sunFlg').value &&
        this.form.get('monFlg').value &&
        this.form.get('tueFlg').value &&
        this.form.get('wedFlg').value &&
        this.form.get('thurFlg').value &&
        this.form.get('friFlg').value &&
        this.form.get('satFlg').value) {
        this.form.get('isAll').setValue(true);
      } else {
        if (this.form.get('isAll').value) {
          this.form.get('isAll').setValue(false);
        }
      }
      if (data === true) {
        this.disableCheckBox.emit({ day: dayOfWeek, index: this.index, value: true });
      } else {
        this.disableCheckBox.emit({ day: dayOfWeek, index: this.index, value: false });
      }
    });
  }
  /**
   * listen To All Flg ChkBox
   * @memberof ScheduledetailseditableComponent
   */
  listenToAllFlgChkBox() {
    this.form.controls['isAll'].valueChanges.subscribe(data => {
      if (data) {
        if (this.form.get('sunFlg').value === false) {
          this.form.get('sunFlg').setValue(true);
        } if (this.form.get('monFlg').value === false) {
          this.form.get('monFlg').setValue(true);
        } if (this.form.get('tueFlg').value === false) {
          this.form.get('tueFlg').setValue(true);
        } if (this.form.get('wedFlg').value === false) {
          this.form.get('wedFlg').setValue(true);
        } if (this.form.get('thurFlg').value === false) {
          this.form.get('thurFlg').setValue(true);
        } if (this.form.get('friFlg').value === false) {
          this.form.get('friFlg').setValue(true);
        } if (this.form.get('satFlg').value === false) {
          this.form.get('satFlg').setValue(true);
        }
      } else {
        if (this.form.get('sunFlg').value &&
          this.form.get('monFlg').value &&
          this.form.get('tueFlg').value &&
          this.form.get('wedFlg').value &&
          this.form.get('thurFlg').value &&
          this.form.get('friFlg').value &&
          this.form.get('satFlg').value) {
          this.form.get('sunFlg').setValue(false);
          this.form.get('monFlg').setValue(false);
          this.form.get('tueFlg').setValue(false);
          this.form.get('wedFlg').setValue(false);
          this.form.get('thurFlg').setValue(false);
          this.form.get('friFlg').setValue(false);
          this.form.get('satFlg').setValue(false);
        }
      }
    });
  }
  /**
   * add Joint Flight
   * @memberof ScheduledetailseditableComponent
   */
  addJointFlight() {
    if ((<NgcFormArray>this.form.controls['schFlightJointList']).length < 3) {
      (<NgcFormArray>this.form.controls['schFlightJointList']).addValue([
        {
          flightScheduleID: this.form.get('flightScheduleID').value,
          jointFlightKey: '',
          jointFlightName: '',
          flagUpdate: 'N',
          flagDelete: 'N',
          flagInsert: 'Y',
          flagSaved: 'N'
        }
      ]);
    } else {
      this.showWarningStatus('flight.max.three.joint.flight.added.warning');
    }
  }
  /**
   * add Leg
   * @memberof ScheduledetailseditableComponent
   */
  addLeg() {
    if ((<NgcFormArray>this.form.get('schFlightLegs')).length > 0) {
      const lastLeg = this.form.get('schFlightLegs').get((<NgcFormArray>this.form.get('schFlightLegs')).length - 1 + '');
    }
    (<NgcFormArray>this.form.controls['schFlightLegs']).addValue([
      {
        flightScheduleID: this.form.get('flightScheduleID').value,
        aircraftType: '',
        brdPt: '',
        offPt: '',
        depTime: '00:00',
        dayChangeArr: 0,
        arrTime: '00:00',
        dayChangeDep: 0,
        domesticLeg: false,
        flagUpdate: 'N',
        flagDelete: 'N',
        flagInsert: 'Y',
        flagSaved: 'N',
        bubdOffice: null,
        warehouseLevel: null,
        rho: null,
        codLegOrder: (<NgcFormArray>this.form.get('schFlightLegs')).length + 1
      }
    ]);
  }


  /**
   * send To Parent For Saving
   * @memberof ScheduledetailseditableComponent
   */
  sendToParentForSaving() {
    if (this.form.get('selectSchedule').value) {
      this.dataReady.emit(this.index);
    }
  }

  /**
   * add Fact
   * @param {any} row
   * @memberof ScheduledetailseditableComponent
   */
  addFact(row) {
    (<NgcFormArray>this.form.controls['factList']).addValue([{
      flightScheduleID: this.form.get('flightScheduleID').value,
      fact: '',
      sequenceNumber: row + 1,
      flagUpdate: 'N',
      flagDelete: 'N',
      flagInsert: 'Y',
      flagSaved: 'N'
    }
    ]);
  }
  /**
   * delete Joint Flight
   * @param {any} row
   * @memberof ScheduledetailseditableComponent
   */
  deleteJointFlight(row) {
    if (row === (<NgcFormArray>this.form.controls['schFlightJointList']).length - 1) {
      (<NgcFormArray>this.form.controls['schFlightJointList']).controls[row].get('flagDelete').setValue('Y');
      if ((<NgcFormArray>this.form.controls['schFlightJointList']).controls[row].get('flagSaved').value === 'Y') {
        (<NgcFormArray>this.form.controls['schFlightJointList']).controls[row].get('flagUpdate').setValue('N');
        (<NgcFormArray>this.form.controls['deletedJointList']).addValue([
          (<NgcFormArray>this.form.controls['schFlightJointList']).getRawValue()[row]
        ]);
      }
      (<NgcFormArray>this.form.get('schFlightJointList')).deleteValueAt(row);
    }
  }

  /**
   * delete fact
   * @param {any} row
   * @memberof ScheduledetailseditableComponent
   */
  deleteFact(row) {
    // if (row === (<NgcFormArray>this.form.controls['factList']).length - 1) {
    (<NgcFormArray>this.form.controls['factList']).controls[row].get('flagDelete').setValue('Y');
    if ((<NgcFormArray>this.form.controls['factList']).controls[row].get('flagSaved').value === 'Y') {
      (<NgcFormArray>this.form.controls['factList']).controls[row].get('flagUpdate').setValue('N');
      (<NgcFormArray>this.form.controls['deletedFactList']).addValue([
        (<NgcFormArray>this.form.controls['factList']).getRawValue()[row]
      ]);
    }
    (<NgcFormArray>this.form.controls['factList']).deleteValueAt(row);
    if ((<NgcFormArray>this.form.controls['factList']).length === 0) {
      this.addFact(0);
    }
    // }
  }

  /**
   * delete leg
   * @param {any} row
   * @memberof ScheduledetailseditableComponent
   */
  deleteLeg(row) {
    if (row === (<NgcFormArray>this.form.get('schFlightLegs')).length - 1) {
      (<NgcFormArray>this.form.controls['schFlightLegs']).controls[row].get('flagDelete').setValue('Y');
      if ((<NgcFormArray>this.form.controls['schFlightLegs']).controls[row].get('flagSaved').value === 'Y') {
        (<NgcFormArray>this.form.controls['schFlightLegs']).controls[row].get('flagUpdate').setValue('N');
        (<NgcFormArray>this.form.controls['deletedschFlightLegs']).addValue([
          JSON.parse(JSON.stringify((<NgcFormArray>this.form.controls['schFlightLegs']).getRawValue()[row]))
        ]);
      }
      (<NgcFormArray>this.form.get('schFlightLegs')).deleteValueAt(row);
    }
    if ((<NgcFormArray>this.form.get('schFlightLegs')).length === 0) {
      this.addLeg();
    }
  }
  /**
   * on Select Carrier
   * @param {any} object
   * @param {any} item
   * @memberof ScheduledetailseditableComponent
   */
  onSelectCarrier(object, item, index) {
    item.get('brdPt').setValue(object.code);
    if (object.code && NgcUtility.isTenantAirport(object.code) && NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_RHO)) {
      this.form.get(["schFlightLegs", index, "bubdOffice"]).setValidators([Validators.required]);
      this.form.get(["schFlightLegs", index, "rho"]).setValidators([Validators.required]);

    }
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_BuBdOffice) && NgcUtility.isTenantAirport(object.code)) {
      const request = {
        carrierCode: this.responseServer.flightCarrierCode,
        flightType: "O"
      };
      this.flightService.fetchDefaultBuBdOfficeDetails(request).subscribe(data => {
        if (data.data != null) {
          if (data.data.flightType == "O" || data.data.flightType == "B") {
            item.get("bubdOffice").setValue(data.data.buBdOffice);
          }
        }
      }, error => {

      });
    }
  }
  /**
   * on Select Carrier Off Pnt
   * @param {any} object
   * @param {any} item
   * @memberof ScheduledetailseditableComponent
   */
  onSelectCarrierOffPnt(object, item, index) {
    item.get('offPt').setValue(object.code);
    if (object.code && NgcUtility.isTenantAirport(object.code) && NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_RHO)) {
      this.form.get(["schFlightLegs", index, "bubdOffice"]).setValidators([Validators.required]);
      this.form.get(["schFlightLegs", index, "rho"]).setValidators([Validators.required]);

    }
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Flight_BuBdOffice) && NgcUtility.isTenantAirport(object.code)) {
      const request = {
        carrierCode: this.responseServer.flightCarrierCode,
        flightType: "I"
      };
      this.flightService.fetchDefaultBuBdOfficeDetails(request).subscribe(data => {
        if (data.data != null) {
          if (data.data.flightType == "I" || data.data.flightType == "B") {
            item.get("bubdOffice").setValue(data.data.buBdOffice);
          }
        }
      }, error => {

      });
    }
  }
  /**
   * on Select Aircraft Type
   * @param {any} object
   * @param {any} item
   * @memberof ScheduledetailseditableComponent
   */
  onSelectAircraftType(object, item, index) {
    item.get('aircraftType').setValue(object.code);
    this.getRHO(index);
  }

  /**
   *  on Select Service Type
   * @param {any} object
   * @memberof ScheduledetailseditableComponent
   */
  onSelectServiceType(object) {
    this.form.get('flightServiceType').setValue(object.code);
    this.form.get('description').setValue(object.desc);
    this.form.get('flightType').setValue(object.param1);
  }
  /**
   * on Change Of Joint FLight
   * @param {any} eveObject
   * @param {any} item
   * @memberof ScheduledetailseditableComponent
   */
  onChangeOfJointFLight(eveObject, item) {
    item.get('jointFlightKey').setValue(eveObject.code);
    item.get('jointFlightName').setValue(eveObject.desc);
  }

  /**
   * delete schedule send data to main component
   * @memberof ScheduledetailseditableComponent
   */
  deleteSchedule() {
    this.deleteScheduleEmit.emit(this.index);
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
  /**
   * set SSM Value of boolean
   *
   * @param {boolean} value
   * @returns {string}
   * @memberof ScheduledetailseditableComponent
   */
  setSSMValue(value: boolean): string {
    return value ? 'SYS' : 'MAN';
  }

  getRHO(index) {
    if (NgcUtility.isEntityAttributeEnabled("Flight.RHO")) {
      const schLegs = this.form.get(['schFlightLegs', index]).value;
      if ((schLegs.offPt == NgcUtility.getTenantConfiguration().airportCode && schLegs.arrTime) ||
        (schLegs.brdPt == NgcUtility.getTenantConfiguration().airportCode && schLegs.depTime)) {
        schLegs.arrTime = (schLegs.offPt == NgcUtility.getTenantConfiguration().airportCode ? schLegs.arrTime : null);
        schLegs.depTime = (schLegs.brdPt == NgcUtility.getTenantConfiguration().airportCode ? schLegs.depTime : null);
        if ((schLegs.arrTime && schLegs.arrTime != "00:00") || (schLegs.depTime && schLegs.depTime != "00:00")) {
          this.rhoParam = this.createSourceParameter(this.responseServer.flight, this.responseServer.flightCarrierCode, 'RHO', null, schLegs.depTime, schLegs.arrTime, this.form.get('flightType').value, schLegs.aircraftType);
          this.retrieveLOVRecords("SERVICE_PROVIDER_TYPE_LOV", this.rhoParam).subscribe(data => {
            this.form.get(['schFlightLegs', index, 'rho']).patchValue(data[0].param1);
          }, error => {
            this.form.get(['schFlightLegs', index, 'rho']).setValue(null);
            this.showInfoStatus("flight.rho.details.missing");
          });
        }
      }
    }
  }
}
