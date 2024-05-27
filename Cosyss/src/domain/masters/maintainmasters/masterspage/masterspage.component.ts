
import { Validators } from '@angular/forms';
import { MastersService } from '../../masters.service';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Pipe, PipeTransform } from '@angular/core';
import {
  MaintainMastersResponse, MaintainMastersRequest, MaintainMastersSearchData, MaintainMastersSearchRequest
} from '../../masters.sharedmodel';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, PageConfiguration, BaseResponse,
  CellsRendererStyle, NgcReportComponent
} from 'ngc-framework';

@Pipe({ name: 'masterpipe', pure: false })
export class MasterPipe implements PipeTransform {

  transform(records: any[], discardProperty: string) {
    let newRecords = new Array<any>();
    //
    if (records) {
      records.forEach((record: any, index: number) => {
        if (record[discardProperty]) {
          newRecords.push(record);
        }
      });
    }
    return newRecords;
  }
}

@Component({
  selector: 'app-masterspage',
  templateUrl: './masterspage.component.html',
  styleUrls: ['./masterspage.component.scss']
})
/**
 * MasterspageComponent is responsible for dynamic Sub Masters
 * Page Load based upon the Masters Selected in the Masters Home Screen
 */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class MasterspageComponent extends NgcPage {
  cityByCountry: any;
  subPopupWidth: number;
  popupWidth: number;
  referenceData: any;
  showHideAdd = true;
  reportParameters: any;
  showPrintButton = true;
  autoFlightFilter = true;
  dataForAutoFlightKey: any;
  reportParameterForAces = false;
  popupShowFlag: boolean = false;
  popupAddShowFlag: boolean = false;
  // dynObj: any;
  // dataAdapter: any;
  // mastersData: any[];
  // editLabelWindow: any;
  // masterTableValue: any;
  // displayPageable: false;
  // currObjWindowValue: any;
  // masterTableTypeValue: any;
  // itemDataWindowWindow: any;
  // masterTableStructData: any;
  // parentMasterTableValue: any;
  // subWindowMasterTablStruct: any;
  // parentMasterTableNameValue: any;
  // parentMasterTableTypeValue: any;
  // subMastersDataWindowValue: any[];
  // parentMasterTableColumnReferenceDataObject: any;
  id: any;
  req: any;
  resp: any;
  mlist: any;
  onEdit = false;
  parameter: any;
  titleData: any;
  radioValue: any;
  dataWindow: any;
  recordList: any;
  loadNow = false;
  windowPopUp: any;
  onAddrow = false;
  source: any = {};
  eachRowData: any;
  screenTitles: any;
  currObjWindow: {};
  subDataWindow: any;
  columnsWindow: any;
  columns: any[] = [];
  itemDataWindow: any;
  showSearchFlag: any;
  subMastersData = [];
  displayPageable: any;
  itemData: any[] = [];
  displayPage: boolean;
  masterTableData: any;
  responseArray: any[];
  editLabel: any[] = [];
  addWindowTitle: string;
  radiolabel: any[] = [];
  searchlabelwindow: any;
  searchlabel: any[] = [];
  editWindowTitle: string;
  responseArrayWindow: any;
  masterWindowData: number;
  dataDisplay: any = false;
  TabledataToNull: boolean;
  ShowHideTableFlag = true;
  showSearchFlagWindow: any;
  checkMasterValue: boolean;
  isAlphaNumericFlag = false;
  masterTableDataObject: any;
  disableAcesCodeFlag = false;
  subMastersDataWindow: any[];
  checkRegExValidation = false;
  respWindow: BaseResponse<any>;
  searchLabelValueWindow: any[];
  masterTableTypeDataObject: any;
  private subMastersColumn: Object[];
  private subMastersColumnWindow = [];
  parentMasterTableNameDataObject: any;
  parentMasterTableTypeDataObject: any;
  parentMasterReferenceIdDataObject: any;
  parentMasterTableColumnReferenceValue: any;
  private hasColumnsForChildTable = false;
  masterSearchRequest: MaintainMastersSearchRequest = new MaintainMastersSearchRequest();
  @ViewChild('addwindow') addwindow: NgcWindowComponent;
  @ViewChild('subWindow') subWindow: NgcWindowComponent;
  @ViewChild('editWindow') editWindow: NgcWindowComponent;
  @ViewChild('deletewindow') deletewindow: NgcWindowComponent;
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  private masterSubForm: NgcFormGroup = new NgcFormGroup({
    subMasterDataList: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl()
      }),
    ])
  });
  private masterForm: NgcFormGroup = new NgcFormGroup({
    subMasterList: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        edit: new NgcFormControl()
      })
    ])
  });
  private editMaster: NgcFormGroup = new NgcFormGroup
    ({
      lov: new NgcFormControl()
    });
  private columnNames: NgcFormGroup = new NgcFormGroup
    ({
      checkbox: new NgcFormControl(),
      lov: new NgcFormControl()
    });
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private masterService: MastersService, private route: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
    this.route.params.subscribe(params => this.parameter = params.id);
  }

  /**
  * onInit method is responsible for dynamic Table content load
  */
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    /*Date.now = function now() {
   var a = new Date().getTime();
   return a;
   };*/
    super.ngOnInit();
    this.popupWidth = 600;
    this.subPopupWidth = 1200;
    this.TabledataToNull = false;
    this.displayPageable = true;
    this.showSearchFlag = false;
    this.showSearchFlagWindow = false;
    const master: MaintainMastersRequest = new MaintainMastersRequest();
    master.masterName = this.parameter;
    this.masterService.fetchMaster(master).subscribe(data => {
      this.resp = data;
      if (this.resp.data.length > 20) {
        this.displayPageable = true;
      } else {
        this.displayPageable = false;
      }
      this.masterTableData = this.resp.data;
      for (const eachRow of this.masterTableData) {
        this.eachRowData = eachRow.masterTablStruct;
        for (const eachRowValue of this.eachRowData) {
          if (eachRowValue.mcolumnType === 'REFERENCE') {
            this.parentMasterTableColumnReferenceValue = eachRowValue.mcolName;
          }
        }
      }
      this.generateDataTable(this.resp);
      this.masterService.getMasterDetailsHeader(this.req).subscribe(dataTitle => {
        this.mlist = dataTitle;
        for (let i = 0; i < this.mlist.data.length; i++) {
          if (this.mlist.data[i].tableName === this.parameter) {
            if (this.parameter === 'Event_CommunicationTypes') {
              this.showHideAdd = false;
            } else if (this.parameter === 'Mst_SetupAutoFlightComplete') {
              this.autoFlightFilter = false;
            } else if (this.parameter === 'Mst_AcesCode') {
              this.showPrintButton = false;
            }
            this.screenTitles = this.mlist.data[i].screenTitle;
            this.editWindowTitle = this.getI18NValue(this.mlist.data[i].screenTitle) + ' -Edit';
            this.addWindowTitle = this.getI18NValue(this.mlist.data[i].screenTitle) + ' -Add';
            break;
          }
        }
      });

      if (this.responseArray.length > 0) {
        this.dataDisplay = true;
      } else {
        this.showErrorStatus('master.driver.id.invalid');
      }
    }, error => { this.showErrorStatus('master.error.while.fetching.masters.list'); }
    );

  }

  /*
  generateData() function is for generating datatable
  values from the response in prescribed format ref:value
  */
  generateData() {
    this.subMastersData = [];
    let dynamicColumn;
    for (let i = 0; i < this.responseArray.length; i++) {
      dynamicColumn = this.responseArray[i].masterTablStruct;
      const currObj = {};
      for (let j = 0; j < dynamicColumn.length; j++) {
        if (dynamicColumn.length > 4 && dynamicColumn.length < 9) {
          this.windowPopUp = 400;
        } else if (dynamicColumn.length > 8) {
          this.windowPopUp = 650;
        } else {
          this.windowPopUp = 300;
        }
        if (dynamicColumn[j].mcolumnType === 'DROP') {
          if (dynamicColumn[j].columnValue != null) {
            const item = dynamicColumn[j].columnValue.split(',');
            currObj[dynamicColumn[j].mcolumnLabel] = item[0];
            // currObj[dynamicColumn[j].mcolumnLabel] = item[1];
          } else {
            // const item = dynamicColumn[j].columnValue.split(',');
            currObj[dynamicColumn[j].mcolumnLabel] = null;
            // currObj[dynamicColumn[j].mcolumnLabel] = null;
          }
        } else {
          if (dynamicColumn[j].showChildValue) {
            currObj['showChildValue'] = dynamicColumn[j].showChildValue;
          } else {
            currObj['showChildValue'] = null;
          }
          currObj[dynamicColumn[j].mcolumnLabel] = dynamicColumn[j].columnValue;
          currObj['flagDelete'] = 'flagDelete';
          currObj['Edit'] = 'Edit';
        }
      }
      this.subMastersData.push(currObj);
    }

    for (let index = 0; index < this.subMastersData.length; index++) {
      this.subMastersData[index]['select'] = 'SEL';
      this.subMastersData[index]['edit'] = 'EDIT';
    }
    (<NgcFormArray>this.masterForm.controls['subMasterList']).patchValue(this.subMastersData);
    /*if (!this.TabledataToNull) {
      this.TabledataToNull = false;
      (<NgcFormArray>this.masterForm.controls['subMasterList']).resetValue([]);
     }*/
  }
  /**
  * columnPush is for generating columns for ngc-datatable
  */
  // tslint:disable-next-line:cyclomatic-complexity
  columnPush() {
    this.hasColumnsForChildTable = false; // Destory Edit Table
    this.columns = [];
    let temp;
    const editColumn = {
      text: 'Edit', dataField: 'Edit', width: 40, type: 'link',
      iconType: 'edit', align: 'center', cellsAlign: 'center'
    };
    const deleteRecordColumn = {
      text: 'Delete', dataField: 'flagDelete', width: 40, type: 'link',
      iconType: 'delete', align: 'center', cellsAlign: 'center'
    };
    for (let i = 0; i < this.searchlabel.length; i++) {
      /*if (this.searchlabel[i].associatedTableButtonLabel) {
        this.referenceData = '4';
      }*/
      if (this.searchlabel[i].mcolumnType != null) {
        if (this.searchlabel[i].mcolumnType === 'CHECK') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: 30, required: this.searchlabel[i].mmandatoryColumn, type: 'icon',
            iconType: 'yesno', align: 'center', cellsAlign: 'center'
          };
        } else if (this.searchlabel[i].mcolumnType === 'NUMBER') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: this.searchlabel[i].width, type: 'NUMBER', align: 'center',
            required: this.searchlabel[i].mmandatoryColumn, cellsAlign: 'right',
            digits: this.searchlabel[i].mcolumnMaxLength
          };
        } else if (this.searchlabel[i].mcolumnType === 'AWBNUMBER') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: this.searchlabel[i].width, type: 'AWBNUMBER', align: 'center',
            required: this.searchlabel[i].mmandatoryColumn, cellsAlign: 'right',
            digits: this.searchlabel[i].mcolumnMaxLength
          };
        } else if (this.searchlabel[i].mcolumnType === 'FLIGHTKEYNUMBER') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: this.searchlabel[i].width, type: 'FLIGHTKEYNUMBER', align: 'center',
            required: this.searchlabel[i].mmandatoryColumn, cellsAlign: 'right',
            digits: this.searchlabel[i].mcolumnMaxLength
          };
        } else if (this.searchlabel[i].mcolumnType === 'NUMBERACES') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: this.searchlabel[i].width, type: 'NUMBERACES', align: 'center',
            required: this.searchlabel[i].mmandatoryColumn, cellsAlign: 'right',
            digits: this.searchlabel[i].mcolumnMaxLength
          };
        } else if (this.searchlabel[i].mcolumnType === 'DECIMALS') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: this.searchlabel[i].width, type: 'DECIMALS', align: 'center',
            required: this.searchlabel[i].mmandatoryColumn, cellsAlign: 'right',
            digits: this.searchlabel[i].mcolumnMaxLength
          };
        } else if (this.searchlabel[i].mcolumnType === 'DECIMALS_PRECISION8') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: this.searchlabel[i].width, type: 'DECIMALS_PRECISION8', align: 'center',
            required: this.searchlabel[i].mmandatoryColumn, cellsAlign: 'right',
            digits: this.searchlabel[i].mcolumnMaxLength
          };
        } else if (this.searchlabel[i].mcolumnType === 'CURRENCY') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: this.searchlabel[i].width, type: 'CURRENCY', required: this.searchlabel[i].mmandatoryColumn
          };
        } else if (this.searchlabel[i].mcolumnType === 'ALPHA') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: this.searchlabel[i].width, type: 'ALPHA', align: 'center',
            required: this.searchlabel[i].mmandatoryColumn, cellsAlign: 'center',
            digits: this.searchlabel[i].mcolumnMaxLength
          };
        } else if (this.searchlabel[i].mcolumnType === 'ALPHANUM') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: this.searchlabel[i].width, type: 'ALPHANUM', align: 'center',
            required: this.searchlabel[i].mmandatoryColumn, cellsAlign: 'center',
            digits: this.searchlabel[i].mcolumnMaxLength
          };
        } else if (this.searchlabel[i].mcolumnType === 'DATETIME') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel,
            width: this.searchlabel[i].width, type: 'displayDate', align: 'center', cellsAlign: 'right',
            required: this.searchlabel[i].mmandatoryColumn
          };
        } else if (this.searchlabel[i].mcolumnType === 'TIME') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel,
            width: this.searchlabel[i].width, type: 'displayTime', align: 'center', cellsAlign: 'right',
            required: this.searchlabel[i].mmandatoryColumn
          };
        } else if (this.searchlabel[i].mcolumnType === 'REFERENCE') {
          temp = {
            hidden: true
          };
        } else if (this.searchlabel[i].mcolumnType === 'DROP') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel,
            width: this.searchlabel[i].width, required: this.searchlabel[i].mmandatoryColumn,
            dropDownSourceId: this.searchlabel[i].dropDownSourceId, type: 'DROP',
            align: 'center', cellsAlign: 'center', iconType: 'edit'
          };
        } else if (this.searchlabel[i].mcolumnType === 'DROPACES') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel,
            width: this.searchlabel[i].width, required: this.searchlabel[i].mmandatoryColumn,
            dropDownSourceId: this.searchlabel[i].dropDownSourceId, type: 'DROPACES',
            align: 'center', cellsAlign: 'center', iconType: 'edit'
          };
        } else if
          (this.searchlabel[i].mcolumnType === 'DROPQUERY') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel,
            width: this.searchlabel[i].width, required: this.searchlabel[i].mmandatoryColumn,
            dropDownSourceId: this.searchlabel[i].dropDownSourceId, type: 'dropdown',
            align: 'center', cellsAlign: 'center', iconType: 'edit'
          };
        } else if (this.searchlabel[i].mcolumnType === 'LOV') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, width: this.searchlabel[i].width,
            required: this.searchlabel[i].mmandatoryColumn,
            dataField: this.searchlabel[i].mcolumnLabel, type: 'LOV', align: 'center',
            cellsAlign: 'center', lovKey: this.searchlabel[i].lovKey
          };
        } else if (this.searchlabel[i].mcolumnType === 'LOVCODE') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, width: this.searchlabel[i].width,
            required: this.searchlabel[i].mmandatoryColumn,
            dataField: this.searchlabel[i].mcolumnLabel, type: 'LOVCODE', align: 'center',
            cellsAlign: 'center', lovKey: this.searchlabel[i].lovKey
          };
        } else if (this.searchlabel[i].mcolumnType === 'LOVCODESEARCHONLY') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, width: this.searchlabel[i].width,
            required: this.searchlabel[i].mmandatoryColumn,
            dataField: this.searchlabel[i].mcolumnLabel, type: 'LOVCODESEARCHONLY', align: 'center',
            cellsAlign: 'center', lovKey: this.searchlabel[i].lovKey
          };
        } else if (this.searchlabel[i].mcolumnType === 'LOVCOUNTRY') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, width: this.searchlabel[i].width,
            required: this.searchlabel[i].mmandatoryColumn,
            dataField: this.searchlabel[i].mcolumnLabel, type: 'LOVCOUNTRY', align: 'center',
            cellsAlign: 'center', lovKey: this.searchlabel[i].lovKey
          };
        } else if (this.searchlabel[i].mcolumnType === 'LOVCITY') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, width: this.searchlabel[i].width,
            required: this.searchlabel[i].mmandatoryColumn,
            dataField: this.searchlabel[i].mcolumnLabel, type: 'LOVCITY', align: 'center',
            cellsAlign: 'center', lovKey: this.searchlabel[i].lovKey
          };
        } else if (this.searchlabel[i].mcolumnType === 'LOVDESC') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, width: this.searchlabel[i].width,
            required: this.searchlabel[i].mmandatoryColumn,
            dataField: this.searchlabel[i].mcolumnLabel, type: 'LOVDESC', align: 'center',
            cellsAlign: 'center', lovKey: this.searchlabel[i].lovKey
          };
        } else if (this.searchlabel[i].mcolumnType === 'LOVDESCGRACE') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, width: this.searchlabel[i].width,
            required: this.searchlabel[i].mmandatoryColumn,
            dataField: this.searchlabel[i].mcolumnLabel, type: 'LOVDESCGRACE', align: 'center',
            cellsAlign: 'center', lovKey: this.searchlabel[i].lovKey
          };
        } else if (this.searchlabel[i].mcolumnType === 'LOVCODEDESC') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, width: this.searchlabel[i].width,
            required: this.searchlabel[i].mmandatoryColumn,
            dataField: this.searchlabel[i].mcolumnLabel, type: 'LOVCODEDESC', align: 'center',
            cellsAlign: 'center', lovKey: this.searchlabel[i].lovKey
          };
        } else if (this.searchlabel[i].mcolumnType === 'LOVDESCINTABLE') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, width: this.searchlabel[i].width,
            required: this.searchlabel[i].mmandatoryColumn,
            dataField: this.searchlabel[i].mcolumnLabel, type: 'LOVDESCINTABLE', align: 'center',
            cellsAlign: 'center', lovKey: this.searchlabel[i].lovKey
          };
        } else if (this.searchlabel[i].mcolumnType === 'LINK') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: 'showChildValue', type: 'link',
            iconType: 'edit', align: 'center', cellsAlign: 'center', width: 100
          };
        } else if (this.searchlabel[i].mcolumnType === 'INPUT') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: this.searchlabel[i].width, required: this.searchlabel[i].mmandatoryColumn,
            type: 'INPUT', align: 'center', digits: this.searchlabel[i].mcolumnMaxLength
          };
        } else if (this.searchlabel[i].mcolumnType === 'INPUTNUMBER') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: this.searchlabel[i].width, required: this.searchlabel[i].mmandatoryColumn,
            type: 'INPUTNUMBER', align: 'center', digits: this.searchlabel[i].mcolumnMaxLength
          };
        } else if (this.searchlabel[i].mcolumnType === 'TEXTNORMAL') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: this.searchlabel[i].width, required: this.searchlabel[i].mmandatoryColumn,
            type: 'TEXTNORMAL', align: 'center', digits: this.searchlabel[i].mcolumnMaxLength
          };
        } else if (this.searchlabel[i].mcolumnType === 'TEXTCODE') {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: this.searchlabel[i].width, required: this.searchlabel[i].mmandatoryColumn,
            type: 'TEXTCODE', align: 'center', digits: this.searchlabel[i].mcolumnMaxLength
          };
        } else {
          temp = {
            text: this.searchlabel[i].mcolumnLabel, dataField: this.searchlabel[i].mcolumnLabel
            , width: this.searchlabel[i].width, required: this.searchlabel[i].mmandatoryColumn,
            type: 'TEXT', align: 'center', digits: this.searchlabel[i].mcolumnMaxLength
          };
        }

        this.editMaster.addControl(this.searchlabel[0].mcolumnLabel, new NgcFormControl());

        this.columns.push(temp);
      }
    }
    this.columns.push(editColumn);
    if (this.searchlabel[0].isDeleted === '1') {
      this.columns.push(deleteRecordColumn);
    }
    this.subMastersColumn = this.columns;
  }
  /**
   * generateForm is for generating dynamic form
   */
  generateForm() {
    let countCheck = 0;
    for (let i = 0; i < this.searchlabel.length; i++) {
      if (this.searchlabel[i].isSearch) {
        countCheck++;
      } else if (!this.searchlabel[i].isSearch) {
        this.showSearchFlag = false;
      }

      if (this.searchlabel[i].msearchLabel != null) {
        this.masterForm.addControl(this.searchlabel[i].msearchLabel, new NgcFormControl());
      }
      if (this.searchlabel[i].mcolumnLabel != null) {

        this.editMaster.addControl(this.searchlabel[i].mcolumnLabel, new NgcFormControl());
      }
    }
    if (countCheck > 0) {
      this.showSearchFlag = true;
    }

  }

  /**
     * This function validates if the master code number is in right format
     * @param input code number given as input by user
     */
  public checkMasters(input) {
    const result = /^[a-zA-z0-9]+[a-zA-Z0-9\d\-/. ]*$/.test(input);
    return result;
  }

  public checkMastersNumberInput(input) {
    const result = /^[0-9]{1,8}$/.test(input);
    return result;
  }

  /**
   * on select of row in LOV table we get entire row data in event
   */
  populateRadioButton(data) {
    for (let item = 0; item < data.length; item++) {
      if (data[item].radioButton != null) {
        this.radioValue = data[item].radioButton.split(',');
      }
    }
    if (this.radioValue != null) {
      for (let i = 0; i < this.radioValue.length; i++) {
        let item = this.radioValue[i];
        if (item != null) {
          item = item.split('#');
          this.radioValue[i] = item[0];
          this.radiolabel.push(item[1]);
        }
      }

    }
  }

  // public onLinkClick(event, dataField, groupIndex, columnIndex) {
  // }

  /**
   * on onLinkClick of row edit window will triggered and user can edit the master Data
   */
  // tslint:disable-next-line:cyclomatic-complexity
  public onLinkClick(event, dataField, groupIndex, columnIndex) {
    const masterGroup: NgcFormGroup = this.masterForm.get(['subMasterList', groupIndex]) as NgcFormGroup;
    const eventRequest: any = {};
    //
    eventRequest.type = 'link';
    eventRequest.column = dataField;
    eventRequest.record = masterGroup.getRawValue();
    //
    this.dataWindow = eventRequest.record;
    //
    if (eventRequest.column === 'Edit') {
      if (eventRequest.record.Type === 'EXMP') {
        this.disableAcesCodeFlag = true;
      }
      this.onEdit = true;
      this.onAddrow = false;
      this.displayPage = true;
      this.editMaster.patchValue(eventRequest.record);
      for (const eachRow of this.searchlabel) {
        if (eachRow.mColumnType === 'LOV' ||
          eachRow.mColumnType === 'LOVCODE' ||
          eachRow.mColumnType === 'LOVCITY' ||
          eachRow.mColumnType === 'LOVDESC' ||
          eachRow.mColumnType === 'LOVALPHA' ||
          eachRow.mColumnType === 'LOVNUMBER' ||
          eachRow.mColumnType === 'LOVCODEDESC' ||
          eachRow.mColumnType === 'LOVDESCINTABLE') {
          this.retrieveLOVRecords(eachRow.lovKey).subscribe(data => {
            for (const lovRecord of data) {
              let count = 0;
              for (const eachRowChild of this.searchlabel) {
                if (this.editMaster.get(eachRowChild.mColumnLabel).value === lovRecord.code) {
                  this.searchlabel[count].mValueDescription = lovRecord.desc;
                }
                count++;
              }
            }
          });
        } else if (eachRow.mColumnType === 'DROP' ||
          eachRow.mColumnType === 'DROPACES') {
          this.retrieveDropDownListRecords(eachRow.dropDownSourceId).subscribe(data => {
            for (const dropDownRecord of data) {
              let count = 0;
              for (const eachRowChild of this.searchlabel) {
                if (this.editMaster.get(eachRowChild.mColumnLabel).value === dropDownRecord.code) {
                  this.searchlabel[count].mValueDescription = dropDownRecord.desc;
                }
                count++;
              }
            }
          });
        } else if (eachRow.mColumnType === 'DROPQUERY') {
          this.retrieveDropDownListRecords(eachRow.dropDownSourceId, "query").subscribe(data => {
            for (const dropDownRecord of data) {
              let count = 0;
              for (const eachRowChild of this.searchlabel) {
                if (this.editMaster.get(eachRowChild.mColumnLabel).value === dropDownRecord.code) {
                  this.searchlabel[count].mValueDescription = dropDownRecord.desc;
                }
                count++;
              }
            }
          });
        }
      }
      this.editWindow.open();
      this.popupShowFlag = true;
    } else if (eventRequest.column === 'flagDelete') {
      this.dataWindow.flagCRUD = 'D';
      this.onMasterDelete(groupIndex);
    } else if (eventRequest.type === 'link') {
      this.masterTableDataObject = this.searchlabel[columnIndex].masterTable;
      this.masterTableTypeDataObject = this.searchlabel[columnIndex].masterTableType;
      this.parentMasterTableNameDataObject = this.searchlabel[columnIndex].parentMasterTable;
      this.parentMasterReferenceIdDataObject = eventRequest.record.Id;
      this.parentMasterTableTypeDataObject = this.searchlabel[columnIndex].parentMasterTableType;
      if (this.masterTableDataObject === 'Mst_SurveyPackingCondition') {
        this.titleData = this.searchlabel[columnIndex].columnValue + ' - '
          + masterGroup.get('Packing Detail').value;
      }else if(this.masterTableDataObject === 'Interface_MessageTypesOutboundProcessingParameters'){
        this.subPopupWidth = 1800;
      } else {
        this.titleData = this.searchlabel[columnIndex].columnValue;
      }
      this.onSubWindow();
    }
  }

  onLinkDelete(event, groupIndex) {
    (this.masterSubForm.get(['subMasterDataList', groupIndex]) as NgcFormGroup).markAsDeleted();
  }

  public generateDataTable(data) {
    this.searchlabel = [];
    this.itemData = data.data[0].masterTablStruct;
    this.editLabel.push(this.itemData);
    for (let item = 0; item < this.itemData.length; item++) {
      if (this.itemData[item].mmandatoryColumn === 'Y') {
        this.itemData[item].mmandatoryColumn = true;
      } else {
        this.itemData[item].mmandatoryColumn = false;
      }
      if (this.itemData[item].mcolumnMaxLength < 5) {
        this.itemData[item].width = 5 * 23;
      } else if (this.itemData[item].mcolumnMaxLength > 20 && this.itemData[item].mcolumnMaxLength < 40) {
        this.itemData[item].width = 22 * 15;
      } else if (this.itemData[item].mcolumnMaxLength > 40) {
        this.itemData[item].width = 60 * 15;
        this.popupWidth = 1200;
      } else {
        this.itemData[item].width = 15 * this.itemData[item].mcolumnMaxLength;
      }
      if (this.itemData[item].dropDownSourceId === 'ULD$MST_ULD_CONTOUR_INDICATOR_IATA') {
        this.itemData[item].dropDownHeight === '120';
      }
      if (this.itemData[item].dropDownSourceId) {
        this.itemData[item].dropDownHeight === '70';
      }
      this.searchlabel.push(this.itemData[item]);
    }
    this.responseArray = data.data;
    this.loadNow = true;
    this.generateData();
    this.columnPush();
    this.generateForm();
  }

  /**
  * this function is used for hiding the opened windows on click of Close button of pop up
  */
  public onWindowClose() {
    this.addwindow.close();
    this.editWindow.close();
    this.deletewindow.close();
  }

  /**
  * on onCreate function is responsible for adding the new masters data
  */
  // tslint:disable-next-line:cyclomatic-complexity
  public onCreate() {
    if (this.isAlphaNumericFlag) {
      return;
    }
    this.editMaster.validate();
    //
    if (this.editMaster.invalid) {
      return;
    }
    //
    let master: MaintainMastersSearchRequest = new MaintainMastersSearchRequest();
    master.searchMasters = new Array<MaintainMastersSearchData>();
    master.flagCRUD = 'C';
    for (let i = 0; i < this.searchlabel.length; i++) {
      this.checkMasterValue = true;
      let masterSearchData: MaintainMastersSearchData = new MaintainMastersSearchData();
      let searchValue = this.editMaster.get(this.searchlabel[i].mcolumnLabel).value;
      if (this.searchlabel[i].mcolumnType === null) {
        searchValue = 0;
      }
      if (this.searchlabel[i].mcolumnType === 'CHECK' && searchValue === null) {
        searchValue = false;
      }
      if (this.searchlabel[i].mcolumnType !== 'NUMBER' || this.searchlabel[i].mcolumnType !== 'FLIGHTKEYNUMBER' || this.searchlabel[i].mcolumnType !== 'AWBNUMBER' || this.searchlabel[i].mcolumnType !== 'DATETIME'
        || this.searchlabel[i].mcolumnType !== 'DECIMALS' || this.searchlabel[i].mcolumnType !== 'DECIMALS_PRECISION8') {
        this.checkMasterValue = false;
      }
      if (this.searchlabel[i].mcolumnType === 'INPUTNUMBER') {
        if (!this.checkMastersNumberInput(searchValue)) {
          this.showErrorStatus('master.driver.id.invalid');
          return;
        }
      }
      if ((this.searchlabel[i].mcolumnType === 'TEXT' || this.searchlabel[i].mcolumnType === 'TEXTNORMAL' || this.searchlabel[i].mcolumnType === 'TEXTCODE') && (searchValue != null && searchValue != '') && !this.checkMasters(searchValue)) {
        const item = this.searchlabel[i].mcolumnLabel;
        let response: any = this.errorMessage('E', item, 'Invalid ' + item);
        this.refreshFormMessages(response, 'editMaster');
        return;
      }
      masterSearchData.mType = '';
      masterSearchData.mTable = this.parameter;
      masterSearchData.mColName = this.searchlabel[i].mcolName;
      masterSearchData.columnValue = searchValue;
      masterSearchData.mDisplayColumn = '';
      masterSearchData.mDisplayOrd = '';
      masterSearchData.flagCRUD = 'C';
      masterSearchData.mMandatoryColumn = '';
      masterSearchData.mUniqueColumn = this.searchlabel[i].muniqueColumn;
      masterSearchData.mPK = this.searchlabel[i].mpk;
      masterSearchData.mColumnType = this.searchlabel[i].mcolumnType;
      masterSearchData.mValueDescription = this.searchlabel[i].mValueDescription;
      masterSearchData.mRegularExpression = '';
      masterSearchData.mRegExpMsg = '';
      masterSearchData.mSelectList = '';
      masterSearchData.mColumnLabel = this.searchlabel[i].mcolumnLabel;
      masterSearchData.mSearchLabel = '';
      masterSearchData.mColumnDataType = '';
      masterSearchData.mCreateUserCode = this.getUserProfile().userLoginCode;
      masterSearchData.mCreatedtime = 'CURRENT_TIMESTAMP';
      masterSearchData.mUpdatedUserCode = this.getUserProfile().userLoginCode;
      masterSearchData.mUpdatedTime = 'CURRENT_TIMESTAMP';
      masterSearchData.mTableTitle = this.screenTitles;
      if (masterSearchData.mColName !== 'LastUpdated_DateTime' && masterSearchData.mColName !== 'LastUpdatedUser_Code') {
        master.searchMasters.push(masterSearchData);
      }
    }
    if (this.editMaster.invalid) {
      this.showErrorStatus('master.validations.applied');
      return;
    }
    this.masterService.insertMasters(master).subscribe(data => {
      this.resp = data;
      if (this.resp.data != null) {

        this.showSuccessStatus('g.completed.successfully');
        this.responseArray = this.resp.data;
        this.generateData();
        this.editMaster.reset();
        this.addwindow.hide();
        this.onSearch();
      } else {
        this.masterSubForm.reset();
        this.refreshFormMessages(data);
      }
    });
  }
  /**
  * this function will open the prompt window for adding
  */
  public onAdd() {
    this.disableAcesCodeFlag = false;
    this.popupAddShowFlag = true;
    this.onAddrow = true;
    this.onEdit = false;
    this.displayPage = true;
    this.editMaster.reset();
    console.log(this.editMaster.getRawValue())
    let temp = {};
    for (let i = 0; i < this.searchlabel.length; i++) {
      if (this.searchlabel[i].mcolumnType != null) {

        this.editMaster.get(this.searchlabel[i].mcolumnLabel).setValue(null, { emitEvent: false });
        if (this.searchlabel[i].mcolumnType === 'CHECK') {
          this.editMaster.get(this.searchlabel[i].mcolumnLabel).setValue(false, { emitEvent: false });
        }
      }
    }
    this.addwindow.open();
  }

  /**
  * onDelete this function will show the prompt window
  */
  public onDelete() {
    this.deletewindow.open();
  }

  /**
  * onConfirm delete this function will delete the check records of the masters
  */
  public onMasterDelete(index) {
    this.showConfirmMessage('delete.selected.records').then(fulfilled => {
      this.deletewindow.hide();
      // const indices;
      const master: MaintainMastersSearchRequest = new MaintainMastersSearchRequest();
      master.searchMasters = new Array<MaintainMastersSearchData>();
      const item = (<NgcFormArray>this.masterForm.get('subMasterList')).controls;
      for (let i = 0; i < this.searchlabel.length; i++) {
        const masterSearchData: MaintainMastersSearchData = new MaintainMastersSearchData();
        if (this.responseArray[index].masterTablStruct[i]) {
          masterSearchData.mRegExpMsg = '';
          masterSearchData.mSelectList = '';
          masterSearchData.mDisplayOrd = '';
          masterSearchData.mColumnType = '';
          masterSearchData.mSearchLabel = '';
          masterSearchData.mColumnLabel = this.searchlabel[i].mcolumnLabel;
          masterSearchData.mUniqueColumn = this.searchlabel[i].muniqueColumn;
          masterSearchData.mDisplayColumn = '';
          masterSearchData.mColumnDataType = '';
          masterSearchData.mMandatoryColumn = '';
          masterSearchData.mRegularExpression = '';
          masterSearchData.mTable = this.parameter;
          masterSearchData.mType = item[index].value.flagDelete;
          masterSearchData.flagDelete = item[index].value.flagDelete;
          masterSearchData.mPK = this.responseArray[index].masterTablStruct[i].mpk;
          masterSearchData.mColName = this.responseArray[index].masterTablStruct[i].mcolName;
          masterSearchData.columnValue = this.responseArray[index].masterTablStruct[i].columnValue;
          masterSearchData.mCreateUserCode = this.getUserProfile().userLoginCode;
          masterSearchData.mCreatedtime = 'CURRENT_TIMESTAMP';
          masterSearchData.mUpdatedUserCode = this.getUserProfile().userLoginCode;
          masterSearchData.mUpdatedTime = 'CURRENT_TIMESTAMP';
          masterSearchData.mTableTitle = this.screenTitles;
          master.searchMasters.push(masterSearchData);
        }
      }
      if (master.searchMasters.length > 0) {
        this.masterService.deleteMasters(master.searchMasters).subscribe(data => {
          this.resp = data;
          if (this.resp.data != null) {
            //this.masterForm.reset();
            //this.masterSubForm.reset();
            this.showSuccessStatus('g.completed.successfully');
            this.responseArray = this.resp.data;
            this.onSearch();
            //this.reloadPage();
          } else {
            this.showErrorStatus(data.messageList[0].message);
          }
        });
      } /*else {
      this.showErrorStatus('Please Select record to Delete');
    }*/
    }).catch(reason => {
    });
  }

  /**
  * show input level error
  */
  public errorMessage(type, referenceId, message) {
    const errorMessage = {
      'confirmMessage': false,
      'messageList': [
        {
          'type': type,
          'referenceId': referenceId,
          'message': message
        }
      ],
      'success': false,
      'data': null
    };
    return errorMessage;
  }

  /**
  * on onUpdate function is responsible for editing the new masters data
  */
  // tslint:disable-next-line:cyclomatic-complexity
  public onUpdate() {
    if (this.isAlphaNumericFlag) {
      return;
    }
    this.editMaster.validate();
    //
    if (this.editMaster.invalid) {
      return;
    }
    //
    const master: MaintainMastersSearchRequest = new MaintainMastersSearchRequest();
    master.searchMasters = new Array<MaintainMastersSearchData>();
    this.checkRegExValidation = true;
    for (let i = 0; i < this.searchlabel.length; i++) {
      const masterSearchData: MaintainMastersSearchData = new MaintainMastersSearchData();
      this.checkMasterValue = true;
      let searchValue = this.editMaster.get(this.searchlabel[i].mcolumnLabel).value;
      if (this.searchlabel[i].mcolumnType !== 'TIME' && this.searchlabel[i].mcolumnType === 'CHECK' && searchValue === null) {
        searchValue = false;
      }
      if (this.searchlabel[i].mcolumnType !== 'NUMBER' || this.searchlabel[i].mcolumnType !== 'FLIGHTKEYNUMBER' || this.searchlabel[i].mcolumnType !== 'AWBNUMBER' || this.searchlabel[i].mcolumnType !== 'DATETIME'
        || this.searchlabel[i].mcolumnType !== 'DECIMALS' || this.searchlabel[i].mcolumnType !== 'DECIMALS_PRECISION8') {
        this.checkMasterValue = false;
      }
      if (this.searchlabel[i].mcolumnType === 'INPUTNUMBER') {
        if (!this.checkMastersNumberInput(searchValue)) {
          this.showErrorStatus('master.driver.id.invalid');
          return;
        }
      }
      if ((this.searchlabel[i].mcolumnType === 'TEXT' || this.searchlabel[i].mcolumnType === 'TEXTNORMAL' || this.searchlabel[i].mcolumnType === 'TEXTCODE') && (searchValue != null && searchValue != '') && !this.checkMasters(searchValue)) {
        const item = this.searchlabel[i].mcolumnLabel;
        const response: any = this.errorMessage('E', item, 'Invalid ' + item);
        this.refreshFormMessages(response, 'editMaster');
        this.checkRegExValidation = false;
        if (!response.messageList || response.messageList.length === 0) {
          this.editWindow.hide();
        }
      } else {
        if (searchValue === null || searchValue !== '' || searchValue === false) {
          masterSearchData.mType = '';
          masterSearchData.mTable = this.parameter;
          if (searchValue === null) {
            masterSearchData.columnValue = '';
          } else {
            masterSearchData.columnValue = searchValue;
          }
          masterSearchData.mDisplayColumn = '';
          masterSearchData.mDisplayOrd = '';
          masterSearchData.mMandatoryColumn = this.searchlabel[i].mMandatoryColumn;
          masterSearchData.mUniqueColumn = this.searchlabel[i].muniqueColumn;
          masterSearchData.mPK = this.searchlabel[i].mpk;
          masterSearchData.mColName = this.searchlabel[i].mcolName;
          masterSearchData.mColumnType = this.searchlabel[i].mcolumnType;
          masterSearchData.mRegularExpression = '';
          masterSearchData.mRegExpMsg = '';
          masterSearchData.mSelectList = '';
          masterSearchData.mColumnLabel = this.searchlabel[i].mcolumnLabel;
          masterSearchData.mValueDescription = this.searchlabel[i].mValueDescription;
          masterSearchData.mSearchLabel = '';
          masterSearchData.mColumnDataType = '';
          masterSearchData.mTableTitle = this.screenTitles;
          masterSearchData.mCreateUserCode = this.getUserProfile().userLoginCode;
          masterSearchData.mCreatedtime = 'CURRENT_TIMESTAMP';
          masterSearchData.mUpdatedUserCode = this.getUserProfile().userLoginCode;
          masterSearchData.mUpdatedTime = 'CURRENT_TIMESTAMP';
          if (masterSearchData.mColName !== 'LastUpdated_DateTime' && masterSearchData.mColName !== 'LastUpdatedUser_Code') {
            master.searchMasters.push(masterSearchData);
          }
        }
      }
    }
    if (this.checkRegExValidation && master.searchMasters.length > 0) {
      this.masterService.updateMasters(master).subscribe(data => {
        this.resp = data;
        if (this.resp.data !== null) {
          // this.masterForm.reset();
          this.editWindow.hide();
          this.showSuccessStatus('g.completed.successfully');
          this.responseArray = this.resp.data;
          this.onSearch();
        } else {
          this.showErrorStatus(data.messageList[0].message);
        }
      });
      if (master.searchMasters.length === 0) {
        const master: MaintainMastersRequest = new MaintainMastersRequest();
        master.masterName = this.parameter;
        this.masterService.fetchMaster(master).subscribe(data => {
          this.resp = data;
          if (this.resp.data !== null) {
            this.showSuccessStatus('g.completed.successfully');
            this.responseArray = this.resp.data;
            this.onSearch();
          } else {
            this.showErrorStatus(data.messageList[0].message);
          }
        },
          error => {
            this.showErrorStatus('error.fetching.master.list');
          }
        );
      }
    }
  }

  /**
  * on onSearch function is responsible for search the masters data
  */
  public onSearch() {
    this.resetFormMessages();
    if (this.isAlphaNumericFlag) {
      return;
    }
    const master: MaintainMastersSearchRequest = new MaintainMastersSearchRequest();
    master.searchMasters = new Array<MaintainMastersSearchData>();
    for (let i = 0; i < this.searchlabel.length; i++) {
      if (this.searchlabel[i].msearchLabel !== null) {
        const masterSearchData: MaintainMastersSearchData = new MaintainMastersSearchData();
        const searchValue = this.masterForm.get(this.searchlabel[i].msearchLabel).value;
        if (searchValue !== null && searchValue !== '') {
          masterSearchData.mPK = '';
          masterSearchData.mType = '';
          masterSearchData.mRegExpMsg = '';
          masterSearchData.mSelectList = '';
          masterSearchData.mColumnType = '';
          masterSearchData.mDisplayOrd = '';
          masterSearchData.mSearchLabel = '';
          masterSearchData.mColumnLabel = '';
          masterSearchData.mUniqueColumn = '';
          masterSearchData.mDisplayColumn = '';
          masterSearchData.mColumnDataType = '';
          masterSearchData.mMandatoryColumn = '';
          masterSearchData.mRegularExpression = '';
          masterSearchData.mTable = this.parameter;
          masterSearchData.columnValue = searchValue;
          master.searchMasters.push(masterSearchData);
          masterSearchData.mColName = this.searchlabel[i].mcolName;
          if (this.searchlabel[i].dropDownSourceId === 'ULD$MST_ULD_CONTENT_CODE' && searchValue === 'AL') {
            master.searchMasters.length = 0;
          }
        }
      }
    }
    if (master.searchMasters.length === 0) {
      const masterData: MaintainMastersRequest = new MaintainMastersRequest();
      masterData.masterName = this.parameter;
      this.masterService.fetchMaster(masterData).subscribe(data => {
        this.resp = data;
        if (this.resp.data != null) {
          this.ShowHideTableFlag = true;
          this.responseArray = this.resp.data;
          this.generateData();
        } else {
          this.ShowHideTableFlag = false;
          this.showErrorStatus(data.messageList[0].message);
        }
      },
        error => {
          this.showErrorStatus('master.error.while.fetching.masters.list');
        });
    } else {
      this.masterService.searchMasters(master).subscribe(data => {
        this.ShowHideTableFlag = false;
        this.resp = data;
        const ShowHideTable = data.data[0].masterTablStruct;
        for (const eachRow of ShowHideTable) {
          if (eachRow.columnValue !== '' || eachRow.columnValue === ',,,') {
            this.ShowHideTableFlag = true;
          }
        }
        if (!this.ShowHideTableFlag) {
          this.showInfoStatus('no.record.found');
        }
        if (this.resp.data != null) {
          this.responseArray = this.resp.data;
          this.generateData();
        } else {
          this.showErrorStatus(data.messageList[0].message);
        }
      });
    }
  }

  public onMastersClear(event) {
    for (let item = 0; item < this.searchlabel.length; item++) {
      this.masterForm.get(this.searchlabel[item].msearchLabel).setValue('');
    }
  }

  /**
  * The Below fucntions are used for
  * saving,
  * opening,
  * creating,
  * deleting,
  * displaying,
  * the child record of the window
  */

  /**
  * This function is used for subscribing for getting data and structure
  * which is later to be made for displaying and editing and saving the child record
  */
  onSubWindow() {
    this.subWindow.open();
    (<NgcFormArray>this.masterSubForm.controls['subMasterDataList']).resetValue([]);
    this.dataWindow.masterTable = this.masterTableDataObject;
    this.dataWindow.masterTableType = this.masterTableTypeDataObject;
    this.dataWindow.parentMasterTableType = this.parentMasterTableTypeDataObject;
    this.dataWindow.parentMasterTableName = this.parentMasterTableNameDataObject;
    this.dataWindow.parentMasterReferenceId = this.parentMasterReferenceIdDataObject;
    this.dataWindow.parentMasterTableColumnReference = this.parentMasterTableColumnReferenceValue;
    this.masterService.associatedmasterDetail(this.dataWindow).subscribe(subData => {
      this.respWindow = subData;
      this.refreshFormMessages(subData);
      this.generateDataTableWindow(this.respWindow);
    });
  }

  /**
  * This function is used for generating data witth the width of the window
  */
  generateDataTableWindow(subData) {
    this.searchlabelwindow = [];
    this.itemDataWindow = subData.data[0].masterTablStruct;
    this.subDataWindow = subData.data;
    for (const eachRow of this.itemDataWindow) {
      if (eachRow.mmandatoryColumn === 'Y') {
        eachRow.mmandatoryColumn = 'true';
      } else {
        eachRow.mmandatoryColumn = 'false';
      }

      if(eachRow.columnWidth != null){
        eachRow.width = eachRow.columnWidth;
      }else{
        if (eachRow.mcolumnMaxLength < 5) {
          eachRow.width = 5 * 23;
        } else if (eachRow.mcolumnMaxLength > 20) {
          eachRow.width = 20 * 10;
        }else {
          eachRow.width = 15 * eachRow.mcolumnMaxLength;
        }
      }
      this.searchlabelwindow.push(eachRow);
    } let count = 0;
    for (const eachRow of this.searchlabelwindow) {
      if (eachRow.columnValue && eachRow.columnValue !== '') {
        if (eachRow.lovKey !== '') {
          this.retrieveLOVRecords(eachRow.lovKey).subscribe(data => {
            for (const lovRecord of data) {
              let countChild = 0;
              for (const eachRowChild of this.searchlabelwindow) {
                if (eachRowChild.columnValue !== '' && eachRowChild.columnValue === lovRecord.code) {
                  this.searchlabelwindow[countChild].mValueDescription = lovRecord.desc;
                }
                countChild++;
              }
            }
          });
        } else if (eachRow.dropDownSourceId !== '') {
          this.retrieveDropDownListRecords(eachRow.dropDownSourceId).subscribe(data => {
            for (const dropDownRecord of data) {
              let countChild = 0;
              for (const eachRowChild of this.searchlabelwindow) {
                if (eachRowChild.columnValue !== '' && eachRowChild.columnValue === dropDownRecord.code) {
                  this.searchlabelwindow[countChild].mValueDescription = dropDownRecord.desc;
                }
                countChild++;
              }
            }
          });
        }
      }
      count++;
    }
    this.responseArrayWindow = subData.data;
    this.loadNow = true;
    this.generateDataWindow();
    this.columnPushWindow();
    this.generateFormWindow();
  }

  /**
   * generateForm is for generating dynamic form
   */
  generateFormWindow() {
    let countCheck = 0;
    for (let i = 0; i < this.searchlabelwindow.length; i++) {
      if (this.searchlabelwindow[i].isSearch) {
        countCheck++;
      } else if (!this.searchlabelwindow[i].isSearch) {
        this.showSearchFlagWindow = false;
      }
      if (this.searchlabelwindow[i].msearchLabel != null) {
        this.masterSubForm.addControl(this.searchlabelwindow[i].msearchLabel, new NgcFormControl());
        this.masterSubForm.get(this.searchlabelwindow[i].msearchLabel).setValue(null);
      }
    }
    if (countCheck > 0) {
      this.showSearchFlagWindow = true;
    }
  }
  /**
  * This function is used for generating data which is to be patched in window
  */
  generateDataWindow() {
    let dynamicColumnWindow;
    this.subMastersDataWindow = [];
    for (const eachRow of this.responseArrayWindow) {
      dynamicColumnWindow = eachRow.masterTablStruct;
      const record: any = {
        flagCRUD: eachRow.flagCRUD,
        select: false,
        flagDelete: false
      };
      for (const eachRowWindow of dynamicColumnWindow) {
        record.mpk = eachRowWindow.mpk;
        record.mcolName = eachRowWindow.mcolName;
        record.mregExpMsg = eachRowWindow.mregExpMsg;
        record.mcolumnType = eachRowWindow.mcolumnType;
        record.muniqueColumn = eachRowWindow.muniqueColumn;
        record.mcolumnMaxLength = eachRowWindow.mcolumnMaxLength;
        record[eachRowWindow.mcolName] = eachRowWindow.columnValue;
        record.mregularExpression = eachRowWindow.mregularExpression;
        record[eachRowWindow.mcolumnLabel] = eachRowWindow.columnValue;
      }
      // for pushing the particular record one by one for patching it in line 847
      this.subMastersDataWindow.push(record);
    }
    // for patching the data by making it dynamically
    (this.masterSubForm.get('subMasterDataList') as NgcFormArray).patchValue(this.subMastersDataWindow);
    this.hasColumnsForChildTable = true; // Re-create Edit Table
  }

  /**
  * columnPushWindow is for generating columnsWindow for ngc-edittable
  * TABLE HEADINGS GENERATION
  */
  // tslint:disable-next-line:cyclomatic-complexity
  columnPushWindow() {
    this.columnsWindow = [];
    let temp;
    // creating delete object which is to be pushed in last column of the table
    const deleteData = {
      text: 'delete', type: 'DELETE', dataField: 'flagDelete', width: 100
    };
    // For making the table columns dynamically (TABLE HEADINGS)
    for (const eachRow of this.searchlabelwindow) {
      if (eachRow.mcolumnType != null) {
        // if (eachRow.mpk === 'N') {
        if (eachRow.mdisplayColumn === 'Y') {
          if (eachRow.mcolumnType === 'CHECK') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'CHECK', iconType: 'yesno', align: 'center', cellsAlign: 'center',
              maxlength: eachRow.mcolumnMaxLength
            };
          } else if (eachRow.mcolumnType === 'LINK') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'LINK', iconType: 'delete', align: 'center', cellsAlign: 'center',
              maxlength: eachRow.mcolumnMaxLength
            };
          } else if (eachRow.mcolumnType === 'NUMBER') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'NUMBER', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength
            };
          } else if (eachRow.mcolumnType === 'AWBNUMBER') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'AWBNUMBER', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength
            };
          } else if (eachRow.mcolumnType === 'ALPHANUM') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'ALPHANUM', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength
            };
          } else if (eachRow.mcolumnType === 'FLIGHTKEYNUMBER') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'FLIGHTKEYNUMBER', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength
            };
          } else if (eachRow.mcolumnType === 'INPUT') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'INPUT', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength
            };
          } else if (eachRow.mcolumnType === 'INPUTNUMBER') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'INPUTNUMBER', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength
            };
          } else if (eachRow.mcolumnType === 'DECIMALS') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'DECIMALS', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength
            };
          } else if (eachRow.mcolumnType === 'DECIMALS_PRECISION8') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'DECIMALS_PRECISION8', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength
            };
          } else if (eachRow.mcolumnType === 'DATE') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'DATE', align: 'center', cellsAlign: 'right'
            };
          } else if (eachRow.mcolumnType === 'DATETIME') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'DATETIME', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength
            };
          } else if (eachRow.mcolumnType === 'LOV') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'LOV', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength,
              lovKey: eachRow.lovKey
            };
          } else if (eachRow.mcolumnType === 'LOVDESC') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'LOVDESC', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength,
              lovKey: eachRow.lovKey
            };
          } else if (eachRow.mcolumnType === 'LOVDESCGRACE') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'LOVDESCGRACE', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength,
              lovKey: eachRow.lovKey
            };
          } else if (eachRow.mcolumnType === 'LOVNUMBER') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'LOVNUMBER', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength,
              lovKey: eachRow.lovKey
            };
          } else if (eachRow.mcolumnType === 'DROP') {
            eachRow.columnValue = eachRow.columnValue.split(',');
            eachRow.columnValue = eachRow.columnValue[0];
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'DROP', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength,
              dropDownSourceId: eachRow.dropDownSourceId
            };
          } else if (eachRow.mcolumnType === 'DROPQUERY') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'DROPQUERY', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength, dropDownSourceId: eachRow.dropDownSourceId
            };
          } else if (eachRow.mcolumnType === 'HIDDEN') {
            temp = {
              required: 'eachRow.mmandatoryColumn', type: 'HIDDEN', hidden: true
            };
          } else if (eachRow.mcolumnType === 'TEXT') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'TEXT', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength
            };
          }
          else if (eachRow.mcolumnType === 'TEXTAREA') {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolName
              , width: eachRow.width, type: 'TEXTAREA', align: 'center', cellsAlign: 'right',
              maxlength: eachRow.mcolumnMaxLength
            };
          } else {
            temp = {
              required: 'eachRow.mmandatoryColumn', text: eachRow.mcolumnLabel, dataField: eachRow.mcolumnLabel
              , width: eachRow.width, type: 'INPUT', maxlength: eachRow.mcolumnMaxLength
            };
          }
          this.columnsWindow.push(temp);
        }
      }
    }
    // for pushing the delete column for deleting the record
    this.columnsWindow.push(deleteData);
    // subMastersColumnWindow will be used in HTML in For loop for making the table headings
    this.subMastersColumnWindow = this.columnsWindow;
  }

  /**
  * For saving the data of window for particular row data of maintable
  */
  public onSaveSubData() {
    this.recordList = (<NgcFormArray>this.masterSubForm.controls['subMasterDataList']);
    this.masterSubForm.validate();
    if (this.masterSubForm.invalid) {
      return;
    }
    const masterWindow = {
      masterTablStruct: [],
      masterTable: this.masterTableDataObject,
      masterTableType: this.masterTableTypeDataObject,
      parentMasterTableType: this.parentMasterTableTypeDataObject,
      parentMasterTableName: this.parentMasterTableNameDataObject,
      parentMasterReferenceId: this.parentMasterReferenceIdDataObject,
      parentMasterTableColumnReference: this.parentMasterTableColumnReferenceValue
    };
    this.recordList.controls.forEach((recordGroup: NgcFormGroup, index: number) => {
      const recordData: any = recordGroup.getRawValue();
      masterWindow.masterTablStruct.push({
        masterTablStruct: []
      });
      for (const eachRow of this.searchlabelwindow) {
        const masterSearchDataWindow = {
          mpk: eachRow.mpk,
          select: eachRow.mcolName,
          mcolName: eachRow.mcolName,
          mregExpMsg: eachRow.mregExpMsg,
          flagCRUD: recordData.flagCRUD,
          mColumnType: eachRow.mcolumnType,
          muniqueColumn: eachRow.muniqueColumn,
          mColumnLabel: eachRow.mColumnLabel,
          columnValue: recordData[eachRow.mcolName],
          mcolumnMaxLength: eachRow.mcolumnMaxLength,
          mregularExpression: eachRow.mregularExpression,
          mValueDescription: eachRow.mValueDescription,
        };
        this.masterWindowData = masterWindow.masterTablStruct[index].masterTablStruct.push(masterSearchDataWindow);
        masterWindow.masterTablStruct[index].flagCRUD = recordData['flagCRUD'];
      }
    });
    this.masterService.saveWindowData(masterWindow).subscribe(data => {
      this.resp = data;
      if (!data.messageList) {
        // this.onSubWindow();
        this.showSearchFlagWindow = false;
        this.showSuccessStatus('g.completed.successfully');
        this.subWindow.close();
        this.onSearch();
      } else {
        this.showErrorStatus(data.messageList[0].message);
      }
    });
  }

  public onAddSubData() {
    const record: any = {};
    // for making the object for adding a new row
    for (const eachRow of this.searchlabelwindow) {
      record[eachRow.mcolName] = null;
      record[eachRow.mcolumnLabel] = null;
      record[eachRow.flagCRUD] = 'C';
    }
    record.flagDelete = false;
    // function for adding new row in window for child data
    (<NgcFormArray>this.masterSubForm.controls['subMasterDataList']).addValue([record]);
  }

  public deleteSubModule(event, groupIndex) {
    (this.masterSubForm.get(['subMasterDataList', groupIndex]) as NgcFormGroup).markAsDeleted();
  }

  public onClear(event) {
    // this.ngOnInit();
  }


  /*public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
        const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
        //
        if (rowData) {
          cellsStyle.data = value;
        }
        //
        return cellsStyle;
  };*/

  /**
   * 
   */
  private onPopupWindowClose(event): void {
    this.popupShowFlag = false;
    this.editMaster.reset();
  }

  /**
   * 
   */
  private onAddPopupWindowClose(event): void {

    this.popupAddShowFlag = false;
    this.editMaster.reset();
  }

  /**
  * select COUNTRY LOV
  * @param object
  * For selecting and setting LOV COUNTRY AND CITY value for displaying in another screens
  */
  selectCountry(object, currModule) {
    this.cityByCountry = this.createSourceParameter(
      object.code
    );
    let count = 0;
    if (object.code) {
      for (const eachRow of this.searchlabel) {
        if (eachRow.mColumnLabel === currModule.mColumnLabel) {
          this.searchlabel[count].mValueDescription = object.desc;
        }
        count++
      }
    }
  }

  selectDropACES(event, currModule) {
    console.log(event);
    if (event.desc === 'Exemption Code') {
      this.disableAcesCodeFlag = true;
    } else {
      this.disableAcesCodeFlag = false;
    }
    let count = 0;
    if (event.code) {
      for (const eachRow of this.searchlabel) {
        if (eachRow.mColumnLabel === currModule.mColumnLabel) {
          this.searchlabel[count].mValueDescription = event.desc;
        }
        count++
      }
    }
  }

  onSelectAutoFlightComplete(event, currModule) {
    console.log(event);
    this.dataForAutoFlightKey = event.code
    let count = 0;
    if (event.code) {
      for (const eachRow of this.searchlabel) {
        if (eachRow.mColumnLabel === currModule.mColumnLabel) {
          this.searchlabel[count].mValueDescription = event.desc;
        }
        count++
      }
    }
  }

  onSelectAcesType(event) {
    this.reportParameterForAces = event.code
  }

  onPrint(event) {
    const reportParameters: any = {};
    reportParameters.Type = this.reportParameterForAces;
    this.reportParameters = reportParameters;
    this.reportWindow.open();
  }

  isAlphaNumeric(str) {
    this.resetFormMessages();
    let isNumeric = false;
    let isAlpha = false;
    if (str) {
      for (var i = 0; i < str.length; i++) {
        var char1 = str.charAt(i);
        var cc = char1.charCodeAt(0);
        if ((cc > 47 && cc < 58)) {
          isNumeric = true;
        }
        if ((cc > 64 && cc < 91) || (cc > 96 && cc < 123)) {
          isAlpha = true;
        }
      }
      if (!isAlpha || !isNumeric) {
        this.isAlphaNumericFlag = true;
        this.showErrorMessage('master.flight.number.not.alphanumeric');
      }
    }
  }

  onSearchChild() {
    const master: any = {};
    master.searchMasters = new Array<MaintainMastersSearchData>();
    for (let i = 0; i < this.searchlabelwindow.length; i++) {
      if (this.searchlabelwindow[i].msearchLabel !== null) {
        const masterSearchData: MaintainMastersSearchData = new MaintainMastersSearchData();
        const searchValue = this.masterSubForm.get(this.searchlabelwindow[i].msearchLabel).value;
        if (searchValue !== null && searchValue !== '') {
          masterSearchData.mPK = '';
          masterSearchData.mType = '';
          masterSearchData.mRegExpMsg = '';
          masterSearchData.mSelectList = '';
          masterSearchData.mColumnType = '';
          masterSearchData.mDisplayOrd = '';
          masterSearchData.mSearchLabel = '';
          masterSearchData.mColumnLabel = '';
          masterSearchData.mUniqueColumn = '';
          masterSearchData.mDisplayColumn = '';
          masterSearchData.mColumnDataType = '';
          masterSearchData.mMandatoryColumn = '';
          masterSearchData.mRegularExpression = '';
          masterSearchData.columnValue = searchValue;
          masterSearchData.mTable = this.masterTableDataObject;
          master.searchMasters.push(masterSearchData);
          masterSearchData.mColName = this.searchlabelwindow[i].mcolName;
        }
      }
    }
    const parentData: any = {
      mPK: '',
      mType: '',
      mRegExpMsg: '',
      mTableTitle: '',
      mSelectList: '',
      mColumnType: '',
      mDisplayOrd: '',
      mUpdatedTime: '',
      mCreatedtime: '',
      mSearchLabel: '',
      mColumnLabel: '',
      flagDelete: false,
      mUniqueColumn: '',
      authorizationId: '',
      mDisplayColumn: '',
      mCreateUserCode: '',
      mColumnDataType: '',
      mMandatoryColumn: '',
      mUpdatedUserCode: '',
      loggedInUser: '',
      mRegularExpression: '',
      mTable: this.masterTableDataObject,
      columnValue: this.dataWindow.parentMasterReferenceId,
      mColName: this.dataWindow.parentMasterTableColumnReference
    }
    master.searchMasters.push(parentData);
    this.masterService.searchMasters(master).subscribe(data => {
      this.resp = data;
      if (this.resp.data != null) {
        this.responseArrayWindow = this.resp.data;
        this.generateDataWindow();
      } else {
        this.showErrorStatus(data.messageList[0].message);
      }
    });
  }

  closeChildWindow() {
    this.subWindow.close();
    this.showSearchFlagWindow = false;
  }

  onSelectLovDrop(event, currModule) {
    let count = 0;
    if (event.code) {
      for (const eachRow of this.searchlabel) {
        if (eachRow.mColumnLabel === currModule.mColumnLabel) {
          this.searchlabel[count].mValueDescription = event.desc;
        }
        count++
      }
    }
  }

  onSelectChildLovDrop(event, value, index) {
    let count = 0;
    if (event.code) {
      for (const eachRow of this.searchlabelwindow) {
        if (eachRow.mColName === value.dataField) {
          this.searchlabelwindow[count].mValueDescription = event.desc;
        }
        count++
      }
    }
  }
}