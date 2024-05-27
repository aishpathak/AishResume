import { InterfaceService } from '../interface.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationEntities } from '../../common/applicationentities';
import { ApplicationFeatures } from '../../common/applicationfeatures';

@Component({
  selector: 'app-incomingmessagelogdetails',
  templateUrl: './incomingmessagelogdetails.component.html',
  styleUrls: ['./incomingmessagelogdetails.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class IncomingmessagelogdetailsComponent extends NgcPage implements OnInit {
  subMessageParameter: {
  };
  message1: void;
  showTable = false;
  @ViewChild('messageLog') messageLog: NgcWindowComponent;
  processingErrorsArray: NgcFormArray;
  response1: any;
  processingerrorcheck = false
  showVCT: boolean = false;
  indexNumber: number;
  indexNumberDisplay: number;
  showIncomingMessage: any;
  showWindow = false;
  isHandledByHouse = false;
  isHawbBEnabled = false;
  isInterfaceFileNameEnabled = false;

  constructor(appZone: NgZone, appElement: ElementRef, private activatedRoute: ActivatedRoute,
    appContainerElement: ViewContainerRef, private interfaceService: InterfaceService) {
    super(appZone, appElement, appContainerElement);
  }

  private incomingmessage: NgcFormGroup = new NgcFormGroup({

    messageVersion: new NgcFormControl(),
    messageType: new NgcFormControl(),
    subMessageType: new NgcFormControl(),
    sequence: new NgcFormControl(),
    messageEndingIndicator: new NgcFormControl(),
    senderOriginAddress: new NgcFormControl(),
    interfacingSystem: new NgcFormControl(),
    channelName: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    messageStatus: new NgcFormControl('PROCESSED'),
    message: new NgcFormControl(),
    recipientAddress: new NgcFormControl(),
    messageDateTime: new NgcFormControl(),
    shipmentDate: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    messageFromDateTime: new NgcFormControl(),
    messageToDateTime: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),
    messageHeader: new NgcFormControl(),
    incomingMessages: new NgcFormArray([]),
    processingErrors: new NgcFormArray(
      [

      ]
    ),
    processingErrorsArray: new NgcFormArray([
      new NgcFormGroup({
        errorCode: new NgcFormControl(),
        message: new NgcFormControl(),
        lineItem: new NgcFormControl()
      })
    ])

  })

  ngOnInit() {

    super.ngOnInit();
    this.checkEnabledFeature();
    const forwardedData = this.getNavigateData(this.activatedRoute);
    this.incomingmessage.get('messageType').patchValue(forwardedData.messageType);
    this.incomingmessage.get('flightKey').patchValue(forwardedData.flightKey);
    this.incomingmessage.get('flightDate').patchValue(forwardedData.flightDate);
    this.incomingmessage.get('carrierCode').patchValue(forwardedData.carrierCode);
    this.incomingmessage.get('messageFromDateTime').patchValue(forwardedData.messageFromDateTime);
    this.onSearch()

  }

  onSearch() {
    let request = <NgcFormGroup>this.incomingmessage.getRawValue();

    this.interfaceService.getIncomingMessage(request).subscribe(response => {
      this.response1 = response.data;
      const resp = response.data;
      this.refreshFormMessages(response);
      if (!response.messageList) {
        this.incomingmessage.get('incomingMessages').patchValue(resp);
        this.showTable = true;
      } else {
        //this.showErrorStatus(response.messageList[0].message);
        if (response.messageList[0].message != null
          && response.messageList[0].message != '') {
          this.showErrorStatus(response.messageList[0].message);
        } else {
          this.showErrorStatus(response.messageList[0].code);
        }
      }

    });
  }

  onLinkClick(event) {
    this.showWindow = true;
    this.indexNumber = event.record.NGC_ROW_ID;
    this.indexNumberDisplay = Number(event.record.NGC_ROW_ID) + 1;
    this.messageLog.open()
    this.incomingmessage.get('message').setValue(event.record.message);
    this.showIncomingMessage = event.record.message;
    if (event.record.processingerrors) {
      this.incomingmessage.get('processingErrorsArray').setValue(event.record.processingerrors)
    }
    const processingerrors: NgcFormArray = this.response1[event.record.NGC_ROW_ID].processingErrors as NgcFormArray
    if (processingerrors.length != 0) {
      this.incomingmessage.get(['processingErrorsArray']).patchValue(processingerrors)
      this.processingerrorcheck = true
    }
    else {
      this.processingerrorcheck = false;
    }

  }
  onChange() {
    this.subMessageParameter = this.createSourceParameter(this.incomingmessage.get("messageType").value);
    if (this.incomingmessage.get("messageType").value == "IM18" || this.incomingmessage.get("messageType").value == "EX04") {
      this.showVCT = true;
    } else {
      this.showVCT = false;
    }
  }
  public onCancel(event) {
    this.navigateBack(this.incomingmessage.getRawValue());
  }

  onPrevious() {
    if (this.indexNumber > 0) {
      this.indexNumber = Number(this.indexNumber) - 1;
      this.indexNumberDisplay = Number(this.indexNumber) + 1;
      const incomingMessageList = (<NgcFormGroup>this.incomingmessage.get(['incomingMessages', this.indexNumber])).getRawValue();
      this.incomingmessage.get('message').setValue(incomingMessageList.message)
      if (incomingMessageList.processingErrors) {
        if (incomingMessageList.processingErrors.length != 0) {
          this.incomingmessage.get('processingErrorsArray').patchValue(incomingMessageList.processingErrors)
          this.processingerrorcheck = true
        }
        else {
          this.processingerrorcheck = false;
        }
      }
    }
  }
  onNext() {
    this.indexNumber = Number(this.indexNumber) + 1;
    if (this.indexNumber < (<NgcFormArray>this.incomingmessage.get(['incomingMessages'])).length) {
      this.indexNumberDisplay = Number(this.indexNumber) + 1;
      const incomingMessageList = (<NgcFormGroup>this.incomingmessage.get(['incomingMessages', this.indexNumber])).getRawValue();
      this.incomingmessage.get('message').setValue(incomingMessageList.message)
      if (incomingMessageList.processingErrors) {
        if (incomingMessageList.processingErrors.length != 0) {
          this.incomingmessage.get('processingErrorsArray').patchValue(incomingMessageList.processingErrors)
          this.processingerrorcheck = true
        }
        else {
          this.processingerrorcheck = false;
        }
      }
    } else {
      this.indexNumber = Number(this.indexNumber) - 1;
    }
  }

  onCloseWindow(event) {
    this.showWindow = false;
    this.indexNumberDisplay = 0;
  }

  /**
   * Method to check if shipment is handled by house/SB or master
   */
  onTabOutCheckHandledBy() {
    if (this.isHawbBEnabled && (this.incomingmessage.get('shipmentNumber').value !== null) && (this.incomingmessage.get('shipmentNumber').value.length == 11)) {
      let request = { shipmentNumber: this.incomingmessage.get('shipmentNumber').value }
      this.interfaceService.checkHandledByHouse(request).subscribe(response => {
        this.isHandledByHouse = false;
        if (!this.showResponseErrorMessages(response)) {
          if (response) {
            this.isHandledByHouse = true;
            this.incomingmessage.get('hawbNumber').patchValue('');
          }
        }
      });
    } else { this.isHandledByHouse = false; }
  }

  checkEnabledFeature() {
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.EDI_IncomingOutgoingLog_HAWB)) {
      this.isHawbBEnabled = true;
    }

    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.EDI_IncomingOutgoingLog_InterfaceFileName)) {
      this.isInterfaceFileNameEnabled = true;
    }
  }

}

