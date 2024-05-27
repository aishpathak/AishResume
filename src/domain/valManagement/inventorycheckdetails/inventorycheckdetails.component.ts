import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, ContentChildren, forwardRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupDirective, FormArray, FormGroup, FormControl, FormControlName, Validators } from '@angular/forms';
// Application
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, BaseResponse, NgcWindowComponent,
  NgcUtility, NgcTabsComponent, PageConfiguration, NgcReportComponent
} from 'ngc-framework';

import { Environment } from '../../../environments/environment';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ShipmentInventory, SearchInventory, NotFoundShipment, ShipmentInInventory, ShipmentInventoryDetails } from './../val.sharemodel';
import { ValSharedService } from './../val-shared.service';
import { element } from 'protractor';

@Component({
  selector: 'app-inventorycheckdetails',
  templateUrl: './inventorycheckdetails.component.html',
  styleUrls: ['./inventorycheckdetails.component.scss']
})
export class InventorycheckdetailsComponent extends NgcPage implements OnInit {
  temp: NgcFormArray;
  count3: any;
  flag: boolean = false;
  completeButton: boolean = false;
  var: BaseResponse<ShipmentInventory>;
  count2: number;
  tempCom: NgcFormArray;
  count1: any;
  count: any;
  tempdis: NgcFormArray;
  dis: ShipmentInInventory[];
  request: any;
  reqObj: any;
  arrayUser: any;
  response: BaseResponse<NotFoundShipment>;
  arr: any;
  reportParameters: any;

