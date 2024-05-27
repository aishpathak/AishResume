import {
    NgcUtility, NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcButtonComponent,
    NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest, BaseResponse, PageConfiguration
} from "ngc-framework";

import {
    Component, NgZone, ElementRef, OnInit,
    OnDestroy, ViewContainerRef, ViewChild
} from "@angular/core";

import { NgcFormControl } from "ngc-framework";
import { ActivatedRoute, Router } from "@angular/router";
import { BillingService } from '../../billing.service';
import { BillingServiceMasterRequest } from '../../billing.sharedmodel';

@Component({
    selector: 'app-maintainServiceMaster',
    templateUrl: './maintainServiceMaster.component.html'
})
@PageConfiguration({
    trackInit: true,
})
export class MaintainServiceMasterComponent extends NgcPage {

    resp: any;
    record: any;
    hasWritePermission: boolean;
    private maintainServiceMasterForm: NgcFormGroup = new NgcFormGroup({
        searchOptions: new NgcFormGroup({
            serviceCode: new NgcFormControl(),
            name: new NgcFormControl(),
            associatedTo: new NgcFormControl(),
            serviceCategory: new NgcFormControl()
        }),
        resultList: new NgcFormArray([])
    });

    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
        private billingService: BillingService, private route: ActivatedRoute, private router: Router) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        super.ngOnInit();
        let forwardedData = this.getNavigateData(this.route);
        // checking if the fetched data is not null
        if (forwardedData != null) {
            this.maintainServiceMasterForm.get('searchOptions').patchValue(forwardedData.searchOption);
        }
        // Search Again
        this.searchServices();
    }

    /**
      * On Search of Function
      *
      * @param event Event
      */
    private searchServices() {
        this.hasWritePermission = NgcUtility.hasWritePermission('MAINTAIN_SERVICE_MASTER');
        let search: BillingServiceMasterRequest = (this.maintainServiceMasterForm.get("searchOptions") as NgcFormGroup).getRawValue();
        //
        (this.maintainServiceMasterForm.get('resultList') as NgcFormArray).resetValue([]);
        //
        this.billingService.getMasterServiceList(search).subscribe(response => {
            if (!this.showResponseErrorMessages(response)) {
                this.resp = response.data;
                if (!this.resp.length) {
                    this.showErrorStatus('billing.error.no.records.found');
                }
                this.generateSno();
                (<NgcFormArray>this.maintainServiceMasterForm.get('resultList')).patchValue(this.resp);
            }
        }, error => {
            this.showErrorMessage(error);
        });
    }

    /**
   *
   *This method is called On click  edit link and navigate to popup for edit/delete.
   * @memberof 
   */
    onLinkClick(event) {
        if (event.column === 'EDIT') {
            this.record = event.record;
            this.navigateTo(this.router, '/billing/billingSetup/serviceSetup', {
                editSearchData: this.record,
                searchOption: (this.maintainServiceMasterForm.get('searchOptions') as NgcFormGroup).getRawValue()
            });
        }
        if (event.column === 'DELETE') {
            this.record = event.record;
            let deleteRecord = event.record;
            let index = event.record.NGC_ROW_ID;

            this.billingService.deleteServiceList(deleteRecord).subscribe(response => {
                console.log('response', response.data);

                if (response.messageList && response.messageList.length > 0) {
                    this.resp = response.data;
                    this.refreshFormMessages(response);
                } else {

                    this.showSuccessStatus("g.deleted.successfully");
                    this.searchServices();
                }
            });
        }
    }

    /**
       * Called when delete button is clicked
        * @param event Event
       */



    generateSno() {
        let serialCounter = 1;
        for (let index = 0; index < this.resp.length; index++) {
            this.resp[index]['serialNo'] = serialCounter++;
        }
    }

    /**
       *
       *called when clear button is triggered
       * @param {any} event
       * @memberof 
       */
    onClear(event): void {
        this.resetFormMessages();
        this.maintainServiceMasterForm.reset();
        this.searchServices();
    }

    /**
   * Called when add button is clicked
    * @param event Event
   */
    addServices() {
        this.router.navigate(['billing', 'billingSetup', 'serviceSetup']);
    }

    backToHome(event) {
        this.router.navigate(['']);
    }
}

