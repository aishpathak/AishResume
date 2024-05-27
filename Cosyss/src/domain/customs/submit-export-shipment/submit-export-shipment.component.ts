import { Component, ElementRef, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey, NgcFileUploadComponent } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { CustomACESService } from '../customs.service';
import { CustomsHouseSearchModel } from '../customs.sharedmodel';

@Component({
  selector: 'app-submit-export-shipment',
  templateUrl: './submit-export-shipment.component.html',
  styleUrls: ['./submit-export-shipment.component.scss']
})
export class SubmitExportShipmentComponent extends NgcPage implements OnInit {
  forwardedData: any;
  data: any;
  shipmentList: any;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private customsService: CustomACESService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private searchSubmitExportShipmentForm: NgcFormGroup = new NgcFormGroup({
    flightId: new NgcFormControl(),
  });

  private submitExportConsignmentForm: NgcFormGroup = new NgcFormGroup({
    flightList:
      new NgcFormGroup({
        ata: new NgcFormControl(),
        flightNo: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        etd: new NgcFormControl(),
        aircraftType: new NgcFormControl(),
        mawb: new NgcFormControl(),
        hawb: new NgcFormControl(),
        simpleCsgn: new NgcFormControl(),
        cnslCsgn: new NgcFormControl(),
        status: new NgcFormControl(),
        shpmWithFwb: new NgcFormControl(),
        shpmWithFhl: new NgcFormControl(),
        shpmManf: new NgcFormControl(),
        exportShipmentList: new NgcFormArray([
          new NgcFormGroup({
            shipmentNumber: new NgcFormControl(),
          })
        ])
      }),
  });

  ngOnInit() {
    super.ngOnInit();


    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData) {
      this.data = this.forwardedData;
      this.searchSubmitExportShipmentForm.patchValue(this.data);
      console.log(this.searchSubmitExportShipmentForm.value);
      this.onSearch();
    }
  }

  onSearch() {
    let request = <NgcFormGroup>this.searchSubmitExportShipmentForm.getRawValue();
    console.log(request);
    this.customsService.fetchSubmitExportShipment(request).subscribe(response => {
      this.refreshFormMessages(response);
      console.log(response);
      this.data = response.data;
      this.submitExportConsignmentForm.get('flightList').patchValue(this.data);
      console.log(this.submitExportConsignmentForm.get('flightList').value);
    })
  }

  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  onCancel() {
    this.navigateTo(this.router, 'customs/submitExportConsignment', this.forwardedData);
  }

  openShipment(index: any) {

    console.log(this.submitExportConsignmentForm.get('flightList').value);
    this.shipmentList = this.submitExportConsignmentForm.controls.flightList.get(['exportShipmentList', index]).value;
    console.log(this.shipmentList);
    let flightKey = this.submitExportConsignmentForm.controls.flightList.get('flightNo').value;
    let flightDate = this.submitExportConsignmentForm.controls.flightList.get('flightDate').value;
    console.log(flightKey);
    console.log(flightDate);
    this.shipmentList.flightKey = flightKey;
    this.shipmentList.flightDate = flightDate;
    console.log(this.shipmentList);
    this.navigateTo(this.router, '/customs/maintainaccs', this.shipmentList);
  }


  onLinkClick(index) {
    let request = new CustomsHouseSearchModel();

    console.log(this.submitExportConsignmentForm.get('flightList').value);
    this.shipmentList = this.submitExportConsignmentForm.controls.flightList.get(['exportShipmentList', index]).value;

    request.awbNumber = this.shipmentList.shipmentNumber;
    request.flightKey = this.submitExportConsignmentForm.controls.flightList.get('flightNo').value;
    request.flightDate = this.submitExportConsignmentForm.controls.flightList.get('flightDate').value;
    request.flightId = this.submitExportConsignmentForm.controls.flightList.get('flightId').value;
    console.log(request);
    this.navigateTo(this.router, '/customs/maintainhawblist', request);
  }

}
