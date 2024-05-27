import { Subscription } from 'rxjs';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input, ViewChild } from '@angular/core';
import { NgModule } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, NgcButtonComponent, PageConfiguration } from 'ngc-framework';
import { MastersService } from '../masters.service';
import { MaintainSystemParameterUpdateResponse, MaintainSystemParameterUpdateRequest } from '../masters.sharedmodel';
import { MaintainSystemParameterReq, MaintainSystemParameterRequestSearch, MaintainSystemParameterRequestEdit, MaintainSystemParameterRes, MaintainSystemParameterEdit } from '../masters.sharedmodel';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngc-maintain-system-parameter',
  templateUrl: './maintainsystemparameter.component.html',
  styleUrls: ['./maintainsystemparameter.component.scss']
})
/**
 * Allow user to 	configure pre-defined parameters in the system.
 */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  restorePageOnBack: true,
  autoBackNavigation: true
})
export class MaintainSystemParameterComponent extends NgcPage {
  errors: any;
  dataDisplay: boolean;
  @ViewChild('window') window: NgcWindowComponent;
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  maintainSysParamList: any[] = [];
  MaintainSystemParamterReq: MaintainSystemParameterReq[];
  sysParamUpdateRequest: MaintainSystemParameterEdit[];
  sysParamterList: any[];
  resp: any;
  respData: any;
  responseArray: any[] = [];
  responseArrayName: any[] = [];
  activeFlag: string[] = ['YES', 'NO'];
  private systemParameterForm: NgcFormGroup = new NgcFormGroup({
    searchName: new NgcFormControl(),
    name: new NgcFormControl(),
    uid: new NgcFormControl(),
    code: new NgcFormControl(),
    active: new NgcFormControl(),
    value: new NgcFormControl(),
    purpose: new NgcFormControl(),
    parameterValueNum: new NgcFormControl(),
    parameterValueDate: new NgcFormControl(),
    startDate:  new NgcFormControl(),
    endDate: new NgcFormControl(),

    maintainSysParam: new NgcFormArray(
      [

      ]
    ),

  });

  /**
   * Initialize
   *
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private maintainSysService: MastersService, private route: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
    this.sysParamterList = [];
  }

  ngOnInit() {
    super.ngOnInit();
    this.fetchSystemParameterList();
  }
  /**
   * This Function will Fetch All System Parameter List
   */
  public fetchSystemParameterList() {
    const systemParam: MaintainSystemParameterReq = new MaintainSystemParameterReq();

    this.maintainSysService.fetchSystemParameter(systemParam).subscribe(data => {
      this.resp = data;
      this.responseArray = this.resp.data;
      if (this.responseArray.length > 0) {
        this.populateTable();
      }

      else {

        this.showInfoStatus('no.record.found');
      }
    },
      error => {
        this.errors = this.resp.messageList;
        this.showErrorStatus(this.errors[0].message);
      }
    );
  }



  /**
   * This function will display data one by one from responseArray on screen
   *
   */
  public populateTable() {
    this.editFunction();
    for (let i = 0; i < this.responseArray.length; ++i) {
      this.responseArray[i].sno = i + 1;
    }
    (<NgcFormArray>this.systemParameterForm.controls['maintainSysParam']).patchValue(this.responseArray);

  }

  /**
   * This Function will fetch System Parameter Data onSearch
   * @param:name
   */
  public onSearch() {
    const systemParam: MaintainSystemParameterRequestSearch = new MaintainSystemParameterRequestSearch();
    if (null !== this.systemParameterForm.get('searchName').value && "" !== this.systemParameterForm.get('searchName').value) {
      this.maintainSysService.fetchSystemParameterByName(this.systemParameterForm.get('searchName').value.toUpperCase(), {}).subscribe(data => {
        this.respData = data;
        this.responseArrayName = this.respData.data;
        if (!this.respData.messageList) {
          this.displaySearchByName();
        } else {
          this.errors = this.resp.messageList;
          this.showErrorStatus(this.errors[0].message);
        }
      },
      );
    } else {
      this.fetchSystemParameterList();
    }

  }

