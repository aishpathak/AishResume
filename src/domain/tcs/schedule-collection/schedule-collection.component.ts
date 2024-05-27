import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TcsService } from '../tcs.service'
import { validateConfig } from '@angular/router/src/config';

import {

  NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, NgcPage,

  NgcButtonComponent, PageConfiguration, NgcFormControl

} from 'ngc-framework';


import { FormControl } from '@angular/forms';
import { element } from 'protractor';
import { ScheduleCollectionSearchModel } from '../tcs.sharedmodel';
import { time } from 'console';



@Component({
  selector: 'app-schedule-collection',
  templateUrl: './schedule-collection.component.html',
  styleUrls: ['./schedule-collection.component.scss']
})


@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
}) export class ScheduleCollectionComponent extends NgcPage implements OnChanges {

  public scheduleCollection: NgcFormGroup = new NgcFormGroup({
    update: new NgcFormGroup({
      scheduleCollectionId: new FormControl(),
      vehicleNo: new FormControl(),
      companyId: new FormControl(),
      scheduledFromTime: new FormControl(),
      scheduledTillTime: new FormControl(),
      startPeriodDate: new FormControl(),
      endPeriodDate: new FormControl(),
      applicableOnMonday: new FormControl(),
      applicableOnTuesday: new FormControl(),
      applicableOnWednesday: new FormControl(),
      applicableOnThursday: new FormControl(),
      applicableOnFriday: new FormControl(),
      applicableOnSaturday: new FormControl(),
      applicableOnSunday: new FormControl(),
      RepeatPeriod: new FormControl(),
      truckDockNo: new FormControl(),
      companyName: new FormControl()
    }),
    search: new NgcFormGroup({
      resourceId: new FormControl(),
      vehicleNo: new FormControl(),
      companyId: new FormControl(),
      truckDockNo: new FormControl(),
      companyName: new FormControl(),
      startPeriodDate: new FormControl(),
      endPeriodDate: new FormControl()
    }),

    createschedule: new NgcFormGroup({
      resourceId: new FormControl(),
      vehicleNo: new FormControl(),
      scheduleCollectionId: new FormControl(),
      scheduledFromTime: new FormControl(),
      scheduledTillTime: new FormControl(),
      startPeriodDate: new FormControl(),
      endPeriodDate: new FormControl(),
      applicableOnMonday: new FormControl(),
      applicableOnTuesday: new FormControl(),
      applicableOnWednesday: new FormControl(),
      applicableOnThursday: new FormControl(),
      applicableOnFriday: new FormControl(),
      applicableOnSaturday: new FormControl(),
      applicableOnSunday: new FormControl(),
      WeekofDays: new FormControl(),
      truckDockNo: new FormControl(),
      companyName: new FormControl(),
      RepeatPeriod: new FormControl(),
      companyId: new FormControl()
    }),
    searchResults: new NgcFormArray([]),


  });
  toMin = new Date(NgcUtility.getCurrentDateOnly());
  currentdate = new Date(NgcUtility.getCurrentDateOnly());
  createWindow: NgcWindowComponent;
  updateWindow: NgcWindowComponent;
  showTable: boolean = false;
  createFlag: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,

    private activatedRoute: ActivatedRoute, private router: Router, private service: TcsService) {

    super(appZone, appElement, appContainerElement); { }
  }
  ngOnInit() { }

  onSearch() {
    this.showTable = true;
    let request: ScheduleCollectionSearchModel = (this.scheduleCollection.get('search') as NgcFormGroup).getRawValue();
    console.log("request object", request)
    this.service.searchScheduleCollectioInfo(request).subscribe((response) => {
      if (response.success) {
        // Adding repeat repeiod to display 
        response.data.map(element => {
          let from = NgcUtility.getDateAsString(element['startPeriodDate']);
          let to = NgcUtility.getDateAsString(element['endPeriodDate']);
          const RepeatPeriod = (`${from} - ${to}`);
          const obj = Object.assign(element, { RepeatPeriod: RepeatPeriod });
        });
        /*
        Displaying weekofdays as string from boolean and adding in datatable
        */
        response.data.map(element => {
          let WeekofDays: string = '';
          if (element['applicableOnMonday'] === true) {
            WeekofDays = WeekofDays + this.getI18NValue('tcs.mon');
          }
          if (element['applicableOnTuesday'] === true) {
            WeekofDays = WeekofDays + ',' + this.getI18NValue('tcs.tue');
          }
          if (element['applicableOnWednesday'] === true) {
            WeekofDays = WeekofDays + ',' + this.getI18NValue('tcs.wed');
          }
          if (element['applicableOnThursday'] === true) {
            WeekofDays = WeekofDays + ',' + this.getI18NValue('tcs.thu');
          }
          if (element['applicableOnFriday'] === true) {
            WeekofDays = WeekofDays + ',' + this.getI18NValue('tcs.fri');
          }
          if (element['applicableOnSaturday'] === true) {
            WeekofDays = WeekofDays + ',' + this.getI18NValue('tcs.sat');
          }
          if (element['applicableOnSunday'] === true) {
            WeekofDays = WeekofDays + ',' + this.getI18NValue('tcs.sun');
          }
          const obj = Object.assign(element, { WeekofDays: WeekofDays });
        });
        this.scheduleCollection.get('searchResults').patchValue(response.data);
      }
    });
  }
  /*
    create method to add schedule
  */
  public onCreate(createWindow: NgcWindowComponent) {
    if (createWindow) {
      this.createWindow = createWindow;
      createWindow.open();
      (<NgcFormArray>this.scheduleCollection.get('createschedule')).reset([]);
    }
  }
  /*   
  Method to save new record
  */
  public CreatSave() {
    let request = (this.scheduleCollection.get('createschedule') as NgcFormGroup).getRawValue();

    this.service.createScheduleCollectioInfo(request).subscribe((response) => {
      console.log("response", response);
      if (response.success) {
        this.showSuccessStatus("g.operation.successful");
      }
      else {
        this.showErrorMessage("g.record.is.not.created");
      }
    });
    this.createWindow.close();
  }

  /*
  DataTable  event Implementation 
  */
  public onDataTableClick(event, updateWindow) {
    if (event.type === 'link' && event.column === 'Update') {
      this.updateWindow = updateWindow;
      this.updateWindow.open();
      //Converting time format
      let timeFrom = NgcUtility.getDateTimeAsStringByFormat(event.record.scheduledFromTime, 'HH:MM');
      let timeTill = NgcUtility.getDateTimeAsStringByFormat(event.record.scheduledTillTime, 'HH:MM');
      //patching values one by one
      //   (this.scheduleCollection.get('update') as NgcFormGroup).patchValue(event.record);
      this.scheduleCollection.get('update').get('truckDockNo').patchValue(event.record.truckDockNo);
      this.scheduleCollection.get('update').get('companyName').patchValue(event.record.companyName);
      this.scheduleCollection.get('update').get('vehicleNo').patchValue(event.record.vehicleNo);
      this.scheduleCollection.get('update').get('scheduledFromTime').patchValue(timeFrom);
      this.scheduleCollection.get('update').get('scheduledTillTime').patchValue(timeTill);
      this.scheduleCollection.get('update').get('startPeriodDate').patchValue(event.record.startPeriodDate);
      this.scheduleCollection.get('update').get('endPeriodDate').patchValue(event.record.endPeriodDate);
      this.scheduleCollection.get('update').get('applicableOnMonday').patchValue(event.record.applicableOnMonday);
      this.scheduleCollection.get('update').get('applicableOnTuesday').patchValue(event.record.applicableOnTuesday);
      this.scheduleCollection.get('update').get('applicableOnWednesday').patchValue(event.record.applicableOnWednesday);
      this.scheduleCollection.get('update').get('applicableOnThursday').patchValue(event.record.applicableOnThursday);
      this.scheduleCollection.get('update').get('applicableOnFriday').patchValue(event.record.applicableOnFriday);
      this.scheduleCollection.get('update').get('applicableOnSaturday').patchValue(event.record.applicableOnSaturday);
      this.scheduleCollection.get('update').get('applicableOnSunday').patchValue(event.record.applicableOnSunday);
      this.scheduleCollection.get('update').get('scheduleCollectionId').patchValue(event.record.scheduleCollectionId);
      // console.log("Dp", timeFrom);
      // console.log("DD", event.record.scheduledFromTime);
    }
    if (event.type === 'link' && event.column === 'delete') {
      let request = event.record;
      this.showConfirmMessage('Are you Sure You Want to delete the record ?').then(() => {

        this.onDelete(request);
      }).catch(() => {
        this.showMessage("g.cancelling");
      });
      //  this.onsearch();
    }
  }
  /*
  Delete function to delete a record  which records which are not used
  */
  public onDelete(request) {

    if (request.startPeriodDate >= this.currentdate || request.endPeriodDate >= this.currentdate) {
      this.showErrorMessage('g.record.in.use');
    }
    else {
      this.service.deleteScheduleCollectioInfo(request).subscribe((response) => {
        if (response.success) {
          this.showSuccessStatus("g.operation.successful");
        }
        else {
          this.showErrorMessage("g.operation.failled")
        }
      });
    }
  }
  /*
  Update Save method to save changes of a record
  */
  public onUpdateSave() {
    let request = (this.scheduleCollection.get('update') as NgcFormGroup).getRawValue();
    console.log("upate values", request)
    this.service.updateScheduleCollectioInfo(request).subscribe((response) => {

      if (response.success) {
        this.showSuccessStatus("g.operation.successfull");
      }
    })
    this.updateWindow.close();
  }

  /**
     *  close the popup
     */
  public onClose(createWindow: NgcWindowComponent, updateWindow: NgcWindowComponent) {
    if (createWindow) {
      this.createWindow = createWindow;
      createWindow.close();
    }
    if (updateWindow) {
      this.updateWindow = updateWindow;
      updateWindow.close()
    }
  }

  oncancel($event) {
    this.navigateHome();
  }


}
