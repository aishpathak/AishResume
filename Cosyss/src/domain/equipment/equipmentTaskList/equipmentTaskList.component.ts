import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcInputComponent,
  NgcUtility, NgcWindowComponent, NgcContainerComponent, PageConfiguration, DateTimeKey, CellsRendererStyle,
  NgcReportComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, AbstractControl, Validator, Validators } from '@angular/forms';
import { NgcFormControl } from 'ngc-framework';
import { StatusMessage } from 'ngc-framework';
import { SearchForTaskList, TaskListResult, TaskListCriteria } from '../equipmentsharedmodel';
import { EquipmentService } from '../equipment.service';
import { CellsStyleClass } from '../../../shared/shared.data';


@Component({
  selector: 'app-equipmentTaskList',
  templateUrl: './equipmentTaskList.component.html',
  styleUrls: ['./equipmentTaskList.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class EquipmentTaskListComponent extends NgcPage implements OnInit {
  toDate: any;
  fromDate: any;
  record: any;
  resp: any;
  isTableFlg = false;
  flag = false;
  tasklistDetail: any;
  reportParameters: any;
  hasReadPermission: boolean = false;

  private equipmentTasklistform: NgcFormGroup = new NgcFormGroup({
    flightDatecriteria: new NgcFormControl(false),
    collectionDatecriteria: new NgcFormControl(true),
    fromDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.HOURS)),
    toDate: new NgcFormControl(NgcUtility.getDateOnly(NgcUtility.addDate(new Date(), 1, DateTimeKey.DAYS))),
    blockTimedesc: new NgcFormControl(),
    status: new NgcFormControl(),
    requestTransactionNumber: new NgcFormControl(),
    shipmenttype: new NgcFormControl(),
    equipmentReqId: new NgcFormControl(),
    carriercode: new NgcFormControl(),
    agent: new NgcFormControl(),
    terminaldesc: new NgcFormControl(),
    blockTime: new NgcFormControl(),
    typeOfCollectiondesc: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    pdNumber: new NgcFormControl()
  });
  private equipmentResponseTasklistform: NgcFormGroup = new NgcFormGroup({
    Tasklist: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(false)
      })
    ])
  });

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
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
    this.hasReadPermission = NgcUtility.hasReadPermission('EQUIPMENT_ASSIGNED_TASKLIST');
    this.resetFormMessages();
    let search = new SearchForTaskList();
    search = this.equipmentTasklistform.getRawValue();
    this.equipmentService.searchTaskList(search).subscribe(data => {
      if (data.messageList) {
        this.isTableFlg = false;
        this.showResponseErrorMessages(data);
      }
      else if (!this.showResponseErrorMessages(data)) {
        //this.refreshFormMessages(data);
        this.resp = data.data;
        if (this.resp) {
          this.resp.forEach(estimatedPd => {
            if (estimatedPd.estimatedPdForTowing) {
              if (estimatedPd.numberOfUlds != " ") {
                estimatedPd.numberOfUlds = estimatedPd.numberOfUlds + "  ," + estimatedPd.estimatedPdForTowing + " " + "PDs"
              }
              else {
                estimatedPd.numberOfUlds = estimatedPd.estimatedPdForTowing + " " + "PDs"
              }

            }
          })
        }
        this.tasklistDetail = this.resp;
        if (this.tasklistDetail == null || this.tasklistDetail == '') {
          this.isTableFlg = false;
        } else {
          this.isTableFlg = true;
          this.tasklistDetail.forEach(ele => {
            ele['select'] = false;
          });


          let agent = new TaskListCriteria();
          agent = this.equipmentTasklistform.getRawValue();
          this.equipmentResponseTasklistform.patchValue(agent);

          (<NgcFormArray>this.equipmentResponseTasklistform.get(
            'Tasklist'
          )).patchValue(this.tasklistDetail);
          this.showSuccessStatus("g.completed.successfully")
        }

      }
    }, error => {
      this.isTableFlg = false;
      this.showErrorMessage(error);

    });
  }

  public onLinkClick(event) {
    if (event.type === 'link') {
      this.record = event.record;
      if ((this.record.status != ("PENDING")) && (this.record.status != ("PREPARED")) && (this.record.status != ("PARTIAL"))) {
        this.showErrorStatus("equipment.pending.prepared.action");
      }
      else if (event.column == "status" && (event.record.status == ("PENDING") || event.record.status == ("PREPARED") || event.record.status == ("PARTIAL"))) {
        this.onDeleteEquipmentRequest(event.record.NGC_ROW_ID);
      }
      else {
        const requestObject = {
          flightKey: this.record.flightKey,
          flightDate: this.record.flightDate,
          equipmentReqId: this.record.equipmentReqId,
          shipmenttype: this.record.shipmenttype,
          mode: this.record.mode,
          agent: this.record.agent
        }
        this.navigateTo(this.router, '/equipment/equipmentrequesting', requestObject);
      }
    }
  }




  onPrepare() {
    let loopRequired = 0;
    let x = this.equipmentResponseTasklistform.getRawValue();
    let y = new Array();
    // checks for atleast one request has been selected
    x.Tasklist.forEach(
      (element) => {
        //    if (loopRequired) {
        if (element.select) {
          loopRequired++;
        }

        //    }
      }
    )
    if (loopRequired > 1) {
      this.showErrorStatus("equipment.select.request.prepare");
    }
    else if (loopRequired == 0) {
      this.showErrorStatus("equipment.select.atleast.request.prepare");
    }
    else {
      x.Tasklist.forEach(ele => {
        if (ele['select']) {
          y.push(ele);
        }
      });
      this.equipmentService.prepareTaskList(y).subscribe(data => {
        this.resp = data.data;
        // if (this.resp == null) {
        //   this.refreshFormMessages(data);
        // } else {

        if (!this.showResponseErrorMessages(data)) {
          this.navigateTo(this.router, '/equipment/equipmentpreparation', this.resp);
        }
      }, error => {
        this.showErrorMessage(error);
      });
    }
  }

  public onBack(event) {
    this.navigateBack(this.equipmentTasklistform.getRawValue());
  }

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
    if (value == "PENDING" || value == "PARTIAL") {
      const rowId: number = rowData.NGC_ROW_ID;
      if(this.hasReadPermission){
        cellsStyle.data = value;
        cellsStyle.allowEdit = false;
      }else{
        cellsStyle.data = ` ${value}
        <a href="javascript:void(0)" data-row="${rowId}" data-column="${column}">
         <i class="fa fa-trash" data-row="${rowId}" data-column="${column}"></i>
        </a>`;
      }      
      //cellsStyle.className = CellsStyleClass.INFO_BLUE;
    }
    else if (value == "PREPARED") {
      const rowId: number = rowData.NGC_ROW_ID;
      if(this.hasReadPermission){
        cellsStyle.data = value;
        cellsStyle.allowEdit = false;
      }else{
        cellsStyle.data = ` ${value}
        <a href="javascript:void(0)" data-row="${rowId}" data-column="${column}">
         <i class="fa fa-trash" data-row="${rowId}" data-column="${column}"></i>
        </a>`;
      }
      
      //cellsStyle.className = CellsStyleClass.INFO_BLUE;
    } else {
      cellsStyle.data = value;
      cellsStyle.allowEdit = false;
      //cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
      //cellsStyle.allowEdit = false;

    }
    //
    return cellsStyle;
  };

  onDeleteEquipmentRequest(index: number) {
    let requestForDelete: SearchForTaskList = new SearchForTaskList();
    requestForDelete.equipmentReqId = this.equipmentResponseTasklistform.get(['Tasklist', index, 'equipmentReqId']).value
    requestForDelete.agent = this.equipmentResponseTasklistform.get(['Tasklist', index, 'agent']).value
    requestForDelete.flagCRUD = "D";
    requestForDelete.releaseIdList = this.equipmentResponseTasklistform.get(['Tasklist', index, 'releaseIdList']).value;
    this.equipmentService.deleteEquipmentRequest(requestForDelete).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.onSearch();
      }
    });

  }


  tasklistreportgeneration() {

    this.reportParameters = new Object();
    //this.reportParameters.carriercode = this.equipmentTasklistform.get('carrierCode').value;
    this.reportParameters.fromdate = this.equipmentTasklistform.get('fromDate').value;
    this.reportParameters.todate = this.equipmentTasklistform.get('toDate').value;
    if (this.equipmentTasklistform.get('blockTime').value != null) {
      this.reportParameters.blockTime = this.equipmentTasklistform.get('blockTime').value;
    }
    if (this.equipmentTasklistform.get('terminaldesc').value != null) {
      this.reportParameters.terminaldesc = this.equipmentTasklistform.get('terminaldesc').value;
    }
    if (this.equipmentTasklistform.get('carriercode').value != null) {
      this.reportParameters.carriercode = this.equipmentTasklistform.get('carriercode').value;
    }
    if (this.equipmentTasklistform.get('typeOfCollectiondesc').value != null) {
      this.reportParameters.typeOfCollectiondesc = this.equipmentTasklistform.get('typeOfCollectiondesc').value;
    }
    if (this.equipmentTasklistform.get('status').value != null) {
      this.reportParameters.status = this.equipmentTasklistform.get('status').value;
    }
    if (this.equipmentTasklistform.get('agent').value != null) {
      this.reportParameters.agent = this.equipmentTasklistform.get('agent').value;
    }
    if (this.equipmentTasklistform.get('shipmenttype').value != null) {
      this.reportParameters.shipmenttype = this.equipmentTasklistform.get('shipmenttype').value;
    }
    this.reportWindow.open();

  }

  onCreateTrip() {
    this.navigateTo(this.router, 'equipment/createtrip', null);
  }

  onReleaseReturn() {
    this.navigateTo(this.router, 'equipment/equipmentreturn', null);
  }
}
