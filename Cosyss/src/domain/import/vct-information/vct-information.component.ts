import { CellsStyleClass } from './../../../shared/shared.data';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DocumentVerificationRequest, DocumentVerificationGroup, DgdAWBNumber, AwbPrintRequestList, EliElmSavRequest, SearchRegulation
} from './../import.shared';
import {
  NgcFormControl, NgcFormGroup, NgcFormArray, NgcPage,
  NgcWindowComponent, CellsRendererStyle, NgcReportComponent, NgcButtonComponent, NgcUtility, PageConfiguration, NgcPrinterComponent
} from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ImportService } from '../import.service';
import { trigger } from '@angular/animations';
import { VctInformationListRequest, VctInformationlist } from '../import.sharedmodel';
import { elementStart } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-vct-information',
  templateUrl: './vct-information.component.html',
  styleUrls: ['./vct-information.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class VctInformationComponent extends NgcPage implements OnInit {

  displayData: boolean;
  response: any;
  request: any;
  showImport: boolean = false;
  reportParameters: any = new Object();
  @ViewChild("reportWindowExcel") reportWindowExcel: NgcReportComponent;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }


  private form: NgcFormGroup = new NgcFormGroup({
    requestfor: new NgcFormControl(),
    vctNumber: new NgcFormControl(),
    vctDate: new NgcFormControl(),
    vtNumber: new NgcFormControl(),
    vtDate: new NgcFormControl(),
    vehicleRegistrationNumber: new NgcFormControl(),
    driverName: new NgcFormControl(),
    driverMobileNumber: new NgcFormControl(),
    driverLicenseNumber: new NgcFormControl(),
    driverAadharCard: new NgcFormControl(),
    vtNumberOfPieces: new NgcFormControl(),
    vtGrossWeight: new NgcFormControl(),
    agentCode: new NgcFormControl(),
    shc: new NgcFormControl(),
    vehicleEntryTime: new NgcFormControl(),
    vctInDoorNumber: new NgcFormControl(),
    vctInRemarks: new NgcFormControl(),
    vehicleExitTime: new NgcFormControl(),
    vctOutDoorNumber: new NgcFormControl(),
    vctOutRemarks: new NgcFormControl(),
    vctShipmentInformationlist: new NgcFormArray([]),

  });





  ngOnInit() {
    super.ngOnInit();
  }
  onChangeSearchData() {
    this.form.get("vctDate").reset();
    this.displayData = false;
  }

  onExportToExcel(event) {
    if (this.form.get("vctNumber").value) {
      this.reportParameters.VCTNumber = this.form.get("vctNumber").value;
      this.reportWindowExcel.reportParameters = this.reportParameters;
      this.reportWindowExcel.downloadReport();
    } else {
      this.showErrorMessage("enter.vct.details");
      return;
    }
  }

  onSearchVctList() {
    this.displayData = false;
    this.form.validate();
    if (this.form.controls.vctNumber.invalid) {

      this.showErrorMessage("enter.vct.details");
      return;
    }
    const request: VctInformationListRequest = new VctInformationListRequest();
    const rawData = this.form.getRawValue();
    request.vctNumber = this.form.get("vctNumber").value;
    request.vctDate = this.form.get("vctDate").value;
    console.log(rawData);
    this.resetFormMessages();
    this.importService.getVctInformationList(request).subscribe(
      data => {
        if (data.data == null) {
          this.form.get("vctShipmentInformationlist").patchValue({});
          this.form.get('vctDate').setValue("");
          this.showErrorMessage("CUST002");

        } else
          if (!this.showResponseErrorMessages(data)) {
            this.response = data.data;
            this.displayData = true;
            this.form.get("vctShipmentInformationlist").patchValue(this.response.vctShipmentInformationlist);
            console.log(this.form.get("vctShipmentInformationlist"));
            this.form.patchValue(this.response);
            this.showImport = this.response.type == "Import" ? true : false;
            if (this.response != null) {
              this.form.get('vctNumber').setValue(this.response.vctNumber);
              this.form.get('vctDate').setValue(this.response.vctDate);
              this.form.get('requestfor').setValue(this.showImport ? "IMPORT" : "EXPORT")
            }
          }

      }
    )
  };
  saveVCTIn() {
    const formData = this.form.getRawValue();
    formData.vctIn = true;
    formData.vctOut = false;
    if (formData.vctDate > formData.vehicleEntryTime) {
      this.showErrorMessage("enter.valid.vctdate");
      return;
    }

    else if (formData.vctInDoorNumber == null) {
      this.showErrorMessage("enter.vct.Door.Number");
      return;
    }

    this.onSave(formData);
  }
  saveVCTOut() {
    const formData = this.form.getRawValue();
    formData.vctIn = false;
    formData.vctOut = true;
    if (formData.vehicleEntryTime == null || formData.vehicleEntryTime > formData.vehicleExitTime) {
      this.showErrorMessage("enter.valid.dockindatetime");
      return;
    }

    else if (formData.vctOutDoorNumber == null) {
      this.showErrorMessage("enter.vct.Door.Number");
      return;
    }

    this.onSave(formData);

  }
  onSave(formData) {
    this.importService.saveVctInformationList(formData).subscribe(data => {
      this.request = data.data;
      if (!this.showResponseErrorMessages(data)) {
        this.showSuccessStatus("g.completed.successfully");
        this.onSearchVctList();
      }
    });
  }


}
