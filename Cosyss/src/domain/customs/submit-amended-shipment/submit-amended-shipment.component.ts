import { Component, ElementRef, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey, NgcFileUploadComponent } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { CustomACESService } from '../customs.service';
import { CustomsHouseSearchModel } from '../customs.sharedmodel';

@Component({
  selector: 'app-submit-amended-shipment',
  templateUrl: './submit-amended-shipment.component.html',
  styleUrls: ['./submit-amended-shipment.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class SubmitAmendedShipmentComponent extends NgcPage implements OnInit {

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
  shipmentList: any;
  private searchAmendedShipmentForm: NgcFormGroup = new NgcFormGroup({
    flightId: new NgcFormControl(),
  });

  private searchAmendedShipmentSearchForm: NgcFormGroup = new NgcFormGroup({
    flightNo: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    flightId: new NgcFormControl(),

    flightData:
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
      this.searchAmendedShipmentForm.patchValue(this.data);
      console.log(this.searchAmendedShipmentForm.value);
      this.onSearch();
    }
  }

  onSearch() {
    let request = <NgcFormGroup>this.searchAmendedShipmentForm.getRawValue();
    this.customsService.fetchSubmitAmendedShipment(request).subscribe(response => {
      this.refreshFormMessages(response);
      console.log(response);
      this.data = response.data;
      this.searchAmendedShipmentSearchForm.get('flightData').patchValue(this.data);

      let appendPiecesWeight = this.searchAmendedShipmentSearchForm.get('flightData').get('shipmentList').value;
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

      console.log(this.searchAmendedShipmentSearchForm.get('flightData').value);
    })
  }

  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }


  onSave(event) {
    let request = <NgcFormGroup>this.searchAmendedShipmentSearchForm.getRawValue();
    this.customsService.saveAmendedConsignment(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        if (response.data) {
          this.showSuccessStatus("g.completed.successfully");
          this.onSearch();
        }
      }

    })


  }

  openShipment(index: any) {


    this.shipmentList = this.searchAmendedShipmentSearchForm.controls.flightData.get(['shipmentList', index]).value;
    let flightATA = this.searchAmendedShipmentSearchForm.controls.flightData.get('ata').value;
    let flightDate = this.searchAmendedShipmentSearchForm.controls.flightData.get('flightDate').value;
    console.log(flightATA);
    this.shipmentList.flightATA = flightATA;
    this.shipmentList.flightDate = flightDate;
    console.log(this.shipmentList);
    this.navigateTo(this.router, '/customs/maintainaccs', this.shipmentList);
  }

  onCancel() {
    // this.navigateBack(this.forwardedData);
    this.navigateTo(this.router, 'customs/submitAmendedConsignment', this.forwardedData);
  }

  onLinkClick(index) {
    let request = new CustomsHouseSearchModel();

    request.awbNumber = this.data.shipmentList[index].shipmentNumber;
    request.flightKey = this.data.flightNo;
    request.flightDate = this.data.flightDate;
    request.flightId = this.data.flightId;
    this.navigateTo(this.router, '/customs/maintainhawblist', request);
  }

  submitToCustom(event) {
    let request = <NgcFormGroup>this.searchAmendedShipmentSearchForm.getRawValue();
    // this.customsService.submitAmendedToCustom(request).subscribe(response => {
    //   if (!this.showResponseErrorMessages(response)) {
    //     if (response.data) {
    //       this.showSuccessStatus("g.completed.successfully");
    //       this.onSearch();
    //     }
    //   }

    // })

  }

}
