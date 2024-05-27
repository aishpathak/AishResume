import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcWindowComponent, NgcUtility } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../events.service';
import { EventNotification, NotifyUser, UserGroupRequest, FlightInfo, NotificationTemplate } from '../events.sharedmodel';

@Component({
  selector: 'app-search-template',
  templateUrl: './search-template.component.html',
  styleUrls: ['./search-template.component.css']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class SearchTemplateComponent extends NgcPage implements OnInit {
  showTableFlag: any;
  hasReadPermission: boolean = false;


  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private userService: EventsService) {
    super(appZone, appElement, appContainerElement);
    // this.functionId = "PLAYGROUND";
  }
  ngOnInit() {
    this.fetchTemplateList();
  }
  public ngAfterViewInit(): void {
    // TODO what is the use of below line?
    super.ngAfterViewInit();

  }

  public searchTemplate: NgcFormGroup = new NgcFormGroup({
    name: new NgcFormControl(),
    checked: new NgcFormControl(),
    templateList: new NgcFormArray([
    ])
  });


  public fetchTemplateList() {
    this.hasReadPermission = NgcUtility.hasReadPermission('SEARCH_TEMPLATE');
    let request: NotificationTemplate = new NotificationTemplate();
    request.name = this.searchTemplate.get("name").value;
    this.userService.fetchNotificationTemplate(request).subscribe(response => {
      this.refreshFormMessages(response);
      if (!this.showResponseErrorMessages(response)) {
        if (response.data != null && response.data.length > 0) {
          // this.showResponseErrorMessages(response);
          this.searchTemplate.get('templateList').patchValue(response.data);
          this.showTableFlag = true;
        } else {
          this.showErrorStatus('warehouse.norecordfound');
          this.showTableFlag = false;
        }
      }
    }, error => {
      this.showErrorStatus('g.unable.to.contact.server');
    })

  }

  public createTemplate() {
    this.navigateTo(this.router, '/warehouse/events/createTemplate', null);
  }
  public onLinkClick(event) {
    console.log('onclink value' + event);
    if (event.column === 'edit') {
      let record = (<NgcFormGroup>this.searchTemplate.get(['templateList', event.record.NGC_ROW_ID])).getRawValue();
      this.navigateTo(this.router, '/warehouse/events/createTemplate', record);
    }
    this.deleteElement(event);

  }
  public deleteElement(event) {
    (<NgcFormArray>this.searchTemplate.get("templateList")).markAsDeletedAt(event.record.NGC_ROW_ID);
  }
  public deleteTemplate() {
    let rawist = (<NgcFormGroup>this.searchTemplate.get('templateList')).getRawValue();
    if (rawist.length > 0) {
      let templateRequest: UserGroupRequest = new UserGroupRequest();
      templateRequest.templateList = rawist;
      this.userService.deleteNotificationTemplate(templateRequest).subscribe(response => {
        this.refreshFormMessages(response);
        if (!this.showResponseErrorMessages(response)) {
          if (response.data != null && response.data.length > 0) {
            this.searchTemplate.get('templateList').patchValue(response.data);
            this.showTableFlag = true;
            this.showSuccessStatus('g.completed.successfully');
          } else {
            this.showTableFlag = false;
          }
        }
      }, error => {
        this.showErrorStatus('g.unable.to.contact.server');
      })
    }
  }
}
