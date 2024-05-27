import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NgcFormArray, NgcFormControl, NgcFormGroup, NgcInputComponent,
  NgcPage, NgcUtility, NgcWindowComponent, PageConfiguration, NgcLOVComponent, ReactiveModel, NgcReportComponent
} from 'ngc-framework';
import { EfacilitationService } from '../efacilitation.service';
import { EfacilitationForm, EfacilitationSearchForm, EfacilitationShipmentListModel } from '../efacilitation.sharedmodel';
import { Validators } from '@angular/forms';

@Component({
  selector: 'ngc-edit-efacilitation',
  templateUrl: './edit-efacilitation.component.html',
  styleUrls: ['./edit-efacilitation.component.scss']
})

@PageConfiguration({
  trackInit: true,
  focusToBlank: true,
  focusToMandatory: true,
  callNgOnInitOnClear: true,
})
export class EditEfacilitationComponent extends NgcPage {
  navigateBackData: any;
  showFlagData: boolean = true;
  /* 
  * Reactive Form
  */
  @ReactiveModel(EfacilitationForm)
  public form: NgcFormGroup;

  @ReactiveModel(EfacilitationSearchForm)
  public searchForm: NgcFormGroup;

  @ViewChild('rejectWindow') rejectWindow: NgcWindowComponent;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    private router: Router,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private efacilitationService: EfacilitationService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    const agentRecord = this.getUserProfile();
    const forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {
      this.navigateBackData = forwardedData;
      this.onAutoSearch();
    } else {
      this.showFlagData = true;
      this.form.get('customerId').setValue(agentRecord.customerId);
      this.form.get('agentName').setValue(agentRecord.customerName);
      this.onAddRow();
    }
  }

  onSave() {
    this.form.validate();
    if (!this.form.valid) {
      return;
    }
    const req: any = this.form.getRawValue();
    var shipmentWithCompleted: any = [];
    req.shipmentList.forEach(element => {
      if (element.satsStatus == 'Complete') {
        shipmentWithCompleted.push(element.shipmentNumber);
      }
    });
    if (shipmentWithCompleted && shipmentWithCompleted.length > 0) {
      this.showConfirmMessage('confirm.awb.number').then(fulfilled => {
        this.efacilitationService.saveEfacilitationService(this.form.getRawValue()).subscribe(response => {
          this.resetFormMessages();
          if (!this.showResponseErrorMessages(response)) {
            this.form.patchValue(response.data);
            this.showSuccessStatus('uld.operation.completed.successfully');
          }
        });
      });
    } else {
      this.efacilitationService.saveEfacilitationService(this.form.getRawValue()).subscribe(response => {
        this.resetFormMessages();
        if (!this.showResponseErrorMessages(response)) {
          this.form.patchValue(response.data);
          this.showSuccessStatus('uld.operation.completed.successfully');
        }
      });
    }
  }



  /*
  On Add of record for Array <shipmentList>
  */
  onAddRow() {
    const column: EfacilitationShipmentListModel = new EfacilitationShipmentListModel();
    (<NgcFormArray>this.form.get(['shipmentList'])).addValue([column]);
  }

  /* 
  Delete of record of Array  <shipmentList>
  */
  onDelete(index) {
    (<NgcFormArray>this.form.get(['shipmentList'])).markAsDeletedAt(index);
  }

  /* 
  Call an API for receiving and patching the calculated value
  */
  getQuoteEfacilitationService() {
    this.form.validate();
    if (!this.form.valid) {
      return;
    }
    this.efacilitationService.getQuoteEfacilitationService(this.form.getRawValue()).subscribe(response => {
      this.resetFormMessages();
      if (!this.showResponseErrorMessages(response)) {
        this.form.patchValue(response.data);
      }
    });
  }

  /* 
  On serviceRequest button click
  Parameters : 'approve' / 'reject'
  */
  onApproveReject(value) {
    if (value === 'approve') {
      this.efacilitationService.approveEfacilitationServiceInternal(this.form.getRawValue()).subscribe(response => {
        this.resetFormMessages();
        if (!this.showResponseErrorMessages(response)) {
          this.form.patchValue(response.data);
          this.showSuccessStatus('uld.operation.completed.successfully');
        }
      });
    } else {
      this.rejectWindow.open();
      this.form.get('rejectReason').setValidators([Validators.required]);
      /* this.efacilitationService.rejectEfacilitationServiceInternal(this.form.getRawValue()).subscribe(response => {
        this.resetFormMessages();
        if (!this.showResponseErrorMessages(response)) {
          this.form.patchValue(response.data);
          this.showSuccessStatus('Operation completed successfully');
        }
      }); */
    }
  }

  onCancel() {
    this.navigateBack(this.navigateBackData);
  }

  customClearanceRequired(event) {
    if (event) {
      this.form.get('customBroker').setValidators([Validators.required]);
    } else {
      this.form.get('customBroker').clearValidators();
    }
  }

  onAutoSearch() {
    let dataToForward = null;
    dataToForward = {
      shipmentNumber: null,
      serviceRequestNo: this.navigateBackData.serviceRequestNo,
      serviceRequestSetId: null
    }
    this.searchForm.patchValue(dataToForward);
    this.editEfacilitationService(dataToForward);
  }

  onSearch() {
    let dataToForward = null;
    this.showFlagData = true;
    dataToForward = this.searchForm.getRawValue();
    if (!dataToForward.serviceRequestNo && !dataToForward.shipmentNumber) {
      this.showErrorMessage("efacilitation.search.criteria");
      return;
    }
    this.editEfacilitationService(dataToForward);
  }

  editEfacilitationService(searchRequest) {
    this.efacilitationService.editEfacilitationService(searchRequest).subscribe(response => {
      this.resetFormMessages();
      if (!this.showResponseErrorMessages(response)) {
        this.showFlagData = false;
        this.form.patchValue(response.data);
        this.customClearanceRequired(response.data.customClearanceRequired);
      }
    });
  }

  onRejectWindow() {
    if (this.form.get('rejectReason').value == null || this.form.get('rejectReason').value == ' ') {
      this.showErrorMessage("admin.provide.reason.reject");
      return;
    }
    this.efacilitationService.rejectEfacilitationServiceInternal(this.form.getRawValue()).subscribe(response => {
      this.resetFormMessages();
      if (!this.showResponseErrorMessages(response)) {
        this.rejectWindow.close();
        this.form.get('rejectReason').setValidators([]);
        this.form.patchValue(response.data);
        this.showSuccessStatus('uld.operation.completed.successfully');
      }
    });
  }

  onRedirectIssueDO(event) {
    let temp = this.form.get(['shipmentList', event, 'shipmentNumber']).value;
    let navigateObj = {
      shipmentNumber: temp
    }

    this.navigateTo(this.router, 'import/issuedo', navigateObj);
  }
  onLinkClick(event) {

    let navigateObj = {
      shipmentNumber: event
    }

    this.navigateTo(this.router, 'awbmgmt/shipmentinfoCR', navigateObj);
  }
  onCloseWindow() {
    this.form.get('rejectReason').setValidators([]);
  }
}