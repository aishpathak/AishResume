import {
  Component, OnInit, NgZone, ElementRef, ViewContainerRef, forwardRef, ComponentRef,
  ComponentFactoryResolver, ViewChild, ViewChildren, ContentChildren, QueryList, NgModule
} from '@angular/core';

import {
  NgcPage, CacheService, NgcFormGroup, NgcFormControl, NgcPopoverComponent, NgcPasswordInputComponent, SystemBroadcastEvents, NgcWindowComponent, NgcFormArray, NgcApplication, CellsRendererStyle, PageConfiguration
} from 'ngc-framework';
import { FormGroupDirective, FormArray, FormGroup, FormControl, FormControlName, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { MastersService } from '../masters.service';
import { BroadcastResponse, AuditBroadcastResponse } from '../masters.sharedmodel';
import { CellsStyleClass } from "../../../shared/shared.data";


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: false
})
export class WelcomeComponent extends NgcPage {
  awbflag: boolean;
  expandorcollapse: boolean = false;
  request: any;
  private homebroadcastForm: NgcFormGroup = new NgcFormGroup({
    notificationTitle: new NgcFormControl(),
    userGroupTo: new NgcFormControl(),
    roleCode: new NgcFormControl(),
    startDate: new NgcFormControl(),
    expiryDate: new NgcFormControl(),
    priority: new NgcFormControl(),
    message: new NgcFormControl(),
    dataArray: new NgcFormArray([])
  });
  hide: boolean = false;
  columnName: any;
  record: any;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    appComponentResolver: ComponentFactoryResolver,
    private router: Router, private activatedRouter: ActivatedRoute,
    private authService: MastersService) {
    super(appZone, appElement, appContainerElement);
  }
  ngOnInit() {
    super.ngOnInit();
    this.onsearch();
  }
  onsearch() {
    let filteredData: any;
    this.expandorcollapse = true;
    const request: BroadcastResponse = new BroadcastResponse();
    this.authService.fetchBroadCastNData(request).subscribe(data => {
      this.hide = true;
      filteredData = data.data.filter(obj => {
        if ((obj.userGroupTo.includes('Internal') || obj.userGroupTo.includes('External')) && (obj.userGroupTo.includes(obj.userType))) {
          this.hide = false;
          return obj;
        }
      })

      // filter on the bases of Acknowledge date, if message is acknowledge by User will not show it to that user
      // let filtered = filteredData.filter(obj1 => {
      //   if (obj1.eventDateTime == null || obj1.eventDateTime == "") {
      //     return obj1;
      //   }
      // });
      let i: number = 1;
      this.awbflag = true;
      filteredData.map(obj => {
        obj.sNo = i;
        i++;
      });
      this.homebroadcastForm.get("dataArray").patchValue(filteredData);
    });
  }



  public priorityCellsStyleRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (value == "HIGH") {
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (value == "MEDIUM") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
    } else {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    }
    //
    return cellsStyle;
  };
  onAcknowledge(group) {
    let filteredData1: any;
    let request: any = new AuditBroadcastResponse();
    request.eventName = "BROADCAST_NOTIFICATION";
    request.eventActor = this.getUserProfile().userLoginCode;
    request.eventAction = "INSERT";
    request.entityType = "USER";
    const record = this.homebroadcastForm.getRawValue().dataArray[group];
    request.entityValue = record.notificationTitle;
    request.eventValue1 = record.message;
    this.authService.insertAuditInfo(request).subscribe(data => {
      this.request = data.data
      if (this.request) {
        this.showSuccessStatus("g.message.acknowledged");
        this.onsearch();
        this.resetFormMessages();
      } else {
        this.refreshFormMessages(data);
      }
    });
  }
}





