import { AdminService } from './../../admin.service';
import { FormGroup } from '@angular/forms';
import { element } from 'protractor';
import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, NgcTemplate, PageConfiguration
} from 'ngc-framework';
import { log } from 'util';
@Component({
  selector: 'app-overseas-consignee',
  templateUrl: './overseas-consignee.component.html',
  styleUrls: ['./overseas-consignee.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class OverseasConsigneeComponent extends NgcPage {
  overseasFlag: boolean;
  @ViewChild('window') window: NgcWindowComponent;
  errors: any;
  arrayUser: any;
  resp: any;

  private overseasConsigneeForm: NgcFormGroup = new NgcFormGroup({
    destinationCode: new NgcFormControl(),
    consigneeName: new NgcFormControl(),
    countryCode: new NgcFormControl(),
    overseasConsigneeArray: new NgcFormArray([])
  });
  private viewOverseasConsigneeForm: NgcFormGroup = new NgcFormGroup({
    destinationCode: new NgcFormControl(),
    consigneeName: new NgcFormControl(),
    countryCode: new NgcFormControl(),
    consigneeAddress: new NgcFormControl(),
    consigneePhone: new NgcFormControl(),
    consigneePlace: new NgcFormControl(),
    consigneePostalCode: new NgcFormControl(),
    consigneeState: new NgcFormControl(),
  });
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router,
    private adminService: AdminService) {
    super(appZone, appElement, appContainerElement);
  }
  ngOnInit() {
    super.ngOnInit();
    this.overseasFlag = false;
    var str = this.viewOverseasConsigneeForm.controls.consigneeAddress.value;
    var str1 = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
    var res = str1.split(" ", 35);

  }

  onSearchConsignee(event) {
    const request = this.overseasConsigneeForm.getRawValue();
    this.adminService.onSearchConsignee(request).subscribe(data => {
      this.resp = data;
      this.arrayUser = this.resp.data;
      this.refreshFormMessages(data);
      if (this.arrayUser.length > 0) {
        this.overseasFlag = true;
        (<NgcFormArray>this.overseasConsigneeForm.controls['overseasConsigneeArray']).patchValue(this.arrayUser);
      } else {
        this.overseasFlag = false;
        this.showErrorStatus('no.record');
      }
    }, error => this.showErrorStatus('g.error'));
  }

  onSave(event) {

    this.overseasConsigneeForm.validate();
    if (!this.overseasConsigneeForm.invalid) {
      const saveRequest = (<NgcFormArray>this.overseasConsigneeForm.get(['overseasConsigneeArray'])).getRawValue();
      this.adminService.onSaveConsignee(saveRequest).subscribe(data => {
        this.resp = data;
        this.arrayUser = this.resp.data;
        this.refreshFormMessages(data);
        if (this.resp.data) {
          this.overseasFlag = true;
          (<NgcFormArray>this.overseasConsigneeForm.controls['overseasConsigneeArray']).patchValue(this.arrayUser);
          this.showSuccessStatus('g.completed.successfully');
        } else {
          this.showErrorStatus(this.resp.messageList[0].message);
        }
      }, error => this.showErrorStatus('g.error'));
    }
  }

  onConsignee() {
    this.overseasFlag = true;
    (<NgcFormArray>this.overseasConsigneeForm.controls['overseasConsigneeArray']).addValue([
      {
        countryCode: null,
        consigneeName: null,
        consigneePhone: null,
        consigneePlace: null,
        consigneeState: null,
        destinationCode: null,
        consigneeAddress: null,
        consigneePostalCode: null
      }
    ]);

  }
}