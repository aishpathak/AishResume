import { Validators } from '@angular/forms';
import {
  NgcFormControl, NgcFormGroup, NgcFormArray, NgcPage, NgcReportComponent,
  NgcWindowComponent, CellsRendererStyle, NgcButtonComponent, NgcUtility, PageConfiguration, NgcPrinterComponent
} from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ImportService } from '../import.service';
import { trigger } from '@angular/animations';
import { ApplicationFeatures } from '../../common/applicationfeatures';
import { CellsStyleClass } from './../../../shared/shared.data';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightPouchModelHandle } from "../import.sharedmodel";

@Component({
  selector: 'app-flight-pouch-handling',
  templateUrl: './flight-pouch-handling.component.html',
  styleUrls: ['./flight-pouch-handling.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class FlightPouchHandlingComponent extends NgcPage implements OnInit {
  displayData: boolean = false;
  displayButton: boolean = false;
  confirmPickupSaveRequest: any;
  private carrierFlg: boolean = false;
  response: any;
  selectedGroupCode: string[] = [];
  carrierGroupCodeParam: any;
  confirmDeliverSaveRequest: any;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private importService: ImportService, private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);

  }

  private flightPouchform: NgcFormGroup = new NgcFormGroup({
    search: new NgcFormGroup({
      fromDate: new NgcFormControl(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() - 4, new Date().getMinutes(), 0)),
      toDate: new NgcFormControl(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() + 4, new Date().getMinutes(), 0)),
      flightNo: new NgcFormControl(),
      date: new NgcFormControl(),
      pouchStatus: new NgcFormControl(),
      paxfrt: new NgcFormControl(),
      carrierCode: new NgcFormControl(),
      carrierGroup: new NgcFormControl(),
      staffId: new NgcFormControl(),
      remarks: new NgcFormControl(),
      dateTime: new NgcFormControl(new Date()),
      pickup: new NgcFormControl(),
      deliver: new NgcFormControl(),
      recieved: new NgcFormControl(),
      cancelPickup: new NgcFormControl(),
      cancelDeliver: new NgcFormControl(),
      cancelRecieved: new NgcFormControl(),
    }),
    flightPouchHandleDetaillList: new NgcFormArray(
      [
      ]
    ),

  })
  ngOnInit() {
    super.ngOnInit();
    this.flightPouchform.get(['search', 'flightNo'])
      .valueChanges.subscribe(changeValue => {
        if (changeValue) {
          this.flightPouchform.get(['search', 'date'])
            .setValidators([Validators.required]);
        } else {
          this.flightPouchform.get(['search', 'date']).setValidators([]);
        }
      });
  }


  public onSearch() {
    //   let loggedinUser = this.getUserProfile().userLoginCode
    const request: FlightPouchModelHandle = new FlightPouchModelHandle();
    this.displayData = false;
    const requestData = this.flightPouchform.get('search');
    if (requestData != null && requestData.get('fromDate').value != null && requestData.get('toDate').value != null) {
      if (requestData.get('fromDate').value > requestData.get('toDate').value) {
        this.showErrorStatus("exp.specialShipment.dateError")
        return
      }
      if (requestData.get('flightNo').value != null) {
        if (requestData.get('date').value == null) {
          this.showErrorStatus("export.flightdate.mandatory")
          return
        }
      }
      request.fromDate = requestData.get('fromDate').value;
      request.toDate = requestData.get('toDate').value;
      request.date = requestData.get('date').value;
      request.pouchStatus = requestData.get('pouchStatus').value;
      request.flightNo = requestData.get('flightNo').value;
      request.functionType = 'IMPORT';
      request.carrierGroup = requestData.get('carrierGroup').value;
      request.paxfrt = requestData.get('paxfrt').value;

      this.resetFormMessages();
      this.importService.flightpouchhandle(request).subscribe(data => {
        this.response = data;
        if (!this.showResponseErrorMessages(data)) {
          {
            this.flightPouchform.get('flightPouchHandleDetaillList').patchValue(data.data.flightPouchHandleDetaillList);
            if (data.data.flightPouchHandleDetaillList.length > 0) {
              this.displayButton = true;
            }
            this.displayData = true;
          }
        }
      });
    } else {
      this.showErrorStatus("imp.flight.pouch.mandat.eroor")
      this.displayData = false
      return
    }
  }


  public onConfirmPickUp() {
    this.confirmPickupSaveRequest = this.flightPouchform.getRawValue();
    const requestData = this.flightPouchform.get('search');
    let pouchHandleList = this.confirmPickupSaveRequest.flightPouchHandleDetaillList;
    let flightPouchouchHandleList: Array<FlightPouchModelHandle> = new Array<FlightPouchModelHandle>();
    pouchHandleList.forEach(element => {
      if (element.selectCheck) {
        let flightPouch: FlightPouchModelHandle = new FlightPouchModelHandle();
        flightPouch.flightId = element.flightId;
        flightPouch.flightNo = element.flightNo;
        flightPouch.flightDate = element.fDate;
        //flightPouch.date = element.date;
        flightPouch.staffId = requestData.get('staffId').value;
        flightPouch.remarks = requestData.get('remarks').value;
        flightPouch.dateTime = requestData.get('dateTime').value;
        flightPouch.confirmPickup = requestData.get('staffId').value; + ' ' + requestData.get('remarks').value; + ' ' + requestData.get('dateTime').value;
        flightPouch.functionType = 'IMPORT';
        flightPouchouchHandleList.push(flightPouch);
      }
    });
    if (flightPouchouchHandleList.length == 0) {
      this.showErrorStatus('imp.doc.mandat.select.error');
      return;
    } else {
      this.importService.saveFlightConfirmPouchHandle(flightPouchouchHandleList).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus('g.completed.successfully');
          this.displayData = false;
          this.onSearch();
        }
      }, error => {
      })
    }
  }
  public onConfirmDeliver() {
    this.confirmPickupSaveRequest = this.flightPouchform.getRawValue();
    const requestData = this.flightPouchform.get('search');
    let pouchHandleList = this.confirmPickupSaveRequest.flightPouchHandleDetaillList;
    let flightPouchouchHandleList: Array<FlightPouchModelHandle> = new Array<FlightPouchModelHandle>();
    pouchHandleList.forEach(element => {
      if (element.selectCheck) {
        let flightPouch: FlightPouchModelHandle = new FlightPouchModelHandle();
        flightPouch.flightId = element.flightId;
        flightPouch.flightNo = element.flightNo;
        flightPouch.flightDate = element.dateTime;
        flightPouch.flightDate = element.fDate;
        flightPouch.staffId = requestData.get('staffId').value;
        flightPouch.remarks = requestData.get('remarks').value;
        flightPouch.dateTime = requestData.get('dateTime').value;
        flightPouch.confirmDelivery = requestData.get('staffId').value + ' ' + requestData.get('remarks').value + ' ' + requestData.get('dateTime').value;
        flightPouch.functionType = 'IMPORT';
        //  flightPouch.dateAta = element.dateAta;
        flightPouchouchHandleList.push(flightPouch);
      }
    });
    if (flightPouchouchHandleList.length == 0) {
      this.showErrorStatus('imp.doc.mandat.select.error');
      return;
    } else {
      this.importService.saveFlightConfirmPouchDeliverHandle(flightPouchouchHandleList).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus('g.completed.successfully');
          this.displayData = false;
          this.onSearch();
        }
      }, error => {
      })
    }
  }

  public onConfirmReceived() {
    this.confirmPickupSaveRequest = this.flightPouchform.getRawValue();
    let pouchHandleList = this.confirmPickupSaveRequest.flightPouchHandleDetaillList;
    const requestData = this.flightPouchform.get('search');
    let flightPouchouchHandleList: Array<FlightPouchModelHandle> = new Array<FlightPouchModelHandle>();
    pouchHandleList.forEach(element => {
      if (element.selectCheck) {
        let flightPouch: FlightPouchModelHandle = new FlightPouchModelHandle();
        flightPouch.flightId = element.flightId;
        flightPouch.flightNo = element.flightNo;
        flightPouch.flightDate = element.dateTime;
        flightPouch.flightDate = element.fDate;
        flightPouch.staffId = requestData.get('staffId').value;
        flightPouch.remarks = requestData.get('remarks').value;
        flightPouch.dateTime = requestData.get('dateTime').value;
        flightPouch.confirmReceived = requestData.get('staffId').value + ' ' + requestData.get('remarks').value + ' ' + requestData.get('dateTime').value;
        flightPouch.functionType = 'IMPORT';
        flightPouchouchHandleList.push(flightPouch);
      }
    });
    if (flightPouchouchHandleList.length == 0) {
      this.showErrorStatus('imp.doc.mandat.select.error');
      return;
    } else {
      this.importService.saveFlightConfirmPouchReceivedHandle(flightPouchouchHandleList).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus('g.completed.successfully');
          this.displayData = false;
          this.onSearch();
        }
      }, error => {
      })
    }
  }


  public onCancelPickUp() {
    this.confirmPickupSaveRequest = this.flightPouchform.getRawValue();
    const requestData = this.flightPouchform.get('search');
    let pouchHandleList = this.confirmPickupSaveRequest.flightPouchHandleDetaillList;
    let flightPouchouchHandleList: Array<FlightPouchModelHandle> = new Array<FlightPouchModelHandle>();
    pouchHandleList.forEach(element => {
      if (element.selectCheck) {
        let flightPouch: FlightPouchModelHandle = new FlightPouchModelHandle();
        flightPouch.flightId = element.flightId;
        flightPouch.flightNo = element.flightNo;
        flightPouch.flightDate = element.dateTime;
        flightPouch.flightDate = element.fDate;
        flightPouch.staffId = requestData.get('staffId').value;
        flightPouch.remarks = requestData.get('remarks').value;
        flightPouch.dateTime = requestData.get('dateTime').value;
        flightPouch.cancelPickup = requestData.get('staffId').value + ' ' + requestData.get('remarks').value + ' ' + requestData.get('dateTime').value;
        flightPouch.functionType = 'IMPORT';
        flightPouchouchHandleList.push(flightPouch);
      }
    });
    if (flightPouchouchHandleList.length == 0) {
      this.showErrorStatus('imp.doc.mandat.select.error');
      return;
    } else {
      this.importService.saveFlightCancelPouchHandle(flightPouchouchHandleList).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus('g.completed.successfully');
          this.displayData = false;
          this.onSearch();
        }
      }, error => {
      })
    }
  }

  public onCancelDeliver() {
    this.confirmPickupSaveRequest = this.flightPouchform.getRawValue();
    const requestData = this.flightPouchform.get('search');
    let pouchHandleList = this.confirmPickupSaveRequest.flightPouchHandleDetaillList;
    let flightPouchouchHandleList: Array<FlightPouchModelHandle> = new Array<FlightPouchModelHandle>();
    pouchHandleList.forEach(element => {
      if (element.selectCheck) {
        let flightPouch: FlightPouchModelHandle = new FlightPouchModelHandle();
        flightPouch.flightId = element.flightId;
        flightPouch.flightNo = element.flightNo;
        flightPouch.flightDate = element.dateTime;
        flightPouch.flightDate = element.fDate;
        flightPouch.staffId = requestData.get('staffId').value;
        flightPouch.remarks = requestData.get('remarks').value;
        flightPouch.dateTime = requestData.get('dateTime').value;
        flightPouch.cancelDelivery = requestData.get('staffId').value + ' ' + requestData.get('remarks').value + ' ' + requestData.get('dateTime').value;
        flightPouch.functionType = 'IMPORT';
        flightPouchouchHandleList.push(flightPouch);
      }
    });
    if (flightPouchouchHandleList.length == 0) {
      this.showErrorStatus('imp.doc.mandat.select.error');
      return;
    } else {
      this.importService.saveFlightCancelPouchDeliverHandle(flightPouchouchHandleList).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus('g.completed.successfully');
          this.displayData = false;
          this.onSearch();
        }
      }, error => {
      })
    }
  }
  public onCancelReceived() {
    this.confirmPickupSaveRequest = this.flightPouchform.getRawValue();
    const requestData = this.flightPouchform.get('search');
    let pouchHandleList = this.confirmPickupSaveRequest.flightPouchHandleDetaillList;
    let flightPouchouchHandleList: Array<FlightPouchModelHandle> = new Array<FlightPouchModelHandle>();
    pouchHandleList.forEach(element => {
      if (element.selectCheck) {
        let flightPouch: FlightPouchModelHandle = new FlightPouchModelHandle();
        flightPouch.flightId = element.flightId;
        flightPouch.flightNo = element.flightNo;
        flightPouch.flightDate = element.dateTime;
        flightPouch.flightDate = element.fDate;
        flightPouch.staffId = requestData.get('staffId').value;
        flightPouch.remarks = requestData.get('remarks').value;
        flightPouch.dateTime = requestData.get('dateTime').value;
        flightPouch.cancelReceived = requestData.get('staffId').value + ' ' + requestData.get('remarks').value + ' ' + requestData.get('dateTime').value;
        flightPouch.functionType = 'IMPORT';
        flightPouchouchHandleList.push(flightPouch);
      }
    });
    if (flightPouchouchHandleList.length == 0) {
      this.showErrorStatus('imp.doc.mandat.select.error');
      return;
    } else {
      this.importService.saveFlightCancelPouchReceivedHandle(flightPouchouchHandleList).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus('g.completed.successfully');
          this.displayData = false;
          this.onSearch();
        }
      }, error => {
      })
    }
  }


  public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    console.log(rowData);
    if (rowData.dateAtaAtd != null) {
      cellsStyle.data = rowData.dateAtaAtd;
      cellsStyle.className = CellsStyleClass.CRITICAL_RED;
    } else if (rowData.dateAtaAtd == null && rowData.dateEtaEtd != null) {
      cellsStyle.data = `* ${rowData.dateEtaEtd}`;
    } else if (rowData.dateAtaAtd == null && rowData.dateEtaEtd == null) {
      if (rowData.dayChangeIndicator > 0) {
        cellsStyle.data = `+ ${rowData.dateStaStd}`;
      } else if (rowData.dayChangeIndicator < 0) {
        cellsStyle.data = `- ${rowData.dateStaStd}`;
      } else {
        cellsStyle.data = rowData.dateStaStd;
      }
    }
    return cellsStyle;
  };


  private rowCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.fltStatus == 'CANCELLED') {
      cellsStyle.className = CellsStyleClass.WARNING_YELLOW;
      (this.flightPouchform.get(["flightPouchHandleDetaillList", row]) as NgcFormGroup).get("selectCheck").disable();
    }
    return cellsStyle;
  };
}
