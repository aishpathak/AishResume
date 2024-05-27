import { Component, NgZone, OnInit, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    NgcFormGroup, NgcFormControl, PageConfiguration, NgcPage, NgcFormArray,
    NgcWindowComponent, NgcUtility, DateTimeKey
} from 'ngc-framework';
import { AwbManagementService } from '../awbManagement.service';
import { truncateSync } from 'fs';
import { SearchGroup, TerminalPointDetails } from '../awbManagement.shared';

@Component({
    selector: 'app-shipment-handover',
    providers: [AwbManagementService],
    templateUrl: './shipment-handover.component.html',
    styleUrls: ['./shipment-handover.component.scss']
})
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true,
    autoBackNavigation: true
})

export class ShipmentHandoverComponent extends NgcPage {

    private receipentDetails: NgcFormGroup = new NgcFormGroup({
        receivedBy: new NgcFormControl(''),
        receiverSignature: new NgcFormControl(''),
        receivedTime: new NgcFormControl(''),
        receivedDate: new NgcFormControl(new Date()),
    });
    private subscriberDetails: NgcFormGroup = new NgcFormGroup({
        handedOverBy: new NgcFormControl(''),
        handedOverOn: new NgcFormControl(NgcUtility.subtractDate(new Date(), 12, DateTimeKey.HOURS)),
        handedTime: new NgcFormControl(''),
    });
    private flight: NgcFormGroup = new NgcFormGroup({

        number: new NgcFormControl(''),
        destination: new NgcFormControl(''),
        dateSTD: new NgcFormControl(''),
        onwardBookingDetails: new NgcFormControl(''),
        time: new NgcFormControl(''),
    });
    private handoverTerminalShp: NgcFormGroup = new NgcFormGroup({
        origin: new NgcFormControl(''),
        shpNumber: new NgcFormControl(''),
        destination: new NgcFormControl(''),
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        flight: this.flight,
        loadingDetails: new NgcFormControl(''),
        shipmentId: new NgcFormControl(),
        uldId: new NgcFormControl(),
        piecesweight: new NgcFormControl(''),
        originDestination: new NgcFormControl(''),
    });
    private terminalPointDetails: NgcFormGroup = new NgcFormGroup({

        shpNumber: new NgcFormControl(''),
        loadingDetails: new NgcFormControl(''),
        purpose: new NgcFormControl(''),
        shipmentId: new NgcFormControl(''),
        uldId: new NgcFormControl(''),
        receipentDetails: this.receipentDetails,
        subscriberDetails: this.subscriberDetails,
        handoverTerminalShp: this.handoverTerminalShp,
        handoverTerminalShpList: new NgcFormArray([])
    });
    private terminalPoint: NgcFormGroup = new NgcFormGroup({

        toTrml: new NgcFormControl(''),
        fromTrml: new NgcFormControl(''),
        terminalPointDetails: this.terminalPointDetails,
    });



    private shipmentHandedover: NgcFormGroup = new NgcFormGroup({
        terminalPoint: this.terminalPoint,
        terminalPointList: new NgcFormArray([]),
    })

    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, public awbManagementService: AwbManagementService) {
        super(appZone, appElement, appContainerElement);
    }
    ngOnInit() {
        super.ngOnInit();
    }

    search() {
        let sg: SearchGroup = new SearchGroup();
        sg.terminalPoint = (this.shipmentHandedover.get('terminalPoint') as NgcFormGroup).getRawValue();
        console.log(JSON.stringify(sg));
        this.awbManagementService.getDetailsOfShipmentToTerminal(sg).subscribe((res) => {
            if (res.success) {
                let shipmentHandover: SearchGroup = res.data;

                if (shipmentHandover.messageList.length) {
                    this.showErrorMessage(shipmentHandover.messageList[0].code);
                } else {
                    if(shipmentHandover.terminalPointList==null){
                        shipmentHandover.terminalPointList = [];
                    }
                    this.shipmentHandedover.patchValue(shipmentHandover);

                }
            } else {
                this.showResponseErrorMessages(res);
            }
        })
    }
}

