import { NgcButtonComponent, PageConfiguration } from "ngc-framework";
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
// Application
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcWindowComponent,
  NgcContainerComponent,
  NgcReportComponent
} from "ngc-framework";
// Maintain SHC Models
import {
  MaintainSHCMastersRequest,
  MaintainSHCMastersResponse,
  MaintainSHCMasterSearchResponse,
  MaintainSHCMasterSearchRequest,
  MaintainSHCMasterEditResponse,
  MaintainSHCMasterEditRequest,
  MaintainSHCMasterSaveResponse,
  MaintainSHCMasterSaveRequest,
  MaintainSHCMasterDescResponse,
  MaintainSHCMasterDescRequest,
  MaintainSHCMasterUpdateResponse,
  MaintainSHCMasterUpdateRequest,
  MaintainSHCNonColoadableResponse,
  MaintainSHCNonColoadableRequest,
  MaintainSHCNonColoadableUpdateResponse,
  MaintainSHCNonColoadableUpdateRequest,
  MaintainSHCNonColoadableDeleteResponse,
  MaintainSHCNonColoadableDeleteRequest,
  MaintainSHCMasterDeleteRequest,
  MaintainSHCMasterDeleteResponse
} from "../masters.sharedmodel";
import { MastersService } from "../masters.service";

