import { Router } from '@angular/router';
// Angular imports
import { Validators } from '@angular/forms';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { FlightService } from '../flight.service';
// NGC framework imports
import {
    NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
    NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration
} from 'ngc-framework';
import { CodeShareFlightRequest, CodeShareFlightResponse, CodeShareFlight, CodeShareFlightGroup } from '../flight.sharedmodel';
@Component({
    selector: 'ngc-codeshareflight',
    templateUrl: './codeShareFlight.component.html',
    styleUrls: ['./codeShareFlight.component.scss']
})

/**
 * Code share flight Component is responsible to maintain the mappings of operating and code share flights
 */
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    autoBackNavigation: true,
    //restorePageOnBack: true
})

export class CodeShareFlightComponent extends NgcPage {
    @ViewChild('insertionWindow') insertionWindow: NgcWindowComponent;
    @ViewChild('updateWindow') updateWindow: NgcWindowComponent;
    @ViewChild('createbutton') createbutton: NgcButtonComponent;
    @ViewChild('updatebutton') updatebutton: NgcButtonComponent;
    @ViewChild('searchbutton') searchbutton: NgcButtonComponent;
    @ViewChild('deletebutton') deletebutton: NgcButtonComponent;
    codeShareFlightList: any[];
    editItemRowId: any;
    serviceResponse: any;
    isCodeShareDatatableVisible: boolean;
    codeShareFlightDeleteRequest: CodeShareFlight[];
    codeShareFlightUpdateRequest: CodeShareFlight[];
    codeShareFlightAddRequest: CodeShareFlight[];
    updateFromDate: any;
    min: Date;

    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef, private router: Router,
        private flightService: FlightService) {
        super(appZone, appElement, appContainerElement);
        // TODO functionId is to be implemented in backend to use in front end
        // this.functionId = 'CODESHAREFLIGHT';
        this.isCodeShareDatatableVisible = false;
        this.codeShareFlightList = [];
        this.codeShareFlightDeleteRequest = [];
        this.codeShareFlightAddRequest = [];
        this.codeShareFlightUpdateRequest = [];
        this.editItemRowId = -1;
    }

    private codeShareFlightForm: NgcFormGroup = new NgcFormGroup({
        operatingFlightNo: new NgcFormControl(''),
        shareFlightNo: new NgcFormControl(''),
        date: new NgcFormControl(null),
        resultList: new NgcFormArray(
            [
                new NgcFormGroup({
                    operatingFlightNo: new NgcFormControl(),
                    shareFlightNo: new NgcFormControl(),
                    flightFromDate: new NgcFormControl(),
                    flightToDate: new NgcFormControl(),
                    flagSaved: new NgcFormControl(),
                    flagUpdate: new NgcFormControl(),
                    flagInsert: new NgcFormControl(),
                    flagDelete: new NgcFormControl(),
                    edit: new NgcFormControl()
                })
            ]
        ),
        updateForm: new NgcFormGroup({
            operatingFlightNo: new NgcFormControl(),
            shareFlightNo: new NgcFormControl(),
            flightFromDate: new NgcFormControl(),
            flightToDate: new NgcFormControl(''),
            flagSaved: new NgcFormControl('Y'),
            flagUpdate: new NgcFormControl('N'),
            flagInsert: new NgcFormControl('N'),
            flagDelete: new NgcFormControl('Y')
        }),
        insertionForm: new NgcFormGroup({
            operatingFlightNo: new NgcFormControl(),
            shareFlightNo: new NgcFormControl(),
            flightFromDate: new NgcFormControl(),
            flightToDate: new NgcFormControl(''),
            flagSaved: new NgcFormControl('N'),
            flagUpdate: new NgcFormControl('N'),
            flagInsert: new NgcFormControl('Y'),
            flagDelete: new NgcFormControl('N')
        })
    });
    ngOnInit() {
        const today = new Date();
        this.min = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        // this.createbutton.disabled = true;
        this.subscribeValidateInsert();
        this.subscribeValidateUpdate();
    }
    /**
     * Function that makes create button on insertion form
     * clickable when valid input is given
     */
    subscribeValidateInsert() {
        // this.codeShareFlightForm.get('insertionForm').valueChanges.subscribe(data => {
        //     if (data['operatingFlightNo'] === '' || data['shareFlightNo'] === '' || data['flightFromDate'] === null
        //         || data['flightToDate'] === null) {
        //         this.createbutton.disabled = false;
        //     } else {
        //         this.createbutton.disabled = false;
        //     }
        // });
    }
    /**
     * Function that makes update button on update form
     * clickable when valid input is given
     */
    subscribeValidateUpdate() {
        // this.codeShareFlightForm.get('updateForm').statusChanges.subscribe(data => {
        //     if (data === 'VALID') {
        //         this.updatebutton.disabled = false;
        //     } else {
        //         this.updatebutton.disabled = true;
        //     }
        // });
    }

    /**
     * Function will open a window to enter the Operating, Code Share Flight, date range
     * to create new code share flight mapping
     */
    clickAddRow(event) {
        this.codeShareFlightList.push({
            operatingFlightNo: '',
            shareFlightNo: '',
            flightFromDate: '',
            flightToDate: '',
            flagSaved: 'N',
            flagInsert: 'Y',
            flagUpdate: 'N',
            flagDelete: 'N',
            loggedInUser: this.getUserProfile().userLoginCode
        });
        this.insertionWindow.open();
    }

    /**
     * Function to search code share flights based on the search criteria
     */
    public onSearch() {
        this.clearDatatable();
        const codeShareFlightRequest: CodeShareFlightRequest = new CodeShareFlightRequest();
        if (this.codeShareFlightForm.get('operatingFlightNo').value === null || this.codeShareFlightForm.get('operatingFlightNo').value === '') {
            if (this.getUserProfile().userRestrictedAirlines !== null) {
                codeShareFlightRequest.restrictedcarrier = this.getUserProfile().userRestrictedAirlines;
            }
        }
        codeShareFlightRequest.operatingFlightNo = this.codeShareFlightForm.get('operatingFlightNo').value;
        codeShareFlightRequest.shareFlightNo = this.codeShareFlightForm.get('shareFlightNo').value;
        codeShareFlightRequest.flightDate = this.codeShareFlightForm.get('date').value;
        // this.searchbutton.disabled = true;
        this.flightService.getCodeShareFlights(codeShareFlightRequest).subscribe(data => {
            if (!this.showResponseErrorMessages(data)) {
                this.serviceResponse = data;
                this.refreshFormMessages(data);
                if (this.serviceResponse.messageList === null) {
                    this.codeShareFlightList = this.serviceResponse.data;
                    this.bindCodeShareFlightData();
                    this.isCodeShareDatatableVisible = true;
                }
                if (data.data == null) {
                    this.showErrorStatus('flight.no.record');
                }
                this.searchbutton.disabled = false;
            }
        },
            error => {
                this.searchbutton.disabled = false;
                this.showErrorStatus('Error:' + error);

            });

    }
    /**
     * Function to bind the data fetched from backend to the array resultList
     * to show in which date range code sharing of flights is present.
     */
    bindCodeShareFlightData() {
        this.formatFlight();
        (<NgcFormArray>this.codeShareFlightForm.controls['resultList']).resetValue(this.codeShareFlightList);
    }
    /**
     * Function which combines formats data of flight to display in datatable
     */
    formatFlight() {
        for (let index = 0; index < this.codeShareFlightList.length; index++) {
            this.codeShareFlightList[index]['flightFromDate'] =
                NgcUtility.toDateFromLocalDate(this.codeShareFlightList[index]['flightFromDate']);
            this.codeShareFlightList[index]['flightToDate'] =
                NgcUtility.toDateFromLocalDate(this.codeShareFlightList[index]['flightToDate']);
            this.codeShareFlightList[index]['edit'] = 'Edit';
        }
    }

    /**
     * Function to empty the resultList form array and bring the results to the fresh state
     */
    clearDatatable() {
        this.codeShareFlightDeleteRequest = [];
        this.codeShareFlightAddRequest = [];
        this.codeShareFlightUpdateRequest = [];
        this.codeShareFlightList = [];
        this.insertionWindow.hide();
        this.updateWindow.hide();
        this.isCodeShareDatatableVisible = false;
    }
    /**
     * On Confirmation
     * @param event Event
     */
    onConfirm(event) {
        const self = this;
        var a = 0;
        for (let index = this.codeShareFlightList.length - 1; index >= 0; index--) {
            const item = (<NgcFormArray>this.codeShareFlightForm.get('resultList'))['controls'][index]['value'];
            if (item['flagDelete'] === true) {
                a = 1;
            }

        }
        if (a === 0) {
            this.showErrorStatus('flight.select.atleast.one.checkbox')

        }
        else {
            this.showConfirmMessage('flight.delete.selected.record').then(fulfilled => {
                self.onCodeShareFlightDelete()
            });
        }
    }
    /**
     * Function to be called after selection to delete has been made
     */
    onCodeShareFlightDelete() {
        const indices = [];
        for (let index = this.codeShareFlightList.length - 1; index >= 0; index--) {
            const item = (<NgcFormArray>this.codeShareFlightForm.get('resultList'))['controls'][index]['value'];
            if (item['flagDelete'] === true) {
                const actualDelete = this.createDeletionList(item);
                this.codeShareFlightDeleteRequest.push(actualDelete);
            }
        }
        for (let index = 0; index < indices.length; index++) {
            this.codeShareFlightList.splice(indices[index], 1);
            (<NgcFormArray>this.codeShareFlightForm.controls['resultList']).removeAt(indices[index]);
        }
        const deleteRequest = new CodeShareFlightGroup();
        deleteRequest.codeShareFlightList = this.codeShareFlightDeleteRequest;
        if (deleteRequest.codeShareFlightList.length > 0) {
            this.deletebutton.disabled = true;
            this.flightService.deleteCodeShareFlight(deleteRequest).subscribe(data => {
                this.serviceResponse = data;
                const deleteCodeShareFlight = this.serviceResponse.data;
                this.refreshFormMessages(data);
                if (deleteCodeShareFlight != null) {
                    this.codeShareFlightDeleteRequest = [];
                    this.showSuccessStatus('g.completed.successfully');
                    this.onSearch();
                }
                this.deletebutton.disabled = false;
            },
                error => {
                    this.showErrorStatus('Error:' + error);
                    this.deletebutton.disabled = false;
                }
            );
        }
    }
    /**
     * Function to create a object to add to the list that has to be sent to backend for deleting
     *
     * @param deleteData data record that has to be deleted
     */
    createDeletionList(deleteData) {
        const codeShareFlightDeleteRequestLocal: CodeShareFlight = new CodeShareFlight();
        codeShareFlightDeleteRequestLocal.operatingFlightNo = deleteData['operatingFlightNo'];
        codeShareFlightDeleteRequestLocal.shareFlightNo = deleteData['shareFlightNo'];
        codeShareFlightDeleteRequestLocal.flightFromDate = deleteData['flightFromDate'];
        codeShareFlightDeleteRequestLocal.flightToDate = deleteData['flightToDate'];
        return codeShareFlightDeleteRequestLocal;
    }
    /**
     * Function that iterates whole form for update and insert records and send it to backend
     */
    onCodeShareFlightUpdate(formName) {

        const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.codeShareFlightForm.get(formName));
        searchFormGroup.validate();
        if (this.codeShareFlightForm.get(formName).invalid) {
            console.log('invalid return')
            return;
        }

        const today = new Date();
        const todayDate = new Date(today.getFullYear() + ', ' + (today.getMonth() + 1) + ', ' + today.getDate());
        const item = this.codeShareFlightForm.get(formName).value;
        item['flightFromDate'] = this.codeShareFlightForm.get(formName).get('flightFromDate').value;
        const fromDate = Date.parse(item['flightFromDate']);
        const toDate = Date.parse(item['flightToDate']);
        if (fromDate > toDate) {
            this.refreshFormMessages(this.errorMessage('E', formName + '.flightToDate', 'flight.effective.from'));
        } else if (item['operatingFlightNo'] === item['shareFlightNo']) {
            this.refreshFormMessages(this.errorMessage('E', formName + '.shareFlightNo', 'flight.diff.from.operating.flight'));
        } else if ((item['flagUpdate'] === 'Y') || (item['flagInsert'] === 'Y')) {
            this.createMaintainCodeShareFlightList(item);
            if (this.codeShareFlightUpdateRequest.length > 0) {
                const updateRequest = new CodeShareFlightGroup();
                updateRequest.codeShareFlightList = this.codeShareFlightUpdateRequest;
                updateRequest.codeShareFlightList.forEach(item => {
                    item.loggedInUser = this.getUserProfile().userLoginCode;
                })
                // this.updatebutton.disabled = true;
                // this.createbutton.disabled = true;
                this.flightService.maintainCodeShareFlight(updateRequest).subscribe(data => {
                    if (!this.showResponseErrorMessages(data)) {
                        this.serviceResponse = data;
                        const addCodeShareFlight = this.serviceResponse.data;
                        //this.codeShareFlightForm.get('updateForm').patchValue(addCodeShareFlight);
                        this.refreshFormMessages(data);
                        if (addCodeShareFlight != null) {
                            this.onSearch();
                            this.showSuccessStatus('g.completed.successfully');
                            if (this.codeShareFlightForm.get('operatingFlightNo').value !== '' ||
                                this.codeShareFlightForm.get('shareFlightNo').value !== '') {
                            } else {
                                this.onToggleInsert();
                                this.onToggleUpdate();
                            }
                        }
                    }
                },
                    error => {
                        this.showErrorStatus('Error:' + error);
                        this.onToggleInsert();
                        this.onToggleUpdate();
                    }
                );
            }
        }

    }
    /**
     * Function to create a object to add to the list that has to be sent to backend for updation and insertion
     *
     * @param updateData
     * @param index
     */
    createMaintainCodeShareFlightList(updateData) {
        this.codeShareFlightUpdateRequest = [];
        const codeShareFlightUpdateRequestLocal: CodeShareFlight = new CodeShareFlight();
        codeShareFlightUpdateRequestLocal.operatingFlightNo = updateData['operatingFlightNo'];
        codeShareFlightUpdateRequestLocal.shareFlightNo = updateData['shareFlightNo'];
        codeShareFlightUpdateRequestLocal.flightFromDate = updateData['flightFromDate'];
        codeShareFlightUpdateRequestLocal.flightToDate = updateData['flightToDate'];
        codeShareFlightUpdateRequestLocal.flagSaved = updateData['flagSaved'];
        codeShareFlightUpdateRequestLocal.flagUpdate = updateData['flagUpdate'];
        codeShareFlightUpdateRequestLocal.flagInsert = updateData['flagInsert'];
        this.codeShareFlightUpdateRequest.push(codeShareFlightUpdateRequestLocal);
    }
    /**
     * Function which is called when a link in datatable is called
     *
     * @param event
     */
    public onLinkClick(event) {
        debugger
        if (event.type === 'link') {
            const columnName = event.column;
            const record = event.record;
            this.editItemRowId = event.record.uid;
            this.codeShareFlightList[this.editItemRowId].flagUpdate = 'Y';
            this.codeShareFlightForm.get('updateForm').patchValue(this.codeShareFlightList[event.record.uid]);
            this.codeShareFlightForm.get('updateForm')
                .get('flightFromDate').patchValue(this.codeShareFlightList[event.record.uid]['flightFromDate']);
            this.codeShareFlightForm.get('updateForm')
                .get('flightToDate').patchValue(this.codeShareFlightList[event.record.uid]['flightToDate']);
            this.codeShareFlightForm.get('updateForm').get('flightFromDate').disable();
            this.updateWindow.open();
        }
    }
    /**
     * Function to close the updateWindow
     */
    public onToggleUpdate() {
        this.updateWindow.hide();
    }
    /**
     * Function to close the insertWindow
     */
    public onToggleInsert() {
        this.codeShareFlightForm.get('insertionForm').patchValue({
            operatingFlightNo: null,
            shareFlightNo: null,
            flightFromDate: null,
            flightToDate: null,
            flagSaved: 'N',
            flagInsert: 'Y',
            flagUpdate: 'N',
            flagDelete: 'N'
        });
        this.resetFormMessages();
        this.insertionWindow.hide();
    }
    /**
     * show input level error
     */
    public errorMessage(type, referenceId, message) {
        const errorMessage = {
            'confirmMessage': false,
            'messageList': [
                {
                    'type': type,
                    'referenceId': referenceId,
                    'message': message
                }
            ],
            'success': false,
            'data': null
        };
        return errorMessage;
    }
    public onBack(event) {
        this.navigateBack(this.codeShareFlightForm.getRawValue());
    }
}
