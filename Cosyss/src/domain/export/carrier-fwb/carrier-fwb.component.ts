import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration  } from 'ngc-framework';
import { Router } from '@angular/router';
@Component({
  selector: 'app-carrier-fwb',
  templateUrl: './carrier-fwb.component.html',
  styleUrls: ['./carrier-fwb.component.scss']
})
/**
* Carrier FWB function allows the user to setup rules based on which Carriers can specify the FWB requirements
*/
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class CarrierFWBComponent extends NgcPage {
  private response;
  private indexModified = -1;
  private form: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    carrierFWB: new NgcFormArray([])
  });
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private router: Router) {
    super(appZone, appElement, appContainerElement);
    this.response = [
      {
        carrierCode: 'AUS',
        country: 'SYD',
        flightSector: 'PER',
        FWBRequest: 'PER',
        FHLRequest: 'Y',
        startDate: '13SEP2017',
        endDate: '13SEP2017',
        customerRequest: '777',
        airlineRequest: 'DDL',
        amendFWB: 'Y',
        amendeAWBFWB: 'N'
      },
      {
        carrierCode: 'AUS',
        country: 'SYD',
        flightSector: 'PER',
        FWBRequest: 'PER',
        FHLRequest: 'Y',
        startDate: '13SEP2017',
        endDate: '13SEP2017',
        customerRequest: '777',
        airlineRequest: 'DDL',
        amendFWB: 'Y',
        amendeAWBFWB: 'N'
      },
      {
        carrierCode: 'AUS',
        country: 'SYD',
        flightSector: 'PER',
        FWBRequest: 'PER',
        FHLRequest: 'Y',
        startDate: '13SEP2017',
        endDate: '13SEP2017',
        customerRequest: '777',
        airlineRequest: 'DDL',
        amendFWB: 'Y',
        amendeAWBFWB: 'N'
      },
      {
        carrierCode: 'AUS',
        country: 'SYD',
        flightSector: 'PER',
        FWBRequest: 'PER',
        FHLRequest: 'Y',
        startDate: '13SEP2017',
        endDate: '13SEP2017',
        customerRequest: '777',
        airlineRequest: 'DDL',
        amendFWB: 'Y',
        amendeAWBFWB: 'N'
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
    this.form.controls.carrierFWB.patchValue(this.response);
  }
  /**
  * This function is responsible for deleting the record
  * @param event Event
  */
  onDelete(index) {
    this.showConfirmMessage('export.delete.user.assigned.role.confirmation').then(fulfilled => {
      (<NgcFormArray>this.form.controls['carrierFWB']).deleteValueAt(index);
      const tableArray = (<NgcFormArray>this.form.controls['carrierFWB']).getRawValue();
    }
    ).catch(reason => { });
  }
  /**
  * This function is responsible for adding new record
  */
  onAddRow() {
    (<NgcFormArray>this.form.controls.carrierFWB).addValue([this.form.getRawValue()]);
  }
}
