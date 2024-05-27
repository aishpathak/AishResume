import { Router } from '@angular/router';
import { FormsModule, NgControl, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from '@angular/core';
import {
  NgcPage,
  NgcUtility,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcLOVComponent, PageConfiguration
} from 'ngc-framework';
import { IncomingRequest } from './../val.sharemodel';
import { ValSharedService } from '../val-shared.service';
import { request } from 'http';
import { ApplicationEntities } from '../../common/applicationentities';
import { BillingService } from '../../billing/billing.service';
//import { NgcFormControl } from 'ngc-framework/core/model/formcontrol.model';
const Constants = {
  DEFAULT_FORM_NAME: 'form'
};
@Component({
  selector: 'app-incoming-request',
  templateUrl: './incoming-request.component.html',
  styleUrls: ['./incoming-request.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class IncomingRequestComponent extends NgcPage {
  resp: any;
  arrayUser: any[];
  eStartShipemntScreenButtonFlag: false;
  showDetails: boolean = false;
  handledbyHouse: boolean = false;
  hawbSourceParameters: {};

  private form: NgcFormGroup = new NgcFormGroup({
    shipment: new NgcFormControl(),
    shipmentType: new NgcFormControl('AWB'),
    shipmentNumber: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    inbFlightNumber: new NgcFormControl(),
    inbFlightDate: new NgcFormControl(),
    advicelocation: new NgcFormControl(),
    originAirport: new NgcFormControl(),
    destinationAirport: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    natureOfGoods: new NgcFormControl(),
    shcList: new NgcFormControl(),
    oubFlightNumber: new NgcFormControl(),
    oubFlightDate: new NgcFormControl(),
    remark: new NgcFormControl(),
    flagDelete: new NgcFormControl(),
    flagSaved: new NgcFormControl(),
    flagUpdate: new NgcFormControl(),
    flagInsert: new NgcFormControl(),
    flag: new NgcFormControl()
  });

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private router: Router,
    private valService: ValSharedService,
    private billingService: BillingService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  public save(event) {
    const request1 = (<NgcFormGroup>this.form).getRawValue();
    this.resetFormMessages();
    this.valService.save(request1).subscribe(
      data => {
        if (!this.showResponseErrorMessages(data)) {
          this.form.reset();
          this.resp = data;
          this.arrayUser = this.resp.data;
          this.showSuccessStatus("g.completed.successfully");
          this.form.get("shipmentType").setValue(this.resp.data.shipmentType);
        }
      }, error => {
        this.showErrorStatus(error);
      }

    );
  }

  private onShipmentSelect(event) {
    if (this.form.get("shipmentType") && event.shipmentType) {
      this.form.get("shipmentType").setValue(event.shipmentType);
    }
  }

  onTabOutCheckHandledBy(event) {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      if (this.form.get('shipmentNumber').value == null || this.form.get('shipmentNumber').value == "") {
        this.showErrorStatus('g.enter.awb');
        this.handledbyHouse = false;
        return;
      }
      else {
        this.handledbyHouse = true;
        this.async(() => {
          try {
            (this.form.get('hawbNumber') as NgcFormControl).focus();
          } catch (e) { }
        });
      }
      this.resetFormMessages();
    }
  }

  public search() {
    this.showDetails = false;
    const request2 = (<NgcFormGroup>this.form).getRawValue();
    this.resetFormMessages();
    const incomingRequest: IncomingRequest = new IncomingRequest();
    incomingRequest.shipmentType = request2['shipmentType'];
    incomingRequest.shipmentNumber = request2['shipmentNumber'];
    incomingRequest.hawbNumber = request2['hawbNumber'];
    this.valService.search(incomingRequest).subscribe(
      data => {
        if (data.data.messageList.length != 0 && data.data.messageList[0].code === 'SHPOUT') {
          this.showConfirmMessage('val.continue').then(fulfilled => {
            this.resetFormMessages();
          }
          ).catch(reason => {
            this.resetFormMessages();
            this.form.reset();
          });
        }

        if (!this.showResponseErrorMessages(data)) {
          if (data.data.messageList.length == 0) {

            if (data.data.isRecordExists) {
              this.showConfirmMessage('val.shipment.already.exist.do.you.want.to.edit').then(fulfilled => {
                this.patchResponseDetails(incomingRequest, data);
              }
              ).catch(reason => {
                this.showDetails = false;
              });
            } else {
              this.patchResponseDetails(incomingRequest, data);
            }
          }
        }

        else {
          this.showDetails = false;
        }
      }, err => {
        this.showErrorStatus(err);
      }
    );
  }

  patchResponseDetails(incomingRequest, data) {
    this.resetFormMessages();
    this.showDetails = true;
    this.resp = data;
    this.arrayUser = this.resp.data;
    this.arrayUser['inbFlightDate'] = this.resp.data.inbFlightDate;
    this.arrayUser['oubFlightDate'] = this.resp.data.oubFlightDate;
    this.arrayUser['flagSaved'] = 'Y';
    this.arrayUser['flagUpdate'] = 'Y';
    this.form.reset();
    this.arrayUser['shipmentType'] = incomingRequest.shipmentType;
    this.arrayUser['shipmentNumber'] = incomingRequest.shipmentNumber;
    this.arrayUser['hawbNumber'] = this.resp.data.hawbNumber;
    if (data.data.isRecordExists) {
      this.arrayUser['flag'] = 'U';
    }
    else {
      this.arrayUser['flag'] = 'C';
    }
    this.form.patchValue(this.arrayUser);
  }
}
