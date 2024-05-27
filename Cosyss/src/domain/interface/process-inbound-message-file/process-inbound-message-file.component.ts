import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcFileUploadComponent, NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey, NgcCodeEditorComponent, NgcFormControl, PageConfiguration, HTTPContentType } from 'ngc-framework';
import { InterfaceService } from '../interface.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-process-inbound-message-file',
  templateUrl: './process-inbound-message-file.component.html',
  styleUrls: ['./process-inbound-message-file.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ProcessInboundMessageFileComponent extends NgcPage implements OnInit {
  @ViewChild('fileUpload') fileUpload: NgcFileUploadComponent;
  msgType: string = '';
  messageFile: any = '';
  acceptedFileFormat: string = '.xlsx';
  fileType: string = 'EDI Message File';
  uploadedDocId: any;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private interfaceService: InterfaceService, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }

  private prcssInboundMsgFileForm = new NgcFormGroup({
    fileType: new NgcFormControl('EDI Message File'),
    messageType: new NgcFormControl(''),
    messageFile: new NgcFormControl(''),
    processingErrors: new NgcFormControl(''),
    acceptedFileFormat: new NgcFormControl(''),
    noOfMessagesAllowed: new NgcFormControl('50'),
    sampleFile: new NgcFormControl('')
  })

  onProcess() {
    this.prcssInboundMsgFileForm.get(['processingErrors']).reset();
    let request: any = new Object();
    if (this.fileType != '' && this.fileType == "Flight Schedule") {
      request.messageType = 'SSM';
    } else {
      request.messageType = this.msgType;
    }
    request.messageFile = this.messageFile;
    request.fileType = this.fileType;

    this.interfaceService.processInboundMsgFile(request).subscribe(response => {
      if (response.messageList && response.messageList.length > 0) {
        let responseErrors = [];
        response.messageList.forEach(message => {
          responseErrors.push(message.message + this.getI18NValue(message.code) + '\n');
        })
        this.prcssInboundMsgFileForm.get(['processingErrors']).reset();
        this.prcssInboundMsgFileForm.get(['processingErrors']).patchValue(responseErrors);
      } else {
        this.showSuccessStatus('g.operation.successful');
        this.clearForm();
      }
    }, error => {
      this.showErrorStatus(error);
    })
  }
  clearForm() {
    this.prcssInboundMsgFileForm.reset();
    this.resetFormMessages();

    this.reloadPage();
  }

  public onChooseDocuments(event, formatValue) {
    this.resetFormMessages();
    const file = event.file;
    let splits: string[] = file.documentName.split('.');
    if (this.fileType != '' && this.fileType == "Flight Schedule") {
      if ((formatValue.replace('.', '') != null || formatValue.replace('.', '') != '') &&
        formatValue.replace('.', '') != splits[1]) {
        this.showErrorStatus("edi.msgtype.filetype.not.same");
        this.fileUpload.clearFiles();
        return;
      }
    } else if (this.fileType != '') {
      if (this.msgType == '' || this.msgType == null) {
        this.showErrorStatus("Please select Message Type");
        this.fileUpload.clearFiles();
        return;
      } else if (splits[1] != this.msgType) {
        this.showErrorStatus("edi.msgtype.filetype.not.same");
        this.fileUpload.clearFiles();
        return;
      }
    }
    this.messageFile = file.document;
  }

  setMessageType(event) {
    this.resetFormMessages();
    if (event && event.code) {
      this.msgType = event.code;
      this.fileUpload.clearFiles();
      if (this.msgType != null && this.msgType != '') {
        this.acceptedFileFormat = '.' + this.msgType;
        this.prcssInboundMsgFileForm.get('acceptedFileFormat').patchValue(this.acceptedFileFormat);
        let request: any = new Object();
        if (this.msgType == 'ASM') {
          request.fileKey = "ASM_MSG_FILE";
          this.interfaceService.getUploadedDocId(request).subscribe(response => {
            if (response) {
              this.uploadedDocId = response;
            }
          })
        } else if (this.msgType == 'SSM') {
          request.fileKey = "SSM_MSG_FILE";
          this.interfaceService.getUploadedDocId(request).subscribe(response => {
            if (response) {
              this.uploadedDocId = response;
            }
          })
        }
      }
    }
  }

  onSelectFileType(event) {
    this.resetFormMessages();
    if (event) {
      this.fileType = event.code;
      this.fileUpload.clearFiles();
      if (this.fileType == "Flight Schedule") {
        this.msgType = '';
        this.acceptedFileFormat = '.xlsx';
        this.prcssInboundMsgFileForm.get('acceptedFileFormat').patchValue(this.acceptedFileFormat);
        let request: any = new Object();
        request.fileKey = "SSM_XLSX_FILE";
        this.interfaceService.getUploadedDocId(request).subscribe(response => {
          if (response) {
            this.uploadedDocId = response;
          }
        })
      }
    }
  }
  navigateMessageLog(event) {
    this.navigateTo(this.router, '/interface/incomingmessage', {
      messageType: this.msgType ? this.msgType : 'SSM',
      messageFromDateTime: NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.MINUTES)
    });
  }
  navigateDisplayFlightScedule(event) {
    this.navigateTo(this.router, '/flight/displayschedule', '');
  }
}
