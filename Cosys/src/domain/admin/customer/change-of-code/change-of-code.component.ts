import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, ContentChildren, forwardRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupDirective, FormArray, FormGroup, FormControl, FormControlName, Validators } from '@angular/forms';
// Application
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, BaseResponse, NgcWindowComponent,
  NgcUtility, NgcTabsComponent, PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import { AdminService } from '../../admin.service';
import { CustomerCode, ChangeOfCode } from '../../admin.sharedmodel';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
@Component({
  selector: 'app-change-of-code',
  templateUrl: './change-of-code.component.html',
  styleUrls: ['./change-of-code.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ChangeOfCodeComponent extends NgcPage implements OnInit {
  customerIdData: any;
  searchRequest: {
    customerCod: any;
  };
  requestData: any;

  /**
   * Initialize
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  constructor(
    appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private adminService: AdminService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }
  resp: any;
  arrayuser: any;
  displayData: boolean = false;
  shipmentList = [];
  isLoginId: boolean = true;
  isSearch: boolean = false;
  disablePDFFlag: boolean;
  disableFlag: boolean;
  deregisterFlag: boolean;
  showFlag = false;
  showFlag1 = false;
  @ViewChild('codeChangeAppointedAgentsWindow') codeChangeAppointedAgentsWindow: NgcWindowComponent;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  reportParameters: any = new Object();
  private searchForm: NgcFormGroup = new NgcFormGroup({
    customerCod: new NgcFormControl()
  });

  private saveForm: NgcFormGroup = new NgcFormGroup({
    customerCode: new NgcFormControl(),
    customerName: new NgcFormControl(),
    loginID: new NgcFormControl(),
    newCustomerCode: new NgcFormControl(),
    newCustomerName: new NgcFormControl(),
    newLoginID: new NgcFormControl(),
    agentCustomerRelatedAgents: new NgcFormArray([]),
    awbRelatedToCustomer: new NgcFormArray([]),
    relatedSubUsers: new NgcFormArray([]),
    reason: new NgcFormControl(),
    shipmentList: new NgcFormArray([
      // new NgcFormGroup({
      // shipmentID: new NgcFormControl()
      // })
    ])

  })
  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterContentInit();
    // const forwardedData = this.getNavigateData(this.activatedRoute);

    // if (forwardedData) {
    //   this.saveForm.get('customerCode').patchValue(forwardedData.customerCode);
    //   this.saveForm.get('customerName').patchValue(forwardedData.customerShortName);
    //   this.onSearch();
    // }
    if (this.adminService.dataFromCustomerMasterToChangeOfCode) {
      this.customerIdData = this.adminService.dataFromCustomerMasterToChangeOfCode.customerId
      this.searchRequest = {
        customerCod: this.adminService.dataFromCustomerMasterToChangeOfCode.customerCode
      }
      this.searchForm.get('customerCod').setValue(this.adminService.dataFromCustomerMasterToChangeOfCode.customerCode);
      this.onSearch();
    }
  }

  onSearch() {
    if (this.searchForm.valid) {
      const req: CustomerCode = new CustomerCode();
      req.customerCod = this.searchForm.get('customerCod').value;
      this.adminService.searchCode(req || this.searchRequest).subscribe(response => {
        this.refreshFormMessages(response);
        this.resp = response.data;
        console.log(this.resp);
        this.arrayuser = this.resp;
        if (this.resp.loginID == null) {
          this.isLoginId = false;
        }
        this.saveForm.reset();
        this.saveForm.patchValue(this.resp);
        // this.saveForm.controls.shipmentList.setValue(this.resp.shipmentTrack);
        this.shipmentList = this.resp.shipmentTrack;
        this.displayData = true;

      })
    }
  }

  onSave(event) {
    if (this.saveForm.valid) {
      const req: ChangeOfCode = new ChangeOfCode();
      req.customerCode = this.saveForm.get('customerCode').value;
      req.customerName = this.saveForm.get('customerName').value;
      req.loginID = this.saveForm.get('loginID').value;
      req.newCustomerCode = this.saveForm.get('newCustomerCode').value;
      req.newCustomerName = this.saveForm.get('newCustomerName').value;
      req.newLoginID = this.saveForm.get('newLoginID').value;
      req.reason = this.saveForm.get('reason').value;
      req.agentCustomerRelatedAgents = this.saveForm.getRawValue().agentCustomerRelatedAgents;
      req.awbRelatedToCustomer = this.saveForm.getRawValue().awbRelatedToCustomer;
      req.relatedSubUsers = this.saveForm.getRawValue().relatedSubUsers;
      req.deregister = 0;
      if (req.newCustomerName == null) {
        req.newCustomerName = req.customerName;
      }
      if (req.loginID == null) {
        req.newLoginID = req.newLoginID;
      }


     
      this.showConfirmMessage('admin.are.you.sure.to.save.changes').then(fulfilled => {
        this.adminService.saveCode(req).subscribe(data => {
          if (data.messageList !== null && data.messageList[0].message === 'Customer Deregistered') {
            this.showConfirmMessage('admin.company.code.deregistered.reuse.code.confirmation').then(fulfilled => {
              req.deregister = 1;
              
              this.adminService.saveCode(req).subscribe(data => {
                if (data.data != null) {
                  this.displayData = true;
                  this.showSuccessStatus('g.data.update.successful');
                  const changeOfCodeData = this.saveForm.getRawValue();
                  changeOfCodeData.customerId = this.customerIdData;
                  this.adminService.dataFromChangeOfCodeToCustomerMaster = changeOfCodeData;
                  this.codeChangeAppointedAgentsWindow.close();
                  this.router.navigate(['admin', 'maintaincustomer']);
                }
                else {
                  this.refreshFormMessages(data);
                }
                this.resp = data;
                this.shipmentList = this.resp.data;
              });
              // });  
            });
          }
          console.log(JSON.stringify(data.data))

          if (data.data != null) {
            this.displayData = true;
            this.showSuccessStatus('g.data.update.successful');
            const changeOfCodeData = this.saveForm.getRawValue();
            changeOfCodeData.customerId = this.customerIdData;
            this.adminService.dataFromChangeOfCodeToCustomerMaster = changeOfCodeData;
            this.codeChangeAppointedAgentsWindow.close();
            this.router.navigate(['admin', 'maintaincustomer']);

          }
          else {
            this.refreshFormMessages(data);
          }
          this.resp = data;
          this.shipmentList = this.resp.data;
        }
          , err => {
            this.showErrorStatus('g.something.wrong');
          });
      });
    }
  }

  public onBack(event) {
    this.navigateBack(this.saveForm.getRawValue());

  }

  openchangeCustomer(event) {
    let a = this.afterOpenDeRegisterCustomer();
    if (!a) {
      return;
    }
    this.codeChangeAppointedAgentsWindow.open();
    if (this.resp.agentCustomerRelatedAgents.length === 0 || this.resp.awbRelatedToCustomer.length1 === 0) {
      this.disablePDFFlag = true;
      this.disableFlag = false;
    } else {
      this.disablePDFFlag = true;
      this.disableFlag = false;
    }


    if (this.resp.awbRelatedToCustomer.length === 0) {
      this.showFlag = false;
    } else {
      this.showFlag = true;
    }

    if (this.resp.agentCustomerRelatedAgents.length === 0) {
      this.showFlag1 = false;
    } else {
      this.showFlag1 = true;
    }
  }
  onExportToPDFClick(event) {
    this.disableFlag = true;
    this.onGenerateReportCustomer();
  }

  onGenerateReportCustomer() {
    //this.codeChangeAppointedAgentsWindow.close();
    this.reportParameters.customerID = this.customerIdData;
    this.reportWindow.open();
  }


  afterOpenDeRegisterCustomer() {
    if (this.saveForm.get('customerName').value &&
      this.saveForm.get('customerCode').value) {
      let length = this.saveForm.getRawValue().agentCustomerRelatedAgents.length
      let length1 = this.saveForm.getRawValue().awbRelatedToCustomer.length
      if (!length && !length1) {

        this.onSave(event);
        return false;
      }
    }
    return true;
  }

}
