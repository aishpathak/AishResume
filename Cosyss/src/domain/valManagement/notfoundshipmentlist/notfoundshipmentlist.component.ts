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
  NgcUtility, NgcTabsComponent, PageConfiguration
} from 'ngc-framework';

import { Environment } from '../../../environments/environment';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ShipmentInventory, SearchInventory } from './../val.sharemodel';
import { ValSharedService } from './../val-shared.service';

@Component({
  selector: 'app-notfoundshipmentlist',
  templateUrl: './notfoundshipmentlist.component.html',
  styleUrls: ['./notfoundshipmentlist.component.scss']
})
export class NotfoundshipmentlistComponent extends NgcPage implements OnInit {
  flag: boolean = false;
  resp: any;
  requestData: any;
  private form: NgcFormGroup = new NgcFormGroup({
    addedBy: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    bagNumber: new NgcFormControl(),
    reason: new NgcFormControl(),
    checkInFromDate: new NgcFormControl(),
    checkInToDate: new NgcFormControl(),
    notFoundShipment: new NgcFormArray([
      new NgcFormGroup({
        shipmentNumber: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        uldNumber: new NgcFormControl(),
        bagNumber: new NgcFormControl(),
        checkInDate: new NgcFormControl(),
        checkInBy: new NgcFormControl(),
        addedBy: new NgcFormControl(),
        addedOn: new NgcFormControl(),
        pieces: new NgcFormControl(),
        destination: new NgcFormControl(),
        reason: new NgcFormControl(),
        check: new NgcFormControl(),
      })
    ]),
  })
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private valsharedService: ValSharedService,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.onSearch();

  }
  public onBack(event) {
    this.navigateBack(this.form.getRawValue());
  }
  onSearch() {
    let requestData = this.form.getRawValue();
    this.valsharedService.notFoundShipmnt(requestData).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data.data;
      if (data.data) {
        this.flag = true;
        let count = 1;
        this.resp.forEach(element => {
          element.serialN = count++;
        });
        this.form.get('notFoundShipment').patchValue(this.resp);

      }
      if (data.data == null) {
        this.showInfoStatus("val.noRecordFound")
      }
    })
  }
}