  /**
   * This function will display data along with Show Success Status and show Error Status When Search By Name
   */
  public displaySearchByName() {
    this.editFunctionByName();
    for (let i = 0; i < this.responseArrayName.length; ++i) {
      this.responseArrayName[i].sno = i + 1;
    }

    (<NgcFormArray>this.systemParameterForm.controls['maintainSysParam']).patchValue(this.responseArrayName);

    if (this.responseArrayName.length > 0) {

      this.showSuccessStatus('g.completed.successfully');

    }
    else {

      this.errors = this.resp.messageList;
      this.showErrorStatus(this.errors[0].message);
      this.showInfoStatus('no.record.found');
    }
  }
  /**
   * On Link Click for Edit Button
   *
   * @param event Event
   */
  public onLinkClick(event) {
    if (event.type === 'link') {
      this.window.open();
      this.systemParameterForm.get('code').setValue(event.record.code);
      this.systemParameterForm.get('name').setValue(event.record.name);
      this.systemParameterForm.get('active').setValue(event.record.active);
      this.systemParameterForm.get('purpose').setValue(event.record.purpose);
      this.systemParameterForm.get('value').setValue(event.record.value);
      this.systemParameterForm.get('parameterValueNum').setValue(event.record.parameterValueNum);
      this.systemParameterForm.get('parameterValueDate').setValue(event.record.parameterValueDate);
      this.systemParameterForm.get('startDate').setValue(event.record.startDate);
      this.systemParameterForm.get('endDate').setValue(event.record.endDate);
      this.systemParameterForm.patchValue(this.maintainSysParamList[event.record.code]);
    }
  }

  /**
    * Function to create a object to add to the list that has to be sent to backend for updation
    * @param updateData
    * @param Code
    */
  onUpdate(event) {
    const updateRequest: MaintainSystemParameterUpdateRequest = new MaintainSystemParameterUpdateRequest();
    updateRequest.code = this.systemParameterForm.get('code').value;
    updateRequest.name = this.systemParameterForm.get('name').value;
    updateRequest.purpose = this.systemParameterForm.get('purpose').value;
    updateRequest.value = this.systemParameterForm.get('value').value;
    updateRequest.active = this.systemParameterForm.get('active').value;
    updateRequest.parameterValueNum =this.systemParameterForm.get('parameterValueNum').value;
    updateRequest.parameterValueDate = this.systemParameterForm.get('parameterValueDate').value;
    updateRequest.startDate = this.systemParameterForm.get('startDate').value;
    updateRequest.endDate = this.systemParameterForm.get('endDate').value;
    updateRequest.LastModifiedBy = this.getUserProfile().userLoginCode;
    if (!updateRequest.purpose || !updateRequest.active || !updateRequest.startDate) {
      this.showErrorStatus("master.mandatory.fields.required");
      return;
    }
    if (this.systemParameterForm.get('startDate').value === null){
      this.showWarningStatus('startDateEmpty');
      return;
    }
    this.maintainSysService.updateSysParamter(updateRequest).subscribe(data => {
      this.resp = data;
      this.refreshFormMessages(data);
      if (!this.resp.messageList) {
        this.showSuccessStatus('g.completed.successfully');
        this.onsaveCancel();
        this.onSearch();
        //this.fetchSystemParameterList();

      } else {
        this.errors = this.resp.messageList;
        this.showErrorStatus(this.errors[0].message);
      }
    }
    )
  }

  /**
   * This Function will work for  Hide Window after data Saved
   */
  onsaveCancel() {
    this.window.hide();

  }
  /**
  * This Function will work for Window Cancel Button
  */
  onCancel() {
    this.window.hide();
  }
  /**
  * This Function will work for Custom dataFiled
  */
  public editFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]['edit'] = 'Edit';
    }
  }

  public editFunctionByName() {
    for (let index = 0; index < this.responseArrayName.length; index++) {
      this.responseArrayName[index]['edit'] = 'Edit';
    }
  }
}

