import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormControl } from 'ngc-framework';
import { ChangeAWB, ChangeHAWB } from '../awbManagement.shared';
import { AwbManagementService } from '../awbManagement.service';

@Component({
  selector: 'app-change-awb-hawb',
  templateUrl: './change-awb-hawb.component.html',
  styleUrls: ['./change-awb-hawb.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class ChangeAwbHawbComponent extends NgcPage {
  private ChangeOfAwbForm: NgcFormGroup = null;
  private showChangeAwbPartFlag: boolean;
  private showChangeHawbPartFlag: boolean;
  hawbInvalid: boolean = false;
  randomValue: number;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private awbService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.initialize();
  }

  public initialize() {
    this.ChangeOfAwbForm = new NgcFormGroup({
      shipmentNumber: new NgcFormControl(),
      newShipmentNumber: new NgcFormControl(),
      reasonOfChangeAwb: new NgcFormControl(),
      hawbNumber: new NgcFormControl(),
      newHawbNumber: new NgcFormControl(),
      reasonOfChangeHawb: new NgcFormControl(),
      changeOfAwb: new NgcFormControl()
    });
    this.showChangeAwbPartFlag = false;
    this.showChangeHawbPartFlag = false;
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.ChangeOfAwbForm.get('changeOfAwb').valueChanges.subscribe(newValue => {
      if (newValue === 'Change_Awb') {
        // this.ChangeOfAwbForm.reset();
        this.showChangeAwbPartFlag = true;
        this.showChangeHawbPartFlag = false;
      }
      if (newValue === 'Change_hawb') {
        // this.ChangeOfAwbForm.reset();
        this.showChangeAwbPartFlag = false;
        this.showChangeHawbPartFlag = true;
      }
    });
  }

  changeAwb() {
    const request = new ChangeAWB();
    request.shipmentNumber = this.ChangeOfAwbForm.get('shipmentNumber').value;
    request.newShipmentNumber = this.ChangeOfAwbForm.get('newShipmentNumber').value;
    request.reasonOfChangeAwb = this.ChangeOfAwbForm.get('reasonOfChangeAwb').value;
    this.awbService.changeAWBNumber(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.randomValue = Math.random();
        this.ChangeOfAwbForm.reset();
        this.showChangeAwbPartFlag = false;
        this.showChangeHawbPartFlag = false;
      }
    });
  }
  changeHawb() {
    if (this.hawbInvalid) {
      this.showErrorStatus('hawb.invalid');
      return;
    }
    const request = new ChangeHAWB();
    request.shipmentNumber = this.ChangeOfAwbForm.get('shipmentNumber').value;
    request.hawbNumber = this.ChangeOfAwbForm.get('hawbNumber').value;
    request.newHawbNumber = this.ChangeOfAwbForm.get('newHawbNumber').value;
    request.reasonOfChangeHawb = this.ChangeOfAwbForm.get('reasonOfChangeHawb').value;
    this.awbService.changeHAWBNumber(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.randomValue = Math.random();
        this.ChangeOfAwbForm.reset();
        this.showChangeAwbPartFlag = false;
        this.showChangeHawbPartFlag = false;
      }
    });
  }
  setAWBNumber(object) {
    if (object.code == null) {
      this.hawbInvalid = true;
      this.showErrorStatus('hawb.invalid');
    }
    else {
      this.hawbInvalid = false;
      this.ChangeOfAwbForm.get('hawbNumber').setValue(object.code);
    }
  }
}
