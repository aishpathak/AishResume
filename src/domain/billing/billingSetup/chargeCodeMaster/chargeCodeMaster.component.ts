import { Router, ActivatedRoute } from '@angular/router';
import { BillingService } from '../../billing.service';
import { NgcFormControl } from 'ngc-framework';
import { SearchChargeCode, ChargeCode, Charge } from '../../billing.sharedmodel';
import { Validators } from '@angular/forms';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, CellsRendererStyle,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration
} from 'ngc-framework';

@Component({
  selector: 'app-chargeCodeMaster',
  templateUrl: './chargeCodeMaster.component.html',
  styleUrls: ['./chargeCodeMaster.component.scss']
})

@PageConfiguration({
  trackInit: true
})

export class ChargeCodeMasterComponent extends NgcPage {

  ChargeCodeData: any;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private billingService: BillingService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  private chargeCodeForm: NgcFormGroup = new NgcFormGroup({
    codeName: new NgcFormControl(),
    chargeCodes: new NgcFormArray([]),
  });

  x: any;
  showTable = false;
  flagCRUD: any;
  navigateData: any;
  ngOnInit() {
    super.ngOnInit();
    this.navigateData = this.getNavigateData(this.activatedRoute);
    if (this.navigateData && this.navigateData.codeName) {
      this.chargeCodeForm.get('codeName').patchValue(this.navigateData.codeName);
      this.getChargeCodeDetails();
    } else {
      this.getAllChargeCodes();
    }
  }

  cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    cellsStyle.data = row + 1;
    return cellsStyle;
  }

  getAllChargeCodes() {
    let searchParam = new SearchChargeCode();
    this.billingService.searchAllChargeCodes(searchParam).subscribe(data => {
      let resp: any = data.data;
      this.resetFormMessages();
      if (resp.length) {
        this.chargeCodeForm.get('chargeCodes').patchValue(resp);
        this.showTable = true;
        this.focusToFirstInput();
      } else {
        this.showErrorStatus('billing.error.nocharge');
      }
    });
  }

  getChargeCodeDetails() {
    let searchParam = new SearchChargeCode();
    searchParam.chargeCodeDescription = this.chargeCodeForm.get('codeName').value;
    if (searchParam.chargeCodeDescription) {
      this.billingService.searchChargeCode(searchParam).subscribe(data => {
        let resp: any = data.data;
        let respArray = new Array();
        if (resp.length) {
          this.focusToFirstInput();
          respArray = resp;
          this.resetFormMessages();
          this.chargeCodeForm.get('chargeCodes').patchValue(respArray);
          this.showTable = true;
        } else {
          this.showTable = false;
          this.showErrorStatus('billing.error.nomatching.record');
        }
      }, error => {
        this.showTable = false;
        //this.showErrorStatus(error.messageList[0].message);
        this.showErrorStatus(error.messageList.message);


      });
    } else {
      this.getAllChargeCodes();
      this.showTable = true;
    }
  }

  onSearch() {
    this.getChargeCodeDetails();
  }

  onEdit(index, codeName) {
    let req = new Charge();
    req.flagCRUD = 'U';
    req.chargeCode = this.chargeCodeForm.get(['chargeCodes', index, 'chargeCodeName']).value;
    req.codeName = codeName;
    this.navigateTo(this.router, '/billing/billingSetup/maintainChargeCode', req);
  }

  onAdd() {
    let req = new Charge();
    req.flagCRUD = 'C';
    this.navigateTo(this.router, '/billing/billingSetup/maintainChargeCode', req);
  }

  onLinkClick(item) {
    if (item.column == '3') {
      this.onEdit(item.record.NGC_ROW_ID, this.chargeCodeForm.get('codeName').value);
    }
  }

  onClear() {
    this.showTable = false;
    this.chargeCodeForm.reset();
    this.getAllChargeCodes();
  }
  backToHome(event) {
    this.router.navigate(['']);
  }
}
