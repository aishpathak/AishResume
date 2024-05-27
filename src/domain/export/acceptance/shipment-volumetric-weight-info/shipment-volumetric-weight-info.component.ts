
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcFormGroup, NgcFormControl, NgcWindowComponent, NgcPage, NgcUtility, NgcFormArray, NgcReportComponent, PageConfiguration
  , NgcFileUploadComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchVolumetericRequest } from '../../export.sharedmodel';
import { AcceptanceService } from '../acceptance.service';

@Component({
  selector: 'app-shipment-volumetric-weight-info',
  templateUrl: './shipment-volumetric-weight-info.component.html',
  styleUrls: ['./shipment-volumetric-weight-info.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class ShipmentVolumetricWeightInfoComponent extends NgcPage {
  entityKeyData: any;
  showDataFlag: Boolean = false;
  showChildDataFlag: Boolean = false;
  showChildDataFlag1: Boolean = false;
  reportParameters: any;
  childreportParameters: any;
  volScannerResponse: any;
  childDataReportRequest: any;
  awbNumber: any;
  filteredkey: any;
  @ViewChild('displayChildData') selectWindow: NgcWindowComponent;
  @ViewChild('displayChildDataImages') displayChildDataImages: NgcWindowComponent;
  @ViewChild('mainFlies') mainFlies: NgcFileUploadComponent;
  @ViewChild("VolumetricDetailReport")
  VolumetricetailReport: NgcReportComponent;
  @ViewChild("VolumetricScannerReport")
  VolumetricScannerReport: NgcReportComponent;

  constructor(private router: Router, appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private acceptanceService: AcceptanceService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  private searchVolumetricInfoForm: NgcFormGroup = new NgcFormGroup({
    awbNumber: new NgcFormControl(),
    carrier: new NgcFormControl(),
    agentname: new NgcFormControl(),
    accFromDate: new NgcFormControl(),
    accToDate: new NgcFormControl(),
  })

  private volumetricScannerForm: NgcFormGroup = new NgcFormGroup({
    toleranceexceed: new NgcFormControl(false),
    weightDifference: new NgcFormControl(false),
    volWgtexceedShipWgt: new NgcFormControl(false),
    allVolumetricShipments: new NgcFormControl(false),

    volumetricWeightSummary: new NgcFormArray([
      new NgcFormGroup({
        awbNumber: new NgcFormControl(),
        carrier: new NgcFormControl(),
        agentname: new NgcFormControl(),
        awbpcs: new NgcFormControl(),
        awbwgt: new NgcFormControl(),
        chargewgt: new NgcFormControl(),
        declaredVolume: new NgcFormControl(),
        shc: new NgcFormControl(),
        accptpcs: new NgcFormControl(),
        accptwgt: new NgcFormControl(),
        accptvolwgt: new NgcFormControl(),
        wgtdiff: new NgcFormControl(),
        toleranceexceed: new NgcFormControl(),
        accptdatetime: new NgcFormControl(),
      })
    ]),
    volumetricWeightDetail: new NgcFormArray([
      new NgcFormGroup({
        pieces: new NgcFormControl(),
        length: new NgcFormControl(),
        width: new NgcFormControl(),
        height: new NgcFormControl(),
        skidHeight: new NgcFormControl(),
        manualScan: new NgcFormControl(),
        reason: new NgcFormControl(),
        wsWeight: new NgcFormControl(),
        volumetricWeight: new NgcFormControl()
      })
    ]),
    fileUpload: new NgcFormArray([])
  })

  onSearch(object) {
    this.resetFormMessages();
    this.showDataFlag = false;
    const requestForSearch: SearchVolumetericRequest = this.searchVolumetricInfoForm.getRawValue();
    if (requestForSearch.awbNumber === null && requestForSearch.accFromDate === null &&
      requestForSearch.accToDate === null) {
      return this.showErrorMessage("export.provide.awbnumber.fromdate.todate");
    }
    if ((requestForSearch.awbNumber != null || requestForSearch.awbNumber == null) && requestForSearch.accFromDate != null &&
      requestForSearch.accToDate === null) {
      return this.showErrorMessage("g.select.todate");
    }
    if ((requestForSearch.awbNumber != null || requestForSearch.awbNumber == null) && requestForSearch.accFromDate === null &&
      requestForSearch.accToDate != null) {
      return this.showErrorMessage("g.select.fromdate");
    }
    this.acceptanceService.fetchVolumetricWeightDetails(requestForSearch).subscribe(response => {
      const responseData = response.data;
      this.volumetricScannerForm.get('toleranceexceed').setValue(false);
      this.volumetricScannerForm.get('weightDifference').setValue(false);
      this.volumetricScannerForm.get('volWgtexceedShipWgt').setValue(false);
      this.volumetricScannerForm.get('allVolumetricShipments').setValue(false);
      if (responseData && responseData.length > 0) {
        this.showDataFlag = true;
        this.volScannerResponse = responseData;
        (<NgcFormArray>this.volumetricScannerForm.get(['volumetricWeightSummary'])).patchValue(responseData);
      }
      else if (!response.messageList) {
        this.showErrorStatus("no.record");
      } else {
        this.showErrorStatus(response.messageList[0].code);
      }
    })
  }

  onClick(obj) {
    const requestObj = {
      'shipmentNumber': this.volumetricScannerForm.getRawValue().volumetricWeightSummary[obj].awbNumber
    };
    this.childDataReportRequest = [];
    this.childDataReportRequest.awbNumber = this.volumetricScannerForm.getRawValue().volumetricWeightSummary[obj].awbNumber;
    this.childDataReportRequest.agentCode = this.volumetricScannerForm.getRawValue().volumetricWeightSummary[obj].agentCode;
    this.childDataReportRequest.carrier = this.volumetricScannerForm.getRawValue().volumetricWeightSummary[obj].carrier;
    this.acceptanceService.fetchVolumetricScannerDetails(requestObj).subscribe(response => {
      const responseData = response.data;
      if (responseData && responseData.length > 0) {
        this.showChildDataFlag = true;
        this.awbNumber = "  " + this.volumetricScannerForm.getRawValue().volumetricWeightSummary[obj].awbNumber;
        this.selectWindow.open();

        (<NgcFormArray>this.volumetricScannerForm.get(['volumetricWeightDetail'])).patchValue(responseData);
      }
      else if (!response.messageList) {
        this.showErrorStatus("no.record");
      } else {
        this.showErrorStatus(response.messageList[0].code);
      }
    });
  }

  onDownloadReport() {
    this.resetFormMessages();
    const reportParameters: any = {};
    const requestForSearch: SearchVolumetericRequest = this.searchVolumetricInfoForm.getRawValue();
    if (requestForSearch.awbNumber === null && requestForSearch.accFromDate === null &&
      requestForSearch.accToDate === null) {
      return this.showErrorMessage("export.provide.awbnumber.fromdate.todate");
    }
    if ((requestForSearch.awbNumber != null || requestForSearch.awbNumber == null) && requestForSearch.accFromDate != null &&
      requestForSearch.accToDate === null) {
      return this.showErrorMessage("g.select.todate");
    }
    if ((requestForSearch.awbNumber != null || requestForSearch.awbNumber == null) && requestForSearch.accFromDate === null &&
      requestForSearch.accToDate != null) {
      return this.showErrorMessage("g.select.fromdate");
    }
    reportParameters.accFromDate = requestForSearch.accFromDate;
    reportParameters.accToDate = requestForSearch.accToDate;
    reportParameters.awbNumber = requestForSearch.awbNumber;
    reportParameters.carrier = requestForSearch.carrier;
    reportParameters.agentname = requestForSearch.agentname;
    reportParameters.toleranceExceed = this.volumetricScannerForm.get('toleranceexceed').value ? 1 : 0;
    reportParameters.wtDiff = this.volumetricScannerForm.get('weightDifference').value ? 1 : 0;
    reportParameters.volumetricWgt = this.volumetricScannerForm.get('volWgtexceedShipWgt').value ? 1 : 0;
    this.reportParameters = reportParameters;
    this.VolumetricetailReport.reportParameters = reportParameters;
    this.VolumetricetailReport.downloadReport();
  }

  onDownloadVolumetricReport() {
    const childDreportParameters: any = {};
    childDreportParameters.awbNumber = this.childDataReportRequest.awbNumber
    childDreportParameters.carrier = this.childDataReportRequest.carrier;
    childDreportParameters.agentCode = this.childDataReportRequest.agentCode;
    this.childreportParameters = childDreportParameters;
    this.VolumetricScannerReport.reportParameters = childDreportParameters;
    this.VolumetricScannerReport.downloadReport();
  }

  onFilterVolumetricDetail(obj) {
    if (this.volumetricScannerForm.get('toleranceexceed').value) {
      let filterData = []
      filterData = this.volScannerResponse.filter(resp => resp.toleranceexceed === 'Y');
      (<NgcFormArray>this.volumetricScannerForm.get(['volumetricWeightSummary'])).patchValue(filterData);
    }
    else if (this.volumetricScannerForm.get('weightDifference').value) {
      let filterData = []
      filterData = this.volScannerResponse.filter(resp => resp.wgtdiff !== "0.0");
      (<NgcFormArray>this.volumetricScannerForm.get(['volumetricWeightSummary'])).patchValue(filterData);
    }
    else if (this.volumetricScannerForm.get('volWgtexceedShipWgt').value) {
      let filterData = []
      filterData = this.volScannerResponse.filter(resp => resp.accptvolwgt > resp.awbwgt);
      (<NgcFormArray>this.volumetricScannerForm.get(['volumetricWeightSummary'])).patchValue(filterData);
    }
    else if (this.volumetricScannerForm.get('allVolumetricShipments').value) {
      let filterData = [];
      filterData = this.volScannerResponse;
      (<NgcFormArray>this.volumetricScannerForm.get(['volumetricWeightSummary'])).patchValue(filterData);
    }
  }
  onOpen(group) {

    const requestObj = {
      'shipmentNumber': this.volumetricScannerForm.getRawValue().volumetricWeightSummary[group].awbNumber
    };
    this.acceptanceService.fetchVolumetricScannerImageDetails(requestObj).subscribe(response => {
      const responseData = response.data;
      if (responseData && responseData.length > 0) {
        this.showChildDataFlag1 = true;
        this.awbNumber = "  " + this.volumetricScannerForm.getRawValue().volumetricWeightSummary[group].awbNumber;
        this.displayChildDataImages.open();
        this.entityKeyData = this.volumetricScannerForm.getRawValue().volumetricWeightSummary[group].awbNumber;
      }
      else if (!response.messageList) {
        this.showErrorStatus("no.record");
      } else {
        this.showErrorStatus(response.messageList[0].code);
      }
    });
  }

}
