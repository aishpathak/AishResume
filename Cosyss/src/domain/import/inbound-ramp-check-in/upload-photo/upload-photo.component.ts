import { Component, NgZone, ElementRef, Output, EventEmitter, OnInit, Input, OnDestroy, ViewContainerRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import {
  NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcDropDownComponent, NgcButtonComponent,
  NgcPage, NotificationMessage, StatusMessage, MessageType, DropDownListRequest,
  BaseResponse, PageConfiguration, NgcFormControl, BaseRequest, CellsRendererStyle
} from 'ngc-framework';
import { ImportService } from "../../import.service";
import { RampCheckInUld, RampCheckInQuery, ShcUld, RampCheckInModel } from "../../import.sharedmodel";

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class UploadPhotoComponent extends NgcPage {
  private _list: RampCheckInUld;

  @Output("update") change: EventEmitter<number> = new EventEmitter<number>();
  uldnumber: any;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService
  ) {
    super(appZone, appElement, appContainerElement);
    console.log(this.list);
  }

  ngOnInit() {
    super.ngOnInit();
    console.log(this.list);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  @Input('list')
  public set list(list: RampCheckInUld) {
    this._list = list;
    this.form.get('entityType').setValue('ULD');
    this.form.get('entityKey').setValue(list.uldNumber);
    this.form.get('associatedTo').setValue('Flight');
    this.form.get('flightId').setValue(list.flightId);
    this.form.get('stage').setValue('Ramp');
  }

  public get list() {
    return this._list;
  }

  private form: NgcFormGroup = new NgcFormGroup({
    entityType: new NgcFormControl(),
    entityKey: new NgcFormControl(),
    associatedTo: new NgcFormControl(),
    stage: new NgcFormControl(),
    emailTo: new NgcFormControl(),
    referenceId: new NgcFormControl(),
    remarks: new NgcFormControl(),
    imagePreview: new NgcFormControl(),
    flightId: new NgcFormControl()

  });

}
