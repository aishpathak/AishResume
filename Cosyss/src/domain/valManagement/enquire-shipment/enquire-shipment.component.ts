import {
  Component,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ReflectiveInjector,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  Pipe,
  PipeTransform,
  ContentChildren,
  forwardRef,
  ViewChild,
  OnInit
} from "@angular/core";
import { Router } from "@angular/router";
import { CheckOutShipmentModel } from "./../val.checkin-model";
import { CheckinShipmentComponent } from "../checkin-shipment/checkin-shipment.component";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  NgcWindowComponent,
  NgcUtility,
  NgcTabsComponent,
  NgcButtonComponent,
  PageConfiguration,
  DateTimeKey,
  NgcFileUploadComponent
} from "ngc-framework";
import { SearchEnquireValShipment, IncomingRequest } from "./../val.sharemodel";
import { ValSharedService } from "./../val-shared.service";
import { Request } from "../../model/resp";
import { FormControlName } from "@angular/forms";
@Component({
  selector: "app-enquire-shipment",
  templateUrl: "./enquire-shipment.component.html",
  styleUrls: ["./enquire-shipment.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class EnquireShipmentComponent extends NgcPage {
  @ViewChild("searchbutton") searchbutton: NgcButtonComponent;
  @ViewChild('displayCheckoutData') displayCheckoutData: NgcWindowComponent;
  @ViewChild('mainFlies') mainFlies: NgcFileUploadComponent;
  arraylist: any;

  resp: any;
  private response;
  record: any;
  sendData: any;
  awb: string;
  cat: string;
  uldnumber: string;
  inbFlightNo: string;
  flightKey: string;
  checkInFlightDate: string;
  originAirport: string;
  destinationAirport: string;
  pieces: any;
  weight: any;
  checkInDateTime: string;
  checkOutDateTime: string;
  isTableFlg: boolean;
  awbNumber: string;
  catabag: string;
  flag: boolean = false;
  aflag: boolean = false;
  data: any;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private valSharedService: ValSharedService,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private EnquireShipmentForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    checkInFlightDate: new NgcFormControl(),
    checkInDateTimeFrom: new NgcFormControl(),
    checkInDateTimeTo: new NgcFormControl(),
    checkOutDateTimeFrom: new NgcFormControl(),
    checkOutDateTimeTo: new NgcFormControl(),
    checkOutFlag: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    cataBagNumber: new NgcFormControl()
  });

  private EnquireShipment: NgcFormGroup = new NgcFormGroup({
    IncomingRequestArray: new NgcFormArray([
      new NgcFormGroup({
        shipmentNumber: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        uldnumber: new NgcFormControl(),
        storingLocation: new NgcFormControl(),
        inbFlightNo: new NgcFormControl(),
        inbFlightDate: new NgcFormControl(),
        oubFlightNo: new NgcFormControl(),
        oubFlightDate: new NgcFormControl(),
        originAirport: new NgcFormControl(),
        destinationAirport: new NgcFormControl(),
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        std: new NgcFormControl(),
        natureOfGoods: new NgcFormControl(),
        checkInDateTime: new NgcFormControl(),
        checkOutDateTime: new NgcFormControl(),
        userId: new NgcFormControl(),
        Edit: new NgcFormControl(),
        status: new NgcFormControl(),
      })
    ])
  });
  private CheckOutForm: NgcFormGroup = new NgcFormGroup({
    sroPiecesOut: new NgcFormControl(),
    sroWeightOut: new NgcFormControl(),
    remarkOut: new NgcFormControl(),
    signature: new NgcFormControl(),
    importExportFlag: new NgcFormControl(),
    acceptedBy: new NgcFormControl(),
    issuedTo: new NgcFormControl(),
    senderIdentity: new NgcFormControl(),
    senderName: new NgcFormControl(),
    deliveryOrderNo: new NgcFormControl(),
    deliveryDate: new NgcFormControl()
  })
  date: Date;
  dateFrom: any;
  dateTo: any;

  ngOnInit() {
    super.ngOnInit();
    this.date = new Date();
    this.dateFrom = NgcUtility.getDateOnly(this.date);
    this.dateTo = NgcUtility.addDate(new Date(), 1439, DateTimeKey.MINUTES);

    this.EnquireShipmentForm
      .get("checkInDateTimeFrom")
      .patchValue(this.dateFrom);
    // this.EnquireShipmentForm.get('checkOutDateTimeFrom').patchValue(this.dateFrom);
    //this.EnquireShipmentForm.get('checkOutDateTimeTo').patchValue(NgcUtility.addDate(this.dateFrom, 1439, DateTimeKey.MINUTES));
    this.EnquireShipmentForm
      .get("checkInDateTimeTo")
      .patchValue(NgcUtility.addDate(this.dateFrom, 1439, DateTimeKey.MINUTES));
  }

  onSearch() {
    const request = this.EnquireShipmentForm.getRawValue();
    this.resetFormMessages();
    this.valSharedService.fetchSearchList(request).subscribe(
      response => {
        //this.refreshFormMessages(data);
        // this.resp = data;
        this.arraylist = response.data;
        if (!this.showResponseErrorMessages(response)) {
          this.arraylist.forEach(e => {
            e["awb"] = null;
            e["cat"] = null;
            if (e.shipmentType === "AWB") {
              e["awb"] = e.shipmentNumber;
            } else if (e.shipmentType === "CBN") {
              e["cat"] = e.shipmentNumber;
            }
          });
          this.formatDate();
          this.arraylist = this.arraylist.map(function (obj) {
            obj.flightNo = obj.inbFlightKey;
            obj.flightDate = obj.inbFlightDate;
            return obj;
          });
          this.EnquireShipment.controls["IncomingRequestArray"].patchValue(
            response.data
          );
          this.isTableFlg = true;
        } else {
          this.isTableFlg = false;
          this.showResponseErrorMessages(response);
          //this.refreshFormMessages(response);
        }
      },
      error => {
        this.showErrorStatus(NgcUtility.translateMessage("val.error", [error]));
      }
    );
  }

  public errorMessage(type, referenceId, message) {
    const errorMessage = {
      confirmMessage: false,
      messageList: [
        {
          type: type,
          referenceId: referenceId,
          message: message
        }
      ],
      success: false,
      data: null
    };
    return errorMessage;
  }

  /**
* This function is responsible for Date formating
*/
  formatDate() {
    let serialCounter = 1;
    for (let index = 0; index < this.arraylist.length; index++) {
      this.arraylist[index]["Edit"] = "Edit";
      this.arraylist[index]["serialNo"] = serialCounter++;
    }
  }

  public onLinkClick(event) {

    this.record = this.EnquireShipment.getRawValue().IncomingRequestArray[event];
    this.navigateTo(this.router, "/valmgmt/checkin-shipment", this.record);

  }
  public onBack(event) {
    this.navigateBack(this.EnquireShipmentForm.getRawValue());
  }

  onOpenWindow(group) {
    this.displayCheckoutData.open();
    this.awbNumber = this.EnquireShipment.getRawValue().IncomingRequestArray[group].awb;
    this.catabag = this.EnquireShipment.getRawValue().IncomingRequestArray[group].cat;
    if (this.awbNumber == null) {
      this.flag = false;
      this.aflag = true;
    }
    if (this.catabag == null) {
      this.aflag = false;
      this.flag = true;
    }


    const request: any = new CheckOutShipmentModel();
    request.flightKey = this.EnquireShipment.getRawValue().IncomingRequestArray[group].flightNo;
    request.flightDate = this.EnquireShipment.getRawValue().IncomingRequestArray[group].flightDate;
    request.shipmentNumber = this.EnquireShipment.getRawValue().IncomingRequestArray[group].shipmentNumber;
    request.shipmentType = this.EnquireShipment.getRawValue().IncomingRequestArray[group].shipmentType;
    console.log("DATAAaaa", JSON.stringify(request));
    this.valSharedService.fetchSearchListForCheckOut(request).subscribe(
      response => {

        this.data = response.data;
        console.log("DATAA", JSON.stringify(this.data));

        this.CheckOutForm.patchValue(this.data);
      },


      error => {
        this.showErrorStatus(NgcUtility.translateMessage("val.error", [error]));
      }
    );

  }
}
