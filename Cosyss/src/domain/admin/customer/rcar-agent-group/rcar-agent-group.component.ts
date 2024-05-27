
import { Router } from '@angular/router';
// Angular imports
import { Validators } from '@angular/forms';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';

// NGC framework imports
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration
} from 'ngc-framework';

import { AdminService } from '../../admin.service';
import { RcarAgentGroup } from '../../admin.sharedmodel'

@Component({
  selector: 'app-rcar-agent-group',
  templateUrl: './rcar-agent-group.component.html',
  styleUrls: ['./rcar-agent-group.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class RcarAgentGroupComponent extends NgcPage implements OnInit {
  customerRcarAgentGroupIdPop: any;

  @ViewChild('insertionWindow') insertionWindow: NgcWindowComponent;
  @ViewChild('updateInsertionWindow') updateInsertionWindow: NgcWindowComponent;
  @ViewChild('searchbutton') searchbutton: NgcButtonComponent;
  showButtons: boolean = false;
  rcarAgentGroupList: any[];
  response: any;
  columnName: any;
  record: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private adminService: AdminService, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  private rcarAgentGroupForm: NgcFormGroup = new NgcFormGroup
    ({
      customerRcarAgentGroupId: new NgcFormControl(),
      groupCode: new NgcFormControl(),
      description: new NgcFormControl(),
      statusCode: new NgcFormControl(),
      lastUpdatedBy: new NgcFormControl(),
      lastUpdatedOn: new NgcFormControl(),
      groupUpdateCode: new NgcFormControl(),
      updateDescription: new NgcFormControl(),
      statusUpdateCode: new NgcFormControl(),
      customerRcarAgentGroupUpdateId: new NgcFormControl(),
      searchList: new NgcFormArray(
        [
          new NgcFormGroup({
            groupCode: new NgcFormControl(),
            scInd: new NgcFormControl(),
            description: new NgcFormControl(),
            statusCode: new NgcFormControl(),
            customerRcarAgentGroupId: new NgcFormControl(),
            lastUpdatedBy: new NgcFormControl(),
            lastUpdatedOn: new NgcFormControl()
          })
        ]
      )
    })

  private addRcarAgentGroupForm: NgcFormGroup = new NgcFormGroup
    ({
      //customerRcarAgentGroupId: new NgcFormControl(),
      groupCode: new NgcFormControl(),
      description: new NgcFormControl(),
      statusCode: new NgcFormControl(),

    })

  ngOnInit() {
    super.ngOnInit();
  }

  onSearch() {
    // this.OnSelect(event);
    const rcarAgentGroup = this.rcarAgentGroupForm.getRawValue();
    const rcar: RcarAgentGroup = new RcarAgentGroup();
    rcar.groupCode = this.rcarAgentGroupForm.get('groupCode').value;
    rcar.description = this.rcarAgentGroupForm.get('description').value;
    rcar.statusCode = this.rcarAgentGroupForm.get('statusCode').value;

    this.adminService.searchRcarAgentGroup(rcar).subscribe(resp => {
      if (resp.data[0]) {
        this.response = resp.data;
        this.rcarAgentGroupList = this.response;
        (<NgcFormArray>this.rcarAgentGroupForm.controls['searchList']).patchValue(this.rcarAgentGroupList);
        this.showButtons = true;
      }
      else {
        this.showErrorStatus("no.record");
        this.showButtons = false;
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  searchAll() {
    const rcarAgentGroup = this.rcarAgentGroupForm.getRawValue();
    this.adminService.fetchAllRcarAgentGroup(rcarAgentGroup).subscribe(data => {
      this.response = data;
      this.rcarAgentGroupList = this.response.data;
      this.rcarAgentGroupList.forEach(element => {
        element['id'] = false;
      });
      (<NgcFormArray>this.rcarAgentGroupForm.controls['searchList']).patchValue(this.rcarAgentGroupList);
      this.showButtons = true;

    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  onLinkClick(event) {
    this.rcarAgentGroupForm.get('groupUpdateCode').setValue(event.record.groupCode);
    this.rcarAgentGroupForm.get('updateDescription').setValue(event.record.description);
  

    var arr = event.record.statusCode.split(",");
      var arr1 = [];
  
    for (let i=0;i<arr.length;i++)
     {
    
      arr1.push(arr[i]);

     }
    
    this.rcarAgentGroupForm.get('statusUpdateCode').patchValue(arr1);
    if (event.type === 'link') {
      this.columnName = event.column;
      this.record = event.record;
      this.customerRcarAgentGroupIdPop = this.record.customerRcarAgentGroupId;
      if (this.columnName === 'EDIT') {
        this.updateInsertionWindow.open();
        this.addRcarAgentGroupForm.reset();
      }
    }
  }



  update() {
    const customerRcarAgentGroupId = this.customerRcarAgentGroupIdPop;
    this.rcarAgentGroupForm.get('customerRcarAgentGroupId').setValue(customerRcarAgentGroupId);
    let updateRcar: any = (<NgcFormGroup>this.rcarAgentGroupForm).getRawValue();
    this.adminService.updateRcarAgentGroup(updateRcar).subscribe(data => {
      let x: any = data;
      if (x == 1) {
        this.searchAll();
        this.updateInsertionWindow.close();
        this.showSuccessStatus("g.updated.successfully");
      }
      else if (data.data === null) {
        this.refreshFormMessages(data);
      }
    })
  }


  onAdd() {
    this.insertionWindow.open();
    this.addRcarAgentGroupForm.reset();
  }

  save() {
    const request = this.addRcarAgentGroupForm.getRawValue();

    this.adminService.addRcarAgentGroup(request).subscribe(data => {
      if (data.data) {
        this.searchAll();
        this.showSuccessStatus("g.added.successfully");
        this.insertionWindow.hide();
      } else {
        this.refreshFormMessages(data);
        this.response = data;
      }
    },
      error => {
        this.showErrorStatus(error.messageList[0].message);
        this.insertionWindow.hide();
      })
  }


  public deleteData() {
    //const rcarAgentGroup = this.rcarAgentGroupForm.getRawValue();


    console.log(<NgcFormArray>this.rcarAgentGroupForm.get(
      "searchList").value)
    const indices: any = [];
    for (let index = this.rcarAgentGroupList.length - 1; index >= 0; index--) {
      const item = (<NgcFormArray>this.rcarAgentGroupForm.get(
        "searchList"
      ))["controls"][index]["value"];
      if (item.scInd) {
        indices.push(item);
      }
    }
    if (!indices.length) {
      this.showErrorStatus("admin.select.record.delete");
      return;
    }
    this.adminService.deleteRcarAgentGroup(indices).subscribe(
      data => {
        this.refreshFormMessages(data);
        this.response = data;

        this.showSuccessStatus("g.deleted.successfully");
        this.searchAll();
        // this.window.hide();
        //this.showTable();
      },
      error => {
        this.showErrorStatus("admin.invalid.data.deleted");
      }
    );
  }

  OnSelect(event) {
    this.rcarAgentGroupForm.get('description').setValue(event.desc);

  }


  OnSelectDescription(event) {
    this.rcarAgentGroupForm.get('groupCode').setValue(event.code);

  }



}

