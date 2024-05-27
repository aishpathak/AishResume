/**
 * @copyright SATS Singapore 2017-18
 */
// Angular
import {
  Component, NgZone, ElementRef, ViewContainerRef, ViewChild,
  Renderer2, ContentChild, PipeTransform, Pipe, ViewChildren, QueryList
} from '@angular/core';
import { FormArrayName, FormGroup, AbstractControl, FormGroupDirective, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
// Application
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage,
  MessageType, NgcDataTableComponent, PageConfiguration,
  NgcControl, NgcUtility
} from 'ngc-framework';

declare let $: any;

/**
 * Table Next Page
 */
@Component({
  templateUrl: './table.html',
})
@PageConfiguration({
  trackInit: true
})
export class TablePage extends NgcPage {
  currentPage: number = 2;
  noOfRecordsPerPage: number = 5;
  //
  public form: NgcFormGroup = new NgcFormGroup({
    flightNo: new NgcFormControl(),
    carrier: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    serviceNo: new NgcFormControl(),
    serviceCategory: new NgcFormControl(),
    serviceType: new NgcFormControl(),
    terminal: new NgcFormControl(),
    warehouseLocation: new NgcFormControl(),
    warehouseZone: new NgcFormControl(),
    awbNo: new NgcFormControl(),
    awbDate: new NgcFormControl(),
    agentCode: new NgcFormControl(),
    agentName: new NgcFormControl(),
    agentPassword: new NgcFormControl(),
    agentZip: new NgcFormControl(),
    agentPhone: new NgcFormControl(),
    serviceCreateDate: new NgcFormControl(),
    serviceCreateTime: new NgcFormControl(),
    contractorIC: new NgcFormControl(),
    contractorName: new NgcFormControl(),
    selectAll: new NgcFormControl(1),
    resultList: new NgcFormArray(
      [
      ]
    )
  });

  /**
   * Initialize
   *
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router) {
    //
    super(appZone, appElement, appContainerElement);
  }

  /**
   * On Initialization
   */
  public ngOnInit(): void {
    super.ngOnInit();
    //
    let navigateData = this.getNavigateData(this.activatedRoute);
    //
    if (navigateData) {
      this.form.patchValue(navigateData);
    }
  }

  public ngAfterViewInit() {
    super.ngAfterViewInit();
    NgcUtility.trackCheckUnCheckAll(this.form.get('selectAll') as NgcFormControl, this.form.get('resultList') as NgcFormArray, "scInd");
  }

  /**
   * On Cancel
   *
   * @param event Event
   */
  public onCancel(event) {
    this.navigateTo(this.router, "/playground", this.form.getRawValue());
  }

  /**
   * On Save
   *
   * @param event Event
   */
  public onSave(event) {
    const length: number = (this.form.get(['resultList']) as NgcFormArray).length;
    this.showFormControlErrorMessage(this.form.get(['resultList', length - 1, 'wt']) as NgcFormControl, "error occured please correct the problem. this is a long message for testing");
    console.log(`num = ${Number("")}`);
    console.log(`num = ${Number("0.0")}`);
    console.log(`num = ${Number("0")}`);
    console.log(this.form);
    let data = this.form.getRawValue();
    console.log(data);
    console.log(this.router.url);
  }

  /**
   * On Link Click
   *
   * @param event Event
   */
  public onLinkClick(event) {
    if (event.type == "link") {
      let columnName = event.column;
      let record = event.record;
      //
      this.showInfoStatus("Clicked on AWB No. " + JSON.stringify(record));
    }
  }

  public onClick(event) {
    console.log(event)
    let columnName = event.column;
    let record = event.record;
    //
    this.showInfoStatus(JSON.stringify(record));
  }

  /**
   * On Add Row
   *
   * @param event Event
   */
  public onAddRow(event) {
    let icon: boolean = true;
    (<NgcFormArray>this.form.controls["resultList"]).addValue([
      {
        awbNo: ('' + (Math.random() * 10000000000)).substr(0, 11),
        awbDate: new Date(),
        dest: "TPE",
        carr: "SQ",
        firstOffPt: "MAC",
        secondOffPt: "TPE",
        pcs: 111,
        wt: 3333,
        nog: "",
        rcar: "",
        awbChargeCode: "",
        fwb: true,
        eawb: false,
        rcarKcToTarget: false,
        awbReceived: undefined,
        pouch: null,
        scInd: true,
        status: "PREPARING",
        childRecords: [{
          fwb: icon,
          eawb: icon,
          rcarKcToTarget: icon,
          awbReceived: icon,
          pouch: icon
        }, {
          fwb: icon,
          eawb: icon,
          rcarKcToTarget: icon,
          awbReceived: icon,
          pouch: icon
        }, {
          fwb: icon,
          eawb: icon,
          rcarKcToTarget: icon,
          awbReceived: icon,
          pouch: icon
        }]
      }
    ]);
  }

