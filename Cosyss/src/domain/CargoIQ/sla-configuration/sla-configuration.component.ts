import { Validators } from '@angular/forms';
import { CargoIQService } from '../cargoIQ.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcFormControl, NgcFormArray, PageConfiguration, NgcPage, NgcFormGroup, NgcUtility, DateTimeKey, NgcReportComponent } from 'ngc-framework';

@Component({
  selector: 'app-sla-configuration',
  templateUrl: './sla-configuration.component.html',
  styleUrls: ['./sla-configuration.component.css']
})

@PageConfiguration({
  trackInit: true
  // callNgOnInitOnClear: true
})
export class SlaConfigurationComponent extends NgcPage {
  resp: any;
  showTable = false;
  flowTypeData: any;
  searchRequest: any;
  tableLength: any = 0;
  reportParameters: any = new Object();
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;

  private form: NgcFormGroup = new NgcFormGroup({
    airline: new NgcFormControl(),
    flowType: new NgcFormControl(),
    flightType: new NgcFormControl(),
    slaConfiguration: new NgcFormArray([]),
    interfaceMessageTypesId: new NgcFormControl(),
    destination: new NgcFormControl()


  });
  /**
  * Initialize
  * @param appZone Ng Zone
  * @param appElement Element Ref
  * @param appContainerElement View Container Ref
  */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private _cargoIQService: CargoIQService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    let forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {
      // forwardedData = this.searchRequest;
      this.form.patchValue(forwardedData);
    }
  }
  protected afterFocus() {
    this.async(() => {
      try {
        (this.form.get(['slaConfiguration', this.tableLength, 'interfaceMessageTypesId']) as NgcFormControl).focus();
      } catch (e) { }
    }, 1);
  }

  onCreate(event) {
    this.showTable = true;
    this.tableLength = this.form.get('slaConfiguration').value.length;
    for (let i = 0; i < 5; i++) {
      (<NgcFormArray>this.form.controls['slaConfiguration']).addValue([
        {
          airline: null,
          slaTime: null,
          flowType: null,
          flightType: null,
          ciqMember: false,
          destination: null,
          aircraftType: null,
          // iataAirline: false,
          interfaceMessageTypesId: null,
          fsuMessageFlag: null
        }
      ]);
    }
  }

  onSearch(event) {
    // if(this.form.get('interfaceMessageTypesId').value || this.form.get('airline').value ) {
    const request = this.form.getRawValue();
    this.searchRequest = {
      interfaceMessageTypesId: request.interfaceMessageTypesId,
      airline: request.airline,
      flowType: request.flowType,
      flightType: request.flightType,
      destination: request.destination
    }
    this._cargoIQService.searchSLAConfiguration(this.searchRequest).subscribe(response => {
      this.refreshFormMessages(response);
      this.resp = response.data;
      if (this.resp.length !== 0) {
        this.showTable = true;
        (<NgcFormArray>this.form.controls['slaConfiguration']).patchValue(this.resp);
        console.log((<NgcFormArray>this.form.controls['slaConfiguration']).getRawValue() + JSON.stringify(event));
      } else {
        this.showTable = false;
        this.showInfoStatus('export.no.data.found');
        (<NgcFormArray>this.form.controls['slaConfiguration']).resetValue([]);
      }
    })

  }

  onSave(event) {
    const saveRequest = [];
    let request = (<NgcFormArray>this.form.get(['slaConfiguration'])).getRawValue();
    for (const eachRow of request) {
      if (eachRow.interfaceMessageTypesId && eachRow.airline && eachRow.slaTime) {
        saveRequest.push(eachRow);
      }
    }
    request = request.filter(value => value.flagCRUD != 'D');
    for (let i = 0; i < request.length; i++) {
      for (let j = 0; j < request.length; j++) {
        if (i != j) {
          if (request[i].interfaceMessageTypesId || request[i].airline || request[i].slaTime) {
            if (!request[i].interfaceMessageTypesId || !request[i].airline || !request[i].slaTime || !request[i].flightType || !request[i].flowType) {
              this.showErrorStatus("ciq.enter.all.mandatory");
              return;
            }
          }
        }

      }
    }

    this._cargoIQService.saveSLAConfiguration(saveRequest).subscribe(response => {
      this.refreshFormMessages(response);
      this.resp = response.data;
      if (this.resp) {
        this.onSearch(event);
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.showErrorStatus(response.messageList[0].message);
      }
      (<NgcFormArray>this.form.controls['slaConfiguration']).patchValue(this.resp);
    })
  }

  onNotifySetup(index) {
    if (this.form.get(['slaConfiguration', index, 'cargoiQSLAConfigurationId'])) {
      // const request = {
      //   cargoiQSLAConfigurationId: (<NgcFormArray>this.form.get(['slaConfiguration', index, 'cargoiQSLAConfigurationId'])).value
      // }
      const request = (<NgcFormArray>this.form.get(['slaConfiguration', index])).getRawValue();
      this._cargoIQService.dataFromSlatoEmail = this.searchRequest;
      this.navigateTo(this.router, '/cargoIQ/emailconfiguration', request);
    } else {
      this.showInfoStatus('ciq.save.all.record.before.notifying');
    }
  }

  onDeleteCiqSLAConfiguration(index) {
    (this.form.get(['slaConfiguration', index]) as NgcFormGroup).markAsDeleted();
  }

  onFlowType(event) {
    this.form.get('interfaceMessageTypesId').reset();
    console.log(event);
    if (event.code === 'E') {
      this.flowTypeData = 'E'
    } else if (event.code === 'I') {
      this.flowTypeData = 'I'
    } else if (event.code === 'T') {
      this.flowTypeData = 'T'
    }
  }

  onClear(event) {
    this.form.reset();
    this.showTable = false;
    this.resetFormMessages();
    this.form.get('airline').patchValue(null);
    this.form.get('interfaceMessageTypesId').patchValue(null);
    (<NgcFormArray>this.form.get('slaConfiguration')).resetValue([]);
    this.form.get('flightType').setValue('B');
  }

  onCancel(event) {
    this.navigateTo(this.router, '**', null);
  }

  onPrint() {
    const request = this.form.getRawValue();
    this.reportParameters.messageType = request.interfaceMessageTypesId;
    this.reportParameters.flightType = request.flightType;
    this.reportParameters.airline = request.airline;
    this.reportParameters.flowType = request.flowType;
    this.reportParameters.destination = request.destination;
    // alert(JSON.stringify(this.reportParameters));
    this.reportWindow.open();
  }

  forCiqMemberChange(event, index) {
    this.form.get(['slaConfiguration', index, 'iataAirline']).setValue(event.param4);
    this.form.get(['slaConfiguration', index, 'ciqMemberData']).setValue(event.param3);
  }

  onSelectMessageType(event, index) {
    if (event.param6 == "0")
      this.form.get(['slaConfiguration', index, 'fsuMessageFlag']).setValue(false);
    else
      this.form.get(['slaConfiguration', index, 'fsuMessageFlag']).setValue(true);

    let flagCRUD = this.form.get(['slaConfiguration', index]).value.flagCRUD;
    if (flagCRUD == 'C' || flagCRUD == 'U') {
      if (event.param1 === '1' && event.param2 === '0' && event.param3 === '0') {
        this.form.get(['slaConfiguration', index, 'flowType']).setValue('I');
      } else if (event.param1 === '0' && event.param2 === '1' && event.param3 === '0') {
        this.form.get(['slaConfiguration', index, 'flowType']).setValue('E');
      } else if (event.param1 === '1' && event.param2 === '0' && event.param3 === '1') {
        this.form.get(['slaConfiguration', index, 'flowType']).setValue('I');
      } else if (event.param1 === '0' && event.param2 === '1' && event.param3 === '1') {
        this.form.get(['slaConfiguration', index, 'flowType']).setValue('E');
      } else if (event.param1 === '1') {
        this.form.get(['slaConfiguration', index, 'flowType']).setValue('I');
      } else if (event.param2 === '1') {
        this.form.get(['slaConfiguration', index, 'flowType']).setValue('E');
      } else if (event.param3 === '1') {
        this.form.get(['slaConfiguration', index, 'flowType']).setValue('T');
      }

      //    else if (event.param1 === '1' && event.param2 === '1' && event.param3 === '1') {
      //     this.form.get(['slaConfiguration', index, 'flowType']).setValue(null);
      //   }
    }
  }

  onSearchSelectMessageType(event) {

    // if (event.param1 === '1' && event.param2 === '0' && event.param3 === '0') {
    //   this.form.get(['flowType']).setValue('I');
    // } else if (event.param1 === '0' && event.param2 === '1' && event.param3 === '0') {
    //   this.form.get(['flowType']).setValue('E');
    // } else if (event.param1 === '0' && event.param2 === '0' && event.param3 === '1') {
    //   this.form.get(['flowType']).setValue('T');
    // }
  }
}



