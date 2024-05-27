import { Router } from '@angular/router';
// Angular imports
import { Validators } from '@angular/forms';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';

// NGC framework imports
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcReportComponent
} from 'ngc-framework';

import { AdminService } from '../../admin.service';
import { RcarNumber } from '../../admin.sharedmodel'
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-rcar-number',
  templateUrl: './rcar-number.component.html',
  styleUrls: ['./rcar-number.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
  // restorePageOnBack: true
})
export class RcarNumberComponent extends NgcPage implements OnInit {
  customerIdPop: any;

  @ViewChild('insertionWindow') insertionWindow: NgcWindowComponent;
  @ViewChild('updateInsertionWindow') updateInsertionWindow: NgcWindowComponent;
  @ViewChild('searchbutton') searchbutton: NgcButtonComponent;
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  reportParameters: any = new Object();
  showButtons: boolean = false;
  rcarNumberList: any[];
  response: any;
  columnName: any;
  record: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private adminService: AdminService, private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  private rcarNumberForm: NgcFormGroup = new NgcFormGroup
    ({
      id: new NgcFormControl(),
      customerUpdateCode: new NgcFormControl(),
      customerUpdateName: new NgcFormControl(),
      rcarUpdateNumber: new NgcFormControl(),
      rcarUpdateStatus: new NgcFormControl(),
      startUpdateDate: new NgcFormControl(),
      endUpdateDate: new NgcFormControl(),
      customerId: new NgcFormControl(),
      customerCode: new NgcFormControl(),
      customerName: new NgcFormControl(),
      iataAgentCode: new NgcFormControl(),
      rcarStatus: new NgcFormControl(),
      groupCode: new NgcFormControl(),
      rcarNumber: new NgcFormControl(),
      customerRCARAgentGroupId: new NgcFormControl(),
      customerRCARRegistrationId: new NgcFormControl(),
      startDate: new NgcFormControl(),
      endDate: new NgcFormControl(),
      groupCodeId: new NgcFormControl(),
      searchList: new NgcFormArray(
        [
          new NgcFormGroup({
            customerCode: new NgcFormControl(),
            customerName: new NgcFormControl(),
            iataAgentCode: new NgcFormControl(),
            groupCode: new NgcFormControl(),
            rcarNumber: new NgcFormControl(),
            startDate: new NgcFormControl(),
            customerRCARAgentGroupId: new NgcFormControl(),
            customerRCARRegistrationId: new NgcFormControl(),
            endDate: new NgcFormControl(),
            lastUpdatedBy: new NgcFormControl(),
            lastUpdatedOn: new NgcFormControl()
          })
        ]
      )
    })

  private addRcarNumberForm: NgcFormGroup = new NgcFormGroup
    ({
      customerId: new NgcFormControl(),
      customerCode: new NgcFormControl(),
      customerName: new NgcFormControl(),
      // rcarStatus: new NgcFormControl(),
      rcarNumber: new NgcFormControl(),
      customerRCARAgentGroupId: new NgcFormControl(),
      groupCode: new NgcFormControl(),
      startDate: new NgcFormControl(),
      customerRCARRegistrationId: new NgcFormControl(),
      endDate: new NgcFormControl(),
      groupCodeId: new NgcFormControl()
    })

  ngOnInit() {
    super.ngOnInit();
    const forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {
      this.rcarNumberForm.reset();
      // this.addRcarNumberForm.reset();
      this.rcarNumberForm.get('customerCode').patchValue(forwardedData.customerCode);
      this.rcarNumberForm.get('customerName').patchValue(forwardedData.customerName);
      this.onSearch();
    }
  }

