import { element } from 'protractor';
import { Component, NgZone, ElementRef, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormArrayName } from '@angular/forms';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcWindowComponent, NgcFormArray, CellsRendererStyle, PageConfiguration } from 'ngc-framework';
import { ImportService } from '../../import.service';
import { MailBreakdownData, MailBreakdownSearchResult } from '../../import.sharedmodel';

@Component({
  selector: 'app-import-mail-breakdown',
  templateUrl: './import-mail-breakdown.component.html',
  styleUrls: ['./import-mail-breakdown.component.scss']
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

export class ImportMailBreakdownComponent extends NgcPage {

  [x: string]: any;
  constructor(
    appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private importService: ImportService, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    if (this.importService.dataFromImportToMail) {
      this.mailBreakdownWorklistForm.get('searchFlight.flightKey').patchValue(this.importService.dataFromImportToMail.flightKey);
      this.mailBreakdownWorklistForm.get('searchFlight.flightDate').patchValue(this.importService.dataFromImportToMail.flightDate);
      this.searchFlight();
    }
  }

  @ViewChild('mailBreakdownWindow') mailBreakdownWindow: NgcWindowComponent;

  response: any;
  showTable: boolean = false;

  private mailBreakdownWorklistForm: NgcFormGroup = new NgcFormGroup({
    searchFlight: new NgcFormGroup({
      flightKey: new NgcFormControl(),
      flightDate: new NgcFormControl(),
      flightId: new NgcFormControl(),
      dispatchNumber: new NgcFormControl(),
      uldNumber: new NgcFormControl()
    }),
    shipments: new NgcFormArray([]),
    workingListShipmentInfo: new NgcFormArray([])
  });

  searchFlight() {
    let request: any = new MailBreakdownData();
    request = this.mailBreakdownWorklistForm.get('searchFlight').value;
    this.importService.searchBreakdown(request).subscribe(data => {
      this.response = data.data;
      if (this.response) {
        this.resetFormMessages();
        this.showTable = true;
        this.response.workingListShipmentInfo.forEach(element => {
          let totalPieces: number = 0;
          let totalweight: number = 0;
          element.shipments.forEach(element1 => {
            totalPieces = totalPieces + element1.individualPieces;
            totalweight = totalweight + element1.individualWeight;
          });
          element.shpPieces = totalPieces;
          element.shpWeight = totalweight;
        })
        // this.response.workingListShipmentInfo.forEach(element => {
        //   element['check'] = false;
        //   if (element.transferCarrierFrom) {
        //     element.outgoingCarrier = element.transferCarrierFrom;
        //   }
        // })
        // this.response.shipments = this.response.shipments.map(obj => {

        //   if (obj.originOfficeExchange) {
        //     obj.originExchange = obj.originOfficeExchange.substring(2, 5);
        //   }
        //   if (obj.destinationOfficeExchange) {
        //     obj.destinationExchange = obj.destinationOfficeExchange.substring(2, 5);
        //   }

        //   let sumPieces = 0;
        //   let sumWeight = 0;
        //   sumPieces = obj.individualPieces + sumPieces;
        //   sumWeight = obj.individualWeight + sumWeight;

        //   if (obj.outgoingCarrier === "**") {
        //     obj.outgoingCarrier = "All";
        //   }
        //   return obj;
        // })
        this.mailBreakdownWorklistForm.get(['workingListShipmentInfo']).patchValue(this.response.workingListShipmentInfo);
      } else {
        this.showTable = false;
        this.refreshFormMessages(data);
      }
    }, (error) => {
      this.showErrorStatus("imp.err121");
    });
  }

  clickMailBreakdown(event) {
    let request: MailBreakdownSearchResult = new MailBreakdownSearchResult();
    // request.flightKey = this.response.flightKey;
    // request.flightDate = this.response.flightDate;
    // request.flightId = this.response.flightId;
    // let data: any = (<NgcFormArray>this.mailBreakdownWorklistForm.get('searchFlight')).getRawValue();
    // request.shipments = [];
    // request.shipments.push(data);

    var dataToSend = {
      flightKey: this.response.flightKey,
      flightDate: this.response.flightDate,
      flightId: this.response.flightId
    }

    this.importService.dataFromImportToMail = dataToSend;
    this.navigateTo(this.router, '/import/mailbag', dataToSend);

  }

  public onBack(event) {
    this.navigateBack(this.mailBreakdownWorklistForm.getRawValue());
  }


}
