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
  selector: 'app-submit-reconciliation-history',
  templateUrl: './submit-reconciliation-history.component.html',
  styleUrls: ['./submit-reconciliation-history.component.scss']
})
export class SubmitReconciliationHistoryComponent extends NgcPage implements OnInit {
  forwardedData: any;
  data: any;
  resp: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private customsService: CustomACESService) {
    super(appZone, appElement, appContainerElement);
  }
  private searchRecDetailForm: NgcFormGroup = new NgcFormGroup({
    recHeaderId: new NgcFormControl()
  });

  private RecHistoryForm: NgcFormGroup = new NgcFormGroup({
    recHeaderId: new NgcFormControl(),
    recData: new NgcFormGroup({
      status: new NgcFormControl(),
      requestId: new NgcFormControl(),
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
      this.RecHistoryForm.get('recData').patchValue(data.data);
      let appendPiecesWeight = this.RecHistoryForm.get('recData').get('recDetailList').value;
      if (appendPiecesWeight != null) {
        appendPiecesWeight.forEach(element => {
          //Concatinating inv Piece and Weight
          if (element.pieces != null && element.weight != null) {
            element.invPiecesWeight = element.pieces + "/" + element.weight.toFixed(1);
          }
        })
      }
    });
  }

  //Method to navigate back to submit reconciliation message detail screen
  public onBack(event) {
    let transferData = this.RecHistoryForm.get('recData').value
    let id = this.RecHistoryForm.controls.recData.get('recHeaderId').value
    transferData.recHeaderId = id;
    this.navigateTo(this.router, '/customs/submitreconciliationmessage', transferData);
  }

  //Method to generate serial no.
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }
}
