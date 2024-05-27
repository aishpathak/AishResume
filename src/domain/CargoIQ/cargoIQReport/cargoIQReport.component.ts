import { Validators } from '@angular/forms';
import { CargoIQService } from '../cargoIQ.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcFormControl, NgcFormArray, PageConfiguration, NgcPage, NgcFormGroup, NgcUtility, DateTimeKey, NgcReportComponent } from 'ngc-framework';

@Component({
  selector: 'app-cargoIQReport',
  templateUrl: './cargoIQReport.component.html',
  styleUrls: ['./cargoIQReport.component.scss']
})
export class CargoIQReportComponent extends NgcPage implements OnInit {
  reportParameters: any = new Object();
  sheetOrFileName: any;
  disableFlag: boolean = false;
  TTFlag: boolean = false;
  messagebuttonflag: boolean = false;
  private cargoIQReportForm: NgcFormGroup = new NgcFormGroup({
    reportType: new NgcFormControl('', Validators.required),
    messageType: new NgcFormControl(),
    tranferTransit: new NgcFormControl(false),
    carrier: new NgcFormControl(),
    reportFilter: new NgcFormControl(),
    fromDate: new NgcFormControl('', Validators.required),
    toDate: new NgcFormControl('', Validators.required),
    carrierSLADiffMin: new NgcFormControl(),
  });

