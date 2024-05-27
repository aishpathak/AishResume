import { Router } from '@angular/router';
import { NgcPage, PageConfiguration, NgcFormGroup, NgcFormControl, NgcFormArray, NgcWindowComponent } from 'ngc-framework';
import { Component, OnInit, NgZone, OnDestroy, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { UserGroup, User, UserGroupRequest } from '../events.sharedmodel';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-userConfiguration',
  templateUrl: './userConfiguration.component.html',
  styleUrls: ['./userConfiguration.component.css']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true

})

export class UserConfigurationComponent extends NgcPage implements OnInit {
  private groupList = {};
  index: any;
  showTableFlag: any;
  eventGroupId: any;
  @ViewChild('addUserWindow') addUserWindow: NgcWindowComponent;


  ngOnInit() {
    this.fetchEventGroups()
  }
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router, private userService: EventsService) {
    super(appZone, appElement, appContainerElement);
    // this.functionId = "PLAYGROUND";
  }
  public userConfiguration: NgcFormGroup = new NgcFormGroup({
    name: new NgcFormControl(),
    userGroupList: new NgcFormArray([
    ])
  });
  public tempForm: NgcFormGroup = new NgcFormGroup({
    userList: new NgcFormArray([
    ])
  })

  public fetchEventGroups(): void {
    this.showTableFlag = false;
    let userGroupRequest: UserGroup = new UserGroup();
    userGroupRequest.name = this.userConfiguration.get('name').value;
    this.userService.fetchEventGroups(userGroupRequest).subscribe(resp => {
      this.refreshFormMessages(resp);
      if (resp.data !== null) {
        this.showResponseErrorMessages(resp);
        this.userConfiguration.get('userGroupList').patchValue(resp.data);
        this.showTableFlag = true;
      } else {
        this.userConfiguration.get('userGroupList').patchValue(new Array());
        this.addGroup();
      }
    }, error => {
      this.showTableFlag = true;
      this.showErrorStatus('g.unable.to.contact.server');
    });
  }
  public addRow() {
    (<NgcFormArray>this.tempForm.get("userList")).addValue([
      {
        loginCode: '',
        adminMember: false,
        email: '',
      }
    ]);

  }
  public addUsers(data, index): void {
    this.eventGroupId = data.value.eventGroupId;
    this.index = index;
    let userList = (<NgcFormArray>this.userConfiguration.get(["userGroupList", this.index]).get('userList')).getRawValue();
    if (userList.length > 0) {
      this.tempForm.get('userList').patchValue(userList);
    } else {
      let emptyList = [];
      this.tempForm.get('userList').patchValue(emptyList);
      this.addRow();
    }
    this.addUserWindow.open();
  }
  public editGroup(index): void {
    (<NgcFormArray>this.userConfiguration.get(['userGroupList', index])).get('editFlag').setValue(true);
  }
  public deleteUser(index): void {
    // if ((<NgcFormArray>this.tempForm.get("userList")).length > 1) {
    (<NgcFormArray>this.tempForm.get("userList")).markAsDeletedAt(index);
    if ((<NgcFormArray>this.tempForm.get("userList")).length === 0) {
      this.addRow();

    }
    console.log(JSON.stringify((<NgcFormArray>this.tempForm.get("userList")).getRawValue()));
    // } else {
    //   (<NgcFormArray>this.tempForm.controls["userList"]).reset();
    // }
  }
  public saveUsers() {
    let userGroupRequest: UserGroupRequest = new UserGroupRequest();
    let userGroup: UserGroup = new UserGroup();
    userGroup.eventGroupId = this.eventGroupId;
    let data: any[] = [];
    data.push(userGroup);
    userGroupRequest.userGroupList = data;
    let userList = (<NgcFormArray>this.tempForm.get("userList")).getRawValue();
    userGroupRequest.userList = userList;
    this.userService.vallidateUser(userGroupRequest).subscribe(data => {
      this.refreshFormMessages(data);
      if (!this.showResponseErrorMessages(data)) {
        (<NgcFormArray>this.userConfiguration.get(["userGroupList", this.index]).get('userList')).patchValue(userList);
        this.addUserWindow.close();
        this.eventGroupId = null;
      } else { this.showResponseErrorMessages(data); }
    }, error => {
      this.showErrorStatus('g.unable.to.contact.server');
    });

  }

  public addGroup() {
    const c = new UserGroup();
    c.eventTypesId = this.userConfiguration.get('name').value;
    c.editFlag = true;
    c.description = '';
    c.name = '';
    c.active = null;
    (<NgcFormArray>this.userConfiguration.get('userGroupList')).addValue([c
    ]);
    this.showTableFlag = true;
  }

  public save() {
    let userGroupRequestList: Array<UserGroup> = new Array<UserGroup>();
    let userGroupRequest: UserGroupRequest = new UserGroupRequest();
    userGroupRequest.userGroupList = (<NgcFormArray>this.userConfiguration
      .controls["userGroupList"]).getRawValue();
    this.userService.saveUserGroupInfo(userGroupRequest).subscribe(data => {
      this.refreshFormMessages(data);
      if (!this.showResponseErrorMessages(data)) {
        this.groupList = this.createSourceParameter(null);
        this.showSuccessStatus('g.completed.successfully');
        this.fetchEventGroups();
      } else {
        this.showResponseErrorMessages(data);
      }
    }, error => {
      this.showErrorStatus('g.unable.to.contact.server');
    })

  }

  public deleteGroups(index): void {
    (<NgcFormArray>this.userConfiguration.get("userGroupList")).markAsDeletedAt(index);
    if ((<NgcFormArray>this.userConfiguration.get("userGroupList")).length === 0) {
      this.addGroup();

    }
  }

  private showAfterDeltion(result) {
    this.userConfiguration.get('name').setValue('');
    if (result.userGroupList.length > 0) {
      this.userConfiguration.get('userGroupList').patchValue(result.userGroupList);
    } else {
      (<NgcFormArray>this.userConfiguration.controls["userGroupList"]).reset();
      this.showTableFlag = true;
      this.addGroup();
    }
  }
}
