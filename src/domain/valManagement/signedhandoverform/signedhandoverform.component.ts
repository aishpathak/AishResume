import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, ContentChildren, forwardRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupDirective, FormArray, FormGroup, FormControl, FormControlName, Validators } from '@angular/forms';
// Application
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, BaseResponse, NgcWindowComponent,
  NgcUtility, NgcTabsComponent, PageConfiguration, NgcReportComponent, DateTimeKey
} from 'ngc-framework';

import { Environment } from '../../../environments/environment';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ShipmentInventory, SearchInventory } from './../val.sharemodel';
import { ValSharedService } from './../val-shared.service';


@Component({
  selector: 'app-signedhandoverform',
  templateUrl: './signedhandoverform.component.html',
  styleUrls: ['./signedhandoverform.component.scss']
})
export class SignedhandoverformComponent extends NgcPage implements OnInit {
  flag: boolean;
  resp: any;
  array: any;
  reportParameters: any;

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private valsharedService: ValSharedService,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }
  private form: NgcFormGroup = new NgcFormGroup({
    carriedOnDateFrom: new NgcFormControl(NgcUtility.subtractDate(new Date(), 1, DateTimeKey.DAYS)),
    carriedOnDateTo: new NgcFormControl(new Date()),
    handoverShipment: new NgcFormArray([
      new NgcFormGroup({
        checkbox: new NgcFormControl(),
        startedAt: new NgcFormControl(),
        completedAt: new NgcFormControl(),
        handoverFromStaff: new NgcFormControl(),
        handoverToStaff: new NgcFormControl(),
        totalFoundShipment: new NgcFormControl(),
        remarks: new NgcFormControl(),

      })
    ])
  })
  clear(event) {
    this.form.reset();
    this.flag = false;

  }
  public onBack(event) {
    this.navigateBack(this.form.getRawValue());
  }
  ngOnInit() {

    super.ngOnInit();

  }
  onSearch() {
    const req: SearchInventory = new SearchInventory();
    req.carriedOnDateFrom = this.form.get('carriedOnDateFrom').value;
    req.carriedOnDateTo = this.form.get('carriedOnDateTo').value;
    this.valsharedService.handoverShipment(req).subscribe(response => {
      this.array = response;
      this.resp = this.array.data;

      if (response.messageList == null && this.resp.length > 0) {
        this.flag = true;
        this.form.get('handoverShipment').patchValue(this.resp);
      }
      else if (response.messageList == null && this.resp.length == 0) {
        this.showInfoStatus("val.noRecordFound");
        this.flag = false;
      }
      else {
        this.refreshFormMessages(response);
      }
    })

  }
  printHandoverForm() {
    this.reportParameters = new Object();
    this.reportParameters.startedAt = this.form.get('carriedOnDateFrom').value;
    this.reportParameters.startedTo = this.form.get('carriedOnDateTo').value;
    this.reportParameters.loggedInUser = this.getUserProfile().userLoginCode;
    this.reportWindow.open();
  }
}
