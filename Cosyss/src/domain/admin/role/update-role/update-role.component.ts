import { DeleteSubModuleRequest } from './../../admin.sharedmodel';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration, NgcEditTableComponent, NgcWindowComponent, NgcUtility } from 'ngc-framework';
import { AdminService } from '../../admin.service';
import { FormsModule, Validators } from '@angular/forms';
import { UpdateRoleRequest, UpdateRoleResponse, FunctionRQ, RoleBO, SubModule } from '../../admin.sharedmodel';

@Component({
    selector: 'ngc-update-role',
    templateUrl: './update-role.component.html',
    styleUrls: ['./update-role.component.scss']
})
@PageConfiguration({
    trackInit: true,
    // autoBackNavigation: true,
    // restorePageOnBack: true
})
export class UpdateRoleComponent extends NgcPage {
    @ViewChild("functionListWindow")
    functionListWindow: NgcWindowComponent;
    @ViewChild("edittable")
    edittable: NgcEditTableComponent;
    initRole: RoleBO = new RoleBO();
    appAccess: any;
    initResp: any;
    initResponseArray: any[];
    resp: any;
    disableControls: any[] = [];
    responseArray: any[];
    transferData: any;
    fetchedSubModuleList: any[];
    errors: any[];
    disableaccess: boolean = false;
    dropDownAny: any;
    functionlist: any[];
    arrayToPatch: any[];
    goToFirstPage: any = false;
    hasReadPermission : boolean = false;

