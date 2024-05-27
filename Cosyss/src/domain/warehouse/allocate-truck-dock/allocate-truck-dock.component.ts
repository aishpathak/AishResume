import { Validators } from '@angular/forms';
import { Component, NgZone, ElementRef, ViewContainerRef, Input } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcUtility } from 'ngc-framework';
import { WarehouseService } from './../warehouse.service';
import { ApplicationFeatures } from '../../common/applicationfeatures';


@Component({
    selector: 'ngc-allocate-truck-dock',
    templateUrl: './allocate-truck-dock.component.html',
    styleUrls: ['./allocate-truck-dock.component.scss']
})
export class AllocateTruckDockComponent extends NgcPage {
    form = new NgcFormGroup({
        allocateTruckDockToAgentList: new NgcFormArray([
            // new NgcFormGroup({
            //   select: new NgcFormControl(),
            //   locationCode: new NgcFormControl(), // corr to whsLocationId
            //   deliveryOutputPointFrom: new NgcFormControl(),
            //   deliveryOutputPointTo: new NgcFormControl(),
            //   customerCode: new NgcFormControl()
            // })
        ])
    });
    @Input()
    parentConstraintId;
    allocateTruckDockToAgentList = [];
    dropDownListId;
    sectorId;
    rootTerminal;
    parentSectors;
    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private warehouseService: WarehouseService) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        // this.warehouseService.getSectorModel().whsSectorId
        let ancestors = this.warehouseService.getAllParentsNames().split(',');
        this.rootTerminal = ancestors[0];
        ancestors.shift();
        this.parentSectors = ancestors;
        this.sectorId = this.warehouseService.getAllParentsIds().split(',').pop();
        this.dropDownListId = this.createSourceParameter(this.sectorId);
        // this.getTruckDocks();
        this.initializeValues();
        this.getTruckDocks();
    }

    initializeValues() {
        this.allocateTruckDockToAgentList = [{
            select: false,
            deliveryOutputPointFrom: null,
            deliveryOutputPointTo: null,
            customerCode: null,
            icsExitLocationId: null,
            whsSectorId: this.sectorId,
            flagCRUD: 'C'
        }];
        this.form = new NgcFormGroup({
            // locationType: new NgcFormControl('STORAGE'),
            allocateTruckDockToAgentList: new NgcFormArray([])
        });
    }

    getTruckDocks() {
        let searchRequest = {
            whsSectorId: this.sectorId,
            locationType: 'TRUCKDOCK'
        };
        this.warehouseService.fetchTruckDocksSector(searchRequest).subscribe((resp) => {
            if (resp.data) {
                this.form.get('allocateTruckDockToAgentList').patchValue(resp.data);
                let index = 0;
                for (let truckDock of resp.data) {
                    this.form.get(['allocateTruckDockToAgentList', index, 'deliveryOutputPointFrom']).setValidators(Validators.required);
                    if (!NgcUtility.hasFeatureAccess(ApplicationFeatures.Warehouse_Setup_ICSLocation)) {
                        this.form.get(['allocateTruckDockToAgentList', index, 'icsExitLocationId']).setValidators(Validators.required);
                    }
                    // this.form.get(['allocateTruckDockToAgentList', index, 'customerCode']).setValidators(Validators.required);
                    ++index;
                }
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        });

    }

    onSave() {
        this.form.validate();
        if (this.form.invalid) {
            return;
        }
        let message: any = {
            messageList: []
        };
        let individualMessageList = this.warehouseService.checkForAnyDuplicateEntries('allocateTruckDockToAgentList', ['customerCode', 'icsExitLocationId', 'deliveryOutputPointFrom'], 'Duplicate Row', this.form.getRawValue()['allocateTruckDockToAgentList']);
        message.messageList.push(...individualMessageList);
        if (message.messageList.length) {
            this.showResponseErrorMessages(message);
            return;
        }
        console.log(JSON.stringify(this.form.getRawValue()));
        let formRawValue = this.form.getRawValue();
        // for (let truckDock of formRawValue.allocateTruckDockToAgentList) {
        //     if (truckDock.flagCRUD == 'C' && !(truckDock.deliveryOutputPointFrom && truckDock.deliveryOutputPointTo)) {
        //         truckDock.flagCRUD = 'T';
        //     }
        // }
        this.warehouseService.modifyTruckDocksSector(formRawValue.allocateTruckDockToAgentList).subscribe((resp) => {
            if (resp.data) {
                this.showSuccessStatus('g.completed.successfully');
                this.getTruckDocks();
                // this.getTruckDocks();
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }, (err) => {
            this.showErrorStatus('g.unable.to.contact.server');
        })
    }

    onDeleteAssociation(index) {
        (<NgcFormGroup>this.form.get(['allocateTruckDockToAgentList', index])).markAsDeleted();
    }

    onAdd() {
        (<NgcFormArray>this.form.get('allocateTruckDockToAgentList')).addValue(this.allocateTruckDockToAgentList);
        let index = (<NgcFormArray>this.form.get('allocateTruckDockToAgentList')).length - 1;
        this.form.get(['allocateTruckDockToAgentList', index, 'deliveryOutputPointFrom']).setValidators(Validators.required);
        if (!NgcUtility.hasFeatureAccess(ApplicationFeatures.Warehouse_Setup_ICSLocation)) {
            this.form.get(['allocateTruckDockToAgentList', index, 'icsExitLocationId']).setValidators(Validators.required);
        }
        // this.form.get(['allocateTruckDockToAgentList', index, 'customerCode']).setValidators(Validators.required);
    }

    onCancel() {
        this.navigateBack(null);
    }
}
