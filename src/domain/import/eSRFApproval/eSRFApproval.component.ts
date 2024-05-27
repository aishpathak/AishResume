import { Component, ElementRef, NgZone, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, PageConfiguration, NgcUtility, NgcFileUploadComponent, NgcReportComponent, ReactiveModel, DateTimeKey, NgcWindowComponent } from "ngc-framework";
import { ImportService } from '../import.service';
import { IssueSRF } from "../import.sharedmodel";
@Component({
  selector: 'app-eSRFApproval',
  templateUrl: './eSRFApproval.component.html',
  styleUrls: ['./eSRFApproval.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})



export class ESRFApprovalComponent extends NgcPage {


  @ViewChild("additionalInformationWindow")
  additionalInformationWindow: NgcWindowComponent;
  @ViewChild("collectionPersonPopUp")
  collectionPersonPopUp: NgcWindowComponent;

  @ViewChild('uploadedfiles') uploadedfiles: NgcFileUploadComponent;
  @ViewChild('docUploadWindow') docUploadWindow: NgcWindowComponent;

  showTable: any;
  terminalValue: any;
  request: any;
  shipmentNumber: any;
  fltKey: any;
  fltDate: any;
  shipmentArray: any;
  shipmentInfoList: any[] = [];
  issueSRFSaveRequest: any;
  patchDataValue: { awbNumber: any };
  selectedData: any;


  public eSRFApprovalForm: NgcFormGroup = new NgcFormGroup({
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),
    carrierCode: new NgcFormControl(),
    agentName: new NgcFormControl(),
    truckerCompany: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    vehicleNo: new NgcFormControl(),
    bookingNo: new NgcFormControl(),
    bookingStatus: new NgcFormControl(),
    documentUploaded: new NgcFormControl(),
    additionalInfoData: new NgcFormControl(),
    rejectionRemarks: new NgcFormControl(),
    shipmentArray: new NgcFormArray([

    ]),
  })

  public additionalInformation: NgcFormGroup = new NgcFormGroup({
    agentPd: new NgcFormControl(),
    agentPdBalence: new NgcFormControl(),
    airlinePd: new NgcFormControl(),
    airlinePdBalence: new NgcFormControl(),
    undertaking: new NgcFormControl(),

  });

  public collectionPerson: NgcFormGroup = new NgcFormGroup({
    appointedAgent: new NgcFormControl(),
    collectedBy: new NgcFormControl(),
    hkId: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    fltNoDate: new NgcFormControl(),
    documentNames: new NgcFormArray([

    ]),
  });



  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {

    var transferData = this.getNavigateData(this.activatedRoute);
    if (transferData != null) {
      this.eSRFApprovalForm.get('shipmentNumber').setValue(transferData.shipmentNumber);
      this.onSearch();
    }

  }

  onSearch() {
    this.showTable = false;
    this.resetFormMessages();
    if (this.eSRFApprovalForm.invalid) {
      return;
    }
    if (this.eSRFApprovalForm.get('fromDate').value == undefined || this.eSRFApprovalForm.get('fromDate').value == "" || this.eSRFApprovalForm.get('fromDate').value == null
      || this.eSRFApprovalForm.get('toDate').value == undefined || this.eSRFApprovalForm.get('toDate').value == "" || this.eSRFApprovalForm.get('toDate').value == null) {
      this.showErrorMessage('enter.fromDate.ToDate');
      return;
    }
    let request = this.eSRFApprovalForm.getRawValue();
    this.importService.getShipmentEsrfApproval(request).subscribe(response => {

      if (this.showResponseErrorMessages(response)) {
        this.showTable = false
        return;
      }
      const resp = response.data;
      if (!this.showResponseErrorMessages(response)) {
        if (resp == null) {
          this.showErrorStatus("no.record.found")
          this.showTable = false
        }
        this.eSRFApprovalForm.get('shipmentArray').patchValue(resp);
        this.showTable = true;
      }
    });
  }

  onApprove() {
    let count = 0;
    this.resetFormMessages();
    let request = (<NgcFormGroup>this.eSRFApprovalForm.get(['shipmentArray'])).getRawValue();
    request.forEach(element => {
      if (element.selectCheck) {
        count++;
      }
    });
    if (count == 0) {
      this.showErrorStatus('export.select.a.record');
      return;
    }
    this.importService.getEsrfApproveStatus(request).subscribe(response => {

      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.onSearch();
        this.showTable = false;

      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  onReject() {
    let count = 0;
    let srfGenerated = 0;
    this.resetFormMessages();
    let request = (<NgcFormGroup>this.eSRFApprovalForm.get(['shipmentArray'])).getRawValue();
    request.forEach(element => {
      if (element.selectCheck) {
        count++;
      }
      if (element.selectCheck && element.srfNo != null) {
        srfGenerated++;
      }
    });
    if (srfGenerated > 0) {
      this.showErrorStatus('already.shipment.po.printed');
      return;
    }
    if (count == 0) {
      this.showErrorStatus('export.select.a.record');
      return;
    }

    if (this.eSRFApprovalForm.get('rejectionRemarks').value == null) {
      this.showErrorStatus('import.rejection.reason.mandatory');
      return;
    }

    request.forEach(element => {
      element.rejectionRemarks = this.eSRFApprovalForm.get('rejectionRemarks').value;
    });
    this.importService.getEsrfRejectedStatus(request).subscribe(response => {

      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.onSearch();
        this.eSRFApprovalForm.get('rejectionRemarks').reset();
        this.showTable = false;
      }
    }, error => {
      this.showErrorStatus(error);
    });


  }

  onAutoIssueSRF(): void {
    this.collectionPerson.reset();
    this.shipmentInfoList = [];
    let count = 0;
    let documentNotApproved: any = null;
    let validatePaymentStatus: any = null;
    let checkPaymentStatus: any = null;
    this.resetFormMessages();
    let rowDataList = (<NgcFormGroup>this.eSRFApprovalForm.get(['shipmentArray'])).getRawValue();
    rowDataList.forEach(element => {
      if (element.selectCheck) {
        count++;
        this.shipmentInfoList.push(element);
      }
      if (element.selectCheck && element.documentStatus != 'Approved') {
        if (documentNotApproved == null) {
          documentNotApproved = element.shipmentNumber;
        } else {
          documentNotApproved = documentNotApproved + "/" + element.shipmentNumber;
        }
      }
      if (element.selectCheck && element.paymentStatus == null) {
        if (checkPaymentStatus == null) {
          validatePaymentStatus = element.shipmentNumber;
        } else {
          validatePaymentStatus = validatePaymentStatus + "/" + element.shipmentNumber;
        }
      }
      // if (element.selectCheck && element.paymentStatus == 'Charges are Pending') {
      //   if (checkPaymentStatus == null) {
      //     checkPaymentStatus = element.shipmentNumber;
      //   } else {
      //     checkPaymentStatus = checkPaymentStatus + "/" + element.shipmentNumber;
      //   }
      // }
    });

    if (count == 0) {
      this.showErrorStatus('export.select.a.record');
      return;
    }
    if (documentNotApproved != null) {
      this.showErrorStatus(NgcUtility.translateMessage("imp.bd.esrf.document.status", [documentNotApproved]));
      return;
    }
    // if (validatePaymentStatus != null) {
    //   this.showErrorStatus(NgcUtility.translateMessage("imp.bd.esrfapproval.paymentStatus.check", [validatePaymentStatus]));
    //   return;
    // }
    // if (checkPaymentStatus != null) {
    //   this.showErrorStatus(NgcUtility.translateMessage("imp.bd.esrfapproval.paymentPending.check", [checkPaymentStatus]));
    //   return;
    // }

    //this.collectionPerson.get('appiontedAgent').setValue(seletedRowData.agentCode);

    this.collectionPersonPopUp.open();

  }

  getPaymentStatus(data, index) {
    this.importService.getEsrfApprovePaymentStatus(data).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.eSRFApprovalForm.get(['shipmentArray', index, 'paymentStatus']).setValue(response.data.paymentStatus);
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  autoIssueSRFSave() {
    this.collectionPerson.validate();
    if (this.collectionPerson.invalid) {
      this.showErrorMessage("mandatory.field.not.empty");
      return;
    }
    this.shipmentInfoList.forEach((shipmentInfo, i) => {
      let data = this.collectionPerson.getRawValue();
      console.log(data);
      shipmentInfo.appointedAgent = this.collectionPerson.get('appointedAgent').value;
      shipmentInfo.receivingPartyName = this.collectionPerson.get('collectedBy').value;
      shipmentInfo.receivingPartyIdentificationNumber = this.collectionPerson.get('hkId').value;
      //hard coded temporary need fix this printer
      shipmentInfo.printerName = '10.12.1234';
    })
    this.importService.onSaveMultipleIssuePo(this.shipmentInfoList).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.collectionPersonPopUp.close();
      }
    }, error => {
      this.showErrorStatus(error);
    });

  }

  public onAdditionalInformationPopUp(data, index): void {
    this.additionalInformationWindow.open();
  }

  getDocumentInfo(data, index) {
    this.collectionPerson.get('awbNumber').setValue(data.shipmentNumber);
    this.collectionPerson.get('fltNoDate').setValue(data.flightInfo);
    this.shipmentNumber = data.shipmentNumber;
    this.fltKey = data.flightKey;
    this.fltDate = data.flightDate;
    this.docUploadWindow.open();
  }
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }



  navigateToFWB() {
    let flag = this.validateSelectedRecords();
    if (flag) {
      this.patchData();
      this.navigateTo(this.router, 'import/maintainfwb', this.patchDataValue);
    }

  }

  navigateToFHL() {
    let flag = this.validateSelectedRecords();
    if (flag) {
      this.patchData();
      this.navigateTo(this.router, 'awbmgmt/maintainhouse', this.patchDataValue);
    }

  }

  patchData() {
    this.patchDataValue = {
      awbNumber: this.selectedData.shipmentNumber

    }
  };



  validateSelectedRecords() {
    let formData = this.eSRFApprovalForm.getRawValue();
    let count = 0;
    formData.shipmentArray.forEach(element => {
      if (element.selectCheck) {
        count++;
        this.selectedData = element;
      }
    });
    if (count > 1) {
      this.showErrorMessage('select.one.record');
      return false;
    }
    return true;
  }
}









