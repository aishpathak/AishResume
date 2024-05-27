import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcInputComponent, DateTimeKey,
  NgcUtility, NgcWindowComponent, NgcContainerComponent, PageConfiguration
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, AbstractControl, Validator, Validators } from '@angular/forms';
import { NgcFormControl } from 'ngc-framework/core/model/formcontrol.model';
import { StatusMessage } from 'ngc-framework';
import { SearchForRequestList, EquipmentListResult } from '../equipmentsharedmodel';
import { EquipmentService } from '../equipment.service';

@Component({
  selector: 'app-equipmentRequest',
  templateUrl: './equipmentRequest.component.html',
  styleUrls: ['./equipmentRequest.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class EquipmentRequestComponent extends NgcPage implements OnInit {
  toDate: any;
  record: any;
  resp: any;
  tasklistDetail: any;
  isTable: boolean = false;

  private equipmentTasklistform: NgcFormGroup = new NgcFormGroup({
    equipmentReqId: new NgcFormControl(),
    fromDate: new NgcFormControl(NgcUtility.getDateOnly(NgcUtility.subtractDate(new Date(), 15, DateTimeKey.DAYS))),
    toDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 4, DateTimeKey.HOURS)),
    flightDatecriteria: new NgcFormControl(false),
    collectionDatecriteria: new NgcFormControl(true),
    serviceCreationDate: new NgcFormControl(false),
    Tasklist: new NgcFormArray([])
  });

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private equipmentService: EquipmentService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /**
* On Search of Function
*
* @param event Event
*/

  private onSearch() {
    this.resetFormMessages();
    const fromDate: Date = this.equipmentTasklistform.get('fromDate').value;
    const toDate: Date = this.equipmentTasklistform.get('toDate').value;
    const timeDiffInMilli: number = NgcUtility.dateDifference(toDate, fromDate);

    if (timeDiffInMilli) {
      if ((timeDiffInMilli / 1000 / 60 / 60) < 4 && (timeDiffInMilli / 1000 / 60 / 60) > 0) {
        this.showErrorMessage('', 'equipment.date.difference');
        return;
      }
    }

    let search = new SearchForRequestList();
    search = this.equipmentTasklistform.getRawValue();

    this.equipmentService.searchrequlist(search).subscribe(data => {
      //this.refreshFormMessages(data);
      if (!this.showResponseErrorMessages(data)) {
        this.resp = data.data;
        this.tasklistDetail = this.resp;
        if (this.tasklistDetail == null || this.tasklistDetail == '') {
          this.isTable = false;
        }
        else {
          this.isTable = true;
          (<NgcFormArray>this.equipmentTasklistform.get(
            'Tasklist'
          )).patchValue(this.tasklistDetail);
        }

      }
    }, error => {
      this.showErrorMessage(error);
    });
  }

  private onCreateNewReq($event) {
    this.navigateTo(this.router, '/equipment/equipmentrequesting', {});
  }

  public onLinkClick(event) {
    if (event.type === 'link') {
      this.record = event.record;
      if (this.record.status == "PENDING") {
        this.navigateTo(this.router, '/equipment/equipmentrequesting', this.record);
      }
      else {
        this.showErrorStatus("equipment.pending.requestaction");
      }
    }
  }

  public onBack(event) {
    this.navigateBack(this.equipmentTasklistform.getRawValue());
  }

}
