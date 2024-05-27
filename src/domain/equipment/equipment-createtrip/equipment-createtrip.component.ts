import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, ContentChildren, forwardRef, ViewChild, OnInit
} from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, BaseResponse, NgcWindowComponent,
  NgcUtility, NgcTabsComponent, PageConfiguration
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchEquipment, ListOfEquipment, CreateTrip } from './../equipmentsharedmodel';
import { EquipmentService } from './../equipment.service';

@Component({
  selector: 'app-equipment-createtrip',
  templateUrl: './equipment-createtrip.component.html',
  styleUrls: ['./equipment-createtrip.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class EquipmentCreatetripComponent extends NgcPage implements OnInit {
  request: any;
  request1: any;
  displaydata: boolean = false;
  terminalArrayData: any;
  terminalArray: any[];
  req: any[];
  arr: any;
  resp: any;
  arrayUser: any;
  isTableFlg: boolean = true
  private form: NgcFormGroup = new NgcFormGroup({
    terminalPoint: new NgcFormControl(),
    agent: new NgcFormControl(),
    block: new NgcFormControl(),
    blockFrom: new NgcFormControl(),
    blockTime: new NgcFormControl(),
    blockTo: new NgcFormControl(),
    collectionType: new NgcFormControl(),
    pDNumber: new NgcFormControl(),
    ListOfEquiment: new NgcFormArray([
      new NgcFormGroup({
        paymentStatus: new NgcFormControl(),
        agent: new NgcFormControl(),
        blockTime: new NgcFormControl(),
        collectionType: new NgcFormControl(),
        customerType: new NgcFormControl(),
        pDNumber: new NgcFormControl(),
        remarks: new NgcFormControl(),
        select: new NgcFormControl(),
        terminalPoint: new NgcFormControl(),
        uld: new NgcFormArray([]),
      })

    ])

  })
  /**
* Initialize
* @param appZone Ng Zone
* @param appElement Element Ref
* @param appContainerElement View Container Ref
*/
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private equipmentService: EquipmentService,
    private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  createTrip(event) {
    if (this.form.valid) {
      const equipment: number = (<NgcFormArray>this.form.get('ListOfEquiment')).length;
      const terminalValue: any = this.form.get('terminalPoint').value;
      this.terminalArrayData = <NgcFormArray>this.form.get(['ListOfEquiment']);
      for (const eachRow of this.terminalArrayData.controls) {
        eachRow.controls.terminalPoint
          .value = terminalValue;
      }

      this.arr = this.terminalArrayData.getRawValue().filter(temp => temp.select);

      if (this.arr.length == 0) {
        this.showErrorMessage('equipment.select.record.createtrip');
      }
      else {
        const trip: CreateTrip = new CreateTrip();
        trip.list = this.arr
        this.equipmentService.createTrip(trip).subscribe(data => {
          this.refreshFormMessages(data);
          this.resp = data;
          console.log(this.resp);
          this.arrayUser = this.resp.data;

          if (this.arrayUser) {
            this.showSuccessStatus('equipment.createtrip');
            this.searchEquipment();
          }
        })
      }
    }

  }




  onSearch(event) {

    this.request1 = (<NgcFormGroup>this.form).getRawValue();
    this.searchEquipment();

  }

  searchEquipment() {
    this.equipmentService.searchResult(this.request1).subscribe(data => {
      this.showResponseErrorMessages(data)
      this.resp = data;
      this.arrayUser = this.resp.data;
      if (this.arrayUser) {
        this.displaydata = true;
        this.arrayUser.list.map(element => {
          element.dataUld = element.uldList.join(' , ');
        });
        this.arrayUser.list.forEach(element => {
          if (element.paymentStatus == "ChargeNotCreated") {
            element.paymentStatus = '';
          }
        });

        this.form.get(['ListOfEquiment']).patchValue(this.arrayUser.list);
        let index = 0;
        this.arrayUser.list.forEach(element => {

          if (element.rlsStatus == "RELEASED") {
            this.form.get(['ListOfEquiment', index, 'select']).disable();

          }
          index++;
        });

      } else {
        this.displaydata = false;
        this.showInfoStatus("equipment.no.recordfound");
      }
    });
  }
  collectPayment() {
    this.terminalArrayData = <NgcFormArray>this.form.get(['ListOfEquiment']);
    this.arr = this.terminalArrayData.getRawValue().filter(temp => temp.select);
    if (this.arr.length > 1) {
      this.showErrorMessage('equipment.select.onerecord');
    }
    else if (this.arr.length == 0) {
      this.showErrorMessage('equipment.selectrecord.makepayment');
    }
    else {
      var object = {
        customerId: this.arr[0].agentID
      }
      this.navigateTo(this.router, '/billing/collectPayment/enquireCharges', object);
    }

  }

  ngOnInit() {
  }

}
