// Angular
import { Component, NgZone, ElementRef, ViewContainerRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
// Application
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcButtonComponent, PageConfiguration } from 'ngc-framework';
// ULD Stock Level
import { UldService } from '../uld.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UldStockLevelRequest, UldStockLevelResponse } from '../uld.shared';

@Component({
  selector: 'app-uldstocklevel',
  templateUrl: './uldstocklevel.component.html',
  styleUrls: ['./uldstocklevel.component.scss']
})
/**
 * Uld Stock Level Page
 */
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class UldstocklevelComponent extends NgcPage {

  @ViewChild('description') description: any;
  @ViewChild('searchbutton') searchbutton: NgcButtonComponent;
  // ngc form input and output controls
  private stocklevelform: NgcFormGroup = new NgcFormGroup({
    carrierCodeDisplay: new NgcFormControl(),
    carrierName: new NgcFormControl(),
    StockType: new NgcFormControl(),
    lov: new NgcFormControl(null, [Validators.pattern('[A-Z,0-9]{2,3}')]),
    stockLevelDisplay: new NgcFormControl(),
    countTotalUlds: new NgcFormControl(),
    countOwnerUlds: new NgcFormControl(),
    countForeignUlds: new NgcFormControl(),
    resultList: new NgcFormArray(
      [
        new NgcFormGroup({
          uldTypeCode: new NgcFormControl(),
          uldTypeDesc: new NgcFormControl(),
          minUld: new NgcFormControl(),
          maxUld: new NgcFormControl(),
          ownerUlds: new NgcFormControl(),
          foreignUlds: new NgcFormControl(),
          balanceUld: new NgcFormControl()
        })
      ]
    )
  });
  /**
   * Initialize
   *
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router,
    private uldService: UldService) {
    super(appZone, appElement, appContainerElement);
    // FIXME Complete functionId implimentation
    // this.functionId = 'STOCK_ULD';
  }
  /**
    * parameters used to request data
    *
    * @param tableFlag to display data when true
    * @param uldstockDetails to store response data
  */
  onSaveClick = false;
  tableFlag: any = false;
  uldstockDetails: any;
  errorMessage: any;
  source: any = {};
  uldstockData: any[];
  uldstockDataList: any[];
  errors: any[];
  TotalUld: number;
  OwnerUld: number;
  ForeignUld: number;

  /**
  * On Initialization
  */
  ngOnInit() {
    this.stocklevelform.get('StockType').setValue('All Stock');
  }
  /** To Fetch  Uld Stock Level Details
    * input--> carrier and one of selected value of dropdown
    * Returns-->List of  Uld Stock Level
    */
  public onSearch() {
    this.tableFlag = false;
    const uldstocklevelrequest: UldStockLevelRequest = new UldStockLevelRequest();
    if (this.stocklevelform.get('lov').value) {
      uldstocklevelrequest.uldCarrier = this.stocklevelform.get('lov').value;
      uldstocklevelrequest.stockLevel = this.stocklevelform.get('StockType').value;
      this.getResponse(uldstocklevelrequest);
    }
  }
  /**
   * To store response from service layer
   * Display the same on UI
   *
   * @param uldstocklevelrequest
   */
  public getResponse(uldstocklevelrequest: UldStockLevelRequest) {
    this.searchbutton.disabled = true;
    this.uldService.getUldStocklevelDetails(uldstocklevelrequest).subscribe(data => {
      this.refreshFormMessages(data);
      this.searchbutton.disabled = false;
      this.uldstockDetails = data;
      this.uldstockDataList = this.uldstockDetails.data.uldStockLevelList;
      this.errors = this.uldstockDetails.messageList;
      this.TotalUld = this.uldstockDetails.data.countTotalUlds;
      this.OwnerUld = this.uldstockDetails.data.countOwnerUlds;
      this.ForeignUld = this.uldstockDetails.data.countForeignUlds;

      this.errors = this.uldstockDetails.messageList;
      if (this.uldstockData == null) {
        // this.showErrorStatus(this.errors[0].message);
      }
      if (this.uldstockDataList.length > 0) {
        (<NgcFormArray>this.stocklevelform.controls['resultList']).patchValue(this.uldstockDataList);
        this.stocklevelform.controls['countTotalUlds'].patchValue(this.TotalUld);
        this.stocklevelform.controls['countOwnerUlds'].patchValue(this.OwnerUld);
        this.stocklevelform.controls['countForeignUlds'].patchValue(this.ForeignUld);
        this.tableFlag = true;
        this.stocklevelform.get('stockLevelDisplay').setValue(this.stocklevelform.get('StockType').value);
        this.onSaveClick = false;
      } else {
        this.showErrorStatus('uld.no.data.found');
      }
      if (this.errors) {
        this.tableFlag = false;
      }
      this.searchbutton.disabled = false;
    },
      error => {
        this.showErrorStatus('uld.error.while.fetching.uld.stock.slevel.list');
        this.searchbutton.disabled = false;
      });
  }
  /**
   * To use values of LOV
   *
   * @param object
   */
  public onSelect(object) {
    this.stocklevelform.get('carrierCodeDisplay').setValue(object.code);
    this.stocklevelform.get('carrierName').setValue(object.desc);
  }

  onCancel(event) {
    this.navigateTo(this.router, '/', null);
  }
}
