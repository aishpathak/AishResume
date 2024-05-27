import { Component, OnInit, NgZone, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, NgcFormArray, NgcReportComponent, NgcWindowComponent, PageConfiguration, DateTimeKey } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { AcceptanceService } from '../acceptance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReturnMail } from '../../export.sharedmodel';

@Component({
  selector: 'app-return-mail',
  templateUrl: './return-mail.component.html',
  styleUrls: ['./return-mail.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class ReturnMailComponent extends NgcPage implements OnInit {

  request: any;
  showTabs: any = false;
  response: any;
  registerFlagDisplay: any;
  mailRegistered: any;
  mailLastBag: any;
  registerMailValue: any;
  weightVal: any;
  mailDataSaveRequest: any = [];
  mailDetailDataSaveRequest: any = [];
  resp: any;
  flag: boolean;
  reportParameters: any;
  reasonData: string
  bupCheck: boolean = false;
  reasonCode: any;

  private returnMailForm: NgcFormGroup = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    fromDate: new NgcFormControl(NgcUtility.getDateOnly(NgcUtility.subtractDate(new Date(), 7, DateTimeKey.DAYS))),
    toDate: new NgcFormControl(new Date()),
    reason: new NgcFormControl(),
    houseNumber: new NgcFormControl(),
    bup: new NgcFormControl(false),
    detailsBUP: new NgcFormControl(false),
    originOe1: new NgcFormControl(),
    originOe2: new NgcFormControl('', Validators.required),
    originOe3: new NgcFormControl('', Validators.required),
    destinationOe1: new NgcFormControl(),
    destinationOe2: new NgcFormControl('', Validators.required),
    destinationOe3: new NgcFormControl('', Validators.required),
    category: new NgcFormControl("A"),
    mailType: new NgcFormControl(),
    year: new NgcFormControl(new Date().getFullYear().toString().substring(3)),
    dsn: new NgcFormControl('', Validators.required),
    rsn: new NgcFormControl('', Validators.required),
    remarks: new NgcFormControl(),
    lastBag: new NgcFormControl('No'),
    weight: new NgcFormControl('', Validators.required),
    registerMail: new NgcFormControl('No'),
    returnReason: new NgcFormControl(),

    confirmReturnArray: new NgcFormArray([]),
    pendingReturnArray: new NgcFormArray([
      new NgcFormGroup({
        check: new NgcFormControl(),
        documentInformationId: new NgcFormControl(),
        reasonID: new NgcFormControl(),
        carrierCode: new NgcFormControl(),
        pieces: new NgcFormControl(),
        date: new NgcFormControl(),
        returned: new NgcFormControl(),
        dispatchNumber: new NgcFormControl(),
        receptacleNumber: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        mailType: new NgcFormControl(),
        mailWeight: new NgcFormControl(),
        returnReason: new NgcFormControl(),
        remarks: new NgcFormControl(),
        houseNumber: new NgcFormControl(),
        pendingReason: new NgcFormControl()
      })
    ])
  });

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private acceptanceService: AcceptanceService, private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
  }


  onRegisteredBag(event) {
    this.mailRegistered = event.desc;
    if (this.mailRegistered === "No") {
      this.mailRegistered = "0";
    } else {
      this.mailRegistered = "1";
    }
  }

  onLastBag(event) {
    this.mailLastBag = event.desc;
    if (this.mailLastBag === "Yes") {
      this.mailLastBag = "1";
    }
    else {
      this.mailLastBag = "0";
    }
  }
  getCountryCodeOrigin(item) {
    this.returnMailForm.get('originOe1').patchValue(item.desc);
  }
  getCountryCodeDestination(item) {
    this.returnMailForm.get('destinationOe1').patchValue(item.desc);
  }

  onSearch() {
    this.mailDataSaveRequest = [];
    const req = this.returnMailForm.getRawValue();
    this.acceptanceService.fetchReturnMail(req).subscribe(data => {
      this.flag = true;

      if (!this.showResponseErrorMessages(data) && data.data && data.data.mailBagDetail.length != 0) {
        this.showTabs = true;
        this.response = data.data;
        data.data.mailBagDetail.forEach(element => {
          // element.mailWeight = element.mailWeight + ".0";
          element.mailType = element.houseNumber.slice(13, 15);
          if (element.origin) {
            element.origin = element.origin.slice(2, 5);
          }
          if (element.destination) {
            element.destination = element.destination.slice(2, 5);
          }
          if (element.receptacleNumber) {
            if (element.receptacleNumber % 1 == 0) {
              if (element.receptacleNumber.toString().length == 1) {
                element.receptacleNumber = "00" + element.receptacleNumber;
              }
              else if (element.receptacleNumber.toString().length == 2) {
                element.receptacleNumber = "0" + element.receptacleNumber;
              }
              else if (element.receptacleNumber.toString().length == 3) {
                element.receptacleNumber = element.receptacleNumber;
              }

            }
          }
          if (element.dispatchNumber) {
            if (element.dispatchNumber.toString().length < 4) {
              if (element.dispatchNumber.toString().length === 1) {
                element.dispatchNumber = "000" + element.dispatchNumber
              }
              else if (element.dispatchNumber.toString().length === 2) {
                element.dispatchNumber = "00" + element.dispatchNumber
              }
              else if (element.dispatchNumber.toString().length === 3) {
                element.dispatchNumber = "0" + element.dispatchNumber
              }
            }
          }
          element['flagSave'] = false;

        });

        let arrayConfirm: any = this.response.mailBagDetail.filter(a => { return a.returned });
        let arrayPending: any = this.response.mailBagDetail.filter(a => { return !a.returned });
        if (arrayPending.length) {
          arrayPending.forEach(element => {
            element.check = false;
          })
        }
        (<NgcFormArray>this.returnMailForm.controls['confirmReturnArray']).patchValue(arrayConfirm);
        (<NgcFormArray>this.returnMailForm.controls['pendingReturnArray']).patchValue(arrayPending);
      }
      else {
        this.showTabs = false;
        this.showInfoStatus("no.record");
      }


    }, error => {
      this.showErrorMessage(error);
    });
  }

  onPrint() {
    this.reportParameters = new Object();
    this.reportParameters.carrier = this.returnMailForm.get('carrierCode').value;;
    this.reportParameters.fromdate = NgcUtility.getDateAsString(this.returnMailForm.get('fromDate').value);
    this.reportParameters.todate = NgcUtility.getDateAsString(this.returnMailForm.get('toDate').value);
    this.reportParameters.printBy = this.getUserProfile().userShortName;
    this.reportWindow.open();
  }

  onAdd($event, index) {

    let mailNumber = this.returnMailForm.get('houseNumber').value;
    let remarks = this.returnMailForm.get('remarks').value;
    let reason = this.returnMailForm.get('returnReason').value;

    if ((mailNumber === null) || (mailNumber === "")) {
      this.showErrorStatus("expaccpt.provide.mailbag.number");
      return;
    }
    let formBags = this.returnMailForm.getRawValue().confirmReturnArray;
    for (let mailBagNumber of formBags) {
      if (mailNumber === mailBagNumber.mailBag) {
        this.showErrorStatus("export.cannot.add.duplicate.mailbag");
        return;
      } else {
        this.resetFormMessages();
      }
    }
    if (mailNumber.includes('___')) {
      this.returnMailForm.get('bup').patchValue(true);
    } else {
      this.returnMailForm.get('bup').patchValue(false);
    }
    this.returnMailForm.get('bup').disable();
    let bup = this.returnMailForm.get('bup').value;
    let dispatchNumber = mailNumber.slice(16, 20);
    let receptacle = mailNumber.slice(20, 23);
    let bagOrigin = mailNumber.slice(2, 5);
    let bagDestination = mailNumber.slice(8, 11);
    let registerFlag = mailNumber.slice(24, 25);
    let mailType = mailNumber.slice(13, 15);
    let weightValue = ((mailNumber.slice(25, 29)) / 10);
    const request: any = new ReturnMail();
    request.carrierCode = this.returnMailForm.get('carrierCode').value;
    request.houseNumber = mailNumber;
    request.shipmentType = "MAIL";
    request.reasonID = reason;
    request.returnReason = this.reasonCode;
    request.remarks = remarks;
    request.bup = bup;
    // this.mailDataSaveRequest = this.mailDataSaveRequest.filter(i => i.houseNumber == request.houseNumber);

    this.acceptanceService.validate(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        (<NgcFormArray>this.returnMailForm.controls['confirmReturnArray']).addValue([
          {
            flagSave: false,
            dispatchNumber: dispatchNumber,
            receptacleNumber: receptacle,
            origin: bagOrigin,
            destination: bagDestination,
            mailType: mailType,
            mailWeight: weightValue,
            returnReason: reason,
            remarks: remarks,
            bup: bup,
            mailBag: mailNumber
          }
        ]);

        this.mailDataSaveRequest.push(request);
        this.showTabs = true;

      }
    }, error => {
      this.showErrorMessage(error);
    });
  }

  onMailbagAdd($event) {
    if (!this.mailLastBag && this.returnMailForm.get('lastBag').value === 'No') {
      this.mailLastBag = "0";
    }
    if (!this.mailRegistered && this.returnMailForm.get('registerMail').value === 'No') {
      this.mailRegistered = "0";
    }
    let oe1 = this.returnMailForm.get('originOe1').value;
    let oe2 = this.returnMailForm.get('originOe2').value;
    let oe3 = this.returnMailForm.get('originOe3').value;
    let destOe1 = this.returnMailForm.get('destinationOe1').value;
    let destOe2 = this.returnMailForm.get('destinationOe2').value;
    let destOe3 = this.returnMailForm.get('destinationOe3').value;
    let category = this.returnMailForm.get('category').value;
    let mailType = this.returnMailForm.get('mailType').value;
    let year = this.returnMailForm.get('year').value;
    let dsn = this.returnMailForm.get('dsn').value;
    let rsn: string;
    let detailsbup = this.returnMailForm.get('detailsBUP').value;
    if (detailsbup) {
      rsn = "___";
    } else {
      rsn = this.returnMailForm.get('rsn').value;
    }
    let lastBag = this.mailLastBag;
    let registerMail = this.mailRegistered;
    let remarks = this.returnMailForm.get('remarks').value;
    let reason = this.returnMailForm.get('returnReason').value;
    let weightNumber = this.returnMailForm.get('weight').value;
    let weightDisplay = this.returnMailForm.get('weight').value;
    if (registerMail === "1") {
      this.registerMailValue = 'Y'
    }
    else {
      this.registerMailValue = 'N'
    }
    let weightData: any;
    weightData = parseFloat(weightNumber);
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
          this.showErrorMessage('airmail.invalidWeight');
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
      } else if (detailsbup && weightLength == 6) {
        weightData = removedDecimal;
      }
      else {
        this.showErrorMessage('airmail.invalidWeight'); return;
      }
    }

    if (rsn.length < 3) {
      if (rsn.length === 1) {
        rsn = "00" + rsn
      }
      else if (rsn.length === 2) {
        rsn = "0" + rsn
      }
    }
    if (dsn.length < 4) {
      if (dsn.length === 1) {
        dsn = "000" + dsn
      }
      else if (dsn.length === 2) {
        dsn = "00" + dsn
      }
      else if (dsn.length === 3) {
        dsn = "0" + dsn
      }
    }

    if (oe1 === null) {
      this.showErrorStatus("export.input.mailbag.details");
    }

    let mailNumberDetails = oe1.concat(oe2, oe3, destOe1, destOe2, destOe3, category,
      mailType, year, dsn, rsn, lastBag, registerMail, weightData);

    let formBags = this.returnMailForm.getRawValue().confirmReturnArray;
    for (let mailBagNumber of formBags) {
      if (mailNumberDetails === mailBagNumber.mailBag) {
        this.showErrorStatus("export.cannot.add.duplicate.mailbag");
        return;
      } else {
        this.resetFormMessages();
      }
    }

    const request: any = new ReturnMail();
    request.carrierCode = this.returnMailForm.get('carrierCode').value;
    request.houseNumber = mailNumberDetails;
    request.shipmentType = "MAIL"
    request.reasonID = reason;
    request.returnReason = this.reasonCode
    this.acceptanceService.validate(request).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        if (data.data) {
          this.resetFormMessages();

          (<NgcFormArray>this.returnMailForm.controls['confirmReturnArray']).addValue([
            {
              flagSave: false,
              dispatchNumber: dsn,
              receptacleNumber: rsn,
              origin: oe2,
              destination: destOe2,
              mailType: mailType,
              mailWeight: weightDisplay,
              returnReason: this.reasonData,
              returnReason2: reason,
              remarks: remarks,
              mailBag: mailNumberDetails
            }
          ]);
          this.mailDataSaveRequest.push(request);
          this.showTabs = true;

        }
        else {
          this.refreshFormMessages(data);
        }
      }
    }, error => {
      this.showErrorMessage(error);
    });
  }

  onSave() {
    if (!this.mailDataSaveRequest.length) {
      this.showErrorMessage('export.add.atleast.one.mailbag.save');
      return;
    }
    this.acceptanceService.insert(this.mailDataSaveRequest).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.resetFormMessages();
        this.showSuccessStatus('g.operation.successful');
        this.onSearch();
      }
    }, error => {
      this.showErrorMessage(error);
    })
    if (!this.response) {
      this.showErrorMessage('export.add.correct.search.criteria');
      return;
    }
  }

  finalize() {
    let newArray: any = new Array();
    let request: any = (<NgcFormArray>this.returnMailForm.get('pendingReturnArray')).getRawValue();

    for (var element of request) {
      if (element.check) {
        if (element.pendingReason != null) {
          newArray.push(element);
        }
        else {
          this.showErrorMessage('export.reason.mandatory.for.finalize');
          return;
        }

      }
    }
    if (!newArray.length) {
      this.showErrorMessage('export.select.atleast.one.row');
      return;
    }

    this.acceptanceService.updatePendingMailBags(newArray).subscribe(data => {
      if (!this.showResponseErrorMessages(data) && data.data.length) {
        this.showSuccessStatus("DATASAVED001");
        this.onSearch();
      }
    }, error => {
      this.showErrorMessage(error);
    })

  }

  onDelete() {
    let deleteArray = new Array();
    let data: any = (<NgcFormArray>this.returnMailForm.get("confirmReturnArray")).getRawValue();

    for (var element of data) {
      if (element.flagSave) {
        deleteArray.push(element);
        this.mailDataSaveRequest.pop();
      }
      (<NgcFormArray>this.returnMailForm.controls["confirmReturnArray"]).deleteValue(deleteArray);
    }
  }

  appendDispatchNumber() {
    let dispatchNumber = this.returnMailForm.get('dsn').value;
    if (dispatchNumber.length === 1) {
      this.returnMailForm.get('dsn').patchValue('000' + dispatchNumber);
    } else if (dispatchNumber.length === 2) {
      this.returnMailForm.get('dsn').patchValue('00' + dispatchNumber);
    } else if (dispatchNumber.length === 3) {
      this.returnMailForm.get('dsn').patchValue('0' + dispatchNumber);
    }
  }

  appendReceptacleNumber() {
    let receptacleNumber = this.returnMailForm.get('rsn').value;
    if (receptacleNumber.length === 1) {
      this.returnMailForm.get('rsn').patchValue('00' + receptacleNumber);
    } else if (receptacleNumber.length === 2) {
      this.returnMailForm.get('rsn').patchValue('0' + receptacleNumber);
    }
  }

  getDesc(item) {
    this.reasonData = item.desc;
    this.reasonCode = item.parameter1;
  }

  changeRSNtoPieces() {
    let detailsbup = this.returnMailForm.get("detailsBUP").value;
    if (detailsbup) {
      this.bupCheck = true;
    } else {
      this.bupCheck = false;
    }
  }
}



