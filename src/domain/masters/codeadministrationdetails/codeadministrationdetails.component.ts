
import { Request } from './../../model/resp';
// Angular imports
import { Component, NgZone, ElementRef, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { Validators, PatternValidator } from '@angular/forms';
// NGC framework imports
import {
  NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcDropDownComponent, NgcButtonComponent,
  NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest, BaseResponse, PageConfiguration
} from 'ngc-framework';
import { NgcFormControl, NgcUtility } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
// Backend service imports
import { MastersService } from '../masters.service';
import {
  MaintainCodeAdminSearchRequest, MaintainCodeAdminInsertResponse, MaintainCodeAdminInsertRequest,
  MaintainCodeAdminDeleteRequest, MaintainCodeAdminUpdateRequest
} from '../masters.sharedmodel';

@Component({
  selector: 'app-codeadministrationdetails',
  templateUrl: './codeadministrationdetails.component.html',
  styleUrls: ['./codeadministrationdetails.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
/**
 * CodeadministrationComponent  is responsible to maintain the mappings of Maintain Code Administration
 */
export class CodeadministrationdetailsComponent extends NgcPage {
  showDetails: boolean = false;
  private codeAdminform: NgcFormGroup = new NgcFormGroup({
    code: new NgcFormControl(),
    desc: new NgcFormControl(),
    subGroupDetailsCode: new NgcFormControl(),
    subGroupDetailsDesc: new NgcFormControl(),
    codeAdminformLisst: new NgcFormArray([]),
  });
  parameter1: any;
  forwardedData: any;
  showStartAndLastDate: boolean;
  parameter2: any;
  min: Date;
  hasReadPermission: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute, private router: Router,
    private maintainCodeAdminService: MastersService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    var today = new Date();
    this.min = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    this.onSearch();
  }

  onSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('MAINTAIN_CODE_ADMINISTRATION');
    this.parameter1 = this.forwardedData.code;
    this.parameter2 = this.forwardedData.desc;
    this.showDetails = false;
    this.forwardedData.subGroupDetailsCode = this.codeAdminform.get('subGroupDetailsCode').value;
    if (this.forwardedData.groupCode === 'ACAS') {
      this.showStartAndLastDate = true;
    }
    this.maintainCodeAdminService.fetchSelectDataDetails(this.forwardedData).subscribe(data => {
      this.refreshFormMessages(data);
      if (!data.messageList) {
        if (data.data && data.data.length > 0) {
          (<NgcFormArray>this.codeAdminform.controls['codeAdminformLisst']).patchValue(data.data);
          this.showDetails = true;
        } else {
          this.showErrorMessage("no.record");
        }

      } else {
        this.showErrorStatus(data.messageList[0].message);
      }
    },
      error => {
        this.showErrorStatus('master.error.while.fetching.records.try.again');
      }
    );
  }


  onAddRow() {
    this.showDetails = true;
    (<NgcFormArray>this.codeAdminform.get('codeAdminformLisst')).addValue([
      {
        sequence: null,
        code: '',
        desc: '',
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        attribute5: null,
        createdDateOn: this.min,
        modifiedDateOn: '',
        subGroupDetailsCode: null,
        subGroupCode: this.parameter1
      }
    ]);
  }

  onSaveCodeAdministrationDetails(event) {
    this.codeAdminform.validate();
    if (this.codeAdminform.invalid) {
      return;
    }
    const saveRequest = (<NgcFormArray>this.codeAdminform.get(['codeAdminformLisst'])).getRawValue();
    for (let i = 0; i < saveRequest.length; i++) {
      for (let j = 0; j < saveRequest.length; j++) {
        if (i != j) {
          if (saveRequest[i].code === saveRequest[j].code) {
            this.showErrorStatus("master.duplicate.record.input.another.record");
            return;
          }
        }
      }
    }
    this.maintainCodeAdminService.onSaveCodeAdministrationDetails(saveRequest).subscribe(data => {
      if (!this.showFormErrorMessages(data)) {
        this.onSearch();
        (<NgcFormArray>this.codeAdminform.controls['codeAdminformLisst']).patchValue(data.data);
        this.showSuccessStatus('g.completed.successfully');
      }
    },
      error => {
        this.showErrorStatus('master.error.while.fetching.records.try.again');
      }
    );
  }

  deleteDetails(index) {
    (this.codeAdminform.get(['codeAdminformLisst', index]) as NgcFormGroup).markAsDeleted();
  }

  onCancelDetails(event) {
    this.forwardedData.code = this.forwardedData.groupCode;
    this.navigateTo(this.router, '/masters/codeadministrationcode', this.forwardedData);
  }

  setDescription(item, group) {

    // if (item && item.lovSelection) {

    this.codeAdminform.get(["codeAdminformLisst", group, "desc"]).patchValue(item.desc);
    // }
  }

  onSelectGroupDetailsCode(event) {
    this.codeAdminform.get('subGroupDetailsDesc').setValue(event.desc);
    this.showDetails = false;
  }

  onSelectGroupDetailsDesc(event) {
    this.codeAdminform.get('subGroupDetailsCode').setValue(event.code);
    this.showDetails = false;
  }
}
