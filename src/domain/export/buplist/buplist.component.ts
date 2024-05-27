import { Component, ChangeDetectorRef } from '@angular/core';
import { ComponentFactoryResolver, ElementRef, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, PageConfiguration, UserProfile, NgcReportComponent } from 'ngc-framework';
import { BuplistService } from './buplist.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'app-buplist',
    templateUrl: './buplist.component.html',
    styleUrls: ['./buplist.component.scss']
})

@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    autoBackNavigation: true
})
export class BuplistComponent extends NgcPage {
    @ViewChild("reportWindow") reportWindow: NgcReportComponent;
    navigateData: any;
    awb_search: boolean = false;
    uld_search: boolean = false;
    searchResult: boolean = false;
    reportParameters: any;
    buptableAWBArr: any[];
    buptableULDArr: any[];
    bupform: NgcFormGroup = new NgcFormGroup({
        searchBy: new NgcFormControl(),
        uldNumber: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        sel: new NgcFormControl(),
        rclNoDate: new NgcFormControl(),
        grossWeight: new NgcFormControl(),
        netWeight: new NgcFormControl(),
        totalPieces: new NgcFormControl(),
        agentCode: new NgcFormControl(),
        agentName: new NgcFormControl(),
        wareHouseLocation: new NgcFormControl(),
        orgDest: new NgcFormControl(),
        awbPcsWt: new NgcFormControl(),
        totalULDWt: new NgcFormControl(),
        buptableULDArry: new NgcFormArray([
            new NgcFormGroup({
                documentInformationId: new NgcFormControl(),
                uldNumber: new NgcFormControl(),
                assignedPieces: new NgcFormControl(),
                assignedWeight: new NgcFormControl(),
                whsDestination: new NgcFormControl(),
            })
        ]),
        buptableAWBArry: new NgcFormArray([
            new NgcFormGroup({
                sel: new NgcFormControl(),
                shipmentNumber: new NgcFormControl(),
                DocumentInformationId: new NgcFormControl(),
                origin: new NgcFormControl(),
                destination: new NgcFormControl(),
                shipmentPieces: new NgcFormControl(),
                shipmentWeight: new NgcFormControl(),
                natureOfGoodsDescription: new NgcFormControl(),
                specialHandlingCode: new NgcFormArray([]),
                lithiumBatteriesDetails: new NgcFormArray([
                    new NgcFormGroup({
                        reference: new NgcFormControl()
                    })
                ]),
                fwb: new NgcFormControl(),
                fhl: new NgcFormControl(),
                eawb: new NgcFormControl(),
                type: new NgcFormControl(),
                shipmentId: new NgcFormControl(),
            })
        ])
    });
    constructor(appZone: NgZone
        , appElement: ElementRef
        , appContainerElement: ViewContainerRef,
        private buplistService: BuplistService,
        private router: Router,
        private cd: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        appComponentResolver: ComponentFactoryResolver) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        this.navigateData = this.getNavigateData(this.activatedRoute);
        (<NgcFormArray>this.bupform.get('buptableAWBArry')).controls.forEach(element => {
            for (let i = 0; i < 6; i++) {
                (<NgcFormArray>element.get('lithiumBatteriesDetails')).addValue([this.patchList]);
            }
        });
    }

    onCancel() {
        this.navigateBack(this.navigateData);
    }

    private patchList = {
        reference: null
    }
    private buptableAWBArry = {
        sel: '',
        shipmentNumber: '',
        origin: '',
        destination: '',
        shipmentPieces: '',
        shipmentWeight: '',
        natureOfGoodsDescription: '',
        specialHandlingCode: [],
        lithiumBatteriesDetails: [],
        fwb: '',
        fhl: '',
        eawb: '',
        delete: '',
        expAwbDocd: '',
        type: ''
    }

    addShipment() {
        let inventorys: NgcFormArray = (this.bupform.get('buptableAWBArry') as NgcFormArray);
        const formValue = this.bupform.getRawValue();
        const buptableAWBArryList = formValue.buptableAWBArry;
        buptableAWBArryList.forEach((element, index) => {
            if (!element.documentInformationId) {
                this.bupform.get(["buptableAWBArry", index, "shipmentNumber"]).disable({ onlySelf: false });
            }
        });
        this.createRow();
        this.buptableAWBArr.push(1);
    }

    createRow() {
        this.buptableAWBArry.lithiumBatteriesDetails = [];
        let userInfo: UserProfile = this.getUserProfile();
        for (let i = 0; i < 6; i++) {
            this.buptableAWBArry.lithiumBatteriesDetails.push(this.patchList);
        }
        (<NgcFormArray>this.bupform.get('buptableAWBArry')).addValue([this.buptableAWBArry]);
    }

    delete(event, index, segmentrow) {
        let obj = (this.bupform.get(['buptableAWBArry']) as NgcFormArray).getRawValue();
        if (obj[index].flagCRUD === 'C') {
            obj.splice(index, 1);
            this.bupform.get('buptableAWBArry').patchValue(obj);
        }
    }

    onDeleteBuptableAwb() {
        const request = this.bupform.getRawValue();
        let lengthofTable = (this.bupform.get(['buptableAWBArry']) as NgcFormArray).getRawValue().length;
        let buptableDeleteAWBArryList = (this.bupform.get(['buptableAWBArry']) as NgcFormArray).getRawValue()
            .filter(obj => (obj.sel === true && obj.type == 'RCL'));
        console.log(buptableDeleteAWBArryList);
        let lengthofDeleteRecords = buptableDeleteAWBArryList.length;
        if (lengthofTable - lengthofDeleteRecords <= 0) {
            this.showErrorStatus('exp.accpt.mixPrepack'); return;
        }
        (<NgcFormArray>this.bupform.controls['buptableAWBArry']).deleteValue(buptableDeleteAWBArryList);
        this.cd.detectChanges();
        console.log(request);
        request.buptableAWBArry = buptableDeleteAWBArryList;
        console.log(request);
        if (request.buptableAWBArry.length > 0) {
            this.buplistService.getBuplist_Delete(request).subscribe(data => {
                console.log(data);
                this.onSearch();
            });
        }
        this.getTotalWeight();
    }

    onSearch() {
        this.resetFormMessages();
        if (!(this.bupform.get('shipmentNumber').value || this.bupform.get('uldNumber').value)) {
            this.showErrorStatus("export.awb.uld.mandatory"); return;
        }
        if (this.bupform.get('shipmentNumber').value && this.bupform.get('uldNumber').value) {
            this.showErrorStatus("exp.accpt.search.uld.awb"); return;
        }

        const requestObject = this.bupform.getRawValue();
        console.log(requestObject.uldNumber);
        if ((this.bupform.get('shipmentNumber').value)) {
            this.searchResult = true;
            this.awb_search = false;
            this.uld_search = false;
            this.buplistService.getBupList_Uld(requestObject).subscribe(data => {
                if (data.data == null) {
                    this.showErrorStatus("no.record");
                    return;
                }
                else {
                    this.awb_search = true;
                }

                data.data.buptableULDArry.forEach((value, index) => {

                    if (value.fwb === '0') {
                        data.data.buptableULDArry[index].fwb = false;
                    }
                    else {
                        data.data.buptableULDArry[index].fwb = true;
                    }
                });
                this.bupform.patchValue(data.data);
            })
        }

        else if ((this.bupform.get('uldNumber').value)) {
            this.searchResult = true;
            this.awb_search = false;
            this.uld_search = false;
            this.buplistService.getBupList_Awb(requestObject).subscribe(data => {
                if (data.success == true && data.data == null) {
                    this.showErrorStatus("no.record");
                    return;
                }
                else {
                    this.uld_search = true;
                }

                data.data.buptableAWBArry.forEach((ele, index) => {
                    ele.sel = false
                });

                data.data.buptableAWBArry.forEach((value, index) => {
                    let piLength = 0
                    if (value.lithiumBatteriesDetails.length) {
                        piLength = value.lithiumBatteriesDetails.length;
                    }
                    for (let i = 0; i < 6 - piLength; i++) {
                        value.lithiumBatteriesDetails.push(this.patchList);
                    }
                });
                this.bupform.patchValue(data.data);
                (<NgcFormArray>this.bupform.get('buptableAWBArry')).controls.forEach((element, index) => {
                    this.bupform.get(["buptableAWBArry", index, "shipmentNumber"]).disable({ onlySelf: true });
                });
                let SUM = 0;
                data.data.buptableAWBArry.forEach((value, index) => {
                    SUM = SUM + Number(value.shipmentWeight);
                });
                console.log(SUM);
                this.bupform.get('totalULDWt').setValue(SUM);
            })
        }
    }

    print() {
        this.reportParameters = new Object();
        this.reportParameters.uldNumber = this.bupform.get('uldNumber').value;
        this.reportWindow.reportParameters = this.reportParameters;
        this.reportWindow.open();
    }

    onSave() {
        this.resetFormMessages();

        let netWeightSum = 0;
        let totalPieces = 0;
        if (this.bupform.get('searchBy').value == 'ULD') {
            for (let element of (<NgcFormArray>this.bupform.get('buptableAWBArry')).controls) {
                if (element.get('origin').value == element.get('destination').value) {
                    this.showErrorStatus("data.origin.destination.cannot.be.same");
                    return;
                }
                if (element.get('shipmentWeight').value && element.get('shipmentWeight').value) {
                    netWeightSum += Number(element.get('shipmentWeight').value);
                    totalPieces += Number(element.get('shipmentPieces').value);
                }
            }
            if (netWeightSum > Number(this.bupform.get('grossWeight').value)) {
                this.showErrorStatus("exp.accpt.weight");
                return;
            }
            console.log(totalPieces);
            this.bupform.get('totalPieces').setValue(totalPieces);
        }

        /* validation for shc and Pi Lithium battery*/
        let buptableAWBArrySHC = false;
        let buptableAWBArryPILIBatteries = false;
        (<NgcFormArray>this.bupform.get('buptableAWBArry')).controls.forEach(element => {
            (<NgcFormArray>element.get('specialHandlingCode')).controls.forEach(ele => {
                if (ele.get('specialHandlingCode').value === 'ELI' || ele.get('specialHandlingCode').value === 'ELM' ||
                    ele.get('specialHandlingCode').value === 'RLI' || ele.get('specialHandlingCode').value === 'RLM' || element.get('specialHandlingCode').value === 'RBI' ||
                    ele.get('specialHandlingCode').value === 'EBI' || ele.get('specialHandlingCode').value === 'RBM' || element.get('specialHandlingCode').value === 'EBM') {
                    buptableAWBArrySHC = true;
                }
            });
            (<NgcFormArray>element.get('lithiumBatteriesDetails')).controls.forEach(ele => {
                if (ele.get('reference').value && ele.get('reference').value != null) {
                    buptableAWBArryPILIBatteries = true;
                }
            });
        });
        if (buptableAWBArrySHC && !buptableAWBArryPILIBatteries && (this.bupform.get('searchBy').value == 'ULD')) {

            this.showErrorStatus("PI Lithium Battery is mandatory");
            return;
        }
        if (!buptableAWBArrySHC && buptableAWBArryPILIBatteries && (this.bupform.get('searchBy').value == 'ULD')) {
            this.showErrorStatus("Please choose SHC for PI Lithium Battery");
            return;
        }
        const request = this.bupform.getRawValue();
        console.log(request);
        const buptableAWBArry = request.buptableAWBArry;
        const selectedRows = new Array<any>();
        buptableAWBArry.forEach(element => {
            if (element.sel) {
                selectedRows.push(element);
            }
        });

        console.log(selectedRows.length);
        if (this.bupform.get('uldNumber').value && selectedRows.length == 0) {
            this.showErrorMessage("equipment.request.by.uld.selectonerecord");
            return;
        }
        request.buptableAWBArry = selectedRows;
        this.buplistService.getBuplist_Save(request).subscribe(data => {
            this.searchResult = true;
            if (data.success === true) {
                this.showSuccessStatus("exp.savedsuccessfully.m");
                this.onSearch();
            }

        })
    }

    getTotalWeight() {
        let netWeightSum = 0;
        (<NgcFormArray>this.bupform.get('buptableAWBArry')).controls.forEach(ele => {
            console.log("shipmentWeight", ele.get('shipmentWeight').value)
            netWeightSum += Number(ele.get('shipmentWeight').value);
        })
        console.log("netWeightSum", netWeightSum);
        this.bupform.get('totalULDWt').setValue(netWeightSum);
    }

    ExpAwbDoc() {
        this.navigateTo(this.router, 'export/exportawbdocument', null);
    }
}



