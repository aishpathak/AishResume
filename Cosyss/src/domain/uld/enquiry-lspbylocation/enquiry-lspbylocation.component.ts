import { Validators } from '@angular/forms';
import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcButtonComponent, NgcReportComponent, PageConfiguration, ReportFormat, NgcUtility } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { UldService } from '../uld.service';
import { EnquiryLSPByLocationRequest } from '../uld.shared';


@Component({
  selector: 'app-enquiry-lspbylocation',
  templateUrl: './enquiry-lspbylocation.component.html',
  styleUrls: ['./enquiry-lspbylocation.component.scss']
})

@PageConfiguration({
  trackInit: true,
  autoBackNavigation: true,
  restorePageOnBack: true,
  callNgOnInitOnClear: true
})
export class EnquiryLSPBYLocationComponent extends NgcPage implements OnInit {
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  reportParameters: any;
  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  lspLocList: any[];
  resp: any;
  private sectorId: any = '';
  showTable: boolean = false;

  /*** ngc form input and output controls */
  private enquiryLSPByLocationForm: NgcFormGroup = new NgcFormGroup({
    warehouseDestination: new NgcFormControl(),
    warehouseLocation: new NgcFormControl(),
    lspNumber: new NgcFormControl(),
    empty: new NgcFormControl(),
    htClass: new NgcFormControl(),
    storageDate: new NgcFormControl(),
    retrieveDate: new NgcFormControl(),
    lspLocationList: new NgcFormArray([]),
  })

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router,
    private activatedRoute: ActivatedRoute,
    private uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
  }
  /*** This function  provids LSP information according to provided input Warehouse Location/ Destination */
  public lspByLocationList() {
    this.showTable = false;
    this.enquiryLSPByLocationForm.validate();
    if (this.enquiryLSPByLocationForm.invalid) {
      return;
    }
    // this.uldService.getLSPByLocation(this.enquiryLSPByLocationForm.getRawValue()).subscribe(data => {
    //   this.refreshFormMessages(data);
    //   this.resp = data;
    //   if (!this.showResponseErrorMessages(data)) {
    //     if (this.resp.data) {
    //       this.lspLocList = this.resp.data.lspByLocation;
    //     }
    //     if (this.lspLocList.length > 0) {
    //       this.showTable = true;
    //       let i = 1;
    //       this.lspLocList.forEach(element => {
    //         element.serialNumber = i;
    //         i++;
    //       });
    //       (<NgcFormArray>this.enquiryLSPByLocationForm.controls['lspLocationList']).patchValue(this.lspLocList);
    //     }
    //   }
    // }, error => {
    //   this.showErrorStatus('uld.an.error.occured.please.try.again!!');
    //   this.searchButton.disabled = false;
    // });
  }
  /*** This function filterout  Warehouse Location value according to selection of Warehouse destination*/
  onLocationChange(data, index) {
    this.sectorId = data.parameter2;
  }
  /*** This function cancel the provided input/output and navigate to homepage */
  onCancel(event) {
    this.resetFormMessages();
    this.enquiryLSPByLocationForm.reset();
    this.navigateTo(this.router, '/', null);
  }

  onSelectWareHouseDestination = event => {
    if (!NgcUtility.isBlank(event)) {
      this.enquiryLSPByLocationForm.get('warehouseLocation').setValidators([]);
    } else {
      if (this.enquiryLSPByLocationForm.get('warehouseLocation').value == null) {
        this.enquiryLSPByLocationForm.get('warehouseLocation').setValidators([Validators.required]);
        this.enquiryLSPByLocationForm.get('warehouseDestination').setValidators([Validators.required]);
      }
    }
  }

  onSelectWareHouseLocation = event => {
    if (!NgcUtility.isBlank(event)) {
      this.enquiryLSPByLocationForm.get('warehouseDestination').setValidators([]);
    }
    else {
      if (this.enquiryLSPByLocationForm.get('warehouseDestination').value == null) {
        this.enquiryLSPByLocationForm.get('warehouseLocation').setValidators([Validators.required]);
        this.enquiryLSPByLocationForm.get('warehouseDestination').setValidators([Validators.required]);
      }
    }
  }
  /*** This function provids the report result in PDF format */
  onPrint() {
    this.reportParameters = new Object();
    this.reportParameters.lspNumber = this.enquiryLSPByLocationForm.get('lspNumber').value;
    this.reportParameters.warehouseDestination = this.enquiryLSPByLocationForm.get('warehouseDestination').value;
    this.reportParameters.warehouseLocation = this.enquiryLSPByLocationForm.get('warehouseLocation').value;
    this.reportParameters.empty = this.enquiryLSPByLocationForm.get('empty').value;
    this.reportParameters.htClass = this.enquiryLSPByLocationForm.get('htClass').value;
    this.reportParameters.storageDate = this.enquiryLSPByLocationForm.get('storageDate').value;
    this.reportParameters.retrieveDate = this.enquiryLSPByLocationForm.get('retrieveDate').value;

    this.reportParameters.login = this.getUserProfile().userLoginCode;
    this.reportWindow.open();
  }

}
