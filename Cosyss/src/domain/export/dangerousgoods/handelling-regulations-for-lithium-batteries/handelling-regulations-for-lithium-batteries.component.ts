import { Component, NgZone, ElementRef, ViewContainerRef, OnInit, OnChanges, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcWindowComponent, NgcFormArray, NgcDropDownComponent, NgcUtility, NgcButtonComponent, NgcDataTableComponent, PageConfiguration
} from 'ngc-framework';
import { NgcFormControl } from 'ngc-framework';
import { RequestRliRlmRegulation, ResponseRliRlmRegulation, ResponseEliElmRegulation, ReturnShipmentRequest, ELM, RLI } from './../../export.sharedmodel';
import { DangerousgoodsService } from './../dangerousgoods.service';

@Component({
  selector: 'app-handelling-regulations-for-lithium-batteries',
  templateUrl: './handelling-regulations-for-lithium-batteries.component.html',
  styleUrls: ['./handelling-regulations-for-lithium-batteries.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})


export class HandellingRegulationsForLithiumBatteriesComponent extends NgcPage implements OnInit {
  response: any;
  flagShowRliRlmRelatedTable: boolean = false;
  flagShowEliElmRelatedTable: boolean = false;
  flagAddEliElmRelatedTable: boolean = false;

  deleteArrayRliRlm: any = new Array();
  deleteArrayEliElm: any = new Array();
  eventFlag: boolean;
  unidNo: any;
  psn: any;
  impcode: any;
  dgRegulationId: any = null;
  packingInstructiondata: any;
  value: any = false;
  checkBoxValue: any = true;
  uniqueIdentificationNoCode: any;

  constructor(private exp_service: DangerousgoodsService, appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef) {
    super(appZone, appElement, appContainerElement);
  }

  private dgForm: NgcFormGroup = new NgcFormGroup({
    uniqueIdentificationNo: new NgcFormControl(),
    impCode: new NgcFormControl(),
    properShippingName1: new NgcFormControl(),
    carrierCode: new NgcFormControl(),
    properShippingName: new NgcFormControl(),
    impCode1: new NgcFormControl(),
    dgClassCode: new NgcFormControl(),
    emergencyRespondGroup: new NgcFormControl(),
    dgSubRiskCode1: new NgcFormControl(),
    dgSubRiskIMPCode1: new NgcFormControl(),
    dgSubRiskCode2: new NgcFormControl(),
    dgSubRiskIMPCode2: new NgcFormControl(),
    rliRlmInstructionList: new NgcFormArray([
      new NgcFormGroup({
        carrierCode: new NgcFormControl(),
        packingGroupCode: new NgcFormControl(),
        dgQuantityFlag: new NgcFormControl()
      })
    ]),
    addRowArrayForEliElm: new NgcFormArray([
      new NgcFormGroup({
        carrierCode: new NgcFormControl(),
        impCode: new NgcFormControl(),
        packingInstruction: new NgcFormControl()
      })

    ])
  })

  unid: any;

  ngOnInit() {
    this.dgForm.get('uniqueIdentificationNo').patchValue('');
    this.dgForm.controls.impCode.valueChanges.subscribe(
      newValue => {
        if (newValue === "ELI" || newValue === "ELM") {
          this.dgRegulationId = null;
          this.uniqueIdentificationNoCode = null;
          this.dgForm.controls['uniqueIdentificationNo'].reset();
        }
      });
    // this.unid = this.dgForm.get('uniqueIdentificationNo').value;
    // this.dgForm.get('uniqueIdentificationNo').valueChanges.subscribe(element => {
    //   this.unid = element;
    // })
  }

  myFunction(item, index) {
    if (item) {
      this.dgForm.get(['rliRlmInstructionList', index, 'upperDeck']).patchValue(this.value);
      this.dgForm.get(['rliRlmInstructionList', index, 'lowerDeck']).patchValue(this.value);
      this.dgForm.get(['rliRlmInstructionList', index, 'passengerFlag']).patchValue(this.value);
      this.dgForm.get(['rliRlmInstructionList', index, 'freighterFlag']).patchValue(this.value);
    }

  }

  disableRliForbidden(item, index) {
    if (item)
      this.dgForm.get(['rliRlmInstructionList', index, 'forbiddenFlag']).patchValue(this.value);
  }

  diasbleAllFlag(item, index) {
    if (item) {
      this.dgForm.get(['addRowArrayForEliElm', index, 'upperDeck']).patchValue(this.value);
      this.dgForm.get(['addRowArrayForEliElm', index, 'lowerDeck']).patchValue(this.value);
      this.dgForm.get(['addRowArrayForEliElm', index, 'passengerFlag']).patchValue(this.value);
      this.dgForm.get(['addRowArrayForEliElm', index, 'freighterFlag']).patchValue(this.value);
    }
  }

  diasbleEliForbiddenFlag(item, index) {
    if (item)
      this.dgForm.get(['addRowArrayForEliElm', index, 'forbiddenFlag']).patchValue(this.value);
  }

  onClear() {
    this.dgForm.get('uniqueIdentificationNo').reset();
    this.dgForm.get('impCode').reset();
    this.dgForm.get('carrierCode').reset();
    this.flagShowRliRlmRelatedTable = false;
    this.flagShowEliElmRelatedTable = false;
    this.flagAddEliElmRelatedTable = false;
  }

  getAll(item) {
    this.dgRegulationId = null;
    if (item.code) {
      this.uniqueIdentificationNoCode = item.code;
      this.impcode = item.param3;
      this.dgRegulationId = item.param1;
      this.dgForm.get('impCode').patchValue(this.impcode);
    } else {
      this.dgForm.get('impCode').reset();
      this.uniqueIdentificationNoCode = null;
    }
    this.psn = item.desc;

  }

  getPackingInstruction(item) {
    this.packingInstructiondata = item.code;
    this.resetFormMessages();
  }

  populateData(item, index) {
    let mlqQuantity: any;
    let mpcQuantity: any;
    let mcoQuantity: any;
    let mlqPackingInstruction: any;
    let mpcPackingInstruction: any;
    let mcoPackingInstruction: any;
    this.response.dgRegulationList.forEach(data => {
      data.dgDetails.forEach(element => {
        mlqQuantity = element.mlqQuantity;
        mpcQuantity = element.mpcQuantity;
        mcoQuantity = element.mcoQuantity;
        mlqPackingInstruction = element.mlqPInfo;
        mpcPackingInstruction = element.mpcPInfo;
        mcoPackingInstruction = element.mcoPInfo;
      })
    })

    if (!this.packingInstructiondata) {
      this.showErrorStatus('export.select.pi.first');
      this.dgForm.get(['rliRlmInstructionList', index, 'dgQuantityFlag']).reset();
    }

    else {
      if (item.code == 'MLQ') {
        this.dgForm.get(['rliRlmInstructionList', index, 'dgQuantity']).patchValue(mlqQuantity);
        this.dgForm.get(['rliRlmInstructionList', index, 'packingInstruction']).patchValue(mlqPackingInstruction);
        this.dgForm.get(['rliRlmInstructionList', index, 'passengerFlag']).enable();
        this.dgForm.get(['rliRlmInstructionList', index, 'passengerFlag']).patchValue(this.checkBoxValue);
        this.dgForm.get(['rliRlmInstructionList', index, 'freighterFlag']).patchValue(this.checkBoxValue);
      }
      if (item.code == 'MPC') {
        this.dgForm.get(['rliRlmInstructionList', index, 'dgQuantity']).patchValue(mpcQuantity);
        this.dgForm.get(['rliRlmInstructionList', index, 'packingInstruction']).patchValue(mpcPackingInstruction);
        this.dgForm.get(['rliRlmInstructionList', index, 'passengerFlag']).enable();
        this.dgForm.get(['rliRlmInstructionList', index, 'passengerFlag']).patchValue(this.checkBoxValue);
        this.dgForm.get(['rliRlmInstructionList', index, 'freighterFlag']).patchValue(this.checkBoxValue);
      }
      if (item.code == 'MCO') {
        this.dgForm.get(['rliRlmInstructionList', index, 'dgQuantity']).patchValue(mcoQuantity);
        this.dgForm.get(['rliRlmInstructionList', index, 'packingInstruction']).patchValue(mcoPackingInstruction);
        this.dgForm.get(['rliRlmInstructionList', index, 'passengerFlag']).patchValue(this.value);
        this.dgForm.get(['rliRlmInstructionList', index, 'passengerFlag']).disable();
        this.dgForm.get(['rliRlmInstructionList', index, 'passengerFlag']).patchValue(this.value);
        this.dgForm.get(['rliRlmInstructionList', index, 'freighterFlag']).patchValue(this.checkBoxValue);
      }
    }
  }

  OnSearchRliRlm() {
    let request: any = new RequestRliRlmRegulation();
    request.uniqueIdentificationNo = this.uniqueIdentificationNoCode;
    request.properShippingName = this.psn;
    request.impCode = this.dgForm.get('impCode').value;
    request.carrierCode = this.dgForm.get('carrierCode').value;
    if (request.impCode == 'RLI' || request.impCode == 'RLM') {
      request.dgRegulationId = this.dgRegulationId;
      this.exp_service.fetchRegulations(request).subscribe(data => {
        this.refreshFormMessages(data);
        this.response = data.data;
        if (this.response) {
          this.flagShowRliRlmRelatedTable = true;
          this.flagShowEliElmRelatedTable = false;
          this.flagAddEliElmRelatedTable = false;
          this.dgForm.controls['properShippingName'].patchValue(this.response.properShippingName);
          this.dgForm.controls['impCode1'].patchValue(this.response.impCode);
          this.dgForm.controls['dgClassCode'].patchValue(this.response.dgClassCode);
          this.dgForm.controls['emergencyRespondGroup'].patchValue(this.response.emergencyRespondGroup);
          this.dgForm.controls['dgSubRiskCode1'].patchValue(this.response.dgSubRiskCode1);
          this.dgForm.controls['dgSubRiskIMPCode1'].patchValue(this.response.dgSubRiskIMPCode1);
          this.dgForm.controls['dgSubRiskCode2'].patchValue(this.response.dgSubRiskCode2);
          this.dgForm.controls['dgSubRiskIMPCode2'].patchValue(this.response.dgSubRiskIMPCode2);
          this.response.rliRlmInstructionList.forEach(element => {
            element.flagCRUD = "R";
            element.check = false;
            element.impCode = this.response.impCode;
          })
          this.dgForm.controls['rliRlmInstructionList'].patchValue(this.response.rliRlmInstructionList);
        } else {
          this.flagShowRliRlmRelatedTable = false;
          this.flagShowEliElmRelatedTable = false;
          this.flagAddEliElmRelatedTable = false
        }
      })
    }
    if (request.impCode == 'ELI' || request.impCode == 'ELM') {
      this.exp_service.fetchRegulationsEliInstruction(request).subscribe(data => {
        this.refreshFormMessages(data);
        let newArray: any = new Array();
        if (!data.data) {
          this.flagShowRliRlmRelatedTable = false;
          this.flagShowEliElmRelatedTable = false;
          this.flagAddEliElmRelatedTable = true;
          let add = new Array();
          (<NgcFormArray>this.dgForm.controls["addRowArrayForEliElm"]).patchValue(add);
        } else {
          newArray = data.data;
          newArray.forEach(element => {
            element.check = false;
          })
          this.flagShowRliRlmRelatedTable = false;
          this.flagShowEliElmRelatedTable = true;
          this.flagAddEliElmRelatedTable = true;
          this.dgForm.controls['addRowArrayForEliElm'].patchValue(newArray);
        }
      })
    }
  }

  OnUpdate() {
    let newArray: any = new Array();
    let request: any = new ResponseRliRlmRegulation();
    let newValue: any = new ResponseEliElmRegulation();
    request.rliRlmInstructionList = [];
    newValue = [];
    //Check if there is any duplicate value
    let eliElmArrayCheck: Array<ELM> = this.dgForm.get('addRowArrayForEliElm').value;
    for (let i = 0; i < eliElmArrayCheck.length; i++) {
      for (let j = 0; j < eliElmArrayCheck.length; j++) {
        if (i != j) {
          if (eliElmArrayCheck[i].carrierCode == eliElmArrayCheck[j].carrierCode && eliElmArrayCheck[i].impCode == eliElmArrayCheck[j].impCode &&
            eliElmArrayCheck[i].packingInstruction == eliElmArrayCheck[j].packingInstruction) {
            this.showErrorStatus(NgcUtility.translateMessage("error.duplicate.entry.carrier.packing.instr",[eliElmArrayCheck[i].impCode,eliElmArrayCheck[i].carrierCode,eliElmArrayCheck[i].packingInstruction]));
            return;
          }
        }
      }
    }
    let rliArrayCheck: Array<RLI> = this.dgForm.get('rliRlmInstructionList').value;
    for (let i = 0; i < rliArrayCheck.length; i++) {
      for (let j = 0; j < rliArrayCheck.length; j++) {
        if (i != j) {
          if (rliArrayCheck[i].carrierCode == rliArrayCheck[j].carrierCode && rliArrayCheck[i].packingGroupCode == rliArrayCheck[j].packingGroupCode &&
            rliArrayCheck[i].dgQuantityFlag == rliArrayCheck[j].dgQuantityFlag) {
            this.showErrorStatus("export.duplicate.entry.in.rli.rlm");
            return;
          }
        }
      }
    }

    if (this.flagShowRliRlmRelatedTable) {
      let rliRlmArray: any = this.dgForm.get('rliRlmInstructionList').value;
      rliRlmArray.forEach(element => {
        element.dgRegulationID = this.response.dgRegulationID;
        element.impCode = this.response.impCode;
        element.psn = this.dgForm.controls['properShippingName'].value;
        request.rliRlmInstructionList.push(element);
      })
    }

    if (this.flagShowEliElmRelatedTable) {
      let eliElmArray: any = this.dgForm.get('addRowArrayForEliElm').value;
      eliElmArray.forEach(element => {
        newValue.push(element);
      })
    }
    if (request.rliRlmInstructionList.length || this.deleteArrayRliRlm.length || newValue.length || this.deleteArrayEliElm.length) {
      if (this.dgForm.controls['uniqueIdentificationNo'].value && (this.dgForm.get('impCode').value == 'RLI' || this.dgForm.get('impCode').value == 'RLM')) {
        if (request.rliRlmInstructionList.length > 0) {
          this.exp_service.updateRegulations(request).subscribe(data => {
            this.refreshFormMessages(data);
            if (data.data.rliRlmInstructionList.length > 0) {
              this.OnSearchRliRlm();
              this.showSuccessStatus('g.operation.successful');
            }
          })
        }
      }
      if (this.dgForm.get('impCode').value == 'ELI' || this.dgForm.get('impCode').value == 'ELM') {
        if (newValue.length) {
          this.exp_service.updateRegulationRelatedToEliElm(newValue).subscribe(data => {
            this.refreshFormMessages(data);
            if (data.data) {
              this.OnSearchRliRlm();
              this.showSuccessStatus('g.operation.successful');
            }
          })
        }
      }


      if (this.deleteArrayRliRlm.length > 0) {
        this.exp_service.daleteRliRlmInstruction(this.deleteArrayRliRlm).subscribe(data => {
          this.OnSearchRliRlm();
          this.deleteArrayRliRlm = [];
        })
      }

      if (this.deleteArrayEliElm.length) {
        this.exp_service.deleteEliElmInstruction(this.deleteArrayEliElm).subscribe(data => {
          this.OnSearchRliRlm();
          this.deleteArrayEliElm = [];
        })
      }

    } else {
      this.showErrorStatus("export.no.row.selected");
    }



  }

  clickAddRowRliRlm() {
    const noOfRows = (<NgcFormArray>this.dgForm.get("rliRlmInstructionList")).length;
    const lastRow = (<NgcFormArray>this.dgForm.get("rliRlmInstructionList")).controls[noOfRows - 1];
    if (noOfRows === 0 || (lastRow.get('carrierCode').value) && (lastRow.get('packingGroupCode').value) && (lastRow.get('packingInstruction').value) && (lastRow.get('dgQuantityFlag').value)) {
      (<NgcFormArray>this.dgForm
        .get("rliRlmInstructionList")).addValue([
          {
            check: false,
            carrierCode: '',
            packingGroupCode: '',
            packingInstruction: '',
            dgQuantityFlag: '',
            dgQuantity: '',
            forbiddenFlag: false,
            upperDeck: false,
            lowerDeck: false,
            passengerFlag: false,
            freighterFlag: false,
            dgRemarks: '',
            flagCRUD: 'S',
            flagSaved: 'N',
            flagInsert: 'Y',
            flagUpdate: 'N',
            flagDelete: 'N'
          }
        ]);
    } else {
      this.showErrorStatus("export.fill.all.mandatory.fields.to.add.another.row");
    }
  }

  clickAddRowEliElm() {
    this.flagShowEliElmRelatedTable = true;
    const noOfRows = (<NgcFormArray>this.dgForm.get("addRowArrayForEliElm")).length;
    const lastRow = noOfRows ? (<NgcFormArray>this.dgForm.get("addRowArrayForEliElm")).controls[noOfRows - 1] : null;
    if (noOfRows === 0 || (lastRow.get('carrierCode').value) && (lastRow.get('packingInstruction').value)) {
      (<NgcFormArray>this.dgForm
        .get("addRowArrayForEliElm")).addValue([
          {
            check: false,
            carrierCode: '',
            impCode: '',
            packingInstruction: '',
            forbiddenFlag: false,
            upperDeck: false,
            lowerDeck: false,
            passengerFlag: false,
            freighterFlag: false,
            dgRemarks: ''
          }
        ]);
    } else
      this.showErrorStatus("export.fill.all.mandatory.fields.to.add.another.row")

  }

  deleteRliRlm() {
    let rliRlmArray: any = new Array();
    let requestArrayForRliRlm: any = (<NgcFormArray>this.dgForm.get("rliRlmInstructionList")).getRawValue();

    requestArrayForRliRlm.forEach(element => {
      if (element.check) {
        if (element.flagCRUD == 'S')
          rliRlmArray.push(element)
        if (element.flagCRUD == 'U')
          this.deleteArrayRliRlm.push(element);
      }
    })

    if (rliRlmArray.length || this.deleteArrayRliRlm.length) {
      (<NgcFormArray>this.dgForm.controls["rliRlmInstructionList"]).deleteValue(rliRlmArray);
      (<NgcFormArray>this.dgForm.controls["rliRlmInstructionList"]).deleteValue(this.deleteArrayRliRlm);
    } else {
      this.showErrorStatus('export.select.atleast.one.row.to.delete');
    }
  }

  DeleteEliElm() {
    let eliElmArray: any = new Array();
    let requestArrayForEliElm: any = (<NgcFormArray>this.dgForm.get("addRowArrayForEliElm")).getRawValue();
    requestArrayForEliElm.forEach(element => {
      if (element.check) {
        if (element.flagCRUD == 'C')
          eliElmArray.push(element);
        if (element.flagCRUD == 'U')
          this.deleteArrayEliElm.push(element);
      }
    })

    if (eliElmArray.length || this.deleteArrayEliElm.length) {
      (<NgcFormArray>this.dgForm.controls["addRowArrayForEliElm"]).deleteValue(this.deleteArrayEliElm);
      (<NgcFormArray>this.dgForm.controls["addRowArrayForEliElm"]).deleteValue(eliElmArray);
    }
    if (!eliElmArray.length && !this.deleteArrayEliElm.length)
      this.showErrorStatus('export.select.atleast.one.row.to.delete');
  }

  public onBack(event) {
    this.navigateBack(this.dgForm.getRawValue());
  }

}
