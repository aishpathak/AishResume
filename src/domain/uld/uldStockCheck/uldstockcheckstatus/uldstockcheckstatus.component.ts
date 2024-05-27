import { UldStockStatusRequest } from './../../uld.shared';
import { UldService } from './../../uld.service';
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, PageConfiguration, NgcUtility } from 'ngc-framework';
@Component({
  selector: 'ngc-uldstockcheckstatus',
  templateUrl: './uldstockcheckstatus.component.html',
  styleUrls: ['./uldstockcheckstatus.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class UldstockcheckstatusComponent extends NgcPage {
  resp: any;
  tableFlag: any = false;
  selectUldName: any;

  // conditionTypelist: string[] = ['All', 'Arpon', 'Cargo'];
  private uldStockCheckForm: NgcFormGroup = new NgcFormGroup({
    carrier: new NgcFormControl(),
    heldBy: new NgcFormControl(),
    uldStocks: new NgcFormArray([
    ])
  });
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private router: Router,
    private uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() { }
  /* To Fetch Uld Stock Status Details
     input--> carrier and HeldBy(required)
     Returns-->List of  Stock Check current Status.
    */
  onSearch() {
    const uldStockStatusRequest: UldStockStatusRequest = new UldStockStatusRequest();
    uldStockStatusRequest.carrierCode = this.uldStockCheckForm.get('carrier').value;
    if (this.uldStockCheckForm.get('heldBy').value) {
      uldStockStatusRequest.apronCargoLocation = this.uldStockCheckForm.get('heldBy').value === 'All' ?
        null : this.uldStockCheckForm.get('heldBy').value[0];
    }
    if (uldStockStatusRequest.carrierCode) {
      this.uldService.uldStocksStatusFetch(uldStockStatusRequest).subscribe(data => {
        this.resp = data;
        this.resetFormMessages();
        if (this.resp.data === null) {
          this.showErrorStatus('uld.no.data.found');
        } else {
          if (this.resp.data.length) {
            this.resp.data.forEach(element => {
              element.uldStockCheckStartDate = element.uldStockCheckStartDate ?
                NgcUtility.toDateFromLocalDate(element.uldStockCheckStartDate) : element.uldStockCheckStartDate;
              element.uldStockCheckEndDate = element.uldStockCheckEndDate ?
                NgcUtility.toDateFromLocalDate(element.uldStockCheckEndDate) : element.uldStockCheckEndDate;
            });
            this.tableFlag = true;
            for (let obj of this.resp.data) {
              // obj.uldStockCheckStatusFlag = obj.uldStockCheckStatusFlag ?
              //   'Completed' : 'In Progress';
              if (obj.uldStockCheckStatus == '2') {
                obj.uldStockCheckStatus = 'Completed';
              } else if (obj.uldStockCheckStatus == '1') {
                obj.uldStockCheckStatus = 'In Progress';
              } else {
                obj.uldStockCheckStatus = '';
              }
              obj.apronCargoLocation = obj.apronCargoLocation === 'C' ?
                'Cargo' : obj.apronCargoLocation === 'A' ? 'Apron' : obj.apronCargoLocation;
            }
            this.uldStockCheckForm.controls.uldStocks.patchValue(this.resp.data);
          } else {
            this.tableFlag = false;
            this.showSuccessStatus('uld.no.result.found.for.the.search.criteria');
          }
        }
      }, error => {
      });
    } else {
      this.showErrorStatus('uld.carrier.is.mandatory');
    }
  }

  /**
  * This Function Will populate LOV for carrier
  */
  public onSelectCarrier(object) {
    console.log(object);
    this.uldStockCheckForm.get('carrier').setValue(object.code);
  }

  onCancel(event) {
    this.navigateTo(this.router, '/', null);
  }
}
