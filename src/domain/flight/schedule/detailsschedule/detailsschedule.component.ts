


import {
  ScheduleService
} from
  './../schedule.service';

import {
  ActivatedRoute,
  Router
} from
  '@angular/router';

import {
  ScheduledetailsComponent
} from
  './../reusablecomponent/scheduledetails/scheduledetails.component';

import {
  FlightService
} from
  './../../flight.service';

import {
  Component, OnInit,
  NgZone, ElementRef,
  ViewContainerRef, Input,
  ViewChild
} from
  '@angular/core';

import {
  RestService, BaseRequest,
  NgcWindowComponent, PageConfiguration, NgcUtility
}
  from 'ngc-framework';

import {
  NgcPage, NgcFormGroup,
  NgcFormArray, NgcFormControl,
  NgcReadOnlyComponent
} from
  'ngc-framework';

import {
  detailsScheduleRequest, detailsScheduleResponse,
  displayDetailsSchedule,
  FindSchedule, CopyDetailsscheduleComponent, SpiltDetailsscheduleComponent
} from
  './../../flight.sharedmodel';



@Component({

  selector:
    'ngc-detailsschedule',

  templateUrl:
    './detailsschedule.component.html',

  styleUrls: ['./detailsschedule.component.scss']

})

// @PageConfiguration({
//   trackInit: true,
//   callNgOnInitOnClear: true,
//   autoBackNavigation: true
// })

@PageConfiguration({

  functionId: 'MAINTAIN_FLIGHT_SCHEDULE_'


})
export class DetailsscheduleComponent extends NgcPage {

  numbers: any[];
  @ViewChild('window') window: NgcWindowComponent;
  @ViewChild('spiltwindow') spiltwindow: NgcWindowComponent;
  resp: any;
  fromMax: any;
  toMin: any;
  reqData: any = {}
  todayDate: Date = new Date();
  copyError: boolean = false;
  spiltFlight: any;
  errors: any[];
  private detailsScheduleForm:
    NgcFormGroup = new NgcFormGroup
      ({
        flight: new NgcFormControl(),
        flightName: new NgcFormControl(),
        dateFrom: new NgcFormControl(),
        dateTo: new NgcFormControl(),
        apron: new NgcFormControl(),
        copyFromDate: new NgcFormControl(),
        copyToDate: new NgcFormControl(),
        splitDateFrom: new NgcFormControl(),
        splitDateTo: new NgcFormControl(),
        flightCarrierCode: new NgcFormControl(),
        flightNumber: new NgcFormControl(),
        groundHandler: new NgcFormControl(),
        flightSchedulePeriodID: new NgcFormControl(),
        assisted: new NgcFormControl(),
        defaultGroundHandler: new NgcFormControl()
      });



  constructor(appZone:
    NgZone, appElement:
      ElementRef,

    appContainerElement:
      ViewContainerRef,

    private flightService:
      FlightService,

    private scheduleService:
      ScheduleService,

    private router:
      Router,
    private activatedRoute: ActivatedRoute) {

    super(appZone,
      appElement, appContainerElement);


  }

  /**
  
  * ng on init
  
  * @memberof
  DetailsscheduleComponent
  
  */

