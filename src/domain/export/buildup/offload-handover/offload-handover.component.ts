import {
  OffloadULD, OffloadHandoverModel, OffloadWarehouseFlight,
  OffloadHandoverULD, OffloadHandoverFormULD
} from './../buildup.sharedmodel';
import { BuildupService } from './../buildup.service';
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcFormControl, NgcButtonComponent, NgcUtility, PageConfiguration, NgcWindowComponent
} from 'ngc-framework';
// Angular imports
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';

@Component({
  selector: 'ngc-offload-handover',
  templateUrl: './offload-handover.component.html',
  styleUrls: ['./offload-handover.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  // autoBackNavigation: true
})
export class OffloadHandoverComponent extends NgcPage implements OnInit {

  @ViewChild('returnButton') returnButton: NgcButtonComponent;
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;

  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });
  fromUldDetails: boolean = true;
  disableClear: boolean = false;
  navObj: any = null;
  FlightInfoFlag: boolean = true;
  offlaodFlag: boolean = false;
  resp: any;
  displayFlag = false;
  displayFlag2 = false;
  flightKey: any;
  flightDate: any;
  flightId: any;
  std: any;
  bay: any;
  etd: any;
  uldList: Array<OffloadHandoverFormULD> = [];
  reqContainer: OffloadHandoverModel;
  driverDisabler = false;
  addDisabler = false;
  uldChecker: any[] = [];
  checkForTrolley: boolean = false;
  toShow: boolean = false;
  noOfBagsDisplayFlag: boolean = false;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private buildUpService: BuildupService, private activatedRoute: ActivatedRoute, private toRoute: Router) {
    super(appZone, appElement, appContainerElement);
  }

  private offloadForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    driverId: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    handCarry: new NgcFormControl(),
    ocs: new NgcFormControl(),
    reason: new NgcFormControl(),
    noOfBags: new NgcFormControl(),
    tableList: new NgcFormArray([])
  });

  onNext() {
    const driverId = this.offloadForm.get('driverId').value;

    if (this.check(driverId)) {
      //this.displayFlag = true;
      this.onChangeULDNumber();
      this.driverDisabler = true;
      const tempReq: OffloadULD = new OffloadULD();
      tempReq.driverId = driverId;
    } else {
      this.showWarningStatus('export.driverid.special.characters.validation');
    }
    //validating driverId
    let request = new OffloadHandoverULD();
    request.driverId = driverId;
    this.buildUpService.validateDriverIDForOffloadHandOver(request).subscribe(response => {
      console.log("response", response);
      if (!this.showResponseErrorMessages(response)) {
        this.displayFlag = true;
      }
      else {
        this.displayFlag = false;
        this.showResponseErrorMessages(response);
        this.driverDisabler = false;

      }
    });
    this.selectOcsValueChanges();
    this.selecthandCarryValueChanges();
  }

  selectOcsValueChanges() {
    this.offloadForm.get('ocs').valueChanges.subscribe(data => {
      if (data != null || data != undefined) {
        if (data) {
          this.offloadForm.get('uldNumber').setValue('OCS');
          this.noOfBagsDisplayFlag = true;
          this.toShow = true;
        }
      }
    });
  }
  selecthandCarryValueChanges() {
    this.offloadForm.get('handCarry').valueChanges.subscribe(data => {
      if (data != null || data != undefined) {
        if (data) {
          this.offloadForm.get('uldNumber').setValue('HANDCARRY');
          this.noOfBagsDisplayFlag = true;
          this.toShow = true;
        }
      }
    });
  }
  onChangeULDNumber() {
  
    this.FlightInfoFlag = true;
    this.checkForTrolley = false;
    const uldRequest: OffloadULD = new OffloadULD();
    this.offloadForm.get('uldNumber').valueChanges.subscribe((value) => {
      if (this.offloadForm.get('uldNumber').value !== null && this.offloadForm.get('uldNumber').value !== '' &&
        this.offloadForm.get('uldNumber').value !== 'OCS' && this.offloadForm.get('uldNumber').value !== 'HANDCARRY') {
        let btChar = this.offloadForm.get('uldNumber').value.substring(0, 2).toUpperCase();
          if (btChar === 'BT' || btChar === 'MT') {
            let num = this.offloadForm.get('uldNumber').value.substring(2, 6);
            if (num.length < 4) {
              let maskedUld = btChar + ("0000" + num).slice(-4);
              this.offloadForm.get('uldNumber').setValue(maskedUld, { onlySelf: true, emitEvent: false });
            }
        }

        const tempStore = this.offloadForm.get('uldNumber').value;
        uldRequest.uldNumber = this.offloadForm.get('uldNumber').value;
        //setting from offloadHandover
        uldRequest.fromOffloadHandover = true;
        this.buildUpService.searchFlight(uldRequest).subscribe((data) => {
          this.resp = data.data;
          if (this.showFormErrorMessages(data)) {
            this.showFormErrorMessages(data);
            this.addDisabler = true;
            return;
          }

          console.log(data);
          if (data.success) {
            this.toShow = true;
            console.log(this.resp);
            this.checkForTrolley = this.resp.checkForTrolley;
            if (this.checkForTrolley) {
              this.offloadForm.get('flightKey').setValue(null);
              this.offloadForm.get('flightDate').patchValue(null);
            }
            else {
              this.offloadForm.get('flightKey').setValue(this.resp.flightKey);
              this.offloadForm.get('flightDate').patchValue(this.resp.flightDate);
              this.FlightInfoFlag = false;
            }

            this.flightKey = this.resp.flightKey;
            this.flightDate = this.resp.flightDate;
            this.flightId = this.resp.flightId;
            this.std = this.resp.std;
            this.etd = this.resp.etd;
            this.bay = this.resp.bay;
            this.offloadForm.get('handCarry').setValue(false);
            this.offloadForm.get('reason').setValue(null);
            this.addDisabler = this.checkForDuplicate(this.offloadForm.get('uldNumber').value);
            if (this.addDisabler) {
              this.showWarningStatus('export.duplicate.uld.not.allowed');
            }
            if (!(data.success)) {
              this.addDisabler = true;
            } else {
              this.addDisabler = false;
            }
            console.log(this.resp);
          } else {
            if (data.messageList.length > 0) {
              this.offloadForm.get('flightKey').setValue(' ');
              this.offloadForm.get('flightDate').patchValue(' ');
              this.offloadForm.get('handCarry').setValue(false);
              this.offloadForm.get('reason').setValue(' ');
              this.addDisabler = true;
            } else {
              this.offloadForm.get('flightKey').setValue(' ');
              this.offloadForm.get('flightDate').patchValue(' ');
              this.offloadForm.get('handCarry').setValue(false);
              this.offloadForm.get('reason').setValue(' ');
              this.showInfoStatus('export.no.flight.assigned.for.uld');
              this.addDisabler = true;
            }
          }
        });
      }
    });
  }

  onAdd() {
    console.log("inside add ");
    if (this.offloadForm.valid) {
      const uldReq: OffloadULD = new OffloadULD();
      uldReq.uldNumber = this.offloadForm.get('uldNumber').value;
      if (uldReq.uldNumber == null || uldReq.uldNumber == undefined) {
        this.showErrorMessage("export.enter.uld.number");
        return;
      }
      if (this.offloadForm.get('reason').value == null || this.offloadForm.get('reason').value == undefined) {
        this.showErrorMessage("export.enter.offload.reason");
        return;
      }
      if (!(this.checkForDuplicate(uldReq.uldNumber))) {
        this.buildUpService.fetchSHC(uldReq).subscribe((data) => {
          if (data.data) {
            console.log(data);
            this.refreshFormMessages(data);
            let shcstring = '';
            const something: any = data.data;
            if (something.shcs.length > 0) {
              for (const entry of something.shcs) {
                shcstring += entry + ' ';
              }
            }
            const temp = new OffloadHandoverFormULD();
            temp.flightKey = this.offloadForm.get('flightKey').value;
            temp.flightDate = this.offloadForm.get('flightDate').value;
            this.flightKey = this.offloadForm.get('flightKey').value;
            this.flightDate = this.offloadForm.get('flightDate').value;
            if (this.checkForTrolley) {
              temp.flightId = this.flightId;
              temp.std = this.std;
              temp.checkForTrolley = true;
            }
            else {
              temp.flightId = this.flightId;
              temp.std = this.std;
              temp.checkForTrolley = false;
            }
            if (this.resp != null || this.resp != undefined) {
              if (this.resp.etd != null) {
                if (this.resp.showDateFlag) {
                  temp.showDateFlag = this.resp.showDateFlag;
                  temp.etd = this.resp.etd;
                } else {
                  temp.showDateFlag = this.resp.showDateFlag;
                  temp.etd = this.resp.etd;
                  temp.etd = NgcUtility.getTimeAsString(NgcUtility.getDateTime(this.resp.etd));
                }
              }
            }
            temp.shc = shcstring;
            temp.bay = this.bay;
            temp.handlingArea = this.getUserProfile().terminalId;
            temp.uldNumber = this.offloadForm.get('uldNumber').value;
            temp.reason = this.offloadForm.get('reason').value;
            temp.noOfBags = this.offloadForm.get('noOfBags').value;
            temp.handCarry = this.offloadForm.get('handCarry').value;
            temp.ocs = this.offloadForm.get('ocs').value;
            this.displayFlag2 = true;
            console.log(temp);
            this.uldList.push(temp);
            let driverId = this.offloadForm.get('driverId').value;
            this.offloadForm.reset();
            this.offloadForm.get('driverId').setValue(driverId);
            this.offloadForm.get('tableList').patchValue(this.uldList);
            this.offlaodFlag = false;
          }
        });
      } else {
        this.showWarningStatus('export.duplicate.uld.not.allowed');
      }
    } else {
      this.showWarningStatus('expaccpt.input.all.mandatory.details');
    }
  }


  onDelete(event, index) {
    console.log("event", event);
    console.log("index", index);
    (<NgcFormArray>this.offloadForm.get("tableList")).deleteValueAt(index);
    const list = (<NgcFormArray>this.offloadForm.get('tableList')).getRawValue();
    if (list.length < 1) {
      this.offlaodFlag = true;
      this.displayFlag2 = false;
    }
    let listofUld = [];
    for (let i = 0; i < this.uldList.length; i++) {
      if (i == index)
        continue;
      else
        listofUld.push(this.uldList[i]);
    }
    this.uldList = listofUld;
  }

  ngOnInit() {
    this.disableClear = true;
    this.navObj = this.getNavigateData(this.activatedRoute);
    if (this.navObj != null && this.navObj != undefined) {
      this.offloadForm.get('driverId').setValue(this.navObj.driverId);
      this.navObj.offloadHandOverUlds.forEach(t => {
        if (!t.showDateFlag) {
          t.etd = NgcUtility.getTimeAsString(NgcUtility.getDateTime(t.etd));
        }
      });
      this.offloadForm.get('tableList').patchValue(this.navObj.offloadHandOverUlds);
      this.displayFlag2 = true;
      this.driverDisabler = true;
      this.disableClear = true;
      this.fromUldDetails = false;
    }
  }

  onReturn() {
    let driverId = this.offloadForm.get('driverId').value;
    if (driverId == null || driverId == undefined) {
      this.showErrorMessage("export.enter.driver_id");
      return;
    }
    const list = (<NgcFormArray>this.offloadForm.get('tableList')).getRawValue();
    if (list.length < 1) {
      this.offlaodFlag = true;
    }
    console.log(list);
    this.reqContainer = new OffloadHandoverModel();
    this.reqContainer.wareFlight = new Array<OffloadWarehouseFlight>();
    for (let entry of list) {
      if (this.reqContainer.wareFlight.indexOf(entry.flightId) === -1) {
        const temp: OffloadWarehouseFlight = new OffloadWarehouseFlight();
        temp.flightId = entry.flightId;
        temp.flightKey = entry.flightKey;
        temp.flightDate = entry.flightDate;
        temp.checkForTrolley = entry.checkForTrolley;
        temp.uldNumber = entry.uldNumber;
        temp.bay = this.bay;
        temp.noOfBags = entry.noOfBags;
        temp.ocs = entry.ocs;
        temp.handCarry = entry.handCarry;
        //temp.std = entry.std;
        temp.handUlds = new Array<OffloadHandoverULD>();
        this.reqContainer.wareFlight.push(temp);
      }
    }
    for (let entry of this.reqContainer.wareFlight) {
      for (let value of list) {
        if (entry.flightId === value.flightId && entry.uldNumber == value.uldNumber) {
          const temp: OffloadHandoverULD = new OffloadHandoverULD();
          temp.uldNumber = value.uldNumber;
          temp.driverId = this.offloadForm.get('driverId').value;
          temp.reason = value.reason;
          temp.handlingArea = value.handlingArea;
          temp.noOfBags = value.noOfBags;
          temp.handCarry = value.handCarry;
          temp.ocs = value.ocs;
          entry.handUlds.push(temp);
        }
      }
    }
    console.log(this.reqContainer);

    //setting is from offloadHandOver 
    this.reqContainer.fromOffloadHandOverFlag = true;
    this.windowPrinter.open();
  }

  printOffload() {
    this.showSuccessStatus("export.request.to.print.successfully");
    this.windowPrinter.hide();
    if (this.popupPrinterForm.get("printerdropdown").value == null) {
      this.showErrorStatus("expaccpt.select.printer.and.proceed");
    }
    else {
      this.reqContainer.printerName = this.popupPrinterForm.get("printerdropdown").value;
      this.reqContainer.isWarehouse = false;
      this.buildUpService.insertUlds(this.reqContainer).subscribe((data) => {
        if (!this.showResponseErrorMessages(data)) {
          console.log(data);
          this.offloadForm.reset();
          this.displayFlag = false;
          this.displayFlag2 = false;
          this.driverDisabler = false;
          this.uldList = [];
          this.showSuccessStatus('export.offload.handover.completed');
          if (this.navObj != null) {
            this.navigateTo(this.toRoute, '/export/buildup/ulddetails', this.navObj);

          }
        }
        else {
          this.showResponseErrorMessages(data)
        }
      });
    }
  }



  checkForDuplicate(temp: any): boolean {
    for (const entry of this.uldList) {
      if (entry.uldNumber === temp) {
        return true;
      }
    }
    return false;
  }

  checkForOffload(temp: any): boolean {
    for (const entry of this.uldChecker) {
      if (entry === temp) {
        return true;
      }
    }
    return false;
  }

  public check(input) {
    const result = /^[A-Za-z0-9]+$/.test(input);
    return result;
  }
  getFlightDetails(event) {
    let offload = new OffloadULD();
    offload.flightKey = this.offloadForm.get('flightKey').value;
    offload.flightOriginDate = this.offloadForm.get('flightDate').value;
    if (event != null && offload.flightKey != null && offload.flightOriginDate != null) {
      console.log("event", event);
      offload.flagForGettingFlightDetails = true;
      console.log("Request", offload);
      this.buildUpService.searchFlight(offload).subscribe(response => {
        console.log("response", response);
        this.resp = response.data;
        if (!this.showResponseErrorMessages(response)) {
          this.std = response.data.std;
          this.etd = response.data.etd;
          this.bay = response.data.bay;
          this.addDisabler = false;
        }
        else {
          this.showResponseErrorMessages(response);
          this.addDisabler = true;
        }
      });
    }

  }
  onCancel(event) {
    if (this.navObj == null) {
      let tranferData;
      this.navigateTo(this.toRoute, '**', tranferData);
    } else {
      this.navigateTo(this.toRoute, '/export/buildup/ulddetails', this.navObj);
    }
  }
  validateDriverID(event) {
    if (this.navObj != null) {
      const driverId = this.offloadForm.get('driverId').value;
      if (this.check(driverId)) {
        //this.displayFlag = true;
        this.onChangeULDNumber();
        const tempReq: OffloadULD = new OffloadULD();
        tempReq.driverId = driverId;
        this.driverDisabler = true;

      } else {
        this.showWarningStatus('export.driverid.special.characters.validation');
      }
      // validate driver id
      let request = new OffloadHandoverULD();
      request.driverId = driverId;
      this.buildUpService.validateDriverIDForOffloadHandOver(request).subscribe(response => {
        console.log("response", response);
        if (!this.showResponseErrorMessages(response)) {
          this.offlaodFlag = false;
        }
        else {
          this.showResponseErrorMessages(response);
          this.offlaodFlag = true;

        }
      });
    }
  }
}
