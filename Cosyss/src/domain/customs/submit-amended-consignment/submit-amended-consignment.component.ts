import { Component, ElementRef, NgZone, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey, NgcFileUploadComponent } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomACESService } from '../customs.service';

@Component({
  selector: 'app-submit-amended-consignment',
  templateUrl: './submit-amended-consignment.component.html',
  styleUrls: ['./submit-amended-consignment.component.scss']
})
export class SubmitAmendedConsignmentComponent extends NgcPage implements OnInit {

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private customsService: CustomACESService,
    private route: ActivatedRoute,
    private router: Router,
  ) { super(appZone, appElement, appContainerElement); }

  data: any;
  shipmentLists: any;
  showTableFlag: boolean = false;
  navigateBackData: any;

  private searchAmendedConsignmentSearchForm: NgcFormGroup = new NgcFormGroup({
    flightNo: new NgcFormControl(),
    flightDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),

    flightList: new NgcFormArray([
      new NgcFormGroup({
        sno: new NgcFormControl(),
        flightId: new NgcFormControl(),
        flightNo: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        std: new NgcFormControl(),
        sta: new NgcFormControl(),
        eta: new NgcFormControl(),
        fwbRecv: new NgcFormControl(),
        fhlRecv: new NgcFormControl(),
        ffmRecv: new NgcFormControl(),
        aircraftType: new NgcFormControl(),
        flightType: new NgcFormControl(),
        nilCargoFlight: new NgcFormControl(),
        screenType: new NgcFormControl(),
        shipmentList: new NgcFormArray([
          new NgcFormGroup({
          })
        ]),
        ffmShipmentList: new NgcFormArray([
          new NgcFormGroup({
          })
        ])

      })
    ])
  });

  ngOnInit() {

    this.navigateBackData = this.getNavigateData(this.activatedRoute);
    if (this.navigateBackData) {
      if (this.navigateBackData.flightDate) {
        this.searchAmendedConsignmentSearchForm.get('flightDate').patchValue(this.navigateBackData.flightDate);
      }
      if (this.navigateBackData.flightNo) {
        this.searchAmendedConsignmentSearchForm.get('flightNo').patchValue(this.navigateBackData.flightNo);
      }
      this.onSearch();
    }
  }

  onSearch() {
    let request = <NgcFormGroup>this.searchAmendedConsignmentSearchForm.getRawValue();
    this.customsService.fetchSubmitAmendedConsigment(request).subscribe(response => {
      this.refreshFormMessages(response);
      console.log(response);
      this.data = response.data;
      if (this.data.flightList.length > 0) {
        let sno1 = 1;
        this.data.flightList.forEach(element => {
          element.sno = sno1;
          sno1 = sno1 + 1;
        });
      }
      this.searchAmendedConsignmentSearchForm.get('flightList').patchValue(this.data.flightList);
      this.showTableFlag = true;

      console.log(this.searchAmendedConsignmentSearchForm.get('flightList').value);
    })
  }


  openShipment(index: any) {
    //this.shipmentLists = this.searchAmendedConsignmentSearchForm.get(['flightList', index]).value;

    var dataToSend = {
      flightId: this.searchAmendedConsignmentSearchForm.get(['flightList', index, 'flightId']).value,
      flightDate: this.searchAmendedConsignmentSearchForm.get('flightDate').value,
      flightNo: this.searchAmendedConsignmentSearchForm.get('flightNo').value
    }

    //this.navigate('customs/shipmentconsignment', this.shipmentLists);
    this.navigateTo(this.router, 'customs/submitAmendedShipment', dataToSend);
  }

}
