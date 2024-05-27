import { Component, ElementRef, NgZone, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, NgcUtility, PageConfiguration, ReactiveModel } from 'ngc-framework';
// import { ManageRfidform } from '../tracing.shared';
import { TracingService } from './../tracing.service';
import { ManageRfidform } from '../tracing.shared';

@Component({
  selector: 'app-manage-rfid',
  templateUrl: './manage-rfid.component.html',
  styleUrls: ['./manage-rfid.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})


export class ManageRfidComponent extends NgcPage {
  printerName: any;
  showTable: boolean = false;
  showTable1: boolean = false;
  showHistoryTable = false;
  addrow: boolean = false;
  newTagNo: any;
  tagResult: any;
  isaddTAg = true;

  stage: any = 'PRINT';
  tagType: any = 'AWB';
  transferData: any;
  /* 
  * Reactive Form
  */
  @ReactiveModel(ManageRfidform)
  public form: NgcFormGroup = new NgcFormGroup({
    shipmentNo: new NgcFormControl(),
    shppieces: new NgcFormControl(),
    tagNumber: new NgcFormControl(),
    rfidList: new NgcFormArray([]),
    rfidList1: new NgcFormArray([
      new NgcFormGroup({
        pieceNo: new NgcFormControl(),
        pieces: new NgcFormControl()
      })
    ])

  });

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private tracingService: TracingService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);

  }

  ngOnInit() {
    super.ngOnInit();
    this.transferData = this.getNavigateData(this.activatedRoute);
    if (this.transferData != null) {
      this.form.get('shipmentNo').setValue(this.transferData);
      this.onSearchRfid();
    }
  }

  onShipmentNumber() {
    this.showTable = false;
    this.showTable1 = false;
  }

  onSearchRfid() {
    const searchRequest = this.form.getRawValue();
    console.log(searchRequest);
    this.tracingService.onSearchRfid(searchRequest).subscribe(response => {
      if (response.data) {
        this.isaddTAg = true;
        console.log(response.data);
        this.tagResult = response.data;
        if (response.data[0].printedStatus == "Reprint") {
          this.showTable = true;
          this.showTable1 = false;
        } else {
          this.showTable1 = true;
          this.showTable = false;
        }
        let obj = {
          rfidList: response.data,
          rfidList1: new Array(),
          shppieces: response.data[0].shppieces,
          tagNumber: response.data[0].shppieces
        };

        this.refreshFormMessages(response);
        this.form.patchValue(obj);
        this.onAddrow(this.form.controls.tagNumber.value);
        this.newTagNo = 1;
        // const tagRequest = (<NgcFormArray>this.form.get(['rfidList'])).getRawValue();


        //(<NgcFormArray>this.form.get(['rfidList'])).patchValue(response.data);
        //  this.form.get('shppieces').patchValue(response.data[0].shppieces);

      }
      else {
        this.showTable = false;
        this.showTable1 = false;
        this.refreshFormMessages(response);
        this.showErrorMessage("tracing.no.awb.found");
      }
    });
  }

  onSearchByTagId(index) {
    this.showHistoryTable = true;
    const searchByTagId = (<NgcFormGroup>this.form.get(['rfidList', index])).getRawValue();
    console.log(searchByTagId);
    this.tracingService.onSearchByTagId(searchByTagId).subscribe(response => {
      console.log(response);
      if (response.data) {
        this.showHistoryTable = true;
      } else {
        this.showHistoryTable = false;
        this.refreshFormMessages(response);
        //this.showErrorMessage('No AWB Found');
      }
    });
  }

  onPrinterSelect(event) {
    this.printerName = event.code;
  }
  onAddrow(item) {
    (<NgcFormArray>this.form.get('rfidList1')).patchValue(new Array());
    for (let i = 1; i <= item; i++) {

      (<NgcFormArray>this.form
        .get("rfidList1")).addValue([
          {
            pieceNo: i,
            pieces: 1
          }
        ]);
    }
  }
  onReprint() {
    const reprint = (<NgcFormArray>this.form.get(['rfidList'])).getRawValue();
    let x = 0;
    reprint.forEach(a => {
      x = x + a.pieces;
    })
    let y = this.form.get('shppieces').value;
    if (x > y) {
      return this.showErrorStatus("tracing.tag.pieces.more.than.total");
    }
    reprint.forEach(a => {
      a.printerName = this.printerName;
    })
    const reprintRequest = [];
    for (const eachRow of reprint) {
      if (eachRow.select) {
        if (eachRow.printerName) {
          reprintRequest.push(eachRow);
        } else {
          this.showErrorMessage('tracing.select.printer');
          return;
        }

      }
    }


    let obj = {
      shipmentId: null,
      desktop: 'D',
      shipmentNo: this.form.get('shipmentNo').value,
      tagList: reprintRequest
    }
    if (reprintRequest.length > 0) {
      this.tracingService.onReprint(obj).subscribe(response => {
        if (response.data) {
          this.showSuccessStatus('g.completed.successfully');
          this.onSearchRfid();
        } else {
          this.refreshFormMessages(response);
        }
      });
      this.onSearchRfid();
    } else {
      return this.showErrorMessage('tracing.select.tag.before.reprint');
    }
    this.onSearchRfid();
  }


  onPrint() {
    const reprint = (<NgcFormArray>this.form.get(['rfidList1'])).getRawValue();


    let x = 0;
    reprint.forEach(a => {
      x = x + a.pieces;
    })
    let y = this.form.get('shppieces').value;
    if (x > y) {
      this.showErrorStatus("tracing.tag.pieces.more.than.total");
      return;


    }
    if (this.printerName == 'undefined' || this.printerName == null || this.printerName == '') {
      this.showErrorStatus('tracing.select.printer');
      return;
    }

    reprint.forEach(a => {
      a.stage = 'PRINT';
      a.tagType = 'AWB';
      a.printerName = this.printerName;
      a.shipmentNo = this.form.get('shipmentNo').value;


    })

    let obj = {
      tagList: reprint,
      desktop: 'D',
      shipmentId: null,
      shipmentNo: this.form.get('shipmentNo').value
    }

    if (reprint.length > 0) {
      this.tracingService.onPrint(obj).subscribe(response => {
        if (response.data) {
          this.showSuccessStatus('g.completed.successfully');
          this.onSearchRfid();
        } else {
          this.refreshFormMessages(response);
        }
      });
    } else {
      this.showErrorMessage('tracing.select.tag.before.reprint');
    }


  }

  cancelTag() {
    const deleteRequest = (<NgcFormArray>this.form.get(['rfidList'])).getRawValue();
    const deleteTag = [];

    for (let index = 0; index < deleteRequest.length; index++) {
      if (deleteRequest[index].select == true && deleteRequest[index].tagId != null) {
        deleteRequest[index].flagCRUD = "D";
        deleteTag.push(deleteRequest[index]);
      }
    }

    let request = {
      tagList: deleteTag,
      desktop: 'D',
      shipmentNo: this.form.get('shipmentNo').value
    }
    if (request.tagList.length > 0) {
      this.tracingService.cancelTag(request).subscribe(response => {
        if (response.data) {
          this.showSuccessStatus('g.completed.successfully');
          this.onSearchRfid();
        } else {
          this.refreshFormMessages(response);
          this.onSearchRfid();
        }
      });

    } else {
      return this.showErrorMessage('tracing.select.tag.before.deletion');
    }
    this.onSearchRfid();
  }
  getTagNumber() {
    const tagRequest = (<NgcFormArray>this.form.get(['rfidList'])).getRawValue();
    this.newTagNo = 1;
    let missedTaGnO = [];
    for (let i = 1; i <= tagRequest.length; i++) {
      if (!(tagRequest.find((element) => element.pieceNo == i))) {
        missedTaGnO.push(this.newTagNo);
        this.newTagNo = this.newTagNo + 1
      }
      else { this.newTagNo = this.newTagNo + 1 }
    }
    if (missedTaGnO.length == 0) {
      missedTaGnO.push(tagRequest.length + 1);
    }
    return missedTaGnO[0];
  }
  addTagRow() {

    let newtagno = this.getTagNumber();

    this.addrow = true;
    (<NgcFormArray>this.form.controls['rfidList']).addValue([
      {
        tagId: null,
        select: false,
        pieceNo: newtagno,
        pieces: null,
        stage: 'NEW',
        uldNo: null,
        shipmentNo: this.form.get('shipmentNo').value

      }
    ]);
  }



  addTag() {
    const tagRequest = (<NgcFormArray>this.form.get(['rfidList'])).getRawValue();
    const addTag = [];
    let x = 0;
    tagRequest.forEach(a => {
      x = x + a.pieces;
    })
    let y = this.form.get('shppieces').value;
    if (x > y) {
      return this.showErrorStatus("tracing.tag.pieces.more.than.total");
    }

    for (let index = 0; index < tagRequest.length; index++) {
      if (tagRequest[index].tagId == null) {

        tagRequest[index].tagType = 'AWB';
        //tagRequest[index].printerName = this.printerName;
        tagRequest[index].shipmentNo = this.form.get('shipmentNo').value;
        addTag.push(tagRequest[index]);


      }
    }
    if (addTag.length === 0) {
      return this.showErrorStatus("tracing.atleast.one.tag");
    }
    let request = {
      tagList: addTag,
      desktop: 'D',
      shipmentId: null,
      shipmentNo: this.form.get('shipmentNo').value
    }
    this.tracingService.onPrint(request).subscribe(response => {
      if (response.data) {
        this.showSuccessStatus('g.completed.successfully');
        this.onSearchRfid();
      } else {
        this.refreshFormMessages(response);
      }
    });
    this.onSearchRfid();
  }

}







