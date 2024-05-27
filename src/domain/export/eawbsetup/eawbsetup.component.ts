import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration  } from 'ngc-framework';
import { Router } from '@angular/router';
@Component({
  selector: 'app-eawbsetup',
  templateUrl: './eawbsetup.component.html',
  styleUrls: ['./eawbsetup.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class EawbsetupComponent extends NgcPage {
  private responseSector;
  private responseAgent;
  private form: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    allCosysAgent: new NgcFormControl(),
    finalStage: new NgcFormControl(),
    startDate: new NgcFormControl(),
    endDate: new NgcFormControl(),
    eAWBSetupSector: new NgcFormArray([]),
    eAWBSetupAgent: new NgcFormArray([])
  });
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router) {
    super(appZone, appElement, appContainerElement);
    this.responseSector = [
      {
        sector: 'AUS',
        singleProcessPrint: 'SYD',
        copies: 'PER',
        sectorStartDate: '13SEP2017',
        sectorEndDate: '13SEP2017'
      },
      {
        sector: 'AUS',
        singleProcessPrint: 'SYD',
        copies: 'PER',
        sectorStartDate: '13SEP2017',
        sectorEndDate: '13SEP2017'
      },
      {
        sector: 'AUS',
        singleProcessPrint: 'SYD',
        copies: 'PER',
        sectorStartDate: '13SEP2017',
        sectorEndDate: '13SEP2017'
      },
      {
        sector: 'AUS',
        singleProcessPrint: 'SYD',
        copies: 'PER',
        sectorStartDate: '13SEP2017',
        sectorEndDate: '13SEP2017'
      }
    ];
    this.responseAgent = [
      {
        agent: 'FEDEX',
        agentName: 'KISLAY',
        agentStartDate: '13SEP2017',
        agentEndDate: '13SEP2017'
      },
      {
        agent: 'FEDEX',
        agentName: 'KISLAY',
        agentStartDate: '13SEP2017',
        agentEndDate: '13SEP2017'
      },
      {
        agent: 'FEDEX',
        agentName: 'KISLAY',
        agentStartDate: '13SEP2017',
        agentEndDate: '13SEP2017'
      },
      {
        agent: 'FEDEX',
        agentName: 'KISLAY',
        agentStartDate: '13SEP2017',
        agentEndDate: '13SEP2017'
      }
    ];
  }
  ngOnInit() {
  }
  /**
  * On Destroy
  */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
  /**
  * This function is responsible for searching the records
  */
  onSearch() {
    this.form.controls.eAWBSetupSector.patchValue(this.responseSector);
    this.form.controls.eAWBSetupAgent.patchValue(this.responseAgent);
  }
  /**
  * This is a confirmation window before deletion of any record
  * @param event Event
  */
  onDeleteSector(index) {
    this.showConfirmMessage('export.delete.user.assigned.role.confirmation').then(fulfilled => {
      (<NgcFormArray>this.form.controls['eAWBSetupSector']).deleteValueAt(index);
      const tableArray = (<NgcFormArray>this.form.controls['eAWBSetupSector']).getRawValue();
    }
    ).catch(reason => { });
  }
  /**
  * This is a confirmation window before deletion of any record
  * @param event Event
  */
  onDeleteAgent(index) {
    this.showConfirmMessage('export.delete.user.assigned.role.confirmation').then(fulfilled => {
      (<NgcFormArray>this.form.controls['eAWBSetupAgent']).deleteValueAt(index);
      const tableArray = (<NgcFormArray>this.form.controls['eAWBSetupAgent']).getRawValue();
    }
    ).catch(reason => { });
  }
}
