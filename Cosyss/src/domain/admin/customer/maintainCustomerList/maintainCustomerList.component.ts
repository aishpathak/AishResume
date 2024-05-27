import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcInputComponent, NgcUtility,
  NgcWindowComponent, NgcContainerComponent, PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import {
  FormArray, FormControl, AbstractControl, Validator
} from '@angular/forms';
import { NgcFormControl, CellsRendererStyle } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { SearchCustomer, CustomerListDetail } from '../../admin.sharedmodel';
import { request } from 'http';
import { SearchAWB } from '../../../awbManagement/awbManagement.shared';
import { ApplicationEntities } from '../../../common/applicationentities';
import { ApplicationFeatures } from '../../../common/applicationfeatures';

@Component({
  selector: 'app-maintainCustomerList',
  templateUrl: './maintainCustomerList.component.html',
  styleUrls: ['./maintainCustomerList.component.scss']
})
@PageConfiguration({
  trackInit: true,
  //callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class MaintainCustomerListComponent extends NgcPage implements OnInit {

  isTableFlg = false;
  dataTable: Array<CustomerListDetail>;
  customerDetails: any;
  obj: any;
  resp: any;
  reportParameters: any;
  concateCustomerType: string;
  currentPageIndex = 0;
  currentPageIndexNew = 0;
  pageSize = 10;
  offsetValueonNext = 0;
  isButtonFlg = false;
  noOfRecords: any;
  maxDataCount: any;
  errorFlag: boolean = false;
  rowLimit: any;

  @ViewChild('selectWindow') selectWindow: NgcWindowComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('reportWindow2') reportWindow2: NgcReportComponent;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(appZone, appElement, appContainerElement);
  }
  private createReport: NgcFormGroup = new NgcFormGroup({
    contacttype: new NgcFormControl(),
    for: new NgcFormControl()
  });
  private maintainlistForm: NgcFormGroup = new NgcFormGroup({
    withaddress: new NgcFormControl(),
    withoutaddress: new NgcFormControl(),
    name: new NgcFormControl(),
    select: new NgcFormControl(),
    customerName: new NgcFormControl(),
    customerType: new NgcFormControl(),
    currentPageIndex: new NgcFormControl(),
    currentPageIndexNew: new NgcFormControl(),
    customerStatus: new NgcFormControl('Both'),
    activeFilter: new NgcFormControl(),
    iaHolderFilter: new NgcFormControl(),
    blackListFilter: new NgcFormControl(),
    displayDate: new NgcFormControl(),
    CustomerListDetails: new NgcFormArray([]),
    searchCustomerNameFrom: new NgcFormControl(),
    searchCustomerNameTo: new NgcFormControl()
  });

  ngOnInit() {
    super.ngOnInit();
    this.maintainlistForm.get('withaddress').setValue(true);
    this.maintainlistForm.get('withoutaddress').setValue(false);
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {
      this.onSearchAuto(forwardedData);
    }

    this.maintainlistForm.get('activeFilter').valueChanges.subscribe(changedValue => {
      if (!this.errorFlag)
        this.performFilter();
    });
    this.maintainlistForm.get('iaHolderFilter').valueChanges.subscribe(changedValue => {
      if (!this.errorFlag)
        this.performFilter();
    });
    this.maintainlistForm.get('blackListFilter').valueChanges.subscribe(changedValue => {
      if (!this.errorFlag)
        this.performFilter();
    });
    this.maintainlistForm.get("currentPageIndexNew").valueChanges.subscribe(changedValue => {
      this.onPageChange(changedValue);
    });
  }

  onSearchAuto(forwardedData) {
    const searchAuto = new SearchCustomer;
    this.maintainlistForm.get('customerType').setValue(forwardedData.customerType);
    this.maintainlistForm.get('customerStatus').setValue(forwardedData.customerStatus);
    this.maintainlistForm.get('activeFilter').setValue(forwardedData.activeFilter);
    this.maintainlistForm.get('iaHolderFilter').setValue(forwardedData.iaholder);
    this.maintainlistForm.get('blackListFilter').setValue(forwardedData.blacklisted);
    this.currentPageIndex = forwardedData.currentPageIndex;
    this.currentPageIndexNew = this.currentPageIndex + 1;

    this.onSearch(forwardedData.currentPageIndex);
  }

  /**
  * On Filtering of Customer details
  *  relatedShipments
  */
  private performFilter() {
    if (!this.customerDetails) {
      return;
    }
    this.onSearch(0);
  }

  /**
   * On Search of Function
   *
   * @param event Event
   */
  private onSearch(count) {
    this.resetFormMessages();
    let search = new SearchCustomer;
    search = this.maintainlistForm.getRawValue();
    search.currentPageIndexNo = count;

    if (!search.blackListFilter) {
      if (NgcUtility.getCustomPropertyBagValue(NgcUtility.getEntityAttribute("Customer.BlackListFlag"), "defaultBlackListFlag") != null) {
        search.blackListFilter = NgcUtility.getCustomPropertyBagValue(NgcUtility.getEntityAttribute("Customer.BlackListFlag"), "defaultBlackListFlag");
        this.maintainlistForm.get('blackListFilter').setValue(search.blackListFilter);
      }
    }

    this.adminService.fetchOnSearch(search).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (search.customerType === null || data.data === null) {
          this.isTableFlg = false;
        } else {
          this.isTableFlg = true;
          this.resp = data.data;
          this.customerDetails = this.resp;
          if (count == 0) {
            this.currentPageIndex = 0;
          }
          if (this.customerDetails.length) {
            this.noOfRecords = this.customerDetails[0].noOfRecords;
          } else {
            this.noOfRecords = 0;
          }
          if (this.noOfRecords >= (this.currentPageIndex * 10 + 1) && this.noOfRecords < (this.currentPageIndex * 10 + 10)) {
            this.maxDataCount = this.noOfRecords;
          } else if (this.noOfRecords == 0) {
            this.maxDataCount = this.noOfRecords;
          } else {
            this.maxDataCount = this.currentPageIndex * 10 + 10;
          }
          this.rowLimit = this.customerDetails[0].maxIndexValue;

          (<NgcFormArray>this.maintainlistForm.get(
            'CustomerListDetails'
          )).patchValue(this.customerDetails);
          this.changeDetectorRef.detectChanges();
        }
      } else {
        if (this.maintainlistForm.get('activeFilter').value != null) {
          this.errorFlag = true;
          this.maintainlistForm.get('activeFilter').patchValue(null);
        }
        if (this.maintainlistForm.get('iaHolderFilter').value != null) {
          this.errorFlag = true;
          this.maintainlistForm.get('iaHolderFilter').patchValue(null);
        }
        if (this.maintainlistForm.get('blackListFilter').value != null) {
          this.errorFlag = true;
          this.maintainlistForm.get('blackListFilter').patchValue(null);
        }
        this.errorFlag = false;
      }
      this.currentPageIndexNew = this.currentPageIndex + 1;
      this.maintainlistForm.get("currentPageIndexNew").patchValue(this.currentPageIndexNew, { onlySelf: true, emitEvent: false });
    },
      error => {
        this.showErrorStatus(error);
      });
  }

  private onClickNext() {
    if (this.currentPageIndex < this.customerDetails[0].maxIndexValue - 1) {
      let incrementedValue = ++this.currentPageIndex;
      this.onSearch(incrementedValue);
    }
  }

  private onPageChange(event) {
    if (event <= 0 || !this.customerDetails) {
      return;
    }
    if (this.currentPageIndex > this.customerDetails[0].maxIndexValue - 1) {
      return;
    }
    if (this.currentPageIndex <= this.customerDetails[0].maxIndexValue) {
      let incrementedValue = event;
      this.currentPageIndex = incrementedValue - 1;
      this.onSearch(this.currentPageIndex);
    }
  }


  private onClickPrev() {
    if (this.currentPageIndex > 0) {
      let decrementedValue = --this.currentPageIndex;
      this.onSearch(decrementedValue);
    }
  }
  /**
  * On Export Email
  *
  */
  private onExportEmail(event) {
    this.router.navigateByUrl('/admin/exportemail');
  }

  private onExportEmails(event) {
    const search = this.createReport.getRawValue();
    this.selectWindow.open();
  }

  private onEditClick(index) {
    const record = this.maintainlistForm.getRawValue().CustomerListDetails[index];
    this.adminService.dataFromCustomerListToCustomermaster = record;
    record.companyCode = record.customerCode;
    record.companyName = record.customerName;
    record.CustomerStatus = this.maintainlistForm.get('customerStatus').value;
    record.customerType = this.maintainlistForm.get('customerType').value
    record.blacklisted = this.maintainlistForm.get('blackListFilter').value;
    record.iaholder = this.maintainlistForm.get('iaHolderFilter').value;
    record.activeFilter = this.maintainlistForm.get('activeFilter').value;
    record.currentPageIndex = this.currentPageIndex;
    this.currentPageIndexNew = this.currentPageIndex + 1;
    this.navigateTo(this.router, 'admin/maintaincustomer', record);
  }

  public onBack(event) {
    this.navigateBack(this.maintainlistForm.getRawValue);
  }

  onServiceReport() {
    if (this.maintainlistForm.get('withaddress').value) {
      this.selectWindow.close();
      this.reportParameters = new Object();
      this.concateCustomerType = this.maintainlistForm.get('customerType').value.join(',');
      this.reportParameters.CustomerType = this.concateCustomerType;
      this.reportParameters.CustomerStatus = this.maintainlistForm.get('customerStatus').value;
      this.reportParameters.blacklisted = this.maintainlistForm.get('blackListFilter').value;
      this.reportParameters.iaholder = this.maintainlistForm.get('iaHolderFilter').value;
      this.reportParameters.activeFilter = this.maintainlistForm.get('activeFilter').value;
      this.reportParameters.reportTitle = this.getReportTitle(this.reportParameters.CustomerStatus);
      this.reportParameters.uenNumber = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_CustomerUniqueEntityNumber).displayName;
      this.reportParameters.isCustomerPaymentAccountEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_CustomerPaymentAccount);
      this.reportParameters.SearchCustomerNameFrom = this.maintainlistForm.get('searchCustomerNameFrom').value;
      this.reportParameters.SearchCustomerNameTo = this.maintainlistForm.get('searchCustomerNameTo').value
      this.reportParameters.isHaffaMemberEnabled = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_HaffaMember);
      this.reportParameters.isAISRSMemberEnabled = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_AISRSMember);
      this.reportParameters.isRACSFEnabled = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_RACSF);
      this.reportParameters.isConsigneeFlagEnabled = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_ConsigneeFlag);
      this.reportParameters.isAgentPortalAccessEnabled = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_AgentPortalAccess);
      this.reportParameters.isReturnAuthorisationNumberEnabled = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_ReturnAuthorisationNumber);
      this.reportParameters.panNumber = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_TaxAccountNumber).displayName;
      this.reportParameters.panNumberFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_TaxAccountNumber);
      this.reportParameters.isSalesTaxNumberEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_SalesTax);
      this.reportWindow1.reportParameters = this.reportParameters;
      this.reportWindow1.downloadReport();
    }
    else if (this.maintainlistForm.get('withoutaddress').value) {
      this.selectWindow.close();
      this.reportParameters = new Object();
      this.concateCustomerType = this.maintainlistForm.get('customerType').value.join(',');
      this.reportParameters.CustomerType = this.concateCustomerType;
      this.reportParameters.CustomerStatus = this.maintainlistForm.get('customerStatus').value;
      this.reportParameters.blacklisted = this.maintainlistForm.get('blackListFilter').value;
      this.reportParameters.iaholder = this.maintainlistForm.get('iaHolderFilter').value;
      this.reportParameters.activeFilter = this.maintainlistForm.get('activeFilter').value;
      this.reportParameters.reportTitle = this.getReportTitle(this.reportParameters.CustomerStatus);
      this.reportParameters.uenNumber = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_CustomerUniqueEntityNumber).displayName;
      this.reportParameters.isCustomerPaymentAccountEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_CustomerPaymentAccount);
      this.reportParameters.SearchCustomerNameFrom = this.maintainlistForm.get('searchCustomerNameFrom').value;
      this.reportParameters.SearchCustomerNameTo = this.maintainlistForm.get('searchCustomerNameTo').value
      this.reportParameters.isHaffaMemberEnabled = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_HaffaMember);
      this.reportParameters.isAISRSMemberEnabled = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_AISRSMember);
      this.reportParameters.isRACSFEnabled = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_RACSF);
      this.reportParameters.isConsigneeFlagEnabled = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_ConsigneeFlag);
      this.reportParameters.isAgentPortalAccessEnabled = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_AgentPortalAccess);
      this.reportParameters.isReturnAuthorisationNumberEnabled = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_ReturnAuthorisationNumber);
      this.reportParameters.panNumber = NgcUtility.getEntityAttribute(ApplicationEntities.Customer_TaxAccountNumber).displayName;
      this.reportParameters.panNumberFlag = NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Customer_TaxAccountNumber);
      this.reportParameters.isSalesTaxNumberEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Billing_SalesTax);
      this.reportWindow2.reportParameters = this.reportParameters;
      this.reportWindow2.downloadReport();
    }
  }

  public getReportTitle(customerStatus) {
    if (customerStatus == 'BothContractor') {
      return NgcUtility.translateMessage("report.title.customers.list.by.authorized.contractor", []);
    }
    if (customerStatus == 'Both') {
      return NgcUtility.translateMessage("report.title.customers.list.by.appointedagent", []);
    }
    if (customerStatus == 'With') {
      return NgcUtility.translateMessage("report.title.customers.list.by.appointedagent", []);
    }
    if (customerStatus == 'WithContractor') {
      return NgcUtility.translateMessage("report.title.customers.list.authorized.contractor", []);
    }
    if (customerStatus == 'Without') {
      return NgcUtility.translateMessage("report.title.customers.list", []);
    }
    if (customerStatus == 'WithOutContractor') {
      return NgcUtility.translateMessage("report.title.customers.list", []);
    }
  }

  public listRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    const customerRecord = this.maintainlistForm.getRawValue().CustomerListDetails[rowData['NGC_ROW_ID']];
    let data: string = '';
    if (customerRecord) {
      let list = customerRecord.agentCustomerRelatedAgents;
      if (list) {
        data = list.map(value => {
          return value.customerCode;
        }).join('</br>');
      }
    }
    cellsStyle.data = data;
    return cellsStyle;
  };



  public listContractorRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    const customerRecord = this.maintainlistForm.getRawValue().CustomerListDetails[rowData['NGC_ROW_ID']];
    let data: string = '';
    if (customerRecord) {
      let list = customerRecord.contractorRelatedToCustomer;
      if (list) {
        data = list.map(value => {
          return value.customerCode;
        }).join('</br>');
      }
    }
    cellsStyle.data = data;
    return cellsStyle;
  };

  public onClear(event) {
    this.maintainlistForm.get('customerType').setValue(null);
    this.maintainlistForm.get('customerStatus').setValue('Both');
    this.maintainlistForm.get('activeFilter').setValue(null);
    this.maintainlistForm.get('iaHolderFilter').setValue(null);
    this.maintainlistForm.get('blackListFilter').setValue(null);
    this.maintainlistForm.get('searchCustomerNameFrom').setValue(null);
    this.maintainlistForm.get('searchCustomerNameTo').setValue(null);
    this.isTableFlg = false;
  }
  //Bug 20416 - Routing to customer billing setup
  public customerBillingSetup(index) {
    var dataToSend = {
      companyCode: this.maintainlistForm.get(['CustomerListDetails', index, 'customerCode']).value,
      companyName: this.maintainlistForm.get(['CustomerListDetails', index, 'customerName']).value,
      customerId: this.maintainlistForm.get(['CustomerListDetails', index, 'customerId']).value

    }
    this.navigateTo(this.router, '/billing/billingSetup/customerbillingsetup', dataToSend);
  }
}
