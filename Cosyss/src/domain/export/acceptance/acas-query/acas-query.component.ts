import { ACASRequest, ByPassRequest, PsnMessageForm } from './../../export.sharedmodel';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive } from '@angular/core';

import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  ReactiveModel, PageConfiguration, NgcWindowComponent
} from 'ngc-framework';

import { AcceptanceService } from '../acceptance.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-acas-query',
  templateUrl: './acas-query.component.html',
  styleUrls: ['./acas-query.component.css']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class AcasQueryComponent extends NgcPage {

  @ReactiveModel(ACASRequest)
  public acasQueryForm: NgcFormGroup;
  @ReactiveModel(ByPassRequest)
  public byPassRequestForm: NgcFormGroup;
  @ReactiveModel(PsnMessageForm)
  public psnHistoryForm: NgcFormGroup;
  data: any;
  byPassButton: boolean = false;
  undoByPassBUtton: boolean = false;
  @ViewChild('psnHistoryWindow') psnHistoryWindow: NgcWindowComponent;
  @ViewChild('bypassRequestForm') bypassRequestForm: NgcWindowComponent;
  getTransferredData: any;


  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private acceptanceService: AcceptanceService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  onSearch() {
    const request: ACASRequest = this.acasQueryForm.getRawValue();
    request.shipmentList = null;
    this.acceptanceService.fetchACASShipments(request).subscribe(data => {
      this.refreshFormMessages(data);
      this.data = data.data;
      this.data = data.data === null ? [] : data.data;
      this.data.forEach(element => {
        element.select = false;
      });
      this.acasQueryForm.get('shipmentList').patchValue(this.data);
    },
      error => {
        this.showErrorStatus(error);
      });
  }

  onByPass() {
    this.byPassRequestForm.reset();
    let selected = this.acasQueryForm.get(["shipmentList"]).
      value.filter((element) => element.select == true);
    if (selected.length > 0) {
      this.byPassButton = true;
      this.undoByPassBUtton = false;
      this.bypassRequestForm.open();
    }
    else {
      this.showErrorMessage("select.atleast.one.shipment");
    }

  }

  onUndoByPass() {
    this.byPassRequestForm.reset();
    let selected = this.acasQueryForm.get(["shipmentList"]).
      value.filter((element) => element.select == true);
    if (selected.length > 0) {
      this.byPassButton = false;
      this.undoByPassBUtton = true;
      this.bypassRequestForm.open();
    }
    else {
      this.showErrorMessage("select.atleast.one.shipment");
    }
  }
  ngOnInit() {
    this.initialise();
  }
  initialise() {
    this.getTransferredData = this.getNavigateData(this.activatedRoute);
    if (this.getTransferredData) {
      this.acasQueryForm.get('shipmentNumber').patchValue(this.getTransferredData);
      this.onSearch();
    }

  }

  byPassShipment() {
    this.byPassRequestForm.validate();
    if (!this.byPassRequestForm.invalid) {
      const request = new ByPassRequest();
      let selected = this.acasQueryForm.get(["shipmentList"]).
        value.filter((element) => element.select == true);
      request.shipmentList = selected;
      request.remarks = this.byPassRequestForm.get('remarks').value;
      request.userLoginCode = this.getUserProfile().userLoginCode;
      request.password = this.byPassRequestForm.get('password').value;
      this.acceptanceService.byPassACASShipments(request).subscribe(data => {
        this.refreshFormMessages(data);
        if (data.messageList === null || data.messageList.length === 0) {
          this.bypassRequestForm.close();
          this.onSearch();
        }
      });
    }
  }
  undoByPassShipment() {
    this.byPassRequestForm.validate();
    if (!this.byPassRequestForm.invalid) {
      let selected = this.acasQueryForm.get(["shipmentList"]).
        value.filter((element) => element.select == true);
      if (selected.length !== 1) {
        this.showErrorMessage("expaccpt.select.max.one.shipment");
      }
      else {
        const request = new ByPassRequest();
        request.shipmentList = selected;
        request.remarks = this.byPassRequestForm.get('remarks').value;
        request.userLoginCode = this.getUserProfile().userLoginCode;
        request.password = this.byPassRequestForm.get('password').value;
        this.acceptanceService.undoByPassACASShipment(request).subscribe(data => {
          this.refreshFormMessages(data);
          if (data.messageList === null || data.messageList.length === 0) {
            this.bypassRequestForm.close();
            this.onSearch();
          }
        },
          error => {
            this.showErrorStatus(error);
          });
      }
    }
  }



  onScreening() {
    let selected = this.acasQueryForm.get(["shipmentList"]).
      value.filter((element) => element.select == true);
    if (selected.length > 0) {
      const request = new ByPassRequest();
      request.shipmentList = selected;
      // request.remarks = this.byPassRequestForm.get('remarks').value;
      // request.userLoginCode = this.getUserProfile().userLoginCode;
      // request.password = this.byPassRequestForm.get('password').value;
      this.acceptanceService.sendForScreening(request).subscribe(data => {
        this.refreshFormMessages(data);
        if (data.messageList === null || data.messageList.length === 0) {
          // this.bypassRequestForm.close();
          this.onSearch();
        }
      },
        error => {
          this.showErrorStatus(error);
        });
    } else {
      this.showErrorMessage("select.atleast.one.shipment");
    }
  }

  onCancel() {
    if (this.acasQueryForm.get('shipmentNumber').value) {
      let shipmentNumber = this.acasQueryForm.get('shipmentNumber').value;
      this.navigateTo(this.router, '/export/acceptance/managecargoacceptance', shipmentNumber);
    } else {
      this.navigateTo(this.router, '/export/acceptance/managecargoacceptance', null);
    }
  }

  onPSNHistory(){
    const request = (<NgcFormArray>this.acasQueryForm.get(['shipmentList'])).getRawValue();    
    let count = 0;
    let selectedIndex = 0;
    for(let i = 0; i < request.length; i++) {      
      if(request[i].select) {
        count++;
        selectedIndex = i;
      }
    }
    if(count > 1) {
      this.showErrorMessage("expaccpt.select.only.one.record");
      return;
    } else if (count == 0) {
      this.showErrorMessage("expaccpt.select.least.one.record");
      return;
    }        
    this.acceptanceService.onPSNHistory(request[selectedIndex]).subscribe(respose => {
      (<NgcFormArray>this.psnHistoryForm.get(['psnMessageLogSummary'])).patchValue(respose.data);
      this.psnHistoryWindow.open();
    });
  }

onPsnHistoryWindowClose() {
      this.psnHistoryWindow.close();
}
}
