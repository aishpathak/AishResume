import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcFormControl, PageConfiguration, NgcReportComponent, NgcUtility, NgcCheckBoxComponent } from 'ngc-framework';
import { AwbManagementService } from '../awbManagement.service';
import { Validators } from '@angular/forms';
@Component({
  selector: 'app-reviveshipment',
  templateUrl: './reviveshipment.component.html',
  styleUrls: ['./reviveshipment.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class ReviveshipmentComponent extends NgcPage implements OnInit {

  showTable: boolean = false;
  @Input('shipmentNumberData') shipmentNumberData: string;
  @Input('showAsPopup') showAsPopup: boolean;
  @Output() autoSearchShipmentInfo = new EventEmitter<boolean>();

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private awbManagementService: AwbManagementService) {
    super(appZone, appElement, appContainerElement);
  }

  private form: NgcFormGroup = new NgcFormGroup({

    shipmentNumber: new NgcFormControl(),
    reviveShipmentList: new NgcFormArray([
      new NgcFormGroup(
        {
          shipmentNumber: new NgcFormControl(),
          shipmentDate: new NgcFormControl(),
          trmNumber: new NgcFormControl(),
          freightOutPieces: new NgcFormControl(),
          freightOutWeight: new NgcFormControl(),
          revivePieces: new NgcFormControl(),
          reviveWeight: new NgcFormControl(),
          shipmentLocation: new NgcFormControl(),
          warehouseLocation: new NgcFormControl(),
          shipmentId: new NgcFormControl(),
          freightOutId: new NgcFormControl(),
          flightId: new NgcFormControl(),
          inboundFlightId: new NgcFormControl(),
          reason: new NgcFormControl(),
          shipmentType: new NgcFormControl(),
          reasonForRevive: new NgcFormControl(null, [Validators.maxLength(65)])
        })
    ]),

  })
  ngOnInit() {

    this.form.get('shipmentNumber').patchValue(this.shipmentNumberData)
    this.onSearch();


  }
  onSearch() {

    let request = <NgcFormGroup>this.form.getRawValue();
    if (!this.form.get("shipmentNumber").value) {
      this.form.validate();
      this.showErrorStatus('g.enter.awb')
      return;
    }
    this.awbManagementService.reviveShipment(request).subscribe(response => {
      const resp = response.data;
      if (resp.reviveShipmentList.length > 0) {
        this.form.patchValue(resp);
        this.showTable = true;
      }
      else {
        this.showErrorStatus('export.no.records.available');
      }
    })



  }
  onRevive(index) {
    if (this.form.get(['reviveShipmentList', index, 'shipmentLocation']).invalid || this.form.get(['reviveShipmentList', index, 'warehouseLocation']).invalid) {
      return;
    }
    const shipmentGroup: NgcFormGroup = this.form.get(['reviveShipmentList', index]) as NgcFormGroup;
    const requestData = shipmentGroup.getRawValue();
    this.awbManagementService.onRevive(requestData).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.operation.successful');
        this.showTable = false
        this.onSearch()
        this.autoSearchShipmentInfo.emit(true)
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }
}