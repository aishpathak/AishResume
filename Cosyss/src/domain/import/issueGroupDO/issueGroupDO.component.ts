
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcFormControl, PageConfiguration, NgcReportComponent, NgcUtility, NgcCheckBoxComponent } from 'ngc-framework';
import { ImportService } from "../import.service";
import { Validators } from '@angular/forms';
import { ShipmentDeliveryEquipmentReleaseModel } from "../import.sharedmodel";
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationEntities } from '../../common/applicationentities';

@Component({
  selector: 'app-issueGroupDO',
  templateUrl: './issueGroupDO.component.html',
  styleUrls: ['./issueGroupDO.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class IssueGroupDOComponent extends NgcPage implements OnInit {

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  reportParameter: any;
  displayData: boolean;
  issueGroupDoSaveRequest: any;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private importService: ImportService, private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);

  }

  private issueGroupDOForm: NgcFormGroup = new NgcFormGroup({
    terminalCode: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    requestedFrom: new NgcFormControl(),
    requestedTo: new NgcFormControl(),
    appointedAgent: new NgcFormControl(),
    deliveryRequestOrderNo: new NgcFormControl(),
    shipmentDate: new NgcFormControl(),
    domesticInterFlight: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    poNumber: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    truckdock: new NgcFormControl(),
    printerName: new NgcFormControl(),
    issueGroupDetailList: new NgcFormArray(
      [
      ]
    ),


  })
  hawbSourceParameters: {};
  shipmentType1: any = "AWB";

  ngOnInit() {
    this.shipmentType1 = "AWB"
  }
  onShipmentSelect(event) {

    this.issueGroupDOForm.get('hawbNumber').patchValue("");
    this.issueGroupDOForm.get('hawbNumber').clearValidators();

    this.hawbSourceParameters = this.createSourceParameter(this.issueGroupDOForm.get('shipmentNumber').value);
    this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
      if (data != null && data.length > 0) {
        this.issueGroupDOForm.get('hawbNumber').setValidators([Validators.required, Validators.maxLength(16)]);
        this.retrieveLOVRecords("HWBNUMBER", this.hawbSourceParameters).subscribe(data => {
          if (data != null && data.length == 1) {
            this.issueGroupDOForm.get('hawbNumber').setValue(data[0].code);
          }
        })
      } else {
        this.issueGroupDOForm.get('hawbNumber').clearValidators();
      }
    },
    );



  }

  public onSearch() {
    this.displayData = false;
    let requestData = this.issueGroupDOForm.getRawValue();
    if (requestData.shipmentNumber != null || (requestData.requestedFrom != null && requestData.requestedTo != null)) {
      if (requestData.requestedFrom > requestData.requestedTo) {
        this.showErrorStatus("exp.specialShipment.dateError")
        return
      }
      this.resetFormMessages();
      this.importService.issueGroupDo(requestData).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.displayData = true;
          this.issueGroupDOForm.patchValue(data.data);
        }
      });
    } else {
      this.showErrorStatus("imp.err113")
      this.displayData = false
      return
    }

  }
  print(ids, count) {
    this.reportParameter = new Object();
    this.reportParameter.loggedInUser = this.getUserProfile().userLoginCode;
    this.reportParameter.deliveryIds = ids;
    this.reportParameter.count = count;
    if (NgcUtility.isEntityAttributeEnabled(ApplicationEntities.Gen_House_Enable)) {
      this.reportParameter.isHawbEnable = true;
    }

    this.reportWindow.reportParameters = this.reportParameter;

    this.reportWindow.open();
  }
  onSave() {
    this.issueGroupDoSaveRequest = this.issueGroupDOForm.getRawValue();
    let groupDetailList = this.issueGroupDoSaveRequest.issueGroupDetailList;
    let shipmentSelected: boolean = false;
    let dIDS = "";
    let count = 0;
    groupDetailList.forEach(element => {
      if (element.selectCheck) {
        dIDS = dIDS + ",'" + element.impDeliveryRequestId + "'";
        count = count + 1;
        shipmentSelected = true;
      }
    });
    dIDS = dIDS.substring(1, dIDS.length);
    //  this.print(dIDS, count);
    if (!shipmentSelected) {
      this.showInfoStatus('g.custom.select');
      return;
    } else {
      this.importService.createGroupShipment(this.issueGroupDoSaveRequest).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus('g.completed.successfully');
          this.print(dIDS, count);
          this.issueGroupDOForm.reset();
          this.displayData = false;
          this.issueGroupDOForm.enable();
        }
      }, error => {
      })
    }
  }
  onissueDO() {

    this.issueGroupDoSaveRequest = this.issueGroupDOForm.getRawValue();
    let groupDetailList = this.issueGroupDoSaveRequest.issueGroupDetailList;
    let shipmentSelected: boolean = false;
    let data: any;
    let count = 0;
    groupDetailList.forEach(element => {
      if (element.selectCheck) {
        data = element;
        count = count + 1;
        shipmentSelected = true;
      }
    });
    if (count > 1) {
      this.showInfoStatus("import.info107");
      return;
    }

    var dataToSend = {
      shipmentNumber: data.shipmentNumber,
      hawbnumber: data.hawbnumber,
      chargeCode: 'PP',
      deliveryRequestOrderNo: data.deliveryRequestOrderNo
    }
    this.navigateTo(this.router, '/import/issuedo', dataToSend)
  }
}
