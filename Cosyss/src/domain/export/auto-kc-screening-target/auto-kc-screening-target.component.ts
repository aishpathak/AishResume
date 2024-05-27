import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, NgModule, ViewChild, Input } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration } from 'ngc-framework';
import { ExportService } from '../export.service';

@Component({
  selector: 'app-auto-kc-screening-target',
  templateUrl: './auto-kc-screening-target.component.html',
  styleUrls: ['./auto-kc-screening-target.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class AutoKcScreeningTargetComponent extends NgcPage {

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private route: ActivatedRoute, private router: Router, private exportService: ExportService) {
    super(appZone, appElement, appContainerElement);
  }

  public screeningform: NgcFormGroup = new NgcFormGroup({
    autoKCSHCExclusion: new NgcFormArray([

    ]),
    autoKCCountryExclusion: new NgcFormArray([

    ]),
    autoKCAirlineExclusions: new NgcFormArray([

    ]),
    autoKCAirlineInclusions: new NgcFormArray([

    ]),
    autoKCConfigTerminal: new NgcFormArray([

    ]),
    autoKCNotification: new NgcFormArray([
      new NgcFormGroup({
        carrierGroup: new NgcFormControl(),
        carrierCodeList: new NgcFormControl(),
        notificationType: new NgcFormControl(),
        notificationAddressDetails: new NgcFormArray([
          new NgcFormGroup({
            notificationAddress: new NgcFormControl()
          })
        ])
      })
    ]),
    autoKCTargetConfigSetUp: new NgcFormArray([
    ]),

  });

  ngOnInit() {
    super.ngOnInit();
    this.fetchAutoKCConfiguration();
  }

  addConfig(event) {
    (<NgcFormArray>this.screeningform.controls['autoKCTargetConfigSetUp']).addValue([
      {
        handledAs: '',
        flightType: '',
        targetPercentage: 0,
        bufferPercentage: 0,
        resetTimeOfDay: '00:00',
        minConnectionTime: 0,
        minPieces: 0,
        maxPieces: 0,
        minWeight: 0,
        maxWeight: 0
      }
    ]);

  }

  addShcGrp(event) {
    (<NgcFormArray>this.screeningform.controls['autoKCSHCExclusion']).addValue([
      {
        shcGroup: '',
        configType: 'SHC',
        includeExclude: 'Exclude'
      }
    ]);

  }
  addAirlineInc(event) {
    (<NgcFormArray>this.screeningform.controls['autoKCAirlineInclusions']).addValue([
      {
        handledAs: '',
        carrierGroupList: null,
        configType: 'Airline',
        includeExclude: 'Include',
        carrierList: null

      }
    ]);

  }

  addAirlineExc(event) {
    (<NgcFormArray>this.screeningform.controls['autoKCAirlineExclusions']).addValue([
      {
        handledAs: '',
        carrierGroupList: null,
        configType: 'Airline',
        includeExclude: 'Exclude',
        carrierList: null
      }
    ]);
  }
  addCountry(event) {
    (<NgcFormArray>this.screeningform.controls['autoKCCountryExclusion']).addValue([
      {
        cargoInCountryAs: '',
        countryList: null,
        configType: 'Country',
        includeExclude: 'Exclude'

      }
    ]);
  }

  addTerminalPeakHours(event) {
    (<NgcFormArray>this.screeningform.controls['autoKCConfigTerminal']).addValue([
      {
        terminalCode: null,
        fromTime: null,
        toTime: null,
        loadFactor: 0,
        isExempted: false
      }
    ]);
  }


  addNotifications(event) {
    (<NgcFormArray>this.screeningform.get(['autoKCNotification'])).addValue([
      {
        carrierGroup: '',
        carrierCodeList: [],
        flagCRUD: 'C',
        notificationType: '',
        notificationAddressDetails: [{
          notificationAddress: ''
        }]
      }
    ]);
    console.clear();
  }

  addNotificationsDetails(index, sindex) {
    (<NgcFormArray>this.screeningform.get(['autoKCNotification', index, 'notificationAddressDetails'])).addValue([
      {
        notificationAddress: ''
      }
    ]);
  }

  saveAutoKCConfig(event) {
    let request = this.screeningform.getRawValue();
    this.exportService.createAutoKCConfig(request).subscribe(response => {
      this.refreshFormMessages(response);
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus("g.operation.successful");
        this.fetchAutoKCConfiguration();
      }

    }, error => {
      this.showErrorStatus(error);
    });


  }

  fetchAutoKCConfiguration() {
    this.exportService.fetchAutoKCConfig().subscribe(response => {

      if (response.data) {
        this.screeningform.get('autoKCTargetConfigSetUp').patchValue(response.data.autoKCTargetConfigSetUp);
        this.screeningform.patchValue(response.data);
      }
      if (response.messageList === null || response.messageList.length === 0) {
        this.showSuccessStatus("g.operation.successful");
      }
    });
  }

  onNotificationDelete(event, index: any): void {
    (<NgcFormArray>this.screeningform.controls['autoKCNotification']).markAsDeletedAt(event);
  }

  onNotificationDtlDelete(index, sindex) {
    (this.screeningform.get(['autoKCNotification', index, 'notificationAddressDetails', sindex]) as NgcFormGroup).markAsDeleted();
  }

  onAutoKCSetupConfigDelete(index) {
    (this.screeningform.get(['autoKCTargetConfigSetUp', index]) as NgcFormGroup).markAsDeleted();
  }

  onAutoKCSHCDelete(index) {
    (this.screeningform.get(['autoKCSHCExclusion', index]) as NgcFormGroup).markAsDeleted();
  }

  onAutoKCCountryExclusionDelete(index) {
    (this.screeningform.get(['autoKCCountryExclusion', index]) as NgcFormGroup).markAsDeleted();
  }

  onAutoKCAirlineInclusionsDelete(index) {
    (this.screeningform.get(['autoKCAirlineInclusions', index]) as NgcFormGroup).markAsDeleted();
  }

  onAutoKCAirlineExclusionsDelete(index) {
    (this.screeningform.get(['autoKCAirlineExclusions', index]) as NgcFormGroup).markAsDeleted();
  }

  onAutoKCTerminalDelete(index) {
    (this.screeningform.get(['autoKCConfigTerminal', index]) as NgcFormGroup).markAsDeleted();
  }
}
