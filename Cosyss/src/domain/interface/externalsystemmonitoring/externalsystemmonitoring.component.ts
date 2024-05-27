import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { InterfaceService } from '../interface.service';
@Component({
  selector: 'app-externalsystemmonitoring',
  templateUrl: './externalsystemmonitoring.component.html',
  styleUrls: ['./externalsystemmonitoring.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ExternalsystemmonitoringComponent extends NgcPage implements OnInit {


  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private interfaceService: InterfaceService) {
    super(appZone, appElement, appContainerElement);
  }

  private externalSystem: NgcFormGroup = new NgcFormGroup(
    {
      name: new NgcFormControl(),
      purpose: new NgcFormControl(),
      status: new NgcFormControl(),
      hourlyIncomingMessageSuccessCount: new NgcFormControl(),
      hourlyIncomingMessageFailedCount: new NgcFormControl(),
      hourlyOutgoingMessageSuccessCount: new NgcFormControl(),
      hourlyOutgoingMessageFailedCount: new NgcFormControl(),
      todayIncomingMessageSuccessCount: new NgcFormControl(),
      todayIncomingMessageFailedCount: new NgcFormControl(),

      todayOutgoingMessageSuccessCount: new NgcFormControl(),
      todayOutgoingMessageFailedCount: new NgcFormControl(),
      incomingMessageAverageResponseTime: new NgcFormControl(),
      outgoingMessageAverageResponseTime: new NgcFormControl(),


      incomingMessageLastUpdatedTime: new NgcFormControl(),

      outgoingMessageLastUpdatedTime: new NgcFormControl(),


      externalSystemList: new NgcFormArray([])
    }
  )


  ngOnInit() {
    let request = <NgcFormGroup>this.externalSystem.getRawValue();
    this.interfaceService.getMonitoringExternalInterface(request).subscribe(response => {
      const resp = response.data;
      if (resp) {
        this.externalSystem.get('externalSystemList').patchValue(resp);

      }

    });

  }
  onRefresh() {
    let request = <NgcFormGroup>this.externalSystem.getRawValue();
    this.interfaceService.getMonitoringExternalInterface(request).subscribe(response => {
      const resp = response.data;
      if (resp) {
        this.externalSystem.get('externalSystemList').patchValue(resp);

      }

    })
  }
  public onCancel(event) {
    this.navigateBack(this.externalSystem.getRawValue());
  }

}