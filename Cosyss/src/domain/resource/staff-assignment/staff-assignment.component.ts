import { Validators } from "@angular/forms";
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild,
  Directive
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcWindowComponent,
  NgcButtonComponent,
  NgcUtility,
  PageConfiguration
} from "ngc-framework";
import {
  StaffAssignmentFlight,
  Flight,
  Staff,
  FileUpload
} from "./../resource.sharedmodel";
import { ResourceService } from "./../resource.service";

@Component({
  selector: "ngc-resource-allocation",
  templateUrl: "./staff-assignment.component.html",
  styleUrls: ["./staff-assignment.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class StaffAssignmentComponent extends NgcPage implements OnInit {
  @ViewChild("returnButton") returnButton: NgcButtonComponent;
  @ViewChild("addButton") addButton: NgcButtonComponent;
  @ViewChild("staffWindow") staffWindow: NgcWindowComponent;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private resourceService: ResourceService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private resourceForm: NgcFormGroup = new NgcFormGroup({
    staffList: new NgcFormArray([]),
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    handlingArea: new NgcFormControl(),
    role: new NgcFormControl(),
    staff: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    uploadDoc: new NgcFormControl()
  });

  private windowForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    staffId: new NgcFormControl(),
    name: new NgcFormControl(),
    role: new NgcFormControl(),
    shtTimeFrom: new NgcFormControl(),
    shtTimeTo: new NgcFormControl(),
    date: new NgcFormControl(),
    flightList: new NgcFormArray([]),
    staffNumberId: new NgcFormControl()
  });

  staffAssign: boolean = false;
  saveFlag: boolean = false;
  response: any;
  flightResponse: any;
  reStaffInfoId: any;
  resFlightInfoId: any;
  newArray = new Array(10);
  roleSourceParameter: any;
  userProId: any;
  show_staff_lov: boolean = true;

  ngOnInit() { }

  search() {
    let search = new Staff();
    search.from = this.resourceForm.get("fromDate").value;
    search.to = this.resourceForm.get("toDate").value;
    search.roleCode = this.resourceForm.get("role").value;
    search.handlingArea = this.resourceForm.get("handlingArea").value;
    // search.handlingArea = this.resourceForm.get("handlingArea").value;
    // search.role = this.resourceForm.get("role").value;
    // search.staff = this.resourceForm.get("staff").value;
    // search.flightKey = this.resourceForm.get("flightKey").value;
    //this.resourceService.searchStaffAssignment(search).subscribe(data => {
    //  console.log(data);
    //   this.staffAssign = true;
    //   this.response = data.data;
    //   this.resourceForm.get("staffList").patchValue(this.response);
    //  });

    this.resourceService.searchStaffAssignment(search).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        console.log(data);
        this.staffAssign = true;
        this.response = data.data;
        this.resourceForm.get("staffList").patchValue(this.response);
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }

  add(event, index) {
    this.staffWindow.open();
    this.windowForm.get("staffId").setValue(this.response[index].userProfileId);
    this.windowForm.get("staffNumberId").setValue(this.response[index].staffId);
    this.windowForm.get("name").setValue(this.response[index].name);
    this.windowForm.get("role").setValue(this.response[index].roleCode);
    this.windowForm
      .get("shtTimeFrom")
      .setValue(this.response[index].shiftStart);
    this.windowForm.get("shtTimeTo").setValue(this.response[index].shiftEnd);
    this.windowForm.get("date").setValue(this.response[index].shiftDate);
    this.windowForm.get("flightList").patchValue(this.response[index].flights);
    this.reStaffInfoId = this.response[index].resourceStaffShiftInfoId;
    this.resFlightInfoId = this.response[index].flights;
    this.show_staff_lov = false;
  }

  addNew() {
    this.saveFlag = true;
    this.windowForm.reset();
    (<NgcFormArray>this.windowForm.get("flightList")).resetValue([]);
    this.staffWindow.open();
  }

  addFlight(index) {
    const noOfRows = (<NgcFormArray>this.windowForm.get("flightList")).length;
    const lastRow = noOfRows
      ? (<NgcFormArray>this.windowForm.get("flightList")).controls[noOfRows - 1]
      : null;
    if (noOfRows === 0 || lastRow.get("std").value) {
      (<NgcFormArray>this.windowForm.get("flightList")).addValue([
        {
          flagCRUD: "C",
          flightKey: null,
          std: null,
          flightId: null
        }
      ]);
    } else {
      this.showErrorStatus(
        "error.fill.flight.details.to.add.row"
      );
    }
  }

  onFlightkeyinput(event, index) {
    let flightkeyInput = new Flight();
    flightkeyInput.flightKey = event;
    flightkeyInput.flightOriginDate = this.windowForm.get("date").value;
    if (event != null) {
      this.resourceService.getFlightDate(flightkeyInput).subscribe(data => {
        this.flightResponse = data.data;
        this.windowForm
          .get(["flightList", index, "std"])
          .patchValue(this.flightResponse.std);
        this.windowForm
          .get(["flightList", index, "flightId"])
          .patchValue(this.flightResponse.flightId);
        if (this.flightResponse.flightId) {
          // this.addFlight(index++);
        }
      });
    }
  }

  saveStaff() {
    console.info("save==================");
    const request = this.windowForm.getRawValue();
    const flightArray = new Array<Flight>();
    let saveStaff = new Staff();
    request.flightList.forEach(flight => {
      if (flight["flagCRUD"] === "C") {
        flight["std"] = null;
        flightArray.push(flight);
      }
    });
    saveStaff.flights = flightArray;
    saveStaff.staffId = request.staffId;
    saveStaff.roleCode = request.roleCode;
    saveStaff.name = request.name;
    saveStaff.shiftDate = request.date;
    saveStaff.shiftStart = request.shtTimeFrom;
    saveStaff.shiftEnd = request.shtTimeTo;
    saveStaff.resourceStaffShiftInfoId = this.reStaffInfoId;
    console.log(saveStaff);
    this.resourceService.saveStaffAllocation(saveStaff).subscribe(
      data => {
        if (!data.messageList) {
          this.search();
          this.staffWindow.hide();
          this.showSuccessStatus("g.added.successfully");
        } else {
          this.refreshFormMessages(data);
        }
      },
      error => {
        this.showErrorStatus(error.messageList[0].message);
        this.staffWindow.hide();
      }
    );
  }

  onConfirm(event) {
    console.log(event);
    this.showConfirmMessage(
      "admin.delete.selected.records.confirmation"
    ).then(fulfilled => {
      this.onDelete(event);
    });
  }

  onDelete(index) {
    let flightInfoId = new Flight();

    if (this.resFlightInfoId[index] != null &&
      this.resFlightInfoId[index].resourceStaffAllocatedFlightInfoId != null) {
      flightInfoId.resourceStaffAllocatedFlightInfoId = this.resFlightInfoId[
        index
      ].resourceStaffAllocatedFlightInfoId;

      this.resourceService.deleteStaff(flightInfoId).subscribe(data => {
        this.staffWindow.hide();
        this.search();
        this.showSuccessStatus("g.deleted.successfully");
      });
    } else {
      (<NgcFormArray>this.windowForm.controls['flightList']).removeAt(index);
    }

  }

  onCloseWindow(event: any) {
    this.staffWindow.close();
    this.show_staff_lov = true;
  }

  getStaff(event, index) {
    this.windowForm.get("staffId").setValue(event.code);
    this.windowForm.get("name").setValue(event.desc);
    this.windowForm.get("role").setValue(event.param2);
    this.windowForm.get("staffNumberId").setValue(event.param3);
    this.userProId = event.param1;
    this.show_staff_lov = false;
  }

  saveOnlyStaff() {
    console.info("update==================");
    let saveOnlyStaff = new Staff();
    saveOnlyStaff.name = this.windowForm.get("name").value;
    console.info("this.userProId==================" + this.userProId);
    saveOnlyStaff.staffId = this.userProId;
    console.info("this.staffid==================" + this.windowForm.get("staffId").value);
    saveOnlyStaff.staffId = this.windowForm.get("staffId").value;
    saveOnlyStaff.roleCode = this.windowForm.get("role").value;
    saveOnlyStaff.shiftDate = this.windowForm.get("date").value;
    saveOnlyStaff.shiftStart = this.windowForm.get("shtTimeFrom").value;
    saveOnlyStaff.shiftEnd = this.windowForm.get("shtTimeTo").value;
    saveOnlyStaff.flights = this.windowForm.get("flightList").value;
    console.log(saveOnlyStaff);
    this.resourceService.saveStaffAssignment(saveOnlyStaff).subscribe(
      data => {
        if (!data.messageList) {
          this.search();
          this.staffWindow.hide();
          this.showSuccessStatus("g.added.successfully");
        } else {
          this.refreshFormMessages(data);
        }
      },
      error => {
        this.showErrorStatus(error.messageList[0].message);
        this.staffWindow.hide();
      }
    );
  }
  onChooseDocuments(event) {
    event.file.documentType = "mail";
    const fileReq = new FileUpload();
    fileReq.document = event.file.document;
    fileReq.documentType = 'EXCEL';
    this.resourceService.uploadRoster(fileReq).subscribe(
      data => {
        if (!data.messageList) {
          this.showSuccessStatus("billing.success.uploaded.successfully");
        } else {
          this.refreshFormMessages(data);
        }
      },
      error => {
        this.showErrorStatus(error.messageList[0].message);
      }
    );
  }
  onRoleSelect(event) {
    this.roleSourceParameter = this.createSourceParameter(this.resourceForm.get("role").value);
  }
}
