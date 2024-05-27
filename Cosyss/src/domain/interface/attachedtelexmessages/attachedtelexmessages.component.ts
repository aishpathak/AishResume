import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { InterfaceService } from '../interface.service';
@Component({
  selector: 'app-attachedtelexmessages',
  templateUrl: './attachedtelexmessages.component.html',
  styleUrls: ['./attachedtelexmessages.component.scss']
})
export class AttachedtelexmessagesComponent extends NgcPage implements OnInit {

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private interfaceService: InterfaceService) {
    super(appZone, appElement, appContainerElement);
  }
  private telexmessages: NgcFormGroup = new NgcFormGroup(
    {
      carrier: new NgcFormControl(),
      flightNumber: new NgcFormControl(),
      flightKey: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      shipmentDate: new NgcFormControl(),
      message: new NgcFormControl()
    }
  )


  ngOnInit() {
  }
  onSend() {
    let request = <NgcFormGroup>this.telexmessages.getRawValue();
    this.interfaceService.sendTelexMessages(request).subscribe(response => {
      const resp = response.data;
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.operation.successful')
        this.telexmessages.reset()
      }


    }, error => {
      this.showErrorStatus(error);
    });


  }

}
