import { Component, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
    NgcFormControl, NgcFormGroup,
    NgcPage, NgcUtility, PageConfiguration, DateTimeKey
} from 'ngc-framework';
// import { DateTimeKey } from '../../billing/billing.sharedmodel';
import { BillingService } from '../../billing/billing.service';

@Component({
    selector: 'ngc-billing-report',
    templateUrl: './billing-report.component.html'
})

@PageConfiguration({
    trackInit: true,
    focusToBlank: true,
    focusToMandatory: true,
    callNgOnInitOnClear: true,
    autoBackNavigation: true
})

export class BillingReportComponent extends NgcPage {

    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private billingService: BillingService, private activatedRoute: ActivatedRoute, private route: ActivatedRoute,
        private router: Router) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
    }

    private form: NgcFormGroup = new NgcFormGroup({
        report: new NgcFormControl(),
        toDate: new NgcFormControl(),
        fromDate: new NgcFormControl(),
        parameter1: new NgcFormControl(),
        parameter2: new NgcFormControl(),
        parameter3: new NgcFormControl(),
        parameter4: new NgcFormControl(),
    })

    onChange() {
        // this.form.get('fromDate').patchValue(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy HH'), 'ddMMMyy HH'));
        // this.form.get('toDate').patchValue(NgcUtility.addDate(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy HH'), 'ddMMMyy HH'), 24, DateTimeKey.HOURS));
    }

    onPrint() {
        const req = this.form.getRawValue();
        this.form.validate();
        if (this.form.invalid) {
            return;
        }
        let a: any;
        let b: any;
        let days: any;
        if (req.fromDate && req.toDate) {
            a = Math.abs(req.toDate.getTime() - req.fromDate.getTime());
            b = Math.ceil(a / (1000 * 3600 * 24));
            if (b > 35) {
                this.showFormControlErrorMessage(<NgcFormControl>this.form.get('fromDate'), 'billing.error.date.range.high');
                this.showFormControlErrorMessage(<NgcFormControl>this.form.get('toDate'), 'billing.error.date.range.high');
                return;
            }
        }
        this.billingService.getBillingReport(req).subscribe(response => {
            if (response.data) {
                this.refreshFormMessages(response);
                let reportData: any = response.data;
                if ((reportData.reportOutput === 'EXCEL')) {
                    NgcUtility.saveCSV(req.report + NgcUtility.getDateAsString(req.fromDate) + "/" + NgcUtility.getDateAsString(req.toDate) + ".xls", reportData.reportInfo);
                } else {
                    NgcUtility.saveCSV(req.report + NgcUtility.getDateAsString(req.fromDate) + "/" + NgcUtility.getDateAsString(req.toDate) + ".txt", reportData.reportInfo);
                }
            } else {
                this.showErrorMessage("billing.error.no.records.found");
            }
        })
    }
}