  /**
   * On Add Multi Row
   *
   * @param event Event
   */
  public onAddMultiRows(event) {
    let icon: boolean = false;
    let original = {
      awbNo: "61876127777",
      awbDate: '2018-04-24 14:18:33.000',
      dest: "TPE",
      carr: "SQ",
      firstOffPt: "SIN",
      secondOffPt: "TPE",
      pcs: 78,
      wt: 819,
      nog: "",
      rcar: "",
      awbChargeCode: "",
      fwb: true,
      eawb: false,
      rcarKcToTarget: false,
      awbReceived: true,
      pouch: true,
      scInd: true,
      status: "PREPARING",
      childRecords: [{
        fwb: icon,
        eawb: icon,
        rcarKcToTarget: icon,
        awbReceived: icon,
        pouch: icon,
        childRecords: [{
          fwb: icon,
          eawb: icon,
          rcarKcToTarget: icon,
          awbReceived: icon,
          pouch: icon
        }, {
          fwb: icon,
          eawb: icon,
          rcarKcToTarget: icon,
          awbReceived: icon,
          pouch: icon
        }]
      }, {
        fwb: icon,
        eawb: icon,
        rcarKcToTarget: icon,
        awbReceived: icon,
        pouch: icon
      }]
    };
    let newArray: Array<any> = new Array<any>();
    //
    for (let index = 0; index < 10; index++) {
      console.log(index);
      let copy = Object.assign({}, original);
      //
      copy.awbNo = ('160' + (Math.random() * 10000000000)).substr(0, 11);
      //
      newArray.push(copy);
    }
    (<NgcFormArray>this.form.controls["resultList"]).addValue(newArray);
  }

  /**
   * On Reset
   *
   * @param event Event
   */
  public onRemoveAll(event) {
    (<NgcFormArray>this.form.controls["resultList"]).resetValue([]);
  }

  /**
   * On Disable/Enable
   */
  public onDisableEnable(event) {
    let resultList: NgcFormArray = this.form.get("resultList") as NgcFormArray;
    // Mark as Deleted
    if (resultList && resultList.length > 0) {
      resultList.controls.forEach((group: NgcFormGroup, index: number) => {
        if (group.get('scInd').value === true) {
          group.disable();
        }
      });
    }
  }

  /**
   * On AWB Click
   *
   * @param value Value
   */
  public onAWBClick(value) {
    this.sendNotificationMessage(new NotificationMessage(MessageType.WARNING, value
      + ". Please collect the cargo ASAP.", new Date()));
    this.showWarningStatus(`Please collect the cargo ${value} ASAP. Otherwise, somebody will take it to home.`);
  }

  /**
   * Delete
   *
   * @param index Index
   */
  public onDelete(index) {
    (this.form.get(["resultList", 0]) as NgcFormGroup).markAsDeleted();
  }

  /**
   * On Soft Delete
   *
   * @param event Event
   */
  public onSoftDelete(event) {
    let resultList: NgcFormArray = this.form.get("resultList") as NgcFormArray;
    // Mark as Deleted
    if (resultList && resultList.length > 0) {
      for (let index: number = resultList.length - 1; index < resultList.length; index--) {
        const group: NgcFormGroup = resultList.get([index]) as NgcFormGroup;
        if (group.get('scInd').value === true) {
          group.markAsDeleted();
        }
      }
    }
  }

  public onShuffle(event) {
    let resultList: NgcFormArray = this.form.get("resultList") as NgcFormArray;
    let resultListData: any[] = resultList.getRawValue();
    //
    resultListData.sort((a, b) => {
      return a.awbNo.localeCompare(b.awbNo);
    });
    //
    resultList.patchValue(resultListData);
  }

  /**
   * On Change Value
   *
   * @param event Event
   */
  public onChangeValue(event) {
    this.form.get(["resultList", 0, "awbNo"]).setValue('17829387991');
  }

  public onSelection(event) {
    console.log(event);
  }

  public onReset(event) {
  }

  public onNavigate(routerNo) {
    // this.router.navigate(['playground', { outlets: { secondary: ['secondary'] } }]);
    this.router.navigateByUrl('common/(//2:capturephoto/2)');
  }

  public onDisableButton(groupIndex: number) {
    this.form.get(['resultList', groupIndex, 'status']).disable();
  }
}
