import { ViewChild, TemplateRef } from '@angular/core';
import { Component, OnInit, ElementRef, NgZone, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FORMERR } from 'dns';
// Application
import { NgcFormArray, NgcFormControl, NgcUtility, NgcFormGroup, NgcPage, PageConfiguration, CellsRendererStyle, NgcReportComponent, NgcWindowComponent } from 'ngc-framework';
import { ShipmentMasterLocalAuthorityInfo } from '../../awbManagement/awbManagement.shared';
import { CustomACESService } from './../customs.service';
import { brkdwnDiscModel } from './../customs.sharedmodel';

@Component({
  selector: 'app-submit-breakdown-discrepancy',
  templateUrl: './submit-breakdown-discrepancy.component.html',
  styleUrls: ['./submit-breakdown-discrepancy.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class SubmitBreakdownDiscrepancyComponent extends NgcPage implements OnInit {

  @ViewChild('shipmentDtl') shipmentDtl: NgcWindowComponent;
  @ViewChild('supposedPcs') supposedPcs: NgcWindowComponent;


  forwardedData: any;
  searchFlag: boolean = false;
  isCloseSupPcsScrn: boolean = true;
  isCloseShpScreen: boolean = true;
  searchFltList: any;
  searchShpList: any;
  fltListIndex: any;
  disableCommitFlag: any;


  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private customACESService: CustomACESService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);

  }

  private brkdwnDiscrepancyForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flightNo: new NgcFormControl(),
    fltArrivalDate: new NgcFormControl(new Date()),
    flightDate: new NgcFormControl(),
    fltOriginDate: new NgcFormControl(),
    flightId: new NgcFormControl(),
    fltBoardPoint: new NgcFormControl(),
    brkdwnDiscVerNo: new NgcFormControl(),
    ata: new NgcFormControl(),
    flightType: new NgcFormControl(),
    shipmentNo: new NgcFormControl(),
    hawbNo: new NgcFormControl(),
    shpmntList: new NgcFormArray([]),
    discrepancyList: new NgcFormArray([]),
    fltDtlList: new NgcFormArray([])

  })


  ngOnInit() {
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    this.brkdwnDiscrepancyForm.patchValue(this.forwardedData);
  }

  //is triggered on click of Search button in main screen, used to fetch search results
  onSearch() {
    let rqstData = new brkdwnDiscModel();
    rqstData.flightDate = this.brkdwnDiscrepancyForm.get('fltArrivalDate').value;
    if (this.brkdwnDiscrepancyForm.get('flightKey').value != null) {
      rqstData.flightNo = this.brkdwnDiscrepancyForm.get('flightKey').value;
    }
    this.customACESService.getBrkdwnDiscFltDtls(rqstData).subscribe(res => {
      this.refreshFormMessages(res);
      if (res.data) {
        this.searchFlag = true;
        this.searchFltList = res.data;
        console.log(res.data);
        this.brkdwnDiscrepancyForm.get('fltDtlList').patchValue(this.searchFltList.flightList);
      }
      else {
        this.searchFlag = false;
        //this.showFormErrorMessages(res.messageList);
      }
    },
      error => {
        this.showErrorStatus(error);
      });


  }

  //used to add serial number in a list
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  //is triggered on click of 'Flt No/Date' column link in flight details, used to open Maintain Operative flight screen
  public openFltOperativeScrn(group): void {
    console.log(<NgcFormControl>this.brkdwnDiscrepancyForm.get(["fltDtlList", group]).value);
    var dataToSend = {
      carrierCode: <NgcFormControl>this.brkdwnDiscrepancyForm.get(["fltDtlList", group, "fltCarrierCode"]).value,
      flightNo: <NgcFormControl>this.brkdwnDiscrepancyForm.get(["fltDtlList", group, "flightNo"]).value,
      flightdateforflight: <NgcFormControl>this.brkdwnDiscrepancyForm.get(["fltDtlList", group, "flightDate"]).value

    }
    this.navigateTo(this.router, "/flight/maintenanceoperativeflight", dataToSend);

  }

  //is triggered on click of Action button in flight details, used to open Shipment details popup
  openShipment(index: any) {
    this.fltListIndex = index;
    let rqstData = new brkdwnDiscModel();
    let row = this.brkdwnDiscrepancyForm.get(['fltDtlList', index]).value;
    rqstData.flightId = row.flightId;
    rqstData.customsFlightId = row.customsFlightId;
    rqstData.flightNo = row.flightNo;
    rqstData.FltCarrierCode = row.FltCarrierCode;
    rqstData.flightDate = row.flightDate;
    this.customACESService.getBrkdwnDiscShpDtls(rqstData).subscribe(res => {
      this.refreshFormMessages(res);
      if (res.data) {
        this.searchShpList = res.data;
        console.log(this.searchShpList);
        this.brkdwnDiscrepancyForm.get('shpmntList').patchValue(this.searchShpList.shipmentList);
        console.log(this.brkdwnDiscrepancyForm.get('shpmntList').value);
        this.disableCommitFlag = this.searchShpList.disableCommit;
        this.brkdwnDiscrepancyForm.get('flightNo').patchValue(row.flightNo);
        this.brkdwnDiscrepancyForm.get('flightId').patchValue(row.flightId);
        this.brkdwnDiscrepancyForm.get('fltBoardPoint').patchValue(row.flightBoardPoint);
        this.brkdwnDiscrepancyForm.get('flightType').patchValue(row.flightType);
        this.brkdwnDiscrepancyForm.get('flightDate').patchValue(row.flightDate);
        this.brkdwnDiscrepancyForm.get('fltOriginDate').patchValue(row.fltOriginDate);
        this.brkdwnDiscrepancyForm.get('brkdwnDiscVerNo').patchValue(this.searchShpList.brkdwnDiscVerNo);
        this.brkdwnDiscrepancyForm.get('ata').patchValue(row.ata);

        this.isCloseShpScreen = false;
        this.shipmentDtl.open();
      }
    }
    );

  }

  //is trigeered on click of 'Supposed Pcs' button in shipment Details, used to open Supposed Pieces popup
  openSupposedPcs() {
    for (let i = 0; i < (<NgcFormArray>this.brkdwnDiscrepancyForm.get(['shpmntList'])).length; i++) {
      if (this.brkdwnDiscrepancyForm.get(['shpmntList', i, 'rselect']).value === true) {
        let row = this.brkdwnDiscrepancyForm.get(['shpmntList', i]).value;
        this.brkdwnDiscrepancyForm.get('shipmentNo').patchValue(row.shipmentNumber);
        this.brkdwnDiscrepancyForm.get('hawbNo').patchValue(row.hawbNumber);
        row.brkdwnDiscVerNo = this.brkdwnDiscrepancyForm.get('brkdwnDiscVerNo').value;
        const spplst = new Array<any>();
        spplst.push(row);
        this.brkdwnDiscrepancyForm.get('discrepancyList').patchValue(spplst);
      }
    }
    this.isCloseSupPcsScrn = false;
    this.supposedPcs.open();
  }

  //used to close Supposed Pieces popup screen
  closeSuppPcsScreen() {
    this.isCloseSupPcsScrn = true;
    this.supposedPcs.close();
  }

  //used to close Shipment Details popup screen
  closeShpDtlScreen() {
    this.isCloseShpScreen = true;
    this.shipmentDtl.close();
  }

  //is triggered on click of 'Submit' button in shipment details, used to submit breakdown discrepancy
  onSubmit() {
    const submitList = new Array<any>();
    for (let i = 0; i < (<NgcFormArray>this.brkdwnDiscrepancyForm.get(['shpmntList'])).length; i++) {
      if (this.brkdwnDiscrepancyForm.get(['shpmntList', i, 'select']).value === true) {
        submitList.push(this.brkdwnDiscrepancyForm.get(['shpmntList', i]).value);
      }
    }
    if (submitList.length > 0) {
      let rqstData = new brkdwnDiscModel();
      rqstData.flightDate = this.brkdwnDiscrepancyForm.get('flightDate').value;
      rqstData.shipmentList = submitList;
      rqstData.flightId = this.brkdwnDiscrepancyForm.get('flightId').value;
      rqstData.flightNo = this.brkdwnDiscrepancyForm.get('flightNo').value;
      rqstData.flightBoardPoint = this.brkdwnDiscrepancyForm.get('fltBoardPoint').value;
      rqstData.flightType = this.brkdwnDiscrepancyForm.get('flightType').value;
      rqstData.brkdwnDiscVerNo = this.brkdwnDiscrepancyForm.get('brkdwnDiscVerNo').value;
      rqstData.fltOriginDate = this.brkdwnDiscrepancyForm.get('fltOriginDate').value;
      this.customACESService.submitBrkdwnDiscDtls(rqstData).subscribe(res => {
        if (!this.showResponseErrorMessages(res)) {
          this.resetFormMessages();
          this.showSuccessStatus('g.completed.successfully');
          this.openShipment(this.fltListIndex);
        }
      });
    }
  }

  onComplete() {

  }

}
