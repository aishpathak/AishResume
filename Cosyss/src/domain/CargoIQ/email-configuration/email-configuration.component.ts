import { Validators } from '@angular/forms';
import { CargoIQService } from '../cargoIQ.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcFormControl, NgcFormArray, PageConfiguration, NgcPage, NgcFormGroup, NgcUtility, DateTimeKey } from 'ngc-framework';
import { CargoIQEmailNotification, Member } from '../cargoIQ.sharedmodel';

@Component({
  selector: 'app-email-configuration',
  templateUrl: './email-configuration.component.html',
  styleUrls: ['./email-configuration.component.css']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class EmailConfigurationComponent extends NgcPage {
  resp: any;
  reportType: any;
  showRow = false;
  disableReport = false;

  private form: NgcFormGroup = new NgcFormGroup({
    generatedBy: new NgcFormControl(),
    ciqRptGenDay: new NgcFormControl(),
    ciqRptGenWeek: new NgcFormControl(),
    ciqRptGenTime: new NgcFormControl(),
    ciqReportType: new NgcFormControl(),
    transitFlag: new NgcFormControl(0),
    carrierCode: new NgcFormControl(),
    carrierList: new NgcFormArray([
      new NgcFormGroup({
        ciqRptGenDay: new NgcFormControl(),
        ciqRptGenWeek: new NgcFormControl(),
        ciqRptGenTime: new NgcFormControl(),
        carrierCode: new NgcFormControl(),
        schedule: new NgcFormArray([]),
        scheduleIata: new NgcFormArray([]),
      })
    ]),
    fsuMessageType: new NgcFormControl()
  });

  forwardedData: any;
  showMessageType: any;
  showCarrierCode: any;
  private airlineParameter = {};

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
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData) {
      this.form.get('carrierCode').setValue(this.forwardedData.airline);
      this.form.get('fsuMessageType').setValue(this.forwardedData.interfaceMessageTypesId);
      this.form.get('ciqReportType').setValue('FSU Messaging Exception Report');
      this.form.get('fsuMessageType').setValidators([Validators.required]);
      this.form.get('carrierCode').setValidators([Validators.required]);
      this.showMessageType = true;
      this.showCarrierCode = true;
      this.showRow = false;
      this.disableReport = true;
      this.onSearchCiq();
    }
  }

  onSearchCiq() {
    this.form.validate();
    if (this.form.get('ciqReportType').invalid || this.form.get('fsuMessageType').invalid || this.form.get('carrierCode').invalid) {
      return;
    }
    const onSearchCiq = this.form.getRawValue();
    this._cargoIQService.getEmailConfiguration(onSearchCiq).subscribe(response => {
      this.resp = response.data;
      this.showRow = true;
      this.form.get('carrierList').patchValue(this.resp.carrierList);

      this.resp.carrierList.forEach((carrier, index) => {
        if (carrier.schedule) {
          carrier.schedule.forEach((schedule, subindex) => {
            if (!schedule.membersInfo || !schedule.membersInfo.length) {
              this.onAddSATS(index, subindex);
            }
          })
        }
        if (carrier.scheduleIata) {
          carrier.scheduleIata.forEach((schedule, subindex) => {
            if (!schedule.membersInfo || !schedule.membersInfo.length) {
              this.onAddIATA(index, subindex);
            }
          })
        }
      })
    })
  }

  onAddSATS(index, subIndex) {
    (<NgcFormArray>this.form.get(['carrierList', index, 'schedule', subIndex, 'membersInfo'])).addValue([
      {
        emailTo: '',
        weekly: false,
        daily: false,
        monthly: false
      }
    ]);
  }
  onAddIATA(index, subIndex) {
    (<NgcFormArray>this.form.get(['carrierList', index, 'scheduleIata', subIndex, 'membersInfo'])).addValue([
      {
        emailTo: '',
        weekly: false,
        daily: false,
        monthly: false
      }
    ]);
  }

  onSATSDelete(index, subIndex, memberIndex) {
    (this.form.get(['carrierList', index, 'schedule', subIndex, 'membersInfo', memberIndex]) as NgcFormGroup).markAsDeleted();
  }

  onIATADelete(index, subIndex, memberIndex) {
    (this.form.get(['carrierList', index, 'scheduleIata', subIndex, 'membersInfo', memberIndex]) as NgcFormGroup).markAsDeleted();
  }

  onSelectReportType(event) {
    this.refreshControlValues();
    this.showRow = false;
    if (event.code) {
      this.reportType = event.code;
      if (event.code === 'FSU Messaging Exception Report' || event.code === 'FSU Messaging Report') {
        this.form.get('fsuMessageType').setValidators([Validators.required]);
        this.form.get('carrierCode').setValidators([Validators.required]);
        this.showMessageType = true;
      } else {
        this.form.get('fsuMessageType').clearValidators();
        this.form.get('carrierCode').clearValidators();
      }

    }
  }

  onSave() {
    this.resetFormMessages();
    this.form.validate();

    if (!this.form.get(['carrierList', 0, 'ciqRptGenDay']).value && !this.form.get(['carrierList', 0, 'ciqRptGenWeek']).value && !this.form.get(['carrierList', 0, 'ciqRptGenTime']).value) {
      this.showFormControlErrorMessage(<NgcFormControl>this.form.get(['carrierList', 0, 'ciqRptGenDay']), 'ciqReportGeneration');
      this.showFormControlErrorMessage(<NgcFormControl>this.form.get(['carrierList', 0, 'ciqRptGenWeek']), 'ciqReportGeneration');
      this.showFormControlErrorMessage(<NgcFormControl>this.form.get(['carrierList', 0, 'ciqRptGenTime']), 'ciqReportGeneration');
      return;
    }
    const saveData = this.resp;
    const formData = this.form.getRawValue();
    saveData.ciqReportType = formData.ciqReportType;
    saveData.carrierCode = formData.carrierCode;
    saveData.transitFlag = formData.transitFlag;

    let updateReportConfigFlag: boolean = false;
    let updateMultipleEmailConfig: boolean = false;
    let ciqRptGenWeek: any;
    let ciqRptGenTime: any;
    let ciqRptGenDay: any;
    let satsEmail: Array<Member> = new Array();
    let iataEmail: Array<Member> = new Array();

    ciqRptGenWeek = formData.carrierList[0].ciqRptGenWeek;
    ciqRptGenTime = formData.carrierList[0].ciqRptGenTime;
    ciqRptGenDay = formData.carrierList[0].ciqRptGenDay;
    satsEmail = formData.carrierList[0].schedule[0].membersInfo;
    satsEmail.filter(member => member.emailTo != null && member.emailTo != '');
    iataEmail = formData.carrierList[0].scheduleIata[0].membersInfo;
    iataEmail.filter(member => member.emailTo != null && member.emailTo != '');

    for (let eachRow of saveData.carrierList) {
      eachRow.ciqRptGenTime = ciqRptGenTime;
      eachRow.ciqRptGenWeek = ciqRptGenWeek;
      eachRow.ciqRptGenDay = +ciqRptGenDay;
      for (let eachSchedule of eachRow.schedule) {
        let generatedBy: string = '';
        eachSchedule.ciqRptGenTime = eachRow.ciqRptGenTime ? eachRow.ciqRptGenTime : null;
        eachSchedule.ciqRptGenWeek = eachRow.ciqRptGenWeek ? eachRow.ciqRptGenWeek : null;
        eachSchedule.ciqRptGenDay = +eachRow.ciqRptGenDay ? +eachRow.ciqRptGenDay : null;
        eachSchedule.ciqReportType = saveData.ciqReportType;
        eachSchedule.transitFlag = saveData.transitFlag;
        if (eachSchedule.flagCRUD == 'R') {
          eachSchedule.flagCRUD = 'U';
        }
        if (eachSchedule.ciqRptGenTime) {
          generatedBy += 'D';
        }
        if (eachSchedule.ciqRptGenWeek) {
          if (eachSchedule.ciqRptGenTime) {
            generatedBy += ', W';
          } else {
            generatedBy += 'W';
          }
        }
        if (eachSchedule.ciqRptGenDay) {
          if (eachSchedule.ciqRptGenTime || eachSchedule.ciqRptGenWeek) {
            generatedBy += ', M';
          } else {
            generatedBy += 'M';
          }
        }
        eachSchedule.generatedBy = generatedBy;
      }
      for (let eachSchedule of eachRow.scheduleIata) {
        let generatedBy: string = '';
        eachSchedule.ciqRptGenTime = eachRow.ciqRptGenTime ? eachRow.ciqRptGenTime : null;
        eachSchedule.ciqRptGenWeek = eachRow.ciqRptGenWeek ? eachRow.ciqRptGenWeek : null;
        eachSchedule.ciqRptGenDay = +eachRow.ciqRptGenDay ? +eachRow.ciqRptGenDay : null;
        eachSchedule.ciqReportType = saveData.ciqReportType;
        eachSchedule.transitFlag = saveData.transitFlag;
        if (eachSchedule.flagCRUD == 'R') {
          eachSchedule.flagCRUD = 'U';
        }
        if (eachSchedule.ciqRptGenTime) {
          generatedBy += 'D';
        }
        if (eachSchedule.ciqRptGenWeek) {
          if (eachSchedule.ciqRptGenTime) {
            generatedBy += ', W';
          } else {
            generatedBy += 'W';
          }
        }
        if (eachSchedule.ciqRptGenDay) {
          if (eachSchedule.ciqRptGenTime || eachSchedule.ciqRptGenWeek) {
            generatedBy += ', M';
          } else {
            generatedBy += 'M';
          }
        }
        eachSchedule.generatedBy = generatedBy;
      }
    }
    saveData.carrierList.forEach(carrier => {
      if (carrier.schedule && carrier.schedule.length) {
        carrier.schedule.forEach(schedule => {
          if (schedule.membersInfo) {
            schedule.membersInfo = new Array();
            satsEmail.forEach(emailConfig => {
              schedule.membersInfo.push(Object.assign({}, emailConfig));
            })
            schedule.membersInfo = schedule.membersInfo.filter(member => member.emailTo != null && member.emailTo != '');
            schedule.membersInfo.forEach(member => {
              if (!carrier.ciqRptGenWeek) {
                member.weekly = false;
              }
              if (!carrier.ciqRptGenTime) {
                member.daily = false;
              }
              if (!carrier.ciqRptGenDay) {
                member.monthly = false;
              }
              if ((!carrier.ciqRptGenWeek || !carrier.ciqRptGenTime || !carrier.ciqRptGenDay) && member.flagCRUD == 'R') {
                member.flagCRUD = 'U';
              }
            })
          }
        })
      }
      if (carrier.scheduleIata && carrier.scheduleIata.length) {
        carrier.scheduleIata.forEach(schedule => {
          if (schedule.membersInfo) {
            schedule.membersInfo = new Array();
            iataEmail.forEach(emailConfig => {
              schedule.membersInfo.push(Object.assign({}, emailConfig));
            })
            schedule.membersInfo = schedule.membersInfo.filter(member => member.emailTo != null && member.emailTo != '');
            schedule.membersInfo.forEach(member => {
              if (!carrier.ciqRptGenWeek) {
                member.weekly = false;
              }
              if (!carrier.ciqRptGenTime) {
                member.daily = false;
              }
              if (!carrier.ciqRptGenDay) {
                member.monthly = false;
              }
              if ((!carrier.ciqRptGenWeek || !carrier.ciqRptGenTime || !carrier.ciqRptGenDay) && member.flagCRUD == 'R') {
                member.flagCRUD = 'U';
              }
            })
          }
        })
      }
    })

    this._cargoIQService.saveEmailConfiguration(saveData).subscribe(response => {
      this.refreshFormMessages(response);
      this.resp = response.data;
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.onSearchCiq();
      }
    });
  }

  onCancel(event) {
    this.navigateBack(this._cargoIQService.dataFromSlatoEmail);
  }

  setNullValue() {
    this.form.get('carrierList').setValue([]);
  }

  refreshControlValues() {
    this.resetformControls()
    this.setNullValue();
    this.showMessageType = false;
    this.showCarrierCode = false;
  }

  public onCarrierChange(event) {
    this.form.get('generatedBy').reset();
  }
  public onSelectMessageType(event) {
    this.showCarrierCode = true;
    this.form.get('generatedBy').reset();
    (<NgcFormArray>this.form.controls['carrierList']).resetValue([]);
    this.setNullValue();

    const msgTyp = event.code;
    this.airlineParameter = this.createSourceParameter(msgTyp);
    this.form.get('carrierCode').patchValue(null);
    this.form.get('transitFlag').patchValue(0);
    this.resetFormMessages();
  }

  resetformControls() {
    (<NgcFormArray>this.form.controls['carrierList']).resetValue([]);
    this.form.get('generatedBy').reset();
    this.form.get('fsuMessageType').reset();
    this.form.get('carrierCode').reset();
  }

  checkDisabled(frequency, carrier) {

    if (frequency == 'W') {
      this.showInfoStatus(NgcUtility.translateMessage("ciq.select.a.weekday", [carrier]));
    } else if (frequency == 'D') {
      this.showInfoStatus(NgcUtility.translateMessage("ciq.enter.time", [carrier]));
    } else if (frequency == 'M') {
      this.showInfoStatus(NgcUtility.translateMessage("ciq.enter.a.day", [carrier]));
    }
  }
}
