import { Component, OnInit } from '@angular/core';
import { ComponentFactoryResolver, ElementRef, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcApplication, NgcButtonComponent, PageConfiguration, NgcFormArray, NgcFormControl, NgcFormGroup, NgcReportComponent, NgcPage, NgcUtility, DateTimeKey } from 'ngc-framework';
import { SearchRclSummaryReq } from '../../../export.sharedmodel';
import { RclserviceService } from '../rclservice.service';
//import { ExportService } from "./../export.service";


@Component({
  selector: 'app-rclsummary',
  templateUrl: './rclsummary.component.html',
  styleUrls: ['./rclsummary.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class RclsummaryComponent extends NgcPage implements OnInit {
  @ViewChild("reportWindow1") reportWindow1: NgcReportComponent;
  @ViewChild("reportWindow2") reportWindow2: NgcReportComponent;

  //show: boolean = false;
  resp: any;
  responseArray: any = null;
  rcl_summaryReport1 = 'rcl_summary';
  reportParameters1: any;
  rcl_summaryReport2 = 'rcl_summaryXls';
  reportParameters2: any;
  //rclsummarylist: any[];
  //showDataTable = false;
  //rcltable: any[];
  private RCLSummaryForm: NgcFormGroup = new NgcFormGroup({

    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    serviceNumber: new NgcFormControl(),
    agentName: new NgcFormControl(),
    incomingFlight: new NgcFormControl(),
    incomingFlightDate: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    carrierGroup: new NgcFormControl(),
    status: new NgcFormControl(),

    rcltable: new NgcFormArray([
      // new NgcFormGroup({
      //   select: new NgcFormControl(),
      //   serviceInformationId: new NgcFormControl(),
      //   //rcl_date: new NgcFormControl(),
      //   acceptanceType: new NgcFormControl(),
      //   shipmentNumber: new NgcFormControl(),
      //   uldNumber: new NgcFormControl(),
      //   origin: new NgcFormControl(),
      //   destination: new NgcFormControl(),
      //   airsideAcceptance: new NgcFormControl(),
      //   racsf: new NgcFormControl(),
      //   documentPieces: new NgcFormControl(),
      //   documentWeight: new NgcFormControl(),
      //   piece: new NgcFormControl(),
      //   weight: new NgcFormControl(),
      //   natureOfGoods: new NgcFormControl(),
      //   //specialHandlingCode: new NgcFormControl(),
      //   // sc: new NgcFormControl(),
      //   // car: new NgcFormControl(),
      //   returnPiece: new NgcFormControl(),
      //   returnWeight: new NgcFormControl(),
      //   trmNumber: new NgcFormControl(),
      //   // trf_carr: new NgcFormControl(),
      //   // cc: new NgcFormControl(),
      //   agentName: new NgcFormControl(),
      //   status: new NgcFormControl()

      // })

    ])


  });
  searchResult: boolean = false;
  searchResultData: boolean = true;
  selectionRowIndex: any;
  respArray: any[];
  navigateData: any;
  private carrierFlg: boolean = false;
  private carrierGroupCodeParam: any;


  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    //private ExportService: ExportService,
    private rclService: RclserviceService, private router: Router, private activatedRoute: ActivatedRoute,
    appComponentResolver: ComponentFactoryResolver) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.navigateData = this.getNavigateData(this.activatedRoute);
  }

  ngAfterViewInit() {
    const param = this.getNavigateData(this.activatedRoute);
    if (param && param.rclNumber) {
      console.log(param.rclNumber);
      console.log(param);
      this.RCLSummaryForm.get('serviceNumber').setValue(param.rclNumber);
      this.RCLSummaryForm.get('fromDate').setValue(param.rclDate);
      this.RCLSummaryForm.get('toDate').setValue(param.rclDate);
      // this.RCLSummaryForm.get('fromDate').setValue(new Date());
      // this.RCLSummaryForm.get('toDate').setValue(new Date());
      this.onSearch();
    }
  }
  onCancel() {
    this.navigateBack(this.navigateData);
  }


  formSearchObject(): SearchRclSummaryReq {
    const req = new SearchRclSummaryReq();
    req.fromDate = this.RCLSummaryForm.get('fromDate').value;
    req.toDate = this.RCLSummaryForm.get('toDate').value;
    req.shipmentNumber = this.RCLSummaryForm.get('shipmentNumber').value;
    req.uldNumber = this.RCLSummaryForm.get('uldNumber').value;
    req.serviceNumber = this.RCLSummaryForm.get('serviceNumber').value;
    req.incomingFlight = this.RCLSummaryForm.get('incomingFlight').value;
    req.incomingFlightDate = this.RCLSummaryForm.get('incomingFlightDate').value;
    req.carrierCode = this.RCLSummaryForm.get('carrierCode').value;
    req.carrierGroup = this.RCLSummaryForm.get('carrierGroup').value;
    req.status = this.RCLSummaryForm.get('status').value;
    req.agentName = this.RCLSummaryForm.get('agentName').value;
    return req;
  }

  onSearch() {
    this.searchResult = false;
    if (!(this.RCLSummaryForm.get('fromDate').value && this.RCLSummaryForm.get('toDate').value)) {
      this.showErrorStatus('export.accpt.datevalidation');
      return;
    }
    if (new Date(this.RCLSummaryForm.get('fromDate').value) > new Date(this.RCLSummaryForm.get('toDate').value)) {
      this.showErrorMessage("data.from.to.date.greater");
      return;

    }

    const searchRequest: SearchRclSummaryReq = this.formSearchObject();
    searchRequest.toDate = NgcUtility.addDate(searchRequest.toDate, (23 * 60) + 59, DateTimeKey.MINUTES)
    this.rclService.rclSummaryList(searchRequest).subscribe(resp => {
      if (!this.showResponseErrorMessages(resp)) {
        this.searchResult = true;
        if (resp.success && (resp.data != '' && resp.data != null)) {
          this.searchResultData = false;
        }
        else {
          this.showErrorStatus("no.record");
          this.searchResultData = true;
        }
        console.log("rcl summary resp", resp);
        let count = 1;
        resp.data.forEach(ele => {
          ele.select = false;
          ele.sequenceNumber = count;
          count++;
          let shcCodes = '';
          let shcCodesLength = ele.specialHandlingCode.length;
          let SHCs: any[];
          ele.specialHandlingCode.forEach((element, index) => {
            //SHCs.push(element.specialHandlingCode);
            if (index != shcCodesLength - 1) {
              shcCodes = shcCodes + element.specialHandlingCode + ', '
            }
            else {
              shcCodes = shcCodes + element.specialHandlingCode
            }
          });
          // shcCodes = SHCs.join(", ");
          // console.log(SHCs);
          ele.shcCodes = shcCodes;
          if (ele.requiredScreening == true) {
            ele.requiredScreening = "Y"
          }
          else {
            ele.requiredScreening = "N"
          }
          if (ele.car == true) {
            ele.car = "Y"
          }
          else {
            ele.car = "N"
          }
        });
        this.respArray = resp.data;
        this.RCLSummaryForm.controls.rcltable.patchValue(this.respArray);
      }
    });
  }

  getCarrierCodeByCarrierGroup(event) {
    this.carrierFlg = false;
    if (event.desc != undefined) {
      this.carrierGroupCodeParam = this.createSourceParameter(this.RCLSummaryForm.get('carrierGroup').value);
      this.carrierFlg = true;
    }

  }

  selectionRow(event, group, index) {
    console.log("index", index)
    console.log("group", group)
    this.selectionRowIndex = group;
  }

  editRCL() {
    console.log("navigatedata", this.respArray[this.selectionRowIndex].serviceInformationId)

    // this.navigateData.rclno = this.respArray[this.selectionRowIndex].serviceInformationId;
    // this.navigateTo(this.router, 'export/acceptance/maintainRcl', this.navigateData);

    var dataTosend = {
      serviceInformationId: this.respArray[this.selectionRowIndex].serviceInformationId,
      acceptanceType: this.respArray[this.selectionRowIndex].acceptanceType
    };
    this.navigateTo(this.router, 'export/acceptance/maintainRcl', dataTosend);

  }

  Mainatinbuplist() {
    // var dataTosend = { serviceInformationId: this.respArray[this.selectionRowIndex].serviceInformationId };
    this.navigateTo(this.router, 'export/buplist', null);
  }


  print(type) {
    const req = this.RCLSummaryForm.getRawValue();
    this.reportParameters1 = new Object();
    {
      this.reportParameters1.fromDate = req.fromDate;
      this.reportParameters1.toDate = req.toDate;
      this.reportParameters1.shipmentNumber = req.shipmentNumber;
      this.reportParameters1.uldNumber = req.uldNumber;
      this.reportParameters1.serviceNumber = req.serviceNumber;
      this.reportParameters1.agentName = req.agentName;
      this.reportParameters1.incomingFlight = req.incomingFlight;
      this.reportParameters1.incomingFlightDate = req.incomingFlightDate;
      this.reportParameters1.carrierCode = req.carrierCode;
      this.reportParameters1.carrierGroup = req.carrierGroup;
      this.reportParameters1.status = req.status;

      this.reportWindow1.reportParameters = this.reportParameters1;
      this.reportWindow1.open();

    }

  }

  RCLSummaryXLS() {

    const req = this.RCLSummaryForm.getRawValue();
    this.reportParameters2 = new Object();
    // if (dataTosend === 'Bulk')
    {
      this.reportParameters2.fromDate = req.fromDate;
      this.reportParameters2.toDate = req.toDate;
      this.reportParameters2.shipmentNumber = req.shipmentNumber;
      this.reportParameters2.uldNumber = req.uldNumber;
      this.reportParameters2.serviceNumber = req.serviceNumber;
      this.reportParameters2.agentName = req.agentName;
      this.reportParameters2.incomingFlight = req.incomingFlight;
      this.reportParameters2.incomingFlightDate = req.incomingFlightDate;
      this.reportParameters2.carrierGroup = req.carrierGroup;
      this.reportParameters2.carrierCode = req.carrierCode;
      this.reportParameters2.status = req.status;

      this.reportWindow2.reportParameters = this.reportParameters2;
      this.reportWindow2.downloadReport();

    }

  }
}


