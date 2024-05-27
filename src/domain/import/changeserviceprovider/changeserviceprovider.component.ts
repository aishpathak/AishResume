import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  OnDestroy,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import { RouterModule, ActivatedRoute, Router } from "@angular/router";
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
import { CellsStyleClass } from "../../../shared/shared.data";
import { ImportService } from "../import.service";

@Component({
  selector: "app-changeserviceprovider",
  templateUrl: "./changeserviceprovider.component.html",
  styleUrls: ["./changeserviceprovider.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class ChangeserviceproviderComponent extends NgcPage {
  flightData: any;
  @ViewChild("disableAddRow") disableAddRow: NgcButtonComponent;
  private fetchValue: any;
  response: any;
  responseArray: any[];
  defaultControles: any;
  disabled = false;
  // tslint:disable-next-line:member-ordering
  private defaultServiceProviderForm: NgcFormGroup = new NgcFormGroup({
    defaultServiceDetails: new NgcFormArray([])
  });
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }
  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.fetchValue = this.getNavigateData(this.route);
    this.flightData = this.fetchValue[0].flightKeyType;
    if (this.fetchValue !== null) {
      this.defaultControles = this.fetchValue[0].length;
    }
    this.defaultServiceProviderForm
      .get("defaultServiceDetails")
      .patchValue(this.fetchValue);
  }

  /**
     * To add new text box
     */
  addNewText(event) {
    (<NgcFormArray>this.defaultServiceProviderForm.controls[
      "defaultServiceDetails"
    ]).addValue([
      {
        scInds: false,
        terminalCode: this.fetchValue[0].terminalCode,
        flightKeyType: this.fetchValue[0].flightKeyType,
        flightDate: NgcUtility.getDateTimeAsString(this.fetchValue[0].flightDate),
        customerCode: this.fetchValue[0].customerCode,
        serviceProviderCodeOld: "",
        serviceProviderCodeNew: "",
        reason: ""
      }
    ]);
    this.disableAddRow.disabled = true;
  }
  public onSave(event) {
    const item = (<NgcFormArray>this.defaultServiceProviderForm.get(
      "defaultServiceDetails"
    )).getRawValue();
    this.importService.updateServiceList(item).subscribe(
      data => {
        this.response = data;
        this.refreshFormMessages(data);
        if (this.response.data !== null) {
          this.navigate("import/maintainserviceprovider", {});
          this.showSuccessStatus("g.completed.successfully");
        } else {
          this.showErrorStatus("error.import.select.unique.service.code");
        }
      },
      error => {
        this.showErrorStatus("error.import.select.unique.service.code");
      }
    );
  }
  onSearch() {
    console.log("on search");
    const serviceProviderList = this.defaultServiceProviderForm.getRawValue()
      .searchServiceProvider;
    this.importService.getServiceProviderList(serviceProviderList).subscribe(
      data => {
        this.response = data;
        this.responseArray = this.response.data;
        this.refreshFormMessages(data);
        if (this.response.data.length !== 0) {
          (<NgcFormArray>this.defaultServiceProviderForm.controls[
            "defaultServiceDetails"
          ]).patchValue(this.response.data);
        } else {
          this.showErrorMessage("no.record.found");
        }
      },
      // tslint:disable-next-line:no-shadowed-variable
      error => {
        // this.showErrorStatus("no.record.found");
      }
    );
    // }
  }
  /**
   * This function, get Selected value from Customer Master and show the description 
   *
  */
  public onSelectCarrier(event, index) {
    if (event.code) {
      this.defaultServiceProviderForm
        .get(["defaultServiceDetails", index, "serviceProviderCodeOld"])
        .setValue(event.desc);
    }
  }
}
