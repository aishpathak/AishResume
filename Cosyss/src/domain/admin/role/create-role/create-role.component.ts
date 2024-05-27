
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, StatusMessage, PageConfiguration, NgcWindowComponent, NgcEditTableComponent } from 'ngc-framework';
import { AdminService } from '../../admin.service';
import { FormsModule, Validators } from '@angular/forms';
import { CreateRoleRequest, CreateRoleResponse, FunctionRQ, SubModule, DeleteSubModuleRequest } from '../../admin.sharedmodel';

@Component({
    selector: 'ngc-create-role',
    templateUrl: './create-role.component.html',
    styleUrls: ['./create-role.component.scss']
})
/**
 * This class Allow  to create Admin role and to preform insert operation.
 */
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    autoBackNavigation: true,
    restorePageOnBack: true
})
export class CreateRoleComponent extends NgcPage {
    @ViewChild("functionListWindow")
    functionListWindow: NgcWindowComponent;
    @ViewChild("edittable")
    edittable: NgcEditTableComponent;
    resp: any;
    saveRole: boolean;
    responseArray: any[];
    errors: any[];
    dropDownAny: any;
    functionlist: any[];
    arrayToPatch: any[];
    goToFirstPage: boolean = false;

    /**
    * On component creation
    */
    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private adminService: AdminService) {
        super(appZone, appElement, appContainerElement);
    }

    private roleForm: NgcFormGroup = new NgcFormGroup({
        code: new NgcFormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(15), Validators.pattern("([a-zA-Z0-9\-_]*\s*$)")]),
        duties: new NgcFormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(64)]),
        roleCategory: new NgcFormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
        applicationAccess: new NgcFormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]),
        resultList: new NgcFormArray([]),
        menuItem: new NgcFormControl(),
        selectCheckbox: new NgcFormControl(),
        functionList: new NgcFormArray([])
    });

    /**
     * On Initialization
     */
    ngOnInit() {
        super.ngOnInit();

    }

    /**
     * Function to insert new row into table
     * @param event Event
     */

    onButtonCancel(event) {
        this.functionListWindow.close();
    }

    onButtonSave() {
        let checkValueFlag = 0
        let checkValueFlagParent = 0
        const noOfRows = (<NgcFormArray>this.roleForm.get('resultList')).length;
        const noOfRowsInList = (<NgcFormArray>this.roleForm.get('resultList')).length;
        const lastRow = noOfRows ? (<NgcFormArray>this.roleForm.get('resultList')).controls[noOfRows - 1] : null;
        const functionselected = (<NgcFormArray>this.roleForm.get('functionList')).value;
        functionselected.forEach(element => {
            if (element.select) {
                if (noOfRowsInList < 1) {

                    if (Number(element.param2) > 0) {
                        for (let i = 0; i < (<NgcFormArray>this.roleForm.get('resultList')).length; i++) {
                            if ((<NgcFormControl>this.roleForm.get(['resultList', i, 'moduleCode'])).value === element.param3) {
                                (<NgcFormArray>this.roleForm.get(['resultList', i, 'subModuleByModuleCode'])).addValue([
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
                                        roleCode: this.roleForm.get('code').value
                                    }
                                ]);
                            }
                        }
                    } else {

                        (<NgcFormArray>this.roleForm.controls['resultList']).addValue([
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
                                roleCode: this.roleForm.get('code').value,
                                subModuleByModuleCode: []
                            }
                        ]);
                    }
                } else {
                    if (element.param2 > 0) {
                        if ((noOfRows === 0 || (lastRow.get('functionsRequired').value))) {
                            for (let i = 0; i < (<NgcFormArray>this.roleForm.get('resultList')).length; i++) {
                                if ((<NgcFormControl>this.roleForm.get(['resultList', i, 'moduleCode'])).value === element.param3) {
                                    const checkModule = (<NgcFormArray>this.roleForm.get(['resultList', i, 'subModuleByModuleCode'])).value;
                                    checkModule.forEach(elementChild => {
                                        if (element.code === elementChild.moduleCode) {
                                            checkValueFlag++;
                                        }
                                    });
                                    if (checkValueFlag === 0) {
                                        (<NgcFormArray>this.roleForm.get(['resultList', i, 'subModuleByModuleCode'])).addValue([
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
                                                delete: false,
                                                roleCode: this.roleForm.get('code').value
                                            }
                                        ]);
                                    }
                                }
                            }
                        }
                    } else {
                        if (noOfRows === 0 || !lastRow) {
                            (<NgcFormArray>this.roleForm.controls['resultList']).addValue([
                                {
                                    sel: false,
                                    readOnlyModule: false,
                                    functionsRequired: element.code,
                                    read: true,
                                    readWrite: false,
                                    subModuleByModuleCode: [],
                                    applicationId: element.param1,
                                    flagDelete: 'N',
                                    flagUpdate: 'N',
                                    flagInsert: 'Y',
                                    displayFlag: false,
                                    updateFlag: false,
                                    moduleCode: element.code,
                                    moduleFlag: true,
                                    delete: false,
                                    roleCode: this.roleForm.get('code').value

                                }
                            ]);
                        } else if (noOfRows === 0 || (lastRow.get('functionsRequired').value)) {
                            for (let i = 0; i < (<NgcFormArray>this.roleForm.get('resultList')).length; i++) {
                                if ((<NgcFormControl>this.roleForm.get(['resultList', i, 'functionsRequired'])).value === element.code) {
                                    checkValueFlagParent++;
                                }
                            }
                            if (checkValueFlagParent === 0) {
                                (<NgcFormArray>this.roleForm.controls['resultList']).addValue([
                                    {
                                        sel: false,
                                        readOnlyModule: false,
                                        functionsRequired: element.code,
                                        read: true,
                                        readWrite: false,
                                        subModuleByModuleCode: [],
                                        applicationId: element.param1,
                                        flagDelete: 'N',
                                        flagUpdate: 'N',
                                        flagInsert: 'Y',
                                        displayFlag: false,
                                        updateFlag: false,
                                        moduleCode: element.code,
                                        moduleFlag: true,
                                        delete: false,
                                        roleCode: this.roleForm.get('code').value

                                    }
                                ]);
                            }
                        }
                    }
                    (<NgcFormArray>(<NgcFormGroup>this.roleForm).get('resultList')).controls.forEach((item) => {
                        item.get('readWrite').valueChanges.subscribe(value => {
                            if (value === true) {
                                if (value === item.get('read').value) {
                                    item.get('read').patchValue(!value);
                                }

                            }
                        });
                        item.get('read').valueChanges.subscribe(value => {
                            if (value === true) {
                                if (value === item.get('readWrite').value) {
                                    item.get('readWrite').patchValue(!value);
                                }

                            }
                        })
                    });
                }
            }
        });
        if (checkValueFlag === 0 &&
            checkValueFlagParent === 0) {
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
            (<NgcFormArray>this.roleForm.controls['functionList']).patchValue(this.functionlist);
            this.roleForm.get('selectCheckbox').setValue(false);
            this.goToFirstPage = false;
            this.functionListWindow.open();
        });
    }
    /**
         * Function to handle delete submodule request
         * @param event Event
         */
    public onDelete(parent) {
        this.showConfirmMessage('admin.delete.assigned.function.details.confirmation').then(fulfilled => {

            let item = [];
            item = (this.roleForm.get(['resultList', parent, 'subModuleByModuleCode']) as NgcFormArray).controls;
            for (let i = 0; i < item.length; i++) {
                (<NgcFormArray>this.roleForm.get(['resultList', parent, 'subModuleByModuleCode'])).removeAt(i);
            }
            (<NgcFormArray>this.roleForm.get(['resultList'])).removeAt(parent);
        }).catch(reason => {
        });
    }
    /**
     * Function to handle delete submodule request
     * @param event Event
     */
    public onDeleteSubModule(i, sindex) {
        this.showConfirmMessage('admin.delete.assigned.function.details.confirmation').then(fulfilled => {
            (<NgcFormArray>this.roleForm.get(['resultList', i, 'subModuleByModuleCode'])).removeAt(sindex);
            // this.updateFormArray();
        }).catch(reason => {
        });
    }

    /**
     * Function to populate Submodule table data after deleting submodule records
     * @param listArray Array
     */
    updateSubModuleTable(i) {
        (<NgcFormArray>this.roleForm.controls['resultList']).removeAt(i);
    }

    validateRoleCode(rolecode) {
        var patt = new RegExp("^[a-zA-Z0-9\-_]*\s*$");
        return patt.test(rolecode);

    }

    //  // (<NgcFormArray>this.roleForm.controls['resultList']).removeAt(roleArray[i]);
    /**
     * Function to handle create new role request
     */
    public onCreateRole() {
        let checkValue;
        if (this.roleForm.get('code').value !== null && this.roleForm.get('code').value.trim() !== '' && !this.validateRoleCode(this.roleForm.get('code').value)) {
            return this.showErrorStatus('admin.role.code.space.validation');
        }
        const createRoleDetails: CreateRoleRequest = new CreateRoleRequest();
        const subModuleList: Array<SubModule> = [];
        createRoleDetails.code = this.roleForm.get('code').value;
        createRoleDetails.duties = this.roleForm.get('duties').value;
        createRoleDetails.roleCategory = this.roleForm.get('roleCategory').value;
        createRoleDetails.applicationAccess = this.roleForm.get('applicationAccess').value;
        if (createRoleDetails.applicationAccess === 'Internal') {
            createRoleDetails.applicationAccess = 'I';
        } else if (createRoleDetails.applicationAccess === 'External') {
            createRoleDetails.applicationAccess = 'E';
        } else if (createRoleDetails.applicationAccess === 'Customer') {
            createRoleDetails.applicationAccess = 'C';
        }
        let listArray = [];
        listArray = (<NgcFormArray>this.roleForm.get('resultList')).getRawValue();
        for (let i = 0; i < listArray.length; i++) {
            if (listArray[i] && listArray[i].subModuleByModuleCode && listArray[i].subModuleByModuleCode.length > 0) {
                listArray.push(...listArray[i].subModuleByModuleCode)
            }
        }
        for (let i = 0; i < listArray.length; i++) {
            checkValue = listArray[i];
            checkValue.functionsRequired = checkValue.moduleCode;
            if (!checkValue.functionsRequired) {
                this.showErrorStatus('admin.field.empty.validation');
                return;
            }
            if (!checkValue.read && !checkValue.readWrite) {
                this.showInfoStatus('admin.select.atleast.read.write.each.record');
                return;
            }
            const subModule: SubModule = new SubModule();
            subModule.displayFlag = 0;
            subModule.updateFlag = 0;
            subModule.description = checkValue.functionsRequired;
            subModule.roleCode = checkValue.code;
            subModule.moduleCode = checkValue.functionsRequired; //value.functionsRequired.code;
            if (checkValue.read) {
                subModule.displayFlag = 1;
            } if (checkValue.readWrite) {
                subModule.updateFlag = 1;
            }
            subModuleList.push(subModule);
        }
        createRoleDetails.subModules = subModuleList;
        this.adminService.saveRole(createRoleDetails).subscribe(data => {
            this.resp = data;
            this.responseArray = this.resp.data;
            this.refreshFormMessages(data);
            if (this.resp.success) {
                this.showSuccessStatus('g.completed.successfully');
            } else {
                this.errors = this.resp.messageList;
                if (this.errors[0].message !== 'Required') {
                    this.showErrorStatus(this.errors[0].code);
                }
            }
        },
        );
    }
    onSelect(event) {
        if (event.code == 'Customer') {
            this.dropDownAny = this.createSourceParameter("'agent'");
        }
        else if (event.code == 'Internal' || event.code == 'External') {
            this.dropDownAny = this.createSourceParameter("'cosys','mobile'");
        }

    }

    searchExistingRole(event) {
        const searchExistingValue = this.roleForm.getRawValue();
        this.adminService.searchExistingRole(searchExistingValue).subscribe(response => {
            this.refreshFormMessages(response);
            if (response.messageList) {
                if (response.messageList[0].message) {
                    this.showErrorStatus(response.messageList[0].code);
                }
            }
        });
    }

    onSelectFunction(event, index) {
        let lovparam: any;
        if (this.roleForm.get('applicationAccess').value == 'Customer') {
            lovparam = this.createSourceParameter("'agent'");
        }
        else if (this.roleForm.get('applicationAccess').value == 'Internal' || this.roleForm.get('applicationAccess').value == 'External') {
            lovparam = this.createSourceParameter("'cosys','mobile'");
        }
        this.retrieveLOVRecord(event, "MENUITEM", lovparam).subscribe(data => {
            //this.roleForm.get(['restrictedAirlines', index, 'carrierCodeName']).setValue(data.desc);
            // console.log(data)
            if (data.param2 === '1') {
                this.roleForm.get(['resultList', index, 'readOnlyModule']).setValue(true);
            }
        }
        );
    }

    patchAllChildCheckBox(item, index) {
        let lovList = new Array();
        let itr = 0;
        // if (item.select) {
        for (let i = index + 1; i < this.functionlist.length; i++) {
            if (item.applicationMenuId === parseInt(this.functionlist[i].param2)) {
                lovList.push(this.functionlist[i]);
            } else {
                break;
            }
        }
        itr = lovList.length;
        for (let i = index; i <= itr + index; i++) {
            this.roleForm.get(['functionList', i, 'select']).patchValue(item.select);
        }
    }

    patchParentCheckBox(item, index) {
        if (item.select) {
            let lovList = new Array();
            let itr = 0;
            for (let i = 0; i < this.functionlist.length; i++) {
                if (parseInt(item.param2) === parseInt(this.functionlist[i].applicationMenuId)) {
                    for (const eachRow of (<NgcFormArray>this.roleForm.get(['resultList'])).getRawValue()) {
                        if (eachRow.moduleCode === item.param3) {
                            itr++;
                        }
                    }
                    if (itr > 0) {

                    } else {
                        this.roleForm.get(['functionList', i, 'select']).patchValue(true);
                        break;
                    }
                }
            }
        }
    }

    patchAllCheckBox(selectCheckbox) {
        if (selectCheckbox) {
            this.goToFirstPage = true;
        } else {
            this.goToFirstPage = false;
        }
        for (let i = 0; i < this.functionlist.length; i++) {
            if (selectCheckbox) {
                (<NgcFormControl>this.roleForm.get(['functionList', i, 'select'])).patchValue(true);
            } else {
                (<NgcFormControl>this.roleForm.get(['functionList', i, 'select'])).patchValue(false);
            }
        }
    }

    changeFlagReadScreen(event, index, sindex) {
        if (event) {
            (<NgcFormControl>this.roleForm.get(['resultList', index, 'moduleFlag'])).setValue(true);
            (<NgcFormControl>this.roleForm.get(['resultList', index, 'subModuleByModuleCode', sindex, 'moduleFlag'])).setValue(true);
            (<NgcFormControl>this.roleForm.get(['resultList', index, 'subModuleByModuleCode', sindex, 'updateFlag'])).setValue(false);
            (<NgcFormControl>this.roleForm.get(['resultList', index, 'subModuleByModuleCode', sindex, 'readWrite'])).setValue(false);
        }
    }

    changeFlagWriteScreen(event, index, sindex) {
        if (event) {
            (<NgcFormControl>this.roleForm.get(['resultList', index, 'moduleFlag'])).setValue(true);
            (<NgcFormControl>this.roleForm.get(['resultList', index, 'subModuleByModuleCode', sindex, 'moduleFlag'])).setValue(true);
            (<NgcFormControl>this.roleForm.get(['resultList', index, 'subModuleByModuleCode', sindex, 'displayFlag'])).setValue(false);
            (<NgcFormControl>this.roleForm.get(['resultList', index, 'subModuleByModuleCode', sindex, 'read'])).setValue(false);
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
            (<NgcFormArray>this.roleForm.controls['functionList']).patchValue(this.arrayToPatch);
        });
    }

}
