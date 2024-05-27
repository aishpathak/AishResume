import { Component, OnInit, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { MastersService } from '../masters.service';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration } from 'ngc-framework';
import { MaintainMastersResponse, MaintainMastersRequest } from '../masters.sharedmodel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintainmasters',
  templateUrl: './maintainmasters.component.html',
  styleUrls: ['./maintainmasters.component.scss']
})
/**
 * MaintainmastersComponent is responsible for Masters Home Screen and it loads all the masters
.
 */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class MaintainmastersComponent extends NgcPage {
  record: any;
  currIndex: number;
  req: any;
  masterHeaders: any;
  loadNow: boolean;
  screenTitle: any;
  private masterData: NgcFormGroup = new NgcFormGroup({
    resultList: new NgcFormArray([])
  });
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private masterService: MastersService, private router: Router) {
    super(appZone, appElement, appContainerElement);
    // this.functionId = 'MAINTAIN_MASTER';
  }
  ngOnInit() {
    super.ngOnInit();
    this.loadNow = true;
    let check: number = 6;
    let subCount: number = 0;
    let masterGroupList: Array<any> = new Array<any>();
    let masterArray: Array<any> = new Array<any>();
    this.masterService.getMasterDetails(this.req).subscribe(data => {
      if (data.data != null) {
        this.masterHeaders = data.data;
        (<NgcFormArray>this.masterData.controls['resultList']).patchValue(this.masterHeaders);
        console.log(JSON.stringify(this.masterHeaders));
      }
      else {
        this.showErrorStatus(data.messageList[0].message);
      }
    })
  }

  private onLinkClick(event, group) {
    const master: MaintainMastersRequest = new MaintainMastersRequest();
    const record = (<NgcFormGroup>this.masterData.get(['resultList' , group])).getRawValue();
    master.masterName = record.tableName;
    this.router.navigate(['masters', 'masterspage', master.masterName]);
  }

  /*onSave(event) {
    const saveRequest = (<NgcFormArray>this.masterData.get(['resultList'])).getRawValue();
    this.masterService.setMasterDetails(this.req).subscribe(data => {
      if (data.data != null) {
        this.masterHeaders = data.data;
        (<NgcFormArray>this.masterData.controls['resultList']).patchValue(this.masterHeaders);
        console.log(JSON.stringify(this.masterHeaders));
      }
      else {
        this.showErrorStatus(data.messageList[0].message);
      }
    })
  }*/
}
