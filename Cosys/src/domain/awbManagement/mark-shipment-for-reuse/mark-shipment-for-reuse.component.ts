// Angular imports
import { Validators } from "@angular/forms";
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from "@angular/core";

// NGC framework imports
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcWindowComponent,
  NgcButtonComponent,
  NgcDateTimeInputComponent,
  NgcUtility,
  PageConfiguration
} from "ngc-framework";
import {
  SearchShipmentNumberForReuse,
  MarkShipmentForReuse,
  AddShipmentNumberForReuse
} from "../awbManagement.shared";
import { AwbManagementService } from "../awbManagement.service";
import { SearchShipment } from "../../valManagement/val.sharemodel";
import index from "chalk";
import { request } from "http";

@Component({
  selector: "app-mark-shipment-for-reuse",
  templateUrl: "./mark-shipment-for-reuse.component.html",
  styleUrls: ["./mark-shipment-for-reuse.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class MarkShipmentForReuseComponent extends NgcPage {
  @ViewChild("insertionWindow") insertionWindow: NgcWindowComponent;
  @ViewChild("searchbutton") searchbutton: NgcButtonComponent;
  showButtons: boolean = false;
  shpFlag: number;
  response: any;
  shipmentNumberList: any[];
  serviceResponse: any;
  awbPrefix: any = "";
  awbSuffix: any = "";
  deleteId: any;
  hasReadPermission: boolean = false;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private awbManagementService: AwbManagementService
  ) {
    super(appZone, appElement, appContainerElement);
    this.shipmentNumberList = [];
  }

  private shipmentNumberForReuse: NgcFormGroup = new NgcFormGroup({
    awbshipmentNumber: new NgcFormControl(),

    searchList: new NgcFormArray([
      new NgcFormGroup({
        shipmentId: new NgcFormControl(),
        awbResponseNumber: new NgcFormControl(),
        source: new NgcFormControl(),
        approvedBy: new NgcFormControl(),
        createdDateAndTime: new NgcFormControl(),
        remarks: new NgcFormControl()
      })
    ])
  });

  private addShipmentNumberForReuse: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    origin: new NgcFormControl(),
    remarks: new NgcFormControl()
  });

  mark: AddShipmentNumberForReuse = this.addShipmentNumberForReuse.getRawValue();

  ngOnInit() { }

  public onClear() {
    this.showButtons = false;
    this.shipmentNumberForReuse.reset();
  }

  onSearch() {
    this.hasReadPermission = NgcUtility.hasReadPermission('MARK_AWB_FOR_REUSE');
    this.resetFormMessages();
    const ship = this.shipmentNumberForReuse.getRawValue();
    const c = new MarkShipmentForReuse();
    c.awbshipmentNumber = ship.awbshipmentNumber;
    let flag = 0;
    let length = this.shipmentNumberList.length;
    if (
      this.shipmentNumberForReuse.get("awbshipmentNumber").value === null ||
      this.shipmentNumberForReuse.get("awbshipmentNumber").value === ""
    ) {
      this.searchAll();
    } else {
      this.awbManagementService.getShipmentNumber(c).subscribe(
        resp => {
          if (!this.showResponseErrorMessages(resp)) {
            let x = resp;

            this.response = resp.data;
            this.shipmentNumberList = this.response;
            this.shipmentNumberList.forEach(element => {
              element["id"] = false;
            });
            (<NgcFormArray>this.shipmentNumberForReuse.controls[
              "searchList"
            ]).patchValue(this.shipmentNumberList);
            this.showButtons = true;
          }
        },
        error => {
          this.showErrorStatus(error);
          this.searchbutton.disabled = false;
        }
      );
    }
  }

  searchAll() {
    this.resetFormMessages();
    const shipmentNumber = this.shipmentNumberForReuse.getRawValue();
    this.awbManagementService.getAllShipmentNumber(shipmentNumber).subscribe(
      data => {
        this.response = data;
        this.shipmentNumberList = this.response.data;
        this.shipmentNumberList.forEach(element => {
          element["id"] = false;
        });
        (<NgcFormArray>this.shipmentNumberForReuse.controls[
          "searchList"
        ]).patchValue(this.shipmentNumberList);
        this.showButtons = true;
      },
      error => {
        this.showErrorStatus("Error:" + error);
      }
    );
  }

  awbPrefixMethod() {
    this.awbPrefix = "";
    let i = 0;
    for (i = 0; i < 3; i++) {
      this.awbPrefix =
        this.awbPrefix +
        this.addShipmentNumberForReuse.get("shipmentNumber").value.charAt(i);
    }
    this.mark.awbPrefix = this.awbPrefix;
  }

  awbSuffixMethod() {
    this.awbSuffix = "";
    let i = 3;
    for (i = 3; i < 11; i++) {
      this.awbSuffix =
        this.awbSuffix +
        this.addShipmentNumberForReuse.get("shipmentNumber").value.charAt(i);
    }
    this.mark.awbSuffix = this.awbSuffix;
  }

  onAdd() {
    this.insertionWindow.open();
    this.addShipmentNumberForReuse.reset();
  }

  add() {
    this.awbPrefixMethod();
    this.awbSuffixMethod();
    const request = this.addShipmentNumberForReuse.getRawValue();
    if (request.origin == "") {
      request.origin = null;
    }
    request.awbPrefix = this.mark.awbPrefix;
    request.awbSuffix = this.mark.awbSuffix;
    this.awbManagementService.addShipmentNumber(request).subscribe(
      data => {
        if (!this.showResponseErrorMessages(data)) {
          if (data.data) {
            this.searchAll();
            this.showSuccessStatus('g.added.successfully');
            this.insertionWindow.hide();
          } else {
            this.showErrorStatus(data.messageList[0].code);
            this.response = data;
          }
        }

      },
      error => {
        this.showErrorStatus(error);
        this.insertionWindow.hide();
      }
    );
  }

  onDelete(event) {
    this.resetFormMessages();
    const request = this.shipmentNumberForReuse.getRawValue();
    this.awbManagementService.deleteShipmentNumber(request.searchList).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.response = data;
        if (this.response.messageList === null) {
          this.showSuccessStatus('g.completed.successfully');
          this.searchAll();
        }
      }
    },
      error => {
        this.showErrorStatus(error);
      });
  }

  public onToggleInsert() {
    this.insertionWindow.hide();
  }

  onDeleteLinkClick(event) {
    (<NgcFormArray>this.shipmentNumberForReuse.get('searchList')).markAsDeletedAt(Number(event.record.NGC_ROW_ID));
  }

  public onBack(event) {
    this.navigateBack(this.shipmentNumberForReuse.getRawValue);
  }
}
