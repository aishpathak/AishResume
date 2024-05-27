import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey, CellsRendererStyle } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';

import { ImportService } from '../import.service';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationFeatures } from '../../common/applicationfeatures';
import { CellsStyleClass } from '../../../shared/shared.data';



@Component({
  selector: 'app-pomonitoring',
  templateUrl: './pomonitoring.component.html',
  styleUrls: ['./pomonitoring.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class PomonitoringComponent extends NgcPage implements OnInit {
  showTable = false;
  showIcon = false
  @ViewChild('cancelPO') cancelPO: NgcWindowComponent;

  OTA = [
    'LANDSIDE'
  ]
  PO = [
    'Pending',
    'In Progress',
    'Completed',
    'Cancelled',
    'Interrupted'
  ]
  subMessageParameter: {}
  terminalValue: any;
  shipmentType1: any = "AWB";
  hawbSourceParameters: {};
  handledByMasterHouse: boolean;
  hawbHandling: boolean;
  daysDiff: Number;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private importService: ImportService,
    private router: Router, private activatedRoute: ActivatedRoute) { super(appZone, appElement, appContainerElement); }


  private pomonitoring: NgcFormGroup = new NgcFormGroup({
    terminalDisplay: new NgcFormControl(),
    handlingSector: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    requestedFrom: new NgcFormControl(),
    requestedTo: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),
    consigneeName: new NgcFormControl(),
    appointedAgent: new NgcFormControl(),
    deliveryRequestOrderNo: new NgcFormControl(),
    poStatus: new NgcFormControl(),
    customerId: new NgcFormControl(),
    airlineCustomerId: new NgcFormControl(),
    shipmentType: new NgcFormControl(),
    shipmentId: new NgcFormControl(),
    checkForDelivery: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),


    shipmentArray: new NgcFormArray([


    ]),
    cancelPo: new NgcFormGroup(
      {
        deliveryRequestOrderNo: new NgcFormControl(),
        shipmentNumber: new NgcFormControl(),
        cancellationReason: new NgcFormControl('', Validators.required),
        deliveryRequestId: new NgcFormControl(),
        id: new NgcFormControl(),
        customerId: new NgcFormControl(),
        airlineCustomerId: new NgcFormControl(),
        handlingSector: new NgcFormControl(),
        shipmentId: new NgcFormControl(),
        checkForDelivery: new NgcFormControl(),
        poStatus: new NgcFormControl(),
        source: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        shipmentHouseId: new NgcFormControl()
      }
    )
    //     movements:new NgcFormArray([
    //        new NgcFormGroup({
    //           shipmentLocation: new NgcFormControl(),
    //           pieces: new NgcFormControl(),
    //           warehouseLocation: new NgcFormControl(),
    //           targetLocation: new NgcFormControl(),
    //           status:new NgcFormControl(),
    //            startedOn:new NgcFormControl(),
    //            completedOn:new NgcFormControl()


    //  })
    //     ])



  });

  ngOnInit() {
    var transferData = this.getNavigateData(this.activatedRoute);
    // console.log("transferData", transferData.awbNumber)
    if (transferData != null) {
      this.pomonitoring.get('shipmentNumber').patchValue(transferData.shipmentNumber);

      //this.maintainFWBForm.get(['maintainFWBSearch', 'awbDate']).patchValue(transferData.awbDate);

      this.onSearch();
    } else {
      this.shipmentType1 = "AWB"
    }

  }


  onSearch() {
    this.resetFormMessages();
    if (this.pomonitoring.controls.hawbNumber.invalid) {
      return;
    }
    let request = this.pomonitoring.getRawValue();
    request.terminalDisplay = this.terminalValue;
    if (request.shipmentNumber == null && request.requestedFrom == null) {
      this.showErrorStatus("imp.err113")
      this.showTable = false
      return
    }
    var dif = NgcUtility.dateDifference(request.requestedTo, request.requestedFrom);
    this.daysDiff = dif / (1000 * 60 * 60 * 24);

    if (this.daysDiff > 7) {
      this.showErrorStatus('delivery.date.range.cannot.more.than.7days');
      return;
    }
    this.importService.getPoMonitoring(request).subscribe(response => {
      const resp = response.data;

      if (resp == null) {
        this.showErrorStatus("no.record.found")
        this.showTable = false
      }

      else {
        if (resp) {

          resp.forEach(element => {


          })

          resp.forEach(element => {
            element.prioritySequence = null;

            console.log(element);
          });
          this.pomonitoring.get('shipmentArray').patchValue(resp);
          console.log(this.pomonitoring.get('shipmentArray'));
          this.showTable = true;
          // if (resp.damaged === false) {
          //   this.pomonitoring.get('damaged').setValue('N');
          // }
          // else {
          //   this.pomonitoring.get('damaged').setValue('Y');
          // }

        }
        else {
          this.showTable = false;
        }

        if (resp.length === 1000 || resp.length > 1000) {
          this.showErrorStatus('delivery.search.note')
        } else {
          this.refreshFormMessages(response);
        }
      }

    });
  }

  cancelPo(index, subIndex) {


    const shipmentGroup: NgcFormGroup = this.pomonitoring.get(['shipmentArray', index]) as NgcFormGroup;
    const movementGroup: NgcFormGroup = this.pomonitoring.get(['shipmentArray', index, 'movements', subIndex]) as NgcFormGroup;
    console.log(movementGroup)
    if (shipmentGroup.get('cancellationReason').value != null && shipmentGroup.get('cancellationReason').value != '') {
      this.showErrorMessage(shipmentGroup.get('deliveryRequestOrderNo').value + "  is already cancelled,hence cannot Cancel.");
      return;
    }

    this.showConfirmMessage('want.to.cancel.po').then(fulfilled => {
      this.cancelPO.open();
      this.pomonitoring.get("cancelPo.deliveryRequestOrderNo").setValue(shipmentGroup.get('deliveryRequestOrderNo').value);
      this.pomonitoring.get("cancelPo.shipmentNumber").setValue(shipmentGroup.get('shipmentNumber').value);
      this.pomonitoring.get("cancelPo.deliveryRequestId").setValue(shipmentGroup.get('deliveryRequestId').value);
      this.pomonitoring.get("cancelPo.id").setValue(movementGroup.get('id').value)
      this.pomonitoring.get("cancelPo.customerId").setValue(shipmentGroup.get('customerId').value)
      this.pomonitoring.get("cancelPo.shipmentId").setValue(shipmentGroup.get('shipmentId').value)
      this.pomonitoring.get("cancelPo.handlingSector").setValue(shipmentGroup.get('handlingSector').value)
      this.pomonitoring.get("cancelPo.checkForDelivery").setValue(shipmentGroup.get('checkForDelivery').value)
      this.pomonitoring.get("cancelPo.poStatus").setValue("CANCELLED")
      this.pomonitoring.get("cancelPo.source").setValue(shipmentGroup.get('poStatus').value)
      this.pomonitoring.get("cancelPo.hawbNumber").setValue(shipmentGroup.get('hawbNumber').value);
      this.pomonitoring.get("cancelPo.shipmentHouseId").setValue(shipmentGroup.get('shipmentHouseId').value);


    }
    ).catch(reason => {
    });
  }

  // public elapsedFrom1SRFCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
  //   // if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_UldCheckInToStorageConfirmationRequired)) {
  //   let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
  //   console.log(rowData);

  //   if (rowData.shipmentArray.elapsedFrom1SRFScan > rowData.shipmentArray.requestedOn) {

  //     cellsStyle.className = CellsStyleClass.CRITICAL_RED;
  //   }

  //   return cellsStyle;
  //   // }


  // };

  cancelWorkOrder(index, subIndex, workOrdeMovementRequestData) {
    this.showConfirmMessage('want.to.cancel.po').then(fulfilled => {
      this.importService.cancelWorkOrder(workOrdeMovementRequestData).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus('g.completed.successfully');
          this.onSearch();
          this.showTable = false;
        }

      }, error => {
        this.showErrorStatus(error);
      }
      );
    });
  }

  changePriority() {
    let request1 = (<NgcFormGroup>this.pomonitoring.get(['shipmentArray'])).getRawValue();
    console.log(this.pomonitoring.get('shipmentArray'))
    this.importService.changePriority(request1).subscribe(response => {
      //  const resp = response.data;
      //  if(resp)
      //  {
      //    this.showSuccessStatus('g.completed.successfully');
      //  this.onSearch()
      //  }
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');

        this.showTable = false;

      }
    }, error => {
      this.showErrorStatus(error);
    });


  }
  private onShipmentSelect(event) {
    if (event.shipmentType) {
      this.pomonitoring.get('shipmentType').patchValue(event.shipmentType);
    }

    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {

      this.hawbSourceParameters = this.createSourceParameter(this.pomonitoring.get('shipmentNumber').value);
      this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
        if (data != null && data.length > 0) {
          this.handledByMasterHouse = true;
          this.retrieveLOVRecords("HWBNUMBER", this.hawbSourceParameters).subscribe(data => {
            if (data != null && data.length == 1) {
              console.log(data[0].code);
              console.log("hawbNumber");
              this.pomonitoring.get('hawbNumber').setValue(data[0].code);
            }
          })


          // this.pomonitoring.get('hawbnumber').setValidators([Validators.required, Validators.maxLength(16)]);
        } else {
          this.handledByMasterHouse = false;
        }
      },
      );
    }

  }
  forceComplete() {
    let request2 = (<NgcFormGroup>this.pomonitoring.get(['shipmentArray'])).getRawValue();

    this.importService.forceComplete(request2).subscribe(response => {
      //   const resp = response.data;
      //  if(resp)
      //    {
      //      this.showSuccessStatus('g.completed.successfully');
      //    this.onSearch()
      //   }
      // })

      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');

        this.showTable = false;

      }
    }, error => {
      this.showErrorStatus(error);
    });



  }
  interrupt() {
    let request3 = (<NgcFormGroup>this.pomonitoring.get(['shipmentArray'])).getRawValue();
    this.importService.interrupt(request3).subscribe(response => {

      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');

        this.showTable = false;

      }
    }, error => {
      this.showErrorStatus(error);
    });


  }
  resume() {
    let request4 = (<NgcFormGroup>this.pomonitoring.get(['shipmentArray'])).getRawValue();
    this.importService.resume(request4).subscribe(response => {
      const resp = response.data;
      if (resp) {
        this.showSuccessStatus('g.completed.successfully');
        this.onSearch()
      }
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');

        this.showTable = false;

      }
    }, error => {
      this.showErrorStatus(error);
    });


  }

  onCancels() {

    let request = (<NgcFormGroup>this.pomonitoring.get(['cancelPo'])).getRawValue();
    console.log(request)

    this.importService.cancelDeliveryRequest(request).subscribe(response => {
      // const resp = response.data;
      // this.onSearch()
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        //  this.pomonitoring.reset();
        this.showTable = false;
        this.cancelPO.close()
        this.onSearch()
      }
    }, error => {
      this.showErrorStatus(error);
    });

  }
  public onCancel(event) {

    this.navigateBack(this.pomonitoring.getRawValue());
  }
  onChange(event) {
    this.terminalValue = event.desc;
    this.subMessageParameter = this.createSourceParameter(this.pomonitoring.get('terminalDisplay').value);
  }
}
