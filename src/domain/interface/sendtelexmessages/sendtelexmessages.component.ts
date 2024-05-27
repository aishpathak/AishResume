import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcInputComponent,
  NgcUtility, NgcWindowComponent, NgcContainerComponent, PageConfiguration, BaseBO
} from 'ngc-framework';
import { Validator, Validators } from '@angular/forms';
import { NgcFormControl } from 'ngc-framework';
import { StatusMessage } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { InterfaceService } from '../interface.service';

@Component({
  selector: 'app-sendtelexmessages',
  templateUrl: './sendtelexmessages.component.html',
  styleUrls: ['./sendtelexmessages.component.scss'],
  providers: [InterfaceService]
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class SendtelexmessagesComponent extends NgcPage implements OnInit {
  subMessageParameter: {
  };

  @ViewChild('showPopUpWindow') showPopUpWindow: NgcWindowComponent;
  isFromMail: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private interfaceService: InterfaceService) {
    super(appZone, appElement, appContainerElement);
  }


  private sendtelexrequest: NgcFormGroup = new NgcFormGroup({
    priority: new NgcFormControl(),
    destinationaddres: new NgcFormControl([
    ]),
    recipientaddress: new NgcFormControl([
    ]),
    subject: new NgcFormControl(),
    messagecontent: new NgcFormControl(),
    emailaddress: new NgcFormControl(),
    interfacingSystem: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    byImportPod: new NgcFormControl(),
    byExportManifest: new NgcFormControl(),
    byExportUpliftDetail: new NgcFormControl(),
    byExportOffload: new NgcFormControl()
  });

  onSendTelex() {
    let requestData: any = this.sendtelexrequest.getRawValue();
    requestData.destinationaddres = [];
    if (this.sendtelexrequest.get('destinationaddres') != null) {
      requestData.destinationaddres.push(this.sendtelexrequest.get('destinationaddres').value);
    }
    requestData.forMail = this.isFromMail;
    this.interfaceService.sendTelexMessage(requestData).subscribe(response => {
      if (response.success == true) {
        this.showSuccessStatus("edi.message.sent.successfully");
        const priority = this.sendtelexrequest.get('priority').value;
        this.sendtelexrequest.reset();
        this.sendtelexrequest.get('priority').patchValue(priority);
        this.isFromMail = false;
      } else {
        let error: any = response.messageList[0].code;
        this.showErrorMessage(error);
      }
    });
  }

  selectInterfaceTypes() {
    this.isFromMail = true;
    const priority = this.sendtelexrequest.get('priority').value;
    this.sendtelexrequest.reset();
    this.sendtelexrequest.get('priority').patchValue(priority);
    this.showPopUpWindow.open();
  }

  onPullData() {
    let requestValue: any = this.sendtelexrequest.getRawValue();
    if (!requestValue.byImportPod && !requestValue.byExportManifest
      && !requestValue.byExportUpliftDetail && !requestValue.byExportOffload) {
      this.showErrorStatus("edi.select.atleast.one.checkbox");
      return;
    }
    this.interfaceService.pullMailTelexMessage(requestValue).subscribe(data => {
      if (data.data) {
        this.sendtelexrequest.get('recipientaddress').patchValue(data.data.recipientaddress);
        this.sendtelexrequest.get('destinationaddres').patchValue(data.data.destinationaddres.toString());
        this.sendtelexrequest.get('messagecontent').patchValue(data.data.messagecontent);
        this.sendtelexrequest.get('interfacingSystem').patchValue(data.data.interfacingSystem);
        this.sendtelexrequest.get('subject').patchValue(data.data.subject);
        this.sendtelexrequest.get('emailaddress').patchValue(data.data.emailaddress);
        this.showPopUpWindow.close();
      } else {
        let error: any = data.messageList[0].code;
        this.showErrorMessage(error);
      }
    })
  }

  onClickCheckBox(item) {
    if (item === 'POD') {
      this.sendtelexrequest.get('byExportManifest').patchValue(false);
      this.sendtelexrequest.get('byExportUpliftDetail').patchValue(false);
      this.sendtelexrequest.get('byExportOffload').patchValue(false);
    } else if (item === 'MAN') {
      this.sendtelexrequest.get('byImportPod').patchValue(false);
      this.sendtelexrequest.get('byExportUpliftDetail').patchValue(false);
      this.sendtelexrequest.get('byExportOffload').patchValue(false);
    } else if (item === 'UPD') {
      this.sendtelexrequest.get('byImportPod').patchValue(false);
      this.sendtelexrequest.get('byExportManifest').patchValue(false);
      this.sendtelexrequest.get('byExportOffload').patchValue(false);
    } else {
      this.sendtelexrequest.get('byImportPod').patchValue(false);
      this.sendtelexrequest.get('byExportManifest').patchValue(false);
      this.sendtelexrequest.get('byExportUpliftDetail').patchValue(false);
    }
  }

  onCancel() {
    this.showPopUpWindow.close();
  }

}
