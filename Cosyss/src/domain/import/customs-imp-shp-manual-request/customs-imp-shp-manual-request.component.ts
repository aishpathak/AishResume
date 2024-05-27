import { CustomsImportShipmentManualRequest } from './../import.shared';
import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcPage, PageConfiguration, NgcFormGroup, NgcFormControl, NgcUtility, NgcTabComponent } from 'ngc-framework';
import { AwbManagementService } from '../../awbManagement/awbManagement.service';
import { SearchShipmentLocation } from '../../awbManagement/awbManagement.shared';
import { ImportService } from '../import.service';
import { FormsModule, Validators } from '@angular/forms';
import { ApplicationFeatures } from '../../common/applicationfeatures';

@Component({
  selector: 'app-customs-imp-shp-manual-request',
  templateUrl: './customs-imp-shp-manual-request.component.html',
  styleUrls: ['./customs-imp-shp-manual-request.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: false,
  autoBackNavigation: false
})
export class CustomsImpShpManualRequestComponent extends NgcPage implements OnInit {
  @ViewChild('boeInfoTab') boeInfoTabComponent: NgcTabComponent;
  @ViewChild('ocInfoTab') ocInfoTabComponent: NgcTabComponent;
  private navigateData: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private awbManagementService: AwbManagementService, private importService: ImportService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    const transferData = this.getNavigateData(this.activatedRoute);
    this.navigateData = transferData.requestData;
    if (!NgcUtility.isBlank(transferData)) {
      let verificationObj: CustomsImportShipmentManualRequest = transferData.verificationObj;
      this.form.get('searchDetails').patchValue(verificationObj);
      this.onSearch();

    }

  }

  AWBNumber: any;
  searchFlag: boolean = false;
  hideManualUpdateFlag: boolean = false;
  private handledByMasterHouse: boolean = false;
  private hawbSourceParameters: any;
  private form: NgcFormGroup = new NgcFormGroup({
    searchDetails: new NgcFormGroup({
      shipmentNumber: new NgcFormControl(),
      hawbNumber: new NgcFormControl(),
      documentType: new NgcFormControl(),
      status: new NgcFormControl()
    }),
    shipmentInfo: new NgcFormGroup({
      shipmentNumber: new NgcFormControl(),
      origin: new NgcFormControl(),
      destination: new NgcFormControl(),
      pieces: new NgcFormControl(),
      weight: new NgcFormControl(),
      chargeableWeight: new NgcFormControl()
    }),
    houseInfo: new NgcFormGroup({
      hawbNumber: new NgcFormControl(),
      origin: new NgcFormControl(),
      destination: new NgcFormControl(),
      pieces: new NgcFormControl(),
      weight: new NgcFormControl(),
      chargeableWeight: new NgcFormControl()
    }),
    shipmentNumber: new NgcFormControl(),
    shipmentOrigin: new NgcFormControl(),
    shipmentDes: new NgcFormControl(),
    shipmentPieces: new NgcFormControl(),
    shipmentWeight: new NgcFormControl(),
    shipmentChgWgt: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    hawbOrigin: new NgcFormControl(),
    hawbDes: new NgcFormControl(),
    hawbPieces: new NgcFormControl(),
    hawbWeight: new NgcFormControl(),
    hawbChgWgt: new NgcFormControl(),
    customsImportDocumentNumber: new NgcFormControl(),
    customsImportDocumentDate: new NgcFormControl(),
    customsDeclaredValue: new NgcFormControl(),
    customsClearanceNumber: new NgcFormControl(),
    customsClearanceDt: new NgcFormControl(),
    houseAgentDeliveryAuthorizationNo: new NgcFormControl(),
    houseAgentDeliveryAuthorizationDt: new NgcFormControl(),
    customsAssessedValue: new NgcFormControl(),
    customsDocumentPieces: new NgcFormControl(),
    customsDocumentWeight: new NgcFormControl(),
    customsDocumentChgWeight: new NgcFormControl(),
    greenChannel: new NgcFormControl(),
    importerBusinessIdentificationNo: new NgcFormControl(),
    importerLicenseNo: new NgcFormControl(),
    customsTotalDutyAmount: new NgcFormControl(),
    source: new NgcFormControl(),
    status: new NgcFormControl(),
    manualUpdate: new NgcFormControl(),
    boe: new NgcFormControl('', [Validators.maxLength(7)]),
    oc: new NgcFormControl('', [Validators.maxLength(10)]),
    cov: new NgcFormControl('', [Validators.maxLength(16), Validators.minLength(2)]),
    totalDuty: new NgcFormControl('', [Validators.maxLength(16), Validators.minLength(2)]),
    edo: new NgcFormControl('', [Validators.maxLength(20)]),
    rejectReason: new NgcFormControl('', [Validators.maxLength(250)]),
    manualRequestId: new NgcFormControl()
  });

  onSelectHouse() {
    this.searchFlag = false;
  }

  onSearch() {
    const searchFormGroup = (<NgcFormGroup>this.form.get('searchDetails'));
    searchFormGroup.validate();
    if (this.form.get('searchDetails').invalid) {
      return;
    }
    const request = this.form.getRawValue().searchDetails;
    if (NgcUtility.isBlank(request.hawbNumber)) {
      request.hawbNumber = null;
    }
    this.importService.fetchCustomImportShpManualReq(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.searchFlag = true;
        if (request.documentType === 'Manual Update') {
          this.hideManualUpdateFlag = false;
        } else {
          this.hideManualUpdateFlag = true;
        }
        this.form.reset();
        this.form.patchValue(data.data);
        if (request.documentType === 'Manual Update') {
          this.hideManualUpdateFlag = false;
          this.form.get('boe').setValue(data.data.customsImportDocumentNumber);
          this.form.get('oc').setValue(data.data.customsClearanceNumber);
          this.form.get('edo').setValue(data.data.edoNumber);
        }
        this.form.get('searchDetails').patchValue(request);
      }
    });
  }

  onStatusUpdate(status) {
    const request = this.form.getRawValue();
    request.status = status;
    if (status === 'Reject' && NgcUtility.isBlank(this.form.get('rejectReason').value)) {
      this.showErrorStatus('admin.provide.reason.reject');
      return;
    }
    if (status === 'Approved') {
      request.rejectReason = null;
    }
    this.importService.customsImportShipmentManualStatusUpdate(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.showSuccessStatus("g.completed.successfully");
        this.onSearch();
      }
    });
  }

  onSave(event) {
    let request = this.form.getRawValue();
    if (request.searchDetails.documentType === 'Manual Update') {
      request.source = request.searchDetails.documentType;
      if (!NgcUtility.isBlank(request.boe)) {
        request.customsImportDocumentNumber = request.boe;
        request.customsImportDocumentDate = NgcUtility.getCurrentDateOnly();
      }
      if (!NgcUtility.isBlank(request.oc)) {
        request.customsClearanceNumber = request.oc;
        request.customsClearanceDt = NgcUtility.getCurrentDateOnly();
      }
      if (!NgcUtility.isBlank(request.edo) && this.form.get('hawbNumber').value != null) {
        request.houseAgentDeliveryAuthorizationNo = request.edo;
        request.houseAgentDeliveryAuthorizationDt = new Date();
      }
      if (!NgcUtility.isBlank(request.edo) && this.form.get('hawbNumber').value == null) {
        request.airlineDeliveryAuthorizationNo = request.edo;
        request.airlineDeliveryAuthorizationDt = new Date();
        request.houseAgentDeliveryAuthorizationNo = request.airlineDeliveryAuthorizationNo;
        request.houseAgentDeliveryAuthorizationDt = request.airlineDeliveryAuthorizationDt;
      }
      if (!NgcUtility.isBlank(request.cov)) {
        request.customsAssessedValue = request.cov;
        request.customsClearanceDt = NgcUtility.getCurrentDateOnly();
      }
      if (!NgcUtility.isBlank(request.totalDuty)) {
        request.customsTotalDutyAmount = request.totalDuty;
      }
      this.importService.onManualUpdateCustomImportShipment(request).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus("g.completed.successfully");
          this.onSearch();
        }
      });
    }
  }
  onClear() {
    this.form.reset()
    this.searchFlag = false
  }
  onCancel($event) {
    this.navigateBack(this.navigateData);
  }


  onChangeOfShipmentNumber() {
    this.handledByMasterHouse = false;
    (<NgcFormControl>this.form.get('searchDetails.hawbNumber')).setValidators([]);
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.hawbSourceParameters = this.createSourceParameter(this.form.get('searchDetails').get('shipmentNumber').value);

      this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
        if (data != null && data.length > 0) {
          this.handledByMasterHouse = true;
          // (<NgcFormControl>this.form.get('searchDetails.hawbNumber')).setValidators([Validators.required]);
        } else {
          this.handledByMasterHouse = false;
        }
      },
      );

    }
  }

}
