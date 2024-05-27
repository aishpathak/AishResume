import { Component, ElementRef, NgZone, ViewContainerRef } from '@angular/core';
import { NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, NgcUtility, DateTimeKey, PageConfiguration } from 'ngc-framework';
import { ReceivedocumentService } from './receivedocument.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-receivedocument',
  templateUrl: './receivedocument.component.html',
  styleUrls: ['./receivedocument.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class ReceivedocumentComponent extends NgcPage {
  navigateData: any;
  shipmentDocumentInfoTbl: boolean = false;
  ReceiveDocumentSearchForm: NgcFormGroup = new NgcFormGroup({
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    truckNumber: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    agentIataCode: new NgcFormControl(),
    agentName: new NgcFormControl(),
  });

  ReceiveDocumentResultForm: NgcFormGroup = new NgcFormGroup({
    shipmentDocumentInfo: new NgcFormArray([
    ])
  });

  currentDate: Date;

  constructor(appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private receivedocumentService: ReceivedocumentService,
    private router: Router,
    private activatedRoute: ActivatedRoute, ) {
    super(appZone, appElement, appContainerElement);
  }

  onCancel() {
    this.navigateBack(this.navigateData);
  }

  ngAfterViewInit() {
    this.currentDate = new Date;
    this.ReceiveDocumentSearchForm.get('fromDate').setValue(this.currentDate);
    this.ReceiveDocumentSearchForm.get('toDate').setValue(this.currentDate);

    const param = this.getNavigateData(this.activatedRoute);
    this.ReceiveDocumentSearchForm.get('fromDate').setValue(param.fromDate);
    this.ReceiveDocumentSearchForm.get('toDate').setValue(param.toDate);

  }

  onSearch() {
    this.resetFormMessages();
    const requestObject = this.ReceiveDocumentSearchForm.getRawValue();

    requestObject.toDate = NgcUtility.addDate(requestObject.toDate, (23 * 60) + 59, DateTimeKey.MINUTES)

    this.receivedocumentService.retrieveReceiveDocument(requestObject).subscribe(data => {
      this.showResponseErrorMessages(data);
      if (data.data == null) {
        this.shipmentDocumentInfoTbl = false;
        this.showErrorStatus("no.record");
        return;
      }
      this.ReceiveDocumentResultForm.patchValue(data.data);
      this.shipmentDocumentInfoTbl = true;
    });
  }

  onSave() {
    this.resetFormMessages();
    const requestObject = this.ReceiveDocumentResultForm.getRawValue();

    let selectedRows = (this.ReceiveDocumentResultForm.get(['shipmentDocumentInfo']) as NgcFormArray).getRawValue().filter(obj => obj.sel === true);

    console.log(selectedRows.length);
    if (selectedRows.length == 0) {
      this.showErrorMessage("equipment.request.by.uld.selectonerecord");
      return;
    }

    requestObject.shipmentDocumentInfo = selectedRows;
    this.receivedocumentService.saveReceiveDocument(requestObject).subscribe(data => {
      this.showResponseErrorMessages(data);
      if (data.success === true) {
        this.showSuccessStatus("exp.savedsuccessfully.m");
        this.onSearch();
      }
    })
  }


  ExpAwbDoc() {
    this.navigateTo(this.router, 'export/exportawbdocument', null);
  }

  Fhl() {
    this.navigateTo(this.router, 'export/fhl', null);
  }
}

