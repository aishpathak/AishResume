// TODO Consolidate all the imports in various categories
// TODO Remove Unnecessary imports
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { FlightService } from '../flight.service';
import { FlightEnroutementRequestList } from '../../flight/flight.sharedmodel';
import {
    NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent,
    PageConfiguration,
    NgcDateTimeInputComponent,
    NgcDateInputComponent, NgcUtility
} from 'ngc-framework';
import {
    SpecialenroutementRequest, Specialenroutement, SpecialenroutementFlightGroup,
    SpecialenroutementRequestList,
    FlightEnroutementRequest
} from '../flight.sharedmodel';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationEntities } from '../../common/applicationentities';
@Component({
    selector: 'ngc-specialenroutement',
    templateUrl: './specialenroutement.component.html',
    styleUrls: ['./specialenroutement.component.scss']
})
/**
   * Special enroutement Component on searchs on the carrierCode.
   *
   * @param insertData
   * @param index
*/

@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    autoBackNavigation: true,
    restorePageOnBack: true
})

export class SpecialenroutementComponent extends NgcPage {
    @ViewChild('insertionWindow') insertionWindow: NgcWindowComponent;
    @ViewChild('updateWindow') updateWindow: NgcWindowComponent;
    @ViewChild('periodFromUpdateWindow') periodFromUpdateWindow: NgcDateInputComponent;
    @ViewChild('periodToUpdateWindow') periodToUpdateWindow: NgcDateInputComponent;
    @ViewChild('periodFromInsertWindow') periodFromInsertWindow: NgcDateInputComponent;
    @ViewChild('periodToInsertWindow') periodToInsertWindow: NgcDateInputComponent;

    specialEnroutementList: any[];
    resp: any;
    rowNum: any;
    rowId: any;
    dataDisplay: any;


    isCarrierDisabledInInsertWindow: boolean;
    isDestinationDisabledInInsertWindow: boolean;
    carrierCodeLastSearchedInSpecialScreen: string;
    destinationLastSearchedInInSpecialScreen: string;
    isFormDataClearedFlag: boolean;

    isspecialEnroutementDatatableVisible: boolean;
    specialenroutementFlightDeleteRequest: Specialenroutement[];
    specialenroutementFlightUpdateRequest: Specialenroutement[];
    specialenroutementFlightAddRequest: Specialenroutement[];
    minDate: any = new Date(Date.now());
    private specialEnroutementform: NgcFormGroup = new NgcFormGroup({
        carrierCode: new NgcFormControl(),
        finalDestination: new NgcFormControl(),
        resultList: new NgcFormArray(
            [
                new NgcFormGroup({
                    enroutementId: new NgcFormControl(),
                    carrierCode: new NgcFormControl(),
                    finalDestination: new NgcFormControl(),
                    via: new NgcFormControl(),
                    serviceType: new NgcFormControl(),
                    periodFrom: new NgcFormControl(),
                    periodTo: new NgcFormControl(),
                    transfer: new NgcFormControl()
                })
            ]
        ),
        updateForm: new NgcFormGroup({
            enroutementId: new NgcFormControl(),
            carrierCode: new NgcFormControl(),
            finalDestination: new NgcFormControl(), //'', [Validators.maxLength(3)]
            via: new NgcFormControl(),
            serviceType: new NgcFormControl(), //' ', [Validators.minLength(0), Validators.maxLength(1)]
            periodFrom: new NgcFormControl(),
            periodTo: new NgcFormControl(),
            transfer: new NgcFormControl(),
            flagSaved: new NgcFormControl(),
            flagUpdate: new NgcFormControl(),
            flagInsert: new NgcFormControl(),
            flagDelete: new NgcFormControl()
        }),
        insertionForm: new NgcFormGroup({
            carrierCode: new NgcFormControl(),
            finalDestination: new NgcFormControl(),  //'', [Validators.minLength(1), Validators.maxLength(3)]
            via: new NgcFormControl(),
            serviceType: new NgcFormControl(),   //' ', [Validators.minLength(0), Validators.maxLength(1)]
            periodFrom: new NgcFormControl(),
            periodTo: new NgcFormControl(),
            transfer: new NgcFormControl(),
            flagSaved: new NgcFormControl(),
            flagUpdate: new NgcFormControl(),
            flagInsert: new NgcFormControl(),
            flagDelete: new NgcFormControl()
        })

    });


