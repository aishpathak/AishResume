/**
 * @copyright SATS Singapore 2020-21
 */
// Angular
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Directive, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
// Application Framework
import {
  NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, PageConfiguration,
  NgcEditTableComponent
} from 'ngc-framework'
// Cargo Processing Engine Service
import { CargoProcessingEngineService } from './../cargoprocessingengine.service';

// Process Area constants
export const ProcessArea = {
  ACAS: 'ACAS',
  CHECKLIST: 'CheckList',
  DRY_ICE_WEIGHT: 'Dry Ice Weight',
  EAWB: 'EAWB',
  EMBARGO: 'Embargo',
  FHL_REQUIRED: 'FHL Required',
  FWB_REQUIRED: 'FWB Required',
  SCREENING_RCAR: 'Screening Required (RCAR)',
  SCREENING_CUSTOMS: 'Singapore Customs',
  SCREENING_AIRLINE: 'Screening Airline',
  WEIGHT_TOLERANCE: 'Weight Tolerance',
  VOLUMETRIC_TOLERANCE: 'Volumetric Tolerance',
  //
  CHARGE_DECLARATION: 'Charge Declaration',
  CHINA_CUSTOM: 'China Custom',
  DLS_VARIANCE: 'DLS Variance',
  AUTO_KC_TARGET: 'Auto KC Target'
}

// Constants
export const PrecedentsForm = {
  PROCESS_AREA_CODE: 'processAreaCode',
  PROCESS_AREA_NAME: 'processAreaName',
  PROCESS_CARRIER_CODE: 'processCarrierCode',
  PROCESS_OFF_POINT: 'processOffPoint',
  PROCESS_DESTINATION: 'processDestination',
  PROCESS_COUNTRY_OF_DESTINATION: 'processCountryOfDestination',
  PRECEDENTS: 'precedents',
  PARAMETERS: 'parameters',
  AGENTS: 'agents',
  SECTORS: 'sectors',
  COPIES: 'copies',
  COMPLEX_SLAB: 'complexSlab',
  FLAT_SLAB: 'flatSlab',
  SHC_SLAB: 'shcHandlingGroups',
  VOLUMETRIC_SLAB: 'volumetricSlab',
  EFFECTIVE_FROM_DATE: 'effectiveFromDate'
}

export const EAWBPrint = {
  SATS_PRINT: 'SATSPrint',
  NO_PRINT: 'NOPrint'
}

/**
 * Request Payload
 */
export class RequestPayload {
  public processAreaId: number = 0;
  public processCarrierCode: string;
  public processOffPoint: string;
  public processDestination: string;
  public processCountryOfDestination: string;
}

