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
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration
} from 'ngc-framework';

@Component({
  selector: 'app-charge-code',
  templateUrl: './chargeCode.component.html',
  styleUrls: ['./chargeCode.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
})

export class ChargeCodeComponent extends NgcPage {

  hasReadPermission: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private billingService: BillingService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }
  showScope: boolean = false;

  private chargeCodeForm: NgcFormGroup = new NgcFormGroup({
    codeName: new NgcFormControl(),
    chargeCodes: new NgcFormArray([]),
    billingChargeCodeId: new NgcFormControl(),
    chargeCodeFactorId: new NgcFormControl(),
    chargeCodeOtherParametersId: new NgcFormControl(),
    chargeCodeName: new NgcFormControl(),
    chargeCodeDescription: new NgcFormControl(),
    activeFrom: new NgcFormControl(),
    activeTo: new NgcFormControl(),
    chargeAttachedTo: new NgcFormControl(),
    scope: new NgcFormControl(null),
    defaultPaymentType: new NgcFormControl(),
    salesTaxGroupCode: new NgcFormControl(),
    verifyBeforePost: new NgcFormControl(),
    eventType: new NgcFormControl(),
    processType: new NgcFormControl(),
    effectiveStartDateParameter: new NgcFormControl(),
    behalfOfAirline: new NgcFormControl(),
    billByAirline: new NgcFormControl(),
    chargeFactor1: new NgcFormControl(),
    chargeFactor2: new NgcFormControl(),
    chargeFactor3: new NgcFormControl(),
    chargeFactor4: new NgcFormControl(),
    chargeFactor5: new NgcFormControl(),
    chargeFactor6: new NgcFormControl(),
    durationFromAttribute1: new NgcFormControl(),
    durationFromAttribute2: new NgcFormControl(),
    quantityAttribute1: new NgcFormControl(),
    quantityAttribute2: new NgcFormControl(),
    additionalAttribute1: new NgcFormControl(),
    additionalAttribute2: new NgcFormControl(),
    additionalAttribute3: new NgcFormControl(),
    expression: new NgcFormControl(),
    attachedEvents: new NgcFormArray([]),
    applicabilityCondition: new NgcFormArray([]),
  });

  flag: number = 0;
  process: any = '';
  showTable = false;
  flagCRUD: string = 'R';
  x = 0;
  chargeCodeData: any;
  others: boolean = false;
  sourceId: any = new Array();
  title: any = new Array();
  factorParam: any;
  expressionValue: any = '';
  alphabet: any = '';
  alpha: any = '';
  showNavigationButtons: boolean = false;

  ngOnInit() {
    super.ngOnInit();
    this.chargeCodeData = this.getNavigateData(this.activatedRoute);
    if (this.chargeCodeData.chargeCode) {
      this.showNavigationButtons = true;
    }
    this.showData();
  }

  showData() {
    this.hasReadPermission = NgcUtility.hasReadPermission('MAINTAIN_CHARGE_CODE');
    this.alphabet = '';
    if (this.chargeCodeData && this.chargeCodeData.flagCRUD) {
      this.flagCRUD = this.chargeCodeData.flagCRUD;
    }
    if (this.chargeCodeData && this.chargeCodeData.chargeCode && this.chargeCodeData.flagCRUD == 'U') {
      let searchParam = new SearchChargeCode();
      searchParam.chargeCodeName = this.chargeCodeData.chargeCode;
      this.billingService.searchChargeCode(searchParam).subscribe(data => {
        let resp: any = data.data;
        let a = new Array();
        let charge = new SearchChargeCode();
        if (resp.length) {
          if (resp[0].chargeAttachedTo == 'Shipment' ||
            resp[0].chargeAttachedTo == 'ConsignmentSHCGroup' ||
            resp[0].chargeAttachedTo == 'Consignment' ||
            resp[0].chargeAttachedTo == 'ShipmentSHCGroup' ||
            resp[0].chargeAttachedTo == 'ConsignmentGroupWithoutLDType'
          ) {
            this.showScope = true;
            this.chargeCodeForm.get('scope').setValidators([Validators.required]);
          }
          (<NgcFormControl>this.chargeCodeForm.get('activeFrom')).disable();
          resp[0].attachedEvents.forEach(value => value.select = false);
          resp[0].applicabilityCondition.forEach(value => {
            this.alphabet = this.nextString(this.alphabet);
            value.alphabet = this.alphabet;
            value.select = false;
            if (value.factor != 'OPT') {
              this.retrieveDropDownListRecord(value.factor, 'CHARGE_FACTORS', 'query')
                .subscribe(record => {
                  this.sourceId.push(record.parameter2);
                  this.title.push(record.desc);
                })
            } else {
              this.sourceId.push('OPTIONS');
              this.title.push('OPTIONS');
            }
          });
          this.chargeCodeForm.patchValue(resp[0]);

          this.computeExpression();
        }
      });
    }
  }

  computeExpression() {
    this.expressionValue = '';
    let resp: any = this.chargeCodeForm.getRawValue().applicabilityCondition;
    resp.forEach(value => {
      let space: any = '';
      if (value.correlation) {
        this.expressionValue = this.expressionValue + " " + value.correlation;
      }
      if (value.bracketStart) {
        this.expressionValue = this.expressionValue + " (";
      } else {
        space = ' ';
      }
      this.expressionValue = this.expressionValue + space + value.alphabet;
      if (value.bracketEnd) {
        this.expressionValue = this.expressionValue + ")";
      }
    });
    this.chargeCodeForm.get('expression').patchValue(this.expressionValue);
  }

  nextString(str) {
    if (!str)
      return 'A'

    let tail = ''
    let i = str.length - 1
    let char = str[i]
    while (char === 'Z' && i > 0) {
      i--
      char = str[i]
      tail = 'A' + tail
    }
    if (char === 'Z')
      return 'AA' + tail
    return str.slice(0, i) + String.fromCharCode(char.charCodeAt(0) + 1) + tail
  }

  saveChargeCodeDetails() {
    this.chargeCodeForm.validate();
    if (this.chargeCodeForm.invalid) {
      return;
    }
    let req = this.chargeCodeForm.getRawValue();
    req.flagCRUD = this.flagCRUD;
    if (this.flagCRUD == 'U' || this.flagCRUD == 'C') {
      this.billingService.saveChargeCode(req).subscribe(data => {
        let resp = data.data;
        if (!this.showResponseErrorMessages(data)) {
          this.chargeCodeData.flagCRUD = 'U';
          this.showMessage('bill.chargeCodeFactorSetupNotify');
          this.chargeCodeData.chargeCode = this.chargeCodeForm.get('chargeCodeName').value;
          this.showNavigationButtons = true;
          let req = 1;
          this.showData();
        }
      }, error => {
        this.showErrorStatus('g.server.down');
      });
    } else if (this.flagCRUD == 'R') {
      this.showErrorStatus('billing.error.edit.charge');
    } else {
      this.showErrorStatus('billing.error.charge.exists');
    }
  }

  onCancel() {
    this.navigateTo(this.router, '/billing/billingSetup/showChargeCodes', this.chargeCodeData);
  }

  onAddEvent() {
    (this.chargeCodeForm.get('attachedEvents') as NgcFormArray).addValue([
      {
        select: null,
        eventType: null,
        actionType: null,
        billingChargeCodeId: this.chargeCodeForm.get('billingChargeCodeId').value
      }
    ]);
  }

  onAddCondition() {
    this.alphabet = this.nextString(this.alphabet);
    (this.chargeCodeForm.get('applicabilityCondition') as NgcFormArray).addValue([
      {
        select: null,
        bracketStart: null,
        bracketEnd: null,
        alphabet: this.alphabet,
        correlation: null,
        factor: null,
        condition: null,
        value: '',
        billingChargeCodeId: this.chargeCodeForm.get('billingChargeCodeId').value
      }
    ]);
    this.sourceId.push(null);
    this.title.push(null);
    if (this.chargeCodeForm.get('applicabilityCondition').value.length == 1)
      this.computeExpression();
  }

  onDeleteEvent() {
    let index = 0;
    this.chargeCodeForm.get('attachedEvents').value.forEach(value => {
      if (value.select) {
        (this.chargeCodeForm.get('attachedEvents') as NgcFormArray).markAsDeletedAt(index);
      }
      index++;
    });
  }

  onDeleteCondition() {
    let index = 0;
    this.chargeCodeForm.get('applicabilityCondition').value.forEach(value => {
      if (value.select) {
        (this.chargeCodeForm.get('applicabilityCondition') as NgcFormArray).markAsDeletedAt(index);
      }
      index++;
    });
  }

  setEvents(newProcess) {
    if (newProcess == 'I') {
      this.process = this.createSourceParameter('IMP');
      this.factorParam = this.createSourceParameter('IMP');
    } else if (newProcess == 'E') {
      this.process = this.createSourceParameter('EXP');
      this.factorParam = this.createSourceParameter('EXP');
    } else if (newProcess == 'Q') {
      this.process = this.createSourceParameter('EQP');
      this.factorParam = this.createSourceParameter('EQP');
    } else if (newProcess == 'G') {
      this.process = this.createSourceParameter('GEN');
      this.factorParam = this.createSourceParameter('GEN');
    } else {
      this.chargeCodeForm.get('eventType').patchValue(null);
    }
  }

  factorSource(item, index) {
    this.sourceId[index] = item.parameter2;
    this.title[index] = item.desc;
  }

  onFactorSetup() {
    if (this.chargeCodeData) {
      this.chargeCodeData.chargeCodeName = this.chargeCodeData.chargeCode;
      // checks whether charge factor has been setup or not
      this.billingService.searchChargeFactor(this.chargeCodeData).subscribe(response => {
        if (response.data) {
          if (!response.data.chargeFactorName1 && !response.data.chargeFactorName2 &&
            !response.data.chargeFactorName3 && !response.data.chargeFactorName4) {
            this.showErrorStatus('billing.error.charge.factor.configuration')
          }
          else {
            this.navigateTo(this.router, '/billing/billingSetup/factorSetup', this.chargeCodeData);
          }
        }
      })
    }
  }

  onPostingConfigSetup() {
    let formValue = this.chargeCodeForm.getRawValue();
    let ChargeCodeData: any = {};
    let chargeCode: any = {};
    chargeCode.chargeCodeName = formValue.chargeCodeName;
    chargeCode.chargeCodeDescription = formValue.chargeCodeDescription;
    chargeCode.billingChargeCodeId = formValue.billingChargeCodeId;
    ChargeCodeData.chargeCode = chargeCode;
    if (ChargeCodeData) {
      // checks whether charge factor has been setup or not
      this.billingService.searchChargeFactor(ChargeCodeData.chargeCode).subscribe(response => {
        if (response.data) {
          if (!response.data.chargeFactorName1 && !response.data.chargeFactorName2 &&
            !response.data.chargeFactorName3 && !response.data.chargeFactorName4) {
            this.showErrorStatus('billing.error.charge.factor.configuration')
          }
          else {
            this.navigateTo(this.router, '/billing/billingSetup/chargepostingconfiguration', ChargeCodeData);
          }
        }
      })
    }
  }
  //on selecting chargeAttachedTO
  onSelectCAT = event => {
    if (this.chargeCodeForm.get('chargeAttachedTo').value == 'Shipment' ||
      this.chargeCodeForm.get('chargeAttachedTo').value == 'ConsignmentSHCGroup' ||
      this.chargeCodeForm.get('chargeAttachedTo').value == 'Consignment' ||
      this.chargeCodeForm.get('chargeAttachedTo').value == 'ShipmentSHCGroup' ||
      this.chargeCodeForm.get('chargeAttachedTo').value == 'ConsignmentGroupWithoutLDType') {
      this.showScope = true;;
      this.chargeCodeForm.get('scope').setValidators([Validators.required]);

    } else {
      this.showScope = false;
      this.chargeCodeForm.get('scope').clearValidators();
    }
  }

}
