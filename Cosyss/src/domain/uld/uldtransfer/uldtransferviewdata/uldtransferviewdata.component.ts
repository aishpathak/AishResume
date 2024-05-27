// Angular imports
import { Component, OnInit, Input, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Framework imports
import { NgcFormGroup, NgcFormControl, NgcFormArray, NgcPage, NgcDataTableComponent, PageConfiguration, NgcUtility } from 'ngc-framework';

// ULD Transfer View Data
import { UldTransferViewDataRequest, UldTransferViewDataResponse } from '../../uld.shared';
import { UldService } from '../../uld.service';

/**
 * Used for detailed view
 * ULD Stock Tranfer
 * of single transaction
 *
 * @export
 * @class UldtransferViewDataComponent
 * @extends {NgcPage}
 * @implements {OnInit}
 */
@Component({
  selector: 'ngc-uldtransfernew',
  templateUrl: './uldtransferviewdata.component.html',
  styleUrls: ['./uldtransferviewdata.component.scss'],
})
@PageConfiguration({
  trackInit: true,
  //callNgOnInitOnClear: true
  autoBackNavigation: true
})
export class UldtransferViewDataComponent extends NgcPage {

  transferData: any;
  transferdatalist: any;
  osiMessageList: any;

  private uldTansferViewDataForm: NgcFormGroup = new NgcFormGroup
    ({
      transferId: new NgcFormControl(),
      transferCarrier: new NgcFormControl(),
      transCarrierName: new NgcFormControl(),
      receivingCarrier: new NgcFormControl(),
      receivCarrierName: new NgcFormControl(),
      lucReceiptNum: new NgcFormControl(),
      transferAirport: new NgcFormControl(),
      issueDateTime: new NgcFormControl(),
      unfinalizedflag: new NgcFormControl('Y'),
      createdBy: new NgcFormControl(),
      uldTransList: new NgcFormArray(
        [
        ]
      )
    });
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute
  ) {

    super(appZone, appElement, appContainerElement);
    // TODO remove below comment
    // this.functionId = "PLAYGROUND";
  }
  /**
   * On initialization transferdata from view page
   * is set to display
   *
   * @memberof UldtransferViewDataComponent
   */
  ngOnInit() {
    this.transferData = this.getNavigateData(this.activatedRoute);
    console.log(this.transferData);
    this.transferdatalist = this.transferData.uldTransfers;
    this.osiMessageList = this.transferData.uldRemarks;
    this.setvalues();
    if (this.transferdatalist.length > 0) {
      for (let item of this.transferdatalist) {
        item.usedBy = this.transferData.transferCarrier;
      }
      //this.transferdatalist[0].usedBy = this.transferData.transferCarrier;
      (<NgcFormArray>this.uldTansferViewDataForm.controls['uldTransList']).patchValue(this.transferdatalist);
    }

  }
  /**
   * Set values of form controls
   * for display purpose
   *
   * @memberof UldtransferViewDataComponent
   */
  setvalues() {
    this.uldTansferViewDataForm.get('transferId').setValue(this.transferData.transferId);
    this.uldTansferViewDataForm.get('transferCarrier').setValue(this.transferData.transferCarrier);
    this.uldTansferViewDataForm.get('transCarrierName').setValue(this.transferData.transCarrierName);
    this.uldTansferViewDataForm.get('receivingCarrier').setValue(this.transferData.receivingCarrier);
    this.uldTansferViewDataForm.get('receivCarrierName').setValue(this.transferData.receivCarrierName);
    this.uldTansferViewDataForm.get('issueDateTime').setValue(this.transferData.finalizedDateTime);
    this.uldTansferViewDataForm.get('lucReceiptNum').setValue(this.transferData.lucReceiptNum);
    this.uldTansferViewDataForm.get('createdBy').setValue(this.transferData.createdBy);
    this.uldTansferViewDataForm.get('transferAirport').setValue(this.transferData.transferAirport);
    this.concaterecieptnumber();
    /**Bug-2046 starts*/
    if (NgcUtility.isBlank(this.transferData.transCarrierName)) {
      this.retrieveLOVRecords('CARRIER').subscribe(data => {
        for (const eachRow of data) {
          if (eachRow.code === this.transferData.transferCarrier) {
            this.uldTansferViewDataForm.get('transCarrierName').setValue(eachRow.desc);
            return;
          }
        }
      });
    }
    if (NgcUtility.isBlank(this.transferData.receivCarrierName)) {
      this.retrieveLOVRecords('CARRIER').subscribe(data => {
        for (const eachRow of data) {
          if (eachRow.code === this.transferData.receivingCarrier) {
            this.uldTansferViewDataForm.get('receivCarrierName').setValue(eachRow.desc);
            return;
          }
        }
      });
    }
    /**Bug-2046 ends */
  }
  /**
   * To concatinate awbPrefix,luc serial number,
   * lucrecieptnumber
   *
   * @memberof UldtransferViewDataComponent
   */
  concaterecieptnumber() {

    for (let index = 0; index < this.transferdatalist.length; index++) {
      this.transferdatalist[index]['recieptnumber'] = this.transferdatalist[index]['awbPrefix'] + '-'
        + this.transferdatalist[index]['lucSerialNo'] + '-' + this.transferdatalist[index]['lucReceiptNum'];
    }

  }
}
