import { Component, ElementRef, NgZone, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey, NgcFileUploadComponent } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomACESService } from '../customs.service';

@Component({
  selector: 'app-submit-initial-consignment',
  templateUrl: './submit-initial-consignment.component.html',
  styleUrls: ['./submit-initial-consignment.component.scss']
})

@PageConfiguration({
  trackInit: true,
  //callNgOnInitOnClear: true,
  focusToBlank: false,
  focusToMandatory: false
})
export class SubmitInitialConsignmentComponent extends NgcPage implements OnInit {

  templateRef: TemplateRef<any>;
  @ViewChild('parentWindow') parentWindow: NgcWindowComponent;
  @ViewChild('submitShipment') submitShipment: TemplateRef<any>;
  isClosePopupScreen: boolean = true;
  title: string;
  popUpWidth: Number;
  popUpHeight: Number;
  shipmentNumber: any;
  showPopUp: boolean = false;
  showDataOfListFlag: boolean = false;
  flightid: any;
  showDataFlag: boolean = false;

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
  shipmentLists: any;
  navigateBackData: any;

  private searchInitialConsignmentSearchForm: NgcFormGroup = new NgcFormGroup({
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
        this.searchInitialConsignmentSearchForm.get('flightDate').patchValue(this.navigateBackData.flightDate);
      }
      if (this.navigateBackData.flightNo) {
        this.searchInitialConsignmentSearchForm.get('flightNo').patchValue(this.navigateBackData.flightNo);
      }
      this.onSearch();
    }
  }

  onSearch() {
    let request = <NgcFormGroup>this.searchInitialConsignmentSearchForm.getRawValue();
    this.customsService.fetchSubmitInitialConsigment(request).subscribe(response => {
      console.log(response);
      this.refreshFormMessages(response);
      this.data = response.data;
      if (this.data.flightList.length > 0) {
        let sno1 = 1;
        this.data.flightList.forEach(element => {
          element.sno = sno1;
          sno1 = sno1 + 1;
        });
      }
      this.searchInitialConsignmentSearchForm.get('flightList').patchValue(this.data.flightList);
      this.showDataFlag = true;

      console.log(this.searchInitialConsignmentSearchForm.get('flightList').value);
    }, error => {
      this.showErrorStatus(error);
    })
  }

  openShipment(index: any) {
    if (this.searchInitialConsignmentSearchForm.get(['flightList', index, 'status']).value == 'No FFM') {
      this.showErrorMessage('No FFM is Received for this Flight');
      return;
    }

    this.flightid = this.searchInitialConsignmentSearchForm.get(['flightList', index, 'flightId']).value;

    var dataToSend = {
      flightId: this.searchInitialConsignmentSearchForm.get(['flightList', index, 'flightId']).value,
      flightDate: this.searchInitialConsignmentSearchForm.get('flightDate').value,
      flightNo: this.searchInitialConsignmentSearchForm.get('flightNo').value
    }

    //this.navigate('customs/shipmentconsignment', this.shipmentLists);
    this.navigateTo(this.router, 'customs/submitInitialShipment', dataToSend);
  }

}



