import {
  Component, NgZone, ElementRef, ViewContainerRef, OnInit,
  ViewChild, ViewChildren, QueryList, Input, Output, EventEmitter
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcWindowComponent, NgcFormArray
  , NgcDropDownComponent, NgcUtility, NgcButtonComponent, NgcDataTableComponent, PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import {
  CurdOperations, MaintainRemarkResponse, MaintainRemarkRequest,
  MaintainRemarkCommon, MaintainRemarkDeleteRequest
} from './../awbManagement.shared';
import { AwbManagementService } from '../awbManagement.service';
import { NgcFormControl } from 'ngc-framework';
import { FormArray, AbstractControl } from '@angular/forms';
import { MasterAirWayBillModel, MasterAirWayBillModelEdit, HouseModel, HouseSearch } from '../awbManagement.shared';
import { FormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-maintain-house',
  templateUrl: './maintain-house.component.html',
  styleUrls: ['./maintain-house.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: false,
  //autoBackNavigation: true,
})

export class MaintainHouseComponent extends NgcPage {
  displayDelete: boolean;
  recordData: any;
  reasonValue: boolean;
  awbNumberData: any;
  hawbNumberData: any;
  isTableFlg = false;
  resp: any;
  deleteFlag = false;
  printFlag: boolean = false;
  saveFlag: boolean = false;
  showDeleteButton: boolean = false;
  patchData: any;
  AWBDetails: any;
  showPage: false;
  response: any;
  mainId: any;
  forwardedData: any;
  reportParameters: any = new Object();
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @Input('shipmentNumberData') shipmentNumberData: string;
  @Input('showAsPopup') showAsPopup: boolean;
  @Output() autoSearchShipmentInfo = new EventEmitter<boolean>();
  disabledAdd: boolean;

  constructor(private awbService: AwbManagementService, appZone: NgZone,
    appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router,
    private maintainHouseservice: AwbManagementService, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }
  private MaintainHouseform: NgcFormGroup = new NgcFormGroup({
    awbNumber: new NgcFormControl(),
    nonIATA: new NgcFormControl(),
    hawbNumber: new NgcFormControl('', [Validators.maxLength(12)]),
    id: new NgcFormControl(),
    awbPrefix: new NgcFormControl(),
    awbSuffix: new NgcFormControl(),
    houseModel: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    weightUnitCode: new NgcFormControl(),
    natureOfGoods: new NgcFormControl(),
    totalHWB: new NgcFormControl(),
    totalPieces: new NgcFormControl(),
    totalWeight: new NgcFormControl(),
    shipperName: new NgcFormControl(),
    consigneeName: new NgcFormControl(),
    houseId: new NgcFormControl(),
    appointedAgent: new NgcFormControl(),
    shc: new NgcFormControl(),
    maintainHouseDetailsList: new NgcFormArray([])

  });




  ngOnInit() {
    super.ngOnInit();
    this.displayDelete = false;
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    console.log(this.forwardedData);

    if (this.forwardedData != null && this.forwardedData.awbNumber != null && this.forwardedData.awbNumber != '') {
      if (this.forwardedData.awbNumber != null) {
        this.MaintainHouseform.get('awbNumber').patchValue(this.forwardedData.awbNumber);
      }
      this.onSearch();
    }
    if (this.forwardedData != null && this.forwardedData.shipmentNumber != null && this.forwardedData.shipmentNumber != '') {
      if (this.forwardedData.shipmentNumber != null) {
        this.MaintainHouseform.get('awbNumber').patchValue(this.forwardedData.shipmentNumber);
      }
      this.onSearch();
    }


    if (this.forwardedData != null && this.forwardedData.length == 11) {
      this.MaintainHouseform.get('awbNumber').patchValue(this.forwardedData);
      this.onSearch();
    }
    this.patchData = this.maintainHouseservice.dataFromAddToHouse;
    if (this.patchData) {
      this.MaintainHouseform.get('awbNumber').setValue(this.patchData.awbNumber);
      this.onSearch();
    }

    if (this.shipmentNumberData) {
      this.MaintainHouseform.get(['awbNumber']).patchValue(this.shipmentNumberData);
      this.onSearch();
    }
  }


  private onSearch() {
    this.awbNumberData = this.MaintainHouseform.get('awbNumber').value;
    if (!this.awbNumberData) {
      this.MaintainHouseform.validate();
      this.showErrorStatus("SHPIRR_SHPNUM_NUL");
      return;

    }
    this.hawbNumberData = this.MaintainHouseform.get('hawbNumber').value;
    let search = this.MaintainHouseform.getRawValue();
    (this.MaintainHouseform.get('maintainHouseDetailsList') as NgcFormArray).resetValue([]);
    this.maintainHouseservice.getOnSearch(search).subscribe(data => {
      if (data && data.data && data.data.restrictedAirline) {
        this.disabledAdd = true;
      }
      else {
        this.disabledAdd = false;
      }
      console.log(data);
      if (!this.showResponseErrorMessages(data)) {
        this.MaintainHouseform.reset();
        this.MaintainHouseform.get('awbNumber').setValue(this.awbNumberData);
        this.MaintainHouseform.get('shc').setValue('');
        this.MaintainHouseform.get('hawbNumber').setValue(this.hawbNumberData);
        this.resp = data.data;
        this.MaintainHouseform.patchValue(this.resp);
        this.refreshFormMessages(data);
        if (this.resp != null && this.resp.maintainHouseDetailsList != null && this.resp.maintainHouseDetailsList.length > 0) {
          this.resp.maintainHouseDetailsList.forEach(element => {
            element.selectHAWB = false;
            element.awbNumber = this.resp.awbNumber;
            element.origin = this.resp.origin;
            element.destination = this.resp.destination;
            this.displayDelete = true;
            this.saveFlag = true;
            this.printFlag = true;
            this.showDeleteButton = true;
          });
        } else {
          this.displayDelete = false;
          this.showInfoStatus('no.record.add.new');
        }
      } error => {
        this.showErrorStatus(error);
      }

    });


  }

  onAddScreen(event) {
    this.recordData = this.MaintainHouseform.getRawValue();
    this.navigate('awbmgmt/maintainhousewaybilladdnew', this.recordData);
  }

  onLinkClick(event) {
    this.maintainHouseservice.houseAWB = (<NgcFormGroup>this.MaintainHouseform.get(['maintainHouseDetailsList', event.record.NGC_ROW_ID])).getRawValue();
    console.log(this.maintainHouseservice.houseAWB);
    if (event.column === 'modifiedOn') {
      event.record.masterAwbId = this.resp.id;
      event.record.awbNumber = this.resp.awbNumber;
      this.maintainHouseservice.routedData = event.record;
      this.navigateTo(this.router, '/awbmgmt/maintainhousewaybilladdedit', this.maintainHouseservice.houseAWB)
    }

    else if (event.column === 'delete') {
      const request = event.record;
      request.awbNumber = this.MaintainHouseform.get('awbNumber').value;
      request.awbDate = this.resp.awbDate;
      this.maintainHouseservice.deleteAWBRecord(request).subscribe(data => {
        this.response = data;
        this.refreshFormMessages(data);
        if (this.response.data != null) {
          console.log(this.response.data);
          this.onSearch();
          this.showSuccessStatus('g.completed.successfully');
        } else {
        }
      }, error => {
      });
    }

  }

  public onDelete(event) {
    this.showConfirmMessage('export.delete.the.record.confirmation').then(fulfilled => {
      const eachRowLength = (<NgcFormArray>this.MaintainHouseform.get(['maintainHouseDetailsList'])).controls;
      for (const eachRow of eachRowLength) {
        if (eachRow.get('selectHAWB').value) {
          this.deleteFlag = true;
        }
      }
      if (this.deleteFlag) {
        let arrayDelete = this.MaintainHouseform.getRawValue();
        this.maintainHouseservice.deleteAWBRecord(arrayDelete).subscribe(data => {
          if (data != null) {
            this.showSuccessStatus('g.completed.successfully');
            this.onSearch();
          } else {
            this.showErrorStatus('hwb.house.data.not.deleted');
          }
        });
      } else {
        this.showInfoStatus('hwb.select.house.for.delete');
      }


    }
    ).catch(reason => {
    });
  }
  onClear(event) {
    this.MaintainHouseform.reset();
    this.displayDelete = false;

  }

  onCancel(event) {
    this.showConfirmMessage('on.cancel.message').then(fulfilled => {
      this.navigateBack(this.forwardedData);
    });

  }

  onPrint() {
    this.reportParameters.awb = this.MaintainHouseform.get('awbNumber').value;
    this.reportParameters.hawb = this.MaintainHouseform.get('hawbNumber').value;
    this.reportWindow.open();
  }

}
