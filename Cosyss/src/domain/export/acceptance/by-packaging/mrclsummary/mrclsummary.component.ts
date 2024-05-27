
import { Component, ViewChild } from '@angular/core';
import { ElementRef, NgZone, ViewContainerRef } from '@angular/core';
import { NgcFormArray, NgcFormControl, NgcUtility, UserProfile, DateTimeKey, NgcFormGroup, NgcPage, NgcReportComponent, PageConfiguration } from 'ngc-framework';
import { MrclserviceService } from './mrclservice.service';
import { Router } from '@angular/router';
import { ActivatedRoute, } from '@angular/router';
import { ReportForMrclSummary } from '../../../export.sharedmodel';

@Component({
  selector: 'app-mrclsummary',
  templateUrl: './mrclsummary.component.html',
  styleUrls: ['./mrclsummary.component.scss']
})

// @PageConfiguration({
//   trackInit: true,
//   callNgOnInitOnClear: true,
//   autoBackNavigation: true
// })

export class MRCLSummaryComponent extends NgcPage {
  //TO DO NAME CHANGE OF ALL THE REPORTS
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;


  iata: boolean = true;
  show: boolean = false;
  showDataTable = false;
  searchResult: boolean = false;
  searchResult1: boolean = false;
  selectionRowIndex: any;
  respArray: any[];
  reportParameters: ReportForMrclSummary;
  reportParameters1: any;
  reportParameters2: any;
  flgMix: boolean = false;
  reportBulk: string;
  reportMix: string;
  reportPrepack: string;
  searchFlag: boolean = false;
  mRclSummaryXLS: string;
  mrcl_summary: string;
  rclNoFlag: boolean = false;

