import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, DateTimeKey, NgcButtonComponent, PageConfiguration, NgcReportComponent, NgcUtility, ReportFormat } from 'ngc-framework';
import { UldMovementHistory } from '../uld.shared';
import { UldService } from '../uld.service';
import { Validators, PatternValidator } from '@angular/forms';
// import 'rxjs/add/operator/toPromise';
import { Request } from './../../model/resp';
import { ActivatedRoute, Router } from '@angular/router';

/* constructor for dependency injection */
@Component({
  selector: 'app-uld-movement-history',
  templateUrl: './uld-movement-history.component.html',
  styleUrls: ['./uld-movement-history.component.scss']
})
/* page configuration on page initialization */
@PageConfiguration({
  trackInit: true,
  autoBackNavigation: true,
  restorePageOnBack: true,
  callNgOnInitOnClear: true
})
export class UldMovementHistoryComponent extends NgcPage implements OnInit {
  showMovementData: boolean = false;
  incomingData: any;
  /* this is used for opening of this screen as pop up screen in the capture multiple uld in/out movement screen*/
  @Input('showAsPopup') showAsPopup: boolean;
  private _inputData: any;
  @Input('inputData')
  public set inputData(data: any) {
    this._inputData = data;
    this.uldMovementHistoryform.get('uldTrolleyNumber').patchValue(this._inputData.uldNumberConcat);
    this.uldMovementHistoryform.get('uldFromDate').patchValue(this._inputData.uldFromDate);
    this.uldMovementHistoryform.get('uldToDate').patchValue(this._inputData.uldToDate);
    this.uldMovementHistoryform.get('selectmovement').patchValue(this._inputData.selectmovement);
    this.onSearch();
  }
  @Output() autoSearchAccessoryInfo = new EventEmitter<boolean>();

  @Input('uldMovementHistoryObject') uldMovementHistoryObject;
  @Output()
  responseObject = new EventEmitter();

  /* this is used for opening of this screen as pop up screen in the capture multiple uld in/out movement screen*/
  /* constructor for dependency injection */
  constructor(
    appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router,
    private activatedRoute: ActivatedRoute,
    private uldService: UldService) { super(appZone, appElement, appContainerElement); }

  private uldMovementHistoryform: NgcFormGroup = new NgcFormGroup({
    uldTrolleyNumber: new NgcFormControl(),
    uldFromDate: new NgcFormControl(),
    selectmovement: new NgcFormControl(),
    uldToDate: new NgcFormControl(),
    movements: new NgcFormArray([])
  })
  /* Oninit function */
  ngOnInit() {
    /**To open the screen as pop up in Display ULD/BT
     * When uldMovementHistoryObject is not null or undefined
     * Call the search function after patching the data
     */
    if (!NgcUtility.isBlank(this.uldMovementHistoryObject)) {
      this.uldMovementHistoryform.get('uldTrolleyNumber').patchValue(this.uldMovementHistoryObject);
      this.onSearch();
    }
    super.ngOnInit();
  }
  /* On search : called when search is clicked */
  onSearch() {
    this.resetFormMessages();
    let request = new UldMovementHistory();
    request.uldTrolleyNumber = this.uldMovementHistoryform.get('uldTrolleyNumber').value;
    request.uldFromDate = this.uldMovementHistoryform.get('uldFromDate').value;
    request.uldToDate = this.uldMovementHistoryform.get('uldToDate').value;
    request.movmentTypeList = this.uldMovementHistoryform.get('selectmovement').value;
    this.uldService.getMovementHistory(request).subscribe(res => {
      if (res.data) {
        this.showMovementData = true;
        (<NgcFormArray>this.uldMovementHistoryform.controls['movements']).patchValue(res.data);
        res.data.forEach(element => {
          element.movementDateTime = NgcUtility.toDateFromLocalDate(element.movementDateTime);
          element.flightDate = NgcUtility.toDateFromLocalDate(element.flightDate);

        });
      } else {
        this.refreshFormMessages(res);
        this.showMovementData = false;
      }
    })
  }
  onCancel(event) {
    this.navigateBack(this.incomingData);
  }
}
