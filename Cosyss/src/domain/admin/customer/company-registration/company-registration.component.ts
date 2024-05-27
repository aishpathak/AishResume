import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, ContentChildren, forwardRef, ViewChild, OnInit
} from '@angular/core';

import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, BaseResponse, NgcWindowComponent,
  NgcUtility, NgcTabsComponent, NgcButtonComponent, PageConfiguration, CellsRendererStyle, DateTimeKey
} from 'ngc-framework';
import { Router, ActivatedRoute } from '@angular/router';

import { FormControlName, Validators } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { RegistrationRequest, RegistrationRequestListResponse } from '../../admin.sharedmodel';



@Component({
  selector: 'app-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class CompanyRegistrationComponent extends NgcPage implements OnInit {
  @ViewChild('searchbutton') searchbutton: NgcButtonComponent;
  /**
* This flag is used for displaying of table when the criteria is right
*/
  isTableFlg: boolean;
  arrayList: any[];
  resp: any;
  record: any;
  daysDiff: Number;



  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private adminService: AdminService
    , private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  private RegistrationRequestForm: NgcFormGroup = new NgcFormGroup({
    requestStatus: new NgcFormControl(),
    applicationReferenceNo: new NgcFormControl(),
    applicationDateFrom: new NgcFormControl(),
    applicationDateTo: new NgcFormControl(),
    iataAgentCode: new NgcFormControl()
  });

  private RegistrationRequestList: NgcFormGroup = new NgcFormGroup({
    RegistrationRequestArray: new NgcFormArray([])
  });

  /**
   *
   *
   * @param {any} event
   * @memberof CompanyRegistrationComponent
   */
  clear(event): void {
    this.RegistrationRequestForm.reset();
    this.resetFormMessages();
  }

  /**
   *
   *This method is called on search and return registration request list.
   * @memberof CompanyRegistrationComponent
   */
  onSearch() {
    this.RegistrationRequestForm.validate();
    if (this.RegistrationRequestForm.invalid) {
      this.showErrorStatus('g.fill.all.details');
      return;
    }

    const request = this.RegistrationRequestForm.getRawValue();
    {

      var dif = NgcUtility.dateDifference(this.RegistrationRequestForm.get('applicationDateTo').value, this.RegistrationRequestForm.get('applicationDateFrom').value);
      this.daysDiff = dif / (1000 * 60 * 60 * 24);
      console.log("diff" + this.daysDiff);
      if (this.daysDiff > 90) {
        this.showErrorStatus('g.date.range.validation');
        return;
      }

      this.adminService.fetchRegistrationRequestList(request).subscribe(data => {

        this.refreshFormMessages(data);
        this.resp = data;
        this.arrayList = this.resp.data;
        console.log(this.arrayList);
        if (this.arrayList != null) {
          this.formatDate();
          this.arrayList = this.arrayList.map(element => {
            element.commaseperated = element.customerTypeListApproved.join(',');
            return element;
          })
          this.RegistrationRequestList.controls['RegistrationRequestArray'].patchValue(this.arrayList);
          this.isTableFlg = true;
        }
        else {
          this.isTableFlg = false;
          this.refreshFormMessages(data)
        }
      },
        error => {
          this.showErrorStatus('Error:' + error);
        });
    }
  }


  /**
   * This function is responsible for Date formating
   *
   * @memberof CompanyRegistrationComponent
   */
  formatDate() {
    let serialCounter = 1;
    for (let index = 0; index < this.arrayList.length; index++) {
      this.arrayList[index]['iaexpiryDate'] =
        NgcUtility.toDateFromLocalDate(this.arrayList[index]['iaexpiryDate']);

      this.arrayList[index]['requestProcessedDate'] =
        NgcUtility.toDateFromLocalDate(this.arrayList[index]['requestProcessedDate']);
      this.arrayList[index]['registrationDate'] =
        NgcUtility.toDateFromLocalDate(this.arrayList[index]['registrationDate']);
      this.arrayList[index]['serialNo'] = serialCounter++;
    }
  }

  /**
   * This function is responsible for navigating to  companyregistrationapproval with Forwarded data
   *
   * @param {any} event
   * @memberof CompanyRegistrationComponent
   */
  public onLinkClick(event) {
    console.log(event);
    if (event.type === 'link') {
      this.record = event.record;

      if (this.record.requestStatus == "Rejected") {
        this.record.rejected = true;
      }
      if (this.record.requestStatus == "Pending") {
        this.record.Pending = true;
      }
      if (this.record.requestStatus == "Approved") {
        this.record.Approved = true;
      }
      this.record.customerTypeList = this.arrayList[this.record.NGC_ROW_ID].customerTypeList;
      this.record.customerTypeListApproved = this.arrayList[this.record.NGC_ROW_ID].customerTypeListApproved;
      this.record.applicationDateFrom = this.RegistrationRequestForm.get('applicationDateFrom').value;
      this.record.applicationDateTo = this.RegistrationRequestForm.get('applicationDateTo').value;
      this.navigateTo(this.router, '/admin/companyregistrationapproval', this.record);
    }
  }



  ngOnInit() {
    super.ngOnInit();
    //this.isTableFlg = true;
    const forwardedData = this.getNavigateData(this.activatedRoute);
    console.log("data", forwardedData);
    if (forwardedData) {
      this.RegistrationRequestForm.get('requestStatus').patchValue(forwardedData.requestStatus);
      this.RegistrationRequestForm.get('applicationDateFrom').patchValue(forwardedData.applicationDateFrom);
      this.RegistrationRequestForm.get('applicationDateTo').patchValue(forwardedData.applicationDateTo);
      this.onSearch();

    }





    // if (forwardedData) {


    //   this.isTableFlg = true;

    //   this.onSearch();

    // }
    // if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Customer_RegistrationRequestFrom && ApplicationEntities.Customer_RegistrationRequestTo)) {
    //   (<NgcFormControl>this.RegistrationRequestForm.get('applicationDateFrom')).setValidators([Validators.required]);
    //   (<NgcFormControl>this.RegistrationRequestForm.get('applicationDateTo')).setValidators([Validators.required]);
    //   this.RegistrationRequestForm.controls.applicationReferenceNo.valueChanges.subscribe(data => {
    //     if (!data) {
    //       (<NgcFormControl>this.RegistrationRequestForm.get('applicationDateFrom')).setValidators([Validators.required]);
    //       (<NgcFormControl>this.RegistrationRequestForm.get('applicationDateTo')).setValidators([Validators.required]);
    //     } else {
    //       (<NgcFormControl>this.RegistrationRequestForm.get('applicationDateFrom')).setValidators([]);
    //       (<NgcFormControl>this.RegistrationRequestForm.get('applicationDateTo')).setValidators([]);
    //     }
    //   });
    // }


  }

  // ngAfterViewInit() {
  // //   super.ngAfterViewInit();
  //    this.onSearch();

  //  }

}

