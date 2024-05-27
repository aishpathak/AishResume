import { NgcButtonComponent, PageConfiguration, UserProfile, NgcUtility } from "ngc-framework";
// Angular
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  NgModule,
  ViewChild,
  Input
} from "@angular/core";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";
import { Validators } from "@angular/forms";
// Application and Service
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcWindowComponent
} from "ngc-framework";
import { MastersService } from "../masters.service";
// ULD Type Model
import {
  UldTypeSaveRequest,
  UldTypeSaveResponse,
  UldTypeDetailsRequest,
  UldTypeDetailsResponse,
  UldTypeSearchRequest,
  UldTypeSearchResponse,
  UldTypeDeleteRequest,
  UldTypeDeleteResponse
} from "../masters.sharedmodel";
import { ApplicationFeatures } from "../../common/applicationfeatures";


@Component({
  selector: "ngc-maintainairlineuld",
  templateUrl: "./maintainairlineuld.component.html",
  styleUrls: ["./maintainairlineuld.component.scss"]
})
/**
 * This class Allow user to configure ULD Type   and to search  ULD Type,ULD Type Characteristics and carrier code.
 */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class MaintainairlineuldComponent extends NgcPage {
  currentULDType: any;
  carrierTypeDetails: any;
  displayAddEditForm: boolean;
  response: any;
  responseArray: any[];
  selectedRows: any = [];
  addNewRecordSection: boolean;
  sel: boolean;
  listconfirmDelete: any;
  uldNumber: any;
  addForm: boolean;
  updateForm: boolean;
  showResults: boolean = false;
  private uldGroupFeatureEnabled: boolean = false;
  allResp: any[];
  // indices: any = [];
  @ViewChild("window") window: NgcWindowComponent;
  @ViewChild("windowAdd") windowAdd: NgcWindowComponent;
  @ViewChild("searchButton") searchButton: NgcButtonComponent;
  @ViewChild("goTo") goTo: any;
  dataDisplay: boolean;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private masterAirlineService: MastersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
    this.displayAddEditForm = true;
  }
  private maintainUldTypeForm: NgcFormGroup = new NgcFormGroup({
    uldTypeCharacteristics: new NgcFormControl(),
    uldCharacteristicsId: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    uldType: new NgcFormControl(),
    uldTypeData: new NgcFormControl(),
    uldTypeList: new NgcFormArray([]),
    codeDetails: new NgcFormControl(),
    uldDetails: new NgcFormControl(),
    uldGroupId: new NgcFormControl(),
    uldGroup: new NgcFormControl(),
    uldTypeDeleteList: new NgcFormArray([]),
    carrierCodeDetails: new NgcFormControl("", [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(3)
    ]),
    uldTypeDetails: new NgcFormControl("", [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(3)
    ]),
    contourIndicator: new NgcFormControl("", [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(3)
    ]),
    tareWeightDetails: new NgcFormControl("", [Validators.required]),
    mainCargoNetWeightDetails: new NgcFormControl("", [Validators.required]),
    lowerCargoNetWeightDetails: new NgcFormControl("", [Validators.required]),
    halfPalletCountDetails: new NgcFormControl(),
    groupTypeDetails: new NgcFormControl(),
    minimumStockDetails: new NgcFormControl(),
    maximumStockDetails: new NgcFormControl(),
    maximumAgingDetails: new NgcFormControl(),
    plasticSheetQuantityDetails: new NgcFormControl(),
    // default: new NgcFormControl(),
    uldAircraftType: new NgcFormArray([]),
    aircrafttype: new NgcFormControl()
  });

  ngOnInit() {
    this.uldGroupFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ULD_UldGroup);
  }
  /**
    * This function will display all data one by one from backend to screen
   */
  onSearchUldType() {
    const uldTypeLists: UldTypeDetailsRequest = new UldTypeDetailsRequest();
    uldTypeLists.carrierCode = this.maintainUldTypeForm.get(
      "codeDetails"
    ).value;
    if (this.uldGroupFeatureEnabled) {
      uldTypeLists.uldGroup = this.maintainUldTypeForm.get("uldGroup").value;
    }
    uldTypeLists.uldType = this.maintainUldTypeForm.get("uldDetails").value;
    this.searchButton.disabled = true;
    this.masterAirlineService.fetchUldTypeDetails(uldTypeLists).subscribe(
      data => {
        if (data !== null) {
          this.showResults = true;
          this.response = data;
          this.responseArray = this.response.data;
          this.allResp = this.responseArray;
          this.refreshFormMessages(data);
        }
        if (this.responseArray.length > 0) {
          this.selFunction();
          this.addFunction();
          this.editFunction();
          this.dataDisplay = true;
          (<NgcFormArray>this.maintainUldTypeForm.controls[
            "uldTypeList"
          ]).patchValue(this.responseArray);
          // this.showSuccessStatus('g.completed.successfully');
          this.searchButton.disabled = false;
        } else {
          this.showResults = false;
          this.showErrorStatus("no.record.found");
          this.searchButton.disabled = false;
        }
      },
      error => {
        this.showErrorStatus("error.while.fetching.uld.type.list");
      }
    );
  }
  public populateTable() {
    (<NgcFormArray>this.maintainUldTypeForm.controls["uldTypeList"]).patchValue(
      this.responseArray
    );
  }
  /**
  * On Link Click for Edit and Add Button
  * @param event Event
  */
  public onEditAddLink(event): void {
    // this.displayAddEditForm = true;
    if (event.column === "edit") {
      this.addNewRecordSection = false;
      this.displayAddEditForm = true;

      if (event.record.carrierCode) {
        this.addForm = false;
        this.updateForm = true;
        this.window.open();
        this.maintainUldTypeForm
          .get("carrierCodeDetails")
          .setValue(event.record.carrierCode);
        this.maintainUldTypeForm
          .get("uldTypeDetails")
          .setValue(event.record.uldType);
        this.maintainUldTypeForm
          .get("contourIndicator")
          .setValue(event.record.contourIndicator);
        this.maintainUldTypeForm
          .get("tareWeightDetails")
          .setValue(event.record.tareWeight);
        this.maintainUldTypeForm
          .get("mainCargoNetWeightDetails")
          .setValue(event.record.mainCargoNetWeight);
        this.maintainUldTypeForm
          .get("lowerCargoNetWeightDetails")
          .setValue(event.record.lowerCargoNetWeight);
        this.maintainUldTypeForm
          .get("halfPalletCountDetails")
          .setValue(event.record.halfPalletCount);
        this.maintainUldTypeForm
          .get("groupTypeDetails")
          .setValue(event.record.groupType);
        this.maintainUldTypeForm
          .get("minimumStockDetails")
          .setValue(event.record.minimumStock);
        this.maintainUldTypeForm
          .get("maximumStockDetails")
          .setValue(event.record.maximumStock);
        this.maintainUldTypeForm
          .get("maximumAgingDetails")
          .setValue(event.record.maximumAging);
        this.maintainUldTypeForm
          .get("uldCharacteristicsId")
          .setValue(event.record.uldCharacteristicsId);
        // this.maintainUldTypeForm.get("default").setValue(event.record.default);
      }
    } else if (event.column === "add") {
      (<NgcFormArray>this.maintainUldTypeForm.get(
        "uldAircraftType"
      )).resetValue([]);
      const editAircraftType: UldTypeSaveRequest = new UldTypeSaveRequest();
      this.addNewRecordSection = true;
      this.displayAddEditForm = true;
      this.windowAdd.open();
      this.maintainUldTypeForm
        .get("carrierCode")
        .setValue(event.record.carrierCode);
      this.currentULDType = event.record.uldType;
      this.carrierTypeDetails = event.record.carrierCode;
      editAircraftType.carrierCode = this.carrierTypeDetails;
      editAircraftType.uldType = this.currentULDType;
      this.masterAirlineService
        .editAircraftType(editAircraftType)
        .subscribe(data => {
          this.response = data;
          this.responseArray = this.response.data;
          this.aircraftTable();
          this.windowAdd.open();
        });
    } else {
      this.addNewRecordSection = true;
      this.displayAddEditForm = true;
      this.addForm = true;
      this.updateForm = false;
      this.window.open();
      this.maintainUldTypeForm.get("carrierCodeDetails").reset();
      this.maintainUldTypeForm.get("uldTypeDetails").reset();
      this.maintainUldTypeForm.get("contourIndicator").reset();
      this.maintainUldTypeForm.get("tareWeightDetails").reset();
      this.maintainUldTypeForm.get("mainCargoNetWeightDetails").reset();
      this.maintainUldTypeForm.get("lowerCargoNetWeightDetails").reset();
      this.maintainUldTypeForm.get("halfPalletCountDetails").reset();
      this.maintainUldTypeForm.get("groupTypeDetails").reset();
      this.maintainUldTypeForm.get("minimumStockDetails").reset();
      this.maintainUldTypeForm.get("maximumStockDetails").reset();
      this.maintainUldTypeForm.get("maximumAgingDetails").reset();
      // this.maintainUldTypeForm.get("default").reset();
    }
  }
  /**
   * This function will display data one by one from responseArray on screen
   */
  aircraftTable() {
    const temp = [];
    for (const eachRow of this.responseArray) {
      eachRow.scInds = false;
      temp.push(eachRow);
    }
    (<NgcFormArray>this.maintainUldTypeForm.controls[
      "uldAircraftType"
    ]).patchValue(temp);
  }
  /**
     * This Function to create a new Window for addrow
     */
  onAddButton(event): void { }
  /**
      * This Function to create a object and add uld type to the list that has to be sent to backend for insertion and updation
      */



  public submitUldData() {

    const uldTypeDetails: UldTypeSaveRequest = new UldTypeSaveRequest();

    if (this.addNewRecordSection === true) {
      uldTypeDetails.carrierCode = this.maintainUldTypeForm.get(
        "carrierCodeDetails"
      ).value;
      uldTypeDetails.uldType = this.maintainUldTypeForm.get(
        "uldTypeDetails"
      ).value;
      uldTypeDetails.contourIndicator = this.maintainUldTypeForm.get(
        "contourIndicator"
      ).value;
      uldTypeDetails.tareWeight = this.maintainUldTypeForm.get(
        "tareWeightDetails"
      ).value;
      uldTypeDetails.mainCargoNetWeight = this.maintainUldTypeForm.get(
        "mainCargoNetWeightDetails"
      ).value;
      uldTypeDetails.lowerCargoNetWeight = this.maintainUldTypeForm.get(
        "lowerCargoNetWeightDetails"
      ).value;
      uldTypeDetails.minimumStock = this.maintainUldTypeForm.get(
        "minimumStockDetails"
      ).value;
      uldTypeDetails.minimumStock = uldTypeDetails.minimumStock
        ? uldTypeDetails.minimumStock
        : null;
      uldTypeDetails.maximumStock = this.maintainUldTypeForm.get(
        "maximumStockDetails"
      ).value;
      uldTypeDetails.maximumStock = uldTypeDetails.maximumStock
        ? uldTypeDetails.maximumStock
        : null;
      // uldTypeDetails.defualt = this.maintainUldTypeForm.get("default").value;
      uldTypeDetails.defualt = uldTypeDetails.maximumStock
        ? uldTypeDetails.defualt
        : null;
      uldTypeDetails.maximumAging = this.maintainUldTypeForm.get(
        "maximumAgingDetails"
      ).value;
      uldTypeDetails.maximumAging = uldTypeDetails.maximumAging
        ? uldTypeDetails.maximumAging
        : null;
      uldTypeDetails.createdUserCode = this.getUserProfile().userLoginCode;
      uldTypeDetails.updatedUserCode = this.getUserProfile().userLoginCode;
      if (
        uldTypeDetails["carrierCode"] === null ||
        uldTypeDetails["uldType"] === null ||
        uldTypeDetails["contourIndicator"] === null ||
        uldTypeDetails["tareWeight"] === null ||
        uldTypeDetails["lowerCargoNetWeight"] === null ||
        uldTypeDetails["mainCargoNetWeight"] === null
      ) {
        this.showErrorStatus("master.mandatory.fields.required");
      } else {
        this.masterAirlineService.saveUldTypeDetails(uldTypeDetails).subscribe(
          data => {
            this.response = data;
            if (this.response.data !== null) {
              this.selFunction();
              this.addFunction();
              this.editFunction();
              this.dataDisplay = true;
              this.onSearchUldType();
              this.showSuccessStatus("g.completed.successfully");
              this.window.hide();
            } else {
              this.showErrorStatus(this.response.messageList[0].message);
            }
          },
          error => {
            this.showErrorStatus("master.error.carrier.code.is.already.exist");
          }
        );
      }
    } else {
      uldTypeDetails.carrierCode = this.maintainUldTypeForm.get(
        "carrierCodeDetails"
      ).value;
      uldTypeDetails.uldType = this.maintainUldTypeForm.get(
        "uldTypeDetails"
      ).value;
      uldTypeDetails.contourIndicator = this.maintainUldTypeForm.get(
        "contourIndicator"
      ).value;

      uldTypeDetails.tareWeight = this.maintainUldTypeForm.get(
        "tareWeightDetails"
      ).value;
      uldTypeDetails.mainCargoNetWeight = this.maintainUldTypeForm.get(
        "mainCargoNetWeightDetails"
      ).value;
      uldTypeDetails.lowerCargoNetWeight = this.maintainUldTypeForm.get(
        "lowerCargoNetWeightDetails"
      ).value;
      uldTypeDetails.groupType = this.maintainUldTypeForm.get(
        "groupTypeDetails"
      ).value;
      uldTypeDetails.minimumStock = this.maintainUldTypeForm.get(
        "minimumStockDetails"
      ).value;
      uldTypeDetails.minimumStock = uldTypeDetails.minimumStock
        ? uldTypeDetails.minimumStock
        : null;
      uldTypeDetails.maximumStock = this.maintainUldTypeForm.get(
        "maximumStockDetails"
      ).value;
      uldTypeDetails.maximumStock = uldTypeDetails.maximumStock
        ? uldTypeDetails.maximumStock
        : null;
      uldTypeDetails.uldCharacteristicsId = this.maintainUldTypeForm
        .get("uldCharacteristicsId").value

      // uldTypeDetails.defualt = this.maintainUldTypeForm.get("default").value;
      uldTypeDetails.defualt = uldTypeDetails.maximumStock
        ? uldTypeDetails.defualt
        : null;
      uldTypeDetails.maximumAging = this.maintainUldTypeForm.get(
        "maximumAgingDetails"
      ).value;
      uldTypeDetails.maximumAging = uldTypeDetails.maximumAging
        ? uldTypeDetails.maximumAging
        : null;
      uldTypeDetails.createdUserCode = this.getUserProfile().userLoginCode;
      uldTypeDetails.updatedUserCode = this.getUserProfile().userLoginCode;
      if (
        uldTypeDetails["carrierCode"] === "" ||
        uldTypeDetails["uldType"] === "" ||
        uldTypeDetails["contourIndicator"] === "" ||
        uldTypeDetails["tareWeight"] === "" ||
        uldTypeDetails["lowerCargoNetWeight"] === "" ||
        uldTypeDetails["mainCargoNetWeight"] === ""
      ) {
        this.showErrorStatus("master.mandatory.fields.required");
      } else {
        this.masterAirlineService
          .updateUldTypeDetails(uldTypeDetails)
          .subscribe(
            data => {
              this.refreshFormMessages(data);
              if (data.data === null && data.messageList[0].code == "Plastic.sheet.association") {
                let placeHolder: any = [];
                placeHolder[0] = uldTypeDetails.carrierCode;
                placeHolder[1] = uldTypeDetails.uldType;
                placeHolder[2] = data.messageList[0].message;

                return this.showErrorStatus(NgcUtility.translateMessage("master.plastic.sheets.associated.combination", placeHolder));
              }
              this.response = data;
              this.responseArray = this.response.data;
              if (this.response.data !== null) {
                this.selFunction();
                this.addFunction();
                this.editFunction();
                this.onSearchUldType();
                this.showSuccessStatus("g.completed.successfully");
                this.window.hide();
              } else {
                this.showErrorStatus(this.response.messageList[0].message);
              }
            },
            error => {
              this.showErrorStatus("master.invalid.data.save.successful");
            }
          );
      }
    }
  }
  public editFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]["edit"] = "Edit";
    }
  }
  public addFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]["add"] = "Add";
    }
  }
  public selFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]["scInd"] = "SEL";
    }
  }
  /**
   * This Function will fetch Uld Type  onSearch
   * @param:carrierCode and Uld Type
   */
  public onSearchUldTypes() {
    this.refreshFormMessages("maintainUldTypeForm");

    const uldTypeSearch: UldTypeSearchRequest = new UldTypeSearchRequest();
    uldTypeSearch.carrierCode = this.maintainUldTypeForm.get(
      "carrierCode"
    ).value;
    uldTypeSearch.uldType = this.maintainUldTypeForm.get("uldType").value;
    (<NgcFormArray>this.maintainUldTypeForm.controls["uldTypeList"]).resetValue(
      []
    );
    this.masterAirlineService.searchUldTypeDetails(uldTypeSearch).subscribe(
      data => {
        this.response = data;
        this.responseArray = this.response.data;
        if (this.responseArray.length > 0) {
          this.selFunction();
          this.addFunction();
          this.editFunction();
          this.onSearchUldType();
          this.showSuccessStatus("g.completed.successfully");
        } else {
          this.showSuccessStatus("master.all.result.found.for.uld.type");
        }
      },
      error => {
        this.showErrorStatus("error.while.fetching.uld.type.list");
      }
    );
  }
  public showData() {
    (<NgcFormArray>this.maintainUldTypeForm.controls["uldTypeList"]).patchValue(
      this.responseArray
    );
  }
  /**
  * This function is  delete for uld type data
  */
  public deleteData() {
    this.refreshFormMessages("maintainUldTypeForm");

    const uldTypeData: UldTypeDeleteRequest = new UldTypeDeleteRequest();
    const indices: any = [];

    let patchedData = (<NgcFormArray>this.maintainUldTypeForm.controls["uldTypeList"]).getRawValue();
    patchedData.forEach(element => {
      element.loggedInUser = this.getUserProfile().userLoginCode;
      element.createdBy = this.getUserProfile().userLoginCode;
      element.modifiedBy = this.getUserProfile().userLoginCode;
      if (element.scInd === true) {
        indices.push(element);
      }
    });

    if (!indices[0]) {
      this.showErrorStatus("master.please.select.record.to.delete");
      return;
    }
    this.masterAirlineService.deleteUldType(indices).subscribe(
      data => {
        this.refreshFormMessages(data, "maintainUldTypeForm");
        if (data.data === null && data.messageList != null && data.messageList.length > 0) {
          return this.showErrorMessage(data.messageList[0].code, data.messageList[0].message, data.messageList[0].placeHolder, null);
        }
        this.response = data;
        this.responseArray = this.response.data;
        this.selFunction();
        this.addFunction();
        this.editFunction();
        this.showTable();

      },
      error => {
        this.showErrorStatus("master.invalid.data.deleted.successfully");
      }
    );
  }
  showTable() {
    const uldTypeList: UldTypeDetailsRequest = new UldTypeDetailsRequest();
    uldTypeList.carrierCode = this.maintainUldTypeForm.get(
      "codeDetails"
    ).value;
    uldTypeList.uldType = this.maintainUldTypeForm.get("uldDetails").value;
    this.masterAirlineService.fetchUldTypeDetails(uldTypeList).subscribe(
      data => {
        this.response = data;
        this.responseArray = this.response.data;
        this.selFunction();
        this.addFunction();
        this.editFunction();

        (<NgcFormArray>this.maintainUldTypeForm.controls[
          "uldTypeList"
        ]).patchValue(this.responseArray);
        this.showSuccessStatus("g.completed.successfully");
      },
      error => {
        this.showErrorStatus("master.error.deleted.records");
      }
    );
  }
  public onSelectCarrier(object) {
    this.maintainUldTypeForm.get("carrierCodeDetails").setValue(object.code);
  }
  public onSelectUldType(object) {
    this.maintainUldTypeForm.get("uldTypeDetails").setValue(object.code);
  }
  public onSelectContour(object) {
    this.maintainUldTypeForm.get("contourIndicator").setValue(object.code);
  }
  public onSelectAircraftType(object) {
    //alert(object.code)
    // this.maintainUldTypeForm.get("aircraftType").setValue(object.code);
  }
  /**
  * To add new text box
  */
  addNewLov() {
    (<NgcFormArray>this.maintainUldTypeForm.controls[
      "uldAircraftType"
    ]).addValue([
      {
        scInds: false,
        aircraftType: "",
        delete: "",
        flagInsert: "Y"
      }
    ]);
    const x = (<NgcFormArray>this.maintainUldTypeForm.controls["uldAircraftType"]).length;
    if (x > 1) {
      this.goTo.goToLastPage();
    }
  }

  public onAircraftType() {
    let airCraftTypes: UldTypeSaveRequest;
    const listArray: any = [];
    const x = (<NgcFormArray>this.maintainUldTypeForm.get("uldAircraftType"))
      .controls;
    for (let i = 0; i < x.length; i++) {
      for (let j = 0; j < x.length; j++) {
        if (i != j) {
          if (x[i].value.aircraftType == x[j].value.aircraftType) {
            this.showErrorStatus("master.ac.type.should.not.be.duplicated");
            return;
          }
        }
      }
      airCraftTypes = new UldTypeSaveRequest();
      airCraftTypes.carrierCode = this.carrierTypeDetails;
      airCraftTypes.uldType = this.currentULDType;
      airCraftTypes.aircraftType = x[i].value.aircraftType;
      airCraftTypes.createdUserCode = this.getUserProfile().userLoginCode;
      airCraftTypes.updatedUserCode = this.getUserProfile().userLoginCode;
      airCraftTypes.loggedInUser = this.getUserProfile().userLoginCode;
      airCraftTypes.createdBy = this.getUserProfile().userLoginCode;
      airCraftTypes.modifiedBy = this.getUserProfile().userLoginCode;
      if (x[i].value.flagInsert === "Y") {
        listArray.push(airCraftTypes);
      }
    }
    if (
      airCraftTypes["aircraftType"] === "" &&
      airCraftTypes["aircraftType"].valueOf
    ) {
      this.showErrorStatus("master.invalid.aircraft.type");
    } else {
      this.masterAirlineService.saveAircraftTypeDetails(listArray).subscribe(
        data => {
          //  setTimeout(() => {
          this.response = data;

          // if (
          // this.response.messageList[0].message === "System Error Occurred"
          // ) {
          // tslint:disable-next-line:quotemark
          //this.showErrorStatus("Invalid Aircraft Type");
          // return;
          // }
          if (this.response.data !== null) {
            this.showSuccessStatus("g.completed.successfully");
            this.windowAdd.hide();
          } else if (this.response.data === "System Error Occurred") {
            this.showErrorStatus(this.response.messageList[0].message);
            // this.onSearchUldType();
          } else {
            this.showErrorStatus("master.invalid.aircraft.type");
            // this.showErrorStatus('Cannot insert duplicate Value.');
          }
          // }, 1000);
        },
        error => {
          this.showErrorStatus("master.error.cannot.insert.duplicate.value");
        }
      );
    }
  }
  public deleteAircraftType(buttonNumber) {
    let checkBoxStatus = (<NgcFormArray>this.maintainUldTypeForm.get(
      "uldAircraftType"
    ))["controls"][buttonNumber]["value"];
    if (checkBoxStatus.scInds) {
      const aircraftTypes: UldTypeSaveRequest = new UldTypeSaveRequest();
      const aircraftTypeList = (<NgcFormArray>this.maintainUldTypeForm.get(
        "uldAircraftType"
      )).controls;
      const indices: any = [];
      for (let index = 0; index < aircraftTypeList.length; index++) {
        const item = (<NgcFormArray>this.maintainUldTypeForm.get(
          "uldAircraftType"
        ))["controls"][index]["value"];
        if (item.scInds) {
          item.loggedInUser = this.getUserProfile().userLoginCode;
          item.createdBy = this.getUserProfile().userLoginCode;
          item.modifiedBy = this.getUserProfile().userLoginCode;
          indices.push(item);
          // (<NgcFormArray>this.maintainUldTypeForm.controls['uldAircraftType']).deleteValue([item]);
          (<NgcFormArray>this.maintainUldTypeForm.get(
            "uldAircraftType"
          )).removeAt(index);
        }
      }
      this.masterAirlineService.deleteAircraftType(indices).subscribe(
        data => {
          this.response = data;
          this.responseArray = this.response.data;
          if (this.responseArray != null) {
            this.showSuccessStatus("g.completed.successfully");
          } else {
            this.showSuccessStatus("g.no.selected.records.deleted");
          }
        },
        error => {
          this.showErrorStatus("master.error.unable.to.delete.data");
        }
      );
    } else {
      // error please select checkbox
      this.showErrorStatus("master.please.select.the.check.box");
    }
  }
  /**
  * This Function will work for Window Cancel Button
  */
  public cancelWindowButton(event) {
    this.refreshFormMessages("maintainUldTypeForm");
    this.window.hide();
  }
  /**
 * This Function will work for Window Cancel Button
 */
  public onCancelWindow(event) {
    this.windowAdd.hide();
  }
  /**
  * This Function used to load the ULD Type based on selection on ULD Group
  */
  onSelectUldGroup(event) {
    if (event && event.code) {
      this.maintainUldTypeForm.get('uldGroupId').setValue(event.param1);
    } else {
      this.maintainUldTypeForm.get('uldGroupId').setValue(null);
    }
  }
}
