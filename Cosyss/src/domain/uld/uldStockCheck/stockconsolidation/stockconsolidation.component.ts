import { OsiComponent } from './osi/osi.component';
import { SighteduldsComponent } from './sightedulds/sightedulds.component';
import { UldService } from './../../uld.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, Directive, ViewChild } from '@angular/core';
import { UldStatusFlag } from '../../uld.shared';
import {
  NgcPage, NgcFormGroup, NgcFormControl,
  NgcTabsComponent, NgcTabComponent, NgcFormArray, NgcUtility, NgcWindowComponent,
  PageConfiguration
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationFeatures } from '../../../common/applicationfeatures';


@Component({
  selector: 'ngc-stockconsolidation',
  templateUrl: './stockconsolidation.component.html',
  styleUrls: ['./stockconsolidation.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class StockconsolidationComponent extends NgcPage {
  @ViewChild('insertionWindow') insertionWindow: NgcWindowComponent;
  @ViewChild('confirmSightedPopup') confirmSightedPopup: NgcWindowComponent;
  @ViewChild(SighteduldsComponent) sighteduld;
  @ViewChild(OsiComponent) osi;
  dataDisplay: boolean;
  iscDisplay: boolean;
  osiDisplay: boolean;
  selectFlag: boolean;
  selectFlagIcs: boolean;
  isreconcileCargo: boolean = false;
  isreconcileApron: boolean = false;
  isCompleteApron: boolean = false;
  isCompleteCargo: boolean = false;
  isOtherAirlineFlag: boolean = false;
  isCargo: boolean = false;
  isApron: boolean = false;
  selectTab = 0;
  errors: any;
  scmCycleId: any;
  carrierCode: any;
  resp: any;
  completecargo: string;
  reconcileapron: string;
  completeapron: string;
  apronCargoLocation: string;
  stockCheckAreaCode: string;
  uldType: string;
  selectUldName: any;
  noOfSighted = 0;
  noOfUnSighted = 0;
  noOfUlds = 0;
  checkCount: any = 0;
  reconcileCargoUserCode: any;
  scmsendApronUserCode: any;
  scmsendBothApronUserCode: any;
  scmsendCargoUserCode: any;
  reconcileCargoDate: any;
  reconcileApronUserCode: any;
  reconcileApronDate: any;
  completeCargoUserCode: any;
  completeCargoDate: any;
  completeApronUserCode: any;
  completeApronDate: any;
  scmSendCargoFlag: boolean;
  scmSendCargoDate: any;
  scmSendApronFlag: boolean;
  scmSendApronDate: any;

  buttonDisplay: boolean = false;
  reconcileCargoFlag: boolean;
  reconcileApronFlag: boolean;
  completedCargoFlag: boolean;
  completedApronFlag: boolean;
  scmCargoApronBothFlag: boolean;
  scmCargoApronBothFlag1: boolean = false;
  isBothAvb: boolean = false;
  isIcsList: boolean = false;
  uldArrayList = [];

  cargoFlag: boolean = false;
  apronFlag: boolean = false;
  cargoFlagConfirm: boolean = false;
  apronFlagConfirm: boolean = false;

  cargoFlagConfirm1: boolean = false;
  apronFlagConfirm1: boolean = false;
  stockCheckForSQ: boolean = false;
  uldstockconsolidationform: NgcFormGroup = new NgcFormGroup
    ({
      carrierCode: new NgcFormControl(),
      apronCargoLocation: new NgcFormControl(),
      stockCheckAreaCode: new NgcFormControl(),
      stockCheckAreaCodeApron: new NgcFormControl(),
      uldType: new NgcFormControl(),
      reconcileCargoDateFC: new NgcFormControl(),
      reconcileApronDateFC: new NgcFormControl(),
      completeCargoDateFC: new NgcFormControl(),
      completeApronDateFC: new NgcFormControl(),
      scmsendApronDateFC: new NgcFormControl(),
      scmsendCargoDateFC: new NgcFormControl(),
      scmsendApronBothDateFC: new NgcFormControl(),
      sightedUldsList: new NgcFormArray([]),
      uldStockCheckOsiRemarks: new NgcFormArray([]),
      icsUldsList: new NgcFormArray([
        new NgcFormGroup({
          stockCheckAreaCode1: new NgcFormControl()
        })
      ]),
      uldKey: new NgcFormControl()
    });

  form: NgcFormGroup = new NgcFormGroup
    ({
      sightedUldsList: new NgcFormArray([]
      ),
    });

  uldstockconsolidationaddrowform: NgcFormGroup = new NgcFormGroup
    ({
      uldnumber: new NgcFormControl(),
      stockArea: new NgcFormControl(),
      condition: new NgcFormControl(),
      heldByForSight: new NgcFormControl(),
      lastmovementtype: new NgcFormControl(),
      movementdetails: new NgcFormControl(),
      sightedon: new NgcFormControl()
    });


  uldConfirmSightedpopup: NgcFormGroup = new NgcFormGroup
    ({
      stockArea1: new NgcFormControl(),
      condition1: new NgcFormControl(),
      heldByForSight1: new NgcFormControl(),
    });
  sightedUldsResponse: any;
  apronCycleId: any;
  cargoCycleId: any;


  ngOnInit() {
    super.ngOnInit();
    this.dataInitialized();
  }

  constructor(appZone: NgZone
    , appElement: ElementRef
    , appContainerElement: ViewContainerRef
    , private uldService: UldService
    , private router: Router) {
    super(appZone, appElement, appContainerElement);
  }


  dataInitialized() {
    this.dataDisplay = false;
    this.reconcileCargoFlag = false;
    this.reconcileApronFlag = false;
    this.completedCargoFlag = false;
    this.completedApronFlag = false;
    this.scmSendCargoFlag = false;
    this.scmSendApronFlag = false;
    this.scmCargoApronBothFlag = false;
    this.reconcileCargoUserCode = '';
    this.reconcileCargoDate = '';
    this.reconcileApronUserCode = '';
    this.reconcileApronDate = '';
    this.completeCargoDate = '';
    this.completeCargoDate = '';
    this.completeCargoUserCode = '';
    this.completeApronUserCode = '';
    this.completeApronDate = '';
    this.scmSendCargoDate = '';
    this.scmSendApronDate = '';
  }


  onSearch() {
    this.scmSendApronDate = '';
    this.dataDisplay = false;
    this.dataInitialized();
    const sightedUldRequest = this.uldstockconsolidationform.getRawValue();
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.ULD_StockCheckReconsilationForSQ)) {
      this.stockCheckForSQ = true;

    } else {
      this.stockCheckForSQ = false;
    }

    const uldstockconsolidationform: NgcFormGroup = (<NgcFormGroup>this.uldstockconsolidationform);
    uldstockconsolidationform.validate();
    if (this.uldstockconsolidationform.invalid) {
      return;
    }
    this.isreconcileApron = false;
    this.isreconcileCargo = false;
    this.isApron = false;
    this.isCargo = false;
    this.isCompleteApron = false;
    this.isCompleteCargo = false;
    sightedUldRequest.apronCargoLocation = sightedUldRequest.apronCargoLocation ? sightedUldRequest.apronCargoLocation[0] : sightedUldRequest.apronCargoLocation;
    if (sightedUldRequest.apronCargoLocation == 'C') {
      this.isreconcileApron = true;
      this.isCompleteApron = false;
      this.isCompleteCargo = true;
      this.isCargo = true;
    }
    if (sightedUldRequest.apronCargoLocation == 'A') {
      this.isreconcileCargo = true;
      this.isCompleteCargo = false;
      this.isCompleteApron = true;
      this.isApron = true;
    }

    this.uldService.fetchStockConsolidation(sightedUldRequest).subscribe((data) => {

      if (!data.data) {
        // this.isreconcileCargo = false;
        // this.isreconcileApron = false;
        this.showErrorStatus('uld.no.records.found');
        this.buttonDisplay = true;
        return;
      }
      this.buttonDisplay = true;
      const resp = data.data;
      this.sightedUldsResponse = resp;

      if (resp.sightedUldsList && resp.sightedUldsList.length > 0) {
        this.noOfSighted = resp.sightedUldsList.length;
        this.noOfUnSighted = resp.sightedUldsList[0].totalUldCount;
        this.noOfUlds = this.noOfSighted + this.noOfUnSighted;

        for (const row of resp.sightedUldsList) {
          row.lastUpdatedDateTime = row.lastUpdatedDateTime ? NgcUtility.toDateFromLocalDate(row.lastUpdatedDateTime) : row.lastUpdatedDateTime;
          row.sightedDate = row.sightedDate ? NgcUtility.toDateFromLocalDate(row.sightedDate) : row.sightedDate;
          row.selectFlag = false;
          if (row.conditionType == 'SER') {
            row.conditionType = 'Serviceable';
          }
          if (row.conditionType == 'Ser') {
            row.conditionType = 'Serviceable';
          }

          if (row.conditionType == 'DAM') {
            row.conditionType = 'Damaged';
          }

          if (row.conditionType == 'Dam') {
            row.conditionType = 'Damaged';
          }

          if (row.uldCarrierCode == row.handlingCarrierCode) {
            row.handlingCarrierCode = '';
          }

          if (row.stockCheckSource == 'DSK') {
            row.stockCheckSource = 'Desktop'
          }
        }
        (<NgcFormArray>this.uldstockconsolidationform.controls['uldStockCheckOsiRemarks']).resetValue([]);
        (<NgcFormArray>this.uldstockconsolidationform.controls['sightedUldsList']).patchValue(resp.sightedUldsList);
        (<NgcFormArray>this.uldstockconsolidationform.controls['uldStockCheckOsiRemarks']).patchValue(resp.uldStockCheckOsiRemarks);
        this.scmCycleId = resp.sightedUldsList[0].scmCycleId;
        this.iscDisplay = sightedUldRequest.carrierCode === 'SQ' && sightedUldRequest.apronCargoLocation == 'C' ? true : false;
        this.dataDisplay = true;
        this.resetFormMessages();
      }
      this.apronCycleId = resp.scmApronCycleId;
      this.cargoCycleId = resp.scmCargoCycleId;
      let uldStatusFlag: UldStatusFlag = new UldStatusFlag();
      uldStatusFlag.carrierCode = this.uldstockconsolidationform.get('carrierCode').value;
      uldStatusFlag.cycleId = resp.scmCargoCycleId == null ? resp.scmApronCycleId : resp.scmCargoCycleId;
      this.uldService.getUldstatusFlag(uldStatusFlag).subscribe((res) => {
        if (res.data) {
          if (res.data.reconcileApronDate) {
            this.isreconcileApron = true;
            this.reconcileApronUserCode = res.data.reconcileApronUserCode;
            this.uldstockconsolidationform.get('reconcileApronDateFC').patchValue(res.data.reconcileApronDate);
          } else {
            this.uldstockconsolidationform.get('reconcileApronDateFC').patchValue(null);
            this.reconcileApronUserCode = "";
          }

          if (res.data.reconcileCargoDate) {
            this.isreconcileCargo = true;
            this.reconcileCargoUserCode = res.data.reconcileCargoUserCode;
            this.uldstockconsolidationform.get('reconcileCargoDateFC').patchValue(res.data.reconcileCargoDate);
          } else {
            this.uldstockconsolidationform.get('reconcileCargoDateFC').patchValue(null);
            this.reconcileCargoUserCode = "";
          }

          if (res.data.sCMSendApronDate) {
            this.scmsendApronUserCode = res.data.scmsendApronUserCode;
            this.uldstockconsolidationform.get('scmsendApronDateFC').patchValue(res.data.sCMSendApronDate);
          } else {
            this.uldstockconsolidationform.get('scmsendApronDateFC').patchValue(null);
            this.scmsendApronUserCode = "";
          }

          if (res.data.sCMSendCargoDate) {
            this.isreconcileCargo = true;
            this.scmsendCargoUserCode = res.data.scmsendCargoUserCode;
            this.uldstockconsolidationform.get('scmsendCargoDateFC').patchValue(res.data.sCMSendCargoDate);
          } else {
            this.uldstockconsolidationform.get('scmsendCargoDateFC').patchValue(null);
            this.scmsendCargoUserCode = "";
          }

          if (res.data.sCMSendApronDate && res.data.sCMSendCargoDate) {
            this.scmsendBothApronUserCode = res.data.reconcileCargoUserCode;
            this.uldstockconsolidationform.get('scmsendApronBothDateFC').patchValue(res.data.sCMSendCargoDate);
          } else {
            this.uldstockconsolidationform.get('scmsendApronBothDateFC').patchValue(null);
            this.scmsendBothApronUserCode = "";
          }


          if (res.data.completeApronDate) {
            this.isCompleteApron = false;
            this.completeApronUserCode = res.data.completeApronUserCode;
            this.uldstockconsolidationform.get('completeApronDateFC').patchValue(res.data.completeApronDate);

          } else {
            this.uldstockconsolidationform.get('completeApronDateFC').patchValue(null);
            this.completeApronUserCode = "";
          }

          if (res.data.completeCargoDate) {
            this.isCompleteCargo = false;
            this.completeCargoUserCode = res.data.completeCargoUserCode;
            this.uldstockconsolidationform.get('completeCargoDateFC').patchValue(res.data.completeCargoDate);

          } else {
            this.uldstockconsolidationform.get('completeCargoDateFC').patchValue(null);
            this.completeCargoUserCode = "";
          }

          if (res.data.completeApronDate && res.data.completeCargoDate) {
            this.isBothAvb = true;
          }
          if (res.data.isOtherAirline) {
            this.isOtherAirlineFlag = false;
          } else {
            this.isOtherAirlineFlag = true;
          }

          if (res.data.completeApronDate && res.data.completeCargoDate) {
            if (this.uldstockconsolidationform.get('apronCargoLocation').value == 'BOTH') {
              this.isBothAvb = true;
            } else {
              this.isBothAvb = false;
            }
          } else {
            this.isBothAvb = false;
          }
          let sqGroup = false;
          let carrierCode = this.uldstockconsolidationform.get('carrierCode').value;
          if ("SQ" === carrierCode || "MI" === carrierCode || "TR" === carrierCode) {
            sqGroup = true;
          } else {
            sqGroup = false;
          }
          if (this.uldstockconsolidationform.get('apronCargoLocation').value == 'BOTH') {
            this.isreconcileCargo = true;
            this.isreconcileApron = true;
            this.osiDisplay = true;
          } else {
            if (!sqGroup) {
              this.osiDisplay = false;
            } else {
              this.osiDisplay = true;
            }
          }
        }
      })


    });

  }

  public onSavepopupConfirmSighted() {
    this.confirmSighted();
  }

  public confirmSighted() {
    const confirmFormGroup: NgcFormGroup = (<NgcFormGroup>this.uldConfirmSightedpopup);
    confirmFormGroup.validate();
    if (this.uldConfirmSightedpopup.invalid) {
      return;
    }
    const formRawValue = this.uldstockconsolidationform.getRawValue();
    const unsightedAsSightedRequest: any = new Object();
    unsightedAsSightedRequest.carrierCode = this.uldstockconsolidationform.get('carrierCode').value;
    if (this.uldConfirmSightedpopup.get('heldByForSight1').value == "Apron") {
      unsightedAsSightedRequest.heldBy = "A"
    }
    if (this.uldConfirmSightedpopup.get('heldByForSight1').value == "Cargo") {
      unsightedAsSightedRequest.heldBy = "C"
    }

    unsightedAsSightedRequest.stockCheckAreaCode = this.uldConfirmSightedpopup.get('stockArea1').value;
    unsightedAsSightedRequest.uldConditionType = this.uldConfirmSightedpopup.get('condition1').value;

    for (const obj of formRawValue.icsUldsList) {
      if (obj.selectFlagIcs) {
        unsightedAsSightedRequest.uldKey = obj.containerId;
        unsightedAsSightedRequest.uldID = obj.uldId; ``
      }
    }

    this.uldService.confirmSightedService(unsightedAsSightedRequest).subscribe(data => {
      this.resp = data;
      if (data.success) {
        this.showSuccessStatus('g.operation.successful');
        this.confirmSightedPopup.hide();
        this.onSearch();
      } else {
        this.errors = this.resp.messageList;
        this.showErrorStatus('g.error');
      }
    }, error => this.showErrorStatus('g.error'));
    this.cargoFlagConfirm1 = false;
    this.apronFlagConfirm1 = false;
  }



  /**
   *  Reconcile Cargo selected ULD's for ULD Stock Check Process
   */
  reconcilCargo() {
    const reconcilCargoRequest = {
      carrierCode: this.uldstockconsolidationform.controls.carrierCode.value,
      scmCycleId: this.sightedUldsResponse.scmCargoCycleId,
      uldStockCheckHeader: {
        scmCycleId: this.sightedUldsResponse.scmCargoCycleId,
        carrierCode: this.uldstockconsolidationform.controls.carrierCode.value,
        lastUpdatedUserCode: this.getUserProfile().userLoginCode
      }
    };
    this.uldService.confirmReconcilCargo(reconcilCargoRequest).subscribe((data) => {
      this.resp = data;
      if (data.success) {
        this.reconcileCargoUserCode = data.data.reconcileCargoUserCode;
        if (data.data.reconcileCargoDate) {
          data.data.reconcileCargoDate.pop();
        }
        this.reconcileCargoDate = NgcUtility.toDateFromLocalDate(data.data.reconcileCargoDate);
        this.isreconcileCargo = true;
        this.isCompleteCargo = true;
        this.showSuccessStatus('g.operation.successful');
        this.reconcileCargoFlag = true;
        this.completedCargoFlag = this.uldstockconsolidationform.controls.carrierCode.value === 'SQ' ? true : false;
        this.onSearch();
      } else {
        this.errors = this.resp.messageList[0].message;
        this.showErrorStatus(this.errors);
      }
    }, error => this.showErrorStatus('g.error'));
  }


  getHeldByForConfirm(event) {
    if (event.code == "Cargo") {
      this.apronFlagConfirm = true;
      this.cargoFlagConfirm = false;
    } else if (event.code == "Apron") {
      this.cargoFlagConfirm = true;
      this.apronFlagConfirm = false;
    } else {
      this.cargoFlagConfirm = false;
      this.apronFlagConfirm = false;
    }
  }

  getHeldByForConfirm1(event) {
    if (event.code == "Cargo") {
      this.apronFlagConfirm1 = true;
      this.cargoFlagConfirm1 = false;
    } else if (event.code == "Apron") {
      this.cargoFlagConfirm1 = true;
      this.apronFlagConfirm1 = false;
    } else {
      this.cargoFlagConfirm1 = false;
      this.apronFlagConfirm1 = false;
    }
  }
  /**
   * Reconcile Apron selected ULD's for ULD Stock Check Process
   */
  reconcilApron() {
    const reconcilApronRequest = {
      carrierCode: this.uldstockconsolidationform.controls.carrierCode.value,
      scmCycleId: this.sightedUldsResponse.scmApronCycleId,
      uldStockCheckHeader: {
        scmCycleId: this.sightedUldsResponse.scmApronCycleId,
        carrierCode: this.uldstockconsolidationform.controls.carrierCode.value,
        lastUpdatedUserCode: this.getUserProfile().userLoginCode
      }
    };
    this.uldService.confirmReconcilApron(reconcilApronRequest).subscribe((data) => {
      this.resp = data;
      if (data.success) {
        this.reconcileApronUserCode = data.data.reconcileApronUserCode;
        if (data.data.reconcileApronDate) {
          data.data.reconcileApronDate.pop();
        }
        this.reconcileApronDate = NgcUtility.toDateFromLocalDate(data.data.reconcileApronDate);
        this.isreconcileApron = true;
        this.showSuccessStatus('g.operation.successful');
        this.reconcileApronFlag = true;
        this.completedApronFlag = this.uldstockconsolidationform.controls.carrierCode.value === 'SQ' ? true : false;
        if (this.reconcileApronFlag && this.reconcileCargoFlag
          && this.uldstockconsolidationform.controls.carrierCode.value !== 'SQ') {
          this.completedCargoFlag = true;
          this.completedApronFlag = true;
        }
        this.onSearch();
      } else {
        this.errors = this.resp.messageList[0].message;
        this.showErrorStatus(this.errors);
      }
    }, error => this.showErrorStatus('g.error'));
  }

  /**
   * This method will take care of Stock Check Complete at cargo
   */
  completeCargo() {
    const completeCargoRequest = {
      scmCycleId: this.sightedUldsResponse.scmCargoCycleId,
      carrierCode: this.uldstockconsolidationform.controls.carrierCode.value,
      uldStockCheckHeader: {
        scmCycleId: this.sightedUldsResponse.scmCargoCycleId,
        carrierCode: this.uldstockconsolidationform.controls.carrierCode.value,
        lastUpdatedUserCode: this.getUserProfile().userLoginCode
      }
    };
    this.uldService.confirmCompletedCargo(completeCargoRequest).subscribe((data) => {
      this.resp = data;
      if (data.success) {
        this.completeCargoUserCode = data.data.completeCargoUserCode;
        if (data.data.completeCargoDate) {
          data.data.completeCargoDate.pop();
        }
        this.completeCargoDate = NgcUtility.toDateFromLocalDate(data.data.completeCargoDate);
        this.isCompleteCargo = false;
        this.showSuccessStatus('g.operation.successful');
        this.completedCargoFlag = true;
        this.scmSendCargoFlag = this.uldstockconsolidationform.controls.carrierCode.value === 'SQ' ? true : false;
        this.onSearch();
      } else {
        this.errors = this.resp.messageList[0].message;
        this.showErrorStatus(this.errors);
      }
    }, error => this.showErrorStatus('g.error'));
  }

  /**
   * This method will take care of Stock Check Complete at Apron
   */
  completeApron() {
    const completeApronRequest = {
      scmCycleId: this.sightedUldsResponse.scmApronCycleId,
      carrierCode: this.uldstockconsolidationform.controls.carrierCode.value,
      uldStockCheckHeader: {
        scmCycleId: this.sightedUldsResponse.scmApronCycleId,
        carrierCode: this.uldstockconsolidationform.controls.carrierCode.value,
        lastUpdatedUserCode: this.getUserProfile().userLoginCode
      }
    };
    this.uldService.confirmCompletedApron(completeApronRequest).subscribe((data) => {
      this.resp = data;
      if (data.success) {
        this.completeApronUserCode = data.data.completeApronUserCode;
        if (data.data.completeApronDate) {
          data.data.completeApronDate.pop();
        }
        this.completeApronDate = NgcUtility.toDateFromLocalDate(data.data.completeApronDate);
        this.isCompleteApron = true;
        this.showSuccessStatus('g.operation.successful');
        this.completedApronFlag = true;
        this.scmSendApronFlag = (this.uldstockconsolidationform.controls.carrierCode.value) === 'SQ' ? true : false;
        this.scmCargoApronBothFlag = (this.completedApronFlag && this.completedCargoFlag
          && this.uldstockconsolidationform.controls.carrierCode.value !== 'SQ') ? true : false;
        this.onSearch();
      } else {
        this.errors = this.resp.messageList[0].message;
        this.showErrorStatus(this.errors);
      }
    }, error => this.showErrorStatus('g.error'));
  }

  /**
   * SCM Cargo for ULD Stock Check Process.
   */
  scmCargo() {
    const scmCargoRequest = {
      sCMCycleIDDsk: this.sightedUldsResponse.scmCargoCycleId,
      scmCycleId: this.sightedUldsResponse.scmCargoCycleId,
      carrierCode: this.uldstockconsolidationform.controls.carrierCode.value,
      apronCargoLocation: "C",
      uldStockCheckHeader: {
        scmCycleId: this.sightedUldsResponse.scmCargoCycleId,
        carrierCode: this.uldstockconsolidationform.controls.carrierCode.value,
        lastUpdatedUserCode: this.getUserProfile().userLoginCode
      }
    };
    this.uldService.confirmScmCargo(scmCargoRequest).subscribe((data) => {
      this.resp = data;
      if (data.data) {
        if (data.data.scmSendCargoDate) {
          data.data.scmSendCargoDate.pop();
        }
        this.scmSendCargoDate = NgcUtility.toDateFromLocalDate(data.data.scmSendCargoDate);
        this.onSearch();
        this.showSuccessStatus('g.operation.successful');
      } else {
        this.errors = this.resp.messageList[0].message;
        this.showErrorStatus(this.errors);
      }
    }, error => this.showErrorStatus('g.error'));
  }

  /**
   * SCM Apron for ULD Stock Check Process.
   */
  scmApron() {
    const scmApronRequest = {
      sCMCycleIDDsk: this.sightedUldsResponse.scmApronCycleId,
      scmCycleId: this.sightedUldsResponse.scmApronCycleId,
      carrierCode: this.uldstockconsolidationform.controls.carrierCode.value,
      apronCargoLocation: "A",
      uldStockCheckHeader: {
        scmCycleId: this.sightedUldsResponse.scmApronCycleId,
        carrierCode: this.uldstockconsolidationform.controls.carrierCode.value,
        lastUpdatedUserCode: this.getUserProfile().userLoginCode
      }
    };
    this.uldService.confirmScmApron(scmApronRequest).subscribe((data) => {
      this.resp = data;
      if (data.data) {
        if (data.data.scmSendApronDate) {
          data.data.scmSendApronDate.pop();
        }
        this.scmSendApronDate = NgcUtility.toDateFromLocalDate(data.data.scmSendApronDate);
        this.onSearch();
        this.showSuccessStatus('g.operation.successful');
      } else {
        this.errors = this.resp.messageList[0].message;
        this.showErrorStatus(this.errors);
      }
    }, error => this.showErrorStatus('g.error'));
  }


  scmCargoApronBoth() {
    const scmCargoApronBothRequest = {
      sCMCycleIDDsk: this.sightedUldsResponse.scmCargoCycleId == null ? this.sightedUldsResponse.scmApronCycleId : this.sightedUldsResponse.scmCargoCycleId,
      scmCycleId: this.sightedUldsResponse.scmCargoCycleId == null ? this.sightedUldsResponse.scmApronCycleId : this.sightedUldsResponse.scmCargoCycleId,
      carrierCode: this.uldstockconsolidationform.controls.carrierCode.value,
      uldStockDetails: [],
      uldStockCheckHeader: {
        scmCycleId: this.sightedUldsResponse.scmCargoCycleId == null ? this.sightedUldsResponse.scmApronCycleId : this.sightedUldsResponse.scmCargoCycleId,
        carrierCode: this.uldstockconsolidationform.controls.carrierCode.value,
        scmSendCargoFlag: true,
        scmSendApronFlag: true
      }
    };
    // Add this line in feature 
    scmCargoApronBothRequest.uldStockDetails = this.sightedUldsResponse.sightedUldsList;
    // feature line ends here
    this.uldService.confirmScmCargoApronBoth(scmCargoApronBothRequest).subscribe((data) => {
      this.resp = data;
      if (data.data) {
        if (data.data.scmSendApronDate) {
          data.data.scmSendApronDate.pop();
        }
        this.uldstockconsolidationform.get('scmsendApronBothDateFC').patchValue(null);
        this.scmSendApronDate = NgcUtility.toDateFromLocalDate(data.data.scmSendApronDate);
        this.scmsendBothApronUserCode = this.getUserProfile().userLoginCode;
        this.scmCargoApronBothFlag = true;
        this.showSuccessStatus('g.operation.successful');
        this.onSearch();
      } else {
        this.errors = this.resp.messageList[0].message;
        this.showErrorStatus(this.errors);
      }
    }, error => this.showErrorStatus('g.error'));

  }

  saveSightedAddRow() {
    this.carrierCode = this.uldstockconsolidationaddrowform.controls.uldnumber.value;
    if (this.carrierCode.substr(this.carrierCode.length - 2, 2).toUpperCase()
      !== this.uldstockconsolidationform.controls.carrierCode.value) {
      this.showErrorStatus('uld.uld.number.entered.is.not.used.by.specified.carrier');
      return;
    }
    const unsightedAsSightedRequest: any = new Object();
    unsightedAsSightedRequest.uldKey = this.uldstockconsolidationaddrowform.get('uldnumber').value;
    unsightedAsSightedRequest.carrierCode = this.uldstockconsolidationform.get('carrierCode').value;
    unsightedAsSightedRequest.heldBy = this.uldstockconsolidationaddrowform.get('heldByForSight').value;
    unsightedAsSightedRequest.stockCheckAreaCode = this.uldstockconsolidationaddrowform.get('stockArea').value;
    unsightedAsSightedRequest.uldConditionType = this.uldstockconsolidationaddrowform.get('condition').value;
    unsightedAsSightedRequest.uldStatus = this.uldstockconsolidationaddrowform.get('lastmovementtype').value;
    unsightedAsSightedRequest.movementDetails = this.uldstockconsolidationaddrowform.get('movementdetails').value;
    unsightedAsSightedRequest.sightedDate = this.uldstockconsolidationaddrowform.get('sightedon').value;
    this.uldService.sightNewUldFromSighted(unsightedAsSightedRequest).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data;
      if (data.success) {
        this.showSuccessStatus('g.operation.successful');
        this.insertionWindow.hide();
        this.onSearch();
      } else {
        this.errors = this.resp.messageList[0].message;
        this.showErrorStatus(this.errors);
      }
    }, error => this.showErrorStatus(' uld.error'));
  }

  cancelWindow() {
    this.insertionWindow.hide();
  }

  /**
   * onSave OSI Remarks for ULD Stock Check Process.
   */
  onSave() {
    const osiRemarksRequest = {
      osiRemarks: [],
      osiRemarksRequest: "save"
    };
    // uldstockconsolidationform.controls.uldStockCheckOsiRemarks
    const rows = this.uldstockconsolidationform.getRawValue().uldStockCheckOsiRemarks;
    const userId = this.getUserProfile().userLoginCode;
    if (rows[0].value === null || rows[0].value === '') {
      this.showErrorStatus('uld.remarks.is.empty');
      return;
    }
    for (const remark of rows) {
      osiRemarksRequest.osiRemarks.push({
        scmCycleId: this.scmCycleId,
        osiRemark: remark.osiRemark,
        transactionSeqNo: remark.transactionSeqNo,
        flagCRUD: remark.flagCRUD
      });
    }
    this.uldService.osiRemark(osiRemarksRequest).subscribe((data) => {
      const resp = data;
      if (data.success) {
        this.showSuccessStatus('g.operation.successful');
        this.onSearch();
      }
    });
  }

  /**
   * This will populate the LOV value for ULD Carrier
   * @param object
   */
  public onSelectCarrier(object) {
    this.uldstockconsolidationform.get('carrierCode').setValue(object.code);
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.ULD_StockCheckReconsilationForSQ)) {
      this.stockCheckForSQ = true;

    } else {
      this.stockCheckForSQ = false;
    }

  }

  /**
   * This will populate the LOV value for ULD Type
   * @param object
   */
  public onSelectUldType(object) {
    this.uldstockconsolidationform.get('uldType').setValue(object.code);
    this.selectUldName = object.desc;
  }

  /**
   * Checking the selection of Check Box
   */
  checkBoxSelected() {
    const rows = this.uldstockconsolidationform.getRawValue().sightedUldsList;
    for (const row of rows) {
      if (row.selectFlag) {
        return true;
      }
    }
    return false;
  }


  checkBoxIcsSelected() {
    const rows1 = this.uldstockconsolidationform.getRawValue().icsUldsList;
    for (const row of rows1) {
      if (row.selectFlagIcs) {
        return true;
      }
    }
    return false;
  }

  markUldSight() {
    if (!this.checkBoxIcsSelected()) {
      this.showErrorStatus('uld.select.checkbox');
      return;
    }

    const formRawValue = this.uldstockconsolidationform.getRawValue();
    const unsightedAsSightedRequest: any = {
      uldStockDetails: []
    };
    unsightedAsSightedRequest.carrierCode = this.uldstockconsolidationform.get('carrierCode').value;

    for (const obj of formRawValue.icsUldsList) {
      if (this.uldstockconsolidationform.get('apronCargoLocation').value == "Cargo") {
        if (obj.apronCargoLocation1 != "Cargo") {
          this.showErrorStatus('uld.please.save.the.details');
          return;
        }
      }

      if (this.uldstockconsolidationform.get('apronCargoLocation').value == "Apron") {
        if (obj.apronCargoLocation1 != "Apron") {
          this.showErrorStatus('uld.please.save.the.details');
          return;
        }
      }
    }

    for (const obj of formRawValue.icsUldsList) {
      if (obj.selectFlagIcs) {
        if (obj.stockCheckAreaCode1 == null) {
          this.showErrorStatus('uld.please.select.stock.check.area.for.the.selected.uld');
          return;
        }
      }
    }

    for (const obj of formRawValue.icsUldsList) {
      if (obj.selectFlagIcs) {
        unsightedAsSightedRequest.uldStockDetails.push({
          uldKey: obj.uldKey,
          apronCargoLocation: obj.apronCargoLocation1,
          lastUpdatedUserCode: this.getUserProfile().userLoginCode,
          uldIDDsk: obj.uldID,
          stockCheckAreaCode: obj.stockCheckAreaCode1,
          uldStatus: null,
          uldConditionType: null,
          uldLocationCode: null
        });
      }
    }
    this.uldService.confirmSightedService(unsightedAsSightedRequest).subscribe(data => {
      this.resp = data;
      if (data) {
        this.showSuccessStatus('g.operation.successful');
        this.onSearch();
        this.fetchULDListFromICS();
      } else {
        this.errors = this.resp.messageList;
      }
    }, error => this.showErrorStatus('g.error'));
  }

  onSelection(event) {

  }



  onLinkClick(uldKey) {
    var dataToSend = {
      entityKey: this.uldstockconsolidationform.get(['sightedUldsList', uldKey]).value.uldKey,
      entityType: "ULD"
    };
    this.navigateTo(this.router, 'common/capturephoto', dataToSend);
  }

  onLinkClick1(index) {
    var dataToSend = {
      entityKey: this.uldstockconsolidationform.get(['icsUldsList', index]).value.uldKey,
      entityType: "ULD"
    };
    this.navigateTo(this.router, 'common/capturephoto', dataToSend);
  }


  getHeldBy(event) {
    if (event.code == "Cargo") {
      this.cargoFlag = true;
      this.apronFlag = false;
    } else if (event.code == "Apron") {
      this.apronFlag = true;
      this.cargoFlag = false;
    } else {
      this.apronFlag = false;
      this.cargoFlag = false;
    }

  }

  fetchULDListFromICS() {
    this.isIcsList = false;
    this.uldArrayList = [];

    let request = {
      cargoTerminal: ["T5", "T6"]
    };

    this.uldService.fetchULDListFromICS(request).subscribe(response => {
      let icsRes: any = response;

      let icsReq = {
        checkCompleteModels: []
      };
      icsRes.terminal.forEach(terminalRes => {
        terminalRes.uldInfo.forEach(element => {
          this.noOfUnSighted += terminalRes.uldInfo.length;
          this.noOfUlds = this.noOfSighted + this.noOfUnSighted;
          icsReq.checkCompleteModels.push(element);
        });
      })
      this.uldService.getIcsulddetails(icsReq).subscribe(uldRes1 => {
        let icsUldResult: any = uldRes1.data;
        if (icsUldResult) {
          this.isIcsList = true;
          for (let obj of icsUldResult) {
            obj.selectFlagIcs = false;
            obj.apronCargoLocation1 = this.uldstockconsolidationform.get('apronCargoLocation').value;
          }
          (<NgcFormArray>this.uldstockconsolidationform.controls["icsUldsList"]).patchValue(icsUldResult);
        }

      })
    })
  }
  restartSCMCycle() {
    let requestModel: any = this.uldstockconsolidationform.getRawValue();
    requestModel.scmApronCycleId = this.apronCycleId;
    requestModel.scmCargoCycleId = this.cargoCycleId;
    this.showConfirmMessage('restart.stock.check').then(fulfilled => {
      this.uldService.restartSCMCycle(requestModel).subscribe(data => {
        if (data.success) {
          this.showSuccessStatus('g.operation.successful');
          this.onSearch();
        }
      });
    });
  }


  onCancel(event) {
    this.navigateTo(this.router, '/', null);
  }

  onAddRow() {
    (<NgcFormArray>this.uldstockconsolidationform.get('uldStockCheckOsiRemarks')).addValue([{
      sel: false,
      transactionSeqNo: null,
      osiRemark: null
    }]);
  }

  onDeleteRow(index) {
    (<NgcFormGroup>this.uldstockconsolidationform.get(['uldStockCheckOsiRemarks', index])).markAsDeleted();
  }

}
