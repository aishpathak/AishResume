import { Component, NgZone, ElementRef, ViewContainerRef, ViewChild, OnInit } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcUtility, NgcWindowComponent,
  NgcButtonComponent, PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import { Validators, PatternValidator, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { CustomerList, SearchCustomerList } from '../../admin.sharedmodel';
import { AdminService } from '../../admin.service';
import { element } from 'protractor';
import { By } from '@angular/platform-browser';
import { ApplicationEntities } from '../../../common/applicationentities';

@Component({
  selector: 'app-customerListByAppointedAgent',
  templateUrl: './customerListByAppointedAgent.component.html',
  styleUrls: ['./customerListByAppointedAgent.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class CustomerListByAppointedAgentComponent extends NgcPage implements OnInit {

  @ViewChild('transferWindow') transferWindow: NgcWindowComponent;
  formValue: any;
  move: any[];
  customerList: any[];
  date = new Date;
  appointeeCod: any;
  show = false;
  showTransferTable = false;
  showButtons = false;
  response: any;
  transferResponse: any;
  search: SearchCustomerList;
  searchTtransfer: SearchCustomerList;
  code: any;
  pageMode: any;
  reportParameters: any;
  currentUrl: any
  showButtonsExportToExcel = false;
  appointedAgentFlag = false;
  contractorCodeFlag = false;
  searchButtonFlag = false;
  appointeeObj: any;



  @ViewChild('selectWindow') selectWindow: NgcWindowComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  @ViewChild('reportWindow3') reportWindow3: NgcReportComponent;
  @ViewChild('reportWindow4') reportWindow4: NgcReportComponent;
  @ViewChild('reportWindow5') reportWindow5: NgcReportComponent;
  @ViewChild('reportWindow6') reportWindow6: NgcReportComponent;
  @ViewChild('reportWindow7') reportWindow7: NgcReportComponent;
  @ViewChild('reportWindow8') reportWindow8: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private adminService: AdminService, private router: Router) {
    super(appZone, appElement, appContainerElement);
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      };
    });
  }

  public customerlistform: NgcFormGroup = new NgcFormGroup
    ({
      withaddress: new NgcFormControl(),
      withoutaddress: new NgcFormControl(),
      appointee: new NgcFormControl(),
      appointeeCode: new NgcFormControl(),
      appointeeName: new NgcFormControl(),
      appointedAgentName: new NgcFormControl(),
      appointedAgentCode: new NgcFormControl(),
      reason: new NgcFormControl(),
      customerDetails: new NgcFormArray([
        new NgcFormGroup({
          customerId: new NgcFormControl(),
          customerCode: new NgcFormControl(),
          customerName: new NgcFormControl(),
          uenNumber: new NgcFormControl(),
          effectiveDate: new NgcFormControl(),
          expiryDate: new NgcFormControl(),
          lastShipmentAssignment: new NgcFormControl(),
          modifiedOn: new NgcFormControl()
        })
      ]),
      customerTransferDetails: new NgcFormArray([
        new NgcFormGroup({
          By: new NgcFormControl(),
          customerId: new NgcFormControl(),
          customerCode: new NgcFormControl(),
          customerName: new NgcFormControl(),
          appointedAgentCode: new NgcFormControl()
        })
      ])
    });

  ngOnInit() {
    super.ngOnInit();
    this.customerlistform.get('appointee').setValue(this.appointeeCod);


  }

  displayAppointee(item) {
    if (item.code == 'ALLAPPINTEDAGENT' || item.code == 'ALLAUTHCONTRACTOR') {
      this.onClear();
      this.appointedAgentFlag = false;
      this.contractorCodeFlag = false;
      this.searchButtonFlag = false;
      this.showButtons = true;
      this.showButtonsExportToExcel = true;
    } else if (item.code == 'Appointed Agent') {
      this.appointedAgentFlag = true;
      this.contractorCodeFlag = false;
      this.searchButtonFlag = true;
      this.appointeeCod = item;
      this.pageMode = item;
      this.onClear();
    } else {
      this.appointedAgentFlag = false;
      this.contractorCodeFlag = true;
      this.searchButtonFlag = true;
      this.appointeeCod = item;
      this.pageMode = item;
      this.onClear();
    }
  }


  onCompanyLOVSelect(object) {
    this.customerlistform.get('appointeeName').setValue(object.desc);
    this.customerlistform.get('appointeeCode').setValue(object.code);
  }

  onCompanyNameLOVSelect(object) {
    this.customerlistform.get('appointeeCode').setValue(object.code);
    this.customerlistform.get('appointeeName').setValue(object.desc);
  }

  onContractCodeLOVSelect(object) {
    this.customerlistform.get('appointeeName').setValue(object.desc);

  }

  onContractNameLOVSelect(object) {
    this.customerlistform.get('appointeeCode').setValue(object.code);
  }


  getCustomerList() {
    this.search = new SearchCustomerList();
    this.appointeeObj = this.customerlistform.get('appointee').value;
    this.search.appointee = this.customerlistform.get('appointee').value;
    this.search.customerCode = this.customerlistform.get('appointeeCode').value;
    this.search.appointedAgentName = this.customerlistform.get('appointeeName').value;
    this.search.customerName = '';
    this.adminService.getCustomerList(this.search)
      .subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.response = data.data;
          if (this.response) {
            this.show = true;
            this.showButtons = true;
            this.showButtonsExportToExcel = true;
            this.response.forEach(cust => {
              cust['lastShipmentAssignment'] = NgcUtility.toDateFromLocalDate(cust.lastShipmentAssignment);
              cust['effectiveDate'] = NgcUtility.toDateFromLocalDate(cust.effectiveDate);
              cust['expiryDate'] = NgcUtility.toDateFromLocalDate(cust.expiryDate);
              cust['modifiedOn'] = NgcUtility.toDateFromLocalDate(cust.modifiedOn);
            });
            (<NgcFormArray>this.customerlistform.controls['customerDetails'])
              .patchValue(this.response);
          } else {
            this.showErrorStatus(data.messageList[0].message);
          }
        } else {
          this.show = false;
          this.showButtons = false;
          this.showButtonsExportToExcel = false;
        }
      }, error => {
        this.show = false;
        this.showButtons = false;
        this.showErrorStatus(error);
      });
  }

  onSelect(getCustomer) {
    this.customerlistform.get('appointedAgentName').patchValue(getCustomer.desc);
  }

  onTransferWindow() {
    this.move = new Array;
    this.customerlistform.getRawValue().customerDetails.forEach(ele => {
      this.move.push(ele);
    });
    if (this.move.length) {
      this.windowOpen();
    }
  }

  private onEditClick(event) {
    const record = event.record;
    this.adminService.dataFromCustomerListToCustomermaster = record;

    let dataToSend = {
      "companyCode": record.customerCode,
      "companyName": record.customerName,
      "previousUrl": this.currentUrl
    }


    if (this.pageMode == "CNT") {
      this.navigateTo(this.router, 'admin/authorizedpersonnel', dataToSend);
    }

    if (this.pageMode == "Appointed Agent") {
      this.navigateTo(this.router, 'admin/maintaincustomer', dataToSend);
    }
  }
  windowOpen() {
    this.showTransferTable = false;
    this.customerlistform.get('appointedAgentCode').reset();
    this.customerlistform.get('appointedAgentName').reset();
    this.customerlistform.get('customerTransferDetails').reset();
    this.transferWindow.open();
  }

  getTransferCustomerList() {
    if (!this.customerlistform.valid) {
      this.showErrorStatus('admin.enter.valid.agent.code');
      return;
    }
    this.searchTtransfer = new SearchCustomerList();
    this.formValue = this.customerlistform;
    this.searchTtransfer.appointee = 'Appointed Agent';
    this.searchTtransfer.customerCode = this.formValue.get('appointeeCode').value;
    this.searchTtransfer.customerName = '';
    this.searchTtransfer.appointedAgentCode = this.formValue.get('appointedAgentCode').value;
    this.searchTtransfer.appointedAgentName = '';
    this.adminService.getTransferList(this.searchTtransfer)
      .subscribe(data => {
        const response = data.data;
        if (response) {
          this.customerlistform.get('reason').reset();
          this.transferResponse = data.data;
          if (this.transferResponse) {
            if (this.transferResponse.length) {
              this.showTransferTable = true;
              this.transferResponse.forEach(e => {
                e['By'] = false;
                e['createdBy'] = 'SYSADMIN';
                e['createdOn'] = this.date;
              });
              this.customerList = new Array;
              if (this.move.length) {
                this.transferResponse.forEach(e => {
                  this.move.forEach(ele => {
                    if (e.customerCode === ele.customerCode && e.appointee === ele.delegationAgreementType) {
                      this.customerList.push(e);
                    }
                  });
                });
              }


              if (this.customerList.length) {
                (<NgcFormArray>this.customerlistform.controls['customerTransferDetails'])
                  .patchValue(this.customerList);
              } else {
                this.showTransferTable = false;
                this.showErrorStatus('no.record');
              }
            } else {
              this.showTransferTable = false;
              this.showErrorStatus('no.record');
            }
          } else {
            this.showTransferTable = false;
            this.showErrorStatus('CHOOSEAGT');
          }
        } else {
          this.showErrorStatus(data.messageList[0].message);
        }
      }, error => {
        this.showTransferTable = false;
        this.showErrorStatus('g.server.down');
      });
  }

  onTransfer() {
    const transferArray: any = new Array();
    this.customerlistform.getRawValue().customerTransferDetails.forEach(transf => {
      if (transf['By'] === true) {
        transf['reason'] = this.customerlistform.get('reason').value;
        transferArray.push(transf);
      }
    });
    if (transferArray.length) {
      if (this.customerlistform.get('reason').value) {
        this.transferWindow.close();
        this.showConfirmMessage('admin.are.you.sure.to.transfer.selected.customers').then(status => {
          this.adminService.transferAgent(transferArray)
            .subscribe(customer => {
              this.getCustomerList();
            }, error => {
            });
        }).catch(reason => {
          this.transferWindow.open();
        });
      } else {
        this.showInfoStatus('info.3');
      }
    } else {
      this.showErrorStatus('SELTRANSFER');
    }
  }

  onCodeChange() {
    this.showTransferTable = false;
  }

  public onClear() {
    this.showButtons = false;
    this.show = false;
    this.resetFormMessages();
    this.customerlistform.get('appointeeCode').reset();
    this.customerlistform.get('appointeeName').reset();
    this.customerlistform.get('customerDetails').reset();
    this.customerlistform.get('customerTransferDetails').reset();
  }

  onNavigateWithInfo() {
    this.move = new Array;
    this.customerlistform.get('customerDetails').value.forEach(ele => {
      if (ele['By']) {
        this.move.push(ele);
      }
    });
    if (this.move.length === 1) {
      this.navigateTo(this.router, '/admin/maintaincustomer', this.move);
    } else if (this.move.length === 0) {
      this.showErrorStatus('admin.select.customer');
    } else {
      this.showErrorStatus('admin.select.one.customer');
    }
  }

  private oncreatereport(event) {
    this.selectWindow.open();
  }

  onServiceReport() {
    let agent = this.customerlistform.get('appointee').value;
    if (agent === 'Appointed Agent' && this.customerlistform.get('withaddress').value) {
      this.onagentwithaddressServiceReport();
    }
    else if (agent === 'Appointed Agent' && this.customerlistform.get('withoutaddress').value) {
      this.onagentwithoutaddressServiceReport();
    }
    else if (agent === 'CNT' && this.customerlistform.get('withaddress').value) {
      this.oncontractorwithaddressServiceReport();
    }
    else if (agent === 'CNT' && this.customerlistform.get('withoutaddress').value) {
      this.oncontractorwithoutaddressServiceReport();
    } else if (agent === 'ALLAPPINTEDAGENT') {
      this.onAllAppointedAgents();

    } else if (agent === 'ALLAUTHCONTRACTOR') {
      this.onAllAppointedContrctors();

    }

  }


  onagentwithaddressServiceReport() {
    this.selectWindow.close();
    this.reportParameters = new Object();
    this.reportParameters.agentcode = this.customerlistform.get('appointeeCode').value;
    this.reportParameters.agentname = this.search.appointedAgentName;
    this.reportWindow1.downloadReport();
  }
  onagentwithoutaddressServiceReport() {
    this.selectWindow.close();
    this.reportParameters = new Object();
    this.reportParameters.agentcode = this.customerlistform.get('appointeeCode').value;
    this.reportParameters.agentname = this.search.appointedAgentName;
    this.reportWindow2.downloadReport();
  }
  oncontractorwithaddressServiceReport() {
    this.selectWindow.close();
    this.reportParameters = new Object();
    this.reportParameters.contractorcode = this.customerlistform.get('appointeeCode').value;
    this.reportParameters.contractorname = this.search.appointedAgentName;
    this.reportWindow3.downloadReport();
  }
  oncontractorwithoutaddressServiceReport() {
    this.selectWindow.close();
    this.reportParameters = new Object();
    this.reportParameters.contractorcode = this.customerlistform.get('appointeeCode').value;
    this.reportParameters.contractorname = this.search.appointedAgentName;
    this.reportWindow4.downloadReport();
  }
  onAllAppointedAgents() {
    this.selectWindow.close();
    this.reportParameters = new Object();
    this.reportParameters.loginUser = this.getUserProfile().userLoginCode;
    if (this.customerlistform.get('withoutaddress').value) {
      this.reportWindow6.downloadReport();
    } else {
      this.reportWindow5.downloadReport();
    }

  }
  onAllAppointedContrctors() {
    this.selectWindow.close();
    this.reportParameters = new Object();
    this.reportParameters.loginUser = this.getUserProfile().userLoginCode;
    if (this.customerlistform.get('withoutaddress').value) {
      this.reportWindow8.downloadReport();
    } else {
      this.reportWindow7.downloadReport();
    }

  }
}
