/**
 * @copyright SATS Singapore 2017-18
 */
// Angular
import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, ContentChildren, forwardRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
// Application
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration, BaseResponse
} from 'ngc-framework';
// Function
import { ImportExportIndicator, MstAssignTeamToGroup, MstAssignTeamToGroupList, SearchGroup, MstAssignTeamToAirport } from '../tracing.shared';
import { TracingService } from '../tracing.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngc-app-assign-team-to-airport-group',
  providers: [TracingService],
  templateUrl: './assign-team-to-airport-group.component.html',
  styleUrls: ['./assign-team-to-airport-group.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class AssignTeamToAirportGroupComponent extends NgcPage {
  private addFlag: boolean = false;
  private showCarrierGp: boolean = false;
  private isDisabled: boolean = true;
  private airports: NgcFormControl = new NgcFormControl();
  private assigneeTeamGroup: NgcFormGroup = new NgcFormGroup({
    searchCarrierGroupType: new NgcFormControl(),
    carrierGroupType: new NgcFormControl(),
    carrierGroupTypeDesc: new NgcFormControl(),
    associatedCarrierType: new NgcFormControl(),
    associatedCarrierTypeDesc: new NgcFormControl(),
    groupList: new NgcFormArray([])
  });

  /**
   * Initialize
   *
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, public tracingService: TracingService) {
    super(appZone, appElement, appContainerElement);
  }

  /**
   *
   */
  ngOnInit() {
    super.ngOnInit();
    //
    // this.assigneeTeamGroup.valueChanges.subscribe(() => {
    //   this.updateAirportValidators();
    // });
    (<NgcFormArray>this.assigneeTeamGroup.get('groupList')).valueChanges.subscribe((data) => {
    });
  }

  checkAirport(checkAirport: string, indicator: string, index: number) {
    let count = 0;
    if (checkAirport.length === 3) {
      let groupList: MstAssignTeamToGroupList = <MstAssignTeamToGroupList><any>this.assigneeTeamGroup.getRawValue();
      let gpCount = 0;
      groupList.groupList.forEach((group) => {
        if (indicator === group.importExportIndicator) {
          let airportCount = 0;
          group.teamToAirports.forEach((airport) => {
            if (checkAirport.toUpperCase() === airport.airportCode) {
              count++;
              if (count == 1) {
                let gp = this.assigneeTeamGroup.get(['groupList', gpCount]) as NgcFormGroup
                this.showFormControlErrorMessage(gp.get(['teamToAirports', airportCount, 'airportCode']) as NgcFormControl, "", "Duplicate");
              }
            }
            airportCount++;
          })
        }
        gpCount++;
      })
    }
  }

  private airportCode: string = "";
  checkAirportAirport(event, indicator, index) {
    if (event.key == 'Enter' || event.keyCode == 13 || (event.which && event.which == 13)) {
      let airport: SearchGroup = new SearchGroup();
      airport.importExpIndicator = indicator;
      airport.searchKey = this.assigneeTeamGroup.get('carrierGroupType').value;
      airport.airportCode = this.airportCode
      if (this.airportCode.length == 3) {
        //    this.showErrorMessage('Invalid airport');
        this.checkAirport(event, indicator, index);
        return false;
      }
    } else {
      this.airportCode = event.target.value;
    }
  }
  /**
   * On Carrier Select
   *
   * @param event Event
   */
  private onCarrierSelect(event) {
    if (event.code != null) {
      this.isDisabled = false;
      // this.showCarrierGp = false;
      // this.onSearch();
    }
  }

  /**
   * Add new Group
   *
   * @param importExportIndicator Import/Export Indicator
   */
  addGroup(importExportIndicator: string) {
    let airportGroup: MstAssignTeamToGroup = new MstAssignTeamToGroup();
    // Set Default
    airportGroup.carrierCode = this.assigneeTeamGroup.get('carrierGroupType').value;
    airportGroup.importExportIndicator = importExportIndicator;
    airportGroup.groupName = '';
    // Add airportGroup
    (<NgcFormArray>this.assigneeTeamGroup.get('groupList')).addValue([airportGroup]);
  }


  onSave(event: any) {
    let groupList: MstAssignTeamToGroupList = <MstAssignTeamToGroupList><any>this.assigneeTeamGroup.getRawValue();
    this.assigneeTeamGroup.validate();
    if (this.assigneeTeamGroup.invalid) {
      return;
    }
    if (!groupList.groupList.length) {
      this.showSuccessStatus('tracing.asg.success');
      return;
    }
    if (!groupList) { return; }
    this.tracingService.saveAssignTeamGp(groupList).subscribe((response) => {
      //refresh page
      if (response.success) {
        this.showSuccessStatus('g.completed.successfully');
        // this.onSearch();
      } else {
        if (response.messageList && response.messageList.length > 0) {
          this.refreshFormMessages(response);
        } else {
          this.refreshFormMessages(response.data);
        }
      }
    }, (error) => {
      // this.showErrorStatus(error);
    });
  }

  onSearch() {
    this.showCarrierGp = true;
    let sgp: SearchGroup = new SearchGroup();
    (this.assigneeTeamGroup.get('carrierGroupType')).setValue(this.assigneeTeamGroup.get('searchCarrierGroupType').value);
    (this.assigneeTeamGroup.get('carrierGroupTypeDesc')).setValue(this.assigneeTeamGroup.get('carrierGroupType').value);
    sgp.searchKey = this.assigneeTeamGroup.get('carrierGroupType').value;
    // Reset Form Message
    this.resetFormMessages();
    //
    this.tracingService.searchAssignTeamGp(sgp).subscribe((response) => {
      if (response.success) {

        // this.showCarrierGp = false;
        if (response.data.messageList.length > 0) {
          this.refreshFormMessages(response.data);
        } else {
          this.setGroupList(response.data);
        }
      }
    }, (error) => {
      //this.showErrorStatus(error);
    })
  }

  setGroupList(response: any) {
    if (response.groupList && response.groupList.length > 0) {
      (<Array<any>>response.groupList).forEach((record: any) => {
        record.airports = [];
        // construct formControl airports
        if (record && record.teamToAirports && record.teamToAirports.length > 0) {
          (<Array<MstAssignTeamToAirport>>record.teamToAirports).forEach((airport: MstAssignTeamToAirport) => {
            record.airports.push(airport.airportCode);
          });
        }
      });
    }
    this.assigneeTeamGroup.get('groupList').patchValue(response.groupList);
  }

  // Delete The group
  onDelete(index: any) {

    const groupList: MstAssignTeamToGroupList = <MstAssignTeamToGroupList><any>this.assigneeTeamGroup.getRawValue();
    let message = 'tracing.delete.confirm';

    this.showConfirmMessage(message).then(fulfilled => {

      this.tracingService.deleteAssignTeamGp(groupList.groupList[index]).subscribe((response) => {
        this.refreshFormMessages(response.data);
        // refresh page
        if (response.success) {
          // this.setGroupList(response.data);
          (<NgcFormArray>this.assigneeTeamGroup.get('groupList')).deleteValueAt(index);
          this.showSuccessStatus('g.deleted.successfully');
        } else {
          if (groupList.groupList[index].flagCRUD == "C") {
            if (!groupList.groupList[index].airports || groupList.groupList[index].airports.length == 0 || groupList.groupList[index].groupName == "" || groupList.groupList[index].teamId == null) {
              (<NgcFormArray>this.assigneeTeamGroup.get('groupList')).deleteValueAt(index);
              this.showSuccessStatus('g.deleted.successfully');
            }
          }
        }
      }, (error) => {
        //  this.showErrorStatus(error);
      })
    });
  }

  checkDuplicate(group, index, arr) {
    for (let inx = index + 1; inx < arr.length; inx++) {
      if (group.groupName == arr[inx].groupName) {
        return arr[inx];
      }
    }
    return;
  }
  onCancel(event) {
    this.assigneeTeamGroup.reset();
    this.navigateHome();
  }

  /**
   * Update Airport Validators
   */
  private updateAirportValidators() {
    const groupList: NgcFormArray = this.assigneeTeamGroup.get('groupList') as NgcFormArray;
    //
    if (groupList && groupList.controls) {
      groupList.controls.forEach((group: NgcFormGroup) => {
        const airports: NgcFormControl = group.get('airports') as NgcFormControl;
        //
        if (!airports || !airports.value || (airports.value as Array<any>).length == 0) {
          airports.setValidators([Validators.required]);
        } else {
          airports.clearValidators();
        }
      });
    }
  }
}
