import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey, NgcCodeEditorComponent } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { InterfaceService } from '../interface.service';

@Component({
  selector: 'app-inboundedimessageprocess',
  templateUrl: './inboundedimessageprocess.component.html',
  styleUrls: ['./inboundedimessageprocess.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class InboundedimessageprocessComponent extends NgcPage implements OnInit {
  @ViewChild('codeEditor') codeEditor: NgcCodeEditorComponent;
  subMessageParameter: {
  };
  showContent = true
  showUpperCase = true
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private interfaceService: InterfaceService) {
    super(appZone, appElement, appContainerElement);
  }
  private incomingMessageProcess: NgcFormGroup = new NgcFormGroup(
    {
      shipmentNumber: new NgcFormControl(),
      shipmentDate: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      flightKey: new NgcFormControl(),
      messageType: new NgcFormControl(),
      subMessageType: new NgcFormControl(),
      incomingRequestMessage: new NgcFormControl(),
      outgoingResponseMessage: new NgcFormControl()
    })

  showInfo: null;

  ngOnInit() {
  }

  onSend() {

    let request = this.incomingMessageProcess.getRawValue();
    //let request = <NgcFormGroup>this.incomingMessageProcess.getRawValue();
    if (this.incomingMessageProcess.get("messageType").value == 'BOOKINGDETAILS' || this.incomingMessageProcess.get("messageType").value == 'FlightSchedulePublish' || this.incomingMessageProcess.get("messageType").value == 'OperationalFlightPublish') {
      request.messageType = 'ICMS';
    }
    this.showInfo = null;
    this.interfaceService.sendIncomingMessageProcess(request).subscribe(response => {
      const resp = response.data;
      if (!this.showResponseErrorMessages(response)) {
        if (resp.infoMessage) {
          this.showInfo = resp.infoMessage;
        }
        this.showSuccessStatus('g.operation.successful')
        this.showContent = false;
        if (this.incomingMessageProcess.controls.messageType.value == 'FWB') {
          this.incomingMessageProcess.controls.messageType.setValue('FWB')
          this.incomingMessageProcess.controls.incomingRequestMessage.reset()
        }
        else {
          this.incomingMessageProcess.reset()
        }
      }
      if (this.showResponseErrorMessages(response)) {



        response.messageList.forEach(element => {

          this.codeEditor.markLine(element.referenceId, element.referenceId)

        })


      }

    }, error => {
      this.showErrorStatus(error);
    });


  }
  onChange(event) {
    if (this.incomingMessageProcess.get("messageType").value == 'BOOKINGDETAILS' || this.incomingMessageProcess.get("messageType").value == 'FlightSchedulePublish' || this.incomingMessageProcess.get("messageType").value == 'OperationalFlightPublish') {
      document.getElementById("incomingRequestMessage").removeAttribute("upperCase");
    }
    else {
      document.getElementById("incomingRequestMessage").setAttribute("upperCase", "true");
    }
    if (this.incomingMessageProcess.get("messageType").value == 'BOOKINGDETAILS' || this.incomingMessageProcess.get("messageType").value == 'FlightSchedulePublish' || this.incomingMessageProcess.get("messageType").value == 'OperationalFlightPublish') {
      this.showUpperCase = false;
    } else {
      this.showUpperCase = true;
    }

    this.subMessageParameter = this.createSourceParameter(this.incomingMessageProcess.get("messageType").value);
  }
  public onCancel(event) {
    this.navigateBack(this.incomingMessageProcess.getRawValue());
  }



}