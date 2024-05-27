import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcWindowComponent } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../events.service';
import { EventNotification, NotifyUser, UserGroupRequest, FlightInfo } from '../events.sharedmodel';

@Component({
  selector: 'app-event-notification',
  templateUrl: './event-notification.component.html',
  styleUrls: ['./event-notification.component.css']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true

})
export class EventNotificationComponent extends NgcPage implements OnInit {
  @ViewChild('addUserWindow') addUserWindow: NgcWindowComponent;
  @ViewChild('addFlightWindow') addFlightWindow: NgcWindowComponent;
  showCreate: any;
  index: any;
  showTableFlag: any;
  private transferType = {};
  showTransferType: any;
  private eventTypes = {};
  eventNotificationId: any;
  eventInfo: any;

  ngOnInit() {
  }
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private userService: EventsService) {
    super(appZone, appElement, appContainerElement);
    // this.functionId = "PLAYGROUND";
  }


  public eventNotification: NgcFormGroup = new NgcFormGroup({
    purpose: new NgcFormControl(),
    eventTypesId: new NgcFormControl(),
    eventNotificationList: new NgcFormArray([
    ])
  });

  public userConfiguration: NgcFormGroup = new NgcFormGroup({
    userList: new NgcFormArray([
    ])
  })

  public flightInformation: NgcFormGroup = new NgcFormGroup({
    flightList: new NgcFormArray([
    ])
  })


  public save() {
    let userGroupRequestList: Array<EventNotification> = new Array<EventNotification>();
    let userGroupRequest: UserGroupRequest = new UserGroupRequest();

    userGroupRequest.id = this.eventNotification.get('eventTypesId').value;
    userGroupRequest.purpose = this.eventNotification.get('purpose').value;
    userGroupRequest.eventNotificationList = (<NgcFormArray>this.eventNotification
      .controls["eventNotificationList"]).getRawValue();
    //EventNotificationId for  newly created  notifications 
    if (userGroupRequest.eventNotificationList.length > 0) {
      userGroupRequest.eventNotificationList.forEach(item => {
        if (item.flagCRUD === "C") {
          item.eventTypesId = this.eventNotification.get('eventTypesId').value;
        }

      });
    }

    userGroupRequest.eventNotificationList.forEach(value => {
      value.userList = value.userList.filter(recordValue => recordValue.eventGroupId);
    })

    this.userService.saveEventNotification(userGroupRequest).subscribe(data => {
      this.refreshFormMessages(data);
      if (!this.showResponseErrorMessages(data)) {
        if (data.data && data.data.eventNotificationList.length > 0) {
          this.showCreate = true;
          this.showSuccessStatus('g.completed.successfully');
          this.showTableFlag = true;
          (<NgcFormArray>this.eventNotification.get('eventNotificationList')).patchValue(data.data.eventNotificationList);
        } else {
          (<NgcFormArray>this.eventNotification.get('eventNotificationList')).patchValue([]);
          this.showSuccessStatus('g.completed.successfully');
          this.showCreate = true;
          this.showTableFlag = false;
        }
      }
    }, error => {
      this.showErrorStatus('g.unable.to.contact.server');
    })

  }

  public fetchEventNotifications() {
    this.showCreate = false;
    this.showTableFlag = false;
    this.eventNotification.get('eventNotificationList').patchValue([]);
    let eventNotification: EventNotification = new EventNotification();
    eventNotification.eventTypesId = this.eventNotification.get('eventTypesId').value;
    eventNotification.purpose = this.eventNotification.get('purpose').value;
    this.eventInfo = this.createSourceParameter(eventNotification.eventTypesId);

    this.userService.fetchEventNotifications(eventNotification).subscribe(data => {
      this.refreshFormMessages(data);
      if (!this.showResponseErrorMessages(data)) {
        if (data.data && data.data.length > 0) {
          this.showCreate = true;
          this.showTableFlag = true;
          (<NgcFormArray>this.eventNotification.get('eventNotificationList')).patchValue(data.data);
        } else {
          this.showErrorStatus('warehouse.norecordfound');
          this.showCreate = true;
          this.createSLA();
        }
      } else {
        this.showCreate = false;
        this.showTableFlag = false;
      }
    }, error => {
      this.showErrorStatus('g.unable.to.contact.server');
    })


  }

  public createSLA() {

    this.addNotification()
    this.showTableFlag = true;
  }

  public createTemplate() {

  }
  public addNotifyUser(data, index) {
    this.eventNotificationId = data.value.eventNotificationId;
    this.index = index;
    let userList = (<NgcFormArray>this.eventNotification.get(["eventNotificationList", this.index]).get('userList')).getRawValue();
    if (userList.length > 0) {
      this.userConfiguration.get('userList').patchValue(userList);
    } else {
      let emptyList = [];
      this.userConfiguration.get('userList').patchValue(emptyList);
      this.addUserRow();
    }
    this.addUserWindow.open();
  }

  deleteUser(index) {
    (<NgcFormArray>this.userConfiguration.get("userList")).markAsDeletedAt(index);
    if ((<NgcFormArray>this.userConfiguration.get("userList")).length === 0) {
      this.addUserRow();
    }
  }
  public addUserRow() {
    (<NgcFormArray>this.userConfiguration.get("userList")).addValue([
      {
        loginCode: '',
        eventGroupId: null,
        eventNotificationId: this.eventNotificationId
      }
    ]);
  }
  public addNotification() {
    const eventNotification: EventNotification = new EventNotification();
    eventNotification.checked = false;
    eventNotification.eventTypesId = null;
    eventNotification.slaCategory = null;
    eventNotification.aircraftType = null;
    eventNotification.aircraftBodyType = null;
    eventNotification.domIntl = null;
    eventNotification.flightType = null;
    eventNotification.shcPurpose = null;
    eventNotification.flightTime = null;
    eventNotification.equation = null;
    eventNotification.occurenceInMinutes = null;
    eventNotification.notificationType = null;
    // eventNotification.time: any;
    eventNotification.occurenceInCount = null;
    eventNotification.fixedTime = null;
    eventNotification.repeatTime = null;
    eventNotification.dlsPrecisionTime = null;
    eventNotification.fltPrecisionTime = null;

    eventNotification.eventTemplateId = null;
    eventNotification.code = null;
    (<NgcFormArray>this.eventNotification.get('eventNotificationList')).addValue([eventNotification
    ]);
  }

  public saveUsers() {
    let eventNotificationRequest: UserGroupRequest = new UserGroupRequest();
    let userList = (<NgcFormArray>this.userConfiguration.get("userList")).getRawValue();
    eventNotificationRequest.id = this.eventNotificationId
    eventNotificationRequest.userList = userList;
    this.userService.vallidateNotifyUser(eventNotificationRequest).subscribe(data => {
      this.refreshFormMessages(data);
      if (!this.showResponseErrorMessages(data)) {
        (<NgcFormArray>this.eventNotification.get(["eventNotificationList", this.index]).get('userList')).patchValue(userList);
        this.addUserWindow.close();
        this.eventNotificationId = null;
      } else { this.showResponseErrorMessages(data); }
    }, error => {
      this.showErrorStatus('g.unable.to.contact.server');
    });

  }


  public addFlightInfo(index) {
    this.index = index;
    let flightList = (<NgcFormArray>this.eventNotification.get(["eventNotificationList", this.index]).get('flightList')).getRawValue();
    if (flightList.length > 0) {
      this.flightInformation.get('flightList').patchValue(flightList);
    } else {
      let emptyList = [];
      this.flightInformation.get('flightList').patchValue(emptyList);
      this.addFlightRow();
    }
    this.addFlightWindow.open();
  }
  public addFlightRow() {
    const flight = new FlightInfo();
    flight.carrierCode = '';
    flight.flightKey = '';
    flight.flightDate = null;
    (<NgcFormArray>this.flightInformation.get("flightList")).addValue([flight]);
  }

  deleteFlight(index) {
    (<NgcFormArray>this.flightInformation.get("flightList")).markAsDeletedAt(index);
    if ((<NgcFormArray>this.flightInformation.get("flightList")).length === 0) {
      this.addFlightRow();
    }
  }

  public saveFlight() {
    let eventNotificationRequest: UserGroupRequest = new UserGroupRequest();
    let flightList = (<NgcFormArray>this.flightInformation.get("flightList")).getRawValue();
    eventNotificationRequest.flightList = flightList;

    this.userService.vallidateFlightInfo(eventNotificationRequest).subscribe(data => {
      this.refreshFormMessages(data);
      if (!this.showResponseErrorMessages(data)) {
        (<NgcFormArray>this.eventNotification.get(["eventNotificationList", this.index]).get('flightList')).patchValue(flightList);
        this.addFlightWindow.close();
      } else { this.showResponseErrorMessages(data); }
    }, error => {
      this.showErrorStatus('g.unable.to.contact.server');
    });

  }

  /**
   * On Select
   * 
   * @param event Event
   */
  private onSelect(event) {
    console.log(event);
  }

  deleteEventNotification(index) {
    (<NgcFormArray>this.eventNotification.get("eventNotificationList")).markAsDeletedAt(index);
    if ((<NgcFormArray>this.eventNotification.get('eventNotificationList')).getRawValue().length === 0) {
      this.addNotification();
    }
  }
  public onChange(event) {
    if (event.desc === 'TRANSHIPMENT_MONITORINGSLA') {
      this.showTransferType = true;
    } else {
      this.showTransferType = false;
    }
    this.transferType = this.createSourceParameter(event.desc);

  }
  public onChangePurpose(event) {
    const purpose = event;
    this.eventTypes = this.createSourceParameter(purpose);
    this.eventNotification.get('eventNotificationList').patchValue([]);
    this.showTableFlag = false;
    // this.addNotification();
    let getitin;
    this.eventNotification.get('getiton').patchValue(getitin);
  }
}