  onSearch() {
    // this.OnSelect(event);
    const rcarNumber = this.rcarNumberForm.getRawValue();
    const rcar: RcarNumber = new RcarNumber();
    rcar.customerCode = this.rcarNumberForm.get('customerCode').value;
    rcar.customerName = this.rcarNumberForm.get('customerName').value;
    rcar.iataAgentCode = this.rcarNumberForm.get('iataAgentCode').value;
    //rcar.rcarStatus = this.rcarNumberForm.get('rcarStatus').value;
    rcar.startDate = this.rcarNumberForm.get('startDate').value;
    rcar.endDate = this.rcarNumberForm.get('endDate').value;
    rcar.customerRCARAgentGroupId = this.rcarNumberForm.get('customerRCARAgentGroupId').value;
    if (rcar.customerCode == "") {
      rcar.customerCode = null;
    }


    this.adminService.searchRcarNumber(rcar).subscribe(resp => {
      this.refreshFormMessages(resp);
      if (resp.data[0]) {
        this.response = resp.data;
        this.rcarNumberList = this.response;
        this.formatDate();
        (<NgcFormArray>this.rcarNumberForm.controls['searchList']).patchValue(this.rcarNumberList);
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

  exportToExcel() {
    this.reportParameters.customer_code = this.rcarNumberForm.get('customerCode').value;
    this.reportParameters.group_id = this.rcarNumberForm.get('customerRCARAgentGroupId').value;
    this.reportParameters.start_date = this.rcarNumberForm.get('startDate').value;
    this.reportParameters.end_date = this.rcarNumberForm.get('endDate').value;
    this.reportParameters.iataAgentCode = this.rcarNumberForm.get('iataAgentCode').value;
    //alert(JSON.stringify(this.reportParameters) + " " + this.rcarNumberForm.get('customerRCARAgentGroupId').value);
    this.reportWindow.downloadReport();
  }

  searchAll() {
    const rcarNumber = this.rcarNumberForm.getRawValue();
    this.adminService.fetchAllRcarNumber(rcarNumber).subscribe(data => {
      this.response = data;
      this.rcarNumberList = this.response.data;
      this.rcarNumberList.forEach(element => {
        element['id'] = false;
      });
      this.formatDate();
      (<NgcFormArray>this.rcarNumberForm.controls['searchList']).patchValue(this.rcarNumberList);
      this.showButtons = true;
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  onLinkClick(event) {
    this.rcarNumberForm.get('customerUpdateName').setValue(event.record.customerName);
    this.rcarNumberForm.get('customerUpdateCode').setValue(event.record.customerCode);
    this.rcarNumberForm.get('rcarUpdateStatus').setValue(event.record.groupCode);
    this.rcarNumberForm.get('customerRCARAgentGroupId').setValue(event.record.customerRCARAgentGroupId);
    this.rcarNumberForm.get('customerRCARRegistrationId').setValue(event.record.customerRCARRegistrationId);
    this.rcarNumberForm.get('rcarUpdateNumber').setValue(event.record.rcarNumber);
    this.rcarNumberForm.get('startUpdateDate').setValue(event.record.startDate);
    this.rcarNumberForm.get('endUpdateDate').setValue(event.record.endDate);

    if (event.type === 'link') {
      this.columnName = event.column;
      this.record = event.record;
      this.customerIdPop = this.record.customerId;
      if (this.columnName === 'EDIT') {
        this.updateInsertionWindow.open();
        this.addRcarNumberForm.reset();
      }
      if (this.columnName === 'customerName') {
        const record = event.record;
        // this.addRcarNumberForm.reset();
        this.rcarNumberForm.reset();
        this.adminService.dataFromCustomerListToCustomermaster = record;
        // this.router.navigate('admin/maintaincustomer', event.record);
        this.navigateTo(this.router, 'admin/maintaincustomer', event.record);

      }
    }
  }



  update() {
    const customerId = this.customerIdPop;
    this.rcarNumberForm.get('customerId').setValue(customerId);

    let updateRcar: any = (<NgcFormGroup>this.rcarNumberForm).getRawValue();
    this.adminService.updateRcarNumber(updateRcar).subscribe(data => {
      let x: any = data;
      if (x == 1) {
        this.searchAll();
        this.updateInsertionWindow.close();
        this.showSuccessStatus('g.updated.successfully');
      }
      else if (data.data === null) {
        this.refreshFormMessages(data);
      }
    })
  }


  onAdd() {
    this.insertionWindow.open();
    this.addRcarNumberForm.reset();
  }

  save() {
    const request = this.addRcarNumberForm.getRawValue();
    request.customerRCARAgentGroupId = this.rcarNumberForm.get('customerRCARAgentGroupId').value;
    if (request.endDate === " ") {
      request.endDate = null;
    }

    this.adminService.addRcarNumber(request).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.data) {
        this.searchAll();
        this.showSuccessStatus("g.added.successfully");
        this.insertionWindow.hide();
      } else {
        this.showErrorStatus(data.messageList[0].code);
        // this.refreshFormMessages(data);
        this.response = data;
      }
    },
      error => {
        this.showErrorStatus(error.messageList[0].message);
        this.insertionWindow.hide();
      })
  }

  OnSelect(object) {
    this.rcarNumberForm.get('customerName').setValue(object.desc);
  }

  onCompanyNameLOVSelect(object) {
    //  this.customerIdData = object.param1;
    this.rcarNumberForm.get('customerCode').setValue(object.code);
    // this.addCustomerForm.get('customerShortName').setValue(object.desc);
  }

  onSelectRcarCode(event) {
    //  this.customerIdData = object.param1;
    this.rcarNumberForm.get('customerRCARAgentGroupId').setValue(event.param1);

    // this.addCustomerForm.get('customerShortName').setValue(object.desc);
  }




  OnSelectAdd(event) {
    this.addRcarNumberForm.get('customerName').setValue(event.desc);
    this.addRcarNumberForm.get('customerId').setValue(event.param1);
  }

  onClear() {
    this.showButtons = false;
    this.rcarNumberForm.reset();
  }

  formatDate() {
    for (let index = 0; index < this.rcarNumberList.length; index++) {
      this.rcarNumberList[index]['startDate'] =
        NgcUtility.toDateFromLocalDate(this.rcarNumberList[index]['startDate']);
      this.rcarNumberList[index]['endDate'] =
        NgcUtility.toDateFromLocalDate(this.rcarNumberList[index]['endDate']);
      this.rcarNumberList[index]['lastUpdatedOn'] =
        NgcUtility.toDateFromLocalDate(this.rcarNumberList[index]['lastUpdatedOn']);
    }
  }
}
