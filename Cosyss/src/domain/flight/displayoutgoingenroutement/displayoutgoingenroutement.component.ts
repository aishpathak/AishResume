// Angular
import { Component, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
// Application
import { NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcUtility, PageConfiguration } from 'ngc-framework';
import { FlightEnroutementRequest } from '../flight.sharedmodel';
// Services
import { FlightService } from '../flight.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngc-outgoingenroutement',
  templateUrl: './displayoutgoingenroutement.component.html',
  styleUrls: ['./displayoutgoingenroutement.component.scss']
})
/**
      * Display outgoing enroutement Component on searchs on the carrier code and destination retrive enroutements .
      *
      * @param insertData
      * @param index
*/
@PageConfiguration({
  trackInit: true,
  //callNgOnInitOnClear: false,
  //restorePageOnBack: false,
  autoBackNavigation: true
})

export class DisplayoutgoingenroutementComponent extends NgcPage {
  isDisplayOutGoingTableFlg: boolean;
  enroutementDetails: any;
  private enroutementForm: NgcFormGroup = new NgcFormGroup
    ({
      carrierCode: new NgcFormControl(),
      finalDestination: new NgcFormControl(''),
      resultList: new NgcFormArray(
        [
          new NgcFormGroup({
            carrierCode: new NgcFormControl(),
            periodFrom: new NgcFormControl(),
            periodTo: new NgcFormControl(),
            via: new NgcFormControl(),
            serviceType: new NgcFormControl(),
            transfer: new NgcFormControl(),
          })
        ]
      )
    });
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private flightService: FlightService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  /**
    * On Initialization
    */
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    super.ngOnInit();
    //  this.flightService.previousURL = this.flightService.currentURL;
    //  if (!this.flightService.currentURL) {
    //  this.flightService.currentURL = this.router.url;
    //  }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    const transferData = this.getNavigateData(this.activatedRoute);
    if (transferData === null) {
      return;
    }


