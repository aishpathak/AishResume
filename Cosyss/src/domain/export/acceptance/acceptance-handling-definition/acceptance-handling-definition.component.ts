import { FormGroup } from '@angular/forms';
import { element } from 'protractor';
import { HandlingDefAccpt, HandlingDefinition, HandlingDefinitionByAirline } from '../../export.sharedmodel';
import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, NgcTemplate, PageConfiguration
} from 'ngc-framework';
import { AcceptanceService } from '../acceptance.service';
import { log } from 'util';
@Component({
  selector: 'ngc-acceptance-handling-definition',
  templateUrl: './acceptance-handling-definition.component.html',
  styleUrls: ['./acceptance-handling-definition.component.scss']
})
/**
* Acceptance Handling Definition function allows the user to define definition for procesing of different types of
* shipment during acceptance of document and weighing
*/
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class AcceptanceHandlingDefinitionComponent extends NgcPage {
  private response;
  resp: any;
  reqShc: any;
  shcData: any;
  request1: any;
  arrayUser: any;
  reqAirline: any;
  shcDateTime: any;
  airlineData: any;
  carrierArray: any;
  shcGroupSave: any;
  shcawbFormat: any;
  dateTimeArray: any;
  shcpreLodging: any;
  airlineDateTime: any;
  shcAcceptanceId: any;
  airLineGroupSave: any;
  airlineawbFormat: any;
  airlinepreLodging: any;
  airlineAcceptanceId: any;
  acceptanceTypeTitle: any;
  acceptanceDescription: any;
  shcpartialAcceptance: any;
  airlinepartialAcceptance: any;
  returnFlag: Boolean = false;
  @ViewChild('shcWindow') shcWindow: NgcWindowComponent;
  @ViewChild('carrierWindow') carrierWindow: NgcWindowComponent;
  private form: NgcFormGroup = new NgcFormGroup({
    shcArray: new NgcFormArray([]),
    carrierArray: new NgcFormArray([]),
    HandlingDefAccpt: new NgcFormArray([])
  });
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router
    , private _acceptanceService: AcceptanceService) {
    super(appZone, appElement, appContainerElement);
  }
  ngOnInit() {
    this.getDefaultDefinition();
  }
  /**
  * On Destroy
  */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
  /**
  * This function is responsible for adding new record to Airline definition
  */
  onAirlineAcceptanceHandlingDefinition() {
    (<NgcFormArray>this.form.get('carrierArray')).addValue([
      {
        select: true,
        sendfsurcs: 0,
        sendfsurct: 0,
        chargesapplicable: 0,
        servicenumbersuffix: '',
        requiredcustomscheck: 0,
        cutoftimeforprelodgemins: 0,
        contractorDetailsRequired: 0,
        requiredlocalauthorityinfo: '',
        requireddocumentlistforprelodging: '',
        requiredprelodging: this.airlinepreLodging,
        requiredAWBnumberformatcheck: this.airlineawbFormat,
        handlingDefinitionAccptId: this.airlineAcceptanceId,
        partialacceptanceallowed: this.airlinepartialAcceptance,
        handlingDefinitionByAirline: {
          carrierCode: ''
        }
      }
    ]);
  }
  /**
  * This function is responsible for adding new record to SHC definition
  */
  onShcAcceptanceHandlingDefinition() {
    (<NgcFormArray>this.form.get('shcArray')).addValue([
      {
        select: true,
        sendfsurcs: 0,
        sendfsurct: 0,
        chargesapplicable: 0,
        servicenumbersuffix: '',
        requiredcustomscheck: 0,
        cutoftimeforprelodgemins: 0,
        contractorDetailsRequired: 0,
        requiredlocalauthorityinfo: '',
        requireddocumentlistforprelodging: '',
        requiredprelodging: this.shcpreLodging,
        requiredAWBnumberformatcheck: this.shcawbFormat,
        handlingDefinitionAccptId: this.shcAcceptanceId,
        partialacceptanceallowed: this.shcpartialAcceptance,
        handlingDefinitionBySHC: {
          shcgroup: ''
        }
      }
    ]);
  }
  /**
  * This Function will work For On Link Click For Opening Window Pop-up for Airline
  * @param index
  */
  onCarrierSpecific(index) {
    const carrierData = this.arrayUser[index].handlingDefinition;
    this.airlineAcceptanceId = this.arrayUser[index].handlingDefinitionAccptId;
    this.airlinepreLodging = this.arrayUser[index].handlingDefinition[0].requiredprelodging;
    this.airlineawbFormat = this.arrayUser[index].handlingDefinition[0].requiredAWBnumberformatcheck;
    this.airlinepartialAcceptance = this.arrayUser[index].handlingDefinition[0].partialacceptanceallowed;
    this.acceptanceTypeTitle = this.arrayUser[index].acceptanceDescription + ' ' + this.getI18NValue('Airline Add/Edit');
    this.acceptanceDescription = this.arrayUser[index].acceptanceDescription;
    const carrierList: Array<any> = new Array<any>();
    carrierData.forEach((aairlineGroup: any, index: number) => {
      if (index > 0 && aairlineGroup.handlingDefinitionByAirline) {
        carrierList.push(aairlineGroup);
      }
    });
    this.form.get('carrierArray').patchValue(carrierList);
    //
    // let carrierArray: NgcFormArray = this.form.get('carrierArray');
    // //
    // carrierArray.controls.forEach((handleDef: NgcFormGroup) => {
    //   if (handleDef.get('handlingDefinitionByAirline.carrierCode').value) {
    //     (<NgcFormControl>handleDef.get('handlingDefinitionByAirline.carrierCode')).disable();
    //   }
    // });
    this.carrierWindow.open();
    this.airlineData = this.arrayUser[index].handlingDefinition[0];
  }
  /**
  * This Function will work For On Link Click For Opening Window Pop-up for SHC
  * @param event
  */
  onShcSpecific(index) {
    const shcData = this.arrayUser[index].handlingDefinition;
    this.shcAcceptanceId = this.arrayUser[index].handlingDefinitionAccptId;
    this.shcpreLodging = this.arrayUser[index].handlingDefinition[0].requiredprelodging;
    this.shcawbFormat = this.arrayUser[index].handlingDefinition[0].requiredAWBnumberformatcheck;
    this.shcpartialAcceptance = this.arrayUser[index].handlingDefinition[0].partialacceptanceallowed;
    this.acceptanceTypeTitle = this.arrayUser[index].acceptanceDescription + ' ' + this.getI18NValue('SHC Add/Edit');
    this.acceptanceDescription = this.arrayUser[index].acceptanceDescription;
    let shcList: Array<any> = new Array<any>();
    shcData.forEach((sshcGroup: any, index: number) => {
      if (index > 0 && sshcGroup.handlingDefinitionBySHC) {
        shcList.push(sshcGroup);
      }
    });
    this.form.get('shcArray').patchValue(shcList);
    this.shcWindow.open();
    this.shcData = this.arrayUser[index].handlingDefinition[0];
  }
  /**
  * This function is responsible for Saving the record of the Airline
  * @param event Event
  */
  onSaveAirline(event) {
    this.reqAirline = (<NgcFormArray>this.form.get('carrierArray')).getRawValue();
    const s = this.reqAirline;
    this.reqAirline = new Array();
    // this.reqAirline[0] = this.airlineData;
    this.returnFlag = false;
    s.forEach(ele => {
      ele.acceptanceDescription = this.acceptanceDescription;
      this.reqAirline.push(ele);
      this.airLineGroupSave = ele.handlingDefinitionByAirline.carrierCode;
      if (this.airLineGroupSave === "") {
        this.showInfoStatus('expaccpt.provide.details');
        this.returnFlag = true;
      }
    });
    if (this.reqAirline.length === 0 && this.returnFlag !== true) {
      this.showInfoStatus('expaccpt.provide.details');
      this.returnFlag = true;
    }
    if (!this.returnFlag) {
      this._acceptanceService.saveAirlineDetails(this.reqAirline).subscribe(data => {
        this.resp = data;
        if (data.success) {
          this.showSuccessStatus('g.completed.successfully');
          this.carrierWindow.hide();
          this.getDefaultDefinition();
        } else {
          this.refreshFormMessages(data);
        }
      }, error => this.showErrorStatus('g.error'));
    }
  }
  /**
  * This function is responsible for Saving the record of  SHC
  * @param event Event
  */
  onSaveShc(event) {
    this.reqShc = (<NgcFormArray>this.form.get('shcArray')).getRawValue();
    const s = this.reqShc;
    this.reqShc = new Array();
    // this.reqShc[0] = this.shcData;
    this.returnFlag = false;
    s.forEach(ele => {
      ele.acceptanceDescription = this.acceptanceDescription;
      this.reqShc.push(ele);
      this.shcGroupSave = ele.handlingDefinitionBySHC.shcgroup;
      if (this.shcGroupSave === "") {
        this.showInfoStatus('expaccpt.provide.details');
        this.returnFlag = true;
      }
    });
    if (this.reqShc.length === 0 && this.returnFlag !== true) {
      this.showInfoStatus('expaccpt.provide.details');
      this.returnFlag = true;
    }
    if (!this.returnFlag) {
      this._acceptanceService.saveShcDetails(this.reqShc).subscribe(data => {
        this.resp = data;
        if (data.success) {
          this.showSuccessStatus('g.completed.successfully');
          this.shcWindow.hide();
          this.getDefaultDefinition();
        } else {
          this.refreshFormMessages(data);
        }
      }, error => this.showErrorStatus('g.error'));
    }
  }
  /**
  * This is a confirmation window before deletion the record of Airline
  * @param event Event
  */
  public onDeleteAirline(event) {
    this.showConfirmMessage('expaccpt.airline.delete.confirmation').then(fulfilled => {
      if (!this.checkBoxAirline()) {
        this.showErrorStatus('expaccpt.select.checkbox');
        return;
      }
      this.reqAirline = (<NgcFormArray>this.form.get('carrierArray')).getRawValue().filter(temp => temp.select);
      const s = this.reqAirline;
      this.reqAirline = new Array();
      s.forEach(ele => {
        ele.acceptanceDescription = this.acceptanceDescription;
        this.reqAirline.push(ele);
      });

      this._acceptanceService.deleteAirlineDefinition(this.reqAirline).subscribe(data => {
        this.resp = data;
        if (data.success) {
          for (let i = 0; i <= (<NgcFormArray>this.form.get('carrierArray')).length; i++) {
            if ((<NgcFormArray>this.form.get('carrierArray')).getRawValue()[i].select) {
              (<NgcFormArray>this.form.get('carrierArray')).deleteValueAt(i);
              --i;
            }
          }
          this.showSuccessStatus('g.completed.successfully');
          // this.carrierWindow.hide();
          this.getDefaultDefinition();
        } else {
          this.refreshFormMessages(data);
        }
      }, error => this.showErrorStatus('expaccpt.provide.details.airline.delete'));

    }
    ).catch(reason => {
    });
  }
  /**
  * This is a confirmation window before deletion the record of SHC
  * @param event Event
  */
  public onDeleteShc(event) {
    this.showConfirmMessage('expaccpt.shc.delete.confirmation').then(fulfilled => {
      if (!this.checkBoxShc()) {
        this.showErrorStatus('expaccpt.select.checkbox');
        return;
      }
      this.reqShc = (<NgcFormArray>this.form.get('shcArray')).getRawValue().filter(temp => temp.select);
      const s = this.reqShc;
      this.reqShc = new Array();
      s.forEach(ele => {
        ele.acceptanceDescription = this.acceptanceDescription;
        this.reqShc.push(ele);
      });
      this._acceptanceService.deleteShcDefinition(this.reqShc).subscribe(data => {
        this.resp = data;
        if (data.success) {
          for (let i = 0; i <= (<NgcFormArray>this.form.get('shcArray')).length; i++) {
            if ((<NgcFormArray>this.form.get('shcArray')).getRawValue()[i].select) {
              (<NgcFormArray>this.form.get('shcArray')).deleteValueAt(i);
              --i;
            }
          }
          this.showSuccessStatus('g.completed.successfully');
          // this.shcWindow.hide();
          this.shcWindow.hide();

          this.shcWindow.open();
          this.getDefaultDefinition();
        } else {
          this.showErrorStatus('expaccpt.user.not.deleted');
        }
      }, error => this.showErrorStatus('expaccpt.provide.details.shc.delete'));

    }
    ).catch(reason => {
    });
  }
  /**
  * This Function will work For Saving the record of handling definition
  * @param event
  */
  onSave(event) {
    const items = (<NgcFormArray>this.form.get('HandlingDefAccpt')).getRawValue();
    if (items && items.length) {
      for (let index = 0; index < items.length; index++) {
        const item = items[index];
        if (item.handlingDefinition && item.handlingDefinition.length > 1) {
          item.handlingDefinition = [item.handlingDefinition[0]];
        }
      }
    }
    const handlingDefList = new Array<any>();
    items.forEach(e => {
      e.handlingDefinition.forEach(es => {
        es.acceptanceDescription = e.acceptanceDescription;
        handlingDefList.push(es);
      });
    });
    this._acceptanceService.updateDefaultHandlingDefinition(handlingDefList).subscribe(data => {
      this.resp = data;
      this.arrayUser = this.resp.data;
      if (data.success) {
        this.showSuccessStatus('g.completed.successfully');
        this.getDefaultDefinition();
      } else {
        this.showErrorStatus('expaccpt.user.not.deleted');
      }
    },
      error => { this.showErrorStatus(error); });
  }
  /*
  *   This function is responsible for Fetching all default definition
  */
  public getDefaultDefinition() {
    const request = (<NgcFormGroup>this.form).getRawValue();
    this._acceptanceService.getDefaultDefinition().subscribe(data => {
      this.resp = data;
      this.arrayUser = this.resp.data;
      this.arrayUser.forEach(dateTime => {
        this.dateTimeArray = dateTime.handlingDefinition;
      });
      (<NgcFormArray>this.form.controls['HandlingDefAccpt']).patchValue(this.arrayUser);
    });
  }
  checkBoxShc() {
    const rows = this.form.getRawValue().shcArray;
    for (const row of rows) {
      if (row.select) {
        return true;
      }
    }
    return false;
  }
  checkBoxAirline() {
    const rows = this.form.getRawValue().carrierArray;
    for (const row of rows) {
      if (row.select) {
        return true;
      }
    }
    return false;
  }
}

// element.depTime = '2017-03-12 '+ element.depTime ;