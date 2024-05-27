import { DocumentService } from './../document/document.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Input, ViewChild, OnDestroy } from '@angular/core';
import { RestService, BaseRequest, BaseResponse } from 'ngc-framework';
import { UpdateAdminColourResultBO, AdminColourRequest, AdminColourResultBO, AdminColourResponseData } from '../document/document.sharedmodel';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcWindowComponent } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adminconsole',
  templateUrl: './adminconsole.component.html',
  styleUrls: ['./adminconsole.component.scss']
})

export class AdminconsoleComponent extends NgcPage implements OnInit, OnDestroy {

  @ViewChild('window') window: NgcWindowComponent;

  displayAddEditForm: boolean = true;
  responseArray: any[];
  resp: any;
  currentslaId: any;
  loggedInUser: any;
  previousRoute: any;
  updateAdminColor: Subscription = new Subscription();
  getAdminConsole: Subscription = new Subscription();

  private form: NgcFormGroup = new NgcFormGroup({
    slaId: new NgcFormControl(),
    slaDescription: new NgcFormControl(),
    slColourCode: new NgcFormControl(),
    SNo: new NgcFormControl(),
    updateslColourCode: new NgcFormControl(),
    resultList: new NgcFormArray([]),
  });

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private documentService: DocumentService, private router: Router) {
    super(appZone, appElement, appContainerElement);
    this.previousRoute = sessionStorage.getItem('previousRoute');
    console.log('ADMIN COSOLE : ' + this.previousRoute);
    sessionStorage.setItem('previousRoute', this.router.url);
  }

  ngOnInit() {
    super.ngOnInit();
    this.showInfoStatus('');
    let sessionDetails = JSON.parse(sessionStorage.getItem('sessionDetails'));
    if (sessionDetails == null) {
      this.router.navigate(['']);
      return;
    }
    this.loadData();
    this.loggedInUser = sessionDetails.userId;
  }

  public loadData() {
    let request: AdminColourRequest = new AdminColourRequest();
    this.getAdminConsole = this.documentService.getAdminConsole(request).subscribe(responseBean => {
      this.resp = responseBean.data;
      this.responseArray = this.resp;
      this.editFunction();
      this.form.controls["resultList"].patchValue(this.responseArray);
    },
      error => { this.showErrorStatus("export.error.fetching.master.shc.list"); }
    );
  }

  public cancelButton(event) {
    this.window.hide();
  }

  public onLinkClick(event) {
    this.currentslaId = event.record.slaId;
    this.window.open();
  }

  updateData() {
    let adminColor: UpdateAdminColourResultBO = new UpdateAdminColourResultBO();
    adminColor.slColourCode = this.form.controls.slColourCode.value;
    adminColor.slaId = this.currentslaId;
    adminColor.modifiedBy = this.loggedInUser;

    if (adminColor.slColourCode.length > 10) {
      return;
    }
    this.updateAdminColor = this.documentService.updateAdminColour(adminColor).subscribe(data => {
      this.resp = data;
      this.window.hide();
      this.loadData();
    }, error => { this.showErrorStatus("export.error.invalid.search.criteria"); }
    );
  }

  public editFunction() {
    for (let index = 0; index < this.responseArray.length; index++) {
      this.responseArray[index]['edit'] = 'EDIT';
    }
  }

  public onLinkClicks(event) {
    this.window.open();
  }

  ngOnDestroy() {
    this.updateAdminColor.unsubscribe();
    this.getAdminConsole.unsubscribe();
  }
}




