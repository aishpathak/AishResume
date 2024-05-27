// Angular imports
import { Validators } from '@angular/forms';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
// Backend service imports
import { FlightService } from '../flight.service';
// NGC framework imports
import {
    NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
    NgcWindowComponent, NgcButtonComponent, NgcUtility, PageConfiguration
} from 'ngc-framework';
// UFIS models
import { UfisFlightRequest, UfisFlightResponse, UfisFlight, UfisFlightGroup } from '../flight.sharedmodel';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'ngc-ufisflight',
    templateUrl: './ufisFlight.component.html',
    styleUrls: ['./ufisFlight.component.scss']
})
/**
 * UfisFlightComponent  is responsible to maintain the mappings of UFIS(Universal Flight Information System)
 * and COSYS flights
 */
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    // restorePageOnBack: true,
    autoBackNavigation: true
})
export class UfisFlightComponent extends NgcPage {
    @ViewChild('insertionWindow') insertionWindow: NgcWindowComponent;
    @ViewChild('updateWindow') updateWindow: NgcWindowComponent;
    @ViewChild('createbutton') createbutton: NgcButtonComponent;
    @ViewChild('updatebutton') updatebutton: NgcButtonComponent;
    @ViewChild('searchbutton') searchbutton: NgcButtonComponent;
    @ViewChild('deletebutton') deletebutton: NgcButtonComponent;
    ufisFlightList: any[];
    serviceResponse: any;
    isUfisFlightDatatableVisible: boolean;
    ufisFlightDeleteRequest: UfisFlight[];
    ufisFlightUpdateRequest: UfisFlight;
    min: Date;