@Component({
  selector: "ngc-maintainshcmaster",
  templateUrl: "./maintainshcmaster.component.html",
  styleUrls: ["./maintainshcmaster.component.scss"]
})
/**
 * This class Allow user to configure pre-defined Special Handling Code and
 * to preform insert data,update data,delete a particular shc code.
 */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  restorePageOnBack: true,
  autoBackNavigation: true
})
export class MaintainSHCMasterComponent extends NgcPage implements OnInit {
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  @ViewChild("reportWindow1")
  reportWindow1: NgcReportComponent;
  displayAddEditForm: boolean;
  resp: any;
  addNewRecordSection: boolean;
  responseArray: any[];
  responseArrayData: any[];
  showEdit: boolean;
  cancel: boolean;
  hideDel: boolean;
  addForm: boolean;
  updateForm: boolean;
  showText: boolean;
  displayPage: boolean;
  @ViewChild("window")
  window: NgcWindowComponent;
  @ViewChild("windowAdd")
  windowAdd: NgcWindowComponent;
  @ViewChild("deleteButton")
  deleteButton: NgcButtonComponent;
  @ViewChild("saveButton")
  saveButton: NgcButtonComponent;
  @ViewChild("searchButton")
  searchButton: NgcButtonComponent;
  shcCode: any;
  dataDisplay: boolean;
  reportParameters: any;
  title: any;
  rowNo: number;
  private shcform: NgcFormGroup = new NgcFormGroup({
    shcCode: new NgcFormControl(),
    description: new NgcFormControl(),
    codSplHdl: new NgcFormControl(),
    desSplHdl: new NgcFormControl(),
    flgIta: new NgcFormControl(false),
    codSplHdlTyp: new NgcFormControl(),
    codeSplHdlPri: new NgcFormControl(),
    startDate: new NgcFormControl(),
    endDate: new NgcFormControl(),
    codeShc: new NgcFormControl("", [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(3)
    ]),
    codeDesc: new NgcFormControl("", [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(65)
    ]),
    codePri: new NgcFormControl(),
    shcCodeDetails: new NgcFormControl(),
    shcDescDetails: new NgcFormControl(),
    codeDetails: new NgcFormControl(),
    nonColoadableShcExists: new NgcFormControl(),
    nonColoadableSHC: new NgcFormArray([
      new NgcFormGroup({
        scInds: new NgcFormControl(),
        shcCode: new NgcFormControl()
      })
    ]),
    codeFlat: new NgcFormControl(),
    codeStartDate: new NgcFormControl(""),
    codeEndDate: new NgcFormControl(""),
    addNewCode: new NgcFormControl(),
    mmShcList: new NgcFormArray([])
  });
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private masterShcService: MastersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
    this.displayAddEditForm = true;
  }
  ngOnInit() {
    super.ngOnInit();
    this.onSearchShc();
  }
  /**
   * This function will display all data one by one from backend to screen
   */
  onSearchShc() {
    const masterCode: MaintainSHCMastersRequest = new MaintainSHCMastersRequest();
    masterCode.codSplHdl = this.shcform.get("codeDetails").value;
    masterCode.desSplHdl = this.shcform.get("shcDescDetails").value;
    // (<NgcFormArray>this.shcform.controls['mmShcList']).resetValue([]);
    this.searchButton.disabled = true;
    this.masterShcService.fetchMasterShcDetails(masterCode).subscribe(
      data => {
        this.refreshFormMessages(data);
        this.resp = data;
        this.responseArray = this.resp.data;
        // console.log(JSON.stringify(this.responseArray));
        if (this.responseArray.length > 0) {
          this.selFunction();
          this.addFunction();
          this.editFunction();
          this.dataDisplay = true;
          (<NgcFormArray>this.shcform.controls["mmShcList"]).patchValue(
            this.responseArray
          );
          this.searchButton.disabled = false;
        } else {
          this.showErrorStatus("no.record.found");
          this.searchButton.disabled = false;
        }
      }
      // error => { this.showErrorStatus('no.record.found'); }
    );
    //  this.searchButton.disabled = true;
  }
  /**
   * This function will display data one by one from responseArray on screen
   */
  populateTable() {
    (<NgcFormArray>this.shcform.controls["mmShcList"]).patchValue(
      this.responseArray
    );
  }

  public editData(event) {
    const codSplHdl: MaintainSHCMasterEditRequest = new MaintainSHCMasterEditRequest();
    codSplHdl.masterCodeEdit = this.shcform.get("codSplHdl").value;
    this.masterShcService
      .edithMaintainShcDetails(this.shcform.get("codSplHdl").value, {})
      .subscribe(
        data => {
          this.refreshFormMessages(data);
          this.resp = data;
          this.responseArray = this.resp.data;
          if (this.responseArray.length > 0) {
            this.dataDisplay = true;
            this.showSuccessStatus("g.getting.data.success");
          } else {
            this.showSuccessStatus("g.no.result.found.for.search");
          }
        }
        //  error => { this.showErrorStatus('Error: Invalid Search Criteria'); }
      );
  }
  /**
   * This Function to create a object and add to the list that has to be sent to backend for insertion and updation.
   */
  public submitData() {
    const codShcDetails: MaintainSHCMasterSaveRequest = new MaintainSHCMasterSaveRequest();
    const codSplDetails: MaintainSHCMasterUpdateRequest = new MaintainSHCMasterUpdateRequest();
    if (this.addNewRecordSection === true) {
      codShcDetails.codSplHdl = this.shcform.get("codeShc").value;
      codShcDetails.desSplHdl = this.shcform.get("codeDesc").value;
      codShcDetails.flgIta = this.shcform.get("flgIta").value;
      codShcDetails.flgIta = codShcDetails.flgIta ? "1" : null;
      codShcDetails.codeSplHdlPri = this.shcform.get("codePri").value;
      codShcDetails.startDate = this.shcform.get("startDate").value;
      codShcDetails.endDate = this.shcform.get("endDate").value;
      codShcDetails.codeSplHdlPri = this.shcform.get("codePri").value;
      this.masterShcService.saveMaintainShcDetails(codShcDetails).subscribe(
        data => {
          this.refreshFormMessages(data);
          this.resp = data;
          if (this.resp.data !== null) {
            this.selFunction();
            this.addFunction();
            this.editFunction();
            this.dataDisplay = true;
            this.onSearchShc();
            this.window.hide();
            this.showSuccessStatus("g.completed.successfully");
          } else {
            // this.window.open();
            this.showErrorStatus(this.resp.messageList[0].code ? this.resp.messageList[0].code : this.resp.messageList[0].message);
          }
        }
        //  error => { this.showErrorStatus('Error: Please enter Maximum two Number in Priority field'); }
      );
    } else {
      // Your Add new code here
      codSplDetails.codSplHdl = this.shcform.get("codeShc").value;
      codSplDetails.desSplHdl = this.shcform.get("codeDesc").value;
      codSplDetails.flgIta = this.shcform.get("flgIta").value;
      codSplDetails.flgIta = codSplDetails.flgIta ? "1" : null;
      codSplDetails.codeSplHdlPri = this.shcform.get("codePri").value;
      codSplDetails.startDate = this.shcform.get("startDate").value;
      codSplDetails.endDate = this.shcform.get("endDate").value;
      if (codSplDetails.endDate === null) {
        codSplDetails.endDate = codSplDetails.endDate ? "," : "";
      }

      this.masterShcService.updateShcDetails(codSplDetails).subscribe(
        data => {
          this.refreshFormMessages(data);
          this.resp = data;
          //  this.responseArray = this.resp.data;
          if (this.resp.data !== null) {
            this.selFunction();
            this.addFunction();
            this.editFunction();
            this.dataDisplay = true;
            this.onSearchShc();
            this.window.hide();
            this.showSuccessStatus("g.completed.successfully");
          } else {
            this.window.open();
            //  this.showErrorStatus('Enter only 65 Characters in Description field');
          }
        }
        //   error => { this.showErrorStatus('Enter only 65 Characters in Description field'); }
      );
    }
  }
  /**
   * This Function will work for Window Cancel Button
   */
  public cancelWindowButton(event) {
    this.window.hide();
  }
  /**
   * On Link Click for Edit and Add Button
   * @param event Event
   */
  addButton(event): void {
    this.title = "Maintain Special Handling Code - Add";
    this.displayAddEditForm = true;

    this.addNewRecordSection = true;
    this.addForm = true;
    this.updateForm = false;
    // FIXME required validation problem
    this.shcform.get("codeShc").setValue("");
    this.shcform.get("codeDesc").setValue("");
    this.shcform.get("codePri").setValue("");
    this.shcform.get("codeFlat").setValue("");
    this.shcform.get("startDate").setValue("");
    this.shcform.get("endDate").setValue("");
    this.window.open();
  }

  onEditAddLink(event): void {
    (<NgcFormArray>this.shcform.controls["nonColoadableSHC"]).resetValue([]);
    (<NgcFormArray>this.shcform.controls["nonColoadableSHC"]).addValue([
      {
        shcCode: "",
        scInds: false
      }
    ]);
    const nonColoadable: MaintainSHCNonColoadableRequest = new MaintainSHCNonColoadableRequest();
    if (event.column === "edit") {
      // Edit SCH information
      this.title = "Maintain Special Handling Code - Edit";
      this.hideDel = false;
      this.addForm = false;
      this.updateForm = true;
      this.addNewRecordSection = false;
      this.displayAddEditForm = true;
      if (event.record.codSplHdl) {
        this.window.open();
        this.shcform.get("codeShc").setValue(event.record.codSplHdl);
        this.shcform.get("codeDesc").setValue(event.record.desSplHdl);
        this.shcform.get("codePri").setValue(event.record.codeSplHdlPri);
        this.shcform.get("flgIta").setValue(event.record.flgIta);
        this.shcform.get("startDate").setValue(event.record.startDate);
        this.shcform.get("endDate").setValue(event.record.endDate);
      }
    } else if (event.column === "add") {
      // Change non co-loadable data of a SCH
      this.deleteButton.disabled = true;
      this.displayAddEditForm = false;
      this.shcform.get("codSplHdl").setValue(event.record.codSplHdl);
      const valueOfSpHd1 = this.shcform.get("codSplHdl").value;
      this.masterShcService
        .editColoadableShcData(valueOfSpHd1, {})
        .subscribe(data => {
          this.refreshFormMessages(data);
          this.resp = data;
          this.responseArray = this.resp.data;
          if (this.responseArray.length > 0) {
            this.nonColoadableTable();
          } else {
            this.saveButton.disabled = false;
            this.deleteButton.disabled = false;
          }
          this.windowAdd.open();
        });
    } else {
    }
  }
  /**
   * This function will display data one by one from responseArray on screen
   */
  nonColoadableTable() {
    const temp = [];
    for (const eachRow of this.responseArray) {
      eachRow.scInds = false;
      temp.push(eachRow);
    }
    (<NgcFormArray>this.shcform.controls["nonColoadableSHC"]).patchValue(temp);
  }
  /**
   * To add new text box
   */
  addNewText() {
    (<NgcFormArray>this.shcform.controls["nonColoadableSHC"]).addValue([
      {
        shcCode: "",
        scInds: false
      }
    ]);
    this.saveButton.disabled = false;
    this.deleteButton.disabled = false;
  }
  /**
   * Update or add co-loadable SCH
   */
  public submitColoadableData() {
    let shcNoncoloadable: MaintainSHCNonColoadableUpdateRequest;
    const listArray: any = [];
    const x = (<NgcFormArray>this.shcform.get("nonColoadableSHC")).controls;
    for (let i = 0; i < x.length; i++) {
      shcNoncoloadable = new MaintainSHCNonColoadableUpdateRequest();
      shcNoncoloadable.masterShc = this.shcform.get("codSplHdl").value;
      shcNoncoloadable.shcCode = x[i].value.shcCode;

      listArray.push(shcNoncoloadable);
    }
    if (shcNoncoloadable["shcCode"] === "") {
      this.showErrorStatus("error.saving.without.new.code");
    } else {
      this.masterShcService.updateShcColoadableDetails(listArray).subscribe(
        data => {
          this.refreshFormMessages(data);
          this.resp = data;
          if (this.resp.data !== null) {
            this.dataDisplay = true;
            this.windowAdd.hide();
            this.showSuccessStatus("g.completed.successfully");
          } else {
            this.windowAdd.open();
            //  this.showErrorStatus(this.resp.messageList[0].message);
          }
        }
        // error => { this.showErrorStatus(this.resp.messageList[0].message); }
      );
    }
  }
  /**
   * This is  delete for NonColoadableSHC code data
   */
  public deleteColoadableData(event) {
    this.deleteButton.disabled = false;
    const shcCodeColoadable: MaintainSHCNonColoadableDeleteRequest = new MaintainSHCNonColoadableDeleteRequest();
    const coloadableData = (<NgcFormArray>(
      this.shcform.get("nonColoadableSHC")
    )).getRawValue();
    const indices: any = [];
    let i = 0;
    for (const eachRow of coloadableData) {
      if (eachRow.scInds) {
        indices.push(eachRow);
        (<NgcFormArray>this.shcform.get("nonColoadableSHC")).deleteValueAt(i);
        --i;
      }
      ++i;
    }
    console.log(JSON.stringify(indices));
    this.masterShcService.deleteShcColoadableShcData(indices).subscribe(
      data => {
        this.refreshFormMessages(data);
        if (!data.messageList) {
          this.resp = data;
          // this.responseArray = this.resp.data;
          if (this.resp.data) {
            this.showSuccessStatus("g.completed.successfully");
          } else {
            this.showErrorStatus("error.deletion.failed");
          }
        }
      }
      // error => { this.showErrorStatus('Error: No records deleted successfully'); }
    );
  }

  onClick() {
    this.deleteButton.disabled = false;
  }

  public editFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]["edit"] = "Edit";
      this.responseArray[index].flgIta = this.responseArray[index].flgIta
        ? true
        : false;
      this.responseArray[index].startDate = this.responseArray[index].startDate;
      this.responseArray[index].endDate = this.responseArray[index].endDate;
    }
  }
  public addFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]["add"] = "Add";
    }
  }
  public selFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]["scInd"] = false;
    }
  }
  /**
   * This function is  delete for shc code data
   */
  public deleteData() {
    const schDelete: MaintainSHCMasterDeleteRequest = new MaintainSHCMasterDeleteRequest();
    const indices: any = [];
    for (let index = this.responseArray.length - 1; index >= 0; index--) {
      const item = (<NgcFormArray>this.shcform.get("mmShcList"))["controls"][
        index
      ]["value"];
      if (item.scInd) {
        indices.push(item);
      }
    }
    if (!indices[0]) {
      this.showErrorStatus("master.please.select.record.to.delete");
      return;
    }
    this.masterShcService.deleteShcDetails(indices).subscribe(
      data => {
        this.refreshFormMessages(data);
        this.resp = data;
        this.responseArray = this.resp.data;
        this.selFunction();
        this.addFunction();
        this.editFunction();
        this.window.hide();
        this.showTable();
      }
      // error => { this.showErrorStatus('Error: Please select the Data'); }
    );
  }
  public onAddRow(event) {
    (<NgcFormArray>this.shcform.controls["nonColoadableSHC"]).addValue([
      {
        select: "",
        shcCode: ""
      }
    ]);
  }
  public onAddLink(event): void {
    if (event.column === "add") {
      // this.addwindow.open();
    }
  }
  showTable() {
    const masterCode: MaintainSHCMastersRequest = new MaintainSHCMastersRequest();
    this.masterShcService.fetchMasterShcDetails(masterCode).subscribe(
      data => {
        this.refreshFormMessages(data);
        console.log(JSON.stringify(data));
        this.resp = data;
        this.responseArray = this.resp.data;
        if (this.responseArray.length > 0) {
          this.selFunction();
          this.addFunction();
          this.editFunction();
          this.dataDisplay = true;
          (<NgcFormArray>this.shcform.controls["mmShcList"]).patchValue(
            this.responseArray
          );
          this.showSuccessStatus("g.completed.successfully");
        } else {
          this.showSuccessStatus("g.no.selected.records.deleted");
        }
      }
      // error => { this.showErrorStatus('Error:' + ' deleted records'); }
    );
  }
  /**
   * This Function will work for Window Cancel Button
   */
  public onCancelWindow(event) {
    this.windowAdd.hide();
  }
  public onChange(event) {
    this.deleteButton.disabled = false;
  }
  shcReport() {
    const reportParameters: any = {};
    if (
      !this.shcform.get("codeDetails").value &&
      !this.shcform.get("shcDescDetails").value
    ) {
      this.reportWindow1.open();
    } else {
      reportParameters.CODE = this.shcform.get("codeDetails").value;
      reportParameters.CDescription = this.shcform.get("shcDescDetails").value;
      this.reportParameters = reportParameters;
      this.reportWindow.open();
    }

    //this.reportWindow1.open();
  }
}
