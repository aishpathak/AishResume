import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcInputComponent,
  NgcUtility, NgcWindowComponent, NgcContainerComponent, PageConfiguration, BaseBO
} from 'ngc-framework';
import { GetFlightId } from './../../export/export.sharedmodel';
import { Validator, Validators } from '@angular/forms';
import { NgcFormControl } from 'ngc-framework';
import { StatusMessage } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { InterfaceService } from '../interface.service';

@Component({
  selector: 'app-resendmessages',
  templateUrl: './resendmessages.component.html',
  styleUrls: ['./resendmessages.component.scss'],
  providers: [InterfaceService]
})


@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})


export class ResendmessagesComponent extends NgcPage implements OnInit {
  showOtherAddress: boolean = false;
  hideButton: boolean = true;
  flightIdforDropdown: any;
  private resendMessageSearch: NgcFormGroup = new NgcFormGroup({
    messagesType: new NgcFormControl(),
    subMessageType: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    carrier: new NgcFormControl(),
    interfacingsystem: new NgcFormControl(),
    destinationaddres: new NgcFormControl(),
    recipientaddress: new NgcFormControl(),
    resenderEmailAddress: new NgcFormControl(),
    flightSegmentId: new NgcFormControl()
  });





  response: any;

  ngAfterViewInit() {

    super.ngAfterViewInit();

    this.resendMessageSearch.get('flightDate').valueChanges
      .subscribe(changedValue => {
        // this.getFlightId();
        console.log(changedValue);
        this.flightIdforDropdown =
          this.createSourceParameter(this.resendMessageSearch.get('flightKey').value,
            this.resendMessageSearch.get('flightDate').value);
      });

    this.resendMessageSearch.get('flightKey').valueChanges
      .subscribe(changedValue => {
        // this.getFlightId();
        if (this.resendMessageSearch.get('flightDate').value !== null) {
          this.flightIdforDropdown =
            this.createSourceParameter(this.resendMessageSearch.get('flightKey').value,
              this.resendMessageSearch.get('flightDate').value);
        }
      });


  }

  private resendMessageResponse: NgcFormGroup = new NgcFormGroup({
    emailAddress: new NgcFormControl([
    ]),
    telexAddress: new NgcFormControl([
    ]),
    priority: new NgcFormControl([
    ]),
    originAddress: new NgcFormControl([
    ]),
    groupAddress: new NgcFormControl([
    ]),
    message: new NgcFormControl(),
    interfacemap: new NgcFormControl([
    ]),
    messageType: new NgcFormControl(),
    messageSubType: new NgcFormControl()
  });

  subMessageParameter: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private interfaceService: InterfaceService) {
    super(appZone, appElement, appContainerElement);
  }

  onResend() {
    let destinationaddress: any = this.resendMessageSearch.get('destinationaddres').value;
    if ((this.resendMessageSearch.get('destinationaddres').value != null ||
      this.resendMessageSearch.get('recipientaddress').value != null ||
      this.resendMessageSearch.get('resenderEmailAddress').value != null) && this.resendMessageSearch.get('interfacingsystem').value == null) {
      this.showErrorMessage("edi.enter.interface.system.name");
      return;
    }
    if (destinationaddress != null) {
      if (destinationaddress.length > 1) {
        this.showErrorMessage("edi.enter.one.sender.address");
        return;
      }
    }

    if (this.resendMessageSearch.get("messagesType").value == null) {
      this.showErrorMessage("edi.enter.message.type");
      return;


    } else {
      if (this.resendMessageSearch.get("messagesType").value == "FSU") {
        if (this.resendMessageSearch.get("subMessageType").value == null) {
          this.showErrorMessage("edi.enter.sub.message.type");
          return;
        }
      }
    }
    this.interfaceService.sendResendMessage(this.resendMessageSearch.getRawValue()).subscribe(data => {
      if (data.success == true) {
        this.showSuccessStatus("edi.message.resend.successful");
      } else {
        this.showErrorMessage(data.messageList[0].code);
      }
    });
  }

  ngOnInit() {

    const transferData = this.getNavigateData(this.activatedRoute);
    console.log("transferred data ", transferData);
    try {
      if (transferData !== null && transferData !== undefined) {
        this.resendMessageSearch.patchValue(transferData);
        this.onSearch();
      }
    } catch (e) { }
  }
  onChange() {

    this.subMessageParameter = this.createSourceParameter(this.resendMessageSearch.get("messagesType").value);

  }
  onSearch() {

    this.interfaceService.getResendMessage(this.resendMessageSearch.getRawValue()).subscribe(response => {
      this.response = response;
      if (response != null) {
        this.setData();
      }

    }

    )
  }


  setData() {
    this.resendMessageResponse.controls.emailAddress.patchValue(this.response.emailAddress);
    // (this.resendMessageResponse.get('emailAddress').patchValue(this.response.emailAddress));
    this.resendMessageResponse.controls.originAddress.patchValue(this.response.originAddress);
    this.resendMessageResponse.controls.priority.patchValue(this.response.priority);
    this.resendMessageResponse.controls.telexAddress.patchValue(this.response.telexAddress);
    this.resendMessageResponse.controls.groupAddress.patchValue(this.response.groupAddress);
    this.resendMessageResponse.controls.message.patchValue(this.response.messagelog);
    this.resendMessageResponse.controls.interfacemap.patchValue(this.response.interfacemap);
    this.resendMessageResponse.controls.messageSubType.setValue(this.resendMessageSearch.controls.subMessageType.value);
    this.resendMessageResponse.controls.messageType.setValue(this.resendMessageSearch.controls.messagesType.value);
    // this.resendMessageResponse.controls.interfacemap.patchValue(this.response.interfacemap);
  }

  onSend() {
    this.setData();

    let validaddresses = this.resendMessageResponse.get(["interfacemap"]).value.filter((element) => element.canResend == 1);
    this.resendMessageResponse.controls.interfacemap.setValue(validaddresses);
    this.interfaceService.sendResendMessage(this.resendMessageResponse.getRawValue()).subscribe(response => {
      let success: any;
      success = response;
      if (success == true) {

        this.showSuccessStatus("edi.service.requested.completed.successfully");

      } else {
        this.showErrorMessage("edi.unable.resend.message");
      }
    });
  }

  showOtherAddresses() {
    this.showOtherAddress = true;
    this.hideButton = false;
    this.retrieveDropDownListRecords('SELECT_INTERFACE_TYPES').subscribe(data => {
      data.forEach(value => {
        if (value.desc == 'ARINC') {
          this.resendMessageSearch.get('interfacingsystem').patchValue(value.code);
        }
      })
    });


  }

  onCancel(event) {
    this.navigateHome();
  }

}