  ngOnInit() {
    const transferData = this.getNavigateData(this.activatedRoute);
    if (transferData) {
      this.reqData = transferData;
    }
    const displaySchedulePeriod =
      JSON.parse(JSON.stringify(this.scheduleService.objFromMaintainToDisplay));



    this.detailsScheduleForm.patchValue(displaySchedulePeriod);

    this.scheduleService.backToFlightSchedule =
      this.detailsScheduleForm.getRawValue();

    this.refresh();

    const findSchedule:
      FindSchedule =
      new FindSchedule();

    findSchedule.groundHandler =
      this.scheduleService.objFromMaintainToDisplay.groundHandler;

    findSchedule.dateFrom =
      this.scheduleService.objFromMaintainToDisplay.dateFrom;

    findSchedule.dateTo =
      this.scheduleService.objFromMaintainToDisplay.dateTo;

    findSchedule.flight =
      this.scheduleService.objFromMaintainToDisplay.flight;

    findSchedule.flightCarrierCode =
      this.scheduleService.objFromMaintainToDisplay.flightCarrierCode;

    findSchedule.flightNumber =
      this.scheduleService.objFromMaintainToDisplay.flightNumber;

    findSchedule.flightSchedulePeriodID =
      this.scheduleService.objFromMaintainToDisplay.flightSchedulePeriodID;

    findSchedule.flightName =
      this.scheduleService.objFromMaintainToDisplay.flightName;

    this.flightService.getDetailsSchedule(findSchedule).subscribe(data => {



      this.resp =
        data.data;

      this.detailsScheduleForm.patchValue(data);

      this.scheduleService.backToFlightSchedule =
        this.resp;

      this.resp.apron ?
        this.detailsScheduleForm.get('apron').setValue('Y')
        : this.detailsScheduleForm.get('apron').setValue('NIL');

      this.resp.schFlightList.sort(function (a,
        b) {
        return a.codFrqNum -
          b.codFrqNum;
      });

      this.resp.schFlightList.forEach(element => {

        element['ssmFlag'] =
          this.setSSMValue(element.ssmFlag);



        element.schFlightLegs.forEach(legs => {
          legs['domesticLeg'] = this.setStringValue(legs.domesticLeg);
        });

        element.schFlightSegments.forEach(segs => {

          segs['freightNA'] =
            this.setStringValue(segs.freightNA);

          segs['techStop'] =
            this.setStringValue(segs.techStop);

          segs['noCargo'] =
            this.setStringValue(segs.noCargo);

          segs['noMail'] =
            this.setStringValue(segs.noMail);

        });

      });

    });
    // checking to date is greater than ot not
    this.detailsScheduleForm.controls['copyFromDate'].valueChanges.subscribe(data => {

      this.toMin =
        new Date(this.detailsScheduleForm.get('copyFromDate').value);

      this.toMin.setDate(this.toMin.getDate());

    });
    if (this.detailsScheduleForm.get('copyToDate').value != null || findSchedule.dateTo != null) {
      this.detailsScheduleForm.get('copyToDate').valueChanges.subscribe(date => {

        const dataRoute: CopyDetailsscheduleComponent = new CopyDetailsscheduleComponent();
        let startDate = this.detailsScheduleForm.get('copyFromDate').value;
        let endDate = this.detailsScheduleForm.get('copyToDate').value;
        let carrier = this.detailsScheduleForm.get('flightCarrierCode').value;
        let flight = this.detailsScheduleForm.get('flightNumber').value;
        dataRoute.dateFrom = startDate;
        dataRoute.dateTo = endDate;
        dataRoute.flightCarrierCode = carrier;
        dataRoute.flightNumber = flight;
        if (startDate != null) {
          this.flightService.getCopyDetailsSchedule(dataRoute).subscribe(data => {


            this.refreshFormMessages(data);
            this.copyError = false;
            if (data.messageList !== null) {

              this.showResponseErrorMessages(data);
              this.copyError = true;
            }

            //this.resp =data.data;
          });
        }
      });
    }
  }



  /**
  
  * call Add Or Edit
  
  * @memberof
  DetailsscheduleComponent
  
  */

  callAddOrEdit() {

    const endDate = new Date(this.scheduleService.objFromMaintainToDisplay.dateTo);
    const today = new Date();
    this.scheduleService.copyScheduleFlag = false;
    this.navigateTo(this.router, '/flight/modifyschedule/edit', this.reqData);
  }

  /**
  
  * open copy schedule pop up
  
  * @memberof
  DetailsscheduleComponent
  
  */

  windowopen() {

    this.window.open();

  }


  spiltwindowopen() {
    this.spiltwindow.open();
  }

  spiltCancel() {
    this.detailsScheduleForm.get('splitDateFrom').setValue(null);
    this.detailsScheduleForm.get('splitDateTo').setValue(null);
    this.spiltwindow.hide();
  }

  /**
  
  * cancel pop up
  
  * @memberof
  DetailsscheduleComponent
  
  */

  callCancel() {
    this.detailsScheduleForm.get('splitDateFrom').setValue(null);
    this.detailsScheduleForm.get('splitDateTo').setValue(null);
    this.window.hide();

  }

  //by ashutosh copy date 
  // onSelectoDate(event) {

  //   this.detailsScheduleForm.get('copyFromDate').setValue(this.detailsScheduleForm.get('copyToDate').value);
  // }


  /**
  
  * create from popup
  
  * @memberof
  DetailsscheduleComponent
  
  */



