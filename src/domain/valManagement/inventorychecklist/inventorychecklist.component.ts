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
  NgcUtility, NgcTabsComponent, PageConfiguration, DateTimeKey
} from 'ngc-framework';

import { Environment } from '../../../environments/environment';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ShipmentInventory, SearchInventory } from './../val.sharemodel';
import { ValSharedService } from './../val-shared.service';

@Component({
  selector: 'app-inventorychecklist',
  templateUrl: './inventorychecklist.component.html',
  styleUrls: ['./inventorychecklist.component.scss']
})
export class InventorychecklistComponent extends NgcPage implements OnInit {
  request: any;
  flag: boolean = false;
  array: any;
  resp: any;


  private form: NgcFormGroup = new NgcFormGroup({
    carriedOnDateFrom: new NgcFormControl(NgcUtility.subtractDate(new Date(), 1, DateTimeKey.DAYS)),
    carriedOnDateTo: new NgcFormControl(new Date()),
    shipmentInventory: new NgcFormArray([
      new NgcFormGroup({
        startedAt: new NgcFormControl(''),
        completedAt: new NgcFormControl(''),
        totalShipment: new NgcFormControl(''),
        foundShipment: new NgcFormControl(''),
        discrepancy: new NgcFormControl(''),
        checkDoneBy: new NgcFormControl(''),
        handedOverTo: new NgcFormControl(''),
      })
    ])
  })
  /**
   * Initialize
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private valsharedService: ValSharedService,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }
  onSearch() {
    const req: SearchInventory = new SearchInventory();
    req.carriedOnDateFrom = this.form.get('carriedOnDateFrom').value;
    req.carriedOnDateTo = this.form.get('carriedOnDateTo').value;
    this.valsharedService.searchInventory(req).subscribe(response => {
      this.resp = response.data;

      if (this.resp) {
        this.flag = true;
        let count = 1;
        this.resp.forEach(element => {
          element.serialNo = count++;
        });
        this.form.get('shipmentInventory').patchValue(this.resp);
        this.resetFormMessages();
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
  onEdit(index) {
    this.request = this.resp[index];
    this.valsharedService.requestInventory = this.request;
    this.navigateTo(this.router, '/valmgmt/inventorycheckdetails', this.request);
  }
  clear(event) {
    this.form.reset();
    this.flag = false;

  }

  public onBack(event) {
    this.navigateBack(this.form.getRawValue());
  }
  ngOnInit() {
    super.ngOnInit();
    var fromDate = this.form.get('carriedOnDateFrom').value;
    fromDate.setHours(0);
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);
    var toDate =  this.form.get('carriedOnDateTo').value;
    toDate.setHours(23);
    toDate.setMinutes(59);
    toDate.setSeconds(59);
    this.form.get('carriedOnDateFrom').patchValue(fromDate);
    this.form.get('carriedOnDateTo').patchValue(toDate);
  }

}
