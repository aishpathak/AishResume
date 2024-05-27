import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';
import {
  NgcApplication, PageConfiguration, NgcPage,
  NgcFormGroup, NgcFormArray, NgcFormControl, NgcReportComponent
} from 'ngc-framework';
import { NgcRegularReportComponent } from '../../../../billing/ngc-regular-report/ngc-regular-report.component';
import { RclserviceService } from '../rclservice.service';
@Component({
  selector: 'app-localtransfer',
  templateUrl: './localtransfer.component.html',
  styleUrls: ['./localtransfer.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class LocaltransferComponent extends NgcPage implements OnInit {

  constructor(appZone: NgZone
    , appElement: ElementRef
    , appContainerElement: ViewContainerRef, private rclservice: RclserviceService,
    appComponentResolver: ComponentFactoryResolver) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.localTransferFormGroup.get('internal').setValue(true);
    this.internalTerminalEnabled = false;
  }
  public onCancel(event) {
    this.navigateBack(this.localTransferFormGroup.getRawValue);
  }
  internalTerminalEnabled: boolean = false;
  searchResult = false;
  localTransferFormGroup: NgcFormGroup = new NgcFormGroup
    ({
      transferCarrier: new NgcFormControl(),
      receiveCarrier: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(),
      internal: new NgcFormControl(true),
      interTerminal: new NgcFormControl(false),
      uldNumber: new NgcFormControl(),
      transferData: new NgcFormArray([
      ]),
      remark: new NgcFormControl()
    });


  //for terminal change internal and interterminal
  changeterminal(event) {
    this.searchResult = false;
    this.localTransferFormGroup.get('transferData').patchValue([]);
    if (event === 'internal') {
      this.internalTerminalEnabled = false;
    }
    else {
      this.internalTerminalEnabled = true;
    }

  }

  onSearch() {
    this.resetFormMessages();
    //todo how to do translation for error messages
    if (!(this.localTransferFormGroup.get('transferCarrier').value && this.localTransferFormGroup.get('receiveCarrier').value)) {
      this.showErrorMessage('exp.transfer.carrier.code.and.receiver.carrier.code.is.mandatory');

      return;
    }
    if (this.localTransferFormGroup.get('shipmentNumber').value && this.localTransferFormGroup.get('uldNumber').value) {
      this.showErrorMessage('export.awb.uld.mandatory');
      return;
    }
    const requestObject = this.localTransferFormGroup.getRawValue();
    if (this.localTransferFormGroup.get('internal').value === true) {
      this.internalTerminalEnabled = false;
      this.rclservice.getLocalTransferListInternal(requestObject).subscribe(data => {
        if (this.showResponseErrorMessages(data)) {
          return;
        }
        if (data.data.length >= 1) {
          this.searchResult = true;
          data.data.forEach(ele => {
            ele.sel = false;
          })
          this.localTransferFormGroup.get('transferData').patchValue(data.data);
        }
        else {
          this.searchResult = false;
          this.showErrorMessage('billing.error.no.record.found');
          return
        }
      })
    }

    else if (this.localTransferFormGroup.get('interTerminal').value === true) {
      this.internalTerminalEnabled = true;
      this.searchResult = true;
      this.rclservice.getLocalTransferListInternal(requestObject).subscribe(data => {
        if (this.showResponseErrorMessages(data)) {
          return;
        }
        if (data.data.length >= 1) {
          this.searchResult = true;
          data.data.forEach(ele => {
            ele.sel = false;

            if (ele.transferPieces == null) {
              ele.transferPieces = 0;
            }
            if (ele.transferWeight == null) {
              ele.transferWeight = 0.00;
            }
          })
          this.searchResult = true;
          this.localTransferFormGroup.get('transferData').patchValue(data.data);
        }
        else {
          this.searchResult = false;
          this.showErrorMessage('billing.error.no.record.found');
          return
        }

      })

    }
  }
  onSave() {
    this.resetFormMessages();
    let obj = (this.localTransferFormGroup.get(['transferData']) as NgcFormArray).getRawValue().filter(obj => obj.sel === true);
    const saveobj = this.localTransferFormGroup.getRawValue();
    saveobj.transferData = obj;


    if (saveobj.transferData.length == 0) {
      this.showErrorMessage('selectAtleastOneRecord');
      return;
    }

    if (this.localTransferFormGroup.get('interTerminal').value == true) {
      for (const eachrow of saveobj.transferData) {
        if (eachrow.locationPieces < eachrow.transferPieces || eachrow.locationWeight < eachrow.transferWeight) {
          this.showErrorMessage('exp.Location.Piece.and.Weight.should.be.greater.than.Transfer.piece.and.Weight');
          return;
        }


        if ((eachrow.transferPieces == 0 && eachrow.transferWeight == 0.00)) {
          this.showErrorMessage('exp.Please.enter.the.value.in.Transfer.piece.and.Transfer.weight')
          return;
        }
      }
    }
    this.rclservice.getLocalTransferSaveInterTerminal(saveobj).subscribe(data => {

      if (data.success === true) {
        this.showSuccessStatus("status.Success");
        this.onSearch();
      }
    })

  }

  //for capture the transfer weight
  onTransferPieceChange(event, group, index) {
    let locationpieces = this.localTransferFormGroup.get(['transferData', group]).get('locationPieces').value;
    let locationWeight = this.localTransferFormGroup.get(['transferData', group]).get('locationWeight').value;
    let transferWeightCal = (locationWeight / locationpieces) * event;
    this.localTransferFormGroup.get(['transferData', group]).get('transferWeight').setValue(transferWeightCal)

  }

}


