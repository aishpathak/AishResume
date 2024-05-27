import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcFormArray, NgcPage, PageConfiguration, NgcWindowComponent, NgcUtility, DateTimeKey } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { WaiveApprovalListForSearch } from '../billing.sharedmodel';
import { BillingService } from '../billing.service';
import { ActivatedRoute, Router } from "@angular/router";
import { AwbManagementService } from '../../awbManagement/awbManagement.service';
import { ApplicationEntities } from '../../common/applicationentities';
import { clear } from 'console';
import { clearLine } from 'readline';

@Component({
  selector: 'app-waiveapproval-list',
  templateUrl: './waiveapproval-list.component.html',
  styleUrls: ['./waiveapproval-list.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class WaiveapprovalListComponent extends NgcPage implements OnInit {

  @ViewChild('showPopUpWindow') showPopUpWindow: NgcWindowComponent;


  waiverApprovalForSearchRequest: WaiveApprovalListForSearch = new WaiveApprovalListForSearch();
  isWaiveApprovalList: boolean = false;
  waiverTobeApprovedOrRejected: any = [];
  responseList: any
  customerId: number;
  handledbyHouse: boolean = false;
  constructor(appZone: NgZone, appElement: ElementRef, private router: Router, private activated: ActivatedRoute,
    appContainerElement: ViewContainerRef, private billingService: BillingService, private awbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }

  waiveApprovalListForm: NgcFormGroup = new NgcFormGroup({
    searchWaiveApprovalListForm: new NgcFormGroup(
      {
        wavierRequestFromDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 30, DateTimeKey.DAYS),
          (0 * 60) + 0,
          DateTimeKey.MINUTES), Validators.required),
        wavierRequestToDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59,
          DateTimeKey.MINUTES), Validators.required),
        serviceNumber: new NgcFormControl(),
        awbNumber: new NgcFormControl(),
        customerName: new NgcFormControl(),
        status: new NgcFormControl('PENDING'),
        hawbNumber: new NgcFormControl(),
        shipmentHouseId: new NgcFormControl(),
        handledByDomIntl: new NgcFormControl()
      }
    ),
    waiverApproval: new NgcFormArray([])
  })

  private waiverRejectReturnForm: NgcFormGroup = new NgcFormGroup({
    waiverApproval: new NgcFormArray([]),
    waiverApprovalRejectReason: new NgcFormControl()

  })
  /**
   * method that
   * searches for waive approval list
   * based on search criteria
  */
  searchwaiveApprovalList() {
    this.isWaiveApprovalList = false;
    this.resetFormMessages();
    const searchWaiveApprovaLList: NgcFormGroup = (this.waiveApprovalListForm.get(['searchWaiveApprovalListForm']) as NgcFormGroup)
    // Validate Form
    searchWaiveApprovaLList.validate()
    //invalid return
    if (this.waiveApprovalListForm.get('searchWaiveApprovalListForm').invalid) {
      return;
    }
    this.waiverApprovalForSearchRequest = (this.waiveApprovalListForm.get(['searchWaiveApprovalListForm']) as NgcFormGroup).getRawValue();
    if (this.customerId > 0) {
      this.waiverApprovalForSearchRequest.customerId = this.customerId
    }
    if (this.waiveApprovalListForm.get(['searchWaiveApprovalListForm', 'customerName']).value == null) {
      this.waiverApprovalForSearchRequest.customerId = 0;
    }
    (<NgcFormArray>this.waiveApprovalListForm.controls['waiverApproval']).resetValue([]);
    this.billingService.searchWaiveApprovalList(this.waiverApprovalForSearchRequest).subscribe(
      (response) => {
        this.responseList = response.data;
        if (response.data == null) {
          this.isWaiveApprovalList = false;
          this.refreshFormMessages(response);
        }
        else {
          if (this.responseList.length) {
            this.isWaiveApprovalList = true;
            this.waiveApprovalListForm.get('waiverApproval').patchValue(response.data);
          }
          else {
            this.isWaiveApprovalList = false;
            this.showInfoStatus("billing.error.no.records.found");
          }
        }
      },
      (error) => {
        this.isWaiveApprovalList = false;
        this.showErrorStatus(error);
      }
    );
  }

  /**
   * methods get cutomer id
   * from lov selection of customer
   * @param event
   */
  getCustomerId(event) {
    this.customerId = event.param1;
  }

  /**
  * This method
  * will clear
  * entire form data
  */
  onClear() {
    this.reloadPage();
  }

  backToHome(event) {
    this.router.navigate(['']);
  }
  setAWBNumber(object) {
    if (object.code == null) {
      this.showErrorStatus('hawb.invalid');
    }
    else {
      this.waiveApprovalListForm.get('searchWaiveApprovalListForm.hawbNumber').setValue(object.code);
      this.waiveApprovalListForm.get('searchWaiveApprovalListForm.shipmentHouseId').setValue(object.param2);
    }
  }

  onTabOutCheckHandledBy() {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      const search = {
        shipmentNumber: this.waiveApprovalListForm.controls.searchWaiveApprovalListForm.get('awbNumber').value,
        shipment: this.waiveApprovalListForm.controls.searchWaiveApprovalListForm.get('awbNumber').value,
        shipmentType: 'AWB',
        appFeatures: null,
      }
      this.billingService.checkHandledByOrAccpByHouse(search).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          if (data) {
            this.handledbyHouse = true;
          } else {
            this.handledbyHouse = false;
            this.waiveApprovalListForm.get('searchWaiveApprovalListForm.hawbNumber').setValue(null);
            this.waiveApprovalListForm.get('searchWaiveApprovalListForm.shipmentHouseId').setValue(null);

          }
        }
      })
    }
  }

  openApprovalOrRejectPopup(event, code) {
    this.resetFormMessages();
    let openPopupFlag = false;
    let count = 0;
    this.waiverTobeApprovedOrRejected = [];
    if (code == 'table') {
      if (event.record.waiverApprovalStatus != 'PENDING') {
        this.showErrorStatus('billing.waiverapproval.selectpending');
        openPopupFlag = false;
      } else {
        this.waiverTobeApprovedOrRejected.push(event.record);
        openPopupFlag = true;
      }
    } else {
      const arrayList: NgcFormArray = this.waiveApprovalListForm.get('waiverApproval') as NgcFormArray;
      arrayList.controls.forEach((element: NgcFormGroup) => {
        if (element.value.select) {
          count++;
          if (element.value.waiverApprovalStatus == 'PENDING') {
            this.waiverTobeApprovedOrRejected.push(element.value);
            openPopupFlag = true;
          } else {
            //TODO
            this.showErrorStatus('billing.waiverapproval.selectpending');
            openPopupFlag = false;
            return;
          }
        }
      });
      if (count == 0) {
        this.showErrorMessage('selectAtleastOneRecord');
        return;
      }
    }
    if (openPopupFlag) {
      this.showPopUpWindow.open();
      this.waiverRejectReturnForm.reset();
    }

  }

  rejectApproveRequest(status) {
    this.waiverTobeApprovedOrRejected.forEach(element => {
      element.waiverApprovalRejectReason = this.waiverRejectReturnForm.get('waiverApprovalRejectReason').value;
      element.waiverApprovalStatus = status;
    });
    this.billingService.waiveApproveOrReject(this.waiverTobeApprovedOrRejected).subscribe(
      (response) => {
        this.refreshFormMessages(response);
        this.waiverRejectReturnForm.reset();
        this.showPopUpWindow.close();
        this.showSuccessStatus('g.operation.successful');
        this.searchwaiveApprovalList();
      });
  }
}