  @ViewChild('reportWindow5') reportWindow5: NgcReportComponent;
  @ViewChild('reportWindow6') reportWindow6: NgcReportComponent;
  @ViewChild('reportWindow22') reportWindow22: NgcReportComponent;
  @ViewChild('reportWindow23') reportWindow23: NgcReportComponent;
  @ViewChild('reportWindow24') reportWindow24: NgcReportComponent;
  @ViewChild('reportWindow25') reportWindow25: NgcReportComponent;
  @ViewChild('reportWindow26') reportWindow26: NgcReportComponent;
  @ViewChild('reportWindow27') reportWindow27: NgcReportComponent;
  @ViewChild('reportWindow28') reportWindow28: NgcReportComponent;
  @ViewChild('reportWindow29') reportWindow29: NgcReportComponent;
  @ViewChild('reportWindow30') reportWindow30: NgcReportComponent;
  @ViewChild('reportWindow31') reportWindow31: NgcReportComponent;
  @ViewChild('reportWindow32') reportWindow32: NgcReportComponent;
  @ViewChild('reportWindow33') reportWindow33: NgcReportComponent;
  @ViewChild('reportWindow34') reportWindow34: NgcReportComponent;
  @ViewChild('reportWindow35') reportWindow35: NgcReportComponent;
  @ViewChild('reportWindow36') reportWindow36: NgcReportComponent;
  @ViewChild('reportWindow37') reportWindow37: NgcReportComponent;
  @ViewChild('reportWindow38') reportWindow38: NgcReportComponent;
  @ViewChild('reportWindow39') reportWindow39: NgcReportComponent;
  @ViewChild('reportWindow40') reportWindow40: NgcReportComponent;
  @ViewChild('reportWindow41') reportWindow41: NgcReportComponent;
  @ViewChild('reportWindow42') reportWindow42: NgcReportComponent;
  @ViewChild('reportWindow43') reportWindow43: NgcReportComponent;
  @ViewChild('reportWindow44') reportWindow44: NgcReportComponent;
  @ViewChild('reportWindow45') reportWindow45: NgcReportComponent;
  @ViewChild('reportWindow46') reportWindow46: NgcReportComponent;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private cargoIQService: CargoIQService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.cargoIQReportForm.get('reportType').valueChanges.subscribe((event) => {
      this.disableFlag = false;
      this.cargoIQReportForm.get('messageType').setValidators([]);
      this.cargoIQReportForm.get('fromDate').setValidators(Validators.required);
      this.cargoIQReportForm.get('toDate').setValidators(Validators.required);
      this.cargoIQReportForm.get('carrier').setValidators([]);
      if (event === 'Import Export Reference Report') {
        this.disableFlag = true;
        // this.cargoIQReportForm.get('carrier').setValidators(Validators.required);
      }
      else if
        (event === 'I/E') {
        this.disableFlag = true;
      }
      else if
        (event === 'Transfer/Transit') {
        this.disableFlag = true;
      }
      else if
        (event === 'TransferTransitReferenceReport') {
        this.disableFlag = true;
      }
      else if
        (event === 'Transfer Transit WorkingReport') {
        this.disableFlag = true;
      }
      else if
        (event === 'TransferTransitRefWorkgListRep') {
        this.disableFlag = true;
      }
      else if
        (event === 'Imp Exp Working Report') {
        this.disableFlag = true;
      }
      else if
        (event === 'ImpExpRefWorkingListReport') {
        this.disableFlag = true;
      }
      else if
        (event === 'GHAL Message Template' || event === 'GHAT Message Template') {
        this.disableFlag = true;
        this.cargoIQReportForm.get('fromDate').setValidators([]);
        this.cargoIQReportForm.get('toDate').setValidators([]);
      }
      else if (event === 'FSU Messaging Exception Report') {
        this.cargoIQReportForm.get('messageType').setValidators(Validators.required);
      }
    });
  }

  clear(event): void {
    this.cargoIQReportForm.reset();
    this.resetFormMessages();
  }

  onBack(event) {
    this.navigateBack(this.cargoIQReportForm.getRawValue());
  }

  onSelect(event) {
    if (this.cargoIQReportForm.get('reportType').value === 'FSU Messaging Exception Report') {
      if (event.desc == 'DEP' || event.desc == 'RCF')
        this.TTFlag = true;
      else
        this.TTFlag = false;
    } else
      this.TTFlag = false;
  }

  onGenerateReport() {
    this.resetFormMessages();
    this.cargoIQReportForm.validate();
    if (this.cargoIQReportForm.invalid) {
      return;
    } else {
      if (NgcUtility.dateDifference(this.cargoIQReportForm.get('fromDate').value,
        this.cargoIQReportForm.get('toDate').value) <= 0) {
        this.cargoIQReportForm.validate();
      }
      else {
        this.showFormControlErrorMessage(<NgcFormControl>this.cargoIQReportForm.get('fromDate'),
          'export.from.date.cannot.more.than.to.date');
        return;
      }
    }
    const days = NgcUtility.dateDifference(this.cargoIQReportForm.get('toDate').value, this.cargoIQReportForm.get('fromDate').value) / (1000 * 60 * 60 * 24)
    if (days >= 31) {
      this.showFormControlErrorMessage(<NgcFormControl>this.cargoIQReportForm.get('fromDate'),
        'ciq.date.range.not.more.than.31');
      return;
    }
    this.onGenarateReport();
  }

  onGenarateReport() {
    // Full Date Time: 16-05-2015 09:50:00
    // let d = new Date();
    // let datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
    //   d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2);
    let fromDate = new Date(this.cargoIQReportForm.get('fromDate').value);
    let fileDate = fromDate.getFullYear() + "-" + ("0" + (fromDate.getMonth() + 1)).slice(-2);
    let messageType = this.cargoIQReportForm.get('messageType').value;
    let reportType = this.cargoIQReportForm.get('reportType').value;
    let reportFilter = this.cargoIQReportForm.get('reportFilter').value;

    // Common input request for all the reports - Start
    this.reportParameters = new Object();
    this.reportParameters.messagetype = messageType;
    if (this.cargoIQReportForm.get('carrier').value != null) {
      this.reportParameters.carrierflag = '1';
      this.reportParameters.carrier = this.cargoIQReportForm.get('carrier').value;
    } else {
      this.reportParameters.carrierflag = '0';
      this.reportParameters.carrier = null;
    }
    // For common reports - Start
    this.reportParameters.fromdate = this.cargoIQReportForm.get('fromDate').value;
    this.reportParameters.todate = this.cargoIQReportForm.get('toDate').value;
    this.reportParameters.carrierSLADiff = (this.cargoIQReportForm.get('carrierSLADiffMin').value == null ? '0' : this.cargoIQReportForm.get('carrierSLADiffMin').value + "");
    // For common reports - End

    // For POI reports - Start
    this.reportParameters.fromDate = this.cargoIQReportForm.get('fromDate').value;
    this.reportParameters.toDate = this.cargoIQReportForm.get('toDate').value;
    // For POI reports - End

    // Common input request for all the reports - End

    // FSU Reports
    if (reportType === 'FSU Messaging Exception Report') {
      // Export RCS
      if (messageType == 'RCS') {

        if (reportFilter == null || reportFilter == 'Full Report') {
          this.sheetOrFileName = "FSU-" + messageType + "-Message" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow22.fileName = this.sheetOrFileName;
          this.reportWindow22.reportParameters = this.reportParameters;
          this.reportWindow22.downloadReport();
        } else if (reportFilter == 'Exception Report') {
          this.sheetOrFileName = "FSU-Exception-" + messageType + "-Msg" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow38.fileName = this.sheetOrFileName;
          this.reportWindow38.reportParameters = this.reportParameters;
          this.reportWindow38.downloadReport();
        }
      }
      // Import RCF/NFD, RCF_TT and RCF/NFD Expception report
      else if (messageType == 'RCF' || messageType == 'NFD') {
        if (this.cargoIQReportForm.get('tranferTransit').value) {
          this.sheetOrFileName = "FSU-" + messageType + "-Message-Trf-Trn" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow35.fileName = this.sheetOrFileName;
          this.reportWindow35.reportParameters = this.reportParameters;
          this.reportWindow35.downloadReport();
        }
        else if (reportFilter == null || reportFilter == 'Full Report') {
          this.sheetOrFileName = "FSU-" + messageType + "-Message" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow23.fileName = this.sheetOrFileName;
          this.reportWindow23.reportParameters = this.reportParameters;
          this.reportWindow23.downloadReport();
        }
        else if (reportFilter == 'Exception Report') {
          this.sheetOrFileName = "FSU-Exception-" + messageType + "-Message" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow37.fileName = this.sheetOrFileName;
          this.reportWindow37.reportParameters = this.reportParameters;
          this.reportWindow37.downloadReport();
        }
      }
      // AWD and Expception report
      else if (messageType == 'AWD') {
        if (reportFilter == null || reportFilter == 'Full Report') {
          this.sheetOrFileName = "FSU-AWD-Message" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow27.fileName = this.sheetOrFileName;
          this.reportWindow27.reportParameters = this.reportParameters;
          this.reportWindow27.downloadReport();
        }
        else if (reportFilter == 'Exception Report') {
          this.sheetOrFileName = "FSU-Exception-" + messageType + "-Message" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow41.fileName = this.sheetOrFileName;
          this.reportWindow41.reportParameters = this.reportParameters;
          this.reportWindow41.downloadReport();
        }
      }
      // DEP, DEP_TT, DEP_Exp, DEP_Exp_TT Reports
      else if (messageType == 'DEP') {
        if (this.cargoIQReportForm.get('tranferTransit').value && reportFilter == 'Exception Report') {
          this.sheetOrFileName = "FSU-Exception-DEP-Trf-Trn" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow45.fileName = this.sheetOrFileName;
          this.reportWindow45.reportParameters = this.reportParameters;
          this.reportWindow45.downloadReport();
        }
        else if (this.cargoIQReportForm.get('tranferTransit').value) {
          this.sheetOrFileName = "FSU-DEP-Message-Trf-Trn" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow36.fileName = this.sheetOrFileName;
          this.reportWindow36.reportParameters = this.reportParameters;
          this.reportWindow36.downloadReport();
        }
        else if (reportFilter == null || reportFilter == 'Full Report') {
          this.sheetOrFileName = "FSU-DEP-Message" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow28.fileName = this.sheetOrFileName;
          this.reportWindow28.reportParameters = this.reportParameters;
          this.reportWindow28.downloadReport();
        }
        else if (reportFilter == 'Exception Report') {
          this.sheetOrFileName = "FSU-Exception-DEP-Msg" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow39.fileName = this.sheetOrFileName;
          this.reportWindow39.reportParameters = this.reportParameters;
          this.reportWindow39.downloadReport();
        }
      }
      // DLV
      else if (messageType == 'DLV') {
        if (reportFilter == null || reportFilter == 'Full Report') {
          this.sheetOrFileName = "FSU-DLV-Message" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow29.fileName = this.sheetOrFileName;
          this.reportWindow29.reportParameters = this.reportParameters;
          this.reportWindow29.downloadReport();
        }
        else if (reportFilter == 'Exception Report') {
          this.sheetOrFileName = "FSU-Exception-DLV-Message" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow42.fileName = this.sheetOrFileName;
          this.reportWindow42.reportParameters = this.reportParameters;
          this.reportWindow42.downloadReport();
        }
      }
      // TFD
      else if (messageType == 'TFD') {
        if (reportFilter == null || reportFilter == 'Full Report') {
          this.sheetOrFileName = "FSU-TFD-Message" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow32.fileName = this.sheetOrFileName;
          this.reportWindow32.reportParameters = this.reportParameters;
          this.reportWindow32.downloadReport();
        }
        else if (reportFilter == 'Exception Report') {
          this.sheetOrFileName = "FSU-Exception-TFD-Message" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow44.fileName = this.sheetOrFileName;
          this.reportWindow44.reportParameters = this.reportParameters;
          this.reportWindow44.downloadReport();
        }
      }
      // RCT
      else if (messageType == 'RCT') {
        if (reportFilter == null || reportFilter == 'Full Report') {
          this.sheetOrFileName = "FSU-RCT-Message" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow34.fileName = this.sheetOrFileName;
          this.reportWindow34.reportParameters = this.reportParameters;
          this.reportWindow34.downloadReport();
        }
        else if (reportFilter == 'Exception Report') {
          this.sheetOrFileName = "FSU-Exception-RCT-Message" + fileDate;
          this.reportParameters.workSheetName = this.sheetOrFileName;
          this.reportWindow43.fileName = this.sheetOrFileName;
          this.reportWindow43.reportParameters = this.reportParameters;
          this.reportWindow43.downloadReport();
        }
      }
      else {
        this.showErrorStatus("Select Valid Message Type!");
        return;
      }
    }
    else if (reportType === 'I/E') {
      this.sheetOrFileName = "GHAL-SAT-" + fileDate; // GHAL-SAT-2018-06
      this.reportParameters.workSheetName = this.sheetOrFileName;
      this.reportWindow25.fileName = this.sheetOrFileName;
      this.reportWindow25.reportParameters = this.reportParameters;
      this.reportWindow25.downloadReport();
    }
    else if (reportType === 'Import Export Reference Report') {
      this.sheetOrFileName = "GHAL-SAT-REF-" + fileDate;  //  GHAT-SAT-REF-YYYY-MM
      this.reportParameters.workSheetName = this.sheetOrFileName;
      this.reportWindow24.fileName = this.sheetOrFileName;
      this.reportWindow24.reportParameters = this.reportParameters;
      this.reportWindow24.downloadReport();
    }
    else if (reportType === 'Transfer/Transit') {
      this.sheetOrFileName = "GHAT-SAT-" + fileDate; // GHAT-SAT-2018-06
      this.reportParameters.workSheetName = this.sheetOrFileName;
      this.reportWindow5.fileName = this.sheetOrFileName;
      this.reportWindow5.reportParameters = this.reportParameters;
      this.reportWindow5.downloadReport();
    }
    else if (reportType === 'TransferTransitReferenceReport') {
      this.sheetOrFileName = "GHAT-SAT-REF-" + fileDate; // GHAT-SAT-REF-YYYY-MM
      this.reportParameters.workSheetName = this.sheetOrFileName;
      this.reportWindow31.fileName = this.sheetOrFileName;
      this.reportWindow31.reportParameters = this.reportParameters;
      this.reportWindow31.downloadReport();
    }
    else if (reportType === 'GHAL Message Template') {
      this.sheetOrFileName = "GHAL Message Template";
      this.reportParameters.workSheetName = this.sheetOrFileName;
      this.reportWindow26.fileName = this.sheetOrFileName;
      this.reportWindow26.reportParameters = this.reportParameters;
      this.reportWindow26.downloadReport();
    }
    else if (reportType === 'GHAT Message Template') {
      this.sheetOrFileName = "GHAT Message Template";
      this.reportParameters.workSheetName = this.sheetOrFileName;
      this.reportWindow46.fileName = this.sheetOrFileName;
      this.reportWindow46.reportParameters = this.reportParameters;
      this.reportWindow46.downloadReport();
    }

    // POI Report - Start
    else if (reportType === 'Imp Exp Working Report') { 
      this.reportWindow6.fileName = "GHAL-SAT-" + fileDate + "_Working Report.xlsx"; // GHAL-SAT-YYYY-MM_Working Report
      this.reportWindow6.reportParameters = this.reportParameters;
      this.reportWindow6.downloadReport();
    }
    else if (reportType === 'ImpExpRefWorkingListReport') {
      this.reportWindow33.fileName = "GHAL-SAT-REF-" + fileDate + "_Working Report.xlsx"; // GHAL-SAT-REF-YYYY-MM_Working Report
      this.reportWindow33.reportParameters = this.reportParameters;
      this.reportWindow33.downloadReport();
    }
    else if (reportType === 'Transfer Transit WorkingReport') {
      this.reportWindow30.fileName = "GHAT-SAT-" + fileDate + "_Working Report.xlsx"; // GHAT-SAT-YYYY-MM_Working Report
      this.reportWindow30.reportParameters = this.reportParameters;
      this.reportWindow30.downloadReport();
    }
    else if (reportType === 'TransferTransitRefWorkgListRep') {
      this.reportWindow40.fileName = "GHAT-SAT-REF-" + fileDate + "_Working Report.xlsx"; // GHAT-SAT-REF-YYYY-MM_Working Report
      this.reportWindow40.reportParameters = this.reportParameters;
      this.reportWindow40.downloadReport();
    }
    // POI Report - End
  }
}