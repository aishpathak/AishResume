import { element } from 'protractor';
import { forEach } from '@angular/router/src/utils/collection';
import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormControl, PageConfiguration, NgcFormArray, NgcUtility, DateTimeKey } from 'ngc-framework';
import { Subscription } from 'rxjs';
import { ImportService, REFRESH_MS } from '../../import.service';
import { DatePipe } from '@angular/common';
import { S_IFIFO } from 'constants';

/* Components used */
@Component({
  selector: 'app-eorder-monitoring',
  templateUrl: './eorder-monitoring.component.html',
  styleUrls: ['./eorder-monitoring.component.scss']
})

/* Page Decorator */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
})
export class EorderMonitoringComponent extends NgcPage implements OnInit {
  // show or hide result after click on search
  showEOrderMonitoringDetails: boolean = false;
  autoRefreshSubscription: Subscription;
  maxDate: Date;

  /* constructor for dependency injection */
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private importService: ImportService, private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }
  /*  Search Form */
  private searchForm = new NgcFormGroup({
    processType: new NgcFormControl('Import ULD Handling'),
    cargoAcType: new NgcFormControl(),
    flightFromDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS),
      0, DateTimeKey.MINUTES), Validators.required),
    flightToDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59,
      DateTimeKey.MINUTES), Validators.required),
    flightNo: new NgcFormControl(),
    auto: new NgcFormControl()
  });

  /*  form for creating or displaying the result of E order Monitoring*/
  private form = new NgcFormGroup({
    summaryDetails: new NgcFormArray([])
  });

  /*initialisation of the page*/
  ngOnInit() {
    this.maxDate = NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), (60 * 24), DateTimeKey.MINUTES);
  }

  /* Search Function to display the Eorder Monitoring Details */
  onSearch(event) {
    this.resetFormMessages();
    this.showEOrderMonitoringDetails = false;
    if (event !== 'onLoad') {
      if (this.searchForm.invalid) {
        this.searchForm.validate();
        return;
      }
    }
    // this.importService.summary(this.searchForm.getRawValue()).subscribe(response => {
    //   this.resetFormMessages();
    //   if (!this.showResponseErrorMessages(response)) {
    //     if (response.data && response.messageList == null) {
    //       this.showEOrderMonitoringDetails = true;
    //       response.data.summaryDetails.forEach((element) => {
    //         if (element.maintainJobOrderList && element.maintainJobOrderList.length == 0) {
    //           /* here I am pushing the obj as null to patch all the data of the maintainJobOrderList */
    //           element.maintainJobOrderList.push(this.obj)
    //         }
    //       })
    //       if (response.data.summaryDetails.length === 10000) {
    //         this.showInfoStatus('billing.pd.records.more.than');
    //       }
    //       this.form.get(['summaryDetails']).patchValue(response.data.summaryDetails);
    //     }
    //   }
    // }, (error: string) => {
    //   this.showErrorMessage('error');
    // });
  }

  /* this save function is used to save for updating the priority details for JOB order in DB*/
  Onsave() {
    let request = this.form.get(['summaryDetails']).value;
    request.forEach((element, index) => {
      if (element.maintainJobOrderList && element.maintainJobOrderList.length > 0) {
        element.maintainJobOrderList.forEach((jobOrder, orderIndex) => {
          if (jobOrder) {
            jobOrder.orderTime = null;
            jobOrder.pickUpTime = null;
            jobOrder.jobCompletionTime = null;
          }
        });
      }
    });
    // this.importService.priority(request).subscribe(response => {
    //   this.resetFormMessages();
    //   if (!this.showResponseErrorMessages(response)) {
    //     this.showSuccessStatus('ware.priority.updated.success');
    //     this.onSearch(event);
    //   }
    // }, (error: string) => {
    //   this.showErrorMessage('error');
    // });
  }

  /* this is used to acknowledge the job order */
  onAcknowledge() {
    let performAction = this.onValidateAction('Acknowledge');
    if (!performAction) {
      return;
    }
    // this.importService.acknowledge(performAction).subscribe(response => {
    //   this.resetFormMessages();
    //   if (!this.showResponseErrorMessages(response)) {
    //     this.showSuccessStatus('job.order.acknow.success');
    //     this.onSearch(event);
    //   }
    // }, (error: string) => {
    //   this.showErrorMessage('error');
    // });
  }


  /* this function is call to perform cancel operation on the job order*/
  onCancel() {
    let performAction = this.onValidateAction('Cancel');
    if (!performAction) {
      return;
    }
    // this.importService.cancel(performAction).subscribe(response => {
    //   this.resetFormMessages();
    //   if (!this.showResponseErrorMessages(response)) {
    //     this.showSuccessStatus('job.order.cancel.success');
    //     this.onSearch(event);
    //   }
    // }, (error: string) => {
    //   this.showErrorMessage('error');
    // });
  }

  /* this function is call to perform complete operation on the job order*/
  onComplete() {
    let performAction = this.onValidateAction('Complete');
    if (!performAction) {
      return;
    }
    // this.importService.completed(performAction).subscribe(response => {
    //   this.resetFormMessages();
    //   if (!this.showResponseErrorMessages(response)) {
    //     this.showSuccessStatus('job.order.complete.success');
    //     this.onSearch(event);
    //   }
    // }, (error: string) => {
    //   this.showErrorMessage('error');
    // });
  }

  /* 
   * Function is used to make the search results flag false when changing 
   * ProcessType dropdown values
  */
  onClickCategory(event) {
    this.form.reset();
    this.showEOrderMonitoringDetails = false;
    this.searchForm.get('flightNo').setValue(null);
    this.searchForm.get('flightFromDate').setValue(null);
    this.searchForm.get('flightToDate').setValue(null);
    this.searchForm.get('cargoAcType').setValue(null);
    if (event === 'Other ULD Transfer') {
      this.searchForm.get('flightFromDate').setValidators([]);
      this.searchForm.get('flightToDate').setValidators([]);
    } else if (event === 'Miscellaneous Order') {
      this.searchForm.get('flightFromDate').setValidators([]);
      this.searchForm.get('flightToDate').setValidators([]);
    } else if (event === 'Import ULD Handling') {
      this.searchForm.get('flightFromDate').setValidators([Validators.required]);
      this.searchForm.get('flightToDate').setValidators([Validators.required]);
    }
  }
  /* this is to auto populate fromDate and ToDate with 1 day difference*/
  onFromDate(value) {
    this.maxDate = NgcUtility.addDate(value, (60 * 24), DateTimeKey.MINUTES);
  }

  /* This function is used to auto refresh the table list data */
  onChangeData(event) {
    if (this.autoRefreshSubscription && this.showEOrderMonitoringDetails) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
    }
    if (event === true && this.showEOrderMonitoringDetails) {
      this.autoRefreshSubscription = this.getTimer(REFRESH_MS).subscribe((data) => {
        this.onSearch(event);
      });
    }
  }

  /* 
   * this is used to perform the action based on the event acknowledge,
   * cancel , complete  the job order if it is already done 
   */
  performAction(event: string, jobOrder: any) {
    if (event == 'Acknowledge') {
      if (jobOrder.cancelledBy || jobOrder.completedBy || jobOrder.acknowledgedOn) {
        this.showErrorMessage('cannot.acknow.order');
        return false;
      }
    } else if (event == 'Cancel') {
      if (jobOrder.cancelledBy || jobOrder.completedBy || jobOrder.acknowledgedOn) {
        this.showErrorMessage('cannot.cancel.order');
        return false;
      }
    } else if (event == 'Complete') {
      if (jobOrder.cancelledBy || jobOrder.completedBy || jobOrder.acknowledgedOn == null) {
        this.showErrorMessage('cannot.complete.order');
        return false;
      }
    }
    return true;
  }

  /* 
   * this is to validate whether to perform action or not based on perform action value returns true,
   * if its true then we returnArray
   */
  onValidateAction(event) {
    let performAction = true;
    this.resetFormMessages();
    //sending empty array in request after nullyfing few values
    const returnArray = [];
    this.form.get(['summaryDetails']).value.forEach((element) => {
      if (element.select && element.maintainJobOrderList && element.maintainJobOrderList.length > 0) {
        element.maintainJobOrderList.forEach((jobOrder) => {
          if (jobOrder && performAction) {
            //checking whether to perform action
            performAction = this.performAction(event, jobOrder);
            jobOrder.orderTime = null;
            jobOrder.pickUpTime = null;
            jobOrder.jobCompletionTime = null;
          }
        });
        if (performAction) {
          returnArray.push(element);
        }
      }
    });
    if (!performAction) {
      return false;
    }
    if (returnArray.length == 0) {
      this.showErrorStatus('select.one.record');
      return false;
    }
    return returnArray;
  }


  /* 
   * we are sending obj variables as null to patch if maintainJobOrderList is null means 
   * no job order is created for that record
   */
  obj = {
    uldtransferNo: null,
    createTime: null,
    uldTo: null,
    type: null,
    allotUldNo: null,
    uldAssignedNo: null,
    uldTransferred: null,
    cargoAcType: null,
    flightFromDate: null,
    flightToDate: null,
    flightNo: null,
    flightDate: null,
    flightNoDate: null,
    sta: null,
    eta: null,
    ata: null,
    allotRamp: null,
    checkIn: null,
    osCheckIn: null,
    uldTrf: null,
    jobOrder: null,
    jobOrderAcknowledged: null,
    orderAcknowledged: null,
    timeOfJobOrder: null,
    timeOfUnit: null,
    eOrderId: null,
    jobOrderCode: null,
    sentTo: null,
    orderTime: null,
    pickUpTime: null,
    epsTime: null,
    jobCompletionTime: null,
    elapsedTimeForJobComp: null,
    priority: null,
    flgPickUpStaff: null,
    lastUpdatedDateTime: null,
    orderAckStatus: null,
    orderAckStatusColor: null,
    flightId: null,
    pendingAcknowledgementTime: null,
    instruction: null,
    osCheckInColor: null,
    checkInColor: null,
    totalUld: null,
    uldAssignedColor: null,
    acknowledgedBy: null,
    acknowledgedOn: null,
    cancelledBy: null,
    cancelledOn: null,
    completedBy: null,
    completedOn: null
  }
}