  callCreate() {

    if (this.detailsScheduleForm.get('copyFromDate').value == null ||
      this.detailsScheduleForm.get('copyToDate').value == null) {
      this.showErrorMessage('enter.fromDate.ToDate');
      return;
    }
    const formValues =
      this.detailsScheduleForm.value;

    formValues.copyFromDate =
      formValues.copyFromDate;

    formValues.copyToDate =
      formValues.copyToDate;

    this.scheduleService.objFromMaintainToDisplay =
      formValues;

    this.window.hide();

    this.scheduleService.copyScheduleFlag =
      true;

    this.router.navigate(['flight',
      'modifyschedule',
      'edit']);

    /* this.flightService.getDetailsSchedule(findSchedule).subscribe(data => {
    
    
    
    }) */



  }

  spiltCreate() {
    const splitData: SpiltDetailsscheduleComponent = new SpiltDetailsscheduleComponent();
    let splitStartDate = this.detailsScheduleForm.get('splitDateFrom').value;
    let splitEndDate = this.detailsScheduleForm.get('splitDateTo').value;
    let startDate = this.detailsScheduleForm.get('dateFrom').value;
    let endDate = this.detailsScheduleForm.get('dateTo').value;
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    if (splitStartDate !== null && splitStartDate < startDate) {
      this.detailsScheduleForm.get('splitDateFrom').setValue(null);
      this.showErrorMessage('Start Date out of range');
      return;
    }
    if ((splitEndDate !== null && splitEndDate < startDate) || (splitEndDate !== null && splitEndDate > endDate)) {
      this.detailsScheduleForm.get('splitDateTo').setValue(null);
      this.showErrorMessage('End Date out of range');
      return;
    }
    if (splitStartDate !== null && splitEndDate !== null && splitEndDate < splitStartDate) {
      this.detailsScheduleForm.get('splitDateFrom').setValue(null);
      this.detailsScheduleForm.get('splitDateTo').setValue(null);
      this.showErrorMessage('From date shouldn’t be greater than To Date in schedule details');
      return;
    }
    if (splitEndDate == null) {
      this.showErrorMessage('Fill the Mandatory Detail');
      return;
    }
    if (splitStartDate == null) {
      this.detailsScheduleForm.get('splitDateFrom').setValue(startDate);
      splitStartDate = this.detailsScheduleForm.get('splitDateFrom').value;
    }
    let carrierCode = this.detailsScheduleForm.get('flightCarrierCode').value;
    let flightSchedulePeriodID = this.detailsScheduleForm.get('flightSchedulePeriodID').value;
    let groundHandler = this.detailsScheduleForm.get('groundHandler').value;
    let apron = this.detailsScheduleForm.get('apron').value;
    if (apron == "Y") {
      apron = 1;
    } else if (apron == "N" || apron == "NIL") {
      apron = 0;
    }
    let flightNumber = this.detailsScheduleForm.get('flightNumber').value;
    splitData.splitDateFrom = splitStartDate;
    splitData.splitDateTo = splitEndDate;
    splitData.dateFrom = startDate;
    splitData.dateTo = endDate;
    splitData.flightCarrierCode = carrierCode;
    splitData.flightSchedulePeriodID = flightSchedulePeriodID;
    splitData.groundHandler = groundHandler;
    splitData.apron = apron;
    splitData.flightNumber = flightNumber;
    this.scheduleService.copyScheduleFlag = true
    //setTimeout(() => {
    this.flightService.spiltSchedule(splitData).subscribe(data => {
      this.spiltFlight = data;
      this.errors = this.spiltFlight.messageList;
      if (this.spiltFlight.data == null) {
        this.showErrorStatus(this.errors[0].message);
      }
      else {
        this.showSuccessStatus('flight.delete.split.success');
        this.router.navigate(['flight', 'maintainschedule', ' ']);
      }
    });
    // .then(() => { window.location.reload(); });
    // }, 2000);
  }

  /**
  
  * back To Flight Schedule
  
  * @memberof
  DetailsscheduleComponent
  
  */

  backToFlightSchedule() {
    // this.navigateBack(true);
    this.router.navigate(['flight', 'maintainschedule', ' ']);

  }



  setStringValue(value:
    boolean): string {

    return value ? 'Y' : 'N';

  }



  setSSMValue(value:
    boolean): string {

    return value ?
      'SYS' : 'MAN';

  }



  onCancel() {
    //this.navigateBack(true);
    this.router.navigate(['flight', 'maintainschedule', ' ']);

  }
}






