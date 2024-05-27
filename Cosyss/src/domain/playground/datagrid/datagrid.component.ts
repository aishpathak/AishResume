/**
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { Component, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Application
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType, NgcDataTableComponent, PageConfiguration,
  CellsRendererStyle
} from 'ngc-framework';
import { CellsStyleClass } from '../../../shared/shared.data';

declare let $: any;

/**
 * Data Grid Page
 */
@Component({
  templateUrl: './datagrid.html'
})
@PageConfiguration({
  callNgOnInitOnClear: true,
  trackInit: true,
  autoBackNavigation: true
})
export class DataGridPage extends NgcPage {

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
    resultList: new NgcFormArray(
      [
      ]
    ),
    flightScheduleGroupList: new NgcFormArray(
      [
        new NgcFormGroup({
          flightScheduleList: new NgcFormArray(
            [
            ]
          )
        })
      ]
    )
  });

  private forwardedData: any;

  private columDefinitions: Object[] = [
    { dataField: "scInd", text: "Select", width: 100, type: "check" },
    { dataField: "awbNo", text: "AWB No.", width: 100, type: "" },
    { dataField: "awbDate", text: "AWB Date", width: 100, type: "displayDate" },
    { dataField: "dest", text: "Destination", width: 100, type: "" },
    { dataField: "pcs", text: "Pieces", width: 100, type: "" },
    { dataField: "wt", text: "Weight", width: 100, type: "" },
    { dataField: "status", text: "Status", width: 100, type: "link" }
  ];

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
    let self = this;
    //
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    this.form.patchValue(this.forwardedData);
    //
    let resultList = (<NgcFormArray>this.form.controls["resultList"]).controls;
    //
    if (resultList.length > 0) {
      if (resultList[0].enabled) {
        resultList[0].disable();
      } else {
        resultList[0].enable();
      }
    }
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
    console.log(this.form);
    console.log(this.router.url);
  }

  /**
   * On Link Click
   *
   * @param event Event
   */
  public onLinkClick(event) {
    console.log(event);
    if (event.type == "link") {
      let columnName = event.column;
      let record = event.record;
      //
      this.showInfoStatus("Clicked on AWB No. " + JSON.stringify(record));
    }
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
        awbNo: "618-12399191",
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
      awbDate: new Date(),
      dest: "HKG",
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
    for (let index: number = 0; index < 5; index++) {
      let copy = Object.assign({}, original);
      //
      copy.awbNo = ('160' + (Math.random() * 100000000000)).substr(0, 11);
      let mod: number = index % 2;
      console.log("." + mod + ".")
      if (mod === 0) {
        copy.dest = "BOM";
        copy.carr = "SQ";
      } else {
        copy.dest = "HKG";
        copy.carr = "CX";
      }
      //
      newArray.push(copy);
    }
    (<NgcFormArray>this.form.controls["resultList"]).addValue(newArray);
  }

  public onAddChildRow(event) {
    try {
      let icon: boolean = false;
      //
      (<NgcFormArray>this.form.get("resultList.0.childRecords")).addValue([{
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
      }]);
    } catch (e) { }
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
   * On Delete
   *
   * @param event Event
   */
  public onDelete(event) {
    let resultList: NgcFormArray = this.form.get("resultList") as NgcFormArray;
    // Deleted
    if (resultList && resultList.length > 0) {
      for (let index = resultList.controls.length - 1; index < resultList.controls.length; index--) {
        if (resultList.get([index, 'scInd']).value === true) {
          resultList.deleteValueAt(index);
        }
      }
    }
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
      resultList.controls.forEach((group: NgcFormGroup, index: number) => {
        if (group.get('scInd').value === true) {
          group.markAsDeleted();
        }
      });
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
   * Cells Renderer
   *
   * @param value Value
   * @param rowData Row Data
   * @param level Level
   */
  public cellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
    if (value == "SIN") {
      return `
            <div>
                <span style="color:#66CC66"> ${value} </span>
            </div>
            `;
    }
    return `
            <div>
                <span style="color:#CC6666"> ${value} </span>
                <span style="width:36px;height:36px;background-color:#FFFFCC;border: 1px solid #663366">
                    <i class="fa fa-clock-o fa-md"></i>
                </span>
            </div>
            `;
  };

  /**
   * Cells Style Renderer
   *
   * @param value Value
   * @param rowData Row Data
   * @param level Level
   */
  public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (value == "HKG") {
      cellsStyle.data = "Hello HKG!"
      cellsStyle.className = CellsStyleClass.INFO_BLUE;
    } else {
      cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
      cellsStyle.allowEdit = false;
    }
    //
    return cellsStyle;
  };

  /**
   * Cells Style Renderer
   *
   * @param value Value
   * @param rowData Row Data
   * @param level Level
   */
  public rowCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (rowData.dest == "TPE") {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
      cellsStyle.allowEdit = false;
    }
    //
    return cellsStyle;
  };

  public groupsRenderer = (text: any, group: any, expanded: any): string => {
    return `Hello World! ${group}`;
  }

  public onAdd(event) {

  }

  public onBack(event) {
    this.navigateBack(this.form.getRawValue());
  }
}
