import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcContainerComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { AcceptanceService } from './../acceptance.service';
import { SearchEmbargoMail } from './../../export.sharedmodel';

@Component({
  selector: 'app-embargoMail',
  templateUrl: './embargoMail.component.html',
  styleUrls: ['./embargoMail.component.css']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class EmbargoMailComponent extends NgcPage implements OnInit {

  //@ViewChild("updateReasonforUpliftWindow") updateReasonforUpliftWindow: NgcWindowComponent;

  resp: any;
  select: boolean = false;
  isTable: boolean = false;

  private embargoMailForm: NgcFormGroup = new NgcFormGroup({
    carriercode: new NgcFormControl(),
    dnNumber: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    byPass: new NgcFormControl(),
    bypassAll: new NgcFormControl(),
    reasonForAll: new NgcFormControl(),
    remarksForAll: new NgcFormControl(),
    embargoMailFormArray: new NgcFormArray([
      new NgcFormGroup({
        responseEmabargoMailDetail: new NgcFormArray([])
      })
    ])
  });

  // public updateReasonWindowForm: NgcFormGroup = new NgcFormGroup({
  //   mailBagNumber: new NgcFormControl(),
  //   reasonForUplift: new NgcFormControl()
  // })

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private acceptanceService: AcceptanceService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }

  public onSearch() {
    this.resetFormMessages();
    let search: SearchEmbargoMail = new SearchEmbargoMail();
    search = this.embargoMailForm.getRawValue();
    this.acceptanceService.searchForEmbargoMail(search).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.isTable = true;
        this.resp = data.data;
        this.resp.forEach(element => {
          element.checkAll = false;
          element.responseEmabargoMailDetail.forEach(element1 => {
            element1.checkIndivisual = false;
          })
        });
        this.embargoMailForm.get('reasonForAll').disable();
        this.embargoMailForm.get('remarksForAll').disable();
        this.embargoMailForm.get('bypassAll').patchValue(false);
        this.embargoMailForm.get('reasonForAll').reset();
        this.embargoMailForm.get('remarksForAll').reset();
        this.embargoMailForm.get('embargoMailFormArray').patchValue(this.resp);
      } else {
        this.isTable = false;
      }
    },
      error => {
        this.showErrorStatus(error);
      });
  }

  public onSave(event) {
    let dataToupdate = this.embargoMailForm.get('embargoMailFormArray').value;
    let bypassAll: boolean = this.embargoMailForm.get('bypassAll').value;
    if (bypassAll) {
      let reasonForAll: string = this.embargoMailForm.get('reasonForAll').value;
      if (!reasonForAll) {
        this.showErrorStatus("expaccpt.mailbag.fill.reason.bypass.mailbags");
        return;
      }
      else{
        this.refreshFormMessages(reasonForAll);
      }
      let i = 0;
      //let allDataToSave = this.embargoMailForm.getRawValue().embargoMailFormArray;
      let remarksForAll = this.embargoMailForm.get('remarksForAll').value;
      dataToupdate.forEach(element => {
        if (element.flagCRUD === 'U') {
          i = 1;
          element.responseEmabargoMailDetail.forEach(element1 => {
            element1.flagCRUD = 'U';
            element1.bypass = true;
            element1.reasonForUplift = reasonForAll;
            element1.remarks = remarksForAll;
          })
        }
      });
      if (i == 0) {
        this.showErrorStatus("expaccpt.mailbag.select.one.dispatch.series");
        return;
      } else{
        this.refreshFormMessages(dataToupdate);
      }
    }

    this.acceptanceService.updateEmbargo(dataToupdate).subscribe(data => {
      data.data = { 'embargoMailFormArray': data.data };
      if (!this.showResponseErrorMessages(data)) {
        this.onSearch();
        this.showSuccessStatus("g.completed.successfully");
      }
    }, error => {
      this.showErrorStatus(error);
    });

  }

  public onEmbargoSetup() {
    this.navigate("/masters/masterspage/Airmail_EmbargoSetup", null);
  }

  public onBack(event) {
    this.navigateBack(this.embargoMailForm.getRawValue)
  }

  checkUncheckAllBox(item, index) {
    let data: any = item.value;
    let innerArray = new Array();
    if (data.checkAll) {
      data.responseEmabargoMailDetail.forEach(element => {
        element.checkIndivisual = true;
        innerArray.push(element);
      });
    } else {
      data.responseEmabargoMailDetail.forEach(element => {
        element.checkIndivisual = false;
        innerArray.push(element);
      });
    }
    this.embargoMailForm.get(['embargoMailFormArray', index, 'checkAll']).patchValue(data.checkAll);
    //this.embargoMailForm.get(['embargoMailFormArray',index]).patchValue(data);
    this.embargoMailForm.get(['embargoMailFormArray', index, 'responseEmabargoMailDetail']).patchValue(innerArray);

  }

  byPassAllSelectedBags() {
    let item = this.embargoMailForm.get('bypassAll').value;
    if (item) {
      this.embargoMailForm.get('reasonForAll').enable();
      this.embargoMailForm.get('remarksForAll').enable();
    } else {
      this.embargoMailForm.get('reasonForAll').disable();
      this.embargoMailForm.get('remarksForAll').disable();
      this.embargoMailForm.get('reasonForAll').reset();
      this.embargoMailForm.get('remarksForAll').reset();
    }
  }



}
