import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';

// NGC framework imports
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NgcWindowComponent, NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, NotificationMessage, PageConfiguration
} from 'ngc-framework';
import { OuthouseService } from '../outhouse.service';
import { MailOuthouseAcceptance, MailOuthouseAcceptanceRequest, MailOuthouseAcceptanceDetails } from '../outhouse.sharedmodel';

@Component({
  selector: 'app-mail-outhouse-acceptance',
  templateUrl: './mail-outhouse-acceptance.component.html',
  styleUrls: ['./mail-outhouse-acceptance.component.scss']
})
export class MailOuthouseAcceptanceComponent extends NgcPage implements OnInit {

  @ViewChild('insertionWindow') insertionWindow: NgcWindowComponent;
  // @ViewChild('addbutton') addbutton: NgcButtonComponent;

  show: boolean = false;
  displayTabs: boolean = false;
  mailNumber: any;
  mailNumberDetails: any;
  custId: any;
  dn: any;
  custName: any;
  sumPieces: number = 0;
  sumWeight: number = 0;
  dispatchNumber: any;
  receptacle: any;
  bagOrigin: any;
  bagDestination: any;
  registerFlag: any;
  registerFlagDisplay: any;
  weightValue: any;
  oe1: any;
  oe2: any;
  oe3: any;
  destOe1: any;
  destOe2: any;
  destOe3: any;
  category: any;
  mailType: any;
  year: any;
  dsn: any;
  rsn: any;
  lastBag: any;
  registerMail: any;
  registerMailValue: any;
  weightNumber: any;
  weightVal: any;
  setRequestParams: any;
  res: any;
  paDate: any;
  paDetails: any;
  carrier: any;
  res1: any;
  paDate1: any;
  paDetails1: any;
  carrier1: any;
  searchResp: any;
  addbutton: boolean = true;
  mailLastBag: any;
  warehouseLocation: any;
  mailRegistered: any;
  mailDataSaveRequest: any = [];

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private acceptanceService: OuthouseService) {
    super(appZone, appElement, appContainerElement);
  }

  private outhouseAcceptanceForm: NgcFormGroup = new NgcFormGroup
    ({
      carrierCode: new NgcFormControl(),
      dnNumber: new NgcFormControl(),
      customerName: new NgcFormControl(),
      customerCode: new NgcFormControl(),
      customerId: new NgcFormControl(),
      storeLocation: new NgcFormControl(),
      warehouseLocation: new NgcFormControl('DNATA'),
      mailBagNumber: new NgcFormControl(),
      originOe1: new NgcFormControl('', [Validators.maxLength(2)]),
      originOe2: new NgcFormControl(),
      originOe3: new NgcFormControl(),
      destinationOe1: new NgcFormControl('', [Validators.maxLength(2)]),
      destinationOe2: new NgcFormControl(),
      destinationOe3: new NgcFormControl(),
      category: new NgcFormControl('A'),
      mailType: new NgcFormControl(),
      year: new NgcFormControl(8),
      dsn: new NgcFormControl(),
      rsn: new NgcFormControl(),
      lastBag: new NgcFormControl('No'),
      registerMail: new NgcFormControl('No'),
      weight: new NgcFormControl(),
      mailOuthouseAcceptance: new NgcFormArray([])
    })

  ngOnInit() {
  }

  customerDetails(event) {
    this.custId = event.param1;
    this.custName = event.desc;
  }
  onAdd($event, index) {
    this.mailNumber = this.outhouseAcceptanceForm.get('mailBagNumber').value;
    if ((this.mailNumber === null) || (this.mailNumber === "")) {
      this.showErrorStatus("expaccpt.input.mailbag.number");
    }
    this.dispatchNumber = this.mailNumber.slice(16, 20);
    this.receptacle = this.mailNumber.slice(20, 23);
    this.bagOrigin = this.mailNumber.slice(2, 5);
    this.bagDestination = this.mailNumber.slice(8, 11);
    this.registerFlag = this.mailNumber.slice(24, 25);
    if (this.registerFlag === "1") {
      this.registerFlagDisplay = 'Y'
    }
    else {
      this.registerFlagDisplay = 'N'
    }
    this.weightValue = ((this.mailNumber.slice(25, 29)) / 10);
    const request: MailOuthouseAcceptanceRequest = new MailOuthouseAcceptanceRequest();
    request.mailNumber = this.outhouseAcceptanceForm.get('mailBagNumber').value;
    request.storeLocation = this.outhouseAcceptanceForm.get('storeLocation').value;
    request.shipmentType = "MAIL"
    this.acceptanceService.getPAFlightDetails(request).subscribe(data => {
      if (data.data) {
        this.res = data.data.paFlightKey;
        this.carrier = data.data.carrierCode;
        this.paDate = data.data.paFlightDate.slice(0, 10);
        this.paDetails = this.res.concat(' ', this.paDate);
        this.resetFormMessages();
        (<NgcFormArray>this.outhouseAcceptanceForm.controls['mailOuthouseAcceptance']).addValue([
          {
            select: false,
            mailBagNumber: this.mailNumber,
            carrierCode: this.carrier,
            nextDestination: '',
            dispatchNumber: this.dispatchNumber,
            receptacleNumber: this.receptacle,
            origin: this.bagOrigin,
            destination: this.bagDestination,
            pieces: 1,
            weight: this.weightValue,
            registeredIndicator: this.registerFlagDisplay,
            damaged: '',
            paFlightKey: this.paDetails,
            flightKey: this.res,
            flightDate: this.paDate,
            carrierDetermined: true
          }
        ]);
      }
      else {
        if (data.messageList) {
          this.refreshFormMessages(data);
        }
        else {
          this.resetFormMessages();
          (<NgcFormArray>this.outhouseAcceptanceForm.controls['mailOuthouseAcceptance']).addValue([
            {
              select: false,
              mailBagNumber: this.mailNumber,
              carrierCode: '',
              nextDestination: '',
              dispatchNumber: this.dispatchNumber,
              receptacleNumber: this.receptacle,
              origin: this.bagOrigin,
              destination: this.bagDestination,
              pieces: 1,
              weight: this.weightValue,
              registeredIndicator: this.registerFlagDisplay,
              damaged: '',
              paFlightKey: '',
              carrierDetermined: false
            }
          ]);
        }
      }
    });
    this.show = true;
  }

  onLastBag(event) {
    this.mailLastBag = event.desc;
    if (this.mailLastBag === "Yes") {
      this.mailLastBag = "1";
    }
    else if (this.mailLastBag === "No") {
      this.mailLastBag = "0";
    }
  }

  onRegisteredBag(event) {
    this.mailRegistered = event.desc;
    if (this.mailRegistered === "No") {
      this.mailRegistered = "0";
    } else if (this.mailRegistered === "Yes") {
      this.mailRegistered = "1";
    }
  }

  onMailbagAdd(event) {
    if (!this.mailLastBag && this.outhouseAcceptanceForm.get('lastBag').value === 'No') {
      this.mailLastBag = 0;
    }
    if (!this.mailRegistered && this.outhouseAcceptanceForm.get('registerMail').value === 'No') {
      this.mailRegistered = 0;
    }
    this.oe1 = this.outhouseAcceptanceForm.get('originOe1').value;
    this.oe2 = this.outhouseAcceptanceForm.get('originOe2').value;
    this.oe3 = this.outhouseAcceptanceForm.get('originOe3').value;
    this.destOe1 = this.outhouseAcceptanceForm.get('destinationOe1').value;
    this.destOe2 = this.outhouseAcceptanceForm.get('destinationOe2').value;
    this.destOe3 = this.outhouseAcceptanceForm.get('destinationOe3').value;
    this.mailType = this.outhouseAcceptanceForm.get('mailType').value;
    this.year = this.outhouseAcceptanceForm.get('year').value;
    this.dsn = this.outhouseAcceptanceForm.get('dsn').value;
    this.rsn = this.outhouseAcceptanceForm.get('rsn').value;
    this.lastBag = this.mailLastBag;
    this.registerMail = this.mailRegistered;
    if (this.registerMail) {
      if (this.registerMail === "1") {
        this.registerMailValue = 'Y'
      }
      else if (this.registerMail === "0") {
        this.registerMailValue = 'N'
      }
    }
    else {
      this.showErrorStatus("error.enter.register.mail");
    }
    this.weightNumber = this.outhouseAcceptanceForm.get('weight').value;
    if ((this.weightNumber === null) || (this.weightNumber === "")) {
      this.showErrorStatus("error.enter.weight");
    }
    if ((this.lastBag === null) || (this.lastBag === "")) {
      this.showErrorStatus("error.enter.lastbag");
    }
    if ((this.registerMail === null) || (this.registerMail === "")) {
      this.showErrorStatus("error.enter.register.mail");
    }
    if ((this.rsn === null) || (this.rsn === "")) {
      this.showErrorStatus("error.enter.rsn");
    }
    if ((this.dsn === null) || (this.dsn === "")) {
      this.showErrorStatus("error.enter.dsn");
    }
    if ((this.year === null) || (this.year === "")) {
      this.showErrorStatus("error.enter.year");
    }
    if ((this.mailType === null) || (this.mailType === "")) {
      this.showErrorStatus("error.enter.mailtype");
    }
    this.category = this.outhouseAcceptanceForm.get('category').value;
    if ((this.category === null) || (this.category === "")) {
      this.showErrorStatus("error.enter.category");
    }
    if ((this.destOe3 === null) || (this.destOe3 === "")) {
      this.showErrorStatus("error.dest.oe");
    }
    if ((this.oe3 === null) || (this.destOe3 === "")) {
      this.showErrorStatus("error.enter.origin.oe");
    }

    if (this.weightNumber % 1 == 0) {
      if (this.weightNumber.toString().length == 1) {
        this.weightNumber = "00" + this.weightNumber * 10;
      } else if (this.weightNumber.toString().length == 2) {
        this.weightNumber = "0" + this.weightNumber * 10;
      } else if (this.weightNumber.toString().length == 3) {
        this.weightNumber = this.weightNumber * 10;
      }
      else if (this.weightNumber.toString().length == 4) {
        this.weightNumber = this.weightNumber * 10;
      }
      this.weightVal = this.weightNumber;
    } else {
      if (this.weightNumber.toString().length == 3 && this.weightNumber.toString().substr(0, 1) == 0) {
        this.weightNumber = "000" + this.weightNumber * 10;
      } else if (this.weightNumber.toString().length == 3) {
        this.weightNumber = "00" + this.weightNumber * 10;
      } else if (this.weightNumber.toString().length == 4) {
        this.weightNumber = "0" + this.weightNumber * 10;
      } else if (this.weightNumber.toString().length == 5) {
        this.weightNumber = this.weightNumber * 10;
      }
      this.weightVal = this.weightNumber;
    }

    let weightLength = this.weightNumber.toString().length
    if (this.weightNumber.toString().substring(weightLength - 1) == 0) {
      this.weightNumber = this.weightNumber / 10 + '.0';
    } else {
      this.weightNumber = this.weightNumber / 10;
    }
    this.mailNumberDetails = this.oe1.concat(this.oe2, this.oe3, this.destOe1, this.destOe2, this.destOe3, this.category,
      this.mailType, this.year, this.dsn, this.rsn, this.lastBag, this.registerMail, this.weightVal);
    const request: MailOuthouseAcceptanceRequest = new MailOuthouseAcceptanceRequest();
    request.storeLocation = this.outhouseAcceptanceForm.get('storeLocation').value;
    request.mailNumber = this.mailNumberDetails;
    request.shipmentType = "MAIL"
    this.mailDataSaveRequest = (<NgcFormArray>this.outhouseAcceptanceForm.get([
      "mailOuthouseAcceptance"
    ])).value;

    this.mailDataSaveRequest = this.mailDataSaveRequest.filter(i => i.mailBagNumber == request.mailNumber);
    if (this.mailDataSaveRequest.length) {
      this.showErrorMessage("expaccpt.mailbag.number.exists");
      return;
    }
    this.acceptanceService.getPAFlightDetails(request).subscribe(data => {
      if (data.data) {
        this.res1 = data.data.paFlightKey;
        this.carrier1 = data.data.carrierCode;
        this.paDate1 = data.data.paFlightDate.slice(0, 10);;
        this.paDetails1 = this.res1.concat(' ', this.paDate1);
        this.resetFormMessages();
        (<NgcFormArray>this.outhouseAcceptanceForm.controls['mailOuthouseAcceptance']).addValue([
          {
            select: false,
            mailBagNumber: this.mailNumberDetails,
            carrierCode: this.carrier1,
            nextDestination: '',
            dispatchNumber: this.dsn,
            receptacleNumber: this.rsn,
            origin: this.oe2,
            destination: this.destOe2,
            pieces: 1,
            weight: this.weightNumber,
            registeredIndicator: this.registerMailValue,
            damaged: '',
            paFlightKey: this.paDetails1,
            carrierDetermined: true
          }
        ]);
      }
      else {
        if (data.messageList) {
          this.refreshFormMessages(data);
        } else {
          this.resetFormMessages();
          (<NgcFormArray>this.outhouseAcceptanceForm.controls['mailOuthouseAcceptance']).addValue([
            {
              select: false,
              mailBagNumber: this.mailNumberDetails,
              carrierCode: '',
              nextDestination: '',
              dispatchNumber: this.dsn,
              receptacleNumber: this.rsn,
              origin: this.oe2,
              destination: this.destOe2,
              pieces: 1,
              weight: this.weightNumber,
              registeredIndicator: this.registerMailValue,
              damaged: '',
              paFlightKey: '',
              carrierDetermined: false
            }
          ]);
        }
      }
    });
    this.mailDataSaveRequest.push(request);
    this.show = true;
  }

  onClear() {
    this.outhouseAcceptanceForm.reset();
    (<NgcFormArray>this.outhouseAcceptanceForm.controls['mailOuthouseAcceptance']).resetValue([]);
    this.resetFormMessages();
    this.outhouseAcceptanceForm.get('customerCode').patchValue('');
    this.outhouseAcceptanceForm.get('carrierCode').patchValue('');
    this.outhouseAcceptanceForm.get('storeLocation').patchValue('');
    this.outhouseAcceptanceForm.get('originOe2').patchValue('');
    this.outhouseAcceptanceForm.get('destinationOe2').patchValue('');
    this.addbutton = true;
  }

  onSave(item) {
    if (this.outhouseAcceptanceForm.get('mailBagNumber').value) {
      this.setRequestParams = this.outhouseAcceptanceForm.get('mailBagNumber').value;
    }
    else {
      this.setRequestParams = this.mailNumberDetails;
    }

    if (!this.setRequestParams) {
      this.showErrorStatus("error.while.data.saving");
    }

    const request: MailOuthouseAcceptanceRequest = this.outhouseAcceptanceForm.getRawValue();
    // request.customerId = this.custId;
    request.warehouseLocation = this.outhouseAcceptanceForm.get('warehouseLocation').value;
    console.log('warehouseLocation', this.warehouseLocation);
    request.dnNumber = this.setRequestParams.substr(0, 20);
    request.dnOrigin = this.setRequestParams.slice(2, 5);
    request.dnDestination = this.setRequestParams.slice(8, 11);
    request.originOfficeExchange = this.setRequestParams.slice(0, 6);
    request.mailBagMailCategory = this.setRequestParams.slice(12, 13);
    request.mailBagMailSubcategory = this.setRequestParams.slice(13, 15);
    request.mailBagDispatchYear = parseInt(this.setRequestParams.slice(15, 16));
    request.mailBagRegisteredIndicator = parseInt(this.setRequestParams.slice(24, 25));
    request.destinationOfficeExchange = this.setRequestParams.slice(6, 12);
    let index = 0
    request.mailOuthouseAcceptance.forEach(e => {
      e.mailBagMailCategory = (<NgcFormArray>this.outhouseAcceptanceForm.get('mailOuthouseAcceptance')['controls'][index]['controls']['mailBagNumber']).value.slice(12, 13);
      e.mailBagMailSubcategory = (<NgcFormArray>this.outhouseAcceptanceForm.get('mailOuthouseAcceptance')['controls'][index]['controls']['mailBagNumber']).value.slice(13, 15);
      e.year = (<NgcFormArray>this.outhouseAcceptanceForm.get('mailOuthouseAcceptance')['controls'][index]['controls']['mailBagNumber']).value.slice(15, 16);
      e.lastBagIndicator = (<NgcFormArray>this.outhouseAcceptanceForm.get('mailOuthouseAcceptance')['controls'][index]['controls']['mailBagNumber']).value.slice(23, 24);
      e.registeredIndicator = (<NgcFormArray>this.outhouseAcceptanceForm.get('mailOuthouseAcceptance')['controls'][index]['controls']['mailBagNumber']).value.slice(24, 25);
      e.origin = (<NgcFormArray>this.outhouseAcceptanceForm.get('mailOuthouseAcceptance')['controls'][index]['controls']['mailBagNumber']).value.slice(0, 6);
      e.destination = (<NgcFormArray>this.outhouseAcceptanceForm.get('mailOuthouseAcceptance')['controls'][index]['controls']['mailBagNumber']).value.slice(6, 12);
      index++;
    });
    this.acceptanceService.addMailOuthouseAcceptance(request).subscribe(data => {
      if (data.data) {
        this.showSuccessStatus("success.added");
        this.resetFormMessages();
      }
      else {
        this.refreshFormMessages(data);
      }
    }, (err) => {

    }, () => {
      this.sumWeight = 0;
      this.sumPieces = 0;
    });
  }

  onDelete() {
    const value = this.outhouseAcceptanceForm.getRawValue();
    let index = 0;
    value.mailOuthouseAcceptance.forEach(ele => {
      if (ele['select']) {
        (<NgcFormArray>this.outhouseAcceptanceForm.controls['mailOuthouseAcceptance']).removeAt(index);
        this.resetFormMessages();
      } else {
        index++;
      }
    });
  }
  onSearch(event, index) {
    const request = new MailOuthouseAcceptanceDetails();
    request.warehouseLocation = this.outhouseAcceptanceForm.get('warehouseLocation').value;
    request.carrierCode = this.outhouseAcceptanceForm.get('carrierCode').value;
    request.storeLocation = this.outhouseAcceptanceForm.get('storeLocation').value;
    this.acceptanceService.fetchOuthouseDetails(request).subscribe(data => {
      if (!data.messageList) {
        if (data.data.length != 0) {
          this.searchResp = data.data;
          for (var element of this.searchResp) {
            if (element.registeredIndicator === "1") {
              element.registeredIndicator = "Y";
            } else {
              element.registeredIndicator = "N";
            }

          }
          this.show = true;
          this.displayTabs = true;
          (<NgcFormArray>this.outhouseAcceptanceForm.get(['mailOuthouseAcceptance'])).patchValue(this.searchResp);
          this.searchResp.forEach((element, index) => {
            var paFlightKeyDate: any;
            var origin = element.origin.slice(2, 5);
            var destination = element.destination.slice(2, 5);
            if (element.paFlightDate != null) {
              paFlightKeyDate = element.paFlightKey + ' ' + element.paFlightDate.slice(0, 10);
            }
            (<NgcFormArray>this.outhouseAcceptanceForm.get(['mailOuthouseAcceptance', index, 'paFlightKey'])).patchValue(paFlightKeyDate);
            (<NgcFormArray>this.outhouseAcceptanceForm.get(['mailOuthouseAcceptance', index, 'origin'])).patchValue(origin);
            (<NgcFormArray>this.outhouseAcceptanceForm.get(['mailOuthouseAcceptance', index, 'destination'])).patchValue(destination);
          });
          this.resetFormMessages();
          this.addbutton = false;
        }
        else {
          this.showInfoStatus("no.record");
          (<NgcFormArray>this.outhouseAcceptanceForm.controls['mailOuthouseAcceptance']).resetValue([]);
          this.displayTabs = true;
          this.resetFormMessages();
          this.addbutton = true;
        }

      }
      else if (data.messageList) {
        this.refreshFormMessages(data);
        (<NgcFormArray>this.outhouseAcceptanceForm.controls['mailOuthouseAcceptance']).resetValue([]);
        this.displayTabs = true;
      }
    });
  }

  public onToggleInsert() {
    this.insertionWindow.hide();
  }
  public onBack(event) {
    this.navigateBack(this.outhouseAcceptanceForm.getRawValue());
  }
  getCountryCodeDestination(item) {
    this.outhouseAcceptanceForm.get("destinationOe1").patchValue(item.desc);
  }

  getCountryCodeOrigin(item) {
    this.outhouseAcceptanceForm.get("originOe1").patchValue(item.desc);
  }
  appendDsn() {
    let dispatchNumber = this.outhouseAcceptanceForm.get("dsn").value
    if (dispatchNumber.length === 1) {
      this.outhouseAcceptanceForm.get("dsn").patchValue('000' + dispatchNumber);
    } else if (dispatchNumber.length === 2) {
      this.outhouseAcceptanceForm.get("dsn").patchValue('00' + dispatchNumber);
    } else if (dispatchNumber.length === 3) {
      this.outhouseAcceptanceForm.get("dsn").patchValue('0' + dispatchNumber);
    }
  }
  appendRsn() {
    let receptacleNumber = this.outhouseAcceptanceForm.get("rsn").value
    if (receptacleNumber.length === 1) {
      this.outhouseAcceptanceForm.get("rsn").patchValue('00' + receptacleNumber);
    } else if (receptacleNumber.length === 2) {
      this.outhouseAcceptanceForm.get("rsn").patchValue('0' + receptacleNumber);
    }
  }

}
