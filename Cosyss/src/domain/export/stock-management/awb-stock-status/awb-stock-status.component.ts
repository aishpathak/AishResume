import { ExportService } from './../../export.service';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration, NgcReportComponent, NgcUtility } from 'ngc-framework';

@Component({
    selector: 'app-awb-stock-status',
    templateUrl: './awb-stock-status.component.html',
    styleUrls: ['./awb-stock-status.component.scss']
})
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true
})
export class AwbStockStatusComponent extends NgcPage {
    reportParameters: any;
    form = new NgcFormGroup({
        carrierCode: new NgcFormControl(),
        category: new NgcFormControl(),
        stockId: new NgcFormControl(),
        awbFrom: new NgcFormControl(),
        awbTo: new NgcFormControl(),
        awbNo: new NgcFormControl(),
        unused: new NgcFormControl(false),
        processing: new NgcFormControl(false),
        reserved: new NgcFormControl(false),
        booked: new NgcFormControl(false),
        deleted: new NgcFormControl(false),
        used: new NgcFormControl(false),
        cancelled: new NgcFormControl(false),
        printed: new NgcFormControl(false),
        reprinted: new NgcFormControl(false),
        duplicated: new NgcFormControl(false),
        stockIdFlag: new NgcFormControl(false),
        categoryFlag: new NgcFormControl(false),
        carrierCodeFlag: new NgcFormControl(false),
        awbNoFlag: new NgcFormControl(false),
        terminalFlag: new NgcFormControl(false),
    });
    @ViewChild('reportWindow') reportWindow: NgcReportComponent;
    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
        private service: ExportService) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        super.ngOnInit();
        const redirectedData = {
            carrierCode: this.service.dataToNawbStockStatus.carrierCode,
            category: this.service.dataToNawbStockStatus.stockCategoryCode,
            stockId: this.service.dataToNawbStockStatus.stockId,
            awbFrom: this.service.dataToNawbStockStatus.awbPrefix + '-' +
            this.service.dataToNawbStockStatus.awbSuffix,
            awbTo: this.service.dataToNawbStockStatus.awbPrefix + '-' +
            this.service.dataToNawbStockStatus.lastAWBNumber,
        };
        this.form.patchValue(redirectedData);
    }

    onExportExcel() {
        this.reportParameters = new Object();
        if (this.form.get('carrierCode').value) {
            this.reportParameters.carrriercode = this.form.get('carrierCode').value;
        }
        if (this.form.get('category').value) {
            this.reportParameters.category = this.form.get('category').value;
        }
        if (this.form.get('stockId').value) {
            this.reportParameters.stockID = this.form.get('stockId').value;
        }
        if (this.form.get('awbNo').value) {
            this.reportParameters.awbNumber = this.form.get('awbNo').value;
        }
        this.reportParameters.tenantID = NgcUtility.getTenantConfiguration().airportCode;
        this.reportWindow.open();
    }
}
