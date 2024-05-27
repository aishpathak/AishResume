import { Validators } from '@angular/forms';
import { WarehouseService } from './../warehouse.service';
import { NgcFormGroup, NgcFormArray, NgcFormControl, NgcPage } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef } from '@angular/core';

@Component({
    // selector: 'app-handling-constraints',
    templateUrl: './handling-constraints.component.html',
    styleUrls: ['./handling-constraints.component.scss']
})
export class HandlingConstraintsComponent extends NgcPage {
    form: NgcFormGroup;
    showDeleteButton = false;
    searchDone;
    handlingConstraintsCarrierListRow;
    handlingConstraintsCarrierAircraftTypeListInnerRow;
    handlingConstraintsSHCHandlingGroupListRow;
    handlingConstraintsAuthorisedAgentListRow;
    handlingConstraintsAuthorisedAgentFunctionsListInnerRow;
    handlingConstraintsTransferTypeListRow;
    handlingContraintsZoneListRow;
    handlingContraintsULDContentListRow;
    sourceParametersValue: any;
    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private warehouseService: WarehouseService) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        this.initializevalues();
        this.sourceParametersValue = this.createSourceParameter('1', Math.random().toString());
    }

    onLovSelection(event) {
        console.log(event);
        if (event.code) {
            this.form.get('processHandled').setValue(event.param1);
            this.form.get('uldHandled').setValue(event.param2);
            this.form.get('whsHandlingConstraintsId').setValue(Number(event.param4));
            this.showDeleteButton = true;
        }
    }

    onClear() {
        this.initializevalues();
        this.showDeleteButton = false;
        this.sourceParametersValue = this.createSourceParameter('1', Math.random().toString());
    }

    initializevalues() {
        this.form = new NgcFormGroup({
            name: new NgcFormControl('', Validators.required),
            carrierCode: new NgcFormControl(),
            processHandled: new NgcFormControl('BOTH', Validators.required),
            uldHandled: new NgcFormControl(),
            whsHandlingConstraintsId: new NgcFormControl(),
            chargableLocationType: new NgcFormControl(),
            handlingConstraintsCarrierList: new NgcFormArray([
                // new NgcFormGroup({
                //   handlingConstraintsCarrierAircraftTypeList: new NgcFormArray([])
                // })
            ]),
            handlingConstraintsSHCHandlingGroupList: new NgcFormArray([]),
            handlingConstraintsAuthorisedAgentList: new NgcFormArray([
                // new NgcFormGroup({
                //   handlingConstraintsAuthorisedAgentFunctionsList: new NgcFormArray([])
                // })
            ]),
            handlingConstraintsTransferTypeList: new NgcFormArray([]),
            handlingContraintsZoneList: new NgcFormArray([]),
            handlingContraintsULDContentList: new NgcFormArray([])
        });
        this.searchDone = false;
        this.handlingConstraintsCarrierListRow = [{
            whsHandlingConstraintsCarrierId: null,
            carrierCode: null,
            processHandled: null,
            select: false,
            aircraftBodyType: null,
            handlingConstraintsCarrierAircraftTypeList: []
        }];
        this.handlingConstraintsCarrierAircraftTypeListInnerRow = [{
            whsHandlingConstraintsCarrierAircraftTypeId: null,
            aircraftType: null,
            select: false
        }];
        this.handlingConstraintsSHCHandlingGroupListRow = [{
            shcHandlingGroupCode: null,
            whsHandlingConstraintsSHCHandlingGroupId: null,
            select: false
        }];
        this.handlingConstraintsAuthorisedAgentListRow = [{
            customerCode: null,
            whsHandlingConstraintsAuthorisedAgentId: null,
            handlingConstraintsAuthorisedAgentFunctionsList: [],
            select: false
        }];
        this.handlingConstraintsAuthorisedAgentFunctionsListInnerRow = [{
            whsHandlingConstraintsAuthorisedAgentFunctionsId: null,
            screenFunctionCode: null,
            select: false
        }];
        this.handlingConstraintsTransferTypeListRow = [{
            transferType: null,
            whsHandlingConstraintsTransferTypeId: null,
            select: false
        }];
        this.handlingContraintsZoneListRow = [{
            whsHandlingConstraintsZoneId: null,
            zoneCode: null,
            groupName: null,
            description: null,
            select: false
        }];
        this.handlingContraintsULDContentListRow = [{
            whsHandlingConstraintsULDContentId: null,
            uldContentCode: null,
            select: false
        }];
    }
    // handlingConstraintsCarrierListRow
    // handlingConstraintsCarrierAircraftTypeListInnerRow
    // handlingConstraintsSHCHandlingGroupListRow
    // handlingConstraintsAuthorisedAgentListRow
    // handlingConstraintsAuthorisedAgentFunctionsListInnerRow

    // handlingConstraintsTransferTypeListRow
    // handlingContraintsZoneListRow
    // handlingContraintsULDContent

    handlingConstraintsCarrierListRowAdd() {
        if (this.form.get('handlingConstraintsCarrierList').invalid) {
            this.showErrorStatus('warehouse.fillall.rowfirst');
            return;
        }
        (<NgcFormArray>this.form.get('handlingConstraintsCarrierList')).addValue(this.handlingConstraintsCarrierListRow);
        const len = (<NgcFormArray>this.form.get('handlingConstraintsCarrierList')).length;
        (<NgcFormControl>this.form.get(['handlingConstraintsCarrierList', len - 1, 'carrierCode'])).setValidators(Validators.required);
        (<NgcFormControl>this.form.get(['handlingConstraintsCarrierList', len - 1, 'processHandled'])).setValidators(Validators.required);
        (<NgcFormControl>this.form.get(['handlingConstraintsCarrierList', len - 1, 'aircraftBodyType'])).setValidators(Validators.required);
    }

    handlingConstraintsCarrierListRowDelete(index) {
        (<NgcFormGroup>this.form.get(['handlingConstraintsCarrierList', index])).markAsDeleted();
    }

    handlingConstraintsCarrierListRowsDelete() {
        const len = (<NgcFormArray>this.form.get(['handlingConstraintsCarrierList'])).length;
        for (let i = 0; i < len; ++i) {
            if (this.form.get(['handlingConstraintsCarrierList', i, 'select']).value) {
                this.handlingConstraintsCarrierListRowDelete(i);
            }
        }
    }

    handlingConstraintsCarrierAircraftTypeListInnerRowAdd(index) {
        if (this.form.get(['handlingConstraintsCarrierList', index, 'handlingConstraintsCarrierAircraftTypeList']).invalid) {
            this.showErrorStatus('warehouse.fillall.rowfirst');
            return;
        }
        (<NgcFormArray>this.form.get(['handlingConstraintsCarrierList', index, 'handlingConstraintsCarrierAircraftTypeList'])).addValue(this.handlingConstraintsCarrierAircraftTypeListInnerRow);
        const len = (<NgcFormArray>this.form.get(['handlingConstraintsCarrierList', index, 'handlingConstraintsCarrierAircraftTypeList'])).length;
        (<NgcFormControl>this.form.get(['handlingConstraintsCarrierList', index, 'handlingConstraintsCarrierAircraftTypeList', len - 1, 'aircraftType'])).setValidators([Validators.required, Validators.maxLength(3)]);

    }

    handlingConstraintsCarrierAircraftTypeListInnerRowDelete(index, innerIndex) {
        (<NgcFormGroup>this.form.get(['handlingConstraintsCarrierList', index, 'handlingConstraintsCarrierAircraftTypeList', innerIndex])).markAsDeleted();
    }

    handlingConstraintsCarrierAircraftTypeListInnerRowsDelete(index) {
        const len = (<NgcFormArray>this.form.get(['handlingConstraintsCarrierList', index, 'handlingConstraintsCarrierAircraftTypeList'])).length;
        for (let i = 0; i < len; ++i) {
            if (this.form.get(['handlingConstraintsCarrierList', index, 'handlingConstraintsCarrierAircraftTypeList', i, 'select']).value) {
                this.handlingConstraintsCarrierAircraftTypeListInnerRowDelete(index, i);
            }
        }
    }

    handlingConstraintsSHCHandlingGroupListRowAdd() {
        if (this.form.get('handlingConstraintsSHCHandlingGroupList').invalid) {
            this.showErrorStatus('warehouse.fillall.rowfirst');
            return;
        }
        (<NgcFormArray>this.form.get('handlingConstraintsSHCHandlingGroupList')).addValue(this.handlingConstraintsSHCHandlingGroupListRow);
        const len = (<NgcFormArray>this.form.get('handlingConstraintsSHCHandlingGroupList')).length;
        (<NgcFormControl>this.form.get(['handlingConstraintsSHCHandlingGroupList', len - 1, 'shcHandlingGroupCode'])).setValidators(Validators.required);
    }

    handlingConstraintsSHCHandlingGroupListRowDelete(index) {
        // if (this.form.get(['handlingConstraintsSHCHandlingGroupList', index, 'flagCRUD']).value === 'C') {
        //   (<NgcFormArray>this.form.get('handlingConstraintsSHCHandlingGroupList')).deleteValueAt(index);
        // } else if (this.form.get(['handlingConstraintsSHCHandlingGroupList', index, 'flagCRUD']).value === 'R' ||
        // this.form.get(['handlingConstraintsSHCHandlingGroupList', index, 'flagCRUD']).value === 'U') {
        (<NgcFormGroup>this.form.get(['handlingConstraintsSHCHandlingGroupList', index])).markAsDeleted();
        // }
    }

    handlingConstraintsSHCHandlingGroupListRowsDelete() {
        const len = (<NgcFormArray>this.form.get(['handlingConstraintsSHCHandlingGroupList'])).length;
        for (let i = 0; i < len; ++i) {
            if (this.form.get(['handlingConstraintsSHCHandlingGroupList', i, 'select']).value) {
                this.handlingConstraintsSHCHandlingGroupListRowDelete(i);
            }
        }
    }

    handlingContraintsULDContentListRowAdd() {
        if (this.form.get('handlingContraintsULDContentList').invalid) {
            this.showErrorStatus('warehouse.fillall.rowfirst');
            return;
        }
        (<NgcFormArray>this.form.get('handlingContraintsULDContentList')).addValue(this.handlingContraintsULDContentListRow);
        const len = (<NgcFormArray>this.form.get('handlingContraintsULDContentList')).length;
        (<NgcFormControl>this.form.get(['handlingContraintsULDContentList', len - 1, 'uldContentCode'])).setValidators(Validators.required);
    }

    handlingContraintsULDContentListRowDelete(index) {
        // if (this.form.get(['handlingContraintsULDContentList', index, 'flagCRUD']).value === 'C') {
        //   (<NgcFormArray>this.form.get('handlingContraintsULDContentList')).deleteValueAt(index);
        // } else if (this.form.get(['handlingContraintsULDContentList', index, 'flagCRUD']).value === 'R' ||
        // this.form.get(['handlingContraintsULDContentList', index, 'flagCRUD']).value === 'U') {
        (<NgcFormGroup>this.form.get(['handlingContraintsULDContentList', index])).markAsDeleted();
        // }
    }

    handlingContraintsULDContentListRowsDelete() {
        const len = (<NgcFormArray>this.form.get(['handlingContraintsULDContentList'])).length;
        for (let i = 0; i < len; ++i) {
            if (this.form.get(['handlingContraintsULDContentList', i, 'select']).value) {
                this.handlingContraintsULDContentListRowDelete(i);
            }
        }
    }


    handlingContraintsZoneListRowAdd() {
        if (this.form.get('handlingContraintsZoneList').invalid) {
            this.showErrorStatus('warehouse.fillall.rowfirst');
            return;
        }
        (<NgcFormArray>this.form.get('handlingContraintsZoneList')).addValue(this.handlingContraintsZoneListRow);
        const len = (<NgcFormArray>this.form.get('handlingContraintsZoneList')).length;
        (<NgcFormControl>this.form.get(['handlingContraintsZoneList', len - 1, 'zoneCode'])).setValidators(Validators.required);
        (<NgcFormControl>this.form.get(['handlingContraintsZoneList', len - 1, 'groupName'])).setValidators(Validators.required);
        (<NgcFormControl>this.form.get(['handlingContraintsZoneList', len - 1, 'description'])).setValidators(Validators.required);
    }

    handlingContraintsZoneListRowDelete(index) {
        // if (this.form.get(['handlingContraintsZoneList', index, 'flagCRUD']).value === 'C') {
        //   (<NgcFormArray>this.form.get('handlingContraintsZoneList')).deleteValueAt(index);
        // } else if (this.form.get(['handlingContraintsZoneList', index, 'flagCRUD']).value === 'R' ||
        // this.form.get(['handlingContraintsZoneList', index, 'flagCRUD']).value === 'U') {
        (<NgcFormGroup>this.form.get(['handlingContraintsZoneList', index])).markAsDeleted();
        // }
    }

    handlingContraintsZoneListRowsDelete() {
        const len = (<NgcFormArray>this.form.get(['handlingContraintsZoneList'])).length;
        for (let i = 0; i < len; ++i) {
            if (this.form.get(['handlingContraintsZoneList', i, 'select']).value) {
                this.handlingContraintsZoneListRowDelete(i);
            }
        }
    }

    handlingConstraintsTransferTypeListRowAdd() {
        if (this.form.get('handlingConstraintsTransferTypeList').invalid) {
            this.showErrorStatus('warehouse.fillall.rowfirst');
            return;
        }
        (<NgcFormArray>this.form.get('handlingConstraintsTransferTypeList')).addValue(this.handlingConstraintsTransferTypeListRow);
        const len = (<NgcFormArray>this.form.get('handlingConstraintsTransferTypeList')).length;
        (<NgcFormControl>this.form.get(['handlingConstraintsTransferTypeList', len - 1, 'transferType'])).setValidators(Validators.required);
    }

    handlingConstraintsTransferTypeListRowDelete(index) {
        // if (this.form.get(['handlingConstraintsTransferTypeList', index, 'flagCRUD']).value === 'C') {
        //   (<NgcFormArray>this.form.get('handlingConstraintsTransferTypeList')).deleteValueAt(index);
        // } else if (this.form.get(['handlingConstraintsTransferTypeList', index, 'flagCRUD']).value === 'R' ||
        // this.form.get(['handlingConstraintsTransferTypeList', index, 'flagCRUD']).value === 'U') {
        (<NgcFormGroup>this.form.get(['handlingConstraintsTransferTypeList', index])).markAsDeleted();
        // }
    }

    handlingConstraintsTransferTypeListRowsDelete() {
        const len = (<NgcFormArray>this.form.get(['handlingConstraintsTransferTypeList'])).length;
        for (let i = 0; i < len; ++i) {
            if (this.form.get(['handlingConstraintsTransferTypeList', i, 'select']).value) {
                this.handlingConstraintsTransferTypeListRowDelete(i);
            }
        }
    }

    handlingConstraintsAuthorisedAgentListRowAdd() {
        if (this.form.get('handlingConstraintsAuthorisedAgentList').invalid) {
            this.showErrorStatus('warehouse.fillall.rowfirst');
            return;
        }
        (<NgcFormArray>this.form.get('handlingConstraintsAuthorisedAgentList')).addValue(this.handlingConstraintsAuthorisedAgentListRow);
        const len = (<NgcFormArray>this.form.get('handlingConstraintsAuthorisedAgentList')).length;
        (<NgcFormControl>this.form.get(['handlingConstraintsAuthorisedAgentList', len - 1, 'customerCode'])).setValidators(Validators.required);
    }

    handlingConstraintsAuthorisedAgentListRowDelete(index) {
        (<NgcFormGroup>this.form.get(['handlingConstraintsAuthorisedAgentList', index])).markAsDeleted();
    }

    handlingConstraintsAuthorisedAgentListRowsDelete() {
        const len = (<NgcFormArray>this.form.get(['handlingConstraintsAuthorisedAgentList'])).length;
        for (let i = 0; i < len; ++i) {
            if (this.form.get(['handlingConstraintsAuthorisedAgentList', i, 'select']).value) {
                this.handlingConstraintsAuthorisedAgentListRowDelete(i);
            }
        }
    }

    handlingConstraintsAuthorisedAgentFunctionsListInnerRowAdd(index) {
        if (this.form.get(['handlingConstraintsAuthorisedAgentList', index, 'handlingConstraintsAuthorisedAgentFunctionsList']).invalid) {
            this.showErrorStatus('warehouse.fillall.rowfirst');
            return;
        }
        (<NgcFormArray>this.form.get(['handlingConstraintsAuthorisedAgentList', index, 'handlingConstraintsAuthorisedAgentFunctionsList'])).addValue(this.handlingConstraintsAuthorisedAgentFunctionsListInnerRow);
        const len = (<NgcFormArray>this.form.get(['handlingConstraintsAuthorisedAgentList', index, 'handlingConstraintsAuthorisedAgentFunctionsList'])).length;
        (<NgcFormControl>this.form.get(['handlingConstraintsAuthorisedAgentList', index, 'handlingConstraintsAuthorisedAgentFunctionsList', len - 1, 'screenFunctionCode'])).setValidators(Validators.required);
    }

    handlingConstraintsAuthorisedAgentFunctionsListInnerRowDelete(index, innerIndex) {
        (<NgcFormGroup>this.form.get(['handlingConstraintsAuthorisedAgentList', index, 'handlingConstraintsAuthorisedAgentFunctionsList', innerIndex])).markAsDeleted();
    }

    handlingConstraintsAuthorisedAgentFunctionsListInnerRowsDelete(index) {
        const len = (<NgcFormArray>this.form.get(['handlingConstraintsAuthorisedAgentList', index, 'handlingConstraintsAuthorisedAgentFunctionsList'])).length;
        for (let i = 0; i < len; ++i) {
            if (this.form.get(['handlingConstraintsAuthorisedAgentList', index, 'handlingConstraintsAuthorisedAgentFunctionsList', i, 'select']).value) {
                this.handlingConstraintsAuthorisedAgentFunctionsListInnerRowDelete(index, i);
            }
        }
    }

    onSave() {
        console.log(JSON.stringify(this.form.getRawValue()));
        // modifyHandlingConstraints
        // return;
        this.form.validate();
        if (this.form.invalid) {
            return;
        }
        let message: any = {
            messageList: []
        };
        let individualMessageList = [];

        // {
        //     name: new NgcFormControl('', Validators.required),
        //         processHandled: new NgcFormControl('BOTH', Validators.required),
        //             uldHandled: new NgcFormControl(),
        //                 whsHandlingConstraintsId: new NgcFormControl(),
        //                     handlingConstraintsCarrierList: new NgcFormArray([
        //                         // new NgcFormGroup({
        //                         //   handlingConstraintsCarrierAircraftTypeList: new NgcFormArray([])
        //                         // })
        //                     ]),
        //                         handlingConstraintsSHCHandlingGroupList: new NgcFormArray([]),
        //                             handlingConstraintsAuthorisedAgentList: new NgcFormArray([
        //                                 // new NgcFormGroup({
        //                                 //   handlingConstraintsAuthorisedAgentFunctionsList: new NgcFormArray([])
        //                                 // })
        //                             ]),
        //                                 handlingConstraintsTransferTypeList: new NgcFormArray([]),
        //                                     handlingContraintsZoneList: new NgcFormArray([]),
        //                                         handlingContraintsULDContentList: new NgcFormArray([])
        // }


        // checkForAnyDuplicateDevices(arrayName, controlName, errorCode) {

        // individualMessageList = this.checkForAnyDuplicateDevices('handlingConstraintsCarrierList', '', );

        individualMessageList = this.warehouseService.checkForAnyDuplicateEntries('handlingConstraintsSHCHandlingGroupList', 'shcHandlingGroupCode', 'Duplicate Name', this.form.getRawValue()['handlingConstraintsSHCHandlingGroupList']);
        message.messageList.push(...individualMessageList);
        individualMessageList = this.warehouseService.checkForAnyDuplicateEntries('handlingContraintsULDContentList', 'uldContentCode', 'Duplicate Code', this.form.getRawValue()['handlingContraintsULDContentList']);
        message.messageList.push(...individualMessageList);
        individualMessageList = this.warehouseService.checkForAnyDuplicateEntries('handlingConstraintsTransferTypeList', 'transferType', 'Duplicate Name', this.form.getRawValue()['handlingConstraintsTransferTypeList']);
        message.messageList.push(...individualMessageList);
        // individualMessageList = this.warehouseService.checkForAnyDuplicateEntries('handlingContraintsZoneList', 'zoneCode', 'Duplicate Name', null);
        // message.messageList.push(...individualMessageList);
        // individualMessageList = this.warehouseService.checkForAnyDuplicateEntries('handlingContraintsZoneList', 'groupName', 'Duplicate Name', null);
        // message.messageList.push(...individualMessageList);
        // individualMessageList = this.warehouseService.checkForAnyDuplicateEntries('handlingContraintsZoneList', 'description', 'Duplicate Name', null);
        // message.messageList.push(...individualMessageList);
        // handlingConstraintsAuthorisedAgentList
        individualMessageList = this.warehouseService.checkForAnyDuplicateEntries('handlingContraintsZoneList', ['zoneCode', 'groupName', 'description'], 'Duplicate Name', this.form.getRawValue()['handlingContraintsZoneList']);
        message.messageList.push(...individualMessageList);
        individualMessageList = this.warehouseService.checkForAnyDuplicateEntries('handlingConstraintsAuthorisedAgentList', 'customerCode', 'Duplicate Name', this.form.getRawValue()['handlingConstraintsAuthorisedAgentList']);
        message.messageList.push(...individualMessageList);
        individualMessageList = this.checkForAnyDuplicateEntriesForTwoArrays('handlingConstraintsAuthorisedAgentList', 'handlingConstraintsAuthorisedAgentFunctionsList', 'screenFunctionCode', 'Duplicate Name');
        message.messageList.push(...individualMessageList);
        individualMessageList = this.warehouseService.checkForAnyDuplicateEntries('handlingConstraintsCarrierList', ['carrierCode', 'processHandled'], 'Duplicate Combination of Code and Process', this.form.getRawValue()['handlingConstraintsCarrierList']);
        // individualMessageList = this.checkForAnyDuplicateEntriesForTwoControls('handlingConstraintsCarrierList', 'carrierCode', 'processHandled', 'Duplicate Combination of Code and Process');
        message.messageList.push(...individualMessageList);
        individualMessageList = this.checkForAnyDuplicateEntriesForTwoArrays('handlingConstraintsCarrierList', 'handlingConstraintsCarrierAircraftTypeList', 'aircraftType', 'Duplicate Name');
        message.messageList.push(...individualMessageList);

        if (message.messageList.length) {
            this.showResponseErrorMessages(message);
            return;
        }
        let request = this.form.getRawValue();
        request.flagCRUD = 'U';
        this.modifyHandlingConstraints(request);
    }

    onCreateNew() {
        if (!this.form.get('name').value) {
            // this.showFormErrorMessages();
            this.showErrorStatus('warehouse.fill.constraint.namefield');
            return;
        }
        this.modifyHandlingConstraints(this.form.getRawValue());
        this.showDeleteButton = true;
    }

    modifyHandlingConstraints(request) {        
        this.warehouseService.modifyHandlingConstraints(request).subscribe((resp) => {
            console.log(resp);
            if (resp.data) {
                if (resp.data.messageList.length) {
                    this.showResponseErrorMessages(resp.data);
                } else {
                    this.showSuccessStatus('g.completed.successfully');
                    this.onSearch(true);
                }
            } else {
                if (resp.messageList && resp.messageList.length) {
                    this.showResponseErrorMessages(resp);
                }else{ 
                    this.showErrorStatus('g.server.exception');
                }
            }
        }
        )
    }

    onSearch(redirect) {
        this.searchDone = false;
        console.log(JSON.stringify(this.form.getRawValue()));
        if (this.form.invalid && !redirect) {
            let message: any = {};
            message.messageList = [{
                code: 'Constraint Name missing',
                referenceId: 'name'
            }]
            this.showResponseErrorMessages(
                message
            );
            return;
        }
        this.warehouseService.fetchHandlingConstraintDetails(this.form.getRawValue()).subscribe((resp) => {            
            this.refreshFormMessages(resp);
            this.form.patchValue(resp.data);
            this.setAllValidators(this.form.getRawValue());
            if (resp.data) {
                resp.data.flagCRUD = 'U';
                this.searchDone = true;
                if (!redirect) {
                    this.showDeleteButton = true;
                    this.showSuccessStatus('g.completed.successfully');
                }
            } else {
                this.showErrorStatus('g.server.exception');
            }
        }
        )
    }

    operationIsUpdateOrRead(flag) {
        if (flag == 'R' || flag == 'U') {
            return true;
        }
    }

    onDeleteHandlingConstraint() {
        const request = this.form.getRawValue();
        // handlingConstraintsCarrierList
        if (this.operationIsUpdateOrRead(request.flagCRUD)) {
            request.flagCRUD = 'D';
        }
        for (const handlingConstraintsCarrier of request.handlingConstraintsCarrierList) {
            if (this.operationIsUpdateOrRead(handlingConstraintsCarrier.flagCRUD)) {
                handlingConstraintsCarrier.flagCRUD = 'D';
            }
            for (const handlingConstraintsCarrierAircraftType of handlingConstraintsCarrier.handlingConstraintsCarrierAircraftTypeList) {
                if (this.operationIsUpdateOrRead(handlingConstraintsCarrierAircraftType.flagCRUD)) {
                    handlingConstraintsCarrierAircraftType.flagCRUD = 'D';
                }
            }
        }

        for (const handlingConstraintsSHCHandlingGroup of request.handlingConstraintsSHCHandlingGroupList) {
            if (this.operationIsUpdateOrRead(handlingConstraintsSHCHandlingGroup.flagCRUD)) {
                handlingConstraintsSHCHandlingGroup.flagCRUD = 'D';
            }
        }

        for (const HandlingConstraintsAuthorisedAgent of request.handlingConstraintsAuthorisedAgentList) {
            if (this.operationIsUpdateOrRead(HandlingConstraintsAuthorisedAgent.flagCRUD)) {
                HandlingConstraintsAuthorisedAgent.flagCRUD = 'D';
            }
            for (const handlingConstraintsAuthorisedAgentFunctions of HandlingConstraintsAuthorisedAgent.handlingConstraintsAuthorisedAgentFunctionsList) {
                if (this.operationIsUpdateOrRead(handlingConstraintsAuthorisedAgentFunctions.flagCRUD)) {
                    handlingConstraintsAuthorisedAgentFunctions.flagCRUD = 'D';
                }
            }
        }

        for (const handlingConstraintsTransferType of request.handlingConstraintsTransferTypeList) {
            if (this.operationIsUpdateOrRead(handlingConstraintsTransferType.flagCRUD)) {
                handlingConstraintsTransferType.flagCRUD = 'D';
            }
        }

        for (const handlingContraintsZone of request.handlingContraintsZoneList) {
            if (this.operationIsUpdateOrRead(handlingContraintsZone.flagCRUD)) {
                handlingContraintsZone.flagCRUD = 'D';
            }
        }

        for (const handlingContraintsULDContent of request.handlingContraintsULDContentList) {
            if (this.operationIsUpdateOrRead(handlingContraintsULDContent.flagCRUD)) {
                handlingContraintsULDContent.flagCRUD = 'D';
            }
        }
        console.log(JSON.stringify(request));
        // this.modifyHandlingConstraints(request);    
    }

    setAllValidators(obj) {
        let i = 0;
        for (const eachRow of obj.handlingConstraintsCarrierList) {
            (<NgcFormControl>this.form.get(['handlingConstraintsCarrierList', i, 'carrierCode'])).setValidators(Validators.required);
            (<NgcFormControl>this.form.get(['handlingConstraintsCarrierList', i, 'processHandled'])).setValidators(Validators.required);
            (<NgcFormControl>this.form.get(['handlingConstraintsCarrierList', i, 'aircraftBodyType'])).setValidators(Validators.required);
            let j = 0;
            for (const eachRow of obj.handlingConstraintsCarrierList[i].handlingConstraintsCarrierAircraftTypeList) {
                (<NgcFormControl>this.form.get(['handlingConstraintsCarrierList', i, 'handlingConstraintsCarrierAircraftTypeList', j, 'aircraftType'])).setValidators([Validators.required, Validators.maxLength(3)]);
                ++j;
            }
            ++i;
        }
        i = 0;
        for (const eachRow of obj.handlingConstraintsAuthorisedAgentList) {
            (<NgcFormControl>this.form.get(['handlingConstraintsAuthorisedAgentList', i, 'customerCode'])).setValidators(Validators.required);
            let j = 0;
            for (const eachRow of obj.handlingConstraintsAuthorisedAgentList[i].handlingConstraintsAuthorisedAgentFunctionsList) {
                (<NgcFormControl>this.form.get(['handlingConstraintsAuthorisedAgentList', i, 'handlingConstraintsAuthorisedAgentFunctionsList', j, 'screenFunctionCode'])).setValidators(Validators.required);
                ++j;
            }
            ++i;
        }
        i = 0;
        for (const eachRow of obj.handlingConstraintsSHCHandlingGroupList) {
            (<NgcFormControl>this.form.get(['handlingConstraintsSHCHandlingGroupList', i, 'shcHandlingGroupCode'])).setValidators(Validators.required);
            ++i;
        }
        i = 0;
        for (const eachRow of obj.handlingContraintsULDContentList) {
            (<NgcFormControl>this.form.get(['handlingContraintsULDContentList', i, 'uldContentCode'])).setValidators(Validators.required);
            ++i;
        }
        i = 0;
        for (const eachRow of obj.handlingContraintsZoneList) {
            (<NgcFormControl>this.form.get(['handlingContraintsZoneList', i, 'zoneCode'])).setValidators(Validators.required);
            (<NgcFormControl>this.form.get(['handlingContraintsZoneList', i, 'groupName'])).setValidators(Validators.required);
            (<NgcFormControl>this.form.get(['handlingContraintsZoneList', i, 'description'])).setValidators(Validators.required);
            ++i;
        }
        i = 0;
        for (const eachRow of obj.handlingConstraintsTransferTypeList) {
            (<NgcFormControl>this.form.get(['handlingConstraintsTransferTypeList', i, 'transferType'])).setValidators(Validators.required);
            ++i;
        }
    }

    onCancel() {
        this.navigateHome();
    }

    setAllValidatorsTest(obj, arrayParameters) {
        for (var key in obj) {
            if (typeof key === 'string' && (!obj[key] || typeof obj[key] !== 'object')) {
                console.log(' name=' + key + ' value=' + obj[key]);
                (<NgcFormControl>this.form.get([arrayParameters + key])).setValidators(Validators.required);
            }
            else {
                this.setAllValidatorsTest(obj[key], arrayParameters + key);
            }
        }
    }

    // checkForAnyDuplicateEntries(arrayName, controlNameList, errorCode, arrayValue) {
    //     if (typeof controlNameList === 'string') {
    //         controlNameList = [controlNameList];
    //     }
    //     let hashMap = {};
    //     let arrayNameList = arrayValue;
    //     let messageList = [];
    //     let index = 0;
    //     for (let arrayInstance of arrayNameList) {
    //         let hashKey = {
    //             // controlName: arrayInstance[controlName]
    //         };
    //         let i = 1;
    //         for (const eachControlName of controlNameList) {
    //             hashKey['controlName' + i] = arrayInstance[eachControlName];
    //             ++i;
    //         }
    //         if (!hashMap[JSON.stringify(hashKey)])
    //             hashMap[JSON.stringify(hashKey)] = 1;
    //         else {
    //             let j = 0;
    //             for (const controlName in hashKey) {
    //                 if (hashKey.hasOwnProperty(controlName)) {
    //                     let k = j;
    //                     messageList.push(
    //                         {
    //                             code: errorCode,
    //                             referenceId: arrayName + '[' + index + '].' + controlNameList[k]
    //                         }
    //                     );
    //                     ++j;
    //                 }
    //             }
    //             // messageList.push(
    //             //     {
    //             //         code: errorCode,
    //             //         referenceId: arrayName + '[' + index + '].' + controlName
    //             //     }
    //             // );
    //         }
    //         ++index;
    //     }
    //     return messageList;
    // }

    checkForAnyDuplicateEntriesForTwoControls(arrayName, controlName1, controlName2, errorCode) {
        let hashMap: any = {};
        let arrayNameList = this.form.getRawValue()[arrayName];
        let messageList = [];
        let index = 0;
        for (let arrayInstance of arrayNameList) {
            let hashKey = {
                controlName1: arrayInstance[controlName1],
                controlName2: arrayInstance[controlName2]
            };

            if (!hashMap[JSON.stringify(hashKey)])
                hashMap[JSON.stringify(hashKey)] = 1;
            else {
                messageList.push(
                    {
                        code: errorCode,
                        referenceId: arrayName + '[' + index + '].' + controlName1
                    }
                );
                messageList.push(
                    {
                        code: errorCode,
                        referenceId: arrayName + '[' + index + '].' + controlName2
                    }
                );
            }
            ++index;
        }
        return messageList;
    }

    checkForAnyDuplicateEntriesForTwoArrays(parentArrayName, childArrayName, controlName, errorCode) {
        let parentArrayNameList = this.form.getRawValue()[parentArrayName];
        let mainMessageList = [];
        let i = 0;
        for (let parentArrayInstance of parentArrayNameList) {
            let messageList = this.warehouseService.checkForAnyDuplicateEntries(childArrayName, controlName, errorCode, parentArrayInstance);
            if (messageList.length) {
                // mainMessageList[i] = messageList;
                for (let message of messageList) {
                    message.referenceId = parentArrayName + '[' + i + '].' + message.referenceId;
                }
                mainMessageList.push(...messageList);
            }
            ++i;
        }
        return mainMessageList;
    }

    onDeleteHandlingConstraintCompletely() {
        // whsHandlingConstraintsId
        this.warehouseService.deleteHandlingConstraint({
            whsHandlingConstraintsId: this.form.get('whsHandlingConstraintsId').value
        }).subscribe((resp) => {
            console.log(resp);
            if (!resp.data) {
                let message: any = {

                };
                message.messageList = [
                    {
                        code: 'warehouse.handlingconstraint.area.cannotdeleted',
                        referenceId: 'name'
                    }
                ]
                this.showResponseErrorMessages(message);
            } else {
                this.showSuccessStatus('g.completed.successfully');
                this.onClear();
            }
        })
    }

}
