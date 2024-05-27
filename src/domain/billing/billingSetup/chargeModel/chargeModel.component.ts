import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../../billing.service';
import { NgcFormControl } from 'ngc-framework';
import {
  Component, OnInit, NgZone, ElementRef,
  ViewContainerRef, ViewChild
} from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration
} from 'ngc-framework';

import { SearchChargeCode, ChargeModel, chargeModelInfo, Charge } from '../../billing.sharedmodel';

@Component({
  selector: 'app-chargeModel',
  templateUrl: './chargeModel.component.html',
  styleUrls: ['./chargeModel.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ChargeModelComponent extends NgcPage {
  
  hasReadPermission: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private billingService: BillingService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  private chargeModelForm: NgcFormGroup = new NgcFormGroup({
    chargeModelInfo: new NgcFormArray([]),
    charges: new NgcFormGroup({
      effectiveDate: new NgcFormControl(),
      endDate: new NgcFormControl(),
      effectiveDateParameter: new NgcFormControl(),
      duration: new NgcFormControl(),
      exempt: new NgcFormControl(),
      exemptInCaseOfHoliday: new NgcFormControl(),
      chargeAmountLeastCount: new NgcFormControl(),
      exemptWeekendHoliday1: new NgcFormControl(),
      exemptWeekendHoliday2: new NgcFormControl(),
      exemptBankHoliday: new NgcFormControl(),
      exemptPublicHoliday: new NgcFormControl(),
      exemptSpecialHoliday: new NgcFormControl(),
      bufferHours: new NgcFormControl(),
      quantityAttribute1: new NgcFormControl(),
      quantityAttribute2: new NgcFormControl(),
      rateType: new NgcFormControl(),
      rateDeterminant: new NgcFormControl(),
      chargeApplicant1: new NgcFormControl(),
      chargeApplicant2: new NgcFormControl(),
      chargeApplicant3: new NgcFormControl(),
      holidayExemptModifier: new NgcFormControl(),
      chargeRates: new NgcFormArray([]),
      minAmount: new NgcFormControl(),
      maxAmount: new NgcFormControl(),
      ignoreExemptionBeyond: new NgcFormControl()
    }),
  });

  @ViewChild('copyModelWindow') copyModelWindow: NgcWindowComponent;
  add: boolean;
  chargeFactorData: any;
  response: any;
  flagCRUD = 'R';
  copyModel: any;
  modelArray: any;
  y: any;
  drop: any;
  deleteFlag: any = false;
  primaryWeekendDay: any;
  secondaryWeekendDay: any;
  firstTimeFlag: boolean = true;
  isExpired: boolean = false;

  ngOnInit() {
    super.ngOnInit();
    this.add = false;
    this.chargeFactorData = this.getNavigateData(this.activatedRoute);
    this.drop = this.createSourceParameter(this.chargeFactorData.billingChargecodeId);
    this.onSearch();
  }

  onSearch() {
    
    this.hasReadPermission = NgcUtility.hasReadPermission('MAINTAIN_CHARGE_CODE');

    let search = new ChargeModel();
    search.chargeModelFactorId = this.chargeFactorData.chargeParameters[0].chargeModelFactorId;
    search.effectiveDate = new Date();
    search.rateType = 'RT';
    search.rateDeterminant = 'RD'
    search.chargeApplicant1 = 'CA1';
    this.billingService.searchChargeModel(search).subscribe(data => {
      let resp = data.data;
      this.response = resp;
      this.flagCRUD = 'R';

      if (resp) {
        if (this.firstTimeFlag) {
          this.response.chargeModelInfo.forEach((value, index) => {
            if (value.status == 'ACTIVE') {
              this.onEditLinkClick(null, index);
              this.firstTimeFlag = false;
            }
          });
        }

        this.resetFormMessages();
        let index = 0;
        let chargeModelValue = resp.charges[0];
        if (chargeModelValue.durationFromAttribute1 && chargeModelValue.durationFromAttribute2) {
          this.chargeModelForm.get('charges').get('duration').enable();
          this.chargeModelForm.get('charges').get('exempt').enable();
          this.chargeModelForm.get('charges').get('bufferHours').enable();
          this.chargeModelForm.get('charges').get('ignoreExemptionBeyond').enable();
        } else {
          this.chargeModelForm.get('charges').get('duration').disable();
          this.chargeModelForm.get('charges').get('exempt').disable();
          this.chargeModelForm.get('charges').get('bufferHours').disable();
          this.chargeModelForm.get('charges').get('ignoreExemptionBeyond').disable();
        }
        if (chargeModelValue.quantityModifier1) {
          this.chargeModelForm.get('charges').get('quantityAttribute1').enable();
        } else {
          this.chargeModelForm.get('charges').get('quantityAttribute1').disable();
        }
        if (chargeModelValue.quantityModifier2) {
          this.chargeModelForm.get('charges').get('quantityAttribute2').enable();
        } else {
          this.chargeModelForm.get('charges').get('quantityAttribute2').disable();
        }
        this.primaryWeekendDay = chargeModelValue.exemptWeekendHoliday1Day;
        this.secondaryWeekendDay = chargeModelValue.exemptWeekendHoliday2Day;
        this.chargeModelForm.get('chargeModelInfo').patchValue(resp.chargeModelInfo);
      } else {
        this.showErrorStatus('billing.error.no.record.found');
      }
    }, error => {
      this.showErrorStatus('g.server.down');
    });
  }

  onAdd() {
    (<NgcFormControl>this.chargeModelForm.get('charges').get('effectiveDate')).enable();
    this.add = true;
    let x = new Array();
    this.chargeModelForm.get('charges').reset();
    this.chargeModelForm.get('charges').get('effectiveDate').patchValue(new Date());
    this.chargeModelForm.get('charges').get('chargeRates').patchValue(new Array());
    this.chargeModelForm.get('charges').get('effectiveDateParameter').patchValue(this.response.charges[0].effectiveDateParameter);
    this.flagCRUD = 'C';
    if (this.chargeModelForm.get('charges').get('chargeRates').value.length == 0) {
      this.addRateModel();
    }
  }

  addRateModel() {
    let length = this.chargeModelForm.getRawValue().charges.chargeRates.length;
    let startValue: any;
    if (length) {
      startValue = this.chargeModelForm.get('charges').get(['chargeRates', length - 1, 'end']).value;
    } else {
      startValue = 0;
    }
    (<NgcFormArray>this.chargeModelForm.get('charges').get('chargeRates')).addValue([
      {
        start: startValue,
        end: null,
        fixCharge: null,
        stepValue: null,
        rate: null,
        minValue: null,
        maxValue: null,
        thresholdMin: null,
        thresholdMax: null
      }
    ])
    this.chargeModelForm.get('charges').get('chargeAmountLeastCount').patchValue('0.01');
  }

  onEditLinkClick(item, index) {
    this.add = true;


    if (item != null) {
      if (item.get('status').value == 'EXPIRED') {
        this.isExpired = true;
      } else {
        this.isExpired = false;
      }
    }
    this.chargeModelForm.get('charges').patchValue(this.response.charges[index]);
    this.flagCRUD = 'U';
    (<NgcFormControl>this.chargeModelForm.get('charges').get('effectiveDate')).disable();
    if (this.chargeModelForm.get('charges').get('chargeRates').value.length == 0) {
      this.addRateModel();
    }
  }

  onSave() {
    if (this.add || this.deleteFlag) {
      let req = this.chargeModelForm.getRawValue();
      let x = req.charges;
      req.charges = new Array();
      x.chargeModelFactorId = this.chargeFactorData.chargeParameters[0].chargeModelFactorId;
      x.flagCRUD = this.flagCRUD;
      req.charges.push(x);
      req.charges[0].chargeCode = this.chargeFactorData.chargeCodeName;
      this.billingService.saveChargeModel(req).subscribe(data => {
        let resp = data.data;
        if (!this.showResponseErrorMessages(data)) {
          this.resetFormMessages();
          this.add = false;
          this.deleteFlag = false;
          this.showSuccessStatus('billing.success.charge.model');
          this.onSearch();
        }
      }, error => {
        this.showErrorStatus('g.server.down');
      });
    }
  }

  onDeleteLinkClick(item, index) {
    (<NgcFormArray>this.chargeModelForm.get('charges').get('chargeRates')).markAsDeletedAt(index);
  }

  onDeleteLink(item, index) {
    (<NgcFormArray>this.chargeModelForm.get('chargeModelInfo')).markAsDeletedAt(index);
    this.deleteFlag = true;
  }

  onCopyModel() {
    (<NgcFormControl>this.chargeModelForm.get('charges').get('effectiveDate')).enable();
    this.copyModel = new Array();
    let z = new SearchChargeCode();
    z.chargeCodeName = this.chargeFactorData.billingChargecodeId;
    this.billingService.searchCopyChargeModel(z).subscribe(data => {
      let resp = data.data;
      if (resp.length) {
        this.copyModel = resp;
        this.copyModelWindow.open();
      } else {
        this.copyModelWindow.close();
        this.showErrorStatus('billing.error.no.model.exists');
      }
    }, error => {
      this.showErrorStatus('g.server.down');
    });
  }
  onLinkClick(item, index) {
    this.flagCRUD = 'C';
    this.add = true;
    this.chargeModelForm.get('charges').patchValue(this.copyModel[index]);
    this.copyModelWindow.close();
    if (this.chargeModelForm.get('charges').get('chargeRates').value.length == 0) {
      this.addRateModel();
    }
  }

  onCancel() {
    this.navigateBack(this.chargeFactorData);
  }
}
