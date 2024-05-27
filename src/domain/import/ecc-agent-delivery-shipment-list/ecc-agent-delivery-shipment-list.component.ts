import {
  Component,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild,
  OnInit
} from '@angular/core';
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcUtility,
  NgcWindowComponent,
  NgcButtonComponent, PageConfiguration
} from 'ngc-framework';
import {
  Validators,
  PatternValidator,
  FormControl,
  FormArray
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  AgentDeliverySummary,
  DeliveryShipmentList
} from '../import.sharedmodel';
import { ImportService } from '../import.service';

@Component({
  selector: 'app-ecc-agent-delivery-shipment-list',
  templateUrl: './ecc-agent-delivery-shipment-list.component.html',
  styleUrls: ['./ecc-agent-delivery-shipment-list.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class EccAgentDeliveryShipmentListComponent extends NgcPage
  implements OnInit {
  public eccdeliveryform: NgcFormGroup = new NgcFormGroup({
    team: new NgcFormControl(),
    eo: new NgcFormControl(),
    date: new NgcFormControl(),
    dateToShow: new NgcFormControl(),
    deliveryList: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        id: new NgcFormControl(),
        flight: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        awbNumber: new NgcFormControl(),
        uldNumber: new NgcFormControl(),
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        agent: new NgcFormControl(),
        shc: new NgcFormControl(),
        deliveryLocation: new NgcFormControl(),
        handOverTo: new NgcFormControl(),
        handOverDateTime: new NgcFormControl()
      })
    ])
  });

  showTable = false;
  locations: any;
  disable: any;
  resp: any;
  eo: any = [];
  delList: any;
  showEo = false;
  team: any;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() { }

  eoDropdown(item) {
    this.team = this.createSourceParameter(item.parameter1, item.parameter2);
  }

  getDeliveryList() {
    let respArray: any = new DeliveryShipmentList();
    this.disable = new Array<boolean>();
    this.locations = new Array<string>();
    let request = new AgentDeliverySummary();
    request = this.eccdeliveryform.getRawValue();
    this.importService.getDeliveryList(request).subscribe(data => {
      const resp: any = data;
      if (!this.showResponseErrorMessages(data)) {
        respArray = resp.data.deliveryList;
        if (respArray.length) {
          this.eccdeliveryform.get('eo').setValue(request.eo);
          this.eccdeliveryform.get('dateToShow').setValue(request.date.toLocaleDateString());
          this.showEo = true;
          respArray.forEach(delivery => {
            delivery['select'] = false;
            const date = NgcUtility.toDateFromLocalDate(
              delivery.flightDate
            ).toString();
            delivery['flightDateToShow'] =
              date.slice(8, 10) + date.slice(4, 7) + date.slice(11, 15);
            if (delivery.handOverDateTime) {
              this.disable.push(true);
              delivery['handOverDateTime'] = NgcUtility.toDateFromLocalDate(
                delivery.handOverDateTime
              );
            } else {
              this.disable.push(false);
            }
            delivery.deliveryLocation.forEach(location => {
              this.locations.push(location);
            });
          });
          this.eccdeliveryform.get('deliveryList').patchValue(resp.data.deliveryList);
          this.showTable = true;
        } else {
          this.showEo = false;
          this.showTable = false;
          this.showErrorStatus('no.record.found');
        }
      } else {
        this.showEo = false;
        this.showTable = false;
      }
    }, error => {
      this.showEo = false;
      this.showTable = false;
      this.showErrorStatus(error);
    });
  }

  onUpdate(index, item) {
    (<NgcFormControl>this.eccdeliveryform.get('deliveryList')['controls'][
      index
    ]['controls']['location']).setValue(item);
  }

  onSave() {
    this.updateDeliveryDetails();
  }

  updateDeliveryDetails() {
    this.resetFormMessages();
    let formValue = this.eccdeliveryform.getRawValue();
    if (this.eccdeliveryform.getRawValue().deliveryList[0].id) {
      let showErr = false;
      let count = 0;
      this.delList = new Array();
      let index = 0
      this.eccdeliveryform.get('deliveryList').value.forEach(detail => {
        if (detail['select']) {
          if (detail['handOverTo'] && detail['handOverDateTime']) {
            this.delList.push(detail);
          }
          if (!detail['handOverTo']) {
            this.showFormControlErrorMessage(this.eccdeliveryform.get(['deliveryList', index, 'handOverTo']) as NgcFormControl, 'mandatory');
          }
          if (!detail['handOverDateTime']) {
            this.showFormControlErrorMessage(this.eccdeliveryform.get(['deliveryList', index, 'handOverDateTime']) as NgcFormControl, 'mandatory');
          }
        } else {
          count++;
        }
        index++;
      });
      if (count == formValue.deliveryList.length) {
        this.showErrorStatus('import.err108');
      } else {
        let delivery = new AgentDeliverySummary();
        delivery.date = this.eccdeliveryform.get('date').value;
        delivery.deliveryList = this.delList;
        if (delivery.deliveryList.length) {
          this.importService.saveDetails(delivery)
            .subscribe(data => {
              const resp = data;
              if (!this.showResponseErrorMessages(data)) {
                this.showSuccessStatus('g.updated.successfully');
                this.getDeliveryList();
              }
            }, error => {
              this.showErrorStatus(error);
            });
        }
      }

    }
  }
}
