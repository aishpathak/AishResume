import {
  OffloadULD, OffloadHandoverModel, OffloadWarehouseFlight,
  OffloadHandoverULD, OffloadHandoverFormULD
} from './../buildup.sharedmodel';
import { BuildupService } from './../buildup.service';
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcFormControl, NgcButtonComponent, NgcUtility, PageConfiguration, NgcWindowComponent,
} from 'ngc-framework';
// Angular imports
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngc-return-to-warehouse',
  templateUrl: './return-to-warehouse.component.html',
  styleUrls: ['./return-to-warehouse.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  // autoBackNavigation: true
})
export class ReturnToWarehouseComponent extends NgcPage implements OnInit {
  returnHandoverFlag: boolean = false;
  toShow: boolean = false;
  displayFlag2 = false;
  patchList: any[] = [];
  addDisabler = false;
  driverDisabler = false;
  uldChecker: any[] = [];
  alreadyDoneChecker: any[] = [];
  resp: any;
  displayFlag = false;
  flightKey: any;
  flightDate: any;
  flightId: any;
  std: any;
  uldList: Array<OffloadHandoverFormULD> = [];
  reqContainer: OffloadHandoverModel;
  checkForTrolley: boolean = false;
  navObj: any = null;
  disableClear: boolean = false;
  fromUldDetails: boolean = true;
  noOfBagsDisplayFlag: boolean = false;
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;

  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });

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
    noOfBags: new NgcFormControl(),
    tableList: new NgcFormArray([])

  });

  ngOnInit() {
    this.disableClear = false;
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

  onNext() {
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
    this.checkForTrolley = false;
    const uldRequest: OffloadULD = new OffloadULD();
    this.offloadForm.get('uldNumber').valueChanges.subscribe((value) => {
      if (this.offloadForm.get('uldNumber').value !== null && this.offloadForm.get('uldNumber').value !== ''
        && this.offloadForm.get('uldNumber').value !== 'OCS' && this.offloadForm.get('uldNumber').value !== 'HANDCARRY') {
        const tempStore = this.offloadForm.get('uldNumber').value;
        uldRequest.uldNumber = this.offloadForm.get('uldNumber').value;
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
            console.log("returnResponse", this.resp);
            this.offloadForm.get('flightKey').setValue(this.resp.flightKey);
            this.offloadForm.get('flightDate').patchValue(this.resp.flightDate);

            this.checkForTrolley = this.resp.checkForTrolley;

            this.flightKey = this.resp.flightKey;
            this.flightDate = this.resp.flightDate;
            this.flightId = this.resp.flightId;
            this.std = this.resp.std;
            // this.offloadForm.get('handCarry').setValue(false);
            //  this.offloadForm.get('reason').setValue(' ');
            this.addDisabler = this.checkForDuplicate(this.offloadForm.get('uldNumber').value);
            if (this.addDisabler) {
              this.showWarningStatus('export.duplicate.uld.not.allowed');
            }
            if (!(data.success)) {
              this.addDisabler = true;
            } else {
              this.addDisabler = false;
            }
          } else {
            if (data.messageList.length > 0) {
              this.addDisabler = true;
              this.offloadForm.get('flightKey').setValue(' ');
              this.offloadForm.get('flightDate').patchValue(' ');
              this.offloadForm.get('handCarry').setValue(false);
              this.offloadForm.get('reason').setValue(' ');

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
    if (this.offloadForm.valid) {
      const uldReq: OffloadULD = new OffloadULD();
      uldReq.uldNumber = this.offloadForm.get('uldNumber').value;
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
            temp.etdWithoutDate = null;
            if (this.checkForTrolley) {
              temp.flightId = null;
              temp.flightDate = null;
              temp.flightKey = null;
              temp.std = null;
              temp.checkForTrolley = true;
            }
            else {
              temp.flightId = this.flightId;
              temp.flightDate = this.flightDate;
              temp.flightKey = this.flightKey;
              temp.std = this.std;

              //temp.checkForTrolley=false;
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
            else
              temp.etd = null;
            temp.shc = shcstring;
            temp.handlingArea = this.getUserProfile().terminalId;
            temp.uldNumber = this.offloadForm.get('uldNumber').value;
            temp.reason = "";//this.offloadForm.get('reason').value;
            temp.handCarry = this.offloadForm.get('handCarry').value;
            temp.ocs = this.offloadForm.get('ocs').value;
            temp.noOfBags = null;
            this.displayFlag2 = true;
            console.log(temp);
            this.uldList.push(temp);

            const list = (<NgcFormArray>this.offloadForm.get('tableList')).getRawValue();
            list.push(temp);
            let driverId = this.offloadForm.get('driverId').value;
            this.offloadForm.reset();
            this.offloadForm.get('tableList').patchValue(list);
            this.offloadForm.get('driverId').setValue(driverId);
            //this.offloadForm.get('tableList').patchValue(this.uldList);
            this.returnHandoverFlag = false;
          }
        });
      } else {
        this.showWarningStatus('export.duplicate.uld.not.allowed');
      }
    } else {
      this.showWarningStatus('expaccpt.input.all.mandatory.details');
    }
  }

  onReturn() {
    let driverId = this.offloadForm.get('driverId').value;
    if (driverId == null || driverId == undefined) {
      this.showErrorMessage("export.enter.driver_id");
      return;
    }
    const list = (<NgcFormArray>this.offloadForm.get('tableList')).getRawValue();
    console.log(list);
    this.reqContainer = new OffloadHandoverModel();
    this.reqContainer.wareFlight = new Array<OffloadWarehouseFlight>();
    for (let entry of list) {
      if (this.reqContainer.wareFlight.indexOf(entry.flightId) === -1) {
        const temp: OffloadWarehouseFlight = new OffloadWarehouseFlight();
        temp.flightId = entry.flightId;
        if (entry.flightKey == null || entry.flightDate == null) {
          this.showErrorMessage("export.fill.flight.details");
          return;
        }

        temp.flightKey = entry.flightKey;
        temp.flightDate = entry.flightDate;
        temp.checkForTrolley = entry.checkForTrolley;
        temp.uldNumber = entry.uldNumber;
        temp.noOfBags = entry.noOfBags;
        temp.ocs = entry.ocs;
        temp.handCarry = entry.handCarry;
        temp.handUlds = new Array<OffloadHandoverULD>();
        this.reqContainer.wareFlight.push(temp);
      }
    }
    for (let entry of this.reqContainer.wareFlight) {
      for (let value of list) {
        if (entry.flightId === value.flightId && entry.uldNumber == value.uldNumber) {
          const temp: OffloadHandoverULD = new OffloadHandoverULD();
          temp.returnInd = true;
          temp.uldNumber = value.uldNumber;
          value.handCarry === 'Y' ? temp.handCarry = true : temp.handCarry = false;
          temp.driverId = this.offloadForm.get('driverId').value;
          temp.reason = value.reason;
          temp.handlingArea = value.handlingArea;
          temp.handCarry = value.handCarry;
          temp.ocs = value.ocs;
          temp.noOfBags = value.noOfBags;
          entry.handUlds.push(temp);
        }
      }
    }
    this.reqContainer.wareFlight.forEach(ele => {
      if (ele.checkForTrolley == undefined || ele.checkForTrolley == null)
        ele.checkForTrolley = false;
    })
    console.log("beforSaveResponse", this.reqContainer);
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

      this.reqContainer.isWarehouse = true;
      this.buildUpService.insertUlds(this.reqContainer).subscribe((data) => {
        console.log(data);
        (<NgcFormArray>this.offloadForm.get('tableList')).resetValue([]);
        // this.offloadForm.reset();
        this.displayFlag = false;
        this.displayFlag2 = false;

        this.driverDisabler = false;
        this.showSuccessStatus('export.offload.handover.completed');

        
        this.reqContainer.wareFlight = [];
        console.log("offlaod form after ", this.offloadForm.getRawValue());
        this.uldList = [];
        if (this.navObj != null) {
          this.navigateTo(this.toRoute, '/export/buildup/ulddetails', this.navObj);

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

  // onClear(event) {
  //   this.offloadForm.reset();
  //   this.displayFlag = false;
  //   this.displayFlag2 = false;
  //   this.patchList = [];
  //   this.driverDisabler = false;
  // }

  public check(input) {
    const result = /^[A-Za-z0-9]+$/.test(input);
    return result;
  }

  checkForReturn(temp: any): boolean {
    for (const entry of this.uldChecker) {
      if (entry === temp) {
        return true;
      }
    }
    return false;
  }

  checkIfHanded(temp: any): boolean {
    for (const entry of this.alreadyDoneChecker) {
      if (entry === temp) {
        return true;
      }
    }
    return false;
  }

  onDelete(event, index) {
    console.log("event", event);
    console.log("index", index);
    (<NgcFormArray>this.offloadForm.get("tableList")).deleteValueAt(index);
    const list = (<NgcFormArray>this.offloadForm.get('tableList')).getRawValue();
    if (list.length < 1) {
      this.returnHandoverFlag = true;
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


  getFlightDetails(event, index) {
    console.log("event", event, index);
    let offload = new OffloadULD();
    let obj = (<NgcFormGroup>this.offloadForm.get(['tableList', index])).value;
    console.log("cjkn", obj);
    offload.flightKey = obj.flightKey;
    offload.flightOriginDate = obj.flightDate;
    if (offload.flightKey != null && offload.flightOriginDate != null) {
      offload.flagForGettingFlightDetails = true;
      this.buildUpService.searchFlight(offload).subscribe(response => {
        console.log("response", response);
        if (!this.showResponseErrorMessages(response)) {
          (<NgcFormArray>this.offloadForm.get(['tableList', index])).get('std').setValue(response.data.std);
          if (response.data.etd != null) {
            if (response.data.showDateFlag) {
              (<NgcFormArray>this.offloadForm.get(['tableList', index])).get('etd').setValue(response.data.etd);

            } else {
              if (this.resp == undefined || this.resp.etd == null || this.resp.etd == undefined) {
                (<NgcFormArray>this.offloadForm.get(['tableList', index])).get('etdWithoutDate').setValue(NgcUtility.getTimeAsString(NgcUtility.getDateTime(NgcUtility.getDateTimeAsString(response.data.etd))));
              }
              else
                (<NgcFormArray>this.offloadForm.get(['tableList', index])).get('etdWithoutDate').setValue(NgcUtility.getTimeAsString(NgcUtility.getDateTime(this.resp.etd)));
            }
          }
          this.returnHandoverFlag = false;
        }
        else {
          this.showResponseErrorMessages(response);
          this.returnHandoverFlag = true;
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
          this.returnHandoverFlag = false;
        }
        else {
          this.showResponseErrorMessages(response);
          this.returnHandoverFlag = true;

        }
      });
    }
  }

}