    /**
        * Function will open a new window with empty record to enter the details
        */
    onAddRow(event) {
        //this.dataDisplay = true;
        this.specialEnroutementform.get('insertionForm').reset();

        //  this.specialEnroutementList.push({
        //     carrierCode: '',
        //     finalDestination: '',
        //     via: '',
        //     serviceType: '',
        //     periodFrom: '',
        //     periodTo: '',
        //     transfer: '',
        //     flagSaved: 'N',
        //     flagInsert: 'Y',
        //     flagUpdate: 'N',
        //     flagDelete: 'N'
        // });
        // this.rowId = this.specialEnroutementList.length - 1;
        if (!this.isFormDataClearedFlag) {

            this.specialEnroutementform.get('insertionForm').get('carrierCode').setValue(this.carrierCodeLastSearchedInSpecialScreen);
            this.specialEnroutementform.get('insertionForm').get('finalDestination').setValue(this.destinationLastSearchedInInSpecialScreen);

            if (this.specialEnroutementform.get('insertionForm').get('carrierCode').value) {
                this.isCarrierDisabledInInsertWindow = true;
            }
            else {
                this.isCarrierDisabledInInsertWindow = false;
            }

            if (this.specialEnroutementform.get('insertionForm').get('finalDestination').value) {
                this.isDestinationDisabledInInsertWindow = true;
            }
            else {
                this.isDestinationDisabledInInsertWindow = false;
            }

            this.insertionWindow.open();

            this.periodFromInsertWindow.min = NgcUtility.getDateOnly(new Date());
            this.periodToInsertWindow.min = this.periodFromInsertWindow.min;
        } else {
            this.insertionWindow.open();
            this.isCarrierDisabledInInsertWindow = false;
            this.isDestinationDisabledInInsertWindow = false;
            this.periodFromInsertWindow.min = NgcUtility.getDateOnly(new Date());
            this.periodToInsertWindow.min = this.periodFromInsertWindow.min;
        }
    }

    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
        private flightService: FlightService, private activatedRoute: ActivatedRoute, private router: Router) {
        super(appZone, appElement, appContainerElement);
        /*local variable for fetched records */
        this.specialEnroutementList = [];
    }

    ngOnInit() {
        super.ngOnInit();

        this.flightService.previousURL = this.flightService.currentURL;
        if (!this.flightService.currentURL) {
            this.flightService.previousURL = this.router.url;
        }
    }

    carrierCodeLastSearchedForInNormalScreen: string;
    destinationLastSearchedForInNormalScreen: string;
    normalScreenSearchResponse: any;
    carrierLastSearchedForInSpecialScreen: string

    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.onSearch();

        // this.periodTo.min =   NgcUtility.getDateOnly(event.record.periodFrom);

        //  let transferData = this.getNavigateData(this.activatedRoute);
        //  if(transferData===null){
        //   return;
        // }

        //  //Case 1 : When No normalScreenSearchResponse : From Both Button and cancel
        //  if(this.flightService.specialScreenSearchResponse===undefined){
        //       this.specialEnroutementform.get('carrierCode').setValue(this.flightService.carrierLastEnteredForInSpecialScreen);
        //       this.isspecialEnroutementDatatableVisible = false;
        //   }
        //   else if (!(this.flightService.carrierLastEnteredForInSpecialScreen=== '' || this.flightService.carrierLastEnteredForInSpecialScreen===undefined)) {
        //     this.specialEnroutementform.get('carrierCode').setValue(this.flightService.carrierLastEnteredForInSpecialScreen);
        //     (<NgcFormArray>this.specialEnroutementform.controls['resultList']).patchValue(this.flightService.specialScreenSearchResponse);
        //     this.isspecialEnroutementDatatableVisible = true;
        //    }
        //    else{

        //     this.specialEnroutementform.get('carrierCode').setValue(this.flightService.carrierCodeLastEnteredForInNormalScreen);
        //  //   this.flightService.carrierLastEnteredForInSpecialScreen  = transferData.carrierLastEnteredForInSpecialScreen;
        //   this.specialEnroutementform.get('carrierCode').setValue(this.flightService.carrierLastEnteredForInSpecialScreen);
        //     (<NgcFormArray>this.specialEnroutementform.controls['resultList']).patchValue(this.flightService.specialScreenSearchResponse);
        //     this.isspecialEnroutementDatatableVisible = true;

        //    }
    }

    updateDataTable() {
        (<NgcFormArray>this.specialEnroutementform.controls['resultList']).patchValue(this.specialEnroutementList);
    }
    /**
        * Function which is called when a link in datatable is called
        * @param event
        */
    public onLinkClick(event) {
        if (event.type === 'link') {
            const columnName = event.column;
            const record = event.record;
            this.rowId = event.record.uid;
            this.specialEnroutementList[this.rowId].flagUpdate = 'Y';
            this.periodFromUpdateWindow.min = NgcUtility.getDateOnly(event.record.periodFrom);
            this.periodToUpdateWindow.min = NgcUtility.getDateOnly(event.record.periodFrom);
            setTimeout(() => {
                this.patchUpdateForm(this.specialEnroutementList[event.record.uid]);
            }, 0);
            this.updateWindow.open();
        }
    }

    public navigateToNormalEnroutment() {
        if (this.flightService.specialScreenSearchResponse === undefined) {
            this.flightService.carrierLastEnteredForInSpecialScreen = this.specialEnroutementform.get('carrierCode').value
            this.navigateTo(this.router, '/flight/displayoutgoingenroutement', this.flightService);
        } else {
            this.flightService.carrierLastEnteredForInSpecialScreen = this.specialEnroutementform.get('carrierCode').value
            this.navigateTo(this.router, '/flight/displayoutgoingenroutement', this.flightService);
        }
    }


    clearFormData() {
        this.specialEnroutementform.get('carrierCode').reset();
        this.specialEnroutementform.get('finalDestination').reset();
        this.specialEnroutementform.get('insertionForm').get('carrierCode').reset();
        this.specialEnroutementform.get('insertionForm').get('finalDestination').reset()
        this.flightService.specialScreenSearchResponse = undefined
        this.isspecialEnroutementDatatableVisible = false;
        this.isFormDataClearedFlag = true;
    }


    setCarrierCodeValueOnCancelPress() {
        this.flightService.carrierLastEnteredForInSpecialScreen = this.specialEnroutementform.get('carrierCode').value;
    }


    /**
    * Function to patch the value of the row that has been selected by user to edit
    * @param updateData
    */
    public patchUpdateForm(updateData) {
        this.specialEnroutementform.get('updateForm').get('enroutementId').patchValue(updateData['enroutementId']);
        this.specialEnroutementform.get('updateForm').get('carrierCode').patchValue(updateData['carrierCode']);
        this.specialEnroutementform.get('updateForm').get('finalDestination').patchValue(updateData['finalDestination']);
        this.specialEnroutementform.get('updateForm').get('via').patchValue(updateData['via']);
        this.specialEnroutementform.get('updateForm').get('serviceType').patchValue(updateData['serviceType']);
        this.specialEnroutementform.get('updateForm').get('periodFrom').patchValue(updateData['periodFrom']);
        this.specialEnroutementform.get('updateForm').get('periodTo').patchValue(updateData['periodTo']);
        this.specialEnroutementform.get('updateForm').get('transfer').patchValue(updateData['transfer']);
        this.specialEnroutementform.get('updateForm').get('flagSaved').patchValue(updateData['flagSaved']);
        this.specialEnroutementform.get('updateForm').get('flagUpdate').patchValue(updateData['flagUpdate']);
        this.specialEnroutementform.get('updateForm').get('flagInsert').patchValue(updateData['flagInsert']);
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
        this.specialEnroutementform.get('insertionForm').patchValue({
            carrierCode: '',
            finalDestination: '',
            via: '',
            serviceType: '',
            periodFrom: '',
            periodTo: '',
            transfer: '',
            flagSaved: 'N',
            flagInsert: 'Y',
            flagUpdate: 'N',
            flagDelete: 'N'
        });
        this.resetFormMessages();
        this.insertionWindow.close();
    }


    /**
     * Function that is called when Carrier Code lov in search form is used
     *
     * @param object
     */
    public onSelectCarrierCode(object) {

        // this.specialEnroutementform.get('carrierCode').setValue(object.code);
    }

    /**
     *Function that is called when Carrier Code lov in Inserform form is used
     *
     * @param object
     */
    public onSelectInsertFormCarrierCode(object) {
        //  alert(object)
        // this.specialEnroutementform.get('insertionForm').get('carrierCode').setValue(object.code);
    }

    /**
    * Function that is called when Carrier Code lov in updateForm form is used
    *
    * @param object
    */
    public onSelectUpdateFormCarrierCode(object) {
        this.specialEnroutementform.get('updateForm').get('carrierCode').setValue(object.code);
    }


    /**
      * Function that is called when finalDestination Code lov in Inserform form is used
      *
      * @param object
      */
    public onSelectInsertFormFinalDestination(object) {
        this.specialEnroutementform.get('insertionForm').get('finalDestination').setValue(object.code);
    }

    /**
      * Function that is called when finalDestination Code lov in UpdateForm form is used
      *
      * @param object
      */
    public onSelectUpdateFormFinalDestination(object) {
        this.specialEnroutementform.get('updateForm').get('finalDestination').setValue(object.code);
    }

    /**
      * Function that is called when via Code lov in InsertForm form is used
      *
      * @param object
      */

    public onSelectInsertFormVia(object) {
        this.specialEnroutementform.get('insertionForm').get('via').setValue(object.code);
    }

    /**
      * Function that is called when via Code lov in UpdateForm form is used
      *
      * @param object
      */
    public onSelectUpdateFormVia(object) {
        this.specialEnroutementform.get('updateForm').get('via').setValue(object.code);
    }

    /**
     * Function that is called when transfer Code lov in Inserform form is used
     *
     * @param object
     */

    public onSelectInsertFormTransferTo(object) {
        this.specialEnroutementform.get('insertionForm').get('transfer').setValue(object.code);
    }

    /**
    * Function that is called when transfer Code lov in Inserform form is used
    *
    * @param object
    */

    public onSelectUpdateFormTransferTo(object) {
        this.specialEnroutementform.get('updateForm').get('transfer').setValue(object.code);
    }

    /**
     * Function that is called when ServiceType Code lov in Inserform form is used
     *
     * @param object
     */
    public onSelectInsertFormService(object) {
        this.specialEnroutementform.get('insertionForm').get('serviceType').setValue(object.param1);
    }

    /**
      * Function that is called when transfer Code lov in UpdateForm form is used
      *
      * @param object
      */
    public onSelectUpdateFormService(object) {
        this.specialEnroutementform.get('updateForm').get('serviceType').setValue(object.param1);
    }


    /**
      * Function to be called after selection to delete has been made
      */
    onDelete() {
        let deleteData = this.specialEnroutementform.getRawValue().resultList;
        let enrSelectedRecordsTobeDeleted = new Array();
        deleteData.forEach(element => {
            if (element.flagDelete === true) {
                enrSelectedRecordsTobeDeleted.push(element)
            }
        })

        this.flightService.deleteSplEnroutement(enrSelectedRecordsTobeDeleted).subscribe(data => {
            if (data.success) {
                this.onSearch();
                this.showSuccessStatus('g.completed.successfully');
            }
        });

    }


    /**
        * Function to search code share flights based on the search criteria
        */

    onSearch() {
        //Clear the data table
        this.clearDatatable();

        if (NgcUtility.isBlank(this.specialEnroutementform.get('carrierCode').value) && NgcUtility.isEntityAttributeRequired(ApplicationEntities.Flight_SpecialEnroutement_Carrier)) {
            this.showErrorStatus("g.enter.mandatory.feilds");
            return;
        }

        const specialenroutementFlightRequest: SpecialenroutementRequest = new SpecialenroutementRequest();
        if (this.specialEnroutementform.get('carrierCode').value === null || this.specialEnroutementform.get('carrierCode').value === '') {
            if (this.getUserProfile().userRestrictedAirlines !== null) {
                specialenroutementFlightRequest.restrictedcarrier = this.getUserProfile().userRestrictedAirlines;
            }
        }
        specialenroutementFlightRequest.carrierCode = this.specialEnroutementform.get('carrierCode').value;
        specialenroutementFlightRequest.finalDestination = this.specialEnroutementform.get('finalDestination').value;
        this.flightService.getSplEnroutementFlights(specialenroutementFlightRequest).subscribe(data => {
            if (!this.showResponseErrorMessages(data)) {
                this.resp = data;
                this.refreshFormMessages(data);

                if (this.resp.data === null) {
                    this.isspecialEnroutementDatatableVisible = false;
                    this.showErrorStatus('flight.no.record');
                    return;
                }

                if (this.resp.data.length !== 0) {
                    this.specialEnroutementList = this.resp.data;

                    console.log("Response After Search->" + JSON.stringify(this.specialEnroutementList));
                    this.specialEnroutementList.forEach(enr => {
                        enr.periodFrom = new Date(enr.periodFrom);
                        if (enr.periodTo === null) {
                            enr.periodTo = enr.periodTo;
                        }  //string type
                        else {
                            enr.periodTo = new Date(enr.periodTo);  //date type
                        }
                        enr.flagUpdate = 'Edit';
                    });
                    this.bindCodeShareFlightData();
                    this.carrierCodeLastSearchedInSpecialScreen = specialenroutementFlightRequest.carrierCode
                    this.destinationLastSearchedInInSpecialScreen = specialenroutementFlightRequest.finalDestination
                    this.flightService.specialScreenSearchResponse = this.resp.data;
                    this.isspecialEnroutementDatatableVisible = true;
                    this.carrierLastSearchedForInSpecialScreen = this.specialEnroutementform.get('carrierCode').value;
                } else {
                    this.isspecialEnroutementDatatableVisible = false;
                    this.showErrorStatus('flight.no.record');
                }
            }
        },
            error => {
                this.isspecialEnroutementDatatableVisible = false;
                this.showErrorStatus(error);
            });
    }

    /**
     * Function to empty the resultList form array and bring the results to the fresh state
     */
    clearDatatable() {
        this.specialenroutementFlightDeleteRequest = [];
        this.specialenroutementFlightAddRequest = [];
        this.specialenroutementFlightUpdateRequest = [];
        this.specialEnroutementList = [];
        for (let index = 0; index < (<NgcFormArray>this.specialEnroutementform.controls['resultList']).length; index++) {
            (<NgcFormArray>this.specialEnroutementform.controls['resultList']).removeAt(index);
        }
        this.insertionWindow.hide();
        this.updateWindow.hide();
        this.isspecialEnroutementDatatableVisible = false;
    }

    /**
      * Function to get mon format of the month
      *
      * @param number month number for whose the name is needed
      */
    getMonthName(number) {
        const monthNames = new Array('Jan', 'Feb', 'Mar',
            'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec');
        return monthNames[number];
    }

    /**
       * Function to convert date from datetimeinput to ddmonyyy format
       *
       * @param inputDate date string that has to converted
       */
    datepipe(inputDate) {
        if ((inputDate === '') || (inputDate === null)) {
            return inputDate;
        } else {
            const parseDate = new Date(inputDate);
            return (parseDate.getDate() + this.getMonthName(parseDate.getMonth()) + parseDate.getFullYear());
        }
    }

    /**
       * Function to create a object to add to the list that has to be sent to backend for deleting
       *
       * @param deleteData data record that has to be deleted
       */
    createDeletionList(deleteData) {
        const specialenroutementDeleteRequestLocal: Specialenroutement = new Specialenroutement();
        specialenroutementDeleteRequestLocal.enroutementId = deleteData['enroutementId'];
        specialenroutementDeleteRequestLocal.carrierCode = deleteData['carrierCode'];
        specialenroutementDeleteRequestLocal.finalDestination = deleteData['finalDestination'];
        specialenroutementDeleteRequestLocal.via = deleteData['via'];
        specialenroutementDeleteRequestLocal.serviceType = deleteData['serviceType'];
        specialenroutementDeleteRequestLocal.periodFrom = this.datepipe(deleteData['periodFrom']);
        specialenroutementDeleteRequestLocal.periodTo = this.datepipe(deleteData['periodTo']);
        specialenroutementDeleteRequestLocal.transfer = deleteData['transfer'];
        return specialenroutementDeleteRequestLocal;
    }


    /**
     * Function to bind the data fetched from backend to the array resultList
     * to show in which date range code sharing of flights is present.
     */
    bindCodeShareFlightData() {
        (<NgcFormArray>this.specialEnroutementform.controls['resultList']).patchValue(this.resp.data);
    }

    /**
      * Function to create a object to add to the list that has to be sent to backend for insertion
      *
      * @param insertData
      * @param index
      */
    saveSpecialEnroutement(formName) {
        this.specialEnroutementform.validate();
        if (this.specialEnroutementform.get('insertionForm').invalid) {
            return;
        }

        if (this.isDuplicateRecordsEntryWhileAdd()) {
            this.showErrorStatus('flight.duplicate.record.special.route.exist');
            return;
        }

        const specialenroutementRequest = new SpecialenroutementRequest();
        specialenroutementRequest.carrierCode = this.specialEnroutementform.get('insertionForm').get('carrierCode').value;
        specialenroutementRequest.finalDestination = this.specialEnroutementform.get('insertionForm').get('finalDestination').value;
        specialenroutementRequest.via = this.specialEnroutementform.get('insertionForm').get('via').value;
        specialenroutementRequest.serviceType = this.specialEnroutementform.get('insertionForm').get('serviceType').value;
        specialenroutementRequest.periodFrom = this.specialEnroutementform.get('insertionForm').get('periodFrom').value;
        specialenroutementRequest.periodTo = this.specialEnroutementform.get('insertionForm').get('periodTo').value;
        specialenroutementRequest.transfer = this.specialEnroutementform.get('insertionForm').get('transfer').value;

        this.flightService.saveSplEnroutementFlight(specialenroutementRequest).subscribe(data => {
            this.resp = data;
            const specialenroutement = this.resp.data;
            console.log("Response After Save Special ENR->" + JSON.stringify(specialenroutement))
            this.refreshFormMessages(data);
            if (specialenroutement != null) {
                this.showSuccessStatus('g.completed.successfully');
                this.insertionWindow.close();
                this.onSearch();
                if ((this.specialEnroutementform.get('carrierCode').value)
                    && (this.specialEnroutementform.get('carrierCode').value)) {
                    this.onSearch();
                    this.onToggleInsert();
                }
            }
        },
            error => {
                this.showErrorStatus('Error:' + error);
            }
        );
    }


    isDuplicateRecordsEntryWhileAdd() {
        let isDuplicateRecordsEntry;
        for (let i = 0; i < this.specialEnroutementList.length; i++) {
            if ((this.specialEnroutementList[i].carrierCode === this.specialEnroutementform.get('insertionForm').get('carrierCode').value) &&
                (this.specialEnroutementList[i].finalDestination === this.specialEnroutementform.get('insertionForm').get('finalDestination').value) &&
                (this.specialEnroutementList[i].via === this.specialEnroutementform.get('insertionForm').get('via').value) &&
                (this.specialEnroutementList[i].serviceType === this.specialEnroutementform.get('insertionForm').get('serviceType').value) &&
                ((this.specialEnroutementList[i].periodFrom.toString().substr(0, 15).trim() === this.specialEnroutementform.get('insertionForm').get('periodFrom').value.toString().substr(0, 15).trim()) || (this.specialEnroutementform.get('insertionForm').get('periodFrom').value > new Date(this.specialEnroutementList[i].periodFrom)))
            ) {
                isDuplicateRecordsEntry = true;
                break;
            }
        }

        if (isDuplicateRecordsEntry) {
            return true;
        } else { return false; }
    }

    /**
 * Function to create a object to add to the list that has to be sent to backend for insertion
 *
 * @param insertData
 * @param index`
 */
    updateSpecialEnroutement(event) {

        this.specialEnroutementform.validate();
        if (this.specialEnroutementform.get('updateForm').invalid) {
            return;
        }

        if (this.isDuplicateRecordsEntryWhileUpdate(this.specialEnroutementform.get('updateForm').get('enroutementId').value)) {
            this.showErrorStatus('flight.not.update.special.enroutement.route.exist');
            return;
        }

        const specialenroutementRequest = new Specialenroutement();
        specialenroutementRequest.enroutementId = this.specialEnroutementform.get('updateForm').get('enroutementId').value;
        specialenroutementRequest.carrierCode = this.specialEnroutementform.get('updateForm').get('carrierCode').value;
        specialenroutementRequest.finalDestination = this.specialEnroutementform.get('updateForm').get('finalDestination').value;
        specialenroutementRequest.via = this.specialEnroutementform.get('updateForm').get('via').value;
        specialenroutementRequest.serviceType = this.specialEnroutementform.get('updateForm').get('serviceType').value;
        specialenroutementRequest.periodFrom = this.specialEnroutementform.get('updateForm').get('periodFrom').value;
        specialenroutementRequest.periodTo = this.specialEnroutementform.get('updateForm').get('periodTo').value;
        specialenroutementRequest.transfer = this.specialEnroutementform.get('updateForm').get('transfer').value;

        console.log("Request sent while update->" + JSON.stringify(specialenroutementRequest));
        this.flightService.updateSplEnroutementFlight(specialenroutementRequest).subscribe(data => {
            this.resp = data;
            const specialenroutement = this.resp.data;
            console.log("Response from server After Update->" + specialenroutement);
            this.refreshFormMessages(data);
            if (specialenroutement != null) {
                this.showSuccessStatus('g.completed.successfully');
                this.updateWindow.close();
                this.onSearch();

                if ((this.specialEnroutementform.get('carrierCode').value) &&
                    (this.specialEnroutementform.get('carrierCode').value)) {
                    this.onSearch();
                }
            }
        },
            error => {
                this.showErrorStatus('Error:' + error);
            }
        );


    }

    isDuplicateRecordsEntryWhileUpdate(enrID) {
        let filteredArray: any[];
        let isDuplicateRecordsEntry;

        filteredArray = this.specialEnroutementList.filter((item) => {
            return item.enroutementId != enrID
        })

        for (let i = 0; i < filteredArray.length; i++) {
            if ((filteredArray[i].carrierCode === this.specialEnroutementform.get('updateForm').get('carrierCode').value) &&
                (filteredArray[i].finalDestination === this.specialEnroutementform.get('updateForm').get('finalDestination').value) &&
                (filteredArray[i].via === this.specialEnroutementform.get('updateForm').get('via').value) &&
                (filteredArray[i].serviceType === this.specialEnroutementform.get('updateForm').get('serviceType').value) &&
                ((filteredArray[i].periodFrom.toString().substr(0, 15).trim() === this.specialEnroutementform.get('insertionForm').get('periodFrom').value.toString().substr(0, 15).trim()) || (this.specialEnroutementform.get('updateForm').get('periodFrom').value > new Date(filteredArray[i].periodFrom)))
            ) {
                isDuplicateRecordsEntry = true;
                break;
            }
        }

        if (isDuplicateRecordsEntry) {
            return true;
        } else { return false; }

    }
}
