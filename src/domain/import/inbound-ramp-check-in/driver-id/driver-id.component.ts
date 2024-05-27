import { ApplicationEntities } from './../../../common/applicationentities';
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
  NgcFormGroup,
  NgcFormArray,
  NgcApplication,
  NgcWindowComponent,
  NgcDropDownComponent,
  NgcButtonComponent,
  NgcPage,
  NgcUtility,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  PageConfiguration,
  NgcFormControl,
  BaseRequest,
  CellsRendererStyle
} from "ngc-framework";

import { ImportService } from "../../import.service";
import { RampCheckInUld, RampCheckInQuery, ShcUld, RampCheckInModel } from "../../import.sharedmodel";
@Component({
  selector: "app-driver-id",
  templateUrl: "./driver-id.component.html",
  styleUrls: ["./driver-id.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  focusToBlank: true,
  focusToMandatory: true,
  callNgOnInitOnClear: true,
})
export class DriverIdComponent extends NgcPage {
  @Input() list: RampCheckInUld[];


  @Output("update") change: EventEmitter<number> = new EventEmitter<number>();
  uldList: Array<SelectedUld>;
  response: any;
  tenantName: boolean = true;
  private form: NgcFormGroup = new NgcFormGroup({
    id: new NgcFormControl(),
    flightId: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    transferType: new NgcFormControl(),
    contentCode: new NgcFormControl(),
    usedAsTrolley: new NgcFormControl(),
    damaged: new NgcFormControl(),
    empty: new NgcFormControl(),
    piggyback: new NgcFormControl(),
    phc: new NgcFormControl(),
    val: new NgcFormControl(),
    manual: new NgcFormControl(true),
    driverId: new NgcFormControl(),
    checkedinAt: new NgcFormControl(),
    checkedinBy: new NgcFormControl(),
    checkedinArea: new NgcFormControl(),
    offloadReason: new NgcFormControl(),
    remarks: new NgcFormControl(),
    statueCode: new NgcFormControl(),
    offloadedFlag: new NgcFormControl(),
    tractorNumber: new NgcFormControl(),
    handoverDateTime: new NgcFormControl(),
    shcs: new NgcFormArray([
      new NgcFormGroup({
        shcCode: new NgcFormControl()
      })
    ])
  });

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    if (!NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_DriverId)) {
      this.tenantName = false;
    }
    console.log("--------------------------------------yyyyyyyyyyyyyyyyyyyyyyyyyyysfxxxxxxxxxxxxxxxxxx-------------------");
  }


  onSave() {
    if (this.form.get('driverId').value == null && NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_DriverId)) {
      this.showErrorMessage("add.driverid");
      return;
    }
    console.log(this.list);
    let request: Array<RampCheckInUld> = new Array<RampCheckInUld>();
    this.list.forEach(element => {
      console.log(element);
      element.checkedinBy = this.getUserProfile().userLoginCode;
      element.driverId = this.form.get("driverId").value;
      element.tractorNumber = this.form.get("tractorNumber").value;
      element.handoverDateTime = this.form.get("handoverDateTime").value;
      element.impRampCheckInId;
      element.origin;
      element.flight;
      element.flightDate;
      request.push(element);
    });
    const request1: RampCheckInModel = new RampCheckInModel();
    request1.uldList = request;
    this.resetFormMessages();
    this.importService.assignDriverToUld(request1).subscribe(data => {
      console.log(data);
      if (data.messageList.length > 0) {
        if (data.messageList[0].code == "exp.ramp.invalidDriverId") {
          data.messageList = data.messageList.slice(0, 1);
        }
      }
      if (!this.showResponseErrorMessages(data)) {
        this.response = data.data;
        this.change.emit(2);
      }
    },
      error => {
        // this.showErrorStatus('Error:' + error);
        this.change.emit(1);
      }
    );
  }

  protected afterFocus() {
    this.async(() => {
      try {
        (this.form.get('tractorNumber') as NgcFormControl).focus();
      } catch (e) { }
    }, 100);
  }

  public resetForm() {
    console.log(this.list);
    this.form.reset();
    this.afterFocus();
    let date = new Date();
    this.resetFormMessages();
    this.form.get("handoverDateTime").setValue(date);
  }
}
