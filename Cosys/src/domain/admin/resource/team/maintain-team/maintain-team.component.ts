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
  PageConfiguration,
  CellsRendererStyle
} from "ngc-framework";
import { ActivatedRoute, Router } from '@angular/router';
import { NgcFormControl, } from "ngc-framework";
import { AdminService } from "../../../admin.service";
import { TeamCreation } from "./../../../admin.sharedmodel";
import { element } from 'protractor';
import { CellsStyleClass } from '../../../../../shared/shared.data';

@Component({
  selector: 'app-maintain-team',
  templateUrl: './maintain-team.component.html',
  styleUrls: ['./maintain-team.component.scss'],
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

export class MaintainTeamComponent extends NgcPage implements OnInit {
  teamNameData: string;
  response: any;
  hideButton: boolean = false;
  showTable: boolean = false;
  repeatUntilColumn: boolean = false;
  createTeamTable: boolean = false;
  staffData: any;
  roleDataArray: any;
  teamId: any;
  showRoleCode: boolean = false;
  teamArray: any = new Array();
  workingShiftTime: any;
  getLovForStaff: any;

  @ViewChild('showPopUpWindow') showPopUpWindow: NgcWindowComponent;
  constructor(private adminService: AdminService,
    appZone: NgZone,
    appElement: ElementRef,
    private router: Router,
    appContainerElement: ViewContainerRef) {
    super(appZone, appElement, appContainerElement);
  }
  private maintainTeamForm: NgcFormGroup = new NgcFormGroup({
    shiftStartsAt: new NgcFormControl(),
    shiftEndsAt: new NgcFormControl(),
    repeatUntils: new NgcFormControl(),
    teamName: new NgcFormControl(),
    teamName1: new NgcFormControl(),
    startendtime: new NgcFormControl(),
    roleData: new NgcFormControl(),
    teamInformation: new NgcFormArray([]),
    shiftStartsAt1: new NgcFormControl(),
    shiftEndsAt1: new NgcFormControl(),
    repeatUntill: new NgcFormControl(),
    repeatUntill1: new NgcFormControl(),
    staffRole: new NgcFormArray([
      new NgcFormGroup({
        check: new NgcFormControl(),
        staff: new NgcFormControl(),
        role: new NgcFormControl(),
        roleCode: new NgcFormControl()
      })
    ]),
    staffRoleForCreateTeam: new NgcFormArray([]),
    authorizeToChangeName: new NgcFormArray([])
  })


  ngOnInit() {
  }

  onSearch() {
    this.maintainTeamForm.get(['staffRole']).reset();
    this.maintainTeamForm.get(['teamInformation']).reset();
    const request = this.maintainTeamForm.getRawValue();
    this.adminService.fetchTeamInformation(request).subscribe(data => {
      this.refreshFormMessages(data);
      this.response = data.data;
      if (!this.response) {
        this.showTable = false;
        this.hideButton = false;
        this.repeatUntilColumn = true;
        this.createTeamTable = true;
      }
      else {
        this.repeatUntilColumn = false;
        this.createTeamTable = false;
        this.hideButton = true;
        this.showTable = true;
        this.response = this.response.map(obj => {
          obj.shiftStartsAt = obj.shiftStartsAt.map(element => { element = ('00' + element).slice(-2); return element });
          obj.shiftEndsAt = obj.shiftEndsAt.map(element => { element = ('00' + element).slice(-2); return element });
          obj.stratEndDispStr = obj.shiftStartsAt.join(":") + " - " + obj.shiftEndsAt.join(":");
          return obj;
        });
        this.response.forEach(ele => {
          ele["check"] = false;
          ele["repeatUntill"] = NgcUtility.toDateFromLocalDate(ele["repeatUntill"]);
          ele["createdOn"] = NgcUtility.toDateFromLocalDate(ele["createdOn"]);
          ele.staffRole.forEach(ele2 => {
            ele2['check'] = false;
            ele2['comTeamId'] = ele.comTeamId;
            ele2['flagCRUD'] = 'R';
          });
          ele.authorizeToChangeName.forEach(ele3 => {
            ele3['checkBox'] = false;
          })
        })
        this.maintainTeamForm.get(["teamInformation"]).patchValue(this.response);
      }

    }, error => {
      this.showErrorStatus("g.serverdown");
    })
  }

  changeToCode(item, index) {
    this.getLovForStaff = this.createSourceParameter(item.desc);
    this.maintainTeamForm.get(['staffRole', index, 'roleCode']).patchValue(item.code);
    this.maintainTeamForm.get(['staffRoleForCreateTeam', index, 'roleCode']).patchValue(item.code);
  }

  onUpdate() {
    let addRequestStaffRole: any = (<NgcFormArray>this.maintainTeamForm.get("staffRoleForCreateTeam")).getRawValue();
    for (let i = 0; i < addRequestStaffRole.length; i++) {
      for (let j = 0; j < addRequestStaffRole.length; j++) {
        if (i != j) {
          if (addRequestStaffRole[i].staff == addRequestStaffRole[j].staff) {
            this.showErrorStatus("admin.staff.assigned.team");
            return;
          }
        }
      }
    }
    let request: any = new TeamCreation();
    request.staffRole = [];
    request.authorizeToChangeName = [];
    addRequestStaffRole.forEach(element => {
      element.role = element.roleCode;
      request.staffRole.push(element);
    })

    request.shiftStartsAt = this.maintainTeamForm.get('shiftStartsAt1').value;
    request.shiftEndsAt = this.maintainTeamForm.get('shiftEndsAt1').value;
    request.repeatUntill = this.maintainTeamForm.get('repeatUntill1').value;
    request.teamName = this.maintainTeamForm.get('teamName1').value;
    request.comTeamId = this.teamId;
    this.adminService.updateTeamInformation(request).subscribe(data => {
      if (!data.data)
        this.refreshFormMessages(data);
      else {
        this.showPopUpWindow.hide();
        this.onSearch();
        this.showSuccessStatus("g.operation.successful");
      }
    });
  }

  onDeleteTeam(deleteArray) {
    this.teamArray = new Array();
    let deleteIndex = 0;
    deleteArray.forEach(value => {
      if (value.check) {
        (this.maintainTeamForm.get(["teamInformation"]) as NgcFormArray).markAsDeletedAt(deleteIndex);
        this.teamArray.push(value);
      }
      deleteIndex++;
    });
    //(<NgcFormArray>this.maintainTeamForm.controls["teamInformation"]).deleteValue(deleteArray);
  }

  OnSave() {
    if (this.createTeamTable) {
      this.createTeam();
      return;
    }
    let arrayshifts: any = [];
    if (this.teamArray.length) {
      this.teamArray.forEach(value => {
        value.shiftStartsAt = value.shiftStartsAt.join(":")
        value.shiftEndsAt =  value.shiftEndsAt.join(":")
        arrayshifts.push(value);

      })
      this.adminService.deleteWholeTeamInformation(arrayshifts).subscribe(data => {
        if (data.data) {
          this.onSearch();
          this.showSuccessStatus("g.operation.successful");
          this.maintainTeamForm.get(['teamInformation']).reset();
        } else {
          this.showInfoStatus("g.try.again");
          this.onSearch();
          this.maintainTeamForm.get(['teamInformation']).reset();
        }
      })
    } else
      this.showErrorMessage("admin.delete.record")
  }

  onDeleteStaffRole() {
    let deleteRequest: any = (<NgcFormArray>this.maintainTeamForm.get("staffRoleForCreateTeam")).getRawValue();
    let sampleArray: any = new Array();
    let deleteArray: any = new Array();
    let deleteArrayCheck: any = deleteRequest.filter(element => { return (element.flagCRUD == "U" || element.flagCRUD == "R") });
    let deleteArrayCheck2: any = deleteRequest.filter(element => { return (element.flagCRUD == "U" && element.check) });
    deleteRequest.forEach(deleteValue => {
      if (deleteValue.check) {
        if (deleteValue.flagCRUD == "U") {
          deleteArray.push(deleteValue)
        }
        else
          sampleArray.push(deleteValue);
      }
    })
    if (sampleArray.length > 0) {
      (<NgcFormArray>this.maintainTeamForm.controls["staffRoleForCreateTeam"]).deleteValue(sampleArray);
    }

    if (deleteArray.length > 0) {
      if (deleteArrayCheck.length == 1) {
        this.showErrorMessage('admin.staff.add.delete.validation');
        return;
      }
      else if (deleteRequest.length === deleteArrayCheck2.length) {
        this.showErrorMessage('admin.staff.add.delete.validation');
        return;
      }
      this.adminService.deleteTeamInformation(deleteArray).subscribe(data => {
        this.showPopUpWindow.hide();
        this.onSearch();
        this.showSuccessStatus("g.operation.successful");
      });
    }
    if (sampleArray.length < 1 && deleteArray.length < 1)
      this.showInfoStatus("admin.select.atleast.one.row.to.delete");
  }

  addStaffRow() {
    const noOfRows = (<NgcFormArray>this.maintainTeamForm.get('staffRoleForCreateTeam')).length;
    const lastRow = noOfRows ? (<NgcFormArray>this.maintainTeamForm.get('staffRoleForCreateTeam')).controls[noOfRows - 1] : null;
    if (noOfRows === 0 || (lastRow.get('staff').value && lastRow.get('roleCode').value)) {
      (<NgcFormArray>this.maintainTeamForm
        .get("staffRoleForCreateTeam")).addValue([
          {
            check: false,
            staff: '',
            role: '',
            roleCode: '',
            comTeamId: this.teamId,
          }
        ]);
    } else {
      this.showInfoStatus("admin.fill.in.mandatory.details.first.then.add.row");
    }
  }


  openWindow(event) {
    this.showPopUpWindow.open();
    let add = new Array();
    (<NgcFormArray>this.maintainTeamForm.controls["staffRole"]).patchValue(add);
    this.maintainTeamForm.controls['teamName1'].patchValue(event.record.teamName);
    let regex = new RegExp(',', 'g');
    let str = event.record.shiftStartsAt.replace(regex, ':');
    let str1 = event.record.shiftEndsAt.replace(regex, ':');
    this.maintainTeamForm.controls['startendtime'].patchValue(str + " - " + str1);
    this.maintainTeamForm.controls['repeatUntill1'].patchValue(event.record.repeatUntill);
    (<NgcFormArray>this.maintainTeamForm.controls["staffRoleForCreateTeam"]).patchValue(this.response[event.record.uid].staffRole);
    this.teamId = event.record.comTeamId;
  }


  OnClear() {
    this.maintainTeamForm.reset();
    this.resetFormMessages();
    this.showTable = false;
  }

  navigateToCreateTeam(item) {
    this.navigateTo(this.router, '/admin/createteam', event);
  }

  public onBack(event) {
    this.navigateBack(this.maintainTeamForm.getRawValue());
  }

  onConfirm() {
    let teamArray1 = new Array();
    let team: any = (<NgcFormArray>this.maintainTeamForm.get("teamInformation")).getRawValue();
    team.forEach(value => {
      //if (value.check) {
      teamArray1.push(value);
      // }
    })
    let flag: Boolean
    if (teamArray1.length) {
      flag = true;
    }
    if (flag) {
      this.showConfirmMessage('admin.delete.the.selected.records.confirmation').then(fulfilled => {
        this.onDeleteTeam(teamArray1);
      });
    } else {
      this.showInfoStatus("admin.select.atleast.one.row.to.delete")
    }
  }

  addStaffRowForCreateTeam() {
    const noOfRows = (<NgcFormArray>this.maintainTeamForm.get('staffRole')).length;
    const lastRow = noOfRows ? (<NgcFormArray>this.maintainTeamForm.get('staffRole')).controls[noOfRows - 1] : null;
    if (noOfRows === 0 || (lastRow.get('staff').value && lastRow.get('role').value)) {
      (<NgcFormArray>this.maintainTeamForm
        .get("staffRole")).addValue([
          {
            check: false,
            staff: '',
            role: '',
            roleCode: '',
            comTeamId: this.teamId,
          }
        ]);
    } else {
      this.showInfoStatus("admin.fill.in.mandatory.details.first.then.add.row");
    }
  }

  removeStaffRowForCreateTeam() {
    let deleteRow: any = (<NgcFormArray>this.maintainTeamForm.controls["staffRole"]).getRawValue();
    let deleteArray: any = new Array();
    deleteRow.forEach(deleteRow => {
      if (deleteRow.check) {
        deleteArray.push(deleteRow)
      }
    });
    if (deleteArray.length < 1)
      this.showInfoStatus("admin.no.row.selected.select.atleast.one.row.to.remove");
    else
      (<NgcFormArray>this.maintainTeamForm.controls["staffRole"]).deleteValue(deleteArray);
  }

  createTeam() {
    let request: any = new TeamCreation();
    request.teamName = this.maintainTeamForm.get('teamName').value;
    request.shiftStartsAt = this.maintainTeamForm.get('shiftStartsAt').value;
    request.shiftEndsAt = this.maintainTeamForm.get('shiftEndsAt').value;
    request.repeatUntill = this.maintainTeamForm.get('repeatUntils').value;
    let staffArray: any = (<NgcFormArray>this.maintainTeamForm.controls["staffRole"]).getRawValue();
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
    staffArray.forEach(staff => {
      staff.roleCode = staff.role;
      request.staffRole.push(staff);
    });
    this.adminService.insertTeamInformation(request).subscribe(resp => {
      this.refreshFormMessages(resp);
      if (resp.data !== null) {
        this.onSearch();
        this.showSuccessStatus("admin.team.added.successfully");
      }
    })
  }


}
