import { Component, ElementRef, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage } from 'ngc-framework';
import { ExportService } from '../export.service';

@Component({
  selector: 'app-fwb-fhl-discrepancy',
  templateUrl: './fwb-fhl-discrepancy.component.html',
  styleUrls: ['./fwb-fhl-discrepancy.component.scss']
})
export class FwbFhlDiscrepancyComponent extends NgcPage implements OnInit {

  displayFlag: boolean = false;
  flightIdforDropdown: any;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private fwbFhlDiscrepancyService: ExportService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.fwbFhlDiscrepancyForm.get('selectSegment').valueChanges.subscribe(changedValue => {
      if (this.fwbFhlDiscrepancyForm !== undefined && this.fwbFhlDiscrepancyForm !== null) {
        this.fwbFhlDiscrepancyForm.get(['flightOffPoint']).patchValue(changedValue);
      }
    });

  }


  fwbFhlDiscrepancyForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl('', Validators.required),
    flightDate: new NgcFormControl(new Date(), Validators.required),
    flightId: new NgcFormControl(''),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    status: new NgcFormControl(),
    segment: new NgcFormControl(),
    manifestControl: new NgcFormControl(),
    selectSegment: new NgcFormControl('FULL'),
    shipmentStatus: new NgcFormControl('ALL'),
    consol: new NgcFormControl(),
    pieceOrWeightdiscrepancy: new NgcFormControl(),
    eawb: new NgcFormControl(),
    nonEawb: new NgcFormControl(),
    singleProcessPrint: new NgcFormControl(),
    flightOffPoint: new NgcFormControl(),


    fwbFhlDiscrepancyList: new NgcFormArray([
      new NgcFormGroup({
        slNumber: new NgcFormControl(),
        awbNumber: new NgcFormControl(),
        hm: new NgcFormControl(),
        org: new NgcFormControl(),
        desNumber: new NgcFormControl(),
        natureOfGoods: new NgcFormControl(),
        shippingAgent: new NgcFormControl(),
        eawb: new NgcFormControl(),
        fwbReceived: new NgcFormControl(),
        originalFwbDiscrepancy: new NgcFormControl(),
        amendedFwbReceived: new NgcFormControl(),
        fwbPieces: new NgcFormControl(),
        consolIndicator: new NgcFormControl(),
        readyToLoad: new NgcFormControl(),
        noOfFHLReceived: new NgcFormControl(),
        sumOfFHLPieces: new NgcFormControl(),
        completeHWB: new NgcFormControl(),
        singleProcessPrint: new NgcFormControl(),
        offPoint: new NgcFormControl(),
        boardPoint: new NgcFormControl(),
        mawbPieces: new NgcFormControl(),
        mawbWeight: new NgcFormControl(),
      })
    ])
  });

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }


  cellsRenderer(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  public groupsRenderer(value: string | number, rowData: any, level: any): string {
    return rowData.data.boardPoint + ' - ' + value;
  }

  clear(event): void {
    this.fwbFhlDiscrepancyForm.reset();
    this.resetFormMessages();
    this.displayFlag = false;
  }

  onBack(event) {
    this.navigateBack(this.fwbFhlDiscrepancyForm.getRawValue());
  }

  search() {
    this.fwbFhlDiscrepancyForm.validate();
    if (this.fwbFhlDiscrepancyForm.invalid) {
      return;
    } else {
      const request = this.fwbFhlDiscrepancyForm.getRawValue();
      this.fwbFhlDiscrepancyService.searchFWBFHLDiscrepancy(request).subscribe(
        response => {
          if (response.messageList !== null && response.messageList.length > 0) {
            // this.showErrorStatus(response.messageList[0].message);
            if (response.messageList[0].message != null
              && response.messageList[0].message != '') {
              this.showErrorStatus(response.messageList[0].message);
            } else {
              this.showErrorStatus(response.messageList[0].code);
            }
            this.displayFlag = false;
          }
          else {
            if (response.data === null) {
              this.showErrorStatus('export.no.records.available');
              (<NgcFormArray>this.fwbFhlDiscrepancyForm.controls['fwbFhlDiscrepancyList']).resetValue([]);
            } else {
              this.fwbFhlDiscrepancyForm.get(['fwbFhlDiscrepancyList']).patchValue(response.data["responseList"]);
              this.fwbFhlDiscrepancyForm.get(['status']).patchValue(response.data["status"]);
              this.fwbFhlDiscrepancyForm.get(['segment']).patchValue(response.data["segment"]);
              this.fwbFhlDiscrepancyForm.get(['flightDate']).patchValue(response.data["flightDate"]);
              this.fwbFhlDiscrepancyForm.get(['flightKey']).patchValue(response.data["flightKey"]);
              this.fwbFhlDiscrepancyForm.get(['std']).patchValue(response.data["std"]);
              this.fwbFhlDiscrepancyForm.get(['etd']).patchValue(response.data["etd"]);
              this.fwbFhlDiscrepancyForm.get(['manifestControl']).patchValue(response.data["manifestControl"]);
              this.flightIdforDropdown = this.createSourceParameter(this.fwbFhlDiscrepancyForm.get('flightKey').value, this.fwbFhlDiscrepancyForm.get('flightDate').value);

              this.clearErrorList();
            }
            this.displayFlag = true;
          }
        },
        error => {
          this.displayFlag = false;
          this.showErrorStatus(error);
        })
    }
  }

}