    private ufisFlightForm: NgcFormGroup = new NgcFormGroup
        ({
            flightNo: new NgcFormControl(''),
            ufisList: new NgcFormArray(
                [
                    new NgcFormGroup({
                        ufisFlightId: new NgcFormControl(),
                        cosysFlightNo: new NgcFormControl(),
                        ufisFlightNo: new NgcFormControl(),
                        flightFromDate: new NgcFormControl(),
                        flightToDate: new NgcFormControl(),
                        flagSaved: new NgcFormControl(),
                        flagUpdate: new NgcFormControl(),
                        flagInsert: new NgcFormControl(),
                        flagDelete: new NgcFormControl()
                    })
                ]
            ),
            updateForm: new NgcFormGroup({
                ufisFlightId: new NgcFormControl(),
                cosysFlightNo: new NgcFormControl('', [Validators.required]),
                ufisFlightNo: new NgcFormControl('', [Validators.required]),
                flightFromDate: new NgcFormControl('', [Validators.required]),
                flightToDate: new NgcFormControl(''),
                flagSaved: new NgcFormControl('Y'),
                flagUpdate: new NgcFormControl('N'),
                flagInsert: new NgcFormControl('N'),
                flagDelete: new NgcFormControl('Y')
            }),
            insertionForm: new NgcFormGroup({
                cosysFlightNo: new NgcFormControl('', [Validators.required]),
                ufisFlightNo: new NgcFormControl('', [Validators.required]),
                flightFromDate: new NgcFormControl('', [Validators.required]),
                flightToDate: new NgcFormControl(''),
                flagSaved: new NgcFormControl('N'),
                flagUpdate: new NgcFormControl('N'),
                flagInsert: new NgcFormControl('Y'),
                flagDelete: new NgcFormControl('N')
            })
        });

    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef,
        private flightService: FlightService, private router: Router) {
        super(appZone, appElement, appContainerElement);
        // TODO functionId is to be implemented in backend to use in front end
        // this.functionId = 'UFISFLIGHT';
        this.isUfisFlightDatatableVisible = false;
        this.ufisFlightList = [];
        this.ufisFlightDeleteRequest = [];
        this.ufisFlightUpdateRequest = null;
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        super.ngOnInit();
        const today = new Date();
        this.min = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        this.subscribeValidateInsert();
        this.subscribeValidateUpdate();
    }
    /**
     * Function to subscribe for create button to be clickable if valid inputs are givenbg
     */
    subscribeValidateInsert() {
        this.ufisFlightForm.get('insertionForm').valueChanges.subscribe(data => {
            if (data['cosysFlightNo'] === '' || data['ufisFlightNo'] === '' || data['flightFromDate'] === null) {
                this.createbutton.disabled = true;
            } else {
                this.createbutton.disabled = false;
            }
        });
    }
    /**
     * Function to subscribe for update button to be clickable if valid inputs are given
     */
    subscribeValidateUpdate() {
        this.ufisFlightForm.get('updateForm').statusChanges.subscribe(data => {
            if (data === 'VALID') {
                this.updatebutton.disabled = false;
            } else {
                this.updatebutton.disabled = true;
            }
        });
    }
    /**
    * Function will open a window to enter the Flight as per COSYS, UFIS, date range
    * to create new COSYS UFIS flight mapping
    */
    clickAddRow(event) {
        this.ufisFlightList.push({
            cosysFlightNo: '',
            ufisFlightNo: '',
            flightFromDate: '',
            flightToDate: '',
            flagSaved: 'N',
            flagInsert: 'Y',
            flagUpdate: 'N',
            flagDelete: 'N'
        });
        this.insertionWindow.open();
    }
    /**
     * Function to search code share flights based on the search criteria
     */
    onSearch() {
        this.searchbutton.disabled = true;
        this.clearDatatable();
        const ufisFlightRequest: UfisFlightRequest = new UfisFlightRequest();
        ufisFlightRequest.flightNo = this.ufisFlightForm.get('flightNo').value;
        this.flightService.getUfisFlights(ufisFlightRequest).subscribe(data => {
            this.serviceResponse = data;
            this.refreshFormMessages(data);
            if (this.serviceResponse.data !== null) {
                this.ufisFlightList = this.serviceResponse.data;
                this.formatFlight();
                (<NgcFormArray>this.ufisFlightForm.controls['ufisList']).patchValue(this.ufisFlightList);
                this.isUfisFlightDatatableVisible = true;
            } else {
                this.showErrorStatus('flight.no.record');
            }

            this.searchbutton.disabled = false;
        },
            error => {
                // this.showErrorStatus('error:' + error);
                // this.showErrorStatus('Error:' );
                this.searchbutton.disabled = false;
            });
    }
    /**
     * Function which converts date format and adds edit to eachrow in ufisList
     */
    formatFlight() {
        for (let index = 0; index < this.ufisFlightList.length; index++) {
            this.ufisFlightList[index]['edit'] = 'Edit';
            this.ufisFlightList[index]['flightFromDate'] =
                NgcUtility.toDateFromLocalDate(this.ufisFlightList[index]['flightFromDate']);
            if (this.ufisFlightList[index]['flightToDate'] !== null) {
                this.ufisFlightList[index]['flightToDate'] =
                    NgcUtility.toDateFromLocalDate(this.ufisFlightList[index]['flightToDate']);
            }
        }
    }

    /**
     * Function to empty the ufisList form array and bring the results to the fresh state
     */
    clearDatatable() {
        this.ufisFlightDeleteRequest = [];
        this.ufisFlightUpdateRequest = new UfisFlight();
        this.ufisFlightList = [];
        this.insertionWindow.close();
        this.updateWindow.close();
        this.isUfisFlightDatatableVisible = false;
    }
    /**
     * On Confirmation
     * @param event Event
     */
    onConfirm(event) {
        const self = this;
        this.showConfirmMessage('Do you want to delete all the selected records?').then(fulfilled => {
            self.onUfisFlightDelete();
        });
    }
    /**
     * Function to be called after selection to delete has been made
     */
    onUfisFlightDelete() {
        const indices = [];
        for (let index = this.ufisFlightList.length - 1; index >= 0; index--) {
            const item = (<NgcFormArray>this.ufisFlightForm.get('ufisList'))['controls'][index]['value'];
            if (item['flagDelete'] === true) {
                const actualDelete = this.createDeletionList(item);
                this.ufisFlightDeleteRequest.push(actualDelete);
            }
        }
        for (let index = 0; index < indices.length; index++) {
            this.ufisFlightList.splice(indices[index], 1);
            (<NgcFormArray>this.ufisFlightForm.controls['ufisList']).removeAt(indices[index]);
        }
        const deleteRequest = new UfisFlightGroup();
        deleteRequest.ufisFlightList = this.ufisFlightDeleteRequest;
        if (deleteRequest.ufisFlightList.length > 0) {
            this.deletebutton.disabled = true;
            this.flightService.deleteUfisFlight(deleteRequest).subscribe(data => {
                this.serviceResponse = data;
                const deleteUfisFlight = this.serviceResponse.data;
                this.refreshFormMessages(data);
                if (deleteUfisFlight != null) {
                    this.ufisFlightDeleteRequest = [];
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
        const ufisFlightDeleteRequestLocal: UfisFlight = new UfisFlight();
        ufisFlightDeleteRequestLocal.ufisFlightNo = deleteData['ufisFlightNo'];
        ufisFlightDeleteRequestLocal.cosysFlightNo = deleteData['cosysFlightNo'];
        ufisFlightDeleteRequestLocal.flightFromDate = deleteData['flightFromDate'];
        ufisFlightDeleteRequestLocal.flightToDate = deleteData['flightToDate'];
        return ufisFlightDeleteRequestLocal;
    }
    /**
     * Function that gets update form for record and send it to backend
     */
    onUfisFlightUpdate() {
        const item = this.ufisFlightForm.get('updateForm').value;
        const fromDate = Date.parse(item['flightFromDate']);
        const toDate = Date.parse(item['flightToDate']);
        if (!this.checkFlight(item['ufisFlightNo'])) {
            this.refreshFormMessages(this.errorMessage('E', 'updateForm.ufisFlightNo', 'Invalid UFIS Flight'));
        } else if ((fromDate > toDate) && (item['flightToDate'] !== '')) {
            this.refreshFormMessages(this.errorMessage('E', 'updateForm.flightToDate', 'after Effective from'));
        } else {
            this.createMaintainUfisFlightList(item);
            if (this.ufisFlightUpdateRequest !== null) {
                const updateRequest = this.ufisFlightUpdateRequest;
                this.updatebutton.disabled = true;
                this.flightService.updateUfisFlight(updateRequest).subscribe(data => {
                    this.serviceResponse = data;
                    const updateUfisFlight = this.serviceResponse.data;
                    this.refreshFormMessages(data);
                    if (updateUfisFlight != null) {
                        this.showSuccessStatus('g.completed.successfully');
                        this.onSearch();
                    }
                },
                    error => {
                        this.showErrorStatus('Error:' + error);
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
    createMaintainUfisFlightList(updateData) {
        const ufisFlightUpdateRequestLocal: UfisFlight = new UfisFlight();
        ufisFlightUpdateRequestLocal.ufisFlightId = updateData['ufisFlightId'];
        ufisFlightUpdateRequestLocal.cosysFlightNo = updateData['cosysFlightNo'];
        ufisFlightUpdateRequestLocal.ufisFlightNo = updateData['ufisFlightNo'];
        ufisFlightUpdateRequestLocal.flightFromDate = updateData['flightFromDate'];
        ufisFlightUpdateRequestLocal.flightToDate = updateData['flightToDate'];
        ufisFlightUpdateRequestLocal.flagSaved = updateData['flagSaved'];
        ufisFlightUpdateRequestLocal.flagUpdate = updateData['flagUpdate'];
        ufisFlightUpdateRequestLocal.flagInsert = updateData['flagInsert'];
        this.ufisFlightUpdateRequest = ufisFlightUpdateRequestLocal;
    }
    /**
    * Function that iterates whole form for update and insert records and send it to backend
    */
    onUfisFlightCreate() {
        const item = this.ufisFlightForm.get('insertionForm').value;
        const fromDate = Date.parse(item['flightFromDate']);
        const toDate = Date.parse(item['flightToDate']);
        if (!this.checkFlight(item['ufisFlightNo'])) {
            this.refreshFormMessages(this.errorMessage('E', 'insertionForm.ufisFlightNo', 'Invalid UFIS Flight'));
        } else if ((fromDate > toDate) && (item['flightToDate'] !== '')) {
            this.refreshFormMessages(this.errorMessage('E', 'insertionForm.flightToDate', 'after Effective from'));
        } else {
            this.createMaintainUfisFlightList(item);
            if (this.ufisFlightUpdateRequest !== null) {
                const updateRequest = this.ufisFlightUpdateRequest;
                this.createbutton.disabled = true;
                this.flightService.createUfisFlight(updateRequest).subscribe(data => {
                    this.serviceResponse = data;
                    const addUfisFlight = this.serviceResponse.data;
                    this.refreshFormMessages(data);
                    if (addUfisFlight != null) {
                        this.showSuccessStatus('g.completed.successfully');
                        this.onSearch();
                        this.onToggleInsert();
                    }
                },
                    error => {
                        this.showErrorStatus('Error:' + error);
                        this.onToggleInsert();
                    }
                );
            }
        }

    }



    /**
     * This function validates if the flight number is in right format
     * @param input flight number given as input by user
     */
    public checkFlight(input) {
        const result = /^[A-Z0-9]{2,3}[0-9]{2,4}[A-Z0-9!@#\$%\^\&*\)\(+=._-]$/.test(input);
        return result;
    }
    /**
    * Function which is called when a link in datatable is called
    *
    * @param event
    */
    public onLinkClick(event) {
        if (event.type === 'link') {
            const editItemRowId = event.record.uid;
            this.ufisFlightList[editItemRowId].flagUpdate = 'Y';
            this.ufisFlightForm.get('updateForm').patchValue(this.ufisFlightList[editItemRowId]);
            this.ufisFlightForm.get('updateForm')
                .get('flightFromDate').patchValue(this.ufisFlightList[event.record.uid]['flightFromDate']);
            this.ufisFlightForm.get('updateForm')
                .get('flightToDate').patchValue(this.ufisFlightList[event.record.uid]['flightToDate']);
            this.updateWindow.open();
        }
    }
    /**
     * Function to close the updateWindow
     */
    public onToggleUpdate() {
        this.updateWindow.close();
    }
    /**
     * Function to close the insertWindow
     */
    public onToggleInsert() {
        // this.ufisFlightForm.get('insertionForm').patchValue({
        //     cosysFlightNo: '',
        //     ufisFlightNo: '',
        //     flightFromDate: '',
        //     flightToDate: '',
        //     flagSaved: 'N',
        //     flagInsert: 'Y',
        //     flagUpdate: 'N',
        //     flagDelete: 'N'
        // });
        // this.resetFormMessages();
        this.insertionWindow.close();
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

}
