import { element } from 'protractor';
import { forEach } from '@angular/router/src/utils/collection';
import {
  Component,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild,
  OnInit
} from '@angular/core';
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcUtility,
  NgcWindowComponent,
  NgcButtonComponent, PageConfiguration, NgcContainer
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportService } from '../import.service';

@Component({
  selector: 'app-ecan-status-enquiry',
  templateUrl: './ecan-status-enquiry.component.html',
  styleUrls: ['./ecan-status-enquiry.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  restorePageOnBack: true,
  autoBackNavigation: true
})
export class EcanStatusEnquiryComponent extends NgcPage implements OnInit {
  private ecanStatusEnquiryForm: NgcFormGroup = new NgcFormGroup({
    flightDate: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    consigneeDetails: new NgcFormControl(),
    createdOn: new NgcFormControl(),
    modifiedOn: new NgcFormControl(),
    dateTimeFrom: new NgcFormControl(),
    dateTimeTo: new NgcFormControl(),
    emailAdd: new NgcFormControl(),
    ecanStatusList: new NgcFormArray([]),
    unShipmantData: new NgcFormGroup({
      awbNumber: new NgcFormControl()
    })
  });
  @ViewChild('sendEcanStatus') sendEcanStatus: NgcWindowComponent;
  showTable = false;
  resp: any;
  responseArray: any[];
  dropdownData = new Map<String, String>();

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.retrieveDropDownListRecords("letter$letter_values").subscribe(data => {

      data.forEach(element => {
        this.dropdownData.set(element.code, element.desc);
      })
      console.log(this.dropdownData)



    });
  }


  searchEcanStatus() {
    if (this.ecanStatusEnquiryForm.invalid) {
      this.showErrorMessage("g.fill.all.details");
      return;
    }

    const ecanStatusEnquiryData = this.ecanStatusEnquiryForm.getRawValue();

    this.importService.getEcanStatusEnquiryStatus(ecanStatusEnquiryData).subscribe(data => {

      this.resp = data;
      this.responseArray = this.resp.data;
      this.refreshFormMessages(data);
      (<NgcFormArray>this.ecanStatusEnquiryForm.controls["ecanStatusList"]).resetValue([]);
      if (this.resp.data.length !== 0) {
        (<NgcFormArray>this.ecanStatusEnquiryForm.controls["ecanStatusList"]).patchValue(this.resp.data);
        this.showTable = true;
        console.log(this.ecanStatusEnquiryForm.controls["ecanStatusList"].value);
      } else {
        this.showTable = false;
        this.showErrorMessage("no.record.found");
      }
    },
      error => {
        this.showTable = false;
        this.showErrorStatus("no.record.found");
      });


  }
  sendEcan(event) {
    let checkCount = 0;
    let ecanStatusEnquirySelected = [];
    const ecanStatusEnquiryData = this.ecanStatusEnquiryForm.controls["ecanStatusList"].value;
    ecanStatusEnquiryData.forEach(element => {
      if (element.checkFlag) {
        ecanStatusEnquirySelected.push(element);
        checkCount++;
      }
    });
    if (checkCount == 0) {
      this.showErrorMessage("export.select.atleast.one.shipment");
      return;
    }
    this.sendEcanStatus.open();

  }
  onLetterSelect(event, group) {
    console.log(event);
    const ecanStatusEnquiryData = this.ecanStatusEnquiryForm.getRawValue();
    const shipmentEcan = ecanStatusEnquiryData.ecanStatusList[group];
    shipmentEcan.letter = "";
    event.forEach(element => {

      shipmentEcan.letter = shipmentEcan.letter + "- " + this.dropdownData.get(element);
    })
    this.ecanStatusEnquiryForm.get(["ecanStatusList", group, "letter"]).patchValue(shipmentEcan.letter);
  }

  resendEcanButton() {
    const ecanStatusEnquiryData = this.ecanStatusEnquiryForm.getRawValue();
    const ecanStatusShipmentList = []
    ecanStatusEnquiryData.ecanStatusList.forEach(element => {
      if (element.checkFlag) {
        element.emailAdd = this.ecanStatusEnquiryForm.get('emailAdd').value.join(',');
        ecanStatusShipmentList.push(element);
      }
    });
    this.importService.onSendEcan(ecanStatusShipmentList).subscribe(data => {

      const resp = data.data;
      console.log(resp);
      if (!this.showResponseErrorMessages(data)) {
        this.showSuccessStatus('g.completed.successfully');

        this.sendEcanStatus.close();
        this.ecanStatusEnquiryForm.enable();
      }


    }, error => {
      this.showErrorStatus("error");

    });
  }
  // onCancel(event) {
  //   this.showConfirmMessage('on.cancel.message').then(fulfilled => {
  //     this.navigateBack(null);
  //   });
  // }



}
