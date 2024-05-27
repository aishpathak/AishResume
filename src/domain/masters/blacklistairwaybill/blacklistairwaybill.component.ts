import { Component, OnInit, NgZone, ElementRef, OnDestroy, ViewContainerRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Validators } from "@angular/forms";
// NGC framework imports
import {
  NgcUtility, NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcDropDownComponent,
  NgcButtonComponent, NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest,
  BaseResponse, PageConfiguration, NgcFormControl, BaseRequest, CellsRendererStyle, ErrorMessage
} from "ngc-framework";
import { MastersService } from "../masters.service";
import { BlackListAWBRequest } from "../masters.sharedmodel";

@Component({
  selector: "app-blacklistairwaybill",
  templateUrl: "./blacklistairwaybill.component.html",
  styleUrls: ["./blacklistairwaybill.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class BlacklistairwaybillComponent extends NgcPage implements OnInit {
  showTableData: boolean = false;
  arrayDelete: any;
  super: any;
  response: any;
  responseArray: any[];
  updateFormData: boolean;
  showList: boolean;
  @ViewChild("addRangeWindow") addRangeWindow: NgcWindowComponent;
  @ViewChild("deleteRangeWindow") deleteRangeWindow: NgcWindowComponent;
  checkDataValue: NgcFormGroup;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private blackListAWBService: MastersService, private route: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.onSearch();
  }
  // tslint:disable-next-line:member-ordering
  private blacklistAirwayBillForm: NgcFormGroup = new NgcFormGroup({
    awbPrefixSearch: new NgcFormControl(),
    number: new NgcFormControl(),
    awbPrefix: new NgcFormControl(),
    fromNumber: new NgcFormControl(),
    toNumber: new NgcFormControl(),
    remarks: new NgcFormControl(),
    shipmentList: new NgcFormArray([
      new NgcFormGroup({
        shipmentNumber: new NgcFormControl(''),
        remarks: new NgcFormControl('')
      })
    ])
  });

  /**
   * This Function will fetch Uld Type  onSearch
   * @param:carrierCode and Uld Type
   */
  public onSearch() {
    let awbPrefixSearch = this.blacklistAirwayBillForm.get('awbPrefixSearch').value;
    let number = this.blacklistAirwayBillForm.get('number').value;
    if (number != null && awbPrefixSearch == null) {
      this.blacklistAirwayBillForm.get('awbPrefixSearch').setValidators(Validators.required);
    }
    this.blacklistAirwayBillForm.validate();
    if (this.blacklistAirwayBillForm.get('awbPrefixSearch').invalid) {
      return;
    }
    this.showList = false;
    this.resetFormMessages();
    const requestData: BlackListAWBRequest = new BlackListAWBRequest();
    requestData.awbPrefixSearch = this.blacklistAirwayBillForm.get('awbPrefixSearch').value;
    requestData.number = this.blacklistAirwayBillForm.get('number').value;
    this.blacklistAirwayBillForm.getRawValue();
    this.blackListAWBService.searchBlackListAWB(requestData).subscribe(
      data => {
        this.response = data;
        this.responseArray = this.response.data.shipmentList;
        if (this.responseArray !== null && this.responseArray.length > 0) {
          this.showList = true;
          this.showTableData = true;
          (<NgcFormArray>this.blacklistAirwayBillForm.get(["shipmentList"])).patchValue(this.responseArray);
        } else {
          this.showErrorStatus("mst.error.fetching.blacklist.awb");
          this.showTableData = false;
        }
      },
      error => {
        this.showErrorStatus(
          "error.fetching.blacklist.awb"
        );
      }
    );
  }

  /**
  * This Function to create a object and add uld type to the list that has to be sent to backend for insertion and updation
  */
  public onSave() {
    const request: BlackListAWBRequest = new BlackListAWBRequest();
    request.awbPrefix = this.blacklistAirwayBillForm.get("awbPrefix").value;
    request.fromNumber = this.blacklistAirwayBillForm.get("fromNumber").value;
    request.toNumber = this.blacklistAirwayBillForm.get("toNumber").value;
    request.remarks = this.blacklistAirwayBillForm.get("remarks").value;
    this.blacklistAirwayBillForm.validate();
    if (this.blacklistAirwayBillForm.invalid) {
      return;
    }
    this.blackListAWBService.saveAddedRangeForBlackListAWB(request).subscribe(data => {
      this.response = data;
      this.refreshFormMessages(data);
      if (this.response.data != null) {
        // this.showTable();
        this.addRangeWindow.hide();
        this.showSuccessStatus(NgcUtility.translateMessage("success.no.record.successfully", [this.response.data.noOfAWBCreated]));
        this.onSearch();
      }
    },
    );
  }
  public onDelete() {
    const request: BlackListAWBRequest = new BlackListAWBRequest();
    request.awbPrefix = this.blacklistAirwayBillForm.get("awbPrefix").value;
    request.fromNumber = this.blacklistAirwayBillForm.get("fromNumber").value;
    request.toNumber = this.blacklistAirwayBillForm.get("toNumber").value;
    this.blacklistAirwayBillForm.validate();
    if (this.blacklistAirwayBillForm.get('awbPrefix').invalid
      || this.blacklistAirwayBillForm.get('fromNumber').invalid
      || this.blacklistAirwayBillForm.get('toNumber').invalid) {
      return;
    }
    this.blackListAWBService.deleteRangeForBlackListAWB(request).subscribe(data => {
      this.response = data;
      this.refreshFormMessages(data);
      if (this.response.data != null) {
        // this.showTable();
        this.deleteRangeWindow.hide();
        this.showSuccessStatus("g.deleted.successfully");
        this.onSearch();
      }
    },
    );
  }
  /**
    * This Function will work for addRangeWindow Cancel Button
    */
  public cancelWindowButton(event) {
    this.addRangeWindow.hide();
  }
  /**
   * This Function will work for deleteRangeWindow Cancel Button
   */
  public cancelDeleteWindowButton(event) {
    this.deleteRangeWindow.hide();
  }
  closeAddWindow(event) {
    this.blacklistAirwayBillForm.get("awbPrefix").setValue(null);
    this.blacklistAirwayBillForm.get("fromNumber").setValue(null);
    this.blacklistAirwayBillForm.get("toNumber").setValue(null);
    this.blacklistAirwayBillForm.get("remarks").setValue(null);
  }
  closeDeleteWindow(event) {
    this.blacklistAirwayBillForm.get("awbPrefix").setValue(null);
    this.blacklistAirwayBillForm.get("fromNumber").setValue(null);
    this.blacklistAirwayBillForm.get("toNumber").setValue(null);
  }
  /**
 * This function is  delete for uld type data
 */
  public deleteData() {
    this.deleteRangeWindow.open();
    this.blacklistAirwayBillForm.get("awbPrefix").setValue(null);
    this.blacklistAirwayBillForm.get("fromNumber").setValue(null);
    this.blacklistAirwayBillForm.get("toNumber").setValue(null);
  }

  public onEditAddLink(event): void {
    this.addRangeWindow.open();
    this.blacklistAirwayBillForm.get("awbPrefix").setValue(null);
    this.blacklistAirwayBillForm.get("fromNumber").setValue(null);
    this.blacklistAirwayBillForm.get("toNumber").setValue(null);
    this.blacklistAirwayBillForm.get("remarks").setValue(null);
  }
}
