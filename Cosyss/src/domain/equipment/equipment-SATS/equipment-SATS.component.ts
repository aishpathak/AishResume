import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, NgcReportComponent,
  PageConfiguration
} from 'ngc-framework';
import { FormArray, FormControl, AbstractControl, Validator, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { EquipmentService } from '../equipment.service';
import { ApplicationFeatures } from '../../common/applicationfeatures';

@Component({
  selector: 'app-equipment-SATS',
  templateUrl: './equipment-SATS.component.html',
  styleUrls: ['./equipment-SATS.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class EquipmentSATSComponent extends NgcPage implements OnInit {


  resp: any;
  isTable: boolean = false;
  reportParameters: any;

  private searchReturnAirlineForm: NgcFormGroup = new NgcFormGroup({
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    agent: new NgcFormControl(),
    equipmentType: new NgcFormControl(),
    equipmentreturnAirlinedetail: new NgcFormArray([
      new NgcFormGroup({
        agent: new NgcFormControl()
        , equipmentNumber: new NgcFormControl(),
        dropOffDateTime: new NgcFormControl(),
        collectionDate: new NgcFormControl(),
        blockTime: new NgcFormControl(),
        flight: new NgcFormControl(),
        staOrStd: new NgcFormControl(),
        dwellPeriod: new NgcFormControl(),
        pendingAmount: new NgcFormControl()

      })
    ])
  })

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private equipmentService: EquipmentService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }

  onSearch(event) {
    const search = this.searchReturnAirlineForm.getRawValue();
    this.searchReturnAirlineForm.patchValue(search);
    this.equipmentService.searchEquipmentReturnAirline(search).subscribe(data => {
      this.refreshFormMessages(data)
      this.resp = data.data;
      console.log('Work', this.resp);

      if (!this.resp) {
        this.isTable = false;
      }
      else {
        this.isTable = true;
        this.searchReturnAirlineForm.get(['equipmentreturnAirlinedetail']).patchValue(this.resp);
      }

    });

  }
  onReturnAirlineServiceReport() {
    this.reportParameters = new Object();
    if (this.searchReturnAirlineForm.get('fromDate').value) {
      this.reportParameters.fromDate = this.searchReturnAirlineForm.get('fromDate').value;
    } else {
      this.reportParameters.fromDate = '';
    }
    if (this.searchReturnAirlineForm.get('toDate').value) {
      this.reportParameters.toDate = this.searchReturnAirlineForm.get('toDate').value;
    } else {
      this.reportParameters.toDate = '';
    }
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.ULD_UldDwellTimeReportDemurageFee)) {
      this.reportParameters.isDemmurageFeeEnabled = true;
    }
    else {
      this.reportParameters.isDemmurageFeeEnabled = false;
    }
    this.reportParameters.Carrier = this.searchReturnAirlineForm.get('carrierCode').value;
    this.reportParameters.agent = this.searchReturnAirlineForm.get('agent').value;
    this.reportParameters.equipmentType = this.searchReturnAirlineForm.get('equipmentType').value;
    //this.reportParameters.userType = this.getUserProfile().userType;
    this.reportParameters.loggedInUser = this.getUserProfile().userLoginCode;
    this.reportWindow.open();
  }
}
