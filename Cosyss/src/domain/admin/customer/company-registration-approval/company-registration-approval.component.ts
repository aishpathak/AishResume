import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, ContentChildren, forwardRef, ViewChild, OnInit
} from '@angular/core';

import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, BaseResponse, NgcWindowComponent,
  NgcUtility, NgcTabsComponent, NgcButtonComponent, PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControlName } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { RegistrationRequest, RegistrationRequestListResponse } from '../../admin.sharedmodel';
import { maintainFlightScheduleRQ } from '../../../flight/flight.sharedmodel';

@Component({
  selector: 'app-company-registration-approval',
  templateUrl: './company-registration-approval.component.html',
  styleUrls: ['./company-registration-approval.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
  //autoBackNavigation: true
})
export class CompanyRegistrationApprovalComponent extends NgcPage implements OnInit {


  response: any;
  rejected: boolean = false;
  Pending: boolean = false;
  Approved: boolean = false;
  responseArray: any = [];
  AdminAuthoriZationFlag: any = [];
  code: string;
  customerId: any;
  hasReadPermission: boolean = false;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindowRejection') reportWindowRejection: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private adminService: AdminService
    , private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }
  reportParameters: any = new Object();

  private fetchedRegistrationRequest: NgcFormGroup = new NgcFormGroup({
    customerCode: new NgcFormControl(),
    companyName: new NgcFormControl(),
    formallyKnownAs: new NgcFormControl(),
    customerCode1: new NgcFormControl(),
    customerCode2: new NgcFormControl(),
    uenNumber: new NgcFormControl(),
    importAuthorizationFlagValue: new NgcFormControl('NO'),
    iaexpiryDate: new NgcFormControl(),
    correspondenceAddress1: new NgcFormControl(),
    correspondenceAddress2: new NgcFormControl(),
    correspondenceCountryCode: new NgcFormControl(),
    correspondenceCityCode: new NgcFormControl(),
    correspondenceStateCode: new NgcFormControl(),
    correspondencePlace: new NgcFormControl(),
    correspondencePostalCode: new NgcFormControl(),
    correspondenceTelephoneNo: new NgcFormControl(),
    correspondenceFaxNo: new NgcFormControl(),
    billingAddress1: new NgcFormControl(),
    billingAddress2: new NgcFormControl(),
    billingCountryCode: new NgcFormControl(),
    billingCityCode: new NgcFormControl(),
    billingStateCode: new NgcFormControl(),
    billingPlace: new NgcFormControl(),
    billingPostalCode: new NgcFormControl(),
    sameAsCustomerFlag: new NgcFormControl(),
    administratorName: new NgcFormControl(),
    designation: new NgcFormControl(),
    notificationEmailId: new NgcFormControl(),
    loginId: new NgcFormControl(),
    customerTypeList: new NgcFormControl(),
    customerID: new NgcFormControl(),
    roleCode: new NgcFormControl(),
    roleDesc: new NgcFormControl(),
    reasonForRejection: new NgcFormControl(),
    customerCodeFinal: new NgcFormControl(),
    existingCustomerFlag: new NgcFormControl(),
    requestStatus: new NgcFormControl(),
    applicationDateFrom: new NgcFormControl(),
    applicationDateTo: new NgcFormControl(),
    electronicInvoice: new NgcFormControl(),
    administrativeOfficePlace: new NgcFormControl(),
    administrativeOfficeStateCode: new NgcFormControl(),
    administrativeOfficePostalCode: new NgcFormControl(),
    administrativeOfficeCityCode: new NgcFormControl(),
    administrativeOfficeCountryCode: new NgcFormControl(),
    administrativeOfficeAddress: new NgcFormControl(),
    administrativeOfficeTelephoneNo: new NgcFormControl(),
    administrativeOfficeFaxNo: new NgcFormControl()
  });

  ngOnInit() {
    super.ngOnInit();
    // getting the forwarded data
    let forwardedData = this.getNavigateData(this.activatedRoute);
    this.AdminAuthoriZationFlag = [{ "code": "YES", "desc": "YES" }, { "code": "NO", "desc": "NO" }];
    // checking if the fetched data is not null
    if (forwardedData != null) {
      this.setFetchedData(forwardedData);

    }
    this.hasReadPermission = NgcUtility.hasReadPermission('COMPANY_REG_APPROVAL');
    // this.fetchedRegistrationRequest.controls.sameAsCustomerFlag.valueChanges.subscribe(data => {
    //   this.copyAddressDetailsCorrespondence(data);
    // });
  }
  // onselectCustomerType(event){
  //   this.responseArray = event;
  //   if(this.fetchedRegistrationRequest.get('customerCode').value!==null){
  //     this.code=this.fetchedRegistrationRequest.get('customerCode').value;
  //   }

  //   if(this.fetchedRegistrationRequest.get('customerCode').value===null){
  //     this.code = this.responseArray[0].code;
  //   }else{

  //     for (let eachRow of event) {
  //           if(eachRow.desc!=='Agent' && eachRow.desc!=='Airline'){
  //             this.code = this.code +','+ eachRow.code;
  //           }

  //           }
  //   }
  //    this.fetchedRegistrationRequest.get('customerCodeFinal').patchValue(this.code);
  // }
  /**
    * Called when the data is forwarded from enquie shipment screen
    * This patches the forwarded data with checkin-shipment.
    * @param forwardedData
    * @returns void
    */
  private setFetchedData(forwardedData: any): void {
    const modelData: RegistrationRequestListResponse = new RegistrationRequestListResponse();
    // patching the forwarded data with fetchedRegistrationRequest form
    modelData.customerCode = forwardedData.customerCode;
    modelData.customerID = forwardedData.customerID;
    modelData.customerCodeFinal = forwardedData.customerCode;
    modelData.customerName = forwardedData.customerName;
    modelData.formallyKnownAs = forwardedData.formallyKnownAs;
    modelData.customerCodeChoice1 = forwardedData.customerCodeChoice1;
    modelData.customerCodeChoice2 = forwardedData.customerCodeChoice2;
    modelData.uenNumber = forwardedData.uenNumber;
    modelData.importAuthorizationFlagValue = forwardedData.importAuthorizationFlagValue;
    modelData.iaexpiryDate = forwardedData.iaexpiryDate;
    modelData.iataAgentCode = forwardedData.iataAgentCode;
    modelData.correspondenceAddress1 = forwardedData.correspondenceAddress1;
    modelData.correspondenceAddress2 = forwardedData.correspondenceAddress2;
    modelData.correspondenceCountryCode = forwardedData.correspondenceCountryCode;
    modelData.correspondenceCityCode = forwardedData.correspondenceCityCode;
    modelData.correspondenceStateCode = forwardedData.correspondenceStateCode;
    modelData.correspondencePlace = forwardedData.correspondencePlace;
    modelData.correspondencePostalCode = forwardedData.correspondencePostalCode;
    modelData.correspondenceTelephoneNo = forwardedData.correspondenceTelephoneNo;
    modelData.correspondenceFaxNo = forwardedData.correspondenceFaxNo;
    modelData.billingAddress1 = forwardedData.billingAddress1;
    modelData.billingAddress2 = forwardedData.billingAddress2;
    modelData.billingCountryCode = forwardedData.billingCountryCode;
    modelData.billingCityCode = forwardedData.billingCityCode;
    modelData.billingStateCode = forwardedData.billingStateCode;
    modelData.billingPlace = forwardedData.billingPlace;
    modelData.billingPostalCode = forwardedData.billingPostalCode;
    modelData.sameAsCustomerFlag = forwardedData.sameAsCustomerFlag;
    modelData.administratorName = forwardedData.administratorName;
    modelData.designation = forwardedData.designation;
    modelData.roleCode = forwardedData.roleCode;
    modelData.roleDesc = forwardedData.roleDesc;
    this.customerId = forwardedData.customerId;
    modelData.applicationReferenceNo = forwardedData.applicationReferenceNo;
    modelData.requestStatus = forwardedData.requestStatus;
    modelData.applicationDateFrom = forwardedData.applicationDateFrom;
    modelData.applicationDateTo = forwardedData.applicationDateTo;
    modelData.electronicInvoice = forwardedData.electronicInvoice;
    modelData.administrativeOfficeAddress = forwardedData.administrativeOfficeAddress;
    modelData.administrativeOfficePlace = forwardedData.administrativeOfficePlace;
    modelData.administrativeOfficePostalCode = forwardedData.administrativeOfficePostalCode;
    modelData.administrativeOfficeCityCode = forwardedData.administrativeOfficeCityCode;
    modelData.administrativeOfficeCountryCode = forwardedData.administrativeOfficeCountryCode;
    modelData.administrativeOfficeStateCode = forwardedData.administrativeOfficeStateCode;
    modelData.administrativeOfficeTelephoneNo = forwardedData.administrativeOfficeTelephoneNo;
    modelData.administrativeOfficeFaxNo = forwardedData.administrativeOfficeFaxNo;


    modelData.notificationEmailId = forwardedData.notificationEmailId;
    if (forwardedData.existingCustomerFlag === true || forwardedData.existingCustomerFlag === 'true') {
      modelData.existingCustomerFlag = true;
    } else {
      modelData.existingCustomerFlag = false;
    }

    modelData.customerTypeList = forwardedData.customerTypeList;
    modelData.companyRegistrationRequestID = forwardedData.companyRegistrationRequestID;
    modelData.reasonForRejection = forwardedData.reasonForRejection;
    modelData.loginId = forwardedData.loginId;
    modelData.customerTypeListApproved = forwardedData.customerTypeListApproved;
    this.rejected = forwardedData.rejected;
    this.Pending = forwardedData.Pending;
    this.Approved = forwardedData.Approved;
    this.fetchedRegistrationRequest.patchValue(modelData);

  }

  /**
    * This method is called on approval of registration request.
    *
    */
  onApprove() {
    this.fetchedRegistrationRequest.validate();
    if (!this.fetchedRegistrationRequest.valid) {
      return;
    }

    let request = this.fetchedRegistrationRequest.getRawValue();
    console.log("data" + JSON.stringify(request));
    request.deregistered = 0;
    request.customerId = this.customerId;
    console.log(request);
    this.adminService.approveRequestSave(request).subscribe(response => {
      console.log(request);

      if (!response.messageList.length) {
        this.resetFormMessages();
        this.showSuccessStatus("g.approved.successfully");
        this.fetchedRegistrationRequest.controls.customerTypeListApproved.patchValue(
          (response as any).customerTypeListApproved);
        this.fetchedRegistrationRequest.controls.customerCodeFinal.patchValue(
          (response as any).customerCodeFinal);
        this.fetchedRegistrationRequest.controls.customerCode.patchValue(
          (response as any).customerCodeFinal);
        this.Approved = true;
        this.Pending = false;

        //this.navigateTo(this.router, '/admin/companyregistration', data);
        return;
      }

      if (response.messageList !== undefined && response.messageList !== null && response.messageList[0].message === 'Customer Deregistered') {

        this.showConfirmMessage('admin.company.code.deregistered.reuse.code.confirmation').then(fulfilled => {

          request.deregistered = 1;
          this.adminService.approveRequestSave(request).subscribe(response => {
            if (response.messageList.length) {
              this.refreshFormMessages(response);
            } else {
              this.resetFormMessages();
              this.showSuccessStatus("g.approved.successfully");
              this.fetchedRegistrationRequest.controls.customerTypeListApproved.patchValue(
                (response as any).customerTypeListApproved);
              this.fetchedRegistrationRequest.controls.customerCodeFinal.patchValue(
                (response as any).customerCodeFinal);
              this.fetchedRegistrationRequest.controls.customerCode.patchValue(
                (response as any).customerCodeFinal);
              // this.navigateTo(this.router, '/admin/companyregistration', data);

              this.Approved = true;
              this.Pending = false;
              return;
            }
          });
        });
      } else if (response.messageList.length) {
        this.refreshFormMessages(response);
      }
    });
  }

  onApprovePrint($event) {
    this.onGenerateReport();
  }
  onGenerateReport() {
    this.reportParameters.applicationReferenceNo = this.fetchedRegistrationRequest.get('applicationReferenceNo').value;

    this.reportParameters.customerType = this.fetchedRegistrationRequest.get('customerTypeListApproved').value.join();
    this.reportWindow.open();
  }

  onRejectionPrint($event) {
    this.onGenerateReportRejection();
  }

  onGenerateReportRejection() {
    this.reportParameters.applicationReferenceNo = this.fetchedRegistrationRequest.get('applicationReferenceNo').value;
    this.reportWindowRejection.open();
  }

  onCompanyLOVSelect(object) {

    // this.addCustomerForm.get('customerCode').setValue(object.code);
    this.fetchedRegistrationRequest.get('roleDesc').setValue(object.desc);
  }


  onselectbillingCity(event) {
    this.fetchedRegistrationRequest.get('billingCountryCode').setValue(event.parameter1);
  }
  onselectCity(event) {
    this.fetchedRegistrationRequest.get('correspondenceCountryCode').setValue(event.parameter1);
  }
  /**
    * This method is called on Rejection of registration request.
    *
    */
  onRejectRequest(event) {
    if (this.fetchedRegistrationRequest.get('existingCustomerFlag').value == true) {
      if (this.fetchedRegistrationRequest.get('customerCodeFinal').value != null && this.fetchedRegistrationRequest.get('customerCodeFinal').value) {
        this.fetchedRegistrationRequest.get('customerCodeFinal').setValue(null);
      }
    }
    if (this.fetchedRegistrationRequest.get('customerTypeList').value != null && this.fetchedRegistrationRequest.get('customerTypeList').value) {
      this.fetchedRegistrationRequest.get('customerTypeList').setValue(null);
    }
    if (!this.fetchedRegistrationRequest.get('reasonForRejection').value) {
      return this.showErrorMessage("admin.provide.reason.reject");
    }
    this.adminService.rejectRequestStatus(this.fetchedRegistrationRequest.getRawValue()).subscribe(data => {

      this.refreshFormMessages(data);
      this.response = data;
      if (this.response.data > 0) {
        this.showSuccessStatus("g.rejected.successfully");
        this.rejected = true;
        this.Pending = false;
        //this.navigateTo(this.router, '/admin/companyregistration', this.response);
      } else {
        this.showSuccessStatus("g.rejected.successfully");
        this.rejected = true;
        this.Pending = false;
        //this.navigateTo(this.router, '/admin/companyregistration', this.response);
      }
    });
  }

  onCancel(event) {

    let RegustrationData = this.fetchedRegistrationRequest.getRawValue();
    console.log("RegustrationData", RegustrationData);
    var dataToSend = {
      requestStatus: RegustrationData.requestStatus,
      applicationDateFrom: RegustrationData.applicationDateFrom,
      applicationDateTo: RegustrationData.applicationDateTo
    }
    console.log("data", dataToSend);
    this.navigateTo(this.router, '/admin/companyregistration', dataToSend);

  }

}



