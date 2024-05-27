import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcInputComponent, UserProfile,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcContainerComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportService } from '../export.service';
import { PreManifestSearch } from '../export.sharedmodel';
import { TranshipmentService } from '../transhipment/transhipment.service';
import { C, e } from '@angular/core/src/render3';

/**
 * This component is used to premanifest the flight
 * @export
 * @class BookMultipleShipmentComponent
 * @extends {NgcPage}
 * @implements {OnInit}
 */

@Component({
  selector: 'app-premanifest',
  templateUrl: './premanifest.component.html',
  styleUrls: ['./premanifest.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class PremanifestComponent extends NgcPage implements OnInit {

  forwardedData: any;
  searchFlag: boolean = false;
  isBulk: boolean = false;
  isUld: boolean = false;
  isMixPpk: boolean = false;
  templateRef: TemplateRef<any>;
  popUpWidth: Number;
  popUpHeight: Number;
  isClosePopupScreen: boolean = true;
  searchList: any;
  ShipmentRow: any;
  shpList: any = [];
  visibilityFlag: boolean = false;
  private groupSelectState: any = {};
  msno: number = 0;
  placeHolders: any = [];

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private exportService: ExportService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }


  @ViewChild("PmanAwb") PmanAwb: NgcWindowComponent;
  @ViewChild("PmanUld") PmanUld: NgcWindowComponent;


  private preManifestForm: NgcFormGroup = new NgcFormGroup({
    shipmentNumbers: new NgcFormControl(),
    flightId: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(new Date()),
    flightSegmentId: new NgcFormControl(),
    std: new NgcFormControl(),
    routingInfo: new NgcFormControl(),
    shipmentList: new NgcFormArray([]),
    shpNumber: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    contrCode: new NgcFormControl(),
    destination: new NgcFormControl(),
    buildupInstr: new NgcFormControl(''),
    mnfstRmk: new NgcFormControl(''),
    manRmkId: new NgcFormControl(),
    buildRmkId: new NgcFormControl(),
    flightBookingId: new NgcFormControl(),
    nonPmanBulkList: new NgcFormArray([]),
    pmanBulkList: new NgcFormArray([]),
    nonPmanUldList: new NgcFormArray([]),
    pmanUldList: new NgcFormArray([]),
    mixPpkAwbList: new NgcFormArray([]),
    shpNumberList: new NgcFormGroup({
      shpNumber1: new NgcFormControl(''),
      shpNumber2: new NgcFormControl(''),
      shpNumber3: new NgcFormControl(''),
      shpNumber4: new NgcFormControl(''),
      shpNumber5: new NgcFormControl(''),
      shpNumber6: new NgcFormControl(''),
      shpNumber7: new NgcFormControl(''),
      shpNumber8: new NgcFormControl(''),
      shpNumber9: new NgcFormControl(''),
      shpNumber10: new NgcFormControl('')
    })
  })

  ngOnInit() {
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    this.preManifestForm.patchValue(this.forwardedData);

  }

  onSearch() {
    let requestData = new PreManifestSearch();

    requestData.flightKey = this.preManifestForm.get('flightKey').value;
    requestData.flightDate = this.preManifestForm.get('flightDate').value;
    // requestData.segmentId = this.preManifestForm.get('flightSegmentId').value;
    this.exportService.getPreManifestDetails(requestData).subscribe(res => {
      this.refreshFormMessages(res);
      this.searchList = res.data;
      if (this.searchList) {
        this.searchFlag = true;
        this.preManifestForm.patchValue(this.searchList);
        //for serial number
        let count = 0;
        this.searchList.shipmentList.forEach(element => {
          element.sno = ++count;
        });
        this.preManifestForm.get('shipmentList').patchValue(this.searchList.shipmentList);
        this.preManifestForm.get('std').patchValue(this.searchList.std);
        this.preManifestForm.get('routingInfo').patchValue(this.searchList.routingInfo);
      }
      else {
        this.searchFlag = false;
        this.showFormErrorMessages(res.messageList);
      }
    },
      error => {
        this.searchFlag = false;
        this.showErrorStatus(error);
      }
    );

  }

  onCancel(event) {
    this.navigateBack(this.forwardedData);
  }

  onSelectMainCheckBox(event) {
    if (event && event.record) {
      let shipmentList = this.preManifestForm.get('shipmentList').value;
      let index = 0;
      for (let item of shipmentList) {
        if (item.uldNumber == event.record.uldNumber && item.shipmentNumber == event.record.shipmentNumber) {
          //item.select=event.record.select;
          (<NgcFormGroup>this.preManifestForm.get(['shipmentList', index])).get('select').setValue(event.record.select);
        }
        index++;
      }
    }
  }

  onClickHandler(event) {
    const temp = event.key;//.split(':');
    console.log(event);
    this.preManifestForm.getRawValue().shipmentList.forEach((shipment, shipmentIndex: number) => {
      if (shipment['uldNumber'] === temp) { //[0] && shipment['segment'] === temp[1]) {
        console.log(temp, shipment);
        this.preManifestForm.get(['shipmentList', shipmentIndex, 'select']).setValue(event.checked);
      }
    });
    this.groupSelectState[event.key] = event.checked;
  }

  protected mainGroupsRenderer = (value: string, rowData: any, level: any): string => {
    let pieces = 0;
    let weight = 0;
    if (rowData.data.uldNumber == '' || rowData.data.uldNumber == null) {
      return value;
    }
    else {
      const checkBoxState: boolean = this.groupSelectState[rowData.data.uldNumber] ? true : false;
      const check = NgcUtility.createCheckBox(rowData.data.uldNumber, checkBoxState);
      for (let row of rowData.records) {
        pieces += row.fblPieces;
        weight += row.fblWeight;
      }
      return check + rowData.data.uldNumber;
    }

  }

  //PreManifest By AWB popup methods
  pmanAwb() {
    this.isBulk = true;
    this.isUld = true;
    (<NgcFormArray>this.preManifestForm.controls['shipmentList']).getRawValue().forEach(element => {
      if (element.select === true) {
        this.shpList.push(element.shipmentNumber);
      }
    });
    if (this.shpList.length > 0) {
      this.searchAwbDtls();
    }
    this.PmanAwb.open();
  }

  closeAwbPopup() {
    this.shpList = [];
    this.preManifestForm.get('shipmentNumbers').reset();
    (<NgcFormArray>this.preManifestForm.get('nonPmanBulkList')).resetValue([]);
    (<NgcFormArray>this.preManifestForm.get('pmanBulkList')).resetValue([]);
    (<NgcFormArray>this.preManifestForm.get('nonPmanUldList')).resetValue([]);
    (<NgcFormArray>this.preManifestForm.get('pmanUldList')).resetValue([]);
    this.PmanAwb.close();
    this.onSearch();
  }

  searchAwbDtls() {
    console.log(this.preManifestForm.getRawValue().shipmentNumbers);

    let requestData = new PreManifestSearch();
    requestData.awbList = this.preManifestForm.getRawValue().shipmentNumbers;
    if (this.shpList.length > 0) {
      if (requestData.awbList == null || requestData.awbList.length == 0) {
        requestData.awbList = this.shpList;
      }
    }
    requestData.flightId = this.preManifestForm.get('flightId').value;
    console.log(requestData);
    this.exportService.fetchPmanAwbDetails(requestData).subscribe(res => {
      if (!this.showResponseErrorMessages(res)) {
        if (res.data) {
          //for serial number
          let count = 0;

          res.data.nonPreMnfstdAwbList.forEach(element => {
            element.slno = ++count;
            element.pmanPieces = 0;
            element.pmanWeight = 0;
            if (element.shipmentLock == 1) {
              this.showErrorMessage(NgcUtility.translateMessage("shipment is locked", [element.shipmentNumber]));
            }
          });
          count = 0;
          res.data.preMnfstdAwbList.forEach(element => {
            element.slno = ++count;
            if (element.shipmentLock == 1) {
              this.showErrorMessage(NgcUtility.translateMessage("shipment is locked", [element.shipmentNumber]));
            }
          });
          count = 0;
          res.data.nonPreMnfstdUldList.forEach(element => {
            element.slno = ++count;
            element.pmanPieces = 0;
            element.pmanWeight = 0;
            if (element.shipmentLock == 1) {
              this.showErrorMessage(NgcUtility.translateMessage("shipment is locked", [element.shipmentNumber]));
            }
          });
          count = 0;
          res.data.preMnfstdUldList.forEach(element => {
            element.slno = ++count;
            if (element.shipmentLock == 1) {
              this.showErrorMessage(NgcUtility.translateMessage("shipment is locked", [element.shipmentNumber]));
            }
          });

          this.preManifestForm.get('nonPmanBulkList').patchValue(res.data.nonPreMnfstdAwbList);
          this.preManifestForm.get('pmanBulkList').patchValue(res.data.preMnfstdAwbList);
          this.preManifestForm.get('nonPmanUldList').patchValue(res.data.nonPreMnfstdUldList);
          this.preManifestForm.get('pmanUldList').patchValue(res.data.preMnfstdUldList);
        }
      }
    },
      error => { this.showErrorStatus(error); }
    );
  }

  savePmanAwb() {
    const nonPmanBlkList = new Array<any>();
    const pmanBlkList = new Array<any>();
    const premnfstUldList = new Array<any>();
    const nonPmnfstUldList = new Array<any>();

    let length: any = (<NgcFormArray>this.preManifestForm.controls["nonPmanBulkList"]).length;

    for (let i = 0; i < length; i++) {
      this.placeHolders[0] = <NgcFormControl>this.preManifestForm.get(['nonPmanBulkList', i, 'pmanPieces']);
      this.placeHolders[1] = <NgcFormControl>this.preManifestForm.get(['nonPmanBulkList', i, 'pmanWeight']);
      if (this.placeHolders[0].value != 0 && this.placeHolders[1].value != 0) {
        nonPmanBlkList.push(this.preManifestForm.get(['nonPmanBulkList', i]).value);
      }
    }

    (<NgcFormArray>this.preManifestForm.controls['pmanBulkList']).getRawValue().forEach(element => {
      if ((element.buildupInstr != null || element.mnfstRmk != null) && (element.flagCRUD == 'U' || element.flagCRUD == "C")) {
        pmanBlkList.push(element);
      }
    });

    //ULD

    let len: any = (<NgcFormArray>this.preManifestForm.controls["nonPmanUldList"]).length;

    for (let i = 0; i < len; i++) {
      this.placeHolders[0] = <NgcFormControl>this.preManifestForm.get(['nonPmanUldList', i, 'pmanPieces']);
      this.placeHolders[1] = <NgcFormControl>this.preManifestForm.get(['nonPmanUldList', i, 'pmanWeight']);
      if (this.placeHolders[0].value != 0 && this.placeHolders[1] != 0) {
        nonPmnfstUldList.push(this.preManifestForm.get(['nonPmanUldList', i]).value);
      }
    }

    (<NgcFormArray>this.preManifestForm.controls['pmanUldList']).getRawValue().forEach(element => {
      if ((element.buildupInstr != null || element.mnfstRmk != null) && (element.flagCRUD == 'U' || element.flagCRUD == "C")) {
        premnfstUldList.push(element);
      }
    });

    let requestData = new PreManifestSearch();
    if (nonPmanBlkList.length > 0) {
      requestData.nonPreMnfstdAwbList = nonPmanBlkList;
    }
    if (pmanBlkList.length > 0) {
      requestData.preMnfstdAwbList = pmanBlkList;
    }
    if (nonPmnfstUldList.length > 0) {
      requestData.nonPreMnfstdUldList = nonPmnfstUldList;
    }
    if (premnfstUldList.length > 0) {
      requestData.preMnfstdUldList = premnfstUldList;
    }
    //if all list 0 enter atleast one record
    if (nonPmanBlkList.length == 0 && pmanBlkList.length == 0 && nonPmnfstUldList.length == 0 && premnfstUldList.length == 0) {
      this.showErrorMessage("export.please.fill.details");
      return;
    }
    requestData.flightId = this.preManifestForm.get('flightId').value;
    this.exportService.savePreManifestDetails(requestData).subscribe(res => {
      if (!this.showResponseErrorMessages(res)) {
        this.resetFormMessages();
        this.showSuccessStatus('g.completed.successfully');
        this.searchAwbDtls();
      }
    },
      error => {
        this.showErrorStatus(error);
      });

  }

  dltPmanAwb() {

    const dltPmanList = new Array<any>();

    (<NgcFormArray>this.preManifestForm.controls['pmanBulkList']).getRawValue().forEach(element => {
      if (element.select == true) {
        dltPmanList.push(element);
      }
    });
    (<NgcFormArray>this.preManifestForm.controls['pmanUldList']).getRawValue().forEach(element => {
      if (element.select == true) {
        dltPmanList.push(element);
      }
    });

    let requestData = new PreManifestSearch();
    if (dltPmanList.length > 0) {
      requestData.shipmentList = dltPmanList;
    }
    else {
      this.showErrorMessage("admin.select.one.record.delete");
      return;
    }

    requestData.flightId = this.preManifestForm.get('flightId').value;
    this.showConfirmMessage("admin.delete.selected.records.confirmation").then(fulfilled => {
      this.exportService.deletePmanDtls(requestData).subscribe(res => {
        if (!this.showResponseErrorMessages(res)) {
          this.resetFormMessages();
          this.showSuccessStatus('g.completed.successfully');
          this.searchAwbDtls();
        }
      },
        error => {
          this.showErrorStatus(error);
        });
    });
  }

  //PreManifest By ULD popup methods
  pmanUld() {
    (<NgcFormArray>this.preManifestForm.controls['shipmentList']).getRawValue().forEach(element => {
      if (element.select === true && element.acceptanceType === "MixPrepack") {
        this.preManifestForm.get('uldNumber').patchValue(element.uldNumber);
      }
    });

    this.isMixPpk = true;
    this.PmanUld.open();
  }

  closeUldPopup() {
    this.preManifestForm.get('mixPpkAwbList').reset();
    this.preManifestForm.get('uldNumber').reset();
    this.preManifestForm.get('contrCode').reset();
    this.preManifestForm.get('destination').reset();
    this.PmanUld.close();
    this.onSearch();
  }

  searchUldDtls() {
    let requestData = new PreManifestSearch();
    requestData.flightId = this.preManifestForm.get('flightId').value;
    requestData.uldNumber = this.preManifestForm.get('uldNumber').value;
    console.log(requestData);
    this.exportService.fetchPmanUldDetails(requestData).subscribe(res => {
      //for serial number
      let count = 0;
      res.data.shipmentList.forEach(element => {
        element.slno = ++count;
      });
      this.preManifestForm.get('mixPpkAwbList').patchValue(res.data.shipmentList);
      this.preManifestForm.get('uldNumber').patchValue(res.data.uldNumber);
      this.preManifestForm.get('contrCode').patchValue(res.data.contrCode);
      this.preManifestForm.get('destination').patchValue(res.data.destination);
    },
      error => { this.showErrorStatus(error); }
    );
  }


  savePmanUld() {
    this.preManifestForm.validate();
    if (this.preManifestForm.invalid) {
      return;
    }
    const nonPmnfstUldList = new Array<any>();
    if (this.preManifestForm.get('buildupInstr').value != '') {

      nonPmnfstUldList.push(this.preManifestForm.get('buildupInstr').value);
    }
    if (this.preManifestForm.get('mnfstRmk').value != '') {

      nonPmnfstUldList.push(this.preManifestForm.get('mnfstRmk').value);
    }

    let requestData = new PreManifestSearch();
    if (nonPmnfstUldList.length > 0) {
      requestData.nonPreMnfstdUldList = nonPmnfstUldList;
    }
    else {
      this.showErrorMessage("export.please.fill.details");
      return;
    }
    requestData.flightId = this.preManifestForm.get('flightId').value;
    this.exportService.savePreManifestDetails(requestData).subscribe(res => {
      if (!this.showResponseErrorMessages(res)) {
        this.resetFormMessages();
        this.showSuccessStatus('g.completed.successfully');
      }
    },
      error => {
        this.showErrorStatus(error);
      });
  }

  dltPmanUld() {
    let requestData = new PreManifestSearch();
    requestData.shipmentList = this.preManifestForm.get(['mixPpkAwbList']).value;
    requestData.flightId = this.preManifestForm.get('flightId').value;
    this.showConfirmMessage("admin.delete.selected.records.confirmation").then(fulfilled => {
      this.exportService.deletePmanDtls(requestData).subscribe(res => {
        if (!this.showResponseErrorMessages(res)) {
          this.resetFormMessages();
          this.showSuccessStatus('g.completed.successfully');
          this.searchAwbDtls();
        }
      },
        error => {
          this.showErrorStatus(error);
        });
    });
  }

}
