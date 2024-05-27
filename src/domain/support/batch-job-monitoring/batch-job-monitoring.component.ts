import { request } from 'http';
import { SupportService } from './../support.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, PageConfiguration, CreateFormByModel
} from 'ngc-framework';

/*class BatchJobMonitoring {
  jobDataMap: any = [];
  jobName: string = null;
  jobGroup: string = null;
  jobClazz: string = null;
  jobStatus: string = null;
  jobScheduleTime: Date = null;
  cronExpression: string = null;
}*/

@Component({
  selector: 'app-batch-job-monitoring',
  templateUrl: './batch-job-monitoring.component.html',
  styleUrls: ['./batch-job-monitoring.component.scss']
})
export class BatchJobMonitoringComponent extends NgcPage {

  @ViewChild('reinitiateWindow') reinitiateWindow: NgcWindowComponent;

  startRequest: any;
  resp: any;

  // @CreateFormByModel(BatchJobMonitoring)
  private form: NgcFormGroup = new NgcFormGroup({
    jobDataMap: new NgcFormArray([]),
    jobName: new NgcFormControl(),
    jobGroup: new NgcFormControl(),
    jobClazz: new NgcFormControl(),
    jobStatus: new NgcFormControl(),
    jobScheduleTime: new NgcFormControl(),
    cronExpression: new NgcFormControl(),
    jobNotRunningFlag: new NgcFormControl()
  });

  private reinitiateForm: NgcFormGroup = new NgcFormGroup({
    messages: new NgcFormControl(),
    datetoUpdate: new NgcFormControl(),
    diffInMins: new NgcFormControl(),
  });

  /**
   * Initialize
   *
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private _supportService: SupportService) {
    super(appZone, appElement, appContainerElement);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    super.ngOnInit();
    //
    this._supportService.searchJob().subscribe(response => {
      this.resp = response.data;
      this.form.get('jobDataMap').patchValue(this.resp);
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }
  onCheckJob(event) {
    const checkRequest = this.form.getRawValue();
    this._supportService.checkJob(checkRequest).subscribe(response => {
      this.resp = response.data;
      if (this.resp) {
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.refreshFormMessages(response);
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  onCreateJob(event) {
    const createRequest = this.form.getRawValue();
    createRequest.jobName = this.form.get('jobName').value;
    createRequest.jobGroup = this.form.get('jobGroup').value;
    createRequest.jobClazz = this.form.get('jobClazz').value;
    createRequest.jobStatus = this.form.get('jobStatus').value;
    createRequest.jobScheduleTime = this.form.get('jobScheduleTime').value;
    createRequest.cronExpression = this.form.get('cronExpression').value;
    this._supportService.createJob(createRequest).subscribe(response => {
      this.resp = response.data;
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  onStartJob(index) {
    this.resetFormMessages();
    //
    const startRequest = this.form.getRawValue();
    startRequest.jobName = (<NgcFormArray>this.form.get(['jobDataMap', index, 'jobName'])).value;
    startRequest.jobGroup = (<NgcFormArray>this.form.get(['jobDataMap', index, 'jobGroup'])).value;
    this._supportService.startJob(startRequest).subscribe(response => {
      this.resp = response.data;
      if (this.resp) {
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.refreshFormMessages(response);
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  onPauseJob(index) {
    const pauseRequest = this.form.getRawValue();
    pauseRequest.jobName = (<NgcFormArray>this.form.get(['jobDataMap', index, 'jobName'])).value;
    pauseRequest.jobGroup = (<NgcFormArray>this.form.get(['jobDataMap', index, 'jobGroup'])).value;
    this._supportService.pauseJob(pauseRequest).subscribe(response => {
      this.resp = response.data;
      if (this.resp) {
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.refreshFormMessages(response);
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  onResumeJob(index) {
    const resumeRequest = this.form.getRawValue();
    resumeRequest.jobName = (<NgcFormArray>this.form.get(['jobDataMap', index, 'jobName'])).value;
    resumeRequest.jobGroup = (<NgcFormArray>this.form.get(['jobDataMap', index, 'jobGroup'])).value;
    this._supportService.resumeJob(resumeRequest).subscribe(response => {
      this.resp = response.data;
      if (this.resp) {
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.refreshFormMessages(response);
      }
    }, error => {
      this.showErrorStatus('Error:' + error);
    });

  }

  onDeleteJob(index) {
    const deleteRequest = this.form.getRawValue();
    deleteRequest.jobName = (<NgcFormArray>this.form.get(['jobDataMap', index, 'jobName'])).value;
    deleteRequest.jobGroup = (<NgcFormArray>this.form.get(['jobDataMap', index, 'jobGroup'])).value;
    this._supportService.deleteJob(deleteRequest).subscribe(response => {
      this.resp = response.data;
      if (this.resp) {
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.refreshFormMessages(response);
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  onStopJob(index) {
    const stopRequest = this.form.getRawValue();
    stopRequest.jobName = (<NgcFormArray>this.form.get(['jobDataMap', index, 'jobName'])).value;
    stopRequest.jobGroup = (<NgcFormArray>this.form.get(['jobDataMap', index, 'jobGroup'])).value;
    this._supportService.stopJob(stopRequest).subscribe(response => {
      this.resp = response.data;
      if (this.resp) {
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.refreshFormMessages(response);
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  onCleanUpJob(index) {
    const stopRequest = this.form.getRawValue();
    stopRequest.jobName = (<NgcFormArray>this.form.get(['jobDataMap', index, 'jobName'])).value;
    stopRequest.jobGroup = (<NgcFormArray>this.form.get(['jobDataMap', index, 'jobGroup'])).value;
    this._supportService.cleanupJob(stopRequest).subscribe(response => {
      this.resp = response.data;
      if (this.resp) {
        this.showSuccessStatus('g.completed.successfully');
      } else {
        this.refreshFormMessages(response);
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  onEditJob(index) {
    this.form.get('jobName').setValue(this.form.get(['jobDataMap', index, 'jobName']).value);
    this.form.get('jobGroup').setValue(this.form.get(['jobDataMap', index, 'jobGroup']).value);
    this.form.get('jobStatus').setValue(this.form.get(['jobDataMap', index, 'jobStatus']).value);
    this.form.get('jobScheduleTime').setValue(this.form.get(['jobDataMap', index, 'scheduleTime']).value);
  }

  updateMsgDetails() {
    const updateRequest = this.reinitiateForm.getRawValue();
    if (updateRequest.messages == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.reinitiateForm.get('messages'),
        'g.mandatory');
      return;
    }
    if (updateRequest.datetoUpdate == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.reinitiateForm.get('datetoUpdate'),
        'g.mandatory');
      return;
    }
    if (updateRequest.diffInMins == null) {
      this.showFormControlErrorMessage(<NgcFormControl>this.reinitiateForm.get('diffInMins'),
        'g.mandatory');
      return;
    }
    this._supportService.reinitiateMessages(updateRequest).subscribe(response => {
      this.resp = response.data;
      if (!this.refreshFormMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.reinitiateForm.reset();
        this.reinitiateWindow.close();
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }

  openWindow() {
    this.reinitiateForm.get('diffInMins').setValue('30');
    this.reinitiateWindow.open();
  }

  onRefreshJob(event) {
    this.ngOnInit();
  }

  onCancel(event) {
    this.navigateHome();
  }

}
