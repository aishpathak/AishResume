import { TRMByAWBSearch, TranshipmentTransferManifestByAWB } from './../transhipment.sharedmodels';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranshipmentService } from '../transhipment.service';
import { Validators } from '@angular/forms';
import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcReportComponent, NgcUtility, NgcWindowComponent } from 'ngc-framework';

@Component({
  selector: 'app-create-trmby-awb',
  templateUrl: './create-trmby-awb.component.html',
  styleUrls: ['./create-trmby-awb.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class CreateTrmbyAwbComponent extends NgcPage implements OnInit {

  showPage: boolean = false;
  cancelFlag: boolean = false;
  finalizeFlag: boolean = false;
  stopFlag = false;
  showTable = false;
  reportParameters: any = new Object();
  selectionDateTimeOptionalFlag: boolean = false;
  flightOptionalFlag: boolean = false;

  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @ViewChild('retrieveTrmWindow') retrieveTrmWindow: NgcWindowComponent;


  form: NgcFormGroup = new NgcFormGroup({
    transferringCarrier: new NgcFormControl(),
    onwardCarrier: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    printerName: new NgcFormControl(),
    awbList: new NgcFormArray([]),
    // retreiveTrmInfo: new NgcFormGroup({
    //   trmNumber: new NgcFormControl(),
    //   issuedDate: new NgcFormControl(),
    //   carrierCodeFrom: new NgcFormControl(),
    //   carrierCodeTo: new NgcFormControl(),
    //   handlingTerminalCode: new NgcFormControl(),
    //   awbInfoList: new NgcFormArray([
    //     new NgcFormGroup({
    //       select: new NgcFormControl(),
    //       shipmentNumber: new NgcFormControl(),
    //       origin: new NgcFormControl(),
    //       destination: new NgcFormControl(),
    //       inboundFlightNumber: new NgcFormControl(),
    //       inboundFlightDate: new NgcFormControl(),
    //       remarks: new NgcFormControl(),
    //       inventoryDetails: new NgcFormArray([
    //         new NgcFormGroup({
    //           shipmentLocation: new NgcFormControl(),
    //           wareHouseLocation: new NgcFormControl(),
    //           pieces: new NgcFormControl(),
    //           weight: new NgcFormControl(),
    //           transferPieces: new NgcFormControl(),
    //           transferWeight: new NgcFormControl(),
    //           targetLocation: new NgcFormControl()
    //         })
    //       ]),
    //     })
    //   ])
    // })
  });


  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private route: ActivatedRoute,
    private router: Router,
    private _transhipmentService: TranshipmentService) {
    super(appZone, appElement, appContainerElement);
  }
  ngOnInit() {
    console.log(this._transhipmentService.createTrmData);
    if (this._transhipmentService.createTrmData && this._transhipmentService.createTrmData !== null) {
      this.form.patchValue(this._transhipmentService.createTrmData);
      this.search();
      this.showPage = true;
      this._transhipmentService.createTrmData = null;
    } else {

      const newPage = new TRMByAWBSearch()
      newPage.awbList = new Array<TranshipmentTransferManifestByAWB>();
      this.form.patchValue(newPage);
      this.showPage = true;
    }


    this.form.controls.trmNumber.valueChanges.subscribe(
      (newValue) => {
        if (newValue !== null && newValue !== "")
          this.selectionDateTimeOptionalFlag = true;
      });
  }

  search() {

    if (!this.validateForm()) {
      this.showErrorMessage("error.import.enter.mandatory.fields");
      return;
    }

    console.log(this.form.getRawValue());
    let searchRequest = new TRMByAWBSearch();
    searchRequest = this.form.getRawValue();
    searchRequest.trmNumber = this.setNUllForEmpty(searchRequest.trmNumber);
    searchRequest.carrierCodeFrom = this.setNUllForEmpty(searchRequest.carrierCodeFrom);
    searchRequest.carrierCodeTo = this.setNUllForEmpty(searchRequest.carrierCodeTo);
    searchRequest.airlineNumber = this.setNUllForEmpty(searchRequest.airlineNumber);
    searchRequest.shipmentNumber = this.setNUllForEmpty(searchRequest.shipmentNumber);
    searchRequest.flightKey = this.setNUllForEmpty(searchRequest.flightKey);
    searchRequest.flightDate = this.setNUllForEmpty(searchRequest.flightDate);
    searchRequest.awbList = null;
    this._transhipmentService.getTranshipmentByAWBList(searchRequest).subscribe(resp => {
      const response = resp;
      this.refreshFormMessages(response);
      if (response.data === null || response.data.awbList === null || response.data.awbList.length === 0) {
        this.showTable = false;
        this.showErrorMessage("no.record.found");
      } else {
        this.showTable = true;
        response.data.awbList.forEach(e => {
          if (e.finalizedFlag === false || e.finalizedFlag === null) {
            e.finalizedFlag = 'N';
          } else {
            e.finalizedFlag = 'Y';
          }

          if (e.finalizedFlag === 'Y' && e.finalizedDate !== null && e.finalizedBy !== null) {

            e.finalizedBy = "(" + e.finalizedBy + " " + NgcUtility.getDateTimeAsString(NgcUtility.getDateTimeByAnyFormat(e.finalizedDate)).toUpperCase() + ")";
          } else {
            e.finalizedDate = null;
            e.finalizedBy = null;
          }

          e['edit'] = '';
          e['screenCode'] = 'createTrm';

          // if (e.cargoRetreived === true) {
          //   e.cargoRetreived = 'Y'
          // } else {
          //   e.cargoRetreived = 'N'
          // }
        })
        this.form.patchValue(response.data);
      }
    }, error => {
      console.log(error);
    })
    // clear the data of selected rows
    this.tempCheckedDataList = new NgcFormArray([]);
  }

  validateForm() {

    if (this.form.get('flightDate').value != null && this.form.get('flightDate').value != '' && (this.form.get('flightKey').value == null || this.form.get('flightKey').value == '')) {
      return false;
    }
    console.log(this.form.get('flightKey').value);
    return (
      this.form.get('issueDateFrom').valid
      && this.form.get('issueDateTo').valid
      && this.form.get('flightKey').valid
      && this.form.get('flightDate').valid
    ) ? true : false;
  }

  cancelAWB() {
    let cancelRequest = new TRMByAWBSearch();
    this.cancelFlag = true;

    cancelRequest.awbList = this.checkSelectData().getRawValue();
    cancelRequest.awbList.forEach(ele => {
      ele.finalizedFlag = ele.finalizedFlag === 'Y' ? true : false;
      if (ele.finalizedFlag === 'true' || ele.finalizedFlag === true || ele.finalizedFlag === 'Y') {
        this.showErrorMessage("select.not.finalize.records");
        this.stopFlag = true;
        return;
      }

      // ele.cargoRetreived = ele.cargoRetreived === 'Y' ? true : false;
    });
    if (this.stopFlag) {
      return;
    }
    cancelRequest.awbList.forEach(awb => {
      awb.cancelledBy = awb.createdBy;
    });
    this._transhipmentService.cancelTranshipmentAWB(cancelRequest).subscribe(resp => {
      const response = resp;
      // if (response.messageList)
      //   response.messageList.forEach((message) => {
      //     if (message.referenceId) {
      //       // TODO! - Need to Fix in Service
      //       message.referenceId = message.referenceId.replace(/\]/g, "").replace(/\[/g, ".");
      //       console.log(message.referenceId);
      //     }
      //   });
      console.log(response);

      this.refreshFormMessages(response);
      if (response.messageList === null)
        this.search();

    }, error => {
      console.log(error);
    })
    this.cancelFlag = false;
  }
  checkSelectData(): NgcFormArray {
    let returnObject = new NgcFormArray([]);
    let count = 0;
    (<NgcFormArray>this.form.get('awbList')).controls.forEach((awb: NgcFormGroup) => {
      if (awb.get('select').value) {
        returnObject.addValue([awb.getRawValue()]);
        count++;
      }
    });
    if (count == 0) {
      this.stopFlag = true;
      this.showErrorMessage("select.trm");
    } else {
      this.stopFlag = false;
    }
    return returnObject;
  }


  newTRMByAWB() {
    ///import/transhipment/create-trm-by-awb
    this.navigateTo(this.router, '/import/transhipment/maintainTRMByAWB', null);
  }

  finalize() {
    this.finalizeFlag = true;
    let finalizeRequest: TRMByAWBSearch = new TRMByAWBSearch();
    finalizeRequest.awbList = this.checkSelectData().getRawValue();
    if (this.stopFlag) {
      return;
    }
    finalizeRequest.issueDateFrom = this.form.get('issueDateFrom').value;
    finalizeRequest.issueDateTo = this.form.get('issueDateTo').value;
    finalizeRequest.printerName = this.form.get('printerName').value;
    finalizeRequest.awbList.forEach(awb => {
      awb.finalizedBy = awb.createdBy;
      awb.finalizedDate = new Date();
      awb.finalizedFlag = true;
      awb.printerName = this.form.get('printerName').value;
      // console.log(awb.cargoRetreived);
      // if (awb.cargoRetreived == "Y") {
      //   awb.cargoRetreived = true;
      // } else {
      //   awb.cargoRetreived = false;
      // }
    })
    console.log(finalizeRequest);
    this._transhipmentService.finalizeTranshipmentAWB(finalizeRequest).subscribe(resp => {
      const response = resp;
      // if (response.messageList)
      //   response.messageList.forEach((message) => {
      //     if (message.referenceId) {
      //       // TODO! - Need to Fix in Service
      //       message.referenceId = message.referenceId.replace(/\]/g, "").replace(/\[/g, ".");
      //       console.log(message.referenceId);
      //     }
      //   });
      console.log(response);

      this.refreshFormMessages(response);
      // this.onPrint();
      if (response.messageList === null)
        this.search();

    }, error => {
      console.log(error);
    })
    this.finalizeFlag = false;
  }

  unFinalize() {
    let finalizeRequest: TRMByAWBSearch = new TRMByAWBSearch();
    finalizeRequest.awbList = this.checkSelectData().getRawValue();
    finalizeRequest.awbList.forEach(ele => {
      if (ele.finalizedBy === null) {
        this.showErrorMessage("select.finalize.records");
        this.stopFlag = true;
        return;
      }
    });
    if (this.stopFlag) {
      return;
    }
    finalizeRequest.issueDateFrom = this.form.get('issueDateFrom').value;
    finalizeRequest.issueDateTo = this.form.get('issueDateTo').value;
    finalizeRequest.printerName = this.form.get('printerName').value;
    finalizeRequest.awbList.forEach(awb => {
      awb.finalizedBy = null;
      awb.finalizedDate = null;
      awb.finalizedFlag = false;
      awb.printerName = this.form.get('printerName').value;
      // console.log(awb.cargoRetreived);
      // if (awb.cargoRetreived == "Y") {
      //   awb.cargoRetreived = true;
      // } else {
      //   awb.cargoRetreived = false;
      // }
    })
    console.log(finalizeRequest);
    this._transhipmentService.unfinalizeTranshipmentAWB(finalizeRequest).subscribe(resp => {
      const response = resp;
      // if (response.messageList)
      //   response.messageList.forEach((message) => {
      //     if (message.referenceId) {
      //       // TODO! - Need to Fix in Service
      //       message.referenceId = message.referenceId.replace(/\]/g, "").replace(/\[/g, ".");
      //       console.log(message.referenceId);
      //     }
      //   });
      console.log(response);

      this.refreshFormMessages(response);
      if (response.messageList === null)
        this.search();

    }, error => {
      this.showErrorMessage(error);
      console.log(error);
    })
  }

  onClear(event) {
    this.form.reset();
  }

  getINfo(awb: NgcFormGroup) {
    this._transhipmentService.createTrmData = this.form.getRawValue();
    console.log(awb);
    this.navigateTo(this.router, '/import/transhipment/maintainTRMByAWB', awb.getRawValue());
  }

  setNUllForEmpty(object) {
    if (object === '') {
      return null;
    }
    return object;
  }

  tempCheckedDataList: NgcFormArray = new NgcFormArray([]);
  addCheckBoxData(awb, index) {
    if (awb.get('select').value) {
      console.log(awb.getRawValue());
      this.tempCheckedDataList.addValue([{ 'data': awb.getRawValue(), 'index': index }]);
      console.log(this.tempCheckedDataList.getRawValue());
    }
    else {
      console.log(awb.getRawValue());
      this.tempCheckedDataList.deleteValue([{ 'data': awb.getRawValue(), 'index': index }]);
      console.log(this.tempCheckedDataList.getRawValue());

    }
    console.log(this.tempCheckedDataList.getRawValue());
  }

  onPrint() {
    if (this.form.get('printerName').value == null || this.form.get('printerName').value == '') {
      this.showErrorMessage("g.selectprinter.m");
      return;
    }
    if (this.tempCheckedDataList.length == 0) {
      this.showErrorMessage("Select atleast one Reference number!");
      return;
    }
    if (this.tempCheckedDataList.length > 1) {
      this.showErrorMessage("only.one.reference.number");
    } else {
      let printData = new TranshipmentTransferManifestByAWB();
      let trmNumber = null;
      (<NgcFormArray>this.tempCheckedDataList).getRawValue().forEach((element: any) => {
        //  let data = element.getRawValue();
        trmNumber = element.data.trmNumber;
        printData.airlineNumber = element.data.airlineNumber;
        printData.awbInfoList = element.data.awbInfoList;
        printData.carrierCodeFrom = element.data.carrierCodeFrom;
        printData.carrierCodeTo = element.data.carrierCodeTo;
        printData.issuedBy = element.data.issuedBy;
        printData.trmNumber = element.data.trmNumber;
        printData.transTransferManifestByAwbId = element.data.transTransferManifestByAwbId;
        printData.issuedDate = element.data.issuedDate;
        printData.createdBy = element.data.createdBy;
        printData.printerName = this.form.get('printerName').value;
        console.log(printData);

      });
      this._transhipmentService.printManifestData(printData).subscribe(resp => {
        this.refreshFormMessages(resp);
        if (resp.messageList == null) {
          if (trmNumber != '') {
            this.reportParameters.trmNumber = trmNumber;
            this.reportWindow.open();

          }
        }
      });
    }
  }

  onCancel(event) {
    this.navigateHome();
  }


  onFlightChange(event) {
    if (this.form.get('flightKey').value != null || this.form.get('flightDate').value != null) {
      this.flightOptionalFlag = true;
      this.selectionDateTimeOptionalFlag = true;
    } else {
      this.flightOptionalFlag = false;
      this.selectionDateTimeOptionalFlag = false;
    }
  }

  // retrieveTrm() {
  //   let selectedData = this.tempCheckedDataList.getRawValue();
  //   console.log(selectedData);

  //   if (selectedData.length > 1) {
  //     this.showErrorMessage("expaccpt.select.one.row.only");
  //     return;
  //   }
  //   else if (selectedData.length < 1) {
  //     this.showErrorMessage("export.select.a.record");
  //     return;
  //   }

  //   if (selectedData[0].data.finalizedFlag != 'Y') {
  //     this.showErrorMessage("trm.retrieve.allowed.for.finalizedtrm");
  //     return;
  //   }

  //   console.log(selectedData[0].data.trmNumber);

  //   this.retrieveTrmWindow.open();
  //   this.form.get('retreiveTrmInfo').reset();

  //   let searchRequest = new TRMByAWBSearch();
  //   searchRequest.trmNumber = selectedData[0].data.trmNumber;
  //   this._transhipmentService.getRetrieveTrmInfo(searchRequest).subscribe(response => {
  //     console.log(response);
  //     if (response.messageList) {
  //       this.showErrorStatus(response.messageList[0].code);
  //       return;
  //     }
  //     if (response.data) {
  //       this.form.get('retreiveTrmInfo').reset();
  //       this.form.get('retreiveTrmInfo').patchValue(response.data);
  //     }

  //   });
  //   // this.form.get('retreiveTrmInfo').patchValue(retreiveTrmInfo);
  // }

  // onRetriveClick() {
  //   let rawData = new NgcFormArray([]);
  //   let count = 0;
  //   (<NgcFormArray>this.form.get('retreiveTrmInfo.awbInfoList')).controls.forEach((awb: NgcFormGroup) => {
  //     if (awb.get('select').value) {
  //       rawData.addValue([awb.getRawValue()]);
  //       count++;
  //     }
  //   });
  //   if (count == 0) {
  //     this.showErrorMessage("export.select.a.record");
  //     return;
  //   }
  //   console.log(rawData.getRawValue());

  //   let selectedRecord = {
  //     trmNumber: this.form.get('retreiveTrmInfo.trmNumber').value,
  //     awbInfoList: rawData.getRawValue()
  //   };

  //   this._transhipmentService.saveRetrieveTrmInfo(selectedRecord).subscribe(response => {
  //     console.log(response.data);
  //     if (response.messageList) {
  //       this.showErrorStatus(response.messageList[0].code);
  //       return;
  //     }
  //     if (response.data) {
  //       this.form.get('retreiveTrmInfo.awbInfoList').reset();
  //       this.form.get('retreiveTrmInfo.awbInfoList').patchValue(response.data.awbInfoList);
  //     }
  //   }, error => {
  //     this.showErrorMessage(error);
  //     console.log(error);
  //   });
  // }

  // closeRetreiveWindow() {
  //   this.retrieveTrmWindow.close();
  // }
}

