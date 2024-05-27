import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcFormControl,
  NgcButtonComponent, NgcUtility, PageConfiguration, NgcInputComponent
} from 'ngc-framework';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InboundMailDocument, CaptureImportDocumentSearchRequest } from '../../import.sharedmodel';
import { Flight } from '../../../export/export.sharedmodel';
import { ImportService } from '../../import.service';
import { error, element } from 'protractor';

@Component({
  selector: 'ngc-capture-import-document',
  templateUrl: './capture-import-document.component.html',
  styleUrls: ['./capture-import-document.component.scss']
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
export class CaptureImportDocumentComponent extends NgcPage {
  flightId: any;
  subtypedata: any;
  response: any;
  searchResult: boolean = false;
  deleteArray: any = [];
  totalPieces: any = 0;
  totalWeight: any = 0;
  private captureImportDocForm: NgcFormGroup = new NgcFormGroup({
    searchFlight: new NgcFormGroup({
      flightId: new NgcFormControl(),
      flightKey: new NgcFormControl(),
      flightDate: new NgcFormControl()
    }),
    addMailBagForm: new NgcFormGroup({
      shipmentNumber: new NgcFormControl(),
      piece: new NgcFormControl(),
      weight: new NgcFormControl(),
      breakDownPieces: new NgcFormControl(),
      breakDownWeight: new NgcFormControl(),
      originCountry: new NgcFormControl(),
      originLocation: new NgcFormControl(),
      originCategory: new NgcFormControl(),
      originOfficeExchange: new NgcFormControl(),
      destinationCountry: new NgcFormControl(),
      destinationLocation: new NgcFormControl(),
      destinationCategory: new NgcFormControl(),
      destinationOfficeExchange: new NgcFormControl(),
      mailCategory: new NgcFormControl("A"),
      mailSubType: new NgcFormControl(),
      registered: new NgcFormControl("No"),
      dispatchYear: new NgcFormControl(new Date().getFullYear().toString().substring(3)),
      remarks: new NgcFormControl()
    }),
    remarks: new NgcFormControl(),
    resultData: new NgcFormArray([])
  });
  registeredValue: boolean;

  @ViewChild('shipmentNumber') firstField: NgcInputComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef
    , private activatedRoute: ActivatedRoute, private importService: ImportService) {
    super(appZone, appElement, appContainerElement);

  }

  ngOnInit() {
  }


  searchFlight() {
    let request: any = new CaptureImportDocumentSearchRequest();
    request = this.captureImportDocForm.get('searchFlight').value;
    this.importService.getImportDocument(request).subscribe(data => {
      this.response = data.data;
      this.totalPieces = 0;
      this.totalWeight = 0;
      if (this.response) {
        this.resetFormMessages();
        this.flightId = this.response.flightId
        this.searchResult = true;
        if (this.response.mailsBags && this.response.mailsBags.length > 0) {
          this.response.mailsBags = this.response.mailsBags.map(obj => {
            this.totalPieces += obj.piece;
            this.totalWeight += obj.weight;
            this.totalWeight = Number.parseFloat(NgcUtility.getDisplayWeight(this.totalWeight));
            if (obj.originOfficeExchange) {
              obj.originCountry = obj.originOfficeExchange.substring(0, 2);
              obj.originLocation = obj.originOfficeExchange.substring(2, 5);
              obj.originCategory = obj.originOfficeExchange.substring(5);
            }
            if (obj.destinationOfficeExchange) {
              obj.destinationCountry = obj.destinationOfficeExchange.substring(0, 2);
              obj.destinationLocation = obj.destinationOfficeExchange.substring(2, 5);
              obj.destinationCategory = obj.destinationOfficeExchange.substring(5);
            }
            obj.dispatchYear = obj.shipmentNumber.substring(15, 16);
            if (obj.shipmentNumber.toString().length > 4 && obj.shipmentNumber.toString().length == 20) {
              obj.shipmentNumber = obj.shipmentNumber.substring(16, 20);
            }
            return obj;
          })
          this.response.mailsBags.forEach(element => {
            element['check'] = false;
          });
          this.captureImportDocForm.get(['resultData']).patchValue(this.response.mailsBags);
        } else {
          this.captureImportDocForm.get(['resultData']).patchValue(new Array());
        }



      } else {
        this.refreshFormMessages(data);
        this.searchResult = false;
      }

    }, error => {
      this.showErrorMessage('server.is.down');
    });

  }
  public afterFocus() {
    setTimeout(() => {
      this.firstField.focus();
    }, 1000);
  }

  onUpdate() {
    let flagDataArray: any = [];
    let request: any = new InboundMailDocument();
    request.flightId = this.flightId;
    request.mailsBags = [];
    request.mailsBags = (<NgcFormArray>this.captureImportDocForm.get(['resultData'])).getRawValue();
    request.mailsBags = request.mailsBags.concat(this.deleteArray);
    request.mailsBags.map(element => {
      if (element.flagCRUD === 'C' || element.flagCRUD === 'D' || element.flagCRUD === 'U') {

        // element.weight = element.weight * 10;
        flagDataArray.push(element);
      }
      if (element.flagCRUD === 'C') {
        if (element.registered === true) {
          element.registered = 1;
        }
        else if (element.registered === false) {
          element.registered = 0;
        }

        element.shipmentNumber = element.originOfficeExchange + element.destinationOfficeExchange + element.mailCategory + element.mailSubCategory + element.dispatchYear + element.shipmentNumber
      }
    })
    if (!flagDataArray.length) {
      this.showErrorMessage('add.bag.first.save.record');
      return;
    }
    this.importService.update(request).subscribe(data => {
      if (data.data) {
        this.deleteArray = [];
        this.showSuccessStatus("g.completed.successfully");
        this.searchFlight();
        this.captureImportDocForm.get('addMailBagForm').reset();
        this.captureImportDocForm.get('addMailBagForm.mailCategory').patchValue('A');
        this.captureImportDocForm.get('addMailBagForm.dispatchYear').patchValue(new Date().getFullYear().toString().substring(3));
        this.captureImportDocForm.get('addMailBagForm.registered').patchValue('No');
        // this.registeredValue = null;
        this.subtypedata = null;
        this.captureImportDocForm.get('remarks').reset();


      } else {
        this.deleteArray = [];
        this.refreshFormMessages(data);
      }
    })
  }

  onLinkClick(event, index) {
    (<NgcFormArray>this.captureImportDocForm.controls["resultData"]).markAsDeletedAt(index);
  }

  onAdd() {
    let weightData: any
    let captureData = this.captureImportDocForm.get('addMailBagForm').value;

    if (!this.registeredValue && captureData.registered === 'No') {
      this.registeredValue = false;
    }
    captureData.mailSubCategory = this.subtypedata;
    captureData.registered = this.registeredValue;
    captureData.dispatchYear = parseInt(captureData.dispatchYear);
    if (captureData.shipmentNumber.length < 4) {
      if (captureData.shipmentNumber.length === 1) {
        captureData.shipmentNumber = "000" + captureData.shipmentNumber
      }
      else if (captureData.shipmentNumber.length === 2) {
        captureData.shipmentNumber = "00" + captureData.shipmentNumber
      }
      else if (captureData.shipmentNumber.length === 3) {
        captureData.shipmentNumber = "0" + captureData.shipmentNumber
      }
    }
    if (!captureData.weight) {
      this.showErrorMessage('weight.cannot.empty');
      return;
    }
    let tableData: any = (<NgcFormArray>this.captureImportDocForm.get("resultData")).getRawValue();

    captureData.originOfficeExchange = captureData.originCountry + captureData.originLocation + captureData.originCategory;
    if (NgcUtility.isTenantCityOrAirport(captureData.originLocation)) {
      this.showErrorStatus("imp.err118");
      return;
    }
    captureData.destinationOfficeExchange = captureData.destinationCountry + captureData.destinationLocation + captureData.destinationCategory;
    captureData.registered = this.registeredValue;
    let dnNumber: any = captureData.shipmentNumber;
    captureData.shipmentNumber = Number(captureData.shipmentNumber);
    let mailbagNumberCheck = captureData.originCountry + captureData.originLocation + captureData.originCategory + captureData.destinationCountry + captureData.destinationLocation + captureData.destinationCategory + captureData.mailCategory + captureData.mailSubCategory + captureData.dispatchYear + captureData.shipmentNumber;

    for (let mailBagNumber of tableData) {
      if (mailBagNumber.dispatchYear == null) {
        this.showErrorStatus("imp.err119");
      }
      mailBagNumber.shipmentNumber = mailBagNumber.originOfficeExchange + mailBagNumber.destinationOfficeExchange + mailBagNumber.mailCategory + mailBagNumber.mailSubCategory + mailBagNumber.dispatchYear + mailBagNumber.shipmentNumber;
      if (mailbagNumberCheck == mailBagNumber.shipmentNumber) {
        this.showErrorStatus("imp.err120");
        return;
      }

    }

    this.importService.validate(captureData).subscribe(data => {
      this.refreshFormMessages(data);
      if (data.data) {
        (<NgcFormArray>this.captureImportDocForm.get("resultData")).addValue([
          {
            shipmentNumber: dnNumber,
            piece: captureData.piece,
            weight: captureData.weight,
            originOfficeExchange: captureData.originCountry + captureData.originLocation + captureData.originCategory,
            destinationOfficeExchange: captureData.destinationCountry + captureData.destinationLocation + captureData.destinationCategory,
            mailCategory: captureData.mailCategory,
            mailSubCategory: this.subtypedata,
            registered: this.registeredValue,
            dispatchYear: captureData.dispatchYear,
            remarks: this.captureImportDocForm.get('remarks').value,

          }
        ]);
      }
    });
  }

  registeredData(item) {
    if (item.code === 'Yes')
      this.registeredValue = true;
    else if (item.code === 'No')
      this.registeredValue = false;
  }

  getCountryCodeOrigin(item) {
    this.captureImportDocForm.get('addMailBagForm.originCountry').patchValue(item.desc);
  }

  getCountryCodeDestination(item) {
    this.captureImportDocForm.get('addMailBagForm.destinationCountry').patchValue(item.desc);
  }

  getSUbType(item) {
    this.subtypedata = item.code;
  }

  public onBack(event) {
    this.navigateBack(this.captureImportDocForm.getRawValue());
  }
  appendDsn() {
    let dispatchNumber = this.captureImportDocForm.get("addMailBagForm.shipmentNumber").value
    if (dispatchNumber.length === 1) {
      this.captureImportDocForm.get("addMailBagForm.shipmentNumber").patchValue('000' + dispatchNumber);
    } else if (dispatchNumber.length === 2) {
      this.captureImportDocForm.get("addMailBagForm.shipmentNumber").patchValue('00' + dispatchNumber);
    } else if (dispatchNumber.length === 3) {
      this.captureImportDocForm.get("addMailBagForm.shipmentNumber").patchValue('0' + dispatchNumber);
    }
  }

}


