import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcInputComponent,
  NgcUtility, NgcWindowComponent, NgcContainerComponent, PageConfiguration, BaseBO
} from 'ngc-framework';
import { GetFlightId } from './../../export/export.sharedmodel';
import { Validator, Validators } from '@angular/forms';
import { NgcFormControl } from 'ngc-framework';
import { StatusMessage } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { InterfaceService } from '../interface.service';
import { FormConstants } from 'ngc-framework/core/common/util/form.utility';
@Component({
  selector: 'app-tsmmessagepush',
  templateUrl: './tsmmessagepush.component.html',
  styleUrls: ['./tsmmessagepush.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class TsmmessagepushComponent extends NgcPage implements OnInit {


  private tsmmanualpush: NgcFormGroup = new NgcFormGroup({
    shipment: new NgcFormControl(),
    shipments: new NgcFormArray([
      new NgcFormGroup({
        partSuffx: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        flightDate: new NgcFormControl()
      })
    ])
  });

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private interfaceService: InterfaceService) {
    super(appZone, appElement, appContainerElement);
  }


  ngOnInit() {

    const transferData = this.getNavigateData(this.activatedRoute);
    try {
      if (transferData !== null && transferData !== undefined) {

      }
    } catch (e) { }
  }



  onResend() {

    this.tsmmanualpush.validate();

    if (!this.tsmmanualpush.valid) {
      this.showErrorMessage("edi.enter.mandatory.fields");
      return;
    }
    let formData = this.tsmmanualpush.getRawValue();

    console.log(formData)
    //call service 

    this.interfaceService.sendTsmManually(formData).subscribe(response => {
      if (response.messageList && response.messageList.length > 0) {
        this.showErrorStatus(response.messageList[0].message);
      } else {
        this.showSuccessStatus("g.completed.successfully");
      }

    }, (error => {

      this.showErrorStatus(error);

    })
    );
    //once sucessfully sent clear the screen

  }

  addShipments() {
    console.log((<NgcFormArray>this.tsmmanualpush.get("shipments")).length);
    if ((<NgcFormArray>this.tsmmanualpush.get("shipments")).length > 4) {
      this.showInfoStatus("export.max.no.of.rows.exceeded");
      return;
    }
    (<NgcFormArray>this.tsmmanualpush.get("shipments")).addValue([
      {
        partSuffx: "",
        shipmentNumber: "",
        flightKey: "",
        flightDate: ""
      }
    ]);
  }

  onDeleteShipment(event, sindex) {
    (<NgcFormArray>this.tsmmanualpush.get('shipments')).controls.forEach(
      (group: NgcFormGroup, index) => {
        if (index === sindex) {
          group.markAsDeleted();
        }
      }
    );
  }

}
