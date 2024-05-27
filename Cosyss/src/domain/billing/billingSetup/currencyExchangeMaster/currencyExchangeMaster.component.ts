import { Component, OnInit, ViewContainerRef, ElementRef, NgZone, ViewChild } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcFormArray, NgcPage, PageConfiguration, NgcReportComponent } from 'ngc-framework';
import { BillingService } from '../../billing.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-currencyExchangeMaster',
  templateUrl: './currencyExchangeMaster.component.html',
  styleUrls: ['./currencyExchangeMaster.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class CurrencyExchangeMasterComponent extends NgcPage {
  reportParameters: any;
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private billingService: BillingService) {
    super(appZone, appElement, appContainerElement)
  }

  currencyExchangeMasterForm: NgcFormGroup = new NgcFormGroup({
    currencyCode: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    actual: new NgcFormControl(true),
    past: new NgcFormControl(false),
    future: new NgcFormControl(false),
    rateDetails: new NgcFormArray([
      new NgcFormGroup({
        currencyCode: new NgcFormControl(),
        carrierCode: new NgcFormControl(),
        validFrom: new NgcFormControl(),
        validTill: new NgcFormControl(),
        exchangeRate: new NgcFormControl(),
        remarks: new NgcFormControl(),
        edit: new NgcFormControl()
      })
    ])
  });

  showRates: boolean = false;

  ngOnInit() {
    super.ngOnInit();
  }

  onExchangeRateSearch() {
    let request = this.currencyExchangeMasterForm.getRawValue();
    request.rateDetails = new Array();
    this.billingService.fetchExchangeRates(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        response.data.rateDetails.forEach(rate => {
          if (rate.exchangeRate) {
            rate.edit = false;
          } else {
            rate.edit = true;
          }
        });
        this.currencyExchangeMasterForm.get('rateDetails').patchValue(response.data.rateDetails);
        this.currencyExchangeMasterForm.get('rateDetails').valueChanges.subscribe(changedValue => {
          ((<NgcFormArray>this.currencyExchangeMasterForm.get('rateDetails'))).value.forEach((value, index) => {
            if (this.currencyExchangeMasterForm.get('past').value) {
              this.currencyExchangeMasterForm.get(['rateDetails', index, 'validTill']).setValidators(Validators.required);
            } else {
              this.currencyExchangeMasterForm.get(['rateDetails', index, 'validTill']).clearValidators();
            }
          })
        })
        this.showRates = true;
      }
    }, error => {
      this.showErrorMessage('g.server.down');
    })
  }

  onSaveExchangeRates() {
    let request = this.currencyExchangeMasterForm.getRawValue();
    this.billingService.saveExchangeRates(request).subscribe(response => {
      if (response.data && response.data.messageList.length == 2) {
        response.data.messageList.splice(0, 1);
      }
      if (response.data && response.data.messageList.length && response.data.messageList[0].code === 'bil.exchangeRateVaryWarning') {
        this.showConfirmMessage(response.data.messageList[0].code).then(fulfilled => {
          request.overrideExchangeRate = true;
          this.billingService.saveExchangeRates(request).subscribe(response => {
            if (!this.showResponseErrorMessages(response)) {
              this.showSuccessStatus('g.completed.successfully')
              this.onExchangeRateSearch();
            }
          }, error => {
            this.showErrorMessage('g.server.down');
          });
        });
      } else if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully')
        this.onExchangeRateSearch();
      }
    }, error => {
      this.showErrorMessage('g.server.down');
    });
  }

  generateReport() {
    this.reportParameters = new Object();
    this.reportParameters.currencyCode = this.currencyExchangeMasterForm.controls["currencyCode"].value;
    this.reportParameters.carrierCode = this.currencyExchangeMasterForm.controls["carrierCode"].value;
    this.reportParameters.actual = this.currencyExchangeMasterForm.controls["actual"].value;
    this.reportParameters.future = this.currencyExchangeMasterForm.controls["future"].value;
    this.reportParameters.past = this.currencyExchangeMasterForm.controls["past"].value;
    this.reportWindow.open();
  }

  onExchangeRateAdd() {
    (<NgcFormArray>this.currencyExchangeMasterForm.get('rateDetails')).addValue([
      {
        currencyCode: null,
        carrierCode: null,
        validFrom: null,
        validTill: null,
        exchangeRate: null,
        remarks: null,
        edit: true
      }
    ])
    let size = this.currencyExchangeMasterForm.get('rateDetails').value.length;
    setTimeout(() => {
      (<NgcFormControl>this.currencyExchangeMasterForm.get(['rateDetails', size - 1, 'currencyCode'])).focus();
    }, 0);
  }

  currencyCodeChange(value, index) {
    this.currencyExchangeMasterForm.get(['rateDetails', index, 'currencyCode']).patchValue(value.code);
  }

  onEdit(index) {
    this.currencyExchangeMasterForm.get(['rateDetails', index, 'edit']).patchValue(true);
  }

  onDelete(index) {
    (<NgcFormArray>this.currencyExchangeMasterForm.get(['rateDetails'])).markAsDeletedAt(index);
  }

  onCancel() {
    this.navigateBack(null);
  }
}
