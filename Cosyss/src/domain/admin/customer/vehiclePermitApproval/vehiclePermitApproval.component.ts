import { element } from 'protractor';
import { Validators } from '@angular/forms';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, PipeTransform } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcButtonComponent, NgcUtility,
  PageConfiguration, CellsRendererStyle, NgcWindowComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiclePermitServiceRequest } from './../../admin.sharedmodel';
import { AdminService } from './../../admin.service';

@Component({
  selector: 'app-vehiclePermitApproval',
  templateUrl: './vehiclePermitApproval.component.html',
  styleUrls: ['./vehiclePermitApproval.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class VehiclePermitApprovalComponent extends NgcPage implements OnInit {

  @ViewChild("vehiclePermitApprovalPopup") vehiclePermitApprovalPopup: NgcWindowComponent;

  isTableFlg: boolean;
  showSearchButton: boolean;

  private form: NgcFormGroup = new NgcFormGroup({
    handlingTerminal: new NgcFormControl(),
    type: new NgcFormControl(),
    requestNo: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    status: new NgcFormControl(),
    requestDate: new NgcFormControl(),
    fromDateTime: new NgcFormControl(),
    toDateTime: new NgcFormControl(),
    VehiclePermitList: new NgcFormArray([]),
    windowGroup: new NgcFormGroup({
      agentName: new NgcFormControl(),
      type: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(),
      pieces: new NgcFormControl(),
      weight: new NgcFormControl(),
      purpose: new NgcFormControl(),
      email: new NgcFormControl(),
      handlingTerminal: new NgcFormControl(),
      requestDate: new NgcFormControl(),
      fromDate: new NgcFormControl(),
      toDate: new NgcFormControl(),
      status: new NgcFormControl(),
      registrationNumbersList: new NgcFormControl(),
      reasonForRejection: new NgcFormControl()
    }),

  })

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router,
    private adminService: AdminService) {
    super(appZone, appElement, appContainerElement);
    // this.functionId = "PLAYGROUND";
  }

  ngOnInit() {
    this.searchVehicleRequests();
  }

  public searchVehicleRequests() {
    let vehicleData: VehiclePermitServiceRequest = new VehiclePermitServiceRequest();
    vehicleData = this.form.getRawValue();
    this.adminService.searchVehicleRequests(vehicleData).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.isTableFlg = true;
        (<NgcFormArray>this.form.controls['VehiclePermitList']).patchValue(data.data);
      } else {
        this.isTableFlg = false;
      }
    }, error => {
      this.showErrorMessage(error);
    })
  }

  public onApproveOrReject(event) {
    if (event.record.status === 'REJECTED' || event.record.status === 'APPROVED') {
      this.showSearchButton = false;
    } else {
      this.showSearchButton = true;
    }
    let windowGroup: NgcFormGroup = this.form.get(['VehiclePermitList', event.record.NGC_ROW_ID]) as NgcFormGroup;
    this.form.get('windowGroup').patchValue(windowGroup.getRawValue());
    this.vehiclePermitApprovalPopup.open();

  }

  public onRejection() {
    let toSendEmail: VehiclePermitServiceRequest = (<NgcFormGroup>this.form.get('windowGroup')).getRawValue();
    //toSendEmail.email = "preeti.5.singh@niit-tech.com";
    this.adminService.sendRejectionEmail(toSendEmail).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.vehiclePermitApprovalPopup.close();
        this.searchVehicleRequests();
        this.showSuccessStatus("g.completed.successfully");
      }
    }, error => {
      this.showErrorMessage(error);
    })
  }

  public onApproval() {

    let toSendEmail: VehiclePermitServiceRequest = (<NgcFormGroup>this.form.get('windowGroup')).getRawValue();
    //toSendEmail.email = "preeti.5.singh@niit-tech.com";
    this.adminService.sendApprovalEmail(toSendEmail).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.vehiclePermitApprovalPopup.close();
        this.searchVehicleRequests();
        this.showSuccessStatus("g.completed.successfully");
      }
    }, error => {
      this.showErrorMessage(error);
    })
  }
}
