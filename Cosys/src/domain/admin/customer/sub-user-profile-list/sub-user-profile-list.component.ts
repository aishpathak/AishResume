import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, ContentChildren, forwardRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroupDirective, FormArray, FormGroup, FormControl, FormControlName, Validators
} from '@angular/forms';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, BaseResponse, NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcTabsComponent,
  PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import { AdminService } from '../../admin.service';
import { Environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sub-user-profile-list',
  templateUrl: './sub-user-profile-list.component.html',
  styleUrls: ['./sub-user-profile-list.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class SubUserProfileListComponent extends NgcPage {
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  profileListFlag: boolean;
  arrayUser: any;
  resp: BaseResponse<any>;
  reportParameters: any;

  /**
  * Initialize
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private adminService: AdminService, private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }
  private form: NgcFormGroup = new NgcFormGroup({
    customerCode: new NgcFormControl(),
    customerShortName: new NgcFormControl(),
    customerId: new NgcFormControl(),
    uenNumber: new NgcFormControl(),
    iataAgentCode: new NgcFormControl(),
    adminLoginCode: new NgcFormControl(),
    profileListArray: new NgcFormArray([]),
  });

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    super.ngOnInit();
    this.profileListFlag = false;

    const forwardedData = this.getNavigateData(this.activatedRoute);
    console.log("data", forwardedData);
    if (forwardedData) {

      this.form.get('customerId').patchValue(forwardedData.customerId);
      this.form.get('customerCode').patchValue(forwardedData.companyCode);
      this.form.get('customerShortName').patchValue(forwardedData.companyName);
      this.form.get('uenNumber').patchValue(forwardedData.uenNumber);
      this.form.get('iataAgentCode').patchValue(forwardedData.iataAgentCode);
      this.form.get('adminLoginCode').patchValue(forwardedData.adminLoginCode);
      this.searchSubUserProfile(event);
    }

  }
  onCompanyLOVSelect(object) {

    this.form.get('customerShortName').setValue(object.desc);
  }

  onCompanyNameLOVSelect(object) {
    this.form.get('customerCode').setValue(object.code);
  }
  searchSubUserProfile(event) {
    this.profileListFlag = false;
    const request = this.form.getRawValue();
    if (!request.customerCode && !request.customerShortName) {
      this.showErrorStatus('admin.enter.customer');
      return;
    }
    this.adminService.getSubuserList(request).subscribe(data => {
      this.resp = data;
      this.arrayUser = this.resp.data;
      if (this.arrayUser) {
        (<Array<any>>this.arrayUser).forEach((user: any) => {
          user["userShortName"] = user.userShortName.toUpperCase();
          const functionGroup: Array<any> = user.functionGroup;
          if (functionGroup) {
            functionGroup.forEach((functionValue: any) => {
              functionValue.moduleCodeDescription = functionValue.moduleCodeDescription.toUpperCase();
              functionValue.screenDisplayFlag = functionValue.screenDisplayFlag === '1' ? true : false;
              functionValue.screenUpdateFlag = functionValue.screenUpdateFlag === '1' ? true : false;
            });
          }
        });
        this.profileListFlag = true;
        (<NgcFormArray>this.form.controls['profileListArray']).patchValue(this.arrayUser);
      } else {
        this.showErrorStatus('admin.no.data.display');
      }
    }
      , error => this.showErrorStatus('Error'));
  }



  public onBack(event) {
    const subUserProfileData = this.form.getRawValue();
    var dataToSend = {
      companyCode: this.form.get('customerCode').value,
      companyName: this.form.get('customerShortName').value
    }
    console.log("data", dataToSend);
    console.log("data1", this.form.get('customerCode').value);
    this.navigateTo(this.router, 'admin/maintaincustomer', dataToSend);

  }


  printsubuser(event) {
    this.reportParameters = new Object();
    this.reportParameters.customercode = this.form.get('customerCode').value
    this.reportParameters.customerName = this.form.get('customerShortName').value
    this.reportWindow.downloadReport();
  }

}
