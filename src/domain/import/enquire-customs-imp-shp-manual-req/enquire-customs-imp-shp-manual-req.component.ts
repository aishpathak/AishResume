import { NgcFormGroup } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { CustomsImportShipmentManualRequest } from './../import.shared';
import { ImportService } from './../import.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgcFormArray, PageConfiguration, NgcUtility } from 'ngc-framework';
import { NgcFormControl } from 'ngc-framework';
import { ElementRef, ViewContainerRef } from '@angular/core';
import { NgcPage } from 'ngc-framework';
import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-enquire-customs-imp-shp-manual-req',
  templateUrl: './enquire-customs-imp-shp-manual-req.component.html',
  styleUrls: ['./enquire-customs-imp-shp-manual-req.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class EnquireCustomsImpShpManualReqComponent extends NgcPage implements OnInit {

  resultFlag: boolean = false;
  navigateBackData: any;
  constructor(appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private router: Router,
    private importService: ImportService,
    private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }
  AWBNumber: any;
  shipmentList: any = []
  private customsImportShipmentForm: NgcFormGroup = new NgcFormGroup({
    documentType: new NgcFormControl(),
    fromDate: new NgcFormControl('', [Validators.required]),
    toDate: new NgcFormControl('', [Validators.required]),
    shipmentNumber: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    shipmentList: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        documentType: new NgcFormControl(),
        customsImportDocumentNumber: new NgcFormControl(),
        customsImportDocumentDate: new NgcFormControl(),
        customsClearanceNumber: new NgcFormControl(),
        customsClearanceDt: new NgcFormControl(),
        customsDocumentPieces: new NgcFormControl(),
        customsDocumentWeight: new NgcFormControl(),
        customsDocumentChgWeight: new NgcFormControl(),
        fileName: new NgcFormControl(),
        approvalStatus: new NgcFormControl(),
        approvalDate: new NgcFormControl(),
        approvedBy: new NgcFormControl()
      })
    ])

  })


  ngOnInit() {
    this.navigateBackData = this.getNavigateData(this.activatedRoute);
    console.log(this.navigateBackData.navigateData);
    if (!NgcUtility.isBlank(this.navigateBackData)) {
      this.customsImportShipmentForm.patchValue(this.navigateBackData);

    }

    this.onSearch();

  }
  onSearch() {

    this.customsImportShipmentForm.validate();
    if ((<NgcFormGroup>this.customsImportShipmentForm).invalid) {
      this.showErrorMessage('g.enter.mandatory.m');
      return;
    }
    this.resultFlag = false;
    this.resetFormMessages();
    var customsImportRequest = new CustomsImportShipmentManualRequest();
    customsImportRequest = this.customsImportShipmentForm.getRawValue();
    this.importService.getCustomsImporShipmentList(customsImportRequest).subscribe(data => {
      this.refreshFormMessages(data);
      this.shipmentList = data.data;
      if (this.shipmentList && this.shipmentList.length > 0) {
        this.resultFlag = true;
        for (const eachRow of this.shipmentList) {
          eachRow['select'] = 'false';
        }
        this.customsImportShipmentForm.get('shipmentList').patchValue(this.shipmentList);
      }
    }, error => {
      this.showErrorStatus("Error:" + error);
    }
    )
  }


  onNavigate(event) {
    let requestData = new Object();
    let documentType: string = this.customsImportShipmentForm.get('documentType').value;
    let shipmentNumber: string = this.customsImportShipmentForm.get('shipmentNumber').value;
    let hawbNumber: string = this.customsImportShipmentForm.get('hawbNumber').value;
    let fromDate: string = this.customsImportShipmentForm.get('fromDate').value;
    let toDate: string = this.customsImportShipmentForm.get('toDate').value;
    requestData = {
      documentType: documentType,
      AWBNumber: shipmentNumber,
      hawbNumber: hawbNumber,
      fromDate: fromDate,
      toDate: toDate
    }


    if (this.customsImportShipmentForm.get(['shipmentList']).value.filter((element) => element.select == true).length == 0) {
      this.showErrorMessage('selectAtleastOneRecord')
    }

    else if (this.customsImportShipmentForm.get('shipmentList').value.filter((element) => element.select == true).length > 1) {
      this.showErrorMessage("export.select.only.one.record");
    } else {

      var request = {
        verificationObj: this.customsImportShipmentForm.get('shipmentList').value.find(element => element.select == true),
        requestData: requestData
      }
      if (request.verificationObj.documentType == 'Wgt Ver') {
        this.navigateTo(this.router, '/import/manual-weight-verification-request', request);
      } else {
        this.navigateTo(this.router, '/import/customs-imp-shp-manual-reqest', request);
      }
    }
  }
  setAWBNumber(object) {
    if (object.code) {
      (<NgcFormControl>this.customsImportShipmentForm.get(["hawbNumber"])).setErrors(null);
    }
  }
 
}
