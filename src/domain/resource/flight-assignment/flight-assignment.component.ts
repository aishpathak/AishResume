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
  Flight,
  FlightAssignment,
  Staff,
  StaffAgainstFlight
} from "./../resource.sharedmodel";
import { ResourceService } from "./../resource.service";

@Component({
  selector: "app-flight-assignment",
  templateUrl: "./flight-assignment.component.html",
  styleUrls: ["./flight-assignment.component.css"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class FlightAssignmentComponent extends NgcPage implements OnInit {
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

  private resourceFlight: NgcFormGroup = new NgcFormGroup({
    from: new NgcFormControl(),
    to: new NgcFormControl(),
    handlingArea: new NgcFormControl(),
    carrier: new NgcFormControl(),
    role: new NgcFormControl(),
    staff: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    uploadDoc: new NgcFormControl(),
    role1: new NgcFormControl(),
    role2: new NgcFormControl(),
    role3: new NgcFormControl(),
    type: new NgcFormControl(),
    flightList: new NgcFormArray([])
  });

  staffAssign: boolean = false;
  response: any;

  search() {
    this.staffAssign = true;
    let flightAssignment = new FlightAssignment();
    flightAssignment.from = this.resourceFlight.get("from").value;
    flightAssignment.to = this.resourceFlight.get("to").value;
    flightAssignment.handlingArea = this.resourceFlight.get(
      "handlingArea"
    ).value;
    flightAssignment.carrier = this.resourceFlight.get("carrier").value;
    flightAssignment.role1 = this.resourceFlight.get("role1").value;
    flightAssignment.role2 = this.resourceFlight.get("role2").value;
    flightAssignment.role3 = this.resourceFlight.get("role3").value;
    flightAssignment.type = this.resourceFlight.get("type").value;
    // search.role = this.resourceFlight.get("role").value;
    // search.flightKey = this.resourceFlight.get("flightKey").value;
    this.resourceService
      .searchFlightAssignment(flightAssignment)
      .subscribe(data => {
        this.staffAssign = true;
        this.response = data.data;
        this.resourceFlight.get("flightList").patchValue(this.response);
      });
  }

  onSave() {
    const request = this.resourceFlight.getRawValue();
    // let flightAssignment = StaffAgainstFlight;
    let flightArray = new Array<StaffAgainstFlight>();
    request.flightList.forEach(flight => {
      if (flight["flagCRUD"] === "U") {
        flight["role1"] = this.resourceFlight.get("role1").value;
        flight["role2"] = this.resourceFlight.get("role2").value;
        flight["role3"] = this.resourceFlight.get("role3").value;
        flightArray.push(flight);
      }
    });
    // this.resourceService.saveStaffAllocation(flightArray).subscribe(
    //   data => {
    //     if (!data.messageList) {
    //       this.showSuccessStatus("Added Successfully");
    //     } else {
    //       this.refreshFormMessages(data);
    //     }
    //   },
    //   error => {
    //     this.showErrorStatus(error.messageList[0].message);
    //   }
    // );
  }
  ngOnInit() {}
}
