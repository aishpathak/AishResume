import { error } from 'protractor';
import { element } from 'protractor';
import { forEach } from '@angular/router/src/utils/collection';
import { ResponseContentType } from '@angular/http';
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ChangeDetectorRef,
  HostListener,
  ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  PageConfiguration,
  NgcUtility,
  NgcWindowComponent,
  NgcReportComponent,
  NgcEditTableComponent
} from "ngc-framework";
import { ImportService } from '../import.service';
import { ApplicationFeatures } from "../../common/applicationfeatures";
import { Validators, FormControlName } from "@angular/forms";

@Component({
  selector: 'app-schedule-collection-list',
  templateUrl: './schedule-collection-list.component.html',
  styleUrls: ['./schedule-collection-list.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  restorePageOnBack: true,
  autoBackNavigation: true
})
export class ScheduleCollectionListComponent extends NgcPage implements OnInit {

  @ViewChild('scheduleCollectionShipmentList')
  private scheduleCollectionShipmentList: NgcEditTableComponent;
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('issueSRF') issueSRF: NgcWindowComponent;
  private scheduleCollectionListForm: NgcFormGroup = new NgcFormGroup({
    requestAgentCode: new NgcFormControl(),
    agentCode: new NgcFormControl(),
    agentName: new NgcFormControl(),
    requestIataAgentCode: new NgcFormControl(),
    requestSchCollectionNo: new NgcFormControl(),
    iataAgentCode: new NgcFormControl(),
    schCollectionNo: new NgcFormControl(),
    schTimeSlot: new NgcFormControl(),
    truckDockNo: new NgcFormControl(),
    vehicleNo: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    scheduleCollectionShipmentList: new NgcFormArray([
    ]),

  })
  public collectionPerson: NgcFormGroup = new NgcFormGroup({
    appointedAgent: new NgcFormControl(),
    collectedBy: new NgcFormControl(),
    hkId: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
  });
  showTable: boolean = false;
  checkDisableFlag: boolean = false;
  reportParameters: any;
  shipmentInfoList: any[];



  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }

  searchScheduleCollectionList() {
    this.showTable = false;
    this.checkDisableFlag = false;
    const requestData = {
      agentCode: this.scheduleCollectionListForm.get('requestAgentCode').value,
      iataAgentCode: this.scheduleCollectionListForm.get('requestIataAgentCode').value,
      schCollectionNo: this.scheduleCollectionListForm.get('requestSchCollectionNo').value,
      shipmentNumber: this.scheduleCollectionListForm.get('shipmentNumber').value
    }
    // if (requestData.agentCode !== null && requestData.iataAgentCode !== null && requestData.schCollectionNo !== null) {
    //   this.showErrorMessage("billing.error.search");
    //   return;
    // }
    // if (requestData.agentCode !== null && requestData.iataAgentCode !== null && requestData.schCollectionNo === null) {
    //   this.showErrorMessage("import.enter.iata.agent");
    //   return;
    // }
    // if ((requestData.agentCode !== null || requestData.iataAgentCode !== null) && requestData.schCollectionNo !== null) {
    //   this.showErrorMessage("billing.error.search");
    //   return;
    // }
    // if (requestData.agentCode === null && requestData.iataAgentCode === null && requestData.schCollectionNo === null) {
    //   this.showErrorMessage("Search with either agent/ IATA code or Sch Coll No");
    //   return;
    // }
    if ((requestData.agentCode !== null || requestData.iataAgentCode !== null || requestData.shipmentNumber !== null) && requestData.schCollectionNo !== null) {
      this.showErrorMessage("import.error.search.agent.iata");
      return;
    }
    if (requestData.agentCode === null && requestData.iataAgentCode === null && requestData.shipmentNumber === null && requestData.schCollectionNo === null) {
      this.showErrorMessage("import.error.search.agent.iata");
      return;
    }
    if (requestData.schCollectionNo != null) {
      this.checkDisableFlag = true;
    }

    this.importService.fetchScheduleColectionList(requestData).subscribe(data => {
      let response = data.data;
      if (!this.showResponseErrorMessages(data)) {
        if (response) {
          this.scheduleCollectionListForm.patchValue(response);
          this.showTable = true;
        }
      }

    }, error => {
      this.showErrorStatus(error);
      this.showTable = false;
    }
    )

  }

  onSave(event) {
    const scheduleData = this.scheduleCollectionListForm.getRawValue();
    const scheduleShipmentList = []
    let count = 0;
    scheduleData.scheduleCollectionShipmentList.forEach(element => {
      if (element.checkFlag) {
        scheduleShipmentList.push(element);
        count++;
      }
    });
    if (count < 1) {
      this.showErrorStatus("export.select.atleast.one.shipment");
      return;
    }
    if (scheduleData.vehicleNo == null) {
      this.showErrorStatus("import.vehicle.mandatory");
      return;
    }
    scheduleData.scheduleCollectionShipmentList = [];
    scheduleData.scheduleCollectionShipmentList = scheduleShipmentList;
    this.importService.generateSchCollectionNo(scheduleData).subscribe(data => {
      if (data.data.messageList !== null && data.data.messageList[0].code === 'import.warning.sch.coll.created') {
        {
          if (data.data.schCollectionNo != null) {
            this.showConfirmMessage(NgcUtility.translateMessage("import.warning.sch.coll.created", data.data.messageList[0].placeHolder)).then(fulfilled => {
              this.showSuccessStatus('g.completed.successfully');
              this.scheduleCollectionListForm.get('schCollectionNo').patchValue(data.data.schCollectionNo);
              this.scheduleCollectionListForm.get('requestSchCollectionNo').patchValue(data.data.schCollectionNo);
              this.scheduleCollectionListForm.get('requestAgentCode').patchValue(null);
              this.scheduleCollectionListForm.get('requestIataAgentCode').patchValue(null);
              this.onPrint(event);
              this.searchScheduleCollectionList();
            }).catch(reason => {
              this.showSuccessStatus('g.completed.successfully');
              this.searchScheduleCollectionList();
            });
          }
        }
      }
    }, error => {
      this.showErrorStatus(error);
    })

  }
  onPrint(event) {
    this.reportParameters = new Object();
    this.reportParameters.SchCollectionNo = this.scheduleCollectionListForm.get('schCollectionNo').value;
    this.reportParameters.SchCollectionTimeSlot = this.scheduleCollectionListForm.get('schTimeSlot').value;
    this.reportWindow.open();


  }
  onSelect(item) {
    let obj = this.scheduleCollectionListForm.get(['scheduleCollectionShipmentList', item.rowIndex]).value;
    if (obj.validateBreakdownPieces != null) {
      this.scheduleCollectionListForm.get(['scheduleCollectionShipmentList', item.rowIndex, 'select']).setValue(false);
      //this.selRecord = {};
      return;
    }
  }

  onIssueSrf() {

    //this.scheduleCollectionListForm.get("collectedBy").patchValue(NgcUtility.getUserProfile().userLoginCode);
    if (!this.checkDisableFlag) {
      this.showErrorMessage("import.error.generate.sch.coll.no.first");
      return;
    }
    this.shipmentInfoList = [];
    let count = 0;
    let srfCreatedCount = 0;
    let documentNotApproved: any = null;
    let validatePaymentStatus: any = null;
    let checkPaymentStatus: any = null;
    this.resetFormMessages();
    const scheduleData = this.scheduleCollectionListForm.getRawValue();
    scheduleData.scheduleCollectionShipmentList.forEach(element => {
      if (element.checkFlag) {
        this.shipmentInfoList.push(element);
        count++;
      }
      if (element.checkFlag && element.srfStatus != null) srfCreatedCount++;
      if (element.checkFlag && element.documentStatus != 'Approved') {
        if (documentNotApproved == null) {
          documentNotApproved = element.shipmentNumber;
        } else {
          documentNotApproved = documentNotApproved + "/" + element.shipmentNumber;
        }
      }
    });
    if (srfCreatedCount > 0) {
      this.showErrorStatus("import.error.srf.already.created.for.some");
      return;
    }
    if (count < 1) {
      this.showErrorStatus("export.select.atleast.one.shipment");
      return;
    }
    if (documentNotApproved != null) {
      this.showErrorStatus(NgcUtility.translateMessage("imp.bd.esrf.document.status", [documentNotApproved]));
      return;
    }
    this.collectionPerson.get("appointedAgent").patchValue(this.scheduleCollectionListForm.get("agentCode").value);
    this.issueSRF.open();
  }
  saveIssueSRF() {
    this.collectionPerson.validate();
    if (this.collectionPerson.invalid) {
      this.showErrorMessage("mandatory.field.not.empty");
      return;
    }
    this.shipmentInfoList.forEach((shipmentInfo, i) => {
      let data = this.collectionPerson.getRawValue();
      console.log(data);
      shipmentInfo.appointedAgent = this.collectionPerson.get('appointedAgent').value;
      shipmentInfo.receivingPartyName = this.collectionPerson.get('collectedBy').value;
      shipmentInfo.receivingPartyIdentificationNumber = this.collectionPerson.get('hkId').value;
      //hard coded temporary need fix this printer
      shipmentInfo.printerName = '10.12.1234';
    })
    this.importService.onSaveMultipleIssuePo(this.shipmentInfoList).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.issueSRF.close();
        this.searchScheduleCollectionList();
      }
    }, error => {
      this.showErrorStatus(error);
    });



  }

  getPaymentStatus(data, index) {
    this.importService.getEsrfApprovePaymentStatus(data).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.scheduleCollectionListForm.get(['scheduleCollectionShipmentList', index, 'paymentStatus']).setValue(response.data.paymentStatus);
      }
    }, error => {
      this.showErrorStatus(error);
    });
  }
  // onClear() {
  //   this.showTable = false;
  //   this.checkDisableFlag = false;
  //   this.resetFormMessages();
  //   this.scheduleCollectionListForm.get("requestAgentCode").patchValue(null);
  //   this.scheduleCollectionListForm.get("requestIataAgentCode").patchValue(null);
  //   this.scheduleCollectionListForm.get("requestSchCollectionNo").patchValue(null);
  //   this.scheduleCollectionListForm.get("shipmentNumber").patchValue(null);
  // }

}