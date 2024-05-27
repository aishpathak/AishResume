import { Subscription } from 'rxjs';
// NGC framework imports
import {
  NgcFormGroup,
  NgcFormArray,
  NgcApplication,
  NgcWindowComponent,
  NgcDropDownComponent,
  NgcButtonComponent, NgcInputComponent,
  NgcPage,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  PageConfiguration,
  NgcReportComponent,
  NgcLOVComponent,
  NgcUtility
} from "ngc-framework";

import {
  Component,
  NgZone,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ViewChild, HostListener, Input, Output, EventEmitter, TemplateRef
} from "@angular/core";

import { NgcFormControl } from "ngc-framework";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule, Validators } from '@angular/forms';
import { CustomACESService } from '../customs.service';
import { CustomsHouseSearchModel } from '../customs.sharedmodel';


@Component({
  selector: 'app-submit-reconciliation-message',
  templateUrl: './submit-reconciliation-message.component.html',
  styleUrls: ['./submit-reconciliation-message.component.scss']
})
export class SubmitReconciliationMessageComponent extends NgcPage implements OnInit {
  forwardedData: any;
  data: any;
  resp: any;
  lstFlag: boolean;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private customsService: CustomACESService) {
    super(appZone, appElement, appContainerElement);
  }
  private searchRecDetailForm: NgcFormGroup = new NgcFormGroup({
    recHeaderId: new NgcFormControl()
  });

  private RecDetailForm: NgcFormGroup = new NgcFormGroup({
    recHeaderId: new NgcFormControl(),
    recData: new NgcFormGroup({
      status: new NgcFormControl(),
      uid: new NgcFormControl(),
      controlDate: new NgcFormControl(),
      versionNo: new NgcFormControl(),
      messageType: new NgcFormControl(),
      recDetailList: new NgcFormArray([
        new NgcFormGroup({
          invPiecesWeight: new NgcFormControl()
        })
      ])
    })
  });
  ngOnInit() {
    super.ngOnInit();
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData) {
      this.data = this.forwardedData;
      this.searchRecDetailForm.patchValue(this.data);
      console.log(this.searchRecDetailForm.value);
      this.OnSearch();
    }
  }
  OnSearch() {
    let request = <NgcFormGroup>this.searchRecDetailForm.getRawValue();
    this.customsService.fetchRecData(request).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data.data;
      this.RecDetailForm.get('recData').patchValue(data.data);
      let appendPiecesWeight = this.RecDetailForm.get('recData').get('recDetailList').value;
      if (appendPiecesWeight != null) {
        appendPiecesWeight.forEach(element => {
          //Concatinating inv Piece and Weight
          if (element.pieces != null && element.weight != null) {
            element.invPiecesWeight = element.pieces + "/" + element.weight.toFixed(1);
          }
        })
      }
      //checking for LST message Type
      if (this.RecDetailForm.get('recData').get('messageType').value == 'LST') {
        this.lstFlag = true;
      }
      else {
        this.lstFlag = false;
      }
    });
  }

  //Methos for navigating to submit-reconciliation
  public onBack(event) {
    let transferData = this.RecDetailForm.get('recData').value
    let date = this.RecDetailForm.controls.recData.get('controlDate').value
    transferData.controlDate = date;
    this.navigateTo(this.router, '/customs/submitreconciliation', transferData);
  }

  //Method for adding serial Number
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  //Method for navigating to reconciliation history screen
  openReconciliationHistory() {
    var dataToSend = {
      recHeaderId: this.RecDetailForm.controls.recData.get('recHeaderId').value
    }
    this.navigateTo(this.router, '/customs/submitreconciliationhistory', dataToSend);
  }

  //Method for navigating to reconciliation error screen
  openReconciliationError() {
    var dataToSend = {
      recHeaderId: this.RecDetailForm.controls.recData.get('recHeaderId').value,
      searchFlag: true
    }
    this.navigateTo(this.router, '/customs/submitreconciliationerror', dataToSend);
  }
}
