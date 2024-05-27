import { Component, OnInit, ElementRef, ViewContainerRef, NgZone } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, PageConfiguration, NgcUtility } from 'ngc-framework';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsService } from '../events.service';
import { TemplateParameter, NotificationTemplate } from '../events.sharedmodel';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.css']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class CreateTemplateComponent extends NgcPage implements OnInit {

  hasReadPermission: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute, private router: Router, private userService: EventsService) {
    super(appZone, appElement, appContainerElement);
    // this.functionId = "PLAYGROUND";
  }

  ngOnInit() {
    super.ngOnInit();
    this.hasReadPermission = NgcUtility.hasReadPermission('SEARCH_TEMPLATE');
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null) {
      this.createTemplate.patchValue(forwardedData);
    }
    if ((<NgcFormArray>this.createTemplate.get('parametersList')).length === 0) {
      this.addRow();
    }
  }
  public createTemplate: NgcFormGroup = new NgcFormGroup({
    name: new NgcFormControl(),
    email: new NgcFormControl(),
    sms: new NgcFormControl(),
    fax: new NgcFormControl(),
    message: new NgcFormControl(),
    parametersList: new NgcFormArray([
    ])
  });
  save() {
    let notificationTemplate = new NotificationTemplate();
    notificationTemplate = this.createTemplate.getRawValue();
    console.log('data --------------------------' + JSON.stringify(notificationTemplate));
    this.userService.saveNotificationTemplate(notificationTemplate).subscribe(response => {
      this.refreshFormMessages(response);
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.navigateTo(this.router, '/warehouse/events/searchTemplate', null);
      }
    }, error => {
      this.showErrorStatus('g.unable.to.contact.server');
    })


  }

  public addRow() {
    const parameter = new TemplateParameter();
    parameter.parameterName = '';
    (<NgcFormArray>this.createTemplate.get('parametersList')).addValue([parameter
    ]);
  }
  public deleteParameter(index) {
    (<NgcFormArray>this.createTemplate.get('parametersList')).markAsDeletedAt(index);
    if ((<NgcFormArray>this.createTemplate.get('parametersList')).length === 0) {
      this.addRow();
    }

  }
}
