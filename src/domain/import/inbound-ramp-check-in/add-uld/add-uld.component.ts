import {
  Component, NgZone, ElementRef, OnInit, OnDestroy,
  ViewContainerRef, ViewChild, Input, Output, EventEmitter
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormArray, FormControl } from '@angular/forms';
// NGC framework imports
import {
  NgcFormGroup, NgcFormArray, NgcApplication, NgcWindowComponent, NgcDropDownComponent, NgcButtonComponent,
  NgcPage, NgcUtility, NotificationMessage, StatusMessage, MessageType, DropDownListRequest,
  BaseResponse, PageConfiguration, NgcFormControl, BaseRequest, CellsRendererStyle
} from 'ngc-framework';

import { ImportService } from '../../import.service';
import { RampCheckInUld, RampCheckInQuery, ShcUld, RampCheckAddUld, RampCheckInRequestClass } from '../../import.sharedmodel';
@Component({
  selector: 'app-add-uld',
  templateUrl: './add-uld.component.html',
  styleUrls: ['./add-uld.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class AddUldComponent extends NgcPage {
  i: number = 1;
  response: any;


  @Input() list: RampCheckAddUld;

  @Output('update')
  change: EventEmitter<number> = new EventEmitter<number>();

  private addUldForm: NgcFormGroup = new NgcFormGroup({
    uldArrayList: new NgcFormArray([]),
    id: new NgcFormControl(),
    flightId: new NgcFormControl(),
    flight: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    driverId: new NgcFormControl(),
    tractorNumber: new NgcFormControl(),
    handoverDateTime: new NgcFormControl(),
    createshc: new NgcFormArray([
    ]),
    shcs: new NgcFormArray([
      new NgcFormGroup({
        impRampCheckInId: new NgcFormControl(),
        shc: new NgcFormControl()
      })
    ]),
    shc1: new NgcFormControl(),
    shc2: new NgcFormControl(),
    shc3: new NgcFormControl(),
    shc4: new NgcFormControl(),
    shc5: new NgcFormControl(),
    shc6: new NgcFormControl(),
    shc7: new NgcFormControl(),
    shc8: new NgcFormControl(),
    shc9: new NgcFormControl()
  });

  constructor(
    appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private importService: ImportService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    //console.log(this.list);
    (<NgcFormArray>this.addUldForm.get("uldArrayList")).patchValue(new Array())
    console.log(this.list);
  }
  getShcData(req: any): any {
    let shc: ShcUld = new ShcUld();
    shc.shc = req;
    shc.impRampCheckInId = '8';
    return shc;
  }
  onSave() {
    this.resetFormMessages();
    this.addUldForm.validate();
    if (this.addUldForm.invalid) {
      this.showErrorMessage('mandatory.field.not.empty');
      return;
    }

    let requests: any = (<NgcFormArray>this.addUldForm.get("uldArrayList")).getRawValue();
    requests = requests.map(element => {
      element.tractorNumber = this.addUldForm.get('tractorNumber').value;
      element.driverId = this.addUldForm.get('driverId').value;
      element.handoverDateTime = this.addUldForm.get('handoverDateTime').value;
      element.flightId = <string>this.list.flightId;
      element.flight = <string>this.list.flight;
      element.flightDate = <string>this.list.flightDate;
      element.checkedinBy = this.getUserProfile().userLoginCode;
      if (NgcUtility.hasFeatureAccess('Imp.Ramp.EicUldHandling')) {
        element.remarks = 'SURPLUS';
      }
      //   request.flightId = <string>this.list.flightId;
      // request.checkedinBy = this.getUserProfile().userLoginCode;
      return element;
    });

    let serviceRequest = new RampCheckInRequestClass();
    serviceRequest.driverId = this.addUldForm.get('driverId').value;
    serviceRequest.uldInfoList = requests;

    let request: RampCheckInUld = new RampCheckInUld();
    let shcCode: Array<ShcUld> = new Array<ShcUld>();
    let shc: ShcUld = new ShcUld();
    // let shcData = <NgcFormArray>this.addUldForm.get('shcs');

    //console.log(shcCode);
    // this.addUldForm.get('shcs').patchValue(shcCode);
    const dataForm = this.addUldForm.get('search');

    if (this.addUldForm.get('shc1').value) {
      shcCode.push(this.getShcData(this.addUldForm.get('shc1').value));
    }
    if (this.addUldForm.get('shc2').value) {
      shcCode.push(this.getShcData(this.addUldForm.get('shc2').value));
    }
    if (this.addUldForm.get('shc3').value) {
      shcCode.push(this.getShcData(this.addUldForm.get('shc3').value));
    }
    if (this.addUldForm.get('shc4').value) {
      shcCode.push(this.getShcData(this.addUldForm.get('shc4').value));
    }
    if (this.addUldForm.get('shc5').value) {
      shcCode.push(this.getShcData(this.addUldForm.get('shc5').value));
    }
    if (this.addUldForm.get('shc6').value) {
      shcCode.push(this.getShcData(this.addUldForm.get('shc6').value));
    }
    if (this.addUldForm.get('shc7').value) {
      shcCode.push(this.getShcData(this.addUldForm.get('shc7').value));
    }
    if (this.addUldForm.get('shc8').value) {
      shcCode.push(this.getShcData(this.addUldForm.get('shc8').value));
    }
    if (this.addUldForm.get('shc9').value) {
      shcCode.push(this.getShcData(this.addUldForm.get('shc9').value));
    }

    //this.addUldForm.get('shcs').patchValue(this.shcCode);
    request = this.addUldForm.value;
    request.flight = <string>this.list.flight;
    request.flightDate = <string>this.list.flightDate;
    request.flightId = <string>this.list.flightId;
    request.checkedinBy = this.getUserProfile().userLoginCode;

    //console.log(shcCode);
    request.shcs = shcCode;
    request.manual = true;
    //console.log(request);

    let allow: boolean = true;
    this.list.uldlist.forEach(element => {
      if (element == request.uldNumber) {
        allow = false;
      }
    });
    if (allow) {
      this.importService.createRampCheckInUld(serviceRequest).subscribe(data => {
        this.response = data;
        if (data.messageList.length > 0) {
          if (data.messageList[0].code == "exp.ramp.invalidDriverId") {
            data.messageList = data.messageList.slice(0, 1);
          }
        }
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus("g.completed.successfully")
          this.change.emit(5);
          this.i = 1;
          (<NgcFormArray>this.addUldForm.get("uldArrayList")).resetValue([]);
        }
      });
    } else {
      this.showInfoStatus('import.info116');
    }
  }
  protected afterFocus() {
    this.async(() => {
      try {
        (this.addUldForm.get('tractorNumber') as NgcFormControl).focus();
      } catch (e) { }
    }, 100);
  }

  public resetForm() {
    this.addUldForm.reset();
    this.resetFormMessages();
    this.afterFocus();
    this.i = 1;
    (<NgcFormArray>this.addUldForm.get("uldArrayList")).resetValue([]);
    let date = new Date();
    this.addUldForm.get('handoverDateTime').setValue(date);
  }
  isValidForm() {

  }

  addRow() {
    if (this.i <= 6) {
      (<NgcFormArray>this.addUldForm.get("uldArrayList")).addValue([{
        uldNumber: '',
        contentCode: 'C',
        transferType: '',
        createshc: [],
        remarks: '',
      }
      ]);
      this.i++;
    } else {
      this.showInfoStatus('import.info117');
    }
  }
  deleteRow(item, index) {
    (<NgcFormArray>(
      this.addUldForm.controls["uldArrayList"]
    )).deleteValueAt(index);
    this.i--;
  }

}
