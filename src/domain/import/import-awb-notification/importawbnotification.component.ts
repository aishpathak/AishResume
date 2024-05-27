
/**
 * @copyright SATS Singapore 2017-18
 */

// Application
import {

    NotificationMessage, StatusMessage, MessageType, NgcDataTableComponent,
    CellsRendererStyle
} from 'ngc-framework';
import { CellsStyleClass } from '../../../shared/shared.data';

import { Component, NgZone, OnInit, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcFormGroup, NgcFormControl, PageConfiguration, NgcPage, NgcFormArray, NgcWindowComponent } from 'ngc-framework';
import { truncateSync } from 'fs';
import { ImportService } from '../import.service';
import { ImpAwbNotificationInfo, History } from '../import.shared';

@Component({
    selector: 'app-import-awb-notification',
    providers: [ImportService],
    templateUrl: './importawbnotification.component.html',

})
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true
})

export class ImportAwbNotification extends NgcPage {

    @ViewChild('resendIvrsRqst') resendIvrsRqst;
    @ViewChild('showHistory') showHistory;

    private impAwbNotify: NgcFormGroup = new NgcFormGroup({
        terminal: new NgcFormControl([Validators.required]),
        carrierGroup: new NgcFormControl(),
        contactMode: new NgcFormControl([Validators.required]),
        awbNumber: new NgcFormControl(),
        awbNotificationInfo: new NgcFormArray([]),
        ivrsHistoryList: new NgcFormArray([]),
        emailFlag: new NgcFormControl(),
        faxFlag: new NgcFormControl(),
        smsFlag: new NgcFormControl(),
        phoneFlag: new NgcFormControl()
    })


    constructor(appZone: NgZone, appElement: ElementRef,
        appContainerElement: ViewContainerRef,
        private activatedRoute: ActivatedRoute, private router: Router,
        public importService: ImportService) {
        super(appZone, appElement, appContainerElement);
    }
    ngOnInit() {

        this.testUi();
    }

    /**
    * Get Awb Info
    * 
    * @param {any} $event 
    * @memberof ImportAwbNotification
    * 
    */
    getAwbNotificationInfo() {
        let impAwbInfo: ImpAwbNotificationInfo = this.impAwbNotify.getRawValue();
        this.importService.getAwbNotificationInfo(impAwbInfo).subscribe((response) => {
            if (response.success) {
                this.impAwbNotify.patchValue(response.data);
            } else {
                this.refreshFormMessages(response.data);
            }
        }, (error) => {
        })
    }
    /**
        * temp 
        * 
        * @param {any} $event 
        * @memberof ImportAwbNotification
        * 
        */
    testUi() {
        let awb: ImpAwbNotificationInfo = new ImpAwbNotificationInfo();
        awb.awbNumber = "81620061719";
        awb.cneAgt = "CNE";
        awb.flightDate = "SQ117";
        awb.eawb = "EAWB";
        awb.contactInfo.email = "rvt@gmail.com";
        awb.readDelivery = "9";
        awb.contactInfo.fax = "24589";
        awb.primaryContact = "Email";
        awb.contactInfo.sms = "test2";
        awb.contactInfo.telephone = "9739228474"
        awb.ivrs.fax = "ivrs24589ivrs";
        awb.ivrs.sms = "ivrstestivrs";
        awb.ivrs.telephone = "ivrs9939228474ivrs";
        let awb1: ImpAwbNotificationInfo = new ImpAwbNotificationInfo();
        awb1.awbNumber = "81620061719";
        awb1.cneAgt = "CNE";
        awb1.flightDate = "SQ117";
        awb1.eawb = "EAWB";
        awb1.contactInfo.email = "rvt@gmail.com";
        awb1.readDelivery = "9";
        awb1.contactInfo.fax = "24589";
        awb1.primaryContact = "Email";
        awb1.contactInfo.sms = "test1";
        awb1.contactInfo.telephone = "9839228474";
        awb1.ivrs.fax = "ivrs24589";
        awb1.ivrs.sms = "ivrstest";
        awb1.ivrs.telephone = "ivrs9939228474";

        let awb2: ImpAwbNotificationInfo = new ImpAwbNotificationInfo();
        awb2.awbNumber = "81620061719";
        awb2.cneAgt = "CNE";
        awb2.flightDate = "SQ117";
        awb2.eawb = "EAWB";
        awb2.contactInfo.email = "rvt@gmail.com";
        awb2.readDelivery = "9";
        awb2.primaryContact = "Email";
        awb2.contactInfo.fax = "24589";
        awb2.contactInfo.sms = "test";
        awb2.contactInfo.telephone = "9939228474";
        awb2.ivrs.fax = "24589ivrs";
        awb2.ivrs.sms = "testivrs";
        awb2.ivrs.telephone = "9939228474ivrs";
        //awb2.resend=''

        let history: History = new History()
        history.ivrsType = 'telephone';
        history.responseDateTime = '2018-04-01'
        history.responseMessage = 'yes';
        history.contactDetail = '9739511487'

        let history1: History = new History()
        history1.ivrsType = 'sms';
        history1.responseDateTime = '2018-04-01'
        history1.responseMessage = 'yes';
        history1.contactDetail = '9785224581'

        let history2: History = new History()
        history2.ivrsType = 'fax';
        history2.responseDateTime = '2018-04-01'
        history2.responseMessage = 'yes';
        history2.contactDetail = '0154245165'

        let listHistory: Array<History> = new Array<History>();
        listHistory.push(history);
        listHistory.push(history1);
        listHistory.push(history2);

        let arr: Array<ImpAwbNotificationInfo> = new Array<ImpAwbNotificationInfo>();
        arr.push(awb)
        arr.push(awb1)
        arr.push(awb2)
        this.impAwbNotify.get('awbNotificationInfo').patchValue(arr);
        this.impAwbNotify.get('ivrsHistoryList').patchValue(listHistory);

    }
    /**
     * open window
     * 
     * @param {any} $event 
     * @memberof ImportAwbNotification
     * 
     */
    onLinkClick($event) {
        console.log("$event=========================");
        let value: boolean = ($event.column === 'resend') ? (this.resendIvrsRqst.open(), true) : ($event.column === 'history') ? (this.showHistory.open(), true) : false;
        console.log($event);
    }
    /**
    * close window
    * 
    * @param {any} $event 
    * @memberof ImportAwbNotification
    * 
    */
    closeWindow() {
        this.showHistory.close();
        this.resendIvrsRqst.close();
    }

    sendIvrsRequest() {

    }

    /**
     * Cells Style Renderer
     * 
     * @param value Value
     * @param rowData Row Data
     * @param level Level
     */
    public contactCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
        const contactInfo: NgcFormGroup = this.impAwbNotify.get(['awbNotificationInfo', rowData.NGC_ROW_ID]) as NgcFormGroup;
        let cellValue: NgcFormControl;
        let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
        //
        // Render Data
        if (contactInfo) {
            if ((cellValue = contactInfo.get(column) as NgcFormControl)) {
                cellsStyle.data = cellValue.value;
            }
        }
        return cellsStyle;
    };
}