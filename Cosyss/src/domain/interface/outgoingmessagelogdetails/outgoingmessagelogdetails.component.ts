import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey, NgcCodeEditorComponent } from 'ngc-framework';
import { NgcFormControl, PageConfiguration, NgcReportComponent } from 'ngc-framework';
import { InterfaceService } from '../interface.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationEntities } from '../../common/applicationentities';
import { ApplicationFeatures } from '../../common/applicationfeatures';

@Component({
  selector: 'app-outgoingmessagelogdetails',
  templateUrl: './outgoingmessagelogdetails.component.html',
  styleUrls: ['./outgoingmessagelogdetails.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class OutgoingmessagelogdetailsComponent extends NgcPage implements OnInit {
  form: any;
  resp: any;
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @ViewChild('messageLog') messageLog: NgcWindowComponent;
  @ViewChild('messageLogEdit') messageLogEdit: NgcWindowComponent;
  @ViewChild('codeEditor') codeEditor: NgcCodeEditorComponent;
  private subMessageParameter: {};
  showTable = false
  response1: any;
  processingerrorcheck = false
  indexNumber: number;
  indexNumberDisplay: number;
  showWindow = false;
  transferData: any;
  showEventLog = false;
  carrierCode: string;
  flightNumber: string;
  flightDate: string;
  flightKey: string;
  reportParameters: any;
  codeEditFlag: boolean;
  isHandledByHouse = false;
  isHawbBEnabled = false;
  isInterfaceFileNameEnabled = false;
  // private activatedRoute: ActivatedRoute;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private interfaceService: InterfaceService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {

    super(appZone, appElement, appContainerElement);

  }
  private outgoingmessage: NgcFormGroup = new NgcFormGroup({

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
    messageStatus: new NgcFormControl(),
    message: new NgcFormControl(),
    eventName: new NgcFormControl(),
    eventLogid: new NgcFormControl(),
    recipientAddress: new NgcFormControl(),
    messageDateTime: new NgcFormControl(),
    createdBy: new NgcFormControl(),
    shipmentDate: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    messageFromDateTime: new NgcFormControl(),
    messageToDateTime: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),
    messageHeader: new NgcFormControl(),
    outgoingMessages: new NgcFormArray([
      new NgcFormGroup({
        sequenceNumber: new NgcFormControl(),
        messageType: new NgcFormControl(),
        subMessageType: new NgcFormControl(),
        messageVersion: new NgcFormControl(),
        sequence: new NgcFormControl(),
        messageEndingIndicator: new NgcFormControl(),
        interfacingSystem: new NgcFormControl(),
        senderOriginAddress: new NgcFormControl(),
        recipientAddress: new NgcFormControl(),
        messageDateTime: new NgcFormControl(),
        createdBy: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        messageHeader: new NgcFormControl(),
        messageStatus: new NgcFormControl(),
        eventName: new NgcFormControl(),
        eventLogid: new NgcFormControl(),
        processingErrors: new NgcFormArray(
          [
          ]),


      })
    ]),
    processingErrorsArray: new NgcFormArray([
      new NgcFormGroup({
        errorCode: new NgcFormControl(),
        message: new NgcFormControl(),
        lineItem: new NgcFormControl()
      })
    ])

  })
  // private outgoing: NgcFormGroup = new NgcFormGroup({
  //   messageVersion: new NgcFormControl(),
  //   messageType: new NgcFormControl(),
  //   subMessageType: new NgcFormControl(),
  //   sequence: new NgcFormControl(),
  //   messageEndingIndicator: new NgcFormControl(),
  //   senderOriginAddress: new NgcFormControl(),
  //   interfacingSystem: new NgcFormControl(),
  //   channelName: new NgcFormControl(),
  //   shipmentNumber: new NgcFormControl(),
  //   carrierCode: new NgcFormControl(),
  //   flightKey: new NgcFormControl(),
  //   messageStatus: new NgcFormControl(),
  //   message: new NgcFormControl(),
  //   recipientAddress: new NgcFormControl(),
  //   messageDateTime: new NgcFormControl(),
  //   shipmentDate: new NgcFormControl(),
  //   flightDate: new NgcFormControl(),
  //   messageFromDateTime: new NgcFormControl(),
  //   messageToDateTime: new NgcFormControl(),

  // processingErrors: new NgcFormArray(
  //   [
  //     new NgcFormGroup({}),
  //   ]),





  // });

  ngOnInit() {
    super.ngOnInit()
    this.checkEnabledFeature();
    this.transferData = this.getNavigateData(this.activatedRoute);
    this.outgoingmessage.controls.messageType.valueChanges.subscribe(
      (newValue) => {
        this.subMessageParameter = this.createSourceParameter(this.outgoingmessage.get("messageType").value);
      });

    if (this.transferData) {
      this.flightKey = this.transferData.flightKey;
      this.flightDate = this.transferData.flightOriginDate;
      this.carrierCode = this.flightKey.substring(0, 2);
      this.flightNumber = this.flightKey.substring(2, 6);
      this.outgoingmessage.controls["carrierCode"].setValue(this.carrierCode);
      this.outgoingmessage.controls["flightKey"].setValue(this.flightNumber);
      this.outgoingmessage.controls["flightDate"].setValue(this.flightDate);

      this.onSearch();
    }
  }
  onSearch() {
    let request = <NgcFormGroup>this.outgoingmessage.getRawValue();
    this.interfaceService.getOutgoingMessage(request).subscribe(response => {
      this.resp = response.data;

      const resp = response.data;

      //   if (resp) {
      //     this.outgoingmessage.get('outgoingMessages').patchValue(resp.outgoingMessages);



      //   }

      // });

      if (!this.showResponseErrorMessages(response)) {

        this.outgoingmessage.get('outgoingMessages').patchValue(resp);
        this.response1 = response.data;
        this.showTable = true

      }
    }, error => {
      this.showErrorStatus(error);
    });


  }
  onLinkClick(event) {
    if (event.column === 'messageType') {
      this.showWindow = true;
      this.indexNumber = event.record.NGC_ROW_ID;
      this.indexNumberDisplay = Number(event.record.NGC_ROW_ID) + 1;
      this.outgoingmessage.get(['processingErrorsArray']).reset()
      if (event.record.messageType === 'TSM') {
        this.codeEditFlag = true;
      } else {
        this.codeEditFlag = false;
      }
      this.messageLog.open()
      this.outgoingmessage.get('message').setValue(event.record.message)

      const processingerrors: NgcFormArray = this.response1[event.record.NGC_ROW_ID].processingErrors as NgcFormArray
      if (processingerrors.length != 0) {

        this.outgoingmessage.get(['processingErrorsArray']).patchValue(processingerrors)

        this.processingerrorcheck = true

      }
      else {
        this.processingerrorcheck = false;
      }
      // this.async(() => {
      //   this.codeEditor.markLine(1, 4);
      // });
    }
    if (event.column === 'edit') {
      this.showWindow = false;
      this.showEventLog = true;
      this.indexNumber = event.record.NGC_ROW_ID;
      this.indexNumberDisplay = Number(event.record.NGC_ROW_ID) + 1;
      this.outgoingmessage.get(['processingErrorsArray']).reset()
      this.messageLogEdit.open();

      this.outgoingmessage.get('eventName').setValue(event.record.eventName);
      this.outgoingmessage.get('eventLogid').setValue(event.record.eventLogid);

    }
  }

  public onCancel(event) {
    this.navigateBack(this.outgoingmessage.getRawValue());
  }

  redirectToTSMMessage() {
    this.navigateTo(this.router, 'interface/tsmmessagemanualpush', "");
  }



  onPrevious() {
    this.processingerrorcheck = false;
    if (this.indexNumber > 0) {
      this.indexNumber = Number(this.indexNumber) - 1;
      this.indexNumberDisplay = Number(this.indexNumber) + 1;
      const incomingMessageList = (<NgcFormGroup>this.outgoingmessage.get(['outgoingMessages', this.indexNumber])).getRawValue();
      this.outgoingmessage.get('message').setValue(incomingMessageList.message)
      if (incomingMessageList.processingErrors) {
        if (incomingMessageList.processingErrors.length != 0) {
          this.outgoingmessage.get('processingErrorsArray').patchValue(incomingMessageList.processingErrors)
          this.processingerrorcheck = true
        }
        else {
          this.processingerrorcheck = false;
        }
      }
    }
  }
  onNext() {
    this.processingerrorcheck = false;
    this.indexNumber = Number(this.indexNumber) + 1;
    if (this.indexNumber < (<NgcFormArray>this.outgoingmessage.get(['outgoingMessages'])).length) {
      this.indexNumberDisplay = Number(this.indexNumber) + 1;
      const incomingMessageList = (<NgcFormGroup>this.outgoingmessage.get(['outgoingMessages', this.indexNumber])).getRawValue();
      this.outgoingmessage.get('message').setValue(incomingMessageList.message)
      if (incomingMessageList.processingErrors) {
        if (incomingMessageList.processingErrors.length != 0) {
          this.outgoingmessage.get('processingErrorsArray').patchValue(incomingMessageList.processingErrors)
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
    this.showEventLog = false;
    this.codeEditFlag = false;
  }
  // markLine() {
  //   this.codeEditor.markLine(1, 2);
  // }

  onprint() {
    this.reportParameters = new Object();
    if (this.outgoingmessage.get('interfacingSystem').value) {
      this.reportParameters.interfacingSystem = this.outgoingmessage.get('interfacingSystem').value;
    }
    if (this.outgoingmessage.get('messageType').value) {
      this.reportParameters.messageType = this.outgoingmessage.get('messageType').value;
    }
    if (this.outgoingmessage.get('subMessageType').value) {
      this.reportParameters.subMessageType = this.outgoingmessage.get('subMessageType').value;
    }
    if (this.outgoingmessage.get('messageStatus').value) {
      this.reportParameters.messageStatus = this.outgoingmessage.get('messageStatus').value;
    }
    if (this.outgoingmessage.get('messageFromDateTime').value) {
      this.reportParameters.messageFromDateTime = this.outgoingmessage.get('messageFromDateTime').value;
    }
    if (this.outgoingmessage.get('messageToDateTime').value) {
      this.reportParameters.messageToDateTime = this.outgoingmessage.get('messageToDateTime').value;
    }
    if (this.outgoingmessage.get('senderOriginAddress').value) {
      this.reportParameters.senderOriginAddress = this.outgoingmessage.get('senderOriginAddress').value;
    }
    if (this.outgoingmessage.get('carrierCode').value) {
      this.reportParameters.carrierCode = this.outgoingmessage.get('carrierCode').value;
    }
    if (this.outgoingmessage.get('flightKey').value) {
      this.reportParameters.flightKey = this.outgoingmessage.get('flightKey').value;
    }
    if (this.outgoingmessage.get('flightDate').value) {
      this.reportParameters.flightDate = this.outgoingmessage.get('flightDate').value;
    }
    if (this.outgoingmessage.get('shipmentNumber').value) {
      this.reportParameters.shipmentNumber = this.outgoingmessage.get('shipmentNumber').value;
    }
    this.reportParameters.tenantID = NgcUtility.getTenantConfiguration().airportCode;
    this.reportWindow.open();
  }

  sendTsm(message) {
    let incomingMessageList;
    this.processingerrorcheck = false;
    this.indexNumber = Number(this.indexNumber);
    if (this.indexNumber < (<NgcFormArray>this.outgoingmessage.get(['outgoingMessages'])).length) {
      this.indexNumberDisplay = Number(this.indexNumber);
      incomingMessageList = (<NgcFormGroup>this.outgoingmessage.get(['outgoingMessages', this.indexNumber])).getRawValue();
      incomingMessageList.message = message.value;
      this.outgoingmessage.get('message').setValue(message.value)
      if (incomingMessageList.processingErrors) {
        if (incomingMessageList.processingErrors.length != 0) {
          message.value
          this.outgoingmessage.get('processingErrorsArray').setValue(incomingMessageList.processingErrors)
          this.processingerrorcheck = true
        }
        else {
          this.processingerrorcheck = false;
        }
      }
    } else {
      this.indexNumber = Number(this.indexNumber);
    }

    this.interfaceService.ediAndSendTsm(incomingMessageList).subscribe(response => {
      this.showSuccessStatus("g.completed.successfully");
    }, error => {
      this.showErrorStatus(error);
    });
  }

  onChange() {
    this.outgoingmessage.get('subMessageType').setValue(null);
    this.subMessageParameter = this.createSourceParameter(this.outgoingmessage.get("messageType").value);
  }

  /**
   * Method to check if shipment is handled by house/SB or master
   */
  onTabOutCheckHandledBy() {
    if (this.isHawbBEnabled && (this.outgoingmessage.get('shipmentNumber').value !== null) && (this.outgoingmessage.get('shipmentNumber').value.length == 11)) {
      let request = { shipmentNumber: this.outgoingmessage.get('shipmentNumber').value }
      this.interfaceService.checkHandledByHouse(request).subscribe(response => {
        this.isHandledByHouse = false;
        if (!this.showResponseErrorMessages(response)) {
          if (response) {
            this.isHandledByHouse = true;
            this.outgoingmessage.get('hawbNumber').patchValue('');
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
