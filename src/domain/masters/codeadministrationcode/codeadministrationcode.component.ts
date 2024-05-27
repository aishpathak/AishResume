
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
  selector: 'ngc-codeadministrationcode',
  templateUrl: './codeadministrationcode.component.html',
  styleUrls: ['./codeadministrationcode.component.scss']
})

/**
 * CodeadministrationComponent  is responsible to maintain the mappings of Maintain Code Administration
 */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class CodeadministrationcodeComponent extends NgcPage {
  parameter1: any;
  showDataTableDetails = false;
  private codeAdminform: NgcFormGroup = new NgcFormGroup({
    subGroupCode: new NgcFormControl(),
    subGroupCodeDesc: new NgcFormControl(),
    codeAdminformLisst: new NgcFormArray([]),
  });

  forwardedData: any;
  hasReadPermission: boolean = false;
  showDetails: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute, private router: Router,
    private maintainCodeAdminService: MastersService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    this.onSearch();
  }

  onSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('MAINTAIN_CODE_ADMINISTRATION');
    this.parameter1 = this.forwardedData.code;
    this.showDetails = false;
    this.forwardedData.subGroupCode = this.codeAdminform.get('subGroupCode').value;
    this.maintainCodeAdminService.fetchSelectDataCode(this.forwardedData).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.data && data.data.length > 0) {
        (<NgcFormArray>this.codeAdminform.controls['codeAdminformLisst']).patchValue(data.data);
        this.showDetails = true;
      } else {
        this.showErrorMessage("no.record");
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
        dataList: [],
        subGroupCode: null,
        groupCode: this.parameter1,
      }
    ]);
  }

  deleteSubGroupCode(index) {
    var request = (this.codeAdminform.get(['codeAdminformLisst', index]) as NgcFormGroup).value;
    this.showConfirmMessage('edi.delete.record.confirmation').then(fulfilled => {
      this.maintainCodeAdminService.deleteSubGroupCode(request).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.codeAdminform.reset();
          this.onSearch();
          this.showSuccessStatus('g.completed.successfully');
        } else {
          this.showResponseErrorMessages(data);
          return;
        }
      }, error => {
        this.showErrorMessage(error);
      })
    })
  }

  onSaveCodeAdministrationCode(event) {
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
    this.maintainCodeAdminService.onSaveCodeAdministrationCode(saveRequest).subscribe(data => {
      this.refreshFormMessages(data);
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

  onSelectData(event) {
    const requestData = (<NgcFormArray>this.codeAdminform.get(['codeAdminformLisst', event])).getRawValue();
    this.navigateTo(this.router, '/masters/codeadministrationdetails', requestData);
  }

  onCancelCode(event) {
    this.navigateTo(this.router, '/masters/codeadministration', null);
  }

  onSelectGroupCode(event) {
    this.codeAdminform.get('subGroupCodeDesc').setValue(event.desc);
    this.showDetails = false;
  }

  onSelectGroupDesc(event) {
    this.codeAdminform.get('subGroupCode').setValue(event.code);
    this.showDetails = false;
  }

}
