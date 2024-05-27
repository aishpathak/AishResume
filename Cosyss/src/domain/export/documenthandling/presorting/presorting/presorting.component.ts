import {
    Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChild, QueryList,
    ChangeDetectorRef, Pipe, PipeTransform, OnInit, OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    NgcPage, StatusMessage, NgcFormGroup, NgcFormArray,
    NgcFormControl, NgcCheckBoxComponent, NgcInputComponent, NgcNumberInputComponent, PageConfiguration, UserProfile, BroadcastEvent, EventSubject
} from 'ngc-framework';

import { PresortingRequest, PresortingResponse, GetRegionRequest } from './../presorting.shared';
import { PresortingService } from './../presorting.service';
import { FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'presorting-page',
    templateUrl: './presorting.component.html',
    providers: [PresortingService]
})

@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    autoBackNavigation: true
})

export class PresortingComponent extends NgcPage implements OnInit, OnDestroy {
    grpName: any;
    resp: any;
    show = false;
    tickCheckBox = false;
    awbNoDisplay: any = '';
    @ViewChild('awb') awb: NgcInputComponent;

    private form: NgcFormGroup = new NgcFormGroup({
        awbNo: new NgcFormControl(),
        copy: new NgcFormControl(),
        locationId: new NgcFormControl(),
        locationName: new NgcFormControl(),
        pouchId: new NgcFormControl(),
        groupId: new NgcFormControl(),
        regionName: new NgcFormControl(),
        checkBox: new NgcFormControl(),
        regionList: new NgcFormArray([])
    });

    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
        private presortingService: PresortingService, private router: Router, private element: ElementRef) {
        super(appZone, appElement, appContainerElement);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.form.controls['checkBox'].setValue(false);
        this.getRegions();
    }

    protected handleEvent(event: BroadcastEvent): void {
        switch (event.subject) {
            case EventSubject.BUSINESS:
                this.getRegions();
                break;
            default:
                super.handleEvent(event);
                break;
        }
    }

    getRegions() {
        let request: GetRegionRequest = new GetRegionRequest();
        this.presortingService.getRegions(request).subscribe(responseBean => {
            this.resp = responseBean.data;
            this.form.get('regionList').patchValue(this.resp);
            this.form.get('regionList').setValue(this.resp);
        }, error => {
            this.showErrorStatus("export.error.while.fetching.region.details");
        });
    }

    onSearchRegionAWB() {
        let request: PresortingRequest = new PresortingRequest();
        request.awbNo = this.form.get("awbNo").value;

        if (request.awbNo === null || request.awbNo == '') {
            this.awb.focus();
            return;
        }

        this.presortingService.getAWBPresortingInfo(request).subscribe(responseBean => {
            this.refreshFormMessages(responseBean);
            this.resp = responseBean.data;
            if (!this.showResponseErrorMessages(responseBean)) {
                request.awbId = responseBean.data.awbId;         // Coz we will update Cdh_DocumentMaster table Based on ShipmentID
                this.show = true;
                this.form.patchValue(this.resp);
            } else {
                this.form.get("awbNo").reset();
            }

            this.awbNoDisplay = this.resp.awbNo;
            this.grpName = this.resp.regionName == "" ? "" : this.resp.regionName; // HighLight Region
            this.getRegions(); //Page Reload

            // --------------------------Update Functionality---------------------------------

            if (this.tickCheckBox) {
                request.pigeonHoleLocationId = this.resp.pigeonHoleLocationId;
                request.awbId = this.resp.awbId;
            }

            // Prepare Request for : Updating  Cdh_DocumentMaster Table Based on Conditions 
            if (!this.tickCheckBox) {                                // If Checkbox is unchecked
                request.documentStatus = 'Received';
                request.copyNo = '0';
            } else if (this.tickCheckBox && !this.resp.flightPouchId) {    // If Checkbox is checked and response-PouchId is null
                request.documentStatus = 'Stored';
                request.copyNo = '0';
                request.pigeonHoleLocationId = this.resp.pigeonHoleLocationId;
            } else if (this.tickCheckBox && this.resp.flightPouchId) {     // If Checkbox is checked and response-PouchId is NOT null
                request.documentStatus = 'In Pouch';
                request.flightPouchId = this.resp.flightPouchId;
                request.copyNo = '0';
                request.pigeonHoleLocationId = this.resp.pigeonHoleLocationId;
            }

            if (this.tickCheckBox) {
                this.UpdateLocationAndPouch(request);
            }

            this.showSuccessStatus("g.operation.successful");
            this.form.get("awbNo").reset();
            if (this.tickCheckBox) {
                this.form.controls['checkBox'].setValue(true);
            } else {
                this.form.controls['checkBox'].setValue(false);
            }
        }, error => {
            this.grpName = "";
            this.showErrorStatus("export.unable.scan.awb!");
            this.form.get("awbNo").reset();
            this.awb.focus();
            this.grpName = "";
        });
        this.awb.focus();
    }

    UpdateLocationAndPouch(request: PresortingRequest) {
        this.presortingService.updateManualLocation(request).subscribe(responseBean => {
            
            if (this.tickCheckBox) {
                this.showSuccessStatus("export.location.updated.successfully");
            }
        }, error => {
            this.showErrorStatus("export.invalid.location");
        });
    }

    clickCheckbox() {
        if (this.form.controls['checkBox'].value) {
            this.tickCheckBox = true;
        } else {
            this.tickCheckBox = false;
        }
    }
}

