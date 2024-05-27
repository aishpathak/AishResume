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
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormGroupDirective,
  FormArray,
  FormGroup,
  FormControl,
  FormControlName,
  Validators
} from "@angular/forms";
// Application
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
  NgcButtonComponent,
  NgcUtility,
  NgcTabsComponent,
  PageConfiguration
} from "ngc-framework";
import { ValSharedService } from "./../val-shared.service";

// Environment/Configuration
import { Environment } from "../../../environments/environment";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { OnChanges } from "@angular/core/src/metadata/lifecycle_hooks";
import { SearchShipmentContext } from "./../val.checkin-model";
import { CheckInShipmentModel } from "./../val.checkin-model";
import { ApplicationEntities } from "../../common/applicationentities";
import { AwbManagementService } from "../../awbManagement/awbManagement.service";
const Constants = {
  DEFAULT_FORM_NAME: "form",
  VOLATILE_FORM_CONTROL_ID: "volatileFormControlId"
};

@Component({
  selector: "app-checkin-shipment",
  templateUrl: "./checkin-shipment.component.html",
  styleUrls: ["./checkin-shipment.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class CheckinShipmentComponent extends NgcPage {
  writelabel: any;
  handledbyHouse: boolean = false;
  @ViewChild("searchbutton") searchbutton: NgcButtonComponent;
  isAWB: boolean = false; // flag to check whether the shipment fetched is AWB or not.
  fetchedData: any;
  //  staffIdFlag: any;
  dataModel: CheckInShipmentModel = new CheckInShipmentModel(); // instance of the CheckInShipment Model
  disabledCheckOut: boolean = false;
  // Search Form
  public searchForm: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    shipmentType: new NgcFormControl("AWB"),
    //changes for JV01-402
    hawbNumber: new NgcFormControl()
  });
  // Fetched Shipment Form
  public fetchedShipment: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    shipmentType: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    inbFlightNumber: new NgcFormControl(),
    storingLocation: new NgcFormControl(),
    checkInFlightDate: new NgcFormControl(new Date()),
    checkOutDate: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    originAirport: new NgcFormControl("", [Validators.maxLength(3)]),
    destinationAirport: new NgcFormControl("", [Validators.maxLength(3)]),
    remark: new NgcFormControl(),
    sroPiecesIn: new NgcFormControl(),
    sroWeightIn: new NgcFormControl(),
    natureOfGoods: new NgcFormControl(),
    specialHandlingCode: new NgcFormControl(),
    consigneeName: new NgcFormControl(),
    appointedAgent: new NgcFormControl(),
    ksro: new NgcFormControl("", [Validators.maxLength(30)]),
    fsro: new NgcFormControl("", [Validators.maxLength(30)]),
    senderIdentity: new NgcFormControl(),
    senderName: new NgcFormControl(),
    importExportFlag: new NgcFormControl(),
    transhipmentStatus: new NgcFormControl(),
    exportShipmentStatus: new NgcFormControl(),
    cargoStaffId: new NgcFormControl("", [Validators.maxLength(30)]),
    staffName: new NgcFormControl(),
    fileUpload: new NgcFormArray([]),
    flightList: new NgcFormArray([
      new NgcFormGroup({
        checkInFlightDate: new NgcFormControl(new Date()),
        staffName: new NgcFormControl(),
      })
    ]),
    shipmentInfo: new NgcFormGroup({
      shipmentNumber: new NgcFormControl(),
      origin: new NgcFormControl(),
      shipmentDate: new NgcFormControl(),
      destination: new NgcFormControl(),
      weight: new NgcFormControl(),
      natureOfGoods: new NgcFormControl(),
      specialHandlingCode: new NgcFormControl(),
      consigneeName: new NgcFormControl(),
      shipperName: new NgcFormControl(),
      appointedAgent: new NgcFormControl(),
      flagImportExport: new NgcFormControl()
    })
  });
  flag: boolean = false;
  flagflight: boolean = false;
  flagKsro: boolean = false;
  deleteFlag: boolean = false;
  /**
   * Initialize
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private valSharedService: ValSharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private AWBService: AwbManagementService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    //  this.checkInFlag = false;
    // getting the forwarded data
    let forwardedData = this.getNavigateData(this.activatedRoute);
    // checking if the fetched data is not null
    if (forwardedData != null) {
      this.setFetchedData(forwardedData);
    }
  }
  /**
   * Called when the data is forwarded from enquie shipment screen
   * This patches the forwarded data with checkin-shipment.
   * @param forwardedData
   * @returns void
   */
  private setFetchedData(forwardedData: any): void {
    const modelData: CheckInShipmentModel = new CheckInShipmentModel();
    const shipment: SearchShipmentContext = new SearchShipmentContext();
    // patching the forwarded data with searchForm
    if (forwardedData.checkOutDateTime) {
      this.disabledCheckOut = true;
      this.flagKsro = true;
    }
    shipment.shipmentType = forwardedData.shipmentType;
    shipment.shipmentNumber = forwardedData.shipmentNumber;
    this.searchForm.patchValue(shipment);
    // patching the forwarded data with fetchedShipment form
    modelData.sroPiecesIn = forwardedData.pieces;
    modelData.flightKey = forwardedData.inbFlightKey;
    modelData.checkInFlightDate = forwardedData.checkInFlightDate;
    modelData.originAirport = forwardedData.originAirport;
    modelData.destinationAirport = forwardedData.destinationAirport;
    modelData.sroWeightIn = forwardedData.weight;
    this.fetchedShipment.patchValue(modelData);
    this.onSearch(this.fetchedShipment.patchValue(modelData));
  }
  /**
   * Called when search button is clicked.
   * This fetches the requires shipment.
   * @param event
   * @returns void
   */
  public onSearch(event): void {

    const searchRequest: SearchShipmentContext = new SearchShipmentContext();
    const searchRawValue = this.searchForm.getRawValue(); // This gets the raw value of the search form
    this.fetchedShipment.reset(); // This resets the form
    this.fetchedShipment.get('flightList').patchValue(new Array);
    this.resetFormMessages(); // This resets the form messages
    this.flagKsro = false;
    this.valSharedService.fetchCheckInShipment(searchRawValue).subscribe(
      fetchedShipment => {
        /**
          * refreshFormMessages() method binds the form messages with the Server validations
          * Further code will not work if it doesn't pass the validations
          */

        this.writelabel = "";
        this.refreshFormMessages(fetchedShipment);
        this.fetchedData = fetchedShipment.data;
        //  this.checkInFlag = false;
        // This gets the required data from the
        // If the fetched data is not null then, the values will be patched
        if (fetchedShipment.messageList != null && fetchedShipment.messageList.length && fetchedShipment.messageList[0].code == "VAL002") {
          this.flag = true;
        }
        if (this.fetchedData != null) {
          this.writelabel = this.fetchedData.importExportFlag;
          if (this.fetchedData.flightList[0].checkInFlightDate != null) {
            this.showConfirmMessage('val.shipment.edit').then(fulfilled => {
              this.flag = true;
              this.flagflight = true;
              this.flagKsro = true;
              this.checkFetchedShipmentForAWB(this.fetchedData, searchRequest);
              this.fetchedShipment.patchValue(this.fetchedData);
              this.fetchedData.flightList.forEach(element => {
                if (element.checkOutDate != null) {
                  this.disabledCheckOut = true;
                }
              });
            });
          }
          else {
            if (this.fetchedData.checkInFlightDate == null) {
              this.fetchedData.checkInFlightDate = new Date();
            }
            // this.staffIdFlag = true;
            //  this.checkInFlag = true;
            // this.fetchedData.checkInFlightDate = this.fetchedData.checkInFlightDate;
            this.flag = true;
            this.flagflight = true;
            this.checkFetchedShipmentForAWB(this.fetchedData, searchRequest);
            this.fetchedShipment.patchValue(this.fetchedData);
            this.fetchedData.flightList.forEach(element => {
              if (element.checkOutDate != null) {
                this.disabledCheckOut = true;
              }
            });
          }

        } else {
          this.flagflight = false;
          if ((<NgcFormArray>this.fetchedShipment.controls['flightList']).length == 0) {
            (<NgcFormArray>this.fetchedShipment.controls['flightList']).addValue([
              {
                flightKey: '',
                flightDate: '',
                sroPiecesIn: '',
                sroWeightIn: '',
                checkInFlightDate: new Date(),
                ksro: '',
                fsro: '',
                storingLocation: '',
                senderIdentity: '',
                senderName: '',
                staffName: '',
                cargoStaffId: '',
                remark: '',
                remark1: '',
                remark2: '',
                deleteFlag: true
              }
            ])
          }

          this.fetchedShipment.get("checkInFlightDate").setValue(new Date());
        }
      },
      // If any error is occured during the process. For Example : ' Server is down '
      err => {
        this.showErrorStatus("g.something.wrong");
      }
    );
  }
  /**
   * This method checks whether the shipment fetched is of type AWB or not.
   * @param event
   * @returns void
   */
  private checkFetchedShipmentForAWB(
    fetchedData: any,
    searchRequest: SearchShipmentContext
  ): void {
    if (this.searchForm.get("shipmentType").value === "AWB") {
      this.isAWB = true;
    } else {
      this.isAWB = false;
    }
  }
  /**
   * Called when save button is clicked.
   * This Saves/Updates the shipment.
   * @param event
   */
  private onSave(event): void {
    const data: CheckInShipmentModel = new CheckInShipmentModel();
    // Initializing the data with the current form values
    data.shipmentType = this.searchForm.get("shipmentType").value;
    data.shipmentNumber = this.searchForm.get("shipmentNumber").value;
    data.hawbNumber = this.searchForm.get("hawbNumber").value;
    data.sroPiecesIn = this.fetchedShipment.get("sroPiecesIn").value;
    data.sroWeightIn = this.fetchedShipment.get("sroWeightIn").value;
    data.originAirport = this.fetchedShipment.get("originAirport").value;
    data.destinationAirport = this.fetchedShipment.get(
      "destinationAirport"
    ).value;
    data.flightKey = this.fetchedShipment.get("flightKey").value;
    data.flightDate = this.fetchedShipment.get("flightDate").value;
    data.checkInFlightDate = this.fetchedShipment.get(
      "checkInFlightDate"
    ).value;
    data.storingLocation = this.fetchedShipment.get("storingLocation").value;
    data.ksro = this.fetchedShipment.get("ksro").value;
    data.fsro = this.fetchedShipment.get("fsro").value;
    data.senderIdentity = this.fetchedShipment.get("senderIdentity").value;
    data.natureOfGoods = this.fetchedShipment.get("natureOfGoods").value;
    data.senderName = this.fetchedShipment.get("senderName").value;
    data.cargoStaffId = this.fetchedShipment.get("cargoStaffId").value;
    data.remark = this.fetchedShipment.get("remark").value;
    data.shipmentInfo = this.fetchedShipment.get("shipmentInfo").value;
    data.checkOutDate = this.fetchedShipment.get('checkOutDate').value;
    data.importExportFlag = this.fetchedShipment.get("importExportFlag").value;
    data.flightList = this.fetchedShipment.get('flightList').value;
    data.specialHandlingCode = this.fetchedShipment.get("specialHandlingCode").value;
    // data.fileUpload= this.fetchedShipment.get('fileUpload').value;
    // calling the service to save/update the data

    // Validation for IC & name fields
    var errorCount = 0;
    data.flightList.forEach((ele, index) => {
      var senderIdentity = (<NgcFormGroup>(<NgcFormArray>this.fetchedShipment.controls['flightList']).controls[index]).get('senderIdentity');
      var senderName = (<NgcFormGroup>(<NgcFormArray>this.fetchedShipment.controls['flightList']).controls[index]).get('senderName');
      if (senderName.value && senderName.invalid) {
        errorCount++;
      }
      if (senderIdentity.value && senderIdentity.invalid) {
        errorCount++;
      }
    })
    if (errorCount) return;

    this.valSharedService.saveCheckInShipment(data).subscribe(
      response => {
        /**
          * refreshFormMessages() method binds the form messages with the Server validations
          * Further code will not work if it doesn't pass the validations
          */
        this.refreshFormMessages(response.data);
        if (!this.showResponseErrorMessages(response)) {
          // If the data in response is not null then, the data will be saved
          this.showSuccessStatus("val.data.save.success");
          //  this.checkInFlag = false;
          this.searchForm.reset();
          this.fetchedShipment.reset();
          this.reloadPage();
          // (<NgcFormArray>this.fetchedShipment.controls['flightList']).addValue([
          //   {
          //     flightKey: '',
          //     flightDate: ''
          //   }
          // ])
        }
      },
      // If any error is occured during the process. For Example : ' Server is down '
      err => {
        this.showErrorStatus("g.something.wrong");
      }
    );
  }
  /**
   * Called when clear button is clicked.
   * This clears all the forms
   * @param event
   * @returns void
   */

  public onBack(event) {
    this.navigateBack(this.searchForm.getRawValue());
  }

  private onShipmentSelect(event) {
    if (this.searchForm.get("shipmentType") && event.shipmentType) {
      this.searchForm.get("shipmentType").setValue(event.shipmentType);
      if (event.shipmentType === "AWB") {
        this.isAWB = true;
        this.fetchedShipment.get('natureOfGoods').setValidators([Validators.required]);
      } else {
        this.isAWB = false;
        this.fetchedShipment.get('natureOfGoods').setValidators([]);
      }
      this.fetchedShipment.reset();
    }
  }

  onChange(item, index) {
    this.fetchedShipment.get(['flightList', index, 'staffName']).setValue(item.desc);
  }

  onTabOutCheckHandledBy(event) {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      if (this.searchForm.get('shipmentNumber').value == null || this.searchForm.get('shipmentNumber').value == "") {
        this.showErrorStatus('g.enter.awb');
        return;
      }

      let search = {
        shipmentNumber: this.searchForm.get('shipmentNumber').value,
        shipment: this.searchForm.get('shipmentNumber').value,
        shipmentType: this.searchForm.get('shipmentType').value,
        appFeatures: null
      }
      this.AWBService.isHandledByHouse(search).subscribe(data => {
        this.handledbyHouse = false;
        if (!this.showResponseErrorMessages(data)) {
          if (data) {
            this.handledbyHouse = true;
            this.async(() => {
              try {
                (this.searchForm.get('hawbNumber') as NgcFormControl).focus();
              } catch (e) { }
            });
          }
        }
      })
      this.resetFormMessages();
    }
  }

  onAdd() {
    // this.deleteFlag = true;
    (<NgcFormArray>this.fetchedShipment.controls['flightList']).addValue([
      {
        flightKey: '',
        flightDate: '',
        sroPiecesIn: '',
        sroWeightIn: '',
        checkInFlightDate: new Date(),
        ksro: '',
        fsro: '',
        storingLocation: '',
        senderIdentity: '',
        senderName: '',
        staffName: '',
        cargoStaffId: '',
        remark: '',
        deleteFlag: true
      }
    ])
    let arry = (<NgcFormArray>this.fetchedShipment.controls['flightList']).getRawValue();
    arry.forEach(element => {
      if (element.flagCRUD == "C") {
        element.deleteFlag = true;
        this.deleteFlag = true;
      }
    });
  }
  onDelete(index) {
    (<NgcFormArray>this.fetchedShipment.controls['flightList']).removeAt(index);
  }

}
