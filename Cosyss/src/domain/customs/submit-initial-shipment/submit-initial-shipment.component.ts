import { Component, ElementRef, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey, NgcFileUploadComponent } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { CustomACESService } from '../customs.service';
import { CustomsHouseSearchModel } from '../customs.sharedmodel';

@Component({
  selector: 'app-submit-initial-shipment',
  templateUrl: './submit-initial-shipment.component.html',
  styleUrls: ['./submit-initial-shipment.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class SubmitInitialShipmentComponent extends NgcPage implements OnInit {

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

  data: any;
  forwardedData: any;
  saveRequest: any;
  shipmentList: any;

  private searchInitialShipmentForm: NgcFormGroup = new NgcFormGroup({
    flightId: new NgcFormControl(),
  });

  private searchInitialShipmentSearchForm: NgcFormGroup = new NgcFormGroup({
    flightNo: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    flightId: new NgcFormControl(),

    flightList:
      new NgcFormGroup({
        ata: new NgcFormControl(),
        flightNo: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        eta: new NgcFormControl(),
        aircraftType: new NgcFormControl(),
        mawb: new NgcFormControl(),
        hawb: new NgcFormControl(),
        simpleCsgn: new NgcFormControl(),
        cnslCsgn: new NgcFormControl(),
        status: new NgcFormControl(),
        shipmentList: new NgcFormArray([
          new NgcFormGroup({
            awbPiecesWeight: new NgcFormControl(),
            manifestPiecesWeight: new NgcFormControl(),
            hawbPiecesWeight: new NgcFormControl(),
          })
        ])
      }),
  });

  ngOnInit() {
    super.ngOnInit();


    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData) {
      this.data = this.forwardedData;
      this.searchInitialShipmentForm.patchValue(this.data);
      console.log(this.searchInitialShipmentForm.value);
      this.onSearch();
    }
  }

  onSearch() {
    let request = <NgcFormGroup>this.searchInitialShipmentForm.getRawValue();
    console.log(request);
    this.customsService.fetchSubmitInitialShipment(request).subscribe(response => {
      this.refreshFormMessages(response);
      console.log(response);
      this.data = response.data;
      this.searchInitialShipmentSearchForm.get('flightList').patchValue(this.data);

      let appendPiecesWeight = this.searchInitialShipmentSearchForm.get('flightList').get('shipmentList').value;
      if (appendPiecesWeight != null) {
        appendPiecesWeight.forEach(element => {
          if (element.hawbPieces != null && element.hawbWeight != null) {
            element.hawbPiecesWeight = element.hawbPieces + "/" + element.hawbWeight;
          }
          if (element.awbPieces != null && element.awbWeight != null) {
            element.awbPiecesWeight = element.awbPieces + "/" + element.awbWeight;
          }
          if (element.manifestPieces != null && element.manifestWeight != null) {
            element.manifestPiecesWeight = element.manifestPieces + "/" + element.manifestWeight;
          }

        })
      }

      console.log(this.searchInitialShipmentSearchForm.get('flightList').value);
    })
  }

  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  onSave(event) {

    if (this.searchInitialShipmentSearchForm.get('flightList').get('status').value == 'Accepted') {
      this.showErrorMessage('already.accepted.by.custom');
      return;
    }
    if (this.searchInitialShipmentSearchForm.get('flightList').get('status').value == 'Incomplete') {
      this.showErrorMessage('customs.flight.incomplete');
      return;
    }

    this.saveRequest = this.searchInitialShipmentSearchForm.get('flightList').value;
    this.saveRequest.flightNo = this.saveRequest.flightNo;
    this.saveRequest.flightDate = this.saveRequest.flightDate;

    this.customsService.submitConsignment(this.saveRequest).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        if (response.data) {
          this.showSuccessStatus("g.completed.successfully");
          this.onSearch();
        }
      }

    })


  }

  openShipment(index: any) {

    console.log(this.searchInitialShipmentSearchForm.get('flightList').value);
    this.shipmentList = this.searchInitialShipmentSearchForm.controls.flightList.get(['shipmentList', index]).value;
    let flightATA = this.searchInitialShipmentSearchForm.controls.flightList.get('ata').value;
    let flightDate = this.searchInitialShipmentSearchForm.controls.flightList.get('flightDate').value;
    console.log(flightATA);
    this.shipmentList.flightATA = flightATA;
    this.shipmentList.flightDate = flightDate;
    console.log(this.shipmentList);
    this.navigateTo(this.router, '/customs/maintainaccs', this.shipmentList);
  }

  onLinkClick(index) {
    let request = new CustomsHouseSearchModel();
    request.awbNumber = this.data.shipmentList[index].shipmentNumber;
    request.flightKey = this.data.flightNo;
    request.flightDate = this.data.flightDate;
    request.flightId = this.data.flightId;
    this.navigateTo(this.router, '/customs/maintainhawblist', request);
  }

  onCancel() {
    // this.navigateBack(this.forwardedData);
    this.navigateTo(this.router, 'customs/submitinitialconsignment', this.forwardedData);
  }


}