@Component({
  selector: 'app-setup-cargo-process-precedents',
  templateUrl: './setup-cargo-process-precedents.component.html',
  styleUrls: ['./setup-cargo-process-precedents.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true,
  focusToBlank: true
})
export class SetupCargoProcessPrecedentsComponent extends NgcPage {
  @ViewChild('eAWBTable')
  private eAWBTable: NgcEditTableComponent;
  // Response data
  response: any[];
  responseData: any[];
  parameterData: any[];
  // Save disable mode
  saveDisableMode: boolean = false;
  // Disable mode
  disableMode: boolean = true;
  displayTable: boolean = false;
  // Initial loading
  displaySector: boolean = false;
  displayEAWB: boolean = false;
  displayWeightTolerance: boolean = false;
  displayVolumetricTolerance: boolean = false;

  // Controls
  private form: NgcFormGroup = new NgcFormGroup({
    // Process Area Search params
    processAreaCode: new NgcFormControl(),
    processAreaName: new NgcFormControl(),
    processCarrierCode: new NgcFormControl(),
    processOffPoint: new NgcFormControl(),
    processDestination: new NgcFormControl(),
    processCountryOfDestination: new NgcFormControl(),
    // Data table related
    parameters: new NgcFormControl(),
    precedents: new NgcFormArray([])
  });

  /**
  * Initialize
  *
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private cargoProcessingEngineService: CargoProcessingEngineService) {
    super(appZone, appElement, appContainerElement);
  }

  /**
   * On Initialization
   */
  public ngOnInit(): void {
    super.ngOnInit();
  }

  /**
   * On page clear
   * 
   * @param event 
   */
  public onClear(event): void {
    this.resetFormMessages();
    this.form.reset();
  }

  /**
   * Processing Rule selection
   * 
   * @param event 
   */
  private processingRuleSelection(event): void {
    this.displayTable = false;
    // Set to default state
    this.setToDefaultState();
    this.disableMode = event.code ? false : true;
    this.form.controls[PrecedentsForm.PROCESS_AREA_CODE].setValue(event.code);
    this.form.controls[PrecedentsForm.PROCESS_AREA_NAME].setValue(event.desc);
    //
    switch (event.desc) {
      case ProcessArea.EAWB:
        this.displayEAWB = true;
        break;
      case ProcessArea.WEIGHT_TOLERANCE:
        this.displayWeightTolerance = true;
        break;
      case ProcessArea.VOLUMETRIC_TOLERANCE:
        this.displayVolumetricTolerance = true;
        break;
      default:
        this.displaySector = true;
        break;
    }
  }

  /**
   * Set to default state
   */
  private setToDefaultState(): void {
    this.displaySector = false;
    this.displayEAWB = false;
    this.displayWeightTolerance = false;
    this.displayVolumetricTolerance = false;
    // Search criteria input fields clear
    this.form.get(PrecedentsForm.PROCESS_CARRIER_CODE).setValue(null);
    this.form.get(PrecedentsForm.PROCESS_OFF_POINT).setValue(null);
    this.form.get(PrecedentsForm.PROCESS_DESTINATION).setValue(null);
    this.form.get(PrecedentsForm.PROCESS_COUNTRY_OF_DESTINATION).setValue(null);
  }

  /**
   * Processing Rules search function
   */
  private getProcessingRules(): void {
    const requestPayload = new RequestPayload();
    requestPayload.processAreaId = Number(this.form.get(PrecedentsForm.PROCESS_AREA_CODE).value);
    requestPayload.processCarrierCode = this.form.get(PrecedentsForm.PROCESS_CARRIER_CODE).value;
    requestPayload.processOffPoint = this.form.get(PrecedentsForm.PROCESS_OFF_POINT).value;
    requestPayload.processDestination = this.form.get(PrecedentsForm.PROCESS_DESTINATION).value;
    requestPayload.processCountryOfDestination = this.form.get(PrecedentsForm.PROCESS_COUNTRY_OF_DESTINATION).value;
    // Reset form messages Just Before Search
    this.resetFormMessages();
    // Subscribe
    this.cargoProcessingEngineService.searchPrecedents(requestPayload).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.refreshFormMessages(response.data);
        this.responseData = response.data;
        if (this.responseData) {
          this.parameterData = response.data.precedentsParams;
          if (response.data.precedents.length) {
            this.displayTable = true;
            const precedentsData = (this.form.get([PrecedentsForm.PRECEDENTS]) as NgcFormArray);
            (<NgcFormArray>this.form.get([PrecedentsForm.PRECEDENTS])).patchValue(response.data.precedents);
          } else {
            this.displayTable = false;
            this.showInfoStatus("warehouse.norecordfound");
            (<NgcFormArray>this.form.get([PrecedentsForm.PRECEDENTS])).resetValue([]);
          }
        } else {
          this.displayTable = false;
          const errors = response.messageList;
          if (errors) {
            this.showErrorStatus(errors[0].message);
          }
        }
        // Precedents Parameter
        let params = [];
        for (const param of this.parameterData) {
          if (param.precedentsParameterId) {
            params.push(param.precedentsParameterId);
          }
        }
        this.form.get(PrecedentsForm.PARAMETERS).setValue([params]);
      }
    }, error => {
      console.log(error);
    });
  }

  /**
   * Processing Rules Save
   * 
   * @param event
   */
  private onSave(event): void {
    this.form.validate();
    if (this.form.invalid) {
      return;
    }
    // Request Payload
    const requestPayload = this.form.getRawValue();
    requestPayload.processAreaId = Number(this.form.get(PrecedentsForm.PROCESS_AREA_CODE).value);
    requestPayload.precedentsParams = this.parameterData;
    requestPayload.precedents.map(record => record.processAreaName = this.form.controls[PrecedentsForm.PROCESS_AREA_NAME].value);
    // Reset form messages Just Before Search
    this.resetFormMessages();
    // Subscribe
    this.cargoProcessingEngineService.savePrecedents(requestPayload).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.refreshFormMessages(response.data);
        this.responseData = response.data;
        if (this.responseData) {
          this.parameterData = response.data.precedentsParams;
          this.showSuccessStatus("g.completed.successfully");
          // Search again
          this.getProcessingRules();
        } else {
          const errors = response.messageList;
          if (errors) {
            this.showErrorStatus(errors[0].message);
          }
        }
        // Precedents Parameter
        let params = [];
        for (const param of this.parameterData) {
          if (param.precedentsParameterId) {
            params.push(param.precedentsParameterId);
          }
        }
        this.form.get(PrecedentsForm.PARAMETERS).setValue([params]);
      }
    }, error => {
      console.log(error);
    });
  }

  /**
   * Precedents line items entry
   */
  private addLineItem(event): void {
    this.displayTable = true;
    const contentLength = (<NgcFormArray>this.form.get(PrecedentsForm.PRECEDENTS)).length;
    if (!contentLength) {
      (<NgcFormArray>this.form.get([PrecedentsForm.PRECEDENTS])).addValue([
        this.lineItemFormFields()
      ]);
      return;
    }
    const lastRowData = this.form.get([PrecedentsForm.PRECEDENTS, contentLength - 1, PrecedentsForm.EFFECTIVE_FROM_DATE]);
    if (lastRowData != null) {
      (<NgcFormArray>this.form.get([PrecedentsForm.PRECEDENTS])).addValue([
        this.lineItemFormFields()
      ]);
    } else {
      this.showInfoStatus("warehouse.fill.mandatoryfields");
    }
  }

  /**
   * Precedents delete entry
   */
  private deleteLineItem(index): void {
    (<NgcFormArray>this.form.controls[PrecedentsForm.PRECEDENTS]).markAsDeletedAt(index);
  }

  /**
   * Add inline agent item
   * 
   * @param event,
   * @param dataField
   * @param groupIndex
   */
  private addInlineAgentItem(event, dataField, groupIndex): void {
    (<NgcFormArray>this.form.get([PrecedentsForm.PRECEDENTS, groupIndex, PrecedentsForm.AGENTS])).addValue([
      {
        agentCode: '',
        effectiveStartDate: '',
        effectiveEndDate: ''
      }
    ]);
    if (this.eAWBTable) {
      this.eAWBTable.showRow(0, groupIndex);
    }
  }

  /**
   * Add inline sector item
   * 
   * @param event 
   * @param dataField 
   * @param groupIndex 
   */
  private addInlineSectorItem(event, dataField, groupIndex): void {
    (<NgcFormArray>this.form.get([PrecedentsForm.PRECEDENTS, groupIndex, PrecedentsForm.SECTORS])).addValue([
      {
        sector: '',
        copies: '',
        singleProcessPrint: '',
        singleProcessPrintStartDate: '',
        singleProcessPrintEndDate: ''
      }
    ]);
    if (this.eAWBTable) {
      this.eAWBTable.showRow(0, groupIndex);
    }
  }

  /**
   * Delete EAWB Line Item
   * 
   * @param event 
   * @param dataField 
   * @param groupIndex 
   * @param columnIndex 
   */
  private deleteEAWBLineItem(event, dataField, groupIndex, columnIndex): void {
    (this.form.get([PrecedentsForm.PRECEDENTS, groupIndex]) as NgcFormGroup).markAsDeleted();
  }

  /**
   * Cutover Toggle Changes
   * 
   * @param event 
   * @param group 
   */
  private cutoverToggleChange(event, group): void {
    // !TODO:
  }

  /**
   * Delete Agent Inline Item
   * 
   * @param event 
   * @param group 
   * @param groupIndex 
   */
  private deleteAgentInlineItem(event, group, groupIndex): void {
    this.showConfirmMessage("warehouse.warning.deleterecord.foragent").then(fulfilled => {
      (this.form.get([PrecedentsForm.PRECEDENTS, group, PrecedentsForm.AGENTS, groupIndex]) as NgcFormGroup).markAsDeleted();
    });
  }

  /**
   * Single process print dropdown selection
   * 
   * @param event 
   * @param groupIndex 
   */
  private singleProcessPrintHandler(event, groupIndex): void {
    if (event === EAWBPrint.SATS_PRINT) {
      this.form.get([PrecedentsForm.PRECEDENTS, groupIndex, PrecedentsForm.COPIES]).setValidators([Validators.required]);
      return;
    }
    this.form.get([PrecedentsForm.PRECEDENTS, groupIndex, PrecedentsForm.COPIES]).setValidators([]);
  }

  /**
   * Delete Sector Inline Item
   * 
   * @param event 
   * @param group 
   * @param groupIndex 
   */
  private deleteSectorInlineItem(event, group, groupIndex): void {
    (this.form.get([PrecedentsForm.PRECEDENTS, group, PrecedentsForm.SECTORS, groupIndex]) as NgcFormGroup).markAsDeleted();
  }

  /**
   * Delete Weight Tolerance Line Item
   * 
   * @param event 
   * @param dataField 
   * @param groupIndex 
   * @param columnIndex 
   */
  private deleteWeightToleranceLineItem(event, dataField, groupIndex, columnIndex): void {
    (this.form.get([PrecedentsForm.PRECEDENTS, groupIndex]) as NgcFormGroup).markAsDeleted();
  }

  /**
   * Complex slab inline item
   * 
   * @param event 
   * @param dataField 
   * @param groupIndex 
   */
  private addComplexSlabInlineItem(event, dataField, groupIndex): void {
    (<NgcFormArray>this.form.get([PrecedentsForm.PRECEDENTS, groupIndex, PrecedentsForm.COMPLEX_SLAB])).addValue([
      {
        toleranceOperator: '',
        toleranceWeight: '',
        discrepancyOperator: '',
        discrepancyWeight: '',
        amendFlag: '',
        effectiveFromDate: '',
        effectiveToDate: '',
        delete: ''
      }
    ]);
  }

  /**
   * Flat slab inline item
   * 
   * @param event 
   * @param dataField 
   * @param groupIndex 
   */
  private addFlatSlabInlineItem(event, dataField, groupIndex): void {
    (<NgcFormArray>this.form.get([PrecedentsForm.PRECEDENTS, groupIndex, PrecedentsForm.FLAT_SLAB])).addValue([
      {
        fromWeight: '',
        toWeight: '',
        toleranceWeight: '',
        effectiveFromDate: '',
        effectiveToDate: '',
        delete: ''
      }
    ]);
  }

  /**
   * SHC slab inline item
   * 
   * @param event 
   * @param dataField 
   * @param groupIndex 
   */
  private addSHCSlabInlineItem(event, dataField, groupIndex): void {
    (<NgcFormArray>this.form.get([PrecedentsForm.PRECEDENTS, groupIndex, PrecedentsForm.SHC_SLAB])).addValue([
      {
        specialHandlingGroupCode: '',
        weightTolerancePercent: '',
        effectiveFromDate: '',
        effectiveToDate: '',
        weightToleranceFlag: 'Y',
        delete: '',
      }
    ]);
  }

  /**
   * Delete Complex Slab
   * 
   * @param event 
   * @param group 
   * @param groupIndex 
   */
  private deleteComplexSlab(event, group, groupIndex): void {
    this.showConfirmMessage("warehouse.warning.deleterecord.forcomplexslab").then(fulfilled => {
      (this.form.get([PrecedentsForm.PRECEDENTS, group, PrecedentsForm.COMPLEX_SLAB, groupIndex]) as NgcFormGroup).markAsDeleted();
    });
  }

  /**
   * Delete Flat Slab
   * 
   * @param event 
   * @param group 
   * @param groupIndex 
   */
  private deleteFlatSlab(event, group, groupIndex): void {
    this.showConfirmMessage("warehouse.warning.deleterecord.forflatlab").then(fulfilled => {
      (this.form.get([PrecedentsForm.PRECEDENTS, group, PrecedentsForm.FLAT_SLAB, groupIndex]) as NgcFormGroup).markAsDeleted();
    });
  }

  /**
   * Delete SHC Slab
   * 
   * @param event 
   * @param group 
   * @param groupIndex 
   */
  private deleteSHCSlab(event, group, groupIndex): void {
    this.showConfirmMessage("warehouse.warning.deleterecord.forshclab").then(fulfilled => {
      (this.form.get([PrecedentsForm.PRECEDENTS, group, PrecedentsForm.SHC_SLAB, groupIndex]) as NgcFormGroup).markAsDeleted();
    });
  }

  /**
   * Volumetric slab inline item
   * 
   * @param event 
   * @param dataField 
   * @param groupIndex 
   */
  private addVolumetricSlabInlineItem(event, dataField, groupIndex): void {
    (<NgcFormArray>this.form.get([PrecedentsForm.PRECEDENTS, groupIndex, PrecedentsForm.VOLUMETRIC_SLAB])).addValue([
      {
        fromWeight: '',
        toWeight: '',
        toleranceInKG: '',
        toleranceInPercentage: '',
        delete: ''
      }
    ]);
  }

  /**
   * Delete Volumetric Tolerance Line Item
   * 
   * @param event 
   * @param dataField 
   * @param groupIndex 
   * @param columnIndex 
   */
  private deleteVolumetricToleranceLineItem(event, dataField, groupIndex, columnIndex): void {
    (this.form.get([PrecedentsForm.PRECEDENTS, groupIndex]) as NgcFormGroup).markAsDeleted();
  }

  /**
   * Delete Volumetric slab inline item
   * 
   * @param event 
   * @param group 
   * @param groupIndex 
   */
  private deleteVolumetricSlabInlineItem(event, group, groupIndex): void {
    this.showConfirmMessage("warehouse.warning.deleterecord.forvolumetricslab").then(fulfilled => {
      (this.form.get([PrecedentsForm.PRECEDENTS, group, PrecedentsForm.VOLUMETRIC_SLAB, groupIndex]) as NgcFormGroup).markAsDeleted();
    });
  }

  /**
   * Line item Form fields
   * 
   * @param formGroup 
   */
  private lineItemFormFields(): Object {
    const formFields: any =
    {
      carrierCode: '',
      fromAirline: '',
      boardingPoint: '',
      countryOfOrigin: '',
      shipmentOrigin: '',
      offPoint: '',
      countryOfDestination: '',
      shipmentDestination: '',
      flightType: '',
      aircraftTypes: [],
      rcar: '',
      aedIndicator: '',
      psnCode: '',
      fwbExists: '',
      checkListTypesIds: null,
      shcHandlingGroups: [],
      shcs: [],
      maxDryIceWeight: '',
      weightTolerance: '',
      remarks: '',
      effectiveFromDate: '',
      effectiveToDate: '',
      delete: '',
      delFlag: 'N',
      fullCutover: false,
      addAgents: '',
      agents: [],
      addSectors: '',
      sectors: [],
      singleProcessPrint: '',
      absoluteWeight: '',
      weightPercentage: '',
      complexSlab: [],
      flatSlab: [],
      volumetricSlab: [],
    };
    return formFields;
  }

}