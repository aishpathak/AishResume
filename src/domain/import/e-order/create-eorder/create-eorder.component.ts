import { Console } from 'console';
import { Component, ElementRef, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormControl, PageConfiguration, NgcFormArray, NgcUtility } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { ImportService } from '../../import.service';
import { Router, ActivatedRoute } from "@angular/router";

/* Components used */
@Component({
  selector: 'app-create-eorder',
  templateUrl: './create-eorder.component.html',
  styleUrls: ['./create-eorder.component.scss']
})

/* Page Decorator */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
})

export class CreateEorderComponent extends NgcPage implements OnInit {
  /* show or hide result after click on search*/
  showUldHandlingDetails = false;

  /* constructor for dependency injection */
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private importService: ImportService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  /*  Search Form */
  private searchForm = new NgcFormGroup({
    processType: new NgcFormControl(),
    flightNo: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    uldTransferNos: new NgcFormControl(),
    warehouseDestination: new NgcFormControl()
  });

  /* form for creating or displaying the result of E order */
  private eOrderForm = new NgcFormGroup({
    flightNo: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    ata: new NgcFormControl(),
    assignTo: new NgcFormControl(),
    priority: new NgcFormControl(),
    wareHouseLevel: new NgcFormControl(),
    warehouseDestination: new NgcFormControl(),
    instruction: new NgcFormControl(),
    checkAll: new NgcFormControl(),
    message: new NgcFormControl(),
    orderDetails: new NgcFormArray([]),
    uldTransferDetails: new NgcFormArray([])
  });

  /* initialisation of the page */
  ngOnInit() {
    /* forwardedData is used for getting the data from the incoming flight details screen */
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData && forwardedData.flightNumber) {
      this.searchForm.get("flightNo").setValue(forwardedData.flightNumber);
      this.searchForm.get("flightDate").setValue(forwardedData.flightDate);
      this.searchForm.get("processType").setValue(forwardedData.processType);
      this.onSearch();
    }
  }

  /*  Search Function to retrieve Eorder Details to create or display E Order */
  onSearch() {
    this.resetFormMessages();
    this.showUldHandlingDetails = false;
    this.searchForm.validate();
    if (this.searchForm.invalid) {
      return;
    }
    this.importService.getInfoByProcessType(this.searchForm.getRawValue()).subscribe(response => {
      this.resetFormMessages();
      if (!this.showResponseErrorMessages(response)) {
        if (response.data.orderDetails.length != 0 && response.messageList == null) {
          this.showUldHandlingDetails = true;
          this.eOrderForm.patchValue(response.data);
        } else {
          this.showErrorMessage('no.record');
        }
      }
    }, (error: string) => {
      this.showErrorMessage('error');
    });
  }

  /* Create function to create the E Order for displayed data after successful search */
  CreateEOrder() {
    this.resetFormMessages();
    this.eOrderForm.validate();
    if (this.eOrderForm.invalid) {
      return;
    }
    const request = this.eOrderForm.getRawValue();
    request.orderDetails = request.orderDetails.filter((element) => {
      return element.select && !element.detailsId
    });
    /* this is done so that user should select at least one record */
    if (request.orderDetails.length == 0 && this.searchForm.get('processType').value != 'Miscellaneous Order') {
      this.showErrorMessage("select.one.record");
      return;
    } else {
      // for setting processType for Misscellaneous order
      request.processType = this.searchForm.get('processType').value
    }
    /* we are sending uldTransferNos in search request to insert it into com_Eorder table */
    request.uldTransferNos = this.searchForm.get('uldTransferNos').value;
    this.importService.create(request).subscribe(response => {
      this.resetFormMessages();
      if (!this.showResponseErrorMessages(response)) {
        if (response.data && response.messageList == null) {
          this.eOrderForm.patchValue(response.data);
          this.showSuccessStatus('Job Order Code' + ' ' + response.data.jobOrderCode + ' ' + 'is created successfully');
          this.onSearch();
        }
      }
    }, (error: string) => {
      this.showErrorMessage('error');
    });
  }

  /*
  *  Function is used to disable the formControls which are not related to process Type search creteria
  *  and make results flag  false 
  */
  onClickCategory(event) {
    this.showUldHandlingDetails = false;
    this.eOrderForm.reset();
    this.searchForm.get('flightNo').reset();
    this.searchForm.get('flightDate').reset();
    this.searchForm.get('uldTransferNos').reset();
    this.searchForm.get('warehouseDestination').reset();
    if (event === 'Other ULD Transfer') {
      this.searchForm.get('flightNo').setValidators([]);
      this.searchForm.get('flightDate').setValidators([]);
      this.searchForm.get('uldTransferNos').setValidators([Validators.required]);
      this.eOrderForm.get('message').setValidators([]);
    } else if (event === 'Miscellaneous Order') {
      this.searchForm.get('flightNo').setValidators([]);
      this.searchForm.get('flightDate').setValidators([]);
      this.searchForm.get('uldTransferNos').setValidators([]);
      this.showUldHandlingDetails = true;
    } else {
      this.searchForm.get('uldTransferNos').setValidators([]);
      this.searchForm.get('flightNo').setValidators([Validators.required]);
      this.searchForm.get('flightDate').setValidators([Validators.required]);
      this.eOrderForm.get('message').setValidators([]);
    }
  }
}
