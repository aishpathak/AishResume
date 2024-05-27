
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, CellsRendererStyle, NgcFormArray, NgcWindowComponent, NgcFormControl, PageConfiguration, NgcReportComponent, NgcUtility, NgcCheckBoxComponent } from 'ngc-framework';
import { ImportService } from "../import.service";
import { Validators } from '@angular/forms';
import { DocumentHandOverModel } from "../import.sharedmodel";
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-issueGroupDO',
  templateUrl: './documenthandover.component.html',
  styleUrls: ['./documenthandover.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class DocumenthandoverComponent extends NgcPage implements OnInit {
  displayData: boolean = false;
  displayButton: boolean = false;
  @ViewChild("remarksPopup") private remarksPopup: NgcWindowComponent;
  @ViewChild("docInOutPopup") private docInOutPopup: NgcWindowComponent;
  openRemarkPopup: boolean;
  documentHandoverSaveRequest: any;
  docInTimeLable: boolean = true;
  docOutTimeLable: boolean = true;
  selectflag: boolean = false;
  docHandoverSaveRequest: any;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private importService: ImportService, private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }


  private documenthandoverForm: NgcFormGroup = new NgcFormGroup({
    flightTypeVal: new NgcFormControl('All'),
    domesticInterFlight: new NgcFormControl(),
    flightDateRange: new NgcFormControl(),
    fromDate: new NgcFormControl(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1)),
    toDate: new NgcFormControl(new Date()),
    flightNo: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    flightNoValue: new NgcFormControl(),
    orgDes: new NgcFormControl(),
    orgDesVal: new NgcFormControl(),
    documentStatus: new NgcFormControl(),
    documentStatusVal: new NgcFormControl(),
    flightStatus: new NgcFormControl(),
    flightStatusVal: new NgcFormControl(),
    cargoACType: new NgcFormControl(),
    cargoACTypeVal: new NgcFormControl(),
    flight: new NgcFormControl(),
    docHandOverDetailList: new NgcFormArray(
      [
      ]
    ),
  })
  private returnRemarks: NgcFormGroup = new NgcFormGroup({
    remarks: new NgcFormControl(),
  })
  private docInOut: NgcFormGroup = new NgcFormGroup({
    docInOutRemarks: new NgcFormControl(),
  })


  ngOnInit() {
    let requestData = this.documenthandoverForm.getRawValue();
    requestData.fromDate = new Date().setDate(new Date().getDate() - 1);
  }

  public onSearch() {
    this.displayData = false;
    this.displayButton = false;
    let requestData = this.documenthandoverForm.getRawValue();
    if (requestData != null && requestData.flightTypeVal != null && requestData.fromDate != null && requestData.toDate != null) {
      if (requestData.requestedFrom > requestData.requestedTo) {
        this.showErrorStatus("exp.specialShipment.dateError")
        return
      }
      this.resetFormMessages();
      this.importService.documenthandover(requestData).subscribe(data => {
        console.log(data.data);
        if (!this.showResponseErrorMessages(data)) {
          {
            this.documenthandoverForm.get('docHandOverDetailList').patchValue(data.data.documentHandOverList);
            if (data.data.documentHandOverList.length > 0) {
              this.displayButton = true;
            }
            this.displayData = true;
          }
        }
      });
      // this.displayData = true;
      // return
    } else {
      this.showErrorStatus("imp.doc.mandat.error")
      this.displayData = false
      return
    }

  }
  public onRemarks() {
    this.returnRemarks.reset();
    let recordSelected: boolean = false;
    let requestData = this.documenthandoverForm.getRawValue();
    this.docHandoverSaveRequest = this.documenthandoverForm.getRawValue();
    let dochandOverList = this.docHandoverSaveRequest.docHandOverDetailList;
    dochandOverList.forEach(element => {
      if (element.selectCheck) {
        recordSelected = true;
      }

    });
    if (!recordSelected) {
      this.showErrorStatus('imp.doc.mandat.select.error');
      return;
    }
    if (requestData.docHandOverDetailList.length > 0) {
      this.remarksPopup.open();
    } else {
      this.showInfoStatus('import.info105');
    }

  }
  public onDocInOut() {
    this.docInOut.reset();
    this.docOutTimeLable = false;
    this.docInTimeLable = false;
    let recordSelected: boolean = false;
    this.docHandoverSaveRequest = this.documenthandoverForm.getRawValue();
    let groupDetailList = this.docHandoverSaveRequest.docHandOverDetailList;
    if (groupDetailList.length < 1) {
      this.showErrorStatus("imp.doc.mandat.select.error");
      return;
    }
    groupDetailList.forEach(element => {
      if (element.selectCheck) {
        recordSelected = true;
        if (element.flightType == 'Dep') {
          this.docOutTimeLable = true;
        }
        if (element.flightType == 'Arr') {
          this.docInTimeLable = true;
        }

      }

    });
    if (!recordSelected) {
      this.showErrorStatus("imp.doc.mandat.select.error");
      return;
    }

    if (this.docInTimeLable && this.docOutTimeLable) {
      this.showErrorStatus("message.log.error.message");
      return;
    }
    if (this.docInTimeLable || this.docOutTimeLable) {
      this.docInOutPopup.open();
    }
  }
  public remarkSave() {

    this.documentHandoverSaveRequest = this.documenthandoverForm.getRawValue();
    let documenthHandoverDetailList = this.documentHandoverSaveRequest.docHandOverDetailList;
    let documentHandoverList: Array<DocumentHandOverModel> = new Array<DocumentHandOverModel>();

    documenthHandoverDetailList.forEach(element => {
      if (element.selectCheck) {
        let documentHandover: DocumentHandOverModel = new DocumentHandOverModel();
        documentHandover.flightId = element.flightId;
        documentHandover.flightType = element.flightType;
        documentHandover.flightNumber = element.flightNo;
        documentHandover.flightDate = element.flightStaStdDate;
        documentHandover.returnRemarks = this.returnRemarks.get('remarks').value
        documentHandoverList.push(documentHandover);
      }
    });
    if (this.returnRemarks.get('remarks').value == null) {
      this.showErrorStatus('imp.doc.in.out.return.remark');
      return;
    } else {
      this.importService.saveDocHandOverRemark(documentHandoverList).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus('g.completed.successfully');
          this.remarksPopup.close();
          this.displayData = false;
          this.onSearch();

        }
      }, error => {
      })
    }
  }
  public remarkCancel() {
    this.remarksPopup.close();
  }
  public docInOutCancel() {
    this.docInOutPopup.close();
  }
  public docInOutSave() {
    this.documentHandoverSaveRequest = this.documenthandoverForm.getRawValue();
    let documenthHandoverDetailList = this.documentHandoverSaveRequest.docHandOverDetailList;
    let documentHandoverList: Array<DocumentHandOverModel> = new Array<DocumentHandOverModel>();
    documenthHandoverDetailList.forEach(element => {
      if (element.selectCheck) {
        let documentHandover: DocumentHandOverModel = new DocumentHandOverModel();
        documentHandover.flightId = element.flightId;
        documentHandover.flightType = element.flightType;
        documentHandover.flightNumber = element.flightNo;
        documentHandover.flightDate = element.flightStaStdDate;
        documentHandover.docinOutRemarks = this.docInOut.get('docInOutRemarks').value
        documentHandoverList.push(documentHandover);
      }
    });
    if (this.docInOut.get('docInOutRemarks').value == null) {
      this.showErrorStatus('imp.doc.in.out.return.remark');
      return;
    } else {
      this.importService.saveDocInOutTime(documentHandoverList).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus('g.completed.successfully');
          this.docInOutPopup.close();
          this.displayData = false;
          this.onSearch();
        }
      }, error => {
      })
    }
  }


  private rowCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();

    if (rowData.docStatus != 'Pending') {
      (this.documenthandoverForm.get(["docHandOverDetailList", row]) as NgcFormGroup).get("selectCheck").disable();
    }

    return cellsStyle;
  };

}
