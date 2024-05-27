import { Router } from '@angular/router';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration } from 'ngc-framework';

@Component({
  selector: 'app-user-certification-list',
  templateUrl: './user-certification-list.component.html',
  styleUrls: ['./user-certification-list.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class UserCertificationListComponent extends NgcPage {
  private userertificationForm: NgcFormGroup = new NgcFormGroup({
    companyCode: new NgcFormControl(),
    departmentCode: new NgcFormControl(),
    applicationName: new NgcFormControl(),
    userCertificationList: new NgcFormArray([])
  });
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }

}
