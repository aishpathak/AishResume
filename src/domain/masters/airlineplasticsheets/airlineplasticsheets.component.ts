import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  OnDestroy,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Validators } from "@angular/forms";
// NGC framework imports
import {
  NgcUtility,
  NgcFormGroup,
  NgcFormArray,
  NgcApplication,
  NgcWindowComponent,
  NgcDropDownComponent,
  NgcButtonComponent,
  NgcPage,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  PageConfiguration,
  NgcFormControl,
  BaseRequest,
  CellsRendererStyle,
  ErrorMessage
} from "ngc-framework";
import { MastersService } from "../masters.service";
// ULD Type Model
import {
  PlasticSheetsSaveResponse,
  PlasticSheetsSaveRequest,
  AirlinePlasticDeleteRequest,
  AirlinePlasticSearchRequest
} from "../masters.sharedmodel";

@Component({
  selector: "app-airlineplasticsheets",
  templateUrl: "./airlineplasticsheets.component.html",
  styleUrls: ["./airlineplasticsheets.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class AirlineplasticsheetsComponent extends NgcPage implements OnInit {
  showTableData: boolean = false;
  arrayDelete: any;
  super: any;
  response: any;
  updateForm: boolean = false;
  saveForm: boolean = false;
  responseArray: any[];
  updateFormData: boolean;
  showList: boolean;
  @ViewChild("window") window: NgcWindowComponent;
  checkDataValue: NgcFormGroup;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private airlinePlasticService: MastersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    // this.super();
    this.airlinePlasticForm.controls.containerCountDetails.valueChanges.subscribe((data) => {
      console.log(data);
      this.checkDataValue = <NgcFormGroup>this.airlinePlasticForm.getRawValue();
    });
    this.airlinePlasticForm.controls.containerCount.valueChanges.subscribe((data) => {
      console.log(data);
      this.checkDataValue = <NgcFormGroup>this.airlinePlasticForm.getRawValue();
    });   
  }
  // tslint:disable-next-line:member-ordering
  private airlinePlasticForm: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    uldType: new NgcFormControl(),
    contourIndicator: new NgcFormControl(),
    accessoryType: new NgcFormControl(),
    defualtType: new NgcFormControl(false),
    contourIndicators: new NgcFormControl(),
    carrierCodeDetails: new NgcFormControl(),
    uldTypeDetails: new NgcFormControl(),
    accessoryTypeDetails: new NgcFormControl(),
    containerCount: new NgcFormControl(),
    containerCountDetails: new NgcFormControl(),
    uldPlasticsheetId: new NgcFormControl(),
    airlineSheetsList: new NgcFormArray([])
  });

  public onEditAddLink(event): void {
    if (event.column === "edit") {
      this.updateForm = true;
      this.saveForm = false;
      if (event.record.carrierCode) {
        this.airlinePlasticForm.get("uldTypeDetails").setValue(event.record.uldType);
        this.airlinePlasticForm.get("defualtType").setValue(event.record.defualtType);
        this.airlinePlasticForm.get("carrierCodeDetails").setValue(event.record.carrierCode);
        this.airlinePlasticForm.get("contourIndicators").setValue(event.record.contourIndicator);
        this.airlinePlasticForm.get("uldPlasticsheetId").setValue(event.record.uldPlasticsheetId);
        this.airlinePlasticForm.get("containerCountDetails").setValue(event.record.containerCount);
        this.airlinePlasticForm.get("accessoryTypeDetails").setValue(event.record.accessoryType);
        this.window.open();
      }
    } else {
      this.saveForm = true;
      this.updateForm = false;
      this.window.open();
      this.airlinePlasticForm.get("carrierCodeDetails").setValue(null);
      this.airlinePlasticForm.get("uldTypeDetails").setValue(null);
      this.airlinePlasticForm.get("contourIndicators").setValue(null);
      this.airlinePlasticForm.get("containerCountDetails").setValue(null);
      this.airlinePlasticForm.get("defualtType").setValue(false);
      this.airlinePlasticForm.get("uldPlasticsheetId").setValue(null);
      this.airlinePlasticForm.get("accessoryTypeDetails").setValue(null);
    }
  }

  /**
  * This Function to create a object and add uld type to the list that has to be sent to backend for insertion and updation
  */
  public onSave() {
    const plasticDetails: PlasticSheetsSaveRequest = new PlasticSheetsSaveRequest();
    plasticDetails.defualtType = this.airlinePlasticForm.get("defualtType").value;
    plasticDetails.uldType = this.airlinePlasticForm.get("uldTypeDetails").value;
    plasticDetails.carrierCode = this.airlinePlasticForm.get("carrierCodeDetails").value;
    plasticDetails.contourIndicator = this.airlinePlasticForm.get("contourIndicators").value;
    plasticDetails.uldPlasticsheetId = this.airlinePlasticForm.get("uldPlasticsheetId").value;
    plasticDetails.containerCount = this.airlinePlasticForm.get("containerCountDetails").value;
    plasticDetails.accessoryType = this.airlinePlasticForm.get("accessoryTypeDetails").value;
    if (this.airlinePlasticForm.invalid) {
      return;
    }
    this.airlinePlasticService.saveAirlinePlasticList(plasticDetails).subscribe(data => {
      this.response = data;
      this.refreshFormMessages(data);
      if (this.response.data !== null) {
        // this.showTable();
        if(this.response.data.messageList.length > 0){
          this.showResponseErrorMessages(this.response);
        } else{
          this.window.hide();
          this.showSuccessStatus("g.updated.successfully");
          this.onSearch();
          }
      }
    },
    );
  }
  public onUpdate() {
    const plasticDetails: PlasticSheetsSaveRequest = new PlasticSheetsSaveRequest();
    plasticDetails.defualtType = this.airlinePlasticForm.get("defualtType").value;
    plasticDetails.uldType = this.airlinePlasticForm.get("uldTypeDetails").value;
    plasticDetails.carrierCode = this.airlinePlasticForm.get("carrierCodeDetails").value;
    plasticDetails.contourIndicator = this.airlinePlasticForm.get("contourIndicators").value;
    plasticDetails.uldPlasticsheetId = this.airlinePlasticForm.get("uldPlasticsheetId").value;
    plasticDetails.containerCount = this.airlinePlasticForm.get("containerCountDetails").value;
    plasticDetails.accessoryType = this.airlinePlasticForm.get("accessoryTypeDetails").value;
    if (this.airlinePlasticForm.invalid) {
      return;
    }
    this.airlinePlasticService.updatePlasticSheet(plasticDetails).subscribe(data => {
      this.response = data;
      this.refreshFormMessages(data);
      if (this.response.data !== null) {
        if(this.response.data.messageList.length > 0){
          this.showResponseErrorMessages(this.response);
        } else{
          this.showSuccessStatus("g.updated.successfully");
          this.window.hide();
          //this.showTable();
          this.onSearch();
        }
      }
    },
    );
  }

  /**
  * This Function will work for Window Cancel Button
  */
  public cancelWindowButton(event) {
    this.window.hide();
  }

  /**
   * This Function will fetch Uld Type  onSearch
   * @param:carrierCode and Uld Type
   */
  public onSearch() {
    this.showList = false;
    this.resetFormMessages();
    const requestData = this.airlinePlasticForm.getRawValue();
    this.airlinePlasticService.searchAirlineList(requestData).subscribe(
      data => {
        this.response = data;
        this.responseArray = this.response.data;
        if (this.responseArray.length > 0) {
          this.showList = true;
          this.showTableData = true;
          (<NgcFormArray>this.airlinePlasticForm.get(["airlineSheetsList"])).patchValue(this.responseArray);
        } else {
          this.showErrorStatus("no.record.found");
          this.showTableData = false;
        }
      },
      error => {
        this.showErrorStatus(
          "master.error.fetching.airline.plastic.sheets.list"
        );
      }
    );
  }

  /**
  * This function is  delete for uld type data
  */
  public deleteData() {
    const indices: any = [];
    for (let index = this.responseArray.length - 1; index >= 0; index--) {
      const item = (<NgcFormArray>this.airlinePlasticForm.get("airlineSheetsList"))["controls"][index]["value"];
      if (item.scInd) {
        indices.push(item);
      }
    }
    if (!indices[0]) {
      this.showErrorStatus("master.please.select.record.to.delete");
      return;
    }
    this.airlinePlasticService.deletePlasticSheets(indices).subscribe(
      data => {
        this.refreshFormMessages(data);
        this.response = data;
        this.window.hide();
        //this.showTable();
        this.showSuccessStatus("g.deleted.successfully")
        this.onSearch();
      },
      error => {
        this.showErrorStatus("master.invalid.data.deleted.successfully");
      }
    );
  }

  showTable() {
    const airlinePlastic: AirlinePlasticSearchRequest = new AirlinePlasticSearchRequest();
    this.airlinePlasticService.searchAirlineList(airlinePlastic).subscribe(
      data => {
        this.refreshFormMessages(data);
        this.response = data;
        this.responseArray = this.response.data;
        if (this.responseArray.length > 0) {
          (<NgcFormArray>this.airlinePlasticForm.get(["airlineSheetsList"])).patchValue(this.responseArray);
        } else {
          this.showSuccessStatus("g.no.selected.records.deleted");
        }
      }
    );
  }

  closeWindow(event) {
    this.airlinePlasticForm.get("defualtType").setValue(false);
    this.airlinePlasticForm.get("uldTypeDetails").setValue(null);
    this.airlinePlasticForm.get("contourIndicators").setValue(null);
    this.airlinePlasticForm.get("uldPlasticsheetId").setValue(null);
    this.airlinePlasticForm.get("carrierCodeDetails").setValue(null);
    this.airlinePlasticForm.get("containerCountDetails").setValue(null);
    this.airlinePlasticForm.get("accessoryTypeDetails").setValue(null);
  }
}
