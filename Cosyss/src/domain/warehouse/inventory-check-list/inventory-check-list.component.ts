import { Validators } from '@angular/forms';
import { WarehouseService } from './../warehouse.service';
import { ActivatedRoute, Router } from '@angular/router';

import { NgcFormGroup, NgcFormControl, NgcPage, NgcFormArray, NgcReportComponent } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnDestroy, ViewChild } from '@angular/core';


@Component({
    // selector: 'app-inventory-check-list',
    templateUrl: './inventory-check-list.component.html',
    styleUrls: ['./inventory-check-list.component.scss']
})
export class InventoryCheckListComponent extends NgcPage {

    @ViewChild('reportWindow') reportWindow: NgcReportComponent
    @ViewChild('lineItemReportWindow') lineItemReportWindow: NgcReportComponent


    form: NgcFormGroup;
    displayTable = false;
    reportParameters: any;
    record: any;
    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private service: WarehouseService, private router: Router) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        this.initializeValues();
    }

    initializeValues() {
        this.form = new NgcFormGroup({
            startedAt: new NgcFormControl(),
            completedAt: new NgcFormControl(),
            handlingTerminalCode: new NgcFormControl(),
            locationType: new NgcFormControl(),
            status: new NgcFormControl(),
            warehouseInventoryCheckList: new NgcFormArray([])
        });
        this.form.get('startedAt').setValidators([Validators.required]);
        this.form.get('completedAt').setValidators([Validators.required]);
        this.displayTable = false;
    }

    onCancel() {
        this.navigateHome();
    }

    onClear() {
        this.initializeValues();
    }

    onSearch() {
        if (this.form.invalid) {
            this.showErrorStatus('warehouse.fllall.mandatoryfields');
            return;
        }
        this.service.fetchWarehouseInventoryList(this.form.getRawValue()).subscribe((resp) => {
            if (resp.data) {
                this.form.get('warehouseInventoryCheckList').patchValue(resp.data);
                this.showSuccessStatus('g.completed.successfully');
                this.displayTable = true;
            }
        })
    }

    onEdit(event) {
        if (event.column == 'PRINT') {
            this.record = event.record;
            this.reportParameters = new Object();
            this.reportParameters.handlingTerminalCode = this.record.handlingTerminalCode;
            this.reportParameters.locationType = this.record.locationType;
            this.reportParameters.status = this.record.status;
            this.reportParameters.startedAt = this.record.startedAt;
            this.reportParameters.completedAt = this.record.completedAt;
            this.reportParameters.numberOfLocations = this.record.numberOfLocations;
            this.reportParameters.numberOfShipmentsStored = this.record.numberOfShipmentsStored;
            this.reportParameters.scannedLocations = this.record.scannedLocations;
            this.reportParameters.notScannedLocations = this.record.notScannedLocations;
            this.reportParameters.numberOfDiscrepancy = this.record.numberOfDiscrepancy;
            this.reportParameters.foundShipments = this.record.foundShipments;
            this.reportParameters.notFoundShipments = this.record.notFoundShipments;

            this.lineItemReportWindow.open();
        }
        else {
            this.navigateTo(this.router, '/warehouse/inventorychecklistdetail', event);
        }
    }

    inventoryReport(event) {
        if (this.form.invalid) {
            this.showErrorStatus('warehouse.fllall.mandatoryfields');
            return;
        }
        this.reportParameters = new Object();
        this.reportParameters.startedAt = this.form.get('startedAt').value;
        this.reportParameters.completedAt = this.form.get('completedAt').value;
        this.reportParameters.handlingTerminalCode = this.form.get('handlingTerminalCode').value;
        this.reportParameters.locationType = this.form.get('locationType').value;
        this.reportParameters.status = this.form.get('status').value;
        this.reportWindow.open();

    }

}
