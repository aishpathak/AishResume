import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, ReactiveModel, NgcFormGroup, NgcFormArray, NgcFormControl, NgcInputComponent, UserProfile,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcContainerComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { AwbManagementService } from '../awbManagement.service';
import { DeleteHouseWayBillSearchModel, SearchHouseWayBillListform } from '../awbManagement.shared';
import { SearchShipmentLocation } from '../awbManagement.shared';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-delete-house-way-bill',
  templateUrl: './delete-house-way-bill.component.html',
  styleUrls: ['./delete-house-way-bill.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class DeleteHouseWayBillComponent extends NgcPage implements OnInit {
  private AWBNumber: any;
  @ReactiveModel(SearchHouseWayBillListform)
  public searchForm: NgcFormGroup;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private awbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    let forwardedData = this.getNavigateData(this.activatedRoute);
    this.form.get('awbNumber').setValue(forwardedData.awbNumber);
    this.form.get('hawbNumber').setValue(forwardedData.hawbNumber);
    this.form.get('shipmentId').setValue(forwardedData.shipmentId);
  }

  private form: NgcFormGroup = new NgcFormGroup({
    shipmentId: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    hawbNumber: new NgcFormControl('', Validators.required),
    remarks: new NgcFormControl()
  })

  onAWBChange(event) {
    let search: SearchShipmentLocation = new SearchShipmentLocation();
    search.shipmentNumber = this.form.get('awbNumber').value;
    search.shipmentType = "AWB"
    search.appFeatures = null;
    this.AWBNumber = this.createSourceParameter(this.form.get('awbNumber').value);
  }
  setAWBNumber(object) {
    this.form.get('hawbNumber').setValue(object.code);
  }

  onDelete() {
    this.form.validate();
    if (this.form.get('awbNumber').invalid || this.form.get('awbNumber').value == null) {
      this.showErrorStatus('error.enter.valid.awb');
      return;
    }
    if (this.form.get('hawbNumber').invalid || this.form.get('hawbNumber').value == null) {
      this.showErrorStatus('error.enter.valid.hawb');
      return;
    }
    if (this.form.get('remarks').value == null) {
      this.showErrorStatus('error.11');
      return;
    }
    
    let search: DeleteHouseWayBillSearchModel = new DeleteHouseWayBillSearchModel();
    search.shipmentNumber = this.form.get('awbNumber').value;
    search.hawbNumber = this.form.get('hawbNumber').value;
    search.remarks = this.form.get('remarks').value;
    search.shipmentId= this.form.get('shipmentId').value;
    this.awbManagementService.deleteHouseWayBill(search).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.data) {
          this.showSuccessStatus("g.completed.successfully");
          this.clearForm();
        }
      }
    })
  }
  clearForm() {
    this.form.reset();
    this.resetFormMessages();
    this.reloadPage();
  }
}
