import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, PageConfiguration,
   
} from 'ngc-framework';

@Component({
  selector: 'ngc-acceptance-weighing-cargo-details',
  templateUrl: './acceptance-weighing-cargo-details.component.html',
  styleUrls: ['./acceptance-weighing-cargo-details.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class AcceptanceWeighingCargoDetailsComponent extends NgcPage {
  private form: NgcFormGroup = new NgcFormGroup({
    awbNumber: new NgcFormControl(),
    eAcceptanceType: new NgcFormControl(),
    serviceNumber: new NgcFormControl(),
    svc: new NgcFormControl(),
    anotherAwbNumber: new NgcFormControl(),
    acceptedPieces: new NgcFormControl(),
    acceptedWeight: new NgcFormControl(),
    weightDifference: new NgcFormControl(),
    destination: new NgcFormControl(),
    carrier: new NgcFormControl(),
    shc: new NgcFormControl(),
    uldBup: new NgcFormControl(),
    screenedPieces: new NgcFormControl(),
    dryIceWeight: new NgcFormControl(),
    weighingScale: new NgcFormControl(),
    dateTime: new NgcFormControl(),
    unitCode1: new NgcFormControl(),
    unitCode2: new NgcFormControl(),
    volumeCode1: new NgcFormControl(),
    volumeCode2: new NgcFormControl(),
    totalVolumetricWeight: new NgcFormControl('0.00'),
    fwbDetails: new NgcFormArray([
      new NgcFormGroup
        ({
          pieces: new NgcFormControl(2),
          length: new NgcFormControl('300CM'),
          width: new NgcFormControl('250CM'),
          height: new NgcFormControl('500CM'),
          volume: new NgcFormControl('100.0KG')
        })
    ]),
    actualDetails: new NgcFormArray([
      new NgcFormGroup
        ({
          length: new NgcFormControl('300CM'),
          width: new NgcFormControl('250CM'),
          height: new NgcFormControl('500CM'),
          pieces: new NgcFormControl(2),
          volume: new NgcFormControl('100.0KG')
        })
    ]),
    stopCheckDetails: new NgcFormArray([
      new NgcFormGroup
        ({
          details: new NgcFormControl('E-AWB SHIPMENT/ ACAS SHIPMENT: FWB DOES NOT EXIST. INFORM AGENT TO SEND FWB'),
        })
    ]),
    warningCheck: new NgcFormArray([
      new NgcFormGroup
        ({
          details: new NgcFormControl('LATE LODGE-IN CHARGES EXIST.COLLECT CHARGES.'),
          status: new NgcFormControl()
        })
    ]),
    remark: new NgcFormArray([
      new NgcFormGroup
        ({
          remarkType: new NgcFormControl('AGENT'),
          details: new NgcFormControl('POOR PACKAGING.TORN MARK FOUND. RETAPED BY AGT')
        })
    ])
  });
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }
  ngOnInit() {
  }
  /**
  * On Destroy
  */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