    /**
     * On component creation
     */
    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
        private adminService: AdminService, private activatedRoute: ActivatedRoute, private router: Router) {
        super(appZone, appElement, appContainerElement);
    }

    private updateRoleForm: NgcFormGroup = new NgcFormGroup({
        code: new NgcFormControl(),
        duties: new NgcFormControl(),
        roleCategory: new NgcFormControl(),
        applicationAccess: new NgcFormControl(),
        applicationId: new NgcFormControl(),
        moduleFlag: new NgcFormControl(),
        menuItem: new NgcFormControl(),
        resultList: new NgcFormArray([
        ]),
        functionList: new NgcFormArray([])
    });

    /**
     * On Initialization
     */
    ngOnInit() {
        super.ngOnInit();
        this.disableControls = [];
        this.transferData = this.getNavigateData(this.activatedRoute);
        // TODO if(a) {...} ==> will be false if a is  false, 0, null, undefined, '' or NaN. See if you can use this
        if (this.transferData) {
            console.log(this.transferData.subModules);
            this.initRole.code = this.transferData.code;
            this.updateRoleForm.get('code').setValue(this.transferData.code);
            this.updateRoleForm.get('duties').setValue(this.transferData.duties);
            this.updateRoleForm.get('roleCategory').setValue(this.transferData.roleCategory);
            if (this.transferData.applicationAccess != null) {
                this.disableaccess = true;
                this.updateRoleForm.get('applicationAccess').setValue(this.transferData.applicationAccess);
            }
            this.fetchedSubModuleList = this.transferData.subModules;

            if (this.updateRoleForm.get('applicationAccess').value == 'Customer') {
                this.dropDownAny = this.createSourceParameter("'agent'");
            }
            else if (this.updateRoleForm.get('applicationAccess').value == 'Internal' || this.updateRoleForm.get('applicationAccess').value == 'External') {
                this.dropDownAny = this.createSourceParameter("'cosys','mobile'");
            }
            for (const entry of this.fetchedSubModuleList) {
                this.onAddInitRow(entry);
            }
        }

        this.hasReadPermission = NgcUtility.hasReadPermission('ROLE_LIST');
    }

    /**
     * Function to add new row into table
     * @param event Event
     */

    onButtonCancel(event) {
        this.functionListWindow.close();
    }

    onButtonSave() {
        let checkValueFlag = 0
        const noOfRows = (<NgcFormArray>this.updateRoleForm.get('resultList')).length;
        const noOfRowsInList = (<NgcFormArray>this.updateRoleForm.get('resultList')).length;
        let lastRow = noOfRows ? (<NgcFormArray>this.updateRoleForm.get('resultList')).controls[noOfRows - 1] : null;
        // TODO use !noOfRows
        const functionselected = (<NgcFormArray>this.updateRoleForm.get('functionList')).value;
        functionselected.forEach(element => {
            if (element.select) {
                if (noOfRowsInList < 1) {
                    this.disableControls.push({
                        disableSubModuleFlag: false
                    });
                    if (Number(element.param2) > 0) {
                        for (let i = 0; i < (<NgcFormArray>this.updateRoleForm.get('resultList')).length; i++) {
                            if ((<NgcFormControl>this.updateRoleForm.get(['resultList', i, 'moduleCode'])).value === element.param3) {
                                (<NgcFormArray>this.updateRoleForm.get(['resultList', i, 'subModuleByModuleCode'])).addValue([
                                    {
                                        sel: false,
                                        moduleCode: element.code,
                                        functionsRequired: element.code,
                                        applicationId: element.param1,
                                        read: true,
                                        displayFlag: true,
                                        updateFlag: false,
                                        readWrite: false,
                                        flagDelete: 'N',
                                        flagUpdate: 'N',
                                        flagInsert: 'Y',
                                        moduleFlag: true,
                                        screenCode: element.desc,
                                        readOnlyModule: false,
                                        delete: '',
                                        roleCode: this.updateRoleForm.get('code').value
                                    }
                                ]);
                            }
                        }
                    } else {

                        (<NgcFormArray>this.updateRoleForm.controls['resultList']).addValue([
                            {
                                sel: false,
                                functionsRequired: element.code,
                                applicationId: element.param1,
                                read: true,
                                readWrite: false,
                                flagDelete: 'N',
                                flagUpdate: 'N',
                                flagInsert: 'Y',
                                displayFlag: true,
                                updateFlag: false,
                                moduleCode: element.code,
                                moduleFlag: true,
                                readOnlyModule: false,
                                delete: '',
                                roleCode: this.updateRoleForm.get('code').value,
                                subModuleByModuleCode: []
                            }
                        ]);
                    }
                } else {
                    // applicationId > 0 is a sub Module
                    if (Number(element.param2) > 0) {
                        if ((noOfRows === 0 || (lastRow.get('functionsRequired').value))) {
                            this.disableControls.push({
                                disableSubModuleFlag: false
                            });
                            const checkModule = (<NgcFormArray>this.updateRoleForm.get(['resultList'])).value;
                            checkModule.forEach(elementChild => {
                                if (element.param3 === elementChild.moduleCode && elementChild.subModuleByModuleCode && elementChild.subModuleByModuleCode.length > 0) {
                                    elementChild.subModuleByModuleCode.forEach(elementChildModule => {
                                        if (elementChildModule.moduleCode === element.code) {
                                            checkValueFlag++;
                                        }
                                    });
                                }
                            });
                            if (checkValueFlag === 0) {
                                for (let i = 0; i < (<NgcFormArray>this.updateRoleForm.get('resultList')).length; i++) {
                                    if ((<NgcFormControl>this.updateRoleForm.get(['resultList', i, 'moduleCode'])).value === element.param3) {
                                        (<NgcFormArray>this.updateRoleForm.get(['resultList', i, 'subModuleByModuleCode'])).addValue([
                                            {
                                                sel: false,
                                                moduleCode: element.code,
                                                functionsRequired: element.code,
                                                applicationId: element.param1,
                                                read: true,
                                                displayFlag: true,
                                                updateFlag: false,
                                                readWrite: false,
                                                flagDelete: 'N',
                                                flagUpdate: 'N',
                                                flagInsert: 'Y',
                                                moduleFlag: true,
                                                screenCode: element.desc,
                                                readOnlyModule: false,
                                                delete: '',
                                                roleCode: this.updateRoleForm.get('code').value
                                            }
                                        ]);
                                    }
                                }
                            }
                        }
                    } else {
                        if (noOfRows === 0 || (lastRow.get('functionsRequired').value)) {
                            this.disableControls.push({
                                disableSubModuleFlag: false
                            });
                            const checkModule = (<NgcFormArray>this.updateRoleForm.get(['resultList'])).value;
                            checkModule.forEach(elementChild => {
                                if (element.code === elementChild.moduleCode) {
                                    checkValueFlag++;
                                }
                            });
                            if (checkValueFlag === 0) {
                                (<NgcFormArray>this.updateRoleForm.controls['resultList']).addValue([
                                    {
                                        sel: false,
                                        functionsRequired: element.code,
                                        applicationId: element.param1,
                                        read: true,
                                        readWrite: false,
                                        flagDelete: 'N',
                                        flagUpdate: 'N',
                                        flagInsert: 'Y',
                                        displayFlag: true,
                                        updateFlag: false,
                                        moduleCode: element.code,
                                        moduleFlag: true,
                                        readOnlyModule: false,
                                        delete: '',
                                        roleCode: this.updateRoleForm.get('code').value,
                                        subModuleByModuleCode: []
                                    }
                                ]);
                            }
                        }
                    }
                }
            }
        });
        (<NgcFormArray>(<NgcFormGroup>this.updateRoleForm).get('resultList')).controls.forEach((item) => {
            item.get('readWrite').valueChanges.subscribe(value => {
                item.get('moduleFlag').patchValue(true);
                if (value === true) {
                    if (value === item.get('read').value) {
                        item.get('read').patchValue(!value);
                    }
                }
            });
            item.get('read').valueChanges.subscribe(value => {
                item.get('moduleFlag').patchValue(true);
                if (value === true) {
                    if (value === item.get('readWrite').value) {
                        item.get('readWrite').patchValue(!value);
                    }

                }
            })
        });
        if (checkValueFlag === 0) {
            this.functionListWindow.close();
        } else {
            this.showErrorMessage("SHPIRR002");
        }
        if (this.goToFirstPage) {
            this.async(() => {
                this.edittable.goToPage(1);
            }, 500)
        }
    }
    public onAddRow(event) {
        this.retrieveLOVRecords("MENUITEM", this.dropDownAny).subscribe(record => {
            this.functionlist = record;
            this.functionlist.forEach(element => {
                element.select = false;
                if (element.param2 != '0') {
                    element.parent = false;
                } else {
                    element.parent = true;
                }
            });
            (<NgcFormArray>this.updateRoleForm.controls['functionList']).patchValue(this.functionlist);
            this.goToFirstPage = false;
            this.functionListWindow.open();
        });
    }

    /**
     * Function to populate assignFunction data  into table which is comming through routing
     * @param assignedFunction
     */
    public onAddInitRow(assignedFunction) {
        this.disableControls.push({
            disableSubModuleFlag: true
        });
        let dispFlag = false;
        let upFlag = false;
        if (assignedFunction.displayFlag) {
            dispFlag = true;

        } if (assignedFunction.updateFlag) {
            upFlag = true;
        }
        const newData: any = [{
            sel: false,
            functionsRequired: assignedFunction.moduleCode,
            read: dispFlag,
            readWrite: upFlag,
            flagDelete: 'N',
            flagUpdate: 'Y',
            flagInsert: 'N',
            flagCRUD: 'U',
            moduleFlag: assignedFunction.moduleFlag,
            moduleCode: assignedFunction.moduleCode,
            roleCode: assignedFunction.roleCode,
            applicationId: assignedFunction.applicationId,
            subModuleByModuleCode: assignedFunction.subModuleByModuleCode,
            readOnlyModule: assignedFunction.readOnlyModule
        }];
        (<NgcFormArray>this.updateRoleForm.controls['resultList']).addValue(newData);
        (<NgcFormArray>(<NgcFormGroup>this.updateRoleForm).get('resultList')).controls.forEach((item) => {
            item.get('readWrite').valueChanges.subscribe(value => {
                item.get('moduleFlag').patchValue(true);
                if (value === true) {
                    if (value === item.get('read').value) {
                        item.get('read').patchValue(!value);
                    }

                }
            });
            item.get('read').valueChanges.subscribe(value => {
                item.get('moduleFlag').patchValue(true);
                if (value === true) {
                    if (value === item.get('readWrite').value) {
                        item.get('readWrite').patchValue(!value);
                    }

                }
            })
        });


    }


    /**
     * Function to handle delete submodule request
     * @param event Event
     */
    public onDelete(i) {
        this.showConfirmMessage('admin.delete.assigned.function.details.confirmation').then(fulfilled => {
            let deleteIndex = 0;
            const deleteArray: any[] = [];
            const deleteSubMod: DeleteSubModuleRequest = new DeleteSubModuleRequest();
            const listArray = (<NgcFormArray>this.updateRoleForm.get('resultList')).controls;
            deleteIndex = i;
            const submodule: SubModule = new SubModule();
            submodule.description = listArray[i].value.functionsRequired;
            submodule.displayFlag = 0;
            submodule.updateFlag = 0;
            submodule.flagDelete = 'Y';
            deleteArray.push(submodule);
            deleteSubMod.code = this.updateRoleForm.get('code').value;
            deleteSubMod.applicationAccess = this.updateRoleForm.get('applicationAccess').value;
            deleteSubMod.subModules = deleteArray;
            this.adminService.deleteSubModule(deleteSubMod).subscribe(data => {
                this.resp = data;
                this.responseArray = this.resp.data;
                this.refreshFormMessages(data);
                if (this.resp.success) {
                    this.showSuccessStatus('g.completed.successfully');
                    this.updateSubModuleTable(deleteIndex);
                    this.updateFormArray();
                }
            },
            );
        }).catch(reason => {
        });
    }
    /**
     * Function to handle delete submodule request
     * @param event Event
     */
    public onDeleteSubModule(i, sindex) {
        this.showConfirmMessage('admin.delete.assigned.function.details.confirmation').then(fulfilled => {
            let deleteIndex = 0;
            const deleteArray: any[] = [];
            const deleteSubMod: DeleteSubModuleRequest = new DeleteSubModuleRequest();
            const listArray = (<NgcFormArray>this.updateRoleForm.get('resultList')).controls;
            deleteIndex = i;
            const submodule: SubModule = new SubModule();
            submodule.description = listArray[i].value.subModuleByModuleCode[sindex].moduleCode;
            submodule.displayFlag = 0;
            submodule.updateFlag = 0;
            submodule.flagDelete = 'Y';
            deleteArray.push(submodule);
            deleteSubMod.code = this.updateRoleForm.get('code').value;
            deleteSubMod.applicationAccess = this.updateRoleForm.get('applicationAccess').value;
            deleteSubMod.subModules = deleteArray;
            this.adminService.deleteSubModule(deleteSubMod).subscribe(data => {
                this.resp = data;
                this.responseArray = this.resp.data;
                this.refreshFormMessages(data);
                if (this.resp.success) {
                    this.showSuccessStatus('g.completed.successfully');
                    (<NgcFormArray>this.updateRoleForm.get(['resultList', i, 'subModuleByModuleCode'])).removeAt(sindex);
                    this.updateFormArray();
                }
            },
            );
        }).catch(reason => {
        });
    }

    /**
     * Function to populate Submodule table data after deleting submodule records
     * @param listArray Array
     */
    updateSubModuleTable(i) {
        (<NgcFormArray>this.updateRoleForm.controls['resultList']).removeAt(i);
    }

    /**
      * This Function to create a role object and add to the list that has to
      * be sent to backend for insertion
      */
    public onUpdateRole() {
        const updateRoleDetails: UpdateRoleRequest = new UpdateRoleRequest();
        const subModuleList: Array<SubModule> = [];
        let checkValue;
        updateRoleDetails.code = this.updateRoleForm.get('code').value;
        updateRoleDetails.duties = this.updateRoleForm.get('duties').value;
        updateRoleDetails.roleCategory = this.updateRoleForm.get('roleCategory').value;
        updateRoleDetails.applicationAccess = this.updateRoleForm.get('applicationAccess').value;
        updateRoleDetails.moduleFlag = this.updateRoleForm.get('moduleFlag').value;
        if (updateRoleDetails.applicationAccess === 'Internal') {
            updateRoleDetails.applicationAccess = 'I';
        } else if (updateRoleDetails.applicationAccess === 'External') {
            updateRoleDetails.applicationAccess = 'E';
        } else if (updateRoleDetails.applicationAccess === 'Customer') {
            updateRoleDetails.applicationAccess = 'C';
        }
        let listArray: any = [];
        let item = [];
        listArray = (<NgcFormArray>this.updateRoleForm.get(['resultList'])).getRawValue();
        item = listArray;
        for (let i = 0; i < item.length; i++) {
            if (item[i] && item[i].subModuleByModuleCode && item[i].subModuleByModuleCode.length > 0) {
                item.push(...item[i].subModuleByModuleCode)
            }
        }
        for (let i = 0; i < item.length; i++) {
            checkValue = item[i];
            checkValue.functionsRequired = checkValue.moduleCode;
            if (!checkValue.functionsRequired) {
                this.showInfoStatus('admin.select.atleast.read.write.each.record');
                return;
            }
            const subModule: SubModule = new SubModule();
            subModule.displayFlag = 0;
            subModule.updateFlag = 0;
            subModule.moduleCode = checkValue.functionsRequired;
            subModule.roleCode = checkValue.roleCode;
            subModule.moduleFlag = checkValue.moduleFlag;
            if (checkValue.subModuleByModuleCode) {
                if (checkValue.read) {
                    subModule.displayFlag = 1;
                } if (checkValue.readWrite) {
                    subModule.updateFlag = 1;
                }
            } else {
                if (checkValue.displayFlag) {
                    subModule.displayFlag = 1;
                } if (checkValue.updateFlag) {
                    subModule.updateFlag = 1;
                }
            }
            if (subModule.displayFlag === 0 && subModule.updateFlag === 0) {
                this.showInfoStatus('admin.select.atleast.read.write.each.record');
                return;
            }
            subModule.flagDelete = checkValue.flagDelete;
            subModule.flagUpdate = checkValue.flagUpdate;
            subModule.flagInsert = checkValue.flagInsert;
            subModule.flagCRUD = checkValue.flagCRUD;
            subModuleList.push(subModule);
        }
        updateRoleDetails.subModules = subModuleList;
        this.adminService.updateRole(updateRoleDetails).subscribe(data => {
            this.resp = data;
            this.responseArray = this.resp.data;
            this.refreshFormMessages(data);
            if (this.responseArray != null) {
                this.showSuccessStatus('g.completed.successfully');
                this.onCancel();
            } else {
                this.errors = this.resp.messageList;
                if (this.errors[0].message !== 'Required') {
                    this.showErrorStatus(this.errors[0].message);
                }
            }
        },
        );
    }

    public updateFormArray() {
        this.disableControls = [];
        const functionReqiredArray = (<NgcFormArray>this.updateRoleForm.get('resultList')).controls;
        for (let i = 0; i < functionReqiredArray.length; i++) {
            this.updateRoleForm.get('resultList.' + i + '.flagUpdate').setValue('Y');
            this.updateRoleForm.get('resultList.' + i + '.flagInsert').setValue('N');
            this.disableControls.push({
                disableSubModuleFlag: true
            });
        }
    }

    onCancel() {
        this.navigateTo(this.router, '/admin/rolelist', this.transferData);
    }

    onSelectFunction(event, index) {
        let lovparam: any;
        if (this.updateRoleForm.get('applicationAccess').value == 'Customer') {
            lovparam = this.createSourceParameter("'agent'");
        }
        else if (this.updateRoleForm.get('applicationAccess').value == 'Internal' || this.updateRoleForm.get('applicationAccess').value == 'External') {
            lovparam = this.createSourceParameter("'cosys','mobile'");
        }
        this.retrieveLOVRecord(event, "MENUITEM", lovparam).subscribe(data => {
            if (data.param2 === '1') {
                this.updateRoleForm.get(['resultList', index, 'readOnlyModule']).setValue(true);
            }
        }
        );
    }

    patchAllChildCheckBox(item, index) {
        let lovList = new Array();
        let itr = 0;
        for (let i = index + 1; i < this.functionlist.length; i++) {
            if (item.applicationMenuId === parseInt(this.functionlist[i].param2)) {
                lovList.push(this.functionlist[i]);
            } else {
                break;
            }
        }
        itr = lovList.length;
        for (let i = index; i <= itr + index; i++) {
            this.updateRoleForm.get(['functionList', i, 'select']).patchValue(item.select);
        }
    }

    patchParentCheckBox(item, index) {
        if (item.select) {
            let lovList = new Array();
            let itr = 0;
            for (let i = 0; i < this.functionlist.length; i++) {
                if (parseInt(item.param2) === parseInt(this.functionlist[i].applicationMenuId)) {
                    for (const eachRow of (<NgcFormArray>this.updateRoleForm.get(['resultList'])).getRawValue()) {
                        if (eachRow.moduleCode === item.param3) {
                            itr++;
                        }
                    }
                    if (itr > 0) {

                    } else {
                        this.updateRoleForm.get(['functionList', i, 'select']).patchValue(true);
                        break;
                    }
                }
            }
        }
    }

    onSelectMenu(event) {
        this.arrayToPatch = [];
        this.retrieveLOVRecords("MENUITEM", this.dropDownAny).subscribe(record => {
            this.functionlist = record;
            this.functionlist.forEach(element => {
                element.select = false;
                if (element.param2 != '0') {
                    element.parent = false;
                } else {
                    element.parent = true;
                }
                if (event) {
                    if (element.desc === event) {
                        this.arrayToPatch.push(element);
                    };
                } else {
                    this.arrayToPatch.push(element);
                }
            });
            (<NgcFormArray>this.updateRoleForm.controls['functionList']).patchValue(this.arrayToPatch);
        });
    }

    changeFlagRead(event, index) {
        if (event) {
            (<NgcFormControl>this.updateRoleForm.get(['resultList', index, 'readWrite'])).setValue(false);
            // (<NgcFormControl>this.updateRoleForm.get(['resultList', index, 'updateFlag'])).setValue(false);
            (<NgcFormControl>this.updateRoleForm.get(['resultList', index, 'moduleFlag'])).setValue(true);
        }
    }

    changeFlagWrite(event, index) {
        if (event) {
            (<NgcFormControl>this.updateRoleForm.get(['resultList', index, 'moduleFlag'])).setValue(true);
            (<NgcFormControl>this.updateRoleForm.get(['resultList', index, 'read'])).setValue(false);
            // (<NgcFormControl>this.updateRoleForm.get(['resultList', index, 'displayFlag'])).setValue(false);
        }
    }

    changeFlagReadScreen(event, index, sindex) {
        if (event) {
            (<NgcFormControl>this.updateRoleForm.get(['resultList', index, 'moduleFlag'])).setValue(true);
            (<NgcFormControl>this.updateRoleForm.get(['resultList', index, 'subModuleByModuleCode', sindex, 'moduleFlag'])).setValue(true);
            (<NgcFormControl>this.updateRoleForm.get(['resultList', index, 'subModuleByModuleCode', sindex, 'updateFlag'])).setValue(false);
            // (<NgcFormControl>this.updateRoleForm.get(['resultList', index, 'subModuleByModuleCode', sindex, 'readWrite'])).setValue(false);
        }
    }

    changeFlagWriteScreen(event, index, sindex) {
        if (event) {
            (<NgcFormControl>this.updateRoleForm.get(['resultList', index, 'moduleFlag'])).setValue(true);
            (<NgcFormControl>this.updateRoleForm.get(['resultList', index, 'subModuleByModuleCode', sindex, 'moduleFlag'])).setValue(true);
            // (<NgcFormControl>this.updateRoleForm.get(['resultList', index, 'subModuleByModuleCode', sindex, 'read'])).setValue(false);
            (<NgcFormControl>this.updateRoleForm.get(['resultList', index, 'subModuleByModuleCode', sindex, 'displayFlag'])).setValue(false);
        }
    }

    selectAll(value) {
        if (value) {
            this.goToFirstPage = true;
        } else {
            this.goToFirstPage = false;
        }
        for (let i = 0; i < (<NgcFormArray>this.updateRoleForm.get(['functionList'])).length; i++) {
            if (value) {
                this.updateRoleForm.get(['functionList', i, 'select']).patchValue(true);
            } else {
                this.updateRoleForm.get(['functionList', i, 'select']).patchValue(false);
            }
        }
    }
}
