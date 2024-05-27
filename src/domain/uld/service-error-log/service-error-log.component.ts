import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, NgcButtonComponent, PageConfiguration, NgcReportComponent, ReportFormat } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { UldService } from '../uld.service';

@Component({
  selector: 'app-service-error-log',
  templateUrl: './service-error-log.component.html',
  styleUrls: ['./service-error-log.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ServiceErrorLogComponent extends NgcPage implements OnInit {
  reportParameters: any;
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  @ViewChild('updateWindow') updateWindow: NgcWindowComponent;
  updateWindowShowHide: boolean = false;
  resp: any;
  serviceErrLogList: any[];
  showTable: boolean = false;  
  serviceErrorLogList: any = [];
  private serviceErrorLogForm: NgcFormGroup = new NgcFormGroup({
    fromDate: new NgcFormControl(),
    toDate: new NgcFormControl(),
    serviced: new NgcFormControl(),
    type: new NgcFormControl(),
    logDate: new NgcFormControl(),
    createdBy: new NgcFormControl(),
    uldNo: new NgcFormControl(),
    eirNo: new NgcFormControl(),
    rclNo: new NgcFormControl(),
    reason: new NgcFormControl(),
    fltType: new NgcFormControl(),
    svcUid: new NgcFormControl(),
    svcDate: new NgcFormControl(),
    fltNo:new NgcFormControl(),
    serviceErrorLogList: new NgcFormArray([]),
    updateForm: new NgcFormGroup ({
    logDate: new NgcFormControl(),
    createdBy: new NgcFormControl(),
    uldNo: new NgcFormControl(),
    reason: new NgcFormControl(),
    remark1: new NgcFormControl(),
    remark2: new NgcFormControl(),
    svcUid: new NgcFormControl(),
    svcDate: new NgcFormControl(),
    })

  })
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router,
    private activatedRoute: ActivatedRoute,
    private uldService: UldService) {
      super(appZone, appElement, appContainerElement);
     }  
 
  ngOnInit() {
  }
  onSearchQuery() {
    this.showTable = false;
    if (this.serviceErrorLogForm.invalid) {
      this.serviceErrorLogForm.validate();
      return;
    }
    let request = this.serviceErrorLogForm.getRawValue();
    this.resetFormMessages();
    this.uldService.getServiceErrorLog(request).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data;
      if (!this.showResponseErrorMessages(data)) {
        if (this.resp.data) {
          this.serviceErrLogList = this.resp.data.serviceErrorLog;
        }
        if (this.serviceErrLogList.length > 0) {
          this.showTable = true;
          let i = 1;
          this.serviceErrLogList.forEach(element => {
            element.serialNumber = i;
            i++;
          });
          (<NgcFormArray>this.serviceErrorLogForm.controls['serviceErrorLogList']).patchValue(this.serviceErrLogList);
        }
      }      
    }, error => {
      this.showErrorMessage('show' + error);
    })
  }

  onLinkClick(index) {   
     this.updateWindowShowHide = true;
     this.serviceErrorLogForm.get('updateForm').patchValue(this.serviceErrLogList[index]);   
     this.updateWindow.open();    
  }
  destroyWindow() {
    this.updateWindowShowHide = false;
}
onSave(){
  let request = this.serviceErrorLogForm.getRawValue().updateForm;
    (<NgcFormGroup>this.serviceErrorLogForm.get('updateForm')).validate();
  if((<NgcFormGroup>this.serviceErrorLogForm.get('updateForm')).invalid){
   this.showErrorStatus('enter.remarks');
  return;
}

 this.uldService.saveServiceErrorLogInfo(request).subscribe(data => {
  this.refreshFormMessages(data);
  if (data.data) {
    this.onSearchQuery();
    this.showSuccessStatus("g.added.successfully");
    this.updateWindow.close(); 
    this.updateWindowShowHide = false;
  } else {
    this.showErrorStatus(data.messageList[0].code);   
      }
    },
      error => {
        this.showErrorStatus(error.messageList[0].message);
        this.updateWindowShowHide = false;
      })
  }

  /*Print report*/
  onPrintServiceLog() {
    this.reportParameters = new Object();
    this.reportParameters.fromDate = this.serviceErrorLogForm.get('fromDate').value;
    this.reportParameters.toDate = this.serviceErrorLogForm.get('toDate').value;
    this.reportParameters.serviced = this.serviceErrorLogForm.get('serviced').value;
    this.reportParameters.type = this.serviceErrorLogForm.get('type').value;
    this.reportWindow.open();
  }
}

