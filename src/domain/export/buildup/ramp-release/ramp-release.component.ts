import { Validators } from '@angular/forms';
import {
  NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, NgcButtonComponent, NgcWindowComponent, PageConfiguration,
  CellsRendererStyle, NgcUtility
} from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, Directive, ChangeDetectorRef } from '@angular/core';
import { BuildupService } from './../buildup.service';
import { ManifestFlight, Flight, SeparateManifest } from '../../export.sharedmodel';
import { OffloadULD } from '../buildup.sharedmodel';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-ramp-release',
  templateUrl: './ramp-release.component.html',
  styleUrls: ['./ramp-release.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  // restorePageOnBack: false,
  // dontRestoreOnBrowserBack: false
  // autoBackNavigation: true

})
export class RampReleaseComponent extends NgcPage {
  // @ViewChild('releaseAndPrintWindow') releaseAndPrintWindow: NgcWindowComponent;

  @ViewChild('photoUploadPopUp') photoUploadPopUp: NgcWindowComponent;
  navigateToHomeFlag: boolean = false;
  disableChangeUldNumberMethod: boolean = true;
  transferData: any;
  fromUldDetails: boolean;
  navigatedDataUldFlightInfo: any;
  driverIdFlagUniversal = false;
  trolleyActivateFlag = false;
  driverIdFlag = false;
  responseArray: any;
  addReleaseButtonFlag = false;
  dataTableFlag = false;
  listOfTrolleyDetails = [];
  response: any;
  releaseButtonFlag: boolean = true;
  request: any;
  clearUldNoFlag: boolean = true;
  piecesRemarksDisplayFlag: boolean = false;
  ocsObj: any;
  handoverObj: any;
  manualReleaseCase: boolean = false;
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;
  blockNext: boolean = false;

  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });

  private rampReleaseform: NgcFormGroup = new NgcFormGroup({
    driverId: new NgcFormControl(),
    containertrolleynumber: new NgcFormControl('', [Validators.required, Validators.maxLength(11)]),
    uldNumberForPhoto: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    startedat: new NgcFormControl(),
    handCarry: new NgcFormControl(),
    ocs: new NgcFormControl(),
    bay: new NgcFormControl(),
    entityType: new NgcFormControl(),
    releaselocation: new NgcFormControl(),
    pieces: new NgcFormControl(),
    remarks: new NgcFormControl(),
    tripid: new NgcFormControl(),
    manualReleaseCase: new NgcFormControl(),
    handOverContainerTrolley: new NgcFormArray([])
  });
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private _buildupService: BuildupService, private activatedRoute: ActivatedRoute, private toRoute: Router, private cd: ChangeDetectorRef) {
    super(appZone, appElement, appContainerElement);
  }

  onNext() {
    
    if (this.rampReleaseform.get('driverId').value === '') {
      this.showErrorMessage('export.driver.id.is.empty');
      return;
    }
    //call service to check driver Id
    let request = this.rampReleaseform.getRawValue();
    this._buildupService.validateDriverIdForRampRelease(request).subscribe(response => {
      console.log("response ", response);
      if (this.showResponseErrorMessages(response)) {
        this.blockNext = true;
        this.showResponseErrorMessages(response);
      }
      else {
        this.driverIdFlag = true;
        this.driverIdFlagUniversal = true;
      }
    });

    // value changes for ocs
    this.selectOcs();
    // value changes for ocs
    this.selecthHandCarry();
  }

  // On Release details need to save 
  onRelease() {

    this.request = this.rampReleaseform.getRawValue();
    if (this.transferData == null || this.transferData == undefined) {
      this.request.fromRampReleaseScreen = true;
    }
    if (this.request.driverId == null) {
      this.showErrorMessage("export.enter.driver.id");
      return;
    }
    if (this.request.releaselocation == null) {
      this.showErrorMessage("export.enter.release.location");
      return;
    }

    this.request.handOverContainerTrolley.forEach(e => {
      if (e.concatShc != null)
        e.shc = e.concatShc.split(" ");
    })
    this.request.handOverContainerTrolley.forEach(e => {
      e.driverId = this.request.driverId;
    });

    this.windowPrinter.open();


  }

  printHandover() {
    this.windowPrinter.hide();
    if (this.popupPrinterForm.get("printerdropdown").value == null) {
      // this.showErrorStatus("expaccpt.select.printer.and.proceed");
    }
    else {
      this.request.printerName = this.popupPrinterForm.get("printerdropdown").value;

      this._buildupService.saveRampRelease(this.request).subscribe(data => {
        this.response = data;
        this.showResponseErrorMessages(data);
        if (this.response.success) {
          this.showSuccessStatus('export.released.successfully');
          this.showSuccessStatus("export.request.to.print.successfully");
          // this.releaseAndPrintWindow.hide();
          if (this.fromUldDetails) {
            this.navigateTo(this.toRoute, '/export/buildup/ulddetails', this.navigatedDataUldFlightInfo);

          }
          else {
            this.request = null;
            this.rampReleaseform.reset();
            (<NgcFormArray>this.rampReleaseform.get('handOverContainerTrolley')).resetValue([]);
            this.dataTableFlag = false;
            this.driverIdFlag = false;
            this.driverIdFlagUniversal = false;
            this.listOfTrolleyDetails = [];
          }
        }
      });
    }
  }

  // On add of the ULD/AWB/OCS in Ramp Release
  addReleaseRamp() {
    this.piecesRemarksDisplayFlag = true;
    if (this.rampReleaseform.get('releaselocation').value == null) {
      this.showErrorMessage("export.enter.release.location");
      if (!(this.rampReleaseform.get('ocs').value == true || this.rampReleaseform.get('handCarry').value == true)) {
        this.piecesRemarksDisplayFlag = false;
      }
      return;
    }
    if (this.rampReleaseform.get('ocs').value == true) {
      this.ocsObj.pieces = this.rampReleaseform.get('pieces').value;
      this.ocsObj.remarks = this.rampReleaseform.get('remarks').value;
      if (this.ocsObj.flightKey == null || this.ocsObj.date == null) {
        this.showErrorMessage("error.flight.details.mandatory");
        return;
      }
      this.listOfTrolleyDetails.push(this.ocsObj);
      this.ocsObj = null;

    }
    if (this.rampReleaseform.get('handCarry').value == true) {
      this.handoverObj.pieces = this.rampReleaseform.get('pieces').value;
      this.handoverObj.remarks = this.rampReleaseform.get('remarks').value;
      if (this.handoverObj.flightKey == null || this.handoverObj.date == null) {
        this.showErrorMessage("error.flight.details.mandatory");
        return;
      }
      this.listOfTrolleyDetails.push(this.handoverObj);
      this.handoverObj = null;

    }
    console.log("handoverObj", this.handoverObj);
    if (this.handoverObj) {
      // duplicate check
      let check = this.listOfTrolleyDetails.filter(t => t.containertrolleynumber == this.handoverObj.containertrolleynumber);
      if (check.length > 0) {
        this.showErrorMessage("export.uld.bt.already.added");
        return;
      }
    }
    if (this.rampReleaseform.get('manualReleaseCase').value == true) {
      if (this.rampReleaseform.get('flightKey').value == null || this.rampReleaseform.get('startedat').value == null) {
        this.piecesRemarksDisplayFlag = false;
        this.showErrorMessage("error.flight.details.mandatory");
        return;
      } else if (this.handoverObj && (this.handoverObj.flightKey == null ||
        this.handoverObj.date == null)) {
        this.handoverObj.flightKey = this.rampReleaseform.get('flightKey').value;
        this.handoverObj.date = this.rampReleaseform.get('startedat').value;
        this.handoverObj.remarks = this.rampReleaseform.get('remarks').value;
      }
      this.handoverObj.remarks = this.rampReleaseform.get('remarks').value;
      this.listOfTrolleyDetails.push(this.handoverObj);
      this.handoverObj = null;
    }
    this.dataTableFlag = true;
    let conCatenationOfString
    this.responseArray.handOverContainerTrolley.forEach(element => {
      if (element.shc != null)
        element.concatShc = element.shc.join(" ");
      element.bay = this.rampReleaseform.get('bay').value;
      element.remarks = this.rampReleaseform.get('remarks').value;
    })
    if (!(this.rampReleaseform.get('ocs').value == true || this.rampReleaseform.get('handCarry').value == true || this.rampReleaseform.get('manualReleaseCase').value == true)) {
      for (let i = 0; i < this.responseArray.handOverContainerTrolley.length; i++) {
        for (let j = 0; j < this.listOfTrolleyDetails.length; j++) {
          if (this.listOfTrolleyDetails[j].containertrolleynumber == this.responseArray.handOverContainerTrolley[i].containertrolleynumber) {
            this.showErrorMessage("export.uld.bt.already.added");
            this.piecesRemarksDisplayFlag = false;
            return;
          }
        }
        this.listOfTrolleyDetails.push(this.responseArray.handOverContainerTrolley[i]);
      }

    }
    // this.listOfTrolleyDetails.forEach(e1 => {
    //   // e1.handCarry = e1.handyCarry ? 'Y' : 'N';
    //   e1.handCarry = this.rampReleaseform.get('handCarry').value ? 'Y' : 'N';
    // });
    this.rampReleaseform.get('handOverContainerTrolley').patchValue(this.listOfTrolleyDetails);
    this.addReleaseButtonFlag = false;
    this.releaseButtonFlag = false;
    this.rampReleaseform.get('uldNumberForPhoto').setValue(this.rampReleaseform.get('containertrolleynumber').value);
    this.rampReleaseform.get('containertrolleynumber').reset();
    this.rampReleaseform.get('flightKey').reset();
    this.rampReleaseform.get('startedat').reset();
    this.rampReleaseform.get('bay').reset();
    this.rampReleaseform.get('pieces').reset();
    this.rampReleaseform.get('remarks').reset();
    this.rampReleaseform.get('ocs').reset();
    this.rampReleaseform.get('handCarry').reset();
    this.piecesRemarksDisplayFlag = false;
    this.manualReleaseCase = false;
    this.rampReleaseform.get('manualReleaseCase').setValue(false);
  }

  // On change of ULD/AWB/OCS 
  onChangeTrolleyNumber(event) {
    if (this.disableChangeUldNumberMethod) {
      let request = this.rampReleaseform.getRawValue();
      if (this.rampReleaseform.get('containertrolleynumber').value == null && request.handOverContainerTrolley.length < 1) {
        this.releaseButtonFlag = true;
      }
      // request.handOverContainerTrolley.forEach(e => {
      //   e.handCarry = e.handCarry === 'N' ? false : true;
      // });
      if (!event) {
        return;
      }
      request.containertrolleynumber = event;
      this._buildupService.fetchRampRelease(request).subscribe(data => {
        this.responseArray = null;
        console.log("trollyData", data);
        this.refreshFormMessages(data);
        if (!data.data && !data.messageList) {
          this.showErrorMessage('export.uld.does.not.exist.in.dls');
          return;
        }
        if (data.data == null || request.handOverContainerTrolley.length < 1) {
          this.releaseButtonFlag = true;
        }
        else {
          this.releaseButtonFlag = false;
        }
        if (data.data.flightCompletedFlag && data.data.manualReleaseCase) {
          this.responseArray = data.data;
          this.manualReleaseCase = true;
          this.addReleaseButtonFlag = true;
          this.rampReleaseform.get('manualReleaseCase').setValue(true);
          this.cd.detectChanges();
        }
        /* Check for Flight Complet */
        else if (data.data.flightCompletedFlag) {
          this.showConfirmMessage('export.flight.departed.confirmation').then(fulfilled => {
            this.responseArray = data.data;
            this.rampReleaseform.get('flightKey').setValue(this.responseArray.flightKey);
            this.rampReleaseform.get('startedat').setValue(this.responseArray.startedat);
            this.rampReleaseform.get('bay').setValue(this.responseArray.bay);
            this.rampReleaseform.get('tripid').setValue(this.responseArray.tripid);
            this.addReleaseButtonFlag = true;
          }
          ).catch(reason => {
            this.addReleaseButtonFlag = false;
            return;
          });
        }
        else if (data.data.manualReleaseCase) {
          this.showConfirmMessage('export.uld.bt.not.assigned.confirmation').then(fulfilled => {
            this.responseArray = data.data;
            this.manualReleaseCase = true;
            this.addReleaseButtonFlag = true;
            this.rampReleaseform.get('manualReleaseCase').setValue(true);
            this.cd.detectChanges();
          }
          ).catch(reason => {
            this.manualReleaseCase = false;
            this.addReleaseButtonFlag = false;
            return;
          });
        }
        else {
          this.responseArray = data.data;
          this.rampReleaseform.get('flightKey').setValue(this.responseArray.flightKey);
          this.rampReleaseform.get('startedat').setValue(this.responseArray.startedat);
          this.rampReleaseform.get('bay').setValue(this.responseArray.bay);
          this.rampReleaseform.get('tripid').setValue(this.responseArray.tripid);
          this.addReleaseButtonFlag = true;
        }
        this.rampReleaseform.get('uldNumberForPhoto').setValue(this.rampReleaseform.get('containertrolleynumber').value);
      }, error => {
        this.showErrorMessage('g.not.able.to.connect');
        return;
      });
    }

  }

  // photoUploadPopUp
  uploadPhoto() {
    console.log("uldNumber", this.rampReleaseform.get('containertrolleynumber').value);
    this.photoUploadPopUp.open();
  }

  onDeleteAddedTrolley(index) {

    this.listOfTrolleyDetails.splice(index.record.NGC_ROW_ID, 1);
    let objToDelete = (<NgcFormGroup>this.rampReleaseform.get(['handOverContainerTrolley', index.record.NGC_ROW_ID])).value;
    (<NgcFormArray>this.rampReleaseform.controls['handOverContainerTrolley']).deleteValueAt(index.record.NGC_ROW_ID);
    // (<NgcFormArray>this.rampReleaseform.get('handOverContainerTrolley')).markAsDeletedAt(index.record.NGC_ROW_ID);
    let rampObj = this.rampReleaseform.getRawValue();
    if (rampObj.handOverContainerTrolley.length < 1) {
      this.releaseButtonFlag = true;
    }
    let obj = this.rampReleaseform.getRawValue();
    obj.uldToDelete = objToDelete;
    obj.uldToDelete.handCarry = false;
    obj.handOverContainerTrolley.forEach(t => t.handCarry = false);
    this._buildupService.deleteRampReleaseUlds(obj).subscribe(response => {
      if (!this.showResponseErrorMessages(response.data)) {
        this.showSuccessStatus("g.deleted.successfully");
      } else {
        this.showResponseErrorMessages(response);
      }
    })
  }

  //for groupRelease
  ngOnInit() {

    let terminalId = this.getUserProfile().terminalId;
    console.log("terminalId", terminalId);
    this.rampReleaseform.get('releaselocation').setValue(terminalId);
    let transferData = this.getNavigateData(this.activatedRoute);
    console.log("transferred data ", transferData);
    if (transferData != null) {
      this.rampReleaseform.reset();
      this.driverIdFlag = true;
      this.transferData = transferData;
      if (this.transferData.fromUldDetails != undefined || this.transferData.fromUldDetails != null) {
        this.fromUldDetails = transferData.fromUldDetails;
        this.navigatedDataUldFlightInfo = transferData.navigatedDataUldFlightInfo;
      }

      this.rampReleaseform.get('flightKey').setValue(transferData.flight);
      this.rampReleaseform.get('startedat').setValue(transferData.flightDate);
      this.rampReleaseform.get('bay').setValue(transferData.bay);
      this.rampReleaseform.get('tripid').setValue(transferData.tripId);
      transferData.releasedTrolleyList.map(i => console.log(i));
      let modifiedArray = transferData.releasedTrolleyList.map(i => {
        console.log(i);
        let modifiedObject = {
          containerTrolleyNumber: i.containerTrolleyNumber,
          destination: i.destination,
          dlsUldTrolleyId: i.dlsuldTrolleyId,
          handCarry: false,
          flightKey: transferData.flight,
          date: transferData.flightDate,
          containertrolleynumber: i.containerTrolleyNumber,
          handlingArea: i.handlingArea,
          concatShc: i.shc,
          std: transferData.std,
          entityType: 'ULD',
          etd: transferData.etd,
          showDateFlag: transferData.showDateFlag
        };
        return modifiedObject;
      });
      (<NgcFormArray>this.rampReleaseform.controls['handOverContainerTrolley']).resetValue([]);
      this.rampReleaseform.get('handOverContainerTrolley').patchValue(modifiedArray);
      this.dataTableFlag = true;
      this.driverIdFlagUniversal = false;
      this.trolleyActivateFlag = true;
      this.disableChangeUldNumberMethod = false;
      this.releaseButtonFlag = false;

      // valuechanges for DriverID
      this.rampReleaseform.get('driverId').valueChanges.subscribe(response => {
        console.log("driverId", response);
        if (response != null || response != undefined) {
          let request: any = {};
          request.driverId = response;
          //call service to check driver Id
          //let request = this.rampReleaseform.getRawValue();
          //request.tripid = null;
          //console.log("request", request);
          this._buildupService.validateDriverIdForRampRelease(request).subscribe(response => {
            console.log("response ", response);
            if (this.showResponseErrorMessages(response)) {
              this.showResponseErrorMessages(response);
              this.releaseButtonFlag = true;
            }
            else {
              this.releaseButtonFlag = false;
            }

          });
        }
      });
    } else {
      this.navigateToHomeFlag = true;
    }

  }
  selectOcs() {
    this.rampReleaseform.get('ocs').valueChanges.subscribe(response => {
      if (response) {
        this.rampReleaseform.get('containertrolleynumber').setValue('OCS');
        this.piecesRemarksDisplayFlag = true;
      }
    });
  }
  selecthHandCarry() {
    this.rampReleaseform.get('handCarry').valueChanges.subscribe(response => {
      if (response) {
        this.rampReleaseform.get('containertrolleynumber').setValue('handCarry');
        this.piecesRemarksDisplayFlag = true;
      }
    });
  }
  onBack(event) {
    if (!this.navigateToHomeFlag) {
      let navigateObj = {
        flightKey: this.transferData.flight,
        flightDate: this.transferData.flightDate,
        terminals: this.transferData.handlingArea,
        terminalFromNavigate: this.transferData.terminalFromNavigate,
        fromDate: this.transferData.fromDate,
        toDate: this.transferData.toDate,
        fromDateTime: this.transferData.fromDate,
        toDateTime: this.transferData.toDate,
        navigatedDataFromFlightList: this.transferData.navigatedDataFromFlightList
      };
      this.navigateTo(this.toRoute, "export/buildup/ulddetails", navigateObj);
    }
    else {
      this.navigateTo(this.toRoute, "**", {});
    }
  }
  onClosePopUp($event) {
    this.photoUploadPopUp.close();
  }
  public etdDateCellsStyleRenderer = (row: number, column: string, value: any, rowData: any): CellsRendererStyle => {
    let cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    if (rowData.showDateFlag == 'false' || rowData.showDateFlag == false) {
      cellsStyle.data = NgcUtility.getTimeAsString(NgcUtility.getDateTime(rowData.etd))
    }
    else {
      cellsStyle.data = NgcUtility.getDateTimeAsString(rowData.etd);
    }
    //
    return cellsStyle;
  }
  getFlightDetails(event) {
    if (event != null) {
      this.addReleaseButtonFlag = true;
      let rampObj = this.rampReleaseform.getRawValue();
      if (rampObj.flightKey && rampObj.startedat) {


        let offload = new OffloadULD();
        offload.uldNumber = rampObj.containertrolleynumber;
        offload.flightKey = rampObj.flightKey;
        offload.flightOriginDate = rampObj.startedat;
        offload.flagForGettingFlightDetails = true;
        offload.rampFlag = true;
        this._buildupService.searchFlight(offload).subscribe(response => {
          if (!this.showResponseErrorMessages(response)) {
            //this.rampReleaseform.get('flightKey').setValue(response.data.flightKey);
            this.rampReleaseform.get('bay').setValue(response.data.bay);
            this.rampReleaseform.get('tripid').setValue(response.data.tripid);
            if (rampObj.ocs === true) {
              let obj = {
                flightKey: response.data.flightKey,
                bay: response.data.bay,
                driverId: rampObj.driverId,
                handlingArea: this.getUserProfile().terminalId,
                date: response.data.flightDate,
                std: response.data.std,
                showDateFlag: response.data.showDateFlag,
                containertrolleynumber: 'OCS',
                etd: response.data.etd,
                pieces: rampObj.pieces,
                remarks: rampObj.remarks,
                ocs: true,
                entityType: 'ULD'
              }
              this.ocsObj = obj;
            }
            if (rampObj.handCarry === true) {
              let obj = {
                flightKey: response.data.flightKey,
                bay: response.data.bay,
                driverId: rampObj.driverId,
                handlingArea: this.getUserProfile().terminalId,
                date: response.data.flightDate,
                std: response.data.std,
                showDateFlag: response.data.showDateFlag,
                containertrolleynumber: 'HAND CARRY',
                etd: response.data.etd,
                pieces: rampObj.pieces,
                remarks: rampObj.remarks,
                handCarry: true,
                entityType: 'ULD'
              }
              this.handoverObj = obj;
            }
            if (rampObj.manualReleaseCase) {
              let obj = {
                flightKey: response.data.flightKey,
                bay: response.data.bay,
                driverId: rampObj.driverId,
                handlingArea: this.getUserProfile().terminalId,
                date: response.data.flightDate,
                std: response.data.std,
                showDateFlag: response.data.showDateFlag,
                containertrolleynumber: rampObj.containertrolleynumber,
                etd: response.data.etd,
                entityType: 'ULD',
                manualReleaseCase: true,
                destination: response.data.destination
              }
              this.handoverObj = obj;
              this.handoverObj.remarks = rampObj.remarks;
            }
            if (response.data.flightCompletedAt) {
              this.showMessage("export.entered.flight.departed");
              this.addReleaseButtonFlag = true;
            }
          }
          else {
            this.showResponseErrorMessages(response);
            this.addReleaseButtonFlag = false;
          }
        });
      }

    }
  }
}