  // TO DO PURPOSE OF THE FORM
  mrclsummaryFormSearch: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    acceptanceType: new NgcFormControl('ALL'),
    prelodgeCreationDateFrom: new NgcFormControl(),
    prelodgeCreationDateTo: new NgcFormControl(),
    shipmentStatus: new NgcFormControl(),
    securityScreeningOption: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    carriergroup: new NgcFormControl(),
    agentName: new NgcFormControl(),
    agentIATACode: new NgcFormControl(),
    prelodgeServiceNo: new NgcFormControl(),
    truckNumber: new NgcFormControl(),
    screeningSecuredTransportationMethod: new NgcFormControl()
  });

  // TO DO PURPOSE OF THE FORM
  mrclsummaryForm: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    acceptanceType: new NgcFormControl(),
    shipmentDate: new NgcFormControl(),
    shipmentDateTo: new NgcFormControl(),
    shipmentStatus: new NgcFormControl(),
    securityScreeningOption: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    carriergroup: new NgcFormControl(),
    agentName: new NgcFormControl(),
    agentIATACode: new NgcFormControl(),
    prelodgeServiceNo: new NgcFormControl(),
    truckNumber: new NgcFormControl(),
    screeningSecuredTransportationMethod: new NgcFormControl(),
    mRCLSummaryTable: new NgcFormArray([])
  });
  formatType: string;
  reportIdParam: string;
  currentDate: Date;
  agentName: string;

  // TO DO COMMENTS
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute,
    private router: Router, private mrclService: MrclserviceService) {
    super(appZone, appElement, appContainerElement);
  }

  // TO DO COMMENTS
  ngAfterViewInit() {
    this.currentDate = new Date;
    let userInfo: UserProfile = this.getUserProfile();
    this.agentName = userInfo.customerCode;

    this.mrclsummaryFormSearch.get('agentName').setValue(this.agentName);
    this.mrclsummaryFormSearch.get('prelodgeCreationDateFrom').setValue(this.currentDate);
    this.mrclsummaryFormSearch.get('prelodgeCreationDateTo').setValue(this.currentDate);


    const param = this.getNavigateData(this.activatedRoute); // to get the title for the page
    if (param && param.acceptanceType) {
      this.mrclsummaryFormSearch.get('prelodgeServiceNo').setValue(param.prelodgeServiceNo);
      if (param.acceptanceType === 'Bulk' || param.acceptanceType === 'Prepack') {
        this.mrclsummaryFormSearch.get('shipmentNumber').setValue(param.shipmentNumber);
      } else if (param.acceptanceType === 'Mix') {
        this.mrclsummaryFormSearch.get('uldNumber').setValue(param.uldNumber);
      }
      this.mrclsummaryFormSearch.get('acceptanceType').setValue(param.acceptanceType);
      this.mrclsummaryFormSearch.get('shipmentStatus').setValue(param.shipmentStatus);
      this.mrclsummaryFormSearch.get('securityScreeningOption').setValue(param.securityScreeningOption);
      this.mrclsummaryFormSearch.get('prelodgeCreationDateFrom').setValue(param.prelodgeCreationDateFrom);
      this.mrclsummaryFormSearch.get('prelodgeCreationDateTo').setValue(param.prelodgeCreationDateTo);
      this.onSearch();
    }
  }

  // TO DO COMMENTS
  ngOnInit() {

  }
  clear(event): void {
    let userInfo: UserProfile = this.getUserProfile();
    this.mrclsummaryForm.reset();
    this.mrclsummaryFormSearch.clean();
    this.mrclsummaryFormSearch.get('prelodgeCreationDateFrom').setValue(this.currentDate);
    this.mrclsummaryFormSearch.get('prelodgeCreationDateTo').setValue(this.currentDate);
    this.mrclsummaryFormSearch.get('agentName').setValue(this.agentName);
    this.resetFormMessages();
  }
  public onCancel(event) {
    this.navigateBack(this.mrclsummaryFormSearch.getRawValue);
  }

  /** Search button function to perform search operation in mRCL */
  onSearch() {
    this.searchFlag = false;
    this.mrclsummaryFormSearch.validate();
    if (this.mrclsummaryFormSearch.invalid) {
      return;
    }
    const request = this.mrclsummaryFormSearch.getRawValue();
    request.prelodgeCreationDateTo = NgcUtility.addDate(request.prelodgeCreationDateTo, (23 * 60) + 59, DateTimeKey.MINUTES);
    this.mrclService.getmRCLSUmmaryList(request).subscribe(data => {
      this.resetFormMessages();
      if (!this.showResponseErrorMessages(data)) {
        if (data.data && data.data.length > 0) {
          for (let ele = 0; ele < data.data.length; ele++) {
            if (!(data.data[ele].rclNumber == null)) {
              this.rclNoFlag = true;

            }
          }

          this.searchResult = true;
          this.respArray = data.data;
          this.mrclsummaryForm.get('mRCLSummaryTable').patchValue(data.data);

        } else {
          this.showErrorStatus("export.report.noshipmentfound");
        }
      }
    });
  }

  /** Create button function to perform create operation for mRCL predeclaration */
  createmRCL() {
    this.searchFlag = true;

    if (this.mrclsummaryFormSearch.invalid) {
      this.mrclsummaryFormSearch.validate();
      return;
    }
    if (this.mrclsummaryFormSearch.get('acceptanceType').value === 'ALL') {
      this.showErrorMessage("exp.mrcl.type.cannot.All.error");
      return;
    }
    const req = this.mrclsummaryFormSearch.getRawValue();

    this.navigateTo(this.router, 'export/acceptance/mRCLPredeclration', req);

  }

  /** Edit button function to edit existing record */
  editmRCL(group) {
    this.selectionRowIndex = group;

    this.navigateTo(this.router, 'export/acceptance/mRCLPredeclration', this.mrclsummaryForm.get(['mRCLSummaryTable', group]).value);
  }

  /** Creating PDF format for mRCL summary */
  createReport(type) {

    let reportParameters: ReportForMrclSummary = this.mrclsummaryFormSearch.getRawValue();
    this.reportParameters = reportParameters;

    this.reportWindow.reportParameters = this.reportParameters;
    this.formatType = 'pdf';
    if (type == 'pdf') {
      this.reportIdParam = 'mrcl_summary';
      this.reportWindow.open();
    } else {
      this.formatType = 'xls';
      this.reportIdParam = 'new_report';
      this.reportWindow.downloadReport();
    }
  }
  /** Creating XLS format for mRCL summary */

  print(type) {
    // if (this.selectionRowIndex >= 0) {
    var dataTosend = this.mrclsummaryForm.get(['mRCLSummaryTable', this.selectionRowIndex]).value;
    //.acceptanceType;
    this.reportParameters = dataTosend;
    if (this.rclNoFlag == false) {
      if (dataTosend.acceptanceType === 'Bulk') {
        this.reportIdParam = 'mRCLBulkbeforerclfinalized';
        this.reportWindow.open();
      }

      else if (dataTosend.acceptanceType === 'Mix') {
        this.reportIdParam = 'mrcl_mixprepackbeforeFinalize_RCL';
        this.reportWindow.open();

      }
      else if (dataTosend === 'Prepack') {
        this.reportIdParam = 'beforemrclprepack';
        this.reportWindow.open();

      }
    }
    else {
      if (dataTosend.acceptanceType === 'Bulk') {
        this.reportIdParam = 'mRCLSummaryBulk';
        this.reportWindow.open();
      }
      else if (dataTosend.acceptanceType === 'Prepack') {
        this.reportIdParam = 'mRCLSummaryPrepackType';
        this.reportWindow.open();

      }
      else if (dataTosend.acceptanceType === 'Mix') {
        this.reportIdParam = 'mRCLSummaaryMixType';
        this.reportWindow.open();
      }
    }
    // }
    // else {
    //   this.showErrorMessage('please choose a record');
    //   return;
    // }
  }


  selectionRow(group) {
    this.selectionRowIndex = group;
  }
  checkCarrierGroup(event) {
    this.mrclsummaryFormSearch.get('carrierCode').patchValue('');
  }
  checkCarrierCode(event) {
    this.mrclsummaryFormSearch.get('carriergroup').patchValue('');
  }
}

