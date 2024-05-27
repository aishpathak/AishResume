import { request } from 'http';
import { NgcFormControl } from 'ngc-framework/core/model/formcontrol.model';
import { ActivatedRoute } from '@angular/router';
import { WarehouseService } from './../warehouse.service';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcUtility } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, OnDestroy } from '@angular/core';

@Component({
    // selector: 'app-inventory-check-list-detail',
    templateUrl: './inventory-check-list-detail.component.html',
    styleUrls: ['./inventory-check-list-detail.component.scss']
})
export class InventoryCheckListDetailComponent extends NgcPage {
    form: NgcFormGroup;
    searchRequest;
    hasReadPermission: boolean = false;
    
    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private service: WarehouseService,
        private activatedRoute: ActivatedRoute) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        this.hasReadPermission = NgcUtility.hasReadPermission('WAREHOUSE_INVENTORY_CHECK');
        this.initializeValues();
        let forwardedData = this.getNavigateData(this.activatedRoute);
        console.log(forwardedData);
        this.searchRequest = {
            locationCodeFrom: forwardedData.record.locationCodeFrom,
            locationCodeTo: forwardedData.record.locationCodeTo,
            whsInventoryCheckForLocationId: forwardedData.record.whsInventoryCheckForLocationId
        }

        this.fetchDetails();
        this.form.patchValue({
            handlingTerminalCode: forwardedData.record.handlingTerminalCode,
            locationType: forwardedData.record.locationType,
            startedAt: forwardedData.record.startedAt,
            completedAt: forwardedData.record.completedAt,
            status: forwardedData.record.status,
            numberOfLocations: forwardedData.record.numberOfLocations
        });
    }

    initializeValues() {
        this.form = new NgcFormGroup({
            handlingTerminalCode: new NgcFormControl(),
            locationType: new NgcFormControl(),
            startedAt: new NgcFormControl(),
            completedAt: new NgcFormControl(),
            status: new NgcFormControl(),
            numberOfLocations: new NgcFormControl(),
            matchingList: new NgcFormArray([]),
            foundShipments: new NgcFormArray([]),
            notFoundShipments: new NgcFormArray([])
        });
    }

    // fetchWarehouseInventoryDetail
    fetchDetails() {
        this.service.fetchWarehouseInventoryDetail(this.searchRequest).subscribe((resp) => {
            console.log(resp);
            this.form.patchValue(resp.data);
        })
    }

    onMarkAsUTL() {
        let arr = (<NgcFormArray>this.form.get('notFoundShipments')).getRawValue();
        let request = {
            notFoundShipments: []
        };
        for (let row of arr) {
            if (row.select) {
                request.notFoundShipments.push(row);
            }
        }
        console.log(request);
        this.service.markAsUtl(request).subscribe((resp) => {
            if (resp.data) {
                this.showSuccessStatus('g.completed.successfully');
                console.log(resp);
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        })
    }

    getValidityOfUpdateRequest(request) {
        const hashMap = {};
        for (let inventory of request.foundShipments) {
            if (hashMap[inventory.shipmentInventoryId]) {
                return false;
            }
            hashMap[inventory.shipmentInventoryId] = true;
        }
        return true;
    }

    onUpdateLocation() {
        let arr = (<NgcFormArray>this.form.get('foundShipments')).getRawValue();
        let request = {
            foundShipments: []
        };
        for (let row of arr) {
            if (row.select) {
                request.foundShipments.push(row);
            }
        }
        console.log(request);
        let isValidUpdate = this.getValidityOfUpdateRequest(request);
        if (!isValidUpdate) {
            this.showInfoStatus('warehouse.info.update.morethenoneposition');
            return;
        }

        this.service.updateLocation(request).subscribe((resp) => {
            if (resp.data) {
                this.showSuccessStatus('g.completed.successfully');
                console.log(resp);
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        })
    }

    isDiscrepancyPresent() {
        let formRawValue = this.form.getRawValue();
        if (formRawValue.foundShipments.length || formRawValue.notFoundShipments.length) {
            return true;
        }
        for (let matchingShipment of formRawValue.matchingList) {
            if (matchingShipment.pieces !== matchingShipment.scannedPieces) {
                return true;
            }
        }
        return false;
    }

    onComplete() {
        if (this.isDiscrepancyPresent()) {
            this.showInfoStatus('warehouse.discrepancy.stillpresent');
        } else {
            this.service.closeInventoryCheckStatus(this.searchRequest).subscribe((resp) => {
                if (resp.data) {
                    this.showSuccessStatus('g.completed.successfully');
                    console.log(resp);
                } else {
                    this.showErrorStatus('g.server.exception');
                }
            }, (err) => {
                this.showErrorStatus('g.unable.to.contact.server');
            })
        }
    }

    cellsRendererDiscrepancy = (row: number, column: string, value: any, rowData: any) => {
        // console.log({ 'hello': 18 }, rowData);
        return 1;
        // return Math.abs(rowData.pieces - rowData.scannedPieces);
    }

    // public cellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    //     let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    //     //
    //     if (value == "HKG") {
    //         cellsStyle.data = "Hello HKG!"
    //         cellsStyle.className = CellsStyleClass.INFO_BLUE;
    //     } else {
    //         cellsStyle.className = CellsStyleClass.SUCCESS_GREEN;
    //         cellsStyle.allowEdit = false;
    //     }
    //     //
    //     return cellsStyle;
    // };

    onCancel() {
        this.navigateBack(null);
    }
}
