import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent,
  NgcButtonComponent, NgcUtility, PageConfiguration
} from 'ngc-framework';
import { error } from 'protractor';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControlName } from '@angular/forms';
import { ImportService } from '../../import.service';
import { addBagList } from '../../import.shared';
import { MailBreakdownData, MailBreakdownSearchResult, MailBreakdownSearchRequest, MailBreakdown } from '../../import.sharedmodel';



@Component({
  selector: 'app-mail-bag',
  templateUrl: './mail-bag.component.html',
  styleUrls: ['./mail-bag.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class MailBagComponent extends NgcPage {
  carrier: any;
  uldNumber: string;
  flightId: number;
  // routedData: any;
  mailBagNumber: any;
  showTable: boolean = false;
  registeredValue: number;
  lastBagData: number;
  response: any;
  displayUld: boolean = false;
  inputUld: boolean = false;
  newArray: any = [];
  showPiece: boolean = false;
  piece: any;
  receptacle: any;
  last: boolean;
  regist: boolean;
  originPoint: string;
  destinationPoint: string;
  specialCharCheck: boolean = false;

  @ViewChild('showPopUpWindow') showPopUpWindow: NgcWindowComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef
    , private activatedRoute: ActivatedRoute, private importService: ImportService, private router: Router) {
    super(appZone, appElement, appContainerElement);

  }

  private mailBagForm: NgcFormGroup = new NgcFormGroup({
    search: new NgcFormGroup({
      flightKey: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(),
      uldNumber: new NgcFormControl()
    }),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),

    shipmentLocation: new NgcFormControl(),
    warehouseLocation: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    mailBagNumber: new NgcFormControl(),
    seperateMailBag: new NgcFormGroup({
      originCounty: new NgcFormControl(),
      originLocation: new NgcFormControl(),
      originCategory: new NgcFormControl(),
      destinationCountry: new NgcFormControl(),
      destinationLocation: new NgcFormControl(),
      destinationCategory: new NgcFormControl(),
      mailCategory: new NgcFormControl('A'),
      mailSubType: new NgcFormControl(),
      dispatchYear: new NgcFormControl(new Date().getFullYear().toString().substring(3)),
      dispatchNumber: new NgcFormControl(),
      receptacleNumber: new NgcFormControl(),
      lastBag: new NgcFormControl('No'),
      registered: new NgcFormControl('No'),
      weight: new NgcFormControl(),
      pieces: new NgcFormControl(),
      bup: new NgcFormControl()
    }),
    addBagList: new NgcFormArray([
    ]),
    damageArray: new NgcFormArray([]),
    remarks: new NgcFormControl(),
    emailTo: new NgcFormControl()
  });

  ngOnInit() {

    super.ngOnInit();
    const forwardedData = this.getNavigateData(this.activatedRoute);
    console.log("data", forwardedData);
    if (forwardedData) {
      this.mailBagForm.get(['search', 'flightKey']).patchValue(forwardedData.flightKey);
      this.mailBagForm.get(['search', 'flightDate']).patchValue(forwardedData.flightDate);
      this.flightId = forwardedData.flightId;
      this.searchMailBagFlight();
    }

    // this.routedData = this.importService.dataFromImportToMail;
    // if (this.routedData) {
    //   this.mailBagForm.get(['search', 'flightKey']).patchValue(this.routedData.flightKey);
    //   this.mailBagForm.get(['search', 'flightDate']).patchValue(this.routedData.flightDate);
    //   this.flightId = this.routedData.flightId;
    //   this.searchMailBagFlight();
    // }
  }

  registeredData(item, index) {
    if (item.code === 'Yes')
      this.registeredValue = 1;
    else if (item.code === 'No')
      this.registeredValue = 0;
  }

  lastData(item, index) {
    if (item.code === 'Yes')
      this.lastBagData = 1;
    else if (item.code === 'No')
      this.lastBagData = 0;
  }


  onDelete(event, index: any): void {
    (<NgcFormArray>this.mailBagForm.controls["addBagList"]).deleteValueAt(index);
  }

  breakdownWorklist(event) {
    let request = new MailBreakdownSearchResult();
    request.flightKey = this.response.flightKey;
    request.flightDate = this.response.flightDate;
    this.importService.dataFromImportToMail = request;
    this.navigateTo(this.router, '/import/importmailbreakdown', event);
  }

  searchMailBagFlight() {

    this.displayUld = false;
    let request: any = new MailBreakdownData();
    request = this.mailBagForm.get('search').value;
    this.importService.searchMailBreakdown(request).subscribe(resp => {
      if (resp.data) {
        this.response = resp.data;
        this.originPoint = this.response.boardingPoint;
        this.destinationPoint = this.response.offPoint;
        this.resetFormMessages();
        this.showTable = true;
        this.flightId = resp.data.flightId;
        this.carrier = resp.data.carrierCode;
        this.mailBagForm.get('flightKey').patchValue(resp.data.flightKey);
        if (resp.data.shipments && resp.data.shipments[0].dateSTA) {
          this.mailBagForm.get('flightDate').patchValue(resp.data.shipments[0].dateSTA);
        } else {
          this.mailBagForm.get('flightDate').patchValue(resp.data.staDate);
        }
        if (resp.data.shipments) {
          resp.data.shipments.map(obj => {
            obj.check = false;
            if (obj.transferCarrierFrom) {
              obj.outgoingCarrier = obj.transferCarrierFrom;
            }
            if (obj.outgoingCarrier === "**") {
              obj.outgoingCarrier = "All";
            }
            if (obj.originOfficeExchange) {
              obj.originCounty = obj.originOfficeExchange.substring(0, 2);
              obj.originLocation = obj.originOfficeExchange.substring(2, 5);
              obj.originCategory = obj.originOfficeExchange.substring(5);
            }
            if (obj.destinationOfficeExchange) {
              obj.destinationCountry = obj.destinationOfficeExchange.substring(0, 2);
              obj.destinationLocation = obj.destinationOfficeExchange.substring(2, 5);
              obj.destinationCategory = obj.destinationOfficeExchange.substring(5);
            }

            return obj;
          });
          let displayUld = this.mailBagForm.get(['search', 'uldNumber']).value;
          this.mailBagForm.get('uldNumber').patchValue(displayUld);
          this.mailBagForm.get(['addBagList']).patchValue(resp.data.shipments);
          // If the next destination is SIN then it will disable the Transfer Carrier section
          let destinationCount = 0;
          for (let ele of resp.data.shipments) {
            if (NgcUtility.isTenantCityOrAirport(ele.nextDestination)) {
              this.mailBagForm.get(['addBagList', destinationCount, 'outgoingCarrier']).disable();
            }
            destinationCount++;
          }
        }
      } else {
        this.mailBagForm.get(['addBagList']).patchValue(new Array());
        this.mailBagForm.get('warehouseLocation').reset();
        this.mailBagForm.get('shipmentLocation').reset();
        this.showTable = false;
        if (!resp.messageList) {
          this.showInfoStatus("no.record.found");
        } else {
          this.refreshFormMessages(resp);
        }
      }
    }, error => {
      this.showErrorMessage('server.is.down');
    })
  }




  onSave() {
    let flagData = new Array();
    let data = (<NgcFormArray>this.mailBagForm.get("addBagList")).getRawValue();
    data.forEach(obj => {
      if (obj.outgoingCarrier === "**" || obj.outgoingCarrier === "All" || !obj.outgoingCarrier) {
        obj.outgoingCarrier = this.response.carrierCode;
      }
    })
    let request: any = new MailBreakdownSearchRequest();
    request.flightDate = this.mailBagForm.get('flightDate').value;
    request.boardingPoint = this.response.boardingPoint;
    request.offPoint = this.response.offPoint;
    request.flightId = this.flightId;
    request.uldNumber = this.mailBagForm.get('uldNumber').value;
    request.carrierCode = this.response.carrierCode;
    request.shipments = [];
    request.shipments = data;

    request.shipments.map(obj => {
      obj.type = 'MAIL';

      if (obj.flagCRUD === 'C' || obj.flagCRUD === 'U' || obj.flagCRUD === 'D') {
        flagData.push(obj);
      }
      obj.pieces = obj.breakDownPieces;
      return obj;
    });
    request.shipmentLocation = this.mailBagForm.get('shipmentLocation').value;
    request.warehouseLocation = this.mailBagForm.get('warehouseLocation').value;
    if (!request.flightId) {
      this.showErrorMessage('mandatory.field.not.empty');
      return;
    }
    if (!flagData.length) {
      this.showErrorMessage('atleast.one.mailbag.save');
      return;
    }

    this.importService.checkContainerDestinationForBreakDown(request).subscribe(data => {
      if (data.data.shipments[0].allContainerDest && data.data.shipments[0].allContainerDest.length > 0) {
        //Container Destination is for XXX, do you wish to continue?
        this.showConfirmMessage(NgcUtility.translateMessage("import.confirm105",[data.data.shipments[0].allContainerDest.toString()])).then(fulfilled => {
          this.insertMailBreakDown(request);
        })
      } else {
        this.insertMailBreakDown(request);
      }

    });


  }


  insertMailBreakDown(request: any) {
    this.importService.insertMailBreakdown(request).subscribe(data => {
      if (data.data) {
        this.resetFormMessages();
        this.showSuccessStatus('g.completed.successfully');
        this.mailBagForm.get('seperateMailBag').reset();
        this.mailBagForm.get('seperateMailBag.mailCategory').patchValue('A');
        this.mailBagForm.get('seperateMailBag.dispatchYear').patchValue(new Date().getFullYear().toString().substring(3));
        this.mailBagForm.get('seperateMailBag.lastBag').patchValue('No');
        this.mailBagForm.get('seperateMailBag.registered').patchValue('No');

        this.searchMailBagFlight();
      } else {
        this.refreshFormMessages(data);
      }

    });
  }

  onAddMailBag() {
    if (this.specialCharCheck) {
      this.showErrorStatus("imp.err122");
      return;
    }
    let maildata = this.mailBagForm.get('mailBagNumber').value;
    let a = maildata.substring(2, 5);
    if (NgcUtility.isTenantCityOrAirport(maildata.substring(2, 5))) {
      this.showErrorStatus("imp.err120");
      return;
    }
    let request: any = new MailBreakdownSearchRequest();
    request.flightId = this.flightId;
    request.uldNumber = this.mailBagForm.get('uldNumber').value;
    if (this.mailBagForm.get('shipmentLocation').value == null && this.mailBagForm.get('warehouseLocation').value == null) {
      this.showErrorStatus("imp.err123");
      return;
    }
    //request.shipmentLocation = this.mailBagForm.get('shipmentLocation').value;
    let shipmentLocation: string = this.setShipmentLocation(this.mailBagForm.get('shipmentLocation').value);
    request.shipmentLocation = shipmentLocation;
    request.warehouseLocation = this.mailBagForm.get('warehouseLocation').value;
    //this.piece = 1;

    request.mailBagShipments = new MailBreakdown();
    request.mailBagShipments.mailBagNumber = maildata;
    request.mailBagShipments.type = 'MAIL';
    let mailBagInformation: any = (<NgcFormArray>this.mailBagForm.controls["addBagList"]).getRawValue();
    for (let mailBagNumber of mailBagInformation) {
      if (mailBagNumber.mailBagNumber === request.mailBagShipments.mailBagNumber) {
        this.showErrorStatus("imp.err124");
        return;
      } else {
        this.resetFormMessages();
      }
    }
    let nestDestination: string = null;
    if (NgcUtility.isTenantCityOrAirport(maildata.substring(8, 11))) {
      nestDestination = maildata.substring(8, 11)
    }
    request.mailBagShipments.flagCRUD = 'C';
    request.shipments = [];
    request.shipments.push(request.mailBagShipments);
    request.shipments.forEach(element => {
      element.incomingCarrier = this.carrier;
    })
    this.importService.checkMailbag(request).subscribe(data => {
      if (data.data) {
        if (data.data.shipments[0].outgoingCarrier == "**") {
          data.data.shipments[0].outgoingCarrier == "All";
        }
        if (data.data.shipments[0].closedTransit) {
          data.data.shipments[0].nextDestination = NgcUtility.getTenantConfiguration().airportCode;
        }
        this.mailBagForm.get('mailBagNumber').reset();
        let weightData = maildata.substring(25) / 10;
        this.resetFormMessages();
        if (request.mailBagShipments.mailBagNumber.substring(23, 24) == '0')
          this.last = false;
        else
          this.last = true;
        if (request.mailBagShipments.mailBagNumber.substring(24, 25) == '0')
          this.regist = false;
        else
          this.regist = true;

        if (data.data.shipments[0].nextDestination == null) {
          data.data.shipments[0].nextDestination = request.mailBagShipments.mailBagNumber.substring(8, 11)
        }
        (<NgcFormArray>this.mailBagForm.controls['addBagList']).addValue([{
          mailBagNumber: maildata,
          originOfficeExchange: maildata.substring(0, 6),
          destinationOfficeExchange: maildata.substring(6, 12),
          nextDestination: data.data.shipments[0].nextDestination,
          outgoingCarrier: data.data.shipments[0].outgoingCarrier,
          embargoFlag: data.data.shipments[0].embargoFlag,
          mailCategory: maildata.substring(12, 13),
          mailSubType: maildata.substring(13, 15),
          dispatchYear: maildata.substring(15, 16),
          dispatchNumber: maildata.substring(16, 20),
          receptacleNumber: maildata.substring(20, 23),
          lastBag: this.last,
          registered: this.regist,
          weight: weightData,
          shipmentLocation: request.shipmentLocation,
          warehouseLocation: this.mailBagForm.get('warehouseLocation').value,
          breakDownPieces: 1,
          uldNumber: this.mailBagForm.get('uldNumber').value
        }]);
        // If the next destination is SIN then it will disable the Transfer Carrier section
        let destinationCount = 0;
        let mailBagsArray = (<NgcFormArray>this.mailBagForm.controls["addBagList"]).getRawValue();
        for (let ele of mailBagsArray) {
          if (NgcUtility.isTenantCityOrAirport(ele.nextDestination)) {
            this.mailBagForm.get(['addBagList', destinationCount, 'outgoingCarrier']).disable();
          }
          destinationCount++;
        }
      } else {
        this.refreshFormMessages(data);
      }
    });
  }


  onMailbagAdd() {
    if (this.specialCharCheck) {
      this.showErrorStatus("imp.err122");
      return;
    }
    if (!this.lastBagData || this.mailBagForm.get('seperateMailBag.lastBag').value === 'No') {
      this.lastBagData = 0;

    }
    if (!this.registeredValue || this.mailBagForm.get('seperateMailBag.registered').value === 'No') {
      this.registeredValue = 0;
    }
    let weightData: any
    let maildata = this.mailBagForm.get('seperateMailBag').value;
    let mailbaglastbag = this.mailBagForm.get('seperateMailBag.lastBag').value;
    let bup: Boolean = this.mailBagForm.get('seperateMailBag.bup').value;
    let request: any = new MailBreakdownSearchRequest();
    request.shipments = [];
    request.flightId = this.flightId;
    request.uldNumber = this.mailBagForm.get('uldNumber').value;
    let shipmentLocation: string = this.setShipmentLocation(this.mailBagForm.get('shipmentLocation').value);
    request.shipmentLocation = shipmentLocation;
    request.warehouseLocation = this.mailBagForm.get('warehouseLocation').value;

    request.mailBagShipments = new MailBreakdown();
    if (!maildata.weight) {
      this.showErrorMessage('weight.cannot.be.empty');
      return;
    } else if (bup && (!request.shipmentLocation || request.shipmentLocation.length < 9)) {
      this.showErrorMessage('enter.uldnumber.shipmentlocation');
      return;
    }
    else {
      weightData = parseFloat(maildata.weight);
      let checkWeightData: Boolean = weightData.toString().includes('.');
      let weightLength: number = weightData.toString().length;
      if (!checkWeightData) {
        if (weightData % 1 == 0) {
          if (weightData.toString().length == 1) {
            weightData = "00" + weightData * 10;
          } else if (weightData.toString().length == 2) {
            weightData = "0" + weightData * 10;
          } else if (weightData.toString().length == 3) {
            weightData = weightData * 10;
          }
          else if (weightData.toString().length == 4) {
            weightData = weightData;
          }
          else if (weightData.toString().length > 5) {
            this.showErrorMessage('invalid.weight');
            return;
          }
        }
      } else {
        let removedDecimal: String = weightData.toString().replace('.', '');
        if (weightLength === 3) {
          weightData = "00" + removedDecimal;
        } else if (weightLength === 4) {
          weightData = "0" + removedDecimal;
        } else if (weightLength === 5) {
          weightData = removedDecimal;
        } else if (bup && weightLength == 6) {
          weightData = removedDecimal;
        }
        else {
          this.showErrorMessage('invalid.weight'); return;
        }
      }
    }
    //BUP container specific code
    if (!this.mailBagForm.get('seperateMailBag.bup').value) {
      this.receptacle = this.mailBagForm.get('seperateMailBag.receptacleNumber').value;
      this.piece = 1;
    } else {
      //In case of BUP, ULD field cannot be empty
      this.receptacle = "___";
      this.piece = this.mailBagForm.get('seperateMailBag.pieces').value;
      if (!this.piece) {
        this.showErrorMessage("pieces.cannot.be.empty");
        return;
      }
    }

    request.mailBagShipments.mailBagNumber = maildata.originCounty + maildata.originLocation +
      maildata.originCategory + maildata.destinationCountry + maildata.destinationLocation + maildata.destinationCategory +
      maildata.mailCategory + maildata.mailSubType + maildata.dispatchYear + maildata.dispatchNumber +
      this.receptacle + this.lastBagData + this.registeredValue + weightData;
    let mailBagInformation: any = (<NgcFormArray>this.mailBagForm.controls["addBagList"]).getRawValue();
    for (let mailBagNumber of mailBagInformation) {
      if (mailBagNumber.mailBagNumber === request.mailBagShipments.mailBagNumber) {
        this.showErrorStatus("imp.err124");
        return;
      } else {
        this.resetFormMessages();
      }
    }
    request.mailBagShipments.type = 'MAIL';
    request.mailBagShipments.flagCRUD = 'C';
    request.shipments = [];
    request.shipments.push(request.mailBagShipments);
    request.shipments.forEach(element => {
      element.incomingCarrier = this.carrier;
    })
    this.importService.checkMailbag(request).subscribe(data => {
      if (data.data) {
        if (data.data.shipments[0].outgoingCarrier == "**") {
          data.data.shipments[0].outgoingCarrier == "All";
        }
        if (data.data.shipments[0].closedTransit) {
          data.data.shipments[0].nextDestination = NgcUtility.getTenantConfiguration().airportCode;
        }
        this.resetFormMessages();
        if (request.mailBagShipments.mailBagNumber.substring(23, 24) == '0')
          this.last = false;
        else
          this.last = true;
        if (request.mailBagShipments.mailBagNumber.substring(24, 25) == '0')
          this.regist = false;
        else
          this.regist = true;
        if (NgcUtility.isTenantCityOrAirport(request.mailBagShipments.mailBagNumber.substring(2, 5))) {
          this.showErrorStatus("imp.err120");
          return;
        }
        if (data.data.shipments[0].nextDestination == null) {
          data.data.shipments[0].nextDestination = request.mailBagShipments.mailBagNumber.substring(8, 11)
        }
        (<NgcFormArray>this.mailBagForm.controls['addBagList']).addValue([{
          mailBagNumber: request.mailBagShipments.mailBagNumber,
          originOfficeExchange: request.mailBagShipments.mailBagNumber.substring(0, 6),
          destinationOfficeExchange: request.mailBagShipments.mailBagNumber.substring(6, 12),
          nextDestination: data.data.shipments[0].nextDestination,
          outgoingCarrier: data.data.shipments[0].outgoingCarrier,
          embargoFlag: data.data.shipments[0].embargoFlag,
          mailCategory: request.mailBagShipments.mailBagNumber.substring(12, 13),
          mailSubType: request.mailBagShipments.mailBagNumber.substring(13, 15),
          dispatchYear: request.mailBagShipments.mailBagNumber.substring(15, 16),
          dispatchNumber: request.mailBagShipments.mailBagNumber.substring(16, 20),
          receptacleNumber: this.receptacle,
          lastBag: this.last,
          registered: this.regist,
          weight: maildata.weight,
          shipmentLocation: request.shipmentLocation,
          warehouseLocation: this.mailBagForm.get('warehouseLocation').value,
          breakDownPieces: this.piece,
          uldNumber: this.mailBagForm.get('uldNumber').value,
          bup: this.mailBagForm.get('seperateMailBag.bup').value
        }]);
        // If the next destination is SIN then it will disable the Transfer Carrier section
        let destinationCount = 0;
        let mailBagsArray = (<NgcFormArray>this.mailBagForm.controls["addBagList"]).getRawValue();
        for (let ele of mailBagsArray) {
          if (NgcUtility.isTenantCityOrAirport(ele.nextDestination)) {
            this.mailBagForm.get(['addBagList', destinationCount, 'outgoingCarrier']).disable();
          }
          destinationCount++;
        }

      } else {
        this.refreshFormMessages(data);
      }
    });
  }

  capturePopUp() {
    this.newArray = [];
    let arrayNested: any = (<NgcFormArray>this.mailBagForm.controls["addBagList"]).getRawValue();
    for (let elements of arrayNested) {
      if (elements.check) {
        this.newArray.push(elements);
      }
    }
    if (!this.newArray.length) {
      this.showErrorStatus("imp.err125");
      return;
    }
    if (this.newArray.length > 1) {
      this.showErrorStatus("imp.err126");
      return;
    }
    const request: any = {};
    request.entityKey = this.newArray[0].mailBagNumber;
    request.entityType = "MBN";
    request.flight = this.mailBagForm.get('flightKey').value;
    request.flightDate = this.mailBagForm.get('flightDate').value;
    let event = request;
    this.navigateTo(this.router, '/common/capturedamageDesktop', event);
    // this.showPopUpWindow.open();
  }

  onLinkClick(event, index) {
    (<NgcFormArray>this.mailBagForm.controls["addBagList"]).markAsDeletedAt(index);
  }

  addDamageRow() {
    (<NgcFormArray>this.mailBagForm.get("damageArray")).addValue([
      {
        natureOfDamage: '',
        damagedPieces: '',
        severity: '',
        occurance: ''
      }
    ])
  }

  onDeleteDamagedRow(item, index) {
    (<NgcFormArray>this.mailBagForm.controls["damageArray"]).deleteValueAt(index);
  }


  getCountryCodeOrigin(item) {
    this.mailBagForm.get('seperateMailBag.originCounty').patchValue(item.desc);
  }

  getCountryCodeDestination(item) {
    this.mailBagForm.get('seperateMailBag.destinationCountry').patchValue(item.desc);
  }

  public onBack(event) {
    this.navigateBack(this.mailBagForm.getRawValue());
  }

  appendDispatchNumber() {
    let dispatchNumber = this.mailBagForm.get('seperateMailBag.dispatchNumber').value;
    if (dispatchNumber.length === 1) {
      this.mailBagForm.get('seperateMailBag.dispatchNumber').patchValue('000' + dispatchNumber);
    } else if (dispatchNumber.length === 2) {
      this.mailBagForm.get('seperateMailBag.dispatchNumber').patchValue('00' + dispatchNumber);
    } else if (dispatchNumber.length === 3) {
      this.mailBagForm.get('seperateMailBag.dispatchNumber').patchValue('0' + dispatchNumber);
    }
  }

  appendReceptacleNumber() {
    let receptacleNumber = this.mailBagForm.get('seperateMailBag.receptacleNumber').value;
    if (receptacleNumber.length === 1) {
      this.mailBagForm.get('seperateMailBag.receptacleNumber').patchValue('00' + receptacleNumber);
    } else if (receptacleNumber.length === 2) {
      this.mailBagForm.get('seperateMailBag.receptacleNumber').patchValue('0' + receptacleNumber);
    }
  }

  onBup() {
    if (this.mailBagForm.get('seperateMailBag.bup').value) {
      this.showPiece = true;
    }
    else {
      this.showPiece = false;
    }
  }

  checkForSpecialCharacter(item) {
    let format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (format.test(item)) {
      this.specialCharCheck = true;
      this.showErrorStatus("imp.err122");
      return;
    } else {
      this.specialCharCheck = false;
      this.refreshFormMessages(item);
    }
  }

  setShipmentLocation(item): string {
    let locationType: string;
    let locationnumber: string;
    if (item) {
      locationType = item.substring(0, 2).toUpperCase();
      if ("BT" === locationType || "MT" === locationType) {
        locationnumber = item.substring(2);
        if (locationnumber.length === 1) {
          locationnumber = "000" + locationnumber;
        } else if (locationnumber.length === 2) {
          locationnumber = "00" + locationnumber;
        } else if (locationnumber.length === 3) {
          locationnumber = "0" + locationnumber;
        } else {
          locationnumber = locationnumber;
        }
        item = locationType + locationnumber;
      }
    }
    return item;

  }

}