    //Case 1 : When No normalScreenSearchResponse : From Both  Special screen's Button and cancel
    if (this.flightService.normalScreenSearchResponse === undefined) {
      this.enroutementForm.get('carrierCode').setValue(this.flightService.carrierCodeLastEnteredForInNormalScreen);
      this.enroutementForm.get('finalDestination').setValue(this.flightService.destinationLastEnteredForInNormalScreen);
      this.isDisplayOutGoingTableFlg = false;
    }
    //Case 2 : When  normalScreenSearchResponse : navigatedBackfrom Special screen's Button
    else if (!(transferData.destinationLastEnteredForInNormalScreen === '' || transferData.destinationLastEnteredForInNormalScreen === undefined)) {
      this.enroutementForm.get('carrierCode').setValue(transferData.carrierCodeLastEnteredForInNormalScreen);
      this.enroutementForm.get('finalDestination').setValue(transferData.destinationLastEnteredForInNormalScreen);
      (<NgcFormArray>this.enroutementForm.controls['resultList']).patchValue(this.flightService.normalScreenSearchResponse);
      this.isDisplayOutGoingTableFlg = true;
    }
    //Case 3 : When  normalScreenSearchResponse : navigatedBackfrom Special screen's cancel
    else {
      this.enroutementForm.get('carrierCode').setValue(this.flightService.carrierCodeLastEnteredForInNormalScreen);
      this.enroutementForm.get('finalDestination').setValue(this.flightService.destinationLastEnteredForInNormalScreen);
      (<NgcFormArray>this.enroutementForm.controls['resultList']).patchValue(this.flightService.normalScreenSearchResponse);
      this.isDisplayOutGoingTableFlg = true;

    }

  }

  /**
  * On search we are displaying out going enroutement flights
  *
  * @param event Event
  */
  public onSearch() {
    const enroutementRequest: FlightEnroutementRequest = new FlightEnroutementRequest();
    enroutementRequest.finalDestination = this.enroutementForm.get('finalDestination').value;

    //commented due to BUG-2287
    // if (this.enroutementForm.get('carrierCode').value === null && this.enroutementForm.get('finalDestination').value === '') {
    //   this.showErrorStatus('flight.no.record');
    //   return;
    // }

    if (enroutementRequest.finalDestination === '') {
      this.showErrorStatus('flight.destination.mandatory');
    } else {
      if (this.enroutementForm.get('carrierCode').value === null || this.enroutementForm.get('carrierCode').value === '') {
        if (this.getUserProfile().userRestrictedAirlines !== null) {
          enroutementRequest.restrictedcarrier = this.getUserProfile().userRestrictedAirlines;
        }
      }
      enroutementRequest.carrierCode = this.enroutementForm.get('carrierCode').value;
      enroutementRequest.finalDestination = this.enroutementForm.get('finalDestination').value;
      this.flightService.getEnroutementDetails(enroutementRequest).subscribe(data => {
        if (!this.showResponseErrorMessages(data)) {
          this.enroutementDetails = data;
          this.resetFormMessages();
          if (this.enroutementDetails.data != null) {
            // this.carrierCodeLastSearchedForInNormalScreen = enroutementRequest.carrierCode;
            // this.destinationLastSearchedForInNormalScreen  = enroutementRequest.finalDestination;
            this.flightService.normalScreenSearchResponse = this.enroutementDetails.data;
            console.log(JSON.stringify(this.enroutementDetails.data));
            this.isDisplayOutGoingTableFlg = true;
            this.enroutementDetails.data.forEach(enr => {
              enr.periodFrom = enr.periodFrom //NgcUtility.toDateFromLocalDate(enr.periodFrom);
              enr.periodTo = enr.periodTo //NgcUtility.toDateFromLocalDate(enr.periodTo);
            });
          } else {
            this.isDisplayOutGoingTableFlg = false;
            this.showErrorStatus(this.enroutementDetails.messageList[0].message);
          }
          this.bindDataToTable();
        }
      },
        error => { this.showErrorStatus('Error:' + error); });
    }
  }


  /**
  * Binding data to data table
  * @param event Event
  */
  bindDataToTable() {
    (<NgcFormArray>this.enroutementForm.controls['resultList']).patchValue(this.enroutementDetails.data);
  }

  /**
  * Navigating link  to Special enourtement
  *
  * @param event Event
  */
  public navigateToSpecailEnroutment() {

    // const enroutementRequest: FlightEnroutementCancelObject = new FlightEnroutementCancelObject();
    // enroutementRequest.carrierCode = this.enroutementForm.get('carrierCode').value;
    // enroutementRequest.finalDestination = this.enroutementForm.get('finalDestination').value;
    // enroutementRequest.normalScreenResponse = this.enroutementDetails.data;

    //   this.navigateTo(this.router, '/flight/specialenroutement', enroutementRequest);

    if (this.flightService.normalScreenSearchResponse === undefined) {
      this.flightService.carrierCodeLastEnteredForInNormalScreen = this.enroutementForm.get('carrierCode').value;
      this.flightService.destinationLastEnteredForInNormalScreen = this.enroutementForm.get('finalDestination').value;
      this.navigateTo(this.router, '/flight/specialenroutement', this.flightService);
    } else {
      this.flightService.carrierCodeLastEnteredForInNormalScreen = this.enroutementForm.get('carrierCode').value;
      this.flightService.destinationLastEnteredForInNormalScreen = this.enroutementForm.get('finalDestination').value;
      //this.flightService.normalScreenSearchResponse              = this.enroutementDetails.data;
      //this.flightService.carrierLastEnteredForInSpecialScreen    = this.carrierLastSearchedForInSpecialScreen;
      this.navigateTo(this.router, '/flight/specialenroutement', this.flightService);
    }
  }

  clearFormData() {
    this.enroutementForm.get('carrierCode').reset();
    this.enroutementForm.get('finalDestination').reset();
    this.flightService.normalScreenSearchResponse = undefined
    this.isDisplayOutGoingTableFlg = false;
  }

  setValueOnCancelPress() {
    //this.flightService.carrierCodeLastEnteredForInNormalScreen =  this.enroutementForm.get('carrierCode').value;
    //this.flightService.destinationLastEnteredForInNormalScreen =  this.enroutementForm.get('finalDestination').value;  
  }

}
