import {
  Component,
  NgZone,
  ElementRef,
  ViewContainerRef,
  OnInit,
  OnChanges,
  ViewChild,
  ViewChildren,
  QueryList
} from "@angular/core";
import {
  NgcPage,
  NgcFormGroup,
  NgcWindowComponent,
  NgcFormArray,
  NgcDropDownComponent,
  NgcUtility,
  NgcButtonComponent,
  NgcDataTableComponent,
  PageConfiguration
} from "ngc-framework";
import { NgcFormControl } from "ngc-framework";
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from "../../../admin.service";
import { TeamCreation } from './../../../admin.sharedmodel';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class CreateTeamComponent extends NgcPage implements OnInit {
  showRoleCode: boolean = false;
  getLovForStaff: any;
  constructor(private adminService: AdminService,
    appZone: NgZone,
    appElement: ElementRef,
    private router: Router,
    appContainerElement: ViewContainerRef) {
    super(appZone, appElement, appContainerElement);
  }
  private createTeamForm: NgcFormGroup = new NgcFormGroup({
    teamName: new NgcFormControl(),
    shiftStartsAt: new NgcFormControl(),
    shiftEndsAt: new NgcFormControl(),
    repeatUntill: new NgcFormControl(),
    staffRole: new NgcFormArray([
      new NgcFormGroup({
        check: new NgcFormControl(),
        staff: new NgcFormControl(),
        role: new NgcFormControl(),
        roleCode: new NgcFormControl()
      })
    ]),
  })

  ngOnInit() {
  }

  changeToCode(item, index) {
    this.getLovForStaff = this.createSourceParameter(item.desc);
    this.createTeamForm.get(['staffRole', index, 'roleCode']).patchValue(item.code);
  }

  createTeam() {
    let request: any = new TeamCreation();
    request.teamName = this.createTeamForm.get('teamName').value;
    request.shiftStartsAt = this.createTeamForm.get('shiftStartsAt').value;
    request.shiftEndsAt = this.createTeamForm.get('shiftEndsAt').value;
    request.repeatUntill = this.createTeamForm.get('repeatUntill').value;
    let staffArray: any = (<NgcFormArray>this.createTeamForm.controls["staffRole"]).getRawValue();
    for (let i = 0; i < staffArray.length; i++) {
      for (let j = 0; j < staffArray.length; j++) {
        if (i != j) {
          if (staffArray[i].staff == staffArray[j].staff) {
            this.showErrorStatus("admin.duplicate.staff");
            return;
          }
        }
      }
    }
    let array = new Array();
    request.staffRole = [];
    let authorizedArray = new Array();
    staffArray.forEach(staff => {
      request.staffRole.push(staff);
    });
    this.adminService.insertTeamInformation(request).subscribe(resp => {
      this.refreshFormMessages(resp);
      if (resp.data !== null) {
        this.showSuccessStatus("admin.team.added.successfully");
      }
    })
  }

  OnClear() {
    this.createTeamForm.reset();
    this.resetFormMessages();
    let add = new Array();
    (<NgcFormArray>this.createTeamForm.controls["staffRole"]).patchValue(add);
  }

  addStaffRow() {
    const noOfRows = (<NgcFormArray>this.createTeamForm.get('staffRole')).length;
    const lastRow = noOfRows ? (<NgcFormArray>this.createTeamForm.get('staffRole')).controls[noOfRows - 1] : null;
    if (noOfRows === 0 || (lastRow.get('staff').value && lastRow.get('role').value)) {
      (<NgcFormArray>this.createTeamForm
        .get("staffRole")).addValue([
          {
            check: false,
            staff: '',
            role: '',
            roleCode: '',
            flagSaved: 'N',
            flagInsert: 'Y',
            flagUpdate: 'N',
            flagDelete: 'N'
          }
        ]);
    }
    else
      this.showInfoStatus("admin.fill.in.mandatory.details.first.then.add.row");
  }

  removeStaffRow() {
    let deleteRow: any = (<NgcFormArray>this.createTeamForm.controls["staffRole"]).getRawValue();
    let deleteArray: any = new Array();
    deleteRow.forEach(deleteRow => {
      if (deleteRow.check) {
        deleteArray.push(deleteRow)
      }
    });
    if (deleteArray.length < 1)
      this.showInfoStatus("admin.no.row.selected.select.atleast.one.row.to.remove");
    else
    (<NgcFormArray>this.createTeamForm.controls["staffRole"]).deleteValue(deleteArray);
  }

  navigateToMaintainTeam(item) {
    let request: any = new TeamCreation();
    request.shiftStartsAt = this.createTeamForm.get('shiftStartsAt').value;
    this.adminService.dataFromCreateTeam = request;
    this.navigateTo(this.router, '/admin/maintainteam', event);
  }

  public onBack(event) {
    this.navigateBack(this.createTeamForm.getRawValue());
  }

}
