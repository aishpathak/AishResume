import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, NgcWindowComponent, NgcDropDownComponent, NgcDropDownListComponent, PageConfiguration, BaseRequest, NgcInputComponent
} from 'ngc-framework';

import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList, OnDestroy,
  ChangeDetectorRef, Pipe, PipeTransform, OnInit, ViewChild, Input, DoCheck, HostListener, OnChanges, SimpleChanges, SimpleChange, AfterViewInit, Output, EventEmitter, Renderer
} from '@angular/core';

import { DocumentService } from './../../document/document.service';
import { DocumentViewRequestDTO, UpdateDocumentViewData, DocumentViewResultBOResponse, UpdateDocumentRequestDTO } from './../../document/document.sharedmodel';
import { PrinterBO, CopyRequestDetails } from './../../flightpouch/flightpouch.shared';
import { FlightpouchService } from './../../flightpouch/flightpouch.service';
import { DocumentviewService } from "../documentview/documentviewService";
import { flightpouchCpyReqAndCancelButtonService } from "../../flightpouch/flightpouchCpyReqAndCancelButtonService";

@Component({
  selector: 'app-updatedocument',
  templateUrl: './updatedocument.component.html',
  styleUrls: ['./updatedocument.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class UpdatedocumentComponent extends NgcPage implements OnInit, OnDestroy {
  @Input('obj') obj: any;
  @Input('flag') flag: boolean;
  @ViewChild('shipmentNumber') shipmentNumber: NgcInputComponent;
  @Output() closeWindow = new EventEmitter<any>();
  @Output() openWindow = new EventEmitter<any>();
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;
  @ViewChild('windowPrinter1') windowPrinter1: NgcWindowComponent;
  @ViewChild('printerdropdown') printerdropdown: NgcDropDownListComponent;
  @ViewChild('printerdropdown1') printerdropdown1: NgcDropDownListComponent;
  @ViewChild('deleteReasonCode') deleteReasonCode: NgcDropDownListComponent;

  copyRequestDetails: CopyRequestDetails = new CopyRequestDetails();

  previousRoute: any;
  showData: any;
  importFlt: any[];
  exportFlt: any[];
  saveIsDisabled: boolean = true;
  createCopyIsDisabled = true;
  shipmentNumberForRefernce: string = null;
  // printerDropdownAWB: any;
  copyNumFromDocView: any;
  flightIdFromDocView: any;
  isPouchFinalized: boolean = false;
  printAwbNum: any;
  awbNum: any;

  private updateDocumentForm: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    tempShipNum: new NgcFormControl(),
    documentViewUpdateTableData: new NgcFormArray([]),
    copyNo: new NgcFormControl(),
    status: new NgcFormControl(),
    location: new NgcFormControl(),
    locationName: new NgcFormControl(),
    pouchFlt: new NgcFormControl(),
    deleteReason: new NgcFormControl(),
    remarks: new NgcFormControl(),
    importFlt: new NgcFormArray([]),
    exportFlt: new NgcFormArray([]),
    arrayList: new NgcFormArray([]),
  });

  popupCreateCopy: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });

  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private documentService: DocumentService, private router: Router,
    private element: ElementRef, private renderer: Renderer,
    private flightpouchService: FlightpouchService, private documentviewService: DocumentviewService,
    private flightpouchCpyReqAndCancelButtonService: flightpouchCpyReqAndCancelButtonService
  ) {
    super(appZone, appElement, appContainerElement);
    this.previousRoute = sessionStorage.getItem('previousRoute');
    sessionStorage.setItem('previousRoute', this.router.url);

    this.documentviewService.getAwb().subscribe(response => {
      console.log('updatedocument Screen :Inside  Subscription' + response.awb);
      this.updateDocumentForm.get('shipmentNumber').setValue(response.awb.split("/")[0]);
      this.copyNumFromDocView = response.awb.split("/")[1];
      this.flightIdFromDocView = response.awb.split("/")[2];
      this.scanRequest();
      this.updateDocumentForm.controls.shipmentNumber.disable();
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.saveIsDisabled = true;
    // this.printerDropdownAWB = this.createSourceParameter('AWB');
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.shipmentNumber.focus();
  }

  scanRequest() {
    let updateDocumentRequest: UpdateDocumentRequestDTO = new UpdateDocumentRequestDTO();
    if (this.updateDocumentForm.get("shipmentNumber").value === null) {
      this.shipmentNumber.focus();
      return;
    } else {
      this.shipmentNumberForRefernce = this.updateDocumentForm.get("shipmentNumber").value == null ? this.shipmentNumberForRefernce : this.updateDocumentForm.get("shipmentNumber").value;
      updateDocumentRequest.shipmentNumber = this.shipmentNumberForRefernce;
    }
    if (this.flightIdFromDocView != undefined) {
      updateDocumentRequest.flightId = this.flightIdFromDocView;
    }
    this.onTabDocumentViewUpdateSearch(updateDocumentRequest);
  }

  baseRequest() {
    let updateDocumentRequest: UpdateDocumentRequestDTO = new UpdateDocumentRequestDTO();
    updateDocumentRequest.shipmentNumber = this.shipmentNumberForRefernce;
    if (this.flightIdFromDocView != undefined) {
      updateDocumentRequest.flightId = this.flightIdFromDocView;
    }
    return updateDocumentRequest;
  }

  onTabDocumentViewUpdateSearch(request: any) {
    this.saveIsDisabled = true;
    this.showData = false;
    this.createCopyIsDisabled = true;

    // if (this.copyNumFromDocView != undefined) {
    //   updateDocumentRequest.copyNum = this.copyNumFromDocView;
    // }

    this.documentService.getUpdateDocumentData(request).subscribe(responseBean => {
      if (!this.refreshFormMessages(responseBean)) {
        this.exportFlt = responseBean.data[0].exportFlights;
        this.importFlt = responseBean.data[0].importFlights;
        this.updateDocumentForm.controls['exportFlt'].patchValue(this.exportFlt);
        this.updateDocumentForm.controls['importFlt'].patchValue(this.importFlt);
        this.updateDocumentForm.controls['documentViewUpdateTableData'].patchValue(responseBean.data);
        this.showData = true;

        this.openWindow.emit("openWindow");

        //Disable 'Save' and 'Create Barcode Copy' id Pouch is Finalized in which the document is
        let count = 0;
        responseBean.data.forEach(function (row) {
          if (row.pouchStatus != 'Finalized') {
            count++;
          }
        });
        if (count > 0) {                               // Pouch is Not Finalized , in which Document is there
          this.saveIsDisabled = false;
          this.createCopyIsDisabled = false;
          this.isPouchFinalized = false;
        } else {                                      // Pouch is Finalized , in which Document is there
          this.saveIsDisabled = true;
          this.createCopyIsDisabled = true;
          this.isPouchFinalized = true;
        }


        // ********* TO-TO : Pending With Madan Sir : On what basis the Create-Barcode-Copy is enabled and Disabled : Same concept in Flight-Pouch-Management Screen 'Copy-Request' Functionality
        if (!this.isPouchFinalized) {
          if (responseBean.data[0].isCopyRequired === 'Y') {
            this.createCopyIsDisabled = false;
          } else {
            this.createCopyIsDisabled = true;
          }
        }

        this.updateDocumentForm.get("shipmentNumber").setValue('');
      }
    },
      error => { this.showErrorStatus("export.unable.to.search"); }
    );
  }

  onCreateBarcodeCopy() {
    this.windowPrinter1.open();
    // this.popupCreateCopy.controls.printerdropdown.setValue('Demo - AWB');
  }

  CreateCopyData() {
    if (this.popupCreateCopy.get("printerdropdown").value == null) {
      this.showErrorStatus("expaccpt.select.printer.and.proceed");
      return;
    }
    let docView: UpdateDocumentRequestDTO = new UpdateDocumentRequestDTO();
    docView.flightId = this.updateDocumentForm.get(['documentViewUpdateTableData', 0, 'flightId']).value;
    docView.flightNumDate = this.updateDocumentForm.get(['documentViewUpdateTableData', 0, 'flightNumDate']).value;
    docView.shipmentId = this.updateDocumentForm.get(['documentViewUpdateTableData', 0, 'shipmentId']).value;
    docView.shipmentNumber = this.updateDocumentForm.get(['documentViewUpdateTableData', 0, 'shipmentNumber']).value;
    docView.status = "Received";
    docView.copyNum = this.updateDocumentForm.get(['documentViewUpdateTableData', 0, 'copyNum']).value;
    docView.copyNo = this.updateDocumentForm.get(['documentViewUpdateTableData', 0, 'copyNum']).value;
    docView.printerName = this.popupCreateCopy.get("printerdropdown").value;

    this.documentService.getNewAwbCreateCopy(docView).subscribe(responseBean => {
      this.onTabDocumentViewUpdateSearch(this.baseRequest());
      this.windowPrinter1.hide();
      this.showSuccessStatus("export.copy.created.successfully");

    }, error => {
      this.showErrorStatus("export.unable.to.create.copy");
    });
  }

  onPrintPopup(controls) {
    if (0 !== controls.copyNum.value) {
      this.printAwbNum = controls.shipmentNumber.value + "/" + controls.copyNum.value
    } else {
      this.printAwbNum = controls.shipmentNumber.value;
    }
    this.awbNum = controls.shipmentNumber.value;
    // this.popupPrinterForm.controls.printerdropdown.setValue('Demo - AWB');
    this.windowPrinter.open();
  }

  onRePrintBarcodeCopy() {
    if (this.popupPrinterForm.get("printerdropdown").value == null) {
      this.showErrorStatus("expaccpt.select.printer.and.proceed");
      return;
    }
    let request: PrinterBO = new PrinterBO();
    request.awbNumBarcode = this.printAwbNum == null ? "" : this.printAwbNum;
    request.awbNumTextCode = this.printAwbNum == null ? "" : this.printAwbNum;
    request.awbNum = this.awbNum;
    request.flightNo = this.updateDocumentForm.get(['documentViewUpdateTableData', 0, 'flightNumDate']).value;
    request.status = "Received";
    request.printerName = this.popupPrinterForm.get("printerdropdown").value;

    this.flightpouchService.printAWB(request).subscribe(responseBean => {
      this.showSuccessStatus("export.barcode.copy.printed.successfully");
      this.windowPrinter.hide();
    }, error => {
      this.showErrorStatus("export.unable.reprint");
    });
  }

  updateDocumentPigeonHoleLoc() {
    let updatedDocViewList: UpdateDocumentRequestDTO[] = [];
    let docView: UpdateDocumentRequestDTO = new UpdateDocumentRequestDTO();

    updatedDocViewList = (this.updateDocumentForm.get('documentViewUpdateTableData') as NgcFormArray).getRawValue();

    this.documentService.updateAWBDocDetails(updatedDocViewList).subscribe(responseBean => {
      this.showSuccessStatus("export.successfully.updated.document");
      this.onTabDocumentViewUpdateSearch(this.baseRequest());

    }, error => { this.showErrorStatus("export.error.saving.document"); }
    );
  }

  public onDeleteShipmentRecord(controls, index) {
    if ((controls.deleteReasonCode.value == null || controls.deleteReasonCode.value == "")) {
      this.showFormControlErrorMessage((this.updateDocumentForm.get(['documentViewUpdateTableData', index, 'deleteReasonCode']) as NgcFormControl), 'Mandatory');
      return;
    }
    // **************** If Document to be deleted  is a Copy  : Delete Document-Copy *************
    if (controls.copyNum.value != 0) {
      this.showConfirmMessage('export.are.you.sure.to.delete')
        .then(fulfilled => {
          this.deleteDocumentCopy(controls);

        }).catch(reason => {
          this.flag = false;
        });
    }
    //****************** If Document to be deleted is ORIGINAL : Update Document ****************
    else {
      this.showConfirmMessage('export.are.you.sure.to.delete')
        .then(fulfilled => {
          this.updateDocumentOrignal(controls);

        }).catch(reason => {
          this.flag = false;
        });
    }
  }

  //************** Delete Documnet if its a COPY ****************/
  deleteDocumentCopy(controls) {
    let docView: UpdateDocumentRequestDTO = new UpdateDocumentRequestDTO();
    docView.shipmentId = controls.shipmentId.value;
    docView.shipmentNumber = controls.shipmentNumber.value;
    docView.copyNum = controls.copyNum.value;
    docView.flightNumDate = controls.flightNumDate.value;
    docView.docstatus = controls.docstatus.value;
    docView.deleteReasonCode = controls.deleteReasonCode.value;
    docView.deleteRemarks = controls.deleteRemarks.value;
    this.documentService.deleteDocumentCopy(docView).subscribe(responseBean => {
      // this.updateDocumentForm.get('shipmentNumber').reset();
      this.onTabDocumentViewUpdateSearch(this.baseRequest());
      this.showSuccessStatus("export.document.copy.successfully.deleted");
    }, error => { this.showErrorStatus("export.unable.to.delete"); }
    );
  }

  //************** Update Documnet When deleted : if its ORIGINAL ****************/
  updateDocumentOrignal(controls) {
    let docView: UpdateDocumentRequestDTO = new UpdateDocumentRequestDTO();
    docView.shipmentId = controls.shipmentId.value;
    docView.shipmentNumber = controls.shipmentNumber.value;
    docView.copyNum = controls.copyNum.value;
    docView.flightNumDate = controls.flightNumDate.value;
    docView.docstatus = 'Not Received';
    docView.pigeonHoleLocationId = null;
    docView.fltPouchId = null;
    docView.deleteReasonCode = controls.deleteReasonCode.value;
    docView.deleteRemarks = controls.deleteRemarks.value;
    docView.deleteFlag = '1'

    this.documentService.updateDocumentOrignal(docView).subscribe(responseBean => {
      console.log(JSON.stringify(responseBean.data))
      this.onTabDocumentViewUpdateSearch(this.baseRequest());
      this.showSuccessStatus("export.document.successfully.deleted");
    }, error => { this.showErrorStatus("export.unable.to.delete"); }
    );
  }

  getSelectedPrinter(event) {
    sessionStorage.setItem('selectedPrinter', JSON.stringify(event));
  }

  resetForm() {
    this.updateDocumentForm.get("shipmentNumber").setValue("");
  }



  public ngOnDestroy() { }

}
