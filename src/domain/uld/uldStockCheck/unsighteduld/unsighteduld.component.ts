import { SightedUldRequest } from './../../uld.shared';
import { UldService } from './../../uld.service';
import { element } from 'protractor';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcFormControl, NgcFormArray, NgcFormGroup, NgcPage, NgcWindowComponent, PageConfiguration, NgcUtility, NgcReportComponent } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationFeatures } from '../../../common/applicationfeatures';

@Component({
  selector: 'ngc-unsighteduld',
  templateUrl: './unsighteduld.component.html',
  styleUrls: ['./unsighteduld.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class UnsighteduldComponent extends NgcPage {

  @ViewChild('insertionWindow') insertionWindow: NgcWindowComponent;
  @ViewChild('missingUldWindow') missingUldWindow: NgcWindowComponent;
  list: any[];
  selectedCheckBox: boolean;
  errors: any;
  tableFlag: boolean;
  dataDisplay: boolean;
  sightedOn: any;
  movementdetails: any;
  lastmovementtype: any;
  damagedetails: any;
  condition: any;
  stockArea: any;
  source: any;
  sel: boolean;
  uldNumber: any;
  carrierCode: any;
  resp: any;
  cargoFlag: boolean = false;
  apronFlag: boolean = false;
  cargoFlagConfirm: boolean = false;
  autoUld: boolean = false;
  private uldGroupFeatureEnabled: boolean = false;
  isScmFlagDone: boolean = false;
  isScmFlagDone1: boolean = false;
  apronFlagConfirm: boolean = false;
  stockCheckAreaCodeList: string[] = ['CoolPort', 'New'];
  uldTypeList: string[] = ['AKE', 'TQ', 'AAF'];
  selectUldName: any;
  reportParameters: any = new Object();
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @ViewChild("reportWindow1") reportWindow1: NgcReportComponent;
  private unSightedUldsForm: NgcFormGroup = new NgcFormGroup
    ({
      carrierCode: new NgcFormControl(),
      apronCargoLocation: new NgcFormControl(),
      stockCheckAreaCode: new NgcFormControl(),
      uldGroup: new NgcFormControl(),
      uldType: new NgcFormControl(),
      stockCheckAreaCodeApron: new NgcFormControl(),
      stockCheckAreaCodeCargo: new NgcFormControl(),
      checkAll: new NgcFormControl(),
      unsightedUldsList: new NgcFormArray([
        new NgcFormGroup({
          stockCheckAreaCode: new NgcFormControl()
        })
      ]),
      uldKey: new NgcFormControl(),
    });

  uldConfirmSightedpopup: NgcFormGroup = new NgcFormGroup
    ({
      stockArea: new NgcFormControl(),
      condition: new NgcFormControl(),
      heldByForSight: new NgcFormControl(),
    });

  uldMissingPopupForm: NgcFormGroup = new NgcFormGroup
    ({
      heldByforMissingUld: new NgcFormControl(),
    });

  constructor(appZone: NgZone
    , appElement: ElementRef
    , appContainerElement: ViewContainerRef
    , private activatedRoute: ActivatedRoute
    , private uldService: UldService
    , private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() { 
    this.uldGroupFeatureEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.ULD_UldGroup);    
  }
  /**
   * This function will Work For fetch unsighteduldlist
   * @param event
   */
  onSearch() {

    if (this.unSightedUldsForm.invalid) {
      this.showErrorStatus('CUST003');
      return;
    }
    let sightedulds: SightedUldRequest = new SightedUldRequest();
    if (this.uldGroupFeatureEnabled) {
    sightedulds.uldGroup = this.unSightedUldsForm.get('uldGroup').value;
    }
    sightedulds.uldType = this.unSightedUldsForm.get('uldType').value;
    sightedulds.carrierCode = this.unSightedUldsForm.get('carrierCode').value;
    sightedulds.apronCargoLocation = this.unSightedUldsForm.get('apronCargoLocation').value;
    sightedulds.uldKey = this.unSightedUldsForm.get('uldKey').value;

    if (sightedulds.apronCargoLocation) {
      sightedulds.apronCargoLocation = sightedulds.apronCargoLocation === 'All' ? null : sightedulds.apronCargoLocation[0];
    }
    const userId = this.getUserProfile().userLoginCode;
    if (sightedulds.carrierCode) {
      this.uldService.fetchUnsightedUlds(sightedulds).subscribe(data => {
        this.resp = data;

        if (!this.showResponseErrorMessages(data)) {
          if (this.resp.data.length === 0) {
            this.showErrorStatus('uld.no.records.found');
            this.tableFlag = false;
            return;
          }
          for (let obj of this.resp.data) {
            obj.selectedCheckBox = false;
            if (obj.apronCargoLocation == 'C') {
              obj.apronCargoLocation = 'Cargo';
            }

            if (obj.apronCargoLocation == 'CARGO') {
              obj.apronCargoLocation = 'Cargo';
            }


            if (obj.apronCargoLocation == 'A') {
              obj.apronCargoLocation = 'Apron';
            }

            if (obj.apronCargoLocation == 'APRON') {
              obj.apronCargoLocation = 'Apron';
            }

            if (obj.isNotAgentFlag == 'YES') {
              this.showErrorMessage("uld.last.movement.type.recorded");
            }

            if (obj.uldConditionType == 'SER') {
              obj.uldConditionType = 'SER';

            }
            if (obj.uldConditionType == 'Ser') {
              obj.uldConditionType = 'SER';
            }

            if (obj.uldConditionType == 'DAM') {
              obj.uldConditionType = 'DAM';
            }

            if (obj.uldConditionType == 'Dam') {
              obj.uldConditionType = 'DAM';
            }


            if (obj.uldCarrierCode == this.unSightedUldsForm.get('carrierCode').value) {
              obj.handlingCarrierCode = '';
            }


            if (sightedulds.apronCargoLocation == 'C') {
              if (obj.uldStatus == 'ORP') {
                obj.apronCargoLocation = 'Cargo';
                obj.stockCheckAreaCode = 'REPAIR WAREHOUSE'
              }

              if (obj.uldStatus == 'ORA') {
                obj.apronCargoLocation = 'Cargo';
                obj.stockCheckAreaCode = 'AGENT WAREHOUSE'
              }

              if (obj.apronCargoLocation == 'AGENT') {
                obj.apronCargoLocation = 'Cargo';
                obj.stockCheckAreaCode = 'AGENT WAREHOUSE'
              }
            }

          }
          this.unSightedUldsForm.get(['unsightedUldsList']).patchValue(this.resp.data);
          this.unSightedUldsForm.get('checkAll').patchValue(false);
          this.tableFlag = true;
          if (this.resp.data[0].isNewScmCycle == 0) {
            this.showInfoStatus("uld.new.SCM.stock.check.cycle.has.been.started");
          }
          if (this.resp.data[0].flagToCheck == 1) {
            this.isScmFlagDone = true;
            this.showInfoStatus("uld.displaying.usighted.uld.list.new.SCM.sending.cycle");
          }

          if (this.resp.data[0].isNewScmCycleCargo == 0) {
            this.showInfoStatus("uld.new.SCM.stock.check.cycle.has.been.started");
          }
          if (this.resp.data[0].flagToCheckCargo == 1) {
            this.isScmFlagDone1 = true;
            this.showInfoStatus("uld.displaying.usighted.uld.list.new.SCM.sending.cycle");
          }

        }
      }, error => {
      });
    } else {
      this.showErrorStatus('uld.carrier.is.mandatory');
    }
  }

  /**
   * This Function will Navigates the user
   * to ULD In/ Out Movement screen with selected
   * ULD number entered in the search criteria and
   * last situation, last in and last out movement details are displayed.
   * @param event
   */
  public uldInOutMovement(event) {
    this.navigateTo(this.router, '/uld/uldmovement', {});
  }
  public autoSighting() {
   if(NgcUtility.hasFeatureAccess(ApplicationFeatures.ULD_UldUnsightedAutoSighting)){
    this.autoUld = true; 
    const formRawValue = this.unSightedUldsForm.getRawValue();
   for (let i = 0; i < this.resp.data.length; i++) {   
       this.unSightedUldsForm.get(['unsightedUldsList', i, 'selectedCheckBox']).patchValue(formRawValue.unsightedUldsList);
      }
    this.confirmSighted();
  }
}
  /**
   * This method will take care of Unsighted Uld's to singhted
   * In Uld Stock Check Process
   */
  public confirmSighted() {

    if (!this.checkBoxSelected()) {
      this.showErrorStatus('uld.select.checkbox');
      return;
    }

    const formRawValue = this.unSightedUldsForm.getRawValue();
    const unsightedAsSightedRequest: any = {
      uldStockDetails: []
    };
    unsightedAsSightedRequest.carrierCode = this.unSightedUldsForm.get('carrierCode').value;
    for (const obj of formRawValue.unsightedUldsList) {
      if (this.unSightedUldsForm.get('apronCargoLocation').value == "Cargo") {
        if (obj.apronCargoLocation != "Cargo") {
          this.showErrorStatus('uld.please.save.the.details');
          return;
        }
      }

      if (this.unSightedUldsForm.get('apronCargoLocation').value == "Apron") {
        if (obj.apronCargoLocation != "Apron") {
          this.showErrorStatus('uld.please.save.the.details');
          return;
        }
      }

    }
    //Commented by Lakshmi Uppara for the fix of 16035
    // for (const obj of formRawValue.unsightedUldsList) {
    //   if (obj.selectedCheckBox) {
    //     if (obj.stockCheckAreaCode == null || obj.stockCheckAreaCode == " ") {
    //       return this.showErrorStatus('Please select stock check area for the selected Uld');

    //     }
    //   }
    // }

    for (const obj of formRawValue.unsightedUldsList) {
      if (obj.selectedCheckBox) {
        if (obj.apronCargoLocation == "Apron" && obj.uldStatus == 'ORA') {
          this.showErrorStatus('uld.highlighted.ulds.cannot.be.marked.as.sighted.in.apron');
          return;
        }
      }
    }

    for (const obj of formRawValue.unsightedUldsList) {
      if (obj.selectedCheckBox) {
        if (obj.apronCargoLocation == "Apron" && obj.uldStatus == 'ORP') {
          this.showErrorStatus('uld.highlighted.ulds.cannot.be.marked.as.sighted.in.apron');
          return;
        }
      }
    }




    for (const obj of formRawValue.unsightedUldsList) {
     if (obj.selectedCheckBox) {
        unsightedAsSightedRequest.uldStockDetails.push({
          uldKey: obj.uldKey,
          apronCargoLocation: obj.apronCargoLocation,
          lastUpdatedUserCode: this.getUserProfile().userLoginCode,
          uldIDDsk: obj.uldID,
          uldConditionType: obj.uldConditionType,
          stockCheckAreaCode: obj.stockCheckAreaCode,
          HandlingCarrierCode: obj.HandlingCarrierCode,
          uldStatus: obj.uldStatus,
          movementDetails: obj.movementDetails,
          flightkey: obj.flightkey,
          autoUld: this.autoUld
        });
     }
    }
    this.uldService.confirmSightedService(unsightedAsSightedRequest).subscribe(data => {
      this.resp = data;
      this.showResponseErrorMessages(data);
      if (NgcUtility.isBlank(data.messageList)) {
        this.showSuccessStatus('g.operation.successful');
        this.onSearch();
      }
      //else {
      //   this.errors = this.resp.messageList;
      //   this.showResponseErrorMessages(this.errors);
      // }
    });
    this.cargoFlagConfirm = false;
    this.apronFlagConfirm = false;
    this.autoUld = false;
  }

  public onSavepopupConfirmSighted() {
    this.confirmSighted();
  }

  public enablePopUpConfirmSighted() {
    if (!this.checkBoxSelected()) {
      this.showErrorStatus('uld.select.checkbox');
      return;
    }
    this.confirmSighted();
  }


  public confirmMissingPopup() {

    if (!this.checkBoxSelected()) {
      this.showErrorStatus('uld.select.checkbox');
      return;
    }
    this.confirmMissing();

  }

  /**
   * This method will work for updating uld status as missing and uld removed from Unsighted uld list.
   * @param event
   */
  public confirmMissing() {
    const formRawValue = this.unSightedUldsForm.getRawValue();
    const confirmMissingRequest = {
      uldStockDetails: []
    };
    for (const obj of formRawValue.unsightedUldsList) {
      if (obj.selectedCheckBox) {
        confirmMissingRequest.uldStockDetails.push({
          uldKey: obj.uldKey,
          uldIDDsk: obj.uldID,
          stockCheckAreaCode: obj.stockCheckAreaCode,
          handlingCarrierCode: this.unSightedUldsForm.get('carrierCode').value,
          apronCargoLocation: this.unSightedUldsForm.get('apronCargoLocation').value,
          lastUpdatedUserCode: this.getUserProfile().userLoginCode,
          uldConditionType: obj.uldConditionType
        });
      }
    }
    this.uldService.confirmMissingService(confirmMissingRequest).subscribe(data => {
      this.resp = data;
      if (data.success) {
        this.showSuccessStatus('g.operation.successful');
        this.onSearch();
      } else {
        this.errors = this.resp.messageList;
      }
    }, error => {
    })

  }
  /**
   * This Function will deletes the ULD from the system and ULD  removed from unsighted ULD list.
   * @param event
   */
  public confirmDelete(event) {
    if (!this.checkBoxSelected()) {
      this.showErrorStatus('uld.select.checkbox');
      return;
    }
    const formRawValue = this.unSightedUldsForm.getRawValue();
    const listconfirmDelete = {
      uldStockDetails: []
    };
    for (const obj of formRawValue.unsightedUldsList) {
      if (obj.selectedCheckBox) {
        listconfirmDelete.uldStockDetails.push({
          uldKey: obj.uldKey,
          uldIDDsk: obj.uldID,
          handlingCarrierCode: this.unSightedUldsForm.get('carrierCode').value,
          conditionType: obj.uldConditionType === 'Damaged' ? 'DAM' : obj.uldConditionType === 'Serviceable' ? 'SER' : obj.uldConditionType,
          uldLastMovementType: obj.uldStatus,
          lastUpdatedUserCode: this.getUserProfile().userLoginCode
        });
      }
    }
    this.uldService.confirmDeleteService(listconfirmDelete).subscribe(data => {
      this.resp = data;
      if (data.success) {
        this.showSuccessStatus('g.operation.successful');
        this.onSearch();
      } else {
        this.errors = this.resp.messageList;
        this.showErrorStatus(this.errors);
      }
    }, error => this.showErrorStatus('g.error'));
  }

  /**
   * This will take of populating the Uld Carrier LOV
   * @param object
   */
  public onSelectCarrier(object) {
    this.unSightedUldsForm.get('carrierCode').setValue(object.code);
  }

  /**
   *  This will take of populating the Uld Type LOV
   * @param object
   */
  public onSelectUldType(object) {
    this.unSightedUldsForm.get('uldType').setValue(object.code);
    this.selectUldName = object.desc;
  }

  checkBoxSelected() {
    let rows = this.unSightedUldsForm.getRawValue().unsightedUldsList;
    for (let row of rows) {
      if (row.selectedCheckBox) {
        return true;
      }
    }
    return false;
  }


  displayUld() {
    if (!this.checkBoxSelected()) {
      this.showErrorStatus('uld.select.checkbox');
      return;
    }
    let rowCount = 0;
    const rowDatas = (<NgcFormArray>this.unSightedUldsForm.get('unsightedUldsList')).getRawValue();
    for (const eachRow of rowDatas) {
      if (eachRow.selectedCheckBox) {
        rowCount++;
      }
      if (rowCount > 1) {
        this.showWarningStatus('uld.selectsingle.uld.only');
        return;
      }
    }
    rowDatas.forEach(tempObj => {
      if (tempObj.selectedCheckBox) {
        var dataToSend = {
          uldID: tempObj.uldID,
          uldNumber: tempObj.uldKey
        }
        this.navigateTo(this.router, '/uld/uldenquire', dataToSend);
      }
    });
  }


  auditTrail() {
    if (!this.checkBoxSelected()) {
      this.showErrorStatus('uld.select.checkbox');
      return;
    }
    let rowCount = 0;
    const rowDatas = (<NgcFormArray>this.unSightedUldsForm.get('unsightedUldsList')).getRawValue();
    for (const eachRow of rowDatas) {
      if (eachRow.selectedCheckBox) {
        rowCount++;
      }
      if (rowCount > 1) {
        this.showWarningStatus('uld.selectsingle.uld.only');
        return;
      }
    }
    rowDatas.forEach(tempObj => {
      if (tempObj.selectedCheckBox) {
        var dataToSend = {
          entityValue: tempObj.uldKey,
          entityType: 'ULD'
        }
        this.navigateTo(this.router, '/audit/audittrailbyuldtrolley', dataToSend);
      }
    });
  }

  onLinkClick(item) {
    var dataToSend = {
      entityKey: item.value,
      entityType: "ULD"
    };
    this.navigateTo(this.router, 'common/capturephoto', dataToSend);
  }

  getHeldByForConfirm(event) {
    if (event.code == "Cargo") {
      this.apronFlagConfirm = false;
      this.cargoFlagConfirm = true;
    } else if (event.code == "Apron") {
      this.cargoFlagConfirm = false;
      this.apronFlagConfirm = true;
    } else {
      this.cargoFlagConfirm = false;
      this.apronFlagConfirm = false;
    }
  }


  getHeldBy(event, index) {
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


  onSave() {

    if (!this.checkBoxSelected()) {
      this.showErrorStatus('uld.select.checkbox');
      return;
    }

    const formRawValue = this.unSightedUldsForm.getRawValue();
    const saveUpdatedUldDetailsReq: any = {
      uldStockDetails: []
    };
    saveUpdatedUldDetailsReq.carrierCode = this.unSightedUldsForm.get('carrierCode').value;


    for (const obj of formRawValue.unsightedUldsList) {
      if (obj.selectedCheckBox) {
        saveUpdatedUldDetailsReq.uldStockDetails.push({
          uldKey: obj.uldKey,
          heldBy: obj.apronCargoLocation,
          lastUpdatedUserCode: this.getUserProfile().userLoginCode,
          uldIDDsk: obj.uldID,
          handlingCarrierCode: obj.handlingCarrierCode,
          uldConditionType: obj.uldConditionType,
          apronCargoLocation: obj.apronCargoLocation,
          uldLocationCode: obj.stockCheckAreaCode
        });
      }
    }

    this.uldService.saveUpdatedUldDetails(saveUpdatedUldDetailsReq).subscribe(data => {
      this.resp = data;
      if (data.success) {
        this.showSuccessStatus('g.operation.successful');
        this.onSearch();
      } else {
        this.errors = this.resp.messageList;
      }
    }, error => this.showErrorStatus('g.error'));

  }

  checkAll() {
    let checkAll = this.unSightedUldsForm.get('checkAll').value;
    for (let i = 0; i < this.resp.data.length; i++) {
      if (this.resp.data[i].stockCheckAreaCode && this.resp.data[i].uldConditionType) {
        this.unSightedUldsForm.get(['unsightedUldsList', i, 'selectedCheckBox']).patchValue(checkAll);
      }
    }
  }
  onCancel(event) {
    this.navigateTo(this.router, '/', null);
  }

  onPrint() {

    this.reportParameters.Carrier = this.unSightedUldsForm.get("carrierCode").value;
    this.reportParameters.HeldBy = this.unSightedUldsForm.get('apronCargoLocation').value;
    this.reportParameters.ULDNum = this.unSightedUldsForm.get('uldKey').value;
    this.reportParameters.ULDType = this.unSightedUldsForm.get('uldType').value;
    this.reportParameters.checkReconcileDate = (this.resp.data[0].checkForReconcileDate === "null" ? null : this.resp.data[0].checkForReconcileDate);
    if (this.reportParameters.Carrier !== "SQ") {
      if (this.resp.data[0].cycleCompleteCheck !== null && this.resp.data[0].cycleCompleteCheck === 1 && this.reportParameters.ScmCycleId !== null) {
        this.reportParameters.ScmCycleId = this.resp.data[0].scmcycleID;
        this.reportWindow1.open();
      } else {
        this.reportWindow.open();
      }
    } else {
      this.reportWindow.open();
    }

  }
}
