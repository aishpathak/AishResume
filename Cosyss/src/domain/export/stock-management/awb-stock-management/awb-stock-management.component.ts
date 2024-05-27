import { ExportService } from './../../export.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnDestroy, AfterViewInit } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration } from 'ngc-framework';
import { Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-awb-stock-management',
  templateUrl: './awb-stock-management.component.html',
  styleUrls: ['./awb-stock-management.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class AwbStockManagementComponent extends NgcPage {
  displayFlag = true;
  redirectedData;
  form: NgcFormGroup;
  response;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private service: ExportService, private router: Router, ) {
    super(appZone, appElement, appContainerElement);
  }

  //  carrierCode: new NgcFormControl('SQ'),
  //  awbStockID: new NgcFormControl(),
  //  stockId: new NgcFormControl(),
  //  stockCategoryCode: new NgcFormControl('OCS'),
  //  firstAwbNumber: new NgcFormControl(),
  //  numberOfAwb: new NgcFormControl(10),
  //  lowStockLimit: new NgcFormControl(20),
  //  oldLowStockLimit: new NgcFormControl(10)

  ngOnInit() {
    super.ngOnInit();
    this.form = new NgcFormGroup({
      carrierCode: new NgcFormControl(),
      awbStockId: new NgcFormControl(),
      stockId: new NgcFormControl(),
      stockCategoryCode: new NgcFormControl(),
      firstAwbNumber: new NgcFormControl(),
      numberOfAwb: new NgcFormControl(),
      lowStockLimit: new NgcFormControl(),
      oldLowStockLimit: new NgcFormControl()
    });
    if (this.service.dataToNawbStockManagement) {
      this.redirectedData = {
        carrierCode: this.service.dataToNawbStockManagement.carrierCode,
        awbStockId: this.service.dataToNawbStockManagement.awbStockId,
        stockId: this.service.dataToNawbStockManagement.stockId,
        stockCategoryCode: this.service.dataToNawbStockManagement.stockCategoryCode,
        firstAwbNumber: this.service.dataToNawbStockManagement.awbPrefix +
        this.service.dataToNawbStockManagement.awbSuffix,
        numberOfAwb: this.service.dataToNawbStockManagement.total,
        oldLowStockLimit: this.service.dataToNawbStockManagement.lowStockLimit,
        lowStockLimit: 0
      };
      this.form.patchValue(this.redirectedData);
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    //
    this.bindOnChangeEvents();
  }

  // AWBNoModeSevenCheck() {
  //   let awbSuffix = this.form.get('firstAwbNumber').value;
  //   const lastDigit = Number(awbSuffix[awbSuffix.length - 1]);
  //   awbSuffix = Number(awbSuffix.slice(3, awbSuffix.length - 1));
  //   if (awbSuffix % 7 === lastDigit) {
  //     return true;
  //   }
  //   return false;
  // }

  onSave() {
    if (this.form.get('stockId').value > 0) {
      if (this.form.get('stockId').value <= 0) {
        this.showErrorStatus('export.stockid.should.be.positive.number');
        return;
      }
      this.notUpdate();
    } else {
      this.updateLowStockLimit(true);
    }
  }

  notUpdate() {
    if (!this.form.get('firstAwbNumber').value) {
      this.showErrorStatus('export.enter.starting.awbnumber');
      return;
    }
   
    if (this.form.get('oldLowStockLimit').value === 'Not Set' && !this.form.get('lowStockLimit').value) {
      this.showErrorStatus('export.select.low.stock.limit');
      return;
    }
    const addRequest = this.form.getRawValue();
    if (this.form.get('oldLowStockLimit').value !== 'Not Set') {
      addRequest.lowStockLimit = this.form.get('oldLowStockLimit').value;
    } else if (this.form.get('lowStockLimit').value <= 0) {
      this.showErrorStatus('export.low.stock.limit.should.be.positive');
      return;
    }
    this.addAWBStock(addRequest);
  }

  onClear() {
    this.service.dataToNawbStockManagement = null;
    this.form.reset();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.service.dataToNawbStockManagement = null;
  }

  bindOnChangeEvents() {

    this.form.get('carrierCode').valueChanges.subscribe((val) => {
      if (this.form.get('carrierCode').value && this.form.get('stockCategoryCode').value) {
        this.fetchLowStockLimit();
      }
    });
    this.form.get('stockCategoryCode').valueChanges.subscribe((val) => {
      if (this.form.get('carrierCode').value && this.form.get('stockCategoryCode').value) {
        this.fetchLowStockLimit();
      }
    });
  }

  fetchLowStockLimit() {
    this.service.fetchLowStockLimit(this.form.getRawValue()).subscribe((resp) => {
      this.response = resp;
      if (this.response.data) {
        // this.showSuccessStatus('g.completed.successfully');
        if (this.response.data.lowStockLimit) {
          this.form.get('oldLowStockLimit').setValue(this.response.data.lowStockLimit);
        } else {
          this.form.get('oldLowStockLimit').setValue('Not Set');
        }
      }
    });
  }

  addAWBStock(addRequest) {
    this.service.addAWBStock(addRequest).subscribe((resp) => {
      this.response = resp;
      this.refreshFormMessages(this.response);
      if (this.response.data) {
        this.showSuccessStatus('g.completed.successfully');
        if (this.response.data.noOfAWBCreated === 0) {
          this.showInfoStatus('export.awbs.duplicate.blacklisted');
        } else if (this.response.data.noOfAWBCreated !== Number(this.form.get('numberOfAwb').value)) {
          this.showInfoStatus(this.response.data.noOfAWBCreated +
            ' AWB could be created as others were duplicate/blacklisted');
        }
        if (this.form.get('oldLowStockLimit').value !== 'Not Set' && this.form.get('lowStockLimit').value) {
          this.updateLowStockLimit(false);
        }
        // this.onClear();
      }
    });
  }

  updateLowStockLimit(message) {
    if (this.form.get('lowStockLimit').value <= 0) {
      if (message) {
        this.showErrorStatus('export.low.stock.limit.should.be.positive');
      } else {
        this.showErrorStatus('export.low.stock.limit.not.updated');
      }
      return;
    }
    this.service.updateLowStockLimit(this.form.getRawValue()).subscribe((resp) => {
      this.response = resp;
        if (message) {
          this.showSuccessStatus('g.completed.successfully');
          this.form.get('lowStockLimit').setValue('0');
          this.fetchLowStockLimit();
          // this.onClear();
        } else {
          this.service.dataToNawbStockManagement = null;
        }
     
    });
  }

  //Navigate to awb stock summary
  onCancel() {
    /*
        const sentEDIMessageFlight: DLSFlight = this.form.getRawValue();
        this.navigateTo(this.router, 'interface/outgoingmessage', { sentEDIMessageFlight });
    */
    this.navigateTo(
      this.router,
      "export/awbstocksummary",
      this.form.getRawValue()
    );
  }
}
