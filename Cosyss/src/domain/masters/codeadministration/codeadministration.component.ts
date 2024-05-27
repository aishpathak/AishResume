
import { Request } from './../../model/resp';
// Angular imports
import { Component, NgZone, ElementRef, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { Validators, PatternValidator } from '@angular/forms';
// NGC framework imports
import {
  NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcDropDownComponent, NgcButtonComponent,
  NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest, BaseResponse, PageConfiguration, NgcEditTableComponent
} from 'ngc-framework';
import { NgcFormControl } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
// Backend service imports
import { MastersService } from '../masters.service';
import {
  MaintainCodeAdminSearchRequest, MaintainCodeAdminInsertResponse, MaintainCodeAdminInsertRequest,
  MaintainCodeAdminDeleteRequest, MaintainCodeAdminUpdateRequest
} from '../masters.sharedmodel';

@Component({
  selector: 'ngc-codeadministration',
  templateUrl: './codeadministration.component.html',
  styleUrls: ['./codeadministration.component.scss']
})

/**
 * CodeadministrationComponent  is responsible to maintain the mappings of Maintain Code Administration
 */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class CodeadministrationComponent extends NgcPage {
  @ViewChild("goTo") goTo: NgcEditTableComponent;
  @ViewChild('addWindow') addWindow: NgcWindowComponent;
  @ViewChild('editWindow') editWindow: NgcWindowComponent;
  @ViewChild('groupSelectedValue') groupSelectedValue: NgcDropDownComponent;
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  updateArray: any = [];
  oldDescUpdate: any;
  oldCodeUpdate: any;
  showTable: boolean;
  showSubGroupSearch: boolean;
  showTableAddButton = false;
  resultFlag: boolean = false;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute, private router: Router,
    private maintainCodeAdminService: MastersService) {
    super(appZone, appElement, appContainerElement);
  }
  private codeAdminform: NgcFormGroup = new NgcFormGroup({
    codeEdit: new NgcFormControl(),
    groupCtrl: new NgcFormControl(),
    codeForData: new NgcFormArray([]),
    subGroupCtrl: new NgcFormControl(),
    codeDescDataCtrl: new NgcFormArray([])
  });
  private codeAdminformSearch: NgcFormGroup = new NgcFormGroup({
    code: new NgcFormControl(null),
    desc: new NgcFormControl(null)
  });
  resp: any;
  deleResp: any;
  updateResp: any;
  dataToFilter: any
  responseArray: any = [];
  selectedRows: any = [];


  ngOnInit() {
    super.ngOnInit();
    this.onSearch();
    this.showTable = false;
  }

  onSearch() {
    this.resultFlag = false;
    this.maintainCodeAdminService.fetchSelectData(this.codeAdminformSearch.getRawValue()).subscribe(data => {
      this.refreshFormMessages(data);
      //this.showSuccessStatus('g.completed.successfully');
      if (data.data && data.data.length > 0) {
        (<NgcFormArray>this.codeAdminform.controls['codeForData']).patchValue(data.data);
        this.resultFlag = true;
      } else {
        this.showErrorMessage("no.record");
      }
    },
      error => {
        this.showErrorStatus('master.error.while.fetching.records.try.again');
      }
    );
  }

  onSelectData(index) {
    const record = (<NgcFormGroup>this.codeAdminform.get(['codeForData', index])).getRawValue();
    this.navigateTo(this.router, '/masters/codeadministrationcode', record);
  }

  /**
   * This function, opens Addwindow and set Code And description field blank
  */
  public onAddRow() {
    (<NgcFormArray>this.codeAdminform.get('codeForData')).addValue([
      {
        sequence: null,
        code: '',
        desc: '',
        dataList: [],
        groupCode: null
      }
    ]);
    this.goTo.goToLastPage();
  }

  onSaveCodeAdministration(event) {
    this.codeAdminform.validate();
    if (this.codeAdminform.invalid) {
      return;
    }
    const saveRequest = (<NgcFormArray>this.codeAdminform.get(['codeForData'])).getRawValue();
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
    this.maintainCodeAdminService.onSaveCodeAdministration(saveRequest).subscribe(data => {
      if (!this.showFormErrorMessages(data)) {
        this.onSearch();
        this.refreshFormMessages(data);
        this.showSuccessStatus('g.completed.successfully');

      }
    });
  }
  
  deleteDetails(index) {
    var request = (this.codeAdminform.get(['codeForData', index]) as NgcFormGroup).value;
    this.showConfirmMessage('edi.delete.record.confirmation').then(fulfilled => {
      this.maintainCodeAdminService.deleteGroupCode(request).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.codeAdminformSearch.reset();
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
  onSelectCode() {
    this.resultFlag = false;
    this.codeAdminform.reset();
  }

}


