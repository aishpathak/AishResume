import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../../billing.service';
import { NgcFormControl } from 'ngc-framework';
import { SearchChargeCode, ChargeParameter, ChargeFactor } from '../../billing.sharedmodel';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration
} from 'ngc-framework';

@Component({
  selector: 'app-factorSetup',
  templateUrl: './factorSetup.component.html',
  styleUrls: ['./factorSetup.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class FactorSetupComponent extends NgcPage {

  hasReadPermission: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private billingService: BillingService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  private chargeFactorForm: NgcFormGroup = new NgcFormGroup({
    chargeCodeName: new NgcFormControl(),
    chargeCodeDescription: new NgcFormControl(),
    chargeFactorName1: new NgcFormControl(),
    chargeFactorName2: new NgcFormControl(),
    chargeFactorName3: new NgcFormControl(),
    chargeFactorName4: new NgcFormControl(),
    chargeParameters: new NgcFormArray([]),
  });

  chargeCodeData: any;
  chargeFactorName1: any;
  chargeFactorName2: any;
  chargeFactorName3: any;
  chargeFactorName4: any;
  response: any;
  index: any;
  nameFlag1: boolean;
  nameFlag2: boolean;
  nameFlag3: boolean;
  nameFlag4: boolean;
  info: string;
  length: any;
  delete = false;
  request: any;

  ngOnInit() {
    super.ngOnInit();
    this.chargeCodeData = this.getNavigateData(this.activatedRoute);
    let search = new SearchChargeCode();
    search.chargeCodeName = this.chargeCodeData.chargeCode;
    this.searchFactor(search);
    this.info = 'billing.info.blank.values';
  }

  searchFactor(search) {
    this.hasReadPermission = NgcUtility.hasReadPermission('MAINTAIN_CHARGE_CODE');
    
    this.billingService.searchChargeFactor(search).subscribe(data => {
      let resp = data.data;
      this.response = resp;
      let index = 1;
      if (resp) {
        resp.chargeParameters.forEach(ele => {
          ele['flagCRUD'] = 'R';
          ele['check'] = false;
        });
        this.length = resp.chargeParameters.length;
        this.resetFormMessages();
        this.chargeFactorForm.patchValue(resp);
      } else {
        this.showErrorStatus('billing.error.charge.factor');
      }
    }, error => {
      this.showErrorStatus(error.messageList[0].error);
    })
  }

  onAddCombo() {
    let chargeParam = this.chargeFactorForm.get('chargeParameters').value;
    let length = chargeParam.length;
    let lastParam = chargeParam[length - 1];
    (<NgcFormArray>this.chargeFactorForm.get('chargeParameters')).addValue([
      {
        check: false,
        chargeFactorValue1: '',
        chargeFactorValue2: '',
        chargeFactorValue3: '',
        chargeFactorValue4: '',
        comboDesc: '',
        matchOrder: ++this.length,
      }
    ]);
  }

  onSave() {
    this.chargeFactorForm.validate();
    this.nameFlag1 = true;
    this.nameFlag2 = true;
    this.nameFlag3 = true;
    this.nameFlag4 = true;
    let value = this.chargeFactorForm.getRawValue();
    value.chargeParameters.forEach(a => {
      a['billingChargecodeId'] = value.billingChargecodeId;
      if (a['chargeFactorValue1'] == null) {
        a.chargeFactorValue1 = '';
      }
      if (a['chargeFactorValue2'] == null) {
        a.chargeFactorValue2 = '';
      }
      if (a['chargeFactorValue3'] == null) {
        a.chargeFactorValue3 = '';
      }
      if (a['chargeFactorValue4'] == null) {
        a.chargeFactorValue4 = '';
      }
    });

    this.billingService.saveChargeFactor(value).subscribe(data => {
      let resp = data.data;
      if (resp) {
        this.delete = false;
        let search = new SearchChargeCode();
        search.chargeCodeName = this.chargeCodeData.chargeCode;
        this.searchFactor(search);
        this.resetFormMessages();
        this.showSuccessStatus('billing.sucess.charge.factor.saved');
      } else {
        this.showErrorStatus(data.messageList[0].message);
      }
    }, error => {
      this.showErrorStatus(error.messageList[0].message);
    });
  }

  onLinkClick(item, index) {
    let req: any;
    req = this.chargeFactorForm.getRawValue();
    req.sourceId1 = this.response.sourceId1;
    req.sourceId2 = this.response.sourceId2;
    req.sourceId3 = this.response.sourceId3;
    req.sourceId4 = this.response.sourceId4;
    req.page1Data = this.chargeCodeData.chargeCode;
    req.chargeCode = req.page1Data;
    req.param = new Array();
    req.param = this.chargeFactorForm.get('chargeParameters').value;
    req.chargeParameters = new Array();
    req.chargeParameters.push(this.chargeFactorForm.get(['chargeParameters', index]).value);
    req.codeName = this.chargeCodeData.codeName;
    this.request = req;
    this.navigateTo(this.router, '/billing/billingSetup/chargeModel', req);
  }

  onDeleteCombo() {
    let y = 0;
    let deleteRow: any = (<NgcFormArray>this.chargeFactorForm.controls["chargeParameters"]).getRawValue();
    if (deleteRow.length > 0) {
      for (let index = deleteRow.length - 1; index >= 0; index--) {
        if (deleteRow[index].check) {
          y++;
          this.delete = true;
          this.length = this.length - 1;
          (<NgcFormControl>this.chargeFactorForm.get(['chargeParameters', index, 'matchOrder'])).setValue(null);
          (<NgcFormArray>this.chargeFactorForm.controls['chargeParameters']).markAsDeletedAt(index);
        }
      }
    }
    if (y == 0) {
      this.showErrorStatus('billing.error.records');
    } else {
      this.resetFormMessages();
      let matchOrderIndex = 1;
      let matchOrder: any = (<NgcFormArray>this.chargeFactorForm.controls["chargeParameters"]).getRawValue();
      for (let i = 0; i < matchOrder.length; i++) {
        if (matchOrder[i].flagCRUD !== 'D') {
          (<NgcFormControl>this.chargeFactorForm.get(['chargeParameters', i, 'matchOrder'])).setValue(matchOrderIndex);
          matchOrderIndex++;
        }
      }
    }
  }
  onUpClick(item, index) {
    let value1 = this.chargeFactorForm.get(['chargeParameters', index]).value;
    let value2 = this.chargeFactorForm.get(['chargeParameters', index - 1]).value;
    let order1 = this.chargeFactorForm.get(['chargeParameters', index, 'matchOrder']).value;
    let order2 = this.chargeFactorForm.get(['chargeParameters', index - 1, 'matchOrder']).value;
    this.chargeFactorForm.get(['chargeParameters', index - 1]).patchValue(value1);
    this.chargeFactorForm.get(['chargeParameters', index]).patchValue(value2);
    this.chargeFactorForm.get(['chargeParameters', index - 1, 'matchOrder']).patchValue(order2);
    this.chargeFactorForm.get(['chargeParameters', index, 'matchOrder']).patchValue(order1);
  }

  onDownClick(item, index) {
    let value1 = this.chargeFactorForm.get(['chargeParameters', index]).value;
    let value2 = this.chargeFactorForm.get(['chargeParameters', index + 1]).value;
    let order1 = this.chargeFactorForm.get(['chargeParameters', index, 'matchOrder']).value;
    let order2 = this.chargeFactorForm.get(['chargeParameters', index + 1, 'matchOrder']).value;
    this.chargeFactorForm.get(['chargeParameters', index + 1]).patchValue(value1);
    this.chargeFactorForm.get(['chargeParameters', index]).patchValue(value2);
    this.chargeFactorForm.get(['chargeParameters', index + 1, 'matchOrder']).patchValue(order2);
    this.chargeFactorForm.get(['chargeParameters', index, 'matchOrder']).patchValue(order1);
  }

  onCancel() {
    this.chargeCodeData.flagCRUD = 'U';
    this.navigateTo(this.router, '/billing/billingSetup/maintainChargeCode', this.chargeCodeData);
  }
}
