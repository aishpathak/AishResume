import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, NgcFormArray, NgcWindowComponent, PageConfiguration } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { AwbManagementService } from '../awbManagement.service'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-capture-damage',
  templateUrl: './capture-damage.component.html',
  styleUrls: ['./capture-damage.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class CaptureDamageComponent extends NgcPage {

  serialNumber: number = 1;
  deleteArray: any;

  /**
     * Initialize
     * @param appZone Ng Zone
     * @param appElement Element Ref
     * @param appContainerElement View Container Ref
     */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private awbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }


  private captureDamageForm: NgcFormGroup = new NgcFormGroup({
    captureDamageDetails: new NgcFormArray([
      new NgcFormGroup({
        sno: new NgcFormControl(this.serialNumber),
        natureOfDamage: new NgcFormControl(),
        piecesDamaged: new NgcFormControl(),
        severity: new NgcFormControl(),
        occurrence: new NgcFormControl(),
        selectDeleteIcon: new NgcFormControl()
      })
    ])
  })


  ngOnInit() {
  }

  addDamage() {
    const noOfRows = (<NgcFormArray>this.captureDamageForm.get('captureDamageDetails')).length;
    const lastRow = noOfRows ? (<NgcFormArray>this.captureDamageForm.get('captureDamageDetails')).controls[noOfRows - 1] : null;
    if (noOfRows > -1) {
      this.serialNumber = this.serialNumber + 1;
      (<NgcFormArray>this.captureDamageForm.get('captureDamageDetails')).addValue([
        {
          sno: this.serialNumber,
          natureOfDamage: "",
          piecesDamaged: "",
          severity: "",
          occurrence: "",
          selectDeleteIcon: ""
        }
      ]);
    }
  }

  onDelete(data) {

  }

}
