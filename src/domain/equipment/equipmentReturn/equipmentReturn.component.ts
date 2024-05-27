import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, NgcReportComponent,
  PageConfiguration
} from 'ngc-framework';
import { FormArray, FormControl, AbstractControl, Validator, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
//import {EquipmentReturn} from "../equipmentsharedModel";
import { EquipmentService } from '../equipment.service';
@Component({
  selector: 'app-equipmentReturn',
  templateUrl: './equipmentReturn.component.html',
  styleUrls: ['./equipmentReturn.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class EquipmentReturnComponent extends NgcPage implements OnInit {
  resp: any;
  isTable: boolean = false;
  reportParameters: any;

  private searchReleaseReturnForm: NgcFormGroup = new NgcFormGroup({
    terminalpoint: new NgcFormControl(),
    agent: new NgcFormControl(),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    equipmentType: new NgcFormControl(),
    equipmentNumber: new NgcFormControl(),
    dwellTimefrom: new NgcFormControl(),
    dwellTimeto: new NgcFormControl(),
    equipmentstatus: new NgcFormControl(),
    requestTransactionNumber: new NgcFormControl(),
    transactionNumber: new NgcFormControl(),
    carrier: new NgcFormControl(),
    requestedfromDate: new NgcFormControl(),
    requestedtoDate: new NgcFormControl(),
    equipmentreleasereturndetail: new NgcFormArray([
      new NgcFormGroup({
        releaseInfoID: new NgcFormControl(),
        equipmentNumber: new NgcFormControl(),
        agent: new NgcFormControl(),
        flightkey: new NgcFormControl(),
        flightdate: new NgcFormControl(),
        towedPD: new NgcFormControl(),
        releasedUser: new NgcFormControl(),
        driverID: new NgcFormControl(),
        tripNumber: new NgcFormControl(),
        released: new NgcFormControl(),
        delivered: new NgcFormControl(),
        delivery: new NgcFormControl(),
        returnedby: new NgcFormControl(),
        returned: new NgcFormControl(),
        dwellTime: new NgcFormControl(),
        status: new NgcFormControl(),
        select: new NgcFormControl()

      })
    ])
  })

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindow1') reportWindow1: NgcReportComponent;
  @ViewChild('showPhoto') showPhoto: NgcWindowComponent;
  @ViewChild("window") window: NgcWindowComponent;
  // @ViewChild('showPhotoPreview') showPhotoPreview: NgcPhotoPreviewComponent;
  photoEntityKey: any;
  enableButton: boolean = false;
  enableForceButton: boolean = false;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private equipmentService: EquipmentService) { super(appZone, appElement, appContainerElement); }

  ngOnInit() {
  }

  onSearch(event) {
    this.enableButton = false;
    this.enableForceButton = false;
    const search = this.searchReleaseReturnForm.getRawValue();
    if (!this.searchReleaseReturnForm.valid) {
      if (search.toDate == null && search.fromDate == null && search.equipmentNumber == null && search.dwellTimefrom == null
        && search.dwellTimeto == null && search.transactionNumber == null) {
        this.showErrorMessage("equipment.enter.request")
        return;
      }
      else if (search.fromDate != null && search.toDate == null) {
        this.showFormControlErrorMessage(<NgcFormControl>this.searchReleaseReturnForm.get('toDate'), 'equipment.required');
        return;
      }
      else if (search.fromDate == null && search.toDate != null) {
        this.showFormControlErrorMessage(<NgcFormControl>this.searchReleaseReturnForm.get('fromDate'), 'equipment.required');
        return;
      }
      else if (search.dwellTimefrom != null && search.dwellTimeto == null) {
        this.showFormControlErrorMessage(<NgcFormControl>this.searchReleaseReturnForm.get('dwellTimeto'), 'equipment.required');
        return;
      }
      else if (search.dwellTimefrom == null && search.dwellTimeto != null) {
        this.showFormControlErrorMessage(<NgcFormControl>this.searchReleaseReturnForm.get('dwellTimefrom'), 'equipment.required');
        return;
      }

    }
    this.searchReleaseReturnForm.patchValue(search);
    this.equipmentService.searchEquipmentReleaseReturn(search).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data.data;
      console.log('Work', this.resp);

      if (!this.resp) {
        this.isTable = false;
      }
      else {
        this.isTable = true;
        for (const eachRow of this.resp) {
          eachRow
        }
        this.searchReleaseReturnForm.get(['equipmentreleasereturndetail']).patchValue(this.resp);
      }
    });
  }

  onReqSummary(event) {
    this.window.open();
  }

  onForceReturn(event, index) {
    let releaseReturn = this.searchReleaseReturnForm.getRawValue();
    let equipmentNumber: any = [];
    let countEqup: number = 0;
    let countDelivered: number = 0;
    releaseReturn.equipmentreleasereturndetail.forEach(element => {
      if (element.select) {
        equipmentNumber.push(element);
      }
    });
    this.equipmentService.forceReturn(equipmentNumber).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.showSuccessStatus("equipment.operation.completed");
        this.onSearch(releaseReturn);
      }
    });

  }

  onReturn() {
    let releaseReturn = this.searchReleaseReturnForm.getRawValue();
    let equipmentNumber: any = [];
    releaseReturn.equipmentreleasereturndetail.forEach(element => {
      if (element.select) {
        equipmentNumber.push(element);
      }
    });
    this.equipmentService.return(equipmentNumber).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.showSuccessStatus("equipment.operation.completed");
        this.onSearch(releaseReturn);
      }
    });
    // }
  }

  onSelect(event, index) {
    let object = this.searchReleaseReturnForm.get(['equipmentreleasereturndetail', index]).value;
    let releaseReturn = this.searchReleaseReturnForm.getRawValue();
    let equipmentNumber: any = [];
    this.enableButton = false;
    this.enableForceButton = false;
    releaseReturn.equipmentreleasereturndetail.forEach(element => {
      if (element.select) {
        equipmentNumber.push(element);
      }
    });
    if (equipmentNumber.length > 1) {
      this.showErrorMessage("equipment.select.only.onerecord");
      return;
    }
    if (equipmentNumber.length > 0 && equipmentNumber[0].status == "PREPARED") {
      this.showErrorMessage("equipment.return.equipment");
      return;
    }
    if (equipmentNumber.length > 0 && equipmentNumber[0].status == "RETURNED") {
      this.showErrorMessage("equipment.equipment.number.return");
      return;
    }
    if (equipmentNumber[0].select) {
      if (equipmentNumber[0].delivered && !equipmentNumber[0].returned) {
        this.enableButton = true;
        this.enableForceButton = false;
      }

      else if (!equipmentNumber[0].delivered && !equipmentNumber[0].returned && equipmentNumber[0].released) {
        this.enableButton = false;
        this.enableForceButton = true;
      }
    }
  }
  onprint() {
    this.reportParameters = new Object();
    this.reportParameters.handlingarea = this.searchReleaseReturnForm.get('terminalpoint').value;
    this.reportParameters.customercode = this.searchReleaseReturnForm.get('agent').value;
    this.reportParameters.from = this.searchReleaseReturnForm.get('fromDate').value;
    this.reportParameters.to = this.searchReleaseReturnForm.get('toDate').value;
    this.reportParameters.equipment = this.searchReleaseReturnForm.get('equipmentNumber').value;
    this.reportParameters.dwelltimefrom = this.searchReleaseReturnForm.get('dwellTimefrom').value;
    this.reportParameters.dwelltimeto = this.searchReleaseReturnForm.get('dwellTimeto').value;
    this.reportParameters.equipmentstatus = this.searchReleaseReturnForm.get('equipmentstatus').value;
    this.reportParameters.equipmentType = this.searchReleaseReturnForm.get('equipmentType').value
    this.reportWindow.downloadReport();
  }

  printsummaryfullfillment() {
    if (!this.searchReleaseReturnForm.get('carrier').value || !this.searchReleaseReturnForm.get('requestedfromDate').value
      || !this.searchReleaseReturnForm.get('requestedtoDate').value) {
      return this.showErrorMessage('equipment.enter.mandatory.fields');
    }

    let a: any;
    let b: any;
    let days: any;
    if (this.searchReleaseReturnForm.get('requestedfromDate').value && this.searchReleaseReturnForm.get('requestedtoDate').value) {
      a = Math.abs(this.searchReleaseReturnForm.get('requestedtoDate').value.getTime() - this.searchReleaseReturnForm.get('requestedfromDate').value.getTime());
      b = Math.ceil(a / (1000 * 3600 * 24));
      if (b > 90) {
        this.showFormControlErrorMessage(<NgcFormControl>this.searchReleaseReturnForm.get('requestedfromDate'), 'equipment.error.noofdays');
        this.showFormControlErrorMessage(<NgcFormControl>this.searchReleaseReturnForm.get('requestedtoDate'), 'equipment.error.noofdays');
        return;
      }
    }
    this.reportParameters = new Object();
    if (this.searchReleaseReturnForm.get('carrier').value == 'BOTH') {
      this.reportParameters.carriergroup = "SQ,OAL";
    }
    else {
      this.reportParameters.carriergroup = this.searchReleaseReturnForm.get('carrier').value;
    }
    this.reportParameters.requestedDatefrom = this.searchReleaseReturnForm.get('requestedfromDate').value;
    this.reportParameters.requestedDateTo = this.searchReleaseReturnForm.get('requestedtoDate').value;
    this.reportWindow1.downloadReport();

  }

  onClose() {
    this.window.close();
    this.searchReleaseReturnForm.reset();
  }

}