  tempArrayData: NgcFormArray;
  resp: ShipmentInventoryDetails;
  requestData: any;
  hasReadPermission: boolean = true;
  private form: NgcFormGroup = new NgcFormGroup({
    startedAt: new NgcFormControl(),
    completedAt: new NgcFormControl(),
    totalShipment: new NgcFormControl(),
    foundShipment: new NgcFormControl(),
    discrepancy: new NgcFormControl(),
    checkDoneBy: new NgcFormControl(),
    foundShipmentArray: new NgcFormArray([
      new NgcFormGroup({
        shipmentNumber: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        pieces: new NgcFormControl(),
        destination: new NgcFormControl(),
        serialNo: new NgcFormControl(),
      })
    ]),
    notFoundShipment: new NgcFormArray([
      new NgcFormGroup({
        shipmentNumber: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        uldNumber: new NgcFormControl(),
        bagNumber: new NgcFormControl(),
        checkInDate: new NgcFormControl(),
        checkInBy: new NgcFormControl(),
        addedBy: new NgcFormControl(),
        addedOn: new NgcFormControl(),
        pieces: new NgcFormControl(),
        destination: new NgcFormControl(),
        reason: new NgcFormControl(),
        check: new NgcFormControl(),
      })
    ]),
    shipmentInInventory: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        checkedInPieces: new NgcFormControl(),
        inventoryCheckPieces: new NgcFormControl(),
        destination: new NgcFormControl(),
        discrepency: new NgcFormControl(),
      })
    ])
  })
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private valsharedService: ValSharedService,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.form.reset();
    this.hasReadPermission = NgcUtility.hasReadPermission('VAL_INVENTORY_CHECK_LIST');
    this.requestData = this.valsharedService.requestInventory;
    if (this.requestData.completedAt == null) {
      this.completeButton = false;
    }
    else {
      this.completeButton = true;
    }
    this.valsharedService.searchDetailInventory(this.requestData).subscribe(data => {
      this.resp = data.data;
      let count = 1;
      this.resp.foundShipmentArray.map(element => {
        element.serialN = count++;
      });
      if (data.data) {
        this.flag = true;

        this.form.get('foundShipmentArray').patchValue(this.resp.foundShipmentArray);
        this.form.get('notFoundShipment').patchValue(this.resp.notFoundShipment);
        this.form.get('shipmentInInventory').patchValue(this.resp.shipmentInInventory);
        this.resetFormMessages();

      }
      else if (data.messageList == null && this.resp == null) {
        this.showInfoStatus("val.noRecordFound");
        this.flag = false;
      }
    })
  }

  onPurge(event) {
    this.tempArrayData = <NgcFormArray>this.form.get(['notFoundShipment']);
    this.arr = this.tempArrayData.getRawValue().filter(temp => temp.check);
    this.count3 = 0;
    if (this.arr.length != 0) {
      this.arr.forEach(element => {
        if (element.reason == null) {
          this.showErrorMessage('val.select.reason');
          this.count3++;
        }

      });
    }
    if (this.arr.length == 0) {
      this.showErrorMessage('export.select.a.record');
    }
    else if (this.count3 == 0) {

      this.valsharedService.onPurgeRecord(this.arr).subscribe(data => {
        this.refreshFormMessages(data);
        this.response = data;
        this.arrayUser = this.response.data;
        this.valsharedService.searchDetailInventory(this.requestData).subscribe(data => {
          this.resp = data.data;
          if (data.data) {
            this.form.get('foundShipmentArray').patchValue(this.resp.foundShipmentArray);
            this.form.get('notFoundShipment').patchValue(this.resp.notFoundShipment);
            this.form.get('shipmentInInventory').patchValue(this.resp.shipmentInInventory);

            this.resetFormMessages();
          }
        })
        if (this.arrayUser.length > 0 && this.arrayUser.length != null) {
          this.showSuccessStatus('val.record.purged.success');
        }
      })
    }
  }
  onNotFound(event) {
    this.request = this.resp;
    this.valsharedService.notFoundShipment = this.request;
    this.navigateTo(this.router, '/valmgmt/notfoundshipmentlist', this.request);
  }


  closeD(event) {
    this.tempdis = <NgcFormArray>this.form.get(['shipmentInInventory']);
    this.count = this.tempdis.getRawValue().filter(temp => temp.select);
    this.count1 = 0;
    this.count.forEach(element => {
      if (element.discrepency == " ") {
        element.discrepency = false;
      }
      else {
        element.discrepency = true;
      }
    });
    this.count.forEach(element => {

      if (!element.discrepency) {
        this.showErrorMessage('val.discrepency.do.not.exist' + element.shipmentNumber);
        this.count1++;
      }
    });
    if (this.count1 == 0) {
      if (this.count.length == 0) {
        this.showErrorMessage('export.select.a.record');
      }
      else {

        this.valsharedService.closeDiscrepency(this.count).subscribe(data => {
          this.refreshFormMessages(data);
          this.var = data;
          this.arrayUser = this.var.data;
          if (this.arrayUser) {
            this.valsharedService.searchDetailInventory(this.requestData).subscribe(data => {
              this.resp = data.data;

              if (data.data) {
                this.resp.shipmentInInventory.forEach(element => {
                  if (element.discrepency) {
                    element.discrepency = "YES"
                  }
                  else {
                    element.discrepency = " "
                  }
                })
                this.form.get('foundShipmentArray').patchValue(this.resp.foundShipmentArray);
                this.form.get('notFoundShipment').patchValue(this.resp.notFoundShipment);
                this.form.get('shipmentInInventory').patchValue(this.resp.shipmentInInventory);
                this.resetFormMessages();

              }
            })
          }

          if (this.arrayUser.length > 0 && this.arrayUser.length != null) {
            this.showSuccessStatus('val.discrepency.closed.success');
          }
        })
      }
    }

  }

  complete(event) {
    this.tempCom = <NgcFormArray>this.form.get(['shipmentInInventory']);
    this.temp = <NgcFormArray>this.form.get(['foundShipmentArray']);
    this.count = 0;
    this.count = this.tempCom.getRawValue().filter(temp => temp.discrepency == "YES");
    if (this.count.length > 0) {
      this.showErrorMessage('val.close.discrepancy');
    }
    if (this.temp.value.length != 0) {
      this.showErrorMessage('val.close.discrepancy');
    }
    else if (this.count.length == 0) {
      this.valsharedService.complete(this.requestData).subscribe(data => {
        this.valsharedService.searchDetailInventory(this.requestData).subscribe(data => {
          this.resp = data.data;
          if (data.data) {
            this.showSuccessStatus('val.complete.performed.success');

            this.form.get('foundShipmentArray').patchValue(this.resp.foundShipmentArray);
            this.form.get('notFoundShipment').patchValue(this.resp.notFoundShipment);
            this.form.get('shipmentInInventory').patchValue(this.resp.shipmentInInventory);

            this.resetFormMessages();
          }
        })

      })

    }
  }

  public onBack(event) {
    this.navigateBack(this.form.getRawValue());
  }
  handOverForm(event) {
    this.request = this.resp;
    this.valsharedService.notFoundShipment = this.request;
    this.navigateTo(this.router, '/valmgmt/signedhandoverform', this.request);
  }
  printHandover() {
    this.reportParameters = new Object();
    this.reportParameters.InventoryCheckId = this.requestData.inventoryCheckId;
    this.reportParameters.loggedInUser = this.requestData.loggedInUser;
    this.reportWindow.open();
  }

  onApply() {
    var notFoundShipments = (<NgcFormArray>this.form.get(['notFoundShipment'])).getRawValue();
    if (notFoundShipments && notFoundShipments.length > 0) {
      var reasons = Array.from(new Set(notFoundShipments.filter(s => s.reason).map(s => s.reason)));
      if (reasons && reasons.length > 0) {
        let reason = reasons[0];
        notFoundShipments.forEach(shipment => {
          shipment.reason = reason;
        });
      }
      this.form.get(['notFoundShipment']).patchValue(notFoundShipments);
    }

  }
}
