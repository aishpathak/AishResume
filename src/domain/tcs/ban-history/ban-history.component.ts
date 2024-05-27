import { Component, ElementRef, Input, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormControl, NgcUtility, NgcFormArray
  , PageConfiguration, CellsRendererStyle, NgcWindowComponent
} from 'ngc-framework';
import { TcsService } from '../tcs.service';

@Component({
  selector: 'app-ban-history',
  templateUrl: './ban-history.component.html',
  styleUrls: ['./ban-history.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class BanHistoryComponent extends NgcPage implements OnInit {

  public popup: boolean = false;
  public isSearch: boolean = false;
  public banHistoryFlag: boolean = false;
  private _vehicleNo: string;
  private _outstandingAmount;
  private _banPeriodFrom;
  private _companyId;
  private _banType;
  private _banReasonDesc: string;
  private _banStatusDesc: string;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private service: TcsService) {
    super(appZone, appElement, appContainerElement);
  }
  public historyForm: NgcFormGroup = new NgcFormGroup({
    banhistory: new NgcFormGroup({
      vehicleNo: new NgcFormControl(),
      companyId: new NgcFormControl(),
      outstandingFine: new NgcFormControl(),
      banType: new NgcFormControl(),
      banReasonDesc: new NgcFormControl(),
      banPeriodFrom: new NgcFormControl(),
      banStatusDesc: new NgcFormControl()
    }),
    banhistoryDetail: new NgcFormArray([])
  });

  @Input('vehicleNo')

  public set vehicleNo(vehicleNo: string) {
    if (this._vehicleNo != vehicleNo) {
      this._vehicleNo = vehicleNo;
      //
      this.historyForm.get('banhistory.vehicleNo').setValue(this._vehicleNo);
      this.getHistoryDetails();
    }
    this.popup = true;
  }

  /**
   * Gets Vehicle Number.
   */
  public get vehicleNo(): string {
    return this._vehicleNo;
  }

  /**
    * Ban Reason.
    */

  @Input('banReasonDesc')
  public set banReasonDesc(banReasonDesc: string) {
    if (this._banReasonDesc != banReasonDesc) {
      this._banReasonDesc = banReasonDesc;
      //
      this.historyForm.get('banhistory.banReasonDesc').setValue(this._banReasonDesc);
    }
    this.popup = true;
  }

  /**
   * Ban Reason.
   */
  public get banReasonDesc(): string {
    return this._banReasonDesc;
  }

  @Input('banStatusDesc')
  public set banStatusDesc(banStatusDesc: string) {
    if (this._banStatusDesc != banStatusDesc) {
      this._banStatusDesc = banStatusDesc;
      //
      this.historyForm.get('banhistory.banStatusDesc').setValue(this._banStatusDesc);
    }
    this.popup = true;
  }

  /**
   * Ban Reason.
   */
  public get banStatusDesc(): string {
    return this._banStatusDesc;
  }

  /**
  * Company Name.
  */

  @Input('companyId')
  public set companyId(companyId: string) {
    if (this._companyId != companyId) {
      this._companyId = companyId;
      //
      this.historyForm.get('banhistory.companyId').setValue(this._companyId);
    }
    this.popup = true;
  }

  /**
   * Gets Company ID.
   */
  public get companyId(): string {
    return this._companyId;
  }

  /**
* Ban Type.
*/

  @Input('banType')
  public set banType(banType: string) {
    if (this._banType != banType) {
      this._banType = banType;
      //
      this.historyForm.get('banhistory.banType').setValue(this._banType);
    }
    this.popup = true;
  }

  /**
   * Gets Company ID.
   */
  public get banType(): string {
    return this._banType;
  }

  /**
   * Open
   */
  public open(window: NgcWindowComponent) {
    if (window) {
      window.open();
    }
  }

  /**
   * On Cancel
   * 
   * @param window Window
   */
  public cancel(window: NgcWindowComponent) {
    if (window) {
      window.close();
    }
  }

  /**
  * Outstanding Amount.
  */

  @Input('outstandingAmount')
  public set outstandingAmount(outstandingAmount: string) {
    if (this._outstandingAmount != outstandingAmount) {
      this._outstandingAmount = outstandingAmount;
      //
      this.historyForm.get('banhistory.outstandingFine').setValue(this._outstandingAmount);
    }
    this.popup = true;
  }

  /**
   * Gets Outstanding Amount.
   */
  public get outstandingAmount(): string {
    return this._outstandingAmount;
  }

  /**
 * Ban Status.
 */

  @Input('banPeriodFrom')
  public set banPeriodFrom(banPeriodFrom: string) {
    if (this._banPeriodFrom != banPeriodFrom) {
      this._banPeriodFrom = banPeriodFrom;
      //
      this.historyForm.get('banhistory.banPeriodFrom').setValue(this._banPeriodFrom);
    }
    this.popup = true;
  }

  /**
   * Gets Ban Status.
   */
  public get banPeriodFrom(): string {
    return this._banPeriodFrom;
  }

  ngOnChanges() {
    this.getHistoryDetails();
  }

  getHistoryDetails() {
    let request = {
      vehicleNo: this._vehicleNo
    }
    this.service.getBanTruckHistoryInfo(request).subscribe((response) => {
      if (response && !this.showResponseErrorMessages(response) && response.data.length > 0) {
        this.banHistoryFlag = true;
        response.data.map(element => {
          let from = NgcUtility.getDateTimeAsString(element['banPeriodFrom']);
          let to = NgcUtility.getDateTimeAsString(element['banPeriodTill']);
          const banperiodDateRange = (`${from} - ${to}`);
          const obj = Object.assign(element, { banperiodDateRange: banperiodDateRange });
        });
        this.historyForm.get('banhistoryDetail').patchValue(response.data);
      }
    });
  }

  public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //
    if (rowData) {
      const groupIndex: number = parseInt(rowData.NGC_ROW_ID);
      const group: NgcFormGroup = this.historyForm.get(['banhistoryDetail', groupIndex]) as NgcFormGroup;
      //
      cellsStyle.data = NgcUtility.getDateAsString(group.get('banPeriodFrom').value)
        + '-' + NgcUtility.getDateAsString(group.get('banPeriodTill').value);
    }
    return cellsStyle;
  };
}
