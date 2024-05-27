import {
    Component,
    NgZone,
    ElementRef,
    Output,
    EventEmitter,
    OnInit,
    Input,
    OnDestroy,
    ViewContainerRef,
    ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Validators } from "@angular/forms";

import { SelectedUld } from "../../import.sharedmodel";
// NGC framework imports
import {
    NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcDropDownComponent,
    NgcButtonComponent, NgcPage, NgcUtility, NotificationMessage, StatusMessage, MessageType,
    DropDownListRequest, BaseResponse, PageConfiguration, NgcFormControl, BaseRequest, CellsRendererStyle
} from "ngc-framework";

import { ImportService } from "../../import.service";
import { RampCheckInUld, RampCheckInQuery, ShcUld, RampCheckInModel } from "../../import.sharedmodel";

@Component({
    selector: 'app-send-telex',
    templateUrl: './send-telex.component.html',
    styleUrls: ['./send-telex.component.scss']
})
@PageConfiguration({
    trackInit: true,
    callNgOnInitOnClear: true
})
export class SendTelexComponent extends NgcPage {
    private _list: RampCheckInUld[] = [];

    @Input('list')
    public set list(list: RampCheckInUld[]) {
        //construct message
        this._list = list;
        let uldNumber = null;
        if (this._list.length > 0) {
            this._list.forEach(element => {
                if (uldNumber == null) {
                    uldNumber = element.uldNumber;
                } else {
                    uldNumber = uldNumber + "," + element.uldNumber;
                }
            });
            let flightDate = NgcUtility.getDateAsString(new Date(this._list[0].flightDate));
            this.sendTelexForm.get('priority').setValue('QD');
            this.sendTelexForm.get('subject').setValue('DAMAGE ULD');
            this.sendTelexForm.get('messagecontent').setValue('Flight Info :' + this._list[0].flight + '/' + flightDate + "\n" + 'Received damaged container : ' + uldNumber);
        }
    }

    @Output('update')
    change: EventEmitter<number> = new EventEmitter<number>();
    constructor(
        appZone: NgZone,
        appElement: ElementRef,
        appContainerElement: ViewContainerRef,
        private importService: ImportService
    ) {
        super(appZone, appElement, appContainerElement);
    }

    ngOnInit() {
        console.log(this._list);
    }

    private sendTelexForm: NgcFormGroup = new NgcFormGroup({
        priority: new NgcFormControl('QD', Validators.required),
        interfacingSystem: new NgcFormControl(''),
        destinationaddres: new NgcFormControl('', Validators.required),
        emailaddress: new NgcFormControl(''),
        recipientaddress: new NgcFormControl('', Validators.required),
        subject: new NgcFormControl('', Validators.required),
        messagecontent: new NgcFormControl('', Validators.required)
    });

    public resetForm() {
        this.resetFormMessages();
        this.sendTelexForm.reset();
    }

    sendTelex() {
        let data = this.sendTelexForm.getRawValue();
        if (data.priority == null || data.destinationaddres == null || data.recipientaddress == null || data.messagecontent == null) {
            this.showErrorMessage("mandatory.field.not.empty");
            return;
        }
        data.flightKey = this._list[0].flight;
        data.flightDate = this._list[0].flightDate;
        data.byImportPod = true;
        data.messagecontentwihoutsubject = this.sendTelexForm.get('messagecontent').value;
        data.destinationaddres = [];
        if (this.sendTelexForm.get('destinationaddres') != null) {
        data.destinationaddres.push(this.sendTelexForm.get('destinationaddres').value);
        }
        //console.log(data);
        this.importService.inboundRampSendTelex(data).subscribe(response => {
            if (response.success == true) {
                this.showSuccessStatus("g.completed.successfully");
                this.change.emit(2);
            } else {
                let error: any = response.messageList[0].code;
                this.showErrorMessage(error);
            }

        });
    }
}
