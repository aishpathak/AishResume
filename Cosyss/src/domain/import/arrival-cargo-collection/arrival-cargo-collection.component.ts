import { forEach } from '@angular/router/src/utils/collection';
import { element } from 'protractor';
import {
    Component,
    OnInit,
    NgZone,
    ElementRef,
    ViewContainerRef,
    ViewChild,
    ChangeDetectorRef
} from "@angular/core";
import {
    NgcFormGroup,
    NgcFormControl,
    PageConfiguration,
    NgcPage,
    NgcFormArray,
    NgcWindowComponent,
    NgcReportComponent,
    NgcUtility
} from "ngc-framework";
import { Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ImportService } from "../import.service";

@Component({
    selector: 'app-',
    templateUrl: './arrival-cargo-collection.component.html',
    styleUrls: ['./arrival-cargo-collection.component.scss']
})
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    restorePageOnBack: true,
    autoBackNavigation: true
})
export class ArrivalCargoCollectionComponent extends NgcPage implements OnInit {
    private arrivalCargoCollectionForm: NgcFormGroup = new NgcFormGroup({
        truckAirsideHand: new NgcFormControl(),
        issueSrfNo: new NgcFormControl(),
        truckDockNo: new NgcFormControl(),
        vehicleNo: new NgcFormControl(),
        purpose: new NgcFormControl(),
        arrivalCargoCollectionList: new NgcFormArray([//new NgcFormGroup({

            //     locationInfo: new NgcFormArray([
            //         new NgcFormGroup({
            //             storageLocation: new NgcFormControl(),
            //             retrieve: new NgcFormControl(),
            //             retParty: new NgcFormControl(),
            //             onlineKliftDriver: new NgcFormControl(),
            //         })

            //     ])
            // })
        ]),

    })
    truckAirsideHandDropDown: string[] = ["Truck", "Airside Release", "Hand Carry"];
    purposeDropdown: string[] = ["Import Bulk"];
    retrieveYesNo: string[] = ["Yes", "No"];
    showTable: boolean = false;
    truckDisableCheck: boolean = false;
    originalSearchList: any = [];
    dropdownNullCheck: boolean = false;

    constructor(
        appZone: NgZone,
        appElement: ElementRef,
        appContainerElement: ViewContainerRef,
        public importService: ImportService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
    }

    onSearch() {
        this.showTable = false;
        this.originalSearchList = [];
        const requestData = {
            issueSrfNo: this.arrivalCargoCollectionForm.get('issueSrfNo').value,
        }
        console.log(requestData.issueSrfNo);
        let a = requestData.issueSrfNo;
        if (a == null || (a != null && a.length == 0) || this.arrivalCargoCollectionForm.get('truckAirsideHand').value == null) {
            this.showErrorStatus("g.enter.mandatory.m");
            return;
        }
        this.arrivalCargoCollectionForm.get('purpose').patchValue("Import Bulk");
        this.importService.fetchArrivalCargoCollectionList(requestData).subscribe(data => {
            this.originalSearchList = data.data;
            console.log(data.data);
            let response = data.data;
            if (!this.showResponseErrorMessages(data)) {
                if (response) {

                    // this.async(() => {
                    //     this.disableShipment();
                    // });
                    let defaultDropdownRetParty: any;
                    // this.async(() => {
                    this.retrieveDropDownListRecords("BDSUMMARY_SERVICEPROVIDER", "query").subscribe(data => {
                        if (data.length > 0) {
                            data.forEach(element => {
                                if (element.desc.indexOf("SILVER EXPRESS") != -1) {
                                    defaultDropdownRetParty = element.desc;
                                }

                            });
                        }
                        let truckDockNo = this.arrivalCargoCollectionForm.get('truckDockNo').value;
                        response.forEach(element => {
                            element.locationInfo.forEach(location => {
                                if (location.retParty == null || location.retParty == '') {
                                    location.retParty = defaultDropdownRetParty;
                                }
                                if (location.retrivalLocation == null && truckDockNo != null) {
                                    location.retrivalLocation = truckDockNo;
                                }
                            });

                        });
                        this.arrivalCargoCollectionForm.get('arrivalCargoCollectionList').patchValue(response);
                        this.showTable = true;

                    }, err => console.error(err));


                    // });
                }

            }

        }, error => {
            this.showErrorStatus(error);
            this.showTable = false;
        }
        )

    }
    onSave(event) {
        let formData = (<NgcFormArray>this.arrivalCargoCollectionForm.get(['arrivalCargoCollectionList'])).getRawValue();
        let saveData = [];
        formData.forEach(element => {
            if (element.select) {
                saveData.push(element);
            }
        })
        console.log(saveData);
        //return;
        if (saveData.length <= 0) {
            this.showErrorMessage("selectAtleastOneRecord");
            return;
        }
        console.log(saveData.values);
        let count = 0;
        let vehicleNo = this.arrivalCargoCollectionForm.get('vehicleNo').value
        if (this.truckDisableCheck == true && (vehicleNo == null || vehicleNo == '')) {
            this.showErrorMessage("CUST003");
            return;
        }
        if (saveData.length > 0) {

            saveData.forEach(element => {
                if (this.truckDisableCheck == true) {
                    element.vehicleNo = vehicleNo;
                    element.purpose = this.arrivalCargoCollectionForm.get('purpose').value;
                }
                element.locationInfo.forEach(location => {
                    if (location.retrieve == null || location.retParty == null || location.retrivalLocation == null || location.priority == null) {
                        count++;
                    }
                })
                // if (element.retrivalLocation == null || element.priority == null) {
                //     count++;
                // }
            })
        }
        if (count > 0) {
            this.showErrorMessage("CUST003");
            return;
        }

        this.importService.saveArrivalCargoCollectionList(saveData).subscribe(response => {
            if (!this.showResponseErrorMessages(response)) {
                this.showSuccessStatus('g.completed.successfully');
                this.arrivalCargoCollectionForm.get('vehicleNo').patchValue(null);
                this.arrivalCargoCollectionForm.get('truckDockNo').patchValue(null);

                this.showTable = false;
            }

        }, error => {
            this.showErrorStatus(error);
            this.showTable = false;
        }
        )
        console.log(saveData);


    }
    onTruckAirsideHandSelect(event) {
        if (event.code != null || event.code != '') {
            this.dropdownNullCheck = true;
        }
        else {
            this.dropdownNullCheck = true;
        }
        if (event.code == "Truck") {
            this.truckDisableCheck = true;
        }
        else {
            this.truckDisableCheck = false;
        }
    }
    onChangeTruckDock(event) {
        let formData = (<NgcFormArray>this.arrivalCargoCollectionForm.get(['arrivalCargoCollectionList'])).getRawValue();
        console.log(this.originalSearchList)
        //console.log(this.arrivalCargoCollectionForm.get(['arrivalCargoCollectionList', 0, 'locationInfo', 1, 'retrivalLocation']).value);
        if (formData.length > 0) {
            this.originalSearchList.forEach((element, index) => {
                if (element.retrivalLocation == null) {
                    element.locationInfo.forEach((location, index1) => {
                        //if (location.retrivalLocation == null) {
                        this.arrivalCargoCollectionForm.get(['arrivalCargoCollectionList', index, 'locationInfo', index1, 'retrivalLocation']).patchValue(event);
                        //}
                    });
                }


            });

        }
    }

}